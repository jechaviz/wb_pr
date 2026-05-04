(() => {
  const sidebar = document.querySelector(
    "div[class*='curriculum-item-list'], [data-purpose='curriculum-sidebar']"
  );
  if (sidebar) return sidebar.innerHTML;
  return (document.body && document.body.innerHTML ? document.body.innerHTML : "").substring(0, 5000) + "...";
})();
