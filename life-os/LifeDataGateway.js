const DEFAULT_DBS = Object.freeze({
  tasks: '272d787636c681d9ae35d494508b25d0',
  habits: '272d787636c681a29bf8e4d5e588e173',
  workoutPlans: '272d787636c6813cb980c9ec774fdee0',
  exerciseLogs: '272d787636c681a4b176fe8a43775c5f',
  cardioLogs: '272d787636c681bf8d0dd3631b206caa',
  sportLogs: '272d787636c681dc98e2ec70d12d2b2b'
});

const titleText = (property) => property?.title?.map((item) => item.plain_text || item.text?.content || '').join('') || '';
const richText = (property) => property?.rich_text?.map((item) => item.plain_text || item.text?.content || '').join('') || '';
const namedProperty = (properties, names) => names.map((name) => properties?.[name]).find(Boolean);
const propertyText = (properties, names) => {
  const property = namedProperty(properties, names);
  return titleText(property) || richText(property) || property?.select?.name || property?.status?.name || property?.formula?.string || '';
};
const propertyBoolean = (properties, names) => Boolean(namedProperty(properties, names)?.checkbox);
const propertyDate = (properties, names) => namedProperty(properties, names)?.date?.start || null;
const propertyNumber = (properties, names) => Number(namedProperty(properties, names)?.number || 0);

export class LifeDataGateway {
  constructor(options = {}) {
    this.origin = (options.origin || location.origin).replace(/\/$/, '');
    this.databases = { ...DEFAULT_DBS, ...(options.databases || {}) };
    this.journalDatabase = options.journalDatabase || '';
  }

  async notionRequest(method, path, body) {
    const response = await fetch(`${this.origin}/api/notion?path=${encodeURIComponent(path)}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : { Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.ok === false) throw new Error(payload?.error || `Notion HTTP ${response.status}`);
    return payload?.data ?? payload;
  }

  query(databaseId, body = { page_size: 100 }) {
    return this.notionRequest('POST', `/v1/databases/${databaseId}/query`, body).then((payload) => payload.results || []);
  }

  async loadSnapshot() {
    const response = await fetch('../data/notion-snapshot.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Snapshot HTTP ${response.status}`);
    return response.json();
  }

  mapTask(page) {
    const p = page.properties || {};
    return {
      id: page.id,
      title: propertyText(p, ['Name', 'Task', 'Title']) || 'Nhiệm vụ Notion',
      area: propertyText(p, ['Project', 'Area', 'Type']) || 'Công việc',
      priority: propertyText(p, ['Priority', 'Mức ưu tiên']) || 'Bình thường',
      done: propertyBoolean(p, ['Done', 'Completed', 'Hoàn thành']),
      date: propertyDate(p, ['Date', 'Due', 'When']),
      sourceUrl: page.url || ''
    };
  }

  mapHabit(page) {
    const p = page.properties || {};
    const category = propertyText(p, ['Category', 'Group', 'Type']) || 'Good';
    const name = propertyText(p, ['Name', 'Habit', 'Title']) || 'Habit';
    return {
      id: page.id,
      icon: propertyText(p, ['Icon', 'Emoji']) || (category.toLowerCase().includes('resist') ? '⊘' : '◆'),
      title: name,
      group: /resist|limit|bad|không/i.test(category + name) ? 'limit' : 'good',
      done: propertyBoolean(p, ['Today', 'Done', 'Completed']),
      timeBlock: propertyText(p, ['Time Block', 'Time', 'When']),
      sourceUrl: page.url || ''
    };
  }

  mapPlan(page) {
    const p = page.properties || {};
    return {
      id: page.id,
      name: propertyText(p, ['Name', 'Plan', 'Title']) || 'Workout plan',
      focus: propertyText(p, ['Focus', 'Type', 'Category']) || 'Workout Plan',
      detail: propertyText(p, ['Detail', 'Description', 'Notes']),
      sourceUrl: page.url || ''
    };
  }

  mapWorkout(page, kind = 'Strength') {
    const p = page.properties || {};
    return {
      id: page.id,
      name: propertyText(p, ['Name', 'Exercise', 'Activity', 'Title']) || kind,
      kind,
      createdAt: propertyDate(p, ['Date', 'When', 'Created']) || page.created_time,
      duration: propertyNumber(p, ['Duration', 'Minutes', 'Time']),
      volume: propertyNumber(p, ['Volume', 'Weight', 'Total Volume']),
      sourceUrl: page.url || ''
    };
  }

  mapJournal(page) {
    const p = page.properties || {};
    return {
      id: page.id,
      title: propertyText(p, ['Name', 'Title']) || 'Journal entry',
      content: propertyText(p, ['Content', 'Body', 'Reflection']),
      mood: propertyText(p, ['Mood']) || '•',
      createdAt: propertyDate(p, ['Date']) || page.created_time,
      sourceUrl: page.url || ''
    };
  }

  async loadAll() {
    const queries = {
      tasks: this.query(this.databases.tasks),
      habits: this.query(this.databases.habits),
      plans: this.query(this.databases.workoutPlans),
      strength: this.query(this.databases.exerciseLogs),
      cardio: this.query(this.databases.cardioLogs),
      sport: this.query(this.databases.sportLogs)
    };
    if (this.journalDatabase) queries.journal = this.query(this.journalDatabase);

    const entries = Object.entries(queries);
    const settled = await Promise.allSettled(entries.map(([, promise]) => promise));
    const live = Object.fromEntries(entries.map(([key], index) => [key, settled[index].status === 'fulfilled' ? settled[index].value : []]));
    const liveCount = Object.values(live).reduce((sum, rows) => sum + rows.length, 0);

    let snapshot = null;
    try { snapshot = await this.loadSnapshot(); } catch { /* status below explains the missing source */ }
    const collections = snapshot?.collections || {};
    const tasks = live.tasks?.length ? live.tasks.map((page) => this.mapTask(page)) : (collections.masterCalendar || []).map((item) => ({ ...item, area: item.type || 'Công việc' }));
    const habits = live.habits?.length ? live.habits.map((page) => this.mapHabit(page)) : (collections.habits || []).map((item) => ({ id: item.id, title: item.name, icon: item.category === 'Resistance' ? '⊘' : '◆', group: item.category === 'Resistance' ? 'limit' : 'good', done: item.today, timeBlock: item.timeBlock, sourceUrl: item.sourceUrl }));
    const workouts = [
      ...(live.strength || []).map((page) => this.mapWorkout(page, 'Strength')),
      ...(live.cardio || []).map((page) => this.mapWorkout(page, 'Cardio')),
      ...(live.sport || []).map((page) => this.mapWorkout(page, 'Sport'))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      tasks,
      habits,
      timetable: tasks.filter((task) => task.date).sort((a, b) => new Date(a.date) - new Date(b.date)),
      journal: (live.journal || []).map((page) => this.mapJournal(page)),
      plans: (live.plans || []).map((page) => this.mapPlan(page)),
      workouts,
      source: liveCount ? 'live' : snapshot ? 'snapshot' : 'offline',
      syncedAt: snapshot?.metadata?.syncedAt || null,
      journalConfigured: Boolean(this.journalDatabase)
    };
  }

  createTask({ title, area }) {
    return this.notionRequest('POST', '/v1/pages', {
      parent: { database_id: this.databases.tasks },
      properties: {
        Name: { title: [{ text: { content: title } }] },
        Done: { checkbox: false },
        Project: { select: { name: area } }
      }
    }).then((page) => this.mapTask(page));
  }

  setTaskDone(id, done) {
    return this.notionRequest('PATCH', `/v1/pages/${id}`, { properties: { Done: { checkbox: done } } });
  }

  setHabitDone(id, done) {
    return this.notionRequest('PATCH', `/v1/pages/${id}`, { properties: { Today: { checkbox: done } } });
  }
}

export const NOTION_DATABASES = DEFAULT_DBS;
