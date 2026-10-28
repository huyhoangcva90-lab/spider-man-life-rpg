import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../field-tools/apps/timetable/index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../field-tools/apps/timetable/sectograph.js', import.meta.url), 'utf8');

test('Gambit 24-hour clock scripts parse with Spider integration', () => {
  for (const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
  new vm.Script(app.replace(/^import[\s\S]*?;\s*/gm, ''));
});

test('switching dates keeps the latest Calendar response even when the old request finishes last', async () => {
  const requests = [];
  const s = { date: '2026-10-22' };
  const sources = { request: 0, notion: [], google: [], routine: [] };
  const context = vm.createContext({
    s, sources, URLSearchParams, calendarConfig: {}, location: { origin: 'https://spider.test' },
    parent: { postMessage() {} }, render() {},
    jsonGet: async url => url === '/api/notion-session' ? { connected: true } : { connected: false, routines: [] },
    NOTION_GAME_DATABASES: { masterCalendar: 'tasks', activeQuests: 'quests' },
    queryAllNotionPages: id => id === 'tasks' ? new Promise(resolve => requests.push(resolve)) : Promise.resolve([]),
    notionEvents: pages => pages, routineEvents: () => [], key: d => d.toISOString().slice(0,10)
  });
  const start = app.indexOf('async function loadSources()');
  const end = app.indexOf('async function connectNotion()', start);
  vm.runInContext(app.slice(start, end), context);
  const older = context.loadSources();
  await new Promise(resolve => setImmediate(resolve));
  s.date = '2026-10-23';
  const newer = context.loadSources();
  await new Promise(resolve => setImmediate(resolve));
  requests[1]([{ name: 'new day' }]);
  await newer;
  requests[0]([{ name: 'old day' }]);
  await older;
  assert.equal(sources.notion[0].name, 'new day');
  assert.equal(sources.date, '2026-10-23');
  assert.equal(sources.loading, false);
});
