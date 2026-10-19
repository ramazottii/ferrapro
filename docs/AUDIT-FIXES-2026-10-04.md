# İnceleme düzeltmeleri — 4 Ekim 2026

Bu paket Ferrapro’nun ürün keşfi ve görüşme talebi akışını düzeltir. 5 Ekim 2026 tarihinde kullanıcı talimatıyla canlıya yayımlandı (Cloudflare f5818466-36a7-49c3-8abd-a4af85a43ad7). Mevcut ortak `codex/visual-refresh` dalı ve PR #1 kullanılır.

## Uygulananlar

- **F02:** Ürünün görüşme düğmesi adını/ölçüsünü/marka tercihini form notuna taşır. Konu formun üstünde ayrıca görünür. Tarayıcı depolaması kapalı olsa da bağlantı bağlamı taşır; firma/telefonla genel talep akışı korunur.
- **F03–F04:** Yeni talepler ortak `state` kaydını değiştirmeden ayrı `vitrin-quote:<UUID>` anahtarlarına yazılır. 200 kayıt kırpması kaldırıldı. Mevcut eski kayıtlar değiştirilmeden yetkili API okumasına birleştirilir. Panel ekranı, yetkileri ve giriş kodu değişmez; yalnızca talep okuma adaptörü eklenir. KV dağıtık tutarlılığı nedeniyle yeni kayıt panel okumasına gecikmeli yansıyabilir; bu depolama, atomik ortak sayaç iddiası taşımaz.
- **F05–F06:** Türkçe karakter toleranslı, kelime bazlı arama; sonuçsuz aramada aranan metni taşıyan araştırma talebi ve WhatsApp bağlantısı; kategoriye daraltılmış aramada tüm katalogda arama seçeneği.
- **F07:** Ürün detayında gerçek ürün görseli, bilgiler ve eylemler kategori/marka şeritlerinden önce gelir. Görsel büyütüldü, mobil ve masaüstü yerleşim düzenlendi.
- **F08–F09, F24:** Klinik sarf bağlantısı gerçek D2 grubuna; kafe servis bağlantısı D3’e gider. Soru işaretleri oklarla değiştirildi; yazıcı sarfı iddiaları mevcut bilgisayar/ofis kapsamına çekildi.
- **F10–F11, F18:** Halka açık katalogdan üretilen ürün/kategori başlığı, açıklaması, canonical, Open Graph, başlangıç HTML içeriği ve BreadcrumbList; ana sayfada doğrulanmış şirket kimliğiyle Organization. Bilinmeyen sayfa/ürün için gerçek 404. Arama sayfaları noindex. Sitemap mevcut katalogdaki dolu gruplar ve ürünleri kapsar. Eski yol yönlendirmeleri korunur.
- **F13:** Temizlik Kâğıtları adı, başlıklardaki ayraçlar ve ölçü birimleri düzeltildi. Kaynakta birimi olmayan çıplak sayıya litre/gram/cm uydurulmaz. Katalog ham verisi bu pakette değiştirilmedi.
- **F14:** Görsel büyütme yerel `dialog` kullanır; erişilebilir ad, Tab odağı, Escape ve açan öğeye odak iadesi vardır.
- **F16, F20–F21, F23:** Ortak talep düğmesi ve liste sayacı; sade mobil başlık; marka filtresi ve ad sıralaması; dokunmatiğe uygun yönlendirme; koşulsuz marka tedarik sözü kaldırıldı. Kategorilerde katalog dışı araştırma alanı eklendi.
- **F17:** Kullanıcının vergi levhasındaki resmi unvan/adres Hakkımızda, İletişim ve KVKK’ya işlendi; eski Ataşehir merkez ifadesi Ümraniye olarak düzeltildi. Hizmet süreci somutlaştırıldı. Vergi levhası, vergi numarası ve belge doğrulama kodu repoya eklenmedi.

## Kısmen tamamlanan / bilgi veya hizmet kurulumu gerektirenler

- **F01:** Veri sorumlusu, iletişim, amaç, yöntem ve başvuru/haklar metni yazıldı. Bu, hukuki uygunluk onayı değildir. Gerçek saklama politikası ve Cloudflare/iletişim servislerinin yurt dışı aktarım mekanizması şirket tarafından doğrulanmalıdır. Veri silme/arsiv politikası belirlenmeden otomatik süre veya silme kuralı eklenmedi. [KVKK Kurumu](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-).
- **F12:** Ürün açıklaması, eksik marka/ölçü/ambalaj bilgisi üretici veya tedarikçi doğrulaması gerektirir. 448 ürüne tahmini özellik yazılmadı.
- **F15:** Hafif bot tuzağı, kaynak denetimi, telefon/alan/gövde uzunluğu ve bozuk JSON kontrolleri eklendi. Cloudflare hız sınırlaması veya gerçek e-posta bildirimi kurulmadı; bunlar altyapı ve alıcı/servis ayarı gerektirir. Bot tuzağı tek başına kapsamlı spam koruması değildir.
- **F19:** KVKK ortak footerda görünür. Referansların kullanım izni/güncelliği doğrulanmadığından yeni referans veya daha güçlü sosyal kanıt iddiası eklenmedi.
- **F22:** Analitik sağlayıcısı ve mevcut hesap/çerez düzeni bilinmediğinden izleme servisi eklenmedi. Dönüşüm ölçümü kurulumu ayrı açık iştir.

## Doğrulama

- `npm run check`: çalışan 448 ürünlü yerel kopyada ve yalnızca commit kapsamını içeren 354 ürünlü temiz Git kopyasında başarılı.
- Yeni test: aynı anda 205 gönderim + önceki 1 kayıt korunur; 200 sınırı aşılır; eski kayıtlarla birleştirme ve sayfalı KV okuma doğrulanır. Geçersiz telefon, aşırı uzun not, bot alanı, farklı kaynak ve bozuk JSON reddedilir. Üretim KV’sine erişilmez.
- Sunucu testi: ürün/alt grup metaverisi, canonical, başlangıç HTML içeriği, sitemap, bulunamayan sayfa/ürün 404 ve eski kategori uyumluluğu.
- Tarayıcı: `kagit` 45 sonuç, Espiga filtresi 10 sonuç; ürün ve sonuçsuz arama bağlamı formda korunur; native dialog Tab/Escape/odak iadesi; 320/390 ve 1440 px görünüm. Gerçek form veya WhatsApp mesajı gönderilmedi.
- Ekran kanıtları yerel `output/audit-fixes` klasöründedir. Görseldeki geçici uygulama ekran üst boşluğu IAB çekim artefaktıdır.

## Git / yayın ayrımı

Göreve başlanırken yerel/canlı katalog 448, Git kataloğu 354 kayıttı. Önceden var olan ürün/görsel, yönetim, panel ve test genişletmeleri korunur, bu commit’e alınmaz. Üretilen `catalog-pages.json` ve sitemap her kopyanın kendi halka açık kataloğuyla eşleştirildi: yerelde 475 katalog sayfası / 481 sitemap URL’si; Git’te 380 / 386. Bunlar farklı katalog tabanlarının sonucudur.

Katalog veya sınıflandırma değişince **`npm run build:public`** çalıştırılmalı. `npm run check`, üretilmiş dosyalar bayat kaldığında hata verir. Yayında güncel yerel katalog/görseller korunmalı; Git’teki eski katalogla canlı 448 ürün üzerine yazılmamalı.

KV kayıtlarının görünürlük gecikmesi ve büyük veri hacminde liste okuma maliyeti devam eder. Talep hacmi büyüdüğünde sunucuda sayfalama/arşiv ekranı veya sorgulanabilir veri deposu değerlendirilmeli. Bu paketin temel garantisi yeni talebin başka talebin veya panel durumunun üzerine yazmamasıdır; eski kayıpları geri getirme iddiası yoktur.
