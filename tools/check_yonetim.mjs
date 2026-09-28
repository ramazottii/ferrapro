import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const publicCatalog = JSON.parse(readFileSync(new URL("../public/katalog.json", import.meta.url), "utf8"));
const catalog = JSON.parse(readFileSync(new URL("../public/yonetim/catalog.json", import.meta.url), "utf8"));
const js = readFileSync(new URL("../public/yonetim/yonetim.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/yonetim/index.html", import.meta.url), "utf8");
assert.match(html, /yonetim\/cikis/);
assert.match(js, /\/katalog\.json/);
assert.match(js, /dipSatis/);
assert.match(js, /idealSatis/);
assert.match(js, /maliyet/);
assert.match(js, /karYuzde/);
assert.doesNotMatch(js, /placeholder\(/);

assert.equal(catalog.kategoriler.map((k) => k.id).join(","), "A,B,C,D,E,F");
assert.equal(catalog.kategoriler[1].altlar.map((a) => a.id).join(","), "B1,B2");
assert.equal(catalog.urunler.length, publicCatalog.urunler.length);
assert.equal(catalog.urunler.length, 354);

const byAlt = Object.fromEntries(catalog.kategoriler.flatMap((k) => k.altlar.map((a) => [a.id, 0])));
for (const u of catalog.urunler) {
  assert.ok(byAlt[u.altKategoriId] != null, u.ad);
  byAlt[u.altKategoriId] += 1;
  assert.equal(typeof u.ad, "string");
  assert.ok(u.ad.length > 1);
  assert.equal(u.ad.includes("end."), false, u.ad);
  assert.equal(typeof u.aktif, "boolean");
  assert.equal(Object.hasOwn(u, "fiyat"), true);
  assert.equal(Object.hasOwn(u, "maliyet"), true);
  assert.equal(Object.hasOwn(u, "listeFiyat"), true);
  assert.equal(Object.hasOwn(u, "idealSatis"), true);
  assert.equal(Object.hasOwn(u, "dipSatis"), true);
  assert.equal(Object.hasOwn(u, "birim"), true);
}

assert.equal(byAlt["A1"], 14);
assert.equal(byAlt["A2"], 14);
assert.equal(byAlt["A3"], 15);
assert.equal(byAlt["B1"], 23);
assert.equal(byAlt["B2"], 19);
assert.equal(byAlt["D2"], 36);
assert.equal(byAlt["D1"], 18);
assert.equal(byAlt["D3"], 22);
assert.equal(byAlt["C1"], 9);
assert.equal(byAlt["C2"], 10);
assert.equal(byAlt["C3"], 7);
assert.equal(byAlt["C4"], 8);
assert.equal(byAlt["E1"], 17);
assert.equal(byAlt["E2"], 17);
assert.equal(byAlt["E3"], 19);
assert.equal(byAlt["E4"], 15);
assert.equal(byAlt["F1"], 33);
assert.equal(byAlt["F2"], 29);
assert.equal(byAlt["F4"], 1);
assert.equal(byAlt["F3"], 28);

const cop = catalog.urunler.filter((u) => u.altKategoriId === "D1");
assert.ok(cop.every((u) => u.anaKategoriId === "D"));
assert.ok(cop.some((u) => u.marka === "MRP Marin"));
assert.ok(cop.some((u) => u.marka === "Koroplast"));
assert.ok(catalog.urunler.some((u) => u.altKategoriId === "C4" && u.marka === "Parex"));

const note32 = catalog.urunler.find((u) => u.id === "p-044");
assert.equal(note32.ad, "Domestos Çamaşır Suyu");
assert.equal(note32.olcu, "3,2Lt");
assert.equal(note32.marka, "Domestos");
assert.equal(note32.gorsel, "/img/products/domestos-cam-32.webp");
assert.equal(catalog.urunler.find((u) => u.id === "p-047").gorsel, "/img/products/pril-ultra-guc-4kg.webp");
assert.equal(catalog.urunler.find((u) => u.id === "p-048").gorsel, "/img/products/bingo-fresh-masal-25.webp");
assert.equal(catalog.urunler.find((u) => u.id === "p-023").gorsel, "/img/products/ozopak-el-sabunu-5kg.webp");
assert.equal(catalog.urunler.find((u) => u.id === "p-025").gorsel, "/img/products/ozopak-camasir-suyu-5kg.webp");
assert.equal(catalog.urunler.find((u) => u.id === "p-059").marka, "Bref");

const hap = catalog.kategoriler[2].altlar[0];
assert.deepEqual(hap.markaSecenekleri, ["Palex", "Vialli", "Flosoft"]);
assert.ok(catalog.urunler.filter((u) => u.altKategoriId === "C1").every((u) => u.marka === "Palex"));

assert.match(html, /noindex/);
assert.match(js, /Yeni ürün/);
assert.match(js, /Filtreleri temizle/);

const chk = spawnSync(process.execPath, ["--check", fileURLToPath(new URL("../public/yonetim/yonetim.js", import.meta.url))], { encoding: "utf8" });
assert.equal(chk.status, 0, chk.stderr);

console.log("PASS: yonetim catalog synced with public katalog, price fields, C4 filled.");
