/* ==========================================================================
   V4 MISSIONS VIEW (MASTER CALENDAR & INBOX SIGNAL FIELD COMMAND)
   Renders real Vietnamese Notion Master Calendar records with source badges,
   deep links, filters (Today/Upcoming/Inbox/Completed), and Mission Detail Drawer.
   ========================================================================== */

import { stateStore } from '../core/StateStore.js';
import { eventBus } from '../core/EventBus.js';
import { EVENTS } from '../config/constants.js';
import { getIcon } from './icons.js';

export class MissionsView {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.currentFilter = 'UPCOMING'; // 'TODAY' | 'UPCOMING' | 'INBOX' | 'COMPLETED'
    this.selectedMission = null;
    this.isDrawerOpen = false;

    eventBus.on(EVENTS.STATE_CHANGED, () => {
      if (this.isCurrentRoute()) {
        this.render();
      }
    });
  }

  isCurrentRoute() {
    return window.location.hash === '#/missions';
  }

  render() {
    const state = stateStore.getState();
    const actions = state.actions || [];
    const inboxList = stateStore.getNotionInbox();

    const hasSnapshotMissions = actions.some(a => a.origin === 'notion_snapshot' || Boolean(a.sourceDatabase));
    const availableActions = hasSnapshotMissions ? actions.filter(a => a.origin !== 'local_demo') : actions;

    const pendingActions = availableActions.filter(a => a.status !== 'COMPLETED');
    const completedActions = availableActions.filter(a => a.status === 'COMPLETED');

    let filteredList = [];
    if (this.currentFilter === 'UPCOMING') {
      filteredList = pendingActions;
    } else if (this.currentFilter === 'TODAY') {
      filteredList = pendingActions.filter(a => {
        if (!a.notionDate) return true;
        const d = new Date(a.notionDate);
        const today = new Date();
        return d.toDateString() === today.toDateString();
      });
      if (filteredList.length === 0) filteredList = pendingActions.slice(0, 3);
    } else if (this.currentFilter === 'COMPLETED') {
      filteredList = completedActions;
    }

    this.containerEl.innerHTML = `
      <div class="missions-view-container">
        <!-- Header Row & Notion Source Badge -->
        <div class="missions-header-row">
          <div>
            <span class="telemetry-text text-cyan">MASTER CALENDAR // NOTION SOURCE</span>
            <h2>MISSION TACTICAL DIRECTORY</h2>
            <p class="text-muted" style="font-size: 0.84rem;">Real read-only Notion tasks, focus blocks, and derived game rewards.</p>
          </div>

          <div class="filter-tabs" id="missions-filter-tabs">
            <button class="filter-tab ${this.currentFilter === 'TODAY' ? 'active' : ''}" data-filter="TODAY">TODAY</button>
            <button class="filter-tab ${this.currentFilter === 'UPCOMING' ? 'active' : ''}" data-filter="UPCOMING">UPCOMING (${pendingActions.length})</button>
            <button class="filter-tab ${this.currentFilter === 'INBOX' ? 'active' : ''}" data-filter="INBOX">INBOX SIGNALS (${inboxList.length})</button>
            <button class="filter-tab ${this.currentFilter === 'COMPLETED' ? 'active' : ''}" data-filter="COMPLETED">COMPLETED (${completedActions.length})</button>
          </div>
        </div>

        ${this.currentFilter === 'INBOX' ? this.renderInboxSection(inboxList) : `
          <!-- Master Calendar Missions Grid/List -->
          <div class="missions-grid-container">
            ${filteredList.length === 0 ? `
              <div class="empty-state dossier-card">
                <p>No mission dossiers match the selected filter.</p>
              </div>
            ` : filteredList.map(item => this.renderMissionCard(item)).join('')}
          </div>
        `}

        <!-- Mission Detail Drawer (Conditionally omitted when closed) -->
        ${this.isDrawerOpen && this.selectedMission ? this.renderDrawerModal(this.selectedMission) : ''}
      </div>
    `;

    this.bindEvents();
  }

  renderMissionCard(item) {
    const isCompleted = item.status === 'COMPLETED';

    return `
      <div class="dossier-card mission-card ${isCompleted ? 'completed' : ''}" data-id="${item.id}">
        <div class="mission-card-top">
          <div class="mission-source-badge">
            ${getIcon('notion', 'text-cyan icon-inline')}
            <span class="telemetry-text text-cyan">Master Calendar</span>
          </div>

          <span class="tag-pill priority-${(item.priority || 'medium').toLowerCase()}">
            ${item.priority || 'Low Priority'}
          </span>
        </div>

        <div class="mission-card-body">
          <h3 class="mission-title">${this.escapeHtml(item.title)}</h3>
          <p class="mission-reason">${this.escapeHtml(item.reason)}</p>

          <div class="mission-meta-strip">
            <span class="tag-pill text-cyan">${item.domain || 'Work'}</span>
            <span class="tag-pill">${getIcon('clock')} ${item.estimatedMinutes || 25}m</span>
            <span class="tag-pill text-amber">+${item.rewardXp || 120} XP / +${item.rewardGold || 80} G</span>
            <span class="tag-pill text-red">Difficulty: ${item.difficulty || 'NORMAL'}</span>
          </div>
        </div>

        <div class="mission-card-footer">
          <a href="${item.sourceUrl || 'https://notion.so'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary notion-deep-link-btn" style="padding: 4px 10px; font-size: 0.78rem;">
            ${getIcon('notion')} Open in Notion
          </a>

          <button class="btn btn-secondary btn-inspect-mission" data-id="${item.id}">
            ${getIcon('info')} Inspect Details
          </button>

          ${!isCompleted ? `
            <button class="btn btn-primary btn-complete-mission" data-id="${item.id}">
              ${getIcon('check')} Resolve
            </button>
          ` : `
            <span class="status-badge completed">${getIcon('check')} Resolved</span>
          `}
        </div>
      </div>
    `;
  }

  renderInboxSection(inboxList) {
    return `
      <div class="inbox-section-container dossier-card accent-amber">
        <div class="inbox-header">
          <span class="telemetry-text text-amber">${getIcon('notion')} INCOMING NOTION CAPTURE SIGNAL</span>
          <h3>RAW INBOX CAPTURES NEEDING DELIBERATE PROCESSING</h3>
          <p style="font-size: 0.84rem; color: var(--color-ink-muted);">Capture everything, process deliberately: Inbox → Master Calendar → Project → Area → Goal.</p>
        </div>

        <div class="inbox-items-list">
          ${inboxList.map(item => `
            <div class="inbox-item-card dossier-card">
              <div class="inbox-item-top">
                <span class="status-badge pending">UNPROCESSED CAPTURE</span>
                <span class="telemetry-text text-muted">${new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <div class="inbox-capture-text">
                <code>${this.escapeHtml(item.capture)}</code>
              </div>
              <div class="inbox-actions">
                <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.78rem;">
                  ${getIcon('notion')} Process in Notion
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderDrawerContent(item) {
    return `
      <div class="modal-header accent-header-red">
        <div>
          <span class="telemetry-text text-cyan">MISSION DOSSIER // NOTION PROVENANCE</span>
          <h3>${this.escapeHtml(item.title)}</h3>
        </div>
        <button class="btn-icon-only" id="btn-close-drawer" aria-label="Close drawer">${getIcon('close')}</button>
      </div>
      <div class="modal-body drawer-body">
        <!-- Provenance Section -->
        <div class="provenance-box dossier-card accent-cyan" style="padding: 12px; margin-bottom: 16px;">
          <span class="telemetry-text text-cyan">${getIcon('notion')} SOURCE METADATA (NOTION):</span>
          <div style="margin-top: 6px; font-size: 0.82rem; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div><strong>External ID:</strong> <code>${item.externalId}</code></div>
            <div><strong>Database:</strong> ${item.sourceDatabase || 'Master Calendar'}</div>
            <div><strong>Original Status:</strong> ${item.notionStatus || 'Upcoming'}</div>
            <div><strong>Notion Type:</strong> ${item.notionType || 'Work'}</div>
            <div style="grid-column: 1 / -1;"><strong>Synced At:</strong> ${item.syncedAt || '2026-08-13'}</div>
          </div>
          <div style="margin-top: 10px;">
            <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-cyan" style="width: 100%; font-size: 0.8rem;">
              ${getIcon('notion')} Open Record in Notion Workspace
            </a>
          </div>
        </div>

        <!-- Derived Game Values Section -->
        <div class="game-derived-box dossier-card accent-amber" style="padding: 12px;">
          <span class="telemetry-text text-amber">${getIcon('target')} DERIVED GAME MECHANICS:</span>
          <div style="margin-top: 6px; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px;">
            <div><strong>Game Difficulty:</strong> <span class="tag-pill text-red">${item.difficulty || 'NORMAL'}</span></div>
            <div><strong>Estimated Focus Block:</strong> ${item.estimatedMinutes} Mins</div>
            <div><strong>Rewards:</strong> +${item.rewardXp} XP / +${item.rewardGold} Gold</div>
            <div><strong>Boss Damage Impact:</strong> -${item.baseBossDamage} Armor Pen</div>
            <div><strong>Attribute Growth:</strong> +${item.attributeGain ? item.attributeGain.points : 2} ${item.attributeGain ? item.attributeGain.name : 'Focus'}</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="btn-dismiss-drawer">Close</button>
        ${item.status !== 'COMPLETED' ? `
          <button type="button" class="btn btn-primary btn-drawer-resolve" data-id="${item.id}">
            ${getIcon('check')} Resolve Mission
          </button>
        ` : ''}
      </div>
    `;
  }

  renderDrawerModal(item) {
    return `
      <div class="modal-backdrop open" id="mission-detail-drawer" role="dialog" aria-modal="true">
        <div class="modal-card drawer-card">
          ${this.renderDrawerContent(item)}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const tabs = document.getElementById('missions-filter-tabs');
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-tab');
        if (btn) {
          this.currentFilter = btn.getAttribute('data-filter');
          this.render();
        }
      });
    }

    this.containerEl.querySelectorAll('.btn-inspect-mission').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const state = stateStore.getState();
        const mission = state.actions.find(a => a.id === id || a.externalId === id);
        if (mission) {
          this.selectedMission = mission;
          this.isDrawerOpen = true;
          this.render();
        }
      });
    });

    this.containerEl.querySelectorAll('.btn-complete-mission').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) stateStore.completeAction(id);
      });
    });

    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const btnDismissDrawer = document.getElementById('btn-dismiss-drawer');
    const closeDrawerHandler = () => {
      this.isDrawerOpen = false;
      this.selectedMission = null;
      this.render();
    };

    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawerHandler);
    if (btnDismissDrawer) btnDismissDrawer.addEventListener('click', closeDrawerHandler);

    this.containerEl.querySelectorAll('.btn-drawer-resolve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) {
          stateStore.completeAction(id);
          closeDrawerHandler();
        }
      });
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  }
}
