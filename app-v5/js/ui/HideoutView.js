/* ==========================================================================
   V5 HIDEOUT VIEW
   Collectible equipment, suits, gadgets, skills with explicit mechanical effects
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class HideoutView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    eventBus.on('VIEW_CHANGED', (viewName) => {
      if (viewName === 'hideout') this.render();
      else this.close();
    });

    eventBus.on('EQUIPMENT_CHANGED', () => {
      if (stateStore.getState().activeView === 'hideout') this.render();
    });
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    const state = stateStore.getState();
    const equipment = state.equipment || [];

    this.container.innerHTML = `
      <div class="system-drawer-backdrop"></div>
      <div class="system-drawer-content">
        
        <div class="drawer-header">
          <div class="drawer-title-group">
            <span class="drawer-subtitle">KHO KHI GIỚI & CĂN CỨ ĐẶC VỤ</span>
            <h2 class="drawer-title">CĂN CỨ TÁC CHIẾN (HIDEOUT & GEAR)</h2>
          </div>
          <button class="drawer-close-btn" id="btn-close-hideout">✕</button>
        </div>

        <div class="hideout-description-banner">
          <span class="banner-icon">🏰</span>
          <p>Thu thập và trang bị bộ giáp, thiết bị, vi mạch và kỹ năng tác chiến. Mỗi trang bị mang lại <strong>HIỆU ỨNG CƠ CHẾ NGUYÊN BẢN</strong> tăng cường sức mạnh cho Đặc Vụ Web.</p>
        </div>

        <!-- Equipment Catalog Grid -->
        <div class="equipment-catalog-grid">
          ${equipment.map(item => `
            <div class="equipment-card ${item.equipped ? 'is-equipped' : ''} rarity-${item.rarity.toLowerCase()}">
              <div class="eq-card-header">
                <span class="eq-icon">${item.icon}</span>
                <div class="eq-title-block">
                  <h4 class="eq-name">${item.name}</h4>
                  <span class="eq-rarity">${item.rarity} | ${item.category}</span>
                </div>
              </div>

              <p class="eq-description">${item.description}</p>

              <!-- Explicit Mechanical Effect -->
              <div class="eq-mechanical-effect">
                <span class="effect-icon">⚡</span>
                <span class="effect-text"><strong>Hiệu ứng cơ chế:</strong> ${item.mechanicalEffect}</span>
              </div>

              <div class="eq-card-footer">
                <button class="btn-toggle-equip ${item.equipped ? 'btn-unequip' : 'btn-equip'}" data-id="${item.id}">
                  ${item.equipped ? '✓ Đang Trang Bị (Tháo ra)' : '➕ Trang Bị Ngay'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.classList.add('active');

    // Attach equip toggle listeners
    this.container.querySelectorAll('.btn-toggle-equip').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        stateStore.toggleEquipment(id);
      });
    });

    const closeBtn = this.container.querySelector('#btn-close-hideout');
    if (closeBtn) closeBtn.addEventListener('click', () => stateStore.setView('world'));

    const backdrop = this.container.querySelector('.system-drawer-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => stateStore.setView('world'));
  }
}
