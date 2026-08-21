/* ==========================================================================
   SPIDER-MAN LIFE RPG - STAT SYSTEM MODULE
   ========================================================================== */

class StatSystem {
  // Attribute XP needed per Stat Level: 50 * StatValue
  static getAttrXpThreshold(currentStatVal) {
    return Math.round(50 * Math.pow(currentStatVal, 1.15));
  }

  static addAttributeXp(characterState, statName, amount) {
    if (!characterState.stats[statName]) return { statLeveledUp: false };

    if (!characterState.attrXp[statName]) {
      characterState.attrXp[statName] = 0;
    }

    characterState.attrXp[statName] += amount;
    let statLeveledUp = false;
    let req = this.getAttrXpThreshold(characterState.stats[statName]);

    while (characterState.attrXp[statName] >= req) {
      characterState.attrXp[statName] -= req;
      characterState.stats[statName]++;
      req = this.getAttrXpThreshold(characterState.stats[statName]);
      statLeveledUp = true;
    }

    return { statLeveledUp, newStatValue: characterState.stats[statName] };
  }
}

window.StatSystem = StatSystem;
