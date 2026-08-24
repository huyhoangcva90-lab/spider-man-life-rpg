export const DISTRICTS = Object.freeze([
  { id: 'manhattan', name: 'MANHATTAN', zoneIds: ['rooftop-night-rain'], enemyPool: ['street-thug', 'tech-gunner', 'shield-enemy', 'hunter-captain'], bossId: 'green-goblin', unlocked: true }
]);

export const ZONES = Object.freeze([
  { id: 'rooftop-night-rain', districtId: 'manhattan', name: 'MANHATTAN ROOFTOP', environment: 'ROOFTOP', time: 'NIGHT', weather: 'LIGHT RAIN', ambient: 'rooftop-rain', theme: 'DEFAULT' }
]);

export const QUESTS = Object.freeze([
  { id: 'main-001', type: 'MAIN', chapterId: 'chapter-001', title: 'THE GOBLIN SIGNAL', description: 'Dọn sạch rooftop và lần theo tín hiệu Goblin.', districtId: 'manhattan', zoneId: 'rooftop-night-rain', difficulty: 'NORMAL', enemyIds: ['street-thug', 'tech-gunner', 'shield-enemy', 'hunter-captain', 'green-goblin'], rewardId: 'main-001-clear', prerequisites: [], unlocks: [] },
  { id: 'side-001', type: 'SIDE', chapterId: 'chapter-001', title: 'ROOFTOP RESCUE', description: 'Hoàn thành một nhiệm vụ đời thật loại PERSON hoặc MEETING.', districtId: 'manhattan', zoneId: 'rooftop-night-rain', difficulty: 'NORMAL', enemyIds: ['street-thug'], rewardId: 'side-001-clear', prerequisites: [], unlocks: [] },
  { id: 'daily-001', type: 'DAILY', title: 'FRIENDLY NEIGHBORHOOD', description: 'Hoàn thành 3 nhiệm vụ trong ngày.', districtId: 'manhattan', zoneId: 'rooftop-night-rain', difficulty: 'NORMAL', enemyIds: ['street-thug'], rewardId: 'daily-three-clear', target: 3 },
  { id: 'daily-002', type: 'DAILY', title: 'WEB PRACTICE', description: 'Dùng Web Shot 5 lần.', districtId: 'manhattan', zoneId: 'rooftop-night-rain', difficulty: 'NORMAL', enemyIds: ['tech-gunner'], rewardId: 'daily-three-clear', target: 5, metric: 'WEB_USED' },
  { id: 'daily-003', type: 'DAILY', title: 'ELITE HUNTER', description: 'Hạ một Elite.', districtId: 'manhattan', zoneId: 'rooftop-night-rain', difficulty: 'NORMAL', enemyIds: ['hunter-captain'], rewardId: 'daily-three-clear', target: 1, metric: 'ELITE_DEFEATED' }
]);

