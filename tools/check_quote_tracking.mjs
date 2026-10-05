import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import worker from '../src/worker.js';
import {attachFollowups} from '../src/quote-tracking.js';
const data=new Map(),env={SESSION_SECRET:randomUUID(),RAMAZAN_PASSWORD:randomUUID(),SUNUM_PASSWORD:randomUUID(),KV:{
 async get(k,type){const value=data.get(k);return value==null?null:type==='json'?JSON.parse(value):value;},
 async put(k,v){data.set(k,v);},
 async list({prefix,cursor}){const keys=[...data.keys()].filter(k=>k.startsWith(prefix)),start=Number(cursor||0),end=start+2;return {keys:keys.slice(start,end).map(name=>({name})),list_complete:end>=keys.length,cursor:String(end)};}
}};
const send=(path,body,cookie='',origin='https://tedarik.ferranoi.com')=>worker.fetch(new Request('https://tedarik.ferranoi.com'+path,{method:'POST',headers:{'content-type':'application/json',cookie,origin},body:JSON.stringify(body)}),env);
const q={id:randomUUID(),firma:'ISOLATED TEST',tel:'00000000000',created_at:'2026-10-05T00:00:00Z'};
data.set('vitrin-quote:'+q.id,JSON.stringify(q));
const update={id:q.id,stage:'contacted',note:'Test note',next_contact:'2026-10-20'};
assert.equal((await send('/api/vitrin-takip',update)).status,401);
const login=await send('/api/login',{username:'ramazan',password:env.RAMAZAN_PASSWORD});const cookie=login.headers.get('set-cookie').split(';')[0];
assert.equal((await send('/api/vitrin-takip',update,cookie,'https://unrelated.example')).status,403);
assert.equal((await send('/api/vitrin-takip',{...update,stage:'invalid'},cookie)).status,400);
assert.equal((await send('/api/vitrin-takip',{...update,next_contact:'2026-02-31'},cookie)).status,400);
assert.equal((await send('/api/vitrin-takip',{...update,note:'x'.repeat(2001)},cookie)).status,400);
assert.equal((await send('/api/vitrin-takip',{...update,id:'not-found'},cookie)).status,404);
data.delete('state'); // Loading for nonexistent legacy IDs may initialize an empty state.
const responses=await Promise.all(Array.from({length:5},(_,i)=>send('/api/vitrin-takip',{...update,note:'Note '+i},cookie)));
assert.ok(responses.every(r=>r.status===200));
assert.equal(data.has('state'),false,'New quote updates do not write shared panel state');
assert.deepEqual(JSON.parse(data.get('vitrin-quote:'+q.id)),q,'Original customer message is immutable');
let [tracked]=await attachFollowups(env,[q]);assert.equal(tracked.followup_history.length,5);assert.equal(tracked.followup.stage,'contacted');
assert.equal(new Set(tracked.followup_history.map(e=>e.note)).size,5,'Concurrent notes all retained');
const closed=await send('/api/vitrin-takip',{...update,stage:'closed'},cookie);assert.equal((await closed.json()).event.next_contact,'');
const viewer=await send('/api/login',{username:'sunum',password:env.SUNUM_PASSWORD});const viewerCookie=viewer.headers.get('set-cookie').split(';')[0];
assert.equal((await send('/api/vitrin-takip',update,viewerCookie)).status,403);
const publicAttempt=await worker.fetch(new Request('https://ferrapro.com/api/vitrin-takip',{method:'POST',body:JSON.stringify(update)}),env);assert.equal(publicAttempt.status,404);
data.set('state',JSON.stringify({vitrin_teklifler:[{id:123,firma:'LEGACY TEST'}]}));
assert.equal((await send('/api/vitrin-takip',{...update,id:123},cookie)).status,200,'Legacy numeric IDs supported');
console.log('PASS: quote tracking authorization, validation, immutable customer record, concurrent history, legacy IDs, closed-date clearing.');
