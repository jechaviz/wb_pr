(() => {
  try {
    const root = document.documentElement;
    if (!root) {
      return { ok: false, reason: "no_document_element" };
    }
    root.setAttribute("data-waiba-supercontrol", "enabled");
    return {
      ok: true,
      href: String(location.href || ""),
      title: String(document.title || ""),
      marker: "data-waiba-supercontrol=enabled"
    };
  } catch (error) {
    return {
      ok: false,
      reason: String((error && error.message) || error || "unknown_error")
    };
  }
})()
