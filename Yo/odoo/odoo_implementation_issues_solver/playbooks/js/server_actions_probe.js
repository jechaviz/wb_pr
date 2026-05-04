(async () => {
  const nowIso = new Date().toISOString();
  const targetXmlId = "quality_control.group_quality_manager";

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

  const hasGroup = async (xmlId) => {
    const check = await rpc("/web/session/user_has_group", { group_ext_id: xmlId });
    if (check.ok && typeof check.result === "boolean") {
      return check.result;
    }
    return null;
  };

  const sessionCall = await rpc("/web/session/get_session_info", {});
  const sessionInfo = sessionCall.ok ? sessionCall.result : {};
  const uid = sessionInfo && sessionInfo.uid ? sessionInfo.uid : null;

  const out = {
    ok: false,
    visited_at: nowIso,
    href: location.href,
    title: document.title,
    session: {
      uid,
      username: sessionInfo && sessionInfo.username ? sessionInfo.username : null,
      db: sessionInfo && sessionInfo.db ? sessionInfo.db : null,
    },
    discovery: {},
    run_attempts: [],
    after: {},
    error: null,
  };

  if (!uid) {
    out.error = "No active session/uid";
    return JSON.stringify(out);
  }

  out.discovery.before_has_quality_manager = await hasGroup(targetXmlId);

  const modelLookup = await rpc("/web/dataset/call_kw/ir.model/search_read", {
    model: "ir.model",
    method: "search_read",
    args: [[["model", "in", ["res.users", "quality.point", "quality.check"]]]],
    kwargs: { fields: ["id", "model", "name"], limit: 50 },
  });

  const modelIds = [];
  if (modelLookup.ok && Array.isArray(modelLookup.result)) {
    for (const rec of modelLookup.result) {
      if (rec && typeof rec.id === "number") {
        modelIds.push(rec.id);
      }
    }
  }
  out.discovery.model_lookup_ok = modelLookup.ok;
  out.discovery.model_ids = modelIds;

  const actionFields = ["id", "name", "state", "model_name", "usage", "binding_type", "binding_model_id"];
  let actions = [];
  const actionSearch = await rpc("/web/dataset/call_kw/ir.actions.server/search_read", {
    model: "ir.actions.server",
    method: "search_read",
    args: [[]],
    kwargs: { fields: actionFields, limit: 300, order: "id desc" },
  });
  if (actionSearch.ok && Array.isArray(actionSearch.result)) {
    actions = actionSearch.result;
  }

  out.discovery.actions_search_ok = actionSearch.ok;
  out.discovery.actions_total = actions.length;

  const pickCandidate = (a) => {
    const name = (a && a.name ? String(a.name) : "").toLowerCase();
    const modelName = (a && a.model_name ? String(a.model_name) : "").toLowerCase();
    const bindingName = Array.isArray(a && a.binding_model_id) ? String(a.binding_model_id[1] || "").toLowerCase() : "";
    const txt = name + " " + modelName + " " + bindingName;
    return txt.includes("quality") || txt.includes("group") || txt.includes("permission") || txt.includes("user");
  };

  const candidates = actions.filter(pickCandidate).slice(0, 20);
  out.discovery.candidate_actions = candidates.map((a) => ({
    id: a.id,
    name: a.name || null,
    state: a.state || null,
    model_name: a.model_name || null,
    usage: a.usage || null,
    binding_type: a.binding_type || null,
  }));

  for (const action of candidates) {
    const context = {
      active_model: "res.users",
      active_id: uid,
      active_ids: [uid],
      uid,
    };

    const callKw = await rpc("/web/dataset/call_kw/ir.actions.server/run", {
      model: "ir.actions.server",
      method: "run",
      args: [[action.id]],
      kwargs: { context },
    });

    let actionRun = null;
    if (!callKw.ok) {
      actionRun = await rpc("/web/action/run", {
        action_id: action.id,
        context,
      });
    }

    const success = (callKw.ok && !!callKw.result) || (actionRun && actionRun.ok);
    out.run_attempts.push({
      id: action.id,
      name: action.name || null,
      call_kw_ok: callKw.ok && !!callKw.result,
      call_kw_error: callKw.ok ? null : callKw.error,
      action_run_ok: actionRun ? !!actionRun.ok : null,
      action_run_error: actionRun && !actionRun.ok ? actionRun.error : null,
      success,
    });
  }

  const qpCreateCheck = await rpc("/web/dataset/call_kw/quality.point/check_access_rights", {
    model: "quality.point",
    method: "check_access_rights",
    args: ["create", false],
    kwargs: {},
  });
  out.after.has_quality_manager = await hasGroup(targetXmlId);
  out.after.quality_point_create = qpCreateCheck.ok ? !!qpCreateCheck.result : null;
  out.after.quality_point_create_error = qpCreateCheck.ok ? null : qpCreateCheck.error;

  out.ok = out.after.has_quality_manager === true && out.after.quality_point_create === true;
  if (!out.ok && !out.error) {
    out.error = "Server actions discovery executed but permission still blocked.";
  }

  return JSON.stringify(out);
})();
