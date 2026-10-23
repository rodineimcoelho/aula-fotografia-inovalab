# Fotografia e Produção de Imagens — proposta de aula

Roteiro implementado na apresentação. Os tempos são flexíveis; as decisões operacionais ainda em aberto estão em `PENDENCIAS-MANHA.md`.

A aula está marcada para sábado, 24 de outubro de 2026. O professor confirmou que o telão funciona como uma única tela, provavelmente com Chrome ou Edge. A quantidade de alunos e grupos é desconhecida; há previsão de celulares para a maioria e internet disponível. A apresentação ficará no GitHub Pages e a atividade será tratada como aplicação com hospedagem separada.

## Distribuição dos 120 minutos

| Tempo | Bloco | Experiência proposta |
| --- | --- | --- |
| 0–3 min | Capa, verbete e referência | Título sem imagem; definição formal e foto nos dois slides seguintes. |
| 3–13 min | Câmera | Peças, caminho da luz, diafragma, tempo e ISO explicados na mesma simulação. |
| 13–18 min | Iluminação | Direção, dureza, intensidade e cor enquanto altera os exemplos 3D. |
| 18–26 min | Exposição e celular | Triângulo como síntese; desafio no laboratório com fotômetro; aplicação no celular. |
| 26–32 min | Composição | Oito tipos disponíveis, três ou quatro comentados; reenquadramento e ponto de vista. |
| 32–38 min | Arquivos e edição | JPEG/RAW, comparação de ajustes e identificação dos aplicativos pelos logos. |
| 38–43 min | Produção e responsabilidade | Duas fotos de palco, camadas, tipografia e consentimento. |
| 43–45 min | Quiz rápido | Três perguntas; seis disponíveis na versão completa. |
| 45–50 min | Organização | Grupos, intenção e critérios. |
| 50–75 min | Captura | Fotografar de duas posições e selecionar uma imagem. |
| 75–95 min | Edição | Ajustar a foto e escrever um título. |
| 95–100 min | Entrega | Enviar foto e título. |
| 100–119 min | Avaliação e mostra | Votos populares e de jurados separados; comentários conforme a quantidade de grupos. |
| 119–120 min | Encerramento | Retomar uma escolha que a turma fará diferente. |

São 45 minutos de teoria/demonstrações e 75 de organização, prática e mostra. Os 20 slides somam 120 minutos. Os conceitos de oito slides foram incorporados às demonstrações; suas notas anteriores estão em `CONTEUDO-DE-APOIO.md`. Ajuste os tempos ao ritmo da turma.

## Imagens e exemplos

A arte Fotografia.png fornecida pelo professor é prioritária no slide de foto após a definição, na produção e no encerramento. O arquivo está achatado. O estudo interativo combina duas fotos de palco do PPTX como novas camadas. Cinco fotografias extraídas do PPTX complementam exemplos de luz, composição e edição. Diagramas estão identificados; a grade da foto de praia já pertence ao original. Logos oficiais locais identificam Lightroom e Snapseed. Consulte ASSETS.md.

O verbete de fotografia apresenta um trecho atribuído à acepção 1 do Dicionário Priberam, com omissão indicada. Lightroom aparece como pago por assinatura, ressalvando ferramentas básicas gratuitas no celular; Snapseed, como gratuito. Não é necessário comprar um aplicativo.

## Interações com objetivo pedagógico

### Uma câmera que se abre

Ao selecionar uma peça, o conjunto inteiro continua visível. Somente a peça escolhida aumenta 40%; coral, brilho e contorno claro reforçam o destaque. Limpar destaque recupera os materiais e a escala. O disparo preserva a seleção para acompanhar sua função durante o registro. Essa ampliação é um recurso de visualização, não uma mudança de configuração fotográfica.

Usar uma câmera digital esquemática com componentes identificáveis. O botão Desmontar câmera separa todas as peças em um clique; os controles de diafragma, tempo e ISO alteram a demonstração. Os raios para fora da abertura param no diafragma; quando o obturador fecha, a luz deixa de chegar ao sensor. O tempo aumenta o acúmulo de luz. ISO altera o ganho do sinal e a aparência do ruído; não cria luz. A imagem prevista usa um objeto 3D em movimento, com ruído ilustrativo. O disparo é desacelerado, com duração visual crescente conforme o tempo escolhido; selecionar uma peça destaca sua função. Um comando de disparo mostra a sequência de captura e o caminho da luz. Evitar misturar, no mesmo modelo, mecanismos de câmeras diferentes sem explicação.

A cena usa Three.js. Se a renderização 3D não estiver disponível, as explicações textuais das peças e o laboratório permitem continuar. O WebGLRenderer atual utiliza WebGL 2: [documentação do Three.js](https://threejs.org/docs/pages/WebGLRenderer).

### Laboratório de exposição

Exibir uma cena com assunto em movimento, objeto próximo e fundo distante. Controles independentes permitem observar:

- Abertura: entrada de luz e profundidade de campo, mantendo as outras condições da cena.
- Tempo: luminosidade e registro do movimento.
- ISO: resposta de brilho e consequências para a qualidade da imagem, sem representar ISO como entrada adicional de luz.

Adicionar previsão antes da mudança, restauração da cena e comparação entre ajustes. Um desafio de exposição equivalente pode mostrar que imagens com brilho semelhante ainda têm movimento e profundidade diferentes. Identificar a simulação como didática, sem alegar equivalência exata com qualquer câmera.

O fotômetro deve aparecer junto aos controles. A referência zero ajuda a discutir a medição, sem ser tratada como obrigação estética para toda cena. Base técnica para o conteúdo: [guia de exposição da Nikon School](https://nikonschool.co.uk/hints-and-tips/your-essential-guide-to-exposure/pdf).

### Profundidade de campo e seis montagens de luz

Compare f/1.4 e f/22 com brilho igualado e movimento pausado. O plano escolhido fica nítido; planos à frente e atrás variam de nitidez. Troque o foco entre a bola, o fundo e o primeiro plano. No modo de comparação, o fotômetro ainda mostra a exposição calculada, embora o brilho da imagem esteja igualado. Os planos do laboratório e a lente virtual são aproximações didáticas, não medidas extraídas da foto de fundo.

Nos seis exemplos de luz, comece pela vista da câmera e alterne para a montagem 3D: fonte, assunto e câmera têm legendas. Compare frontal, lateral e contraluz, depois fonte pequena/ampla e cores. Alterar a fonte mantém a potência relativa escolhida para facilitar a comparação; a penumbra é aproximada por amostras e filtragem de sombras. Use Restaurar exemplo antes de passar ao seguinte.

### Composição e quiz

Arrastar o enquadramento sobre uma imagem, alternar guias e comparar escolhas. O quiz pode perguntar “o que você mudaria?” e revelar uma explicação visual. Uma primeira versão pode ser conduzida pelo professor, com respostas por mãos levantadas; participação pelo celular depende da estrutura disponível.

### Da foto à arte

Reutilizar uma mesma fotografia como imagem isolada e como base de um cartaz: escolher corte, espaço para texto e contraste para leitura. A turma observa como o destino da imagem influencia a própria captura.

## Uso proposto dos cinco painéis

- Centro de 1920 × 1440: fotografia, demonstração ou pergunta principal.
- Duas torres internas: somente palavras-chave e valores grandes, sem itens pequenos ou controles. A câmera e seu resultado ficam no centro; o fotômetro vem abaixo da imagem no laboratório. As externas continuam vazias; na capa, as quatro ficam vazias.
- Manter frases, rostos e controles essenciais dentro de um segmento; prever áreas seguras junto às bordas.
- Disponibilizar também uma apresentação convencional para ensaios e outros monitores.

O professor confirmou que os painéis funcionam como uma única tela. Na área lógica de 3840 × 1440, as faixas serão: 0–480, 480–960, 960–2880, 2880–3360 e 3360–3840 no eixo horizontal. No ensaio, conferir a resolução de saída e o alinhamento dessas faixas com as divisões físicas do telão.

## Proposta para a prática

Missão sugerida: **“Transforme algo comum em uma imagem que chama atenção.”** Cada grupo escolhe um assunto disponível, produz variações, edita uma foto e entrega título e imagem. Uma frase sobre a intenção pode ajudar na discussão final, se o professor quiser acrescentá-la.

Papéis sugeridos, com revezamento: fotografia, composição/direção, edição e apresentação da ideia. O tamanho dos grupos será definido conforme a turma e os dispositivos disponíveis.

Desafios extras opcionais:

- Fotografar o mesmo assunto de três pontos de vista e justificar a escolha.
- Produzir uma versão com luz direta e outra com luz mais suave.
- Contar uma história sem mostrar rostos.
- Criar uma imagem com espaço reservado para o título de um cartaz.
- Comparar original e edição e explicar uma mudança intencional.

## Entrega, votação e mostra

Fluxo sugerido: entrar na sessão por QR code → identificar o grupo → enviar foto e título → professor liberar a galeria → abrir votação → encerrar votação → revelar destaques.

Recomendações a confirmar:

- Usar nomes de equipe na galeria e liberar imagens para exibição após revisão do professor.
- Impedir a avaliação do próprio grupo e limitar cada participante habilitado a uma avaliação por foto; a identidade de votação deve ser verificada pelo serviço, e não apenas pelo navegador.
- Julgar intenção/criatividade, composição e uso da luz em escala curta, com descrições compreensíveis.
- Na escolha popular, permitir voto em uma favorita entre os outros grupos; os jurados podem usar a rubrica completa.
- Manter “Escolha popular” e “Escolha dos jurados” como resultados separados, sem somar notas com pesos arbitrários.
- Ocultar placares parciais e definir desempates antes da atividade.
- Exibir todas as entregas aprovadas na mostra e destacar vencedores ou categorias, conforme o professor decidir.

## Possível implementação

A arquitetura adotará duas entregas independentes:

- **Apresentação:** aplicação estática no GitHub Pages, com navegação de slides e demonstrações executadas no navegador. O Pages hospeda HTML, CSS e JavaScript: [visão geral do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- **Atividade:** aplicação com hospedagem separada, armazenamento das fotos e persistência das avaliações. O provedor ainda será escolhido. Um link ou QR code na apresentação poderá conduzir os alunos à atividade.

As duas entregas devem poder ser publicadas e testadas independentemente. A apresentação não deve depender do serviço da atividade para explicar o conteúdo ou executar os simuladores.

Recomendação técnica inicial, ainda não escolhida pelo professor: Vite + TypeScript para a aplicação e Three.js apenas nas demonstrações 3D. Há um fluxo documentado de publicação do Vite no GitHub Pages, incluindo configuração de subpasta do repositório: [guia do Vite](https://vite.dev/guide/static-deploy.html).

Um serviço como Supabase pode receber as imagens e persistir avaliações. As regras de acesso e unicidade precisam ser implementadas no serviço; não basta esconder botões. Supabase documenta uploads pelo navegador e políticas de armazenamento: [Storage Quickstart](https://supabase.com/docs/guides/storage/quickstart), [controle de acesso](https://supabase.com/docs/guides/storage/security/access-control). A escolha do fornecedor, das credenciais e do modelo de participação continua em aberto.

Para a aula, sugerimos preparar uma cópia local da apresentação com todos os recursos e uma alternativa de entrega das fotos caso a conexão falhe. Isso ainda precisa ser implementado e ensaiado no computador real.

Na demonstração de edição, priorizar um caminho que funcione nos celulares disponíveis. O Lightroom oferece ferramentas básicas gratuitas, mas a Adobe relaciona edição RAW e outras funções entre os recursos premium; não depender deles para a tarefa sem confirmação de acesso: [FAQ do Lightroom mobile](https://helpx.adobe.com/be_en/lightroom/mobile/get-started/adobe-lightroom-on-mobile-faq.html). A compatibilidade dos arquivos no Snapseed deve ser verificada na versão e nos aparelhos usados: [ajuda do Snapseed](https://support.google.com/snapseed/answer/6203119?hl=en).

