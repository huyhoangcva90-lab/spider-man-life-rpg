/* WEB OPS TRACKER V6 - STORAGE REPOSITORY */

const SCHEMA_VERSION = 'v6.1.0';
const STORAGE_KEY_ENTRIES = 'v6_map_entries_v1';
const STORAGE_KEY_SETTINGS = 'v6_user_settings_v1';
const STORAGE_KEY_GEOCODE_CACHE = 'v6_geocoder_cache_v1';

export class StorageRepository {
  static getEntries() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ENTRIES);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (parsed.version !== SCHEMA_VERSION) {
        console.warn(`[StorageRepository] Migrating data from ${parsed.version} to ${SCHEMA_VERSION}`);
        // Migration hook if needed in future
      }
      return parsed.records || [];
    } catch (err) {
      console.error('[StorageRepository] Error reading entries:', err);
      return null;
    }
  }

  static saveEntries(records) {
    try {
      const payload = {
        version: SCHEMA_VERSION,
        updatedAt: new Date().toISOString(),
        records
      };
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(payload));
      return true;
    } catch (err) {
      console.error('[StorageRepository] Error saving entries:', err);
      return false;
    }
  }

  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (err) {
      return {};
    }
  }

  static saveSettings(settings) {
    try {
      const existing = this.getSettings();
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ ...existing, ...settings }));
    } catch (err) {
      console.error('[StorageRepository] Error saving settings:', err);
    }
  }

  static getGeocodeCache() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_GEOCODE_CACHE);
      return data ? JSON.parse(data) : {};
    } catch (err) {
      return {};
    }
  }

  static saveGeocodeCache(query, result) {
    try {
      const cache = this.getGeocodeCache();
      cache[query.toLowerCase().trim()] = {
        result,
        cachedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEY_GEOCODE_CACHE, JSON.stringify(cache));
    } catch (err) {
      console.error('[StorageRepository] Error saving geocode cache:', err);
    }
  }
}
