import {managementTestEnv} from './management-test-env.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import worker from '../src/worker.js';
const catalog=JSON.parse(fs.readFileSync('public/katalog.json','utf8')).urunler;
const ids=new Set(catalog.map(p=>p.id));
assert.equal(ids.size,catalog.length,'No duplicate product ids');
const baseline=JSON.parse(execFileSync('git',['show','c5e6904:public/katalog.json'],{encoding:'utf8'})).urunler;
// MAS Zoo variants explicitly removed at the user's request, 2026-10-16.
const removedIds=new Set(['p-227','p-228','p-229']);
for(const id of removedIds)assert.ok(!ids.has(id),'Removed MAS Zoo product: '+id);
for(const p of baseline.filter(p=>!removedIds.has(p.id)))assert.ok(ids.has(p.id),'Existing product retained: '+p.id);
for(const p of catalog){const image=p.gorsel?.split('?')[0];if(image?.startsWith('/'))assert.ok(fs.existsSync('public'+image),'Missing image: '+p.id);}
const pages=JSON.parse(fs.readFileSync('public/catalog-pages.json','utf8'));
assert.equal(Object.keys(pages).filter(k=>k.startsWith('u=')).length,catalog.filter(p=>p.aktif!==false).length);
for(const g of ['A','D','E'])assert.ok(pages['g='+g].guide,'Category guides retained');
const config=fs.readFileSync('wrangler.toml','utf8');
assert.match(config,/PUBLIC_SITE_CLOSED = "true"/);
const tags=[...config.matchAll(/^tag = "([^"]+)"/gm)].map(m=>m[1]);
assert.deepEqual(tags,['v1-price-store','v3-isleyis-store','v4-management-sessions'],'Preserve deployed v3 history, add sessions afterward');
let assetReads=0;
const env={...managementTestEnv(),PUBLIC_SITE_CLOSED:'true',ISLEYIS_PASSWORD:'isolated-test-password',SESSION_SECRET:'isolated-test-secret',ASSETS:{fetch:async()=>{assetReads++;return new Response('asset');}}};
const get=(path,options={},host='ferrapro.com')=>worker.fetch(new Request('https://'+host+path,options),env);
for(const path of ['/','/urunler?g=A','/urunler.html','/siparis','/sitemap.xml']){
 const before=assetReads;const r=await get(path);assert.equal(r.status,503,path);assert.equal(r.headers.get('retry-after'),'3600');assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(assetReads,before);
}
assert.equal((await get('/api/teklif',{method:'POST',body:'{}'})).status,503,'Closed site must not accept quotes');
assert.equal(await (await get('/',{method:'HEAD'})).text(),'');
assert.equal((await get('/yonetim/')).status,200,'Management login remains available');
assert.equal((await get('/yonetim/api/fiyatlar')).status,401,'Private prices remain protected');
assert.equal((await get('/yonetim/isleyis/api/durum')).status,401,'Business records remain protected');
for(const path of ['/katalog.json','/site.js','/img/products/test.webp'])assert.equal((await get(path)).status,200,'Management assets remain available');
assert.equal((await get('/',{},'tedarik.ferranoi.com')).status,302,'Ferranoi unchanged');
env.PUBLIC_SITE_CLOSED='false';assert.equal((await get('/')).status,200,'Opening requires explicit configuration change');
console.log('PASS: 629-product integration, original ids and images, category guides, deployed migration order, closure and private-route isolation.');
