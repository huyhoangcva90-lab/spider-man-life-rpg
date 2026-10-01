import { SoundController } from '../js/core/SoundController.js?v=tracker-audio-1';
import { LifeDataGateway } from './LifeDataGateway.js?v=notion-cloud-1';
import { LifeResetEngine, CORE_PILLARS, RESET_STAGES, WISDOM_CARDS } from './LifeResetEngine.js?v=reset66-1';

if (new URLSearchParams(location.search).get('embed') === '1') document.body.classList.add('is-embedded');

const CLOUD_ORIGIN = document.documentElement.dataset.cloudOrigin || location.origin;
const CLOUD_KEYS = { routine: 'spidery-routine-v1', dopamine: 'spidery-dopamine-v1' };
const cloudUrl = (key) => `${CLOUD_ORIGIN.replace(/\/$/, '')}/api/cloud?key=${encodeURIComponent(CLOUD_KEYS[key])}`;
const dateKey = () => new Date().toLocaleDateString('en-CA');
const gateway = new LifeDataGateway({ origin: CLOUD_ORIGIN, journalDatabase: document.documentElement.dataset.notionJournalDatabase || '' });

const cloudSeeds = {
  routine: { routines: [
    { id: 'morning', name: 'Morning', window: '06:00–08:30', tasks: ['Uống nước', 'Ánh sáng buổi sáng', 'Vệ sinh cá nhân', 'Lập 3 ưu tiên'] },
    { id: 'yoga', name: 'Yoga', window: '08:30–09:15', tasks: ['Khởi động', 'Sun salutation', 'Mobility', 'Thở 3 phút'] },
    { id: 'workout', name: 'Workout', window: '16:00–19:30', tasks: ['Warm-up', 'Main lift', 'Accessory', 'Cooldown'] },
    { id: 'lunch', name: 'Lunch Break', window: '12:00–13:30', tasks: ['Ăn không màn hình', 'Đi bộ 10 phút', 'Power nap ngắn'] },
    { id: 'night', name: 'Night', window: '21:30–23:00', tasks: ['Đóng màn hình', 'Skincare', 'Journal', 'Chuẩn bị ngày mai'] }
  ], checks: {} },
  dopamine: { menus: [
    { name: 'Dopamine', items: ['Đi bộ ngoài trời', 'Nghe 1 album', 'Tắm nước ấm', 'Gọi một người bạn', 'Vẽ 10 phút'] },
    { name: 'Places', items: ['Quán cà phê mới', 'Công viên gần nhà', 'Nhà sách', 'Bảo tàng', 'Đi một tuyến đường mới'] },
    { name: 'Eating Out', items: ['Phở', 'Bún chả', 'Cơm gà', 'Sushi', 'Món chưa từng thử'] },
    { name: 'Stretches', items: ['Vai và cổ', 'Lưng dưới', 'Hông', 'Hamstring', 'Full body 8 phút'] },
    { name: 'Mood Reset', items: ['Box breathing', 'Dọn mặt bàn', 'Ra ban công', 'Viết brain dump', 'Nghe một bài vui'] },
    { name: 'Games', items: ['Một ván cờ', 'Puzzle 10 phút', 'Game co-op', 'Board game', 'Sudoku'] }
  ] }
};

const notion = { tasks: [], habits: [], timetable: [], journal: [], plans: [], workouts: [], source: 'loading', journalConfigured: false };
const cloud = { routine: structuredClone(cloudSeeds.routine), dopamine: structuredClone(cloudSeeds.dopamine) };
let lifeSoundEnabled = (() => { try { return localStorage.getItem('spidey-sfx-enabled') !== '0'; } catch { return true; } })();
const sound = new SoundController({ get: (key) => key === 'soundEnabled' && lifeSoundEnabled });
sound.init();
let toastTimer;

function escapeHtml(value) { const node = document.createElement('div'); node.textContent = String(value ?? ''); return node.innerHTML; }
function toast(message) { const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2800); }
function metric(value, label) { return `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`; }
function setCloudStatus(key, stateName, message) { const el = document.querySelector(`[data-cloud-status="${key}"]`); if (!el) return; el.dataset.state = stateName; el.querySelector('span').textContent = message; }
function setNotionStatus() {
  const label = notion.source === 'live' ? 'NOTION LIVE' : notion.source === 'snapshot' ? 'NOTION CACHE' : notion.source === 'loading' ? 'NOTION CONNECTING' : 'NOTION OFFLINE';
  document.getElementById('sync-label').textContent = label;
  document.querySelectorAll('[data-notion-status]').forEach((element) => { element.dataset.state = notion.source; element.textContent = label; });
}

async function loadCloud(key) {
  setCloudStatus(key, 'saving', 'Đang tải kho online chung…');
  try {
    const response = await fetch(cloudUrl(key), { credentials: 'include', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload?.ok === false) throw new Error(payload.error || 'Cloud rejected the request');
    const onlineData = payload?.data ?? payload;
    if (onlineData && typeof onlineData === 'object' && Object.keys(onlineData).length) cloud[key] = { ...cloud[key], ...onlineData };
    else await saveCloud(key, false);
    setCloudStatus(key, 'online', 'ONLINE · một danh sách cho mọi thiết bị');
  } catch (error) {
    setCloudStatus(key, 'offline', 'OFFLINE · chưa ghi sang dữ liệu riêng');
    console.warn(`[Spider Life OS] ${key} cloud unavailable`, error);
  }
  renderRoutine(); renderDopamine();
}

async function saveCloud(key, announce = true) {
  setCloudStatus(key, 'saving', 'Đang lưu vào kho online chung…');
  try {
    const response = await fetch(cloudUrl(key), { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cloud[key]) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setCloudStatus(key, 'online', 'ONLINE · đã đồng bộ mọi thiết bị');
    if (announce) toast('Đã lưu vào Spider Cloud.');
    return true;
  } catch (error) {
    setCloudStatus(key, 'offline', 'Lưu online thất bại · thay đổi chưa được chốt');
    toast('Cloud chưa phản hồi. Không tạo bản local khác.');
    return false;
  }
}

async function loadNotion() {
  notion.source = 'loading'; setNotionStatus();
  try { Object.assign(notion, await gateway.loadAll()); }
  catch (error) { notion.source = 'offline'; console.warn('[Spider Life OS] Notion unavailable', error); }
  setNotionStatus(); renderNotionViews();
}

const resetEngine = new LifeResetEngine();

function showView(name) {
  document.querySelectorAll('.system-nav').forEach((button) => button.classList.toggle('active', button.dataset.view === name));
  document.querySelectorAll('.os-view').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === name));
  const labels = {
    reset66: 'LIFE RESET // 66-DAY PROTOCOL',
    today: 'TODAY // NOTION MISSIONS',
    routine: 'ROUTINE // SHARED CLOUD',
    dopamine: 'DOPAMINE // SHARED CLOUD',
    timetable: 'TIMETABLE // NOTION CITY CLOCK',
    habits: 'HABITS // NOTION TRACKER',
    journal: 'CHRONICLE // NOTION',
    gym: 'GYM OS // NOTION PERFORMANCE'
  };
  document.getElementById('view-kicker').textContent = labels[name] || 'SPIDER LIFE OS';
  history.replaceState(null, '', `#${name}`);
  if (name === 'reset66') renderReset66();
}

function renderToday() {
  const done = notion.tasks.filter((task) => task.done).length;
  document.getElementById('today-metrics').innerHTML = metric(`${done}/${notion.tasks.length}`, 'NOTION COMPLETE') + metric(notion.tasks.length - done, 'OPEN MISSIONS') + metric(notion.source === 'live' ? 'LIVE' : notion.source === 'snapshot' ? 'CACHE' : '—', 'DATA SIGNAL');
  document.getElementById('task-list').innerHTML = notion.tasks.length ? notion.tasks.map((task) => `<article class="mission-card ${task.done ? 'done' : ''}" data-task="${task.id}"><button class="task-check" aria-label="Đánh dấu ${escapeHtml(task.title)}">${task.done ? '✓' : ''}</button><div><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.area)} // ${escapeHtml(task.priority || 'NOTION')}</small></div>${task.sourceUrl ? `<a class="source-link" href="${task.sourceUrl}" target="_blank" rel="noopener">NOTION ↗</a>` : ''}</article>`).join('') : '<div class="empty-state">Không nhận được mission từ Notion. Kiểm tra trạng thái kết nối ở góc trên.</div>';
  document.getElementById('task-form')?.querySelectorAll('input,select,button').forEach((control) => { control.disabled = notion.source !== 'live'; });
  document.querySelectorAll('[data-task] .task-check').forEach((control) => { control.disabled = notion.source !== 'live'; });
}

function renderRoutine() {
  const checks = cloud.routine.checks?.[dateKey()] || {};
  document.getElementById('routine-grid').innerHTML = cloud.routine.routines.map((routine) => {
    const count = routine.tasks.filter((_, index) => checks[`${routine.id}:${index}`]).length;
    return `<article class="routine-card"><header><h3>${escapeHtml(routine.name)}</h3><span>${escapeHtml(routine.window)} · ${count}/${routine.tasks.length}</span></header><div class="routine-tasks">${routine.tasks.map((task, index) => `<label class="routine-task"><input type="checkbox" data-routine-check="${routine.id}:${index}" ${checks[`${routine.id}:${index}`] ? 'checked' : ''}/><span>${escapeHtml(task)}</span></label>`).join('')}</div><div class="routine-progress"><i style="width:${routine.tasks.length ? count / routine.tasks.length * 100 : 0}%"></i></div></article>`;
  }).join('');
}

function renderDopamine() {
  const menuSelect = document.getElementById('dopamine-menu');
  const selected = menuSelect?.value;
  if (menuSelect) {
    menuSelect.innerHTML = cloud.dopamine.menus.map((menu, index) => `<option value="${index}">${escapeHtml(menu.name)}</option>`).join('');
    if (selected && Number(selected) < cloud.dopamine.menus.length) menuSelect.value = selected;
  }
  document.getElementById('dopamine-grid').innerHTML = cloud.dopamine.menus.map((menu, index) => `<article class="dopamine-card"><header><h3>${escapeHtml(menu.name)}</h3><span>${menu.items.length} SIGNALS</span></header><ul>${menu.items.slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><button data-shuffle="${index}">CHỌN MỘT</button></article>`).join('');
}

function pickDopamine(menuIndex = null) {
  const menu = menuIndex === null ? cloud.dopamine.menus[Math.floor(Math.random() * cloud.dopamine.menus.length)] : cloud.dopamine.menus[menuIndex];
  const pick = menu.items[Math.floor(Math.random() * menu.items.length)];
  const result = document.getElementById('dopamine-result'); result.querySelector('strong').textContent = pick; result.querySelector('small').textContent = `${menu.name} // làm trong 5–30 phút, không cần hoàn hảo.`;
  result.animate([{ transform: 'scale(.98)', filter: 'brightness(1.8)' }, { transform: 'scale(1)', filter: 'none' }], { duration: 420, easing: 'steps(4)' });
}

function scheduleForDisplay() {
  const today = dateKey();
  const todays = notion.timetable.filter((task) => task.date?.slice(0, 10) === today);
  return (todays.length ? todays : notion.timetable.filter((task) => !task.done)).slice(0, 12);
}

function renderTimetable() {
  const tasks = scheduleForDisplay(); const now = new Date();
  const currentIndex = tasks.reduce((best, task, index) => new Date(task.date) <= now ? index : best, -1);
  const active = tasks[Math.max(0, currentIndex)] || null; const next = tasks.find((task) => new Date(task.date) > now) || null;
  const orbit = document.querySelector('.clock-orbit');
  if (orbit) {
    orbit.querySelectorAll('.orbit-mission').forEach((node) => node.remove());
    tasks.forEach((task, index) => { const date = new Date(task.date); const angle = ((date.getHours() + date.getMinutes() / 60) / 24 * 360) - 90; const marker = document.createElement('i'); marker.className = `orbit-mission ${index === currentIndex ? 'current' : ''}`; marker.style.setProperty('--angle', `${angle}deg`); marker.title = task.title; orbit.appendChild(marker); });
  }
  document.getElementById('active-slot').innerHTML = active ? `<span>● CITY SIGNAL // ${new Date(active.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span><strong>${escapeHtml(active.title)}</strong><small>${next ? `NEXT SWING → ${escapeHtml(next.title)} · ${new Date(next.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'PATROL QUEUE CLEAR'}</small>` : '<span>● NOTION TIMETABLE</span><strong>CHƯA CÓ LỊCH</strong><small>Thêm ngày/giờ trong Notion để nhiệm vụ xuất hiện trên City Clock.</small>';
  document.getElementById('timeline').innerHTML = tasks.length ? tasks.map((task, index) => `<article class="time-slot ${index === currentIndex ? 'current' : ''}"><b>${new Date(task.date).toLocaleString('vi-VN', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</b><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.area || 'NOTION')} // ${task.done ? 'DONE' : index === currentIndex ? 'ACTIVE SIGNAL' : 'UPCOMING'}</small></article>`).join('') : '<div class="empty-state">Notion chưa trả về task có ngày/giờ.</div>';
}

function renderHabits() {
  const render = (group) => notion.habits.filter((habit) => habit.group === group).map((habit) => `<button class="habit-card ${habit.done ? 'checked' : ''}" data-habit="${habit.id}" ${notion.source === 'live' ? '' : 'disabled'}><span>${escapeHtml(habit.icon)}</span><div><strong>${escapeHtml(habit.title)}</strong><small>${habit.done ? 'NOTION // HOÀN THÀNH' : escapeHtml(habit.timeBlock || (notion.source === 'live' ? 'CHẠM ĐỂ CHECK-IN' : 'CACHE READ-ONLY'))}</small></div><i></i></button>`).join('');
  document.getElementById('limit-grid').innerHTML = render('limit') || '<div class="empty-state">Không có habit giới hạn.</div>';
  document.getElementById('habit-grid').innerHTML = render('good') || '<div class="empty-state">Không có habit tích cực.</div>';
  const done = notion.habits.filter((habit) => habit.done).length;
  document.getElementById('habit-score').textContent = `${notion.habits.length ? Math.round(done / notion.habits.length * 100) : 0}%`;
}

function renderJournal() {
  document.getElementById('journal-feed').innerHTML = notion.journal.length ? notion.journal.map((entry) => `<article class="journal-card"><header><span>${escapeHtml(entry.mood)}</span><small>${new Date(entry.createdAt).toLocaleString('vi-VN')}</small></header><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.content)}</p>${entry.sourceUrl ? `<a class="source-link" href="${entry.sourceUrl}" target="_blank" rel="noopener">MỞ TRONG NOTION ↗</a>` : ''}</article>`).join('') : `<div class="empty-state">${notion.journalConfigured ? 'Notion Journal đang trống.' : 'Journal không tạo bản local. Cần cấu hình Notion Journal database để đọc và ghi entry.'}</div>`;
  const form = document.getElementById('journal-form');
  if (form) form.hidden = !notion.journalConfigured || notion.source !== 'live';
}

function renderGym() {
  const recent = notion.workouts.filter((workout) => new Date(workout.createdAt).getTime() >= Date.now() - 7 * 86400000); const volume = recent.reduce((sum, workout) => sum + workout.volume, 0);
  document.getElementById('gym-stats').innerHTML = metric(recent.length, 'SESSIONS / 7D') + metric(notion.workouts.length, 'NOTION LOGS') + metric(`${Math.round(volume)}kg`, 'WEEK VOLUME') + metric(notion.plans.length, 'ACTIVE PLANS');
  document.getElementById('gym-routines').innerHTML = notion.plans.length ? notion.plans.map((plan) => `<a class="gym-routine" href="${plan.sourceUrl}" target="_blank" rel="noopener"><h3>${escapeHtml(plan.name)}</h3><p>${escapeHtml(plan.focus)}</p><small>${escapeHtml(plan.detail || 'NOTION WORKOUT PLAN')}</small></a>`).join('') : '<div class="empty-state">Chưa nhận được Workout Plan từ Notion.</div>';
  document.getElementById('workout-feed').innerHTML = notion.workouts.length ? notion.workouts.slice(0, 30).map((workout) => `<a class="workout-card" href="${workout.sourceUrl}" target="_blank" rel="noopener"><strong>${escapeHtml(workout.name)}</strong><small>${new Date(workout.createdAt).toLocaleString('vi-VN')} // ${workout.kind} ${workout.duration ? `// ${workout.duration} MIN` : ''}</small></a>`).join('') : '<div class="empty-state">Chưa có activity từ Notion.</div>';
}

/* =========================================================================
   LIFE RESET: 66 DAY HABIT RENDER & INTERACTIVE CONTROLLERS
   ========================================================================= */
let selectedRoadmapDay = null;
let currentQuestTimeFilter = 'all';
let heroCurrentLevel = 1;

// Timer State
let timerSeconds = 25 * 60;
let timerDuration = 25 * 60;
let timerInterval = null;
let timerRunning = false;
let timerAudioContext = null;

// Breathwork State
let breathRunning = false;
let breathInterval = null;
let breathPhase = 0; // 0: inhale, 1: hold1, 2: exhale, 3: hold2
let breathCountdown = 4;
let breathCycles = 0;

function renderReset66() {
  const snap = resetEngine.getSnapshot();
  const day = snap.currentDay;
  const stage = snap.stage;
  const rank = snap.rank;

  // Hero Rank Bar
  const badgeRankEl = document.getElementById('hero-rank-badge');
  if (badgeRankEl) badgeRankEl.textContent = rank.badge;
  const nameRankEl = document.getElementById('hero-rank-name');
  if (nameRankEl) nameRankEl.textContent = rank.name;
  const descRankEl = document.getElementById('hero-rank-desc');
  if (descRankEl) descRankEl.textContent = rank.isMax ? 'CẤP ĐỘ CAO NHẤT // SUPERIOR SPIDER' : `CẤP ĐỘ ${rank.level} // ${rank.progressPercent}% ĐẾN TIẾP THEO`;
  const xpRankText = document.getElementById('hero-rank-xp-text');
  if (xpRankText) xpRankText.textContent = `${rank.currentXp} / ${rank.nextXp} XP`;
  const barRankFill = document.getElementById('hero-rank-bar-fill');
  if (barRankFill) barRankFill.style.width = `${rank.progressPercent}%`;

  // Header metrics
  const dayEl = document.getElementById('metric-day');
  if (dayEl) dayEl.textContent = day;
  const streakEl = document.getElementById('metric-streak');
  if (streakEl) streakEl.textContent = snap.streak;
  const xpEl = document.getElementById('metric-xp');
  if (xpEl) xpEl.textContent = snap.totalXp;

  // Daily Chest Button
  const chestBtn = document.getElementById('btn-daily-chest');
  const chestBadge = document.getElementById('chest-status-badge');
  const completedCount = Object.values(snap.today.pillars || {}).filter(Boolean).length;
  if (chestBtn && chestBadge) {
    if (snap.today.chestClaimed) {
      chestBtn.className = 'daily-chest-btn claimed';
      chestBadge.textContent = 'ĐÃ MỞ HÔM NAY ✓';
    } else if (completedCount >= 4) {
      chestBtn.className = 'daily-chest-btn ready';
      chestBadge.textContent = 'SẴN SÀNG MỞ! ✨';
    } else {
      chestBtn.className = 'daily-chest-btn';
      chestBadge.textContent = `${completedCount}/4 ĐỂ MỞ`;
    }
  }

  // Stage banner
  const badgeEl = document.getElementById('stage-badge');
  if (badgeEl) {
    badgeEl.textContent = stage.badge;
    badgeEl.style.backgroundColor = stage.color;
  }
  const titleEl = document.getElementById('stage-title');
  if (titleEl) titleEl.textContent = `${stage.name} // ${stage.subtitle}`;
  const descEl = document.getElementById('stage-desc');
  if (descEl) descEl.textContent = stage.description;
  const progressEl = document.getElementById('stage-progress-fill');
  if (progressEl) progressEl.style.width = `${Math.min(100, Math.max(2, (day / 66) * 100))}%`;

  // Hard Mode Badge
  const hardModeEl = document.getElementById('hard-mode-indicator');
  if (hardModeEl) {
    hardModeEl.classList.toggle('active', snap.hardMode);
    hardModeEl.textContent = snap.hardMode ? '⚡ HARD MODE (ON)' : 'NORMAL MODE';
  }

  // Quests tab
  renderPillars(snap);
  renderCustomHabits(snap);
  renderNotionSyncedQuests();

  // Roadmap tab
  renderRoadmap(snap, selectedRoadmapDay || day);

  // Mini-tools
  updateWaterFlask(snap.waterLoggedMl, snap.waterGoalMl);

  // Analytics tab
  drawRadarChart(snap.radar);
  renderHeatmap(snap);
  renderStatsSummary(snap);
}

function renderPillars(snap) {
  const container = document.getElementById('pillars-grid');
  const notionSection = document.getElementById('notion-synced-quests');
  if (!container) return;

  if (currentQuestTimeFilter === 'notion') {
    container.style.display = 'none';
    if (notionSection) notionSection.hidden = false;
    return;
  }

  container.style.display = 'grid';
  if (notionSection) notionSection.hidden = true;

  const today = snap.today;
  const completedCount = Object.values(today.pillars || {}).filter(Boolean).length;
  const headline = document.getElementById('quests-score-headline');
  if (headline) headline.textContent = `TIẾN ĐỘ HÔM NAY // ${completedCount} / 6 TRỤ CỘT (+${today.xpEarned || 0} XP)`;

  let filtered = CORE_PILLARS;
  if (currentQuestTimeFilter === 'morning') {
    filtered = CORE_PILLARS.filter((p) => p.timeOfDay === 'morning' || p.timeOfDay === 'all');
  } else if (currentQuestTimeFilter === 'evening') {
    filtered = CORE_PILLARS.filter((p) => p.timeOfDay === 'evening' || p.timeOfDay === 'night' || p.timeOfDay === 'all');
  }

  container.innerHTML = filtered.map((p) => {
    const isChecked = !!(today.pillars && today.pillars[p.id]);
    const streak = snap.habitStats?.[p.id]?.streak || 0;
    return `<article class="pillar-card ${isChecked ? 'checked' : ''}" data-pillar="${p.id}">
      <div class="pillar-icon-box" data-open-detail="${p.id}" title="Bấm để xem lịch sử thói quen">${p.icon}</div>
      <div class="pillar-body" data-open-detail="${p.id}" style="cursor:pointer;" title="Bấm để xem lịch sử thói quen">
        <span><span class="pillar-tier-pill tier-${p.tier.toLowerCase()}">${p.tier}</span>${p.attribute} // +${p.xp} XP <span class="pillar-streak-tag">🔥 ${streak}d</span></span>
        <h4>${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.rule)} <small style="display:block;margin-top:2px;color:var(--cyan)">Mục tiêu: ${escapeHtml(p.target)}</small></p>
      </div>
      <button class="pillar-check-btn" type="button" aria-label="Hoàn thành ${escapeHtml(p.title)}">
        ${isChecked ? '✓' : ''}
      </button>
    </article>`;
  }).join('');
}

function renderNotionSyncedQuests() {
  const container = document.getElementById('notion-quest-list');
  if (!container) return;
  const tasks = notion.tasks || [];
  const habits = notion.habits || [];

  if (!tasks.length && !habits.length) {
    container.innerHTML = '<div class="empty-state">Chưa nhận được nhiệm vụ hoặc thói quen từ Notion Workspace Zeus.</div>';
    return;
  }

  const tasksHtml = tasks.slice(0, 6).map((t) => `
    <div class="custom-habit-item ${t.done ? 'checked' : ''}">
      <span style="font-size:16px;">📝</span>
      <span class="habit-title">${escapeHtml(t.title)}</span>
      <small>${t.done ? 'ĐÃ XONG' : escapeHtml(t.area || 'NOTION TASK')}</small>
    </div>
  `).join('');

  const habitsHtml = habits.slice(0, 6).map((h) => `
    <div class="custom-habit-item ${h.done ? 'checked' : ''}">
      <span style="font-size:16px;">${escapeHtml(h.icon || '⌁')}</span>
      <span class="habit-title">${escapeHtml(h.title)}</span>
      <small>${h.done ? 'HOÀN THÀNH' : escapeHtml(h.timeBlock || 'NOTION HABIT')}</small>
    </div>
  `).join('');

  container.innerHTML = tasksHtml + habitsHtml;
}

function openHabitDetail(habitId) {
  const detail = resetEngine.getHabitDetail(habitId);
  if (!detail) return;
  const modal = document.getElementById('habit-detail-modal');
  const body = document.getElementById('habit-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
      <div style="font-size:32px;width:52px;height:52px;background:#0d2338;border:2px solid var(--line);display:grid;place-content:center;">${detail.icon}</div>
      <div>
        <h3 style="margin:0;color:#fff;font:700 13px var(--display);">${escapeHtml(detail.title)}</h3>
        <small style="color:var(--amber);font:700 8px var(--terminal);">${detail.attribute} // +${detail.xp} XP (+${detail.coins} Web Coins)</small>
      </div>
    </div>
    <p style="margin:0 0 14px;color:#bcd0d6;font-size:12px;line-height:1.5;">${escapeHtml(detail.rule)} (Mục tiêu: ${escapeHtml(detail.target)})</p>
    
    <div class="section-label">LỊCH SỬ 7 NGÀY GẦN NHẤT</div>
    <div class="recent-days-row">
      ${detail.recentDays.map((d) => `
        <div class="day-dot-box">
          <div class="day-dot ${d.done ? 'done' : 'missed'}">${d.done ? '✓' : '—'}</div>
          <span>${d.dayName}</span>
        </div>
      `).join('')}
    </div>

    <div class="habit-stats-row">
      <div class="habit-stat-box"><strong>${detail.streak} D</strong><small>CHUỖI HIỆN TẠI</small></div>
      <div class="habit-stat-box"><strong>${detail.totalDone}</strong><small>LẦN HOÀN THÀNH</small></div>
      <div class="habit-stat-box"><strong>+${detail.totalDone * detail.xp}</strong><small>TỔNG XP ĐÓNG GÓP</small></div>
    </div>
  `;

  modal.removeAttribute('hidden');
  modal.removeAttribute('inert');
  modal.classList.add('active');
  sound.playClick();
}

function renderCustomHabits(snap) {
  const container = document.getElementById('custom-habits-list');
  if (!container) return;
  const list = snap.customHabits || [];
  const todayHabits = snap.today.customHabits || [];
  if (!list.length) {
    container.innerHTML = '<div style="font-size:11px;color:var(--muted);padding:8px;">Chưa có thói quen riêng. Nhập vào form trên để thêm thói quen bổ trợ.</div>';
    return;
  }
  container.innerHTML = list.map((h) => {
    const isChecked = todayHabits.includes(h.id);
    return `<div class="custom-habit-item ${isChecked ? 'checked' : ''}" data-custom-habit="${h.id}">
      <span style="font-size:16px;">${escapeHtml(h.icon || '✦')}</span>
      <span class="habit-title">${escapeHtml(h.title)}</span>
      <small>+15 XP</small>
      <button class="btn-delete-habit" data-delete-custom="${h.id}" title="Xóa thói quen">✕</button>
    </div>`;
  }).join('');
}

function renderRoadmap(snap, inspectDayNum = null) {
  const container = document.getElementById('roadmap-grid');
  if (!container) return;
  const currentDay = snap.currentDay;
  const targetDay = inspectDayNum || currentDay;
  const milestones = [7, 14, 21, 30, 45, 60, 66];

  let nodesHtml = '';
  for (let i = 1; i <= 66; i++) {
    const stageClass = i <= 22 ? 'stage-1' : i <= 44 ? 'stage-2' : 'stage-3';
    const isMilestone = milestones.includes(i);
    const isCurrent = i === currentDay;
    const isSelected = i === targetDay;
    const isPast = i < currentDay;

    let statusClass = '';
    if (isCurrent) statusClass = 'current';
    else if (isPast) statusClass = 'done';

    nodesHtml += `<button class="roadmap-node ${stageClass} ${statusClass} ${isMilestone ? 'milestone' : ''} ${isSelected ? 'selected' : ''}" data-day-node="${i}" type="button" title="Ngày ${i}">
      ${i}
    </button>`;
  }
  container.innerHTML = nodesHtml;
  updateRoadmapInspector(targetDay, snap);
}

function updateRoadmapInspector(dayNum, snap) {
  const inspector = document.getElementById('roadmap-inspector');
  if (!inspector) return;
  document.getElementById('inspect-day-num').textContent = dayNum;

  const stage = dayNum <= 22 ? RESET_STAGES[0] : dayNum <= 44 ? RESET_STAGES[1] : RESET_STAGES[2];
  const milestones = {
    7: 'Milestone 7 Ngày: First Web Spark (+50 XP Buff)',
    14: 'Milestone 14 Ngày: Neural Awakening (+100 XP Buff)',
    21: 'Milestone 21 Ngày: Habit Shield - Vượt qua ải kháng cự (+150 XP)',
    30: 'Milestone 30 Ngày: Halfway Hero - Đã đi được gần 1/2 chặng đường (+200 XP)',
    45: 'Milestone 45 Ngày: Mastery Gate - Bước vào giai đoạn Đồng hóa (+300 XP)',
    60: 'Milestone 60 Ngày: Legend Ascent - Thói quen ăn sâu thành bản năng (+400 XP)',
    66: 'FINAL MILESTONE: SUPERIOR SPIDER - TÁI SINH HOÀN TẤT CUỘC ĐỜI (+1000 XP)'
  };

  const titleEl = document.getElementById('inspect-day-title');
  const descEl = document.getElementById('inspect-day-desc');
  const metaEl = document.getElementById('inspect-day-meta');

  if (titleEl) {
    titleEl.textContent = milestones[dayNum] ? milestones[dayNum].toUpperCase() : `NGÀY ${dayNum} // ${stage.name}`;
  }
  if (descEl) {
    descEl.textContent = milestones[dayNum] ? 'Cột mốc quan trọng trong quá trình tái cấu trúc não bộ. Hoàn thành ngày này để nhận danh hiệu đặc biệt!' : stage.description;
  }
  if (metaEl) {
    metaEl.innerHTML = `<span>GIAI ĐOẠN: ${stage.badge}</span><span>TRẠNG THÁI: ${dayNum < snap.currentDay ? 'ĐÃ QUA' : dayNum === snap.currentDay ? 'HÔM NAY' : 'CHƯA MỞ'}</span>`;
  }
}

function updateWaterFlask(loggedMl, goalMl) {
  const fill = document.getElementById('water-flask-fill');
  const text = document.getElementById('water-logged-text');
  if (fill) fill.style.height = `${Math.min(100, Math.round((loggedMl / goalMl) * 100))}%`;
  if (text) text.textContent = `${loggedMl.toLocaleString()} ml`;
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const s = (timerSeconds % 60).toString().padStart(2, '0');
  const el = document.getElementById('timer-display');
  if (el) el.textContent = `${m}:${s}`;
}

function toggleTimer() {
  const btn = document.getElementById('btn-timer-toggle');
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    if (btn) btn.textContent = '▶ TIẾP TỤC';
    toast('Đã tạm dừng Focus Timer.');
  } else {
    timerRunning = true;
    if (btn) btn.textContent = '⏸ TẠM DỪNG';
    sound.playSelect();
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        if (btn) btn.textContent = '▶ BẮT ĐẦU';
        timerSeconds = timerDuration;
        updateTimerDisplay();
        const mins = Math.round(timerDuration / 60);
        resetEngine.logFocusTimer(mins);
        sound.playTrackerJingle();
        toast(`🎉 HOÀN THÀNH PHIÊN FOCUS (${mins}m)! +${Math.round(mins * 0.8)} XP`);
        renderReset66();
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = timerDuration;
  updateTimerDisplay();
  const btn = document.getElementById('btn-timer-toggle');
  if (btn) btn.textContent = '▶ BẮT ĐẦU';
  sound.playClick();
}

function toggleBreathwork() {
  const btn = document.getElementById('btn-toggle-breath');
  const circle = document.getElementById('breath-circle');
  const text = document.getElementById('breath-action-text');
  const timer = document.getElementById('breath-timer-text');
  const countEl = document.getElementById('breath-cycle-count');

  if (breathRunning) {
    clearInterval(breathInterval);
    breathRunning = false;
    circle?.classList.remove('inhale', 'hold', 'exhale');
    if (text) text.textContent = 'SẴN SÀNG';
    if (timer) timer.textContent = '4s';
    if (btn) btn.textContent = '▶ BẮT ĐẦU LUYỆN THỞ';
    toast('Đã dừng luyện thở.');
  } else {
    breathRunning = true;
    breathPhase = 0;
    breathCountdown = 4;
    breathCycles = 1;
    if (btn) btn.textContent = '⏹ DỪNG LUYỆN THỞ';
    sound.playSelect();

    const phases = [
      { name: 'HÍT VÀO', cls: 'inhale' },
      { name: 'GIỮ HƠI', cls: 'hold' },
      { name: 'THỞ RA', cls: 'exhale' },
      { name: 'GIỮ HƠI', cls: 'hold' }
    ];

    const step = () => {
      const cur = phases[breathPhase];
      circle?.classList.remove('inhale', 'hold', 'exhale');
      circle?.classList.add(cur.cls);
      if (text) text.textContent = cur.name;
      if (timer) timer.textContent = `${breathCountdown}s`;
      if (countEl) countEl.textContent = `VÒNG: ${breathCycles} / 4`;

      breathCountdown--;
      if (breathCountdown < 0) {
        breathCountdown = 4;
        breathPhase = (breathPhase + 1) % 4;
        if (breathPhase === 0) {
          breathCycles++;
          if (breathCycles > 4) {
            clearInterval(breathInterval);
            breathRunning = false;
            circle?.classList.remove('inhale', 'hold', 'exhale');
            if (text) text.textContent = 'HOÀN THÀNH';
            if (timer) timer.textContent = '✓';
            if (btn) btn.textContent = '▶ BẮT ĐẦU LẠI';
            sound.playTrackerJingle();
            toast('Hoàn thành 4 chu kỳ Box Breathing. Hệ thần kinh đã được làm dịu!');
          }
        }
      }
    };

    step();
    breathInterval = setInterval(step, 1000);
  }
}

function drawRadarChart(radarStats) {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 105;

  ctx.clearRect(0, 0, width, height);

  const axes = [
    { key: 'WILLPOWER', label: 'WILLPOWER' },
    { key: 'AGILITY', label: 'AGILITY' },
    { key: 'POWER', label: 'POWER' },
    { key: 'INTELLECT', label: 'INTELLECT' },
    { key: 'DISCIPLINE', label: 'DISCIPLINE' },
    { key: 'FOCUS', label: 'FOCUS' }
  ];

  const total = axes.length;

  // Draw concentric webs
  for (let level = 1; level <= 3; level++) {
    const r = (radius / 3) * level;
    ctx.beginPath();
    for (let i = 0; i < total; i++) {
      const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = level === 3 ? '#397c9b' : '#1b415a';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw axis lines and labels
  ctx.font = '700 8px Silkscreen, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  axes.forEach((axis, i) => {
    const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#275875';
    ctx.stroke();

    // Axis label
    const lx = cx + (radius + 18) * Math.cos(angle);
    const ly = cy + (radius + 18) * Math.sin(angle);
    ctx.fillStyle = '#54b6d0';
    ctx.fillText(axis.label, lx, ly);
  });

  // Draw data polygon
  ctx.beginPath();
  axes.forEach((axis, i) => {
    const val = (radarStats[axis.key] || 35) / 100;
    const r = radius * Math.max(0.15, Math.min(1, val));
    const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(240, 100, 92, 0.35)';
  ctx.fill();
  ctx.strokeStyle = '#f0645c';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw data vertex points
  axes.forEach((axis, i) => {
    const val = (radarStats[axis.key] || 35) / 100;
    const r = radius * Math.max(0.15, Math.min(1, val));
    const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#f2c06b';
    ctx.fill();
    ctx.strokeStyle = '#050b12';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Render legend
  const legend = document.getElementById('radar-legend');
  if (legend) {
    legend.innerHTML = axes.map((a) => `<div class="radar-legend-item"><span>${a.label}</span><strong>${radarStats[a.key] || 0}%</strong></div>`).join('');
  }
}

function renderHeatmap(snap) {
  const container = document.getElementById('history-heat-grid');
  if (!container) return;
  const daysHtml = [];
  for (let i = 1; i <= 66; i++) {
    let level = 'level-0';
    if (i < snap.currentDay) {
      level = i % 7 === 0 ? 'level-3' : i % 3 === 0 ? 'level-2' : 'level-1';
    } else if (i === snap.currentDay) {
      const done = Object.values(snap.today.pillars || {}).filter(Boolean).length;
      level = done >= 5 ? 'level-3' : done >= 3 ? 'level-2' : done >= 1 ? 'level-1' : 'level-0';
    }
    daysHtml.push(`<div class="heat-cell ${level}" title="Ngày ${i}"></div>`);
  }
  container.innerHTML = daysHtml.join('');
}

function renderStatsSummary(snap) {
  const container = document.getElementById('stats-summary-grid');
  if (!container) return;
  const rate = Math.round((snap.streak / Math.max(1, snap.currentDay)) * 100);
  container.innerHTML = `
    <div class="stats-metric"><strong>${snap.currentDay} / 66</strong><span>NGÀY HOÀN THÀNH</span></div>
    <div class="stats-metric"><strong>${rate}%</strong><span>TỈ LỆ THÀNH CÔNG</span></div>
    <div class="stats-metric"><strong>${snap.bestStreak} D</strong><span>CHUỖI KỶ LỤC</span></div>
    <div class="stats-metric"><strong>${snap.totalXp}</strong><span>TỔNG XP NHẬN ĐƯỢC</span></div>
    <div class="stats-metric"><strong>${snap.totalCoins}</strong><span>WEB COINS TÍCH LŨY</span></div>
    <div class="stats-metric"><strong>${snap.hardMode ? 'ACTIVE' : 'OFF'}</strong><span>TRẠNG THÁI HARD MODE</span></div>
  `;
}

function renderNotionViews() { renderToday(); renderTimetable(); renderHabits(); renderJournal(); renderGym(); }
function renderAll() { renderReset66(); renderNotionViews(); renderRoutine(); renderDopamine(); }

const soundButton = document.getElementById('life-sound');
function updateSoundButton() { soundButton.textContent = lifeSoundEnabled ? 'SFX ON' : 'SFX OFF'; soundButton.setAttribute('aria-pressed', String(lifeSoundEnabled)); }
soundButton.addEventListener('click', () => { lifeSoundEnabled = !lifeSoundEnabled; try { localStorage.setItem('spidey-sfx-enabled', lifeSoundEnabled ? '1' : '0'); } catch {} updateSoundButton(); if (lifeSoundEnabled) sound.playTrackerJingle(); });
updateSoundButton();
document.querySelectorAll('.system-nav').forEach((button) => button.addEventListener('click', () => { sound.playClick(); showView(button.dataset.view); }));

document.getElementById('task-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const input = document.getElementById('task-input'); const button = event.submitter; button.disabled = true;
  try { const task = await gateway.createTask({ title: input.value.trim(), area: document.getElementById('task-area').value }); notion.tasks.unshift(task); input.value = ''; renderToday(); toast('Đã thêm mission vào Notion.'); }
  catch { toast('Không ghi được Notion. Không tạo bản local khác.'); }
  finally { button.disabled = false; }
});
document.getElementById('task-list').addEventListener('click', async (event) => {
  const card = event.target.closest('[data-task]'); if (!card || !event.target.closest('.task-check')) return; const task = notion.tasks.find((item) => item.id === card.dataset.task); if (!task) return;
  event.target.disabled = true; try { await gateway.setTaskDone(task.id, !task.done); task.done = !task.done; renderToday(); toast('Notion mission đã cập nhật.'); } catch { toast('Notion chưa phản hồi. Trạng thái không đổi.'); event.target.disabled = false; }
});
document.getElementById('routine-grid').addEventListener('change', async (event) => {
  const key = event.target.dataset.routineCheck; if (!key) return; cloud.routine.checks ||= {}; cloud.routine.checks[dateKey()] ||= {}; const previous = !event.target.checked; cloud.routine.checks[dateKey()][key] = event.target.checked; renderRoutine();
  if (!await saveCloud('routine')) { cloud.routine.checks[dateKey()][key] = previous; renderRoutine(); }
});
document.getElementById('dopamine-grid').addEventListener('click', (event) => { const button = event.target.closest('[data-shuffle]'); if (button) pickDopamine(Number(button.dataset.shuffle)); });
document.getElementById('shuffle-all').addEventListener('click', () => { sound.playSelect(); pickDopamine(); });
document.getElementById('dopamine-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const input = document.getElementById('dopamine-input'); const menu = cloud.dopamine.menus[Number(document.getElementById('dopamine-menu').value)]; const value = input.value.trim(); if (!value) return;
  menu.items.push(value); renderDopamine(); if (await saveCloud('dopamine')) input.value = ''; else { menu.items.pop(); renderDopamine(); }
});
document.getElementById('spin-schedule').addEventListener('click', () => {
  const slots = [...document.querySelectorAll('.time-slot')]; if (!slots.length) return toast('Notion chưa có time slot để chọn.'); slots.forEach((slot) => slot.classList.remove('picked')); const pick = slots[Math.floor(Math.random() * slots.length)]; pick.classList.add('picked'); pick.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }); toast(`SPIDER-SENSE // ${pick.querySelector('strong')?.textContent}`);
});
document.getElementById('limit-grid').addEventListener('click', toggleHabit); document.getElementById('habit-grid').addEventListener('click', toggleHabit);
async function toggleHabit(event) {
  const card = event.target.closest('[data-habit]'); if (!card) return; const habit = notion.habits.find((item) => item.id === card.dataset.habit); if (!habit) return;
  card.disabled = true; try { await gateway.setHabitDone(habit.id, !habit.done); habit.done = !habit.done; renderHabits(); toast('Habit đã cập nhật trong Notion.'); } catch { card.disabled = false; toast('Notion chưa phản hồi. Trạng thái không đổi.'); }
}
document.getElementById('journal-content').addEventListener('input', (event) => { document.getElementById('word-count').textContent = `${event.target.value.trim() ? event.target.value.trim().split(/\s+/).length : 0} từ`; });
document.getElementById('journal-form').addEventListener('submit', (event) => { event.preventDefault(); toast('Chưa cấu hình Notion Journal database.'); });

function tick() {
  const now = new Date(); const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); document.getElementById('live-time').textContent = time; document.getElementById('clock-time').textContent = time;
  document.getElementById('clock-hand').style.transform = `rotate(${(now.getHours() + now.getMinutes() / 60) * 15}deg)`; document.getElementById('today-label').textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).toUpperCase();
}

// Attach Life Reset 66 Event Listeners
document.querySelectorAll('.reset-tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    sound.playClick();
    const targetTab = btn.dataset.r66Tab;
    document.querySelectorAll('.reset-tab-btn').forEach((b) => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.reset-subpanel').forEach((p) => p.classList.toggle('active', p.dataset.r66Panel === targetTab));
  });
});

document.querySelectorAll('.quest-time-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    sound.playClick();
    document.querySelectorAll('.quest-time-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentQuestTimeFilter = btn.dataset.timeFilter;
    renderReset66();
  });
});

document.getElementById('btn-daily-chest')?.addEventListener('click', () => {
  sound.playSelect();
  const res = resetEngine.claimDailyChest();
  if (res.success) {
    sound.playTrackerJingle();
    renderReset66();
    toast(`🎉 MỞ HÒM THÀNH CÔNG! Nhận +${res.bonusXp} XP và +${res.bonusCoins} Web Coins!`);
  } else {
    toast(res.message);
  }
});

document.getElementById('btn-toggle-hardmode')?.addEventListener('click', () => {
  sound.playSelect();
  const mode = resetEngine.toggleHardMode();
  renderReset66();
  toast(mode ? '⚡ HARD MODE: KÍCH HOẠT! Kỷ luật thép được thiết lập.' : 'HARD MODE: ĐÃ TẮT. Chuyển về chế độ chuẩn.');
});

document.getElementById('pillars-grid')?.addEventListener('click', (event) => {
  const detailTarget = event.target.closest('[data-open-detail]');
  if (detailTarget && !event.target.closest('.pillar-check-btn')) {
    openHabitDetail(detailTarget.dataset.openDetail);
    return;
  }

  const card = event.target.closest('.pillar-card');
  if (!card) return;
  const pillarId = card.dataset.pillar;
  if (!pillarId) return;
  const res = resetEngine.togglePillar(pillarId);
  if (res) {
    if (res.checked) {
      sound.playTrackerJingle();
      toast(`✓ Hoàn thành ${pillarId.toUpperCase()}! +${res.xp} XP (+${res.coins} Web Coins)`);
      if (res.rank && res.rank.level > heroCurrentLevel) {
        heroCurrentLevel = res.rank.level;
        const modal = document.getElementById('levelup-modal');
        if (modal) {
          document.getElementById('levelup-badge').textContent = res.rank.badge;
          document.getElementById('levelup-name').textContent = res.rank.name;
          modal.removeAttribute('hidden');
          modal.removeAttribute('inert');
          modal.classList.add('active');
        }
      }
    } else {
      sound.playClick();
    }
    renderReset66();
  }
});

document.getElementById('custom-habit-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('custom-habit-input');
  const icon = document.getElementById('custom-habit-icon').value;
  const time = document.getElementById('custom-habit-time')?.value || 'all';
  const attr = document.getElementById('custom-habit-attr')?.value || 'DISCIPLINE';
  const text = input.value.trim();
  if (!text) return;
  resetEngine.addCustomHabit(text, icon, time, 'Hàng ngày', attr);
  input.value = '';
  sound.playSelect();
  renderReset66();
  toast('Đã thêm thói quen bổ trợ.');
});

document.getElementById('custom-habits-list')?.addEventListener('click', (e) => {
  const delBtn = e.target.closest('[data-delete-custom]');
  if (delBtn) {
    resetEngine.deleteCustomHabit(delBtn.dataset.deleteCustom);
    sound.playClick();
    renderReset66();
    return;
  }
  const item = e.target.closest('.custom-habit-item');
  if (item) {
    const id = item.dataset.customHabit;
    const res = resetEngine.toggleCustomHabit(id);
    if (res.checked) {
      sound.playTrackerJingle();
      toast('✓ Hoàn thành thói quen riêng! +15 XP');
      if (res.rank && res.rank.level > heroCurrentLevel) {
        heroCurrentLevel = res.rank.level;
        const modal = document.getElementById('levelup-modal');
        if (modal) {
          document.getElementById('levelup-badge').textContent = res.rank.badge;
          document.getElementById('levelup-name').textContent = res.rank.name;
          modal.removeAttribute('hidden');
          modal.removeAttribute('inert');
          modal.classList.add('active');
        }
      }
    } else {
      sound.playClick();
    }
    renderReset66();
  }
});

document.getElementById('habit-modal-close')?.addEventListener('click', () => {
  const modal = document.getElementById('habit-detail-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('hidden', '');
    modal.setAttribute('inert', '');
  }
});

document.getElementById('btn-claim-levelup')?.addEventListener('click', () => {
  const modal = document.getElementById('levelup-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('hidden', '');
    modal.setAttribute('inert', '');
  }
  sound.playSelect();
});

document.getElementById('roadmap-grid')?.addEventListener('click', (e) => {
  const node = e.target.closest('.roadmap-node');
  if (!node) return;
  const day = Number(node.dataset.dayNode);
  selectedRoadmapDay = day;
  sound.playClick();
  renderReset66();
});

document.querySelectorAll('.timer-preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    sound.playClick();
    document.querySelectorAll('.timer-preset-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const mins = Number(btn.dataset.preset);
    timerDuration = mins * 60;
    timerSeconds = timerDuration;
    updateTimerDisplay();
    const modeLabel = document.getElementById('timer-mode-label');
    if (modeLabel) modeLabel.textContent = mins === 50 ? 'DEEP WORK' : mins === 15 ? 'RECOVERY' : 'FOCUS SESSION';
  });
});
document.getElementById('btn-timer-toggle')?.addEventListener('click', toggleTimer);
document.getElementById('btn-timer-reset')?.addEventListener('click', resetTimer);

document.querySelectorAll('[data-water]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const amount = Number(btn.dataset.water);
    const total = resetEngine.logWater(amount);
    sound.playSelect();
    updateWaterFlask(total, resetEngine.state.waterGoalMl);
    toast(`💧 Đã ghi nhận +${amount}ml! (Tổng: ${total.toLocaleString()} / 2,500 ml)`);
    renderReset66();
  });
});
document.getElementById('btn-reset-water')?.addEventListener('click', () => {
  resetEngine.resetWater();
  sound.playClick();
  updateWaterFlask(0, resetEngine.state.waterGoalMl);
  toast('Đã đặt lại lượng nước về 0ml.');
  renderReset66();
});

document.getElementById('btn-toggle-breath')?.addEventListener('click', toggleBreathwork);

document.getElementById('btn-draw-wisdom')?.addEventListener('click', () => {
  sound.playSelect();
  const card = resetEngine.getRandomWisdomCard();
  const heroEl = document.getElementById('wisdom-hero');
  const quoteEl = document.getElementById('wisdom-quote');
  const authorEl = document.getElementById('wisdom-author');
  const lessonEl = document.getElementById('wisdom-lesson');
  const shell = document.getElementById('wisdom-card');

  if (heroEl) heroEl.textContent = card.hero;
  if (quoteEl) quoteEl.textContent = `"${card.quote}"`;
  if (authorEl) authorEl.textContent = `— ${card.author}`;
  if (lessonEl) lessonEl.textContent = card.lesson;

  shell?.animate([
    { transform: 'scale(0.95)', filter: 'brightness(1.5)' },
    { transform: 'scale(1)', filter: 'none' }
  ], { duration: 300, easing: 'ease-out' });

  toast(`🎴 Thẻ bài: ${card.hero}`);
});

renderAll(); setNotionStatus(); tick(); setInterval(tick, 1000); setInterval(renderTimetable, 60000);
const initialView = location.hash.slice(1) || 'reset66';
if (document.querySelector(`[data-view="${initialView}"]`)) showView(initialView);
else showView('reset66');
await Promise.allSettled([loadNotion(), loadCloud('routine'), loadCloud('dopamine')]);
