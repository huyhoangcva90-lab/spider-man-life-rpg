export class GameModeController {
  constructor(eventBus, soundController, mapEngine, lifeRpg) {
    this.bus = eventBus;
    this.sound = soundController;
    this.mapEngine = mapEngine;
    this.lifeRpg = lifeRpg;
    this.mode = 'ARENA';
  }

  init() {
    document.querySelectorAll('.game-mode-btn').forEach((button) => {
      button.addEventListener('click', () => this.selectMode(button.dataset.mode));
    });
    document.getElementById('arena-battle-btn')?.addEventListener('click', () => this.handleBattleAction());
    this.bus.on('RPG_UPDATED', (result) => {
      this.render(result);
      document.getElementById('arena-mode-screen')?.classList.add('arena-impact');
      window.setTimeout(() => document.getElementById('arena-mode-screen')?.classList.remove('arena-impact'), 420);
    });
    this.selectMode('ARENA', false);
    this.render();
  }

  selectMode(mode, playSound = true) {
    if (!mode) return;
    if (playSound) this.sound?.playClick?.();

    if (mode === 'MISSIONS') {
      this.bus.emit('TOGGLE_DRAWER', 'ACTIVITY_LOG');
      return;
    }
    if (mode === 'ALLIES') {
      document.getElementById('avatar-trigger')?.click();
      return;
    }
    if (mode === 'PROFILE') {
      this.bus.emit('OPEN_HUB_PANEL', 'RPG');
      return;
    }

    this.mode = mode === 'MAP' ? 'MAP' : 'ARENA';
    document.body.dataset.gameMode = this.mode;
    document.querySelectorAll('.game-mode-btn').forEach((button) => {
      const active = button.dataset.mode === this.mode;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });

    if (this.mode === 'MAP') {
      window.requestAnimationFrame(() => {
        this.mapEngine?.map?.resize();
        this.mapEngine?.map?.triggerRepaint?.();
      });
    }
  }

  handleBattleAction() {
    const snapshot = this.lifeRpg.getSnapshot();
    if (snapshot.boss.status === 'DEFEATED') {
      this.lifeRpg.startNextRaid();
      return;
    }
    if (snapshot.boss.stagger >= snapshot.boss.maxStagger) {
      this.lifeRpg.executeFinisher();
      return;
    }
    this.bus.emit('HERO_PREPARE_MISSION');
    window.setTimeout(() => this.bus.emit('OPEN_EDITOR', { type: 'WORK', status: 'TODO' }), 520);
  }

  render(result = null) {
    const { character, boss, streak } = this.lifeRpg.getSnapshot();
    const xpRatio = Math.max(0, Math.min(100, (character.xp / character.xpToNext) * 100));
    const hpRatio = Math.max(0, Math.min(100, (boss.currentHp / boss.maxHp) * 100));
    this.text('arena-level', character.level);
    this.text('arena-xp-text', `${character.xp} / ${character.xpToNext}`);
    this.text('arena-coins', character.gold);
    this.text('arena-streak', streak.current);
    this.text('arena-raid-name', `${boss.name} // RAID ${boss.raid}`);
    this.text('arena-weakness', `WEAK: ${boss.weakness}`);
    this.text('arena-boss-label', boss.name);
    this.text('arena-boss-hp-text', `${boss.currentHp} / ${boss.maxHp} HP`);
    this.width('arena-xp-fill', xpRatio);
    this.width('arena-boss-hp-fill', hpRatio);

    const action = document.getElementById('arena-battle-btn');
    if (action) {
      const label = action.querySelector('span');
      const hint = action.querySelector('small');
      if (boss.status === 'DEFEATED') {
        label.textContent = 'NEXT RAID';
        hint.textContent = 'NEW VILLAIN CONTRACT';
      } else if (boss.stagger >= boss.maxStagger) {
        label.textContent = 'WEB FINISHER';
        hint.textContent = 'STAGGER MAX // STRIKE NOW';
      } else {
        label.textContent = 'START MISSION';
        hint.textContent = 'REAL-LIFE ACTION = DAMAGE';
      }
    }

    let status = boss.combatLog?.[0]?.text || 'HOÀN THÀNH NHIỆM VỤ ĐỂ TUNG ĐÒN';
    if (result?.damage) status = result.finisher ? `THWIP! FINISHER // ${result.damage} DMG` : `POW! ${result.damage} DAMAGE`;
    if (result?.victory) status = `K.O.! ${boss.name} DEFEATED`;
    this.text('arena-status-text', status);
  }

  text(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value);
  }

  width(id, value) {
    const node = document.getElementById(id);
    if (node) node.style.width = `${value}%`;
  }
}
