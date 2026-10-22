export const DAILY_DATABASE_ID = '272d787636c681c8b8adc9d6fdada0b7';
export const HABIT_PLANNER_DATABASE_ID = '272d787636c681228446e717b8137af1';
const cleanId = id => String(id || '').replaceAll('-', '').toLowerCase();

export function normalizeHabitPlan(page) {
  const p = page.properties || {};
  const formulaNumber = property => typeof property?.formula?.number === 'number' && Number.isFinite(property.formula.number) ? property.formula.number : null;
  return {
    id: page.id,
    name: (p.Name?.title || []).map(part => part.plain_text || part.text?.content || '').join(''),
    habitIds: (p.Habits?.relation || []).map(item => cleanId(item.id)),
    archived: !!(page.archived || page.in_trash || p.Archied?.checkbox),
    frequency: p.Frequency?.number ?? null, unit: p.Unit?.select?.name || '',
    start: p['Start Date']?.date?.start || null, end: p['End Date']?.date?.start || null,
    target: formulaNumber(p['Total Target']), completed: formulaNumber(p.Check),
    progress: formulaNumber(p['% Progress'])
  };
}

export function parseHabitStreak(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return { current: value, best: null };
  const text = String(value ?? '').replace(/\x1b\[[0-9;]*m/g, '');
  const current = text.match(/\bCurr(?:ent)?\s*:\s*(\d+)/i);
  const best = text.match(/\bLong(?:est)?\s*:\s*(\d+)/i);
  if (current) return { current: Number(current[1]), best: best ? Number(best[1]) : null };
  return { current: /^\d+$/.test(text.trim()) ? Number(text.trim()) : null, best: null };
}

function notionDay(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return date.toISOString().slice(0, 10) === value ? value : null;
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-');
}

// Daily.Habits is the inverse of Habits.Days used by the existing Notion streak.
// Never infer completion from a page title, created_time, or unrelated Daily checkboxes.
export function indexDailyHistory(pages, habitIds) {
  const history = Object.fromEntries(habitIds.map(id => [cleanId(id), []]));
  for (const page of pages) {
    if (page.archived || page.in_trash) continue;
    const day = notionDay(page.properties?.Date?.date?.start);
    if (!day) continue;
    for (const { id } of page.properties?.Habits?.relation || []) {
      const key = cleanId(id);
      if (history[key]) history[key].push(day);
    }
  }
  return Object.fromEntries(Object.entries(history).map(([id, days]) => [id, [...new Set(days)].sort()]));
}

export async function readDailyHabitHistory(habitIds, fetcher = fetch) {
  const ids = [...new Set(habitIds.map(cleanId))].filter(id => /^[a-f0-9]{32}$/.test(id));
  if (!ids.length) return {};
  const pages = [];
  const cursors = new Set();
  let cursor;
  do {
    const response = await fetcher(`/api/notion?path=${encodeURIComponent(`/v1/databases/${DAILY_DATABASE_ID}/query`)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 100, filter: { property: 'Habits', relation: { is_not_empty: true } }, ...(cursor ? { start_cursor: cursor } : {}) })
    });
    if (!response.ok) throw new Error(`Không đọc được lịch sử Notion (HTTP ${response.status})`);
    const payload = await response.json();
    if (!payload.ok || !Array.isArray(payload.data?.results)) throw new Error('Phản hồi lịch sử Notion không hợp lệ');
    for (const page of payload.data.results) {
      // An incomplete relation must not silently produce incomplete statistics.
      if (page.properties?.Habits?.has_more) throw new Error('Quan hệ Daily bị rút gọn; chưa thể xác nhận đầy đủ lịch sử');
      pages.push(page);
    }
    cursor = payload.data.has_more ? payload.data.next_cursor : null;
    if (payload.data.has_more && (!cursor || cursors.has(cursor))) throw new Error('Phân trang lịch sử Notion không hợp lệ');
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return indexDailyHistory(pages, ids);
}

export function recordedHabitDays(habit, remote, local) {
  const key = cleanId(habit.rawId || habit.id);
  // A confirmed remote snapshot replaces older device observations for this habit.
  const known = remote && Array.isArray(remote[key]);
  return [...new Set(known ? remote[key] : local?.[habit.rawId || habit.id] || [])].sort();
}
