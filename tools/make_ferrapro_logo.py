"""FerraPro lockup: option-5 FR mark + FERRA/PRO word, equal cap height."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

TEAL = (30, 107, 92)
CHAR = (28, 31, 29)
CREAM = (245, 241, 232)

ROOT = Path(r"C:\tedarik")
MARK_SRC = ROOT / "public" / "logo" / "ferra-fr-monogram.png"
OUT_PUBLIC = ROOT / "public" / "logo" / "ferrapro-lockup.png"
OUT_ASSETS = Path(r"C:\Users\swsyn\.cursor\projects\c-tedarik\assets\ferrapro-lockup.png")
FONT = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def glyph_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    px = im.load()
    w, h = im.size
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y][:3]
            if r < 200 or g < 200 or b < 200:
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    return minx, miny, maxx + 1, maxy + 1


def main() -> None:
    src = Image.open(MARK_SRC).convert("RGBA")
    box = glyph_bbox(src)
    mark = src.crop(box)

    font_size = 220
    font = ImageFont.truetype(str(FONT), font_size)
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    fer_box = probe.textbbox((0, 0), "FER", font=font)
    ra_box = probe.textbbox((0, 0), "RA", font=font)
    pro_box = probe.textbbox((0, 0), "PRO", font=font)
    cap_h = fer_box[3] - fer_box[1]
    text_w = (fer_box[2] - fer_box[0]) + (ra_box[2] - ra_box[0]) + (pro_box[2] - pro_box[0])

    mark_h = cap_h
    ratio = mark_h / mark.size[1]
    mark_w = max(1, round(mark.size[0] * ratio))
    mark = mark.resize((mark_w, mark_h), Image.Resampling.LANCZOS)

    gap = round(cap_h * 0.28)
    pad_x = round(cap_h * 1.15)
    pad_y = round(cap_h * 1.05)
    canvas_w = pad_x * 2 + mark_w + gap + text_w
    canvas_h = pad_y * 2 + cap_h

    canvas = Image.new("RGB", (canvas_w, canvas_h), CREAM)
    draw = ImageDraw.Draw(canvas)

    mark_x = pad_x
    mark_y = pad_y
    canvas.paste(mark, (mark_x, mark_y), mark)

    text_x = mark_x + mark_w + gap
    text_y = pad_y - fer_box[1]
    x = text_x
    draw.text((x, text_y), "FER", font=font, fill=CHAR)
    x += fer_box[2] - fer_box[0]
    draw.text((x, text_y), "RA", font=font, fill=TEAL)
    x += ra_box[2] - ra_box[0]
    draw.text((x, text_y), "PRO", font=font, fill=CHAR)

    OUT_PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    OUT_ASSETS.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT_PUBLIC, "PNG")
    canvas.save(OUT_ASSETS, "PNG")
    print(canvas.size, OUT_PUBLIC)


if __name__ == "__main__":
    main()
