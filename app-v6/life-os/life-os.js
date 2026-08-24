import { SoundController } from '../js/core/SoundController.js?v=tracker-audio-1';

const LOCAL_KEY = 'spidery-life-os-v1';
const CLOUD_ORIGIN = document.documentElement.dataset.cloudOrigin || location.origin;
const CLOUD_KEYS = { routine: 'spidery-routine-v1', dopamine: 'spidery-dopamine-v1' };
const cloudUrl = (key) => `${CLOUD_ORIGIN.replace(/\/$/, '')}/api/cloud?key=${encodeURIComponent(CLOUD_KEYS[key])}`;
const dateKey = () => new Date().toLocaleDateString('en-CA');

const seed = {
  tasks: [
    { id: 1, title: 'Hoàn thành một nhiệm vụ quan trọng', area: 'Công việc', done: false },
    { id: 2, title: '20 phút vận động', area: 'Sức khỏe', done: false },
    { id: 3, title: 'Đọc 10 trang sách', area: 'Học tập', done: false }
  ],
  habits: [
    { id: 'game', icon: '🎮', title: 'Không Game', group: 'limit' },
    { id: 'youtube', icon: '▶', title: 'Không Youtube', group: 'limit' },
    { id: 'facebook', icon: 'f', title: 'Không Facebook', group: 'limit' },
    { id: 'wake', icon: '🌅', title: 'Wake up early', group: 'good' },
    { id: 'sleep', icon: '😴', title: 'Sleep early', group: 'good' },
    { id: 'focus', icon: '🎯', title: 'Deep work', group: 'good' },
    { id: 'english', icon: '📖', title: 'Tiếng Anh', group: 'good' },
    { id: 'gym', icon: '🏋️', title: 'Straight & Gym', group: 'good' },
    { id: 'yoga', icon: '🧘', title: 'Yoga', group: 'good' }
  ],
  checks: {}, entries: [], workouts: [], activeRoutine: 0
};
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

const timetable = [
  { from: 6, to: 9, time: '06:00–09:00', title: 'Morning Protocol', detail: 'Routine, ánh sáng, vận động nhẹ và kế hoạch ngày.' },
  { from: 9, to: 12, time: '09:00–12:00', title: 'Deep Work Swing', detail: 'Nhiệm vụ quan trọng nhất, không chia nhỏ sự chú ý.' },
  { from: 12, to: 14, time: '12:00–14:00', title: 'Refuel & Reset', detail: 'Ăn trưa, đi bộ và hồi phục thần kinh.' },
  { from: 14, to: 17, time: '14:00–17:00', title: 'Second Patrol', detail: 'Công việc nhẹ, họp và xử lý đầu việc.' },
  { from: 17, to: 20, time: '17:00–20:00', title: 'Strength Window', detail: 'Gym, chạy, thể thao hoặc mobility.' },
  { from: 20, to: 22, time: '20:00–22:00', title: 'Personal City', detail: 'Gia đình, sở thích và kết nối.' },
  { from: 22, to: 24, time: '22:00–24:00', title: 'Night Web', detail: 'Journal, chuẩn bị ngày mai và hạ ánh sáng.' },
  { from: 0, to: 6, time: '00:00–06:00', title: 'Recovery Mode', detail: 'Ngủ sâu. Thành phố tự vận hành.' }
];
const gymRoutines = [
  { name: 'Push Strength', focus: 'Chest / Shoulder / Triceps', exercises: ['Bench Press', 'Incline DB Press', 'Overhead Press', 'Triceps Pushdown'] },
  { name: 'Pull Strength', focus: 'Back / Biceps', exercises: ['Barbell Row', 'Lat Pulldown', 'Seated Cable Row', 'DB Curl'] },
  { name: 'Leg Day', focus: 'Quads / Hamstrings / Calves', exercises: ['Back Squat', 'Romanian Deadlift', 'Leg Press', 'Calf Raise'] },
  { name: 'Upper Hypertrophy', focus: 'Upper full', exercises: ['Pull-up', 'Machine Chest Press', 'Lateral Raise', 'Face Pull'] }
];

let state = loadLocal();
let lifeSoundEnabled = (() => { try { return localStorage.getItem('spidey-sfx-enabled') !== '0'; } catch { return true; } })();
const sound = new SoundController({ get: (key) => key === 'soundEnabled' && lifeSoundEnabled });
sound.init();
const cloud = { routine: structuredClone(cloudSeeds.routine), dopamine: structuredClone(cloudSeeds.dopamine) };
let toastTimer;

function loadLocal() {
  try { return { ...structuredClone(seed), ...JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') }; }
  catch { return structuredClone(seed); }
}
function saveLocal() { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); }
function escapeHtml(value) { const node = document.createElement('div'); node.textContent = String(value ?? ''); return node.innerHTML; }
function toast(message) { const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }
function currentSlot() { const h = new Date().getHours(); return timetable.find((s) => h >= s.from && h < s.to) || timetable[7]; }
function setCloudStatus(key, stateName, message) { const el = document.querySelector(`[data-cloud-status="${key}"]`); if (!el) return; el.dataset.state = stateName; el.querySelector('span').textContent = message; }

async function loadCloud(key) {
  setCloudStatus(key, 'saving', 'Đang tải dữ liệu online…');
  try {
    const response = await fetch(cloudUrl(key), { credentials: 'include', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload?.ok === false) throw new Error(payload.error || 'Cloud rejected the request');
    const onlineData = payload?.data ?? payload;
    if (onlineData && typeof onlineData === 'object' && Object.keys(onlineData).length) cloud[key] = { ...cloud[key], ...onlineData };
    else await saveCloud(key, false);
    setCloudStatus(key, 'online', 'Online · một nguồn dữ liệu chung');
  } catch (error) {
    setCloudStatus(key, 'offline', 'Không thể kết nối cloud · dữ liệu tạm thời');
    console.warn(`[Spider Life OS] ${key} cloud unavailable`, error);
  }
  renderRoutine(); renderDopamine();
}
async function saveCloud(key, announce = true) {
  setCloudStatus(key, 'saving', 'Đang lưu online…');
  try {
    const response = await fetch(cloudUrl(key), { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cloud[key]) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setCloudStatus(key, 'online', 'Đã lưu online · mọi thiết bị dùng chung');
    if (announce) toast('Đã đồng bộ lên Spider Cloud.');
  } catch (error) {
    setCloudStatus(key, 'offline', 'Lưu online thất bại · thử lại khi có mạng');
    toast('Cloud chưa phản hồi. Thay đổi chỉ giữ trong phiên này.');
  }
}

function showView(name) {
  document.querySelectorAll('.system-nav').forEach((b) => b.classList.toggle('active', b.dataset.view === name));
  document.querySelectorAll('.os-view').forEach((p) => p.classList.toggle('active', p.dataset.panel === name));
  const labels = { today: 'TODAY // QUICK CAPTURE', routine: 'ROUTINE // CIRCADIAN SIGNAL', dopamine: 'DOPAMINE // INTENTIONAL REWARD', timetable: 'TIMETABLE // 24H CITY CLOCK', habits: 'HABITS // IDENTITY VOTES', journal: 'CHRONICLE // REFLECTION', gym: 'GYM OS // PERFORMANCE' };
  document.getElementById('view-kicker').textContent = labels[name];
  history.replaceState(null, '', `#${name}`);
}

function renderToday() {
  const done = state.tasks.filter((t) => t.done).length;
  document.getElementById('today-metrics').innerHTML = metric(`${done}/${state.tasks.length}`, 'ĐÃ HOÀN THÀNH') + metric(state.tasks.length - done, 'CÒN LẠI') + metric(`${state.tasks.length ? Math.round(done / state.tasks.length * 100) : 0}%`, 'TÍN HIỆU NGÀY');
  document.getElementById('task-list').innerHTML = state.tasks.length ? state.tasks.map((task) => `<article class="mission-card ${task.done ? 'done' : ''}" data-task="${task.id}"><button class="task-check" aria-label="Đánh dấu ${escapeHtml(task.title)}">${task.done ? '✓' : ''}</button><div><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.area)} // TODAY</small></div><button class="delete-btn">XÓA</button></article>`).join('') : '<div class="empty-state">Không còn nhiệm vụ. Thành phố đang yên.</div>';
}
function metric(value, label) { return `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`; }
function renderRoutine() {
  const checks = cloud.routine.checks?.[dateKey()] || {};
  document.getElementById('routine-grid').innerHTML = cloud.routine.routines.map((routine) => {
    const count = routine.tasks.filter((_, i) => checks[`${routine.id}:${i}`]).length;
    return `<article class="routine-card"><header><h3>${escapeHtml(routine.name)}</h3><span>${escapeHtml(routine.window)} · ${count}/${routine.tasks.length}</span></header><div class="routine-tasks">${routine.tasks.map((task, i) => `<label class="routine-task"><input type="checkbox" data-routine-check="${routine.id}:${i}" ${checks[`${routine.id}:${i}`] ? 'checked' : ''}/><span>${escapeHtml(task)}</span></label>`).join('')}</div><div class="routine-progress"><i style="width:${routine.tasks.length ? count / routine.tasks.length * 100 : 0}%"></i></div></article>`;
  }).join('');
}
function renderDopamine() {
  const menuSelect = document.getElementById('dopamine-menu');
  const selected = menuSelect?.value;
  if (menuSelect) {
    menuSelect.innerHTML = cloud.dopamine.menus.map((menu, index) => `<option value="${index}">${escapeHtml(menu.name)}</option>`).join('');
    if (selected && Number(selected) < cloud.dopamine.menus.length) menuSelect.value = selected;
  }
  document.getElementById('dopamine-grid').innerHTML = cloud.dopamine.menus.map((menu, index) => `<article class="dopamine-card"><header><h3>${escapeHtml(menu.name)}</h3><span>${menu.items.length} SIGNALS</span></header><ul>${menu.items.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><button data-shuffle="${index}">CHỌN MỘT</button></article>`).join('');
}
function pickDopamine(menuIndex = null) {
  const menu = menuIndex === null ? cloud.dopamine.menus[Math.floor(Math.random() * cloud.dopamine.menus.length)] : cloud.dopamine.menus[menuIndex];
  const pick = menu.items[Math.floor(Math.random() * menu.items.length)];
  const result = document.getElementById('dopamine-result'); result.querySelector('strong').textContent = pick; result.querySelector('small').textContent = `${menu.name} // làm trong 5–30 phút, không cần hoàn hảo.`;
  result.animate([{ transform: 'scale(.98)', filter: 'brightness(1.8)' }, { transform: 'scale(1)', filter: 'none' }], { duration: 420, easing: 'steps(4)' });
}
function renderTimetable() {
  const now = currentSlot();
  document.getElementById('active-slot').innerHTML = `<span>● ĐANG DIỄN RA // ${now.time}</span><strong>${now.title}</strong><small>${now.detail}</small>`;
  document.getElementById('timeline').innerHTML = timetable.map((slot) => `<article class="time-slot ${slot === now ? 'current' : ''}"><b>${slot.time}</b><strong>${slot.title}</strong><small>${slot.detail}</small></article>`).join('');
}
function renderHabits() {
  const checks = state.checks[dateKey()] || {};
  const render = (group) => state.habits.filter((h) => h.group === group).map((habit) => `<button class="habit-card ${checks[habit.id] ? 'checked' : ''}" data-habit="${habit.id}"><span>${habit.icon}</span><div><strong>${escapeHtml(habit.title)}</strong><small>${checks[habit.id] ? 'HOÀN THÀNH HÔM NAY' : 'CHẠM ĐỂ CHECK-IN'}</small></div><i></i></button>`).join('');
  document.getElementById('limit-grid').innerHTML = render('limit'); document.getElementById('habit-grid').innerHTML = render('good');
  const total = state.habits.length; const done = Object.values(checks).filter(Boolean).length; document.getElementById('habit-score').textContent = `${total ? Math.round(done / total * 100) : 0}%`;
}
function renderJournal() {
  document.getElementById('journal-feed').innerHTML = state.entries.length ? state.entries.map((entry) => `<article class="journal-card"><header><span>${entry.mood}</span><small>${new Date(entry.createdAt).toLocaleString('vi-VN')}</small></header><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.content)}</p></article>`).join('') : '<div class="empty-state">Chronicle đang trống. Viết điều đầu tiên đáng nhớ.</div>';
}
function renderGym() {
  const weekStart = Date.now() - 7 * 86400000; const recent = state.workouts.filter((w) => new Date(w.createdAt).getTime() >= weekStart);
  document.getElementById('gym-stats').innerHTML = metric(recent.length, 'SESSIONS / 7D') + metric(state.workouts.length, 'TOTAL LOGS') + metric(`${recent.length ? recent.length : 0}d`, 'ACTIVE LOAD') + metric(gymRoutines[state.activeRoutine].exercises.length, 'MOVES / PLAN');
  document.getElementById('gym-routines').innerHTML = gymRoutines.map((routine, i) => `<article class="gym-routine ${i === state.activeRoutine ? 'active' : ''}" data-gym-routine="${i}"><h3>${routine.name}</h3><p>${routine.focus}</p><small>${routine.exercises.join(' · ')}</small></article>`).join('');
  document.getElementById('workout-feed').innerHTML = state.workouts.length ? state.workouts.map((w) => `<article class="workout-card"><strong>${escapeHtml(w.name)}</strong><small>${new Date(w.createdAt).toLocaleString('vi-VN')} // ${w.exercises} EXERCISES</small></article>`).join('') : '<div class="empty-state">Chưa có buổi tập. Chọn routine và log session đầu tiên.</div>';
}
function renderAll() { renderToday(); renderRoutine(); renderDopamine(); renderTimetable(); renderHabits(); renderJournal(); renderGym(); }

const soundButton = document.getElementById('life-sound');
function updateSoundButton() { soundButton.textContent = lifeSoundEnabled ? 'SFX ON' : 'SFX OFF'; soundButton.setAttribute('aria-pressed', String(lifeSoundEnabled)); }
soundButton.addEventListener('click', () => { lifeSoundEnabled = !lifeSoundEnabled; try { localStorage.setItem('spidey-sfx-enabled', lifeSoundEnabled ? '1' : '0'); } catch {} updateSoundButton(); if (lifeSoundEnabled) sound.playTrackerJingle(); });
updateSoundButton();
document.querySelectorAll('.system-nav').forEach((button) => button.addEventListener('click', () => { sound.playClick(); showView(button.dataset.view); }));
document.getElementById('task-form').addEventListener('submit', (event) => { event.preventDefault(); const input = document.getElementById('task-input'); state.tasks.unshift({ id: Date.now(), title: input.value.trim(), area: document.getElementById('task-area').value, done: false }); input.value = ''; saveLocal(); renderToday(); toast('Đã thêm nhiệm vụ hôm nay.'); });
document.getElementById('task-list').addEventListener('click', (event) => { const card = event.target.closest('[data-task]'); if (!card) return; const id = Number(card.dataset.task); if (event.target.closest('.delete-btn')) state.tasks = state.tasks.filter((t) => t.id !== id); else if (event.target.closest('.task-check')) { const task = state.tasks.find((t) => t.id === id); task.done = !task.done; } saveLocal(); renderToday(); });
document.getElementById('routine-grid').addEventListener('change', (event) => { const key = event.target.dataset.routineCheck; if (!key) return; cloud.routine.checks ||= {}; cloud.routine.checks[dateKey()] ||= {}; cloud.routine.checks[dateKey()][key] = event.target.checked; renderRoutine(); saveCloud('routine'); });
document.getElementById('dopamine-grid').addEventListener('click', (event) => { const button = event.target.closest('[data-shuffle]'); if (button) pickDopamine(Number(button.dataset.shuffle)); });
document.getElementById('shuffle-all').addEventListener('click', () => { sound.playSelect(); pickDopamine(); });
document.getElementById('dopamine-form').addEventListener('submit', (event) => { event.preventDefault(); const input = document.getElementById('dopamine-input'); const menu = cloud.dopamine.menus[Number(document.getElementById('dopamine-menu').value)]; menu.items.push(input.value.trim()); input.value = ''; renderDopamine(); saveCloud('dopamine'); });
document.getElementById('spin-schedule').addEventListener('click', () => { const slots = [...document.querySelectorAll('.time-slot')]; slots.forEach((s) => s.classList.remove('picked')); const pick = slots[Math.floor(Math.random() * slots.length)]; pick.classList.add('picked'); pick.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }); toast(`Spider-Sense chọn: ${timetable[slots.indexOf(pick)].title}`); });
document.getElementById('limit-grid').addEventListener('click', toggleHabit); document.getElementById('habit-grid').addEventListener('click', toggleHabit);
function toggleHabit(event) { const card = event.target.closest('[data-habit]'); if (!card) return; state.checks[dateKey()] ||= {}; state.checks[dateKey()][card.dataset.habit] = !state.checks[dateKey()][card.dataset.habit]; saveLocal(); renderHabits(); }
document.getElementById('journal-content').addEventListener('input', (event) => { document.getElementById('word-count').textContent = `${event.target.value.trim() ? event.target.value.trim().split(/\s+/).length : 0} từ`; });
document.getElementById('new-entry').addEventListener('click', () => document.getElementById('journal-title').focus());
document.getElementById('journal-form').addEventListener('submit', (event) => { event.preventDefault(); state.entries.unshift({ id: Date.now(), mood: document.getElementById('journal-mood').value, title: document.getElementById('journal-title').value.trim(), content: document.getElementById('journal-content').value.trim(), createdAt: new Date().toISOString() }); saveLocal(); event.target.reset(); document.getElementById('word-count').textContent = '0 từ'; renderJournal(); toast('Đã lưu vào Life Chronicle.'); });
document.getElementById('gym-routines').addEventListener('click', (event) => { const card = event.target.closest('[data-gym-routine]'); if (!card) return; state.activeRoutine = Number(card.dataset.gymRoutine); saveLocal(); renderGym(); });
document.getElementById('log-workout').addEventListener('click', () => { const routine = gymRoutines[state.activeRoutine]; state.workouts.unshift({ id: Date.now(), name: routine.name, exercises: routine.exercises.length, createdAt: new Date().toISOString() }); saveLocal(); renderGym(); toast(`Đã log ${routine.name}.`); });

function tick() { const now = new Date(); const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); document.getElementById('live-time').textContent = time; document.getElementById('clock-time').textContent = time; document.getElementById('clock-hand').style.transform = `rotate(${(now.getHours() % 24 + now.getMinutes() / 60) * 15}deg)`; document.getElementById('today-label').textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).toUpperCase(); }

renderAll(); tick(); setInterval(tick, 1000); setInterval(renderTimetable, 60000);
const initialView = location.hash.slice(1); if (document.querySelector(`[data-view="${initialView}"]`)) showView(initialView);
loadCloud('routine'); loadCloud('dopamine');
