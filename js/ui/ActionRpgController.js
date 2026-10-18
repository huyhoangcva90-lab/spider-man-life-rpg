import { NOTION_GAME_DATABASES, normalizeNotionPage, normalizeNotionCatalogPage, queryAllNotionPages, queueNotionWrite, flushPendingNotionWrites, readPendingNotionWrites } from '../integrations/notion/NotionGameData.js?build=arena-maps-1';
import { NotionGamePresenter } from './NotionGamePresenter.js?build=hero-build-preview-5';

export class ActionRpgController {
  constructor(eventBus, engine, soundController, mapEngine) {
    this.bus = eventBus;
    this.engine = engine;
    this.sound = soundController;
    this.mapEngine = mapEngine;
    this.notionPresenter = engine.notionAuthority ? new NotionGamePresenter(this) : null;
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
    this.gadgetsCatalog = [];
    this.notionTasks = [];
    this.notionHabits = [];
    this.notionGoals = [];
    this.notionActiveQuests = [];
    this.notionHeroProfile = null;
    this.notionArenaMaps = [
      { id: '3f7d787636c681ceb91bc576612416be', Map: 'Manhattan Rooftop', 'Map Key': 'rooftop', District: 'MANHATTAN ROOFTOP', Weather: 'NIGHT // LIGHT RAIN', Description: 'Mái nhà New York, đường chân trời và mưa đêm.', 'Unlock Level': 1, Available: true },
      { id: '3f7d787636c681788e5be15cf5b2fde6', Map: 'Subway Underground', 'Map Key': 'subway', District: 'NEW YORK SUBWAY', Weather: 'UNDERGROUND // NEON', Description: 'Sân ga ngầm, đèn tín hiệu và đoàn tàu lướt qua.', 'Unlock Level': 1, Available: true },
      { id: '3f7d787636c68107a607f4a97272d4a5', Map: 'Oscorp Lab', 'Map Key': 'lab', District: 'OSCORP LAB', Weather: 'INTERIOR // ALERT', Description: 'Phòng thí nghiệm Oscorp, ống năng lượng và cảnh báo đỏ.', 'Unlock Level': 1, Available: true }
    ];
    this.selectedArenaMapId = localStorage.getItem('spidey_arena_map') || this.notionArenaMaps[0].id;
    this.notionBadges = [];
    this.notionSuits = [];
    this.notionGadgets = [];
    this.notionCombatSkills = [];
    this.notionSpiderVerse = [];
    this.notionWorkoutPlans = [];
    this.notionExerciseLogs = [];
    this.notionCardioLogs = [];
    this.notionSportLogs = [];
    this.notionEnemies = [];
    this.notionTimeLogs = [];
    this.notionJournalEntries = [];
    try { this.focusSession = JSON.parse(localStorage.getItem('spidey_focus_session') || 'null') || { startedAt: null, elapsedMs: 0, running: false, firstStartedAt: null }; }
    catch { this.focusSession = { startedAt: null, elapsedMs: 0, running: false, firstStartedAt: null }; }
    this.focusInterval = null;
    this.notionSource = 'snapshot';
    this.notionSyncedAt = null;
    this.notionConnection = 'checking';
    this.notionError = '';
    this.notionLiveKinds = new Set();
    this.skillIcons = {};
    this.effectIcons = {};
    this.skillsCatalog = [];
    this.snapCards = [];
    this.snapMap = new Map();
    this.previewSuitIndex = 0;
    this.equippedSuitIndex = 0;
    this.visibleEnemyId = null;
    this.enemyMotionTimer = null;
    this.journalEntries = JSON.parse(localStorage.getItem('spidey_journal_entries') || '[]');
    document.addEventListener('error', (event) => {
      const image = event.target;
      if (image?.tagName !== 'IMG' || !image.dataset.badgeFallback) return;
      const fallback = image.dataset.badgeFallback;
      delete image.dataset.badgeFallback;
      image.src = fallback;
    }, true);
  }

  async init() {
    this.fieldAppId = null;
    this.bus.on('OPEN_FIELD_APP',({id})=>this.openEmbeddedFieldApp(id));
    window.addEventListener('message', event => {
      const frame = document.querySelector('[data-field-app-frame]');
      if (event.origin !== location.origin || event.source !== frame?.contentWindow) return;
      if (event.data?.type === 'spider:gambit-open' && FIELD_APPS[event.data.id] && event.data.id !== 'launcher') this.openEmbeddedFieldApp(event.data.id);
      if (event.data?.type === 'spider:field-ready') document.querySelector('.spider-field-app-loading')?.setAttribute('hidden','');
      if (event.data?.type === 'spider:gambit-home') this.closeEmbeddedFieldApp();
      if (event.data?.type === 'spider:notion-status') {
        const auto=['todo','habits'].includes(document.querySelector('[data-field-app]')?.dataset.fieldApp);
        const labels = { connected:auto?'Notion · tự cập nhật 30s':'Đã mở kết nối Field', locked:'Mở kết nối riêng', unconfigured:'Chưa mở được kết nối', error:'Kiểm tra kết nối' };
        const button = document.querySelector('[data-notion-connect]');
        if (button && labels[event.data.state]) button.textContent = labels[event.data.state];
      }
    });
    if (!this.notionPresenter && !localStorage.getItem('spidey_owner_clean_start_v2')) {
      // Owner-approved migration: discard every old demo battle and start from Notion's clean state.
      localStorage.removeItem('spidey_notion_pending_writes');
      localStorage.removeItem('spidey_notion_profile_pending');
      this.engine.resetSave();
      const hero = this.engine.state.progression;
      hero.level = 1;
      hero.xp = 0;
      hero.totalXp = 0;
      hero.coins = 0;
      hero.hp = 0;
      hero.maxHp = 100;
      hero.webEnergy = 0;
      this.engine.commit({ ownerCleanStart: true });
      localStorage.setItem('spidey_owner_clean_start_v2', new Date().toISOString());
    }
    document.querySelectorAll('[data-game-section]').forEach((button) => button.addEventListener('click', () => this.selectSection(button.dataset.gameSection)));
    document.querySelectorAll('[data-combat-action]').forEach((button) => button.addEventListener('click', () => this.runAction(button.dataset.combatAction)));
    document.getElementById('game-panel-close')?.addEventListener('click', () => this.returnToHome());
    document.getElementById('game-panel-backdrop')?.addEventListener('click', (event) => { if (event.target.id === 'game-panel-backdrop') this.closePanel(); });
    document.getElementById('btn-next-patrol')?.addEventListener('click', () => this.engine.startNextPatrol());
    document.getElementById('arena-open-habits')?.addEventListener('click', () => this.selectSection('HABITS'));
    document.getElementById('action-rpg-screen')?.addEventListener('pointerdown', () => this.playIntroOnce(), { once: true });
    document.querySelectorAll('.hud-avatar,.hud-stat--level').forEach(control => {
      if (document.documentElement.hasAttribute('data-pk-embed')) { control.disabled = true; return; }
      control.addEventListener('click', () => this.selectSection('HERO'));
    });
    document.getElementById('btn-footer-settings')?.addEventListener('click', () => {
      this.panelSection = 'SETTINGS';
      this.panelTab = 'GAME';
      this.openPanel('SETTINGS');
      this.updateRoute();
    });

    document.addEventListener('visibilitychange', () => this.syncAutoCombat(this.engine.snapshot().settings));
    this.bus.on('CAMPAIGN_UPDATED', (result) => this.handleUpdate(result));
    this.bus.on('ENEMY_COUNTERATTACK', () => this.animateEnemy('attack', 520));
    this.bus.on('GAME_MENU_TARGET', ({ section, tab }) => {
      if (section === 'CITY') return this.selectSection('CITY');
      if (section === 'ARCHIVE') { section = 'HERO'; tab = 'BADGES'; }
      if (section === 'CHRONICLE') { section = 'FIELD'; tab = tab === 'RHYTHM' ? 'TIME' : tab; }
      this.selectSection(section, false);
      this.panelTab = tab || this.defaultTab(section);
      this.renderPanel();
      this.updateRoute();
    });

    // Load rich game datasets
    await this.loadAllGameData();
    if (this.notionPresenter) await this.notionPresenter.init();

    // A fresh owner save must remain playable while the private Notion session is unavailable.
    if (!this.notionPresenter && !this.notionHeroProfile && !localStorage.getItem('spidey_offline_hero_ready_v1')) {
      const hero = this.engine.state.progression;
      if (hero.hp <= 0 && hero.webEnergy <= 0) {
        hero.hp = hero.maxHp || 100;
        hero.webEnergy = this.engine.data.hero.maxWebEnergy;
        this.engine.commit({ offlineHeroReady: true });
      }
      localStorage.setItem('spidey_offline_hero_ready_v1', '1');
    }

    const initialRoute = new URL(location.href);
    this.selectSection('ARENA', false, false);
    this.restoreRoute(initialRoute);
    window.addEventListener('popstate', () => this.restoreRoute());
    this.render();
    this.focusInterval = window.setInterval(() => this.updateFocusClock(), 1000);
    void this.checkNotionSession();
  }

  async checkNotionSession() {
    if (['localhost', '127.0.0.1'].includes(location.hostname)) {
      this.notionConnection = 'connected';
      return this.syncLiveFromNotion(null, { quiet: true });
    }
    try {
      const response = await fetch('/api/notion-session', { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Phiên Notion không khả dụng trên máy chủ này.');
      const session = await response.json();
      this.notionConnection = session.connected ? 'connected' : session.configured ? 'locked' : 'unconfigured';
      if (session.connected) return this.syncLiveFromNotion(null, { quiet: true });
      this.notionError = session.configured ? 'Nhập mã kết nối riêng để đồng bộ Notion.' : 'Máy chủ chưa cấu hình khóa Notion và mã truy cập riêng.';
    } catch (error) {
      this.notionConnection = 'unavailable';
      this.notionError = error.message;
    }
    this.render();
  }

  canWriteNotion(kind) {
    return this.notionConnection === 'connected' && this.notionLiveKinds.has(kind);
  }

  canUseData(kind) {
    return this.canWriteNotion(kind) || this.notionConnection !== 'connected';
  }

  saveLocalData() {
    this.notionSource = 'local';
    this.notionSyncedAt = new Date().toISOString();
    this.persistNotionCache();
  }

  todayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  notionAccessHtml() {
    if (this.notionConnection === 'connected') return '<div class="notion-access-actions"><button id="btn-sync-notion-live" class="pixel-action-btn pixel-action-btn--blue" type="button">↻ ĐỒNG BỘ NOTION</button><button id="btn-disconnect-notion" class="pixel-action-btn" type="button">NGẮT KẾT NỐI</button></div>';
    if (this.notionConnection === 'checking') return '<span class="notion-access-note">Đang kiểm tra kết nối riêng…</span>';
    if (this.notionConnection === 'locked') return '<form id="notion-auth-form" class="notion-auth-form"><label for="notion-access-code">Mã kết nối riêng</label><input id="notion-access-code" name="accessCode" type="password" autocomplete="off" required minlength="8" placeholder="Nhập mã truy cập…"><button class="pixel-action-btn pixel-action-btn--blue" type="submit">KẾT NỐI</button></form>';
    return '<div class="notion-access-actions"><span class="notion-access-note">Tiến độ lưu trên thiết bị này.</span><button id="btn-recheck-notion" class="pixel-action-btn pixel-action-btn--blue" type="button">KIỂM TRA NOTION</button></div>';
  }

  notionStatusHtml() {
    const pending = readPendingNotionWrites().length + (localStorage.getItem('spidey_notion_profile_pending') ? 1 : 0);
    const age = this.notionSyncedAt ? Date.now() - Date.parse(this.notionSyncedAt) : Infinity;
    const stale = !Number.isFinite(age) || age > 24 * 60 * 60 * 1000;
    const local = this.notionConnection !== 'connected';
    const source = local ? this.notionSource === 'local' ? 'ĐÃ LƯU TRÊN THIẾT BỊ' : 'BẢN LƯU CỤC BỘ' : this.notionSource === 'live' ? 'NOTION LIVE' : this.notionSource === 'mixed' ? 'NOTION MỘT PHẦN' : 'BẢN CHỤP NOTION';
    const time = this.notionSyncedAt && Number.isFinite(Date.parse(this.notionSyncedAt)) ? new Date(this.notionSyncedAt).toLocaleString('vi-VN') : 'chưa rõ';
    return `<div class="notion-status-line" role="status" aria-live="polite"><strong>${source}${stale && this.notionSource !== 'local' ? ' · DỮ LIỆU CŨ' : ''}</strong><span>${this.notionSource === 'local' ? 'Lần lưu' : 'Lần cập nhật'}: ${time}${pending ? ` · ${pending} thay đổi chờ gửi` : ''}</span>${local ? '<small>Thay đổi chỉ lưu trên trình duyệt này. Dùng Export Save trong Settings để sao lưu.</small>' : this.notionError ? `<small>${this.escapeHtml(this.notionError)}</small>` : ''}${pending && this.notionConnection === 'connected' && this.notionSource === 'live' ? '<button type="button" id="btn-send-pending-notion" class="pixel-action-btn">XEM & GỬI THAY ĐỔI CHỜ</button>' : ''}</div>`;
  }

  habitDescription(habit) {
    const name = habit.name || habit.title || '';
    const description = habit.description || '';
    if (/facebook|tiktok/i.test(name) && /youtube/i.test(description)) return habit.outcome || `Giảm thời gian lướt ${name.replace(/^Không\s+/i, '')}.`;
    return description || habit.outcome || 'Duy trì thói quen mỗi ngày.';
  }

  async loadAllGameData() {
    try {
      const [suitsRes, verseRes, bossesRes, minionsRes, backpacksRes, badgesRes, gadgetsRes, snapRes, iconsRes, effectsRes, skillsRes, snapCardsRes, notionBadgesRes] = await Promise.allSettled([
        fetch('./data/suits.json').then(r => r.json()),
        fetch('./data/spider-verse.json').then(r => r.json()),
        fetch('./data/bosses.json').then(r => r.json()),
        fetch('./data/minions.json').then(r => r.json()),
        fetch('./data/backpacks.json').then(r => r.json()),
        fetch('./data/badges.json').then(r => r.json()),
        fetch('./data/gadgets.json').then(r => r.json()),
        fetch('./data/notion-snapshot.json').then(r => r.json()),
        fetch('./data/skill_icons.json').then(r => r.json()),
        fetch('./data/effect_icons.json').then(r => r.json()),
        fetch('./data/skills.json').then(r => r.json()),
        fetch('./data/marvel_snap_cards.json').then(r => r.json()),
        fetch('./data/notion-badges.json').then(r => r.json())
      ]);

      if (suitsRes.status === 'fulfilled') this.suits = suitsRes.value || [];
      if (verseRes.status === 'fulfilled') this.spiderVerse = verseRes.value || [];
      if (bossesRes.status === 'fulfilled') this.bosses = bossesRes.value || [];
      if (minionsRes.status === 'fulfilled') this.minions = minionsRes.value || {};
      if (backpacksRes.status === 'fulfilled') this.backpacks = backpacksRes.value || [];
      if (badgesRes.status === 'fulfilled') this.badges = badgesRes.value?.rename_map || {};
      if (notionBadgesRes.status === 'fulfilled') this.notionBadges = notionBadgesRes.value?.badges || [];
      if (gadgetsRes.status === 'fulfilled') this.gadgetsCatalog = gadgetsRes.value || [];
      if (iconsRes.status === 'fulfilled') this.skillIcons = iconsRes.value || {};
      if (effectsRes.status === 'fulfilled') this.effectIcons = effectsRes.value || {};
      if (skillsRes.status === 'fulfilled') this.skillsCatalog = skillsRes.value || [];
      
      if (snapCardsRes.status === 'fulfilled') {
        this.snapCards = snapCardsRes.value || [];
        this.snapCards.forEach((c) => {
          if (c.DefId) this.snapMap.set(c.DefId.toLowerCase().replace(/[^a-z0-9]/g, ''), c);
          if (c.Title) this.snapMap.set(c.Title.toLowerCase().replace(/[^a-z0-9]/g, ''), c);
        });
      }

      // Use the newest known Notion source. Older browser caches must not hide a newer snapshot.
      const cachedTasks = localStorage.getItem('spidey_notion_tasks');
      const cachedHabits = localStorage.getItem('spidey_notion_habits');
      const snapshotTime = Date.parse(snapRes.status === 'fulfilled' ? snapRes.value?.metadata?.syncedAt : '') || 0;
      const cacheTime = Date.parse(localStorage.getItem('spidey_notion_cached_at') || '') || 0;
      const useCache = cacheTime > snapshotTime;
      if (snapRes.status === 'fulfilled' && snapRes.value?.collections) {
        this.notionTasks = snapRes.value.collections.masterCalendar || [];
        this.notionHabits = snapRes.value.collections.habits || [];
        this.notionGoals = snapRes.value.collections.goals || [];
        this.notionSyncedAt = snapRes.value.metadata?.syncedAt || null;
      }
      if (useCache || !this.notionSyncedAt) {
        try {
          if (cachedTasks) this.notionTasks = JSON.parse(cachedTasks);
          if (cachedHabits) this.notionHabits = JSON.parse(cachedHabits);
          const cachedGoals = localStorage.getItem('spidey_notion_goals');
          if (cachedGoals) this.notionGoals = JSON.parse(cachedGoals);
          const cachedActiveQuests = localStorage.getItem('spidey_notion_active_quests');
          if (cachedActiveQuests) this.notionActiveQuests = JSON.parse(cachedActiveQuests);
          if (useCache) {
            this.notionSource = localStorage.getItem('spidey_notion_cache_source') || 'snapshot';
            this.notionSyncedAt = localStorage.getItem('spidey_notion_source_at') || new Date(cacheTime).toISOString();
          }
        } catch (_) { /* Keep the snapshot. */ }
      }
      // Locally completed records remain completed until their Notion write succeeds.
      for (const write of readPendingNotionWrites()) {
        const list = write.kind === 'habits' ? this.notionHabits : write.kind === 'activeQuests' ? this.notionActiveQuests : this.notionTasks;
        const record = list.find((item) => item.id === write.id);
        if (record) { record.done = true; if (write.kind === 'habits') record.today = true; }
      }
      const today = this.todayKey();
      for (const habit of this.notionHabits) {
        if (habit.localDoneOn && habit.localDoneOn !== today) { habit.done = false; habit.today = false; delete habit.localDoneOn; }
      }
      for (const quest of [...this.notionTasks, ...this.notionActiveQuests]) {
        if (quest.localDoneOn && quest.localDoneOn !== today && /daily/i.test(`${quest.type || ''} ${quest.frequency || ''}`)) {
          quest.done = false;
          delete quest.localDoneOn;
        }
      }
    } catch (e) {
      console.warn('[ActionRpgController] Data load error, using fallbacks:', e);
    }
  }

  getSnapCard(name, defid = '') {
    if (defid) {
      const cleanDef = defid.toLowerCase().replace(/[^a-z0-9]/g, '');
      const byDef = this.snapMap.get(cleanDef);
      if (byDef) return byDef;
      return {
        DefId: defid,
        CardUrl: `https://static.marvelsnap.pro/cards/${defid}.webp`,
        ArtUrl: `https://static.marvelsnap.pro/art/${defid}.webp`,
        Title: name || defid
      };
    }
    if (!name) return null;
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [key, card] of this.snapMap.entries()) {
      if (clean.includes(key) || key.includes(clean)) return card;
    }
    return null;
  }

  catalogImage(item) {
    return item?.Image || item?.['Marvel Snap'] || item?.['Suit Preview'] || item?.coverUrl || item?.iconUrl || '';
  }

  badgeArtwork(badge) {
    const name = String(badge.Medal || '').split(' - ')[0].toLowerCase();
    const local = Object.values(this.badges).find((item) => item.title?.toLowerCase().startsWith(`${name} (`));
    const fallback = local?.file ? `./assets/sprites/badges/${local.file}` : '';
    const source = badge.sourceUrl ? this.catalogImage(badge) || fallback : fallback || this.catalogImage(badge);
    return source ? `<img class="notion-badge-icon" src="${this.escapeHtml(source)}" ${fallback && fallback !== source ? `data-badge-fallback="${this.escapeHtml(fallback)}"` : ''} alt="${this.escapeHtml(badge.Medal || 'Badge')}" loading="lazy">` : '';
  }

  normalizedCatalogName(value = '') {
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  notionEnemyFor(enemy, encounterIndex = 0) {
    if (!this.notionEnemies.length) return null;
    const target = this.normalizedCatalogName(enemy?.name);
    return this.notionEnemies.find((item) => this.normalizedCatalogName(item.Boss || item.Enemy || item.Name) === target) || null;
  }

  escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  effectSymbolId(token) {
    const map = {
      impact: 'icon-arena',
      web: 'icon-web-map',
      interrupt: 'icon-arena',
      launch: 'icon-send',
      airborne: 'icon-compass',
      stun: 'icon-bolt',
      knockback: 'icon-send',
      focus: 'icon-target',
      combo: 'icon-arena',
      finisher: 'icon-bolt',
      mobility: 'icon-compass',
      traversal: 'icon-web-map',
      sense: 'icon-spider',
      dodge: 'icon-compass',
      parry: 'icon-mask',
      counter: 'icon-arena',
      slow: 'icon-clock',
      stealth: 'icon-mask',
      trap: 'icon-target',
      immobilize: 'icon-mask',
      takedown: 'icon-target',
      marked: 'icon-search',
      camouflage: 'icon-mask',
      venom: 'icon-bolt',
      chain: 'icon-web-map',
      overload: 'icon-bolt',
      heal: 'icon-plus',
      barrier: 'icon-mask',
      spiderArms: 'icon-spider',
      symbiote: 'icon-spider',
      antiVenom: 'icon-plus',
      pull: 'icon-web-map',
      slam: 'icon-arena',
      area: 'icon-target',
      pierce: 'icon-arena',
      rage: 'icon-bolt',
      reload: 'icon-gear'
    };
    return map[token] || 'icon-target';
  }

  renderEffectIcons(tokens = []) {
    return tokens.map((token) => {
      const effect = this.effectIcons[token] || { label: token };
      const label = this.escapeHtml(effect.label || token);
      return `
        <span class="spidey-effect-icon spidey-effect-icon--${this.escapeHtml(token)}" title="${label}" aria-label="${label}">
          <svg><use href="#${this.effectSymbolId(token)}"></use></svg>
        </span>
      `;
    }).join('');
  }


  selectSection(section, playSound = true, openDestination = true) {
    if (openDestination) document.body.dataset.destinationOpen = 'true';
    if (playSound) this.sound.playClick();
    if (section === 'CITY') {
      this.closePanel();
      document.body.dataset.gameMode = 'MAP';
      this.setActiveNav('CITY');
      this.updateRoute('CITY');
      requestAnimationFrame(() => this.mapEngine.resize?.());
      return;
    }
    if (section === 'ARENA') {
      document.body.dataset.gameMode = 'ARENA';
      this.setActiveNav('ARENA');
      this.closePanel();
      this.updateRoute('ARENA');
      if (playSound) this.playIntroOnce();
      return;
    }
    document.body.dataset.gameMode = 'ARENA';
    this.setActiveNav(section);
    this.openPanel(section);
    this.updateRoute();
  }

  updateRoute(section = this.panelSection) {
    const url = new URL(location.href);
    if (section === 'FIELD' && FIELD_APPS[this.fieldAppId]) url.searchParams.set('spiderApp', this.fieldAppId);
    else url.searchParams.delete('spiderApp');
    if (section === 'ARENA') {
      if (document.body.dataset.destinationOpen) url.searchParams.set('game', 'ARENA');
      else url.searchParams.delete('game');
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('game', section);
      if (section === 'CITY') url.searchParams.delete('tab');
      else url.searchParams.set('tab', this.panelTab);
    }
    history.replaceState(history.state, '', url);
  }

  restoreRoute(url = new URL(location.href)) {
    const appId = url.searchParams.get('spiderApp');
    if (FIELD_APPS[appId]) { this.openEmbeddedFieldApp(appId); return; }
    const section = url.searchParams.get('game');
    const tab = url.searchParams.get('tab');
    if (!['ARENA', 'QUESTS', 'HERO', 'HABITS', 'FIELD', 'SETTINGS', 'CITY'].includes(section)) return;
    this.selectSection(section, false);
    if (section !== 'CITY' && tab) {
      this.panelTab = tab;
      this.renderPanel();
      this.updateRoute();
    }
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
    if (this.notionPresenter) { this.toast('DÙNG CHIÊU TRONG NOTION // WEB CHỈ HIỂN THỊ'); return; }
    const hero = this.engine.snapshot().hero;
    if (hero.hp <= 0) {
      this.toast('HERO HẾT HP // HOÀN THÀNH HABIT ĐỂ HỒI PHỤC');
      return;
    }
    this.playIntroOnce();
    const result = this.engine.performAction(action);
    if (result.blocked) {
      this.sound.playWarning();
      this.toast(result.reason);
      return;
    }
    this.queueHeroProfileSync();
  }

  handleUpdate(result) {
    if (this.notionPresenter) { this.notionPresenter.renderBattle(); return; }
    this.render(result.snapshot);
    if (result.phaseChanged) this.animateEnemy('phase', 650, result.targetIndex);
    else if (result.victory?.next) this.animateEnemy('enter', 550);
    else if (result.targetClear) this.animateEnemy('defeat', 800, result.targetIndex);
    else if (result.damage > 0) this.animateEnemy('hurt', 440, result.targetIndex);
    for (const hit of result.splashHits || []) this.animateEnemy(hit.defeated ? 'defeat' : 'hurt', hit.defeated ? 800 : 440, hit.index);
    if (result.heroDamage && result.attackerId) {
      const attackerIndex = result.snapshot.opponents.findIndex((foe) => foe.id === result.attackerId && foe.hp > 0);
      if (attackerIndex >= 0) window.setTimeout(() => this.animateEnemy('attack', 480, attackerIndex), 300);
    }
    if (result.perfectDodge) this.sound.playPerfectDodge();
    if (result.victory?.boss) this.sound.playVictoryCue();
    else if (result.victory?.next) this.sound.playCrimeAlert();
    if (result.dailyReward) this.toast(`DAILY CLEAR // +${result.dailyReward.xp} XP +${result.dailyReward.coins} COINS`);
    else if (result.questReward) this.toast(`QUEST CLEAR // +${result.questReward.xp} XP +${result.questReward.coins} COINS`);
    else if (result.victory) this.toast(result.victory.boss ? 'CHAPTER BOSS DEFEATED!' : `WAVE CLEAR // NEXT: ${result.victory.next}`);
    else if (result.targetClear) this.toast(`K.O. ${result.targetClear.enemy} // CÒN ${result.targetClear.remaining} ĐỊCH`);
  }

  currentArenaMap() {
    return this.notionArenaMaps.find((map) => map.id === this.selectedArenaMapId) || this.notionArenaMaps[0];
  }

  applyArenaMap() {
    const map = this.currentArenaMap();
    if (!map) return;
    const stage = document.getElementById('action-combat-stage');
    const key = String(map['Map Key'] || 'rooftop').toLowerCase();
    if (stage) stage.dataset.arenaMap = ['rooftop', 'subway', 'lab'].includes(key) ? key : 'rooftop';
    this.text('combat-district', map.District || map.Map || 'MANHATTAN ROOFTOP');
    this.text('combat-weather', map.Weather || 'NIGHT // LIGHT RAIN');
  }

  async selectArenaMap(mapId) {
    const map = this.notionArenaMaps.find((item) => item.id === mapId && item.Available !== false);
    const level = Number(this.notionHeroProfile?.Level) || this.engine.snapshot().hero.level || 1;
    if (!map || level < (Number(map['Unlock Level']) || 1)) return;
    if (this.notionHeroProfile && this.notionConnection === 'connected') {
      try {
        await this.patchNotionPage(this.notionHeroProfile.id, { 'Current Map': { relation: [{ id: map.id }] } });
        this.notionHeroProfile['Current Map'] = [map.id];
      } catch (error) { this.toast(`MAP CHƯA LƯU NOTION: ${error.message}`); return; }
    }
    this.selectedArenaMapId = map.id;
    localStorage.setItem('spidey_arena_map', map.id);
    this.render();
    this.sound.playSelect();
    this.toast(`MAP // ${String(map.Map).toUpperCase()}`);
  }

  render(snapshot = this.engine.snapshot()) {
    if (this.notionPresenter) { this.notionPresenter.renderBattle(); return; }
    const { hero, enemy, data } = snapshot;
    const notionEnemy = this.notionEnemyFor(enemy, snapshot.encounterIndex);
    const enemyDisplayName = enemy.name;
    const heroDisplayName = this.notionHeroProfile?.Hero || this.notionHeroProfile?.Name || this.notionHeroProfile?.Profile || 'PETER PARKER';
    this.applyArenaMap();
    const heroName = document.querySelector('.hud-avatar strong');
    if (heroName) heroName.textContent = String(heroDisplayName).toUpperCase();
    this.renderEnemyTeam(snapshot);
    this.text('hud-level', hero.level);
    this.text('hud-rank', hero.rank);
    this.text('hud-xp-text', `${hero.xp} / ${hero.xpToNext}`);
    this.text('hud-hp-text', `${hero.hp} / ${hero.maxHp || data.hero.maxHp}`);
    const maxEnergy = Number(this.notionHeroProfile?.['Max Energy']) || 10;
    this.text('hud-web-text', `${Math.round(hero.webEnergy / data.hero.maxWebEnergy * maxEnergy)} / ${maxEnergy}`);
    this.text('hud-coins', hero.coins);
    this.text('hud-streak', hero.streak);
    this.width('hud-xp-fill', hero.xp / hero.xpToNext * 100);
    this.width('hud-hp-fill', hero.hp / (hero.maxHp || data.hero.maxHp) * 100);
    this.width('hud-web-fill', hero.webEnergy / data.hero.maxWebEnergy * 100);
    const activeQuest = this.notionConnection === 'connected' && this.notionLiveKinds.has('activeQuests') ? this.notionActiveQuests.find((quest) => !quest.done) : null;
    this.text('hud-main-quest', activeQuest?.title || (this.notionConnection === 'connected' && this.notionLiveKinds.has('activeQuests') ? 'ALL NOTION QUESTS CLEAR' : 'THE SYMBIOTE SIGNAL'));
    this.text('hud-quest-progress', this.notionConnection === 'connected' && this.notionLiveKinds.has('activeQuests') && this.notionActiveQuests.length ? `${this.notionActiveQuests.filter((quest) => quest.done).length} / ${this.notionActiveQuests.length} QUESTS` : snapshot.storyComplete ? 'CHAPTER CLEAR' : `WAVE ${snapshot.encounterIndex + 1} / ${data.encounter.length}`);
    this.text('enemy-tier', notionEnemy?.['Tier Rank'] || notionEnemy?.['Enemy Class'] || enemy.tier);
    this.text('enemy-name', enemyDisplayName);
    this.text('enemy-hp-text', `${snapshot.enemyHp} / ${enemy.maxHp}`);
    this.text('enemy-stagger-text', `${Math.round(snapshot.enemyStagger)}%`);
    this.text('enemy-weakness', enemy.weakness);
    this.text('enemy-resistance', enemy.resistance);
    this.text('enemy-phase', snapshot.phase);
    this.text('combat-log-line', String(snapshot.combatLog[0] || '').replace('MANHATTAN ROOFTOP', this.currentArenaMap()?.District || 'MANHATTAN ROOFTOP'));
    this.text('arena-turn-value', String(snapshot.turn + 1).padStart(2, '0'));
    const combatExhausted = hero.hp <= 0;
    this.text('arena-turn-tip', combatExhausted ? 'Hoàn thành Habit để hồi HP' : hero.webEnergy < data.actions.web.energy ? 'COMBO hồi tơ · chọn quái để đánh' : 'Chọn quái rồi dùng chiêu phù hợp');
    const recoveryButton = document.getElementById('arena-open-habits');
    recoveryButton?.toggleAttribute('hidden', !combatExhausted);
    if (recoveryButton) recoveryButton.textContent = 'MỞ LIFE 66';
    this.width('enemy-hp-fill', snapshot.enemyHp / enemy.maxHp * 100);
    this.width('enemy-stagger-fill', snapshot.enemyStagger);
    this.width('ultimate-fill', hero.ultimate);
    this.text('ultimate-charge', snapshot.enemyStagger >= 100 && hero.ultimate >= 100 ? 'FINISHER READY' : `${hero.ultimate}%`);
    this.text('cooldown-web', snapshot.cooldowns.web ? `CD ${snapshot.cooldowns.web}` : `${Math.ceil(data.actions.web.energy / data.hero.maxWebEnergy * maxEnergy)} ENERGY · TRÓI`);
    this.text('cooldown-gadget', snapshot.cooldowns.gadget ? `CD ${snapshot.cooldowns.gadget}` : `${snapshot.charges.gadget} CHARGES`);
    this.text('cooldown-ally', snapshot.cooldowns.ally ? `CD ${snapshot.cooldowns.ally}` : 'CHOÁNG');

    const enemyFighter = document.querySelector('.action-fighter--enemy');
    enemyFighter?.classList.toggle('enemy--grunt', snapshot.encounterIndex < 3);
    enemyFighter?.classList.toggle('enemy--elite', snapshot.encounterIndex === 3);
    enemyFighter?.classList.toggle('enemy--boss', snapshot.encounterIndex >= 4 || enemy.tier === 'BOSS');
    document.querySelector('[data-combat-action="web"]')?.toggleAttribute('disabled', combatExhausted || snapshot.cooldowns.web > 0 || hero.webEnergy < data.actions.web.energy || snapshot.storyComplete);
    document.querySelector('[data-combat-action="gadget"]')?.toggleAttribute('disabled', combatExhausted || snapshot.cooldowns.gadget > 0 || snapshot.charges.gadget <= 0 || snapshot.storyComplete);
    document.querySelector('[data-combat-action="ally"]')?.toggleAttribute('disabled', combatExhausted || snapshot.cooldowns.ally > 0 || snapshot.storyComplete);
    document.querySelector('[data-combat-action="attack"]')?.toggleAttribute('disabled', combatExhausted || snapshot.storyComplete);
    const ultimate = document.querySelector('[data-combat-action="ultimate"]');
    ultimate?.toggleAttribute('disabled', combatExhausted || hero.ultimate < 100 || snapshot.storyComplete);
    ultimate?.classList.toggle('ready', hero.ultimate >= 100 && !combatExhausted && !snapshot.storyComplete);
    ultimate?.classList.toggle('finisher-ready', snapshot.enemyStagger >= 100 && hero.ultimate >= 100 && !combatExhausted && !snapshot.storyComplete);
    ultimate?.querySelector('strong') && (ultimate.querySelector('strong').textContent = snapshot.enemyStagger >= 100 && hero.ultimate >= 100 ? 'FINISHER' : 'ULTIMATE');
    document.getElementById('btn-next-patrol')?.toggleAttribute('hidden', !snapshot.storyComplete);
    document.body.classList.toggle('game-reduce-motion', snapshot.settings.reduceMotion);
    document.body.classList.toggle('game-no-shake', !snapshot.settings.screenShake);
    document.body.classList.toggle('game-no-comic', !snapshot.settings.comicText);
    this.syncAutoCombat(snapshot.settings);
    if (!document.getElementById('game-panel-backdrop')?.hasAttribute('hidden')) this.renderPanel();
  }

  renderEnemyTeam(snapshot) {
    const team = document.getElementById('combat-enemy-team');
    if (!team) return;
    const sprites = {
      'street-thug': ['symbiote-goon-idle.png', 96, 91, 8],
      'tech-gunner': ['aim-rifle-idle.png', 82, 82, 6],
      'shield-enemy': ['aim-shock-idle.png', 75, 82, 8],
      'hunter-captain': ['beetle-idle.png', 96, 106, 8],
      'green-goblin': ['venom-idle.png', 87, 73, 8]
    };
    team.dataset.count = String(snapshot.opponents.length);
    team.innerHTML = snapshot.opponents.map((foe, index) => {
      const [file, width, height, frames] = sprites[foe.id] || sprites['street-thug'];
      const selected = index === snapshot.selectedEnemyIndex;
      const down = foe.hp <= 0;
      return `<button class="arena-foe ${selected ? 'arena-foe--selected' : ''} ${down ? 'arena-foe--down' : ''}" data-enemy-slot="${index}" type="button" aria-label="${this.escapeHtml(foe.name)}, ${foe.hp} trên ${foe.maxHp} HP${selected ? ', mục tiêu đang chọn' : ''}" ${down ? 'disabled' : ''}>
        <span class="arena-foe__sprite" aria-hidden="true" style="--foe-sprite:url('/assets/cosmic-enemies/${file}');--cell-w:${width}px;--cell-h:${height}px;--frame-end:-${(frames - 1) * width}px;--frame-steps:${frames - 1}"></span>
        <span class="arena-foe__name">${selected ? '⌖ ' : ''}${this.escapeHtml(foe.name)}</span>
        <span class="arena-foe__health"><i style="width:${Math.max(0, foe.hp / foe.maxHp * 100)}%"></i></span>
        <span class="arena-foe__value">${down ? 'K.O.' : `${foe.hp}/${foe.maxHp}`}</span>
      </button>`;
    }).join('');
    team.querySelectorAll('[data-enemy-slot]').forEach((button) => button.addEventListener('click', () => {
      if (this.engine.selectEnemy(Number(button.dataset.enemySlot))) this.sound.playSelect();
    }));
  }

  animateEnemy(state, duration, index = this.engine.snapshot().selectedEnemyIndex) {
    const sprite = document.querySelector(`[data-enemy-slot="${index}"]`);
    if (!sprite) return;
    window.clearTimeout(this.enemyMotionTimer);
    sprite.dataset.motion = state;
    this.enemyMotionTimer = window.setTimeout(() => { if (sprite.isConnected) sprite.dataset.motion = 'idle'; }, duration);
  }

  openPanel(section) {
    this.panelSection = section;
    document.body.dataset.destinationOpen = 'true';
    this.panelTab = this.defaultTab(section);
    document.body.dataset.gameSection = section;
    const panel = document.getElementById('game-panel-backdrop');
    panel?.removeAttribute('hidden'); 
    panel?.removeAttribute('inert');
    this.renderPanel({ resetScroll: true });
  }

  closePanel() {
    const panel = document.getElementById('game-panel-backdrop');
    panel?.setAttribute('hidden', ''); 
    panel?.setAttribute('inert', '');
    this.fieldAppId = null;
    delete document.body.dataset.fieldImmersive;
    delete document.body.dataset.fieldStandalone;
    delete document.body.dataset.gameSection;
    if (document.body.dataset.gameMode !== 'MAP') this.setActiveNav('ARENA');
    this.updateRoute(document.body.dataset.gameMode === 'MAP' ? 'CITY' : 'ARENA');
  }

  defaultTab(section) {
    const map = {
      QUESTS: 'TODAY',
      HERO: 'PROFILE',
      HABITS: 'TODAY',
      FIELD: 'SYSTEMS',
      ARCHIVE: 'BESTIARY',
      CHRONICLE: 'RHYTHM',
      SETTINGS: 'GAME'
    };
    return map[section] || 'TODO';
  }

  renderPanel({ resetScroll = false } = {}) {
    const title = document.getElementById('game-panel-title');
    const kicker = document.getElementById('game-panel-kicker');
    const tabs = document.getElementById('game-panel-tabs');
    const content = document.getElementById('game-panel-content');
    if (!title || !tabs || !content) return;

    const titles = { 
      QUESTS: 'FRIENDLY NEIGHBORHOOD // QUESTS',
      HERO: 'SPIDER SUIT // HERO BUILD',
      HABITS: 'SPIDER LIFE // HABITS',
      FIELD: 'SPIDER OS // FIELD SYSTEMS',
      ARCHIVE: 'SPIDEY ARCHIVE & BESTIARY', 
      CHRONICLE: 'PETER PARKER CHRONICLE', 
      SETTINGS: 'GAME SETTINGS & SAVE' 
    };

    if (kicker) kicker.textContent = 'SPIDEY LIFE // RPG HUB';
    title.textContent = titles[this.panelSection] || 'SPIDEY LIFE';

    const tabMap = {
      QUESTS: this.notionPresenter ? ['TODAY', 'MISSIONS', 'OVERDUE', 'GOALS'] : ['TODAY', 'OVERDUE', 'MAIN', 'SIDE', 'DAILY', 'GOALS'],
      HERO: this.notionPresenter ? ['PROFILE', 'SUITS', 'SKILLS', 'MAPS', 'BADGES'] : ['PROFILE', 'SUITS', 'ROSTER', 'SKILLS', 'GADGETS', 'MAPS', 'BADGES'],
      HABITS: ['TODAY', 'PROGRESS', '66 DAYS'],
      FIELD: ['SYSTEMS', 'TIME', 'GYM', 'PLACES', 'JOURNAL', 'ENEMIES'],
      ARCHIVE: ['BESTIARY', 'BACKPACKS', 'BADGES'],
      CHRONICLE: ['RHYTHM', 'JOURNAL', 'GYM'],
      SETTINGS: this.notionPresenter ? ['GAME'] : ['GAME', 'SAVE']
    };

    const tabNames = tabMap[this.panelSection] || ['TODO'];
    if (!tabNames.includes(this.panelTab)) this.panelTab = tabNames[0];

    tabs.innerHTML = tabNames.map((tab) => `<button type="button" role="tab" id="game-tab-${tab.replaceAll(' ', '-')}" aria-controls="game-panel-content" tabindex="${tab === this.panelTab ? '0' : '-1'}" aria-selected="${tab === this.panelTab}" class="${tab === this.panelTab ? 'active' : ''}" data-game-panel-tab="${tab}">${tab === 'OVERDUE' ? 'QUÁ HẠN' : tab}</button>`).join('');
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('aria-labelledby', `game-tab-${this.panelTab.replaceAll(' ', '-')}`);
    tabs.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { 
      this.sound.playSelect(); 
      this.fieldAppId = null;
      this.panelTab = button.dataset.gamePanelTab; 
      this.renderPanel({ resetScroll: true });
      this.updateRoute();
      if (!document.body.dataset.fieldImmersive) {
        const active = tabs.querySelector('[aria-selected="true"]');
        active?.focus({ preventScroll: true });
        active?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }));
    tabs.onkeydown = event => {
      const controls = [...tabs.querySelectorAll('[role="tab"]')];
      const index = controls.indexOf(document.activeElement);
      if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + controls.length) % controls.length;
      controls[next].click();
    };

    const tabApps = { TIME:'timetable', GYM:'gym', JOURNAL:'journal' };
    const requestedApp = this.panelSection === 'QUESTS' ? 'todo' : this.panelSection === 'HABITS' ? 'habits' : this.panelSection === 'FIELD' ? (this.panelTab === 'SYSTEMS' ? this.fieldAppId || 'launcher' : tabApps[this.panelTab]) : null;
    if (FIELD_APPS[requestedApp]) document.body.dataset.fieldImmersive = 'true';
    else delete document.body.dataset.fieldImmersive;
    if (FIELD_APPS[requestedApp] && requestedApp !== 'launcher') document.body.dataset.fieldStandalone='true';
    else delete document.body.dataset.fieldStandalone;
    const keepCurrentApp = requestedApp && content.querySelector('[data-field-app]')?.dataset.fieldApp === requestedApp;
    if (!keepCurrentApp) {
      content.innerHTML = this.renderSection();
      this.bindEvents(content);
    }
    if (resetScroll) content.scrollTop = 0;
  }

  renderSection() {
    if (this.panelSection === 'QUESTS') return renderFieldApp('todo');
    if (this.panelSection === 'HABITS') return renderFieldApp('habits');
    switch (this.panelSection) {
      case 'QUESTS': return this.renderQuestsSection();
      case 'HERO': return this.renderHeroSection();
      case 'HABITS': return this.renderHabitSection();
      case 'FIELD': return this.renderFieldSection();
      case 'ARCHIVE': return this.renderArchiveSection();
      case 'CHRONICLE': return this.renderChronicleSection();
      case 'SETTINGS': return this.renderSettings();
      default: return this.renderQuestsSection();
    }
  }

  renderHabitSection() {
    const hasGameEnabledSelection = this.notionHabits.some((habit) => habit.gameEnabled);
    const habits = this.notionHabits
      .map((habit, sourceIndex) => ({ ...habit, sourceIndex }))
      .filter((habit) => !hasGameEnabledSelection || habit.gameEnabled);
    const total = habits.length;
    const completed = habits.filter((habit) => habit.today || habit.done).length;
    let resetState = { day: 1, totalDays: 66 };
    try { resetState = { ...resetState, ...JSON.parse(localStorage.getItem('life_reset_screenshot_v5') || '{}') }; } catch { /* use day one */ }
    const day = Math.max(1, Math.min(66, Number(resetState.day) || 1));
    const pct = total ? Math.round(completed / total * 100) : 0;
    const syncBar = `<div class="life-reset-sync"><span><i></i>${this.notionConnection !== 'connected' ? 'BẢN LƯU CỤC BỘ' : this.notionSource === 'live' ? 'NOTION LIVE' : 'NOTION SNAPSHOT'}</span><b>${total} HABITS</b>${this.notionAccessHtml()}</div>${this.notionStatusHtml()}`;

    if (this.panelTab === 'PROGRESS') {
      return `${syncBar}<section class="habit-progress-head"><div><small>HELLO HABIT // TODAY</small><strong>${completed}<em>/ ${total}</em></strong><span>HOÀN THÀNH</span></div><div class="habit-progress-ring" style="--habit-progress:${pct * 3.6}deg"><b>${pct}%</b></div></section>
        <div class="habit-square-grid">${habits.map((habit) => {
          const done = habit.today || habit.done;
          return `<button type="button" class="habit-square ${done ? 'is-done' : ''}" data-checkin-habit="${habit.sourceIndex}" ${done || !this.canUseData('habits') ? 'disabled' : ''}><span class="habit-square-check">${done ? '✓' : ''}</span><small>${this.escapeHtml(habit.category || 'HABIT')}</small><strong>${this.escapeHtml(habit.name || habit.title)}</strong><em>${this.escapeHtml(habit.timeBlock || 'Cả ngày')}</em></button>`;
        }).join('') || '<p class="pixel-card-desc">Chưa có Habit trong Notion.</p>'}</div>`;
    }

    if (this.panelTab === '66 DAYS') {
      return `${syncBar}<section class="life-66-campaign"><div><small>LIFE RESET // SPIDER PROTOCOL</small><h3>DAY ${day}<span>/66</span></h3><p>Mỗi ngày hoàn thành Habit để hồi HP, Energy và xây chuỗi kỷ luật.</p></div><div class="life-66-score"><strong>${pct}%</strong><small>TODAY</small></div></section>
        <div class="life-66-grid" aria-label="Lộ trình 66 ngày">${Array.from({ length: 66 }, (_, index) => { const value = index + 1; return `<span class="${value === day ? 'is-today' : value < day ? 'is-past' : ''}">${value}</span>`; }).join('')}</div>`;
    }

    return `${syncBar}
      <section class="life-reset-hero"><div><small>SPIDER LIFE // 66 DAY HABIT</small><h3>DAY ${day}<span>/66</span></h3><p>${completed === total && total ? 'Daily patrol complete. Thành phố an toàn thêm một ngày.' : `${Math.max(0, total - completed)} thói quen còn lại trong patrol hôm nay.`}</p></div><div class="life-reset-meter"><span style="width:${pct}%"></span><b>${completed}/${total}</b></div></section>
      <div class="habit-filter-row"><button class="active" data-habit-filter="all">ALL ${total}</button><button data-habit-filter="todo">TO-DO ${total - completed}</button><button data-habit-filter="done">DONE ${completed}</button></div>
      <div class="life-reset-card-list">${habits.map((habit) => {
        const done = habit.today || habit.done;
        const bad = /bad/i.test(habit.category || '');
        return `<article class="life-reset-card ${done ? 'is-done' : ''} ${bad ? 'is-bad' : ''}" data-habit-state="${done ? 'done' : 'todo'}"><div class="life-reset-card-copy"><div><span>${this.escapeHtml(habit.category || 'HABIT')}</span>${habit.streak ? `<em>🔥 ${habit.streak}D</em>` : ''}</div><h3>${this.escapeHtml(habit.name || habit.title)}</h3><p>${this.escapeHtml(this.habitDescription(habit))}</p><small>${this.escapeHtml(habit.timeBlock || 'Cả ngày')} · +${Number(habit.xp) || 1} XP</small></div><button type="button" data-checkin-habit="${habit.sourceIndex}" ${done || !this.canUseData('habits') ? 'disabled' : ''} aria-label="${done ? 'Đã hoàn thành' : `Hoàn thành ${this.escapeHtml(habit.name || habit.title)}`}">${done ? '✓' : '+'}</button></article>`;
      }).join('') || '<p class="pixel-card-desc">Chưa có Habit. Hãy tạo thói quen đầu tiên.</p>'}</div>
      <form class="quest-create-form" id="habit-create-form"><label for="habit-new-title">THÓI QUEN MỚI</label><input id="habit-new-title" name="title" required maxlength="150" placeholder="Thói quen bạn muốn xây…" autocomplete="off"><select name="type" aria-label="Loại thói quen"><option value="Good Habit">Good Habit</option><option value="Bad Habit">Bad Habit</option></select><button class="pixel-action-btn pixel-action-btn--green" type="submit" ${!this.canUseData('habits') ? 'disabled' : ''}>+ TẠO HABIT</button></form>`;
  }

  openEmbeddedFieldApp(id) {
    if (!FIELD_APPS[id]) return;
    document.body.dataset.gameMode = 'ARENA';
    this.openPanel('FIELD');
    this.setActiveNav('FIELD');
    this.fieldAppId = id;
    this.panelTab = 'SYSTEMS';
    this.renderPanel({ resetScroll:true });
    this.updateRoute();
  }

  returnToHome() {
    this.fieldAppId = null;
    delete document.body.dataset.destinationOpen;
    document.body.dataset.gameMode = 'ARENA';
    this.closePanel();
  }

  closeEmbeddedFieldApp() {
    if (this.panelSection !== 'FIELD' || !this.fieldAppId) return this.returnToHome();
    this.fieldAppId = null;
    this.panelTab = 'SYSTEMS';
    this.renderPanel({ resetScroll:true });
    this.updateRoute();
    document.querySelector('[data-field-app-back]')?.focus();
  }

  renderFieldSection() {
    const tabApps = { TIME:'timetable', GYM:'gym', JOURNAL:'journal' };
    const appId = this.panelTab === 'SYSTEMS' ? this.fieldAppId : tabApps[this.panelTab];
    if (FIELD_APPS[appId]) return renderFieldApp(appId);
    if (this.panelTab === 'SYSTEMS') return renderFieldApp('launcher');
    if (this.panelTab === 'PLACES') return `<section class="place-command-card"><div><small>SPIDER FIELD // PLACES</small><strong>SỔ ĐỊA ĐIỂM & ĐIỀU HƯỚNG</strong><p>Lưu địa chỉ theo danh mục, tìm kiếm trên bản đồ và mở chỉ đường bằng Google Maps hoặc Apple Maps. Nút chia sẻ trong hồ sơ địa điểm có thể gửi link sang điện thoại.</p></div><button class="pixel-action-btn pixel-action-btn--blue" data-open-map-system>MỞ PLACE MAP</button></section>`;
    if (this.panelTab === 'ENEMIES' || this.panelTab === 'BESTIARY' || this.panelTab === 'BACKPACKS') {
      const originalTab = this.panelTab;
      if (this.panelTab === 'ENEMIES') this.panelTab = 'BESTIARY';
      const html = this.renderArchiveSection();
      this.panelTab = originalTab;
      return html;
    }
    if (this.panelTab === 'GYM') {
      const workouts = this.notionHabits.map((habit, index) => ({ habit, index })).filter(({ habit }) => /gym|workout|exercise|push|plank|run|chạy|tập|hít đất|thể dục|cardio/i.test(`${habit.title} ${habit.category} ${habit.description}`));
      return `<div class="quest-source-banner"><span>PARKER TRAINING</span><strong>GYM // NHIỆM VỤ TẬP LUYỆN TỪ NOTION</strong><small>Hoàn thành buổi tập sẽ check-in đúng Habit trong Notion và hồi phục Hero.</small></div>
        <div class="pixel-card-grid">${workouts.length ? workouts.map(({ habit, index }) => `<article class="pixel-game-card ${habit.today ? 'pixel-game-card--done' : ''}"><div class="pixel-card-header"><span class="pixel-tag">${habit.today ? 'DONE' : 'READY'}</span></div><h3 class="pixel-card-title">${this.escapeHtml(habit.title)}</h3><p class="pixel-card-desc">${this.escapeHtml(this.habitDescription(habit))}</p><button class="pixel-action-btn" data-checkin-habit="${index}" ${habit.today || !this.canUseData('habits') ? 'disabled' : ''}>${habit.today ? 'ĐÃ XONG' : 'CHECK-IN'}</button></article>`).join('') : '<p class="pixel-card-desc">Chưa thấy Habit tập luyện trong Notion.</p>'}</div>
        <div class="quest-source-banner"><span>WORKOUT PLANS</span><strong>GIÁO ÁN TỪ NOTION</strong><small>${this.notionWorkoutPlans.length} giáo án · ${this.notionExerciseLogs.length + this.notionCardioLogs.length + this.notionSportLogs.length} buổi đã ghi trong các bảng tập luyện.</small></div>
        <div class="pixel-card-grid">${this.notionWorkoutPlans.map((plan) => `<article class="pixel-game-card"><h3 class="pixel-card-title">${this.escapeHtml(plan.Name || 'Workout plan')}</h3>${plan.sourceUrl ? `<a class="pixel-action-btn pixel-action-btn--blue" href="${this.escapeHtml(plan.sourceUrl)}" target="_blank" rel="noopener noreferrer">XEM GIÁO ÁN</a>` : ''}</article>`).join('') || '<p class="pixel-card-desc">Đang tải giáo án từ Notion.</p>'}</div>`;
    }
    if (this.panelTab === 'TIME') {
      const originalTab = this.panelTab;
      this.panelTab = 'RHYTHM';
      const html = this.renderChronicleSection();
      this.panelTab = originalTab;
      const elapsed = this.focusElapsedMs();
      const remaining = Math.max(0, 25 * 60 * 1000 - elapsed);
      const clock = `${String(Math.floor(remaining / 60000)).padStart(2, '0')}:${String(Math.floor(remaining % 60000 / 1000)).padStart(2, '0')}`;
      return `<div class="quest-source-banner"><span>PARKER TIME</span><strong>FOCUS SESSION // 25 MIN</strong><small>Khi kết nối, Start/End được ghi vào bảng Time-Tracking của Notion.</small></div><a class="pixel-action-btn pixel-action-btn--blue" href="./life-os/index.html#timetable">MỞ LỊCH 24H · CỘT GIỜ + ĐỒNG HỒ TRÒN →</a><section class="field-focus-card"><span>ĐANG TẬP TRUNG VÀO</span><strong>${this.escapeHtml(this.notionConnection === 'connected' && this.notionLiveKinds.has('activeQuests') ? this.notionActiveQuests.find((quest) => !quest.done)?.title || 'Nhiệm vụ hôm nay' : 'Nhiệm vụ hôm nay')}</strong><output id="field-focus-clock">${clock}</output><div class="field-focus-actions"><button class="pixel-action-btn" data-focus-toggle>${this.focusSession.running ? 'TẠM DỪNG' : elapsed ? 'TIẾP TỤC' : 'BẮT ĐẦU'}</button><button class="pixel-action-btn pixel-action-btn--blue" data-focus-save ${elapsed < 1000 || this.notionConnection !== 'connected' ? 'disabled' : ''}>LƯU VÀO NOTION</button><button class="pixel-action-btn pixel-action-btn--gold" data-focus-reset ${elapsed < 1000 ? 'disabled' : ''}>ĐẶT LẠI</button></div><small>${this.notionTimeLogs.length} phiên đang có trong Notion</small></section>${html}`;
    }
    return this.renderChronicleSection();
  }

  renderSpiderSystems() {
    const apps = [
      { id: '01', icon: 'icon-compass', name: 'PLACE MAP', meta: 'ADDRESS BOOK · ROUTES', source: 'LOCAL + NOTION', tone: 'blue', map: true, desc: 'Quản lý địa chỉ theo danh mục, mở chỉ đường và gửi link sang điện thoại.' },
      { id: '02', icon: 'icon-clock', name: 'NHỊP SINH HỌC', meta: 'ROUTINE · GIỜ VÀNG', source: 'GAMBIT CLOUD', tone: 'green', href: './field-tools/apps/routine/index.html', desc: 'Sắp xếp các chuỗi hoạt động cho từng thời điểm trong ngày.' },
      { id: '03', icon: 'icon-clock', name: 'TIME TABLE', meta: '24H CITY CLOCK', source: 'NOTION', tone: 'gold', href: './field-tools/apps/timetable/index.html', desc: 'Xem lịch, khung giờ và nhiệm vụ trong ngày.' },
      { id: '04', icon: 'icon-arena', name: 'GYM OS', meta: 'WORKOUT · HEVY OS', source: 'NOTION', tone: 'red', href: './field-tools/apps/gym/index.html', desc: 'Quản lý bài tập, giáo án và lịch sử luyện tập.' },
      { id: '05', icon: 'icon-bolt', name: 'DOPAMINE MENU', meta: 'SPIDER-SENSE PICK', source: 'GAMBIT CLOUD', tone: 'red', href: './field-tools/apps/dopamine/index.html', desc: 'Chọn hoạt động giúp nạp lại năng lượng và đổi tâm trạng.' },
      { id: '06', icon: 'icon-database', name: 'PARKER FINANCE', meta: 'VELA CASH FLOW', source: 'GAMBIT APP', tone: 'green', href: './field-tools/apps/finance/index.html', desc: 'Theo dõi thu chi, ngân sách và kế hoạch tài chính.' },
      { id: '07', icon: 'icon-missions', name: 'TODAY MISSIONS', meta: 'QUICK TASKS', source: 'NOTION', tone: 'red', href: './field-tools/apps/todo/index.html', desc: 'Sắp xếp và theo dõi những việc cần hoàn thành.' },
      { id: '08', icon: 'icon-spider', name: 'LIFE RESET 66', meta: 'HABIT CAMPAIGN', source: 'NOTION', tone: 'green', section: 'HABITS', tab: 'TODAY', desc: 'Check-in thói quen để hồi HP, Energy và giữ streak.' },
      { id: '09', icon: 'icon-book', name: 'ENGLISH 32', meta: 'GRAMMAR · FLASHCARDS', source: 'GAMBIT APP', tone: 'blue', href: './field-tools/apps/english/index.html', desc: 'Học ngữ pháp, ôn flashcard và tra cứu từ vựng.' },
      { id: '10', icon: 'icon-book', name: 'PARKER JOURNAL', meta: 'FIELD NOTES', source: 'NOTION', tone: 'blue', href: './field-tools/apps/journal/index.html', desc: 'Ghi chép suy nghĩ, trải nghiệm và bài học mỗi ngày.' },
      { id: '11', icon: 'icon-dice', name: 'ORACLE', meta: 'REFLECTION CARDS', source: 'GAMBIT APP', tone: 'violet', href: './field-tools/apps/oracle/index.html', desc: 'Rút bài và dành thời gian tự chiêm nghiệm.' },
      { id: '12', icon: 'icon-mask', name: 'STYLE 30', meta: 'PARKER WARDROBE', source: 'GAMBIT APP', tone: 'gold', href: './field-tools/apps/style30/index.html', desc: 'Khám phá phối đồ và xây dựng phong cách cá nhân.' }
      ,{ id: '13', icon: 'icon-missions', name: 'HABIT TRACKER', meta: 'DAILY HABITS', source: 'GAMBIT APP', tone: 'green', href: './field-tools/apps/habits/index.html', desc: 'Theo dõi thói quen, tiến độ và chuỗi ngày liên tiếp.' }
      ,{ id: '14', icon: 'icon-clock', name: 'AMBIENT FOCUS', meta: 'SOUNDSCAPES · POMODORO', source: 'GAMBIT APP', tone: 'blue', href: './field-tools/apps/someday/index.html', desc: 'Âm thanh thư giãn và Pomodoro cho buổi tập trung.' }
    ];
    return `
      <section class="spider-system-command">
        <div><span>SPIDER LIFE OS // DAILY TOOLS</span><strong>CÔNG CỤ CHO MỖI NGÀY</strong><small>Chọn công cụ để sắp xếp lịch, chăm sóc bản thân và theo dõi cuộc sống. Các công cụ mở ngay trong Spider.</small></div>
        <div class="spider-system-count"><b>${apps.length}</b><span>APPS</span></div>
      </section>
      <div class="spider-app-grid" aria-label="Danh sách ứng dụng Gambit">
        ${apps.map((app) => {
          const attrs = app.map
            ? 'button type="button" data-open-map-system'
            : app.section
            ? `button type="button" data-open-system-section="${app.section}" data-open-system-tab="${app.tab}"`
            : `a href="${app.href}"${app.external ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
          const closeTag = app.map || app.section ? 'button' : 'a';
          return `<${attrs} class="spider-app-card spider-app-card--${app.tone}">
            <span class="spider-app-index">${app.id}</span>
            <span class="spider-app-icon" aria-hidden="true"><svg><use href="#${app.icon}"></use></svg></span>
            <span class="spider-app-copy"><small>${app.meta}</small><strong>${app.name}</strong><em>${app.desc}</em></span>
            <span class="spider-app-source">${app.external ? 'Mở tab mới ↗' : 'Mở công cụ →'}</span>
            <span class="spider-app-arrow" aria-hidden="true">↗</span>
          </${closeTag}>`;
        }).join('')}
      </div>`;
  }

  focusElapsedMs() {
    return this.focusSession.elapsedMs + (this.focusSession.running && this.focusSession.startedAt ? Date.now() - this.focusSession.startedAt : 0);
  }

  updateFocusClock() {
    const output = document.getElementById('field-focus-clock');
    if (!output) return;
    const remaining = Math.max(0, 25 * 60 * 1000 - this.focusElapsedMs());
    output.textContent = `${String(Math.floor(remaining / 60000)).padStart(2, '0')}:${String(Math.floor(remaining % 60000 / 1000)).padStart(2, '0')}`;
    if (!remaining && this.focusSession.running) { this.focusSession.running = false; this.focusSession.elapsedMs = 25 * 60 * 1000; this.focusSession.startedAt = null; this.persistFocusSession(); this.sound.playVictoryCue(); this.renderPanel(); }
  }

  persistFocusSession() { localStorage.setItem('spidey_focus_session', JSON.stringify(this.focusSession)); }

  /* -------------------------------------------------------------
     1. TAB [QUESTS]: TODO (NOTION), HABITS (STREAK), PATROL TIMETABLE
  ------------------------------------------------------------- */
  renderQuestsSection() {
    if (this.notionPresenter && this.panelTab === 'MISSIONS') return this.notionPresenter.renderMissions();
    const sourceLabel = this.notionConnection !== 'connected' ? 'Bản lưu cục bộ' : this.notionSource === 'live' ? 'Notion live' : this.notionSource === 'mixed' ? 'Notion live một phần' : 'Bản chụp Notion';
    const syncBannerHtml = `
      <div class="sync-online-banner">
        <div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
            <span class="pixel-tag pixel-tag--blue">NOTION</span>
            <strong style="color: #f2c06b; font-size: 10px;">${sourceLabel}</strong>
          </div>
          <small>${this.notionTasks.length} nhiệm vụ · ${this.notionHabits.length} thói quen · ${this.notionGoals.length} mục tiêu</small>
        </div>
        ${this.notionAccessHtml()}
      </div>${this.notionStatusHtml()}
    `;

    if (this.panelTab === 'ACTIVE') {
      return `${syncBannerHtml}<div class="quest-source-banner"><span>ACTIVE QUESTS</span><strong>QUESTLINE // NOTION</strong><small>${this.notionActiveQuests.length} nhiệm vụ từ bảng Active Quests.</small></div><div class="pixel-card-grid">${this.notionActiveQuests.map((quest, index) => `<article class="pixel-game-card ${quest.done ? 'pixel-game-card--done' : ''}"><div class="pixel-card-header"><span class="pixel-tag">${this.escapeHtml(quest.frequency || 'QUEST')}</span><span class="pixel-tag pixel-tag--gold">${Number(quest.xp) || 0} EXP</span></div><h3 class="pixel-card-title">${this.escapeHtml(quest.title)}</h3><p class="pixel-card-desc">${this.escapeHtml(quest.description || '')}</p><button class="pixel-action-btn" data-complete-active-quest="${index}" ${quest.done || !this.canUseData('activeQuests') ? 'disabled' : ''}>${quest.done ? 'ĐÃ HOÀN THÀNH' : 'HOÀN THÀNH'}</button></article>`).join('') || '<p class="pixel-card-desc">Chưa có Active Quests trong dữ liệu hiện tại.</p>'}</div>`;
    }

    if (this.panelTab === 'HABITS') {
      return `
        ${syncBannerHtml}
        <div class="quest-source-banner">
          <span>🔥 HABITS</span>
          <strong>KỶ LUẬT HÀNG NGÀY & STREAK</strong>
          <small>Check-in thói quen để hồi phục Máu (HP) & Tơ (Web Energy)</small>
        </div>
        <div class="pixel-card-grid">
          ${this.notionHabits.map((habit, idx) => `
            <article class="pixel-game-card ${habit.done || habit.today ? 'pixel-game-card--done' : 'pixel-game-card--gold'}">
              <div class="pixel-card-header">
                <span class="pixel-tag ${habit.category === 'Good' || habit.category?.includes('Good') ? 'pixel-tag--green' : 'pixel-tag--red'}">${this.escapeHtml(habit.category || 'HABIT')}</span>
                ${habit.streak ? `<span class="pixel-tag pixel-tag--gold">STREAK: ${habit.streak}D</span>` : ''}
              </div>
              <h3 class="pixel-card-title">${this.escapeHtml(habit.name || habit.title)}</h3>
              <p class="pixel-card-desc">${this.escapeHtml(this.habitDescription(habit))}</p>
              <div class="pixel-card-footer">
                <small style="color: #f2c06b; font: 700 8px monospace;">${this.escapeHtml(habit.timeBlock || 'Mỗi ngày')}</small>
                <button class="pixel-action-btn ${habit.done || habit.today ? 'pixel-action-btn--disabled' : 'pixel-action-btn--green'}" 
                        data-checkin-habit="${idx}" ${habit.done || habit.today || !this.canUseData('habits') ? 'disabled' : ''}>
                  ${habit.done || habit.today ? '✓ ĐÃ XONG' : '⚡ CHECK-IN'}
                </button>
              </div>
            </article>
          `).join('')}
        </div>
        <form class="quest-create-form" id="habit-create-form"><label for="habit-new-title">THÓI QUEN MỚI</label><input id="habit-new-title" name="title" required maxlength="150" placeholder="Thói quen bạn muốn xây…" autocomplete="off"><select name="type" aria-label="Loại thói quen"><option value="Good Habit">Good Habit</option><option value="Bad Habit">Bad Habit</option></select><button class="pixel-action-btn pixel-action-btn--green" type="submit" ${!this.canUseData('habits') ? 'disabled' : ''}>+ TẠO HABIT</button></form>
      `;
    }

    if (this.panelTab === 'GOALS') {
      return `${syncBannerHtml}
        <div class="quest-source-banner"><span>GOALS</span><strong>MỤC TIÊU CỦA BẠN</strong><small>${this.notionGoals.length} mục tiêu</small></div>
        <div class="pixel-card-grid">${this.notionGoals.length ? this.notionGoals.map((goal, index) => `
          <article class="pixel-game-card ${goal.achieved ? 'pixel-game-card--done' : ''}">
            <div class="pixel-card-header"><span class="pixel-tag">${this.escapeHtml(goal.status || 'Mục tiêu')}</span></div>
            <h3 class="pixel-card-title">${this.escapeHtml(goal.title || goal.name)}</h3>
            <p class="pixel-card-desc">${this.escapeHtml(goal.description || (goal.date ? `Mốc: ${new Date(goal.date).toLocaleDateString('vi-VN')}` : 'Theo dõi tiến độ của bạn'))}</p>
            <button class="pixel-action-btn" data-complete-goal="${index}" ${goal.achieved || !this.canUseData('goals') ? 'disabled' : ''}>${goal.achieved ? 'ĐÃ ĐẠT' : 'ĐÁNH DẤU ĐÃ ĐẠT'}</button>
            ${goal.sourceUrl ? `<a class="pixel-action-btn pixel-action-btn--blue" href="${this.escapeHtml(goal.sourceUrl)}" target="_blank" rel="noopener noreferrer">MỞ TRONG NOTION</a>` : ''}
          </article>`).join('') : '<p class="pixel-card-desc">Chưa có mục tiêu trong bản dữ liệu hiện tại.</p>'}</div>
          <form class="quest-create-form" id="goal-create-form"><label for="goal-new-title">MỤC TIÊU MỚI</label><input id="goal-new-title" name="title" required maxlength="150" placeholder="Mục tiêu của bạn…" autocomplete="off"><input name="deadline" type="date" aria-label="Hạn mục tiêu"><button class="pixel-action-btn pixel-action-btn--blue" type="submit" ${!this.canUseData('goals') ? 'disabled' : ''}>+ TẠO GOAL</button></form>`;
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

    const taskQuests = this.notionTasks.map((task, index) => ({ ...task, sourceKind: 'task', sourceIndex: index, questType: task.type || 'SIDE' }));
    const activeQuestRecords = this.notionActiveQuests.map((quest, index) => ({ ...quest, sourceKind: 'active', sourceIndex: index, questType: /daily/i.test(quest.frequency || '') ? 'DAILY' : 'MAIN' }));
    const allQuests = [...activeQuestRecords, ...taskQuests];
    const dateKey = (value) => value ? String(value).slice(0, 10) : '';
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const classify = (quest) => {
      const haystack = `${quest.questType || ''} ${quest.type || ''} ${quest.frequency || ''} ${quest.priority || ''}`.toLowerCase();
      if (/daily|every day|hàng ngày/.test(haystack)) return 'DAILY';
      if (/main|critical|high priority|work/.test(haystack)) return 'MAIN';
      return 'SIDE';
    };
    let visibleQuests;
    if (this.panelTab === 'TODAY') {
      visibleQuests = allQuests.filter((quest) => !quest.done && (dateKey(quest.date || quest.dueDate) === todayKey || /daily/i.test(`${quest.frequency || ''} ${quest.type || ''}`)));
    } else if (this.panelTab === 'OVERDUE') {
      visibleQuests = allQuests.filter((quest) => !quest.done && dateKey(quest.date || quest.dueDate) && dateKey(quest.date || quest.dueDate) < todayKey);
    } else {
      visibleQuests = allQuests.filter((quest) => classify(quest) === this.panelTab);
    }
    const sectionCopy = {
      TODAY: ['TODAY PATROL', 'NHIỆM VỤ HÔM NAY', 'Chỉ hiện việc đến hạn hôm nay và nhiệm vụ lặp lại hằng ngày.'],
      OVERDUE: ['PAST DUE', 'NHIỆM VỤ QUÁ HẠN', 'Các việc quá hạn được tách riêng để bạn sắp xếp lại.'],
      MAIN: ['MAIN QUESTS', 'NHIỆM VỤ CHÍNH', 'Lọc từ Type và Priority trong Notion.'],
      SIDE: ['SIDE QUESTS', 'NHIỆM VỤ PHỤ', 'Các việc phụ, hẹn gặp và nhiệm vụ không thuộc tuyến chính.'],
      DAILY: ['DAILY QUESTS', 'NHIỆM VỤ LẶP LẠI', 'Nhiệm vụ Daily trong Master Calendar và Active Quests.']
    }[this.panelTab] || ['NOTION QUESTS', 'QUEST BOARD', 'Dữ liệu trực tiếp từ Notion.'];
    return `
      ${syncBannerHtml}
      <div class="quest-source-banner">
        <span>${sectionCopy[0]}</span>
        <strong>${sectionCopy[1]} (${visibleQuests.length})</strong>
        <small>${sectionCopy[2]}</small>
      </div>
      <div class="quest-board-list">
        ${visibleQuests.map((quest) => `
          <article class="quest-board-card ${quest.done ? 'is-done' : ''}">
            <div class="pixel-card-header">
              <span class="pixel-tag ${classify(quest) === 'MAIN' ? 'pixel-tag--red' : classify(quest) === 'DAILY' ? 'pixel-tag--green' : 'pixel-tag--blue'}">${this.escapeHtml(classify(quest))}</span>
              <span class="pixel-tag">${this.escapeHtml(quest.type || quest.frequency || 'QUEST')}</span>
              ${Number.isFinite(Number(quest.gameXp ?? quest.xp)) ? `<span class="pixel-tag pixel-tag--gold">+${Number(quest.gameXp ?? quest.xp)} XP</span>` : ''}
            </div>
            <h3>${this.escapeHtml(quest.title || quest.name)}</h3>
            <p>${this.escapeHtml(quest.description || '')}</p>
            <small>${quest.date || quest.dueDate ? `HẠN ${new Date(quest.date || quest.dueDate).toLocaleDateString('vi-VN')}` : 'NOTION QUEST'}</small>
            <div class="pixel-card-footer">
              ${quest.sourceKind === 'task' ? `<button class="pixel-action-btn pixel-action-btn--blue" data-open-task-map="${quest.sourceIndex}">📍 CHỌN QUÁN / ĐỊA ĐIỂM</button>${this.realWorldDirectionsLink(quest)}` : '<span></span>'}
              <button class="pixel-action-btn ${quest.done ? 'pixel-action-btn--disabled' : ''}"
                      ${quest.sourceKind === 'active' ? `data-complete-active-quest="${quest.sourceIndex}"` : `data-complete-task="${quest.sourceIndex}"`} ${quest.done || !this.canUseData(quest.sourceKind === 'active' ? 'activeQuests' : 'masterCalendar') ? 'disabled' : ''}>
                ${quest.done ? '✓ ĐÃ XONG' : 'HOÀN THÀNH'}
              </button>
            </div>
          </article>
        `).join('') || `<div class="quest-empty-state"><strong>${this.panelTab === 'TODAY' ? 'HÔM NAY CHƯA CÓ QUEST' : 'KHÔNG CÓ QUEST TRONG NHÓM NÀY'}</strong><small>${this.panelTab === 'TODAY' ? 'Xem Quá hạn và các nhóm nhiệm vụ khác ở thanh tab phía trên.' : 'Kiểm tra dữ liệu Notion hoặc chọn tab khác.'}</small></div>`}
      </div>
      <details class="quest-create-drawer"><summary>+ THÊM NHIỆM VỤ</summary><form class="quest-create-form" id="quest-create-form"><label for="quest-new-title">NHIỆM VỤ MỚI</label><input id="quest-new-title" name="title" required maxlength="150" placeholder="Việc bạn sẽ làm…" autocomplete="off"><input name="date" type="date" aria-label="Ngày thực hiện"><button class="pixel-action-btn pixel-action-btn--blue" type="submit" ${!this.canUseData('masterCalendar') ? 'disabled' : ''}>+ TẠO QUEST</button></form></details>
    `;
  }

  persistNotionCache() {
    localStorage.setItem('spidey_notion_tasks', JSON.stringify(this.notionTasks));
    localStorage.setItem('spidey_notion_habits', JSON.stringify(this.notionHabits));
    localStorage.setItem('spidey_notion_goals', JSON.stringify(this.notionGoals));
    localStorage.setItem('spidey_notion_active_quests', JSON.stringify(this.notionActiveQuests));
    localStorage.setItem('spidey_notion_cached_at', new Date().toISOString());
    localStorage.setItem('spidey_notion_cache_source', this.notionSource);
    if (this.notionSyncedAt) localStorage.setItem('spidey_notion_source_at', this.notionSyncedAt);
  }

  /* -------------------------------------------------------------
     2. TAB [HERO]: SUITS WARDROBE (WITH SHOWCASE POD), SKILLS (NOTION IMAGES), ROSTER, GADGETS
  ------------------------------------------------------------- */
  renderHeroSection() {
    if (this.notionPresenter) return this.notionPresenter.renderHero(this.panelTab);
    const profile = this.notionHeroProfile;
    if (this.panelTab === 'MAPS') {
      const level = Number(profile?.Level) || this.engine.snapshot().hero.level || 1;
      const cards = this.notionArenaMaps.filter((map) => map.Available !== false).map((map) => {
        const key = String(map['Map Key'] || '').toLowerCase();
        if (!['rooftop', 'subway', 'lab'].includes(key)) return '';
        const selected = this.selectedArenaMapId === map.id;
        const locked = level < (Number(map['Unlock Level']) || 1);
        return `<article class="pixel-game-card arena-map-card arena-map-card--${key} ${selected ? 'arena-map-card--selected' : ''}">
          <div class="arena-map-card__scene" aria-hidden="true"></div>
          <div class="pixel-card-header"><span class="pixel-tag">${this.escapeHtml(map.District || map.Map)}</span><span class="pixel-tag ${selected ? 'pixel-tag--gold' : ''}">${selected ? 'ĐANG DÙNG' : locked ? `LV ${Number(map['Unlock Level'])}` : 'CÓ THỂ CHỌN'}</span></div>
          <h3 class="pixel-card-title">${this.escapeHtml(map.Map)}</h3><p class="pixel-card-desc">${this.escapeHtml(map.Description || map.Weather || '')}</p>
          <button class="pixel-action-btn" data-select-arena-map="${this.escapeHtml(map.id)}" ${selected || locked ? 'disabled' : ''}>${selected ? 'ĐÃ CHỌN' : locked ? 'CHƯA MỞ KHÓA' : 'CHỌN MAP'}</button>
        </article>`;
      }).join('');
      return `<div class="quest-source-banner"><span>ARENA MAPS</span><strong>CHỌN SÂN ĐẤU CHO HERO</strong><small>${profile && this.notionConnection === 'connected' ? 'Đổi map sẽ lưu vào Current Map trong Hero Profile trên Notion.' : 'Map đổi ngay trên thiết bị. Kết nối Notion để lưu vào Hero Profile.'}</small></div><div class="pixel-card-grid arena-map-grid">${cards || '<p class="pixel-card-desc">Chưa có map khả dụng.</p>'}</div>`;
    }
    if (this.panelTab === 'PROFILE') {
      if (!profile) {
        const hero = this.engine.snapshot().hero;
        return `<div class="quest-source-banner"><strong>HERO LƯU TRÊN THIẾT BỊ</strong><small>Chiến đấu và chọn Map vẫn dùng được. Trang bị Notion chưa được tải.</small><button class="pixel-action-btn pixel-action-btn--blue" data-open-hero-maps>CHỌN MAP</button></div><div class="spidey-skill-summary"><span><b>LV ${hero.level}</b> LEVEL</span><span><b>${hero.hp}/${hero.maxHp}</b> HP</span><span><b>${hero.webEnergy}</b> ENERGY</span></div>`;
      }
      const suit = this.notionSuits.find((item) => profile['Equipped Suit']?.includes(item.id));
      const gadgets = this.notionGadgets.filter((item) => profile['Equipped Gadgets']?.includes(item.id));
      const skills = this.notionCombatSkills.filter((item) => [1, 2, 3, 4].some((slot) => profile[`Skill Slot ${slot}`]?.includes(item.id)));
      return `<div class="quest-source-banner"><span>NOTION HERO PROFILE</span><strong>${this.escapeHtml(profile.Hero || 'SPIDER-MAN')}</strong><small>Chỉ số và trang bị đang đọc trực tiếp từ Notion.</small></div>
        <div class="spidey-skill-summary"><span><b>LV ${Number(profile.Level) || 1}</b> LEVEL</span><span><b>${Number(profile.Exp) || 0}</b> XP</span><span><b>${Number(profile.Gold) || 0}</b> GOLD</span></div>
        <div class="spidey-skill-summary"><span><b>${Number(profile.HP) || 0}/${Number(profile['Max HP']) || 100}</b> HP</span><span><b>${Number(profile.Energy) || 0}/${Number(profile['Max Energy']) || 10}</b> ENERGY</span><span><b>${Number(profile['Skill Point']) || 0}</b> SP</span></div>
        <div class="pixel-card-grid"><article class="pixel-game-card"><h3 class="pixel-card-title">SUIT</h3><p class="pixel-card-desc">${this.escapeHtml(suit?.Suit || 'Chưa trang bị')}</p></article><article class="pixel-game-card"><h3 class="pixel-card-title">GADGETS</h3><p class="pixel-card-desc">${this.escapeHtml(gadgets.map((item) => item.Gadget || item.Name || item.Title).join(', ') || 'Chưa trang bị')}</p></article><article class="pixel-game-card"><h3 class="pixel-card-title">MAP</h3><p class="pixel-card-desc">${this.escapeHtml(this.currentArenaMap()?.Map || 'Manhattan Rooftop')}</p><button class="pixel-action-btn pixel-action-btn--blue" data-open-hero-maps>ĐỔI MAP</button></article></div>`;
    }
    if (this.panelTab === 'BADGES') {
      return `<div class="quest-source-banner"><span>SPIDER BADGES</span><strong>HUY HIỆU TỪ NOTION</strong><small>${this.notionBadges.length} badge, biểu tượng lấy từ mục Badges & Medals.</small></div><div class="pixel-card-grid">${this.notionBadges.map((badge) => `<article class="pixel-game-card ${badge.Unlocked ? 'pixel-game-card--done' : ''}"><div class="pixel-card-header"><span class="pixel-tag">${this.escapeHtml(badge.Tier || 'BADGE')}</span><span class="pixel-tag">${badge.Unlocked ? 'UNLOCKED' : 'LOCKED'}</span></div>${this.badgeArtwork(badge)}<h3 class="pixel-card-title">${this.escapeHtml(badge.Medal || 'Badge')}</h3><p class="pixel-card-desc">${this.escapeHtml(badge.Requirement || '')}</p></article>`).join('') || '<p class="pixel-card-desc">Đang tải badge từ Notion.</p>'}</div>`;
    }
    if (this.panelTab === 'SKILLS') {
      return `<div class="quest-source-banner"><span>SPIDER MOVESET</span><strong>COMBAT SKILLS // NOTION</strong><small>Chọn kỹ năng để gắn vào một trong bốn ô của Hero Profile.</small></div>
        <div class="pixel-card-grid">${this.notionCombatSkills.map((skill) => { const equipped = [1,2,3,4].some((slot) => profile?.[`Skill Slot ${slot}`]?.includes(skill.id)); return `<article class="pixel-game-card"><div class="pixel-card-header"><span class="pixel-tag">${this.escapeHtml(skill.Branch || skill['Skill Type'] || 'SKILL')}</span><span class="pixel-tag">${Number(skill['Energy Cost']) || 0} ENERGY</span></div><h3 class="pixel-card-title">${this.escapeHtml(skill.Skill)}</h3><p class="pixel-card-desc">${this.escapeHtml(skill.Description || '')}</p><button class="pixel-action-btn" data-equip-skill="${skill.id}" ${equipped || !profile ? 'disabled' : ''}>${equipped ? 'ĐANG TRANG BỊ' : 'TRANG BỊ'}</button></article>`; }).join('') || '<p class="pixel-card-desc">Đang tải Combat Skills từ Notion.</p>'}</div>`;
    }
    if (this.panelTab === 'GADGETS') {
      return `<div class="quest-source-banner"><span>WEB TECH</span><strong>GADGET LOADOUT // NOTION</strong><small>Gadget được lưu ở Hero Profile, tối đa hai món.</small></div><div class="pixel-card-grid">${this.notionGadgets.map((gadget) => { const equipped = profile?.['Equipped Gadgets']?.includes(gadget.id); const unlocked = gadget.Status === 'Unlocked' || gadget.Status === 'Equipped'; return `<article class="pixel-game-card"><div class="pixel-card-header"><span class="pixel-tag">${this.escapeHtml(gadget.Category || 'GADGET')}</span><span class="pixel-tag">${this.escapeHtml(gadget.Status || 'LOCKED')}</span></div>${gadget.Image ? `<img class="notion-badge-icon" src="${this.escapeHtml(gadget.Image)}" alt="" loading="lazy">` : ''}<h3 class="pixel-card-title">${this.escapeHtml(gadget.Gadget)}</h3><p class="pixel-card-desc">${this.escapeHtml(gadget['Gameplay Effect'] || gadget.Description || '')}</p><button class="pixel-action-btn" data-equip-gadget="${gadget.id}" ${!profile || !unlocked ? 'disabled' : ''}>${equipped ? 'THÁO GADGET' : unlocked ? 'TRANG BỊ' : 'CHƯA MỞ KHÓA'}</button></article>`; }).join('') || '<p class="pixel-card-desc">Đang tải Spider Gadgets từ Notion.</p>'}</div>`;
    }
    if (this.panelTab === 'ROSTER') {
      return `<div class="quest-source-banner"><span>SPIDER-VERSE</span><strong>CHỌN COMPANION // NOTION</strong><small>Companion được lưu ở Hero Profile.</small></div><div class="pixel-card-grid">${this.notionSpiderVerse.map((spider) => { const selected = profile?.Companion?.includes(spider.id); return `<article class="pixel-game-card"><div class="pixel-card-header"><span class="pixel-tag">${this.escapeHtml(spider.Tier || 'SPIDER')}</span></div>${spider.Image ? `<img class="notion-badge-icon" src="${this.escapeHtml(spider.Image)}" alt="" loading="lazy">` : ''}<h3 class="pixel-card-title">${this.escapeHtml(spider.Spider)}</h3><p class="pixel-card-desc">${this.escapeHtml(spider.Quote || '')}</p><button class="pixel-action-btn" data-equip-companion="${spider.id}" ${selected || !profile ? 'disabled' : ''}>${selected ? 'ĐANG ĐỒNG HÀNH' : 'CHỌN COMPANION'}</button></article>`; }).join('') || '<p class="pixel-card-desc">Đang tải Spider-Verse từ Notion.</p>'}</div>`;
    }
    const equippedSuitId = profile?.['Equipped Suit']?.[0];
    const currentVariant = profile ? (this.suits.find((item) => item.id === equippedSuitId)?.Suit || '') : (this.engine.data.hero.variant || 'Advanced Suit 2.0');
    const previewSuit = this.suits[this.previewSuitIndex] || this.suits[0] || {
      Suit: currentVariant,
      Owner: 'Peter Parker',
      ImageUrl: './assets/spideytracker/tracker_logo3.png',
      GameEffect: 'Tăng cường phản xạ và sức bền chiến đấu của Người Nhện.',
      LevelReq: 1,
      Cost: 'Khởi đầu'
    };
    const isEquipped = Boolean(currentVariant && previewSuit.Suit === currentVariant);
    const canEquipSuit = Boolean(profile?.id && previewSuit.id && (previewSuit.Status === 'Unlocked' || previewSuit.Status === 'Equipped') && (Number(profile.Level) || 1) >= (Number(previewSuit.LevelReq) || 1));

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
            <span>HP</span>
            <div class="spidey-stat-bar"><div class="spidey-stat-fill" style="width: ${Math.min(100, Math.max(0, Number(previewSuit.HPBonus) || 0))}%;"></div></div>
            <span>+${Number(previewSuit.HPBonus) || 0}</span>
          </div>
          <div class="spidey-stat-row">
            <span>DEF</span>
            <div class="spidey-stat-bar"><div class="spidey-stat-fill" style="width: ${Math.min(100, Math.max(0, Number(previewSuit.DEFBonus) || 0))}%; background: linear-gradient(90deg, #83b96b, #54b6d0);"></div></div>
            <span>+${Number(previewSuit.DEFBonus) || 0}</span>
          </div>
          <div class="spidey-stat-row">
            <span>ENERGY</span>
            <div class="spidey-stat-bar"><div class="spidey-stat-fill" style="width: ${Math.min(100, Math.max(0, Number(previewSuit.EnergyBonus) || 0))}%; background: linear-gradient(90deg, #f0645c, #f2c06b);"></div></div>
            <span>+${Number(previewSuit.EnergyBonus) || 0}</span>
          </div>

          <button class="spidey-equip-btn ${isEquipped ? 'spidey-equip-btn--equipped' : ''}" 
                  data-equip-suit="${this.previewSuitIndex}" ${isEquipped || !canEquipSuit ? 'disabled' : ''}>
            ${isEquipped ? '✓ ĐANG TRANG BỊ' : !canEquipSuit ? 'CHƯA MỞ KHÓA / CHƯA TẢI NOTION' : '⚡ MẶC BỘ ĐỒ NÀY'}
          </button>
        </div>
      </aside>
    `;

    // Right Column content based on tab
    let rightColumnHtml = '';

    if (this.panelTab === 'ROSTER') {
      rightColumnHtml = `
        <div class="sync-online-banner">
          <div>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
              <span class="pixel-tag pixel-tag--gold">🕷️ SPIDER-VERSE</span>
              <strong style="color: #f2c06b; font-size: 10px;">77 BIẾN THỂ NHỆN & MARVEL SNAP HEROES</strong>
            </div>
            <small style="color: #9ed9e7; font-size: 8px;">Chọn Spider-Hero để kích hoạt Synergy và đòn đánh phối hợp</small>
          </div>
          <button id="btn-sync-notion-live" class="pixel-action-btn pixel-action-btn--blue">🔄 ĐỒNG BỘ NOTION LIVE</button>
        </div>
        <div class="pixel-card-grid">
          ${this.spiderVerse.slice(0, 60).map((spider, idx) => {
            const snap = this.getSnapCard(spider.Name);
            const cardImg = snap?.CardUrl || snap?.ArtUrl || spider.IiliUrl || spider.FandomSrc || './assets/spideytracker/tracker_logo3.png';
            const cost = (idx % 6) + 1;
            const power = ((idx * 3) % 12) + 1;
            return `
              <article class="snap-card-pod">
                <div class="snap-card-energy">${cost}</div>
                <div class="snap-card-power">${power}</div>
                <div class="snap-card-frame">
                  <img src="${cardImg}" alt="${spider.Name}" loading="lazy" onerror="this.onerror=null; this.src='${spider.IiliUrl || spider.FandomSrc || './assets/spideytracker/tracker_logo3.png'}';" />
                </div>
                <div style="padding: 4px 2px; flex: 1; display: flex; flex-direction: column;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span class="pixel-tag pixel-tag--gold">${spider.Icon || '🕷️'} ${spider.Name?.split('(')[1]?.replace(')', '') || 'Multiverse'}</span>
                    <span class="pixel-tag pixel-tag--green">SYNERGY</span>
                  </div>
                  <h3 class="pixel-card-title" style="margin-bottom: 4px; font-size: 10px;">${spider.Name?.split('—')[0] || spider.Name}</h3>
                  <p class="pixel-card-desc" style="font-size: 8px; flex: 1;"><em>"${spider.Quote || 'With great power comes great responsibility.'}"</em></p>
                  <div class="pixel-card-footer" style="margin-top: 6px;">
                    <small style="color: #7fbfd2; font: 700 7px monospace;">ASSIST HERO</small>
                    <button class="pixel-action-btn pixel-action-btn--gold" data-select-ally="${idx}">CHỌN ASSIST</button>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      `;
    } else if (this.panelTab === 'SKILLS') {
      const skills = this.skillsCatalog.filter((skill) => skill.slot === 'active' || skill.slot === 'ultimate');
      const groupedSkills = skills.reduce((groups, skill) => {
        const key = skill.branch || 'Spider Skills';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(skill);
        return groups;
      }, new Map());

      rightColumnHtml = `
        <div class="quest-source-banner">
          <span>ACTIVE SKILLS</span>
          <strong>SPIDER MOVESET: CHIÊU THƯỜNG & ULTIMATE</strong>
          <small>Không trộn Web Shooter/Web Bomb/Impact Web: các món bắn tơ thuần nằm ở Gadget Wheel</small>
        </div>
        <div class="spidey-skill-summary">
          <span><b>${skills.filter((skill) => skill.slot === 'active').length}</b> ACTIVE</span>
          <span><b>${skills.filter((skill) => skill.slot === 'ultimate').length}</b> ULTIMATE</span>
          <span><b>${groupedSkills.size}</b> BRANCHES</span>
        </div>
        <div class="spidey-skill-branch-list">
          ${Array.from(groupedSkills.entries()).map(([branch, branchSkills]) => `
            <section class="spidey-skill-branch">
              <header>
                <strong>${this.escapeHtml(branch)}</strong>
                <span>${branchSkills.length} moves</span>
              </header>
              <div class="spidey-skill-stack">
                ${branchSkills
                  .sort((a, b) => (a.tier - b.tier) || (a.order - b.order) || a.name.localeCompare(b.name))
                  .map((sk) => {
                    const image = sk.image || this.skillIcons[`${sk.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.png`] || './assets/spideytracker/tracker_logo3.png';
                    const source = (sk.sourceGames || []).slice(0, 3).join(' // ');
                    return `
                      <article class="spidey-skill-card spidey-skill-card--${sk.slot === 'ultimate' ? 'ultimate' : 'active'}">
                        <div class="spidey-skill-icon-frame">
                          <img src="${image}" alt="${this.escapeHtml(sk.name)}" loading="lazy" />
                        </div>
                        <div class="spidey-skill-info">
                          <div class="spidey-skill-meta">
                            <span class="pixel-tag ${sk.slot === 'ultimate' ? 'pixel-tag--gold' : 'pixel-tag--red'}">${sk.slot === 'ultimate' ? 'ULT' : 'ACTIVE'}</span>
                            <span class="pixel-tag">${this.escapeHtml(sk.hero || 'Shared')}</span>
                            <span class="pixel-tag pixel-tag--green">SP ${sk.sp_cost || 1}</span>
                            <span class="spidey-effect-row">${this.renderEffectIcons(sk.effectIcons || [])}</span>
                          </div>
                          <h4>${this.escapeHtml(sk.name)}</h4>
                          <p>${this.escapeHtml(sk.description)}</p>
                          <small class="spidey-skill-source">${this.escapeHtml(source || 'Spider games moveset')}</small>
                        </div>
                        <div class="spidey-skill-actions">
                          <button class="pixel-action-btn ${sk.slot === 'ultimate' ? 'pixel-action-btn--gold' : 'pixel-action-btn--green'}" data-equip-skill="${this.escapeHtml(sk.name)}">
                            ${sk.slot === 'ultimate' ? 'GẮN ULT' : 'TRANG BỊ'}
                          </button>
                        </div>
                      </article>
                    `;
                  }).join('')}
              </div>
            </section>
          `).join('')}
        </div>
      `;
    } else if (this.panelTab === 'GADGETS') {
      const categoryLabels = {
        WEB_SHOOTER: 'WEB-SHOOTER RIGS',
        WEB_AMMO: 'WEB CARTRIDGES',
        WEB_DEPLOYABLE: 'WEB DEPLOYABLES',
        TECH_GADGET: 'FIELD TECH',
        STEALTH_GADGET: 'STEALTH TECH',
        MOBILITY_GADGET: 'MOBILITY GEAR',
        UTILITY_GADGET: 'UTILITY'
      };
      const categoryOrder = Object.keys(categoryLabels);
      const gadgets = [...this.gadgetsCatalog].sort((a, b) => {
        const categoryDiff = categoryOrder.indexOf(a.Category) - categoryOrder.indexOf(b.Category);
        return categoryDiff || (a.Title || '').localeCompare(b.Title || '');
      });
      const groupedGadgets = gadgets.reduce((groups, gadget) => {
        const key = gadget.Category || 'UTILITY_GADGET';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(gadget);
        return groups;
      }, new Map());
      const webModeCount = gadgets.filter((g) => ['WEB_AMMO', 'WEB_DEPLOYABLE'].includes(g.Category)).length;

      rightColumnHtml = `
        <div class="quest-source-banner">
          <span>GADGET DB</span>
          <strong>WEB-SHOOTER DATABASE & SPIDER GADGET WHEEL</strong>
          <small>Máy bắn tơ, cartridge, trap và field tech đã chuẩn hóa cho Notion DB mirror</small>
        </div>
        <div class="spidey-skill-summary spidey-gadget-summary">
          <span><b>${gadgets.length}</b> GADGETS</span>
          <span><b>${webModeCount}</b> WEB TYPES</span>
          <span><b>${groupedGadgets.size}</b> GROUPS</span>
        </div>
        <div class="spidey-gadget-branch-list">
          ${Array.from(groupedGadgets.entries()).map(([category, group]) => `
            <section class="spidey-skill-branch spidey-gadget-branch spidey-gadget-branch--${this.escapeHtml(category.toLowerCase())}">
              <header>
                <strong>${categoryLabels[category] || this.escapeHtml(category)}</strong>
                <span>${group.length} items</span>
              </header>
              <div class="spidey-gadget-grid">
                ${group.map((g) => `
                  <article class="spidey-gadget-card">
                    <div class="spidey-gadget-media">
                      <img src="${this.escapeHtml(g.ImageUrl || './assets/spideytracker/tracker_logo3.png')}" alt="${this.escapeHtml(g.Title)}" loading="lazy" />
                    </div>
                    <div class="spidey-gadget-info">
                      <div class="spidey-skill-meta">
                        <span class="pixel-tag ${g.Category === 'WEB_SHOOTER' ? 'pixel-tag--blue' : g.Category?.includes('WEB') ? 'pixel-tag--gold' : 'pixel-tag--green'}">${this.escapeHtml(g.Charges || 'READY')}</span>
                        <span class="pixel-tag">CD ${Number(g.Cooldown || 0)}</span>
                        <span class="spidey-effect-row">${this.renderEffectIcons(g.EffectIcons || [])}</span>
                      </div>
                      <h4>${this.escapeHtml(g.Title)}</h4>
                      <p>${this.escapeHtml(g.GameEffect || 'Spider gadget ready for field deployment.')}</p>
                      <small class="spidey-skill-source">${this.escapeHtml(g.Tuning || g.Role || 'Field tuning')}</small>
                    </div>
                    <footer>
                      <span>${this.escapeHtml(g.NotionStatus || 'LOCAL DB')}</span>
                      <button class="pixel-action-btn pixel-action-btn--blue">SYNC</button>
                    </footer>
                  </article>
                `).join('')}
              </div>
            </section>
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
    if (this.notionPresenter) return this.panelTab === 'BADGES' ? this.notionPresenter.renderHero('BADGES') : this.notionPresenter.renderEnemyRecords();
    if (this.panelTab === 'BESTIARY' && this.notionEnemies.length) {
      const gameReady = this.notionEnemies.filter((enemy) => Number(enemy['Max HP']) > 0 || Number(enemy.ATK) > 0);
      const roster = (gameReady.length ? gameReady : this.notionEnemies).slice(0, 48);
      return `<div class="quest-source-banner"><span>THREAT DATABASE</span><strong>ENEMIES // NOTION</strong><small>${gameReady.length || this.notionEnemies.length} hồ sơ game-ready trong tổng số ${this.notionEnemies.length} bản ghi. Arena tự chọn đúng ảnh quái theo tên.</small></div><div class="pixel-card-grid">${roster.map((enemy) => { const art = this.catalogImage(enemy); return `<article class="pixel-game-card"><div class="pixel-card-header"><span class="pixel-tag pixel-tag--red">${this.escapeHtml(enemy.Tier || enemy['Enemy Class'] || 'ENEMY')}</span><span class="pixel-tag">${this.escapeHtml(enemy.Faction || '')}</span></div>${art ? `<img class="notion-badge-icon" src="${this.escapeHtml(art)}" alt="" loading="lazy">` : ''}<h3 class="pixel-card-title">${this.escapeHtml(enemy.Boss || enemy.Enemy || enemy.Name || 'Enemy')}</h3><p class="pixel-card-desc">HP ${Number(enemy['Max HP']) || 0} · ATK ${Number(enemy.ATK) || 0} · DEF ${Number(enemy.DEF) || 0}</p></article>`; }).join('')}</div>`;
    }
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
      const badgeEntries = this.notionBadges;
      return `
        <div class="quest-source-banner">
          <span>🎖️ BADGES</span>
          <strong>${badgeEntries.length} HUY HIỆU TỪ NOTION</strong>
          <small>Ảnh và điều kiện từ Badges & Medals · trạng thái cập nhật khi đồng bộ</small>
        </div>
        <div class="pixel-card-grid pixel-card-grid--compact">
          ${badgeEntries.map((badge) => `
            <article class="pixel-game-card pixel-game-card--gold ${badge.Unlocked ? 'pixel-game-card--done' : ''}">
              <div class="pixel-card-header">
                <span class="pixel-tag pixel-tag--gold">${this.escapeHtml(badge.Tier || 'MEDAL')}</span>
                <span class="pixel-tag ${badge.Unlocked ? 'pixel-tag--green' : ''}">${badge.Unlocked ? 'UNLOCKED' : 'LOCKED'}</span>
              </div>
              ${this.badgeArtwork(badge)}
              <h3 class="pixel-card-title" style="font-size: 9px;">${this.escapeHtml(badge.Medal || 'Badge')}</h3>
              <p class="pixel-card-desc" style="font-size: 9px;">${this.escapeHtml(badge.Requirement || '')}</p>
            </article>
          `).join('')}
        </div>
      `;
    }

    // Default: BESTIARY (Boss & Minions)
    const minionEntries = Object.entries(this.minions);
    return `
      <div class="sync-online-banner">
        <div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
            <span class="pixel-tag pixel-tag--red">👹 BESTIARY // BOSSES</span>
            <strong style="color: #f2c06b; font-size: 10px;">134 THỦ LĨNH PHẢN DIỆN & MINIONS (MARVEL SNAP CARDS)</strong>
          </div>
          <small style="color: #9ed9e7; font-size: 8px;">Dữ liệu phản diện trích xuất từ Marvel Snap & Notion Bestiary</small>
        </div>
        <button id="btn-sync-notion-live" class="pixel-action-btn pixel-action-btn--blue">🔄 ĐỒNG BỘ NOTION LIVE</button>
      </div>
      <div class="quest-source-banner">
        <span>👹 BESTIARY</span>
        <strong>THƯ VIỆN KẺ THÙ: BOSSES & MINIONS</strong>
        <small>Thông số, điểm yếu và hệ khắc chế trong các ải tuần tra</small>
      </div>
      <div class="pixel-card-grid">
        ${this.bosses.map((boss) => {
          const snap = this.getSnapCard(boss.name, boss.defid);
          const cardImg = snap?.CardUrl || `https://static.marvelsnap.pro/cards/${boss.defid || 'Venom'}.webp`;
          const energyCost = Math.min(6, Math.max(1, Math.round(boss.hp / 100)));
          const power = Math.min(20, Math.max(1, Math.round(boss.atk / 5)));
          return `
            <article class="snap-card-pod">
              <div class="snap-card-energy">${energyCost}</div>
              <div class="snap-card-power">${power}</div>
              <div class="snap-card-frame">
                <img src="${cardImg}" alt="${boss.name}" loading="lazy" onerror="this.onerror=null; this.src='https://static.marvelsnap.pro/art/${boss.defid || 'Venom'}.webp';" />
              </div>
              <div style="padding: 4px 2px; flex: 1; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span class="pixel-tag pixel-tag--red">${boss.enemyClass || 'BOSS'}</span>
                  <span class="pixel-tag pixel-tag--gold">HP: ${boss.hp}</span>
                </div>
                <h3 class="pixel-card-title" style="margin-bottom: 4px; font-size: 10px;">${boss.name}</h3>
                <p class="pixel-card-desc" style="font-size: 8px; flex: 1;">${boss.notes || boss.quote || 'Thủ lĩnh phản diện đối đầu Spider-Man.'}</p>
                <div class="pixel-card-footer" style="margin-top: 6px;">
                  <small style="color: #f0645c; font: 700 7px monospace;">ATK: ${boss.atk} | DEF: ${boss.def}</small>
                  <span class="pixel-tag pixel-tag--red">CHAPTER BOSS</span>
                </div>
              </div>
            </article>
          `;
        }).join('')}
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
          <span>PARKER FIELD NOTES</span>
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
            
            <button class="pixel-action-btn pixel-action-btn--gold" id="btn-save-journal" style="align-self: flex-start; margin-top: 6px;" ${this.notionConnection !== 'connected' ? 'disabled' : ''}>LƯU VÀO NOTION</button>
          </div>
        </div>
        <div class="pixel-card-grid">
          ${this.notionJournalEntries.length ? this.notionJournalEntries.map((entry) => `
            <article class="pixel-game-card">
              <div class="pixel-card-header"><span class="pixel-tag">${this.escapeHtml(entry.Date || entry.createdAt?.slice(0, 10) || '')}</span><span class="pixel-tag pixel-tag--green">NOTION</span></div>
              <h3 class="pixel-card-title">${this.escapeHtml(entry["today's mood"] || 'Nhật ký ngày')}</h3>
              ${entry.sourceUrl ? `<a class="pixel-action-btn pixel-action-btn--blue" href="${this.escapeHtml(entry.sourceUrl)}" target="_blank" rel="noopener noreferrer">XEM NỘI DUNG</a>` : ''}
            </article>
          `).join('') : '<article class="pixel-game-card"><p class="pixel-card-desc">Chưa có nhật ký trong Notion. Hãy viết trang đầu tiên hôm nay.</p></article>'}
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
    if (this.notionPresenter) return this.notionPresenter.renderPresentationSettings();
    const settings = this.engine.snapshot().settings;
    if (this.panelTab === 'SAVE') return `<div class="game-save-tools">
      <article class="game-card"><small>VERSIONED LOCAL SAVE</small><h3>PROGRESSION BACKUP</h3><p>Export lưu trận đấu, Quest, Habit và Goal vào một file JSON. Import để khôi phục trên thiết bị khác. Reset chỉ xóa tiến độ trận đấu.</p></article>
      <button class="game-panel-action" data-save-export>EXPORT SAVE JSON</button>
      <label class="game-panel-action game-panel-file">IMPORT SAVE JSON<input type="file" accept="application/json" data-save-import></label>
      <button class="game-panel-action game-panel-action--danger" data-save-reset>RESET GAME SAVE</button>
    </div>`;
    const toggle = (key, label) => `<label class="game-setting-row"><span>${label}</span><input type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''}></label>`;
    return `<div class="game-settings-grid">
      ${toggle('sfx', 'SFX')}${toggle('music', 'MUSIC')}${toggle('reduceMotion', 'REDUCE MOTION')}${toggle('screenShake', 'SCREEN SHAKE')}${toggle('comicText', 'COMIC TEXT')}
      <label class="game-setting-row"><span>COMBAT SPEED</span><select data-setting="combatSpeed"><option value="1" ${settings.combatSpeed === 1 ? 'selected' : ''}>x1</option><option value="2" ${settings.combatSpeed === 2 ? 'selected' : ''}>x2</option></select></label>
      <label class="game-setting-row"><span>DIFFICULTY</span><select data-setting="difficulty">${Object.keys(this.engine.content.difficulties).map((id) => `<option ${id === settings.difficulty ? 'selected' : ''}>${id}</option>`).join('')}</select></label>
      <label class="game-setting-row game-setting-row--wide"><span>MASTER VOLUME // ${Math.round(settings.volume * 100)}%</span><input type="range" min="0" max="1" step="0.1" value="${settings.volume}" data-setting="volume"></label>
    </div><p class="game-settings-note">Độ khó áp dụng từ đối thủ kế tiếp. Tiến độ trận đấu, Quest và Habit được lưu trên thiết bị. Export Save JSON để sao lưu sang máy khác.</p>`;
  }

  /* -------------------------------------------------------------
     EVENT BINDINGS & NOTION 2-WAY SYNC
  ------------------------------------------------------------- */
  async syncLiveFromNotion(btn = null, { quiet = false } = {}) {
    if (this.notionPresenter) { await this.notionPresenter.refresh(); return; }
    if (this.notionConnection !== 'connected') {
      this.notionError = 'Kết nối riêng trước khi đồng bộ Notion.';
      this.renderPanel();
      return;
    }
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ ĐANG ĐỒNG BỘ...';
    }
    if (!quiet) { this.sound.playSelect(); this.toast('ĐANG KẾT NỐI NOTION...'); }

    try {
      if (!localStorage.getItem('spidey_notion_authoritative_reset_v1')) {
        // Old demo actions must never be replayed into the owner's clean Notion state.
        localStorage.removeItem('spidey_notion_pending_writes');
        localStorage.removeItem('spidey_notion_profile_pending');
      }
      const [tasks, habits, goals, profile, activeQuests] = await Promise.allSettled([
        queryAllNotionPages(NOTION_GAME_DATABASES.masterCalendar),
        queryAllNotionPages(NOTION_GAME_DATABASES.habits),
        queryAllNotionPages(NOTION_GAME_DATABASES.goals),
        queryAllNotionPages(NOTION_GAME_DATABASES.heroProfile),
        queryAllNotionPages(NOTION_GAME_DATABASES.activeQuests)
      ]);
      const successes = [tasks, habits, goals, profile, activeQuests].filter((result) => result.status === 'fulfilled').length;
      if (!successes) throw new Error(tasks.reason?.message || 'Không đọc được cơ sở dữ liệu Notion.');
      this.notionLiveKinds = new Set([
        ...(tasks.status === 'fulfilled' ? ['masterCalendar'] : []),
        ...(habits.status === 'fulfilled' ? ['habits'] : []),
        ...(goals.status === 'fulfilled' ? ['goals'] : []),
        ...(profile.status === 'fulfilled' ? ['heroProfile'] : []),
        ...(activeQuests.status === 'fulfilled' ? ['activeQuests'] : [])
      ]);
      if (tasks.status === 'fulfilled') this.notionTasks = tasks.value.map((page) => normalizeNotionPage(page, 'masterCalendar'));
      if (habits.status === 'fulfilled') this.notionHabits = habits.value.map((page) => normalizeNotionPage(page, 'habits'));
      if (goals.status === 'fulfilled') this.notionGoals = goals.value.map((page) => normalizeNotionPage(page, 'goals'));
      if (activeQuests.status === 'fulfilled') this.notionActiveQuests = activeQuests.value.map((page) => normalizeNotionPage(page, 'activeQuests'));
      if (profile.status === 'fulfilled' && profile.value[0]) {
        this.notionHeroProfile = normalizeNotionCatalogPage(profile.value[0]);
        if (!localStorage.getItem('spidey_notion_authoritative_reset_v1')) {
          // One-time migration requested by the owner: discard demo combat progress.
          localStorage.removeItem('spidey_notion_profile_pending');
          this.engine.resetSave();
          const hero = this.engine.state.progression;
          const source = this.notionHeroProfile;
          hero.level = Number(source.Level) || 1;
          hero.xp = Number(source.Exp) || 0;
          hero.totalXp = Number(source.Exp) || 0;
          hero.coins = Number(source.Gold) || 0;
          hero.hp = Number(source.HP) || 0;
          hero.maxHp = Number(source['Max HP']) || this.engine.data.hero.maxHp;
          hero.webEnergy = Math.round((Number(source.Energy) || 0) / (Number(source['Max Energy']) || 10) * this.engine.data.hero.maxWebEnergy);
          this.engine.commit({ notionProfileImported: true });
          localStorage.setItem('spidey_notion_authoritative_reset_v1', new Date().toISOString());
        } else {
            // Changes made directly in Notion (or on another device) are authoritative.
            const hero = this.engine.state.progression;
            const source = this.notionHeroProfile;
            hero.level = Number(source.Level) || 1;
            hero.totalXp = Number(source.Exp) || 0;
            hero.xpToNext = 100;
            let previousLevelsXp = 0;
            for (let level = 1; level < hero.level; level += 1) {
              previousLevelsXp += hero.xpToNext;
              hero.xpToNext = Math.round(hero.xpToNext * 1.28);
            }
            hero.xp = Math.max(0, Math.min(hero.xpToNext - 1, hero.totalXp - previousLevelsXp));
            hero.coins = Number(source.Gold) || 0;
            hero.hp = Number(source.HP) || 0;
            hero.webEnergy = Math.round((Number(source.Energy) || 0) / (Number(source['Max Energy']) || 10) * this.engine.data.hero.maxWebEnergy);
            this.engine.commit({ notionProfileImported: true });
        }
        this.engine.state.progression.maxHp = Number(this.notionHeroProfile['Max HP']) || this.engine.data.hero.maxHp;
      }
      for (const write of readPendingNotionWrites()) {
        const list = write.kind === 'habits' ? this.notionHabits : write.kind === 'activeQuests' ? this.notionActiveQuests : this.notionTasks;
        const record = list.find((item) => item.id === write.id);
        if (record) { record.done = true; if (write.kind === 'habits') record.today = true; }
      }

      this.notionSyncedAt = new Date().toISOString();
      this.notionSource = successes === 5 ? 'live' : 'mixed';
      this.notionError = successes === 5 ? '' : `Chỉ đọc được ${successes}/5 nguồn. Các mục chưa cập nhật đang ở chế độ chỉ xem.`;
      this.persistNotionCache();
      this.render();
      if (!quiet) { this.sound.playVictoryCue(); this.toast(`NOTION ĐÃ CẬP NHẬT ${successes}/5 DATABASE // ${this.notionTasks.length} TASKS, ${this.notionHabits.length} HABITS`); }
      void this.syncHeroCatalog();
    } catch (err) {
      console.warn('[ActionRpgController] Notion sync error:', err);
      this.notionLiveKinds.clear();
      this.notionError = `Không đồng bộ được: ${err.message}. Dữ liệu đã lưu chỉ để xem.`;
      if (/403|401/.test(err.message)) this.notionConnection = 'locked';
      if (/503/.test(err.message)) this.notionConnection = 'unconfigured';
      if (!quiet) this.toast('CHƯA KẾT NỐI NOTION // ĐANG DÙNG DỮ LIỆU ĐÃ LƯU');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '↻ ĐỒNG BỘ NOTION';
      }
      this.renderPanel();
    }
  }

  async syncHeroCatalog() {
    if (this.catalogSyncPromise) return this.catalogSyncPromise;
    this.catalogSyncPromise = this.loadHeroCatalog();
    try { return await this.catalogSyncPromise; }
    finally { this.catalogSyncPromise = null; }
  }

  async loadHeroCatalog() {
    const sources = [
      ['notionEnemies', NOTION_GAME_DATABASES.enemies],
      ['notionArenaMaps', NOTION_GAME_DATABASES.arenaMaps],
      ['notionBadges', NOTION_GAME_DATABASES.badges],
      ['notionSuits', NOTION_GAME_DATABASES.suits],
      ['notionGadgets', NOTION_GAME_DATABASES.gadgets],
      ['notionCombatSkills', NOTION_GAME_DATABASES.combatSkills],
      ['notionSpiderVerse', NOTION_GAME_DATABASES.spiderVerse],
      ['notionWorkoutPlans', NOTION_GAME_DATABASES.workoutPlans],
      ['notionExerciseLogs', NOTION_GAME_DATABASES.exerciseLogs],
      ['notionCardioLogs', NOTION_GAME_DATABASES.cardioLogs],
      ['notionSportLogs', NOTION_GAME_DATABASES.sportLogs],
      ['notionTimeLogs', NOTION_GAME_DATABASES.timeTracking],
      ['notionJournalEntries', NOTION_GAME_DATABASES.journal]
    ];
    for (const [key, database] of sources) {
      try {
        this[key] = (await queryAllNotionPages(database)).map(normalizeNotionCatalogPage);
        if (key === 'notionArenaMaps') {
          const linked = this.notionHeroProfile?.['Current Map']?.[0];
          if (linked && this.notionArenaMaps.some((map) => map.id === linked)) {
            this.selectedArenaMapId = linked;
            localStorage.setItem('spidey_arena_map', linked);
          }
          this.applyArenaMap();
        }
        if (key === 'notionSuits') this.suits = this[key].map((item) => ({
          id: item.id, Suit: item.Suit, Owner: item.Owner || 'Spider-Man',
          ImageUrl: this.catalogImage(item) || './assets/spideytracker/tracker_logo3.png',
          GameEffect: item['Game Effect'] || '', LevelReq: item['Level Req'] || 1,
          HPBonus: item['HP Bonus'], DEFBonus: item['DEF Bonus'], EnergyBonus: item['Energy Bonus'],
          Status: item.Status
        }));
        if (key === 'notionSpiderVerse') this.spiderVerse = this[key].map((item) => ({ id: item.id, Name: item.Spider, Quote: item.Quote, ImageUrl: item.Image, Tier: item.Tier }));
        if (key === 'notionBadges') {
          const badge = this.notionBadges.find((item) => item.Equipped && this.catalogImage(item)) || this.notionBadges.find((item) => item.Unlocked && this.catalogImage(item)) || this.notionBadges.find((item) => this.catalogImage(item));
          const mask = document.querySelector('.hud-mask');
          if (badge && mask) mask.innerHTML = `<img src="${this.escapeHtml(this.catalogImage(badge))}" alt="${this.escapeHtml(badge.Medal || 'Hero badge')}">`;
        }
        if (key === 'notionEnemies') this.render();
      }
      catch (error) { console.warn(`[ActionRpgController] ${key} sync failed`, error); }
      if (['HERO', 'FIELD'].includes(this.panelSection) && !document.getElementById('game-panel-backdrop')?.hasAttribute('hidden')) this.renderPanel();
    }
    this.render();
  }

  async patchNotionPage(pageId, properties) {
    if (this.notionConnection !== 'connected') throw new Error('Kết nối Notion trước khi lưu.');
    const response = await fetch(`/api/notion?path=${encodeURIComponent(`/v1/pages/${pageId}`)}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ properties })
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || `Notion HTTP ${response.status}`);
    return payload.data;
  }

  async createNotionPage(databaseId, properties, children = []) {
    if (this.notionConnection !== 'connected') throw new Error('Kết nối Notion trước khi lưu.');
    const response = await fetch(`/api/notion?path=${encodeURIComponent('/v1/pages')}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parent: { database_id: databaseId }, properties, ...(children.length ? { children } : {}) })
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || `Notion HTTP ${response.status}`);
    return payload.data;
  }

  queueHeroProfileSync() {
    if (this.notionPresenter) return;
    if (!this.notionHeroProfile?.id) return;
    const hero = this.engine.snapshot().hero;
    const maxEnergy = Number(this.notionHeroProfile['Max Energy']) || 10;
    const properties = {
      HP: { number: Math.max(0, Math.min(Number(this.notionHeroProfile['Max HP']) || 100, Math.round(hero.hp))) },
      Energy: { number: Math.max(0, Math.min(maxEnergy, Math.round(hero.webEnergy / this.engine.data.hero.maxWebEnergy * maxEnergy))) },
      Exp: { number: Math.max(0, Number(hero.totalXp) || 0) },
      Gold: { number: Math.max(0, Number(hero.coins) || 0) }
    };
    this.notionHeroProfile.HP = properties.HP.number;
    this.notionHeroProfile.Energy = properties.Energy.number;
    this.notionHeroProfile.Exp = properties.Exp.number;
    this.notionHeroProfile.Gold = properties.Gold.number;
    localStorage.setItem('spidey_notion_profile_pending', JSON.stringify(properties));
    void this.flushHeroProfileSync();
  }

  async flushHeroProfileSync() {
    if (this.notionPresenter) return;
    if (this.profileSyncInFlight || !this.notionHeroProfile?.id) return;
    const serialized = localStorage.getItem('spidey_notion_profile_pending');
    if (!serialized) return;
    this.profileSyncInFlight = true;
    try {
      await this.patchNotionPage(this.notionHeroProfile.id, JSON.parse(serialized));
      Object.entries(JSON.parse(serialized)).forEach(([key, value]) => { this.notionHeroProfile[key] = value.number; });
      if (localStorage.getItem('spidey_notion_profile_pending') === serialized) localStorage.removeItem('spidey_notion_profile_pending');
    } catch (error) { console.warn('[ActionRpgController] Hero Profile pending Notion sync', error); }
    finally {
      this.profileSyncInFlight = false;
      if (localStorage.getItem('spidey_notion_profile_pending') && localStorage.getItem('spidey_notion_profile_pending') !== serialized) void this.flushHeroProfileSync();
    }
  }

  realWorldDirectionsLink(task) {
    const saved = task.sourceUrl && this.placeRepo?.getAll().find(entry => entry.notionPageUrl === task.sourceUrl);
    const place = saved || task;
    const destination = Number.isFinite(place.lat) && Number.isFinite(place.lng) ? `${place.lat},${place.lng}` : place.address;
    if (!destination) return '';
    const url = new URL('https://www.google.com/maps/dir/');
    url.search = new URLSearchParams({api:'1',destination});
    return `<a class="pixel-action-btn" href="${this.escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">CHỈ ĐƯỜNG ↗</a>`;
  }

  bindEvents(content) {
    bindFieldApps(this, content);
    this.notionPresenter?.loadout?.bind(content);
    content.querySelector('[data-open-quests]')?.addEventListener('click', () => this.selectSection('QUESTS'));
    content.querySelectorAll('[data-open-hero-maps]').forEach((button) => button.addEventListener('click', () => {
      this.panelTab = 'MAPS';
      this.renderPanel({ resetScroll: true });
      this.updateRoute();
    }));
    content.querySelectorAll('[data-select-arena-map]').forEach((button) => button.addEventListener('click', async () => {
      button.disabled = true;
      await this.selectArenaMap(button.dataset.selectArenaMap);
      if (button.isConnected) button.disabled = false;
    }));
    content.querySelectorAll('[data-open-map-system]').forEach((button) => button.addEventListener('click', () => {
      this.sound.playSelect();
      this.selectSection('CITY', false);
    }));

    content.querySelectorAll('[data-open-system-section]').forEach((button) => {
      button.addEventListener('click', () => {
        this.sound.playSelect();
        this.panelSection = button.dataset.openSystemSection;
        this.panelTab = button.dataset.openSystemTab || this.defaultTab(this.panelSection);
        document.body.dataset.gameSection = this.panelSection;
        this.renderPanel({ resetScroll: true });
        this.updateRoute();
      });
    });

    // 0. Live Notion Sync Button
    content.querySelectorAll('#btn-sync-notion-live').forEach((btn) => {
      btn.addEventListener('click', () => this.syncLiveFromNotion(btn));
    });
    content.querySelector('#btn-recheck-notion')?.addEventListener('click', () => this.checkNotionSession());
    content.querySelector('#notion-auth-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const accessCode = form.elements.namedItem('accessCode')?.value || '';
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      try {
        const response = await fetch('/api/notion-session', {
          method: 'POST', credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessCode })
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) throw new Error(payload.error || `Kết nối HTTP ${response.status}`);
        this.notionConnection = 'connected';
        this.notionError = '';
        await this.syncLiveFromNotion();
      } catch (error) {
        this.notionError = error.message;
        this.toast('CHƯA KẾT NỐI ĐƯỢC NOTION');
      } finally {
        form.reset();
        this.renderPanel();
      }
    });
    content.querySelector('#btn-disconnect-notion')?.addEventListener('click', async () => {
      await fetch('/api/notion-session', { method: 'DELETE', credentials: 'same-origin' }).catch(() => {});
      this.notionConnection = 'locked';
      this.notionLiveKinds.clear();
      this.notionHeroProfile = null;
      this.notionActiveQuests = [];
      for (const key of ['spidey_notion_tasks', 'spidey_notion_habits', 'spidey_notion_goals', 'spidey_notion_active_quests', 'spidey_notion_cached_at', 'spidey_notion_cache_source', 'spidey_notion_source_at']) localStorage.removeItem(key);
      try {
        const response = await fetch('./data/notion-snapshot.json', { cache: 'no-store' });
        const snapshot = await response.json();
        this.notionTasks = snapshot.collections?.masterCalendar || [];
        this.notionHabits = snapshot.collections?.habits || [];
        this.notionGoals = snapshot.collections?.goals || [];
        this.notionSyncedAt = snapshot.metadata?.syncedAt || null;
      } catch { this.notionTasks = []; this.notionHabits = []; this.notionGoals = []; this.notionSyncedAt = null; }
      this.notionSource = 'snapshot';
      this.notionError = 'Đã ngắt kết nối. Dữ liệu bản chụp chỉ để xem.';
      this.render();
    });
    content.querySelector('#btn-send-pending-notion')?.addEventListener('click', async () => {
      const pending = readPendingNotionWrites().length + (localStorage.getItem('spidey_notion_profile_pending') ? 1 : 0);
      if (!pending || !window.confirm(`Gửi ${pending} thay đổi đang chờ lên Notion?`)) return;
      await flushPendingNotionWrites();
      await this.flushHeroProfileSync();
      const remaining = readPendingNotionWrites().length + (localStorage.getItem('spidey_notion_profile_pending') ? 1 : 0);
      this.toast(remaining ? `CÒN ${remaining} THAY ĐỔI CHƯA GỬI` : 'ĐÃ GỬI THAY ĐỔI LÊN NOTION');
      await this.syncLiveFromNotion(null, { quiet: true });
    });

    content.querySelectorAll('[data-habit-filter]').forEach((button) => button.addEventListener('click', () => {
      content.querySelectorAll('[data-habit-filter]').forEach((item) => item.classList.toggle('active', item === button));
      const filter = button.dataset.habitFilter;
      content.querySelectorAll('[data-habit-state]').forEach((card) => { card.hidden = filter !== 'all' && card.dataset.habitState !== filter; });
    }));

    // 1. Task Completion -> Attack Enemy in Arena & Sync to Notion
    content.querySelectorAll('[data-complete-task]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.canUseData('masterCalendar')) return;
        const idx = parseInt(btn.dataset.completeTask, 10);
        const task = this.notionTasks[idx];
        if (!task || task.done) return;

        const live = this.canWriteNotion('masterCalendar') && !task.localOnly;
        task.done = true;
        if (!live) { task.localDoneOn = this.todayKey(); this.saveLocalData(); }
        else this.persistNotionCache();
        this.sound.playVictoryCue();

        const rewardId = !live && /daily/i.test(`${task.type || ''} ${task.frequency || ''}`) ? `${task.id}:${this.todayKey()}` : task.id;
        const result = this.engine.completeRealQuest({ id: rewardId, title: task.title || task.name, type: live ? 'NOTION_MISSION' : 'WORK', status: 'DONE', source: live ? 'NOTION' : 'LOCAL', xp: task.gameXp });
        if (result && live) this.queueHeroProfileSync();
        this.toast(live ? 'ĐÃ GHI NHẬN TRÊN MÁY // ĐANG GỬI NOTION' : 'QUEST ĐÃ LƯU TRÊN THIẾT BỊ');

        // Persist the local completion and retry the Notion write on the next sync.
        if (live && task.id) {
          queueNotionWrite('masterCalendar', task.id);
          void flushPendingNotionWrites().then((remaining) => { this.toast(remaining ? 'QUEST ĐANG CHỜ GỬI NOTION' : 'QUEST ĐÃ ĐỒNG BỘ NOTION'); this.renderPanel(); });
        }

        this.renderPanel();
      });
    });

    content.querySelectorAll('[data-complete-active-quest]').forEach((btn) => btn.addEventListener('click', () => {
      if (!this.canUseData('activeQuests')) return;
      const quest = this.notionActiveQuests[Number(btn.dataset.completeActiveQuest)];
      if (!quest || quest.done) return;
      const live = this.canWriteNotion('activeQuests') && !quest.localOnly;
      quest.done = true;
      if (live) queueNotionWrite('activeQuests', quest.id);
      else quest.localDoneOn = this.todayKey();
      const rewardId = !live && /daily/i.test(quest.frequency || '') ? `${quest.id}:${this.todayKey()}` : quest.id;
      this.engine.completeRealQuest({ id: rewardId, title: quest.title, type: live ? 'NOTION_MISSION' : 'WORK', status: 'DONE', source: live ? 'NOTION' : 'LOCAL', xp: quest.xp });
      if (live) this.queueHeroProfileSync();
      if (live) this.persistNotionCache(); else this.saveLocalData();
      this.toast(live ? 'ACTIVE QUEST // ĐÃ GHI NHẬN TRÊN MÁY' : 'ACTIVE QUEST ĐÃ LƯU TRÊN THIẾT BỊ');
      this.renderPanel();
      if (live) void flushPendingNotionWrites().then((remaining) => { this.toast(remaining ? 'QUEST ĐANG CHỜ GỬI NOTION' : 'QUEST ĐÃ ĐỒNG BỘ NOTION'); this.renderPanel(); });
    }));

    content.querySelectorAll('[data-complete-goal]').forEach((btn) => btn.addEventListener('click', async () => {
      if (!this.canUseData('goals')) return;
      const goal = this.notionGoals[Number(btn.dataset.completeGoal)];
      if (!goal?.id || goal.achieved) return;
      if (!this.canWriteNotion('goals') || goal.localOnly) {
        goal.achieved = true;
        this.saveLocalData();
        this.toast('GOAL ĐÃ LƯU TRÊN THIẾT BỊ');
        this.renderPanel();
        return;
      }
      btn.disabled = true;
      btn.textContent = 'ĐANG LƯU...';
      try {
        await this.patchNotionPage(goal.id, { 'Achieved/Competive': { checkbox: true } });
        goal.achieved = true;
        this.persistNotionCache();
        this.toast('GOAL // ĐÃ CẬP NHẬT NOTION');
      } catch (error) { this.toast(`CHƯA CẬP NHẬT: ${error.message}`); }
      this.renderPanel();
    }));

    // 2. Open map overlay for located tasks
    content.querySelectorAll('[data-open-task-map]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const task = this.notionTasks[Number(btn.dataset.openTaskMap)];
        this.closePanel();
        this.selectSection('CITY');
        if (task) this.bus.emit('MAP_PLAN_MISSION', { title:task.title || task.name, address:task.address || '', lat:task.lat, lng:task.lng, sourceUrl:task.sourceUrl || '' });
      });
    });

    // 3. Habit Check-in -> Restore HP & Web + Sync
    content.querySelectorAll('[data-checkin-habit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.canUseData('habits')) return;
        const idx = parseInt(btn.dataset.checkinHabit, 10);
        const habit = this.notionHabits[idx];
        if (!habit || habit.done || habit.today) return;

        const live = this.canWriteNotion('habits') && !habit.localOnly;
        habit.done = true;
        habit.today = true;
        if (!live) { habit.localDoneOn = this.todayKey(); this.saveLocalData(); }
        else this.persistNotionCache();
        this.sound.playSelect();

        this.engine.recordHabitCheckin(habit.id);
        if (live) this.queueHeroProfileSync();
        this.toast(live ? 'HABIT ĐÃ GHI NHẬN TRÊN MÁY // ĐANG GỬI NOTION' : 'HABIT ĐÃ LƯU TRÊN THIẾT BỊ');

        // Persist the local check-in and retry the Notion write on the next sync.
        if (live && habit.id) {
          queueNotionWrite('habits', habit.id);
          void flushPendingNotionWrites().then((remaining) => { this.toast(remaining ? 'HABIT ĐANG CHỜ GỬI NOTION' : 'HABIT ĐÃ ĐỒNG BỘ NOTION'); this.renderPanel(); });
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
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.equipSuit, 10);
        const suit = this.suits[idx];
        if (!suit?.id || !this.notionHeroProfile?.id) return;
        btn.disabled = true;
        btn.textContent = 'ĐANG TRANG BỊ...';
        try {
          await this.patchNotionPage(this.notionHeroProfile.id, { 'Equipped Suit': { relation: [{ id: suit.id }] } });
          this.notionHeroProfile['Equipped Suit'] = [suit.id];
          this.equippedSuitIndex = idx;
          this.sound.playVictoryCue();
          this.toast(`SUIT EQUIPPED // ${suit.Suit.toUpperCase()}`);
        } catch (error) { this.toast(`CHƯA TRANG BỊ: ${error.message}`); }
        this.renderPanel();
      });
    });

    // 6. Equip Skill
    content.querySelectorAll('[data-equip-skill]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const profile = this.notionHeroProfile;
        const skillId = btn.dataset.equipSkill;
        if (!profile?.id || !this.notionCombatSkills.some((item) => item.id === skillId)) return;
        const slot = [1, 2, 3, 4].find((number) => !profile[`Skill Slot ${number}`]?.length);
        if (!slot) { this.toast('CẢ 4 Ô SKILL ĐÃ ĐẦY'); return; }
        btn.disabled = true;
        try {
          await this.patchNotionPage(profile.id, { [`Skill Slot ${slot}`]: { relation: [{ id: skillId }] } });
          profile[`Skill Slot ${slot}`] = [skillId];
          this.sound.playVictoryCue();
          this.toast(`SKILL SLOT ${slot} // ĐÃ LƯU NOTION`);
        } catch (error) { this.toast(`CHƯA TRANG BỊ: ${error.message}`); }
        this.renderPanel();
      });
    });

    content.querySelectorAll('[data-equip-gadget]').forEach((btn) => btn.addEventListener('click', async () => {
      const profile = this.notionHeroProfile;
      const gadgetId = btn.dataset.equipGadget;
      if (!profile?.id) return;
      const current = profile['Equipped Gadgets'] || [];
      const next = current.includes(gadgetId) ? current.filter((id) => id !== gadgetId) : [...current, gadgetId];
      if (next.length > 2) { this.toast('TỐI ĐA 2 GADGET'); return; }
      btn.disabled = true;
      try {
        await this.patchNotionPage(profile.id, { 'Equipped Gadgets': { relation: next.map((id) => ({ id })) } });
        profile['Equipped Gadgets'] = next;
        this.toast('GADGET LOADOUT // ĐÃ LƯU NOTION');
      } catch (error) { this.toast(`CHƯA TRANG BỊ: ${error.message}`); }
      this.renderPanel();
    }));

    content.querySelectorAll('[data-equip-companion]').forEach((btn) => btn.addEventListener('click', async () => {
      const profile = this.notionHeroProfile;
      if (!profile?.id) return;
      const companionId = btn.dataset.equipCompanion;
      btn.disabled = true;
      try {
        await this.patchNotionPage(profile.id, { Companion: { relation: [{ id: companionId }] } });
        profile.Companion = [companionId];
        this.toast('COMPANION // ĐÃ LƯU NOTION');
      } catch (error) { this.toast(`CHƯA CHỌN COMPANION: ${error.message}`); }
      this.renderPanel();
    }));

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

    content.querySelector('[data-focus-toggle]')?.addEventListener('click', () => {
      if (this.focusSession.running) {
        this.focusSession.elapsedMs = this.focusElapsedMs();
        this.focusSession.startedAt = null;
        this.focusSession.running = false;
      } else {
        this.focusSession.firstStartedAt ||= new Date().toISOString();
        this.focusSession.startedAt = Date.now();
        this.focusSession.running = true;
      }
      this.persistFocusSession();
      this.sound.playSelect();
      this.renderPanel();
    });
    content.querySelector('[data-focus-reset]')?.addEventListener('click', () => {
      this.focusSession = { startedAt: null, elapsedMs: 0, running: false, firstStartedAt: null };
      this.persistFocusSession();
      this.renderPanel();
    });
    content.querySelector('[data-focus-save]')?.addEventListener('click', async (event) => {
      const button = event.currentTarget;
      if (this.focusElapsedMs() < 1000) return;
      button.disabled = true;
      button.textContent = 'ĐANG LƯU...';
      try {
        const title = `Focus: ${this.notionActiveQuests.find((quest) => !quest.done)?.title || 'Daily patrol'}`;
        const page = await this.createNotionPage(NOTION_GAME_DATABASES.timeTracking, {
          Name: { title: [{ text: { content: title } }] },
          Start: { date: { start: this.focusSession.firstStartedAt || new Date().toISOString() } },
          End: { date: { start: new Date().toISOString() } }
        });
        this.notionTimeLogs.unshift(normalizeNotionCatalogPage(page));
        this.focusSession = { startedAt: null, elapsedMs: 0, running: false, firstStartedAt: null };
        this.persistFocusSession();
        this.toast('FOCUS SESSION // ĐÃ LƯU NOTION');
      } catch (error) { this.toast(`CHƯA LƯU PHIÊN: ${error.message}`); }
      this.renderPanel();
    });

    // Journal entries are created in Notion; the form stays visible on failure.
    const btnSaveJournal = content.querySelector('#btn-save-journal');
    if (btnSaveJournal) {
      btnSaveJournal.addEventListener('click', async () => {
        const grateful = content.querySelector('#journal-input-grateful')?.value?.trim();
        const lesson = content.querySelector('#journal-input-lesson')?.value?.trim();
        const win = content.querySelector('#journal-input-win')?.value?.trim();

        if (!grateful && !lesson && !win) {
          this.toast('VUI LÒNG ĐIỀN NỘI DUNG NHẬT KÝ');
          return;
        }

        btnSaveJournal.disabled = true;
        btnSaveJournal.textContent = 'ĐANG LƯU...';
        try {
          const paragraph = (label, value) => ({ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: `${label}: ${value || '—'}` } }] } });
          const page = await this.createNotionPage(NOTION_GAME_DATABASES.journal, {
            "today's mood": { title: [{ text: { content: win || 'Peter Parker field notes' } }] },
            Date: { date: { start: new Date().toISOString() } }
          }, [paragraph('Biết ơn', grateful), paragraph('Bài học', lesson), paragraph('Chiến công', win)]);
          this.notionJournalEntries.unshift(normalizeNotionCatalogPage(page));
          this.sound.playVictoryCue();
          this.toast('FIELD NOTES // ĐÃ LƯU NOTION');
          this.renderPanel();
        } catch (error) {
          btnSaveJournal.disabled = false;
          btnSaveJournal.textContent = 'LƯU VÀO NOTION';
          this.toast(`CHƯA LƯU NHẬT KÝ: ${error.message}`);
        }
      });
    }

    content.querySelector('#quest-create-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!this.canUseData('masterCalendar')) return;
      const form = event.currentTarget;
      const title = form.elements.namedItem('title')?.value?.trim();
      const date = form.elements.namedItem('date')?.value;
      if (!title) return;
      if (!this.canWriteNotion('masterCalendar')) {
        const daily = this.panelTab === 'DAILY';
        this.notionTasks.unshift({ id: `local-task-${crypto.randomUUID()}`, title, type: this.panelTab === 'MAIN' ? 'MAIN' : daily ? 'DAILY' : 'SIDE', frequency: daily ? 'Daily' : '', date: date || this.todayKey(), gameXp: 28, done: false, localOnly: true });
        this.saveLocalData();
        this.toast('QUEST MỚI ĐÃ LƯU TRÊN THIẾT BỊ');
        this.renderPanel();
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'ĐANG TẠO...';
      try {
        const page = await this.createNotionPage(NOTION_GAME_DATABASES.masterCalendar, {
          Name: { title: [{ text: { content: title } }] },
          Done: { checkbox: false },
          'Game Enabled': { checkbox: true },
          'Game XP': { number: 28 },
          ...(date ? { Date: { date: { start: date } } } : {})
        });
        this.notionTasks.unshift(normalizeNotionPage(page, 'masterCalendar'));
        this.persistNotionCache();
        this.toast('QUEST MỚI // ĐÃ LƯU NOTION');
        this.renderPanel();
      } catch (error) {
        button.disabled = false;
        button.textContent = '+ TẠO QUEST';
        this.toast(`CHƯA TẠO QUEST: ${error.message}`);
      }
    });

    content.querySelector('#habit-create-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!this.canUseData('habits')) return;
      const form = event.currentTarget;
      const title = form.elements.namedItem('title')?.value?.trim();
      const type = form.elements.namedItem('type')?.value || 'Good Habit';
      if (!title) return;
      if (!this.canWriteNotion('habits')) {
        this.notionHabits.unshift({ id: `local-habit-${crypto.randomUUID()}`, name: title, title, category: type, done: false, today: false, xp: 1, gameEnabled: true, localOnly: true });
        this.saveLocalData();
        this.toast('HABIT MỚI ĐÃ LƯU TRÊN THIẾT BỊ');
        this.renderPanel();
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'ĐANG TẠO...';
      try {
        const page = await this.createNotionPage(NOTION_GAME_DATABASES.habits, {
          Name: { title: [{ text: { content: title } }] },
          Type: { select: { name: type } },
          Status: { status: { name: 'In Progress' } },
          Today: { checkbox: false },
          'Game Enabled': { checkbox: true }
        });
        this.notionHabits.unshift(normalizeNotionPage(page, 'habits'));
        this.persistNotionCache();
        this.toast('HABIT MỚI // ĐÃ LƯU NOTION');
        this.renderPanel();
      } catch (error) {
        button.disabled = false;
        button.textContent = '+ TẠO HABIT';
        this.toast(`CHƯA TẠO HABIT: ${error.message}`);
      }
    });

    content.querySelector('#goal-create-form')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!this.canUseData('goals')) return;
      const form = event.currentTarget;
      const title = form.elements.namedItem('title')?.value?.trim();
      const deadline = form.elements.namedItem('deadline')?.value;
      if (!title) return;
      if (!this.canWriteNotion('goals')) {
        this.notionGoals.unshift({ id: `local-goal-${crypto.randomUUID()}`, title, date: deadline || null, achieved: false, status: 'Local', localOnly: true });
        this.saveLocalData();
        this.toast('GOAL MỚI ĐÃ LƯU TRÊN THIẾT BỊ');
        this.renderPanel();
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'ĐANG TẠO...';
      try {
        const page = await this.createNotionPage(NOTION_GAME_DATABASES.goals, {
          Name: { title: [{ text: { content: title } }] },
          'Achieved/Competive': { checkbox: false },
          ...(deadline ? { Deadline: { date: { start: deadline } } } : {})
        });
        this.notionGoals.unshift(normalizeNotionPage(page, 'goals'));
        this.persistNotionCache();
        this.toast('GOAL MỚI // ĐÃ LƯU NOTION');
        this.renderPanel();
      } catch (error) {
        button.disabled = false;
        button.textContent = '+ TẠO GOAL';
        this.toast(`CHƯA TẠO GOAL: ${error.message}`);
      }
    });

    // 9. Bind Settings
    this.bindSettings(content);
  }

  bindSettings(content) {
    content.querySelectorAll('[data-sound-preview]').forEach(button=>button.addEventListener('click',async()=>{
      const output=content.querySelector('[data-sound-status]');
      const played=await this.sound.playSample(button.dataset.soundPreview);
      if(output)output.textContent=played?'Đang phát: '+button.textContent:'Bật âm thanh trước khi nghe thử. Nếu vẫn im lặng, hãy thử lại.';
    }));
    content.querySelector('[data-sound-stop]')?.addEventListener('click',()=>{this.sound.stopSamples();const output=content.querySelector('[data-sound-status]');if(output)output.textContent='Đã dừng âm thanh.';});
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
      const payload = JSON.parse(this.engine.exportSave());
      payload.spideyLocalData = {
        tasks: this.notionTasks,
        habits: this.notionHabits,
        goals: this.notionGoals,
        activeQuests: this.notionActiveQuests,
        source: this.notionSource,
        savedAt: this.notionSyncedAt
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); link.download = `spidey-life-save-${Date.now()}.json`; link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    });
    content.querySelector('[data-save-import]')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const payload = JSON.parse(await file.text());
        const localData = payload.spideyLocalData;
        delete payload.spideyLocalData;
        this.engine.importSave(JSON.stringify(payload));
        if (localData && ['tasks', 'habits', 'goals', 'activeQuests'].every((key) => Array.isArray(localData[key]))) {
          this.notionTasks = localData.tasks;
          this.notionHabits = localData.habits;
          this.notionGoals = localData.goals;
          this.notionActiveQuests = localData.activeQuests;
          this.saveLocalData();
        }
        this.toast('SAVE IMPORTED');
        this.render();
      }
      catch (error) { this.toast(`IMPORT FAILED // ${error.message}`); }
    });
    content.querySelector('[data-save-reset]')?.addEventListener('click', () => {
      if (window.confirm('Reset action-RPG progression? Map missions will be preserved.')) { this.engine.resetSave(); this.toast('GAME SAVE RESET'); }
    });
  }

  syncAutoCombat(settings) {
    window.clearInterval(this.autoTimer);
    this.autoTimer = null;
    if (this.notionPresenter) return;
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
    toast.setAttribute('role', 'status');
    toast.textContent = message; 
    host?.appendChild(toast); 
    setTimeout(() => toast.remove(), 1200);
  }

  text(id, value) { const el = document.getElementById(id); if (el) el.textContent = String(value); }
  width(id, value) { const el = document.getElementById(id); if (el) el.style.width = `${Math.max(0,Math.min(100,value))}%`; }
}
import { FIELD_APPS, renderFieldApp, bindFieldApps } from './FieldApps.js?v=gambit-native-1';
