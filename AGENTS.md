# Ferrapro çalışma talimatları

- Önce README.md ve docs/HANDOFF.md okuyun; git durumunu kontrol edin.
- Amaç: ferrapro.com üzerinden kurumsal teklif ve görüşme talebi almak. Online sipariş, ödeme, fiyat hesabı ve zorunlu üyelik eklemeyin.
- Ürün veya grup seçimi ve miktar isteğe bağlıdır. Müşteri yalnızca firma/telefonla görüşme talebi bırakabilmelidir.
- Aynı Worker tedarik.ferranoi.com panelini de yayımlar. Ferrapro tasarım işlerinde paneli, giriş kodunu, şifreleri veya özel verileri değiştirmeyin.
- public/katalog.json halka açıktır. src/catalog.js ve maliyet kaynaklarından fiyat, maliyet veya özel müşteri bilgisi aktarmayın.
- Gerçek katalog kapsamına göre kategori üretin. Boş kategori, doğrulanmamış stok/teslimat iddiası, sahte referans eklemeyin.
- Eski /urunler?g=...&a=... ve /siparis bağlantılarını uyumlu tutun.
- Çalışmayı codex/ dallarında commit edin; GitHub PR üzerinden paylaşın. Kullanıcının değişikliklerini silmeyin veya force push yapmayın.
- Cursor ve Codex aynı dalı kullanmalı. Başlamadan fetch/status; bitirirken test sonuçları ve yayın durumuyla HANDOFF.md güncelleyin.
- npm run check ve ilgili masaüstü/mobil tarayıcı kontrollerini çalıştırın.
- GitHub'a push yapmak canlıya yayın değildir. Yayın için kullanıcının ilgili sürüme yönelik talimatını esas alın.
- .env, .dev.vars, token, şifre veya gerçek müşteri kayıtlarını commit etmeyin.
