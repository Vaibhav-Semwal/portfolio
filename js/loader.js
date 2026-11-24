/* Preloader exit, hero entrance and the name scramble effect. */
(() => {
  const { $, $$, prefs } = App.utils;
  const GLYPHS = "!<>-_\\/[]{}=+*^?#01VS";

  /* Letters resolve left to right out of random glyphs. Safe to call again mid-scramble:
     the original text is remembered and the older run stops. */
  function scramble(el) {
    const final = (el.dataset.final ??= el.textContent);
    const run = (el._scrambleRun = (el._scrambleRun || 0) + 1);
    const total = 26;
    let frame = 0;
    const tick = () => {
      if (el._scrambleRun !== run) return;
      el.textContent = final
        .split("")
        .map((ch, i) => (frame / total > i / final.length ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join("");
      if (++frame <= total) requestAnimationFrame(tick);
      else el.textContent = final;
    };
    tick();
  }

  function init() {
    const hero = $(".hero");
    const loader = $("#loader");
    document.body.classList.add("loading");

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      loader.classList.add("done");
      document.body.classList.remove("loading");
      setTimeout(() => {
        hero.classList.add("ready");
        if (!prefs.reduceMotion) {
          $$("[data-scramble]").forEach((el, i) => setTimeout(() => scramble(el), 250 + i * 160));
        }
      }, 150);
    };

    const delay = prefs.reduceMotion ? 0 : 1300;
    if (document.readyState === "complete") setTimeout(start, delay);
    else window.addEventListener("load", () => setTimeout(start, delay));
    setTimeout(start, 4000); // safety net if an asset hangs
  }

  App.loader = { init, scramble };
})();
