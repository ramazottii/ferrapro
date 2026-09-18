// Isolated Node integration check. No network calls or production KV access.
// Exercises Worker handlers with an in-memory KV adapter, not Cloudflare runtime.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import worker from '../src/worker.js';

const memory = new Map();
const env = {
  SESSION_SECRET: randomUUID(),
  RAMAZAN_PASSWORD: randomUUID(),
  KV: {
    async get(key, type) {
      const value = memory.get(key);
      return value == null ? null : type === 'json' ? JSON.parse(value) : value;
    },
    async put(key, value) { memory.set(key, value); },
  },
  ASSETS: { async fetch() { return new Response('test asset'); } },
};
const send = (host, path, options = {}) => worker.fetch(new Request(`https://${host}${path}`, options), env);
const post = body => ({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
const quote = { firma:'YEREL TEST', tel:'00000000000', yetkili:'Test', grup:'Hijyen', not:'Havlu: 3 koli\nPeçete: 2 koli\nTeslimat ilçesi: Ataşehir' };
assert.equal((await send('ferrapro.com','/api/teklif',post({...quote,tel:'1'}))).status,400);
assert.equal((await send('ferrapro.com','/api/teklif',post({...quote,not:'x'.repeat(2001)}))).status,400);
assert.equal(memory.size,0,'Invalid requests must not write data');
const accepted = await send('ferrapro.com','/api/teklif',post(quote));
assert.equal(accepted.status,200);
assert.deepEqual(await accepted.json(),{ok:true});
assert.equal(JSON.parse(memory.get('state')).vitrin_teklifler.length,1);
for (const path of ['/api/state','/api/catalog','/panel/']) {
  assert.equal((await send('ferrapro.com',path)).status,404);
}
assert.equal((await send('tedarik.ferranoi.com','/api/state')).status,401);
assert.equal((await send('tedarik.ferranoi.com','/api/login',post({username:'selcuk',password:'1234'}))).status,401);
const login = await send('tedarik.ferranoi.com','/api/login',post({username:'ramazan',password:env.RAMAZAN_PASSWORD}));
assert.equal(login.status,200);
const cookie = login.headers.get('set-cookie');
assert.match(cookie,/HttpOnly/);
assert.match(cookie,/Secure/);
const state = await send('tedarik.ferranoi.com','/api/state',{headers:{cookie:cookie.split(';')[0]}});
assert.equal(state.status,200);
assert.equal((await state.json()).vitrin_teklifler[0].not,quote.not,'Panel API must retain full multiline request');
env.SELCUK_PASSWORD=randomUUID();
assert.equal((await send('tedarik.ferranoi.com','/api/login',post({username:'selcuk',password:env.SELCUK_PASSWORD}))).status,200);
console.log('PASS: validation, isolated quote persistence, panel API readback, public/private routes and configured-password login.');
