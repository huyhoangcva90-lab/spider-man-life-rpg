import { HeroLoadout } from './HeroLoadout.js?v=gambit-native-1';
import { selectedGameView, linkedRecords, sameId, logFingerprint } from '../integrations/notion/NotionGameAuthority.mjs';
import { notionSkillAnimation } from '../game/NotionSkillAnimation.js';

const HERO_URL = 'https://www.notion.so/3d2d787636c68160915ecd84c823577f';
const e = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const n = (value) => Number.isFinite(value) ? String(value) : '—';
const picture = (item) => item?.Image || item?.['Suit Preview'] || item?.image || '';
const link = (url, label) => `<a class="notion-source-link" href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;
const ENEMY_ART = {
  '3f5d787636c68191bc2eefa43ad60aad': { image: '/assets/notion-actors/bug-spiked-shield.png', idle: '/assets/notion-actors/bug-spiked-shield-idle.png', width: 89, height: 95, frames: 4 },
  '3cbd787636c681f7b11fc1fcc8f302b1': { image: '/assets/notion-actors/thanos.png', idle: '/assets/notion-actors/thanos-idle.png', width: 105, height: 114, frames: 5 }
};

export class NotionGamePresenter {
  constructor(controller) {
    this.ui = controller;
    this.data = null;
    this.mode = 'loading';
    this.selectedEnemyId = null;
    this.detailSkillId = null;
    this.inFlight = null;
    this.previewToken = 0;
    this.loadout = new HeroLoadout(this);
  }

  async init() {
    void this.loadout.init();
    try {
      const response = await fetch('./data/notion-game-state.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('No saved Notion state');
      this.apply(await response.json(), 'snapshot');
    } catch { this.renderBattle(); }
    void this.refresh();
    this.timer = window.setInterval(() => { if (!document.hidden) void this.refresh(); }, 20000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) void this.refresh(); });
  }

  async refresh() {
    if (this.inFlight) return this.inFlight;
    this.inFlight = (async () => {
      try {
        const response = await fetch('/api/game-state', { cache: 'no-store' });
        if (!response.ok) throw new Error('Notion refresh unavailable');
        const payload = await response.json();
        if (!payload.ok || !payload.data?.profile) throw new Error('Invalid game display');
        this.apply(payload.data, 'live');
      } catch {
        this.mode = this.data ? 'snapshot' : 'unavailable';
        this.renderBattle();
      }
    })();
    try { await this.inFlight; } finally { this.inFlight = null; }
  }

  apply(data, mode) {
    const previous = this.data;
    this.data = data;
    this.mode = mode;
    if(mode==='live'&&!this.loadout.busy&&Date.parse(data.metadata?.syncedAt)>=this.loadout.ownedProfileAt)this.loadout.ownedProfile=null;
    this.ui.engine.state.progression.hp = data.profile.HP ?? 0;
    this.ui.engine.state.progression.webEnergy = data.profile.Energy ?? 0;
    this.ui.notionArenaMaps = data.maps || [];
    this.ui.selectedArenaMapId = data.profile['Current Map']?.[0] || null;
    this.renderBattle();
    if (!document.getElementById('game-panel-backdrop')?.hasAttribute('hidden') && !document.getElementById('game-panel-content')?.contains(document.activeElement)) this.ui.renderPanel();
    const log = data.logs?.[0];
    const previousLog = previous?.logs?.[0];
    // Initial loads and repeated polls never replay old attacks.
    if (previous && log && logFingerprint(log) !== logFingerprint(previousLog)) void this.playLog(log);
    else if (previous && Number(data.profile.HP) < Number(previous.profile.HP)) void this.ui.heroAnimation?.play('hurt');
  }

  view() { return selectedGameView(this.data || {}); }
  sourceNote() {
    const time = this.data?.metadata?.syncedAt ? new Date(this.data.metadata.syncedAt).toLocaleTimeString('vi-VN') : '';
    return this.mode === 'live' ? 'NOTION ĐANG KẾT NỐI · TỰ CẬP NHẬT' : this.data ? `BẢN NOTION ĐÃ LƯU · ${time}` : 'CHƯA ĐỌC ĐƯỢC NOTION';
  }

  renderBattle() {
    const root = document.getElementById('action-rpg-screen');
    if (!root) return;
    root.classList.add('notion-ready');
    const view = this.view(), p = view.profile;
    this.ui.applyArenaMap();
    this.ui.text('hud-level', n(p.Level));
    this.ui.text('hud-rank', view.suit?.Suit || 'CHƯA CHỌN EQUIPPED SUIT');
    const name = document.querySelector('.hud-avatar strong');
    if (name) name.textContent = p.Hero || 'ĐANG ĐỌC HERO TỪ NOTION';
    this.ui.text('hud-xp-text', n(p.Exp));
    this.ui.text('hud-hp-text', `${n(p.HP)} / ${n(p['Max HP'])}`);
    this.ui.text('hud-web-text', `${n(p.Energy)} / ${n(p['Max Energy'])}`);
    this.ui.width('hud-hp-fill', p['Max HP'] > 0 ? p.HP / p['Max HP'] * 100 : 0);
    this.ui.width('hud-web-fill', p['Max Energy'] > 0 ? p.Energy / p['Max Energy'] * 100 : 0);
    this.ui.width('hud-xp-fill', 0); // Notion supplied XP; no invented next-level threshold.
    const badge = view.badges.find((item) => item.Equipped && item.Unlocked);
    const mask = document.querySelector('.hud-mask');
    if (mask) mask.innerHTML = badge && picture(badge) ? `<img src="${e(picture(badge))}" alt="${e(badge.Medal)}">` : '<svg aria-hidden="true"><use href="#icon-mask"></use></svg>';
    this.ui.text('hud-main-quest', view.missions[0]?.Encounter || 'CHƯA CHỌN MISSION TRONG HERO');
    this.ui.text('hud-quest-progress', view.missions[0]?.Status || 'NOTION');
    this.ui.text('arena-turn-value', n(view.enemies.find((foe) => sameId(foe.id, this.selectedEnemyId))?.['Combat Turn']));
    document.querySelector('.arena-turn-banner small').textContent = 'NOTION CONTROL';
    this.ui.text('arena-turn-tip', p.HP === 0 ? 'HP = 0 theo Hero. Hồi phục trong Notion.' : 'Chọn chiêu và dùng nút Attack trong Notion.');
    this.ui.text('combat-district', view.map?.District || view.map?.Map || 'CHƯA CHỌN CURRENT MAP');
    this.ui.text('combat-weather', view.map?.Weather || 'KẾT QUẢ TRẬN ĐẤU DO NOTION QUYẾT ĐỊNH');
    this.renderEnemies(view.enemies);
    this.renderSkillBar(view.skills);
    const footer = root.querySelector('.ultimate-meter');
    if (footer) footer.innerHTML = `<span class="notion-status-dot ${this.mode === 'live' ? 'is-live' : ''}"></span><span>${e(this.sourceNote())}</span><button type="button" data-notion-refresh>LÀM MỚI</button>${link(HERO_URL, 'HERO NOTION')}`;
    root.querySelector('[data-notion-refresh]')?.addEventListener('click', () => void this.refresh());
    this.renderSelectedEnemy();
    this.showSkillDetail();
    const actor = document.getElementById('arena-hero-sprite');
    if (actor) {
      const suitArt = view.suit && picture(view.suit);
      let suitImage = actor.querySelector('.notion-equipped-suit');
      if (suitArt) {
        actor.dataset.notionSuit = view.suit.id;
        if (!suitImage) { suitImage = document.createElement('img'); suitImage.className = 'notion-equipped-suit'; actor.appendChild(suitImage); }
        if (suitImage.getAttribute('src') !== suitArt) suitImage.src = suitArt;
        suitImage.alt = view.suit.Suit;
      } else { delete actor.dataset.notionSuit; suitImage?.remove(); }
    }
    if (actor && !this.previewing) {
      if (p.HP === 0 && actor.dataset.animation !== 'KO') void this.ui.heroAnimation?.play('KO');
      else if (p.HP > 0 && actor.dataset.animation === 'KO') void this.ui.heroAnimation?.play('combat_idle');
    }
  }

  renderEnemies(enemies) {
    const team = document.getElementById('combat-enemy-team');
    if (!team) return;
    if (!enemies.some((enemy) => sameId(enemy.id, this.selectedEnemyId))) this.selectedEnemyId = enemies[0]?.id || null;
    team.dataset.count = String(enemies.length);
    team.innerHTML = enemies.map((enemy) => {
      const art = ENEMY_ART[enemy.id.replace(/-/g, '')];
      const hp = enemy['HP - (1)'];
      const selected = sameId(enemy.id, this.selectedEnemyId);
      const image = art?.image || enemy['Idle Pose'] || enemy.Image;
      const visual = art
        ? `<span class="notion-enemy-idle" role="img" aria-label="${e(enemy.Boss)}" style="--notion-idle:url('${e(art.idle)}');--cell-w:${art.width}px;--cell-h:${art.height}px;--frame-end:-${art.width * (art.frames - 1)}px;--frame-steps:${art.frames - 1}"></span>`
        : image ? `<img class="notion-enemy-image" src="${e(image)}" alt="${e(enemy.Boss)}">` : '<span class="notion-unknown-art">CHƯA CÓ ẢNH</span>';
      return `<button class="arena-foe ${selected ? 'arena-foe--selected' : ''}" data-notion-enemy="${e(enemy.id)}" aria-pressed="${selected}">${visual}<span class="arena-foe__name">${e(enemy.Boss)}</span><span class="arena-foe__health"><i style="width:${Number.isFinite(hp) && enemy['Max HP'] > 0 ? Math.max(0, Math.min(100, hp / enemy['Max HP'] * 100)) : 0}%"></i></span><span class="arena-foe__value">${n(hp)} / ${n(enemy['Max HP'])}</span></button>`;
    }).join('') || '<p class="notion-empty-target">Chưa chọn Bosses & Minion trong Hero.</p>';
    team.querySelectorAll('[data-notion-enemy]').forEach((button) => button.addEventListener('click', () => {
      this.selectedEnemyId = button.dataset.notionEnemy;
      this.renderEnemies(enemies);
      this.renderSelectedEnemy();
    }));
  }

  renderSelectedEnemy() {
    const enemy = this.view().enemies.find((foe) => sameId(foe.id, this.selectedEnemyId));
    this.ui.text('enemy-name', enemy?.Boss || 'CHƯA CHỌN MỤC TIÊU');
    this.ui.text('enemy-tier', 'MỤC TIÊU HERO // NOTION');
    this.ui.text('enemy-hp-text', `${n(enemy?.['HP - (1)'])} / ${n(enemy?.['Max HP'])}`);
    this.ui.width('enemy-hp-fill', enemy?.['Max HP'] > 0 ? enemy['HP - (1)'] / enemy['Max HP'] * 100 : 0);
    const log = this.data?.logs?.[0];
    this.ui.text('combat-log-line', log ? `NOTION // ${log.Outcome || log['Boss Outcome'] || log['Resolution Status'] || 'ĐÃ GHI NHẬN'} · ${n(log['Direct Damage'])} DMG` : 'Đang chờ kết quả đòn đánh từ Notion.');
  }

  renderSkillBar(skills) {
    const bar = document.querySelector('.combat-action-bar');
    if (!bar) return;
    bar.dataset.count = String(skills.length);
    bar.dataset.layout = skills.length > 5 ? 'scroll' : 'row';
    bar.style.setProperty('--selected-skill-count', String(Math.max(1, skills.length)));
    bar.innerHTML = skills.map((skill) => `<button type="button" data-notion-skill="${e(skill.id)}" class="${/ultimate/i.test(skill['Skill Type']) ? 'combat-action--ultimate' : ''}" title="${e(skill.Description)}"><svg aria-hidden="true"><use href="#${/passive/i.test(skill['Skill Type']) ? 'icon-gear' : /web/i.test(skill.Skill) ? 'icon-web-map' : /ultimate/i.test(skill['Skill Type']) ? 'icon-bolt' : 'icon-arena'}"></use></svg><strong>${e(skill.Skill)}</strong><small>${/passive/i.test(skill['Skill Type']) ? 'NỘI TẠI' : Number.isFinite(skill['Energy Cost']) ? `${skill['Energy Cost']} ENERGY` : e(skill['Skill Type'])}</small></button>`).join('') || '<p>Chưa chọn Skill Slot trong Hero Notion.</p>';
    bar.querySelectorAll('[data-notion-skill]').forEach((button) => button.addEventListener('click', () => { this.detailSkillId = button.dataset.notionSkill; this.showSkillDetail(); }));
  }

  showSkillDetail() {
    let detail = document.getElementById('notion-skill-detail');
    if (!detail) {
      detail = document.createElement('aside');
      detail.id = 'notion-skill-detail';
      detail.className = 'notion-skill-detail';
      document.getElementById('action-combat-stage').appendChild(detail);
    }
    const skill = this.view().skills.find((record) => sameId(record.id, this.detailSkillId));
    detail.hidden = !skill;
    if (!skill) return;
    const animation = notionSkillAnimation(skill);
    detail.innerHTML = `<button class="notion-detail-close" aria-label="Đóng mô tả chiêu">×</button><small>${e(skill['Skill Type'])} · CD ${n(skill.Cooldown)} · ENERGY ${n(skill['Energy Cost'])}</small><strong>${e(skill.Skill)}</strong><p>${e(skill.Description || 'Chưa có mô tả trong Notion.')}</p><div>${animation ? '<button type="button" data-notion-preview>XEM HOẠT ẢNH</button>' : '<span>Nội tại hoặc chưa có hoạt ảnh phù hợp.</span>'}${link(skill.sourceUrl, animation ? 'DÙNG TRONG NOTION' : 'XEM TRONG NOTION')}</div><em>Xem hoạt ảnh không đổi HP, Energy hay kết quả trận.</em>`;
    detail.querySelector('.notion-detail-close').addEventListener('click', () => { this.detailSkillId = null; detail.hidden = true; });
    detail.querySelector('[data-notion-preview]')?.addEventListener('click', () => { detail.hidden = true; void this.playSkill(skill, true); });
  }

  async playSkill(skill, preview = false) {
    const visual = notionSkillAnimation(skill);
    if (!visual || !this.ui.heroAnimation) return;
    const token = ++this.previewToken;
    this.previewing = true;
    const stage = document.getElementById('action-combat-stage');
    const target = stage.querySelector('.arena-foe--selected');
    if (target) {
      const box = target.getBoundingClientRect(), arena = stage.getBoundingClientRect();
      stage.style.setProperty('--notion-target-x', `${(box.x + box.width / 2 - arena.x) / arena.width * 100}%`);
      const hero = stage.querySelector('.action-fighter--hero').getBoundingClientRect();
      stage.style.setProperty('--notion-lunge', `${Math.max(0, box.x - hero.x - hero.width * .65)}px`);
    }
    const effect = document.createElement('div');
    effect.className = `notion-skill-effect notion-skill-effect--${visual.effect}`;
    effect.textContent = preview ? `XEM THỬ · ${skill.Skill}` : skill.Skill;
    stage.appendChild(effect);
    stage.dataset.notionEffect = visual.effect;
    this.ui.sound.playGameSfx(/web|trap/i.test(visual.effect) ? 'WEB_SHOOT' : visual.effect === 'barrage' ? 'ULTIMATE' : 'PUNCH_LIGHT');
    await this.ui.heroAnimation.play(visual.clip);
    effect.remove();
    if (token !== this.previewToken) return;
    delete stage.dataset.notionEffect;
    this.previewing = false;
    void this.ui.heroAnimation.play(this.data?.profile?.HP === 0 ? 'KO' : 'combat_idle');
  }

  async playLog(log) {
    if (/pending|queued|processing/i.test(log['Resolution Status'] || '')) return;
    const skill = linkedRecords(this.data.skills, log['Combat Skill'])[0];
    if (skill) await this.playSkill(skill);
    // Unknown skills are never replaced with a random or default attack.
  }

  renderHero(tab) {
    if (['SUITS','SKILLS','MAPS','BADGES'].includes(tab)) return this.loadout.render(tab);
    const v = this.view(), p = v.profile;
    const header = `<div class="notion-view-banner"><div><strong>${e(this.sourceNote())}</strong><p>Đổi lựa chọn trong Hero trên Notion; trang tự đọc lại khi kết nối.</p></div>${link(HERO_URL, 'CHỌN TRONG HERO')}</div>`;
    if (tab === 'SKILLS') return header + `<div class="notion-record-grid">${v.skills.map((skill) => this.skillCard(skill)).join('') || '<p>Chưa có chiêu được chọn trong Skill Slot.</p>'}</div>`;
    if (tab === 'MAPS') return header + (v.map ? this.recordCard(v.map, v.map.Map, 'CURRENT MAP // NOTION', '', `${v.map.District || ''} · ${v.map.Weather || ''}`) : '<div class="notion-empty-card"><h3>Chưa chọn Current Map</h3><p>Chọn map trong Hero Notion để đổi khung cảnh sân đấu.</p></div>');
    if (tab === 'SUITS') return header + (v.suit ? this.recordCard(v.suit, v.suit.Suit, 'TRANG PHỤC ĐANG CHỌN', picture(v.suit)) : '<div class="notion-empty-card"><h3>Chưa chọn Equipped Suit</h3><p>Hero đang để trống quan hệ này. Chọn một trang phục trên Notion để hiện ở đây.</p></div>');
    if (tab === 'BADGES') return header + `<div class="notion-record-grid">${v.badges.map((badge) => `<article class="notion-record-card">${this.ui.badgeArtwork(badge)}<small>${badge.Equipped && badge.Unlocked ? 'ĐANG TRANG BỊ' : badge.Unlocked ? 'ĐÃ MỞ KHÓA' : 'CHƯA MỞ KHÓA'}</small><h3>${e(badge.Medal)}</h3><p>${e(badge.Requirement)}</p>${link(badge.sourceUrl, 'XEM TRONG NOTION')}</article>`).join('') || '<p>Chưa chọn huy hiệu trên Hero.</p>'}</div>`;
    return header + `<section class="notion-hero-profile"><div class="notion-hero-portrait">${v.suit && picture(v.suit) ? `<img src="${e(picture(v.suit))}" alt="${e(v.suit.Suit)}">` : '<svg aria-hidden="true"><use href="#icon-mask"></use></svg>'}</div><div><small>HERO // NOTION</small><h3>${e(p.Hero || 'Chưa đọc được Hero')}</h3><p>${e(v.suit?.Suit || 'Chưa chọn trang phục trong Equipped Suit')}</p><div class="notion-stat-grid"><span>LEVEL<b>${n(p.Level)}</b></span><span>EXP<b>${n(p.Exp)}</b></span><span>HP<b>${n(p.HP)} / ${n(p['Max HP'])}</b></span><span>ENERGY<b>${n(p.Energy)} / ${n(p['Max Energy'])}</b></span></div></div></section><h3 class="notion-section-title">CHIÊU ĐÃ CHỌN</h3><div class="notion-record-grid">${v.skills.map((skill) => this.skillCard(skill)).join('')}</div>`;
  }

  skillCard(skill) {
    return `<article class="notion-record-card"><small>${e(skill['Skill Type'])} · ENERGY ${n(skill['Energy Cost'])} · CD ${n(skill.Cooldown)}</small><h3>${e(skill.Skill)}</h3><p>${e(skill.Description)}</p>${link(skill.sourceUrl, 'MỞ CHIÊU NOTION')}</article>`;
  }

  recordCard(record, title, status, image, description = '') {
    return `<article class="notion-record-card">${image ? `<img class="notion-record-art" src="${e(image)}" alt="${e(title)}" loading="lazy">` : ''}<small>${e(status)}</small><h3>${e(title)}</h3><p>${e(description)}</p>${link(record.sourceUrl, 'XEM TRONG NOTION')}</article>`;
  }

  renderMissions() {
    const v = this.view();
    return `<div class="notion-view-banner"><div><strong>MISSION ĐÃ CHỌN TRONG HERO</strong><p>Địch và từng wave giữ nguyên theo dữ liệu Notion.</p></div>${link(HERO_URL, 'CHỌN MISSION')}</div>${v.missions.map((mission) => {
      const enemies = linkedRecords(this.data.enemies, mission['Bosses & Minions']);
      const mismatch = v.enemies.some((enemy) => !enemies.some((record) => sameId(record.id, enemy.id)));
      return `<article class="notion-record-card notion-mission-card"><small>${e(mission.Status)}</small><h3>${e(mission.Encounter)}</h3><p>Địch liên kết: ${e(enemies.map((enemy) => enemy.Boss).join(', ') || 'Chưa chọn')}</p>${mismatch ? '<p class="notion-source-warning">Mục tiêu trong Hero đang khác nhóm địch liên kết của Mission. Kiểm tra lựa chọn trên Notion.</p>' : ''}<ol>${['Turn 1 (Wave 1)', 'Turn 2 (Wave 2)', 'Turn 3 (Boss / Climax)', 'Turn 4 (Bonus / Phase 2)'].filter((key) => mission[key]).map((key) => `<li><b>${e(key)}</b><p>${e(mission[key])}</p></li>`).join('')}</ol>${link(mission.sourceUrl, 'XEM MISSION NOTION')}</article>`;
    }).join('') || '<p>Chưa có Mission trong Hero.</p>'}`;
  }

  renderEnemyRecords() {
    const view = this.view();
    return `<div class="notion-view-banner"><div><strong>BOSS / MINION ĐƯỢC LIÊN KẾT TRONG NOTION</strong><p>Giữ nguyên tên, ảnh và HP của từng bản ghi.</p></div>${link(HERO_URL, 'CHỌN MỤC TIÊU')}</div><div class="notion-record-grid">${(this.data?.enemies || []).map((enemy) => this.recordCard(enemy, enemy.Boss, view.enemies.some((record) => sameId(record.id, enemy.id)) ? 'MỤC TIÊU HERO' : 'ĐỊCH LIÊN KẾT MISSION', ENEMY_ART[enemy.id.replace(/-/g, '')]?.image || enemy['Idle Pose'] || enemy.Image, `HP ${n(enemy['HP - (1)'])} / ${n(enemy['Max HP'])}`)).join('')}</div>`;
  }

  renderPresentationSettings() {
    const settings = this.ui.engine.state.settings;
    return `<div class="notion-view-banner"><div><strong>HIỂN THỊ & ÂM THANH</strong><p>Chỉ thay đổi cách trình bày. Tiến độ, chiêu và chỉ số lấy từ Notion.</p></div>${link(HERO_URL, 'HERO NOTION')}</div><div class="notion-record-grid">${[['sfx', 'Âm thanh hiệu ứng'], ['music', 'Nhạc'], ['reduceMotion', 'Giảm chuyển động']].map(([key, label]) => `<label class="notion-record-card"><span>${label}</span><input type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''}></label>`).join('')}<label class="notion-record-card">Âm lượng<input type="range" min="0" max="1" step="0.1" data-setting="volume" value="${settings.volume}"></label></div>`;
  }
}
