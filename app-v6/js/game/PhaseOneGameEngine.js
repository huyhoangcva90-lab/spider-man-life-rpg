import { PHASE_ONE_DATA } from './data/phaseOneData.js';
import { GameSaveManager, GAME_SAVE_VERSION } from './GameSaveManager.js';
import { DamageEngine } from './DamageEngine.js';
import { RewardEngine } from './RewardEngine.js';
import { QuestEngine } from './QuestEngine.js';
import { CombatEngine } from './CombatEngine.js';
import { GAME_EVENTS } from './GameEvents.js';

export class PhaseOneGameEngine {
  constructor(eventBus, options = {}) {
    this.bus = eventBus;
    this.data = PHASE_ONE_DATA;
    this.content = this.data.content;
    this.saveManager = new GameSaveManager(options.storage || window.localStorage);
    this.rewardEngine = new RewardEngine(this.content.rewards);
    this.questEngine = new QuestEngine();
    this.combatEngine = new CombatEngine(this.content, new DamageEngine());
    const defaults = this.defaults();
    this.state = this.saveManager.load(defaults, (legacy) => this.migrateLegacy(legacy, defaults));
    this.repairState();
  }

  defaults() {
    const hero = this.content.heroes.get('peter-classic');
    const main = this.content.quests.get('main-001');
    const firstEnemy = this.content.enemies.get(main.enemyIds[0]);
    return {
      saveVersion: GAME_SAVE_VERSION,
      updatedAt: Date.now(),
      player: { activeHeroId: hero.id, activeAllyId: 'miles-morales' },
      quest: { activeQuestId: main.id, activeChapterId: main.chapterId, completedQuestIds: [], completedExternalIds: [] },
      city: { districtId: main.districtId, zoneId: main.zoneId, weather: 'LIGHT RAIN', timeOfDay: 'NIGHT', activeEvents: [] },
      battle: {
        status: 'ACTIVE', encounterIndex: 0, enemyHp: firstEnemy.hp, enemyStagger: 0, turn: 0, phase: 1,
        cooldowns: { web: 0, gadget: 0, ally: 0 }, charges: { gadget: 3 },
        combatLog: ['PATROL STARTED // MANHATTAN ROOFTOP'], storyComplete: false
      },
      progression: { level: 1, rank: hero.rank, xp: 0, xpToNext: 100, hp: hero.maxHp, webEnergy: hero.maxWebEnergy, coins: 0, streak: 0, ultimate: 0, skillPoints: 0 },
      daily: { date: this.localDay(), completed: 0, claimed: false, metrics: { WEB_USED: 0, ELITE_DEFEATED: 0 } },
      inventory: {},
      allyAffinity: { 'miles-morales': 0 },
      defeated: [],
      settings: { difficulty: 'NORMAL', music: true, sfx: true, volume: 0.8, reduceMotion: false, screenShake: true, comicText: true, autoCombat: false, combatSpeed: 1 }
    };
  }

  migrateLegacy(legacy, base) {
    const next = structuredClone(base);
    const hero = legacy.hero || {};
    Object.assign(next.progression, hero);
    Object.assign(next.battle, {
      encounterIndex: legacy.encounterIndex ?? 0,
      enemyHp: legacy.enemyHp ?? next.battle.enemyHp,
      enemyStagger: legacy.enemyStagger ?? 0,
      turn: legacy.turn ?? 0,
      phase: legacy.phase ?? 1,
      cooldowns: { ...next.battle.cooldowns, ...(legacy.cooldowns || {}) },
      charges: { ...next.battle.charges, ...(legacy.charges || {}) },
      combatLog: legacy.combatLog || next.battle.combatLog,
      storyComplete: Boolean(legacy.storyComplete)
    });
    next.quest.completedExternalIds = [...(legacy.completedEntryIds || [])];
    next.daily = { ...next.daily, ...(legacy.daily || {}) };
    next.defeated = [...(legacy.defeated || [])];
    Object.entries(legacy.inventory || {}).forEach(([name, count]) => {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      next.inventory[id] = { name, count: Number(count) || 0, unique: false };
    });
    return next;
  }

  repairState() {
    if (this.state.daily.date !== this.localDay()) this.state.daily = { date: this.localDay(), completed: 0, claimed: false, metrics: { WEB_USED: 0, ELITE_DEFEATED: 0 } };
    this.state.progression.ultimate = Math.max(0, Math.min(100, this.state.progression.ultimate));
    Object.keys(this.state.battle.cooldowns).forEach((key) => { this.state.battle.cooldowns[key] = Math.max(0, this.state.battle.cooldowns[key]); });
    const enemy = this.enemyDefinition();
    const maxHp = this.combatEngine.scaledMaxHp(enemy, this.state.settings.difficulty);
    this.state.battle.enemyHp = Math.max(0, Math.min(maxHp, this.state.battle.enemyHp));
  }

  enemyDefinition() { return this.combatEngine.enemyFor(this.state); }

  enemy() {
    const enemy = this.enemyDefinition();
    return {
      ...enemy,
      maxHp: this.combatEngine.scaledMaxHp(enemy, this.state.settings.difficulty),
      attack: enemy.power,
      tier: enemy.displayTier || enemy.tier,
      weakness: enemy.weakness.join(' / ') || 'NONE',
      resistance: enemy.resistance.join(' / ') || 'NONE'
    };
  }

  snapshot() {
    const inventory = Object.fromEntries(Object.values(this.state.inventory).map((item) => [item.name, item.count]));
    return structuredClone({
      ...this.state,
      hero: this.state.progression,
      encounterIndex: this.state.battle.encounterIndex,
      enemyHp: this.state.battle.enemyHp,
      enemyStagger: this.state.battle.enemyStagger,
      turn: this.state.battle.turn,
      phase: this.state.battle.phase,
      cooldowns: this.state.battle.cooldowns,
      charges: this.state.battle.charges,
      combatLog: this.state.battle.combatLog,
      storyComplete: this.state.battle.storyComplete,
      completedEntryIds: this.state.quest.completedExternalIds,
      inventory,
      data: this.data,
      enemy: this.enemy()
    });
  }

  completeRealQuest(entry) {
    const questEvent = this.questEngine.acceptCompletion(entry, this.state, this.localDay());
    if (!questEvent) return null;
    this.bus.emit(GAME_EVENTS.QUEST_COMPLETED, questEvent);
    let result = this.performActionById(questEvent.actionId, { quest: questEvent.title, bonus: 1.35, deferCommit: true });
    if (result.blocked && !this.state.battle.storyComplete) result = this.performActionById('basic-combo', { quest: questEvent.title, bonus: 1.35, deferCommit: true });
    result.quest = questEvent;
    result.questReward = this.applyReward(questEvent.rewardId);
    if (this.state.daily.completed >= 3 && !this.state.daily.claimed) {
      this.state.daily.claimed = true;
      result.dailyReward = this.applyReward('daily-three-clear');
      this.log('DAILY QUEST CLEAR // FRIENDLY NEIGHBORHOOD');
    }
    this.log(`QUEST COMPLETE // ${questEvent.title.toUpperCase()}`);
    this.commit(result);
    return result;
  }

  performAction(slot, options = {}) {
    const action = this.data.actions[slot];
    return action ? this.performActionById(action.id, options) : { blocked: true, reason: 'UNKNOWN ACTION' };
  }

  performActionById(actionId, options = {}) {
    this.bus.emit(GAME_EVENTS.ATTACK_STARTED, { actionId });
    const previousUltimate = this.state.progression.ultimate;
    const result = this.combatEngine.perform(actionId, this.state, options);
    if (result.blocked) return result;

    const action = this.content.actions.get(actionId);
    if (action.slot === 'web') this.state.daily.metrics.WEB_USED = (this.state.daily.metrics.WEB_USED || 0) + 1;
    this.log(`${action.label}: ${result.damage} DMG${result.weaknessMatch ? ' // WEAKNESS!' : result.resisted ? ' // RESISTED' : ''}`);
    this.bus.emit(GAME_EVENTS.HIT_CONFIRMED, result);
    this.bus.emit(GAME_EVENTS.DAMAGE_APPLIED, result);
    this.bus.emit(GAME_EVENTS.SFX_REQUESTED, { id: result.sfx, actionId });
    this.bus.emit(GAME_EVENTS.VFX_REQUESTED, { actionId, tags: action.tags });
    this.bus.emit(GAME_EVENTS.COMIC_TEXT_REQUESTED, { options: result.comicText, actionId });
    if (action.type === 'ALLY') this.bus.emit(GAME_EVENTS.ALLY_CALLED, result);
    if (action.type === 'ULTIMATE') this.bus.emit(GAME_EVENTS.ULTIMATE_USED, result);
    if (previousUltimate < 100 && this.state.progression.ultimate === 100) this.bus.emit(GAME_EVENTS.ULTIMATE_READY, result);
    if (result.perfectDodge) this.log('SPIDER-SENSE // PERFECT DODGE');
    if (result.heroKo) this.log('HERO DOWN // RECOVERY PROTOCOL');
    if (result.phaseChanged) {
      this.log(`BOSS PHASE ${result.phaseChanged.to}`);
      this.bus.emit(GAME_EVENTS.BOSS_PHASE_CHANGED, result.phaseChanged);
    }
    if (this.state.battle.enemyHp <= 0) result.victory = this.resolveEnemyDefeat();
    if (!options.deferCommit) this.commit(result);
    return result;
  }

  resolveEnemyDefeat() {
    const enemy = this.enemyDefinition();
    const reward = this.applyReward(enemy.rewardId);
    this.state.defeated.push(enemy.id);
    if (enemy.tier === 'ELITE') this.state.daily.metrics.ELITE_DEFEATED += 1;
    this.log(`K.O. ${enemy.name} // REWARD SECURED`);
    this.bus.emit(GAME_EVENTS.ENEMY_DEFEATED, { enemyId: enemy.id, reward });

    const quest = this.content.quests.get(this.state.quest.activeQuestId);
    const bossDefeated = this.state.battle.encounterIndex === quest.enemyIds.length - 1;
    if (bossDefeated) {
      this.state.battle.storyComplete = true;
      this.state.battle.status = 'VICTORY';
      if (!this.state.quest.completedQuestIds.includes(quest.id)) {
        this.state.quest.completedQuestIds.push(quest.id);
        this.applyReward(quest.rewardId);
      }
      this.bus.emit(GAME_EVENTS.BOSS_DEFEATED, { enemyId: enemy.id, reward });
      this.bus.emit(GAME_EVENTS.BATTLE_ENDED, { victory: true });
      return { boss: true, enemy: enemy.name, reward };
    }

    this.state.battle.encounterIndex += 1;
    const next = this.enemyDefinition();
    this.state.battle.enemyHp = this.combatEngine.scaledMaxHp(next, this.state.settings.difficulty);
    this.state.battle.enemyStagger = 0;
    this.state.battle.phase = 1;
    return { boss: false, enemy: enemy.name, next: next.name, reward };
  }

  startNextPatrol() {
    if (!this.state.battle.storyComplete) return false;
    const kept = {
      progression: { ...this.state.progression }, inventory: structuredClone(this.state.inventory), defeated: [...this.state.defeated],
      completedExternalIds: [...this.state.quest.completedExternalIds], daily: structuredClone(this.state.daily), settings: { ...this.state.settings }, allyAffinity: { ...this.state.allyAffinity }
    };
    this.state = this.defaults();
    Object.assign(this.state.progression, kept.progression, { hp: this.data.hero.maxHp, webEnergy: this.data.hero.maxWebEnergy, ultimate: 0 });
    this.state.inventory = kept.inventory;
    this.state.defeated = kept.defeated;
    this.state.quest.completedExternalIds = kept.completedExternalIds;
    this.state.daily = kept.daily;
    this.state.settings = kept.settings;
    this.state.allyAffinity = kept.allyAffinity;
    this.state.battle.enemyHp = this.combatEngine.scaledMaxHp(this.enemyDefinition(), this.state.settings.difficulty);
    this.log('NEW PATROL // THREAT LEVEL UP');
    this.bus.emit(GAME_EVENTS.BATTLE_STARTED, { questId: this.state.quest.activeQuestId });
    this.commit({ nextPatrol: true });
    return true;
  }

  updateSettings(updates) {
    const safe = {};
    if (updates.difficulty && this.content.difficulties[updates.difficulty]) safe.difficulty = updates.difficulty;
    ['music', 'sfx', 'reduceMotion', 'screenShake', 'comicText', 'autoCombat'].forEach((key) => { if (typeof updates[key] === 'boolean') safe[key] = updates[key]; });
    if ([1, 2].includes(Number(updates.combatSpeed))) safe.combatSpeed = Number(updates.combatSpeed);
    if (Number.isFinite(Number(updates.volume))) safe.volume = Math.max(0, Math.min(1, Number(updates.volume)));
    Object.assign(this.state.settings, safe);
    this.commit({ settingsChanged: true });
    this.bus.emit(GAME_EVENTS.SETTINGS_CHANGED, { ...this.state.settings });
    return { ...this.state.settings };
  }

  exportSave() { return this.saveManager.export(this.state); }
  importSave(serialized) { this.state = this.saveManager.import(serialized, this.defaults()); this.repairState(); this.commit({ saveImported: true }); return this.snapshot(); }
  resetSave() { this.saveManager.reset(); this.state = this.defaults(); this.commit({ saveReset: true }); return this.snapshot(); }
  rewardMultiplier() { return this.content.difficulties[this.state.settings.difficulty]?.reward || 1; }
  applyReward(rewardId) {
    const reward = this.rewardEngine.apply(rewardId, this.state, this.rewardMultiplier());
    if (reward.xp) this.bus.emit(GAME_EVENTS.XP_GAINED, { amount: reward.xp, rewardId });
    reward.items?.forEach((item) => this.bus.emit(GAME_EVENTS.ITEM_GAINED, item));
    return reward;
  }
  log(text) { this.state.battle.combatLog.unshift(text); this.state.battle.combatLog = this.state.battle.combatLog.slice(0, 12); }

  commit(result) {
    this.saveManager.save(this.state);
    const payload = { ...result, snapshot: this.snapshot() };
    this.bus.emit(GAME_EVENTS.SAVE_UPDATED, payload);
    this.bus.emit('CAMPAIGN_UPDATED', payload);
    this.bus.emit('RPG_UPDATED', result);
  }

  localDay() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
