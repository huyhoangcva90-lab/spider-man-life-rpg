import { SoundController } from '../js/core/SoundController.js?v=tracker-audio-1';
import { LifeDataGateway } from './LifeDataGateway.js?v=notion-cloud-1';

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

function showView(name) {
  document.querySelectorAll('.system-nav').forEach((button) => button.classList.toggle('active', button.dataset.view === name));
  document.querySelectorAll('.os-view').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === name));
  const labels = { today: 'TODAY // NOTION MISSIONS', routine: 'ROUTINE // SHARED CLOUD', dopamine: 'DOPAMINE // SHARED CLOUD', timetable: 'TIMETABLE // NOTION CITY CLOCK', habits: 'HABITS // NOTION TRACKER', journal: 'CHRONICLE // NOTION', gym: 'GYM OS // NOTION PERFORMANCE' };
  document.getElementById('view-kicker').textContent = labels[name];
  history.replaceState(null, '', `#${name}`);
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

function renderNotionViews() { renderToday(); renderTimetable(); renderHabits(); renderJournal(); renderGym(); }
function renderAll() { renderNotionViews(); renderRoutine(); renderDopamine(); }

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

renderAll(); setNotionStatus(); tick(); setInterval(tick, 1000); setInterval(renderTimetable, 60000);
const initialView = location.hash.slice(1); if (document.querySelector(`[data-view="${initialView}"]`)) showView(initialView);
await Promise.allSettled([loadNotion(), loadCloud('routine'), loadCloud('dopamine')]);
