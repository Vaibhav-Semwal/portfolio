/* Hidden phrase in the hero logo's slash, picked at random from content.hero.secrets.
   Every time the V closes, the next phrase is swapped in once the text has faded out,
   so each opening shows a new one. A mouse opens it on hover; touch opens it with a tap. */
(() => {
  const { $ } = App.utils;
  const FADE = 350; // ms: matches the text's fade-out in css/hero.css

  function init() {
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
      swapTimer = setTimeout(() => { if (!isOpen()) show(pick()); }, FADE);
    };

    stage.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      hovering = true;
      stage.classList.add("hover");
    });
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

  App.logoSecret = { init };
})();
