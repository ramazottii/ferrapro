const PREFIX='vitrin-followup:';
export const QUOTE_STAGES=['new','contacted','quoted','closed'];
export function validateFollowup(body) {
  if(!body || !/^[a-zA-Z0-9_-]{1,80}$/.test(String(body.id||'')))throw Object.assign(new Error('Geçersiz talep'),{status:400});
  if(!QUOTE_STAGES.includes(body.stage))throw Object.assign(new Error('Geçersiz aşama'),{status:400});
  const note=String(body.note||'').trim(),next_contact=String(body.next_contact||'');
  if(note.length>2000)throw Object.assign(new Error('Not en fazla 2000 karakter olabilir'),{status:400});
  if(next_contact && (!/^\d{4}-\d{2}-\d{2}$/.test(next_contact) || !Number.isFinite(Date.parse(next_contact)) || new Date(next_contact).toISOString().slice(0,10)!==next_contact))throw Object.assign(new Error('Geçersiz takip tarihi'),{status:400});
  return {quote_id:String(body.id),stage:body.stage,note,next_contact:body.stage==='closed'?'':next_contact};
}
export async function saveFollowup(env,fields,user) {
  const event={...fields,id:crypto.randomUUID(),at:new Date().toISOString(),by:user.name};
  // Each update is independent; simultaneous notes cannot overwrite each other.
  await env.KV.put(PREFIX+fields.quote_id+':'+event.id,JSON.stringify(event));
  return event;
}
export async function attachFollowups(env,quotes) {
  const byId=new Map(quotes.map(q=>[String(q.id),[]]));let cursor;
  do {
    const page=await env.KV.list({prefix:PREFIX,...(cursor?{cursor}:{})});
    for(let i=0;i<page.keys.length;i+=20){
      const events=await Promise.all(page.keys.slice(i,i+20).map(k=>env.KV.get(k.name,'json')));
      for(const event of events)if(event && byId.has(event.quote_id))byId.get(event.quote_id).push(event);
    }
    cursor=page.list_complete?null:page.cursor;
  }while(cursor);
  return quotes.map(q=>{const history=byId.get(String(q.id)).sort((a,b)=>b.at.localeCompare(a.at)||b.id.localeCompare(a.id));return {...q,followup:history[0]||{stage:'new',note:'',next_contact:''},followup_history:history};});
}
