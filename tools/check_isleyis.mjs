import assert from 'node:assert/strict';
import worker from '../src/worker.js';
import { IsleyisStore } from '../src/isleyis-store.js';
import { managementTestEnv } from './management-test-env.mjs';

const data = new Map();
let queue = Promise.resolve();
const storage = {
  get: async k => structuredClone(data.get(k)),
  put: async (k, v) => data.set(k, structuredClone(v)),
  delete: async k => data.delete(k),
  transaction(fn) {
    const task = queue.then(() => fn(storage));
    queue = task.catch(() => {});
    return task;
  },
};
const store = new IsleyisStore({ storage });
const env = {
  ...managementTestEnv(),
  SESSION_SECRET: 'isleyis-test-secret',
  YONETIM_PASSWORD: 'yonetim-only',
  ISLEYIS_PASSWORD: 'ortak-sifre',
  ISLEYIS_STORE: { idFromName: n => n, get: () => store },
  ASSETS: { fetch: async () => new Response('<html>isleyis</html>', { headers: { 'content-type': 'text/html' } }) },
};

const send = (path, options = {}) => worker.fetch(new Request('https://ferrapro.com' + path, options), env, {});

assert.equal((await send('/yonetim/isleyis/api/durum')).status, 401);
const page = await send('/yonetim/isleyis/');
assert.equal(page.status, 200);
assert.match(await page.text(), /Ferrapro işleyiş/);

const bad = await send('/yonetim/isleyis/giris', { method: 'POST', body: 'password=yanlis' });
assert.equal(bad.status, 401);

const yonetimLogin = await send('/yonetim/giris', { method: 'POST', body: 'password=yonetim-only' });
const yCookie = yonetimLogin.headers.get('set-cookie').split(';')[0];
assert.equal((await send('/yonetim/isleyis/api/durum', { headers: { cookie: yCookie } })).status, 401);

const login = await send('/yonetim/isleyis/giris', { method: 'POST', body: 'password=ortak-sifre' });
assert.equal(login.status, 302);
const cookie = login.headers.get('set-cookie').split(';')[0];
assert.match(login.headers.get('set-cookie'), /Path=\/yonetim\/isleyis/);
assert.equal((await send('/yonetim/api/fiyatlar', { headers: { cookie } })).status, 401);

const csrf = await send('/yonetim/isleyis/api/ortaklar', {
  method: 'POST',
  headers: { cookie, origin: 'https://evil.example', 'content-type': 'application/json' },
  body: JSON.stringify({ ad: 'X' }),
});
assert.equal(csrf.status, 403);

const add = await send('/yonetim/isleyis/api/ortaklar', {
  method: 'POST',
  headers: { cookie, origin: 'https://ferrapro.com', 'content-type': 'application/json' },
  body: JSON.stringify({ ad: 'Ayfer Adatepe', pay: 50, telefon: '05307161877' }),
});
assert.equal(add.status, 200, await add.text());

const move = await send('/yonetim/isleyis/api/hareketler', {
  method: 'POST',
  headers: { cookie, origin: 'https://ferrapro.com', 'content-type': 'application/json' },
  body: JSON.stringify({ tur: 'gider', tutar: 1200, aciklama: 'Ofis kirası', tarih: '2026-10-08' }),
});
assert.equal(move.status, 200);

const form = new FormData();
form.set('ad', 'Vergi levhası');
form.set('tur', 'vergi-levhasi');
form.set('dosya', new File([Uint8Array.from([37, 80, 68, 70])], 'vergi.pdf', { type: 'application/pdf' }));
const up = await send('/yonetim/isleyis/api/evrak', { method: 'POST', headers: { cookie, origin: 'https://ferrapro.com' }, body: form });
assert.equal(up.status, 200, await up.clone().text());
const listed = await (await send('/yonetim/isleyis/api/durum', { headers: { cookie } })).json();
assert.equal(listed.partners[0].ad, 'Ayfer Adatepe');
assert.equal(listed.movements[0].tur, 'gider');
assert.equal(listed.documents[0].tur, 'vergi-levhasi');
const docId = listed.documents[0].id;
const file = await send('/yonetim/isleyis/api/evrak/' + docId, { headers: { cookie } });
assert.equal(file.status, 200);
assert.equal(file.headers.get('content-type'), 'application/pdf');

assert.equal((await send('/yonetim/isleyis/api/evrak/' + docId, { method: 'DELETE', headers: { cookie, origin: 'https://ferrapro.com' } })).status, 200);
const after = await (await send('/yonetim/isleyis/api/durum', { headers: { cookie } })).json();
assert.equal(after.documents.length, 0);

delete env.ISLEYIS_PASSWORD;
assert.equal((await send('/yonetim/isleyis/giris', { method: 'POST', body: 'password=ortak-sifre' })).status, 503);

console.log('PASS: isleyis separate password, isolated from yonetim, partners/movements/documents.');
