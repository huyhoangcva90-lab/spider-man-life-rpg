const CURRENT_VERSION = 2;

export class GameSaveManager {
  constructor(storage = window.localStorage, options = {}) {
    this.storage = storage;
    this.key = options.key || 'spidey-action-rpg-save-v2';
    this.legacyKey = options.legacyKey || 'spidey-action-rpg-phase-one-v1';
  }

  load(defaultState, migrateLegacy) {
    const current = this.read(this.key);
    if (current) return this.merge(defaultState, current);

    const legacy = this.read(this.legacyKey);
    if (legacy) {
      const migrated = migrateLegacy(legacy, defaultState);
      this.save(migrated);
      console.info('[SAVE] Migrated Phase One save to version 2');
      return migrated;
    }
    return structuredClone(defaultState);
  }

  read(key) {
    let raw = null;
    try {
      raw = this.storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(`[SAVE] Could not read ${key}`, error);
      if (raw) this.backup(key, raw);
      return null;
    }
  }

  save(state) {
    const payload = { ...state, saveVersion: CURRENT_VERSION, updatedAt: Date.now() };
    try {
      this.storage.setItem(this.key, JSON.stringify(payload));
      return true;
    } catch (error) {
      console.warn('[SAVE] Auto-save failed; session state remains active', error);
      return false;
    }
  }

  export(state) {
    return JSON.stringify({ ...state, saveVersion: CURRENT_VERSION, exportedAt: Date.now() }, null, 2);
  }

  import(serialized, defaultState) {
    const parsed = JSON.parse(serialized);
    if (!parsed || typeof parsed !== 'object') throw new Error('Save JSON is not an object');
    if (Number(parsed.saveVersion || 0) > CURRENT_VERSION) throw new Error('Save comes from a newer game version');
    const merged = this.merge(defaultState, parsed);
    this.save(merged);
    return merged;
  }

  reset() {
    try { this.storage.removeItem(this.key); } catch (error) { console.warn('[SAVE] Reset failed', error); }
  }

  backup(key, raw) {
    try { this.storage.setItem(`${key}-corrupt-backup-${Date.now()}`, raw); } catch (error) { console.warn('[SAVE] Backup failed', error); }
  }

  merge(base, saved) {
    return {
      ...structuredClone(base),
      ...saved,
      player: { ...base.player, ...(saved.player || {}) },
      quest: { ...base.quest, ...(saved.quest || {}) },
      city: { ...base.city, ...(saved.city || {}) },
      battle: {
        ...base.battle,
        ...(saved.battle || {}),
        cooldowns: { ...base.battle.cooldowns, ...(saved.battle?.cooldowns || {}) },
        charges: { ...base.battle.charges, ...(saved.battle?.charges || {}) }
      },
      progression: { ...base.progression, ...(saved.progression || {}) },
      daily: { ...base.daily, ...(saved.daily || {}) },
      settings: { ...base.settings, ...(saved.settings || {}) },
      inventory: { ...base.inventory, ...(saved.inventory || {}) }
    };
  }
}

export const GAME_SAVE_VERSION = CURRENT_VERSION;

