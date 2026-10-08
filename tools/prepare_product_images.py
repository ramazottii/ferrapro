from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parent.parent
out=root/'public/img/products';out.mkdir(exist_ok=True)
paths=json.loads((root/'tools/generated-image-paths.local.json').read_text(encoding='utf-8-sig'))
existing={'a4':'th-a4','bant':'th-bant','buz':'th-buz','dosya':'th-dosya','kalem':'th-kalem','kasa':'th-kasa','kese':'th-kese','klasor':'th-klasor','klavye':'th-klavye','kraft':'th-kraft','mouse':'th-mouse','not':'th-not','pil':'th-pil','power':'th-power','strec':'th-strec','toner':'th-toner','usb':'th-usb','zimba':'th-zimba','bardak':'ico-bardak','cop':'ico-cop','fotosel':'ico-fotosel','jumbo':'ico-jumbo','masa':'ico-klinik','pecete':'ico-pecete','tuvalet':'ico-tuvalet','zkat':'ico-zhavlu'}
for key,name in existing.items():paths[key]=str(root/'public/img'/f'{name}.png')
for key,source in paths.items():
 dest=out/f'{key}.webp'
 if dest.exists():continue
 im=Image.open(source).convert('RGB');im.thumbnail((640,640));im.save(dest,'WEBP',quality=84)
print('Web images:',len(list(out.glob('*.webp'))))
# A local-only inspection page; never ship this file.
(root/'public/image-check.html').write_text('<html><head><meta name="robots" content="noindex"><style>body{font:14px sans-serif;display:grid;grid-template-columns:repeat(6,1fr);gap:12px}img{width:100%}figure{margin:0}</style></head><body>'+''.join(f'<figure><img src="/img/products/{p.name}"><figcaption>{p.stem}</figcaption></figure>' for p in sorted(out.glob('*.webp'))),encoding='utf-8')
