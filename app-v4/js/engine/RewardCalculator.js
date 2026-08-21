/* ==========================================================================
   V4 REWARD CALCULATOR ENGINE (PURE FUNCTION)
   ========================================================================== */

import { PRIORITIES } from '../config/constants.js';

export class RewardCalculator {
  /**
   * Pure calculation function for action completion rewards, attribute gains, and boss encounter impact.
   * @param {Object} action - Action dossier object
   * @param {Object} user - User stats object
   * @param {Object} encounter - Active boss encounter state
   * @param {Array} loadout - Array of 5 equipped loadout cards
   * @returns {Object} Complete structured reward breakdown
   */
  static calculateCompletionReward(action, user = {}, encounter = {}, loadout = []) {
    const priorityConfig = PRIORITIES[action.priority] || PRIORITIES.MEDIUM;
    const priorityMult = priorityConfig.xpMultiplier || 1.0;

    const baseXp = action.rewardXp || 100;
    const baseGold = action.rewardGold || 50;
    const baseDamage = action.baseBossDamage || 150;

    // 1. Duration Multiplier (15m = 1.0x, 30m = 1.15x, 45m = 1.30x, 60m = 1.45x)
    const minutes = Number(action.estimatedMinutes) || 25;
    const durationMult = Math.max(1.0, 1.0 + (minutes - 15) * 0.01);

    // 2. Domain Match Bonus
    const actionDomain = action.domain || action.category || 'Engineering';
    const isWeaknessMatch = encounter.weaknessDomain && encounter.weaknessDomain.toLowerCase() === actionDomain.toLowerCase();
    const isLoadoutDomainMatch = loadout.some(item => item.modifiers && item.modifiers.domain && item.modifiers.domain.toLowerCase() === actionDomain.toLowerCase());
    
    let domainMatchMult = 1.0;
    if (isWeaknessMatch) domainMatchMult += 0.15;
    if (isLoadoutDomainMatch) domainMatchMult += 0.10;

    // 3. Loadout Modifiers
    let xpLoadoutMod = 1.0;
    let goldLoadoutMod = 1.0;
    let damageLoadoutMod = 1.0;
    let flatArmorBonus = 0;
    let staggerBonus = 0;

    loadout.forEach(item => {
      if (!item.modifiers) return;
      if (item.modifiers.xpBonus) xpLoadoutMod += item.modifiers.xpBonus;
      if (item.modifiers.goldBonus) goldLoadoutMod += item.modifiers.goldBonus;
      if (item.modifiers.damageBonus) damageLoadoutMod += item.modifiers.damageBonus;
      if (item.modifiers.flatArmorDamage) flatArmorBonus += item.modifiers.flatArmorDamage;
      if (item.modifiers.staggerBonus) staggerBonus += item.modifiers.staggerBonus;
    });

    // Final XP & Gold
    const finalXp = Math.round(baseXp * priorityMult * durationMult * domainMatchMult * xpLoadoutMod);
    const finalGold = Math.round(baseGold * priorityMult * durationMult * domainMatchMult * goldLoadoutMod);

    // Level up calculation
    const currentXp = (user.xp || 0) + finalXp;
    const currentLevel = user.level || 1;
    const nextLevelThreshold = this.getXpThresholdForLevel(currentLevel + 1);
    const levelUp = currentXp >= nextLevelThreshold;
    const newLevel = levelUp ? currentLevel + 1 : currentLevel;

    // Attribute Gain
    const attributeGain = action.attributeGain || { name: 'Focus', points: 1 };

    // 4. Boss Damage Calculation (Apply armor before HP damage, update stagger, clamp bounds)
    const rawDamage = Math.round((baseDamage * priorityMult * damageLoadoutMod) + flatArmorBonus);
    
    const currentArmor = encounter.armor !== undefined ? encounter.armor : 600;
    const currentHp = encounter.hp !== undefined ? encounter.hp : 2250;

    let armorDamage = 0;
    let hpDamage = 0;

    if (currentArmor > 0) {
      armorDamage = Math.min(currentArmor, rawDamage);
      const leftoverDamage = rawDamage - armorDamage;
      if (leftoverDamage > 0) {
        hpDamage = Math.min(currentHp, leftoverDamage);
      }
    } else {
      armorDamage = 0;
      hpDamage = Math.min(currentHp, rawDamage);
    }

    const newArmor = Math.max(0, currentArmor - armorDamage);
    const newHp = Math.max(0, currentHp - hpDamage);

    const baseStaggerGain = 15 + staggerBonus;
    const currentStagger = encounter.stagger !== undefined ? encounter.stagger : 25;
    const maxStagger = encounter.maxStagger || 100;
    const newStagger = Math.min(maxStagger, currentStagger + baseStaggerGain);

    const txId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    return {
      transactionId: txId,
      actionId: action.id,
      actionTitle: action.title,
      domain: actionDomain,
      baseXp,
      baseGold,
      priority: action.priority,
      durationMinutes: minutes,
      durationMultiplier: Number(durationMult.toFixed(2)),
      domainMatchMultiplier: Number(domainMatchMult.toFixed(2)),
      loadoutModifiersApplied: {
        xpBonusPct: Math.round((xpLoadoutMod - 1) * 100),
        goldBonusPct: Math.round((goldLoadoutMod - 1) * 100),
        damageBonusPct: Math.round((damageLoadoutMod - 1) * 100),
        flatArmorBonus
      },
      finalXp,
      finalGold,
      attributeGain,
      bossDamage: {
        rawDamage,
        armorDamage,
        hpDamage,
        totalDamageApplied: armorDamage + hpDamage,
        previousArmor: currentArmor,
        newArmor,
        previousHp: currentHp,
        newHp,
        staggerGained: baseStaggerGain,
        previousStagger: currentStagger,
        newStagger
      },
      levelUp,
      newLevel,
      nextLevelThreshold
    };
  }

  /**
   * Calculate cumulative XP required to reach a level
   */
  static getXpThresholdForLevel(level) {
    if (level <= 1) return 0;
    return Math.round(150 * Math.pow(level, 1.6));
  }
}
