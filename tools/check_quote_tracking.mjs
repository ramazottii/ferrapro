import {managementTestEnv} from './management-test-env.mjs';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import worker from '../src/worker.js';
const data=new Map(),env={...managementTestEnv(),YONETIM_PASSWORD:randomUUID(),SESSION_SECRET:randomUUID(),ASSETS:{fetch:async request=>{
  const path=new URL(request.url).pathname;
  if(path.endsWith('.html')) return new Response(null,{status:307,headers:{location:'/yonetim/talepler/'}});
  return new Response('<!doctype html><title>Teklifler</title>',{headers:{'content-type':'text/html'}});
}},KV:{
 async get(k,type){const value=data.get(k);return value==null?null:type==='json'?JSON.parse(value):value;},async put(k,v){data.set(k,v);},
 async list({prefix,cursor}){const keys=[...data.keys()].filter(k=>k.startsWith(prefix)),start=Number(cursor||0),end=start+2;return {keys:keys.slice(start,end).map(name=>({name})),list_complete:end>=keys.length,cursor:String(end)};}
}};
const send=(path,body,cookie='',origin='https://ferrapro.com')=>worker.fetch(new Request('https://ferrapro.com'+path,{method:body?'POST':'GET',headers:{'content-type':'application/json',cookie,origin},...(body?{body:JSON.stringify(body)}:{})}),env);
const q={id:randomUUID(),firma:'ISOLATED TEST',tel:'00000000000',created_at:'2026-10-05T00:00:00Z'};data.set('vitrin-quote:'+q.id,JSON.stringify(q));
const update={id:q.id,stage:'contacted',note:'Test note',next_contact:'2026-10-20'};
assert.equal((await send('/yonetim/api/talepler')).status,401);
assert.equal((await send('/yonetim/api/takip',update)).status,401);
assert.match(await (await send('/yonetim/talepler')).text(),/name="next" value="\/yonetim\/talepler"/);
const login=await worker.fetch(new Request('https://ferrapro.com/yonetim/giris',{method:'POST',body:new URLSearchParams({password:env.YONETIM_PASSWORD,next:'/yonetim/talepler'})}),env);
assert.equal(login.headers.get('location'),'https://ferrapro.com/yonetim/talepler');const cookie=login.headers.get('set-cookie').split(';')[0];
const page=await send('/yonetim/talepler',null,cookie);assert.equal(page.status,200);assert.equal(page.headers.get('location'),null);assert.match(await page.text(),/Teklifler/);
assert.equal((await send('/yonetim/api/takip',update,cookie,'https://unrelated.example')).status,403);
for(const invalid of [{stage:'invalid'},{next_contact:'2026-02-31'},{note:'x'.repeat(2001)}])assert.equal((await send('/yonetim/api/takip',{...update,...invalid},cookie)).status,400);
assert.equal((await send('/yonetim/api/takip',{...update,id:'missing'},cookie)).status,404);
const responses=await Promise.all(Array.from({length:5},(_,i)=>send('/yonetim/api/takip',{...update,note:'Note '+i},cookie)));assert.ok(responses.every(r=>r.status===200));
assert.equal(data.has('state'),false);assert.deepEqual(JSON.parse(data.get('vitrin-quote:'+q.id)),q);
const response=await send('/yonetim/api/talepler',null,cookie);assert.equal(response.headers.get('cache-control'),'no-store');const result=await response.json();
assert.deepEqual(Object.keys(result),['talepler']);assert.equal(result.talepler[0].followup_history.length,5);assert.equal(new Set(result.talepler[0].followup_history.map(e=>e.note)).size,5);
assert.equal((await (await send('/yonetim/api/takip',{...update,stage:'closed'},cookie)).json()).event.next_contact,'');
data.set('state',JSON.stringify({vitrin_teklifler:[{id:123,firma:'LEGACY TEST'}],privateFinancialData:'never return'}));assert.equal((await send('/yonetim/api/takip',{...update,id:123},cookie)).status,200);assert.doesNotMatch(await (await send('/yonetim/api/talepler',null,cookie)).text(),/never return/);
const originalPassword=env.YONETIM_PASSWORD;delete env.YONETIM_PASSWORD;
const fallbackLogin=await worker.fetch(new Request('https://ferrapro.com/yonetim/giris',{method:'POST',body:new URLSearchParams({password:'unconfigured'})}),env);assert.equal(fallbackLogin.status,503);assert.equal(fallbackLogin.headers.get('set-cookie'),null);env.YONETIM_PASSWORD=originalPassword;
console.log('PASS: Ferrapro management authentication, private-only responses, CSRF, concurrent history, legacy IDs, closed dates and existing yonetim session access.');
