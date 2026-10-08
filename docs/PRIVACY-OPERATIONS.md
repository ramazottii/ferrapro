# Görüşme talepleri: saklama ve başvuru süreci

5 Ekim 2026 — karar taslağı; henüz otomatik silme açılmadı.

## Şirketin seçeceği süre

Yalnızca satışa dönüşmemiş, kapanmış görüşme talepleri için son anlamlı görüşmeden itibaren:

- **6 ay:** kısa satış döngüsü; daha az kişisel veri tutulur, dönemsel müşteriyi yeniden tanımak zorlaşabilir.
- **12 ay (öneri):** yıllık ihtiyaç döngüsünü kapsayan operasyonel başlangıç önerisi; kanuni zorunlu süre değildir.
- **24 ay:** ancak uzun satış döngüsünün somut gerekçesi varsa değerlendirilir; daha fazla veri tutulur.

Aktif görüşmeler, satışa dönüşen kayıtlar, yasal yükümlülük veya uyuşmazlık nedeniyle saklanması gereken belgeler bu genel sürenin kapsamına otomatik alınmaz. Bunların amaç/hukuki sebep ve süreleri ayrıca belirlenir. Form oluşturulma tarihi son temas tarihi yerine kullanılmaz.

## Uygulama

1. Yetkili sorumlu aylık kapanan talep listesini gözden geçirir; son temas, satış durumu ve saklamayı gerektiren istisnayı özel kayıt çizelgesinde tutar.
2. Süresi dolan ve başka işleme şartı kalmayan kayıtların UUID listesi onaylanır. Kimlik doğrulaması yapılmış ilgili kişi talepleri ayrıca değerlendirilir.
3. Yeni kayıtlar `vitrin-quote:<UUID>`; eski talepler panelin ortak state kaydında olabilir. Yeni kayıt için hazırlanan araç ortak panel state'ini değiştirmez. Eski kayıtlar yetkili kişi tarafından ayrıca ele alınır.
4. E-posta/WhatsApp kopyaları, dışa aktarımlar ve yedekler aynı envanterde kontrol edilir. Yalnız Worker KV'den silmek bütün sistemlerden silinme anlamına gelmez.
5. İmha işlemleri, içerik/telefon kopyalanmadan tarih, onaylayan, kapsam ve sonuçla kayda alınır. İmha kayıtları mevzuattaki asgari üç yıl ve varsa diğer yükümlülükler gözetilerek korunur.
6. KVKK başvuruları info@ferrapro.com üzerinden kayda alınır; kimlik orantılı yöntemle doğrulanır, talep yetkili kişi tarafından değerlendirilir ve yasal süre içinde yanıtlanır. Genel iletişim formunda ayrı bir pazarlama izni alınmaz; bu kayıtlar pazarlama listesine aktarılmaz.

## Altyapı ve aktarım envanteri

- Cloudflare Workers/KV: talep firma/telefon, isteğe bağlı kişi/not/grup, kayıt zamanı ve kimliği. Erişim mevcut yetkili panel hesabıyla.
- Talep takibi: aşama, görüşme notu, sonraki takip tarihi, işlemi yapan yetkili ve işlem zamanı ayrı `vitrin-followup:<talep kimliği>:<olay kimliği>` kayıtlarında tutulur. Aynı talebin saklama değerlendirmesine dahildir. Tek kayıt imha aracı yeni UUID taleplerinin takip geçmişini de kapsar; işlem sırasında bu talepte düzenleme durdurulmalıdır. Araç kısmi başarısızlığı raporlar; gerçek veri silme bu geliştirme kapsamında çalıştırılmadı.
- Cloudflare Email: yalnız yeni kayıt bildirimi, UUID, tarih ve panel bağlantısı; müşteri telefonu/notu e-postaya eklenmez. İki alıcı kullanıcı tarafından doğrulanmıştır; özel adresler Worker secret'ında tutulur.
- Cloudflare Analytics Engine: olay adı ve sabit sayfa türü; ad, telefon, form notu, ham arama, ziyaretçi kimliği veya IP veri noktasına yazılmaz. Tarayıcı çerezi/kalıcı kimlik oluşturulmaz. Ağ katmanında IP işlenmesi ayrıca hosting kapsamındadır.
- WhatsApp ve doğrudan e-posta: ziyaretçi dış hizmete kendi seçimiyle geçer; konuşmalar için şirketin kendi cihaz/hesap saklama düzeni ayrıca uygulanır.

Şirket, Cloudflare ve iletişim sağlayıcıları için gerçek sözleşmeleri, alt işleyenleri ve veri işleme/aktarım konumlarını doğrulamalıdır. Yurt dışı aktarımın hukuki mekanizması henüz teyit edilmemiştir. Genel bir GDPR DPA veya sitede aydınlatma metni bulunması tek başına KVKK aktarım şartlarının sağlandığını kanıtlamaz. Uygun mekanizmanın seçimi ve varsa standart sözleşmenin imza/bildirim işlemi şirketin yetkilisi ve hukuk danışmanıyla tamamlanır; kod değişikliği bunu yapamaz.

## Kaynaklar

- [KVKK silme, yok etme ve anonimleştirme yönetmeliği](https://www.kvkk.gov.tr/Icerik/5441/KISISEL-VERILERIN-SILINMESI-YOK-EDILMESI-VEYA-ANONIM-HALE-GETIRILMESI-HAKKINDA-YONETMELIK)
- [KVKK yurt dışına aktarım](https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim)
- [Standart sözleşmelerde dikkat edilecek hususlar](https://www.kvkk.gov.tr/Icerik/8170/Yurt-Disina-Kisisel-Veri-Aktariminda-Kullanilacak-Standart-Sozlesmelerde-Dikkat-Edilmesi-Gereken-Hususlara-Iliskin-Kamuoyu-Duyurusu)

Bu taslak bir hukuki uygunluk belgesi değildir. Süre kararı verilmeden ziyaretçiye kesin silme süresi vaat edilmez ve üretim verisi silinmez.
