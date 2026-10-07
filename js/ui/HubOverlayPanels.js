/* Game-only side menu. Life OS remains a separate URL, outside the action UI. */

export class HubOverlayPanels {
  constructor(stateStore, eventBus, soundController) {
    this.state = stateStore;
    this.bus = eventBus;
    this.sound = soundController;
    this.modalEl = null;
  }

  init() {
    this.modalEl = document.getElementById('hub-overlay-backdrop');
    if (!this.modalEl) return;
    document.getElementById('hub-modal-close')?.addEventListener('click', () => this.close());
    this.bus.on('OPEN_HUB_PANEL', () => this.open());
  }

  open() {
    if (!this.modalEl) return;
    const content = document.getElementById('hub-tab-content');
    if (content) {
      content.innerHTML = this.renderApps();
      content.querySelectorAll('[data-game-menu-target]').forEach((button) => button.addEventListener('click', () => {
        this.sound.playSelect();
        const [section, tab] = button.dataset.gameMenuTarget.split(':');
        this.close();
        this.bus.emit('GAME_MENU_TARGET', { section, tab });
      }));
    }
    this.modalEl.removeAttribute('hidden');
    this.modalEl.removeAttribute('inert');
    this.modalEl.classList.add('active');
  }

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
    this.modalEl.setAttribute('hidden', '');
    this.modalEl.setAttribute('inert', '');
  }

  renderApps() {
    const apps = [
      ['QUESTS:TODAY', 'TODAY QUESTS', 'Việc cần làm hôm nay từ Notion', '✓', 'cyan'],
      ['QUESTS:MAIN', 'MAIN QUESTS', 'Tuyến nhiệm vụ chính theo Type', '◆', 'red'],
      ['QUESTS:DAILY', 'DAILY QUESTS', 'Nhiệm vụ lặp lại mỗi ngày', '↻', 'green'],
      ['HABITS:TODAY', 'LIFE RESET', 'Habit hôm nay và hồi phục Energy', '66', 'green'],
      ['HABITS:PROGRESS', 'HELLO HABIT', 'Xem tiến độ bằng các ô vuông', '▦', 'cyan'],
      ['HABITS:66 DAYS', '66 DAY PATH', 'Lộ trình xây kỷ luật 66 ngày', '66', 'amber'],
      ['FIELD:SYSTEMS', 'SPIDER APPS', 'Trung tâm Gym, Time, Journal và công cụ', '⌘', 'cyan'],
      ['FIELD:PLACES', 'PLACE MAP', 'Sổ địa chỉ, danh mục và chỉ đường', '⌖', 'green'],
      ['HERO:SUITS', 'SUITS WARDROBE', 'Tủ đồ thời trang & đổi Skin', '👕', 'amber'],
      ['HERO:ROSTER', 'SPIDER-VERSE', '77 Biến thể Nhện đa vũ trụ', '🕷️', 'red'],
      ['HERO:SKILLS', 'SKILL TREE', 'Combat · Web · Spider-Sense', '⚡', 'cyan'],
      ['HERO:GADGETS', 'GADGETS', 'Impact Web · Drone · EMP', '⌁', 'green'],
      ['FIELD:ENEMIES', 'BESTIARY', 'Hồ sơ kẻ địch Bosses & Minions', '◉', 'red'],
      ['HERO:BADGES', 'SPIDER BADGES', 'Huy hiệu từ Notion', '✦', 'amber'],
      ['SETTINGS', 'GAME SETTINGS', 'Âm thanh, hiệu ứng, sao lưu save', '⚙', 'paper']
    ];

    return `<section class="hub-panel-inner hub-panel-inner--apps">
      <div class="life-os-launcher">
        ${apps.map(([id, title, copy, icon, tone]) => `
          <button class="life-os-app life-os-app--${tone}" data-game-menu-target="${id}">
            <span class="life-os-app-icon">${icon}</span>
            <span><strong>${title}</strong><small>${copy}</small></span>
            <b>→</b>
          </button>`).join('')}
      </div>
    </section>`;
  }
}
