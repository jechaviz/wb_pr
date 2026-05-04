(() => {
  const pickVisible = (elements) => {
    for (const el of elements) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 8 && r.height > 8) return el;
    }
    return null;
  };

  const selectors = [
    'a[href*="/product/"]',
    'a[href*="/products/"]',
    'a[href*="product-detail"]',
    '.product-item a[href]',
    '.tp-product-item a[href]',
    '.product-grid a[href]'
  ];

  let target = null;
  for (const sel of selectors) {
    target = pickVisible([...document.querySelectorAll(sel)]);
    if (target) break;
  }

  if (!target) {
    const allLinks = [...document.querySelectorAll('a[href]')].filter((a) => /product/i.test(a.getAttribute('href') || ''));
    target = pickVisible(allLinks);
  }

  if (target) {
    const href = target.href || target.getAttribute('href') || '';
    target.click();
    return JSON.stringify({ ok: true, action: 'click_product_link', href });
  }

  const fallback = new URL(location.href);
  fallback.pathname = '/product-detail';
  location.href = fallback.toString();
  return JSON.stringify({ ok: false, action: 'fallback_product_detail', href: fallback.toString() });
})();