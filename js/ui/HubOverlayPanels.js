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
      ['QUESTS:ACTIVE', 'ACTIVE QUESTS', 'Nhiệm vụ đang mở trong Notion', '✓', 'red'],
      ['HABITS:TODAY', 'DAILY PATROL', 'Thói quen và hồi phục Energy', '⌁', 'green'],
      ['HABITS:RESET 66', 'LIFE RESET 66', 'Chiến dịch thói quen 66 ngày', '66', 'amber'],
      ['QUESTS:PATROL', 'PATROL SCHEDULE', 'Ca tuần tra Tobey · Andrew · Tom', '◷', 'cyan'],
      ['HERO:SUITS', 'SUITS WARDROBE', 'Tủ đồ thời trang & đổi Skin', '👕', 'amber'],
      ['HERO:ROSTER', 'SPIDER-VERSE', '77 Biến thể Nhện đa vũ trụ', '🕷️', 'red'],
      ['HERO:SKILLS', 'SKILL TREE', 'Combat · Web · Spider-Sense', '⚡', 'cyan'],
      ['HERO:GADGETS', 'GADGETS', 'Impact Web · Drone · EMP', '⌁', 'green'],
      ['FIELD:BESTIARY', 'BESTIARY', 'Hồ sơ kẻ địch Bosses & Minions', '◉', 'red'],
      ['FIELD:BACKPACKS', 'BACKPACKS', 'Kỷ vật Peter Parker', '▣', 'amber'],
      ['HERO:BADGES', 'SPIDER BADGES', 'Huy hiệu từ Notion', '✦', 'amber'],
      ['FIELD:TIME', 'PARKER TIME', 'Nhịp sinh học và phiên tập trung', '◷', 'green'],
      ['FIELD:JOURNAL', 'FIELD NOTES', 'Nhật ký Peter Parker', '▤', 'paper'],
      ['FIELD:GYM', 'PARKER TRAINING', 'Giáo án và nhật ký tập từ Notion', '◆', 'red'],
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
