/* ==========================================================================
   V5 FOCUS MANAGER
   Focus mode countdown manager with tick interval, pause/resume & abandon logic
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class FocusManager {
  constructor() {
    this.timerId = null;
    this.init();
  }

  init() {
    eventBus.on('FOCUS_STARTED', () => this.startTimer());
    eventBus.on('FOCUS_PAUSED', (isPaused) => {
      if (isPaused) this.stopTimer();
      else this.startTimer();
    });
    eventBus.on('FOCUS_ABANDONED', () => this.stopTimer());
    eventBus.on('MISSION_COMPLETED', () => this.stopTimer());
  }

  startTimer() {
    this.stopTimer();
    this.timerId = setInterval(() => {
      stateStore.tickFocus();
    }, 1000);
  }

  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

export const focusManager = new FocusManager();
