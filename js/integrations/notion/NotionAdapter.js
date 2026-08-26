/* WEB OPS TRACKER V6 - NOTION INTEGRATION ADAPTER */

export class NotionAdapter {
  constructor(eventBus, entryRepository) {
    this.bus = eventBus;
    this.repo = entryRepository;
    this.rawSnapshot = null;
    this.unlocatedMissions = [];
  }

  async loadSnapshot() {
    try {
      const response = await fetch('./data/notion-snapshot.json');
      if (!response.ok) throw new Error(`Notion snapshot HTTP ${response.status}`);
      this.rawSnapshot = await response.json();
      this.parseSnapshot();
      return true;
    } catch (err) {
      console.warn('[NotionAdapter] Could not load notion-snapshot.json:', err);
      return false;
    }
  }

  parseSnapshot() {
    if (!this.rawSnapshot || !this.rawSnapshot.collections) return;

    const calendarItems = this.rawSnapshot.collections.masterCalendar || [];
    const habits = this.rawSnapshot.collections.habits || [];
    const goals = this.rawSnapshot.collections.goals || [];

    const unlocated = [];
    const existingEntries = this.repo.getAll();

    // 1. Process Master Calendar items (primary source for geographic missions)
    calendarItems.forEach(item => {
      if (item.done) return;

      const title = item.title || item.name || 'Nhiệm vụ Notion';
      const sourceUrl = item.sourceUrl || '';
      const id = item.id;

      const hasCoordsInRepo = existingEntries.some(e => 
        (sourceUrl && e.notionPageUrl === sourceUrl) || e.id === `notion-${id}`
      );

      if (item.lat && item.lng) {
        if (!hasCoordsInRepo) {
          this.repo.create({
            id: `notion-${id}`,
            type: 'NOTION_MISSION',
            title,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
            address: item.address || 'Địa điểm Notion',
            startsAt: item.date || new Date().toISOString(),
            status: item.done ? 'DONE' : 'PLANNED',
            notionPageUrl: sourceUrl,
            source: 'NOTION'
          });
        }
      } else if (!hasCoordsInRepo) {
        // Unlocated master calendar record
        unlocated.push({
          id: `notion-unlocated-${id}`,
          title,
          date: item.date || item.startDate || null,
          priority: item.priority || 'Trung bình',
          type: item.type || 'Nhiệm vụ',
          sourceUrl,
          rawItem: item
        });
      }
    });

    // 2. Process Habits & Goals ONLY if they explicitly carry usable address/coordinates
    [...habits, ...goals].forEach(item => {
      if (!item.lat || !item.lng) return;

      const title = item.title || item.name || 'Thói quen / Mục tiêu Notion';
      const sourceUrl = item.sourceUrl || '';
      const id = item.id;

      const hasCoordsInRepo = existingEntries.some(e => 
        (sourceUrl && e.notionPageUrl === sourceUrl) || e.id === `notion-${id}`
      );

      if (!hasCoordsInRepo) {
        this.repo.create({
          id: `notion-${id}`,
          type: 'NOTION_MISSION',
          title,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng),
          address: item.address || 'Địa điểm Notion',
          startsAt: item.startDate || new Date().toISOString(),
          status: item.achieved || item.done ? 'DONE' : 'PLANNED',
          notionPageUrl: sourceUrl,
          source: 'NOTION'
        });
      }
    });

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
