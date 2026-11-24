/* Shared helpers and the App namespace every module registers on. */
window.App = window.App || {};

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const prefs = {
    reduceMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    finePointer: matchMedia("(hover: hover) and (pointer: fine)").matches,
  };

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

  /* Turns content markup into HTML: **bold**, [[accent]], __highlight__ */
  const format = (s) =>
    escape(s)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/\[\[(.+?)\]\]/g, '<span class="grad">$1</span>')
      .replace(/__(.+?)__/g, '<span class="hl">$1</span>');

  /* Reads "a.b.c" from an object. */
  const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

  /* Tiny element builder: h("div", { class: "x" }, "html string" | [children]) */
  const h = (tag, attrs = {}, children) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k === "text") el.textContent = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    if (Array.isArray(children)) children.filter(Boolean).forEach((c) => el.append(c));
    else if (children != null) el.innerHTML = children;
    return el;
  };

  /* Wraps a handler for a busy event (scroll, pointer, resize) so it runs at most once per frame. */
  const perFrame = (fn) => {
    let queued = false;
    return (...args) => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; fn(...args); });
    };
  };

  /* Window scroll listener, batched to one call per frame. */
  const onScroll = (fn) => addEventListener("scroll", perFrame(fn), { passive: true });

  /* Resize listener that only fires when the WIDTH changes. Phones fire "resize" every time
     the address bar shows or hides; that only changes the height and needs no re-layout. */
  const onWidthChange = (fn) => {
    let w = innerWidth;
    addEventListener("resize", perFrame(() => {
      if (innerWidth === w) return;
      w = innerWidth;
      fn();
    }));
  };

  App.utils = { $, $$, prefs, escape, format, get, h, perFrame, onScroll, onWidthChange };
})();
