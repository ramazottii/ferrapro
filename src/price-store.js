// One strongly consistent private store; revision checks prevent stale tabs overwriting prices.
export class PriceStore {
  constructor(ctx) { this.storage = ctx.storage; }
  async fetch(request) {
    const reply = (data, status = 200) => Response.json(data, { status, headers: { 'cache-control': 'no-store' } });
    if (request.method === 'GET') return reply(await this.storage.get('catalog') || { revision: 0, prices: {}, extras: [] });
    if (request.method !== 'PUT') return reply({ error: 'Yöntem desteklenmiyor' }, 405);
    let body;
    try {
      const raw = await request.text();
      if (raw.length > 750000) throw Error('Kayıt çok büyük');
      body = JSON.parse(raw);
      validatePrices(body);
    } catch { return reply({ error: 'Geçersiz fiyat kaydı' }, 400); }
    return this.storage.transaction(async tx => {
      const current = await tx.get('catalog') || { revision: 0, prices: {}, extras: [] };
      if (body.revision !== current.revision) return reply({ error: 'Başka bir oturum kayıtları değiştirdi. Yerel yedeğiniz korundu; sayfayı yenileyip güncel fiyatları kontrol edin.' }, 409);
      const next = { revision: current.revision + 1, prices: body.prices, extras: body.extras, updatedAt: new Date().toISOString() };
      await tx.put('previous', current);
      await tx.put('catalog', next);
      return reply(next);
    });
  }
}

export function validatePrices(body) {
  if (!Number.isSafeInteger(body.revision) || body.revision < 0 || !body.prices || Array.isArray(body.prices) || typeof body.prices !== 'object' || !Array.isArray(body.extras) || body.extras.length > 1000) throw Error('schema');
  if (Object.keys(body.prices).length > 5000) throw Error('count');
  for (const [id, row] of Object.entries(body.prices)) {
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id) || !row || typeof row !== 'object' || Array.isArray(row)) throw Error('row');
    for (const [key, value] of Object.entries(row)) {
      if (key === 'birim') { if (typeof value !== 'string' || value.length > 40) throw Error('unit'); }
      else if (!['maliyet', 'listeFiyat', 'idealSatis', 'dipSatis', 'fiyat'].includes(key) || (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0))) throw Error('price');
    }
  }
  for (const row of body.extras) {
    if (!row || typeof row.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(row.id) || typeof row.ad !== 'string' || row.ad.length > 500) throw Error('extra');
  }
}
