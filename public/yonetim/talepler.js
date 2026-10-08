(() => {
  const root=document.getElementById('requests');
  async function api(path,body){
    const response=await fetch(path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'content-type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})});
    if(response.status===401){location.assign('/yonetim/talepler');throw Error('Oturum sona erdi.');}
    const result=await response.json();
    if(!response.ok)throw Error(result.error||'Talepler yüklenemedi.');
    return result;
  }
  api('/yonetim/api/talepler').then(result=>window.FerraQuoteTracking.mount(root,result.talepler,body=>api('/yonetim/api/takip',body),true)).catch(error=>{
    root.replaceChildren();const message=document.createElement('p');message.setAttribute('role','alert');message.textContent=error.message;
    const retry=document.createElement('button');retry.textContent='Tekrar dene';retry.className='btn';retry.addEventListener('click',()=>location.reload());root.append(message,retry);
  });
})();
