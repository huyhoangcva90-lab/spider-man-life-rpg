import test from 'node:test';
import assert from 'node:assert/strict';
import { publicGameRecord, selectedGameView, skillIds, logFingerprint } from '../js/integrations/notion/NotionGameAuthority.mjs';
import { notionSkillAnimation } from '../js/game/NotionSkillAnimation.js';
import { PhaseOneGameEngine } from '../js/game/PhaseOneGameEngine.js';
import { readNotionGameState } from '../server/notion-game-reader.mjs';
import gameStateHandler from '../api/game-state.mjs';

test('public game projection preserves formula values and zeros while excluding private and unapproved fields', () => {
  const record = publicGameRecord({ id: 'a', properties: { HP: { type: 'number', number: 0 }, Energy: { type: 'number', number: 0 }, Level: { type: 'formula', formula: { number: 1 } }, Gold: { type: 'number', number: 500 }, Diary: { type: 'rich_text', rich_text: [{ plain_text: 'private' }] }, 'Spider Suits': { type: 'relation', relation: [{ id: 'not-equipped' }] } } }, 'profile');
  assert.equal(record.HP, 0);
  assert.equal(record.Energy, 0);
  assert.equal(record.Level, 1);
  assert.equal('Gold' in record, false);
  assert.equal('Diary' in record, false);
  assert.equal('Spider Suits' in record, false);
});

test('one Notion skill relation can contain all selected moves without inventing slots or an equipped suit', () => {
  const data = { profile: { 'Skill Slot 1': ['abc-def', 'two'], 'Equipped Suit': [] }, skills: [{ id: 'abcdef', Skill: 'Web Trap' }, { id: 'two', Skill: 'Air Combat' }, { id: 'other', Skill: 'Not Selected' }], suits: [{ id: 'default', Suit: 'Not Equipped' }] };
  assert.deepEqual(skillIds(data.profile), ['abc-def', 'two']);
  assert.deepEqual(selectedGameView(data).skills.map((skill) => skill.Skill), ['Web Trap', 'Air Combat']);
  assert.equal(selectedGameView(data).suit, null);
});

test('passives never become attacks and unknown moves never receive an unrelated animation', () => {
  assert.equal(notionSkillAnimation({ Skill: 'Air Combat', 'Skill Type': 'Passive' }), null);
  assert.equal(notionSkillAnimation({ Skill: 'Unknown power', 'Skill Type': 'Active' }), null);
  assert.equal(notionSkillAnimation({ Skill: 'Web Trap', 'Skill Type': 'Active' }).effect, 'trap');
  assert.equal(notionSkillAnimation({ Skill: 'Kick', 'Skill Type': 'Basic' }).clip, 'attack_03');
});

test('resolving an existing Notion combat log is distinguishable from a repeated poll', () => {
  const pending = { id: 'one', 'Resolution Status': 'Pending' };
  const done = { ...pending, 'Resolution Status': 'Resolved', 'Direct Damage': 20 };
  assert.notEqual(logFingerprint(pending), logFingerprint(done));
  assert.equal(logFingerprint(done), logFingerprint({ ...done }));
});

test('the public app cannot fabricate actions, rewards, healing or the next mission', () => {
  const storage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  const bus = { emit() {} };
  const engine = new PhaseOneGameEngine(bus, { storage });
  engine.notionAuthority = true;
  const before = JSON.stringify(engine.state);
  assert.equal(engine.performActionById('basic-combo').blocked, true);
  assert.equal(engine.completeRealQuest({ id: 'quest', done: true }).blocked, true);
  assert.equal(engine.recordHabitCheckin('habit').blocked, true);
  assert.equal(engine.startNextPatrol().blocked, true);
  assert.equal(JSON.stringify(engine.state), before);
});

test('game state reader fetches only selected records and combat results without writing Notion', async () => {
  const calls = [];
  const data = await readNotionGameState('test-token', { fetcher: async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/query')) return { ok: true, json: async () => ({ results: [] }) };
    return { ok: true, json: async () => ({ id: 'hero', properties: { HP: { type: 'number', number: 0 }, 'Skill Slot 1': { type: 'relation', relation: [] }, 'Equipped Suit': { type: 'relation', relation: [] }, 'Spider Suits': { type: 'relation', relation: [{ id: 'unselected' }] }, Diary: { type: 'rich_text', rich_text: [{ plain_text: 'private diary' }] } } }) };
  } });
  assert.equal(data.profile.HP, 0);
  assert.equal(JSON.stringify(data).includes('private diary'), false);
  assert.equal(JSON.stringify(data).includes('unselected'), false);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(({ url, options }) => options.method === 'GET' || options.method === 'POST' && url.endsWith('/query')));
});

test('the public display endpoint rejects mutation requests', async () => {
  let code, body;
  await gameStateHandler({ method: 'POST', query: { path: '/v1/search' } }, { status(value) { code = value; return this; }, json(value) { body = value; } });
  assert.equal(code, 405);
  assert.equal(body.ok, false);
});
