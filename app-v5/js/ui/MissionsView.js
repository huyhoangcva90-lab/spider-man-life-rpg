/* ==========================================================================
   V5 MISSIONS VIEW
   Tactical Mission Board using spatial/list hybrid layout (Not a CRUD table)
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class MissionsView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.filterPriority = 'ALL';
    this.filterStatus = 'ALL';
    this.init();
  }

  init() {
    eventBus.on('VIEW_CHANGED', (viewName) => {
      if (viewName === 'missions') this.render();
      else this.close();
    });

    eventBus.on('STATE_UPDATED', () => {
      if (stateStore.getState().activeView === 'missions') this.render();
    });
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    const state = stateStore.getState();
    const missions = state.missions || [];

    // Filter missions
    const filtered = missions.filter(m => {
      if (this.filterPriority !== 'ALL' && m.priority !== this.filterPriority) return false;
      if (this.filterStatus !== 'ALL' && m.status !== this.filterStatus) return false;
      return true;
    });

    // Group by District
    const districtsMap = new Map();
    filtered.forEach(m => {
      const dName = m.districtName || 'Lõi Trung Tâm';
      if (!districtsMap.has(dName)) districtsMap.set(dName, []);
      districtsMap.get(dName).push(m);
    });

    this.container.innerHTML = `
      <div class="system-drawer-backdrop"></div>
      <div class="system-drawer-content">
        
        <div class="drawer-header">
          <div class="drawer-title-group">
            <span class="drawer-subtitle">BẢNG CHIẾN THUẬT TÁC CHIẾN ĐÔ THỊ</span>
            <h2 class="drawer-title">DANH SÁCH NHIỆM VỤ THỜI GIAN THỰC</h2>
          </div>
          <button class="drawer-close-btn" id="btn-close-missions">✕</button>
        </div>

        <!-- Tactical Filter Bar -->
        <div class="tactical-filter-bar">
          <div class="filter-group">
            <span class="filter-label">Độ Ưu Tiên:</span>
            <button class="btn-filter ${this.filterPriority === 'ALL' ? 'active' : ''}" data-prio="ALL">Tất cả</button>
            <button class="btn-filter ${this.filterPriority === 'HIGH' ? 'active' : ''}" data-prio="HIGH">Mức Cao (High)</button>
            <button class="btn-filter ${this.filterPriority === 'MEDIUM' ? 'active' : ''}" data-prio="MEDIUM">Trung Bình</button>
            <button class="btn-filter ${this.filterPriority === 'LOW' ? 'active' : ''}" data-prio="LOW">Thấp</button>
          </div>

          <div class="filter-group">
            <span class="filter-label">Trạng Thái:</span>
            <button class="btn-filter ${this.filterStatus === 'ALL' ? 'active' : ''}" data-status="ALL">Tất cả</button>
            <button class="btn-filter ${this.filterStatus === 'PENDING' ? 'active' : ''}" data-status="PENDING">Chờ Xử Lý</button>
            <button class="btn-filter ${this.filterStatus === 'COMPLETED' ? 'active' : ''}" data-status="COMPLETED">Đã Hoàn Thành</button>
          </div>
        </div>

        <!-- Spatial / Node-List Hybrid Grid -->
        <div class="missions-spatial-grid">
          ${Array.from(districtsMap.entries()).map(([districtName, distMissions]) => `
            <div class="district-mission-group">
              <div class="district-group-header">
                <span class="dist-icon">🌆</span>
                <h3 class="dist-title">${districtName}</h3>
                <span class="dist-count">${distMissions.length} Tín Hiệu Nhiệm Vụ</span>
              </div>

              <div class="district-cards-grid">
                ${distMissions.map(m => {
                  const isDone = m.status === 'COMPLETED';
                  const priorityColor = m.priority === 'HIGH' ? '#F43F5E' : (m.priority === 'MEDIUM' ? '#F5B942' : '#22D3EE');

                  return `
                    <div class="tactical-mission-card ${isDone ? 'completed' : 'pending'}" style="border-left-color: ${priorityColor};">
                      <div class="card-top-row">
                        <span class="prio-tag" style="background-color: ${priorityColor}22; color: ${priorityColor};">${m.priority}</span>
                        <span class="notion-db-tag">${m.sourceDatabase}</span>
                      </div>

                      <h4 class="card-mission-title">${m.title}</h4>
                      <p class="card-mission-reason">${m.reason}</p>

                      <div class="card-reward-preview">
                        <span>⚡ +${m.rewardXp} XP</span>
                        <span>🪙 +${m.rewardGold} Gold</span>
                        <span>👾 -${m.baseBossDamage} HP Trùm</span>
                      </div>

                      <div class="card-actions-row">
                        <a href="${m.sourceUrl}" target="_blank" class="card-notion-link">Notion ↗</a>
                        
                        ${!isDone ? `
                          <button class="btn-card-briefing" data-id="${m.id}">Mở Briefing 📋</button>
                          <button class="btn-card-start" data-id="${m.id}">Bắt đầu ⏱️</button>
                        ` : `
                          <span class="done-tag">✓ Đã Hoàn Thành</span>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.classList.add('active');

    // Attach filter listeners
    this.container.querySelectorAll('.btn-filter[data-prio]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterPriority = btn.getAttribute('data-prio');
        this.render();
      });
    });

    this.container.querySelectorAll('.btn-filter[data-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterStatus = btn.getAttribute('data-status');
        this.render();
      });
    });

    // Attach card action listeners
    this.container.querySelectorAll('.btn-card-briefing').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        stateStore.selectMission(id);
      });
    });

    this.container.querySelectorAll('.btn-card-start').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        stateStore.selectMission(id);
        const m = stateStore.getSelectedMission();
        if (m) stateStore.startFocus(m.id, m.estimatedMinutes);
      });
    });

    const closeBtn = this.container.querySelector('#btn-close-missions');
    if (closeBtn) closeBtn.addEventListener('click', () => stateStore.setView('world'));

    const backdrop = this.container.querySelector('.system-drawer-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => stateStore.setView('world'));
  }
}
