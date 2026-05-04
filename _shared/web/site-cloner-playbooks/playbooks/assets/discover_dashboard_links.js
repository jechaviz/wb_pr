(() => {
  const terms = ['dashboard', 'account', 'profile', 'vendor', 'admin', 'customer', 'seller'];
  const urls = [];
  const seen = new Set();

  const pushUrl = (raw) => {
    if (!raw) return;
    let href = '';
    try {
      href = new URL(raw, location.href).toString();
    } catch {
      return;
    }
    if (seen.has(href)) return;
    const low = href.toLowerCase();
    if (!terms.some((t) => low.includes(t))) return;
    seen.add(href);
    urls.push(href);
  };

  document.querySelectorAll('a[href]').forEach((a) => pushUrl(a.getAttribute('href')));

  const hardCandidates = [
    '/login',
    '/register',
    '/customer/overview',
    '/customer/dashboard',
    '/customer/orders',
    '/vendor/dashboard',
    '/vendor/register',
    '/vendor/login',
    '/admin',
    '/admin/login',
    '/admin/dashboard'
  ];
  hardCandidates.forEach((p) => pushUrl(p));

  return JSON.stringify({
    ok: true,
    count: urls.length,
    urls: urls.slice(0, 30)
  });
})();