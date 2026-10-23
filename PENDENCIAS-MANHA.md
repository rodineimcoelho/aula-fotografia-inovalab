# Para revisar de manhã

As decisões abaixo não bloquearam a construção. A apresentação e a atividade já têm versões locais testadas. São escolhas provisórias para revisar antes da aula.

| Assunto | Escolha provisória | O que confirmar |
| --- | --- | --- |
| Repositório | Projeto preparado para GitHub Pages por GitHub Actions. | Conta, nome do repositório e URL definitiva. |
| Atividade | Aplicação Node separada, com armazenamento SQLite e arquivos em disco persistente. | Servidor ou hospedagem disponível e endereço HTTPS. |
| Turma | Grupos e códigos individuais criados pelo professor no painel. | Quantidade aproximada e como distribuir os códigos na chegada. |
| Avaliação | Composição, uso da luz e intenção/criatividade, notas de 1 a 5, resultados populares e dos jurados separados. | Critérios e desempate; confirmar participação de jurados. |
| Missão | Uma fotografia editada por grupo, com título; sem exigir cartaz adicional na entrega. | Tema ou restrições do espaço da escola. |
| Quiz | Conduzido pelo professor, com respostas e explicações no telão. | Se deseja participação individual conectada em uma próxima etapa. |
| Telão | Faixas 1–1–4–1–1, só o centro com conteúdo; saída única. | Resolução efetiva e teste com o operador. |
| Materiais | Fotografias didáticas locais e câmera 3D esquemática, sem marca comercial. | Se deseja incluir exemplos ou fotos próprias. |

As notas ao professor incluem uma versão de 50 minutos de teoria. A apresentação tem uma cópia estática de produção para ensaio e não depende da atividade para mostrar o conteúdo.

## Começar o ensaio

1. Abra a apresentação local em `http://127.0.0.1:5173/` enquanto o servidor de desenvolvimento estiver ativo. Para reiniciá-lo, execute `npm run dev` na raiz.
2. Use as setas para navegar, **I** para índice, **N** para notas e **F** para tela cheia.
3. Para iniciar a atividade separada, execute `npm --prefix atividade start`. Acesse `http://127.0.0.1:3001/admin` para o professor e `http://127.0.0.1:3001` para participantes.
4. A chave do professor fica no ambiente do servidor; sem uma chave configurada, o comando de início mostra uma chave temporária. Se houver uma prévia local já iniciada, a configuração está em `atividade/.env`, arquivo ignorado pelo Git.
5. Crie uma sessão de ensaio, dois grupos e alguns códigos. Envie duas fotos, aprove, vote e revele os resultados antes de usar com a turma.
6. Depois de escolher a URL pública da atividade, copie o link da sessão para as opções da apresentação. O slide da mostra gera o QR code.

O pacote da apresentação contém somente o build estático. A aplicação da atividade é uma entrega separada, com Node e armazenamento persistente. Consulte `README.md`, `atividade/README.md` e `VERIFICACAO.md` para os comandos e limites testados.

## Atualização com a aula anterior

A capa agora contém somente o título. A definição formal vem do Priberam; a arte Fotografia.png fornecida é prioritária. A sequência soma 60 minutos de teoria e 60 de organização/prática/mostra. Cinco fotos complementares vieram do PPTX; exemplos adicionais usam diagramas identificados. A fonte não informa todos os fotógrafos nem os parâmetros reais de captura. A fotografia de praia já tinha a grade incorporada. O PPTX original foi preservado. Não é necessária uma resposta para ensaiar esta versão.
