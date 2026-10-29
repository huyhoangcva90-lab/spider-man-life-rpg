export const FIELD_APPS = Object.freeze({
  __proto__: null,
  launcher: { title: 'Spider Field', launcher: true },
  routine: { title: 'Nhịp sinh học', backend: false },
  dopamine: { title: 'Dopamine Menu', backend: true },
  timetable: { title: 'Spider Time', backend: true },
  animations: { title: 'Hoạt ảnh Spider-Man', src: './battle-lab/clip-library.html' },
  gym: { title: 'Gym OS', backend: true },
  habits: { title: 'Thói quen', backend: true },
  journal: { title: 'Parker Journal' },
  todo: { title: 'Việc cần làm', backend: true },
  finance: { title: 'Parker Finance', backend: true },
  english: { title: 'English 32' },
  oracle: { title: 'Oracle' },
  style30: { title: 'Style 30' },
  someday: { title: 'Ambient Focus' }
});

export function renderFieldApp(id) {
  const app = FIELD_APPS[id];
  if (!app) return '';
  const src = app.src || `./field/${app.launcher ? '' : `apps/${id}/`}index.html?spiderEmbed=1&amp;spiderTheme=original`;
  return `<section class="spider-field-app" data-field-app="${id}" aria-label="${app.title}">
    <div role="toolbar" class="spider-field-toolbar" aria-label="Điều hướng ứng dụng">
    <h2 class="spider-field-app-title">${app.title}</h2>
    ${id === 'timetable' ? '<button type="button" class="spider-field-app-settings" data-field-app-settings aria-label="Mở cài đặt Timetable" title="Mở cài đặt Timetable"><span aria-hidden="true">⚙</span></button>' : ''}
    ${app.backend ? '<button type="button" class="spider-field-app-connection" data-notion-connect data-connection-state="unknown" aria-label="Kiểm tra kết nối Notion" title="Kiểm tra kết nối Notion"><span aria-hidden="true">◉</span></button>' : ''}
    ${!app.launcher ? '<button type="button" class="spider-field-app-return" data-field-app-back aria-label="Trở về Spider Apps" title="Trở về Spider Apps"><span aria-hidden="true">←</span></button>' : ''}
    </div>
    <p class="spider-field-app-loading" role="status">Đang mở ${app.title}…</p>
    <iframe class="spider-field-app-frame" title="${app.title} — Spider Field" src="${src}" data-field-app-frame></iframe>
  </section>`;
}

export function bindFieldApps(controller, content) {
  content.querySelectorAll('a[href^="./field/apps/"], a[data-field-app-id]').forEach((link) => {
    const id = link.dataset.fieldAppId || link.getAttribute('href').split('/')[3];
    if (!FIELD_APPS[id]) return;
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      controller.openEmbeddedFieldApp(id);
    });
  });
  content.querySelector('[data-field-app-back]')?.addEventListener('click', () => {
    controller.closeEmbeddedFieldApp();
  });
  const back=content.querySelector('[data-field-app-back]');
  const backLabel=controller.panelSection==='FIELD'&&controller.fieldAppId?'Về Spider Apps':'Về Home';
  back?.setAttribute('aria-label',backLabel);back?.setAttribute('title',backLabel);
  const frame = content.querySelector('[data-field-app-frame]');
  content.querySelector('[data-field-app-settings]')?.addEventListener('click', () => frame?.contentWindow?.postMessage({type:'spider:open-app-settings'},location.origin));
  content.querySelector('[data-notion-connect]')?.addEventListener('click', () => frame?.contentWindow?.postMessage({type:'spider:notion-connect'},location.origin));
  frame?.addEventListener('load', () => {
    content.querySelector('.spider-field-app-loading')?.setAttribute('hidden', '');
  }, { once: true });
}
