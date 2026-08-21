/* ==========================================================================
   V4 HERO VIEW (CHARACTER SHEET & TRAINING PROTOCOLS)
   Adult freelancer identity, meaningful attributes, real Daily condition check-in,
   and honest Training Protocols (Good & Resistance Habits, zero fake streaks).
   ========================================================================== */

import { stateStore } from '../core/StateStore.js';
import { eventBus } from '../core/EventBus.js';
import { EVENTS } from '../config/constants.js';
import { getIcon } from './icons.js';

export class HeroView {
  constructor(containerEl) {
    this.containerEl = containerEl;

    eventBus.on(EVENTS.STATE_CHANGED, () => {
      if (this.isCurrentRoute()) {
        this.render();
      }
    });
  }

  isCurrentRoute() {
    return window.location.hash === '#/hero';
  }

  render() {
    const state = stateStore.getState();
    const user = state.user;
    const habits = stateStore.getNotionHabits();
    const daily = stateStore.getNotionDaily();

    const goodHabits = habits.filter(h => h.type === 'GOOD');
    const resistanceHabits = habits.filter(h => h.type === 'RESISTANCE');

    this.containerEl.innerHTML = `
      <div class="hero-view-container">
        <!-- Section 1: Adult Freelancer Character Sheet -->
        <section class="character-sheet-card dossier-card accent-cyan">
          <figure class="hero-key-art">
            <img src="./assets/characters/web-operative-v1.png" alt="Original Web Operative freelancer character on a rainy city rooftop">
            <figcaption>
              <span class="telemetry-text text-cyan">WEB OPERATIVE // ORIGINAL KEY ART</span>
              <strong>URBAN FREELANCER LOADOUT</strong>
            </figcaption>
          </figure>

          <div class="hero-sheet-content">
          <div class="character-sheet-header">
            <div class="hero-avatar-large">
              ${getIcon('artPeter')}
            </div>

            <div class="hero-identity-box">
              <span class="telemetry-text text-cyan">OPERATIVE IDENTITY // ARCHTYPE</span>
              <h2 class="hero-name">${user.name}</h2>
              <span class="hero-handle">${user.handle} — ${user.title}</span>
              <p class="hero-philosophy" style="font-size: 0.84rem; margin-top: 4px; color: var(--color-ink-secondary);">
                "Identity-based habits: each repeated action reinforces the person the user wants to become."
              </p>
            </div>

            <div class="hero-rank-box">
              <span class="telemetry-text text-amber">OPERATIVE RANK</span>
              <div class="rank-number text-amber">${user.level}</div>
              <span class="tag-pill text-cyan">${user.xp} TOTAL XP</span>
            </div>
          </div>

          <!-- Operative Attributes Grid -->
          <div class="attributes-grid" style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
            <div class="stat-box dossier-card">
              <span class="stat-value text-cyan">${user.attributes.intelligence}</span>
              <span class="stat-label">INTELLIGENCE</span>
              <span class="stat-sub">Architecture & Systems</span>
            </div>

            <div class="stat-box dossier-card">
              <span class="stat-value text-amber">${user.attributes.focus}</span>
              <span class="stat-label">FOCUS</span>
              <span class="stat-sub">Deep Work Blocks</span>
            </div>

            <div class="stat-box dossier-card">
              <span class="stat-value text-red">${user.attributes.agility}</span>
              <span class="stat-label">AGILITY</span>
              <span class="stat-sub">Quick Response & Tasks</span>
            </div>

            <div class="stat-box dossier-card">
              <span class="stat-value text-success">${user.attributes.resilience}</span>
              <span class="stat-label">RESILIENCE</span>
              <span class="stat-sub">Habit Persistence</span>
            </div>
          </div>
          </div>
        </section>

        <!-- Section 2: Daily Operative Condition (Honest Notion Daily Record) -->
        <section class="daily-condition-card dossier-card accent-amber">
          <div class="daily-header-row">
            <div>
              <span class="telemetry-text text-amber">${getIcon('notion')} NOTION DAILY TELEMETRY // ${daily.date}</span>
              <h2>DAILY OPERATIVE CONDITION</h2>
            </div>
            <span class="status-badge ${daily.logged ? 'completed' : 'pending'}">
              ${daily.statusText}
            </span>
          </div>

          ${!daily.logged ? `
            <div class="unlogged-callout dossier-card accent-red" style="padding: 16px; margin-top: 12px; background: rgba(240, 43, 58, 0.08);">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                <div>
                  <h4 class="text-red" style="font-size: 0.95rem;">CHƯA CHECK-IN / TELEMETRY UNLOGGED</h4>
                  <p style="font-size: 0.84rem; color: var(--color-newsprint-bone); margin-top: 2px;">
                    No Mood, Energy, or Productivity logged in Notion Daily for today. Energy values are not fabricated.
                  </p>
                </div>
                <a href="${daily.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.8rem;">
                  ${getIcon('notion')} Check-in Daily in Notion
                </a>
              </div>
            </div>
          ` : `
            <div class="daily-stats-row" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px;">
              <div class="stat-box">
                <span class="stat-value text-cyan">${daily.mood}/10</span>
                <span class="stat-label">MOOD</span>
              </div>
              <div class="stat-box">
                <span class="stat-value text-amber">${daily.energy}/10</span>
                <span class="stat-label">ENERGY</span>
              </div>
              <div class="stat-box">
                <span class="stat-value text-success">${daily.productivity}/10</span>
                <span class="stat-label">PRODUCTIVITY</span>
              </div>
            </div>
          `}
        </section>

        <!-- Section 3: Training Protocols (Habits) -->
        <section class="training-protocols-section dossier-card">
          <div class="section-title-row">
            <div>
              <span class="telemetry-text text-cyan">HABIT SYSTEMS // TRAINING PROTOCOLS</span>
              <h2>IDENTITY-BASED TRAINING PROTOCOLS</h2>
              <p style="font-size: 0.82rem; color: var(--color-ink-muted);">Good habits build attributes; resistance protocols reduce boss threat & corruption.</p>
            </div>
          </div>

          <!-- Good Habits Grid -->
          <div style="margin-top: 16px; margin-bottom: 24px;">
            <h3 class="text-cyan" style="margin-bottom: 12px; font-size: 1rem;">
              ${getIcon('shield', 'text-cyan icon-inline')} GOOD HABITS (ATTRIBUTE BUILDERS)
            </h3>
            <div class="habits-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
              ${goodHabits.map(h => this.renderHabitCard(h)).join('')}
            </div>
          </div>

          <!-- Resistance Habits Grid -->
          <div>
            <h3 class="text-red" style="margin-bottom: 12px; font-size: 1rem;">
              ${getIcon('zap', 'text-red icon-inline')} RESISTANCE PROTOCOLS (CORRUPTION REDUCTION)
            </h3>
            <div class="habits-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
              ${resistanceHabits.map(h => this.renderHabitCard(h)).join('')}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  renderHabitCard(item) {
    const isBad = item.type === 'RESISTANCE';
    const outcomeText = item.outcome ? this.escapeHtml(item.outcome) : 'Chưa đặt kết quả';
    const descText = item.description ? this.escapeHtml(item.description) : 'Chưa có mô tả';
    const timeBlockText = item.timeBlock ? this.escapeHtml(item.timeBlock) : 'Chưa phân loại';

    return `
      <div class="dossier-card habit-card ${isBad ? 'accent-red' : 'accent-cyan'}">
        <div class="habit-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div>
            <span class="tag-pill ${isBad ? 'priority-high' : 'priority-medium'}">${item.category}</span>
            <h4 style="font-size: 1rem; margin-top: 4px; color: var(--color-newsprint-bone);">${this.escapeHtml(item.name)}</h4>
          </div>
          <span class="tag-pill">${timeBlockText}</span>
        </div>

        <div class="habit-card-body" style="font-size: 0.8rem; margin-bottom: 10px;">
          <div style="color: var(--color-newsprint-bone); font-weight: 500;">
            <strong>Target Outcome:</strong> ${outcomeText}
          </div>
          <div style="color: var(--color-ink-muted); margin-top: 2px;">
            ${descText}
          </div>
        </div>

        <!-- Honest Truth Flags -->
        <div class="honest-truth-row" style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: var(--border-hairline); font-size: 0.75rem; font-family: var(--font-telemetry);">
          <span class="text-muted">Today: <strong class="${item.todayCompleted ? 'text-success' : 'text-muted'}">${item.todayCompleted ? 'Done' : 'False'}</strong></span>
          <span class="text-muted">Streak: <strong class="text-muted">${item.streakCount}d (Honest)</strong></span>
          <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" class="tag-pill notion-link-pill">
            ${getIcon('notion')} Notion
          </a>
        </div>
      </div>
    `;
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  }
}
