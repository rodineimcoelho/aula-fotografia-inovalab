"""Internal QA thumbnails only. Does not alter extracted source media."""
from pathlib import Path
import sys, json, math
BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE / '.tools'))
from PIL import Image, ImageOps, ImageDraw

inventory = json.loads((BASE / 'inventory.json').read_text(encoding='utf-8'))
rows = []
for item in inventory['media']:
    path = BASE / 'media' / Path(item['part']).name
    try:
        with Image.open(path) as source:
            item['width'], item['height'] = source.size
            item['format'] = source.format
            item['metadata_keys'] = list(source.info.keys())
            image = ImageOps.exif_transpose(source).convert('RGB')
            image.thumbnail((370, 245))
            rows.append((item, image.copy()))
    except Exception as error:
        item['inspection_note'] = str(error)
(BASE / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
for offset in range(0, len(rows), 12):
    group = rows[offset:offset+12]
    sheet = Image.new('RGB', (1600, math.ceil(len(group)/4)*320), '#242424')
    draw = ImageDraw.Draw(sheet)
    for index, (item, image) in enumerate(group):
        x, y = (index % 4)*400, (index // 4)*320
        sheet.paste(image, (x+(400-image.width)//2, y+10+(245-image.height)//2))
        draw.text((x+12,y+263), Path(item['part']).name+'  '+str(item['width'])+'x'+str(item['height']), fill='white')
        draw.text((x+12,y+284), 'Slides: '+','.join(map(str,item['slides'])), fill='white')
    target = BASE / ('contact-sheet-'+str(offset//12+1)+'.jpg')
    sheet.save(target, quality=90)
    print(target)
