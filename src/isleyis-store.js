const MAX_DOC = 8 * 1024 * 1024;
const MAX_DOCS = 80;
const TYPES = new Set(['vergi-levhasi', 'imza-sirkuleri', 'ticaret-sicil', 'sozlesme', 'diger']);
const HAREKET = new Set(['gelir', 'gider', 'harcama', 'siparis']);
const DURUM = new Set(['beklemede', 'tamamlandi', 'iptal']);

// Bound the actual stream before JSON/multipart parsers allocate the whole body.
async function boundedRequest(request, limit) {
  const tooLarge = () => Object.assign(new Error('İstek boyut sınırını aşıyor'), {status:413});
  if (Number(request.headers.get('content-length') || 0) > limit) throw tooLarge();
  if (!request.body) return request;
  const reader=request.body.getReader(), chunks=[];
  let size=0;
  while(true){
    const {done,value}=await reader.read(); if(done) break;
    size+=value.byteLength;
    if(size>limit){await reader.cancel();throw tooLarge();}
    chunks.push(value);
  }
  const body=new Uint8Array(size);let offset=0;
  for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.byteLength;}
  return new Request(request.url,{method:request.method,headers:request.headers,body});
}

function emptyState() {
  return { revision: 0, partners: [], movements: [], documents: [] };
}

function id(prefix) {
  return prefix + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

export class IsleyisStore {
  constructor(ctx) { this.storage = ctx.storage; }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const reply = (data, status = 200, extra = {}) => new Response(
      extra.raw ? data : JSON.stringify(data),
      { status, headers: { 'cache-control': 'no-store', ...(extra.headers || { 'content-type': 'application/json; charset=utf-8' }) } },
    );
    try {
      if (request.method === 'POST') request = await boundedRequest(request, path.endsWith('/evrak') ? MAX_DOC + 64 * 1024 : 64 * 1024);
      if (request.method === 'GET' && path.endsWith('/durum')) {
        const state = await this.storage.get('state') || emptyState();
        return reply({ ...state, documents: (state.documents || []).map(d => ({ ...d, hasFile: true })) });
      }
      if (request.method === 'GET' && /\/evrak\/([^/]+)$/.test(path)) {
        const docId = path.split('/').pop();
        const state = await this.storage.get('state') || emptyState();
        const meta = (state.documents || []).find(d => d.id === docId);
        const blob = await this.storage.get('blob:' + docId);
        if (!meta || !blob) return reply({ error: 'Evrak bulunamadı' }, 404);
        return new Response(blob, {
          status: 200,
          headers: {
            'cache-control': 'no-store',
            'content-type': meta.mime || 'application/octet-stream',
            'content-disposition': `attachment; filename="${encodeURIComponent(meta.fileName || meta.ad || 'evrak')}"`,
          },
        });
      }
      if (request.method === 'POST' && path.endsWith('/ortaklar')) {
        const body = await request.json();
        return this.mutate(state => {
          if (body.sil) {
            state.partners = state.partners.filter(p => p.id !== body.sil);
            return;
          }
          const ad = String(body.ad || '').trim();
          if (!ad || ad.length > 120) throw Error('Ortak adı gerekli');
          const pay = Number(body.pay);
          const sermaye = Number(body.sermaye);
          const row = {
            id: String(body.id || id('o-')),
            ad,
            gorev: String(body.gorev || '').trim().slice(0, 80),
            pay: Number.isFinite(pay) ? pay : 0,
            sermaye: Number.isFinite(sermaye) ? sermaye : 0,
            telefon: String(body.telefon || '').slice(0, 24),
            iban: String(body.iban || '').trim().slice(0, 34),
            not: String(body.not || '').slice(0, 500),
          };
          const i = state.partners.findIndex(p => p.id === row.id);
          if (i >= 0) state.partners[i] = row;
          else state.partners.push(row);
        });
      }
      if (request.method === 'POST' && path.endsWith('/hareketler')) {
        const body = await request.json();
        return this.mutate(state => {
          if (body.sil) {
            state.movements = state.movements.filter(m => m.id !== body.sil);
            return;
          }
          const tur = String(body.tur || '');
          const durum = String(body.durum || 'beklemede');
          const tutar = Number(body.tutar);
          const aciklama = String(body.aciklama || '').trim();
          if (!HAREKET.has(tur)) throw Error('Hareket türü geçersiz');
          if (!DURUM.has(durum)) throw Error('Durum geçersiz');
          if (!Number.isFinite(tutar) || tutar < 0) throw Error('Tutar geçersiz');
          if (!aciklama || aciklama.length > 500) throw Error('Açıklama gerekli');
          const kdv = Number(body.kdv);
          const row = {
            id: String(body.id || id('h-')),
            tur,
            tutar,
            kdv: Number.isFinite(kdv) ? kdv : 0,
            kalem: String(body.kalem || '').trim().slice(0, 80),
            karsiTaraf: String(body.karsiTaraf || '').trim().slice(0, 120),
            aciklama,
            durum,
            teslim: String(body.teslim || '').slice(0, 10),
            tarih: String(body.tarih || new Date().toISOString().slice(0, 10)).slice(0, 10),
            at: new Date().toISOString(),
          };
          const i = state.movements.findIndex(m => m.id === row.id);
          if (i >= 0) state.movements[i] = row;
          else state.movements.unshift(row);
        });
      }
      if (request.method === 'POST' && path.endsWith('/evrak')) {
        const form = await request.formData();
        const file = form.get('dosya');
        const ad = String(form.get('ad') || file?.name || 'Evrak').trim().slice(0, 160);
        const tur = String(form.get('tur') || 'diger');
        if (!TYPES.has(tur)) throw Error('Evrak türü geçersiz');
        if (!file || typeof file === 'string') throw Error('Dosya gerekli');
        if (file.size > MAX_DOC) throw Error('Dosya 8 MB sınırını aşıyor');
        const mime = String(file.type || 'application/octet-stream');
        if (!/^(application\/pdf|image\/(jpeg|png|webp))$/.test(mime)) throw Error('Yalnız PDF, JPG, PNG veya WebP');
        const buf = await file.arrayBuffer();
        const meta = {
          id: id('d-'),
          ad,
          tur,
          mime,
          size: buf.byteLength,
          fileName: String(file.name || 'evrak').slice(0, 160),
          gecerlilik: String(form.get('gecerlilik') || '').slice(0, 10),
          at: new Date().toISOString(),
        };
        return this.storage.transaction(async tx => {
          const state = await tx.get('state') || emptyState();
          if ((state.documents || []).length >= MAX_DOCS) throw Error('En fazla 80 evrak');
          state.documents = state.documents || [];
          state.documents.unshift(meta);
          state.revision += 1;
          state.updatedAt = new Date().toISOString();
          await tx.put('blob:' + meta.id, buf);
          await tx.put('state', state);
          return reply(state);
        });
      }
      if (request.method === 'DELETE' && /\/evrak\/([^/]+)$/.test(path)) {
        const docId = path.split('/').pop();
        return this.storage.transaction(async tx => {
          const state = await tx.get('state') || emptyState();
          state.documents = (state.documents || []).filter(d => d.id !== docId);
          state.revision += 1;
          if (typeof tx.delete === 'function') await tx.delete('blob:' + docId);
          await tx.put('state', state);
          return reply(state);
        });
      }
      return reply({ error: 'Yöntem desteklenmiyor' }, 405);
    } catch (err) {
      return reply({ error: err.message || 'Kayıt hatası' }, err.status === 413 ? 413 : 400);
    }
  }

  mutate(fn) {
    return this.storage.transaction(async tx => {
      const state = await tx.get('state') || emptyState();
      fn(state);
      state.revision += 1;
      state.updatedAt = new Date().toISOString();
      await tx.put('state', state);
      return new Response(JSON.stringify(state), {
        status: 200,
        headers: { 'cache-control': 'no-store', 'content-type': 'application/json; charset=utf-8' },
      });
    });
  }
}
