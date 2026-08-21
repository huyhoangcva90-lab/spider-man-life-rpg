/* WEB OPS TRACKER V6 - HUB OVERLAY PANELS (V5 SYSTEMS REUSE) */

export class HubOverlayPanels {
  constructor(stateStore, eventBus, soundController, entryRepo) {
    this.state = stateStore;
    this.bus = eventBus;
    this.sound = soundController;
    this.repo = entryRepo;
    this.modalEl = null;
  }

  init() {
    this.modalEl = document.getElementById('hub-overlay-backdrop');
    if (!this.modalEl) return;

    this.bindEvents();

    this.bus.on('OPEN_HUB_PANEL', (tabName) => this.open(tabName));
  }

  bindEvents() {
    const closeBtn = document.getElementById('hub-modal-close');
    closeBtn?.addEventListener('click', () => this.close());

    const tabs = this.modalEl.querySelectorAll('.hub-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const name = tab.getAttribute('data-tab');
        this.sound.playClick();
        this.switchTab(name);
      });
    });
  }

  open(tabName = 'MISSIONS') {
    if (!this.modalEl) return;
    this.switchTab(tabName);
    this.modalEl.removeAttribute('hidden');
    this.modalEl.removeAttribute('inert');
    this.modalEl.classList.add('active');
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('active');
      this.modalEl.setAttribute('hidden', '');
      this.modalEl.setAttribute('inert', '');
    }
  }

  switchTab(tabName) {
    const tabs = this.modalEl.querySelectorAll('.hub-tab-btn');
    tabs.forEach(t => {
      if (t.getAttribute('data-tab') === tabName) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    const contentBox = document.getElementById('hub-tab-content');
    if (!contentBox) return;

    switch (tabName) {
      case 'OPERATIVE':
        contentBox.innerHTML = this.renderOperativeTab();
        break;
      case 'HIDEOUT':
        contentBox.innerHTML = this.renderHideoutTab();
        break;
      case 'CHRONICLE':
        contentBox.innerHTML = this.renderChronicleTab();
        break;
      case 'MISSIONS':
      default:
        contentBox.innerHTML = this.renderMissionsTab();
        break;
    }
  }

  renderMissionsTab() {
    const entries = this.repo.getAll();
    const confirmedCount = entries.filter(e => e.status === 'CONFIRMED').length;
    const doneCount = entries.filter(e => e.status === 'DONE').length;

    return `
      <div class="hub-panel-inner">
        <h3 style="font-family: var(--font-pixel); font-size: 11px; color: var(--cyan-bright); margin-bottom: 12px;">
          🎯 BẢNG NHIỆM VỤ & TỔNG QUAN TẬP TRUNG
        </h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
          <div style="background: var(--bg-card); border: 1px solid var(--cyan-mid); padding: 10px; border-radius: 4px; text-align: center;">
            <div style="font-family: var(--font-pixel); font-size: 14px; color: var(--cyan-bright);">${entries.length}</div>
            <div style="font-size: 10px; color: var(--text-muted);">Tổng địa điểm</div>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--amber-gold); padding: 10px; border-radius: 4px; text-align: center;">
            <div style="font-family: var(--font-pixel); font-size: 14px; color: var(--amber-gold);">${confirmedCount}</div>
            <div style="font-size: 10px; color: var(--text-muted);">Đã xác nhận</div>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--color-leisure); padding: 10px; border-radius: 4px; text-align: center;">
            <div style="font-family: var(--font-pixel); font-size: 14px; color: var(--color-leisure);">${doneCount}</div>
            <div style="font-size: 10px; color: var(--text-muted);">Hoàn thành</div>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--text-main); line-height: 1.5;">
          Tất cả nhiệm vụ và địa điểm được kết nối trực tiếp với Bản đồ Thực tế V6. Bạn có thể thêm cuộc họp, công việc, việc vặt hoặc đồng bộ trực tiếp từ Notion snapshot.
        </p>
      </div>
    `;
  }

  renderOperativeTab() {
    return `
      <div class="hub-panel-inner" style="display: flex; gap: 16px;">
        <div style="width: 110px; height: 110px; background: #000; border: 2px solid var(--cyan-bright); border-radius: 4px; overflow: hidden; flex-shrink: 0;">
          <img src="./assets/characters/web-operative-v1.png" onError="this.src='../app-v4/assets/characters/web-operative-v1.png'" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="flex: 1;">
          <h3 style="font-family: var(--font-pixel); font-size: 12px; color: var(--cyan-bright);">ĐẶC VỤ WEB OPERATIVE V6</h3>
          <div style="font-size: 11px; color: var(--amber-gold); margin-bottom: 8px;">Cấp độ: LEVEL 60 • TRẠM TRẬN THỰC TẾ</div>
          <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">
            Được trang bị hệ thống định vị GNSS độ chính xác cao, bộ lọc MapLibre GL và kết nối dữ liệu Notion.
          </p>
          <div style="font-family: var(--font-pixel); font-size: 9px; color: var(--cyan-bright);">
            ⚡ KĨ NĂNG: GEOLOCATION • HA VERSINE ROUTING • NOTION SYNC
          </div>
        </div>
      </div>
    `;
  }

  renderHideoutTab() {
    return `
      <div class="hub-panel-inner">
        <h3 style="font-family: var(--font-pixel); font-size: 11px; color: var(--cyan-bright); margin-bottom: 12px;">
          🛠️ CĂN CỨ TRANG BỊ & THIẾT BỊ ĐỊNH VỊ
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div style="background: var(--bg-card); border: 1px solid var(--steel-border); padding: 10px; border-radius: 4px;">
            <div style="font-weight: bold; color: var(--cyan-bright); font-size: 12px;">📡 Cảm biến GPS GNSS V6</div>
            <div style="font-size: 10px; color: var(--text-muted);">Theo dõi độ chính xác thời thực dưới 15m.</div>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--steel-border); padding: 10px; border-radius: 4px;">
            <div style="font-weight: bold; color: var(--color-notion); font-size: 12px;">📝 Trạm dữ liệu Notion API</div>
            <div style="font-size: 10px; color: var(--text-muted);">Đồng bộ master calendar và inbox.</div>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--steel-border); padding: 10px; border-radius: 4px;">
            <div style="font-weight: bold; color: var(--amber-gold); font-size: 12px;">🗺️ Máy quét MapLibre GL</div>
            <div style="font-size: 10px; color: var(--text-muted);">Renderer vector tốc độ cao, hỗ trợ GeoJSON.</div>
          </div>
          <div style="background: var(--bg-card); border: 1px solid var(--steel-border); padding: 10px; border-radius: 4px;">
            <div style="font-weight: bold; color: var(--color-leisure); font-size: 12px;">🔊 Trạm âm thanh Synth 8-bit</div>
            <div style="font-size: 10px; color: var(--text-muted);">Tổng hợp hiệu ứng Web Audio API.</div>
          </div>
        </div>
      </div>
    `;
  }

  renderChronicleTab() {
    const entries = this.repo.getAll();
    const doneEntries = entries.filter(e => e.status === 'DONE');

    return `
      <div class="hub-panel-inner">
        <h3 style="font-family: var(--font-pixel); font-size: 11px; color: var(--cyan-bright); margin-bottom: 12px;">
          📜 NHẬT KÝ HOẠT ĐỘNG THỰC TẾ
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto;">
          ${doneEntries.length === 0
            ? '<div style="color: var(--text-muted); font-size: 11px;">Chưa có địa điểm nào hoàn thành trong nhật ký.</div>'
            : doneEntries.map(e => `
                <div style="background: var(--bg-card); border-left: 3px solid var(--color-leisure); padding: 8px 10px; border-radius: 3px;">
                  <div style="font-weight: bold; color: #fff; font-size: 12px;">${e.title}</div>
                  <div style="font-size: 10px; color: var(--text-muted);">Hoàn thành lúc: ${new Date(e.updatedAt).toLocaleString('vi-VN')} • ${e.address}</div>
                </div>
              `).join('')
          }
        </div>
      </div>
    `;
  }
}
