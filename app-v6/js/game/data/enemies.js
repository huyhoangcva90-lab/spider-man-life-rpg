export const ENEMIES = Object.freeze([
  { id: 'street-thug', name: 'STREET THUG', tier: 'NORMAL', faction: 'STREET_GANG', hp: 85, power: 5, staggerMax: 100, weakness: ['WEB'], resistance: [], rewardId: 'street-thug-clear', animationSet: 'enemy-fallback-v1' },
  { id: 'tech-gunner', name: 'TECH GUNNER', tier: 'RANGED', faction: 'TECH_GANG', hp: 110, power: 7, staggerMax: 100, weakness: ['GADGET'], resistance: ['MELEE'], rewardId: 'tech-gunner-clear', animationSet: 'enemy-fallback-v1' },
  { id: 'shield-enemy', name: 'SHIELD ENEMY', tier: 'HEAVY', faction: 'STREET_GANG', hp: 135, power: 8, staggerMax: 100, weakness: ['ALLY'], resistance: ['WEB'], rewardId: 'shield-enemy-clear', animationSet: 'enemy-fallback-v1' },
  { id: 'hunter-captain', name: 'HUNTER CAPTAIN', tier: 'ELITE', faction: 'HUNTERS', hp: 230, power: 11, staggerMax: 100, weakness: ['DODGE'], resistance: ['GADGET'], rewardId: 'hunter-captain-clear', finisherEligible: true, animationSet: 'enemy-fallback-v1' },
  { id: 'green-goblin', name: 'GREEN GOBLIN', tier: 'BOSS', displayTier: 'BOSS // TIER 2', faction: 'GOBLIN', hp: 520, power: 15, staggerMax: 100, weakness: ['WEB', 'TECH'], resistance: ['EXPLOSION'], rewardId: 'green-goblin-clear', finisherEligible: true, phases: [{ hpBelow: 1, environment: 'rooftop-night-rain' }, { hpBelow: 0.66, environment: 'rooftop-fire' }, { hpBelow: 0.33, environment: 'rooftop-fire', enraged: true }], animationSet: 'green-goblin-v1' }
]);

