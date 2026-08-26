const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ContentRegistry {
  constructor(name, records = []) {
    this.name = name;
    this.records = new Map();
    records.forEach((record) => this.register(record));
  }

  register(record) {
    if (!record || !ID_PATTERN.test(record.id || '')) {
      throw new Error(`[REGISTRY] ${this.name} has invalid id: ${record?.id}`);
    }
    if (this.records.has(record.id)) throw new Error(`[REGISTRY] Duplicate ${this.name} id: ${record.id}`);
    this.records.set(record.id, Object.freeze({ ...record }));
    return this;
  }

  get(id) { return this.records.get(id) || null; }
  has(id) { return this.records.has(id); }
  all() { return [...this.records.values()]; }
}

export function validatePhaseOneContent(content) {
  const warnings = [];
  const requireRef = (registry, id, source) => {
    if (!registry.has(id)) warnings.push(`[REGISTRY] ${source} references missing id: ${id}`);
  };

  content.heroes.all().forEach((hero) => {
    hero.skillIds.forEach((id) => requireRef(content.actions, id, hero.id));
    requireRef(content.actions, hero.ultimateId, hero.id);
  });
  content.quests.all().forEach((quest) => {
    requireRef(content.zones, quest.zoneId, quest.id);
    requireRef(content.rewards, quest.rewardId, quest.id);
    quest.enemyIds.forEach((id) => requireRef(content.enemies, id, quest.id));
  });
  content.enemies.all().forEach((enemy) => requireRef(content.rewards, enemy.rewardId, enemy.id));
  content.zones.all().forEach((zone) => requireRef(content.districts, zone.districtId, zone.id));
  warnings.forEach((warning) => console.warn(warning));
  return warnings;
}

