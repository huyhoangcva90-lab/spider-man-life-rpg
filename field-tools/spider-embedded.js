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

  // Notify the host only after the existing app has saved through its real API.
  // Database queries also use POST, so they must never be treated as mutations.
  var originalFetch=window.fetch.bind(window),changedTimer;
  window.fetch=async function(input,options){
    var response=await originalFetch(input,options);
    try{
      var url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);
      var method=String(options?.method||input?.method||'GET').toUpperCase();
      var notionPath=url.searchParams.get('path')||'';
      var notionWrite=url.pathname==='/api/notion'&&(method==='PATCH'||method==='POST'&&notionPath==='/v1/pages');
      var appWrite=/^\/api\/(cloud|finance|finance-v2|habit-check)$/.test(url.pathname)&&['POST','PUT','PATCH','DELETE'].includes(method);
      var login=url.pathname==='/api/notion-session'&&method==='POST';
      if(url.origin===location.origin&&response.ok&&(notionWrite||appWrite||login)){
        void response.clone().json().then(function(payload){
          if(payload.ok===false||payload.error)return;
          clearTimeout(changedTimer);
          changedTimer=setTimeout(function(){parent.postMessage({type:login?'spider:session-changed':'spider:notion-changed'},location.origin);},250);
        }).catch(function(){});
      }
    }catch(_){}
    return response;
  };

  // The host owns app navigation. Suppress only legacy home controls,
  // including controls mounted later by React; app menus/settings stay intact.
  var navigationStyle=document.createElement('style');
  navigationStyle.textContent='html[data-gambit-back-mode="managed"] :is([data-gambit-home],a.hub-back,a.back-home,a[href="../../index.html"]){display:none!important}';
  (document.head||document.documentElement).appendChild(navigationStyle);

  // Keep the imported Timetable source intact; its host toolbar opens the
  // original settings button through this embedding bridge.
  window.addEventListener('message', function(event) {
    if (event.origin !== location.origin || event.source !== window.parent) return;
    if (event.data && event.data.type === 'spider:open-app-settings' && document.documentElement.dataset.gambitApp === 'timetable') {
      document.getElementById('settBtn')?.click();
    }
  });

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

      var appLink = target.closest('a[href^="apps/"], a[data-field-app-id]');
      if (appLink && window.parent !== window) {
        var appId = appLink.dataset.fieldAppId || appLink.getAttribute('href').split('/')[1];
        if (['routine','dopamine','timetable','animations','gym','habits','journal','todo','finance','english','oracle','style30','someday'].indexOf(appId) !== -1) {
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
