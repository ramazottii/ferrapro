# Ferrapro müşteri deneyimi, güvenlik ve görünürlük denetimi

8 Ekim 2026. Canlı dış kontrol + çalışma ağacı kod incelemesi. Bu bir sızma testi veya KVKK uygunluk belgesi değildir. Kimlik bilgisi kullanılmadı, müşteri kayıtları açılmadı, form/e-posta gönderilmedi. Güvenlik bulguları saldırı kanıtı değildir.

## Genel sonuç

Ana mesaj ve iletişim çağrıları anlaşılır. Site açılıyor; denetlenen 11 HTML sayfası, robots ve sitemap 200. Bilinmeyen sayfa gerçek 404. Buna rağmen HTTPS zorunluluğu ve yönetim oturum tasarımı reklam bütçesinden önce ele alınmalı. Görsel tutarsızlıklar devam ediyor. SEO temel etiketleri mevcut; içerik derinliği ve ölçüm en büyük geliştirme alanı.

## Öncelikli güvenlik bulguları

1. **P1 — HTTP kapanmamış (canlı doğrulandı).** `http://ferrapro.com/` yönlendirmesiz 200 dönüyor. İncelenen HTTPS yanıtta HSTS de yok. Tüm Ferrapro yollarında HTTP → HTTPS zorunlu olmalı; HTTPS doğrulandıktan sonra HSTS uygulanmalı. Özellikle form/giriş yolları test edilmeli. Ortak Ferranoi panelinin davranışı ayrı korunmalı.
2. **P1 — Yönetim oturumları güçlendirilmeli (kaynak kod).** `src/worker.js` yönetim tokenını sabit girdilerle üretiyor; sunucuda süre sonu kontrolü ve çıkış sonrası token iptali yok. Tarayıcıdaki 30 günlük cookie ömrü tek başına sunucu güvenliği sağlamaz. Rastgele/sona eren oturumlar ve sunucu tarafında iptal gerekli. Mevcut oturumların planlı yenilenmesi gerekir.
3. **P1 — Varsayılan giriş ve deneme sınırlaması (kaynak kod, canlı ayarlar doğrulanmadı).** Yönetim şifresi ortamda bulunmazsa sabit yedek değer kullanılıyor. Uygulamadaki yönetim girişinde deneme sınırlaması görünmüyor; Cloudflare dış kuralları incelenmedi. Yedek giriş kaldırılmalı, güçlü ayrı sır zorunlu tutulmalı, giriş denemeleri sınırlandırılmalı; mümkünse kişisel hesap/MFA. Şifre değeri rapora alınmadı veya denenmedi.
4. **P2 — Güvenlik başlıkları.** İncelenen ana sayfa yanıtında CSP, X-Content-Type-Options, Referrer-Policy ve frame koruması yok. Mevcut satır içi kodlar ve görsellerle uyumlu politika önce önizlemede test edilmeli. Eksik başlık tek başına veri sızıntısı ispatı değildir.
5. **P2 — Veri yaşam döngüsü.** KVKK sayfası var, fakat saklama süresinin işletmece belirlenmesi ve otomatik silme/erişim/yedekten geri dönüş prosedürleri tamamlanmalı. Hizmet sağlayıcıları ve veri aktarımları yetkili hukuk danışmanıyla değerlendirilmelidir. Bu denetimde hukuki uygunluk kararı verilmedi.

Olumlu: girişsiz `/yonetim/api/fiyatlar` ve `/yonetim/api/talepler` 401 + no-store dönüyor. Test paketi public/private ayrımı, talep kaydı, CSRF, fiyat eşzamanlılık ve hata halinde taslak korunmasını doğruluyor. Bu kontroller yukarıdaki oturum eksiklerini ortadan kaldırmaz.

## Müşterinin gördüğü eksikler

- **P2 — Krem fonlar:** canlı D grubu Çöp Poşetleri, Sarf Malzemeleri, Kullan At Ürünler görselleri beyaz tasarımla uyumsuz. Üç görselin kaynakları ve CSS içinde ambalaj fonu mevcut. Ürün görsellerinin yüklendiği doğrulandı; ilk yükleme boşluğu kalıcı bozuk görsel olarak sayılmadı.
- **P2 — Dört ürün görseli:** önceki a017517 sürümünde beyaz fonlu dosyalar hazırlandı, yayın kaydı yok. Bu denetimde dört dosyanın canlı hash karşılaştırması yapılmadı; yayınlandı varsayılmamalı.
- **P2 — Boş kategori metni:** `/urunler` sayfasında “Bu grupta” ifadesi ve “İlgilendiğim grup:” boş parametresi genel liste için uygun değil. Seçim yokken genel iletişim metni kullanılmalı.
- **P2 — Ürün metni tutarlılığı:** canlı p-001 meta açıklaması `21Cm` yazıyor. Ölçü birimleri başlık, kart ve SEO açıklamasında aynı normalizasyondan geçmeli.
- **P3 — Görsel hiyerarşi:** 1280 px yerel katalogda altı ana grup 5+1 diziliyor. Teknik taşma yok, fakat 3+3 düzeni daha dengeli olur. Mobil ana sayfada kategoriye erişmek için hero ve hikâye alanını geçmek gerekiyor; üstteki Ürünleri İncele bağlantısı bu mesafeyi kısaltıyor. Dönüşüm ölçülmeden rastgele yeniden tasarım yapılmamalı.
- **Tamamlandı / yayın bekliyor:** kategori üstündeki A–F rozetleri kaldırıldı. İç kategori kimlikleri, eski bağlantılar ve seçim mantığı korundu. 1280/390 px önizleme: altı kategori, sıfır kod rozeti, yatay taşma yok. Mobil menü ve havlu araması (38 sonuç) çalıştı.

## Google görünürlüğü: mevcut durum ve gerekli işler

**Mevcut:** sitemap 481 URL içeriyor; robots site haritasını bildiriyor. Örnek ana kategori, alt kategori ve ürünün ayrı title/description/canonical/H1 etiketleri var. Ana sayfada Organization, örnek katalog sayfalarında BreadcrumbList var. Schema olması tek başına üst sıra sağlamaz. Örnekleme tüm 481 sayfanın hatasız veya dizinde olduğunu kanıtlamaz.

1. **Ölçümü kur / doğrula:** Search Console domain doğrulaması, sitemap gönderimi, ana sayfa + 6 kategori + önemli ürünlerde URL denetimi. Haftalık gösterim, tıklama, sorgu, dizin durumu ve organik görüşme talebi izlenmeli. Bu hesaplara erişilmedi; kurulu değil veya dizinde yok diye sonuç çıkarılmadı.
2. **Tek tercih edilen adres:** `https://www.ferrapro.com/` da 200 dönüyor. Ana sayfanın canonical etiketi doğru, fakat www → ferrapro.com kalıcı yönlendirmesi daha tutarlı. Eski g/a/u ve /siparis bağlantıları korunmalı. Sırf harfleri URL’den silmek SEO önceliği değil.
3. **Kategori içeriğini geliştirme:** başlangıçta Temizlik Sarf, Temizlik Kâğıtları ve Gıda gruplarında gerçek ürünlere dayanan kullanım alanı, seçim ölçütleri, ölçü/ambalaj farkları, sık sorulan sorular ve ilgili ürün bağlantıları. Örnek arama niyetleri: İstanbul kurumsal temizlik malzemesi tedariki, ofis sarf ürünleri, kafe sarf malzemeleri. Bunlar arama hacmi ölçülmüş kelimeler değil, araştırılacak niyetlerdir.
4. **Sunucudan daha zengin katalog:** mevcut ilk HTML başlık, kısa açıklama ve iletişim bağlantısı içeriyor; gerçek ürün listesi ağırlıkla JavaScript ile geliyor. Kategori ürün bağlantıları ve temel özellikleri ilk HTML’de de sunmak keşfi ve yükleme dayanıklılığını iyileştirir. JavaScript kullanımı tek başına Google’ın okuyamadığı anlamına gelmez.
5. **Yerel görünürlük:** uygunluk şartları sağlanıyorsa Google İşletme Profili doğrulaması; şirket adı, telefon, adres, hizmet bölgesi tutarlı olmalı. Gerçek fotoğraflar ve gerçek müşteri yorumları; sahte puan/yorum yok. Profilin mevcut durumu incelenmedi.
6. **Güven veren içerik:** izinli üç referansa, müşterinin onayıyla kısa gerçek kullanım hikâyesi eklenebilir. Hizmet kapsamı, teklif süreci ve özel ürün araştırma desteği somut anlatılmalı; teyitsiz stok/teslimat garantisi yok.
7. **Hız ve dönüşüm:** PageSpeed/CrUX ile mobil LCP, INP, CLS başlangıç ölçümü; ardından hero/görsel boyutları, responsive görseller ve lazy loading kontrolü. Bu oturumda Lighthouse veya gerçek kullanıcı hız puanı ölçülmedi. WhatsApp tıklaması, form başlangıcı, başarılı kayıt ve nitelikli talep ayrı izlenmeli; tıklama satış sayılmamalı. Canlı analitik bağlantısı doğrulanmadı.

Google üst sıraları garanti edilemez. Çok sayıda benzer ilçe sayfası veya anahtar kelime tekrarı yerine az sayıda yararlı ve özgün sayfaya öncelik verilmeli.

## Uygulama sırası ve kabul ölçütleri

- **İlk yayın paketi:** HTTPS/yönetim güvenliği ayrı incelenmiş değişiklik; harf kodları ve hazır görseller. Giriş, çıkış, süre sonu, yanlış giriş sınırlaması, mevcut fiyat/talep erişimi ve Ferranoi paneli regresyon kontrolleri.
- **Sonraki hafta:** krem görseller, boş grup metni, ölçü yazımı; Search Console ve dönüşüm başlangıç değerleri. Test formu ancak gönderim kapsamı açıkken, gerçek müşteri kaydı kullanmadan.
- **Sonraki 2–4 hafta:** üç öncelikli kategori ve sektör içerikleri, işletme profili, mobil hız iyileştirmesi. Başarı ölçüsü yalnız sıra değil organik nitelikli görüşme talebi ve talep dönüşüm oranı.

## Kontrol kapsamı ve yayın durumu

13 canlı URL metadata kontrolü; ek HTTP/www/404/iki özel API kontrolü. Canlı ana sayfa dar ekran ve D kategorisi masaüstü; yerel 1280/390 px katalog, mobil menü/arama. Tüm tarayıcılar, 481 URL, dış hesaplar, gerçek e-posta teslimatı ve müşteriye ait veriler incelenmedi. `npm run check` PASS. Yalnız görünür kategori kodlarının kaldırılması uygulandı; güvenlik değişiklikleri yapılmadı. Bu sürüm canlıya alınmadı.

## Kaynaklar

- [Google: yararlı içerik](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: işletme bilgileri](https://developers.google.com/search/docs/appearance/establish-business-details)
- [Google: SEO başlangıç rehberi](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [OWASP: oturum yönetimi](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP: giriş güvenliği](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
