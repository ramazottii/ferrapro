const groups = [
  { g: "", label: "FerraPro", href: "/", img: "/logo/ferrapro-hex.png", tone: "logo" },
  { g: "Hijyen", label: "Hijyen", img: "/img/ico-tuvalet.png" },
  { g: "Sağlık", label: "Sağlık", img: "/img/ico-klinik.png" },
  { g: "Temizlik", label: "Temizlik", img: "/img/ico-cop.png" },
  { g: "Mutfak", label: "Mutfak", img: "/img/ico-bardak.png" },
  { g: "Ambalaj", label: "Ambalaj", img: "/img/cat-ofis.png" },
  { g: "Kırtasiye", label: "Kırtasiye", img: "/img/cat-ofis.png" },
];

function pic(u) {
  const t = `${u.ad} ${u.kategori}`.toLocaleLowerCase("tr");
  if (t.includes("bardak") || t.includes("kase")) return "/img/ico-bardak.png";
  if (t.includes("poşet") || t.includes("çöp")) return "/img/ico-cop.png";
  if (t.includes("jumbo")) return "/img/ico-jumbo.png";
  if (t.includes("fotosel")) return "/img/ico-fotosel.png";
  if (t.includes("z kat") || t.includes("zkat")) return "/img/ico-zhavlu.png";
  if (t.includes("peçete")) return "/img/ico-pecete.png";
  if (t.includes("tuvalet")) return "/img/ico-tuvalet.png";
  if (u.kategori === "Sağlık") return "/img/ico-klinik.png";
  if (u.kategori === "Mutfak") return "/img/ico-bardak.png";
  if (u.kategori === "Temizlik") return "/img/cat-cop.png";
  return "/img/cat-kagit.png";
}

function money(n) {
  return `${Number(n || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;
}

function cartRead() {
  try {
    return JSON.parse(localStorage.getItem("fp-cart") || "[]");
  } catch {
    return [];
  }
}
function cartWrite(items) {
  localStorage.setItem("fp-cart", JSON.stringify(items));
  paintBag();
}
function cartCount() {
  return cartRead().reduce((s, x) => s + x.n, 0);
}
function addCart(u) {
  const items = cartRead();
  const hit = items.find((x) => x.id === u.id);
  if (hit) hit.n += 1;
  else items.push({ id: u.id, ad: u.ad, marka: u.marka, fiyat: u.fiyat, n: 1 });
  cartWrite(items);
}
function paintBag() {
  document.querySelectorAll("[data-bag]").forEach((el) => {
    el.textContent = String(cartCount());
  });
}

function card(u) {
  const el = document.createElement("article");
  el.className = "pcard";
  el.innerHTML = `
    <a class="ph" href="/urun?id=${u.id}"><img src="${pic(u)}" alt=""></a>
    <div class="body">
      <div class="mk">${u.marka || ""}</div>
      <a class="nm" href="/urun?id=${u.id}">${u.ad}</a>
      <div class="pr">${money(u.fiyat)}</div>
      <button type="button">Sepete ekle</button>
    </div>`;
  el.querySelector("button").addEventListener("click", () => addCart(u));
  return el;
}

function fillRail() {
  const box = document.getElementById("chips");
  if (!box) return;
  groups.forEach((g) => {
    const a = document.createElement("a");
    a.className = "chip";
    if (g.tone) a.dataset.tone = g.tone;
    a.href = g.href || `/katalog?g=${encodeURIComponent(g.g)}`;
    a.innerHTML = `<span class="tile"><img src="${g.img}" alt=""></span>${g.label}`;
    box.append(a);
  });
  const prev = document.getElementById("chip-prev");
  const next = document.getElementById("chip-next");
  if (prev) prev.onclick = () => box.scrollBy({ left: -280, behavior: "smooth" });
  if (next) next.onclick = () => box.scrollBy({ left: 280, behavior: "smooth" });
}

const seek = document.querySelector(".seek");
const q = document.getElementById("q");
if (seek) {
  seek.addEventListener("submit", (e) => {
    e.preventDefault();
    const needle = (q.value || "").trim();
    if (location.pathname.startsWith("/katalog")) {
      const u = new URL(location.href);
      if (needle) u.searchParams.set("q", needle);
      else u.searchParams.delete("q");
      history.replaceState({}, "", u);
      if (window._drawShop) window._drawShop();
      return;
    }
    location.href = needle ? `/katalog?q=${encodeURIComponent(needle)}` : "/katalog";
  });
}

fillRail();
paintBag();

const params = new URLSearchParams(location.search);

fetch("/katalog.json")
  .then((r) => r.json())
  .then((data) => {
    window._data = data;

    function filtered() {
      const grup = params.get("g") || "";
      const needle = ((q && q.value) || params.get("q") || "").trim().toLocaleLowerCase("tr");
      if (q && params.get("q") && !q.dataset.filled) {
        q.value = params.get("q");
        q.dataset.filled = "1";
      }
      return data.urunler.filter((u) => {
        if (grup) {
          const want = grup === "Sağlık" ? ["Sağlık", "Klinik"] : [grup];
          if (!want.includes(u.kategori)) return false;
        }
        if (!needle) return true;
        return `${u.marka} ${u.ad} ${u.kod || ""}`.toLocaleLowerCase("tr").includes(needle);
      });
    }

    const homeF = document.getElementById("home-firs");
    const homeC = document.getElementById("home-cok");
    const homeY = document.getElementById("home-yeni");
    if (homeF) data.urunler.filter((u) => u.kategori === "Hijyen").slice(0, 10).forEach((u) => homeF.append(card(u)));
    if (homeC) data.urunler.filter((u) => u.kategori === "Temizlik" || u.kategori === "Mutfak").slice(0, 10).forEach((u) => homeC.append(card(u)));
    if (homeY) data.urunler.slice(-10).forEach((u) => homeY.append(card(u)));

    const liste = document.getElementById("liste");
    const baslik = document.getElementById("baslik");
    window._drawShop = function () {
      if (!liste) return;
      liste.replaceChildren();
      const rows = filtered();
      rows.forEach((u) => liste.append(card(u)));
      if (!rows.length) {
        const p = document.createElement("p");
        p.className = "empty";
        p.textContent = "Bu grupta ürün yok.";
        liste.append(p);
      }
      if (baslik) baslik.textContent = params.get("g") || (params.get("q") ? "Arama" : "Ürünler");
    };
    window._drawShop();
    if (liste && q) q.addEventListener("input", window._drawShop);

    const urunEl = document.getElementById("urun");
    if (urunEl) {
      const id = Number(params.get("id"));
      const u = data.urunler.find((x) => x.id === id);
      if (!u) {
        urunEl.innerHTML = `<p class="empty">Ürün bulunamadı.</p>`;
      } else {
        urunEl.innerHTML = `
          <div class="ph"><img src="${pic(u)}" alt=""></div>
          <div>
            <div class="muted">${u.marka} · ${u.kategori}${u.kod ? " · " + u.kod : ""}</div>
            <h1>${u.ad}</h1>
            <p class="muted">${u.ebat || ""} · ${u.birim || ""}</p>
            <div class="pr">${money(u.fiyat)}</div>
            <button class="buy" type="button">Sepete ekle</button>
          </div>`;
        urunEl.querySelector(".buy").onclick = () => addCart(u);
      }
    }

    const cartEl = document.getElementById("cart-rows");
    const sumEl = document.getElementById("cart-sum");
    function drawCartPage() {
      if (!cartEl) return;
      const items = cartRead();
      cartEl.replaceChildren();
      let tot = 0;
      items.forEach((it, i) => {
        tot += it.fiyat * it.n;
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${it.marka || ""} ${it.ad}</td>
          <td>${money(it.fiyat)}</td>
          <td><input class="qty" type="number" min="1" value="${it.n}"></td>
          <td>${money(it.fiyat * it.n)}</td>
          <td><button type="button">Sil</button></td>`;
        tr.querySelector("input").onchange = (e) => {
          items[i].n = Math.max(1, Number(e.target.value) || 1);
          cartWrite(items);
          drawCartPage();
        };
        tr.querySelector("button").onclick = () => {
          items.splice(i, 1);
          cartWrite(items);
          drawCartPage();
        };
        cartEl.append(tr);
      });
      if (sumEl) sumEl.textContent = items.length ? `Toplam ${money(tot)}` : "Sepet boş";
    }
    drawCartPage();

    const form = document.getElementById("siparis-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const msg = document.getElementById("siparis-msg");
        const items = cartRead();
        if (!items.length) {
          msg.textContent = "Sepet boş.";
          return;
        }
        const not = items.map((x) => `${x.n}× ${x.ad} (${money(x.fiyat)})`).join("\n");
        msg.textContent = "Gönderiliyor…";
        try {
          const res = await fetch("/api/teklif", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              firma: form.elements.firma.value,
              yetkili: form.elements.yetkili.value,
              tel: form.elements.tel.value,
              grup: "Sipariş",
              not,
              urun: "sepet",
            }),
          });
          const j = await res.json();
          if (!res.ok) throw new Error(j.error || "Gönderilemedi");
          cartWrite([]);
          drawCartPage();
          form.reset();
          msg.textContent = "Sipariş alındı. Dönüş yapılır.";
        } catch (err) {
          msg.textContent = err.message;
        }
      });
    }
  });
