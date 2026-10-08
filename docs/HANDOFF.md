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

## 20 Eylül — Peçete görsellerinde krem fon
Kullanıcı kartlarda beyaz/krem karışık zemin gördü. 100’lü, desenli, Z ve garson görselleri aynı krem stüdyo zeminine çekildi.

### Yayın tamamlandı
Cloudflare sürümü: 712042b6-9d7c-4755-bb79-118266850d4b.
Önceki sürüm: cc155a74-d5d8-462a-9958-c8ec00600391.

## 20 Eylül — Z Kat Havlu sekmesi kaldırıldı
Kullanıcı sekmeyi tamamen kaldırttı. Ölçülü Z kat havlu satırları halka açık katalogdan çıktı. Dispenser grubundaki “Z kat havlu dispenseri” duruyor. Fotoselli havlu görseli krem stüdyo zeminine alındı.

### Yayın tamamlandı
Cloudflare sürümü: 16fc58d8-ebea-4ce3-8c8e-2f96f9e0bb78.
Önceki sürüm: 712042b6-9d7c-4755-bb79-118266850d4b.

## 20 Eylül — Mini Jumbo ve tuvalet görselleri krem fon
Kullanıcı Mini Jumbo, içten çekmeli tuvalet ve tuvalet kâğıdı kartlarında krem zemin istedi.

### Yayın tamamlandı
Cloudflare sürümü: 7a678562-30a7-40f5-83ea-8dffe8bdb06c.
Önceki sürüm: 16fc58d8-ebea-4ce3-8c8e-2f96f9e0bb78.

## 20 Eylül — Rulo Havlu sadeleştirildi
Kullanıcı ölçü kalabalığını kaldırttı. Grupta 6’lı, 8’li, 12’li ve dev rulo; krem zeminde paket görselleri. Marka tercihi: Solo, Selpak, Papia, Familia, Focus, Forest, Rulopak.

### Yayın tamamlandı
Cloudflare sürümü: 04d91898-da0c-406b-a6e4-a3fdbdb4f0b2.
Önceki sürüm: 7a678562-30a7-40f5-83ea-8dffe8bdb06c.

## 20 Eylül — Rulo havlu 6/8 görsel adedi
Kullanıcı 6’lı ve 8’li kartlarda rulo sayısının yanlış göründüğünü işaretledi. Görseller 3+3 ve 4+4 dizilime çekildi.

### Yayın tamamlandı
Cloudflare sürümü: b4ce027d-4a52-47e4-8ee1-6790ba3c49d2.
Önceki sürüm: 04d91898-da0c-406b-a6e4-a3fdbdb4f0b2.

## 20 Eylül — Rulo 6’lı / 12’li görsel düzeltmesi
Kullanıcı 6’lıda dev rulo formu, 12’lide fazla adet gördüğünü işaretledi. 6’lı ince mutfak rulosu 3+3; 12’li dört-dört-dört.

### Yayın tamamlandı
Cloudflare sürümü: ff50fd1c-4357-43cb-a88b-33ac5871776c.
Önceki sürüm: b4ce027d-4a52-47e4-8ee1-6790ba3c49d2.

## 20 Eylül — Dispenser görselleri türe göre ayrıldı
Kullanıcı yedi aparat kartının aynı fotoğrafı kullandığını işaretledi. Her ada ayrı temsili dispenser görseli bağlandı: Z kat, sensörlü, içten çekmeli havlu, jumbo tuvalet, içten çekmeli tuvalet, masaüstü peçete, klozet örtüsü.

### Yayın tamamlandı
Cloudflare sürümü: e8395ac8-882c-4235-886d-25aca49932d0.
Önceki sürüm: ff50fd1c-4357-43cb-a88b-33ac5871776c.

## 20 Eylül — Mendil sekmesi kaldırıldı, çöp poşeti rengi adı izler
Kullanıcı Mendil ve Yüz Havluları başlığını kapattı. Çöp poşetinde mavi adı siyah görsele düşüyordu; krem fonda mavi / siyah / şeffaf rulo görselleri ada bağlandı.

### Yayın tamamlandı
Cloudflare sürümü: 83770996-833f-4095-ac9e-84a4994d0bb1.
Önceki sürüm: e8395ac8-882c-4235-886d-25aca49932d0.

## 20 Eylül — El sabunları ölçü ve dispenser görselleri
Kullanıcı ölçüsüz sıvı sabunu ve kâğıt dispenser fotoğraflarını işaretledi. 1 L sıvı ve 1 L köpük satırları ayrıldı; 5 L bidon, köpük şişe ve duvar tipi sıvı/köpük dispenser görselleri krem fonda bağlandı.

### Yayın tamamlandı
Cloudflare sürümü: fa9037ee-56ab-4eea-ad99-993821db0faa.
Önceki sürüm: 83770996-833f-4095-ac9e-84a4994d0bb1.

## 20 Eylül — Ürün adları başlık düzeni
Kullanıcı küçük harfli ürün yazımlarını acemi buldu. Tüm katalog satırları ve kart başlıkları Türkçe kelime başı büyük harfe alındı.

### Yayın tamamlandı
Cloudflare sürümü: 3307fe88-efa0-41b6-a1e9-881eb236624a.
Önceki sürüm: fa9037ee-56ab-4eea-ad99-993821db0faa.

## 20 Eylül — Çamaşır suları sadeleştirildi
Kullanıcı sekmenin mavi sprey görseli ve tekrarlayan 20 kg satırlarıyla bozulduğunu işaretledi. Beş tür kaldı: sıvı 1 L / 5 L / 20 L ve kıvamlı 4 kg / 20 kg; krem fonda çamaşır suyu bidonları bağlandı.

### Yayın tamamlandı
Cloudflare sürümü: 891fa2ac-1ce4-4f79-a16d-16cd783fdfb5.
Önceki sürüm: 3307fe88-efa0-41b6-a1e9-881eb236624a.

## 20 Eylül — Çamaşır deterjanları türe göre ayrıldı
Kullanıcı sekmenin aynı bidon fotoğrafıyla durduğunu işaretledi. Toz 10 kg, sıvı 3 L / 5 L, kapsül, yumuşatıcı 5 L ve leke çıkarıcı ayrı krem görsellere bağlandı.

### Yayın tamamlandı
Cloudflare sürümü: 66234d18-8e34-4181-89b9-d2e54df0b49a.
Önceki sürüm: 891fa2ac-1ce4-4f79-a16d-16cd783fdfb5.

## 20 Eylül — Yinelenen toz deterjan kartı kaldırıldı
Kullanıcı bidon görselli “Toz Deterjan 10 kg” kartını çıkardı. Toz çamaşır deterjanı 10 kg çuval görseli duruyor.

### Yayın tamamlandı
Cloudflare sürümü: 158cb139-766e-444d-9705-6d0ce959679a.
Önceki sürüm: 66234d18-8e34-4181-89b9-d2e54df0b49a.

## 20 Eylül — Yüzey temizleyici görselleri ayrıldı
Kullanıcı kartların aynı fotoğrafı paylaştığını işaretledi. Cam mavi sprey kaldı; genel, ahşap, seramik, paslanmaz, zemin, arap sabunu ve bidon satırlarına ayrı krem görseller bağlandı.

### Yayın tamamlandı
Cloudflare sürümü: a1c06f1d-3118-4db8-876c-365b7aa0dab0.
Önceki sürüm: 158cb139-766e-444d-9705-6d0ce959679a.

## 20 Eylül — Kireç ve pas çözücüler Cif krem kutusu
Kullanıcı Cif kutusu silüeti istedi. Dört kart aynı kısa krem kutu formunu sarı, turuncu, pembe ve yeşil kapaklarla kullanıyor.

### Yayın tamamlandı
Cloudflare sürümü: 3e122c07-63a6-4abd-9a8d-7177e7b29e5c.
Önceki sürüm: a1c06f1d-3118-4db8-876c-365b7aa0dab0.

## 20 Eylül — Ortam kokuları ayrı görseller
Dört kart aynı duvar makinesi fotoğrafını kullanıyordu. Spreye aerosol kutu, 500 ml parfüme pompa şişe, yedeğe kartuş; otomatik makine mevcut krem duvar ünitesinde kaldı.

### Yayın tamamlandı
Cloudflare sürümü: cf4ae515-2099-4ead-833b-509b1e628fce.
Önceki sürüm: 3e122c07-63a6-4abd-9a8d-7177e7b29e5c.

## 20 Eylül — Bulaşık ve sarı/mavi güç görselleri
Kullanıcı Asperox sarı/mavi sprey ve bulaşık makinesi ürün görsellerini referans verdi; markasız krem stüdyo fotoğrafları bağlandı. Artık SKU olan Bulaşık 4 kg kartı kaldırıldı.

### Yayın tamamlandı
Cloudflare sürümü: dc9a8150-4534-4d51-8836-5c80c13e4fb7.
Önceki sürüm: cf4ae515-2099-4ead-833b-509b1e628fce.

## 20 Eylül — Bez ve mop görselleri
Mikrofiber, cam bezi, mop çeşitleri, kova/set ve tuvalet fırçası markasız krem stüdyo fotoğraflarıyla ayrıldı. Kova ve tuvalet fırçası Bez ve Mop grubuna alındı.

### Yayın tamamlandı
Cloudflare sürümü: ec7b714d-d7be-4bfd-89b9-2c011f0dd6d6.
Önceki sürüm: dc9a8150-4534-4d51-8836-5c80c13e4fb7.

## 20 Eylül — Temizlik ekipmanları görselleri
Faraşlı süpürge ve yer fırçası tuvalet fırçası, çekçekler düz mop, temizlik arabası kova fotoğrafını kullanıyordu. Beş karta ayrı krem stüdyo görseli bağlandı.

### Yayın tamamlandı
Cloudflare sürümü: c09336da-0072-4abe-bdba-3ac583fdda05.
Önceki sürüm: ec7b714d-d7be-4bfd-89b9-2c011f0dd6d6.

## 20 Eylül — Atık yönetimi ve kırtasiye görselleri
Atık yönetiminde dört kart aynı pedal kovayı kullanıyordu. Pedal kova, açık sepet, geri dönüşüm ünitesi ve kapak ayrıldı. Kırtasiyede yanlış türler (mantar pano, askılı dosya, düğme/9V pil, kabarcıklı zarf, zımba sökücü, cilt spirali, flipchart, renkli kâğıt vb.) kendi silüetine alındı.

### Yayın tamamlandı
Cloudflare sürümü: 07c9d8b9-2ecd-4c30-841c-1359d29c557d.
Önceki sürüm: c09336da-0072-4abe-bdba-3ac583fdda05.

## 20 Eylül — Atık kapağı kaldırıldı
Çöp kovası kapağı kartı silindi. Tıbbi atık kovası ve poşet Sağlık → Tıbbi Atık altında kalır (kesici-delici kutu ile); ofis çöpü Temizlik → Atık Yönetimi’ndedir.

### Yayın tamamlandı
Cloudflare sürümü: 2ccc22a2-600e-46de-b5a6-ef96bb771695.
Önceki sürüm: 07c9d8b9-2ecd-4c30-841c-1359d29c557d.

## 20 Eylül — Fotokopi ve özel kâğıt görselleri
A3, gramajlı, plotter rulo, sürekli form ve karbon kâğıdı referans silüetlerine göre ayrıldı; A4 ream ve POS rulosu yerinde kaldı.

### Yayın tamamlandı
Cloudflare sürümü: e05b2ef8-5465-4be8-b654-48ec3fd3c49c.
Önceki sürüm: 2ccc22a2-600e-46de-b5a6-ef96bb771695.

## 20 Eylül — Kalem görselleri
Jel, roller, beyaz tahta, asetat ve imza kalemi referans silüetlerine göre ayrıldı.

### Yayın tamamlandı
Cloudflare sürümü: e6fa70ed-ba51-49af-96f2-fd4766cd091f.
Önceki sürüm: e05b2ef8-5465-4be8-b654-48ec3fd3c49c.

## 20 Eylül — Klasör ve arşiv görselleri
Karton klasör kaldırıldı. Dar/geniş klasör sırt farkı, halkalı klasör, telli dosya ve premium arşiv kutusu ayrı görseller aldı.

### Yayın tamamlandı
Cloudflare sürümü: b0d3e873-0e2b-4294-a252-fb2f0ff9c947.
Önceki sürüm: e6fa70ed-ba51-49af-96f2-fd4766cd091f.

## 20 Eylül — Dosya sekmesi sadeleştirildi
Dosyalar ve Evrak Düzeni’nden telli, sıkıştırmalı ve proje dosyası kartları kaldırıldı.

### Yayın tamamlandı
Cloudflare sürümü: dfd15936-2107-4df1-b889-74349e9039f8.
Önceki sürüm: b0d3e873-0e2b-4294-a252-fb2f0ff9c947.

## 20 Eylül — Defter sekmesi görselleri ve ajanda birleştirme
Tarihsiz/tarihli ajanda ve fihrist kartları tek “Ajandalar” talebine indirgendi. Spiralli defter, bloknot, yapışkanlı not kâğıdı ve ticari defter ayrı temsili görseller aldı. npm run check: 511 satır.

### Yayın tamamlandı
Cloudflare sürümü: b7f74a31-d0e3-4360-bb9f-56758fa817c9.
Önceki sürüm: dfd15936-2107-4df1-b889-74349e9039f8.

## 20 Eylül — Zımba sadeleştirme ve ıstampa görseli
Arşiv tipi zımba kartı kaldırıldı. Masaüstü düzenleyicilerde Istampa, kaşeden ayrı temsili mürekkep yastığı görseli aldı. npm run check: 510 satır.

### Yayın tamamlandı
Cloudflare sürümü: 125d5e34-95f5-4ec1-a26f-7dd6319c2892.
Önceki sürüm: b7f74a31-d0e3-4360-bb9f-56758fa817c9.

## 20 Eylül — Kesim ve yapıştırma görselleri
Maket bıçağı yedeği yalnızca yedek bıçak gösteriyor. Şeffaf ofis bandı, çift taraflı bant, sıvı yapıştırıcı ve sıvı düzeltici ayrı temsili görseller aldı. npm run check: 510 satır.

### Yayın tamamlandı
Cloudflare sürümü: 46731fea-7637-4654-92f4-159edea87ad1.
Önceki sürüm: 125d5e34-95f5-4ec1-a26f-7dd6319c2892.

## 20 Eylül — Zarf ve etiket görselleri
Diplomat, torba, hava kabarcıklı ve mektup zarfı ayrı temsili görseller aldı. Adres, barkod, raf ve nokta etiketleri de birbirinden ayrıldı. npm run check: 510 satır.

### Yayın tamamlandı
Cloudflare sürümü: c08d741f-8b33-40d2-acd1-359f18c27373.
Önceki sürüm: 46731fea-7637-4654-92f4-159edea87ad1.

## 20 Eylül — Piller ve mutfak görselleri
AA ve AAA piller ayrı görseller aldı. Mutfak/ikramdaki koli SKU satırları kaldırıldı; 53 talep türü krem stüdyo fotoğraflarıyla eşlendi. npm run check: 473 satır.

### Yayın tamamlandı
Cloudflare sürümü: c471f341-0c5c-47de-ad9d-abd9c3bdc405.
Önceki sürüm: c08d741f-8b33-40d2-acd1-359f18c27373.

## 21 Eylül — AAA pil görseli ve katalog ağacı
AAA ince kalem pil sigara görünümlü çubuk yerine bakır başlıklı 4’lü blister paket oldu. Sol kategori menüsü kartlı accordion: açık grup lacivert, chevron, alt grup sayaçları ve hover kayması. inner.css v70, catalog-ui.js v71. npm run check: 473 satır.

### Yayın tamamlandı
Cloudflare sürümü: 47629b57-d1ed-4eae-8320-73ab892d4606.
Önceki sürüm: c471f341-0c5c-47de-ad9d-abd9c3bdc405.

## 21 Eylül — Ambalaj düz liste ve gri zemin
Ambalaj alt sekmeleri kalktı; 36 ürün tek listede. Kraft’ta yalnızca kraft çanta ve bez çanta; kese kâğıdı / yağlı / pencereli ayrı görseller; poşetlerde kasa, kilitli ve kargo. Tekrarlayan SKU ve görseller çıkarıldı. Krem arka planlar açık griye (#F2F3F5) alındı. npm run check: 460 satır.

### Yayın tamamlandı
Cloudflare sürümü: c5dc2c0c-85ca-48c8-9cbd-e2539db6f0c3.
Önceki sürüm: 47629b57-d1ed-4eae-8320-73ab892d4606.

## 21 Eylül — Yağlı kese çıktı, ambalaj stüdyo zemini
Yağlı kese kâğıdı kaldırıldı. Ambalaj görselleri krem/beyaz karışımı yerine aynı açık gri stüdyo fonuna alındı. npm run check: 459 satır.

### Yayın tamamlandı
Cloudflare sürümü: c4562347-f90a-4cd3-88c3-e252d1635848.
Önceki sürüm: c5dc2c0c-85ca-48c8-9cbd-e2539db6f0c3.

## 24 Eylül — Temizlik kâğıdı yeni grup iskeleti
Temizlik Kâğıt Ürünleri’nin en üstüne Havlu-Peçete, Islak havlu ve Tuvalet Kağıtları eklendi. Eski alt gruplar silinmedi. Yeni gruplar henüz boş; ürünler sırayla taşınacak. npm run check: 459 satır.

### Yayın tamamlandı
Cloudflare sürümü: c3cda350-49d6-4a49-a745-3405e51e8126.
Önceki sürüm: c4562347-f90a-4cd3-88c3-e252d1635848.

## 24 Eylül — Katalog sıfırlandı
Tüm halka açık ürünler, ana kategoriler ve alt gruplar silindi. Katalog baştan anlatılacak. npm run check: 0 satır. Canlıya alınmadı.

## 24 Eylül — Yuvarlak kategori düzeni
Ürünler sayfasındaki ağaç menü kaldırıldı. Üstte isimsiz 5 boş daire bekliyor; isimler kullanıcıdan gelecek.

### Yayın tamamlandı
Cloudflare sürümü: faa193fd-da96-4ca8-ad44-108efe490093.
Önceki sürüm: c3cda350-49d6-4a49-a745-3405e51e8126.

## 24 Eylül — Ofix kurgusu
Katalog daire bandı tam sayfa genişliğinde; daireler büyütüldü.

### Yayın tamamlandı
Cloudflare sürümü: eafc8c7d-d5f1-47ed-b464-78aa0a6039c2.
Önceki sürüm: 294f99d3-e872-4365-bfdc-6615aafd072d.

## 24 Eylül — Sıvı temizlik daire görseli
Sıvı Temizlik Ürünleri dairesine Yumoş Extra Lilyum markalı şişe grubu kondu. GRUP_FOTO.Temizlik = /img/products/sivi-yumos.webp. site.js v=82. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: 35089324-91bf-4cc2-8c0b-11728ea18abf.
Önceki sürüm: ed220635-d0c3-4a3a-a64a-89245f189aff.

## 24 Eylül — Ofix tarzi daire ve popüler markalar
Kategori daireleri markasız yüksek ışıklı stüdyo grup fotoğraflarıyla dolduruldu. Altına kayan “Popüler markalar” şeridi eklendi (metin, logo kopyası yok). site.js v=83, catalog-ui v=79, inner.css v=78. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: b63354a3-3419-446e-a794-f0e72b1b0284.
Önceki sürüm: 35089324-91bf-4cc2-8c0b-11728ea18abf.

## 24 Eylül — Marka şeridi daire rozet
Popüler markalar Ofix gibi beyaz daire içinde renkli rozetle kayıyor; daireler büyütüldü. site.js v=84, catalog-ui v=80, inner.css v=79. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: 5cdbdf62-5fc8-4d02-b3e9-a5dc1bb3ea61.
Önceki sürüm: b63354a3-3419-446e-a794-f0e72b1b0284.

## 24 Eylül — Grup bazlı marka şeridi
Marka daireleri seçilen ana kategoriye göre değişiyor (temizlik / kâğıt / gıda vb.). Ürünler özetinde şerit gizli. site.js v=85, catalog-ui v=81. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: 53a8ff6d-7b9e-4ce0-9922-63c3bc60dbdb.
Önceki sürüm: 5cdbdf62-5fc8-4d02-b3e9-a5dc1bb3ea61.

## 24 Eylül — Bilgisayar sarf markaları
PC şeridine Logitech, Everest, Canon, Epson, Anker, Syrox, Baseus, Spigen kondu. site.js v=86. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: 3b5e0a61-652e-4303-8c16-3e7740efa43e.
Önceki sürüm: 53a8ff6d-7b9e-4ce0-9922-63c3bc60dbdb.

## 24 Eylül — Kağıt ve aparat markaları
Hijyen: Espiga, Sleepy, Papia, Solo, Familia, Teno, Rulopak. Aparat: Vileda, Parex, Palex, Vialli, Flosoft, Scotch-Brite. site.js v=87. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: d9160394-a456-4460-a63e-3a55f57757ea.
Önceki sürüm: 3b5e0a61-652e-4303-8c16-3e7740efa43e.

## 24 Eylül — Kırtasiye markaları
Kırtasiye şeridine Faber-Castell, Pilot, uni-ball, BIC, edding, Navigator, Pritt, UHU, Leitz, noki kondu. site.js v=88. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: 217190e8-0d3e-41f6-bc35-46873a2f9ec7.
Önceki sürüm: 6f727b51-e228-49b1-abe8-35693dccbe7b.

## 24 Eylül — Gerçek marka logoları
Popüler marka dairelerine internetteki gerçek logolar kondu (Wikimedia Commons + resmi siteler). Edding kırmızı plaka, BIC, Pritt, Faber-Castell, Noki, Leitz, Nestlé, Lipton, Eti, Familia, Solo, Cif, Yumoş, Vernel, Tesa vb. resmi dosyalar. Palex, Everest, Rulopak, Erikli, Teno, Ozopak, Flosoft, Espiga, Syrox için net resmi dosya bulunamadı.

## 24 Eylül — Ana sayfa slogan bandı
Sarı şerit slogan: “İŞLETMEYE UYGUN TEKLİF FerraPro'da!”. Altında kırtasiye, bilgisayar sarf ve gıda kartları; fiyat/indirim/hemen-al yok, teklif ve incele. home.css v=70, site.js v=89. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: 913fba00-144d-4ca9-a7ce-c883e1593bbb.
Önceki sürüm: 217190e8-0d3e-41f6-bc35-46873a2f9ec7.

## 24 Eylül — Slogan rengi ve metni
Şerit lacivert + turuncu plaka. Metin: “İşletmelere En uygun Fiyat Teklifleri FerraPro'da!”. home.css v=71.

### Yayın tamamlandı
Cloudflare sürümü: 7946dd2e-8340-4f5f-9b86-001d8e1f4b05.
Önceki sürüm: 913fba00-144d-4ca9-a7ce-c883e1593bbb.

## 24 Eylül — Slogan turuncu şerit
Banner yükseltildi, zemin turuncu, yazı lacivert. “en uygun” sarı ve yanıp sönüyor. home.css v=72.

### Yayın tamamlandı
Cloudflare sürümü: 7210cc87-6a7a-44f6-9f85-3da7da155bd2.
Önceki sürüm: 7946dd2e-8340-4f5f-9b86-001d8e1f4b05.

## 24 Eylül — Ana sayfa kampanyalar
Tanışma kampanyası %10 ve 10.000 TL üzeri siparişte Tchibo 1 kg çekirdek kahve hediye kartları. CTA Teklif Al (/siparis). home.css v=73, site.js v=90.

### Yayın tamamlandı
Cloudflare sürümü: 5e69c96a-2a5b-4d49-b439-d6dd02d52028.
Önceki sürüm: 7210cc87-6a7a-44f6-9f85-3da7da155bd2.

## 24 Eylül — Header logo
FerraPro işareti 58px, yazı büyütüldü, şerit sola genişletildi. site.css v=69.

### Yayın tamamlandı
Cloudflare sürümü: 0d09a45b-9018-4c4f-b3c0-220571bba6f4.
Önceki sürüm: 5e69c96a-2a5b-4d49-b439-d6dd02d52028.

## 24 Eylül — Kampanya kaydırıcı
Tanışma ve Tchibo kartları ok ve nokta ile sayfa sayfa kayıyor. home.css v=74, site.js v=91.

### Yayın tamamlandı
Cloudflare sürümü: 65efd5bd-ef89-4e72-9156-ca403197025a.
Önceki sürüm: 0d09a45b-9018-4c4f-b3c0-220571bba6f4.

## 24 Eylül — Header logo büyütme
İşaret 84px, FR yakınlaştırıldı, yazı 1.55rem. site.css v=70, site.js v=92.

## 24 Eylül — Ana sayfa genişlik denemesi geri alındı
Tam sayfa ve 1200px sütun denemesi kaldırıldı. Ana sayfa önceki genişliğe döndü. home.css v=74. Canlıya alınmadı.

### Yayın tamamlandı
Cloudflare sürümü: b68ef632-8449-444a-b017-c4372f084a43.
Önceki sürüm: 65efd5bd-ef89-4e72-9156-ca403197025a.

## 24 Eylül — Header tam logo
Kesme kaldırıldı. Bant 136px, tam hex 108px, FerraPro yazısı 2.05rem. site.css v=71.

### Yayın tamamlandı
Cloudflare sürümü: 461d2853-98a0-458a-9089-7152a590a12f.
Önceki sürüm: b68ef632-8449-444a-b017-c4372f084a43.

## 24 Eylül — Sayfa genişliği
İçerik 1280px. Header 96px, logo 72px tam, yazı 1.5rem. site.css v=72, home.css v=75, inner.css v=81.

### Yayın tamamlandı
Cloudflare sürümü: d2366858-9ff2-4718-8376-8f0eb4c2d7b3.
Önceki sürüm: 461d2853-98a0-458a-9089-7152a590a12f.

## 24 Eylül — Kampanya yüksekliği
Slider 220px’e sabitlendi; görsel bandı şişirmiyor. home.css v=76.

### Yayın tamamlandı
Cloudflare sürümü: ce6eafc1-1ff0-4d9b-a81e-8eee9031e954.
Önceki sürüm: d2366858-9ff2-4718-8376-8f0eb4c2d7b3.

## 24 Eylül — Hero görsel
Yığma kompozisyon ve lacivert şerit kaldırıldı. Düz katalog fotoğraf, 16px çerçeve. home.css v=77.

### Yayın tamamlandı
Cloudflare sürümü: 2b31c986-36ed-4c77-9dda-a89d63fed27e.
Önceki sürüm: ce6eafc1-1ff0-4d9b-a81e-8eee9031e954.

## 24 Eylül — Hero gerçek ofis fotoğrafı
Yapay ürün yığını kaldırıldı; lacivert ofis koridoru fotoğrafı kondu.

### Yayın tamamlandı
Cloudflare sürümü: cd50e8ea-43fb-44f5-83fd-f0795d8f4808.
Önceki sürüm: 2b31c986-36ed-4c77-9dda-a89d63fed27e.

## 24 Eylül — Palet ve hero
Ana renk #0F172A, vurgu #0EA5E9. Hero: kullanıcının depo/taşıma görseli. site.css v=73, home.css v=78.

### Yayın tamamlandı
Cloudflare sürümü: 1e4ee6ff-5eff-4b3d-9270-f3e7d0ccc3dc.
Önceki sürüm: cd50e8ea-43fb-44f5-83fd-f0795d8f4808.

## 24 Eylül — Hero yan boşluk
Fotoğraf çerçeveyi dolduruyor, contain/max-height kaldırıldı. home.css v=79.




## 24 Eylül — Canva ana sayfa metni
Canva `homePageContent` canlıya alındı. Yer tutucu kategori yok; 7 gerçek ürün grubu dolduruluyor. Kampanyalar ve referanslar duruyor. Ana sayfa formu mevcut `/api/teklif` ile (firma+telefon zorunlu; e-posta/ürün/miktar isteğe bağlı not’a yazılıyor). Panel ve kimlik doğrulama değişmedi.
`npm run check`: katalog ve form gönderimi geçti. `check_quote_flow` ferrapro.com `/panel/` 302 yönlendirmesinde 404 bekliyor; bu Worker davranışı bu işte değiştirilmedi.
Cloudflare sürümü: 6cc984d3-b080-4aaf-8beb-63e74a914dd5.
Önceki sürüm: 1e4ee6ff-5eff-4b3d-9270-f3e7d0ccc3dc.

## 24 Eylül — Katalog yönetim paneli
Ferranoi paneline dokunulmadı. Yeni iç araç: `/yonetim` (noindex). 3 ana kategori, 11 alt kategori, 157 ayrı ürün kaydı. Çöp Poşetleri ve Kullan At Ürünler, Sıvı Temizlik altında bağımsız. Teyitsiz ölçüler (3,2 / 4 / 2,5 / 400 / 30 × 45) not alanında duruyor. Düzenlemeler tarayıcıda saklanır; kaynak dosya `public/yonetim/catalog.json`. Müşteri `/urunler` boş katalog olarak duruyor.
Cloudflare sürümü: 58a2833b-2e5a-4c46-baf7-1f2c11976b75.
Önceki sürüm: 6cc984d3-b080-4aaf-8beb-63e74a914dd5.

## 24 Eylül — Vitrin katalog
Canva ürün ağacı müşteri sitesine bağlandı. `/urunler`: 3 ana grup, alt grup kartları, 157 varyant, ürün detay (`?u=`). Fiyat yok. Çöp Poşetleri ve Kullan At, Sıvı Temizlik altında. Eski `?g=Hijyen|Temizlik|Aparat` adresleri duruyor. Ana sayfa yalnızca bu 3 dolu grubu gösteriyor.
Cloudflare sürümü: eacd2aee-bb6e-463d-ac9f-fbba1ff1390e.
Önceki sürüm: 58a2833b-2e5a-4c46-baf7-1f2c11976b75.

## 24 Eylül — Hero altı Canva carousel
8 Canva banner, hero’nun hemen altında. Canva dışa aktarımı 1024×512 (2:1) geldiği için kırpılmadan gösteriliyor; 24:5 kesilmedi. Görsel üzerindeki yazı tekrar edilmiyor; şeffaf tıklama alanları ürünler/teklif formuna gidiyor. WhatsApp numarası hâlâ boş; ilgili buton `#teklif-al`. Eski tanışma/Tchibo kampanya şeridi kaldırıldı. Panel değişmedi.
`npm run check`: katalog geçti; `check_quote_flow` ferrapro.com `/panel/` 302≠404 önceden var, bu işte dokunulmadı.

### Yayın tamamlandı
Cloudflare sürümü: b66c5b76-af44-456a-9855-398e84930550.
Önceki sürüm: eacd2aee-bb6e-463d-ac9f-fbba1ff1390e.

## 25 Eylül — Carousel ölçü ve kalite
Canva kaynakları 1024×512 (2:1 JPEG). Yapay 1440 büyütme kaldırıldı; PNG native ölçüde, `width:100%; height:auto; object-fit:contain`. Kutu max 1200px, görsel native 1024px üstüne çıkarılmıyor. Noktalar görselin altında. `cover` yok. 2400×1200 (veya 2x) Canva dışa aktarımı yok; keskin retina için yeniden indirme gerekir. Panel değişmedi.

### Yayın tamamlandı
Cloudflare sürümü: f80b3145-8d65-40cf-8fc7-214512a41852.
Önceki sürüm: b66c5b76-af44-456a-9855-398e84930550.

## 25 Eylül — Üç katmanlı header
Üst bilgi 30px, ana nav 72px, lacivert teklif bandı 46px (toplam 148px). İçerik 1200px, carousel ile aynı hiza. Ürünler dropdown; mobilde hamburger. Teklif Listem boşken sayı yok. WhatsApp wa.me/905307161877 (kullanıcı verdi). Carousel görselleri değişmedi. Panel dokunulmadı.

### Yayın tamamlandı
Cloudflare sürümü: 4d96f953-1a6b-4eec-b567-e0535f3be488.
Önceki sürüm: f80b3145-8d65-40cf-8fc7-214512a41852.

## 25 Eylül — Ana sayfa carousel altı bölümler
Header, duyuru bandı ve hero carousel değişmedi (görsel, sıra, ölçü, metin, cover yok). Carousel sonrası: keşfet (4 kart), sektörler (6), öne çıkan ürün grupları (10), Neden FerraPro (4), lacivert CTA, lacivert footer. İçerik 1200px, carousel ile aynı hiza. Fiyat/kampanya yok. WhatsApp wa.me/905307161877. Panel dokunulmadı.

Kontrol: node --check site.js geçti. npm run check katalog/teklif geçti; panel 302≠404 önceden var. Tarayıcı 1920/768/390: yatay taşma yok. Masaüstü 4 sütun kategori/avantaj/grup; tablet 2; mobil 1. CTA ve footer bağlantıları /urunler, /siparis, /sektorler, mailto, tel.

### Yayın tamamlandı
Cloudflare sürümü: fded0ffc-af20-4afe-937e-42c74088ae6c.
Önceki sürüm: 4d96f953-1a6b-4eec-b567-e0535f3be488.

## 25 Eylül — Header WhatsApp CTA
Üç katman korundu. Üst bar 30px; ana nav 76px, petrol “WhatsApp’tan Yazın” (beyaz yazı) + “Teklif Listem”. Duyuru 56px: “İhtiyacınızı iletin, uygun ürünleri birlikte bulalım.” ve “WhatsApp’tan Teklif Al” (wa.me/905307161877). Mobil: logo + WhatsApp + Liste + menü; bant kısa metin + aynı buton. Taşma yok. Carousel değişmedi. Panel dokunulmadı.

### Yayın tamamlandı
Cloudflare sürümü: cd55db25-35ba-4281-9740-ae6676a75467.
Önceki sürüm: fded0ffc-af20-4afe-937e-42c74088ae6c.

## 25 Eylül — Header WhatsApp sadeleştirme
Header içinde tek WhatsApp: ana nav “WhatsApp’tan Yazın” (wa.me/905307161877). Üst barda telefon tel: bağlantısı; duyuru bandında “Teklif İste”. Carousel ve panel değişmedi.

### Yayın tamamlandı
Cloudflare sürümü: d87efa01-5b80-4b36-b9f5-589513926df0.
Önceki sürüm: cd55db25-35ba-4281-9740-ae6676a75467.

## 25 Eylül — Kategori kart görselleri
Carousel altı 4 kart: Ofis, Temizlik, Gıda ve İkram, İçecek ve Kırtasiye — verilen still-life görseller sırayla. `object-fit: contain`. Carousel değişmedi. Panel dokunulmadı.

### Yayın tamamlandı
Cloudflare sürümü: 38feab5e-b6ba-4914-9238-0f00a58e2692.
Önceki sürüm: d87efa01-5b80-4b36-b9f5-589513926df0.

## 25 Eylül — Sektör görselleri
Altı sektör fotoğrafı doğru başlığa yerleştirildi (ana sayfa kartları ve `/sektorler`): Oteller/konaklama, Site ve Tesis Yönetimi, Ofisler, Hastaneler ve Klinikler, Okullar, Kafe ve Restoranlar. 4:3 kapak. Carousel ve panel değişmedi.

### Yayın tamamlandı
Cloudflare sürümü: 4c660aa6-07ec-4591-b0bf-c74eaf520314.
Önceki sürüm: 38feab5e-b6ba-4914-9238-0f00a58e2692.

## 25 Eylül — Yeni logo
Kullanıcının stacked FR + FERRAPRO görseli şeffaf PNG olarak alındı (kaynak 1024², kırpma, kalite kayıpsız). Header’da aynı çizimden yatay kilit; footer’da stacked kilit beyaz plaka üzerinde (lacivert zemin). Favicon/apple ikon dairesel FR. Ferranoi paneline dokunulmadı.

### Yayın tamamlandı
Cloudflare sürümü: 7493506d-2ba1-471b-810e-35115e0e74be.
Önceki sürüm: 4c660aa6-07ec-4591-b0bf-c74eaf520314.

## 25 Eylül — Neden FerraPro görseli
Ana sayfa altındaki “Neden FerraPro” ikon kartları, verilen 1024×341 grafikle değiştirildi. Büyütme yok (`max-width: 1024px`, native ölçü). Carousel, kategori ve sektör görsellerine dokunulmadı. Panel değişmedi.

### Yayın tamamlandı
Cloudflare sürümü: b519a9ff-73e4-4b90-a6d1-aff7c24085cb.
Önceki sürüm: 7493506d-2ba1-471b-810e-35115e0e74be.

## 25 Eylül — Yeni ana kategoriler
Ürünler menüsü 7 grup: Temizlik Kağıtları, Sıvı Temizlik Ürünleri, Aparat ve Ekipmanlar, Kırtasiye ve Ofis Ürünleri, Sarf ve Ambalaj Ürünleri, Gıda, Bilgisayar Sarf Ürünleri. Son 4 grup Canva ağacında boş alt grupla açıldı; 157 mevcut ürün ve 11 alt grup değişmedi. Panel (Ferranoi) dokunulmadı.

### Yayın tamamlandı
Cloudflare sürümü: 6b0483c6-d6c0-4a27-98db-ad31f9644265.
Önceki sürüm: b519a9ff-73e4-4b90-a6d1-aff7c24085cb.

## 25 Eylül — İlk ürün fotoğrafı (p-001)
Fotoselli Havlu Kağıdı (Espiga, 21 cm, 6'lı) kategori still-life yerine gerçek paket fotoğrafı. `gorselTuru: urun`; kartta “Kategori görseli” etiketi yok. Diğer 156 ürün aynı. Panel kimliği değişmedi.

### Yayın tamamlandı
Cloudflare sürümü: 2f1fc4aa-ecb0-4993-abc0-d13ada154d65.
Önceki sürüm: 6b0483c6-d6c0-4a27-98db-ad31f9644265.

## 25 Eylül — Paket fotoğrafı daireye kesilmez
Ürün fotoğrafı kare stüdyo karesinde tam paket; daire overlay kırpılmaz. Toplu foto eşleştirme kabul (paket yazısı / dosya adı).

### Yayın tamamlandı
Cloudflare sürümü: 00436631-b2bc-46e5-88e7-d4e9416b5e5b.
Önceki sürüm: 2f1fc4aa-ecb0-4993-abc0-d13ada154d65.

## 25 Eylül — p-002 İçten Çekmeli Havlu fotoğrafı
Espiga İçten Çekmeli Havlu (6'lı) gerçek paket görseli. Daire stüdyo diski, paket kesik değil.

### Yayın tamamlandı
Cloudflare sürümü: dadb647c-1ce3-40b5-8444-778f74d89142.
Önceki sürüm: 00436631-b2bc-46e5-88e7-d4e9416b5e5b.

## 25 Eylül — Havlu alt grubu paket fotoğrafları
p-003..p-007: Espiga Z 100/200, Bellino 24'lü, Solo ve Selpak dev rulo. Kart kromu yok, daire stüdyo diski.

### Yayın tamamlandı
Cloudflare sürümü: 097e1dd8-f95d-4e63-8724-c2147a07c194.
Önceki sürüm: dadb647c-1ce3-40b5-8444-778f74d89142.

## 25 Eylül — Havlu ve Peçeteler grup görseli
Alt grup kartı verilen daire still-life. Temizlik Kağıtları ana dairesi (daire-hijyen) değişmedi.

### Yayın tamamlandı
Cloudflare sürümü: 11205abb-8893-427a-9dba-43b9fb869515.
Önceki sürüm: 097e1dd8-f95d-4e63-8724-c2147a07c194.

## 25 Eylül — Islak Havlu ve Tuvalet Kağıdı alt görselleri
Islak Havlular ve Tuvalet Kağıtları alt kartları verilen daire still-life. Paketi olmayan ürünlerde kategori görseli de bu daireler.

### Yayın tamamlandı
Cloudflare sürümü: 8102db0b-aad0-4f39-bfaf-6bb808702ff6.
Önceki sürüm: 11205abb-8893-427a-9dba-43b9fb869515.

## 25 Eylül — Temizlik Kağıtları ana daire
Hijyen ana grup dairesi yeni mermer still-life. Alt grup görselleri aynı.

### Yayın tamamlandı
Cloudflare sürümü: 415ab3a7-bd4e-4c34-ad13-6b96b08454ef.
Önceki sürüm: 8102db0b-aad0-4f39-bfaf-6bb808702ff6.

## 25 Eylül — Kayar menü ana daireler
Sıvı, aparat, kırtasiye, ambalaj, gıda daireleri yeni still-life. Hijyen önceki mermer daire. PC görseli henüz yok.

### Yayın tamamlandı
Cloudflare sürümü: 2f0b4fab-29a0-4ea6-a797-e2d099099641.
Önceki sürüm: 415ab3a7-bd4e-4c34-ad13-6b96b08454ef.

## 25 Eylül — /yonetim şifre
ferrapro.com/yonetim şifre kapısı (2112, cookie). catalog.json 401. Ferranoi paneli değişmedi.

### Yayın tamamlandı
Cloudflare sürümü: f6dc0026-7279-419f-b64d-6294347ebe4d.
Önceki sürüm: 2f0b4fab-29a0-4ea6-a797-e2d099099641.

## 26 Eylül — Yeni kategori kodları
Kullanıcı 6 ana grubu ve A1–F5 altlarını verdi. Kayar menü kalktı; sabit 6 daire, hover ile alt grup ve ürün listesi.
- A Temizlik Kağıt ürünleri: A1 Havlu ve Peçeteler, A2 Islak Havlular, A3 Tuvalet Kağıtları
- B Sıvı Temizlik Ürünleri: B1 Endüstriyel, B2 Genel
- C Aparatlar ve Ekipmanlar: C1 Havlu aparatları, C2 Sabun/köpük aparatları, C3 Çöp kovaları, C4 Mop aparatları (boş)
- D Temizlik Sarf Ürünleri: D1 Çöp poşetleri, D2 Sarf malzemeleri, D3 Kullan at
- E Gıda ve Atıştırmalıklar: E1–E4 henüz ürün yok
- F Kırtasiye ve Ofis Sarf: F1–F5 henüz ürün yok (eski Ambalaj→F4, PC→F5)
Eski `/urunler?g=Hijyen` ve slug altlar yönlenir. Görseller şimdilik mevcut daireler. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: ed6125b8-9c63-4e4e-bdff-6dc1cc22dcec.
Önceki sürüm: f6dc0026-7279-419f-b64d-6294347ebe4d.

## 26 Eylül — Ürün listesi adları
Hover ve kart başlığı verdiğiniz ad + marka/ölçü/ambalaj ayrımını gösterir. Domestos Çamaşır Suyu 750 mililitre ve 3,2 litre. Çam kokulu adı kaldırıldı.

### Yayın tamamlandı
Cloudflare sürümü: d478ae8f-31fb-4756-b4f0-28374f0ba35e.
Önceki sürüm: ed6125b8-9c63-4e4e-bdff-6dc1cc22dcec.

## 26 Eylül — Ad ve ölçü standardı
Liste adı: Marka + ürün,ölçü. Örnek: Domestos Çamaşır Suyu,750ML. Marka başa alındı. İlk harfler büyük. Çıplak rakamlara birim: 4→4Lt, 2,5→2,5Lt, 400→400ML. mililitre→ML, litre→Lt, santimetre→Cm, kilogram→Kg. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: 191a00ef-02ec-4942-996d-00cae6446d18.
Önceki sürüm: d478ae8f-31fb-4756-b4f0-28374f0ba35e.

## 26 Eylül — Çay ve şeker
E1 Çay ve Şekerler: 19 ürün (Doğuş, Lipton, Çaykur, Balküpü, Irmak). Ad kuralı aynı: marka başta, 100'lü / 40Gr / 1Kg / 125Gr / 5Kg. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: 75f26468-8bf6-480e-a79b-3a4f9b70d9ec.
Önceki sürüm: 191a00ef-02ec-4942-996d-00cae6446d18.

## 26 Eylül — Kahve ve içecek
E2 Kahve: 12 ürün (Nescafe, Cafemate, Tchibo, Mehmet Efendi). E3 İçecek: 16 ürün (soda, kola, ice tea, enerji, meyve suyu, süt). Ad kuralı aynı: 900Gr, 250ML, 24'lü, 72'li. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: ca1fb7ba-634d-401b-8a90-8474400ade73.
Önceki sürüm: 75f26468-8bf6-480e-a79b-3a4f9b70d9ec.

## 26 Eylül — Su
E3’e Sırmakeş Su,0,5Lt 12'li ve Bardak Su,200ML 12'li eklendi.

### Yayın tamamlandı
Cloudflare sürümü: d0aac3df-efa5-41aa-8c3b-56ae58542fed.
Önceki sürüm: ca1fb7ba-634d-401b-8a90-8474400ade73.

## 26 Eylül — Atıştırmalık
E4 Atıştırmalıklar: 15 ürün (Ülker, Eti, Fellas). 30Gr 24'lü, 12'li bar paketleri.

### Yayın tamamlandı
Cloudflare sürümü: b41f0a97-cecb-490b-b758-4fdf17fab423.
Önceki sürüm: d0aac3df-efa5-41aa-8c3b-56ae58542fed.

## 26 Eylül — Atıştırmalık paket
Çubuk Kraker 36'lı, Topkek 24'lü, Browni 20'li, Lifalif 12'li.

### Yayın tamamlandı
Cloudflare sürümü: 6d8ddbf4-ad63-4b57-9673-d2db05d93770.
Önceki sürüm: b41f0a97-cecb-490b-b758-4fdf17fab423.

## 26 Eylül — Kalem
F1 Kalem ve Yazı Gereçleri: 22 ürün (Pensan 50'li üç renk, BIC, Edding, Noki, Pilot, Faber-Castell, kurşun/kopya).

### Yayın tamamlandı
Cloudflare sürümü: 5d4d3b4f-14bf-4cad-a75e-d111b69aab77.
Önceki sürüm: 6d8ddbf4-ad63-4b57-9673-d2db05d93770.

## 26 Eylül — Dosyalama
F3 Dosya ve Arşivleme: 16 ürün (klasör, Noki/Leitz poşet, sekreterlik, separatör, sunum/imza dosyası).

### Yayın tamamlandı
Cloudflare sürümü: 1a53d75f-7784-427d-adc4-fa7ec612fd98.
Önceki sürüm: 5d4d3b4f-14bf-4cad-a75e-d111b69aab77.

## 26 Eylül — Kırtasiye sıfırlandı
F grubu ürünler silindi (38 satır). F1–F5 kategorileri boş duruyor; yeni bayi listesiyle yeniden yazılacak.

### Yayın tamamlandı
Cloudflare sürümü: 4633b88f-ba5f-487a-8053-99b504903cec.
Önceki sürüm: 1a53d75f-7784-427d-adc4-fa7ec612fd98.

## 26 Eylül — Kırtasiye test ürünü
MAS 0937 Omega Kıskaç,51Mm Çelik 12'li F2 Masaüstü. Bayi görseli ürün fotoğrafı olarak alındı; stok/teslimat yazılmadı.

### Yayın tamamlandı
Cloudflare sürümü: ab132fd6-0e7b-483c-8dc2-975d0955a6b3.
Önceki sürüm: 4633b88f-ba5f-487a-8053-99b504903cec.

## 26 Eylül — Kıskaç görsel/ad
Bayi kodu (0937) addan çıkarıldı. Görsel native boyutta lossless webp; kartta küçük gösteriliyor, büyütme yok.

### Yayın tamamlandı
Cloudflare sürümü: ad0c168a-d10c-4556-b10e-036a113e4125.
Önceki sürüm: ab132fd6-0e7b-483c-8dc2-975d0955a6b3.

## 26 Eylül — Masaüstü 4 ürün
MAS Toplu İğne, Harita Çivisi; Rio Silindirik Harita Çivisi; MAS Omega Kıskaç 32Mm. 51Mm kıskaç zaten vardı, tekrarlanmadı. Kod ve min. sipariş yok.

### Yayın tamamlandı
Cloudflare sürümü: 86a61120-3dd4-4b46-8ff7-626dfed5410a.
Önceki sürüm: ad0c168a-d10c-4556-b10e-036a113e4125.

## 26 Eylül — Fotoğraf büyütme ve bant/ajanda
Ürün fotoğrafına tıklayınca native görsel en fazla 2,5× açılıyor (640’a zorlanmıyor). F2’ye Panfix/Noki bant, MAS kesici ve Liz ajanda; F4’e MAS koli bandı eklendi. Kod ve min. sipariş yok. npm run check: 238 satır.

### Yayın tamamlandı
Cloudflare sürümü: 1001f610-9e9c-4495-961c-868420cc73df.
Önceki sürüm: 178a2853-1c18-4b8b-9ec5-6dfd64077ae6.

## 26 Eylül — Görsel kalite
Bayi liste karesi büyütülemez. MAS Omega Kıskaç ve Escrito imha makinesi üretici/stüdyo fotoğrafıyla değiştirildi; Leitz laminasyon kutu görseli eklendi. Gıpta ajanda, Sinerji kalem, telli/halkalı dosyalar da katalogda. npm run check: 251 satır.

### Yayın tamamlandı
Cloudflare sürümü: f7fb3415-f45e-47c3-9e08-02b1a9df73b3.
Önceki sürüm: 1001f610-9e9c-4495-961c-868420cc73df.

## 26 Eylül — Kırtasiye stüdyo fotoğrafları
Bayi liste kareleri büyütülemez; aynı ürünlerin üretici/stüdyo paketi bulundu (Ofix, Ofma, Garantiofis, Yıldız Büro, OfiseAl, ofisostim, Garboly). Yanlış yıl/SKU ve Avansas filigranı atıldı. Gıpta 102-ECK 2026 ve Noki 4 halkalı için doğrulanmış net stüdyo yok; bayi karesi duruyor. npm run check: 251 satır.

### Yayın tamamlandı
Cloudflare sürümü: b1dca412-f0f1-4ebb-840a-653bf32b0e16.
Önceki sürüm: f7fb3415-f45e-47c3-9e08-02b1a9df73b3.

## 26 Eylül — F1 Kalem ve Yazı Gereçleri
Pensan / BIC / Pilot / Faber-Castell / Edding stüdyo paket görselleri (Ofix CDN). Tükenmez renkleri, Pilot roller, kurşun HB/2B, versatil, kalem ucu 0,7Mm 2B, Edding tahta dört renk, asetat (Edding 3000 ve Faber silgili), fosforlu renkleri. MAS kalem üretmiyor, eklenmedi. İstenen markalarda doğrulanmış dolma kalem stüdyosu yok, eklenmedi. Bayi sitesi taranmadı. Fiyat yok. npm run check: 283 satır, F1=33.

### Yayın tamamlandı
Cloudflare sürümü: 9c9c2c24-7387-4fe1-a50a-05d4fc3e4d37.
Önceki sürüm: b1dca412-f0f1-4ebb-840a-653bf32b0e16.

## 26 Eylül — F2 Masaüstü zımba ve gereçler
MAS zımba No:10 / 24/6 ve uyumlu tel, delgeç, makas, metal kalemlik; Leitz tel sökücü. Stüdyo ürün çekimi (Ofma/Ofix). Kutu/kod karesi kullanılmadı. Fiyat yok. npm run check: 291 satır, F2=27.

### Yayın tamamlandı
Cloudflare sürümü: af37957e-6912-47b5-8894-55f6b6fb62f3.
Önceki sürüm: 9c9c2c24-7387-4fe1-a50a-05d4fc3e4d37.

## 26 Eylül — F2 Istampa
MAS mürekkepsiz ıstampa 8×9 ve 10×13, açık stüdyo çekimi. MAS mürekkep şişesi görseli 181px kaldı, eklenmedi. npm run check: 293 satır, F2=29.

### Yayın tamamlandı
Cloudflare sürümü: 2400911a-ee72-4748-9782-46b2b7880136.
Önceki sürüm: af37957e-6912-47b5-8894-55f6b6fb62f3.

## 26 Eylül — Kartvizit alternatifleri
Ayfer Adatepe için üç 85×55 ön/arka taslak: site FR logosu, ferrapro.com karekodu, 0530 716 18 77 ve info@ferrapro.com. Eski altıgen R markası kullanılmadı. Önizleme: /kartvizit/onizleme.html

### Yayın tamamlandı
Cloudflare sürümü: 5ac2bd16-2604-40c5-bcc7-ceaaa0bc9f5c.
Önceki sürüm: 2400911a-ee72-4748-9782-46b2b7880136.

## 26 Eylül — Kartvizit titanyum gri
Ortadaki tekrarlayan FR kaldırıldı. 55×85 mm fırçalı titanyum; ön yüzde gerçek logo plakası, arka yüzde ferrapro.com karekodu.

### Yayın tamamlandı
Cloudflare sürümü: cda12121-2664-4543-abda-d36a04f7415b.
Önceki sürüm: 670b240c-8bb9-47e1-bb3b-835bbef28ff2.

## 26 Eylül — F3 Dosya ve Arşivleme
Klasör (Noki geniş/dar, Esselte geniş/dar), çıtçıtlı, sekreterlik (Kraf kapaksız, Esselte kapaklı), Noki separatör A-Z / 1-31 / renkli, sunum 40 yaprak, Noki eco poşet, Esselte sıkıştırmalı. Dilman imza dosyası kaldırıldı. Stüdyo çekimi (Ofix/Ofma). Yarım kapak stüdyosu yok, eklenmedi. Kod ve fiyat yok.

### Yayın tamamlandı
Cloudflare sürümü: ba185e03-952a-47cb-8699-83166305d305.
Önceki sürüm: c4af4274-ae66-419c-bd91-81c3feed8fac.

## 26 Eylül — F3 üretici görselleri
Noki F3 görselleri noki.com.tr ürün sayfalarından alındı. Esselte sıkıştırmalı, telli mavi, klasör ve Leitz poşet esselte.com / leitz.com. Noki 4 halkalı resmi sitede yok, 2 halkalı ile değiştirildi; separatör 1-31 resmi sitede 1-20. Kraf sitesi bakımda; Kraf sekreterlik ve bazı Esselte/Leitz telli renkleri hâlâ bayi karesi. Fiyat yok.

### Yayın tamamlandı
Cloudflare sürümü: f44c7da8-e926-4fe3-8ee7-00e6d513158a.
Önceki sürüm: ba185e03-952a-47cb-8699-83166305d305.

## 26 Eylül — F3 çapraz marka ve ofis genişletme
Kraf sekreterlik ve resmi görseli olmayan Esselte/Leitz telli-halkalı satırlar çıkarıldı. Yerine Noki (kapaklı sekreterlik, lastikli, çift sıkıştırmalı, eco telli kırmızı/siyah, 2 halkalı siyah, ay ayraç, HD poşet), Leitz (kutu dosya, körüklü, evrak çantası, arşiv kutusu) ve Esselte Recycle poşet eklendi. Görseller noki.com.tr / leitz.com / esselte.com. Neon asorti lastikli setler eklenmedi. F3=28, katalog=312. Fiyat ve ürün kodu yok.

### Yayın tamamlandı
Cloudflare sürümü: d0beddb2-8d82-4abf-87a1-241837233215.
Önceki sürüm: f44c7da8-e926-4fe3-8ee7-00e6d513158a.

## 26 Eylül — A1 Havlu ve Peçete üretici görselleri
A1 pazaryeri kırpımları Başak Kağıt (Espiga), selpak.com.tr ve solo.com.tr görselleriyle değiştirildi. Bellino’nun üretici sitesi yok; ev tipi rulo Selpak 12’li resmi paketle çaprazlandı. Espiga Z 150’li, dispenser peçete ve Solo peçete 100’lü eklendi. A1=10, katalog=315. Fiyat ve ürün kodu yok.

### Yayın tamamlandı
Cloudflare sürümü: cd8c194a-05c7-4a17-a081-e7327d9a8c2b.
Önceki sürüm: d0beddb2-8d82-4abf-87a1-241837233215.

## 26 Eylül — A1 Belinno ev tipi / endüstriyel ayrımı
Bellino slotu Aktül Belinno Deluxe ev tipi 6’lı resmi paketle düzeltildi. Selpak 12’li ev tipi korundu. Belinno Professional hareketli havlu, Z 200’lü paket ve dispenser peçete eklendi (endüstriyel). Espiga koli/shrink endüstriyel, Selpak/Solo market paketi ev tipi. A1=14, katalog=319.

### Yayın tamamlandı
Cloudflare sürümü: 51b86105-c8aa-4c53-ab4b-d7885087b649.
Önceki sürüm: cd8c194a-05c7-4a17-a081-e7327d9a8c2b.

## 26 Eylül — A2 Islak Havlular
Kategori diski kaldırıldı; üretici paket görselleri. Sleepy kişisel bakım / Easy Clean yüzey / süper mutfak; Solo ıslak mendil (okyanus, zeytinyağlı) ve yüzey (beyaz sabun, AquaBlock); Polente Extra Soft 100’lü. Selpak resmi sitede ıslak havlu yok, Komili sitesi 500 ve Soft SKU bebek; A2’ye alınmadı. Familia, DeepFresh, Freshmaker resmi paketleriyle eklendi. A2=13, katalog=328. Alt grup dairesi marka paket karışımı (Solo, Sleepy, Polente, DeepFresh, Familia, Freshmaker). A grubu ana fotoğrafı A1+A2 marka paket karışımı (Espiga, Selpak, Solo, Polente, Sleepy). Grup açılınca üst daireler A1/A2/A3 (148px); Islak Havlular karışımı orada. Havlu ve Peçeteler dairesi Espiga, Selpak, Solo, Belinno paket karışımı.

### Yayın tamamlandı
Cloudflare sürümü: e0a2c6f2-dcd3-4931-a7f2-92053a0a3f09.
Önceki sürüm: 333943c0-bb51-4c18-a08b-a5320e03d1cd.

## 26 Eylül — A3 Tuvalet Kağıtları ve B Sıvı Temizlik
A popüler markalara Polente, DeepFresh, Freshmaker eklendi (Belinno A1’den duruyor). A3=15, tümü üretici paket görseli: Espiga jumbo/içten çekmeli/Extra Soft, Selpak 12/Deluxe/Extra/Premium, Solo Ultra 12/48, Polente compact/mini jumbo, Familia Saf Su/Plus, Papia 32. A3 dairesi bu paketlerin karışımı. Belinno tuvalet tekil paket yok, eklenmedi.

B popüler: Yumoş, Vernel, Ozopak, Fairy, Domestos, Cif, Pril, Finish, Asperox, Porçöz. B2=19; 12 satır üretici paketi (Cif krem/Power & Shine, Domestos 750/püskürtme, Pril Ultra Güç, Finish 50/parlatıcı/tuz, Asperox Sarı Güç, Yumoş Sakura/Nergis). B1 Ozopak 5Kg gül yüzey ve limon bulaşık bidonları bravodetergent.com (Tempak). Yumoş Professional 5Lt Yasemin ve Tekstil Parfümü Lilyum unileverprofessional.com; Vernel 5Lt Hassas & Yumuşak Henkel B2B. B1 dairesi dört bidon. Katalog=337.

Ozopak derin tarama (bravodetergent.com 38 ürün + medya kütüphanesi, tempak.com.tr arama ve ürün CPT): resmi Ozopak paket fotoğrafı yalnızca 5Kg gül yüzey ve 5Kg limon bulaşık. Ultra çamaşır suyu / beyaz sabun yüzey satırları Bravo logosu yer tutucu. 20Kg, el sabunu, cam, kireç, yağ çözücü, arap sabunu, köpük, ahşap ve bulaşık makinesi kimyasalları için üretici paket yok. Perakende karesi alınmadı.

### Yayın tamamlandı
Cloudflare sürümü: b0ed6076-d6be-4dd7-8a95-c4ac7f269d27.
Önceki sürüm: 4054f8bd-a1d0-41c9-b4ff-4d870ac8fff8.

## 27 Eylül — B2 Genel Temizlik üretici paketleri (tekrar tarama)
Henkel ürün görselleri portalı, Asperox CDN, Cif/Domestos resmi katalog, Porçöz ürün sayfaları ve Bref paketi bulundu. B2=19; 18 satır üretici paketi. Pril 4Kg Limon henkelurungorselleri.com; Asperox Mavi Güç cdn.asperox.com.tr; Cif krem 750ML cif.com.tr (500/750/1500 aynı resmi packshot); Domestos 3,2Lt Dağ Esintisi domestos.com (3,5kg boyutu aynı ürün ailesi); Porçöz Jel Lavabo Açıcı 1Lt porcoz.com; Bred satırı resmi Bref 2’li Rezervuar Küpleri Okyanus packshot ile düzeltildi. B2 dairesi bu paketlerin karışımı.

Bingo 2,5Lt: bingo.com.tr 404; Hayat kurumsal sitede ürün packshot yok. Wayback’te ürün listesi HTML’i var (Fresh Mutlu Yuvam 2,5Lt vb.) ama paket PNG dosyaları arşivde 404. Perakende karesi alınmadı; p-048 kategori görseli duruyor.

Ozopak bu turda dokunulmadı (kullanıcı bakacak).

Katalog=337. Fiyat ve ürün kodu yok.

### Yayın tamamlandı
Cloudflare sürümü: 2b7b8e8d-7004-428b-b7f6-9b0d959710c7.
Önceki sürüm: b0ed6076-d6be-4dd7-8a95-c4ac7f269d27.

## 27 Eylül — Kullanıcı packshotları ve eşit görsel kare
Kartlarda ürün fotoğrafı 112px’e sıkışıyordu; tüm ürün kareleri aynı oranla dolduruluyor. Kullanıcının verdiği görseller: Ozopak sıvı el sabunu 5Kg, Ozopak kıvamlı çamaşır suyu 5Kg, Domestos 3,2Lt bidon (Çam Ferahlığı), Pril 4Kg Limon, Bingo Fresh Masal 2,5Lt. Mevcut üretici paketleri de aynı 640 kare / %88 doldurma ile hizalandı. B2=19 tümü ürün görseli. B1’e sabun ve çamaşır suyu eklendi.

Katalog=337. Fiyat ve ürün kodu yok.

### Yayın tamamlandı
Cloudflare sürümü: 97907aef-c84b-4c45-89cb-4fb7ee3a2335.
Önceki sürüm: 2b7b8e8d-7004-428b-b7f6-9b0d959710c7.

## 27 Eylül — Ozopak tamamlayıcı görseller ve küçük kartlar
B1’de resmi paketi olmayan Ozopak satırları mevcut bidon fotoğraflarından türetildi: 20Kg aynı ürün ailesinin 5Kg görseli; cam / kireç / yağ / arap sabunu / ahşap / makine kimyasalları renk ayrımı + ürün adı. Köpük sabun, sıvı sabun görselini kullanır. Ürün kartı fotoğrafı ~92px; tıklanınca büyür. Ozopak B1=20, tümü ürün görseli.

Katalog=337. Fiyat ve ürün kodu yok.

### Yayın tamamlandı
Cloudflare sürümü: 8bed3f8e-e112-4f80-8cfc-cb6bcf79be45.
Önceki sürüm: 97907aef-c84b-4c45-89cb-4fb7ee3a2335.

## 27 Eylül — C Aparat ve ekipman daireleri + Palex ürün görselleri
C grubu sırası: ana daire, alt daireler, sonra ürün. Ana daire Palex gold fotoselli + Z havlu + mavi sabun + jumbo gold + Vialli krom + Palex pedal + Parex Tornado karışımı. Alt daireler: C1 havlu aparatları, C2 sabun/köpük (Palex + Vialli), C3 Palex krom kova ailesi, C4 Parex Extra Power + Tornado (C4 hâlâ ürünsüz).

C1–C3 = 30 satır, Palex resmi görsel, gorselTuru=urun. C4 ürün yok. Vileda.com.tr 403; Flosoft/Çetin Plastik görselsiz placeholder. Palex klozet örtüsü resmi bulunamadı (Z peçete kutusuna en yakın duvar kutusu). Ev tipi metal için Palex ahşap görünümlü içten çekmeli; 120/240/800Lt için Palex bahçe / geri dönüşüm istasyonu. Palex pedal/sallanır kovalar krom; plastik gövde resmi yok.

Katalog=337. Fiyat ve ürün kodu yok. site.js v=113.

### Yayın tamamlandı
Cloudflare sürümü: 67e36f5f-3558-4d98-9d5d-67c63d5c08cc.
Önceki sürüm: 8bed3f8e-e112-4f80-8cfc-cb6bcf79be45.

## 27 Eylül — Yönetim fiyatları + C4 mop + D/E görseller
Yönetim `/yonetim` ürün listesini her açılışta `katalog.json` üzerinden kurar. Ürün eklenince/silinince/güncellenince sayfa kendiliğinden aynı içeriği gösterir. Görsel yok. Birim, maliyet, liste, ideal satış, dip satış ve kârlılık % tarayıcıda saklanır; kamu kataloguna fiyat yazılmaz.

C4 mop: 8 Parex resmi ürün (Extra Power, Tornado, Wondero, Pedallı, Twister, Clipster, yedek mop). D: Koroplast poşet/folyo/streç + Parex sünger/bez/süpürge + Ceymop mop. E: Ülker Halley ve Mehmet Efendi kahve resmi; çay/içecek şişe görselleri üretici siteden alınamadı, alt daire karışımı kullanıldı.

Katalog=361. Fiyat ve ürün kodu yok. site.js v=114. Yönetim yonetim.js v=2.

### Yayın tamamlandı
Cloudflare sürümü: 6297f474-77f7-4f55-8bea-c53934b2fc72.
Önceki sürüm: 67e36f5f-3558-4d98-9d5d-67c63d5c08cc.

## 27 Eylül — D3 Kullan At ürün görselleri
Folyo karışım diski (daire-kullan-at.webp) tabak/çatal/hijyen kartlarına basılmıştı. D3 ürün kartları üretici fotoğrafına çekildi: Nur-Nil tabak/kase/çatal/kaşık/bıçak/pipet, Damas kraft karton tabak, Koroplast büyük boy buzdolabı poşeti, şeffaf eldiven, tela bone/kolluk, aşçı kepi, bambu kürdan. Alt daire karışımı tabak + kaşık + pipet + karton + folyo.

Salata kasesi Nur-Nil resmi beyaz kase (katalogda kapaklı siyah yazıyor; siyah kapaklı üretici fotoğrafı yok). Aşçı Kepçesi satırı hijyen grubunda; görsel aşçı kepi.

Katalog=361. Fiyat yok. npm run check geçti.

### Yayın tamamlandı
Cloudflare sürümü: c5cc3d9c-ae8d-4c73-8b2f-d56bbe794fd8.
Önceki sürüm: 6297f474-77f7-4f55-8bea-c53934b2fc72.

## 27 Eylül — Komili ıslak havlu + 80/800 lt konteyner
A2: Komili Islak Temizlik Havlusu 90'lı, kullanıcının paket görseli, 640 kare webp. C3: 800Lt metal galvaniz çöp konteyneri ve 80Lt tekerlekli plastik çöp konteyneri. Palex 800Lt kova satırları duruyor. Katalog=364. site.js v=115.

### Yayın tamamlandı
Cloudflare sürümü: 3adb2ab5-5c51-4522-bdb1-5a1f7563b013.
Önceki sürüm: c5cc3d9c-ae8d-4c73-8b2f-d56bbe794fd8.

## 27 Eylül — MAS masa altı + plastik pedal / sallanır kova
C3: MAS Masa Altı Çöp Kovası (tel örgü, kullanıcının görseli), markasız plastik pedallı kova ve markasız sallanır kapaklı plastik kova. Palex pedal/sallanır/masa altı satırları duruyor. Katalog=367. site.js v=115.

### Yayın tamamlandı
Cloudflare sürümü: dbf2b0fd-99d2-429d-98b7-2a06113231e2.
Önceki sürüm: 3adb2ab5-5c51-4522-bdb1-5a1f7563b013.

## 27 Eylül — C3 yanlış Palex satırları silindi
Plastik yazıp metal görünen pedal/sallanır/pratik, lobi kovasına masa altı diyen, 120/240/800 litre yazıp sokak kovası veya geri dönüşüm üçlüsü gösteren Palex satırları kaldırıldı. Kullanıcının 80/800 konteyner, MAS masa altı, plastik pedal ve sallanır kovaları duruyor. Palex metal pedal ve Palex metal sallanır görseli ad/malzeme ile uyduğu için kaldı. Katalog=358.

### Yayın tamamlandı
Cloudflare sürümü: 445908d6-7149-4615-811c-5051fa9d0005.
Önceki sürüm: dbf2b0fd-99d2-429d-98b7-2a06113231e2.

## 27 Eylül — MRP çöp poşeti görselleri
MRP Marin D1 satırlarındaki Koroplast paket fotoğrafları kaldırıldı. Standart/mini boylara renkli poşet grubu, endüstriyel ve jumbo/konteyner boylara siyah rulo görseli. Koroplast satırları kendi görsellerinde kaldı.

### Yayın tamamlandı
Cloudflare sürümü: 041db389-ae79-4a27-a1b1-856b6336979b.
Önceki sürüm: 445908d6-7149-4615-811c-5051fa9d0005.

## 27 Eylül — Ceymop mop görselleri
D2 Ceymop satırları üretici mop-grubu fotoğraflarına çekildi: Islak Mop extra ıslak, Nemli Mop extra nemli, Orlon Mop zincirdikiş orlon. 50/60/80 cm varyantları aynı aile görselini kullanıyor; CYP kodu kataloga yazılmadı.

### Yayın tamamlandı
Cloudflare sürümü: 7d6aac0f-8e85-45a1-acc8-1de29ddeb9a6.
Önceki sürüm: 041db389-ae79-4a27-a1b1-856b6336979b.

## 27 Eylül — Parex cam / temizlik bezi görselleri
D2 Parex Mikrofiber Cam Bezi üretici cam bezi paket fotoğrafına alındı; temizlik bezi satırları Parex 2'li mikrofiber temizlik bezi paketine çekildi. Aynı 2'li görsel cam bezinde kullanılmıyor.

### Yayın tamamlandı
Cloudflare sürümü: 6878ee29-626a-4866-990d-76664c456a59.
Önceki sürüm: 7d6aac0f-8e85-45a1-acc8-1de29ddeb9a6.

## 27 Eylül — Parex Ovma Teli
D2 Bulaşık Teli satırı Ovma Teli olarak düzeltildi; mercan sünger görseli kalktı, kullanıcının 3'lü Parex Ovma Teli paket fotoğrafı eklendi.

### Yayın tamamlandı
Cloudflare sürümü: 7a04dfe9-bc11-4ec6-922d-0ba3cbc5b7c6.
Önceki sürüm: 6878ee29-626a-4866-990d-76664c456a59.

## 27 Eylül — Yer çekme aparatı görselleri
D2 yer çekme aparatları: metal 55/75 cm alüminyum çekçek fotoğrafları, plastik satırlar beyaz plastik çekçek fotoğrafı. Metal görsel plastik satıra konmadı.

### Yayın tamamlandı
Cloudflare sürümü: 1516aad0-c06c-4bc6-81fb-387bfc9ab0c0.
Önceki sürüm: 7a04dfe9-bc11-4ec6-922d-0ba3cbc5b7c6.

## 27 Eylül — Parex 35 cm plastik cam sileceği
p-075 Cam Çek-Sil Aparatı (Parex, 35Cm, Plastik) ekran bezi görselinden çıkarıldı; kullanıcının Parex Cam Sileceği paket fotoğrafı kondu. 45 cm ve metal satırlara basılmadı.

### Yayın tamamlandı
Cloudflare sürümü: 4c2be98b-e09e-4ec4-9fdc-ee575ca2cf5f.
Önceki sürüm: 1516aad0-c06c-4bc6-81fb-387bfc9ab0c0.

## 27 Eylül — Parex cam sileceği 24 cm
Cam çek-sil 35/45 cm satırları kalktı. Parex Cam Sileceği iki seçenek: 24Cm plastik ve 24Cm metal. Cam peluşu duruyor. Katalog=356.

### Yayın tamamlandı
Cloudflare sürümü: 8a00b73b-a252-4e87-b1dd-19c466f37e5e.
Önceki sürüm: 4c2be98b-e09e-4ec4-9fdc-ee575ca2cf5f.

## 27 Eylül — Ceymop cam peluşu
Cam peluşu iki seçenek (35Cm ve 45Cm), marka Ceymop, ortak üretici peluş görseli. Parex ekran bezi fotoğrafı kalktı.

### Yayın tamamlandı
Cloudflare sürümü: 9c5fa098-a83f-4f55-8553-5bf55bfd6a6a.
Önceki sürüm: 8a00b73b-a252-4e87-b1dd-19c466f37e5e.

## 27 Eylül — Parex plastik klozet fırçası
D2 plastik klozet fırçası Parex markası ve WC fırça görseliyle güncellendi. Metal klozet fırçası satırına basılmadı.

### Yayın tamamlandı
Cloudflare sürümü: 0efe4a5e-e412-4bd3-8474-8f58ded89a1e.
Önceki sürüm: 9c5fa098-a83f-4f55-8553-5bf55bfd6a6a.

## 27 Eylül — Ceymop klozet fırçası + eldiven görselleri
D2'ye Ceymop plastik klozet fırçası eklendi. Nitril ve pudralı muayene eldivenlerine ürün görseli kondu. Parex plastik fırça duruyor. Katalog=357.

### Yayın tamamlandı
Cloudflare sürümü: c0e02c27-0b89-4a73-965e-d04b5e0b4ea4.
Önceki sürüm: 0efe4a5e-e412-4bd3-8474-8f58ded89a1e.

## 27 Eylül — Ceymop çift kovalı temizlik arabası
D2 Çift Kovalı Temizlik Arabası Ceymop markası ve üretici görseliyle güncellendi.

### Yayın tamamlandı
Cloudflare sürümü: 981ca1da-0d54-4d75-8498-1811a3dbcc05.
Önceki sürüm: c0e02c27-0b89-4a73-965e-d04b5e0b4ea4.

## 27 Eylül — Ceymop kat arabası ve tek kovalı set
D2: Ceymop plastik kat arabası, krom kat arabası ve tek kovalı temizlik seti. Çift kovalı satır duruyor. Katalog=359.

### Yayın tamamlandı
Cloudflare sürümü: ee1bd1a1-a1bb-4a46-9ad7-0275964b7d3f.
Önceki sürüm: 981ca1da-0d54-4d75-8498-1811a3dbcc05.

## 27 Eylül — Oto fırçası ve D2 temizlik
Parex Mega Oto Fırçası 20 cm görseli kondu. Metal klozet fırçası, pudrasız muayene eldiveni ve temizlik kovası silindi. Katalog=356.

### Yayın tamamlandı
Cloudflare sürümü: 47d4b6f5-9a88-4c0e-ad5d-8f9ec5281397.
Önceki sürüm: ee1bd1a1-a1bb-4a46-9ad7-0275964b7d3f.

## 27 Eylül — Parex pedallı ve Extra Power
Parex Pedallı Otomatik Temizlik Seti ve Extra Power Temizlik Seti görselleri üretici fotoğraflarıyla yenilendi. Katalog=356.

### Yayın tamamlandı
Cloudflare sürümü: 0b4565ba-48c3-4987-9de5-0f3499114986.
Önceki sürüm: 47d4b6f5-9a88-4c0e-ad5d-8f9ec5281397.

## 27 Eylül — Kullan at kaseler
Salata kasesi markasız 25'li olarak güncellendi. Siyah kapaklı ve kraft çorba kaseleri 16 oz / 25'li olarak ayrıldı. Katalog=357.

### Yayın tamamlandı
Cloudflare sürümü: d4605634-5e68-4305-97ea-9d15e44721cd.
Önceki sürüm: 0b4565ba-48c3-4987-9de5-0f3499114986.

## 27 Eylül — Kullan at tabaklar
19-21-23 cm plastik tabak tek üründe birleştirildi. Kağıt tabak 17-21-23 cm olarak güncellendi. Katalog=353.

### Yayın tamamlandı
Cloudflare sürümü: 089385bd-76f1-4b86-9412-26ce56ce11e2.
Önceki sürüm: d4605634-5e68-4305-97ea-9d15e44721cd.

## 27 Eylül — Aşçı kepi
Aşçı Kepçesi adı Aşçı Kepi olarak düzeltildi. Katalog=353.

### Yayın tamamlandı
Cloudflare sürümü: 6416b213-d60d-4f45-9706-21a2d2642f30.
Önceki sürüm: 089385bd-76f1-4b86-9412-26ce56ce11e2.

## 27 Eylül — Parex mutfak yardımcıları
Buzdolabı poşeti küçük/orta, streç film 15/33 m ve alüminyum folyo 8/15 m Parex üretici görselleriyle güncellendi. Katalog=352.

### Yayın tamamlandı
Cloudflare sürümü: 2b701218-571b-47e2-a394-ce7b1422d8e5.
Önceki sürüm: 6416b213-d60d-4f45-9706-21a2d2642f30.

## 27 Eylül — Doğuş çay görselleri
Doğuş Earl Grey demlik, Karadeniz demlik/bardak ve Karadeniz 1 kg dökme üretici görselleriyle güncellendi. Katalog=350.

### Yayın tamamlandı
Cloudflare sürümü: 481424f1-4a73-4ef7-804d-5f833aaeb7ef.
Önceki sürüm: 2b701218-571b-47e2-a394-ce7b1422d8e5.

## 27 Eylül — Doğuş jumbo demlik
Doğuş Jumbo Demlik Çay görseli 25x40 g poşet fotoğrafıyla güncellendi. Katalog=350.

### Yayın tamamlandı
Cloudflare sürümü: 0ebc3242-b2a5-4965-9b0e-5eeaf51c2a74.
Önceki sürüm: 481424f1-4a73-4ef7-804d-5f833aaeb7ef.

## 27 Eylül — Çaykur çay görselleri
Çaykur Turist, Filiz, Tomurcuk ve Tiryaki görselleri güncellendi. Katalog=350.

### Yayın tamamlandı
Cloudflare sürümü: 17da1b54-0024-48a5-9d23-157baedd0c11.
Önceki sürüm: 0ebc3242-b2a5-4965-9b0e-5eeaf51c2a74.

## 27 Eylül — Lipton çay görselleri
Lipton demlik, bardak ve Earl Grey 100'lü görselleri güncellendi. Katalog=350.

### Yayın tamamlandı
Cloudflare sürümü: 1dc63e21-6a8c-4aca-b572-1c67be4f4504.
Önceki sürüm: 17da1b54-0024-48a5-9d23-157baedd0c11.

## 27 Eylül — Şeker görselleri
Balküpü 1/5 kg küp, Irmak 1 kg küp, tek sargılı ve stick şeker görselleri güncellendi. Katalog=350.

### Yayın tamamlandı
Cloudflare sürümü: 5e34c7cc-b799-4a07-8fc3-1da7af06ffef.
Önceki sürüm: 1dc63e21-6a8c-4aca-b572-1c67be4f4504.

## 27 Eylül — Çay ve şekerler daire
Çay ve şekerler grup görseli kahve karışımından çıkarıldı; Çaykur, Lipton, Doğuş ve Balküpü ürünleriyle yenilendi. Katalog=350.

### Yayın tamamlandı
Cloudflare sürümü: fb3598a6-8d1d-4177-b0f8-a875ff9bc2d4.
Önceki sürüm: 5e34c7cc-b799-4a07-8fc3-1da7af06ffef.

## 27 Eylül — Kahve grubu üretici görselleri
NESCAFÉ Gold/Classic, Coffee Mate krema, Tchibo çekirdek/filtre ve Mehmet Efendi Türk/çekirdek/filtre ürünleri üretici sitelerinden güncellendi. Cafemate yazımı Coffee Mate olarak düzeltildi. Katalog=354.

### Yayın tamamlandı
Cloudflare sürümü: caf75aa8-32f2-4693-89b4-63d3c88bbd5f.
Önceki sürüm: fb3598a6-8d1d-4177-b0f8-a875ff9bc2d4.

## 28 Eylül — Kahve grubu daire
Kahve grup görseli yalnızca Mehmet Efendi kutularından çıkarıldı; NESCAFÉ Gold/Classic, Coffee Mate, Tchibo ve Mehmet Efendi ürünleriyle yenilendi. Katalog=354.

### Yayın tamamlandı
Cloudflare sürümü: 7ea32382-a63a-41db-8eae-867535c2370b.
Önceki sürüm: caf75aa8-32f2-4693-89b4-63d3c88bbd5f.

## 28 Eylül — NESCAFÉ 3'ü 1 Arada
Eski 3'ü 1 Arada satırları kaldırıldı; nescafe.com/tr 3ü1 Arada sayfasındaki Original, Sütlü Köpüklü, Extra, Fındık, Karamel ve Ice Original eklendi. Katalog=358.

## 28 Eylül — İçecek grubu üretici görselleri
E3 ürün görselleri üretici sitelerinden alındı: Beypazarı, Sırma, Coca-Cola, Fanta, Fuse Tea, Cappy, İçim, Pınar, Sırmakeş. Ice Tea satırları Coca-Cola TR’de Lipton yerine Fuse Tea olduğu için Fuse Tea kutu görseli ve marka adıyla güncellendi.

## 28 Eylül — Red Bull, Erikli, Cappy kutu
Kullanıcının gönderdiği görseller bağlandı: Red Bull 250ML, Cappy Şeftali kutu, Cappy Vişne 12'li koli, Erikli 0,5Lt. Erikli Cam Şişe Su 330ML ve Premium Pet Su 330ML eklendi. İçecek dairesi bu ürünlerle yenilendi. Katalog=360, E3=21.

## 28 Eylül — Bardak Su
Bardak Su satırına kullanıcının Sırmakeş bardak görseli 640 beyaz kare webp olarak bağlandı; marka Sırmakeş yazıldı.

## 28 Eylül — Kategori daireleri ve Ülker logosu
Ana/alt kategori daireleri 148px’ten 188px’e (mobil 132px) büyütüldü; karışım görselleri dairede biraz dolduruldu. Popüler markalardaki Ülker diski Halley ürün fotoğrafı yerine ulker.com.tr marka logosuna alındı.

### Yayın tamamlandı
Cloudflare sürümü: 41a9ea4f-c400-42d6-b34e-3e946200a1d9.
Önceki sürüm: 8d87a7eb-786f-49c5-9966-b6656e7d4a03.
npm run check PASS (360).

## 28 Eylül — E4 Atıştırmalıklar üretici paket görselleri
E4’teki 15 ürünün hepsine üretici paket fotoğrafı bağlandı (Ülker Çubuk Kraker ve Halley, ETİ Topkek Kakaolu / Browni Klasik / Lifalif yulaf barları, Fellas meyve-kuruyemiş-granola barları). Atıştırmalık dairesi bu paketlerden yenilendi. Katalog=360, E4=15. Fiyat halka açık kataloga yazılmadı.

### Yayın tamamlandı
Cloudflare sürümü: 9aa1687b-4440-4542-818e-4e96a28b96b7.
Önceki sürüm: 41a9ea4f-c400-42d6-b34e-3e946200a1d9.
npm run check PASS (360).

## 28 Eylül — Gıda ve Atıştırmalıklar ana daire
Ana grup E görseli eski kahve karışımı yerine çay, kahve, su ve atıştırmalıklı klas still-life daireye alındı. Katalog=360.

### Yayın tamamlandı
Cloudflare sürümü: 77416c23-3398-4655-817a-4e429cd840f5.
Önceki sürüm: 9aa1687b-4440-4542-818e-4e96a28b96b7.
npm run check PASS (360).

## 29 Eylül — Ana sayfa carousel gerçek ürün görselleri
Stok/AI carousel slaytları kaldırıldı. Altı slayt, kategorilerdeki gerçek ürün fotoğraflarıyla (Selpak, Cif, Palex, Koroplast, Ülker, Esselte) ve HTML metin/butonlarla kuruldu. Katalog=360.

Geçişte iki slaytın üst üste binmesi: tüm `.home-banner` aynı iki sütunlu grid; `home.css?v=91`.

Ana sayfa “İhtiyacınıza göre keşfedin” dört kartı, carousel’den farklı SKU’larla sıcak mermer still-life olarak yenilendi (MAS/BIC, Bingo/Belinno, Eti/Fellas, Pınar/Cappy).

“Neden FerraPro?” tek 1024px raster yerine HTML kart + 800px köşe fotoğrafları; `home.css?v=93`. Metin sol sütunda, görsel köşede çakışmaz.

F1 Kalem ve Yazı Gereçleri daire görseli gerçek paket karışımı: `/img/products/daire-kalem-yazi.webp` (BIC, Pensan, Faber, Pilot).

### Yayın tamamlandı
Cloudflare sürümü: c3435866-17f5-4655-9553-de31c2b27c49.
Önceki sürüm: 3077ff96-a3da-4c79-9881-0b74381e18b1.
npm run check PASS (360). Canlıda 6 slayt durağan halde tek metin + gerçek paket görselleri; Ferranoi paneline dokunulmadı.

## 29 Eylül — F2 Masaüstü Gereçleri (Derya B4B)
Derya Dağıtım bayi portalından masaüstü için 15 işletme ürünü alındı (Post-it / Noki yapışkan not, indeks, küp blok, Pritt, UHU, Casio hesap, MAS ataş-lastik-şerit silici-maket bıçağı, Hatas cetvel, Leitz evrak rafı, Doğan diplomat zarf, Mead bloknot). Mevcut zımba/delgeç/bant tekrarlanmadı. Fiyat halka açık kataloga yazılmadı. F2=44, F=106, katalog=375.

### Yayın tamamlandı
Cloudflare sürümü: 709f74b1-9035-4f87-b31c-34d6d857e500.
Önceki sürüm: 8fb5db6a-990f-4d97-b4e8-0913187c5a28.
npm run check PASS (375). Ferranoi paneline dokunulmadı.

## 29 Eylül — F4 Ambalaj Ürünleri
Derya B4B’den koli bandı, koli bant makinesi, kraft kağıt, hava kabarcıklı zarf, karton çanta, metalize poşet, tamirat bandı ve PVC rulo eklendi. F4 daire görseli gerçek paket karışımı: `/img/products/daire-ambalaj.webp`. Fiyat halka açık kataloga yazılmadı. F4=13, F=118, katalog=387.

### Yayın tamamlandı
Cloudflare sürümü: 7cba4a49-7085-4db4-a299-2fc40192cef7
Önceki sürüm: 709f74b1-9035-4f87-b31c-34d6d857e500
npm run check PASS (387). Ferranoi paneline dokunulmadı.

## 29 Eylül — E / F2 / F3 daire görselleri
Gıda ana kartı, Masaüstü Gereçleri ve Dosya ve Arşivleme daireleri gerçek katalog paketlerinden derlendi (`daire-gida-ikram.webp`, `daire-masaustu.webp`, `daire-dosya-arsiv.webp`). Stok still-life kaldırıldı. `site.js?v=118`.

### Yayın tamamlandı
Cloudflare sürümü: bf3c2b0b-d5f0-4298-89c4-69828a85a6ed
Önceki sürüm: 7cba4a49-7085-4db4-a299-2fc40192cef7
npm run check PASS (387). Ferranoi paneline dokunulmadı.

## 29 Eylül — F5 Bilgisayar Sarf Malzemeleri
Derya B4B’den kablolu/kablosuz klavye-mouse setleri, kablolu ve kablosuz mouse, USB-C şarj kablosu ve mouse padler alındı. Yazıcı kartuşu ve duvar şarj aleti Derya stoğunda yok; uydurulmadı. Fiyat halka açık kataloga yazılmadı. F5=10, F=128, katalog=397. Daire: `/img/products/daire-bilgisayar.webp`. `site.js?v=119`.

### Yayın tamamlandı
Cloudflare sürümü: 1a0ce381-5e30-4ba5-bc54-f439c6d90f5f
Önceki sürüm: bf3c2b0b-d5f0-4298-89c4-69828a85a6ed
npm run check PASS (397). Ferranoi paneline dokunulmadı.

## 29 Eylül — F ana daire görseli
Kırtasiye grup kartı (`daire-kirtasiye-ofis.webp`) kalem, klasör, zımba, koli bant makinesi, Post-it ve kablosuz set paketlerinden derlendi. Stok still-life kaldırıldı.

### Yayın tamamlandı
Cloudflare sürümü: 37747dbb-6c8c-4a3b-a7b4-f48705840ef8
Önceki sürüm: 1a0ce381-5e30-4ba5-bc54-f439c6d90f5f
npm run check PASS (397). Ferranoi paneline dokunulmadı.

## 30 Eylül — içerik genişliği hero ile hizalandı
Ana sayfada carousel/keşfet 1200–1120px’de kalıyordu; hero `.wrap` ise neredeyse tam genişlikteydi. Kenar boşluğu `--page-gutter` (clamp 32px–96px) ile ortaklandı. Gövde (home-inner, carousel, katalog) aynı gutter’ı kullanır, 1920px tavanı ultrawide’da fotoğrafları şişirmez. Carousel görseli `object-fit: contain` ve max-height 420px; keşfet kartları kaynak 960px’den küçülür; ürün fotoğrafları 92px contain. 1400px üstünde katalog 4 sütun. `site.css?v=80`, `home.css?v=94`, `inner.css?v=94`.

### Yayın tamamlandı
Cloudflare sürümü: dc86eaf6-775f-434c-b613-6433369bc5e7
Önceki sürüm: 37747dbb-6c8c-4a3b-a7b4-f48705840ef8
npm run check PASS (397). 1920px’te header/hero/carousel/keşfet/katalog 1809px ve 48px gutter; 1440px’te katalog 1353px; yatay taşma yok. Ferranoi paneline dokunulmadı.

## 1 Ekim — Ozopak gerçek paket görselleri
Kullanıcının verdiği üç paket: endüstriyel bulaşık makinesi parlatıcısı (p-030 görsel değişti), sıvı el yıkama maddesi parfümlü (p-023/p-024 görsel ve ad güncellendi), ultra deterjan katkılı çamaşır suyu (katalogda yoktu; 5Kg p-427 ve 20Kg p-428 eklendi). Kıvamlı çamaşır suyu ayrı kaldı. Köpük el sabunu eski 5Kg görselini kullanmaya devam eder. 30Kg uydurulmadı. Katalog=399, B1=25, Ozopak B1=22.

### Yayın tamamlandı
Cloudflare sürümü: b211e79a-9580-4e6b-80fc-49ebec53424f
Önceki sürüm: dc86eaf6-775f-434c-b613-6433369bc5e7
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — yönetim toplu maliyet girişi
Yönetim menüsüne Maliyet sayfası eklendi. Ürün adına tıklayınca maliyet kutusu açılır; altta Kaydet tüm değişen satırları tek seferde tarayıcıya yazar. Halka açık katalog.json’a fiyat gitmez. Ferranoi paneli, PIN ve kimlik doğrulama değiştirilmedi. `yonetim.js?v=3`, `yonetim.css?v=4`.

### Yayın tamamlandı
Cloudflare sürümü: 2b55b7be-f530-420a-be3a-15889f3567bc
Önceki sürüm: b211e79a-9580-4e6b-80fc-49ebec53424f
npm run check PASS (399).

## 3 Ekim — yönetim listesi sitedeki ölçü adıyla
Yönetim ürün satırları artık sitedeki gibi ölçü ekli: `Ozopak Sıvı El Yıkama Maddesi,5Kg Parfümlü`. 5Kg/20Kg ve 100'lü/200'lü ayrımı görünür. `yonetim.js?v=4`.

### Yayın tamamlandı
Cloudflare sürümü: 5782c425-4775-44ac-bc8b-49d74a141707
Önceki sürüm: 2b55b7be-f530-420a-be3a-15889f3567bc
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — carousel grup kolajı
Carousel görselleri ayrı duran paketler yerine örtüşen grup oldu. Gıda/içecek slaydı Coca-Cola, Fanta, Fuse Tea, Red Bull, Cappy, Erikli ve İçim’i daire-içecek gibi iç içe dizer. Banner `?v=2`.

### Yayın tamamlandı
Cloudflare sürümü: 7c176a84-777b-477a-91e4-dfbee37bc652
Önceki sürüm: 5782c425-4775-44ac-bc8b-49d74a141707
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — carousel hazır masaüstü fotoğraf
Kesilip silik kenarlı kolaj kaldırıldı. Pexels/Unsplash’ta katalog markalı grup fotoğrafı yok; carousel slaytları keşfet kartlarındaki gibi tek parça masaüstü still-life oldu (ürünler masada durur, cut-out yok). Banner `?v=3`, `home.css?v=95`.

### Yayın tamamlandı
Cloudflare sürümü: 2f0fc3e2-bcca-441c-9745-2536836c1176
Önceki sürüm: 7c176a84-777b-477a-91e4-dfbee37bc652
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — carousel içecek grubu
İçecek slaydı Coca-Cola, Fanta, Beypazarı soda ve Red Bull’un masada durduğu tek fotoğraf oldu; kesme/kolaj yok. Banner `?v=4`.

### Yayın tamamlandı
Cloudflare sürümü: 504f25a5-f10c-4df6-a875-64cbea144719
Önceki sürüm: 2f0fc3e2-bcca-441c-9745-2536836c1176
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — carousel markalı slaytlar
Kırtasiye, aparat ve operasyon slaytları içecek gibi markalı sıra fotoğrafı oldu. Atıştırmalık ayrı slayt: Eti Browni, Fellas, Ülker Halley, Eti Lifalif. Banner `?v=5`.

### Yayın tamamlandı
Cloudflare sürümü: bab6f083-585a-432f-a4f6-156a165e2375
Önceki sürüm: 504f25a5-f10c-4df6-a875-64cbea144719
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — carousel gerçek paket fotoğrafı
Yapay eşit boylu slaytlar kaldırıldı. Carousel katalogdaki gerçek paket görsellerini kullanır; şişe kutudan, klasör kalemden, mop sabun aparatından büyük durur. Banner `?v=6`.

### Yayın tamamlandı
Cloudflare sürümü: 7188bb43-17a7-448f-965d-6d500d39b9aa
Önceki sürüm: bab6f083-585a-432f-a4f6-156a165e2375
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — soda boyu ve atıştırmalık doluluk
Beypazarı şişesi kutu boyuna yaklaştı. Atıştırmalık slaydı 6 gerçek paket: Ülker Çubuk Kraker, Halley, Eti Topkek, Eti Browni, Fellas. Banner `?v=7`.

### Yayın tamamlandı
Cloudflare sürümü: d5412ccb-ca49-4ee1-b2b1-c1fb325c9a40
Önceki sürüm: 7188bb43-17a7-448f-965d-6d500d39b9aa
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — keşfet dört grup
Ana sayfa “İhtiyacınıza göre keşfedin” kartları: Temizlik Kağıt (`g=A`, yeni cat-kagit), Temizlik Ürünleri (`g=B`, yeni cat-sivi), Gıda (`g=E`, cat-gida kaldı), Kırtasiye ve Ofis (`g=F`, cat-ofis kaldı). İçecek+kırtasiye karışık kartı kalktı.

### Yayın tamamlandı
Cloudflare sürümü: ef425248-ee94-493c-a1bc-2133e4ac2aa3
Önceki sürüm: d5412ccb-ca49-4ee1-b2b1-c1fb325c9a40
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — keşfet gıda/kırtasiye görselleri
Gıda kartına Coca-Cola ve Fanta eklendi (`cat-gida.webp?v=3`). Kırtasiye kartına kırmızı Esselte klasör ve yeşil dosya eklendi (`cat-ofis.webp?v=3`).

### Yayın tamamlandı
Cloudflare sürümü: 64c50c4c-7c2a-4e62-8847-01d0be723e38
Önceki sürüm: ef425248-ee94-493c-a1bc-2133e4ac2aa3
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — gıda ana daire
Gıda ve Atıştırmalıklar dairesi çay (Filiz, Lipton), kahve (Nescafé Gold, Mehmet Efendi), soğuk içecek (Coca-Cola, Fanta) ve atıştırmalık (Halley, Çubuk Kraker) paketleriyle ortada toplandı. Gölge ve kenar kırpma yok. Daire zoom `1.16` → `1.06` (`inner.css?v=95`).

### Yayın tamamlandı
Cloudflare sürümü: c7b6019f-ba07-477b-84c1-54f5411daed5
Önceki sürüm: 64c50c4c-7c2a-4e62-8847-01d0be723e38
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — gıda dairesi kutu boyu
Coca-Cola ve Fanta aynı kutu yüksekliğinde yan yana duruyor; Fanta küçültülmedi.

### Yayın tamamlandı
Cloudflare sürümü: 6aedfc4c-0213-4e0f-a59b-b5d809465ac8
Önceki sürüm: c7b6019f-ba07-477b-84c1-54f5411daed5

## 3 Ekim — içecek dairesi
İçecek Grubu dairesi gerçek paketlerle yenilendi: Beypazarı, Coca-Cola, Fanta, Fuse Tea, Red Bull, Cappy, Erikli, İçim. Kutular aynı boyda, ortada, gölgesiz; 12’li Cappy kolajı yok.

### Yayın tamamlandı
Cloudflare sürümü: e5113da5-7bc1-46c6-9ae4-ba68f63df2c6
Önceki sürüm: 6aedfc4c-0213-4e0f-a59b-b5d809465ac8

## 3 Ekim — sıvı temizlik dairesi
Kullanıcı v2’yi onayladı (Cif, Domestos, Pril, Yumoş Extra, Finish, Bingo). `daire-sivi-temizlik.webp` güncellendi.

### Yayın tamamlandı
Cloudflare sürümü: 7a7598f8-71b4-4234-a2dc-6c29ac060b1a
Önceki sürüm: e5113da5-7bc1-46c6-9ae4-ba68f63df2c6

## 3 Ekim — aparat ve ekipman dairesi
Kullanıcı v3’ü onayladı; ahşap ev tipi aparat çıkarıldı. `daire-aparat-ekipman.webp` güncellendi.

### Yayın tamamlandı
Cloudflare sürümü: 54101526-b764-412c-b95e-f2fc6199a93e
Önceki sürüm: 7a7598f8-71b4-4234-a2dc-6c29ac060b1a
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — kırtasiye ofis dairesi
Kullanıcının seçtiği still-life (Leitz klasör, Noki, Double A, Edding, Pensan, Post-it, zımba, bant) daireye alındı. Zooo yok. `daire-kirtasiye-ofis.webp?v=2`.

### Yayın tamamlandı
Cloudflare sürümü: da6a5d25-0f27-4f46-8508-8a039e56f6c2
Önceki sürüm: 54101526-b764-412c-b95e-f2fc6199a93e
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — aparat dairesi still-life
Kullanıcının seçtiği Palex + Parex still-life `daire-aparat-ekipman.webp?v=3` olarak alındı. Beyaz Palex gövdesi korunması için fon silinmedi; daire kırpma kullanıldı.

### Yayın tamamlandı
Cloudflare sürümü: 477cd97d-841e-432d-baee-b9181320a34d
Önceki sürüm: da6a5d25-0f27-4f46-8508-8a039e56f6c2
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — ana kategoriler kare + gıda still-life
Ana kategori kartları daireden hafif yuvarlatılmış kareye alındı (`border-radius: 18px`). Kullanıcının gıda still-life’ı `daire-gida-ikram.webp?v=2`; aparat ve kırtasiye kare olarak yeniden yazıldı. Marka rayı daire kaldı.

### Yayın tamamlandı
Cloudflare sürümü: 18cb3f80-5ec4-4597-a52e-679fbf239915
Önceki sürüm: 477cd97d-841e-432d-baee-b9181320a34d
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — sıvı temizlik still-life
Kullanıcının seçtiği still-life `daire-sivi-temizlik.webp?v=3` olarak kare alındı.

### Yayın tamamlandı
Cloudflare sürümü: 5290537b-eafe-4335-80b1-90c20e3faa47
Önceki sürüm: 18cb3f80-5ec4-4597-a52e-679fbf239915
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — temizlik kağıt still-life
Kullanıcının seçtiği still-life `daire-temizlik-kagitlari.webp?v=2` olarak kare alındı.

### Yayın tamamlandı
Cloudflare sürümü: 751dda51-377d-440a-ae21-ae3b73cb6c95
Önceki sürüm: 5290537b-eafe-4335-80b1-90c20e3faa47
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — çöp poşeti MRP kutuları
D1’de Koroplast korundu. Eski jenerik MRP satırları silindi; kutu fotoğraflarından 12 MRP Marin ürünü eklendi. Konteyner/Hantal yok.

### Yayın tamamlandı
Cloudflare sürümü: 7bb17f12-eed3-4a6a-a488-3d4fda4d8e1f
Önceki sürüm: 751dda51-377d-440a-ae21-ae3b73cb6c95
npm run check PASS (399). Ferranoi paneline dokunulmadı.

## 3 Ekim — Koroplast çöp poşeti yenileme
D1’deki eski Koroplast küçük/orta/battal/jumbo ve lotus satırları silindi. Kullanıcının paket görsellerinden 8 kokulu/büzgülü Koroplast eklendi. Pişirme kağıdı duruyor. Katalog 401.

### Yayın tamamlandı
Cloudflare sürümü: cc76ea60-6b49-443a-92c4-2daa763f2be2
Önceki sürüm: 7bb17f12-eed3-4a6a-a488-3d4fda4d8e1f
npm run check PASS (401). Ferranoi paneline dokunulmadı.

## 3 Ekim — A/B alt kategori still-life
Havlu-peçete, ıslak havlu, tuvalet kağıdı; endüstriyel bidon ve genel sıvı still-life kare olarak alındı.

### Yayın tamamlandı
Cloudflare sürümü: 57b6d069-bfeb-443d-904d-9f28c5a0fb0a
Önceki sürüm: cc76ea60-6b49-443a-92c4-2daa763f2be2
npm run check PASS (401). Ferranoi paneline dokunulmadı.

## 3 Ekim — C alt kategori still-life
Havlu aparat, sabun aparat, çöp kovası ve mop still-life kare olarak alındı.

### Yayın tamamlandı
Cloudflare sürümü: 72dffed7-65fb-4e8f-9352-4d4b3925a8c7
Önceki sürüm: 57b6d069-bfeb-443d-904d-9f28c5a0fb0a
npm run check PASS (401). Ferranoi paneline dokunulmadı.

## 3 Ekim — sarf mop/palet aparatları
D2’ye ıslak mop aparatı (metal, ekstra, plastik), palet aparatı (kulaklı ve düz) ve tel aparatı eklendi. Katalog 407.

### Yayın tamamlandı
Cloudflare sürümü: b3e38ae6-7906-435f-8383-b222b12f6da7
Önceki sürüm: 72dffed7-65fb-4e8f-9352-4d4b3925a8c7
npm run check PASS (407). Ferranoi paneline dokunulmadı.

## 3 Ekim — Belinno Z Peçete 150×12
A1’deki Belinno 200’lü Z katlı havlu ve 300’lü dispenser peçete kaldırıldı. Tek satır: Belinno Z Peçete, 19,7 × 24Cm, 150’li, 12’li koli; koli fotoğrafı kullanıldı. Ev tipi rulo ve hareketli havlu duruyor. Katalog 406.

### Yayın tamamlandı
Cloudflare sürümü: 3d8e1536-a467-416a-8005-21869185a0f9
Önceki sürüm: b3e38ae6-7906-435f-8383-b222b12f6da7
npm run check PASS (406). Ferranoi paneline dokunulmadı.

## 3 Ekim — temizlik kağıt marka logoları
Selpak, Belinno, Polente, Komili, Teno, Rulopak ve Espiga kayan bant logoları kullanıcının verdiği marka dosyalarıyla değiştirildi. Espiga krem zemin beyaza alındı. Papia, Solo ve Freshmaker büyütüldü; A grubundaki tüm logolar aynı dolulukta.

### Yayın tamamlandı
Cloudflare sürümü: d14b0ede-b33e-450b-82e4-876f1d323595
Önceki sürüm: 3d8e1536-a467-416a-8005-21869185a0f9
npm run check PASS (406). Ferranoi paneline dokunulmadı.

## 3 Ekim — A2 ıslak havlu paketleri
Sleepy Easy Clean (el görünen) silindi, Herbal Lavanta 100’lü eklendi. Familia’nın iki eski satırı yeni paket fotoğraflarıyla yenilendi, Lavantanın Ferahlığı eklendi. DeepFresh yüzey temizlik havlusu silindi; Maxi Lavanta 1444’lü ve Zeytinyağlı 120’li eklendi. Katalog 408.

### Yayın tamamlandı
Cloudflare sürümü: 7e989654-f68d-4d6f-895d-ec9577ba2e30
Önceki sürüm: d14b0ede-b33e-450b-82e4-876f1d323595
npm run check PASS (408). Ferranoi paneline dokunulmadı.

## 3 Ekim — B grubu sıvı temizlik logoları
Pril, Fairy, Finish, Asperox, Porçöz ve Ozopak kayan bant logoları kullanıcının verdiği marka dosyalarıyla değiştirildi. Ozopak yeşil şerit kırpıldı. Yumoş, Vernel, Domestos ve Cif büyütüldü; B grubundaki tüm logolar aynı dolulukta (FILL=0.80). site.js v=129.

### Yayın tamamlandı
Cloudflare sürümü: 266c1e7a-c2ee-48c9-afd4-13ea88be0a98
Önceki sürüm: 7e989654-f68d-4d6f-895d-ec9577ba2e30
npm run check PASS (408). Ferranoi paneline dokunulmadı.

## 3 Ekim — Bref ve Palex aparat düzeltmeleri
Bref rezervuar küpleri Power Aktiv Okyanus paketiyle değiştirildi. Palex Z peçete aparatı Masa Üstü Z Peçete Aparatı oldu. Ev tipi metal havlu aparatı ahşap görsel yerine siyah/füme aparat fotoğrafı aldı. Mini içten çekmeli tuvalet kağıdı aparatı krom Palex fotoğrafıyla güncellendi. Katalog 408.

### Yayın tamamlandı
Cloudflare sürümü: ecefb2b4-5c81-4626-a6f0-554e1b502143
Önceki sürüm: 266c1e7a-c2ee-48c9-afd4-13ea88be0a98
npm run check PASS (408). Ferranoi paneline dokunulmadı.

## 3 Ekim — Palex klozet kapak örtüsü aparatı
Yanlış Z peçete görseli kullanıcının verdiği krom Palex aparat fotoğrafıyla değiştirildi.

### Yayın tamamlandı
Cloudflare sürümü: 3a85b9fd-61c0-4ba1-b9d8-a0ff8fbbb7d2
Önceki sürüm: ecefb2b4-5c81-4626-a6f0-554e1b502143

## 3 Ekim — Palex kolon küllük ve bahçe tipi kova
C3’e Palex Kolon Küllük ve Palex Bahçe Tipi Çöp Kovası eklendi. Ürün kodu ve barkod alınmadı. Katalog 410.

### Yayın tamamlandı
Cloudflare sürümü: eafc638c-c368-4d9e-ad10-d7ad9df5b258
Önceki sürüm: 3a85b9fd-61c0-4ba1-b9d8-a0ff8fbbb7d2

## 3 Ekim — ev tipi plastik ve mop aparatları C4
Palex Ev Tipi Havlu Aparatı Metal → Plastik. Islak mop, palet ve tel aparatları D2’den C4 Mop Aparatları’na alındı. Katalog 410.

### Yayın tamamlandı
Cloudflare sürümü: f54e74b9-9c41-4178-9a19-eedf4f109153
Önceki sürüm: eafc638c-c368-4d9e-ad10-d7ad9df5b258

## 3 Ekim — Ceymop nemli mop aparatı
C4’e Ceymop Nemli Mop Aparatı, 50Cm, Plastik eklendi. Katalog 411.

### Yayın tamamlandı
Cloudflare sürümü: da3b99fd-8eb3-4306-a904-c96ad747ce93
Önceki sürüm: f54e74b9-9c41-4178-9a19-eedf4f109153

## 3 Ekim — faraşlı sadeleştirme ve kullan-at
Parex Faraşlı Süpürge tek satır kaldı. Kağıt tabak köpük tabak oldu. Kürdan, plastik tabak ve köpük tabak görselleri yenilendi. Plastik bardak 3000’li koli, köpük bardak 100’lü ve karton kahve bardağı eklendi. Kullan-at zeminleri beyaza alındı; şeffaf çatal görünür kalsın diye bej zeminde bırakıldı. Katalog 411.

### Yayın tamamlandı
Cloudflare sürümü: 7cd96963-0628-46c1-b46d-fbb9242eeae8
Önceki sürüm: da3b99fd-8eb3-4306-a904-c96ad747ce93

## 4 Ekim — Nur-Nil kalkışı ve siyah plastik takım
Nur-Nil markalı satırlar silindi. Plastik çatal, bıçak, kaşık markasız siyah görsellerle duruyor. Plastik Çatal Bıçak Kaşık Seti ve Türk Kahvesi Kağıt Bardağı eklendi. Katalog 412.

### Yayın tamamlandı
Cloudflare sürümü: ac2709d0-becb-43af-b97b-5e7571bdeb18
Önceki sürüm: 7cd96963-0628-46c1-b46d-fbb9242eeae8

## 4 Ekim — kepi, eldiven, bone
Aşçı kepi fotoğrafı yenilendi. Şeffaf eldiven ve bone Dolphin kutu görselleriyle değişti. Katalog 412.

### Yayın tamamlandı
Cloudflare sürümü: 49182b2e-e606-4230-9c91-78571032311c
Önceki sürüm: ac2709d0-becb-43af-b97b-5e7571bdeb18

## 4 Ekim — 7Oz karton bardaklar ve pipet
Kullan-at’a Ekonomik Karton Bardak 7Oz, Karton Bardak 7Oz ve markasız Pipet eklendi. Beyaz yıldızlı bardakta zemin silinmedi. Katalog 415.

### Yayın tamamlandı
Cloudflare sürümü: 69e11d11-fe93-4b64-8a49-523cc87d8cd7
Önceki sürüm: 49182b2e-e606-4230-9c91-78571032311c

## 4 Ekim — Temizlik Sarf ana görsel
Kullanıcının `output/category-collage/temizlik-sarf-ana-gorsel.png` seçimi `daire-temizlik.webp?v=3` olarak kare alındı. Fon silinmedi.

### Yayın tamamlandı
Cloudflare sürümü: b2b7be24-84c7-4e73-b7b4-90c9c6f2f91e
Önceki sürüm: 69e11d11-fe93-4b64-8a49-523cc87d8cd7

## 4 Ekim — D alt kategori görselleri
Çöp Poşetleri, Sarf Malzemeleri ve Kullan At kareleri kullanıcının kategori kolajlarıyla değişti (`?v=2`). Fon silinmedi.

### Yayın tamamlandı
Cloudflare sürümü: 88dbf4fd-c8b9-4361-9c83-2f1b8a6b169d
Önceki sürüm: b2b7be24-84c7-4e73-b7b4-90c9c6f2f91e

## 4 Ekim — D ana beyaz + şeker/su foto
Temizlik Sarf ana kare beyaz zeminli kolajla yenilendi (`?v=4`). Sırmakeş Bardak Su, Balküpü 1Kg/5Kg, Irmak 1Kg küp, Irmak stick ve Irmak Tek Sargılı Küp Şeker 5Kg Dökme fotoğrafları kullanıcının paketleriyle değişti.

### Yayın tamamlandı
Cloudflare sürümü: bf75c098-a510-4bf8-9d49-c084d7fb676d
Önceki sürüm: 88dbf4fd-c8b9-4361-9c83-2f1b8a6b169d

## 4 Ekim — E kahve/içecek/atıştırmalık foto ve yeni satırlar
Nescafe Gold 900Gr ayrı foto (`nescafe-gold-900.webp`); 200Gr aynı kaldı. Irmak Stick Toz Şeker’den 800Gr ibaresi kalktı. Nescafe 2'si 1 Arada ve Eti Lifalif Kırmızı Meyveli Bar güncellendi, kopya açılmadı. Sırma maden/meyveli (Limon Aromalı), Cappy Vişne/Karışık foto değişti. Coca Cola Zero 330ML ve 250ML ile dört Züber 40Gr 12'li bar eklendi. Katalog 421.

### Yayın tamamlandı
Cloudflare sürümü: ad7b0fb3-0e66-4107-a364-a57eb885e09a
Önceki sürüm: bf75c098-a510-4bf8-9d49-c084d7fb676d

## 4 Ekim — İçecek sırası + Lipton / Cola 330
E3 ürünleri türe göre dizildi: cola, Fanta, soğuk çay, meyve suyu, su, soda, enerji, süt. Lipton Ice Tea Şeftali 330ML ve Coca Cola 330ML eklendi. Katalog 423.

### Yayın tamamlandı
Cloudflare sürümü: 6b8e28d4-abe4-4b54-9fe3-1ca5fc0aed5e
Önceki sürüm: ad7b0fb3-0e66-4107-a364-a57eb885e09a

## 4 Ekim — Züber paket foto ve isimler
Kutu kırpımları tek bar fotoğraflarıyla değişti. Satırlar paket adıyla: Kakaolu ve Fındıklı / Antep Fıstıklı ve Kakaolu / Yer Fıstıklı ve Kakaolu Meyve Tatlısı, Protein Bar Kakao Parçacıklı, Hi Protein Bar Fıstık Ezmeli. Vanilyalı ve Portakallı kutu satırları kalktı. Katalog 424.

### Yayın tamamlandı
Cloudflare sürümü: 513d417f-c1dd-499e-bbfb-cb9dfd1b4820
Önceki sürüm: 6b8e28d4-abe4-4b54-9fe3-1ca5fc0aed5e

## 4 Ekim — E marka bandı logoları
Kuru Kahveci Mehmet Efendi, Erikli ve Nestlé daire logoları kullanıcının dosyalarıyla değişti. Üçü 320 kare, FILL=0.80. site.js v=133.

### Yayın tamamlandı
Cloudflare sürümü: 86cc1b32-c0d1-474e-a53a-5f7607f24cca
Önceki sürüm: 513d417f-c1dd-499e-bbfb-cb9dfd1b4820

## 4 Ekim — Gıda alt kategori kareleri
Çay ve Şeker, Kahve, İçecek ve Atıştırmalık kareleri `output/food-collage` kolajlarıyla değişti (`?v=2`). Fon silinmedi. site.js v=134.

### Yayın tamamlandı
Cloudflare sürümü: fd6b2e4f-c674-496d-9699-273e1b52e6a7
Önceki sürüm: 86cc1b32-c0d1-474e-a53a-5f7607f24cca

## 4 Ekim — Bilgisayar F5 ekleri
Logitech mouse/klavye, Everest klavye/mouse, Lexar/Philips/Kingston USB, ttec powerbank eklendi. Duracell ve Varta alkalin AA/AAA/C/D/9V resmi packshot ile açıldı. Katalog 448.

### Yayın tamamlandı
Cloudflare sürümü: 5f40c7cf-5d44-4cd1-8747-264db8d4ed5e
Önceki sürüm: fd6b2e4f-c674-496d-9699-273e1b52e6a7

## 4 Ekim — Kırtasiye alt kareleri (F1 F3 F5)
Kalem ve Yazı, Dosya Arşiv ve Bilgisayar Sarf kareleri `output/office-collage` kolajlarıyla değişti (`?v=2`). Fon silinmedi. site.js v=135.

### Yayın tamamlandı
Cloudflare sürümü: 01711c16-1686-4b56-8395-3fe1d2927542
Önceki sürüm: 5f40c7cf-5d44-4cd1-8747-264db8d4ed5e

## 4 Ekim — Masaüstü ve Ambalaj kareleri
F2 ve F4 kareleri `masaustu-kategori-v2` ve `ambalaj-kategori-v2` kolajlarıyla değişti (`?v=2`). Fon silinmedi. site.js v=136.

### Yayın tamamlandı
Cloudflare sürümü: 4356f13e-d8ec-443b-8aba-2c2c2b7d2e47
Önceki sürüm: 01711c16-1686-4b56-8395-3fe1d2927542










## 21 Eylül 2026 — geniş yerleşim ve hareket (yerel/PR, henüz yayımlanmadı)
- Kullanıcının Cursor kopyası C:/tedarik visual-refresh dalında, GitHub'dan 38 commit ilerideydi. 084a9c9 commit'ine kadar yalnız kayıtlı değişiklikler fast-forward ile alındı. Kartvizit, email_forward, wrangler.email ve tmp-keep gibi kayıt dışı çalışmalara dokunulmadı.
- Güncel katalog 459 kayıt; bu görevde katalog verisi ve fotoğraf dosyaları değiştirilmedi. Bilgisayar sarf ürünlerinin içerik/görsel düzeltmesi kullanıcının belirttiği kalan iştir.
- 1120px ortak sınır kaldırıldı; ekranla büyüyen yatay boşluklar ve geniş katalog. 1440px ekranda 1353px katalog, dört sütun; 390px ekranda tek sütun. Ana sayfa da genişletildi.
- Tüm ürün kartlarının görsel alanı #e4e7eb gri, 14px kenar boşluğu. Fotoğraf içine gömülü krem/beyaz fonlar aynen duruyor; tüm raster fonlar değiştirildi iddiası yapılmamalı. Ürün renklerini değiştiren filtre/blend uygulanmadı. Kullanıcıya fotoğraf içi fonlar için ayrı görsel düzenleme tercihi soruldu.
- Menü alt çizgi geçişi, mobil menü giriş animasyonu, basma geri bildirimi, katalog giriş ve kart yükselme geçişleri eklendi. Reduced-motion kuralları korundu.
- npm run check başarılı. 1440/390px katalog ve ana sayfa kontrollerinde yatay taşma yok; katalogda kırık yüklenmiş görsel yok. Mobil menü aria-expanded=true ve menu-reveal animasyonu doğrulandı. Gerçek form gönderilmedi. Worker/panel farkı yok.
- CSS sürümü76. Yayın yapılmadı. Önizleme http://127.0.0.1:8793/ . Cursor kendi kopyasında önce fetch, sonra temiz/kayıtlı durumla fast-forward almalı; kullanıcı değişikliklerini reset etmeyin.

### 21 Eylül — geniş tasarım canlı yayını
Kullanıcının "canlıda kontrol edelim" talimatıyla 09abd25 yayımlandı.
Cloudflare sürümü: 3fdec409-1638-4ec3-811a-d156b0289949.
Yayın öncesi npm run check başarılı (459 kayıt). Canlı kırtasiye/kalem sayfasında CSS v76, 14 kart, 1440px ekranda 1353px içerik ve dört sütun; 390px ekranda tek sütun doğrulandı. Her iki genişlikte yatay taşma yok, yüklenmiş görsellerde kırık yok. Fotoğrafların içine gömülü fonlar değiştirilmedi; gri kart alanı yayımlandı. Önceki bölümün henüz yayımlanmadı notu tarihseldir.

## 21 Eylül — bilgisayar kategorisi sadeleştirme
Kullanıcının kaldırma alternatifine göre Ekran ve Çalışma Alanı grubu ve PC/bakim altındaki beş kayıt kaldırıldı (bez, sprey, dizüstü standı, monitör yükseltici, kablo düzenleyici). Monitör ürünü uydurulmadı. Genişletme betiği grubu yeniden eklemeyecek şekilde güncellendi. PC sayısı48, toplam454; minimum kapsam testi buna göre güncellendi. Eski bakim URL'si mevcut kategori görünümüne geri düşer.

## 21 Eylül — mouse isim/görsel eşleştirmesi
Genel Mouse · Adet tekrarı kaldırıldı. Kablolu Mouse ve düz Mouse Pad mevcut uygun görsellerini korur. Kablosuz Mouse, Ergonomik Mouse ve Bilek Destekli Mouse Pad için ayrı markasız temsili görseller tamamlandı (built-in image_gen). Mouse grubu beş seçenek; PC47, toplam453. Her türün farklı görsele bağlı olduğunu doğrulayan katalog kontrolü eklendi.
Önceki bilgisayar grubu kaldırma yayını: kaynak8ee1249, Cloudflare1c45190c-15b6-4e9c-8fc6-e58c4794b7b6.
Mouse güncellemesi canlıya alındı: kaynak1b8e8a4; Cloudflare ed67e0e4-1747-45d2-8b4b-d3ad35da1131. npm run check başarılı (453 kayıt). Üç yeni WebP public/img/products içinde.
Görsel istem seti: square photorealistic product catalogue photo; seamless light cool gray #e4e7eb background; soft contact shadow; centered entire product; no logo/text/props. wirelessmouse: black wireless office mouse with small USB receiver, no cable. verticalmouse: upright handshake-grip black ergonomic mouse with side thumb buttons. wristmousepad: dark navy pad with clearly raised gel wrist support, no mouse. Built-in image_gen kullanıldı; özgün SKU iddiası yok.

## Klavye grubu tamamlandı
Genel Klavye · Adet tekrarı kaldırıldı. Kablolu Klavye, Kablosuz Klavye, Klavye Mouse Seti ve Numerik Tuş Takımı olarak dört kayıt bırakıldı; her biri ayrı, açık gri fonlu markasız temsili görsele bağlandı. Kaynak istemler docs/keyboard-image-prompts.json içinde. Eşleştirme ve genişletme betikleri güncellendi. npm run check başarılı; PC46, toplam452 kayıt. Önceki mouse yayın notu fa23cd4 de bu gönderime dahil.
Klavye sürümü canlı: cf1ef5e, Cloudflare9be65c92-587f-46f5-8f5d-7c9d95992b43. Canlı tarayıcıda dört doğru isim, dört ayrı ve yüklenmiş görsel doğrulandı.


## 4 Ekim 2026 — Ana sayfa ürün keşfi ve görüşme yenilemesi

- Açılışta gerçek katalog ürünlerini referans alan beyaz zeminli kolaj ve yeni tedarik metni kullanıldı.
- Tekrarlanan slider / ürün grubu listeleri, A–F gruplarını kapsayan altı görselli kategori kartında birleştirildi. Eski #kesfet, #urun-gruplari ve #teklif-al çapaları korundu.
- Ana sayfadaki üst teklif bandı kaldırıldı. Teklif / Görüşme Talebi düğmeleri doğrudan /siparis adresine gider. Firma ve telefonun yeterli; ürün ve miktarın isteğe bağlı olduğu açıklandı.
- Sektör kartlarına ihtiyaç örnekleri eklendi. Mobilde talep düğmesi öne çıkarıldı, logo çakışması düzeltildi.
- Değişiklikler index.html, yeni home-refresh.css / .js ve ana sayfa görselleriyle sınırlı. Mevcut Neden FerraPro kartları korundu. Panel, giriş, özel kaynaklar ve katalog verisi bu çalışmada değiştirilmedi.
- Doğrulama: npm run check PASS (448 ürün; teklif akışı; yönetim kontrolü). Sandbox alt süreç kısıtı nedeniyle kontrol izinli ortamda tekrarlandı ve geçti. Yeni JS sözdizimi kontrolü ve diff kontrolü geçti. 1440px masaüstü, 390px ve 320px mobil düzen / yatay taşma, menü, kategori çapası ve talep formuna geçiş tarayıcıda kontrol edildi. Gerçek talep gönderilmedi.
- Git: ortak dal adı codex/visual-refresh olarak eşleştirildi; mevcut PR #1 üzerinden paylaşılır. Önceden var olan diğer dosya değişiklikleri korunur ve bu commit'e dahil edilmez.
- Yayın: bu ana sayfa sürümü CANLIYA ALINMADI. Kullanıcının bu sürüme yönelik yayın talimatı beklenir. Yerel önizleme: http://127.0.0.1:8789/.


## 4 Ekim 2026 — Hizmet carousel'i ve katalog dışı tedarik

- Kullanıcının onayıyla ana sayfaya üç ayrı hizmet sahnesi eklendi: ürün fotoğrafıyla araştırma, ihtiyaç listesini paylaşma, uygun ürünü birlikte seçme. Gerçek halka açık katalog ürünlerini referans alan temsili kompozisyonlar built-in image_gen ile üretildi; telefon/tablet ekranları gerçek uygulama veya müşteri kaydı değildir.
- WebP dosyaları public/img/home/story-research.webp, story-list.webp, story-guidance.webp (toplam yaklaşık 310 KB). PNG asılları ve ZIP indirmesi output/home-stories içinde yerelde tutulur. Metin ve düğmeler HTML'dir; görsele gömülmez.
- Carousel ilk açılışta sabit durur; seçim düğmeleri, önceki/sonraki, klavye okları/Home/End ve isteğe bağlı 8 saniyelik oynatma/duraklatma vardır. Otomatik geçiş hover, görünmeyen sekme/alan sırasında durur; elle seçim ve CTA odağı oynatmayı kapatır. Hareket azaltma tercihinde görsel animasyonu kaldırılır. JS yokken üç mesaj da okunabilir.
- Kategorilerin altında sabit koyu alan: Aradığınız ürünü bulamadınız mı? Katalogda olmayan ürünler için araştırma ve tedarik desteği açıklandı; WhatsApp fotoğraf paylaşımı ve /siparis üzerinden Beni Arayın bağlantıları eklendi. Stok veya bulunabilirlik garantisi verilmez.
- WhatsApp bağlantıları doğru iş telefonu ve mesaj taslağıyla açılır; dosyayı ziyaretçi WhatsApp'ta ekler. Sitede dosya yükleme veya otomatik mesaj gönderimi eklenmedi.
- Doğrulama: npm run check PASS (448 ürün, teklif akışı, yönetim kontrolü); home-refresh.js sözdizimi ve diff kontrolleri geçti. Masaüstü 1440px ve mobil 390/320px yatay taşma yok. Üç görsel yüklendi, tarayıcı hata kaydı yok. Seçim, klavye sağ oku/End, son slayttan ilkine dönüş, otomatik geçiş/duraklatma, gizli slayt bağlantılarının görünmezliği ve /siparis geçişi doğrulandı. Gerçek form veya WhatsApp mesajı gönderilmedi.
- Paylaşım: codex/visual-refresh, mevcut GitHub PR #1. Diğer önceden var olan değişiklikler bu commit kapsamına alınmaz.
- Yayın: CANLIYA ALINMADI. Önceki ana sayfa yenilemesiyle birlikte yerel önizlemede; sürüme yönelik yayın talimatı beklenir.


## 4 Ekim 2026 — Ana sayfa ve hizmet görselleri CANLIDA

- Kullanıcının açık canlı yayın talimatıyla önceki iki ana sayfa çalışması ve üst şerit metni yayımlandı. Masaüstü: İşletmenizin ihtiyaçları için tek iletişim noktası. Mobil: İşletmeniz için tek iletişim noktası. Ana sayfa site.js sürümü 137.
- Aktif Cloudflare sürümü: c989a3ae-7e9e-4147-a850-5d035d8e278e (%100 trafik). Önceki/geri dönüş sürümü: 4356f13e-d8ec-443b-8aba-2c2c2b7d2e47.
- Yayın versions upload --keep-vars ardından versions deploy ile yapıldı. Yeni yüklenen dosyalar yalnızca index.html, site.js, home-refresh.css/js, refresh-hero.webp ve üç story görseli. Diğer varlıklar zaten yüklüydü; mevcut katalog/görsel güncellemeleri korunur.
- Panel/index.html, app.js ve app.css canlı kaynakla normalize edilmiş SHA-256 eşitliği doğrulandı. src ve wrangler.toml yayımlanmış 5a58b82 tabanından değişmedi. Otomatik yayın incelemesinin ilk panel yan etkisi itirazı bu kanıtlarla giderildi; ikinci incelemede yayın başarıyla gerçekleşti. Panel, giriş, secret veya müşteri verisi değiştirilmedi.
- npm run check PASS (448 katalog kaydı, teklif akışı ve yönetim). Canlı ferrapro.com tarayıcı kontrolünde üst şerit, altı kategori, üç hizmet slaydı, katalog dışı tedarik alanı mevcut; ikinci slayta klavyeyle geçiş çalışıyor. 390px mobilde yatay taşma ve tarayıcı hata kaydı yok. Gerçek form/mesaj gönderilmedi.
- Git: yalnızca üst şerit metin değişiklikleri, ana sayfa sürüm referansı ve bu devir notu mevcut codex/visual-refresh / PR #1'e eklenir; önceki diğer yerel değişiklikler korunur.


## 4 Ekim 2026 — Site inceleme raporu

- docs/AUDIT-2026-10-04.md: 24 önceliklendirilmiş bulgu/öneri; canlı gözlemler, kaynak riskleri ve öneriler ayrıldı.
- 17 URL, 448 ürün, 21 dolu alt grup ve 430 benzersiz ürün görseli URL’si tarandı; görsel URL’leri HTTP 200.
- npm run check PASS; kısıtlı ortamda alt süreç hatası sonrası izinli tekrar başarılı. Masaüstü ve 390px mobil ürün/arama/sektör kontrolleri yapıldı.
- Gerçek talep/mesaj gönderilmedi; müşteri kaydı okunmadı. Site/panel kodu değiştirilmedi; yayın yapılmadı.
- Etkileşimli rapor yerel Codex canvases klasöründe; ham kanıtlar output/site-audit altında.


## 4 Ekim 2026 — İnceleme düzeltmeleri (yerel / PR)

- Ürün ve sonuçsuz arama bağlamı forma taşınır; Türkçe arama, marka filtresi, sıralama, katalog dışı tedarik CTA’ları, mobil ürün detayı ve erişilebilir görsel dialogu düzeltildi. Sektör bağlantıları ve metinleri gerçek kapsama uyarlandı.
- Yeni talepler ayrı UUID KV anahtarlarına yazılır; ortak panel state kaydı değişmez, 200 kayıt kırpması yoktur. Yetkili GET /api/state eski/yeni talepleri birleştirir. Panel UI, giriş ve yetki kodu değiştirilmedi. KV görünürlük gecikmesi ve yüksek hacimde sayfalama ihtiyacı devam eder.
- Ürün/kategori metaverisi, başlangıç HTML içeriği, sitemap, BreadcrumbList/Organization ve gerçek 404 eklendi. Katalog değişince npm run build:public çalıştırılmalı.
- Kullanıcının vergi levhasından unvan/adres; mesajından info@ferrapro.com alındı. Ana sayfa/kurumsal sayfalarda Ümraniye adresi kullanılır. PDF, vergi numarası ve doğrulama kodu commit edilmez. KVKK metni hazırlandı; saklama politikası ve yurt dışı aktarım düzeninin hukuki/operasyonel doğrulaması açık iş. Diğer açık işler docs/AUDIT-FIXES-2026-10-04.md içinde.
- npm run check hem 448 ürünlü çalışma kopyasında hem yalnız commit kapsamını içeren 354 ürünlü Git kopyasında PASS. 205 eşzamanlı + 1 önceki talebin korunması, eski kayıt birleşimi, sayfalı KV okuma, bozuk istekler, SEO ve 404 testleri geçti. Tarayıcıda 320/390/768/1440px taşma kontrolü, ürün/arama → form, filtre, mobil menü ve dialog odağı doğrulandı; gerçek talep/mesaj gönderilmedi.
- Önceden var olan katalog/görsel, panel, yönetim ve test genişletmeleri korundu, bu commit’e alınmadı. Git kataloğu 354; yerel/canlı 448. Üretilen metaveri her tabanla ayrı eşleştirildi; canlıya eski Git kataloğu yayımlanmamalı. Yerel sitemap 481, Git sitemap 386 URL.
- Yayın yapılmadı. Mevcut codex/visual-refresh dalı / PR #1 üzerinden paylaşılır. Bu sürüm için canlı yayın talimatı gerekir.


## 5 Ekim 2026 — İnceleme düzeltmeleri CANLIDA

- Kullanıcının canlıya al talimatıyla 3df6473 düzeltmeleri, güncel yerel 448 ürünlü katalog korunarak yayımlandı. Aktif Cloudflare sürümü f5818466-36a7-49c3-8abd-a4af85a43ad7 (%100). Önceki sürüm c989a3ae-7e9e-4147-a850-5d035d8e278e.
- Yayın öncesi npm run check PASS. Panel/index.html, app.js, app.css ve katalog canlıyla eşit doğrulandı. 20 değişen statik varlık yüklendi; panel/giriş dosyaları ve mevcut katalog değiştirilmedi. Worker yalnızca belgelenen talep saklama/okuma ve public sayfa düzeltmelerini içerir.
- Canlı HTTP: ürün metaverisi/canonical 200, olmayan sayfa 404, katalog 448 ürün, sitemap 481 URL doğrulandı. 390px tarayıcıda ürün bilgisi forma taşındı; yatay taşma yok. Gerçek talep/mesaj gönderilmedi. KVKK süreç doğrulaması ve diğer açık işler AUDIT-FIXES belgesinde devam eder.


## 5 Ekim 2026 — Kalan yedi başlık (yerel / PR, canlı değil)

- 448 ürünlü katalog, mevcut görseller ve sıfır finansal yer tutuculu yönetim başlangıç kataloğu Git ile eşitlendi. Panel ve devam eden yönetim UI değişiklikleri korunup kapsam dışında bırakıldı.
- 448 ürüne mevcut halka açık bilgilerden açıklama; iki ürüne üretici kaynaklı ek bilgi eklendi. Tüm eksik teknik özellikler doğrulanmış değildir; kaynak/eksik listesi docs/product-content-sources.json içinde.
- Yeni talep e-posta bildirimi iki kullanıcı onaylı alıcıya ayrı gönderilir; görünen gönderen info@ferrapro.com. Alıcılar secret olarak hazırlanmıştır, repoya konulmaz. Başarısız e-posta başarılı talebi bozmaz. Gerçek mail teslimi ve canlı uçtan uca gönderim henüz test edilmedi.
- Cloudflare hız sınırı (talep 20/dakika, ölçüm 120/dakika), 12 KB akış gövde sınırı, yalnız sabit olay/sayfa türü toplayan çerezsiz Analytics Engine ölçümü eklendi. Ölçüm tekil ziyaretçi veya mesaj teslimi ölçmez.
- Kullanıcı üç referansın güncel/izinli olduğunu doğruladı; ana sayfa logolu alanı ve footer bağlantısı eklendi.
- KVKK saklama/imha/aktarım envanteri ve tek kayıt için varsayılan dry-run imha aracı hazır. Kullanıcı süre seçeneklerini istedi; 6/12/24 ay kararı bekleniyor. Aktarım hukuki mekanizması ayrıca teyit edilmeli. Hiçbir gerçek kayıt silinmedi.
- npm run check temiz PR dosya kopyasında PASS (448 ürün; yeni hizmet ve veri gizliliği kontrolleri dahil). Wrangler dry-run derlemesi PASS. Windows CRLF kontrol farkı giderildi. Masaüstü 1440px ve mobil 390px referans/logolar ve taşma kontrolü; mobil ürün → form bağlamı ve yalnız firma/telefon zorunluluğu doğrulandı.
- Kapsam/kurulum ayrıntıları docs/SEVEN-ITEMS-2026-10-05.md; saklama kararları docs/PRIVACY-OPERATIONS.md. Önizleme http://127.0.0.1:8789/. Yayın yapılmadı; aktif sürüm f5818466-36a7-49c3-8abd-a4af85a43ad7.


## 5 Ekim 2026 — Yedi başlık paketi CANLIDA (ölçüm hariç)

- Kullanıcı bu sürüme açık yayın onayı verdi. Kaynak 8375dca ve analitik kapalı durumunu doğru gösteren KVKK düzeltmesi yayımlandı. Aktif Cloudflare sürümü c30178d5-93eb-4ee3-93ca-0b3f0d54c6a7 (%100). Önceki test edilmiş e-posta sürümü 464394fb-d67b-4f6c-a9f2-0776d9ffe59d; paket öncesi geri dönüş f5818466-36a7-49c3-8abd-a4af85a43ad7.
- İlk upload Analytics Engine hesapta etkin olmadığı için 10089 hatasıyla durdu; canlı etkilenmedi. Kullanıcıdan Cloudflare hesabında etkinleştirme istendi. Diğer işler METRICS binding olmadan yayımlandı; ölçüm şu anda veri toplamıyor. KVKK sayfası gerçek binding durumuna göre bunu açıkça belirtir. Ana wrangler.toml ölçüm hazır tanımı korur. Geçici yayın ayarını yeniden üretmek için node tools/build_release_config.mjs --without-analytics; yayın komutuna --config output/seven-items/wrangler-release.toml verilir. Etkinleştirme tamamlanınca normal wrangler.toml ile sürüm yüklenip devreye alınmalı.
- QUOTE_NOTIFY_TO secret olarak eklendi; var olan parola/SESSION_SECRET bağlamaları korundu. İki alıcı ve info@ferrapro.com göndereniyle canlı form testi yapıldı. FERRAPRO SİSTEM TESTİ 0510-YAYIN kaydı (gerçek müşteri değil, sahte telefon) KV'ye yazıldı; form başarı gösterdi. Cloudflare gönderim sonucu sent:2/total:2. Posta kutusuna ulaşma kullanıcı teyidi beklenir; servis kabulü gelen kutusu teslimi sayılmaz. Test kaydı panelde açıkça sistem testi olarak kalır, kimse aranmamalı. Yetkili panel ekranına giriş yapılmadı; panel okuma birleşimi izole testlerde geçti.
- Yayın öncesi/son düzeltme sonrası npm run check PASS (448 ürün). Panel/index.html, app.js, app.css canlıyla normalize SHA256 eşitliği doğrulandı. İlk sürümde 15 statik dosya, son düzeltmede yalnız KVKK varlığı değişti; panel UI değişmedi. Canlı 448 açıklama, referanslar, ürün 200, gerçek 404 ve özel yönetim/panel API 401 doğrulandı. 390px mobilde yatay taşma yok; üç referans logosu yüklü.
- Saklama süresi seçimi, şirketin yurt dışı aktarım mekanizması ve ürüne uygulanabilir eksik teknik bilgilerin üretici/tedarikçi doğrulaması açık kalır. Gerçek müşteri kaydı okunmadı/değiştirilmedi/silinmedi.


## 5 Ekim 2026 — Görüşme talebi takibi (PR, canlı değil)

- Yetkili ortak panelinde Yeni → Görüşüldü → Teklif verildi → Sonuçlandı aşamaları, firma/telefon araması, aşama filtresi, görüşme notları ve sonraki takip tarihi eklendi. Filtre değiştirirken not taslağı korunur. Tarih yalnız panelde gösterilir; otomatik hatırlatma gönderilmez.
- Her değişiklik ayrı KV olayına yazılır; eşzamanlı notlar birbirini ezmez. Asıl müşteri talebi ve ortak panel state kaydı değiştirilmez. Geçmişte yetkili ve zaman görünür. KV görünürlük gecikmesi mümkündür; yüksek hacimde geçmiş sayfalaması gerekir.
- Yalnız ortak rolü yazabilir; mevcut giriş/parola düzeni değişmedi. Bildirim e-postasındaki bağlantı doğrudan talep ekranını açar. Yeni UUID taleplerinin imha aracı takip geçmişini de kapsar; hiçbir gerçek kayıt silinmedi.
- npm run check PASS: yetki, kaynak, tarih/not doğrulaması, eşzamanlı geçmiş, eski sayısal kimlikler ve kapanışta tarihin temizlenmesi. Masaüstü 1440px / mobil 390px örnek kayıtlarla kaydetme, geçmiş, filtre ve taslak koruma doğrulandı; yatay taşma ve tarayıcı hatası yok. Kanıtlar yerel output/quote-tracking altında. Gerçek müşteri verisi kullanılmadı.
- Paylaşım codex/visual-refresh / PR #1. Bu sürüm canlıya alınmadı; ilgili sürüm için yayın talimatı beklenir. Aktif sürüm c30178d5-93eb-4ee3-93ca-0b3f0d54c6a7; Analytics Engine etkinleştirme, posta kutusu teslim teyidi ve saklama süresi kararı hâlâ bekleniyor.


## 5 Ekim 2026 — Talep yönetimi Ferrapro alanına taşındı (yayın bekliyor)

- Kullanıcı talep takibini Ferranoi yerine Ferrapro yönetiminde istedi. /yonetim/talepler sayfası, yönetim menüsünde bağlantı, yalnız talep verisi döndüren korumalı GET ve takip güncelleyen POST uçları eklendi. Yeni bildirim bağlantısı https://ferrapro.com/yonetim/talepler oldu. Eski e-postalar değişmez.
- Önceki yayımlanmamış Ferranoi takip entegrasyonu kaldırıldı; eski panel listesi ve giriş kodu korunur. Mevcut KV talepleri ve takip geçmişi aynı kaynaklardan okunur, kayıt taşıma/kopyalama yapılmaz.
- Özel YONETIM_PASSWORD canlıda tanımlı değil (yalnız secret adları kontrol edildi). Yeni talep API'leri eski sabit PIN ile açılmaz; özel parola ve SESSION_SECRET gerektirir. Kullanıcıya mevcut Ayfer/Ramazan hesaplarını Ferrapro'da kullanma veya ayrı yönetim parolası seçeneği soruldu; cevap bekleniyor. Kimlik doğrulama seçimi ve yayın tamamlanmadı.
- npm run check PASS; girişsiz erişim, kaynak kontrolü, özel veri ayrımı, eşzamanlı notlar, eski kimlikler, tarih doğrulama ve fallback PIN engeli test edildi. 1440/390px örnek kayıtlarla kaydetme/tarih/aşama kontrolü geçti, mobil taşma ve konsol hatası yok. Görseller output/ferrapro-talepler altında. Gerçek müşteri kaydı kullanılmadı; e-posta gönderilmedi.
- Kullanıcı önceki sistem testinin Ayfer'e 15.43'te ulaştığını doğruladı. Ramazan teslim teyidi hâlâ yok. Aktif canlı sürüm değişmedi: c30178d5-93eb-4ee3-93ca-0b3f0d54c6a7.

## 6 Ekim 2026 — Canlı görsel denetimi (düzeltme/yayın yapılmadı)

- docs/VISUAL-AUDIT-2026-10-06.md: üç krem alt kategori (D1/D2/D3), kumaş zeminli Islak Havlular ve ürün fotoğraflarındaki kesim/fon/ölçek sorunları dahil 20 öncelikli görsel. Krem fon dosyaların içine işlenmiş; inner.css kapsayıcı rengi de #ddd6cc. Yalnız CSS değişikliği yeterli değil.
- Canlı 448 ürünün 430 benzersiz görseli ve 27 kategori kolajı: 457 URL HTTP 200 ve yerel SHA-256 eşit. 11 karşılaştırma sayfası tarandı, şüpheli örnekler büyütüldü; 10 ana sayfa görseli ayrıca incelendi. Kanıtlar output/visual-audit altında (yerel, Git dışında).
- npm run check PASS. 14 genel/kategori sayfası 200, olmayan sayfa 404; 1440px masaüstü ve 390px mobil kategori → ürün → görüşme formu doğrulandı. Ürün bağlamı korundu, yalnız firma/telefon zorunlu, kontrol edilen akışta taşma/konsol hatası yok. Form gönderilmedi, e-posta veya gerçek müşteri işlemi yapılmadı.
- Bu tur yalnız denetim ve raporlamadır. Canlı sürüm değişmedi; yeni yönetim sürümü, kimlik doğrulama kararı ve Analytics Engine etkinleştirmesi bekliyor. Önceden var olan çalışma ağacı değişiklikleri korunmuştur.

## 6 Ekim 2026 — Yönetim fiyatları sunucu kaydı (yayın bekliyor)

- Sorun: yönetim persist() yalnız localStorage kullanıyordu. Yeni /yonetim/api/fiyatlar mevcut yönetim oturumuyla korunan GET/PUT; PRICE_STORE SQLite Durable Object tek ortak kayıt sağlar. Sürüm denetimi eski oturumun yeni fiyatları ezmesini 409 ile engeller; önceki snapshot saklanır. Fiyatlar halka açık kataloğa veya Ferranoi state kaydına eklenmez. Mevcut giriş/parolalar değiştirilmedi.
- Sunucu boşsa ilk fiyat içeren tarayıcının kayıtları otomatik aktarılır; legacy-backup yerelde korunur. Kurulu sunucu kaydı eski tarayıcıyla otomatik ezilmez; eski/gönderilemeyen kayıtların indirme düğmesi var. Diğer tarayıcılardaki eski farklı fiyatlar otomatik birleştirilmez. Save/import/delete sunucu onayını bekler; başarısızlıkta başarı mesajı yok, fiyat taslakları ve mümkünse pending yedeği korunur.
- Yerel yönetim dosyalarındaki önceden mevcut toplu maliyet düzenleme/save-bar değişiklikleri korunarak entegrasyon tamamlandı. Mobil üst araç çubuğu taşması giderildi. Diğer mevcut app/panel/rule değişiklikleri kapsam dışıdır.
- npm run check PASS (yeni sunucu ve istemci fiyat testleri dahil). Eşzamanlı kayıt 200/409, yetkisiz 401, CSRF 403, null temizleme, yazma hatası 503, ilk aktarım ve eski yerelin sunucuyu ezmemesi test edildi. Wrangler 4.131.2 deploy --dry-run PASS; yayın yapılmadı.
- Yalıtılmış localhost yönetim ekranında 1440px/390px fiyat kaydetme, yenileme ve yerel fiyat önbelleği temizlendikten sonra sunucudan geri okuma doğrulandı; mobil genişlik 390/390, konsol hatası yok. Örnek 123.45/150 yalnız test belleğinde; canlı fiyatlar okunmadı/değiştirilmedi. Kanıt output/price-fix/desktop.png ve mobile.png.
- Yayın yeni PRICE_STORE binding + v1-price-store migration gerektirir. Canlı sürüm değişmedi. İlgili sürüm için yayın talimatı beklenir; mevcut dalda önceki yayımlanmamış talep yönetimi de bulunduğundan yalnız fiyat düzeltmesini içeren yayın paketi hazırlanmalıdır. Analytics binding etkinleştirilmediyse yayın configinden çıkarılmalıdır.

## 6 Ekim 2026 — Yönetim fiyatları sunucu kaydı CANLIDA

- Kullanıcı yalnız bu fiyat düzeltmesine açık yayın onayı verdi. Dalın tamamı yayımlanmadı; önceki yayımlanmamış talep yönetimi pakete alınmadı. Yayın `output/price-release/site`: 745a96f taban + 693e0bd fiyat kaydı. `PRICE_STORE` / `PriceStore` / `v1-price-store` / `new_sqlite_classes`. Analytics Engine olmadığı için `METRICS` binding yok. Secret'lar `--keep-vars` ile korundu. Panel girişi, parolalar ve müşteri kayıtları değişmedi.
- Aktif Cloudflare sürümü: 4ae85a7e-dc34-47ab-8ae1-b7bee63b5c29 (%100). Önceki sürüm: c30178d5-93eb-4ee3-93ca-0b3f0d54c6a7.
- Canlı Worker kodu, kaynak yorum / source-map adı normalize edilince 745a96f derlemesiyle eşit doğrulandı. `prepare.mjs` yeniden çalıştırılmadı.
- Statik karşılaştırma tamamlandı: 1165 dosya, 4 korumalı `yonetim/` atlandı, 1161 HTTP 200, 1158 içerik eşit. Ham üç fark: `index.html` tedarik.ferranoi.com kökünden `/panel/` yönlendirmesi (ferrapro.com ana sayfa paketle eşit); `panel/index.html` aynı yönlendirme artı canlıdaki `app.js?v=23` / login-wrap; `app.js` canlıdaki null-safe giriş (yerel uncommitted kopyayla aynı). Canlı `app.js` ve panel HTML pakete kopyalanarak geri alınmadı. Uncommitted `public/panel/index.html` yayımlanmadı. `yonetim/catalog.json` CRLF sonrası repo ile eşit; üç yönetim UI dosyası bilinçli fiyat istemcisi.
- Paket `npm run check` PASS (sunucu/istemci fiyat testleri, eşzamanlı 200/409 kazanan varsayımı düzeltilmiş). Wrangler 4.131.2 `--dry-run --keep-vars` PASS. 24 varlık yüklendi, 1141 zaten vardı.
- Girişsiz canlı `GET`/`PUT` `https://ferrapro.com/yonetim/api/fiyatlar` ve www 401. Katalog 448, ana sayfa ve `/urunler` 200. Kaynak koddan PIN çıkarılmadı. Yetkili kayıt/okuma, CSRF 403, boş sunucuya ilk aktarım ve eski yerelin ezmemesi izole testlerde geçti. Canlı yetkili yazma için Chrome `fp_yonetim` çerezi kilitli Cookies dosyasından okunamadı.
- Chrome Default `ferrapro.yonetim.fiyat.v2`: 448 satır; dolu maliyet yalnız p-001, p-002, p-003 = 12; extras []. Test 123.45 / 150 yok. Yerel kayıt silinmedi. Sunucuya bu tarayıcıdan yazılmadı; erişilemeyen oturum verisi kurtarıldı denmez. Sunucu boş kaldığı için aynı Chrome’da sonraki girişli `/yonetim` açılışı otomatik aktarır. Test fiyatı sunucuya basılmadı.

## 6 Ekim 2026 — Teklif onayı, Ferranoi mail kesimi, FerraPro teklif paneli

- Müşteri teklif gönderince form yerine görünür “Teklifiniz gönderildi” kartı çıkar; ürünlere dönüş bağlantısı vardır. Küçük yeşil `#msg` satırına bel bağlanmaz. Müşteriye otomatik e-posta gitmez.
- İç bildirim maili artık `https://tedarik.ferranoi.com/panel/` değil `https://ferrapro.com/yonetim/talepler` açar. Mailde firma/telefon/not yoktur. Ferranoi paneli, giriş kodu ve parolalar değiştirilmedi; `ferrapro.com/panel` hâlâ tedarik.ferranoi.com paneline gider.
- `/yonetim/talepler` mevcut FerraPro yönetim oturumuyla tüm teklifleri listeler (aşama, not, takip tarihi). Özel `YONETIM_PASSWORD` şartı kaldırıldı; fiyat ekranıyla aynı giriş yeter. Girişsiz API 401.
- npm run check PASS: teklif kaydı, mailde ferranoi yok, yetkisiz 401, mevcut yönetim oturumuyla teklif listesi, fiyat testleri.
- GitHub: codex/visual-refresh / PR #1, commit 76324e6. Canlı Cloudflare sürümü 8d0ea37a-313d-43fc-bc7f-7f34f332059f (%100). Önceki 4ae85a7e-dc34-47ab-8ae1-b7bee63b5c29. METRICS yok, `--keep-vars`, PRICE_STORE korundu. Ferranoi panel HTML geri alınmadı. Girişsiz `/yonetim/api/talepler` 401; `/siparis` başarı kartı metni canlı.

## 6 Ekim 2026 — /yonetim/talepler yönlendirme döngüsü

- Girişten sonra Assets `talepler.html` için 307 dönüp `/yonetim/talepler` ile birbirini kovalıyordu (ERR_TOO_MANY_REDIRECTS). Worker artık varlık 307’sini tarayıcıya vermiyor; `/yonetim/talepler/index.html` üzerinden sayfayı 200 döndürür. Ana sayfa/teklif formu girişsiz 200’dü; döngü oturumlu teklif paneline özgüydü.
- Canlı sürüm 599a5e10-dd30-4d9b-ab33-447601873618 (%100). npm run check PASS. Ana sayfa, sipariş, yönetim girişi 200.


## 8 Ekim 2026 — Dört ürün beyaz fon düzenlemesi (yayınlanmadı)

- Kullanıcının ekran görüntülerindeki belinno-ev-tipi-rulo-6, belinno-hareketli-havlu, sleepy-herbal-lavanta ve tela-kolluk WebP dosyaları düzenlendi. İkinci üründe banyo/tezgâh sahnesi kaldırıldı. Sleepy 100 Adet rozeti korundu.
- Yerleşik imagegen kullanıldı. Talimat: yalnız renkli arka planı düz beyaza çevir; ürünü, ambalajı, marka ve ana etiket bilgilerini koru; yeni nesne/metin ekleme. Hareketli havluda tüm banyo ve tezgâhı kaldır, yalnız altılı paket bırak. Kollukta el, parmaklar, kolluk ve sağdaki siyah kıyafeti koru.
- Üretilen dört çıktı görsel olarak incelendi; PNG kaynakları ve ZIP output/white-products-2026-10-08 altında. Yalnız WebP biçim dönüşümü yapıldı. Görsel üretim çıktıları kaynak fotoğrafların piksel düzeyinde aynı kopyası değildir.
- npm run check PASS. Bu tur tarayıcıda sayfa yerleşim testi yapılmadı; HTML/CSS değiştirilmedi. Canlı yayın yapılmadı. Önceden var olan panel/app/rule değişiklikleri korunmuştur.

## 8 Ekim 2026 — Site güvenlik/görünürlük denetimi ve kategori kodları

- docs/SITE-AUDIT-2026-10-08.md: canlı HTTP/www davranışı, metadata/site haritası, 401/404, kaynak kod yönetim oturumu riskleri, görsel ve SEO aksiyonları; kapsam sınırları açık. Şifre veya müşteri verisi okunmadı/kaydedilmedi; form gönderilmedi.
- public/catalog-ui.js A–F kategori rozetleri kaldırıldı; inner.css kullanılmayan cat-code kuralı kaldırıldı; urunler.html script sürümü 101. İç kimlikler/eski URL'ler değişmedi.
- npm run check PASS. Yerel katalog 1280/390 px: 6 kategori, 0 kod rozeti, yatay taşma yok; mobil menü ve havlu araması (38 sonuç) PASS. Canlı ana sayfa dar ekran ve D grubu masaüstü incelendi.
- Canlı yayın YAPILMADI. Güvenlik bulguları bu sürümde düzeltilmedi; ayrı inceleme ve regresyon gerektirir. Eşzamanlı Cursor yönetim Excel/panel değişiklikleri bu commit kapsamına alınmadı.

## 8 Ekim 2026 — Güvenlik ve katalog keşif iyileştirmesi (yayınlanmadı)

- Ayrıntılı devam noktası: docs/IMPROVEMENT-PROGRESS-2026-10-08.md. HTTPS/www yönlendirmeleri ve kapsamlı güvenlik başlıkları; yönetimde 8 saat rastgele DO oturumları, çıkışta iptal, 10/60 saniye giriş sınırı, 4KB akış gövde sınırı, no-store. Sabit yönetim şifresi yedeği kaldırıldı. Ferranoi /api/login ve panel verileri değişmedi.
- Kritik yayın koşulu: SESSION_SECRET gizli ayarı var; YONETIM_PASSWORD gizli ayar adları arasında yok (normal uzak vars incelenmedi). Güçlü yönetim şifresi güvenli tanımlanmadan YAYINLAMAYIN. Yeni MANAGEMENT_SESSIONS DO v2 migration ve YONETIM_RATE_LIMITER gerekli. Eski oturumlar yeniden giriş ister; fiyat/talep deposu korunur.
- Kategori/alt grup ilk HTML ürün bağlantıları yalnız public katalogdan üretildi; SEO ölçü normalizasyonu, genel katalog boş grup iletişim metni düzeltildi. catalog-ui v102.
- npm run check PASS; yönetim oturumu, HTTPS, limiter/depoda hata testleri dahil. Wrangler deploy --dry-run PASS. Public-only Worker yerel önizleme 1280/390 px PASS; gerçek üretim DO ortam testi henüz yok.
- Canlı yayın YAPILMADI. Sonraki işler: güvenli ayar/yayın hazırlığı, üç krem kategori görseli, kategori içerikleri, Search Console/yerel profil/dönüşüm ölçümü. Cursor'un eşzamanlı panel/Excel dosyaları commit kapsamı dışında tutuldu.

## 8 Ekim 2026 — Üç kategori rehberi ve masaüstü yerleşimi (yayınlanmadı)

- A/D/E ana kategorilerine kısa, ürün seçimine yardımcı açılır rehberler eklendi. Aynı içerik ilk HTML ve JavaScript arayüzünde; arama/ürün detayında gösterilmez. Gerçek katalog kapsamı kullanıldı, stok/teslimat garantisi yok.
- Ana katalog 1000 px üstünde 3+3 düzeni. site.js v140, catalog-ui.js v103, inner.css v98. İç bağlantı/kategori kimlikleri korunur.
- npm run check PASS; rehberin ilk HTML'de olması ve aramada bulunmaması test edildi. 1280 px 3+3 satırlar ve 390 px açık rehber taşmasız. output/kategori-duzeni-son.jpg önizlemesi kaydedildi.
- YAYIN YOK. Önceki c335675 güvenlik sürümünün gizli yönetim ayarı ve DO/rate limiter ön koşulları devam ediyor. Kalanlar docs/IMPROVEMENT-PROGRESS-2026-10-08.md içinde.
