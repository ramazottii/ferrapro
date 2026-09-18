import asyncio
from pathlib import Path

import pymupdf
from winrt.windows.graphics.imaging import BitmapDecoder
from winrt.windows.media.ocr import OcrEngine
from winrt.windows.storage.streams import DataWriter, InMemoryRandomAccessStream


async def ocr_png(data: bytes) -> str:
    stream = InMemoryRandomAccessStream()
    w = DataWriter(stream)
    w.write_bytes(data)
    await w.store_async()
    stream.seek(0)
    dec = await BitmapDecoder.create_async(stream)
    bmp = await dec.get_software_bitmap_async()
    eng = OcrEngine.try_create_from_user_profile_languages()
    r = await eng.recognize_async(bmp)
    return r.text or ""


pdf = next(Path(r"C:\tedarik\tmp-invoices").glob("OF72026000000014*.pdf"))
doc = pymupdf.open(pdf)
pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(2.5, 2.5), alpha=False)
text = asyncio.run(ocr_png(pix.tobytes("png")))
print(text)
doc.close()
