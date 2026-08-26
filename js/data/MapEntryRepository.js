/* WEB OPS TRACKER V6 - MAP ENTRY REPOSITORY */
import { StorageRepository } from '../core/StorageRepository.js';
import { SampleDataLoader } from './SampleDataLoader.js';

export class MapEntryRepository {
  constructor(eventBus) {
    this.bus = eventBus;
    this.entries = [];
    this.load();
  }

  load() {
    const saved = StorageRepository.getEntries();
    if (saved && saved.length > 0) {
      // Check if stored entries are only seed-entry-* demo records
      const isSeedOnly = saved.every(e => e.id && (e.id.startsWith('seed-entry-') || e.source === 'MANUAL_SEED'));
      if (isSeedOnly) {
        console.log('[MapEntryRepository] Migrated seed-only entries to empty real map.');
        this.entries = [];
        this.save();
      } else {
        this.entries = saved;
      }
    } else {
      // First boot: clean real map with no fabricated seed data
      this.entries = [];
      this.save();
    }
    this.bus.emit('ENTRIES_LOADED', this.entries);
  }

  loadDemoData() {
    const demoEntries = SampleDataLoader.getDemoEntries();
    // Append or replace demo entries
    demoEntries.forEach(demo => {
      if (!this.entries.some(e => e.id === demo.id)) {
        this.entries.push(demo);
      }
    });
    this.save();
    this.bus.emit('ENTRIES_LOADED', this.entries);
  }

  clearDemoData() {
    this.entries = this.entries.filter(e => e.source !== 'DEMO' && !e.id.startsWith('demo-entry-') && !e.id.startsWith('seed-entry-'));
    this.save();
    this.bus.emit('ENTRIES_LOADED', this.entries);
  }

  save() {
    StorageRepository.saveEntries(this.entries);
  }

  getAll() {
    return [...this.entries];
  }

  getById(id) {
    return this.entries.find(e => e.id === id) || null;
  }

  create(entryData) {
    const newEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: entryData.type || 'MEETING',
      title: entryData.title || 'Địa điểm mới',
      lat: parseFloat(entryData.lat),
      lng: parseFloat(entryData.lng),
      address: entryData.address || '',
      startsAt: entryData.startsAt || new Date().toISOString(),
      endsAt: entryData.endsAt || new Date().toISOString(),
      personName: entryData.personName || '',
      notes: entryData.notes || '',
      status: entryData.status || 'PLANNED',
      notionPageUrl: entryData.notionPageUrl || '',
      source: entryData.source || 'MANUAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.entries.push(newEntry);
    this.save();
    this.bus.emit('ENTRY_CREATED', newEntry);
    return newEntry;
  }

  update(id, updates) {
    const idx = this.entries.findIndex(e => e.id === id);
    if (idx === -1) return null;

    this.entries[idx] = {
      ...this.entries[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.save();
    this.bus.emit('ENTRY_UPDATED', this.entries[idx]);
    return this.entries[idx];
  }

  delete(id) {
    const idx = this.entries.findIndex(e => e.id === id);
    if (idx === -1) return false;

    const deleted = this.entries.splice(idx, 1)[0];
    this.save();
    this.bus.emit('ENTRY_DELETED', deleted);
    return true;
  }

  markDone(id) {
    return this.update(id, { status: 'DONE' });
  }

  replaceAll(newEntries) {
    this.entries = newEntries;
    this.save();
    this.bus.emit('ENTRIES_LOADED', this.entries);
  }
}
