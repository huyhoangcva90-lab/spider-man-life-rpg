/* WEB OPS TRACKER V6 - UNLOCATED MISSION QUEUE UI */

export class UnlocatedMissionQueue {
  constructor(notionAdapter, eventBus, soundController) {
    this.notion = notionAdapter;
    this.bus = eventBus;
    this.sound = soundController;
    this.drawerEl = null;
  }

  init() {
    this.drawerEl = document.getElementById('unlocated-queue-drawer');
    if (!this.drawerEl) return;

    this.bindEvents();

    this.bus.on('TOGGLE_DRAWER', (name) => {
      if (name === 'UNLOCATED_QUEUE') {
        this.toggle();
      } else {
        this.close();
      }
    });

    const updateQueueUI = () => {
      this.updateBadge();
      if (this.drawerEl && !this.drawerEl.hasAttribute('hidden')) {
        this.render();
      }
    };

    this.bus.on('ENTRIES_LOADED', updateQueueUI);
    this.bus.on('ENTRY_CREATED', updateQueueUI);
    this.bus.on('ENTRY_DELETED', updateQueueUI);

    this.bus.on('MAP_CLICK', (coords) => {
      const activeAssign = this.drawerEl.getAttribute('data-assigning-id');
      if (activeAssign) {
        this.sound.playSuccess();
        const entry = this.notion.assignLocation(activeAssign, coords.lat, coords.lng);
        this.drawerEl.removeAttribute('data-assigning-id');
        this.render();
        if (entry) {
          this.bus.emit('FLY_TO_LOCATION', { lat: entry.lat, lng: entry.lng, zoom: 16 });
          this.bus.emit('OPEN_DOSSIER', entry);
        }
      }
    });
  }

  bindEvents() {
    const closeBtn = document.getElementById('unlocated-queue-close');
    closeBtn?.addEventListener('click', () => this.close());
  }

  toggle() {
    if (this.drawerEl) {
      if (this.drawerEl.classList.contains('active')) {
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

  updateBadge() {
    const missions = this.notion.getUnlocatedMissions();
    const countBadge = document.getElementById('unlocated-count-badge');
    if (countBadge) countBadge.textContent = missions.length;
  }

  render() {
    this.updateBadge();
    const container = document.getElementById('unlocated-queue-list');
    if (!container) return;

    const missions = this.notion.getUnlocatedMissions();

    if (missions.length === 0) {
      container.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--color-leisure); font-size: 12px;">
          ✅ Tất cả nhiệm vụ Notion đã được định vị trên bản đồ thực tế!
        </div>
      `;
      return;
    }

    container.innerHTML = missions.map(item => `
      <div class="activity-card" style="--card-color: var(--color-notion)">
        <div class="activity-card-top">
          <span class="activity-card-title">${item.title}</span>
          <span class="activity-type-badge" style="background: var(--color-notion)">NOTION</span>
        </div>
        <div class="activity-card-time">📅 ${item.date ? new Date(item.date).toLocaleDateString('vi-VN') : 'Không có ngày'} • Độ ưu tiên: ${item.priority}</div>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="btn-primary assign-pin-btn" data-id="${item.id}" style="font-size: 9px; padding: 6px 10px;">
            📍 Chọn vị trí trên Bản đồ
          </button>
          <a href="${item.sourceUrl}" target="_blank" class="btn-secondary" style="font-size: 9px; padding: 6px 10px; text-decoration: none;">
            🔗 Xem Notion
          </a>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.assign-pin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.sound.playClick();
        this.drawerEl.setAttribute('data-assigning-id', id);
        alert('👉 Vui lòng nhấp vào bất kỳ vị trí nào trên Bản đồ thực tế để gán tọa độ cho nhiệm vụ này!');
        this.close();
      });
    });
  }
}
