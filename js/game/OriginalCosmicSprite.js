const ASSET_ROOT = new URL('../../assets/spideytracker/', import.meta.url);
const DATA_URL = new URL('../../data/cosmic-original-spiderman.json', import.meta.url);

const CLIPS = {
  idle: ['Walkstart'], combat_idle: ['Walkstart'], run: ['Sprint'],
  jump: ['Jump', 'Jumpapex', 'Jumpfall', 'Land'], dodge: ['Dodge'],
  attack_01: ['Attack1'], attack_02: ['Attack2'], attack_03: ['Attack3'], combo_4: ['Attack4'], combo_chain: ['Attack1', 'Attack2', 'Attack3', 'Attack4'],
  ranged_attack: ['Power1start', 'Power1', 'Power1end'], web_shot_2: ['Power2', 'Power2end'],
  skill_01: ['Attackchargedstart', 'Attackchargedheld', 'Attackcharged', 'Attackchargedend'],
  skill_02: ['Attackair'], skill_03: ['Attackswinging'],
  ultimate: ['Special'], hurt: ['Hitstun'], knockback: ['Kd'],
  KO: ['Down'], victory: ['Selectscreen'],
  web_pull: ['Attackchargedstart', 'Attackchargedheld', 'Attackcharged', 'Attackchargedend'],
  swing_kick: ['Attackswinging'], web_swing: ['Webswing'], web_swing_reverse: ['Webswing'],
  spider_slide: ['Attacksprinting'],
  air_attack: ['Jump', 'Attackairstart', 'Attackair', 'Land'],
  air_web: ['Jump', 'Powerair1start', 'Powerair1', 'Powerair1end', 'Land'],
  air_web_2: ['Jump', 'Powerair2', 'Powerair2end', 'Land'],
  spider_sense: ['Spidersense'], walk: ['Walkstart', 'Walk']
};
const LOOPING = new Set(['idle', 'combat_idle', 'victory']);
const pause = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const HERO_CANVAS_SIZE = 416;
const HERO_ORIGIN_X = 208;
const HERO_GROUND_Y = 330;
const HERO_SCALE = 2.35;

function loadImage(filename) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = new URL(filename, ASSET_ROOT).href;
  });
}

export class OriginalCosmicSprite {
  constructor(hero, isCurrent) {
    this.hero = hero;
    this.isCurrent = isCurrent;
    this.specialShot = 0;
    this.senseToken = 0;
    this.ready = false;
  }

  async load() {
    const [response, heroImage, powerImage, specialImage, webPullImage] = await Promise.all([
      fetch(DATA_URL),
      loadImage('cosmic-original-spiderman.png'),
      loadImage('cosmic-original-power-projectile.png'),
      loadImage('cosmic-original-special-projectile.png'),
      loadImage('cosmic-original-webpull.png')
    ]);
    if (!response.ok) throw new Error(`Cosmic animation data: ${response.status}`);
    this.data = await response.json();
    this.images = { hero: heroImage, powerProjectile: powerImage, specialProjectile: specialImage, webPull: webPullImage };
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'cosmic-original-canvas';
    this.canvas.width = this.canvas.height = HERO_CANVAS_SIZE;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.drawHero(this.data.hero.clips.Idle.frames[0]);
    this.hero.appendChild(this.canvas);
    this.hero.querySelector('.hero-sprite-actor')?.style.setProperty('display', 'none', 'important');
    this.hero.dataset.source = 'cosmic-original';
    this.ready = true;
  }

  drawHero(frame) {
    const [x, y, width, height] = frame.rect;
    const [offsetX, offsetY] = frame.pos;
    const scale = HERO_SCALE;
    this.ctx.clearRect(0, 0, HERO_CANVAS_SIZE, HERO_CANVAS_SIZE);
    this.ctx.drawImage(this.images.hero, x, y, width, height,
      Math.round(HERO_ORIGIN_X + offsetX * scale), Math.round(HERO_GROUND_Y + offsetY * scale),
      Math.round(width * scale), Math.round(height * scale));
  }

  async play(name, token, speed = 1) {
    let clips = CLIPS[name] || CLIPS.combat_idle;
    if (name === 'spider_sense') return this.playSpiderSenseEffect(speed);
    this.canvas.classList.toggle('cosmic-reversed',
      name === 'web_swing_reverse' || name === 'web_pull' || name === 'skill_01');
    if (name === 'web_swing' || name === 'web_swing_reverse') {
      return this.playWebSwing(token, speed, name === 'web_swing_reverse');
    }
    if (name === 'hurt' || name === 'knockback') {
      const frames = this.data.hero.clips[name === 'hurt' ? 'Hitstun' : 'Kd'].frames;
      const minimumFrame = name === 'hurt' ? 180 : 140;
      for (const frame of frames) {
        if (!this.isCurrent(token)) return;
        this.drawHero(frame);
        await pause(Math.max(minimumFrame, frame.duration * 1000) / speed);
      }
      if (this.isCurrent(token)) await pause((name === 'hurt' ? 520 : 400) / speed);
      return;
    }
    return this.playClips(clips, LOOPING.has(name), name, token, speed);
  }

  async playClip(clipName, token, speed = 1) {
    if (!this.data.hero.clips[clipName]) return;
    if (clipName === 'Spidersense') return this.playSpiderSenseEffect(speed);
    return this.playClips([clipName], false, clipName === 'Special' ? 'ultimate' : clipName, token, speed);
  }

  cancelSpiderSense() {
    this.senseToken++;
    this.senseCanvas?.remove();
    this.senseCanvas = null;
  }

  async playSpiderSenseEffect(speed = 1) {
    if (!this.ready) return;
    this.cancelSpiderSense();
    const token = this.senseToken;
    const canvas = document.createElement('canvas');
    canvas.className = 'cosmic-sense-canvas';
    canvas.width = canvas.height = HERO_CANVAS_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    this.hero.appendChild(canvas);
    this.senseCanvas = canvas;
    try {
      for (const frame of this.data.hero.clips.Spidersense.frames) {
        if (token !== this.senseToken) return;
        ctx.clearRect(0, 0, HERO_CANVAS_SIZE, HERO_CANVAS_SIZE);
        const [x, y, width, height] = frame.rect;
        if (width > 1 && height > 1) {
          const [offsetX, offsetY] = frame.pos;
          const scale = HERO_SCALE;
          ctx.drawImage(this.images.hero, x, y, width, height,
            Math.round(HERO_ORIGIN_X + offsetX * scale), Math.round(HERO_GROUND_Y + offsetY * scale + 48),
            Math.round(width * scale), Math.round(height * scale));
        }
        await pause(Math.max(22, Math.round(frame.duration * 1000 / speed)));
      }
    } finally {
      if (token === this.senseToken) this.cancelSpiderSense();
    }
  }

  async playClips(clips, looping, name, token, speed) {
    const run = async () => {
      do {
        for (const clipName of clips) {
          const clip = this.data.hero.clips[clipName];
          if (!clip) continue;
          for (const frame of clip.frames) {
            if (!this.isCurrent(token)) return;
            this.drawHero(frame);
            if (clipName === 'Attackcharged' && frame === clip.frames[0]) this.spawnWebPull(token);
            for (const event of frame.events) {
              if (event.value?.startsWith('Shoot:')) {
                this.spawnProjectile(name === 'ultimate' ? 'specialProjectile' : 'powerProjectile');
              }
            }
            await pause(Math.max(22, Math.round(frame.duration * 1000 / speed)));
          }
        }
      } while (looping && this.isCurrent(token));
    };
    if (looping) { void run(); return; }
    await run();
  }

  drawWebLine(ctx, image, rect, start, end) {
    const dx = end.x - start.x, dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    ctx.save();
    ctx.translate(start.x, start.y);
    ctx.rotate(Math.atan2(dy, dx));
    for (let x = 0; x < length; x += 20) {
      ctx.drawImage(image, ...rect, x, -2, Math.min(20, length - x), 4);
    }
    ctx.restore();
  }

  async playWebSwing(token, speed, reverse = false) {
    const layer = document.getElementById('combat-vfx-layer');
    this.drawHero(this.data.hero.clips.Webswing.frames[0]);
    if (!layer) { await pause(650 / speed); return; }
    const rope = document.createElement('div');
    rope.className = 'cosmic-swing-strand';
    layer.appendChild(rope);
    this.canvas.classList.add('cosmic-swinging');
    this.canvas.style.animationDuration = `${650 / speed}ms`;
    let frameId;
    const trackRope = () => {
      if (!this.isCurrent(token)) return;
      const stage = layer.getBoundingClientRect();
      const actor = this.canvas.getBoundingClientRect();
      const anchorX = stage.width * (reverse ? .39 : .28);
      const handX = actor.left - stage.left + actor.width * (reverse ? .62 : .38);
      const handY = actor.top - stage.top + actor.height * .46;
      const dx = handX - anchorX;
      rope.style.left = `${anchorX}px`;
      rope.style.height = `${Math.hypot(dx, handY)}px`;
      rope.style.transform = `rotate(${-Math.atan2(dx, handY)}rad)`;
      frameId = requestAnimationFrame(trackRope);
    };
    frameId = requestAnimationFrame(trackRope);
    try {
      await pause(650 / speed);
    } finally {
      cancelAnimationFrame(frameId);
      this.canvas.classList.remove('cosmic-swinging');
      this.canvas.style.removeProperty('animation-duration');
      rope.remove();
    }
  }

  spawnWebPull(token) {
    const layer = document.getElementById('combat-vfx-layer');
    const enemy = document.querySelector('.arena-foe--selected .arena-foe__sprite') || document.querySelector('.arena-fighter--villain');
    if (!layer || !enemy) return;
    const stage = layer.getBoundingClientRect();
    const webPoints = () => {
      const hero = this.canvas.getBoundingClientRect();
      const target = enemy.getBoundingClientRect();
      return {
        grip: { x: hero.left - stage.left + hero.width * .74, y: hero.top - stage.top + hero.height * .55 },
        end: { x: target.left - stage.left + target.width * .38, y: target.top - stage.top + target.height * .48 }
      };
    };
    const canvas = document.createElement('canvas');
    canvas.className = 'cosmic-original-webpull';
    canvas.width = Math.ceil(stage.width);
    canvas.height = Math.ceil(stage.height);
    layer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const web = this.data.webPull.clips.Web.frames[0].rect;
    const tip = this.data.webPull.clips.Webtip.frames[0].rect;
    const image = this.images.webPull;
    const started = performance.now();
    let hit = false;
    const tick = now => {
      if (!this.isCurrent(token)) { canvas.remove(); return; }
      const elapsed = now - started;
      if (elapsed >= 820) { canvas.remove(); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (elapsed < 770) {
        const { grip, end } = webPoints();
        const reach = Math.min(1, elapsed / 180);
        const point = { x: grip.x + (end.x - grip.x) * reach, y: grip.y + (end.y - grip.y) * reach };
        ctx.globalAlpha = Math.min(1, (770 - elapsed) / 60);
        this.drawWebLine(ctx, image, web, grip, point);
        ctx.drawImage(image, ...tip, point.x - 10, point.y - 10, 20, 20);
        ctx.globalAlpha = 1;
      }
      if (elapsed >= 180 && !hit) {
        hit = true;
        this.hero.dispatchEvent(new CustomEvent('COSMIC_WEB_PULL_HIT'));
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }  spawnProjectile(type) {
    const layer = document.getElementById('combat-vfx-layer');
    if (!layer) return;
    const enemy = document.querySelector('.arena-foe--selected .arena-foe__sprite') || document.querySelector('.arena-fighter--villain');
    const stage = layer.getBoundingClientRect();
    const source = this.hero.getBoundingClientRect();
    const target = enemy?.getBoundingClientRect();
    const special = type === 'specialProjectile';
    const spread = special ? [-42, -25, -8, 8, 25, 42][this.specialShot++ % 6] : 0;
    const start = { x: source.left - stage.left + source.width * .68, y: source.top - stage.top + source.height * .45 };
    const end = { x: target ? target.left - stage.left + target.width * .45 : stage.width * .82,
      y: (target ? target.top - stage.top + target.height * .45 : stage.height * .5) + spread };
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 200;
    canvas.className = 'cosmic-original-projectile';
    layer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const active = this.data[type].clips.Active.frames;
    const death = this.data[type].clips.Death.frames;
    const image = this.images[type];
    const travel = special ? 340 : 280;
    const deathTime = death.reduce((sum, frame) => sum + frame.duration * 1000, 0);
    const startTime = performance.now();
    let hit = false;
    const drawFrame = (frame) => {
      const [x, y, width, height] = frame.rect;
      const [offsetX, offsetY] = frame.pos;
      const scale = special ? 2 : 2.3;
      ctx.clearRect(0, 0, 200, 200);
      ctx.drawImage(image, x, y, width, height,
        Math.round(100 + offsetX * scale), Math.round(100 + offsetY * scale),
        Math.round(width * scale), Math.round(height * scale));
    };
    const tick = (now) => {
      const elapsed = now - startTime;
      if (elapsed >= travel + deathTime) { canvas.remove(); return; }
      const progress = Math.min(1, elapsed / travel);
      if (progress === 1 && !hit) {
        hit = true;
        this.hero.dispatchEvent(new CustomEvent('COSMIC_PROJECTILE_HIT', { detail: { type } }));
      }
      const point = { x: start.x + (end.x - start.x) * progress, y: start.y + (end.y - start.y) * progress };
      canvas.style.left = `${point.x - 100}px`;
      canvas.style.top = `${point.y - 100}px`;
      if (progress < 1) drawFrame(active[Math.max(0, Math.floor(elapsed / 50)) % active.length]);
      else {
        let t = elapsed - travel;
        let frame = death[death.length - 1];
        for (const candidate of death) { if (t < candidate.duration * 1000) { frame = candidate; break; } t -= candidate.duration * 1000; }
        drawFrame(frame);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
