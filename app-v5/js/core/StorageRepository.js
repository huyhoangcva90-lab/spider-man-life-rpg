/* ==========================================================================
   V5 STORAGE REPOSITORY
   Local storage persistence repository for game state
   ========================================================================== */

const STORAGE_KEY = 'v5_cyber_operative_state_v1';

export class StorageRepository {
  static loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('[StorageRepository] Error reading state from localStorage:', e);
    }
    return null;
  }

  static saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[StorageRepository] Error saving state to localStorage:', e);
    }
  }

  static clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[StorageRepository] Error clearing localStorage:', e);
    }
  }
}
