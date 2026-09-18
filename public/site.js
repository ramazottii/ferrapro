const WA = ""; /* 90xxxxxxxxxx — numara gelince dolar */

const GRUPLAR = [
  { g: "Hijyen", ad: "Temizlik Kâğıt Ürünleri" },
  { g: "Temizlik", ad: "Temizlik Ürünleri" },
  { g: "Kırtasiye", ad: "Kırtasiye Ürünleri" },
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
    <a class="btn btn-head${ctaOn}" href="/siparis">Teklif Al</a>
  </div>`;
}

function footer() {
  return `<div class="wrap">
    <p>
      <strong>FerraPro</strong>
      <span>Ataşehir / İstanbul</span>
      <a class="foot-mail" href="mailto:info@ferrapro.com">info@ferrapro.com</a>
      <a class="foot-mail" href="tel:+905325891436">0532 589 14 36</a>
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
    { id: "islak", ad: "Islak Havlu", test: (t) => t.includes("ıslak") },
    { id: "pecete", ad: "Peçete", test: (t) => /peçete|mendil/.test(t) },
    { id: "zkat", ad: "Z Kat Havlu", test: (t) => /z kat/.test(t) },
    { id: "fotosel", ad: "Fotoselli Havlu", test: (t) => t.includes("fotosel") },
    { id: "hareketli", ad: "Hareketli Havlu", test: (t) => t.includes("hareketli") },
    { id: "icten-havlu", ad: "İçten Çekmeli Havlu", test: (t) => /içten çekmeli/.test(t) && !/tuvalet/.test(t) },
    { id: "jumbo", ad: "Mini Jumbo", test: (t) => /jumbo|cimri/.test(t) },
    { id: "icten-tuvalet", ad: "İçten Çekmeli Tuvalet", test: (t) => /içten çekmeli tuvalet/.test(t) },
    { id: "tuvalet", ad: "Tuvalet Kağıtları", test: (t) => t.includes("tuvalet") },
    { id: "havlu", ad: "Rulo Havlu", test: (t) => t.includes("havlu") },
  ],
  Temizlik: [
    { id: "cop", ad: "Çöp Poşeti", test: (t) => t.includes("çöp") },
    { id: "sivi", ad: "Sıvı ve Deterjan", test: (t) => /sabun|çamaşır|deterjan|yüzey|güç|kireç|sprey|krem|jel|kapsül|parfüm|bidon|dağ esintisi/.test(t) },
    { id: "arac", ad: "Bez ve Mop", test: (t) => /bez|mop|süpürge|fırça/.test(t) },
  ],
  Mutfak: [
    { id: "bardak", ad: "Karton Bardak", test: (t) => /karton bardak/.test(t) || (t.includes("bardak") && t.includes("oz")) },
    { id: "kase", ad: "Çorba Kasesi", test: (t) => /kase|kâse/.test(t) },
    { id: "icecek", ad: "İçecek", test: (t) => /su |soda|ice tea|çay |süt |enerji|330 ml|250 ml 24/.test(t) },
    { id: "kahve", ad: "Kahve ve Çay", test: (t) => /kahve|coffee|şeker|gold 200|filtre/.test(t) },
    { id: "bulasik", ad: "Bulaşık", test: (t) => /bulaşık|çatal/.test(t) },
  ],
  Sağlık: [
    { id: "masa", ad: "Muayene Masa Örtüsü", test: (t) => /masa örtü/.test(t) },
    { id: "klozet", ad: "Klozet Kapak Örtüsü", test: (t) => t.includes("klozet") },
    { id: "maske", ad: "Maske", test: (t) => t.includes("maske") },
    { id: "eldiven", ad: "Eldiven", test: (t) => t.includes("eldiven") },
    { id: "atik", ad: "Tıbbi Atık", test: (t) => /atık/.test(t) },
  ],
  Kırtasiye: [
    { id: "a4", ad: "A4 Kağıt", test: (t) => /a4|fotokopi/.test(t) },
    { id: "klasor", ad: "Klasör", test: (t) => t.includes("klasör") },
    { id: "dosya", ad: "Poşet Dosya", test: (t) => /dosya/.test(t) },
    { id: "pil", ad: "Pil", test: (t) => /pil|\baa\b/.test(t) },
    { id: "kalem", ad: "Kalem", test: (t) => t.includes("kalem") },
    { id: "zimba", ad: "Zımba", test: (t) => t.includes("zımba") },
    { id: "not", ad: "Not", test: (t) => t.includes("not") },
  ],
  Ambalaj: [
    { id: "strec", ad: "Streç", test: (t) => t.includes("streç") },
    { id: "bant", ad: "Koli Bandı", test: (t) => t.includes("band") },
    { id: "kraft", ad: "Kraft Çanta", test: (t) => t.includes("kraft") },
    { id: "kese", ad: "Kese Kağıdı", test: (t) => t.includes("kese") },
    { id: "kasa", ad: "Kasa Poşeti", test: (t) => t.includes("kasa") },
    { id: "buz", ad: "Buzdolabı Poşeti", test: (t) => t.includes("buzdolabı") },
  ],
  PC: [
    { id: "mouse", ad: "Mouse", test: (t) => t.includes("mouse") },
    { id: "klavye", ad: "Klavye", test: (t) => t.includes("klavye") },
    { id: "toner", ad: "Toner / Kartuş", test: (t) => /toner|kartuş/.test(t) },
    { id: "usb", ad: "USB / Kablo", test: (t) => /usb|hdmi|kablo/.test(t) },
    { id: "power", ad: "Power Bank", test: (t) => t.includes("power") },
  ],
};

function altBul(kat, satir) {
  const t = String(satir || "").toLocaleLowerCase("tr");
  const kurallar = ALTLAR[kat] || [];
  for (const k of kurallar) if (k.test(t)) return k;
  return { id: "diger", ad: "Diğer", test: () => true };
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

const liste = document.getElementById("liste");
if (liste) {
  const params = new URLSearchParams(location.search);
  const qHam = (params.get("q") || "").trim();
  const needle = qHam.toLocaleLowerCase("tr");
  const grup = gecerliG(params.get("g") || "");
  let acik = (params.get("a") || "").trim();
  const baslik = document.getElementById("baslik");
  const katNav = document.getElementById("kat-nav");
  const katSec = document.getElementById("kat-sec");
  const katMeta = document.getElementById("kat-meta");

  function kurKategori() {
    if (katNav) {
      katNav.replaceChildren();
      const tum = document.createElement("a");
      tum.href = katalogYol({ q: qHam });
      tum.textContent = "Tümü";
      if (!grup) {
        tum.className = "is-on";
        tum.setAttribute("aria-current", "page");
      }
      katNav.append(tum);
      GRUPLAR.forEach((x) => {
        const a = document.createElement("a");
        a.href = katalogYol({ g: x.g, q: qHam });
        a.textContent = x.ad;
        if (grup === x.g) {
          a.className = "is-on";
          a.setAttribute("aria-current", "page");
        }
        katNav.append(a);
      });
    }
    if (katSec) {
      katSec.replaceChildren();
      const o0 = document.createElement("option");
      o0.value = "";
      o0.textContent = "Tüm kategoriler";
      katSec.append(o0);
      GRUPLAR.forEach((x) => {
        const o = document.createElement("option");
        o.value = x.g;
        o.textContent = x.ad;
        katSec.append(o);
      });
      katSec.value = grup;
      katSec.addEventListener("change", () => {
        location.assign(katalogYol({ g: gecerliG(katSec.value), q: qHam }));
      });
    }
  }
  kurKategori();

  fetch("/katalog.json")
    .then((r) => r.json())
    .then((data) => {
      const want = grupAnahtar(grup);
      let urunler = data.urunler || [];
      if (want.length) urunler = urunler.filter((u) => want.includes(u.kategori));
      if (needle) {
        urunler = urunler.filter((u) =>
          `${u.satir || ""} ${u.ad || ""} ${u.kategori}`.toLocaleLowerCase("tr").includes(needle),
        );
      }
      const goster = grup ? GRUPLAR.filter((x) => x.g === grup) : GRUPLAR;
      if (baslik) {
        const found = GRUPLAR.find((x) => x.g === grup);
        baslik.textContent = found ? found.ad : "Ürünler";
      }

      const grupSay = [];
      goster.forEach((gr) => {
        const keys = grupAnahtar(gr.g);
        const hits = urunler.filter((u) => keys.includes(u.kategori));
        if (!hits.length) return;
        const buckets = new Map();
        hits.forEach((u) => {
          const tip = altBul(gr.g, u.satir || u.ad);
          if (!buckets.has(tip.id)) buckets.set(tip.id, { tip, items: [] });
          buckets.get(tip.id).items.push(u);
        });
        const sirali = [];
        (ALTLAR[gr.g] || []).forEach((k) => {
          if (buckets.has(k.id)) sirali.push(buckets.get(k.id));
        });
        if (buckets.has("diger")) sirali.push(buckets.get("diger"));
        grupSay.push({ gr, sirali, buckets });
      });

      if (katMeta) {
        katMeta.replaceChildren();
        const parca = [];
        if (grup) {
          const found = GRUPLAR.find((x) => x.g === grup);
          if (found) parca.push(found.ad);
        }
        if (qHam) parca.push("arama: " + qHam);
        const n = grupSay.reduce((acc, x) => acc + x.sirali.length, 0);
        parca.push(n + " ürün grubu");
        const bilgi = document.createElement("span");
        bilgi.textContent = parca.join(" · ");
        katMeta.append(bilgi);
        if (grup || qHam) {
          const temiz = document.createElement("a");
          temiz.href = "/urunler";
          temiz.className = "cat-clear";
          temiz.textContent = "Filtreleri temizle";
          katMeta.append(temiz);
        }
      }

      liste.replaceChildren();

      if (!grupSay.length) {
        const bos = document.createElement("div");
        bos.className = "cat-empty";
        const p = document.createElement("p");
        p.textContent = "Bu süzgeçle eşleşen ürün yok.";
        bos.append(p);
        const actions = document.createElement("p");
        actions.className = "cat-empty-actions";
        const ara = document.createElement("button");
        ara.type = "button";
        ara.className = "btn ghost";
        ara.textContent = "Aramayı değiştir";
        ara.addEventListener("click", () => {
          const qEl = document.getElementById("q");
          if (qEl) {
            qEl.focus();
            if (typeof qEl.select === "function") qEl.select();
          }
        });
        const temiz = document.createElement("a");
        temiz.className = "btn ghost";
        temiz.href = "/urunler";
        temiz.textContent = "Filtreleri temizle";
        const teklif = document.createElement("a");
        teklif.className = "btn";
        teklif.href = "/siparis";
        teklif.textContent = "Genel teklif iste";
        actions.append(ara, temiz, teklif);
        bos.append(actions);
        liste.append(bos);
        return;
      }

      grupSay.forEach(({ gr, sirali, buckets }) => {
        const art = document.createElement("article");
        art.className = "grup";
        if (!grup) {
          const h2 = document.createElement("h2");
          h2.textContent = gr.ad;
          art.append(h2);
        }
        const ul = document.createElement("ul");
        ul.className = "karel";
        const panel = document.createElement("div");
        panel.className = "secenekler";
        panel.hidden = true;

        function kapat() {
          ul.querySelectorAll(".kart-ac").forEach((btn) => {
            btn.setAttribute("aria-expanded", "false");
            btn.textContent = "Seçenekleri göster";
            btn.closest("li")?.classList.remove("is-on");
          });
          panel.hidden = true;
          panel.replaceChildren();
        }

        function ac(tip, items, btn, moveFocus = false) {
          const ayni = btn.getAttribute("aria-expanded") === "true";
          kapat();
          if (ayni) {
            history.replaceState(null, "", katalogYol({ g: grup, q: qHam }));
            return;
          }
          btn.setAttribute("aria-expanded", "true");
          btn.textContent = "Seçenekleri gizle";
          btn.closest("li")?.classList.add("is-on");
          const bas = document.createElement("h3");
          bas.id = "sec-" + gr.g + "-" + tip.id;
          bas.textContent = tip.ad + " · " + items.length + " seçenek";
          panel.setAttribute("aria-labelledby", bas.id);
          const eb = document.createElement("ul");
          items.forEach((u) => {
            const satir = u.satir || u.ad || "";
            const li = document.createElement("li");
            li.className = "opt";
            const metin = document.createElement("div");
            metin.className = "opt-bits";
            satirParcalar(satir, tip.ad).forEach((parca) => {
              const span = document.createElement("span");
              span.className = "opt-bit";
              span.textContent = parca;
              metin.append(span);
            });
            const aksiyon = document.createElement("a");
            aksiyon.className = "btn ghost opt-teklif";
            aksiyon.href = teklifHref(gr.g, satir);
            aksiyon.textContent = "Bu ürün için teklif iste";
            li.append(metin, aksiyon);
            eb.append(li);
          });
          const close = document.createElement("button");
          close.type = "button";
          close.className = "btn ghost option-close";
          close.textContent = "Seçenekleri kapat";
          close.addEventListener("click", () => {
            kapat();
            history.replaceState(null, "", katalogYol({ g: grup, q: qHam }));
            btn.focus();
          });
          panel.replaceChildren(bas, close, eb);
          panel.hidden = false;
          history.replaceState(null, "", katalogYol({ g: grup, q: qHam, a: tip.id }));
          if (moveFocus) {
            bas.tabIndex = -1;
            bas.focus({ preventScroll: true });
            panel.scrollIntoView({ block: "start", behavior: "instant" });
          }
        }

        sirali.forEach(({ tip, items }) => {
          const li = document.createElement("li");
          const txt = document.createElement("span");
          txt.className = "txt";
          txt.textContent = tip.ad;
          const say = document.createElement("span");
          say.className = "say";
          say.textContent = items.length + " seçenek";
          const govde = document.createElement("div");
          govde.className = "kart-govde";
          govde.append(txt, say);
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "kart-ac";
          btn.setAttribute("aria-expanded", "false");
          btn.setAttribute("aria-controls", "panel-" + gr.g);
          btn.textContent = "Seçenekleri göster";
          btn.addEventListener("click", () => ac(tip, items, btn, true));
          const src = grupFoto(tip.id);
          if (src) {
            const pic = document.createElement("span");
            pic.className = "pic";
            const img = document.createElement("img");
            img.src = src;
            img.alt = "";
            pic.append(img);
            li.append(pic, govde, btn);
          } else {
            li.classList.add("is-metin");
            li.append(govde, btn);
          }
          ul.append(li);
        });

        panel.id = "panel-" + gr.g;
        art.append(ul, panel);
        liste.append(art);

        if (acik) {
          const secili = buckets.get(acik);
          if (secili) {
            const idx = sirali.findIndex((x) => x.tip.id === acik);
            const btn = ul.querySelectorAll(".kart-ac")[idx];
            if (btn) ac(secili.tip, secili.items, btn);
          }
        }
      });
    });
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
    const ihtiyac = String(form.elements.not.value || "").trim();
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
      msg.className = "note is-ok";
      msg.textContent = "Teklif talebiniz alındı.";
    } catch (err) {
      msg.className = "note is-hata";
      msg.textContent = err.message || "Talep gönderilemedi. Lütfen daha sonra yeniden deneyin.";
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}
