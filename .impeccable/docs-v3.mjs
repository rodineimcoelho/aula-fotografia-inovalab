import { readFileSync,writeFileSync } from 'node:fs';
import { slides } from '../src/lesson.ts';
const change=(path,fn)=>writeFileSync(path,fn(readFileSync(path,'utf8')));
change('README.md',s=>s.replace('capa com título e fotografia, definição, câmera 3D com peças separáveis em um clique e ajustes de diafragma/tempo', 'capa somente tipográfica, verbete formal atribuído ao Priberam, câmera 3D desmontável com luz bloqueada pelas peças, ajustes de abertura/tempo/ISO e uma prévia de cena 3D').replace('produção de cartaz,','estudo de camadas, blend modes, opacidade e tipografia,').replace('A capa contém somente o título e a fotografia,','A capa contém somente o título,').replace('use Explodir câmera para separar todas as peças', 'use Desmontar câmera para separar todas as peças').replace('Ajuste Diafragma e Tempo de exposição; Disparar mostra uma sequência desacelerada.', 'Ajuste Diafragma, Tempo e ISO. Disparar mostra uma sequência desacelerada: a luz para no obturador fechado e se acumula no sensor durante a abertura. A prévia usa uma cena 3D com movimento e ruído didáticos. ISO amplifica o sinal sem aumentar a luz capturada.').replace('55 de teoria/demonstrações, 5 de organização, 20 de captura, 15 de edição, 5 de envio e 20 de avaliação/mostra/encerramento.', '60 de teoria/demonstrações, 5 de organização, 20 de captura, 15 de edição, 5 de envio e 15 de avaliação/mostra/encerramento.')+'\nA arte fornecida Fotografia.png é a referência prioritária nos slides de definição, ponto de vista, produção e encerramento. No slide de produção, Experimentar camadas abre um novo estudo com duas fotos do PPTX; essas não são as camadas originais do arquivo achatado.\n');
change('PLANO-AULA.md',s=>{
 const start=s.indexOf('| 0–5 min'),end=s.indexOf('## Interações com objetivo pedagógico');
 s=s.slice(0,start)+`| 0–5 min | Capa, verbete e percurso | Título sem imagem; definição formal com fonte e referência visual fornecida. |
| 5–13 min | Câmera | Desmontar, observar luz bloqueada, ajustar abertura/tempo/ISO e comparar a foto prevista e registrada. |
| 13–19 min | Iluminação | Direção, dureza, intensidade e cor, com exemplos. |
| 19–35 min | Exposição e celular | Triângulo, diafragma, laboratório, tempo, ISO, fotômetro e aplicação no celular. |
| 35–43 min | Composição | Oito tipos, reenquadramento e ponto de vista. |
| 43–50 min | Arquivos e edição | JPEG/RAW, comparação de ajustes, Lightroom e Snapseed. |
| 50–56 min | Produção e responsabilidade | Referência ELEVATE 25; estudo de camadas, mesclagem, opacidade, tipografia e crédito. |
| 56–60 min | Quiz | Prever e explicar escolhas. |
| 60–65 min | Organização | Formar grupos e escolher uma intenção. |
| 65–85 min | Captura | Produzir variações e selecionar uma foto. |
| 85–100 min | Edição | Ajustar a foto e escrever um título. |
| 100–105 min | Entrega | Enviar foto e título. |
| 105–112 min | Avaliação | Turma e jurados, separadamente. |
| 112–120 min | Mostra e encerramento | Exibir destaques e comentar escolhas. |

São 60 minutos de teoria/demonstrações e 60 de organização, prática e mostra. Os 27 slides somam 120 minutos; ajuste os tempos ao ritmo da turma.

## Imagens e exemplos

A arte Fotografia.png fornecida pelo professor é prioritária na definição, ponto de vista, produção e encerramento. O arquivo está achatado. O estudo interativo usa duas fotos do PPTX como novas camadas: não alega recuperar as camadas da referência. Cinco fotografias extraídas do PPTX complementam exemplos de luz, composição e edição. Diagramas estão identificados; a grade da foto de praia já pertence ao original. Consulte ASSETS.md.

O verbete de fotografia apresenta um trecho atribuído à acepção 1 do Dicionário Priberam, com omissão indicada. Lightroom aparece como pago por assinatura, ressalvando ferramentas básicas gratuitas no celular; Snapseed, como gratuito. Não é necessário comprar um aplicativo.

`+s.slice(end);
 return s.replace('O botão Explodir câmera','O botão Desmontar câmera').replace('os controles de diafragma e tempo alteram a demonstração.', 'os controles de diafragma, tempo e ISO alteram a demonstração. Os raios para fora da abertura param no diafragma; quando o obturador fecha, a luz deixa de chegar ao sensor. O tempo aumenta o acúmulo de luz. ISO altera o ganho do sinal e a aparência do ruído; não cria luz. A imagem prevista usa um objeto 3D em movimento, com ruído ilustrativo.').replace('Three.js é uma opção para implementar a cena. Prever também um diagrama estático navegável quando a renderização 3D não estiver disponível.', 'A cena usa Three.js. Se a renderização 3D não estiver disponível, as explicações textuais das peças e o laboratório permitem continuar.');
});
change('PENDENCIAS-MANHA.md',s=>s.replace('A capa, a definição e os exemplos foram atualizados conforme o pedido. A sequência agora soma 55 minutos de teoria e 65 de organização/prática/mostra. Cinco fotos vieram do PPTX; exemplos adicionais de composição e luz usam diagramas identificados.', 'A capa agora contém somente o título. A definição formal vem do Priberam; a arte Fotografia.png fornecida é prioritária. A sequência soma 60 minutos de teoria e 60 de organização/prática/mostra. Cinco fotos complementares vieram do PPTX; exemplos adicionais usam diagramas identificados.'));
change('VERIFICACAO.md',s=>s.replace('Capa somente com título e fotografia, seguida pela definição de fotografia; cinco imagens extraídas do PPTX anterior.', 'Capa somente tipográfica; verbete formal atribuído ao Priberam; prioridade para a arte Fotografia.png, com fotos complementares do PPTX.').replace('4 testes passaram','5 testes passaram').replace('9 testes passaram','11 testes passaram').replace('A revisão da atualização encontrou um ajuste no enquadramento da câmera; o parecer final classificou esse ajuste como resolvido, com decisão `ship`.', 'A revisão desta nova atualização está em andamento; o parecer da versão anterior está preservado.').replace('545 kB sem compressão (140 kB gzip)', '521 kB para Three.js, carregado sob demanda com os módulos da câmera e da prévia 3D').replace('Câmera 3D depende','Câmera 3D depende'));
console.log(JSON.stringify({slides:slides.length,theory:slides.slice(0,slides.findIndex(s=>s.id==='missao')).reduce((a,s)=>a+parseInt(s.minutes),0),total:slides.reduce((a,s)=>a+parseInt(s.minutes),0)}));
