/* WEB OPS TRACKER V6 - MARKER LAYER */

export class MarkerLayer {
  constructor(mapEngine, eventBus, soundController) {
    this.mapEngine = mapEngine;
    this.bus = eventBus;
    this.sound = soundController;
    this.markersMap = new Map(); // entryId -> maplibregl.Marker
    this.userGpsMarker = null;
    this.activeFilter = 'ALL';
    this.selectedEntryId = null;
  }

  getCategoryColor(type) {
    switch (type) {
      case 'MEETING': return '#ff3366';
      case 'PERSON': return '#ff9900';
      case 'PLAN': return '#ffcc00';
      case 'LEISURE': return '#00e676';
      case 'ERRAND': return '#00e5ff';
      case 'WORK': return '#2979ff';
      case 'NOTION_MISSION': return '#d500f9';
      default: return '#00f0ff';
    }
  }

  getCategoryIcon(type) {
    switch (type) {
      case 'MEETING': return '🤝';
      case 'PERSON': return '👤';
      case 'PLAN': return '📅';
      case 'LEISURE': return '☕';
      case 'ERRAND': return '🛒';
      case 'WORK': return '💼';
      case 'NOTION_MISSION': return '📝';
      default: return '📍';
    }
  }

  renderEntries(entries, activeFilter = 'ALL', selectedEntryId = null) {
    this.activeFilter = activeFilter;
    this.selectedEntryId = selectedEntryId;

    // Filter entries
    const visibleEntries = activeFilter === 'ALL'
      ? entries
      : entries.filter(e => e.type === activeFilter);

    // Track existing marker IDs
    const currentIds = new Set(visibleEntries.map(e => e.id));

    // Remove markers that are no longer visible
    for (const [id, marker] of this.markersMap.entries()) {
      if (!currentIds.has(id)) {
        marker.remove();
        this.markersMap.delete(id);
      }
    }

    // Add or update markers
    visibleEntries.forEach(entry => {
      if (this.markersMap.has(entry.id)) {
        const marker = this.markersMap.get(entry.id);
        marker.setLngLat([entry.lng, entry.lat]);
        this.updateMarkerElement(marker.getElement(), entry, entry.id === selectedEntryId);
      } else {
        const marker = this.createMarker(entry, entry.id === selectedEntryId);
        this.markersMap.set(entry.id, marker);
      }
    });
  }

  createMarker(entry, isSelected) {
    const el = document.createElement('div');
    el.className = `custom-pixel-marker ${isSelected ? 'active-selected' : ''}`;
    el.setAttribute('data-id', entry.id);

    this.updateMarkerElement(el, entry, isSelected);

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sound.playSelect();
      this.bus.emit('MARKER_SELECTED', entry.id);
      this.bus.emit('OPEN_DOSSIER', entry);
    });

    const maplibregl = window.maplibregl || this.mapEngine.maplibregl;
    if (!maplibregl || !this.mapEngine.map) return null;

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat([entry.lng, entry.lat])
      .addTo(this.mapEngine.map);

    return marker;
  }

  updateMarkerElement(el, entry, isSelected) {
    const color = this.getCategoryColor(entry.type);
    const icon = this.getCategoryIcon(entry.type);

    el.style.setProperty('--marker-color', color);
    if (isSelected) {
      el.classList.add('active-selected');
    } else {
      el.classList.remove('active-selected');
    }

    el.innerHTML = `
      <div class="marker-pin-body">
        ${isSelected ? '<div class="marker-selected-ring"></div>' : ''}
        <div class="marker-icon-box">${icon}</div>
        <div class="marker-pin-tip"></div>
      </div>
    `;
  }

  updateUserGpsMarker(userLocation) {
    if (!userLocation || !this.mapEngine.map) return;

    const maplibregl = window.maplibregl || this.mapEngine.maplibregl;
    if (!maplibregl) return;

    if (!this.userGpsMarker) {
      const el = document.createElement('div');
      el.className = 'user-gps-marker';
      el.innerHTML = `
        <div class="user-gps-pulse"></div>
        <div class="user-gps-dot"></div>
      `;

      this.userGpsMarker = new maplibregl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(this.mapEngine.map);
    } else {
      this.userGpsMarker.setLngLat([userLocation.lng, userLocation.lat]);
    }
  }
}
