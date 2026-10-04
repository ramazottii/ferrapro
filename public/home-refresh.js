// The shared header also serves the catalog. Keep this treatment homepage-only.
(() => {
  if (!document.body.classList.contains("home")) return;
  const request = document.querySelector(".head-actions .btn-head-list");
  if (!request) return;
  request.querySelector(".head-list-full").textContent = "Teklif / Görüşme Talebi";
  request.querySelector(".head-list-short").textContent = "Talep Bırak";
})();

// Messages remain readable as stacked cards when JavaScript is unavailable.
(() => {
  const root = document.querySelector("[data-contact-carousel]");
  if (!root) return;
  const slides = [...root.querySelectorAll("[data-story]")];
  const choices = [...root.querySelectorAll("[data-story-select]")];
  const play = root.querySelector("[data-story-play]");
  const status = root.querySelector("[data-story-status]");
  let current = 0;
  let playing = false;
  let hovering = false;
  let visible = true;
  let timer;

  function schedule() {
    clearTimeout(timer);
    if (playing && !hovering && visible && !document.hidden) {
      timer = setTimeout(() => show(current + 1, false), 8000);
    }
  }

  function setPlaying(value) {
    playing = value;
    play.textContent = value ? "Duraklat" : "Oynat";
    play.setAttribute("aria-label", value ? "Otomatik oynatmayı duraklat" : "Mesajları otomatik oynat");
    play.setAttribute("aria-pressed", String(value));
    schedule();
  }

  function show(index, manual = true) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    choices.forEach((choice, i) => choice.setAttribute("aria-pressed", String(i === current)));
    if (manual) {
      setPlaying(false);
      status.textContent = slides[current].getAttribute("aria-label");
    }
    schedule();
  }

  choices.forEach((choice, i) => {
    choice.addEventListener("click", () => show(i));
    choice.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? slides.length - 1 : current + (event.key === "ArrowRight" ? 1 : -1);
      show(next);
      choices[current].focus();
    });
  });
  root.querySelector("[data-story-prev]").addEventListener("click", () => show(current - 1));
  root.querySelector("[data-story-next]").addEventListener("click", () => show(current + 1));
  play.addEventListener("click", () => setPlaying(!playing));
  root.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    hovering = true;
    schedule();
  });
  root.addEventListener("pointerleave", () => { hovering = false; schedule(); });
  root.addEventListener("focusin", (event) => {
    if (event.target !== play) setPlaying(false);
  });
  document.addEventListener("visibilitychange", schedule);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }, { threshold: 0.15 }).observe(root);
  }
  root.querySelectorAll(".contact-story-art").forEach((art) => {
    let start;
    art.addEventListener("touchstart", (event) => {
      start = event.touches.length === 1 ? [event.touches[0].clientX, event.touches[0].clientY] : null;
    }, { passive: true });
    art.addEventListener("touchend", (event) => {
      if (!start) return;
      const dx = event.changedTouches[0].clientX - start[0];
      const dy = event.changedTouches[0].clientY - start[1];
      start = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 2) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
    art.addEventListener("touchcancel", () => { start = null; });
  });
  root.classList.add("is-ready");
  root.querySelector("[data-story-controls]").hidden = false;
  show(0, false);
})();
