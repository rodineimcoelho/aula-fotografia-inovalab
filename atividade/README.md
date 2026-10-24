# Atividade de fotografia

Aplicação independente para receber uma fotografia editada e um título por grupo, permitir revisão pelo professor e exibir as imagens aprovadas em uma mostra. Não há votação, notas, jurados ou classificação.

## Executar localmente

Requer Node.js 22.16 ou superior. Não há dependências npm externas nesta aplicação.

```sh
cd atividade
npm start
```

Abra `http://127.0.0.1:3001` para participar e `http://127.0.0.1:3001/admin` para o painel do professor. Na primeira execução sem `ADMIN_KEY`, a chave temporária do painel aparece no terminal; ela muda a cada reinício.

Para conservar a chave, copie `.env.example` para `.env` nesta pasta e preencha `ADMIN_KEY` com uma chave longa e exclusiva. Nunca use a chave do professor como código de aluno nem a inclua na apresentação.

## Conduzir uma sessão

1. No painel, crie uma sessão com o título da atividade.
2. Adicione a quantidade necessária de grupos.
3. Gere códigos individuais para os participantes e baixe o CSV. Os códigos originais não são guardados em texto aberto no banco.
4. Distribua um código por pessoa. Cada participante informa o código da sessão, seu código individual e o grupo.
5. Compartilhe o link da sessão. Ele pode ser inserido nas opções da apresentação para criar um QR Code de envio.
6. Cada grupo envia uma foto e um título. Qualquer integrante pode substituir a versão enquanto os envios estiverem abertos; a nova imagem volta para revisão.
7. Revise as fotos no painel: aprove as adequadas ou solicite nova entrega.
8. Após aprovar pelo menos uma foto, encerre os envios para liberar a mostra.
9. A turma pode navegar pelas fotografias aprovadas, com animação e título visível. Não há votos ou placares.

Para repetir a experiência, crie uma nova sessão.

## Imagens e armazenamento

- O navegador reduz a fotografia para até 2400 pixels no lado maior e exporta JPEG, removendo metadados nessa cópia.
- A API aceita JPEG, PNG e WebP de até 8 MB, com verificação da assinatura do arquivo.
- Banco SQLite: `data/atividade.sqlite`; imagens: `data/uploads/`.
- Fotos são servidas ao professor, ao próprio grupo ou, depois da abertura da mostra, aos participantes para imagens aprovadas.
- Tokens e códigos são armazenados em hash no banco. Faça backup do diretório de dados inteiro quando a aplicação estiver parada; não publique essa pasta no GitHub.

## Hospedagem separada

Esta aplicação precisa de Node.js e disco persistente. Não pode ser hospedada no GitHub Pages nem em uma função sem persistência.

```sh
docker compose --env-file atividade/.env -f atividade/compose.yaml up --build -d
```

O comando deve ser executado na raiz do projeto. A porta do Compose fica vinculada a `127.0.0.1:3001`; configure o proxy HTTPS da hospedagem para encaminhá-la. O volume `fotos-da-aula` mantém banco e fotos entre reinícios. Não execute mais de uma réplica sobre o mesmo diretório SQLite.

Para ensaio na rede local, `HOST=0.0.0.0` permite que o servidor escute a interface de rede; os celulares devem abrir o endereço de rede do computador, não `127.0.0.1`. A disponibilidade depende da rede e do firewall do local. Hospedagem pública e URL final estão em `../PENDENCIAS-MANHA.md`.

## Testes

```sh
npm test
```

Os testes usam banco temporário e verificam isolamento entre sessões, revisão das fotos e acesso à galeria.

## Licença da fonte

Figtree é distribuída sob SIL Open Font License 1.1. A cópia local de `public/font.woff2` acompanha `public/OFL.txt`; fontes e fotografias da apresentação são documentadas em `../ASSETS.md`.
