(() => {
  try {
    const selectors =
      "div[data-purpose*=go-to-next],button[data-purpose*=go-to-next],a[data-purpose*=go-to-next],div[data-purpose*=next-item],button[data-purpose*=next-item],a[data-purpose*=next-item]";

    const direct = Array.from(document.querySelectorAll(selectors));
    let btn = direct.find((el) => !el.disabled) || direct[0] || null;

    if (!btn) {
      const fallback = Array.from(document.querySelectorAll("button,a,div,span"));
      btn = fallback.find((el) => {
        const text = ((el.innerText || "") + " " + (el.getAttribute("aria-label") || "")).trim();
        return /Siguiente|Next|Continue|Continuar/i.test(text) && !el.disabled;
      }) || null;
    }

    if (!btn) {
      return JSON.stringify({ clicked: false, reason: "not_found" });
    }

    const clickable = btn.closest ? (btn.closest("button,a,div") || btn) : btn;
    clickable.click();
    return JSON.stringify({ clicked: true, reason: "clicked" });
  } catch (e) {
    return JSON.stringify({
      clicked: false,
      reason: "error",
      message: e && e.message ? e.message : String(e)
    });
  }
})();
