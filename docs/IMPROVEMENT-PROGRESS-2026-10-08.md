# Ferrapro iyileştirme ilerlemesi — 8 Ekim 2026

## Hazır, henüz canlı değil

- Önceki 715ba78: müşteri kategorilerindeki harf rozetleri kaldırıldı.
- Ferrapro HTTP istekleri HTTPS 308; www GET/HEAD istekleri ana domaine 308. Yol/sorgu korunur. Yazma isteklerinde origin değişmez. Ferranoi panel yönlendirmesine dokunulmadı.
- HSTS (yalnız HTTPS, alt alan adı/preload yok), nosniff, referrer policy, frame/object/base CSP ve kamera/mikrofon/konum kısıtlamaları. CSP henüz script-src içermez; nonce/script kısıtlaması ayrı iş.
- Yönetimde rastgele bağımsız oturumlar; 8 saat mutlak sunucu süresi; Durable Object ile çıkışta tutarlı iptal; ayar değişince eski oturum reddi; tüm yönetim yanıtlarında no-store.
- Yönetim girişinde IP başına Cloudflare konumu başına 10/60 saniye sınırı, Origin kontrolü, akış halinde 4096 bayt gövde sınırı. Eksik ayar veya erişilemeyen oturum deposunda giriş kapalı (503).
- Kaynak kodun sabit yönetim şifresi yedeği kaldırıldı. Canlı şifre değiştirilmedi veya okunmadı. Ferranoi kullanıcı şifreleri ve /api/login davranışı değişmedi.
- Kategori/alt kategori ilk HTML içeriğinde gerçek public ürün bağlantıları var; yalnız public katalog kullanıldı. SEO ölçü bilgileri mevcut arayüz normalizasyonuyla eşitlendi; URL'ler değişmedi.
- Genel katalogda boş “İlgilendiğim grup” yerine anlamlı araştırma talebi; kategori seçilince kategoriye özgü metin korunur.
- A/D/E ana kategorilerinde gerçek kapsamla uyumlu üç kısa ürün seçim rehberi eklendi. Açılır alanda hem ilk HTML hem tarayıcı içeriğinde bulunur; ürün detayına ve arama sonuçlarına taşınmaz. site.js v140, catalog-ui v103, inner.css v98.
- Ana katalog masaüstünde 3+3 düzenine alındı; 1280 px satır konumları üçer eşit, taşma yok. Açık rehber 390 px taşmasız kontrol edildi.

## Yayın ön koşulları — atlanmamalı

1. Bu sürüme yönelik kullanıcı yayın talimatı alınmalı. Push yayın değildir.
2. `wrangler secret list` yalnız adlarla incelendi: SESSION_SECRET var, YONETIM_PASSWORD gizli ayar listesinde yok. Normal uzak ortam değişkenleri incelenmedi; hiçbir değer açılmadı. Güçlü ayrı YONETIM_PASSWORD güvenli kanaldan tanımlanıp operatörün bildiği doğrulanmadan bu güvenlik sürümü yayımlanmamalı. Şifreyi sohbete yazdırmayın veya kaynak yedeğinden kopyalamayın.
3. MANAGEMENT_SESSIONS / ManagementSessions ve v2-management-sessions SQLite DO migration + YONETIM_RATE_LIMITER gerekli. PRICE_STORE / v1 korunmalı. Mevcut oturumlar geçersizleşir, yeniden giriş gerekir; kayıtlar silinmez.
4. Önceki canlı METRICS yok notu nedeniyle gerçek binding ayarlarını tekrar kontrol edin; repodaki Analytics Engine ayarı otomatik yayına gerekçe değildir. Ortak Worker'da Cursor'un panel/Excel değişiklikleri ve canlı katalog farkı ayrıca uzlaştırılmalı.
5. Yayından sonra HTTPS/www yolları, fiyat/talep girişsiz 401, gerçek yönetim giriş/çıkış, iptal edilmiş oturum, Ferranoi panel regresyon kontrolü. Müşteri kayıtlarını dışarı aktarmayın; test mesajı göndermeyin.

## Tamamlanan doğrulama

- npm run check PASS; yeni check_public_security ve check_management_security check komutuna eklendi.
- Oturumlar arası ayrım, kopya cookie çıkış sonrası 401, sunucu süresi, nesne yeniden başlatma, limiter reddi/arıza, depo arızası, eksik ayar, bozuk cookie, büyük gövde ve yabancı Origin testleri.
- Fiyat kalıcılığı/eşzamanlı yazma/istemci taslak koruma ve talep akışı önceki testleri PASS; gerçek veriler kullanılmadı.
- Wrangler 4.131.2 deploy --dry-run derleme PASS, yayın yapılmadı.
- Yalnız public içerik kullanan yerel Worker önizlemesi: 1280 px A1 13 ürün; 390 px genel katalogda 0 rozet ve yatay taşma yok; genel araştırma bağlantısı düzeltildi. Bu önizleme gerçek Cloudflare DO alarm/dağıtık çalıştırma testi değildir.

## Sırada / kaldığımız yer

1. Güçlü yönetim ayarının güvenli kurulumu ve yayın öncesi üretim bağlama kontrolü.
2. Üç krem kategori görseli (daire-cop-poseti, daire-sarf, daire-kullan-at); önceki adaylarda ürün etiketleri değiştiği için doğrudan kullanmayın. public/inner.css ambalaj zemini de krem.
3. İlk üç kategori rehberi hazır; daha ayrıntılı ürün/sektör içerikleri, Search Console/İşletme Profili yetkili erişimi ve dönüşüm ölçümü kalan işlerdir.
4. Mobil gerçek hız ölçümü, dengeli kategori dizilimi; saklama/silme/yedek prosedürleri için işletme kararları.

Tüm iş bitmiş değildir. Bu dosya kullanım hakkı sonrası devam noktasıdır. Canlı yayın yapılmadı.
