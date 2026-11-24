/* Pointer-driven effects: 3D card tilt + glow, hero logo parallax, hidden logo phrase. */
(() => {
  const { $, $$, prefs } = App.utils;

  function tilt() {
    $$(".tilt").forEach((el) => {
      const max = el.classList.contains("project") ? 4 : 7;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1), border-color .3s";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 600);
      });
    });
  }

  function logoParallax() {
    const stage = $("#logoStage");
    addEventListener("mousemove", (e) => {
      if (scrollY > innerHeight) return;
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      stage.style.transform = `perspective(900px) rotateY(${x * 22}deg) rotateX(${-y * 18}deg) translate(${x * 16}px, ${y * 16}px)`;
    });
  }

  /* Hidden phrase in the logo's slash, picked at random from content.hero.secrets.
     Every time the V closes, the next phrase is swapped in once the text has faded out,
     so each opening shows a new one. Mouse opens it on hover; touch opens it with a tap. */
  const SECRET_FADE = 350; // ms: matches the text's fade-out in styles.css
  function logoSecret() {
    const stage = $("#logoStage"), el = $("#logoSecret");
    const list = [].concat((window.CONTENT.hero || {}).secrets || []).filter(Boolean);

    let current = -1, hovering = false, swapTimer;
    const pick = () => {
      if (list.length < 2) return 0;
      let i;
      do i = (Math.random() * list.length) | 0; while (i === current);
      return i;
    };
    const show = (i) => { current = i; el.textContent = list[i] || ""; };
    const isOpen = () => hovering || stage.classList.contains("open");
    const closed = () => {
      clearTimeout(swapTimer);
      swapTimer = setTimeout(() => { if (!isOpen()) show(pick()); }, SECRET_FADE);
    };

    stage.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovering = true; stage.classList.add("hover"); } });
    stage.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      stage.classList.remove("hover");
      closed();
    });
    stage.addEventListener("click", (e) => {
      if (e.pointerType === "mouse") return; // mouse users already opened it by hovering
      if (!stage.classList.toggle("open")) closed();
    });

    show(pick());
  }

  function init() {
    logoSecret();
    if (!prefs.finePointer || prefs.reduceMotion) return;
    tilt();
    logoParallax();
  }

  App.interactions = { init };
})();
