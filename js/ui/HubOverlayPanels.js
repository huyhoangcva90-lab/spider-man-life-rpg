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
      content.querySelector('[data-private-logout]')?.addEventListener('click', () => {
        window.location.assign('/logout');
      });
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
      ['QUESTS:APP', 'QUEST', 'Việc từ Notion · hôm nay, quá hạn và đã xong', '✓', 'cyan'],
      ['HABITS:APP', 'HABIT', 'Check Habit, báo cáo và hành trình 66 ngày', '▦', 'green'],
      ['FIELD:SYSTEMS', 'SPIDER APPS', 'Trung tâm Gym, Time, Journal và công cụ', '⌘', 'cyan'],
      ['FIELD:PLACES', 'PLACE MAP', 'Sổ địa chỉ, danh mục và chỉ đường', '⌖', 'green'],
      ['CITY', 'CITY MAP', 'Bản đồ nhiệm vụ và địa điểm', '⌖', 'cyan'],
      ['HERO:PROFILE', 'HERO', 'Hồ sơ, trang phục, kỹ năng, map và huy hiệu', '🕷️', 'red'],
      ['FIELD:ENEMIES', 'BESTIARY', 'Hồ sơ kẻ địch Bosses & Minions', '◉', 'red'],
      ['ARCHIVE:BESTIARY', 'GAME ARCHIVE', 'Bestiary, backpacks và badges bản game cũ', '▣', 'red'],
      ['SETTINGS', 'GAME SETTINGS', 'Âm thanh, hiệu ứng, sao lưu save', '⚙', 'paper']
    ];

    return `<section class="hub-panel-inner hub-panel-inner--apps">
      <div class="life-os-launcher">
        <a class="life-os-app life-os-app--red" href="./battle-lab/">
          <span class="life-os-app-icon">⚔</span><span><strong>ĐẤU THỬ THEO LƯỢT</strong><small>Trang thử riêng · chọn chiêu và đối thủ · chưa nối Notion</small></span><b>→</b>
        </a>
        <a class="life-os-app life-os-app--cyan" href="./battle-lab/clip-library.html">
          <span class="life-os-app-icon">▶</span><span><strong>HOẠT ẢNH SPIDER-MAN</strong><small>Xem 47 hoạt ảnh gốc, chọn động tác và điều chỉnh tốc độ</small></span><b>→</b>
        </a>
        ${apps.map(([id, title, copy, icon, tone]) => `
          <button class="life-os-app life-os-app--${tone}" data-game-menu-target="${id}">
            <span class="life-os-app-icon">${icon}</span>
            <span><strong>${title}</strong><small>${copy}</small></span>
            <b>→</b>
          </button>`).join('')}
        ${window.location.hostname === 'spider-life-private.pages.dev' ? `
          <button class="life-os-app life-os-app--paper" data-private-logout>
            <span class="life-os-app-icon">↪</span>
            <span><strong>ĐĂNG XUẤT</strong><small>Khóa lại Spider Life trên thiết bị này</small></span>
            <b>→</b>
          </button>` : ''}
      </div>
    </section>`;
  }
}
