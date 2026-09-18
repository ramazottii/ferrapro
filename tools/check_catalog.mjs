import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script=readFileSync(new URL('../public/site.js',import.meta.url),'utf8');
const context=vm.createContext({
  document:{querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null},
});
vm.runInContext(script,context);
const classify=(group,text)=>vm.runInContext(`altBul(${JSON.stringify(group)},${JSON.stringify(text)}).id`,context);
assert.equal(classify('Temizlik','Doğal Güç Mop Beyaz 1×50'),'arac');
assert.equal(classify('Temizlik','Sıvı el sabunu 5 L'),'sabun');
assert.equal(classify('Temizlik','Kıvamlı çamaşır suyu 20 kg'),'camasir-suyu');
assert.equal(classify('Temizlik','Çamaşır Deterjanı 10 kg'),'camasir');
assert.equal(classify('Mutfak','Çay 1 kg'),'kahve');
assert.equal(classify('Mutfak','Ice Tea Şeftali 330 ml'),'icecek');
const data=JSON.parse(readFileSync(new URL('../public/katalog.json',import.meta.url),'utf8'));
for(const row of data.urunler) assert.notEqual(classify(row.kategori,row.satir),'diger',row.satir);

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
