/* ==========================================================================
   SPIDER-MAN LIFE RPG - ULTIMATE TOP-TIER UI CONTROLLER & SOUND ENGINE
   ========================================================================== */

class HeroVoiceSynthesizer {
  static speak(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }
}

class SoundFx {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.mapAmbienceTimer = null;
    this.mapAmbiencePlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  syncSettings(settings) {
    if (settings) {
      if (typeof settings.sfxEnabled === 'boolean') this.sfxEnabled = settings.sfxEnabled;
      if (typeof settings.musicEnabled === 'boolean') this.musicEnabled = settings.musicEnabled;
      if (!this.musicEnabled && this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
        this.bgmPlaying = false;
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15, freqRamp = null) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (freqRamp) {
        osc.frequency.exponentialRampToValueAtTime(freqRamp, this.ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('[SoundFx] playTone error:', e);
    }
  }

  // NAMED SOUND CUES
  click() { this.playTone(800, 'sine', 0.05, 0.08); }
  uiFocus() { this.playTone(600, 'sine', 0.04, 0.05); }
  panelOpen() { this.playTone(300, 'triangle', 0.15, 0.12, 600); }
  panelClose() { this.playTone(600, 'triangle', 0.15, 0.12, 300); }
  trackerScan() { this.playTone(1200, 'sawtooth', 0.1, 0.08, 400); }
  mapMarkerPing() { this.nodeSelect(); }
  webThwip() { this.playTone(950, 'sawtooth', 0.12, 0.25, 110); }
  dangerAlert() { this.warningAlert(); }
  equip() { this.playTone(440, 'triangle', 0.15, 0.15, 880); }
  unlock() { this.playTone(523.25, 'sine', 0.25, 0.2, 1046.5); }
  success() { this.playUpgrade(); }
  failure() { this.playTone(300, 'sawtooth', 0.3, 0.2, 150); }
  bossPhase() { this.playTone(150, 'square', 0.4, 0.25, 450); }
  lootReveal() { this.playUpgrade(); }

  // TASK 15 EXPLICIT SPIDER AUDIO CUES
  webThwipLight() {
    this.playTone(1200, 'sawtooth', 0.08, 0.2, 300);
  }

  webThwipHeavy() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(800, 'sawtooth', 0.15, 0.25, 90);
    this.playTone(140, 'sine', 0.18, 0.3, 40);
  }

  webSwingLaunch() {
    this.playTone(200, 'sawtooth', 0.25, 0.18, 950);
  }

  webSwingRelease() {
    this.playTone(850, 'sine', 0.2, 0.15, 250);
  }

  spiderSensePulse() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(1760, 'sine', 0.18, 0.15);
    setTimeout(() => this.playTone(2200, 'sine', 0.18, 0.15), 50);
  }

  suitTechOpen() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    [400, 600, 900, 1200].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.08, 0.1), idx * 35);
    });
  }

  suitEquipLock() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(480, 'square', 0.08, 0.18, 120);
    setTimeout(() => this.playTone(180, 'triangle', 0.2, 0.25, 60), 60);
  }

  venomCharge() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    [200, 350, 550, 850].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.07, 0.12), idx * 45);
    });
  }

  venomImpact() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(120, 'square', 0.35, 0.35, 30);
    this.playTone(600, 'sawtooth', 0.25, 0.2, 80);
  }

  symbioteTendril() {
    this.playTone(450, 'triangle', 0.25, 0.18, 110);
  }

  cardExpand() {
    this.playTone(250, 'sine', 0.2, 0.15, 750);
  }

  cardCollapse() {
    this.playTone(750, 'sine', 0.15, 0.12, 200);
  }

  // TASK 09 EXPLICIT NAMED CUES
  trackerBoot() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    [400, 600, 800, 1000].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.04, 0.08), idx * 50);
    });
  }

  calibrationConfirm() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.12, 0.1), idx * 60);
    });
  }

  mapOpen() {
    this.playTone(300, 'sine', 0.2, 0.1, 800);
  }

  mapClose() {
    this.playTone(800, 'sine', 0.15, 0.08, 300);
  }

  filterToggle() {
    this.playTone(1050, 'sine', 0.05, 0.08);
  }

  nodeHover() {
    const now = Date.now();
    if (this._lastNodeHoverTime && now - this._lastNodeHoverTime < 100) return;
    this._lastNodeHoverTime = now;
    this.playTone(720, 'sine', 0.04, 0.05);
  }

  nodeSelect() {
    this.playTone(880, 'sine', 0.18, 0.15, 1760);
  }

  radarScanPulse() {
    this.playTone(320, 'sine', 0.35, 0.06, 240);
  }

  warningAlert() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(440, 'square', 0.12, 0.12);
    setTimeout(() => this.playTone(350, 'square', 0.15, 0.12), 140);
  }

  confirmedChime() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.15, 0.1), idx * 70);
    });
  }

  tickerChirp() {
    const now = Date.now();
    if (this._lastTickerTime && now - this._lastTickerTime < 2000) return;
    this._lastTickerTime = now;
    this.playTone(1200, 'sine', 0.03, 0.04);
  }

  playThwip() { this.webThwip(); }

  playUpgrade() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.07;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  toggleBgm() {
    this.musicEnabled = !this.musicEnabled;
    this.bgmPlaying = this.musicEnabled;

    if (this.bgmPlaying) {
      this.init();
      if (this.ctx) {
        this.playSynthwaveBgmLoop();
      }
    } else {
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
    return this.musicEnabled;
  }

  playSynthwaveBgmLoop() {
    if (this.bgmTimer) clearInterval(this.bgmTimer);
    const bassNotes = [110, 130.81, 146.83, 164.81];
    let noteIdx = 0;

    this.bgmTimer = setInterval(() => {
      if (!this.musicEnabled || !this.bgmPlaying || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(bassNotes[noteIdx % bassNotes.length], this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
      noteIdx++;
    }, 400);
  }

  playMapAmbienceLoop() {
    // Single subtle one-shot pulse on map open instead of annoying continuous loop
    this.radarScanPulse();
  }

  stopMapAmbience() {
    this.mapAmbiencePlaying = false;
  }
}

const sfx = new SoundFx();

// SPIDER WEB HEXAGON RADAR CHART ENGINE
class SpiderRadarChart {
  static draw(canvasId, stats) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 35;

    ctx.clearRect(0, 0, width, height);

    const attributes = [
      { name: 'AGI', val: stats.agility || 10 },
      { name: 'POW', val: stats.power || 10 },
      { name: 'INT', val: stats.intellect || 10 },
      { name: 'FOC', val: stats.focus || 10 },
      { name: 'DIS', val: stats.discipline || 10 },
      { name: 'WIL', val: stats.willpower || 10 }
    ];

    const total = attributes.length;
    const maxStat = 40;

    for (let r = 1; r <= 3; r++) {
      const currentRadius = (radius / 3) * r;
      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const x = centerX + Math.cos(angle) * currentRadius;
        const y = centerY + Math.sin(angle) * currentRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(230, 36, 41, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < total; i++) {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.stroke();

      const labelX = centerX + Math.cos(angle) * (radius + 20);
      const labelY = centerY + Math.sin(angle) * (radius + 20);
      ctx.font = '700 11px Inter';
      ctx.fillStyle = '#00f0ff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(attributes[i].name, labelX, labelY);
    }

    ctx.beginPath();
    attributes.forEach((attr, i) => {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const ratio = Math.min(1, attr.val / maxStat);
      const x = centerX + Math.cos(angle) * (radius * ratio);
      const y = centerY + Math.sin(angle) * (radius * ratio);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
}

// 3D CARD PARALLAX TILT ENGINE
class Card3DTiltEngine {
  static init() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
      });
    });
  }
}

// DYNAMIC SPIDER WEB MOUSE TRAIL CANVAS
class SpiderWebCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.mouse = { x: null, y: null };

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.initNodes();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initNodes() {
    this.nodes = [];
    const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 18000);
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.5 + 1
      });
    }
  }

  animate() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.nodes.length; i++) {
      const nodeA = this.nodes[i];
      nodeA.x += nodeA.vx;
      nodeA.y += nodeA.vy;

      if (nodeA.x < 0 || nodeA.x > this.canvas.width) nodeA.vx *= -1;
      if (nodeA.y < 0 || nodeA.y > this.canvas.height) nodeA.vy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      this.ctx.fill();

      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeB = this.nodes[j];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          this.ctx.beginPath();
          this.ctx.moveTo(nodeA.x, nodeA.y);
          this.ctx.lineTo(nodeB.x, nodeB.y);
          this.ctx.strokeStyle = `rgba(230, 36, 41, ${0.15 * (1 - dist / 130)})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }

      if (this.mouse.x !== null) {
        const dx = nodeA.x - this.mouse.x;
        const dy = nodeA.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          this.ctx.beginPath();
          this.ctx.moveTo(nodeA.x, nodeA.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.45 * (1 - dist / 180)})`;
          this.ctx.lineWidth = 1.2;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

class AppUI {
  constructor() {
    this.storage = new StorageManager();
    this.engine = new GameEngine(this.storage);
    sfx.syncSettings(this.state.soundSettings);

    this.selectedMapNodeId = MAP_DATA.nodes[0] ? MAP_DATA.nodes[0].id : null;

    this.initNavigation();
    this.initEventListeners();
    this.initModals();
    this.initQteMinigame();
    this.initRadialWheel();
    this.initMultiverseRift();
    this.initDataBackup();
    this.initCompendiumFilters();
    this.initCityMap();
    this.renderAll();
  }

  updateSoundUI() {
    const sfxBtn = document.getElementById('soundToggleBtn');
    if (sfxBtn) {
      const isSfx = sfx.sfxEnabled;
      sfxBtn.textContent = isSfx ? '🔊' : '🔇';
      sfxBtn.title = isSfx ? 'Tắt SFX Audio' : 'Bật SFX Audio';
      sfxBtn.setAttribute('aria-label', isSfx ? 'SFX Audio: Enabled' : 'SFX Audio: Disabled');
      sfxBtn.setAttribute('aria-pressed', isSfx ? 'true' : 'false');
    }

    const bgmBtn = document.getElementById('bgmToggleBtn');
    if (bgmBtn) {
      const isMusic = sfx.musicEnabled;
      bgmBtn.textContent = isMusic ? '🎶' : '🎵';
      bgmBtn.title = isMusic ? 'Tắt Synthwave BGM' : 'Bật Synthwave BGM';
      bgmBtn.setAttribute('aria-label', isMusic ? 'Synthwave BGM: Enabled' : 'Synthwave BGM: Disabled');
      bgmBtn.setAttribute('aria-pressed', isMusic ? 'true' : 'false');
    }

    const trackerSoundBtn = document.getElementById('trackerSoundToggleBtn');
    if (trackerSoundBtn) {
      const isSfx = sfx.sfxEnabled;
      const iconEl = document.getElementById('trackerSoundIcon');
      const labelEl = document.getElementById('trackerSoundLabel');
      if (iconEl) iconEl.textContent = isSfx ? '🔊' : '🔇';
      if (labelEl) labelEl.textContent = isSfx ? 'SOUND ON' : 'SOUND OFF';
      trackerSoundBtn.setAttribute('aria-pressed', isSfx ? 'true' : 'false');
      trackerSoundBtn.setAttribute('aria-label', isSfx ? 'Tracker Audio: SOUND ON' : 'Tracker Audio: SOUND OFF');
    }
  }

  get state() {
    return this.engine.state;
  }

  initNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.getAttribute('data-nav');
        this.navigateToView(targetView, e);
      });
    });

    document.getElementById('goToBossCombatBtn')?.addEventListener('click', (e) => {
      this.navigateToView('boss', e);
    });
  }

  navigateToView(targetView, event = null) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));

    const activeNav = document.querySelector(`[data-nav="${targetView}"]`);
    if (activeNav) activeNav.classList.add('active');

    const viewEl = document.getElementById(`view-${targetView}`);
    if (viewEl) viewEl.classList.add('active');

    sfx.webThwip();
    if (event) this.triggerComicPop(event, 'THWIP!');

    if (targetView === 'map') {
      sfx.mapOpen();
      sfx.radarScanPulse();
      this.checkMapCalibrationOnboarding();
    } else {
      sfx.mapClose();
    }

    this.renderAll();
  }

  initEventListeners() {
    document.getElementById('bgmToggleBtn')?.addEventListener('click', () => {
      sfx.toggleBgm();
      if (!this.state.soundSettings) {
        this.state.soundSettings = { musicEnabled: false, sfxEnabled: true, masterVolume: 0.7 };
      }
      this.state.soundSettings.musicEnabled = sfx.musicEnabled;
      this.engine.save();
      this.updateSoundUI();
    });

    document.getElementById('soundToggleBtn')?.addEventListener('click', () => {
      sfx.sfxEnabled = !sfx.sfxEnabled;
      if (!this.state.soundSettings) {
        this.state.soundSettings = { musicEnabled: false, sfxEnabled: true, masterVolume: 0.7 };
      }
      this.state.soundSettings.sfxEnabled = sfx.sfxEnabled;
      this.engine.save();
      this.updateSoundUI();
    });

    document.getElementById('resetDemoDataBtn')?.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn Reset dữ liệu về trạng thái Demo ban đầu (Peter Lvl 12 & Doc Ock Boss)?')) {
        this.engine.resetAllData();
        sfx.syncSettings(this.state.soundSettings);
        this.selectedMapNodeId = MAP_DATA.nodes[0] ? MAP_DATA.nodes[0].id : null;
        this.renderAll();
        if (window.confetti) window.confetti({ particleCount: 50 });
      }
    });

    document.getElementById('openVariantCardBtn')?.addEventListener('click', () => {
      const suit = this.state.suitsState.find(s => s.id === this.state.character.equippedSuitId);
      document.getElementById('varHeroName').textContent = this.state.character.heroName.toUpperCase();
      document.getElementById('varLevel').textContent = `LV.${this.state.character.level}`;
      document.getElementById('varGold').textContent = this.state.character.gold.toLocaleString();
      document.getElementById('varSuit').textContent = suit ? suit.name.split(' ')[0].toUpperCase() : 'CLASSIC';
      document.getElementById('achievementCardModal').classList.add('active');
    });

    document.getElementById('closeVariantCardBtn')?.addEventListener('click', () => {
      document.getElementById('achievementCardModal').classList.remove('active');
    });

    document.getElementById('arenaFinisherBtn')?.addEventListener('click', (e) => {
      const finisherResult = this.engine.executeFinisher();
      if (finisherResult.finisherDamage > 0) {
        sfx.success();
        HeroVoiceSynthesizer.speak("Finisher Strike!");
        this.triggerScreenShake();
        this.triggerComicPop(e, 'FINISHER!');
        this.checkBossVictory(finisherResult);
        this.renderAll();
      }
    });

    document.getElementById('claimBossLootBtn')?.addEventListener('click', () => {
      document.getElementById('bossLootModal').classList.remove('active');
      this.engine.acknowledgeBossClaim();
      this.renderAll();
    });

    document.getElementById('closeLevelUpBtn')?.addEventListener('click', () => {
      document.getElementById('levelUpModal').classList.remove('active');
    });

    document.getElementById('closeCompendiumModalBtn')?.addEventListener('click', () => {
      document.getElementById('compendiumDetailModal').classList.remove('active');
    });

    // Collection View Tab Toggle (Items vs Variants)
    document.getElementById('tabShowCollectionBtn')?.addEventListener('click', () => {
      document.getElementById('tabShowCollectionBtn').classList.add('active');
      document.getElementById('tabShowVariantsBtn').classList.remove('active');
      document.getElementById('collectionGrid').style.display = 'grid';
      document.getElementById('variantsGrid').style.display = 'none';
      sfx.click();
    });

    document.getElementById('tabShowVariantsBtn')?.addEventListener('click', () => {
      document.getElementById('tabShowVariantsBtn').classList.add('active');
      document.getElementById('tabShowCollectionBtn').classList.remove('active');
      document.getElementById('collectionGrid').style.display = 'none';
      document.getElementById('variantsGrid').style.display = 'grid';
      sfx.click();
    });
  }

  initCompendiumFilters() {
    const bindFilter = (inputId, selectIds, renderFn) => {
      const input = document.getElementById(inputId);
      if (input) input.addEventListener('input', () => { sfx.uiFocus(); renderFn(); });
      selectIds.forEach(id => {
        const sel = document.getElementById(id);
        if (sel) sel.addEventListener('change', () => { sfx.click(); renderFn(); });
      });
    };

    bindFilter('villainSearchInput', ['villainCategorySelect', 'villainDifficultySelect'], () => this.renderVillainsView());
    bindFilter('allySearchInput', ['allyRoleSelect'], () => this.renderAlliesView());
    bindFilter('suitSearchInput', ['suitGameSelect', 'suitHeroSelect', 'suitRaritySelect', 'suitEquippedSelect'], () => this.renderSuitsView());
    bindFilter('gadgetSearchInput', ['gadgetRaritySelect'], () => this.renderGadgetsView());
    bindFilter('skillSearchInput', ['skillGameSelect', 'skillHeroSelect', 'skillFamilySelect', 'skillBranchSelect'], () => this.renderSkillsView());
    bindFilter('variantSearchInput', ['variantRaritySelect'], () => this.renderVariantsView());
  }

  initCityMap() {
    // Map Filter Chips
    document.querySelectorAll('#mapFilterChips .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#mapFilterChips .filter-chip').forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        const filterVal = chip.getAttribute('data-mapfilter');
        this.state.mapState.activeFilter = filterVal;
        this.engine.save();
        sfx.filterToggle();
        this.addMapLogEntry(`FILTER APPLIED: ${filterVal.toUpperCase()}`);
        this.renderMapView();
      });
    });

    // Map Search Input
    document.getElementById('mapSearchInput')?.addEventListener('input', (e) => {
      sfx.uiFocus();
      const val = e.target.value.trim();
      if (val.length > 0 && val.length % 3 === 0) {
        this.addMapLogEntry(`SEARCH QUERY: "${val.toUpperCase()}"`);
      }
      this.renderMapView();
    });

    // District Path Clicks on SVG Map
    document.querySelectorAll('.district-path').forEach(path => {
      path.addEventListener('click', () => {
        const districtId = path.getAttribute('data-district');
        this.state.mapState.selectedDistrictId = districtId;
        this.engine.save();
        sfx.nodeSelect();
        const distDef = MAP_DATA.districts.find(d => d.id === districtId);
        const distName = distDef ? distDef.name : districtId;
        this.addMapLogEntry(`SECTOR HIGHLIGHT: ${distName.toUpperCase()}`);
        this.renderMapView();
      });
    });

    // Center Map Button
    document.getElementById('centerMapBtn')?.addEventListener('click', () => {
      this.state.mapState.selectedDistrictId = 'midtown';
      this.state.mapState.activeFilter = 'all';
      this.selectedMapNodeId = MAP_DATA.nodes[0] ? MAP_DATA.nodes[0].id : null;
      document.querySelectorAll('#mapFilterChips .filter-chip').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      const allChip = document.querySelector('#mapFilterChips [data-mapfilter="all"]');
      if (allChip) {
        allChip.classList.add('active');
        allChip.setAttribute('aria-selected', 'true');
      }
      const searchInput = document.getElementById('mapSearchInput');
      if (searchInput) searchInput.value = '';

      this.engine.save();
      sfx.radarScanPulse();
      this.addMapLogEntry(`RADAR RE-CENTERED TO MIDTOWN`);
      this.renderMapView();
    });

    // Replay Calibration Button
    document.getElementById('replayCalibrationBtn')?.addEventListener('click', () => {
      sfx.click();
      this.openCalibrationOverlay();
    });

    // Tracker Header Sound Toggle Button
    document.getElementById('trackerSoundToggleBtn')?.addEventListener('click', () => {
      sfx.sfxEnabled = !sfx.sfxEnabled;
      if (!this.state.soundSettings) {
        this.state.soundSettings = { musicEnabled: false, sfxEnabled: true, masterVolume: 0.7 };
      }
      this.state.soundSettings.sfxEnabled = sfx.sfxEnabled;
      this.engine.save();
      this.updateSoundUI();
      if (sfx.sfxEnabled) sfx.click();
    });

    // Launch/Navigate Node Button (MUST NOT MINT PROGRESSION OR REWARDS)
    document.getElementById('launchMapNodeBtn')?.addEventListener('click', (e) => {
      const node = MAP_DATA.nodes.find(n => n.id === this.selectedMapNodeId);
      if (node && node.targetView) {
        sfx.webThwip();
        this.addMapLogEntry(`ROUTED TO: ${node.targetView.toUpperCase()} VIEW`);
        this.navigateToView(node.targetView, e);
      }
    });

    // First-visit Calibration Modal Choice Buttons
    document.getElementById('calibSoundOnBtn')?.addEventListener('click', () => {
      sfx.sfxEnabled = true;
      if (!this.state.soundSettings) {
        this.state.soundSettings = { musicEnabled: false, sfxEnabled: true, masterVolume: 0.7 };
      }
      this.state.soundSettings.sfxEnabled = true;
      this.updateSoundUI();
      sfx.calibrationConfirm();
      this.closeCalibrationOverlay();
    });

    document.getElementById('calibSoundOffBtn')?.addEventListener('click', () => {
      sfx.sfxEnabled = false;
      if (!this.state.soundSettings) {
        this.state.soundSettings = { musicEnabled: false, sfxEnabled: true, masterVolume: 0.7 };
      }
      this.state.soundSettings.sfxEnabled = false;
      this.updateSoundUI();
      this.closeCalibrationOverlay();
    });

    document.getElementById('skipCalibrationBtn')?.addEventListener('click', () => {
      sfx.click();
      this.closeCalibrationOverlay();
    });

    // ESC Key listener to close Calibration Modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const calibModal = document.getElementById('trackerCalibrationModal');
        if (calibModal && calibModal.classList.contains('active')) {
          this.closeCalibrationOverlay();
        }
      }
    });
  }

  // CALIBRATION & LOGGING HELPERS
  checkMapCalibrationOnboarding() {
    if (this.state.mapState && !this.state.mapState.trackerOnboarded) {
      this.openCalibrationOverlay();
    }
  }

  openCalibrationOverlay() {
    const modal = document.getElementById('trackerCalibrationModal');
    if (!modal) return;
    modal.classList.add('active');
    sfx.trackerBoot();

    const lines = [
      "> INITIALIZING SPIDER-OPS DIRECT PATROL LINK [SYS_v4.9]...",
      "> CALIBRATING OSCORP SUB-WAVE FREQUENCY SCANNER...",
      "> LOCATING ACTIVE THREATS & ALLY SIGNAL BEACONS...",
      "> AUDIO HARNESS CHECK: SELECT PREFERRED AUDIO MODE."
    ];
    const body = document.getElementById('calibrationLogBody');
    if (body) {
      body.innerHTML = '';
      lines.forEach((line, idx) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = 'boot-line';
          div.textContent = line;
          body.appendChild(div);
        }, idx * 250);
      });
    }

    setTimeout(() => {
      document.getElementById('calibSoundOnBtn')?.focus();
    }, 1000);
  }

  closeCalibrationOverlay() {
    const modal = document.getElementById('trackerCalibrationModal');
    if (modal) modal.classList.remove('active');
    if (!this.state.mapState) this.state.mapState = {};
    this.state.mapState.trackerOnboarded = true;
    this.engine.save();
  }

  addMapLogEntry(text) {
    if (!this.mapActivityLog) {
      this.mapActivityLog = ['[RADAR]: Scanner active. 7 districts operational.'];
    }
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    this.mapActivityLog.unshift(`[${timeStr}] ${text}`);
    if (this.mapActivityLog.length > 10) this.mapActivityLog.pop();

    const logContainer = document.getElementById('mapActivityLog');
    const countEl = document.getElementById('logCount');
    if (logContainer) {
      logContainer.innerHTML = this.mapActivityLog.map(e => `<div class="log-entry">${e}</div>`).join('');
      logContainer.scrollTop = 0;
    }
    if (countEl) {
      countEl.textContent = `${this.mapActivityLog.length} RECENT`;
    }
    sfx.tickerChirp();
  }

  updateTrackerTicker(node) {
    const tickerTrack = document.getElementById('trackerTickerContent');
    if (!tickerTrack) return;
    if (!node) {
      tickerTrack.innerHTML = `
        <span class="ticker-item">[OSCORP RADAR]: SCANNING NEW YORK CITY SECTORS...</span>
        <span class="ticker-item">[SPIDER OPS]: 8 TACTICAL NODES MONITORED...</span>
        <span class="ticker-item">[DAILY BUGLE WIRE]: CRIME WAVE REPORTED IN MIDTOWN...</span>
        <span class="ticker-item">[FEAST NETWORK]: PATROL UNITS ON STANDBY...</span>
      `;
      return;
    }
    const districtDef = MAP_DATA.districts.find(d => d.id === node.districtId);
    const districtName = districtDef ? districtDef.name.toUpperCase() : node.districtId.toUpperCase();
    const msg = `[TARGET LOCK]: ${node.title.toUpperCase()} AT ${districtName} — STATUS: ${node.status.toUpperCase()} — INTEL: ${node.source || 'SPIDER-NET'}`;

    tickerTrack.innerHTML = `
      <span class="ticker-item">${msg}</span>
      <span class="ticker-item">[OSCORP RADAR]: SCANNING SECTOR...</span>
      <span class="ticker-item">${msg}</span>
      <span class="ticker-item">[SPIDER OPS]: 8 NODES OPERATIONAL...</span>
    `;
  }

  drawWebConnections(selectedNode) {
    const layer = document.getElementById('webConnectionsLayer');
    if (!layer) return;
    layer.innerHTML = '';
    if (!selectedNode) return;

    const x1 = (selectedNode.x / 100) * 800;
    const y1 = (selectedNode.y / 100) * 600;

    const otherNodes = MAP_DATA.nodes.filter(n => n.id !== selectedNode.id && n.status !== 'locked').slice(0, 2);

    otherNodes.forEach(other => {
      const x2 = (other.x / 100) * 800;
      const y2 = (other.y / 100) * 600;

      const cx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
      const cy = (y1 + y2) / 2 + (x1 - x2) * 0.15;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
      path.setAttribute('class', 'web-connection-line');
      layer.appendChild(path);
    });

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', x1);
    ring.setAttribute('cy', y1);
    ring.setAttribute('r', '16');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', 'var(--oscorp-cyan)');
    ring.setAttribute('stroke-width', '2');
    ring.setAttribute('stroke-dasharray', '4 2');
    layer.appendChild(ring);
  }

  drawRadarMinimap(filteredNodes, selectedNode) {
    const canvas = document.getElementById('trackerRadarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = (w / 2) - 4;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Grid rings & crosshairs
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
    ctx.stroke();

    // Node blips
    filteredNodes.forEach(n => {
      const bx = (n.x / 100) * (r * 1.6) + (cx - r * 0.8);
      const by = (n.y / 100) * (r * 1.6) + (cy - r * 0.8);
      const isSelected = selectedNode && n.id === selectedNode.id;

      ctx.fillStyle = isSelected ? '#00e5ff' : (n.category === 'rumored' ? '#ffb700' : (n.status === 'locked' ? '#64748b' : '#22c55e'));
      ctx.beginPath();
      ctx.arc(bx, by, isSelected ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Animated radar sweep hand
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (typeof this._radarAngle !== 'number') this._radarAngle = 0;
      this._radarAngle = (this._radarAngle + 0.05) % (Math.PI * 2);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(this._radarAngle) * r, cy + Math.sin(this._radarAngle) * r);
      ctx.stroke();
    }
  }

  initMultiverseRift() {
    document.getElementById('openRiftBtn')?.addEventListener('click', () => {
      document.getElementById('multiverseRiftModal').classList.add('active');
    });

    document.getElementById('closeRiftModalBtn')?.addEventListener('click', () => {
      document.getElementById('multiverseRiftModal').classList.remove('active');
    });

    document.getElementById('claimRiftBtn')?.addEventListener('click', () => {
      this.state.character.gold += 150;
      XPSystem.addXp(this.state.character, 150);
      this.engine.save();
      sfx.success();
      HeroVoiceSynthesizer.speak("Multiverse reward claimed!");
      document.getElementById('multiverseRiftModal').classList.remove('active');
      if (window.confetti) window.confetti({ particleCount: 120 });
      this.renderAll();
    });
  }

  initDataBackup() {
    document.getElementById('exportDataBtn')?.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `spider_life_rpg_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      sfx.success();
      alert('Đã xuất file sao lưu dữ liệu Spider-Man Life RPG thành công!');
    });

    document.getElementById('importDataBtn')?.addEventListener('click', () => {
      document.getElementById('importFileInput').click();
    });

    document.getElementById('importFileInput')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = this.storage.importState(event.target.result);
        if (result.success) {
          this.engine.state = result.state;
          sfx.syncSettings(this.state.soundSettings);
          this.renderAll();
          sfx.success();
          if (window.confetti) window.confetti({ particleCount: 100 });
          alert('Đã nạp khôi phục dữ liệu Spider-Man Life RPG thành công!');
        } else {
          alert(`Lỗi nạp dữ liệu: ${result.error}`);
        }
      };
      reader.readAsText(file);
    });
  }

  initRadialWheel() {
    document.getElementById('openWheelBtn')?.addEventListener('click', () => {
      document.getElementById('gadgetWheelModal').classList.add('active');
    });

    document.getElementById('closeWheelModalBtn')?.addEventListener('click', () => {
      document.getElementById('gadgetWheelModal').classList.remove('active');
    });

    document.querySelectorAll('.radial-gadget-node').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gadget = btn.getAttribute('data-gadget');
        sfx.webThwip();
        HeroVoiceSynthesizer.speak(`Web strike!`);
        this.triggerComicPop(e, `CAST ${gadget.toUpperCase()}!`);
        document.getElementById('gadgetWheelModal').classList.remove('active');

        if (!this.state.currentBossState.mechanicState) this.state.currentBossState.mechanicState = {};
        this.state.currentBossState.mechanicState.nextActionDamageBoost = (this.state.currentBossState.mechanicState.nextActionDamageBoost || 0) + 100;
        this.state.currentBossState.lastMechanicEvent = `Gadget deployed: Next action gains +100 DMG!`;
        this.engine.save();
        this.renderAll();
      });
    });
  }

  triggerScreenShake() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const body = document.getElementById('appBody');
    if (!body) return;
    body.classList.remove('screen-shake');
    void body.offsetWidth;
    body.classList.add('screen-shake');
    setTimeout(() => body.classList.remove('screen-shake'), 350);
  }

  triggerComicPop(event, text = 'THWIP!') {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = document.getElementById('comicPopContainer');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'floating-comic-pop';
    el.textContent = text;

    const x = event ? (event.clientX || window.innerWidth / 2) : window.innerWidth / 2;
    const y = event ? (event.clientY || window.innerHeight / 2) : window.innerHeight / 2;

    el.style.left = `${x - 40}px`;
    el.style.top = `${y - 30}px`;

    container.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  initQteMinigame() {
    document.getElementById('startQteBtn')?.addEventListener('click', () => {
      document.getElementById('qteModal').classList.add('active');
    });

    document.getElementById('qteStrikeActionBtn')?.addEventListener('click', (e) => {
      sfx.success();
      HeroVoiceSynthesizer.speak("Perfect Critical Strike!");
      this.triggerScreenShake();
      this.triggerComicPop(e, 'PERFECT QTE BUFF!');
      document.getElementById('qteModal').classList.remove('active');

      if (!this.state.currentBossState.mechanicState) this.state.currentBossState.mechanicState = {};
      this.state.currentBossState.mechanicState.nextActionDamageBoost = (this.state.currentBossState.mechanicState.nextActionDamageBoost || 0) + 250;
      this.state.currentBossState.lastMechanicEvent = `Perfect QTE! Next action gains +250 DMG!`;
      this.engine.save();

      if (window.confetti) window.confetti({ particleCount: 120, spread: 90 });
      this.renderAll();
    });
  }

  initModals() {
    document.getElementById('openAddHabitModalBtn')?.addEventListener('click', () => {
      document.getElementById('addTaskModal').classList.add('active');
    });
    document.getElementById('openAddTaskModalBtn')?.addEventListener('click', () => {
      document.getElementById('addTaskModal').classList.add('active');
    });
    document.getElementById('closeTaskModalBtn')?.addEventListener('click', () => {
      document.getElementById('addTaskModal').classList.remove('active');
    });
    document.getElementById('cancelTaskModalBtn')?.addEventListener('click', () => {
      document.getElementById('addTaskModal').classList.remove('active');
    });

    document.getElementById('addTaskForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('taskNameInput').value.trim();
      const attr = document.getElementById('taskAttrSelect').value;

      this.state.questsState.dailyQuests.push({
        id: 'q_' + Date.now(),
        title: name,
        category: 'custom',
        attribute: attr,
        xpReward: 40,
        attrXpReward: 20,
        goldReward: 60,
        damage: 35,
        stagger: 15,
        completed: false,
        icon: '⚡'
      });

      this.engine.save();
      document.getElementById('taskNameInput').value = '';
      document.getElementById('addTaskModal').classList.remove('active');
      this.renderAll();
      sfx.success();
    });

    document.getElementById('openAddProjectModalBtn')?.addEventListener('click', () => {
      document.getElementById('addProjectModal').classList.add('active');
    });
    document.getElementById('closeProjectModalBtn')?.addEventListener('click', () => {
      document.getElementById('addProjectModal').classList.remove('active');
    });
    document.getElementById('cancelProjectModalBtn')?.addEventListener('click', () => {
      document.getElementById('addProjectModal').classList.remove('active');
    });

    document.getElementById('addProjectForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('projTitleInput').value.trim();
      const villainId = document.getElementById('projVillainSelect').value;

      this.state.questsState.projects.push({
        id: 'proj_' + Date.now(),
        title,
        description: 'Dự án mới lập liên kết với Boss phó bản.',
        villainId,
        progress: 0,
        completed: false,
        milestones: [
          { id: 'm_' + Date.now() + '_1', title: 'Hoàn thành giai đoạn lập kế hoạch', completed: false, damage: 150 },
          { id: 'm_' + Date.now() + '_2', title: 'Hoàn thành 50% mục tiêu', completed: false, damage: 200 },
          { id: 'm_' + Date.now() + '_3', title: 'Bứt phá 100% về đích', completed: false, damage: 300 }
        ]
      });

      this.engine.save();
      document.getElementById('projTitleInput').value = '';
      document.getElementById('addProjectModal').classList.remove('active');
      this.renderAll();
      sfx.success();
    });

    document.getElementById('openAddRewardModalBtn')?.addEventListener('click', () => {
      document.getElementById('addRewardModal').classList.add('active');
    });
    document.getElementById('closeRewardModalBtn')?.addEventListener('click', () => {
      document.getElementById('addRewardModal').classList.remove('active');
    });
    document.getElementById('cancelRewardModalBtn')?.addEventListener('click', () => {
      document.getElementById('addRewardModal').classList.remove('active');
    });

    document.getElementById('addRewardForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rewardNameInput').value.trim();
      const cost = parseInt(document.getElementById('rewardCostInput').value) || 300;

      this.state.questsState.rewardShop.push({
        id: 'r_' + Date.now(),
        name,
        cost,
        category: 'Custom Reward',
        icon: '🎁',
        purchased: false
      });

      this.engine.save();
      document.getElementById('rewardNameInput').value = '';
      document.getElementById('addRewardModal').classList.remove('active');
      this.renderAll();
      sfx.success();
    });

    document.getElementById('closeCompendiumModalBtn')?.addEventListener('click', () => {
      this.closeCompendiumDetailModal();
    });

    document.addEventListener('keydown', (e) => {
      const modalEl = document.getElementById('compendiumDetailModal');
      if (modalEl && modalEl.classList.contains('active')) {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeCompendiumDetailModal();
        } else if (e.key === 'ArrowLeft') {
          const prevBtn = document.getElementById('prevCardBtn');
          if (prevBtn && !prevBtn.disabled) {
            e.preventDefault();
            prevBtn.click();
          }
        } else if (e.key === 'ArrowRight') {
          const nextBtn = document.getElementById('nextCardBtn');
          if (nextBtn && !nextBtn.disabled) {
            e.preventDefault();
            nextBtn.click();
          }
        }
      }
    });
  }

  checkBossVictory(result) {
    if (result && result.victoryGrant) {
      const villain = BossSystem.getVillain(this.state.currentBossState.villainId);
      const lootBox = document.getElementById('lootItemsBox');
      
      HeroVoiceSynthesizer.speak(`${villain.name} Defeated! Victory!`);

      let itemsHtml = result.victoryGrant.items.map(g => {
        const item = LootSystem.getItemDef(g.itemId);
        return `<div>${item.icon} ${item.name} (x${g.quantity})</div>`;
      }).join('');

      lootBox.innerHTML = `
        <div style="color:var(--gold-accent); font-weight:700;">🎉 BẠN ĐÃ ĐÁNH GỤC ${villain.name.toUpperCase()}!</div>
        <div style="margin-top:0.5rem;">🎁 Nhận ngay: <strong>+${result.victoryGrant.xp} XP &bull; +${result.victoryGrant.gold} GOLD</strong></div>
        <div style="margin-top:0.2rem; font-size:0.9rem; color:var(--spider-blue);">✨ Thu thập: ${itemsHtml}</div>
      `;

      document.getElementById('bossLootModal').classList.add('active');
      sfx.lootReveal();
      if (window.confetti) window.confetti({ particleCount: 180, spread: 120 });
    }
  }

  openCompendiumDetailModal(item, category, resultSet = null, currentIndex = 0) {
    if (!item) return;
    this.currentModalCategory = category || "ARCHIVE VIEWER";
    this.currentModalResultSet = (Array.isArray(resultSet) && resultSet.length > 0) ? resultSet : [item];
    this.currentModalIndex = Math.max(0, Math.min(currentIndex, this.currentModalResultSet.length - 1));

    const activeItem = this.currentModalResultSet[this.currentModalIndex] || item;
    const modalEl = document.getElementById('compendiumDetailModal');
    const modalContent = document.getElementById('compendiumModalContent');
    if (!modalEl || !modalContent) return;

    this.lastFocusedElement = document.activeElement;

    // Header category & universe badges
    const categoryTag = document.getElementById('largeCardCollectionTag');
    const universeTag = document.getElementById('largeCardUniverseTag');
    if (categoryTag) categoryTag.textContent = this.currentModalCategory.toUpperCase();
    if (universeTag) universeTag.textContent = activeItem.universe || activeItem.rarity || activeItem.category || 'Earth-616';

    const mediaId = activeItem.mediaId || activeItem.id;
    const mediaObj = MediaHelper.getMedia(mediaId);
    const isLandscape = mediaObj.mediaType === 'landscape' || category.includes('GADGET') || category.includes('SKILL');
    const imageHtml = MediaHelper.renderMediaCardHtml(mediaId, activeItem.name || activeItem.title, "large-portrait-img", isLandscape);
    const isGenerated = mediaObj.generated || activeItem.generated;
    const publisherChip = isGenerated ? "FAN ARTWORK" : (mediaObj.publisherChip || "MARVEL");

    // Action button logic depending on item type
    let actionButtonHtml = '';
    if (activeItem.id.startsWith('var_') || category.includes('SPIDER-PEOPLE') || category.includes('SPIDER-VERSE')) {
      actionButtonHtml = `<button class="primary-btn spider-btn-thwip modal-action-btn" id="modalEquipIdentityBtn" style="flex:1;">🕸️ SET AS PRIMARY IDENTITY</button>`;
    } else if (category.includes('SUIT') || (typeof SUITS_DATA !== 'undefined' && SUITS_DATA.some(s => s.id === activeItem.id))) {
      const isEquipped = this.state.character.equippedSuitId === activeItem.id;
      actionButtonHtml = `<button class="primary-btn spider-btn-thwip modal-action-btn" id="modalEquipSuitBtn" style="flex:1;">${isEquipped ? '✓ EQUIPPED' : 'EQUIP SUIT'}</button>`;
    } else if (category.includes('ALLIES') || (typeof ALLIES_DATA !== 'undefined' && ALLIES_DATA.some(a => a.id === activeItem.id))) {
      const isEquipped = this.state.character.activeCompanionId === activeItem.id;
      actionButtonHtml = `<button class="primary-btn spider-btn-thwip modal-action-btn" id="modalEquipAllyBtn" style="flex:1;">${isEquipped ? '✓ ACTIVE ALLY' : 'EQUIP ALLY'}</button>`;
    } else if (category.includes('VILLAIN') || (typeof VILLAINS_DATA !== 'undefined' && VILLAINS_DATA.some(v => v.id === activeItem.id))) {
      actionButtonHtml = `<button class="primary-btn spider-btn-thwip modal-action-btn" id="modalViewBossArenaBtn" style="flex:1;">⚔️ VIEW IN BOSS ARENA</button>`;
    } else if (category.includes('SKILL') || (typeof SKILLS_DATA !== 'undefined' && SKILLS_DATA.some(s => s.id === activeItem.id))) {
      const isUnlocked = activeItem.unlocked;
      actionButtonHtml = isUnlocked ? `<span style="color:var(--success-green); font-weight:700;">✓ UNLOCKED</span>` : `<button class="primary-btn spider-btn-thwip modal-action-btn" id="modalUnlockSkillBtn" style="flex:1;">UNLOCK SKILL (${activeItem.cost || 1} PTS)</button>`;
    }

    // Verification badge logic
    let verifiedChipHtml = '';
    if (activeItem.sourceType === 'verified-official') {
      verifiedChipHtml = `<span class="chip-tag chip-verified-official">✓ VERIFIED OFFICIAL</span>`;
    } else if (activeItem.sourceType === 'verified-in-game-reference') {
      verifiedChipHtml = `<span class="chip-tag chip-verified-reference">🎮 IN-GAME REFERENCE</span>`;
    } else if (activeItem.sourceType === 'inspired-by') {
      verifiedChipHtml = `<span class="chip-tag chip-inspired">✨ INSPIRED BY</span>`;
    }

    // Playable hero badge logic
    let heroChipHtml = '';
    if (activeItem.playableHero === 'peter') {
      heroChipHtml = `<span class="chip-tag chip-universe">HERO: PETER PARKER</span>`;
    } else if (activeItem.playableHero === 'miles') {
      heroChipHtml = `<span class="chip-tag chip-source">HERO: MILES MORALES</span>`;
    } else if (activeItem.playableHero === 'shared') {
      heroChipHtml = `<span class="chip-tag chip-category">SHARED TREE</span>`;
    } else if (activeItem.playableHero === 'both') {
      heroChipHtml = `<span class="chip-tag chip-category">BOTH HEROES</span>`;
    }

    const familyText = activeItem.suitFamily || activeItem.abilityFamily || activeItem.branchName || '';
    const familyChipHtml = familyText ? `<span class="chip-tag chip-category">${familyText.toUpperCase()}</span>` : '';

    modalContent.innerHTML = `
      <div class="large-card-body-grid">
        <div class="large-card-media-box ${isLandscape ? 'landscape-box' : ''}">
          ${imageHtml}
        </div>
        <div class="large-card-info-wrap">
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
            <span class="chip-tag chip-category">${(activeItem.rarity || activeItem.category || 'ARCHIVE').toUpperCase()}</span>
            ${familyChipHtml}
            ${heroChipHtml}
            ${verifiedChipHtml}
            <span class="chip-tag chip-source">${publisherChip}</span>
            ${activeItem.universe ? `<span class="chip-tag chip-universe">${activeItem.universe}</span>` : ''}
          </div>
          <h2 class="large-card-title">${activeItem.name || activeItem.title}</h2>
          <div class="large-card-subhead">${activeItem.title || activeItem.specialty || activeItem.universe || activeItem.gameSource || ''}</div>
          ${activeItem.gameSource ? `<div style="font-size:0.8rem; color:var(--gold-accent); margin-top:0.25rem;">🎮 <strong>Game Source:</strong> ${activeItem.gameSource} ${activeItem.sourceLabel ? `(${activeItem.sourceLabel})` : ''}</div>` : ''}
          
          <p class="large-card-desc" style="margin-top:0.5rem;">${activeItem.description || ''}</p>

          ${activeItem.passiveDescription || activeItem.passiveEffect ? `<div class="large-card-effect-pill passive-pill">✨ <strong>Passive Buff:</strong> ${activeItem.passiveDescription || activeItem.passiveEffect}</div>` : ''}
          ${activeItem.activeEffect || activeItem.activeSkill ? `<div class="large-card-effect-pill active-pill">💥 <strong>Active Move:</strong> ${activeItem.activeEffect || activeItem.activeSkill}</div>` : ''}

          <div class="provenance-box" style="margin-top:1rem; padding:0.75rem; background:rgba(15,23,42,0.7); border-radius:8px; border:1px solid rgba(255,255,255,0.1); font-size:0.8rem;">
            <div><strong>GAME PROVENANCE & CREDIT DETAILS:</strong></div>
            <div style="margin-top:0.25rem;">🎮 <strong>Source Title:</strong> ${activeItem.gameSource || 'Insomniac Games Reference'}</div>
            ${activeItem.playableHero ? `<div style="margin-top:0.25rem;">🦸‍♂️ <strong>Playable Hero:</strong> ${activeItem.playableHero === 'peter' ? 'Peter Parker' : (activeItem.playableHero === 'miles' ? 'Miles Morales' : (activeItem.playableHero === 'shared' ? 'Shared Tree' : 'Both Heroes'))}</div>` : ''}
            ${familyText ? `<div style="margin-top:0.25rem;">🏷️ <strong>Family Taxonomy:</strong> ${familyText.toUpperCase()}</div>` : ''}
            <div>Publisher / Reference: <span class="chip-tag chip-source" style="font-size:0.65rem;">${publisherChip}</span> &bull; <em>${mediaObj.sourceName || activeItem.sourceLabel || 'Official PlayStation Store Reference'}</em></div>
            ${activeItem.sourceUrl ? `<div style="margin-top:0.35rem;">🔗 <strong>Direct Official Link:</strong> <a href="${activeItem.sourceUrl}" target="_blank" rel="noopener" style="color:var(--spider-blue); text-decoration:underline; word-break:break-all;">${activeItem.sourceUrl}</a></div>` : ''}
            ${isGenerated ? `<div class="provenance-disclaimer" style="margin-top:0.35rem;">🎨 <strong>Prompt Family:</strong> ${mediaObj.promptFamily || 'Spider-Verse Portrait v1'}<br>🛠️ <strong>Tool:</strong> ${mediaObj.creationTool || 'Antigravity Generated Fan Art'}<br>⚠️ ${mediaObj.disclaimer || 'Fan-project generated original portrait artwork. Not an official Marvel asset.'}</div>` : ''}
          </div>

          ${actionButtonHtml ? `<div class="large-card-actions-bar">${actionButtonHtml}</div>` : ''}
        </div>
      </div>
    `;

    // Action Listeners inside Large Card Viewer
    const equipIdentityBtn = modalContent.querySelector('#modalEquipIdentityBtn');
    if (equipIdentityBtn) {
      equipIdentityBtn.addEventListener('click', (e) => {
        this.state.character.heroName = activeItem.name;
        this.engine.save();
        sfx.webThwipLight();
        HeroVoiceSynthesizer.speak(`Identity set to ${activeItem.name}!`);
        this.triggerComicPop(e, 'IDENTITY SET!');
        this.renderAll();
        this.closeCompendiumDetailModal();
      });
    }

    const equipSuitBtn = modalContent.querySelector('#modalEquipSuitBtn');
    if (equipSuitBtn) {
      equipSuitBtn.addEventListener('click', (e) => {
        this.engine.equipSuit(activeItem.id);
        sfx.suitEquipLock();
        HeroVoiceSynthesizer.speak(`${activeItem.name} equipped!`);
        this.triggerComicPop(e, 'SUIT EQUIPPED!');
        this.renderAll();
        this.closeCompendiumDetailModal();
      });
    }

    const equipAllyBtn = modalContent.querySelector('#modalEquipAllyBtn');
    if (equipAllyBtn) {
      equipAllyBtn.addEventListener('click', (e) => {
        this.engine.equipCompanion(activeItem.id);
        sfx.equip();
        HeroVoiceSynthesizer.speak(`${activeItem.name} joining combat!`);
        this.triggerComicPop(e, 'ALLY EQUIPPED!');
        this.renderAll();
        this.closeCompendiumDetailModal();
      });
    }

    const viewBossArenaBtn = modalContent.querySelector('#modalViewBossArenaBtn');
    if (viewBossArenaBtn) {
      viewBossArenaBtn.addEventListener('click', (e) => {
        this.closeCompendiumDetailModal();
        this.navigateToView('boss', e);
      });
    }

    const unlockSkillBtn = modalContent.querySelector('#modalUnlockSkillBtn');
    if (unlockSkillBtn) {
      unlockSkillBtn.addEventListener('click', (e) => {
        if (this.engine.unlockSkill(activeItem.id)) {
          sfx.unlock();
          HeroVoiceSynthesizer.speak("Ability unlocked!");
          this.triggerComicPop(e, 'SKILL UNLOCKED!');
          if (window.confetti) window.confetti({ particleCount: 60 });
          this.renderAll();
          this.closeCompendiumDetailModal();
        } else {
          alert('Bạn không đủ điểm Skill Points hoặc chưa đạt điều kiện Level!');
        }
      });
    }

    // Previous / Next Nav Buttons
    const prevBtn = document.getElementById('prevCardBtn');
    const nextBtn = document.getElementById('nextCardBtn');
    if (prevBtn) {
      prevBtn.disabled = this.currentModalResultSet.length <= 1;
      prevBtn.onclick = () => {
        this.currentModalIndex = (this.currentModalIndex - 1 + this.currentModalResultSet.length) % this.currentModalResultSet.length;
        this.openCompendiumDetailModal(this.currentModalResultSet[this.currentModalIndex], this.currentModalCategory, this.currentModalResultSet, this.currentModalIndex);
      };
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentModalResultSet.length <= 1;
      nextBtn.onclick = () => {
        this.currentModalIndex = (this.currentModalIndex + 1) % this.currentModalResultSet.length;
        this.openCompendiumDetailModal(this.currentModalResultSet[this.currentModalIndex], this.currentModalCategory, this.currentModalResultSet, this.currentModalIndex);
      };
    }

    modalEl.classList.add('active');
    sfx.cardExpand();
  }

  closeCompendiumDetailModal() {
    const modalEl = document.getElementById('compendiumDetailModal');
    if (modalEl && modalEl.classList.contains('active')) {
      modalEl.classList.remove('active');
      sfx.cardCollapse();
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }
    }
  }

  renderAll() {
    this.renderHeaderStatus();
    this.renderHomeView();
    this.renderCharacterView();
    this.renderDailyView();
    this.renderQuestsView();
    this.renderProjectsView();
    this.renderBossCombatView();
    this.renderMapView();
    this.renderSkillsView();
    this.renderSuitsView();
    this.renderGadgetsView();
    this.renderAlliesView();
    this.renderVillainsView();
    this.renderShopView();
    this.renderCollection();
    this.renderVariantsView();

    SpiderRadarChart.draw('spiderRadarCanvas', this.state.character.stats);
    Card3DTiltEngine.init();
  }

  renderHeaderStatus() {
    const { character } = this.state;
    document.getElementById('heroNameHeader').textContent = character.heroName;
    document.getElementById('rankBadgeHeader').textContent = `LV.${character.level} HERO`;

    const xpPct = Math.round((character.xp / character.xpToNext) * 100);
    document.getElementById('xpMiniFill').style.width = `${xpPct}%`;

    document.getElementById('headerGoldVal').textContent = character.gold.toLocaleString();
    document.getElementById('headerEnergyVal').textContent = `${character.energy}%`;
    document.getElementById('headerMomentumVal').textContent = `${character.momentum}%`;
    document.getElementById('headerSkillPtsVal').textContent = character.skillPoints;

    const suit = this.state.suitsState.find(s => s.id === character.equippedSuitId);
    if (suit && suit.themeClass) {
      document.body.className = `dark-theme ${suit.themeClass} spider-halftone-pattern`;
    }

    this.updateSoundUI();
  }

  // 1. HOME VIEW
  renderHomeView() {
    const { currentBossState, questsState } = this.state;
    const villainDef = BossSystem.getVillain(currentBossState.villainId);

    document.getElementById('homeBossName').textContent = villainDef.name.toUpperCase();
    document.getElementById('homeBossWeakness').textContent = `WEAKNESS: ${villainDef.weakness.toUpperCase()}`;
    
    const avatarEl = document.getElementById('homeBossAvatar');
    if (avatarEl) {
      const mediaHtml = MediaHelper.renderMediaCardHtml(villainDef.mediaId || villainDef.id, villainDef.name, "media-avatar-img");
      avatarEl.innerHTML = `<div class="spider-reticle-overlay"></div>${mediaHtml}`;
    }

    document.getElementById('homeBossHpTxt').textContent = `${currentBossState.currentHp} / ${currentBossState.maxHp}`;
    const hpPct = Math.round((currentBossState.currentHp / currentBossState.maxHp) * 100);
    document.getElementById('homeBossHpFill').style.width = `${hpPct}%`;

    document.getElementById('homeBossArmorTxt').textContent = `${currentBossState.currentArmor} / ${currentBossState.maxArmor}`;
    const armorPct = Math.round((currentBossState.currentArmor / currentBossState.maxArmor) * 100);
    document.getElementById('homeBossArmorFill').style.width = `${armorPct}%`;

    document.getElementById('homeBossStaggerTxt').textContent = `${currentBossState.stagger} / ${currentBossState.maxStagger}`;
    const staggerPct = Math.round((currentBossState.stagger / currentBossState.maxStagger) * 100);
    document.getElementById('homeBossStaggerFill').style.width = `${staggerPct}%`;

    const container = document.getElementById('homeActionsList');
    container.innerHTML = '';

    questsState.dailyQuests.forEach(quest => {
      const item = document.createElement('div');
      item.className = `directive-action-item ${quest.completed ? 'done' : ''}`;
      item.innerHTML = `
        <div class="action-info">
          <h4>${quest.icon} ${quest.title}</h4>
          <div class="action-rewards-row">
            <span>+${quest.xpReward} XP</span>
            <span>+${quest.goldReward} Gold</span>
            <span>+${quest.damage} Dmg</span>
          </div>
        </div>
        <button class="strike-btn">${quest.completed ? '✓ DONE' : 'WEB STRIKE'}</button>
      `;

      item.querySelector('.strike-btn').addEventListener('click', (e) => {
        if (!quest.completed) {
          quest.completed = true;
          sfx.webThwip();
          HeroVoiceSynthesizer.speak("Thwip!");
          this.triggerScreenShake();
          this.triggerComicPop(e, 'THWIP!');
          
          const result = this.engine.executeAction({
            type: 'daily',
            id: quest.id,
            name: quest.title,
            category: quest.category,
            xp: quest.xpReward,
            gold: quest.goldReward,
            attribute: quest.attribute,
            attrXp: quest.attrXpReward,
            damage: quest.damage,
            stagger: quest.stagger
          });

          if (result.xpResult && result.xpResult.leveledUp) {
            document.getElementById('levelUpTitle').textContent = `LEVEL UP! CẤP ${result.xpResult.newLevel}`;
            document.getElementById('levelUpModal').classList.add('active');
          }

          if (window.confetti) window.confetti({ particleCount: 40, spread: 60 });
          this.checkBossVictory(result);
          this.renderAll();
        }
      });

      container.appendChild(item);
    });
  }

  // 2. CHARACTER VIEW
  renderCharacterView() {
    const { character, suitsState, companionsState } = this.state;
    document.getElementById('sheetHeroName').textContent = character.heroName;

    const suit = suitsState.find(s => s.id === character.equippedSuitId);
    const comp = (this.state.alliesState || companionsState).find(c => c.id === character.activeCompanionId);

    document.getElementById('sheetHeroRank').textContent = `LEVEL ${character.level} &bull; ${suit ? suit.name : 'Classic Suit'} HERO`;
    document.getElementById('sheetXpTxt').textContent = `${character.xp} / ${character.xpToNext} XP`;
    const xpPct = Math.round((character.xp / character.xpToNext) * 100);
    document.getElementById('sheetXpFill').style.width = `${xpPct}%`;

    document.getElementById('sheetEquippedSuit').textContent = suit ? `${suit.icon} ${suit.name}` : 'None';
    document.getElementById('sheetActiveCompanion').textContent = comp ? `${comp.icon} ${comp.name}` : 'None';

    const grid = document.getElementById('attributesGrid');
    grid.innerHTML = '';

    const attrDefs = [
      { id: 'agility', name: 'AGILITY', icon: '⚡' },
      { id: 'power', name: 'POWER', icon: '🦾' },
      { id: 'intellect', name: 'INTELLECT', icon: '🧠' },
      { id: 'focus', name: 'FOCUS', icon: '🧘‍♂️' },
      { id: 'discipline', name: 'DISCIPLINE', icon: '🛡️' },
      { id: 'willpower', name: 'WILLPOWER', icon: '💎' }
    ];

    attrDefs.forEach(a => {
      const val = character.stats[a.id] || 10;
      const attrXpVal = character.attrXp[a.id] || 0;
      const req = StatSystem.getAttrXpThreshold(val);
      const pct = Math.min(100, Math.round((attrXpVal / req) * 100));

      const card = document.createElement('div');
      card.className = 'attribute-item-card';
      card.innerHTML = `
        <div class="attr-name">${a.icon} ${a.name}</div>
        <div class="attr-val" style="font-family:var(--font-heading); font-size:1.8rem; color:var(--spider-blue);">${val}</div>
        <div class="meter-track"><div class="meter-fill" style="width: ${pct}%; background: var(--spider-blue);"></div></div>
        <div style="font-size:0.7rem; color: var(--text-muted); text-align:right;">${attrXpVal}/${req} Attr XP</div>
      `;
      grid.appendChild(card);
    });

    // Masteries
    let masteryHtml = '';
    const masteries = this.state.progression.masteries;
    for (const track in masteries) {
      const m = masteries[track];
      const threshold = MasterySystem.getXpToNextRank(m.rank);
      const pct = Math.min(100, Math.round((m.xp / threshold) * 100));
      masteryHtml += `
        <div class="meter-group" style="margin-bottom:0.5rem;">
          <div class="meter-label"><span>${track.toUpperCase()} MASTERY:</span><strong>RANK ${m.rank}</strong></div>
          <div class="meter-track"><div class="meter-fill" style="width: ${pct}%; background: var(--spider-red);"></div></div>
          <div style="font-size:0.7rem; color: var(--text-muted); text-align:right;">${m.xp}/${threshold} XP</div>
        </div>
      `;
    }
    
    let masteryCard = document.getElementById('masteryCard');
    if (!masteryCard) {
      masteryCard = document.createElement('div');
      masteryCard.id = 'masteryCard';
      masteryCard.className = 'bento-card tilt-card';
      document.querySelector('#view-character .bento-grid-container').appendChild(masteryCard);
    }
    masteryCard.innerHTML = `<h3 class="skewed-spider-title">🌟 LONG-TERM MASTERY</h3>${masteryHtml}`;

    // Build Summary
    let buildCard = document.getElementById('buildCard');
    if (!buildCard) {
      buildCard = document.createElement('div');
      buildCard.id = 'buildCard';
      buildCard.className = 'bento-card tilt-card';
      document.querySelector('#view-character .bento-grid-container').appendChild(buildCard);
    }
    const buildDerived = BuildSystem.deriveBuild(this.state.build, this.state.character, this.state.suitsState, this.state.gadgetsState, this.state.companionsState, this.state.skillsState);
    let activeModsHtml = '';
    if (buildDerived.activeModifiers && buildDerived.activeModifiers.length > 0) {
      activeModsHtml = buildDerived.activeModifiers.map(m => {
        let op = m.operation === 'multiply' ? `+${Math.round((m.value - 1) * 100)}%` : `+${m.value}`;
        let target = m.target.toUpperCase();
        let condition = '';
        if (m.when) {
          const conds = [];
          if (m.when.actionKinds) conds.push(`Action: ${m.when.actionKinds.join(', ')}`);
          if (m.when.attributes) conds.push(`Attr: ${m.when.attributes.join(', ')}`);
          if (m.when.tags) conds.push(`Tags: ${m.when.tags.join(', ')}`);
          if (m.when.villainIds) conds.push(`Vs: ${m.when.villainIds.join(', ')}`);
          if (conds.length > 0) condition = ` <span style="color:var(--text-muted); font-size:0.8rem;">(${conds.join(' | ')})</span>`;
        }
        return `<div><strong style="color:var(--spider-blue);">${target}:</strong> ${op}${condition}</div>`;
      }).join('');
    } else {
      activeModsHtml = `<div><span style="color:var(--text-muted);">No active modifiers.</span></div>`;
    }

    buildCard.innerHTML = `
      <h3 class="skewed-spider-title">🛠️ CURRENT BUILD</h3>
      <div style="font-size:0.9rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.5rem;">
        <div><strong style="color:var(--spider-blue);">Suit:</strong> ${buildDerived.suit ? buildDerived.suit.name : 'None'}</div>
        <div><strong style="color:var(--spider-blue);">Companion:</strong> ${buildDerived.companion ? buildDerived.companion.name : 'None'}</div>
        <div><strong style="color:var(--spider-blue);">Gadgets:</strong> ${buildDerived.gadgets.length ? buildDerived.gadgets.map(g => g.name).join(', ') : 'None'}</div>
        <hr style="border:none; border-top:1px solid #334155; margin: 4px 0;" />
        ${activeModsHtml}
      </div>
    `;
  }

  // 3. DAILY VIEW
  renderDailyView() {
    const grid = document.getElementById('dailyHabitsGrid');
    grid.innerHTML = '';

    this.state.questsState.dailyQuests.forEach(quest => {
      const card = document.createElement('div');
      card.className = 'item-card tilt-card';
      card.innerHTML = `
        <div class="item-card-head" style="display:flex; align-items:center; gap:0.75rem;">
          <div class="item-icon-box" style="font-size:1.8rem;">${quest.icon}</div>
          <div>
            <h3>${quest.title}</h3>
            <span class="item-rarity" style="font-size:0.75rem; color:var(--spider-blue); font-weight:700;">HABIT &bull; CONTROL &bull; ${quest.attribute.toUpperCase()}</span>
          </div>
        </div>
        <div class="item-desc" style="font-size:0.85rem; color:var(--text-muted);">Tích lũy XP, Gold, Mastery & Stagger Boss!</div>
        <button class="primary-btn strike-btn">${quest.completed ? '✓ ĐÃ CHECK-IN HÔM NAY' : '⚡ STRIKE CHECK-IN'}</button>
      `;

      card.querySelector('.strike-btn').addEventListener('click', (e) => {
        if (!quest.completed) {
          quest.completed = true;
          sfx.webThwip();
          HeroVoiceSynthesizer.speak("Check in complete!");
          this.triggerScreenShake();
          this.triggerComicPop(e, 'THWIP!');
          
          const result = this.engine.executeAction({
            kind: 'habit',
            id: quest.id,
            name: quest.title,
            category: quest.category,
            xp: quest.xpReward,
            gold: quest.goldReward,
            attribute: quest.attribute,
            attrXp: quest.attrXpReward,
            damage: quest.damage,
            stagger: quest.stagger
          });

          if (result.xpResult && result.xpResult.leveledUp) {
            document.getElementById('levelUpTitle').textContent = `LEVEL UP! CẤP ${result.xpResult.newLevel}`;
            document.getElementById('levelUpModal').classList.add('active');
          }

          if (window.confetti) window.confetti({ particleCount: 50 });
          this.checkBossVictory(result);
          this.renderAll();
        }
      });

      grid.appendChild(card);
    });
  }

  // 4. NOTION KANBAN QUESTS VIEW
  renderQuestsView() {
    const listTodo = document.getElementById('listTodo');
    const listDoing = document.getElementById('listDoing');
    const listDone = document.getElementById('listDone');

    if (!listTodo) return;
    listTodo.innerHTML = '';
    listDoing.innerHTML = '';
    listDone.innerHTML = '';

    const tasks = this.state.questsState.tasks || [];
    let countTodoVal = 0, countDoingVal = 0, countDoneVal = 0;

    tasks.forEach(t => {
      const card = document.createElement('div');
      card.className = 'kanban-card tilt-card';

      if (t.done) {
        countDoneVal++;
        card.innerHTML = `
          <strong style="color:var(--success-green); text-decoration:line-through;">✓ ${t.text}</strong>
          <span style="font-size:0.75rem; color:var(--text-muted);">TASK &bull; ATTACK</span>
        `;
        listDone.appendChild(card);
      } else {
        countTodoVal++;
        card.innerHTML = `
          <strong style="color:#fff;">⚪ ${t.text}</strong>
          <span style="font-size:0.75rem; color:var(--spider-blue); font-weight:700;">TASK &bull; ATTACK</span>
          <button class="primary-btn strike-btn" style="margin-top:4px;">THỰC HIỆN TASK</button>
        `;

        card.querySelector('.strike-btn').addEventListener('click', (e) => {
          t.done = true;
          sfx.webThwip();
          HeroVoiceSynthesizer.speak("Task complete!");
          this.triggerScreenShake();
          this.triggerComicPop(e, 'WEB STRIKE!');
          
          const result = this.engine.executeAction({
            kind: 'task',
            difficulty: 'normal',
            id: t.id,
            name: t.text,
            category: 'general',
            xp: 25,
            gold: 15,
            attribute: 'focus',
            attrXp: 10,
            damage: t.damage,
            stagger: 10
          });

          if (result.xpResult && result.xpResult.leveledUp) {
            document.getElementById('levelUpTitle').textContent = `LEVEL UP! CẤP ${result.xpResult.newLevel}`;
            document.getElementById('levelUpModal').classList.add('active');
          }

          this.checkBossVictory(result);
          this.renderAll();
        });

        listTodo.appendChild(card);
      }
    });

    document.getElementById('countTodo').textContent = countTodoVal;
    document.getElementById('countDoing').textContent = countDoingVal;
    document.getElementById('countDone').textContent = countDoneVal;
  }

  // 5. PROJECTS VIEW
  renderProjectsView() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    const goals = this.state.questsState.goals || [];
    const activeGoals = goals.filter(g => g.status === 'active');
    
    if (activeGoals.length > 0) {
      const goalSummary = document.createElement('div');
      goalSummary.style.gridColumn = '1 / -1';
      goalSummary.style.marginBottom = '1rem';
      
      let goalsHtml = activeGoals.map(g => {
        const pct = Math.round((g.currentValue / g.targetValue) * 100);
        return `
          <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:4px; margin-bottom:8px; border-left:3px solid var(--gold-accent);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h4 style="margin:0; font-family:var(--font-heading); color:#fff;">${g.title}</h4>
                <div style="font-size:0.75rem; color:var(--spider-blue); font-weight:700; margin-top:2px;">GOAL &bull; STRATEGY</div>
              </div>
              <div style="text-align:right;">
                <span style="font-family:var(--font-heading); color:var(--gold-accent);">${g.currentValue}/${g.targetValue}</span>
                <div style="font-size:0.75rem; color:var(--text-muted);">${g.metricLabel}</div>
              </div>
            </div>
            <div class="meter-track" style="height:4px; margin-top:8px; background:rgba(0,0,0,0.5);">
              <div class="meter-fill" style="width:${pct}%; background:var(--gold-accent);"></div>
            </div>
          </div>
        `;
      }).join('');
      
      goalSummary.innerHTML = `<h3 style="font-size:1rem; color:var(--text-muted); margin-bottom:0.5rem;">ACTIVE GOALS</h3>${goalsHtml}`;
      grid.appendChild(goalSummary);
    }

    this.state.questsState.projects.forEach(proj => {
      const villain = BossSystem.getVillain(proj.villainId);
      
      let milestonesHtml = '';
      proj.milestones.forEach(m => {
        milestonesHtml += `
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; padding:6px 0;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <input type="checkbox" ${m.completed ? 'checked' : ''} class="milestone-check" data-mid="${m.id}" style="cursor:pointer;">
              <span style="${m.completed ? 'color:var(--success-green); text-decoration:line-through;' : 'color:#fff;'}">${m.title}</span>
            </div>
            <span style="color:var(--gold-accent); font-weight:700;">MILESTONE &bull; CRITICAL</span>
          </div>
        `;
      });

      const card = document.createElement('div');
      card.className = 'bento-card tilt-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="encounter-badge">PROJECT BOSS: ${villain.name.toUpperCase()}</span>
            <h3 style="font-family:var(--font-heading); font-size:1.6rem; color:#fff; margin-top:4px;">${proj.title}</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">${proj.description}</p>
          </div>
          <span style="font-family:var(--font-heading); font-size:2rem; color:var(--spider-blue);">${proj.progress}%</span>
        </div>
        <div class="meter-track"><div class="meter-fill" style="width:${proj.progress}%; background:var(--spider-blue);"></div></div>
        <div style="margin-top:0.5rem;">
          <strong style="font-size:0.85rem; color:var(--gold-accent);">MILESTONES (CRITICAL STRIKES):</strong>
          <div style="margin-top:4px;">${milestonesHtml}</div>
        </div>
      `;

      card.querySelectorAll('.milestone-check').forEach(chk => {
        chk.addEventListener('change', (e) => {
          const mId = chk.getAttribute('data-mid');
          const targetM = proj.milestones.find(m => m.id === mId);
          if (targetM) {
            targetM.completed = e.target.checked;
            if (targetM.completed) {
              sfx.success();
              HeroVoiceSynthesizer.speak("Critical Hit!");
              this.triggerScreenShake();
              this.triggerComicPop(e, 'CRITICAL HIT!');
              
              const result = this.engine.executeAction({
                kind: 'milestone',
                id: targetM.id,
                name: `Milestone: ${targetM.title}`,
                category: 'milestone',
                xp: 150,
                gold: 100,
                attribute: 'intellect',
                attrXp: 50,
                damage: targetM.damage,
                stagger: 35
              });

              if (window.confetti) window.confetti({ particleCount: 80, spread: 80 });
              this.checkBossVictory(result);
            }

            const doneCount = proj.milestones.filter(m => m.completed).length;
            proj.progress = Math.round((doneCount / proj.milestones.length) * 100);
            this.renderAll();
          }
        });
      });

      grid.appendChild(card);
    });
  }

  // 6. BOSS COMBAT VIEW
  renderBossCombatView() {
    const { currentBossState } = this.state;
    const villainDef = BossSystem.getVillain(currentBossState.villainId);

    document.getElementById('arenaBossName').textContent = villainDef.name.toUpperCase();
    
    const currentPhaseDef = villainDef.phases.find(p => p.phase === currentBossState.currentPhase) || villainDef.phases[0];
    const mechanicDesc = villainDef.mechanics ? villainDef.mechanics.description : "No active mechanics.";
    const lastEvent = currentBossState.lastMechanicEvent ? ` &bull; <span style="color:var(--gold-accent);">${currentBossState.lastMechanicEvent}</span>` : "";

    const bossDescEl = document.getElementById('arenaBossDesc');
    if (bossDescEl) {
      bossDescEl.innerHTML = `Phase ${currentBossState.currentPhase}: ${currentPhaseDef.title} &bull; ${mechanicDesc}${lastEvent}`;
    }

    const arenaAvatarEl = document.getElementById('arenaBossAvatar');
    if (arenaAvatarEl) {
      const mediaHtml = MediaHelper.renderMediaCardHtml(villainDef.mediaId || villainDef.id, villainDef.name, "media-avatar-img");
      arenaAvatarEl.innerHTML = `<div class="spider-reticle-overlay"></div>${mediaHtml}`;
    }

    document.getElementById('arenaWeaknessTxt').textContent = `⚡ WEAKNESS MATCH: ${villainDef.weakness.toUpperCase()} (1.5x DAMAGE)`;

    document.getElementById('arenaBossHpTxt').textContent = `${currentBossState.currentHp} / ${currentBossState.maxHp}`;
    const hpPct = Math.round((currentBossState.currentHp / currentBossState.maxHp) * 100);
    document.getElementById('arenaBossHpFill').style.width = `${hpPct}%`;

    document.getElementById('arenaBossArmorTxt').textContent = `${currentBossState.currentArmor} / ${currentBossState.maxArmor}`;
    const armorPct = Math.round((currentBossState.currentArmor / currentBossState.maxArmor) * 100);
    document.getElementById('arenaBossArmorFill').style.width = `${armorPct}%`;

    document.getElementById('arenaBossStaggerTxt').textContent = `${currentBossState.stagger} / ${currentBossState.maxStagger}`;
    const staggerPct = Math.round((currentBossState.stagger / currentBossState.maxStagger) * 100);
    document.getElementById('arenaBossStaggerFill').style.width = `${staggerPct}%`;

    const finisherBtn = document.getElementById('arenaFinisherBtn');
    if (currentBossState.stagger >= currentBossState.maxStagger) {
      finisherBtn.disabled = false;
      finisherBtn.textContent = '⚡ EXECUTE FINISHER (+350 CRITICAL DAMAGE!)';
    } else {
      finisherBtn.disabled = true;
      finisherBtn.textContent = '⚡ EXECUTE FINISHER (STAGGER 100% REQUIRED)';
    }

    const logList = document.getElementById('combatLogList');
    logList.innerHTML = '';

    currentBossState.combatLog.forEach(log => {
      const entry = document.createElement('div');
      entry.className = `log-entry ${log.type === 'crit' ? 'crit' : ''}`;
      entry.innerHTML = `[${log.time}] ${log.text}`;
      logList.appendChild(entry);
    });
  }

  // 7. CITY MAP VIEW (14TH NAVIGATION SCREEN - SPIDER OPS TRACKER CONSOLE)
  renderMapView() {
    const nodesLayer = document.getElementById('mapNodesLayer');
    if (!nodesLayer) return;

    nodesLayer.innerHTML = '';

    const activeFilter = this.state.mapState.activeFilter || 'all';
    const searchQuery = (document.getElementById('mapSearchInput')?.value || '').toLowerCase().trim();
    const selectedDistrictId = this.state.mapState.selectedDistrictId || 'midtown';

    // Highlight SVG District Path
    document.querySelectorAll('.district-path').forEach(p => {
      if (p.getAttribute('data-district') === selectedDistrictId) {
        p.classList.add('selected');
      } else {
        p.classList.remove('selected');
      }
    });

    // Filter nodes
    const filteredNodes = MAP_DATA.nodes.filter(n => {
      const matchFilter = (
        activeFilter === 'all' || 
        n.type === activeFilter || 
        n.status === activeFilter || 
        n.category === activeFilter
      );
      const matchSearch = !searchQuery || 
        n.title.toLowerCase().includes(searchQuery) || 
        n.description.toLowerCase().includes(searchQuery) || 
        n.typeLabel.toLowerCase().includes(searchQuery) ||
        (n.coords && n.coords.toLowerCase().includes(searchQuery));
      return matchFilter && matchSearch;
    });

    if (filteredNodes.length === 0) {
      nodesLayer.innerHTML = `
        <div class="zero-results-msg" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:82%; max-width:380px; background:rgba(3,7,18,0.92); border:1px solid var(--signal-amber); border-radius:8px; padding:1.5rem; text-align:center; box-shadow:0 0 20px rgba(255,183,0,0.2); pointer-events:auto;">
          <div style="font-size:2rem; margin-bottom:0.4rem;">📡</div>
          <h4 style="color:var(--signal-amber); font-family:var(--font-mono); margin-bottom:0.4rem; font-size:0.95rem;">NO TACTICAL SIGNALS DETECTED</h4>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem; line-height:1.4;">No patrol targets match query "${searchQuery || activeFilter}". Adjust filters or reset search.</p>
          <button class="secondary-btn" id="resetMapFiltersBtn" style="font-size:0.75rem; padding:6px 12px; font-family:var(--font-mono);">🔄 RESET FILTERS</button>
        </div>
      `;
      document.getElementById('resetMapFiltersBtn')?.addEventListener('click', () => {
        this.state.mapState.activeFilter = 'all';
        const searchInput = document.getElementById('mapSearchInput');
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('#mapFilterChips .filter-chip').forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        const allChip = document.querySelector('#mapFilterChips [data-mapfilter="all"]');
        if (allChip) {
          allChip.classList.add('active');
          allChip.setAttribute('aria-selected', 'true');
        }
        sfx.click();
        this.renderMapView();
      });
      this.drawRadarMinimap([], null);
      this.drawWebConnections(null);
      this.updateTrackerTicker(null);
      return;
    }

    filteredNodes.forEach(node => {
      const marker = document.createElement('div');
      const isSelected = this.selectedMapNodeId === node.id;
      const shapeClass = node.shape ? `shape-${node.shape}` : 'shape-circle';

      marker.className = `map-marker-node ${shapeClass} ${isSelected ? 'selected' : ''}`;
      if (node.category) marker.classList.add(`cat-${node.category}`);
      marker.style.left = `${node.x}%`;
      marker.style.top = `${node.y}%`;
      marker.setAttribute('tabindex', '0');
      marker.setAttribute('role', 'button');
      marker.setAttribute('aria-label', `${node.title} (${node.typeLabel})`);

      marker.innerHTML = `<span class="node-icon-inner">${node.icon}</span>`;

      const selectNodeHandler = () => {
        this.selectedMapNodeId = node.id;
        if (node.category === 'rumored' || node.type === 'boss_threat') {
          sfx.warningAlert();
        } else if (node.status === 'completed' || node.category === 'confirmed') {
          sfx.confirmedChime();
        } else {
          sfx.nodeSelect();
        }
        this.addMapLogEntry(`SELECTED: ${node.title.toUpperCase()} (${node.districtId.toUpperCase()})`);
        this.renderMapView();
      };

      marker.addEventListener('click', selectNodeHandler);
      marker.addEventListener('mouseenter', () => sfx.nodeHover());
      marker.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectNodeHandler();
        }
      });

      nodesLayer.appendChild(marker);
    });

    // Update Context Intel Side Panel
    const selectedNode = MAP_DATA.nodes.find(n => n.id === this.selectedMapNodeId) || filteredNodes[0];
    if (selectedNode) {
      this.selectedMapNodeId = selectedNode.id;
      const districtDef = MAP_DATA.districts.find(d => d.id === selectedNode.districtId);

      const typeBadge = document.getElementById('mapPanelTypeBadge');
      if (typeBadge) typeBadge.textContent = selectedNode.typeLabel;

      const coordsBadge = document.getElementById('mapPanelCoords');
      if (coordsBadge) coordsBadge.textContent = selectedNode.coords || `${selectedNode.x * 1.25}°W / ${selectedNode.y * 0.75}°N`;

      const titleEl = document.getElementById('mapPanelTitle');
      if (titleEl) titleEl.textContent = selectedNode.title.toUpperCase();

      const descEl = document.getElementById('mapPanelDesc');
      if (descEl) descEl.textContent = selectedNode.description;

      const distEl = document.getElementById('mapPanelDistrict');
      if (distEl) distEl.textContent = districtDef ? `${districtDef.name} (${districtDef.code})` : selectedNode.districtId;

      const statusEl = document.getElementById('mapPanelStatus');
      if (statusEl) {
        statusEl.textContent = selectedNode.status.toUpperCase();
        statusEl.className = selectedNode.status === 'locked' ? 'meta-val' : (selectedNode.status === 'completed' ? 'meta-val val-frost' : 'meta-val val-cyan');
      }

      const sourceEl = document.getElementById('mapPanelSource');
      if (sourceEl) sourceEl.textContent = selectedNode.source || 'Spider-Net Recon';

      const rewardsEl = document.getElementById('mapPanelRewards');
      if (rewardsEl) rewardsEl.textContent = selectedNode.rewardHint || 'XP & Gold';

      const launchBtn = document.getElementById('launchMapNodeBtn');
      if (launchBtn) {
        launchBtn.textContent = `🚀 DEPLOY TO: ${selectedNode.targetView.toUpperCase()} SCREEN`;
      }

      this.drawWebConnections(selectedNode);
      this.drawRadarMinimap(filteredNodes, selectedNode);
      this.updateTrackerTicker(selectedNode);
    }
  }

  // 8. SKILL TREE & MOVES VIEW
  renderSkillsView() {
    const container = document.getElementById('skillTreeContainer');
    if (!container) return;
    container.innerHTML = '';

    const searchQuery = (document.getElementById('skillSearchInput')?.value || '').toLowerCase().trim();
    const gameFilter = document.getElementById('skillGameSelect')?.value || 'all';
    const heroFilter = document.getElementById('skillHeroSelect')?.value || 'all';
    const familyFilter = document.getElementById('skillFamilySelect')?.value || 'all';
    const branchFilter = document.getElementById('skillBranchSelect')?.value || 'all';

    const branches = [
      { id: 'spider_abilities', name: '🕸️ SPIDER ABILITIES & TRAVERSAL' },
      { id: 'web_combat', name: '🎯 WEB COMBAT & FINISHERS' },
      { id: 'tech_stealth', name: '⚙️ TECH & STEALTH TACTICS' },
      { id: 'venom_bioelectric', name: '⚡ BIO-ELECTRIC VENOM POWERS' },
      { id: 'symbiote_powers', name: '🖤 SYMBIOTE POWERS & RAGE' }
    ];

    const skillsList = this.state.skillsState || (typeof SKILLS_DATA !== 'undefined' ? SKILLS_DATA : []);
    let renderedCount = 0;

    branches.forEach(br => {
      if (branchFilter !== 'all' && branchFilter !== br.id) return;

      const branchSkills = skillsList.filter(s => {
        const matchBranch = (s.branch === br.id || (br.id === 'intellect' && (s.branch === 'intellect' || s.branch === 'mindset')));
        const matchGame = (gameFilter === 'all' || s.gameId === gameFilter);
        const matchHero = (heroFilter === 'all' || s.playableHero === heroFilter || (s.playableHero === 'shared' && (heroFilter === 'peter' || heroFilter === 'miles')));
        const matchFamily = (familyFilter === 'all' || s.abilityFamily === familyFilter);

        const matchSearch = !searchQuery ||
          s.name.toLowerCase().includes(searchQuery) ||
          (s.description && s.description.toLowerCase().includes(searchQuery)) ||
          (s.gameSource && s.gameSource.toLowerCase().includes(searchQuery)) ||
          (s.abilityFamily && s.abilityFamily.toLowerCase().includes(searchQuery));

        return matchBranch && matchGame && matchHero && matchFamily && matchSearch;
      });

      if (branchSkills.length === 0) return;
      renderedCount += branchSkills.length;

      const sec = document.createElement('div');
      sec.className = 'bento-card tilt-card';
      sec.style.marginBottom = '1.25rem';

      const secTitle = document.createElement('h3');
      secTitle.className = 'branch-title skewed-spider-title';
      secTitle.style.marginBottom = '0.75rem';
      secTitle.style.color = 'var(--spider-blue)';
      secTitle.textContent = br.name;
      sec.appendChild(secTitle);

      const grid = document.createElement('div');
      grid.className = 'skills-cards-grid';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
      grid.style.gap = '1rem';

      branchSkills.forEach((s, index) => {
        const mediaHtml = MediaHelper.renderMediaCardHtml(s.mediaId || s.id, s.name, "media-avatar-img", false);

        const card = document.createElement('div');
        card.className = `portrait-card-face tilt-card ${s.unlocked ? 'unlocked' : ''}`;
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Xem chi tiết kỹ năng ${s.name}`);

        card.innerHTML = `
          <div class="holographic-edge-wrap">${mediaHtml}</div>
          <div class="card-bottom-nameplate">
            <h3 class="card-character-name">${s.name}</h3>
          </div>
        `;

        const openModal = () => {
          this.openCompendiumDetailModal(s, "SKILLS & MOVES", branchSkills, index);
        };

        card.addEventListener('click', openModal);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        });

        grid.appendChild(card);
      });

      sec.appendChild(grid);
      container.appendChild(sec);
    });

    if (renderedCount === 0) {
      container.innerHTML = `<div class="zero-results-msg">Không tìm thấy kỹ năng / nước đi nào phù hợp với bộ lọc đã chọn.</div>`;
    }
  }

  // 9. SUITS STUDIO VIEW
  renderSuitsView() {
    const grid = document.getElementById('suitsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchQuery = (document.getElementById('suitSearchInput')?.value || '').toLowerCase().trim();
    const gameFilter = document.getElementById('suitGameSelect')?.value || 'all';
    const heroFilter = document.getElementById('suitHeroSelect')?.value || 'all';
    const rarityFilter = document.getElementById('suitRaritySelect')?.value || 'all';
    const equippedFilter = document.getElementById('suitEquippedSelect')?.value || 'all';

    const suitsList = this.state.suitsState || (typeof SUITS_DATA !== 'undefined' ? SUITS_DATA : []);

    const filteredSuits = suitsList.filter(suit => {
      const matchGame = (gameFilter === 'all' || suit.gameId === gameFilter);
      const matchHero = (heroFilter === 'all' || suit.playableHero === heroFilter || (suit.playableHero === 'both' && (heroFilter === 'peter' || heroFilter === 'miles')));
      const matchRarity = (rarityFilter === 'all' || suit.rarity === rarityFilter);
      
      const isEquipped = this.state.character.equippedSuitId === suit.id;
      const isUnlocked = !!suit.unlocked;
      const matchEquipped = (equippedFilter === 'all') ||
        (equippedFilter === 'equipped' && isEquipped) ||
        (equippedFilter === 'unlocked' && isUnlocked) ||
        (equippedFilter === 'locked' && !isUnlocked);

      const matchSearch = !searchQuery ||
        suit.name.toLowerCase().includes(searchQuery) ||
        (suit.description && suit.description.toLowerCase().includes(searchQuery)) ||
        (suit.gameSource && suit.gameSource.toLowerCase().includes(searchQuery)) ||
        (suit.suitFamily && suit.suitFamily.toLowerCase().includes(searchQuery));

      return matchGame && matchHero && matchRarity && matchEquipped && matchSearch;
    });

    if (filteredSuits.length === 0) {
      grid.innerHTML = `<div class="zero-results-msg" style="grid-column:1/-1;">Không tìm thấy bộ trang phục Suit nào phù hợp với bộ lọc đã chọn.</div>`;
      return;
    }

    filteredSuits.forEach((suit, index) => {
      const isEquipped = this.state.character.equippedSuitId === suit.id;
      const mediaHtml = MediaHelper.renderMediaCardHtml(suit.mediaId || suit.id, suit.name, "media-avatar-img", false);

      const card = document.createElement('div');
      card.className = `portrait-card-face tilt-card ${isEquipped ? 'equipped' : ''}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Xem chi tiết trang phục ${suit.name}`);

      card.innerHTML = `
        <div class="holographic-edge-wrap">${mediaHtml}</div>
        <div class="card-bottom-nameplate">
          <h3 class="card-character-name">${suit.name}</h3>
        </div>
      `;

      const openModal = () => {
        this.openCompendiumDetailModal(suit, "SPIDER-MAN SUITS", filteredSuits, index);
      };

      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });

      grid.appendChild(card);
    });
  }

  // 10. GADGETS VIEW
  renderGadgetsView() {
    const grid = document.getElementById('gadgetsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchQuery = (document.getElementById('gadgetSearchInput')?.value || '').toLowerCase().trim();
    const rarityFilter = document.getElementById('gadgetRaritySelect')?.value || 'all';

    const filteredGadgets = this.state.gadgetsState.filter(gadget => {
      const matchRarity = (rarityFilter === 'all' || gadget.rarity === rarityFilter);
      const matchSearch = !searchQuery || gadget.name.toLowerCase().includes(searchQuery) || gadget.description.toLowerCase().includes(searchQuery) || (gadget.gameSource && gadget.gameSource.toLowerCase().includes(searchQuery));
      return matchRarity && matchSearch;
    });

    if (filteredGadgets.length === 0) {
      grid.innerHTML = `<div class="zero-results-msg" style="grid-column:1/-1;">Không tìm thấy thiết bị Gadget nào phù hợp với tìm kiếm.</div>`;
      return;
    }

    filteredGadgets.forEach((gadget, index) => {
      const isEquipped = this.state.build.equippedGadgetIds && this.state.build.equippedGadgetIds.includes(gadget.id);
      const mediaHtml = MediaHelper.renderMediaCardHtml(gadget.mediaId || gadget.id, gadget.name, "media-avatar-img", true);

      const card = document.createElement('div');
      card.className = `portrait-card-face tilt-card ${isEquipped ? 'equipped' : ''}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Xem chi tiết thiết bị ${gadget.name}`);

      card.innerHTML = `
        <div class="holographic-edge-wrap">${mediaHtml}</div>
        <div class="card-bottom-nameplate">
          <h3 class="card-character-name">${gadget.name}</h3>
        </div>
      `;

      const openModal = () => {
        this.openCompendiumDetailModal(gadget, "INSOMNIAC GADGETS", filteredGadgets, index);
      };

      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });

      grid.appendChild(card);
    });
  }

  // 11. ALLIES VIEW (26 NON-SPIDER ALLIES COMPENDIUM)
  renderAlliesView() {
    const grid = document.getElementById('companionsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchQuery = (document.getElementById('allySearchInput')?.value || '').toLowerCase().trim();
    const roleFilter = document.getElementById('allyRoleSelect')?.value || 'all';

    const alliesList = this.state.alliesState || (typeof ALLIES_DATA !== 'undefined' ? ALLIES_DATA : []);

    const filteredAllies = alliesList.filter(comp => {
      const matchRole = (roleFilter === 'all' || comp.category === roleFilter);
      const matchSearch = !searchQuery || comp.name.toLowerCase().includes(searchQuery) || comp.title.toLowerCase().includes(searchQuery) || comp.specialty.toLowerCase().includes(searchQuery);
      return matchRole && matchSearch;
    });

    if (filteredAllies.length === 0) {
      grid.innerHTML = `<div class="zero-results-msg" style="grid-column:1/-1;">Không tìm thấy đồng minh Ally nào phù hợp với bộ lọc.</div>`;
      return;
    }

    filteredAllies.forEach((comp, index) => {
      const isEquipped = this.state.character.activeCompanionId === comp.id;
      const mediaHtml = MediaHelper.renderMediaCardHtml(comp.mediaId || comp.id, comp.name, "media-avatar-img", false);

      const card = document.createElement('div');
      card.className = `portrait-card-face tilt-card ${isEquipped ? 'equipped' : ''}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Xem chi tiết đồng minh ${comp.name}`);

      card.innerHTML = `
        <div class="holographic-edge-wrap">${mediaHtml}</div>
        <div class="card-bottom-nameplate">
          <h3 class="card-character-name">${comp.name}</h3>
        </div>
      `;

      const openModal = () => {
        this.openCompendiumDetailModal(comp, "SPIDER-ALLIES & COMPANIONS", filteredAllies, index);
      };

      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });

      grid.appendChild(card);
    });
  }

  // 12. VILLAINS CODEX VIEW (30 VILLAINS COMPENDIUM)
  renderVillainsView() {
    const grid = document.getElementById('villainsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchQuery = (document.getElementById('villainSearchInput')?.value || '').toLowerCase().trim();
    const categoryFilter = document.getElementById('villainCategorySelect')?.value || 'all';
    const difficultyFilter = document.getElementById('villainDifficultySelect')?.value || 'all';

    const filteredVillains = (typeof VILLAINS_DATA !== 'undefined' ? VILLAINS_DATA : []).filter(v => {
      const matchCategory = (categoryFilter === 'all' || v.category === categoryFilter);
      const matchDifficulty = (difficultyFilter === 'all' || v.difficulty === difficultyFilter);
      const matchSearch = !searchQuery || v.name.toLowerCase().includes(searchQuery) || v.title.toLowerCase().includes(searchQuery) || v.description.toLowerCase().includes(searchQuery);
      return matchCategory && matchDifficulty && matchSearch;
    });

    if (filteredVillains.length === 0) {
      grid.innerHTML = `<div class="zero-results-msg" style="grid-column:1/-1;">Không tìm thấy Siêu Phản Diện nào trong Codex phù hợp.</div>`;
      return;
    }

    filteredVillains.forEach((villain, index) => {
      const isCurrent = this.state.currentBossState.villainId === villain.id;
      const mediaHtml = MediaHelper.renderMediaCardHtml(villain.mediaId || villain.id, villain.name, "media-avatar-img", false);

      const card = document.createElement('div');
      card.className = `portrait-card-face tilt-card ${isCurrent ? 'equipped' : ''}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Xem chi tiết phản diện ${villain.name}`);

      card.innerHTML = `
        <div class="holographic-edge-wrap">${mediaHtml}</div>
        <div class="card-bottom-nameplate">
          <h3 class="card-character-name">${villain.name}</h3>
        </div>
      `;

      const openModal = () => {
        this.openCompendiumDetailModal(villain, "VILLAINS CODEX", filteredVillains, index);
      };

      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });

      grid.appendChild(card);
    });
  }

  // 13. SPIDER-VERSE VARIANTS / SPIDER-PEOPLE VIEW (36 SPIDER-PEOPLE COMPENDIUM)
  renderVariantsView() {
    const grid = document.getElementById('variantsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchQuery = (document.getElementById('variantSearchInput')?.value || '').toLowerCase().trim();
    const rarityFilter = document.getElementById('variantRaritySelect')?.value || 'all';

    const variantsList = this.state.variantsState || (typeof SPIDER_PEOPLE_DATA !== 'undefined' ? SPIDER_PEOPLE_DATA : VARIANTS_DATA);

    const filteredVariants = variantsList.filter(v => {
      const matchRarity = (rarityFilter === 'all' || v.rarity === rarityFilter);
      const matchSearch = !searchQuery || v.name.toLowerCase().includes(searchQuery) || (v.title && v.title.toLowerCase().includes(searchQuery)) || v.description.toLowerCase().includes(searchQuery);
      return matchRarity && matchSearch;
    });

    if (filteredVariants.length === 0) {
      grid.innerHTML = `<div class="zero-results-msg" style="grid-column:1/-1;">Không tìm thấy Spider-Person nào phù hợp với bộ lọc.</div>`;
      return;
    }

    filteredVariants.forEach((v, index) => {
      const mediaHtml = MediaHelper.renderMediaCardHtml(v.mediaId || v.id, v.name, "media-avatar-img", false);

      const card = document.createElement('div');
      card.className = `portrait-card-face tilt-card`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Xem chi tiết ${v.name}`);

      card.innerHTML = `
        <div class="holographic-edge-wrap">${mediaHtml}</div>
        <div class="card-bottom-nameplate">
          <h3 class="card-character-name">${v.name}</h3>
        </div>
      `;

      const openModal = () => {
        this.openCompendiumDetailModal(v, "SPIDER-PEOPLE / SPIDER-VERSE", filteredVariants, index);
      };

      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });

      grid.appendChild(card);
    });
  }

  // 14. SHOP VIEW
  renderShopView() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    grid.innerHTML = '';

    this.state.questsState.rewardShop.forEach(item => {
      const card = document.createElement('div');
      card.className = 'item-card tilt-card';
      card.innerHTML = `
        <div class="item-card-head" style="display:flex; align-items:center; gap:0.75rem;">
          <div class="item-icon-box" style="font-size:1.8rem;">${item.icon}</div>
          <div>
            <h3>${item.name}</h3>
            <span class="item-rarity" style="font-size:0.75rem; color:var(--gold-accent); font-weight:700;">${item.category}</span>
          </div>
        </div>
        <div style="font-family:var(--font-heading); font-size:1.5rem; color:var(--gold-accent);">🪙 ${item.cost} GOLD</div>
        <button class="primary-btn buy-reward-btn">${item.purchased ? '✓ REDEEMED' : 'BUY REWARD'}</button>
      `;

      card.querySelector('.buy-reward-btn').addEventListener('click', (e) => {
        if (!item.purchased) {
          if (this.engine.purchaseReward(item.id)) {
            sfx.success();
            HeroVoiceSynthesizer.speak("Reward unlocked!");
            this.triggerComicPop(e, 'REWARD CLAIMED!');
            if (window.confetti) window.confetti({ particleCount: 70 });
            this.renderAll();
          } else {
            alert('Bạn không đủ tiền Gold! Hãy hoàn thành thêm Quests & Daily Tasks.');
          }
        }
      });

      grid.appendChild(card);
    });
  }

  // 15. COLLECTION VIEW
  renderCollection() {
    const grid = document.getElementById('collectionGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const unlockedIds = this.state.inventory.unlockedItemIds;
    if (unlockedIds.length === 0) {
      grid.innerHTML = '<div style="color:var(--text-muted); grid-column: 1/-1;">Chưa có vật phẩm nào trong bộ sưu tập. Hãy đánh bại Boss để nhận thưởng!</div>';
      return;
    }

    unlockedIds.forEach(id => {
      const item = LootSystem.getItemDef(id);
      const qty = this.state.inventory.itemStacks[id] || 1;
      const isNew = this.state.inventory.newItemIds.includes(id);

      const card = document.createElement('div');
      card.className = `item-card tilt-card`;
      card.innerHTML = `
        <div class="item-card-head" style="display:flex; align-items:center; gap:0.75rem; position:relative;">
          ${isNew ? '<span style="position:absolute; top:-10px; right:-10px; background:var(--spider-red); color:#fff; font-size:0.65rem; padding:2px 6px; border-radius:10px; font-weight:bold;">NEW</span>' : ''}
          <div class="item-icon-box" style="font-size:1.8rem;">${item.icon}</div>
          <div>
            <h3>${item.name}</h3>
            <span class="item-rarity" style="font-size:0.75rem; color:var(--spider-blue); font-weight:700;">${item.rarity.toUpperCase()} &bull; QTY: ${qty}</span>
          </div>
        </div>
        <p class="item-desc" style="font-size:0.85rem; color:var(--text-muted);">${item.description}</p>
        <div style="font-size:0.8rem; color:var(--gold-accent);"><em>${item.loreText || ''}</em></div>
      `;
      
      card.addEventListener('mouseenter', () => {
        if (this.state.inventory.newItemIds.includes(id)) {
          LootSystem.markItemsSeen(this.state.inventory, [id]);
          this.engine.save();
          card.querySelector('span[style*="NEW"]')?.remove();
        }
      }, { once: true });

      grid.appendChild(card);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SpiderWebCanvas('spiderWebCanvas');
  window.appUI = new AppUI();
});
