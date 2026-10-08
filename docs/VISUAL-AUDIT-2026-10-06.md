# Ferrapro: canlı görsel denetimi

5-6 Ekim 2026. Test/inceleme; canlı dosyalar değiştirilmedi.

## Ana sonuç

D1 Çöp Poşetleri, D2 Sarf Malzemeleri ve D3 Kullan At Ürünler görsellerinin içinde krem fon var. Ana D görseli beyaz, alt gruplar düzelmemiş. inner.css:52 kapsayıcı rengi #ddd6cc; opak dosya içindeki krem fonu CSS düzeltmesi tek başına gidermez. Islak Havlular kolajında ayrıca kumaş zemini var.

## Kapsam ve doğrulama

- Canlı katalog 448 ürün; 430 benzersiz ürün görseli ve 27 kategori kolajı = 457 URL. Hepsi HTTP 200, yerel dosyayla SHA-256 eşit.
- 430 ürün görseli 11 karşılaştırma sayfasında görsel olarak tarandı; belirgin şüpheli örnekler büyütüldü. 10 ana sayfa/hizmet görseli ayrıca incelendi.
- Piksel taraması yalnız aday buldu; dört köşe sıcak farkı üç krem kolajı işaretledi. Dosya içi sahne/dekupe izleri ayrıca gözle incelendi.
- 14 temel/kategori sayfası 200, olmayan sayfa 404. /yonetim/talepler girişsiz 401; yeni yönetim sürümü henüz yayımlanmadı.
- 1440px sarf kategori ekranı, 390px kategori/ürün/form akışı kontrol edildi. MRP mini poşet bilgisi forma taşındı; yalnız firma/telefon zorunlu. Taşma ve bu akışta konsol hatası yok. Gerçek form gönderilmedi.
- npm run check PASS; işlev testleri görsel onay anlamına gelmez.

## Öncelikli görsel iş listesi

- **P1 / Krem fon**: [daire-cop-poseti.webp](https://ferrapro.com/img/products/daire-cop-poseti.webp) — Çöp Poşetleri kolajı; dört köşede sıcak krem renk.
- **P1 / Krem fon**: [daire-sarf.webp](https://ferrapro.com/img/products/daire-sarf.webp) — Sarf Malzemeleri kolajı; krem fon ve sıcak gölge.
- **P1 / Krem fon**: [daire-kullan-at.webp](https://ferrapro.com/img/products/daire-kullan-at.webp) — Kullan At Ürünler kolajı; sarımsı zemin.
- **P2 / Farklı fon**: [daire-islak-havlu.webp](https://ferrapro.com/img/products/daire-islak-havlu.webp) — Islak Havlular kolajında beyaz kumaş kıvrımları.
- **P1 / Kesim kalıntısı**: [finish-parlatici.webp](https://ferrapro.com/img/products/finish-parlatici.webp) — Sağ kenarda mavi parça, sol altta siyah üçgen; alt kenarda düz kesilme. Kayıt: p-050.
- **P1 / Dekupe hatası**: [ozopak-el-yikama.webp](https://ferrapro.com/img/products/ozopak-el-yikama.webp) — Gri fotoğraf zemini üzerinde beyaz basamaklı silme izleri. Kayıt: p-023,p-024.
- **P1 / Dekupe hatası**: [ozopak-el-sabunu-5kg.webp](https://ferrapro.com/img/products/ozopak-el-sabunu-5kg.webp) — Benzer gri dikdörtgen fon ve silme izleri. Kayıt: p-039.
- **P2 / Sahne fonu**: [belinno-hareketli-havlu.webp](https://ferrapro.com/img/products/belinno-hareketli-havlu.webp) — Banyo/tezgâh sahnesi diğer beyaz ürün kartlarıyla uyumsuz. Kayıt: p-325.
- **P2 / Renkli fon**: [belinno-ev-tipi-rulo-6.webp](https://ferrapro.com/img/products/belinno-ev-tipi-rulo-6.webp) — Ürün arkasında belirgin mavi/mor daire. Kayıt: p-005.
- **P2 / Renkli fon**: [tela-kolluk.webp](https://ferrapro.com/img/products/tela-kolluk.webp) — Tüm görseli dolduran açık mor/gri zemin. Kayıt: p-121.
- **P2 / Renkli fon**: [sleepy-herbal-lavanta.webp](https://ferrapro.com/img/products/sleepy-herbal-lavanta.webp) — Morumsu dikdörtgen ve altta ek 100 işareti. Kayıt: p-011.
- **P2 / Gri fon**: [irmak-stick.webp](https://ferrapro.com/img/products/irmak-stick.webp) — Beyaz kart içinde açık gri kare belirgin. Kayıt: p-176.
- **P2 / Gri fon**: [palex-mini-icten-tuvalet.webp](https://ferrapro.com/img/products/palex-mini-icten-tuvalet.webp) — Metal aparatın arkasındaki açık gri kare belirgin. Kayıt: p-135.
- **P2 / Fotoğraf kenarı**: [islak-mop-aparat-ekstra.webp](https://ferrapro.com/img/products/islak-mop-aparat-ekstra.webp) — Üst ve sağ çizgiler ürün fotoğrafından kalmış. Kayıt: p-432.
- **P2 / Fotoğraf kenarı**: [islak-mop-aparat.webp](https://ferrapro.com/img/products/islak-mop-aparat.webp) — Sağda ince dikey çizgi. Kayıt: p-433.
- **P2 / Fotoğraf kenarı**: [palet-aparat.webp](https://ferrapro.com/img/products/palet-aparat.webp) — Sağda ince dikey çizgi. Kayıt: p-435.
- **P2 / Tanıtım görseli**: [lecoo-kb101-siyah.webp](https://ferrapro.com/img/products/lecoo-kb101-siyah.webp) — Ürün küçük; model yazısı ve logo görüntü alanını dolduruyor. Kayıt: p-417.
- **P2 / Ölçek**: [koroplast-lavanta-orta.webp](https://ferrapro.com/img/products/koroplast-lavanta-orta.webp) — Ürün görsel alanının küçük bir kısmını kullanıyor; paket yazısı okunamıyor. Kayıt: p-359.
- **P2 / Ölçek**: [parex-pedalli-otomatik.webp](https://ferrapro.com/img/products/parex-pedalli-otomatik.webp) — Ürün ve ambalaj çok küçük yerleştirilmiş. Kayıt: p-349.
- **P2 / Ölçek**: [karton-kahve-bardagi.webp](https://ferrapro.com/img/products/karton-kahve-bardagi.webp) — Çoklu boy gösterimi küçük; tek ürün kartında seçim belirsizliği yaratıyor. Kayıt: p-444.

## Diğer kalan işler

- Ürün başlığı ve açıklamada ölçü biçimi tutarsız: p-093 başlıkta cm / L, açıklamada Cm / 20Lt.
- Talep yönetiminin Ferrapro'ya taşınması için giriş tercihi ve yayın bekliyor.
- Önceki devir notlarına göre Analytics Engine etkinleştirme, saklama süresi/aktarım mekanizması, eksik ürün özelliklerinin üretici teyidi açık. Bu turda sağlayıcı paneli veya hukuki süreç yeniden denetlenmedi.
- Ayfer e-posta teslimini doğruladı; Ramazan teyidi yok.

## Sınırlar ve düzeltme ölçütü

Bu 20 dosya öncelikli düzeltme listesidir; diğer her fotoğrafın kusursuz olduğu iddia edilmez. Tüm marka logoları, her sayfanın her ekran kırılımı ve tam uçtan uca gönderim bu tur kapsamında değil. Kategori/ürün görsellerinde beyaz fon, ürün kimliği korunmuş temiz kenar, yakın ölçek ve hafif nötr gölge hedeflenmeli. Gıda paketleri ve beyaz ürünlerin kendi renkleri fonla birlikte silinmemeli. Düzenlemeler gerçek katalog ürünlerini korumalı.

Yerel kanıtlar output/visual-audit/: cream-desktop.png, cream-mobile.png, categories.jpg, products-01..11.jpg, home.jpg, assets.json, pages.json, pixels.json, findings.json ve CSV. Ayrı Canvas raporu mevcut. Bu dosyalar rapor kanıtı, üretim varlığı değildir.
