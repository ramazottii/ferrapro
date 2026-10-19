(() => {
  if (!['ferrapro.com','www.ferrapro.com'].includes(location.hostname)) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  const pages={'/':'home','/urunler':'catalog','/siparis':'request','/iletisim':'contact','/hakkimizda':'about','/sektorler':'sectors','/referanslar':'references','/kvkk':'privacy'};
  const page=pages[location.pathname.replace(/\/$/,'') || '/'] || 'other';
  const send=event=>{
    fetch('/api/olcum',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({event,page}),keepalive:true}).catch(()=>{});
  };
  window.FerraMetrics={send};
  send('page_view');
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('a'); if(!link)return;
    if(link.href.startsWith('https://wa.me/'))send('whatsapp_click');
    if(link.href.startsWith('tel:'))send('phone_click');
  });
  document.getElementById('siparis-form')?.addEventListener('input',()=>send('form_start'),{once:true});
})();
