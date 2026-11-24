/* Project carousel.
   The cards sit in a horizontally scrolling track (CSS scroll-snap does the snapping, and
   touch screens swipe it natively). This file only adds prev/next buttons, dots, arrow keys
   and click-and-drag for mice. Any number of cards works; when every card already fits,
   the controls hide themselves. */
(() => {
  const { $, $$, perFrame, onWidthChange } = App.utils;

  function init() {
    const root = $("#projectCarousel");
    const track = $("#projectTrack");
    const slides = [...track.children];
    const dotsBox = $(".carousel-dots", root);
    const [prevBtn, nextBtn] = $$(".carousel-btn", root);
    if (!slides.length) return;

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to project ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsBox.append(dot);
      return dot;
    });

    let current = 0;

    // Scroll so that slide i lines up with the start of the track.
    function goTo(i) {
      const index = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[index].offsetLeft - slides[0].offsetLeft, behavior: "smooth" });
    }

    // Which slide is first on screen; update dots, buttons and edge fades.
    function update() {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      root.classList.toggle("static", scrollWidth <= clientWidth + 4);

      const x = scrollLeft + slides[0].offsetLeft;
      current = slides.reduce((best, s, i) =>
        Math.abs(s.offsetLeft - x) < Math.abs(slides[best].offsetLeft - x) ? i : best, 0);
      const atStart = scrollLeft <= 4;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 4;

      dots.forEach((d, i) => d.classList.toggle("active", i === current));
      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
      track.style.setProperty("--fade-l", atStart ? "0px" : "40px");
      track.style.setProperty("--fade-r", atEnd ? "0px" : "56px");
    }

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));
    track.addEventListener("scroll", perFrame(update), { passive: true });
    onWidthChange(update);

    root.tabIndex = 0;
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    });

    // Click-and-drag with a mouse only.
    let startX = 0, startScroll = 0, dragging = false, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || root.classList.contains("static")) return;
      dragging = true; moved = false;
      startX = e.clientX; startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      track.classList.add("dragging");
    });
    track.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    track.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("dragging");
      update();
      goTo(current); // snap to the closest card
    });
    // Don't follow a link if the user was dragging.
    track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);

    update();
  }

  App.carousel = { init };
})();
