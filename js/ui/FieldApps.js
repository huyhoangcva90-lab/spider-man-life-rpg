export const FIELD_APPS = Object.freeze({
  __proto__: null,
  launcher: { title: 'Spider Field', launcher: true },
  routine: { title: 'Nhịp sinh học', backend: false },
  dopamine: { title: 'Dopamine Menu', backend: true },
  timetable: { title: 'Lịch trong ngày', backend: true },
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
  return `<section class="spider-field-app" data-field-app="${id}" aria-label="${app.title}">
    <button type="button" class="spider-field-app-return" data-field-app-back aria-label="Trở về Spider Apps" title="Trở về Spider Apps">←</button>
    ${!app.launcher ? '<button type="button" class="spider-field-app-connection" data-notion-connect>Mở kết nối riêng</button>' : ''}
    <p class="spider-field-app-loading" role="status">Đang mở ${app.title}…</p>
    <iframe class="spider-field-app-frame" title="${app.title} — Spider Field" src="./field-tools/${app.launcher ? '' : `apps/${id}/`}index.html?spiderEmbed=1&amp;spiderTheme=original" data-field-app-frame></iframe>
  </section>`;
}

export function bindFieldApps(controller, content) {
  content.querySelectorAll('a[href^="./field-tools/apps/"]').forEach((link) => {
    const id = link.getAttribute('href').split('/')[3];
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
  const backLabel=controller.panelSection==='FIELD'&&controller.fieldAppId?'Về Field':'Về Home';
  back?.setAttribute('aria-label',backLabel);back?.setAttribute('title',backLabel);
  const frame = content.querySelector('[data-field-app-frame]');
  content.querySelector('[data-notion-connect]')?.addEventListener('click', () => frame?.contentWindow?.postMessage({type:'spider:notion-connect'},location.origin));
  frame?.addEventListener('load', () => {
    content.querySelector('.spider-field-app-loading')?.setAttribute('hidden', '');
  }, { once: true });
}
