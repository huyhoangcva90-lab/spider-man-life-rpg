/* ==========================================================================
   V5 CHRONICLE VIEW
   Story Arcs (Notion Goals), Campaigns (Projects) & Completed Mission History
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class ChronicleView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    eventBus.on('VIEW_CHANGED', (viewName) => {
      if (viewName === 'chronicle') this.render();
      else this.close();
    });

    eventBus.on('STATE_UPDATED', () => {
      if (stateStore.getState().activeView === 'chronicle') this.render();
    });
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    const state = stateStore.getState();
    const goals = state.goals || [];
    const projects = state.projects || [];
    const missions = state.missions || [];
    const completedMissions = missions.filter(m => m.status === 'COMPLETED');

    this.container.innerHTML = `
      <div class="system-drawer-backdrop"></div>
      <div class="system-drawer-content">
        
        <div class="drawer-header">
          <div class="drawer-title-group">
            <span class="drawer-subtitle">LỊCH SỬ TÁC CHIẾN & CỘT MỐC ĐỜI SỐNG</span>
            <h2 class="drawer-title">SỬ KÝ THÀNH PHỐ (CHRONICLE & ARCS)</h2>
          </div>
          <button class="drawer-close-btn" id="btn-close-chronicle">✕</button>
        </div>

        <div class="chronicle-sections-layout">
          
          <!-- Section 1: Story Arcs (Notion Goals) -->
          <div class="chronicle-block">
            <h3 class="block-title">📜 Đại Chương Chiến Lược (Story Arcs - Notion Goals)</h3>
            <div class="story-arcs-grid">
              ${goals.map(g => `
                <div class="story-arc-card ${g.achieved ? 'achieved' : 'active'}">
                  <div class="arc-header">
                    <span class="arc-type-tag">${g.storyArcType}</span>
                    <span class="arc-status">${g.achieved ? '✓ Đã Đạt Được' : '🔥 Đang Thực Hiện'}</span>
                  </div>
                  <h4 class="arc-title">${g.title}</h4>
                  <p class="arc-area">Lĩnh vực mục tiêu: <strong>${g.targetArea}</strong></p>
                  <div class="arc-footer">
                    <span>Ngày bắt đầu: ${g.startDate}</span>
                    <a href="${g.sourceUrl}" target="_blank" class="arc-link">Notion Link ↗</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section 2: Campaigns (Notion Projects) -->
          <div class="chronicle-block">
            <h3 class="block-title">🚀 Chiến Dịch Hành Động (Campaigns - Notion Projects)</h3>
            <div class="campaigns-grid">
              ${projects.map(p => `
                <div class="campaign-card">
                  <div class="campaign-header">
                    <span class="campaign-title">${p.title}</span>
                    <span class="campaign-status">${p.status}</span>
                  </div>
                  <p class="campaign-note">${p.note}</p>
                  <a href="${p.sourceUrl}" target="_blank" class="campaign-link">Notion Link ↗</a>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section 3: Completed Mission History Log -->
          <div class="chronicle-block">
            <h3 class="block-title">🏆 Nhật Ký Nhiệm Vụ Đã Hoàn Thành (${completedMissions.length})</h3>
            ${completedMissions.length === 0 ? `
              <p class="empty-history-text">Chưa có nhiệm vụ nào hoàn thành. Hãy chọn một tín hiệu nhiệm vụ trên bản đồ để bắt đầu!</p>
            ` : `
              <div class="completed-history-list">
                ${completedMissions.map(cm => `
                  <div class="history-item">
                    <span class="history-icon">✓</span>
                    <div class="history-content">
                      <h4 class="history-title">${cm.title}</h4>
                      <p class="history-sub">${cm.districtName} | +${cm.rewardXp} XP | +${cm.rewardGold} Gold</p>
                    </div>
                    <span class="history-time">${new Date(cm.completedAt || Date.now()).toLocaleTimeString('vi-VN')}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>

      </div>
    `;

    this.container.classList.add('active');

    const closeBtn = this.container.querySelector('#btn-close-chronicle');
    if (closeBtn) closeBtn.addEventListener('click', () => stateStore.setView('world'));

    const backdrop = this.container.querySelector('.system-drawer-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => stateStore.setView('world'));
  }
}
