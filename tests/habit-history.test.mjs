import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHabitStreak, indexDailyHistory, readDailyHabitHistory, recordedHabitDays, normalizeHabitPlan } from '../js/integrations/notion/NotionHabitHistory.mjs';
import { normalizeNotionPage } from '../js/integrations/notion/NotionGameData.js';

const habit = '11111111111111111111111111111111';
const other = '22222222222222222222222222222222';
const daily = (date, ids = [habit]) => ({ properties: { Date: { date: { start: date } }, Habits: { relation: ids.map(id => ({ id })) } } });

test('Planner mapping preserves relation identity, formula zeros and missing targets without inventing goals', () => {
  const plan = normalizeHabitPlan({ id: 'p', properties: {
    Habits: { relation: [{ id: habit }] }, Frequency: { number: 3 }, Unit: { select: { name: 'Week' } },
    Check: { formula: { number: 0 } }, 'Total Target': { formula: { number: 12 } }, Archied: { checkbox: true }
  } });
  assert.deepEqual(plan.habitIds, [habit]);
  assert.equal(plan.completed, 0);
  assert.equal(plan.target, 12);
  assert.equal(plan.archived, true);
  assert.equal(normalizeHabitPlan({ properties: {} }).target, null);
});

test('formatted Notion streak preserves current and longest instead of converting text to zero', () => {
  assert.deepEqual(parseHabitStreak('Curr: 7🔥 Long: 19🔥'), { current: 7, best: 19 });
  assert.deepEqual(parseHabitStreak(4), { current: 4, best: null });
  assert.deepEqual(parseHabitStreak(''), { current: null, best: null });
  const result = normalizeNotionPage({ id: habit, properties: { Streak: { type: 'formula', formula: { string: 'Curr: 7🔥 Long: 19🔥' } }, Color: { select: { name: 'Green' } } } }, 'habits');
  assert.equal(result.streak, 7);
  assert.equal(result.bestStreak, 19);
  assert.equal(result.color, 'Green');
});

test('history follows dated Habit relations, deduplicates dates, and excludes unrelated/private fields', () => {
  const pages = [daily('2026-10-20'), daily('2026-10-20'), daily('2026-10-21', [other]), daily(null), { ...daily('2026-10-19'), archived: true }, daily('2026-02-30')];
  pages[0].properties.Journal = { rich_text: [{ text: { content: 'private content' } }] };
  assert.deepEqual(indexDailyHistory(pages, [habit]), { [habit]: ['2026-10-20'] });
  assert.deepEqual(indexDailyHistory([daily('2026-10-21T18:30:00Z')], [habit]), { [habit]: ['2026-10-22'] });
});

test('pagination reads every Daily page and commits no partial history after errors', async () => {
  const requests = [];
  const result = await readDailyHabitHistory([habit], async (_url, options) => {
    const body = JSON.parse(options.body);
    requests.push(body);
    return { ok: true, json: async () => ({ ok: true, data: body.start_cursor ? { results: [daily('2026-10-21')], has_more: false } : { results: [daily('2026-10-20')], has_more: true, next_cursor: 'next' } }) };
  });
  assert.deepEqual(result, { [habit]: ['2026-10-20', '2026-10-21'] });
  assert.equal(requests[1].start_cursor, 'next');
  assert.equal(requests[0].filter.property, 'Habits');
  await assert.rejects(() => readDailyHabitHistory([habit], async () => ({ ok: false, status: 403 })), /403/);
});

test('a truncated relation or invalid pagination cannot silently become a complete history', async () => {
  const page = daily('2026-10-20');
  page.properties.Habits.has_more = true;
  await assert.rejects(() => readDailyHabitHistory([habit], async () => ({ ok: true, json: async () => ({ ok: true, data: { results: [page], has_more: false } }) })), /rút gọn/);
  await assert.rejects(() => readDailyHabitHistory([habit], async () => ({ ok: true, json: async () => ({ ok: true, data: { results: [], has_more: true } }) })), /Phân trang/);
});

test('authoritative empty remote history does not resurrect device observations; unavailable history keeps them', () => {
  const local = { [habit]: ['2026-10-19'] };
  assert.deepEqual(recordedHabitDays({ rawId: habit }, { [habit]: [] }, local), []);
  assert.deepEqual(recordedHabitDays({ rawId: habit }, null, local), ['2026-10-19']);
  assert.deepEqual(local[habit], ['2026-10-19']);
  const dashed = '11111111-1111-1111-1111-111111111111';
  assert.deepEqual(recordedHabitDays({ rawId: dashed }, { [habit]: ['2026-10-20'] }, {}), ['2026-10-20']);
});
