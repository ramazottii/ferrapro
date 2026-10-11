import { IsleyisStore } from './isleyis-store.js';
export { IsleyisStore };

const COOKIE = 'fp_isleyis';
const TTL = 8 * 60 * 60;

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()); } catch { return ''; }
    }
  }
  return '';
}

function timingEqual(a, b) {
  const x = String(a);
  const y = String(b);
  const n = Math.max(x.length, y.length);
  let diff = x.length ^ y.length;
  for (let i = 0; i < n; i++) diff |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
  return diff === 0;
}

async function hmac(secret, payload) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret || 'missing'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function cookieHeader(token, url, clear = false) {
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  if (clear) return `${COOKIE}=; Path=/yonetim/isleyis; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
  return `${COOKIE}=${token}; Path=/yonetim/isleyis; Max-Age=${TTL}; HttpOnly; SameSite=Lax${secure}`;
}

function loginPage(error = '') {
  const msg = error ? `<p class="err">${error}</p>` : '';
  return new Response(`<!DOCTYPE html>
<html lang="tr"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/>
<title>Ferrapro işleyiş</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F4F6F8;color:#0F172A;font-family:"DM Sans",system-ui,sans-serif}
form{width:min(92vw,380px);background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:28px 24px}
img{display:block;height:36px;margin:0 auto 16px}
h1{margin:0 0 6px;font-size:1.15rem;text-align:center}
p{margin:0 0 16px;color:#64748B;font-size:.9rem;text-align:center}
.err{color:#B91C1C}
label{display:block;font-size:.8rem;font-weight:650;margin-bottom:6px}
input{width:100%;box-sizing:border-box;min-height:44px;padding:10px 12px;border:1px solid #E2E8F0;border-radius:8px;font:inherit}
button{margin-top:14px;width:100%;min-height:44px;border:0;border-radius:8px;background:#0F172A;color:#fff;font:inherit;font-weight:650;cursor:pointer}
</style></head><body>
<form method="post" action="/yonetim/isleyis/giris">
<img src="/logo/ferrapro-header.png?v=1" alt="FerraPro">
<h1>Ferrapro işleyiş</h1>
<p>Yalnız ortaklar. Ayrı şifre.</p>
${msg}
<label for="password">Şifre</label>
<input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
<button type="submit">Giriş</button>
</form></body></html>`, {
    status: error ? 401 : 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function makeToken(env) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const stamp = await hmac(env.SESSION_SECRET, 'isleyis-pin|' + env.ISLEYIS_PASSWORD);
  const sig = await hmac(env.SESSION_SECRET, `isleyis|${exp}|${stamp}`);
  return `${exp}.${sig}`;
}

async function validToken(env, token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 2) return false;
  const exp = Number(parts[0]);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const stamp = await hmac(env.SESSION_SECRET, 'isleyis-pin|' + env.ISLEYIS_PASSWORD);
  const sig = await hmac(env.SESSION_SECRET, `isleyis|${exp}|${stamp}`);
  return timingEqual(parts[1], sig);
}

async function servePage(env, request, url) {
  let response = await env.ASSETS.fetch(new Request(new URL('/yonetim/isleyis/index.html', url), { method: 'GET' }));
  const loc = response.headers.get('location');
  if (response.status >= 300 && response.status < 400 && loc) {
    response = await env.ASSETS.fetch(new Request(new URL(loc, url), { method: 'GET' }));
  }
  const headers = new Headers(response.headers);
  headers.set('cache-control', 'no-store');
  headers.delete('location');
  const status = response.status >= 300 && response.status < 400 ? 200 : response.status;
  return new Response(response.body, { status, headers });
}

export async function notifyIsleyis(env, text) {
  const sid = env.TWILIO_ACCOUNT_SID;
  const auth = env.TWILIO_AUTH_TOKEN;
  const from = env.TWILIO_WHATSAPP_FROM;
  const to = env.ISLEYIS_WHATSAPP_TO || 'whatsapp:+905307161877';
  if (!sid || !auth || !from) return { status: 'disabled' };
  const body = new URLSearchParams({ From: from, To: to, Body: String(text).slice(0, 900) });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + btoa(sid + ':' + auth), 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return { status: res.ok ? 'sent' : 'failed', code: res.status };
}

export async function handleIsleyis(request, env, url) {
  const path = url.pathname.replace(/\/+$/, '') || '/yonetim/isleyis';
  const pin = String(env.ISLEYIS_PASSWORD || '');
  const unavailable = () => new Response('İşleyiş girişi henüz tanımlı değil.', { status: 503, headers: { 'cache-control': 'no-store' } });
  if (!pin || !env.SESSION_SECRET) return unavailable();

  if (path === '/yonetim/isleyis/cikis') {
    return new Response(null, { status: 302, headers: { location: new URL('/yonetim/isleyis/', url).toString(), 'set-cookie': cookieHeader('', url, true) } });
  }

  if (path === '/yonetim/isleyis/giris' && request.method === 'POST') {
    if (request.headers.get('origin') && request.headers.get('origin') !== url.origin) {
      return new Response('Geçersiz kaynak', { status: 403, headers: { 'cache-control': 'no-store' } });
    }
    if (Number(request.headers.get('content-length') || 0) > 4096) return new Response('İstek çok büyük', { status: 413 });
    const body = await request.text();
    const given = new URLSearchParams(body).get('password') || '';
    if (!timingEqual(given, pin)) return loginPage('Şifre yanlış.');
    const token = await makeToken(env);
    return new Response(null, { status: 302, headers: { location: new URL('/yonetim/isleyis/', url).toString(), 'set-cookie': cookieHeader(token, url) } });
  }

  const token = readCookie(request, COOKIE);
  const ok = await validToken(env, token);
  if (!ok) {
    if (path === '/yonetim/isleyis' || path === '/yonetim/isleyis/') return loginPage('');
    return new Response('Unauthorized', { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  if (path === '/yonetim/isleyis' || path === '/yonetim/isleyis/') return servePage(env, request, url);

  if (path.startsWith('/yonetim/isleyis/api/')) {
    if (!env.ISLEYIS_STORE) return Response.json({ error: 'İşleyiş kaydı henüz etkin değil' }, { status: 503, headers: { 'cache-control': 'no-store' } });
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      if (request.headers.get('origin') && request.headers.get('origin') !== url.origin) {
        return Response.json({ error: 'Geçersiz kaynak' }, { status: 403, headers: { 'cache-control': 'no-store' } });
      }
    }
    const store = env.ISLEYIS_STORE.get(env.ISLEYIS_STORE.idFromName('ferrapro-isleyis'));
    const response = await store.fetch(request);
    if (request.method === 'POST' && path.endsWith('/hareketler') && response.ok) {
      try {
        const saved = await response.clone().json();
        const last = saved.movements?.[0];
        if (last) await notifyIsleyis(env, `FerraPro işleyiş: ${last.tur} ${last.tutar} TL — ${last.aciklama}`);
      } catch { /* bildirilemezse kayıt yine durur */ }
    }
    return response;
  }

  return env.ASSETS.fetch(request);
}
