---
version: 1
slug: "professor"
primary_target: "src/teacher.ts"
related_targets: ["src/teacher.css","src/teacher-topics.ts"]
---

# Modo professor

Scope: modo Read para acompanhar manualmente a aula em um notebook enquanto outro computador apresenta. A navegação é independente por pedido explícito; não há sincronização, pareamento ou backend.

## Direction contract

THESIS: Tópicos concisos orientam o professor sem impor falas prontas; slide, etapa e próxima ação ficam visíveis.

OWN-WORLD: extensão do carvão #151618, Figtree, texto #efefec e coral #cf786f da apresentação. Sem novas imagens ou ornamentos.

STORY: selecionar slide, avançar etapa, consultar palavras-chave e antecipar a próxima ação.

FIRST VIEWPORT: cabeçalho “Modo professor” e indicação de navegação independente; seletor de slide e posição; tópicos do slide e etiquetas da etapa em coluna principal; etapas curtas e clicáveis em coluna secundária; botões anterior/próximo acessíveis no rodapé. Em celular, colunas viram um fluxo rolável, com o rodapé sempre disponível.

FORM: code-led, extensão do sistema existente; não há nova escolha de direção, comp aprovado ou novos assets. Tópicos cobrem os 20 slides e etiquetas acompanham as 92 etapas do roteiro, incluindo seis questões, as três vistas de cada iluminação e os 16 modos de mesclagem. Setas/espaço percorrem etapas; Shift+seta muda de slide. URL guarda a posição; o modo não escreve os dados da projeção. Na coluna rolável do desktop, a etapa ativa é mantida à vista; no celular, os tópicos continuam sendo o ponto inicial de leitura.

FINISH: revisão visual e de navegação em desktop, telão lógico e celular; documentação do sistema reconciliada.
