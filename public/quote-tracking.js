(() => {
  const stages={new:'Yeni',contacted:'Görüşüldü',quoted:'Teklif verildi',closed:'Sonuçlandı'};
  const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text!=null)node.textContent=text;if(cls)node.className=cls;return node;};
  const when=value=>value?new Date(value).toLocaleString('tr-TR'):'—';
  window.FerraQuoteTracking={mount(root,rows,save,editable){
    const drafts=new Map();
    root.replaceChildren();const section=el('section',null,'card quote-tracking');
    section.append(el('h2','Görüşme talepleri'),el('p','Talebin aşamasını, görüşme notlarını ve sonraki takip tarihini burada tutun.','muted'));
    const filters=el('div',null,'quote-filters'),search=el('input'),filter=el('select');
    search.type='search';search.placeholder='Firma veya telefon ara';search.setAttribute('aria-label','Firma veya telefon ara');
    filter.setAttribute('aria-label','Talep aşaması');const all=el('option','Tüm aşamalar');all.value='';filter.append(all);
    for(const [value,label]of Object.entries(stages)){const o=el('option',label);o.value=value;filter.append(o);}
    const count=el('p'),feedback=el('p'),list=el('div',null,'quote-list');feedback.setAttribute('role','status');filters.append(search,filter);section.append(filters,count,feedback,list);root.append(section);
    const draw=()=>{
      list.replaceChildren();const q=search.value.toLocaleLowerCase('tr');
      const visible=rows.filter(r=>(!filter.value||(r.followup?.stage||'new')===filter.value)&&`${r.firma} ${r.tel}`.toLocaleLowerCase('tr').includes(q));
      count.textContent=`${visible.length} / ${rows.length} talep`;
      if(!visible.length)list.append(el('p','Bu filtrede talep bulunamadı.','muted'));
      for(const r of visible){
        const current=r.followup||{stage:'new',note:'',next_contact:''},draft=drafts.get(r.id)||{stage:current.stage,note:'',next_contact:current.next_contact||''},card=el('article',null,'quote-card');
        card.append(el('h3',r.firma),el('p',`${r.tel} · ${r.yetkili||'Yetkili belirtilmedi'} · ${when(r.created_at)}`,'muted'),el('p',[r.grup,r.urun,r.not].filter(Boolean).join('\n'),'quote-original'));
        const form=el('form'),stage=el('select'),note=el('textarea'),date=el('input');
        for(const [value,label]of Object.entries(stages)){const o=el('option',label);o.value=value;stage.append(o);}stage.value=draft.stage;
        note.rows=3;note.maxLength=2000;note.placeholder='Yeni görüşme notu ekleyin';note.value=draft.note;date.type='date';date.value=draft.next_contact;
        const label=(text,input)=>{const l=el('label',text);l.append(input);return l;};
        form.append(label('Aşama',stage),label('Sonraki takip tarihi',date),label('Yeni görüşme notu',note));
        const status=el('p');status.setAttribute('role','status');const button=el('button','Kaydet');button.type='submit';button.className='btn';form.append(button,status);card.append(form);
        if(current.next_contact&&current.stage!=='closed'){
          const today=new Date().toLocaleDateString('sv-SE');card.append(el('p',`${current.next_contact<today?'Takip tarihi geçti':'Planlanan takip'}: ${current.next_contact}`,'quote-due'));
        }
        const history=el('details'),summary=el('summary',`Görüşme geçmişi (${(r.followup_history||[]).length})`);history.append(summary);
        for(const event of r.followup_history||[]){history.append(el('p',`${when(event.at)} · ${event.by} · ${stages[event.stage]||event.stage}\n${event.note||'Aşama/tarih güncellendi.'}`,'quote-history'));}
        card.append(history);list.append(card);
        for(const input of [stage,note,date,button])input.disabled=!editable;
        for(const input of [stage,note,date])input.addEventListener('input',()=>drafts.set(r.id,{stage:stage.value,note:note.value,next_contact:date.value}));
        stage.addEventListener('change',()=>{date.disabled=stage.value==='closed';});date.disabled=!editable||stage.value==='closed';
        form.addEventListener('submit',async e=>{
          e.preventDefault();button.disabled=true;status.textContent='Kaydediliyor…';
          try{const result=await save({id:r.id,stage:stage.value,note:note.value,next_contact:date.value});r.followup=result.event;r.followup_history=[result.event,...(r.followup_history||[])];drafts.delete(r.id);draw();feedback.textContent=`${r.firma}: takip bilgisi kaydedildi.`;}
          catch(error){status.textContent=error.message||'Kaydedilemedi; tekrar deneyin.';button.disabled=false;}
        });
      }
    };
    search.addEventListener('input',draw);filter.addEventListener('change',draw);draw();
  }};
})();
