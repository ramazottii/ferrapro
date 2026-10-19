// Overlay only public catalogue assets onto a separately verified live baseline.
// Never copy src/worker.js, authentication, panel scripts, prices, or bindings.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const release=process.argv[2];
if(!release)throw Error('Usage: node tools/sync_catalog_release.mjs <verified-release-directory>');
const target=path.resolve(release,'public');
if(!fs.existsSync(target))throw Error('Prepare a current live baseline first');
execFileSync(process.execPath,['tools/check_catalog_visuals.mjs'],{stdio:'inherit'});
for(const file of ['katalog.json','catalog-pages.json','sitemap.xml','site.js','catalog-ui.js','urunler.html'])fs.copyFileSync('public/'+file,path.join(target,file));
const data=JSON.parse(fs.readFileSync('public/katalog.json')).urunler;
const images=new Set(data.map(p=>p.gorsel.split('?')[0]));
for(const match of fs.readFileSync('public/site.js','utf8').matchAll(/\/img\/[\w/-]+\.webp/g))images.add(match[0]);
for(const name of ['cop-poseti','sarf','kullan-at'])images.add('/img/products/daire-'+name+'-512.webp');
for(const file of images){const dest=path.join(target,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync('public'+file,dest);}
const management=path.join(target,'yonetim/catalog.json');
const old=JSON.parse(fs.readFileSync(management));
const map=new Map(data.map(p=>[p.id,p.gorsel]));
for(const p of old.urunler)if(map.has(p.id))p.gorsel=map.get(p.id);
fs.writeFileSync(management,JSON.stringify(old,null,2)+'\n');
execFileSync(process.execPath,['tools/check_catalog_visuals.mjs',target],{stdio:'inherit'});
console.log(`Synced ${images.size} catalogue/category images; Worker and panel untouched.`);
