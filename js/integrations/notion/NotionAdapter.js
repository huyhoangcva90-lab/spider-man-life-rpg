/* WEB OPS TRACKER V6 - NOTION INTEGRATION ADAPTER */

export class NotionAdapter {
  constructor(eventBus, entryRepository) {
    this.bus = eventBus;
    this.repo = entryRepository;
    this.rawSnapshot = null;
    this.unlocatedMissions = [];
  }

  async loadSnapshot() {
    if (this.loading) return false;
    this.loading = true;
    try {
      const response = await fetch('/api/personal-state', { cache: 'no-store' });
      if (!response.ok) {
        if ([401, 403].includes(response.status)) { this.rawSnapshot = null; this.unlocatedMissions = []; return false; }
        throw new Error(`Private Notion data HTTP ${response.status}`);
      }
      this.rawSnapshot = await response.json();
      this.parseSnapshot();
      return true;
    } catch (err) {
      console.warn('[NotionAdapter] Could not refresh private data:', err);
      return false;
    } finally { this.loading = false; }
  }

  parseSnapshot() {
    if (!this.rawSnapshot || !this.rawSnapshot.collections) return;

    const calendarItems = this.rawSnapshot.collections.masterCalendar || [];
    const habits = this.rawSnapshot.collections.habits || [];
    const goals = this.rawSnapshot.collections.goals || [];

    const unlocated = [];
    const existingEntries = this.repo.getAll();

    for (const [kind, items] of [['task', calendarItems], ['habit', habits], ['goal', goals]]) {
      for (const item of items) {
        const id = String(item.id || '').replaceAll('-', '');
        if (!id) continue;
        const sourceUrl = item.sourceUrl || '';
        const existing = existingEntries.find(entry => entry.source === 'NOTION' && (entry.id === 'notion-' + id || sourceUrl && entry.notionPageUrl === sourceUrl));
        const done = !!(item.done || item.achieved);
        const lat = Number(item.lat), lng = Number(item.lng);
        const located = item.lat != null && item.lng != null && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
        const changes = { title: item.title || item.name || 'Nhiệm vụ Notion', status: done ? 'DONE' : 'PLANNED', notionPageUrl: sourceUrl };
        if (item.date || item.startDate) changes.startsAt = item.date || item.startDate;
        if (located) Object.assign(changes, { lat, lng, address: item.address || existing?.address || 'Địa điểm Notion' });
        if (existing) {
          if (Object.entries(changes).some(([key, value]) => existing[key] !== value)) this.repo.update(existing.id, changes);
          continue;
        }
        if (done) continue;
        if (located) this.repo.create({ id: 'notion-' + id, type: 'NOTION_MISSION', ...changes, source: 'NOTION' });
        else if (kind === 'task') unlocated.push({ id: 'notion-unlocated-' + id, title: changes.title, date: item.date || item.startDate || null, priority: item.priority || '', type: item.type || '', sourceUrl, rawItem: item });
      }
    }

    this.unlocatedMissions = unlocated;
  }

  getUnlocatedMissions() {
    return [...this.unlocatedMissions];
  }

  assignLocation(unlocatedId, lat, lng, address = '') {
    const itemIdx = this.unlocatedMissions.findIndex(m => m.id === unlocatedId);
    if (itemIdx === -1) return null;

    const item = this.unlocatedMissions.splice(itemIdx, 1)[0];

    const createdEntry = this.repo.create({
      type: 'NOTION_MISSION',
      title: item.title,
      lat,
      lng,
      address: address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      startsAt: item.date || new Date().toISOString(),
      status: 'PLANNED',
      notionPageUrl: item.sourceUrl,
      source: 'NOTION'
    });

    return createdEntry;
  }
}
