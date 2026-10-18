(function () {
  'use strict';

  // Capture script URL immediately while document.currentScript is available
  var currentScript = document.currentScript;
  var scriptSrc = currentScript ? currentScript.src : '';

  // Detect query parameter spiderEmbed=1
  var params = new URLSearchParams(window.location.search);
  if (params.get('spiderEmbed') !== '1') {
    return;
  }

  // Set managed mode before app-guard runs
  document.documentElement.setAttribute('data-gambit-back-mode', 'managed');

  // Add spider-embedded class to root html element
  document.documentElement.classList.add('spider-embedded');

  // Inject CSS relative to this script's location
  if (scriptSrc) {
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
