(() => {
  const cfg = {
    label: String("${SAT_SAFE_STATE_LABEL}" || "safe_state").trim() || "safe_state",
    targetYear: String("${SAT_TARGET_YEAR}" || "").trim(),
    targetMonth: String("${SAT_TARGET_MONTH}" || "").trim(),
    includeBodyPreview: toBool("${SAT_SAFE_STATE_INCLUDE_BODY_PREVIEW}", false),
    expectZero: toBool("${SAT_EXPECT_ZERO_DECLARATION}", false),
    allowNonZeroAmounts: toBool("${SAT_SUBMIT_ALLOW_NONZERO_AMOUNTS}", false)
  };

  function toBool(value, fallback) {
    const s = String(value == null ? "" : value).trim().toLowerCase();
    if (["1", "true", "yes", "y", "si", "on"].includes(s)) return true;
    if (["0", "false", "no", "n", "off"].includes(s)) return false;
    return !!fallback;
  }

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
  const safeUrl = (raw) => {
    const text = String(raw || "");
    try {
      const u = new URL(text, location.origin);
      return u.origin + u.pathname;
    } catch (_) {
      return text.split("#")[0].split("?")[0];
    }
  };
  const redact = (v) => {
    let t = norm(v);
    t = t.replace(/[A-Z&\u00d1]{3,4}\d{6}[A-Z0-9]{3}/gi, "[RFC]");
    t = t.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL]");
    t = t.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "[UUID]");
    t = t.replace(/\b(?:bearer|token|session|cookie|authorization)\s*[:=]\s*\S+/gi, "[SECRET]");
    t = t.replace(/\b(?:password|contrasena|ciec|clave|captcha)\s*[:=]\s*\S+/gi, "[SECRET]");
    t = t.replace(/\$\s*[-+]?\d[\d,]*(?:\.\d+)?/g, "[AMOUNT]");
    t = t.replace(/\b\d{8,}\b/g, "[NUMBER]");
    return t;
  };
  const visible = (e) => {
    if (!e) return false;
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0";
  };
  const disabled = (e) => {
    if (!e) return false;
    const cls = String(e.className || "").toLowerCase();
    return !!e.disabled || e.getAttribute("disabled") != null || e.getAttribute("aria-disabled") === "true" || /\bdisabled\b/.test(cls);
  };
  const selectorOf = (e) => {
    if (!e) return "";
    const tag = String((e.tagName || "").toLowerCase());
    if (e.id) return "#" + String(e.id);
    if (e.name) return tag + "[name='" + String(e.name).replace(/'/g, "\\'") + "']";
    return tag;
  };
  const labelFor = (e) => {
    if (!e) return "";
    const id = String(e.id || "");
    if (id) {
      const lb = document.querySelector("label[for='" + id.replace(/'/g, "\\'") + "']");
      if (lb) return redact(lb.innerText || lb.textContent || "");
    }
    const parent = e.closest("label");
    if (parent) return redact(parent.innerText || parent.textContent || "");
    return redact(e.getAttribute("aria-label") || e.getAttribute("placeholder") || "");
  };
  const numericState = (value) => {
    const raw = norm(value);
    if (!raw) return "empty";
    const cleaned = raw.replace(/\s/g, "").replace(/\$/g, "").replace(/,/g, "").replace(/%$/, "");
    if (!/^-?\d+(?:\.\d+)?$/.test(cleaned)) return "present";
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return "present";
    return Math.abs(n) === 0 ? "zero" : "nonzero";
  };
  const looksAmount = (e, label) => {
    const attrs = fold([
      e.id,
      e.name,
      e.className,
      e.getAttribute("aria-label"),
      e.getAttribute("placeholder"),
      label
    ].join(" "));
    return /(importe|monto|cantidad|base|tasa|total|pago|saldo|iva|isr|retencion|impuesto|actualizacion|recargo|a cargo|a favor)/.test(attrs);
  };
  const isSafeSelect = (e) => {
    if (!e || String((e.tagName || "").toLowerCase()) !== "select") return false;
    const key = fold(String(e.id || e.name || ""));
    return ["ejercicio", "periodicidad", "periodos", "tipodeclaracion"].includes(key);
  };
  const secretLike = (e, label) => {
    const tag = String((e.tagName || "").toLowerCase());
    const type = String((e.type || "").toLowerCase());
    const attrs = fold([
      e.id,
      e.name,
      e.autocomplete,
      e.getAttribute("aria-label"),
      e.getAttribute("placeholder"),
      label
    ].join(" "));
    return type === "password" || /(rfc|password|contrasena|ciec|captcha|token|session|cookie|firma|efirma|cert|llave|clave)/.test(attrs) || tag === "input" && type === "file";
  };

  const bodyText = norm((document.body && document.body.innerText) || "");
  const foldedBody = fold(bodyText);
  const parseBase64Json = (value) => {
    try {
      let text = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
      while (text.length % 4) text += "=";
      const binary = atob(text);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      return JSON.parse(new TextDecoder("utf-8").decode(bytes));
    } catch (_) {
      return null;
    }
  };
  const previewData = parseBase64Json(new URLSearchParams(location.search || "").get("data"));
  const satConfig = (() => {
    try {
      if (!window.AppDeclaracionesSAT || !AppDeclaracionesSAT.getConfig) return null;
      const c = AppDeclaracionesSAT.getConfig("configuracionDeclaracion");
      if (!c) return null;
      return {
        ejercicio: c.ejercicio || "",
        periodo: c.periodo || "",
        periodoDesc: redact(c.periodoDesc || ""),
        periodicidad: c.periodicidad || "",
        tipoDeclaracion: c.tipoDeclaracion || "",
        tipoDeclaracionDesc: redact(c.tipoDeclaracionDesc || ""),
        errores: c.errores === true,
        MontoPagar: numericState(c.MontoPagar),
        origen: redact(c.origen || "")
      };
    } catch (_) {
      return null;
    }
  })();
  const satPreviewData = previewData
    ? {
        ejercicio: previewData.ejercicio || "",
        periodo: previewData.periodo || "",
        periodoDesc: redact(previewData.periodoDesc || ""),
        periodicidad: previewData.periodicidad || "",
        tipoDeclaracion: previewData.tipoDeclaracion || "",
        tipoDeclaracionDesc: redact(previewData.tipoDeclaracionDesc || ""),
        obligaciones_count: Array.isArray(previewData.obligaciones) ? previewData.obligaciones.length : 0,
        errores: previewData.errores === true,
        MontoPagar: numericState(previewData.MontoPagar),
        origen: redact(previewData.origen || "")
      }
    : null;
  const satNavigation = (() => {
    const tabs = Array.from(document.querySelectorAll(".contenedor-secciones .nav-tabsCheck"));
    const missing = tabs
      .map((li) => {
        const a = li.querySelector("a[data-titulo-seccion]");
        return {
          group: String(li.closest(".contenedor-secciones")?.id || ""),
          section: String(a?.getAttribute("data-id-seccion") || ""),
          title: redact(a?.textContent || li.textContent || ""),
          hidden: !visible(li),
          checked: !!a?.querySelector("i.recorrido.fa-check")
        };
      })
      .filter((item) => !item.checked);
    return {
      total_tabs: tabs.length,
      checked_tabs: document.querySelectorAll(".recorrido.fa-check").length,
      incomplete_tabs: missing.length,
      hidden_incomplete_tabs: missing.filter((item) => item.hidden).length,
      missing_tabs: missing.slice(0, 20)
    };
  })();
  const routeFlags = {
    on_temporales: /Declaracion\/Temporales/i.test(location.href || ""),
    on_perfil: /Declaracion\/PerfilDeclaracion/i.test(location.href || ""),
    on_formulario: /Declaracion\/Formulario|\/Formulario\/Formulario/i.test(location.href || ""),
    on_preview: /Recepcion\/VistaPrevia/i.test(location.href || ""),
    on_login_wall: /loginda\.siat\.sat\.gob\.mx|\/nidp\/wsfed\//i.test(location.href || "") || /(acceso por contrasena|iniciar sesion|password|captcha)/.test(foldedBody),
    captcha_visible: /captcha/.test(foldedBody)
  };

  const forms = Array.from(document.querySelectorAll("form"))
    .map((f, i) => ({
      index: i,
      id: String(f.id || ""),
      name: String(f.name || ""),
      action: safeUrl(f.action || ""),
      method: String((f.method || "").toUpperCase()),
      visible: visible(f),
      controls: f.querySelectorAll("input,select,textarea,button").length
    }))
    .slice(0, 60);

  const fields = Array.from(document.querySelectorAll("input,select,textarea"))
    .filter((e) => visible(e) || looksAmount(e, ""))
    .map((e) => {
      const tag = String((e.tagName || "").toLowerCase());
      const type = String((e.type || "").toLowerCase());
      const label = labelFor(e);
      const amountLike = looksAmount(e, label);
      const isSecret = secretLike(e, label);
      const value = tag === "select" && e.options && e.selectedIndex >= 0
        ? norm(e.options[e.selectedIndex].text || e.value || "")
        : norm(e.value || "");
      const placeholderSelect = tag === "select" && (!norm(e.value || "") || /^(selecciona|seleccionar|select|elige|--)/.test(fold(value)));
      const state = amountLike ? numericState(value) : (placeholderSelect ? "empty" : (value ? "present" : "empty"));
      const item = {
        selector: selectorOf(e),
        id: String(e.id || ""),
        name: String(e.name || ""),
        tag,
        type,
        label,
        visible: visible(e),
        required: !!e.required || fold(String(e.className || "") + " " + String(e.getAttribute("aria-required") || "")).includes("required"),
        disabled: disabled(e),
        read_only: !!e.readOnly,
        checked: tag === "input" && ["checkbox", "radio"].includes(type) ? !!e.checked : null,
        value_state: isSecret ? "redacted" : state,
        amount_like: amountLike,
        secret_like: isSecret
      };
      if (isSafeSelect(e)) {
        item.safe_value = String(e.value || "");
        item.safe_selected_text = redact(value);
      }
      return item;
    })
    .slice(0, 300);

  const amountFields = fields.filter((f) => f.amount_like);
  const missingRequired = fields
    .filter((f) => f.required && !f.disabled)
    .filter((f) => f.checked === null ? f.value_state === "empty" : f.checked === false)
    .map((f) => ({ selector: f.selector, label: f.label, id: f.id, name: f.name }))
    .slice(0, 120);

  const intentFor = (e, text) => {
    const t = fold(String(text || "") + " " + String(e.id || "") + " " + String(e.name || ""));
    const chromeHint = fold(String(e.className || "") + " " + String(e.href || ""));
    if (/^presentar declaracion\b/.test(t) && /(nav-link|declaracion\/temporales)/.test(chromeHint)) return "navigate";
    if (/vista previa|btnvistaprevia/.test(t)) return "preview";
    if (/enviar declaracion|btnenviadec|enviardeclaracion/.test(t)) return "submit";
    if (/captcha/.test(t)) return "captcha";
    if (/iniciar sesion|ingresar|acceder|login/.test(t)) return "login";
    if (/guardar/.test(t)) return "save";
    if (/siguiente|continuar/.test(t)) return "next";
    if (/regresar|cancelar|cerrar/.test(t)) return "dismiss_or_back";
    return "unknown";
  };

  const clickables = Array.from(document.querySelectorAll("a,button,input[type=button],input[type=submit],[role=button],[role=tab]"))
    .filter((e) => visible(e))
    .map((e) => {
      const text = redact(norm(e.innerText || e.textContent || e.value || e.getAttribute("aria-label") || ""));
      return {
        tag: String((e.tagName || "").toLowerCase()),
        id: String(e.id || ""),
        text: clip(text, 180),
        intent: intentFor(e, text),
        href: e.href ? safeUrl(e.href) : "",
        disabled: disabled(e)
      };
    })
    .filter((b) => b.text || b.id)
    .slice(0, 180);

  const messageSelectors = [
    ".alert",
    ".validation-summary-errors",
    "[role='alert']",
    ".help-block",
    ".field-validation-error",
    ".text-danger",
    ".error",
    ".modal.show .modal-content",
    ".bootbox.modal.show .modal-content",
    ".swal2-container"
  ].join(",");
  const messages = Array.from(document.querySelectorAll(messageSelectors))
    .filter((e) => visible(e))
    .map((e) => redact(e.innerText || e.textContent || ""))
    .filter((t) => /(error|captcha|falt|pendiente|required|requerid|obligatori|validar|fallo|prellenado|acuse|confirm|declaracion|formulario)/i.test(t))
    .filter((t, i, arr) => t && arr.indexOf(t) === i)
    .slice(0, 80)
    .map((text) => clip(text, 320));

  const iframes = Array.from(document.querySelectorAll("iframe,frame"))
    .map((f, i) => ({
      index: i,
      id: String(f.id || ""),
      name: String(f.name || ""),
      title: redact(f.title || ""),
      src: safeUrl(f.src || f.getAttribute("src") || ""),
      visible: visible(f)
    }))
    .slice(0, 80);

  const amountSummary = {
    total: amountFields.length,
    empty: amountFields.filter((f) => f.value_state === "empty").length,
    zero: amountFields.filter((f) => f.value_state === "zero").length,
    nonzero: amountFields.filter((f) => f.value_state === "nonzero").length,
    present_redacted: amountFields.filter((f) => f.value_state === "present" || f.value_state === "redacted").length
  };
  const blockers = [];
  if (routeFlags.on_login_wall) blockers.push("login_or_captcha_wall");
  if (routeFlags.captcha_visible) blockers.push("captcha_visible");
  if (missingRequired.length) blockers.push("required_fields_missing");
  if (messages.some((m) => /fallo|error|required|requerid|obligatori|falt/i.test(m))) blockers.push("validation_or_error_text");
  if (cfg.expectZero && !cfg.allowNonZeroAmounts && amountSummary.nonzero > 0) blockers.push("nonzero_amounts_visible");
  if (satConfig && satConfig.errores) blockers.push("sat_config_errors_true");
  if (satPreviewData && satPreviewData.errores) blockers.push("sat_preview_errors_true");
  if (satNavigation.total_tabs > 0 && satNavigation.incomplete_tabs > 0) blockers.push("sat_navigation_incomplete");

  const submitButtons = clickables.filter((b) => b.intent === "submit" && !b.disabled);
  const previewButtons = clickables.filter((b) => b.intent === "preview" && !b.disabled);
  const submitReady = (routeFlags.on_formulario || routeFlags.on_preview) && submitButtons.length > 0 && !routeFlags.captcha_visible && missingRequired.length === 0 && blockers.length === 0;

  const result = {
    ok: true,
    mode: "sat_safe_state_probe",
    label: cfg.label,
    ts: new Date().toISOString(),
    url: safeUrl(location.href || ""),
    title: redact(document.title || ""),
    ready_state: document.readyState || "",
    viewport: {
      width: window.innerWidth || 0,
      height: window.innerHeight || 0,
      scroll_y: window.scrollY || 0
    },
    context: {
      target_year: cfg.targetYear,
      target_month: cfg.targetMonth,
      expect_zero_declaration: cfg.expectZero,
      allow_nonzero_amounts: cfg.allowNonZeroAmounts
    },
    safety_policy: {
      raw_input_values_persisted: false,
      secret_like_fields_redacted: true,
      urls_strip_query_and_hash: true,
      screenshot_may_contain_visible_screen_data: true
    },
    route_flags: routeFlags,
    sat_dynamic_state: {
      config: satConfig,
      preview_data: satPreviewData,
      navigation: satNavigation
    },
    forms,
    fields,
    field_summary: {
      total: fields.length,
      required_missing: missingRequired.length,
      secret_like: fields.filter((f) => f.secret_like).length,
      checked: fields.filter((f) => f.checked === true).length,
      unchecked: fields.filter((f) => f.checked === false).length
    },
    missing_required: missingRequired,
    amount_summary: amountSummary,
    clickables,
    messages,
    iframes,
    blockers,
    submit_checkpoint: {
      ready: submitReady,
      has_submit_button: submitButtons.length > 0,
      has_preview_button: previewButtons.length > 0,
      submit_candidates: submitButtons.slice(0, 8),
      preview_candidates: previewButtons.slice(0, 8),
      blockers
    }
  };

  if (cfg.includeBodyPreview) {
    result.body_preview_redacted = clip(redact(bodyText), 3000);
  }

  return result;
})();
