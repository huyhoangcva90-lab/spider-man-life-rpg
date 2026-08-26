export class CombatEngine {
  constructor(content, damageEngine) {
    this.content = content;
    this.damage = damageEngine;
  }

  enemyFor(state) {
    const quest = this.content.quests.get(state.quest.activeQuestId);
    const id = quest.enemyIds[Math.min(state.battle.encounterIndex, quest.enemyIds.length - 1)];
    return this.content.enemies.get(id);
  }

  scaledMaxHp(enemy, difficultyName) {
    return Math.round(enemy.hp * (this.content.difficulties[difficultyName]?.enemyHp || 1));
  }

  perform(actionId, state, options = {}) {
    const action = this.content.actions.get(actionId);
    const enemy = this.enemyFor(state);
    if (!action || !enemy) return { blocked: true, reason: 'CONTENT MISSING' };
    if (state.battle.storyComplete) return { blocked: true, reason: 'CHAPTER CLEAR // START NEXT PATROL' };
    if ((state.battle.cooldowns[action.slot] || 0) > 0) return { blocked: true, reason: `COOLDOWN ${state.battle.cooldowns[action.slot]}` };
    if (action.energyCost && state.progression.webEnergy < action.energyCost) return { blocked: true, reason: 'NOT ENOUGH WEB ENERGY' };
    if (action.ultimateCost && state.progression.ultimate < action.ultimateCost) return { blocked: true, reason: 'ULTIMATE NOT READY' };
    if (action.charges && state.battle.charges.gadget <= 0) return { blocked: true, reason: 'NO GADGET CHARGES' };

    this.tick(state);
    const difficulty = this.content.difficulties[state.settings.difficulty] || this.content.difficulties.NORMAL;
    const damageResult = this.damage.resolve({ action, enemy, bonus: options.bonus || 1, difficulty });
    const finisher = action.type === 'ULTIMATE' && enemy.finisherEligible && state.battle.enemyStagger >= enemy.staggerMax;
    if (finisher) damageResult.damage = Math.max(damageResult.damage, state.battle.enemyHp);
    state.battle.enemyHp = Math.max(0, state.battle.enemyHp - damageResult.damage);
    state.battle.enemyStagger = Math.min(enemy.staggerMax, state.battle.enemyStagger + damageResult.stagger);
    state.progression.webEnergy = Math.max(0, state.progression.webEnergy - action.energyCost);
    state.progression.ultimate = action.type === 'ULTIMATE' ? 0 : Math.min(100, state.progression.ultimate + 12 + Math.round(damageResult.damage / 8));
    if (action.cooldownTurns) state.battle.cooldowns[action.slot] = action.cooldownTurns;
    if (action.charges) state.battle.charges.gadget = Math.max(0, state.battle.charges.gadget - 1);
    state.battle.turn += 1;
    if (state.battle.enemyStagger >= enemy.staggerMax) state.progression.ultimate = 100;

    const result = { action: action.slot, actionId, animation: action.animation, comicText: action.comicText, sfx: action.sfx, finisher, ...damageResult };
    if (state.battle.enemyHp > 0) this.enemyTurn(state, enemy, difficulty, result);
    const phaseBefore = state.battle.phase;
    state.battle.phase = this.phaseFor(enemy, state.battle.enemyHp, state.settings.difficulty);
    result.phaseChanged = state.battle.phase !== phaseBefore ? { from: phaseBefore, to: state.battle.phase } : null;
    return result;
  }

  enemyTurn(state, enemy, difficulty, result) {
    if (state.battle.turn % 2 !== 0) return;
    if (state.battle.turn % 6 === 0) {
      result.perfectDodge = true;
      result.animation = 'dodge';
      state.progression.ultimate = Math.min(100, state.progression.ultimate + 18);
      return;
    }
    const incoming = Math.max(1, Math.round(enemy.power * difficulty.enemyDamage));
    state.progression.hp = Math.max(0, state.progression.hp - incoming);
    result.heroDamage = incoming;
    if (state.progression.hp === 0) {
      result.heroKo = true;
      const hero = this.content.heroes.get(state.player.activeHeroId);
      state.progression.hp = Math.round(hero.maxHp * 0.6);
    }
  }

  phaseFor(enemy, hp, difficultyName = 'NORMAL') {
    if (!enemy.phases) return 1;
    const ratio = hp / this.scaledMaxHp(enemy, difficultyName);
    let phase = 1;
    enemy.phases.forEach((definition, index) => { if (ratio <= definition.hpBelow) phase = index + 1; });
    return Math.min(enemy.phases.length, phase);
  }

  tick(state) {
    Object.keys(state.battle.cooldowns).forEach((key) => { state.battle.cooldowns[key] = Math.max(0, state.battle.cooldowns[key] - 1); });
    const hero = this.content.heroes.get(state.player.activeHeroId);
    state.progression.webEnergy = Math.min(hero.maxWebEnergy, state.progression.webEnergy + 7);
  }
}

