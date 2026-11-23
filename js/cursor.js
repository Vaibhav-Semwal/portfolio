/* Custom cursor ring + dot. Also exposes the live pointer position for other modules. */
(() => {
  const { $, $$ } = App.utils;
  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };

  function init() {
    const ring = $("#cursor"), dot = $("#cursorDot");
    let rx = pointer.x, ry = pointer.y;

    addEventListener("mousemove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      dot.style.transform = `translate(${pointer.x}px,${pointer.y}px) translate(-50%,-50%)`;
    });

    (function follow() {
      rx += (pointer.x - rx) * 0.18;
      ry += (pointer.y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    })();

    $$("a, button, .pills span, .stat").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  App.cursor = { init, pointer };
})();
