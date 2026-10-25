import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../field-tools/apps/timetable/index.html', import.meta.url), 'utf8');

test('Gambit 24-hour clock scripts parse with Spider integration', () => {
  for (const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
});

test('switching dates keeps the latest Calendar response even when the old request finishes last', async () => {
  const requests = [];
  const dateField = { value: '2026-10-22' };
  const refresh = {};
  const connect = { querySelector: () => ({}) };
  const context = vm.createContext({
    document: { getElementById: id => id === 'calendarDate' ? dateField : id === 'calendarRefresh' ? refresh : connect },
    URLSearchParams, fetch: () => new Promise(resolve => requests.push(resolve)),
    googleConnected: true, googleCalendars: [{}], selectedCalendarIds: () => ['calendar'],
    setCalendarStatus() {}, useActiveZones() {},
    googleEventsToZones: items => items, balanceDayZones: items => items,
    calendarZones: [], calendarLoaded: false
  });
  const start = source.indexOf('let calendarRequestVersion=0;');
  const end = source.indexOf('function connectGoogleCalendar()', start);
  vm.runInContext(source.slice(start, end), context);
  const older = context.loadGoogleCalendar();
  dateField.value = '2026-10-23';
  const newer = context.loadGoogleCalendar();
  requests[1]({ ok: true, json: async () => ({ calendars: [{ calendar: {}, items: [{ name: 'new day', from: 9, to: 10 }] }] }) });
  await newer;
  requests[0]({ ok: true, json: async () => ({ calendars: [{ calendar: {}, items: [{ name: 'old day', from: 8, to: 9 }] }] }) });
  await older;
  assert.equal(context.calendarZones[0].name, 'new day');
  assert.equal(context.calendarLoaded, true);
  assert.equal(refresh.disabled, false);
});
