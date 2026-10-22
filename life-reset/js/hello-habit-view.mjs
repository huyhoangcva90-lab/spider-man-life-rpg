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
    if (day > this.app.todayKey()) return false;
    return day === this.app.todayKey() ? !!this.app.state.notionDoneToday[habit.id] : this.history(habit).includes(day);
  }

  history(habit) {
    return this.app.habitRecordedDays(habit);
  }

  action(habit) {
    const today = this.app.helloTracker.selectedDay === this.app.todayKey();
    const done = this.checked(habit);
    const pending = this.app.pendingHabitIds.has(habit.id);
    const button = element('button', `hh-check${done ? ' is-done' : ''}`, pending ? '…' : done ? '✓' : '+');
    button.type = 'button';
    button.disabled = !today || this.app.syncing || pending || !this.app.habitWritable;
    if (!this.app.habitWritable) button.title = 'Mở kết nối riêng và làm mới dữ liệu trước khi check.';
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
      ? 'Check hôm nay ghi vào Daily Notion. Chạm tên Habit để xem chi tiết.'
      : selected > app.todayKey() ? 'Ngày sắp tới · chỉ xem. Chưa có dữ liệu hoạt động cho ngày này.'
      : app.habitHistorySyncedAt ? 'Lịch sử Daily từ Notion · chỉ xem. Ô trống là chưa ghi nhận, không tự tính là bỏ lỡ.' : 'Lịch sử trên thiết bị này · ô chưa ghi nhận không có nghĩa là bỏ lỡ. Chưa hỗ trợ sửa ngày cũ.';
    if (app.habitHistoryError) scope.textContent += ` Lịch sử chưa làm mới: ${app.habitHistoryError}.`;
    const sync = document.getElementById('hello-sync-status');
    const syncedAt = app.habitSyncedAt;
    sync.textContent = app.syncing ? 'Đang đồng bộ…' : syncedAt
      ? `Habit đọc lúc ${new Date(syncedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })}`
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
      list.append(element('p', 'hh-empty', habits.length ? 'Không có Habit phù hợp. Thử đổi bộ lọc hoặc từ tìm kiếm.' : app.syncing ? 'Đang tải Habit từ Notion…' : !app.habitWritable ? 'Mở kết nối riêng và làm mới để tải Habit từ Notion.' : 'Chưa có Habit để hiển thị. Mở Notion bằng nút + để quản lý.'));
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
        const colors = { blue: '#9fc9e8', green: '#9ed9c4', red: '#e7aca8', purple: '#bfb4e3', yellow: '#e3c38e', orange: '#e6b28e', pink: '#e3b3cf', brown: '#c5b09b', gray: '#b7bdc7' };
        if (colors[String(item.color).toLowerCase()]) row.style.setProperty('--hh-tone', colors[String(item.color).toLowerCase()]);
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
      const habitKey = String(habit.rawId || habit.id).replaceAll('-', '').toLowerCase();
      const plans = (this.app.habitPlans || []).filter(plan => plan.habitIds.includes(habitKey));
      panel.append(element('h4', 'hh-plan-heading', 'Kế hoạch từ Notion'));
      if (!plans.length) {
        const empty = element('div', 'hh-plan');
        empty.append(element('p', '', this.app.syncing ? 'Đang kiểm tra kế hoạch của Habit…' : this.app.habitPlansSyncedAt ? 'Chưa có kế hoạch đang mở liên kết với Habit này.' : 'Chưa tải được kế hoạch của Habit này.'));
        const link = element('a', 'hh-source-link', 'Mở Habit Planner trong Notion ↗');
        link.href = 'https://www.notion.so/272d787636c681228446e717b8137af1';
        link.target = '_blank'; link.rel = 'noopener'; empty.append(link);
        panel.append(empty);
      }
      if (this.app.habitPlansError) panel.append(element('p', 'personal-history-note', this.app.habitPlansError));
      for (const plan of plans) {
        const card = element('article', 'hh-plan');
        card.append(element('strong', '', plan.name || 'Habit Planner'));
        const unit = { Week: 'tuần', Month: 'tháng', Quarter: 'quý' }[plan.unit] || plan.unit;
        if (plan.frequency !== null && unit) card.append(element('p', '', `${plan.frequency} lần / ${unit}`));
        if (plan.start || plan.end) card.append(element('p', '', `${plan.start?.slice(0, 10) || 'Chưa đặt ngày đầu'} → ${plan.end?.slice(0, 10) || 'Chưa đặt ngày cuối'}`));
        if (plan.completed !== null && plan.target !== null) {
          card.append(element('p', '', `Toàn kế hoạch: ${plan.completed} / ${plan.target} · theo công thức Notion`));
          if (plan.target > 0) {
            const progress = element('progress');
            progress.max = plan.target;
            progress.value = Math.max(0, plan.completed);
            progress.setAttribute('aria-label', `Tiến độ toàn kế hoạch ${plan.name}`);
            card.append(progress);
          }
        }
        if (/^[a-f0-9-]{32,36}$/i.test(plan.id)) {
          const link = element('a', 'hh-source-link', 'Sửa kế hoạch trong Notion ↗');
          link.href = `https://www.notion.so/${plan.id.replaceAll('-', '')}`;
          link.target = '_blank'; link.rel = 'noopener'; card.append(link);
        }
        panel.append(card);
      }
    }
    if (this.detailTab === 'stats') {
      const stats = element('dl', 'hh-stat-grid');
      const remote = !!this.app.habitHistorySyncedAt;
      for (const [label, value] of [[remote ? 'Ngày có check-in Daily từ Notion' : 'Ngày đã ghi nhận trên máy', history.length], ['Streak từ Notion', habit.streak ?? 'Chưa có'], ['Streak dài nhất từ Notion', habit.bestStreak ?? 'Chưa có'], ['Ghi nhận gần nhất', history.at(-1) || 'Chưa có']]) {
        const cell = element('div');
        cell.append(element('dt', '', label), element('dd', '', value));
        stats.append(cell);
      }
      panel.append(stats, element('p', 'personal-history-note', remote ? `Nguồn: quan hệ Habits ↔ Daily trong Notion. Đọc lúc ${new Date(this.app.habitHistorySyncedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}. Streak dùng kết quả công thức Notion; ô trống không tự tính là thất bại.` : 'Chưa tải được lịch sử Daily từ Notion. Số ngày hiện tại chỉ lấy từ thiết bị; streak lấy từ công thức Notion.'));
    }
    if (this.detailTab === 'activity') {
      panel.append(element('p', 'personal-history-note', this.app.habitHistorySyncedAt ? 'Nguồn: quan hệ Habit ↔ Daily trong Notion. Check trong app ghi ngày thực hiện và cập nhật dấu Today; đây chưa phải nhật ký định lượng theo cốc/phút/km.' : 'Các ngày check-in được lưu trên thiết bị này; đây chưa phải nhật ký số lượng và thời điểm đầy đủ.'));
      const log = element('ol', 'hh-activity-list');
      for (const day of history.toReversed()) log.append(element('li', '', `${day} · Đã check-in`));
      panel.append(history.length ? log : element('p', 'hh-empty', this.app.habitHistorySyncedAt ? 'Chưa có ngày Daily nào liên kết Habit này trong dữ liệu đã tải.' : 'Chưa có check-in được ghi nhận trên thiết bị này.'));
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
