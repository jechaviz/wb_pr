(() => (async () => {
  try {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const wantedIdsRaw = ${SAT_OBLIGATION_IDS};
    const wantedIds = Array.isArray(wantedIdsRaw) ? wantedIdsRaw.map((v) => String(v)) : [];
    const selectAll = String("${SAT_SELECT_ALL_OBLIGATIONS}").toLowerCase() === "true";

    const visible = (e) => {
      if (!e) return false;
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
    };

    const candidates = Array.from(document.querySelectorAll("input[type=checkbox]"))
      .filter((e) => {
        if (!(e.id || e.name)) return false;
        const isObligationName = (e.name || "").includes("btnObligacion");
        const isFourDigitId = /^[0-9]{4}$/.test(e.id || "");
        return isObligationName || isFourDigitId;
      })
      .map((e) => ({ el: e, id: e.id || "", name: e.name || "", visible: visible(e), checked: !!e.checked }));

    const byId = {};
    for (const c of candidates) if (c.id) byId[c.id] = c;

    const marked = [];
    const missing = [];

    if (selectAll || wantedIds.length === 0) {
      for (const c of candidates) {
        c.el.checked = true;
        try {
          c.el.dispatchEvent(new Event("change", { bubbles: true }));
        } catch (_) {}
        marked.push({ id: c.id, name: c.name, visible: c.visible, checked: !!c.el.checked });
      }
    } else {
      for (const id of wantedIds) {
        const c = byId[id] || candidates.find((x) => x.id === id);
        if (!c) {
          missing.push(id);
          continue;
        }
        c.el.checked = true;
        try {
          c.el.dispatchEvent(new Event("change", { bubbles: true }));
        } catch (_) {}
        marked.push({ id: c.id, name: c.name, visible: c.visible, checked: !!c.el.checked });
      }
    }

    await sleep(450);
    const btn =
      document.getElementById("btnSiguiente") ||
      Array.from(document.querySelectorAll("button,input[type='button'],input[type='submit']")).find((el) =>
        /siguiente/i.test((el.innerText || el.value || "").trim())
      ) ||
      null;

    let clickErr = "";
    if (btn) {
      try {
        btn.click();
      } catch (e) {
        clickErr = String((e && e.message) || e || "click_failed");
      }
    }

    return {
      ok: true,
      before_url: location.href,
      marked_count: marked.length,
      missing_ids: missing,
      has_btn_siguiente: !!btn,
      click_err: clickErr,
      candidates: candidates
        .slice(0, 80)
        .map((c) => ({ id: c.id, name: c.name, visible: c.visible, checked: c.checked }))
    };
  } catch (e) {
    return {
      ok: false,
      before_url: location.href || "",
      error: String((e && e.message) || e || "sat_select_obligations_failed")
    };
  }
})());
