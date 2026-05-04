(() => {
  const hasText = (el, txt) => ((el && el.textContent) ? el.textContent.toLowerCase().includes(txt) : false);
  const visible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 6 && r.height > 6;
  };

  const clickFirst = (selector, textFilter = '') => {
    for (const el of document.querySelectorAll(selector)) {
      if (!visible(el)) continue;
      if (textFilter && !hasText(el, textFilter)) continue;
      el.click();
      return true;
    }
    return false;
  };

  let action = 'none';

  const addClicked =
    clickFirst('button', 'add to cart') ||
    clickFirst('a', 'add to cart') ||
    clickFirst('button[class*="cart" i]') ||
    clickFirst('a[class*="cart" i]');

  if (addClicked) action = 'add_to_cart_clicked';

  const cartClicked =
    clickFirst('a[href*="/cart"]') ||
    clickFirst('button', 'cart') ||
    clickFirst('a', 'cart');

  if (cartClicked) action += '|go_cart';

  if (!cartClicked) {
    const next = new URL(location.href);
    next.pathname = '/cart';
    location.href = next.toString();
    action += '|fallback_cart';
  }

  return JSON.stringify({ ok: true, action, url: location.href });
})();