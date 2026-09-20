"""Curated generic enquiry types. Run once against the versioned public catalogue.
Sources and image provenance are documented in docs/catalog-research-all.md.
Does not read private prices, supplier or customer records.
"""
import json
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from title_catalog_names import urun_adi_yazi

ROOT = Path(__file__).resolve().parent.parent
path = ROOT / 'public/katalog.json'
data = json.loads(path.read_text(encoding='utf-8'))
# group, subgroup id, title, product names; images assigned separately and validated.
families = [
 ('Hijyen','dispenser','Dispenser ve Aparatlar','Z Kat Havlu Dispenseri|Sensörlü Havlu Dispenseri|İçten Çekmeli Havlu Dispenseri|Jumbo Tuvalet Kâğıdı Dispenseri|İçten Çekmeli Tuvalet Kâğıdı Dispenseri|Masaüstü Peçete Dispenseri|Klozet Örtüsü Dispenseri'),
 ('Hijyen','islak','Islak Havlu','Islak Havlu 90’lı|Islak Havlu Koli|Yüzey Temizlik Havlusu'),
 ('Hijyen','pecete','Peçete','Peçete 100’lü|Peçete 200’lü|Renkli Peçete|Desenli Peçete|Z Peçete|Kokteyl Peçetesi|Garson Katlama Peçete|Dispenser Peçete'),
 ('Hijyen','havlu','Rulo Havlu','Rulo Havlu 6’lı|Rulo Havlu 8’li|Rulo Havlu 12’li|Dev Rulo Havlu'),
 ('Temizlik','sabun','El Sabunları','Sıvı El Sabunu 1 L|Köpük El Sabunu 1 L|Sıvı Sabun Dispenseri|Köpük Sabun Dispenseri'),
 ('Temizlik','yuzey','Yüzey Temizleyicileri','Genel Yüzey Temizleyici|Cam Temizleyici|Ahşap Yüzey Temizleyici|Seramik Yüzey Temizleyici|Paslanmaz Çelik Yüzey Temizleyici|Zemin Bakım Ürünü|Arap Sabunu'),
 ('Temizlik','camasir','Çamaşır Deterjanları','Toz Çamaşır Deterjanı 10 kg|Sıvı Çamaşır Deterjanı 3 L|Sıvı Çamaşır Deterjanı 5 L|Kapsül Çamaşır Deterjanı|Çamaşır Yumuşatıcısı 5 L|Çamaşır Leke Çıkarıcı'),
 ('Temizlik','camasir-suyu','Çamaşır Suları','Sıvı Çamaşır Suyu 1 L|Sıvı Çamaşır Suyu 5 L|Sıvı Çamaşır Suyu 20 L|Kıvamlı Çamaşır Suyu 4 kg|Kıvamlı Çamaşır Suyu 20 kg'),
 ('Temizlik','kirec','Kireç ve Pas Çözücüler','Kireç Çözücü|Pas Sökücü|Banyo Temizleyici|Klozet Temizleyici'),
 ('Temizlik','bulasik-temizlik','Bulaşık Temizliği','Elde Bulaşık Deterjanı|Makine Bulaşık Deterjanı|Bulaşık Makinesi Parlatıcısı|Bulaşık Makinesi Tuzu|Yağ Çözücü'),
 ('Temizlik','arac','Bez ve Mop','Mikrofiber Temizlik Bezi|Cam Bezi|Toz Bezi|Islak Mop|Nemli Mop|Mop Yedeği|Mop Aparatı|Mop Sapı|Temizlik Kovası|Presli Temizlik Kovası|Tuvalet Fırçası'),
 ('Temizlik','ekipman','Temizlik Ekipmanları','Faraşlı Süpürge|Yer Fırçası|Cam Çekçeği|Yer Çekçeği|Temizlik Arabası'),
 ('Temizlik','atik-yonetimi','Atık Yönetimi','Pedallı Çöp Kovası|Ofis Çöp Sepeti|Geri Dönüşüm Kutusu|Çöp Kovası Kapağı'),
 ('Temizlik','koku','Ortam Kokuları','Oda Kokusu Spreyi|Otomatik Koku Makinesi|Koku Makinesi Yedeği'),
 ('Mutfak','kahve','Kahve ve Çay','Çekirdek Kahve|Filtre Kahve|Türk Kahvesi|Çözünebilir Kahve|Kapsül Kahve|Dökme Siyah Çay|Demlik Poşet Çay|Bardak Poşet Çay|Bitki Çayı|Küp Şeker|Stick Şeker|Toz Şeker|Kahve Kreması'),
 ('Mutfak','icecek','İçecekler','Şişe Su|Bardak Su|Maden Suyu|Meyveli Maden Suyu|Meyve Suyu|Soğuk Çay|Süt'),
 ('Mutfak','bardak','Bardak ve Kapaklar','Karton Bardak|Çift Duvarlı Karton Bardak|Soğuk Içecek Bardağı|Sıcak Içecek Bardak Kapağı|Soğuk Içecek Bardak Kapağı|Bardak Kılıfı|Bardak Taşıyıcı'),
 ('Mutfak','kase','Kase ve Yemek Kapları','Karton Çorba Kasesi|Kraft Salata Kasesi|Kapaklı Yemek Kabı|Sos Kabı|Alüminyum Yemek Kabı'),
 ('Mutfak','servis','Servis ve İkram Gereçleri','Ahşap Çatal|Ahşap Bıçak|Ahşap Kaşık|Çatal Bıçak Seti|Ahşap Karıştırıcı|Kâğıt Pipet|Kürdan|Karton Tabak|Servis Tepsisi|Masa Örtüsü|Amerikan Servis Kâğıdı'),
 ('Mutfak','saklama','Hazırlık ve Saklama','Alüminyum Folyo|Pişirme Kâğıdı|Gıda Streç Filmi|Buzdolabı Poşeti|Kilitli Gıda Poşeti|Kahve Filtre Kâğıdı'),
 ('Mutfak','bulasik','Bulaşık Gereçleri','Bulaşık Süngeri|Bulaşık Teli|Bulaşık Fırçası|Bulaşık Makinesi Tableti'),
 ('Ambalaj','koli','Koli ve Kutular','Tek Oluklu Koli|Çift Oluklu Koli|Kargo Kutusu|Arşiv Taşıma Kolisi|Kilitli Karton Kutu|Karton Separatör|Köşe Koruyucu'),
 ('Ambalaj','strec','Streç ve Sarma','El Tipi Palet Streç Filmi|Makine Tipi Streç Film|Mini Streç Film|Siyah Streç Film|Streç Sarma Aparatı'),
 ('Ambalaj','bant','Bant ve Kapatma','Şeffaf Koli Bandı|Kahverengi Koli Bandı|Kraft Kâğıt Bant|Çift Taraflı Bant|Maskeleme Bandı|Koli Bandı Makinesi'),
 ('Ambalaj','koruma','Koruyucu Ambalaj','Balonlu Naylon|Köpük Ambalaj Şiltesi|Hava Yastığı Ambalaj|Kraft Dolgu Kâğıdı|Oluklu Mukavva Rulo'),
 ('Ambalaj','kraft','Çanta ve Taşıma','Kraft Çanta|Düz Saplı Kâğıt Çanta|Büküm Saplı Kâğıt Çanta|Bez Taşıma Çantası'),
 ('Ambalaj','kese','Kese ve Gıda Ambalajı','Kese Kâğıdı|Yağlı Kese Kâğıdı|Pencereli Kese Kâğıdı|Kraft Paket Servis Çantası'),
 ('Ambalaj','kasa','Poşetler','Kargo Poşeti|Kilitli Poşet|Şeffaf Ambalaj Poşeti|Kasa Poşeti|Güvenlik Bantlı Poşet'),
 ('Ambalaj','etiket','Etiket ve Sevkiyat','Kargo Etiketi|Termal Barkod Etiketi|Kırılabilir Uyarı Etiketi|Sevkiyat Evrak Cebi|Palet Etiketi'),
 ('PC','mouse','Mouse ve Aksesuarları','Kablolu Mouse|Kablosuz Mouse|Ergonomik Mouse|Mouse Pad|Bilek Destekli Mouse Pad'),
 ('PC','klavye','Klavye ve Setler','Kablolu Klavye|Kablosuz Klavye|Klavye Mouse Seti|Sayısal Tuş Takımı'),
 ('PC','toner','Yazıcı Sarf Malzemeleri','Siyah Lazer Toner|Renkli Lazer Toner|Siyah Mürekkep Kartuşu|Renkli Mürekkep Kartuşu|Tanklı Yazıcı Mürekkebi|Yazıcı Drum Ünitesi|Atık Toner Kutusu|Nokta Vuruşlu Yazıcı Şeridi'),
 ('PC','usb','Kablo ve Bağlantı','USB Bellek|USB-A USB-C Kablo|USB-C USB-C Kablo|Yazıcı USB Kablosu|HDMI Kablo|Displayport Kablo|Ethernet Kablosu|USB Çoklayıcı|USB-C Görüntü Adaptörü|USB Uzatma Kablosu'),
 ('PC','power','Güç ve Şarj','Power Bank|USB Şarj Adaptörü|Dizüstü Bilgisayar Adaptörü|Çoklu Priz|Akım Korumalı Priz'),
 ('PC','depolama','Veri Depolama','Harici SSD|Harici Sabit Disk|SD Hafıza Kartı|Microsd Hafıza Kartı|Kart Okuyucu'),
 ('PC','toplanti','Toplantı Aksesuarları','Kablolu Kulaklık|Mikrofonlu Kulaklık|Web Kamera|USB Mikrofon|Sunum Kumandası'),
 ('PC','bakim','Ekran ve Çalışma Alanı','Ekran Temizleme Bezi|Ekran Temizleme Spreyi|Dizüstü Bilgisayar Standı|Monitör Yükseltici|Kablo Düzenleyici'),
 ('Sağlık','eldiven','Eldivenler','Nitril Muayene Eldiveni|Lateks Muayene Eldiveni|Vinil Muayene Eldiveni|Pudrasız Muayene Eldiveni'),
 ('Sağlık','maske','Maske ve Koruyucu Sarf','Üç Katlı Maske|FFP2 Maske|Tek Kullanımlık Bone|Tek Kullanımlık Galoş|Tek Kullanımlık Önlük|Ziyaretçi Önlüğü|Koruyucu Yüz Siperi'),
 ('Sağlık','masa','Muayene Alanı Örtüleri','Muayene Masa Örtüsü|Lamineli Muayene Masa Örtüsü|Tek Kullanımlık Yastık Kılıfı|Hasta Önlüğü'),
 ('Sağlık','atik','Atık Toplama','Kesici Delici Atık Kutusu|Tıbbi Atık Kovası|Tıbbi Atık Poşeti'),
 ('Sağlık','bakim','Bakım Sarf Malzemeleri','Pamuk|Gazlı Bez|Sargı Bezi|Flaster|Yara Bandı|Dil Basacağı'),
 ('Sağlık','duzen','Klinik Düzen ve Dispenser','Eldiven Kutusu Tutucu|Maske Kutusu Tutucu|Tek Kullanımlık Bardak Dispenseri|Muayene Örtüsü Tutucu'),
]

seen={(r['kategori'],r['satir'].casefold()) for r in data['urunler']}
for group,sub,title,names in families:
    for name in names.split('|'):
        if (group,name.casefold()) not in seen:
            data['urunler'].append(dict(kategori=group,satir=urun_adi_yazi(name),alt=sub,talepTuru=True))
            seen.add((group,name.casefold()))

# Explicitly incomplete source rows are kept in a review file rather than guessed.
ambiguous = ['3,2 L çam / dağ', 'sprey 750 ml', '750 ml Dağ Esintisi', '250 ml 24', '330 ml 12']
review=[r for r in data['urunler'] if any(r['satir'].startswith(s) for s in ambiguous)]
data['urunler']=[r for r in data['urunler'] if r not in review]
review_path=ROOT/'docs/catalog-needs-identification.json'
if not review_path.exists(): review_path.write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# New taxonomy entries are scoped to their main category; existing deep links survive.
site=ROOT/'public/site.js'
s=site.read_text(encoding='utf-8')
for group,sub,title,_ in families:
    marker=f'  {group}: ['
    start=s.index(marker,s.index('const ALTLAR'))
    end=s.index('\n  ],',start)
    if f'id: "{sub}"' not in s[start:end]:
        s=s[:end]+f'\n    {{ id: "{sub}", ad: "{title}", test: () => false }},'+s[end:]
site.write_text(s,encoding='utf-8')
path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print({g:sum(r['kategori']==g for r in data['urunler']) for g in data['gruplar']})
