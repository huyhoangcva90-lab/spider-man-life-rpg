/* ==========================================================================
   V4 STATE STORE (REACTIVE SINGLETON STORE WITH NOTION SNAPSHOT INTEGRATION)
   ========================================================================== */

import { StorageRepository } from './StorageRepository.js';
import { eventBus } from './EventBus.js';
import { INITIAL_STATE } from '../data/InitialState.js';
import { EVENTS } from '../config/constants.js';
import { RewardCalculator } from '../engine/RewardCalculator.js';
import { notionSnapshotRepository } from '../integrations/notion/NotionSnapshotRepository.js';

export class StateStore {
  constructor() {
    this.storage = new StorageRepository();
    this.state = this.storage.load(INITIAL_STATE);
    
    // Schema migration / fallback defense for extended V4 state
    this.ensureExtendedState();

    // Async load Notion snapshot repository and integrate records
    notionSnapshotRepository.loadSnapshot().then(() => {
      this.syncNotionSnapshotToState();
    });

    this.focusTimerInterval = null;

    // Resume focus timer if active
    if (this.state.focusSession && this.state.focusSession.active && !this.state.focusSession.isPaused) {
      this.startFocusTimer();
    }
  }

  /**
   * Sync normalized Notion snapshot entities into state actions list defensively
   */
  syncNotionSnapshotToState() {
    const notionMissions = notionSnapshotRepository.getNormalizedMissions();
    let modified = false;

    if (!Array.isArray(this.state.actions)) {
      this.state.actions = [];
    }

    // Tag legacy initial demo actions if missing origin
    const legacyDemoIds = ['act-1', 'act-2', 'act-3'];
    const legacyDemoTitles = ['Deliver Database Schema', 'Client Lead Generation Call', 'Morning Hydration & Mobility Routine'];
    this.state.actions.forEach(a => {
      if (!a.origin && (legacyDemoIds.includes(a.id) || legacyDemoTitles.includes(a.title))) {
        a.origin = 'local_demo';
        modified = true;
      }
    });

    // Merge each Notion mission into state.actions idempotently by externalId/id
    notionMissions.forEach(nMission => {
      const existingIdx = this.state.actions.findIndex(a => 
        (a.externalId && a.externalId === nMission.externalId) ||
        a.id === nMission.id ||
        (nMission.externalId && a.id === nMission.externalId) ||
        a.title === nMission.title
      );
      if (existingIdx !== -1) {
        // Keep existing completion status, transactionId, completedAt if completed locally
        const existing = this.state.actions[existingIdx];
        this.state.actions[existingIdx] = {
          ...nMission,
          origin: 'notion_snapshot',
          externalId: nMission.externalId || nMission.id,
          sourceUrl: nMission.sourceUrl,
          sourceDatabase: nMission.sourceDatabase,
          syncedAt: nMission.syncedAt,
          status: existing.status === 'COMPLETED' ? 'COMPLETED' : nMission.status,
          completedAt: existing.completedAt || nMission.completedAt,
          transactionId: existing.transactionId || null
        };
      } else {
        this.state.actions.push({
          ...nMission,
          origin: 'notion_snapshot',
          externalId: nMission.externalId || nMission.id
        });
        modified = true;
      }
    });

    if (modified) {
      this.saveAndNotify();
    }
  }

  /**
   * Defensive merge to ensure activeEncounter, loadout, ledger & attributes exist
   */
  ensureExtendedState() {
    let modified = false;

    if (!this.state.activeEncounter || !this.state.activeEncounter.name) {
      this.state.activeEncounter = JSON.parse(JSON.stringify(INITIAL_STATE.activeEncounter));
      modified = true;
    }
    
    const requiredLoadoutNames = ["Peter Parker", "Advanced Suit 2.0", "Web-Shooter", "Impact Web", "Mary Jane"];
    const hasAllFiveLoadouts = this.state.loadout && 
                               Array.isArray(this.state.loadout) && 
                               requiredLoadoutNames.every(name => this.state.loadout.some(item => item.name === name));

    if (!hasAllFiveLoadouts) {
      this.state.loadout = JSON.parse(JSON.stringify(INITIAL_STATE.loadout));
      modified = true;
    }
    if (!this.state.ledger || !Array.isArray(this.state.ledger)) {
      this.state.ledger = [];
      modified = true;
    }
    if (!this.state.user || !this.state.user.attributes) {
      if (!this.state.user) this.state.user = {};
      this.state.user.attributes = JSON.parse(JSON.stringify(INITIAL_STATE.user.attributes));
      modified = true;
    }
    if (this.state.lastRewardBreakdown === undefined) {
      this.state.lastRewardBreakdown = null;
      modified = true;
    }

    if (modified) {
      this.storage.save(this.state);
    }
  }

  /**
   * Get immutable copy of full state
   * @returns {Object}
   */
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Access normalized Notion snapshot info & collections
   */
  getNotionSnapshotTime() {
    return notionSnapshotRepository.getFormattedSnapshotTime();
  }

  getNotionHabits() {
    return notionSnapshotRepository.getNormalizedHabits();
  }

  getNotionGoals() {
    return notionSnapshotRepository.getNormalizedGoals();
  }

  getNotionDaily() {
    return notionSnapshotRepository.getNormalizedDaily();
  }

  getNotionProjects() {
    return notionSnapshotRepository.getNormalizedProjects();
  }

  getNotionInbox() {
    return notionSnapshotRepository.getNormalizedInbox();
  }

  /**
   * Save current state to storage and emit state change event
   */
  saveAndNotify() {
    this.storage.save(this.state);
    eventBus.emit(EVENTS.STATE_CHANGED, this.getState());
  }

  /**
   * Complete an action dossier idempotently and apply reward breakdown
   * @param {string} actionId 
   */
  completeAction(actionId) {
    const action = this.state.actions.find(a => a.id === actionId || a.externalId === actionId);
    if (!action) return;

    // Strict Idempotency check: refuse second completion for already completed action or transaction
    const isAlreadyProcessed = action.status === 'COMPLETED' || 
                               Boolean(action.transactionId) || 
                               (Array.isArray(this.state.ledger) && this.state.ledger.some(tx => tx.actionId === action.id || tx.externalId === action.externalId));

    if (isAlreadyProcessed) {
      console.warn(`[StateStore] Action ${actionId} has already been completed. Refusing duplicate execution.`);
      return;
    }

    action.status = 'COMPLETED';
    action.completedAt = new Date().toISOString();

    // 1. Calculate Rewards via Pure Calculator
    const breakdown = RewardCalculator.calculateCompletionReward(
      action,
      this.state.user,
      this.state.activeEncounter,
      this.state.loadout
    );

    action.transactionId = breakdown.transactionId;

    // 2. Update User Level, XP, Gold
    this.state.user.xp += breakdown.finalXp;
    this.state.user.gold += breakdown.finalGold;
    
    if (breakdown.levelUp) {
      this.state.user.level = breakdown.newLevel;
      eventBus.emit(EVENTS.NOTIFICATION, {
        type: 'LEVEL_UP',
        message: `LEVEL UP! You reached Operative Rank ${breakdown.newLevel}!`
      });
    }

    // 3. Update User Attributes
    if (breakdown.attributeGain && breakdown.attributeGain.name) {
      const attrKey = breakdown.attributeGain.name.toLowerCase();
      if (this.state.user.attributes[attrKey] !== undefined) {
        this.state.user.attributes[attrKey] += breakdown.attributeGain.points;
      }
    }

    // 4. Update Boss Encounter Stats (Armor applied first, then HP, clamp bounds)
    this.state.activeEncounter.armor = breakdown.bossDamage.newArmor;
    this.state.activeEncounter.hp = breakdown.bossDamage.newHp;
    this.state.activeEncounter.stagger = breakdown.bossDamage.newStagger;

    if (this.state.activeEncounter.armor === 0 && this.state.activeEncounter.hp > 0) {
      this.state.activeEncounter.status = 'VULNERABLE';
    } else if (this.state.activeEncounter.hp === 0) {
      this.state.activeEncounter.status = 'DEFEATED';
    }

    // 5. Atomic Ledger Transaction Record
    this.state.ledger.unshift({
      id: breakdown.transactionId,
      actionId: action.id,
      externalId: action.externalId || action.id,
      sourceUrl: action.sourceUrl || null,
      sourceDatabase: action.sourceDatabase || null,
      actionTitle: action.title,
      timestamp: action.completedAt,
      xpAwarded: breakdown.finalXp,
      goldAwarded: breakdown.finalGold,
      bossDamageApplied: breakdown.bossDamage.totalDamageApplied
    });

    // 6. Set active breakdown to display modal dialog
    this.state.lastRewardBreakdown = breakdown;

    // 7. Add activity log entry
    this.state.activityLog.unshift({
      id: `log-${Date.now()}`,
      timestamp: action.completedAt,
      text: `Completed "${action.title}" (+${breakdown.finalXp} XP, +${breakdown.finalGold} Gold, ${breakdown.bossDamage.totalDamageApplied} Boss Dmg)`,
      type: 'COMPLETION'
    });

    // If active focus action was completed, stop focus session
    if (this.state.focusSession.actionId === action.id) {
      this.stopFocus();
    }

    this.saveAndNotify();
    eventBus.emit(EVENTS.ACTION_COMPLETED, { action, reward: breakdown });
    eventBus.emit(EVENTS.REWARD_BREAKDOWN_OPEN, breakdown);
  }

  /**
   * Dismiss current reward breakdown dialog
   */
  dismissRewardBreakdown() {
    this.state.lastRewardBreakdown = null;
    this.saveAndNotify();
    eventBus.emit(EVENTS.REWARD_BREAKDOWN_CLOSE);
  }

  /**
   * Re-open a completed action
   */
  reopenAction(actionId) {
    const action = this.state.actions.find(a => a.id === actionId || a.externalId === actionId);
    if (!action || action.status !== 'COMPLETED') return;

    action.status = 'PENDING';
    action.completedAt = null;

    this.saveAndNotify();
  }

  /**
   * Create & add a new custom action dossier
   */
  addAction(actionData) {
    const domain = actionData.domain || actionData.category || 'Engineering';
    const newAction = {
      id: `act-${Date.now()}`,
      externalId: `local-act-${Date.now()}`,
      title: actionData.title.trim(),
      reason: actionData.reason ? actionData.reason.trim() : `Critical ${domain} objective for campaign objectives.`,
      description: actionData.description ? actionData.description.trim() : '',
      campaign: actionData.campaign || 'General Ops',
      category: domain,
      domain: domain,
      priority: actionData.priority || 'MEDIUM',
      rewardXp: Number(actionData.rewardXp) || 120,
      rewardGold: Number(actionData.rewardGold) || 80,
      estimatedMinutes: Number(actionData.estimatedMinutes) || 25,
      baseBossDamage: Number(actionData.baseBossDamage) || 160,
      attributeGain: actionData.attributeGain || { name: domain.includes('Engineering') ? 'Intelligence' : (domain.includes('Sales') ? 'Focus' : 'Agility'), points: 2 },
      status: 'PENDING',
      completedAt: null,
      createdAt: new Date().toISOString(),
      tags: ['Local', domain]
    };

    this.state.actions.unshift(newAction);

    this.state.activityLog.unshift({
      id: `log-${Date.now()}`,
      timestamp: newAction.createdAt,
      text: `Created new objective: "${newAction.title}"`,
      type: 'CREATE'
    });

    this.saveAndNotify();
    eventBus.emit(EVENTS.ACTION_ADDED, newAction);
    return newAction;
  }

  /**
   * Delete action by ID
   */
  deleteAction(actionId) {
    const idx = this.state.actions.findIndex(a => a.id === actionId || a.externalId === actionId);
    if (idx !== -1) {
      const removed = this.state.actions.splice(idx, 1)[0];
      if (this.state.focusSession.actionId === actionId) {
        this.stopFocus();
      }
      this.saveAndNotify();
      eventBus.emit(EVENTS.ACTION_DELETED, removed);
    }
  }

  /**
   * Toggle Focus Mode on a specific action
   */
  toggleFocus(actionId = null, durationMinutes = 25) {
    const session = this.state.focusSession;
    const targetId = actionId || session.actionId || (this.state.actions[0] ? this.state.actions[0].id : null);

    if (session.active) {
      this.stopFocus();
    } else {
      session.active = true;
      session.isPaused = false;
      session.actionId = targetId;
      session.durationMinutes = durationMinutes;
      session.secondsRemaining = durationMinutes * 60;
      session.startedAt = new Date().toISOString();

      const action = this.state.actions.find(a => a.id === targetId || a.externalId === targetId);
      if (action && action.status === 'PENDING') {
        action.status = 'IN_PROGRESS';
      }

      this.startFocusTimer();
      this.saveAndNotify();
      eventBus.emit(EVENTS.FOCUS_TOGGLED, { active: true, targetId });
    }
  }

  startFocusTimer() {
    this.clearFocusTimer();
    this.focusTimerInterval = setInterval(() => {
      const session = this.state.focusSession;
      if (!session.active || session.isPaused) return;

      session.secondsRemaining--;
      if (session.secondsRemaining <= 0) {
        session.secondsRemaining = 0;
        this.clearFocusTimer();
        session.active = false;
        
        eventBus.emit(EVENTS.NOTIFICATION, {
          type: 'FOCUS_COMPLETE',
          message: 'Focus Session Complete! Excellent work.'
        });
      }

      eventBus.emit(EVENTS.FOCUS_TICK, session);
    }, 1000);
  }

  clearFocusTimer() {
    if (this.focusTimerInterval) {
      clearInterval(this.focusTimerInterval);
      this.focusTimerInterval = null;
    }
  }

  stopFocus() {
    this.clearFocusTimer();
    this.state.focusSession.active = false;
    this.state.focusSession.isPaused = false;
    this.saveAndNotify();
    eventBus.emit(EVENTS.FOCUS_TOGGLED, { active: false });
  }

  /**
   * Set current navigation route
   */
  setRoute(route) {
    this.state.currentRoute = route;
    this.saveAndNotify();
    eventBus.emit(EVENTS.ROUTE_CHANGED, route);
  }

  /**
   * Reset store to initial seed state
   */
  resetToInitial() {
    this.clearFocusTimer();
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.syncNotionSnapshotToState();
    this.saveAndNotify();
  }
}

export const stateStore = new StateStore();
