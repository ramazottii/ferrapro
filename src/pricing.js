/** Piyasa kıyası + satılabilir fiyat + ciro bazlı başa baş (koli eşitliği yok) */

export function defaultMaliyet() {
  return {
    aylik_arac: 8000,
    aylik_yakit: 12000,
    aylik_personel: 45000,
    aylik_depo: 12000,
    aylik_diger: 5000,
    /** Hedef aylık satış cirosu (KDV hariç) — sabit gider buna yayılır */
    hedef_aylik_ciro: 400000,
    /** Büyük cari aylık faturası (KDV hariç) — Swissmed ölçeği */
    cari_aylik_ciro: 60000,
    /** Küçük/orta cari aylık faturası (KDV hariç) */
    cari_kucuk_ciro: 35000,
    min_sepet_online: 3000,
    vade_risk_gun: 45,
    /** Tedarikçiye ödeme vadesi (gün) — nakit döngüsü */
    tedarikci_vade_gun: 30,
    /** Çekirdek stokta tutulacak gün (DIO) */
    stok_gun_cekirdek: 21,
    /** Üründe asgari brüt % (satış-alış)/alış */
    min_brut_pct: 12,
  };
}

/** Bilinen internet / B2B etiket fiyatları (KDV hariç, birim = listedeki satış birimi) */
const PIYASA = {
  "7906619": { fiyat: 765, kaynak: "Zergo B2B (Selpak Extra 24×3)", tarih: "2026-08" },
  "7907968": { fiyat: 620, kaynak: "B2B ort. Selpak Touch 24", tarih: "2026-08" },
  "STK.777": { fiyat: 520, kaynak: "OfisMaster/Trendyol benzer Jumbo 300gr", tarih: "2026-08" },
  "STL011": { fiyat: 650, kaynak: "B2B Jumbo 400gr bandı", tarih: "2026-08" },
  "STK/964": { fiyat: 480, kaynak: "Mirada/Avansas Z 200×12 bandı", tarih: "2026-08" },
  "STK.624": { fiyat: 450, kaynak: "Z havlu 200×12 eko-orta", tarih: "2026-08" },
  "STK.320": { fiyat: 1200, kaynak: "Premium Z 200×20 bandı", tarih: "2026-08" },
  "STK.212": { fiyat: 750, kaynak: "Ultra Z 200×12 B2B", tarih: "2026-08" },
};

function normalize(s) {
  return String(s || "")
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function estimatePiyasa(u) {
  const kod = u.kod || "";
  if (PIYASA[kod]) return { ...PIYASA[kod], tahmini: false };

  const ad = normalize(u.ad);
  const alis = Number(u.alis) || 0;
  let carp = 1.28;
  let kaynak = "Tahmini B2B etiket (+%28)";

  if (normalize(u.marka) === "hazel soft") {
    carp = 1.42;
    kaynak = "Tahmini (Hazel fabrika → B2B etiket)";
  } else if (normalize(u.marka) === "selpak") {
    carp = 1.18;
    kaynak = "Tahmini Selpak B2B premium";
  } else if (normalize(u.marka) === "polente" && ad.includes("ultra")) {
    carp = 1.15;
    kaynak = "Tahmini Polente Ultra";
  } else if (ad.includes("cop") || ad.includes("poset")) {
    carp = 1.32;
    kaynak = "Tahmini çöp poşeti B2B";
  } else if (ad.includes("bencup") || ad.includes("karton bardak")) {
    carp = 1.22;
    kaynak = "Tahmini karton bardak (Avansas bandı)";
  }

  if (ad.includes("80") && ad.includes("110") && ad.includes("300")) {
    return {
      fiyat: Math.round(alis * 1.27 * 100) / 100,
      kaynak: "Jumbo 80×110 ~300gr B2B bandı",
      tarih: "2026-08",
      tahmini: true,
    };
  }

  return {
    fiyat: Math.round(alis * carp * 100) / 100,
    kaynak,
    tarih: "2026-08",
    tahmini: true,
  };
}

export function aylikSabit(maliyet) {
  const m = { ...defaultMaliyet(), ...(maliyet || {}) };
  return (
    Number(m.aylik_arac) +
    Number(m.aylik_yakit) +
    Number(m.aylik_personel) +
    Number(m.aylik_depo) +
    Number(m.aylik_diger)
  );
}

/** Sabitin hedef ciroya oranı — ürün satırına eşit koli payı DEĞİL */
export function operasyonOzet(maliyet) {
  const m = { ...defaultMaliyet(), ...(maliyet || {}) };
  const sabit = aylikSabit(m);
  const hedefCiro = Math.max(1, Number(m.hedef_aylik_ciro) || 1);
  return {
    aylik_toplam: sabit,
    hedef_ciro: hedefCiro,
    /** Her 100 ₺ cironun kaç ₺ sabiti karşılaması gerekir */
    sabit_pct_ciro: Math.round((sabit / hedefCiro) * 1000) / 10,
  };
}

/** Geriye uyum — worker eski alanları bekleyebilir */
export function operasyonBirim(maliyet) {
  const o = operasyonOzet(maliyet);
  return { aylik_toplam: o.aylik_toplam, birim: 0, sabit_pct_ciro: o.sabit_pct_ciro };
}

export function familyKey(u) {
  const ad = normalize(`${u.ad} ${u.ebat}`);
  if (ad.includes("cop") || ad.includes("poset")) {
    if (ad.includes("80") && ad.includes("110")) return "cop-80x110";
    if (ad.includes("75") && ad.includes("90")) return "cop-battal";
    if (ad.includes("hantal") || (ad.includes("100") && ad.includes("150")) || (ad.includes("120") && ad.includes("150")))
      return "cop-hantal";
    if (ad.includes("40") && ad.includes("50")) return "cop-mini";
    if (ad.includes("55") && ad.includes("60")) return "cop-orta";
    if (ad.includes("65")) return "cop-buyuk";
    return "cop-diger";
  }
  if (ad.includes("fotoselli")) return "fotoselli-21";
  if (ad.includes("icte cekmeli havlu")) return "icten-havlu";
  if (ad.includes("icte cekmeli") && ad.includes("tuvalet")) return "icten-tuvalet";
  if (ad.includes("mini jumbo") || (ad.includes("jumbo") && ad.includes("tuvalet"))) return "mini-jumbo";
  if (ad.includes("z kat") || ad.includes("dispenser z") || ad.includes("z katlama")) {
    if (ad.includes("200")) return "z-200";
    if (ad.includes("150") || ad.includes("120")) return "z-150";
    return "z-eko";
  }
  if (ad.includes("pecete")) return ad.includes("dispenser") ? "pecete-disp" : "pecete";
  if (ad.includes("karton bardak") || ad.includes("bencup")) {
    if (ad.includes("corba")) return "bardak-corba";
    return "bardak";
  }
  if (ad.includes("tuvalet") && (ad.includes("24") || ad.includes("32"))) return "tuv-ev-tipi";
  return `${normalize(u.kategori)}|${ad.slice(0, 36)}`;
}

function findAlAlternatives(u, all) {
  const key = familyKey(u);
  const peers = (all || [])
    .filter((x) => x.id !== u.id && familyKey(x) === key && x.alis != null)
    .sort((a, b) => a.alis - b.alis);
  const cheaper = peers.filter((p) => p.alis < (u.alis || Infinity));
  return { cheaper };
}

function numTr(s) {
  return Number(String(s).replace(",", "."));
}

/** Koli içindeki işlevsel miktar — yaprak/m/kg/adet (kürdan ≠ A4) */
function parseIcerik(u) {
  const t = `${u.ad || ""} ${u.ebat || ""}`;
  const n = normalize(t);
  const koliM = n.match(/koli\s*(\d+)/);
  const pack = koliM ? Number(koliM[1]) : 1;
  const yaprakM = n.match(/(\d+)\s*yaprak/);
  const luM = n.match(/(\d+)\s*'?lu\s*[x×]\s*(\d+)/);
  const adetM = n.match(/(\d+)\s*adet(?:\/koli)?/);
  const kgM = n.match(/(\d+(?:[.,]\d+)?)\s*kg/);
  const metreM = n.match(/(\d+(?:[.,]\d+)?)\s*m(?:etre)?(?![a-z])/);

  if (yaprakM) {
    const toplam = Number(yaprakM[1]) * pack;
    return { tur: "yaprak", toplam, pack, etiket: `${toplam} yaprak/koli` };
  }
  if (luM) {
    const toplam = Number(luM[1]) * Number(luM[2]);
    return { tur: "yaprak", toplam, pack, etiket: `${toplam} yaprak/koli` };
  }
  if (adetM) {
    const toplam = Number(adetM[1]);
    return { tur: "adet", toplam, pack, etiket: `${toplam} adet/koli` };
  }
  if (kgM) {
    const toplam = Math.round(numTr(kgM[1]) * pack * 100) / 100;
    return { tur: "kg", toplam, pack, etiket: `${toplam} kg/koli` };
  }
  if (metreM) {
    const toplam = Math.round(numTr(metreM[1]) * pack * 100) / 100;
    return { tur: "m", toplam, pack, etiket: `${toplam} m/koli` };
  }
  return { tur: null, toplam: 0, pack, etiket: "" };
}

function birimMaliyet(alis, icerik) {
  const a = Number(alis) || 0;
  if (!icerik.tur || !icerik.toplam) return null;
  const ham = a / icerik.toplam;
  if (icerik.tur === "yaprak") {
    const d = Math.round(ham * 100 * 1000) / 1000;
    return { tur: "yaprak", ham, deger: d, yazi: `${fmt(d)} ₺/100 yaprak` };
  }
  if (icerik.tur === "m") {
    const d = Math.round(ham * 10 * 1000) / 1000;
    return { tur: "m", ham, deger: d, yazi: `${fmt(d)} ₺/10 m` };
  }
  if (icerik.tur === "kg") {
    const d = Math.round(ham * 1000) / 1000;
    return { tur: "kg", ham, deger: d, yazi: `${fmt(d)} ₺/kg` };
  }
  const d = Math.round(ham * 100 * 1000) / 1000;
  return { tur: "adet", ham, deger: d, yazi: `${fmt(d)} ₺/100 adet` };
}

const SWISSMED_SINYAL = [
  { re: /fotoselli/, label: "Swissmed tekrar: fotoselli havlu" },
  { re: /mini jumbo|jumbo tuvalet/, label: "Swissmed tekrar: jumbo tuvalet" },
  { re: /nitril/, label: "Swissmed tekrar: nitril" },
  { re: /cop|poset/, label: "Swissmed tekrar: çöp poşeti" },
  { re: /z kat|dispenser z/, label: "Swissmed tekrar: Z havlu" },
  { re: /icte cekmeli/, label: "Swissmed tekrar: içten çekmeli" },
  { re: /pecete/, label: "Swissmed tekrar: peçete" },
  { re: /karton bardak|bencup/, label: "Klinik ikram: bardak" },
];

function swissmedEslesme(u) {
  const n = normalize(`${u.ad} ${u.ebat} ${u.kategori}`);
  const hit = SWISSMED_SINYAL.find((s) => s.re.test(n));
  return hit ? hit.label : null;
}

export function nakitDongu(maliyet) {
  const m = { ...defaultMaliyet(), ...(maliyet || {}) };
  const dio = Number(m.stok_gun_cekirdek) || 21;
  const dso = Number(m.vade_risk_gun) || 45;
  const dpo = Number(m.tedarikci_vade_gun) || 30;
  return { dio, dso, dpo, ccc: dio + dso - dpo };
}

function fmt(n) {
  return Number(n).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Ürün satırı: alış / piyasa / satılabilir / brüt.
 * Operasyon bu satıra eşit “koli payı” olarak YAZILMAZ.
 */
export function analyzeUrun(u, all, maliyet) {
  const m = { ...defaultMaliyet(), ...(maliyet || {}) };
  const alis = Number(u.alis) || 0;
  const piyasa = estimatePiyasa(u);
  const minBrutPct = Number(m.min_brut_pct) / 100;
  const op = operasyonOzet(m);

  const taban = Math.round(alis * (1 + minBrutPct) * 100) / 100;
  const tavan = piyasa.fiyat ? Math.round(piyasa.fiyat * 0.97 * 100) / 100 : null;

  let satilabilir;
  if (piyasa.fiyat) {
    satilabilir = Math.round(piyasa.fiyat * 0.94 * 100) / 100;
    if (satilabilir < taban) satilabilir = Math.min(taban, tavan ?? taban);
    if (tavan != null && satilabilir > tavan) satilabilir = tavan;
  } else {
    satilabilir = taban;
  }

  const brutKar = Math.round((satilabilir - alis) * 100) / 100;
  const brutPct = alis > 0 ? Math.round((brutKar / alis) * 1000) / 10 : 0;
  // Bu ürünün ciroya katkısı oranında sabit payı (bilgi; karar satılabilir+brüt üzerinden)
  const sabitPay = Math.round(satilabilir * (op.sabit_pct_ciro / 100) * 100) / 100;
  const katkiSonrasi = Math.round((brutKar - sabitPay) * 100) / 100;

  const alisAvantaj = piyasa.fiyat ? Math.round((piyasa.fiyat - alis) * 100) / 100 : null;
  const alisAvantajPct =
    piyasa.fiyat && piyasa.fiyat > 0 ? Math.round(((piyasa.fiyat - alis) / piyasa.fiyat) * 1000) / 10 : null;

  let avantajEtiket = "—";
  let avantajSinif = "neu";
  if (alisAvantajPct != null) {
    if (alisAvantajPct >= 15) {
      avantajEtiket = `Toptancı avantajlı (%${alisAvantajPct})`;
      avantajSinif = "good";
    } else if (alisAvantajPct >= 5) {
      avantajEtiket = `Hafif avantaj (%${alisAvantajPct})`;
      avantajSinif = "ok";
    } else if (alisAvantajPct >= -3) {
      avantajEtiket = "Piyasa ile paralel";
      avantajSinif = "neu";
    } else {
      avantajEtiket = `İnternet daha ucuz (%${Math.abs(alisAvantajPct)})`;
      avantajSinif = "bad";
    }
  }

  const { cheaper } = findAlAlternatives(u, all);
  let alOneri;
  if (cheaper.length) {
    const best = cheaper[0];
    alOneri = `Tercih: ${best.tedarikci} / ${best.marka} (${fmt(best.alis)} ₺)`;
  } else if (avantajSinif === "bad") {
    alOneri = "Alternatif tedarikçi ara — alış pahalı";
  } else {
    alOneri = `Al: ${u.tedarikci || "—"}`;
  }

  const icerik = parseIcerik(u);
  const birim = birimMaliyet(alis, icerik);
  const swiss = swissmedEslesme(u);

  const riskler = [];
  if (brutPct < Number(m.min_brut_pct)) riskler.push(`Brüt %${brutPct} — asgari %${m.min_brut_pct} altı`);
  if (avantajSinif === "bad") riskler.push("Alış internet bandının üstünde");
  if (katkiSonrasi < 0) {
    riskler.push("Hedef ciroda bu kalemin brütü sabit payını zor karşılar — sepetle sat");
  }

  return {
    piyasa_fiyat: piyasa.fiyat,
    piyasa_kaynak: piyasa.kaynak,
    piyasa_tahmini: !!piyasa.tahmini,
    onerilen_satis: satilabilir,
    satilabilir_fiyat: satilabilir,
    fiyat_taban: taban,
    fiyat_tavan: tavan,
    brut_kar: brutKar,
    brut_kar_pct: brutPct,
    sabit_pay_ciro: sabitPay,
    katki_sonrasi: katkiSonrasi,
    tahmini_kar: brutKar,
    tahmini_kar_pct: brutPct,
    alis_avantaj: alisAvantaj,
    alis_avantaj_pct: alisAvantajPct,
    avantaj_etiket: avantajEtiket,
    avantaj_sinif: avantajSinif,
    al_onerisi: alOneri,
    sat_onerisi: `Satılabilir ${fmt(satilabilir)} ₺ · brüt +${fmt(brutKar)} (%${brutPct})`,
    icerik,
    birim,
    swissmed: swiss,
    riskler,
  };
}

export function enrichUrunler(urunler, maliyet) {
  const raw = urunler || [];
  const list = raw.map((u) => ({
    ...u,
    analiz: analyzeUrun(u, raw, maliyet),
  }));
  return applyStokKarar(list);
}

function applyStokKarar(list) {
  const byFam = {};
  for (const u of list) {
    const a = u.analiz;
    const key = `${familyKey(u)}|${a.birim?.tur || "yok"}`;
    if (!byFam[key]) byFam[key] = [];
    byFam[key].push(u);
  }
  const winner = new Set();
  for (const grup of Object.values(byFam)) {
    const withHam = grup.filter((x) => x.analiz.birim?.ham != null);
    if (!withHam.length) continue;
    withHam.sort((a, b) => a.analiz.birim.ham - b.analiz.birim.ham);
    winner.add(withHam[0].id);
    for (const x of withHam) {
      const w = withHam[0];
      if (x.id === w.id) x.analiz.aile_en_ucuz = true;
      else {
        x.analiz.aile_en_ucuz = false;
        const fark = Math.round(((x.analiz.birim.ham - w.analiz.birim.ham) / w.analiz.birim.ham) * 1000) / 10;
        x.analiz.aile_not = `Aynı işlevde ${w.marka} %${fark} daha ucuz birim`;
      }
    }
  }

  const ranked = list.map((u) => {
    let talep = 1;
    if (u.analiz.swissmed) talep += 5;
    if (u.analiz.aile_en_ucuz) talep += 2;
    if (u.kategori === "Hijyen" || u.kategori === "Temizlik" || u.kategori === "Sağlık") talep += 1;
    const skor = (u.analiz.brut_kar || 0) * talep;
    return { u, skor, talep };
  });
  ranked.sort((a, b) => b.skor - a.skor);
  const toplamSkor = ranked.reduce((s, r) => s + r.skor, 0) || 1;
  let cum = 0;
  for (const r of ranked) {
    cum += r.skor;
    const pct = cum / toplamSkor;
    r.u.analiz.abc = pct <= 0.7 ? "A" : pct <= 0.9 ? "B" : "C";
    r.u.analiz.talep_skor = r.talep;
  }
  ranked.sort((a, b) => {
    const pa = cekirdekOncelik(a.u);
    const pb = cekirdekOncelik(b.u);
    if (pa !== pb) return pb - pa;
    return b.skor - a.skor;
  });

  const gorulenAile = new Set();
  let cekirdekSay = 0;
  for (const r of ranked) {
    const u = r.u;
    const a = u.analiz;
    const kopyaPahali = a.aile_en_ucuz === false;
    const aile = familyKey(u);
    if (kopyaPahali && !a.swissmed) {
      a.stok_karar = "birak";
      a.stok_etiket = a.aile_not || "Aynı işlevde daha ucuzu var";
    } else if (a.abc === "C" && !a.swissmed) {
      a.stok_karar = "birak";
      a.stok_etiket = "C sınıfı — ilk turda stoklama";
    } else if (
      cekirdekSay < 28 &&
      !kopyaPahali &&
      !gorulenAile.has(aile) &&
      (a.swissmed || a.abc === "A")
    ) {
      a.stok_karar = "cekirdek";
      a.stok_etiket = a.swissmed ? "Çekirdek (müşteri talebi)" : "Çekirdek (A sınıfı)";
      gorulenAile.add(aile);
      cekirdekSay += 1;
    } else {
      a.stok_karar = "siparise";
      a.stok_etiket = gorulenAile.has(aile)
        ? "Aynı ailede çekirdek var — siparişe"
        : "Siparişe bağla — depoda tutma";
    }
  }
  return list;
}

function cekirdekOncelik(u) {
  const n = normalize(`${u.ad} ${u.ebat}`);
  if (/fotoselli|z kat|dispenser z|mini jumbo|jumbo tuvalet|icte cekmeli|nitril/.test(n)) return 4;
  if (/cop|poset/.test(n)) return 3;
  if (/pecete/.test(n)) return 2;
  if (/bencup|bardak/.test(n)) return 1;
  return 0;
}

export function zekaOzet(urunler, maliyet) {
  const list = urunler || [];
  const nakit = nakitDongu(maliyet);
  const cekirdek = list
    .filter((u) => u.analiz?.stok_karar === "cekirdek")
    .sort((a, b) => cekirdekOncelik(b) - cekirdekOncelik(a) || (b.analiz.talep_skor || 0) - (a.analiz.talep_skor || 0));
  const siparise = list.filter((u) => u.analiz?.stok_karar === "siparise");
  const birak = list.filter((u) => u.analiz?.stok_karar === "birak");
  const abc = { A: 0, B: 0, C: 0 };
  for (const u of list) {
    const k = u.analiz?.abc;
    if (abc[k] != null) abc[k] += 1;
  }
  const ilkStok = cekirdek.reduce((s, u) => s + (Number(u.alis) || 0) * 2, 0);
  const cccPay = nakit.ccc > 0 ? nakit.ccc / 30 : 0;
  const nakitKilit = Math.round(ilkStok * (1 + cccPay) * 100) / 100;
  return {
    nakit,
    abc,
    cekirdek_adet: cekirdek.length,
    siparise_adet: siparise.length,
    birak_adet: birak.length,
    ilk_stok_2koli: Math.round(ilkStok),
    nakit_kilit: Math.round(nakitKilit),
    cekirdek: cekirdek.slice(0, 28).map((u) => ({
      id: u.id,
      ad: u.ad,
      kod: u.kod,
      alis: u.alis,
      sat: u.analiz.onerilen_satis,
      birim: u.analiz.birim?.yazi || "—",
      swissmed: u.analiz.swissmed,
      brut_pct: u.analiz.brut_kar_pct,
    })),
  };
}

export function portfolioSummary(urunler) {
  const list = urunler || [];
  let good = 0;
  let bad = 0;
  let risk = 0;
  let brutToplam = 0;
  let satisToplam = 0;
  let alisToplam = 0;
  let n = 0;
  for (const u of list) {
    const a = u.analiz;
    if (!a) continue;
    n++;
    if (a.avantaj_sinif === "good" || a.avantaj_sinif === "ok") good++;
    if (a.avantaj_sinif === "bad") bad++;
    if (a.riskler?.length) risk++;
    brutToplam += a.brut_kar || 0;
    satisToplam += a.onerilen_satis || 0;
    alisToplam += Number(u.alis) || 0;
  }
  const ortBrutPct = alisToplam > 0 ? Math.round((brutToplam / alisToplam) * 1000) / 10 : 0;
  const ortBrutCiroPct = satisToplam > 0 ? Math.round((brutToplam / satisToplam) * 1000) / 10 : 0;
  return {
    toplam: list.length,
    avantajli: good,
    pahali: bad,
    riskli: risk,
    ort_brut: n ? Math.round((brutToplam / n) * 100) / 100 : 0,
    ort_brut_pct: ortBrutPct,
    ort_brut_ciro_pct: ortBrutCiroPct,
    ort_satis: n ? Math.round((satisToplam / n) * 100) / 100 : 0,
    ort_kar: n ? Math.round((brutToplam / n) * 100) / 100 : 0,
  };
}

/**
 * Başa baş = gereken aylık CİRO (fatura), koli adedi değil.
 * Brüt % = (satış−alış)/satış ortalaması üzerinden.
 */
export function breakEven(maliyet, ozet) {
  const m = { ...defaultMaliyet(), ...(maliyet || {}) };
  const sabit = aylikSabit(m);
  const brutCiroPct = Math.max(0.01, (Number(ozet?.ort_brut_ciro_pct) || 15) / 100);
  const cariCiro = Math.max(1, Number(m.cari_aylik_ciro) || 60000);
  const hedefCiro = Math.max(1, Number(m.hedef_aylik_ciro) || 1);

  const basaBasCiro = Math.ceil(sabit / brutCiroPct);
  const basaBasCari = Math.ceil(basaBasCiro / cariCiro);
  const hedefBrut = Math.round(hedefCiro * brutCiroPct * 100) / 100;
  const hedefteNet = Math.round((hedefBrut - sabit) * 100) / 100;

  const cariList = [3, 5, 8, basaBasCari, 12, 15].filter(
    (v, i, arr) => v != null && v > 0 && arr.indexOf(v) === i
  );
  cariList.sort((a, b) => a - b);

  const senaryolar = cariList.map((cari) => {
    const ciro = cari * cariCiro;
    const brut = Math.round(ciro * brutCiroPct * 100) / 100;
    const net = Math.round((brut - sabit) * 100) / 100;
    return { cari, ciro, brut, net, karli: net >= 0 };
  });

  return {
    aylik_sabit: sabit,
    ort_brut_ciro_pct: Math.round(brutCiroPct * 1000) / 10,
    cari_aylik_ciro: cariCiro,
    cari_kucuk_ciro: Math.max(1, Number(m.cari_kucuk_ciro) || 35000),
    basa_bas_ciro: basaBasCiro,
    basa_bas_cari: basaBasCari,
    hedef_ciro: hedefCiro,
    hedefte_net: hedefteNet,
    sabit_pct_ciro: Math.round((sabit / hedefCiro) * 1000) / 10,
    senaryolar,
    karisik: mixSenaryolar(m, sabit, brutCiroPct, basaBasCiro),
  };
}

function mixRow(buyukN, kucukN, buyuk, kucuk, brutCiroPct, sabit, etiket) {
  const ciro = buyukN * buyuk + kucukN * kucuk;
  const brut = Math.round(ciro * brutCiroPct * 100) / 100;
  const net = Math.round((brut - sabit) * 100) / 100;
  return {
    etiket,
    buyuk: buyukN,
    kucuk: kucukN,
    adet: buyukN + kucukN,
    ciro,
    brut,
    net,
    karli: net >= 0,
  };
}

/** 1 büyük (Swissmed) + N küçük — eşit cari varsayımı yok */
function mixSenaryolar(m, sabit, brutCiroPct, basaBasCiro) {
  const buyuk = Math.max(1, Number(m.cari_aylik_ciro) || 60000);
  const kucuk = Math.max(1, Number(m.cari_kucuk_ciro) || 35000);
  const row = (b, k, etiket) => mixRow(b, k, buyuk, kucuk, brutCiroPct, sabit, etiket);

  const satirlar = [
    row(1, 0, "1 büyük (Swissmed ölçeği)"),
    row(1, 3, "1 büyük + 3 küçük"),
    row(1, 6, "İlk dalga: 1 büyük + 6 küçük"),
  ];

  let kucukGerek = 0;
  while (kucukGerek < 60 && !row(1, kucukGerek, "").karli) kucukGerek++;
  const basaEtiket = `Başa baş: 1 büyük + ${kucukGerek} küçük`;
  if (!satirlar.some((s) => s.buyuk === 1 && s.kucuk === kucukGerek)) {
    satirlar.push(row(1, kucukGerek, basaEtiket));
  }

  satirlar.sort((a, b) => a.ciro - b.ciro);
  const acikIlkDalga = Math.max(0, basaBasCiro - (buyuk + 6 * kucuk));
  return {
    buyuk_ciro: buyuk,
    kucuk_ciro: kucuk,
    basa_bas_kucuk_ile: kucukGerek,
    ilk_dalga_acik: Math.round(acikIlkDalga),
    satirlar,
  };
}

/** Kayıtlı carilerin gerçek fatura toplamı vs başa baş */
export function cariPortfoy(maliyet, ozet, cariler) {
  const be = breakEven(maliyet, ozet);
  const list = (cariler || []).filter((c) => c && c.aktif !== false);
  const mevcutCiro = list.reduce((s, c) => s + (Number(c.aylik_ciro) || 0), 0);
  const brutPct = be.ort_brut_ciro_pct / 100;
  const mevcutBrut = Math.round(mevcutCiro * brutPct * 100) / 100;
  const mevcutNet = Math.round((mevcutBrut - be.aylik_sabit) * 100) / 100;
  const acik = Math.max(0, be.basa_bas_ciro - mevcutCiro);
  const kucuk = be.cari_kucuk_ciro;
  const buyuk = be.cari_aylik_ciro;
  return {
    adet: list.length,
    mevcut_ciro: Math.round(mevcutCiro),
    mevcut_brut: mevcutBrut,
    mevcut_net: mevcutNet,
    acik: Math.round(acik),
    karli: mevcutNet >= 0,
    kac_adet_buyuk: acik > 0 ? Math.ceil(acik / buyuk) : 0,
    kac_adet_kucuk: acik > 0 ? Math.ceil(acik / kucuk) : 0,
    satirlar: list
      .map((c) => {
        const ciro = Number(c.aylik_ciro) || 0;
        const brut = Math.round(ciro * brutPct * 100) / 100;
        return { id: c.id, ad: c.ad, ciro, brut, not: c.not || "" };
      })
      .sort((a, b) => b.ciro - a.ciro),
  };
}

export function kategoriOzet(urunler) {
  const map = {};
  for (const u of urunler || []) {
    const k = u.kategori || "—";
    if (!map[k]) {
      map[k] = { kategori: k, adet: 0, alis: 0, satis: 0, brut: 0, avantaj: 0, risk: 0 };
    }
    const a = u.analiz || {};
    map[k].adet += 1;
    map[k].alis += Number(u.alis) || 0;
    map[k].satis += a.onerilen_satis || 0;
    map[k].brut += a.brut_kar || 0;
    if (a.avantaj_sinif === "good" || a.avantaj_sinif === "ok") map[k].avantaj += 1;
    if (a.riskler?.length) map[k].risk += 1;
  }
  return Object.values(map)
    .map((x) => ({
      ...x,
      alis: Math.round(x.alis * 100) / 100,
      satis: Math.round(x.satis * 100) / 100,
      brut: Math.round(x.brut * 100) / 100,
      brut_ciro_pct: x.satis > 0 ? Math.round((x.brut / x.satis) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.brut_ciro_pct - a.brut_ciro_pct);
}
