/* Pointer-driven effects: 3D card tilt + glow, magnetic buttons, hero logo parallax. */
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

  /* Magnetic buttons: the element eases toward the pointer while hovered and
     springs back to rest on leave. Driven by requestAnimationFrame (not CSS
     transitions) so there is never a jump, however fast the pointer moves. */
  function magnetic() {
    const PULL_X = 0.25, PULL_Y = 0.35; // how far the element follows the pointer
    const EASE = 0.15;                  // 0..1, higher = snappier

    $$(".magnetic").forEach((el) => {
      let tx = 0, ty = 0;   // target offset
      let cx = 0, cy = 0;   // current offset
      let running = false;

      const step = () => {
        cx += (tx - cx) * EASE;
        cy += (ty - cy) * EASE;
        const settled = Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05;
        if (settled) { cx = tx; cy = ty; }
        el.style.transform = cx || cy ? `translate3d(${cx}px, ${cy}px, 0)` : "";
        if (settled) running = false;
        else requestAnimationFrame(step);
      };
      const kick = () => { if (!running) { running = true; requestAnimationFrame(step); } };

      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        // Measure from the resting centre (subtract the current offset) so the
        // element does not chase its own movement.
        tx = (e.clientX - (r.left - cx) - r.width / 2) * PULL_X;
        ty = (e.clientY - (r.top - cy) - r.height / 2) * PULL_Y;
        kick();
      });
      el.addEventListener("mouseleave", () => { tx = 0; ty = 0; kick(); });
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

  function init() {
    if (!prefs.finePointer || prefs.reduceMotion) return;
    tilt();
    magnetic();
    logoParallax();
  }

  App.interactions = { init };
})();
