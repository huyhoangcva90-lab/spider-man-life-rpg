import { PhaseOneGameEngine } from '../js/game/PhaseOneGameEngine.js';
import { DamageEngine } from '../js/game/DamageEngine.js';

class MemoryStorage {
  constructor(seed = {}) { this.values = new Map(Object.entries(seed)); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

class TestBus {
  constructor() { this.events = []; }
  emit(name, payload) { this.events.push({ name, payload }); }
}

const tests = [];
const test = (name, fn) => tests.push({ name, fn });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const engine = (storage = new MemoryStorage()) => new PhaseOneGameEngine(new TestBus(), { storage });

test('Quest completion awards reward once', () => {
  const game = engine();
  const entry = { id: 'external-1', title: 'Ship feature', type: 'WORK', status: 'DONE', source: 'LOCAL' };
  const first = game.completeRealQuest(entry);
  const coins = game.state.progression.coins;
  const second = game.completeRealQuest(entry);
  assert(first?.questReward?.coins > 0, 'first completion did not reward coins');
  assert(second === null && game.state.progression.coins === coins, 'duplicate completion rewarded twice');
});

test('Enemy HP never drops below zero', () => {
  const game = engine();
  game.state.battle.enemyHp = 1;
  game.state.progression.ultimate = 100;
  game.performAction('ultimate');
  assert(game.state.battle.enemyHp >= 0, 'enemy HP became negative');
});

test('Boss phase changes at correct HP thresholds', () => {
  const game = engine();
  const boss = game.content.enemies.get('green-goblin');
  const max = game.combatEngine.scaledMaxHp(boss, 'NORMAL');
  assert(game.combatEngine.phaseFor(boss, max, 'NORMAL') === 1, 'full HP should be phase 1');
  assert(game.combatEngine.phaseFor(boss, max * 0.65, 'NORMAL') === 2, '65% HP should be phase 2');
  assert(game.combatEngine.phaseFor(boss, max * 0.30, 'NORMAL') === 3, '30% HP should be phase 3');
});

test('Finisher only triggers when stagger condition is met', () => {
  const game = engine();
  game.state.battle.encounterIndex = 3;
  game.state.battle.enemyHp = 230;
  game.state.progression.ultimate = 100;
  game.state.battle.enemyStagger = 99;
  const early = game.performAction('ultimate');
  const ready = engine();
  ready.state.battle.encounterIndex = 3;
  ready.state.battle.enemyHp = 230;
  ready.state.progression.ultimate = 100;
  ready.state.battle.enemyStagger = 100;
  const finish = ready.performAction('ultimate');
  assert(!early.finisher && finish.finisher, 'finisher eligibility was not enforced');
});

test('Cooldown cannot go negative', () => {
  const game = engine();
  game.state.battle.cooldowns.web = 0;
  game.combatEngine.tick(game.state);
  assert(game.state.battle.cooldowns.web === 0, 'cooldown became negative');
});

test('Unique item reward cannot duplicate', () => {
  const game = engine();
  game.rewardEngine.apply('green-goblin-clear', game.state, 1);
  game.rewardEngine.apply('green-goblin-clear', game.state, 1);
  assert(game.state.inventory['goblin-tech-core'].count === 1, 'unique loot duplicated');
});

test('Save and load preserve battle progress', () => {
  const storage = new MemoryStorage();
  const first = engine(storage);
  first.performAction('attack');
  const hp = first.state.battle.enemyHp;
  const loaded = engine(storage);
  assert(loaded.state.battle.enemyHp === hp, 'battle HP was not restored');
});

test('Legacy save migrates without deleting progress', () => {
  const legacy = { hero: { level: 4, coins: 77 }, encounterIndex: 2, enemyHp: 80, completedEntryIds: ['old-entry'], inventory: { 'TECH SCRAP': 2 } };
  const storage = new MemoryStorage({ 'spidey-action-rpg-phase-one-v1': JSON.stringify(legacy) });
  const game = engine(storage);
  assert(game.state.saveVersion === 2 && game.state.progression.level === 4, 'version/player migration failed');
  assert(game.state.quest.completedExternalIds.includes('old-entry'), 'completed quest ids were lost');
  assert(game.state.inventory['tech-scrap'].count === 2, 'inventory migration failed');
});

test('Difficulty multiplier affects damage and enemy HP', () => {
  const game = engine();
  const action = game.content.actions.get('basic-combo');
  const enemy = game.content.enemies.get('street-thug');
  const damage = new DamageEngine();
  const normal = damage.resolve({ action, enemy, difficulty: game.content.difficulties.NORMAL });
  const heroic = damage.resolve({ action, enemy, difficulty: game.content.difficulties.HEROIC });
  assert(heroic.damage < normal.damage, 'heroic difficulty did not reduce effective damage');
  assert(game.combatEngine.scaledMaxHp(enemy, 'HEROIC') > enemy.hp, 'heroic enemy HP was not scaled');
});

test('Ally cooldown blocks immediate reuse', () => {
  const game = engine();
  const first = game.performAction('ally');
  const second = game.performAction('ally');
  assert(!first.blocked && second.blocked && game.state.battle.cooldowns.ally >= 0, 'ally cooldown did not block reuse');
});

test('Ultimate charge is capped at 100%', () => {
  const game = engine();
  game.state.progression.ultimate = 99;
  game.performAction('attack');
  assert(game.state.progression.ultimate === 100, 'ultimate exceeded or missed cap');
});

const results = document.getElementById('results');
let passed = 0;
for (const item of tests) {
  const row = document.createElement('li');
  try { await item.fn(); row.className = 'pass'; row.textContent = `PASS // ${item.name}`; passed += 1; }
  catch (error) { row.className = 'fail'; row.textContent = `FAIL // ${item.name} // ${error.message}`; }
  results.appendChild(row);
}
const summary = document.getElementById('summary');
summary.textContent = `${passed} / ${tests.length} PASSED`;
summary.className = passed === tests.length ? 'pass' : 'fail';
document.body.dataset.testStatus = passed === tests.length ? 'passed' : 'failed';

