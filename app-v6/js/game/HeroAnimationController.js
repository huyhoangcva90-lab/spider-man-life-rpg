/* Sprite-sheet state machine for the user-supplied Spider combat action atlas. */

export const HERO_ANIMATIONS = [
  'idle', 'combat_idle', 'run', 'jump', 'dodge',
  'attack_01', 'attack_02', 'attack_03', 'ranged_attack',
  'skill_01', 'skill_02', 'skill_03', 'ultimate',
  'hurt', 'knockback', 'KO', 'victory'
];

const STATE = {
  idle:          { frames: [[245, 360], [325, 360]], fps: 3, loop: true, motion: 'breathe' },
  combat_idle:   { frames: [[85, 205], [165, 205]], fps: 5, loop: true, motion: 'guard' },
  run:           { frames: [[0, 0], [80, 0], [160, 0], [240, 0]], fps: 10, motion: 'run' },
  jump:          { frames: [[0, 60], [80, 60], [160, 60]], fps: 8, motion: 'jump' },
  dodge:         { frames: [[0, 120], [80, 120], [160, 120]], fps: 12, motion: 'dodge' },
  attack_01:     { frames: [[0, 180], [80, 180], [160, 180]], fps: 12, motion: 'strike', vfx: ['POW!', 'impact'] },
  attack_02:     { frames: [[240, 180], [320, 180], [400, 180]], fps: 12, motion: 'uppercut', vfx: ['KRAK!', 'slash'] },
  attack_03:     { frames: [[0, 240], [80, 240], [160, 240], [240, 240]], fps: 14, motion: 'spin', vfx: ['WHAM!', 'impact'] },
  ranged_attack: { frames: [[320, 240], [400, 240], [480, 240]], fps: 11, motion: 'recoil', vfx: ['THWIP!', 'web'] },
  skill_01:      { frames: [[0, 360], [80, 360], [160, 360]], fps: 12, motion: 'skill', vfx: ['ZAP!', 'electric'] },
  skill_02:      { frames: [[240, 360], [320, 360], [400, 360]], fps: 12, motion: 'skill', vfx: ['FWIP!', 'web'] },
  skill_03:      { frames: [[0, 420], [240, 420], [320, 420]], fps: 12, motion: 'skill', vfx: ['BOOM!', 'impact'] },
  ultimate:      { frames: [[400, 120], [400, 180], [480, 180], [480, 240]], fps: 15, motion: 'ultimate', vfx: ['MAXIMUM SPIDER!', 'ultimate'] },
  hurt:          { frames: [[240, 480], [320, 480]], fps: 8, motion: 'hurt', vfx: ['UGH!', 'hurt'] },
  knockback:     { frames: [[0, 540], [240, 540], [320, 540]], fps: 10, motion: 'knockback', vfx: ['KABOOM!', 'hurt'] },
  KO:            { frames: [[0, 600], [240, 600]], fps: 5, motion: 'ko', vfx: ['K.O.', 'ko'] },
  victory:       { frames: [[320, 540], [320, 600], [240, 600]], fps: 6, loop: true, motion: 'victory', vfx: ['AMAZING!', 'victory'] }
};

export class HeroAnimationController {
  constructor(eventBus, soundController) {
    this.bus = eventBus;
    this.sound = soundController;
    this.hero = null;
    this.timer = null;
    this.previewIndex = 2;
    this.attackIndex = 0;
    this.playToken = 0;
  }

  init() {
    this.hero = document.getElementById('arena-hero-sprite');
    if (!this.hero) return;
    this.hero.addEventListener('click', () => {
      const state = HERO_ANIMATIONS[this.previewIndex++ % HERO_ANIMATIONS.length];
      this.sound?.playSelect?.();
      this.play(state, { preview: true });
    });
    this.bus.on('HERO_PREPARE_MISSION', () => this.sequence(['run', 'jump', 'combat_idle']));
    this.bus.on('RPG_UPDATED', (result) => this.playCombatResult(result));
    this.play('combat_idle');
  }

  async playCombatResult(result = {}) {
    if (result.blocked) return;
    if (result.heroKo) return this.sequence(['hurt', 'KO', 'combat_idle']);
    if (result.perfectDodge) return this.sequence(['dodge', 'attack_02', 'combat_idle']);
    if (result.victory) return this.sequence(['attack_03', 'victory']);
    if (result.finisher) return this.sequence(['jump', 'ultimate', 'combat_idle']);
    if (result.animation) {
      const animation = result.animation === 'ally_call' ? 'skill_02' : result.animation;
      if (HERO_ANIMATIONS.includes(animation)) return this.sequence([animation, 'combat_idle']);
    }
    if (result.weaknessMatch) {
      const skill = ['skill_01', 'skill_02', 'skill_03'][this.attackIndex++ % 3];
      return this.sequence([skill, 'combat_idle']);
    }
    const attack = ['attack_01', 'attack_02', 'attack_03', 'ranged_attack'][this.attackIndex++ % 4];
    return this.sequence([attack, 'combat_idle']);
  }

  async sequence(states) {
    for (const state of states) await this.play(state, { awaitEnd: true });
  }

  play(name, options = {}) {
    if (!STATE[name] || !this.hero) return Promise.resolve();
    const config = STATE[name];
    const token = ++this.playToken;
    window.clearInterval(this.timer);
    this.hero.dataset.animation = name;
    this.hero.dataset.motion = config.motion;
    this.updateReadout(name);

    let index = 0;
    const draw = () => {
      const [x, y] = config.frames[index % config.frames.length];
      this.hero.style.setProperty('--sprite-x', `${-Math.round(x * 2.4)}px`);
      this.hero.style.setProperty('--sprite-y', `${-Math.round(y * 2.4)}px`);
      index += 1;
    };
    draw();
    const interval = Math.round(1000 / config.fps);
    this.timer = window.setInterval(draw, interval);
    if (config.vfx) window.setTimeout(() => this.spawnVfx(...config.vfx), interval * Math.max(1, config.frames.length - 1));

    const loops = config.loop && !options.preview ? Infinity : 1;
    if (loops === Infinity) return Promise.resolve();
    const duration = Math.max(280, interval * config.frames.length);
    return new Promise((resolve) => window.setTimeout(() => {
      if (token !== this.playToken) return resolve();
      window.clearInterval(this.timer);
      if (options.preview && name !== 'victory') this.play('combat_idle');
      resolve();
    }, duration));
  }

  updateReadout(name) {
    const readout = document.getElementById('hero-animation-state');
    if (readout) readout.textContent = name.toUpperCase();
  }

  spawnVfx(word, type) {
    const layer = document.getElementById('combat-vfx-layer');
    if (!layer) return;
    const effect = document.createElement('div');
    effect.className = `comic-vfx comic-vfx--${type}`;
    effect.innerHTML = `<i></i><b>${word}</b><span></span>`;
    layer.appendChild(effect);
    document.querySelector('.arena-stage, .action-combat-stage')?.classList.add('combat-impact');
    document.querySelector('.arena-fighter--villain')?.classList.add('villain-hit');
    window.setTimeout(() => {
      effect.remove();
      document.querySelector('.arena-stage, .action-combat-stage')?.classList.remove('combat-impact');
      document.querySelector('.arena-fighter--villain')?.classList.remove('villain-hit');
    }, 760);
  }
}
