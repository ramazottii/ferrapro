// Facts come only from the public catalog; never import panel/pricing sources.
import fs from 'node:fs';
const file='public/katalog.json';
const catalog=JSON.parse(fs.readFileSync(file,'utf8'));
const provenance=[];
for(const p of catalog.urunler) {
  if(p.aciklama)continue;
  const label=[p.marka,p.urunTuru,p.ad].filter(Boolean).join(' ');
  const facts=[['Ölçü',p.olcu],['Kapasite',p.kapasite],['Malzeme',p.malzeme],['Renk',p.renk],['Ambalaj',p.ambalajAdedi]].filter(([,v])=>v).map(([k,v])=>`${k}: ${v}.`);
  p.aciklama=[label+'.',...facts].join(' ');
  provenance.push({id:p.id,source:'Mevcut halka açık katalog alanları',independentlyVerified:false});
}
const verified=[
  {id:'p-462',text:'Logitech M185 kablosuz mouse, 2,4 GHz bağlantı ve 1000 DPI optik izleme sunar. Katalogdaki renk seçeneği mavidir.',url:'https://support.logi.com/hc/en-za/articles/360023302074-M185-Technical-Specifications'},
  {id:'p-478',text:'Varta Longlife AA, 1,5 V alkalin pildir. Düşük ve sabit enerji ihtiyacı olan saat ve uzaktan kumanda gibi cihazlar için üretici tarafından önerilir. Cihazınızın pil tipiyle uyumunu kontrol edin.',url:'https://www.varta-ag.com/cz/spotrebitel/kategorie-produktu/baterie/alkaline/longlife-aa'},
];
for(const v of verified){const p=catalog.urunler.find(p=>p.id===v.id);if(!p)throw Error(v.id);p.aciklama=v.text;}
fs.writeFileSync(file,JSON.stringify(catalog,null,2)+'\n');
const managementFile='public/yonetim/catalog.json';
const management=JSON.parse(fs.readFileSync(managementFile,'utf8'));
const byId=new Map(catalog.urunler.map(p=>[p.id,p]));
for(const p of management.urunler)if(byId.has(p.id))p.aciklama=byId.get(p.id).aciklama;
fs.writeFileSync(managementFile,JSON.stringify(management,null,2)+'\n');
fs.writeFileSync('docs/product-content-sources.json',JSON.stringify({date:'2026-10-05',method:'Ürün özetleri mevcut katalog bilgilerini açık cümlelere dönüştürür; eksik teknik özelliklerin doğrulandığı anlamına gelmez.',verified,missing:catalog.urunler.filter(p=>!p.marka||!p.olcu||!p.ambalajAdedi).map(p=>({id:p.id,fields:['marka','olcu','ambalajAdedi'].filter(k=>!p[k]),note:'Alan ürüne uygulanıyorsa üretici/tedarikçi teyidi gerekir.'}))},null,2)+'\n');
console.log(`${catalog.urunler.length} descriptions; ${verified.length} manufacturer sources; no inferred missing specifications.`);
