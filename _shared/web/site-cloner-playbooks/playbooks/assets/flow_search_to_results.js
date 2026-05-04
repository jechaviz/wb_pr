(() => {
  const query = "watch";
  const norm = (s) => (s || "").toLowerCase();
  const pick = (list) => {
    for (const el of list) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 4 && r.height > 4) return el;
    }
    return null;
  };

  const candidates = [
    ...document.querySelectorAll('input[type="search"]'),
    ...document.querySelectorAll('input[name*="search" i]'),
    ...document.querySelectorAll('input[placeholder*="search" i]'),
    ...document.querySelectorAll('input[id*="search" i]')
  ];

  const input = pick(candidates);
  let action = "";

  if (input) {
    input.focus();
    input.value = query;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    const form = input.closest("form");
    if (form) {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      try { form.submit(); } catch {}
      action = "submit_form";
    } else {
      const btns = [
        ...document.querySelectorAll('button[type="submit"]'),
        ...document.querySelectorAll('button[aria-label*="search" i]'),
        ...document.querySelectorAll('button[class*="search" i]')
      ];
      const btn = pick(btns);
      if (btn) {
        btn.click();
        action = "click_search_button";
      }
    }
  }

  if (!action) {
    const next = new URL(location.href);
    next.pathname = "/products-grid";
    next.searchParams.set("q", query);
    location.href = next.toString();
    action = "fallback_products_grid";
  }

  return JSON.stringify({
    ok: true,
    action,
    query,
    url_before: location.href
  });
})();