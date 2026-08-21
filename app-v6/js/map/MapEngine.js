/* WEB OPS TRACKER V6 - MAP ENGINE */
import { MapProviderConfig } from './MapProviderConfig.js';

export class MapEngine {
  constructor(eventBus, soundController, fallbackCenter = { lng: 106.7009, lat: 10.7769 }) {
    this.bus = eventBus;
    this.sound = soundController;
    this.map = null;
    this.isLoaded = false;
    this.currentProvider = 'CARTO_DARK';
    this.fallbackCenter = fallbackCenter;
  }

  async init(containerId = 'map', providerType = 'CARTO_DARK', customFallback = null) {
    if (customFallback) this.fallbackCenter = customFallback;
    this.currentProvider = providerType;
    const providerConfig = MapProviderConfig.getProviderConfig(providerType);

    if (typeof window.maplibregl === 'undefined') {
      console.error('[MapEngine] MapLibre GL JS library not loaded');
      this.showOfflineGridNotice();
      return false;
    }

    try {
      this.map = new window.maplibregl.Map({
        container: containerId,
        style: providerConfig.styleUrl,
        center: [this.fallbackCenter.lng, this.fallbackCenter.lat], // Default fallback: Ho Chi Minh City
        zoom: 13,
        pitch: 15,
        bearing: 0,
        attributionControl: false
      });

      // Custom compact attribution
      this.map.addControl(new window.maplibregl.AttributionControl({
        compact: true,
        customAttribution: providerConfig.attribution
      }), 'bottom-right');

      this.map.on('load', () => {
        this.isLoaded = true;
        console.log('[MapEngine] MapLibre GL initialized successfully');
      });

      window.addEventListener('resize', () => {
        if (this.map) {
          this.map.resize();
        }
      });

      this.map.on('error', (e) => {
        console.warn('[MapEngine] MapLibre error (network/tiles):', e);
        this.showOfflineGridNotice();
      });

      // Map background click event
      this.map.on('click', (e) => {
        this.bus.emit('MAP_CLICK', {
          lat: parseFloat(e.lngLat.lat.toFixed(6)),
          lng: parseFloat(e.lngLat.lng.toFixed(6))
        });
      });

      return true;
    } catch (err) {
      console.error('[MapEngine] Map initialization failed:', err);
      this.showOfflineGridNotice();
      return false;
    }
  }

  showOfflineGridNotice() {
    let notice = document.querySelector('.offline-grid-banner');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'offline-grid-banner';
      notice.innerHTML = `⚠️ MẠNG BẢN ĐỒ GIỚI HẠN - CHẾ ĐỘ THỜI TRỰC KHÔNG KHẢ DỤNG`;
      document.querySelector('.frame-main-content')?.appendChild(notice);
    }
  }

  flyTo(lat, lng, zoom = 15) {
    if (!this.map) return;
    this.map.flyTo({
      center: [lng, lat],
      zoom,
      speed: 1.4,
      curve: 1.2,
      essential: true
    });
  }

  fitBounds(boundsList) {
    if (!this.map || !boundsList || boundsList.length === 0) return;
    if (typeof window.maplibregl === 'undefined') return;

    const bounds = new window.maplibregl.LngLatBounds();
    boundsList.forEach(([lat, lng]) => bounds.extend([lng, lat]));

    this.map.fitBounds(bounds, {
      padding: { top: 60, bottom: 60, left: 60, right: 60 },
      maxZoom: 16
    });
  }

  resetNorth() {
    if (!this.map) return;
    this.map.easeTo({
      pitch: 0,
      bearing: 0,
      duration: 500
    });
  }

  zoomIn() {
    if (this.map) this.map.zoomIn();
  }

  zoomOut() {
    if (this.map) this.map.zoomOut();
  }
}
