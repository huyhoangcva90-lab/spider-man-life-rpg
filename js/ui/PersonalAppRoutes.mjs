// Old links remain entry points into one Habit/Quest app, not separate trackers.
export function personalAppRoute(section, tab = 'APP') {
  if (section === 'HABITS') {
    const views = { APP: 'reports', GAMBIT: 'reports', TODAY: 'today', PROGRESS: 'reports', '66 DAYS': 'core-habits' };
    return views[tab] ? { section, view: views[tab], src: tab === '66 DAYS' ? './life-reset/index.html' : './life-reset/personal/index.html' } : null;
  }
  if (section === 'QUESTS' && ['APP', 'GAMBIT', 'TODAY', 'OVERDUE'].includes(tab)) {
    return { section, view: 'quests', src: './life-reset/personal/index.html', filter: tab === 'OVERDUE' ? 'overdue' : 'today' };
  }
  return null;
}

export function personalFieldDestination(id) {
  return id === 'habits' ? 'HABITS' : id === 'todo' ? 'QUESTS' : null;
}
