export class ActionRpgController {
  constructor(eventBus, engine, soundController, mapEngine) {
    this.bus = eventBus;
    this.engine = engine;
    this.sound = soundController;
    this.mapEngine = mapEngine;
    this.panelSection = 'QUESTS';
    this.panelTab = 'MAIN';
    this.introPlayed = false;
    this.autoTimer = null;
  }

  init() {
    document.querySelectorAll('[data-game-section]').forEach((button) => button.addEventListener('click', () => this.selectSection(button.dataset.gameSection)));
    document.querySelectorAll('[data-combat-action]').forEach((button) => button.addEventListener('click', () => this.runAction(button.dataset.combatAction)));
    document.getElementById('game-panel-close')?.addEventListener('click', () => this.closePanel());
    document.getElementById('game-panel-backdrop')?.addEventListener('click', (event) => { if (event.target.id === 'game-panel-backdrop') this.closePanel(); });
    document.getElementById('btn-next-patrol')?.addEventListener('click', () => this.engine.startNextPatrol());
    document.getElementById('action-rpg-screen')?.addEventListener('pointerdown', () => this.playIntroOnce(), { once: true });
    document.addEventListener('visibilitychange', () => this.syncAutoCombat(this.engine.snapshot().settings));
    this.bus.on('CAMPAIGN_UPDATED', (result) => this.handleUpdate(result));
    this.bus.on('GAME_MENU_TARGET', ({ section, tab }) => {
      if (section === 'CITY') return this.selectSection('CITY');
      this.panelSection = section;
      this.panelTab = tab || this.defaultTab(section);
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
    ultimate?.classList.toggle('finisher-ready', snapshot.enemyStagger >= 100 && hero.ultimate >= 100 && !snapshot.storyComplete);
    ultimate?.querySelector('strong') && (ultimate.querySelector('strong').textContent = snapshot.enemyStagger >= 100 ? 'FINISHER' : 'ULTIMATE');
    document.getElementById('btn-next-patrol')?.toggleAttribute('hidden', !snapshot.storyComplete);
    document.body.classList.toggle('game-reduce-motion', snapshot.settings.reduceMotion);
    document.body.classList.toggle('game-no-shake', !snapshot.settings.screenShake);
    document.body.classList.toggle('game-no-comic', !snapshot.settings.comicText);
    this.syncAutoCombat(snapshot.settings);
    if (!document.getElementById('game-panel-backdrop')?.hasAttribute('hidden')) this.renderPanel();
  }

  openPanel(section) {
    this.panelSection = section;
    this.panelTab = this.defaultTab(section);
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
    const titles = { QUESTS: 'MISSIONS // GAMBIT', TIMETABLE: 'TIMETABLE // SPIDER PATROL', VERSE: 'SPIDER-VERSE // 5 LEVELS', LIFE: 'LIFE SYSTEMS', SETTINGS: 'GAME SETTINGS / SAVE', HERO: 'HERO / BUILD' };
    title.textContent = titles[this.panelSection] || 'SPIDEY LIFE';
    const tabMap = {
      QUESTS: ['MAIN','DAILY'],
      TIMETABLE: ['SCHEDULE'],
      VERSE: ['CHALLENGE','TEAM','SKILLS','GADGETS'],
      LIFE: ['DOPAMINE','RHYTHM','JOURNAL','GYM'],
      SETTINGS: ['GAME','SAVE'],
      HERO: ['PROFILE','SKILLS','GADGETS','INVENTORY']
    };
    const tabNames = tabMap[this.panelSection] || ['PROFILE'];
    if (!tabNames.includes(this.panelTab)) this.panelTab = tabNames[0];
    tabs.innerHTML = tabNames.map((tab) => `<button class="${tab === this.panelTab ? 'active' : ''}" data-game-panel-tab="${tab}">${tab}</button>`).join('');
    tabs.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { this.sound.playSelect(); this.panelTab = button.dataset.gamePanelTab; this.renderPanel(); }));
    content.innerHTML = this.renderSection();
    content.querySelector('[data-open-real-mission]')?.addEventListener('click', () => { this.closePanel(); this.bus.emit('OPEN_EDITOR', { type: 'WORK', status: 'PLANNED' }); });
    this.bindSettings(content);
  }

  defaultTab(section) {
    return ({ QUESTS: 'MAIN', TIMETABLE: 'SCHEDULE', VERSE: 'CHALLENGE', LIFE: 'DOPAMINE', SETTINGS: 'GAME', HERO: 'PROFILE' })[section] || 'PROFILE';
  }

  renderSection() {
    if (this.panelSection === 'QUESTS') return this.renderMissionApp();
    if (this.panelSection === 'TIMETABLE') return this.renderTimetableApp();
    if (this.panelSection === 'VERSE') return this.renderVerse();
    if (this.panelSection === 'LIFE') return this.renderLifeApp();
    if (this.panelSection === 'SETTINGS') return this.renderSettings();
    return this.renderHero();
  }

  renderLifeFrame(view, label) {
    return `<div class="embedded-life-shell"><div class="embedded-life-status"><i></i><span>${label}</span><b>NOTION + SHARED CLOUD</b></div><iframe class="life-os-frame" src="./life-os/?embed=1#${view}" title="${label}" loading="eager"></iframe></div>`;
  }

  renderMissionApp() {
    const isDaily = this.panelTab === 'DAILY';
    return `<div class="quest-source-banner"><span>${isDaily ? 'DAILY QUEST' : 'MAIN QUEST'}</span><strong>${isDaily ? 'HABITS TỪ GAMBIT / NOTION' : 'TODO TỪ GAMBIT / NOTION'}</strong><small>Một nguồn dữ liệu online — không tạo list local riêng.</small></div>${this.renderLifeFrame(isDaily ? 'habits' : 'today', isDaily ? 'HABIT TODAY' : 'MAIN TODO')}`;
  }

  renderTimetableApp() {
    return `<div class="spider-cinema-cast" aria-label="Ba Spider-Man patrol profiles">
      <article><i class="cinema-spider cinema-spider--tobey"></i><span><b>TOBEY</b><small>EARTH-96283 // ENDURANCE</small></span></article>
      <article><i class="cinema-spider cinema-spider--andrew"></i><span><b>ANDREW</b><small>EARTH-120703 // AGILITY</small></span></article>
      <article><i class="cinema-spider cinema-spider--tom"></i><span><b>TOM</b><small>EARTH-199999 // TECH</small></span></article>
    </div>${this.renderLifeFrame('timetable', 'CITY CLOCK / 3-SPIDER PATROL')}`;
  }

  renderLifeApp() {
    const routes = { DOPAMINE: ['dopamine', 'DOPAMINE DICE'], RHYTHM: ['routine', 'CIRCADIAN RHYTHM'], JOURNAL: ['journal', 'LIFE CHRONICLE'], GYM: ['gym', 'GYM OS'] };
    const [view, label] = routes[this.panelTab] || routes.DOPAMINE;
    return this.renderLifeFrame(view, label);
  }

  renderQuests() {
    const s = this.engine.snapshot();
    if (this.panelTab === 'COMPLETED') return `<div class="game-card-grid">${s.defeated.length ? s.defeated.map((id) => `<article class="game-card"><small>ENEMY DEFEATED</small><h3>${id.replaceAll('-',' ').toUpperCase()}</h3><footer>RECORDED IN COMBAT LOG</footer></article>`).join('') : '<article class="game-card"><h3>NO CLEARS YET</h3><p>Hoàn thành nhiệm vụ thật hoặc chiến đấu trong Arena để tiến cốt truyện.</p></article>'}</div>`;
    const type = this.panelTab;
    const quests = s.data.quests.filter((quest) => quest.type === type);
    return `<div class="game-card-grid">${quests.map((quest) => {
      const progress = quest.metric ? s.daily.metrics?.[quest.metric] || 0 : s.daily.completed;
      return `<article class="game-card"><small>${quest.type} QUEST</small><h3>${quest.title}</h3><p>${quest.copy}</p><footer>${quest.type === 'DAILY' ? `PROGRESS // ${Math.min(quest.target || 3, progress)} / ${quest.target || 3}<br>` : ''}REWARD // ${quest.reward}</footer></article>`;
    }).join('')}</div><button class="game-panel-action" data-open-real-mission>+ TẠO NHIỆM VỤ ĐỜI THẬT</button>`;
  }

  renderVerse() {
    const s = this.engine.snapshot();
    const d = this.engine.data;
    if (this.panelTab === 'TEAM') return `<div class="game-card-grid"><article class="game-card"><small>ACTIVE TEAM // 3 SPIDER-MEN</small><h3>TOBEY + ANDREW + TOM</h3><p>Chọn đội hình theo Endurance, Agility hoặc Tech trước mỗi ải.</p><footer>ASSIST SLOT // ${d.ally.name} — ${d.ally.skill}</footer></article><article class="game-card"><small>TEAM SYNERGY</small><h3>THREE GENERATIONS</h3><p>${d.ally.bonus}</p><footer>ULTIMATE: WEB OF DESTINY</footer></article></div>`;
    if (this.panelTab === 'SKILLS') return this.renderHeroTab('SKILLS');
    if (this.panelTab === 'GADGETS') return this.renderHeroTab('GADGETS');
    const levels = [
      ['1', 'STREET SIGNAL', 'GRUNTS', 1], ['2', 'ROOFTOP HUNT', 'ELITES', 2], ['3', 'OSCORP BREACH', 'MINI BOSS', 3], ['4', 'SINISTER GATE', 'BOSS RUSH', 4], ['5', 'WEB OF DESTINY', 'MULTIVERSE BOSS', 5]
    ];
    return `<div class="verse-level-track">${levels.map(([level, name, foe, required]) => { const unlocked = s.hero.level >= required; return `<article class="verse-level ${unlocked ? 'unlocked' : 'locked'}"><span>LEVEL ${level}</span><strong>${name}</strong><small>${foe}</small><b>${unlocked ? 'READY' : `LOCKED // HERO LV ${required}`}</b></article>`; }).join('')}</div>`;
  }

  renderHeroTab(tab) {
    const previous = this.panelTab;
    this.panelTab = tab;
    const html = this.renderHero();
    this.panelTab = previous;
    return html;
  }

  renderHero() {
    const s = this.engine.snapshot();
    if (this.panelTab === 'SKILLS') return `<div class="game-card-grid">${s.data.skills.map((skill) => `<article class="game-card"><small>${skill.unlocked ? 'UNLOCKED' : 'LOCKED'}</small><h3>${skill.name}</h3><footer>${skill.unlocked ? 'READY FOR COMBAT' : 'REQUIRES SKILL POINT'}</footer></article>`).join('')}</div>`;
    if (this.panelTab === 'GADGETS') return `<div class="game-card-grid">${s.data.gadgets.map((g) => `<article class="game-card"><small>LV ${g.level} // ${g.charges} CHARGES</small><h3>${g.name}</h3><p>${g.effect}</p></article>`).join('')}</div>`;
    if (this.panelTab === 'INVENTORY') return `<div class="game-card-grid">${Object.keys(s.inventory).length ? Object.entries(s.inventory).map(([name,count]) => `<article class="game-card"><small>MATERIAL</small><h3>${name}</h3><footer>OWNED // ${count}</footer></article>`).join('') : '<article class="game-card"><h3>INVENTORY EMPTY</h3><p>Defeat enemies to collect upgrade materials.</p></article>'}</div>`;
    return `<article class="game-card"><small>${s.data.hero.rank}</small><h3>${s.data.hero.name} // ${s.data.hero.variant}</h3><div class="game-stat-list"><span>LV ${s.hero.level}</span><span>HP ${s.hero.hp}</span><span>WEB ${s.hero.webEnergy}</span><span>ULT ${s.hero.ultimate}%</span><span>COINS ${s.hero.coins}</span><span>SKILL ${s.hero.skillPoints}</span><span>K.O. ${s.defeated.length}</span><span>STREAK ${s.hero.streak}</span></div></article>`;
  }

  renderSettings() {
    const settings = this.engine.snapshot().settings;
    if (this.panelTab === 'SAVE') return `<div class="game-save-tools">
      <article class="game-card"><small>VERSIONED LOCAL SAVE</small><h3>PROGRESSION BACKUP</h3><p>Export a JSON backup, import a previous backup, or reset only the action-RPG save. Map missions are stored separately.</p></article>
      <button class="game-panel-action" data-save-export>EXPORT SAVE JSON</button>
      <label class="game-panel-action game-panel-file">IMPORT SAVE JSON<input type="file" accept="application/json" data-save-import></label>
      <button class="game-panel-action game-panel-action--danger" data-save-reset>RESET GAME SAVE</button>
    </div>`;
    const toggle = (key, label) => `<label class="game-setting-row"><span>${label}</span><input type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''}></label>`;
    return `<div class="game-settings-grid">
      ${toggle('sfx', 'SFX')}${toggle('music', 'MUSIC')}${toggle('reduceMotion', 'REDUCE MOTION')}${toggle('screenShake', 'SCREEN SHAKE')}${toggle('comicText', 'COMIC TEXT')}${toggle('autoCombat', 'AUTO COMBAT')}
      <label class="game-setting-row"><span>COMBAT SPEED</span><select data-setting="combatSpeed"><option value="1" ${settings.combatSpeed === 1 ? 'selected' : ''}>x1</option><option value="2" ${settings.combatSpeed === 2 ? 'selected' : ''}>x2</option></select></label>
      <label class="game-setting-row"><span>DIFFICULTY</span><select data-setting="difficulty">${Object.keys(this.engine.content.difficulties).map((id) => `<option ${id === settings.difficulty ? 'selected' : ''}>${id}</option>`).join('')}</select></label>
      <label class="game-setting-row game-setting-row--wide"><span>MASTER VOLUME // ${Math.round(settings.volume * 100)}%</span><input type="range" min="0" max="1" step="0.1" value="${settings.volume}" data-setting="volume"></label>
    </div><p class="game-settings-note">Difficulty applies fully when the next enemy or patrol begins. Quest combat remains the only source of persistent progression.</p>`;
  }

  bindSettings(content) {
    content.querySelectorAll('[data-setting]').forEach((control) => control.addEventListener('change', () => {
      const key = control.dataset.setting;
      const value = control.type === 'checkbox' ? control.checked : key === 'volume' || key === 'combatSpeed' ? Number(control.value) : control.value;
      const settings = this.engine.updateSettings({ [key]: value });
      if (key === 'sfx') this.sound.stateStore.setState({ soundEnabled: settings.sfx });
      if (key === 'volume') this.sound.setMasterVolume(settings.volume);
      if (key === 'music') this.sound.setMusicEnabled(settings.music);
      this.sound.playSelect();
      this.renderPanel();
    }));
    content.querySelector('[data-save-export]')?.addEventListener('click', () => {
      const blob = new Blob([this.engine.exportSave()], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); link.download = `spidey-life-save-${Date.now()}.json`; link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    });
    content.querySelector('[data-save-import]')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try { this.engine.importSave(await file.text()); this.toast('SAVE IMPORTED'); }
      catch (error) { this.toast(`IMPORT FAILED // ${error.message}`); }
    });
    content.querySelector('[data-save-reset]')?.addEventListener('click', () => {
      if (window.confirm('Reset action-RPG progression? Map missions will be preserved.')) { this.engine.resetSave(); this.toast('GAME SAVE RESET'); }
    });
  }

  syncAutoCombat(settings) {
    window.clearInterval(this.autoTimer);
    this.autoTimer = null;
    if (!settings.autoCombat || document.hidden) return;
    const interval = Math.round(4200 / (settings.combatSpeed || 1));
    this.autoTimer = window.setInterval(() => {
      if (document.body.dataset.gameMode !== 'ARENA' || !document.getElementById('game-panel-backdrop')?.hasAttribute('hidden')) return;
      this.bus.emit('RPG_UPDATED', { action: 'demo', animation: 'attack_01', comicText: ['POW!', 'THWIP!'], demo: true });
    }, interval);
  }

  toast(message) {
    const host = document.getElementById('tracker-main');
    const toast = document.createElement('div'); toast.className = 'combat-toast'; toast.textContent = message; host?.appendChild(toast); setTimeout(() => toast.remove(), 950);
  }
  text(id, value) { const el = document.getElementById(id); if (el) el.textContent = String(value); }
  width(id, value) { const el = document.getElementById(id); if (el) el.style.width = `${Math.max(0,Math.min(100,value))}%`; }
}
