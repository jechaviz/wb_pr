(() => {
  try {
    const API_KEY = "__waibaSubtitleOverlay";
    const STYLE_ID = "__waiba_subtitle_overlay_style";
    const ROOT_ID = "__waiba_subtitle_overlay_root";
    const FX_LAYER_ID = "__waiba_subtitle_overlay_fx";
    const VERSION = "2026-02-23.4";

    const normalize = (value) => (value == null ? "" : String(value)).replace(/\s+/g, " ").trim();
    const normalizeLines = (value) => String(value == null ? "" : value).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const escapeHtml = (value) => String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const toNumber = (value, fallback = NaN) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : fallback;
    };
    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);

    const formatRichText = (value) => {
      const source = normalizeLines(value);
      if (!normalize(source)) return "";
      let html = escapeHtml(source);
      html = html.replace(/`([^`]+?)`/g, "<code>$1</code>");
      html = html.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/__([^_\n]+?)__/g, "<strong>$1</strong>");
      html = html.replace(/\*([^*\n]+?)\*/g, "<em>$1</em>");
      html = html.replace(/_([^_\n]+?)_/g, "<em>$1</em>");
      html = html.replace(/\n/g, "<br>");
      return html;
    };

    const nowStamp = () => {
      const d = new Date();
      const p2 = (n) => String(n).padStart(2, "0");
      return String(d.getFullYear())
        + "-" + p2(d.getMonth() + 1)
        + "-" + p2(d.getDate())
        + " " + p2(d.getHours())
        + ":" + p2(d.getMinutes())
        + ":" + p2(d.getSeconds());
    };

    if (window[API_KEY] && typeof window[API_KEY].set === "function") {
      const api = window[API_KEY];
      if (typeof api.ensure === "function") api.ensure();
      return {
        ok: true,
        reused: true,
        key: API_KEY,
        version: String(api.version || VERSION),
        state: typeof api.state === "function" ? api.state() : {}
      };
    }

    const defaults = {
      visible: false,
      position: "bottom-left",
      theme: "dark",
      playbook: "",
      step: "",
      title: "",
      subtitle: "",
      intent: "",
      detail: "",
      timestamp: "",
      show_timestamp: true,
      show_playbook: false,
      show_step: true,
      allow_markup: true,
      mouse_fx_enabled: true,
      follow_pointer: false
    };

    let current = { ...defaults };

    const fx = {
      enabled: true,
      followPointer: false,
      layer: null,
      halo: null,
      core: null,
      raf: 0,
      targetX: -9999,
      targetY: -9999,
      currentX: -9999,
      currentY: -9999,
      moveHandler: null,
      leaveHandler: null
    };

    const ensureStyle = () => {
      let style = document.getElementById(STYLE_ID);
      if (style) return style;

      const rootSel = "#" + ROOT_ID;
      const fxSel = "#" + FX_LAYER_ID;
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.type = "text/css";
      style.textContent = [
        rootSel + " {",
        "  --waiba-accent: #8cc2ff;",
        "  --waiba-bg: rgba(12, 18, 32, 0.90);",
        "  --waiba-fg: #f7faff;",
        "  --waiba-muted: rgba(236, 243, 255, 0.82);",
        "  position: fixed;",
        "  z-index: 2147483647;",
        "  pointer-events: none;",
        "  max-width: min(940px, 94vw);",
        "  min-width: min(440px, 78vw);",
        "  box-sizing: border-box;",
        "  border-radius: 14px;",
        "  padding: 12px 14px;",
        "  border: 1px solid rgba(255, 255, 255, 0.22);",
        "  border-left: 4px solid var(--waiba-accent);",
        "  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.36);",
        "  font-family: \"Segoe UI\", \"Calibri\", Arial, sans-serif;",
        "  line-height: 1.35;",
        "  letter-spacing: 0.01em;",
        "  backdrop-filter: blur(3px);",
        "  background: var(--waiba-bg);",
        "  color: var(--waiba-fg);",
        "}",
        rootSel + "[data-pos=\"bottom-left\"] { left: 16px; bottom: 16px; }",
        rootSel + "[data-pos=\"bottom-right\"] { right: 16px; bottom: 16px; }",
        rootSel + "[data-pos=\"top-left\"] { left: 16px; top: 16px; }",
        rootSel + "[data-pos=\"top-right\"] { right: 16px; top: 16px; }",
        rootSel + "[data-theme=\"dark\"] {",
        "  --waiba-accent: #8cc2ff;",
        "  --waiba-bg: linear-gradient(140deg, rgba(11, 18, 34, 0.92) 0%, rgba(25, 33, 52, 0.88) 100%);",
        "  --waiba-fg: #f7faff;",
        "  --waiba-muted: rgba(236, 243, 255, 0.82);",
        "}",
        rootSel + "[data-theme=\"light\"] {",
        "  --waiba-accent: #2d5ea8;",
        "  --waiba-bg: linear-gradient(140deg, rgba(250, 253, 255, 0.95) 0%, rgba(241, 246, 255, 0.94) 100%);",
        "  --waiba-fg: #13213a;",
        "  --waiba-muted: rgba(19, 33, 58, 0.74);",
        "  border-color: rgba(20, 35, 62, 0.25);",
        "}",
        rootSel + "[data-theme=\"warning\"] {",
        "  --waiba-accent: #ffcf70;",
        "  --waiba-bg: linear-gradient(140deg, rgba(50, 30, 8, 0.92) 0%, rgba(63, 37, 8, 0.90) 100%);",
        "  --waiba-fg: #fff7e3;",
        "  --waiba-muted: rgba(255, 240, 206, 0.82);",
        "  border-color: rgba(255, 212, 132, 0.38);",
        "}",
        rootSel + " .waiba-subtitle-kicker {",
        "  font-size: 11px;",
        "  font-weight: 700;",
        "  text-transform: uppercase;",
        "  letter-spacing: 0.08em;",
        "  color: var(--waiba-muted);",
        "  margin-bottom: 6px;",
        "}",
        rootSel + " .waiba-subtitle-title {",
        "  font-size: 19px;",
        "  font-weight: 700;",
        "  margin-bottom: 3px;",
        "}",
        rootSel + " .waiba-subtitle-subtitle {",
        "  font-size: 14px;",
        "  font-weight: 600;",
        "  color: var(--waiba-fg);",
        "  margin-bottom: 3px;",
        "}",
        rootSel + " .waiba-subtitle-intent {",
        "  font-size: 12px;",
        "  font-weight: 500;",
        "  color: var(--waiba-muted);",
        "  margin-bottom: 4px;",
        "}",
        rootSel + " .waiba-subtitle-detail {",
        "  font-size: 11px;",
        "  color: var(--waiba-muted);",
        "}",
        rootSel + " strong { font-weight: 700; }",
        rootSel + " em { font-style: italic; }",
        rootSel + " code {",
        "  font-family: Consolas, \"Courier New\", monospace;",
        "  font-size: 0.95em;",
        "  background: rgba(255, 255, 255, 0.12);",
        "  border: 1px solid rgba(255, 255, 255, 0.22);",
        "  border-radius: 4px;",
        "  padding: 0 4px;",
        "}",
        fxSel + " {",
        "  position: fixed;",
        "  inset: 0;",
        "  z-index: 2147483646;",
        "  pointer-events: none;",
        "  overflow: hidden;",
        "}",
        fxSel + " .waiba-fx-halo {",
        "  position: absolute;",
        "  left: 0;",
        "  top: 0;",
        "  width: 72px;",
        "  height: 72px;",
        "  border-radius: 999px;",
        "  transform: translate3d(-9999px,-9999px,0) translate(-50%,-50%);",
        "  background: radial-gradient(circle, rgba(250, 204, 21, 0.34) 0%, rgba(250, 204, 21, 0.18) 42%, rgba(250, 204, 21, 0.05) 72%, rgba(250, 204, 21, 0) 100%);",
        "  filter: blur(1px);",
        "  mix-blend-mode: screen;",
        "  opacity: 0.9;",
        "  animation: waibaFxBreath 2.3s ease-in-out infinite;",
        "}",
        fxSel + " .waiba-fx-core {",
        "  position: absolute;",
        "  left: 0;",
        "  top: 0;",
        "  width: 18px;",
        "  height: 18px;",
        "  border-radius: 999px;",
        "  transform: translate3d(-9999px,-9999px,0) translate(-50%,-50%);",
        "  background: radial-gradient(circle, rgba(254, 243, 199, 0.96) 0%, rgba(250, 204, 21, 0.68) 55%, rgba(245, 158, 11, 0) 100%);",
        "  box-shadow: 0 0 14px rgba(245, 158, 11, 0.50);",
        "}",
        fxSel + " .waiba-fx-click {",
        "  position: absolute;",
        "  left: 0;",
        "  top: 0;",
        "  width: var(--waiba-click-size, 18px);",
        "  height: var(--waiba-click-size, 18px);",
        "  border-radius: 999px;",
        "  transform: translate3d(0,0,0) translate(-50%,-50%);",
        "  border: 1px solid rgba(254, 243, 199, 0.86);",
        "  background: radial-gradient(circle, rgba(250, 204, 21, 0.44), rgba(250, 204, 21, 0.08) 66%, rgba(250, 204, 21, 0) 100%);",
        "  box-shadow: 0 0 14px rgba(245, 158, 11, 0.45);",
        "  animation: waibaFxClick 640ms cubic-bezier(0.16, 1, 0.3, 1) forwards;",
        "}",
        "@keyframes waibaFxClick {",
        "  0% { opacity: 0.84; transform: translate(-50%, -50%) scale(0.68); }",
        "  65% { opacity: 0.46; }",
        "  100% { opacity: 0; transform: translate(-50%, -50%) scale(3.3); }",
        "}",
        "@keyframes waibaFxBreath {",
        "  0% { filter: blur(1px) saturate(1); }",
        "  50% { filter: blur(2px) saturate(1.14); }",
        "  100% { filter: blur(1px) saturate(1); }",
        "}",
        "@media (max-width: 900px) {",
        "  " + rootSel + " {",
        "    min-width: min(320px, 90vw);",
        "    max-width: min(760px, 95vw);",
        "    padding: 10px 12px;",
        "  }",
        "  " + rootSel + " .waiba-subtitle-title { font-size: 17px; }",
        "  " + rootSel + " .waiba-subtitle-subtitle { font-size: 13px; }",
        "}"
      ].join("\n");

      (document.head || document.documentElement).appendChild(style);
      return style;
    };

    const ensureRoot = () => {
      let root = document.getElementById(ROOT_ID);
      if (root) return root;

      root = document.createElement("div");
      root.id = ROOT_ID;
      root.setAttribute("aria-hidden", "true");
      root.innerHTML = [
        "<div class=\"waiba-subtitle-kicker\"></div>",
        "<div class=\"waiba-subtitle-title\"></div>",
        "<div class=\"waiba-subtitle-subtitle\"></div>",
        "<div class=\"waiba-subtitle-intent\"></div>",
        "<div class=\"waiba-subtitle-detail\"></div>"
      ].join("");
      (document.body || document.documentElement).appendChild(root);
      return root;
    };

    const runFxFrame = () => {
      fx.raf = 0;
      if (!fx.enabled || !fx.halo || !fx.core) return;
      const tx = toNumber(fx.targetX);
      const ty = toNumber(fx.targetY);
      if (!Number.isFinite(tx) || !Number.isFinite(ty)) return;
      let cx = toNumber(fx.currentX);
      let cy = toNumber(fx.currentY);
      if (!Number.isFinite(cx) || !Number.isFinite(cy) || cx < -9000 || cy < -9000) {
        cx = tx;
        cy = ty;
      } else {
        cx += (tx - cx) * 0.24;
        cy += (ty - cy) * 0.24;
      }
      if (Math.abs(tx - cx) < 0.1) cx = tx;
      if (Math.abs(ty - cy) < 0.1) cy = ty;
      fx.currentX = cx;
      fx.currentY = cy;
      const tr = "translate3d(" + String(cx) + "px," + String(cy) + "px,0) translate(-50%,-50%)";
      fx.halo.style.transform = tr;
      fx.core.style.transform = tr;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        if (!fx.raf && typeof window.requestAnimationFrame === "function") {
          fx.raf = window.requestAnimationFrame(runFxFrame);
        }
      }
    };

    const queueFxFrame = () => {
      if (fx.raf || typeof window.requestAnimationFrame !== "function") return;
      fx.raf = window.requestAnimationFrame(runFxFrame);
    };

    const attachPointerTracking = () => {
      if (!fx.enabled) return;
      if (!fx.followPointer) {
        if (fx.moveHandler) {
          try { document.removeEventListener("mousemove", fx.moveHandler, true); } catch (_) {}
        }
        if (fx.leaveHandler) {
          try { document.removeEventListener("mouseleave", fx.leaveHandler, true); } catch (_) {}
        }
        fx.moveHandler = null;
        fx.leaveHandler = null;
        return;
      }
      if (!fx.moveHandler) {
        fx.moveHandler = (ev) => {
          if (!fx.enabled || !fx.followPointer) return;
          fx.targetX = Number(ev.clientX || 0);
          fx.targetY = Number(ev.clientY || 0);
          queueFxFrame();
        };
        document.addEventListener("mousemove", fx.moveHandler, true);
      }
      if (!fx.leaveHandler) {
        fx.leaveHandler = () => {
          fx.targetX = -9999;
          fx.targetY = -9999;
          fx.currentX = -9999;
          fx.currentY = -9999;
          if (fx.halo) fx.halo.style.transform = "translate3d(-9999px,-9999px,0) translate(-50%,-50%)";
          if (fx.core) fx.core.style.transform = "translate3d(-9999px,-9999px,0) translate(-50%,-50%)";
        };
        document.addEventListener("mouseleave", fx.leaveHandler, true);
      }
    };

    const ensureFxLayer = () => {
      if (!fx.enabled) return null;
      const host = document.body || document.documentElement;
      if (!host) return null;
      let layer = document.getElementById(FX_LAYER_ID);
      if (!layer) {
        layer = document.createElement("div");
        layer.id = FX_LAYER_ID;
        const halo = document.createElement("div");
        halo.className = "waiba-fx-halo";
        const core = document.createElement("div");
        core.className = "waiba-fx-core";
        layer.appendChild(halo);
        layer.appendChild(core);
        host.appendChild(layer);
      }
      fx.layer = layer;
      fx.halo = layer.querySelector(".waiba-fx-halo");
      fx.core = layer.querySelector(".waiba-fx-core");
      attachPointerTracking();
      return layer;
    };

    const destroyFxLayer = () => {
      if (fx.moveHandler) {
        try { document.removeEventListener("mousemove", fx.moveHandler, true); } catch (_) {}
      }
      if (fx.leaveHandler) {
        try { document.removeEventListener("mouseleave", fx.leaveHandler, true); } catch (_) {}
      }
      fx.moveHandler = null;
      fx.leaveHandler = null;
      if (fx.raf) {
        try { window.cancelAnimationFrame(fx.raf); } catch (_) {}
      }
      fx.raf = 0;
      const layer = document.getElementById(FX_LAYER_ID);
      if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
      fx.layer = null;
      fx.halo = null;
      fx.core = null;
      fx.targetX = -9999;
      fx.targetY = -9999;
      fx.currentX = -9999;
      fx.currentY = -9999;
    };

    const setFxEnabled = (enabled) => {
      const next = !!enabled;
      fx.enabled = next;
      if (next) ensureFxLayer();
      else destroyFxLayer();
      return { ok: true, mouse_fx_enabled: fx.enabled };
    };

    const setFollowPointer = (followPointer) => {
      fx.followPointer = !!followPointer;
      attachPointerTracking();
      return { ok: true, follow_pointer: fx.followPointer };
    };

    const setFxTarget = (x, y, instant = false) => {
      ensureFxLayer();
      const nx = toNumber(x);
      const ny = toNumber(y);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) {
        fx.targetX = -9999;
        fx.targetY = -9999;
        fx.currentX = -9999;
        fx.currentY = -9999;
        if (fx.halo) fx.halo.style.transform = "translate3d(-9999px,-9999px,0) translate(-50%,-50%)";
        if (fx.core) fx.core.style.transform = "translate3d(-9999px,-9999px,0) translate(-50%,-50%)";
        return { ok: true, hidden: true };
      }
      fx.targetX = nx;
      fx.targetY = ny;
      if (instant) {
        fx.currentX = nx;
        fx.currentY = ny;
      }
      queueFxFrame();
      return { ok: true, x: nx, y: ny };
    };

    const getCurrentFxPoint = () => {
      const x = Number.isFinite(toNumber(fx.currentX)) && fx.currentX > -9000 ? fx.currentX : fx.targetX;
      const y = Number.isFinite(toNumber(fx.currentY)) && fx.currentY > -9000 ? fx.currentY : fx.targetY;
      return {
        x: Number.isFinite(toNumber(x)) ? x : null,
        y: Number.isFinite(toNumber(y)) ? y : null
      };
    };

    const resolvePoint = (payload) => {
      const p = payload && typeof payload === "object" ? payload : {};
      const vw = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
      const vh = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);

      const x = toNumber(p.x);
      const y = toNumber(p.y);
      if (Number.isFinite(x) && Number.isFinite(y)) {
        return {
          ok: true,
          x: clamp(x, 0, vw),
          y: clamp(y, 0, vh),
          mode: "xy"
        };
      }

      const xPct = toNumber(p.x_pct);
      const yPct = toNumber(p.y_pct);
      if (Number.isFinite(xPct) && Number.isFinite(yPct)) {
        return {
          ok: true,
          x: (vw * clamp(xPct, 0, 100)) / 100,
          y: (vh * clamp(yPct, 0, 100)) / 100,
          mode: "pct"
        };
      }

      const selector = normalize(p.selector);
      if (selector) {
        try {
          const el = document.querySelector(selector);
          if (el) {
            const r = el.getBoundingClientRect();
            return {
              ok: true,
              x: clamp(r.left + r.width / 2, 0, vw),
              y: clamp(r.top + r.height / 2, 0, vh),
              mode: "selector"
            };
          }
        } catch (_) {}
      }

      return { ok: false, x: null, y: null, mode: "none" };
    };

    const clickFx = (x, y, payload) => {
      if (!fx.enabled) return { ok: false, reason: "mouse_fx_disabled" };
      const layer = ensureFxLayer();
      if (!layer) return { ok: false, reason: "fx_layer_unavailable" };
      const nx = toNumber(x);
      const ny = toNumber(y);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return { ok: false, reason: "invalid_coordinates" };
      const ripple = document.createElement("span");
      ripple.className = "waiba-fx-click";
      const size = clamp(toNumber(payload && payload.size, 18), 10, 64);
      ripple.style.setProperty("--waiba-click-size", String(size) + "px");
      ripple.style.left = String(nx) + "px";
      ripple.style.top = String(ny) + "px";
      layer.appendChild(ripple);
      window.setTimeout(() => {
        if (ripple && ripple.parentNode) ripple.parentNode.removeChild(ripple);
      }, 740);
      return { ok: true, x: nx, y: ny, size };
    };

    const inferFocusFromState = (stateValue) => {
      const joined = normalize([stateValue.title, stateValue.subtitle, stateValue.intent, stateValue.detail].join(" "));
      let xPct = 68;
      let yPct = 34;
      if (/overflow|bottom|lower|footer|scroll/i.test(joined)) yPct = 84;
      else if (/menu|navbar|launcher|dashboard|app/i.test(joined)) yPct = 18;
      else if (/list|kanban|table/i.test(joined)) yPct = 44;
      return { x_pct: xPct, y_pct: yPct, click: true, clicks: 1 };
    };

    const applyFocus = (payload) => {
      const p = payload && typeof payload === "object" ? payload : {};
      if (hasOwn(p, "enabled")) {
        setFxEnabled(!!p.enabled);
      }
      if (hasOwn(p, "follow_pointer")) {
        setFollowPointer(!!p.follow_pointer);
      }
      if (!fx.enabled) {
        return { ok: true, mouse_fx_enabled: false };
      }
      if (p.hide === true) {
        return setFxTarget(-9999, -9999, true);
      }

      const point = resolvePoint(p);
      if (point.ok) {
        setFxTarget(point.x, point.y, p.instant === true);
      }

      const clickRequested = p.click === true || Number.isFinite(toNumber(p.clicks)) || p.double_click === true;
      if (clickRequested) {
        const clickCount = clamp(Math.floor(toNumber(p.clicks, p.double_click ? 2 : 1)), 1, 4);
        const source = point.ok ? point : getCurrentFxPoint();
        if (Number.isFinite(toNumber(source.x)) && Number.isFinite(toNumber(source.y))) {
          for (let i = 0; i < clickCount; i += 1) {
            window.setTimeout(() => { clickFx(source.x, source.y, p); }, i * 120);
          }
        }
      }

      return {
        ok: true,
        mouse_fx_enabled: fx.enabled,
        follow_pointer: fx.followPointer,
        point: point.ok ? { x: point.x, y: point.y, mode: point.mode } : null
      };
    };

    const extractFocusPayload = (payload) => {
      if (!payload || typeof payload !== "object") return null;
      if (hasOwn(payload, "focus")) return payload.focus;
      if (hasOwn(payload, "mouse")) return payload.mouse;
      const focusKeys = [
        "x", "y", "x_pct", "y_pct", "selector", "click", "clicks",
        "double_click", "hide", "follow_pointer", "instant", "size", "enabled"
      ];
      for (const key of focusKeys) {
        if (hasOwn(payload, key)) return payload;
      }
      return null;
    };

    const ensure = () => {
      ensureStyle();
      ensureRoot();
      if (current.mouse_fx_enabled !== false) {
        setFxEnabled(true);
        setFollowPointer(!!current.follow_pointer);
      } else {
        setFxEnabled(false);
      }
      return document.getElementById(ROOT_ID);
    };

    const renderField = (el, value, allowMarkup) => {
      if (!el) return;
      const source = normalizeLines(value);
      if (!normalize(source)) {
        el.style.display = "none";
        el.textContent = "";
        return;
      }
      el.style.display = "block";
      if (allowMarkup === false) {
        el.textContent = source;
      } else {
        el.innerHTML = formatRichText(source);
      }
    };

    const render = () => {
      const root = ensure();
      root.dataset.pos = normalize(current.position || "bottom-left").toLowerCase();
      root.dataset.theme = normalize(current.theme || "dark").toLowerCase();

      const playbookText = normalize(current.playbook);
      const stepText = normalize(current.step);
      const kickerParts = [];
      if (current.show_playbook && playbookText) kickerParts.push(playbookText);
      if (current.show_step !== false && stepText) kickerParts.push(stepText);
      const kicker = kickerParts.join(" | ");

      const detailParts = [];
      const detailValue = normalizeLines(current.detail);
      if (normalize(detailValue)) detailParts.push(detailValue);
      if (current.show_timestamp) {
        const stamp = normalize(current.timestamp || "");
        if (stamp) detailParts.push(stamp);
      }
      const detail = detailParts.join(" | ");

      const kickerEl = root.querySelector(".waiba-subtitle-kicker");
      const titleEl = root.querySelector(".waiba-subtitle-title");
      const subtitleEl = root.querySelector(".waiba-subtitle-subtitle");
      const intentEl = root.querySelector(".waiba-subtitle-intent");
      const detailEl = root.querySelector(".waiba-subtitle-detail");

      renderField(kickerEl, kicker, current.allow_markup);
      renderField(titleEl, current.title, current.allow_markup);
      renderField(subtitleEl, current.subtitle, current.allow_markup);
      renderField(intentEl, current.intent, current.allow_markup);
      renderField(detailEl, detail, current.allow_markup);

      root.style.display = current.visible ? "block" : "none";
      return root;
    };

    const state = () => {
      const point = getCurrentFxPoint();
      return {
        ...current,
        mouse_fx_enabled: fx.enabled,
        follow_pointer: fx.followPointer,
        focus: {
          x: point.x,
          y: point.y,
          target_x: fx.targetX,
          target_y: fx.targetY
        }
      };
    };

    const set = (payload) => {
      const next = { ...current, ...(payload || {}) };
      if (hasOwn(payload, "show_timestamp")) next.show_timestamp = !!payload.show_timestamp;
      if (hasOwn(payload, "show_playbook")) next.show_playbook = !!payload.show_playbook;
      if (hasOwn(payload, "show_step")) next.show_step = !!payload.show_step;
      if (hasOwn(payload, "allow_markup")) next.allow_markup = !!payload.allow_markup;
      if (hasOwn(payload, "mouse_fx_enabled")) next.mouse_fx_enabled = !!payload.mouse_fx_enabled;
      if (hasOwn(payload, "follow_pointer")) next.follow_pointer = !!payload.follow_pointer;

      if (payload && (payload.hide || payload.clear)) {
        next.visible = false;
      } else if (!hasOwn(next, "visible")) {
        next.visible = true;
      } else if (!hasOwn(payload || {}, "visible")) {
        next.visible = true;
      }

      next.timestamp = nowStamp();
      current = next;
      render();

      setFxEnabled(current.mouse_fx_enabled !== false);
      setFollowPointer(!!current.follow_pointer);

      let focusResult = null;
      const focusPayload = extractFocusPayload(payload || {});
      if (focusPayload !== null) {
        focusResult = applyFocus(focusPayload);
      } else if (current.visible && fx.enabled && !fx.followPointer) {
        focusResult = applyFocus(inferFocusFromState(current));
      } else if (!current.visible) {
        setFxTarget(-9999, -9999, true);
      }

      return {
        ok: true,
        key: API_KEY,
        version: VERSION,
        visible: !!current.visible,
        state: state(),
        focus_result: focusResult,
        href: String(location.href || "")
      };
    };

    const focus = (payload) => {
      ensure();
      const result = applyFocus(payload || {});
      return {
        ok: true,
        key: API_KEY,
        version: VERSION,
        state: state(),
        focus_result: result
      };
    };

    const click = (payload) => {
      ensure();
      const p = payload && typeof payload === "object" ? payload : {};
      const point = resolvePoint(p);
      const fallback = getCurrentFxPoint();
      const x = point.ok ? point.x : fallback.x;
      const y = point.ok ? point.y : fallback.y;
      const result = clickFx(x, y, p);
      return {
        ok: !!result.ok,
        key: API_KEY,
        version: VERSION,
        click_result: result,
        state: state()
      };
    };

    const clear = () => {
      current = {
        ...defaults,
        position: current.position || defaults.position,
        theme: current.theme || defaults.theme,
        show_timestamp: current.show_timestamp,
        show_playbook: current.show_playbook,
        show_step: current.show_step,
        allow_markup: current.allow_markup,
        mouse_fx_enabled: current.mouse_fx_enabled,
        follow_pointer: current.follow_pointer
      };
      render();
      setFxEnabled(current.mouse_fx_enabled !== false);
      if (!fx.followPointer) setFxTarget(-9999, -9999, true);
      return { ok: true, key: API_KEY, version: VERSION, visible: false };
    };

    const hide = () => {
      current = { ...current, visible: false, timestamp: nowStamp() };
      render();
      if (!fx.followPointer) setFxTarget(-9999, -9999, true);
      return { ok: true, key: API_KEY, version: VERSION, visible: false };
    };

    const destroy = () => {
      const root = document.getElementById(ROOT_ID);
      if (root && root.parentNode) root.parentNode.removeChild(root);
      const style = document.getElementById(STYLE_ID);
      if (style && style.parentNode) style.parentNode.removeChild(style);
      destroyFxLayer();
      delete window[API_KEY];
      return { ok: true, key: API_KEY, version: VERSION, destroyed: true };
    };

    window[API_KEY] = {
      version: VERSION,
      ensure,
      set,
      focus,
      click,
      clear,
      hide,
      destroy,
      state,
      setFxEnabled,
      setFollowPointer
    };

    ensure();
    return { ok: true, installed: true, key: API_KEY, version: VERSION, state: state() };
  } catch (error) {
    return {
      ok: false,
      reason: String((error && error.message) || error || "unknown_error")
    };
  }
})()
