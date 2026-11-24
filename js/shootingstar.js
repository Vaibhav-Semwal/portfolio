/* A rare shooting star streaks across the sky at long, random intervals.
   Runs on its own canvas, so it costs nothing between events. */
(() => {
  const { $, prefs } = App.utils;
  const FIRST_DELAY = [6000, 12000];   // ms before the first one
  const INTERVAL = [15000, 35000];      // ms between later ones
  const rand = (a, b) => a + Math.random() * (b - a);

  function init() {
    if (prefs.reduceMotion) return;
    const canvas = $("#sky");
    const ctx = canvas.getContext("2d");
    let timer;

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function schedule(range) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Never fire while the tab is hidden: the visitor would miss it.
        if (document.hidden) return schedule([4000, 9000]);
        shoot();
        schedule(INTERVAL);
      }, rand(...range));
    }

    function shoot() {
      const W = innerWidth, H = innerHeight;
      // Start somewhere along the top / upper side, fall diagonally across.
      const fromLeft = Math.random() < 0.5;
      const angle = rand(0.35, 0.65); // radians below horizontal
      const sx = fromLeft ? rand(-0.05, 0.55) * W : rand(0.45, 1.05) * W;
      const sy = rand(-0.05, 0.3) * H;
      const dist = rand(0.55, 0.9) * Math.hypot(W, H) * 0.6;
      const tailLen = rand(260, 420);
      const duration = rand(900, 1400);
      const dx = Math.cos(angle) * (fromLeft ? 1 : -1), dy = Math.sin(angle);
      const t0 = performance.now();

      (function frame(now) {
        const t = Math.min(1, (now - t0) / duration);
        const travel = (1 - Math.pow(1 - t, 2)) * dist;      // ease-out
        const fade = t < 0.15 ? t / 0.15 : 1 - Math.pow((t - 0.15) / 0.85, 2);
        const hx = sx + dx * travel, hy = sy + dy * travel;
        const len = tailLen * (0.4 + 0.6 * Math.min(1, t * 3));
        const tx = hx - dx * len, ty = hy - dy * len;

        ctx.clearRect(0, 0, W, H);
        ctx.globalAlpha = Math.max(0, fade);

        const tail = ctx.createLinearGradient(hx, hy, tx, ty);
        tail.addColorStop(0, "rgba(246,245,250,0.95)");
        tail.addColorStop(0.25, "rgba(181,47,216,0.55)");
        tail.addColorStop(1, "rgba(59,53,160,0)");
        ctx.strokeStyle = tail;
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke();

        const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 20);
        glow.addColorStop(0, "rgba(255,255,255,1)");
        glow.addColorStop(0.35, "rgba(181,47,216,0.45)");
        glow.addColorStop(1, "rgba(124,51,190,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(hx, hy, 20, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        if (t < 1) requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, W, H);
      })(t0);
    }

    resize();
    addEventListener("resize", resize);
    schedule(FIRST_DELAY);
    App.shootingStar.shoot = shoot; // handy for testing from the console
  }

  App.shootingStar = { init };
})();
