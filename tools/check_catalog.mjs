import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const script=readFileSync(new URL('../public/site.js',import.meta.url),'utf8');
const context=vm.createContext({
  document:{querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null},
});
vm.runInContext(script,context);
const classify=(group,text,alt)=>vm.runInContext(`altBul(${JSON.stringify(group)},${JSON.stringify(text)},${JSON.stringify(alt)}).id`,context);
assert.equal(classify('Temizlik','Doğal Güç Mop Beyaz 1×50'),'arac');
assert.equal(classify('Temizlik','Sıvı el sabunu 5 L'),'sabun');
assert.equal(classify('Temizlik','Sıvı el sabunu 1 L'),'sabun');
assert.equal(classify('Temizlik','Köpük el sabunu 1 L'),'sabun');
assert.equal(classify('Temizlik','Sıvı sabun dispenseri'),'sabun');
assert.equal(classify('Temizlik','Kıvamlı çamaşır suyu 20 kg'),'camasir-suyu');
assert.equal(classify('Temizlik','Çamaşır Deterjanı 10 kg'),'camasir');
assert.equal(classify('Mutfak','Çay 1 kg'),'kahve');
assert.equal(classify('Mutfak','Ice Tea Şeftali 330 ml'),'icecek');
const data=JSON.parse(readFileSync(new URL('../public/katalog.json',import.meta.url),'utf8'));
for(const row of data.urunler) assert.notEqual(classify(row.kategori,row.satir,row.alt),'diger',row.satir);
for(const row of data.urunler){
  assert.match(row.gorsel,/^\/img\/[a-z0-9/-]+\.webp$/);
  assert.ok(existsSync(new URL('../public'+row.gorsel,import.meta.url)),row.gorsel);
  assert.ok(['temsili','kategori'].includes(row.gorselTuru));
}
for(const [group,min] of Object.entries({Hijyen:80,Temizlik:99,Mutfak:90,Ambalaj:45,PC:50,Sağlık:45}))assert.ok(data.urunler.filter(r=>r.kategori===group).length>=min,group);

const stationery=data.urunler.filter(r=>r.kategori==='Kırtasiye');
assert.ok(stationery.length >= 50);
assert.equal(new Set(stationery.map(r=>r.satir)).size,stationery.length);
assert.equal(new Set(stationery.map(r=>r.alt)).size,11);
assert.equal(classify('Hijyen','Islak havlu 90’lı','islak'),'islak');
assert.equal(classify('Hijyen','Yüzey temizlik havlusu','islak'),'islak');
assert.equal(vm.runInContext('MARKA_TERCIHLERI.islak.join(",")',context),'Espiga,Polente,Sleepy,Selpak,Freshmaker,Papilion,Deep Fresh,Komili');
assert.equal(vm.runInContext(`markaTercihSatir(${JSON.stringify('Islak havlu 90’lı')},${JSON.stringify('Espiga')})`,context),'Islak havlu 90’lı · Marka tercihi: Espiga');
assert.equal(vm.runInContext(`markaTercihSatir(${JSON.stringify('Islak havlu 90’lı')},${JSON.stringify('Fark etmez')})`,context),'Islak havlu 90’lı · Marka tercihi: fark etmez');
assert.equal(classify('Hijyen','Peçete 100’lü','pecete'),'pecete');
assert.equal(classify('Hijyen','Z peçete','pecete'),'pecete');
assert.equal(classify('Hijyen','Renkli peçete','pecete'),'pecete');
assert.equal(classify('Hijyen','Z kat havlu dispenseri','dispenser'),'dispenser');
assert.equal(classify('Hijyen','Masaüstü peçete dispenseri','dispenser'),'dispenser');
assert.equal(classify('Hijyen','Rulo havlu 6’lı','havlu'),'havlu');
assert.equal(classify('Hijyen','Dev rulo havlu','havlu'),'havlu');
assert.equal(vm.runInContext('MARKA_TERCIHLERI.havlu.join(",")',context),'Solo,Selpak,Papia,Familia,Focus,Forest,Rulopak');
assert.ok(!vm.runInContext('ALTLAR.Hijyen.map(x=>x.id).join(",")',context).split(',').includes('mendil'));
assert.equal(data.urunler.filter(r=>r.alt==='mendil').length,0);
for (const row of data.urunler.filter(r=>/çöp poşet/i.test(r.satir))) {
  if (/mavi/i.test(row.satir)) assert.match(row.gorsel,/copblue\.webp$/);
  else if (/şeffaf/i.test(row.satir)) assert.match(row.gorsel,/copclear\.webp$/);
  else if (/siyah/i.test(row.satir)) assert.match(row.gorsel,/copblack\.webp$/);
}
assert.ok(data.urunler.some(r=>r.satir.startsWith('Sıvı El Sabunu 5 L')&&r.gorsel.endsWith('soap5l.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Sıvı El Sabunu 1 L')&&r.gorsel.endsWith('soap.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Köpük El Sabunu')&&r.gorsel.endsWith('foamsoap.webp')));
assert.ok(data.urunler.some(r=>r.satir==='Sıvı Sabun Dispenseri'&&r.gorsel.endsWith('soapdisp.webp')));
assert.ok(data.urunler.some(r=>r.satir==='Köpük Sabun Dispenseri'&&r.gorsel.endsWith('foamdisp.webp')));
assert.equal(data.urunler.filter(r=>r.satir==='Sıvı el sabunu').length,0);
assert.equal(vm.runInContext('urunAdiYazi("Sıvı el sabunu 1 L · 1 litre pompalı şişe")',context),'Sıvı El Sabunu 1 L · 1 Litre Pompalı Şişe');
for (const row of data.urunler) assert.equal(row.satir, vm.runInContext(`urunAdiYazi(${JSON.stringify(row.satir)})`,context), row.satir);
const bleach=data.urunler.filter(r=>/çamaşır suyu/i.test(r.satir));
assert.equal(bleach.length,5);
assert.ok(bleach.every(r=>classify(r.kategori,r.satir,r.alt)==='camasir-suyu'));
assert.ok(bleach.every(r=>!r.gorsel.endsWith('cleaner.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Sıvı Çamaşır Suyu 1 L')&&r.gorsel.endsWith('bleach1l.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Sıvı Çamaşır Suyu 5 L')&&r.gorsel.endsWith('bleach5l.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Sıvı Çamaşır Suyu 20 L')&&r.gorsel.endsWith('bleach20l.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Kıvamlı Çamaşır Suyu 4 kg')&&r.gorsel.endsWith('thickbleach4.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Kıvamlı Çamaşır Suyu 20 kg')&&r.gorsel.endsWith('thickbleach20.webp')));
const wash=data.urunler.filter(r=>/çamaşır/i.test(r.satir)&&!/çamaşır suyu/i.test(r.satir));
assert.equal(wash.length,6);
assert.ok(wash.every(r=>classify(r.kategori,r.satir,r.alt)==='camasir'));
assert.ok(wash.every(r=>!r.gorsel.endsWith('detergent.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Toz Çamaşır Deterjanı 10 kg')&&r.gorsel.endsWith('washpowder.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Sıvı Çamaşır Deterjanı 3 L')&&r.gorsel.endsWith('washliq3.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Sıvı Çamaşır Deterjanı 5 L')&&r.gorsel.endsWith('washliq5.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Kapsül Çamaşır Deterjanı')&&r.gorsel.endsWith('washcaps.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Çamaşır Yumuşatıcısı 5 L')&&r.gorsel.endsWith('softener.webp')));
assert.ok(data.urunler.some(r=>r.satir.startsWith('Çamaşır Leke Çıkarıcı')&&r.gorsel.endsWith('stainrem.webp')));
assert.equal(data.urunler.filter(r=>r.satir.startsWith('Toz Deterjan 10 kg')).length,0);

// Exercise the real public form handler without network or private customer data.
async function checkSubmission(ok) {
  let submit, sent, reset=false, cleared=false;
  const elements=Object.fromEntries(Object.entries({firma:'TEST',yetkili:'',tel:'00000000000',grup:'',ilce:'',not:''}).map(([key,value])=>[key,{value}]));
  const button={disabled:false}; const msg={};
  const form={elements,addEventListener:(type,handler)=>{submit=handler;},querySelector:()=>button,reset:()=>{reset=true;}};
  const c=vm.createContext({URLSearchParams,location:{search:''},
    document:{querySelectorAll:()=>[],querySelector:()=>null,getElementById:id=>id==='siparis-form'?form:id==='msg'?msg:null},
    window:{FerraInterest:{summary:()=> 'Temizlik: El Sabunları',clear:()=>{cleared=true;}}},
    fetch:async (_url,options)=>{sent=JSON.parse(options.body);return {ok,headers:{get:()=> 'application/json'},json:async()=>ok?{ok:true}:{error:'test failure'}};},
  });
  vm.runInContext(script,c);
  await submit({preventDefault(){}});
  assert.equal(sent.not,'Temizlik: El Sabunları');
  assert.equal(reset,ok);
  assert.equal(cleared,ok,'Selection must clear only after confirmed success');
  assert.equal(button.disabled,false);
}
await checkSubmission(true);
await checkSubmission(false);
console.log(`PASS: ${data.urunler.length} catalogue rows classified; cleaning/tea regressions; form includes selections and preserves them on failure.`);
