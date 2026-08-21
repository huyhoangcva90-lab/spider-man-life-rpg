/* ==========================================================================
   V5 OPERATIVE VIEW
   Character panel with hero art, equipment loadout, attributes, habits & telemetry
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class OperativeView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    eventBus.on('VIEW_CHANGED', (viewName) => {
      if (viewName === 'operative') this.render();
      else this.close();
    });

    eventBus.on('STATE_UPDATED', () => {
      if (stateStore.getState().activeView === 'operative') this.render();
    });
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    const state = stateStore.getState();
    const op = state.operative || {};
    const habits = state.habits || [];
    const daily = state.daily || {};
    const equipment = state.equipment || [];

    const equippedSuits = equipment.filter(e => e.equipped && e.category === 'Suit');
    const equippedGadgets = equipment.filter(e => e.equipped && e.category === 'Gadget');
    const equippedSkills = equipment.filter(e => e.equipped && e.category === 'Skill');
    const equippedImplants = equipment.filter(e => e.equipped && e.category === 'Implant');

    this.container.innerHTML = `
      <div class="system-drawer-backdrop"></div>
      <div class="system-drawer-content">
        
        <div class="drawer-header">
          <div class="drawer-title-group">
            <span class="drawer-subtitle">THÔNG TIN ĐẶC VỤ TÁC CHIẾN</span>
            <h2 class="drawer-title">HỒ SƠ ĐẶC VỤ WEB</h2>
          </div>
          <button class="drawer-close-btn" id="btn-close-operative">✕</button>
        </div>

        <div class="operative-grid-layout">
          
          <!-- Column 1: Hero Key Art & Personal Identity -->
          <div class="op-card op-profile-card">
            <div class="op-portrait-wrapper">
              <img src="../app-v4/assets/characters/web-operative-v1.png" alt="Hero Portrait" onerror="this.src='assets/characters/web-operative-v1.png'; this.onerror=null;" />
              <div class="portrait-glow"></div>
            </div>

            <div class="op-identity-info">
              <h3 class="op-character-name">${op.name || 'Vũ'}</h3>
              <p class="op-role-tag">${op.age || 29} tuổi | Freelancer Web Operative</p>
              <p class="op-handle">${op.handle || '@web_operative_29'}</p>
              <div class="op-level-badge">LEVEL ${op.level || 5} OPERATIVE</div>
            </div>

            <!-- Daily Telemetry Status -->
            <div class="op-daily-telemetry">
              <h4>📊 Ghi Nhận Telemetry Hằng Ngày (Notion)</h4>
              <div class="telemetry-status-box ${daily.logged ? 'logged' : 'unlogged'}">
                <span class="tele-status-icon">${daily.logged ? '✅' : 'ℹ️'}</span>
                <span class="tele-status-text">${daily.statusText || 'Chưa check-in'}</span>
              </div>
            </div>
          </div>

          <!-- Column 2: Attributes & Equipment Slots -->
          <div class="op-card op-stats-card">
            
            <h3 class="section-title">🧠 Chỉ Số Đặc Vụ</h3>
            <div class="attributes-grid">
              <div class="attr-box">
                <span class="attr-icon">🎯</span>
                <div class="attr-data">
                  <span class="attr-label">Tập Trung (Focus)</span>
                  <span class="attr-val">${op.attributes?.focus || 18}</span>
                </div>
                <p class="attr-effect">Tăng tốc độ đếm ngược & độ chính xác nhiệm vụ.</p>
              </div>

              <div class="attr-box">
                <span class="attr-icon">💡</span>
                <div class="attr-data">
                  <span class="attr-label">Trí Tuệ (Intelligence)</span>
                  <span class="attr-val">${op.attributes?.intelligence || 16}</span>
                </div>
                <p class="attr-effect">Tăng % XP thưởng từ Nhiệm vụ Tài Chính & Tri Thức.</p>
              </div>

              <div class="attr-box">
                <span class="attr-icon">🛡️</span>
                <div class="attr-data">
                  <span class="attr-label">Kiên Cường (Resilience)</span>
                  <span class="attr-val">${op.attributes?.resilience || 14}</span>
                </div>
                <p class="attr-effect">Giảm ảnh hưởng tiêu cực của Mức Độ Nhiễm Độc.</p>
              </div>

              <div class="attr-box">
                <span class="attr-icon">⚡</span>
                <div class="attr-data">
                  <span class="attr-label">Linh Hoạt (Agility)</span>
                  <span class="attr-val">${op.attributes?.agility || 15}</span>
                </div>
                <p class="attr-effect">Gia tăng Sát Thương Phóng Tơ lên Trùm Thành Phố.</p>
              </div>
            </div>

            <h3 class="section-title" style="margin-top: 24px;">🎒 Trang Bị Đang Sử Dụng</h3>
            <div class="equipped-slots-grid">
              
              <div class="slot-item">
                <span class="slot-cat">BỘ GIÁP (SUIT)</span>
                <div class="slot-content">
                  ${equippedSuits.length > 0 ? `
                    <span class="slot-icon">${equippedSuits[0].icon}</span>
                    <span class="slot-name">${equippedSuits[0].name}</span>
                  ` : '<span class="slot-empty">Chưa trang bị</span>'}
                </div>
                <p class="slot-effect">${equippedSuits.length > 0 ? equippedSuits[0].mechanicalEffect : 'Chưa có hiệu ứng'}</p>
              </div>

              <div class="slot-item">
                <span class="slot-cat">THIẾT BỊ (GADGET)</span>
                <div class="slot-content">
                  ${equippedGadgets.length > 0 ? `
                    <span class="slot-icon">${equippedGadgets[0].icon}</span>
                    <span class="slot-name">${equippedGadgets[0].name}</span>
                  ` : '<span class="slot-empty">Chưa trang bị</span>'}
                </div>
                <p class="slot-effect">${equippedGadgets.length > 0 ? equippedGadgets[0].mechanicalEffect : 'Chưa có hiệu ứng'}</p>
              </div>

              <div class="slot-item">
                <span class="slot-cat">KỸ NĂNG (SKILL)</span>
                <div class="slot-content">
                  ${equippedSkills.length > 0 ? `
                    <span class="slot-icon">${equippedSkills[0].icon}</span>
                    <span class="slot-name">${equippedSkills[0].name}</span>
                  ` : '<span class="slot-empty">Chưa trang bị</span>'}
                </div>
                <p class="slot-effect">${equippedSkills.length > 0 ? equippedSkills[0].mechanicalEffect : 'Chưa có hiệu ứng'}</p>
              </div>

              <div class="slot-item">
                <span class="slot-cat">VI MẠCH (IMPLANT)</span>
                <div class="slot-content">
                  ${equippedImplants.length > 0 ? `
                    <span class="slot-icon">${equippedImplants[0].icon}</span>
                    <span class="slot-name">${equippedImplants[0].name}</span>
                  ` : '<span class="slot-empty">Chưa trang bị</span>'}
                </div>
                <p class="slot-effect">${equippedImplants.length > 0 ? equippedImplants[0].mechanicalEffect : 'Chưa có hiệu ứng'}</p>
              </div>

            </div>

          </div>

          <!-- Column 3: Training Protocols (Habits from Notion Snapshot) -->
          <div class="op-card op-habits-card">
            <h3 class="section-title">⚙️ Giao Thức Rèn Luyện Thói Quen (Notion Snapshot)</h3>
            <div class="habits-protocol-list">
              ${habits.map(h => `
                <div class="habit-protocol-item ${h.type === 'RESISTANCE' ? 'type-resistance' : 'type-good'}">
                  <div class="habit-header">
                    <span class="habit-name">${h.name}</span>
                    <span class="habit-priority">${h.notionPriority} Priority</span>
                  </div>
                  <p class="habit-desc">${h.description || h.outcome || 'Giao thức định hình thói quen.'}</p>
                  <div class="habit-mechanical-badge">
                    <span class="badge-icon">⚡</span> ${h.mechanicalEffect}
                  </div>
                  <div class="habit-meta-footer">
                    <span>Khung giờ: ${h.timeBlock}</span>
                    <a href="${h.sourceUrl}" target="_blank" class="habit-link">Notion Link ↗</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;

    this.container.classList.add('active');

    const closeBtn = this.container.querySelector('#btn-close-operative');
    if (closeBtn) closeBtn.addEventListener('click', () => stateStore.setView('world'));

    const backdrop = this.container.querySelector('.system-drawer-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => stateStore.setView('world'));
  }
}
