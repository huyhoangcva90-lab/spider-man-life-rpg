/* WEB OPS TRACKER V6 - BOOT SEQUENCE */

export class BootSequence {
  constructor(soundController) {
    this.sound = soundController;
  }

  run(onComplete) {
    // Check if already booted in session
    if (sessionStorage.getItem('v6_booted')) {
      onComplete();
      return;
    }

    const screen = document.createElement('div');
    screen.className = 'boot-screen';
    screen.innerHTML = `
      <div class="boot-terminal-box">
        <div class="boot-line">&gt; SYSTEM INIT: WEB OPS TRACKER v6.0.0</div>
        <div class="boot-line">&gt; LOADING MAPLIBRE VECTOR ENGINE...</div>
        <div class="boot-line">&gt; VERIFYING NOTION MISSION CONNECTOR...</div>
        <div class="boot-line warning">&gt; GEOLOCATION ACCURACY SUBSYSTEM: READY</div>
        <div class="boot-progress-bar">
          <div class="boot-progress-fill"></div>
        </div>
      </div>
    `;

    document.body.appendChild(screen);
    this.sound.playBootSound();

    const fill = screen.querySelector('.boot-progress-fill');
    let width = 0;

    const interval = setInterval(() => {
      width += 15;
      fill.style.width = `${width}%`;
      if (width >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          screen.style.opacity = '0';
          setTimeout(() => {
            screen.remove();
            sessionStorage.setItem('v6_booted', '1');
            onComplete();
          }, 500);
        }, 300);
      }
    }, 80);
  }
}
