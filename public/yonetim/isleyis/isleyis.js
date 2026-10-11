(() => {
  const state = { page: 'ozet', data: { partners: [], movements: [], documents: [] } };
  const $ = (id) => document.getElementById(id);
  const money = (n) => Number(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
  const turAd = { gelir: 'Gelir', gider: 'Gider', harcama: 'Harcama', siparis: 'Sipariş' };
  const durumAd = { beklemede: 'Beklemede', tamamlandi: 'Tamamlandı', iptal: 'İptal' };
  const evrakAd = { 'vergi-levhasi': 'Vergi levhası', 'imza-sirkuleri': 'İmza sirküleri', 'ticaret-sicil': 'Ticaret sicil gazetesi', sozlesme: 'Sözleşme', diger: 'Diğer' };
  const kalemler = {
    gelir: ['Teklif tahsilatı', 'Satış', 'İade', 'Diğer gelir'],
    gider: ['Ofis', 'Lojistik', 'Komisyon', 'Hizmet', 'Diğer gider'],
    harcama: ['Kira', 'Elektrik', 'Su', 'İnternet', 'Kargo', 'Reklam', 'Vergi', 'Banka', 'Personel', 'Diğer harcama'],
    siparis: ['Kırtasiye alımı', 'Temizlik alımı', 'Ambalaj alımı', 'Hijyen alımı', 'Diğer sipariş'],
  };

  function toast(msg) {
    const el = $('toast');
    el.hidden = false;
    el.textContent = msg;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { el.hidden = true; }, 2400);
  }

  async function api(path, opts = {}) {
    const res = await fetch('/yonetim/isleyis/api/' + path, { credentials: 'same-origin', ...opts });
    if (res.status === 401) { location.href = '/yonetim/isleyis/'; throw Error('oturum'); }
    const data = res.headers.get('content-type')?.includes('json') ? await res.json() : null;
    if (!res.ok) throw Error(data?.error || 'İşlem başarısız');
    return data;
  }

  async function reload() {
    state.data = await api('durum');
    render();
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function badge(durum) {
    const cls = durum === 'tamamlandi' ? 'ok' : durum === 'iptal' ? 'off' : 'wait';
    return `<span class="badge ${cls}">${esc(durumAd[durum] || durum)}</span>`;
  }

  function opts(list, current) {
    return list.map((v) => `<option${v === current ? ' selected' : ''}>${esc(v)}</option>`).join('');
  }

  function wrap(heads, rows, emptyCols) {
    const body = rows || `<tr><td colspan="${emptyCols}" class="empty">Kayıt yok. Satır ekleyince burada durur.</td></tr>`;
    return `<div class="table-wrap"><table><thead><tr>${heads}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function active(list) {
    return (list || []).filter((x) => x.durum !== 'iptal');
  }

  function sum(list, pred) {
    return active(list).filter(pred).reduce((s, x) => s + Number(x.tutar || 0), 0);
  }

  function ym(d) { return String(d || '').slice(0, 7); }
  function y(d) { return String(d || '').slice(0, 4); }
  function periodSums(tur, now = new Date()) {
    const m = now.toISOString().slice(0, 7);
    const year = String(now.getFullYear());
    const all = state.data.movements || [];
    return {
      ay: sum(all, (x) => x.tur === tur && ym(x.tarih) === m),
      yil: sum(all, (x) => x.tur === tur && y(x.tarih) === year),
      top: sum(all, (x) => x.tur === tur),
    };
  }

  function ozet() {
    const rows = ['gelir', 'gider', 'harcama', 'siparis'].map((tur) => {
      const p = periodSums(tur);
      return `<tr><td>${turAd[tur]}</td><td class="num">${money(p.ay)}</td><td class="num">${money(p.yil)}</td><td class="num">${money(p.top)}</td></tr>`;
    }).join('');
    const g = periodSums('gelir');
    const outAy = periodSums('gider').ay + periodSums('harcama').ay + periodSums('siparis').ay;
    const outYil = periodSums('gider').yil + periodSums('harcama').yil + periodSums('siparis').yil;
    const outTop = periodSums('gider').top + periodSums('harcama').top + periodSums('siparis').top;
    const mali = wrap(
      '<th>Kalem</th><th class="num">Bu ay</th><th class="num">Bu yıl</th><th class="num">Toplam</th>',
      rows + `<tr class="total"><td>Net</td><td class="num">${money(g.ay - outAy)}</td><td class="num">${money(g.yil - outYil)}</td><td class="num">${money(g.top - outTop)}</td></tr>`,
      4,
    );
    const net = g.top - outTop;
    const payRows = (state.data.partners || []).map((p) => `<tr>
      <td>${esc(p.ad)}</td><td>${esc(p.gorev)}</td><td class="num">${Number(p.pay || 0)} %</td>
      <td class="num">${money(p.sermaye)}</td><td class="num">${money(net * Number(p.pay || 0) / 100)}</td>
    </tr>`).join('') || null;
    const payTable = wrap(
      '<th>Ortak</th><th>Görev</th><th class="num">Pay</th><th class="num">Sermaye</th><th class="num">Net pay (toplam)</th>',
      payRows,
      5,
    );
    const last = (state.data.movements || []).slice(0, 12).map((m) => `<tr>
      <td>${esc(m.tarih)}</td><td>${turAd[m.tur] || m.tur}</td><td>${esc(m.kalem)}</td>
      <td>${esc(m.karsiTaraf)}</td><td>${esc(m.aciklama)}</td><td class="num">${money(m.tutar)}</td>
      <td>${badge(m.durum)}</td>
    </tr>`).join('') || null;
    $('page').innerHTML = `
      <h1>Mali özet</h1>
      <p class="muted">Gelir, gider, harcama ve tedarik siparişi aynı defterde. Rakamlar kayıtlardan hesaplanır.</p>
      ${mali}
      <h2>Ortak payı</h2>
      ${payTable}
      <h2>Son hareketler</h2>
      ${wrap('<th>Tarih</th><th>Tür</th><th>Kalem</th><th>Karşı taraf</th><th>Açıklama</th><th class="num">Tutar</th><th>Durum</th>', last, 7)}`;
  }

  function ortaklar() {
    const rows = (state.data.partners || []).map((p) => `<tr>
      <td>${esc(p.ad)}</td><td>${esc(p.gorev)}</td><td class="num">${Number(p.pay || 0)} %</td>
      <td class="num">${money(p.sermaye)}</td><td>${esc(p.telefon)}</td><td>${esc(p.iban)}</td><td>${esc(p.not)}</td>
      <td class="actions"><button class="btn ghost" data-del="${p.id}">Sil</button></td></tr>`).join('') || null;
    $('page').innerHTML = `<h1>Ortaklar</h1>
      <p class="muted">Pay yüzdesi net dağılımda kullanılır. IBAN ve sermaye sonra doldurulur.</p>
      <form class="grid row ortak" id="ortak-form">
        <label>Ad <input name="ad" required></label>
        <label>Görev <input name="gorev" placeholder="Ortak"></label>
        <label>Pay % <input name="pay" type="number" min="0" max="100" step="0.01" value="0"></label>
        <label>Sermaye <input name="sermaye" type="number" min="0" step="0.01" value="0"></label>
        <label>Telefon <input name="telefon"></label>
        <label>IBAN <input name="iban"></label>
        <button class="btn" type="submit">Satır ekle</button>
      </form>
      ${wrap('<th>Ad</th><th>Görev</th><th class="num">Pay</th><th class="num">Sermaye</th><th>Telefon</th><th>IBAN</th><th>Not</th><th></th>', rows, 8)}`;
    $('ortak-form').onsubmit = async (e) => {
      e.preventDefault();
      await api('ortaklar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
      toast('Ortak satırı kaydedildi.');
      reload();
    };
    bindDel('ortaklar');
  }

  function hareketSayfa(tur) {
    const baslik = { gelir: 'Gelir', gider: 'Gider', harcama: 'Harcamalar', siparis: 'Siparişler' }[tur];
    const karsi = { gelir: 'Kaynak', gider: 'Karşı taraf', harcama: 'Ödenen yer', siparis: 'Tedarikçi' }[tur];
    const acik = {
      gelir: 'Müşteri tahsilatı ve diğer girişler. Site üzerinden ödeme alınmaz.',
      gider: 'İşletme giderleri. Kalem adlarını sonra değiştiririz.',
      harcama: 'Kira, fatura, kargo, vergi gibi nakit çıkışları.',
      siparis: 'Şirketin tedarikçiye verdiği alımlar. Müşteri siparişi değildir.',
    }[tur];
    const list = (state.data.movements || []).filter((m) => m.tur === tur);
    const rows = list.map((m) => `<tr>
      <td>${esc(m.tarih)}</td><td>${esc(m.kalem)}</td><td>${esc(m.karsiTaraf)}</td>
      <td>${esc(m.aciklama)}</td><td class="num">${money(m.tutar)}</td><td class="num">${money(m.kdv)}</td>
      <td>${esc(m.teslim)}</td><td>${badge(m.durum)}</td>
      <td class="actions"><button class="btn ghost" data-del="${m.id}">Sil</button></td></tr>`).join('') || null;
    const teslimLabel = tur === 'siparis' ? 'Teslim' : 'Vade';
    $('page').innerHTML = `<h1>${baslik}</h1>
      <p class="muted">${acik}</p>
      <form class="grid row" id="har-form">
        <label>Tarih <input name="tarih" type="date" required></label>
        <label>Kalem <select name="kalem">${opts(kalemler[tur])}</select></label>
        <label>${karsi} <input name="karsiTaraf"></label>
        <label>Tutar <input name="tutar" type="number" min="0" step="0.01" required></label>
        <label>KDV <input name="kdv" type="number" min="0" step="0.01" value="0"></label>
        <label>${teslimLabel} <input name="teslim" type="date"></label>
        <label>Durum <select name="durum">
          <option value="beklemede">Beklemede</option>
          <option value="tamamlandi">Tamamlandı</option>
          <option value="iptal">İptal</option>
        </select></label>
        <label>Açıklama <input name="aciklama" required></label>
        <input type="hidden" name="tur" value="${tur}">
        <button class="btn" type="submit">Satır ekle</button>
      </form>
      ${wrap(`<th>Tarih</th><th>Kalem</th><th>${karsi}</th><th>Açıklama</th><th class="num">Tutar</th><th class="num">KDV</th><th>${teslimLabel}</th><th>Durum</th><th></th>`, rows, 9)}`;
    const form = $('har-form');
    form.tarih.value = new Date().toISOString().slice(0, 10);
    form.onsubmit = async (e) => {
      e.preventDefault();
      await api('hareketler', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      toast('Satır kaydedildi.');
      reload();
    };
    bindDel('hareketler');
  }

  function evraklar() {
    const rows = (state.data.documents || []).map((d) => `<tr>
      <td>${esc(d.ad)}</td><td>${evrakAd[d.tur] || d.tur}</td><td>${esc(d.gecerlilik)}</td>
      <td class="num">${Math.round((d.size || 0) / 1024)} KB</td><td>${esc((d.at || '').slice(0, 10))}</td>
      <td class="actions">
        <a class="btn ghost" href="/yonetim/isleyis/api/evrak/${d.id}">İndir</a>
        <button class="btn danger" data-del="${d.id}">Sil</button>
      </td></tr>`).join('') || null;
    $('page').innerHTML = `<h1>Şirket evrakları</h1>
      <p class="muted">Vergi levhası, imza sirküleri, sicil, sözleşme. PDF / JPG / PNG / WebP, en fazla 8 MB.</p>
      <form class="grid row evrak" id="evrak-form">
        <label>Ad <input name="ad" placeholder="Vergi levhası 2026"></label>
        <label>Tür <select name="tur">
          <option value="vergi-levhasi">Vergi levhası</option>
          <option value="imza-sirkuleri">İmza sirküleri</option>
          <option value="ticaret-sicil">Ticaret sicil gazetesi</option>
          <option value="sozlesme">Sözleşme</option>
          <option value="diger">Diğer</option>
        </select></label>
        <label>Geçerlilik <input name="gecerlilik" type="date"></label>
        <label>Dosya <input name="dosya" type="file" accept=".pdf,image/jpeg,image/png,image/webp" required></label>
        <button class="btn" type="submit">Yükle</button>
      </form>
      ${wrap('<th>Ad</th><th>Tür</th><th>Geçerlilik</th><th class="num">Boyut</th><th>Yükleme</th><th></th>', rows, 6)}`;
    $('evrak-form').onsubmit = async (e) => {
      e.preventDefault();
      await api('evrak', { method: 'POST', body: new FormData(e.target) });
      toast('Evrak yüklendi.');
      reload();
    };
    $('page').querySelectorAll('[data-del]').forEach((b) => {
      b.onclick = async () => {
        await api('evrak/' + b.dataset.del, { method: 'DELETE' });
        reload();
      };
    });
  }

  function bindDel(path) {
    $('page').querySelectorAll('[data-del]').forEach((b) => {
      b.onclick = async () => {
        await api(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sil: b.dataset.del }) });
        reload();
      };
    });
  }

  function render() {
    document.querySelectorAll('[data-page]').forEach((b) => b.classList.toggle('is-on', b.dataset.page === state.page));
    if (state.page === 'ortaklar') ortaklar();
    else if (['gelir', 'gider', 'harcama', 'siparis'].includes(state.page)) hareketSayfa(state.page);
    else if (state.page === 'evraklar') evraklar();
    else ozet();
  }

  document.querySelectorAll('[data-page]').forEach((b) => {
    b.onclick = () => { state.page = b.dataset.page; render(); };
  });
  reload().catch((err) => { $('page').innerHTML = `<p class="empty">${esc(err.message)}</p>`; });
})();
