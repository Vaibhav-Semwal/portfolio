/* Side scroll slider: the thumb tracks page position, can be dragged to scrub,
   and each stop jumps to its section. Arrow keys on the thumb step between sections. */
(() => {
  const { $, $$, perFrame, onScroll } = App.utils;

  function init() {
    const rail = $("#rail"), track = $("#railTrack"), fill = $("#railFill"), thumb = $("#railThumb");
    if (!rail) return;
    const stops = $$(".rail-stop", rail).map((el) => ({ el, target: document.getElementById(el.dataset.target), pct: 0 }));
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
    let active = -1, idleTimer;

    /* Place each stop where its section starts, as a share of the scrollable height. */
    function layout() {
      const max = maxScroll();
      stops.forEach((s) => {
        const top = s.target.id === "top" ? 0 : s.target.getBoundingClientRect().top + scrollY - innerHeight * 0.15;
        s.pct = clamp01(top / max);
        s.el.style.top = s.pct * 100 + "%";
      });
      update();
    }

    function update() {
      const pct = clamp01(scrollY / maxScroll());
      thumb.style.top = pct * 100 + "%";
      fill.style.transform = `scaleY(${pct})`;
      thumb.setAttribute("aria-valuenow", Math.round(pct * 100));

      let now = 0;
      stops.forEach((s, i) => { if (pct + 0.002 >= s.pct) now = i; });
      if (now === active) return; // only touch the stop classes when the section changes
      active = now;
      stops.forEach((s, i) => {
        s.el.classList.toggle("active", i === active);
        s.el.classList.toggle("passed", i < active);
      });
      thumb.setAttribute("aria-valuetext", stops[active] ? stops[active].el.getAttribute("aria-label") : "");
    }

    // While scrolling, the active label stays lit briefly (.moving).
    onScroll(() => {
      update();
      rail.classList.add("moving");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => rail.classList.remove("moving"), 900);
    });

    const scrollToPct = (pct, smooth) =>
      scrollTo({ top: clamp01(pct) * maxScroll(), behavior: smooth ? "smooth" : "instant" });

    /* Dragging anywhere on the track scrubs the page. Taps on stops fall through to their links. */
    let dragging = false;
    const scrub = perFrame((y) => {
      const r = track.getBoundingClientRect();
      scrollToPct((y - r.top) / r.height, false);
    });
    track.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".rail-stop")) return;
      e.preventDefault();
      dragging = true;
      track.setPointerCapture(e.pointerId);
      rail.classList.add("dragging");
      scrub(e.clientY);
    });
    track.addEventListener("pointermove", (e) => { if (dragging) scrub(e.clientY); });
    const endDrag = () => { dragging = false; rail.classList.remove("dragging"); };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    stops.forEach((s) =>
      s.el.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToPct(s.pct, true);
      })
    );

    thumb.addEventListener("keydown", (e) => {
      const pct = scrollY / maxScroll();
      let next = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") next = stops.find((s) => s.pct > pct + 0.005);
      else if (e.key === "ArrowUp" || e.key === "PageUp") next = [...stops].reverse().find((s) => s.pct < pct - 0.005);
      else if (e.key === "Home") next = stops[0];
      else if (e.key === "End") next = { pct: 1 };
      else return;
      e.preventDefault();
      if (next) scrollToPct(next.pct, true);
    });

    // Re-measure whenever the page's size changes (images loading, fonts, rotation).
    new ResizeObserver(perFrame(layout)).observe(document.body);
    layout();
  }

  App.rail = { init };
})();
