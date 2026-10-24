---
name: Fotografia e Produção de Imagens
description: Uma decisão por vez, com demonstrações grandes e controles discretos.
colors:
  accent: "#cf786f"
  accent-hover: "#dfa69e"
  ground: "#151618"
  surface: "#202125"
  ink: "#efefec"
  muted: "#b6b7b8"
  rule: "#424346"
  control-border: "#707173"
  control-hover: "#292b2f"
  focus: "#f2d1ca"
typography:
  display:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(28px,2.6cqw,100px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-.025em"
  cover-display:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(48px,4.5cqw,172px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-.035em"
  cover-continuation:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: ".8em"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-.035em"
  dictionary-definition:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(20px,1.55cqw,62px)"
    lineHeight: 1.4
  production-title:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(24px,3cqw,115px)"
    fontWeight: 600
    lineHeight: 1.05
  production-serif:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "clamp(24px,3cqw,115px)"
    fontWeight: 600
    lineHeight: 1.05
  headline:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(21px,1.75cqw,68px)"
    fontWeight: 500
    lineHeight: 1.15
  title:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(18px,1.5cqw,60px)"
    lineHeight: 1.35
  body:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(14px,1.05cqw,42px)"
    lineHeight: 1.4
  label:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(12px,.85cqw,34px)"
    lineHeight: 1.4
  tower-cue:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(24px,1.65cqw,68px)"
    fontWeight: 500
    lineHeight: 1.2
  presentation-cue:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(16px,1.2cqw,48px)"
    lineHeight: 1.35
  options-label:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(13px,.9cqw,36px)"
  quiz-question:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(24px,2cqw,76px)"
    fontWeight: 400
    lineHeight: 1.2
  teacher-title:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(28px,2.6vw,42px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-.025em"
  teacher-body:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "18px"
    lineHeight: 1.5
  teacher-speech:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(21px,1.7vw,26px)"
    lineHeight: 1.55
  teacher-question:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "22px"
    lineHeight: 1.4
  teacher-step:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
  activity-display:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "clamp(32px,4vw,56px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-.025em"
  activity-body:
    fontFamily: "Figtree, Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
rounded:
  control: "3px"
spacing:
  deck-gap: "1.4cqw"
  slide-gap: "1.5cqw"
  deck-inset: "2.3cqw 2.4cqw"
  cue-gap: ".4em"
  support-inset: "2.3cqw 1cqw"
  teacher-gap: "24px"
  teacher-inset: "24px 40px"
  phone-inset: "20px"
  control-gap: ".5em"
  activity-xs: "8px"
  activity-sm: "12px"
  activity-md: "18px"
  activity-lg: "24px"
  activity-xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    rounded: "{rounded.control}"
    padding: ".6em .9em"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.ground}"
  button-secondary:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: ".6em .9em"
  button-secondary-hover:
    backgroundColor: "{colors.control-hover}"
    textColor: "{colors.ink}"
  button-activity-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  input-activity:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px"
  text-action:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    padding: ".4em 0"
  production-type-sans:
    textColor: "{colors.ink}"
    typography: "{typography.production-title}"
  production-type-serif:
    textColor: "{colors.ink}"
    typography: "{typography.production-serif}"
  footer-arrow:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: ".35em"
    width: "40px"
  tower-message:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.tower-cue}"
    padding: "{spacing.support-inset}"
  details-summary:
    textColor: "{colors.ink}"
    typography: "{typography.options-label}"
    padding: ".45em 0"
  manual-summary:
    textColor: "{colors.muted}"
    typography: "{typography.options-label}"
    padding: ".4em 0"
  teacher-step:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.teacher-step}"
    padding: "10px 12px"
  teacher-step-current:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    typography: "{typography.teacher-step}"
    padding: "10px 12px"
---

# Design System: Fotografia e Produção de Imagens

## Overview

**Creative North Star: "Uma decisão por vez"**

Um campo escuro e limpo dá lugar a uma demonstração grande, uma decisão compreensível e uma consequência visível. A geometria do diafragma, a câmera tridimensional esquemática, as fotografias e a pergunta do quiz constituem o conteúdo principal. O centro reúne o assunto, o resultado e todos os controles. As duas torres internas do telão podem mostrar somente conceitos e consequências em palavras grandes. Um roteiro pelas setas conduz as interações, mantendo os controles e os valores usados na etapa visíveis para tornar a mudança legível.

A direção escolhida traduziu a progressão e a precisão do mundo de dobras para o pedido explícito de fundo escuro, limpeza e centralização. Não há textura de papel, ornamento de origami ou brilho decorativo. A apresentação tem uma composição física própria para o telão; a aplicação da atividade compartilha a identidade visual e usa um fluxo normal de formulários e imagens.

**Key Characteristics:**

- Fundo neutro escuro, texto claro e coral reservado à ação e à consequência.
- Figtree com hierarquia de tamanho, peso, espaço e contraste; a capa distingue a primeira linha das demais.
- Diagramas, fotografias e geometria contável como conteúdo de maior presença.
- Controles retangulares discretos e estados legíveis.
- Assunto e resultado no centro; torres internas somente com palavras grandes; torres externas com câmeras e fotos instantâneas em 3D, sem texto ou controles. Na capa, as torres internas permanecem vazias.
- Setas executam etapas recuperáveis antes de trocar de slide; controles manuais continuam no centro.
- Navegação mínima no rodapé e controles visíveis durante o roteiro; leitura reunida no modo de estudo.
- Modo professor independente, centrado em tópicos curtos, com a mesma paleta e família tipográfica.

Documentado a partir de `src/style.css`, `src/main.ts`, `src/views.ts`, `src/presentation-layout.ts`, `src/presentation-script.ts`, `src/scripted-presenter.ts`, `src/camera.ts`, `src/teacher.ts`, `src/teacher.css`, `src/teacher-topics.ts` e `atividade/public/style.css`, com conferência visual de capturas. Os contratos em `.impeccable/surfaces/index-html.md` e `.impeccable/surfaces/professor.md` registram a projeção e a leitura independente do professor. A autorização atual mantém controles e valores visíveis no centro durante o roteiro e restringe as torres a texto grande. O HTML de decisão é referência histórica de intenção; o código construído é a autoridade dos tokens. Não há composição raster aprovada a reproduzir.

## Colors

Uma paleta neutra quase preta sustenta letras claras, linhas discretas e um coral suave de função precisa. Os valores normativos estão no frontmatter.

### Primary

- **Coral de decisão** (`accent`): ação principal, seleção, controles de faixa, saídas numéricas e consequências didáticas.
- **Coral claro de interação** (`accent-hover`): resposta de hover dos botões preenchidos.

### Neutral

- **Fundo carvão** (`ground`): janela, torres, centro, campos e botões secundários.
- **Superfície elevada em tom** (`surface`): apoio a imagens, tabela de códigos e hover das ferramentas da apresentação.
- **Texto marfim** (`ink`): títulos, corpo e contornos essenciais do diagrama.
- **Cinza de apoio** (`muted`): legendas, instruções auxiliares, progresso e contexto secundário.
- **Linha divisória** (`rule`): separação de seções, linhas do índice e cabeçalhos da atividade e do modo professor; o rodapé da projeção permanece sem divisória.
- **Contorno de controle** (`control-border`): identificação de campos e botões secundários.
- **Fundo de interação** (`control-hover`): hover dos controles neutros.
- **Foco claro** (`focus`): contorno de teclado, separado visualmente do coral de seleção.

**The Consequência Rule.** Use o coral para indicar uma ação, uma seleção ou o efeito de uma escolha; preserve o fundo neutro ao redor.

As cores de fotografias, da cena simulada e dos materiais da câmera pertencem ao assunto demonstrado. Não ampliam a paleta dos componentes de interface. Os ícones oficiais dos aplicativos preservam suas cores para identificar os produtos; essas cores também não são novos tokens da interface. Os fundos específicos de aviso e resposta do quiz são estados locais, não novas famílias de marca.

## Typography

**Display Font:** Figtree, com Arial e sans-serif como fallback.
**Body Font:** a mesma família.

**Character:** uma sans aberta e direta, com títulos de slide em peso médio e pouca ornamentação. A fonte variável é hospedada localmente; o `@font-face` declara os pesos de 400 a 600. Origem e SIL Open Font License estão em `ASSETS.md` e `public/assets/fonts/OFL.txt`. O monoespaçado nativo aparece somente nos códigos operacionais da atividade, não como fonte de títulos.

**Comparação didática de tipografia:** Georgia, com Times New Roman e serif como fallback, existe somente como alternativa selecionável do título dentro do estudo de produção de imagens (`#poster-type.type-serif strong`). O papel `production-serif` registra essa escolha de conteúdo, em itálico. Figtree continua sendo a identidade de toda a interface, dos títulos de slide, dos rótulos e das explicações. A serifa do sistema não é uma segunda família de marca.

### Hierarchy

- **Display:** título do slide; papel `display` do frontmatter, peso 500, tracking de -.025em e entrelinha compacta. No telefone, usa 32px. A capa mantém sua escala específica.
- **Cover:** título central em três linhas, sem fotografia. A primeira usa `cover-display`; as continuações usam `cover-continuation`, relativas ao tamanho do título. Em até 700px, o título usa `clamp(42px,12.4vw,68px)`. A primeira linha tem margem inferior de .15em.
- **Dictionary:** definição formal no papel `dictionary-definition`, limitada a 48ch; em telefone usa 20px. A classe gramatical usa texto de apoio e a atribuição permanece um link legível, separado da definição.
- **Production:** o título da arte experimental usa `production-title` por padrão e `production-serif` quando o aluno escolhe comparar serifa. Ambos usam o mesmo tamanho e peso; a alternativa com serifa acrescenta itálico. No telefone, o título do estudo usa 30px.
- **Headline:** subtítulos explicativos, papel `headline`; peso 500. Listas de passos também usam títulos regulares grandes, mantendo o conteúdo em primeiro plano.
- **Title:** chamada ou conclusão didática, papel `title`; no telefone, 19px. Não funciona como rótulo decorativo acima do título.
- **Body:** texto da área central, papel `body`; estudo em telefone usa 16px. Textos explicativos e notas adotam seus tamanhos menores próprios.
- **Label:** legendas auxiliares, papel `label`; no telefone, 12px. Não reduzir explicações principais a esse papel.
- **Tower cue:** conceito e consequência nas torres internas usam `tower-cue`, sem rótulos pequenos ou controles. No telão de 3840px, o tamanho calculado é 63.36px. Cada linha é um span explícito; não quebrar palavras com hifenização.
- **Presentation cue:** no telefone ou Estudo, a frase de orientação fica no centro com `presentation-cue`; no telefone, 18px. No quiz, a orientação é secundária e usa a escala compacta própria.
- **Options:** `options-label` identifica detalhes recolhíveis; em telefone, 14px.
- **Quiz:** a pergunta usa `quiz-question` e assume a posição visual principal. Em telefone, o roteiro guiado usa 24px; no modo Telão a partir de 1200px, `clamp(28px,1.6cqw,64px)`. O título genérico permanece disponível para acessibilidade, sem repetir a pergunta visualmente.
- **Teacher:** `teacher-title` identifica o slide; `teacher-step-topics` mostra etiquetas da etapa; `teacher-topic-list` reúne de dois a quatro tópicos do slide em 20–25px; `teacher-roadmap` organiza etapas clicáveis em 15px. No telefone, título de 29px e tópicos de 20px. São escalas de leitura do notebook, sem herdar a ampliação em cqw do telão.
- **Activity:** título responsivo e corpo definidos em `activity-display` e `activity-body`; em até 650px, título de 36px. Subtítulos usam 28px/26px e títulos internos 21px. Parágrafos ficam limitados a 65ch.

**The Escala do Telão Rule.** A tipografia da apresentação acompanha a largura do contêiner com `cqw` e limites `clamp`; a atividade usa uma escala de leitura de página independente.

**The Tipografia como Conteúdo Rule.** Restrinja Georgia e o itálico ao título opcional do estudo de produção de imagens; mantenha Figtree nos títulos, controles e textos da interface que o envolve.

## Layout

A apresentação preenche a janela (`100vw × 100svh`) com cinco colunas proporcionais **1–1–4–1–1**, sem limite de largura nem margens externas. O centro recebe 50% da largura; cada torre recebe 12,5%. Em 3840px isso resulta em 480/480/1920/480/480px. O assunto, o resultado, a medição, os controles e a navegação ficam no centro. As torres externas usam o mesmo modelo Three.js da câmera da aula: montado à esquerda e desmontado à direita. Duas Polaroids locais ocupam faixas sem sobreposição acima e abaixo de cada câmera; fotos e câmeras flutuam em ritmos independentes. Nas etapas guiadas, as torres internas podem nomear conceito e consequência somente com texto grande.

O centro tem conteúdo flexível e rodapé, sem cabeçalho repetindo o nome da aula, com o espaçamento `deck-gap`, intervalo de slide `slide-gap` e recuo `deck-inset`. O conteúdo central pode rolar internamente quando necessário; o corpo da apresentação não rola. Figuras usam o espaço disponível sem distorcer a imagem ou a geometria.

As mensagens laterais aparecem somente no modo Telão com largura de pelo menos 1200px e quando a etapa fornece palavras. Cada torre contém apenas um parágrafo com linhas em spans, intervalo `cue-gap`, recuo `support-inset`, alinhamento central nos dois eixos e sem rolagem. O texto usa `text-align:center` e suas linhas usam `align-items:center`. As torres utilizadas recebem os nomes acessíveis “Conceito em destaque” e “Consequência observada”; as vazias ficam ocultas da árvore acessível. Ao abrir índice ou opções da apresentação, as mensagens laterais ficam invisíveis enquanto a folha ocupa o centro.

Abaixo de 1200px ou no modo Estudo, a orientação da etapa aparece como frase central com anúncio discreto. Todos os controles permanecem no centro em qualquer largura; `src/presentation-layout.ts` agrupa os próprios nós em “Controles da demonstração”, sem copiá-los para as torres. As figuras mantêm a relação acessível com suas descrições. As torres não recebem formulários, botões, rótulos pequenos nem imagens de resultado.

A capa é uma variante específica: mostra o título tipográfico, um traçado geométrico de luz que se desenha uma vez, QR Code da apresentação e convite para acompanhar pelo celular; as torres internas ficam vazias e as externas mostram câmeras e Polaroids flutuantes. A contagem e as ferramentas ficam ocultas nessa abertura. No slide seguinte à definição, a fotografia se revela como resultado da luz. Movimento reduzido remove os traçados e a flutuação 3D, preservando os objetos, as imagens e o QR.

Em até 700px, os recuos passam a 20px, o intervalo do centro a 16px e o do slide a 20px. O modo de estudo, selecionado automaticamente na primeira visita em telefone, expande o centro para toda a largura e zera as torres. É uma preferência persistida, também disponível nas opções. O modo de telão conserva suas proporções em qualquer monitor, com apoio lateral somente a partir do limite documentado.

Há ajustes específicos de densidade para altura de até 650px em telas acima de 700px e para proporção de pelo menos 2:1: menos recuo vertical, intervalos menores e títulos ajustados. Preserve esses ajustes ao acrescentar slides. O modo opcional de guias mostra limites dos painéis para ensaio, não conteúdo para as torres.

A atividade usa contêiner de até 1120px, centralizado, com recuo de 32px 28px 80px. Formulários usuais têm até 540px; a entrada até 720px. Galeria e configuração usam duas colunas e passam a uma em até 650px; nesse ponto o recuo da página passa a 22px 18px 60px. A atividade não herda as cinco faixas do telão.

O modo professor usa uma página própria em `?professor=1`, com altura de 100svh, largura máxima de 1600px, `teacher-gap` e `teacher-inset`. Quatro linhas mantêm cabeçalho, seletor/posição, área de leitura e rodapé. Os tópicos ocupam a coluna principal e o roteiro a secundária, em proporção 1.75:1 com mínimo de 280px para o roteiro e intervalo de 48px. As duas áreas rolam independentemente; o rodapé permanece disponível.

Em até 1000px, o modo professor reduz recuo para 20px 24px, intervalo da página para 20px e das colunas para 28px; a proporção passa a 1.6:1 com mínimo de 250px para o roteiro. Em até 700px, usa recuo de 20px e um fluxo único rolável de tópicos e roteiro, mantendo as ações do rodapé fora da área de rolagem. Essa superfície não usa as cinco faixas da projeção.

**The Centro Livre Rule.** Mantenha assunto, resultado, fotômetro e todos os controles no centro. Nas torres internas, permita somente palavras grandes de conceito e consequência. As torres externas podem carregar as câmeras e Polaroids decorativas, sem rótulos ou controles; na capa, mantenha vazias as torres internas.

**The Uma Camada de Decisão Rule.** No roteiro padrão, use as setas para executar uma etapa de cada vez, mantendo controles e valores visíveis. Não repita cabeçalho, seção ou explicação que a própria demonstração já torna clara.

## Elevation & Depth

A interface é plana: separadores finos e diferenças de tom organizam o conteúdo, sem sombras de cartões, texturas ou glows. Folhas de índice e opções cobrem somente o centro com o mesmo fundo. A câmera 3D pode usar iluminação, materiais, transparência e profundidade para explicar suas peças; a simulação pode representar desfoque e movimento. Esses efeitos pertencem à demonstração, não à decoração da interface. As únicas sombras CSS são os contornos internos do modo de guias.

**The Profundidade Didática Rule.** Reserve volume e efeitos de imagem para tornar o assunto compreensível; organize a interface com tom, linhas e espaço.

## Shapes

Botões e campos têm cantos discretos definidos por `rounded.control`, contorno fino e proporção retangular. Navegação por texto e linhas de índice podem ter cantos retos. As fotografias e contêineres são retos; não são cartões arredondados flutuantes.

Círculos, lâminas, triângulos, linhas de luz e volumes são formas do conteúdo fotográfico. Preserve a geometria legível e a relação entre partes; não a substitua por ornamentos. Ícones dos controles são SVGs de traço, com nomes acessíveis nos botões.

## Components

### Buttons

Controles pequenos em relação à demonstração, com rótulos diretos e estados explícitos. O primário usa coral com texto carvão; o secundário usa fundo carvão, contorno de controle e texto claro. Hover do primário clareia o coral; o secundário clareia seu fundo e contorno. Seleção e `aria-pressed=true` usam o mesmo preenchimento coral.

Na apresentação, o botão padrão tem altura mínima de 40px e padding do frontmatter; compactos usam mínimo de 32px. Em baixa altura, o padrão cai a 34px. Na atividade, os botões têm mínimo de 44px, padding de 12px 18px e intervalo de 8px. Controles de texto removem a borda e mantêm o texto como sinal de ação.

Foco de teclado usa contorno de 2px com afastamento de 4px, sem glow. Desabilitados usam opacidade .43 na apresentação e .5 na atividade; a atividade usa cursor de espera. Não depender apenas da cor para comunicar resultado ou erro.

### Inputs / Fields

Campos e seletores compartilham fundo, texto, contorno e cantos dos controles. Apresentação usa padding de .6em .7em; atividade usa 12px. Rótulos ficam visíveis acima ou ao lado do controle. As faixas usam coral, valores numéricos tabulares e outputs próximos; na apresentação têm altura mínima de 32px. O layout de três controles de exposição mantém proximidade com a imagem e o fotômetro.

### Navigation

O rodapé mínimo reúne setas SVG, progresso tabular, índice e opções; não usa linha divisória, nome da aula ou legenda de seção. As setas têm largura de 40px e padding de .35em; no telefone, largura de 32px. As ferramentas têm mínimo de 36px, ou 32px no telefone, e conservam nomes acessíveis e foco visível. O índice abre como folha no centro, com linhas clicáveis e grupos de conteúdo. As folhas de índice e opções preservam a altura natural dos filhos (`flex-shrink:0`) e rolam internamente, mantendo ações como Salvar acessíveis com a escala de texto do telão.

O padrão é “Roteiro pelas setas”: a seta avança a próxima etapa da demonstração e só depois da última passa ao slide seguinte. Voltar restaura a etapa anterior; ao entrar no slide anterior, retoma sua última etapa. O progresso inclui slide e etapa, e o nome acessível da seta distingue “Próxima etapa” de “Próximo slide”. Direita, Page Down e Espaço avançam; Esquerda e Page Up voltam; Shift + seta pula diretamente entre slides. Escape fecha a folha aberta ou desfoca o controle ativo, devolvendo o teclado à apresentação sem recolher os grupos guiados. O modo “Somente trocar slides” continua disponível nas opções.

Os estados definidos em `src/presentation-script.ts` são completos e reproduzíveis, aplicados por `src/scripted-presenter.ts`. Durante uma captura, as setas ficam temporariamente desabilitadas e o palco usa `aria-busy`; a saída cancela esperas pendentes. Não depender de cliques com o mouse para executar o roteiro normal nem permitir que uma espera de um slide altere o seguinte.

### Opções secundárias

“Controles da demonstração” é um details central aberto por padrão. No roteiro guiado, seu summary fica oculto e os controles continuam visíveis enquanto as setas alteram os valores. As opções de câmera, foco, iluminação e tipografia usadas pelo roteiro também ficam abertas, sem summaries redundantes. No modo de somente trocar slides, os summaries explícitos continuam disponíveis para recolher grupos. O foco usa contorno de 2px com afastamento de 4px.

Fora da apresentação guiada, summaries secundários usam `options-label`, padding de .45em 0 e margem inferior de .6em quando abertos. Durante o roteiro, o conteúdo usa intervalos compactos e agrupamento por demonstração: faixas da câmera na primeira linha, ações e peças abaixo; controles de luz em quatro colunas; faixas do laboratório ocupando a largura e comandos auxiliares numa grade de três colunas; produção com título, mesclagem e opacidade em três colunas. No telefone, câmera/luz/laboratório retornam a grupos verticais, luz usa duas colunas e o título da produção ocupa a largura toda. Nenhum grupo migra para as torres.

### Cards / Containers

A atividade organiza imagens e formulários com espaço e divisórias, sem contorno de cartão completo nem sombra. A galeria exibe a fotografia inteira com `object-fit:contain` numa área 4:3; a prévia limita a altura a 350px. Resultados usam miniatura e informação lado a lado, reduzindo a miniatura de 160×120px para 100×100px no telefone. O fundo neutro de apoio recebe as sobras de proporção.

### Demonstração de uma decisão

Uma figura grande, a variável, seu valor e a consequência formam a unidade didática. O roteiro aplica os ajustes necessários a cada etapa e os controles HTML mostram os valores correspondentes. A câmera reúne peças selecionáveis, diafragma, tempo, ISO e caminho da luz. Cada um dos seis casos de iluminação percorre Exemplo → Montagem 3D → Pela câmera; as comparações adicionais de fonte dura/suave e luz quente/fria preservam a cena para tornar o efeito legível. No laboratório, o fotômetro fica imediatamente abaixo da imagem; seletor de luz, reset, foco e faixas permanecem visíveis no roteiro. O triângulo de exposição permanece uma figura equilátera sem botão de experimentar; a navegação normal leva à demonstração seguinte. Reset, etapas anteriores e índice permitem recuperar um passo.

A agulha do fotômetro interpola a posição em .16s `ease-out`. O movimento contínuo é conteúdo da simulação e possui pausa. A preferência de movimento reduzido desativa transições e animações CSS. Não acrescentar animação decorativa a mudanças de página.

### Estados de atividade e quiz

Mensagens de sessão e grupo expressam estado real do fluxo. Upload, revisão, avaliação e encerramento usam texto próximo à ação relevante. O quiz usa as seis perguntas em todos os modos, sem versão rápida. No quiz guiado, cada pergunta e sua resposta são etapas separadas: as setas revelam a alternativa correta e sua explicação, sem atribuir pontuação ou alterar respostas salvas. No modo manual, o resultado reflete respostas reais. A alternativa correta usa contorno coral e fundo local, com explicação textual. Não transformar o contexto operacional de fase em um padrão de sobretítulo decorativo.

### Identificação de aplicativos

Lightroom e Snapseed usam seus ícones oficiais locais ao lado do nome, preservando as cores do recurso original. O grupo de ícone e título alinha-se ao centro com intervalo de .65em; o ícone é quadrado, com largura e altura de `clamp(48px,3cqw,112px)` e `object-fit:contain`. A indicação de pago ou gratuito usa o coral e a tipografia existentes, separada do grupo de identidade. O editor nativo do celular permanece identificado por texto. Origem e proveniência desses recursos ficam em `ASSETS.md`; não redesenhar os ícones nem recolori-los com a paleta da aula.

### Modelo e resultado fotográfico

A demonstração da câmera mantém o modelo completo e o resultado fotográfico juntos no centro, em duas áreas de proporção 1.25:1. No telefone, uma coluna empilha modelo e resultado em duas linhas, com mínimos de 130px por linha e mínimo de 320px para o conjunto. Essa regra final substitui as antigas colunas de 1.6:1. Estado do obturador, luz registrada e ganho ISO ficam associados à demonstração central; legendar resultado previsto, comparação com brilho igualado e captura concluída. Faixas, ações e seleção manual de peças ficam no details central. Nenhuma imagem de resultado ocupa as torres.

A seleção mantém o conjunto completo visível e enquadrado. Somente a peça escolhida amplia sua escala visual em 40% (1.4×) e recebe coral, brilho do material e contorno marfim; as demais conservam sua escala e permanecem visíveis em tons neutros. O enquadramento reserva previamente a ampliação para todas as peças, evitando reenquadrar a cada seleção. Essa ampliação didática não altera os valores ópticos ajustados nem o resultado da prévia fotográfica. O cabeçalho do modelo identifica a peça sobre a faixa superior livre do canvas, sem consumir sua altura; “Limpar destaque” fica oculto no roteiro guiado e disponível no modo manual, recuperando os materiais e a escala original. O destaque permanece durante o disparo, sem ocultar as outras peças ou o caminho da luz. Esse brilho pertence à representação 3D didática; não cria um efeito de glow para componentes da interface.

### Produção por camadas e comparação tipográfica

A referência fornecida é uma imagem final, exibida inteira com `object-fit:contain`. O roteiro passa da referência para um estudo separado e acrescenta fotografia base, segunda foto, mesclagem e tipografia em etapas. A comparação guiada percorre seis modos representativos, um de cada família de efeito, mantendo as mesmas duas fotos e opacidade constante de 65%; os 16 modos definidos em `src/blend-modes.ts` continuam no seletor manual. Depois o roteiro acrescenta e compara tipografia. Em exploração manual, “Experimentar camadas” abre esse estudo; duas fotografias, tipografia e fundo de leitura são ativáveis. Mesclagem e opacidade alteram as fotografias do estudo, sem criar um material decorativo para a interface. O seletor de tipografia alterna Figtree e a serifa didática somente no título da arte; posição e texto são decisões recuperáveis do mesmo estudo. O exemplo usa Inovalab; a etapa final seleciona Overlay, título embaixo e fundo de leitura desligado.

O fundo de leitura carvão com transparência local (`#151618eb`) pode ser ativado nas opções de camadas para comparar contraste; o padrão e a etapa final deixam o fundo transparente. As fotografias cobrem a área experimental, com posição de recorte em `center 25%`; a camada de texto tem limites de altura e largura, com recuo de .85cqw ou 12px no telefone. Os rótulos “Foto base” e “Segunda foto” identificam as duas camadas independentemente do assunto fotografado. No roteiro guiado, título, mesclagem e opacidade usam três colunas no desktop e duas no telefone, com título em largura total. No modo de troca simples, a grade principal usa duas colunas. As torres mostram somente palavras grandes correspondentes à etapa.

### Prática e encerramento

As setas preparam o grupo e iniciam as fases de fotografia, edição e envio; os controles de cronômetro ficam nos ajustes manuais. Um relógio ativo continua ao visitar outros slides. Voltar explicitamente a uma fase da prática reinicia o tempo daquela fase, tornando a transição previsível. O encerramento usa somente a pergunta de reflexão em texto grande, sem fotografia nem botão de retorno; o rodapé continua disponível.

Sem servidor da atividade, a mostra aceita arquivos JPEG/PNG/WebP escolhidos no computador do telão. A fotografia e o título dominam o centro; navegação fica nas laterais da imagem. Título editável e contagem manual de votos populares/notas de jurados ficam em disclosure secundário. Os destaques aparecem separados. Objetos de imagem e notas permanecem apenas na aba aberta, sem simular envio ou votação remota.

### Modo professor independente

Os tópicos do slide são o conteúdo principal, acompanhados por etiquetas curtas da etapa atual. Um seletor escolhe o slide; posição e etapa ficam explícitas. A coluna secundária lista etapas com nomes abreviados como botões e destaca a atual por `aria-current=step`, fundo `surface` e texto coral. Em larguras acima de 700px, a rolagem dessa coluna mantém a etapa atual visível; no telefone, não desloca a leitura para a lista de etapas. “Na próxima seta” antecipa a ação seguinte. Rodapé com Anterior e Próximo e atalhos equivalentes permite acompanhar manualmente a aula. O modo não traz falas sugeridas; tópicos e comparações acompanham as 82 etapas do roteiro.

O modo professor navega de forma independente do computador do telão, sem sincronização, pareamento ou backend. Sua URL guarda slide e etapa; não altera os dados salvos nem a posição da projeção. O cabeçalho declara essa independência e oferece um link para abrir a apresentação, sem sugerir controle remoto. A leitura herda Figtree, paleta, cantos discretos e foco dos controles existentes.

## Do's and Don'ts

### Do:

- **Do** usar o coral para ação, seleção e consequência visível.
- **Do** preservar a proporção 1–1–4–1–1 e reservar as torres internas somente a palavras grandes de conceito e consequência.
- **Do** reservar o centro para o conteúdo e manter câmeras e Polaroids somente nas torres externas.
- **Do** manter todos os controles no centro e visíveis durante o roteiro, executando as etapas pelas setas enquanto os valores mudam.
- **Do** manter o modo professor independente e indicar slide, etapa atual e próxima ação sem prometer sincronização.
- **Do** manter o resultado da câmera central e empilhar modelo e resultado no telefone; posicionar o fotômetro abaixo da imagem do laboratório.
- **Do** manter diagramas, fotografias e controles relacionados próximos e legíveis.
- **Do** usar Figtree local e registrar a origem dos recursos em ASSETS.md.
- **Do** manter foco visível, rótulos explícitos e equivalentes HTML para as demonstrações.
- **Do** usar o contêiner normal de leitura e formulários na atividade.
- **Do** manter a comparação Georgia/Figtree restrita ao título da arte experimental, com o restante da interface em Figtree.

### Don't:

- **Don't** acrescentar textura de papel, origami, glows ou sombras decorativas à interface.
- **Don't** colocar controles, legendas ou textos pequenos nas torres externas ou internas.
- **Don't** atribuir pontuação a revelações do quiz guiado ou alterar respostas salvas durante essas etapas.
- **Don't** repetir o nome da aula no cabeçalho, a seção no rodapé ou um título genérico acima da pergunta do quiz.
- **Don't** transformar a geometria didática em ornamento ou distorcer fotografias para preencher espaço.
- **Don't** tratar cores das fotografias e materiais 3D como novos tokens de interface.
- **Don't** acrescentar sobretítulos decorativos ou fontes de sistema como identidade de títulos; a serifa didática opcional do estudo de produção é conteúdo, não identidade.
- **Don't** remover explicações de estado e depender somente da cor.

Defeitos não canonizados: nenhum desvio material foi identificado na amostra; a revisão final tem disposição `ship`. Esta documentação descreve a construção local e não certifica hospedagem ou ensaio no telão físico.
