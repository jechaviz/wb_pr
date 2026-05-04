(() => {
  const pickTitle = () => {
    const selectors = [
      "[data-purpose*='lecture-title']",
      "h1[data-purpose*='title']",
      "h1",
      "[data-purpose='sidebar-content'] [aria-current='true'] [data-purpose='item-title']",
      "[data-purpose='item-title']"
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const txt = (el.innerText || "").trim();
      if (txt.length > 1) return txt;
    }
    return "";
  };

  const sanitize = (text) =>
    (text || "")
      .replace(/[\\/:*?"<>|]/g, "_")
      .replace(/\s+/g, " ")
      .trim();

  const href = location.href || "";
  const m = href.match(/lecture\/(\d+)/i);
  const lectureId = m ? m[1] : "";
  let title = pickTitle();
  if (!title) {
    title = (document.title || "").replace(/\s*-\s*Udemy.*/i, "").trim();
  }

  const safeTitle = sanitize(title || ("lecture_" + Date.now()));
  const fileName = (lectureId ? lectureId + " - " : "") + safeTitle;

  return JSON.stringify({
    url: href,
    lecture_id: lectureId,
    title: title,
    safe_title: safeTitle,
    file_name: fileName
  });
})();
