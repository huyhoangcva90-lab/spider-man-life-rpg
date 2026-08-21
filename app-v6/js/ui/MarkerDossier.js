/* WEB OPS TRACKER V6 - MARKER DOSSIER UI */
import { RoutingAdapter } from '../map/RoutingAdapter.js';

export class MarkerDossier {
  constructor(entryRepo, stateStore, eventBus, soundController) {
    this.repo = entryRepo;
    this.state = stateStore;
    this.bus = eventBus;
    this.sound = soundController;
    this.modalEl = null;
    this.currentEntry = null;
  }

  init() {
    this.modalEl = document.getElementById('dossier-modal-backdrop');
    if (!this.modalEl) return;

    this.bindEvents();

    this.bus.on('OPEN_DOSSIER', (entry) => this.open(entry));
  }

  bindEvents() {
    const closeBtn = document.getElementById('dossier-modal-close');
    closeBtn?.addEventListener('click', () => this.close());

    document.getElementById('dossier-btn-edit')?.addEventListener('click', () => {
      if (this.currentEntry) {
        this.close();
        this.sound.playClick();
        this.bus.emit('OPEN_EDITOR', this.currentEntry);
      }
    });

    document.getElementById('dossier-btn-done')?.addEventListener('click', () => {
      if (this.currentEntry) {
        this.repo.markDone(this.currentEntry.id);
        this.sound.playSuccess();
        this.close();
      }
    });

    document.getElementById('dossier-btn-delete')?.addEventListener('click', () => {
      if (this.currentEntry && confirm('Bạn có chắc chắn muốn xóa địa điểm này khỏi bản đồ?')) {
        this.repo.delete(this.currentEntry.id);
        this.sound.playWarning();
        this.close();
      }
    });
  }

  open(entry) {
    if (!this.modalEl || !entry) return;
    this.currentEntry = entry;

    const userLoc = this.state.get('userLocation');
    const directionsInfo = RoutingAdapter.getDirectionsInfo(
      userLoc?.lat,
      userLoc?.lng,
      entry.lat,
      entry.lng
    );

    const typeNames = {
      MEETING: '🤝 CUỘC HỌP / GẶP MẶT',
      PERSON: '👤 NGƯỜI NĂNG ĐỘNG / ĐỐI TÁC',
      PLAN: '📅 KẾ HOẠCH / HẸN GIỜ',
      LEISURE: '☕ GIẢI TRÍ / NGHỈ NGƠI',
      ERRAND: '🛒 VIỆC VẶT / MUA SẮM',
      WORK: '💼 CÔNG VIỆC / CHI NHÁNH',
      NOTION_MISSION: '📝 NHIỆM VỤ NOTION'
    };

    document.getElementById('dossier-title').textContent = entry.title;
    document.getElementById('dossier-type-badge').textContent = (entry.source === 'DEMO' ? 'DEMO • ' : '') + (typeNames[entry.type] || entry.type);
    document.getElementById('dossier-status-select').value = entry.status;

    // Status change listener
    const statusSelect = document.getElementById('dossier-status-select');
    statusSelect.onchange = (e) => {
      const newStatus = e.target.value;
      this.repo.update(entry.id, { status: newStatus });
      this.sound.playClick();
    };

    document.getElementById('dossier-coords').textContent = `${entry.lat.toFixed(5)}, ${entry.lng.toFixed(5)}`;
    document.getElementById('dossier-address').textContent = entry.address || 'Chưa cập nhật địa chỉ';
    document.getElementById('dossier-time').textContent = entry.startsAt
      ? new Date(entry.startsAt).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
      : 'Không có thời gian đặt';

    document.getElementById('dossier-person').textContent = entry.personName || 'N/A';
    document.getElementById('dossier-notes').textContent = entry.notes || 'Không có ghi chú thêm.';

    // Distance display
    const distEl = document.getElementById('dossier-distance-text');
    if (distEl) {
      if (userLoc) {
        distEl.innerHTML = `📏 Cách vị trí GPS của bạn: <strong>${directionsInfo.formattedDistance}</strong> (${directionsInfo.label})`;
      } else {
        distEl.innerHTML = `📡 Bật GPS để tính khoảng cách trực tiếp từ vị trí của bạn.`;
      }
    }

    // External navigation links
    const navGrid = document.getElementById('dossier-nav-grid');
    if (navGrid) {
      navGrid.innerHTML = `
        <a href="${directionsInfo.externalLinks.googleMaps}" target="_blank" class="nav-link-btn">
          <span>🗺️ Google Maps</span>
        </a>
        <a href="${directionsInfo.externalLinks.appleMaps}" target="_blank" class="nav-link-btn">
          <span>🍏 Apple Maps</span>
        </a>
        <a href="${directionsInfo.externalLinks.openStreetMap}" target="_blank" class="nav-link-btn">
          <span>🌐 OpenStreetMap</span>
        </a>
      `;
    }

    // Notion link
    const notionBox = document.getElementById('dossier-notion-box');
    if (notionBox) {
      if (entry.notionPageUrl) {
        notionBox.style.display = 'block';
        notionBox.innerHTML = `
          <a href="${entry.notionPageUrl}" target="_blank" class="btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; margin-top: 6px;">
            📝 MỞ TRANG NOTION CHÍNH THỨC
          </a>
        `;
      } else {
        notionBox.style.display = 'none';
      }
    }

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
}
