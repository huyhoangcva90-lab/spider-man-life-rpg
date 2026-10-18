export const FIELD_APPS = Object.freeze({
  __proto__: null,
  routine: { title: 'Nhịp sinh học', backend: true },
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
    ${app.backend ? '<span class="spider-field-app-connection" role="status">Đồng bộ trực tuyến chưa kết nối</span>' : ''}
    <p class="spider-field-app-loading" role="status">Đang mở ${app.title}…</p>
    <iframe class="spider-field-app-frame" title="${app.title} — Spider Field" src="./gambit/apps/${id}/index.html?spiderEmbed=1" data-field-app-frame></iframe>
  </section>`;
}

export function bindFieldApps(controller, content) {
  content.querySelectorAll('a[href^="./gambit/apps/"]').forEach((link) => {
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
  const frame = content.querySelector('[data-field-app-frame]');
  frame?.addEventListener('load', () => {
    content.querySelector('.spider-field-app-loading')?.setAttribute('hidden', '');
  }, { once: true });
}
