import asyncio
from pathlib import Path

import pymupdf
from winrt.windows.graphics.imaging import BitmapDecoder
from winrt.windows.media.ocr import OcrEngine
from winrt.windows.storage.streams import DataWriter, InMemoryRandomAccessStream

TABLE = {"y0": 0.33, "y1": 0.88}
COLS = {
    "ad": (0.03, 0.46),
    "miktar": (0.46, 0.52),
    "bf": (0.52, 0.63),
    "toplam": (0.78, 0.97),
}


async def ocr_png(data):
    stream = InMemoryRandomAccessStream()
    w = DataWriter(stream)
    w.write_bytes(data)
    await w.store_async()
    stream.seek(0)
    dec = await BitmapDecoder.create_async(stream)
    bmp = await dec.get_software_bitmap_async()
    eng = OcrEngine.try_create_from_user_profile_languages()
    return (await eng.recognize_async(bmp)).text


def crop(page, x0r, x1r, zoom=3):
    rect = page.rect
    clip = pymupdf.Rect(rect.width * x0r, rect.height * TABLE["y0"], rect.width * x1r, rect.height * TABLE["y1"])
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip, alpha=False)
    return pix.tobytes("png")


pdf = next(Path(r"C:\tedarik\tmp-invoices").glob("OF72026000000014*.pdf"))
doc = pymupdf.open(pdf)
page = doc[0]
for name, cols in COLS.items():
    text = asyncio.run(ocr_png(crop(page, *cols)))
    print(f"=== {name} ===")
    print(text)
    print()
doc.close()
