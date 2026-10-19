# -*- coding: utf-8 -*-
from pathlib import Path
import json

K1 = "temizlik-kagitlari"
K2 = "sivi-temizlik-urunleri"
K3 = "aparat-ve-ekipmanlar"

A_HAVLU = "havlu-ve-peceteler"
A_ISLAK = "islak-havlular"
A_TUVALET = "tuvalet-kagitlari"
A_END = "endustriyel-temizlik-urunleri"
A_GENEL = "genel-kullanim-temizlik-urunleri"
A_SARF = "temizlik-sarf-urunleri"
A_COP = "cop-posetleri"
A_AT = "kullan-at-urunler"
A_HAP = "havlu-aparatlari"
A_SABUN = "sivi-sabun-ve-kopuk-sabun-aparatlari"
A_KOVA = "cop-kovalari"

NOTE_OLCU = "Ölçü birimi kullanıcı tarafından teyit edilecek. Şimdilik {0} olarak korunmalı."
NOTE_STREC = "Ölçü birimi kullanıcı tarafından teyit edilecek."

rows = []


def olcu_yazi(raw):
    import re
    s = str(raw or "").strip()
    if not s or s.casefold() == "belirtilmedi":
        return ""
    bare = {"4": "4Lt", "2,5": "2,5Lt", "400": "400ML"}
    if s in bare:
        return bare[s]
    if re.fullmatch(r"\d+\s*[×xX]\s*\d+", s):
        a, b = re.split(r"\s*[×xX]\s*", s)
        return f"{a} × {b} Cm"
    s = re.sub(r"\s*mililitre\b", "ML", s, flags=re.I)
    s = re.sub(r"\s*kilogram\b", "Kg", s, flags=re.I)
    s = re.sub(r"\s*santimetre\b", " Cm", s, flags=re.I)
    s = re.sub(r"\s*litre\b", "Lt", s, flags=re.I)
    s = re.sub(r"\s*gram\b", "Gr", s, flags=re.I)
    s = re.sub(r"\s*gr\.?(?=\s|$)", "Gr", s, flags=re.I)
    s = re.sub(r"\s*kg\.?(?=\s|$)", "Kg", s, flags=re.I)
    s = re.sub(r"\s*ml\.?(?=\s|$)", "ML", s, flags=re.I)
    s = re.sub(r"\s*mm\.?(?=\s|$)", "Mm", s, flags=re.I)
    s = re.sub(r"^(\d+(?:,\d+)?)\s+Cm$", r"\1Cm", s)
    s = re.sub(r"^(\d+(?:,\d+)?)\s+Gr$", r"\1Gr", s)
    s = re.sub(r"^(\d+(?:,\d+)?)\s+Kg$", r"\1Kg", s)
    s = re.sub(r"^(\d+(?:,\d+)?)\s+ML$", r"\1ML", s)
    s = re.sub(r"^(\d+(?:,\d+)?)\s+Mm$", r"\1Mm", s)
    return re.sub(r"\s{2,}", " ", s).strip()


def add(ad, ana, alt, **f):
    rows.append({
        "ad": ad,
        "anaKategoriId": ana,
        "altKategoriId": alt,
        "marka": f.get("marka", ""),
        "olcu": olcu_yazi(f.get("olcu", "")),
        "kapasite": olcu_yazi(f.get("kapasite", "")) if f.get("kapasite") else f.get("kapasite", ""),
        "malzeme": f.get("malzeme", ""),
        "renk": f.get("renk", ""),
        "ambalajAdedi": f.get("ambalaj", ""),
        "urunTuru": f.get("tur", ""),
        "aciklama": f.get("aciklama", ""),
        "not": f.get("notu", ""),
        "gorsel": "",
        "aktif": True,
        "fiyat": None,
    })


# 1.1
add("Fotoselli Havlu Kağıdı", K1, A_HAVLU, marka="Espiga", olcu="21 santimetre", ambalaj="6'lı")
add("İçten Çekmeli Havlu", K1, A_HAVLU, marka="Espiga", ambalaj="6'lı")
add("Z Katlı Havlu", K1, A_HAVLU, marka="Espiga", ambalaj="100'lü")
add("Z Katlı Havlu", K1, A_HAVLU, marka="Espiga", ambalaj="200'lü")
add("Ev Tipi Rulo Havlu", K1, A_HAVLU, marka="Bellino", ambalaj="24'lü")
add("Dev Rulo Havlu", K1, A_HAVLU, marka="Solo", ambalaj="Tekli")
add("Dev Rulo Havlu", K1, A_HAVLU, marka="Selpak", ambalaj="Tekli")

# 1.2
add("Islak Havlu", K1, A_ISLAK, marka="Sleepy")
add("Islak Havlu", K1, A_ISLAK, marka="Komili")
add("Islak Havlu", K1, A_ISLAK, marka="Selpak")
add("Yüzeyler İçin Islak Havlu", K1, A_ISLAK, marka="Sleepy")

# 1.3
add("Mini Jumbo Tuvalet Kağıdı", K1, A_TUVALET, marka="Espiga", ambalaj="12'li")
add("Mini İçten Çekmeli Tuvalet Kağıdı", K1, A_TUVALET, marka="Espiga", ambalaj="12'li")
add("İçten Çekmeli Tuvalet Kağıdı", K1, A_TUVALET, marka="Espiga", ambalaj="6'lı")
add("Ev Tipi Tuvalet Kağıdı", K1, A_TUVALET, marka="Bellino", ambalaj="48'li")
add("Ev Tipi Tuvalet Kağıdı", K1, A_TUVALET, marka="Selpak", ambalaj="48'li")
add("Ev Tipi Tuvalet Kağıdı", K1, A_TUVALET, marka="Solo", ambalaj="48'li")
add("Ev Tipi Tuvalet Kağıdı", K1, A_TUVALET, marka="Bellino", ambalaj="24'lü")
add("Ev Tipi Tuvalet Kağıdı", K1, A_TUVALET, marka="Selpak", ambalaj="24'lü")
add("Ev Tipi Tuvalet Kağıdı", K1, A_TUVALET, marka="Solo", ambalaj="24'lü")

# 2.1 Ozopak
for ad, olculer in [
    ("Yüzey Temizleme Ürünü", ["5 kilogram", "20 kilogram"]),
    ("Sıvı El Sabunu", ["5 kilogram", "20 kilogram"]),
    ("Kıvamlı Çamaşır Suyu", ["5 kilogram", "20 kilogram"]),
    ("Sıvı Bulaşık Deterjanı", ["5 kilogram", "20 kilogram"]),
]:
    for olcu in olculer:
        add(ad, K2, A_END, marka="Ozopak", olcu=olcu)
add("Endüstriyel Bulaşık Makinesi Deterjanı", K2, A_END, marka="Ozopak", olcu="20 kilogram")
add("Endüstriyel Bulaşık Makinesi Parlatıcısı", K2, A_END, marka="Ozopak", olcu="20 kilogram")
add("Endüstriyel Bulaşık Makinesi Kireç Önleyici", K2, A_END, marka="Ozopak", olcu="5 kilogram")
add("Cam Temizleme Maddesi", K2, A_END, marka="Ozopak", olcu="5 kilogram")
add("Cam Temizleme Maddesi", K2, A_END, marka="Ozopak", olcu="500 mililitre")
add("Kireç ve Pas Sökücü", K2, A_END, marka="Ozopak", olcu="5 kilogram")
add("Kireç ve Pas Sökücü", K2, A_END, marka="Ozopak", olcu="20 kilogram")
add("Yağ Çözücü", K2, A_END, marka="Ozopak", olcu="5 kilogram")
add("Yağ Çözücü", K2, A_END, marka="Ozopak", olcu="20 kilogram")
add("Sıvı Arap Sabunu", K2, A_END, marka="Ozopak", olcu="5 kilogram")
add("Köpük El Sabunu", K2, A_END, marka="Ozopak", olcu="5 kilogram")
add("Ahşap Temizleme Maddesi", K2, A_END, marka="Ozopak", olcu="5 kilogram")
add("Çamaşır Yumuşatıcısı", K2, A_END, marka="Yumoş", olcu="5 kilogram")
add("Çamaşır Yumuşatıcısı", K2, A_END, marka="Vernel", olcu="5 kilogram")

# 2.2
add("Domestos Çamaşır Suyu", K2, A_GENEL, marka="Domestos", olcu="750 mililitre")
add("Domestos Çamaşır Suyu", K2, A_GENEL, marka="Domestos", olcu="3,2 litre")
add("Sprey Çamaşır Suyu", K2, A_GENEL, marka="Domestos", olcu="Belirtilmedi")
add("Bulaşık Deterjanı", K2, A_GENEL, marka="Pril", olcu="675 mililitre")
add("Bulaşık Deterjanı", K2, A_GENEL, marka="Pril", olcu="4", notu=NOTE_OLCU.format("4"))
add("Yüzey Temizleyici", K2, A_GENEL, marka="Bingo", olcu="2,5", notu=NOTE_OLCU.format("2,5"))
add("Bulaşık Makinesi Tableti", K2, A_GENEL, marka="Finish", ambalaj="50'li")
add("Bulaşık Makinesi Parlatıcısı", K2, A_GENEL, marka="Finish", olcu="400", notu=NOTE_OLCU.format("400"))
add("Bulaşık Makinesi Tuzu", K2, A_GENEL, marka="Finish", olcu="Belirtilmedi")
add("Sarı Güç", K2, A_GENEL, marka="Asperox", olcu="1000 mililitre")
add("Mavi Güç", K2, A_GENEL, marka="Asperox", olcu="1000 mililitre")
add("Krem Temizleyici", K2, A_GENEL, marka="Cif", olcu="500 mililitre")
add("Krem Temizleyici", K2, A_GENEL, marka="Cif", olcu="750 mililitre")
add("Power & Shine Banyo Temizleyici", K2, A_GENEL, marka="Cif", olcu="750 mililitre")
add("Power & Shine Mutfak Temizleyici", K2, A_GENEL, marka="Cif", olcu="750 mililitre")
add("Porçöz", K2, A_GENEL, marka="Porçöz", olcu="Belirtilmedi")
add("Klozet Kapsülü", K2, A_GENEL, marka="Bred", olcu="Belirtilmedi")

# 2.3
add("Islak Mop", K2, A_SARF, marka="Ceymop")
add("Nemli Mop", K2, A_SARF, marka="Ceymop", olcu="50 santimetre")
add("Nemli Mop", K2, A_SARF, marka="Ceymop", olcu="60 santimetre")
add("Nemli Mop", K2, A_SARF, marka="Ceymop", olcu="80 santimetre")
add("Orlon Mop", K2, A_SARF, marka="Ceymop", olcu="50 santimetre")
add("Orlon Mop", K2, A_SARF, marka="Ceymop", olcu="60 santimetre")
add("Orlon Mop", K2, A_SARF, marka="Ceymop", olcu="80 santimetre")
add("Mikrofiber Cam Bezi", K2, A_SARF)
add("Mikrofiber Temizlik Bezi", K2, A_SARF)
add("Bulaşık Süngeri", K2, A_SARF)
add("Bulaşık Teli", K2, A_SARF)
add("Yer Çekme Aparatı", K2, A_SARF, malzeme="Plastik", olcu="55 santimetre")
add("Yer Çekme Aparatı", K2, A_SARF, malzeme="Plastik", olcu="75 santimetre")
add("Yer Çekme Aparatı", K2, A_SARF, malzeme="Metal", olcu="55 santimetre")
add("Yer Çekme Aparatı", K2, A_SARF, malzeme="Metal", olcu="75 santimetre")
add("Cam Çek-Sil Aparatı", K2, A_SARF, malzeme="Plastik", olcu="35 santimetre")
add("Cam Çek-Sil Aparatı", K2, A_SARF, malzeme="Plastik", olcu="45 santimetre")
add("Cam Çek-Sil Aparatı", K2, A_SARF, malzeme="Metal", olcu="35 santimetre")
add("Cam Çek-Sil Aparatı", K2, A_SARF, malzeme="Metal", olcu="45 santimetre")
add("Cam Peluşu", K2, A_SARF, olcu="35 santimetre")
add("Cam Peluşu", K2, A_SARF, olcu="45 santimetre")
add("Nitril Muayene Eldiveni", K2, A_SARF)
add("Pudralı Muayene Eldiveni", K2, A_SARF)
add("Pudrasız Muayene Eldiveni", K2, A_SARF)
add("Klozet Fırçası", K2, A_SARF, malzeme="Plastik")
add("Klozet Fırçası", K2, A_SARF, malzeme="Metal")
add("Faraşlı Süpürge", K2, A_SARF, malzeme="Gürgen")
add("Faraşlı Süpürge", K2, A_SARF, malzeme="Alüminyum")
add("Faraşlı Süpürge", K2, A_SARF, malzeme="Metal")
add("Oto Fırçası", K2, A_SARF)
add("Temizlik Seti", K2, A_SARF)
add("Temizlik Kovası", K2, A_SARF)
add("Çift Kovalı Temizlik Arabası", K2, A_SARF)

# 2.4
add("Mini Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="40 × 50 santimetre")
add("Orta Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="55 × 60 santimetre", tur="Endüstriyel")
add("Orta Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="55 × 60 santimetre", tur="Standart")
add("Büyük Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="65 × 72 santimetre", tur="Endüstriyel")
add("Büyük Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="65 × 72 santimetre", tur="Standart")
add("Battal Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="72 × 95 santimetre", tur="Endüstriyel")
add("Battal Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="72 × 95 santimetre", tur="Standart")
add("Jumbo Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="80 × 110 santimetre", tur="Endüstriyel")
add("Jumbo Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="80 × 110 santimetre", tur="Standart")
add("Konteyner Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="95 × 120 santimetre")
add("Hantal Boy Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="100 × 150 santimetre")
add("240 Litrelik Konteyner Çöp Poşeti", K2, A_COP, marka="MRP Marin", olcu="120 × 150 santimetre")

# 2.5
add("Plastik Salata Kasesi", K2, A_AT, renk="Siyah", tur="Kapaklı", ambalaj="25'li")
add("Çorba Kasesi", K2, A_AT, ambalaj="25'li")
add("Plastik Tabak", K2, A_AT, olcu="19 santimetre")
add("Plastik Tabak", K2, A_AT, olcu="21 santimetre")
add("Plastik Tabak", K2, A_AT, olcu="23 santimetre")
add("Karton Tabak", K2, A_AT, olcu="17 santimetre")
add("Karton Tabak", K2, A_AT, olcu="19 santimetre")
add("Karton Tabak", K2, A_AT, olcu="21 santimetre")
add("Plastik Çatal", K2, A_AT)
add("Plastik Kaşık", K2, A_AT)
add("Plastik Bıçak", K2, A_AT)
add("Kürdan", K2, A_AT, ambalaj="100'lü")
add("Pipet", K2, A_AT, ambalaj="100'lü")
add("Aşçı Kepçesi", K2, A_AT)
add("Şeffaf Eldiven", K2, A_AT, ambalaj="100'lü")
add("Bone", K2, A_AT, ambalaj="100'lü")
add("Kolluk", K2, A_AT, ambalaj="100'lü")
add("Alüminyum Folyo", K2, A_AT, olcu="30 × 45 santimetre")
add("Küçük Boy Buzdolabı Poşeti", K2, A_AT)
add("Orta Boy Buzdolabı Poşeti", K2, A_AT)
add("Büyük Boy Buzdolabı Poşeti", K2, A_AT)
add("Streç Film", K2, A_AT, olcu="30 × 45", notu=NOTE_STREC)
add("Pişirme Kağıdı", K2, A_AT)

# 3.1 marka boş; seçenekler alt kategoride
for ad in [
    "Z Havlu Aparatı",
    "Z Peçete Aparatı",
    "Fotoselli Havlu Aparatı",
    "İçten Çekmeli Havlu Aparatı",
]:
    add(ad, K3, A_HAP)
add("Ev Tipi Havlu Aparatı", K3, A_HAP, malzeme="Plastik")
add("Ev Tipi Havlu Aparatı", K3, A_HAP, malzeme="Metal")
add("Mini Jumbo Aparatı", K3, A_HAP)
add("Mini İçten Çekmeli Tuvalet Kağıdı Aparatı", K3, A_HAP)
add("Klozet Kapak Örtüsü Aparatı", K3, A_HAP)

# 3.2
for ad in ["Sıvı Sabun Aparatı", "Köpük Sabun Aparatı"]:
    for kap in ["500 mililitre", "1000 mililitre"]:
        for mal in ["Plastik", "Metal"]:
            add(ad, K3, A_SABUN, kapasite=kap, malzeme=mal)
add("Sensörlü Sıvı Sabun Aparatı", K3, A_SABUN)
add("Sensörlü Köpük Sabun Aparatı", K3, A_SABUN)

# 3.3
add("Pedallı Çöp Kovası", K3, A_KOVA, malzeme="Plastik")
add("Pedallı Çöp Kovası", K3, A_KOVA, malzeme="Metal")
add("Sallanır Kapaklı Çöp Kovası", K3, A_KOVA, malzeme="Plastik")
add("Sallanır Kapaklı Çöp Kovası", K3, A_KOVA, malzeme="Metal")
add("Pratik Kapaklı Çöp Kovası", K3, A_KOVA, malzeme="Plastik")
add("Pratik Kapaklı Çöp Kovası", K3, A_KOVA, malzeme="Metal")
add("Açık Ağızlı Metal Masa Altı Çöp Kovası", K3, A_KOVA, malzeme="Metal")
add("120 Litrelik Konteyner Çöp Kovası", K3, A_KOVA, kapasite="120 litre")
add("240 Litrelik Konteyner Çöp Kovası", K3, A_KOVA, kapasite="240 litre")
add("800 Litrelik Çöp Kovası", K3, A_KOVA, kapasite="800 litre", malzeme="Plastik")
add("800 Litrelik Çöp Kovası", K3, A_KOVA, kapasite="800 litre", malzeme="Metal")

assert len(rows) == 157, len(rows)
for i, row in enumerate(rows, 1):
    row["id"] = f"p-{i:03d}"
    row["sira"] = i

kategoriler = [
    {
        "id": K1,
        "ad": "Temizlik Kağıtları",
        "sira": 1,
        "altlar": [
            {"id": A_HAVLU, "ad": "Havlu ve Peçeteler", "sira": 1},
            {"id": A_ISLAK, "ad": "Islak Havlular", "sira": 2},
            {"id": A_TUVALET, "ad": "Tuvalet Kağıtları", "sira": 3},
        ],
    },
    {
        "id": K2,
        "ad": "Sıvı Temizlik Ürünleri",
        "sira": 2,
        "altlar": [
            {"id": A_END, "ad": "Endüstriyel Temizlik Ürünleri", "sira": 1},
            {"id": A_GENEL, "ad": "Genel Kullanım Temizlik Ürünleri", "sira": 2},
            {"id": A_SARF, "ad": "Temizlik Sarf Ürünleri", "sira": 3},
            {"id": A_COP, "ad": "Çöp Poşetleri", "sira": 4},
            {"id": A_AT, "ad": "Kullan At Ürünler", "sira": 5},
        ],
    },
    {
        "id": K3,
        "ad": "Aparat ve Ekipmanlar",
        "sira": 3,
        "altlar": [
            {
                "id": A_HAP,
                "ad": "Havlu Aparatları",
                "sira": 1,
                "markaSecenekleri": ["Palex", "Vialli", "Flosoft"],
            },
            {"id": A_SABUN, "ad": "Sıvı Sabun ve Köpük Sabun Aparatları", "sira": 2},
            {"id": A_KOVA, "ad": "Çöp Kovaları", "sira": 3},
        ],
    },
]

from_products = [r["marka"] for r in rows if r["marka"]]
markalar = []
for ad in from_products + ["Palex", "Vialli", "Flosoft"]:
    if ad not in markalar:
        markalar.append(ad)

catalog = {
    "version": 1,
    "kategoriler": kategoriler,
    "markalar": markalar,
    "urunler": rows,
}

out = Path(__file__).resolve().parents[1] / "public" / "yonetim" / "catalog.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"wrote {len(rows)} products -> {out}")

KAT_TO_G = {
    K1: "Hijyen",
    K2: "Temizlik",
    K3: "Aparat",
}
G_FOTO = {
    "Hijyen": "/img/products/daire-hijyen.webp",
    "Temizlik": "/img/products/daire-temizlik.webp",
    "Aparat": "/img/products/daire-aparat.webp",
}

public_urunler = []
for r in rows:
    g = KAT_TO_G[r["anaKategoriId"]]
    satir_parts = [r["ad"], r["marka"], r["olcu"], r["kapasite"], r["malzeme"], r["renk"], r["ambalajAdedi"], r["urunTuru"]]
    public_urunler.append({
        "id": r["id"],
        "ad": r["ad"],
        "kategori": g,
        "alt": r["altKategoriId"],
        "marka": r["marka"],
        "olcu": r["olcu"],
        "kapasite": r["kapasite"],
        "malzeme": r["malzeme"],
        "renk": r["renk"],
        "ambalajAdedi": r["ambalajAdedi"],
        "urunTuru": r["urunTuru"],
        "aciklama": r["aciklama"],
        "not": r["not"],
        "aktif": r["aktif"],
        "gorsel": G_FOTO[g],
        "gorselTuru": "kategori",
        "satir": " · ".join(p for p in satir_parts if p),
        "sira": r["sira"],
    })

public = {
    "gruplar": ["Hijyen", "Temizlik", "Aparat", "Kırtasiye", "Ambalaj", "Gıda", "PC"],
    "kategoriler": kategoriler,
    "urunler": public_urunler,
}
pub_out = Path(__file__).resolve().parents[1] / "public" / "katalog.json"
pub_out.write_text(json.dumps(public, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"wrote public catalog {len(public_urunler)} -> {pub_out}")
