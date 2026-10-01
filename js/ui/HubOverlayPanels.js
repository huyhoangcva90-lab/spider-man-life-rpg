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
        if (section === 'NATIVE') {
          window.location.href = './life-reset/index.html';
          return;
        }
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
      ['QUESTS:TODO', 'NOTION QUESTS', 'Todo & Nhiệm vụ đời thực từ Notion', '✓', 'cyan'],
      ['QUESTS:HABITS', 'HABITS & STREAK', 'Kỷ luật hàng ngày & Hồi phục HP', '🔥', 'red'],
      ['QUESTS:PATROL', 'PATROL SCHEDULE', 'Ca tuần tra Tobey · Andrew · Tom', '◷', 'cyan'],
      ['HERO:SUITS', 'SUITS WARDROBE', 'Tủ đồ thời trang & đổi Skin', '👕', 'amber'],
      ['HERO:ROSTER', 'SPIDER-VERSE', '77 Biến thể Nhện đa vũ trụ', '🕷️', 'red'],
      ['HERO:SKILLS', 'SKILL TREE', 'Combat · Web · Spider-Sense', '⚡', 'cyan'],
      ['HERO:GADGETS', 'GADGETS', 'Impact Web · Drone · EMP', '⌁', 'green'],
      ['ARCHIVE:BESTIARY', 'BESTIARY', 'Thư viện Kẻ thù Bosses & Minions', '👹', 'red'],
      ['ARCHIVE:BACKPACKS', 'BACKPACKS', '55 Ba lô kỷ niệm Peter Parker', '🎒', 'amber'],
      ['ARCHIVE:BADGES', 'BADGES', '37 Huy hiệu danh dự lịch sử', '🎖️', 'amber'],
      ['CHRONICLE:RHYTHM', 'CIRCADIAN RHYTHM', 'Đồng hồ nhịp sinh học 24H', '⏰', 'green'],
      ['CHRONICLE:JOURNAL', 'PETER JOURNAL', 'Sổ tay nhật ký & bài học mỗi ngày', '📓', 'paper'],
      ['CHRONICLE:GYM', 'GYM OS', 'Rèn thể lực tăng vĩnh viễn ATK/DEF', '💪', 'red'],
      ['CITY', 'CITY MAP', 'Bản đồ thực địa & Định vị GPS', '▦', 'paper'],
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
