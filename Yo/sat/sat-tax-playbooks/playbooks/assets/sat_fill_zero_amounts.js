(() => {
  const norm = (v) => (v == null ? "" : String(v)).replace(/\s+/g, " ").trim();
  const low = (v) => norm(v).toLowerCase();

  const toBool = (v, fallback) => {
    const s = low(v);
    if (!s) return fallback;
    if (["1", "true", "yes", "y", "on"].includes(s)) return true;
    if (["0", "false", "no", "n", "off"].includes(s)) return false;
    return fallback;
  };

  const enabled = toBool("${SAT_FILL_ZEROES}", true);
  if (!enabled) {
    return { ok: true, skipped: true, reason: "SAT_FILL_ZEROES=false", url: location.href || "" };
  }

  const visible = (e) => {
    if (!e) return false;
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };

  const isFillableInput = (el) => {
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    if (tag !== "input" && tag !== "textarea") return false;
    if (el.disabled || el.readOnly) return false;

    const type = low(el.getAttribute("type") || el.type || "");
    if (["hidden", "button", "submit", "reset", "checkbox", "radio", "file", "range", "color", "image"].includes(type))
      return false;
    return true;
  };

  const isFillableSelect = (el) => {
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    if (tag !== "select") return false;
    if (el.disabled) return false;
    return true;
  };

  const isRequiredField = (el) => {
    if (!el) return false;
    const ariaReq = low(el.getAttribute("aria-required") || "");
    if (el.required || ariaReq === "true") return true;

    const cls = low(el.className || "");
    if (/\brequired\b|obligat/.test(cls)) return true;

    try {
      const id = String(el.id || "");
      if (id) {
        const label = document.querySelector(`label[for='${id.replace(/'/g, "\\'")}']`);
        const t = low(label ? (label.innerText || label.textContent || "") : "");
        if (t.includes("*")) return true;
      }
      const parentLabel = el.closest("label");
      const pt = low(parentLabel ? (parentLabel.innerText || parentLabel.textContent || "") : "");
      if (pt.includes("*")) return true;
    } catch (_) {}

    return false;
  };

  const looksLikeAmount = (el) => {
    const tag = (el.tagName || "").toLowerCase();
    const type = low(el.getAttribute("type") || el.type || "");
    const inputmode = low(el.getAttribute("inputmode") || "");
    const id = low(el.id || "");
    const name = low(el.name || "");
    const cls = low(el.className || "");
    const ph = low(el.getAttribute("placeholder") || "");
    const aria = low(el.getAttribute("aria-label") || "");
    const sig = `${tag} ${type} ${inputmode} ${id} ${name} ${cls} ${ph} ${aria}`;

    if (type === "number") return true;
    if (inputmode === "numeric" || inputmode === "decimal") return true;
    if (/(importe|monto|cantidad|base|tasa|total|ingres|iva|ieps|retenc|impuesto|pagad)/i.test(sig)) return true;
    if (/(numeric|decimal|amount|money|currency)/i.test(sig)) return true;
    return false;
  };

  const setValue = (el, value) => {
    const v = value == null ? "" : String(value);
    const tag = (el && el.tagName ? el.tagName.toLowerCase() : "");

    try {
      el.focus();
    } catch (_) {}

    if (el && el.isContentEditable) {
      try {
        el.textContent = v;
      } catch (_) {}
    } else if (tag === "input" || tag === "textarea") {
      try {
        const proto = Object.getPrototypeOf(el);
        const desc = Object.getOwnPropertyDescriptor(proto, "value");
        if (desc && desc.set) desc.set.call(el, v);
        else el.value = v;
      } catch (_) {
        try {
          el.value = v;
        } catch (_) {}
      }
    } else if (tag === "select") {
      try {
        el.value = v;
      } catch (_) {}
    }

    try {
      el.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (_) {}
    try {
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (_) {}
  };

  const pickSelectOption = (el) => {
    if (!el || !el.options) return null;
    const opts = Array.from(el.options || []);
    if (!opts.length) return null;

    const isPlaceholder = (txt, val) => {
      const t = low(txt);
      const v = low(val);
      if (!t && !v) return true;
      if (t === "selecciona" || t === "select" || t === "elige" || t === "--") return true;
      if (t.startsWith("selecciona ")) return true;
      if (!v || v === "0" || v === "-1") return true;
      return false;
    };

    const sinActs = opts.find((o) => {
      const t = low(o.text || o.label || "");
      return t.includes("sin actos o actividades") || t.includes("sin actos");
    });
    if (sinActs && !sinActs.disabled) return sinActs;

    for (const o of opts) {
      const txt = norm(o.text || o.label || "");
      const val = norm(o.value || "");
      if (o.disabled) continue;
      if (isPlaceholder(txt, val)) continue;
      return o;
    }
    return null;
  };

  const inputs = Array.from(document.querySelectorAll("input,textarea"))
    .filter((el) => isFillableInput(el) && visible(el) && (looksLikeAmount(el) || isRequiredField(el)))
    .slice(0, 600);

  const selects = Array.from(document.querySelectorAll("select"))
    .filter((el) => isFillableSelect(el) && visible(el) && isRequiredField(el))
    .slice(0, 240);

  const changed = [];
  const changedSelects = [];

  for (const el of selects) {
    const i = el.selectedIndex;
    const beforeTxt = i >= 0 && el.options && el.options[i] ? norm(el.options[i].text || "") : "";
    const beforeVal = i >= 0 && el.options && el.options[i] ? norm(el.options[i].value || "") : "";
    const beforeFold = low(beforeTxt);
    const looksPlaceholder =
      !beforeTxt || !beforeVal || beforeFold === "selecciona" || beforeFold === "select" || beforeFold === "elige";
    if (!looksPlaceholder) continue;
    const opt = pickSelectOption(el);
    if (!opt) continue;
    try {
      el.selectedIndex = Math.max(0, opt.index);
    } catch (_) {}
    setValue(el, String(opt.value || ""));
    const ai = el.selectedIndex;
    const afterTxt = ai >= 0 && el.options && el.options[ai] ? norm(el.options[ai].text || "") : "";
    const afterVal = ai >= 0 && el.options && el.options[ai] ? norm(el.options[ai].value || "") : "";
    changedSelects.push({
      id: el.id || "",
      name: el.name || "",
      before_text: beforeTxt,
      before_value: beforeVal,
      after_text: afterTxt,
      after_value: afterVal
    });
  }

  for (const el of inputs) {
    const before = norm(el.value || "");
    if (before !== "") continue;
    setValue(el, "0");
    const after = norm(el.value || "");
    changed.push({
      id: el.id || "",
      name: el.name || "",
      before,
      after
    });
  }

  return {
    ok: true,
    url: location.href || "",
    filled_select_count: changedSelects.length,
    filled_count: changed.length,
    select_candidates_count: selects.length,
    candidates_count: inputs.length,
    changed_select_sample: changedSelects.slice(0, 60),
    changed_sample: changed.slice(0, 80)
  };
})();
