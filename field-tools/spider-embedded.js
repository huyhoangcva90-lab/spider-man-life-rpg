(function () {
  'use strict';

  // Capture script URL immediately while document.currentScript is available
  var currentScript = document.currentScript;
  var scriptSrc = currentScript ? currentScript.src : '';

  // Detect query parameter spiderEmbed=1
  var params = new URLSearchParams(window.location.search);
  if (window.parent===window || params.get('spiderEmbed') !== '1') {
    var match=location.pathname.match(/\/apps\/([^/]+)\//),id=match&&match[1];
    var destination=new URL('/',location.origin);
    destination.searchParams.set('game',id==='todo'?'QUESTS':id==='habits'?'HABITS':'FIELD');
    if(id&&id!=='todo'&&id!=='habits')destination.searchParams.set('spiderApp',id);
    location.replace(destination.href);
    return;
  }

  // Set managed mode before app-guard runs
  document.documentElement.setAttribute('data-gambit-back-mode', 'managed');

  // The host owns app navigation. Suppress only legacy home controls,
  // including controls mounted later by React; app menus/settings stay intact.
  var navigationStyle=document.createElement('style');
  navigationStyle.textContent='html[data-gambit-back-mode="managed"] :is([data-gambit-home],a.hub-back,a.back-home,a[href="../../index.html"]){display:none!important}';
  (document.head||document.documentElement).appendChild(navigationStyle);

  function announceReady(){window.parent.postMessage({type:'spider:field-ready'},location.origin);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',announceReady,{once:true});
  else announceReady();

  // Add spider-embedded class to root html element
  if (params.get('spiderTheme') !== 'original') document.documentElement.classList.add('spider-embedded');

  // Inject CSS relative to this script's location
  if (scriptSrc && params.get('spiderTheme') !== 'original') {
    try {
      var themeUrl = new URL('spider-embedded-theme.css', scriptSrc).href;
      var existing = document.querySelector('link[data-spider-embedded-theme]');
      if (!existing) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = themeUrl;
        link.setAttribute('data-spider-embedded-theme', '1');
        (document.head || document.documentElement).appendChild(link);
      }
    } catch (e) {
      // Fallback relative path if URL parsing fails
      var fallbackLink = document.createElement('link');
      fallbackLink.rel = 'stylesheet';
      fallbackLink.href = 'spider-embedded-theme.css';
      fallbackLink.setAttribute('data-spider-embedded-theme', '1');
      (document.head || document.documentElement).appendChild(fallbackLink);
    }
  }

  // Intercept click ONLY on original home/back controls in capture mode
  var HOME_SELECTORS = '[data-gambit-home], a.hub-back, a.back-home, a[href="../../index.html"]';

  window.addEventListener(
    'click',
    function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== 'function') {
        return;
      }

      var appLink = target.closest('a[href^="apps/"]');
      if (appLink && window.parent !== window) {
        var appId = appLink.getAttribute('href').split('/')[1];
        if (['routine','dopamine','timetable','gym','habits','journal','todo','finance','english','oracle','style30','someday'].indexOf(appId) !== -1) {
          event.preventDefault();
          event.stopPropagation();
          window.parent.postMessage({ type:'spider:gambit-open', id:appId }, location.origin);
          return;
        }
      }

      var matched = target.closest(HOME_SELECTORS);
      if (matched) {
        event.preventDefault();
        event.stopPropagation();
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'spider:gambit-home' }, location.origin);
        }
      }
    },
    true // capture mode
  );
})();
