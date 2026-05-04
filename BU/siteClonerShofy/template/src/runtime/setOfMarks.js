export function applySetOfMarks() {
const selectors = [
"a",
"button",
"input",
"select",
"textarea",
"summary",
"[role='button']",
"[role='link']",
"[onclick]",
"[tabindex]:not([tabindex='-1'])"
];
const nodes = Array.from(document.querySelectorAll(selectors.join(","))).filter(function (el) {
const rect = el.getBoundingClientRect();
return rect.width > 2 && rect.height > 2;
});
document.querySelectorAll(".waiba-som-mark").forEach(function (n) { n.remove(); });
const data = [];
nodes.forEach(function (el, idx) {
const id = idx + 1;
el.setAttribute("data-waiba-mark-id", String(id));
const rect = el.getBoundingClientRect();
const mark = document.createElement("div");
mark.className = "waiba-som-mark";
mark.textContent = String(id);
mark.style.position = "fixed";
mark.style.left = Math.max(0, rect.left) + "px";
mark.style.top = Math.max(0, rect.top - 16) + "px";
mark.style.zIndex = "2147483647";
mark.style.pointerEvents = "none";
mark.style.background = "#111827";
mark.style.color = "#fff";
mark.style.fontSize = "10px";
mark.style.fontWeight = "700";
mark.style.padding = "1px 5px";
mark.style.borderRadius = "999px";
mark.style.boxShadow = "0 1px 2px rgba(0,0,0,.35)";
document.body.appendChild(mark);
data.push({ id: id, tag: (el.tagName || "").toLowerCase(), text: (el.innerText || el.value || "").trim().slice(0, 120) });
});
return { ok: true, count: data.length, marks: data };
}