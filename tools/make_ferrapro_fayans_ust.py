from pathlib import Path

from PIL import Image

CREAM = (245, 241, 232)
ROOT = Path(r"C:\tedarik\public\logo")
TILE_SRC = ROOT / "ferrapro-fayans.png"
WORD_SRC = ROOT / "ferrapro-yazi.png"
OUT = ROOT / "ferrapro-fayans-ust.png"
OUT_ASSETS = Path(r"C:\Users\swsyn\.cursor\projects\c-tedarik\assets\ferrapro-fayans-ust.png")


def flatten_cream(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > 210 and g > 205 and b > 190:
                px[x, y] = (0, 0, 0, 0)
    return im


def glyph_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    px = im.load()
    w, h = im.size
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 20:
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    return minx, miny, maxx + 1, maxy + 1


tile = flatten_cream(Image.open(TILE_SRC)).crop(glyph_bbox(flatten_cream(Image.open(TILE_SRC))))
word = flatten_cream(Image.open(WORD_SRC)).crop(glyph_bbox(flatten_cream(Image.open(WORD_SRC))))

# Tile width ~ 42% of word so the stacked lockup feels balanced
tile_w = max(1, round(word.size[0] * 0.42))
ratio = tile_w / tile.size[0]
tile = tile.resize((tile_w, max(1, round(tile.size[1] * ratio))), Image.Resampling.LANCZOS)

gap = round(tile.size[1] * 0.18)
pad_x = round(word.size[0] * 0.18)
pad_y = round(tile.size[1] * 0.28)
cw = pad_x * 2 + max(tile.size[0], word.size[0])
ch = pad_y * 2 + tile.size[1] + gap + word.size[1]
canvas = Image.new("RGB", (cw, ch), CREAM)
tile_x = (cw - tile.size[0]) // 2
word_x = (cw - word.size[0]) // 2
canvas.paste(tile, (tile_x, pad_y), tile)
canvas.paste(word, (word_x, pad_y + tile.size[1] + gap), word)
canvas.save(OUT, "PNG")
canvas.save(OUT_ASSETS, "PNG")
print(canvas.size, OUT)
