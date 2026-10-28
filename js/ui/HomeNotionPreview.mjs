import { vietnamDay } from '../core/GameDay.mjs';

export function homeNotionPreview(store, day = vietnamDay()) {
  const quests = store.data.activeQuests || [];
  const habits = store.data.habits || [];
  const quest = quests.find(item => !item.done) || quests[0];
  const habit = habits.find(item => !store.checked(item, day)) || habits[0];
  const questDone = quests.filter(item => item.done).length;
  const habitDone = habits.filter(item => store.checked(item, day)).length;
  const source = store.connected && !store.loading && store.writable.has('activeQuests') && store.writable.has('habits')
    ? 'live' : quests.length || habits.length ? 'cache' : 'empty';
  return {
    source,
    questTitle: quest?.title || quest?.name || (store.loading ? 'Đang đọc Quest…' : 'Chưa có Quest trong Notion'),
    questProgress: quests.length ? `${questDone}/${quests.length} Quest đã xong` : 'Mở Quest từ Notion',
    habitTitle: habit?.title || habit?.name || (store.loading ? 'Đang đọc Habit…' : 'Chưa có Habit trong Notion'),
    habitProgress: habits.length ? `${habitDone}/${habits.length} Habit hôm nay` : 'Mở Habit từ Notion',
  };
}
