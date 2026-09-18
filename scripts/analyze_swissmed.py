import json
from collections import Counter, defaultdict
from pathlib import Path

data = json.loads(Path(r"C:\tedarik\scripts\swissmed_extracted.json").read_text(encoding="utf-8"))
products = data["products"]

by_cat = Counter(p["kategori"] for p in products)
print("=== KATEGORI ===")
for k, v in by_cat.most_common():
    print(f"{k}: {v}")

print("\n=== EN COK FATURADA GECEN (top 15) ===")
for p in sorted(products, key=lambda x: (-x.get("fatura_sayisi", 1), -x["alis"]))[:15]:
    fs = p.get("fatura_sayisi", 1)
    print(f"{fs}x | {p['alis']:.2f} TL | {p['ad'][:75]}")

spend = defaultdict(float)
for p in products:
    spend[p["kategori"]] += p["alis"] * p.get("fatura_sayisi", 1)
print("\n=== KATEGORI AGIRLIK (birim x fatura_sayisi) ===")
for k, v in sorted(spend.items(), key=lambda x: -x[1]):
    print(f"{k}: {v:,.0f} TL")

# fiyat araliklari
prices = [p["alis"] for p in products]
print(f"\nFiyat: min {min(prices):.2f} | ort {sum(prices)/len(prices):.2f} | max {max(prices):.2f} TL")
print(f"Toplam benzersiz: {len(products)}, ham satir: {data['raw_count']}")
