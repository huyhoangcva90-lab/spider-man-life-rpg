export class ActionRpgController {
  constructor(eventBus, engine, soundController, mapEngine) {
    this.bus = eventBus;
    this.engine = engine;
    this.sound = soundController;
    this.mapEngine = mapEngine;
    this.panelSection = 'QUESTS';
    this.panelTab = 'TODO';
    this.introPlayed = false;
    this.autoTimer = null;

    // Loaded game datasets from Notion / local cache
    this.suits = [];
    this.spiderVerse = [];
    this.bosses = [];
    this.minions = [];
    this.backpacks = [];
    this.badges = {};
    this.notionTasks = [];
    this.notionHabits = [];
    this.skillIcons = {};
    this.skillsCatalog = [];
    this.previewSuitIndex = 0;
    this.equippedSuitIndex = 0;
    this.journalEntries = JSON.parse(localStorage.getItem('spidey_journal_entries') || '[]');
  }

  async init() {
    document.querySelectorAll('[data-game-section]').forEach((button) => button.addEventListener('click', () => this.selectSection(button.dataset.gameSection)));
    document.querySelectorAll('[data-combat-action]').forEach((button) => button.addEventListener('click', () => this.runAction(button.dataset.combatAction)));
    document.getElementById('game-panel-close')?.addEventListener('click', () => this.closePanel());
    document.getElementById('game-panel-backdrop')?.addEventListener('click', (event) => { if (event.target.id === 'game-panel-backdrop') this.closePanel(); });
    document.getElementById('btn-next-patrol')?.addEventListener('click', () => this.engine.startNextPatrol());
    document.getElementById('action-rpg-screen')?.addEventListener('pointerdown', () => this.playIntroOnce(), { once: true });
    document.querySelector('.hud-avatar')?.addEventListener('click', () => this.selectSection('HERO'));
    document.getElementById('btn-footer-settings')?.addEventListener('click', () => {
      this.panelSection = 'SETTINGS';
      this.panelTab = 'GAME';
      this.openPanel('SETTINGS');
    });

    document.addEventListener('visibilitychange', () => this.syncAutoCombat(this.engine.snapshot().settings));
    this.bus.on('CAMPAIGN_UPDATED', (result) => this.handleUpdate(result));
    this.bus.on('GAME_MENU_TARGET', ({ section, tab }) => {
      if (section === 'CITY') return this.selectSection('CITY');
      this.panelSection = section;
      this.panelTab = tab || this.defaultTab(section);
      document.body.dataset.gameMode = 'ARENA';
      this.setActiveNav(section);
      const panel = document.getElementById('game-panel-backdrop'); 
      panel?.removeAttribute('hidden'); 
      panel?.removeAttribute('inert');
      this.renderPanel();
    });

    // Load rich game datasets
    await this.loadAllGameData();

    this.selectSection('ARENA', false);
    this.render();
  }

  async loadAllGameData() {
    try {
      const [suitsRes, verseRes, bossesRes, minionsRes, backpacksRes, badgesRes, snapRes, iconsRes, skillsRes] = await Promise.allSettled([
        fetch('./data/suits.json').then(r => r.json()),
        fetch('./data/spider-verse.json').then(r => r.json()),
        fetch('./data/bosses.json').then(r => r.json()),
        fetch('./data/minions.json').then(r => r.json()),
        fetch('./data/backpacks.json').then(r => r.json()),
        fetch('./data/badges.json').then(r => r.json()),
        fetch('./data/notion-snapshot.json').then(r => r.json()),
        fetch('./data/skill_icons.json').then(r => r.json()),
        fetch('./data/skills.json').then(r => r.json())
      ]);

      if (suitsRes.status === 'fulfilled') this.suits = suitsRes.value || [];
      if (verseRes.status === 'fulfilled') this.spiderVerse = verseRes.value || [];
      if (bossesRes.status === 'fulfilled') this.bosses = bossesRes.value || [];
      if (minionsRes.status === 'fulfilled') this.minions = minionsRes.value || {};
      if (backpacksRes.status === 'fulfilled') this.backpacks = backpacksRes.value || [];
      if (badgesRes.status === 'fulfilled') this.badges = badgesRes.value?.rename_map || {};
      if (iconsRes.status === 'fulfilled') this.skillIcons = iconsRes.value || {};
      if (skillsRes.status === 'fulfilled') this.skillsCatalog = skillsRes.value || [];
      
      if (snapRes.status === 'fulfilled' && snapRes.value?.collections) {
        this.notionTasks = snapRes.value.collections.masterCalendar || [];
        this.notionHabits = snapRes.value.collections.habits || [];
      }
    } catch (e) {
      console.warn('[ActionRpgController] Data load error, using fallbacks:', e);
    }
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
    enemyFighter?.classList.toggle('enemy--boss', snapshot.encounterIndex >= 4 || enemy.tier === 'BOSS');
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
    panel?.removeAttribute('hidden'); 
    panel?.removeAttribute('inert');
    this.renderPanel();
  }

  closePanel() {
    const panel = document.getElementById('game-panel-backdrop');
    panel?.setAttribute('hidden', ''); 
    panel?.setAttribute('inert', '');
    if (document.body.dataset.gameMode !== 'MAP') this.setActiveNav('ARENA');
  }

  defaultTab(section) {
    const map = {
      QUESTS: 'TODO',
      HERO: 'SUITS',
      ARCHIVE: 'BESTIARY',
      CHRONICLE: 'RHYTHM',
      SETTINGS: 'GAME'
    };
    return map[section] || 'TODO';
  }

  renderPanel() {
    const title = document.getElementById('game-panel-title');
    const kicker = document.getElementById('game-panel-kicker');
    const tabs = document.getElementById('game-panel-tabs');
    const content = document.getElementById('game-panel-content');
    if (!title || !tabs || !content) return;

    const titles = { 
      QUESTS: 'QUEST BOARD // GAMBIT & NOTION', 
      HERO: 'HERO WARDROBE & BUILD', 
      ARCHIVE: 'SPIDEY ARCHIVE & BESTIARY', 
      CHRONICLE: 'PETER PARKER CHRONICLE', 
      SETTINGS: 'GAME SETTINGS & SAVE' 
    };

    if (kicker) kicker.textContent = 'SPIDEY LIFE // RPG HUB';
    title.textContent = titles[this.panelSection] || 'SPIDEY LIFE';

    const tabMap = {
      QUESTS: ['TODO', 'HABITS', 'PATROL'],
      HERO: ['SUITS', 'ROSTER', 'SKILLS', 'GADGETS'],
      ARCHIVE: ['BESTIARY', 'BACKPACKS', 'BADGES'],
      CHRONICLE: ['RHYTHM', 'JOURNAL', 'GYM'],
      SETTINGS: ['GAME', 'SAVE']
    };

    const tabNames = tabMap[this.panelSection] || ['TODO'];
    if (!tabNames.includes(this.panelTab)) this.panelTab = tabNames[0];

    tabs.innerHTML = tabNames.map((tab) => `<button class="${tab === this.panelTab ? 'active' : ''}" data-game-panel-tab="${tab}">${tab}</button>`).join('');
    tabs.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { 
      this.sound.playSelect(); 
      this.panelTab = button.dataset.gamePanelTab; 
      this.renderPanel(); 
    }));

    content.innerHTML = this.renderSection();
    this.bindEvents(content);
  }

  renderSection() {
    switch (this.panelSection) {
      case 'QUESTS': return this.renderQuestsSection();
      case 'HERO': return this.renderHeroSection();
      case 'ARCHIVE': return this.renderArchiveSection();
      case 'CHRONICLE': return this.renderChronicleSection();
      case 'SETTINGS': return this.renderSettings();
      default: return this.renderQuestsSection();
    }
  }

  /* -------------------------------------------------------------
     1. TAB [QUESTS]: TODO (NOTION), HABITS (STREAK), PATROL TIMETABLE
  ------------------------------------------------------------- */
  renderQuestsSection() {
    if (this.panelTab === 'HABITS') {
      return `
        <div class="quest-source-banner">
          <span>🔥 HABITS</span>
          <strong>KỶ LUẬT HÀNG NGÀY & STREAK</strong>
          <small>Check-in thói quen để hồi phục Máu (HP) & Tơ (Web Energy)</small>
        </div>
        <div class="pixel-card-grid">
          ${this.notionHabits.map((habit, idx) => `
            <article class="pixel-game-card ${habit.done || habit.today ? 'pixel-game-card--done' : 'pixel-game-card--gold'}">
              <div class="pixel-card-header">
                <span class="pixel-tag ${habit.category === 'Good' || habit.category?.includes('Good') ? 'pixel-tag--green' : 'pixel-tag--red'}">${habit.category || 'HABIT'}</span>
                <span class="pixel-tag pixel-tag--gold">STREAK: ${this.engine.snapshot().hero.streak}D</span>
              </div>
              <h3 class="pixel-card-title">${habit.name || habit.title}</h3>
              <p class="pixel-card-desc">${habit.description || habit.outcome || 'Thói quen duy trì kỷ luật bản thân.'}</p>
              <div class="pixel-card-footer">
                <small style="color: #f2c06b; font: 700 8px monospace;">${habit.timeBlock || 'Mỗi ngày'}</small>
                <button class="pixel-action-btn ${habit.done || habit.today ? 'pixel-action-btn--disabled' : 'pixel-action-btn--green'}" 
                        data-checkin-habit="${idx}" ${habit.done || habit.today ? 'disabled' : ''}>
                  ${habit.done || habit.today ? '✓ ĐÃ XONG' : '⚡ CHECK-IN'}
                </button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    }

    if (this.panelTab === 'PATROL') {
      return `
        <div class="spider-cinema-cast" aria-label="Ba Spider-Man patrol profiles">
          <article><i class="cinema-spider cinema-spider--tobey"></i><span><b>TOBEY</b><small>CA SÁNG // SỨC BỀN & CÔNG VIỆC CHÍNH</small></span></article>
          <article><i class="cinema-spider cinema-spider--andrew"></i><span><b>ANDREW</b><small>CA CHIỀU // TỐC ĐỘ & GẶP ĐỐI TÁC</small></span></article>
          <article><i class="cinema-spider cinema-spider--tom"></i><span><b>TOM</b><small>CA TỐI // CÔNG NGHỆ, HỌC TẬP & HỒI PHỤC</small></span></article>
        </div>
        <div class="pixel-card-grid">
          <article class="pixel-game-card">
            <div class="pixel-card-header"><span class="pixel-tag">06:00 - 12:00</span><span class="pixel-tag pixel-tag--gold">TOBEY PATROL</span></div>
            <h3 class="pixel-card-title">TUẦN TRA SÁNG: NỀN TẢNG & SỨC BỀN</h3>
            <p class="pixel-card-desc">Thức dậy đúng giờ, ăn sáng nạp năng lượng, xử lý 3 việc khó nhất trong ngày (Deep Work).</p>
          </article>
          <article class="pixel-game-card">
            <div class="pixel-card-header"><span class="pixel-tag pixel-tag--red">12:00 - 18:00</span><span class="pixel-tag pixel-tag--gold">ANDREW PATROL</span></div>
            <h3 class="pixel-card-title">TUẦN TRA CHIỀU: LINH HOẠT & DI CHUYỂN</h3>
            <p class="pixel-card-desc">Họp đối tác, giao tiếp, xử lý công việc phát sinh ngoài thực địa. Dẫn đường bản đồ GPS.</p>
          </article>
          <article class="pixel-game-card">
            <div class="pixel-card-header"><span class="pixel-tag pixel-tag--green">18:00 - 23:00</span><span class="pixel-tag pixel-tag--gold">TOM PATROL</span></div>
            <h3 class="pixel-card-title">TUẦN TRA TỐI: CÔNG NGHỆ & TỔNG KẾT</h3>
            <p class="pixel-card-desc">Tập luyện thể thao (Gym OS), đọc sách, ghi chép nhật ký Peter Parker, ngủ trước 23h.</p>
          </article>
        </div>
      `;
    }

    // Default: TODO
    const uncompletedTasks = this.notionTasks.filter(t => !t.done);
    return `
      <div class="quest-source-banner">
        <span>📜 NOTION QUESTS</span>
        <strong>DANH SÁCH NHIỆM VỤ ĐỜI THỰC (${uncompletedTasks.length} VIỆC CẦN LÀM)</strong>
        <small>Hoàn thành mỗi việc sẽ kích hoạt Hero tung Combo đập quái trong Arena!</small>
      </div>
      <div class="pixel-card-grid">
        ${this.notionTasks.map((task, idx) => `
          <article class="pixel-game-card ${task.done ? 'pixel-game-card--done' : ''}">
            <div class="pixel-card-header">
              <span class="pixel-tag ${task.priority?.includes('High') || task.priority?.includes('Critical') ? 'pixel-tag--red' : 'pixel-tag'}">${task.priority || 'Bình thường'}</span>
              <span class="pixel-tag pixel-tag--green">+30 XP // +10 COINS</span>
            </div>
            <h3 class="pixel-card-title">${task.title || task.name}</h3>
            <p class="pixel-card-desc">${task.date ? `Hạn chót: ${new Date(task.date).toLocaleDateString('vi-VN')}` : 'Nhiệm vụ hàng ngày từ Notion'}</p>
            <div class="pixel-card-footer">
              ${task.address ? `<button class="pixel-action-btn pixel-action-btn--blue" data-open-task-map="${idx}">📍 BẢN ĐỒ</button>` : '<span></span>'}
              <button class="pixel-action-btn ${task.done ? 'pixel-action-btn--disabled' : ''}" 
                      data-complete-task="${idx}" ${task.done ? 'disabled' : ''}>
                ${task.done ? '✓ ĐÃ XONG' : '⚔️ HOÀN THÀNH'}
              </button>
            </div>
          </article>
        `).join('')}
      </div>
      <button class="game-panel-action" data-open-real-mission style="margin-top: 10px;">+ TẠO THÊM NHIỆM VỤ ĐỜI THẬT</button>
    `;
  }

  /* -------------------------------------------------------------
     2. TAB [HERO]: SUITS WARDROBE (WITH SHOWCASE POD), SKILLS (NOTION IMAGES), ROSTER, GADGETS
  ------------------------------------------------------------- */
  renderHeroSection() {
    const currentVariant = this.engine.data.hero.variant || 'Advanced Suit 2.0';
    const previewSuit = this.suits[this.previewSuitIndex] || this.suits[0] || {
      Suit: currentVariant,
      Owner: 'Peter Parker',
      ImageUrl: './assets/spideytracker/tracker_logo3.png',
      GameEffect: 'Tăng cường phản xạ và sức bền chiến đấu của Người Nhện.',
      LevelReq: 1,
      Cost: 'Khởi đầu'
    };
    const isEquipped = previewSuit.Suit === currentVariant;

    // Left Column: Hero Showcase Pod
    const showcaseHtml = `
      <aside class="spidey-showcase-pod">
        <div class="spidey-showcase-badge">
          <span class="pixel-tag ${isEquipped ? 'pixel-tag--red' : 'pixel-tag--gold'}">${isEquipped ? '★ ĐANG MẶC' : 'XEM TRƯỚC'}</span>
          <span class="pixel-tag">${previewSuit.Owner || 'Peter Parker'}</span>
        </div>
        <div class="spidey-showcase-avatar-frame">
          <img src="${previewSuit.ImageUrl || previewSuit.CoverUrl || './assets/spideytracker/tracker_logo3.png'}" 
               alt="${previewSuit.Suit}" />
        </div>
        <div class="spidey-showcase-details">
          <h2 class="spidey-suit-name">${previewSuit.Suit}</h2>
          <p class="spidey-suit-lore">${previewSuit.GameEffect || previewSuit.Notes || 'Bộ đồ bảo vệ Người Nhện trong các chiến dịch tuần tra New York.'}</p>
          
          <div class="spidey-stat-row">
            <span>ATK</span>
            <div class="spidey-stat-bar"><div class="spidey-stat-fill" style="width: 85%;"></div></div>
            <span>+25%</span>
          </div>
          <div class="spidey-stat-row">
            <span>DEF</span>
            <div class="spidey-stat-bar"><div class="spidey-stat-fill" style="width: 70%; background: linear-gradient(90deg, #83b96b, #54b6d0);"></div></div>
            <span>+18%</span>
          </div>
          <div class="spidey-stat-row">
            <span>WEB</span>
            <div class="spidey-stat-bar"><div class="spidey-stat-fill" style="width: 95%; background: linear-gradient(90deg, #f0645c, #f2c06b);"></div></div>
            <span>+30%</span>
          </div>

          <button class="spidey-equip-btn ${isEquipped ? 'spidey-equip-btn--equipped' : ''}" 
                  data-equip-suit="${this.previewSuitIndex}" ${isEquipped ? 'disabled' : ''}>
            ${isEquipped ? '✓ ĐANG TRANG BỊ' : '⚡ MẶC BỘ ĐỒ NÀY'}
          </button>
        </div>
      </aside>
    `;

    // Right Column content based on tab
    let rightColumnHtml = '';

    if (this.panelTab === 'ROSTER') {
      rightColumnHtml = `
        <div class="quest-source-banner">
          <span>🕷️ SPIDER-VERSE</span>
          <strong>77 BIẾN THỂ NHỆN ĐA VŨ TRỤ</strong>
          <small>Chọn đồng đội hỗ trợ (Ally Assist) để kích hoạt hiệu ứng Synergy!</small>
        </div>
        <div class="pixel-card-grid">
          ${this.spiderVerse.slice(0, 40).map((spider, idx) => `
            <article class="pixel-game-card pixel-game-card--hero">
              <div class="pixel-card-header">
                <span class="pixel-tag">${spider.Icon || '🕷️'} ${spider.Name?.split('(')[1]?.replace(')', '') || 'Multiverse'}</span>
                <span class="pixel-tag pixel-tag--green">ALL-STAR</span>
              </div>
              ${spider.IiliUrl || spider.FandomSrc ? `
                <div class="pixel-card-media">
                  <img src="${spider.IiliUrl || spider.FandomSrc}" alt="${spider.Name}" loading="lazy" />
                </div>
              ` : ''}
              <h3 class="pixel-card-title">${spider.Name?.split('—')[0] || spider.Name}</h3>
              <p class="pixel-card-desc"><em>"${spider.Quote || 'With great power comes great responsibility.'}"</em></p>
              <div class="pixel-card-footer">
                <small style="color: #f2c06b; font: 700 8px monospace;">ASSIST HERO</small>
                <button class="pixel-action-btn pixel-action-btn--gold" data-select-ally="${idx}">CHỌN ASSIST</button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } else if (this.panelTab === 'SKILLS') {
      // Detailed Skill List with high-res Notion PNG Icons
      const coreSkills = [
        { name: 'Ground Slam', icon: this.skillIcons['skill_ground_slam.png'] || 'https://iili.io/nuza6p1.png', type: 'Active AoE', sp: 1, desc: 'Lao từ trên không đập mạnh xuống đất, tạo sóng chấn động làm choáng toàn bộ kẻ thù xung quanh.' },
        { name: 'Maximum Spider', icon: this.skillIcons['skill_maximum_spider.png'] || 'https://iili.io/nuzaZCJ.png', type: 'Ultimate Strike', sp: 3, desc: 'Tuyệt chiêu tối thượng: Tung chuỗi đòn tơ liên hoàn với vận tốc ánh sáng, kết liễu boss ngay khi stagger.' },
        { name: 'Spider-Sense', icon: this.skillIcons['skill_spider_sense.png'] || 'https://iili.io/nuzc9pt.png', type: 'Passive Reflex', sp: 1, desc: 'Giác quan nhện cảnh báo trước đòn hiểm. Tăng thời gian thực hiện Né Hoàn Hảo (Perfect Dodge).' },
        { name: 'Swing Kick', icon: this.skillIcons['skill_swing_kick.png'] || 'https://iili.io/nuzcdjn.png', type: 'Aerial Combat', sp: 1, desc: 'Đu tơ lấy đà tung cú đá uy lực hất văng mục tiêu vào tường, gây thêm sát thương va đập.' },
        { name: 'Venom Punch', icon: this.skillIcons['skill_venom_punch.png'] || 'https://iili.io/nuzcIje.png', type: 'Bio-Electricity', sp: 2, desc: 'Tích tụ điện sinh học vào nắm đấm làm tê liệt hệ thần kinh của đối thủ trong 3 giây.' },
        { name: 'Web Cocoon', icon: this.skillIcons['skill_web_cocoon.png'] || 'https://iili.io/nuzcY3Q.png', type: 'Web Control', sp: 2, desc: 'Bắn tơ dồn dập gói trọn kẻ thù thành kén tơ cố định, vô hiệu hóa hoàn toàn hành động.' },
        { name: 'Web Net', icon: this.skillIcons['skill_web_net.png'] || 'https://iili.io/nuzcGZg.png', type: 'Crowd Control', sp: 1, desc: 'Giăng lưới tơ bẫy diện rộng, làm chậm 50% tốc độ áp sát của nhóm minion.' },
        { name: 'Web Zip', icon: this.skillIcons['skill_web_zip.png'] || 'https://iili.io/nuzce9I.png', type: 'Agility', sp: 1, desc: 'Phóng tơ kéo thẳng bản thân áp sát tức thì kẻ thù trên không hoặc mặt đất để nối dài combo.' }
      ];

      rightColumnHtml = `
        <div class="quest-source-banner">
          <span>⚡ SKILL LOADOUT</span>
          <strong>BẢNG KỸ NĂNG CHIẾN ĐẤU & BẮN TƠ (NOTION RENDERS)</strong>
          <small>Gán kỹ năng vào phím bấm Arena để thi triển trong trận chiến</small>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${coreSkills.map((sk) => `
            <article class="spidey-skill-card">
              <div class="spidey-skill-icon-frame">
                <img src="${sk.icon}" alt="${sk.name}" />
              </div>
              <div class="spidey-skill-info">
                <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px;">
                  <span class="pixel-tag pixel-tag--red">${sk.type}</span>
                  <span class="pixel-tag pixel-tag--gold">COST: ${sk.sp} SP</span>
                </div>
                <h4>${sk.name}</h4>
                <p>${sk.desc}</p>
              </div>
              <div class="spidey-skill-actions">
                <button class="pixel-action-btn pixel-action-btn--green" data-equip-skill="${sk.name}">
                  ⚡ TRANG BỊ
                </button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } else if (this.panelTab === 'GADGETS') {
      const gadgets = [
        { name: 'Web Shooter', icon: this.skillIcons['gadget_web_shooter.png'] || 'https://iili.io/nuzarYB.png', charges: 'Vô hạn', desc: 'Máy bắn tơ cơ bản trên cổ tay Peter Parker, bắn đạn tơ làm gián đoạn đòn đánh quái.' },
        { name: 'Web Bomb', icon: this.skillIcons['gadget_web_bomb.png'] || 'https://iili.io/nuzaeLb.png', charges: '3 Quả', desc: 'Bom tơ phát nổ giải phóng hàng trăm sợi tơ trói chặt tất cả mục tiêu trong phạm vi.' },
        { name: 'Spider-Drone', icon: this.skillIcons['gadget_spider_drone.png'] || 'https://iili.io/nuza0LG.png', charges: '2 Drone', desc: 'Drone tự hành bay lượn hỗ trợ bắn đạn năng lượng gây sát thương liên tục.' },
        { name: 'Electric Web', icon: this.skillIcons['gadget_electric_web.png'] || 'https://iili.io/nuzaugp.png', charges: '3 Phát', desc: 'Tơ điện phóng dòng điện cao thế giật tê liệt cả mục tiêu mang khiên bảo vệ.' },
        { name: 'Concussive Blast', icon: this.skillIcons['gadget_concussive_blast.png'] || 'https://iili.io/nuzaxLJ.png', charges: '2 Lần', desc: 'Sóng âm thanh cực mạnh thổi bay kẻ địch văng xa và phá vỡ thế phòng thủ.' },
        { name: 'Suspension Matrix', icon: this.skillIcons['gadget_suspension_matrix.png'] || 'https://iili.io/nuzaW22.png', charges: '2 Quả', desc: 'Trường phản trọng lực nhấc bổng toàn bộ kẻ thù lơ lửng trên không trung.' },
        { name: 'Trip Mine', icon: this.skillIcons['gadget_trip_mine.png'] || 'https://iili.io/nuzaOhu.png', charges: '3 Mìn', desc: 'Mìn laser cảm biến gắn vào tường hoặc kẻ địch, tự động kéo sập mục tiêu khi kích hoạt.' },
        { name: 'Iron Spider Arms', icon: this.skillIcons['gadget_iron_spider_arms.png'] || 'https://iili.io/nuza57I.png', charges: '1 Lần', desc: 'Bốn chân nhện cơ khí nano vươn ra từ lưng, tăng 100% sát thương cận chiến và xuyên giáp.' }
      ];

      rightColumnHtml = `
        <div class="quest-source-banner">
          <span>⌁ GADGET WHEEL</span>
          <strong>THIẾT BỊ CÔNG NGHỆ PETER PARKER (NOTION RENDERS)</strong>
          <small>Nâng cấp trang bị bằng Web Coins kiếm được từ nhiệm vụ đời thật</small>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${gadgets.map((g) => `
            <article class="spidey-skill-card">
              <div class="spidey-skill-icon-frame" style="border-color: #83b96b;">
                <img src="${g.icon}" alt="${g.name}" />
              </div>
              <div class="spidey-skill-info">
                <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px;">
                  <span class="pixel-tag pixel-tag--green">${g.charges}</span>
                  <span class="pixel-tag pixel-tag--gold">GADGET</span>
                </div>
                <h4>${g.name}</h4>
                <p>${g.desc}</p>
              </div>
              <div class="spidey-skill-actions">
                <button class="pixel-action-btn pixel-action-btn--blue">NÂNG CẤP</button>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    } else {
      // Default: SUITS Wardrobe Tiles Grid
      rightColumnHtml = `
        <div class="quest-source-banner">
          <span>👕 WARDROBE GRID</span>
          <strong>BẤM VÀO TỪNG BỘ SUIT ĐỂ XEM TRƯỚC VÀ THAY ĐỒ (${this.suits.length} BỘ SUITS)</strong>
          <small>Ảnh render trích xuất từ Marvel's Spider-Man & Notion Database</small>
        </div>
        <div class="spidey-suit-tiles">
          ${this.suits.map((suit, idx) => {
            const isEquip = suit.Suit === currentVariant;
            const isPreview = idx === this.previewSuitIndex;
            return `
              <div class="spidey-suit-tile ${isPreview ? 'active' : ''} ${isEquip ? 'equipped' : ''}" 
                   data-preview-suit="${idx}">
                <img src="${suit.ImageUrl || suit.CoverUrl || './assets/spideytracker/tracker_logo3.png'}" 
                     alt="${suit.Suit}" 
                     class="spidey-suit-tile-img" 
                     loading="lazy" />
                <span class="spidey-suit-tile-name">${suit.Suit}</span>
                <small style="color: #7fbfd2; font: 700 6px monospace; margin-top: 3px;">LV ${suit.LevelReq || 1}</small>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    return `
      <div class="spidey-hero-screen">
        ${showcaseHtml}
        <div class="spidey-gear-container">
          ${rightColumnHtml}
        </div>
      </div>
    `;
  }


  /* -------------------------------------------------------------
     3. TAB [ARCHIVE]: BESTIARY (BOSS & MINION), BACKPACKS, BADGES
  ------------------------------------------------------------- */
  renderArchiveSection() {
    if (this.panelTab === 'BACKPACKS') {
      return `
        <div class="quest-source-banner">
          <span>🎒 SPIDEY BACKPACKS</span>
          <strong>55 BA LÔ KỶ NIỆM PETER GIẤU QUANH NEW YORK</strong>
          <small>Những mảnh ghép quá khứ và vật kỷ niệm của Người Nhện</small>
        </div>
        <div class="pixel-card-grid">
          ${this.backpacks.map((bp) => `
            <article class="pixel-game-card">
              <div class="pixel-card-header">
                <span class="pixel-tag">#${bp.Index}</span>
                <span class="pixel-tag pixel-tag--gold">${bp.District || 'Manhattan'}</span>
              </div>
              <h3 class="pixel-card-title">${bp.TitleVi || bp.TitleEn}</h3>
              <p class="pixel-card-desc">${bp.Notes || 'Vật phẩm kỷ niệm của Peter Parker.'}</p>
              <div class="pixel-card-footer">
                <small style="color: #83b96b; font: 700 8px monospace;">ĐÃ KHÁM PHÁ</small>
                <span class="pixel-tag pixel-tag--green">COLLECTED</span>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    }

    if (this.panelTab === 'BADGES') {
      const badgeEntries = Object.entries(this.badges);
      return `
        <div class="quest-source-banner">
          <span>🎖️ BADGES</span>
          <strong>37 HUY HIỆU DANH DỰ LỊCH SỬ TRUYỆN TRANH</strong>
          <small>Thành tích mở khóa khi vượt qua các mốc thử thách đời thực</small>
        </div>
        <div class="pixel-card-grid pixel-card-grid--compact">
          ${badgeEntries.map(([originalName, badge]) => `
            <article class="pixel-game-card pixel-game-card--gold">
              <div class="pixel-card-header">
                <span style="font-size: 20px;">${badge.icon || '🏅'}</span>
                <span class="pixel-tag pixel-tag--gold">MEDAL</span>
              </div>
              <h3 class="pixel-card-title" style="font-size: 9px;">${badge.title || originalName}</h3>
              <p class="pixel-card-desc" style="font-size: 9px;">${originalName}</p>
              <div class="pixel-card-footer">
                <span class="pixel-tag pixel-tag--green">UNLOCKED</span>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    }

    // Default: BESTIARY (Boss & Minions)
    const minionEntries = Object.entries(this.minions);
    return `
      <div class="quest-source-banner">
        <span>👹 BESTIARY</span>
        <strong>THƯ VIỆN KẺ THÙ: BOSSES & MINIONS</strong>
        <small>Thông số, điểm yếu và hệ khắc chế trong các ải tuần tra</small>
      </div>
      <div class="pixel-card-grid">
        ${this.bosses.map((boss) => `
          <article class="pixel-game-card pixel-game-card--hero">
            <div class="pixel-card-header">
              <span class="pixel-tag pixel-tag--red">BOSS // ${boss.enemyClass || 'Elite'}</span>
              <span class="pixel-tag pixel-tag--gold">HP: ${boss.hp}</span>
            </div>
            <h3 class="pixel-card-title">${boss.name}</h3>
            <p class="pixel-card-desc">${boss.notes || 'Thủ lĩnh phản diện đối đầu Spider-Man.'}</p>
            <div class="pixel-card-footer">
              <small style="color: #f0645c; font: 700 8px monospace;">ATK: ${boss.atk} | DEF: ${boss.def}</small>
              <span class="pixel-tag pixel-tag--red">CHAPTER BOSS</span>
            </div>
          </article>
        `).join('')}
        ${minionEntries.slice(0, 30).map(([name, desc]) => `
          <article class="pixel-game-card">
            <div class="pixel-card-header">
              <span class="pixel-tag">MINION</span>
              <span class="pixel-tag pixel-tag--green">TIER 1</span>
            </div>
            <h3 class="pixel-card-title">${name}</h3>
            <p class="pixel-card-desc">${desc}</p>
            <div class="pixel-card-footer">
              <small style="color: #54b6d0; font: 700 8px monospace;">WEAK: WEB / THROW</small>
              <span class="pixel-tag">GRUNT</span>
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }

  /* -------------------------------------------------------------
     4. TAB [CHRONICLE]: RHYTHM (NHỊP SINH HỌC 24H), JOURNAL, GYM OS
  ------------------------------------------------------------- */
  renderChronicleSection() {
    if (this.panelTab === 'JOURNAL') {
      return `
        <div class="quest-source-banner">
          <span>📓 CHRONICLE</span>
          <strong>NHẬT KÝ CHIẾN TÍCH PETER PARKER</strong>
          <small>Ghi lại bài học và chiến công mỗi ngày để rèn giũa bản thân</small>
        </div>
        <div style="background: #091a2c; border: 2px solid #05070b; padding: 14px; margin-bottom: 12px; box-shadow: inset 0 0 0 1px #397c9b;">
          <h3 style="font: 700 11px 'Press Start 2P', monospace; color: #f2c06b; margin-bottom: 8px;">VIẾT NHẬT KÝ HÔM NAY</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="font: 700 8px 'Silkscreen', monospace; color: #9ed9e7;">1. BA ĐIỀU BIẾT ƠN HÔM NAY:</label>
            <input type="text" id="journal-input-grateful" class="form-input" placeholder="Ví dụ: Hoàn thành dự án, gia đình bình an..." style="border: 2px solid #05070b; background: #050b12; color: #fff; padding: 6px;" />
            
            <label style="font: 700 8px 'Silkscreen', monospace; color: #9ed9e7;">2. BÀI HỌC LỚN NHẤT RÚT RA:</label>
            <input type="text" id="journal-input-lesson" class="form-input" placeholder="Ví dụ: Đừng chần chừ, tập trung làm dứt điểm từng việc..." style="border: 2px solid #05070b; background: #050b12; color: #fff; padding: 6px;" />
            
            <label style="font: 700 8px 'Silkscreen', monospace; color: #9ed9e7;">3. CHIẾN CÔNG ĐẮC Ý NHẤT:</label>
            <textarea id="journal-input-win" rows="2" class="form-textarea" placeholder="Hôm nay mình đã vượt qua được thói quen xấu nào?" style="border: 2px solid #05070b; background: #050b12; color: #fff; padding: 6px;"></textarea>
            
            <button class="pixel-action-btn pixel-action-btn--gold" id="btn-save-journal" style="align-self: flex-start; margin-top: 6px;">💾 LƯU NHẬT KÝ VÀO NOTION</button>
          </div>
        </div>
        <div class="pixel-card-grid">
          ${this.journalEntries.length ? this.journalEntries.map((entry) => `
            <article class="pixel-game-card">
              <div class="pixel-card-header"><span class="pixel-tag">${entry.date}</span><span class="pixel-tag pixel-tag--green">RECORDED</span></div>
              <h3 class="pixel-card-title">${entry.win || 'Nhật ký ngày'}</h3>
              <p class="pixel-card-desc"><strong>Biết ơn:</strong> ${entry.grateful}<br><strong>Bài học:</strong> ${entry.lesson}</p>
            </article>
          `).join('') : '<article class="pixel-game-card"><p class="pixel-card-desc">Chưa có nhật ký nào được ghi lại. Hãy viết trang đầu tiên hôm nay!</p></article>'}
        </div>
      `;
    }

    if (this.panelTab === 'GYM') {
      const hero = this.engine.snapshot().hero;
      return `
        <div class="quest-source-banner">
          <span>💪 GYM OS</span>
          <strong>RÈN LUYỆN THỂ CHẤT THỰC TẾ</strong>
          <small>Mỗi hiệp tập hoàn thành cộng chỉ số Sức Mạnh (ATK) hoặc Phòng Thủ (DEF) vĩnh viễn!</small>
        </div>
        <div class="pixel-card-grid">
          <article class="pixel-game-card pixel-game-card--hero">
            <div class="pixel-card-header"><span class="pixel-tag pixel-tag--red">STRENGTH</span><span class="pixel-tag pixel-tag--gold">+1 ATK</span></div>
            <h3 class="pixel-card-title">HÍT ĐẤT (PUSH-UPS)</h3>
            <p class="pixel-card-desc">Mục tiêu: 3 hiệp x 15 cái. Tăng sức bộc phát của cánh tay khi tung Combo đấm đá.</p>
            <div class="pixel-card-footer">
              <small style="color: #7fbfd2;">HERO ATK: ${65 + (hero.bonusAtk || 0)}</small>
              <button class="pixel-action-btn pixel-action-btn--red" data-gym-train="atk">💪 HOÀN THÀNH (+1 ATK)</button>
            </div>
          </article>
          <article class="pixel-game-card pixel-game-card--gold">
            <div class="pixel-card-header"><span class="pixel-tag pixel-tag--green">ENDURANCE</span><span class="pixel-tag pixel-tag--gold">+1 DEF</span></div>
            <h3 class="pixel-card-title">GẬP BỤNG / PLANK</h3>
            <p class="pixel-card-desc">Mục tiêu: 3 phút Plank hoặc 50 cái gập bụng. Tăng độ vững cơ core và chống chịu.</p>
            <div class="pixel-card-footer">
              <small style="color: #7fbfd2;">HERO DEF: ${40 + (hero.bonusDef || 0)}</small>
              <button class="pixel-action-btn pixel-action-btn--green" data-gym-train="def">🛡️ HOÀN THÀNH (+1 DEF)</button>
            </div>
          </article>
          <article class="pixel-game-card">
            <div class="pixel-card-header"><span class="pixel-tag pixel-tag--blue">CARDIO</span><span class="pixel-tag pixel-tag--gold">+20 HP MAX</span></div>
            <h3 class="pixel-card-title">CHẠY BỘ (SPIDEY RUN)</h3>
            <p class="pixel-card-desc">Mục tiêu: Chạy 2km - 5km ngoài trời. Mở rộng thanh sinh lực tối đa của Hero.</p>
            <div class="pixel-card-footer">
              <small style="color: #7fbfd2;">MAX HP: ${this.engine.data.hero.maxHp}</small>
              <button class="pixel-action-btn pixel-action-btn--blue" data-gym-train="hp">🏃 HOÀN THÀNH (+20 HP)</button>
            </div>
          </article>
        </div>
      `;
    }

    // Default: RHYTHM (Nhịp sinh học 24h)
    const now = new Date();
    const currentHour = now.getHours();
    return `
      <div class="quest-source-banner">
        <span>⏰ CIRCADIAN RHYTHM</span>
        <strong>ĐỒNG HỒ NHỊP SINH HỌC 24H (GIỜ HIỆN TẠI: ${now.toLocaleTimeString('vi-VN')})</strong>
        <small>Cân bằng hoạt động trong ngày theo nhịp sinh học tự nhiên của cơ thể</small>
      </div>
      <div class="rhythm-clock-container">
        <div class="rhythm-phase-box ${currentHour >= 6 && currentHour < 10 ? 'active' : ''}">
          <div class="pixel-card-header"><span class="pixel-tag">06:00 - 10:00</span><span class="pixel-tag pixel-tag--gold">${currentHour >= 6 && currentHour < 10 ? 'ĐANG DIỄN RA' : ''}</span></div>
          <h3 class="pixel-card-title">GIAI ĐOẠN 1: KHỞI ĐỘNG & TỈNH TÁO</h3>
          <p class="pixel-card-desc">Cortisol tăng tự nhiên. Tiếp xúc ánh sáng mặt trời, uống 500ml nước, tránh bấm mạng xã hội 60 phút đầu.</p>
        </div>
        <div class="rhythm-phase-box ${currentHour >= 10 && currentHour < 14 ? 'active' : ''}">
          <div class="pixel-card-header"><span class="pixel-tag pixel-tag--red">10:00 - 14:00</span><span class="pixel-tag pixel-tag--gold">${currentHour >= 10 && currentHour < 14 ? 'ĐANG DIỄN RA' : ''}</span></div>
          <h3 class="pixel-card-title">GIAI ĐOẠN 2: ĐỈNH CAO TẬP TRUNG (DEEP WORK)</h3>
          <p class="pixel-card-desc">Khả năng nhận thức và tư duy logic đạt cực đại. Giải quyết các nhiệm vụ khó nhất (Main Quest).</p>
        </div>
        <div class="rhythm-phase-box ${currentHour >= 14 && currentHour < 18 ? 'active' : ''}">
          <div class="pixel-card-header"><span class="pixel-tag pixel-tag--green">14:00 - 18:00</span><span class="pixel-tag pixel-tag--gold">${currentHour >= 14 && currentHour < 18 ? 'ĐANG DIỄN RA' : ''}</span></div>
          <h3 class="pixel-card-title">GIAI ĐOẠN 3: THỂ LỰC VÀNG (WORKOUT PEAK)</h3>
          <p class="pixel-card-desc">Nhiệt độ cơ thể và trương lực cơ bắp cao nhất. Thời điểm vàng để tập Gym, chạy bộ hoặc vận động.</p>
        </div>
        <div class="rhythm-phase-box ${currentHour >= 18 || currentHour < 6 ? 'active' : ''}">
          <div class="pixel-card-header"><span class="pixel-tag pixel-tag--blue">18:00 - 23:00</span><span class="pixel-tag pixel-tag--gold">${currentHour >= 18 || currentHour < 6 ? 'ĐANG DIỄN RA' : ''}</span></div>
          <h3 class="pixel-card-title">GIAI ĐOẠN 4: HỒI PHỤC & MELATONIN</h3>
          <p class="pixel-card-desc">Giảm ánh sáng xanh, đọc sách, viết nhật ký Peter Parker, chuẩn bị giấc ngủ ngon để nạp lại thanh HP.</p>
        </div>
      </div>
    `;
  }

  /* -------------------------------------------------------------
     5. SETTINGS SECTION
  ------------------------------------------------------------- */
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

  /* -------------------------------------------------------------
     EVENT BINDINGS & NOTION 2-WAY SYNC
  ------------------------------------------------------------- */
  bindEvents(content) {
    // 1. Task Completion -> Attack Enemy in Arena & Sync to Notion
    content.querySelectorAll('[data-complete-task]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.completeTask, 10);
        const task = this.notionTasks[idx];
        if (!task || task.done) return;

        task.done = true;
        this.sound.playVictoryCue();

        // Deal combat strike in Arena
        this.engine.performAction('attack');
        this.engine.state.hero.xp += 30;
        this.engine.state.hero.coins += 10;
        if (this.engine.state.hero.xp >= this.engine.state.hero.xpToNext) {
          this.engine.levelUp();
        }

        this.toast(`QUEST DONE // PETER TUNG ĐÒN! +30 XP +10 COINS`);

        // Send 2-way sync to Notion in background
        if (task.id) {
          fetch(`/api/notion?path=${encodeURIComponent('/v1/pages/' + task.id.replace(/-/g, ''))}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ properties: { Done: { checkbox: true } } })
          }).catch(() => console.log('[NotionSync] Offline or queued'));
        }

        this.renderPanel();
      });
    });

    // 2. Open map overlay for located tasks
    content.querySelectorAll('[data-open-task-map]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closePanel();
        this.selectSection('CITY');
      });
    });

    // 3. Habit Check-in -> Restore HP & Web + Sync
    content.querySelectorAll('[data-checkin-habit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.checkinHabit, 10);
        const habit = this.notionHabits[idx];
        if (!habit || habit.done || habit.today) return;

        habit.done = true;
        habit.today = true;
        this.sound.playSelect();

        // Restore Hero HP & Web Energy
        this.engine.state.hero.hp = Math.min(this.engine.data.hero.maxHp, this.engine.state.hero.hp + 30);
        this.engine.state.hero.webEnergy = this.engine.data.hero.maxWebEnergy;
        this.engine.state.hero.streak += 1;

        this.toast(`HABIT CHECKED // HỒI PHỤC HP & TƠ! STREAK +1`);

        // Sync to Notion
        if (habit.id) {
          fetch(`/api/notion?path=${encodeURIComponent('/v1/pages/' + habit.id.replace(/-/g, ''))}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ properties: { Today: { checkbox: true } } })
          }).catch(() => console.log('[NotionSync] Offline or queued'));
        }

        this.renderPanel();
      });
    });

    // 4. Preview Suit (click tile)
    content.querySelectorAll('[data-preview-suit]').forEach((tile) => {
      tile.addEventListener('click', () => {
        this.previewSuitIndex = parseInt(tile.dataset.previewSuit, 10);
        this.sound.playSelect();
        this.renderPanel();
      });
    });

    // 5. Equip Suit
    content.querySelectorAll('[data-equip-suit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.equipSuit, 10);
        const suit = this.suits[idx];
        if (!suit) return;

        this.equippedSuitIndex = idx;
        this.engine.data.hero.variant = suit.Suit;
        this.engine.data.hero.suitEffect = suit.GameEffect;
        this.sound.playVictoryCue();
        this.toast(`SUIT EQUIPPED // ${suit.Suit.toUpperCase()}`);
        this.render();
        this.renderPanel();
      });
    });

    // 6. Equip Skill
    content.querySelectorAll('[data-equip-skill]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const skillName = btn.dataset.equipSkill;
        this.sound.playVictoryCue();
        this.toast(`SKILL EQUIPPED // ${skillName.toUpperCase()}`);
        this.renderPanel();
      });
    });

    // 5. Select Ally
    content.querySelectorAll('[data-select-ally]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.selectAlly, 10);
        const spider = this.spiderVerse[idx];
        if (!spider) return;

        this.engine.data.ally.name = spider.Name.split('(')[0].trim();
        this.engine.data.ally.skill = spider.Quote || 'Multiverse Web Strike';
        this.sound.playSelect();
        this.toast(`ALLY SELECTED // ${spider.Name.split('—')[0]}`);
        this.renderPanel();
      });
    });

    // 6. Gym Train
    content.querySelectorAll('[data-gym-train]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.gymTrain;
        if (type === 'atk') {
          this.engine.state.hero.bonusAtk = (this.engine.state.hero.bonusAtk || 0) + 1;
          this.toast(`WORKOUT DONE // HERO ATK +1!`);
        } else if (type === 'def') {
          this.engine.state.hero.bonusDef = (this.engine.state.hero.bonusDef || 0) + 1;
          this.toast(`WORKOUT DONE // HERO DEF +1!`);
        } else if (type === 'hp') {
          this.engine.data.hero.maxHp += 20;
          this.engine.state.hero.hp += 20;
          this.toast(`CARDIO DONE // MAX HP +20!`);
        }
        this.sound.playVictoryCue();
        this.renderPanel();
      });
    });

    // 7. Save Journal
    const btnSaveJournal = content.querySelector('#btn-save-journal');
    if (btnSaveJournal) {
      btnSaveJournal.addEventListener('click', () => {
        const grateful = content.querySelector('#journal-input-grateful')?.value?.trim();
        const lesson = content.querySelector('#journal-input-lesson')?.value?.trim();
        const win = content.querySelector('#journal-input-win')?.value?.trim();

        if (!grateful && !lesson && !win) {
          this.toast('VUI LÒNG ĐIỀN NỘI DUNG NHẬT KÝ');
          return;
        }

        const entry = {
          date: new Date().toLocaleDateString('vi-VN'),
          grateful: grateful || 'Một ngày bình an',
          lesson: lesson || 'Tiếp tục rèn luyện',
          win: win || 'Hoàn thành thử thách'
        };

        this.journalEntries.unshift(entry);
        localStorage.setItem('spidey_journal_entries', JSON.stringify(this.journalEntries.slice(0, 30)));
        this.sound.playVictoryCue();
        this.toast('NHẬT KÝ ĐÃ LƯU!');
        this.renderPanel();
      });
    }

    // 8. Open Real Mission Editor
    content.querySelector('[data-open-real-mission]')?.addEventListener('click', () => {
      this.closePanel();
      this.bus.emit('OPEN_EDITOR', { type: 'WORK', status: 'PLANNED' });
    });

    // 9. Bind Settings
    this.bindSettings(content);
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
    const toast = document.createElement('div'); 
    toast.className = 'combat-toast'; 
    toast.textContent = message; 
    host?.appendChild(toast); 
    setTimeout(() => toast.remove(), 1200);
  }

  text(id, value) { const el = document.getElementById(id); if (el) el.textContent = String(value); }
  width(id, value) { const el = document.getElementById(id); if (el) el.style.width = `${Math.max(0,Math.min(100,value))}%`; }
}
