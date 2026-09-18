/** Firma fiyat kıyası — KDV hariç, koli eşdeğeri. Avansas etiketleri genelde KDV dahil. */

import { familyKey, defaultMaliyet } from "./pricing.js";

export const FIRMS = [
  { id: "basak", ad: "Başak Kağıt", tur: "toptanci" },
  { id: "hazel", ad: "Hazel Soft", tur: "toptanci" },
  { id: "bencup", ad: "Bencup", tur: "toptanci" },
  { id: "avansas", ad: "Avansas", tur: "piyasa" },
  { id: "ofix", ad: "Ofix", tur: "piyasa" },
];

const TEDARIKCI = {
  "Başak Kağıt": "basak",
  "Hazel Soft": "hazel",
  Bencup: "bencup",
};

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

function kdvHaric(fiyat, kdvDahil) {
  const n = Number(fiyat);
  if (!Number.isFinite(n)) return null;
  return kdvDahil ? round2(n / 1.2) : round2(n);
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function packSayisi(u) {
  const t = `${u.ebat || ""} ${u.ad || ""}`;
  const m = t.match(/koli\s*(\d+)\s*[×x]/i) || t.match(/koli\s*(\d+)/i);
  return m ? Number(m[1]) : 1;
}

/** Aynı işi gören kalemler — gramaj/kg ayrımı (5 kg jumbo ≠ 2,5 kg). */
export function kiyasKey(u) {
  if (u.kiyas_key) return u.kiyas_key;
  const fam = familyKey(u);
  const ad = normalize(`${u.ad} ${u.ebat}`);
  const kg = ad.match(/(\d+(?:[.,]\d+)?)\s*kg/);
  if (["mini-jumbo", "fotoselli-21", "icten-havlu", "icten-tuvalet"].includes(fam) && kg) {
    return `${fam}|${kg[1].replace(",", ".")}kg`;
  }
  const gr = ad.match(/(\d+)\s*gr/);
  if (String(fam).startsWith("cop-") && gr) return `${fam}|${gr[1]}gr`;
  if (fam === "tuv-ev-tipi") {
    const pack = ad.includes("32") ? "32" : ad.includes("24") ? "24" : ad.includes("16") ? "16" : "diger";
    let tier = "orta";
    if (ad.includes("extra") || ad.includes("deluxe") || ad.includes("touch") || ad.includes("fsc")) tier = "premium";
    if (ad.includes("eko") || ad.includes("eco")) tier = "eko";
    return `tuv-${pack}-${tier}`;
  }
  const oz = ad.match(/(\d+(?:[.,]\d+)?)\s*oz/);
  if (String(fam).startsWith("bardak") && oz) return `${fam}|${oz[1].replace(",", ".")}oz`;
  return fam;
}

/**
 * Piyasa etiketleri (Ağustos 2026).
 * per: "koli" = zaten koli fiyatı; "paket" = SKU koli adedi ile çarpılır.
 */
const PIYASA_TEKLIF = [
  {
    kod: "7906619",
    firma: "avansas",
    ad: "Selpak Professional Extra 24'lü",
    fiyat: 285,
    kdv_dahil: true,
    per: "paket",
    kaynak: "Avansas 2026-08",
  },
  {
    family: "z-200",
    firma: "ofix",
    ad: "Selpak Touch Z 200×12",
    fiyat: 407.32,
    kdv_dahil: false,
    per: "koli",
    kaynak: "Ofix +KDV 2026-08",
    benzer: true,
  },
  {
    family: "z-200",
    firma: "ofix",
    ad: "Focus Optimum Z 200×12",
    fiyat: 512.29,
    kdv_dahil: false,
    per: "koli",
    kaynak: "Ofix +KDV 2026-08",
    benzer: true,
  },
  {
    kiyas_key: "mini-jumbo|3.5kg",
    firma: "ofix",
    ad: "Rulopak Mini Jumbo 3,5 kg 12'li",
    fiyat: 553.33,
    kdv_dahil: false,
    per: "koli",
    kaynak: "Ofix +KDV 2026-08",
    benzer: true,
  },
  {
    kiyas_key: "mini-jumbo|3.5kg",
    firma: "ofix",
    ad: "Focus Optimum Jumbo 12'li",
    fiyat: 580.53,
    kdv_dahil: false,
    per: "koli",
    kaynak: "Ofix +KDV 2026-08",
    benzer: true,
  },
  {
    family: "cop-80x110",
    firma: "avansas",
    ad: "Avansas Jumbo 80×110 10'lu rulo",
    fiyat: 69.9,
    kdv_dahil: true,
    per: "paket",
    kaynak: "Avansas 10'lu ≠ koli; koli adediyle çarpıldı 2026-08",
    benzer: true,
  },
  {
    kiyas_key: "a4-80g-2500",
    firma: "avansas",
    ad: "Avansas Daily A4 80g 5×500",
    fiyat: 639.9,
    kdv_dahil: true,
    per: "koli",
    kaynak: "Avansas KDV dahil 2026-08",
  },
  {
    kiyas_key: "camasir-20l",
    firma: "ofix",
    ad: "Rulopak Çamaşır Suyu 20 L",
    fiyat: 465.37,
    kdv_dahil: false,
    per: "koli",
    kaynak: "Ofix +KDV 2026-08",
  },
  {
    kiyas_key: "sivi-sabun-5l",
    firma: "avansas",
    ad: "Avansas sıvı el sabunu 5 L (benzer)",
    fiyat: 189,
    kdv_dahil: true,
    per: "koli",
    kaynak: "Avansas bandı 2026-08 — teyit et",
    benzer: true,
  },
  {
    kiyas_key: "koli-bandi-45",
    firma: "avansas",
    ad: "Avansas koli bandı 45 mm × 100 m",
    fiyat: 89.9,
    kdv_dahil: true,
    per: "koli",
    kaynak: "Avansas etiket 2026-08 — teyit et",
  },
  {
    kiyas_key: "nitril-m-100",
    firma: "avansas",
    ad: "Nitril eldiven M 100'lü",
    fiyat: 129.9,
    kdv_dahil: true,
    per: "koli",
    kaynak: "Avansas etiket 2026-08 — teyit et",
  },
  {
    kiyas_key: "strec-45",
    firma: "ofix",
    ad: "Streç film 45 cm × 300 m",
    fiyat: 312,
    kdv_dahil: false,
    per: "koli",
    kaynak: "Ofix bandı 2026-08 — teyit et",
  },
];

/** Katalogda olmayan kırtasiye / sıvı / ambalaj — sadece piyasa satırı */
export const EKSTRA_URUNLER = [
  {
    id: "px-a4-daily",
    kategori: "Kırtasiye",
    marka: "Avansas Daily",
    ad: "A4 80 g/m² 5×500 (2500 yaprak)",
    ebat: "5 paket × 500 yaprak",
    birim: "koli",
    kiyas_key: "a4-80g-2500",
  },
  {
    id: "px-camasir-20l",
    kategori: "Temizlik",
    marka: "Rulopak",
    ad: "Çamaşır Suyu 20 L",
    ebat: "20 litre bidon",
    birim: "adet",
    kiyas_key: "camasir-20l",
  },
  {
    id: "px-sivi-sabun-5l",
    kategori: "Temizlik",
    marka: "Piyasa",
    ad: "Sıvı el sabunu 5 L",
    ebat: "5 litre bidon",
    birim: "adet",
    kiyas_key: "sivi-sabun-5l",
  },
  {
    id: "px-koli-bandi",
    kategori: "Ambalaj",
    marka: "Piyasa",
    ad: "Koli bandı 45 mm × 100 m",
    ebat: "adet / rulo",
    birim: "adet",
    kiyas_key: "koli-bandi-45",
  },
  {
    id: "px-strec-45",
    kategori: "Ambalaj",
    marka: "Piyasa",
    ad: "Streç film 45 cm × 300 m",
    ebat: "1 rulo",
    birim: "adet",
    kiyas_key: "strec-45",
  },
  {
    id: "px-nitril-m",
    kategori: "Sağlık",
    marka: "Piyasa",
    ad: "Nitril eldiven M 100'lü kutu",
    ebat: "100 adet",
    birim: "kutu",
    kiyas_key: "nitril-m-100",
  },
];

function teklifEslesir(q, u, key) {
  if (q.kod && u.kod && String(q.kod) === String(u.kod)) return { exact: true };
  if (q.kiyas_key && q.kiyas_key === key) return { exact: !q.benzer };
  if (q.family && q.family === familyKey(u)) return { exact: false };
  return null;
}

function teklifFiyat(q, u) {
  const birim = kdvHaric(q.fiyat, q.kdv_dahil);
  if (birim == null) return null;
  if (q.per === "paket") return round2(birim * packSayisi(u));
  return birim;
}

function attachPiyasa(fiyatlar, u, key) {
  for (const q of PIYASA_TEKLIF) {
    const hit = teklifEslesir(q, u, key);
    if (!hit) continue;
    const fiyat = teklifFiyat(q, u);
    if (fiyat == null) continue;
    const prev = fiyatlar[q.firma];
    const cell = {
      fiyat,
      benzer: !hit.exact || !!q.benzer,
      ad: q.ad,
      kaynak: q.kaynak,
    };
    if (!prev) fiyatlar[q.firma] = cell;
    else if (!cell.benzer && prev.benzer) fiyatlar[q.firma] = cell;
    else if (cell.benzer === prev.benzer && fiyat < prev.fiyat) fiyatlar[q.firma] = cell;
  }
}

function satOnerisi(alis, piyasaMin, maliyet) {
  const m = { ...defaultMaliyet(), ...(maliyet || {}) };
  const minBrut = Number(m.min_brut_pct) / 100;
  if (alis == null || !(alis > 0)) {
    if (piyasaMin == null) return { sat: null, brut_pct: null, not: "Ne toptancı ne piyasa fiyatı yok." };
    return {
      sat: round2(piyasaMin * 0.94),
      brut_pct: null,
      not: "Toptancı alışımız yok — öneri etiket %6 altı; önce toptancı bulun.",
    };
  }
  const taban = round2(alis * (1 + minBrut));
  const tavan = piyasaMin != null ? round2(piyasaMin * 0.97) : null;
  let sat;
  if (piyasaMin != null) {
    sat = round2(piyasaMin * 0.94);
    if (sat < taban) sat = Math.min(taban, tavan ?? taban);
    if (tavan != null && sat > tavan) sat = tavan;
  } else {
    sat = taban;
  }
  const brutPct = round2(((sat - alis) / alis) * 100);
  let not = `Asgari brüt %${m.min_brut_pct} · taban ${taban}`;
  if (tavan != null) not += ` · tavan ${tavan} (piyasa %97)`;
  return { sat, taban, tavan, brut_pct: brutPct, not };
}

function makeRow(u, fiyatlar, maliyet, ekstra) {
  const cells = [];
  for (const f of FIRMS) {
    const c = fiyatlar[f.id];
    if (c && c.fiyat != null) cells.push({ ...c, firma: f.id, firmaAd: f.ad });
  }
  cells.sort((a, b) => a.fiyat - b.fiyat);
  const en = cells[0] || null;
  const toptanciUcuz = cells
    .filter((c) => FIRMS.find((f) => f.id === c.firma)?.tur === "toptanci")
    .sort((a, b) => a.fiyat - b.fiyat)[0];
  const piyasaMin =
    cells.filter((c) => FIRMS.find((f) => f.id === c.firma)?.tur === "piyasa").sort((a, b) => a.fiyat - b.fiyat)[0]
      ?.fiyat ?? null;
  const alisForSat = toptanciUcuz ? toptanciUcuz.fiyat : u.alis != null && Number(u.alis) > 0 ? Number(u.alis) : null;
  const sat = satOnerisi(alisForSat, piyasaMin, maliyet);
  if (toptanciUcuz && toptanciUcuz.benzer && sat.not) {
    sat.not = `Alış ${toptanciUcuz.firmaAd} benzer · ${sat.not}`;
  }
  return {
    id: u.id,
    kategori: u.kategori,
    marka: u.marka || "",
    kod: u.kod || null,
    ad: u.ad,
    ebat: u.ebat || "",
    birim: u.birim || "koli",
    tedarikci: u.tedarikci || null,
    kiyas_key: kiyasKey(u),
    ekstra: !!ekstra,
    fiyatlar,
    en_ucuz_firma: en ? en.firmaAd : null,
    en_ucuz_fiyat: en ? en.fiyat : null,
    en_ucuz_benzer: en ? !!en.benzer : false,
    toptanci_alternatif:
      toptanciUcuz && toptanciUcuz.benzer ? `${toptanciUcuz.firmaAd}: ${toptanciUcuz.ad} ${toptanciUcuz.fiyat} ₺` : null,
    sat_oneri: sat.sat,
    sat_brut_pct: sat.brut_pct,
    sat_not: sat.not,
  };
}

export function buildKiyas(urunler, maliyet) {
  const catalog = urunler || [];
  const byFirmKey = {};
  for (const u of catalog) {
    const fid = TEDARIKCI[u.tedarikci];
    if (!fid || u.alis == null) continue;
    const key = kiyasKey(u);
    if (!byFirmKey[fid]) byFirmKey[fid] = {};
    const prev = byFirmKey[fid][key];
    if (!prev || u.alis < prev.alis) byFirmKey[fid][key] = u;
  }

  const satirlar = [];
  for (const u of catalog) {
    const key = kiyasKey(u);
    const fiyatlar = {};
    for (const f of FIRMS.filter((x) => x.tur === "toptanci")) {
      const peer = byFirmKey[f.id]?.[key];
      if (!peer) continue;
      fiyatlar[f.id] = {
        fiyat: Number(peer.alis),
        benzer: peer.id !== u.id,
        ad: peer.ad,
        kaynak: `${peer.tedarikci} liste`,
      };
    }
    const own = TEDARIKCI[u.tedarikci];
    if (own && u.alis != null) {
      fiyatlar[own] = {
        fiyat: Number(u.alis),
        benzer: false,
        ad: u.ad,
        kaynak: `${u.tedarikci} liste`,
      };
    }
    attachPiyasa(fiyatlar, u, key);
    satirlar.push(makeRow(u, fiyatlar, maliyet, false));
  }

  for (const ex of EKSTRA_URUNLER) {
    const u = { ...ex, alis: null, tedarikci: null };
    const fiyatlar = {};
    attachPiyasa(fiyatlar, u, ex.kiyas_key);
    satirlar.push(makeRow(u, fiyatlar, maliyet, true));
  }

  const piyasaDolu = satirlar.filter((s) =>
    FIRMS.some((f) => f.tur === "piyasa" && s.fiyatlar[f.id]?.fiyat != null)
  ).length;

  return {
    firmalar: FIRMS,
    satirlar,
    ozet: {
      adet: satirlar.length,
      katalog: catalog.length,
      ekstra: EKSTRA_URUNLER.length,
      piyasa_eslesen: piyasaDolu,
      tarih: "2026-08",
    },
    not: "Avansas/Ofix otomatik çekilmez; tohum etiket + koli eşdeğeri (KDV hariç). 10'lu rulo ≠ 20 paket koli — çarpıldı. Benzer = aynı aile, farklı marka.",
  };
}
