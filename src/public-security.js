const publicHosts = new Set(['ferrapro.com', 'www.ferrapro.com']);

// Scope transport policy to Ferrapro: the shared Ferranoi panel is unchanged.
export function publicRedirect(request) {
  const url = new URL(request.url);
  if (!publicHosts.has(url.hostname)) return null;
  const canonicalRead = ['GET', 'HEAD'].includes(request.method) && url.hostname === 'www.ferrapro.com';
  if (url.protocol !== 'https:' || canonicalRead) {
    url.protocol = 'https:';
    // Keep write origins stable; browser navigation canonicalizes before forms load.
    if (['GET', 'HEAD'].includes(request.method)) url.hostname = 'ferrapro.com';
    return new Response(null, {status:308, headers:{location:url.toString(), 'cache-control':'no-store'}});
  }
  return null;
}

export function publicSecurityHeaders(request, response) {
  const url = new URL(request.url);
  if (!publicHosts.has(url.hostname)) return response;
  const headers = new Headers(response.headers);
  if (url.protocol === 'https:') headers.set('strict-transport-security','max-age=15552000');
  headers.set('x-content-type-options','nosniff');
  headers.set('referrer-policy','strict-origin-when-cross-origin');
  headers.set('x-frame-options','DENY');
  // No unsafe-inline relaxation: script restrictions need a separate nonce migration.
  headers.set('content-security-policy',"frame-ancestors 'none'; base-uri 'self'; object-src 'none'");
  headers.set('permissions-policy','camera=(), microphone=(), geolocation=()');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
