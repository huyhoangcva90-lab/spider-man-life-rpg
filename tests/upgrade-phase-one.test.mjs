import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { writeHabitCheck, vietnamDay } from '../server/habit-check.mjs';
import { NOTION_GAME_DATABASES } from '../js/integrations/notion/NotionGameData.js';
import { DAILY_DATABASE_ID } from '../js/integrations/notion/NotionHabitHistory.mjs';
import personalHandler from '../api/personal-state.mjs';
import checkHandler from '../api/habit-check.mjs';
import { saveHabitAction, pendingHabitActions, settleHabitAction } from '../life-reset/js/habit-actions.mjs';
import { readPersonalState } from '../server/personal-state.mjs';
import { NotionAdapter } from '../js/integrations/notion/NotionAdapter.js';

const id = '11111111111111111111111111111111', other = '22222222222222222222222222222222';
const now = new Date('2026-10-23T03:00:00Z');
const input = { habitId: id, day: '2026-10-23', checked: true, expectedEditedAt: 'v1' };
function source({ missing = false, duplicate = false, failMirror = false, failMirrorAfterCommit = false } = {}) {
  const calls = [];
  const habits = new Map([id, other].map(key => [key, { id: key, last_edited_time: 'v1', parent: { database_id: NOTION_GAME_DATABASES.habits }, properties: { Days: { type: 'relation', relation: [] } } }]));
  let daily = missing ? null : { id: 'daily', properties: { Habits: { type: 'relation', relation: [{ id: other }] } } };
  const request = async (path, options) => {
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ path, method: options.method, body });
    if (path === `/v1/databases/${DAILY_DATABASE_ID}/query`) return { ok: true, json: async () => ({ results: duplicate ? [daily, daily] : daily ? [structuredClone(daily)] : [], has_more: false }) };
    if (path === '/v1/pages' && options.method === 'POST') { daily = { id: 'daily', properties: { Habits: { type: 'relation', relation: [] } } }; return { ok: true, json: async () => structuredClone(daily) }; }
    if (path === '/v1/pages/daily' && options.method === 'PATCH') { daily.properties.Habits = { type: 'relation', ...body.properties.Habits }; return { ok: true, json: async () => structuredClone(daily) }; }
    const habit = habits.get(path.split('/').at(-1));
    if (!habit) throw Error('Unexpected request');
    if (options.method === 'PATCH') {
      if (failMirror) { failMirror = false; return { ok: false, status: 502 }; }
      habit.properties.Today = body.properties.Today;
      habit.last_edited_time = 'v2';
      if (failMirrorAfterCommit) { failMirrorAfterCommit = false; return { ok: false, status: 502 }; }
    }
    return { ok: true, json: async () => structuredClone(habit) };
  };
  return { request, calls, habits, daily: () => daily };
}

test('dated check preserves other Habit relations; retry and undo never create another Daily', async () => {
  const s = source();
  await writeHabitCheck(input, s.request, now);
  assert.deepEqual(s.daily().properties.Habits.relation.map(x => x.id), [other, id]);
  await writeHabitCheck(input, s.request, now);
  assert.equal(s.calls.filter(x => x.path === '/v1/pages/daily' && x.method === 'PATCH').length, 1);
  await writeHabitCheck({ ...input, checked: false, expectedEditedAt: 'v2' }, s.request, now);
  assert.deepEqual(s.daily().properties.Habits.relation.map(x => x.id), [other]);
  assert.equal(s.calls.filter(x => x.path === '/v1/pages').length, 0);
});

test('failed Today mirror retains dated check and is repaired without repeating the Daily write', async () => {
  const s = source({ failMirror: true });
  await assert.rejects(() => writeHabitCheck(input, s.request, now), error => error.partial === true);
  assert.ok(s.daily().properties.Habits.relation.some(x => x.id === id));
  await writeHabitCheck(input, s.request, now);
  assert.equal(s.calls.filter(x => x.path === '/v1/pages/daily' && x.method === 'PATCH').length, 1);
});

test('a lost response after Today was committed never re-edits the checkbox on retry', async () => {
  const s = source({ failMirrorAfterCommit: true });
  await assert.rejects(() => writeHabitCheck(input, s.request, now), error => error.partial);
  await writeHabitCheck(input, s.request, now);
  assert.equal(s.calls.filter(call => call.path === '/v1/pages/' + id && call.method === 'PATCH').length, 1);
});

test('missing Daily is created once with date; ambiguous dates and stale edits fail without patching', async () => {
  const s = source({ missing: true });
  await writeHabitCheck(input, s.request, now);
  await writeHabitCheck(input, s.request, now);
  const creates = s.calls.filter(x => x.path === '/v1/pages');
  assert.equal(creates.length, 1);
  assert.equal(creates[0].body.properties.Date.date.start, input.day);
  const duplicate = source({ duplicate: true });
  await assert.rejects(() => writeHabitCheck(input, duplicate.request, now), error => error.status === 409);
  assert.equal(duplicate.calls.filter(x => x.method === 'PATCH').length, 0);
  const stale = source(); stale.habits.get(id).last_edited_time = 'newer';
  await assert.rejects(() => writeHabitCheck(input, stale.request, now), error => error.status === 409);
  assert.equal(stale.calls.filter(x => x.method === 'PATCH').length, 0);
});

test('calendar day uses Vietnam timezone and queued prior-day intent cannot become today', async () => {
  assert.equal(vietnamDay(new Date('2026-10-22T17:01:00Z')), '2026-10-23');
  const s = source();
  await assert.rejects(() => writeHabitCheck({ ...input, day: '2026-10-22' }, s.request, now), error => error.status === 409);
  assert.equal(s.calls.length, 0);
});

test('queue keeps the original fixed-value intent across retries and requires review on conflict', () => {
  const data = new Map(), storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  saveHabitAction({ ...input, id: 'a' }, storage);
  assert.equal(saveHabitAction({ ...input, id: 'b', checked: false }, storage).id, 'a');
  settleHabitAction('a', true, storage);
  assert.equal(pendingHabitActions(storage)[0].status, 'review');
  settleHabitAction('a', false, storage);
  assert.deepEqual(pendingHabitActions(storage), []);
});

function response() { return { code: 0, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
test('personal projection is private and mutations require the site origin', async () => {
  const result = response();
  await personalHandler({ method: 'GET', headers: { host: 'spider.example' } }, result);
  assert.equal(result.code, 403);
  assert.equal(result.body.collections, undefined);
  assert.equal(result.headers['Cache-Control'], 'private, no-store');
  const cross = response();
  await checkHandler({ method: 'POST', headers: { host: 'spider.example', origin: 'https://elsewhere.example' }, body: input }, cross);
  assert.equal(cross.code, 403);
  const snapshot = JSON.parse(await fs.readFile(new URL('../data/notion-snapshot.json', import.meta.url)));
  assert.ok(Object.values(snapshot.collections).every(items => items.length === 0));
});

test('Gym unwraps the real proxy shape and follows query pagination', async () => {
  const html = await fs.readFile(new URL('../field-tools/apps/gym/index.html', import.meta.url), 'utf8');
  const code = html.split(/\r?\n/).filter(line => /^(function nFetch|async function queryDb)/.test(line)).join('\n');
  let requests = 0;
  const context = vm.createContext({ window: {}, DB: { logs: 'db' }, state: { db: {} }, Set,
    fetch: async (_url, options) => { const body = JSON.parse(options.body); requests++; return { ok: true, json: async () => ({ ok: true, data: body.start_cursor ? { results: [{ id: 'second' }], has_more: false } : { results: [{ id: 'first' }], has_more: true, next_cursor: 'next' } }) }; } });
  vm.runInContext(code, context);
  const rows = await context.queryDb('logs');
  assert.deepEqual(Array.from(rows, row => row.id), ['first', 'second']);
  assert.equal(requests, 2);
});

test('private personal projection paginates and never copies unrelated page fields', async () => {
  const calls = [];
  const data = await readPersonalState(async (path, options) => {
    const body = JSON.parse(options.body); calls.push({ path, body });
    return { ok: true, json: async () => ({ results: [{ id: path + (body.start_cursor || ''), properties: { Name: { type: 'title', title: [{ plain_text: 'QA' }] }, PrivateDiary: { rich_text: [{ plain_text: 'must not copy' }] } } }], has_more: !body.start_cursor, ...(!body.start_cursor ? { next_cursor: 'next' } : {}) }) };
  });
  assert.equal(data.collections.masterCalendar.length, 2);
  assert.equal(data.collections.habits.length, 2);
  assert.equal(data.collections.goals.length, 2);
  assert.equal(calls.length, 6);
  assert.ok(!JSON.stringify(data).includes('must not copy'));
});

test('Notion map reconciliation updates source fields without duplicating markers or replacing personal notes', () => {
  const entries = [];
  const repo = { getAll: () => [...entries], create: value => entries.push({ ...value, notes: 'keep note' }), update: (key, changes) => Object.assign(entries.find(item => item.id === key), changes) };
  const adapter = new NotionAdapter({}, repo);
  const item = { id, title: 'First', lat: 0, lng: 0, sourceUrl: 'https://www.notion.so/' + id };
  adapter.rawSnapshot = { collections: { masterCalendar: [item] } }; adapter.parseSnapshot();
  adapter.rawSnapshot.collections.masterCalendar[0] = { ...item, title: 'Updated', lat: 1, done: true };
  adapter.parseSnapshot();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].title, 'Updated');
  assert.equal(entries[0].status, 'DONE');
  assert.equal(entries[0].lat, 1);
  assert.equal(entries[0].notes, 'keep note');
});

test('two checks sharing one Daily are serialized within a runtime and preserve both habits', async () => {
  const s = source(); s.daily().properties.Habits.relation = [];
  await Promise.all([writeHabitCheck(input, s.request, now), writeHabitCheck({ ...input, habitId: other }, s.request, now)]);
  assert.deepEqual(new Set(s.daily().properties.Habits.relation.map(item => item.id)), new Set([id, other]));
});
