import { parseHabitStreak } from './NotionHabitHistory.mjs';

export const NOTION_GAME_DATABASES = {
  masterCalendar: '272d787636c681d9ae35d494508b25d0',
  habits: '272d787636c681a29bf8e4d5e588e173',
  goals: '272d787636c681729e4df3566c0d933d',
  heroProfile: '312778043056440d9f8924eae4de7a67',
  arenaMaps: '2d74dc2af9b74b19b55d0d61172abc4b',
  suits: '81960105f430405990f3d3c88916d1a8',
  gadgets: 'e70aff2a0a0b4492bc4631e2753045f3',
  combatSkills: '48d57df26e7540d4bf7c74ab40957ec2',
  badges: 'a9cdb33816314ddfac39c23ba5a095df',
  spiderVerse: '58e3e157b3c14328bb3b8fa706138cd8',
  activeQuests: 'aaad787636c682b1a61b0119fca3398b',
  workoutPlans: '272d787636c6813cb980c9ec774fdee0',
  exerciseLogs: '272d787636c681a4b176fe8a43775c5f',
  cardioLogs: '272d787636c681bf8d0dd3631b206caa',
  sportLogs: '272d787636c681dc98e2ec70d12d2b2b',
  enemies: '12b9c24c0fa64eff8d1b199c7ee1b3c9',
  timeTracking: '272d787636c681cdb617d94cc1e5d501',
  journal: '272d787636c68155906fc936df1b6b9f'
};

export function notionValue(property) {
  if (!property) return null;
  if (property.type === 'formula') return property.formula?.number ?? property.formula?.string ?? null;
  if (property.type === 'title' || property.type === 'rich_text') return text(property);
  if (property.type === 'number') return property.number;
  if (property.type === 'date') return property.date?.start || null;
  if (property.type === 'checkbox') return property.checkbox;
  if (property.type === 'relation') return property.relation?.map((item) => item.id) || [];
  if (property.type === 'files') return property.files?.[0]?.file?.url || property.files?.[0]?.external?.url || null;
  if (property.type === 'select' || property.type === 'status' || property.type === 'multi_select') return named(property);
  return null;
}

export function normalizeNotionCatalogPage(page) {
  const values = Object.fromEntries(Object.entries(page.properties || {}).map(([key, property]) => [key, notionValue(property)]));
  return {
    ...values,
    id: page.id,
    createdAt: page.created_time || null,
    iconUrl: page.icon?.external?.url || page.icon?.file?.url || null,
    coverUrl: page.cover?.external?.url || page.cover?.file?.url || null,
    sourceUrl: page.url || ''
  };
}

const text = (property) => (property?.title || property?.rich_text || [])
  .map((part) => part.plain_text || part.text?.content || '').join('');
const named = (property) => property?.select?.name || property?.status?.name ||
  property?.multi_select?.map((item) => item.name).join(', ') || '';

export function normalizeNotionPage(page, kind) {
  const properties = page.properties || {};
  const titleProperty = properties.Name || properties.Title || properties.Task || properties.Habit ||
    Object.values(properties).find((property) => property?.type === 'title');
  const title = text(titleProperty) || 'Chưa có tên';
  const status = named(properties.Status);
  const base = { id: page.id, title, name: title, sourceUrl: page.url || '', editedAt: page.last_edited_time || null };
  if (kind === 'activeQuests') return {
    ...base,
    done: Boolean(properties.Completed?.checkbox),
    xp: properties.EXP?.number || 0,
    frequency: named(properties.Frequency),
    dueDate: properties['Due Date']?.date?.start || null,
    description: text(properties.Remaining)
  };
  if (kind === 'goals') return {
    ...base,
    status: status || 'Chưa rõ',
    date: properties.Date?.date?.start || properties.Deadline?.date?.start || null,
    achieved: Boolean(properties['Achieved/Competive']?.checkbox || properties.Done?.checkbox || /^(done|completed|complete|achieved)$/i.test(status)),
    description: text(properties.Description),
    priority: named(properties.Priority)
  };
  if (kind === 'habits') return {
    ...base,
    status,
    category: named(properties.Type) || named(properties.Category) || 'Habit',
    priority: named(properties.Priority),
    timeBlock: named(properties.Timeblock) || named(properties.TimeBlock) || named(properties.Time) || 'Cả ngày',
    description: text(properties.Description),
    outcome: text(properties['What do I expect at the end?']),
    today: Boolean(properties.Today?.checkbox),
    done: Boolean(properties.Today?.checkbox),
    streak: parseHabitStreak(notionValue(properties.Streak)).current,
    bestStreak: parseHabitStreak(notionValue(properties.Streak)).best,
    color: named(properties.Color),
    gameEnabled: Boolean(properties['Game Enabled']?.checkbox),
    xp: properties['XP / Check']?.number ?? 1
  };
  return {
    ...base,
    status,
    date: properties.Date?.date?.start || properties.Start?.date?.start || null,
    done: Boolean(properties.Done?.checkbox || /^(done|completed|complete)$/i.test(status)),
    priority: named(properties.Priority) || 'Bình thường',
    type: named(properties.Type) || 'Work',
    gameEnabled: Boolean(properties['Game Enabled']?.checkbox),
    gameXp: properties['Game XP']?.number ?? null,
    coverUrl: page.cover?.external?.url || page.cover?.file?.url || null
  };
}

