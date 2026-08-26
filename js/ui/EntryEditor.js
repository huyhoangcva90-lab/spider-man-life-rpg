/* WEB OPS TRACKER V6 - ENTRY EDITOR MODAL */

export class EntryEditor {
  constructor(entryRepo, eventBus, soundController, geocoderAdapter) {
    this.repo = entryRepo;
    this.bus = eventBus;
    this.sound = soundController;
    this.geocoder = geocoderAdapter;
    this.modalEl = null;
    this.editingId = null;
  }

  init() {
    this.modalEl = document.getElementById('editor-modal-backdrop');
    if (!this.modalEl) return;

    this.bindEvents();

    this.bus.on('OPEN_EDITOR', (initialData) => this.open(initialData));
  }

  bindEvents() {
    const form = document.getElementById('entry-editor-form');
    const closeBtn = document.getElementById('editor-modal-close');
    const cancelBtn = document.getElementById('editor-cancel-btn');
    const reverseBtn = document.getElementById('btn-reverse-geocode');

    closeBtn?.addEventListener('click', () => this.close());
    cancelBtn?.addEventListener('click', () => this.close());

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.save();
    });

    reverseBtn?.addEventListener('click', async () => {
      const lat = parseFloat(document.getElementById('editor-lat').value);
      const lng = parseFloat(document.getElementById('editor-lng').value);
      if (!isNaN(lat) && !isNaN(lng)) {
        this.sound.playClick();
        reverseBtn.textContent = '⏳ Đang tra cứu...';
        const address = await this.geocoder.reverseGeocode(lat, lng);
        document.getElementById('editor-address').value = address;
        reverseBtn.textContent = '📍 Lấy địa chỉ';
      }
    });
  }

  open(initialData = null) {
    if (!this.modalEl) return;

    this.editingId = initialData?.id || null;
    const isEdit = !!this.editingId;

    document.getElementById('editor-modal-title').textContent = isEdit
      ? '✏️ CHỈNH SỬA ĐỊA ĐIỂM / MỤC TIÊU'
      : '➕ THÊM ĐỊA ĐIỂM MỚI TRÊN BẢN ĐỒ';

    const now = new Date();
    const defaultTimeStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    document.getElementById('editor-type').value = initialData?.type || 'MEETING';
    document.getElementById('editor-title').value = initialData?.title || '';
    document.getElementById('editor-person').value = initialData?.personName || '';
    document.getElementById('editor-lat').value = initialData?.lat || 21.0285;
    document.getElementById('editor-lng').value = initialData?.lng || 105.8542;
    document.getElementById('editor-address').value = initialData?.address || '';
    document.getElementById('editor-starts-at').value = initialData?.startsAt ? initialData.startsAt.slice(0, 16) : defaultTimeStr;
    document.getElementById('editor-status').value = initialData?.status || 'PLANNED';
    document.getElementById('editor-notion-url').value = initialData?.notionPageUrl || '';
    document.getElementById('editor-notes').value = initialData?.notes || '';

    this.modalEl.removeAttribute('hidden');
    this.modalEl.removeAttribute('inert');
    this.modalEl.classList.add('active');
    setTimeout(() => document.getElementById('editor-title')?.focus(), 50);
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('active');
      this.modalEl.setAttribute('hidden', '');
      this.modalEl.setAttribute('inert', '');
    }
  }

  save() {
    const type = document.getElementById('editor-type').value;
    const title = document.getElementById('editor-title').value.trim();
    const personName = document.getElementById('editor-person').value.trim();
    const lat = parseFloat(document.getElementById('editor-lat').value);
    const lng = parseFloat(document.getElementById('editor-lng').value);
    const address = document.getElementById('editor-address').value.trim();
    const startsAt = new Date(document.getElementById('editor-starts-at').value).toISOString();
    const status = document.getElementById('editor-status').value;
    const notionPageUrl = document.getElementById('editor-notion-url').value.trim();
    const notes = document.getElementById('editor-notes').value.trim();

    if (!title) {
      alert('Vui lòng nhập tiêu đề địa điểm!');
      return;
    }

    if (isNaN(lat) || isNaN(lng)) {
      alert('Tọa độ Vĩ độ / Kinh độ không hợp lệ!');
      return;
    }

    const payload = {
      type,
      title,
      personName,
      lat,
      lng,
      address,
      startsAt,
      status,
      notionPageUrl,
      notes
    };

    if (this.editingId) {
      this.repo.update(this.editingId, payload);
    } else {
      this.repo.create(payload);
    }

    this.sound.playSuccess();
    this.close();
  }
}
