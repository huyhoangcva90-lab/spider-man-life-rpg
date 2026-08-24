export class ActionRpgController {
  constructor(eventBus, engine, soundController, mapEngine) {
    this.bus = eventBus;
    this.engine = engine;
    this.sound = soundController;
    this.mapEngine = mapEngine;
    this.panelSection = 'QUESTS';
    this.panelTab = 'MAIN';
    this.introPlayed = false;
  }

  init() {
    document.querySelectorAll('[data-game-section]').forEach((button) => button.addEventListener('click', () => this.selectSection(button.dataset.gameSection)));
    document.querySelectorAll('[data-combat-action]').forEach((button) => button.addEventListener('click', () => this.runAction(button.dataset.combatAction)));
    document.getElementById('game-panel-close')?.addEventListener('click', () => this.closePanel());
    document.getElementById('game-panel-backdrop')?.addEventListener('click', (event) => { if (event.target.id === 'game-panel-backdrop') this.closePanel(); });
    document.getElementById('btn-next-patrol')?.addEventListener('click', () => this.engine.startNextPatrol());
    document.getElementById('action-rpg-screen')?.addEventListener('pointerdown', () => this.playIntroOnce(), { once: true });
    this.bus.on('CAMPAIGN_UPDATED', (result) => this.handleUpdate(result));
    this.bus.on('GAME_MENU_TARGET', ({ section, tab }) => {
      if (section === 'SETTINGS') return this.bus.emit('OPEN_MODAL', 'MAP_GUIDE');
      if (section === 'CITY') return this.selectSection('CITY');
      this.panelSection = section;
      this.panelTab = tab || (section === 'QUESTS' ? 'MAIN' : section === 'VERSE' ? 'ROSTER' : 'PROFILE');
      document.body.dataset.gameMode = 'ARENA';
      this.setActiveNav(section);
      const panel = document.getElementById('game-panel-backdrop'); panel?.removeAttribute('hidden'); panel?.removeAttribute('inert');
      this.renderPanel();
    });
    this.selectSection('ARENA', false);
    this.render();
  }

  selectSection(section, playSound = true) {
    if (playSound) this.sound.playClick();
    if (section === 'CITY') {
      document.body.dataset.gameMode = 'MAP';
      this.setActiveNav('CITY');
      requestAnimationFrame(() => this.mapEngine.resize?.());
      return;
    }
    if (section === 'ARENA') {
      document.body.dataset.gameMode = 'ARENA';
      this.setActiveNav('ARENA');
      this.closePanel();
      if (playSound) this.playIntroOnce();
      return;
    }
    document.body.dataset.gameMode = 'ARENA';
    this.setActiveNav(section);
    this.openPanel(section);
  }

  setActiveNav(section) {
    document.querySelectorAll('[data-game-section]').forEach((button) => {
      const active = button.dataset.gameSection === section;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
  }

  playIntroOnce() {
    if (this.introPlayed) return;
    this.introPlayed = true;
    this.sound.playArenaIntro();
  }

  runAction(action) {
    this.playIntroOnce();
    const result = this.engine.performAction(action);
    if (result.blocked) {
      this.sound.playWarning();
      this.toast(result.reason);
      return;
    }
    if (action === 'ally') this.sound.playAllyCall();
    else if (action === 'web') this.sound.playWebAction();
    else if (action === 'gadget') this.sound.playGadgetAction();
    else if (action === 'ultimate') this.sound.playHeavyImpact();
    else this.sound.playCombatHit();
  }

  handleUpdate(result) {
    this.render(result.snapshot);
    if (result.perfectDodge) this.sound.playPerfectDodge();
    if (result.victory?.boss) this.sound.playVictoryCue();
    else if (result.victory?.next) this.sound.playCrimeAlert();
    if (result.dailyReward) this.toast(`DAILY CLEAR // +${result.dailyReward.xp} XP +${result.dailyReward.coins} COINS`);
    else if (result.questReward) this.toast(`QUEST CLEAR // +${result.questReward.xp} XP +${result.questReward.coins} COINS`);
    else if (result.victory) this.toast(result.victory.boss ? 'CHAPTER BOSS DEFEATED!' : `WAVE CLEAR // NEXT: ${result.victory.next}`);
  }

  render(snapshot = this.engine.snapshot()) {
    const { hero, enemy, data } = snapshot;
    this.text('hud-level', hero.level);
    this.text('hud-rank', hero.rank);
    this.text('hud-xp-text', `${hero.xp} / ${hero.xpToNext}`);
    this.text('hud-hp-text', `${hero.hp} / ${data.hero.maxHp}`);
    this.text('hud-web-text', `${hero.webEnergy} / ${data.hero.maxWebEnergy}`);
    this.text('hud-coins', hero.coins);
    this.text('hud-streak', hero.streak);
    this.width('hud-xp-fill', hero.xp / hero.xpToNext * 100);
    this.width('hud-hp-fill', hero.hp / data.hero.maxHp * 100);
    this.width('hud-web-fill', hero.webEnergy / data.hero.maxWebEnergy * 100);
    this.text('hud-quest-progress', snapshot.storyComplete ? 'CHAPTER CLEAR' : `WAVE ${snapshot.encounterIndex + 1} / ${data.encounter.length}`);
    this.text('enemy-tier', enemy.tier);
    this.text('enemy-name', enemy.name);
    this.text('combat-enemy-short', enemy.name.split(' ').slice(-1)[0]);
    this.text('enemy-hp-text', `${snapshot.enemyHp} / ${enemy.maxHp}`);
    this.text('enemy-stagger-text', `${Math.round(snapshot.enemyStagger)}%`);
    this.text('enemy-weakness', enemy.weakness);
    this.text('enemy-resistance', enemy.resistance);
    this.text('enemy-phase', snapshot.phase);
    this.text('combat-log-line', snapshot.combatLog[0]);
    this.width('enemy-hp-fill', snapshot.enemyHp / enemy.maxHp * 100);
    this.width('enemy-stagger-fill', snapshot.enemyStagger);
    this.width('ultimate-fill', hero.ultimate);
    this.text('ultimate-charge', snapshot.enemyStagger >= 100 ? 'FINISHER READY' : `${hero.ultimate}%`);
    this.text('cooldown-web', snapshot.cooldowns.web ? `CD ${snapshot.cooldowns.web}` : `${data.actions.web.energy} WEB`);
    this.text('cooldown-gadget', snapshot.cooldowns.gadget ? `CD ${snapshot.cooldowns.gadget}` : `${snapshot.charges.gadget} CHARGES`);
    this.text('cooldown-ally', snapshot.cooldowns.ally ? `CD ${snapshot.cooldowns.ally}` : 'READY');

    const enemyFighter = document.querySelector('.action-fighter--enemy');
    enemyFighter?.classList.toggle('enemy--grunt', snapshot.encounterIndex < 3);
    enemyFighter?.classList.toggle('enemy--elite', snapshot.encounterIndex === 3);
    document.querySelector('[data-combat-action="web"]')?.toggleAttribute('disabled', snapshot.cooldowns.web > 0 || hero.webEnergy < data.actions.web.energy || snapshot.storyComplete);
    document.querySelector('[data-combat-action="gadget"]')?.toggleAttribute('disabled', snapshot.cooldowns.gadget > 0 || snapshot.charges.gadget <= 0 || snapshot.storyComplete);
    document.querySelector('[data-combat-action="ally"]')?.toggleAttribute('disabled', snapshot.cooldowns.ally > 0 || snapshot.storyComplete);
    document.querySelector('[data-combat-action="attack"]')?.toggleAttribute('disabled', snapshot.storyComplete);
    const ultimate = document.querySelector('[data-combat-action="ultimate"]');
    ultimate?.toggleAttribute('disabled', hero.ultimate < 100 || snapshot.storyComplete);
    ultimate?.classList.toggle('ready', hero.ultimate >= 100 && !snapshot.storyComplete);
    document.getElementById('btn-next-patrol')?.toggleAttribute('hidden', !snapshot.storyComplete);
    if (!document.getElementById('game-panel-backdrop')?.hasAttribute('hidden')) this.renderPanel();
  }

  openPanel(section) {
    this.panelSection = section;
    this.panelTab = section === 'QUESTS' ? 'MAIN' : section;
    const panel = document.getElementById('game-panel-backdrop');
    panel?.removeAttribute('hidden'); panel?.removeAttribute('inert');
    this.renderPanel();
  }

  closePanel() {
    const panel = document.getElementById('game-panel-backdrop');
    panel?.setAttribute('hidden', ''); panel?.setAttribute('inert', '');
    if (document.body.dataset.gameMode !== 'MAP') this.setActiveNav('ARENA');
  }

  renderPanel() {
    const title = document.getElementById('game-panel-title');
    const tabs = document.getElementById('game-panel-tabs');
    const content = document.getElementById('game-panel-content');
    if (!title || !tabs || !content) return;
    title.textContent = this.panelSection === 'QUESTS' ? 'NHIỆM VỤ' : this.panelSection === 'VERSE' ? 'SPIDER-VERSE' : 'HERO / BUILD';
    const tabNames = this.panelSection === 'QUESTS' ? ['MAIN','SIDE','DAILY','COMPLETED'] : this.panelSection === 'VERSE' ? ['ROSTER','TEAM'] : ['PROFILE','SKILLS','GADGETS','INVENTORY'];
    if (!tabNames.includes(this.panelTab)) this.panelTab = tabNames[0];
    tabs.innerHTML = tabNames.map((tab) => `<button class="${tab === this.panelTab ? 'active' : ''}" data-game-panel-tab="${tab}">${tab}</button>`).join('');
    tabs.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { this.sound.playSelect(); this.panelTab = button.dataset.gamePanelTab; this.renderPanel(); }));
    content.innerHTML = this.panelSection === 'QUESTS' ? this.renderQuests() : this.panelSection === 'VERSE' ? this.renderVerse() : this.renderHero();
    content.querySelector('[data-open-real-mission]')?.addEventListener('click', () => { this.closePanel(); this.bus.emit('OPEN_EDITOR', { type: 'WORK', status: 'PLANNED' }); });
  }

  renderQuests() {
    const s = this.engine.snapshot();
    if (this.panelTab === 'COMPLETED') return `<div class="game-card-grid">${s.defeated.length ? s.defeated.map((id) => `<article class="game-card"><small>ENEMY DEFEATED</small><h3>${id.replaceAll('-',' ').toUpperCase()}</h3><footer>RECORDED IN COMBAT LOG</footer></article>`).join('') : '<article class="game-card"><h3>NO CLEARS YET</h3><p>Hoàn thành nhiệm vụ thật hoặc chiến đấu trong Arena để tiến cốt truyện.</p></article>'}</div>`;
    const type = this.panelTab;
    const quests = s.data.quests.filter((quest) => quest.type === type);
    return `<div class="game-card-grid">${quests.map((quest) => `<article class="game-card"><small>${quest.type} QUEST</small><h3>${quest.title}</h3><p>${quest.copy}</p><footer>${quest.type === 'DAILY' ? `PROGRESS // ${Math.min(3,s.daily.completed)} / 3<br>` : ''}REWARD // ${quest.reward}</footer></article>`).join('')}</div><button class="game-panel-action" data-open-real-mission>+ TẠO NHIỆM VỤ ĐỜI THẬT</button>`;
  }

  renderVerse() {
    const d = this.engine.data;
    if (this.panelTab === 'TEAM') return `<div class="game-card"><small>ACTIVE TEAM // 2 MEMBERS</small><h3>PETER + MILES</h3><p>Main Hero: ${d.hero.name}<br>Assist: ${d.ally.name} — ${d.ally.skill}</p><footer>SPIDER-VERSE SYNERGY // ${d.ally.bonus}</footer></div>`;
    return `<div class="game-card-grid"><article class="game-card roster-card"><span class="roster-sprite" style="background-position:0 0"></span><div><small>MAIN HERO</small><h3>${d.hero.name}</h3><p>${d.hero.variant} // ${d.hero.rank}</p></div></article><article class="game-card roster-card"><span class="roster-sprite" style="background-position:11.11% 0"></span><div><small>ACTIVE ALLY</small><h3>${d.ally.name}</h3><p>${d.ally.skill}</p><footer>${d.ally.bonus}</footer></div></article></div>`;
  }

  renderHero() {
    const s = this.engine.snapshot();
    if (this.panelTab === 'SKILLS') return `<div class="game-card-grid">${s.data.skills.map((skill) => `<article class="game-card"><small>${skill.unlocked ? 'UNLOCKED' : 'LOCKED'}</small><h3>${skill.name}</h3><footer>${skill.unlocked ? 'READY FOR COMBAT' : 'REQUIRES SKILL POINT'}</footer></article>`).join('')}</div>`;
    if (this.panelTab === 'GADGETS') return `<div class="game-card-grid">${s.data.gadgets.map((g) => `<article class="game-card"><small>LV ${g.level} // ${g.charges} CHARGES</small><h3>${g.name}</h3><p>${g.effect}</p></article>`).join('')}</div>`;
    if (this.panelTab === 'INVENTORY') return `<div class="game-card-grid">${Object.keys(s.inventory).length ? Object.entries(s.inventory).map(([name,count]) => `<article class="game-card"><small>MATERIAL</small><h3>${name}</h3><footer>OWNED // ${count}</footer></article>`).join('') : '<article class="game-card"><h3>INVENTORY EMPTY</h3><p>Defeat enemies to collect upgrade materials.</p></article>'}</div>`;
    return `<article class="game-card"><small>${s.data.hero.rank}</small><h3>${s.data.hero.name} // ${s.data.hero.variant}</h3><div class="game-stat-list"><span>LV ${s.hero.level}</span><span>HP ${s.hero.hp}</span><span>WEB ${s.hero.webEnergy}</span><span>ULT ${s.hero.ultimate}%</span><span>COINS ${s.hero.coins}</span><span>SKILL ${s.hero.skillPoints}</span><span>K.O. ${s.defeated.length}</span><span>STREAK ${s.hero.streak}</span></div></article>`;
  }

  toast(message) {
    const host = document.getElementById('tracker-main');
    const toast = document.createElement('div'); toast.className = 'combat-toast'; toast.textContent = message; host?.appendChild(toast); setTimeout(() => toast.remove(), 950);
  }
  text(id, value) { const el = document.getElementById(id); if (el) el.textContent = String(value); }
  width(id, value) { const el = document.getElementById(id); if (el) el.style.width = `${Math.max(0,Math.min(100,value))}%`; }
}
