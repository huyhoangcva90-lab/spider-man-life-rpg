const ENTRY_ACTION = Object.freeze({ WORK: 'basic-combo', NOTION_MISSION: 'web-shot', PLAN: 'impact-web', MEETING: 'venom-assist', PERSON: 'venom-assist', ERRAND: 'basic-combo', LEISURE: 'web-shot' });

export class QuestEngine {
  normalizeExternalEntry(entry) {
    if (!entry?.id) return null;
    return {
      externalId: entry.id,
      source: entry.source || (entry.type === 'NOTION_MISSION' ? 'NOTION' : 'LOCAL'),
      title: entry.title || 'Untitled mission',
      questType: entry.type === 'NOTION_MISSION' ? 'DAILY' : 'SIDE',
      difficulty: 'NORMAL',
      completed: entry.status === 'DONE',
      actionId: ENTRY_ACTION[entry.type] || 'basic-combo',
      rewardId: 'real-quest-clear'
    };
  }

  acceptCompletion(entry, state, localDay) {
    const questEvent = this.normalizeExternalEntry(entry);
    if (!questEvent?.completed || state.quest.completedExternalIds.includes(questEvent.externalId)) return null;
    state.quest.completedExternalIds.push(questEvent.externalId);
    if (state.daily.date !== localDay) state.daily = { date: localDay, completed: 0, claimed: false, metrics: {} };
    state.daily.completed += 1;
    state.progression.streak += 1;
    return questEvent;
  }
}

