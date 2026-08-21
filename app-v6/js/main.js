/* WEB OPS TRACKER V6 - MAIN APPLICATION BOOTSTRAPPER */

import { EventBus } from './core/EventBus.js';
import { StateStore } from './core/StateStore.js';
import { SoundController } from './core/SoundController.js';
import { MapEngine } from './map/MapEngine.js';
import { MarkerLayer } from './map/MarkerLayer.js';
import { GeolocationController } from './map/GeolocationController.js';
import { GeocoderAdapter } from './map/GeocoderAdapter.js';
import { MapEntryRepository } from './data/MapEntryRepository.js';
import { GeoJsonTransfer } from './data/GeoJsonTransfer.js';
import { NotionAdapter } from './integrations/notion/NotionAdapter.js';
import { BootSequence } from './ui/BootSequence.js';
import { TrackerFrame } from './ui/TrackerFrame.js';
import { SearchPanel } from './ui/SearchPanel.js';
import { EntryEditor } from './ui/EntryEditor.js';
import { ActivityLog } from './ui/ActivityLog.js';
import { MarkerDossier } from './ui/MarkerDossier.js';
import { UnlocatedMissionQueue } from './ui/UnlocatedMissionQueue.js';
import { HubOverlayPanels } from './ui/HubOverlayPanels.js';
import { MapGuideModal } from './ui/MapGuideModal.js';

class App {
  constructor() {
    this.bus = new EventBus();
    this.state = new StateStore(this.bus);
    this.sound = new SoundController(this.state);
    
    this.repo = new MapEntryRepository(this.bus);
    this.geocoder = new GeocoderAdapter();
    this.notion = new NotionAdapter(this.bus, this.repo);

    this.mapEngine = new MapEngine(this.bus, this.sound);
    this.markerLayer = new MarkerLayer(this.mapEngine, this.bus, this.sound);
    this.geolocation = new GeolocationController(this.state, this.sound);

    this.trackerFrame = new TrackerFrame(this.state, this.bus, this.sound);
    this.searchPanel = new SearchPanel(this.geocoder, this.bus, this.sound);
    this.entryEditor = new EntryEditor(this.repo, this.bus, this.sound, this.geocoder);
    this.activityLog = new ActivityLog(this.repo, this.state, this.bus, this.sound);
    this.markerDossier = new MarkerDossier(this.repo, this.state, this.bus, this.sound);
    this.unlocatedQueue = new UnlocatedMissionQueue(this.notion, this.bus, this.sound);
    this.hubOverlay = new HubOverlayPanels(this.state, this.bus, this.sound, this.repo);
    this.mapGuide = new MapGuideModal(this.state, this.bus, this.sound, GeoJsonTransfer, this.repo);
    this.bootSequence = new BootSequence(this.sound);
  }

  async init() {
    console.log('[App] Starting WEB OPS TRACKER V6 initialization...');

    // 1. Initialize UI components
    this.trackerFrame.init();
    this.searchPanel.init();
    this.entryEditor.init();
    this.activityLog.init();
    this.markerDossier.init();
    this.unlocatedQueue.init();
    this.hubOverlay.init();
    this.mapGuide.init();

    // 2. Initialize Map Engine (Defaults to HCMC fallback: lng 106.7009, lat 10.7769)
    await this.mapEngine.init('map', 'CARTO_DARK');

    // 3. Load Notion snapshot & update Notion queue & badge immediately
    await this.notion.loadSnapshot();
    this.unlocatedQueue.render();

    // 4. Bind map & repo events
    this.bindCoreEvents();

    // 5. Initial Marker render
    this.updateMarkers();
    this.trackerFrame.updateFilterCounts(this.repo.getAll());

    // NOTE: GPS is NOT requested automatically on boot per requirements.
    // Geolocation must be initiated from a user gesture (e.g. clicking Center GPS / Track button).

    // 6. Run Onboarding Boot Sequence
    this.bootSequence.run(() => {
      console.log('[App] Boot sequence finished.');
    });
  }

  bindCoreEvents() {
    // Global Escape Key accessibility handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (document.getElementById('editor-modal-backdrop')?.classList.contains('active')) {
          this.entryEditor.close();
        } else if (document.getElementById('dossier-modal-backdrop')?.classList.contains('active')) {
          this.markerDossier.close();
        } else if (document.getElementById('hub-overlay-backdrop')?.classList.contains('active')) {
          this.hubOverlay.close();
        } else if (document.getElementById('map-guide-modal-backdrop')?.classList.contains('active')) {
          this.mapGuide.close();
        } else if (document.getElementById('activity-log-drawer')?.classList.contains('active')) {
          this.activityLog.close();
        } else if (document.getElementById('unlocated-queue-drawer')?.classList.contains('active')) {
          this.unlocatedQueue.close();
        }
      }
    });

    // Repo entry changes -> re-render markers & update counts
    const refreshUI = () => {
      const entries = this.repo.getAll();
      this.updateMarkers();
      this.trackerFrame.updateFilterCounts(entries);
    };

    this.bus.on('ENTRIES_LOADED', refreshUI);
    this.bus.on('ENTRY_CREATED', refreshUI);
    this.bus.on('ENTRY_UPDATED', refreshUI);
    this.bus.on('ENTRY_DELETED', refreshUI);

    // Filter change
    this.bus.on('FILTER_CHANGED', (filter) => {
      this.updateMarkers();
    });

    // Marker select
    this.bus.on('MARKER_SELECTED', (id) => {
      this.state.setState({ selectedEntryId: id });
      this.updateMarkers();
    });

    // Map fly-to
    this.bus.on('FLY_TO_LOCATION', ({ lat, lng, zoom }) => {
      this.mapEngine.flyTo(lat, lng, zoom || 15);
    });

    // Map click -> open add editor if not assigning unlocated item
    this.bus.on('MAP_CLICK', async (coords) => {
      const isAssigning = document.getElementById('unlocated-queue-drawer')?.hasAttribute('data-assigning-id');
      if (!isAssigning) {
        this.sound.playClick();
        const address = await this.geocoder.reverseGeocode(coords.lat, coords.lng);
        this.bus.emit('OPEN_EDITOR', {
          lat: coords.lat,
          lng: coords.lng,
          address,
          source: 'MAP_CLICK'
        });
      }
    });

    // Map camera controls
    this.bus.on('MAP_ZOOM_IN', () => this.mapEngine.zoomIn());
    this.bus.on('MAP_ZOOM_OUT', () => this.mapEngine.zoomOut());
    this.bus.on('RESET_NORTH', () => this.mapEngine.resetNorth());

    // Center GPS clicked by user gesture
    this.bus.on('CENTER_GPS', () => {
      const loc = this.state.get('userLocation');
      if (loc) {
        this.mapEngine.flyTo(loc.lat, loc.lng, 16);
      } else {
        // Request GPS tracking on user gesture
        this.geolocation.startTracking();
      }
    });

    // GPS update -> marker & track mode
    this.bus.on('GPS_UPDATED', (location) => {
      if (location) {
        this.markerLayer.updateUserGpsMarker(location);
        if (this.state.get('trackingMode')) {
          this.mapEngine.flyTo(location.lat, location.lng, 16);
        }
      }
    });
  }

  updateMarkers() {
    const entries = this.repo.getAll();
    const activeFilter = this.state.get('activeFilter');
    const selectedId = this.state.get('selectedEntryId');
    this.markerLayer.renderEntries(entries, activeFilter, selectedId);
  }
}

// Instantiate and start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
