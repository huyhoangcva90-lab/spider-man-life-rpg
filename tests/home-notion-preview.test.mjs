import test from 'node:test';
import assert from 'node:assert/strict';
import { homeNotionPreview } from '../js/ui/HomeNotionPreview.mjs';

test('home preview shows Active Quests and dated Habits without Master Calendar tasks', () => {
  const store = {
    connected: true, loading: false, writable: new Set(['activeQuests', 'habits']),
    data: {
      tasks: [{ title: 'Master Calendar task' }],
      activeQuests: [{ title: 'Save New York', done: false }, { title: 'Patrol', done: true }],
      habits: [{ title: 'Drink water' }, { title: 'Gym' }],
    },
    checked: (habit, day) => habit.title === 'Drink water' && day === '2026-10-28',
  };
  assert.deepEqual(homeNotionPreview(store, '2026-10-28'), {
    source: 'live', questTitle: 'Save New York', questProgress: '1/2 Quest đã xong',
    habitTitle: 'Gym', habitProgress: '1/2 Habit hôm nay',
  });
  store.connected = false;
  assert.equal(homeNotionPreview(store, '2026-10-28').source, 'cache');
});
