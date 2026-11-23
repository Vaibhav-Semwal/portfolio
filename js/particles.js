/* Background particle network in the logo's blue / purple tones. */
(() => {
  const { $, prefs } = App.utils;
  const COLORS = ["rgba(124,51,190,", "rgba(59,53,160,", "rgba(29,58,158,"];
  const LINK_DIST = 120;
  const REPEL_DIST = 160;

  function init() {
    if (prefs.reduceMotion) return;
    const canvas = $("#field");
    const ctx = canvas.getContext("2d");
    const pointer = App.cursor.pointer;
    let pts = [];

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = pointer.x - p.x, dy = pointer.y - p.y, d = Math.hypot(dx, dy);
        if (d < REPEL_DIST && d > 0) { p.x -= (dx / d) * 0.6; p.y -= (dy / d) * 0.6; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > innerHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + ".9)";
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < LINK_DIST) {
            ctx.strokeStyle = p.c + 0.22 * (1 - dd / LINK_DIST) + ")";
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    addEventListener("resize", resize);
    draw();
  }

  App.particles = { init };
})();
