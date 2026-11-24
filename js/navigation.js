/* Sticky nav state and timeline fill. */
(() => {
  const { $ } = App.utils;

  function init() {
    const nav = $("#nav"), timeline = $("#timeline");

    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle("scrolled", y > 30);
      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height));
        timeline.style.setProperty("--tl", pct * 100 + "%");
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  App.navigation = { init };
})();
