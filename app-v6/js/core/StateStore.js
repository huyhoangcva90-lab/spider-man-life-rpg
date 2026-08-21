/* WEB OPS TRACKER V6 - STATE STORE */

export class StateStore {
  constructor(eventBus) {
    this.bus = eventBus;
    this.state = {
      activeFilter: 'ALL',          // 'ALL' | 'MEETING' | 'PERSON' | 'PLAN' | 'LEISURE' | 'ERRAND' | 'WORK' | 'NOTION_MISSION'
      selectedEntryId: null,
      userLocation: null,           // { lat, lng, accuracy, timestamp }
      gpsStatus: 'STANDBY',        // 'STANDBY' | 'ACQUIRING' | 'ACTIVE' | 'DENIED' | 'UNSUPPORTED'
      trackingMode: false,          // Auto-center map on GPS updates
      soundEnabled: true,
      activeDrawer: null,           // null | 'ACTIVITY_LOG' | 'UNLOCATED_QUEUE'
      activeModal: null,            // null | 'DOSSIER' | 'EDITOR' | 'HUB_OVERLAY' | 'MAP_GUIDE' | 'SETTINGS'
      activeHubTab: 'MISSIONS',     // 'MISSIONS' | 'OPERATIVE' | 'HIDEOUT' | 'CHRONICLE'
      unlocatedNotionItem: null,    // Item waiting for pin drop assignment
      searchQuery: '',
      mapProvider: 'CARTO_DARK'     // 'CARTO_DARK' | 'OSM_RASTER' | 'MAPTILER'
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
      this.bus.emit('SOUND_TOGGLED', this.state.soundEnabled);
    }
  }
}
