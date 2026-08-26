/* SPIDEY LIFE TRACKER — Spider-Verse ally roster */

export class AllySelector {
  constructor(soundController) {
    this.sound = soundController;
    this.modalEl = null;
    this.gridEl = null;
    this.selectedIndex = 0;
    this.storageKey = 'spidey-life-selected-ally';
    this.rosterSize = 100;
  }

  init() {
    this.modalEl = document.getElementById('ally-selector-backdrop');
    this.gridEl = document.getElementById('ally-roster-grid');
    if (!this.modalEl || !this.gridEl) return;

    this.selectedIndex = this.loadSelection();
    this.renderRoster();
    this.applySelection();

    document.getElementById('avatar-trigger')?.addEventListener('click', () => {
      this.sound.playClick();
      this.open();
    });
    document.getElementById('ally-selector-close')?.addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (event) => {
      if (event.target === this.modalEl) this.close();
    });
  }

  loadSelection() {
    try {
      const saved = Number.parseInt(localStorage.getItem(this.storageKey), 10);
      return Number.isInteger(saved) && saved >= 0 && saved < this.rosterSize ? saved : 0;
    } catch {
      return 0;
    }
  }

  renderRoster() {
    this.gridEl.innerHTML = Array.from({ length: this.rosterSize }, (_, index) => {
      const col = index % 10;
      const row = Math.floor(index / 10);
      const x = (col / 9) * 100;
      const y = (row / 9) * 100;
      return `<button class="ally-option${index === this.selectedIndex ? ' selected' : ''}"
        type="button" role="option" data-ally-index="${index}"
        aria-label="Spider Ally ${String(index + 1).padStart(2, '0')}"
        aria-selected="${index === this.selectedIndex}"
        style="background-position:${x}% ${y}%"></button>`;
    }).join('');

    this.gridEl.querySelectorAll('.ally-option').forEach((button) => {
      button.addEventListener('click', () => this.select(Number(button.dataset.allyIndex)));
    });
  }

  select(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.rosterSize) return;
    this.selectedIndex = index;
    try { localStorage.setItem(this.storageKey, String(index)); } catch { /* selection still works in memory */ }
    this.sound.playSelect();
    this.applySelection();
  }

  applySelection() {
    const col = this.selectedIndex % 10;
    const row = Math.floor(this.selectedIndex / 10);
    const position = `${(col / 9) * 100}% ${(row / 9) * 100}%`;
    const preview = document.getElementById('selected-ally-preview');
    if (preview) preview.style.backgroundPosition = position;

    const name = `SPIDER ALLY ${String(this.selectedIndex + 1).padStart(2, '0')}`;
    const nameEl = document.getElementById('selected-ally-name');
    if (nameEl) nameEl.textContent = name;
    document.getElementById('avatar-trigger')?.setAttribute('aria-label', `Đồng minh hiện tại: ${name}. Bấm để đổi.`);

    this.gridEl?.querySelectorAll('.ally-option').forEach((button) => {
      const selected = Number(button.dataset.allyIndex) === this.selectedIndex;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-selected', String(selected));
    });
  }

  open() {
    this.modalEl.removeAttribute('hidden');
    this.modalEl.removeAttribute('inert');
    this.modalEl.classList.add('active');
    this.gridEl.querySelector('.ally-option.selected')?.scrollIntoView({ block: 'nearest' });
  }

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
    this.modalEl.setAttribute('hidden', '');
    this.modalEl.setAttribute('inert', '');
  }
}
