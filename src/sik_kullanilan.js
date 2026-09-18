/** Swissmed sık kullanılanlar — Ofispanda teklifi + gider Excel (mükerrer yok) */

import { GIDER_ROWS } from "./sik_gider.js";

export const SIK_VERSION = 2;

/** [kategori, ad, birim, ofispanda ₺, hedef ₺|null, teklif_no] */
const ROWS = [
  ["Hijyen", "Espiga Fotoselli Kağıt Havlu 21 cm", "koli", 225, 210, 1],
  ["Hijyen", "Espiga İçten Çekmeli Havlu 6'lı", "koli", 225, 210, 2],
  ["Temizlik", "Jumbo Çöp Poşeti 80×110 End. Siyah 700 gr", "paket", 45, 40, 3],
  ["Ambalaj", "Kraft Çanta", "adet", 3.05, 3, 4],
  ["Ambalaj", "Samua Kese Kağıdı", "adet", 85, 85, 5],
  ["Temizlik", "Bingo Çamaşır Deterjanı 10 kg", "adet", 320, 320, 6],
  ["Temizlik", "Asperox Sarı Güç 1000 gr", "adet", 65, 65, 7],
  ["Temizlik", "Faraşlı Süpürge Takım", "adet", 90, null, 9],
  ["Temizlik", "Mikrofiber Temizlik Bezi 40×40", "adet", 20, null, 10],
  ["Temizlik", "Mikrofiber Cam Bezi", "adet", 25, null, 11],
  ["Mutfak", "Fairy Sıvı Bulaşık Det. 650 ml", "adet", 47.5, null, 12],
  ["Mutfak", "Çatal Bıçak Set 100'lü", "adet", 250, null, 13],
  ["Mutfak", "Sırmakeş Su 0,5 L (12'li)", "adet", 45, null, 14],
  ["Ambalaj", "Streç 30 cm", "adet", 90, null, 15],
  ["Mutfak", "Bulaşık Süngeri Scotch-Brite", "adet", 8.5, null, 16],
  ["Mutfak", "Bulaşık Teli", "adet", 25, null, 17],
  ["Mutfak", "Sıvı Bulaşık Deterjanı 20 L", "adet", 345, null, 18],
  ["Temizlik", "Ekstra Nemli Mop 50 cm", "adet", 55, null, 19],
  ["Mutfak", "Finish Bulaşık Makinesi Tableti 100'lü", "adet", 385, null, 21],
  ["Kırtasiye", "Esselte 9940-35 Klasör Ekonomik Geniş Mavi", "adet", 59, null, 22],
  ["Kırtasiye", "Esselte 9945-35 Klasör Ekonomik Dar Mavi", "adet", 59, null, 23],
  ["Klinik", "Siyah Pudrasız Muayene Eldiveni 100'lü", "adet", 115, null, 24],
  ["Mutfak", "Finish Bulaşık Makinesi Tableti", "adet", 325, null, 26],
  ["Temizlik", "Nemli Mop 50 cm", "adet", 55, null, 27],
  ["Temizlik", "Krom Tuvalet Fırçası", "adet", 75, null, 28],
  ["Kırtasiye", "A4 Fotokopi Kağıdı 80 g 500'lü", "adet", 105, null, 29],
  ["Klinik", "Tıbbi Atık Kovası 5 L", "adet", 35, null, 30],
  ["Mutfak", "Sparx Bulaşık Makinesi Tableti 40'lı", "adet", 196, null, 31],
  ["Temizlik", "Domestos 750 ml Dağ Esintisi", "adet", 42, null, 32],
  ["Hijyen", "Dispenser Peçete 18×200", "adet", 155, null, 33],
  ["Temizlik", "Parfümlü Yüzey Temizleme Maddesi 20 kg", "adet", 345, null, 34],
  ["Temizlik", "Jumbo Çöp Poşeti 80×110 End. Siyah 400 gr", "adet", 25, null, 36],
  ["Temizlik", "Kıvamlı Çamaşır Suyu 20 kg", "adet", 345, null, 37],
  ["Mutfak", "Beypazarı Maden Soda 24'lü", "koli", 175, null, 38],
  ["Mutfak", "Coca-Cola 250 ml 24'lü", "koli", 410, null, 39],
  ["Mutfak", "Cappy 330 ml 12'li Vişne", "koli", 280, null, 40],
  ["Mutfak", "Cappy 330 ml 12'li Şeftali", "koli", 280, null, 41],
  ["Mutfak", "Cappy 330 ml 12'li Karışık", "koli", 280, null, 42],
  ["Mutfak", "Lipton Ice Tea Şeftali 330 ml 24'lü", "koli", 615, null, 43],
  ["Mutfak", "Lipton Ice Tea Limon 330 ml 24'lü", "koli", 615, null, 44],
  ["Mutfak", "Lipton Ice Tea Mango Ananas 330 ml 24'lü", "koli", 615, null, 45],
  ["Mutfak", "Sırma Soda Limonlu 24'lü", "koli", 190, null, 46],
  ["Mutfak", "İçim Süt 1000 ml Laktozsuz 12'li", "koli", 470, null, 47],
  ["Mutfak", "Red Bull Enerji İçeceği 250 ml 24'lü", "adet", 920, null, 48],
  ["Mutfak", "Türk Kahvesi Mehmet Efendi 100 gr", "adet", 67.5, null, 49],
];

export function defaultSikKullanilan() {
  const ofis = ROWS.map((r, i) => ({
    id: i + 1,
    kategori: r[0],
    ad: r[1],
    birim: r[2],
    ofispanda: r[3],
    fiyat: r[3],
    hedef: r[4],
    teklif_no: r[5],
    tekrar: null,
    kdv: null,
    kaynak: "Ofispanda",
    tedarikci_rakip: "Ofispanda",
  }));
  const gider = GIDER_ROWS.map((r, i) => ({
    id: ofis.length + i + 1,
    kategori: r[0],
    ad: r[1],
    birim: r[2],
    ofispanda: null,
    fiyat: r[3],
    hedef: null,
    teklif_no: null,
    tekrar: r[4],
    kdv: r[5],
    kaynak: "Gider",
    tedarikci_rakip: "Swissmed gider",
  }));
  return [...ofis, ...gider];
}

function n(s) {
  return String(s || "")
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function packInKoli(u) {
  const t = `${u.ebat || ""} ${u.ad || ""}`;
  const m = t.match(/koli\s*(\d+)/i);
  return m ? Number(m[1]) : 1;
}

/** Kataloğumuzda aynı işi gören en ucuz koli — Ofispanda birimine çevir. */
function esles(s, urunler) {
  const ad = n(s.ad);
  const list = urunler || [];
  const pick = (pred, perPaket) => {
    const hits = list.filter(pred).filter((u) => u.alis != null).sort((a, b) => a.alis - b.alis);
    const u = hits[0];
    if (!u) return null;
    const pack = packInKoli(u);
    const birimFiyat = perPaket && pack > 1 ? Math.round((u.alis / pack) * 100) / 100 : u.alis;
    return {
      biz_ad: u.ad,
      biz_alis: u.alis,
      biz_birim_fiyat: birimFiyat,
      biz_tedarikci: u.tedarikci,
      biz_birim: perPaket && pack > 1 ? `paket (koli ${pack})` : u.birim,
    };
  };

  if (ad.includes("fotoselli") && ad.includes("espiga")) {
    return pick((u) => n(u.ad).includes("espiga") && n(u.ad).includes("fotoselli") && n(u.ad).includes("21"));
  }
  if (ad.includes("icten cekmeli") && ad.includes("espiga")) {
    return pick((u) => n(u.ad).includes("espiga") && n(u.ad).includes("icte") && n(u.ad).includes("havlu"));
  }
  if (ad.includes("80") && ad.includes("110") && ad.includes("700")) {
    return pick((u) => n(u.ad).includes("80") && n(u.ad).includes("110") && n(`${u.ad} ${u.ebat}`).includes("700"), true);
  }
  if (ad.includes("80") && ad.includes("110") && ad.includes("400")) {
    return pick((u) => n(u.ad).includes("80") && n(u.ad).includes("110") && n(`${u.ad} ${u.ebat}`).includes("400"), true);
  }
  if (ad.includes("dispenser pecete")) {
    return pick((u) => n(u.ad).includes("dispenser pecete") && (n(u.ad).includes("200") || n(u.ebat).includes("200")));
  }
  return null;
}

export function enrichSikKullanilan(list, urunler) {
  return (list || []).map((s) => {
    const m = esles(s, urunler);
    const karsi = m ? m.biz_birim_fiyat : null;
    let fark = null;
    const rakip = s.ofispanda != null ? s.ofispanda : s.fiyat;
    if (karsi != null && rakip != null) {
      fark = Math.round((rakip - karsi) * 100) / 100;
    }
    return { ...s, ...(m || {}), fark };
  });
}
