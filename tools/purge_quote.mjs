// Explicit single-record disposal after identity/policy review. No bulk deletion.
// Default dry run does not call Cloudflare; --apply requires an approved case ID.
import fs from 'node:fs';
import crypto from 'node:crypto';
const [id,caseId,flag]=process.argv.slice(2);
if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id||''))throw Error('Provide the exact UUID of a new quote. Legacy panel state is unsupported.');
if(!/^[A-Za-z0-9_-]{3,80}$/.test(caseId||''))throw Error('Provide an approved disposal case ID without personal data.');
if(flag && flag!=='--apply')throw Error('Unknown option');
if(flag!=='--apply'){console.log('DRY RUN: one quote, its follow-up history and notification status; no network request, no deletion. Add --apply only after documented approval.');process.exit(0);}
const token=process.env.CLOUDFLARE_API_TOKEN;if(!token)throw Error('Missing environment token');
const base='https://api.cloudflare.com/client/v4/accounts/9f0d39ce0db57f09bc1769c9ddf0c344/storage/kv/namespaces/cb3d2d882810406285ed1364e4583ec3/values/';
const results=[];
// Enumerate only this reviewed record's notes. Pause edits during disposal.
let cursor='';const followupKeys=[];
do {
 const response=await fetch(base.replace(/values\/$/,'keys')+'?prefix='+encodeURIComponent('vitrin-followup:'+id+':')+(cursor?'&cursor='+encodeURIComponent(cursor):''),{headers:{Authorization:`Bearer ${token}`}});
 const page=await response.json();if(!response.ok||!page.success)throw Error('Cannot enumerate follow-up history; nothing deleted.');
 followupKeys.push(...page.result.map(k=>k.name));cursor=page.result_info?.cursor||'';
}while(cursor);
for(const key of followupKeys){
 const response=await fetch(base+encodeURIComponent(key),{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
 results.push({scope:'followup',status:response.status,ok:response.ok});
}
for(const prefix of ['vitrin-quote:','vitrin-notification:']){
 const r=await fetch(base+encodeURIComponent(prefix+id),{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
 results.push({scope:prefix,status:r.status,ok:r.ok});
}
fs.mkdirSync('output/privacy-operations',{recursive:true});
const audit={at:new Date().toISOString(),caseId,recordHash:crypto.createHash('sha256').update(id).digest('hex'),results};
fs.appendFileSync('output/privacy-operations/disposal.jsonl',JSON.stringify(audit)+'\n');
console.log(JSON.stringify({ok:results.every(r=>r.ok),audit:'output/privacy-operations/disposal.jsonl',note:'KV visibility may lag. Separately check legacy state, mail, exports and backups.'}));
if(results.some(r=>!r.ok))process.exitCode=1;
