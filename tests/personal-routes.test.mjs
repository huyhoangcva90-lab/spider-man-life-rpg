import test from 'node:test';
import assert from 'node:assert/strict';
import { personalAppRoute, personalFieldDestination } from '../js/ui/PersonalAppRoutes.mjs';
import { ActionRpgController } from '../js/ui/ActionRpgController.js';
import { fieldAppUrl } from '../js/ui/FieldApps.js';
import { HubOverlayPanels } from '../js/ui/HubOverlayPanels.js';
import { dayView } from '../life-reset/personal/reference-views.mjs';
import fs from 'node:fs';
import vm from 'node:vm';

test('Habit legacy links share the one Notion-backed Habit screen', () => {
  for (const tab of ['APP', 'GAMBIT', 'TODAY', 'PROGRESS', '66 DAYS']) {
    assert.equal(personalAppRoute('HABITS', tab).view, 'reports');
    assert.equal(personalAppRoute('HABITS', tab).src, './field-view/apps/habits/index.html');
    assert.equal(personalAppRoute('HABITS', tab).gambit, true);
  }
  assert.equal(personalAppRoute('QUESTS', 'OVERDUE').filter, 'overdue');
  assert.equal(personalAppRoute('QUESTS', 'APP').filter, null);
  assert.equal(personalAppRoute('QUESTS', 'MISSIONS'), null);
  assert.equal(personalAppRoute('QUESTS', 'GOALS'), null);
  assert.equal(personalAppRoute('HERO', 'PROFILE'), null);
});

test('Spider Quest cards use Active Quests from Notion, not Calendar tasks or a local 66-day counter', () => {
  const view=dayView({
    store:{data:{tasks:[{id:'calendar',title:'Calendar task'}],activeQuests:[{id:'quest',title:'Notion Quest',done:false,sourceUrl:'https://www.notion.so/quest'}]},writable:new Set(['activeQuests']),busy:new Set()},
    state:{search:'',filter:'all',bucket:'todo',date:'2026-10-28'},
    esc:value=>String(value),icon:()=>'',flavor:()=> 'patrol',status:()=>'',safeLink:()=>''
  });
  assert.match(view,/Notion Quest/);
  assert.doesNotMatch(view,/Calendar task|DAY 1|\/ 66|Skip today/);
  assert.match(view,/aaad787636c682b1a61b0119fca3398b/);
});

test('Field apps stay embedded and Habit opens the canonical Gambit app section', () => {
    const opened = [];
    const controller = {selectSection(section){opened.push(section);},renderPanel(){},updateRoute(){}};
    for (const app of ['habits', 'todo', 'finance', 'timetable', 'gym', 'journal', 'routine']) {
      ActionRpgController.prototype.openEmbeddedFieldApp.call(controller, app);
      assert.equal(opened.at(-1), app === 'habits' ? 'HABITS' : 'FIELD');
      assert.equal(controller.fieldAppId, app === 'habits' ? null : app);
    }
    assert.equal(fieldAppUrl('launcher'), 'https://gambit-d9b.pages.dev/field/');
    assert.equal(fieldAppUrl('unknown'), null);
  assert.equal(personalFieldDestination('habits'), 'HABITS');
  assert.equal(personalFieldDestination('todo'), 'QUESTS');
});

test('Quest reads the existing DB while Habit renders the original Gambit app', () => {
  for (const section of ['HABITS', 'QUESTS']) {
    const html = ActionRpgController.prototype.renderSection.call({ panelSection: section, panelTab: 'GAMBIT' });
    assert.match(html, section === 'HABITS' ? /field-view\/apps\/habits\/index.html/ : /life-reset\/personal\/index.html/);
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

test('Spider Systems offers one Quest and one Habit entry without the duplicate tracker', () => {
  const html=ActionRpgController.prototype.renderSpiderSystems.call({});
  assert.equal((html.match(/data-open-system-section="QUESTS"/g)||[]).length,1);
  assert.equal((html.match(/data-open-system-section="HABITS"/g)||[]).length,1);
  assert.doesNotMatch(html,/HABIT TRACKER|LIFE RESET 66|field-tools\/apps\/todo\/index.html/);
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
