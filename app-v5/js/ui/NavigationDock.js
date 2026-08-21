/* ==========================================================================
   V5 NAVIGATION DOCK
   Diegetic floating game dock over the Living City Map (Desktop & Mobile)
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class NavigationDock {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    this.render();
    eventBus.on('VIEW_CHANGED', () => this.render());
  }

  render() {
    const activeView = stateStore.getState().activeView;

    this.container.innerHTML = `
      <div class="dock-wrapper">
        <button class="dock-item ${activeView === 'world' ? 'active' : ''}" data-view="world">
          <span class="dock-icon">🏙️</span>
          <span class="dock-label">THÀNH PHỐ</span>
        </button>

        <button class="dock-item ${activeView === 'operative' ? 'active' : ''}" data-view="operative">
          <span class="dock-icon">👤</span>
          <span class="dock-label">ĐẶC VỤ</span>
        </button>

        <button class="dock-item ${activeView === 'missions' ? 'active' : ''}" data-view="missions">
          <span class="dock-icon">📋</span>
          <span class="dock-label">NHIỆM VỤ</span>
        </button>

        <button class="dock-item ${activeView === 'hideout' ? 'active' : ''}" data-view="hideout">
          <span class="dock-icon">🏰</span>
          <span class="dock-label">CĂN CỨ</span>
        </button>

        <button class="dock-item ${activeView === 'chronicle' ? 'active' : ''}" data-view="chronicle">
          <span class="dock-icon">📜</span>
          <span class="dock-label">SỬ KÝ</span>
        </button>
      </div>
    `;

    // Attach click listeners to tabs
    this.container.querySelectorAll('.dock-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        stateStore.setView(view);
      });
    });
  }
}
