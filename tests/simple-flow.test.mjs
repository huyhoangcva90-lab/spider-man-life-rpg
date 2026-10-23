import test from 'node:test';
import assert from 'node:assert/strict';
import { vietnamDay } from '../js/core/GameDay.mjs';
import { createSessionReader } from '../life-reset/js/session-reader.mjs';
import { NotionAdapter } from '../js/integrations/notion/NotionAdapter.js';
import { queueNotionWrite, flushPendingNotionWrites, readPendingNotionWrites, queryAllNotionPages } from '../js/integrations/notion/NotionGameData.js';

test('client and server share the Vietnam day at midnight regardless of device timezone', () => {
  assert.equal(vietnamDay(new Date('2026-10-23T16:59:59Z')), '2026-10-23');
  assert.equal(vietnamDay(new Date('2026-10-23T17:00:00Z')), '2026-10-24');
  assert.equal(vietnamDay(new Date('2026-10-23T10:00:00-07:00')), '2026-10-24');
});

test('connection reads coalesce, cache briefly and refresh after login or expiry', async () => {
  let calls = 0, time = 0, connected = false, finish;
  const read = createSessionReader(async () => {
    calls++;
    await new Promise(resolve => { finish = resolve; });
    return { ok: true, json: async () => ({ connected }) };
  }, () => time);
  const first = read(), second = read();
  assert.equal(calls, 1); finish();
  assert.deepEqual(await first, await second);
  assert.equal((await read()).connected, false);
  assert.equal(calls, 1);
  connected = true;
  const login = read({ force: true }); finish();
  assert.equal((await login).connected, true);
  time = 30001;
  const expired = read(); finish(); await expired;
  assert.equal(calls, 3);
});

test('a failed connection response is never cached as a connected session', async () => {
  let failed = true;
  const read = createSessionReader(async () => failed ? { ok: false } : { ok: true, json: async () => ({ connected: false }) });
  await assert.rejects(read);
  failed = false;
  assert.equal((await read()).connected, false);
});

test('undated legacy Habit intent is preserved without sending Today or blocking valid Quest writes', async () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  queueNotionWrite('habits', 'old-habit', storage);
  queueNotionWrite('masterCalendar', 'task', storage);
  const writes = [];
  assert.equal(await flushPendingNotionWrites(async (url, options) => {
    writes.push({ url, body: JSON.parse(options.body) });
    return { ok: true, json: async () => ({ ok: true }) };
  }, storage), 1);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].body.properties.Done.checkbox, true);
  assert.deepEqual(readPendingNotionWrites(storage), [{ kind: 'habits', id: 'old-habit' }]);
});

test('broken pagination stops rather than requesting the same page forever', async () => {
  let calls = 0;
  await assert.rejects(() => queryAllNotionPages('db', async () => {
    calls++;
    return { ok: true, json: async () => ({ ok: true, data: { results: [], has_more: true, next_cursor: 'same' } }) };
  }), /repeated/);
  assert.equal(calls, 2);
});

test('placing an unlocated mission retains its Notion identity on the next refresh', () => {
  const rows = [], id = '11111111-1111-1111-1111-111111111111';
  const repo = { getAll: () => [...rows], create: value => { rows.push(value); return value; }, update: (id, value) => Object.assign(rows.find(row => row.id === id), value) };
  const adapter = new NotionAdapter({}, repo);
  adapter.rawSnapshot = { collections: { masterCalendar: [{ id, title: 'QA' }] } };
  adapter.parseSnapshot();
  const placed = adapter.assignLocation(adapter.getUnlocatedMissions()[0].id, 21, 105, 'QA');
  adapter.parseSnapshot();
  assert.equal(rows.length, 1);
  assert.equal(placed.id, 'notion-' + id.replaceAll('-', ''));
  assert.equal(adapter.getUnlocatedMissions().length, 0);
});

test('reopening Map within a minute reuses its read; explicit refresh still works', async () => {
  const original = globalThis.fetch;
  let reads = 0;
  globalThis.fetch = async () => { reads++; return { ok: true, json: async () => ({ collections: {} }) }; };
  try {
    const adapter = new NotionAdapter({}, { getAll: () => [] });
    assert.equal(await adapter.loadSnapshot(), true);
    assert.equal(await adapter.loadSnapshot(), false);
    assert.equal(reads, 1);
    assert.equal(await adapter.loadSnapshot({ force: true }), true);
    assert.equal(reads, 2);
  } finally { globalThis.fetch = original; }
});
