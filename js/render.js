/* Builds every text-bearing part of the page from window.CONTENT. */
(() => {
  const { $, $$, format, get, h, escape } = App.utils;

  const ICONS = {
    code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
    spark: '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    tool: '<path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  };
  const ARROW_RIGHT_UP = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg>';

  const pad = (n) => String(n).padStart(2, "0");
  const tags = (list) => h("div", { class: "tags" }, (list || []).map((t) => h("span", { text: t })));
  const bullets = (list) => h("ul", { class: "bullets" }, (list || []).map((b) => h("li", { html: format(b) })));
  const external = (href) => (/^https?:/.test(href) ? { target: "_blank", rel: "noopener" } : {});

  /* ---------- Simple slots: <el data-slot="path.to.value"> ---------- */
  function slots(c) {
    $$("[data-slot]").forEach((el) => {
      const key = el.dataset.slot;
      if (key === "brand") {
        el.innerHTML = `${escape(c.brand.first)}<b>.</b>${escape(c.brand.last)}`;
        return;
      }
      const v = get(c, key);
      if (v != null) el.innerHTML = format(v);
    });
  }

  function meta(c) {
    document.title = c.meta.title;
    $('meta[name="description"]').setAttribute("content", c.meta.description);
    $("#brand").setAttribute("aria-label", c.brand.logoAlt);
    $("#heroLogo").alt = c.brand.logoAlt;
  }

  function nav(c) {
    $("#navLinks").replaceChildren(
      ...c.nav.map((item) => h("a", { href: "#" + item.id, text: item.label }))
    );
  }

  function headings(c) {
    $$("[data-head]").forEach((el) => {
      const data = c[el.dataset.head];
      el.innerHTML = `<h2>${escape(data.title)} <em>${escape(data.accent)}</em></h2>`;
    });
  }

  function hero(c) {
    const hr = c.hero;
    const setCta = (el, cta) => {
      el.href = cta.href;
      el.querySelector("span").textContent = cta.label;
    };
    $("#heroKeys").replaceChildren(...(hr.keywords || []).map((k) => h("li", { text: k })));
    setCta($("#ctaPrimary"), hr.primaryCta);
    setCta($("#ctaSecondary"), hr.secondaryCta);
    // One ring line (the faint ellipse) + one chip per logo. js/orbit.js animates them.
    $("#orbit3d").replaceChildren(
      h("div", { class: "ring" }),
      ...(hr.orbit || []).map((t) =>
        h("span", { class: "chip", title: t.name }, [h("img", { src: t.icon, alt: t.name, draggable: "false" })])
      )
    );
  }

  function about(c) {
    const a = c.about;
    $("#aboutCopy").replaceChildren(
      h("p", { class: "lead", html: format(a.lead) }),
      ...a.paragraphs.map((p) => h("p", { html: format(p) }))
    );
    $("#stats").replaceChildren(
      ...a.stats.map((s) =>
        h("div", { class: "stat tilt reveal" }, [
          h("b", { "data-count": s.value, "data-decimals": s.decimals || 0, text: "0" }),
          h("span", { text: s.suffix || "" }),
          h("p", { html: format(s.label) }),
        ])
      ),
      // 2x2 grid of small coloured tiles in the last slot
      a.mini && a.mini.length &&
        h("div", { class: "stat-mini reveal" },
          a.mini.slice(0, 4).map((m) =>
            h("div", { class: `mini mini-${m.tone || "purple"}` }, [
              h("b", { text: m.value }),
              h("span", { html: format(m.label) }),
            ])
          )
        )
    );
  }

  /* ---------- Project visuals ---------- */
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

  const VISUALS = { terminal: terminalVisual, paper: paperVisual, image: imageVisual, notify: notifyVisual };

  /* One vertical carousel card per project in content.js: visual on top, text below. */
  function projectCard(item, linkLabel) {
    const makeVisual = (item.visual && VISUALS[item.visual.type]) || placeholderVisual;
    return h("article", { class: "project", "data-glow": true }, [
      h("div", { class: "project-visual" }, [makeVisual(item.visual, item)]),
      h("div", { class: "project-body" }, [
        item.kicker && h("p", { class: "project-kicker", text: item.kicker }),
        h("h3", { text: item.name }),
        item.summary && h("p", { class: "project-summary", html: format(item.summary) }),
        item.tags && tags(item.tags),
        item.link && h("a", { class: "link-arrow", href: item.link, ...external(item.link), html: escape(linkLabel) + " " + ARROW_RIGHT_UP }),
      ]),
    ]);
  }

  function projects(c) {
    const { items, linkLabel } = c.projects;
    $("#projectTrack").replaceChildren(...items.map((item) => projectCard(item, linkLabel)));
  }

  function experience(c) {
    $("#timeline").replaceChildren(
      ...c.experience.items.map((item) => {
        const title = item.org
          ? `${escape(item.role)} <small>· ${escape(item.org)}</small>`
          : escape(item.role);
        return h("div", { class: "tl-item reveal" }, [
          h("div", { class: "tl-dot" }),
          h("div", { class: "tl-card tilt", "data-glow": true }, [
            h("div", { class: "tl-meta", html: `<span>${escape(item.meta)}</span>${item.chip ? `<span class="chip">${escape(item.chip)}</span>` : ""}` }),
            h("h3", { html: title }),
            item.description && h("p", { class: "muted", html: format(item.description) }),
            item.bullets && bullets(item.bullets),
            item.tags && tags(item.tags),
            item.links && h("div", { class: "tl-links" }, item.links.map((l) =>
              h("a", { class: "link-arrow", href: l.href, ...external(l.href), html: escape(l.label) + " " + ARROW_RIGHT_UP })
            )),
          ]),
        ]);
      })
    );
  }

  function skills(c) {
    $("#toolkit").replaceChildren(
      ...c.skills.groups.map((g) =>
        h("div", { class: "tk-row" }, [
          h("div", { class: "tk-label" }, [
            h("span", { class: "skill-icon", html: `<svg viewBox="0 0 24 24">${ICONS[g.icon] || ICONS.code}</svg>` }),
            h("h3", { text: g.title }),
          ]),
          h("div", { class: "pills" }, g.items.map((t) => h("span", { text: t }))),
        ])
      )
    );
  }

  function contact(c) {
    const ct = c.contact;
    const mail = $("#contactMail");
    mail.href = "mailto:" + ct.email;
    mail.textContent = ct.email;
    $("#socials").replaceChildren(
      ...ct.links.map((l) => h("a", { href: l.href, class: "magnetic", ...external(l.href), text: l.label }))
    );
  }

  function footer(c) {
    $("#footerText").textContent = `© ${new Date().getFullYear()} ${c.footer.text}`;
  }

  /* "and much more..." -> text + three animated trailing dots */
  function moreNote(c) {
    const el = $(".tk-more");
    const text = c.skills && c.skills.more;
    if (!el || !text) return;
    const m = String(text).match(/^(.*?)(\.{2,}|…)\s*$/);
    if (!m) return; // no trailing dots: leave the plain text as is
    el.innerHTML = `${format(m[1])}<span class="dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>`;
    el.setAttribute("aria-label", m[1] + "...");
  }

  function all(c) {
    meta(c);
    nav(c);
    headings(c);
    slots(c);
    hero(c);
    about(c);
    projects(c);
    experience(c);
    skills(c);
    moreNote(c);
    contact(c);
    footer(c);
  }

  App.render = { all };
})();
