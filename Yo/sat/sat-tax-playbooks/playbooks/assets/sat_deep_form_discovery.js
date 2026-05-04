(() => {
  const mode = String("${SAT_DEEP_MODE}" || "").trim().toLowerCase();
  const target = String("${SAT_DEEP_TARGET}" || "").trim();

  const norm = (v) => String(v == null ? "" : v).replace(/\s+/g, " ").trim();
  const fold = (v) => {
    const t = norm(v);
    try {
      return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    } catch (_) {
      return t.toLowerCase();
    }
  };
  const vis = (e) => {
    if (!e) return false;
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0";
  };

  const clickables = () =>
    Array.from(document.querySelectorAll("a,button,input[type=button],input[type=submit],[role=button],[role=tab]"))
      .filter((e) => vis(e))
      .map((e) => ({
        el: e,
        tag: String((e.tagName || "").toLowerCase()),
        id: String(e.id || ""),
        text: norm(e.innerText || e.textContent || e.value || e.getAttribute("aria-label") || ""),
        folded: fold(e.innerText || e.textContent || e.value || e.getAttribute("aria-label") || "")
      }))
      .filter((x) => x.text.length > 0 || x.id.length > 0);

  const matchScore = (textFolded, rawTarget) => {
    const t = fold(rawTarget);
    if (!t) return 0;
    if (textFolded === t) return 120;
    if (textFolded.includes(t)) return 100;
    const words = t.split(" ").filter((w) => w.length >= 3);
    if (!words.length) return 0;
    let hits = 0;
    for (const w of words) if (textFolded.includes(w)) hits += 1;
    if (!hits) return 0;
    return Math.floor((hits / words.length) * 80);
  };

  const clickElement = (el) => {
    if (!el) return { ok: true, clicked: false, reason: "element_not_found" };
    try {
      el.scrollIntoView({ block: "center", inline: "center" });
    } catch (_) {}
    try {
      el.click();
      return { ok: true, clicked: true };
    } catch (e) {
      return { ok: true, clicked: false, reason: "click_failed", error: String((e && e.message) || e || "click_failed") };
    }
  };

  const isDisabled = (el) => {
    if (!el) return false;
    const cls = String(el.className || "").toLowerCase();
    return !!el.disabled || el.getAttribute("disabled") != null || el.getAttribute("aria-disabled") === "true" || /\bdisabled\b/.test(cls);
  };

  const describe = (el, fallbackText) => ({
    tag: String((el && el.tagName) ? el.tagName.toLowerCase() : ""),
    id: String((el && el.id) || ""),
    text: norm((el && (el.innerText || el.textContent || el.value)) || fallbackText || ""),
    href: String((el && el.href) || ""),
    disabled: isDisabled(el),
    visible: !!(el && vis(el))
  });

  const isSummarySurface = () => {
    const byPreview = document.querySelector("#btnVistaPrevia");
    const bySubmit = document.querySelector("#btnEnviaDec");
    const items = clickables();
    const previewLike = items.filter((x) => x.id === "btnvistaprevia" || x.folded.includes("vista previa"));
    const submitLike = items.filter((x) => x.id === "btnenviadec" || x.folded.includes("enviar declaracion") || x.folded === "enviar");
    const previewEl = (byPreview && vis(byPreview)) ? byPreview : (previewLike.length ? previewLike[0].el : null);
    const submitEl = (bySubmit && vis(bySubmit)) ? bySubmit : (submitLike.length ? submitLike[0].el : null);
    return {
      has_preview_button: !!previewEl,
      has_submit_button: !!submitEl,
      preview: previewEl ? describe(previewEl) : {},
      submit: submitEl ? describe(submitEl) : {},
      visible_labels: items.map((x) => x.text).slice(0, 80)
    };
  };

  const modalButtons = () => {
    const dialogs = Array.from(document.querySelectorAll(".modal.show,.bootbox.modal,[role='dialog']")).filter((d) => vis(d));
    const rows = [];
    dialogs.forEach((d, idx) => {
      const text = norm(d.innerText || d.textContent || "");
      const folded = fold(text);
      const btns = Array.from(d.querySelectorAll("button,a,input[type=button],input[type=submit]"))
        .filter((b) => vis(b))
        .map((b) => {
          const txt = norm(b.innerText || b.textContent || b.value || "");
          return {
            el: b,
            dialog_index: idx,
            dialog_text: text,
            dialog_folded: folded,
            text: txt,
            folded: fold(txt),
            id: String(b.id || ""),
            tag: String((b.tagName || "").toLowerCase()),
            href: String(b.href || ""),
            disabled: isDisabled(b)
          };
        });
      rows.push({ index: idx, text, folded, buttons: btns });
    });
    return rows;
  };

  const confirmScore = (txtFolded, href) => {
    let s = 0;
    const t = txtFolded;
    if (t === "si") s = 120;
    else if (t === "aceptar") s = 110;
    else if (t === "confirmar") s = 105;
    else if (t === "continuar") s = 100;
    else if (t === "enviar") s = 95;
    else if (t.includes("si")) s = 80;
    else if (t.includes("acept")) s = 70;
    else if (t.includes("confirm")) s = 65;
    else if (t.includes("continu")) s = 60;
    if (t.includes("cerrar") || t.includes("cancel") || t.includes("regresar") || t === "no") s = -30;
    if (/acuse\.pdf|pdf\/acuse/i.test(String(href || ""))) s += 12;
    return s;
  };

  const probeSubmitModal = () => {
    const dialogs = modalButtons();
    const packed = dialogs.map((d) => ({
      index: d.index,
      text: d.text.slice(0, 2000),
      buttons: d.buttons.map((b) => ({
        text: b.text,
        id: b.id,
        tag: b.tag,
        href: b.href,
        disabled: b.disabled
      })).slice(0, 30)
    }));
    const allText = dialogs.map((d) => d.folded).join(" ");
    const confirmButtons = dialogs
      .flatMap((d) => d.buttons)
      .map((b) => ({ ...b, score: confirmScore(b.folded, b.href) }))
      .filter((b) => b.score > 0)
      .sort((a, b) => b.score - a.score);
    const hasValidationError =
      allText.includes("fallo al validar") ||
      allText.includes("favor de ingresar a cada concepto") ||
      allText.includes("contiene datos guardados") ||
      allText.includes("debe haber al menos un registro");
    return {
      ok: true,
      url: location.href || "",
      dialogs: packed,
      has_prellenado: allText.includes("prellenado"),
      has_loading: allText.includes("cargando informacion") || allText.includes("espera por favor"),
      has_close_button: dialogs.flatMap((d) => d.buttons).some((b) => /cerrar/.test(b.folded)),
      has_confirm_button: confirmButtons.length > 0,
      has_validation_error: hasValidationError,
      confirm_candidates: confirmButtons.slice(0, 8).map((b) => ({
        dialog_index: b.dialog_index,
        text: b.text,
        id: b.id,
        tag: b.tag,
        href: b.href,
        score: b.score
      }))
    };
  };

  if (mode === "probe_submit_surface") {
    const s = isSummarySurface();
    return { ok: true, mode, url: location.href || "", ...s };
  }

  if (mode === "ensure_summary_view") {
    const s = isSummarySurface();
    if (s.has_preview_button && s.has_submit_button) {
      return { ok: true, mode, clicked: false, reason: "already_on_summary", url: location.href || "", ...s };
    }

    const ranked = [];
    const dialogRows = modalButtons();
    dialogRows.forEach((d) => {
      d.buttons.forEach((b) => {
        if (b.disabled) return;
        if (b.folded === "cerrar") ranked.push({ el: b.el, score: 180, reason: "modal_close_button" });
        else if (b.folded.includes("cerrar") || b.folded === "aceptar" || b.folded === "ok") ranked.push({ el: b.el, score: 170, reason: "modal_close_fallback" });
      });
    });

    clickables().forEach((x) => {
      if (x.tag === "button" && x.folded === "cerrar") ranked.push({ el: x.el, score: 160, reason: "panel_close_button" });
      else if (x.tag === "button" && x.folded.includes("cerrar")) ranked.push({ el: x.el, score: 150, reason: "panel_close_fallback" });
    });

    const byInstrId = document.querySelector("#instrucciones-seccion");
    if (byInstrId && vis(byInstrId)) ranked.push({ el: byInstrId, score: 130, reason: "instrucciones_id" });
    const byAdminId = document.querySelector("#ir-menu-principal");
    if (byAdminId && vis(byAdminId)) ranked.push({ el: byAdminId, score: 70, reason: "admin_id_fallback" });
    clickables().forEach((x) => {
      let score = 0;
      if (x.folded === "instrucciones") score = 120;
      else if (x.folded.includes("instrucciones")) score = 100;
      else if (x.folded === "administracion de la declaracion") score = 65;
      if (score > 0) ranked.push({ el: x.el, score, reason: "text_match" });
    });

    ranked.sort((a, b) => b.score - a.score);
    if (!ranked.length) {
      return { ok: true, mode, clicked: false, reason: "summary_entry_not_found", url: location.href || "", ...s };
    }
    const pick = ranked[0];
    const c = clickElement(pick.el);
    return {
      ok: true,
      mode,
      clicked: !!c.clicked,
      reason: c.reason || pick.reason || "",
      clicked_text: norm(pick.el.innerText || pick.el.textContent || pick.el.value || ""),
      url: location.href || "",
      ...s
    };
  }

  if (mode === "click_preview_button") {
    const byId = document.querySelector("#btnVistaPrevia");
    const items = clickables();
    const fallback = items.find((x) => x.id.toLowerCase() === "btnvistaprevia") || items.find((x) => x.folded.includes("vista previa"));
    const el = (byId && vis(byId)) ? byId : (fallback ? fallback.el : null);
    if (!el) return { ok: true, mode, clicked: false, reason: "preview_not_found", url: location.href || "", ...isSummarySurface() };
    const c = clickElement(el);
    return { ok: true, mode, clicked: !!c.clicked, reason: c.reason || "", ...describe(el), url: location.href || "" };
  }

  if (mode === "click_submit_button") {
    const byId = document.querySelector("#btnEnviaDec");
    const items = clickables();
    const fallback = items.find((x) => x.id.toLowerCase() === "btnenviadec") || items.find((x) => x.folded.includes("enviar declaracion") || x.folded === "enviar");
    const el = (byId && vis(byId)) ? byId : (fallback ? fallback.el : null);
    if (!el) return { ok: true, mode, clicked: false, reason: "submit_not_found", url: location.href || "", ...isSummarySurface() };
    const c = clickElement(el);
    return { ok: true, mode, clicked: !!c.clicked, reason: c.reason || "", ...describe(el), url: location.href || "" };
  }

  if (mode === "probe_submit_modal") {
    const p = probeSubmitModal();
    return { ...p, mode };
  }

  if (mode === "click_modal_confirm") {
    const dialogs = modalButtons();
    const ranked = dialogs
      .flatMap((d) => d.buttons)
      .map((b) => ({ ...b, score: confirmScore(b.folded, b.href) }))
      .filter((b) => b.score > 0 && !b.disabled)
      .sort((a, b) => b.score - a.score);
    if (!ranked.length) {
      return { ok: true, mode, clicked: false, reason: "confirm_button_not_found", url: location.href || "", probe: probeSubmitModal() };
    }
    const pick = ranked[0];
    const c = clickElement(pick.el);
    return {
      ok: true,
      mode,
      clicked: !!c.clicked,
      reason: c.reason || "",
      text: pick.text,
      id: pick.id,
      tag: pick.tag,
      href: pick.href,
      score: pick.score,
      dialog_index: pick.dialog_index,
      url: location.href || ""
    };
  }

  if (mode === "click_visible_acuse_link") {
    const links = Array.from(document.querySelectorAll("a[href*='acuse.pdf'],a[href*='pdf/acuse']")).map((a) => ({
      el: a,
      text: norm(a.innerText || a.textContent || ""),
      folded: fold(a.innerText || a.textContent || ""),
      href: String(a.href || ""),
      visible: vis(a),
      in_modal: !!a.closest(".modal.show,.bootbox.modal,[role='dialog']")
    }));
    const visible = links.filter((x) => x.visible);
    const ranked = visible
      .map((x) => {
        let s = 0;
        if (x.in_modal && (x.folded === "si" || x.folded.includes("si"))) s = 130;
        else if (x.folded.includes("descarg") || x.folded.includes("acuse")) s = 120;
        else if (x.folded.length > 0) s = 80;
        return { ...x, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    if (!ranked.length) {
      return {
        ok: true,
        mode,
        clicked: false,
        reason: "visible_acuse_link_not_found",
        any_links_count: links.length,
        visible_links_count: visible.length,
        url: location.href || ""
      };
    }
    const pick = ranked[0];
    const c = clickElement(pick.el);
    return {
      ok: true,
      mode,
      clicked: !!c.clicked,
      reason: c.reason || "",
      text: pick.text,
      href: pick.href,
      any_links_count: links.length,
      visible_links_count: visible.length,
      url: location.href || ""
    };
  }

  if (mode === "close_prellenado") {
    const dialogs = Array.from(document.querySelectorAll(".modal.show,.bootbox.modal,[role='dialog']")).filter((d) => vis(d));
    const modal = dialogs.find((d) => fold(d.innerText || d.textContent || "").includes("prellenado"));
    if (!modal) return { ok: true, mode, clicked: false, reason: "prellenado_not_visible", url: location.href || "" };
    const btn = Array.from(modal.querySelectorAll("button,a,input[type=button],input[type=submit]"))
      .filter((b) => vis(b))
      .find((b) => {
        const t = fold(b.innerText || b.textContent || b.value || "");
        return t.includes("cerrar") || t.includes("aceptar") || t === "ok";
      });
    if (!btn) return { ok: true, mode, clicked: false, reason: "close_button_not_found", url: location.href || "" };
    const c = clickElement(btn);
    return {
      ok: true,
      mode,
      clicked: !!c.clicked,
      reason: c.reason || "",
      button_text: norm(btn.innerText || btn.textContent || btn.value || ""),
      url: location.href || ""
    };
  }

  if (mode === "detect_concepts") {
    const items = clickables();
    const labels = items.map((x) => x.text);
    const folded = items.map((x) => x.folded);
    const hasIsrSalarios = folded.some((t) => t.includes("isr retenciones por salarios"));
    const hasIsrAsimilados = folded.some((t) => t.includes("isr retenciones por asimilados a salarios"));
    const hasIvaRetenciones = folded.some((t) => t.includes("iva retenciones"));
    return {
      ok: true,
      mode,
      url: location.href || "",
      has_isr_salarios: hasIsrSalarios,
      has_isr_asimilados: hasIsrAsimilados,
      has_iva_retenciones: hasIvaRetenciones,
      has_any_concepts: !!(hasIsrSalarios || hasIsrAsimilados || hasIvaRetenciones),
      visible_labels: labels.slice(0, 80)
    };
  }

  if (mode === "open_admin") {
    const currentItems = clickables();
    const currentFolded = currentItems.map((x) => x.folded);
    const hasConceptMenu =
      currentFolded.some((t) => t.includes("isr retenciones por salarios")) ||
      currentFolded.some((t) => t.includes("isr retenciones por asimilados a salarios")) ||
      currentFolded.some((t) => t.includes("iva retenciones"));
    if (hasConceptMenu) {
      return { ok: true, mode, clicked: false, reason: "already_on_concept_menu", url: location.href || "" };
    }

    const byId = document.querySelector("#ir-menu-principal");
    if (byId && vis(byId)) {
      const c = clickElement(byId);
      return { ok: true, mode, clicked: !!c.clicked, reason: c.reason || "", text: norm(byId.innerText || byId.textContent || ""), url: location.href || "" };
    }
    const candidates = clickables()
      .map((x) => {
        const t = x.folded;
        let s = 0;
        if (t === "administracion de la declaracion") s = 120;
        else if (t.includes("administracion de la declaracion")) s = 100;
        else if (t.includes("administracion") && t.includes("declaracion")) s = 80;
        return { ...x, s };
      })
      .filter((x) => x.s >= 80)
      .sort((a, b) => b.s - a.s);
    if (!candidates.length) return { ok: true, mode, clicked: false, reason: "admin_entry_not_found", url: location.href || "" };
    const pick = candidates[0];
    const c = clickElement(pick.el);
    return {
      ok: true,
      mode,
      clicked: !!c.clicked,
      reason: c.reason || "",
      text: pick.text,
      score: pick.s,
      url: location.href || ""
    };
  }

  if (mode === "click_target") {
    const candidates = clickables()
      .map((x) => ({ ...x, s: matchScore(x.folded, target) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    if (!candidates.length) {
      return {
        ok: true,
        mode,
        target,
        clicked: false,
        reason: "target_not_found",
        available_labels: clickables().map((x) => x.text).slice(0, 80),
        url: location.href || ""
      };
    }
    const pick = candidates[0];
    const c = clickElement(pick.el);
    return {
      ok: true,
      mode,
      target,
      clicked: !!c.clicked,
      reason: c.reason || "",
      score: pick.s,
      text: pick.text,
      id: pick.id,
      tag: pick.tag,
      url: location.href || ""
    };
  }

  if (mode === "click_tab") {
    const t = fold(target);
    const tabs = Array.from(document.querySelectorAll("a[id$='-tab'],button[id$='-tab'],[role='tab'],a,button"))
      .filter((e) => vis(e))
      .map((e) => ({
        el: e,
        id: String(e.id || ""),
        text: norm(e.innerText || e.textContent || e.value || ""),
        folded: fold(e.innerText || e.textContent || e.value || "")
      }))
      .map((x) => {
        const isLikelyTab = x.id.endsWith("-tab") || /tab/.test(x.id) || x.folded.includes("determinacion") || x.folded.includes("pago");
        const s = isLikelyTab ? matchScore(x.folded, t) : 0;
        return { ...x, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    if (!tabs.length) return { ok: true, mode, target, clicked: false, reason: "tab_not_found", url: location.href || "" };
    const pick = tabs[0];
    const c = clickElement(pick.el);
    return {
      ok: true,
      mode,
      target,
      clicked: !!c.clicked,
      reason: c.reason || "",
      text: pick.text,
      id: pick.id,
      score: pick.s,
      url: location.href || ""
    };
  }

  if (mode === "click_guardar_button") {
    const ranked = clickables()
      .map((x) => {
        const t = x.folded;
        let s = 0;
        if (x.tag === "button" && t === "guardar") s = 120;
        else if (x.tag === "button" && t.includes("guardar")) s = 100;
        else if (x.tag === "input" && t.includes("guardar")) s = 90;
        else if (t === "guardar") s = 70;
        else if (t.includes("guardar")) s = 60;
        if (t.includes("administracion de la declaracion")) s = -1;
        return { ...x, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    if (!ranked.length) return { ok: true, mode, clicked: false, reason: "guardar_not_found", url: location.href || "" };
    const pick = ranked[0];
    const c = clickElement(pick.el);
    return {
      ok: true,
      mode,
      clicked: !!c.clicked,
      reason: c.reason || "",
      text: pick.text,
      id: pick.id,
      tag: pick.tag,
      score: pick.s,
      url: location.href || ""
    };
  }

  if (mode === "probe_validation") {
    const body = fold((document.body && document.body.innerText) || "");
    const requiredSelectPending = Array.from(document.querySelectorAll("select"))
      .filter((e) => vis(e))
      .some((e) => {
        const required = !!e.required || fold(e.getAttribute("aria-required") || "") === "true";
        if (!required) return false;
        const i = e.selectedIndex;
        const txt = i >= 0 && e.options && e.options[i] ? fold(e.options[i].text || "") : "";
        const val = i >= 0 && e.options && e.options[i] ? fold(e.options[i].value || "") : "";
        return !txt || txt === "selecciona" || txt === "select" || txt === "elige" || val === "";
      });
    const hasValidation =
      body.includes("fallo al validar") ||
      body.includes("favor de ingresar a cada concepto") ||
      body.includes("verifique que entro a todas las secciones") ||
      body.includes("debe haber al menos un registro") ||
      requiredSelectPending;
    return {
      ok: true,
      mode,
      url: location.href || "",
      has_validation_blocker: hasValidation,
      required_select_pending: requiredSelectPending
    };
  }

  return {
    ok: true,
    mode,
    target,
    skipped: true,
    reason: "unknown_mode",
    url: location.href || ""
  };
})();
