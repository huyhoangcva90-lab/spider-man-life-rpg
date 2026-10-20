export const ENEMIES = Object.freeze([
  { id: 'street-thug', name: 'SYMBIOTE GOON', tier: 'NORMAL', faction: 'SYMBIOTES', hp: 85, power: 5, staggerMax: 100, weakness: ['WEB'], resistance: [], rewardId: 'street-thug-clear', animationSet: 'cosmic-symbiote-goon' },
  { id: 'tech-gunner', name: 'AIM RIFLE', tier: 'RANGED', faction: 'AIM', hp: 110, power: 7, staggerMax: 100, weakness: ['GADGET'], resistance: ['MELEE'], rewardId: 'tech-gunner-clear', animationSet: 'cosmic-aim-rifle' },
  { id: 'shield-enemy', name: 'AIM SHOCK', tier: 'HEAVY', faction: 'AIM', hp: 135, power: 8, staggerMax: 100, weakness: ['ALLY'], resistance: ['WEB'], rewardId: 'shield-enemy-clear', animationSet: 'cosmic-aim-shock' },
  { id: 'hunter-captain', name: 'BEETLE', tier: 'ELITE', faction: 'ARMORED', hp: 230, power: 11, staggerMax: 100, weakness: ['DODGE'], resistance: ['GADGET'], rewardId: 'hunter-captain-clear', finisherEligible: true, animationSet: 'cosmic-beetle' },
  { id: 'green-goblin', name: 'VENOM', tier: 'BOSS', displayTier: 'BOSS // TIER 2', faction: 'SYMBIOTES', hp: 520, power: 15, staggerMax: 100, weakness: ['WEB', 'TECH'], resistance: ['EXPLOSION'], rewardId: 'green-goblin-clear', finisherEligible: true, phases: [{ hpBelow: 1, environment: 'rooftop-night-rain' }, { hpBelow: 0.66, environment: 'rooftop-fire' }, { hpBelow: 0.33, environment: 'rooftop-fire', enraged: true }], animationSet: 'cosmic-venom' }
]);

