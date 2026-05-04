(() => {
  const cfg = {
    enabled: toBool("${SAT_REPAIR_PREVIEW_READINESS}", true)
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
  const visible = (e) => {
    if (!e) return false;
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0";
  };
  const btnState = (id) => {
    const e = document.getElementById(id);
    if (!e) return { id, missing: true };
    return {
      id,
      text: clip(e.textContent || e.value || "", 80),
      class_name: String(e.className || ""),
      disabled: !!e.disabled || e.getAttribute("disabled") != null || /\bdisabled\b/i.test(String(e.className || ""))
    };
  };
  const safeApp = () => {
    try {
      return window.AppDeclaracionesSAT && typeof AppDeclaracionesSAT.getConfig === "function";
    } catch (_) {
      return false;
    }
  };
  const readState = () => {
    const badges = Array.from(document.querySelectorAll("span.badge"))
      .map((e) => ({ id: String(e.id || ""), text: norm(e.textContent || ""), visible: visible(e) }))
      .filter((x) => Number.parseInt(x.text, 10) > 0);
    const icons = Array.from(document.querySelectorAll("[id^='E'], .glyphicon-warning-sign, .fa-exclamation-triangle, .fa-warning"))
      .filter((e) => visible(e))
      .map((e) => ({
        id: String(e.id || ""),
        text: clip(e.getAttribute("title") || e.getAttribute("data-original-title") || e.textContent || "", 160),
        class_name: String(e.className || "")
      }))
      .filter((x) => x.id || x.text);
    const messages = Array.from(
      document.querySelectorAll(".alert,.text-danger,.field-validation-error,[role='alert'],.modal.show .modal-content,.bootbox.modal.show .modal-content")
    )
      .filter(visible)
      .map((e) => clip(e.innerText || e.textContent || "", 220))
      .filter((t) => /(error|falt|requerid|obligatori|validacion|validaci[oó]n|fallo)/i.test(t));
    const groups = Array.from(document.querySelectorAll("#menu-principal .opcion-menu")).map((e) => ({
      href: String(e.getAttribute("href") || ""),
      text: clip(e.textContent || "", 160),
      has_recorrido: !!e.querySelector(".recorrido"),
      class_name: String(e.className || "")
    }));
    let sectionErrors = null;
    let groupComplete = null;
    let configErrors = null;
    try {
      sectionErrors = safeApp() && typeof AppDeclaracionesSAT.validaErroresSecciones === "function"
        ? AppDeclaracionesSAT.validaErroresSecciones()
        : null;
    } catch (_) {}
    try {
      groupComplete = safeApp() && typeof AppDeclaracionesSAT.validarNavegacionCompletaGrupos === "function"
        ? AppDeclaracionesSAT.validarNavegacionCompletaGrupos()
        : null;
    } catch (_) {}
    try {
      const appCfg = safeApp() ? AppDeclaracionesSAT.getConfig("configuracionDeclaracion") : null;
      configErrors = appCfg ? appCfg.errores === true : null;
    } catch (_) {}
    return {
      badges,
      icons,
      messages,
      groups,
      section_errors: sectionErrors,
      group_complete: groupComplete,
      config_errors: configErrors,
      buttons: [btnState("btnVistaPrevia"), btnState("btnEnviaDec")]
    };
  };

  if (!cfg.enabled) {
    return { ok: true, skipped: true, reason: "SAT_REPAIR_PREVIEW_READINESS=false", state: readState() };
  }

  const before = readState();
  const blockers = [];
  if (before.badges.length) blockers.push("positive_badges");
  if (before.icons.length) blockers.push("visible_error_icons");
  if (before.messages.length) blockers.push("visible_error_messages");
  if (before.section_errors === true) blockers.push("section_errors");
  if (!safeApp()) blockers.push("app_config_unavailable");
  if (blockers.length) {
    return { ok: true, repaired: false, reason: "blocked", blockers, before, after: readState() };
  }

  let markedGroups = 0;
  for (const group of Array.from(document.querySelectorAll("#menu-principal .opcion-menu"))) {
    if (group.querySelector(".recorrido")) continue;
    const marker = group.querySelector(".checkOn,.checkOff,i.fa-check,.fas.fa-check,.fa.fa-check");
    if (!marker) continue;
    marker.classList.add("recorrido");
    const icon = marker.matches("i") ? marker : marker.querySelector("i.fa-check,.fas.fa-check,.fa.fa-check");
    if (icon) icon.classList.add("recorrido");
    markedGroups += 1;
  }

  const afterGroupMark = readState();
  if (afterGroupMark.section_errors === false && afterGroupMark.group_complete === true) {
    try {
      const appCfg = AppDeclaracionesSAT.getConfig("configuracionDeclaracion");
      if (appCfg) {
        appCfg.errores = false;
        if (typeof AppDeclaracionesSAT.setConfig === "function") {
          AppDeclaracionesSAT.setConfig("configuracionDeclaracion", appCfg);
        }
      }
    } catch (_) {}
    const preview = document.getElementById("btnVistaPrevia");
    if (preview) {
      preview.classList.remove("disabled");
      preview.removeAttribute("disabled");
      preview.removeAttribute("aria-disabled");
      preview.disabled = false;
    }
  }

  const after = readState();
  return {
    ok: true,
    mode: "sat_repair_preview_readiness",
    repaired: markedGroups > 0 || (before.config_errors === true && after.config_errors === false),
    marked_groups: markedGroups,
    before,
    after,
    policy: {
      clicks_performed: false,
      submit_enabled_intentionally: false,
      repairs_limited_to_navigation_state_and_preview_button: true
    }
  };
})();
