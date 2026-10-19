// Keep administrative catalogue assets available while the public storefront is closed.
export function publicMaintenance(request, env) {
  if (String(env.PUBLIC_SITE_CLOSED) !== 'true') return null;
  const url = new URL(request.url);
  const readableAsset = ['GET','HEAD'].includes(request.method) && (
    ['/katalog.json','/catalog-pages.json','/robots.txt'].includes(url.pathname) ||
    /\.(?:css|js|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(url.pathname)
  );
  if (readableAsset) return null;
  const headers = {'cache-control':'no-store','retry-after':'3600','content-type':'text/html; charset=utf-8'};
  if (url.pathname.startsWith('/api/')) return Response.json({error:'Sitemiz geçici olarak kapalı. Lütfen daha sonra tekrar deneyin.'},{status:503,headers:{'cache-control':'no-store','retry-after':'3600'}});
  const html='<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FerraPro · Geçici olarak kapalı</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:18px/1.6 system-ui,sans-serif;color:#132344;background:#fff}main{max-width:34rem;padding:32px}h1{font-size:clamp(1.5rem,5vw,2rem);line-height:1.25}a{color:#235c80}</style></head><body><main><p>FERRAPRO</p><h1>Sitemiz geçici olarak kapalı.</h1><p>Bizimle iletişime geçmek için <a href="mailto:info@ferrapro.com">info@ferrapro.com</a> adresini kullanabilirsiniz.</p></main></body></html>';
  return new Response(request.method==='HEAD'?null:html,{status:503,headers});
}
