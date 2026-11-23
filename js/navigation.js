/* Sticky nav state, scroll progress bar, mobile menu, scroll-spy, timeline fill. */
(() => {
  const { $, $$ } = App.utils;

  function init() {
    const nav = $("#nav"), bar = $("#progress"), timeline = $("#timeline");

    const onScroll = () => {
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      nav.classList.toggle("scrolled", y > 30);
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height));
        timeline.style.setProperty("--tl", pct * 100 + "%");
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    $("#navToggle").addEventListener("click", () => nav.classList.toggle("open"));
    const links = $$("#navLinks a");
    links.forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("section[id]").forEach((s) => spy.observe(s));
  }

  App.navigation = { init };
})();
