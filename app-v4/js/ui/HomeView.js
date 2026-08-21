/* ==========================================================================
   V4 HOME VIEW (SPIDER-VERSE FIELD COMMAND & LIFE-RPG LOOP)
   Dimensional Field Dossier with Living Web of Consequence & Mobile-First Pass
   ========================================================================== */

import { stateStore } from '../core/StateStore.js';
import { eventBus } from '../core/EventBus.js';
import { EVENTS } from '../config/constants.js';
import { RewardCalculator } from '../engine/RewardCalculator.js';
import { getIcon } from './icons.js';

export class HomeView {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.currentFilter = 'ALL';
    this.isAddModalOpen = false;
    this.isWebExpanded = false; // Mobile Living Web details toggle
    this.isAnimatingCompletion = false;
    this.boundKeyHandler = null;

    // Subscriptions
    eventBus.on(EVENTS.STATE_CHANGED, () => {
      if (this.isCurrentRoute()) {
        this.render();
      }
    });

    eventBus.on(EVENTS.FOCUS_TICK, (session) => {
      this.updateTimerDisplay(session);
    });

    eventBus.on(EVENTS.NOTIFICATION, (notification) => {
      this.showToast(notification.message);
    });
  }

  isCurrentRoute() {
    const hash = window.location.hash;
    return hash === '#/command' || hash === '' || hash === '#/';
  }

  render() {
    const state = stateStore.getState();
    const { user, activeEncounter, loadout, focusSession, actions, lastRewardBreakdown } = state;

    // 1. Identify primary Next Move action (highest priority pending action)
    const pendingActions = actions.filter(a => a.status !== 'COMPLETED');
    const nextMoveAction = pendingActions.length > 0 ? pendingActions[0] : (actions[0] || null);

    // 2. Calculate predicted boss damage & reward preview for Next Move
    let predictedBreakdown = null;
    if (nextMoveAction && nextMoveAction.status !== 'COMPLETED') {
      predictedBreakdown = RewardCalculator.calculateCompletionReward(nextMoveAction, user, activeEncounter, loadout);
    }

    // Filter actions queue
    const filteredActions = this.filterActionsList(actions, this.currentFilter);
    const pendingCount = pendingActions.length;
    const completedCount = actions.filter(a => a.status === 'COMPLETED').length;
    const totalCount = actions.length;

    this.containerEl.innerHTML = `
      <div class="home-command-view dimensional-dossier-theme">
        <!-- Toast Notification Stack -->
        <div id="toast-container" class="toast-stack"></div>

        <!-- SECTION 1: CINEMATIC ENCOUNTER STAGE (Next Move Dossier & Doc Ock Threat) -->
        <div class="top-encounter-stage" id="encounter-stage">
          <!-- 1A. Primary Objective Dossier (Next Move Card) -->
          <section class="dossier-card next-move-card accent-red" aria-label="Primary Objective Dossier">
            ${nextMoveAction ? `
              <div class="next-move-header">
                <span class="telemetry-text text-red">FIELD COMMAND // ACTION REQUIRED NOW</span>
                <h2 class="next-move-title">${this.escapeHtml(nextMoveAction.title)}</h2>
                <p class="next-move-reason">
                  <strong>WHY IT MATTERS:</strong> ${this.escapeHtml(nextMoveAction.reason || nextMoveAction.description)}
                </p>
              </div>

              <div class="next-move-meta">
                <span class="tag-pill priority-${nextMoveAction.priority.toLowerCase()}">${nextMoveAction.priority} PRIORITY</span>
                <span class="tag-pill text-cyan">${nextMoveAction.domain || 'Engineering'}</span>
                <span class="tag-pill">${getIcon('clock')} ${nextMoveAction.estimatedMinutes || 25} MINS</span>
                <span class="tag-pill text-amber">+${nextMoveAction.rewardXp} XP / +${nextMoveAction.rewardGold} GOLD</span>
              </div>

              <!-- Predicted Damage Callout (Mobile-first in first viewport) -->
              <div class="mobile-predicted-callout">
                <span class="telemetry-text text-red">${getIcon('target', 'text-red')} PREDICTED IMPACT:</span>
                <strong class="text-red">${predictedBreakdown ? `-${predictedBreakdown.bossDamage.rawDamage} Boss Dmg` : 'Complete for impact'}</strong>
              </div>

              <div class="next-move-controls">
                ${nextMoveAction.status !== 'COMPLETED' ? `
                  <button class="btn btn-primary btn-complete-next-move" id="btn-complete-next-move" data-id="${nextMoveAction.id}">
                    ${getIcon('check')} RESOLVE STRIKE
                  </button>
                ` : `
                  <span class="status-badge completed">${getIcon('check')} OBJECTIVE RESOLVED</span>
                `}
                
                <button class="btn btn-secondary" id="btn-focus-next-move" data-id="${nextMoveAction.id}">
                  ${getIcon('target')} ${focusSession.active && focusSession.actionId === nextMoveAction.id ? 'PAUSE FOCUS' : 'START FOCUS'}
                </button>
              </div>
            ` : `
              <div class="empty-state">
                <p>All objectives complete! Add a new mission dossier below.</p>
              </div>
            `}
          </section>

          <!-- 1B. Active Encounter Card (Doctor Octopus Threat Panel) -->
          <section class="dossier-card encounter-card accent-violet" id="boss-threat-card" aria-label="Active Boss Encounter Doctor Octopus">
            <!-- Author Inline SVG Mechanical Tentacle Background Graphic -->
            ${getIcon('docOckTentacles')}

            <div class="encounter-header">
              <div class="encounter-title-box">
                <span class="telemetry-text text-cyan">ACTIVE THREAT // LEVEL 3 BOSS</span>
                <h3 class="boss-name">${activeEncounter.name}</h3>
                <span class="boss-alias">${activeEncounter.subtitle}</span>
              </div>
              <span class="status-badge ${activeEncounter.armor > 0 ? 'pending' : 'completed'}">
                ${getIcon('shield')} ${activeEncounter.status || (activeEncounter.armor > 0 ? 'ARMORED' : 'VULNERABLE')}
              </span>
            </div>

            <!-- Boss Stats Meters -->
            <div class="boss-meters">
              <!-- Armor Meter -->
              <div class="meter-box">
                <div class="meter-header">
                  <span class="meter-label">${getIcon('shield', 'text-cyan')} ARMOR SHIELD</span>
                  <span class="meter-value mono-value text-cyan">${activeEncounter.armor} / ${activeEncounter.maxArmor}</span>
                </div>
                <div class="meter-bar-track">
                  <div class="meter-bar-fill" style="width: ${Math.round((activeEncounter.armor / activeEncounter.maxArmor) * 100)}%; background: linear-gradient(90deg, #28D7F2, #00A3FF);"></div>
                </div>
              </div>

              <!-- HP Meter -->
              <div class="meter-box">
                <div class="meter-header">
                  <span class="meter-label">${getIcon('heart', 'text-red')} VITALITY (HP)</span>
                  <span class="meter-value mono-value text-red">${activeEncounter.hp} / ${activeEncounter.maxHp}</span>
                </div>
                <div class="meter-bar-track">
                  <div class="meter-bar-fill" style="width: ${Math.round((activeEncounter.hp / activeEncounter.maxHp) * 100)}%; background: linear-gradient(90deg, #F02B3A, #FF5E62);"></div>
                </div>
              </div>

              <!-- Stagger Meter -->
              <div class="meter-box">
                <div class="meter-header">
                  <span class="meter-label">${getIcon('zap', 'text-amber')} STAGGER THRESHOLD</span>
                  <span class="meter-value mono-value text-amber">${activeEncounter.stagger} / ${activeEncounter.maxStagger}</span>
                </div>
                <div class="meter-bar-track">
                  <div class="meter-bar-fill" style="width: ${Math.round((activeEncounter.stagger / activeEncounter.maxStagger) * 100)}%; background: linear-gradient(90deg, #F2B84B, #FF8C00);"></div>
                </div>
              </div>
            </div>

            <!-- Desktop Predicted Damage Callout -->
            <div class="predicted-damage-box spider-sense-pulse desktop-only-predicted">
              <div class="predicted-label">
                ${getIcon('target', 'text-red')} PREDICTED STRIKE DAMAGE
              </div>
              <div class="predicted-value">
                ${predictedBreakdown ? `
                  <strong class="text-red">-${predictedBreakdown.bossDamage.rawDamage} Total Dmg</strong>
                  <span class="predicted-breakdown-sub">
                    (${predictedBreakdown.bossDamage.armorDamage > 0 ? `-${predictedBreakdown.bossDamage.armorDamage} Armor` : ''} 
                     ${predictedBreakdown.bossDamage.hpDamage > 0 ? `-${predictedBreakdown.bossDamage.hpDamage} HP` : ''})
                  </span>
                ` : 'Select action to preview damage'}
              </div>
            </div>
          </section>
        </div>

        <!-- SECTION 2: SIGNATURE CENTERPIECE - LIVING WEB OF CONSEQUENCE -->
        <section class="web-of-consequence-section dossier-card" id="web-section" aria-label="Living Web of Consequence">
          <div class="web-section-header">
            <div>
              <span class="telemetry-text text-cyan">FIELD CAUSALITY MAP</span>
              <h2>LIVING WEB OF CONSEQUENCE</h2>
            </div>
            
            <!-- Mobile Expand Toggle Button -->
            <button class="btn btn-secondary mobile-web-toggle-btn" id="btn-toggle-web-details">
              <span>Why this reward?</span>
              <span class="icon-inline">${this.isWebExpanded ? getIcon('chevronUp') : getIcon('chevronDown')}</span>
            </button>
          </div>

          <!-- Desktop SVG Web Strand Backdrop Graph -->
          <svg class="desktop-web-svg-canvas" id="web-svg-strand" viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="webGradientGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#28D7F2" stop-opacity="0.9"/>
                <stop offset="50%" stop-color="#845EF7" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#F02B3A" stop-opacity="1"/>
              </linearGradient>
              <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Active Connecting Web Strands -->
            <path id="web-path-line" class="web-svg-path ${this.isAnimatingCompletion ? 'web-animating-draw' : ''}" 
                  d="M 90 60 C 180 20, 270 20, 360 60 C 450 100, 540 100, 630 60 C 720 20, 810 20, 850 60" 
                  stroke="url(#webGradientGlow)" stroke-width="3" fill="none" filter="url(#cyanGlow)" />
          </svg>

          <!-- Asymmetric Web Nodes Layout -->
          <div class="web-chain-container ${this.isWebExpanded ? 'mobile-expanded' : ''}">
            <!-- Node 1: Large Action Node -->
            <div class="web-node node-action node-hero-action">
              <span class="node-badge">1. ACTIVE ACTION</span>
              <div class="node-title">${nextMoveAction ? this.escapeHtml(nextMoveAction.title) : 'No Action'}</div>
              <span class="node-meta">${nextMoveAction ? `${nextMoveAction.estimatedMinutes}m Focus Block` : '---'}</span>
            </div>

            <!-- Mobile Connector Strand -->
            <div class="web-connector-mobile" aria-hidden="true"></div>

            <!-- Node 2: Affected Domain Node -->
            <div class="web-node node-domain secondary-web-detail">
              <span class="node-badge">2. TARGET DOMAIN</span>
              <div class="node-title text-cyan">${nextMoveAction ? nextMoveAction.domain || 'Engineering' : '---'}</div>
              <span class="node-meta">${nextMoveAction ? nextMoveAction.campaign : 'General Ops'}</span>
            </div>

            <div class="web-connector-mobile secondary-web-detail" aria-hidden="true"></div>

            <!-- Node 3: Attribute Growth Node -->
            <div class="web-node node-attribute secondary-web-detail">
              <span class="node-badge">3. STAT GAIN</span>
              <div class="node-title text-amber">
                +${predictedBreakdown ? predictedBreakdown.attributeGain.points : 2} ${predictedBreakdown ? predictedBreakdown.attributeGain.name : 'Intelligence'}
              </div>
              <span class="node-meta">Permanent Stat</span>
            </div>

            <div class="web-connector-mobile secondary-web-detail" aria-hidden="true"></div>

            <!-- Node 4: Equipped Card Modifiers Node -->
            <div class="web-node node-loadout secondary-web-detail">
              <span class="node-badge">4. LOADOUT BOOSTS</span>
              <div class="node-title">
                ${loadout ? loadout.slice(0, 2).map(l => l.name).join(', ') : 'Suit Active'}
              </div>
              <span class="node-meta">+20% Damage / +15% XP</span>
            </div>

            <div class="web-connector-mobile" aria-hidden="true"></div>

            <!-- Node 5: Boss Impact Node -->
            <div class="web-node node-damage node-hero-impact">
              <span class="node-badge">5. BOSS IMPACT</span>
              <div class="node-title text-red">
                -${predictedBreakdown ? predictedBreakdown.bossDamage.rawDamage : 240} Armor Dmg
              </div>
              <span class="node-meta">+${predictedBreakdown ? predictedBreakdown.finalXp : 180} XP / +${predictedBreakdown ? predictedBreakdown.finalGold : 120} Gold</span>
            </div>
          </div>
        </section>

        <!-- SECTION 3: TODAY LOADOUT (Tactile Horizontal Snap Belt) -->
        <section class="today-loadout-section" aria-label="Today Loadout Equipped Cards">
          <div class="section-title-row">
            <div>
              <span class="telemetry-text text-cyan">FIELD GEAR // 5 EQUIPPED</span>
              <h3>TODAY LOADOUT</h3>
            </div>
            <span class="loadout-scroll-hint mobile-only">Swipe for loadout →</span>
          </div>

          <div class="loadout-snap-rail">
            ${loadout.map(item => `
              <div class="loadout-card dossier-card" data-id="${item.id}" tabindex="0">
                <div class="loadout-card-header">
                  <div class="loadout-art-container">
                    ${getIcon(item.localArtKey || 'artPeter')}
                  </div>
                  <span class="loadout-category">${item.category}</span>
                </div>
                <div class="loadout-card-body">
                  <h4 class="loadout-name">${item.name}</h4>
                  <p class="loadout-desc">${item.description}</p>
                </div>
                <div class="loadout-card-footer">
                  <span class="status-badge completed" style="font-size: 0.65rem; padding: 2px 6px;">EQUIPPED</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- SECTION 4: MISSION OBJECTIVES QUEUE (Compact & Quieter) -->
        <section class="action-queue-section dossier-card" aria-label="Mission Objectives Queue">
          <div class="actions-section-header">
            <div>
              <span class="telemetry-text text-muted">TACTICAL QUEUE</span>
              <h3>MISSION OBJECTIVES</h3>
            </div>

            <div class="queue-controls-group">
              <div class="filter-tabs" id="filter-tabs">
                <button class="filter-tab ${this.currentFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">ALL (${totalCount})</button>
                <button class="filter-tab ${this.currentFilter === 'PENDING' ? 'active' : ''}" data-filter="PENDING">PENDING (${pendingCount})</button>
                <button class="filter-tab ${this.currentFilter === 'COMPLETED' ? 'active' : ''}" data-filter="COMPLETED">DONE (${completedCount})</button>
              </div>

              <button class="btn btn-secondary" id="btn-open-add-modal" style="padding: 6px 12px; font-size: 0.8rem;">
                ${getIcon('plus')} NEW DOSSIER
              </button>
            </div>
          </div>

          <div class="actions-list" id="actions-list">
            ${filteredActions.length === 0 ? `
              <div class="empty-state">
                <p>No mission dossiers match the selected filter.</p>
              </div>
            ` : filteredActions.map(action => this.renderActionCard(action, focusSession)).join('')}
          </div>
        </section>

        <!-- SECTION 5: REWARD BREAKDOWN MODAL DIALOG (Bottom Sheet on Mobile) -->
        ${lastRewardBreakdown ? this.renderRewardBreakdownModal(lastRewardBreakdown) : ''}

        <!-- Add Objective Form Modal -->
        <div class="modal-backdrop ${this.isAddModalOpen ? 'open' : ''}" id="add-action-modal" role="dialog" aria-modal="true" aria-labelledby="add-modal-title">
          <div class="modal-card">
            <div class="modal-header">
              <h3 id="add-modal-title">CREATE MISSION DOSSIER</h3>
              <button class="btn-icon-only" id="btn-close-add-modal" aria-label="Close modal">${getIcon('close')}</button>
            </div>
            <form id="add-action-form">
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label" for="action-title">Objective Title *</label>
                  <input type="text" id="action-title" class="form-input" placeholder="e.g. Production PostgreSQL Migration" required />
                </div>

                <div class="form-group">
                  <label class="form-label" for="action-reason">Why It Matters (Reason)</label>
                  <input type="text" id="action-reason" class="form-input" placeholder="e.g. Prevents Doc Ock mainframe breach" />
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-group">
                    <label class="form-label" for="action-domain">Domain</label>
                    <select id="action-domain" class="form-select">
                      <option value="Engineering" selected>Engineering</option>
                      <option value="Sales">Sales</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Focus">Focus</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="action-priority">Priority</label>
                    <select id="action-priority" class="form-select">
                      <option value="HIGH">HIGH (1.5x Multiplier)</option>
                      <option value="MEDIUM" selected>MEDIUM (Standard)</option>
                      <option value="LOW">LOW (0.75x Multiplier)</option>
                    </select>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                  <div class="form-group">
                    <label class="form-label" for="action-time">Est. Mins</label>
                    <input type="number" id="action-time" class="form-input" value="30" min="5" step="5" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="action-xp">Base XP</label>
                    <input type="number" id="action-xp" class="form-input" value="120" min="10" step="10" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="action-gold">Base Gold</label>
                    <input type="number" id="action-gold" class="form-input" value="80" min="5" step="5" />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="btn-cancel-add-modal">Cancel</button>
                <button type="submit" class="btn btn-primary">${getIcon('plus')} CREATE DOSSIER</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.setupKeyboardListeners();
  }

  renderActionCard(action, focusSession) {
    const isCompleted = action.status === 'COMPLETED';
    const isFocusTarget = focusSession.actionId === action.id && focusSession.active;

    return `
      <div class="action-item-card ${isCompleted ? 'completed' : ''}" data-id="${action.id}">
        <button class="checkbox-btn btn-toggle-complete" data-id="${action.id}" title="${isCompleted ? 'Re-open' : 'Mark Completed'}" aria-label="Toggle completed state">
          ${isCompleted ? getIcon('check') : ''}
        </button>

        <div class="action-main-info">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="action-title">
              ${this.escapeHtml(action.title)}
            </span>
            ${isFocusTarget ? `<span class="status-badge in-progress">FOCUSED</span>` : ''}
          </div>
          ${action.reason ? `<p class="action-sub-reason">${this.escapeHtml(action.reason)}</p>` : ''}
          <div class="action-meta-row">
            <span class="tag-pill priority-${action.priority.toLowerCase()}">${action.priority}</span>
            <span class="tag-pill text-cyan">${action.domain || 'Engineering'}</span>
            <span class="tag-pill text-amber">+${action.rewardXp} XP</span>
            <span class="tag-pill text-amber">+${action.rewardGold} G</span>
            <span class="tag-pill">${getIcon('clock')} ${action.estimatedMinutes}m</span>
          </div>
        </div>

        <div class="action-controls">
          ${!isCompleted ? `
            <button class="btn btn-primary btn-complete-card" data-id="${action.id}">
              ${getIcon('check')} RESOLVE
            </button>
            <button class="btn btn-secondary btn-focus-target" data-id="${action.id}">
              ${isFocusTarget ? 'PAUSE' : 'FOCUS'}
            </button>
          ` : ''}
          <button class="btn-icon-only btn-delete-action" data-id="${action.id}" title="Delete Dossier" aria-label="Delete action">
            ${getIcon('trash')}
          </button>
        </div>
      </div>
    `;
  }

  renderRewardBreakdownModal(bd) {
    return `
      <div class="modal-backdrop open reward-modal-backdrop" id="reward-breakdown-modal" role="dialog" aria-modal="true" aria-labelledby="reward-modal-title">
        <div class="modal-card reward-modal-card">
          <!-- Mobile Bottom Sheet Drag Handle -->
          <div class="bottom-sheet-handle" aria-hidden="true"></div>

          <div class="modal-header accent-header-red">
            <div>
              <span class="telemetry-text text-amber">TRANSACTION RESOLVED #${bd.transactionId}</span>
              <h3 id="reward-modal-title">STRIKE RESOLVED - IMPACT REPORT</h3>
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

              <div class="breakdown-row">
                <span>Domain Match Bonus:</span>
                <strong class="mono-value text-cyan">${bd.domainMatchMultiplier}x</strong>
              </div>

              <div class="breakdown-row">
                <span>Equipped Loadout Modifiers:</span>
                <strong class="mono-value text-amber">
                  +${bd.loadoutModifiersApplied.damageBonusPct}% Dmg, +${bd.loadoutModifiersApplied.xpBonusPct}% XP, +${bd.loadoutModifiersApplied.flatArmorBonus} Armor Pen
                </strong>
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

  /**
   * Orchestrated 700–1000ms completion sequence:
   * web strand draws -> impact flash on boss -> reward sheet rises
   */
  triggerOrchestratedCompletion(actionId) {
    if (this.isAnimatingCompletion) return;
    this.isAnimatingCompletion = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      stateStore.completeAction(actionId);
      this.isAnimatingCompletion = false;
      return;
    }

    // Step 1: Web strand draws glow line (0ms)
    const webPath = document.getElementById('web-path-line');
    if (webPath) {
      webPath.classList.add('web-animating-draw');
    }

    // Step 2: Impact flash on boss threat card (350ms)
    setTimeout(() => {
      const bossCard = document.getElementById('boss-threat-card');
      if (bossCard) {
        bossCard.classList.add('boss-impact-flash');
      }
    }, 350);

    // Step 3: Complete state action & open reward sheet (750ms)
    setTimeout(() => {
      stateStore.completeAction(actionId);
      this.isAnimatingCompletion = false;
    }, 750);
  }

  bindEvents() {
    // Next move completion button (Orchestrated sequence)
    const btnCompleteNextMove = document.getElementById('btn-complete-next-move');
    if (btnCompleteNextMove) {
      btnCompleteNextMove.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) this.triggerOrchestratedCompletion(id);
      });
    }

    // Next move focus button
    const btnFocusNextMove = document.getElementById('btn-focus-next-move');
    if (btnFocusNextMove) {
      btnFocusNextMove.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) stateStore.toggleFocus(id);
      });
    }

    // Mobile Living Web toggle
    const btnToggleWeb = document.getElementById('btn-toggle-web-details');
    if (btnToggleWeb) {
      btnToggleWeb.addEventListener('click', () => {
        this.isWebExpanded = !this.isWebExpanded;
        const webContainer = this.containerEl.querySelector('.web-chain-container');
        if (webContainer) {
          if (this.isWebExpanded) {
            webContainer.classList.add('mobile-expanded');
          } else {
            webContainer.classList.remove('mobile-expanded');
          }
        }
        btnToggleWeb.querySelector('span:first-child').textContent = this.isWebExpanded ? 'Hide details' : 'Why this reward?';
        btnToggleWeb.querySelector('.icon-inline').innerHTML = getIcon(this.isWebExpanded ? 'chevronUp' : 'chevronDown');
      });
    }

    // Complete action inside queue card list
    this.containerEl.querySelectorAll('.btn-complete-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) this.triggerOrchestratedCompletion(id);
      });
    });

    // Checkbox buttons inside list
    this.containerEl.querySelectorAll('.btn-toggle-complete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const state = stateStore.getState();
        const action = state.actions.find(a => a.id === id);
        if (action) {
          if (action.status === 'COMPLETED') {
            stateStore.reopenAction(id);
          } else {
            this.triggerOrchestratedCompletion(id);
          }
        }
      });
    });

    // Focus target buttons
    this.containerEl.querySelectorAll('.btn-focus-target').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) stateStore.toggleFocus(id);
      });
    });

    // Delete buttons
    this.containerEl.querySelectorAll('.btn-delete-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id && confirm('Delete this mission objective dossier?')) {
          stateStore.deleteAction(id);
        }
      });
    });

    // Filter tab clicks
    const filterTabs = document.getElementById('filter-tabs');
    if (filterTabs) {
      filterTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (tab) {
          this.currentFilter = tab.getAttribute('data-filter');
          this.render();
        }
      });
    }

    // Claim reward modal dismiss button
    const btnClaimRewards = document.getElementById('btn-claim-rewards');
    const btnCloseRewardModal = document.getElementById('btn-close-reward-modal');

    const dismissRewardHandler = () => {
      stateStore.dismissRewardBreakdown();
    };

    if (btnClaimRewards) btnClaimRewards.addEventListener('click', dismissRewardHandler);
    if (btnCloseRewardModal) btnCloseRewardModal.addEventListener('click', dismissRewardHandler);

    // Add objective modal controls
    const btnOpenAddModal = document.getElementById('btn-open-add-modal');
    const btnCloseAddModal = document.getElementById('btn-close-add-modal');
    const btnCancelAddModal = document.getElementById('btn-cancel-add-modal');
    const addActionForm = document.getElementById('add-action-form');

    if (btnOpenAddModal) {
      btnOpenAddModal.addEventListener('click', () => {
        this.isAddModalOpen = true;
        const modal = document.getElementById('add-action-modal');
        if (modal) modal.classList.add('open');
      });
    }

    const closeAddModalHandler = () => {
      this.isAddModalOpen = false;
      const modal = document.getElementById('add-action-modal');
      if (modal) modal.classList.remove('open');
    };

    if (btnCloseAddModal) btnCloseAddModal.addEventListener('click', closeAddModalHandler);
    if (btnCancelAddModal) btnCancelAddModal.addEventListener('click', closeAddModalHandler);

    if (addActionForm) {
      addActionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('action-title').value;
        const reason = document.getElementById('action-reason').value;
        const domain = document.getElementById('action-domain').value;
        const priority = document.getElementById('action-priority').value;
        const estimatedMinutes = document.getElementById('action-time').value;
        const rewardXp = document.getElementById('action-xp').value;
        const rewardGold = document.getElementById('action-gold').value;

        if (title.trim()) {
          stateStore.addAction({
            title,
            reason,
            domain,
            priority,
            estimatedMinutes,
            rewardXp,
            rewardGold
          });
          closeAddModalHandler();
        }
      });
    }
  }

  setupKeyboardListeners() {
    if (this.boundKeyHandler) {
      window.removeEventListener('keydown', this.boundKeyHandler);
    }

    this.boundKeyHandler = (e) => {
      if (e.key === 'Escape') {
        const state = stateStore.getState();
        if (state.lastRewardBreakdown) {
          stateStore.dismissRewardBreakdown();
        } else if (this.isAddModalOpen) {
          this.isAddModalOpen = false;
          const modal = document.getElementById('add-action-modal');
          if (modal) modal.classList.remove('open');
        }
      }
    };

    window.addEventListener('keydown', this.boundKeyHandler);
  }

  filterActionsList(actions, filter) {
    if (filter === 'PENDING') return actions.filter(a => a.status !== 'COMPLETED');
    if (filter === 'COMPLETED') return actions.filter(a => a.status === 'COMPLETED');
    return actions;
  }

  updateTimerDisplay(session) {
    const timerEl = document.getElementById('hero-focus-timer');
    if (timerEl && session) {
      const mins = String(Math.floor(session.secondsRemaining / 60)).padStart(2, '0');
      const secs = String(session.secondsRemaining % 60).padStart(2, '0');
      timerEl.textContent = `${mins}:${secs}`;
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
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
    toast.style.boxShadow = 'var(--shadow-glow-cyan)';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '500';
    toast.textContent = msg;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
}

