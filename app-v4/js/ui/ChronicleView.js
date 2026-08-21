/* ==========================================================================
   V4 CHRONICLE VIEW (NOTION GOALS, CAMPAIGN PROJECTS & LEDGER)
   Maps Notion Goal -> Story Arc, Project -> Campaign, Area -> City District.
   Preserves incomplete/unclassified relationships honestly, and provides ledger.
   ========================================================================== */

import { stateStore } from '../core/StateStore.js';
import { eventBus } from '../core/EventBus.js';
import { EVENTS } from '../config/constants.js';
import { getIcon } from './icons.js';

export class ChronicleView {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.activeSubTab = 'STORIES'; // 'STORIES' | 'PROJECTS' | 'DISTRICTS' | 'LEDGER'

    eventBus.on(EVENTS.STATE_CHANGED, () => {
      if (this.isCurrentRoute()) {
        this.render();
      }
    });
  }

  isCurrentRoute() {
    return window.location.hash === '#/chronicle';
  }

  render() {
    const state = stateStore.getState();
    const goals = stateStore.getNotionGoals();
    const projects = stateStore.getNotionProjects();
    const ledger = state.ledger || [];
    const activityLog = state.activityLog || [];

    this.containerEl.innerHTML = `
      <div class="chronicle-view-container">
        <!-- Header -->
        <div class="chronicle-header-row">
          <div>
            <span class="telemetry-text text-cyan">SYSTEM CHRONICLE // NOTION STRUCTURE</span>
            <h2>STORY ARCS, CAMPAIGNS & TRANSACTION LEDGER</h2>
            <p class="text-muted" style="font-size: 0.84rem;">PARA structure for action & Zettelkasten for knowledge. One system, one truth.</p>
          </div>

          <div class="filter-tabs" id="chronicle-tabs">
            <button class="filter-tab ${this.activeSubTab === 'STORIES' ? 'active' : ''}" data-tab="STORIES">STORY ARCS (${goals.length})</button>
            <button class="filter-tab ${this.activeSubTab === 'PROJECTS' ? 'active' : ''}" data-tab="PROJECTS">CAMPAIGNS (${projects.length})</button>
            <button class="filter-tab ${this.activeSubTab === 'DISTRICTS' ? 'active' : ''}" data-tab="DISTRICTS">CITY DISTRICTS</button>
            <button class="filter-tab ${this.activeSubTab === 'LEDGER' ? 'active' : ''}" data-tab="LEDGER">TRANSACTION LEDGER (${ledger.length})</button>
          </div>
        </div>

        ${this.renderSubTabContent(goals, projects, ledger, activityLog)}
      </div>
    `;

    this.bindEvents();
  }

  renderSubTabContent(goals, projects, ledger, activityLog) {
    if (this.activeSubTab === 'STORIES') {
      return `
        <section class="dossier-card accent-cyan">
          <div style="margin-bottom: 16px;">
            <h3 class="text-cyan">${getIcon('scroll', 'text-cyan icon-inline')} NOTION GOALS → MASTER STORY ARCS</h3>
            <p style="font-size: 0.82rem; color: var(--color-ink-muted);">Long-term identity goals mapped from Notion Goal collection.</p>
          </div>

          <div class="goals-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
            ${goals.map(g => `
              <div class="dossier-card goal-card ${g.achieved ? 'accent-success' : 'accent-cyan'}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span class="tag-pill priority-medium">${g.targetArea}</span>
                  <span class="status-badge ${g.achieved ? 'completed' : 'pending'}">
                    ${g.achieved ? 'ACHIEVED' : 'IN PROGRESS'}
                  </span>
                </div>

                <h4 style="font-size: 1.05rem; color: var(--color-newsprint-bone); margin-bottom: 4px;">${this.escapeHtml(g.title)}</h4>
                <div style="font-size: 0.78rem; color: var(--color-ink-muted); margin-bottom: 12px;">
                  Type: ${g.notionType} ${g.startDate ? `| Start: ${new Date(g.startDate).toLocaleDateString()}` : ''}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--border-hairline); padding-top: 8px; font-size: 0.75rem;">
                  <span class="text-muted">Provenance: Notion Goal</span>
                  <a href="${g.sourceUrl}" target="_blank" rel="noopener noreferrer" class="tag-pill notion-link-pill">
                    ${getIcon('notion')} Open in Notion
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    if (this.activeSubTab === 'PROJECTS') {
      return `
        <section class="dossier-card accent-amber">
          <div style="margin-bottom: 16px;">
            <h3 class="text-amber">${getIcon('folder', 'text-amber icon-inline')} NOTION PROJECTS → CAMPAIGN BOARDS</h3>
            <p style="font-size: 0.82rem; color: var(--color-ink-muted);">Projects imported from Notion. Unclassified records preserved honestly.</p>
          </div>

          <div class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
            ${projects.map(pj => `
              <div class="dossier-card project-card accent-amber">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span class="tag-pill priority-medium">${pj.status}</span>
                  <span class="status-badge pending">${pj.classified ? 'CLASSIFIED' : 'UNCLASSIFIED'}</span>
                </div>

                <h4 style="font-size: 1.1rem; color: var(--color-newsprint-bone); margin-bottom: 4px;">${this.escapeHtml(pj.title)}</h4>
                <p style="font-size: 0.8rem; color: var(--color-ink-secondary); margin-bottom: 12px;">
                  ${pj.note || 'Single unclassified campaign needing processing in Notion PARA system.'}
                </p>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--border-hairline); padding-top: 8px; font-size: 0.75rem;">
                  <span class="text-muted">Status: ${pj.status}</span>
                  <a href="${pj.sourceUrl}" target="_blank" rel="noopener noreferrer" class="tag-pill notion-link-pill">
                    ${getIcon('notion')} Classify in Notion
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    if (this.activeSubTab === 'DISTRICTS') {
      return `
        <section class="dossier-card accent-cyan">
          <div style="margin-bottom: 16px;">
            <h3 class="text-cyan">${getIcon('city', 'text-cyan icon-inline')} AREAS → CITY DISTRICT NODES</h3>
            <p style="font-size: 0.82rem; color: var(--color-ink-muted);">PARA Areas represented as strategic city districts in the living web.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <div class="dossier-card district-card accent-cyan">
              <h4 class="text-cyan">Engineering & Systems District</h4>
              <p style="font-size: 0.8rem; color: var(--color-ink-muted); margin-top: 4px;">Controls technical infrastructure & database schemas.</p>
            </div>
            <div class="dossier-card district-card accent-amber">
              <h4 class="text-amber">Finance & Growth District</h4>
              <p style="font-size: 0.8rem; color: var(--color-ink-muted); margin-top: 4px;">Manages freelance revenue, debt payoff & contracts.</p>
            </div>
            <div class="dossier-card district-card accent-red">
              <h4 class="text-red">Personal & Wellness District</h4>
              <p style="font-size: 0.8rem; color: var(--color-ink-muted); margin-top: 4px;">Maintains health, habit training & resistance protocols.</p>
            </div>
          </div>
        </section>
      `;
    }

    if (this.activeSubTab === 'LEDGER') {
      return `
        <section class="dossier-card accent-cyan">
          <div style="margin-bottom: 16px;">
            <h3 class="text-cyan">${getIcon('coin', 'text-gold icon-inline')} ATOMIC REWARD TRANSACTION LEDGER</h3>
            <p style="font-size: 0.82rem; color: var(--color-ink-muted);">Idempotent ledger of all completed mission strikes and boss impact transactions.</p>
          </div>

          <div class="ledger-table-container">
            ${ledger.length === 0 ? `
              <div class="empty-state">
                <p>No completion transactions recorded in ledger yet.</p>
              </div>
            ` : `
              <div class="ledger-list" style="display: flex; flex-direction: column; gap: 10px;">
                ${ledger.map(tx => `
                  <div class="dossier-card ledger-row-card" style="padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <div class="telemetry-text text-cyan">TX #${tx.id}</div>
                      <h4 style="font-size: 0.9rem; color: var(--color-newsprint-bone);">${this.escapeHtml(tx.actionTitle)}</h4>
                      <span class="telemetry-text text-muted">${new Date(tx.timestamp).toLocaleString()}</span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span class="tag-pill text-cyan">+${tx.xpAwarded} XP</span>
                      <span class="tag-pill text-amber">+${tx.goldAwarded} Gold</span>
                      <span class="tag-pill text-red">-${tx.bossDamageApplied} Boss Dmg</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </section>
      `;
    }
  }

  bindEvents() {
    const tabs = document.getElementById('chronicle-tabs');
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-tab');
        if (btn) {
          this.activeSubTab = btn.getAttribute('data-tab');
          this.render();
        }
      });
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  }
}
