/* Uses the public catalogue only. Shared taxonomy/helpers are defined in site.js. */
(() => {
  const root = document.getElementById('liste');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const group = gecerliG(params.get('g') || '');
  const sub = params.get('a') || '';
  const query = (params.get('q') || '').trim();
  const meta = {
    Hijyen: ['hijyen', 'Havlu, tuvalet kâğıdı ve peçete seçenekleri.'],
    Temizlik: ['temizlik', 'Kullanım alanınıza göre temizlik ürünleri ve yardımcı malzemeler.'],
    Kırtasiye: ['ofis', 'Kalemler, kâğıtlar, dosyalama, masaüstü gereçleri ve sunum malzemeleri.'],
    Mutfak: ['mutfak', 'Servis, içecek, ikram ve bulaşık ihtiyaçları.'],
    Ambalaj: ['ambalaj', 'Paketleme, taşıma ve saklama ürünleri.'],
    PC: ['bilgisayar', 'Yazıcı ve bilgisayar için sarf malzemeleri.'],
    Sağlık: ['saglik', 'Eldiven, maske ve muayene alanı sarf ürünleri.'],
  };
  const el = (tag, text, cls) => { const n=document.createElement(tag); if(text)n.textContent=text; if(cls)n.className=cls; return n; };
  const link = (text, href, cls) => { const n=el('a',text,cls); n.href=href; return n; };
  const url = (g='', a='', q=query) => katalogYol({g,a,q});
  const brandPicker = (subId) => {
    const brands = MARKA_TERCIHLERI[subId];
    if (!brands?.length) return null;
    const wrap = el('label', null, 'brand-choice');
    wrap.append(el('span', 'Marka tercihi'));
    const select = el('select');
    select.append(new Option('Fark etmez', 'Fark etmez'));
    brands.forEach((brand) => select.append(new Option(brand, brand)));
    wrap.append(select, el('small', 'İstediğiniz markayı tedarik ederiz.'));
    return wrap;
  };
  const add = (g, name, label='Teklif listeme ekle', brandSelect) => {
    const button=el('button',label,'btn ghost'); button.type='button';
    button.addEventListener('click',()=>{
      FerraInterest.add(g, brandSelect ? markaTercihSatir(name, brandSelect.value) : name);
    });
    return button;
  };
  fetch('/katalog.json').then(r=>{if(!r.ok)throw new Error();return r.json();}).then(data=>{
    const groups = GRUPLAR.map(g=>{
      const items=data.urunler.filter(u=>grupAnahtar(g.g).includes(u.kategori));
      const buckets=new Map();
      items.forEach(item=>{
        const tip=altBul(g.g,item.satir||item.ad,item.alt);
        if(!buckets.has(tip.id))buckets.set(tip.id,{...tip,items:[]});
        buckets.get(tip.id).items.push(item);
      });
      const order=[...(ALTLAR[g.g]||[]).map(x=>x.id),'diger'];
      return {...g,items,subs:[...buckets.values()].sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id))};
    });
    const current=groups.find(g=>g.g===group);
    const selected=current?.subs.find(s=>s.id===sub);
    const nav=document.getElementById('kat-nav');
    const select=document.getElementById('kat-sec');
    nav.replaceChildren(link('Tüm kategoriler',url(),'category-all'));
    select.replaceChildren(new Option('Tüm kategoriler',''));
    groups.forEach(g=>{
      const a=link(g.ad,url(g.g),current===g?'is-on':'');
      if(current===g&&!selected)a.setAttribute('aria-current','page');
      nav.append(a); select.append(new Option(g.ad,g.g));
      if(current===g) g.subs.forEach(s=>{
        const b=link(s.ad+' ('+s.items.length+')',url(g.g,s.id),'subnav-link');
        if(selected===s)b.setAttribute('aria-current','page');
        nav.append(b);
      });
    });
    select.value=group;
    select.addEventListener('change',()=>location.assign(url(select.value)));
    const heading=document.getElementById('baslik');
    heading.textContent=selected?.ad||current?.ad||'Ürün kategorileri';
    document.title=heading.textContent+' · FerraPro';
    const crumbs=document.getElementById('catalog-crumbs');
    crumbs.append(link('Tüm kategoriler',url('', '', '')));
    if(current)crumbs.append(el('span',' / '),link(current.ad,url(group,'','')));
    if(selected)crumbs.append(el('span',' / '),el('span',selected.ad));
    const intro=document.getElementById('catalog-intro');
    intro.append(el('p',current?meta[group][1]:'İhtiyacınız olan alanı seçin. Alt grupları keşfedin veya ürün adıyla arayın.'));
    intro.append(el('p','Fotoğraflar ürün türlerini temsil eder. Marka, model, ambalaj ve tedarik uygunluğu teklif sırasında netleştirilir.','catalog-image-note'));
    if(current) {
      const ask=el('div',null,'category-inquiry');
      const groupBrand=selected ? brandPicker(selected.id) : null;
      ask.append(el('p','Toplu ürün ve sarf ihtiyaçlarınızı tek talepte iletebilirsiniz. Marka, ambalaj ve tedarik koşulları teklif aşamasında netleştirilir.'));
      if(groupBrand) ask.append(groupBrand);
      ask.append(add(current.ad,selected?.ad||'Genel ihtiyaç','Bu grup için görüşelim',groupBrand?.querySelector('select')));
      intro.append(ask);
    }

    const info=document.getElementById('kat-meta');
    root.replaceChildren();
    if(!group&&!query) {
      info.textContent=groups.length+' ana kategori';
      const grid=el('div',null,'category-directory');
      groups.forEach(g=>{
        const card=el('article',null,'directory-card');
        const imageLink=link('',url(g.g)); imageLink.tabIndex=-1; imageLink.setAttribute('aria-hidden','true');
        const img=el('img'); img.src='/img/collection/'+meta[g.g][0]+'.webp'; img.alt=''; img.width=1536; img.height=1024; img.loading='lazy'; imageLink.append(img);
        const body=el('div',null,'directory-body'); const h=el('h2');h.append(link(g.ad,url(g.g)));
        body.append(h,el('p',meta[g.g][1]),el('small',g.subs.length+' alt grup · '+g.items.length+' ürün seçeneği'));
        const list=el('ul');g.subs.slice(0,4).forEach(s=>{const li=el('li');li.append(link(s.ad,url(g.g,s.id)));list.append(li);});
        body.append(list,link('Tüm alt grupları incele →',url(g.g),'directory-more'));card.append(imageLink,body);grid.append(card);
      });
      root.append(grid);
      return;
    }
    if(current&&!selected&&!query) {
      info.textContent=current.subs.length+' alt grup · '+current.items.length+' ürün seçeneği';
      const grid=el('div',null,'subcategory-grid');
      current.subs.forEach(s=>{
        const a=link('',url(group,s.id),'subcategory-card');
        const image=s.items[0]?.gorsel || grupFoto(s.id);
        if(image){const img=el('img');img.src=image;img.alt='';img.loading='lazy';a.append(img);}
        a.append(el('h2',s.ad),el('span',s.aciklama || ''),el('span',s.items.length+' seçenek'),el('b','Ürünleri incele →'));grid.append(a);
      });
      root.append(grid);
      if(sub)info.append(el('span',' · Önceki alt grup bulunamadı; güncel gruplardan seçim yapabilirsiniz.'));
      return;
    }
    const needle=query.toLocaleLowerCase('tr');
    const results=[];
    (current?[current]:groups).forEach(g=>g.subs.filter(s=>!selected||s.id===selected.id).forEach(s=>s.items.forEach(item=>{
      if(!needle || `${item.satir || item.ad || ''} ${g.ad}`.toLocaleLowerCase('tr').includes(needle))results.push({g,s,item});
    })));
    info.textContent=results.length+' ürün seçeneği'+(query?' · Arama: '+query:'');
    if(query)info.append(link('Aramayı temizle',url(group,selected?.id||'',''),'cat-clear'));
    if(current){
      const label=el('label','Alt grup','subcategory-select');const select=el('select');
      select.append(new Option('Tüm alt gruplar',''));current.subs.forEach(s=>select.append(new Option(s.ad,s.id)));select.value=selected?.id||'';
      select.addEventListener('change',()=>location.assign(url(group,select.value)));label.append(select);root.append(label);
    }
    if(!results.length)root.append(el('p','Eşleşen ürün bulunamadı. Aramayı değiştirebilir veya genel görüşme talebi bırakabilirsiniz.','cat-empty'));
    const list=el('div',null,'product-options');
    results.forEach(({g,s,item})=>{
      const row=el('article',null,'product-option'); const body=el('div',null,'product-copy');
      const figure=el('figure',null,'product-photo');
      const image=el('img');image.src=item.gorsel;image.alt=(item.satir||item.ad).split(' · ')[0]+' — temsili ürün görseli';image.width=480;image.height=480;image.loading='lazy';image.decoding='async';
      if(item.gorselTuru==='kategori')image.alt=g.ad+' — kategori görseli';
      figure.append(image,el('figcaption',item.gorselTuru==='kategori'?'Kategori görseli':'Temsili görsel'));
      const parts=(item.satir||item.ad).split(' · ');
      body.append(link(g.ad+' / '+s.ad,url(g.g,s.id,''),'product-path'),el('h2',parts[0]));
      if(parts.length>1)body.append(el('p',parts.slice(1).join(' · '),'product-spec'));
      const picker=brandPicker(s.id);
      if(picker)body.append(picker);
      row.append(figure,body,add(g.ad,item.satir||item.ad,'Teklif listeme ekle',picker?.querySelector('select')));list.append(row);
    });root.append(list);
  }).catch(()=>{
    root.replaceChildren(el('p','Katalog şu anda yüklenemedi. Lütfen yeniden deneyin veya bizimle iletişime geçin.','cat-empty'),link('İletişime geçin','/iletisim','btn'));
  });
})();
