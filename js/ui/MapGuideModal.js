/* WEB OPS TRACKER V6 - MAP GUIDE & SETTINGS MODAL */

export class MapGuideModal {
  constructor(stateStore, eventBus, soundController, geoJsonTransfer, entryRepo) {
    this.state = stateStore;
    this.bus = eventBus;
    this.sound = soundController;
    this.transfer = geoJsonTransfer;
    this.repo = entryRepo;
    this.modalEl = null;
  }

  init() {
    this.modalEl = document.getElementById('map-guide-modal-backdrop');
    if (!this.modalEl) return;

    this.bindEvents();

    this.bus.on('OPEN_MODAL', (name) => {
      if (name === 'MAP_GUIDE') {
        this.open();
      }
    });
  }

  bindEvents() {
    const closeBtn = document.getElementById('map-guide-modal-close');
    closeBtn?.addEventListener('click', () => this.close());

    // Export GeoJSON
    document.getElementById('btn-export-geojson')?.addEventListener('click', () => {
      this.sound.playClick();
      const entries = this.repo.getAll();
      this.transfer.exportGeoJSON(entries);
    });

    // Import GeoJSON
    const fileInput = document.getElementById('import-geojson-input');
    document.getElementById('btn-import-geojson')?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const imported = await this.transfer.parseGeoJSONFile(file);
          if (imported.length > 0) {
            this.repo.replaceAll(imported);
            this.sound.playSuccess();
            alert(`✅ Đã nhập thành công ${imported.length} địa điểm từ tệp GeoJSON!`);
            this.close();
          }
        } catch (err) {
          alert(`❌ Lỗi nhập GeoJSON: ${err.message}`);
        }
      }
    });
    // Load Demo Data
    document.getElementById('btn-load-demo')?.addEventListener('click', () => {
      this.sound.playClick();
      this.repo.loadDemoData();
      alert('✅ Đã tải dữ liệu mẫu (Demo Data). Tất cả địa điểm demo được gắn thẻ DEMO.');
    });

    // Clear Demo Data
    document.getElementById('btn-clear-demo')?.addEventListener('click', () => {
      this.sound.playClick();
      this.repo.clearDemoData();
      alert('🧹 Đã xóa tất cả dữ liệu demo khỏi bản đồ.');
    });
  }

  open() {
    if (this.modalEl) {
      this.modalEl.removeAttribute('hidden');
      this.modalEl.removeAttribute('inert');
      this.modalEl.classList.add('active');
    }
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('active');
      this.modalEl.setAttribute('hidden', '');
      this.modalEl.setAttribute('inert', '');
    }
  }
}
