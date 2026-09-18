/* Public, optional interest list. Stores product descriptions only, never contact data. */
window.FerraInterest = (() => {
  const key = 'ferrapro-interest-v1';
  let rows = [];
  let persistent = true;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) rows = saved.filter(x => x && typeof x.name === 'string' && typeof x.group === 'string' && x.name.length <= 300 && x.group.length <= 50).slice(0, 20);
  } catch { persistent = false; }
  const summary = () => rows.length ? 'İlgilendiğim ürünler / gruplar:\n' + rows.map(x => `${x.group}: ${x.name}`).join('\n') : '';
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(rows)); } catch { persistent = false; }
    mount();
  }
  function notify(message) {
    let status = document.getElementById('interest-status');
    if (!status) {
      status = document.createElement('p');
      status.id = 'interest-status';
      status.className = 'interest-status';
      status.setAttribute('role', 'status');
      document.body.append(status);
    }
    status.textContent = message;
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => { status.textContent = ''; }, 7000);
  }
  function add(group, name) {
    if (rows.some(x => x.group === group && x.name === name)) {
      notify('Bu seçim zaten teklif listenizde.');
      return;
    }
    const previous = rows;
    rows = [...rows, {group, name}];
    if (rows.length > 20 || summary().length > 1600) {
      rows = previous;
      notify('Listeniz doldu. Talebinizi gönderebilir, diğer ihtiyaçlarınızı görüşmede paylaşabilirsiniz.');
      return;
    }
    persist();
    notify(persistent ? 'Teklif listenize eklendi. Ürün seçmeye devam edebilirsiniz.' : 'Eklendi. Tarayıcı kaydı kapalı; sayfadan ayrılmadan önce listeyi gönderin.');
  }
  function mount() {
    document.querySelectorAll('[data-interest-count]').forEach(el => { el.textContent = rows.length; });
    const review = document.getElementById('interest-review');
    if (!review) return;
    review.replaceChildren();
    const title = document.createElement('h2'); title.textContent = 'Teklif listeniz';
    const lead = document.createElement('p');
    lead.textContent = rows.length ? 'Seçimleriniz talebinize otomatik eklenecek. Miktarları görüşmede netleştirebiliriz.' : 'Ürün seçmeden de görüşme talebi bırakabilirsiniz. İsterseniz katalogdan ürün veya ürün grubu ekleyin.';
    const link = document.createElement('a'); link.href='/urunler'; link.textContent='Katalogdan seçim yapın →';
    review.append(title, lead);
    const ul = document.createElement('ul');
    rows.forEach((row, index) => {
      const li = document.createElement('li');
      const text = document.createElement('span'); text.textContent = `${row.group} · ${row.name}`;
      const remove = document.createElement('button'); remove.type='button'; remove.textContent='Kaldır';
      remove.setAttribute('aria-label',row.name+' seçimini kaldır');
      remove.addEventListener('click',()=>{
        rows.splice(index,1); persist();
        const buttons = review.querySelectorAll('button');
        (buttons[Math.min(index,buttons.length-1)] || review.querySelector('a'))?.focus();
      });
      li.append(text,remove); ul.append(li);
    });
    review.append(ul,link);
  }
  return { add, summary, mount, clear() { rows=[]; persist(); } };
})();
