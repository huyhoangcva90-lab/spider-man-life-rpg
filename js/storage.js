/* ==========================================================================
   SPIDER-MAN LIFE RPG - STORAGE MODULE V2
   Versioned, migratable, deep-cloned, validated persistence.
   schemaVersion: 2  |  key: LIFE_RPG_STATE_V2
   ========================================================================== */

class StorageManager {
  constructor() {
    this.storageKeyV1 = 'SPIDER_LIFE_RPG_PROTOTYPE_DATA_V1';
    this.storageKeyV2 = 'LIFE_RPG_STATE_V2';
    this.CURRENT_SCHEMA_VERSION = 2;
    this.MAX_IMPORT_BYTES = 2 * 1024 * 1024; // 2 MB guard
  }

  // -------------------------------------------------------------------------
  // Deep clone helper (no structuredClone polyfill needed for modern browsers)
  // -------------------------------------------------------------------------
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // -------------------------------------------------------------------------
  // Merge static seed definitions into persisted collection arrays safely
  // -------------------------------------------------------------------------
  mergeSeedCollection(persistedArray, seedArray, idAliasMap = {}) {
    if (!Array.isArray(seedArray)) return Array.isArray(persistedArray) ? persistedArray : [];
    if (!Array.isArray(persistedArray)) return this.deepClone(seedArray);

    const existingMap = new Map();
    persistedArray.forEach(item => {
      if (item && item.id) {
        const targetId = idAliasMap[item.id] || item.id;
        existingMap.set(targetId, item);
      }
    });

    const merged = [];
    const processedIds = new Set();

    seedArray.forEach(seedItem => {
      const seedId = seedItem.id;
      processedIds.add(seedId);
      const existing = existingMap.get(seedId);
      if (existing) {
        const mergedItem = {
          ...seedItem,
          ...existing,
          name: seedItem.name || existing.name,
          title: seedItem.title || existing.title,
          universe: seedItem.universe || existing.universe,
          rarity: seedItem.rarity || existing.rarity,
          mediaId: seedItem.mediaId || existing.mediaId,
          icon: seedItem.icon || existing.icon,
          description: seedItem.description || existing.description,
          passiveDescription: seedItem.passiveDescription || existing.passiveDescription,
          statModifiers: seedItem.statModifiers || existing.statModifiers,
          modifiers: seedItem.modifiers || existing.modifiers,
          gameId: seedItem.gameId ?? existing.gameId,
          gameSource: seedItem.gameSource ?? existing.gameSource,
          sourceType: seedItem.sourceType ?? existing.sourceType,
          sourceUrl: seedItem.sourceUrl ?? existing.sourceUrl,
          playableHero: seedItem.playableHero ?? existing.playableHero,
          suitFamily: seedItem.suitFamily ?? existing.suitFamily,
          abilityFamily: seedItem.abilityFamily ?? existing.abilityFamily,
          branch: seedItem.branch ?? existing.branch,
          unlocked: typeof existing.unlocked === 'boolean' ? existing.unlocked : seedItem.unlocked,
          owned: typeof existing.owned === 'boolean' ? existing.owned : (seedItem.owned ?? seedItem.unlocked ?? false),
          favorite: typeof existing.favorite === 'boolean' ? existing.favorite : (seedItem.favorite ?? false),
          selected: typeof existing.selected === 'boolean' ? existing.selected : (seedItem.selected ?? false),
        };
        merged.push(mergedItem);
      } else {
        merged.push(this.deepClone(seedItem));
      }
    });

    persistedArray.forEach(item => {
      if (item && item.id) {
        const targetId = idAliasMap[item.id] || item.id;
        if (!processedIds.has(targetId)) {
          processedIds.add(targetId);
          merged.push(item);
        }
      }
    });

    return merged;
  }

  // -------------------------------------------------------------------------
  // Build a brand-new V2 state (deep-clones all seed arrays)
  // -------------------------------------------------------------------------
  getInitialV2State() {
    return {
      schemaVersion: 2,
      character: {
        heroName: 'Peter Parker',
        level: 12,
        xp: 820,
        xpToNext: 1000,
        gold: 1250,
        energy: 74,
        maxEnergy: 100,
        momentum: 85,
        maxMomentum: 100,
        equippedSuitId: 'advanced_suit',
        activeCompanionId: 'miles_morales',
        skillPoints: 4,
        stats: {
          agility: 22,
          power: 18,
          intellect: 31,
          focus: 24,
          discipline: 20,
          willpower: 19
        },
        attrXp: {
          agility: 120,
          power: 80,
          intellect: 250,
          focus: 190,
          discipline: 140,
          willpower: 110
        }
      },

      // Mastery tracks — XP per track, threshold per rank:  100 * (rank+1)^1.5
      progression: {
        masteries: {
          fitness:   { xp: 0, rank: 0 },
          deepWork:  { xp: 0, rank: 0 },
          learning:  { xp: 0, rank: 0 },
          discipline: { xp: 0, rank: 0 }
        }
      },

      // Active build snapshot — updated by equip actions
      build: {
        equippedSuitId: 'advanced_suit',
        equippedGadgetIds: ['web_shooter', 'impact_web'],
        companionId: 'miles_morales',
        unlockedSkillIds: []
      },

      currentBossState: {
        encounterId: 'enc_docock_01',
        villainId: 'docock',
        currentHp: 680,
        maxHp: 1000,
        currentArmor: 150,
        maxArmor: 300,
        stagger: 45,
        maxStagger: 100,
        currentPhase: 2,
        status: 'active',          // 'active' | 'defeated'
        rewardClaimed: false,
        combatLog: [
          { time: '10:15', text: 'Tập luyện thể chất sáng: +30 Damage & +15 Stagger!', type: 'attack' },
          { time: '11:30', text: 'Hoàn thành milestone "Architecture": Critical Hit +200 Damage!', type: 'crit' }
        ]
      },

      // Inventory: durable item state
      inventory: {
        unlockedItemIds: [],   // item IDs the player has received
        itemStacks: {},        // { itemId: quantity }
        newItemIds: [],        // items not yet seen in Collection
        defeatRecords: []      // [{ encounterId, villainId, defeatedAt }]
      },

      // Action ledger: idempotency & audit trail
      ledger: {
        completedActionIds: [],  // all submitted action IDs
        transactions: [],        // full transaction log
        grantedRewardIds: []     // encounterId+':victory' grants already awarded
      },

      // Mutable content (quests, tasks, projects, shop)
      questsState: this.deepClone(
        typeof QUESTS_DATA !== 'undefined' ? QUESTS_DATA : { projects: [], dailyQuests: [], tasks: [], rewardShop: [] }
      ),

      // Equipment & Data mutable state (deep-cloned so resets are clean)
      skillsState: this.deepClone(
        typeof SKILLS_DATA !== 'undefined' ? SKILLS_DATA : []
      ),
      suitsState: this.deepClone(
        typeof SUITS_DATA !== 'undefined' ? SUITS_DATA : []
      ),
      gadgetsState: this.deepClone(
        typeof GADGETS_DATA !== 'undefined' ? GADGETS_DATA : []
      ),
      companionsState: this.deepClone(
        typeof COMPANIONS_DATA !== 'undefined' ? COMPANIONS_DATA : (typeof ALLIES_DATA !== 'undefined' ? ALLIES_DATA : [])
      ),
      alliesState: this.deepClone(
        typeof ALLIES_DATA !== 'undefined' ? ALLIES_DATA : []
      ),
      variantsState: this.deepClone(
        typeof SPIDER_PEOPLE_DATA !== 'undefined' ? SPIDER_PEOPLE_DATA : (typeof VARIANTS_DATA !== 'undefined' ? VARIANTS_DATA : [])
      ),
      mapState: {
        selectedDistrictId: 'midtown',
        activeFilter: 'all',
        trackerOnboarded: false
      },
      soundSettings: {
        musicEnabled: false,
        sfxEnabled: true,
        masterVolume: 0.7
      },

      customRewards: [],

      meta: {
        lastSavedAt: new Date().toISOString(),
        lastDailyResetAt: null,
        createdAt: new Date().toISOString()
      }
    };
  }

  // -------------------------------------------------------------------------
  // Migrate V1 → V2: preserve all existing progress
  // -------------------------------------------------------------------------
  migrateV1ToV2(v1State) {
    console.info('[StorageManager] Migrating V1 → V2 …');
    const fresh = this.getInitialV2State();

    // Preserve character progression
    if (v1State.character) {
      Object.assign(fresh.character, v1State.character);
    }

    // Preserve boss state
    if (v1State.currentBossState) {
      const bss = v1State.currentBossState;
      fresh.currentBossState = {
        encounterId: 'enc_' + (bss.villainId || 'docock') + '_01',
        villainId: bss.villainId || 'docock',
        currentHp: bss.currentHp ?? fresh.currentBossState.currentHp,
        maxHp: bss.maxHp ?? fresh.currentBossState.maxHp,
        currentArmor: bss.currentArmor ?? fresh.currentBossState.currentArmor,
        maxArmor: bss.maxArmor ?? fresh.currentBossState.maxArmor,
        stagger: bss.stagger ?? fresh.currentBossState.stagger,
        maxStagger: bss.maxStagger ?? fresh.currentBossState.maxStagger,
        currentPhase: bss.currentPhase ?? 1,
        status: (bss.currentHp <= 0) ? 'defeated' : 'active',
        rewardClaimed: false,
        combatLog: bss.combatLog || []
      };
    }

    // Preserve quests/tasks/projects/shop
    if (v1State.questsState) {
      fresh.questsState = v1State.questsState;
    }

    // Preserve mutable equipment if already stored (not just seed refs)
    if (Array.isArray(v1State.skillsState)) fresh.skillsState = v1State.skillsState;
    if (Array.isArray(v1State.suitsState)) fresh.suitsState = v1State.suitsState;
    if (Array.isArray(v1State.gadgetsState)) fresh.gadgetsState = v1State.gadgetsState;
    if (Array.isArray(v1State.companionsState)) fresh.companionsState = v1State.companionsState;

    if (v1State.soundSettings && typeof v1State.soundSettings === 'object') {
      fresh.soundSettings = {
        musicEnabled: typeof v1State.soundSettings.musicEnabled === 'boolean' ? v1State.soundSettings.musicEnabled : fresh.soundSettings.musicEnabled,
        sfxEnabled: typeof v1State.soundSettings.sfxEnabled === 'boolean' ? v1State.soundSettings.sfxEnabled : fresh.soundSettings.sfxEnabled,
        masterVolume: typeof v1State.soundSettings.masterVolume === 'number' ? v1State.soundSettings.masterVolume : fresh.soundSettings.masterVolume
      };
    }

    // Sync build from character
    fresh.build.equippedSuitId = fresh.character.equippedSuitId;
    fresh.build.companionId = fresh.character.activeCompanionId;
    fresh.build.unlockedSkillIds = fresh.skillsState
      .filter(s => s.unlocked)
      .map(s => s.id);

    fresh.schemaVersion = 2;
    fresh.meta.lastSavedAt = new Date().toISOString();

    return fresh;
  }

  // -------------------------------------------------------------------------
  // load() — parse → migrate → validate → merge defaults → return
  // -------------------------------------------------------------------------
  loadState() {
    // 1. Try V2 key
    try {
      const json = localStorage.getItem(this.storageKeyV2);
      if (json) {
        const parsed = JSON.parse(json);
        const validated = this.validateAndMergeDefaults(parsed);
        if (validated) return validated;
      }
    } catch (e) {
      console.warn('[StorageManager] V2 parse error, trying V1 fallback:', e);
    }

    // 2. Try V1 key migration
    try {
      const jsonV1 = localStorage.getItem(this.storageKeyV1);
      if (jsonV1) {
        const v1 = JSON.parse(jsonV1);
        if (v1 && typeof v1 === 'object') {
          const migrated = this.migrateV1ToV2(v1);
          this.saveState(migrated);
          return migrated;
        }
      }
    } catch (e) {
      console.warn('[StorageManager] V1 migration failed:', e);
    }

    // 3. Fresh state
    const freshState = this.getInitialV2State();
    this.saveState(freshState);
    return freshState;
  }

  // -------------------------------------------------------------------------
  // Validate loaded state and merge any missing defaults
  // -------------------------------------------------------------------------
  validateAndMergeDefaults(state) {
    if (!state || typeof state !== 'object') return null;
    if (state.schemaVersion !== 2) return null;

    // Ensure essential top-level objects exist
    if (!state.character || typeof state.character !== 'object') return null;
    if (typeof state.character.level !== 'number' || state.character.level < 1) return null;
    if (typeof state.character.xp !== 'number' || state.character.xp < 0) return null;
    if (typeof state.character.gold !== 'number' || state.character.gold < 0) return null;

    // Merge missing objects with safe defaults
    const fresh = this.getInitialV2State();

    // Merge progression / masteries
    if (!state.progression || typeof state.progression !== 'object') {
      state.progression = fresh.progression;
    }
    if (!state.progression.masteries || typeof state.progression.masteries !== 'object') {
      state.progression.masteries = fresh.progression.masteries;
    }
    // Ensure all mastery tracks exist
    Object.keys(fresh.progression.masteries).forEach(track => {
      if (!state.progression.masteries[track]) {
        state.progression.masteries[track] = { xp: 0, rank: 0 };
      }
    });

    // Merge build
    if (!state.build || typeof state.build !== 'object') {
      state.build = {
        equippedSuitId: state.character.equippedSuitId || 'advanced_suit',
        equippedGadgetIds: ['web_shooter', 'impact_web'],
        companionId: state.character.activeCompanionId || 'miles_morales',
        unlockedSkillIds: []
      };
    }
    if (!Array.isArray(state.build.equippedGadgetIds)) state.build.equippedGadgetIds = [];
    if (!Array.isArray(state.build.unlockedSkillIds)) state.build.unlockedSkillIds = [];

    // Merge inventory
    if (!state.inventory || typeof state.inventory !== 'object') {
      state.inventory = fresh.inventory;
    }
    if (!Array.isArray(state.inventory.unlockedItemIds)) state.inventory.unlockedItemIds = [];
    if (!state.inventory.itemStacks || typeof state.inventory.itemStacks !== 'object') state.inventory.itemStacks = {};
    if (!Array.isArray(state.inventory.newItemIds)) state.inventory.newItemIds = [];
    if (!Array.isArray(state.inventory.defeatRecords)) state.inventory.defeatRecords = [];

    // Merge ledger
    if (!state.ledger || typeof state.ledger !== 'object') {
      state.ledger = fresh.ledger;
    }
    if (!Array.isArray(state.ledger.completedActionIds)) state.ledger.completedActionIds = [];
    if (!Array.isArray(state.ledger.transactions)) state.ledger.transactions = [];
    if (!Array.isArray(state.ledger.grantedRewardIds)) state.ledger.grantedRewardIds = [];

    // Merge currentBossState
    if (!state.currentBossState || typeof state.currentBossState !== 'object') {
      state.currentBossState = fresh.currentBossState;
    }
    if (!state.currentBossState.encounterId) {
      state.currentBossState.encounterId = 'enc_' + (state.currentBossState.villainId || 'docock') + '_01';
    }
    if (!state.currentBossState.status) {
      state.currentBossState.status = state.currentBossState.currentHp <= 0 ? 'defeated' : 'active';
    }
    if (typeof state.currentBossState.rewardClaimed !== 'boolean') {
      state.currentBossState.rewardClaimed = false;
    }
    if (typeof state.currentBossState.currentPhase !== 'number') {
      state.currentBossState.currentPhase = 1;
    }
    if (!state.currentBossState.mechanicState || typeof state.currentBossState.mechanicState !== 'object') {
      state.currentBossState.mechanicState = {};
    }
    if (typeof state.currentBossState.lastMechanicEvent !== 'string') {
      state.currentBossState.lastMechanicEvent = '';
    }

    // Merge meta
    if (!state.meta || typeof state.meta !== 'object') {
      state.meta = { lastSavedAt: new Date().toISOString(), lastDailyResetAt: null };
    }

    // Merge questsState if missing
    if (!state.questsState) state.questsState = fresh.questsState;
    if (state.questsState && !Array.isArray(state.questsState.goals)) {
      state.questsState.goals = fresh.questsState.goals || [];
    }

    // Merge equipment & compendium arrays if missing (deep-clone from seed)
    if (!Array.isArray(state.skillsState)) state.skillsState = fresh.skillsState;
    if (!Array.isArray(state.suitsState)) state.suitsState = fresh.suitsState;
    if (!Array.isArray(state.gadgetsState)) state.gadgetsState = fresh.gadgetsState;
    if (!Array.isArray(state.companionsState)) state.companionsState = fresh.companionsState;
    if (!Array.isArray(state.alliesState)) state.alliesState = fresh.alliesState;
    if (!Array.isArray(state.variantsState)) state.variantsState = fresh.variantsState;

    // Authoritative static seeds
    const seedVariants = typeof SPIDER_PEOPLE_DATA !== 'undefined' ? SPIDER_PEOPLE_DATA : (typeof VARIANTS_DATA !== 'undefined' ? VARIANTS_DATA : []);
    const seedAllies = typeof ALLIES_DATA !== 'undefined' ? ALLIES_DATA : [];
    const seedSuits = typeof SUITS_DATA !== 'undefined' ? SUITS_DATA : [];
    const seedSkills = typeof SKILLS_DATA !== 'undefined' ? SKILLS_DATA : [];
    const seedGadgets = typeof GADGETS_DATA !== 'undefined' ? GADGETS_DATA : [];

    const variantAliasMap = { 'var_spider_man_india': 'var_spider_man_india_mumbattan' };

    state.variantsState = this.mergeSeedCollection(state.variantsState, seedVariants, variantAliasMap);
    state.alliesState = this.mergeSeedCollection(state.alliesState, seedAllies);
    state.suitsState = this.mergeSeedCollection(state.suitsState, seedSuits);
    state.skillsState = this.mergeSeedCollection(state.skillsState, seedSkills);
    state.gadgetsState = this.mergeSeedCollection(state.gadgetsState, seedGadgets);

    if (!state.mapState || typeof state.mapState !== 'object') {
      state.mapState = fresh.mapState;
    } else {
      if (typeof state.mapState.trackerOnboarded !== 'boolean') {
        state.mapState.trackerOnboarded = false;
      }
    }
    if (!state.soundSettings || typeof state.soundSettings !== 'object') {
      state.soundSettings = { ...fresh.soundSettings };
    } else {
      state.soundSettings = {
        musicEnabled: typeof state.soundSettings.musicEnabled === 'boolean' ? state.soundSettings.musicEnabled : fresh.soundSettings.musicEnabled,
        sfxEnabled: typeof state.soundSettings.sfxEnabled === 'boolean' ? state.soundSettings.sfxEnabled : fresh.soundSettings.sfxEnabled,
        masterVolume: typeof state.soundSettings.masterVolume === 'number' ? state.soundSettings.masterVolume : fresh.soundSettings.masterVolume
      };
    }

    return state;
  }

  // -------------------------------------------------------------------------
  // saveState — always writes to V2 key
  // -------------------------------------------------------------------------
  saveState(state) {
    try {
      if (state.meta) state.meta.lastSavedAt = new Date().toISOString();
      localStorage.setItem(this.storageKeyV2, JSON.stringify(state));
    } catch (e) {
      console.error('[StorageManager] Error saving state:', e);
    }
  }

  // -------------------------------------------------------------------------
  // resetDemoData — genuine fresh deep-clone; no leaked mutations
  // -------------------------------------------------------------------------
  resetDemoData() {
    // Clear both keys so no stale data persists
    localStorage.removeItem(this.storageKeyV2);
    localStorage.removeItem(this.storageKeyV1);
    const initState = this.getInitialV2State();
    this.saveState(initState);
    return initState;
  }

  // -------------------------------------------------------------------------
  // importState — validate before replacing current state
  // Returns { success: boolean, error?: string }
  // -------------------------------------------------------------------------
  importState(jsonString) {
    // Guard: size
    if (jsonString.length > this.MAX_IMPORT_BYTES) {
      return { success: false, error: 'Import file exceeds maximum size (2 MB).' };
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      return { success: false, error: 'Invalid JSON — could not parse file.' };
    }

    // Guard: must be an object
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { success: false, error: 'Invalid import: payload must be a JSON object.' };
    }

    // Guard: schema version
    if (typeof parsed.schemaVersion !== 'number') {
      return { success: false, error: 'Invalid import: missing schemaVersion field.' };
    }
    if (parsed.schemaVersion > this.CURRENT_SCHEMA_VERSION) {
      return { success: false, error: `Unsupported schema version ${parsed.schemaVersion}. This app supports up to version ${this.CURRENT_SCHEMA_VERSION}.` };
    }

    // Migrate V1 if needed
    let toValidate = parsed;
    if (parsed.schemaVersion === 1 || !parsed.schemaVersion) {
      toValidate = this.migrateV1ToV2(parsed);
    }

    // Validate & merge defaults
    const validated = this.validateAndMergeDefaults(toValidate);
    if (!validated) {
      return { success: false, error: 'Import rejected: missing essential fields or invalid numeric values.' };
    }

    this.saveState(validated);
    return { success: true, state: validated };
  }

  // -------------------------------------------------------------------------
  // exportState — returns a JSON string with export metadata
  // -------------------------------------------------------------------------
  exportState(state) {
    const exportPayload = {
      ...state,
      exportedAt: new Date().toISOString(),
      appVersion: 'milestone-01'
    };
    return JSON.stringify(exportPayload, null, 2);
  }
}

window.StorageManager = StorageManager;
