/* WEB OPS TRACKER V6 - SOUND CONTROLLER (WEB AUDIO SYNTHESIZER) */

export class SoundController {
  constructor(stateStore) {
    this.stateStore = stateStore;
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx && typeof window.AudioContext !== 'undefined') {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

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
    if (!this.isEnabled()) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.12, 0.08), idx * 100);
    });
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
