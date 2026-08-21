/* ==========================================================================
   V5 BRIEFING DRAWER
   In-world tactical briefing drawer/bottom-sheet with real Notion data & actions
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class BriefingDrawer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    eventBus.on('VIEW_CHANGED', (viewName) => {
      if (viewName === 'briefing') this.render();
      else this.close();
    });

    eventBus.on('MISSION_SELECTED', (missionId) => {
      if (missionId) this.render();
    });
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    const mission = stateStore.getSelectedMission();
    if (!mission) {
      this.close();
      return;
    }

    const isCompleted = mission.status === 'COMPLETED';
    const priorityColor = mission.priority === 'HIGH' ? '#F43F5E' : (mission.priority === 'MEDIUM' ? '#F5B942' : '#22D3EE');

    this.container.innerHTML = `
      <div class="briefing-backdrop"></div>
      <div class="briefing-content-sheet">
        
        <div class="briefing-handle"></div>

        <div class="briefing-header">
          <div class="briefing-tag-row">
            <span class="briefing-district-tag" style="border-color: ${priorityColor}; color: ${priorityColor};">${mission.districtName}</span>
            <span class="briefing-priority-tag priority-${mission.priority.toLowerCase()}">${mission.priority} PRIORITY</span>
            <span class="notion-source-pill">Snapshot Notion (${mission.sourceDatabase})</span>
          </div>
          <button class="briefing-close-btn" id="btn-close-briefing">✕</button>
        </div>

        <h2 class="briefing-title">${mission.title}</h2>
        <p class="briefing-reason">${mission.reason}</p>

        <!-- Provenance & Notion Source Metadata -->
        <div class="briefing-notion-meta">
          <div class="meta-row">
            <span class="meta-label">Bảng Notion nguồn:</span>
            <span class="meta-val">${mission.sourceDatabase}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Dự án (Campaign):</span>
            <span class="meta-val">${mission.campaign || 'Chưa phân loại'}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Hạn chót Notion:</span>
            <span class="meta-val">${mission.notionDate ? new Date(mission.notionDate).toLocaleDateString('vi-VN') : 'Không có'}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Trạng thái Notion:</span>
            <span class="meta-val">${mission.notionStatus}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Thời lượng tập trung:</span>
            <span class="meta-val">${mission.estimatedMinutes} Phút</span>
          </div>
        </div>

        <!-- Predicted Mission Rewards -->
        <div class="briefing-rewards-grid">
          <div class="reward-card">
            <span class="reward-icon">⚡</span>
            <div class="reward-info">
              <span class="reward-val">+${mission.rewardXp} XP</span>
              <span class="reward-sub">Kinh nghiệm Đặc vụ</span>
            </div>
          </div>
          <div class="reward-card">
            <span class="reward-icon">🪙</span>
            <div class="reward-info">
              <span class="reward-val">+${mission.rewardGold} Gold</span>
              <span class="reward-sub">Tài chính Đô thị</span>
            </div>
          </div>
          <div class="reward-card">
            <span class="reward-icon">⚔️</span>
            <div class="reward-info">
              <span class="reward-val">-${mission.baseBossDamage} HP</span>
              <span class="reward-sub">Sát thương Trùm</span>
            </div>
          </div>
          <div class="reward-card">
            <span class="reward-icon">🧠</span>
            <div class="reward-info">
              <span class="reward-val">+2 ${mission.attributeGain?.name || 'Tập Trung'}</span>
              <span class="reward-sub">Chỉ số Đặc vụ</span>
            </div>
          </div>
        </div>

        <!-- Direct Notion Link & Action Buttons -->
        <div class="briefing-actions">
          
          <a href="${mission.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn-notion-link">
            <span>🔗 Mở bản ghi gốc trên Notion</span>
          </a>

          ${!isCompleted ? `
            <button class="btn-primary btn-start-focus" id="btn-start-focus">
              <span>⏱️ Bắt đầu nhiệm vụ (${mission.estimatedMinutes}p Focus)</span>
            </button>
            <button class="btn-secondary btn-instant-complete" id="btn-instant-complete">
              <span>⚡ Hoàn thành nhiệm vụ</span>
            </button>
          ` : `
            <div class="completed-banner">
              <span>✓ Nhiệm vụ đã hoàn thành & Thanh tẩy khu vực này!</span>
            </div>
          `}
        </div>

      </div>
    `;

    this.container.classList.add('active');

    // Event listeners
    const closeBtn = this.container.querySelector('#btn-close-briefing');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        stateStore.setView('world');
      });
    }

    const backdrop = this.container.querySelector('.briefing-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        stateStore.setView('world');
      });
    }

    const startBtn = this.container.querySelector('#btn-start-focus');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        stateStore.startFocus(mission.id, mission.estimatedMinutes);
      });
    }

    const completeBtn = this.container.querySelector('#btn-instant-complete');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        stateStore.completeMission(mission.id);
      });
    }
  }
}
