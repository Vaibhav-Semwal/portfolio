/* Scroll-triggered reveals, number counters and terminal start. */
(() => {
  const { $$ } = App.utils;

  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    const dec = +el.dataset.decimals || 0;
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = (end * (1 - Math.pow(1 - k, 4))).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function onReveal(el) {
    $$("[data-count]", el).forEach(countUp);
    $$("pre[data-terminal]", el).forEach((pre) => App.terminal.play(pre, pre._lines));
  }

  function init() {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        el.style.transitionDelay = Math.max(0, siblings.indexOf(el)) * 90 + "ms";
        el.classList.add("in");
        // Drop the reveal transition afterwards so tilt / hover stay snappy.
        setTimeout(() => { el.classList.remove("reveal", "in"); el.style.transitionDelay = ""; }, 1300);
        onReveal(el);
        io.unobserve(el);
      }),
      { threshold: 0.15 }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  }

  App.reveal = { init };
})();
