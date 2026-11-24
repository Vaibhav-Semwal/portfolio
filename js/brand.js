/* Pressing the V logo in the top bar:
   - the logo jiggles (css/nav.css)
   - "vaibhav.semwal" types itself out again (the scramble effect), in place
   - the link scrolls back to the top, and once the hero is in view its name types itself
     out again too. Nothing slides or fades: the text stays where it is. */
(() => {
  const { $, $$, prefs } = App.utils;

  function init() {
    const brand = $("#brand"), hero = $(".hero");
    if (!brand || prefs.reduceMotion) return; // reduced motion: the link just scrolls to the top

    let run = 0;
    const type = (els, delay = 0) =>
      els.forEach((el, i) => setTimeout(() => App.loader.scramble(el), delay + i * 140));

    brand.addEventListener("click", () => {
      brand.classList.remove("jiggle");
      void brand.offsetWidth; // restart if clicked again mid-jiggle
      brand.classList.add("jiggle");

      type($$(".brand-word", brand));

      // Re-type the hero name once the page is (almost) back at the top.
      const mine = ++run, t0 = performance.now();
      (function wait(now) {
        if (mine !== run) return;
        if (scrollY > innerHeight * 0.35 && now - t0 < 1800) return requestAnimationFrame(wait);
        type($$("[data-scramble]", hero), 80);
      })(t0);
    });
    brand.addEventListener("animationend", (e) => {
      if (e.target.classList.contains("brand-mark")) brand.classList.remove("jiggle");
    });
  }

  App.brand = { init };
})();
