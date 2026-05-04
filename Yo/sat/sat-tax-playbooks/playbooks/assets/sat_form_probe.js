(() => {
  const norm = (v) => (v == null ? "" : String(v)).replace(/\s+/g, " ").trim();
  const clip = (v, n = 2000) => {
    const t = norm(v);
    if (t.length <= n) return t;
    return t.slice(0, n - 3) + "...";
  };
  const visible = (e) => {
    if (!e) return false;
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };

  const candidates = Array.from(
    document.querySelectorAll("a,button,input[type=button],input[type=submit],[role=button]")
  )
    .map((e) => ({
      tag: (e.tagName || "").toLowerCase(),
      id: e.id || "",
      name: e.name || "",
      href: e.href || e.getAttribute("href") || "",
      text: norm(e.innerText || e.value || e.getAttribute("aria-label") || "").slice(0, 180),
      visible: visible(e)
    }))
    .filter((x) => x.text || x.id || x.href)
    .slice(0, 220);

  const txt = norm(document.body?.innerText || "");
  const zeroHints = (txt.match(/\$\s*0\b/g) || []).length;
  const hasVistaPrevia = candidates.some((c) => /vista\s+previa/i.test(c.text));
  const hasEnviar = candidates.some((c) => /enviar\s+declar/i.test(c.text));
  const hasCapturar = candidates.some((c) => /capturar/i.test(c.text));

  const inputs = Array.from(document.querySelectorAll("input,textarea,select"))
    .map((e) => ({
      tag: (e.tagName || "").toLowerCase(),
      type: e.type || "",
      id: e.id || "",
      name: e.name || "",
      value: norm(e.value || "").slice(0, 120),
      visible: visible(e)
    }))
    .filter((i) => i.visible || /importe|monto|cantidad|base|tasa|total/i.test(`${i.id} ${i.name}`))
    .slice(0, 180);

  return {
    ok: true,
    timestamp: new Date().toISOString(),
    url: location.href,
    title: document.title || "",
    has_vista_previa: hasVistaPrevia,
    has_enviar_declaracion: hasEnviar,
    has_capturar: hasCapturar,
    zero_hints: zeroHints,
    clickable: candidates,
    inputs,
    body_text_preview: clip(txt, 2400)
  };
})();

