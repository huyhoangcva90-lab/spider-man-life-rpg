export const HEROES = Object.freeze([
  { id: 'peter-classic', heroId: 'peter-parker', name: 'PETER PARKER', variant: 'CLASSIC', role: 'BALANCED', rarity: 'EPIC', rank: 'FRIENDLY NEIGHBORHOOD', maxHp: 120, maxWebEnergy: 100, baseStats: { power: 50, agility: 70, tech: 45, spiderSense: 65 }, skillIds: ['basic-combo', 'web-shot', 'impact-web'], ultimateId: 'spider-barrage', animationSet: 'peter-classic-v1' }
]);

export const ALLIES = Object.freeze([
  { id: 'miles-morales', name: 'MILES MORALES', assistSkillId: 'venom-assist', skill: 'VENOM BLAST', bonus: '+5% AGILITY', cooldownTurns: 4 }
]);

export const GADGETS = Object.freeze([
  { id: 'impact-web', name: 'IMPACT WEB', category: 'WEB', level: 1, effect: 'Heavy stagger', charges: 3, actionId: 'impact-web' },
  { id: 'spider-drone', name: 'SPIDER DRONE', category: 'TECH', level: 1, effect: 'Auto hit', charges: 2, locked: true },
  { id: 'web-emp', name: 'WEB EMP', category: 'TECH', level: 1, effect: 'Tech weakness', charges: 2, locked: true }
]);

export const SKILLS = Object.freeze([
  { id: 'basic-combo', name: 'BASIC COMBO', tree: 'COMBAT', unlocked: true },
  { id: 'web-shot', name: 'WEB SHOT', tree: 'WEB', unlocked: true },
  { id: 'perfect-dodge', name: 'PERFECT DODGE', tree: 'SPIDER_SENSE', unlocked: true },
  { id: 'air-launcher', name: 'AIR LAUNCHER', tree: 'COMBAT', unlocked: false },
  { id: 'web-slam', name: 'WEB SLAM', tree: 'WEB', unlocked: false },
  { id: 'finisher', name: 'FINISHER', tree: 'COMBAT', unlocked: true }
]);

