(() => {
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

  document.querySelectorAll('.waiba-som-mark').forEach((n) => n.remove());

  const marks = [];
  nodes.forEach((el, i) => {
    const id = i + 1;
    const rect = el.getBoundingClientRect();

    const mark = document.createElement('div');
    mark.className = 'waiba-som-mark';
    mark.textContent = String(id);
    mark.style.position = 'fixed';
    mark.style.left = Math.max(0, rect.left) + 'px';
    mark.style.top = Math.max(0, rect.top - 16) + 'px';
    mark.style.zIndex = '2147483647';
    mark.style.pointerEvents = 'none';
    mark.style.background = '#111827';
    mark.style.color = '#fff';
    mark.style.font = '700 10px/1.2 sans-serif';
    mark.style.padding = '1px 5px';
    mark.style.borderRadius = '999px';
    mark.style.boxShadow = '0 1px 3px rgba(0,0,0,.35)';
    document.body.appendChild(mark);

    marks.push({
      id,
      tag: (el.tagName || '').toLowerCase(),
      text: (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 180),
      rect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        w: Math.round(rect.width),
        h: Math.round(rect.height)
      }
    });
  });

  return {
    ok: true,
    url: location.href,
    count: marks.length,
    marks
  };
})();
