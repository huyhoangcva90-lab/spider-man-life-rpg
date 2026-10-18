// Standalone life tools share the frame. Embedded tools inherit the parent's frame.
if (window.self === window.top) {
  const content = document.createElement('main');
  content.className = 'standalone-tracker-content';
  while (document.body.firstChild) content.appendChild(document.body.firstChild);
  const shell = document.createElement('div');
  shell.className = 'standalone-tracker';
  shell.innerHTML = `<div class="standalone-tracker-frame" aria-hidden="true">${[1,2,3,4,5].flatMap(row => (row === 2 ? [1,3] : [1,2,3]).map(col => `<i style="grid-area:${row}/${col};background-image:url('/assets/spideytracker/frame/frame${row}-${col}.png')"></i>`)).join('')}</div><header class="standalone-tracker-header"><details><summary aria-label="Điều hướng Spider Life"><span class="standalone-menu-head"></span></summary><nav aria-label="Spider Life"><a href="/">HOME / BATTLE</a><a href="/?game=CITY">BẢN ĐỒ</a><a href="/?game=HERO&tab=PROFILE">HERO</a><a href="/?game=QUESTS">NHIỆM VỤ</a><a href="/life-os/">SPIDER APPS</a><a href="/life-reset/">LIFE 66</a></nav></details><a class="standalone-logo" href="/" aria-label="Về Home Spider Life"><img src="/assets/spideytracker/tracker_logo3.png" alt="Spider Life"></a><a class="standalone-apps" href="/life-os/" aria-label="Mở Spider Apps"></a></header><footer class="standalone-tracker-footer"><i class="standalone-spidey"></i><a href="/">SPIDER LIFE · HOME</a><i class="standalone-web-spidey"></i></footer>`;
  shell.appendChild(content); document.body.appendChild(shell);
  document.body.classList.add('has-standalone-tracker');
}
