# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + TypeScript, com Three.js para as demonstrações tridimensionais. A construção foi autorizada após a recomendação técnica; o professor explicitou que o resultado precisa ser composto por arquivos estáticos.

O comando `npm run build` deve produzir `dist/` com HTML, CSS, JavaScript e recursos locais, sem servidor Node em produção. A apresentação será hospedada no GitHub Pages; a aplicação da atividade terá hospedagem separada.

A aplicação da atividade foi construída com Node.js 22.16+, SQLite e arquivos em disco persistente, sem dependências npm externas. Essa escolha foi delegada durante a construção noturna; a hospedagem final continua em aberto.

## Users

- Alunos de aproximadamente 12 a 17 anos, descritos pelo professor como crianças e jovens do ensino médio.
- Professor que conduz uma aula presencial e opera uma apresentação interativa em telão.
- Alunos organizados em grupos para fotografar, editar e enviar uma imagem com título.
- Alunos que avaliam as fotografias de outros grupos. A participação de jurados é uma possibilidade ainda em definição.

## Product Purpose

Preparar uma aula de “Fotografia e Produção de Imagens” de duas horas, combinando entre 30 e 60 minutos de teoria com uma atividade prática no tempo restante.

A apresentação deve permitir explicar conceitos por meio de demonstrações e interações. A atividade proposta leva os grupos a produzir uma fotografia editada e intitulada, receber avaliações e participar de uma mostra das melhores imagens.

## Positioning

Uma aula que conecta o funcionamento da câmera às decisões de captura, edição e uso de fotografias na produção de outras imagens, com apresentação adaptada a um telão segmentado e aplicação prática pelos alunos.

## Operating Context

- Aula presencial com duração total de 120 minutos.
- Sequência enxugada autorizada: 20 slides, com 45 minutos de explicações/demonstrações e 75 de organização, prática e mostra. A câmera concentra abertura, tempo, ISO e caminho da luz; fotômetro e ponto de vista são ensinados nas demonstrações de exposição e composição. Por pedido atual, o quiz inclui todas as seis perguntas; captura/edição/envio usam 25/20/5 minutos.
- Data da aula: sábado, 24 de outubro de 2026.
- Apresentação web navegável como slides, com hospedagem desejada no GitHub Pages.
- Exibição em telão de LED composto por um painel central de 1920 × 1440 e quatro torres de 480 × 1440, duas de cada lado.
- O telão funciona como uma única tela. A soma das larguras resulta em uma área lógica de 3840 × 1440, preservando a divisão física dos cinco segmentos. A resolução efetivamente configurada na saída ainda deve ser conferida no ensaio.
- A composição deve preservar as proporções horizontais **1–1–4–1–1** também em monitores com outras resoluções: cada torre ocupa 12,5% da largura e o centro ocupa 50%. O telão físico tem proporção geral 8:3. Nas prévias, o professor solicitou ocupar toda a largura e altura disponíveis, sem margens superiores ou inferiores; os painéis adaptam sua altura à janela, mantendo imagens e diagramas sem distorção.
- Navegador previsto: Chrome ou Microsoft Edge. O computador ainda não foi especificado.
- A quantidade de alunos e grupos é desconhecida; o fluxo da atividade deve aceitar uma quantidade variável de participantes.
- Segundo a previsão do professor, a maioria dos alunos terá celular e haverá internet disponível. Não há confirmação de um aparelho por aluno ou por grupo.
- Referência física disponível em `layout-telao.jpeg`, inspecionada durante a inicialização.
- A atividade será tratada como uma aplicação separada da apresentação, com hospedagem própria para receber fotografias, títulos e votos. O provedor e o serviço responsável por persistir esses dados ainda não foram escolhidos.

## Capabilities and Constraints

### Conteúdo solicitado

- Introdução à fotografia e à produção de imagens.
- Funcionamento de uma câmera e de seus componentes.
- Triângulo de exposição: abertura, tempo de exposição e ISO.
- Fotômetro e sua interpretação.
- Composição fotográfica com vários exemplos: terços, linhas condutoras, diagonais, espaço negativo, centro/simetria, moldura, repetição e profundidade.
- Como direção, dureza, intensidade e cor da iluminação afetam a fotografia: os seis exemplos têm uma simulação 3D ajustável, vista pela câmera e montagem com a posição dos elementos.
- Capa somente com título, sem imagens, com tipografia aprimorada; verbete formal de fotografia, com fonte, no slide seguinte; a imagem de referência vem isolada no terceiro slide.
- Diferenças entre JPEG e RAW.
- Alternativas de edição: destacar Lightroom pago por assinatura (com ferramentas básicas gratuitas no celular) e Snapseed gratuito.
- Uso de fotografias na criação de outras imagens: combinação de fotos, camadas, modos de mesclagem, opacidade, tipografia e contraste.
- Priorizar a arte fornecida Fotografia.png como referência; arquivo achatado, sem camadas originais recuperadas.

### Interações desejadas

- Câmera tridimensional implementada com Three.js: desmontar todas as peças em um clique, ajustar diafragma, tempo e ISO; fluxo de luz bloqueado pelas peças, acúmulo durante a exposição, ganho do sinal/ruído e resultado fotográfico de uma cena 3D. A seleção mantém o conjunto completo visível e amplia somente a peça escolhida em 40%, com coral, brilho e contorno claro; Limpar destaque restaura os materiais. O destaque permanece durante o disparo.
- Simulador dos efeitos do triângulo de exposição: desfoque por distância em três planos, seleção do plano de foco e comparação com brilho igualado. A prévia 3D da câmera também simula profundidade de campo.
- Quiz interativo.
- Envio de uma fotografia tirada e editada pelo grupo, acompanhada de um título.
- Avaliação das imagens de outros grupos segundo critérios a definir.
- Mostra das fotografias selecionadas a partir das avaliações.
- Possibilidade de resultados separados para escolha popular e escolha dos jurados.

Há uma implementação local da apresentação e da aplicação da atividade. Ainda não houve publicação remota. Em 24 de outubro, o professor informou que não teve tempo de hospedar a aplicação da atividade. A apresentação ganhou uma mostra local como alternativa para importar fotos recebidas pelo canal combinado, editar títulos e registrar manualmente popular e jurados no computador do telão. O quiz é coletivo no navegador do professor. Na aplicação separada, códigos individuais identificam participantes e jurados; o grupo entrega uma fotografia e as avaliações são persistidas no servidor, com revisão do professor antes da galeria.

Padrões implementados por delegação durante a noite: composição, uso da luz e intenção/criatividade recebem notas de 1 a 5 com o mesmo peso; escolha popular e jurados são calculados separadamente; autoavaliação do grupo é bloqueada; uma avaliação por pessoa e foto pode ser ajustada até o fechamento; placares só aparecem após o encerramento. Esses padrões estão listados para revisão em `PENDENCIAS-MANHA.md`.

### Decisões em aberto

- Hospedagem e endereço público da aplicação da atividade.
- Quantidade de alunos e grupos, distribuição efetiva dos celulares e condições da conexão durante a aula.
- Computador usado na apresentação e resolução de saída configurada para o telão.
- Participação no quiz: coletiva, conduzida pelo professor, ou com respostas individuais em dispositivos.
- Critérios de avaliação, escala de notas, regras de participação e desempates.
- Confirmação dos jurados e formato da escolha popular: por aluno ou por grupo.
- Tema da atividade e necessidade de entregar também a fotografia original ou uma arte derivada.
- Identificação dos participantes, moderação e alcance de acesso à galeria.
- Destino do repositório no GitHub.
- Eventuais fotografias adicionais do professor ou da instituição.

## Brand Commitments

- Tema confirmado da aula: “Fotografia e Produção de Imagens”.
- A apresentação deve ser dinâmica e conter muitos elementos interativos.
- Preferência atual: leitura limpa e nenhum item pequeno nas torres. Em Telão ≥1200px, as duas torres internas mostram somente palavras-chave/valores grandes; controles e parágrafos permanecem no centro. As externas e todas as torres na capa ficam vazias. A capa agora acrescenta uma ilustração geométrica animada do caminho da luz, um QR Code da apresentação e convite para acompanhar no celular; o título continua central. A câmera e sua imagem de resultado compartilham a área central. No laboratório, o fotômetro fica diretamente abaixo da imagem. Em celular/Estudo, a orientação da etapa aparece no centro.
- Navegação por roteiro é o padrão: setas, Page Up/Down e espaço executam etapas determinísticas antes de trocar o slide; a seta anterior restaura a etapa precedente, e Shift+seta pula diretamente de slide. Por pedido atual, os controles ficam visíveis no centro durante o roteiro, inclusive os ajustes de comparação, luz e tipografia usados nas etapas. Há modo alternativo de somente trocar slides. Animações de captura bloqueiam repetição até concluir; mudar de slide cancela ações pendentes. O roteiro inclui câmera, luz, exposição, composição, edição, camadas, quiz e fases da prática. A câmera mantém o conjunto completo e amplia só a peça escolhida. O último slide é somente textual, sem botão de retorno; o triângulo não tem atalho redundante.
- Modo professor separado em `?professor=1`: tópicos concisos para cada slide, etiquetas da etapa atual, lista resumida de etapas e antecipação da próxima ação, sem sugestões de falas. O notebook e o computador do telão navegam manualmente de forma independente, conforme confirmação do professor; não há sincronização ou dependência de servidor. A posição do professor é preservada na URL, sem modificar os dados ou a posição da projeção.
- Roteiro com 82 etapas: os seis exemplos de iluminação passam por Exemplo → Montagem 3D → Pela câmera, com comparações adicionais de fonte pequena/ampla e luz quente/fria; confirmado que o pedido não se refere aos oito exemplos de composição. O quiz percorre as seis questões e suas revelações. Produção demonstra seis modos representativos do padrão web, um por família, com as mesmas fotos e opacidade fixa; os 16 continuam no seletor manual. A etapa final usa Inovalab, Overlay, título embaixo e sem fundo de leitura. Não aparecem etiquetas de origem das fotos ou classificação dos diagramas nas projeções de exemplos. Textos das torres centralizados horizontal e verticalmente, mantendo o tamanho grande.
- Inovalab é o nome confirmado do projeto do curso. Tipografia e identidade visual institucional além do exemplo ainda não foram definidas.

## Evidence on Hand

- `aula-ano-passado.pptx`: apresentação anterior fornecida para referência de conteúdo e extração de imagens; cinco fotografias foram reaproveitadas sem redesenhar o tema atual. O Instagram informado não abriu, e o professor autorizou preferir o PPTX.
- `layout-telao.jpeg`: diagrama fornecido pelo professor com as medidas e a disposição dos cinco segmentos do telão.
- Briefing do professor: público, duração, conteúdos, interações desejadas e proposta de atividade registrados neste documento.
- Fotografias demonstrativas do Unsplash e fontes locais foram documentadas em `ASSETS.md`. O modelo 3D é esquemático e foi construído em código, sem representar uma câmera comercial específica.
- Não foram fornecidas imagens dos alunos ou identidade institucional. Os dados usados nos testes são fictícios e separados do armazenamento real.
- Código da apresentação em `src/`; aplicação da atividade em `atividade/`.

## Product Principles

1. Conectar cada explicação a uma decisão que os alunos possam experimentar ao fotografar ou editar.
2. Preservar tempo para a prática dentro das duas horas totais.
3. Tratar a segmentação do telão como uma condição real de uso da apresentação.
4. Relacionar captura, edição e produção de imagens na mesma experiência de aprendizagem.
5. Distinguir a avaliação popular da avaliação dos jurados caso ambas sejam adotadas.
