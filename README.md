# FerraPro

Kurumsal tedarik için ürün keşfi, teklif listesi ve görüşme talebi sitesi.
Online sipariş veya ödeme alınmaz. Müşteri miktar belirtmeden, hatta ürün seçmeden iletişim talebi oluşturabilir.

## Başlangıç

Node.js 22 veya üstü kullanın.

```sh
git fetch origin
git switch codex/visual-refresh
git pull --ff-only
npm run preview
```

Önce `git status` kontrol edin; başka bir yerel çalışma varsa onu ezmeyin.
Önizleme varsayılan olarak http://127.0.0.1:8789 adresindedir. PowerShell'de `$env:PORT='8793'` ile port değiştirilebilir.
Statik önizlemede API yoktur: gönderim 404 döner. Başarılı form gönderimi için Worker ortamı gerekir.

```sh
npm run check
```

## Kod haritası

- public/site.js: ortak menü, kategori eşleme kuralları, teklif formu.
- public/catalog-ui.js: ana kategori → alt grup → ürün listesi ve arama.
- public/interest.js: isteğe bağlı ürün/grup listesi; yalnızca ürün seçimlerini tarayıcıda saklar.
- public/katalog.json: maliyet içermeyen halka açık ürünler.
- public/site.css, home.css, inner.css: ortak, ana sayfa ve iç sayfa stilleri.
- src/worker.js: alan adı ayrımı ve API. Ferranoi paneli de buradadır.
- tools/preview_site.mjs: yerel statik önizleme.
- docs/HANDOFF.md: güncel durum, testler, yayın farkı ve kalan işler.

## Yayın

GitHub push otomatik yayın yapmaz; CI yalnızca kontrolleri çalıştırır.
Yetkili ve ilgili sürüm için onaylı yayın komutu:

```sh
npx --yes wrangler@4.131.2 deploy
```

Bu komut ferrapro.com, www.ferrapro.com ve tedarik.ferranoi.com alan adlarının bağlı olduğu aynı Worker'ı yayımlar. Panel etkisini incelemeden çalıştırmayın. Secret'lar Cloudflare ortamında tutulur, repoya eklenmez.

## Cursor ile kalan katalog işi
Güncel öncelik listesi: [docs/CURSOR-NEXT.md](docs/CURSOR-NEXT.md). Görsel eşleştirme: `python tools/assign_product_images.py`; eksik görseller `docs/product-images-pending.json` dosyasına yazılır. Hazır WebP görselleri yeniden üretmeyin.
