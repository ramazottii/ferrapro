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
for(const [group,min] of Object.entries({Hijyen:120,Temizlik:100,Mutfak:90,Ambalaj:45,PC:50,Sağlık:45}))assert.ok(data.urunler.filter(r=>r.kategori===group).length>=min,group);

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
