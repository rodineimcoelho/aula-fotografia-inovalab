# Fotografia e Produção de Imagens

Apresentação interativa para uma aula presencial de duas horas, voltada a alunos de aproximadamente 12 a 17 anos.

A versão local contém 20 slides, notas para o professor, capa somente tipográfica, verbete formal atribuído ao Priberam em um slide próprio, foto de referência no slide seguinte, câmera 3D desmontável com luz bloqueada pelas peças, ajustes de abertura/tempo/ISO e uma prévia de cena 3D, iluminação com exemplos, oito tipos de composição, laboratório de exposição, composição, comparação de edição, estudo de camadas, blend modes, opacidade e tipografia, quiz e cronômetro da prática. O tema é escuro, com o assunto principal no centro. Em Telão ≥1200px, as duas torres internas mostram somente palavras-chave e valores grandes; controles e imagens ficam no centro.

O enxugamento de [PROPOSTA-ENXUGAMENTO.md](PROPOSTA-ENXUGAMENTO.md) foi aplicado: 20 slides e uma divisão de 45/75 minutos. Notas dos oito slides incorporados estão em [CONTEUDO-DE-APOIO.md](CONTEUDO-DE-APOIO.md). Links antigos levam à demonstração que recebeu o conceito.

O roteiro por setas é o padrão: →, Page Down ou espaço executa a próxima etapa; ← ou Page Up volta à etapa anterior; após as etapas, a navegação troca de slide. Shift+seta pula diretamente de slide. A câmera e a prévia ficam juntas no centro, e o fotômetro fica sob a imagem do laboratório. As torres não têm controles, parágrafos ou imagens pequenas. Os controles permanecem visíveis no centro enquanto o roteiro altera seus valores, inclusive comparação de foco, ajustes de luz e opções de tipografia. Em Opções → Navegação é possível escolher Somente trocar slides. Escape fecha o painel aberto ou libera o foco para navegar.

O **modo professor** fica em `?professor=1` (prévia local: `http://127.0.0.1:5173/?professor=1#inicio`) e também tem um link em Opções. Abra esse modo no notebook e a apresentação normal no computador do telão. Cada um avança manualmente, de forma independente. O professor vê tópicos curtos do slide e da etapa atual, a lista de etapas e a próxima ação, sem falas prontas. É possível selecionar qualquer slide ou etapa diretamente. A URL guarda a posição ao atualizar a página. O modo funciona estaticamente e não altera a posição nem as respostas salvas da projeção.

O roteiro atual tem 92 etapas: inclui as seis questões do quiz, Exemplo → Montagem 3D → Pela câmera nos seis casos de iluminação e os 16 modos de mesclagem de [Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/#blending). O seletor agrupa os modos por efeito; a comparação mantém as duas fotos e opacidade de 65%, antes de adicionar o título. As explicações foram conferidas também com a [documentação da Adobe](https://helpx.adobe.com/photoshop/desktop/repair-retouch/adjust-light-tone/blending-mode-descriptions.html). Os textos grandes das torres ficam centralizados. O tempo planejado da aula permanece em 120 minutos; use as comparações de mesclagem como uma passagem breve por famílias de efeitos.

A aplicação separada de envio, revisão e votação está em [atividade/README.md](atividade/README.md). As decisões para revisão de manhã estão em [PENDENCIAS-MANHA.md](PENDENCIAS-MANHA.md).

## Desenvolvimento

Requer Node.js 22.12 ou superior e npm.

```sh
npm ci
npm run dev
```

## Build estático

```sh
npm run build
npm run preview
```

O resultado de produção fica em `dist/`. Vite compila TypeScript e empacota JavaScript, CSS e recursos; a hospedagem recebe apenas arquivos estáticos. Não é necessário executar Node.js no servidor de produção.

A configuração usa `base: './'`, de modo que os recursos possam ser carregados também quando a apresentação é publicada em uma subpasta de repositório no GitHub Pages. A navegação da apresentação deve usar fragmentos de URL, sem depender de reescrita de rotas pelo servidor.

Sirva a pasta `dist/` por HTTP durante ensaios locais; abrir o HTML diretamente por `file://` não reproduz o ambiente de publicação dos módulos JavaScript.

## Publicação no GitHub Pages

1. Envie o projeto a um repositório do GitHub com a branch principal `main`.
2. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**.
3. O workflow `.github/workflows/pages.yml` instala as dependências pelo lockfile, gera o build e publica somente `dist/`.
4. Acompanhe a execução em **Actions** e use o endereço indicado na etapa de publicação.

O repositório remoto e a publicação efetiva ainda precisam ser definidos. Os arquivos de contexto e as referências da skill não entram em `dist/`.

Referência: [publicação estática com Vite](https://vite.dev/guide/static-deploy.html).

## Telão e estrutura da aula

- Área lógica: 3840 × 1440, apresentada ao computador como uma única tela.
- Centro: 1920 × 1440; quatro torres: 480 × 1440 cada, duas por lado.
- Navegadores previstos: Chrome e Edge.
- Contexto confirmado: [PRODUCT.md](PRODUCT.md).
- Roteiro proposto: [PLANO-AULA.md](PLANO-AULA.md).

## Aplicação da atividade

O envio de fotos e a votação pertencem a uma aplicação separada. A apresentação não deve depender desse serviço para executar o conteúdo didático. A hospedagem, as regras de participação e a conexão entre as duas entregas ainda serão definidas.

Para iniciar a aplicação local, execute `npm --prefix atividade start` em outro terminal. O painel fica em `http://127.0.0.1:3001/admin`; a página de participantes fica em `http://127.0.0.1:3001`. A chave temporária do professor aparece no terminal, a menos que `ADMIN_KEY` já esteja definida. A aplicação usa Node e SQLite e não é incluída no build estático de `dist/`.

## Conduzir e ensaiar

- Use as setas ou espaço para navegar. A capa contém somente o título, com uma seta para avançar; I, N e F também funcionam nela.
- **I** abre o índice; **N** abre notas; **F** solicita tela cheia; **Esc** fecha o painel aberto. As notas aparecem na própria janela, portanto feche-as antes de projetar novamente.
- As setas em controles deslizantes alteram o controle, sem trocar de slide.
- Nas opções, use **Telão** para a divisão 1–1–4–1–1 ou **Estudo** para ampliar o centro. Celulares iniciam em modo estudo.
- **Mostrar divisões do telão** revela as cinco áreas para alinhar a saída com o operador. Desative depois do ensaio.
- Arraste a câmera para girar, use Desmontar câmera para separar todas as peças e selecione uma delas pelos botões. O conjunto continua visível: a peça aumenta 40% e recebe coral, brilho e contorno claro, enquanto as demais mantêm sua escala e ficam mais neutras. Limpar destaque recupera as cores; Disparar preserva a seleção. Ajuste Diafragma, Tempo e ISO. Disparar mostra uma sequência desacelerada: a luz para no obturador fechado e se acumula no sensor durante a abertura. A prévia usa uma cena 3D com movimento e ruído didáticos. ISO amplifica o sinal sem aumentar a luz capturada. Se a renderização 3D não estiver disponível, os textos das peças permitem continuar a explicação.
- O laboratório usa uma cena didática, com brilho relativo à referência da cena; não promete reproduzir exatamente qualquer câmera real.
- O quiz é coletivo e fica no navegador do professor; as explicações aparecem após cada resposta.
- Os cronômetros de captura, edição e envio podem ser pausados e não mudam o slide automaticamente.
- No slide da mostra, vincule o endereço da atividade pelas opções. A apresentação gera o QR code localmente.

O roteiro do professor é gerado pelo build em `dist/roteiro.html` e também pode ser aberto em outra aba. Os recursos essenciais são locais: para ensaiar sem internet, execute a cópia local por HTTP. O endereço público da atividade depende da hospedagem separada.

## Verificação

```sh
npm test
npm --prefix atividade test
npm run test:ui
npm run build
npm run test:static
```

Os testes de navegador usam o Chrome instalado, com perfil de teste isolado. Verificam o layout em 1440 × 900, 3840 × 1440 e 390 × 844, controles, câmera, simulador, quiz e o fluxo de entrega/revisão/votação. A aplicação da atividade usa banco temporário nesses testes; dados reais não são apagados.

`test:static` serve somente os arquivos já gerados em `dist/`, montados na subpasta `/aula/`, para conferir navegação, fotos, fonte, roteiro e importação da câmera sem qualquer requisição a CDN ou serviço externo.

A sequência soma 120 minutos: 45 de teoria/demonstrações, 5 de organização, 25 de captura, 20 de edição, 5 de envio, 19 de avaliação/mostra e 1 de encerramento.

## Recursos fotográficos

As fotografias didáticas são distribuídas localmente para que a apresentação não dependa de URLs de imagem externas durante a aula. A origem de cada arquivo está registrada em seus metadados e em [ASSETS.md](ASSETS.md).

A arte fornecida Fotografia.png é a referência prioritária no slide de foto após a definição, além dos slides de ponto de vista e produção. O encerramento contém somente texto. No slide de produção, Experimentar camadas abre um novo estudo com duas fotos do PPTX; essas não são as camadas originais do arquivo achatado. A arte final usa o nome Inovalab, mesclagem Overlay, título embaixo e nenhum fundo de leitura. As legendas dos exemplos não exibem a procedência das fotos nem classificam diagramas.

## Foco e iluminação

No laboratório, selecione Bola, Fundo ou Primeiro plano em Plano em foco. Igualar brilho para comparar desfoque mantém a visualização legível ao variar a abertura; o fotômetro continua mostrando a exposição calculada. A prévia da câmera oferece a mesma comparação de brilho e usa amostras de uma lente virtual para desfocar planos em profundidades diferentes.

Em De onde vem essa luz?, cada um dos seis exemplos tem 3D pela câmera, montagem identificada e a fotografia/esquema de referência. Ajustar a luz permite variar direção, tamanho da fonte, potência e cor; Restaurar exemplo recupera o preset. No celular, os ajustes são recolhíveis e a explicação retorna ao fechá-los. Os modelos ilustram os princípios e não reproduzem as fotografias originais.

