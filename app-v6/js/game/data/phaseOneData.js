export const PHASE_ONE_DATA = {
  district: {
    id: 'manhattan-rooftop',
    name: 'MANHATTAN ROOFTOP',
    weather: 'NIGHT // LIGHT RAIN',
    threat: 2,
    story: 'CHAPTER 01 // GOBLIN SIGNAL'
  },
  hero: {
    id: 'peter-classic',
    name: 'PETER PARKER',
    variant: 'CLASSIC',
    rank: 'FRIENDLY NEIGHBORHOOD',
    maxHp: 120,
    maxWebEnergy: 100
  },
  ally: {
    id: 'miles-venom',
    name: 'MILES MORALES',
    skill: 'VENOM BLAST',
    bonus: '+5% AGILITY'
  },
  encounter: [
    { id: 'street-thug', name: 'STREET THUG', tier: 'TIER 1', maxHp: 85, attack: 5, weakness: 'WEB', resistance: 'NONE', reward: { xp: 24, coins: 12, item: 'WEB FLUID' } },
    { id: 'tech-gunner', name: 'TECH GUNNER', tier: 'TIER 1', maxHp: 110, attack: 7, weakness: 'GADGET', resistance: 'MELEE', reward: { xp: 30, coins: 16, item: 'TECH SCRAP' } },
    { id: 'shield-enemy', name: 'SHIELD ENEMY', tier: 'TIER 1', maxHp: 135, attack: 8, weakness: 'ALLY', resistance: 'WEB', reward: { xp: 36, coins: 20, item: 'ARMOR PLATE' } },
    { id: 'hunter-captain', name: 'HUNTER CAPTAIN', tier: 'ELITE', maxHp: 230, attack: 11, weakness: 'DODGE', resistance: 'GADGET', reward: { xp: 70, coins: 45, item: 'HUNTER TOKEN' } },
    { id: 'green-goblin', name: 'GREEN GOBLIN', tier: 'BOSS // TIER 2', maxHp: 520, attack: 15, weakness: 'WEB', resistance: 'GADGET', phases: 3, reward: { xp: 220, coins: 150, item: 'GOBLIN TECH CORE' } }
  ],
  actions: {
    attack: { label: 'COMBO', damage: 24, energy: 0, cooldown: 0, stagger: 8, animation: 'attack_01' },
    web: { label: 'WEB SHOT', damage: 38, energy: 18, cooldown: 1, stagger: 14, animation: 'ranged_attack' },
    gadget: { label: 'IMPACT WEB', damage: 52, energy: 0, cooldown: 3, stagger: 20, animation: 'skill_01', charges: 3 },
    ally: { label: 'CALL MILES', damage: 68, energy: 0, cooldown: 4, stagger: 25, animation: 'ally_call' },
    ultimate: { label: 'SPIDER BARRAGE', damage: 145, energy: 0, cooldown: 0, stagger: 45, animation: 'ultimate', ultimateCost: 100 }
  },
  quests: [
    { id: 'main-01', type: 'MAIN', title: 'THE GOBLIN SIGNAL', copy: 'Dọn sạch rooftop và lần theo tín hiệu Goblin.', reward: 'DISTRICT KEY + SUIT TOKEN' },
    { id: 'side-01', type: 'SIDE', title: 'ROOFTOP RESCUE', copy: 'Hoàn thành một nhiệm vụ đời thật loại PERSON hoặc MEETING.', reward: 'ALLY AFFINITY +20' },
    { id: 'daily-01', type: 'DAILY', title: 'FRIENDLY NEIGHBORHOOD', copy: 'Hoàn thành 3 nhiệm vụ trong ngày.', reward: '60 XP + 35 WEB COINS' }
  ],
  gadgets: [
    { id: 'impact-web', name: 'IMPACT WEB', level: 1, effect: 'Heavy stagger', charges: 3 },
    { id: 'spider-drone', name: 'SPIDER DRONE', level: 1, effect: 'Auto hit', charges: 2 },
    { id: 'emp', name: 'WEB EMP', level: 1, effect: 'Tech weakness', charges: 2 }
  ],
  skills: [
    { id: 'basic-combo', name: 'BASIC COMBO', unlocked: true },
    { id: 'web-shot', name: 'WEB SHOT', unlocked: true },
    { id: 'perfect-dodge', name: 'PERFECT DODGE', unlocked: true },
    { id: 'air-launcher', name: 'AIR LAUNCHER', unlocked: false },
    { id: 'web-slam', name: 'WEB SLAM', unlocked: false },
    { id: 'finisher', name: 'FINISHER', unlocked: true }
  ]
};
