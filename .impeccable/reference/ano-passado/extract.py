"""Read-only PPTX extraction using standard ZIP/XML; original media copied verbatim."""
from pathlib import Path
import zipfile, xml.etree.ElementTree as ET, json, hashlib, re, posixpath

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
SOURCE = ROOT / 'aula-ano-passado.pptx'
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
RNS = '{http://schemas.openxmlformats.org/package/2006/relationships}'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'media').mkdir(exist_ok=True)

with zipfile.ZipFile(SOURCE) as archive:
    media = []
    for name in archive.namelist():
        if name.startswith('ppt/media/') and not name.endswith('/'):
            data = archive.read(name)
            target = OUT / 'media' / Path(name).name
            target.write_bytes(data)
            media.append({'part': name, 'extracted_path': str(target.relative_to(ROOT)).replace('\\', '/'),
                          'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'slides': []})
    by_part = {row['part']: row for row in media}
    slides = []
    slide_names = sorted([n for n in archive.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)],
                         key=lambda n: int(re.search(r'(\d+)\.xml$', n).group(1)))
    for number, name in enumerate(slide_names, 1):
        tree = ET.fromstring(archive.read(name))
        paragraphs = [''.join(t.text or '' for t in p.findall('.//a:t', NS)) for p in tree.findall('.//a:p', NS)]
        paragraphs = [p for p in paragraphs if p.strip()]
        rel_name = posixpath.join(posixpath.dirname(name), '_rels', posixpath.basename(name) + '.rels')
        relationships = []
        if rel_name in archive.namelist():
            for rel in ET.fromstring(archive.read(rel_name)):
                target = rel.get('Target', '')
                part = posixpath.normpath(posixpath.join(posixpath.dirname(name), target))
                row = {'id': rel.get('Id'), 'type': rel.get('Type', '').split('/')[-1],
                       'target': target, 'resolved_part': part, 'external': rel.get('TargetMode') == 'External'}
                relationships.append(row)
                if part in by_part:
                    by_part[part]['slides'].append(number)
        images = []
        rel_by_id = {r['id']: r for r in relationships}
        for blip in tree.findall('.//a:blip', NS):
            rid = blip.get('{'+NS['r']+'}embed') or blip.get('{'+NS['r']+'}link')
            images.append({'relationship_id': rid, 'part': rel_by_id.get(rid, {}).get('resolved_part')})
        slides.append({'slide': number, 'part': name, 'text': paragraphs, 'images': images, 'relationships': relationships})
    result = {'source': SOURCE.name, 'source_bytes': SOURCE.stat().st_size,
              'source_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
              'slides': slides, 'media': media}
    (OUT / 'inventory.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUT / 'slide-text.txt').write_text('\n\n'.join('SLIDE '+str(s['slide'])+'\n'+'\n'.join(s['text'])+'\nMEDIA: '+', '.join(i['part'] or '?' for i in s['images']) for s in slides), encoding='utf-8')
    print(json.dumps({'slides': len(slides), 'media': len(media), 'extensions': sorted(set(Path(m['part']).suffix for m in media)),
                      'slide_summary': [{'slide':s['slide'],'title':s['text'][0] if s['text'] else '', 'media':[i['part'] for i in s['images']]} for s in slides]}, ensure_ascii=False, indent=2))
