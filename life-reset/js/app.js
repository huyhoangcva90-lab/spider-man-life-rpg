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
    this.audioPool = {};
    this.activeFilter = 'todos';
    this.activeSource = 'anime'; // 'anime' | 'notion-habits' | 'notion-tasks'
    this.activeSubview = 'tracker'; // 'tracker' or 'reports'
    this.activePeriod = 'year'; // 'week', 'month', 'year'
    this.currentYear = 2026;
    this.notionHabits = [];
    this.notionTasks = [];
    this.activeMeditation = null;
    this.breathingInterval = null;
    this.focusTimerInterval = null;
    this.focusSeconds = 25 * 60;
    this.activeSheetHabit = null;

    // Hello Habit Tracker Data (Exact match to Image 4)
    this.helloTracker = {
      selectedDay: 'Wed 16',
      days: ['Thu 10', 'Fri 11', 'Sat 12', 'Sun 13', 'Mon 14', 'Tue 15', 'Wed 16'],
      daily: {
        water: { name: 'Drink Water', cur: 6, tgt: 8, unit: 'times', streak: 6, color: 'blue', step: 1 },
        steps: { name: 'Steps', cur: 8450, tgt: 10000, unit: 'steps', streak: 14, color: 'teal', step: 1000 },
        read: { name: 'Read', cur: 35, tgt: 30, unit: 'min', streak: 11, color: 'coral', step: 5 }
      },
      weekly: {
        exercise: { name: 'Exercise', cur: 2, tgt: 3, unit: 'times', streak: 3, color: 'purple', step: 1 },
        journal: { name: 'Journal', cur: 650, tgt: 500, unit: 'words', streak: 18, color: 'slate', step: 100 }
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
      day: 14,
      totalDays: 66,
      streak: 14,
      trophies: 2,
      xp: 2592,
      waterDrankLiters: 12,
      completedToday: {
        habit_wake: true
      },
      skippedToday: {},
      habits: [...ANIME_HABITS],
      notionDoneToday: {}
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (_) {}
    this.renderHeaderStats();
  }

  init() {
    this.preloadAudio();
    this.setupDockTabs();
    this.setupDayNavigation();
    this.setupTodoFilterCapsules();
    this.setupNotionIntegration();
    this.renderHeaderStats();
    this.renderHabitCards();
    this.setupHelloHabitTab();
    this.renderCore8HabitsGrid();
    this.renderPathwayGrid();
    this.setupActionSheet();
    this.setupTools();
    this.loadNotionSnapshot();
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

  // Spider-Man RPG Integration loop
  applySpideyRpgReward(habitName, xp = 35, gold = 20, damage = 38, statName = 'DISCIPLINE') {
    try {
      const key = 'spidey-life-rpg-v1';
      const raw = localStorage.getItem(key);
      let rState = null;
      if (raw) {
        try { rState = JSON.parse(raw); } catch (_) {}
      }

      if (rState && rState.character) {
        rState.character.xp = (rState.character.xp || 0) + xp;
        rState.character.gold = (rState.character.gold || 0) + gold;
        if (rState.character.stats && rState.character.stats[statName] !== undefined) {
          rState.character.attrXp = rState.character.attrXp || {};
          rState.character.attrXp[statName] = (rState.character.attrXp[statName] || 0) + xp;
        }
        if (rState.boss && rState.boss.currentHp > 0) {
          rState.boss.currentHp = Math.max(0, rState.boss.currentHp - damage);
          rState.boss.combatLog = rState.boss.combatLog || [];
          rState.boss.combatLog.unshift(`[${new Date().toLocaleTimeString()}] ${habitName} dealt ${damage} DMG to ${rState.boss.name}!`);
        }
        rState.streak = rState.streak || { current: 0, best: 0 };
        rState.streak.current = (rState.streak.current || 0) + 1;
        rState.streak.best = Math.max(rState.streak.best || 0, rState.streak.current);
        localStorage.setItem(key, JSON.stringify(rState));
      }

      this.showSpideyToast(habitName, `+${xp} XP  +${gold} Gold`, `Green Goblin took ${damage} DMG! [${statName} UP]`);
      this.playSfx('reward');
    } catch (err) {
      console.warn('[Spider-Man RPG] Reward application failed:', err);
    }
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
    dockBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === targetTab));

    document.querySelectorAll('.view-tab-pane').forEach(p => p.classList.remove('active'));
    const activePane = document.getElementById(`tab-${targetTab}`);
    if (activePane) activePane.classList.add('active');

    const appContent = document.querySelector('.app-main-content');
    if (appContent) appContent.scrollTo({ top: 0, behavior: 'smooth' });

    if (targetTab === 'reports') {
      this.renderReportsSubview();
    }
  }

  setupDayNavigation() {
    const leftBtn = document.getElementById('btn-day-left');
    const rightBtn = document.getElementById('btn-day-right');

    leftBtn?.addEventListener('click', () => {
      if (this.state.day > 1) {
        this.state.day--;
        this.saveState();
        this.playSfx('bell');
      }
    });

    rightBtn?.addEventListener('click', () => {
      if (this.state.day < this.state.totalDays) {
        this.state.day++;
        this.saveState();
        this.playSfx('bell');
      }
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

  async loadNotionSnapshot() {
    try {
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
          sourceUrl: t.sourceUrl
        }));

        const hCount = document.getElementById('badge-notion-habits-count');
        const tCount = document.getElementById('badge-notion-tasks-count');
        const statusEl = document.getElementById('notion-status-text');

        if (hCount) hCount.textContent = this.notionHabits.length;
        if (tCount) tCount.textContent = this.notionTasks.length;
        if (statusEl) statusEl.textContent = `Notion Zeus: ${this.notionHabits.length} habits ready`;

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

  async syncNotionLive() {
    const syncBtn = document.getElementById('btn-sync-notion-now');
    const statusEl = document.getElementById('notion-status-text');
    syncBtn?.classList.add('spinning');
    if (statusEl) statusEl.textContent = 'Syncing Notion Zeus...';

    try {
      const res = await fetch('/api/notion?path=/v1/databases/272d7876-36c6-81a2-9bf8-e4d5e588e173/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_size: 50 })
      });
      const json = await res.json();
      if (json && json.ok) {
        if (statusEl) statusEl.textContent = `Notion Zeus: Live Synced (${json.data.results.length} items)`;
        this.playSfx('reward');
        this.showSpideyToast('NOTION SYNCED', 'LIVE ⚡', 'Notion Zeus Workspace habits updated successfully!');
      } else {
        await this.loadNotionSnapshot();
        if (statusEl) statusEl.textContent = 'Notion Zeus: Snapshot Reloaded';
        this.showSpideyToast('NOTION SNAPSHOT', 'OK ✓', 'Snapshot habits & tasks reloaded!');
      }
    } catch (_) {
      await this.loadNotionSnapshot();
      if (statusEl) statusEl.textContent = 'Notion Zeus: Snapshot Ready';
    } finally {
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

    if (streakEl) streakEl.textContent = this.state.streak;
    if (trophyEl) trophyEl.textContent = this.state.trophies;
    if (xpEl) xpEl.textContent = this.state.xp.toLocaleString();
    if (dayEl) dayEl.textContent = this.state.day;
    if (ribbonEl) ribbonEl.textContent = `${this.state.waterDrankLiters}L water drank`;

    // Filter counts
    const completedCount = Object.keys(this.state.completedToday).length;
    const skippedCount = Object.keys(this.state.skippedToday).length;
    const todosCount = Math.max(0, this.state.habits.length - completedCount - skippedCount);

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

      this.notionHabits.forEach(habit => {
        const isDone = !!this.state.notionDoneToday[habit.id];
        const isBad = habit.category && habit.category.toLowerCase().includes('bad');

        const card = document.createElement('div');
        card.className = `anime-card-cell`;
        card.innerHTML = `
          <div class="anime-card-body ${isDone ? 'completed' : ''}" style="background: ${isBad ? 'linear-gradient(135deg, #1F1015 0%, #15090C 100%)' : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'}; border: 2px solid ${isBad ? '#BE123C' : '#3B82F6'};">
            <div class="card-left-info">
              <div class="card-flame-tag" style="border-color: ${isBad ? '#F43F5E' : '#38BDF8'}; color: ${isBad ? '#FB7185' : '#38BDF8'};">
                <span>${isBad ? '🛡️' : '⚡'}</span>
                <span>${habit.timeBlock} • ${habit.category}</span>
              </div>
              <h2 class="card-title-bold" style="font-size: 17px;">${habit.name}</h2>
              <p class="card-subtitle-small">${habit.outcome || habit.description || 'Notion Zeus Habit Protocol'}</p>
              <div class="card-meta-indicators">
                <span>📊 ${habit.priority}</span>
                <span>✨ +${habit.xp} XP</span>
                <span>🪙 +${habit.gold} Gold</span>
              </div>
            </div>

            <button class="card-square-check" aria-label="Mark done" data-id="${habit.id}">
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
      return;
    }

    // SOURCE 2: NOTION MASTER CALENDAR TASKS
    if (this.activeSource === 'notion-tasks') {
      if (this.notionTasks.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 16px; color: #94A3B8;">
            <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
            <strong style="color: #FFF;">No pending tasks in Notion Calendar</strong>
            <p style="font-size: 12px; margin-top: 4px;">All scheduled events for today are complete.</p>
          </div>
        `;
        return;
      }

      this.notionTasks.forEach(task => {
        const isDone = !!this.state.notionDoneToday[task.id];
        const dateStr = task.date ? new Date(task.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Flexible';

        const card = document.createElement('div');
        card.className = `anime-card-cell`;
        card.innerHTML = `
          <div class="anime-card-body ${isDone ? 'completed' : ''}" style="background: linear-gradient(135deg, #111827 0%, #1F2937 100%); border: 2px solid #6366F1;">
            <div class="card-left-info">
              <div class="card-flame-tag" style="border-color: #818CF8; color: #A5B4FC;">
                <span>📅</span>
                <span>${dateStr} • ${task.type}</span>
              </div>
              <h2 class="card-title-bold" style="font-size: 17px;">${task.title}</h2>
              <p class="card-subtitle-small">Master Calendar Task • Priority: ${task.priority}</p>
              <div class="card-meta-indicators">
                <span>🎯 Boss Quest</span>
                <span>✨ +40 XP</span>
                <span>🪙 +25 Gold</span>
              </div>
            </div>

            <button class="card-square-check" aria-label="Mark done" data-id="${task.id}">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
          </div>
        `;

        const checkBtn = card.querySelector('.card-square-check');
        checkBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleNotionTaskDone(task);
        });

        container.appendChild(card);
      });
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

  toggleNotionHabitDone(habit) {
    const isDone = !this.state.notionDoneToday[habit.id];
    if (isDone) {
      this.state.notionDoneToday[habit.id] = true;
      this.state.xp += habit.xp;
      this.applySpideyRpgReward(habit.name, habit.xp, habit.gold, 38, 'DISCIPLINE');
    } else {
      delete this.state.notionDoneToday[habit.id];
      this.state.xp = Math.max(0, this.state.xp - habit.xp);
      this.playSfx('bell');
    }
    this.saveState();
    this.renderHabitCards();
  }

  toggleNotionTaskDone(task) {
    const isDone = !this.state.notionDoneToday[task.id];
    if (isDone) {
      this.state.notionDoneToday[task.id] = true;
      this.state.xp += 40;
      this.applySpideyRpgReward(task.title, 40, 25, 42, 'FOCUS');
    } else {
      delete this.state.notionDoneToday[task.id];
      this.state.xp = Math.max(0, this.state.xp - 40);
      this.playSfx('bell');
    }
    this.saveState();
    this.renderHabitCards();
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
      this.state.xp += 50;
      const habit = this.state.habits.find(h => h.id === habitId);
      if (habit) habit.streak++;
      if (habitId === 'habit_water') this.state.waterDrankLiters += 2;
      this.applySpideyRpgReward(habit ? habit.title : 'Habit Complete', 50, 25, 45, 'DISCIPLINE');
    } else {
      delete this.state.completedToday[habitId];
      this.state.xp = Math.max(0, this.state.xp - 50);
      const habit = this.state.habits.find(h => h.id === habitId);
      if (habit) habit.streak = Math.max(1, habit.streak - 1);
    }
    this.saveState();
    this.renderHabitCards();
  }

  // =========================================================================
  // TAB 2: HELLO HABIT (TRACKER & REPORTS - EXACT USER IMAGE 4)
  // =========================================================================
  setupHelloHabitTab() {
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
    const dayCells = document.querySelectorAll('#hello-week-strip .cal-day-cell');
    dayCells.forEach(cell => {
      cell.addEventListener('click', () => {
        dayCells.forEach(c => c.classList.remove('active'));
        cell.classList.add('active');
        this.helloTracker.selectedDay = cell.dataset.day;
        this.playSfx('bell');
        this.renderTrackerSplitCards();
      });
    });

    // Add Goal Button (+)
    document.getElementById('btn-hello-add-goal')?.addEventListener('click', () => {
      const name = prompt('Add new habit goal:', 'Meditate 10m');
      if (name && name.trim()) {
        const id = `custom_${Date.now()}`;
        this.helloTracker.daily[id] = {
          name: name.trim(),
          cur: 0,
          tgt: 1,
          unit: 'time',
          streak: 1,
          color: 'teal',
          step: 1
        };
        this.renderTrackerSplitCards();
        this.playSfx('reward');
        this.showSpideyToast('NEW GOAL CREATED', 'READY 🎯', `Habit "${name.trim()}" added to Hello Habit tracker!`);
      }
    });

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
      this.currentYear = 2026;
      if (yLabel) yLabel.textContent = this.currentYear;
      this.renderHeatmapMatrices();
      this.playSfx('bell');
    });

    // Save Image & Share Report
    document.getElementById('btn-export-save')?.addEventListener('click', () => {
      this.showSpideyToast('REPORT GRAPHIC SAVED', 'SUCCESS 📷', 'High-res Hello Habit summary saved to camera roll.');
      this.playSfx('reward');
    });

    document.getElementById('btn-export-share')?.addEventListener('click', () => {
      const summary = `📊 Hello Habit Report (${this.currentYear}):\n• Exercise: 77%\n• Study: 72%\n• Journal: 68%\n• Run: 66%\n• Practice Piano: 63%\nBuilt with Life Reset 66 日間 & Spider-Man Life RPG!`;
      try { navigator.clipboard.writeText(summary); } catch (_) {}
      this.showSpideyToast('SHARE LINK COPIED', 'COPIED 📤', 'Full habit report summary copied to clipboard!');
      this.playSfx('reward');
    });
  }

  renderReportsSubview() {
    if (this.activeSubview === 'reports') {
      this.renderHeatmapMatrices();
    } else {
      this.renderTrackerSplitCards();
    }
  }

  renderTrackerSplitCards() {
    const dailyContainer = document.getElementById('daily-split-cards');
    const weeklyContainer = document.getElementById('weekly-split-cards');
    if (!dailyContainer || !weeklyContainer) return;

    dailyContainer.innerHTML = '';
    weeklyContainer.innerHTML = '';

    // Render Daily Goals
    Object.entries(this.helloTracker.daily).forEach(([k, g]) => {
      const tile = document.createElement('div');
      tile.className = 'split-goal-tile';
      const pct = Math.min(100, Math.round((g.cur / g.tgt) * 100));

      let trackHtml = '';
      if (k === 'water') {
        // 8 rounded dash segments (Image 4 exact)
        trackHtml = `
          <div class="split-dots-track">
            ${Array.from({ length: 8 }).map((_, i) => `<div class="split-dash-segment ${i < g.cur ? 'filled blue' : ''}"></div>`).join('')}
          </div>
        `;
      } else if (k === 'steps') {
        // 20 mini-dot pills (Image 4 exact)
        const filledDots = Math.min(20, Math.round((g.cur / g.tgt) * 20));
        trackHtml = `
          <div class="split-mini-dots-row">
            ${Array.from({ length: 20 }).map((_, i) => `<div class="mini-dot-pill ${i < filledDots ? 'filled teal' : ''}"></div>`).join('')}
          </div>
        `;
      } else {
        // 16 coral dots
        const filledDots = Math.min(16, Math.round((g.cur / g.tgt) * 16));
        trackHtml = `
          <div class="split-mini-dots-row">
            ${Array.from({ length: 16 }).map((_, i) => `<div class="mini-dot-pill ${i < filledDots ? 'filled coral' : ''}"></div>`).join('')}
          </div>
        `;
      }

      tile.innerHTML = `
        <div class="split-pastel-left ${g.color}">${g.name}</div>
        <div class="split-data-right">
          <div class="split-data-top">
            <span class="split-timeframe-sub">Today</span>
            <span class="split-streak-pill">${g.streak} 🔥</span>
          </div>
          <div class="split-val-center">
            <span class="split-val-bold">${g.cur.toLocaleString()} ${g.unit}</span>
            <span class="split-target-sub">Goal: ${g.tgt.toLocaleString()} ${g.unit}</span>
          </div>
          ${trackHtml}
        </div>
      `;

      // Tap card increments progress!
      tile.addEventListener('click', () => {
        g.cur += g.step;
        if (g.cur >= g.tgt && g.cur - g.step < g.tgt) {
          g.streak++;
          this.applySpideyRpgReward(g.name, 35, 20, 35, 'WILLPOWER');
        } else {
          this.playSfx('bell');
        }
        if (k === 'water' && g.cur > 8) g.cur = 1; // loop or reset
        this.renderTrackerSplitCards();
      });

      dailyContainer.appendChild(tile);
    });

    // Render Weekly Goals
    Object.entries(this.helloTracker.weekly).forEach(([k, g]) => {
      const tile = document.createElement('div');
      tile.className = 'split-goal-tile';

      let trackHtml = '';
      if (k === 'exercise') {
        // 3 large segments (Image 4 exact)
        trackHtml = `
          <div class="split-dots-track">
            ${Array.from({ length: 3 }).map((_, i) => `<div class="split-dash-segment ${i < g.cur ? 'filled purple' : ''}"></div>`).join('')}
          </div>
        `;
      } else {
        // 16 slate mini-dots
        const filledDots = Math.min(16, Math.round((g.cur / g.tgt) * 16));
        trackHtml = `
          <div class="split-mini-dots-row">
            ${Array.from({ length: 16 }).map((_, i) => `<div class="mini-dot-pill ${i < filledDots ? 'filled slate' : ''}"></div>`).join('')}
          </div>
        `;
      }

      tile.innerHTML = `
        <div class="split-pastel-left ${g.color}">${g.name}</div>
        <div class="split-data-right">
          <div class="split-data-top">
            <span class="split-timeframe-sub">This Week</span>
            <span class="split-streak-pill">${g.streak} 🔥</span>
          </div>
          <div class="split-val-center">
            <span class="split-val-bold">${g.cur.toLocaleString()} ${g.unit}</span>
            <span class="split-target-sub">Goal: ${g.tgt.toLocaleString()} ${g.unit}</span>
          </div>
          ${trackHtml}
        </div>
      `;

      // Tap card increments progress!
      tile.addEventListener('click', () => {
        g.cur += g.step;
        if (g.cur >= g.tgt && g.cur - g.step < g.tgt) {
          g.streak++;
          this.applySpideyRpgReward(g.name, 45, 25, 40, 'DISCIPLINE');
        } else {
          this.playSfx('bell');
        }
        if (k === 'exercise' && g.cur > 3) g.cur = 1;
        this.renderTrackerSplitCards();
      });

      weeklyContainer.appendChild(tile);
    });
  }

  renderHeatmapMatrices() {
    const container = document.getElementById('heatmaps-list-container');
    const tooltip = document.getElementById('heatmap-popover-tooltip');
    if (!container) return;
    container.innerHTML = '';

    const reportHabits = [
      { name: 'Exercise', pct: 77, theme: 'theme-red', streak: 15 },
      { name: 'Study', pct: 72, theme: 'theme-blue', streak: 12 },
      { name: 'Journal', pct: 68, theme: 'theme-slate', streak: 18 },
      { name: 'Run', pct: 66, theme: 'theme-teal', streak: 9 },
      { name: 'Practice Piano', pct: 63, theme: 'theme-purple', streak: 7 }
    ];

    const cols = this.activePeriod === 'week' ? 7 : this.activePeriod === 'month' ? 30 : 52;

    reportHabits.forEach(h => {
      const card = document.createElement('div');
      card.className = `heatmap-unit-card ${h.theme}`;
      card.innerHTML = `
        <div class="heatmap-unit-header">
          <div class="heatmap-habit-label">
            <span class="heatmap-round-dot">✓</span>
            <span>${h.name}</span>
          </div>
          <span class="heatmap-percentage-num">${h.pct}%</span>
        </div>
        <div class="heatmap-square-grid" style="grid-template-columns: repeat(${cols}, 1fr)">
          <!-- Generated blocks -->
        </div>
      `;

      const gridEl = card.querySelector('.heatmap-square-grid');
      const totalCells = cols * 4;

      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        const isHit = Math.random() < (h.pct / 100);
        const intensity = Math.floor(Math.random() * 4) + 1;
        cell.className = `hm-cell ${isHit ? `is-hit active-${intensity}` : ''}`;

        // Compute simulated date
        const weekNum = Math.floor(i / 4) + 1;
        const dayIdx = (i % 4) + 1;
        const cellDate = `W${weekNum} Day ${dayIdx}, ${this.currentYear}`;

        // Tooltip interaction
        cell.addEventListener('mouseenter', (e) => {
          if (!tooltip) return;
          const rect = cell.getBoundingClientRect();
          const frameRect = document.querySelector('.phone-frame').getBoundingClientRect();

          document.getElementById('hm-tip-date').textContent = `${h.name} • ${cellDate}`;
          document.getElementById('hm-tip-status').textContent = isHit ? `✓ Completed (Streak: ${h.streak}d)` : `✕ Incomplete (Missed day)`;

          tooltip.style.left = `${Math.min(frameRect.width - 180, Math.max(10, rect.left - frameRect.left - 50))}px`;
          tooltip.style.top = `${rect.top - frameRect.top - 46}px`;
          tooltip.style.display = 'flex';
        });

        cell.addEventListener('mouseleave', () => {
          if (tooltip) tooltip.style.display = 'none';
        });

        cell.addEventListener('click', () => {
          cell.classList.toggle('is-hit');
          cell.classList.toggle('active-3');
          this.playSfx('bell');
        });

        gridEl.appendChild(cell);
      }

      container.appendChild(card);
    });
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

    for (let d = 1; d <= 66; d++) {
      const cell = document.createElement('div');
      const isDone = d < this.state.day;
      const isToday = d === this.state.day;

      cell.className = `pathway-cell ${isDone ? 'done' : ''} ${isToday ? 'active' : ''}`;
      cell.textContent = d;

      cell.addEventListener('click', () => {
        let phase = 'Stage 1: Destruction';
        if (d > 22 && d <= 44) phase = 'Stage 2: Installation';
        else if (d > 44) phase = 'Stage 3: Integration';
        this.openAlert(`Day ${d} • ${phase}`, 'Keep your daily momentum intact without zero-days.');
      });

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
        this.focusTimerInterval = setInterval(() => {
          this.focusSeconds--;
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
