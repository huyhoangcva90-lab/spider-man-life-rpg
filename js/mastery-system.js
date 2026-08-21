/* ==========================================================================
   SPIDER-MAN LIFE RPG - MASTERY SYSTEM MODULE
   Long-term specialization earned through repeated actions in a track.
   masteryXpToNext(rank) = Math.round(100 * Math.pow(rank + 1, 1.5))
   ========================================================================== */

class MasterySystem {
  // Map action categories to mastery tracks
  static CATEGORY_TO_TRACK = {
    health:     'fitness',
    agility:    'fitness',
    power:      'fitness',
    fitness:    'fitness',
    intellect:  'deepWork',
    deepwork:   'deepWork',
    learning:   'learning',
    brain:      'learning',
    focus:      'learning',
    discipline: 'discipline',
    willpower:  'discipline',
    mindset:    'discipline'
  };

  static getXpToNextRank(rank) {
    return Math.round(100 * Math.pow(rank + 1, 1.5));
  }

  /**
   * Add mastery XP to a specific track.
   * @param {object} masteries - progression.masteries object (mutated in place)
   * @param {string} trackId   - mastery track key
   * @param {number} amount    - XP to add
   * @returns {{ rankUp: boolean, newRank: number }}
   */
  static addMasteryXp(masteries, trackId, amount) {
    if (!masteries[trackId]) {
      masteries[trackId] = { xp: 0, rank: 0 };
    }
    const track = masteries[trackId];
    track.xp += amount;
    let rankUp = false;

    let threshold = this.getXpToNextRank(track.rank);
    while (track.xp >= threshold && track.rank < 10) {
      track.xp -= threshold;
      track.rank++;
      threshold = this.getXpToNextRank(track.rank);
      rankUp = true;
    }

    return { rankUp, newRank: track.rank };
  }

  /**
   * Resolve which mastery track applies for an action.
   * @param {string} category - action category or attribute
   * @returns {string|null} trackId or null if no mapping
   */
  static resolveTrack(category) {
    if (!category) return null;
    return this.CATEGORY_TO_TRACK[category.toLowerCase()] || null;
  }

  /**
   * Compute default mastery XP for an action based on type.
   * @param {string} type - action type ('daily'|'task'|'milestone'|'qte'|'gadget')
   * @returns {number}
   */
  static defaultMasteryXp(type) {
    const table = {
      daily: 8,
      task: 5,
      milestone: 20,
      qte: 15,
      gadget: 10
    };
    return table[type] || 5;
  }
}

window.MasterySystem = MasterySystem;
