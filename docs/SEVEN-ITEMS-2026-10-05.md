# Kalan yedi başlık — 5 Ekim 2026

Bu paket yerel/PR aşamasındadır; canlı sürüm halen f5818466-36a7-49c3-8abd-a4af85a43ad7.

## 1. Talep bildirimi

Talep önce KV'ye yazılır, ardından iki yetkili alıcıya ayrı bildirim gönderilir. Gönderen info@ferrapro.com; alıcılar kullanıcı tarafından bu görüşmede açıkça seçildi ve Cloudflare doğrulanmış hedef listesinde kontrol edildi. Özel alıcı adresleri halka açık repoya yazılmaz; `QUOTE_NOTIFY_TO` secret'ından okunur. Bildirimde yalnız UUID/tarih/panel bağlantısı vardır. E-posta hatası başarılı kaydı başarısız göstermez. 30 günlük bildirim durum kaydı gönderildi/kısmi/başarısız olarak tutulur. Otomatik tekrar gönderimi yoktur; belirsiz teslimatta tekrar e-posta üretmez.

Yayın sırasında `output/seven-items/notification-secrets.local.json` içeriği Worker secret'ına aktarılmalı. Bu dosya yalnız yereldedir ve ignore edilir. `QUOTE_EMAIL` binding ve `QUOTE_NOTIFY_FROM` wrangler.toml içinde hazır. Dry-run derleme geçti; gerçek gönderici doğrulaması ve iki posta kutusuna teslim testi canlı yayın sonrası yapılmalı. Cloudflare Email Routing ayarlarını okuma çağrısı mevcut token ile 403 döndü; doğrulanmış alıcı listesi okunabildi. Yapılandırmanın derlenmesi gerçek teslim kanıtı değildir.

## 2. Katalog/Git eşitliği

448 ürün, 6 ana grup, 21 alt grup; 475 üretilmiş katalog sayfası ve 481 sitemap URL'si. Mevcut canlı ürün/görsel kapsamı Git'e taşınır; 354 ürünlü eski taban kaldırılır. Halka açık metadata ve sıfır finansal yer tutuculu yönetim başlangıç kataloğu eşleşir. `check_public_data.mjs` beklenmeyen halka açık alanı ve finansal değerlerin public Git'e eklenmesini reddeder. Panel kaynakları ve bitmemiş yönetim UI değişiklikleri bu pakete alınmaz.

## 3. Ürün içeriği

448 açıklama mevcut halka açık ad/marka/ölçü/renk/ambalaj alanlarından oluşturuldu. Bunlar yeni teknik özellik doğrulaması sayılmaz. İki ürün için üretici kaynağıyla ek bilgi doğrulandı; kaynaklar ve ürüne uygulanması ayrıca incelenecek eksik alanlar `product-content-sources.json` içinde. Stok, teslimat, paket adedi veya model uyumluluğu tahmin edilmedi. Tüm ürünlerin eksik teknik özelliklerinin bağımsız doğrulaması tamamlanmış değildir.

## 4. Dönüşüm ölçümü

Cloudflare Analytics Engine kullanılır; olay/sabit sayfa türü dışında bilgi gönderilmez. Olaylar: sayfa görüntüleme, form başlangıcı/denemesi/hatası, WhatsApp/telefon tıklaması, sonuçsuz arama. Başarılı kayıt yalnız sunucuda sayılır; istemci bu olayı üretemez. Ölçüm çerezi, kullanıcı kimliği veya ham arama metni yoktur. DNT/GPC tarayıcı olaylarını durdurur. Bu sayılar tekil ziyaretçi veya aynı kişinin hunisi değildir; WhatsApp tıklaması mesajın gönderildiğini kanıtlamaz. Botlar ve tekrar ziyaretler sayılabilir; oranlar bu sınırlamayla yorumlanır.

Yayından sonra Cloudflare Analytics Engine SQL ekranı veya `npm run analytics:report -- 30` ile toplu olay raporu alınır. CLI için Analytics Engine okuma yetkili yerel token gerekir; frontend'e token koyulmaz. KVKK sayfasında ölçüm açıklanır. [Cloudflare fiyatlandırma](https://developers.cloudflare.com/analytics/analytics-engine/pricing/) ve [başlangıç rehberi](https://developers.cloudflare.com/analytics/analytics-engine/get-started/).

## 5. Spam koruması

İletişim için dakikada 20, ölçüm için 120 deneme sınırı; yalnız bu anonim endpoint'lere uygulanır. Günlük değişen IP özeti sayaç anahtarıdır. Ofislerin paylaşılan IP kullanımı nedeniyle aşırı düşük eşik kullanılmadı. Limitler Cloudflare konumu bazındadır; küresel kesin kota veya tam bot engeli değildir. Honeypot/kaynak/alan doğrulaması korunur; gövde akış halinde en fazla 12 KB okunur. Limit aşımında 429/Retry-After, hizmet hatasında 503 dönülür. [Rate limit kaynağı](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

## 6. KVKK işlemleri

`PRIVACY-OPERATIONS.md` veri envanteri, başvuru/aylık inceleme/imha adımlarını ve 6/12/24 ay seçeneklerini açıklar. Kullanıcı süre seçeneklerini görmek istedi; karar bekleniyor. `tools/purge_quote.mjs` yalnız açıkça onaylanmış tek yeni talebi UUID ile silmek için hazır; varsayılan dry-run hiçbir ağa erişmez. Ortak panel state'i veya başka müşteri verisi değiştirilmez. Yurt dışı aktarım mekanizması ve sağlayıcı sözleşmeleri şirketin yetkili/hukuk incelemesini gerektirir; tamamlandı sayılmaz. Mevcut kayıtlar silinmedi.

## 7. Referanslar

Kullanıcı Swissmed Group, Piazza Demlik Cafe ve Café Zùri ad/logo kullanımının güncel ve izinli olduğunu bu görüşmede doğruladı. Ana sayfaya üç logolu referans alanı ve footer bağlantısı eklendi. Müşteri yorumu, ölçülmemiş sonuç veya yeni referans uydurulmadı.

## Yayın ve doğrulama

İzole testler: hız sınırı, 12 KB gövde sınırı, alıcı izolasyonu, e-posta hatasında kayıt korunması, ölçüm alan izin listesi, DNT, mevcut eşzamanlı talep ve panel API birleşimi. npm run check ve masaüstü/mobil görünüm kontrol edilir. Gerçek form → üretim KV → yetkili panel → iki posta kutusu testi bu sürümün canlı yayın onayından sonra yapılacak; şu aşamada gerçekleştiği iddia edilmez.
