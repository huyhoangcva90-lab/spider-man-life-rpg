/* Route existing Life OS bookmarks to the original Gambit apps. */
(() => {
  const routes = { today: 'todo', routine: 'routine', dopamine: 'dopamine', timetable: 'timetable', habits: 'habits', journal: 'journal', gym: 'gym' };
  const open = (view) => {
    const app = routes[view];
    if (!app) return false;
    location.replace(new URL(`../?spiderApp=${app}`, location.href).href);
    return true;
  };
  if (open(location.hash.slice(1))) return;
  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('.system-nav[data-view]');
    if (button && routes[button.dataset.view]) {
      event.preventDefault();
      event.stopImmediatePropagation();
      open(button.dataset.view);
    }
  }, true);
  window.addEventListener('hashchange', () => open(location.hash.slice(1)));
})();
