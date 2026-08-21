/* ==========================================================================
   SPIDER-MAN LIFE RPG - BOSS ENCOUNTER & COMBAT MODULE
   ========================================================================== */

class BossSystem {
  static getVillain(villainId) {
    return VILLAINS_DATA.find(v => v.id === villainId) || VILLAINS_DATA[0];
  }

  static applyDamage(bossState, villainDef, damageAmount, staggerAmount = 10, isWeaknessMatch = false, context = {}) {
    let finalDamage = damageAmount;
    let finalStagger = staggerAmount;
    let mechanicEvent = null;

    if (!bossState.mechanicState) bossState.mechanicState = {};

    // 1. Process Pre-Damage Mechanics
    if (villainDef.mechanics) {
      if (villainDef.mechanics.regen) {
        if (bossState.mechanicState.regenSuppressed) {
          mechanicEvent = "Regeneration suppressed by previous action!";
          bossState.mechanicState.regenSuppressed = false;
        } else if (bossState.currentHp < bossState.maxHp) {
          const regenAmount = villainDef.mechanics.regen.amount || 50;
          bossState.currentHp = Math.min(bossState.maxHp, bossState.currentHp + regenAmount);
          mechanicEvent = `${villainDef.name} regenerated ${regenAmount} HP!`;
        }
        
        const suppressAttr = villainDef.mechanics.regen.suppressAttribute;
        const suppressCat = villainDef.mechanics.regen.suppressCategory;
        if (context.attribute === suppressAttr || context.actionKind === suppressCat || context.category === suppressCat) {
          bossState.mechanicState.regenSuppressed = true;
          mechanicEvent = "Action suppresses next regeneration!";
        }
      }

      if (villainDef.mechanics.decoy) {
        const prioAttr = villainDef.mechanics.decoy.priorityAttribute;
        const prioTags = villainDef.mechanics.decoy.priorityTags || [];
        const hasTag = context.tags && prioTags.some(t => context.tags.includes(t));
        if (context.attribute === prioAttr || hasTag) {
          mechanicEvent = "Priority target identified! Weakness revealed.";
          isWeaknessMatch = true;
        } else {
          finalDamage = Math.round(finalDamage * (villainDef.mechanics.decoy.damageReduction || 0.5));
          mechanicEvent = "Hit a decoy! Damage reduced.";
        }
      }
    }

    // Apply weakness multiplier (1.5x damage & stagger)
    if (isWeaknessMatch) {
      finalDamage = Math.round(finalDamage * 1.5);
      finalStagger = Math.round(finalStagger * 1.5);
    }

    // Phase Armor mechanic reduction
    if (bossState.currentArmor > 0) {
      let armorBypass = 0;
      if (villainDef.mechanics && villainDef.mechanics.armorPressure) {
        const bypassAttr = villainDef.mechanics.armorPressure.bypassAttribute;
        const bypassTags = villainDef.mechanics.armorPressure.bypassTags || [];
        const hasTag = (context.tags && bypassTags.some(t => context.tags.includes(t))) || context.actionKind === 'milestone';
        if (context.attribute === bypassAttr || hasTag) {
           armorBypass = villainDef.mechanics.armorPressure.bypassPct || 0.5;
           mechanicEvent = "Armor partially bypassed!";
        }
      }
      
      const effectiveArmor = Math.round(bossState.currentArmor * (1 - armorBypass));
      const absorbedByArmor = Math.min(effectiveArmor, Math.round(finalDamage * 0.4));
      
      bossState.currentArmor -= absorbedByArmor;
      finalDamage -= absorbedByArmor;
    }

    // Apply damage to HP
    bossState.currentHp = Math.max(0, bossState.currentHp - finalDamage);

    // Apply stagger
    bossState.stagger = Math.min(bossState.maxStagger, bossState.stagger + finalStagger);

    // Evaluate Phase transition
    const hpRatio = bossState.currentHp / bossState.maxHp;
    let newPhase = 1;
    for (let i = villainDef.phases.length - 1; i >= 0; i--) {
      if (hpRatio <= villainDef.phases[i].hpPercent) {
        newPhase = villainDef.phases[i].phase;
        break;
      }
    }
    
    if (newPhase > bossState.currentPhase) {
      bossState.currentPhase = newPhase;
    }

    if (mechanicEvent) {
      bossState.lastMechanicEvent = mechanicEvent;
    }

    const isDefeated = bossState.currentHp <= 0;
    const isStaggered = bossState.stagger >= bossState.maxStagger;

    return {
      finalDamage,
      finalStagger,
      isDefeated,
      isStaggered,
      currentPhase: bossState.currentPhase
    };
  }

  static triggerFinisher(bossState) {
    if (bossState.stagger >= bossState.maxStagger) {
      const finisherDamage = 350;
      bossState.currentHp = Math.max(0, bossState.currentHp - finisherDamage);
      bossState.stagger = 0; // Reset stagger
      const isDefeated = bossState.currentHp <= 0;
      return { finisherDamage, isDefeated };
    }
    return { finisherDamage: 0, isDefeated: false };
  }
}

window.BossSystem = BossSystem;
