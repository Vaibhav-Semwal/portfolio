/* Scroll-driven page state: the top bar darkens once scrolled, and the experience timeline fills. */
(() => {
  const { $, onScroll } = App.utils;

  function init() {
    const nav = $("#nav"), timeline = $("#timeline");

    const update = () => {
      nav.classList.toggle("scrolled", scrollY > 30);
      if (!timeline) return;
      const r = timeline.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height));
      timeline.style.setProperty("--tl", pct * 100 + "%");
    };
    onScroll(update);
    update();
  }

  App.navigation = { init };
})();
