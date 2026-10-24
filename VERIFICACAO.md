# Verificação da entrega

## O que está implementado

- Apresentação de 20 slides, em português, com 45 minutos de teoria/demonstrações e 75 de organização, prática e mostra.
- Faixas 1–1–4–1–1 e altura completa. Em Telão ≥1200px, as torres internas exibem somente palavras-chave e valores grandes; torres externas vazias. Controles, câmera e imagem resultado permanecem no centro. No celular, modelo e resultado ficam empilhados.
- Capa com título, ilustração geométrica animada e QR Code da apresentação para acompanhar pelo celular; verbete formal atribuído ao Priberam; prioridade para a arte Fotografia.png, com fotos complementares do PPTX.
- Oito tipos de composição e seis exemplos de iluminação com cena 3D, referência, montagem identificada, vista pela câmera e ajustes de luz.
- Desfoque por profundidade no laboratório e na prévia 3D; foco selecionável em três planos e brilho igualado opcional.
- Diafragma manipulável, câmera 3D desmontável, fluxo de luz bloqueado pelas peças, acúmulo de luz, ganho ISO/ruído e prévia fotográfica de uma cena 3D, exposição com profundidade/movimento/ruído, fotômetro, enquadramento, comparação de edição, estudo de camadas/mesclagem/opacidade/tipografia, quiz e cronômetro.
- Seleção da câmera com conjunto completo visível, coral, brilho e contorno claro; Limpar destaque restaura materiais e Disparar preserva a seleção. A identificação da peça não reduz a altura do modelo.
- Roteiro do professor e recursos locais, incluindo logos de Lightroom e Snapseed. Quiz coletivo com todas as seis perguntas; cronômetros de captura/edição/envio em 25/20/5 minutos.
- Roteiro guiado pelas setas, Page Up/Page Down ou espaço, com 82 estados nas nove demonstrações. Voltar restaura a etapa anterior; Shift+seta troca diretamente de slide. Controles e opções usadas nas etapas permanecem abertos no centro para que a turma veja os valores mudarem; há um modo alternativo de navegação somente por slides. Torres centralizadas nos dois eixos.
- Iluminação percorre Exemplo → Montagem 3D → Pela câmera nos seis casos. Produção guiada compara seis modos representativos de mesclagem, com fotos e opacidade de 65% constantes; os 16 modos permanecem no seletor manual.
- Modo professor estático em `?professor=1`, com tópicos curtos por slide, etiquetas da etapa e antecipação da próxima etapa. Navegação manual independente, sem sincronização; posição restaurada pela URL e sem alteração dos dados salvos da projeção.
- Fotômetro sob a imagem de “Congele sem escurecer”, slide 6 sem o botão redundante e encerramento somente textual. O quiz guiado revela respostas sem registrar pontuação pessoal; retornar à prática preserva o cronômetro em andamento.
- Atividade separada: grupos variáveis, códigos individuais, foto e título, revisão do professor, votos por critério e resultados populares/jurados separados.
- Sem hospedagem da atividade, a mostra local aceita fotografias no computador do telão, edição de títulos e lançamento manual de votos populares/notas dos jurados. Os dados permanecem somente na aba atual e não recebem envios ou votos dos celulares.

## Checagens concluídas

| Checagem | Resultado |
| --- | --- |
| TypeScript e build do Vite | Passou; `dist/` contém somente arquivos estáticos. |
| Modelos de exposição, relógio, validação, sequência de 120 minutos, roteiro e cobertura dos tópicos | 9 testes passaram. |
| Ciclo da API da atividade | Passou; testou isolamento de sessões, acesso às imagens, revisão, etapas, autoavaliação, unicidade e separação dos resultados. |
| Navegador Chrome isolado | 32 cenários; 31 passaram na rodada completa, e o cenário da capa, cuja expectativa antiga exigia apenas o título, passou após ser atualizado para o QR Code. A mostra local, as seis mesclagens guiadas, os 16 modos manuais e a independência do professor também passaram. |
| Build servido em subpasta `/aula-fotografia-inovalab/` | Passou com fotografias, logos locais, fonte, câmera, navegação guiada, quiz de seis questões, modo professor independente e roteiro de 20 slides; zero requisições externas. |
| Proporções no desktop | 1440 × 900: colunas 180–180–720–180–180. |
| Proporções no telão | 3840 × 1440: colunas 480–480–1920–480–480. |
| Celular | 390 × 844: modo estudo legível e atividade responsiva. |
| Origem das fotografias | Metadados presentes; varredura dos arquivos fonte/build sem rasters de origem ausente. |
| Revisão independente da atualização atual | 15 capturas em desktop, telão e celular. Roteiro ampliado e centralização receberam `ship`, sem correções materiais pendentes, em `full-tour-review.md`. |

As 15 capturas atuais estão em `.impeccable/review/full-tour-*.png`, com medidas em `full-tour-layout.json`: desktop 1440 × 900, telão lógico 3840 × 1440 e celular 390 × 844, sem erros de execução, rolagem horizontal ou corte dos textos das torres. O parecer `full-tour-review.md` cobre o roteiro ampliado e a centralização. Após incluir a rolagem da etapa ativa, os quatro testes do professor passaram novamente; build estático, teste em subpasta e pacote de entrega estão atualizados. As capturas `teacher-*.png` e `guided-*.png` registram atualizações anteriores. Os testes usam participantes, códigos, fotos de exemplo e banco temporário; não incluem dados reais de alunos.

Atualização Inovalab: as legendas de procedência dos exemplos foram retiradas; o estudo final usa Overlay, título Inovalab embaixo e fundo de leitura desativado. O modo professor e o roteiro imprimível usam tópicos, sem falas sugeridas. Capturas em `.impeccable/review/inovalab-*.png` cobrem poster no telão e professor em desktop/celular; o estado calculado do poster confirma `overlay`, posição `bottom` e fundo transparente. Os cenários do professor passaram após o ajuste de rolagem.

Atualização do destaque da câmera: três testes focados (câmera, ISO e desfoque) passaram, assim como o build e a verificação estática em subpasta. Quinze capturas cobrem as quatro seleções e a limpeza do destaque em desktop, telão e celular. A revisão identificou redução de escala no telão; o cabeçalho foi reposicionado e a correção recebeu `ship`, limitado a esse ajuste, em `.impeccable/review/camera-focus-verdict.md`.

O enxugamento está aplicado. As notas de oito slides foram incorporadas às demonstrações e preservadas em `CONTEUDO-DE-APOIO.md`. Os ícones oficiais locais têm procedência embutida: quatro arquivos PNG verificados entre fonte e build, nenhum sem origem. O parecer atual está em `.impeccable/review/trimmed-review.md` e a correção do quiz em `.impeccable/review/trimmed-verdict.md`.

A simplificação visual posterior foi inspecionada em 35 capturas de computador, telão e celular, incluindo opções recolhidas e abertas. A revisão identificou corte na torre da câmera expandida e uma associação semântica da legenda de composição; ambas as correções receberam `ship` em `.impeccable/review/clean-verdict.md`. O teste de transição entre torres e celular também passou com as verificações de enquadramento e descrição acessível. Build estático final e pacote de entrega atualizados.

## Limites da verificação

- Chrome foi executado; Edge não foi executado separadamente.
- A câmera 3D depende de WebGL 2; há uma alternativa textual para continuar a explicação.
- O simulador é didático e não promete equivalência física exata com um modelo comercial.
- A câmera 3D é carregada sob demanda. O módulo compartilhado de Three.js tem cerca de 531 kB sem compressão e é carregado com os módulos da câmera e da prévia, o que gera um aviso de tamanho do Vite, sem impedir o build.
- SQLite e remoção de tipos TypeScript em Node 22.16 exibem avisos experimentais, sem falha nos testes.
- O contêiner Docker foi preparado, mas não foi iniciado neste ambiente; a aplicação Node foi testada diretamente.
- Ainda não há publicação no GitHub Pages nem hospedagem pública da atividade: faltam repositório/endereço do usuário e servidor de destino.
- O alinhamento e a leitura no telão físico dependem do ensaio com o operador. O monitor de teste reproduziu as medidas lógicas.

## Repetir os testes

```sh
npm ci
npm test
npm --prefix atividade test
npm run build
npm run test:static
```

Para repetir os testes da interface, inicie `npm run dev` em outro terminal e execute `npm run test:ui`. O Chrome precisa estar instalado.




A definição foi isolada no slide 2 e a foto no slide 3. A alteração passou em três cenários de navegador e na verificação do build estático. Revisão visual: ship, com nove capturas, em .impeccable/review/definition-split-review.md. A duração total permanece em 120 minutos.

