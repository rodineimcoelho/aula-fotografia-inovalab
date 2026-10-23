# Atividade de fotografia

Aplicação independente para receber uma fotografia editada por grupo, moderar as entregas, coletar avaliações individuais e exibir resultados populares e dos jurados separadamente.

## Executar localmente

Requer Node.js 22.16 ou superior. Não há dependências npm externas nesta aplicação.

```sh
cd atividade
npm start
```

Abra `http://127.0.0.1:3001` para participar e `http://127.0.0.1:3001/admin` para o painel do professor. Na primeira execução sem `ADMIN_KEY`, a chave temporária do painel aparece no terminal. Ela muda a cada reinício; os dados da aula permanecem no disco.

Para conservar a chave, copie `.env.example` para `.env` nesta pasta e preencha `ADMIN_KEY` com uma chave longa e exclusiva. O comando `npm start` carrega esse arquivo se existir. Nunca use a chave do professor como código de aluno nem a inclua na apresentação.

## Conduzir uma sessão

1. No painel, crie uma sessão com o título da atividade.
2. Adicione quantos grupos forem necessários. É possível acrescentar grupos durante a fase de entregas.
3. Gere códigos individuais para os participantes e, se houver, para os jurados. Baixe o CSV assim que forem gerados: os códigos originais não são guardados em texto aberto no banco.
4. Distribua um código por pessoa. O aluno informa o código da sessão, seu código individual e o grupo; jurados usam o código de jurado e não escolhem grupo.
5. Compartilhe o link da sessão. Cole-o nas opções da apresentação para exibir um QR code no slide da mostra.
6. Cada grupo envia uma foto e um título. Qualquer participante daquele grupo pode enviar uma nova versão enquanto as entregas estiverem abertas; ela substitui a anterior e volta para revisão.
7. Revise as fotos no painel. Aprove as adequadas ou solicite uma nova entrega. Fotos pendentes não entram na galeria dos outros grupos.
8. Com pelo menos duas fotos aprovadas, encerre as entregas e abra a votação.
9. Participantes avaliam fotos dos outros grupos; jurados avaliam todas as fotos aprovadas. Cada pessoa tem uma avaliação por fotografia, editável até o encerramento.
10. Encerre a votação e revele os resultados. Não há placar parcial para participantes, jurados ou professor.

O sistema impede avaliação do próprio grupo e registra a unicidade no banco. A identidade é o código individual distribuído pelo professor; compartilhar um código permite usar a mesma identidade, sem criar um voto extra. Reentrar com o código encerra o token anterior e permite continuar no mesmo grupo.

## Critérios e cálculo

Os critérios provisórios são composição, uso da luz e intenção/criatividade, cada um com notas de 1 a 5 e o mesmo peso. A média de cada pessoa é `(composição + luz + intenção) / 3`; a nota final da foto é a média das avaliações da categoria. Participantes e jurados são calculados separadamente. Empates na média são mostrados como empates; não há desempate inventado.

Somente fotografias aprovadas aparecem na mostra. Uma categoria sem avaliações informa isso explicitamente. As etapas são sequenciais: entregas → votação → resultados; para repetir a experiência, crie uma nova sessão.

## Imagens e armazenamento

- O navegador reduz a fotografia para até 2400 pixels no lado maior e exporta JPEG, removendo os metadados nessa cópia.
- A API aceita JPEG, PNG e WebP de até 8 MB, com verificação da assinatura do arquivo.
- Banco SQLite: `data/atividade.sqlite`; imagens: `data/uploads/`.
- Fotos só são servidas após autenticação, para o próprio grupo/professor ou, após a abertura da galeria, se aprovadas.
- Tokens e códigos são armazenados em hash no banco. O aluno conserva o token de acesso no navegador; o professor conserva a chave somente na sessão do navegador.
- Faça backup do diretório de dados inteiro quando a aplicação estiver parada. Não publique essa pasta no GitHub.

## Hospedagem separada

Esta aplicação precisa de Node.js e disco persistente. Não é um backend para hospedar no GitHub Pages nem em uma função sem persistência. Pode ser executada em um servidor Node ou no contêiner incluído, com HTTPS no proxy de entrada.

```sh
docker compose --env-file atividade/.env -f atividade/compose.yaml up --build -d
```

O comando acima deve ser executado na raiz do projeto. A porta do Compose fica vinculada a `127.0.0.1:3001`; configure o proxy HTTPS da hospedagem para encaminhá-la. O volume `fotos-da-aula` mantém banco e fotos entre reinícios. Não execute mais de uma réplica sobre o mesmo diretório SQLite.

Para um ensaio na rede local, `HOST=0.0.0.0` permite que o servidor escute a interface de rede; os celulares devem acessar o endereço de rede do computador, não `127.0.0.1`. A disponibilidade real depende da rede e do firewall do local. Hospedagem pública e URL final estão em `../PENDENCIAS-MANHA.md`.

## Testes

```sh
npm test
```

Os testes usam banco temporário e verificam isolamento entre sessões, revisão das fotos, bloqueio de autoavaliação, unicidade das avaliações e separação dos resultados.

## Licença da fonte

Figtree é distribuída sob SIL Open Font License 1.1. A cópia local de `public/font.woff2` acompanha `public/OFL.txt`; fontes e fotografias da apresentação são documentadas em `../ASSETS.md`.
