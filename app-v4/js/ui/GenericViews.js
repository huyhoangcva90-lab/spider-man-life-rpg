/* ==========================================================================
   V4 SUB-VIEWS (CAMPAIGNS, BUILD, ARCHIVE & REVIEW)
   Zero emoji policy, consistent SVG icons
   ========================================================================== */

import { stateStore } from '../core/StateStore.js';
import { getIcon } from './icons.js';

export class CampaignsView {
  constructor(containerEl) {
    this.containerEl = containerEl;
  }

  render() {
    const state = stateStore.getState();
    const campaigns = state.campaigns || [];
    const actions = state.actions || [];

    this.containerEl.innerHTML = `
      <div class="campaigns-view">
        <div style="margin-bottom: 24px;">
          <h2>CAMPAIGN OPERATIVE BOARDS</h2>
          <p style="color: var(--color-ink-muted);">Overview of strategic client and business projects.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          ${campaigns.map(cmp => {
            const cmpActions = actions.filter(a => a.campaign === cmp.title);
            const completed = cmpActions.filter(a => a.status === 'COMPLETED').length;
            const total = cmpActions.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return `
              <div class="dossier-card accent-cyan">
                <div class="dossier-card-header">
                  <div>
                    <span class="telemetry-text text-cyan">ACTIVE CAMPAIGN (${cmp.domain || 'Engineering'})</span>
                    <h3 class="dossier-card-title">${cmp.title}</h3>
                  </div>
                  <span class="status-badge pending">${total} Objectives</span>
                </div>
                
                <div class="dossier-card-body">
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 4px; font-family: var(--font-telemetry);">
                    <span>PROGRESS</span>
                    <span>${pct}% (${completed}/${total})</span>
                  </div>
                  <div class="meter-bar-track" style="width: 100%;">
                    <div class="meter-bar-fill" style="width: ${pct}%; background-color: var(--color-spider-cyan);"></div>
                  </div>
                </div>

                <div class="dossier-card-footer">
                  <span class="tag-pill">Target: Q3/Q4</span>
                  <a href="#/command" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.78rem;">View Objectives</a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

export class BuildView {
  constructor(containerEl) {
    this.containerEl = containerEl;
  }

  render() {
    this.containerEl.innerHTML = `
      <div class="build-view">
        <div style="margin-bottom: 24px;">
          <h2>BUILD & DEPLOYMENT MATRIX</h2>
          <p style="color: var(--color-ink-muted);">Deep focus blocks, tech stack tools & code output tracking.</p>
        </div>

        <div class="dossier-card accent-gold">
          <h3 style="margin-bottom: 12px;">${getIcon('matrix', 'text-gold icon-inline')} DEEP WORK ENGINE ACTIVE</h3>
          <p style="color: var(--color-ink-secondary); margin-bottom: 16px;">
            Construct custom project templates, trigger focus pomodoro timers, and connect development workflows.
          </p>
          <div class="stats-grid" style="max-width: 480px;">
            <div class="stat-box">
              <span class="stat-value text-cyan">25 MIN</span>
              <span class="stat-label">FOCUS INTERVAL</span>
            </div>
            <div class="stat-box">
              <span class="stat-value text-gold">ES MODULES</span>
              <span class="stat-label">V4 ENGINE</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export class ArchiveView {
  constructor(containerEl) {
    this.containerEl = containerEl;
  }

  render() {
    const state = stateStore.getState();
    const completedActions = (state.actions || []).filter(a => a.status === 'COMPLETED');

    this.containerEl.innerHTML = `
      <div class="archive-view">
        <div style="margin-bottom: 24px;">
          <h2>ARCHIVED DOSSIERS</h2>
          <p style="color: var(--color-ink-muted);">Historical log of completed missions and deliverables.</p>
        </div>

        <div class="actions-list">
          ${completedActions.length === 0 ? `
            <div class="empty-state">
              <p>No completed dossiers archived yet.</p>
            </div>
          ` : completedActions.map(action => `
            <div class="action-item-card completed">
              <div class="checkbox-btn" style="background: var(--color-success-green); border-color: var(--color-success-green); color: #0b1320;">
                ${getIcon('check')}
              </div>
              <div class="action-main-info">
                <span class="action-title" style="text-decoration: line-through; color: var(--color-ink-muted);">${action.title}</span>
                <span style="font-size: 0.75rem; color: var(--color-ink-muted); font-family: var(--font-telemetry);">
                  Completed: ${action.completedAt ? new Date(action.completedAt).toLocaleString() : 'Recently'}
                </span>
              </div>
              <div class="action-controls">
                <span class="tag-pill text-gold">+${action.rewardXp} XP</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

export class ReviewView {
  constructor(containerEl) {
    this.containerEl = containerEl;
  }

  render() {
    const state = stateStore.getState();
    const user = state.user || {};
    const attributes = user.attributes || { intelligence: 16, focus: 14, agility: 18, resilience: 12 };

    this.containerEl.innerHTML = `
      <div class="review-view">
        <div style="margin-bottom: 24px;">
          <h2>OPERATIVE PERFORMANCE REVIEW</h2>
          <p style="color: var(--color-ink-muted);">Weekly telemetry metrics, streak analysis & attribute progression.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="widget-panel">
            <div class="widget-title">STREAK TELEMETRY</div>
            <div class="stat-value text-red" style="font-size: 2.5rem; margin-bottom: 8px;">
              ${getIcon('flame', 'text-red icon-inline')} ${user.streakDays} DAYS
            </div>
            <p style="font-size: 0.85rem; color: var(--color-ink-muted);">Consecutive active daily freelancer focus sessions.</p>
          </div>

          <div class="widget-panel">
            <div class="widget-title">OPERATIVE ATTRIBUTES</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="stat-box">
                <span class="stat-value text-cyan">${attributes.intelligence}</span>
                <span class="stat-label">INTELLIGENCE</span>
              </div>
              <div class="stat-box">
                <span class="stat-value text-gold">${attributes.focus}</span>
                <span class="stat-label">FOCUS</span>
              </div>
              <div class="stat-box">
                <span class="stat-value text-red">${attributes.agility}</span>
                <span class="stat-label">AGILITY</span>
              </div>
              <div class="stat-box">
                <span class="stat-value text-success">${attributes.resilience}</span>
                <span class="stat-label">RESILIENCE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
