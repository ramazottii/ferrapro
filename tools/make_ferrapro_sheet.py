from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path(r"C:\tedarik\public\logo")
items = [
    ("A", "ferrapro-lockup.png"),
    ("B", "ferrapro-yazi.png"),
    ("C", "ferrapro-kare.png"),
    ("D", "ferrapro-fayans.png"),
    ("E", "ferrapro-muhur.png"),
    ("F", "ferrapro-istif.png"),
    ("G", "ferrapro-camel.png"),
    ("H", "ferrapro-pro-kucuk.png"),
    ("I", "ferrapro-koyu.png"),
    ("J", "ferrapro-tek-renk.png"),
    ("K", "ferrapro-ince.png"),
    ("L", "ferrapro-masthead.png"),
]
font = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 36)
W = 1400
pad = 24
cell_h = 280
cap_h = 48
bg = (232, 228, 219)
paper = (250, 248, 243)
ink = (28, 31, 29)
out_h = pad + (cell_h + cap_h + 16) * len(items) + pad
canvas = Image.new("RGB", (W, out_h), bg)
draw = ImageDraw.Draw(canvas)
y = pad
for letter, name in items:
    img = Image.open(root / name).convert("RGB")
    box_w = W - pad * 2
    box = Image.new("RGB", (box_w, cell_h), paper)
    iw, ih = img.size
    scale = min((box_w - 40) / iw, (cell_h - 24) / ih)
    nw, nh = max(1, int(iw * scale)), max(1, int(ih * scale))
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    box.paste(img, ((box_w - nw) // 2, (cell_h - nh) // 2))
    canvas.paste(box, (pad, y))
    draw.text((pad, y + cell_h + 8), f"{letter}  {name.replace('.png', '')}", font=font, fill=ink)
    y += cell_h + cap_h + 16

out1 = root / "ferrapro-secenekler.png"
out2 = Path(r"C:\Users\swsyn\.cursor\projects\c-tedarik\assets\ferrapro-secenekler.png")
canvas.save(out1, "PNG")
canvas.save(out2, "PNG")
print(canvas.size, out1)
