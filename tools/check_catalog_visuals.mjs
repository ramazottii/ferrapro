import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.resolve(process.argv[2]||'public');
const data=JSON.parse(fs.readFileSync(path.join(root,'katalog.json'))).urunler;
const manifest=JSON.parse(fs.readFileSync(new URL('catalog-visual-manifest.json',import.meta.url)));
for(const r of manifest.records){
 assert.equal(data.find(p=>p.id===r.id)?.gorsel,r.image,`Stale image mapping: ${r.id}`);
 assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,r.image))).digest('hex'),r.sha256,`Stale image file: ${r.id}`);
}
const context=vm.createContext({document:{querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null}});
vm.runInContext(fs.readFileSync(path.join(root,'site.js'),'utf8'),context);
context.products=data;
const visible=vm.runInContext('katalogVitrin(products).filter(p=>p.alt==="C3").map(katalogSunum)',context);
assert.equal(visible.length,23);
assert.equal(visible.slice(-3).map(p=>p.id).join(','),'p-439,p-599,p-664');
assert.equal(new Set(visible.map(p=>p.id)).size,23);
for(const p of visible)if(!['p-371','p-372'].includes(p.id)){
 assert.equal(p.olcu,'');assert.equal(p.kapasite,'');assert.doesNotMatch(p.ad,/\d+\s*(LT|CM)\b/i);
}
const pages=JSON.parse(fs.readFileSync(path.join(root,'catalog-pages.json')));
assert.equal(pages['g=C&a=C3'].links.length,23);
for(const p of data.filter(p=>p.alt==='C3'))assert.ok(pages['u='+p.id],`Lost legacy URL: ${p.id}`);
console.log(`Visual release guard passed: ${manifest.records.length} image mappings, 23 bin types, all legacy URLs.`);
