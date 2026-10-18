/* Presentation only: navigation, exact sprite cells, radar of existing map entries. */
export class TrackerMapChrome {
  constructor(bus, engine, repo, state) {
    Object.assign(this, { bus, engine, repo, state });
    this.openSide = null;
    this.menuChangedAt = 0;
  }

  init() {
    this.menu = document.getElementById('tracker-map-menu');
    this.alerts = document.getElementById('tracker-map-alerts');
    this.head = document.getElementById('btn-hub-menu');
    this.alertButton = document.getElementById('btn-field-mode');
    this.canvas = document.getElementById('tracker-radar-canvas');
    if (!this.canvas || !this.head) return;
    this.ctx = this.canvas.getContext('2d');
    this.head.setAttribute('aria-controls', 'tracker-map-menu');
    this.alertButton.setAttribute('aria-controls', 'tracker-map-alerts');
    this.alertButton.setAttribute('aria-label', 'Mở trung tâm thông tin');
    this.alertButton.title = 'MESSAGE CENTER';
    this.bus.on('TOGGLE_TRACKER_MENU', () => this.toggle('left'));
    this.bus.on('TOGGLE_TRACKER_ALERTS', () => this.toggle('right'));
    document.querySelectorAll('[data-tracker-section]').forEach(button => button.addEventListener('click', () => {
      this.close();
      if (button.dataset.trackerSection === 'ARENA') { location.assign('/'); return; }
      this.bus.emit('GAME_MENU_TARGET', { section: button.dataset.trackerSection });
    }));
    document.querySelectorAll('[data-tracker-event]').forEach(button => button.addEventListener('click', () => {
      this.close(); this.bus.emit('TOGGLE_DRAWER', button.dataset.trackerEvent);
    }));
    document.getElementById('btn-radar-world')?.addEventListener('click', () => this.engine.showWorld());
    document.getElementById('btn-radar-center')?.addEventListener('click', () => this.bus.emit('CENTER_GPS'));
    document.getElementById('btn-map-kim-lan')?.addEventListener('click', () => {
      const center = this.engine.fallbackCenter;
      this.engine.flyTo(center.lat, center.lng, 15);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.openSide) { const side = this.openSide; this.close(); (side === 'left' ? this.head : this.alertButton).focus(); }
    });
    document.addEventListener('pointerdown', event => {
      if (this.openSide && !event.target.closest('.tracker-corner-menu,#btn-hub-menu,#btn-field-mode')) this.close();
    });
    new MutationObserver(() => {
      this.close();
    }).observe(document.body, { attributes: true, attributeFilter: ['data-game-mode'] });
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const loop = now => {
      if (!document.hidden) {
        this.animateHead(now);
        if (document.body.dataset.gameMode === 'MAP' && (!this.lastDraw || now - this.lastDraw > 50)) { this.drawRadar(now); this.lastDraw = now; }
      }
      requestAnimationFrame(loop);
    };
    this.close(); requestAnimationFrame(loop);
  }

  toggle(side) {
    if (this.openSide === side) { this.close(); return; }
    this.close(); this.openSide = side; this.menuChangedAt = performance.now();
    const panel = side === 'left' ? this.menu : this.alerts;
    panel.hidden = false; panel.inert = false;
    (side === 'left' ? this.head : this.alertButton).setAttribute('aria-expanded', 'true');
  }

  close() {
    this.openSide = null;
    [this.menu, this.alerts].forEach(panel => { if (panel) { panel.hidden = true; panel.inert = true; } });
    this.head?.setAttribute('aria-expanded', 'false');
    this.alertButton?.setAttribute('aria-expanded', 'false');
  }

  animateHead(now) {
    let frame;
    if (this.openSide === 'left') frame = this.reduced.matches ? 45 : Math.min(45, 30 + Math.floor((now - this.menuChangedAt) / 55.6));
    else {
      // Original atlas: 81×83, 46 frames. Head turns 0–29, close morph 30–45.
      const tick = Math.floor(now / 83.33) % 84;
      frame = this.reduced.matches ? 0 : tick < 12 ? 0 : tick < 42 ? tick - 12 : tick < 54 ? 29 : 83 - tick;
    }
    this.head.style.setProperty('--menu-frame', frame);
  }

  drawRadar(now) {
    const ctx = this.ctx, map = this.engine.map;
    if (!ctx) return;
    ctx.clearRect(0, 0, 200, 200); ctx.save(); ctx.scale(2, 2);
    ctx.beginPath(); ctx.arc(50, 50, 47, 0, Math.PI * 2); ctx.clip();
    const angle = this.reduced.matches ? -Math.PI / 4 : now / 2200;
    const sweep = ctx.createConicGradient(angle - .8, 50, 50);
    sweep.addColorStop(0, '#09a4c700'); sweep.addColorStop(.12, '#09a4c744'); sweep.addColorStop(.13, '#09a4c700');
    ctx.fillStyle = sweep; ctx.fillRect(0, 0, 100, 100);
    ctx.strokeStyle = '#09a4c7'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(50, 50); ctx.lineTo(50 + 47 * Math.cos(angle), 50 + 47 * Math.sin(angle)); ctx.stroke();
    ctx.fillStyle = '#96e0f7'; ctx.beginPath(); ctx.arc(50, 50, 2, 0, Math.PI * 2); ctx.fill();
    if (map && this.engine.isLoaded) {
      const center = map.getCenter();
      const range = Math.max(1, 50 * Math.pow(2, (13 - map.getZoom()) * .58));
      const filter = this.state.get('activeFilter');
      for (const entry of this.repo.getAll()) {
        if (filter !== 'ALL' && entry.type !== filter) continue;
        if (!Number.isFinite(entry.lat) || !Number.isFinite(entry.lng)) continue;
        const east = ((((entry.lng - center.lng) + 540) % 360) - 180) * 111.32 * Math.cos(center.lat * Math.PI / 180);
        const north = (entry.lat - center.lat) * 111.32;
        const distance = Math.hypot(east, north);
        if (distance > range) continue;
        const factor = distance ? 45 * Math.pow(distance / range, .82) / distance : 0;
        ctx.fillStyle = entry.status === 'DONE' ? '#00ff50' : entry.status === 'PLANNED' ? '#fff' : '#ff4040';
        ctx.beginPath(); ctx.arc(50 + east * factor, 50 - north * factor, 2, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }
}
