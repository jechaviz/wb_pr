(async () => {
  const nowIso = new Date().toISOString();

  const rpc = async (route, params = {}) => {
    const payload = {
      jsonrpc: "2.0",
      method: "call",
      params,
      id: Date.now() + Math.floor(Math.random() * 1000000),
    };

    try {
      const response = await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (body && body.error) {
        const err = body.error || {};
        const errData = err.data || {};
        return {
          ok: false,
          error: errData.message || err.message || String(err),
          error_name: errData.name || null,
        };
      }
      return { ok: true, result: body ? body.result : null };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  };

  const menuLabels = Array.from(document.querySelectorAll("a,button,span"))
    .map((el) => (el.innerText || "").trim())
    .filter((t) => t && t.length > 1)
    .slice(0, 60);

  const sessionCall = await rpc("/web/session/get_session_info", {});
  const sessionInfo = sessionCall.ok ? sessionCall.result : {};

  const modulesCall = await rpc("/web/dataset/call_kw/ir.module.module/search_read", {
    model: "ir.module.module",
    method: "search_read",
    args: [[["state", "=", "installed"]]],
    kwargs: {
      fields: ["name", "shortdesc", "state", "application"],
      limit: 200,
      order: "name asc",
    },
  });

  let installedModules = [];
  if (modulesCall.ok && Array.isArray(modulesCall.result)) {
    installedModules = modulesCall.result.map((m) => ({
      name: m && m.name ? m.name : null,
      shortdesc: m && m.shortdesc ? m.shortdesc : null,
      state: m && m.state ? m.state : null,
      application: m && m.application ? true : false,
    }));
  }

  const appModules = installedModules.filter((m) => m.application).slice(0, 80);

  return JSON.stringify({
    ok: true,
    visited_at: nowIso,
    href: location.href,
    title: document.title,
    ready_state: document.readyState,
    session: {
      call_ok: sessionCall.ok,
      uid: sessionInfo && sessionInfo.uid ? sessionInfo.uid : null,
      username: sessionInfo && sessionInfo.username ? sessionInfo.username : null,
      db: sessionInfo && sessionInfo.db ? sessionInfo.db : null,
    },
    menus: menuLabels,
    installed_modules_count: installedModules.length,
    application_modules_count: appModules.length,
    application_modules: appModules,
    modules_call_ok: modulesCall.ok,
    modules_call_error: modulesCall.ok ? null : modulesCall.error,
  });
})();
