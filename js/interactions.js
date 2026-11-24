/* Mouse-only effects: 3D card tilt + glow, and the hero logo's parallax.
   Nothing here runs on touch screens or with reduced motion. */
(() => {
  const { $, $$, prefs, perFrame } = App.utils;

  function tilt() {
    $$(".tilt").forEach((el) => {
      const max = +el.dataset.tilt || 7; // degrees; wide elements set a smaller data-tilt
      el.addEventListener("mousemove", perFrame((e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      }));
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1), border-color .3s";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 600);
      });
    });
  }

  function logoParallax() {
    const stage = $("#logoStage");
    addEventListener("mousemove", perFrame((e) => {
      if (scrollY > innerHeight) return;
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      stage.style.transform = `perspective(900px) rotateY(${x * 22}deg) rotateX(${-y * 18}deg) translate(${x * 16}px, ${y * 16}px)`;
    }));
  }

  function init() {
    if (!prefs.finePointer || prefs.reduceMotion) return;
    tilt();
    logoParallax();
  }

  App.interactions = { init };
})();
