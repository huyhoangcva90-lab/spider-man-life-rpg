/* ==========================================================================
   SPIDER-MAN LIFE RPG - BUILD SYSTEM MODULE
   Calculates active modifiers based on equipped suit, gadgets, companion, and skills.
   ========================================================================== */

class BuildSystem {
  /**
   * Derive the current active build summary and modifiers.
   * @param {object} buildState - state.build
   * @param {object} character - state.character
   * @param {array} suitsState - state.suitsState
   * @param {array} gadgetsState - state.gadgetsState
   * @param {array} companionsState - state.companionsState
   * @param {array} skillsState - state.skillsState
   * @returns {object} Derived modifiers and descriptive summary
   */
  static deriveBuild(buildState, character, suitsState, gadgetsState, companionsState, skillsState) {
    const suit = suitsState.find(s => s.id === buildState.equippedSuitId) || null;
    const companion = companionsState.find(c => c.id === buildState.companionId) || null;
    
    const equippedGadgets = [];
    if (buildState.equippedGadgetIds) {
      buildState.equippedGadgetIds.forEach(id => {
        const gadget = gadgetsState.find(g => g.id === id);
        if (gadget) equippedGadgets.push(gadget);
      });
    }

    const unlockedSkills = [];
    if (buildState.unlockedSkillIds) {
      buildState.unlockedSkillIds.forEach(id => {
        const skill = skillsState.find(s => s.id === id);
        if (skill) unlockedSkills.push(skill);
      });
    }

    // Initialize base modifiers
    const statBoosts = {
      agility: 0,
      power: 0,
      intellect: 0,
      focus: 0,
      discipline: 0,
      willpower: 0
    };

    const activeModifiers = [];

    // Apply Suit Modifiers
    if (suit) {
      if (suit.statModifiers) {
        for (const [stat, value] of Object.entries(suit.statModifiers)) {
          if (statBoosts[stat] !== undefined) {
            statBoosts[stat] += value;
          }
        }
      }
      if (suit.modifiers) activeModifiers.push(...suit.modifiers);
    }

    if (companion && companion.modifiers) activeModifiers.push(...companion.modifiers);
    
    equippedGadgets.forEach(g => {
      if (g.modifiers) activeModifiers.push(...g.modifiers);
    });
    
    unlockedSkills.forEach(s => {
      if (s.modifiers) activeModifiers.push(...s.modifiers);
    });

    return {
      suit,
      companion,
      gadgets: equippedGadgets,
      skills: unlockedSkills,
      statBoosts,
      activeModifiers
    };
  }

  /**
   * Evaluates active modifiers for a specific target given an action context.
   * @param {array} modifiers - array of active modifiers
   * @param {string} target - 'xp' | 'gold' | 'attributeXp' | 'damage' | 'stagger'
   * @param {object} context - { actionKind, difficulty, attribute, tags, villainId }
   * @returns {object} { multiplier, addend }
   */
  static evaluateModifiers(modifiers, target, context = {}) {
    let multiplier = 1.0;
    let addend = 0;

    for (const mod of modifiers) {
      if (mod.target !== target) continue;

      // Evaluate condition
      let conditionMet = true;
      if (mod.when) {
        if (mod.when.actionKinds && (!context.actionKind || !mod.when.actionKinds.includes(context.actionKind))) {
          conditionMet = false;
        }
        if (mod.when.difficulty && (!context.difficulty || !mod.when.difficulty.includes(context.difficulty))) {
          conditionMet = false;
        }
        if (mod.when.attributes && (!context.attribute || !mod.when.attributes.includes(context.attribute))) {
          conditionMet = false;
        }
        if (mod.when.tags && !mod.when.tags.some(tag => context.tags && context.tags.includes(tag))) {
          conditionMet = false;
        }
        if (mod.when.villainIds && (!context.villainId || !mod.when.villainIds.includes(context.villainId))) {
          conditionMet = false;
        }
      }

      if (conditionMet) {
        if (mod.operation === 'multiply') multiplier *= mod.value;
        if (mod.operation === 'add') addend += mod.value;
      }
    }

    return { multiplier, addend };
  }

  /**
   * Apply build-derived stats to character's base stats for combat resolution.
   * @param {object} characterStats - base stats (e.g. { agility: 10, ... })
   * @param {object} statBoosts - from derived build
   * @returns {object} Effective stats
   */
  static getEffectiveStats(characterStats, statBoosts) {
    const effective = { ...characterStats };
    for (const stat in statBoosts) {
      if (effective[stat] !== undefined) {
        effective[stat] += statBoosts[stat];
      }
    }
    return effective;
  }
}

window.BuildSystem = BuildSystem;
