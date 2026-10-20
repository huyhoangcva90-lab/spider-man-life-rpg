const CACHE_PREFIX = "spider-gambit-shell-";
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const APP_SCOPE = new URL("./", self.location.href);
const APP_SHELL = [
  "./",
  "./index.html",
  "./app-guard.js",
  "./manifest.webmanifest",
  "./assets/favicon.svg",
  "./assets/gambit-app-polish.css",
  "./assets/gambit-app-polish.js",
  "./assets/fonts/be-vietnam-pro-400.ttf",
  "./assets/fonts/be-vietnam-pro-600.ttf",
  "./assets/fonts/noto-serif-display-500.ttf",
  "./assets/vendor/tabler/tabler-icons.min.css",
  "./assets/vendor/tabler/fonts/tabler-icons.woff2",
  "./assets/vendor/react/react.production.min.js",
  "./assets/vendor/react/react-dom.production.min.js",
  "./apps/dopamine/",
  "./apps/dopamine/index.html",
  "./apps/dopamine/icon.png",
  "./apps/dopamine/apple-touch-icon.png",
  "./apps/english/",
  "./apps/english/index.html",
  "./apps/english/icon.png",
  "./apps/english/apple-touch-icon.png",
  "./apps/finance/",
  "./apps/finance/index.html",
  "./apps/finance/workspace.css",
  "./apps/finance/workspace.js",
  "./apps/finance/finance-core.js",
  "./apps/finance/reports.js",
  "./apps/finance/year-reports.js",
  "./apps/finance/reports.css",
  "./apps/finance/sheet-editor.js",
  "./apps/finance/planner.js",
  "./apps/finance/insights.js",
  "./apps/finance/daily-tools.js",
  "./apps/finance/transfers-splits.js",
  "./apps/finance/sync-health.js",
  "./apps/finance/icon.png",
  "./apps/finance/apple-touch-icon.png",
  "./apps/gym/",
  "./apps/gym/index.html",
  "./apps/gym/icon.png",
  "./apps/gym/apple-touch-icon.png",
  "./apps/habits/",
  "./apps/habits/index.html",
  "./apps/habits/icon.png",
  "./apps/habits/apple-touch-icon.png",
  "./apps/journal/",
  "./apps/journal/index.html",
  "./apps/journal/icon.png",
  "./apps/journal/apple-touch-icon.png",
  "./apps/oracle/",
  "./apps/oracle/index.html",
  "./apps/oracle/icon.png",
  "./apps/oracle/apple-touch-icon.png",
  "./apps/routine/",
  "./apps/routine/index.html",
  "./apps/routine/app.compiled.js",
  "./apps/routine/icon.png",
  "./apps/routine/apple-touch-icon.png",
  "./apps/style30/",
  "./apps/style30/index.html",
  "./apps/style30/icon.png",
  "./apps/style30/apple-touch-icon.png",
  "./apps/someday/",
  "./apps/someday/index.html",
  "./apps/someday/icon.png",
  "./apps/someday/apple-touch-icon.png",
  "./apps/timetable/",
  "./apps/timetable/index.html",
  "./apps/timetable/icon.png",
  "./apps/timetable/apple-touch-icon.png",
  "./apps/todo/",
  "./apps/todo/index.html",
  "./apps/todo/icon.png",
  "./apps/todo/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== APP_SCOPE.origin || !url.pathname.startsWith(APP_SCOPE.pathname) || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && !response.redirected && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => (await caches.open(CACHE_NAME)).match(event.request).then((cached) => cached || new Response("Trang này chưa được lưu offline. Hãy kết nối mạng và mở lại.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }))),
  );
});
