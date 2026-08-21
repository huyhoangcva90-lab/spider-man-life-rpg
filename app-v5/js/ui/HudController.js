/* ==========================================================================
   V5 HUD CONTROLLER
   Compact diegetic HUD overlay (Level/XP, Focus, Threat Boss, Weather, Notion badge)
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class HudController {
  constructor(hudContainerId) {
    this.container = document.getElementById(hudContainerId);
    if (!this.container) return;

    this.init();
  }

  init() {
    this.render();
    eventBus.on('STATE_UPDATED', () => this.render());
    eventBus.on('STATE_INITIALIZED', () => this.render());
  }

  render() {
    const state = stateStore.getState();
    const op = state.operative || {};
    const boss = state.threatBoss || {};

    const xpPct = Math.min(100, Math.round((op.xp / op.maxXp) * 100));

    this.container.innerHTML = `
      <div class="hud-wrapper">
        
        <!-- Top Left: Operative & Level Stats -->
        <div class="hud-card hud-operative">
          <div class="hud-hero-avatar">
            <img src="../app-v4/assets/characters/web-operative-v1.png" alt="Hero Avatar" onerror="this.src='assets/characters/web-operative-v1.png'; this.onerror=null;" />
            <div class="avatar-status-dot"></div>
          </div>
          <div class="hud-hero-info">
            <div class="hero-name-row">
              <span class="hero-name">${op.name || 'Vũ'}</span>
              <span class="hero-tag">LVL ${op.level || 5}</span>
            </div>
            <div class="hero-subtext">Đặc Vụ Web (29t, Freelancer)</div>
            
            <!-- XP Progress Bar -->
            <div class="hud-bar-container">
              <div class="bar-fill bar-xp" style="width: ${xpPct}%;"></div>
              <span class="bar-label">${op.xp || 0} / ${op.maxXp || 1000} XP</span>
            </div>
          </div>
        </div>

        <!-- Top Center: Diegetic Threat Boss Monitor -->
        <div class="hud-card hud-threat">
          <div class="threat-header">
            <span class="threat-alert-icon">⚠️</span>
            <span class="threat-title">${boss.name || 'BÓNG MA CYBER'}</span>
            <span class="threat-pct">${boss.corruptionPct || 0}% NHIỄM ĐỘC</span>
          </div>
          <div class="hud-bar-container threat-hp-bar">
            <div class="bar-fill bar-hp" style="width: ${boss.corruptionPct || 0}%;"></div>
            <span class="bar-label">${boss.hp || 0} / ${boss.maxHp || 3000} HP TRÙM</span>
          </div>
        </div>

        <!-- Top Right: Telemetry & Notion Provenance Badge -->
        <div class="hud-card hud-telemetry">
          <div class="telemetry-item">
            <span class="tele-icon">🌧️</span>
            <span class="tele-text">MƯA NEON 28°C</span>
          </div>
          <div class="telemetry-item">
            <span class="tele-icon">🪙</span>
            <span class="tele-val">${op.gold || 0} GOLD</span>
          </div>
          <div class="notion-snapshot-badge" title="Dữ liệu snapshot từ Notion snapshot, không phải live sync">
            <span class="notion-dot"></span> Notion Snapshot
          </div>
        </div>

      </div>
    `;
  }
}
