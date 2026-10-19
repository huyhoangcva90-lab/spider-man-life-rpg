import { OriginalCosmicSprite } from './OriginalCosmicSprite.js?build=cosmic-team-1';

/* Combat state machine with the original Cosmic Invasion sprite as its primary renderer. */

export const HERO_ANIMATIONS = [
  'idle', 'combat_idle', 'walk', 'run', 'jump', 'dodge',
  'attack_01', 'attack_02', 'attack_03', 'ranged_attack',
  'skill_01', 'skill_02', 'skill_03', 'ultimate',
  'hurt', 'knockback', 'KO', 'victory',
  'web_pull', 'swing_kick', 'web_swing', 'web_swing_reverse', 'spider_slide', 'air_web', 'spider_sense',
  'combo_4', 'combo_chain', 'web_shot_2', 'air_attack', 'air_web_2'
];

const STATE = {
  idle:          { frames: [[0, 0], [256, 0], [512, 0], [768, 0], [1024, 0], [1280, 0], [1536, 0], [1792, 0]], fps: 7, loop: true, motion: 'breathe', vfx: null },
  combat_idle:   { frames: [[2048, 0], [2304, 0], [0, 256], [256, 256]], fps: 6, loop: true, motion: 'guard', vfx: null },
  run:           { frames: [[512, 256], [768, 256], [1024, 256], [1280, 256], [1536, 256], [1792, 256], [2048, 256], [2304, 256]], fps: 12, loop: false, motion: 'run', vfx: null },
  walk:          { frames: [[512, 256], [768, 256], [1024, 256], [1280, 256]], fps: 8, loop: false, motion: 'walk', vfx: null },
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

// Additional actions use source clips when the original atlas is ready.
Object.assign(STATE, {
  web_pull: { ...STATE.skill_01, vfx: null },
  combo_4: { ...STATE.attack_03, vfx: null },
  combo_chain: { ...STATE.attack_01, vfx: null },
  web_shot_2: { ...STATE.ranged_attack, vfx: null },
  air_attack: { ...STATE.skill_02, vfx: null },
  air_web_2: { ...STATE.ranged_attack, vfx: null },
  swing_kick: { ...STATE.skill_03, vfx: null },
  web_swing: { ...STATE.skill_03, vfx: null },
  web_swing_reverse: { ...STATE.skill_03, vfx: null },
  spider_slide: { ...STATE.run, vfx: null },
  air_web: { ...STATE.ranged_attack, vfx: null },
  spider_sense: { ...STATE.dodge, vfx: null }
});

export class HeroAnimationController {
  constructor(eventBus, soundController, engine = null) {
    this.bus = eventBus;
    this.sound = soundController;
    this.engine = engine;
    this.hero = null;
    this.original = null;
    this.timer = null;
    this.attackIndex = 0;
    this.sequenceToken = 0;
    this.playToken = 0;
    this.speed = 1;
    this.pendingComicText = null;
  }

  init() {
    this.hero = document.getElementById('arena-hero-sprite');
    if (!this.hero) return;
    this.original = new OriginalCosmicSprite(this.hero, (token) => token === this.playToken);
    this.original.load().then(() => {
      if (['combat_idle', 'KO'].includes(this.hero.dataset.animation)) {
        this.play(this.restAnimation());
      }
    }).catch((error) => console.warn('Original Cosmic sprite unavailable:', error));
    this.bus.on('HERO_PREPARE_MISSION', () => {
      if (this.engine?.state?.progression?.hp <= 0) return;
      this.sequence(['run', 'jump', 'combat_idle']);
    });
    this.bus.on('RPG_UPDATED', (result) => this.playCombatResult(result));
    this.bus.on('CAMPAIGN_UPDATED', ({ snapshot, habitChecked }) => {
      if (snapshot?.hero?.hp > 0 && (habitChecked || this.hero?.dataset.animation === 'KO')) {
        this.sequenceToken++;
        this.play('combat_idle');
      }
    });
    this.bus.on('SETTINGS_CHANGED', (settings) => { this.speed = settings.combatSpeed || 1; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) window.clearInterval(this.timer);
      else this.play(this.restAnimation());
    });
    this.play(this.restAnimation());
  }

  restAnimation(){
    if(this.engine?.notionAuthority&&this.hero?.dataset.notionVitals!=='confirmed')return 'combat_idle';
    return this.engine?.state?.progression?.hp<=0?'KO':'combat_idle';
  }

  async playCombatResult(result = {}) {
    if (result.blocked) return;
    const hasAction = Boolean(result.action || result.animation || result.finisher);
    const hasResponse = Boolean(result.heroDamage > 0 || result.perfectDodge || result.heroKo);
    if (!hasAction && !hasResponse && !result.victory) return;

    const token = ++this.sequenceToken;
    this.pendingComicText = hasAction
      ? result.comicText?.[Math.floor(Math.random() * result.comicText.length)] || null
      : null;

    if (hasAction) {
      let animation = result.finisher ? 'ultimate' : result.animation;
      if (result.actionId === 'basic-combo') {
        animation = ['attack_01', 'attack_02', 'web_swing', 'attack_03', 'web_swing_reverse'][this.attackIndex++ % 5];
      }
      if (animation === 'ally_call') animation = 'skill_02';
      if (!STATE[animation]) {
        animation = result.weaknessMatch
          ? ['skill_01', 'skill_02', 'skill_03'][this.attackIndex++ % 3]
          : ['attack_01', 'attack_02', 'attack_03', 'ranged_attack'][this.attackIndex++ % 4];
      }
      if (this.original?.ready && result.damage > 0) {
        const words = { attack_01: 'POW!', attack_02: 'KICK!', attack_03: 'BAM!', ranged_attack: 'THWIP!', web_shot_2: 'THWIP!', ultimate: 'MAXIMUM SPIDER!', web_swing: 'SWING!', web_swing_reverse: 'SWING!', swing_kick: 'KICK!' };
        const callout = `${words[animation] || 'HIT!'} ${result.damage} DMG`;
        const effect = /web|swing/.test(animation) ? 'web' : animation === 'ultimate' ? 'ultimate' : 'impact';
        window.setTimeout(() => { if (token === this.sequenceToken) this.spawnVfx(callout, effect); }, 170 / this.speed);
      }
      if (result.finisher && !this.original?.ready) await this.play('jump');
      if (token !== this.sequenceToken) return;
      await this.play(animation, {
        projectile: animation === 'ranged_attack' || result.actionId === 'impact-web',
        vfxType: result.actionId === 'impact-web' ? 'web' : undefined
      });
    }
    if (token !== this.sequenceToken) return;

    if (hasResponse) {
      if (result.perfectDodge && this.original?.ready) {
        void this.original.playSpiderSenseEffect(this.speed);
        this.updateReadout('spider_sense');
      }
      this.bus.emit?.('ENEMY_COUNTERATTACK', result);
      await new Promise((resolve) => window.setTimeout(resolve, result.perfectDodge || result.knockback ? 180 : 330));
      if (token !== this.sequenceToken) return;
      if (result.perfectDodge) await this.play('dodge');
      else if (result.heroKo) {
        await this.play('knockback');
        if (token !== this.sequenceToken) return;
        this.play('KO');
        return;
      } else await this.play(result.knockback ? 'knockback' : 'hurt');
    }
    if (token !== this.sequenceToken) return;
    this.play(result.victory ? 'victory' : 'combat_idle');
  }

  async sequence(states) {
    const token = ++this.sequenceToken;
    for (const state of states) {
      await this.play(state);
      if (token !== this.sequenceToken) return;
    }
  }

  async playSourceClip(clipName) {
    if (!this.original?.ready || !this.original.data.hero.clips[clipName]) return;
    ++this.sequenceToken;
    const token = ++this.playToken;
    window.clearInterval(this.timer);
    this.hero.dataset.animation = clipName;
    this.updateReadout(clipName);
    await this.original.playClip(clipName, token, this.speed);
    if (token === this.playToken) this.play('combat_idle');
  }

  play(name, options = {}) {
    if (!STATE[name] || !this.hero) return Promise.resolve();
    const config = STATE[name];
    const token = ++this.playToken;
    window.clearInterval(this.timer);
    if (this.original?.ready) {
      this.hero.dataset.animation = name;
      this.hero.dataset.motion = config.motion;
      this.updateReadout(name);
      this.pendingComicText = null;
      return this.original.play(name, token, this.speed);
    }
    this.hero.dataset.animation = name;
    this.hero.dataset.motion = config.motion;
    this.updateReadout(name);

    let index = 0;
    const draw = () => {
      const frame = config.loop ? index % config.frames.length : Math.min(index, config.frames.length - 1);
      const [x, y] = config.frames[frame];
      this.hero.style.setProperty('--sprite-x', `${-x}px`);
      this.hero.style.setProperty('--sprite-y', `${-y}px`);
      index += 1;
    };
    draw();
    const interval = Math.max(24, Math.round(1000 / config.fps / this.speed));
    this.timer = window.setInterval(draw, interval);
    if (options.projectile) {
      window.setTimeout(() => {
        if (token === this.playToken) this.spawnWebProjectile();
      }, interval * 2);
    }
    if (config.vfx) {
      const word = this.pendingComicText || config.vfx[0];
      this.pendingComicText = null;
      window.setTimeout(() => {
        if (token === this.playToken) this.spawnVfx(word, options.vfxType || config.vfx[1]);
      }, interval * Math.max(1, config.frames.length - 1));
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
    if (type !== 'hurt' && type !== 'ko') document.querySelector('.arena-fighter--villain')?.classList.add('villain-hit');
    window.setTimeout(() => {
      effect.remove();
      document.querySelector('.arena-stage, .action-combat-stage')?.classList.remove('combat-impact');
      document.querySelector('.arena-fighter--villain')?.classList.remove('villain-hit');
    }, 760);
  }

  spawnWebProjectile() {
    const layer = document.getElementById('combat-vfx-layer');
    if (!layer || !this.hero) return;
    const stage = layer.getBoundingClientRect();
    const hero = this.hero.getBoundingClientRect();
    const enemy = document.querySelector('.arena-foe--selected .arena-foe__sprite')?.getBoundingClientRect();
    const startX = hero.left - stage.left + hero.width * 0.72;
    const startY = hero.top - stage.top + hero.height * 0.6;
    const endX = enemy ? enemy.left - stage.left + enemy.width * 0.42 : stage.width * 0.8;
    const endY = enemy ? enemy.top - stage.top + enemy.height * 0.45 : stage.height * 0.55;
    const distance = Math.hypot(endX - startX, endY - startY);
    const webShot = document.createElement('div');
    webShot.className = 'cosmic-web-shot';
    webShot.style.left = `${startX}px`;
    webShot.style.top = `${startY - 24}px`;
    webShot.style.width = `${distance}px`;
    webShot.style.transform = `rotate(${Math.atan2(endY - startY, endX - startX)}rad)`;
    webShot.innerHTML = `
      <div class="web-beam"></div>
      <div class="web-ball"></div>
      <div class="web-entangle"></div>
    `;
    layer.appendChild(webShot);
    window.setTimeout(() => webShot.remove(), 700);
  }
}
