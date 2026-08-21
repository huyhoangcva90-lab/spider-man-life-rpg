/* WEB OPS TRACKER V6 - TRACKER FRAME CONTROLLER */

export class TrackerFrame {
  constructor(stateStore, eventBus, soundController) {
    this.state = stateStore;
    this.bus = eventBus;
    this.sound = soundController;
  }

  init() {
    this.bindClock();
    this.bindFilters();
    this.bindRightControls();
    this.bindTopControls();
    this.bindCallout();
    this.updateGpsStatusDisplay();

    this.bus.on('GPS_STATUS_CHANGED', () => this.updateGpsStatusDisplay());
    this.bus.on('GPS_UPDATED', (loc) => this.updateGpsLocationDisplay(loc));
    this.bus.on('FILTER_CHANGED', (filter) => this.updateFilterUI(filter));
    this.bus.on('SOUND_TOGGLED', (enabled) => this.updateSoundBtn(enabled));
  }

  bindClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    const updateTime = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('vi-VN', { hour12: false });
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  bindFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.sound.playClick();
        this.state.setState({ activeFilter: filter });
      });
    });
  }

  updateFilterUI(activeFilter) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === activeFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updateFilterCounts(entries) {
    const counts = {
      ALL: entries.length,
      MEETING: entries.filter(e => e.type === 'MEETING').length,
      PERSON: entries.filter(e => e.type === 'PERSON').length,
      PLAN: entries.filter(e => e.type === 'PLAN').length,
      LEISURE: entries.filter(e => e.type === 'LEISURE').length,
      ERRAND: entries.filter(e => e.type === 'ERRAND').length,
      WORK: entries.filter(e => e.type === 'WORK').length,
      NOTION_MISSION: entries.filter(e => e.type === 'NOTION_MISSION').length
    };

    Object.keys(counts).forEach(key => {
      const countEl = document.querySelector(`.filter-btn[data-filter="${key}"] .filter-count`);
      if (countEl) countEl.textContent = counts[key];
    });
  }

  bindRightControls() {
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('MAP_ZOOM_IN');
    });

    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('MAP_ZOOM_OUT');
    });

    document.getElementById('btn-center-gps')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('CENTER_GPS');
    });

    document.getElementById('btn-reset-north')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('RESET_NORTH');
    });

    const trackBtn = document.getElementById('btn-track-toggle');
    trackBtn?.addEventListener('click', () => {
      const current = this.state.get('trackingMode');
      const next = !current;
      this.state.setState({ trackingMode: next });
      trackBtn.classList.toggle('active', next);
      this.sound.playClick();
    });
  }

  bindTopControls() {
    // Avatar profile / Operative Hub
    document.getElementById('avatar-trigger')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('OPEN_HUB_PANEL', 'OPERATIVE');
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    soundBtn?.addEventListener('click', () => {
      const current = this.state.get('soundEnabled');
      this.state.setState({ soundEnabled: !current });
    });

    // Activity Log Button
    document.getElementById('btn-activity-log')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('TOGGLE_DRAWER', 'ACTIVITY_LOG');
    });

    // Unlocated Missions Button
    document.getElementById('btn-unlocated-missions')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('TOGGLE_DRAWER', 'UNLOCATED_QUEUE');
    });

    // Add Entry Button
    document.getElementById('btn-add-entry')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('OPEN_EDITOR', null);
    });

    // Map Guide Button
    document.getElementById('btn-map-guide')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('OPEN_MODAL', 'MAP_GUIDE');
    });

    // Hub Overlay Menu
    document.getElementById('btn-hub-menu')?.addEventListener('click', () => {
      this.sound.playClick();
      this.bus.emit('OPEN_HUB_PANEL', 'MISSIONS');
    });
  }

  updateSoundBtn(enabled) {
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) {
      btn.innerHTML = enabled ? '🔊 SFX' : '🔇 MUTE';
      btn.classList.toggle('active', enabled);
    }
  }

  updateGpsStatusDisplay() {
    const status = this.state.get('gpsStatus');
    const location = this.state.get('userLocation');
    const badge = document.getElementById('gps-status-text');
    if (!badge) return;

    switch (status) {
      case 'ACTIVE':
        badge.textContent = `GPS ±${location ? location.accuracy : '0'}m`;
        badge.style.color = 'var(--color-leisure)';
        badge.title = location ? `GPS Fix: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : '';
        break;
      case 'ACQUIRING':
        badge.textContent = 'Đang xin quyền';
        badge.style.color = 'var(--amber-gold)';
        badge.title = 'Đang yêu cầu quyền định vị GPS...';
        break;
      case 'DENIED':
        badge.textContent = 'GPS bị từ chối';
        badge.style.color = 'var(--color-meeting)';
        badge.title = 'Quyền định vị GPS đã bị từ chối.';
        break;
      case 'UNAVAILABLE':
      case 'UNSUPPORTED':
        badge.textContent = 'GPS không khả dụng';
        badge.style.color = 'var(--text-muted)';
        badge.title = 'GPS không khả dụng trên trình duyệt hoặc thiết bị này.';
        break;
      case 'STANDBY':
      default:
        badge.textContent = 'GPS chưa bật';
        badge.style.color = 'var(--cyan-bright)';
        badge.title = 'Vị trí mặc định — bật GPS để định vị chính xác';
    }
  }

  updateGpsLocationDisplay(location) {
    const tickerGps = document.getElementById('ticker-gps-readout');
    const status = this.state.get('gpsStatus');
    if (!tickerGps) return;

    if (status === 'ACTIVE' && location) {
      tickerGps.textContent = `• GPS FIX: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)} (±${location.accuracy}m)`;
    } else if (status === 'DENIED') {
      tickerGps.textContent = `• GPS FIX: GPS bị từ chối`;
    } else if (status === 'UNAVAILABLE') {
      tickerGps.textContent = `• GPS FIX: GPS không khả dụng`;
    } else if (status === 'ACQUIRING') {
      tickerGps.textContent = `• GPS FIX: Đang xin quyền...`;
    } else {
      tickerGps.textContent = `• GPS FIX: GPS chưa bật (Vị trí mặc định — bật GPS để định vị chính xác)`;
    }
  }

  bindCallout() {
    const closeBtn = document.getElementById('callout-close-btn');
    const callout = document.getElementById('operative-callout');
    closeBtn?.addEventListener('click', () => {
      callout?.classList.add('hidden');
    });
  }
}
