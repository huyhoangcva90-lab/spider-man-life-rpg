/* WEB OPS TRACKER V6 - EVENT BUS */

export class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, payload) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(payload);
      } catch (err) {
        console.error(`Error in event listener for '${event}':`, err);
      }
    });
  }
}

export const events = {
  MAP_CLICK: 'MAP_CLICK',
  ENTRY_CREATED: 'ENTRY_CREATED',
  ENTRY_UPDATED: 'ENTRY_UPDATED',
  ENTRY_DELETED: 'ENTRY_DELETED',
  ENTRIES_LOADED: 'ENTRIES_LOADED',
  MARKER_SELECTED: 'MARKER_SELECTED',
  FILTER_CHANGED: 'FILTER_CHANGED',
  GPS_UPDATED: 'GPS_UPDATED',
  GPS_STATUS_CHANGED: 'GPS_STATUS_CHANGED',
  SEARCH_SUBMITTED: 'SEARCH_SUBMITTED',
  FLY_TO_LOCATION: 'FLY_TO_LOCATION',
  OPEN_DOSSIER: 'OPEN_DOSSIER',
  OPEN_EDITOR: 'OPEN_EDITOR',
  OPEN_HUB_PANEL: 'OPEN_HUB_PANEL',
  NOTION_ASSIGN_LOCATION: 'NOTION_ASSIGN_LOCATION',
  SOUND_TOGGLED: 'SOUND_TOGGLED',
  MAP_PROVIDER_CHANGED: 'MAP_PROVIDER_CHANGED'
};
