/* Builds every text-bearing part of the page from window.CONTENT. */
(() => {
  const { $, $$, format, get, h, escape } = App.utils;

  const tags = (list) => h("div", { class: "tags" }, (list || []).map((t) => h("span", { text: t })));
  const bullets = (list) => h("ul", { class: "bullets" }, (list || []).map((b) => h("li", { html: format(b) })));
  const external = (href) => (/^https?:/.test(href) ? { target: "_blank", rel: "noopener" } : {});

  /* ---------- Simple slots: <el data-slot="path.to.value"> ---------- */
  function slots(c) {
    $$("[data-slot]").forEach((el) => {
      const key = el.dataset.slot;
      if (key === "brand") {
        el.innerHTML = `<span class="brand-word">${escape(c.brand.first)}</span><b>.</b><span class="brand-word">${escape(c.brand.last)}</span>`;
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

  /* Side slider stops: one for the top of the page, then one per nav section. */
  function nav(c) {
    const items = [{ id: "top", label: "Home" }, ...c.nav];
    $("#railStops").replaceChildren(
      ...items.map((item) =>
        h("a", { class: "rail-stop", href: "#" + item.id, "data-target": item.id, "aria-label": item.label }, [
          h("span", { class: "rail-label", text: item.label }),
        ])
      )
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

  /* One vertical carousel card per project in content.js: visual on top, text below. */
  function projectCard(item, linkLabel) {
    const makeVisual = (item.visual && App.visuals[item.visual.type]) || App.visuals.placeholder;
    return h("article", { class: "project", "data-glow": true }, [
      h("div", { class: "project-visual" }, [makeVisual(item.visual, item)]),
      h("div", { class: "project-body" }, [
        item.kicker && h("p", { class: "project-kicker", text: item.kicker }),
        h("h3", { text: item.name }),
        item.summary && h("p", { class: "project-summary", html: format(item.summary) }),
        item.tags && tags(item.tags),
        item.link && h("a", { class: "link-arrow", href: item.link, ...external(item.link), html: escape(linkLabel) + " " + App.icons.arrowUpRight }),
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
              h("a", { class: "link-arrow", href: l.href, ...external(l.href), html: escape(l.label) + " " + App.icons.arrowUpRight })
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
            h("span", { class: "skill-icon", html: `<svg viewBox="0 0 24 24">${App.icons.skills[g.icon] || App.icons.skills.code}</svg>` }),
            h("h3", { text: g.title }),
          ]),
          h("div", { class: "pills" }, g.items.map((t) => h("span", { text: t }))),
        ])
      )
    );
  }

  function navContacts(c) {
    const ct = c.contact;
    const items = [...ct.links, { label: "Email", href: "mailto:" + ct.email }];
    $("#navContacts").replaceChildren(
      ...items.map((l) =>
        h("a", { href: l.href, class: "nav-contact", "aria-label": l.label, title: l.label, ...external(l.href) }, [
          h("span", { class: "nav-contact-icon", html: App.icons.contact[l.label.toLowerCase()] || "" }),
          h("span", { class: "nav-contact-label", text: l.label }),
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
      ...ct.links.map((l) => h("a", { href: l.href, ...external(l.href), text: l.label }))
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
    navContacts(c);
    footer(c);
  }

  App.render = { all };
})();
