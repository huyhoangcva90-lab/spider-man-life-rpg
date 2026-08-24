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
      ['QUESTS:MAIN', 'STORY', 'Chapter và Main Quest', '◆', 'red'],
      ['QUESTS:DAILY', 'QUEST LOG', 'Main · Side · Daily', '✓', 'cyan'],
      ['TIMETABLE:SCHEDULE', 'TIMETABLE', 'Tobey · Andrew · Tom patrol', '◷', 'cyan'],
      ['LIFE:DOPAMINE', 'LIFE SYSTEMS', 'Dopamine · Nhịp sinh học', '⚡', 'green'],
      ['VERSE:ROSTER', 'SPIDER-VERSE', 'Hero, Ally và Team', '◉', 'amber'],
      ['HERO:SKILLS', 'SKILL TREE', 'Combat · Web · Spider-Sense', '⚡', 'cyan'],
      ['HERO:GADGETS', 'GADGETS', 'Impact Web · Drone · EMP', '⌁', 'green'],
      ['CITY', 'CITY', 'District và Random Crime', '▦', 'paper'],
      ['HERO:INVENTORY', 'INVENTORY', 'Material và unlock', '▣', 'amber'],
      ['SETTINGS', 'SETTINGS', 'Map, data và âm thanh', '⚙', 'paper']
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
