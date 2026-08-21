/* ==========================================================================
   V4 SHELL VIEW (5-DESTINATION GAME NAVIGATION & SYSTEM TELEMETRY DOCK)
   Zero emoji policy, consistent SVG icons, 5-destination mobile dock.
   ========================================================================== */

import { NAV_ITEMS, EVENTS } from '../config/constants.js';
import { stateStore } from '../core/StateStore.js';
import { eventBus } from '../core/EventBus.js';
import { getIcon } from './icons.js';
import { RewardCalculator } from '../engine/RewardCalculator.js';

export class ShellView {
  constructor(rootEl) {
    this.rootEl = rootEl;
  }

  /**
   * Render App Shell frame
   */
  render() {
    const state = stateStore.getState();
    const user = state.user;
    const currentRoute = window.location.hash || '#/world';

    // Calculate XP progress percentage for topbar progress bar
    const currentLevelThreshold = RewardCalculator.getXpThresholdForLevel(user.level);
    const nextLevelThreshold = RewardCalculator.getXpThresholdForLevel(user.level + 1);
    const levelXpNeeded = Math.max(1, nextLevelThreshold - currentLevelThreshold);
    const currentLevelProgress = Math.max(0, user.xp - currentLevelThreshold);
    const xpPercent = Math.min(100, Math.round((currentLevelProgress / levelXpNeeded) * 100));

    this.rootEl.innerHTML = `
      <div class="app-shell">
        <!-- Sticky Top Telemetry Bar (Slim Mobile-First HUD) -->
        <header class="telemetry-bar" id="telemetry-bar">
          <div class="telemetry-group desktop-only-telemetry">
            <span class="telemetry-chip">
              <span class="telemetry-pulse"></span>
              <span class="text-cyan">SYS://ONLINE</span>
            </span>
            <span class="telemetry-chip" id="clock-display">
              00:00:00
            </span>
          </div>

          <!-- Mobile & Desktop Operative Slim HUD -->
          <div class="telemetry-hud-group">
            <div class="hud-avatar-chip">
              <span class="hud-avatar-icon">${getIcon('artPeter')}</span>
              <span class="hud-level-badge">LVL <strong class="text-cyan" id="topbar-level">${user.level}</strong></span>
            </div>

            <div class="hud-xp-box" title="XP Progress to Level ${user.level + 1}">
              <div class="hud-xp-label">
                <span>XP</span>
                <strong id="topbar-xp">${user.xp}</strong>
              </div>
              <div class="hud-xp-track">
                <div class="hud-xp-fill" id="topbar-xp-fill" style="width: ${xpPercent}%;"></div>
              </div>
            </div>

            <span class="telemetry-chip gold-chip" title="Reward Gold">
              ${getIcon('coin', 'icon-inline text-gold')} <strong class="text-gold" id="topbar-gold">${user.gold}</strong>
            </span>

            <span class="telemetry-chip desktop-only-chip" title="Active Streak">
              ${getIcon('flame', 'icon-inline text-red')} <strong class="text-red" id="topbar-streak">${user.streakDays}d</strong>
            </span>
          </div>
        </header>

        <!-- Desktop Tactical Rail Sidebar (200px) -->
        <aside class="tactical-rail">
          <div class="rail-brand">
            <div class="rail-brand-logo">V4</div>
            <div class="rail-brand-text">
              <span class="rail-brand-title">ANTIGRAVITY</span>
              <span class="rail-brand-sub">NOTION GAME-FIRST</span>
            </div>
          </div>

          <nav class="rail-nav" id="rail-nav" aria-label="Main Navigation">
            ${NAV_ITEMS.map(item => `
              <a href="${item.route}" class="rail-item ${currentRoute === item.route ? 'active' : ''}" data-route="${item.route}">
                <span class="rail-item-icon">${getIcon(item.icon)}</span>
                <span>${item.label}</span>
              </a>
            `).join('')}
          </nav>

          <div class="rail-footer">
            <div class="operative-card">
              <div class="operative-avatar">${getIcon('artPeter')}</div>
              <div class="operative-info">
                <span class="operative-name">${user.name}</span>
                <span class="operative-status"><span class="status-pulse-dot"></span> NOTION SNAPSHOT</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Workspace Container -->
        <main class="app-content-container" id="app-content">
          <!-- Dynamic Views render here -->
        </main>

        <!-- Mobile Bottom Tactical Dock (< 1024px) - EXACTLY 5 DESTINATIONS -->
        <nav class="mobile-dock" id="mobile-dock" aria-label="Mobile Bottom Dock">
          ${NAV_ITEMS.map(item => `
            <a href="${item.route}" class="dock-item ${currentRoute === item.route ? 'active' : ''}" data-route="${item.route}">
              <span class="dock-item-icon">${getIcon(item.icon)}</span>
              <span>${item.label}</span>
            </a>
          `).join('')}
        </nav>
      </div>
    `;

    this.bindEvents();
    this.startClock();
    this.updateTelemetryHeader();
  }

  bindEvents() {
    eventBus.on(EVENTS.STATE_CHANGED, () => this.updateTelemetryHeader());
    eventBus.on(EVENTS.FOCUS_TICK, (session) => this.updateFocusClockChip(session));

    window.addEventListener('hashchange', () => {
      this.updateActiveNavLinks(window.location.hash || '#/world');
    });
  }

  updateActiveNavLinks(currentRoute) {
    document.querySelectorAll('.rail-item, .dock-item').forEach(el => {
      const route = el.getAttribute('data-route');
      const isMatch = route === currentRoute || ((currentRoute === '' || currentRoute === '#/' || currentRoute === '#/command') && route === '#/world');
      if (isMatch) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  updateTelemetryHeader() {
    const state = stateStore.getState();
    const user = state.user;

    const lvlEl = document.getElementById('topbar-level');
    const xpEl = document.getElementById('topbar-xp');
    const xpFillEl = document.getElementById('topbar-xp-fill');
    const goldEl = document.getElementById('topbar-gold');
    const streakEl = document.getElementById('topbar-streak');

    if (lvlEl) lvlEl.textContent = user.level;
    if (xpEl) xpEl.textContent = user.xp;
    if (goldEl) goldEl.textContent = user.gold;
    if (streakEl) streakEl.textContent = `${user.streakDays}d`;

    if (xpFillEl) {
      const currentLevelThreshold = RewardCalculator.getXpThresholdForLevel(user.level);
      const nextLevelThreshold = RewardCalculator.getXpThresholdForLevel(user.level + 1);
      const levelXpNeeded = Math.max(1, nextLevelThreshold - currentLevelThreshold);
      const currentLevelProgress = Math.max(0, user.xp - currentLevelThreshold);
      const xpPercent = Math.min(100, Math.round((currentLevelProgress / levelXpNeeded) * 100));
      xpFillEl.style.width = `${xpPercent}%`;
    }
  }

  updateFocusClockChip(session) {
    const clockDisplay = document.getElementById('clock-display');
    if (!clockDisplay) return;

    if (session && session.active) {
      const mins = String(Math.floor(session.secondsRemaining / 60)).padStart(2, '0');
      const secs = String(session.secondsRemaining % 60).padStart(2, '0');
      clockDisplay.innerHTML = `${getIcon('target', 'text-cyan icon-inline')} <span class="text-cyan">${mins}:${secs}</span>`;
    } else {
      this.renderStandardTime(clockDisplay);
    }
  }

  startClock() {
    const updateTime = () => {
      const state = stateStore.getState();
      if (!state.focusSession || !state.focusSession.active) {
        const clockDisplay = document.getElementById('clock-display');
        if (clockDisplay) this.renderStandardTime(clockDisplay);
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  renderStandardTime(el) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    el.textContent = timeStr;
  }
}
