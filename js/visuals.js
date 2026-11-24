/* Mock-up visuals for project cards. Each builder takes (visual, project) from content.js
   and returns an element; js/render.js picks one by visual.type (placeholder when none). */
(() => {
  const { escape, h } = App.utils;

  function terminalVisual(v) {
    const pre = h("pre", { "data-terminal": true });
    pre._lines = v.lines;
    return h("div", { class: "terminal" }, [
      h("div", { class: "term-bar", html: `<i></i><i></i><i></i><span>${escape(v.title)}</span>` }),
      pre,
    ]);
  }

  function paperVisual(v) {
    const widths = [["w90", "w60"], ["w80", "w40"], ["w70", "w85"], ["w60", "w90"]];
    const qs = Array.from({ length: v.questions || 3 }, (_, i) => {
      const [a, b] = widths[i % widths.length];
      return h("div", { class: "q", html: `<i>Q${i + 1}</i><span class="ln ${a}"></span><span class="ln ${b}"></span>` });
    });
    return h("div", { class: "paper-stack" }, [
      h("div", { class: "paper p3" }),
      h("div", { class: "paper p2" }),
      h("div", { class: "paper p1" }, [
        h("div", { class: "paper-head", html: `<b>${escape(v.heading)}</b><span>${escape(v.badge)}</span>` }),
        ...qs,
        h("div", { class: "paper-btn", text: v.button }),
      ]),
    ]);
  }

  function imageVisual(v, item) {
    return h("div", { class: "shot" }, [h("img", { src: v.src, alt: v.alt || item.name + " screenshot", loading: "lazy" })]);
  }

  /* Used when a project has no visual: the project's initials over the logo slash. */
  function placeholderVisual(_, item) {
    const initials = item.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
    return h("div", { class: "placeholder" }, [h("span", { text: initials }), h("i")]);
  }

  /* A stack of desktop notification toasts (used by MailTag). */
  function notifyVisual(v) {
    const bell = '<svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>';
    const toasts = (v.items || []).slice(0, 3).map(([from, subject], i) =>
      h("div", { class: "toast", style: `--i:${i}` }, [
        h("span", { class: "toast-icon", html: bell }),
        h("div", { class: "toast-body", html:
          `<span class="toast-app">${escape(v.app || "")} · now</span><b>${escape(from)}</b><span>${escape(subject)}</span>` }),
      ])
    );
    return h("div", { class: "notify" }, toasts);
  }

  App.visuals = {
    terminal: terminalVisual,
    paper: paperVisual,
    image: imageVisual,
    notify: notifyVisual,
    placeholder: placeholderVisual,
  };
})();
