import { readFileSync, writeFileSync } from 'node:fs';
let plan=readFileSync('PLANO-AULA.md','utf8');
plan=plan.replace('Proposta inicial para discussão. O contexto confirmado está em `PRODUCT.md`; tempos, regras, soluções técnicas e atividades abaixo são recomendações, ainda não decisões aprovadas.','Roteiro implementado na apresentação. Os tempos são flexíveis; as decisões operacionais ainda em aberto estão em `PENDENCIAS-MANHA.md`.');
const begin=plan.indexOf('| 0–5 min');const end=plan.indexOf('## Interações com objetivo pedagógico');
plan=plan.slice(0,begin)+`| 0–5 min | Capa, definição e percurso | Título e fotografia; em seguida, o registro da luz em sensor ou filme. |
| 5–11 min | Câmera | Abrir todas as peças de uma vez; ajustar diafragma e tempo; disparar e acompanhar o caminho da luz. |
| 11–17 min | Iluminação | Direção, dureza, intensidade e cor; exemplos reais e diagramas identificados. |
| 17–33 min | Exposição e celular | Triângulo, diafragma, laboratório, tempo, ISO e fotômetro; levar as escolhas ao celular. |
| 33–41 min | Composição | Oito tipos de composição, reenquadramento e ponto de vista. |
| 41–48 min | Arquivos e edição | JPEG/RAW, comparação de ajustes, Lightroom pago e Snapseed gratuito. |
| 48–51 min | Produção e responsabilidade | Transformar a foto em cartaz e discutir crédito e permissão. |
| 51–55 min | Quiz | Prever a escolha e explicar a resposta. |
| 55–60 min | Organização | Formar grupos e escolher a intenção da foto. |
| 60–80 min | Captura | Buscar luz e enquadramento; produzir variações e selecionar uma imagem. |
| 80–95 min | Edição | Ajustar a foto escolhida e escrever um título. |
| 95–100 min | Entrega | Enviar foto e título. |
| 100–110 min | Avaliação | Avaliar outros grupos; jurados avaliam separadamente, se houver. |
| 110–120 min | Mostra e encerramento | Exibir destaques e comentar as escolhas. |

São 55 minutos de teoria e demonstrações e 65 de organização, prática, avaliação e encerramento. A soma dos tempos dos 27 slides é 120 minutos. A logística depende do número de grupos.

## Imagens e exemplos

Foram extraídas cinco fotografias de aula-ano-passado.pptx, mantendo o original intacto. Elas aparecem na capa, definição, exposição, composição, iluminação, edição e produção de cartaz. Para simetria, moldura, repetição e planos, diagramas geométricos ilustram o princípio: não são fotografias atribuídas ao Instagram. A grade da foto de praia já faz parte do original. Arquivos e origem estão em ASSETS.md.

O slide de aplicativos destaca **Lightroom pago por assinatura**, com a ressalva de ferramentas básicas gratuitas no celular, e **Snapseed gratuito**. Não é necessário comprar um aplicativo para fazer a atividade.

`+plan.slice(end);
plan=plan.replace('Um controle separa suas peças;', 'O botão Explodir câmera separa todas as peças em um clique; os controles de diafragma e tempo alteram a demonstração. O disparo é desacelerado, com duração visual crescente conforme o tempo escolhido;').replace('- Torres de um lado: conceito em discussão e referência visual curta.\n- Torres do outro: valores da simulação, desafio ou contagem de tempo.', '- Quatro torres: vazias, conforme a preferência confirmada do professor. Todo o conteúdo e os controles ficam no centro.');
writeFileSync('PLANO-AULA.md',plan);
let verification=readFileSync('VERIFICACAO.md','utf8').replace('23 slides','27 slides').replace('- Diafragma manipulável, câmera 3D', '- Capa somente com título e fotografia, seguida pela definição de fotografia; cinco imagens extraídas do PPTX anterior.\n- Oito tipos de composição e seis exemplos de iluminação (fotografias e diagramas identificados).\n- Diafragma manipulável, câmera 3D').replace('8 testes passaram','9 testes passaram').replace('| Revisão independente | `ship`, sem correções materiais pendentes. |','| Revisão independente | Revisão da atualização em andamento; parecer anterior preservado como histórico. |');
writeFileSync('VERIFICACAO.md',verification);
let pending=readFileSync('PENDENCIAS-MANHA.md','utf8');
pending+=`\n## Atualização com a aula anterior\n\nA capa, a definição e os exemplos foram atualizados conforme o pedido. A sequência agora soma 55 minutos de teoria e 65 de organização/prática/mostra. Cinco fotos vieram do PPTX; exemplos adicionais de composição e luz usam diagramas identificados. A fonte não informa todos os fotógrafos nem os parâmetros reais de captura. A fotografia de praia já tinha a grade incorporada. O PPTX original foi preservado. Não é necessária uma resposta para ensaiar esta versão.\n`;
writeFileSync('PENDENCIAS-MANHA.md',pending);
