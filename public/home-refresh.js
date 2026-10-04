// The shared header also serves the catalog. Keep this treatment homepage-only.
(() => {
  if (!document.body.classList.contains("home")) return;
  const request = document.querySelector(".head-actions .btn-head-list");
  if (!request) return;
  request.querySelector(".head-list-full").textContent = "Teklif / Görüşme Talebi";
  request.querySelector(".head-list-short").textContent = "Talep Bırak";
  request.querySelector("[data-interest-count]")?.remove();
  request.removeAttribute("aria-label");
})();
