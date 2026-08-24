/* SPIDEY LIFE TRACKER — contextual hub projections over canonical map entries */

export class HubOverlayPanels {
  constructor(stateStore, eventBus, soundController, entryRepo, lifeRpg) {
    this.state = stateStore;
    this.bus = eventBus;
    this.sound = soundController;
    this.repo = entryRepo;
    this.lifeRpg = lifeRpg;
    this.modalEl = null;
  }

  init() {
    this.modalEl = document.getElementById('hub-overlay-backdrop');
    if (!this.modalEl) return;
    document.getElementById('hub-modal-close')?.addEventListener('click', () => this.close());
    this.modalEl.querySelectorAll('.hub-tab-btn').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.sound.playClick();
        this.switchTab(tab.dataset.tab);
      });
    });
    this.bus.on('OPEN_HUB_PANEL', (tabName) => this.open(tabName));
    this.bus.on('RPG_UPDATED', () => {
      if (this.state.get('activeHubTab') === 'RPG') this.switchTab('RPG');
    });
  }

  open(tabName = 'HOME') {
    if (!this.modalEl) return;
    this.switchTab(tabName);
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

  switchTab(tabName = 'HOME') {
    const supportedTabs = new Set(['HOME', 'LIFE_OS', 'ARENAS', 'RPG', 'CHRONICLE']);
    const nextTab = supportedTabs.has(tabName) ? tabName : 'HOME';
    this.state.setState({ activeHubTab: nextTab });
    this.modalEl.querySelectorAll('.hub-tab-btn').forEach((tab) => {
      const selected = tab.dataset.tab === nextTab;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    const contentBox = document.getElementById('hub-tab-content');
    if (!contentBox) return;
    const renderers = {
      HOME: () => this.renderHome(),
      LIFE_OS: () => this.renderLifeOs(),
      ARENAS: () => this.renderArenas(),
      RPG: () => this.renderRpg(),
      CHRONICLE: () => this.renderChronicle()
    };
    contentBox.innerHTML = renderers[nextTab]();
    if (nextTab === 'RPG') this.bindRpgActions(contentBox);
  }

  getStats() {
    const entries = this.repo.getAll();
    return {
      entries,
      active: entries.filter((entry) => !['DONE', 'CANCELLED'].includes(entry.status)),
      confirmed: entries.filter((entry) => entry.status === 'CONFIRMED'),
      done: entries.filter((entry) => entry.status === 'DONE'),
      notion: entries.filter((entry) => entry.type === 'NOTION_MISSION')
    };
  }

  renderHome() {
    const stats = this.getStats();
    const completion = stats.entries.length ? Math.round((stats.done.length / stats.entries.length) * 100) : 0;
    return `
      <section class="hub-panel-inner">
        <div class="hub-panel-heading">WHAT MATTERS RIGHT NOW? <span>MAP DATA // LIVE</span></div>
        <div class="hub-grid">
          ${this.stat('ACTIVE', stats.active.length, 'Nhiệm vụ có thể hành động')}
          ${this.stat('CONFIRMED', stats.confirmed.length, 'Đã chốt thời gian / địa điểm')}
          ${this.stat('COMPLETE', `${completion}%`, `${stats.done.length} mission đã kết thúc`)}
        </div>
        <div class="hub-grid">
          ${this.zone('NOW', 'Chọn một marker đỏ trên bản đồ hoặc tạo mission mới để bắt đầu hành động.', 'red')}
          ${this.zone('STATUS', `${stats.notion.length} mission từ Notion đang dùng chung nguồn dữ liệu với tracker.`, 'green')}
          ${this.zone('ALERTS', stats.active.length ? `${stats.active.length} mission vẫn cần chú ý.` : 'Không có cảnh báo đang mở.', 'amber')}
        </div>
      </section>`;
  }

  renderLifeOs() {
    const apps = [
      ['today', 'HABIT HÔM NAY', 'Quick capture', '✓', 'red'],
      ['routine', 'NHỊP SINH HỌC', 'Routine · Cloud sync', '◉', 'cyan'],
      ['dopamine', 'DOPAMINE MENU', 'Intentional reward · Cloud sync', '⚡', 'amber'],
      ['timetable', 'TIMETABLE', '24h live city clock', '◷', 'cyan'],
      ['habits', 'THÓI QUEN', 'Daily streak system', '⌁', 'green'],
      ['journal', 'NHẬT KÝ', 'Life chronicle', '✎', 'paper'],
      ['gym', 'GYM OS', 'Train · Log · Grow', '◆', 'red']
    ];
    return `
      <section class="hub-panel-inner">
        <div class="hub-panel-heading">SPIDER LIFE OS // DAILY SYSTEMS <span>ONE WEB, ONE SIGNAL</span></div>
        <div class="life-os-launcher">
          ${apps.map(([id, title, copy, icon, tone]) => `
            <a class="life-os-app life-os-app--${tone}" href="./life-os/#${id}">
              <span class="life-os-app-icon">${icon}</span>
              <span><strong>${title}</strong><small>${copy}</small></span>
              <b>OPEN →</b>
            </a>`).join('')}
        </div>
        <div class="life-os-cloud-note"><i></i><strong>DOPAMINE + NHỊP SINH HỌC</strong><span>Lưu online trên Gambit Cloud; không còn tách dữ liệu theo từng trình duyệt.</span></div>
      </section>`;
  }

  renderArenas() {
    return `
      <section class="hub-panel-inner">
        <div class="hub-panel-heading">SELECT ARENA <span>CONTEXT CHANGES, DATA DOES NOT</span></div>
        <div class="hub-grid">
          ${this.zone('BLACK ROOM', 'FOCUS // Thực thi current task, timer và next action.', 'red')}
          ${this.zone('CAFE HOUSE', 'STUDY // Learn → Note → Recall → Apply.', 'amber')}
          ${this.zone('WHITE ROOM', 'GROWTH // Check-in → Train → Reflect.')}
          ${this.zone('GREEN HOUSE', 'RECOVERY // Nghỉ, sleep signal và nervous-system reset.', 'green')}
          ${this.zone('GOLDEN VAULT', 'FINANCE // Record → Review → Decide.', 'amber')}
          ${this.zone("HERO'S VISION", 'IDENTITY // Tầm nhìn, life areas và future self.', 'red')}
        </div>
      </section>`;
  }

  renderRpg() {
    const attributes = ['AGILITY', 'POWER', 'INTELLECT', 'FOCUS', 'DISCIPLINE', 'WILLPOWER'];
    const rpg = this.lifeRpg.getSnapshot();
    const { character, boss, streak, inventory } = rpg;
    const xpPercent = Math.min(100, Math.round((character.xp / character.xpToNext) * 100));
    const hpPercent = Math.max(0, Math.round((boss.currentHp / boss.maxHp) * 100));
    const staggerPercent = Math.min(100, Math.round((boss.stagger / boss.maxStagger) * 100));
    const finisherReady = boss.status === 'ACTIVE' && boss.stagger >= boss.maxStagger;
    const lastLoot = inventory.loot[0]?.name || 'NO RAID LOOT YET';
    return `
      <section class="hub-panel-inner">
        <div class="hub-panel-heading">OPERATIVE PROFILE <span>MISSION DATA // LIVE</span></div>
        <div class="rpg-summary-grid">
          <div><span>LEVEL</span><strong>${character.level}</strong></div>
          <div><span>XP</span><strong>${character.xp}/${character.xpToNext}</strong></div>
          <div><span>WEB COINS</span><strong>${character.gold}</strong></div>
          <div><span>STREAK</span><strong>${streak.current}D</strong></div>
        </div>
        <div class="rpg-xp-track" aria-label="Tiến độ XP ${xpPercent}%"><i style="--value:${xpPercent}%"></i></div>
        <article class="boss-raid-card ${boss.status === 'DEFEATED' ? 'boss-raid-card--defeated' : ''}">
          <div class="boss-raid-header">
            <div><span>RAID ${boss.raid} // ${boss.status}</span><strong>${boss.name}</strong></div>
            <b>WEAKNESS: ${boss.weakness}</b>
          </div>
          <div class="boss-meter"><span>HP</span><div><i style="--value:${hpPercent}%"></i></div><b>${boss.currentHp}/${boss.maxHp}</b></div>
          <div class="boss-meter boss-meter--stagger"><span>STAGGER</span><div><i style="--value:${staggerPercent}%"></i></div><b>${boss.stagger}/${boss.maxStagger}</b></div>
          <div class="boss-raid-footer">
            <small>${boss.combatLog[0] ? this.escapeHtml(boss.combatLog[0].text) : 'Hoàn thành mission để tấn công Boss.'}</small>
            ${boss.status === 'DEFEATED'
              ? '<button class="btn-primary rpg-action-btn" id="rpg-next-raid-btn">START NEXT RAID</button>'
              : `<button class="btn-danger rpg-action-btn" id="rpg-finisher-btn" ${finisherReady ? '' : 'disabled'}>⚡ FINISHER ${finisherReady ? 'READY' : 'LOCKED'}</button>`}
          </div>
        </article>
        ${attributes.map((name) => `
          <div class="attribute-row">
            <span>${name}</span>
            <div class="attribute-track"><i style="--value:${Math.min(100, Math.round((character.attrXp[name] / this.lifeRpg.getAttrXpThreshold(character.stats[name])) * 100))}%"></i></div>
            <b>${character.stats[name]}</b>
          </div>`).join('')}
        <div class="hub-grid">
          ${this.zone('REWARD LOOP', 'Mission DONE → XP, Web Coins và thuộc tính theo loại nhiệm vụ.', 'red')}
          ${this.zone('BEST STREAK', `${streak.best} ngày liên tiếp. Mỗi ngày chỉ tăng streak một lần.`, 'green')}
          ${this.zone('LATEST LOOT', this.escapeHtml(lastLoot), 'amber')}
        </div>
      </section>`;
  }

  bindRpgActions(contentBox) {
    contentBox.querySelector('#rpg-finisher-btn')?.addEventListener('click', () => {
      const result = this.lifeRpg.executeFinisher();
      if (result) this.sound.playSuccess();
    });
    contentBox.querySelector('#rpg-next-raid-btn')?.addEventListener('click', () => {
      if (this.lifeRpg.startNextRaid()) this.sound.playSelect();
    });
  }

  renderChronicle() {
    const { done } = this.getStats();
    return `
      <section class="hub-panel-inner">
        <div class="hub-panel-heading">LIFE CHRONICLE <span>${done.length} COMPLETED</span></div>
        <div class="hub-log-list">
          ${done.length === 0
            ? '<div class="hub-log-entry"><strong>NO COMPLETIONS YET</strong><small>Hoàn thành mission trên map để ghi sự kiện đầu tiên.</small></div>'
            : done.map((entry) => `
                <div class="hub-log-entry">
                  <strong>${this.escapeHtml(entry.title)}</strong>
                  <small>${new Date(entry.updatedAt).toLocaleString('vi-VN')} // ${this.escapeHtml(entry.address || 'Chưa có địa chỉ')}</small>
                </div>`).join('')}
        </div>
      </section>`;
  }

  stat(label, value, description) {
    return `<div class="hub-stat"><strong>${value}</strong><span>${label}<br>${description}</span></div>`;
  }

  zone(title, copy, tone = '') {
    const toneClass = tone ? ` hub-zone--${tone}` : '';
    return `<article class="hub-zone${toneClass}"><h4>${title}</h4><p>${copy}</p></article>`;
  }

  escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }
}
