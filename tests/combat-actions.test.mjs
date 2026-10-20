import test from 'node:test';
import assert from 'node:assert/strict';
import { createPhaseOneContent } from '../js/game/data/phaseOneContent.js';
import { CombatEngine } from '../js/game/CombatEngine.js';
import { DamageEngine } from '../js/game/DamageEngine.js';

const content = createPhaseOneContent();
const combat = new CombatEngine(content, new DamageEngine());

function state(ids = ['street-thug']) {
  const opponents = ids.map((id) => ({ id, hp: content.enemies.get(id).hp, stagger: 0 }));
  return {
    player: { activeHeroId: 'peter-classic' },
    quest: { activeQuestId: 'main-001' },
    settings: { difficulty: 'NORMAL' },
    progression: { hp: 100, webEnergy: 100, ultimate: 0 },
    battle: { opponents, selectedEnemyIndex: 0, enemyHp: opponents[0].hp, enemyStagger: 0, cooldowns: { web: 0, gadget: 0, ally: 0 }, charges: { gadget: 3 }, turn: 0, phase: 1, storyComplete: false }
  };
}

test('combo remains usable with no web energy and restores energy', () => {
  const game = state();
  game.progression.webEnergy = 0;
  assert.equal(combat.perform('basic-combo', game).blocked, undefined);
  assert.equal(game.progression.webEnergy, 7);
});

test('web shot binds a lone enemy for its next attack', () => {
  const game = state(['tech-gunner']);
  combat.perform('web-shot', game);
  assert.equal(game.progression.webEnergy, 82);
  const hpBefore = game.progression.hp;
  const result = combat.perform('basic-combo', game);
  assert.equal(result.enemyBlocked, true);
  assert.equal(game.progression.hp, hpBefore);
});

test('gadget and ultimate damage adjacent enemies without consuming extra turns', () => {
  const game = state(['street-thug', 'tech-gunner', 'shield-enemy']);
  const first = combat.perform('impact-web', game);
  assert.equal(first.splashHits.length, 2);
  assert.ok(game.battle.opponents[1].hp < content.enemies.get('tech-gunner').hp);
  assert.equal(game.battle.turn, 1);
  game.progression.ultimate = 100;
  const second = combat.perform('spider-barrage', game);
  assert.equal(second.splashHits.length, 2);
  assert.equal(game.progression.ultimate, 0);
  assert.equal(game.battle.turn, 2);
});

test('higher difficulty scales enemy health once, without lowering hero damage', () => {
  const normal = state(['tech-gunner']);
  const heroic = state(['tech-gunner']);
  heroic.settings.difficulty = 'HEROIC';
  heroic.battle.opponents[0].hp = combat.scaledMaxHp(content.enemies.get('tech-gunner'), 'HEROIC');
  heroic.battle.enemyHp = heroic.battle.opponents[0].hp;
  assert.equal(combat.perform('basic-combo', normal).damage, combat.perform('basic-combo', heroic).damage);
});
