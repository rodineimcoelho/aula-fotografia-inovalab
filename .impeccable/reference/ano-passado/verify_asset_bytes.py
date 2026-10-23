from pathlib import Path
import json, hashlib
BASE = Path(__file__).resolve().parent
ROOT = BASE.parents[2]
manifest = json.loads((BASE / 'inventory.json').read_text(encoding='utf-8'))
results = []
for item in manifest['selected_assets']:
    original = (BASE / 'media' / Path(item['part']).name).read_bytes()
    public = (ROOT / item['public_path']).read_bytes()
    if public[:2] == b'\xff\xd8':
        assert public[2:4] == b'\xff\xfe'
        size = int.from_bytes(public[4:6], 'big')
        assert public[6:6+size-2].startswith(b'impeccable:prompt\0')
        stripped = public[:2] + public[4+size:]
    elif public[:8] == b'\x89PNG\r\n\x1a\n':
        stripped, index = public[:8], 8
        while index < len(public):
            size = int.from_bytes(public[index:index+4], 'big')
            kind = public[index+4:index+8]
            data = public[index+8:index+8+size]
            chunk = public[index:index+size+12]
            if not (kind == b'tEXt' and data.startswith(b'impeccable:prompt\0')):
                stripped += chunk
            index += size+12
    else:
        raise ValueError('Unexpected format')
    assert stripped == original, item['file']+' changed beyond provenance metadata'
    results.append({'path':item['public_path'], 'public_bytes':len(public), 'original_bytes':len(original),
                    'original_sha256':hashlib.sha256(original).hexdigest(),
                    'verified_original_bytes_unchanged_except_added_provenance':True})
assert hashlib.sha256((ROOT / manifest['source']).read_bytes()).hexdigest() == manifest['source_sha256']
(BASE / 'verification.json').write_text(json.dumps({'source_unchanged':True,'assets':results}, indent=2),encoding='utf-8')
print(json.dumps({'source_unchanged':True, 'verified_assets':len(results)}, indent=2))
