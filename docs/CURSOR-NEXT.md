# Cursor devam raporu — 20 Eylül 2026

## Önce bunu oku
Kullanıcı kullanım hakkını korumak için yeni görsel üretimini durdurmamızı, hazır sürümü yayımlamamızı ve kalan işi Cursor'a bırakmamızı istedi. Baştan tasarlama, tamamlanan görselleri tekrar üretme. Önce AGENTS.md, README.md ve docs/HANDOFF.md oku; git fetch/status ile codex/visual-refresh dalını kontrol et. PR #1 aynı çalışmanın devamıdır.

## Amaç ve tasarım
Ferrapro kurumsal B2B tedarik ve görüşme sitesi. Sipariş, ödeme, sepet veya zorunlu üyelik yok. Ürün seçimi ve miktar isteğe bağlı; firma ve telefonla talep bırakılabilir. Lacivert, sıcak kırık beyaz, turuncu; büyük ürün fotoğrafları, dengeli kartlar, sade kurumsal metin, ölçülü hareket. Reduced-motion korunmalı. Telefon 0530 716 18 77, info@ferrapro.com, Ataşehir/İstanbul.

## Tamamlananlar
- 585 kamuya açık katalog kaydı: Hijyen 143, Temizlik 100, Kırtasiye 104, Mutfak 90, Ambalaj 49, PC 53, Sağlık 46. Bunlar stok/SKU sayısı değildir; eski ölçü varyantları ve yeni genel talep türleri birlikte bulunur.
- 91 WebP ürün ailesi görseli public/img/products içinde. Yeni üretilenler markasız temsili görsellerdir; özgün ürün fotoğrafı iddiası yok.
- Ürün kartlarında büyük görsel, başlık, varsa teknik/ambalaj satırı, teklif listesine ekleme. Masaüstü üç, tablet iki, küçük mobil tek sütun.
- Görseli henüz hazır olmayan satırda kategori fotoğrafı ve açıkça Kategori görseli etiketi. Bozuk dosya bağlantısı yok.
- Açık alt kategori kimlikleri, eski URL uyumluluğu, belirsiz satırların ayrı inceleme dosyasına taşınması.

## Öncelik sırasıyla kalan işler
1. docs/product-images-pending.json içindeki imageKey değerlerini benzersizleştir. Yalnız eksik anahtarlar için uygun görsel edin/üret. İzinli üretici fotoğrafı varsa tercih et; Avansas görsellerini izinsiz kopyalama veya hotlink yapma. Üretim istemleri docs/product-image-prompts.json içinde. Kullanım bütçesini koru: önce küçük parti, kontrol, sonra devam.
2. Görselleri public/img/products/KEY.webp olarak en fazla 640px, WebP yaklaşık kalite84 kaydet. tools/assign_product_images.py çalıştır; bekleyen liste otomatik küçülür. Python Pillow yalnız sıkıştırma için kullanıldı. tools/generated-image-paths.local.json makineye özeldir, repoda yok. Hazır WebP'ler doğrudan kullanılabilir.
3. Mevcut eşleşmeleri iyileştir: roller/jel kalem aynı tükenmez fotoğrafını; farklı marker türleri fosforlu kalemi; bazı dosyalar çıtçıtlı dosyayı; zımba teli/sökücü zımba makinesini; cetvel/pano/etiket varyantları ortak aile fotoğrafını kullanıyor. Bunları gerçek tür bazında ayır. Şarj adaptörü görselinde ABD tipi uç var; Türkiye/Avrupa tipiyle değiştir. Sağlık, içecek, dispenser ve ambalaj eşleşmelerini özellikle incele. Temsili etiketi alakasız görseli haklı çıkarmaz.
4. Katalog verisini temizle: eski varyantlarda tekrarlar ve eksik isimler var. docs/catalog-needs-identification.json teyit bekler. Belirsiz ürüne isim/marka/ölçü uydurma. 200×201 cm gibi şüpheli eski ölçüleri kaynakla doğrula. Sırf sayı artsın diye varyant ekleme.
5. Tüm yedi kategori ve alt gruplar için masaüstü/mobil görsel kalite kontrolü; arama ve boş sonuç; teklif listesine ekleme/çıkarma; ürün seçmeden form. Canlıya sahte talep gönderme. npm run check izole akışı test eder.
6. İleride SEO: parametreli kategori sayfalarının başlık/açıklama/canonical düzeni ve indekslenme yaklaşımını incele. Bugünkü görevde sunucu tarafı SEO çözümü yapılmadı.
7. Yasal şirket/veri sorumlusu adı, KVKK metni ve posta kutusu çalışırlığı kullanıcıdan gerçek bilgiyle tamamlanmalı. WhatsApp otomatik açılmadı.

## Çalıştırma ve yayın
npm run check; yerel npm run preview (PORT=8793 isteğe bağlı). Statik önizleme API göndermez. Yayın komutu README'de. Bu sürüm için kullanıcı canlı yayın izni verdi; sonraki değişikliklerde ilgili talimatı izle. Her yayının kaynak commit ve Cloudflare sürümünü HANDOFF'a yaz.

## Kesin sınır
Aynı Worker Ferranoi panelini de sunuyor. Panel, giriş, Selçuk hesabı, şifreler ve özel fiyat/maliyet verileri bu görevin dışında. Değiştirme. Private kaynaklardan public kataloğa veri aktarma. Cursor farklı yerel kopyadaysa kullanıcının değişikliklerini ezmeden bu dalı al.
