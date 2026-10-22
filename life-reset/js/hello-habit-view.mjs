import { dateKey } from './personal-progress.mjs';

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

// This view shares the existing Notion cache and confirmed-write flow.
// It does not turn a boolean Today field into invented quantitative activity.
export class HelloHabitView {
  constructor(app) {
    this.app = app;
    this.query = '';
    this.filter = 'all';
    this.sort = 'original';
    this.group = 'none';
    this.detailId = null;
    this.detailTab = 'track';
    this.weekOffset = 0;
    this.collapsedGroups = new Set();
    document.getElementById('hello-search').addEventListener('input', event => {
      this.query = event.target.value;
      this.render();
    });
    for (const key of ['filter', 'sort', 'group']) {
      document.getElementById(`hello-${key}`).addEventListener('change', event => {
        this[key] = event.target.value;
        this.render();
      });
    }
    document.getElementById('btn-tracker-filter').addEventListener('click', event => {
      const panel = document.getElementById('hello-view-options');
      panel.hidden = !panel.hidden;
      event.currentTarget.setAttribute('aria-expanded', String(!panel.hidden));
    });
    document.getElementById('hello-week-prev').addEventListener('click', () => this.moveWeek(-1));
    document.getElementById('hello-week-next').addEventListener('click', () => this.moveWeek(1));
    document.getElementById('hello-today').addEventListener('click', () => this.selectDate(app.todayKey()));
    document.getElementById('hello-date').addEventListener('change', event => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(event.target.value)) this.selectDate(event.target.value);
    });
  }

  selectDate(day) {
    this.app.helloTracker.selectedDay = day;
    const selected = new Date(`${day}T12:00:00`);
    const today = new Date(`${this.app.todayKey()}T12:00:00`);
    this.weekOffset = Math.ceil(Math.round((selected - today) / 86400000) / 7);
    this.app.saveState();
    this.renderCalendar();
    this.render();
  }

  moveWeek(direction) {
    this.weekOffset += direction;
    this.renderCalendar();
  }

  renderCalendar() {
    const strip = document.getElementById('hello-week-strip');
    strip.replaceChildren();
    const today = new Date(`${this.app.todayKey()}T12:00:00`);
    for (let index = 0; index < 7; index++) {
      const date = new Date(today);
      date.setDate(today.getDate() + this.weekOffset * 7 - 6 + index);
      const key = dateKey(date);
      const cell = element('button', 'cal-day-cell');
      cell.type = 'button';
      cell.dataset.day = key;
      cell.classList.toggle('active', key === this.app.helloTracker.selectedDay);
      cell.setAttribute('aria-pressed', String(key === this.app.helloTracker.selectedDay));
      cell.setAttribute('aria-label', date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
      cell.append(element('span', 'cal-day-name', date.toLocaleDateString('vi-VN', { weekday: 'short' })), element('span', 'cal-day-num', date.getDate()));
      strip.append(cell);
    }
    const selected = this.app.helloTracker.selectedDay || this.app.todayKey();
    document.getElementById('hello-date').value = selected;
    document.getElementById('hello-selected-date').textContent = selected === this.app.todayKey() ? 'Hôm nay' : new Date(`${selected}T12:00:00`).toLocaleDateString('vi-VN');
  }

  checked(habit, day = this.app.helloTracker.selectedDay) {
    return day === this.app.todayKey() ? !!this.app.state.notionDoneToday[habit.id] : this.history(habit).includes(day);
  }

  history(habit) {
    return [...new Set(this.app.state.notionHistory?.[habit.rawId || habit.id] || [])].filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day)).sort();
  }

  action(habit) {
    const today = this.app.helloTracker.selectedDay === this.app.todayKey();
    const done = this.checked(habit);
    const pending = this.app.pendingHabitIds.has(habit.id);
    const button = element('button', `hh-check${done ? ' is-done' : ''}`, pending ? '…' : done ? '✓' : '+');
    button.type = 'button';
    button.disabled = !today || this.app.syncing || pending;
    button.setAttribute('aria-label', `${done ? 'Bỏ check' : 'Check'} ${habit.name}`);
    button.setAttribute('aria-pressed', String(done));
    button.setAttribute('aria-busy', String(pending));
    button.addEventListener('click', () => this.app.toggleNotionHabitDone(habit));
    return button;
  }

  open(habit) {
    this.detailId = habit.id;
    this.detailTab = 'track';
    this.returnFocusId = habit.id;
    this.render();
    document.getElementById('hh-detail-title')?.focus();
  }

  render() {
    const app = this.app;
    const habits = app.notionHabits;
    const list = document.getElementById('hello-square-grid');
    const detail = document.getElementById('hello-habit-detail');
    const selected = app.helloTracker.selectedDay || app.todayKey();
    const count = habits.filter(habit => this.checked(habit, selected)).length;
    document.getElementById('hello-square-progress').textContent = `${count} / ${habits.length} đã check`;
    const scope = document.getElementById('hello-history-scope');
    scope.textContent = selected === app.todayKey()
      ? 'Check hôm nay lưu vào Notion. Chạm tên Habit để xem chi tiết.'
      : selected > app.todayKey() ? 'Ngày sắp tới · chỉ xem. Chưa có dữ liệu hoạt động cho ngày này.'
      : 'Lịch sử trên thiết bị này · ô chưa ghi nhận không có nghĩa là bỏ lỡ. Chưa hỗ trợ sửa ngày cũ.';
    const sync = document.getElementById('hello-sync-status');
    const syncedAt = app.habitSyncedAt;
    sync.textContent = app.syncing ? 'Đang đồng bộ…' : syncedAt
      ? `Habit đọc lúc ${new Date(syncedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`
      : 'Chưa xác nhận đồng bộ trực tiếp';
    const habit = habits.find(item => item.id === this.detailId);
    const overview = document.getElementById('hello-overview');
    overview.hidden = !!habit;
    detail.hidden = !habit;
    if (habit) { this.renderDetail(habit, detail); return; }
    list.replaceChildren();
    const visible = habits.filter(item => item.name.toLocaleLowerCase('vi').includes(this.query.trim().toLocaleLowerCase('vi'))
      && (this.filter === 'all' || this.checked(item) === (this.filter === 'done')));
    if (this.sort === 'name') visible.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (this.sort === 'streak') visible.sort((a, b) => (Number(b.streak) || 0) - (Number(a.streak) || 0));
    if (!visible.length) {
      list.append(element('p', 'hh-empty', habits.length ? 'Không có Habit phù hợp. Thử đổi bộ lọc hoặc từ tìm kiếm.' : app.syncing ? 'Đang tải Habit từ Notion…' : 'Chưa có Habit để hiển thị. Đồng bộ lại hoặc mở Notion bằng nút +.'));
      return;
    }
    const groups = new Map();
    for (const item of visible) {
      const name = this.group === 'category' ? item.category || 'Chưa phân loại' : this.group === 'time' ? item.timeBlock || 'Cả ngày' : 'Habits';
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(item);
    }
    for (const [name, members] of groups) {
      const group = element('details', 'hh-group');
      group.open = !this.collapsedGroups.has(name);
      group.addEventListener('toggle', () => {
        if (group.open) this.collapsedGroups.delete(name); else this.collapsedGroups.add(name);
      });
      const summary = element('summary', 'hh-group-heading', name);
      summary.append(element('span', '', members.length));
      group.append(summary);
      const rows = element('div', 'hh-rows');
      for (const item of members) {
        const row = element('article', `hh-row hh-tone-${habits.indexOf(item) % 5}`);
        const title = element('button', 'hh-row-title', item.name);
        title.type = 'button';
        title.dataset.habitId = item.id;
        title.setAttribute('aria-label', `Chi tiết ${item.name}`);
        title.addEventListener('click', () => this.open(item));
        const meta = element('div', 'hh-row-meta');
        meta.append(element('span', 'hh-row-time', item.timeBlock || 'Cả ngày'));
        if (item.streak !== undefined && item.streak !== null && Number.isFinite(Number(item.streak))) {
          const streak = element('span', 'hh-streak', `♨ ${item.streak}`);
          streak.title = 'Streak do Notion cung cấp';
          meta.append(streak);
        }
        row.append(title, meta, element('span', 'hh-row-value', selected > app.todayKey() ? 'Chưa đến ngày' : this.checked(item) ? 'Đã check' : selected === app.todayKey() ? 'Chưa check' : 'Chưa ghi nhận'), this.action(item));
        rows.append(row);
      }
      group.append(rows);
      list.append(group);
    }
  }

  renderDetail(habit, panel) {
    panel.replaceChildren();
    const back = element('button', 'hh-back', '‹ Danh sách Habit');
    back.type = 'button';
    back.addEventListener('click', () => {
      this.detailId = null;
      this.render();
      for (const button of document.querySelectorAll('[data-habit-id]')) if (button.dataset.habitId === this.returnFocusId) button.focus();
    });
    const title = element('h3', 'hh-detail-title', habit.name);
    title.id = 'hh-detail-title';
    title.tabIndex = -1;
    panel.append(back, title, element('p', 'hh-detail-meta', [habit.category, habit.timeBlock].filter(Boolean).join(' · ')));
    const nav = element('nav', 'hh-detail-nav');
    nav.setAttribute('aria-label', 'Chi tiết Habit');
    for (const [key, label] of [['track', 'Theo dõi'], ['stats', 'Thống kê'], ['activity', 'Hoạt động']]) {
      const button = element('button', this.detailTab === key ? 'active' : '', label);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(this.detailTab === key));
      button.addEventListener('click', () => {
        this.detailTab = key;
        this.renderDetail(habit, panel);
        [...panel.querySelectorAll('.hh-detail-nav button')].find(node => node.textContent === label)?.focus();
      });
      nav.append(button);
    }
    panel.append(nav);
    const history = this.history(habit);
    if (this.detailTab === 'track') {
      const status = element('div', 'hh-detail-status');
      status.append(element('strong', '', this.checked(habit) ? 'Đã check' : this.app.helloTracker.selectedDay === this.app.todayKey() ? 'Chưa check' : 'Chưa ghi nhận'), this.action(habit));
      panel.append(status);
      if (habit.description || habit.outcome) panel.append(element('p', 'hh-description', habit.description || habit.outcome));
    }
    if (this.detailTab === 'stats') {
      const stats = element('dl', 'hh-stat-grid');
      for (const [label, value] of [['Ngày đã ghi nhận trên máy', history.length], ['Streak từ Notion', habit.streak ?? 'Chưa có'], ['Ghi nhận gần nhất trên máy', history.at(-1) || 'Chưa có']]) {
        const cell = element('div');
        cell.append(element('dt', '', label), element('dd', '', value));
        stats.append(cell);
      }
      panel.append(stats, element('p', 'personal-history-note', 'Chưa có nhật ký hoạt động Notion theo ngày; không tính tỷ lệ thành công, kỷ lục hay xu hướng từ các ô trống.'));
    }
    if (this.detailTab === 'activity') {
      panel.append(element('p', 'personal-history-note', 'Các ngày check-in được lưu trên thiết bị này; đây chưa phải nhật ký số lượng và thời điểm đầy đủ.'));
      const log = element('ol', 'hh-activity-list');
      for (const day of history.toReversed()) log.append(element('li', '', `${day} · Đã check-in`));
      panel.append(history.length ? log : element('p', 'hh-empty', 'Chưa có check-in được ghi nhận trên thiết bị này.'));
    }
    const pageId = String(habit.rawId || '').replaceAll('-', '');
    const sourceUrl = /^https:\/\/(?:www\.)?notion\.so\//.test(habit.sourceUrl || '') ? habit.sourceUrl
      : /^[a-f0-9]{32}$/i.test(pageId) ? `https://www.notion.so/${pageId}` : null;
    if (sourceUrl) {
      const link = element('a', 'hh-source-link', 'Mở Habit trong Notion ↗');
      link.href = sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      panel.append(link);
    }
  }
}
