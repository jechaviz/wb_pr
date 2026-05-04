(() => {
  const out = [];
  const seen = new Set();

  const push = (raw, hint = "") => {
    if (!raw) return;
    let abs = "";
    try {
      abs = new URL(raw, location.href).toString();
    } catch {
      return;
    }
    if (seen.has(abs)) return;
    seen.add(abs);
    out.push({ src: abs, hint });
  };

  document.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || img.getAttribute("data-src") || img.currentSrc || "";
    const alt = img.getAttribute("alt") || "";
    push(src, alt);
  });

  document.querySelectorAll("[style*='background-image']").forEach((el) => {
    const style = el.getAttribute("style") || "";
    const m = style.match(/url\((['"]?)(.*?)\1\)/i);
    if (m && m[2]) push(m[2], "background");
  });

  return JSON.stringify({
    ok: true,
    url: location.href,
    count: out.length,
    images: out.slice(0, 500)
  });
})();

