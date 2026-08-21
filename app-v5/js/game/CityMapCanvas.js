/* ==========================================================================
   V5 CITY MAP CANVAS & SVG INTERACTIVE LIVING CITY RENDERER
   Full-viewport interactive NEON NOIR Living City Map
   ========================================================================== */

import { eventBus } from '../core/EventBus.js';
import { stateStore } from '../core/StateStore.js';

export class CityMapCanvas {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    // Rain particles
    this.particles = [];
    this.maxParticles = 140;

    // Pan & Zoom state
    this.transform = { x: 0, y: 0, scale: 1 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };

    // District definitions with fixed spatial center coordinates (world space 2000x1400)
    this.districts = [
      { id: 'district-knowledge', name: 'Phân Khu Tri Thức', label: 'KNOWLEDGE SECTOR', x: 450, y: 350, width: 420, height: 320, color: '#22D3EE' },
      { id: 'district-finance', name: 'Khu Tài Chính & Analytics', label: 'FINANCE & DATA', x: 1350, y: 320, width: 440, height: 340, color: '#F5B942' },
      { id: 'district-core', name: 'Lõi Trung Tâm', label: 'COMMAND CORE', x: 920, y: 650, width: 380, height: 320, color: '#22D3EE' },
      { id: 'district-wellness', name: 'Lưới Thói Quen & Thể Chất', label: 'WELLNESS & HABITS', x: 420, y: 920, width: 440, height: 340, color: '#22D3EE' },
      { id: 'district-life', name: 'Tổ Hợp Cuộc Sống', label: 'LIFE OPERATING SYSTEM', x: 1380, y: 950, width: 420, height: 320, color: '#F43F5E' }
    ];

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('orientationchange', () => this.resizeCanvas());

    this.initRainParticles();
    this.setupInteractions();
    this.renderSvgOverlay();

    // Start animation loop
    this.animate();

    // Listen to state changes & view events
    eventBus.on('STATE_INITIALIZED', () => {
      this.resetCamera();
      this.renderSvgOverlay();
    });

    eventBus.on('STATE_UPDATED', () => {
      this.renderSvgOverlay();
    });

    eventBus.on('MISSION_COMPLETED', () => {
      this.triggerPurificationWave();
      this.resetCamera();
      this.renderSvgOverlay();
    });

    eventBus.on('VIEW_CHANGED', (viewName) => {
      if (viewName === 'world') {
        this.resetCamera();
        this.renderSvgOverlay();
      }
    });
  }

  resizeCanvas() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.resetCamera();
  }

  initRainParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 12 + 8,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  setupInteractions() {
    // Mouse drag pan
    this.container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.beacon-node') || e.target.closest('.district-badge')) return;
      this.isDragging = true;
      this.dragStart = { x: e.clientX - this.transform.x, y: e.clientY - this.transform.y };
      this.container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.transform.x = e.clientX - this.dragStart.x;
      this.transform.y = e.clientY - this.dragStart.y;
      this.updateSvgTransform();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.container.style.cursor = 'grab';
    });

    // Touch support for mobile
    let touchStart = { x: 0, y: 0 };
    this.container.addEventListener('touchstart', (e) => {
      if (e.target.closest('.beacon-node') || e.target.closest('.district-badge')) return;
      if (e.touches.length === 1) {
        this.isDragging = true;
        touchStart = { x: e.touches[0].clientX - this.transform.x, y: e.touches[0].clientY - this.transform.y };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      this.transform.x = e.touches[0].clientX - touchStart.x;
      this.transform.y = e.touches[0].clientY - touchStart.y;
      this.updateSvgTransform();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Wheel Zoom
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newScale = Math.min(Math.max(0.6, this.transform.scale * zoomFactor), 2.2);
      this.transform.scale = newScale;
      this.updateSvgTransform();
    }, { passive: false });
  }

  focusDistrict(districtId) {
    const dist = this.districts.find(d => d.id === districtId);
    if (!dist) return;

    // Pan camera to center on district
    const targetX = (this.width / 2) - (dist.x * this.transform.scale);
    const targetY = (this.height / 2) - (dist.y * this.transform.scale);

    this.transform.x = targetX;
    this.transform.y = targetY;
    this.updateSvgTransform();
  }

  getTargetMissionCoords() {
    const state = stateStore.getState();
    const missions = state.missions || [];
    const pending = missions.filter(m => m.status === 'PENDING');
    if (pending.length === 0) return null;

    const targetMission = pending.find(m => m.priority === 'HIGH') || pending[0];
    const idx = missions.findIndex(m => m.id === targetMission.id);
    if (idx === -1) return null;

    const dist = this.districts.find(d => d.id === targetMission.districtId) || this.districts[2];
    const indexInDistrict = missions.filter((m2, i2) => i2 < idx && m2.districtId === targetMission.districtId).length;
    const row = indexInDistrict % 2;
    const col = Math.floor(indexInDistrict / 2);

    const beaconX = (dist.x - dist.width / 2) + 70 + (row * 190);
    const beaconY = (dist.y - dist.height / 2) + 110 + (col * 90);

    return {
      mission: targetMission,
      district: dist,
      x: beaconX,
      y: beaconY
    };
  }

  resetCamera() {
    const targetInfo = this.getTargetMissionCoords();
    const isMobile = this.width <= 768;

    let targetWorldX = 920;
    let targetWorldY = 650;

    if (targetInfo) {
      targetWorldX = targetInfo.x;
      targetWorldY = targetInfo.y;
    }

    if (isMobile) {
      // Focus safe visible map region above CTA (top inset ~75px, bottom inset ~145px)
      const topOffset = 75;
      const bottomOffset = 145;
      const visibleCenterX = this.width / 2;
      const visibleCenterY = topOffset + (this.height - topOffset - bottomOffset) / 2;
      const scale = Math.min(this.width / 480, 0.72);

      this.transform = {
        scale: scale,
        x: visibleCenterX - (targetWorldX * scale),
        y: visibleCenterY - (targetWorldY * scale)
      };
    } else {
      // Desktop: Frame city map with active target mission centered
      const scale = Math.min(this.width / 1700, (this.height - 120) / 1100);
      const visibleCenterX = this.width / 2;
      const visibleCenterY = this.height / 2;

      this.transform = {
        scale: scale,
        x: visibleCenterX - (targetWorldX * scale),
        y: visibleCenterY - (targetWorldY * scale)
      };
    }
    this.updateSvgTransform();
  }

  updateSvgTransform() {
    const svgGroup = this.container.querySelector('#city-svg-group');
    if (svgGroup) {
      svgGroup.setAttribute('transform', `translate(${this.transform.x}, ${this.transform.y}) scale(${this.transform.scale})`);
    }
  }

  triggerPurificationWave() {
    const wave = document.createElement('div');
    wave.className = 'purification-pulse-wave';
    this.container.appendChild(wave);
    setTimeout(() => wave.remove(), 1200);
  }

  renderSvgOverlay() {
    let svgElem = this.container.querySelector('#city-svg-layer');
    if (!svgElem) {
      svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElem.id = 'city-svg-layer';
      svgElem.setAttribute('width', '100%');
      svgElem.setAttribute('height', '100%');
      svgElem.style.position = 'absolute';
      svgElem.style.top = '0';
      svgElem.style.left = '0';
      svgElem.style.pointerEvents = 'none';
      this.container.appendChild(svgElem);
    }

    const state = stateStore.getState();
    const missions = state.missions || [];
    const threatBoss = state.threatBoss || {};

    let html = `
      <g id="city-svg-group" transform="translate(${this.transform.x}, ${this.transform.y}) scale(${this.transform.scale})" style="pointer-events: auto;">
        
        <!-- Ambient City Vector Grid & Buildings -->
        <defs>
          <radialGradient id="threatGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.35"/>
            <stop offset="70%" stop-color="#F43F5E" stop-opacity="0.10"/>
            <stop offset="100%" stop-color="#05070D" stop-opacity="0"/>
          </radialGradient>
          
          <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#22D3EE" stop-opacity="0.2"/>
          </linearGradient>

          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Threat Boss Corruption Territory Circle -->
        <circle cx="920" cy="650" r="${300 * ((threatBoss.corruptionPct || 50) / 100) + 100}" fill="url(#threatGlow)" class="threat-zone-pulse" />

        <!-- Patrol Lines connecting Districts to Core -->
        <line x1="450" y1="350" x2="920" y2="650" stroke="url(#cyanLine)" stroke-width="2" stroke-dasharray="6,6" class="patrol-line" />
        <line x1="1350" y1="320" x2="920" y2="650" stroke="url(#cyanLine)" stroke-width="2" stroke-dasharray="6,6" class="patrol-line" />
        <line x1="420" y1="920" x2="920" y2="650" stroke="url(#cyanLine)" stroke-width="2" stroke-dasharray="6,6" class="patrol-line" />
        <line x1="1380" y1="950" x2="920" y2="650" stroke="url(#cyanLine)" stroke-width="2" stroke-dasharray="6,6" class="patrol-line" />

        <!-- District Outlines & Labels -->
        ${this.districts.map(d => `
          <g class="district-sector" id="${d.id}" transform="translate(${d.x - d.width/2}, ${d.y - d.height/2})" role="button" tabindex="0" aria-label="Phân khu đô thị: ${d.name} (${d.label})">
            <rect width="${d.width}" height="${d.height}" rx="12" fill="#111827" fill-opacity="0.65" stroke="${d.color}" stroke-width="1.5" stroke-opacity="0.5" filter="url(#neonGlow)" />
            <text x="20" y="32" fill="${d.color}" font-family="Barlow Condensed, sans-serif" font-size="14" font-weight="700" letter-spacing="2">${d.label}</text>
            <text x="20" y="54" fill="#E8EDF5" font-family="Be Vietnam Pro, sans-serif" font-size="16" font-weight="700">${d.name}</text>
          </g>
        `).join('')}

        <!-- Threat Boss Citadel Pin in Central Core -->
        <g class="boss-node" transform="translate(920, 650)" style="cursor: pointer;" role="region" aria-label="Khu vực Trùm Thành Phố: ${threatBoss.name || 'Threat Boss'}">
          <circle r="42" fill="#05070D" stroke="#F43F5E" stroke-width="3" filter="url(#neonGlow)" />
          <circle r="52" fill="none" stroke="#F43F5E" stroke-width="1" stroke-dasharray="8,4" class="boss-ring-spin" />
          <text x="0" y="-55" text-anchor="middle" fill="#F43F5E" font-family="Barlow Condensed, sans-serif" font-size="13" font-weight="800" letter-spacing="1">BOSS THREAT AREA</text>
          <text x="0" y="6" text-anchor="middle" fill="#F43F5E" font-size="20">👾</text>
          <text x="0" y="24" text-anchor="middle" fill="#E8EDF5" font-family="Share Tech Mono, monospace" font-size="11">${threatBoss.hp || 0} / ${threatBoss.maxHp || 3000} HP</text>
        </g>

        <!-- Mission Beacons Spatially Distributed -->
        ${missions.map((m, idx) => {
          const dist = this.districts.find(d => d.id === m.districtId) || this.districts[2];
          
          // Spatial offset within district rect
          const indexInDistrict = missions.filter((m2, i2) => i2 < idx && m2.districtId === m.districtId).length;
          const row = indexInDistrict % 2;
          const col = Math.floor(indexInDistrict / 2);
          const beaconX = (dist.x - dist.width / 2) + 70 + (row * 190);
          const beaconY = (dist.y - dist.height / 2) + 110 + (col * 90);

          const isDone = m.status === 'COMPLETED';
          const isHigh = m.priority === 'HIGH';
          const isMedium = m.priority === 'MEDIUM';
          const color = isDone ? '#10B981' : (isHigh ? '#F43F5E' : (isMedium ? '#F5B942' : '#22D3EE'));

          let symbol = '📡';
          if (m.domain.includes('Tài Chính') || m.domain.includes('Data')) symbol = '📊';
          else if (m.domain.includes('Tri Thức')) symbol = '📚';
          else if (m.domain.includes('Thể Chất') || m.domain.includes('Rèn Luyện')) symbol = '🏃';
          else if (m.domain.includes('Đời Sống')) symbol = '⚡';
          else if (isHigh) symbol = '⚠️';

          const shortTitle = m.title.length > 18 ? m.title.substring(0, 16) + '...' : m.title;
          const prioTag = isDone ? '✓ ĐÃ HOÀN THÀNH' : (isHigh ? '🔥 HIGH' : (isMedium ? '⚡ MED' : '🔹 LOW'));

          return `
            <g class="beacon-node ${isDone ? 'completed' : 'active'}" 
               data-id="${m.id}" 
               transform="translate(${beaconX}, ${beaconY})" 
               role="button" 
               tabindex="0" 
               aria-label="Tín hiệu nhiệm vụ: ${m.title}. ${isDone ? 'Đã hoàn thành' : 'Đang chờ tác chiến'}. Độ ưu tiên: ${m.priority}. Thưởng: ${m.rewardXp} XP, ${m.rewardGold} Gold."
               style="cursor: pointer;">
              
              <!-- 44px minimum hit target circle (r=24 => 48px) -->
              <circle r="24" fill="transparent" class="beacon-touch-target" />

              <!-- Outer pulse animation rings for active pending missions -->
              ${!isDone ? `
                <circle r="34" fill="none" stroke="${color}" stroke-width="2" opacity="0.8" class="beacon-pulse" />
                <circle r="24" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5" class="beacon-pulse-delay" />
              ` : ''}
              
              <!-- Inner core pin with category symbol -->
              <circle r="18" fill="#05070D" stroke="${color}" stroke-width="3" filter="url(#neonGlow)" />
              <text x="0" y="5" text-anchor="middle" font-size="13">${symbol}</text>

              <!-- Always-visible short readable label badge pill -->
              <g class="beacon-label-pill" transform="translate(0, 26)">
                <rect x="-70" y="0" width="140" height="24" rx="12" fill="#05070D" fill-opacity="0.92" stroke="${color}" stroke-width="1.5" filter="url(#neonGlow)" />
                <text x="0" y="16" text-anchor="middle" fill="#E8EDF5" font-family="Be Vietnam Pro, sans-serif" font-size="10" font-weight="700">${shortTitle}</text>
              </g>

              <!-- Detailed tooltip on hover / focus -->
              <g class="beacon-tooltip" transform="translate(24, -20)">
                <rect width="210" height="42" rx="8" fill="#05070D" fill-opacity="0.95" stroke="${color}" stroke-width="1.5" filter="url(#neonGlow)" />
                <text x="10" y="18" fill="#E8EDF5" font-family="Be Vietnam Pro, sans-serif" font-size="11" font-weight="700">${m.title.length > 22 ? m.title.substring(0, 20) + '...' : m.title}</text>
                <text x="10" y="32" fill="${color}" font-family="Share Tech Mono, monospace" font-size="10">${isDone ? '✓ ĐÃ HOÀN THÀNH' : `+${m.rewardXp} XP | +${m.rewardGold} Gold | ${prioTag}`}</text>
              </g>
            </g>
          `;
        }).join('')}

      </g>
    `;

    svgElem.innerHTML = html;

    // Attach click & keydown events to mission beacons for accessibility
    svgElem.querySelectorAll('.beacon-node').forEach(elem => {
      const selectHandler = (e) => {
        e.stopPropagation();
        const missionId = elem.getAttribute('data-id');
        if (missionId) {
          stateStore.selectMission(missionId);
        }
      };

      elem.addEventListener('click', selectHandler);
      elem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectHandler(e);
        }
      });
    });

    // Attach click & keydown events to district sectors
    svgElem.querySelectorAll('.district-sector').forEach(elem => {
      const focusHandler = (e) => {
        e.stopPropagation();
        this.focusDistrict(elem.id);
      };

      elem.addEventListener('click', focusHandler);
      elem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          focusHandler(e);
        }
      });
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw dark asphalt grid background
    this.ctx.fillStyle = '#05070D';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw rain particles
    this.ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    for (let p of this.particles) {
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x - 2, p.y + p.length);
      p.y += p.speed;
      p.x -= 0.5;

      if (p.y > this.height) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }
    }
    this.ctx.stroke();

    requestAnimationFrame(() => this.animate());
  }
}
