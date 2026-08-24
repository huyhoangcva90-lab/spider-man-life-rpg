/* WEB OPS TRACKER V6 - SOUND CONTROLLER (WEB AUDIO SYNTHESIZER) */

export class SoundController {
  constructor(stateStore) {
    this.stateStore = stateStore;
    this.audioCtx = null;
    this.samples = new Map();
    this.sampleUrls = {
      jingle: new URL('../../assets/audio/spidey_jingle.mp3', import.meta.url).href,
      activity: new URL('../../assets/audio/another_day_another_sighting.mp3', import.meta.url).href,
      fresh: new URL('../../assets/audio/calling_all_webheads.mp3', import.meta.url).href
    };
    this.unlocked = false;
  }

  init() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!this.audioCtx && AudioContextClass) {
      this.audioCtx = new AudioContextClass();
    }
    if (!this.unlocked) {
      this.unlocked = true;
      window.addEventListener('pointerdown', () => {
        if (!this.isEnabled()) return;
        this.audioCtx?.resume?.();
        this.playTrackerJingle();
      }, { once: true, capture: true });
    }
  }

  playSample(name, volume = 0.72) {
    if (!this.isEnabled() || !this.sampleUrls[name]) return;
    try {
      let audio = this.samples.get(name);
      if (!audio) {
        audio = new Audio(this.sampleUrls[name]);
        audio.preload = 'auto';
        this.samples.set(name, audio);
      }
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch { /* audio remains optional */ }
  }

  playTrackerJingle() { this.playSample('jingle', 0.58); }
  playActivityVoice() { this.playSample('activity', 0.78); }
  playFreshSightingVoice() { this.playSample('fresh', 0.78); }

  isEnabled() {
    return this.stateStore.get('soundEnabled');
  }

  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.1) {
    if (!this.isEnabled()) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context policy fallback
    }
  }

  playBootSound() {
    this.init();
    this.playTrackerJingle();
  }

  playClick() {
    this.playTone(800, 'square', 0.04, 0.05);
  }

  playSelect() {
    this.playTone(1200, 'sine', 0.08, 0.08);
  }

  playGpsLocate() {
    this.playTone(523, 'sine', 0.08, 0.08);
    setTimeout(() => this.playTone(1046, 'sine', 0.12, 0.08), 90);
  }

  playSuccess() {
    this.playTone(659, 'triangle', 0.08, 0.08);
    setTimeout(() => this.playTone(880, 'triangle', 0.15, 0.1), 80);
  }

  playWarning() {
    this.playTone(300, 'sawtooth', 0.15, 0.08);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.2, 0.08), 120);
  }
}
