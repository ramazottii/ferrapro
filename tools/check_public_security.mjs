import assert from 'node:assert/strict';
import worker from '../src/worker.js';
let calls=0;
const env={ASSETS:{fetch:async()=>{calls++;return new Response('asset',{headers:{'content-type':'text/html','cache-control':'no-store'}});}}};
for(const path of ['/','/yonetim/','/yonetim/giris','/urunler?g=D&a=D1','/siparis']){
  const before=calls;
  const r=await worker.fetch(new Request('http://ferrapro.com'+path),env);
  assert.equal(r.status,308);assert.equal(r.headers.get('location'),'https://ferrapro.com'+path);assert.equal(calls,before);
}
const post=await worker.fetch(new Request('http://ferrapro.com/api/teklif',{method:'POST',body:'test'}),env);
assert.equal(post.status,308,'No insecure POST may be processed');
const www=await worker.fetch(new Request('https://www.ferrapro.com/urunler?g=D&a=D1'),env);
assert.equal(www.status,308);assert.equal(www.headers.get('location'),'https://ferrapro.com/urunler?g=D&a=D1');
const page=await worker.fetch(new Request('https://ferrapro.com/'),env);
assert.equal(await page.text(),'asset');assert.equal(page.headers.get('cache-control'),'no-store');
assert.match(page.headers.get('strict-transport-security'),/max-age=/);
assert.match(page.headers.get('content-security-policy'),/frame-ancestors 'none'/);
assert.equal(page.headers.get('x-content-type-options'),'nosniff');
const denied=await worker.fetch(new Request('https://ferrapro.com/yonetim/api/fiyatlar'),env);
assert.equal(denied.status,401);assert.equal(denied.headers.get('cache-control'),'no-store');
assert.equal(denied.headers.get('x-frame-options'),'DENY');
const panel=await worker.fetch(new Request('https://tedarik.ferranoi.com/'),env);
assert.equal(panel.status,302);assert.equal(panel.headers.get('location'),'https://tedarik.ferranoi.com/panel/');assert.equal(panel.headers.get('content-security-policy'),null);
const local=await worker.fetch(new Request('http://localhost/'),env);
assert.equal(local.status,200);assert.equal(local.headers.get('strict-transport-security'),null);
console.log('PASS: Ferrapro HTTPS, canonical read redirects, security headers, no-store and Ferranoi isolation.');
