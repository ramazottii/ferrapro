# Ferrapro satış odaklı güncelleme

> Bu dosya önceki çalışmanın tarihsel notudur. Güncel GitHub/yayın durumu ve sonraki katalog çalışması için docs/HANDOFF.md dosyasını okuyun. Aşağıdaki "yayın yapılmadı" ifadeleri bu notun ilk yazıldığı aşamayı anlatır; tasarım daha sonra yayımlandı.

## Yapılanlar

- Ana sayfada işletme türüne göre altı başlangıç yolu.
- /sektorler: ofis, kafe/restoran, klinik, konaklama, eğitim ve tesis yönetimleri için mevcut katalog kategorilerine bağlantılar.
- /iletisim: mevcut telefon, e-posta, Ataşehir/İstanbul ve teklif formu bağlantıları.
- Ana sayfa ve iletişimde altı teklif sorusu. Teslimat, minimum miktar ve stok için kesinleşmemiş vaat yok.
- Menü ve alt bağlantılar, mobil kartlar, yerel önizleme rotaları.
- Sekiz sayfada canonical ve paylaşım etiketleri; robots.txt ve altı URL içeren sitemap.xml. Teklif ve tamamlanmamış KVKK sayfası noindex.
- SELCUK_PASSWORD tanımlı değilken sabit varsayılan parolayla giriş sağlayan geri dönüş kaldırıldı. Yayın öncesinde bu secret'ın yapılandırılmış olduğu doğrulanmalı. Mevcut secret'lar okunmadı veya değiştirilmedi.

## Araştırma

- Avansas: belirgin arama, ürün kategorileri, paket ve ölçü bilgileri. Katalog ayrıntıları korunarak sektör başlangıç yolları eklendi. https://www.avansas.com/
- Ofix: farklı işyeri ihtiyaçlarının bir arada anlatılması. Mevcut katalog kapsamındaki işletme türleri somutlaştırıldı. https://www.ofix.com/hakkimizda
- Google Search Central: anlaşılır içerik, bağlantılar ve sayfaların keşfi. Temel meta etiketleri ve site haritası eklendi. https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Doğrulama

- Ana sayfa, sektörler, iletişim, ürünler ve teklif: 360, 768, 1440 pikselde yatay taşma yok; her sayfada bir H1; yüklenmiş görsellerde kırık görsel saptanmadı.
- Masaüstü sektör görünümü ve mobil soru-cevap görünümü görsel olarak incelendi.
- Mobil menü → sektörler → kafe/restoran → mutfak kategorisi tarayıcıda çalıştı. Soru-cevap açılması çalıştı.
- Sekiz HTML sayfasındaki yerel bağlantı/dosya hedefleri, tek canonical etiketi ve XML sözdizimi doğrulandı.
- node --check public/site.js ve git diff --check geçti.
- node tools/check_quote_flow.mjs geçti: gerçek Worker işleyicisi, bellekte KV adaptörü, sentetik bilgiler. Geçersiz talep reddi, talep kaydı, oturumlu panel API okuması, özel rotaların halka kapalı olması ve parola yapılandırması doğrulandı.
- Bu test Cloudflare çalışma ortamı, gerçek KV veya panel arayüzündeki uçtan uca akışın yerine geçmez. Üretime test talebi gönderilmedi.

## Yayından önce kalanlar

1. Şirket/veri sorumlusu bilgileriyle KVKK metninin tamamlanması.
2. info@ferrapro.com posta kutusunun çalışmasının ve gerçek ticari koşulların doğrulanması.
3. Cloudflare yerel/staging ortamında form → kalıcı kayıt → panel ekranı testinin tamamlanması.
4. Son görsel inceleme ve yayın onayı. Commit, push veya deploy yapılmadı.

Önizleme: http://127.0.0.1:8793/
Çalışma kopyası: C:/test/app-inceleme/ferrapro-design
