export class RewardEngine {
  constructor(rewardRegistry) {
    this.rewards = rewardRegistry;
  }

  apply(rewardId, state, rewardMultiplier = 1) {
    const table = this.rewards.get(rewardId);
    if (!table) return { rewardId, applied: [], warning: 'REWARD TABLE MISSING' };
    const applied = [];
    const summary = { xp: 0, coins: 0, skillPoints: 0, items: [] };

    table.guaranteed.forEach((entry) => {
      const amount = ['XP', 'WEB_COINS'].includes(entry.type) ? Math.max(1, Math.round(entry.amount * rewardMultiplier)) : entry.amount;
      if (entry.type === 'XP') {
        this.gainXp(state.progression, amount);
        summary.xp += amount;
      } else if (entry.type === 'WEB_COINS') {
        state.progression.coins += amount;
        summary.coins += amount;
      } else if (entry.type === 'SKILL_POINT') {
        state.progression.skillPoints += amount;
        summary.skillPoints += amount;
      } else if (entry.type === 'ALLY_AFFINITY') {
        state.allyAffinity[entry.allyId] = (state.allyAffinity[entry.allyId] || 0) + amount;
      } else if (entry.type === 'ITEM') {
        const current = state.inventory[entry.itemId]?.count || 0;
        if (entry.unique && current > 0) return;
        state.inventory[entry.itemId] = { name: entry.name, count: entry.unique ? 1 : current + amount, unique: Boolean(entry.unique) };
        summary.items.push({ id: entry.itemId, name: entry.name, amount });
      }
      applied.push({ ...entry, amount });
    });
    return { rewardId, applied, ...summary };
  }

  gainXp(progression, amount) {
    progression.xp += amount;
    while (progression.xp >= progression.xpToNext) {
      progression.xp -= progression.xpToNext;
      progression.level += 1;
      progression.skillPoints += 1;
      progression.xpToNext = Math.round(progression.xpToNext * 1.28);
    }
  }
}
