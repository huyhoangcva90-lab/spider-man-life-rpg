import { dateKey, rollDailyState, questBucket, selectQuests, campaignDays } from './personal-progress.mjs';

/**
 * 66 日間 (LIFE RESET) & HELLO HABIT REPORTS ENGINE - 100% REPLICA
 * Accurately matching all 4 user screenshots:
 * - Image 1 & 2: Anime habit cards with square check [✓], flame pills, day navigator
 * - Image 3: The 8 core habits 2x4 grid with "➜ Continue"
 * - Image 4: Hello Habit Reports heatmap matrix & split-color goal cards
 */

const STORAGE_KEY = 'life_reset_screenshot_v5';

const ANIME_HABITS = [
  {
    id: 'habit_run',
    title: 'Run 5km',
    subtitle: 'Morning endurance & cardiovascular conditioning',
    streak: 9,
    repeat: '3x/week',
    difficulty: 'Hard',
    stars: 4,
    currentVal: 0,
    targetVal: 5,
    unit: 'km',
    cover: 'run_bg_men_2025.webp',
    colorTheme: 'teal',
    science: 'Aerobic running increases capillary density and triggers endocannabinoid production for sustained mental clarity.'
  },
  {
    id: 'habit_pushups',
    title: '20 push-ups',
    subtitle: 'Build raw upper-body push strength & core tension',
    streak: 12,
    repeat: 'Daily',
    difficulty: 'Medium',
    stars: 3,
    currentVal: 0,
    targetVal: 20,
    unit: 'reps',
    cover: 'pushup_bg_men_2025.webp',
    colorTheme: 'red',
    science: 'Compound bodyweight resistance stimulates myofibrillar hypertrophy and consolidates discipline circuits in the motor cortex.'
  },
  {
    id: 'habit_read',
    title: 'Read 20 pages',
    subtitle: 'Expand cognitive models with non-fiction books',
    streak: 7,
    repeat: 'Daily',
    difficulty: 'Easy',
    stars: 2,
    currentVal: 8,
    targetVal: 20,
    unit: 'pages',
    cover: 'read_bg_men_2025.webp',
    colorTheme: 'coral',
    science: 'Reading 20 pages daily exposes your neural network to 1.8 million words per year, expanding linguistic plasticity.'
  },
  {
    id: 'habit_meditate',
    title: 'Meditate 5 min',
    subtitle: 'Still the monkey mind & practice metacognition',
    streak: 5,
    repeat: 'Daily',
    difficulty: 'Easy',
    stars: 2,
    currentVal: 0,
    targetVal: 5,
    unit: 'min',
    cover: 'meditate_bg_men_2025.webp',
    colorTheme: 'purple',
    science: 'Just 5 minutes of focused mindfulness dampens amygdala reactivity and builds gray matter density in the prefrontal cortex.'
  },
  {
    id: 'habit_water',
    title: 'Drink 2L water',
    subtitle: 'Stay hydrated, stay energized first thing',
    streak: 10,
    repeat: 'Everyday',
    difficulty: 'Easy',
    stars: 2,
    currentVal: 1.2,
    targetVal: 2,
    unit: 'L',
    cover: 'water_bg_men_2025.webp',
    colorTheme: 'blue',
    science: 'Hydrating first thing in the morning flushes cellular toxins and speeds up nutrient transport across the blood-brain barrier.'
  },
  {
    id: 'habit_wake',
    title: 'Wake up at 7AM',
    subtitle: 'Rise before everyone, seize the day',
    streak: 10,
    repeat: 'Everyday',
    difficulty: 'Medium',
    stars: 3,
    currentVal: 1,
    targetVal: 1,
    unit: 'done',
    cover: 'early_wake_bg.webp',
    colorTheme: 'teal',
    science: 'Anchoring your wake time sets the suprachiasmatic nucleus circadian clock, ensuring consistent nightly melatonin production.'
  },
  {
    id: 'habit_cold_shower',
    title: 'Cold shower 3 min',
    subtitle: 'Thermogenesis to spike dopamine & alertness',
    streak: 8,
    repeat: 'Daily',
    difficulty: 'Hard',
    stars: 4,
    currentVal: 0,
    targetVal: 3,
    unit: 'mins',
    cover: 'shower_bg_men_2025.webp',
    colorTheme: 'cyan',
    science: 'Deliberate cold exposure triggers a sustained 250% elevation in baseline dopamine and norepinephrine that lasts for hours.'
  },
  {
    id: 'habit_screentime',
    title: 'Dopamine Shield',
    subtitle: 'Zero screens 1 hour before sleep',
    streak: 6,
    repeat: 'Daily',
    difficulty: 'Hard',
    stars: 4,
    currentVal: 0,
    targetVal: 1,
    unit: 'hour',
    cover: 'screentime_bg_men_2025.webp',
    colorTheme: 'slate',
    science: 'Eliminating blue light before bed prevents pineal gland suppression, ensuring deep restorative stage 3 & 4 slow-wave sleep.'
  }
];

class LifeResetApp {
  constructor() {
    this.state = this.loadState();
    this.state.campaignStartedAt ||= this.todayKey();
    if (this.state.notionDay !== this.todayKey()) {
      this.state.notionDoneToday = {};
      this.state.notionDay = this.todayKey();
    }
    this.audioPool = {};
    this.activeFilter = 'todos';
    this.activeSource = 'notion-habits'; // 'anime' | 'notion-habits' | 'notion-tasks'
    this.activeQuestFilter = 'today';
    this.questSearch = '';
    this.pendingHabitIds = new Set();
    this.pendingQuestIds = new Set();
    this.activeSubview = 'tracker'; // 'tracker' or 'reports'
    this.activePeriod = 'year'; // 'week', 'month', 'year'
    this.currentYear = new Date().getFullYear();
    this.notionHabits = [];
    this.notionTasks = [];
    this.notionActiveQuests = [];
    this.notionHeroXp = null;
    this.notionLive = false;
    this.activeMeditation = null;
    this.breathingInterval = null;
    this.focusTimerInterval = null;
    this.focusSeconds = 25 * 60;
    this.activeSheetHabit = null;

    // Local goals are separate from Notion habits and start with no fabricated progress.
    this.helloTracker = this.state.helloTracker || {
      selectedDay: new Date().toDateString(),
      days: [],
      daily: {
        water: { name: 'Drink Water', cur: 0, tgt: 8, unit: 'times', streak: 0, color: 'blue', step: 1 },
        steps: { name: 'Steps', cur: 0, tgt: 10000, unit: 'steps', streak: 0, color: 'teal', step: 1000 },
        read: { name: 'Read', cur: 0, tgt: 30, unit: 'min', streak: 0, color: 'coral', step: 5 }
      },
      weekly: {
        exercise: { name: 'Exercise', cur: 0, tgt: 3, unit: 'times', streak: 0, color: 'purple', step: 1 },
        journal: { name: 'Journal', cur: 0, tgt: 500, unit: 'words', streak: 0, color: 'slate', step: 100 }
      },
      collapsedDaily: false,
      collapsedWeekly: false
    };
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      day: 1,
      totalDays: 66,
      streak: 0,
      trophies: 0,
      xp: 0,
      waterDrankLiters: 0,
      completedToday: {},
      skippedToday: {},
      habits: ANIME_HABITS.map((habit) => ({ ...habit, streak: 0, currentVal: 0 })),
      notionDoneToday: {},
      notionHistory: {}
    };
  }

  saveState() {
    try {
      this.state.helloTracker = this.helloTracker;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (_) {}
    this.renderHeaderStats();
  }

  escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  campaignDay() {
    this.state.campaignStartedAt ||= this.todayKey();
    const start = new Date(`${this.state.campaignStartedAt}T12:00:00`);
    const today = new Date(`${this.todayKey()}T12:00:00`);
    return Math.min(66, Math.max(1, Math.floor((today - start) / 86400000) + 1));
  }

  todayKey() {
    return dateKey();
  }

  recordNotionHabitDay(habit, checked) {
    this.state.notionHistory ||= {};
    const id = habit.rawId || habit.id;
    const days = new Set(this.state.notionHistory[id] || []);
    if (checked) days.add(this.todayKey()); else days.delete(this.todayKey());
    this.state.notionHistory[id] = [...days].sort();
  }

  init() {
    if (window.self !== window.top) document.body.classList.add('embedded');
    document.querySelector('.status-time')?.replaceChildren(document.createTextNode(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })));
    this.preloadAudio();
    this.setupDockTabs();
    this.setupDayNavigation();
    this.setupTodoFilterCapsules();
    this.setupNotionIntegration();
    this.setupQuestBoard();
    this.renderHeaderStats();
    this.renderHabitCards();
    this.setupHelloHabitTab();
    this.renderCore8HabitsGrid();
    this.renderPathwayGrid();
    this.setupActionSheet();
    this.setupTools();
    this.loadNotionSnapshot().then(() => this.syncNotionLive({ quiet: true }));
    const initialTab = new URLSearchParams(window.location.search).get('tab');
    const initialFilter = new URLSearchParams(window.location.search).get('filter');
    if (['today', 'overdue', 'open', 'done'].includes(initialFilter)) {
      this.activeQuestFilter = initialFilter;
      document.querySelectorAll('[data-quest-filter]').forEach(button => {
        const active = button.dataset.questFilter === initialFilter;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    if (['today', 'reports', 'quests', 'core-habits', 'tools'].includes(initialTab)) this.switchTab(initialTab);
    const refresh = () => {
      if (document.hidden) return;
      if (rollDailyState(this.state, this.notionHabits, this.todayKey())) {
        this.helloTracker.selectedDay = this.todayKey();
        this.saveState();
        this.renderHabitCards();
        this.renderHelloSquareHabits();
        this.renderWeekStrip();
        this.renderPathwayGrid();
      }
      this.syncNotionLive({ quiet: true });
    };
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('online', refresh);
    setInterval(refresh, 60000);
  }

  preloadAudio() {
    const sfx = {
      done: 'assets/audio/completed_task.mp3',
      reward: 'assets/audio/quest_reward_claim.wav',
      bell: 'assets/audio/life_reset_signature_noti.wav'
    };
    for (const [k, v] of Object.entries(sfx)) {
      const a = new Audio(v);
      a.preload = 'auto';
      this.audioPool[k] = a;
    }
  }

  playSfx(name) {
    try {
      const audio = this.audioPool[name];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } catch (_) {}
  }

  // Reference protocols are local practice; Notion owns the actual Hero state.
  notifyPracticeComplete(habitName) {
    this.showSpideyToast(habitName, 'MẪU THAM KHẢO', 'Đã lưu thao tác thử trên thiết bị.');
    this.playSfx('done');
  }

  showSpideyToast(title, xpPill, desc) {
    const toast = document.getElementById('spidey-rpg-toast');
    const tTitle = document.getElementById('toast-rpg-title');
    const tXp = document.getElementById('toast-rpg-xp');
    const tDesc = document.getElementById('toast-rpg-desc');

    if (!toast || !tTitle) return;

    tTitle.textContent = title.toUpperCase();
    if (tXp) tXp.textContent = xpPill;
    if (tDesc) tDesc.textContent = desc;

    toast.classList.add('show');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  setupDockTabs() {
    const dockBtns = document.querySelectorAll('.dock-item-btn');
    dockBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });
  }

  switchTab(targetTab) {
    const dockBtns = document.querySelectorAll('.dock-item-btn');
    dockBtns.forEach(b => {
      const active = b.dataset.tab === targetTab;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    const url = new URL(window.location.href);
    url.searchParams.set('tab', targetTab);
    history.replaceState(null, '', url);

    document.querySelectorAll('.view-tab-pane').forEach(p => p.classList.remove('active'));
    const activePane = document.getElementById(`tab-${targetTab}`);
    if (activePane) activePane.classList.add('active');

    const appContent = document.querySelector('.app-main-content');
    if (appContent) appContent.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (targetTab === 'reports') {
      this.renderReportsSubview();
    }
    if (targetTab === 'quests') this.renderQuestBoard();
  }

  setupDayNavigation() {
    const leftBtn = document.getElementById('btn-day-left');
    const rightBtn = document.getElementById('btn-day-right');
    [leftBtn, rightBtn].forEach((button) => {
      if (!button) return;
      button.disabled = true;
      button.title = 'Ngày chiến dịch tự tăng theo lịch';
    });
  }

  setupNotionIntegration() {
    const syncBtn = document.getElementById('btn-sync-notion-now');
    syncBtn?.addEventListener('click', () => {
      this.syncNotionLive();
    });

    const sourceBtns = document.querySelectorAll('.source-seg-btn');
    sourceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sourceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeSource = btn.dataset.source;
        this.renderHabitCards();
        this.playSfx('bell');
      });
    });
  }

  setupQuestBoard() {
    document.getElementById('quest-search')?.addEventListener('input', (event) => {
      this.questSearch = event.target.value;
      this.renderQuestBoard();
    });
    document.getElementById('quest-sync')?.addEventListener('click', () => this.syncNotionLive());
    document.querySelectorAll('[data-quest-filter]').forEach((button) => button.addEventListener('click', () => {
      this.activeQuestFilter = button.dataset.questFilter;
      document.querySelectorAll('[data-quest-filter]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      this.renderQuestBoard();
    }));
  }

  renderQuestBoard() {
    const list = document.getElementById('personal-quest-list');
    const summary = document.getElementById('personal-quest-summary');
    if (!list || !summary) return;
    const quests = [
      ...this.notionTasks.map((task) => ({ ...task, kind: 'masterCalendar' })),
      ...this.notionActiveQuests.map((task) => ({ ...task, kind: 'activeQuests', date: task.dueDate }))
    ];
    const open = quests.filter((quest) => !quest.done && !this.state.notionDoneToday[quest.id]);
    const today = this.todayKey();
    const filtered = selectQuests(quests, this.activeQuestFilter, this.state.notionDoneToday, today, this.questSearch);
    const overdue = open.filter(quest => questBucket(quest, today) === 'overdue').length;
    const doneCount = quests.length - open.length;
    summary.textContent = `${open.length} cần làm · ${overdue} quá hạn · ${doneCount} đã xong`;
    const meter = document.getElementById('quest-completion-meter');
    if (meter) { meter.max = Math.max(1, quests.length); meter.value = doneCount; }
    const connection = document.getElementById('quest-connection');
    if (connection) connection.textContent = this.syncing ? 'Đang đồng bộ…' : this.notionLive ? 'Đã kết nối Notion' : 'Bản lưu trên máy · chưa xác nhận đồng bộ';
    list.replaceChildren();
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'personal-quest-empty';
      empty.textContent = this.questSearch.trim() ? 'Không tìm thấy Quest phù hợp.' : this.activeQuestFilter === 'overdue' ? 'Không có Quest quá hạn.' : this.activeQuestFilter === 'today' ? 'Hôm nay chưa có quest đến hạn. Mở “Cần làm” để xem toàn bộ.' : this.activeQuestFilter === 'done' ? 'Chưa có quest nào hoàn thành.' : 'Chưa có quest trong Notion.';
      list.appendChild(empty);
      return;
    }
    filtered.forEach((quest, index) => {
      const done = !!(quest.done || this.state.notionDoneToday[quest.id]);
      const card = document.createElement('article');
      const bucket = questBucket(quest, today);
      card.className = `personal-quest-card${done ? ' is-done' : ''}${!done && bucket === 'overdue' ? ' is-overdue' : ''}`;
      card.innerHTML = `<div class="personal-quest-card-top"><span class="personal-quest-index"></span><span class="personal-quest-type"></span></div><h3></h3><p></p><div class="personal-quest-card-foot"><span class="personal-quest-date"></span><button type="button" class="personal-quest-complete"></button></div>`;
      card.querySelector('.personal-quest-index').textContent = String(index + 1).padStart(2, '0');
      card.querySelector('.personal-quest-type').textContent = quest.kind === 'activeQuests' ? 'ACTIVE QUEST' : (quest.type || 'QUEST').toUpperCase();
      card.querySelector('h3').textContent = quest.title || quest.name || 'Quest';
      const detail = quest.description || (quest.kind === 'activeQuests' ? quest.frequency : quest.priority) || '';
      card.querySelector('p').textContent = detail;
      card.querySelector('.personal-quest-date').textContent = `${bucket === 'overdue' && !done ? 'QUÁ HẠN · ' : bucket === 'today' ? 'HÔM NAY · ' : ''}${quest.date ? String(quest.date).slice(0, 10) : 'Không đặt hạn'}`;
      const button = card.querySelector('button');
      button.textContent = done ? '✓ Đã xong' : '✓ Hoàn thành';
      button.disabled = done || this.syncing || this.pendingQuestIds.has(quest.id);
      button.setAttribute('aria-label', `${done ? 'Đã xong' : 'Hoàn thành'} ${quest.title || quest.name || 'Quest'}`);
      button.addEventListener('click', () => this.completeNotionQuest(quest, button));
      list.appendChild(card);
    });
  }

  async completeNotionQuest(quest, button) {
    if (quest.done || this.state.notionDoneToday[quest.id] || this.pendingQuestIds.has(quest.id) || this.syncing) return;
    this.pendingQuestIds.add(quest.id);
    button.disabled = true;
    button.textContent = 'Đang lưu…';
    try {
      const property = quest.kind === 'activeQuests' ? 'Completed' : 'Done';
      const pageId = String(quest.rawId || quest.id).replace(/-/g, '');
      const response = await fetch(`/api/notion?path=${encodeURIComponent(`/v1/pages/${pageId}`)}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: { [property]: { checkbox: true } } })
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || `HTTP ${response.status}`);
      quest.done = true;
      const original = (quest.kind === 'activeQuests' ? this.notionActiveQuests : this.notionTasks).find((item) => item.id === quest.id);
      if (original) original.done = true;
      this.state.notionDoneToday[quest.id] = true;
      this.cacheNotionData();
      this.saveState();
      this.renderQuestBoard();
      this.renderHabitCards();
      window.parent?.postMessage({ type: 'SPIDEY_NOTION_CHECKIN', kind: quest.kind, id: quest.rawId || quest.id }, window.location.origin);
      this.showSpideyToast('QUEST HOÀN THÀNH', '✓ NOTION', `${quest.title || quest.name} đã lưu vào Notion.`);
    } catch (error) {
      button.disabled = false;
      button.textContent = '✓ Hoàn thành';
      this.showSpideyToast('CHƯA LƯU ĐƯỢC', 'THỬ LẠI', error.message || 'Kiểm tra kết nối Notion.');
    } finally { this.pendingQuestIds.delete(quest.id); }
  }

  async loadNotionSnapshot() {
    try {
      const cached = localStorage.getItem('life_reset_notion_cache_v1');
      if (cached) {
        const data = JSON.parse(cached);
        this.lastSyncedAt = data.syncedAt;
        this.notionHabits = Array.isArray(data.habits) ? data.habits : [];
        this.habitSyncedAt = data.habitSyncedAt || data.syncedAt;
        const cacheIsToday = this.habitSyncedAt && dateKey(new Date(this.habitSyncedAt)) === this.todayKey();
        this.notionHabits.forEach((habit) => {
          if (!cacheIsToday) { habit.today = false; habit.done = false; }
          if (habit.today) this.state.notionDoneToday[habit.id] = true;
        });
        this.notionTasks = Array.isArray(data.tasks) ? data.tasks : [];
        this.notionActiveQuests = Array.isArray(data.activeQuests) ? data.activeQuests : [];
        this.notionHeroXp = Number.isFinite(data.heroXp) ? data.heroXp : null;
        document.getElementById('badge-notion-habits-count').textContent = this.notionHabits.length;
        document.getElementById('badge-notion-tasks-count').textContent = this.notionTasks.length + this.notionActiveQuests.length;
        document.getElementById('notion-status-text').textContent = 'Notion Zeus: Dữ liệu lưu trên máy';
        this.renderHabitCards();
        this.renderHelloSquareHabits();
        this.renderQuestBoard();
        return;
      }
      const res = await fetch('../data/notion-snapshot.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.collections) {
        this.notionHabits = (data.collections.habits || []).map(h => ({
          id: `notion_${h.id}`,
          rawId: h.id,
          name: h.name,
          category: h.category || 'Good Habit',
          priority: h.priority || 'Medium',
          timeBlock: h.timeBlock || 'Allday',
          outcome: h.outcome || '',
          description: h.description || '',
          today: !!h.today && dateKey(new Date(data.metadata?.syncedAt || 0)) === this.todayKey(),
          xp: h.xp ? h.xp * 35 : 35,
          gold: h.gold ? h.gold * 15 : 20,
          sourceUrl: h.sourceUrl
        }));

        this.notionTasks = (data.collections.masterCalendar || []).map(t => ({
          id: `notion_task_${t.id}`,
          rawId: t.id,
          title: t.title,
          date: t.date,
          type: t.type || 'Work',
          priority: t.priority || 'Low',
          done: !!t.done,
          gameXp: t.gameXp,
          sourceUrl: t.sourceUrl
        }));

        const hCount = document.getElementById('badge-notion-habits-count');
        const tCount = document.getElementById('badge-notion-tasks-count');
        const statusEl = document.getElementById('notion-status-text');

        if (hCount) hCount.textContent = this.notionHabits.length;
        if (tCount) tCount.textContent = this.notionTasks.length;
        if (statusEl) statusEl.textContent = `Notion Zeus: ${this.notionHabits.length} habits ready`;

        this.notionHabits.forEach((habit) => {
          if (habit.today && this.state.notionDoneToday[habit.id] === undefined) this.state.notionDoneToday[habit.id] = true;
        });
        this.saveState();
        this.renderHelloSquareHabits();
        this.renderQuestBoard();

        if (this.activeSource !== 'anime') {
          this.renderHabitCards();
        }
      }
    } catch (err) {
      console.warn('[Notion Snapshot] Could not load snapshot:', err);
      const statusEl = document.getElementById('notion-status-text');
      if (statusEl) statusEl.textContent = 'Notion Zeus: Offline Snapshot';
    }
  }

  cacheNotionData(syncedAt = this.lastSyncedAt) {
    localStorage.setItem('life_reset_notion_cache_v1', JSON.stringify({
      habits: this.notionHabits, tasks: this.notionTasks, activeQuests: this.notionActiveQuests,
      heroXp: this.notionHeroXp, syncedAt, habitSyncedAt: this.habitSyncedAt
    }));
  }

  async syncNotionLive({ quiet = false } = {}) {
    if (this.syncing || this.pendingHabitIds.size || this.pendingQuestIds.size) return;
    this.syncing = true;
    const syncBtn = document.getElementById('btn-sync-notion-now');
    const statusEl = document.getElementById('notion-status-text');
    syncBtn?.classList.add('spinning');
    if (syncBtn) syncBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Đang đồng bộ Notion…';
    this.renderHabitCards();
    this.renderHelloSquareHabits();
    this.renderQuestBoard();

    try {
      const { queryAllNotionPages, normalizeNotionPage, normalizeNotionCatalogPage, NOTION_GAME_DATABASES } = await import('../../js/integrations/notion/NotionGameData.js');
      const results = await Promise.allSettled([
        queryAllNotionPages(NOTION_GAME_DATABASES.habits),
        queryAllNotionPages(NOTION_GAME_DATABASES.masterCalendar),
        queryAllNotionPages(NOTION_GAME_DATABASES.activeQuests),
        queryAllNotionPages(NOTION_GAME_DATABASES.heroProfile)
      ]);
      if (results.every((result) => result.status === 'rejected')) throw results[0].reason;
      if (results[0].status === 'fulfilled') {
        this.habitSyncedAt = new Date().toISOString();
        this.notionHabits = results[0].value.map((page) => {
          const habit = normalizeNotionPage(page, 'habits');
          return { ...habit, id: `notion_${habit.id}`, rawId: habit.id, xp: (Number(habit.xp) || 1) * 35, gold: 20 };
        });
        for (const habit of this.notionHabits) {
          if (habit.today) this.state.notionDoneToday[habit.id] = true;
          else delete this.state.notionDoneToday[habit.id];
          this.recordNotionHabitDay(habit, habit.today);
        }
      }
      if (results[1].status === 'fulfilled') {
        this.notionTasks = results[1].value.map((page) => normalizeNotionPage(page, 'masterCalendar'));
        for (const task of this.notionTasks) {
          if (task.done) this.state.notionDoneToday[task.id] = true;
          else delete this.state.notionDoneToday[task.id];
        }
      }
      if (results[2].status === 'fulfilled') {
        this.notionActiveQuests = results[2].value.map((page) => normalizeNotionPage(page, 'activeQuests'));
        for (const quest of this.notionActiveQuests) {
          if (quest.done) this.state.notionDoneToday[quest.id] = true;
          else delete this.state.notionDoneToday[quest.id];
        }
      }
      if (results[3].status === 'fulfilled') {
        const profile = results[3].value.map(normalizeNotionCatalogPage)[0];
        this.notionHeroXp = profile ? Number(profile.Exp) || 0 : null;
      }
      this.notionLive = results.every((result) => result.status === 'fulfilled');
      this.lastSyncedAt = new Date().toISOString();
      this.cacheNotionData();
      this.saveState();
      document.getElementById('badge-notion-habits-count')?.replaceChildren(document.createTextNode(String(this.notionHabits.length)));
      document.getElementById('badge-notion-tasks-count')?.replaceChildren(document.createTextNode(String(this.notionTasks.length + this.notionActiveQuests.length)));
      const missing = ['Habit', 'Todo', 'Quest', 'Hero'].filter((_, index) => results[index].status === 'rejected');
      if (statusEl) statusEl.textContent = `Notion · ${new Date(this.lastSyncedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}${missing.length ? ` · Chưa tải: ${missing.join(', ')}` : ' · Đã cập nhật'}`;
      document.querySelector('.notion-status-dot')?.classList.toggle('online', this.notionLive);
      this.renderHabitCards();
      this.renderHelloSquareHabits();
      this.renderQuestBoard();
      this.renderPathwayGrid();
      this.renderTrackerSplitCards();
      if (this.activeSubview === 'reports') this.renderHeatmapMatrices();
      if (!quiet) {
        this.playSfx('reward');
        this.showSpideyToast('NOTION SYNCED', 'LIVE ⚡', `${this.notionHabits.length} habits updated.`);
      }
    } catch (error) {
      this.notionLive = false;
      if (statusEl) statusEl.textContent = `Notion Zeus: Offline (${this.notionHabits.length} cached)`;
      document.querySelector('.notion-status-dot')?.classList.remove('online');
      if (!quiet) this.showSpideyToast('NOTION OFFLINE', 'RETRY ↻', error.message || 'Live sync failed.');
    } finally {
      this.syncing = false;
      if (syncBtn) syncBtn.disabled = false;
      this.renderHabitCards();
      this.renderHelloSquareHabits();
      this.renderQuestBoard();
      setTimeout(() => {
        syncBtn?.classList.remove('spinning');
      }, 600);
    }
  }

  setupTodoFilterCapsules() {
    const filterBtns = document.querySelectorAll('.filter-capsule-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter;
        this.renderHabitCards();
      });
    });

    document.getElementById('btn-add-habit')?.addEventListener('click', () => {
      this.openAlert('Custom Habit', 'Add custom habit protocols to your 66-day journey.');
    });
  }

  renderHeaderStats() {
    const streakEl = document.getElementById('streak-header-num');
    const trophyEl = document.getElementById('trophy-header-num');
    const xpEl = document.getElementById('xp-header-num');
    const dayEl = document.getElementById('current-day-number');
    const ribbonEl = document.getElementById('ribbon-ticker-text');

    if (streakEl) streakEl.textContent = Math.max(0, ...this.notionHabits.map((habit) => Number(habit.streak) || 0));
    if (trophyEl) trophyEl.textContent = this.notionHabits.filter((habit) => !!this.state.notionDoneToday[habit.id]).length;
    if (xpEl) xpEl.textContent = this.notionHeroXp === null ? '—' : this.notionHeroXp.toLocaleString();
    if (dayEl) dayEl.textContent = this.campaignDay();
    if (ribbonEl) ribbonEl.textContent = `${this.notionHabits.length} Habit · ${this.notionTasks.length + this.notionActiveQuests.length} Quest từ Notion`;

    // Filter counts
    const items = this.activeSource === 'notion-habits' ? this.notionHabits : this.activeSource === 'notion-tasks' ? [...this.notionTasks, ...this.notionActiveQuests] : this.state.habits;
    const completedCount = items.filter((item) => this.activeSource === 'anime' ? !!this.state.completedToday[item.id] : !!(item.done || item.today || this.state.notionDoneToday[item.id])).length;
    const skippedCount = this.activeSource === 'anime' ? Object.keys(this.state.skippedToday).length : 0;
    const todosCount = Math.max(0, items.length - completedCount - skippedCount);

    const bTodos = document.getElementById('count-badge-todos');
    const bDone = document.getElementById('count-badge-done');
    const bSkipped = document.getElementById('count-badge-skipped');

    if (bTodos) bTodos.textContent = todosCount;
    if (bDone) bDone.textContent = completedCount;
    if (bSkipped) bSkipped.textContent = skippedCount;
  }

  renderHabitCards() {
    const container = document.getElementById('anime-habits-feed');
    if (!container) return;
    container.innerHTML = '';
    this.renderHeaderStats();

    // SOURCE 1: REAL NOTION HABITS (ZEUS WORKSPACE)
    if (this.activeSource === 'notion-habits') {
      if (this.notionHabits.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 16px; color: #94A3B8;">
            <div style="font-size: 32px; margin-bottom: 8px;">🔄</div>
            <strong style="color: #FFF;">Loading Notion Zeus Habits...</strong>
            <p style="font-size: 12px; margin-top: 4px;">Click "Sync" above to connect to your Notion Workspace.</p>
          </div>
        `;
        return;
      }

      this.notionHabits.filter((habit) => {
        const done = !!(habit.today || this.state.notionDoneToday[habit.id]);
        return this.activeFilter === 'done' ? done : this.activeFilter === 'skipped' ? false : !done;
      }).forEach(habit => {
        const isDone = !!this.state.notionDoneToday[habit.id];
        const isBad = habit.category && habit.category.toLowerCase().includes('bad');

        const card = document.createElement('div');
        card.className = `anime-card-cell`;
        card.innerHTML = `
          <div class="anime-card-body ${isDone ? 'completed' : ''}" style="background: ${isBad ? 'linear-gradient(135deg, #1F1015 0%, #15090C 100%)' : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'}; border: 2px solid ${isBad ? '#BE123C' : '#3B82F6'};">
            <div class="card-left-info">
              <div class="card-flame-tag" style="border-color: ${isBad ? '#F43F5E' : '#38BDF8'}; color: ${isBad ? '#FB7185' : '#38BDF8'};">
                <span>${isBad ? '🛡️' : '⚡'}</span>
                <span>${this.escapeHtml(habit.timeBlock)} • ${this.escapeHtml(habit.category)}</span>
              </div>
              <h2 class="card-title-bold" style="font-size: 17px;">${this.escapeHtml(habit.name)}</h2>
              <p class="card-subtitle-small">${this.escapeHtml(habit.outcome || habit.description || 'Thói quen của bạn trong Notion')}</p>
              <div class="card-meta-indicators">
                <span>📊 ${this.escapeHtml(habit.priority)}</span>
                ${habit.streak ? `<span>🔥 ${Number(habit.streak)} ngày</span>` : ''}
                <span>❤️ Hồi HP & Energy</span>
              </div>
            </div>

            <button class="card-square-check" aria-label="${isDone ? 'Đã hoàn thành' : 'Hoàn thành'} ${this.escapeHtml(habit.name)}" data-id="${this.escapeHtml(habit.id)}" ${isDone || this.syncing || this.pendingHabitIds.has(habit.id) ? 'disabled' : ''}>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
          </div>
        `;

        const checkBtn = card.querySelector('.card-square-check');
        checkBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleNotionHabitDone(habit);
        });

        container.appendChild(card);
      });
      if (!container.childElementCount) container.innerHTML = '<div class="personal-quest-empty">Chưa có Habit trong nhóm này.</div>';
      return;
    }

    // SOURCE 2: NOTION MASTER CALENDAR TASKS
    if (this.activeSource === 'notion-tasks') {
      if (this.notionTasks.length + this.notionActiveQuests.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 16px; color: #94A3B8;">
            <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
            <strong style="color: #FFF;">Chưa có Quest trong Notion</strong>
            <p style="font-size: 12px; margin-top: 4px;">Thử đồng bộ lại để lấy Master Calendar và Active Quests.</p>
          </div>
        `;
        return;
      }

      [...this.notionTasks.map((task) => ({ ...task, kind: 'masterCalendar' })), ...this.notionActiveQuests.map((task) => ({ ...task, kind: 'activeQuests', date: task.dueDate }))].filter((task) => {
        const done = !!(task.done || this.state.notionDoneToday[task.id]);
        return this.activeFilter === 'done' ? done : this.activeFilter === 'skipped' ? false : !done;
      }).forEach(task => {
        const isDone = !!(task.done || this.state.notionDoneToday[task.id]);
        const dateStr = task.date ? new Date(task.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Flexible';

        const card = document.createElement('div');
        card.className = `anime-card-cell`;
        card.innerHTML = `
          <div class="anime-card-body ${isDone ? 'completed' : ''}" style="background: linear-gradient(135deg, #111827 0%, #1F2937 100%); border: 2px solid #6366F1;">
            <div class="card-left-info">
              <div class="card-flame-tag" style="border-color: #818CF8; color: #A5B4FC;">
                <span>📅</span>
                <span>${this.escapeHtml(dateStr)} • ${this.escapeHtml(task.type || task.frequency || 'Quest')}</span>
              </div>
              <h2 class="card-title-bold" style="font-size: 17px;">${this.escapeHtml(task.title)}</h2>
              <p class="card-subtitle-small">${this.escapeHtml(task.kind === 'activeQuests' ? 'Active Quest' : 'Master Calendar')} · ${this.escapeHtml(task.priority || task.frequency || 'Quest')}</p>
              <div class="card-meta-indicators">
                <span>🎯 ${this.escapeHtml(task.kind === 'activeQuests' ? 'Active Quest' : 'Master Calendar')}</span>
                ${Number(task.gameXp ?? task.xp) > 0 ? `<span>✨ ${Number(task.gameXp ?? task.xp)} XP</span>` : ''}
              </div>
            </div>

            <button class="card-square-check" aria-label="${isDone ? 'Đã hoàn thành' : 'Hoàn thành'} ${this.escapeHtml(task.title)}" data-id="${this.escapeHtml(task.id)}" ${isDone ? 'disabled' : ''}>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
          </div>
        `;

        const checkBtn = card.querySelector('.card-square-check');
        checkBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.completeNotionQuest(task, checkBtn);
        });

        container.appendChild(card);
      });
      if (!container.childElementCount) container.innerHTML = '<div class="personal-quest-empty">Chưa có Quest trong nhóm này.</div>';
      return;
    }

    // SOURCE 3: 66-DAY CORE ANIME HABITS (APKPURE REPLICA)
    const list = this.state.habits.filter(h => {
      const isDone = !!this.state.completedToday[h.id];
      const isSkipped = !!this.state.skippedToday[h.id];

      if (this.activeFilter === 'done') return isDone;
      if (this.activeFilter === 'skipped') return isSkipped;
      return !isDone && !isSkipped;
    });

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 16px; color: #94A3B8;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎉</div>
          <strong style="color: #FFF;">All habits complete!</strong>
          <p style="font-size: 12px; margin-top: 4px;">Zero uncompleted habits remaining in this filter.</p>
        </div>
      `;
      return;
    }

    list.forEach(habit => {
      const isDone = !!this.state.completedToday[habit.id];

      const wrap = document.createElement('div');
      wrap.className = 'anime-card-cell';

      const bgReveal = document.createElement('div');
      bgReveal.className = 'anime-card-bg-reveal';
      bgReveal.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>COMPLETED</span>
      `;
      wrap.appendChild(bgReveal);

      const card = document.createElement('div');
      card.className = `anime-card-body ${isDone ? 'completed' : ''}`;
      card.style.backgroundImage = `url('assets/images/${habit.cover}')`;

      const pct = Math.min(100, Math.round((habit.currentVal / habit.targetVal) * 100));

      card.innerHTML = `
        <div class="card-left-info">
          <div class="card-flame-tag">
            <span>🔥</span>
            <span>${habit.streak}d</span>
          </div>
          <h2 class="card-title-bold">${habit.title}</h2>
          <p class="card-subtitle-small">${habit.subtitle}</p>
          <div class="card-meta-indicators">
            <span>🔁 ${habit.repeat}</span>
            <span>📊 ${habit.difficulty}</span>
            <span>${habit.currentVal}${habit.unit} / ${habit.targetVal}${habit.unit}</span>
          </div>
        </div>

        <button class="card-square-check" aria-label="Mark done" data-id="${habit.id}">
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>

        ${habit.currentVal > 0 ? `
          <div class="card-bottom-progress-bar">
            <div class="card-bottom-progress-fill" style="width: ${pct}%"></div>
          </div>
        ` : ''}
      `;

      // Check button click
      const checkBtn = card.querySelector('.card-square-check');
      checkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleHabitDone(habit.id);
      });

      // Swipe gesture
      this.bindCardSwipe(wrap, card, habit.id);

      // Card body click opens Focused Action Sheet
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-square-check')) return;
        this.openActionSheet(habit);
      });

      wrap.appendChild(card);
      container.appendChild(wrap);
    });
  }

  async toggleNotionHabitDone(habit) {
    const isDone = !this.state.notionDoneToday[habit.id];
    if (this.syncing || this.pendingHabitIds.has(habit.id)) return;
    this.pendingHabitIds.add(habit.id);
    this.renderHelloSquareHabits();
    this.renderHabitCards();
    const saved = await this.persistNotionHabitCheck(habit, isDone);
    this.pendingHabitIds.delete(habit.id);
    if (!saved) { this.renderHelloSquareHabits(); this.renderHabitCards(); return; }
    this.habitSyncedAt = new Date().toISOString();
    habit.today = isDone;
    habit.done = isDone;
    if (isDone) {
      this.state.notionDoneToday[habit.id] = true;
      this.showSpideyToast('HABIT HOÀN THÀNH', '✓ NOTION', `${habit.name} đã được lưu vào Notion.`);
    } else {
      delete this.state.notionDoneToday[habit.id];
      this.playSfx('bell');
    }
    this.recordNotionHabitDay(habit, isDone);
    window.parent?.postMessage({ type: 'SPIDEY_NOTION_CHECKIN', kind: 'habits', id: habit.rawId, checked: isDone }, window.location.origin);
    this.cacheNotionData();
    this.saveState();
    this.renderPathwayGrid();
    this.renderTrackerSplitCards();
    this.renderHabitCards();
    this.renderHelloSquareHabits();
  }

  async persistNotionHabitCheck(habit, checked) {
    if (!habit.rawId) return;
    try {
      const pageId = String(habit.rawId).replace(/-/g, '');
      const response = await fetch(`/api/notion?path=${encodeURIComponent(`/v1/pages/${pageId}`)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: { Today: { checkbox: checked } } })
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || `HTTP ${response.status}`);
      return true;
    } catch (error) {
      this.showSpideyToast('CHƯA LƯU ĐƯỢC', 'THỬ LẠI', error.message || `${habit.name}: kiểm tra kết nối Notion.`);
      return false;
    }
  }

  bindCardSwipe(wrapEl, cardEl, habitId) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const onStart = (clientX) => {
      startX = clientX;
      currentX = clientX;
      isDragging = true;
    };

    const onMove = (clientX) => {
      if (!isDragging) return;
      const diffX = clientX - startX;
      if (diffX > 0) {
        const clamped = Math.min(130, diffX);
        cardEl.style.transform = `translateX(${clamped}px)`;
        if (clamped > 15) wrapEl.classList.add('swiping');
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = currentX - startX;
      if (diffX > 85) {
        cardEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
          this.toggleHabitDone(habitId);
          cardEl.style.transform = 'translateX(0)';
          wrapEl.classList.remove('swiping');
        }, 160);
      } else {
        cardEl.style.transform = 'translateX(0)';
        wrapEl.classList.remove('swiping');
      }
    };

    cardEl.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
    cardEl.addEventListener('touchmove', e => {
      currentX = e.touches[0].clientX;
      onMove(currentX);
    }, { passive: true });
    cardEl.addEventListener('touchend', onEnd);

    cardEl.addEventListener('mousedown', e => {
      if (e.target.closest('.card-square-check')) return;
      onStart(e.clientX);
      const move = ev => { currentX = ev.clientX; onMove(currentX); };
      const up = () => {
        onEnd();
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    });
  }

  toggleHabitDone(habitId) {
    const isDone = !this.state.completedToday[habitId];
    if (isDone) {
      this.state.completedToday[habitId] = true;
      delete this.state.skippedToday[habitId];
      const habit = this.state.habits.find(h => h.id === habitId);
      if (habit) habit.streak++;
      if (habitId === 'habit_water') this.state.waterDrankLiters += 2;
      this.notifyPracticeComplete(habit ? habit.title : 'Habit mẫu');
    } else {
      delete this.state.completedToday[habitId];
      const habit = this.state.habits.find(h => h.id === habitId);
      if (habit) habit.streak = Math.max(0, habit.streak - 1);
    }
    this.saveState();
    this.renderHabitCards();
  }

  // =========================================================================
  // TAB 2: HELLO HABIT (TRACKER & REPORTS - EXACT USER IMAGE 4)
  // =========================================================================
  setupHelloHabitTab() {
    this.helloTracker.selectedDay = this.todayKey();
    document.getElementById('btn-hello-menu')?.addEventListener('click', () => this.syncNotionLive());
    document.getElementById('btn-reports-menu')?.addEventListener('click', () => document.getElementById('btn-export-save')?.click());
    this.renderWeekStrip();
    // Subview switcher: Habit Tracker vs Habit Reports
    const subBtns = document.querySelectorAll('.sub-nav-btn');
    subBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeSubview = btn.dataset.subview;

        document.querySelectorAll('.subview-section').forEach(s => s.classList.remove('active'));
        const activeSub = document.getElementById(`subview-${this.activeSubview}-content`);
        if (activeSub) activeSub.classList.add('active');

        this.renderReportsSubview();
        this.playSfx('bell');
      });
    });

    // Close button on Habit Reports switches back to Habit Tracker
    document.getElementById('btn-close-reports')?.addEventListener('click', () => {
      const trackerBtn = document.querySelector('.sub-nav-btn[data-subview="tracker"]');
      trackerBtn?.click();
    });

    // Calendar horizontal week strip clicks
    document.getElementById('hello-week-strip')?.addEventListener('click', (event) => {
      const cell = event.target.closest('[data-day]');
      if (!cell) return;
      this.helloTracker.selectedDay = cell.dataset.day;
      this.saveState();
      this.renderWeekStrip();
      this.renderHelloSquareHabits();
      this.playSfx('bell');
    });

    document.getElementById('btn-tracker-filter')?.addEventListener('click', (event) => {
      const filters = ['all', 'open', 'done'];
      this.helloFilter = filters[(filters.indexOf(this.helloFilter || 'all') + 1) % filters.length];
      event.currentTarget.setAttribute('aria-label', `Lọc Habit: ${{ all: 'Tất cả', open: 'Chưa check', done: 'Đã check' }[this.helloFilter]}`);
      event.currentTarget.title = event.currentTarget.getAttribute('aria-label');
      document.querySelector('.tracker-header-title').textContent = { all: 'Tất cả Habit', open: 'Chưa check', done: 'Đã check' }[this.helloFilter];
      this.renderHelloSquareHabits();
    });
    document.getElementById('btn-tracker-dots')?.addEventListener('click', () => document.querySelector('[data-subview="reports"]')?.click());

    // Collapsible Groups
    const groupDaily = document.getElementById('group-daily-goals');
    const headerDaily = document.getElementById('header-daily-goals');
    headerDaily?.addEventListener('click', () => {
      this.helloTracker.collapsedDaily = !this.helloTracker.collapsedDaily;
      groupDaily?.classList.toggle('collapsed', this.helloTracker.collapsedDaily);
    });

    const groupWeekly = document.getElementById('group-weekly-goals');
    const headerWeekly = document.getElementById('header-weekly-goals');
    headerWeekly?.addEventListener('click', () => {
      this.helloTracker.collapsedWeekly = !this.helloTracker.collapsedWeekly;
      groupWeekly?.classList.toggle('collapsed', this.helloTracker.collapsedWeekly);
    });

    // Granularity switcher: Week | Month | Year
    const timeBtns = document.querySelectorAll('.time-btn');
    timeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activePeriod = btn.dataset.period;
        this.renderHeatmapMatrices();
        this.playSfx('bell');
      });
    });

    // Year Navigator controls
    const yPrev = document.getElementById('btn-year-prev');
    const yNext = document.getElementById('btn-year-next');
    const yToday = document.getElementById('btn-year-today');
    const yLabel = document.getElementById('hello-current-year');

    yPrev?.addEventListener('click', () => {
      this.currentYear--;
      if (yLabel) yLabel.textContent = this.currentYear;
      this.renderHeatmapMatrices();
      this.playSfx('bell');
    });

    yNext?.addEventListener('click', () => {
      this.currentYear++;
      if (yLabel) yLabel.textContent = this.currentYear;
      this.renderHeatmapMatrices();
      this.playSfx('bell');
    });

    yToday?.addEventListener('click', () => {
      this.currentYear = new Date().getFullYear();
      if (yLabel) yLabel.textContent = this.currentYear;
      this.renderHeatmapMatrices();
      this.playSfx('bell');
    });

    // Export only recorded check-ins; no generated progress is presented as history.
    document.getElementById('btn-export-save')?.addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([this.habitReportText()], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `hello-habit-${this.currentYear}.txt`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.showSpideyToast('REPORT SAVED', 'TXT ✓', 'Check-in history downloaded.');
    });

    document.getElementById('btn-export-share')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.habitReportText());
        this.showSpideyToast('REPORT COPIED', 'COPIED 📤', 'Recorded habit history copied.');
      } catch (_) {
        this.showSpideyToast('COPY FAILED', 'RETRY', 'Clipboard access is unavailable.');
      }
    });
  }

  renderReportsSubview() {
    if (this.activeSubview === 'reports') {
      this.renderHeatmapMatrices();
    } else {
      this.renderHelloSquareHabits();
      this.renderTrackerSplitCards();
    }
  }

  habitReportText() {
    const rows = this.notionHabits.map((habit) => {
      const days = (this.state.notionHistory?.[habit.rawId || habit.id] || []).filter((day) => day.startsWith(`${this.currentYear}-`));
      return `${habit.name}: ${days.length} recorded check-ins`;
    });
    return [`Hello Habit — ${this.currentYear}`, 'History recorded on this device from Notion check-ins.', ...rows].join('\n');
  }

  renderWeekStrip() {
    const strip = document.getElementById('hello-week-strip');
    if (!strip) return;
    strip.replaceChildren();
    const today = new Date();
    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cal-day-cell${this.helloTracker.selectedDay === key ? ' active' : ''}`;
      cell.dataset.day = key;
      cell.setAttribute('aria-pressed', String(this.helloTracker.selectedDay === key));
      cell.innerHTML = '<span class="cal-day-name"></span><span class="cal-day-num"></span>';
      cell.querySelector('.cal-day-name').textContent = new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date);
      cell.querySelector('.cal-day-num').textContent = String(date.getDate());
      strip.appendChild(cell);
    }
  }

  renderHelloSquareHabits() {
    const grid = document.getElementById('hello-square-grid');
    const progress = document.getElementById('hello-square-progress');
    if (!grid || !progress) return;

    const habits = this.notionHabits;
    const selectedDay = this.helloTracker.selectedDay || this.todayKey();
    const isToday = selectedDay === this.todayKey();
    const completed = habits.filter((habit) => isToday ? !!this.state.notionDoneToday[habit.id] : (this.state.notionHistory?.[habit.rawId || habit.id] || []).includes(selectedDay)).length;
    progress.textContent = `${completed} / ${habits.length} CHECKED${isToday ? '' : ' · LỊCH SỬ'}`;
    grid.innerHTML = '';

    if (!habits.length) {
      grid.innerHTML = '<div class="hello-square-empty">Đang tải Habit từ Notion Zeus…</div>';
      return;
    }

    const tones = ['sky', 'mint', 'coral', 'violet', 'amber'];
    habits.forEach((habit, index) => {
      const done = isToday ? !!this.state.notionDoneToday[habit.id] : (this.state.notionHistory?.[habit.rawId || habit.id] || []).includes(selectedDay);
      if (this.helloFilter === 'open' && done || this.helloFilter === 'done' && !done) return;
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = `hello-square-tile hello-square-tile--${tones[index % tones.length]}${done ? ' is-checked' : ''}`;
      tile.setAttribute('aria-pressed', String(done));
      tile.setAttribute('aria-label', `${done ? 'Bỏ check' : 'Check'} ${habit.name}`);
      tile.disabled = !isToday || this.syncing || this.pendingHabitIds.has(habit.id);
      tile.setAttribute('aria-busy', String(this.pendingHabitIds.has(habit.id)));
      tile.innerHTML = `
        <span class="hello-square-box" aria-hidden="true"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
        <span class="hello-square-type"></span>
        <strong class="hello-square-name"></strong>
        <small class="hello-square-time"></small>
      `;
      tile.querySelector('.hello-square-type').textContent = habit.category || 'HABIT';
      tile.querySelector('.hello-square-name').textContent = habit.name;
      tile.querySelector('.hello-square-time').textContent = habit.timeBlock || 'Cả ngày';
      tile.addEventListener('click', () => this.toggleNotionHabitDone(habit));
      grid.appendChild(tile);
    });
  }

  renderTrackerSplitCards() {
    const container = document.getElementById('daily-split-cards');
    if (!container) return;
    container.replaceChildren();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(); date.setDate(date.getDate() - 6 + index); return dateKey(date);
    });
    for (const habit of this.notionHabits) {
      const history = new Set(this.state.notionHistory?.[habit.rawId || habit.id] || []);
      const count = days.filter(day => history.has(day)).length;
      const tile = document.createElement('article');
      tile.className = 'split-goal-tile';
      tile.innerHTML = '<div class="split-pastel-left teal"></div><div class="split-data-right"><div class="split-data-top">7 ngày gần đây</div><div class="split-val-center"><span class="split-val-bold"></span><span class="split-target-sub">ngày có check-in được ghi nhận</span></div><div class="split-dots-track"></div></div>';
      tile.querySelector('.split-pastel-left').textContent = habit.name;
      tile.querySelector('.split-val-bold').textContent = `${count} / 7`;
      const track = tile.querySelector('.split-dots-track');
      for (const day of days) {
        const dot = document.createElement('span');
        dot.className = `split-dash-segment${history.has(day) ? ' filled teal' : ''}`;
        dot.title = `${day}: ${history.has(day) ? 'Đã check' : 'Chưa ghi nhận'}`;
        track.appendChild(dot);
      }
      container.appendChild(tile);
    }
  }

  renderHeatmapMatrices() {
    const container = document.getElementById('heatmaps-list-container');
    const tooltip = document.getElementById('heatmap-popover-tooltip');
    if (!container) return;
    container.innerHTML = '';
    const end = this.currentYear === new Date().getFullYear() ? new Date() : new Date(this.currentYear, 11, 31);
    const start = this.activePeriod === 'year' ? new Date(this.currentYear, 0, 1) : new Date(end);
    if (this.activePeriod === 'week') start.setDate(end.getDate() - 6);
    if (this.activePeriod === 'month') start.setDate(end.getDate() - 29);
    const dates = [];
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    }
    const columns = Math.ceil(dates.length / 7);
    const themes = ['theme-red', 'theme-blue', 'theme-slate', 'theme-teal', 'theme-purple'];
    this.notionHabits.forEach((habit, index) => {
      const history = new Set(this.state.notionHistory?.[habit.rawId || habit.id] || []);
      const count = dates.filter((day) => history.has(day)).length;
      const card = document.createElement('div');
      card.className = `heatmap-unit-card ${themes[index % themes.length]}`;
      card.innerHTML = '<div class="heatmap-unit-header"><div class="heatmap-habit-label"><span class="heatmap-round-dot">✓</span><span class="heatmap-habit-name"></span></div><span class="heatmap-percentage-num"></span></div><div class="heatmap-square-grid"></div>';
      card.querySelector('.heatmap-habit-name').textContent = habit.name;
      card.querySelector('.heatmap-percentage-num').textContent = `${count} ngày`;
      const grid = card.querySelector('.heatmap-square-grid');
      grid.style.gridTemplateColumns = `repeat(${columns}, minmax(6px, 1fr))`;
      grid.style.gridTemplateRows = 'repeat(7, 1fr)';
      grid.style.gridAutoFlow = 'column';
      dates.forEach((day) => {
        const cell = document.createElement('div');
        const checked = history.has(day);
        cell.className = `hm-cell ${checked ? 'is-hit active-3' : ''}`;
        cell.title = `${habit.name} · ${day}: ${checked ? 'Đã check-in' : 'Chưa có dữ liệu'}`;
        cell.addEventListener('mouseenter', () => {
          if (!tooltip) return;
          const rect = cell.getBoundingClientRect();
          const frame = document.querySelector('.phone-frame')?.getBoundingClientRect();
          if (!frame) return;
          document.getElementById('hm-tip-date').textContent = `${habit.name} · ${day}`;
          document.getElementById('hm-tip-status').textContent = checked ? '✓ Đã check-in' : 'Chưa có dữ liệu';
          tooltip.style.left = `${Math.min(frame.width - 180, Math.max(10, rect.left - frame.left - 50))}px`;
          tooltip.style.top = `${rect.top - frame.top - 46}px`;
          tooltip.style.display = 'flex';
        });
        cell.addEventListener('mouseleave', () => { if (tooltip) tooltip.style.display = 'none'; });
        grid.appendChild(cell);
      });
      container.appendChild(card);
    });
    if (!this.notionHabits.length) container.textContent = 'Chưa có Habit để hiển thị báo cáo.';
  }

  // =========================================================================
  // TAB 3: THE 8 CORE HABITS (IMAGE 3)
  // =========================================================================
  renderCore8HabitsGrid() {
    const grid = document.getElementById('core-8-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const core8 = [
      { name: 'Wake Up 7AM', icon: '🌅', cover: 'early_wake_bg.webp' },
      { name: 'Drink 2L Water', icon: '🥛', cover: 'water_bg_men_2025.webp' },
      { name: 'Run 5km', icon: '🏃', cover: 'run_bg_men_2025.webp' },
      { name: '20 Push-ups', icon: '🏋️', cover: 'pushup_bg_men_2025.webp' },
      { name: 'Meditate 5m', icon: '🧘', cover: 'meditate_bg_men_2025.webp' },
      { name: 'Read 20p', icon: '📖', cover: 'read_bg_men_2025.webp' },
      { name: 'Dopamine Shield', icon: '📵', cover: 'screentime_bg_men_2025.webp' },
      { name: 'Cold Shower', icon: '🚿', cover: 'shower_bg_men_2025.webp' }
    ];

    core8.forEach(item => {
      const box = document.createElement('div');
      box.className = 'core-cell-box';
      box.style.backgroundImage = `url('assets/images/${item.cover}')`;
      box.innerHTML = `
        <span class="core-cell-icon">${item.icon}</span>
        <span class="core-cell-name">${item.name}</span>
      `;
      box.addEventListener('click', () => {
        this.openAlert(item.name, 'One of the 8 essential behavioral resets designed to rebuild dopamine baseline and habit automaticity over 66 days.');
      });
      grid.appendChild(box);
    });

    document.getElementById('btn-core-continue')?.addEventListener('click', () => {
      this.switchTab('today');
    });
  }

  renderPathwayGrid() {
    const grid = document.getElementById('pathway-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const recorded = new Set(Object.values(this.state.notionHistory || {}).flat());
    for (const entry of campaignDays(this.state.campaignStartedAt, this.todayKey())) {
      const cell = document.createElement('button');
      cell.type = 'button';
      const isDone = recorded.has(entry.date);
      const isToday = entry.date === this.todayKey();
      cell.className = `pathway-cell ${isDone ? 'done' : ''} ${isToday ? 'active' : ''}`;
      cell.textContent = entry.day;
      cell.setAttribute('aria-label', `Ngày ${entry.day}, ${entry.date}: ${isDone ? 'Có check-in' : entry.future ? 'Sắp tới' : 'Chưa ghi nhận'}`);
      if (isToday) cell.setAttribute('aria-current', 'date');
      cell.addEventListener('click', () => this.openAlert(`Ngày ${entry.day} / 66`, `${entry.date} · ${isDone ? 'Đã ghi nhận check-in trên thiết bị này.' : entry.future ? 'Ngày sắp tới trong hành trình.' : 'Chưa có check-in được ghi nhận trên thiết bị này.'}`));
      grid.appendChild(cell);
    }
  }

  // =========================================================================
  // FOCUSED ACTION SHEET
  // =========================================================================
  setupActionSheet() {
    const sheet = document.getElementById('focused-action-sheet');
    const closeBtn = document.getElementById('btn-sheet-close-x');
    const completeBtn = document.getElementById('btn-sheet-mark-done');
    const backdrop = sheet?.querySelector('.sheet-curtain-backdrop');

    const close = () => {
      sheet?.classList.remove('active');
      this.activeSheetHabit = null;
    };

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);

    completeBtn?.addEventListener('click', () => {
      if (!this.activeSheetHabit) return;
      this.toggleHabitDone(this.activeSheetHabit.id);
      close();
    });
  }

  openActionSheet(habit) {
    this.activeSheetHabit = habit;
    const sheet = document.getElementById('focused-action-sheet');
    const coverBg = document.getElementById('sheet-banner-cover');
    const flameTag = document.getElementById('sheet-flame-tag');
    const titleEl = document.getElementById('sheet-card-title');
    const subEl = document.getElementById('sheet-card-subtitle');
    const diffEl = document.getElementById('sheet-diff-stars');
    const repeatEl = document.getElementById('sheet-repeat-pattern');
    const scienceEl = document.getElementById('sheet-neuro-text');

    if (!sheet) return;

    if (coverBg) coverBg.style.backgroundImage = `url('assets/images/${habit.cover}')`;
    if (flameTag) flameTag.textContent = `🔥 ${habit.streak} days`;
    if (titleEl) titleEl.textContent = habit.title;
    if (subEl) subEl.textContent = habit.subtitle;
    if (diffEl) diffEl.textContent = `${'✦ '.repeat(habit.stars)} ${habit.difficulty}`;
    if (repeatEl) repeatEl.textContent = habit.repeat;
    if (scienceEl) scienceEl.textContent = habit.science;

    sheet.classList.add('active');
  }

  // =========================================================================
  // TOOLS
  // =========================================================================
  setupTools() {
    // Meditation
    const audio = new Audio('assets/audio/tool_2_min_meditation.mp3');
    this.activeMeditation = audio;
    const playBtn = document.getElementById('btn-play-meditate');

    playBtn?.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        playBtn.textContent = '⏸';
      } else {
        audio.pause();
        playBtn.textContent = '▶';
      }
    });

    // Breathing
    const breathBtn = document.getElementById('btn-breath-start');
    const circle = document.getElementById('breath-circle-element');
    const phaseText = document.getElementById('breath-phase-text');
    const countText = document.getElementById('breath-count-number');
    let isBreathing = false;
    let bStep = 0;
    let bCount = 4;
    const steps = [
      { text: 'INHALE', cls: 'inhale' },
      { text: 'HOLD', cls: 'hold' },
      { text: 'EXHALE', cls: 'exhale' },
      { text: 'HOLD', cls: 'hold' }
    ];

    breathBtn?.addEventListener('click', () => {
      isBreathing = !isBreathing;
      if (isBreathing) {
        breathBtn.textContent = 'STOP BREATHING';
        breathBtn.style.background = 'var(--brand-orange)';
        breathBtn.style.color = '#FFFFFF';
        this.playSfx('bell');
        bStep = 0;
        bCount = 4;
        if (circle) circle.className = `breath-circle-element ${steps[bStep].cls}`;
        if (phaseText) phaseText.textContent = steps[bStep].text;
        if (countText) countText.textContent = bCount;

        this.breathingInterval = setInterval(() => {
          bCount--;
          if (bCount <= 0) {
            bStep = (bStep + 1) % 4;
            bCount = 4;
            if (circle) circle.className = `breath-circle-element ${steps[bStep].cls}`;
            if (phaseText) phaseText.textContent = steps[bStep].text;
          }
          if (countText) countText.textContent = bCount;
        }, 1000);
      } else {
        clearInterval(this.breathingInterval);
        breathBtn.textContent = 'START 4-4-4-4';
        breathBtn.style.background = '#FFFFFF';
        breathBtn.style.color = '#000000';
        if (circle) circle.className = 'breath-circle-element';
        if (phaseText) phaseText.textContent = 'READY';
        if (countText) countText.textContent = '4';
      }
    });

    // Pomodoro
    const pomoBtn = document.getElementById('btn-pomodoro-start');
    const clock = document.getElementById('pomodoro-clock');
    let isFocus = false;

    pomoBtn?.addEventListener('click', () => {
      isFocus = !isFocus;
      if (isFocus) {
        pomoBtn.textContent = 'PAUSE FOCUS';
        pomoBtn.style.background = 'var(--accent-coral)';
        pomoBtn.style.color = '#FFFFFF';
        if (this.focusSeconds <= 0) this.focusSeconds = 25 * 60;
        const focusDeadline = Date.now() + this.focusSeconds * 1000;
        this.focusTimerInterval = setInterval(() => {
          this.focusSeconds = Math.max(0, Math.ceil((focusDeadline - Date.now()) / 1000));
          const m = Math.floor(this.focusSeconds / 60).toString().padStart(2, '0');
          const s = Math.floor(this.focusSeconds % 60).toString().padStart(2, '0');
          if (clock) clock.textContent = `${m}:${s}`;
          if (this.focusSeconds <= 0) {
            clearInterval(this.focusTimerInterval);
            isFocus = false;
            pomoBtn.textContent = 'START DEEP WORK';
            this.playSfx('done');
            this.openAlert('Deep Work Complete', '25 minutes logged toward cognitive mastery.');
          }
        }, 1000);
      } else {
        clearInterval(this.focusTimerInterval);
        pomoBtn.textContent = 'RESUME FOCUS';
      }
    });

    // Wisdom
    document.getElementById('btn-next-wisdom')?.addEventListener('click', async () => {
      try {
        const res = await fetch('data/all_motivational_cards.json');
        if (res.ok) {
          const cards = await res.json();
          const card = cards[Math.floor(Math.random() * cards.length)];
          const qEl = document.getElementById('vault-quote-display');
          const aEl = document.getElementById('vault-author-display');
          const sEl = document.getElementById('vault-source-display');
          if (qEl) qEl.textContent = `"${card.content}"`;
          if (aEl) aEl.textContent = `— ${card.author}`;
          if (sEl) sEl.textContent = card.source || '';
          this.playSfx('done');
        }
      } catch (_) {}
    });
  }

  openAlert(title, msg) {
    const overlay = document.getElementById('quick-alert-box');
    const titleEl = document.getElementById('alert-title-text');
    const bodyEl = document.getElementById('alert-body-text');
    const okBtn = document.getElementById('btn-alert-dismiss');

    if (!overlay) return;
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = msg;

    overlay.classList.add('active');
    okBtn.onclick = () => overlay.classList.remove('active');
    overlay.onclick = e => {
      if (e.target === overlay) overlay.classList.remove('active');
    };
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new LifeResetApp();
  window.app.init();
});
