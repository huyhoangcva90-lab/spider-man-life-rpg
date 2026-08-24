/* WEB OPS TRACKER V6 - STATE STORE */

export class StateStore {
  constructor(eventBus) {
    this.bus = eventBus;
    let soundEnabled = true;
    try {
      const savedSound = localStorage.getItem('spidey-sfx-enabled');
      soundEnabled = savedSound === null ? true : savedSound === '1';
      if (localStorage.getItem('spidey-welcome-audio-v2') !== '1') {
        soundEnabled = true;
        localStorage.setItem('spidey-sfx-enabled', '1');
        localStorage.setItem('spidey-welcome-audio-v2', '1');
      }
    } catch { /* default to sound on */ }
    this.state = {
      activeFilter: 'ALL',          // 'ALL' | 'MEETING' | 'PERSON' | 'PLAN' | 'LEISURE' | 'ERRAND' | 'WORK' | 'NOTION_MISSION'
      selectedEntryId: null,
      userLocation: null,           // { lat, lng, accuracy, timestamp }
      gpsStatus: 'STANDBY',        // 'STANDBY' | 'ACQUIRING' | 'ACTIVE' | 'DENIED' | 'UNSUPPORTED'
      trackingMode: false,          // Auto-center map on GPS updates
      soundEnabled,
      activeDrawer: null,           // null | 'ACTIVITY_LOG' | 'UNLOCATED_QUEUE'
      activeModal: null,            // null | 'DOSSIER' | 'EDITOR' | 'HUB_OVERLAY' | 'MAP_GUIDE' | 'SETTINGS'
      activeHubTab: 'HOME',         // 'HOME' | 'LIFE_OS' | 'ARENAS' | 'RPG' | 'CHRONICLE'
      unlocatedNotionItem: null,    // Item waiting for pin drop assignment
      searchQuery: '',
      mapProvider: 'OSM_RASTER'     // 'CARTO_DARK' | 'OSM_RASTER' | 'MAPTILER'
    };
  }

  get(key) {
    return this.state[key];
  }

  getState() {
    return { ...this.state };
  }

  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Emit fine-grained events based on state changes
    if (updates.activeFilter !== undefined && updates.activeFilter !== prevState.activeFilter) {
      this.bus.emit('FILTER_CHANGED', this.state.activeFilter);
    }
    if (updates.selectedEntryId !== undefined && updates.selectedEntryId !== prevState.selectedEntryId) {
      this.bus.emit('MARKER_SELECTED', this.state.selectedEntryId);
    }
    if (updates.userLocation !== undefined) {
      this.bus.emit('GPS_UPDATED', this.state.userLocation);
    }
    if (updates.gpsStatus !== undefined && updates.gpsStatus !== prevState.gpsStatus) {
      this.bus.emit('GPS_STATUS_CHANGED', this.state.gpsStatus);
    }
    if (updates.soundEnabled !== undefined && updates.soundEnabled !== prevState.soundEnabled) {
      try { localStorage.setItem('spidey-sfx-enabled', this.state.soundEnabled ? '1' : '0'); } catch { /* state remains usable */ }
      this.bus.emit('SOUND_TOGGLED', this.state.soundEnabled);
    }
  }
}
