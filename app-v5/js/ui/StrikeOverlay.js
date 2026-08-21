/* ==========================================================================
   V5 STRIKE OVERLAY
   Web strike completion sequence, threat boss damage flash & reward tally modal
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class StrikeOverlay {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    eventBus.on('VIEW_CHANGED', (viewName) => {
      if (viewName === 'strike') this.render();
      else this.close();
    });
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    const state = stateStore.getState();
    const strike = state.lastStrikeResult;

    if (!strike) {
      this.close();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.container.innerHTML = `
      <div class="strike-fullscreen-wrapper">
        
        <!-- Web Strike Burst FX -->
        <div class="web-strike-canvas ${prefersReducedMotion ? 'reduced-motion' : 'animating'}">
          <div class="strike-beam line-1"></div>
          <div class="strike-beam line-2"></div>
          <div class="strike-beam line-3"></div>
        </div>

        <div class="strike-reward-modal">
          
          <div class="strike-header">
            <span class="strike-badge">⚡ ĐÃ PHÓNG TƠ THÀNH CÔNG</span>
            <h2 class="strike-mission-title">${strike.missionTitle}</h2>
            <p class="strike-district-subtitle">Đã thanh tẩy & bảo vệ: <strong>${strike.districtName}</strong></p>
          </div>

          <!-- Boss Damage Flash Banner -->
          <div class="strike-boss-damage-banner">
            <span class="boss-icon">👾</span>
            <div class="boss-damage-info">
              <span class="damage-val">-${strike.bossDamageApplied} HP SÁT THƯƠNG TRÙM!</span>
              <span class="damage-sub">Mức độ nhiễm độc giảm còn ${strike.corruptionPct}% (${strike.remainingBossHp} HP còn lại)</span>
            </div>
          </div>

          ${strike.leveledUp ? `
            <div class="level-up-banner">
              <span class="level-icon">🎉</span>
              <div class="level-text">
                <h3>THĂNG CẤP ĐẶC VỤ!</h3>
                <p>Chúc mừng! Bạn đã đạt Level <strong>${strike.newLevel}</strong>!</p>
              </div>
            </div>
          ` : ''}

          <!-- Reward Tally List -->
          <div class="strike-tally-grid">
            <div class="tally-card">
              <span class="tally-icon">⚡</span>
              <span class="tally-val">+${strike.xpAwarded} XP</span>
              <span class="tally-label">Kinh Nghiệm</span>
            </div>
            <div class="tally-card">
              <span class="tally-icon">🪙</span>
              <span class="tally-val">+${strike.goldAwarded} Gold</span>
              <span class="tally-label">Thu Nhập</span>
            </div>
            <div class="tally-card">
              <span class="tally-icon">🧠</span>
              <span class="tally-val">+2 Chỉ Số</span>
              <span class="tally-label">Tăng Trưởng</span>
            </div>
          </div>

          <!-- Action Button -->
          <div class="strike-actions">
            <button class="btn-primary btn-return-city" id="btn-return-city">
              <span>🏙️ Trở Về Bản Đồ Thành Phố</span>
            </button>
          </div>

        </div>

      </div>
    `;

    this.container.classList.add('active');

    const returnBtn = this.container.querySelector('#btn-return-city');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        stateStore.setView('world');
      });
    }
  }
}
