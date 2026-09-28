(() => {
  const PUBLIC = "/katalog.json";
  const SEED = "/yonetim/catalog.json";
  const PRICE_STORE = "ferrapro.yonetim.fiyat.v2";
  const EXTRA_STORE = "ferrapro.yonetim.extras.v2";
  const THEME = "ferrapro.yonetim.theme";
  const VIEW = "ferrapro.yonetim.view";
  const BIRIMLER = ["Adet", "Koli", "Kg", "Lt", "Gr", "ML", "Paket", "Rulo", "Kutu"];

  const state = {
    catalog: null,
    extras: [],
    loading: true,
    error: "",
    q: "",
    ana: "",
    alt: "",
    page: "katalog",
    filters: { marka: "", birim: "", aktif: "" },
    view: localStorage.getItem(VIEW) || "table",
    expanded: {},
    drawer: null,
    pendingDelete: null,
  };

  const $ = (id) => document.getElementById(id);
  const mobile = () => matchMedia("(max-width: 900px)").matches;

  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : String(v));
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  function toast(msg) {
    const el = $("toast");
    el.hidden = false;
    el.textContent = msg;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { el.hidden = true; }, 2200);
  }

  function anaById(id) {
    return (state.catalog.kategoriler || []).find((k) => k.id === id);
  }
  function altById(anaId, altId) {
    return (anaById(anaId)?.altlar || []).find((a) => a.id === altId);
  }
  function anaAd(id) { return anaById(id)?.ad || ""; }
  function altAd(anaId, altId) { return altById(anaId, altId)?.ad || ""; }

  function num(v) {
    if (v == null || v === "") return null;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  function money(v) {
    const n = num(v);
    if (n == null) return "—";
    return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";
  }

  function karYuzde(satis, maliyet) {
    const s = num(satis);
    const m = num(maliyet);
    if (s == null || s <= 0 || m == null) return null;
    return ((s - m) / s) * 100;
  }

  function karText(satis, maliyet) {
    const k = karYuzde(satis, maliyet);
    if (k == null) return "—";
    return k.toLocaleString("tr-TR", { maximumFractionDigits: 1 }) + " %";
  }

  function karClass(satis, maliyet) {
    const k = karYuzde(satis, maliyet);
    if (k == null) return "";
    if (k < 0) return "kar-neg";
    if (k < 15) return "kar-low";
    return "kar-ok";
  }

  function anaSatis(u) {
    return u.idealSatis || u.listeFiyat || u.dipSatis || u.fiyat;
  }

  function inferBirim(u) {
    const t = `${u.olcu || ""} ${u.kapasite || ""} ${u.ambalajAdedi || ""}`.toLocaleLowerCase("tr");
    if (/\bkg\b/.test(t)) return "Kg";
    if (/\blt\b|litre/.test(t)) return "Lt";
    if (/\bml\b|mililitre/.test(t)) return "ML";
    if (/\bgr\b|gram/.test(t)) return "Gr";
    if (/koli/.test(t)) return "Koli";
    if (/rulo/.test(t)) return "Rulo";
    if (/paket|kutu/.test(t)) return "Paket";
    return "Adet";
  }

  function priceSlice(u) {
    return {
      birim: u.birim || "",
      maliyet: u.maliyet ?? null,
      listeFiyat: u.listeFiyat ?? null,
      idealSatis: u.idealSatis ?? null,
      dipSatis: u.dipSatis ?? null,
      fiyat: u.listeFiyat ?? u.fiyat ?? null,
    };
  }

  function persist() {
    const prices = {};
    for (const u of state.catalog.urunler) prices[u.id] = priceSlice(u);
    localStorage.setItem(PRICE_STORE, JSON.stringify(prices));
    localStorage.setItem(EXTRA_STORE, JSON.stringify(state.extras));
  }

  function mapPublic(row) {
    return {
      id: row.id,
      ad: row.ad,
      anaKategoriId: row.kategori,
      altKategoriId: row.alt,
      marka: row.marka || "",
      olcu: row.olcu || "",
      kapasite: row.kapasite || "",
      malzeme: row.malzeme || "",
      renk: row.renk || "",
      ambalajAdedi: row.ambalajAdedi || "",
      urunTuru: row.urunTuru || "",
      aciklama: row.aciklama || "",
      not: row.not || "",
      aktif: row.aktif !== false,
      sira: row.sira || 0,
      kaynak: "site",
      birim: "",
      maliyet: null,
      listeFiyat: null,
      idealSatis: null,
      dipSatis: null,
      fiyat: null,
    };
  }

  function applyOverlay(row, overlay) {
    if (!overlay) return row;
    return {
      ...row,
      birim: overlay.birim || row.birim || inferBirim(row),
      maliyet: overlay.maliyet ?? row.maliyet,
      listeFiyat: overlay.listeFiyat ?? row.listeFiyat,
      idealSatis: overlay.idealSatis ?? row.idealSatis,
      dipSatis: overlay.dipSatis ?? row.dipSatis,
      fiyat: overlay.listeFiyat ?? overlay.fiyat ?? row.fiyat,
    };
  }

  function unique(list, key) {
    return [...new Set(list.map((x) => String(x[key] || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
  }

  function filtered() {
    const q = state.q.trim().toLocaleLowerCase("tr");
    const f = state.filters;
    return state.catalog.urunler.filter((u) => {
      if (state.ana && u.anaKategoriId !== state.ana) return false;
      if (state.alt && u.altKategoriId !== state.alt) return false;
      if (f.marka && u.marka !== f.marka) return false;
      if (f.birim && (u.birim || inferBirim(u)) !== f.birim) return false;
      if (f.aktif === "aktif" && !u.aktif) return false;
      if (f.aktif === "pasif" && u.aktif) return false;
      if (!q) return true;
      const blob = [u.ad, u.marka, anaAd(u.anaKategoriId), altAd(u.anaKategoriId, u.altKategoriId)]
        .join(" ").toLocaleLowerCase("tr");
      return blob.includes(q);
    });
  }

  function parseHash() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const parts = raw.split("/").filter(Boolean);
    state.page = "katalog";
    state.ana = "";
    state.alt = "";
    if (parts[0] === "markalar") state.page = "markalar";
    else if (parts[0] === "kategoriler") state.page = "kategoriler";
    else if (parts[0] === "ayarlar") state.page = "ayarlar";
    else if (parts[0] === "k") {
      state.ana = parts[1] || "";
      state.alt = parts[2] || "";
      if (state.ana) state.expanded[state.ana] = true;
    }
  }

  function go(hash) { location.hash = hash; }

  function applyTheme() {
    const accent = localStorage.getItem(THEME);
    if (accent) document.documentElement.style.setProperty("--accent", accent);
  }

  function nextExtraId() {
    const nums = state.extras.map((u) => Number(String(u.id).replace(/\D/g, "")) || 0);
    return "x-" + String(Math.max(9000, ...nums) + 1);
  }

  function blankProduct() {
    return {
      id: "",
      ad: "",
      anaKategoriId: state.ana || state.catalog.kategoriler[0]?.id || "",
      altKategoriId: state.alt || "",
      marka: "",
      olcu: "",
      kapasite: "",
      malzeme: "",
      renk: "",
      ambalajAdedi: "",
      urunTuru: "",
      aciklama: "",
      not: "",
      aktif: true,
      kaynak: "local",
      birim: "Adet",
      maliyet: null,
      listeFiyat: null,
      idealSatis: null,
      dipSatis: null,
      fiyat: null,
      sira: (state.catalog.urunler.at(-1)?.sira || 0) + 1,
    };
  }

  function renderNav() {
    const tree = $("nav-tree");
    tree.replaceChildren();
    tree.append(h("span", { class: "nav-label", text: "Ürün Kataloğu" }));
    tree.append(h("a", {
      href: "#/",
      class: !state.ana && state.page === "katalog" ? "is-on" : "",
      text: "Tüm ürünler",
    }));
    for (const kat of state.catalog.kategoriler) {
      const open = state.expanded[kat.id] || kat.id === state.ana;
      const wrap = h("div", { class: "nav-ana" + (open ? " open" : "") });
      wrap.append(h("button", {
        class: "nav-ana-btn" + (state.ana === kat.id && !state.alt ? " is-on" : ""),
        type: "button",
        onclick: () => { state.expanded[kat.id] = true; go("#/k/" + kat.id); },
      }, kat.ad, h("span", { class: "chev", text: "›" })));
      const alts = h("div", { class: "nav-alts" });
      for (const alt of kat.altlar || []) {
        alts.append(h("a", {
          href: `#/k/${kat.id}/${alt.id}`,
          class: state.alt === alt.id ? "is-on" : "",
          text: alt.ad,
        }));
      }
      wrap.append(alts);
      tree.append(wrap);
    }
    tree.append(
      h("span", { class: "nav-label", text: "Yönetim" }),
      h("a", { href: "#/markalar", class: state.page === "markalar" ? "nav-link is-on" : "nav-link", text: "Markalar" }),
      h("a", { href: "#/kategoriler", class: state.page === "kategoriler" ? "nav-link is-on" : "nav-link", text: "Kategoriler" }),
      h("a", { href: "#/ayarlar", class: state.page === "ayarlar" ? "nav-link is-on" : "nav-link", text: "Ayarlar" }),
    );
  }

  function selectOpts(values, current, empty = "Tümü") {
    const s = h("select");
    s.append(new Option(empty, ""));
    values.forEach((v) => s.append(new Option(v, v)));
    s.value = current || "";
    return s;
  }

  function renderFilters(items) {
    const box = $("filters");
    if (state.page !== "katalog") {
      box.hidden = true;
      return;
    }
    const pool = state.catalog.urunler.filter((u) => {
      if (state.ana && u.anaKategoriId !== state.ana) return false;
      if (state.alt && u.altKategoriId !== state.alt) return false;
      return true;
    });
    box.hidden = false;
    box.replaceChildren();
    const markaSel = selectOpts(unique(pool, "marka"), state.filters.marka);
    markaSel.addEventListener("change", () => { state.filters.marka = markaSel.value; render(); });
    box.append(h("label", {}, "Marka", markaSel));
    const birimSel = selectOpts(BIRIMLER, state.filters.birim);
    birimSel.addEventListener("change", () => { state.filters.birim = birimSel.value; render(); });
    box.append(h("label", {}, "Birim", birimSel));
    const aktif = selectOpts(["aktif", "pasif"], state.filters.aktif);
    aktif.options[1].text = "Aktif";
    aktif.options[2].text = "Pasif";
    aktif.addEventListener("change", () => { state.filters.aktif = aktif.value; render(); });
    box.append(h("label", {}, "Durum", aktif));
    const clear = h("button", { class: "btn ghost", type: "button", text: "Filtreleri temizle" });
    clear.addEventListener("click", () => {
      state.filters = { marka: "", birim: "", aktif: "" };
      state.q = "";
      $("q").value = "";
      render();
    });
    box.append(h("div", { class: "filter-actions" }, clear));
    box.dataset.count = String(items.length);
  }

  function dash(v) { return v ? v : "—"; }

  function statusChip(aktif) {
    return h("span", { class: "status " + (aktif ? "on" : "off"), text: aktif ? "Aktif" : "Pasif" });
  }

  function openView(id) { state.drawer = { mode: "view", id }; renderDrawer(); }
  function openEdit(id) { state.drawer = { mode: "edit", id }; renderDrawer(); }
  function openCreate() { state.drawer = { mode: "create", id: "" }; renderDrawer(); }

  function ops(u) {
    const wrap = h("div", { class: "ops" });
    const edit = h("button", { type: "button", text: "Düzenle" });
    edit.addEventListener("click", (e) => { e.stopPropagation(); openEdit(u.id); });
    wrap.append(edit);
    if (u.kaynak === "local") {
      const del = h("button", { type: "button", text: "Sil" });
      del.addEventListener("click", (e) => { e.stopPropagation(); askDelete(u.id); });
      wrap.append(del);
    }
    return wrap;
  }

  function renderTable(items) {
    const table = h("table", { class: "grid price-grid" });
    table.append(h("thead", {}, h("tr", {},
      ...["Ürün adı", "Marka", "Birim", "Maliyet", "Liste", "Ideal satış", "Dip satış", "Kârlılık", "Durum", "İşlemler"].map((t) => h("th", { text: t })),
    )));
    const body = h("tbody");
    for (const u of items) {
      const birim = u.birim || inferBirim(u);
      const satis = anaSatis(u);
      const tr = h("tr");
      tr.addEventListener("click", () => openView(u.id));
      tr.append(
        h("td", { text: u.ad }),
        h("td", { text: dash(u.marka) }),
        h("td", { text: birim }),
        h("td", { text: money(u.maliyet) }),
        h("td", { text: money(u.listeFiyat) }),
        h("td", { text: money(u.idealSatis) }),
        h("td", { text: money(u.dipSatis) }),
        h("td", { class: karClass(satis, u.maliyet), text: karText(satis, u.maliyet) }),
        h("td", {}, statusChip(u.aktif)),
        h("td", {}, ops(u)),
      );
      body.append(tr);
    }
    table.append(body);
    return h("div", { class: "table-wrap" }, table);
  }

  function renderCards(items) {
    const grid = h("div", { class: "cards" });
    for (const u of items) {
      const card = h("article", { class: "card" });
      card.addEventListener("click", () => openView(u.id));
      const satis = anaSatis(u);
      const meta = [u.marka, u.birim || inferBirim(u)].filter(Boolean).join(" · ");
      card.append(
        h("div", { class: "card-body" },
          h("b", { text: u.ad }),
          h("small", { text: meta || altAd(u.anaKategoriId, u.altKategoriId) }),
          h("small", { text: `Maliyet ${money(u.maliyet)} · Ideal ${money(u.idealSatis)}` }),
          h("small", { class: karClass(satis, u.maliyet), text: "Kârlılık " + karText(satis, u.maliyet) }),
          statusChip(u.aktif),
        ),
      );
      grid.append(card);
    }
    return grid;
  }

  function emptyState(items) {
    const hasQuery = state.q || Object.values(state.filters).some(Boolean);
    if (items.length) return null;
    if (hasQuery) {
      return h("div", { class: "empty" },
        h("h2", { text: "Sonuç bulunamadı" }),
        h("p", { text: "Arama veya filtreleri temizleyip yeniden deneyin." }),
      );
    }
    return h("div", { class: "empty" },
      h("h2", { text: "Bu kategoride ürün yok" }),
      h("p", { text: "Site kataloğuna ürün eklendiğinde bu liste kendiliğinden güncellenir." }),
    );
  }

  function titleForPage() {
    if (state.page === "markalar") return ["Markalar", "Katalogdaki ürün markaları."];
    if (state.page === "kategoriler") return ["Kategoriler", "Site kataloğundaki ana ve alt gruplar."];
    if (state.page === "ayarlar") return ["Ayarlar", "Fiyat yedekleme ve tarayıcı kayıtları."];
    if (state.alt) return [altAd(state.ana, state.alt), anaAd(state.ana)];
    if (state.ana) return [anaAd(state.ana), "Alt kategoriler soldaki menüde."];
    return ["Ürün kataloğu", `${state.catalog.urunler.length} kayıt · site ile eşleşir`];
  }

  function renderKatalog() {
    const items = filtered();
    renderFilters(items);
    const [title, sub] = titleForPage();
    const head = h("div", { class: "page-head" },
      h("div", {}, h("h1", { text: title }), h("p", { text: sub + (state.page === "katalog" ? ` · ${items.length} ürün` : "") })),
    );
    const empty = emptyState(items);
    const useCards = state.view === "cards" || mobile();
    const list = empty || (useCards ? renderCards(items) : renderTable(items));
    return [head, list];
  }

  function renderMarkalar() {
    $("filters").hidden = true;
    const [title, sub] = titleForPage();
    const list = h("ul", { class: "simple-list" });
    for (const ad of unique(state.catalog.urunler, "marka")) list.append(h("li", { text: ad }));
    return [
      h("div", { class: "page-head" }, h("div", {}, h("h1", { text: title }), h("p", { text: sub }))),
      list,
    ];
  }

  function renderKategoriler() {
    $("filters").hidden = true;
    const [title, sub] = titleForPage();
    const list = h("ul", { class: "simple-list" });
    for (const kat of state.catalog.kategoriler) {
      const count = state.catalog.urunler.filter((u) => u.anaKategoriId === kat.id).length;
      const alts = (kat.altlar || []).map((a) => {
        const n = state.catalog.urunler.filter((u) => u.altKategoriId === a.id).length;
        return `${a.ad} (${n})`;
      }).join(", ");
      list.append(h("li", {}, h("b", { text: `${kat.ad} · ${count}` }), h("div", { text: alts || "Alt kategori yok" })));
    }
    return [
      h("div", { class: "page-head" }, h("div", {}, h("h1", { text: title }), h("p", { text: sub }))),
      list,
    ];
  }

  function renderAyarlar() {
    $("filters").hidden = true;
    const [title, sub] = titleForPage();
    const color = h("input", { type: "color", value: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#0EA5E9" });
    color.addEventListener("input", () => {
      document.documentElement.style.setProperty("--accent", color.value);
      localStorage.setItem(THEME, color.value);
    });
    const exp = h("button", { class: "btn ghost", type: "button", text: "Fiyatları dışa aktar" });
    exp.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify({ fiyatlar: JSON.parse(localStorage.getItem(PRICE_STORE) || "{}"), extras: state.extras }, null, 2)], { type: "application/json" });
      const a = h("a", { href: URL.createObjectURL(blob), download: "ferrapro-yonetim-fiyat.json" });
      a.click();
    });
    const file = h("input", { type: "file", accept: "application/json" });
    file.addEventListener("change", async () => {
      const f = file.files?.[0];
      if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        const prices = data.fiyatlar || data;
        localStorage.setItem(PRICE_STORE, JSON.stringify(prices));
        if (Array.isArray(data.extras)) {
          state.extras = data.extras;
          localStorage.setItem(EXTRA_STORE, JSON.stringify(state.extras));
        }
        await reloadCatalog();
        toast("Fiyatlar içe aktarıldı.");
        render();
      } catch {
        toast("Dosya okunamadı.");
      }
    });
    const reset = h("button", { class: "btn danger", type: "button", text: "Fiyat kayıtlarını sil" });
    reset.addEventListener("click", async () => {
      localStorage.removeItem(PRICE_STORE);
      localStorage.removeItem(EXTRA_STORE);
      state.extras = [];
      await reloadCatalog();
      toast("Fiyatlar temizlendi. Ürün listesi siteden yüklendi.");
      render();
    });
    return [
      h("div", { class: "page-head" }, h("div", {}, h("h1", { text: title }), h("p", { text: sub }))),
      h("div", { class: "simple-list" },
        h("li", {}, "Vurgu rengi", color),
        h("li", {}, "Ürün listesi ferrapro.com kataloğundan gelir. Burada yalnızca birim ve fiyatlar saklanır."),
        h("li", {}, "Fiyat yedeği", h("div", { class: "add-row" }, exp, file)),
        h("li", {}, "Tarayıcıdaki fiyatları silip site kataloğuna dönün.", reset),
      ),
    ];
  }

  function closeDrawer() {
    state.drawer = null;
    $("drawer").hidden = true;
  }

  function productById(id) {
    return state.catalog.urunler.find((u) => u.id === id);
  }

  function renderView(u) {
    const birim = u.birim || inferBirim(u);
    const rows = [
      ["Ürün adı", u.ad],
      ["Ana kategori", anaAd(u.anaKategoriId)],
      ["Alt kategori", altAd(u.anaKategoriId, u.altKategoriId)],
      ["Marka", dash(u.marka)],
      ["Ölçü", dash(u.olcu)],
      ["Kapasite", dash(u.kapasite)],
      ["Birim", birim],
      ["Maliyet", money(u.maliyet)],
      ["Liste fiyatı", money(u.listeFiyat)],
      ["Ideal satış fiyatı", money(u.idealSatis)],
      ["Dip satış fiyatı", money(u.dipSatis)],
      ["Liste kârlılık", karText(u.listeFiyat, u.maliyet)],
      ["Ideal kârlılık", karText(u.idealSatis, u.maliyet)],
      ["Dip kârlılık", karText(u.dipSatis, u.maliyet)],
      ["Durum", u.aktif ? "Aktif" : "Pasif"],
    ];
    const dl = h("dl", { class: "kv" });
    for (const [label, val] of rows) dl.append(h("dt", { text: label }), h("dd", { text: val }));
    const edit = h("button", { class: "btn", type: "button", text: "Düzenle" });
    edit.addEventListener("click", () => openEdit(u.id));
    return [dl, h("div", { class: "form-actions" }, edit)];
  }

  function numberInput(name, value) {
    const el = h("input", { name, type: "number", step: "0.01", min: "0", inputmode: "decimal" });
    if (value != null && value !== "") el.value = String(value);
    return el;
  }

  function renderForm(u, mode) {
    const err = h("p", { class: "form-err" });
    const form = h("form", { class: "form" });
    const siteLocked = u.kaynak === "site" && mode !== "create";
    const ad = h("input", { name: "ad", required: true, value: u.ad });
    if (siteLocked) ad.readOnly = true;
    const ana = h("select", { name: "anaKategoriId" });
    for (const kat of state.catalog.kategoriler) ana.append(new Option(kat.ad, kat.id));
    ana.value = u.anaKategoriId;
    ana.disabled = siteLocked;
    const alt = h("select", { name: "altKategoriId" });
    function fillAlts() {
      alt.replaceChildren(new Option("Seçin", ""));
      for (const a of anaById(ana.value)?.altlar || []) alt.append(new Option(a.ad, a.id));
      if ([...alt.options].some((o) => o.value === u.altKategoriId)) alt.value = u.altKategoriId;
    }
    fillAlts();
    ana.addEventListener("change", fillAlts);
    alt.disabled = siteLocked;
    const marka = h("input", { name: "marka", value: u.marka });
    if (siteLocked) marka.readOnly = true;
    const olcu = h("input", { name: "olcu", value: u.olcu });
    if (siteLocked) olcu.readOnly = true;
    const birim = h("select", { name: "birim" });
    for (const b of BIRIMLER) birim.append(new Option(b, b));
    birim.value = u.birim || inferBirim(u);
    const maliyet = numberInput("maliyet", u.maliyet);
    const liste = numberInput("listeFiyat", u.listeFiyat);
    const ideal = numberInput("idealSatis", u.idealSatis);
    const dip = numberInput("dipSatis", u.dipSatis);
    const live = h("p", { class: "kar-live" });
    function refreshKar() {
      live.textContent =
        `Liste ${karText(liste.value, maliyet.value)} · Ideal ${karText(ideal.value, maliyet.value)} · Dip ${karText(dip.value, maliyet.value)}`;
    }
    [maliyet, liste, ideal, dip].forEach((el) => el.addEventListener("input", refreshKar));
    refreshKar();
    const aktif = h("select", { name: "aktif" });
    aktif.append(new Option("Aktif", "1"), new Option("Pasif", "0"));
    aktif.value = u.aktif ? "1" : "0";
    form.append(
      h("label", {}, "Ürün adı", ad),
      h("label", {}, "Ana kategori", ana),
      h("label", {}, "Alt kategori", alt),
      h("label", {}, "Marka", marka),
      h("label", {}, "Ölçü", olcu),
      h("label", {}, "Birim", birim),
      h("label", {}, "Birim fiyat maliyet", maliyet),
      h("label", {}, "Liste fiyatı", liste),
      h("label", {}, "Ideal satış fiyatı", ideal),
      h("label", {}, "Dip satış fiyatı", dip),
      live,
      h("label", {}, "Durum", aktif),
      err,
    );
    if (siteLocked) {
      form.prepend(h("p", { class: "hint", text: "Ad, marka ve kategori site kataloğundan gelir. Burada birim ve fiyatlar tutulur." }));
    }
    const save = h("button", { class: "btn", type: "submit", text: "Kaydet" });
    form.append(h("div", { class: "form-actions" }, save));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = ad.value.trim();
      if (name.length < 2) {
        err.textContent = "Ürün adı gerekli.";
        ad.focus();
        return;
      }
      if (!ana.value || !alt.value) {
        err.textContent = "Ana kategori ve alt kategori seçin.";
        return;
      }
      const prices = {
        birim: birim.value,
        maliyet: num(maliyet.value),
        listeFiyat: num(liste.value),
        idealSatis: num(ideal.value),
        dipSatis: num(dip.value),
        fiyat: num(liste.value),
      };
      if (mode === "create") {
        const row = {
          ...blankProduct(),
          ...prices,
          id: nextExtraId(),
          ad: name,
          anaKategoriId: ana.value,
          altKategoriId: alt.value,
          marka: marka.value.trim(),
          olcu: olcu.value.trim(),
          aktif: aktif.value === "1",
          kaynak: "local",
        };
        state.extras.push(row);
        state.catalog.urunler.push(row);
      } else {
        const i = state.catalog.urunler.findIndex((x) => x.id === u.id);
        if (i >= 0) {
          if (u.kaynak === "local") {
            const row = {
              ...u,
              ...prices,
              ad: name,
              anaKategoriId: ana.value,
              altKategoriId: alt.value,
              marka: marka.value.trim(),
              olcu: olcu.value.trim(),
              aktif: aktif.value === "1",
            };
            state.catalog.urunler[i] = row;
            const ei = state.extras.findIndex((x) => x.id === u.id);
            if (ei >= 0) state.extras[ei] = row;
          } else {
            state.catalog.urunler[i] = { ...u, ...prices, aktif: aktif.value === "1" };
          }
        }
      }
      persist();
      toast("Kayıt güncellendi.");
      closeDrawer();
      render();
    });
    return [form];
  }

  function renderDrawer() {
    const root = $("drawer");
    const body = $("drawer-body");
    const title = $("drawer-title");
    if (!state.drawer) {
      root.hidden = true;
      return;
    }
    root.hidden = false;
    if (state.drawer.mode === "create") {
      title.textContent = "Yeni ürün";
      body.replaceChildren(...renderForm(blankProduct(), "create"));
      return;
    }
    const u = productById(state.drawer.id);
    if (!u) {
      closeDrawer();
      return;
    }
    if (state.drawer.mode === "edit") {
      title.textContent = "Ürünü düzenle";
      body.replaceChildren(...renderForm({ ...u }, "edit"));
    } else {
      title.textContent = u.ad;
      body.replaceChildren(...renderView(u));
    }
  }

  function askDelete(id) {
    const u = productById(id);
    if (u?.kaynak === "site") {
      toast("Site kataloğundaki ürün buradan silinmez.");
      return;
    }
    state.pendingDelete = id;
    $("modal").hidden = false;
    $("modal-text").textContent = `"${u?.ad || "Ürün"}" kaydı silinsin mi?`;
  }

  function render() {
    if (state.loading) return;
    const page = $("page");
    if (state.error) {
      page.replaceChildren(h("div", { class: "error-box" }, h("h2", { text: "Katalog yüklenemedi" }), h("p", { text: state.error })));
      return;
    }
    renderNav();
    document.querySelectorAll("#view-toggle [data-view]").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.view === state.view ? "true" : "false");
    });
    let nodes = [];
    if (state.page === "markalar") nodes = renderMarkalar();
    else if (state.page === "kategoriler") nodes = renderKategoriler();
    else if (state.page === "ayarlar") nodes = renderAyarlar();
    else nodes = renderKatalog();
    page.replaceChildren(...nodes);
    renderDrawer();
  }

  async function reloadCatalog() {
    const pubRes = await fetch(PUBLIC, { cache: "no-store" });
    if (!pubRes.ok) throw new Error("Site kataloğu alınamadı.");
    const pub = await pubRes.json();
    let seedPrices = {};
    try {
      const seedRes = await fetch(SEED, { cache: "no-store" });
      if (seedRes.ok) {
        const seed = await seedRes.json();
        for (const u of seed.urunler || []) seedPrices[u.id] = priceSlice(u);
      }
    } catch { /* seed optional */ }
    let localPrices = {};
    try { localPrices = JSON.parse(localStorage.getItem(PRICE_STORE) || "{}"); } catch { localPrices = {}; }
    try { state.extras = JSON.parse(localStorage.getItem(EXTRA_STORE) || "[]"); } catch { state.extras = []; }
    const mapped = (pub.urunler || []).map((row) => {
      const base = mapPublic(row);
      base.birim = inferBirim(base);
      return applyOverlay(applyOverlay(base, seedPrices[row.id]), localPrices[row.id]);
    });
    const publicIds = new Set(mapped.map((u) => u.id));
    const extras = (state.extras || []).filter((u) => !publicIds.has(u.id));
    state.extras = extras;
    state.catalog = {
      version: 2,
      kategoriler: pub.kategoriler || [],
      markalar: unique(mapped, "marka"),
      urunler: mapped.concat(extras),
    };
  }

  function bind() {
    $("q").addEventListener("input", () => { state.q = $("q").value; render(); });
    $("btn-new").addEventListener("click", openCreate);
    $("drawer-close").addEventListener("click", closeDrawer);
    $("drawer").addEventListener("click", (e) => { if (e.target.id === "drawer") closeDrawer(); });
    $("nav-open").addEventListener("click", () => {
      document.body.classList.add("nav-open");
      $("nav-mask").hidden = false;
    });
    const closeNav = () => {
      document.body.classList.remove("nav-open");
      $("nav-mask").hidden = true;
    };
    $("nav-close").addEventListener("click", closeNav);
    $("nav-mask").addEventListener("click", closeNav);
    $("nav-tree").addEventListener("click", (e) => { if (e.target.closest("a")) closeNav(); });
    $("filter-toggle").addEventListener("click", () => {
      const box = $("filters");
      if (state.page !== "katalog") return;
      box.hidden = !box.hidden;
    });
    $("view-toggle").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-view]");
      if (!btn) return;
      state.view = btn.dataset.view;
      localStorage.setItem(VIEW, state.view);
      render();
    });
    $("modal-cancel").addEventListener("click", () => { state.pendingDelete = null; $("modal").hidden = true; });
    $("modal-ok").addEventListener("click", () => {
      const id = state.pendingDelete;
      state.extras = state.extras.filter((u) => u.id !== id);
      state.catalog.urunler = state.catalog.urunler.filter((u) => u.id !== id);
      persist();
      state.pendingDelete = null;
      $("modal").hidden = true;
      if (state.drawer?.id === id) closeDrawer();
      toast("Ürün silindi.");
      render();
    });
    window.addEventListener("hashchange", () => { parseHash(); render(); });
    matchMedia("(max-width: 900px)").addEventListener("change", render);
  }

  async function boot() {
    applyTheme();
    bind();
    parseHash();
    try {
      await reloadCatalog();
    } catch (err) {
      state.error = err.message || "Yükleme hatası";
    }
    state.loading = false;
    render();
  }

  boot();
})();
