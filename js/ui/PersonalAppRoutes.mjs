// Old links remain entry points into the same Notion-backed Habit/Quest screens.
export function personalAppRoute(section, tab = 'APP') {
  if (section === 'HABITS') {
    const tabs = ['APP', 'GAMBIT', 'TODAY', 'PROGRESS', '66 DAYS'];
    return tabs.includes(tab) ? { section, view: 'reports', src: './life-reset/personal/index.html' } : null;
  }
  if (section === 'QUESTS' && ['APP', 'GAMBIT', 'TODAY', 'OVERDUE'].includes(tab)) {
    return { section, view: 'quests', src: './life-reset/personal/index.html', filter: tab === 'OVERDUE' ? 'overdue' : null };
  }
  return null;
}

export function personalFieldDestination(id) {
  return id === 'habits' ? 'HABITS' : id === 'todo' ? 'QUESTS' : null;
}
