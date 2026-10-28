import test from 'node:test';
import assert from 'node:assert/strict';
import { personalAppRoute, personalFieldDestination } from '../js/ui/PersonalAppRoutes.mjs';
import { ActionRpgController } from '../js/ui/ActionRpgController.js';
import { HubOverlayPanels } from '../js/ui/HubOverlayPanels.js';
import fs from 'node:fs';
import vm from 'node:vm';

test('Habit legacy links share one app and keep the requested view', () => {
  for (const tab of ['APP', 'GAMBIT', 'PROGRESS']) assert.equal(personalAppRoute('HABITS', tab).view, 'reports');
  assert.equal(personalAppRoute('HABITS', 'TODAY').view, 'today');
  assert.equal(personalAppRoute('HABITS', '66 DAYS').view, 'core-habits');
  assert.equal(personalAppRoute('QUESTS', 'OVERDUE').filter, 'overdue');
  assert.equal(personalAppRoute('QUESTS', 'MISSIONS'), null);
  assert.equal(personalAppRoute('QUESTS', 'GOALS'), null);
  assert.equal(personalAppRoute('HERO', 'PROFILE'), null);
});

test('Field Habit and To-do launch the canonical screens; unrelated tools are unchanged', () => {
  const selected = [];
  const ui = { selectSection: section => selected.push(section), fieldAppId: 'old' };
  ActionRpgController.prototype.openEmbeddedFieldApp.call(ui, 'habits');
  ActionRpgController.prototype.openEmbeddedFieldApp.call(ui, 'todo');
  assert.deepEqual(selected, ['HABITS', 'QUESTS']);
  assert.equal(ui.fieldAppId, null);
  for (const app of ['finance', 'timetable', 'gym', 'journal', 'routine']) assert.equal(personalFieldDestination(app), null);
});

test('old Quest and Habit pages render the same iframe instead of another tracker', () => {
  for (const section of ['HABITS', 'QUESTS']) {
    const html = ActionRpgController.prototype.renderSection.call({ panelSection: section, panelTab: 'GAMBIT' });
    assert.match(html, /life-reset\/personal\/index.html/);
    assert.doesNotMatch(html, /field-tools\/apps/);
  }
  const overdue = ActionRpgController.prototype.renderSection.call({ panelSection: 'QUESTS', panelTab: 'OVERDUE' });
  assert.match(overdue, /filter=overdue/);
});

test('main menu offers one Habit and one Quest entry', () => {
  const previous = globalThis.window;
  globalThis.window = { location: { hostname: 'localhost' } };
  try {
    const html = HubOverlayPanels.prototype.renderApps.call({});
    assert.equal((html.match(/data-game-menu-target="HABITS:/g) || []).length, 1);
    assert.equal((html.match(/data-game-menu-target="QUESTS:/g) || []).length, 1);
    assert.doesNotMatch(html, /GAMBIT TO-DO|GAMBIT HABITS/);
  } finally { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; }
});

test('Life OS bookmarks redirect to the single launcher or the requested canonical app', () => {
  const source = fs.readFileSync(new URL('../life-os/original-gambit-routes.js', import.meta.url), 'utf8');
  for (const [hash, section, app] of [['', 'FIELD', null], ['#reset66', 'HABITS', null], ['#habits', 'HABITS', null], ['#today', 'QUESTS', null], ['#timetable', 'FIELD', 'timetable']]) {
    let destination;
    const location = { hash, href: `https://spider.example/life-os/${hash}`, replace: value => { destination = new URL(value); } };
    vm.runInNewContext(source, { location, URL });
    assert.equal(destination.searchParams.get('game'), section);
    assert.equal(destination.searchParams.get('spiderApp'), app);
    assert.equal(destination.pathname, '/');
  }
});
