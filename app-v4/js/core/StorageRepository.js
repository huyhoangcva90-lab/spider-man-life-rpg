/* ==========================================================================
   V4 STORAGE REPOSITORY (LOCALSTORAGE PERSISTENCE)
   ========================================================================== */

import { STORAGE_KEY, SCHEMA_VERSION } from '../config/constants.js';

export class StorageRepository {
  constructor(storageKey = STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  /**
   * Load stored state from LocalStorage or return initial fallback state if invalid/missing
   * @param {Object} fallbackState 
   * @returns {Object}
   */
  load(fallbackState) {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        console.log('[StorageRepository] No existing V4 state found. Seeding initial canonical state.');
        this.save(fallbackState);
        return JSON.parse(JSON.stringify(fallbackState));
      }

      const parsed = JSON.parse(raw);
      if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION || !parsed.activeEncounter || !parsed.loadout) {
        console.warn(`[StorageRepository] Outdated or partial state. Merging with initial canonical state.`);
        const merged = Object.assign({}, fallbackState, parsed, {
          schemaVersion: SCHEMA_VERSION,
          activeEncounter: parsed.activeEncounter || fallbackState.activeEncounter,
          loadout: parsed.loadout || fallbackState.loadout,
          ledger: parsed.ledger || fallbackState.ledger || [],
          user: Object.assign({}, fallbackState.user, parsed.user || {})
        });
        this.save(merged);
        return merged;
      }

      return parsed;
    } catch (err) {
      console.error('[StorageRepository] Error reading from LocalStorage:', err);
      return JSON.parse(JSON.stringify(fallbackState));
    }
  }

  /**
   * Save canonical state object to LocalStorage
   * @param {Object} state 
   * @returns {boolean} Success status
   */
  save(state) {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(this.storageKey, serialized);
      return true;
    } catch (err) {
      console.error('[StorageRepository] Error writing to LocalStorage:', err);
      return false;
    }
  }

  /**
   * Clear V4 storage
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (err) {
      console.error('[StorageRepository] Error clearing LocalStorage:', err);
    }
  }
}
