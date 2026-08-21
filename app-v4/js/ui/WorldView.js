/* ==========================================================================
   V4 WORLD VIEW (PLAYABLE GAME HUB STAGE & LIVING CITY WEB)
   Game-first stage layout: City skyline silhouette, Doc Ock threat integration,
   Notion Mission Beacon, Hero Operative Anchor, and Living Web of Consequence.
   ========================================================================== */

import { stateStore } from '../core/StateStore.js';
import { eventBus } from '../core/EventBus.js';
import { EVENTS } from '../config/constants.js';
import { RewardCalculator } from '../engine/RewardCalculator.js';
import { getIcon } from './icons.js';

export class WorldView {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.isAnimatingCompletion = false;
    this.isRefreshModalOpen = false;
    this.isWebExpanded = false;
    this.boundKeyHandler = null;

    // Subscriptions
    eventBus.on(EVENTS.STATE_CHANGED, () => {
      if (this.isCurrentRoute()) {
        this.render();
      }
    });

    eventBus.on(EVENTS.NOTIFICATION, (notification) => {
      this.showToast(notification.message);
    });
  }

  isCurrentRoute() {
    const hash = window.location.hash;
    return hash === '#/world' || hash === '#/command' || hash === '' || hash === '#/';
  }

  render() {
    const state = stateStore.getState();
    const { user, activeEncounter, loadout, focusSession, actions, lastRewardBreakdown } = state;
    const snapshotTime = stateStore.getNotionSnapshotTime();

    // Select active real Notion mission (first non-completed mission)
    const hasSnapshotMissions = actions.some(a => a.origin === 'notion_snapshot' || Boolean(a.sourceDatabase));
    const availableMissions = hasSnapshotMissions ? actions.filter(a => a.origin !== 'local_demo') : actions;
    const pendingMissions = availableMissions.filter(a => a.status !== 'COMPLETED');
    const activeMission = pendingMissions.length > 0 ? pendingMissions[0] : (availableMissions[0] || null);

    // Calculate web node values for active mission
    const hasRealProject = activeMission && Boolean(activeMission.project);
    const projectTitle = hasRealProject ? activeMission.project : (activeMission && activeMission.origin !== 'notion_snapshot' ? activeMission.campaign : null);

    const hasRealArea = activeMission && Boolean(activeMission.area);
    const areaTitle = hasRealArea ? activeMission.area : (activeMission && activeMission.origin !== 'notion_snapshot' ? activeMission.domain : null);

    const hasRealGoal = activeMission && Boolean(activeMission.goal);
    const goalTitle = hasRealGoal ? activeMission.goal : null;

    // Calculate predicted damage & reward preview for active mission
    let predictedBreakdown = null;
    if (activeMission && activeMission.status !== 'COMPLETED') {
      predictedBreakdown = RewardCalculator.calculateCompletionReward(activeMission, user, activeEncounter, loadout);
    }

    // Daily condition text
    const dailyCondition = stateStore.getNotionDaily();

    this.containerEl.innerHTML = `
      <div class="world-game-hub">
        <!-- Toast Stack -->
        <div id="toast-container" class="toast-stack"></div>

        <!-- 1. LIVING CITY STAGE (Interactive SVG Game Viewport) -->
        <div class="world-stage-container">
          <!-- Background Parallax & Day State Tint -->
          <div class="stage-sky-backdrop"></div>

          <!-- Inline SVG Living City Stage & Skyline -->
          <svg class="stage-svg-canvas" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="citySkyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0E1322" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="#080A0F" stop-opacity="1"/>
              </linearGradient>

              <linearGradient id="threatTentacleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#845EF7" stop-opacity="0.7"/>
                <stop offset="50%" stop-color="#28D7F2" stop-opacity="0.5"/>
                <stop offset="100%" stop-color="#F02B3A" stop-opacity="0.8"/>
              </linearGradient>

              <filter id="beaconGlow">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            <!-- Sky & Grid Horizon -->
            <rect width="1000" height="420" fill="url(#citySkyGrad)" />
            <line x1="0" y1="360" x2="1000" y2="360" stroke="rgba(40, 215, 242, 0.15)" stroke-width="2" />

            <!-- City Skyline Silhouettes (Parallax Depth Layer 1 & 2) -->
            <!-- Distant City Layer -->
            <path d="M 0 360 V 220 L 40 220 V 190 L 90 190 V 260 L 140 260 V 170 L 200 170 V 360 Z" fill="#0C101A" />
            <path d="M 220 360 V 140 L 290 140 V 180 L 350 180 V 360 Z" fill="#0D121F" />
            <path d="M 380 360 V 130 L 460 130 V 210 L 520 210 V 360 Z" fill="#0C101A" />
            <path d="M 540 360 V 160 L 620 160 V 120 L 680 120 V 240 L 740 240 V 360 Z" fill="#0E1424" />
            <path d="M 760 360 V 180 L 840 180 V 150 L 920 150 V 280 L 1000 280 V 360 Z" fill="#0C101A" />

            <!-- Foreground City Layer with Illuminated Windows -->
            <path d="M 20 360 V 260 L 70 260 V 240 L 120 240 V 360 Z" fill="#131828" stroke="rgba(232, 224, 207, 0.08)" />
            <rect x="40" y="270" width="8" height="12" fill="rgba(40, 215, 242, 0.4)" />
            <rect x="55" y="270" width="8" height="12" fill="rgba(242, 184, 75, 0.4)" />

            <path d="M 160 360 V 200 L 230 200 V 360 Z" fill="#151C30" stroke="rgba(232, 224, 207, 0.08)" />
            <rect x="175" y="220" width="10" height="15" fill="rgba(40, 215, 242, 0.6)" />
            <rect x="195" y="220" width="10" height="15" fill="rgba(40, 215, 242, 0.3)" />

            <!-- Center District Tower (Mission Hub Node) -->
            <path d="M 440 360 V 100 L 500 60 L 560 100 V 360 Z" fill="#171F36" stroke="var(--color-portal-cyan)" stroke-width="1.5" />
            <line x1="500" y1="60" x2="500" y2="20" stroke="var(--color-portal-cyan)" stroke-width="2" />
            
            <!-- Visually Integrated Doctor Octopus Threat Overlay (Tentacles Looming Over City) -->
            <g class="doc-ock-world-threat">
              <!-- Looming Threat Core aura above right skyline -->
              <circle cx="820" cy="120" r="70" fill="url(#threatTentacleGrad)" opacity="0.25" />
              <!-- Mechanical Tentacles sweeping across city sky -->
              <path d="M 820 120 C 720 50, 600 70, 500 60" stroke="url(#threatTentacleGrad)" stroke-width="5" fill="none" stroke-linecap="round" />
              <path d="M 820 120 C 740 180, 650 160, 560 200" stroke="url(#threatTentacleGrad)" stroke-width="4" fill="none" stroke-linecap="round" />
              <!-- Threat Hub Badge -->
              <circle cx="820" cy="120" r="16" fill="#11141D" stroke="var(--color-spider-red)" stroke-width="2" />
              <circle cx="820" cy="120" r="6" fill="var(--color-spider-red)" />
            </g>

            <!-- Mission Beacon Glow Beam emanating from Center Tower -->
            ${activeMission ? `
              <g class="mission-beacon-group" filter="url(#beaconGlow)">
                <line x1="500" y1="20" x2="500" y2="360" stroke="var(--color-portal-cyan)" stroke-width="3" stroke-dasharray="8 4" />
                <circle cx="500" cy="60" r="14" fill="var(--color-portal-cyan)" opacity="0.8" />
                <circle cx="500" cy="60" r="24" fill="none" stroke="var(--color-portal-cyan)" stroke-width="2">
                  <animate attributeName="r" values="14;34;14" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.2;1" dur="2.5s" repeatCount="indefinite" />
                </circle>
              </g>
            ` : ''}

            <!-- Controlled Original Spider Operative Silhouette Anchor (Foreground Center-Left perched) -->
            <g class="spider-hero-anchor" transform="translate(280, 260)">
              <!-- Perched ledge -->
              <rect x="-15" y="60" width="60" height="8" fill="#11141D" stroke="var(--color-portal-cyan)" />
              <!-- Spider silhouette contour -->
              <path d="M 10 20 C 5 15, -5 20, -5 35 C -5 45, 5 55, 15 60 C 25 55, 35 45, 35 35 C 35 20, 25 15, 20 20 Z" fill="var(--color-spider-red)" />
              <!-- Eye Lenses -->
              <polygon points="6,28 14,35 12,26" fill="#FFFFFF" />
              <polygon points="24,28 16,35 18,26" fill="#FFFFFF" />
              <!-- Web Line from hand -->
              <path d="M 15 35 C 100 -50, 300 -80, 500 -200" stroke="var(--color-portal-cyan)" stroke-width="1.5" fill="none" stroke-dasharray="4 2" />
            </g>
          </svg>

          <!-- Integrated Boss Threat Overlay Banner (Positioned top-right in stage) -->
          <div class="integrated-boss-banner">
            <div class="boss-banner-header">
              <span class="status-pulse-dot"></span>
              <span class="telemetry-text text-red">THREAT: ${activeEncounter.name}</span>
            </div>
            <div class="boss-banner-meters">
              <div class="mini-meter" title="Boss Armor">
                <span class="mini-meter-label text-cyan">${getIcon('shield')} ${activeEncounter.armor}/${activeEncounter.maxArmor}</span>
                <div class="meter-bar-track"><div class="meter-bar-fill" style="width: ${Math.round((activeEncounter.armor / activeEncounter.maxArmor) * 100)}%; background: var(--color-portal-cyan);"></div></div>
              </div>
              <div class="mini-meter" title="Boss HP">
                <span class="mini-meter-label text-red">${getIcon('heart')} ${activeEncounter.hp}/${activeEncounter.maxHp}</span>
                <div class="meter-bar-track"><div class="meter-bar-fill" style="width: ${Math.round((activeEncounter.hp / activeEncounter.maxHp) * 100)}%; background: var(--color-spider-red);"></div></div>
              </div>
            </div>
          </div>

          <!-- Floating Snapshot HUD Chip -->
          <div class="world-snapshot-hud">
            <span class="telemetry-chip notion-snapshot-chip" id="btn-open-refresh-modal">
              ${getIcon('notion', 'text-cyan icon-inline')}
              <span>Notion Snapshot: <strong>${snapshotTime}</strong></span>
              <span class="btn-refresh-pill">${getIcon('info')} Info</span>
            </span>
          </div>
        </div>

        <!-- 2. PRIMARY MISSION STRIKE CTA & CONTEXTUAL OVERLAY PANEL -->
        <section class="world-primary-strike-panel dossier-card accent-red">
          ${activeMission ? `
            <div class="strike-panel-header">
              <div class="beacon-title-badge">
                <span class="beacon-pulse-dot"></span>
                <span class="telemetry-text text-cyan">NOTION MISSION BEACON // ACTIVE TARGET</span>
              </div>
              <h2 class="active-mission-title">${this.escapeHtml(activeMission.title)}</h2>
              <p class="active-mission-reason">${this.escapeHtml(activeMission.reason || activeMission.description)}</p>
            </div>

            <div class="strike-meta-pills">
              <span class="tag-pill priority-${activeMission.priority.toLowerCase()}">${activeMission.priority}</span>
              <span class="tag-pill text-cyan">${activeMission.domain}</span>
              <span class="tag-pill">${getIcon('clock')} ${activeMission.estimatedMinutes}m Focus</span>
              <span class="tag-pill text-amber">+${activeMission.rewardXp} XP / +${activeMission.rewardGold} G</span>
              <a href="${activeMission.sourceUrl}" target="_blank" rel="noopener noreferrer" class="tag-pill notion-link-pill">
                ${getIcon('notion')} Open in Notion
              </a>
            </div>

            <div class="predicted-impact-summary">
              <span class="telemetry-text text-red">${getIcon('target')} PREDICTED STRIKE EFFECT:</span>
              <strong class="text-red">${predictedBreakdown ? `-${predictedBreakdown.bossDamage.rawDamage} Boss Damage` : 'Complete mission'}</strong>
              <span class="text-muted">(${predictedBreakdown ? `+${predictedBreakdown.finalXp} XP, +${predictedBreakdown.attributeGain.points} ${predictedBreakdown.attributeGain.name}` : ''})</span>
            </div>

            <div class="strike-cta-row">
              ${activeMission.status !== 'COMPLETED' ? `
                <button class="btn btn-primary btn-hero-cta" id="btn-world-resolve-strike" data-id="${activeMission.id}">
                  ${getIcon('check')} RESOLVE MISSION STRIKE
                </button>
              ` : `
                <span class="status-badge completed">${getIcon('check')} MISSION RESOLVED</span>
              `}

              <button class="btn btn-secondary" id="btn-world-toggle-focus" data-id="${activeMission.id}">
                ${getIcon('target')} ${focusSession.active && focusSession.actionId === activeMission.id ? 'PAUSE FOCUS' : 'START FOCUS'}
              </button>
            </div>
          ` : `
            <div class="empty-state">
              <p>All Notion Master Calendar missions complete! Review your story arcs in Chronicle.</p>
            </div>
          `}
        </section>

        <!-- 3. SIGNATURE LIVING CITY WEB (TASK -> PROJECT -> AREA -> GOAL) -->
        <section class="living-city-web-section dossier-card accent-cyan">
          <div class="web-section-header">
            <div>
              <span class="telemetry-text text-cyan">FIELD CAUSALITY MAP</span>
              <h2>LIVING CITY WEB OF CONSEQUENCE</h2>
              <p style="font-size: 0.8rem; color: var(--color-ink-muted);">Visualizes Task → Project → Area → Goal strands. Broken strands indicate open/unclassified links.</p>
            </div>

            <button class="btn btn-secondary mobile-web-toggle-btn" id="btn-toggle-world-web">
              <span>${this.isWebExpanded ? 'Hide Details' : 'Why this reward?'}</span>
              <span class="icon-inline">${this.isWebExpanded ? getIcon('chevronUp') : getIcon('chevronDown')}</span>
            </button>
          </div>

          <!-- Web Nodes Container -->
          <div class="web-chain-container ${this.isWebExpanded ? 'mobile-expanded' : ''}">
            <!-- Node 1: Active Mission Task -->
            <div class="web-node node-hero-action">
              <span class="node-badge">1. NOTION TASK</span>
              <div class="node-title">${activeMission ? this.escapeHtml(activeMission.title) : 'No Task'}</div>
              <span class="node-meta">${activeMission ? `${activeMission.estimatedMinutes}m Focus Block` : '---'}</span>
            </div>

            <div class="web-connector-mobile" aria-hidden="true"></div>

            <!-- Node 2: Target Project / Campaign -->
            <div class="web-node node-domain secondary-web-detail ${!projectTitle ? 'broken-strand-node' : ''}">
              <span class="node-badge">2. PROJECT (PARA)</span>
              <div class="node-title ${projectTitle ? 'text-cyan' : 'text-red'}">${projectTitle ? this.escapeHtml(projectTitle) : 'Chưa phân loại'}</div>
              <span class="node-meta">${projectTitle ? this.escapeHtml(activeMission.domain || 'General Ops') : 'Broken Strand (Unlinked)'}</span>
            </div>

            <div class="web-connector-mobile secondary-web-detail" aria-hidden="true"></div>

            <!-- Node 3: City Area / District -->
            <div class="web-node node-attribute secondary-web-detail ${!areaTitle ? 'broken-strand-node' : ''}">
              <span class="node-badge">3. AREA / DISTRICT</span>
              <div class="node-title ${areaTitle ? 'text-amber' : 'text-red'}">
                ${areaTitle ? this.escapeHtml(areaTitle) : 'Chưa phân loại'}
              </div>
              <span class="node-meta">${areaTitle ? `+${predictedBreakdown ? predictedBreakdown.attributeGain.points : 2} Stat Gain` : 'Broken Strand (Unlinked)'}</span>
            </div>

            <div class="web-connector-mobile secondary-web-detail" aria-hidden="true"></div>

            <!-- Node 4: Goal / Story Arc Strand (Check for broken link) -->
            <div class="web-node node-loadout ${!goalTitle ? 'broken-strand-node' : ''}">
              <span class="node-badge">4. GOAL / STORY ARC</span>
              <div class="node-title ${goalTitle ? 'text-cyan' : 'text-red'}">
                ${goalTitle ? this.escapeHtml(goalTitle) : 'Chưa phân loại'}
              </div>
              <span class="node-meta">${goalTitle ? 'Goal Connected' : 'Broken Strand (Unlinked)'}</span>
            </div>

            <div class="web-connector-mobile" aria-hidden="true"></div>

            <!-- Node 5: Boss Threat Impact -->
            <div class="web-node node-damage node-hero-impact">
              <span class="node-badge">5. BOSS IMPACT</span>
              <div class="node-title text-red">
                -${predictedBreakdown ? predictedBreakdown.bossDamage.rawDamage : 160} Armor Dmg
              </div>
              <span class="node-meta">+${predictedBreakdown ? predictedBreakdown.finalXp : 120} XP / +${predictedBreakdown ? predictedBreakdown.finalGold : 80} G</span>
            </div>
          </div>
        </section>

        <!-- 4. REWARD BREAKDOWN MODAL DIALOG -->
        ${lastRewardBreakdown ? this.renderRewardBreakdownModal(lastRewardBreakdown) : ''}

        <!-- 5. REFRESH SNAPSHOT EXPLANATION MODAL (Conditionally omitted when closed) -->
        ${this.isRefreshModalOpen ? this.renderRefreshModal(snapshotTime) : ''}
      </div>
    `;

    this.bindEvents();
    this.setupKeyboardListeners();
  }

  renderRewardBreakdownModal(bd) {
    return `
      <div class="modal-backdrop open reward-modal-backdrop" id="reward-breakdown-modal" role="dialog" aria-modal="true">
        <div class="modal-card reward-modal-card">
          <div class="bottom-sheet-handle" aria-hidden="true"></div>

          <div class="modal-header accent-header-red">
            <div>
              <span class="telemetry-text text-amber">TRANSACTION RESOLVED #${bd.transactionId}</span>
              <h3>STRIKE RESOLVED - IMPACT REPORT</h3>
            </div>
            <button class="btn-icon-only" id="btn-close-reward-modal" aria-label="Dismiss breakdown">${getIcon('close')}</button>
          </div>

          <div class="modal-body reward-breakdown-body">
            <div class="reward-action-heading">
              <h2>${this.escapeHtml(bd.actionTitle)}</h2>
              <span class="tag-pill text-cyan">${bd.domain} DOMAIN</span>
            </div>

            <div class="breakdown-table">
              <div class="breakdown-row">
                <span>Base XP & Gold:</span>
                <strong class="mono-value">${bd.baseXp} XP / ${bd.baseGold} Gold</strong>
              </div>

              <div class="breakdown-row">
                <span>Duration Multiplier (${bd.durationMinutes}m):</span>
                <strong class="mono-value text-cyan">${bd.durationMultiplier}x</strong>
              </div>

              <div class="breakdown-row highlight-row">
                <span>Attribute Growth Awarded:</span>
                <strong class="mono-value text-amber">+${bd.attributeGain.points} ${bd.attributeGain.name}</strong>
              </div>

              <div class="breakdown-row highlight-row-red">
                <span>Boss Armor / HP Damage Applied:</span>
                <strong class="mono-value text-red">
                  -${bd.bossDamage.armorDamage} Armor / -${bd.bossDamage.hpDamage} HP (Stagger +${bd.bossDamage.staggerGained})
                </strong>
              </div>

              <div class="breakdown-totals-box">
                <div class="total-item">
                  <span class="total-label">TOTAL XP GAINED</span>
                  <span class="total-val text-cyan">+${bd.finalXp} XP</span>
                </div>
                <div class="total-item">
                  <span class="total-label">TOTAL GOLD GAINED</span>
                  <span class="total-val text-amber">+${bd.finalGold} GOLD</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer sticky-modal-footer">
            <button type="button" class="btn btn-primary btn-claim-rewards" id="btn-claim-rewards">
              ${getIcon('check')} CLAIM REWARDS & DISMISS
            </button>
          </div>
        </div>
      </div>
    `;
  }

  triggerOrchestratedCompletion(actionId) {
    if (this.isAnimatingCompletion) return;
    this.isAnimatingCompletion = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      stateStore.completeAction(actionId);
      this.isAnimatingCompletion = false;
      return;
    }

    stateStore.completeAction(actionId);
    this.isAnimatingCompletion = false;
  }

  renderRefreshModal(snapshotTime) {
    return `
      <div class="modal-backdrop open" id="refresh-snapshot-modal" role="dialog" aria-modal="true">
        <div class="modal-card">
          <div class="modal-header accent-header-red">
            <div>
              <span class="telemetry-text text-cyan">NOTION INTEGRATION BOUNDARY</span>
              <h3>REFRESH SNAPSHOT & PROVENANCE</h3>
            </div>
            <button class="btn-icon-only" id="btn-close-refresh-modal" aria-label="Close modal">${getIcon('close')}</button>
          </div>
          <div class="modal-body">
            <p style="margin-bottom: 12px; color: var(--color-newsprint-bone);">
              Current read-only snapshot timestamp: <strong class="text-cyan">${snapshotTime}</strong>
            </p>
            <div class="dossier-card accent-amber" style="padding: 12px; margin-bottom: 14px;">
              <span class="telemetry-text text-amber">${getIcon('info')} ARCHITECTURAL BOUNDARY:</span>
              <p style="font-size: 0.82rem; margin-top: 4px; color: var(--color-newsprint-bone);">
                Static browser applications cannot safely embed private Notion API tokens. This system operates on provenance-preserving, read-only snapshots produced directly from your connected Notion workspace.
              </p>
            </div>
            <p style="font-size: 0.84rem; color: var(--color-ink-secondary);">
              To refresh your data, re-generate <code>app-v4/data/notion-snapshot.json</code> via your local CLI exporter or workspace sync pipeline.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="btn-confirm-refresh-modal">Got it</button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const btnResolve = document.getElementById('btn-world-resolve-strike');
    if (btnResolve) {
      btnResolve.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) this.triggerOrchestratedCompletion(id);
      });
    }

    const btnFocus = document.getElementById('btn-world-toggle-focus');
    if (btnFocus) {
      btnFocus.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) stateStore.toggleFocus(id);
      });
    }

    const btnOpenRefresh = document.getElementById('btn-open-refresh-modal');
    const btnCloseRefresh = document.getElementById('btn-close-refresh-modal');
    const btnConfirmRefresh = document.getElementById('btn-confirm-refresh-modal');

    if (btnOpenRefresh) {
      btnOpenRefresh.addEventListener('click', () => {
        this.isRefreshModalOpen = true;
        this.render();
      });
    }

    const closeRefreshHandler = () => {
      this.isRefreshModalOpen = false;
      this.render();
    };

    if (btnCloseRefresh) btnCloseRefresh.addEventListener('click', closeRefreshHandler);
    if (btnConfirmRefresh) btnConfirmRefresh.addEventListener('click', closeRefreshHandler);

    const btnToggleWeb = document.getElementById('btn-toggle-world-web');
    if (btnToggleWeb) {
      btnToggleWeb.addEventListener('click', () => {
        this.isWebExpanded = !this.isWebExpanded;
        const webContainer = this.containerEl.querySelector('.web-chain-container');
        if (webContainer) {
          webContainer.classList.toggle('mobile-expanded', this.isWebExpanded);
        }
        btnToggleWeb.querySelector('span:first-child').textContent = this.isWebExpanded ? 'Hide Details' : 'Why this reward?';
        btnToggleWeb.querySelector('.icon-inline').innerHTML = getIcon(this.isWebExpanded ? 'chevronUp' : 'chevronDown');
      });
    }

    const btnClaimRewards = document.getElementById('btn-claim-rewards');
    const btnCloseRewardModal = document.getElementById('btn-close-reward-modal');
    const dismissRewardHandler = () => stateStore.dismissRewardBreakdown();

    if (btnClaimRewards) btnClaimRewards.addEventListener('click', dismissRewardHandler);
    if (btnCloseRewardModal) btnCloseRewardModal.addEventListener('click', dismissRewardHandler);
  }

  setupKeyboardListeners() {
    if (this.boundKeyHandler) window.removeEventListener('keydown', this.boundKeyHandler);
    this.boundKeyHandler = (e) => {
      if (e.key === 'Escape') {
        const state = stateStore.getState();
        if (state.lastRewardBreakdown) {
          stateStore.dismissRewardBreakdown();
        } else if (this.isRefreshModalOpen) {
          this.isRefreshModalOpen = false;
          const modal = document.getElementById('refresh-snapshot-modal');
          if (modal) modal.classList.remove('open');
        }
      }
    };
    window.addEventListener('keydown', this.boundKeyHandler);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  }

  showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'dossier-card accent-cyan toast-item';
    toast.style.padding = '12px 16px';
    toast.style.background = 'var(--color-paper-card)';
    toast.style.border = '1px solid var(--color-portal-cyan)';
    toast.style.borderRadius = 'var(--radius-card)';
    toast.style.color = 'var(--color-newsprint-bone)';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '500';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
}
