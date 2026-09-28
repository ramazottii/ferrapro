import { readFileSync, writeFileSync } from "node:fs";

const pub = JSON.parse(readFileSync(new URL("../public/katalog.json", import.meta.url), "utf8"));
let old = { urunler: [] };
try {
  old = JSON.parse(readFileSync(new URL("../public/yonetim/catalog.json", import.meta.url), "utf8"));
} catch {
  old = { urunler: [] };
}
const oldById = Object.fromEntries((old.urunler || []).map((u) => [u.id, u]));

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

function priceOf(prev, fallbackBirim) {
  if (!prev) {
    return {
      birim: fallbackBirim,
      maliyet: null,
      listeFiyat: null,
      idealSatis: null,
      dipSatis: null,
      fiyat: null,
    };
  }
  return {
    birim: prev.birim || fallbackBirim,
    maliyet: prev.maliyet ?? null,
    listeFiyat: prev.listeFiyat ?? null,
    idealSatis: prev.idealSatis ?? null,
    dipSatis: prev.dipSatis ?? null,
    fiyat: prev.listeFiyat ?? prev.fiyat ?? null,
  };
}

const urunler = pub.urunler.map((row) => {
  const prev = oldById[row.id];
  const prices = priceOf(prev, inferBirim(row));
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
    gorsel: row.gorsel || "",
    gorselTuru: row.gorselTuru || "",
    sira: row.sira || 0,
    ...prices,
  };
});

const out = {
  version: 2,
  kaynak: "katalog.json",
  kategoriler: pub.kategoriler,
  markalar: [...new Set(urunler.map((u) => u.marka).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr")),
  urunler,
};

writeFileSync(new URL("../public/yonetim/catalog.json", import.meta.url), JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("synced", urunler.length, "products");
