export const MANAGEMENT_TTL = 8 * 60 * 60;

// One object per random token. Strongly consistent deletion makes logout revoke it.
export class ManagementSessions {
  constructor(ctx) { this.storage = ctx.storage; }
  async fetch(request) {
    const reply = (ok, status=200) => Response.json({ok},{status,headers:{'cache-control':'no-store'}});
    if (request.method === 'PUT') {
      const {fingerprint} = await request.json();
      if (typeof fingerprint !== 'string' || !/^[a-f0-9]{64}$/.test(fingerprint)) return reply(false,400);
      const expires = Date.now() + MANAGEMENT_TTL * 1000;
      await this.storage.put('session',{fingerprint,expires});
      await this.storage.setAlarm(expires);
      return reply(true);
    }
    if (request.method === 'DELETE') { await this.storage.deleteAll(); return reply(true); }
    if (request.method !== 'POST') return reply(false,405);
    const {fingerprint} = await request.json();
    const session = await this.storage.get('session');
    if (!session || session.expires <= Date.now() || session.fingerprint !== fingerprint) return reply(false,401);
    return reply(true);
  }
  async alarm() { await this.storage.deleteAll(); }
}

export const managementReady = env => Boolean(env.YONETIM_PASSWORD && env.SESSION_SECRET && env.MANAGEMENT_SESSIONS && env.YONETIM_RATE_LIMITER);
export async function readManagementLogin(request) {
  if (!request.body) return '';
  const reader=request.body.getReader();const chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();throw new Error('oversize');}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  return new TextDecoder().decode(bytes);
}
async function digest(value) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export async function managementSession(env, token, method) {
  if (!/^[a-f0-9-]{73}$/.test(token)) return false;
  const name = await digest(token);
  const store = env.MANAGEMENT_SESSIONS.get(env.MANAGEMENT_SESSIONS.idFromName(name));
  const fingerprint = await digest(JSON.stringify([env.SESSION_SECRET,env.YONETIM_PASSWORD]));
  const response = await store.fetch(new Request('https://session.internal/',{method,body:method==='DELETE'?undefined:JSON.stringify({fingerprint})}));
  if (response.status >= 500) throw new Error('Session store unavailable');
  return response.ok;
}
