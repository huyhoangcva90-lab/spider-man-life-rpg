/* ==========================================================================
   SPIDER-MAN LIFE RPG - CENTRAL GAME ENGINE MODULE
   ========================================================================== */

class GameEngine {
  constructor(storageManager) {
    this.storage = storageManager;
    this.state = this.storage.loadState();
  }

  save() {
    this.storage.saveState(this.state);
  }

  resetAllData() {
    this.state = this.storage.resetDemoData();
    return this.state;
  }

  // CORE GAME LOOP EXECUTION TRIGGER
  executeAction(actionPayload) {
    // Action Payload should now follow Action taxonomy loosely
    const { character, currentBossState, ledger, progression, inventory } = this.state;
    
    // 1. Validate and Reject Duplicates
    if (!actionPayload || !actionPayload.id) return { error: 'Invalid action payload' };
    if (ledger.completedActionIds.includes(actionPayload.id)) {
      return { duplicate: true }; // Prevent duplicate grants
    }
    
    const villainDef = BossSystem.getVillain(currentBossState.villainId);

    // Apply modifiers from build
    const buildDerived = BuildSystem.deriveBuild(
      this.state.build, character, this.state.suitsState, this.state.gadgetsState, this.state.companionsState, this.state.skillsState
    );
    const effectiveStats = BuildSystem.getEffectiveStats(character.stats, buildDerived.statBoosts);

    const kind = actionPayload.kind || actionPayload.type || 'task';
    const difficulty = actionPayload.difficulty || 'normal';
    let isWeaknessMatch = (actionPayload.attribute === villainDef.weakness);
    
    const context = {
      actionKind: kind,
      difficulty: difficulty,
      attribute: actionPayload.attribute,
      tags: actionPayload.tags ? [...actionPayload.tags] : [],
      villainId: currentBossState.villainId
    };
    if (isWeaknessMatch) context.tags.push('weakness_match');

    const xpMods = BuildSystem.evaluateModifiers(buildDerived.activeModifiers, 'xp', context);
    const goldMods = BuildSystem.evaluateModifiers(buildDerived.activeModifiers, 'gold', context);
    const attrXpMods = BuildSystem.evaluateModifiers(buildDerived.activeModifiers, 'attributeXp', context);
    const damageMods = BuildSystem.evaluateModifiers(buildDerived.activeModifiers, 'damage', context);
    const staggerMods = BuildSystem.evaluateModifiers(buildDerived.activeModifiers, 'stagger', context);

    // Default Taxonomy base values
    let baseDamage = 0;
    let baseStagger = 0;
    let actualXp = 0;
    let actualGold = 0;
    let attrXp = actionPayload.attrXp || 15;

    if (kind === 'habit') {
      baseDamage = 15;
      baseStagger = 20;
      actualXp = 10;
      actualGold = 5;
    } else if (kind === 'task') {
      baseDamage = difficulty === 'hard' ? 60 : 30;
      baseStagger = difficulty === 'hard' ? 20 : 10;
      actualXp = difficulty === 'hard' ? 50 : 25;
      actualGold = difficulty === 'hard' ? 30 : 15;
    } else if (kind === 'milestone') {
      baseDamage = 200;
      baseStagger = 50;
      actualXp = 100;
      actualGold = 80;
      attrXp = 40;
    } else if (kind === 'quest') {
      baseDamage = 100;
      baseStagger = 30;
      actualXp = 80;
      actualGold = 50;
      attrXp = 30;
    } else if (kind === 'goal') {
       // goals cannot be completed for damage/rewards directly
       baseDamage = 0; baseStagger = 0; actualXp = 0; actualGold = 0; attrXp = 0;
    }

    // Override with payload if present (for legacy compatibility)
    if (actionPayload.damage !== undefined) baseDamage = actionPayload.damage;
    if (actionPayload.stagger !== undefined) baseStagger = actionPayload.stagger;
    if (actionPayload.xp !== undefined) actualXp = actionPayload.xp;
    if (actionPayload.gold !== undefined) actualGold = actionPayload.gold;
    if (actionPayload.attrXp !== undefined) attrXp = actionPayload.attrXp;

    let actualDamage = Math.round(baseDamage * damageMods.multiplier + damageMods.addend);
    let actualStagger = Math.round(baseStagger * staggerMods.multiplier + staggerMods.addend);
    actualXp = Math.round(actualXp * xpMods.multiplier + xpMods.addend);
    actualGold = Math.round(actualGold * goldMods.multiplier + goldMods.addend);
    attrXp = Math.round(attrXp * attrXpMods.multiplier + attrXpMods.addend);

    if (currentBossState.mechanicState && currentBossState.mechanicState.nextActionDamageBoost) {
      actualDamage += currentBossState.mechanicState.nextActionDamageBoost;
      currentBossState.mechanicState.nextActionDamageBoost = 0;
    }

    // 2. Add Account XP & Gold
    const xpResult = actualXp > 0 ? XPSystem.addXp(character, actualXp) : { leveledUp: false };
    character.gold += actualGold;

    // 3. Add Attribute XP
    let attrResult = { statLeveledUp: false };
    if (actionPayload.attribute && attrXp > 0) {
      attrResult = StatSystem.addAttributeXp(character, actionPayload.attribute, attrXp);
    }

    // 4. Add Mastery XP
    let masteryResult = { rankUp: false };
    const trackId = MasterySystem.resolveTrack(actionPayload.category || actionPayload.attribute);
    if (trackId && kind !== 'goal') {
      const mxp = MasterySystem.defaultMasteryXp(kind);
      masteryResult = MasterySystem.addMasteryXp(progression.masteries, trackId, mxp);
    }

    // 5. Boss Damage Calculation & Application
    let bossResult = { finalDamage: 0, finalStagger: 0, isDefeated: false, isStaggered: false, currentPhase: currentBossState.currentPhase };

    if (currentBossState.status !== 'defeated' && (actualDamage > 0 || actualStagger > 0)) {
      bossResult = BossSystem.applyDamage(
        currentBossState,
        villainDef,
        actualDamage,
        actualStagger,
        isWeaknessMatch,
        context
      );
    }

    // 6. Log to Combat Log
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let actionName = actionPayload.title || actionPayload.name || 'Action';
    const logMsg = {
      time: nowStr,
      text: `${actionName}: +${actualXp} XP, +${actualGold} Gold${bossResult.finalDamage > 0 ? `, ${bossResult.finalDamage} Damage` : ''}${isWeaknessMatch ? ' (WEAKNESS CRIT!)' : ''}`,
      type: isWeaknessMatch ? 'crit' : 'attack'
    };
    currentBossState.combatLog.unshift(logMsg);
    if (currentBossState.combatLog.length > 20) currentBossState.combatLog.pop();

    // 7. Record Action Ledger
    ledger.completedActionIds.push(actionPayload.id);
    ledger.transactions.push({
      id: `txn_${Date.now()}_${actionPayload.id}`,
      actionId: actionPayload.id,
      timestamp: new Date().toISOString(),
      type: kind,
      rewards: { xp: actualXp, gold: actualGold }
    });

    // 8. Process Victory Loot (Idempotent)
    let victoryGrant = null;
    if (currentBossState.currentHp <= 0) {
      currentBossState.status = 'defeated';
      const grantId = `${currentBossState.encounterId}:victory`;
      
      if (!ledger.grantedRewardIds.includes(grantId)) {
        // First time defeat for this encounter
        ledger.grantedRewardIds.push(grantId);
        LootSystem.recordDefeat(inventory, currentBossState.encounterId, currentBossState.villainId);
        
        // Victory Base Rewards
        const victoryXp = 600;
        const victoryGold = 500;
        XPSystem.addXp(character, victoryXp);
        character.gold += victoryGold;

        // Guaranteed Loot
        const grants = LootSystem.buildLootGrant(villainDef);
        LootSystem.applyToInventory(inventory, grants);
        
        victoryGrant = { xp: victoryXp, gold: victoryGold, items: grants };
      }
    }

    this.save();

    return {
      duplicate: false,
      xpResult,
      attrResult,
      masteryResult,
      bossResult,
      logMsg,
      victoryGrant
    };
  }

  executeFinisher() {
    const { currentBossState, character, ledger, inventory } = this.state;
    
    if (currentBossState.status === 'defeated') return { finisherDamage: 0, isDefeated: true };

    const finisherResult = BossSystem.triggerFinisher(currentBossState);
    let victoryGrant = null;

    if (finisherResult.finisherDamage > 0) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      currentBossState.combatLog.unshift({
        time: nowStr,
        text: `⚡ SPIDER FINISHER EXECUTED: ${finisherResult.finisherDamage} CRITICAL DAMAGE!`,
        type: 'crit'
      });

      if (finisherResult.isDefeated) {
        currentBossState.status = 'defeated';
        const grantId = `${currentBossState.encounterId}:victory`;
        
        if (!ledger.grantedRewardIds.includes(grantId)) {
          ledger.grantedRewardIds.push(grantId);
          LootSystem.recordDefeat(inventory, currentBossState.encounterId, currentBossState.villainId);
          
          const victoryXp = 600;
          const victoryGold = 500;
          XPSystem.addXp(character, victoryXp);
          character.gold += victoryGold;

          const villainDef = BossSystem.getVillain(currentBossState.villainId);
          const grants = LootSystem.buildLootGrant(villainDef);
          LootSystem.applyToInventory(inventory, grants);
          
          victoryGrant = { xp: victoryXp, gold: victoryGold, items: grants };
        }
      }
      this.save();
    }
    return { ...finisherResult, victoryGrant };
  }

  acknowledgeBossClaim() {
    const { currentBossState } = this.state;
    const { defeatRecords } = this.state.inventory;
    
    if (currentBossState.status !== 'defeated') return { restarted: false };

    // Generate new encounter ID based on past defeats for this villain
    const villainId = currentBossState.villainId;
    const defeatsCount = defeatRecords ? defeatRecords.filter(r => r.villainId === villainId).length : 0;
    const nextEncounterId = `${villainId}_encounter_${defeatsCount + 1}`;

    const villainDef = BossSystem.getVillain(villainId);

    // Reset boss state for new attempt
    currentBossState.encounterId = nextEncounterId;
    currentBossState.status = 'active';
    currentBossState.currentHp = villainDef.maxHp;
    currentBossState.maxHp = villainDef.maxHp;
    currentBossState.currentArmor = villainDef.maxArmor;
    currentBossState.stagger = 0;
    currentBossState.maxStagger = villainDef.staggerThreshold;
    currentBossState.currentPhase = 1;
    currentBossState.mechanicState = {};
    currentBossState.lastMechanicEvent = '';
    currentBossState.rewardClaimed = false;
    currentBossState.combatLog = [];

    this.save();
    return { restarted: true, encounterId: nextEncounterId };
  }

  equipSuit(suitId) {
    const suit = this.state.suitsState.find(s => s.id === suitId);
    if (suit) {
      this.state.character.equippedSuitId = suitId;
      this.state.build.equippedSuitId = suitId;
      this.save();
    }
  }

  equipCompanion(companionId) {
    const comp = this.state.companionsState.find(c => c.id === companionId);
    if (comp) {
      this.state.character.activeCompanionId = companionId;
      this.state.build.companionId = companionId;
      this.save();
    }
  }

  unlockSkill(skillId) {
    const skill = this.state.skillsState.find(s => s.id === skillId);
    if (skill && !skill.unlocked && this.state.character.skillPoints >= skill.cost) {
      this.state.character.skillPoints -= skill.cost;
      skill.unlocked = true;
      if (!this.state.build.unlockedSkillIds.includes(skillId)) {
        this.state.build.unlockedSkillIds.push(skillId);
      }
      this.save();
      return true;
    }
    return false;
  }

  purchaseReward(rewardId) {
    const reward = this.state.questsState.rewardShop.find(r => r.id === rewardId);
    if (reward && this.state.character.gold >= reward.cost) {
      this.state.character.gold -= reward.cost;
      reward.purchased = true;
      this.save();
      return true;
    }
    return false;
  }

  equipGadget(gadgetId) {
    if (!this.state.build.equippedGadgetIds) {
      this.state.build.equippedGadgetIds = [];
    }
    const maxGadgets = 2; // Can be enhanced later based on skills
    if (this.state.build.equippedGadgetIds.length < maxGadgets && !this.state.build.equippedGadgetIds.includes(gadgetId)) {
      this.state.build.equippedGadgetIds.push(gadgetId);
      const gadget = this.state.gadgetsState.find(g => g.id === gadgetId);
      if (gadget) gadget.equipped = true;
      this.save();
      return true;
    }
    return false;
  }

  unequipGadget(gadgetId) {
    if (!this.state.build.equippedGadgetIds) return false;
    const idx = this.state.build.equippedGadgetIds.indexOf(gadgetId);
    if (idx !== -1) {
      this.state.build.equippedGadgetIds.splice(idx, 1);
      const gadget = this.state.gadgetsState.find(g => g.id === gadgetId);
      if (gadget) gadget.equipped = false;
      this.save();
      return true;
    }
    return false;
  }
}

window.GameEngine = GameEngine;
