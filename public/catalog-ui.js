/* Public catalogue. Shared taxonomy lives in site.js. No prices. */
(() => {
  const root = document.getElementById('liste');
  const discs = document.getElementById('kat-daireler');
  const brandsEl = document.getElementById('populer-markalar');
  const brandRail = brandsEl?.closest('.brand-rail');
  const heading = document.getElementById('baslik');
  const crumbs = document.getElementById('catalog-crumbs');
  if (!root || !discs) return;

  const params = new URLSearchParams(location.search);
  const rawG = params.get('g') || '';
  const rawA = params.get('a') || '';
  const sub = gecerliA(rawA);
  const group = gecerliG(rawG, sub || rawA);
  const query = (params.get('q') || '').trim();
  const urunId = (params.get('u') || '').trim();
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };
  const link = (text, href, cls) => { const n = el('a', text, cls); n.href = href; return n; };
  const url = (g = '', a = '', q = query, u = '') => katalogYol({ g, a, q, u });
  const spec = (item) => [item.marka, olcuYazi(item.olcu), olcuYazi(item.kapasite), item.malzeme, item.renk, item.ambalajAdedi, item.urunTuru].filter(Boolean).join(' · ');
  const listeAd = (item) => {
    let ad = urunAdiYazi(String(item.ad || '').trim());
    const marka = String(item.marka || '').trim();
    if (marka && !ad.toLocaleLowerCase('tr').startsWith(marka.toLocaleLowerCase('tr'))) {
      ad = marka + ' ' + ad;
    }
    const extras = [];
    const blob = () => (ad + ' ' + extras.join(' ')).toLocaleLowerCase('tr');
    const add = (v, asOlcu) => {
      const s = asOlcu ? olcuYazi(v) : String(v || '').trim();
      if (!s || /^belirtilmedi$/i.test(s)) return;
      const needle = s.toLocaleLowerCase('tr');
      const tokens = blob().split(/\s+/);
      if (tokens.includes(needle)) return;
      extras.push(s);
    };
    add(item.olcu, true);
    if (!/litrelik/i.test(ad)) add(item.kapasite, true);
    add(item.malzeme, false);
    add(item.renk, false);
    add(item.ambalajAdedi, false);
    add(item.urunTuru, false);
    return extras.length ? ad + ' · ' + extras.join(' · ') : ad;
  };
  const teklifAd = (item) => listeAd(item);

  const brandPicker = (subId) => {
    const brands = MARKA_TERCIHLERI[subId];
    if (!brands?.length) return null;
    const wrap = el('label', null, 'brand-choice');
    wrap.append(el('span', 'Marka tercihi'));
    const select = el('select');
    select.append(new Option('Fark etmez', 'Fark etmez'));
    brands.forEach((brand) => select.append(new Option(brand, brand)));
    wrap.append(select, el('small', 'Tercih ettiğiniz markayı belirtin; uygun seçenekleri araştıralım.'));
    return wrap;
  };
  const add = (g, name, label = 'Teklif listeme ekle', brandSelect) => {
    const button = el('button', label, 'btn ghost');
    button.type = 'button';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      FerraInterest.add(g, brandSelect ? markaTercihSatir(name, brandSelect.value) : name);
    });
    return button;
  };
  const TONE = { A: 'kagit', B: 'sivi', C: 'aparat', D: 'ambalaj', E: 'gida', F: 'kirtasiye' };

  const flyout = (g) => {
    const menu = el('div', null, 'cat-fly');
    const subs = (g.subs || []).filter((s) => s.id !== 'diger');
    if (!subs.length) {
      menu.append(el('p', 'Henüz alt grup yok', 'cat-fly-empty'));
      return menu;
    }
    subs.forEach((s) => {
      const row = el('div', null, 'cat-fly-row');
      const subLink = link('', url(g.g, s.id, query), 'cat-fly-sub');
      subLink.append(el('span', s.ad), el('span', String(s.items.length), 'cat-fly-count'));
      const prods = el('div', null, 'cat-fly-prods');
      if (s.items.length) {
        s.items.slice(0, 28).forEach((item) => {
          prods.append(link(listeAd(item), url(g.g, s.id, '', item.id), 'cat-fly-item'));
        });
      } else {
        prods.append(el('p', 'Henüz ürün yok', 'cat-fly-empty'));
      }
      row.append(subLink, prods);
      menu.append(row);
    });
    return menu;
  };

  const circle = ({ href, ad, gorsel, on, tone, group: gNode, code }) => {
    const li = el('li');
    if (tone) li.className = 'cat-tone-' + tone;
    const node = href ? link('', href, 'cat-circle-link' + (on ? ' is-on' : '')) : el('span', null, 'cat-circle-link');
    const disc = el('span', null, 'cat-circle');
    if (gorsel) {
      const img = el('img');
      img.src = gorsel;
      img.alt = '';
      disc.append(img);
    }
    if (code) node.append(el('span', code, 'cat-code'));
    node.append(disc, el('span', ad || '', 'cat-circle-ad'));
    li.append(node);
    if (gNode) li.append(flyout(gNode));
    return li;
  };

  const bindMarquee = (list) => {
    const rail = list?.closest('.brand-rail-mask');
    const originals = list ? [...list.children] : [];
    if (!rail || !originals.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    originals.forEach((node) => {
      const copy = node.cloneNode(true);
      copy.querySelectorAll('a').forEach((a) => { a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); });
      copy.setAttribute('aria-hidden', 'true');
      list.append(copy);
    });
  };

  const photoZoom = (() => {
    const root = el('dialog', null, 'photo-zoom');
    root.setAttribute('aria-label', 'Ürün görseli');
    let opener;
    const img = el('img');
    const close = el('button', 'Kapat', 'photo-zoom-close');
    close.type = 'button';
    root.append(img, close);
    document.body.append(root);
    const hide = () => {
      root.close();
      img.removeAttribute('src');
      img.removeAttribute('style');
      opener?.focus();
    };
    close.addEventListener('click', hide);
    root.addEventListener('click', (e) => { if (e.target === root) hide(); });
    root.addEventListener('cancel', (e) => { e.preventDefault(); hide(); });
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
    });
    return (src, alt) => {
      opener = document.activeElement;
      root.setAttribute('aria-label', (alt || 'Ürün') + ' görseli');
      img.alt = alt || '';
      img.onload = () => {
        const maxW = Math.min(window.innerWidth * 0.88, img.naturalWidth * 2.5);
        const scale = maxW / img.naturalWidth;
        const h = img.naturalHeight * scale;
        const maxH = window.innerHeight * 0.82;
        if (h > maxH) {
          img.style.height = maxH + 'px';
          img.style.width = 'auto';
        } else {
          img.style.width = maxW + 'px';
          img.style.height = 'auto';
        }
      };
      img.src = src;
      root.showModal();
      close.focus();
    };
  })();
  const photo = (item, g) => {
    const figure = el('figure', null, 'product-photo');
    if (item.gorsel) {
      const image = el('img');
      image.src = item.gorsel;
      const urunFoto = item.gorselTuru === 'urun';
      if (urunFoto) figure.classList.add('is-product');
      image.alt = urunFoto ? (item.ad || g.ad) : (item.ad || g.ad) + ' — kategori görseli';
      image.width = 160;
      image.height = 160;
      image.loading = 'lazy';
      image.decoding = 'async';
      figure.append(image);
      if (!urunFoto) figure.append(el('figcaption', 'Kategori görseli'));
      figure.classList.add('is-zoom');
      figure.tabIndex = 0;
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', (item.ad || 'Ürün') + ' görselini büyüt');
      const open = (e) => {
        e.preventDefault();
        e.stopPropagation();
        photoZoom(item.gorsel, image.alt);
      };
      figure.addEventListener('click', open);
      figure.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') open(e);
      });
    } else {
      figure.append(el('div', 'Görsel yok', 'product-ph'));
    }
    return figure;
  };

  fetch('/katalog.json').then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then((data) => {
    const vitrin = GRUPLAR.filter((g) => VITRIN_GRUPLAR.includes(g.g));
    const groups = vitrin.map((g) => {
      const items = (data.urunler || []).filter((u) => u.aktif !== false && grupAnahtar(g.g).includes(u.kategori));
      const buckets = new Map();
      (ALTLAR[g.g] || []).forEach((tip) => {
        buckets.set(tip.id, { ...tip, items: [] });
      });
      items.forEach((item) => {
        const tip = altBul(g.g, item.satir || item.ad, item.alt);
        if (!buckets.has(tip.id)) buckets.set(tip.id, { ...tip, items: [] });
        buckets.get(tip.id).items.push(item);
      });
      const order = [...(ALTLAR[g.g] || []).map((x) => x.id), 'diger'];
      return { ...g, items, subs: [...buckets.values()].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)) };
    });
    const current = groups.find((g) => g.g === group);
    const selected = current?.subs.find((s) => s.id === sub);
    const detail = urunId ? (data.urunler || []).find((u) => u.id === urunId && u.aktif !== false) : null;
    const detailGroup = detail ? groups.find((g) => grupAnahtar(g.g).includes(detail.kategori)) : null;
    const detailSub = detailGroup?.subs.find((s) => s.id === detail.alt);

    if (crumbs) {
      crumbs.replaceChildren(link('Ana sayfa', '/'));
      crumbs.append(el('span', ' / ', 'breadcrumb-divider'));
      if (current || detail) crumbs.append(link('Ürünler', url()));
      else crumbs.append(el('span', 'Ürünler', 'breadcrumb-current'));
      const gNow = detailGroup || current;
      if (gNow) {
        crumbs.append(el('span', ' / ', 'breadcrumb-divider'));
        if (selected || detailSub || detail) crumbs.append(link(gNow.ad, url(gNow.g)));
        else crumbs.append(el('span', gNow.ad, 'breadcrumb-current'));
      }
      const sNow = detailSub || selected;
      if (sNow) {
        crumbs.append(el('span', ' / ', 'breadcrumb-divider'));
        if (detail) crumbs.append(link(sNow.ad, url(gNow.g, sNow.id, '')));
        else crumbs.append(el('span', sNow.ad, 'breadcrumb-current'));
      }
      if (detail) {
        crumbs.append(el('span', ' / ', 'breadcrumb-divider'));
        crumbs.append(el('span', detail.ad, 'breadcrumb-current'));
      }
    }

    heading.textContent = detail?.ad || selected?.ad || current?.ad || 'Ürünler';
    document.title = heading.textContent + ' · FerraPro';

    discs.replaceChildren();
    const discGroup = detailGroup || current;
    const altDiscs = discGroup ? discGroup.subs.filter((s) => s.id !== 'diger') : [];
    if (altDiscs.length) {
      altDiscs.forEach((s) => discs.append(circle({
        href: url(discGroup.g, s.id, query),
        ad: s.ad,
        gorsel: s.gorsel || grupFoto(discGroup.g),
        on: (selected || detailSub)?.id === s.id,
        tone: TONE[discGroup.g],
      })));
    } else {
      groups.forEach((g) => discs.append(circle({
        href: url(g.g, '', query),
        ad: g.ad,
        gorsel: grupFoto(g.g),
        on: false,
        tone: TONE[g.g],
        group: g,
        code: g.g,
      })));
    }

    const brandGroup = detailGroup || current;
    const brands = brandGroup ? (POPULER_MARKALAR[brandGroup.g] || []) : [];
    if (brandRail) brandRail.hidden = !brands.length;
    if (brandsEl) {
      brandsEl.replaceChildren();
      brandsEl.classList.remove('is-static');
      brands.forEach((brand) => {
        const li = el('li');
        const disc = el('span', null, 'brand-disc');
        const img = el('img');
        img.src = brand.logo;
        img.alt = brand.ad;
        img.width = 92;
        img.height = 92;
        disc.append(img);
        li.append(disc);
        brandsEl.append(li);
      });
      if (brands.length && brands.length < 8) brandsEl.classList.add('is-static');
      else bindMarquee(brandsEl);
    }

    root.replaceChildren();
    const needles = aramaMetni(query).split(/\s+/).filter(Boolean);
    const sourcing = () => {
      const box = el('section', null, 'catalog-sourcing');
      box.append(el('h2', query ? 'Aradığınızı birlikte bulalım.' : 'Bu grupta aradığınızı bulamadınız mı?'));
      box.append(el('p', 'Katalogda olmayan ürünler için de araştırma ve tedarik desteği sunuyoruz. Ürün veya miktar seçmeden bize ulaşabilirsiniz.'));
      const note = query ? 'Aradığım ürün: ' + query : 'İlgilendiğim grup: ' + (selected?.ad || current?.ad || '');
      const actions = el('div', null, 'product-detail-actions');
      actions.append(link('Benim için araştırın', '/siparis?' + new URLSearchParams({g:group, satir:note}), 'btn'));
      actions.append(link('WhatsApp ile sorun', 'https://wa.me/' + WA + '?text=' + encodeURIComponent(note), 'btn ghost'));
      box.append(actions);
      return box;
    };

    if (detail && detailGroup) {
      const layout = root.closest('.catalog-layout');
      layout?.classList.add('has-product-detail');
      const results = root.closest('.catalog-results');
      layout?.querySelector('.catalog-head')?.after(results);
      const picker = brandPicker(detail.alt);
      const article = el('article', null, 'product-detail');
      article.append(photo(detail, detailGroup));
      const body = el('div', null, 'product-detail-copy');
      body.append(el('p', [detailGroup.ad, detailSub?.ad].filter(Boolean).join(' / '), 'product-path'));
      body.append(el('h2', listeAd(detail)));
      const dl = el('dl', null, 'product-kv');
      const fields = [
        ['Marka', detail.marka],
        ['Ölçü', olcuYazi(detail.olcu)],
        ['Kapasite', olcuYazi(detail.kapasite)],
        ['Malzeme', detail.malzeme],
        ['Renk', detail.renk],
        ['Ambalaj adedi', detail.ambalajAdedi],
        ['Ürün türü', detail.urunTuru],
        ['Açıklama', detail.aciklama],
        ['Not', detail.not],
      ];
      fields.forEach(([label, value]) => {
        if (!value) return;
        dl.append(el('dt', label), el('dd', value));
      });
      body.append(dl);
      if (picker) body.append(picker);
      const actions = el('div', null, 'product-detail-actions');
      actions.append(add(detailGroup.ad, teklifAd(detail), 'Teklif listeme ekle', picker?.querySelector('select')));
      const requestLink = link('Bu ürün için görüşelim', '/siparis?' + new URLSearchParams({g:detailGroup.g, satir:teklifAd(detail)}), 'btn');
      requestLink.addEventListener('click', () => {
        const name = picker ? markaTercihSatir(teklifAd(detail), picker.querySelector('select').value) : teklifAd(detail);
        requestLink.href = '/siparis?' + new URLSearchParams({g:detailGroup.g, satir:name});
      });
      actions.append(requestLink);
      actions.append(link('WhatsApp ile sorun', 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Bu ürün hakkında görüşmek istiyorum: ' + teklifAd(detail)), 'btn ghost'));
      body.append(actions);
      article.append(body);
      root.append(article);
      return;
    }

    const scan = current ? [current] : groups;
    const rows = [];
    scan.forEach((g) => {
      g.subs.filter((s) => !selected || s.id === selected.id).forEach((s) => {
        s.items.forEach((item) => {
          const blob = aramaMetni(`${item.ad || ''} ${spec(item)} ${item.satir || ''} ${g.ad} ${s.ad}`);
          if (needles.every(word => blob.includes(word))) rows.push({ g, s, item });
        });
      });
    });

    if (query) {
      const info = el('p', rows.length + ' ürün seçeneği · Arama: ' + query, 'cat-meta');
      info.append(link('Aramayı temizle', url(group, selected?.id || '', ''), 'cat-clear'));
      root.append(info);
      paintProducts(rows);
      if (!rows.length) {
        root.append(el('p', 'Bu aramayla eşleşen ürün bulunamadı.', 'cat-empty'));
        if (group) root.append(link('Tüm kategorilerde ara', url('', '', query), 'btn ghost'));
      }
      root.append(sourcing());
      return;
    }

    if (!current) {
      root.append(el('p', 'Ürünleri incelemek için bir kategori seçin.', 'cat-hint'));
      root.append(sourcing());
      return;
    }

    if (!selected) {
      const visible = current.subs.filter((s) => s.id !== 'diger');
      if (!visible.length) {
        root.append(el('p', 'Bu grupta henüz ürün listelenmedi. İhtiyacınızı teklif formundan iletebilirsiniz.', 'cat-empty'));
        root.append(link('Teklif isteyin', '/siparis?g=' + encodeURIComponent(current.g), 'btn'));
        return;
      }
      root.append(el('p', 'Üstteki alt gruplardan birini seçin.', 'cat-hint'));
      root.append(sourcing());
      return;
    }

    paintProducts(rows);
    root.append(sourcing());
    if (!rows.length) {
      root.append(el('p', 'Bu alt grupta henüz ürün yok. İhtiyacınızı teklif formundan iletebilirsiniz.', 'cat-empty'));
      root.append(link('Teklif isteyin', '/siparis?g=' + encodeURIComponent(current.g), 'btn'));
    }
  }).catch(() => {
    root.replaceChildren(el('p', 'Katalog şu anda yüklenemedi. Lütfen yeniden deneyin veya bizimle iletişime geçin.', 'cat-empty'), link('İletişime geçin', '/iletisim', 'btn'));
  });

  function paintProducts(rows) {
    if (!rows.length) return;
    const list = el('div', null, 'product-options');
    const controls = el('div', null, 'catalog-filters');
    const brand = el('select');
    const brandLabel = el('label', 'Marka');
    brand.append(new Option('Tüm markalar', ''));
    [...new Set(rows.map(r => r.item.marka).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr')).forEach(x=>brand.append(new Option(x,x)));
    brandLabel.append(brand);
    const sort = el('select');
    const sortLabel = el('label', 'Sıralama');
    sort.append(new Option('Katalog sırası','catalog'),new Option('Ürün adı A–Z','name'));
    sortLabel.append(sort);
    const count = el('p'); count.setAttribute('role','status');
    controls.append(brandLabel, sortLabel, count);
    root.append(controls);
    const render = () => {
    list.replaceChildren();
    const filtered = rows.filter(r=>!brand.value || r.item.marka===brand.value);
    if (sort.value==='name') filtered.sort((a,b)=>listeAd(a.item).localeCompare(listeAd(b.item),'tr'));
    count.textContent = filtered.length + ' ürün';
    filtered.forEach(({ g, s, item }) => {
      const row = el('article', null, 'product-option');
      const body = el('div', null, 'product-copy');
      const named = listeAd(item);
      body.append(el('p', s.ad, 'product-path'));
      const title = link(named, url(g.g, s.id, '', item.id));
      title.className = 'product-title';
      body.append(title);
      const line = spec(item);
      if (line) body.append(el('p', line, 'product-spec'));
      const picker = brandPicker(s.id);
      if (picker) body.append(picker);
      row.append(photo(item, g), body, add(g.ad, teklifAd(item), 'Teklif listeme ekle', picker?.querySelector('select')));
      list.append(row);
    });
    };
    brand.addEventListener('change',render); sort.addEventListener('change',render); render();
    root.append(list);
  }
})();
