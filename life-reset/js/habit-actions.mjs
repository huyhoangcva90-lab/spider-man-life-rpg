const KEY = 'spider_habit_actions_v1';
export function pendingHabitActions(storage = localStorage) {
  try { const value = JSON.parse(storage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; }
}
export function saveHabitAction(action, storage = localStorage) {
  const items = pendingHabitActions(storage);
  const existing = items.find(item => item.habitId === action.habitId);
  if (existing) return existing;
  items.push({ ...action, status: 'pending' });
  storage.setItem(KEY, JSON.stringify(items));
  return items.at(-1);
}
export function settleHabitAction(id, review = false, storage = localStorage) {
  const items = pendingHabitActions(storage).flatMap(item => item.id !== id ? [item] : review ? [{ ...item, status: 'review' }] : []);
  storage.setItem(KEY, JSON.stringify(items));
}
