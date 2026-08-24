import { PHASE_ONE_DATA } from './data/phaseOneData.js';

const STORAGE_KEY = 'spidey-action-rpg-phase-one-v1';
const ENTRY_ACTION = { WORK: 'attack', NOTION_MISSION: 'web', PLAN: 'gadget', MEETING: 'ally', PERSON: 'ally', ERRAND: 'attack', LEISURE: 'web' };

export class PhaseOneGameEngine {
  constructor(eventBus) {
    this.bus = eventBus;
    this.data = PHASE_ONE_DATA;
    this.state = this.load();
  }

  defaults() {
    return {
      version: 1,
      hero: { level: 1, rank: this.data.hero.rank, xp: 0, xpToNext: 100, hp: this.data.hero.maxHp, webEnergy: this.data.hero.maxWebEnergy, coins: 0, streak: 0, ultimate: 0, skillPoints: 0 },
      encounterIndex: 0,
      enemyHp: this.data.encounter[0].maxHp,
      enemyStagger: 0,
      turn: 0,
      phase: 1,
      cooldowns: { web: 0, gadget: 0, ally: 0 },
      charges: { gadget: 3 },
      completedEntryIds: [],
      daily: { date: this.localDay(), completed: 0, claimed: false },
      inventory: {},
      defeated: [],
      combatLog: ['PATROL STARTED // MANHATTAN ROOFTOP'],
      storyComplete: false
    };
  }

  load() {
    const base = this.defaults();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return base;
      const merged = { ...base, ...saved, hero: { ...base.hero, ...(saved.hero || {}) }, cooldowns: { ...base.cooldowns, ...(saved.cooldowns || {}) }, charges: { ...base.charges, ...(saved.charges || {}) }, daily: { ...base.daily, ...(saved.daily || {}) } };
      if (merged.daily.date !== this.localDay()) merged.daily = { date: this.localDay(), completed: 0 };
      return merged;
    } catch { return base; }
  }

  save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch { /* local game still runs */ } }
  snapshot() { return JSON.parse(JSON.stringify({ ...this.state, data: this.data, enemy: this.enemy() })); }
  enemy() { return this.data.encounter[Math.min(this.state.encounterIndex, this.data.encounter.length - 1)]; }

  completeRealQuest(entry) {
    if (!entry || entry.status !== 'DONE' || this.state.completedEntryIds.includes(entry.id)) return null;
    this.state.completedEntryIds.push(entry.id);
    this.state.daily.completed += 1;
    this.state.hero.streak += 1;
    const action = ENTRY_ACTION[entry.type] || 'attack';
    let result = this.performAction(action, { quest: entry.title, bonus: 1.35, deferCommit: true });
    if (result.blocked && !this.state.storyComplete) result = this.performAction('attack', { quest: entry.title, bonus: 1.35, deferCommit: true });
    this.gainXp(28);
    this.state.hero.coins += 18;
    result.questReward = { xp: 28, coins: 18 };
    if (this.state.daily.completed >= 3 && !this.state.daily.claimed) {
      this.state.daily.claimed = true;
      this.gainXp(60);
      this.state.hero.coins += 35;
      result.dailyReward = { xp: 60, coins: 35 };
      this.log('DAILY QUEST CLEAR // FRIENDLY NEIGHBORHOOD');
    }
    this.log(`QUEST COMPLETE // ${entry.title.toUpperCase()}`);
    this.commit(result);
    return result;
  }

  performAction(actionName, options = {}) {
    const action = this.data.actions[actionName];
    if (!action) return { blocked: true, reason: 'UNKNOWN ACTION' };
    if (this.state.storyComplete) return { blocked: true, reason: 'CHAPTER CLEAR // START NEXT PATROL' };
    if (this.state.cooldowns[actionName] > 0) return { blocked: true, reason: `COOLDOWN ${this.state.cooldowns[actionName]}` };
    if (action.energy && this.state.hero.webEnergy < action.energy) return { blocked: true, reason: 'NOT ENOUGH WEB ENERGY' };
    if (action.ultimateCost && this.state.hero.ultimate < action.ultimateCost) return { blocked: true, reason: 'ULTIMATE NOT READY' };
    if (action.charges && this.state.charges.gadget <= 0) return { blocked: true, reason: 'NO GADGET CHARGES' };

    this.tickCooldowns();
    const enemy = this.enemy();
    const weakness = enemy.weakness === actionName.toUpperCase() || (enemy.weakness === 'WEB' && actionName === 'web') || (enemy.weakness === 'ALLY' && actionName === 'ally');
    const resisted = enemy.resistance === actionName.toUpperCase() || (enemy.resistance === 'MELEE' && actionName === 'attack');
    let damage = Math.round(action.damage * (options.bonus || 1) * (weakness ? 1.5 : 1) * (resisted ? .68 : 1));
    this.state.enemyHp = Math.max(0, this.state.enemyHp - damage);
    this.state.enemyStagger = Math.min(100, this.state.enemyStagger + action.stagger * (weakness ? 1.5 : 1));
    this.state.hero.webEnergy = Math.max(0, this.state.hero.webEnergy - (action.energy || 0));
    this.state.hero.ultimate = actionName === 'ultimate' ? 0 : Math.min(100, this.state.hero.ultimate + 12 + Math.round(damage / 8));
    if (action.cooldown) this.state.cooldowns[actionName] = action.cooldown;
    if (action.charges) this.state.charges.gadget -= 1;
    this.state.turn += 1;
    if (this.state.enemyStagger >= 100) this.state.hero.ultimate = 100;

    const result = { action: actionName, animation: action.animation, damage, weaknessMatch: weakness, resisted, finisher: actionName === 'ultimate', quest: options.quest || null };
    this.log(`${action.label}: ${damage} DMG${weakness ? ' // WEAKNESS!' : resisted ? ' // RESISTED' : ''}`);
    if (this.state.enemyHp <= 0) result.victory = this.resolveEnemyDefeat(enemy);
    else this.enemyTurn(result);
    this.updateBossPhase();
    if (!options.deferCommit) this.commit(result);
    return result;
  }

  enemyTurn(result) {
    if (this.state.turn % 2 !== 0) return;
    const enemy = this.enemy();
    const perfectDodge = this.state.turn % 6 === 0;
    if (perfectDodge) {
      result.perfectDodge = true;
      result.animation = 'dodge';
      this.state.hero.ultimate = Math.min(100, this.state.hero.ultimate + 18);
      this.log('SPIDER-SENSE // PERFECT DODGE');
      return;
    }
    this.state.hero.hp = Math.max(0, this.state.hero.hp - enemy.attack);
    result.heroDamage = enemy.attack;
    if (this.state.hero.hp === 0) {
      result.heroKo = true;
      this.state.hero.hp = Math.round(this.data.hero.maxHp * .6);
      this.log('HERO DOWN // RECOVERY PROTOCOL');
    }
  }

  resolveEnemyDefeat(enemy) {
    this.gainXp(enemy.reward.xp);
    this.state.hero.coins += enemy.reward.coins;
    this.state.inventory[enemy.reward.item] = (this.state.inventory[enemy.reward.item] || 0) + 1;
    this.state.defeated.push(enemy.id);
    this.log(`K.O. ${enemy.name} // +${enemy.reward.xp} XP`);
    const bossDefeated = this.state.encounterIndex === this.data.encounter.length - 1;
    if (bossDefeated) {
      this.state.storyComplete = true;
      this.state.hero.skillPoints += 1;
      return { boss: true, enemy: enemy.name, reward: enemy.reward };
    }
    this.state.encounterIndex += 1;
    const next = this.enemy();
    this.state.enemyHp = next.maxHp;
    this.state.enemyStagger = 0;
    this.state.phase = 1;
    return { boss: false, enemy: enemy.name, next: next.name, reward: enemy.reward };
  }

  startNextPatrol() {
    if (!this.state.storyComplete) return false;
    const keep = { ...this.state.hero, hp: this.data.hero.maxHp, webEnergy: this.data.hero.maxWebEnergy, ultimate: 0 };
    const inventory = { ...this.state.inventory };
    const defeated = [...this.state.defeated];
    this.state = this.defaults();
    this.state.hero = keep;
    this.state.inventory = inventory;
    this.state.defeated = defeated;
    this.log('NEW PATROL // THREAT LEVEL UP');
    this.commit({ nextPatrol: true });
    return true;
  }

  tickCooldowns() { Object.keys(this.state.cooldowns).forEach((key) => { this.state.cooldowns[key] = Math.max(0, this.state.cooldowns[key] - 1); }); this.state.hero.webEnergy = Math.min(this.data.hero.maxWebEnergy, this.state.hero.webEnergy + 7); }
  gainXp(amount) { this.state.hero.xp += amount; while (this.state.hero.xp >= this.state.hero.xpToNext) { this.state.hero.xp -= this.state.hero.xpToNext; this.state.hero.level += 1; this.state.hero.skillPoints += 1; this.state.hero.xpToNext = Math.round(this.state.hero.xpToNext * 1.28); } }
  updateBossPhase() { const enemy = this.enemy(); if (!enemy.phases) return; const ratio = this.state.enemyHp / enemy.maxHp; this.state.phase = ratio <= .33 ? 3 : ratio <= .66 ? 2 : 1; }
  log(text) { this.state.combatLog.unshift(text); this.state.combatLog = this.state.combatLog.slice(0, 10); }
  commit(result) { this.save(); this.bus.emit('CAMPAIGN_UPDATED', { ...result, snapshot: this.snapshot() }); this.bus.emit('RPG_UPDATED', result); }
  localDay() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
}
