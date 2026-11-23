/* Animated agent log shown in terminal-style project visuals. */
(() => {
  const { escape } = App.utils;
  const CLASS = { user: "t-u", step: "t-p", tool: "t-b", ok: "t-ok" };
  const started = new WeakSet();

  /* Colours the line's label: everything up to the first colon, or the first two words. */
  function renderLine([type, text]) {
    text = String(text);
    const colon = text.indexOf(":");
    const words = text.split(" ");
    const cut = colon > -1 && colon < 12 ? colon + 1 : words.slice(0, 2).join(" ").length;
    return `<span class="${CLASS[type] || ""}">${escape(text.slice(0, cut))}</span>${escape(text.slice(cut))}`;
  }

  function play(pre, lines) {
    if (started.has(pre) || !lines || !lines.length) return;
    started.add(pre);
    let i = 0;
    const next = () => {
      if (i >= lines.length) {
        setTimeout(() => { pre.innerHTML = ""; i = 0; next(); }, 4500);
        return;
      }
      pre.innerHTML += renderLine(lines[i++]) + "\n";
      setTimeout(next, 550 + Math.random() * 250);
    };
    next();
  }

  App.terminal = { play };
})();
