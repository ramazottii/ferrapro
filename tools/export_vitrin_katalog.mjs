import { writeFileSync } from "node:fs";
import { defaultUrunler } from "../src/catalog.js";
import { selcukMenu } from "../src/selcuk.js";
import { defaultSikKullanilan } from "../src/sik_kullanilan.js";
import { EKSTRA_URUNLER } from "../src/kiyas.js";

const MARKA =
  /\b(Belinno|Polente|Espiga|Hazel Soft|Hazel|Selpak|Bencup|Solo|Ecoplus|Vural|Esselte|Duracell|Panasonic|Aro|Avansas Daily|Avansas|Rulopak|Koroplast|Samua|Vege|Miss Lady|Fairy|Finish|Scotch-Brite|Sırmakeş|Coca-Cola|Cappy|Lipton|Sırma|İçim|Red Bull|Mehmet Efendi|Bingo|Asperox|Domestos|Sparx|Beypazarı|Jacobs|Tchibo|Nescafe|Nestle|Balküpü|Glade|Airwick|Porçöz|Cif|Pril|Dolphin|Beybi|Vileda|Peros|Powermax|Activex|Saloon|Focus|Ofispanda|Piyasa|Filiz|ARO)\b/gi;
const SUZ =
  /\b(Deluxe FSC|FSC Pro Prem\.?\s*|FSC Pro Extra|FSC Pro|Prof\.?\s*Touch|Professional|Extra Soft|Yeni Nesil|Özel Üretim|Doğal Güç|Mini Eco|Economy|Ekonomik|Standart|Süper|Ultra|Ekstra|Extra|Deluxe|Eko|Sens|Pratik Mini|Pratik)\b/gi;
const PROF = /\bProf\.?\s*/gi;

function satir(ad, ebat, marka) {
  let t = String(ad || "");
  if (marka) {
    const esc = String(marka).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp("^" + esc + "\\s+", "i"), "");
  }
  t = t.replace(/\s*\((Hazel|Rose\/Spring\/Summer)\)\s*/gi, " ");
  t = t.replace(MARKA, " ");
  t = t.replace(/Beypazarı|Sırmakeş|İçim|Nescafe|Fairy|Pril|Airwick|Esselte/gi, " ");
  t = t.replace(SUZ, " ");
  t = t.replace(PROF, " ");
  t = t.replace(/\bYeni\b/g, " ");
  t = t.replace(/parçalı/gi, " ");
  t = t.replace(/Siparişe\s*—?\s*/gi, " ");
  t = t.replace(/^\s*\d{4}-\d{2}\s+/i, "");
  t = t.replace(/^\s*\/\s*/, "");
  t = t.replace(/^\.\s*/, "");
  t = t.replace(/\s{2,}/g, " ").trim();

  const seenBits = new Set();
  const bits = [];
  for (const raw of [t, ...String(ebat || "").split("·").map((x) => x.trim())]) {
    const p = raw.replace(/parçalı/gi, "").replace(/^\.\s*/, "").replace(/\s{2,}/g, " ").trim();
    if (!p) continue;
    const key = p.toLocaleLowerCase("tr");
    if (seenBits.has(key)) continue;
    seenBits.add(key);
    bits.push(p);
  }
  return bits.join(" · ");
}

const seen = new Set();
const urunler = [];

function push(kategori, ad, ebat, marka) {
  const s = satir(ad, ebat, marka);
  if (!s || s.length < 6) return;
  if (/^\d+\s*ml$/i.test(s.split(" · ")[0])) return;
  const key = `${kategori}|${s.toLocaleLowerCase("tr")}`;
  if (seen.has(key)) return;
  seen.add(key);
  urunler.push({ kategori, satir: s });
}

for (const u of defaultUrunler()) {
  push(u.kategori, u.ad, u.ebat, u.marka);
}

const SELCUK_GRUP = {
  kirtasiye: "Kırtasiye",
  pc: "PC",
  ambalaj: "Ambalaj",
  temizlik: "Temizlik",
  klinik: "Sağlık",
  mutfak: "Mutfak",
};

for (const grup of selcukMenu()) {
  const kat = SELCUK_GRUP[grup.id];
  if (!kat) continue;
  for (const u of grup.urunler || []) {
    push(kat, u.ad, u.birim);
  }
}

for (const u of defaultSikKullanilan()) {
  if (u.kaynak !== "Ofispanda") continue;
  const kat = u.kategori === "Klinik" ? "Sağlık" : u.kategori;
  if (!["Kırtasiye", "Ambalaj", "Temizlik", "Mutfak", "Sağlık"].includes(kat)) continue;
  push(kat, u.ad, u.birim);
}

for (const u of EKSTRA_URUNLER) {
  push(u.kategori, u.ad, u.ebat || u.birim, u.marka);
}

writeFileSync(
  new URL("../public/katalog.json", import.meta.url),
  JSON.stringify({
    gruplar: [...new Set(urunler.map((r) => r.kategori))],
    urunler,
  }),
  "utf8",
);

const by = {};
for (const r of urunler) by[r.kategori] = (by[r.kategori] || 0) + 1;
console.log(urunler.length, by);
for (const g of ["Kırtasiye", "Ambalaj", "PC", "Temizlik", "Mutfak", "Sağlık"]) {
  console.log("\n===", g, "===");
  for (const r of urunler.filter((x) => x.kategori === g)) console.log(" -", r.satir);
}
