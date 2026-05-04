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
          error_code: errData.code || null,
          error_payload: errData || null,
        };
      }
      return { ok: true, result: body ? body.result : null };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  };

  const hasGroup = async (xmlId) => {
    const variants = [{ group_ext_id: xmlId }, { group: xmlId }];
    for (const params of variants) {
      const check = await rpc("/web/session/user_has_group", params);
      if (check.ok && typeof check.result === "boolean") {
        return check.result;
      }
    }
    return null;
  };

  const sessionCall = await rpc("/web/session/get_session_info", {});
  const sessionInfo = sessionCall.ok ? sessionCall.result : {};
  const uid = sessionInfo && sessionInfo.uid ? sessionInfo.uid : null;

  const result = {
    ok: false,
    visited_at: nowIso,
    href: location.href,
    title: document.title,
    session: {
      call_ok: sessionCall.ok,
      uid,
      username: sessionInfo && sessionInfo.username ? sessionInfo.username : null,
      user_name: sessionInfo && sessionInfo.name ? sessionInfo.name : null,
      db: sessionInfo && sessionInfo.db ? sessionInfo.db : null,
    },
    target_group_xmlid: targetXmlId,
    before: {},
    operations: [],
    after: {},
    error: null,
  };

  if (!uid) {
    result.error = "No active Odoo session uid found.";
    return JSON.stringify(result);
  }

  result.before.has_group = await hasGroup(targetXmlId);

  const fieldsGet = await rpc("/web/dataset/call_kw/res.users/fields_get", {
    model: "res.users",
    method: "fields_get",
    args: [[], ["type", "string"]],
    kwargs: {},
  });
  const userFields = fieldsGet.ok && fieldsGet.result && typeof fieldsGet.result === "object" ? fieldsGet.result : {};
  const userFieldNames = Object.keys(userFields);
  const userGroupishFieldsSample = userFieldNames.filter((n) => n.toLowerCase().includes("group")).slice(0, 80);
  const dynamicSelFields = userFieldNames.filter((n) => n.startsWith("sel_groups_"));
  const dynamicInGroupFields = userFieldNames.filter((n) => n.startsWith("in_group_"));
  result.operations.push({
    name: "inspect_res_users_fields",
    ok: fieldsGet.ok,
    total_fields: userFieldNames.length,
    groupish_fields_sample: userGroupishFieldsSample,
    sel_group_fields: dynamicSelFields.length,
    in_group_fields: dynamicInGroupFields.length,
    has_groups_id: Object.prototype.hasOwnProperty.call(userFields, "groups_id"),
    has_groups: Object.prototype.hasOwnProperty.call(userFields, "groups"),
  });

  const groupFieldsGet = await rpc("/web/dataset/call_kw/res.groups/fields_get", {
    model: "res.groups",
    method: "fields_get",
    args: [[], ["type", "string"]],
    kwargs: {},
  });
  const groupFields =
    groupFieldsGet.ok && groupFieldsGet.result && typeof groupFieldsGet.result === "object" ? groupFieldsGet.result : {};
  const groupFieldNames = Object.keys(groupFields);
  result.operations.push({
    name: "inspect_res_groups_fields",
    ok: groupFieldsGet.ok,
    total_fields: groupFieldNames.length,
    has_users: Object.prototype.hasOwnProperty.call(groupFields, "users"),
    fields_sample: groupFieldNames.slice(0, 80),
  });

  const groupLookup = await rpc("/web/dataset/call_kw/ir.model.data/search_read", {
    model: "ir.model.data",
    method: "search_read",
    args: [[
      ["module", "=", "quality_control"],
      ["name", "=", "group_quality_manager"],
      ["model", "=", "res.groups"],
    ]],
    kwargs: { fields: ["id", "res_id", "module", "name"], limit: 1 },
  });
  result.operations.push({ name: "lookup_group_xmlid", ok: groupLookup.ok });

  let targetGroupId = null;
  if (groupLookup.ok && Array.isArray(groupLookup.result) && groupLookup.result.length > 0) {
    targetGroupId = groupLookup.result[0].res_id || null;
  } else {
    const fallbackGroupLookup = await rpc("/web/dataset/call_kw/res.groups/search_read", {
      model: "res.groups",
      method: "search_read",
      args: [[["name", "=", "Administrator"]]],
      kwargs: { fields: ["id", "name", "full_name"], limit: 200 },
    });
    result.operations.push({ name: "lookup_group_fallback", ok: fallbackGroupLookup.ok });
    if (fallbackGroupLookup.ok && Array.isArray(fallbackGroupLookup.result)) {
      const found = fallbackGroupLookup.result.find((g) => {
        const full = (g && g.full_name ? String(g.full_name) : "").toLowerCase();
        return full.includes("quality") && full.includes("administrator");
      });
      if (found && found.id) {
        targetGroupId = found.id;
      }
    }
  }

  result.before.group_id = targetGroupId;

  if (!targetGroupId) {
    result.error = "Unable to resolve group id for " + targetXmlId;
    return JSON.stringify(result);
  }

  const assignAttempts = [];
  const candidateWrites = [];
  const targetInGroupField = "in_group_" + String(targetGroupId);
  const targetSelFields = dynamicSelFields.filter((fieldName) => {
    const ids = fieldName
      .replace("sel_groups_", "")
      .split("_")
      .map((part) => Number(part))
      .filter((n) => Number.isFinite(n) && n > 0);
    return ids.includes(targetGroupId);
  });

  if (Object.prototype.hasOwnProperty.call(userFields, "groups_id")) {
    candidateWrites.push({
      mode: "groups_id_m2m_link",
      values: { groups_id: [[4, targetGroupId]] },
    });
  } else {
    candidateWrites.push({
      mode: "groups_id_m2m_link_blind",
      values: { groups_id: [[4, targetGroupId]] },
    });
  }
  if (Object.prototype.hasOwnProperty.call(userFields, "groups")) {
    candidateWrites.push({
      mode: "groups_m2m_link",
      values: { groups: [[4, targetGroupId]] },
    });
  } else {
    candidateWrites.push({
      mode: "groups_m2m_link_blind",
      values: { groups: [[4, targetGroupId]] },
    });
  }
  for (const fieldName of targetSelFields) {
    const values = {};
    values[fieldName] = targetGroupId;
    candidateWrites.push({
      mode: "sel_groups_selector",
      field: fieldName,
      values,
    });
  }
  if (Object.prototype.hasOwnProperty.call(userFields, targetInGroupField)) {
    const values = {};
    values[targetInGroupField] = true;
    candidateWrites.push({
      mode: "in_group_flag",
      field: targetInGroupField,
      values,
    });
  } else {
    const values = {};
    values[targetInGroupField] = true;
    candidateWrites.push({
      mode: "in_group_flag_blind",
      field: targetInGroupField,
      values,
    });
  }

  let writeSucceeded = false;
  for (const attempt of candidateWrites) {
    const writeGroup = await rpc("/web/dataset/call_kw/res.users/write", {
      model: "res.users",
      method: "write",
      args: [[uid], attempt.values],
      kwargs: {},
    });
    assignAttempts.push({
      mode: attempt.mode,
      field: attempt.field || null,
      ok: writeGroup.ok && !!writeGroup.result,
      error: writeGroup.ok ? null : writeGroup.error,
    });
    if (writeGroup.ok && !!writeGroup.result) {
      writeSucceeded = true;
      break;
    }
  }
  result.operations.push({
    name: "assign_group_to_current_user",
    ok: writeSucceeded,
    attempts: assignAttempts,
  });

  // Fallback: write group membership from the group side.
  // This tends to work even when Odoo Online hides dynamic `in_group_*` fields from `res.users`.
  const groupAssignAttempts = [];
  let groupWriteSucceeded = false;
  let groupAssignedViaField = null;
  if (!writeSucceeded) {
    const groupUserFieldCandidates = ["users", "user_ids", "users_ids"];
    const groupCandidateWrites = groupUserFieldCandidates.map((fieldName) => {
      const present = Object.prototype.hasOwnProperty.call(groupFields, fieldName);
      const values = {};
      values[fieldName] = [[4, uid]];
      return {
        field: fieldName,
        // Avoid `${...}` in strings because WAIBA TemplateEngine expands `${VAR}` inside JS too.
        mode: present ? ("group_" + fieldName + "_m2m_link") : ("group_" + fieldName + "_m2m_link_blind"),
        values,
      };
    });

    for (const attempt of groupCandidateWrites) {
      const writeGroupUsers = await rpc("/web/dataset/call_kw/res.groups/write", {
        model: "res.groups",
        method: "write",
        args: [[targetGroupId], attempt.values],
        kwargs: {},
      });
      groupAssignAttempts.push({
        mode: attempt.mode,
        field: attempt.field || null,
        ok: writeGroupUsers.ok && !!writeGroupUsers.result,
        error: writeGroupUsers.ok ? null : writeGroupUsers.error,
        error_name: writeGroupUsers.ok ? null : writeGroupUsers.error_name || null,
        error_code: writeGroupUsers.ok ? null : writeGroupUsers.error_code || null,
      });
      if (writeGroupUsers.ok && !!writeGroupUsers.result) {
        groupWriteSucceeded = true;
        groupAssignedViaField = attempt.field || null;
        break;
      }
    }
  }
  result.operations.push({
    name: "assign_group_to_current_user_via_res_groups",
    ok: groupWriteSucceeded,
    skipped: writeSucceeded,
    attempts: groupAssignAttempts,
  });

  let groupMembershipCheck = { ok: true, result: null };
  let groupMembershipCheckField = null;
  if (groupAssignedViaField) {
    groupMembershipCheckField = groupAssignedViaField;
  } else if (Object.prototype.hasOwnProperty.call(groupFields, "users")) {
    groupMembershipCheckField = "users";
  } else if (Object.prototype.hasOwnProperty.call(groupFields, "user_ids")) {
    groupMembershipCheckField = "user_ids";
  } else if (Object.prototype.hasOwnProperty.call(groupFields, "users_ids")) {
    groupMembershipCheckField = "users_ids";
  }

  if (groupMembershipCheckField) {
    const domain = [["id", "=", targetGroupId], [groupMembershipCheckField, "in", [uid]]];
    groupMembershipCheck = await rpc("/web/dataset/call_kw/res.groups/search_count", {
      model: "res.groups",
      method: "search_count",
      args: [domain],
      kwargs: {},
    });
  }

  const qpCreateCheck = await rpc("/web/dataset/call_kw/quality.point/check_access_rights", {
    model: "quality.point",
    method: "check_access_rights",
    args: ["create", false],
    kwargs: {},
  });

  result.after.has_group = await hasGroup(targetXmlId);
  result.after.group_has_user_check_field = groupMembershipCheckField;
  result.after.group_has_user = groupMembershipCheckField && groupMembershipCheck.ok ? Number(groupMembershipCheck.result || 0) > 0 : null;
  result.after.group_has_user_error = groupMembershipCheckField && groupMembershipCheck.ok ? null : groupMembershipCheck.error || null;
  result.after.quality_point_create_access = qpCreateCheck.ok ? !!qpCreateCheck.result : null;
  result.after.quality_point_create_access_error = qpCreateCheck.ok ? null : qpCreateCheck.error;
  const hasGroupVerified = result.after.group_has_user === true || result.after.has_group === true;
  const hasCreateAccess = result.after.quality_point_create_access === true;
  result.ok = hasCreateAccess && (hasGroupVerified || result.after.has_group === null);

  if (result.ok) {
    result.error = null;
  } else if (!result.error) {
    result.error = "Grant attempted but verification did not pass.";
  }

  return JSON.stringify(result);
})();
