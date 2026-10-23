import { vietnamDay } from '../../js/core/GameDay.mjs';
export { vietnamDay };

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Notion owns completion. Local history only records observations and successful writes.
export function rollDailyState(state, habits, today = vietnamDay()) {
  if (state.notionDay === today) return false;
  state.notionDay = today;
  state.notionDoneToday = {};
  state.completedToday = {};
  state.skippedToday = {};
  for (const habit of habits) { habit.today = false; habit.done = false; }
  return true;
}

export function questBucket(quest, today = vietnamDay()) {
  const due = String(quest.date || quest.dueDate || '').slice(0, 10);
  if (due && due < today) return 'overdue';
  if (due === today || /daily|hàng ngày/i.test(quest.frequency || '')) return 'today';
  return due ? 'upcoming' : 'unscheduled';
}

export function selectQuests(quests, filter, completed, today = vietnamDay(), search = '') {
  const query = search.trim().toLocaleLowerCase('vi');
  return quests.filter(quest => {
    const done = !!(quest.done || completed[quest.id]);
    if (filter === 'done' ? !done : done) return false;
    if (filter === 'today' && !['overdue', 'today'].includes(questBucket(quest, today))) return false;
    if (filter === 'overdue' && questBucket(quest, today) !== 'overdue') return false;
    return !query || `${quest.title || quest.name || ''} ${quest.description || ''}`.toLocaleLowerCase('vi').includes(query);
  }).sort((a, b) => String(a.date || a.dueDate || '9999').localeCompare(String(b.date || b.dueDate || '9999')));
}

export function campaignDays(start, today = vietnamDay(), length = 66) {
  const days = [];
  const cursor = new Date(`${start}T12:00:00`);
  for (let i = 0; i < length; i++, cursor.setDate(cursor.getDate() + 1)) {
    days.push({ day: i + 1, date: dateKey(cursor), future: dateKey(cursor) > today });
  }
  return days;
}

export function personalDashboardSummary(cache, state, today = vietnamDay()) {
  if (!cache || !Array.isArray(cache.habits)) return { habits: 'Mở Habit', quests: 'Mở Quest' };
  const marks = state?.notionDay === today ? state.notionDoneToday || {} : {};
  const stamp = cache.habitSyncedAt || cache.syncedAt;
  const freshDay = stamp && vietnamDay(new Date(stamp)) === today;
  const done = cache.habits.filter(habit => marks[habit.id] || freshDay && habit.today).length;
  const quests = [...(cache.tasks || []), ...(cache.activeQuests || [])];
  return {
    habits: freshDay ? `${done}/${cache.habits.length} · bản lưu` : 'Mở để cập nhật',
    quests: `${quests.filter(quest => quest.done || marks[quest.id]).length}/${quests.length} · bản lưu`
  };
}
