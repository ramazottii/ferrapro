#!/usr/bin/env python3
"""Swissmed Ofispanda e-fatura PDF'lerinden ürün + alış fiyatı çıkarır."""
from __future__ import annotations

import asyncio
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
INVOICE_DIR = ROOT / "tmp-invoices"
OUT_JSON = ROOT / "scripts" / "swissmed_extracted.json"
OUT_JS = ROOT / "src" / "swissmed_urunler.js"

PRICE_RE = re.compile(r"(\d{1,3}(?:\.\d{3})*,\d{2})\s*TL?", re.I)
FIRST_PRODUCT_RE = re.compile(
    r"DO[ĞG]U[ŞS]|ÜNAL|UNAL|ARO |METRO |YUMURTA|İÇİM|ICIM|KA[ĞG]IT|HAVLU|TUVALET|A4 |TÜKENMEZ|TUKENMEZ|DETERJAN|SABUN|ELDİVEN|MASKE|ÇAY|CAY |KAHVE|POŞET|POS ET|STREÇ|FOLYO|PLASTIK|KARTON|CAPPY|SIRMAKEŞ|PINAR|SÜTAŞ|NESTLE|FAMILIA|SELPAK|DOMESTOS|PRİLL|PRILL|FELLOWES|NITRIL|COLGATE|JOHNSON",
    re.I,
)


def parse_tr_money(s: str) -> float:
    s = s.strip().replace(" ", "").replace("TL", "")
    if "," in s:
        s = s.replace(".", "").replace(",", ".")
    return float(s)


async def _ocr_winrt_png(png_bytes: bytes) -> str:
    from winrt.windows.graphics.imaging import BitmapDecoder
    from winrt.windows.media.ocr import OcrEngine
    from winrt.windows.storage.streams import DataWriter, InMemoryRandomAccessStream

    stream = InMemoryRandomAccessStream()
    w = DataWriter(stream)
    w.write_bytes(png_bytes)
    await w.store_async()
    stream.seek(0)
    dec = await BitmapDecoder.create_async(stream)
    bmp = await dec.get_software_bitmap_async()
    eng = OcrEngine.try_create_from_user_profile_languages()
    if eng is None:
        raise RuntimeError("Windows OCR kullanılamıyor")
    r = await eng.recognize_async(bmp)
    return r.text or ""


def ocr_page(page: pymupdf.Page, zoom: float = 2.8) -> str:
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    return asyncio.run(_ocr_winrt_png(pix.tobytes("png")))


def split_product_names(block: str) -> list[str]:
    """Marka/ürün adları genelde BÜYÜK harfle başlar — buna göre böl."""
    block = re.sub(r"\s+", " ", block).strip()
    # Bilinen marka kalıpları ile böl
    parts = re.split(
        r"(?=(?:DOĞUŞ|DOGUŞ|ÜNAL|UNAL|ARO |METRO |DANET|ÖZLEM|OZLEM|TEREMYAĞ|TEREMYAG|YUMURTA|İÇİM|ICIM|SIRMAKEŞ|SIRMAKES|CAPPY|NUTella|ETI |ULKER|PINAR|SÜTAŞ|SUTAS|LİN|LIN |FİLİZ|FILIZ|MEHMET|EKER|BİLLUR|BILLUR|NESTLE|LURPAK|JACOBS|TURK|TEK|KENT|COCA|FANTA|SPRITE|DİMES|DIMES|MEY|DURU|REİS|REIS|CALVE|KNORR|MAGGI|TAMEK|KOMILI|KOMİLİ|TAT |TAT\.|BALON|PALMOLIVE|FLOREAL|SELpak|SELPAK|SOLO|FAMILIA|JUMBO|MAYLO|MAY|LUX|DOVE|COLGATE|ORAL|JOHNSON|NIVEA|HUGGIES|PRİLL|PRILL|DOMESTOS|ACE |CLOROX|MR\.|CIF |VILEDA|SCOTCH|FELLOWES|DAİLY|DAILY|DELTA|KARTON|PLASTIK|KAĞIT|KAGIT|HAVLU|TUVALET|PEÇETE|PECETE|DETERJAN|SABUN|ELDİVEN|ELDIVEN|MASKE|ALKOL|ÇAY|CAY |KAHVE|FILTRE|POSET|POŞET|STREÇ|STREC|FOLYO|BULAŞIK|BULASIK|CAM |YÜZEY|YUZEY|GENEL|ÇÖP|COP |TORBA|KOVA|MOP|PASPAS|BEZ|SPREY|DEZENFEKTAN|EL\s))",
        block,
        flags=re.I,
    )
    names = []
    for p in parts:
        p = p.strip(" ,;.")
        p = re.sub(r"^\d+\s+", "", p)
        if len(p) >= 5 and not re.fullmatch(r"[\d\s.,TL]+", p, re.I):
            names.append(p)
    if not names:
        # yedek: 2+ kelime blokları
        names = [x.strip() for x in re.split(r"\s{2,}|\d{1,2}\s+(?=[A-ZÇĞİÖŞÜ])", block) if len(x.strip()) >= 5]
    return names


def extract_from_text(text: str, fatura: str) -> list[dict]:
    text = re.sub(r"\s+", " ", text.replace("\n", " ")).strip()
    names: list[str] = []
    qtys: list[float] = []
    prices: list[float] = []

    if re.search(r"Birim\s*fiyat", text, re.I):
        pre = re.split(r"Birim\s*fiyat", text, maxsplit=1, flags=re.I)[0]
        small_nums = [int(x) for x in re.findall(r"\b(\d{1,3})\b", pre) if 1 <= int(x) <= 500]

        chunk = re.split(r"Birim\s*fiyat", text, maxsplit=1, flags=re.I)[1]
        for stop in ("Hizmet", "Say"):
            if stop in chunk:
                chunk = chunk.split(stop)[0]
                break
        prices = [parse_tr_money(m.group(1)) for m in PRICE_RE.finditer(chunk)]
        if prices and small_nums:
            qtys = [float(x) for x in small_nums[-len(prices) :]]

    i0 = FIRST_PRODUCT_RE.search(text)
    i1 = re.search(r"KDV\s*Oran", text, re.I)
    if i0 and i1 and i1.start() > i0.start():
        names = split_product_names(text[i0.start() : i1.start()])

    if not names or not prices:
        return []

    n = min(len(names), len(prices))
    if not qtys:
        qtys = [1.0] * n
    else:
        qtys = qtys[:n] + [1.0] * max(0, n - len(qtys))

    return [
        {"ad": names[i], "miktar": qtys[i], "birim_fiyat": prices[i], "fatura": fatura}
        for i in range(n)
    ]


def extract_pdf(path: Path) -> list[dict]:
    doc = pymupdf.open(path)
    try:
        inv = path.stem.split("_")[0]
        text = ocr_page(doc[0])
        items = extract_from_text(text, inv)
        if len(doc) > 1 and len(items) < 3:
            text += " " + ocr_page(doc[1])
            items = extract_from_text(text, inv)
        return items
    finally:
        doc.close()


def guess_kategori(ad: str) -> str:
    t = ad.upper()
    if any(k in t for k in ("SÜT", "PEYN", "YUMURTA", "SUCUK", "KAŞAR", "LABNE", "MARGAR", "TEREYA", "FÜME", "TOST", "HİNDİ", "DANA", "SU ", "CAPPY", "COLA", "ÇAY", "KAHVE", "SIRMAKE")):
        return "Mutfak"
    if any(k in t for k in ("KAĞIT", "HAVLU", "TUVALET", "PEÇETE", "MENDIL", "SELPAK", "FAMILIA", "JUMBO")):
        return "Hijyen"
    if any(k in t for k in ("DETERJAN", "SABUN", "TEMİZ", "DEZENFEKTAN", "DOMESTOS", "PRIL", "ACE ", "CIF ")):
        return "Temizlik"
    if any(k in t for k in ("ELDİVEN", "MASKE", "ALKOL", "NITRIL")):
        return "Klinik"
    if any(k in t for k in ("A4", "KALEM", "DOSYA", "KLASÖR", "ZIMBA", "TONER")):
        return "Kağıt" if "A4" in t else "Kırtasiye"
    return "Swissmed"


def dedupe_products(rows: list[dict]) -> list[dict]:
    by_ad: dict[str, dict] = {}
    counts: dict[str, int] = defaultdict(int)
    for r in rows:
        key = re.sub(r"\s+", " ", r["ad"].upper().strip())
        counts[key] += 1
        by_ad[key] = {
            "ad": r["ad"].strip(),
            "kategori": guess_kategori(r["ad"]),
            "alis": round(r["birim_fiyat"], 2),
            "fatura_sayisi": counts[key],
            "son_fatura": r.get("fatura"),
        }
    for k, v in by_ad.items():
        v["fatura_sayisi"] = counts[k]
    return sorted(by_ad.values(), key=lambda x: (x["kategori"], x["ad"]))


def write_js(products: list[dict]) -> None:
    body = json.dumps(products, ensure_ascii=False, indent=2)
    OUT_JS.write_text(
        "\n".join(
            [
                "/** Swissmed Ofispanda faturalarından OCR ile çıkarılan ürünler — otomatik üretim */",
                "export const SWISSMED_CATALOG_VERSION = 1;",
                "",
                "export function swissmedUrunler() {",
                f"  const rows = {body};",
                "  return rows.map((p, i) => ({",
                "    id: 10000 + i + 1,",
                "    kategori: p.kategori,",
                "    ad: p.ad,",
                '    ebat: "—",',
                '    birim: "adet",',
                "    stok: 0,",
                "    alis: p.alis,",
                "    satis: null,",
                "    aktif: true,",
                '    kaynak: "swissmed_fatura",',
                "    fatura_sayisi: p.fatura_sayisi ?? 1,",
                "  }));",
                "}",
                "",
            ]
        ),
        encoding="utf-8",
    )


def main() -> int:
    pdfs = sorted(INVOICE_DIR.glob("*.pdf"))
    if not pdfs:
        print(f"PDF bulunamadı: {INVOICE_DIR}", file=sys.stderr)
        return 1

    all_rows: list[dict] = []
    for i, pdf in enumerate(pdfs, 1):
        print(f"[{i}/{len(pdfs)}] {pdf.name}", flush=True)
        try:
            rows = extract_pdf(pdf)
            print(f"  -> {len(rows)} kalem", flush=True)
            all_rows.extend(rows)
        except Exception as exc:
            print(f"  !! HATA: {exc}", file=sys.stderr)

    products = dedupe_products(all_rows)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(
        json.dumps({"raw_count": len(all_rows), "unique": len(products), "products": products}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_js(products)
    print(f"\nToplam {len(all_rows)} satır, {len(products)} benzersiz ürün")
    print(f"JSON: {OUT_JSON}")
    print(f"JS:   {OUT_JS}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
