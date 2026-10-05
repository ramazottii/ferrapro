import { guardQuote } from './quote-guard.js';
const EVENTS = new Set(['page_view','form_start','form_attempt','form_error','whatsapp_click','phone_click','search_empty']);
const PAGES = new Set(['home','catalog','request','contact','about','sectors','references','privacy','other']);
export function measure(env, event, page = 'other') {
  try { env.METRICS?.writeDataPoint({indexes:['ferrapro'], blobs:[event,page], doubles:[1]}); }
  catch { /* Measurement must never interrupt a visitor's request. */ }
}
export async function acceptMetric(request, env) {
  if (!['https://ferrapro.com','https://www.ferrapro.com'].includes(request.headers.get('origin'))) return new Response(null,{status:403});
  if (!env.METRICS) return new Response(null,{status:204});
  const rejected=await guardQuote(request,env,env.METRIC_RATE_LIMITER,'metrics');
  if(rejected)return rejected;
  if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1') return new Response(null,{status:204});
  if (Number(request.headers.get('content-length')) > 256) return new Response(null,{status:413});
  const reader=request.body?.getReader(); if (!reader) return new Response(null,{status:400});
  const parts=[]; let size=0;
  while(true) {
    const {done,value}=await reader.read(); if(done) break;
    size+=value.length; if(size>256){await reader.cancel();return new Response(null,{status:413});} parts.push(value);
  }
  const bytes=new Uint8Array(size); let offset=0;
  for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  let data; try {data=JSON.parse(new TextDecoder().decode(bytes));} catch{return new Response(null,{status:400});}
  if (!data || !EVENTS.has(data.event) || !PAGES.has(data.page) || Object.keys(data).some(k=>!['event','page'].includes(k))) return new Response(null,{status:400});
  // Fixed allowlists prevent accidental storage of URLs, search terms or form data.
  measure(env,data.event,data.page);
  return new Response(null,{status:204,headers:{'cache-control':'no-store'}});
}
