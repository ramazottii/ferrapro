import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=fs.readFileSync('public/yonetim/yonetim.js','utf8').replace('  boot();',`  render=()=>{}; updateSaveBar=()=>{}; toast=message=>messages.push(message);
  globalThis.test={state,persist,saveAllPrices,reloadCatalog,applyOverlay,setRevision:r=>serverRevision=r};`);
const local=new Map();let fail=true;const alerts=[],messages=[],calls=[];
const context={messages,console,AbortSignal,setTimeout,clearTimeout,alert:m=>alerts.push(m),document:{body:{inert:false}},localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v),removeItem:k=>local.delete(k)},fetch:async(url,options)=>{calls.push({url,options});if(fail)return {ok:false,json:async()=>({error:'test failure'})};return {ok:true,json:async()=>({revision:2})};}};
vm.runInNewContext(source,context);const t=context.test;t.state.catalog={urunler:[{id:'p-001',maliyet:10,birim:'Adet'}]};t.state.drafts={'p-001':{maliyet:25,listeFiyat:null}};t.setRevision(1);
await t.saveAllPrices();assert.equal(messages.length,0);assert.ok(t.state.drafts['p-001']);assert.ok(local.get('ferrapro.yonetim.pending.v1'));assert.equal(context.document.body.inert,false);
fail=false;await t.saveAllPrices();assert.equal(messages.length,1);assert.equal(Object.keys(t.state.drafts).length,0);assert.equal(JSON.parse(local.get('ferrapro.yonetim.fiyat.v2'))['p-001'].maliyet,25);assert.equal(local.has('ferrapro.yonetim.pending.v1'),false);
assert.equal(t.applyOverlay({maliyet:10},{maliyet:null}).maliyet,null);
assert.equal(calls[0].options.method,'PUT');assert.equal(JSON.parse(calls[0].options.body).revision,1);
console.log('PASS: client failure retains draft and backup, no false success, retry acknowledgement, explicit null clearing.');
// Migration preserves original local values and never silently overwrites an established server catalog.
const catalog=JSON.parse(fs.readFileSync('public/katalog.json','utf8'));
const migrationLocal=new Map([['ferrapro.yonetim.fiyat.v2',JSON.stringify({'p-001':{maliyet:42,birim:'Adet'}})]]);
let server={revision:0,prices:{},extras:[]},writes=0;
const migrationContext={...context,messages:[],document:{body:{inert:false}},localStorage:{getItem:k=>migrationLocal.get(k)||null,setItem:(k,v)=>migrationLocal.set(k,v),removeItem:k=>migrationLocal.delete(k)},fetch:async(url,options={})=>({ok:true,json:async()=>{if(url==='/katalog.json')return catalog;if(url==='/yonetim/catalog.json')return {urunler:[]};if(options.method==='PUT'){writes++;const b=JSON.parse(options.body);server={...b,revision:server.revision+1};}return server;}})};
vm.runInNewContext(source,migrationContext);await migrationContext.test.reloadCatalog();assert.equal(writes,1);assert.equal(server.prices['p-001'].maliyet,42);assert.equal(JSON.parse(migrationLocal.get('ferrapro.yonetim.legacy-backup.v1')).fiyatlar['p-001'].maliyet,42);
migrationLocal.set('ferrapro.yonetim.fiyat.v2',JSON.stringify({'p-001':{maliyet:999}}));await migrationContext.test.reloadCatalog();assert.equal(writes,1);assert.equal(migrationContext.test.state.catalog.urunler.find(r=>r.id==='p-001').maliyet,42);
console.log('PASS: initial browser migration, immutable local backup, server wins over stale local prices.');
