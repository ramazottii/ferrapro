const WA = "905307161877";

const GRUPLAR = [
  { g: "A", ad: "Temizlik Kâğıtları" },
  { g: "B", ad: "Sıvı Temizlik Ürünleri" },
  { g: "C", ad: "Aparatlar ve Ekipmanlar" },
  { g: "D", ad: "Temizlik Sarf Ürünleri" },
  { g: "E", ad: "Gıda ve Atıştırmalıklar" },
  { g: "F", ad: "Kırtasiye ve Ofis Sarf Ürünleri" },
];

const VITRIN_GRUPLAR = ["A", "B", "C", "D", "E", "F"];

const GRUP_SLUG = {
  Hijyen: "A",
  "temizlik-kagitlari": "A",
  Temizlik: "B",
  "sivi-temizlik-urunleri": "B",
  Aparat: "C",
  "aparat-ve-ekipmanlar": "C",
  Gıda: "E",
  Mutfak: "E",
  "Mutfak / İkram": "E",
  gida: "E",
  Kırtasiye: "F",
  "kirtasiye-ve-ofis-urunleri": "F",
  Ambalaj: "F",
  "sarf-ve-ambalaj-urunleri": "F",
  PC: "F",
  "PC Sarf": "F",
  "bilgisayar-sarf-urunleri": "F",
};

const ALT_SLUG = {
  "havlu-ve-peceteler": "A1",
  "islak-havlular": "A2",
  "tuvalet-kagitlari": "A3",
  "endustriyel-temizlik-urunleri": "B1",
  "genel-kullanim-temizlik-urunleri": "B2",
  "havlu-aparatlari": "C1",
  "sivi-sabun-ve-kopuk-sabun-aparatlari": "C2",
  "cop-kovalari": "C3",
  "cop-posetleri": "D1",
  "temizlik-sarf-urunleri": "D2",
  "kullan-at-urunler": "D3",
};

const SATIR_MAX = 2000;

const GRUP_FOTO = {
  A: "/img/products/daire-temizlik-kagitlari.webp",
  B: "/img/products/daire-sivi-temizlik.webp",
  C: "/img/products/daire-aparat-ekipman.webp",
  D: "/img/products/daire-temizlik.webp",
  E: "/img/products/daire-gida-ikram.webp",
  F: "/img/products/daire-kirtasiye-ofis.webp",
};

const POPULER_MARKALAR = {
  A: [
    { ad: "Espiga", logo: "/img/brands/espiga.webp" },
    { ad: "Selpak", logo: "/img/brands/selpak.webp" },
    { ad: "Belinno", logo: "/img/brands/belinno.webp" },
    { ad: "Sleepy", logo: "/img/brands/sleepy.webp" },
    { ad: "Papia", logo: "/img/brands/papia.webp" },
    { ad: "Solo", logo: "/img/brands/solo.webp" },
    { ad: "Familia", logo: "/img/brands/familia.webp" },
    { ad: "Polente", logo: "/img/brands/polente.webp" },
    { ad: "DeepFresh", logo: "/img/brands/deepfresh.webp" },
    { ad: "Freshmaker", logo: "/img/brands/freshmaker.webp" },
    { ad: "Komili", logo: "/img/brands/komili.webp" },
    { ad: "Teno", logo: "/img/brands/teno.webp" },
    { ad: "Rulopak", logo: "/img/brands/rulopak.webp" },
  ],
  B: [
    { ad: "Yumoş", logo: "/img/brands/yumos.webp" },
    { ad: "Vernel", logo: "/img/brands/vernel.webp" },
    { ad: "Ozopak", logo: "/img/brands/ozopak.webp" },
    { ad: "Fairy", logo: "/img/brands/fairy.webp" },
    { ad: "Domestos", logo: "/img/brands/domestos.webp" },
    { ad: "Cif", logo: "/img/brands/cif.webp" },
    { ad: "Pril", logo: "/img/brands/pril.webp" },
    { ad: "Finish", logo: "/img/brands/finish.webp" },
    { ad: "Asperox", logo: "/img/brands/asperox.webp" },
    { ad: "Porçöz", logo: "/img/brands/porcoz.webp" },
  ],
  C: [
    { ad: "Vileda", logo: "/img/brands/vileda.webp" },
    { ad: "Parex", logo: "/img/brands/parex.webp" },
    { ad: "Palex", logo: "/img/brands/palex.webp" },
    { ad: "Vialli", logo: "/img/brands/vialli.webp" },
    { ad: "Flosoft", logo: "/img/brands/flosoft.webp" },
    { ad: "Scotch-Brite", logo: "/img/brands/scotchbrite.webp" },
  ],
  D: [
    { ad: "Koroplast", logo: "/img/brands/koroplast.webp" },
    { ad: "Parex", logo: "/img/brands/parex.webp" },
    { ad: "Ceymop", logo: "/img/brands/ceymop.webp" },
    { ad: "Ozopak", logo: "/img/brands/ozopak.webp" },
    { ad: "Vileda", logo: "/img/brands/vileda.webp" },
    { ad: "Scotch-Brite", logo: "/img/brands/scotchbrite.webp" },
  ],
  E: [
    { ad: "Eti", logo: "/img/brands/eti.webp" },
    { ad: "Lipton", logo: "/img/brands/lipton.webp" },
    { ad: "Nestlé", logo: "/img/brands/nestle.webp" },
    { ad: "Pınar", logo: "/img/brands/pinar.webp" },
    { ad: "Erikli", logo: "/img/brands/erikli.webp" },
    { ad: "Ülker", logo: "/img/brands/ulker.webp" },
    { ad: "Çaykur", logo: "/img/brands/caykur.webp" },
    { ad: "Doğuş", logo: "/img/brands/dogus.webp" },
    { ad: "Mehmet Efendi", logo: "/img/brands/mehmetefendi.webp" },
  ],
  F: [
    { ad: "Faber-Castell", logo: "/img/brands/faber.webp" },
    { ad: "Pilot", logo: "/img/brands/pilot.webp" },
    { ad: "uni-ball", logo: "/img/brands/uniball.webp" },
    { ad: "BIC", logo: "/img/brands/bic.webp" },
    { ad: "edding", logo: "/img/brands/edding.webp" },
    { ad: "Navigator", logo: "/img/brands/navigator.webp" },
    { ad: "Pritt", logo: "/img/brands/pritt.webp" },
    { ad: "UHU", logo: "/img/brands/uhu.webp" },
    { ad: "Leitz", logo: "/img/brands/leitz.webp" },
    { ad: "noki", logo: "/img/brands/noki.webp" },
    { ad: "3M", logo: "/img/brands/mmm.webp" },
    { ad: "tesa", logo: "/img/brands/tesa.webp" },
    { ad: "Scotch", logo: "/img/brands/scotch.webp" },
    { ad: "Logitech", logo: "/img/brands/logitech.webp" },
    { ad: "Canon", logo: "/img/brands/canon.webp" },
    { ad: "Epson", logo: "/img/brands/epson.webp" },
  ],
};

function kacis(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function kacisAttr(s) {
  return kacis(s).replace(/"/g, "&quot;");
}

function grupAnahtar(g) {
  if (g === "Sağlık" || g === "Sağlık Sarf") return ["Sağlık", "Klinik"];
  return g ? [g] : [];
}

function gecerliA(a) {
  const raw = String(a || "").trim();
  if (!raw) return "";
  if (ALT_SLUG[raw]) return ALT_SLUG[raw];
  if (/^[A-F][1-9]$/.test(raw)) return raw;
  return "";
}

function gecerliG(g, a) {
  const alt = gecerliA(a);
  if (alt) return alt.charAt(0);
  const mapped = GRUP_SLUG[g] || g;
  return GRUPLAR.some((x) => x.g === mapped) ? mapped : "";
}

function grupFormDeger(g) {
  return gecerliG(g);
}

function teklifHref(g, satir) {
  const p = new URLSearchParams();
  const gOk = gecerliG(g);
  if (gOk) p.set("g", gOk);
  const s = String(satir || "").slice(0, SATIR_MAX);
  if (s) p.set("satir", s);
  return "/siparis?" + p.toString();
}

function katalogYol({ g, q, a, u }) {
  const p = new URLSearchParams();
  if (g) p.set("g", g);
  if (q) p.set("q", q);
  if (a) p.set("a", a);
  if (u) p.set("u", u);
  const s = p.toString();
  return "/urunler" + (s ? "?" + s : "");
}

function header(active) {
  const params = new URLSearchParams(location.search);
  const qVal = kacisAttr(params.get("q") || "");
  const path = location.pathname.replace(/\.html$/, "");
  const gKeep = path === "/urunler" ? gecerliG(params.get("g") || "", params.get("a") || "") : "";
  const on = (href) => active === href;
  const link = (href, label) => `<a href="${href}" ${on(href) ? 'aria-current="page"' : ""} class="${on(href) ? "is-on" : ""}">${label}</a>`;
  const ctaOn = on("/siparis") ? " is-on" : "";
  const gHidden = gKeep ? `<input type="hidden" name="g" value="${kacisAttr(gKeep)}" />` : "";
  const bandHref = active === "/" ? "#teklif-al" : "/siparis";
  const drops = GRUPLAR.map((g) => `<li><a href="${katalogYol({ g: g.g })}">${g.ad}</a></li>`).join("");
  return `<div class="head-bar">
    <div class="head-inner">
      <p class="head-bar-full">İşletmenizin ihtiyaçları için tek iletişim noktası.</p>
      <p class="head-bar-short">İşletmeniz için tek iletişim noktası.</p>
      <div class="head-bar-links">
        <a href="tel:+905307161877">+90 530 716 18 77</a>
      </div>
    </div>
  </div>
  <div class="head-main">
    <div class="head-inner">
      <a class="brand" href="/" aria-label="FerraPro"><img class="brand-logo" src="/logo/ferrapro-header.png?v=1" width="1264" height="342" alt="FerraPro"></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menü"><span></span></button>
      <nav id="site-nav">
        <div class="head-drop">
          <a href="/urunler" class="head-drop-link${on("/urunler") ? " is-on" : ""}" ${on("/urunler") ? 'aria-current="page"' : ""}>Ürünler</a>
          <button class="head-drop-toggle" type="button" aria-expanded="false" aria-label="Ürün grupları"></button>
          <ul class="head-drop-menu">${drops}</ul>
        </div>
        ${link("/hakkimizda", "Hakkımızda")}
        ${link("/sektorler", "Sektörler")}
        ${link("/iletisim", "İletişim")}
        <form class="seek" action="/urunler" method="get" role="search">
          <label class="sr" for="q">Ürün ara</label>
          ${gHidden}
          <input id="q" type="search" name="q" placeholder="Ürün ara" value="${qVal}" />
        </form>
        <a class="head-nav-extra" href="mailto:info@ferrapro.com">E-posta iletişimi</a>
      </nav>
      <div class="head-actions">
        <a class="btn btn-head btn-head-wa" href="https://wa.me/${WA}"><span class="head-cta-full">WhatsApp’tan Yazın</span><span class="head-cta-short">WhatsApp</span></a>
        <a class="btn btn-head btn-head-list${ctaOn}" href="/siparis"><span class="head-list-full">Teklif / Görüşme Talebi</span><span class="head-list-short">Talep Bırak</span> <span data-interest-count hidden></span></a>
      </div>
    </div>
  </div>
  <div class="head-band">
    <div class="head-band-fx" aria-hidden="true"></div>
    <div class="head-inner">
      <p class="head-band-full">İhtiyacınızı iletin, uygun ürünleri birlikte bulalım.</p>
      <p class="head-band-short">İhtiyacınızı iletin, hızlı teklif alın</p>
      <a class="head-band-btn" href="${bandHref}">Teklif İste</a>
    </div>
  </div>`;
}

function footer() {
  return `<div class="foot-inner">
    <div class="foot-brand">
      <a class="brand brand-stack" href="/" aria-label="FerraPro"><img class="brand-logo-stack" src="/logo/ferrapro.png?v=1" width="901" height="523" alt="FerraPro"></a>
      <p>Kurumsal ürün tedarikinde güvenilir çözüm ortağınız.</p>
    </div>
    <nav class="foot-col" aria-label="Ürünler">
      <h2>Ürünler</h2>
      ${GRUPLAR.map((g) => `<a href="${katalogYol({ g: g.g })}">${g.ad}</a>`).join("")}
    </nav>
    <nav class="foot-col" aria-label="Kurumsal">
      <h2>Kurumsal</h2>
      <a href="/hakkimizda">Hakkımızda</a>
      <a href="/sektorler">Sektörler</a>
      <a href="/iletisim">İletişim</a>
      <a href="/kvkk">KVKK aydınlatma metni</a>
    </nav>
    <div class="foot-col">
      <h2>İletişim</h2>
      <a href="tel:+905307161877">+90 530 716 18 77</a>
      <a href="mailto:info@ferrapro.com">info@ferrapro.com</a>
      <span>ferrapro.com</span>
      <span>İstanbul</span>
    </div>
  </div>
  <p class="foot-copy">© 2026 FerraPro. Tüm hakları saklıdır.</p>`;
}

document.querySelectorAll("[data-head]").forEach((el) => {
  el.innerHTML = header(el.dataset.head || "/");
});
document.querySelectorAll("[data-foot]").forEach((el) => {
  el.innerHTML = footer();
});

function bindNav() {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const drop = document.querySelector(".head-drop");
  const dropBtn = document.querySelector(".head-drop-toggle");
  const dropLink = document.querySelector(".head-drop-link");
  if (!btn || !nav) return;

  const setOpen = (open) => {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
    if (!open && drop) setDrop(false);
  };
  const setDrop = (open) => {
    if (!drop || !dropBtn) return;
    drop.classList.toggle("is-open", open);
    dropBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  btn.addEventListener("click", () => {
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });
  if (dropBtn) {
    dropBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDrop(!drop.classList.contains("is-open"));
    });
  }
  if (dropLink) {
    dropLink.addEventListener("click", (e) => {
      if (!window.matchMedia("(max-width: 768px)").matches) return;
      e.preventDefault();
      setDrop(!drop.classList.contains("is-open"));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (drop?.classList.contains("is-open")) {
      setDrop(false);
      dropBtn?.focus();
      return;
    }
    if (btn.getAttribute("aria-expanded") !== "true") return;
    setOpen(false);
    btn.focus();
  });

  document.addEventListener("click", (e) => {
    if (drop && !drop.contains(e.target)) setDrop(false);
    if (btn.getAttribute("aria-expanded") !== "true") return;
    if (btn.contains(e.target) || nav.contains(e.target)) return;
    setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 769px)").matches) setOpen(false);
  });
}
bindNav();

function bindKampSlider() {
  const root = document.querySelector("[data-kamp-slider]");
  if (!root) return;
  const viewport = root.querySelector(".kamp-viewport");
  const slides = [...root.querySelectorAll(".kamp-slide")];
  const prev = root.querySelector(".kamp-prev");
  const next = root.querySelector(".kamp-next");
  const dots = root.querySelector(".kamp-dots");
  if (!viewport || slides.length < 2) return;
  let i = 0;
  let timer = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  slides.forEach((_, di) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Kampanya ${di + 1}`);
    b.addEventListener("click", () => go(di, true));
    dots.appendChild(b);
  });
  function go(n, stop) {
    i = (n + slides.length) % slides.length;
    viewport.scrollTo({ left: slides[i].offsetLeft, behavior: reduce ? "auto" : "smooth" });
    dots.querySelectorAll("button").forEach((b, di) => b.setAttribute("aria-current", di === i ? "true" : "false"));
    if (stop) restart();
  }
  function restart() {
    clearInterval(timer);
    if (reduce) return;
    timer = setInterval(() => go(i + 1), 6500);
  }
  prev.addEventListener("click", () => go(i - 1, true));
  next.addEventListener("click", () => go(i + 1, true));
  viewport.addEventListener("scroll", () => {
    const nextI = Math.round(viewport.scrollLeft / Math.max(viewport.clientWidth, 1));
    if (nextI === i || nextI < 0 || nextI >= slides.length) return;
    i = nextI;
    dots.querySelectorAll("button").forEach((b, di) => b.setAttribute("aria-current", di === i ? "true" : "false"));
  }, { passive: true });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  go(0);
  restart();
}
bindKampSlider();

function bindHeroBanners() {
  const root = document.querySelector("[data-hero-banners]");
  if (!root) return;
  const frame = root.querySelector(".home-banners-frame");
  const slides = [...root.querySelectorAll(".home-banner")];
  const prev = root.querySelector(".home-banners-prev");
  const next = root.querySelector(".home-banners-next");
  const dots = root.querySelector(".home-banners-dots");
  if (!frame || slides.length < 2) return;
  let i = 0;
  let timer = 0;
  let startX = 0;
  let swiped = false;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const labels = slides.map((s) => s.getAttribute("aria-label") || `Slayt ${slides.indexOf(s) + 1}`);
  if (WA) {
    root.querySelectorAll("[data-wa]").forEach((a) => {
      a.href = `https://wa.me/${WA}`;
    });
  }
  root.setAttribute("tabindex", "0");
  slides.forEach((_, di) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", labels[di]);
    b.addEventListener("click", () => go(di, true));
    dots.appendChild(b);
  });
  function syncHits() {
    slides.forEach((s, di) => {
      const on = di === i;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-hidden", on ? "false" : "true");
      s.querySelectorAll("a").forEach((a) => {
        if (on) a.removeAttribute("tabindex");
        else a.setAttribute("tabindex", "-1");
      });
    });
    dots.querySelectorAll("button").forEach((b, di) => {
      if (di === i) {
        b.setAttribute("aria-current", "true");
        b.setAttribute("aria-selected", "true");
      } else {
        b.removeAttribute("aria-current");
        b.setAttribute("aria-selected", "false");
      }
    });
  }
  function go(n, stop) {
    i = (n + slides.length) % slides.length;
    syncHits();
    if (stop) restart();
  }
  function restart() {
    clearInterval(timer);
    if (reduce) return;
    timer = setInterval(() => go(i + 1), 5000);
  }
  prev.addEventListener("click", () => go(i - 1, true));
  next.addEventListener("click", () => go(i + 1, true));
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  root.addEventListener("focusin", () => clearInterval(timer));
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) restart();
  });
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(i - 1, true);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(i + 1, true);
    }
  });
  frame.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
    clearInterval(timer);
  }, { passive: true });
  frame.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      swiped = true;
      go(dx > 0 ? i - 1 : i + 1, true);
    } else restart();
  }, { passive: true });
  frame.addEventListener("click", (e) => {
    if (!swiped) return;
    e.preventDefault();
    e.stopPropagation();
    swiped = false;
  }, true);
  go(0);
  restart();
}
bindHeroBanners();

function bindTrust() {
  const root = document.querySelector(".trust");
  if (!root) return;
  const btn = root.querySelector(".trust-toggle");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncMotion = () => {
    root.classList.toggle("is-static", motion.matches);
    if (btn) btn.hidden = motion.matches;
  };
  syncMotion();
  motion.addEventListener("change", syncMotion);
  if (!btn) return;
  const setPaused = (paused) => {
    root.classList.toggle("is-paused", paused);
    btn.setAttribute("aria-pressed", paused ? "true" : "false");
    btn.textContent = paused ? "Devam et" : "Duraklat";
  };
  btn.addEventListener("click", () => {
    setPaused(!root.classList.contains("is-paused"));
  });
}
bindTrust();

const ALTLAR = {
  A: [
    { id: "A1", ad: "Havlu ve Peçeteler", test: () => false, gorsel: "/img/products/daire-havlu-pecete.webp" },
    { id: "A2", ad: "Islak Havlular", test: () => false, gorsel: "/img/products/daire-islak-havlu.webp" },
    { id: "A3", ad: "Tuvalet Kağıtları", test: () => false, gorsel: "/img/products/daire-tuvalet-kagidi.webp" },
  ],
  B: [
    { id: "B1", ad: "Endüstriyel Temizlik Ürünleri", test: () => false, gorsel: "/img/products/daire-endustriyel-sivi.webp" },
    { id: "B2", ad: "Genel Temizlik Ürünleri", test: () => false, gorsel: "/img/products/daire-genel-temizlik.webp" },
  ],
  C: [
    { id: "C1", ad: "Havlu Aparatları", test: () => false, gorsel: "/img/products/daire-havlu-aparat.webp" },
    { id: "C2", ad: "Sıvı Sabun ve Köpük Sabun Aparatları", test: () => false, gorsel: "/img/products/daire-sabun-aparat.webp" },
    { id: "C3", ad: "Çöp Kovaları", test: () => false, gorsel: "/img/products/daire-cop-kovasi.webp" },
    { id: "C4", ad: "Mop Aparatları", test: () => false, gorsel: "/img/products/daire-mop-aparat.webp" },
  ],
  D: [
    { id: "D1", ad: "Çöp Poşetleri", test: () => false, gorsel: "/img/products/daire-cop-poseti.webp" },
    { id: "D2", ad: "Sarf Malzemeleri", test: () => false, gorsel: "/img/products/daire-sarf.webp" },
    { id: "D3", ad: "Kullan At Ürünler", test: () => false, gorsel: "/img/products/daire-kullan-at.webp" },
  ],
  E: [
    { id: "E1", ad: "Çay ve Şekerler", test: () => false, gorsel: "/img/products/daire-cay-seker.webp" },
    { id: "E2", ad: "Kahve", test: () => false, gorsel: "/img/products/daire-kahve.webp" },
    { id: "E3", ad: "İçecek Grubu", test: () => false, gorsel: "/img/products/daire-icecek.webp" },
    { id: "E4", ad: "Atıştırmalıklar", test: () => false, gorsel: "/img/products/daire-atistirmalik.webp" },
  ],
  F: [
    { id: "F1", ad: "Kalem ve Yazı Gereçleri", test: () => false },
    { id: "F2", ad: "Masaüstü Gereçleri", test: () => false },
    { id: "F3", ad: "Dosya ve Arşivleme Gereçleri", test: () => false },
    { id: "F4", ad: "Ambalaj Ürünleri", test: () => false },
    { id: "F5", ad: "Bilgisayar Sarf Malzemeleri", test: () => false },
  ],
};

const MARKA_TERCIHLERI = {
  C1: ["Palex", "Vialli", "Flosoft"],
};

function markaTercihSatir(name, brand) {
  const clean = String(brand || "").trim();
  if (!clean || /^fark etmez$/i.test(clean)) return `${name} · Marka tercihi: fark etmez`;
  return `${name} · Marka tercihi: ${clean}`;
}

function altBul(kat, satir, explicitId) {
  const explicit = (ALTLAR[kat] || []).find(x => x.id === explicitId);
  if (explicit) return explicit;
  const t = String(satir || "").toLocaleLowerCase("tr");
  const kurallar = ALTLAR[kat] || [];
  for (const k of kurallar) if (k.test(t)) return k;
  return { id: "diger", ad: "Diğer", test: () => true };
}

const BIRIM_KELIME = /^(gr|g|kg|ml|mm|cm|m|lt|oz|cl)$/i;
function urunKelime(word) {
  if (!word) return word;
  if (BIRIM_KELIME.test(word)) return word.toLocaleLowerCase("en-US");
  if (/^[A-Z0-9][A-Z0-9+\-\/]*$/.test(word) && /[A-Z]/.test(word) && word.length > 1) return word;
  if (/^\d/.test(word)) return word;
  return word.charAt(0).toLocaleUpperCase("tr") + word.slice(1).toLocaleLowerCase("tr");
}
function urunAdiYazi(satir) {
  return String(satir || "")
    .split(" · ")
    .map((part) => part.split(/(\s+)/).map((tok) => /^\s+$/.test(tok) ? tok : urunKelime(tok)).join(""))
    .join(" · ");
}

function aramaMetni(raw) {
  return String(raw || '').toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function olcuYazi(raw) {
  let s = String(raw || "").trim();
  if (!s || /^belirtilmedi$/i.test(s)) return "";
  if (/^\d+\s*[×xX]\s*\d+$/.test(s)) {
    const [a, b] = s.split(/\s*[×xX]\s*/);
    return a + " × " + b;
  }
  s = s.replace(/\s*mililitre\b/gi, "ML");
  s = s.replace(/\s*kilogram\b/gi, "Kg");
  s = s.replace(/\s*santimetre\b/gi, " Cm");
  s = s.replace(/\s*litre\b/gi, "Lt");
  s = s.replace(/\s*gram\b/gi, "Gr");
  s = s.replace(/\s*gr\.?(?=\s|$)/gi, "Gr");
  s = s.replace(/\s*kg\.?(?=\s|$)/gi, "Kg");
  s = s.replace(/\s*ml\.?(?=\s|$)/gi, "ML");
  s = s.replace(/\s*mm\.?(?=\s|$)/gi, "Mm");
  s = s.replace(/^(\d+(?:,\d+)?)\s+Cm$/, "$1Cm");
  s = s.replace(/^(\d+(?:,\d+)?)\s+Gr$/, "$1Gr");
  s = s.replace(/^(\d+(?:,\d+)?)\s+Kg$/, "$1Kg");
  s = s.replace(/^(\d+(?:,\d+)?)\s+ML$/, "$1ML");
  s = s.replace(/^(\d+(?:,\d+)?)\s+Mm$/, "$1Mm");
  return s.replace(/(\d)\s*(cm|mm|kg|gr|ml|lt)\b/gi, (_, n, unit) => n + ' ' + ({gr:'g',lt:'L'}[unit.toLowerCase()] || unit.toLowerCase())).replace(/\s{2,}/g, " ").trim();
}

function ebatYazi(satir, altAd) {
  let s = String(satir || "");
  const aday = [altAd, altAd.replace(/ları$|leri$/i, ""), altAd.replace(/ Kağıtları$/i, " Kağıdı")];
  for (const p of aday) {
    if (!p) continue;
    const re = new RegExp("^" + p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*", "i");
    if (re.test(s)) {
      s = s.replace(re, "").replace(/^·\s*/, "").trim();
      break;
    }
  }
  return s || satir;
}

function satirParcalar(satir, altAd) {
  return String(ebatYazi(satir, altAd))
    .split("·")
    .map((x) => x.trim())
    .filter(Boolean);
}

function grupFoto(tipId) {
  return GRUP_FOTO[tipId] || "";
}

function altFoto(altId, grupId) {
  const hit = Object.values(ALTLAR).flat().find((x) => x.id === altId);
  return (hit && hit.gorsel) || grupFoto(grupId);
}

const GRUP_KISA = {
  A: "Havlu, peçete ve tuvalet kağıdı.",
  B: "Endüstriyel ve genel temizlik ürünleri.",
  C: "Havlu, sabun aparatları, çöp kovaları ve mop.",
  D: "Çöp poşeti, sarf ve kullan at ürünler.",
  E: "Çay, kahve, içecek ve atıştırmalık.",
  F: "Kalem, masaüstü, dosya, ambalaj ve bilgisayar sarfı.",
};

function bindHomeCats() {
  const ul = document.querySelector(".cat-grid");
  if (!ul) return;
  ul.innerHTML = GRUPLAR.filter((g) => VITRIN_GRUPLAR.includes(g.g)).map((g) => {
    const foto = grupFoto(g.g);
    const href = "/urunler?g=" + encodeURIComponent(g.g);
    const kisa = GRUP_KISA[g.g] || "";
    return `<li><a href="${href}"><img src="${foto}" alt="${g.ad} ürün görseli" width="640" height="640"><span class="cat-body"><b>${g.ad}</b><small>${kisa}</small><span class="cat-go">İncele</span></span></a></li>`;
  }).join("");
}
bindHomeCats();

const form = document.getElementById("siparis-form");
if (form) {
  const wa = document.getElementById("wa");
  const waWrap = document.getElementById("wa-wrap");
  if (WA && wa && waWrap) {
    waWrap.hidden = false;
    wa.href = `https://wa.me/${WA}?text=${encodeURIComponent("FerraPro teklif: ")}`;
  }

  const gelen = new URLSearchParams(location.search);
  const gOk = gecerliG((gelen.get("g") || "").trim());
  const satir = (gelen.get("satir") || "").slice(0, 1000);
  const grupEl = form.elements.grup;
  const notEl = form.elements.not;
  if (gOk && grupEl && !String(grupEl.value || "").trim()) {
    grupEl.value = grupFormDeger(gOk);
  }
  if (satir && notEl && !String(notEl.value || "").trim()) {
    notEl.value = satir;
    const context = document.createElement('section');
    context.id = 'quote-context';
    context.className = 'catalog-sourcing';
    const title = document.createElement('h2'); title.textContent = 'Görüşmek istediğiniz ihtiyaç';
    const detail = document.createElement('p'); detail.textContent = satir;
    context.append(title, detail);
    const review = document.getElementById('interest-review');
    (review || form).before(context);
    if (review && !window.FerraInterest?.summary()) review.hidden = true;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("msg");
    const btn = form.querySelector("[type=submit]");
    const ilce = String(form.elements.ilce ? form.elements.ilce.value : "").trim();
    const eposta = String(form.elements.eposta ? form.elements.eposta.value : "").trim();
    const urunler = String(form.elements.urunler ? form.elements.urunler.value : "").trim();
    const miktar = String(form.elements.miktar ? form.elements.miktar.value : "").trim();
    const ihtiyac = [window.FerraInterest?.summary(), String(form.elements.not.value || "").trim()].filter(Boolean).join("\n\n");
    const body = {
      firma: form.elements.firma.value,
      yetkili: form.elements.yetkili.value,
      tel: form.elements.tel.value,
      grup: form.elements.grup.value,
      not: [
        ilce && `Teslimat: ${ilce}`,
        eposta && `E-posta: ${eposta}`,
        urunler && `Ürünler: ${urunler}`,
        miktar && `Yaklaşık miktar: ${miktar}`,
        ihtiyac,
      ].filter(Boolean).join("\n"),
      urun: "siparis-form",
      website: form.elements.website?.value || "",
    };
    msg.className = "note";
    msg.textContent = "Gönderiliyor…";
    if (btn) btn.disabled = true;
    try {
      if (String(body.firma || "").trim().length > 120 || String(body.yetkili || "").trim().length > 80) {
        throw new Error("Alan çok uzun. Metni kısaltın.");
      }
      if (body.not.length > SATIR_MAX) {
        throw new Error("İhtiyaç metni, teslimat ilçesi ile birlikte 2000 karakteri aşıyor. Metni kısaltın.");
      }
      const res = await fetch("/api/teklif", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      let data = null;
      if (ct.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }
      if (!res.ok || !data || data.ok !== true) {
        const sunucu = data && data.error;
        throw new Error(sunucu || "Talep gönderilemedi. Lütfen daha sonra yeniden deneyin.");
      }
      form.reset();
      document.getElementById('quote-context')?.remove();
      const review = document.getElementById('interest-review');
      if (review) review.hidden = false;
      window.FerraInterest?.clear();
      msg.className = "note is-ok";
      msg.textContent = form.dataset.success || "Talebiniz alındı. İhtiyacınızı görüşmek için sizinle iletişime geçeceğiz.";
    } catch (err) {
      msg.className = "note is-hata";
      msg.textContent = err.message || "Talep gönderilemedi. Lütfen daha sonra yeniden deneyin.";
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

// Progressive enhancement: content remains visible without JS or motion support.
(() => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('motion-enter');
      observer.unobserve(entry.target);
    }
  }, { threshold: .08 });
  document.querySelectorAll('.hero-copy, .hero-visual, .home-ticker, .home-banners-frame, .spot-card, .cats-heading, .cat-grid li, .sales-heading, .business-grid a, .path li, .close .wrap, .home-quote, .sector-chips, .benefit-grid li, .contact-method, .sector-card').forEach(el => observer.observe(el));
})();
