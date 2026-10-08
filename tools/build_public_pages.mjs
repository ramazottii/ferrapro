// Derive discovery metadata only from the already-public catalogue and taxonomy.
import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const base=new URL('../public/',import.meta.url);
const context=vm.createContext({document:{querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null}});
vm.runInContext(readFileSync(new URL('site.js',base),'utf8'),context);
const {groups,subs,guides}=vm.runInContext('({groups:GRUPLAR,subs:ALTLAR,guides:KATEGORI_REHBERLERI})',context);
const products=JSON.parse(readFileSync(new URL('katalog.json',base),'utf8')).urunler.filter(x=>x.aktif!==false);
const pages={};
const formatMeasure = value => vm.runInContext(`olcuYazi(${JSON.stringify(value || '')})`,context);
const formatName = p => {
 const name=vm.runInContext(`urunAdiYazi(${JSON.stringify(p.ad || '')})`,context);
 return p.marka && !name.toLocaleLowerCase('tr').startsWith(p.marka.toLocaleLowerCase('tr')) ? p.marka+' '+name : name;
};
for(const g of groups){
 // Public categories may use legacy names; classification remains shared.
 const actual=products.filter(x=>vm.runInContext(`grupAnahtar(${JSON.stringify(g.g)}).includes(${JSON.stringify(x.kategori)})`,context));
 if(!actual.length)continue;
 pages[`g=${g.g}`]={name:g.ad,description:`${g.ad} seçeneklerini inceleyin. İşletmeniz için ürün veya miktar seçmeden görüşme talebi bırakabilirsiniz.`,path:`/urunler?g=${g.g}`};
 for(const s of subs[g.g])if(actual.some(x=>x.alt===s.id))pages[`g=${g.g}&a=${s.id}`]={name:s.ad,description:`${s.ad}: ${g.ad.toLocaleLowerCase('tr')} grubundaki ürünleri inceleyin; ihtiyacınıza uygun seçenekleri birlikte değerlendirelim.`,path:`/urunler?g=${g.g}&a=${s.id}`};
 for(const p of actual){
  const name=formatName(p);
  const details=[formatMeasure(p.olcu),formatMeasure(p.kapasite),p.malzeme,p.renk,p.ambalajAdedi].filter(Boolean).join(' · ');
  pages[`u=${p.id}`]={name,description:`${name}${details?' · '+details:''}. Ürün özellikleri ve tedarik seçenekleri için FerraPro ile görüşün.`,path:`/urunler?u=${encodeURIComponent(p.id)}`,image:p.gorsel,group:g.ad,groupPath:`/urunler?g=${g.g}`,sub:subs[g.g].find(s=>s.id===p.alt)?.ad,subPath:`/urunler?g=${g.g}&a=${p.alt}`};
 }
 const productLinks = list => list.map(p=>({name:formatName(p),path:`/urunler?u=${encodeURIComponent(p.id)}`}));
 pages[`g=${g.g}`].links=productLinks(actual);
 if(guides[g.g])pages[`g=${g.g}`].guide=guides[g.g];
 for(const s of subs[g.g])if(pages[`g=${g.g}&a=${s.id}`])pages[`g=${g.g}&a=${s.id}`].links=productLinks(actual.filter(p=>p.alt===s.id));
}
function output(name,content){
 if(process.argv.includes('--check')){
  if(readFileSync(new URL(name,base),'utf8').replace(/\r\n/g,'\n')!==content.replace(/\r\n/g,'\n'))throw new Error(name+' güncel değil. npm run build:public çalıştırın.');
 }else writeFileSync(new URL(name,base),content);
}
output('catalog-pages.json',JSON.stringify(pages));
const urls=['/','/urunler','/sektorler','/hakkimizda','/referanslar','/iletisim',...Object.values(pages).map(p=>p.path)];
output('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(path=>'  <url><loc>https://ferrapro.com'+path.replaceAll('&','&amp;')+'</loc></url>').join('\n')+'\n</urlset>\n');
console.log(`Generated ${Object.keys(pages).length} public catalogue pages and ${urls.length} sitemap URLs.`);
