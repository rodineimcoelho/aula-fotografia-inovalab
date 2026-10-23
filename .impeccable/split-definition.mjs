import {readFileSync,writeFileSync} from 'node:fs';
for(const path of ['README.md','PLANO-AULA.md','VERIFICACAO.md']){
 let text=readFileSync(path,'utf8').replaceAll('27 slides','28 slides');
 if(path==='README.md')text=text.replace('verbete formal atribuído ao Priberam,','verbete formal atribuído ao Priberam em um slide próprio, foto de referência no slide seguinte,');
 if(path==='PLANO-AULA.md')text=text.replace('definição formal com fonte e referência visual fornecida.','definição formal com fonte em um slide, referência visual no seguinte.');
 writeFileSync(path,text);
}
const path='.impeccable/surfaces/index-html.md';let text=readFileSync(path,'utf8').replace('O segundo slide traz um verbete formal, trecho atribuído ao Dicionário Priberam, com a arte fornecida Fotografia.png como referência visual.','O segundo slide traz somente o verbete formal, trecho atribuído ao Dicionário Priberam. O terceiro traz a arte fornecida Fotografia.png, isolada, sem título ou legenda sobre a imagem.');writeFileSync(path,text);
const product='PRODUCT.md';text=readFileSync(product,'utf8').replace('verbete formal de fotografia, com fonte, no slide seguinte.', 'verbete formal de fotografia, com fonte, no slide seguinte; a imagem de referência vem isolada no terceiro slide.');writeFileSync(product,text);
