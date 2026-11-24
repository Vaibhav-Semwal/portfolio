/* Background particle network in the logo's blue / purple tones.
   Phones get fewer particles, a lower pixel ratio and 30fps, which keeps it smooth and cool. */
(() => {
  const { $, prefs, onWidthChange } = App.utils;
  const COLORS = ["rgba(124,51,190,", "rgba(59,53,160,", "rgba(29,58,158,"];
  const LINK = 120, LINK2 = LINK * LINK;
  const REPEL = 160, REPEL2 = REPEL * REPEL;

  function init() {
    if (prefs.reduceMotion) return;
    const canvas = $("#field");
    const ctx = canvas.getContext("2d");
    const pointer = { x: -1e4, y: -1e4 }; // stays off-screen on touch, so nothing is repelled there
    if (prefs.finePointer) addEventListener("mousemove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
    const lite = !prefs.finePointer;
    let pts = [], W = 0, H = 0, skip = false;

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, lite ? 1.5 : 2);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(lite ? 40 : 90, Math.floor((W * H) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    }

    function draw() {
      requestAnimationFrame(draw);
      if (lite && (skip = !skip)) return; // every other frame on phones
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = pointer.x - p.x, dy = pointer.y - p.y, d2 = dx * dx + dy * dy;
        if (d2 < REPEL2 && d2 > 0) { const d = Math.sqrt(d2); p.x -= (dx / d) * 0.6; p.y -= (dy / d) * 0.6; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + ".9)";
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], ex = p.x - q.x, ey = p.y - q.y, dd2 = ex * ex + ey * ey;
          if (dd2 < LINK2) {
            ctx.strokeStyle = p.c + 0.22 * (1 - Math.sqrt(dd2) / LINK) + ")";
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
    }

    resize();
    onWidthChange(resize); // the canvas is stretched by CSS, so height-only changes need nothing
    draw();
  }

  App.particles = { init };
})();
