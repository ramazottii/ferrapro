"""Curated generic enquiry types. Run once against the versioned public catalogue.
Sources and image provenance are documented in docs/catalog-research-all.md.
Does not read private prices, supplier or customer records.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
path = ROOT / 'public/katalog.json'
data = json.loads(path.read_text(encoding='utf-8'))
# group, subgroup id, title, product names; images assigned separately and validated.
families = [
 ('Hijyen','dispenser','Dispenser ve Aparatlar','Z kat havlu dispenseri|Sensörlü havlu dispenseri|İçten çekmeli havlu dispenseri|Jumbo tuvalet kâğıdı dispenseri|İçten çekmeli tuvalet kâğıdı dispenseri|Masaüstü peçete dispenseri|Klozet örtüsü dispenseri'),
 ('Hijyen','islak','Islak Havlu','Islak havlu 90’lı|Islak havlu koli|Yüzey temizlik havlusu'),
 ('Hijyen','pecete','Peçete','Peçete 100’lü|Peçete 200’lü|Renkli peçete|Desenli peçete|Z peçete|Kokteyl peçetesi|Garson katlama peçete|Dispenser peçete'),
 ('Hijyen','havlu','Rulo Havlu','Rulo havlu 6’lı|Rulo havlu 8’li|Rulo havlu 12’li|Dev rulo havlu'),
 ('Temizlik','sabun','El Sabunları','Sıvı el sabunu|Köpük el sabunu|Sıvı sabun dispenseri|Köpük sabun dispenseri'),
 ('Temizlik','yuzey','Yüzey Temizleyicileri','Genel yüzey temizleyici|Cam temizleyici|Ahşap yüzey temizleyici|Seramik yüzey temizleyici|Paslanmaz çelik yüzey temizleyici|Zemin bakım ürünü|Arap sabunu'),
 ('Temizlik','camasir','Çamaşır Deterjanları','Sıvı çamaşır deterjanı|Toz çamaşır deterjanı|Çamaşır yumuşatıcısı|Çamaşır leke çıkarıcı'),
 ('Temizlik','camasir-suyu','Çamaşır Suları','Kıvamlı çamaşır suyu|Sıvı çamaşır suyu'),
 ('Temizlik','kirec','Kireç ve Pas Çözücüler','Kireç çözücü|Pas sökücü|Banyo temizleyici|Klozet temizleyici'),
 ('Temizlik','bulasik-temizlik','Bulaşık Temizliği','Elde bulaşık deterjanı|Makine bulaşık deterjanı|Bulaşık makinesi parlatıcısı|Bulaşık makinesi tuzu|Yağ çözücü'),
 ('Temizlik','arac','Bez ve Mop','Mikrofiber temizlik bezi|Cam bezi|Toz bezi|Islak mop|Nemli mop|Mop yedeği|Mop aparatı|Mop sapı'),
 ('Temizlik','ekipman','Temizlik Ekipmanları','Temizlik kovası|Presli temizlik kovası|Faraşlı süpürge|Tuvalet fırçası|Yer fırçası|Cam çekçeği|Yer çekçeği|Temizlik arabası'),
 ('Temizlik','atik-yonetimi','Atık Yönetimi','Pedallı çöp kovası|Ofis çöp sepeti|Geri dönüşüm kutusu|Çöp kovası kapağı'),
 ('Temizlik','koku','Ortam Kokuları','Oda kokusu spreyi|Otomatik koku makinesi|Koku makinesi yedeği'),
 ('Mutfak','kahve','Kahve ve Çay','Çekirdek kahve|Filtre kahve|Türk kahvesi|Çözünebilir kahve|Kapsül kahve|Dökme siyah çay|Demlik poşet çay|Bardak poşet çay|Bitki çayı|Küp şeker|Stick şeker|Toz şeker|Kahve kreması'),
 ('Mutfak','icecek','İçecekler','Şişe su|Bardak su|Maden suyu|Meyveli maden suyu|Meyve suyu|Soğuk çay|Süt'),
 ('Mutfak','bardak','Bardak ve Kapaklar','Karton bardak|Çift duvarlı karton bardak|Soğuk içecek bardağı|Sıcak içecek bardak kapağı|Soğuk içecek bardak kapağı|Bardak kılıfı|Bardak taşıyıcı'),
 ('Mutfak','kase','Kase ve Yemek Kapları','Karton çorba kasesi|Kraft salata kasesi|Kapaklı yemek kabı|Sos kabı|Alüminyum yemek kabı'),
 ('Mutfak','servis','Servis ve İkram Gereçleri','Ahşap çatal|Ahşap bıçak|Ahşap kaşık|Çatal bıçak seti|Ahşap karıştırıcı|Kâğıt pipet|Kürdan|Karton tabak|Servis tepsisi|Masa örtüsü|Amerikan servis kâğıdı'),
 ('Mutfak','saklama','Hazırlık ve Saklama','Alüminyum folyo|Pişirme kâğıdı|Gıda streç filmi|Buzdolabı poşeti|Kilitli gıda poşeti|Kahve filtre kâğıdı'),
 ('Mutfak','bulasik','Bulaşık Gereçleri','Bulaşık süngeri|Bulaşık teli|Bulaşık fırçası|Bulaşık makinesi tableti'),
 ('Ambalaj','koli','Koli ve Kutular','Tek oluklu koli|Çift oluklu koli|Kargo kutusu|Arşiv taşıma kolisi|Kilitli karton kutu|Karton separatör|Köşe koruyucu'),
 ('Ambalaj','strec','Streç ve Sarma','El tipi palet streç filmi|Makine tipi streç film|Mini streç film|Siyah streç film|Streç sarma aparatı'),
 ('Ambalaj','bant','Bant ve Kapatma','Şeffaf koli bandı|Kahverengi koli bandı|Kraft kâğıt bant|Çift taraflı bant|Maskeleme bandı|Koli bandı makinesi'),
 ('Ambalaj','koruma','Koruyucu Ambalaj','Balonlu naylon|Köpük ambalaj şiltesi|Hava yastığı ambalaj|Kraft dolgu kâğıdı|Oluklu mukavva rulo'),
 ('Ambalaj','kraft','Çanta ve Taşıma','Kraft çanta|Düz saplı kâğıt çanta|Büküm saplı kâğıt çanta|Bez taşıma çantası'),
 ('Ambalaj','kese','Kese ve Gıda Ambalajı','Kese kâğıdı|Yağlı kese kâğıdı|Pencereli kese kâğıdı|Kraft paket servis çantası'),
 ('Ambalaj','kasa','Poşetler','Kargo poşeti|Kilitli poşet|Şeffaf ambalaj poşeti|Kasa poşeti|Güvenlik bantlı poşet'),
 ('Ambalaj','etiket','Etiket ve Sevkiyat','Kargo etiketi|Termal barkod etiketi|Kırılabilir uyarı etiketi|Sevkiyat evrak cebi|Palet etiketi'),
 ('PC','mouse','Mouse ve Aksesuarları','Kablolu mouse|Kablosuz mouse|Ergonomik mouse|Mouse pad|Bilek destekli mouse pad'),
 ('PC','klavye','Klavye ve Setler','Kablolu klavye|Kablosuz klavye|Klavye mouse seti|Sayısal tuş takımı'),
 ('PC','toner','Yazıcı Sarf Malzemeleri','Siyah lazer toner|Renkli lazer toner|Siyah mürekkep kartuşu|Renkli mürekkep kartuşu|Tanklı yazıcı mürekkebi|Yazıcı drum ünitesi|Atık toner kutusu|Nokta vuruşlu yazıcı şeridi'),
 ('PC','usb','Kablo ve Bağlantı','USB bellek|USB-A USB-C kablo|USB-C USB-C kablo|Yazıcı USB kablosu|HDMI kablo|DisplayPort kablo|Ethernet kablosu|USB çoklayıcı|USB-C görüntü adaptörü|USB uzatma kablosu'),
 ('PC','power','Güç ve Şarj','Power bank|USB şarj adaptörü|Dizüstü bilgisayar adaptörü|Çoklu priz|Akım korumalı priz'),
 ('PC','depolama','Veri Depolama','Harici SSD|Harici sabit disk|SD hafıza kartı|MicroSD hafıza kartı|Kart okuyucu'),
 ('PC','toplanti','Toplantı Aksesuarları','Kablolu kulaklık|Mikrofonlu kulaklık|Web kamera|USB mikrofon|Sunum kumandası'),
 ('PC','bakim','Ekran ve Çalışma Alanı','Ekran temizleme bezi|Ekran temizleme spreyi|Dizüstü bilgisayar standı|Monitör yükseltici|Kablo düzenleyici'),
 ('Sağlık','eldiven','Eldivenler','Nitril muayene eldiveni|Lateks muayene eldiveni|Vinil muayene eldiveni|Pudrasız muayene eldiveni'),
 ('Sağlık','maske','Maske ve Koruyucu Sarf','Üç katlı maske|FFP2 maske|Tek kullanımlık bone|Tek kullanımlık galoş|Tek kullanımlık önlük|Ziyaretçi önlüğü|Koruyucu yüz siperi'),
 ('Sağlık','masa','Muayene Alanı Örtüleri','Muayene masa örtüsü|Lamineli muayene masa örtüsü|Tek kullanımlık yastık kılıfı|Hasta önlüğü'),
 ('Sağlık','atik','Atık Toplama','Kesici delici atık kutusu|Tıbbi atık kovası|Tıbbi atık poşeti'),
 ('Sağlık','bakim','Bakım Sarf Malzemeleri','Pamuk|Gazlı bez|Sargı bezi|Flaster|Yara bandı|Dil basacağı'),
 ('Sağlık','duzen','Klinik Düzen ve Dispenser','Eldiven kutusu tutucu|Maske kutusu tutucu|Tek kullanımlık bardak dispenseri|Muayene örtüsü tutucu'),
]

seen={(r['kategori'],r['satir'].casefold()) for r in data['urunler']}
for group,sub,title,names in families:
    for name in names.split('|'):
        if (group,name.casefold()) not in seen:
            data['urunler'].append(dict(kategori=group,satir=name,alt=sub,talepTuru=True))
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
