/* Life OS bookmarks are aliases; the Field launcher owns the app directory. */
(() => {
  const view = location.hash.slice(1);
  const target = new URL('../', location.href);
  if (['reset66', 'habits'].includes(view)) {
    target.searchParams.set('game', 'HABITS');
    target.searchParams.set('tab', view === 'reset66' ? '66 DAYS' : 'APP');
  } else if (view === 'today') {
    target.searchParams.set('game', 'QUESTS');
    target.searchParams.set('tab', 'APP');
  } else {
    target.searchParams.set('game', 'FIELD');
    target.searchParams.set('tab', 'SYSTEMS');
    if (['routine', 'dopamine', 'timetable', 'journal', 'gym'].includes(view)) target.searchParams.set('spiderApp', view);
  }
  location.replace(target.href);
})();
