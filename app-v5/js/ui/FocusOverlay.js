/* ==========================================================================
   V5 FOCUS OVERLAY
   Fullscreen cinematic focus view with countdown timer, pause/resume & abandon
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';
import { FocusManager } from '../game/FocusManager.js';

export class FocusOverlay {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.showAbandonModal = false;
    this.init();
  }

  init() {
    eventBus.on('VIEW_CHANGED', (viewName) => {
      if (viewName === 'focus') this.render();
      else this.close();
    });

    eventBus.on('FOCUS_TICK', () => {
      if (stateStore.getState().activeView === 'focus') {
        this.updateTimerDisplay();
      }
    });

    eventBus.on('FOCUS_PAUSED', () => {
      if (stateStore.getState().activeView === 'focus') {
        this.render();
      }
    });
  }

  close() {
    this.container.classList.remove('active');
    this.showAbandonModal = false;
  }

  updateTimerDisplay() {
    const state = stateStore.getState();
    const session = state.focusSession;
    const timeElem = this.container.querySelector('.focus-timer-digits');
    if (timeElem && session) {
      timeElem.textContent = FocusManager.formatTime(session.secondsRemaining);
    }
  }

  render() {
    const state = stateStore.getState();
    const session = state.focusSession;
    const mission = stateStore.getSelectedMission();

    if (!session || !session.active || !mission) {
      this.close();
      return;
    }

    const timeFormatted = FocusManager.formatTime(session.secondsRemaining);
    const isPaused = session.isPaused;

    this.container.innerHTML = `
      <div class="focus-fullscreen-bg">
        
        <!-- Ambient Atmospheric Glow Particles -->
        <div class="focus-pulse-ring ${isPaused ? 'paused' : 'animating'}"></div>

        <div class="focus-header">
          <div class="focus-badge">MODE TẬP TRUNG TÁC CHIẾN</div>
          <h1 class="focus-mission-title">${mission.title}</h1>
          <p class="focus-district-label">Khu vực: ${mission.districtName}</p>
        </div>

        <!-- Big Cinematic Timer Display -->
        <div class="focus-timer-container">
          <div class="focus-timer-digits">${timeFormatted}</div>
          <div class="focus-status-text">${isPaused ? '⏸️ ĐÃ TẠM DỪNG TẬP TRUNG' : '⚡ ĐANG TẬP TRUNG CAO ĐỘ'}</div>
        </div>

        <!-- Control Buttons -->
        <div class="focus-controls">
          <button class="btn-focus-action btn-pause" id="btn-toggle-pause">
            <span>${isPaused ? '▶️ Tiếp Tục' : '⏸️ Tạm Dừng'}</span>
          </button>

          <button class="btn-focus-action btn-complete" id="btn-complete-focus">
            <span>⚡ Hoàn Thành Nhiệm Vụ</span>
          </button>

          <button class="btn-focus-action btn-abandon" id="btn-request-abandon">
            <span>🚫 Hủy Tác Chiến</span>
          </button>
        </div>

        <!-- Abandon Confirmation Modal Overlay -->
        ${this.showAbandonModal ? `
          <div class="abandon-modal-overlay">
            <div class="abandon-modal-card">
              <h3>🚫 BẠN MUỐN HỦY PHIÊN TẬP TRUNG?</h3>
              <p>Hủy bỏ giữa chừng sẽ làm mất dữ liệu tiến trình phiên tập trung này. Bạn có chắc chắn muốn rời đi?</p>
              <div class="abandon-modal-btns">
                <button class="btn-modal-cancel" id="btn-confirm-cancel-abandon">Không, tiếp tục</button>
                <button class="btn-modal-confirm" id="btn-confirm-abandon">Xác nhận Hủy</button>
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    this.container.classList.add('active');

    // Attach button listeners
    const pauseBtn = this.container.querySelector('#btn-toggle-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => stateStore.pauseFocus());
    }

    const completeBtn = this.container.querySelector('#btn-complete-focus');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => stateStore.completeMission(mission.id));
    }

    const requestAbandonBtn = this.container.querySelector('#btn-request-abandon');
    if (requestAbandonBtn) {
      requestAbandonBtn.addEventListener('click', () => {
        this.showAbandonModal = true;
        this.render();
      });
    }

    const cancelAbandonBtn = this.container.querySelector('#btn-confirm-cancel-abandon');
    if (cancelAbandonBtn) {
      cancelAbandonBtn.addEventListener('click', () => {
        this.showAbandonModal = false;
        this.render();
      });
    }

    const confirmAbandonBtn = this.container.querySelector('#btn-confirm-abandon');
    if (confirmAbandonBtn) {
      confirmAbandonBtn.addEventListener('click', () => stateStore.abandonFocus());
    }
  }
}
