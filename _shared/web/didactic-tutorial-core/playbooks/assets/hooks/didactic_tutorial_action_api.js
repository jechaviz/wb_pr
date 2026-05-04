(() => {
  try {
    const KEY = "__waibaTutorialCaptureAction";
    const VERSION = "2026-02-26.2";
    const MEMORY_KEY = "__waibaTutorialCaptureAction.memory.v1";

    if (window[KEY] && typeof window[KEY].run === "function") {
      return { ok: true, reused: true, key: KEY, version: window[KEY].version || VERSION };
    }

    const normalize = (value) => (value == null ? "" : String(value)).replace(/\s+/g, " ").trim();
    const lower = (value) => normalize(value).toLowerCase();
    const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

    const isVisible = (el) => {
      if (!el || !(el instanceof Element)) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 2 || rect.height <= 2) return false;
      const style = window.getComputedStyle(el);
      if (!style) return false;
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
      return true;
    };

    const query = (selector) => {
      const safe = normalize(selector);
      if (!safe) return [];
      try {
        return Array.from(document.querySelectorAll(safe));
      } catch (_) {
        return [];
      }
    };

    const getText = (el) => normalize((el && (el.innerText || el.textContent)) || "");
    const toChain = (value) => {
      if (Array.isArray(value)) {
        return value
          .map((v) => normalize(v))
          .filter(Boolean)
          .map((v) => ({ text: v }));
      }
      const raw = normalize(value);
      if (!raw) return [];
      return raw
        .split("|")
        .map((v) => normalize(v))
        .filter(Boolean)
        .map((v) => ({ text: v }));
    };

    const parseBool = (value, fallback = false) => {
      if (typeof value === "boolean") return value;
      const txt = lower(value);
      if (!txt) return fallback;
      return txt === "1" || txt === "true" || txt === "yes" || txt === "y";
    };

    const parseKeywords = (value) => {
      if (Array.isArray(value)) return uniq(value.map((v) => lower(v)).filter(Boolean));
      const raw = normalize(value);
      if (!raw) return [];
      return uniq(
        raw
          .replace(/[;\n\r]+/g, "|")
          .split(/[|,]+/)
          .map((v) => lower(v))
          .filter(Boolean)
      );
    };

    const includesKeyword = (text, keywords) => {
      const hay = lower(text);
      if (!hay) return false;
      const keys = Array.isArray(keywords) ? keywords : [];
      if (!keys.length) return true;
      return keys.some((k) => k && hay.includes(k));
    };

    const nowIso = () => {
      try {
        return new Date().toISOString();
      } catch (_) {
        return "";
      }
    };

    const loadMemory = () => {
      const base = {
        visited_routes: {},
        recorridos: {}
      };
      try {
        const raw = localStorage.getItem(MEMORY_KEY);
        if (!raw) return base;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return base;
        return {
          visited_routes: parsed.visited_routes && typeof parsed.visited_routes === "object" ? parsed.visited_routes : {},
          recorridos: parsed.recorridos && typeof parsed.recorridos === "object" ? parsed.recorridos : {}
        };
      } catch (_) {
        return base;
      }
    };

    const saveMemory = (mem) => {
      try {
        localStorage.setItem(MEMORY_KEY, JSON.stringify(mem || {}));
        return true;
      } catch (_) {
        return false;
      }
    };

    const findWithText = (elements, textNeedle) => {
      const needle = lower(textNeedle);
      if (!needle) return null;
      const filtered = (elements || []).filter(isVisible);
      let best = null;
      let bestScore = -1;
      for (const el of filtered) {
        const txt = lower(getText(el));
        if (!txt || !txt.includes(needle)) continue;
        let score = 0;
        if (txt === needle) score += 6;
        if (txt.startsWith(needle)) score += 3;
        score += Math.max(0, 3 - Math.abs(txt.length - needle.length) / 18);
        if (el.tagName === "A" || el.tagName === "BUTTON") score += 2;
        if (score > bestScore) {
          bestScore = score;
          best = el;
        }
      }
      return best;
    };

    const broadCandidates = () => {
      const selectors = uniq([
        ".o_menu_sections a",
        ".o_control_panel a",
        ".o_control_panel button",
        ".o_dropdown_menu .dropdown-item",
        ".o_notebook .nav-link",
        ".o_apps_sidebar a",
        ".o_app",
        ".o_kanban_record",
        ".o_list_renderer .o_data_row",
        "a",
        "button"
      ]);
      const out = [];
      for (const sel of selectors) out.push(...query(sel));
      return uniq(out);
    };

    const resolveClickableFromPoint = (x, y) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      const node = document.elementFromPoint(x, y);
      if (!node) return null;
      const clickRoot = node.closest(
        "a, button, [role='button'], .btn, .o_app, .dropdown-item, .o_menu_sections a, .o_data_row, .o_kanban_record, .nav-link"
      );
      if (clickRoot && isVisible(clickRoot)) return clickRoot;
      let cur = node;
      while (cur && cur instanceof Element) {
        if (isVisible(cur)) return cur;
        cur = cur.parentElement;
      }
      return null;
    };

    const collectVisibleTextRects = (limit = 240) => {
      const out = [];
      const seen = new Set();
      if (!document.body) return out;
      const NF = typeof NodeFilter !== "undefined"
        ? NodeFilter
        : { SHOW_TEXT: 4, FILTER_REJECT: 2, FILTER_ACCEPT: 1 };
      const walker = document.createTreeWalker(document.body, NF.SHOW_TEXT, {
        acceptNode: (node) => {
          const txt = normalize(node && node.nodeValue);
          if (!txt || txt.length < 2 || txt.length > 140) return NF.FILTER_REJECT;
          const parent = node && node.parentElement;
          if (!parent || !isVisible(parent)) return NF.FILTER_REJECT;
          const tag = String(parent.tagName || "").toLowerCase();
          if (tag === "script" || tag === "style") return NF.FILTER_REJECT;
          return NF.FILTER_ACCEPT;
        }
      });
      while (walker.nextNode() && out.length < limit) {
        const node = walker.currentNode;
        const txt = normalize(node && node.nodeValue);
        if (!txt) continue;
        let rect = null;
        try {
          const range = document.createRange();
          range.selectNodeContents(node);
          const rects = Array.from(range.getClientRects()).filter((r) => r && r.width > 6 && r.height > 7);
          rect = rects[0] || null;
        } catch (_) {
          rect = null;
        }
        if (!rect) continue;
        const cx = Math.round(rect.left + rect.width / 2);
        const cy = Math.round(rect.top + rect.height / 2);
        const key = lower(txt) + "|" + String(cx) + "|" + String(cy);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          text: txt,
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          cx,
          cy
        });
      }
      return out;
    };

    const scoreTextMatch = (hay, needle) => {
      const h = lower(hay);
      const n = lower(needle);
      if (!h || !n) return -1;
      if (!h.includes(n)) return -1;
      let score = 0;
      if (h === n) score += 12;
      if (h.startsWith(n)) score += 6;
      score += Math.max(0, 5 - Math.abs(h.length - n.length) / 14);
      return score;
    };

    const findTextRect = (needle) => {
      const textNeedle = normalize(needle);
      if (!textNeedle) return null;
      const boxes = collectVisibleTextRects();
      let best = null;
      let bestScore = -1;
      for (const box of boxes) {
        const score = scoreTextMatch(box.text, textNeedle);
        if (score > bestScore) {
          bestScore = score;
          best = box;
        }
      }
      return best && bestScore >= 0 ? best : null;
    };

    const findInPageRangeRect = (needle) => {
      const textNeedle = normalize(needle);
      if (!textNeedle || typeof window.find !== "function") return null;
      try {
        const sel = window.getSelection && window.getSelection();
        if (sel && sel.removeAllRanges) sel.removeAllRanges();
      } catch (_) {}
      let found = false;
      try {
        found = Boolean(window.find(textNeedle, false, false, true, false, false, false));
      } catch (_) {
        found = false;
      }
      if (!found) return null;
      try {
        const sel = window.getSelection && window.getSelection();
        if (!sel || sel.rangeCount <= 0) return null;
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        if (!rect || rect.width <= 1 || rect.height <= 1) return null;
        return {
          text: textNeedle,
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          cx: Math.round(rect.left + rect.width / 2),
          cy: Math.round(rect.top + rect.height / 2)
        };
      } catch (_) {
        return null;
      }
    };

    const collectMenuMap = () => {
      const collectTexts = (selector) =>
        uniq(query(selector).filter(isVisible).map((el) => getText(el)).filter(Boolean));
      return {
        launcher_apps: collectTexts(".o_home_menu .o_app, .o_app"),
        top_menus: collectTexts(".o_menu_sections a, .o_main_navbar .o_menu_sections a, .o_main_navbar a"),
        side_entries: collectTexts(".o_apps_sidebar a, .o_sub_menu a, .o-dropdown--menu .dropdown-item"),
        tabs: collectTexts(".o_notebook .nav-link, .nav-tabs .nav-link"),
        actions: collectTexts(".o_control_panel button, .o_control_panel a, button, a.btn, .btn")
      };
    };

    const classifyLabel = (label) => {
      const txt = lower(label);
      const checks = [
        { category: "orientation", keys: ["apps", "launcher", "home", "dashboard", "settings"] },
        { category: "commercial", keys: ["sales", "quotation", "order", "rental", "contract", "customer"] },
        { category: "logistics", keys: ["inventory", "delivery", "transfer", "warehouse", "stock", "operation"] },
        { category: "finance", keys: ["invoice", "invoicing", "payment", "account", "journal", "tax"] },
        { category: "master_data", keys: ["contact", "partner", "product", "catalog", "template"] },
        { category: "configuration", keys: ["configuration", "settings", "studio", "developer"] }
      ];
      for (const rule of checks) {
        if (rule.keys.some((k) => txt.includes(k))) return rule.category;
      }
      return "other";
    };

    const buildDidacticPlan = (menu, payload) => {
      const p = payload && typeof payload === "object" ? payload : {};
      const category = normalize(p.didactic_category || "");
      const allowKeywords = parseKeywords(p.didactic_allow_keywords);
      const deferKeywords = parseKeywords(p.didactic_defer_keywords);
      const labels = uniq(
        []
          .concat(menu && menu.top_menus ? menu.top_menus : [])
          .concat(menu && menu.side_entries ? menu.side_entries : [])
          .concat(menu && menu.tabs ? menu.tabs : [])
          .concat(menu && menu.actions ? menu.actions : [])
      ).filter(Boolean);
      const map = labels.map((label) => ({
        label,
        category: classifyLabel(label),
        in_focus: includesKeyword(label, allowKeywords),
        deferred: deferKeywords.length ? includesKeyword(label, deferKeywords) : false
      }));
      const deferred = map
        .filter((item) => !item.in_focus || item.deferred)
        .slice(0, 30)
        .map((item) => ({
          label: item.label,
          category: item.category,
          reason: item.deferred ? "explicit_defer" : "out_of_focus_scope"
        }));
      return {
        category,
        allow_keywords: allowKeywords,
        defer_keywords: deferKeywords,
        labels_total: map.length,
        in_focus_count: map.filter((item) => item.in_focus).length,
        deferred_count: deferred.length,
        map,
        deferred
      };
    };

    const findFieldLabel = (root) => {
      if (!root || !(root instanceof Element)) return "";
      const id = root.getAttribute("id") || "";
      const name = root.getAttribute("name") || "";
      if (id) {
        const byFor = document.querySelector("label[for=\"" + id + "\"]");
        if (byFor && isVisible(byFor)) return getText(byFor);
      }
      const row = root.closest(".o_row, .o_inner_group, .o_group, tr, .o_td_label, .o_cell");
      if (row) {
        const label = row.querySelector(".o_form_label, label, th, td");
        if (label && isVisible(label)) return getText(label);
      }
      if (name) {
        const byNameRow = document.querySelector("[name=\"" + name + "\"]");
        if (byNameRow) {
          const row2 = byNameRow.closest(".o_row, .o_inner_group, .o_group, tr, .o_td_label, .o_cell");
          if (row2) {
            const label2 = row2.querySelector(".o_form_label, label, th, td");
            if (label2 && isVisible(label2)) return getText(label2);
          }
        }
      }
      return "";
    };

    const readFieldValue = (root) => {
      if (!root || !(root instanceof Element)) return "";
      const input = root.matches("input, textarea, select")
        ? root
        : (root.querySelector("input, textarea, select, [role='combobox'], .o-autocomplete--input, .o_input") || root);
      const raw = input && "value" in input ? input.value : (input.innerText || input.textContent || "");
      return normalize(raw);
    };

    const isFieldReadonly = (root, input) => {
      const node = input || root;
      const attrReadonly = !!(node && (node.hasAttribute("readonly") || node.hasAttribute("disabled")));
      const classReadonly = !!(
        (root && root.classList && (root.classList.contains("o_readonly_modifier") || root.classList.contains("o_field_readonly"))) ||
        (node && node.classList && node.classList.contains("o_field_readonly"))
      );
      return attrReadonly || classReadonly;
    };

    const isFieldRequired = (root) => {
      if (!root || !(root instanceof Element)) return false;
      if (root.classList.contains("o_required_modifier")) return true;
      const row = root.closest(".o_row, .o_inner_group, .o_group, tr, .o_cell");
      if (!row) return false;
      const label = row.querySelector(".o_form_label, label");
      return !!(label && label.classList && label.classList.contains("o_required_modifier"));
    };

    const validateFieldInteraction = (root) => {
      const input = root.matches("input, textarea, select")
        ? root
        : root.querySelector("input, textarea, select, [role='combobox'], .o-autocomplete--input, .o_input");
      const value = readFieldValue(root);
      const required = isFieldRequired(root);
      const readonly = isFieldReadonly(root, input);
      let focusOk = false;
      let optionsCount = null;
      let interactionStatus = "not_interactive";
      const issues = [];

      if (input && !readonly) {
        try {
          input.focus();
          focusOk = (document.activeElement === input) || (input.contains && input.contains(document.activeElement));
        } catch (_) {
          focusOk = false;
        }
        interactionStatus = focusOk ? "interactive_ok" : "interactive_focus_failed";

        const isCombo = (
          input.getAttribute("role") === "combobox" ||
          (input.classList && (input.classList.contains("o-autocomplete--input") || input.classList.contains("o_input")))
        );
        if (isCombo) {
          try {
            emulateClick(input);
            const optionNodes = query(".o-autocomplete--dropdown-item, [role='option'], .dropdown-item").filter(isVisible);
            optionsCount = optionNodes.length;
            if (!optionNodes.length) {
              issues.push("combobox_options_not_visible");
            }
            try {
              input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
            } catch (_) {}
          } catch (_) {
            issues.push("combobox_probe_failed");
          }
        }
      } else if (input && readonly) {
        interactionStatus = "readonly";
      }

      if (required && !value && readonly) {
        issues.push("required_readonly_empty");
      } else if (required && !value && interactionStatus !== "readonly") {
        issues.push("required_empty");
      }

      return {
        value,
        required,
        readonly,
        focus_ok: focusOk,
        options_count: optionsCount,
        interaction_status: interactionStatus,
        issues
      };
    };

    const collectFieldMap = () => {
      const fields = [];
      const seen = new Set();

      const pushField = (root, forcedLabel) => {
        if (!root || !isVisible(root)) return;
        const explicit = normalize(forcedLabel || "");
        const name =
          normalize(root.getAttribute("name") || "") ||
          normalize((root.querySelector && root.querySelector("[name]") && root.querySelector("[name]").getAttribute("name")) || "");
        const label = explicit || findFieldLabel(root);
        const dedupeKey = (name ? "name:" + name : "") || (label ? "label:" + label.toLowerCase() : "");
        if (!dedupeKey) return;
        if (seen.has(dedupeKey)) return;
        seen.add(dedupeKey);
        const checks = validateFieldInteraction(root);
        fields.push({
          name,
          label,
          tag: String(root.tagName || "").toLowerCase(),
          ...checks
        });
      };

      const labelNodes = query(".o_form_view .o_form_label, .o_form_sheet .o_form_label, .o_form_view label, .o_form_sheet label")
        .filter(isVisible);
      for (const labelNode of labelNodes) {
        const labelText = getText(labelNode);
        if (!labelText) continue;
        if (labelText.length > 90) continue;
        const row = labelNode.closest(".o_row, .o_inner_group, .o_group, tr, .o_td_label, .o_cell");
        let root =
          (labelNode.nextElementSibling && isVisible(labelNode.nextElementSibling) && labelNode.nextElementSibling) ||
          (row && row.querySelector && row.querySelector(".o_field_widget, [name], input, textarea, select, [role='combobox']")) ||
          row ||
          labelNode;
        pushField(root, labelText);
      }

      const namedNodes = query(".o_form_view input[name], .o_form_view textarea[name], .o_form_view select[name], .o_form_sheet input[name], .o_form_sheet textarea[name], .o_form_sheet select[name], .o_form_view [name].o_field_widget, .o_form_sheet [name].o_field_widget")
        .filter(isVisible);
      for (const root of namedNodes) pushField(root, "");

      const listHeaders = query(".o_list_renderer th, .o_list_view th, table thead th").filter(isVisible);
      for (const th of listHeaders) {
        const text = getText(th);
        if (!text) continue;
        const key = "header:" + text.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        fields.push({
          name: normalize(th.getAttribute("data-name") || ""),
          label: text,
          tag: "th",
          value: "",
          required: false,
          readonly: true,
          focus_ok: false,
          options_count: null,
          interaction_status: "header",
          issues: []
        });
      }

      return fields;
    };

    const inspectAndValidate = (payload) => {
      const p = payload && typeof payload === "object" ? payload : {};
      const fields = collectFieldMap();
      const menu = collectMenuMap();
      const didactic = buildDidacticPlan(menu, p);
      const issues = [];
      let failCount = 0;
      let warnCount = 0;
      for (const f of fields) {
        if (Array.isArray(f.issues) && f.issues.length) {
          for (const issue of f.issues) {
            const severity = issue.includes("required") ? "warn" : "warn";
            if (severity === "fail") failCount += 1;
            else warnCount += 1;
            issues.push({
              severity,
              field_name: f.name,
              field_label: f.label,
              issue
            });
          }
        }
        if (f.interaction_status === "interactive_focus_failed") {
          warnCount += 1;
          issues.push({
            severity: "warn",
            field_name: f.name,
            field_label: f.label,
            issue: "focus_failed"
          });
        }
      }

      const memory = loadMemory();
      const recorridoScope = normalize(p.recorrido_scope || p.didactic_category || "global");
      const explicitRecorridoKey = normalize(p.recorrido_key || "");
      const menuSignature = lower(
        uniq((menu && menu.top_menus ? menu.top_menus : []).slice(0, 10)).join("|") || "no_top_menu"
      );
      const recorridoKey = explicitRecorridoKey || (recorridoScope + "::" + menuSignature);
      const recorridoOnce = parseBool(p.recorrido_once, true);
      const prior = memory.recorridos && recorridoKey ? memory.recorridos[recorridoKey] : null;
      let recorridoReused = false;
      if (recorridoOnce && prior) {
        recorridoReused = true;
      } else if (recorridoKey) {
        if (!memory.recorridos) memory.recorridos = {};
        memory.recorridos[recorridoKey] = {
          first_seen_at: (prior && prior.first_seen_at) || nowIso(),
          last_seen_at: nowIso(),
          scope: recorridoScope,
          signature: menuSignature
        };
        saveMemory(memory);
      }

      const summary = {
        ok: failCount === 0,
        step: normalize(p.step || ""),
        url: String(location.href || ""),
        field_count: fields.length,
        launcher_app_count: (menu.launcher_apps || []).length,
        top_menu_count: (menu.top_menus || []).length,
        tab_count: (menu.tabs || []).length,
        action_count: (menu.actions || []).length,
        fail_count: failCount,
        warn_count: warnCount,
        didactic_deferred_count: didactic.deferred_count,
        recorrido_reused: recorridoReused
      };
      return {
        ok: true,
        summary,
        menu_map: menu,
        didactic_plan: didactic,
        recorrido: {
          key: recorridoKey,
          scope: recorridoScope,
          reused: recorridoReused,
          once: recorridoOnce,
          signature: menuSignature
        },
        fields,
        issues
      };
    };

    const emulateClick = (el) => {
      if (!el) return false;
      try {
        el.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
      } catch (_) {}
      const opts = { bubbles: true, cancelable: true, view: window };
      try { el.dispatchEvent(new MouseEvent("pointerdown", opts)); } catch (_) {}
      try { el.dispatchEvent(new MouseEvent("mousedown", opts)); } catch (_) {}
      try { el.dispatchEvent(new MouseEvent("pointerup", opts)); } catch (_) {}
      try { el.dispatchEvent(new MouseEvent("mouseup", opts)); } catch (_) {}
      try { el.dispatchEvent(new MouseEvent("click", opts)); } catch (_) {}
      try { el.click(); } catch (_) {}
      return true;
    };

    const launcherVisible = () => {
      const home = query(".o_home_menu .o_app").filter(isVisible);
      return home.length >= 4;
    };

    const openLauncher = () => {
      if (launcherVisible()) return { ok: true, opened: true, already_visible: true };
      const toggles = uniq([
        ".o_menu_brand",
        ".o_menu_brand_icon",
        ".o_apps_menu_toggle",
        ".o_menu_toggle",
        ".o_navbar_apps_menu button",
        ".o_navbar_apps_menu a",
        ".o_main_navbar a",
        ".o_main_navbar button",
        "button[aria-label*='Apps']",
        "button[title*='Apps']",
        "a[aria-label*='Apps']",
        ".o_main_navbar .fa-th-large",
        ".o_main_navbar .oi-apps"
      ]);
      for (const sel of toggles) {
        const candidate = query(sel).find(isVisible);
        if (!candidate) continue;
        emulateClick(candidate);
        if (launcherVisible()) {
          return { ok: true, opened: true, selector: sel, already_visible: false };
        }
      }
      return { ok: false, opened: false, reason: "launcher_toggle_not_found_or_not_effective" };
    };

    const findTarget = (payload) => {
      const p = payload && typeof payload === "object" ? payload : {};
      const selector = normalize(p.selector);
      const text = normalize(p.text);
      const allowKeywords = parseKeywords(p.didactic_allow_keywords);
      const fromSelector = query(selector).filter(isVisible);
      let target = null;
      let method = "";
      let textRect = null;

      if (text) {
        target = findWithText(fromSelector, text);
        if (target) method = "selector_text_match";
      }
      if (!target && fromSelector.length) {
        if (allowKeywords.length) {
          target = fromSelector.find((el) => includesKeyword(getText(el), allowKeywords)) || null;
          if (target) method = "selector_focus_scope";
        }
        if (!target) {
          target = fromSelector[0];
          method = "selector_first";
        }
      }
      if (!target && text) {
        target = findWithText(broadCandidates(), text);
        if (target) method = "broad_text_match";
      }
      if (!target && text) {
        textRect = findTextRect(text);
        if (textRect) {
          target = resolveClickableFromPoint(textRect.cx, textRect.cy);
          if (target) method = "text_rect_match";
        }
      }
      if (!target && text) {
        textRect = findInPageRangeRect(text);
        if (textRect) {
          target = resolveClickableFromPoint(textRect.cx, textRect.cy);
          if (target) method = "find_in_page_match";
        }
      }
      if (!target && !text) {
        const broad = broadCandidates().filter(isVisible);
        if (allowKeywords.length) {
          target = broad.find((el) => includesKeyword(getText(el), allowKeywords)) || null;
          if (target) method = "broad_focus_scope";
        }
        if (!target) {
          target = broad[0] || null;
          if (target) method = "broad_first";
        }
      }
      return { target, method, text_rect: textRect };
    };

    const buildRouteKey = (payload, steps) => {
      const p = payload && typeof payload === "object" ? payload : {};
      const explicit = normalize(p.route_id);
      const scope = normalize(p.route_scope || "global");
      if (explicit) return scope + "::" + explicit;
      const chainSig = (steps || [])
        .map((step) => normalize(step && (step.text || step.selector || "")))
        .filter(Boolean)
        .join(">");
      return chainSig ? (scope + "::" + chainSig) : "";
    };

    const run = (payload) => {
      const p = payload && typeof payload === "object" ? payload : {};
      const mode = lower(p.mode || "single").replace(/^['"]+|['"]+$/g, "");
      const preOpenLauncher = parseBool(p.pre_open_launcher, false);
      const preOpenLauncherOnce = parseBool(p.pre_open_launcher_once, false);
      const routeOnce = parseBool(p.route_once, false);
      const forceRoute = parseBool(p.force_route, false);
      const allowKeywords = parseKeywords(p.didactic_allow_keywords);
      const chain = toChain(p.chain);
      const steps = chain.length ? chain : [{ selector: p.selector, text: p.text }];
      const memory = loadMemory();
      const routeKey = buildRouteKey(p, steps);
      const result = {
        ok: true,
        mode,
        clicked: false,
        launcher: { ok: true, opened: false, skipped: !preOpenLauncher },
        route: {
          key: routeKey,
          scope: normalize(p.route_scope || "global"),
          once: routeOnce,
          reused: false,
          skipped: false
        },
        didactic: {
          category: normalize(p.didactic_category || ""),
          allow_keywords: allowKeywords,
          deferred: []
        },
        steps: [],
        href: String(location.href || "")
      };
      try {
        window.__waibaTutorialLastClick = {
          active: false,
          at_ms: Date.now(),
          reason: "run_started"
        };
      } catch (_) {}

      if (mode === "skip") {
        result.reason = "skipped_mode";
        return result;
      }

      if (mode !== "navigate" && mode !== "single") {
        return {
          ok: true,
          clicked: false,
          reason: "unsupported_mode",
          mode,
          href: String(location.href || "")
        };
      }

      if (routeOnce && !forceRoute && routeKey && memory.visited_routes && memory.visited_routes[routeKey]) {
        result.route.reused = true;
        result.route.skipped = true;
        result.reason = "route_already_traversed";
        return result;
      }

      if (preOpenLauncher) {
        const launcherKey = result.route.scope + "::__launcher_open";
        if (preOpenLauncherOnce && memory.visited_routes && memory.visited_routes[launcherKey] && launcherVisible()) {
          result.launcher = { ok: true, opened: false, skipped: true, reused: true };
        } else {
          result.launcher = openLauncher();
          if (!memory.visited_routes) memory.visited_routes = {};
          memory.visited_routes[launcherKey] = { at: nowIso(), href: String(location.href || "") };
          saveMemory(memory);
        }
      }

      for (const step of steps) {
        const payloadStep = {
          selector: normalize(step && step.selector ? step.selector : p.selector),
          text: normalize(step && step.text ? step.text : p.text),
          didactic_allow_keywords: allowKeywords
        };
        if (!payloadStep.selector && preOpenLauncher && launcherVisible()) {
          payloadStep.selector = ".o_home_menu .o_app, .o_app";
        }
        const resolved = findTarget(payloadStep);
        const target = resolved && resolved.target ? resolved.target : null;
        if (!target) {
          result.steps.push({
            ok: false,
            clicked: false,
            reason: "target_not_found",
            selector: payloadStep.selector,
            text: payloadStep.text,
            method: resolved && resolved.method ? resolved.method : "none"
          });
          continue;
        }
        const targetText = getText(target);
        if (allowKeywords.length && !includesKeyword((payloadStep.text + " " + targetText), allowKeywords)) {
          result.steps.push({
            ok: true,
            clicked: false,
            skipped: true,
            reason: "didactic_out_of_scope",
            selector: payloadStep.selector,
            text: payloadStep.text,
            target_text: targetText,
            method: resolved && resolved.method ? resolved.method : "unknown"
          });
          result.didactic.deferred.push({
            text: targetText || payloadStep.text,
            reason: "out_of_focus_scope"
          });
          continue;
        }
        emulateClick(target);
        const rect = target.getBoundingClientRect();
        const point = {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2)
        };
        result.clicked = true;
        result.steps.push({
          ok: true,
          clicked: true,
          tag: String(target.tagName || "").toLowerCase(),
          text: targetText.slice(0, 220),
          selector: payloadStep.selector,
          query_text: payloadStep.text,
          method: resolved && resolved.method ? resolved.method : "unknown",
          text_rect: resolved && resolved.text_rect ? resolved.text_rect : null,
          point
        });
        try {
          window.__waibaTutorialLastClick = {
            active: true,
            at_ms: Date.now(),
            x: point.x,
            y: point.y,
            method: resolved && resolved.method ? resolved.method : "unknown",
            text: targetText.slice(0, 220),
            href: String(location.href || "")
          };
        } catch (_) {}
      }
      result.href = String(location.href || "");
      if (!result.clicked) result.reason = "no_click_effective";
      if (!result.clicked) {
        try {
          window.__waibaTutorialLastClick = {
            active: false,
            at_ms: Date.now(),
            reason: result.reason || "no_click_effective",
            href: result.href
          };
        } catch (_) {}
      }
      if (result.clicked && routeKey) {
        if (!memory.visited_routes) memory.visited_routes = {};
        memory.visited_routes[routeKey] = {
          at: nowIso(),
          href: result.href
        };
        saveMemory(memory);
      }
      return result;
    };

    window[KEY] = { version: VERSION, run, inspectAndValidate };
    return { ok: true, installed: true, key: KEY, version: VERSION };
  } catch (error) {
    return { ok: false, reason: String((error && error.message) || error || "unknown_error") };
  }
})()
