/* Sprite-sheet state machine for the user-supplied Spider combat action atlas. */

export const HERO_ANIMATIONS = [
  'idle', 'combat_idle', 'run', 'jump', 'dodge',
  'attack_01', 'attack_02', 'attack_03', 'ranged_attack',
  'skill_01', 'skill_02', 'skill_03', 'ultimate',
  'hurt', 'knockback', 'KO', 'victory'
];

const STATE = {
  idle:          { frames: [[0, 0], [256, 0], [512, 0], [768, 0], [1024, 0], [1280, 0], [1536, 0], [1792, 0]], fps: 7, loop: true, motion: 'breathe', vfx: null },
  combat_idle:   { frames: [[2048, 0], [2304, 0], [0, 256], [256, 256]], fps: 6, loop: true, motion: 'guard', vfx: null },
  run:           { frames: [[512, 256], [768, 256], [1024, 256], [1280, 256], [1536, 256], [1792, 256], [2048, 256], [2304, 256]], fps: 12, loop: false, motion: 'run', vfx: null },
  jump:          { frames: [[0, 512], [256, 512], [512, 512], [768, 512], [1024, 512], [1280, 512]], fps: 10, loop: false, motion: 'jump', vfx: null },
  dodge:         { frames: [[1536, 512], [1792, 512], [2048, 512], [2304, 512], [0, 768], [256, 768], [512, 768]], fps: 14, loop: false, motion: 'dodge', vfx: null },
  attack_01:     { frames: [[768, 768], [1024, 768], [1280, 768], [1536, 768]], fps: 12, loop: false, motion: 'strike', vfx: ['THWIP-PUNCH!', 'impact'] },
  attack_02:     { frames: [[1792, 768], [2048, 768], [2304, 768], [0, 1024], [256, 1024], [512, 1024], [768, 1024]], fps: 13, loop: false, motion: 'uppercut', vfx: ['SPIDER-KICK!', 'slash'] },
  attack_03:     { frames: [[1024, 1024], [1280, 1024], [1536, 1024], [1792, 1024], [2048, 1024], [2304, 1024], [0, 1280], [256, 1280]], fps: 14, loop: false, motion: 'spin', vfx: ['COMBO FINISH!', 'impact'] },
  ranged_attack: { frames: [[512, 1280], [768, 1280], [1024, 1280], [1280, 1280], [1536, 1280], [1792, 1280]], fps: 12, loop: false, motion: 'recoil', vfx: ['THWIP!', 'web'] },
  skill_01:      { frames: [[2048, 1280], [2304, 1280], [0, 1536], [256, 1536], [512, 1536], [768, 1536]], fps: 13, loop: false, motion: 'skill', vfx: ['SPIDER DASH!', 'electric'] },
  skill_02:      { frames: [[1024, 1536], [1280, 1536], [1536, 1536], [1792, 1536], [2048, 1536]], fps: 12, loop: false, motion: 'skill', vfx: ['WEB UPPERCUT!', 'web'] },
  skill_03:      { frames: [[2304, 1536], [0, 1792], [256, 1792], [512, 1792], [768, 1792], [1024, 1792]], fps: 14, loop: false, motion: 'skill', vfx: ['WEB SWING SLAM!', 'impact'] },
  ultimate:      { frames: [[1280, 1792], [1536, 1792], [1792, 1792], [2048, 1792], [2304, 1792], [0, 2048], [256, 2048], [512, 2048], [768, 2048], [1024, 2048], [1280, 2048], [1536, 2048]], fps: 15, loop: false, motion: 'ultimate', vfx: ['MAXIMUM SPIDER!', 'ultimate'] },
  hurt:          { frames: [[1792, 2048], [2048, 2048]], fps: 8, loop: false, motion: 'hurt', vfx: ['UGH!', 'hurt'] },
  knockback:     { frames: [[2304, 2048], [0, 2304], [256, 2304], [512, 2304], [768, 2304], [1024, 2304], [1280, 2304]], fps: 11, loop: false, motion: 'knockback', vfx: ['CRASH!', 'hurt'] },
  KO:            { frames: [[1536, 2304], [1792, 2304], [2048, 2304], [2304, 2304], [0, 2560]], fps: 7, loop: false, motion: 'ko', vfx: ['K.O.', 'ko'] },
  victory:       { frames: [[256, 2560], [512, 2560], [768, 2560], [1024, 2560], [1280, 2560], [1536, 2560], [1792, 2560]], fps: 7, loop: true, motion: 'victory', vfx: ['EXCELSIOR!', 'victory'] }
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
    this.speed = 1;
    this.pendingComicText = null;
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
    this.bus.on('SETTINGS_CHANGED', (settings) => { this.speed = settings.combatSpeed || 1; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) window.clearInterval(this.timer);
      else this.play('combat_idle');
    });
    this.play('combat_idle');
  }

  async playCombatResult(result = {}) {
    if (result.blocked) return;
    if (!result.action && !result.animation && !result.heroKo && !result.perfectDodge && !result.victory && !result.finisher) return;
    this.pendingComicText = result.comicText?.[Math.floor(Math.random() * result.comicText.length)] || null;
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
      this.hero.style.setProperty('--sprite-x', `${-x}px`);
      this.hero.style.setProperty('--sprite-y', `${-y}px`);
      index += 1;
    };
    draw();
    const interval = Math.max(24, Math.round(1000 / config.fps / this.speed));
    this.timer = window.setInterval(draw, interval);
    if (name === 'ranged_attack' || name === 'skill_02') {
      window.setTimeout(() => this.spawnWebProjectile(), interval * 2);
    }
    if (config.vfx) {
      const word = this.pendingComicText || config.vfx[0];
      this.pendingComicText = null;
      window.setTimeout(() => this.spawnVfx(word, config.vfx[1]), interval * Math.max(1, config.frames.length - 1));
    }

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

  spawnWebProjectile() {
    const layer = document.getElementById('combat-vfx-layer');
    if (!layer) return;
    const webShot = document.createElement('div');
    webShot.className = 'cosmic-web-shot';
    webShot.innerHTML = `
      <div class="web-beam"></div>
      <div class="web-ball"></div>
      <div class="web-entangle"></div>
    `;
    layer.appendChild(webShot);
    window.setTimeout(() => webShot.remove(), 700);
  }
}
