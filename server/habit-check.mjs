import { DAILY_DATABASE_ID } from '../js/integrations/notion/NotionHabitHistory.mjs';
import { NOTION_GAME_DATABASES } from '../js/integrations/notion/NotionRecords.mjs';

const locks = new Map();
const clean = value => String(value || '').replaceAll('-', '').toLowerCase();
export function vietnamDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-');
}
function failure(message, status = 502, partial = false) { return Object.assign(new Error(message), { status, partial }); }
async function serial(key, task) {
  const previous = locks.get(key) || Promise.resolve();
  const current = previous.catch(() => {}).then(task);
  locks.set(key, current);
  try { return await current; } finally { if (locks.get(key) === current) locks.delete(key); }
}

// Fixed-value writes are retryable; the same click never toggles on the server.
// Notion has no cross-instance transaction. Duplicate Daily dates fail visibly.
export async function writeHabitCheck(input, request, now = new Date()) {
  const id = clean(input?.habitId), day = input?.day;
  if (!/^[a-f0-9]{32}$/.test(id) || typeof input?.checked !== 'boolean') throw failure('Invalid habit action', 400);
  if (day !== vietnamDay(now)) throw failure('Ngày đã thay đổi. Mở lại hôm nay để xác nhận thao tác.', 409);
  return serial('habit:' + id, async () => {
    const call = async (path, method = 'GET', body) => {
      const response = await request(path, { method, ...(body ? { body: JSON.stringify(body) } : {}) });
      if (!response.ok) throw failure('Chưa xác nhận được dữ liệu Notion.', [401, 403].includes(response.status) ? response.status : 502);
      return response.json();
    };
    const page = await call('/v1/pages/' + id);
    if (page.archived || page.in_trash || clean(page.parent?.database_id) !== clean(NOTION_GAME_DATABASES.habits)) throw failure('Bản ghi không phải Habit đang dùng.', 400);
    const property = page.properties?.Days;
    if (property?.type !== 'relation') throw failure('Habit chưa có quan hệ Days.', 409);
    const queryDay = async () => {
      const result = await call(`/v1/databases/${DAILY_DATABASE_ID}/query`, 'POST', { page_size: 2, filter: { property: 'Date', date: { equals: day } } });
      if (!Array.isArray(result.results) || result.has_more || result.results.length > 1) throw failure('Có nhiều trang Daily cùng ngày. Cần kiểm tra dữ liệu trước khi ghi.', 409);
      return result.results[0] || null;
    };
    const daily = await serial('day:' + day, async () => {
      let existing = await queryDay();
      if (!existing && input.checked) {
        if (!input.expectedEditedAt || page.last_edited_time !== input.expectedEditedAt) throw failure('Habit đã thay đổi. Làm mới trước khi check.', 409);
        await call('/v1/pages', 'POST', { parent: { database_id: DAILY_DATABASE_ID }, properties: {
          Name: { title: [{ text: { content: day } }] }, Date: { date: { start: day } }
        } });
        existing = await queryDay();
        if (!existing) throw failure('Chưa xác nhận được trang Daily mới.');
      }
      if (!existing) return null;
      const relation = existing.properties?.Habits;
      if (relation?.type !== 'relation') throw failure('Daily chưa có quan hệ Habits.', 409);
      let ids = (relation.relation || []).map(item => item.id);
      if (relation.has_more) {
        ids = []; let cursor; const seen = new Set();
        do {
          const data = await call('/v1/pages/' + existing.id + '/properties/' + encodeURIComponent(relation.id) + '?page_size=100' + (cursor ? '&start_cursor=' + encodeURIComponent(cursor) : ''));
          if (!Array.isArray(data.results)) throw failure('Không đọc đủ quan hệ Daily.');
          ids.push(...data.results.map(item => item.relation?.id).filter(Boolean));
          cursor = data.has_more ? data.next_cursor : null;
          if (data.has_more && (!cursor || seen.has(cursor))) throw failure('Phân trang Daily không đầy đủ.');
          if (cursor) seen.add(cursor);
        } while (cursor);
      }
      const present = ids.some(value => clean(value) === id);
      if (present !== input.checked && (!input.expectedEditedAt || page.last_edited_time !== input.expectedEditedAt)) throw failure('Habit đã được thay đổi ở nơi khác. Làm mới trước khi check lại.', 409);
      if (present !== input.checked) {
        const next = input.checked ? [...ids, id] : ids.filter(value => clean(value) !== id);
        if (next.length > 100) throw failure('Daily có quá nhiều Habit; dữ liệu cũ được giữ nguyên.', 409);
        await call('/v1/pages/' + existing.id, 'PATCH', { properties: { Habits: { relation: next.map(value => ({ id: value })) } } });
      }
      return existing;
    });
    try {
      // Daily is the dated source; Today remains a compatibility mirror only.
      const latest = await call('/v1/pages/' + id);
      // Do not re-edit an unchanged checkbox: upstream automations may react to edits.
      const confirmed = latest.properties?.Today?.checkbox === input.checked ? latest
        : await call('/v1/pages/' + id, 'PATCH', { properties: { Today: { checkbox: input.checked } } });
      return { checked: input.checked, day, dailyId: daily?.id || null, editedAt: confirmed.last_edited_time || null };
    } catch (error) { error.partial = true; throw error; }
  });
}
