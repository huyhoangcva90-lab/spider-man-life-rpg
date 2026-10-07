import assert from 'node:assert/strict';
import { normalizeNotionPage, queryAllNotionPages, queueNotionWrite, flushPendingNotionWrites, readPendingNotionWrites } from '../js/integrations/notion/NotionGameData.js';

const requests = [];
const pages = await queryAllNotionPages('database-id', async (_url, options) => {
  const body = JSON.parse(options.body);
  requests.push(body);
  return { ok: true, json: async () => ({ ok: true, data: body.start_cursor
    ? { results: [{ id: 'second' }], has_more: false }
    : { results: [{ id: 'first' }], has_more: true, next_cursor: 'next' } }) };
});
assert.deepEqual(pages.map((page) => page.id), ['first', 'second']);
assert.equal(requests[0].page_size, 100);
assert.equal(requests[1].start_cursor, 'next');

const normalized = normalizeNotionPage({ id: 'task', url: 'https://notion.so/task', properties: {
  Name: { type: 'title', title: [{ plain_text: 'Việc thật' }] },
  Status: { status: { name: 'Done' } },
  Priority: { multi_select: [{ name: 'High' }, { name: 'Urgent' }] },
  Date: { date: { start: '2026-10-04' } }
} }, 'masterCalendar');
assert.equal(normalized.title, 'Việc thật');
assert.equal(normalized.done, true);
assert.equal(normalized.priority, 'High, Urgent');
assert.equal(normalized.date, '2026-10-04');
const goal = normalizeNotionPage({ id: 'goal', properties: {
  Name: { type: 'title', title: [{ plain_text: 'Chạy 5 km' }] },
  Status: { status: { name: 'In progress' } }
} }, 'goals');
assert.equal(goal.title, 'Chạy 5 km');
assert.equal(goal.achieved, false);
await assert.rejects(() => queryAllNotionPages('database-id', async () => ({ ok: false, status: 503 })));

const values = new Map();
const storage = { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
queueNotionWrite('habits', 'abc-def', storage);
queueNotionWrite('habits', 'abc-def', storage);
assert.equal(readPendingNotionWrites(storage).length, 1);
let firstAttempt = true;
const fetcher = async (_url, options) => {
  assert.equal(JSON.parse(options.body).properties.Today.checkbox, true);
  if (firstAttempt) { firstAttempt = false; return { ok: false }; }
  return { ok: true, json: async () => ({ ok: true }) };
};
assert.equal(await flushPendingNotionWrites(fetcher, storage), 1);
assert.equal(await flushPendingNotionWrites(fetcher, storage), 0);
console.log('Notion pagination, normalization, and pending-write retry passed.');
