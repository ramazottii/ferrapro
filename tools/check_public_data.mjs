import fs from 'node:fs';
import assert from 'node:assert/strict';
const publicRows=JSON.parse(fs.readFileSync('public/katalog.json')).urunler;
const managementRows=JSON.parse(fs.readFileSync('public/yonetim/catalog.json')).urunler;
const allowed=new Set(['id','ad','kategori','alt','marka','olcu','kapasite','malzeme','renk','ambalajAdedi','urunTuru','aciklama','not','aktif','gorsel','gorselTuru','sira','satir']);
const byId=new Map(publicRows.map(p=>[p.id,p]));
for(const p of publicRows){for(const key of Object.keys(p))assert.ok(allowed.has(key),`Unexpected public field ${key}`);assert.ok(p.aciklama);}
for(const p of managementRows){
  for(const key of ['fiyat','maliyet','listeFiyat','idealSatis','dipSatis'])assert.equal(Number(p[key]||0),0,'Public Git repository may contain only zero financial placeholders');
  for(const key of ['ad','not','aciklama','marka'])assert.equal(p[key],byId.get(p.id)?.[key],`Management seed ${p.id} differs from public metadata: ${key}`);
}
console.log('PASS: public field allowlist, descriptions, matching seed metadata, zero financial placeholders.');
