import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import worker from '../src/worker.js';
import {managementTestEnv} from './management-test-env.mjs';
const env={...managementTestEnv(),YONETIM_PASSWORD:randomUUID(),SESSION_SECRET:randomUUID(),ASSETS:{fetch:async()=>new Response('private')}};
env.ISLEYIS_PASSWORD=env.YONETIM_PASSWORD; // Isolation must hold even if passwords match.
const send=(path,options={})=>worker.fetch(new Request('https://ferrapro.com/yonetim/'+path,options),env);
const login=()=>send('isleyis/giris',{method:'POST',body:new URLSearchParams({password:env.ISLEYIS_PASSWORD})});
const cookieOf=r=>r.headers.get('set-cookie').split(';')[0];
const access=cookie=>send('isleyis/private.js',{headers:{cookie}});
const a=await login(),b=await login();
assert.equal(a.status,302);assert.equal(b.status,302);
const cookie=cookieOf(a),other=cookieOf(b);
assert.notEqual(cookie,other);
assert.match(a.headers.get('set-cookie'),/Path=\/yonetim\/isleyis; Max-Age=28800; HttpOnly; SameSite=Lax; Secure/);
assert.equal((await access(cookie)).status,200);
const management=await send('giris',{method:'POST',body:new URLSearchParams({password:env.YONETIM_PASSWORD})});
const managementCookie=cookieOf(management);
assert.equal((await access(managementCookie.replace('fp_yonetim=','fp_isleyis='))).status,401,'Renamed management cookie cannot enter business module');
assert.equal((await send('catalog.json',{headers:{cookie:cookie.replace('fp_isleyis=','fp_yonetim=')}})).status,401,'Renamed business cookie cannot enter management');
assert.equal((await send('isleyis/cikis',{headers:{cookie,origin:'https://unrelated.example'}})).status,403);
assert.equal((await access(cookie)).status,200);
assert.equal((await send('isleyis/cikis',{headers:{cookie}})).status,302);
assert.equal((await access(cookie)).status,401,'Copied session is revoked');
assert.equal((await access(other)).status,200,'Independent session survives');
assert.equal((await send('catalog.json',{headers:{cookie:managementCookie}})).status,200,'Business logout does not revoke management');
const now=Date.now;
try { Date.now=()=>now()+8*60*60*1000+1000; assert.equal((await access(other)).status,401,'Server expiry enforced'); }
finally { Date.now=now; }
env.ISLEYIS_PASSWORD=randomUUID();
assert.equal((await access(other)).status,401,'Password rotation invalidates session');
const fresh=cookieOf(await login());env.SESSION_SECRET=randomUUID();
assert.equal((await access(fresh)).status,401,'Secret rotation invalidates session');
assert.equal((await access('fp_isleyis=%ZZ')).status,401);
assert.equal((await send('isleyis/giris',{method:'POST',headers:{origin:'https://unrelated.example'},body:'password=test'})).status,403);
const oversized=await send('isleyis/giris',{method:'POST',body:new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('password='+'x'.repeat(5000)));c.close();}}),duplex:'half'});
assert.equal(oversized.status,413);assert.equal(oversized.headers.get('cache-control'),'no-store');
const keys=[];env.YONETIM_RATE_LIMITER.limit=async({key})=>{keys.push(key);return {success:true};};
await login();await send('giris',{method:'POST',body:'password=wrong'});assert.notEqual(keys[0],keys[1],'Separate throttle keys');
env.YONETIM_RATE_LIMITER.limit=async()=>({success:false});
const limited=await login();assert.equal(limited.status,429);assert.equal(limited.headers.get('retry-after'),'60');
env.YONETIM_RATE_LIMITER.limit=async()=>{throw Error('offline');};assert.equal((await login()).status,503);
env.YONETIM_RATE_LIMITER.limit=async()=>({success:true});
const binding=env.MANAGEMENT_SESSIONS;
env.MANAGEMENT_SESSIONS={idFromName:n=>n,get:()=>({fetch:async()=>{throw Error('offline');}})};
for(const r of [await login(),await access(other),await send('isleyis/cikis',{headers:{cookie:other}})]){
  assert.equal(r.status,503);assert.equal(r.headers.get('set-cookie'),null);assert.equal(r.headers.get('cache-control'),'no-store');
}
env.MANAGEMENT_SESSIONS=binding;
for(const key of ['ISLEYIS_PASSWORD','SESSION_SECRET','MANAGEMENT_SESSIONS','YONETIM_RATE_LIMITER']){
  const saved=env[key];delete env[key];assert.equal((await login()).status,503);env[key]=saved;
}
console.log('PASS: business login throttling, bounded streamed input, isolated random sessions, expiry, rotation, logout revocation and fail-closed outages.');
