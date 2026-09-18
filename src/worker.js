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

const SESSION_TTL = 60 * 60 * 24 * 30;

function isVitrinHost(host) {
  return host === "ferrapro.com" || host === "www.ferrapro.com";
}

function isPanelHost(host) {
  return host === "tedarik.ferranoi.com";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (isVitrinHost(url.hostname)) {
      if (url.pathname === "/api/teklif" && request.method === "POST") {
        try {
          return await handleVitrinTeklif(request, env);
        } catch (err) {
          return json({ error: err.message || "Sunucu hatası" }, err.status || 500);
        }
      }
      if (url.pathname.startsWith("/panel") || url.pathname.startsWith("/api/")) {
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
      return env.ASSETS.fetch(request);
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
  const firma = String(body.firma || "").trim();
  const tel = String(body.tel || "").trim();
  const yetkili = String(body.yetkili || "").trim();
  const not = String(body.not || "").trim();
  const grup = String(body.grup || "").trim();
  const urun = String(body.urun || "").trim();
  if (firma.length < 2) fail(400, "Firma adı gerekli");
  if (tel.replace(/\D/g, "").length < 10) fail(400, "Telefon gerekli");
  if (not.length > 2000 || urun.length > 300 || firma.length > 120 || yetkili.length > 80) {
    fail(400, "Alan çok uzun");
  }
  return { firma, tel, yetkili, not, grup, urun };
}

async function handleVitrinTeklif(request, env) {
  const kayit = handleVitrinTeklifReady(await request.json());
  const state = await load(env);
  state.vitrin_teklifler = state.vitrin_teklifler || [];
  state.vitrin_teklifler.unshift({
    id: ++state.seq,
    ...kayit,
    created_at: new Date().toISOString(),
  });
  if (state.vitrin_teklifler.length > 200) state.vitrin_teklifler.length = 200;
  await save(env, state);
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
    return json(withAnalytics(state));
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
