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
