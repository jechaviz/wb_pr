(async () => {
  const nowIso = new Date().toISOString();
  const q = (sel) => document.querySelector(sel);

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
          error_code: errData.code || null,
        };
      }
      return { ok: true, result: body ? body.result : null };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  };

  const hasLogin = !!q('input[name="login"], input[type="email"]');
  const hasPassword = !!q('input[name="password"], input[type="password"]');

  const sessionCall = await rpc("/web/session/get_session_info", {});
  const sessionInfo = sessionCall.ok ? sessionCall.result : {};
  const uid = sessionInfo && sessionInfo.uid ? sessionInfo.uid : null;

  const groupFieldsGet = await rpc("/web/dataset/call_kw/res.groups/fields_get", {
    model: "res.groups",
    method: "fields_get",
    args: [[], ["type", "string"]],
    kwargs: {},
  });
  const groupFields =
    groupFieldsGet.ok && groupFieldsGet.result && typeof groupFieldsGet.result === "object" ? groupFieldsGet.result : {};
  // Prefer a field that includes implied membership (transitive groups), not only direct assignments.
  const groupMembershipField = Object.prototype.hasOwnProperty.call(groupFields, "all_user_ids")
    ? "all_user_ids"
    : Object.prototype.hasOwnProperty.call(groupFields, "user_ids")
      ? "user_ids"
    : Object.prototype.hasOwnProperty.call(groupFields, "users")
      ? "users"
      : Object.prototype.hasOwnProperty.call(groupFields, "users_ids")
        ? "users_ids"
        : null;

  const groupsToCheck = [
    "base.group_user",
    "base.group_system",
    "base.group_erp_manager",
    "quality_control.group_quality_user",
    "quality_control.group_quality_manager",
    "stock.group_stock_user",
    "stock.group_stock_manager",
    "product.group_product_manager",
    "sales_team.group_sale_manager",
    "account.group_account_manager",
  ];

  const checkGroupByRelation = async (xmlId) => {
    if (!uid) {
      return { ok: false, error: "No active uid in session_info." };
    }
    if (!groupMembershipField) {
      return { ok: false, error: "No group membership field available on res.groups." };
    }

    const parts = String(xmlId || "").split(".");
    if (parts.length < 2) {
      return { ok: false, error: "Invalid xmlId: " + String(xmlId) };
    }
    const module = parts[0];
    const name = parts.slice(1).join(".");

    const xmlLookup = await rpc("/web/dataset/call_kw/ir.model.data/search_read", {
      model: "ir.model.data",
      method: "search_read",
      args: [[["module", "=", module], ["name", "=", name], ["model", "=", "res.groups"]]],
      kwargs: { fields: ["res_id", "module", "name"], limit: 1 },
    });
    if (!xmlLookup.ok) {
      return { ok: false, error: "ir.model.data lookup failed: " + String(xmlLookup.error || "") };
    }
    if (!Array.isArray(xmlLookup.result) || xmlLookup.result.length < 1 || !xmlLookup.result[0] || !xmlLookup.result[0].res_id) {
      return { ok: false, error: "xmlId not found via ir.model.data: " + String(xmlId) };
    }

    const groupId = xmlLookup.result[0].res_id;
    const domain = [["id", "=", groupId], [groupMembershipField, "in", [uid]]];
    const membership = await rpc("/web/dataset/call_kw/res.groups/search_count", {
      model: "res.groups",
      method: "search_count",
      args: [domain],
      kwargs: {},
    });
    if (!membership.ok) {
      return { ok: false, error: "res.groups/search_count failed: " + String(membership.error || "") };
    }
    return {
      ok: true,
      value: Number(membership.result || 0) > 0,
      via: "res.groups.search_count(" + groupMembershipField + ")",
      group_id: groupId,
      count: membership.result,
    };
  };

  const checkGroupByFullNameTokens = async (tokens) => {
    if (!uid) {
      return { ok: false, error: "No active uid in session_info." };
    }
    if (!groupMembershipField) {
      return { ok: false, error: "No group membership field available on res.groups." };
    }

    const t = Array.isArray(tokens) ? tokens : [];
    if (t.length < 1) {
      return { ok: false, error: "No tokens provided." };
    }

    const domain = t.map((x) => ["full_name", "ilike", String(x)]);
    const groupSearch = await rpc("/web/dataset/call_kw/res.groups/search_read", {
      model: "res.groups",
      method: "search_read",
      args: [domain],
      kwargs: { fields: ["id", "name", "full_name"], limit: 50 },
    });
    if (!groupSearch.ok) {
      return { ok: false, error: "res.groups/search_read failed: " + String(groupSearch.error || "") };
    }
    if (!Array.isArray(groupSearch.result) || groupSearch.result.length < 1) {
      return { ok: false, error: "No res.groups matched tokens: " + t.join(", ") };
    }

    const group = groupSearch.result[0] || {};
    const groupId = group && typeof group.id === "number" ? group.id : null;
    if (!groupId) {
      return { ok: false, error: "Invalid group id from search_read." };
    }

    const membership = await rpc("/web/dataset/call_kw/res.groups/search_count", {
      model: "res.groups",
      method: "search_count",
      args: [[["id", "=", groupId], [groupMembershipField, "in", [uid]]]],
      kwargs: {},
    });
    if (!membership.ok) {
      return { ok: false, error: "res.groups/search_count failed: " + String(membership.error || "") };
    }

    return {
      ok: true,
      value: Number(membership.result || 0) > 0,
      via: "res.groups.search_read(full_name ilike ...) + search_count(" + groupMembershipField + ")",
      group_id: groupId,
      group_full_name: group && group.full_name ? String(group.full_name) : null,
      count: membership.result,
    };
  };

  const checkGroup = async (xmlId) => {
    // Prefer querying res.groups membership to avoid stale caches from session-level `user_has_group`.
    const rel = await checkGroupByRelation(xmlId);
    if (rel.ok && typeof rel.value === "boolean") {
      return rel;
    }

    // Odoo Online sometimes lacks a stable XMLID for some groups; use heuristics for the QC groups.
    if (xmlId === "quality_control.group_quality_manager") {
      const qcAdmin = await checkGroupByFullNameTokens(["quality", "administrator"]);
      if (qcAdmin.ok && typeof qcAdmin.value === "boolean") {
        return qcAdmin;
      }
    }
    if (xmlId === "quality_control.group_quality_user") {
      const qcUser = await checkGroupByFullNameTokens(["quality", "user"]);
      if (qcUser.ok && typeof qcUser.value === "boolean") {
        return qcUser;
      }
    }

    const variants = [
      { route: "/web/session/user_has_group", params: { group_ext_id: xmlId }, via: "web.session.user_has_group(group_ext_id)" },
      { route: "/web/session/user_has_group", params: { group: xmlId }, via: "web.session.user_has_group(group)" },
      {
        route: "/web/dataset/call_kw/res.users/has_group",
        params: {
          model: "res.users",
          method: "has_group",
          args: [[sessionInfo && sessionInfo.uid ? sessionInfo.uid : 0], xmlId],
          kwargs: {},
        },
        via: "call_kw([uid], group)",
      },
      {
        route: "/web/dataset/call_kw/res.users/has_group",
        params: {
          model: "res.users",
          method: "has_group",
          args: [xmlId],
          kwargs: {},
        },
        via: "call_kw(group)",
      },
    ];

    const errors = [];
    for (const v of variants) {
      const result = await rpc(v.route, v.params);
      if (result.ok && typeof result.result === "boolean") {
        return { ok: true, value: result.result, via: v.via };
      }
      const errText = result && result.error ? result.error : "no boolean result";
      errors.push(v.via + ": " + errText);
    }
    return { ok: false, error: errors.join(" | ") };
  };

  const groupResults = {};
  const groupEvidence = {};
  for (const xmlId of groupsToCheck) {
    const check = await checkGroup(xmlId);
    groupEvidence[xmlId] = check;
    groupResults[xmlId] = check.ok ? check.value : { error: check.error };
  }

  const modelsToCheck = [
    "quality.point",
    "quality.check",
    "product.template",
    "stock.lot",
    "product.pricing",
  ];
  const operations = ["read", "write", "create", "unlink"];

  const rights = {};
  for (const modelName of modelsToCheck) {
    rights[modelName] = {};
    for (const operation of operations) {
      const accessCheck = await rpc("/web/dataset/call_kw/" + modelName + "/check_access_rights", {
        model: modelName,
        method: "check_access_rights",
        args: [operation, false],
        kwargs: {},
      });
      rights[modelName][operation] = accessCheck.ok ? !!accessCheck.result : { error: accessCheck.error };
    }
  }

  const blockers = [];
  if (hasLogin || hasPassword) {
    blockers.push("Session appears to be on login page. Active authenticated Odoo session is required.");
  }

  if (groupResults["quality_control.group_quality_manager"] !== true) {
    blockers.push("Missing group: Quality / Administrator (quality_control.group_quality_manager).");
  }

  const qpCreate = rights["quality.point"] && rights["quality.point"]["create"];
  if (qpCreate !== true) {
    blockers.push("No create access on model quality.point.");
  }

  const recommendations = [];
  if (qpCreate === true && groupResults["quality_control.group_quality_manager"] === true) {
    recommendations.push("Proceed with QC data load and tutorial capture.");
    recommendations.push("If Quality menus still don't appear, log out and log back in to refresh session groups.");
  } else {
    recommendations.push("Grant current user to Quality / Administrator.");
    recommendations.push("Re-run implementation sync step for QC only after group assignment.");
    recommendations.push("Keep same user for data load and tutorial capture to avoid mismatch.");
  }

  return JSON.stringify({
    ok: blockers.length === 0,
    visited_at: nowIso,
    href: location.href,
    title: document.title,
    ready_state: document.readyState,
    session: {
      call_ok: sessionCall.ok,
      uid,
      user_name: sessionInfo && sessionInfo.name ? sessionInfo.name : null,
      username: sessionInfo && sessionInfo.username ? sessionInfo.username : null,
      db: sessionInfo && sessionInfo.db ? sessionInfo.db : null,
      company_id: sessionInfo && sessionInfo.user_companies && sessionInfo.user_companies.current_company
        ? sessionInfo.user_companies.current_company
        : null,
      is_system: sessionInfo && sessionInfo.is_system ? true : false,
      is_admin_user: sessionInfo && sessionInfo.is_admin_user ? true : false,
      is_internal_user: sessionInfo && sessionInfo.is_internal_user ? true : false,
    },
    probes: {
      group_membership_field: groupMembershipField,
      group_fields_get_ok: groupFieldsGet.ok,
    },
    ui_state: {
      has_login_input: hasLogin,
      has_password_input: hasPassword,
    },
    groups: groupResults,
    groups_evidence: groupEvidence,
    model_access: rights,
    blockers,
    recommendations,
  });
})();
