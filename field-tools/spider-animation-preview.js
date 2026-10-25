const canvas = document.getElementById('spider-animation-preview');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);
  }

  try {
    const response = await fetch('../battle-lab/spiderman.json');
    if (!response.ok) throw new Error('Sprite data unavailable');
    const data = await response.json();
    const frames = data.hero.clips.Idle.frames;
    const image = new Image();
    image.src = '../battle-lab/spiderman.png';
    await image.decode();

    let frameIndex = 0, elapsed = 0, previous = 0;
    const draw = () => {
      const [sx, sy, sw, sh] = frames[frameIndex].rect;
      const scale = Math.min(1.34, 94 / Math.max(sw, sh));
      const dw = sw * scale, dh = sh * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, sx, sy, sw, sh, (canvas.width - dw) / 2, canvas.height - dh - 5, dw, dh);
    };
    const tick = (now) => {
      if (visible && !document.hidden && !reduceMotion.matches) {
        elapsed += previous ? Math.min(now - previous, 100) : 0;
        const duration = Math.max(40, frames[frameIndex].duration * 1000);
        if (elapsed >= duration) {
          elapsed -= duration;
          frameIndex = (frameIndex + 1) % frames.length;
          draw();
        }
      }
      previous = now;
      requestAnimationFrame(tick);
    };
    draw();
    requestAnimationFrame(tick);
    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches) { frameIndex = 0; draw(); }
    });
  } catch {
    // The Field link remains available even if the preview asset cannot load.
  }
}
