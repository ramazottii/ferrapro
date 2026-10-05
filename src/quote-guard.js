// Only used by the anonymous contact endpoint, never by panel authentication.
export async function guardQuote(request, env, limiter = env.QUOTE_RATE_LIMITER, scope = 'quote') {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return rejected(403, 'Geçersiz kaynak');
  if (!limiter) return null; // Isolated tests and static previews.
  const ip = request.headers.get('cf-connecting-ip') || 'local';
  const bytes = new TextEncoder().encode(`${scope}:${env.SESSION_SECRET}:${new Date().toISOString().slice(0,10)}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const key = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join('');
  try {
    const { success } = await limiter.limit({key});
    if (!success) return rejected(429, 'Kısa sürede çok fazla deneme yapıldı. Bir dakika sonra yeniden deneyin.', 60);
  } catch {
    return rejected(503, 'Talep hizmeti geçici olarak kullanılamıyor. Lütfen yeniden deneyin veya bizi arayın.', 60);
  }
  return null;
}

function rejected(status, error, retry) {
  return Response.json({error}, {status, headers:{'cache-control':'no-store', ...(retry ? {'retry-after':String(retry)} : {})}});
}

export async function readQuoteBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw Object.assign(new Error('Geçersiz talep'), {status:400});
  const chunks = []; let size = 0;
  while (true) {
    const {done,value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 12000) {
      await reader.cancel();
      throw Object.assign(new Error('Talep çok uzun'), {status:413});
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}
