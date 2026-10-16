import {ManagementSessions} from '../src/management-sessions.js';
export function managementTestEnv(){
  const objects=new Map();
  return {YONETIM_RATE_LIMITER:{limit:async()=>({success:true})},MANAGEMENT_SESSIONS:{
    idFromName:n=>n,
    get(n){if(!objects.has(n)){const data=new Map();objects.set(n,new ManagementSessions({storage:{get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),deleteAll:async()=>data.clear(),setAlarm:async()=>{}}}));}return objects.get(n);}
  }};
}
