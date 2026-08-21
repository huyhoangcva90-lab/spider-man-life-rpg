/* WEB OPS TRACKER V6 - GEOCODER ADAPTER */
import { MapProviderConfig } from './MapProviderConfig.js';
import { StorageRepository } from '../core/StorageRepository.js';

export class GeocoderAdapter {
  constructor() {
    this.lastRequestTimestamp = 0;
    this.minRequestIntervalMs = 1000; // Rate limit to max 1 req/sec
  }

  async search(query) {
    if (!query || !query.trim()) return [];
    const cleanQuery = query.trim().toLowerCase();

    // Check local cache first
    const cache = StorageRepository.getGeocodeCache();
    if (cache[cleanQuery] && Date.now() - cache[cleanQuery].cachedAt < 24 * 3600 * 1000) {
      console.log('[GeocoderAdapter] Returning cached result for:', cleanQuery);
      return cache[cleanQuery].result;
    }

    // Rate limiting throttle
    const now = Date.now();
    const elapsed = now - this.lastRequestTimestamp;
    if (elapsed < this.minRequestIntervalMs) {
      await new Promise(res => setTimeout(res, this.minRequestIntervalMs - elapsed));
    }
    this.lastRequestTimestamp = Date.now();

    try {
      const endpoint = MapProviderConfig.getGeocoderEndpoint();
      const url = `${endpoint}?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'vi,en;q=0.9',
          'User-Agent': 'WebOpsTrackerV6/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Geocoder HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const results = data.map(item => ({
        id: item.place_id,
        title: item.display_name.split(',')[0],
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        attribution: 'Data © OpenStreetMap contributors'
      }));

      // Cache result
      StorageRepository.saveGeocodeCache(cleanQuery, results);
      return results;
    } catch (err) {
      console.error('[GeocoderAdapter] Geocoding failed:', err);
      return [];
    }
  }

  async reverseGeocode(lat, lng) {
    try {
      const endpoint = MapProviderConfig.getReverseGeocoderEndpoint();
      const url = `${endpoint}?format=json&lat=${lat}&lon=${lng}`;

      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'vi,en;q=0.9',
          'User-Agent': 'WebOpsTrackerV6/1.0'
        }
      });

      if (!response.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      const data = await response.json();
      return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch (err) {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }
}
