// Run locally with an Analytics Engine read-scoped token; never expose in frontend.
const token=process.env.CLOUDFLARE_ANALYTICS_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
if(!token)throw Error('Set CLOUDFLARE_ANALYTICS_TOKEN in your local environment.');
const days=Number(process.argv[2]||30);
if(!Number.isInteger(days)||days<1||days>90)throw Error('Days must be 1–90.');
const sql=`SELECT blob1 AS event, blob2 AS page, SUM(_sample_interval * double1) AS count FROM ferrapro_events WHERE timestamp >= NOW() - INTERVAL '${days}' DAY GROUP BY event, page ORDER BY count DESC FORMAT JSON`;
const response=await fetch('https://api.cloudflare.com/client/v4/accounts/9f0d39ce0db57f09bc1769c9ddf0c344/analytics_engine/sql',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:sql});
if(!response.ok)throw Error(`Analytics read failed (${response.status}); verify read permission and dataset deployment.`);
console.log(JSON.stringify(await response.json(),null,2));
