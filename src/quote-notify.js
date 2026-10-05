// Internal notification contains no phone, contact name or free-form message.
// A failed notification never turns a durably stored quote into a failed form.
export async function notifyQuote(env, record) {
  if (!env.QUOTE_EMAIL || !env.QUOTE_NOTIFY_TO || !env.QUOTE_NOTIFY_FROM) return {status:'disabled'};
  const destinations = String(env.QUOTE_NOTIFY_TO).split(',').map(s=>s.trim()).filter(Boolean);
  const outcomes = await Promise.allSettled(destinations.map(to => Promise.resolve().then(() => env.QUOTE_EMAIL.send({
      from:env.QUOTE_NOTIFY_FROM,
      to,
      subject:'FerraPro — yeni görüşme talebi',
      text:`Yeni bir görüşme talebi kaydedildi.\nKayıt: ${record.id}\nTarih: ${record.created_at}\n\nAyrıntılar için yetkili hesabınızla paneli açın:\nhttps://tedarik.ferranoi.com/panel/#/vitrin`,
    }))));
  const sent=outcomes.filter(x=>x.status==='fulfilled').length;
  const result = {status:sent===destinations.length?'sent':sent?'partial':'failed', sent, total:destinations.length, at:new Date().toISOString()};
  // Short-lived operational status; no duplicate copy of customer details.
  try { await env.KV.put('vitrin-notification:'+record.id, JSON.stringify(result), {expirationTtl:2592000}); }
  catch { console.error('quote_notification_status_unavailable'); }
  return result;
}
