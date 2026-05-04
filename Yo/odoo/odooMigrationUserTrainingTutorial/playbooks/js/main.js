(() => {
  const q = (sel) => document.querySelector(sel);
  const hasLogin = !!q('input[name="login"], input[type="email"]');
  const hasPassword = !!q('input[name="password"], input[type="password"]');
  const nav = Array.from(document.querySelectorAll("a,button"))
    .slice(0, 50)
    .map((el) => (el.innerText || "").trim())
    .filter(Boolean)
    .slice(0, 12);

  return JSON.stringify({
    ok: true,
    visited_at: new Date().toISOString(),
    href: location.href,
    title: document.title,
    ready_state: document.readyState,
    has_login_input: hasLogin,
    has_password_input: hasPassword,
    top_labels: nav,
  });
})();
