/* ==========================================================================
   V5 MAIN APP ENTRY POINT
   NEON NOIR LIVING CITY - TRUE GAME REBUILD
   ========================================================================== */

import { eventBus } from './core/EventBus.js';
import { stateStore } from './core/StateStore.js';
import { CityMapCanvas } from './game/CityMapCanvas.js';
import { focusManager } from './game/FocusManager.js';
import { HudController } from './ui/HudController.js';
import { BriefingDrawer } from './ui/BriefingDrawer.js';
import { FocusOverlay } from './ui/FocusOverlay.js';
import { StrikeOverlay } from './ui/StrikeOverlay.js';
import { OperativeView } from './ui/OperativeView.js';
import { MissionsView } from './ui/MissionsView.js';
import { HideoutView } from './ui/HideoutView.js';
import { ChronicleView } from './ui/ChronicleView.js';
import { NavigationDock } from './ui/NavigationDock.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[V5 Main] Initializing Neon Noir Living City RPG application...');

  // Initialize UI Controllers & Views
  const cityMap = new CityMapCanvas('city-map-container');
  const hud = new HudController('hud-container');
  const briefing = new BriefingDrawer('briefing-drawer-container');
  const focus = new FocusOverlay('focus-overlay-container');
  const strike = new StrikeOverlay('strike-overlay-container');
  const operative = new OperativeView('operative-view-container');
  const missions = new MissionsView('missions-view-container');
  const hideout = new HideoutView('hideout-view-container');
  const chronicle = new ChronicleView('chronicle-view-container');
  const dock = new NavigationDock('navigation-dock-container');

  // Helper to dynamically update primary prompt overlay label
  const updatePromptButton = () => {
    const promptBtn = document.getElementById('btn-primary-prompt');
    if (!promptBtn) return;
    const state = stateStore.getState();
    const pending = (state.missions || []).filter(m => m.status === 'PENDING');
    const targetMission = pending.find(m => m.priority === 'HIGH') || pending[0];
    
    const prefixElem = promptBtn.querySelector('.prompt-prefix');
    const titleElem = promptBtn.querySelector('.prompt-title');

    if (targetMission) {
      if (prefixElem) prefixElem.textContent = 'XEM BRIEFING:';
      if (titleElem) titleElem.textContent = targetMission.title;
    } else {
      if (prefixElem) prefixElem.textContent = '';
      if (titleElem) titleElem.textContent = '✓ TẤT CẢ NHIỆM VỤ ĐÃ HOÀN THÀNH';
    }
  };

  eventBus.on('STATE_INITIALIZED', updatePromptButton);
  eventBus.on('STATE_UPDATED', updatePromptButton);
  eventBus.on('MISSION_COMPLETED', updatePromptButton);

  // Initialize State Store & Load Notion Snapshot
  await stateStore.initialize();
  updatePromptButton();

  // Primary Prompt overlay action handler
  const promptBtn = document.getElementById('btn-primary-prompt');
  if (promptBtn) {
    promptBtn.addEventListener('click', () => {
      // Find first active pending mission used by primary CTA
      const state = stateStore.getState();
      const pending = (state.missions || []).filter(m => m.status === 'PENDING');
      const targetMission = pending.find(m => m.priority === 'HIGH') || pending[0];
      if (targetMission) {
        stateStore.selectMission(targetMission.id);
      } else {
        stateStore.setView('missions');
      }
    });
  }

  // Camera Reset Button
  const resetCamBtn = document.getElementById('btn-reset-camera');
  if (resetCamBtn) {
    resetCamBtn.addEventListener('click', () => {
      cityMap.resetCamera();
    });
  }

  console.log('[V5 Main] Application successfully loaded & running.');
});
