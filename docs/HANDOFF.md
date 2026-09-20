# Devam notları — 18 Eylül 2026

## Kullanıcının kesinleştirdiği amaç

Ferrapro kurumsal tedarik için bir tanıtım, ürün keşfi ve görüşme sitesidir.
Ödeme ve online sipariş alınmayacak. Müşteri ürünleri tek tek yazmak zorunda kalmamalı.
Ürün, alt grup veya genel ihtiyaç seçimiyle görüşme kapısı açılacak; miktar zorunlu değil.
Temizlikdeposu.com'un ana kategori → alt grup → ürün mantığı örnek alındı; görsel, metin, marka veya ürün kataloğu kopyalanmadı.

## GitHub ve yayın ayrımı

- Repo: https://github.com/ramazottii/ferrapro
- Çalışma dalı: codex/visual-refresh
- Ana taban: ed1b1b4. Canlıya daha önce çıkarılmış tasarım, 9922607 commit'inde kayda alındı.
- Canlı Cloudflare sürümü: 033b09ca-f0f1-4cb1-bfb1-70c42ba3f66f.
- Önceki Cloudflare sürümü: 23127723-9754-435e-af14-4ec1b829eb29.
- Bu notla eklenen yeni katalog ve teklif listesi sürümü henüz canlıya alınmadı. GitHub PR üzerinden incelenecek.
- GitHub Actions yalnızca test çalıştırır, deployment yapmaz.

## Yeni akış

- /urunler: 7 ana kategori kartı, örnek alt grup bağlantıları ve ürün sayıları.
- /urunler?g=Temizlik: kullanımına göre 10 alt grup. Eski geniş sıvı/deterjan grubu ayrıldı; mop yanlış eşleşmesi düzeltildi.
- /urunler?g=Temizlik&a=sabun: ayrı alt grup listesi, kategori yolu, alt grup seçici.
- Arama kategori bağlamını korur; arama temizleme bağlantısı vardır.
- Ürün veya grup, Teklif Listem'e eklenir. Aynı seçim tekrarlanmaz, formda tek tek kaldırılabilir.
- Liste localStorage'da yalnızca ürün açıklamalarıyla saklanır. Firma, kişi, telefon saklanmaz.
- Mevcut Worker API'si değişmedi: seçimler not alanına aktarılır. Başarı onaylanınca liste temizlenir; hatada korunur.
- API'nin 2000 karakterlik not sözleşmesi nedeniyle liste en çok 20 seçim ve 1600 karakterle sınırlandırılır. Ek notla toplam sınır aşılırsa gönderim anlaşılır hata verir; içerik kırpılmaz.
- Firma ve telefon zorunlu. Ürün seçimi, kategori, miktar ve açıklama isteğe bağlı.
- /siparis mevcut bağlantılar bozulmasın diye korundu; sayfa işlevi yalnızca teklif/görüşme talebidir.
- Eski ?satir= ürün bağlantıları form notunu doldurmaya devam eder.

## Doğrulama

- npm run check: JS sözdizimi, 261 katalog satırı, mop/sabun/çamaşır/çay sınıflandırması, formda liste aktarımı, başarıda temizleme ve hatada koruma; Worker'ın bellek KV adaptörüyle talep/panel API testi.
- Tarayıcı: ana kategori → sabun alt grubu → ekle → tekrar ekle → form; mükerrer seçim eklenmedi, seçim sayfalar arasında taşındı.
- Statik önizlemede başarısız gönderim verileri korudu. Üretime test verisi gönderilmedi.
- Katalog ana sayfa, temizlik kategorisi, sabun alt grubu ve form: 360/768/1440 pikselde taşma yok, bir H1.
- Cloudflare kalıcı KV ve panel arayüzünde uçtan uca test henüz yapılmadı.

## Bilinen durum / kalan işler

1. Şirket ünvanı ve veri sorumlusu bilgileri kesinleşmedi. KVKK metni tamamlanmış değildir. Hukuki bilgi uydurmayın.
2. info@ferrapro.com posta kutusunun işlerliği henüz doğrulanmadı. Telefon 0530 716 18 77; konum Ataşehir/İstanbul. WhatsApp onaylanmadığı için kapalı.
3. Önceki çalışmada ortak Worker'daki Selçuk varsayılan parola geri dönüşü kaldırılıp yayımlandı. Cloudflare'da SELCUK_PASSWORD yok; yeni Selçuk girişi bu yüzden kapalı. Kullanıcı Ferranoi panelinin kapsam dışı olduğunu belirtti. Bu sorun çözülmedi; panel şifresini veya kodunu bu görev kapsamında değiştirmeyin, sabit parolayı geri koymayın.
4. Ürün görselleri kategorileri temsil eder. Bazı mevcut ürün satırları (ör. yalnızca hacim/koku içerenler) yetersiz isimlidir; gerçek bilgilerle katalog kalitesi ayrıca geliştirilmeli.
5. Excel/PDF/fotoğraf yükleme, hesaplar ve kayıtlı müşteri listeleri eklenmedi.
6. localStorage kapalı tarayıcılarda seçim kalıcılığı yok; kullanıcıya bildirilir. Otomatik gerçek sipariş oluşmaz.

## Cursor ile devam

Repo kökünü açın, önce git status kontrol edin. README'deki dalı alın.
AGENTS.md ve .cursor/rules/ferrapro.mdc her oturumda bu kapsamı hatırlatır.
İstek örneği: "AGENTS.md ve docs/HANDOFF.md oku. codex/visual-refresh dalındaki güncel katalog ve teklif akışını incele. Ferranoi paneline dokunmadan Ferrapro için [istenen iş] üzerinde çalış. Testleri çalıştır ve devam notlarını güncelle."


## 19 Eylül 2026 — kurumsal görünüm ve hareket

- Kullanıcı yeni irtibat numarasını 0530 716 18 77 olarak bildirdi. Halka açık sayfalar, meta açıklamaları ve tel bağlantıları güncellendi.
- Wix önizlemesinden görsel yön alındı; Wix kodu veya görselleri aktarılmadı. Mevcut temsili görseller kullanıldı.
- Sıcak kırık beyaz / lacivert / koyu turuncu paleti, büyük hero başlığı, çerçeveli geniş ürün görseli, üç sütun eşit kategori kartları, iç sayfa kartlarında gölge ve yuvarlatma uygulandı.
- IntersectionObserver ile bir kez çalışan bölüm girişleri; düğme/kart hover geçişleri. İçerik JS olmadan görünür; reduced-motion tercihinde animasyon ve smooth scroll kapalı.
- Ürün/miktar paylaşımını zorunlu gibi gösteren ana sayfa adımı düzeltildi.
- npm run check başarılı: katalog ve izole teklif akışı. Altı rota (ana sayfa, katalog, sabun alt grubu, form, iletişim, sektörler) x 360/768/1440: yatay taşma yok, bir H1, tamamlanmış yüklemelerde kırık görsel yok; telefonlar yeni numara. Mobil menü açılması ve hero animasyonu sonunda opacity=1 tarayıcıda doğrulandı.
- Canlıya yayın YAPILMADI. Yerel önizleme 8793 portunda. Yeni sürüm PR #1 dalında incelenebilir.
- Şirket/veri sorumlusu bilgileri ve posta kutusu doğrulaması hâlâ bekliyor. Üretim KV üzerinde gerçek talep gönderilmedi. Panel ve kimlik doğrulama kodu değiştirilmedi.

## 20 Eylül 2026 — canlı yayın

Kullanıcının "canlıda görelim" talimatıyla 4ca12c6 sürümü yayımlandı.
Cloudflare sürümü: 5767c793-be99-42d9-acfb-74ade8ceb114.
Önceki sürüm: 033b09ca-f0f1-4cb1-bfb1-70c42ba3f66f.
Yukarıdaki "henüz yayımlanmadı" notları artık tarihsel durumdur; katalog, teklif listesi, yeni tasarım ve telefon canlıdadır.
Yayın öncesi npm run check geçti; önceki yayın commit'iyle Worker ve panel farkı yok.
Canlı ferrapro.com tarayıcıda açıldı; yeni hero, v65 kaynaklar ve 0530 716 18 77 telefon bağlantısı doğrulandı. Gerçek talep gönderilmedi.


## 20 Eylül — kırtasiye kapsam düzeltmesi (henüz canlı değil)
- Avansas kategori araştırması: docs/catalog-research-2026-09-20.md.
- 12 birleşik/tekrarlı kırtasiye satırı yerine 104 benzersiz teklif talep türü, 11 alt grup. Toplam 353 halka açık satır.
- Yeni kayıtlar marka/SKU/eldeki stok iddiası taşımaz; tedarik koşulları teklif sırasında teyit edilir. Kategori açıklaması bunu belirtir. Özel fiyat/maliyet kaynağı değişmedi.
- Açık alt kategori kimliği eklendi: kalemlik/kalemtıraş gibi sözcüklerin yanlış gruba gitmesi önlendi. Eski alt grup URL kimlikleri korundu.
- npm run check geçti; minimum çeşit, benzersizlik ve 11 alt grup testleri eklendi. Tarayıcıda 104 seçenek/11 alt grup doğrulandı.

## 20 Eylül — kırtasiye kataloğu canlı yayını
Kullanıcının "canlıya alalım" talimatıyla 130f19b yayımlandı.
Cloudflare sürümü: 1bda7980-a6f3-489f-b34d-47a43ca367fb.
Önceki sürüm: 5767c793-be99-42d9-acfb-74ade8ceb114.
Yayın öncesi npm run check başarılı; Worker/panel farkı yok. Canlı kırtasiye sayfasında 11 alt grup ve 104 seçenek tarayıcıda doğrulandı. Önceki bölümdeki "henüz canlı değil" ifadesi artık tarihsel durumdur.

## 20 Eylül — tüm kategoriler ve ürün görselleri
Kullanıcı hazır sürümün canlıya alınmasını, yeni üretimin durmasını ve Cursor devam raporunu istedi.
- 585 kayıt; 91 WebP ürün ailesi görseli. 508 satır ürün ailesi, 77 satır açıkça etiketlenmiş kategori görseli kullanıyor. 41 eksik görsel anahtarı var.
- Devam raporu: docs/CURSOR-NEXT.md. Makine tarafından okunabilir eksikler: docs/product-images-pending.json. Araştırma: docs/catalog-research-all.md. İstemler: docs/product-image-prompts.json.
- npm run check başarılı: tüm kayıtlar sınıflanıyor, tüm görsel dosyaları mevcut, form ve izole Worker akışı başarılı. Worker/panel farkı yok.
- 1440px ve 360px kırtasiye ürün kartlarında yatay taşma/kırık yüklenmiş görsel yok; mobil tek sütun doğrulandı. Tüm görsellerin tek tek kalite denetimi bitmedi; raporda açıkça belirtildi.
- Ürün seçimi/miktar zorunlu değil. Gerçek müşteri talebi gönderilmedi. Yeni görsel üretimi kullanıcı talebiyle durduruldu.
- Yayın sonucu aşağıya eklenecek.

### Yayın tamamlandı
5c20431 kaynak commit'i kullanıcının mevcutları canlıya alma talimatıyla yayımlandı.
Cloudflare sürümü: 43ed425e-799a-4556-ba8a-a48fee41b395.
Önceki sürüm: 1bda7980-a6f3-489f-b34d-47a43ca367fb.
103 yeni/değişen statik dosya yüklendi. Panel/Worker kod farkı yok. GitHub codex/visual-refresh dalına gönderildi.

## 20 Eylül — eksik görselleri mevcut dosyalarla bağlama (yeni üretim yok)
Cursor, hazır WebP dosyalarını yeniden üretmeden 41 eksik aileyi en yakın mevcut ürüne bağladı.
- 585 kaydın tümü `temsili`; kategori görseli kalan kart 0. `docs/product-images-pending.json` boş.
- 91 mevcut dosya korundu. Havlu ruloları jumbo; fotoselli/içten çekmeli/hareketli havlu fotosel; yüzey ve çamaşır suyu cleaner; USB kablolar usb; toner/kartuş toner.
- Kabul edilen varyant tekrarları: tuvalet, z kat, jumbo, peçete ve fotosel ölçüleri; tükenmez/jel/roller/imza kalem ailesi; zımba makinesi + tel + sökücü; koli bandı ebatları.
- Hâlâ ayrı fotoğraf isteyen türler (üretim kapalı): fosforlu / tahta / permanent marker; soda-süt-meyve suyu-enerji (şu an su/çay/kahve ailesi); galoş-önlük-bone; kulaklık-mikrofon; ABD tipi şarj ucu.
- npm run check geçti. Bu turda canlı yayın yok.

### Yayın tamamlandı
Kullanıcının canlı kontrol talebiyle b2ef106 yayımlandı.
Cloudflare sürümü: 440132a5-8333-4fe9-aecb-7c71ef1ff1de.
Önceki sürüm: 43ed425e-799a-4556-ba8a-a48fee41b395.
katalog.json ve statik varlıklar yüklendi. Panel/Worker kod farkı yok. GitHub `codex/visual-refresh` dalına gönderildi.

## 20 Eylül — Islak Havlu düzeltmesi
Kullanıcı canlı menüde kutu mendil görsellerini ve yanlış satırları işaretledi.
- Grupta yalnızca: Islak havlu 90’lı, Islak havlu koli, Yüzey temizlik havlusu.
- Yeni temsili görseller: wipes.webp, wipescarton.webp, surfacewipes.webp. Kutu mendil görseli bu grupta kullanılmıyor.
- Mendil satırları bu başlıktan çıkarıldı. npm run check geçti.

### Yayın tamamlandı
Kullanıcı canlı menüden bakarken adf443db-8c5c-4c14-b788-75480cac1bdb yayımlandı.
Önceki sürüm: 440132a5-8333-4fe9-aecb-7c71ef1ff1de.

## 20 Eylül — Islak Havlu marka tercihi
Kullanıcı Espiga / Sleepy / Selpak sergileyip müşterinin seçtiği markayı tedarik etme modelini istedi. Ofispanda görselleri kopyalanmadı; marka logosu veya ambalaj fotoğrafı eklenmedi.
- Islak Havlu ürün kartlarında ve grup talebinde isteğe bağlı marka seçimi: Espiga, Polente, Sleepy, Selpak, Freshmaker, Papilion, Deep Fresh, Komili, Fark etmez.
- Seçim teklif listesine `Marka tercihi: …` olarak yazılır. Stok veya yetkili bayi iddiası yok.
- npm run check geçti; Worker/panel kod farkı yok. 11 statik dosya yüklendi.

### Yayın tamamlandı
Kullanıcının canlıya alma talimatıyla yayımlandı.
Cloudflare sürümü: 3107e420-5f9a-424a-a665-1cca615dc4f5.
Önceki sürüm: adf443db-8c5c-4c14-b788-75480cac1bdb.

## 20 Eylül — Islak Havlu marka listesi genişletildi
Kullanıcı piyasadaki diğer bilinen markaları ekletti: Polente, Freshmaker, Papilion, Deep Fresh, Komili. Stok/bayi iddiası yok; seçim teklif notuna yazılır.

## 20 Eylül — Peçete grubu sadeleştirildi
Kullanıcı ölçü detayını ve aynı peçete fotoğrafının tekrarını işaretledi.
- Grupta çeşit türleri: Peçete 100’lü, Peçete 200’lü, Renkli peçete, Desenli peçete, Z peçete, Kokteyl peçetesi, Garson katlama peçete, Dispenser peçete.
- cm/gr/koli ölçü satırları çıkarıldı. Her türe ayrı temsili görsel bağlandı.
- npm run check geçti. Hijyen 125 kayıt.

### Yayın tamamlandı
Kullanıcının canlıya alma talimatıyla 34a890a yayımlandı.
Cloudflare sürümü: d96560ec-a12b-4535-8c3c-d28f61983bae.
Önceki sürüm: 3107e420-5f9a-424a-a665-1cca615dc4f5.

## 20 Eylül — Z / garson / dispenser peçete görselleri
Kullanıcı üç kartın birbirine ve 100’lü yığına benzediğini işaretledi. Görseller katlama biçimine göre yenilendi: Z iç içe katlı tuğla, 1/8 garson katlama dikdörtgen, V kat dispenser paketi.

### Yayın tamamlandı
Cloudflare sürümü: cc155a74-d5d8-462a-9958-c8ec00600391.
Önceki sürüm: d96560ec-a12b-4535-8c3c-d28f61983bae.



