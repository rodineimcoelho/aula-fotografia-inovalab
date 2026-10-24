---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["src/main.ts","src/style.css"]
---

# Apresentação de Fotografia

Scope: apresentação interativa web, modo Read, conduzida pelo professor para alunos de 12 a 17 anos. Conteúdo confirmado em PRODUCT.md; publicação estática no GitHub Pages.

## Direction contract

THESIS: Uma decisão por vez, conduzida por setas. O centro prioriza a imagem, o modelo e seu resultado. As torres internas exibem somente palavras-chave e valores grandes, sem controles ou parágrafos. Por pedido atual, os controles permanecem visíveis no centro durante o roteiro, para que a turma acompanhe os valores e as escolhas que mudam.

OWN-WORLD: fundo #151618, texto #efefec, destaque #cf786f; Figtree, linhas precisas, botões retangulares discretos e figuras grandes. O vermelho do sistema de dobras foi traduzido para um acento sobre fundo escuro conforme o pedido do professor; nenhuma decoração de origami será usada.

STORY: observar, prever, manipular, comparar e aplicar na fotografia do grupo. Navegação convencional por teclado e índice.

FIRST VIEWPORT: cinco faixas horizontais 1–1–4–1–1 ocupam a janela inteira. Nas torres externas, o modelo Three.js usado na aula flutua entre duas Polaroids com fotografias locais. A câmera esquerda aparece montada e a direita desmontada; as fotos ficam em faixas superior e inferior sem se cruzar. As torres internas ficam vazias na capa. No centro, o título “Fotografia e Produção de Imagens” aparece em três linhas ao lado de uma ilustração geométrica da luz, QR Code da própria apresentação e convite para acompanhar no celular. Apenas uma seta permite avançar; demais ferramentas continuam disponíveis por atalhos. Depois, no modo Telão a partir de 1200px, as torres internas mostram palavras-chave/valores grandes; câmeras e Polaroids continuam flutuando nas torres externas. O segundo slide traz somente o verbete formal atribuído ao Priberam; o terceiro, a arte fornecida Fotografia.png, revelada como resultado da luz. A câmera e a prévia fotográfica ficam juntas no centro. O fotômetro fica abaixo da imagem do laboratório. O encerramento é somente textual.

FORM: opção challenger “Uma decisão por vez”, paper-folds-pleats-deployable-orizuru-crane-sequence; re-roll 1, seed:2db22874a756148e. Escolha code-led, composição de referência em .impeccable/mocks/decision/passo-r1.html. Cores e materiais adaptados ao briefing; progressão recuperável e manipulação direta preservadas.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Interações: 20 slides em 45 minutos de explicação e 75 de organização/prática/mostra; diafragma na câmera; exemplos navegáveis de oito composições e seis situações de iluminação, cada uma com cena 3D, montagem identificada, vista pela câmera e controles de direção, tamanho, potência e cor; câmera tridimensional desmontável em um clique, com fluxo de luz bloqueado por diafragma e obturador, acúmulo, ganho ISO/ruído e prévia de uma cena 3D; exposição com profundidade por plano, foco selecionável, brilho igualado opcional e movimento; fotômetro; reenquadramento; comparação de edição; produção por camadas com referência fornecida, dois arquivos fotográficos, 16 modos de mesclagem, opacidade e tipografia; quiz com todas as seis perguntas; logos oficiais locais de Lightroom e Snapseed; cronômetros de 25/20/5 minutos. Todas têm comandos por teclado ou controles HTML equivalentes. Em telas pequenas, um modo de estudo amplia o centro para leitura.

Decisões delegadas durante a noite: detalhes operacionais em PENDENCIAS-MANHA.md; a apresentação deve funcionar sem o backend da atividade.

Seleção da câmera: o conjunto inteiro permanece visível. Somente a peça escolhida aumenta 40% e recebe coral mais intenso, brilho e contorno claro; as demais mantêm sua escala e ficam neutras. O enquadramento reserva espaço para a ampliação e considera todas as peças, sem reenquadrar a cada seleção. Limpar destaque recupera os materiais. Disparar preserva a seleção, sem ocultar o caminho da luz.

Simplificação: sem nome da aula repetido no cabeçalho ou seção repetida no rodapé; setas, progresso, índice e opções formam a navegação mínima. Durante o roteiro, os controles e as opções usadas nas etapas ficam abertos; no modo de somente trocar slides, as opções secundárias conservam summaries explícitos. Em celular/Estudo, controles e informações permanecem no centro, com rolagem quando necessária. A mudança de largura preserva nós, valores e eventos. No quiz, a pergunta assume o destaque visual e o título genérico fica acessível sem ocupar espaço.

Roteiro por padrão: uma seta executa uma etapa e, após a última, troca de slide. A seta anterior restaura o estado anterior; Shift+seta pula slides. Etapas aplicam estados completos e reproduzíveis. Uma captura bloqueia repetição; a saída aborta esperas. O quiz guiado revela respostas sem atribuir pontuação ou alterar respostas salvas. O roteiro completo aparece nas notas geradas; controles manuais e modo de navegação tradicional continuam disponíveis. Nas torres, somente texto em clamp(24px,1.65cqw,68px); nenhuma entrada, botão ou imagem pequena.

Modo professor: superfície de leitura independente em `?professor=1`, descrita em `professor.md`. O professor acompanha manualmente no notebook enquanto outro computador apresenta no telão, sem sincronização. Tópicos curtos por slide e etiquetas da etapa substituem falas prontas.

Atualização autorizada: 82 etapas no roteiro e no modo do professor. Cada caso de iluminação segue Exemplo, Montagem 3D e Pela câmera; há comparações adicionais de tamanho e cor da fonte. O quiz usa seis questões em todos os modos. A produção guiada compara seis modos representativos com fotos e opacidade de 65% constantes; todos os 16 modos do padrão web permanecem no seletor. O estudo finaliza com Inovalab, Overlay, título embaixo e sem fundo de leitura. Etiquetas de procedência dos exemplos foram removidas da projeção. Textos grandes das torres centralizados nos dois eixos. A mostra local importa fotografias no computador do telão e permite contagem manual sem servidor.
