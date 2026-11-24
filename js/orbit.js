/* 3D tech-logo ring around the hero logo.

   One tilted ring of logos. At rest it is compact, hugging the V with small tiles;
   hovering the logo area (or tapping it on touch screens) opens it out to full size.
   The ring line is drawn with a CSS 3D transform, and every logo "chip" is placed on
   it with the same maths, so chips sit exactly on the line. Chips on the near side
   pass in front of the V, chips on the far side pass behind it, smaller and dimmer.

   To change which logos orbit, edit hero.orbit in content.js. */
(() => {
  const { $, $$, prefs, onWidthChange } = App.utils;

  const PERSPECTIVE = 900; // px; must match the perspective() used for the ring line

  const RING = {
    compactRadius: 0.25,  // radius at rest, as a fraction of the hero visual's width
    expandedRadius: 0.55, // radius when opened
    compactChip: 0.6,     // footprint at rest (1 = full size). At rest the tile is hidden
                          // and the logo fills it, so logos look bigger than this suggests.
    tiltX: 58,            // how far the ring leans back (deg)
    slant: -25,           // matches the logo's diagonal cut (deg)
    speed: 0.2,           // how fast logos travel round the ring (radians per second)
    expandRate: 1,        // how fast it opens/closes; ~14 settles in about 0.3s
  };
  // Spacing was checked for 16 logos across the whole open/close range.
  // If you add many more, lower compactChip or raise compactRadius.

  const rad = (d) => (d * Math.PI) / 180;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function init() {
    const stage = $("#orbit3d");
    const visual = $("#heroVisual");
    if (!stage) return;

    const line = $(".ring", stage);
    const chips = $$(".chip", stage);
    const offsets = chips.map((_, i) => (i / chips.length) * Math.PI * 2); // spread evenly

    let width = visual.clientWidth;
    onWidthChange(() => (width = visual.clientWidth));

    /* ---------- Open / close ---------- */
    let open = 0;        // 0 = compact, 1 = expanded (animated)
    let wantOpen = false;

    // Hover: measured as distance from the centre, with a larger radius to stay
    // open than to open, so moving onto a logo at the rim never makes it flicker.
    if (prefs.finePointer) {
      addEventListener("mousemove", (e) => {
        const r = visual.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) / r.width;
        wantOpen = wantOpen ? d < 0.62 : d < 0.42;
      });
      document.addEventListener("mouseleave", () => (wantOpen = false));
    } else {
      // Touch: tap the logo area to toggle.
      visual.addEventListener("click", () => (wantOpen = !wantOpen));
    }

    /* ---------- Pointer tilt ---------- */
    let tiltX = 0, tiltZ = 0, targetX = 0, targetZ = 0;
    if (prefs.finePointer && !prefs.reduceMotion) {
      addEventListener("mousemove", (e) => {
        targetX = (e.clientY / innerHeight - 0.5) * -14;
        targetZ = (e.clientX / innerWidth - 0.5) * 12;
      });
    }

    let lastLine = "", lastTile = "";

    function place(angle) {
      const e = easeInOut(open);
      // Slightly smaller on narrow screens so logos stay on screen.
      const fit = width < 420 ? 0.88 : 1;
      const R = (RING.compactRadius + (RING.expandedRadius - RING.compactRadius) * e) * width * fit;
      const chipScale = RING.compactChip + (1 - RING.compactChip) * e;

      const tiltDeg = RING.tiltX + tiltX;
      const slantDeg = RING.slant + tiltZ;
      const a = rad(tiltDeg), b = rad(slantDeg);

      // Ring line: same transform as the maths below.
      const lineKey = `${R.toFixed(1)}|${slantDeg.toFixed(2)}|${tiltDeg.toFixed(2)}`;
      if (lineKey !== lastLine) {
        lastLine = lineKey;
        line.style.width = line.style.height = R * 2 + "px";
        line.style.transform =
          `translate(-50%, -50%) perspective(${PERSPECTIVE}px) rotateZ(${slantDeg}deg) rotateX(${tiltDeg}deg)`;
        line.style.opacity = (0.5 + e * 0.5).toFixed(3);
      }
      const tile = e.toFixed(3);
      const tileChanged = tile !== lastTile;
      lastTile = tile;

      chips.forEach((chip, i) => {
        const t = angle + offsets[i];
        // Point on a flat circle...
        const x0 = R * Math.cos(t), y0 = R * Math.sin(t);
        // ...tilted back around the X axis...
        const y1 = y0 * Math.cos(a), z = y0 * Math.sin(a);
        // ...then slanted around the Z axis.
        const x = x0 * Math.cos(b) - y1 * Math.sin(b);
        const y = x0 * Math.sin(b) + y1 * Math.cos(b);
        // Perspective projection.
        const p = PERSPECTIVE / (PERSPECTIVE - z);
        const depth = (z / R + 1) / 2; // 0 = far side, 1 = near side

        chip.style.transform =
          `translate(-50%, -50%) translate3d(${x * p}px, ${y * p}px, 0) scale(${p * (0.75 + depth * 0.3) * chipScale})`;
        chip.style.opacity = (0.35 + depth * 0.65).toFixed(3);
        chip.style.zIndex = z > 0 ? 3 : 1; // in front of / behind the V
        if (tileChanged) chip.style.setProperty("--tile", tile); // tile fades in as the ring opens
      });
    }

    if (prefs.reduceMotion) {
      // No continuous motion: jump between states instead of animating.
      const render = () => { open = wantOpen ? 1 : 0; place(0.6); };
      addEventListener("mousemove", render);
      visual.addEventListener("click", render);
      render();
      return;
    }

    let time = 0, last = performance.now(), running = false, skip = false;
    const lite = !prefs.finePointer; // phones: every other frame, like the particles

    function frame(now) {
      if (lite && (skip = !skip)) { if (running) requestAnimationFrame(frame); return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Frame-rate independent easing toward the target state.
      const k = 1 - Math.exp(-dt * RING.expandRate);
      open += ((wantOpen ? 1 : 0) - open) * k;
      tiltX += (targetX - tiltX) * 0.06;
      tiltZ += (targetZ - tiltZ) * 0.06;
      time += dt;
      place(time * RING.speed);
      if (running) requestAnimationFrame(frame);
    }

    // Only animate while the hero is on screen.
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      } else if (!entry.isIntersecting) {
        running = false;
      }
    }).observe(visual);
  }

  App.orbit = { init };
})();
