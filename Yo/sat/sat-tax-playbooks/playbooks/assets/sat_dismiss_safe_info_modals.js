(() => {
  const norm = (v) => String(v == null ? "" : v).replace(/\s+/g, " ").trim();
  const fold = (v) => {
    const t = norm(v);
    try {
      return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    } catch (_) {
      return t.toLowerCase();
    }
  };
  const clip = (v, n) => {
    const t = norm(v);
    return t.length <= n ? t : t.slice(0, Math.max(0, n - 3)) + "...";
  };
  const visible = (e) => {
    if (!e) return false;
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0";
  };
  const textOf = (e) => norm(e && (e.innerText || e.textContent || e.value || e.getAttribute("aria-label")) || "");
  const modalText = (m) => fold(`${m.id || ""} ${m.className || ""} ${m.innerText || m.textContent || ""}`);
  const allowedButton = (b) => /^(cerrar|aceptar|entendido|ok)$/i.test(norm(textOf(b)));
  const dangerous = (text) =>
    /(cantidad a pagar|total a pagar|desea continuar|enviar declaracion|enviar declaración|confirmar|linea de captura|línea de captura|acuse|pago referenciado|firma|efirma|e\.firma|decreto|relocalizacion|relocalización|credito fiscal|crédito fiscal|podebi|zona de desastre|no es aplicable|fallo|error|validacion|validación)/i.test(text);
  const safeInfo = (text) =>
    /(modalprellenado|modalinstrucciones|cuadromodalinstrucciones|modal-ayuda|para el prellenado|prellenado de tu declaracion|prellenado de tu declaración|instrucciones|formularios no enviados|continua con la captura|continúa con la captura|navegador.*no es compatible|sesion.*punto de expirar|sesión.*punto de expirar)/i.test(text);

  const dialogs = Array.from(document.querySelectorAll(".modal,.bootbox,.swal2-container,[role='dialog']"))
    .filter(visible)
    .slice(0, 20);
  const clicked = [];
  const blocked = [];

  for (const modal of dialogs) {
    const text = modalText(modal);
    const buttons = Array.from(modal.querySelectorAll("button,a,input[type=button],input[type=submit]")).filter(visible);
    const button = buttons.find(allowedButton);
    const item = {
      id: String(modal.id || ""),
      text: clip(textOf(modal), 240),
      buttons: buttons.map(textOf).filter(Boolean).slice(0, 8)
    };

    if (!safeInfo(text) || dangerous(text) || !button) {
      blocked.push({ ...item, reason: !button ? "no_allowed_button" : dangerous(text) ? "dangerous_or_error_text" : "not_known_info_modal" });
      continue;
    }

    try {
      button.click();
      clicked.push({ ...item, clicked_button: textOf(button) });
    } catch (e) {
      blocked.push({ ...item, reason: "click_failed", error: String((e && e.message) || e || "click_failed") });
    }
  }

  return {
    ok: true,
    mode: "sat_dismiss_safe_info_modals",
    url: location.href || "",
    visible_dialog_count: dialogs.length,
    clicked_count: clicked.length,
    blocked_count: blocked.length,
    clicked,
    blocked
  };
})();
