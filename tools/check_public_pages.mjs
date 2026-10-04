import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {publicPage} from '../src/public-pages.js';
const env={ASSETS:{async fetch(request){
 const path=new URL(request.url).pathname;
 const file=path==='/urunler'?'urunler.html':path==='/404'?'404.html':path.slice(1);
 try{return new Response(await readFile(new URL('../public/'+file,import.meta.url)),{headers:{'content-type':file.endsWith('.json')?'application/json':'text/html'}});}
 catch{return new Response(await readFile(new URL('../public/index.html',import.meta.url)),{headers:{'content-type':'text/html'}});}
}}};
const get=async(path,method='GET')=>{const url=new URL(path,'https://ferrapro.com');return publicPage(new Request(url,{method}),env,url);};
const product=await get('/urunler?g=A&a=A1&u=p-001');
const html=await product.text();
assert.equal(product.status,200);
assert.match(html,/<title>Espiga Fotoselli Havlu Kağıdı · FerraPro<\/title>/);
assert.match(html,/rel="canonical" href="https:\/\/ferrapro.com\/urunler\?u=p-001"/);
assert.match(html,/BreadcrumbList/);
assert.match(html,/id="liste"><p>Espiga/);
const sub=await (await get('/urunler?g=A&a=A1')).text();
assert.match(sub,/<title>Havlu ve Peçeteler · FerraPro/);
assert.match(sub,/g=A&amp;a=A1/);
assert.match(await (await get('/urunler?q=kagit')).text(),/noindex, follow/);
for(const path of ['/does-not-exist','/does-not-exist.html','/missing.webp','/urunler?u=missing'])assert.equal((await get(path)).status,404,path);
assert.match(await (await get('/does-not-exist')).text(),/Aradığınız sayfa burada değil/);
assert.equal((await get('/urunler?g=Hijyen')).status,200,'Legacy filters stay compatible');
assert.equal(await (await get('/urunler?u=p-001','HEAD')).text(),'');
const sitemap=await readFile(new URL('../public/sitemap.xml',import.meta.url),'utf8');
const pages=JSON.parse(await readFile(new URL('../public/catalog-pages.json',import.meta.url),'utf8'));
assert.equal((sitemap.match(/<loc>/g)||[]).length,Object.keys(pages).length+6);
assert.match(sitemap,/g=A&amp;a=A1/);
console.log('PASS: public product/category metadata, server content, sitemap, 404 and legacy compatibility.');
