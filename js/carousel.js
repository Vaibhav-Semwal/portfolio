/* Project carousel.
   The cards sit in a horizontally scrolling track (CSS scroll-snap does the snapping).
   This file only adds: prev/next buttons, dots, keyboard arrows and mouse dragging.
   It works with any number of cards, so adding projects in content.js needs no changes here.
   When every card already fits on screen, the controls hide themselves. */
(() => {
  const { $, $$ } = App.utils;

  function init() {
    const root = $("#projectCarousel");
    const track = $("#projectTrack");
    const slides = [...track.children];
    const dotsBox = $(".carousel-dots", root);
    const [prevBtn, nextBtn] = $$(".carousel-btn", root);
    if (!slides.length) return;

    // One dot per slide.
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

    // Work out which slide is first on screen and update dots / buttons.
    function update() {
      const scrollable = track.scrollWidth > track.clientWidth + 4;
      root.classList.toggle("static", !scrollable);

      const x = track.scrollLeft + slides[0].offsetLeft;
      current = slides.reduce((best, s, i) =>
        Math.abs(s.offsetLeft - x) < Math.abs(slides[best].offsetLeft - x) ? i : best, 0);
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

      dots.forEach((d, i) => d.classList.toggle("active", i === current));
      const atStart = track.scrollLeft <= 4;
      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
      // Edge fades only where more cards are hidden.
      track.style.setProperty("--fade-l", atStart ? "0px" : "40px");
      track.style.setProperty("--fade-r", atEnd ? "0px" : "56px");
    }

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    addEventListener("resize", update);

    // Left / right arrow keys when the carousel has focus.
    root.tabIndex = 0;
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    });

    // Click-and-drag with a mouse (touch devices already swipe natively).
    let startX = 0, startScroll = 0, dragging = false, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || root.classList.contains("static")) return;
      dragging = true; moved = false;
      startX = e.clientX; startScroll = track.scrollLeft;
      track.classList.add("dragging");
    });
    addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("dragging");
      update();
      goTo(current); // snap to the closest card
    });
    // Don't follow a link if the user was dragging.
    track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);

    // Cursor shows "drag" over the cards (only when there is something to drag).
    const ring = $("#cursor");
    track.addEventListener("mouseenter", () => ring.classList.toggle("drag", !root.classList.contains("static")));
    track.addEventListener("mouseleave", () => ring.classList.remove("drag"));

    update();
  }

  App.carousel = { init };
})();
