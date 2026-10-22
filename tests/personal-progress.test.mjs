import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as progress from '../life-reset/js/personal-progress.mjs';

test('new local day clears daily checks without changing permanent quest/history records', () => {
  const state = { notionDay: '2026-10-21', notionDoneToday: { a: true }, completedToday: { b: true }, skippedToday: { c: true }, notionHistory: { a: ['2026-10-21'] } };
  const habits = [{ today: true, done: true }];
  assert.equal(progress.rollDailyState(state, habits, '2026-10-22'), true);
  assert.deepEqual(state.notionDoneToday, {});
  assert.deepEqual(state.notionHistory.a, ['2026-10-21']);
  assert.equal(habits[0].today, false);
  assert.equal(progress.rollDailyState(state, habits, '2026-10-22'), false);
});

test('Quest filters separate future, daily, overdue and completed items; search respects the filter', () => {
  const quests = [
    { id: 'old', title: 'Học tiếng Anh', date: '2026-10-20' },
    { id: 'now', title: 'Tập', date: '2026-10-22' },
    { id: 'future', title: 'Tập', dueDate: '2026-10-24' },
    { id: 'daily', title: 'Tập', frequency: 'Daily' },
    { id: 'undated', title: 'Tập' },
    { id: 'done', title: 'Tập', done: true }
  ];
  const select = (filter, search = '') => progress.selectQuests(quests, filter, {}, '2026-10-22', search).map(x => x.id);
  assert.deepEqual(select('today'), ['old', 'now', 'daily']);
  assert.deepEqual(select('overdue'), ['old']);
  assert.deepEqual(select('done'), ['done']);
  assert.deepEqual(select('open', 'TIẾNG ANH'), ['old']);
  assert.equal(progress.questBucket(quests[2], '2026-10-22'), 'upcoming');
});

test('66 day campaign crosses year boundaries with exact local dates', () => {
  const days = progress.campaignDays('2026-12-31', '2027-01-01');
  assert.equal(days.length, 66);
  assert.equal(days[1].date, '2027-01-01');
  assert.equal(days[1].future, false);
  assert.equal(days[2].future, true);
});

function makeApp() {
  const store = new Map();
  const context = vm.createContext({ ...progress, localStorage: { getItem: key => store.get(key), setItem: (key, value) => store.set(key, value) }, window: { addEventListener() {}, parent: { postMessage() {} }, location: { origin: 'http://localhost' } }, Date, Set, console });
  const source = fs.readFileSync(new URL('../life-reset/js/app.js', import.meta.url), 'utf8').replace(/^import .*;\r?\n/, '');
  vm.runInContext(`${source}\nglobalThis.TestApp = LifeResetApp;`, context);
  const app = new context.TestApp();
  for (const method of ['renderHelloSquareHabits', 'renderHabitCards', 'renderPathwayGrid', 'renderTrackerSplitCards', 'showSpideyToast', 'playSfx', 'renderHeaderStats']) app[method] = () => {};
  return { app, store };
}

test('successful check then undo updates the Habit object, cache, and history consistently', async () => {
  const { app, store } = makeApp();
  const habit = { id: 'notion_h1', rawId: 'h1', name: 'Read', today: false };
  app.notionHabits = [habit];
  app.persistNotionHabitCheck = async () => true;
  await app.toggleNotionHabitDone(habit);
  assert.equal(habit.today, true);
  assert.equal(JSON.parse(store.get('life_reset_notion_cache_v1')).habits[0].today, true);
  await app.toggleNotionHabitDone(habit);
  assert.equal(habit.today, false);
  assert.equal(habit.done, false);
  assert.equal(app.state.notionDoneToday[habit.id], undefined);
  assert.equal(app.state.notionHistory.h1.length, 0);
});

test('failed write leaves progress unchanged and repeated click does not send another write', async () => {
  const { app } = makeApp();
  const habit = { id: 'notion_h1', rawId: 'h1', today: false };
  let calls = 0, finish;
  app.persistNotionHabitCheck = () => { calls++; return new Promise(resolve => { finish = resolve; }); };
  const pending = app.toggleNotionHabitDone(habit);
  await app.toggleNotionHabitDone(habit);
  assert.equal(calls, 1);
  finish(false);
  await pending;
  assert.equal(habit.today, false);
  assert.equal(app.pendingHabitIds.size, 0);
  assert.equal(app.state.notionDoneToday[habit.id], undefined);
});
