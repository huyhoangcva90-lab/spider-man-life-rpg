/* ==========================================================================
   SPIDER-MAN LIFE RPG - XP SYSTEM MODULE
   ========================================================================== */

class XPSystem {
  // Level XP curve calculation formula: XP = 100 * (Level ^ 1.35)
  static getXpToNextLevel(level) {
    return Math.round(100 * Math.pow(level, 1.35));
  }

  static addXp(characterState, amount) {
    characterState.xp += amount;
    let leveledUp = false;

    while (characterState.xp >= characterState.xpToNext) {
      characterState.xp -= characterState.xpToNext;
      characterState.level++;
      characterState.skillPoints += 2;
      characterState.xpToNext = this.getXpToNextLevel(characterState.level);
      leveledUp = true;
    }

    return { leveledUp, newLevel: characterState.level };
  }
}

window.XPSystem = XPSystem;
