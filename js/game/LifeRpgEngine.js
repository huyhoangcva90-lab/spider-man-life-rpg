/* SPIDEY LIFE TRACKER — local-first progression loop adapted from the root RPG engine */

const ATTRIBUTES = ['AGILITY', 'POWER', 'INTELLECT', 'FOCUS', 'DISCIPLINE', 'WILLPOWER'];

const ENTRY_REWARDS = {
  MEETING: { attribute: 'WILLPOWER', xp: 30, gold: 18, damage: 32, stagger: 12 },
  PERSON: { attribute: 'WILLPOWER', xp: 25, gold: 15, damage: 28, stagger: 12 },
  PLAN: { attribute: 'DISCIPLINE', xp: 25, gold: 15, damage: 30, stagger: 14 },
  LEISURE: { attribute: 'AGILITY', xp: 20, gold: 12, damage: 24, stagger: 10 },
  ERRAND: { attribute: 'POWER', xp: 25, gold: 15, damage: 30, stagger: 10 },
  WORK: { attribute: 'FOCUS', xp: 40, gold: 22, damage: 42, stagger: 16 },
  NOTION_MISSION: { attribute: 'INTELLECT', xp: 35, gold: 20, damage: 38, stagger: 15 }
};

export class LifeRpgEngine {
  constructor(eventBus) {
    this.bus = eventBus;
    this.storageKey = 'spidey-life-rpg-v1';
    this.state = this.load();
  }

  createDefaultState() {
    return {
      version: 1,
      character: {
        level: 1,
        xp: 0,
        xpToNext: this.getXpToNextLevel(1),
        gold: 0,
        stats: Object.fromEntries(ATTRIBUTES.map((name) => [name, 1])),
        attrXp: Object.fromEntries(ATTRIBUTES.map((name) => [name, 0]))
      },
      boss: {
        raid: 1,
        name: 'GREEN GOBLIN',
        status: 'ACTIVE',
        weakness: 'FOCUS',
        currentHp: 900,
        maxHp: 900,
        stagger: 0,
        maxStagger: 100,
        combatLog: []
      },
      streak: { current: 0, best: 0, lastCompletedDate: null },
      ledger: { completedEntryIds: [] },
      inventory: { loot: [] }
    };
  }

  load() {
    const fallback = this.createDefaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey));
      if (!saved || typeof saved !== 'object') return fallback;
      return {
        ...fallback,
        ...saved,
        character: {
          ...fallback.character,
          ...(saved.character || {}),
          stats: { ...fallback.character.stats, ...(saved.character?.stats || {}) },
          attrXp: { ...fallback.character.attrXp, ...(saved.character?.attrXp || {}) }
        },
        boss: { ...fallback.boss, ...(saved.boss || {}) },
        streak: { ...fallback.streak, ...(saved.streak || {}) },
        ledger: { ...fallback.ledger, ...(saved.ledger || {}) },
        inventory: { ...fallback.inventory, ...(saved.inventory || {}) }
      };
    } catch {
      return fallback;
    }
  }

  save() {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.state)); } catch { /* memory state remains usable */ }
  }

  getSnapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }

  getXpToNextLevel(level) {
    return Math.round(100 * Math.pow(level, 1.35));
  }

  getAttrXpThreshold(statValue) {
    return Math.round(50 * Math.pow(statValue, 1.15));
  }

  addAccountXp(amount) {
    const character = this.state.character;
    character.xp += amount;
    let levelsGained = 0;
    while (character.xp >= character.xpToNext) {
      character.xp -= character.xpToNext;
      character.level += 1;
      levelsGained += 1;
      character.xpToNext = this.getXpToNextLevel(character.level);
    }
    return levelsGained;
  }

  addAttributeXp(attribute, amount) {
    const character = this.state.character;
    if (!ATTRIBUTES.includes(attribute)) return false;
    character.attrXp[attribute] += amount;
    let leveledUp = false;
    let threshold = this.getAttrXpThreshold(character.stats[attribute]);
    while (character.attrXp[attribute] >= threshold) {
      character.attrXp[attribute] -= threshold;
      character.stats[attribute] += 1;
      leveledUp = true;
      threshold = this.getAttrXpThreshold(character.stats[attribute]);
    }
    return leveledUp;
  }

  completeEntry(entry) {
    if (!entry || entry.status !== 'DONE' || this.state.ledger.completedEntryIds.includes(entry.id)) return null;

    const reward = ENTRY_REWARDS[entry.type] || ENTRY_REWARDS.PLAN;
    const weaknessMatch = reward.attribute === this.state.boss.weakness;
    const damage = Math.round(reward.damage * (weaknessMatch ? 1.5 : 1));
    const stagger = Math.round(reward.stagger * (weaknessMatch ? 1.5 : 1));

    const levelsGained = this.addAccountXp(reward.xp);
    const attributeLeveled = this.addAttributeXp(reward.attribute, 18);
    this.state.character.gold += reward.gold;
    this.state.ledger.completedEntryIds.push(entry.id);
    this.updateStreak();

    let victory = null;
    if (this.state.boss.status === 'ACTIVE') {
      this.state.boss.currentHp = Math.max(0, this.state.boss.currentHp - damage);
      this.state.boss.stagger = Math.min(this.state.boss.maxStagger, this.state.boss.stagger + stagger);
      this.state.boss.combatLog.unshift({
        at: new Date().toISOString(),
        text: `${entry.title}: ${damage} DMG${weaknessMatch ? ' // WEAKNESS!' : ''}`
      });
      this.state.boss.combatLog = this.state.boss.combatLog.slice(0, 8);
      victory = this.resolveVictory();
    }

    this.save();
    const result = { reward, damage, stagger, weaknessMatch, levelsGained, attributeLeveled, victory };
    this.bus.emit('RPG_UPDATED', result);
    return result;
  }

  executeFinisher() {
    const boss = this.state.boss;
    if (boss.status !== 'ACTIVE' || boss.stagger < boss.maxStagger) return null;
    const damage = 350;
    boss.currentHp = Math.max(0, boss.currentHp - damage);
    boss.stagger = 0;
    boss.combatLog.unshift({ at: new Date().toISOString(), text: `SPIDER FINISHER: ${damage} CRITICAL DAMAGE` });
    const victory = this.resolveVictory();
    this.save();
    const result = { finisher: true, damage, victory };
    this.bus.emit('RPG_UPDATED', result);
    return result;
  }

  resolveVictory() {
    const boss = this.state.boss;
    if (boss.currentHp > 0 || boss.status === 'DEFEATED') return null;
    boss.status = 'DEFEATED';
    const lootName = `GOBLIN TECH CACHE // RAID ${boss.raid}`;
    this.state.inventory.loot.unshift({ name: lootName, acquiredAt: new Date().toISOString() });
    this.state.inventory.loot = this.state.inventory.loot.slice(0, 20);
    this.state.character.gold += 150;
    const levelsGained = this.addAccountXp(250);
    return { lootName, xp: 250, gold: 150, levelsGained };
  }

  startNextRaid() {
    if (this.state.boss.status !== 'DEFEATED') return false;
    const nextRaid = this.state.boss.raid + 1;
    const nextMaxHp = Math.round(900 * Math.pow(1.16, nextRaid - 1));
    const nextWeakness = ATTRIBUTES[(nextRaid - 1) % ATTRIBUTES.length];
    this.state.boss = {
      raid: nextRaid,
      name: 'GREEN GOBLIN',
      status: 'ACTIVE',
      weakness: nextWeakness,
      currentHp: nextMaxHp,
      maxHp: nextMaxHp,
      stagger: 0,
      maxStagger: 100 + ((nextRaid - 1) * 10),
      combatLog: []
    };
    this.save();
    this.bus.emit('RPG_UPDATED', { nextRaid });
    return true;
  }

  updateStreak() {
    const today = this.toLocalDay(new Date());
    const last = this.state.streak.lastCompletedDate;
    if (last === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.state.streak.current = last === this.toLocalDay(yesterday) ? this.state.streak.current + 1 : 1;
    this.state.streak.best = Math.max(this.state.streak.best, this.state.streak.current);
    this.state.streak.lastCompletedDate = today;
  }

  toLocalDay(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export { ATTRIBUTES };
