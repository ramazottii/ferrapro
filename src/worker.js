import { defaultUrunler, CATALOG_VERSION } from "./catalog.js";
import { defaultSikKullanilan, SIK_VERSION, enrichSikKullanilan } from "./sik_kullanilan.js";
import {
  defaultMaliyet,
  enrichUrunler,
  portfolioSummary,
  operasyonOzet,
  breakEven,
  cariPortfoy,
  kategoriOzet,
  zekaOzet,
} from "./pricing.js";
import { buildKiyas } from "./kiyas.js";
import { selcukMenu, selcukBakis } from "./selcuk.js";
import { storeQuote, readQuotes } from "./quote-store.js";
import { publicPage } from "./public-pages.js";
import { guardQuote, readQuoteBody } from "./quote-guard.js";
import { notifyQuote } from "./quote-notify.js";
import { validateFollowup, saveFollowup, attachFollowups } from "./quote-tracking.js";
import { acceptMetric, measure } from "./conversion-metrics.js";
export { PriceStore } from './price-store.js';

const SESSION_TTL = 60 * 60 * 24 * 30;

function isVitrinHost(host) {
  return host === "ferrapro.com" || host === "www.ferrapro.com";
}

function isPanelHost(host) {
  return host === "tedarik.ferranoi.com";
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/yonetim" || url.pathname.startsWith("/yonetim/")) {
      return handleYonetim(request, env, url);
    }
    if (isVitrinHost(url.hostname)) {
      if (url.pathname === '/api/olcum' && request.method === 'POST') return acceptMetric(request, env);
      if (url.pathname === "/api/teklif" && request.method === "POST") {
        try {
          return await handleVitrinTeklif(request, env, ctx);
        } catch (err) {
          return json({ error: err.message || "Sunucu hatası" }, err.status || 500);
        }
      }
      if (url.pathname.startsWith("/panel")) {
        return Response.redirect("https://tedarik.ferranoi.com/panel/", 302);
      }
      if (url.pathname.startsWith("/api/") && url.pathname !== "/api/teklif") {
        return new Response("Not found", { status: 404 });
      }
      const redirects = {
        "/katalog": "/urunler",
        "/katalog/": "/urunler",
        "/sepet": "/siparis",
        "/sepet/": "/siparis",
        "/urun": "/urunler",
        "/urun/": "/urunler",
      };
      if (redirects[url.pathname]) {
        const next = new URL(redirects[url.pathname], url);
        next.search = url.search;
        return Response.redirect(next, 301);
      }
      return publicPage(request, env, url);
    }
    if (isPanelHost(url.hostname) && (url.pathname === "/" || url.pathname === "")) {
      return Response.redirect(new URL("/panel/", url), 302);
    }
    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, url);
      } catch (err) {
        return json({ error: err.message || "Sunucu hatası" }, err.status || 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

const YONETIM_COOKIE = "fp_yonetim";

function yonetimPin(env) {
  return String(env.YONETIM_PASSWORD || "2112");
}

function readCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return "";
}

function yonetimCookieHeader(token, url, clear = false) {
  const secure = url.protocol === "https:" ? "; Secure" : "";
  if (clear) {
    return `${YONETIM_COOKIE}=; Path=/yonetim; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
  }
  return `${YONETIM_COOKIE}=${token}; Path=/yonetim; Max-Age=${SESSION_TTL}; HttpOnly; SameSite=Lax${secure}`;
}

function timingEqual(a, b) {
  const x = String(a);
  const y = String(b);
  const n = Math.max(x.length, y.length);
  let diff = x.length ^ y.length;
  for (let i = 0; i < n; i++) diff |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
  return diff === 0;
}

function yonetimLoginPage(error, next = '') {
  const msg = error ? `<p class="err">${error}</p>` : "";
  return new Response(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Giriş · FerraPro</title>
  <style>
    :root { font-family: "DM Sans", system-ui, sans-serif; }
    body { margin:0; min-height:100vh; display:grid; place-items:center; background:#F4F6F8; color:#0F172A; }
    form { width:min(92vw,380px); background:#fff; border:1px solid #E2E8F0; border-radius:14px; padding:28px 24px; box-shadow:0 10px 30px #14223812; }
    img { display:block; height:36px; margin:0 auto 16px; }
    h1 { margin:0 0 6px; font-size:1.15rem; text-align:center; }
    p { margin:0 0 16px; color:#64748B; font-size:.9rem; text-align:center; }
    .err { color:#B91C1C; }
    label { display:block; font-size:.8rem; font-weight:650; margin-bottom:6px; }
    input { width:100%; box-sizing:border-box; min-height:44px; padding:10px 12px; border:1px solid #E2E8F0; border-radius:8px; font:inherit; }
    button { margin-top:14px; width:100%; min-height:44px; border:0; border-radius:8px; background:#0F172A; color:#fff; font:inherit; font-weight:650; cursor:pointer; }
  </style>
</head>
<body>
  <form method="post" action="/yonetim/giris">
    <input type="hidden" name="next" value="${next === '/yonetim/talepler' ? next : ''}">
    <img src="/logo/ferrapro-header.png?v=1" alt="FerraPro">
    <h1>FerraPro Yönetim</h1>
    <p>Devam etmek için şifre girin.</p>
    ${msg}
    <label for="password">Şifre</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
    <button type="submit">Giriş</button>
  </form>
</body>
</html>`, {
    status: error ? 401 : 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

async function handleYonetim(request, env, url) {
  const pin = yonetimPin(env);
  const token = await hmac(env.SESSION_SECRET || pin, "yonetim|" + pin);
  const path = url.pathname.replace(/\/+$/, "") || "/yonetim";

  if (path === "/yonetim/cikis") {
    const next = new URL("/yonetim/", url);
    return new Response(null, {
      status: 302,
      headers: { location: next.toString(), "set-cookie": yonetimCookieHeader("", url, true) },
    });
  }

  if (path === "/yonetim/giris" && request.method === "POST") {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const given = String(params.get("password") || "");
    const destination=params.get('next') === '/yonetim/talepler' ? '/yonetim/talepler' : '/yonetim/';
    if (!timingEqual(given, pin)) return yonetimLoginPage("Şifre yanlış.", destination);
    const next = new URL(destination, url);
    return new Response(null, {
      status: 302,
      headers: { location: next.toString(), "set-cookie": yonetimCookieHeader(token, url) },
    });
  }

  if (readCookie(request, YONETIM_COOKIE) === token) {
    if (path === '/yonetim/api/fiyatlar') {
      const headers = { 'cache-control': 'no-store' };
      if (!['GET', 'PUT'].includes(request.method)) return json({error:'Yöntem desteklenmiyor'},405,headers);
      if (request.method === 'PUT' && (request.headers.get('origin') !== url.origin || !request.headers.get('content-type')?.startsWith('application/json'))) return json({error:'Geçersiz kaynak'},403,headers);
      if (!env.PRICE_STORE) return json({error:'Sunucu fiyat kaydı henüz etkin değil. Yerel kayıtlarınız korunuyor.'},503,headers);
      try {
        const store = env.PRICE_STORE.get(env.PRICE_STORE.idFromName('ferrapro-private-prices'));
        return await store.fetch(request);
      } catch { return json({error:'Fiyat sunucusuna ulaşılamadı. Tekrar deneyin.'},503,headers); }
    }
    if (path === '/yonetim/api/talepler' || path === '/yonetim/api/takip') {
      const headers={'cache-control':'no-store'};
      // Customer details must never be accessible with the legacy fallback PIN.
      if (!env.YONETIM_PASSWORD || !env.SESSION_SECRET) return json({error:'Talep erişimi için özel yönetim parolası yapılandırılmalıdır.'},503,headers);
      try {
        if (path === '/yonetim/api/talepler' && request.method === 'GET') {
          const legacy=await env.KV.get('state','json');
          const quotes=await readQuotes(env,legacy?.vitrin_teklifler||[]);
          return json({talepler:await attachFollowups(env,quotes)},200,headers);
        }
        if (path === '/yonetim/api/takip' && request.method === 'POST') {
          if(request.headers.get('origin') !== url.origin) fail(403,'Geçersiz kaynak');
          let body;try{body=JSON.parse(await readQuoteBody(request));}catch(err){fail(err.status||400,'Geçersiz talep');}
          const fields=validateFollowup(body);
          const quote=await env.KV.get('vitrin-quote:'+fields.quote_id,'json');
          const legacy=quote?null:await env.KV.get('state','json');
          if(!quote && !(legacy?.vitrin_teklifler||[]).some(q=>String(q.id)===fields.quote_id))fail(404,'Talep bulunamadı');
          return json({ok:true,event:await saveFollowup(env,fields,{name:'FerraPro Yönetim'})},200,headers);
        }
        return json({error:'Yöntem desteklenmiyor'},405,headers);
      }catch(err){return json({error:err.message||'Sunucu hatası'},err.status||500,headers);}
    }
    if(path === '/yonetim/talepler') {
      const asset=new URL('/yonetim/talepler.html',url);
      const response=await env.ASSETS.fetch(new Request(asset,request));
      const headers=new Headers(response.headers);headers.set('cache-control','no-store');
      return new Response(response.body,{status:response.status,headers});
    }
    return env.ASSETS.fetch(request);
  }

  if (path === '/yonetim/talepler') return yonetimLoginPage('',path);
  if (path === "/yonetim" || path === "/yonetim/") return yonetimLoginPage("");
  return new Response("Unauthorized", { status: 401, headers: { "cache-control": "no-store" } });
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extra },
  });
}

function fail(status, message) {
  const e = new Error(message);
  e.status = status;
  throw e;
}

function parseCari(body) {
  const ad = String(body.ad || "").trim();
  const aylik_ciro = Number(body.aylik_ciro);
  const not = String(body.not || "").trim();
  if (!ad) fail(400, "Cari adı gerekli");
  if (!Number.isFinite(aylik_ciro) || aylik_ciro < 0) fail(400, "Aylık fatura geçersiz");
  return { ad, aylik_ciro, not };
}

function parseKlinikNot(body) {
  const klinik = String(body.klinik || "").trim();
  if (!klinik) fail(400, "Klinik adı gerekli");
  const rawAylik = body.aylik_tahmini;
  let aylik_tahmini = null;
  if (rawAylik !== "" && rawAylik != null) {
    aylik_tahmini = Number(rawAylik);
    if (!Number.isFinite(aylik_tahmini) || aylik_tahmini < 0) fail(400, "Aylık tutar geçersiz");
  }
  return {
    klinik,
    tel: String(body.tel || "").trim(),
    tedarikci: String(body.tedarikci || "").trim(),
    urun_notu: String(body.urun_notu || "").trim(),
    aylik_tahmini,
  };
}

function canSahaWrite(user) {
  return user.role === "ortak" || user.role === "saha";
}

function seed() {
  const urunler = defaultUrunler();
  return {
    seq: Math.max(urunler.length, 2),
    catalog_version: CATALOG_VERSION,
    partners: [
      { id: 1, name: "Ayfer", share_pct: 50 },
      { id: 2, name: "Ramazan", share_pct: 50 },
    ],
    // Tedarik
    cariler: [],
    urunler,
    stok: [],
    siparisler: [],
    sevkiyatlar: [],
    faturalar: [],
    kasa: [],
    notes: [],
    klinik_notlar: [],
    vitrin_teklifler: [],
    maliyet: defaultMaliyet(),
    sik_kullanilan: defaultSikKullanilan(),
    sik_version: SIK_VERSION,
    // Dekorasyon / Mimari
    mim_musteriler: [],
    mim_projeler: [],
    mim_teklifler: [],
    mim_santiye: [],
    mim_kesif: [],
    mim_faturalar: [],
    mim_notes: [],
  };
}

async function load(env) {
  let state = (await env.KV.get("state", "json")) || seed();
  let dirty = false;

  if ((state.catalog_version || 0) < CATALOG_VERSION) {
    state.urunler = defaultUrunler();
    state.catalog_version = CATALOG_VERSION;
    state.seq = Math.max(state.seq || 0, state.urunler.length, 2);
    dirty = true;
  }

  if ((state.sik_version || 0) < SIK_VERSION) {
    state.sik_kullanilan = defaultSikKullanilan();
    state.sik_version = SIK_VERSION;
    dirty = true;
  }

  for (const key of [
    "mim_musteriler",
    "mim_projeler",
    "mim_teklifler",
    "mim_santiye",
    "mim_kesif",
    "mim_faturalar",
    "mim_notes",
  ]) {
    if (!Array.isArray(state[key])) {
      state[key] = [];
      dirty = true;
    }
  }

  if (!Array.isArray(state.cariler)) {
    state.cariler = [];
    dirty = true;
  }

  if (!Array.isArray(state.klinik_notlar)) {
    state.klinik_notlar = [];
    dirty = true;
  }

  if (!Array.isArray(state.vitrin_teklifler)) {
    state.vitrin_teklifler = [];
    dirty = true;
  }

  if (!state.maliyet || typeof state.maliyet !== "object") {
    state.maliyet = defaultMaliyet();
    dirty = true;
  } else {
    state.maliyet = { ...defaultMaliyet(), ...state.maliyet };
  }

  if (dirty) await save(env, state);
  return state;
}

function withAnalytics(state) {
  const urunler = enrichUrunler(state.urunler || [], state.maliyet);
  const op = operasyonOzet(state.maliyet);
  const ozet = portfolioSummary(urunler);
  const basa_bas = breakEven(state.maliyet, ozet);
  return {
    ...state,
    urunler,
    ozet,
    kategori_ozet: kategoriOzet(urunler),
    zeka: zekaOzet(urunler, state.maliyet),
    kiyas: buildKiyas(urunler, state.maliyet),
    operasyon_aylik: op.aylik_toplam,
    sabit_pct_ciro: op.sabit_pct_ciro,
    hedef_ciro: op.hedef_ciro,
    basa_bas,
    cari_portfoy: cariPortfoy(state.maliyet, ozet, state.cariler),
    sik_kullanilan: enrichSikKullanilan(state.sik_kullanilan || defaultSikKullanilan(), urunler),
    selcuk: selcukMenu(),
    selcuk_bakis: selcukBakis(),
    klinik_notlar: state.klinik_notlar || [],
    vitrin_teklifler: state.vitrin_teklifler || [],
  };
}

async function save(env, state) {
  await env.KV.put("state", JSON.stringify(state));
}

function handleVitrinTeklifReady(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) fail(400, 'Geçersiz talep');
  if (String(body.website || '').trim()) fail(400, 'Talep doğrulanamadı. Lütfen telefonla iletişime geçin.');
  const firma = String(body.firma || "").trim();
  const tel = String(body.tel || "").trim();
  const yetkili = String(body.yetkili || "").trim();
  const not = String(body.not || "").trim();
  const grup = String(body.grup || "").trim();
  const urun = String(body.urun || "").trim();
  if (firma.length < 2) fail(400, "Firma adı gerekli");
  if (!/^[+\d\s().-]+$/.test(tel) || tel.replace(/\D/g, "").length < 10 || tel.replace(/\D/g, "").length > 15 || tel.length > 40) fail(400, "Geçerli bir telefon numarası yazın");
  if (not.length > 2000 || urun.length > 300 || firma.length > 120 || yetkili.length > 80 || grup.length > 80) {
    fail(400, "Alan çok uzun");
  }
  return { firma, tel, yetkili, not, grup, urun };
}

async function handleVitrinTeklif(request, env, ctx) {
  const origin = request.headers.get('origin');
  if (origin && !['https://ferrapro.com','https://www.ferrapro.com'].includes(origin)) fail(403, 'Geçersiz kaynak');
  const rejected = await guardQuote(request, env);
  if (rejected) return rejected;
  const text = await readQuoteBody(request);
  let body;
  try { body = JSON.parse(text); } catch { fail(400, 'Geçersiz talep'); }
  const kayit = handleVitrinTeklifReady(body);
  const record = await storeQuote(env, kayit);
  measure(env, 'quote_saved', 'request');
  if (ctx?.waitUntil) ctx.waitUntil(notifyQuote(env, record));
  else await notifyQuote(env, record);
  return json({ ok: true });
}

async function handleApi(request, env, url) {
  const path = url.pathname;
  const method = request.method;

  if (path === "/api/login" && method === "POST") return login(request, env);
  if (path === "/api/logout" && method === "POST") {
    return json({ ok: true }, 200, { "set-cookie": cookie("session", "", 0) });
  }
  if (path === "/api/me" && method === "GET") {
    const user = await requireUser(request, env);
    return json({ user });
  }
  if (path === "/api/state" && method === "GET") {
    const user = await requireUser(request, env);
    const state = await load(env);
    if (user.role === "sunum") {
      return json({
        urunler: (state.urunler || []).filter((u) => u.aktif !== false),
        catalog_version: state.catalog_version,
      });
    }
    return json(withAnalytics({ ...state, vitrin_teklifler: await readQuotes(env, state.vitrin_teklifler) }));
  }
  if (path === "/api/maliyet" && method === "POST") {
    const user = await requireUser(request, env);
    if (user.role !== "ortak") fail(403, "Yetkisiz");
    const body = await request.json();
    const state = await load(env);
    const next = { ...defaultMaliyet(), ...(state.maliyet || {}) };
    for (const key of Object.keys(defaultMaliyet())) {
      if (body[key] != null && body[key] !== "") next[key] = Number(body[key]);
    }
    if (next.hedef_aylik_ciro < 1000) fail(400, "Hedef aylık ciro en az 1.000 ₺ olmalı");
    if (next.cari_aylik_ciro < 1000) fail(400, "Büyük cari faturası en az 1.000 ₺ olmalı");
    if (next.cari_kucuk_ciro < 1000) fail(400, "Küçük cari faturası en az 1.000 ₺ olmalı");
    if (next.min_brut_pct < 0 || next.min_brut_pct > 80) fail(400, "Brüt % 0–80 aralığında olmalı");
    if (next.tedarikci_vade_gun < 0 || next.tedarikci_vade_gun > 120) fail(400, "Tedarikçi vadesi 0–120 gün");
    if (next.stok_gun_cekirdek < 1 || next.stok_gun_cekirdek > 90) fail(400, "Çekirdek stok günü 1–90");
    state.maliyet = next;
    await save(env, state);
    return json({ ok: true, maliyet: next, ...withAnalytics(state) });
  }
  if (path === "/api/catalog" && method === "GET") {
    const user = await requireUser(request, env);
    if (!["sunum", "ortak", "saha"].includes(user.role)) fail(403, "Yetkisiz");
    const state = await load(env);
    return json({
      urunler: (state.urunler || []).filter((u) => u.aktif !== false),
      catalog_version: state.catalog_version,
    });
  }
  if (path === "/api/cari" && method === "POST") {
    const user = await requireUser(request, env);
    if (user.role !== "ortak") fail(403, "Yetkisiz");
    const body = await request.json();
    const kayit = parseCari(body);
    const state = await load(env);
    state.cariler = state.cariler || [];
    state.cariler.unshift({
      id: ++state.seq,
      ...kayit,
      by: user.name,
      created_at: new Date().toISOString(),
    });
    await save(env, state);
    return json({ ok: true, cariler: state.cariler, ...withAnalytics(state) });
  }
  if (path === "/api/cari" && method === "PUT") {
    const user = await requireUser(request, env);
    if (user.role !== "ortak") fail(403, "Yetkisiz");
    const body = await request.json();
    const id = Number(body.id);
    const state = await load(env);
    const c = (state.cariler || []).find((x) => x.id === id);
    if (!c) fail(404, "Cari bulunamadı");
    Object.assign(c, parseCari(body));
    await save(env, state);
    return json({ ok: true, cariler: state.cariler, ...withAnalytics(state) });
  }
  if (path === "/api/cari" && method === "DELETE") {
    const user = await requireUser(request, env);
    if (user.role !== "ortak") fail(403, "Yetkisiz");
    const body = await request.json();
    const id = Number(body.id);
    const state = await load(env);
    state.cariler = (state.cariler || []).filter((x) => x.id !== id);
    await save(env, state);
    return json({ ok: true, cariler: state.cariler, ...withAnalytics(state) });
  }
  if (path === "/api/note" && method === "POST") {
    const user = await requireUser(request, env);
    if (user.role !== "ortak") fail(403, "Yetkisiz");
    const body = await request.json();
    const text = String(body.text || "").trim();
    if (!text) fail(400, "Not boş olamaz");
    const state = await load(env);
    state.notes = state.notes || [];
    state.notes.unshift({
      id: ++state.seq,
      text,
      by: user.name,
      created_at: new Date().toISOString(),
    });
    await save(env, state);
    return json({ ok: true, notes: state.notes });
  }

  if (path === "/api/klinik-not" && method === "POST") {
    const user = await requireUser(request, env);
    if (!canSahaWrite(user)) fail(403, "Yetkisiz");
    const kayit = parseKlinikNot(await request.json());
    const state = await load(env);
    state.klinik_notlar = state.klinik_notlar || [];
    const now = new Date().toISOString();
    state.klinik_notlar.unshift({
      id: ++state.seq,
      ...kayit,
      by: user.name,
      created_at: now,
      updated_at: now,
    });
    await save(env, state);
    return json({ ok: true, klinik_notlar: state.klinik_notlar });
  }
  if (path === "/api/klinik-not" && method === "PUT") {
    const user = await requireUser(request, env);
    if (!canSahaWrite(user)) fail(403, "Yetkisiz");
    const body = await request.json();
    const id = Number(body.id);
    const state = await load(env);
    const row = (state.klinik_notlar || []).find((x) => x.id === id);
    if (!row) fail(404, "Kayıt bulunamadı");
    Object.assign(row, parseKlinikNot(body), { updated_at: new Date().toISOString() });
    await save(env, state);
    return json({ ok: true, klinik_notlar: state.klinik_notlar });
  }
  if (path === "/api/klinik-not" && method === "DELETE") {
    const user = await requireUser(request, env);
    if (!canSahaWrite(user)) fail(403, "Yetkisiz");
    const body = await request.json();
    const id = Number(body.id);
    const state = await load(env);
    state.klinik_notlar = (state.klinik_notlar || []).filter((x) => x.id !== id);
    await save(env, state);
    return json({ ok: true, klinik_notlar: state.klinik_notlar });
  }

  fail(404, "Bulunamadı");
}

async function login(request, env) {
  const body = await request.json();
  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");

  let user = null;
  if (username === "ayfer" && password && password === env.AYFER_PASSWORD) {
    user = { id: 1, name: "Ayfer", role: "ortak" };
  } else if (
    (username === "ramazan" || username === "admin") &&
    password &&
    password === env.RAMAZAN_PASSWORD
  ) {
    user = { id: 2, name: "Ramazan", role: "ortak" };
  } else if (username === "selcuk" && password && password === env.SELCUK_PASSWORD) {
    user = { id: 4, name: "Selçuk", role: "saha" };
  } else if (username === "sunum" && password && password === env.SUNUM_PASSWORD) {
    user = { id: 3, name: "Sunum", role: "sunum" };
  } else {
    fail(401, "Kullanıcı veya parola hatalı");
  }

  const token = await makeSession(env, user);
  return json({ user }, 200, { "set-cookie": cookie("session", token, SESSION_TTL) });
}

async function requireUser(request, env) {
  const token = getCookie(request, "session");
  if (!token) fail(401, "Giriş gerekli");
  const user = await parseSession(env, token);
  if (!user) fail(401, "Oturum geçersiz");
  if (user.id === 4) user.role = "saha";
  return user;
}

function cookie(name, value, maxAge) {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ];
  if (maxAge === 0) parts.push("Max-Age=0");
  else parts.push(`Max-Age=${maxAge}`);
  return parts.join("; ");
}

function getCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

async function makeSession(env, user) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const payload = btoa(JSON.stringify({ ...user, exp }));
  const sig = await hmac(env.SESSION_SECRET, payload);
  return `${payload}.${sig}`;
}

async function parseSession(env, token) {
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig) return null;
  if ((await hmac(env.SESSION_SECRET, payload)) !== sig) return null;
  try {
    const data = JSON.parse(atob(payload));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: data.id, name: data.name, role: data.role };
  } catch {
    return null;
  }
}

async function hmac(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret || "missing"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
