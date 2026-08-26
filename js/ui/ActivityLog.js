/* WEB OPS TRACKER V6 - ACTIVITY LOG UI */

export class ActivityLog {
  constructor(entryRepo, stateStore, eventBus, soundController) {
    this.repo = entryRepo;
    this.state = stateStore;
    this.bus = eventBus;
    this.sound = soundController;
    this.drawerEl = null;
    this.currentSubFilter = 'ALL'; // 'ALL' | 'TODAY' | 'UPCOMING' | 'DONE'
    this.searchQuery = '';
  }

  init() {
    this.drawerEl = document.getElementById('activity-log-drawer');
    if (!this.drawerEl) return;

    this.bindEvents();

    this.bus.on('ENTRIES_LOADED', () => this.render());
    this.bus.on('ENTRY_CREATED', () => this.render());
    this.bus.on('ENTRY_UPDATED', () => this.render());
    this.bus.on('ENTRY_DELETED', () => this.render());
    this.bus.on('FILTER_CHANGED', () => this.render());
    this.bus.on('TOGGLE_DRAWER', (name) => {
      if (name === 'ACTIVITY_LOG') {
        this.toggle();
      } else {
        this.close();
      }
    });
  }

  bindEvents() {
    const closeBtn = document.getElementById('activity-log-close');
    closeBtn?.addEventListener('click', () => this.close());

    // Sub-filter tabs (Tất cả, Hôm nay, Sắp tới, Đã xong)
    const tabs = this.drawerEl.querySelectorAll('.log-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentSubFilter = tab.getAttribute('data-subfilter');
        this.sound.playClick();
        this.render();
      });
    });

    // Search input
    const searchInput = document.getElementById('log-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.render();
    });
  }

  toggle() {
    if (this.drawerEl) {
      const isActive = this.drawerEl.classList.contains('active');
      if (isActive) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  open() {
    if (this.drawerEl) {
      this.drawerEl.removeAttribute('hidden');
      this.drawerEl.removeAttribute('inert');
      this.drawerEl.classList.add('active');
      this.render();
    }
  }

  close() {
    if (this.drawerEl) {
      this.drawerEl.classList.remove('active');
      this.drawerEl.setAttribute('hidden', '');
      this.drawerEl.setAttribute('inert', '');
    }
  }

  render() {
    const container = document.getElementById('activity-log-list');
    if (!container) return;

    let entries = this.repo.getAll();
    const activeCategoryFilter = this.state.get('activeFilter');

    // 1. Filter by global category filter
    if (activeCategoryFilter !== 'ALL') {
      entries = entries.filter(e => e.type === activeCategoryFilter);
    }

    // 2. Filter by sub-filter (Today, Upcoming, Done)
    const todayStr = new Date().toISOString().split('T')[0];
    if (this.currentSubFilter === 'TODAY') {
      entries = entries.filter(e => e.startsAt && e.startsAt.startsWith(todayStr));
    } else if (this.currentSubFilter === 'UPCOMING') {
      entries = entries.filter(e => e.status === 'PLANNED' || e.status === 'CONFIRMED');
    } else if (this.currentSubFilter === 'DONE') {
      entries = entries.filter(e => e.status === 'DONE');
    }

    // 3. Filter by search query
    if (this.searchQuery) {
      entries = entries.filter(e =>
        e.title.toLowerCase().includes(this.searchQuery) ||
        (e.personName && e.personName.toLowerCase().includes(this.searchQuery)) ||
        (e.address && e.address.toLowerCase().includes(this.searchQuery))
      );
    }

    // Sort by date descending
    entries.sort((a, b) => new Date(b.startsAt || b.createdAt) - new Date(a.startsAt || a.createdAt));

    if (entries.length === 0) {
      container.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">
          📭 Không có địa điểm nào phù hợp với bộ lọc.
        </div>
      `;
      return;
    }

    container.innerHTML = entries.map(entry => {
      const typeLabels = {
        MEETING: 'CUỘC HỌP',
        PERSON: 'NGƯỜI NĂNG ĐỘNG',
        PLAN: 'KẾ HOẠCH',
        LEISURE: 'GIẢI TRÍ',
        ERRAND: 'VIỆC VẶT',
        WORK: 'CÔNG VIỆC',
        NOTION_MISSION: 'NHIỆM VỤ NOTION'
      };

      const dateStr = entry.startsAt
        ? new Date(entry.startsAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
        : 'Chưa đặt';

      return `
        <div class="activity-card" data-id="${entry.id}" style="--card-color: ${this.getTypeColor(entry.type)}">
          <div class="activity-card-top">
            <span class="activity-card-title">${entry.title}</span>
            <div>
              ${entry.source === 'DEMO' ? '<span class="activity-type-badge" style="background: var(--amber-gold); color: #000; margin-right: 4px;">DEMO</span>' : ''}
              <span class="activity-type-badge">${typeLabels[entry.type] || entry.type}</span>
            </div>
          </div>
          <div class="activity-card-time">📅 ${dateStr} ${entry.personName ? `• 👤 ${entry.personName}` : ''}</div>
          <div class="activity-card-meta">
            <span>📍 ${entry.address || `${entry.lat.toFixed(4)}, ${entry.lng.toFixed(4)}`}</span>
            <span style="margin-left: auto; font-size: 9px; font-weight: bold; color: ${entry.status === 'DONE' ? 'var(--color-leisure)' : 'var(--amber-gold)'};">
              [${entry.status}]
            </span>
          </div>
        </div>
      `;
    }).join('');

    // Bind card clicks
    container.querySelectorAll('.activity-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const entry = this.repo.getById(id);
        if (entry) {
          this.sound.playSelect();
          this.state.setState({ selectedEntryId: entry.id });
          this.bus.emit('FLY_TO_LOCATION', { lat: entry.lat, lng: entry.lng, zoom: 16 });
          this.bus.emit('OPEN_DOSSIER', entry);
        }
      });
    });
  }

  getTypeColor(type) {
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
}
