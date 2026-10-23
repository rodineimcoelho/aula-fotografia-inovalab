from pathlib import Path
import json, shutil
BASE = Path(__file__).resolve().parent
ROOT = BASE.parents[2]
DEST = ROOT / 'public/assets/aula-passada'
DEST.mkdir(parents=True, exist_ok=True)
selection = [
 {'part':'ppt/media/image4.jpeg','file':'capa-guitarrista.jpg','slide':4,'width':1600,'height':2000,
  'uses':['capa','retrato em ambiente','luz artificial de palco','separação do fundo'],
  'notes':'Fotografia limpa. Rosto em perfil, corpo à esquerda e holofote visível à direita. Boa capa e cena para simulação didática de exposição. Não comprova ISO, abertura ou velocidade reais. A luz no rosto é mista; evitar chamar de luz frontal ou lateral pura.'},
 {'part':'ppt/media/image5.jpeg','file':'contraluz-palco.jpg','slide':5,'width':1600,'height':2000,
  'uses':['contraluz artificial','sujeito no terço direito','espaço à esquerda','ponto de vista por trás'],
  'notes':'Fotografia limpa. Músico visto por trás e fonte luminosa no fundo. Rosto não visível. Não é exemplo de simetria nem demonstra iluminação de três pontos.'},
 {'part':'ppt/media/image12.jpeg','file':'longa-exposicao-big-ben.jpg','slide':13,'width':1402,'height':2103,
  'uses':['longa exposição','rastros de luz','linhas diagonais que conduzem o olhar'],
  'notes':'Fotografia limpa. Torre reconhecível e rastros diagonais coloridos. Exemplo de movimento acumulado durante a exposição; não atribuir tempo de obturador exato.'},
 {'part':'ppt/media/image13.jpeg','file':'longa-exposicao-parque.jpg','slide':13,'width':1296,'height':1823,
  'uses':['longa exposição','movimento circular','luz artificial','contraste entre luz e fundo escuro'],
  'notes':'Fotografia limpa de brinquedo de parque em movimento. Rastros curvos claros. Não é um exemplo rigoroso de simetria; não atribuir configurações de captura.'},
 {'part':'ppt/media/image19.png','file':'composicao-tercos.png','slide':20,'width':1420,'height':950,
  'uses':['regra dos terços','espaço negativo','silhueta em contraluz natural','horizonte no terço inferior'],
  'notes':'Fotografia com grade branca incorporada aos pixels do arquivo original. Não desenhar segunda grade sobre ela. Pessoa alinhada aproximadamente ao terço direito, horizonte junto ao terço inferior. A grade não pode ser removida sem editar a imagem.'}
]
inventory = json.loads((BASE / 'inventory.json').read_text(encoding='utf-8'))
for item in selection:
    src = BASE / 'media' / Path(item['part']).name
    target = DEST / item['file']
    shutil.copyfile(src, target)
    item['public_path'] = 'public/assets/aula-passada/'+item['file']
    item['url'] = '/assets/aula-passada/'+item['file']
    item['origin'] = 'User-provided aula-ano-passado.pptx'
    item['generation'] = 'No AI generation'
    item['transforms'] = 'None. Original compressed image bytes, with provenance metadata added after copying.'
    item['copyright'] = 'No new license inferred. Rights and credit remain with original authors; supplied PPTX does not identify every photographer.'
inventory['selected_assets'] = selection
inventory['limitations'] = [
 'Only four clean standalone photos plus one photograph with an embedded thirds grid are present.',
 'Images16-18 are composition reference drawings; images20-24 are lighting renders, diagrams, or equipment images, not documentary photo examples.',
 'Image3 is a branded poster/collage, images14-15 are ISO comparison graphics, and images27-28 are QR codes.',
 'No source photo unambiguously demonstrates pure frontal light, pure side light, soft light, symmetry, framing, or repetition. Use additional real photos or clearly labeled semantic demonstrations for those topics.',
 'Camera settings were not inferred from appearance. Original PPTX was not changed.'
]
(BASE / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf-8')
(BASE / 'selected-assets.json').write_text(json.dumps(selection, ensure_ascii=False, indent=2), encoding='utf-8')
print('\n'.join(item['public_path'] for item in selection))
