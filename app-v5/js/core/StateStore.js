/* ==========================================================================
   V5 STATE STORE
   Reactive state store with LocalStorage persistence and reload idempotency
   ========================================================================== */

import { eventBus } from './EventBus.js';
import { StorageRepository } from './StorageRepository.js';
import { notionSnapshotRepository } from '../integrations/notion/NotionSnapshotRepository.js';
import { INITIAL_EQUIPMENT_CATALOG, EquipmentSystem } from '../game/EquipmentSystem.js';

const INITIAL_DEFAULT_STATE = {
  operative: {
    name: 'Vũ',
    age: 29,
    role: 'Freelancer',
    handle: '@web_operative_29',
    title: 'Đặc Vụ Mạng Đô Thị (Web Operative)',
    level: 5,
    xp: 640,
    maxXp: 1000,
    gold: 480,
    attributes: {
      focus: 18,
      intelligence: 16,
      resilience: 14,
      agility: 15
    }
  },
  threatBoss: {
    id: 'boss-corruption-v5',
    name: 'BÓNG MA XANH (CYBER CORRUPTION)',
    subtitle: 'Nguồn Gốc Nhiễm Độc Đô Thị Neon Noir',
    hp: 1850,
    maxHp: 3000,
    corruptionPct: 62,
    status: 'ACTIVE'
  },
  completedMissionIds: [], // Stores completed Notion mission IDs
  equipment: INITIAL_EQUIPMENT_CATALOG,
  activeView: 'world', // 'world' | 'briefing' | 'focus' | 'operative' | 'missions' | 'hideout' | 'chronicle' | 'strike'
  selectedMissionId: null,
  focusSession: {
    active: false,
    missionId: null,
    startedAt: null,
    totalSeconds: 1500,
    secondsRemaining: 1500,
    isPaused: false
  },
  lastStrikeResult: null
};

export class StateStore {
  constructor() {
    this.state = JSON.parse(JSON.stringify(INITIAL_DEFAULT_STATE));
    this.notionLoaded = false;
  }

  async initialize() {
    // 1. Load Notion snapshot
    await notionSnapshotRepository.loadSnapshot();
    this.notionLoaded = true;

    // 2. Load persistent local state
    const saved = StorageRepository.loadState();
    if (saved) {
      if (saved.operative) this.state.operative = saved.operative;
      if (saved.threatBoss) this.state.threatBoss = saved.threatBoss;
      if (saved.completedMissionIds && Array.isArray(saved.completedMissionIds)) {
        this.state.completedMissionIds = saved.completedMissionIds;
      }
      if (saved.equipment && Array.isArray(saved.equipment)) {
        this.state.equipment = saved.equipment;
      }
    }

    // 3. Hydrate state with truthful Notion snapshot
    this.hydrateFromNotion();

    eventBus.emit('STATE_INITIALIZED', this.state);
  }

  hydrateFromNotion() {
    const rawMissions = notionSnapshotRepository.getNormalizedMissions();
    
    // Apply completion status idempotently based on completedMissionIds
    this.state.missions = rawMissions.map(m => {
      const isCompleted = m.status === 'COMPLETED' || this.state.completedMissionIds.includes(m.id);
      return {
        ...m,
        status: isCompleted ? 'COMPLETED' : 'PENDING'
      };
    });

    this.state.habits = notionSnapshotRepository.getNormalizedHabits();
    this.state.goals = notionSnapshotRepository.getNormalizedGoals();
    this.state.daily = notionSnapshotRepository.getNormalizedDaily();
    this.state.projects = notionSnapshotRepository.getNormalizedProjects();
    this.state.inbox = notionSnapshotRepository.getNormalizedInbox();
    this.state.syncedAt = notionSnapshotRepository.getSnapshotTime();
  }

  save() {
    StorageRepository.saveState({
      operative: this.state.operative,
      threatBoss: this.state.threatBoss,
      completedMissionIds: this.state.completedMissionIds,
      equipment: this.state.equipment
    });
  }

  getState() {
    return this.state;
  }

  // View Navigation
  setView(viewName) {
    this.state.activeView = viewName;
    eventBus.emit('VIEW_CHANGED', viewName);
  }

  selectMission(missionId) {
    this.state.selectedMissionId = missionId;
    if (missionId) {
      this.setView('briefing');
    }
    eventBus.emit('MISSION_SELECTED', missionId);
  }

  getSelectedMission() {
    if (!this.state.selectedMissionId) return null;
    return this.state.missions.find(m => m.id === this.state.selectedMissionId) || null;
  }

  // Equipment Toggle
  toggleEquipment(itemId) {
    const item = this.state.equipment.find(e => e.id === itemId);
    if (!item) return;

    // If it's a suit, unequip other suits first
    if (item.category === 'Suit' && !item.equipped) {
      this.state.equipment.filter(e => e.category === 'Suit').forEach(s => s.equipped = false);
    }

    item.equipped = !item.equipped;
    this.save();
    eventBus.emit('EQUIPMENT_CHANGED', this.state.equipment);
    eventBus.emit('STATE_UPDATED', this.state);
  }

  // Focus Session Controls
  startFocus(missionId, minutes = 25) {
    const mission = this.state.missions.find(m => m.id === missionId);
    const duration = mission ? (mission.estimatedMinutes || minutes) : minutes;
    const totalSecs = duration * 60;

    this.state.focusSession = {
      active: true,
      missionId: missionId,
      startedAt: Date.now(),
      totalSeconds: totalSecs,
      secondsRemaining: totalSecs,
      isPaused: false
    };

    this.setView('focus');
    eventBus.emit('FOCUS_STARTED', this.state.focusSession);
  }

  pauseFocus() {
    if (this.state.focusSession.active) {
      this.state.focusSession.isPaused = !this.state.focusSession.isPaused;
      eventBus.emit('FOCUS_PAUSED', this.state.focusSession.isPaused);
    }
  }

  abandonFocus() {
    this.state.focusSession.active = false;
    this.setView('world');
    eventBus.emit('FOCUS_ABANDONED');
  }

  tickFocus() {
    if (this.state.focusSession.active && !this.state.focusSession.isPaused) {
      if (this.state.focusSession.secondsRemaining > 0) {
        this.state.focusSession.secondsRemaining--;
        eventBus.emit('FOCUS_TICK', this.state.focusSession.secondsRemaining);
      }
    }
  }

  // Complete Mission and Trigger Strike
  completeMission(missionId) {
    const mission = this.state.missions.find(m => m.id === missionId);
    if (!mission) return null;

    // Check idempotency: if already completed, do not double reward
    if (this.state.completedMissionIds.includes(missionId)) {
      console.warn('[StateStore] Mission already completed, ignoring duplicate reward:', missionId);
      this.setView('world');
      return null;
    }

    // Mark as completed
    mission.status = 'COMPLETED';
    mission.completedAt = new Date().toISOString();
    this.state.completedMissionIds.push(missionId);

    // Calculate rewards considering equipment modifiers
    const mods = EquipmentSystem.getEquippedModifiers(this.state.equipment);
    const baseVal = mission.rewardXp || 120;
    const xpBonus = Math.round(baseVal * (1 + mods.xpMultiplier));
    
    const baseGold = mission.rewardGold || 80;
    const goldBonus = Math.round(baseGold * (1 + mods.goldMultiplier));

    let bossDmg = mission.baseBossDamage || 160;
    if (mods.bossDamageBonus) bossDmg = Math.round(bossDmg * (1 + mods.bossDamageBonus));
    if (mission.priority === 'HIGH' && mods.highPriorityBossDmg) {
      bossDmg = Math.round(bossDmg * (1 + mods.highPriorityBossDmg));
    }

    // Apply Operative Level / XP / Gold
    let op = this.state.operative;
    op.xp += xpBonus;
    op.gold += goldBonus;

    // Level up check
    let leveledUp = false;
    if (op.xp >= op.maxXp) {
      op.level += 1;
      op.xp -= op.maxXp;
      op.maxXp = Math.round(op.maxXp * 1.25);
      leveledUp = true;
    }

    // Attribute gain
    if (mission.attributeGain) {
      const attrName = mission.attributeGain.name;
      if (attrName === 'Intelligence' || attrName === 'Trí Tuệ') op.attributes.intelligence += mission.attributeGain.points;
      else if (attrName === 'Resilience' || attrName === 'Kiên Cường') op.attributes.resilience += mission.attributeGain.points;
      else if (attrName === 'Focus' || attrName === 'Tập Trung') op.attributes.focus += mission.attributeGain.points;
    }

    // Damage Threat Boss
    let boss = this.state.threatBoss;
    boss.hp = Math.max(0, boss.hp - bossDmg);
    boss.corruptionPct = Math.max(0, Math.round((boss.hp / boss.maxHp) * 100));
    if (boss.hp === 0) {
      boss.status = 'PURIFIED';
    }

    // Reset focus session
    this.state.focusSession.active = false;

    // Strike breakdown payload
    const strikeResult = {
      missionTitle: mission.title,
      districtName: mission.districtName,
      xpAwarded: xpBonus,
      goldAwarded: goldBonus,
      bossDamageApplied: bossDmg,
      leveledUp: leveledUp,
      newLevel: op.level,
      remainingBossHp: boss.hp,
      corruptionPct: boss.corruptionPct
    };

    this.state.lastStrikeResult = strikeResult;
    this.save();

    eventBus.emit('MISSION_COMPLETED', strikeResult);
    eventBus.emit('STATE_UPDATED', this.state);

    this.setView('strike');
    return strikeResult;
  }
}

export const stateStore = new StateStore();
