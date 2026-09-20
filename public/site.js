const WA = ""; /* 90xxxxxxxxxx — numara gelince dolar */

const GRUPLAR = [
  { g: "Hijyen", ad: "Temizlik Kâğıt Ürünleri" },
  { g: "Temizlik", ad: "Temizlik Ürünleri" },
  { g: "Kırtasiye", ad: "Kırtasiye ve Ofis Malzemeleri" },
  { g: "Mutfak", ad: "Mutfak / İkram" },
  { g: "Ambalaj", ad: "Ambalaj" },
  { g: "PC", ad: "Bilgisayar ve Yazıcı Sarf Malzemeleri" },
  { g: "Sağlık", ad: "Sağlık Sarf" },
];

const SATIR_MAX = 2000;

const GRUP_FOTO = {
  pecete: "/img/ico-pecete.png",
  zkat: "/img/ico-zhavlu.png",
  fotosel: "/img/ico-fotosel.png",
  hareketli: "/img/ico-fotosel.png",
  "icten-havlu": "/img/ico-fotosel.png",
  havlu: "/img/ico-fotosel.png",
  jumbo: "/img/ico-jumbo.png",
  "icten-tuvalet": "/img/ico-jumbo.png",
  tuvalet: "/img/ico-tuvalet.png",
  cop: "/img/ico-cop.png",
  sivi: "/img/cat-temizlik.png",
  bardak: "/img/ico-bardak.png",
  masa: "/img/ico-klinik.png",
  a4: "/img/th-a4.png",
  klasor: "/img/th-klasor.png",
  dosya: "/img/th-dosya.png",
  pil: "/img/th-pil.png",
  kalem: "/img/th-kalem.png",
  zimba: "/img/th-zimba.png",
  not: "/img/th-not.png",
  mouse: "/img/th-mouse.png",
  klavye: "/img/th-klavye.png",
  toner: "/img/th-toner.png",
  usb: "/img/th-usb.png",
  power: "/img/th-power.png",
  strec: "/img/th-strec.png",
  bant: "/img/th-bant.png",
  kraft: "/img/th-kraft.png",
  kese: "/img/th-kese.png",
  kasa: "/img/th-kasa.png",
  buz: "/img/th-buz.png",
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
  if (g === "Mutfak" || g === "Mutfak / İkram") return ["Mutfak"];
  if (g === "PC" || g === "PC Sarf") return ["PC", "PC Sarf"];
  return g ? [g] : [];
}

function gecerliG(g) {
  return GRUPLAR.some((x) => x.g === g) ? g : "";
}

function grupFormDeger(g) {
  const key = gecerliG(g);
  if (key === "PC") return "PC Sarf";
  if (key === "Sağlık") return "Sağlık Sarf";
  if (key === "Mutfak") return "Mutfak / İkram";
  return key;
}

function teklifHref(g, satir) {
  const p = new URLSearchParams();
  const gOk = gecerliG(g);
  if (gOk) p.set("g", gOk);
  const s = String(satir || "").slice(0, SATIR_MAX);
  if (s) p.set("satir", s);
  return "/siparis?" + p.toString();
}

function katalogYol({ g, q, a }) {
  const p = new URLSearchParams();
  if (g) p.set("g", g);
  if (q) p.set("q", q);
  if (a) p.set("a", a);
  const s = p.toString();
  return "/urunler" + (s ? "?" + s : "");
}

function header(active) {
  const params = new URLSearchParams(location.search);
  const qVal = kacisAttr(params.get("q") || "");
  const path = location.pathname.replace(/\.html$/, "");
  const gKeep = path === "/urunler" ? gecerliG(params.get("g") || "") : "";
  const items = [
    ["/urunler", "Ürünler"],
    ["/hakkimizda", "Hakkımızda"],
    ["/sektorler", "Sektörler"],
    ["/iletisim", "İletişim"],
  ];
  const links = items
    .map(([href, label]) => `<a href="${href}" ${active === href ? 'aria-current="page"' : ""} class="${active === href ? "is-on" : ""}">${label}</a>`)
    .join("");
  const ctaOn = active === "/siparis" ? " is-on" : "";
  const gHidden = gKeep ? `<input type="hidden" name="g" value="${kacisAttr(gKeep)}" />` : "";
  return `<div class="wrap">
    <a class="brand" href="/"><img src="/logo/ferrapro-hex.png" alt="FerraPro"><span><b>FER</b><i>RA</i><b>PRO</b></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menü</button>
    <nav id="site-nav">${links}</nav>
    <form class="seek" action="/urunler" method="get" role="search">
      <label class="sr" for="q">Ürün ara</label>
      ${gHidden}
      <input id="q" type="search" name="q" placeholder="Ürün ara" value="${qVal}" />
    </form>
    <a class="btn btn-head${ctaOn}" href="/siparis">Teklif Listem <span data-interest-count>0</span></a>
  </div>`;
}

function footer() {
  return `<div class="wrap">
    <p>
      <strong>FerraPro</strong>
      <span>Ataşehir / İstanbul</span>
      <a class="foot-mail" href="mailto:info@ferrapro.com">info@ferrapro.com</a>
      <a class="foot-mail" href="tel:+905307161877">0530 716 18 77</a>
    </p>
    <nav>
      <a href="/sektorler">Sektörler</a>
      <a href="/referanslar">Referanslar</a>
      <a href="/iletisim">İletişim ve sorular</a>
      <a href="/kvkk">KVKK</a>
      <a href="/siparis">Teklif Al</a>
    </nav>
  </div>`;
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
  if (!btn || !nav) return;

  const setOpen = (open) => {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
  };

  btn.addEventListener("click", () => {
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (btn.getAttribute("aria-expanded") !== "true") return;
    setOpen(false);
    btn.focus();
  });

  document.addEventListener("click", (e) => {
    if (btn.getAttribute("aria-expanded") !== "true") return;
    if (btn.contains(e.target) || nav.contains(e.target)) return;
    setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 769px)").matches) setOpen(false);
  });
}
bindNav();

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
  Hijyen: [
    { id: "islak", ad: "Islak Havlu", test: (t) => t.includes("ıslak") || /yüzey temizlik havlu/.test(t) },
    { id: "pecete", ad: "Peçete", test: (t) => /peçete/.test(t) },
    { id: "fotosel", ad: "Fotoselli Havlu", test: (t) => t.includes("fotosel") },
    { id: "hareketli", ad: "Hareketli Havlu", test: (t) => t.includes("hareketli") },
    { id: "icten-havlu", ad: "İçten Çekmeli Havlu", test: (t) => /içten çekmeli/.test(t) && !/tuvalet/.test(t) },
    { id: "jumbo", ad: "Mini Jumbo", test: (t) => /jumbo|cimri/.test(t) },
    { id: "icten-tuvalet", ad: "İçten Çekmeli Tuvalet", test: (t) => /içten çekmeli tuvalet/.test(t) },
    { id: "tuvalet", ad: "Tuvalet Kağıtları", test: (t) => t.includes("tuvalet") },
    { id: "havlu", ad: "Rulo Havlu", test: (t) => t.includes("havlu") },
    { id: "dispenser", ad: "Dispenser ve Aparatlar", test: () => false },
  ],
  Temizlik: [
    { id: "cop", ad: "Çöp Poşeti", test: (t) => t.includes("çöp") },
    { id: "sabun", ad: "El Sabunları", test: (t) => /sabun/.test(t) },
    { id: "camasir-suyu", ad: "Çamaşır Suları", test: (t) => /çamaşır suyu/.test(t) },
    { id: "camasir", ad: "Çamaşır Deterjanları", test: (t) => /çamaşır|toz deterjan/.test(t) },
    { id: "yuzey", ad: "Yüzey Temizleyicileri", test: (t) => /yüzey/.test(t) },
    { id: "kirec", ad: "Kireç ve Pas Çözücüler", test: (t) => /kireç|pas-/.test(t) },
    { id: "koku", ad: "Ortam Kokuları", test: (t) => /oda parfüm/.test(t) },
    { id: "bulasik-temizlik", ad: "Bulaşık Temizliği", test: (t) => /bulaşık/.test(t) },
    { id: "sivi", ad: "Diğer Temizlik Ürünleri", test: (t) => !/bez|mop|süpürge|fırça/.test(t) },
    { id: "arac", ad: "Bez ve Mop", test: (t) => /bez|mop|süpürge|fırça/.test(t) },
    { id: "ekipman", ad: "Temizlik Ekipmanları", test: () => false },
    { id: "atik-yonetimi", ad: "Atık Yönetimi", test: () => false },
  ],
  Mutfak: [
    { id: "bardak", ad: "Karton Bardak", test: (t) => /karton bardak/.test(t) || (t.includes("bardak") && t.includes("oz")) },
    { id: "kase", ad: "Çorba Kasesi", test: (t) => /kase|kâse/.test(t) },
    { id: "icecek", ad: "İçecek", test: (t) => /su |soda|ice tea|süt |enerji|330 ml|250 ml 24/.test(t) },
    { id: "kahve", ad: "Kahve ve Çay", test: (t) => /kahve|çay|coffee|şeker|gold 200|filtre/.test(t) },
    { id: "bulasik", ad: "Bulaşık", test: (t) => /bulaşık|çatal/.test(t) },
    { id: "servis", ad: "Servis ve İkram Gereçleri", test: () => false },
    { id: "saklama", ad: "Hazırlık ve Saklama", test: () => false },
  ],
  Sağlık: [
    { id: "masa", ad: "Muayene Masa Örtüsü", test: (t) => /masa örtü/.test(t) },
    { id: "klozet", ad: "Klozet Kapak Örtüsü", test: (t) => t.includes("klozet") },
    { id: "maske", ad: "Maske", test: (t) => t.includes("maske") },
    { id: "eldiven", ad: "Eldiven", test: (t) => t.includes("eldiven") },
    { id: "atik", ad: "Tıbbi Atık", test: (t) => /atık/.test(t) },
    { id: "bakim", ad: "Bakım Sarf Malzemeleri", test: () => false },
    { id: "duzen", ad: "Klinik Düzen ve Dispenser", test: () => false },
  ],
  Kırtasiye: [
    { id: "a4", ad: "Fotokopi ve Özel Kâğıtlar", aciklama: "Ebat, gramaj ve paket adedine göre teklif.", test: (t) => ["a4 fotokopi kâğıdı", "a3 fotokopi kâğıdı", "renkli fotokopi kâğıdı", "gramajlı baskı kâğıdı", "fotoğraf kâğıdı", "plotter kâğıdı", "sürekli form kâğıdı", "karbon kâğıdı", "termal pos rulosu"].includes(t) },
    { id: "kalem", ad: "Kalemler ve Yazı Gereçleri", aciklama: "Uç tipi, çizgi kalınlığı ve renk tercihinize göre teklif.", test: (t) => ["tükenmez kalem", "jel kalem", "roller kalem", "kurşun kalem", "versatil uçlu kalem", "fosforlu kalem", "permanent marker", "beyaz tahta kalemi", "asetat kalemi", "fineliner kalem", "imza kalemi", "dolma kalem", "kalem ucu", "kalem mürekkebi"].includes(t) },
    { id: "klasor", ad: "Klasör ve Arşivleme", aciklama: "Belge formatı, sırt genişliği ve arşiv ihtiyacına göre seçenekler.", test: (t) => ["geniş klasör", "dar klasör", "halkalı klasör", "arşiv kutusu", "klasör sırt etiketi"].includes(t) },
    { id: "dosya", ad: "Dosyalar ve Evrak Düzeni", aciklama: "Belge boyutu, kapasite ve kapama tipine göre seçenekler.", test: (t) => ["poşet dosya", "askılı dosya", "körüklü dosya", "çıtçıtlı dosya", "sunum dosyası", "imza dosyası", "dosya ayracı", "sekreterlik"].includes(t) },
    { id: "not", ad: "Defter, Ajanda ve Notlar", aciklama: "Ebat, sayfa düzeni ve yaprak sayısına göre seçenekler.", test: (t) => ["spiralli defter", "sert kapaklı defter", "bloknot", "küp not kâğıdı", "yapışkanlı not kâğıdı", "sayfa işaretleyici", "ajandalar", "ticari defter", "masa takvimi"].includes(t) },
    { id: "zimba", ad: "Zımba, Delgeç ve Sabitleme", aciklama: "Kapasite, ölçü ve kullanım sıklığına göre seçenekler.", test: (t) => ["masaüstü zımba makinesi", "arşiv tipi zımba makinesi", "zımba teli", "zımba sökücü", "delgeç", "ataş", "evrak mandalı", "raptiye", "harita çivisi", "paket lastiği"].includes(t) },
    { id: "masaustu", ad: "Masaüstü Düzenleyiciler", aciklama: "Ölçü, malzeme ve masa düzenine göre seçenekler.", test: (t) => ["kalemlik", "evrak rafı", "magazinlik", "kartvizitlik", "masaüstü organizer", "hesap makinesi", "kaşe", "istampa", "istampa mürekkebi"].includes(t) },
    { id: "kesim", ad: "Kesim, Yapıştırma ve Düzeltme", aciklama: "Ölçü, uygulama yüzeyi ve kullanım amacına göre seçenekler.", test: (t) => ["ofis makası", "maket bıçağı", "maket bıçağı yedeği", "cetvel", "şeffaf ofis bandı", "çift taraflı bant", "bant kesici", "stick yapıştırıcı", "sıvı yapıştırıcı", "silgi", "kalemtıraş", "şerit düzeltici", "sıvı düzeltici"].includes(t) },
    { id: "sunum", ad: "Sunum ve Planlama", aciklama: "Ebat ve mevcut ekipmanla uyumluluğa göre seçenekler.", test: (t) => ["beyaz yazı tahtası", "mantar pano", "flipchart", "flipchart kâğıdı", "tahta silgisi", "pano mıknatısı", "laminasyon filmi", "cilt kapağı", "cilt spirali"].includes(t) },
    { id: "zarf", ad: "Zarflar ve Etiketler", aciklama: "Ebat, malzeme ve baskı ihtiyacına göre seçenekler.", test: (t) => ["diplomat zarf", "torba zarf", "hava kabarcıklı zarf", "mektup zarf", "adres etiketi", "barkod etiketi", "raf etiketi", "nokta etiketi"].includes(t) },
    { id: "pil", ad: "Piller", aciklama: "Cihazın pil kodu ve paket adedine göre teklif.", test: (t) => ["aa kalem pil", "aaa ince kalem pil", "düğme pil", "9v pil"].includes(t) },
  ],
  Ambalaj: [
    { id: "strec", ad: "Streç", test: (t) => t.includes("streç") },
    { id: "bant", ad: "Koli Bandı", test: (t) => t.includes("band") },
    { id: "kraft", ad: "Kraft Çanta", test: (t) => t.includes("kraft") },
    { id: "kese", ad: "Kese Kağıdı", test: (t) => t.includes("kese") },
    { id: "kasa", ad: "Kasa Poşeti", test: (t) => t.includes("kasa") },
    { id: "buz", ad: "Buzdolabı Poşeti", test: (t) => t.includes("buzdolabı") },
    { id: "koli", ad: "Koli ve Kutular", test: () => false },
    { id: "koruma", ad: "Koruyucu Ambalaj", test: () => false },
    { id: "etiket", ad: "Etiket ve Sevkiyat", test: () => false },
  ],
  PC: [
    { id: "mouse", ad: "Mouse", test: (t) => t.includes("mouse") },
    { id: "klavye", ad: "Klavye", test: (t) => t.includes("klavye") },
    { id: "toner", ad: "Toner / Kartuş", test: (t) => /toner|kartuş/.test(t) },
    { id: "usb", ad: "USB / Kablo", test: (t) => /usb|hdmi|kablo/.test(t) },
    { id: "power", ad: "Power Bank", test: (t) => t.includes("power") },
    { id: "depolama", ad: "Veri Depolama", test: () => false },
    { id: "toplanti", ad: "Toplantı Aksesuarları", test: () => false },
    { id: "bakim", ad: "Ekran ve Çalışma Alanı", test: () => false },
  ],
};

const MARKA_TERCIHLERI = {
  islak: ["Espiga", "Polente", "Sleepy", "Selpak", "Freshmaker", "Papilion", "Deep Fresh", "Komili"],
  havlu: ["Solo", "Selpak", "Papia", "Familia", "Focus", "Forest", "Rulopak"],
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
  const satir = gelen.get("satir") || "";
  const grupEl = form.elements.grup;
  const notEl = form.elements.not;
  if (gOk && grupEl && !String(grupEl.value || "").trim()) {
    grupEl.value = grupFormDeger(gOk);
  }
  if (satir && notEl && !String(notEl.value || "").trim()) {
    notEl.value = satir;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("msg");
    const btn = form.querySelector("[type=submit]");
    const ilce = String(form.elements.ilce ? form.elements.ilce.value : "").trim();
    const ihtiyac = [window.FerraInterest?.summary(), String(form.elements.not.value || "").trim()].filter(Boolean).join("\n\n");
    const body = {
      firma: form.elements.firma.value,
      yetkili: form.elements.yetkili.value,
      tel: form.elements.tel.value,
      grup: form.elements.grup.value,
      not: [ilce && `Teslimat ilçesi: ${ilce}`, ihtiyac].filter(Boolean).join("\n"),
      urun: "siparis-form",
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
      window.FerraInterest?.clear();
      msg.className = "note is-ok";
      msg.textContent = "Talebiniz alındı. İhtiyacınızı görüşmek için sizinle iletişime geçeceğiz.";
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
  document.querySelectorAll('.hero-copy, .hero-visual, .cats-heading, .cat-grid li, .sales-heading, .business-grid a, .path li, .close .wrap, .contact-method, .sector-card').forEach(el => observer.observe(el));
})();
