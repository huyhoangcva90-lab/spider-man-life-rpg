/* ==========================================================================
   V4 ARSENAL VIEW (EQUIPPED LOADOUT & SPIDER COLLECTION CATALOG)
   Maintains 5 equipped loadout cards with high-quality collection placeholders for
   Spider variants, suits, tech skills, gadgets, and allies.
   ========================================================================== */

import { stateStore } from '../core/StateStore.js';
import { eventBus } from '../core/EventBus.js';
import { EVENTS } from '../config/constants.js';
import { getIcon } from './icons.js';

export class ArsenalView {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.activeTab = 'EQUIPPED'; // 'EQUIPPED' | 'SUITS' | 'GADGETS' | 'SKILLS' | 'ALLIES'

    eventBus.on(EVENTS.STATE_CHANGED, () => {
      if (this.isCurrentRoute()) {
        this.render();
      }
    });
  }

  isCurrentRoute() {
    return window.location.hash === '#/arsenal';
  }

  render() {
    const state = stateStore.getState();
    const loadout = state.loadout || [];

    this.containerEl.innerHTML = `
      <div class="arsenal-view-container">
        <!-- Header -->
        <div class="arsenal-header-row">
          <div>
            <span class="telemetry-text text-cyan">FIELD TACTICAL LOADOUT // LEVEL 3 ARSENAL</span>
            <h2>SPIDER ARSENAL & SUIT CATALOG</h2>
            <p class="text-muted" style="font-size: 0.84rem;">Manage 5 equipped operational modifiers & inspect locked tactical variants.</p>
          </div>

          <div class="filter-tabs" id="arsenal-tabs">
            <button class="filter-tab ${this.activeTab === 'EQUIPPED' ? 'active' : ''}" data-tab="EQUIPPED">EQUIPPED (5/5)</button>
            <button class="filter-tab ${this.activeTab === 'SUITS' ? 'active' : ''}" data-tab="SUITS">SUITS & VARIANTS</button>
            <button class="filter-tab ${this.activeTab === 'GADGETS' ? 'active' : ''}" data-tab="GADGETS">GADGETS</button>
            <button class="filter-tab ${this.activeTab === 'SKILLS' ? 'active' : ''}" data-tab="SKILLS">SKILLS</button>
            <button class="filter-tab ${this.activeTab === 'ALLIES' ? 'active' : ''}" data-tab="ALLIES">ALLIES</button>
          </div>
        </div>

        ${this.activeTab === 'EQUIPPED' ? this.renderEquippedSection(loadout) : this.renderCollectionCatalog(this.activeTab)}
      </div>
    `;

    this.bindEvents();
  }

  renderEquippedSection(loadout) {
    return `
      <section class="equipped-section dossier-card accent-cyan">
        <div style="margin-bottom: 16px;">
          <h3 class="text-cyan">${getIcon('shield', 'text-cyan icon-inline')} CURRENTLY EQUIPPED LOADOUT</h3>
          <p style="font-size: 0.82rem; color: var(--color-ink-muted);">All 5 equipped cards actively multiply XP, Gold yield, and boss armor penetration during strikes.</p>
        </div>

        <div class="equipped-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          ${loadout.map(item => `
            <div class="dossier-card loadout-item-card accent-cyan">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <div class="loadout-art-container">
                  ${getIcon(item.localArtKey || 'artPeter')}
                </div>
                <div>
                  <span class="loadout-category">${item.category}</span>
                  <h4 style="font-size: 0.95rem; color: var(--color-newsprint-bone);">${item.name}</h4>
                </div>
              </div>
              <p style="font-size: 0.78rem; color: var(--color-ink-secondary); margin-bottom: 12px;">${item.description}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="status-badge completed" style="font-size: 0.65rem;">EQUIPPED</span>
                <span class="tag-pill text-cyan">ACTIVE MODIFIER</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  renderCollectionCatalog(category) {
    const catalogData = {
      SUITS: [
        { name: 'Advanced Suit 2.0', status: 'EQUIPPED', desc: '+20% Base Damage to Doc Ock', category: 'Suit', art: 'artSuit' },
        { name: 'Classic Red & Blue Suit', status: 'UNLOCKED', desc: '+10% Focus stability on Engineering tasks', category: 'Suit', art: 'artSuit' },
        { name: 'Iron Spider Armor', status: 'LOCKED', desc: 'Requires Rank 5 Operative & 1000 Gold', category: 'Suit Variant', art: 'artSuit' },
        { name: 'Stealth Noir Trenchcoat', status: 'LOCKED', desc: 'Requires 14 Resistance Protocols active', category: 'Suit Variant', art: 'artSuit' }
      ],
      GADGETS: [
        { name: 'Web-Shooter', status: 'EQUIPPED', desc: '+10% Duration Multiplier & Quick Web Constraints', category: 'Gadget', art: 'artShooter' },
        { name: 'Impact Web', status: 'EQUIPPED', desc: '+40 Heavy Impact Armor Damage', category: 'Gadget', art: 'artImpact' },
        { name: 'Sonic Disruptor', status: 'UNLOCKED', desc: '+30 Stagger Gain per strike against Doc Ock', category: 'Gadget', art: 'artShooter' },
        { name: 'Spider-Drone Mk II', status: 'LOCKED', desc: 'Auto-completes 1 low priority daily subtask', category: 'Gadget', art: 'artShooter' }
      ],
      SKILLS: [
        { name: 'Web Swing Momentum', status: 'UNLOCKED', desc: '+15% Agility XP on Wellness missions', category: 'Skill', art: 'artImpact' },
        { name: 'Spider-Sense Dodge', status: 'UNLOCKED', desc: 'Negates 1 missed habit streak penalty', category: 'Skill', art: 'artImpact' },
        { name: 'Focus Concentration', status: 'LOCKED', desc: '+25% XP bonus during 45m Focus sessions', category: 'Skill', art: 'artImpact' }
      ],
      ALLIES: [
        { name: 'Mary Jane', status: 'EQUIPPED', desc: '+25% Gold Yield & Focus Stability', category: 'Ally', art: 'artMj' },
        { name: 'Miles Morales', status: 'UNLOCKED', desc: '+15% Stagger impact & Dual Strike chance', category: 'Ally', art: 'artPeter' },
        { name: 'Gwen Stacy', status: 'LOCKED', desc: 'Requires Master Story Arc Goal #1 achieved', category: 'Ally', art: 'artPeter' }
      ]
    };

    const items = catalogData[category] || [];

    return `
      <section class="catalog-section dossier-card accent-amber">
        <div style="margin-bottom: 16px;">
          <h3 class="text-amber">${getIcon('matrix', 'text-amber icon-inline')} ${category} COLLECTION CATALOG</h3>
          <p style="font-size: 0.82rem; color: var(--color-ink-muted);">Collection placeholders for future unlockable Spider gear and tactical variants.</p>
        </div>

        <div class="catalog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
          ${items.map(item => `
            <div class="dossier-card catalog-card ${item.status === 'EQUIPPED' ? 'accent-cyan' : (item.status === 'UNLOCKED' ? 'accent-amber' : 'accent-muted')}" style="opacity: ${item.status === 'LOCKED' ? '0.6' : '1'};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h4 style="font-size: 0.95rem; color: var(--color-newsprint-bone);">${item.name}</h4>
                <span class="status-badge ${item.status === 'EQUIPPED' ? 'completed' : (item.status === 'UNLOCKED' ? 'in-progress' : 'pending')}">
                  ${item.status}
                </span>
              </div>
              <p style="font-size: 0.78rem; color: var(--color-ink-secondary); margin-bottom: 12px;">${item.desc}</p>
              <div style="display: flex; justify-content: flex-end;">
                <button class="btn btn-secondary" ${item.status === 'LOCKED' ? 'disabled' : ''} style="font-size: 0.75rem; padding: 4px 10px;">
                  ${item.status === 'EQUIPPED' ? 'Equipped' : (item.status === 'UNLOCKED' ? 'Equip Gear' : 'Locked')}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  bindEvents() {
    const tabs = document.getElementById('arsenal-tabs');
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-tab');
        if (btn) {
          this.activeTab = btn.getAttribute('data-tab');
          this.render();
        }
      });
    }
  }
}
