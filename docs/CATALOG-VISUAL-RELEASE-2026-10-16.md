# Katalog görselleri ve çöp kovası vitrini — 16 Ekim 2026

## Kapsam ve sonuç

- 630 ürünün 612 benzersiz kaynak görseli 11 karşılaştırma sayfasında gözle tarandı. Şüpheli görseller ayrıca büyütüldü.
- 34 görselde fon, dış gölge, fotoğraf kenarı veya tanıtım boşluğu temizlendi. Kaynak ürün pikselleri kullanıldı; etiketler yeniden üretilmedi.
- Üreticinin ürün kartları koduyla ayrıştırılarak 178 Palex görseli yeniden doğrulandı ve katalogda ayrı `-verified.webp` yollarına taşındı. Önceki aktarım yalnız belirli resim klasörlerini yakalayıp bağımsız kod/resim listelerini birleştiriyordu; atlanan resimler sonraki ürünlerin yanlış fotoğraf almasına yol açıyordu.
- Belinno p-005 ve p-325 için daha önce doğrulanan `-white.webp` dosyaları korunuyor.
- Otomatik maskenin eldiven, şeffaf ambalaj veya yazı sildiği adaylar reddedildi. Ambalajın kendi rengi/ürünün iç gölgesi fon olarak silinmedi. p-556 için sorunlu yeni kesim yerine mevcut sağlam beyaz fonlu kaynak korundu.
- C3 listesi 23 tip örneği gösterir. 80 L plastik ve 800 L metal konteynerlerde kapasite kalır. Diğer örneklerde ölçüler gizlidir. Kolon, lobi ve şampanya küllükleri sondadır.
- Bütün 630 ürün kimliği ve eski ürün URL'leri korunur. Liste sadeleştirmesi fiyat/yönetim kayıtlarını silmez. Katalog kayıtları yerine `katalogVitrin` ve `katalogSunum` sunum kuralları kullanılır.

## Kalıcı kaynaklar

- `public/katalog.json`, `public/img/products/`, `public/site.js`, `public/catalog-ui.js` kaynak kabul edilir.
- `tools/catalog-visual-manifest.json`: 215 ürün için beklenen görsel yolu ve SHA-256; eski görsele dönüşü yakalar.
- `node tools/check_catalog_visuals.mjs [public-dizini]`: görüntü dosyası/yolu, 23 tip, küllük sırası ve eski URL kontrolleri.
- `node tools/sync_catalog_release.mjs <yayın-dizini>`: güncel canlı tabana yalnız katalog dosyaları ve referans verilen görselleri aktarır. Worker/panel/giriş kodunu kopyalamaz; yönetim kataloğunda yalnız görsel alanlarını değiştirir.
- `npm run build:public` ve `npm run check` çalıştırılmalıdır. Görsel kontrol testlerin yerine geçmez; testler de görsel kontrolün yerine geçmez.

## Yayın güvenliği ve Cursor devamı

Bu işin yalıtılmış paketi `output/catalog-cleanup-2026-10-16/release` içindedir. Tabanı canlı `dec3b456-4f24-49db-878b-f7ad52b724d5` sürümüdür. Tabanın 1366 dosyası tarandı; erişilebilir dosyalarda farklılık/hata bulunmadı. Korumalı yönetim dosyaları bilinen tabandan korunmuştur.

Worker SHA-256: `87198995340a418914240f8769b275482843eedd98e54b97d9aa52d4ad4dc320`.

**Yerel kök Worker'ı bu görsel işinin devamı diye yayımlamayın.** Orada ayrı oturum/güvenlik işleri bulunuyor. `--keep-vars` kullanın. Panel, fiyatlar, giriş kodları ve oturum bağları bu kapsamda değişmez.

Yayın öncesi son canlı sürümü tekrar kontrol edin. Başka yayın olduysa güncel tabanı alıp yalnız katalog katmanını taşıyın. Her yayın paketinde `node tools/check_catalog_visuals.mjs <paket>/public` geçmelidir. Eski `output/belinno-release` paketini yeniden yayımlamayın. `output/palex-release` ancak ortak takipte güncellendiği doğrulandıysa kullanılmalıdır.

Kanıtlar (yerel, Git dışı): `output/catalog-cleanup-2026-10-16/` altında tarama sayfaları, öncesi/sonrası görselleri, üretici kaynak eşlemeleri, masaüstü/mobil ekran görüntüleri ve canlı doğrulama kaydı bulunur. Yayın durumu için HANDOFF.md başındaki Ortak takip bölümünü esas alın.
