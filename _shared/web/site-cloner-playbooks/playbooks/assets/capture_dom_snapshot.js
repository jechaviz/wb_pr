(() => {
  const toRect = (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height)
    };
  };

  const textOf = (el) => {
    const raw = (el.innerText || el.textContent || el.value || el.getAttribute("aria-label") || "").trim();
    return raw.slice(0, 200);
  };

  const selectors = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "summary",
    "[role='button']",
    "[role='link']",
    "[onclick]",
    "[tabindex]:not([tabindex='-1'])"
  ];

  const nodes = Array.from(document.querySelectorAll(selectors.join(","))).filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  });

  const interactives = nodes.map((el, idx) => ({
    id: idx + 1,
    tag: (el.tagName || "").toLowerCase(),
    text: textOf(el),
    href: el.getAttribute ? (el.getAttribute("href") || "") : "",
    role: el.getAttribute ? (el.getAttribute("role") || "") : "",
    rect: toRect(el)
  }));

  return {
    ok: true,
    url: location.href,
    title: document.title || "",
    viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 },
    interactives
  };
})();
