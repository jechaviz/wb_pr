(() => (async () => {
  try {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const firstByAliases = (aliases) => {
      const list = Array.isArray(aliases) ? aliases : [aliases];
      for (const alias of list) {
        if (!alias) continue;
        const byId = document.getElementById(alias);
        if (byId) return byId;
        const byName = document.querySelector("select[name='" + alias + "']");
        if (byName) return byName;
      }
      for (const alias of list) {
        if (!alias) continue;
        const loose = document.querySelector(
          "select[id*='" + alias + "' i],select[name*='" + alias + "' i]"
        );
        if (loose) return loose;
      }
      return null;
    };

    const setSelect = (aliases, valueOrText) => {
      const e = firstByAliases(aliases);
      const aliasList = Array.isArray(aliases) ? aliases : [aliases];
      if (!e) return { ok: false, aliases: aliasList, reason: "missing" };

      const before = e.value;
      let targetValue = valueOrText;
      const wanted = (valueOrText || "").toString().trim().toLowerCase();
      if (wanted) {
        const byValue = Array.from(e.options || []).find(
          (o) => (o.value || "").toString().trim().toLowerCase() === wanted
        );
        if (byValue) {
          targetValue = byValue.value;
        } else {
          const byTextExact = Array.from(e.options || []).find(
            (o) => (o.text || "").toString().trim().toLowerCase() === wanted
          );
          if (byTextExact) {
            targetValue = byTextExact.value;
          } else {
            const byTextContains = Array.from(e.options || []).find((o) =>
              (o.text || "").toString().trim().toLowerCase().includes(wanted)
            );
            if (byTextContains) targetValue = byTextContains.value;
          }
        }
      }

      e.value = targetValue;
      try {
        e.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (_) {}
      try {
        e.dispatchEvent(new Event("change", { bubbles: true }));
      } catch (_) {}
      return {
        ok: true,
        id: e.id || "",
        name: e.name || "",
        aliases: aliasList,
        before,
        requested: valueOrText,
        resolved: targetValue,
        after: e.value
      };
    };

    const dump = (aliases) => {
      const e = firstByAliases(aliases);
      const aliasList = Array.isArray(aliases) ? aliases : [aliases];
      if (!e) return { exists: false, aliases: aliasList };
      return {
        exists: true,
        aliases: aliasList,
        id: e.id || "",
        name: e.name || "",
        value: e.value,
        options: Array.from(e.options || []).slice(0, 80).map((o) => ({
          v: o.value,
          t: (o.text || "").trim()
        }))
      };
    };

    const result = {
      ok: true,
      url: location.href,
      title: document.title || "",
      set: {
        ejercicio: setSelect(["ejercicio", "idEjercicio"], "${SAT_TARGET_YEAR}"),
        periodicidad: setSelect(["periodicidad", "idPeriodicidad"], "${SAT_PERIODICIDAD}")
      }
    };

    if (!result.set.ejercicio.ok || !result.set.periodicidad.ok) result.ok = false;

    await sleep(900);
    result.set.periodo = setSelect(["periodos", "periodo", "idPeriodo"], "${SAT_TARGET_MONTH}");
    if (!result.set.periodo.ok) result.ok = false;

    await sleep(1100);
    result.set.tipodeclaracion = setSelect(
      ["tipodeclaracion", "tipoDeclaracion", "idTipoDeclaracion"],
      "${SAT_TIPO_DECLARACION}"
    );
    if (!result.set.tipodeclaracion.ok) result.ok = false;

    await sleep(450);

    const btn =
      document.getElementById("btnSiguiente") ||
      Array.from(document.querySelectorAll("button,input[type='button'],input[type='submit']")).find((el) =>
        /siguiente/i.test((el.innerText || el.value || "").trim())
      ) ||
      null;

    result.profile = {
      ejercicio: dump(["ejercicio", "idEjercicio"]),
      periodicidad: dump(["periodicidad", "idPeriodicidad"]),
      periodos: dump(["periodos", "periodo", "idPeriodo"]),
      tipodeclaracion: dump(["tipodeclaracion", "tipoDeclaracion", "idTipoDeclaracion"]),
      btnSiguiente: {
        exists: !!btn,
        disabled: btn ? !!btn.disabled : null,
        text: btn ? (btn.innerText || btn.value || "").trim().slice(0, 120) : ""
      }
    };

    const cbs = Array.from(document.querySelectorAll("input[type=checkbox]"));
    result.checkboxes = {
      count: cbs.length,
      sample: cbs.slice(0, 30).map((e) => ({
        id: e.id || "",
        name: e.name || "",
        checked: !!e.checked
      }))
    };

    result.body_preview = (document.body?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 1200);
    return result;
  } catch (e) {
    return {
      ok: false,
      url: location.href || "",
      error: String((e && e.message) || e || "sat_set_profile_failed")
    };
  }
})());
