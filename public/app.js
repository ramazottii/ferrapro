const $ = (s, el = document) => el.querySelector(s);
const loginWrap = $("#login");
const app = $("#app");
const sunumEl = $("#sunum");
const main = $("#main");
const pageTitle = $("#page-title");
const who = $("#who");
const loginErr = $("#login-err");

let user = null;
let state = null;
let picks = new Set();
let sunumQ = "";
let sunumKat = "";

const titles = {
  tedarik: "Tedarik · Panel",
  cariler: "Cariler",
  urunler: "Ürün Zekâsı",
  kiyaslama: "Kıyaslama",
  sik: "Sık Kullanılan",
  selcuk: "Selçuk · Saha",
  "klinik-not": "Klinik notu",
  vitrin: "Vitrin talepleri",
  siparisler: "Siparişler",
  sevkiyat: "Sevkiyat",
  faturalar: "Faturalar",
  kasa: "Kasa",
  maliyet: "Maliyet Modeli",
  mimari: "Dekorasyon / Mimari · Panel",
  projeler: "Projeler",
  musteriler: "Müşteriler",
  teklifler: "Teklifler",
  santiye: "Şantiye",
  kesif: "Keşif / Malzeme",
  "mim-faturalar": "Tahsilat",
  "mim-notlar": "Mimari Notlar",
};

const pitch = {
  Kağıt: "Fotokopi ve baskı — paket / koli net.",
  Dosyalama: "Arşiv ve dosya düzeni tek kalemde.",
  Kırtasiye: "Masaüstü sarf, günlük tüketim.",
  Form: "Matbu fiş ve irsaliye blokları.",
  Hijyen: "Tuvalet ve havlu — refill programı.",
  Temizlik: "Kimyasal + bez + torba komple.",
  Mutfak: "İkram ve mutfak tek sevkiyatta.",
  Klinik: "Eldiven, maske, ped — klinik standart.",
  Ambalaj: "Kargo ve paketleme malzemesi.",
  "İş Güvenliği": "Saha ve depo koruyucu ekipman.",
  Toner: "Yazıcı sarf — model notu alınır.",
};

async function api(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "content-type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "İstek başarısız");
  return data;
}

function route() {
  const hash = location.hash.replace(/^#\/?/, "") || "";
  const key = hash.split("/")[0] || "";
  const sahaOk = ["selcuk", "klinik-not", "urunler", "kiyaslama", "sik"];
  if (user?.role === "saha") {
    if (key && sahaOk.includes(key)) return key;
    return "selcuk";
  }
  if (!key || key === "panel") return "tedarik";
  return titles[key] ? key : "tedarik";
}

function applyRoleNav() {
  const saha = user?.role === "saha";
  const mim = $("#nav-mimari");
  if (mim) mim.classList.toggle("hidden", saha);
  document.querySelectorAll("#nav a").forEach((a) => {
    a.classList.toggle("hidden", saha && a.dataset.saha !== "1");
  });
  const brand = document.querySelector(".side-brand span");
  if (brand) brand.textContent = saha ? "Saha" : "Ortak panel";
  const tedLabel = document.querySelector("#nav-tedarik .nav-label");
  if (tedLabel) tedLabel.textContent = saha ? "Saha" : "Tedarik";
}

function setNav(key) {
  document.querySelectorAll("#nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === key);
  });
  pageTitle.textContent = titles[key] || "Panel";
}

function applyAnalytics(res) {
  if (res.maliyet) state.maliyet = res.maliyet;
  if (res.urunler) state.urunler = res.urunler;
  if (res.ozet) state.ozet = res.ozet;
  if (res.kategori_ozet) state.kategori_ozet = res.kategori_ozet;
  if (res.zeka) state.zeka = res.zeka;
  if (res.kiyas) state.kiyas = res.kiyas;
  if (res.sik_kullanilan) state.sik_kullanilan = res.sik_kullanilan;
  if (res.selcuk) state.selcuk = res.selcuk;
  if (res.selcuk_bakis) state.selcuk_bakis = res.selcuk_bakis;
  if (res.klinik_notlar) state.klinik_notlar = res.klinik_notlar;
  if (res.operasyon_aylik != null) state.operasyon_aylik = res.operasyon_aylik;
  if (res.sabit_pct_ciro != null) state.sabit_pct_ciro = res.sabit_pct_ciro;
  if (res.hedef_ciro != null) state.hedef_ciro = res.hedef_ciro;
  if (res.basa_bas) state.basa_bas = res.basa_bas;
  if (res.cari_portfoy) state.cari_portfoy = res.cari_portfoy;
  if (res.cariler) state.cariler = res.cariler;
}

function emptyCard(title) {
  return `<section class="card"><h2>${title}</h2></section>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fmtMoney(n) {
  return Number(n).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showOrtak() {
  loginWrap.classList.add("hidden");
  sunumEl.classList.add("hidden");
  app.classList.remove("hidden");
  render();
}

function showSunum() {
  loginWrap.classList.add("hidden");
  app.classList.add("hidden");
  sunumEl.classList.remove("hidden");
  renderSunum();
}

function showLogin() {
  app.classList.add("hidden");
  sunumEl.classList.add("hidden");
  loginWrap.classList.remove("hidden");
}

function renderTedarikPanel() {
  const n = (arr) => (arr || []).length;
  const o = state.ozet || {};
  const b = state.basa_bas || {};
  const k = b.karisik || {};
  const p = state.cari_portfoy || {};
  const riskli = (state.urunler || []).filter((u) => u.analiz?.riskler?.length).slice(0, 5);
  const mixRows = k.satirlar || [];
  const gercekVar = (p.adet || 0) > 0;
  main.innerHTML = `
    <div class="grid">
      <div class="stat"><div class="label">Ürün</div><div class="value">${n(state.urunler)}</div></div>
      <div class="stat good"><div class="label">Alış avantajlı</div><div class="value">${o.avantajli || 0}</div></div>
      <div class="stat"><div class="label">Ort. brüt / ciro</div><div class="value">%${o.ort_brut_ciro_pct ?? "—"}</div></div>
      <div class="stat ${(b.hedefte_net || 0) >= 0 ? "good" : "warn"}"><div class="label">Hedef ciroda net</div><div class="value">${fmtMoney(b.hedefte_net || 0)}</div></div>
    </div>
    ${
      gercekVar
        ? `<section class="card">
      <h2>Kayıtlı cariler — şu an</h2>
      <p class="lead-sm">Gerçek fatura varsayımları toplanır; eşit cari yok. Brüt %${b.ort_brut_ciro_pct ?? "—"} ile sabit gider karşılanır.</p>
      <div class="rules">
        <div class="rule"><b>Cari</b><span>${p.adet} kayıt</span></div>
        <div class="rule"><b>Aylık ciro</b><span>${fmtMoney(p.mevcut_ciro || 0)} ₺</span></div>
        <div class="rule"><b>Brüt</b><span>${fmtMoney(p.mevcut_brut || 0)} ₺</span></div>
        <div class="rule"><b>Sabit sonrası</b><span class="${p.karli ? "money good" : "money bad"}">${fmtMoney(p.mevcut_net || 0)} ₺</span></div>
      </div>
      <p class="lead-sm" style="margin-top:12px">${
        p.karli
          ? "Bu portföy başa başın üstünde."
          : `Başa başa <b>${fmtMoney(p.acik || 0)} ₺</b> ciro eksik ≈ <b>${p.kac_adet_kucuk || 0}</b> küçük cari (${fmtMoney(b.cari_kucuk_ciro || 35000)} ₺) veya <b>${p.kac_adet_buyuk || 0}</b> büyük cari.`
      }</p>
      <a class="text-link" href="#/cariler">Carileri düzenle →</a>
    </section>`
        : ""
    }
    <section class="card">
      <h2>Başa baş — büyük + küçük cari</h2>
      <p class="lead-sm">Kürdan ile A4 aynı koli değil. Sabit gider <b>fatura cirosu</b> ile kapanır. Büyük cari ${fmtMoney(k.buyuk_ciro || b.cari_aylik_ciro || 0)} ₺ (Swissmed), küçük ${fmtMoney(k.kucuk_ciro || 35000)} ₺.</p>
      <div class="rules">
        <div class="rule"><b>Aylık sabit</b><span>${fmtMoney(b.aylik_sabit || 0)} ₺</span></div>
        <div class="rule"><b>Başa baş ciro</b><span>${fmtMoney(b.basa_bas_ciro || 0)} ₺/ay</span></div>
        <div class="rule"><b>1 büyük + küçük</b><span>≈ ${k.basa_bas_kucuk_ile ?? "—"} küçük cari daha</span></div>
        <div class="rule"><b>İlk dalga açık</b><span>${fmtMoney(k.ilk_dalga_acik || 0)} ₺ (1+6 sonrası)</span></div>
      </div>
      <div class="table-wrap" style="margin-top:14px">
        <table class="list">
          <thead><tr><th>Senaryo</th><th>Cari</th><th>Aylık ciro</th><th>Brüt</th><th>Sabit sonrası</th><th>Durum</th></tr></thead>
          <tbody>
            ${mixRows
              .map(
                (s) => `<tr class="${s.karli ? "row-good" : "row-bad"}">
              <td><b>${escapeHtml(s.etiket)}</b></td>
              <td>${s.adet} (${s.buyuk}B+${s.kucuk}K)</td>
              <td>${fmtMoney(s.ciro)}</td>
              <td>${fmtMoney(s.brut)}</td>
              <td class="money ${s.karli ? "good" : "bad"}">${fmtMoney(s.net)}</td>
              <td>${s.karli ? "Kara geçiş" : "Başa baş altı"}</td>
            </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <p class="muted tiny" style="margin-top:10px">Varsayılanlar Maliyet’ten değişir. Gerçek faturalar için <a class="text-link" href="#/cariler">Cari ekle</a>.</p>
    </section>
    <div class="grid two">
      <section class="card">
        <h2>Sabit gider yükü</h2>
        <p class="lead-sm">Hedef cironun yüzde kaçı sabite gider</p>
        <div class="big-num">%${state.sabit_pct_ciro ?? "—"} <span>sabit / hedef ciro</span></div>
        <p class="muted">${fmtMoney(state.operasyon_aylik || 0)} ₺ / ay ÷ ${fmtMoney(state.hedef_ciro || 0)} ₺ hedef</p>
        <a class="btn" href="#/maliyet" style="display:inline-block;margin-top:12px;text-decoration:none">Maliyet modelini düzenle</a>
      </section>
      <section class="card">
        <h2>Risk uyarıları</h2>
        <ul class="risk-list">
          ${
            riskli.length
              ? riskli
                  .map(
                    (u) =>
                      `<li><strong>${escapeHtml(u.ad)}</strong><br/><span class="muted">${escapeHtml((u.analiz.riskler || []).join(" · "))}</span></li>`
                  )
                  .join("")
              : `<li class="muted">Kritik risk yok.</li>`
          }
        </ul>
        <a class="text-link" href="#/urunler">Ürün zekâsı →</a>
        <a class="text-link" href="#/kiyaslama" style="margin-left:12px">Kıyaslama →</a>
        <a class="text-link" href="#/sik" style="margin-left:12px">Sık kullanılan →</a>
      </section>
    </div>
    <section class="card">
      <h2>Klinik notları</h2>
      <p class="lead-sm">Selçuk’un saha kayıtları — Ayfer ve Ramazan da görür ve girebilir.</p>
      ${
        (state.klinik_notlar || []).length
          ? `<div class="selcuk-list">${(state.klinik_notlar || [])
              .slice(0, 8)
              .map(
                (r) => `<article class="selcuk-item">
            <div class="selcuk-item-top">
              <b>${escapeHtml(r.klinik)}</b>
              <span class="muted tiny">${escapeHtml(fmtWhen(r.updated_at || r.created_at))} · ${escapeHtml(r.by || "")}</span>
            </div>
            <div class="muted tiny">${[r.tedarikci, r.tel].filter(Boolean).map(escapeHtml).join(" · ")}${r.aylik_tahmini != null ? ` · ${fmtMoney(r.aylik_tahmini)} ₺/ay` : ""}</div>
            ${r.urun_notu ? `<div class="selcuk-biz">${escapeHtml(r.urun_notu)}</div>` : ""}
          </article>`
              )
              .join("")}</div>`
          : `<p class="muted">Henüz kayıt yok.</p>`
      }
      <a class="text-link" href="#/klinik-not">Tümü / yeni kayıt →</a>
    </section>
    <section class="card">
      <h2>Ortak notları</h2>
      <form id="note-form" class="note-box">
        <textarea name="text" rows="3" placeholder="Not yaz…" required></textarea>
        <button class="btn" type="submit">Not ekle</button>
      </form>
      <ul class="notes" id="notes"></ul>
    </section>
  `;
  paintNotes("#notes", state.notes);
  $("#note-form").onsubmit = async (e) => {
    e.preventDefault();
    const text = new FormData(e.target).get("text");
    const res = await api("/api/note", { method: "POST", body: JSON.stringify({ text }) });
    state.notes = res.notes;
    e.target.reset();
    paintNotes("#notes", state.notes);
  };
}

function renderMimariPanel() {
  const n = (arr) => (arr || []).length;
  main.innerHTML = `
    <div class="grid">
      <div class="stat"><div class="label">Proje</div><div class="value">${n(state.mim_projeler)}</div></div>
      <div class="stat"><div class="label">Müşteri</div><div class="value">${n(state.mim_musteriler)}</div></div>
      <div class="stat"><div class="label">Teklif</div><div class="value">${n(state.mim_teklifler)}</div></div>
      <div class="stat"><div class="label">Şantiye</div><div class="value">${n(state.mim_santiye)}</div></div>
    </div>
    <section class="card">
      <h2>Modüller</h2>
      <div class="modules">
        <div class="mod">Projeler</div>
        <div class="mod">Müşteriler</div>
        <div class="mod">Teklifler</div>
        <div class="mod">Şantiye</div>
        <div class="mod">Keşif / Malzeme</div>
        <div class="mod">Tahsilat</div>
      </div>
    </section>
  `;
}

function paintNotes(sel, notes) {
  const ul = $(sel);
  if (!ul) return;
  const list = notes || [];
  if (!list.length) {
    ul.innerHTML = `<li class="muted">Henüz not yok.</li>`;
    return;
  }
  ul.innerHTML = list
    .slice(0, 20)
    .map((n) => {
      const d = new Date(n.created_at).toLocaleString("tr-TR");
      return `<li><div class="meta">${escapeHtml(n.by)} · ${d}</div>${escapeHtml(n.text)}</li>`;
    })
    .join("");
}

function renderUrunler() {
  const q = (state._urunQ || "").toLowerCase();
  const kat = state._urunKat || "";
  const filtre = state._urunFiltre || "";
  const z = state.zeka || {};
  const nakit = z.nakit || {};
  const cats = [...new Set((state.urunler || []).map((u) => u.kategori))].sort((a, b) =>
    a.localeCompare(b, "tr")
  );
  const rows = (state.urunler || []).filter((u) => {
    if (kat && u.kategori !== kat) return false;
    const a = u.analiz || {};
    if (filtre === "avantaj" && a.avantaj_sinif !== "good" && a.avantaj_sinif !== "ok") return false;
    if (filtre === "pahali" && a.avantaj_sinif !== "bad") return false;
    if (filtre === "risk" && !(a.riskler || []).length) return false;
    if (filtre === "cekirdek" && a.stok_karar !== "cekirdek") return false;
    if (filtre === "siparise" && a.stok_karar !== "siparise") return false;
    if (filtre === "birak" && a.stok_karar !== "birak") return false;
    if (!q) return true;
    const hay = `${u.ad} ${u.ebat} ${u.birim} ${u.kategori} ${u.marka || ""} ${u.kod || ""} ${u.tedarikci || ""}`.toLowerCase();
    return hay.includes(q);
  });

  main.innerHTML = `
    <section class="card intel-head">
      <div>
        <h2 style="margin:0">Ürün zekâsı</h2>
        <p class="lead-sm">Koli fiyatı yetmez: <b>birim maliyet</b> (yaprak/m/kg), <b>çekirdek menü</b>, satış bandı, nakit döngüsü. 160 kalemin hepsi depoya girmez.</p>
      </div>
      <div class="intel-pills">
        <span class="pill">Çekirdek ${z.cekirdek_adet ?? "—"} SKU</span>
        <span class="pill">Nakit döngüsü ${nakit.ccc ?? "—"} gün</span>
        <span class="pill">ABC A${z.abc?.A ?? "—"} / B${z.abc?.B ?? "—"} / C${z.abc?.C ?? "—"}</span>
        <a class="pill link" href="#/maliyet">Vade / stok günü</a>
      </div>
    </section>
    <section class="card">
      <h2>Kurulum tuzağı</h2>
      <p class="lead-sm">Tedarikçiler kataloğu şişirir; sizin işiniz <b>müşterinin tekrar aldığı 20–30 kalemi</b> stoklamaktır. Kimberly-Clark / Tork hattı da böyle çalışır: dispenser ailesi + refill, 14 SKU → 6. Nakit: stok günü + cari vade − tedarikçi vadesi.</p>
      <div class="rules">
        <div class="rule"><b>Stokta tut (DIO)</b><span>${nakit.dio ?? 21} gün çekirdek</span></div>
        <div class="rule"><b>Cari tahsilat (DSO)</b><span>${nakit.dso ?? 45} gün</span></div>
        <div class="rule"><b>Tedarikçiye öde (DPO)</b><span>${nakit.dpo ?? 30} gün</span></div>
        <div class="rule"><b>Nakit kilit (2 koli)</b><span>${fmtMoney(z.nakit_kilit || 0)} ₺</span></div>
      </div>
      <p class="muted tiny" style="margin-top:10px">${nakit.ccc > 30 ? `Döngü ${nakit.ccc} gün — vadeli satış stoku şişirirse kasa boğulur. Çekirdek dışı siparişe.` : `Döngü ${nakit.ccc} gün.`}</p>
    </section>
    <section class="card">
      <h2>İlk depo — çekirdek menü (${z.cekirdek_adet || 0} kalem)</h2>
      <p class="lead-sm">Swissmed tekrarları + birim maliyeti kazanan A sınıfı. Açılış tahmini: 2 koli × alış ≈ <b>${fmtMoney(z.ilk_stok_2koli || 0)} ₺</b> stok nakit.</p>
      <div class="table-wrap">
        <table class="list">
          <thead><tr><th>Ürün</th><th>Birim maliyet</th><th>Alış</th><th>Satılabilir</th><th>Brüt</th><th>Neden</th></tr></thead>
          <tbody>
            ${(z.cekirdek || [])
              .map(
                (c) => `<tr class="row-good">
              <td><b>${escapeHtml(c.ad)}</b>${c.kod ? `<div class="muted tiny">${escapeHtml(c.kod)}</div>` : ""}</td>
              <td>${escapeHtml(c.birim)}</td>
              <td>${fmtMoney(c.alis)}</td>
              <td class="money accent">${fmtMoney(c.sat)}</td>
              <td>%${c.brut_pct ?? "—"}</td>
              <td class="sm">${escapeHtml(c.swissmed || "A sınıfı / ucuz birim")}</td>
            </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
    ${
      (state.kategori_ozet || []).length
        ? `<section class="card">
      <h2 style="margin-top:0">Kategori brütü</h2>
      <div class="kat-strip">
        ${(state.kategori_ozet || [])
          .map(
            (k) => `<div class="kat-chip">
          <b>${escapeHtml(k.kategori)}</b>
          <span>%${k.brut_ciro_pct} brüt · ${k.adet} kalem</span>
        </div>`
          )
          .join("")}
      </div>
    </section>`
        : ""
    }
    <section class="card">
      <div class="toolbar wrap">
        <input id="urun-q" placeholder="Ürün, marka, kod, tedarikçi…" value="${escapeHtml(state._urunQ || "")}" />
        <select id="urun-kat">
          <option value="">Tüm kategoriler</option>
          ${cats
            .map((c) => {
              const cnt = (state.urunler || []).filter((u) => u.kategori === c).length;
              return `<option value="${escapeHtml(c)}" ${c === kat ? "selected" : ""}>${escapeHtml(c)} (${cnt})</option>`;
            })
            .join("")}
        </select>
        <select id="urun-filtre">
          <option value="" ${!filtre ? "selected" : ""}>Tüm durumlar</option>
          <option value="cekirdek" ${filtre === "cekirdek" ? "selected" : ""}>Çekirdek (stokla)</option>
          <option value="siparise" ${filtre === "siparise" ? "selected" : ""}>Siparişe bağla</option>
          <option value="birak" ${filtre === "birak" ? "selected" : ""}>İlk turda stoklama</option>
          <option value="avantaj" ${filtre === "avantaj" ? "selected" : ""}>Alış avantajlı</option>
          <option value="pahali" ${filtre === "pahali" ? "selected" : ""}>İnternet daha ucuz</option>
          <option value="risk" ${filtre === "risk" ? "selected" : ""}>Riskli kalemler</option>
        </select>
      </div>
      <p class="muted tiny">${rows.length} kalem · ${z.birak_adet || 0} kalem ilk turda stoklanmasın · birim = koli içi yaprak/m/kg</p>
      <div class="table-wrap intel-wrap">
        <table class="list intel">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Toptancı alış</th>
              <th>Birim maliyet</th>
              <th>İnternet / B2B</th>
              <th>Satış bandı</th>
              <th>Stok kararı</th>
              <th>Brüt</th>
            </tr>
          </thead>
          <tbody>
            ${
              rows
                .map((u) => {
                  const a = u.analiz || {};
                  return `<tr class="row-${a.stok_karar === "cekirdek" ? "good" : a.stok_karar === "birak" ? "bad" : a.avantaj_sinif || "neu"}">
              <td>
                <div class="u-ad">${escapeHtml(u.ad)}</div>
                <div class="muted tiny">${escapeHtml(u.kategori)} · ${escapeHtml(u.ebat)}${u.kod ? ` · ${escapeHtml(u.kod)}` : ""} · ABC ${escapeHtml(a.abc || "—")}</div>
                ${a.swissmed ? `<div class="risk-tag ok">${escapeHtml(a.swissmed)}</div>` : ""}
                ${a.aile_not ? `<div class="risk-tag">${escapeHtml(a.aile_not)}</div>` : ""}
                ${(a.riskler || []).length ? `<div class="risk-tag">${escapeHtml(a.riskler[0])}</div>` : ""}
              </td>
              <td>
                <div class="money">${fmtMoney(u.alis)}</div>
                <div class="muted tiny">${escapeHtml(u.tedarikci || "—")}</div>
              </td>
              <td>
                <div class="money">${a.birim ? escapeHtml(a.birim.yazi) : "—"}</div>
                <div class="muted tiny">${escapeHtml(a.icerik?.etiket || "")}</div>
              </td>
              <td>
                <div class="money">${a.piyasa_fiyat != null ? fmtMoney(a.piyasa_fiyat) : "—"}</div>
                <div class="muted tiny">${escapeHtml(a.piyasa_kaynak || "")}${a.piyasa_tahmini ? " · tahmini" : ""}</div>
              </td>
              <td>
                <div class="muted tiny">taban ${a.fiyat_taban != null ? fmtMoney(a.fiyat_taban) : "—"}</div>
                <div class="money accent">${a.onerilen_satis != null ? fmtMoney(a.onerilen_satis) : "—"}</div>
                <div class="muted tiny">tavan ${a.fiyat_tavan != null ? fmtMoney(a.fiyat_tavan) : "—"}</div>
              </td>
              <td><span class="badge ${a.stok_karar === "cekirdek" ? "good" : a.stok_karar === "birak" ? "bad" : "neu"}">${escapeHtml(a.stok_etiket || "—")}</span></td>
              <td>
                <div class="money good">+${fmtMoney(a.brut_kar ?? 0)}</div>
                <div class="muted tiny">%${a.brut_kar_pct ?? "—"} alışa</div>
              </td>
            </tr>`;
                })
                .join("") || `<tr><td colspan="7" class="muted">Sonuç yok.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  const qEl = $("#urun-q");
  qEl.oninput = (e) => {
    state._urunQ = e.target.value;
    const pos = e.target.selectionStart;
    renderUrunler();
    const again = $("#urun-q");
    if (again) {
      again.focus();
      again.setSelectionRange(pos, pos);
    }
  };
  $("#urun-kat").onchange = (e) => {
    state._urunKat = e.target.value;
    renderUrunler();
  };
  $("#urun-filtre").onchange = (e) => {
    state._urunFiltre = e.target.value;
    renderUrunler();
  };
}

function kiyasHucre(cell, cheapest) {
  if (!cell || cell.fiyat == null) return `<td class="muted">—</td>`;
  const cheap = cheapest && cell.fiyat === cheapest;
  return `<td class="${cheap ? "kiyas-cheap" : ""}">
    <div class="money ${cheap ? "good" : ""}">${fmtMoney(cell.fiyat)}</div>
    ${cell.benzer ? `<div class="kiyas-benzer" title="${escapeHtml(cell.kaynak || "")}">benzer · ${escapeHtml(cell.ad || "")}</div>` : ""}
  </td>`;
}

function renderKiyaslama() {
  const k = state.kiyas || {};
  const firms = k.firmalar || [];
  const q = (state._kiyasQ || "").toLowerCase();
  const kat = state._kiyasKat || "";
  const filtre = state._kiyasFiltre || "";
  const all = k.satirlar || [];
  const cats = [...new Set(all.map((s) => s.kategori).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
  const rows = all.filter((s) => {
    if (kat && s.kategori !== kat) return false;
    if (filtre === "piyasa" && !firms.some((f) => f.tur === "piyasa" && s.fiyatlar[f.id]?.fiyat != null)) return false;
    if (filtre === "ekstra" && !s.ekstra) return false;
    if (filtre === "katalog" && s.ekstra) return false;
    if (!q) return true;
    const hay = `${s.ad} ${s.ebat} ${s.marka} ${s.kod || ""} ${s.tedarikci || ""} ${s.en_ucuz_firma || ""}`.toLowerCase();
    return hay.includes(q);
  });
  const ozet = k.ozet || {};

  main.innerHTML = `
    <section class="card intel-head">
      <div>
        <h2 style="margin:0">Kıyaslama</h2>
        <p class="lead-sm">Kim kaça satıyor: toptancı listemiz + Avansas / Ofix etiket (KDV hariç koli). En ucuz sütunu ve <b>satış önerisi</b> rekabetçi fiyat içindir. Ürün zekâsı stok kararıdır; burası fiyat savaşı.</p>
      </div>
      <div class="intel-pills">
        <span class="pill">${ozet.adet ?? rows.length} satır</span>
        <span class="pill">Piyasa eşleşen ${ozet.piyasa_eslesen ?? "—"}</span>
        <span class="pill">Etiket ${ozet.tarih || "2026-08"}</span>
      </div>
    </section>
    <section class="card">
      <p class="muted tiny">${escapeHtml(k.not || "")}</p>
      <div class="toolbar wrap">
        <input id="kiyas-q" placeholder="Ürün, marka, kod, firma…" value="${escapeHtml(state._kiyasQ || "")}" />
        <select id="kiyas-kat">
          <option value="">Tüm kategoriler</option>
          ${cats
            .map((c) => `<option value="${escapeHtml(c)}" ${c === kat ? "selected" : ""}>${escapeHtml(c)}</option>`)
            .join("")}
        </select>
        <select id="kiyas-filtre">
          <option value="" ${!filtre ? "selected" : ""}>Tümü</option>
          <option value="katalog" ${filtre === "katalog" ? "selected" : ""}>Kataloğumuz</option>
          <option value="ekstra" ${filtre === "ekstra" ? "selected" : ""}>Kırtasiye / sıvı / ambalaj (piyasa)</option>
          <option value="piyasa" ${filtre === "piyasa" ? "selected" : ""}>Avansas veya Ofix dolu</option>
        </select>
      </div>
      <p class="muted tiny">${rows.length} kalem · fiyatlar KDV hariç</p>
      <div class="table-wrap intel-wrap">
        <table class="list intel kiyas">
          <thead>
            <tr>
              <th class="sticky-col">Ürün</th>
              ${firms.map((f) => `<th>${escapeHtml(f.ad)}</th>`).join("")}
              <th>En ucuz</th>
              <th>Satış önerisi</th>
            </tr>
          </thead>
          <tbody>
            ${
              rows
                .map((s) => {
                  const cheap = s.en_ucuz_fiyat;
                  return `<tr class="${s.ekstra ? "row-extra" : ""}">
              <td class="sticky-col">
                <div class="u-ad">${escapeHtml(s.ad)}</div>
                <div class="muted tiny">${escapeHtml(s.kategori)}${s.kod ? ` · ${escapeHtml(s.kod)}` : ""}${s.ekstra ? " · piyasa satırı" : ""}</div>
                <div class="muted tiny">${escapeHtml(s.ebat)}</div>
              </td>
              ${firms.map((f) => kiyasHucre(s.fiyatlar[f.id], cheap)).join("")}
              <td>
                ${
                  s.en_ucuz_firma
                    ? `<div class="money good">${escapeHtml(s.en_ucuz_firma)}</div>
                       <div class="muted tiny">${fmtMoney(s.en_ucuz_fiyat)}${s.en_ucuz_benzer ? " · benzer" : ""}</div>`
                    : `<span class="muted">—</span>`
                }
                ${s.toptanci_alternatif ? `<div class="kiyas-benzer">${escapeHtml(s.toptanci_alternatif)}</div>` : ""}
              </td>
              <td>
                ${
                  s.sat_oneri != null
                    ? `<div class="money accent">${fmtMoney(s.sat_oneri)}</div>
                       <div class="muted tiny">${s.sat_brut_pct != null ? `brüt %${s.sat_brut_pct}` : ""} ${escapeHtml(s.sat_not || "")}</div>`
                    : `<span class="muted">—</span>`
                }
              </td>
            </tr>`;
                })
                .join("") || `<tr><td colspan="${firms.length + 3}" class="muted">Sonuç yok.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  const qEl = $("#kiyas-q");
  qEl.oninput = (e) => {
    state._kiyasQ = e.target.value;
    const pos = e.target.selectionStart;
    renderKiyaslama();
    const again = $("#kiyas-q");
    if (again) {
      again.focus();
      again.setSelectionRange(pos, pos);
    }
  };
  $("#kiyas-kat").onchange = (e) => {
    state._kiyasKat = e.target.value;
    renderKiyaslama();
  };
  $("#kiyas-filtre").onchange = (e) => {
    state._kiyasFiltre = e.target.value;
    renderKiyaslama();
  };
}

function renderSikKullanilan() {
  const q = (state._sikQ || "").toLowerCase();
  const kat = state._sikKat || "";
  const src = state._sikSrc || "";
  const all = state.sik_kullanilan || [];
  const cats = [...new Set(all.map((s) => s.kategori))].sort((a, b) => a.localeCompare(b, "tr"));
  const rows = all.filter((s) => {
    if (kat && s.kategori !== kat) return false;
    if (src === "ofispanda" && s.kaynak !== "Ofispanda") return false;
    if (src === "gider" && s.kaynak !== "Gider") return false;
    if (src === "sik" && !(s.tekrar >= 5 || s.kaynak === "Ofispanda")) return false;
    if (!q) return true;
    const hay = `${s.ad} ${s.birim} ${s.kategori} ${s.kaynak} ${s.biz_ad || ""}`.toLowerCase();
    return hay.includes(q);
  });
  const ofisN = all.filter((s) => s.kaynak === "Ofispanda").length;
  const giderN = all.filter((s) => s.kaynak === "Gider").length;

  main.innerHTML = `
    <section class="card intel-head">
      <div>
        <h2 style="margin:0">Sık kullanılan ürünler</h2>
        <p class="lead-sm">Ofispanda teklifi (22 Nisan 2025) + Swissmed gider Excel (04.09.2026). Aynı SKU bir kez. Gider fiyatı satırların ortanca birim fiyatı (KDV hariç).</p>
      </div>
      <div class="intel-pills">
        <span class="pill">${all.length} benzersiz</span>
        <span class="pill">Ofispanda ${ofisN}</span>
        <span class="pill">Gider ${giderN}</span>
      </div>
    </section>
    <section class="card">
      <div class="toolbar wrap">
        <input id="sik-q" placeholder="Ürün ara…" value="${escapeHtml(state._sikQ || "")}" />
        <select id="sik-kat">
          <option value="">Tüm kategoriler</option>
          ${cats
            .map((c) => `<option value="${escapeHtml(c)}" ${c === kat ? "selected" : ""}>${escapeHtml(c)}</option>`)
            .join("")}
        </select>
        <select id="sik-src">
          <option value="" ${!src ? "selected" : ""}>Tüm kaynaklar</option>
          <option value="ofispanda" ${src === "ofispanda" ? "selected" : ""}>Ofispanda teklif</option>
          <option value="gider" ${src === "gider" ? "selected" : ""}>Gider Excel</option>
          <option value="sik" ${src === "sik" ? "selected" : ""}>En sık (5+ tekrar veya teklif)</option>
        </select>
      </div>
      <p class="muted tiny">${rows.length} kalem</p>
      <div class="table-wrap intel-wrap">
        <table class="list intel">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Kaynak</th>
              <th>Tekrar</th>
              <th>Fiyat</th>
              <th>Hedef</th>
              <th>Bizim alış</th>
              <th>Fark</th>
            </tr>
          </thead>
          <tbody>
            ${
              rows
                .map((s) => {
                  const iyi = s.fark != null && s.fark > 0;
                  const kotu = s.fark != null && s.fark < 0;
                  const fiyat = s.ofispanda != null ? s.ofispanda : s.fiyat;
                  return `<tr class="${iyi ? "row-good" : kotu ? "row-bad" : ""}">
              <td>
                <div class="u-ad">${escapeHtml(s.ad)}</div>
                <div class="muted tiny">${escapeHtml(s.kategori)} · ${escapeHtml(s.birim)}</div>
              </td>
              <td class="sm">${escapeHtml(s.kaynak || "—")}</td>
              <td>${s.tekrar != null ? s.tekrar : s.teklif_no != null ? `<span class="muted">#${s.teklif_no}</span>` : "—"}</td>
              <td class="money">${fiyat != null ? fmtMoney(fiyat) : "—"}</td>
              <td>${s.hedef != null ? `<span class="money">${fmtMoney(s.hedef)}</span>` : `<span class="muted">—</span>`}</td>
              <td>${
                s.biz_birim_fiyat != null
                  ? `<div class="money">${fmtMoney(s.biz_birim_fiyat)}</div>
                     <div class="muted tiny">${escapeHtml(s.biz_tedarikci || "")}<br/>${escapeHtml(s.biz_ad || "")}</div>`
                  : `<span class="muted">—</span>`
              }</td>
              <td>${
                s.fark == null
                  ? `<span class="muted">—</span>`
                  : `<span class="money ${iyi ? "good" : kotu ? "bad" : ""}">${s.fark > 0 ? "+" : ""}${fmtMoney(s.fark)}</span>`
              }</td>
            </tr>`;
                })
                .join("") || `<tr><td colspan="7" class="muted">Sonuç yok.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;

  const qEl = $("#sik-q");
  qEl.oninput = (e) => {
    state._sikQ = e.target.value;
    const pos = e.target.selectionStart;
    renderSikKullanilan();
    const again = $("#sik-q");
    if (again) {
      again.focus();
      again.setSelectionRange(pos, pos);
    }
  };
  $("#sik-kat").onchange = (e) => {
    state._sikKat = e.target.value;
    renderSikKullanilan();
  };
  $("#sik-src").onchange = (e) => {
    state._sikSrc = e.target.value;
    renderSikKullanilan();
  };
}

function renderSelcuk() {
  const groups = state.selcuk || [];
  const bakis = state.selcuk_bakis || [];
  const kat = state._selcukKat || "bakis";
  const isBakis = kat === "bakis";
  const g = groups.find((x) => x.id === kat);
  if (!isBakis && !g) {
    main.innerHTML = emptyCard("Selçuk");
    return;
  }
  const jump = [
    ["bakis", "Tek bakış"],
    ...groups.map((x) => [x.id, x.ad]),
  ];
  const body = isBakis
    ? `<section class="card">
      <h2 style="margin-top:0">Ne satıyoruz</h2>
      <p class="selcuk-soru">Kapıda tek cümle: hijyen kâğıt, çöp, temizlik sıvısı, içecek, ambalaj, kırtasiye, PC sarf. Detay için alttaki gruba bas.</p>
      <div class="selcuk-bakis">
        ${bakis
          .map(
            (b) => `<article class="selcuk-bakis-card">
          <h3>${escapeHtml(b.ad)}</h3>
          <div class="selcuk-tags">${b.kalemler.map((k) => `<span>${escapeHtml(k)}</span>`).join("")}</div>
        </article>`
          )
          .join("")}
      </div>
    </section>`
    : `<section class="card">
      <h2 style="margin-top:0">${escapeHtml(g.ad)}</h2>
      <p class="selcuk-soru">${escapeHtml(g.soru)}</p>
      <div class="selcuk-list">
        ${g.urunler
          .map(
            (u) => `<article class="selcuk-item">
          <div class="selcuk-item-top">
            <b>${escapeHtml(u.ad)}</b>
            <span class="badge ${u.stok === "cekirdek" ? "good" : "neu"}">${u.stok === "cekirdek" ? "çekirdek" : "siparişe"}</span>
          </div>
          <div class="muted tiny">${escapeHtml(u.birim)}${u.alis != null ? ` · alış ${fmtMoney(u.alis)} ₺` : ""}</div>
          ${u.onlar ? `<div class="selcuk-onlar">Onlar: ${escapeHtml(u.onlar)}</div>` : ""}
          <div class="selcuk-biz">Biz: ${escapeHtml(u.biz)}</div>
          <div class="muted tiny">${escapeHtml(u.sinyal)}</div>
        </article>`
          )
          .join("")}
      </div>
    </section>`;
  main.innerHTML = `
    <section class="card intel-head">
      <div>
        <h2 style="margin:0">Selçuk · klinik saha</h2>
        <p class="lead-sm">Önce tek bakış. Kapıda fiyat yok — ne sattığını söyle, dispenser ve aylık tutarı yaz.</p>
      </div>
    </section>
    <div class="selcuk-jump">
      ${jump
        .map(
          ([id, ad]) =>
            `<button type="button" data-kat="${escapeHtml(id)}" class="${id === kat ? "active" : ""}">${escapeHtml(ad)}</button>`
        )
        .join("")}
    </div>
    ${body}
  `;
  document.querySelectorAll(".selcuk-jump button").forEach((btn) => {
    btn.onclick = () => {
      state._selcukKat = btn.dataset.kat;
      renderSelcuk();
    };
  });
}

function fmtWhen(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderVitrinTalepler() {
  const rows = state.vitrin_teklifler || [];
  main.innerHTML = `
    <section class="card">
      <h2 style="margin-top:0">ferrapro.com teklif formları</h2>
      <p class="lead-sm">${rows.length} kayıt. Fiyat yok; dönüş saha / ortak üzerinden.</p>
      <table class="grid">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Firma</th>
            <th>Tel</th>
            <th>Grup</th>
            <th>Not</th>
          </tr>
        </thead>
        <tbody>
          ${
            rows.length
              ? rows
                  .map(
                    (r) => `
            <tr>
              <td class="muted tiny">${escapeHtml(fmtWhen(r.created_at))}</td>
              <td>${escapeHtml(r.firma)}${r.yetkili ? `<div class="muted tiny">${escapeHtml(r.yetkili)}</div>` : ""}</td>
              <td>${escapeHtml(r.tel)}</td>
              <td>${escapeHtml(r.grup || "—")}</td>
              <td>${escapeHtml([r.urun, r.not].filter(Boolean).join(" · ") || "—")}</td>
            </tr>`
                  )
                  .join("")
              : `<tr><td colspan="5" class="muted">Henüz talep yok.</td></tr>`
          }
        </tbody>
      </table>
    </section>
  `;
}

function renderKlinikNot() {
  const edit = state._klinikEdit || null;
  const q = (state._klinikQ || "").toLowerCase();
  const all = state.klinik_notlar || [];
  const rows = all.filter((r) => {
    if (!q) return true;
    return `${r.klinik} ${r.tedarikci} ${r.urun_notu} ${r.tel}`.toLowerCase().includes(q);
  });
  main.innerHTML = `
    <section class="card">
      <h2 style="margin-top:0">${edit ? "Kaydı düzenle" : "Klinik notu"}</h2>
      <form id="klinik-form" class="form-grid">
        <label>Klinik adı<input name="klinik" required value="${escapeHtml(edit?.klinik || "")}" /></label>
        <label>Nereden alıyor<input name="tedarikci" value="${escapeHtml(edit?.tedarikci || "")}" placeholder="Ofispanda, Avansas…" /></label>
        <label class="span-2">Ne kullanıyor<textarea name="urun_notu" rows="2" placeholder="Tuvalet kağıdı, çöp, eldiven…">${escapeHtml(edit?.urun_notu || "")}</textarea></label>
        <label>Telefon<input name="tel" inputmode="tel" value="${escapeHtml(edit?.tel || "")}" /></label>
        <label>Tahmini aylık (₺)<input name="aylik_tahmini" type="number" min="0" step="500" value="${edit?.aylik_tahmini ?? ""}" /></label>
        <div class="form-actions">
          <button class="btn" type="submit">${edit ? "Güncelle" : "Kaydet"}</button>
          ${edit ? `<button class="btn-ghost" type="button" id="klinik-cancel">Vazgeç</button>` : ""}
          <span id="klinik-msg" class="muted"></span>
        </div>
      </form>
    </section>
    <section class="card">
      <div class="toolbar wrap">
        <input id="klinik-q" placeholder="Klinik, ürün, tedarikçi ara…" value="${escapeHtml(state._klinikQ || "")}" />
      </div>
      <p class="muted tiny">${rows.length} kayıt</p>
      <div class="selcuk-list">
        ${
          rows
            .map(
              (r) => `<article class="selcuk-item">
          <div class="selcuk-item-top">
            <b>${escapeHtml(r.klinik)}</b>
            <span class="muted tiny">${escapeHtml(fmtWhen(r.updated_at || r.created_at))} · ${escapeHtml(r.by || "")}</span>
          </div>
          <div class="muted tiny">${[r.tedarikci, r.tel].filter(Boolean).map(escapeHtml).join(" · ")}${r.aylik_tahmini != null ? ` · ${fmtMoney(r.aylik_tahmini)} ₺/ay` : ""}</div>
          ${r.urun_notu ? `<div class="selcuk-biz">${escapeHtml(r.urun_notu)}</div>` : ""}
          <div class="row-actions">
            <button type="button" class="btn-ghost sm" data-edit="${r.id}">Aç</button>
            <button type="button" class="btn-ghost sm danger" data-del="${r.id}">Sil</button>
          </div>
        </article>`
            )
            .join("") || `<p class="muted">Henüz kayıt yok. Yukarıdan ilk kliniği kaydet.</p>`
        }
      </div>
    </section>
  `;
  const qEl = $("#klinik-q");
  qEl.oninput = (e) => {
    state._klinikQ = e.target.value;
    renderKlinikNot();
    const again = $("#klinik-q");
    if (again) {
      again.focus();
      again.setSelectionRange(e.target.selectionStart, e.target.selectionStart);
    }
  };
  $("#klinik-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    const msg = $("#klinik-msg");
    msg.textContent = "Kaydediliyor…";
    try {
      if (edit) body.id = edit.id;
      const res = await api("/api/klinik-not", {
        method: edit ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      state.klinik_notlar = res.klinik_notlar;
      state._klinikEdit = null;
      msg.textContent = "Kaydedildi";
      renderKlinikNot();
    } catch (err) {
      msg.textContent = err.message;
    }
  };
  const cancel = $("#klinik-cancel");
  if (cancel) {
    cancel.onclick = () => {
      state._klinikEdit = null;
      renderKlinikNot();
    };
  }
  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.edit);
      state._klinikEdit = all.find((x) => x.id === id) || null;
      renderKlinikNot();
      window.scrollTo(0, 0);
    };
  });
  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = async () => {
      if (!confirm("Bu klinik notunu sil?")) return;
      try {
        const res = await api("/api/klinik-not", {
          method: "DELETE",
          body: JSON.stringify({ id: Number(btn.dataset.del) }),
        });
        state.klinik_notlar = res.klinik_notlar;
        if (state._klinikEdit?.id === Number(btn.dataset.del)) state._klinikEdit = null;
        renderKlinikNot();
      } catch (err) {
        alert(err.message);
      }
    };
  });
}

function renderMaliyet() {
  const m = { ...(state.maliyet || {}) };
  // Eski alanlardan yeni alanlara yumuşak geçiş
  if (!m.hedef_aylik_ciro && m.hedef_koli_ay) m.hedef_aylik_ciro = 400000;
  if (!m.cari_aylik_ciro) m.cari_aylik_ciro = 60000;
  main.innerHTML = `
    <section class="card">
      <h2>Aylık sabit gider & ciro hedefi</h2>
      <p class="lead-sm">Sabitler (araç, yakıt, personel, depo) <b>aylık fatura cirosu</b> ile karşılanır. Ürünler brüt % ile kıyaslanır — kürdan kolisi ile A4 kolisi eşit sayılmaz.</p>
      <form id="maliyet-form" class="form-grid">
        <label>Araç / amortisman (₺/ay)<input name="aylik_arac" type="number" step="1" value="${m.aylik_arac ?? 8000}" /></label>
        <label>Yakıt (₺/ay)<input name="aylik_yakit" type="number" step="1" value="${m.aylik_yakit ?? 12000}" /></label>
        <label>Personel (₺/ay)<input name="aylik_personel" type="number" step="1" value="${m.aylik_personel ?? 45000}" /></label>
        <label>Depo / dükkan (₺/ay)<input name="aylik_depo" type="number" step="1" value="${m.aylik_depo ?? 12000}" /></label>
        <label>Diğer (₺/ay)<input name="aylik_diger" type="number" step="1" value="${m.aylik_diger ?? 5000}" /></label>
        <label>Hedef aylık ciro (₺)<input name="hedef_aylik_ciro" type="number" step="1000" value="${m.hedef_aylik_ciro ?? 400000}" /></label>
        <label>Cari başı aylık fatura — büyük (₺)<input name="cari_aylik_ciro" type="number" step="1000" value="${m.cari_aylik_ciro ?? 60000}" /></label>
        <label>Cari başı aylık fatura — küçük (₺)<input name="cari_kucuk_ciro" type="number" step="1000" value="${m.cari_kucuk_ciro ?? 35000}" /></label>
        <label>Asgari brüt % (üründe)<input name="min_brut_pct" type="number" step="0.5" value="${m.min_brut_pct ?? 12}" /></label>
        <label>Online min. sepet (₺)<input name="min_sepet_online" type="number" step="1" value="${m.min_sepet_online ?? 3000}" /></label>
        <label>Vade risk eşiği — cari tahsilat (gün)<input name="vade_risk_gun" type="number" step="1" value="${m.vade_risk_gun ?? 45}" /></label>
        <label>Tedarikçi ödeme vadesi (gün)<input name="tedarikci_vade_gun" type="number" step="1" value="${m.tedarikci_vade_gun ?? 30}" /></label>
        <label>Çekirdek stok süresi (gün)<input name="stok_gun_cekirdek" type="number" step="1" value="${m.stok_gun_cekirdek ?? 21}" /></label>
        <div class="form-actions">
          <button class="btn" type="submit">Kaydet ve yeniden hesapla</button>
          <span id="maliyet-msg" class="muted"></span>
        </div>
      </form>
      <div class="calc-box">
        <div>Aylık sabit: <b>${fmtMoney(state.operasyon_aylik || 0)} ₺</b></div>
        <div>Sabit / hedef ciro: <b>%${state.sabit_pct_ciro ?? "—"}</b></div>
        <div>Başa baş ciro: <b>${fmtMoney((state.basa_bas || {}).basa_bas_ciro || 0)} ₺/ay</b> ≈ <b>${(state.basa_bas || {}).basa_bas_cari ?? "—"} cari</b></div>
      </div>
    </section>
  `;
  $("#maliyet-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());
    const msg = $("#maliyet-msg");
    msg.textContent = "Hesaplanıyor…";
    try {
      const res = await api("/api/maliyet", { method: "POST", body: JSON.stringify(body) });
      applyAnalytics(res);
      msg.textContent = "Kaydedildi";
      renderMaliyet();
    } catch (err) {
      msg.textContent = err.message;
    }
  };
}

function renderCariler() {
  const list = state.cariler || [];
  const p = state.cari_portfoy || {};
  const edit = state._cariEdit || null;
  main.innerHTML = `
    <section class="card">
      <h2>${edit ? "Cari düzenle" : "Cari ekle"}</h2>
      <p class="lead-sm">Aylık fatura (KDV hariç) başa baş hesabına girer. Swissmed ~60.000, küçük/orta ~30–40.000.</p>
      <form id="cari-form" class="form-grid">
        <label>Unvan / ad<input name="ad" required value="${escapeHtml(edit?.ad || "")}" placeholder="Swissmed Dental" /></label>
        <label>Aylık fatura (₺)<input name="aylik_ciro" type="number" step="1000" min="0" required value="${edit?.aylik_ciro ?? ""}" placeholder="60000" /></label>
        <label>Not<input name="not" value="${escapeHtml(edit?.not || "")}" placeholder="vade, kişi…" /></label>
        <div class="form-actions">
          <button class="btn" type="submit">${edit ? "Güncelle" : "Ekle"}</button>
          ${edit ? `<button class="btn-ghost" type="button" id="cari-cancel">Vazgeç</button>` : ""}
          <span id="cari-msg" class="muted"></span>
        </div>
      </form>
    </section>
    <section class="card">
      <h2>Kayıtlı cariler (${list.length})</h2>
      <div class="rules" style="margin-bottom:14px">
        <div class="rule"><b>Toplam ciro</b><span>${fmtMoney(p.mevcut_ciro || 0)} ₺/ay</span></div>
        <div class="rule"><b>Brüt</b><span>${fmtMoney(p.mevcut_brut || 0)} ₺</span></div>
        <div class="rule"><b>Sabit sonrası</b><span class="${p.karli ? "money good" : "money bad"}">${fmtMoney(p.mevcut_net || 0)} ₺</span></div>
        <div class="rule"><b>Eksik ciro</b><span>${fmtMoney(p.acik || 0)} ₺</span></div>
      </div>
      <div class="table-wrap">
        <table class="list">
          <thead><tr><th>Cari</th><th>Aylık fatura</th><th>Brüt pay</th><th></th></tr></thead>
          <tbody>
            ${
              list.length
                ? list
                    .map((c) => {
                      const satir = (p.satirlar || []).find((s) => s.id === c.id);
                      return `<tr>
                  <td><b>${escapeHtml(c.ad)}</b>${c.not ? `<div class="muted tiny">${escapeHtml(c.not)}</div>` : ""}</td>
                  <td>${fmtMoney(c.aylik_ciro)}</td>
                  <td>${fmtMoney(satir?.brut ?? 0)}</td>
                  <td class="row-actions">
                    <button type="button" class="btn-ghost sm" data-edit="${c.id}">Düzenle</button>
                    <button type="button" class="btn-ghost sm danger" data-del="${c.id}">Sil</button>
                  </td>
                </tr>`;
                    })
                    .join("")
                : `<tr><td colspan="4" class="muted">Henüz cari yok — Swissmed’i 60.000 ile ekleyerek başlayın.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;
  $("#cari-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      ad: fd.get("ad"),
      aylik_ciro: fd.get("aylik_ciro"),
      not: fd.get("not"),
    };
    const msg = $("#cari-msg");
    msg.textContent = "Kaydediliyor…";
    try {
      let res;
      if (edit) {
        res = await api("/api/cari", { method: "PUT", body: JSON.stringify({ id: edit.id, ...body }) });
      } else {
        res = await api("/api/cari", { method: "POST", body: JSON.stringify(body) });
      }
      applyAnalytics(res);
      state._cariEdit = null;
      renderCariler();
    } catch (err) {
      msg.textContent = err.message;
    }
  };
  const cancel = $("#cari-cancel");
  if (cancel) {
    cancel.onclick = () => {
      state._cariEdit = null;
      renderCariler();
    };
  }
  main.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.edit);
      state._cariEdit = (state.cariler || []).find((c) => c.id === id) || null;
      renderCariler();
    };
  });
  main.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.del);
      const c = (state.cariler || []).find((x) => x.id === id);
      if (!c || !confirm(`${c.ad} silinsin mi?`)) return;
      const res = await api("/api/cari", { method: "DELETE", body: JSON.stringify({ id }) });
      applyAnalytics(res);
      if (state._cariEdit?.id === id) state._cariEdit = null;
      renderCariler();
    };
  });
}

function renderOps(key) {
  const maps = {
    cariler: {
      title: "Cariler",
      points: [
        "Sahadaki vadeli cariler burada yönetilir — online peşin kanalından ayrı.",
        "Vade günü aşımında sevkiyat uyarısı (zarar önleme).",
        "İlk sürüm: kayıt altyapısı hazır; cari kartları sonraki adımda eklenecek.",
      ],
    },
    siparisler: {
      title: "Siparişler",
      points: [
        "Satış tabanı altı fiyatla sipariş açılamayacak (maliyet modeli).",
        "Online siparişlerde min. sepet zorunlu.",
        "Stoksuz yüksek tutarlı kalemde peşin tahsilat kuralı.",
      ],
    },
    sevkiyat: {
      title: "Sevkiyat",
      points: [
        "Rota + yakıt payı operasyon birimine bağlı.",
        "Ödenmemiş vade > eşik ise sevkiyat kilidi.",
        "İrsaliye / foto kanıt alanı sonraki adımda.",
      ],
    },
    faturalar: {
      title: "Faturalar",
      points: ["Alış ve satış faturaları ayrı izlenecek.", "KDV hariç alış / KDV’li satış netliği korunacak."],
    },
    kasa: {
      title: "Kasa",
      points: [
        "Peşin / kart / havale / vade tahsilatı ayrımı.",
        "Ortak pay (Ayfer–Ramazan) dönem sonu kasa özeti.",
        "Negatif kasa uyarısı — zarar erken görünür.",
      ],
    },
  };
  const info = maps[key] || { title: titles[key], points: [] };
  main.innerHTML = `
    <section class="card">
      <h2>${escapeHtml(info.title)}</h2>
      <p class="lead-sm">Modül iskeleti aktif — kurallar zarar önleme için tanımlandı, veri girişi sıradaki sprintte.</p>
      <ul class="ops-points">
        ${info.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
      </ul>
      <div class="rules" style="margin-top:16px">
        <div class="rule"><b>Min. sepet</b><span>${fmtMoney((state.maliyet || {}).min_sepet_online || 0)} ₺</span></div>
        <div class="rule"><b>Başa baş ciro</b><span>${fmtMoney((state.basa_bas || {}).basa_bas_ciro || 0)} ₺/ay</span></div>
        <div class="rule"><b>Vade eşiği</b><span>${(state.maliyet || {}).vade_risk_gun || 45} gün</span></div>
      </div>
    </section>
  `;
}

function renderPlaceholder(key) {
  main.innerHTML = emptyCard(titles[key] || "Sayfa");
}

function render() {
  if (user?.role === "sunum") {
    showSunum();
    return;
  }
  const key = route();
  setNav(key);
  if (key === "tedarik") renderTedarikPanel();
  else if (key === "mimari") renderMimariPanel();
  else if (key === "urunler") renderUrunler();
  else if (key === "kiyaslama") renderKiyaslama();
  else if (key === "sik") renderSikKullanilan();
  else if (key === "selcuk") renderSelcuk();
  else if (key === "klinik-not") renderKlinikNot();
  else if (key === "vitrin") renderVitrinTalepler();
  else if (key === "maliyet") renderMaliyet();
  else if (key === "cariler") renderCariler();
  else if (["siparisler", "sevkiyat", "faturalar", "kasa"].includes(key)) renderOps(key);
  else renderPlaceholder(key);
}

function filteredUrunler() {
  const q = sunumQ.toLowerCase();
  return (state.urunler || []).filter((u) => {
    if (sunumKat && u.kategori !== sunumKat) return false;
    if (!q) return true;
    return `${u.ad} ${u.ebat} ${u.kategori}`.toLowerCase().includes(q);
  });
}

function renderSunum() {
  const cats = [...new Set((state.urunler || []).map((u) => u.kategori))].sort((a, b) =>
    a.localeCompare(b, "tr")
  );
  const catEl = $("#sunum-cats");
  catEl.innerHTML =
    `<button type="button" data-kat="" class="${!sunumKat ? "active" : ""}">Tümü</button>` +
    cats
      .map(
        (c) =>
          `<button type="button" data-kat="${escapeHtml(c)}" class="${sunumKat === c ? "active" : ""}">${escapeHtml(c)}</button>`
      )
      .join("");
  catEl.querySelectorAll("button").forEach((btn) => {
    btn.onclick = () => {
      sunumKat = btn.dataset.kat || "";
      renderSunum();
    };
  });

  const qInput = $("#sunum-q");
  if (qInput && qInput.value !== sunumQ) qInput.value = sunumQ;

  const list = filteredUrunler();
  const countEl = $("#sunum-count");
  if (countEl) countEl.textContent = `${list.length} kalem`;

  const grid = $("#sunum-grid");
  let lastKat = null;
  const parts = [];
  for (const u of list) {
    if (!sunumKat && u.kategori !== lastKat) {
      lastKat = u.kategori;
      const p = pitch[u.kategori] || "";
      parts.push(`
        <tr class="sunum-group">
          <td colspan="5">${escapeHtml(u.kategori)}${p ? `<span class="pitch">${escapeHtml(p)}</span>` : ""}</td>
        </tr>
      `);
    }
    const on = picks.has(u.id);
    parts.push(`
      <tr class="${on ? "picked" : ""}" data-id="${u.id}">
        <td class="col-check"><div class="check">${on ? "✓" : ""}</div></td>
        <td class="kat-cell">${escapeHtml(u.kategori)}</td>
        <td class="ad-cell">${escapeHtml(u.ad)}</td>
        <td class="ebat-cell">${escapeHtml(u.ebat)}</td>
        <td class="birim-cell">${escapeHtml(u.birim)}</td>
      </tr>
    `);
  }
  grid.innerHTML =
    parts.join("") ||
    `<tr><td colspan="5" style="padding:24px;color:var(--muted)">Sonuç yok.</td></tr>`;
  grid.querySelectorAll("tr[data-id]").forEach((row) => {
    row.onclick = () => togglePick(Number(row.dataset.id));
  });
  $("#pick-count").textContent = String(picks.size);
  paintPicks();
}

function togglePick(id) {
  if (picks.has(id)) picks.delete(id);
  else picks.add(id);
  renderSunum();
}

function paintPicks() {
  const ul = $("#pick-list");
  const items = (state.urunler || []).filter((u) => picks.has(u.id));
  ul.innerHTML = items.length
    ? items
        .map(
          (u) =>
            `<li><button type="button" class="rm" data-id="${u.id}">×</button><strong>${escapeHtml(u.ad)}</strong><br/><span class="muted">${escapeHtml(u.ebat)} · ${escapeHtml(u.birim)}</span></li>`
        )
        .join("")
    : `<li class="muted">Henüz seçim yok. Kartlara dokunun.</li>`;
  ul.querySelectorAll(".rm").forEach((btn) => {
    btn.onclick = () => {
      picks.delete(Number(btn.dataset.id));
      renderSunum();
    };
  });
}

async function enterApp(u) {
  user = u;
  state = await api("/api/state");
  who.textContent = user.name;
  applyRoleNav();
  if (user.role === "sunum") showSunum();
  else {
    if (user.role === "saha" && !["selcuk", "klinik-not", "urunler", "kiyaslama", "sik"].includes(route())) {
      location.hash = "#/selcuk";
    }
    showOrtak();
  }
}

async function boot() {
  try {
    const me = await api("/api/me");
    await enterApp(me.user);
  } catch {
    showLogin();
  }
}

$("#login-form").onsubmit = async (e) => {
  e.preventDefault();
  loginErr.textContent = "";
  const fd = new FormData(e.target);
  try {
    const res = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });
    await enterApp(res.user);
  } catch (err) {
    loginErr.textContent = err.message;
  }
};

async function doLogout() {
  await api("/api/logout", { method: "POST" });
  user = null;
  state = null;
  picks.clear();
  showLogin();
}

$("#logout").onclick = doLogout;
$("#sunum-logout").onclick = doLogout;

$("#sunum-q").oninput = (e) => {
  sunumQ = e.target.value;
  renderSunum();
};

$("#sunum-list").onclick = () => {
  $("#sunum-drawer").classList.toggle("hidden");
};
$("#drawer-close").onclick = () => $("#sunum-drawer").classList.add("hidden");
$("#pick-clear").onclick = () => {
  picks.clear();
  renderSunum();
};
$("#pick-copy").onclick = async () => {
  const items = (state.urunler || []).filter((u) => picks.has(u.id));
  const text = items
    .map((u, i) => `${i + 1}. ${u.ad} — ${u.ebat} (${u.birim})`)
    .join("\n");
  const full = `Ferranoi Tedarik — talep listesi\n\n${text || "(boş)"}`;
  try {
    await navigator.clipboard.writeText(full);
    $("#pick-copy").textContent = "Kopyalandı";
    setTimeout(() => {
      $("#pick-copy").textContent = "Listeyi kopyala";
    }, 1500);
  } catch {
    prompt("Kopyala:", full);
  }
};

window.addEventListener("hashchange", () => {
  if (user && user.role !== "sunum") render();
});

boot();
