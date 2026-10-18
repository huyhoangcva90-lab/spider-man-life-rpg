(function () {
  document.documentElement.classList.add("no-copy");

  // Global S22 Ultra & Mobile Haptic Vibration Helper
  window.vibe = function (ms) {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(ms || 12);
      }
    } catch (e) {}
  };

  var homeIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';

  var style = document.createElement("style");
  style.textContent =
    "html.no-copy,html.no-copy body,html.no-copy body *{" +
    "-webkit-user-select:none!important;user-select:none!important;" +
    "-webkit-touch-callout:none!important}" +
    "html.no-copy input,html.no-copy textarea{" +
    "-webkit-user-select:text!important;user-select:text!important}" +

    /* S22 Ultra 19.3:9 & One UI Ergonomics Styling */
    "@media screen and (max-width: 600px) {" +
    "  .app-wrap, .shell, #app, .routine-shell, .phone, .app-shell, .wrap {" +
    "    width: min(100%, 412px) !important;" +
    "    margin: 0 auto !important;" +
    "  }" +
    "}" +

    "[data-gambit-home]{box-sizing:border-box!important;" +
    "width:42px!important;height:42px!important;min-width:42px!important;min-height:42px!important;" +
    "padding:0!important;border-radius:14px!important;display:grid!important;place-items:center!important;" +
    "background:rgba(15,23,42,.65)!important;color:#fff!important;" +
    "border:1px solid rgba(255,255,255,.2)!important;" +
    "box-shadow:0 10px 28px rgba(0,0,0,.35)!important;" +
    "backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;" +
    "text-decoration:none!important;line-height:1!important;letter-spacing:0!important;" +
    "transition:transform .16s ease,opacity .16s ease,background .16s ease,border-color .16s ease!important;" +
    "touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}" +
    "[data-gambit-home]:hover{background:rgba(255,255,255,.18)!important;border-color:rgba(255,255,255,.32)!important}" +
    "[data-gambit-home]:active{transform:scale(.94)!important;opacity:.76!important}" +
    "[data-gambit-home]:focus-visible{outline:2px solid rgba(255,255,255,.72)!important;outline-offset:3px!important}" +
    "[data-gambit-home] span{display:none!important}" +
    "[data-gambit-home] i{font-size:20px!important;line-height:1!important;margin:0!important}" +
    "[data-gambit-home] svg{width:21px!important;height:21px!important;fill:none!important;stroke:currentColor!important;stroke-width:2.15!important;stroke-linecap:round!important;stroke-linejoin:round!important;margin:0!important}" +
    "[data-gambit-home][data-gambit-hidden='true']{display:none!important}" +
    ".gambit-home-fallback{position:fixed!important;top:max(28px,calc(env(safe-area-inset-top) + 14px))!important;left:max(16px,calc(env(safe-area-inset-left) + 12px))!important;z-index:9999!important;color:#fff!important}";
  document.head.appendChild(style);

  var homeSelector = [
    "[data-gambit-home]",
    "a[href='../../index.html']",
    'a[href="../../index.html"]',
  ].join(",");

  function normalizeHomeControl(el, index) {
    if (!el) return;
    if (index > 0) {
      el.setAttribute("data-gambit-hidden", "true");
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("tabindex", "-1");
      return;
    }
    if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", "Về Gambit");
    el.setAttribute("title", "Về Gambit");
    el.setAttribute("data-gambit-home", "true");
    if (!el.querySelector("svg,i")) el.innerHTML = homeIcon;
  }

  function ensureHomeControl() {
    if (location.pathname.indexOf("/apps/") === -1) return;
    if (document.documentElement.getAttribute("data-gambit-back-mode") === "managed") {
      document.querySelectorAll(".gambit-home-fallback").forEach(function (fallback) {
        if (fallback.parentNode) fallback.parentNode.removeChild(fallback);
      });
      return;
    }
    var controls = Array.prototype.slice.call(document.querySelectorAll(homeSelector));
    var fallbacks = document.querySelectorAll(".gambit-home-fallback");

    if (controls.length > (fallbacks.length ? 1 : 0)) {
      fallbacks.forEach(function (fb) {
        if (fb.parentNode) fb.parentNode.removeChild(fb);
      });
      controls = Array.prototype.slice.call(document.querySelectorAll(homeSelector));
    }

    controls.forEach(normalizeHomeControl);
    if (controls.length) return;

    var a = document.createElement("a");
    a.className = "gambit-home-fallback";
    a.href = "../../index.html";
    a.setAttribute("aria-label", "Về Gambit");
    a.setAttribute("title", "Về Gambit");
    a.setAttribute("data-gambit-home", "true");
    a.innerHTML = homeIcon;
    document.body.appendChild(a);
  }

  function verifyAuthSession() {
    if (location.pathname === "/login" || location.pathname === "/api/auth/login") return;
    var savedToken = "";
    try { savedToken = localStorage.getItem("gambit_auth_token") || ""; } catch(e){}

    var headers = { "X-Requested-With": "XMLHttpRequest" };
    if (savedToken) {
      headers["Authorization"] = "Bearer " + savedToken;
    }

    fetch("/api/auth/check", { cache: "no-store", headers: headers })
      .then(function (res) {
        if (res.status === 401) {
          try { localStorage.removeItem("gambit_auth_token"); } catch(e){}
          var loginUrl = "/login?next=" + encodeURIComponent(location.pathname + location.search);
          location.replace(loginUrl);
        }
      })
      .catch(function () {});
  }

  verifyAuthSession();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      ensureHomeControl();
      setTimeout(ensureHomeControl, 300);
    }, { once: true });
  } else {
    ensureHomeControl();
    setTimeout(ensureHomeControl, 300);
  }

  if (window.MutationObserver && location.pathname.indexOf("/apps/") !== -1) {
    var observer = new MutationObserver(function () {
      ensureHomeControl();
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  // Add click haptic feedback to all buttons and links
  document.addEventListener("click", function (e) {
    var target = e.target.closest("button, a, .app-card, .filter-pill, .sound-card, .sound-toggle");
    if (target) {
      window.vibe(10);
    }
  });

  ["copy", "cut", "contextmenu", "dragstart"].forEach(function (eventName) {
    document.addEventListener(eventName, function (event) {
      event.preventDefault();
    });
  });
})();
