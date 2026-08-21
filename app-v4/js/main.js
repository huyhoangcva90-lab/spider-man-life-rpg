/* ==========================================================================
   V4 MAIN ENTRY POINT & APPLICATION ROUTER
   Routes 5 game-native destinations: World, Missions, Hero, Arsenal, Chronicle
   ========================================================================== */

import { stateStore } from './core/StateStore.js';
import { ShellView } from './ui/ShellView.js';
import { WorldView } from './ui/WorldView.js';
import { MissionsView } from './ui/MissionsView.js';
import { HeroView } from './ui/HeroView.js';
import { ArsenalView } from './ui/ArsenalView.js';
import { ChronicleView } from './ui/ChronicleView.js';

class App {
  constructor() {
    this.shellView = null;
    this.currentViewInstance = null;
  }

  init() {
    const rootEl = document.getElementById('app-root');
    if (!rootEl) {
      console.error('[V4 App Error] Root element #app-root not found in DOM.');
      return;
    }

    // 1. Render App Shell
    this.shellView = new ShellView(rootEl);
    this.shellView.render();

    // 2. Setup hash change router
    window.addEventListener('hashchange', () => this.handleRoute());

    // 3. Initial route evaluation
    this.handleRoute();

    console.log('[V4 App Initialized] Antigravity V4 Notion Game-First Engine online.');
  }

  handleRoute() {
    const hash = window.location.hash || '#/world';
    const contentContainer = document.getElementById('app-content');
    if (!contentContainer) return;

    stateStore.setRoute(hash);

    switch (hash) {
      case '#/world':
      case '#/command':
      case '#/':
      case '':
        this.currentViewInstance = new WorldView(contentContainer);
        this.currentViewInstance.render();
        break;

      case '#/missions':
        this.currentViewInstance = new MissionsView(contentContainer);
        this.currentViewInstance.render();
        break;

      case '#/hero':
        this.currentViewInstance = new HeroView(contentContainer);
        this.currentViewInstance.render();
        break;

      case '#/arsenal':
        this.currentViewInstance = new ArsenalView(contentContainer);
        this.currentViewInstance.render();
        break;

      case '#/chronicle':
        this.currentViewInstance = new ChronicleView(contentContainer);
        this.currentViewInstance.render();
        break;

      default:
        // Fallback to World View
        this.currentViewInstance = new WorldView(contentContainer);
        this.currentViewInstance.render();
        break;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
