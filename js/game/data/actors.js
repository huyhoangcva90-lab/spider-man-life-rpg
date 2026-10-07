export const HEROES = Object.freeze([
  {
    id: 'peter-classic',
    heroId: 'peter-parker',
    name: 'PETER PARKER',
    variant: 'CLASSIC',
    role: 'BALANCED',
    rarity: 'EPIC',
    rank: 'FRIENDLY NEIGHBORHOOD',
    maxHp: 120,
    maxWebEnergy: 100,
    baseStats: { power: 50, agility: 70, tech: 45, spiderSense: 65 },
    skillIds: ['basic-combo', 'web-shot', 'impact-web'],
    activeSkillIds: ['web-strike', 'aerial-launch', 'swing-kick', 'perfect-dodge', 'spider-sense-parry', 'spider-arm-strike', 'symbiote-punch', 'anti-venom-burst'],
    ultimateSkillIds: ['maximum-spider', 'spider-barrage', 'iron-spider-overdrive', 'anti-venom-tempest'],
    ultimateId: 'spider-barrage',
    animationSet: 'peter-classic-v1'
  }
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
  { id: 'web-strike', name: 'WEB STRIKE', slot: 'active', tree: 'COMBAT', tags: ['MELEE', 'MOBILITY'], unlocked: true },
  { id: 'aerial-launch', name: 'AERIAL LAUNCH', slot: 'active', tree: 'COMBAT', tags: ['LAUNCH', 'AIRBORNE'], unlocked: true },
  { id: 'swing-kick', name: 'SWING KICK', slot: 'active', tree: 'COMBAT', tags: ['KNOCKBACK'], unlocked: true },
  { id: 'ground-strike', name: 'GROUND STRIKE', slot: 'active', tree: 'COMBAT', tags: ['SLAM', 'AREA'], unlocked: false },
  { id: 'perfect-dodge', name: 'PERFECT DODGE', slot: 'active', tree: 'SPIDER_SENSE', tags: ['DODGE', 'SLOW'], unlocked: true },
  { id: 'spider-sense-parry', name: 'SPIDER-SENSE PARRY', slot: 'active', tree: 'SPIDER_SENSE', tags: ['PARRY', 'STUN'], unlocked: false },
  { id: 'perch-takedown', name: 'PERCH TAKEDOWN', slot: 'active', tree: 'STEALTH', tags: ['STEALTH', 'TAKEDOWN'], unlocked: false },
  { id: 'spider-arm-strike', name: 'SPIDER-ARM STRIKE', slot: 'active', tree: 'SPIDER_ARMS', tags: ['SPIDER_ARMS', 'IMPACT'], unlocked: false },
  { id: 'symbiote-punch', name: 'SYMBIOTE PUNCH', slot: 'active', tree: 'SYMBIOTE', tags: ['SYMBIOTE', 'IMPACT'], unlocked: false },
  { id: 'anti-venom-burst', name: 'ANTI-VENOM BURST', slot: 'active', tree: 'ANTI_VENOM', tags: ['ANTI_VENOM', 'AREA'], unlocked: false },
  { id: 'maximum-spider', name: 'MAXIMUM SPIDER', slot: 'ultimate', tree: 'COMBAT', tags: ['FINISHER', 'COMBO'], unlocked: false },
  { id: 'spider-barrage', name: 'SPIDER BARRAGE', slot: 'ultimate', tree: 'COMBAT', tags: ['FINISHER', 'FOCUS'], unlocked: true },
  { id: 'iron-spider-overdrive', name: 'IRON SPIDER OVERDRIVE', slot: 'ultimate', tree: 'SPIDER_ARMS', tags: ['SPIDER_ARMS', 'COMBO'], unlocked: false },
  { id: 'anti-venom-tempest', name: 'ANTI-VENOM TEMPEST', slot: 'ultimate', tree: 'ANTI_VENOM', tags: ['ANTI_VENOM', 'AREA'], unlocked: false }
]);

