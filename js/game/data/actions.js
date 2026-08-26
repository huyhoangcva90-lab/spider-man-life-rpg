export const ACTIONS = Object.freeze([
  { id: 'basic-combo', slot: 'attack', label: 'COMBO', type: 'ATTACK', damage: 24, energyCost: 0, cooldownTurns: 0, stagger: 8, animation: 'attack_01', tags: ['MELEE'], comicText: ['POW!', 'BAM!', 'WHACK!'], sfx: 'PUNCH_LIGHT' },
  { id: 'web-shot', slot: 'web', label: 'WEB SHOT', type: 'SKILL', damage: 38, energyCost: 18, cooldownTurns: 1, stagger: 14, animation: 'ranged_attack', tags: ['WEB', 'RANGED'], comicText: ['THWIP!', 'FWIP!'], sfx: 'WEB_SHOOT' },
  { id: 'impact-web', slot: 'gadget', label: 'IMPACT WEB', type: 'GADGET', damage: 52, energyCost: 0, cooldownTurns: 3, stagger: 20, animation: 'skill_01', tags: ['WEB', 'GADGET'], comicText: ['THWIP!', 'KRAK!'], sfx: 'GADGET_DEPLOY', charges: 3 },
  { id: 'venom-assist', slot: 'ally', label: 'CALL MILES', type: 'ALLY', damage: 68, energyCost: 0, cooldownTurns: 4, stagger: 25, animation: 'ally_call', tags: ['ALLY', 'ELECTRIC'], comicText: ['ZZZAP!', 'KZZT!'], sfx: 'ALLY_CALL' },
  { id: 'spider-barrage', slot: 'ultimate', label: 'SPIDER BARRAGE', type: 'ULTIMATE', damage: 145, energyCost: 0, cooldownTurns: 0, stagger: 45, animation: 'ultimate', tags: ['MELEE', 'WEB', 'ULTIMATE'], comicText: ['KABOOM!', 'MAXIMUM SPIDER!'], sfx: 'ULTIMATE', ultimateCost: 100 }
]);

export const DIFFICULTIES = Object.freeze({
  FRIENDLY: { enemyHp: 0.75, enemyDamage: 0.7, reward: 0.8 },
  NORMAL: { enemyHp: 1, enemyDamage: 1, reward: 1 },
  HEROIC: { enemyHp: 1.25, enemyDamage: 1.2, reward: 1.25 },
  SPECTACULAR: { enemyHp: 1.55, enemyDamage: 1.45, reward: 1.5 },
  ULTIMATE: { enemyHp: 2, enemyDamage: 1.8, reward: 2 }
});

