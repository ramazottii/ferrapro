"""Assign representative product-family photos, never unrelated category hero images."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parent.parent
p=ROOT/'public/katalog.json';data=json.loads(p.read_text(encoding='utf-8'))
def pick(t,rules,default):
 for pattern,key in rules:
  if re.search(pattern,t):return key
 return default
rules={
'Hijyen':[(r'ıslak|temizleme mendili','wipes'),(r'dispenseri|örtüsü dispenser','dispenser'),(r'kutu mendil|cep mendil|yüz havlu','tissue'),(r'peçete|mendil','pecete'),(r'fotosel|içten çekmeli havlu|hareketli havlu','fotosel2'),(r'jumbo|cimri','jumbo2'),(r'tuvalet','tuvalet2'),(r'havlu','jumbo2')],
'Temizlik':[(r'koku makinesi yedek','kokuyedek'),(r'koku makine','airfreshener'),(r'oda kokusu sprey','odaspray'),(r'oda parfüm','odaparfum'),(r'dispenser','soapdispenser'),(r'çöp poşet','cop'),(r'çöp kovası|çöp sepet|dönüşüm','bin'),(r'kova|arabası','bucket'),(r'bez','cloth'),(r'mop','mop'),(r'faraş|süpürge','dustpan'),(r'çekçe','squeegee'),(r'fırça','brush'),(r'sabun','soap'),(r'yüzey temiz|zemin bak|pas-kireç|çamaşır suyu|krem ','cleaner'),(r'sprey|cam temiz|yağ çözücü|sarı güç|mavi güç','cleaner')],
'Mutfak':[(r'bardak su','water'),(r'kapak','lid'),(r'bardak','bardak'),(r'kase|kâse|yemek kabı|sos kabı|tabak','bowl'),(r'filtre kâğıdı','filter'),(r'kahve|gold|coffee','coffee'),(r'çay','tea'),(r'şeker','sugar'),(r'çatal|bıçak|kaşık|karıştırıcı|kürdan','cutlery'),(r'pipet','straw'),(r'tepsi','tray'),(r'masa örtüsü|servis kâğıdı','pecete'),(r'folyo|pişirme','foil'),(r'streç','strec'),(r'poşet','buz'),(r'sünger|teli','sponge'),(r'fırça','brush'),(r'bulaşık','detergent')],
'Ambalaj':[(r'bant.*makine','tapeholder'),(r'band|bant','bant'),(r'sarma aparat','stretchtool'),(r'streç','strec'),(r'balon|hava yastığı','bubble'),(r'köpük','foam'),(r'koli|kutu|separatör|köşe|mukavva','box'),(r'bez.*çanta','bag'),(r'çanta','kraft'),(r'kese|dolgu kâğıdı','kese'),(r'etiket','labels'),(r'kargo|güvenlik','pouch'),(r'poşet|evrak cebi','buz')],
'PC':[(r'mouse pad','mousepad'),(r'mouse','mouse'),(r'klavye|tuş takımı','klavye'),(r'toner|drum|şeridi','toner'),(r'kartuş|mürekkep','ink'),(r'kablo düzen','cableties'),(r'kart okuyucu','drive'),(r'usb-c usb|usb-a usb|yazıcı usb|usb uzatma','usb'),(r'hdmi|displayport|ethernet|görüntü adaptörü|çoklayıcı','cable'),(r'kablo','cable'),(r'usb bellek|hafıza kart','usb'),(r'power bank','power'),(r'priz','powerstrip'),(r'adaptör','charger'),(r'ssd|sabit disk','drive'),(r'kulaklık','headset'),(r'mikrofon','microphone'),(r'kamera','webcam'),(r'kumanda','presenter'),(r'bezi','cloth'),(r'sprey','cleaner'),(r'stand|yükseltici','stand')],
'Sağlık':[(r'iş eldiveni|bulaşık|ev tipi','rubbergloves'),(r'eldiven.*tutucu|maske.*tutucu|örtüsü tutucu','rack'),(r'dispenser','dispenser'),(r'eldiven','gloves'),(r'ffp|n95','respirator'),(r'maske','mask'),(r'bone','cap'),(r'galoş','shoecover'),(r'siper','faceguard'),(r'önlük|yastık','gown'),(r'klozet','toiletcover'),(r'masa örtü','masa'),(r'atık poşet','cop'),(r'kesici|atık kova','sharps'),(r'pamuk','cotton'),(r'gazlı|sargı','bandage'),(r'flaster|yara bandı','plaster'),(r'dil basacağı','tongue')],
'Kırtasiye':[(r'pos|plotter|sürekli form','paperroll'),(r'fotokopi|baskı kâğıdı|fotoğraf kâğıdı|karbon kâğıdı','a4'),(r'pil','pil'),(r'kalemlik|organizer','organizer'),(r'kalemtıraş','sharpener'),(r'kalem ucu','refill'),(r'kalem mürekkebi','inkbottle'),(r'dolma','fountain'),(r'kurşun','pencil'),(r'versatil','mechanical'),(r'fosforlu|marker|tahta kalem|asetat|fineliner','marker'),(r'kalem','kalem'),(r'arşiv kutusu','box'),(r'sırt etiketi|etiket','labels'),(r'klasör','klasor'),(r'sekreterlik','clipboard'),(r'dosya','folder'),(r'takvim','calendar'),(r'defter|ajanda|fihrist|bloknot','notebook'),(r'not|sayfa işaret','not'),(r'zımba','zimba'),(r'delgeç','punch'),(r'ataş|mandal|raptiye|çivisi|lastik','clips'),(r'hesap','calculator'),(r'kaşe|ıstampa','stamp'),(r'evrak raf|magazinlik|kartvizit','organizer'),(r'makas','scissors'),(r'maket','cutter'),(r'cetvel','ruler'),(r'bant kesici','tapeholder'),(r'bandı|bant','bant'),(r'yapıştırıcı','glue'),(r'tahta silgisi','boarderaser'),(r'düzeltici','correction'),(r'silgi','eraser'),(r'mıknatıs','magnet'),(r'tahta|pano|flipchart','whiteboard'),(r'laminasyon|cilt kapağı','lamination'),(r'cilt spirali','spiral'),(r'zarf','envelope'),(r'pil','pil')]
}
default={'Hijyen':'fotosel2','Temizlik':'detergent','Mutfak':'water','Ambalaj':'kese','PC':'usb','Sağlık':'masa','Kırtasiye':'a4'}
# Specific product names must take precedence over broad family words.
priority={
 'Hijyen':[(r'z kat havlu dispenser','zfolddisp'),(r'sensörlü havlu dispenser','sensordisp'),(r'içten çekmeli havlu dispenser','centertowel'),(r'jumbo tuvalet.{0,24}dispenser','jumbotpdisp'),(r'içten çekmeli tuvalet.*dispenser','pulltpdisp'),(r'peçete dispenser','napkindisp'),(r'klozet örtüsü dispenser','seatcoverdisp'),(r'tuvalet.*dispenser|klozet.*dispenser','toiletdispenser'),(r'ıslak havlu koli','wipescarton'),(r'yüzey temizlik havlu','surfacewipes'),(r'z peçete','zfoldnapkin'),(r'renkli peçete','napkincolor'),(r'desenli peçete','napkinprint'),(r'kokteyl peçete','cocktailnapkin'),(r'garson katlama','garsonnapkin'),(r'dispenser peçete','vfoldnapkin'),(r'dev rulo havlu','rolldev'),(r'rulo havlu 12','rollkit12'),(r'rulo havlu 8','rollpack8'),(r'rulo havlu 6','rollkit6'),(r'peçete 200','napkin200'),(r'peçete 100','napkin100')],
 'Temizlik':[(r'ofis çöp sepet','officebasket'),(r'geri dönüşüm','recyclebin'),(r'pedallı çöp','bin'),(r'cam çekçe','windowsqueegee'),(r'yer çekçe','floorsqueegee'),(r'faraşlı süpürge|faraş','dustpan'),(r'yer fırça','floorbrush'),(r'temizlik araba','janitorcart'),(r'cam bezi','camcloth'),(r'toz bezi','dustcloth'),(r'ıslak mop','wetmop'),(r'nemli mop','dampmop'),(r'mop yede','moprefill'),(r'mop aparat','mopframe'),(r'mop sap','mophandle'),(r'presli temizlik kova','wringerbucket'),(r'temizlik kova','mopbucket'),(r'tuvalet fırça','toiletbrush'),(r'sarı güç','sariguc'),(r'mavi güç','maviguc'),(r'elde bulaşık','dishhand'),(r'makine bulaşık','dishmachine'),(r'parlatıcı','dishrinse'),(r'bulaşık makinesi tuz','dishsalt'),(r'yağ çöz','degreaser'),(r'koku makine.*yede','kokuyedek'),(r'koku makine','airfreshener'),(r'oda kokusu sprey','odaspray'),(r'oda parfüm','odaparfum'),(r'köpük sabun dispenser','foamdisp'),(r'sıvı sabun dispenser','soapdisp'),(r'köpük el sabunu','foamsoap'),(r'sıvı el sabunu 5','soap5l'),(r'kıvamlı çamaşır suyu 4','thickbleach4'),(r'kıvamlı çamaşır suyu 20','thickbleach20'),(r'kıvamlı çamaşır suyu','thickbleach4'),(r'sıvı çamaşır suyu 1','bleach1l'),(r'sıvı çamaşır suyu 20','bleach20l'),(r'sıvı çamaşır suyu 5|çamaşır suyu','bleach5l'),(r'çöp poşet.*mavi','copblue'),(r'çöp poşet.*şeffaf','copclear'),(r'çöp poşet','copblack'),(r'toz çamaşır deterjan|deterjanı 10 kg','washpowder'),(r'sıvı çamaşır deterjanı 5','washliq5'),(r'sıvı çamaşır deterjanı','washliq3'),(r'yumuşatıcı','softener'),(r'leke çıkarıcı','stainrem'),(r'kapsül','washcaps'),(r'arap sabun','arapsoap'),(r'ahşap yüzey','woodclean'),(r'seramik yüzey','ceramicclean'),(r'paslanmaz','steelclean'),(r'zemin bak','floorcare'),(r'cam temiz','cleaner'),(r'parfümlü yüzey','surfperfume'),(r'fresh.{0,20}yüzey|2,5 kg yüzey','surffresh'),(r'yüzey temizleyici 20|yüzey temizleyici 5','surfbidon'),(r'genel yüzey','surfgen'),(r'klozet temiz','cifklozet'),(r'banyo temiz','cifbanyo'),(r'pas sök','cifpas'),(r'kireç çöz','cifkirec'),(r'toz.*deterjan|makinesi tuzu','drycleaning')],
 'Mutfak':[(r'kapaklı yemek','bowl'),(r'bardak kapa','lid'),(r'bardak taşıyıcı|bardak kılıfı','cupcarrier'),(r'ice tea|soğuk çay','icedtea'),(r'çay','tea'),(r'süt','milk'),(r'meyve suyu','juice'),(r'soda|maden suyu','soda'),(r'enerji içece','energy'),(r'coffee mate|kahve kreması','creamer'),(r'filtre kâğıdı','filter'),(r'bardağı','bardak'),(r'masa örtüsü|servis kâğıdı','tablecover')],
 'Ambalaj':[(r'güvenlik bantlı','pouch'),(r'koli bandı makine','bant'),(r'band|bant','taperolls'),(r'kasa poşet','kasa')],
 'PC':[(r'kulaklık','headset'),(r'mürekkep kartuş','toner')],
 'Sağlık':[(r'önlüğ','gown'),(r'yastık','clinicalcover'),(r'bardak dispenser','cupdispenser')],
 'Kırtasiye':[(r'a3 fotokopi','a3ream'),(r'gramajlı','gramaj'),(r'plotter','plotterrolls'),(r'sürekli form','contform'),(r'karbon kâğıdı','carbonpaper'),(r'fotoğraf kâğıdı','photopaper'),(r'renkli fotokopi','colorream'),(r'jel kalem','gelpen'),(r'roller kalem','rollerpen'),(r'beyaz tahta kalem','boardmarker'),(r'asetat','acetatepen'),(r'imza kalem','signpen'),(r'plotter','plotter'),(r'fineliner','fineliner'),(r'permanent marker','wbmarker'),(r'mantar pano','corkboard'),(r'flipchart','flipchart'),(r'pano mıknat','boardmagnet'),(r'cilt spirali','bindcoil'),(r'dosya ayracı','filetabs'),(r'askılı dosya','hangingfile'),(r'sunum dosya','displaybook'),(r'imza dosya','signfolder'),(r'körüklü','accordionfile'),(r'geniş klasör','widebinder'),(r'dar klasör','narrowbinder'),(r'halkalı klasör','ringbinder'),(r'arşiv kutusu','archivebox'),(r'spiralli defter','spiralnb'),(r'ajandalar','planner'),(r'bloknot','notepad'),(r'yapışkanlı not','stickynotes'),(r'ticari defter','ledger'),(r'sert kapaklı defter','hardcover'),(r'sayfa ışaret|sayfa işaret','pageflags'),(r'zımba sök','stapleremover'),(r'raptiye|harita çivi','pushpins'),(r'evrak mandal','binderclips'),(r'ataş','paperclips'),(r'kalemlik','pencup'),(r'evrak raf','papertray'),(r'magazinlik','magrack'),(r'kartvizitlik','cardholder'),(r'hava kabarcıklı','bubblemailer'),(r'düğme pil','buttonbatt'),(r'9v pil','ninevolt'),(r'paket lasti','rubberbands'),(r'bant kesici','tapeholder'),(r'bandı|bant','taperolls'),(r'poşet dosya','dosya'),(r'ıstampa mürekkebi','inkbottle')]
}
for group,entries in priority.items():rules[group]=entries+rules[group]
# Missing dedicated photos reuse the closest existing family file. Do not regenerate ready WebP files.
closest={
 'wipes':'wipes','wipescarton':'wipescarton','surfacewipes':'surfacewipes','drycleaning':'detergent',
 'soapdispenser':'soapdisp',
 'sharps':'bin','rubbergloves':'gloves','shoecover':'cap','gown':'cap','faceguard':'mask',
 'clinicalcover':'masa','plaster':'bandage','tongue':'cotton','rack':'organizer',
 'cupdispenser':'dispenser','ink':'toner','soda':'water','creamer':'coffee','milk':'water',
 'energy':'water','juice':'water','icedtea':'tea','lid':'bardak','cupcarrier':'bardak',
 'straw':'cutlery','tray':'bowl','tablecover':'masa','foil':'strec','filter':'coffee',
 'stretchtool':'strec','foam':'bubble','pouch':'kasa','powerstrip':'charger',
 'headset':'presenter','webcam':'mouse','microphone':'presenter','stand':'organizer',
 'magnet':'clips','spiral':'lamination'
}
pending=[]
category_image={'Hijyen':'hijyen','Temizlik':'temizlik','Mutfak':'mutfak','Ambalaj':'ambalaj','PC':'bilgisayar','Sağlık':'saglik','Kırtasiye':'ofis'}
for row in data['urunler']:
 t=row['satir'].replace('I','ı').replace('İ','i').lower()
 key=pick(t,rules[row['kategori']],default[row['kategori']])
 key=closest.get(key,key)
 row['gorsel']='/img/products/'+key+'.webp'
 row['gorselTuru']='temsili'
 if not (ROOT/'public'/row['gorsel'].lstrip('/')).is_file():
  pending.append({'kategori':row['kategori'],'satir':row['satir'],'imageKey':key})
  row['gorsel']='/img/collection/'+category_image[row['kategori']]+'.webp'
  row['gorselTuru']='kategori'
p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'docs/product-images-pending.json').write_text(json.dumps(pending,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
from collections import Counter
print(json.dumps(Counter(r['gorsel'] for r in data['urunler']),indent=2))
