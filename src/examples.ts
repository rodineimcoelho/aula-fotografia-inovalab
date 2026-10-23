export type Example = { name: string; text: string; image?: string; alt: string; diagram?: string };

const frame = (content: string, label: string) => `<svg viewBox="0 0 720 420" role="img" aria-label="${label}" class="example-diagram"><rect x="30" y="25" width="660" height="370" fill="#202125" stroke="#707173" stroke-width="2"/>${content}</svg>`;
const dot = (x: number, y: number, r = 32, color = '#cf786f') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;

export const compositions: Example[] = [
  { name: 'Regra dos terços', image: 'composicao-tercos.png', alt: 'Pessoa em silhueta no terço direito de uma praia, com grade de terços incorporada', text: 'A pessoa ocupa o terço direito; o horizonte fica perto do terço inferior. As interseções ajudam a distribuir o interesse.' },
  { name: 'Linhas que conduzem', image: 'longa-exposicao-big-ben.jpg', alt: 'Rastros de luz convergindo em direção à torre do Big Ben', text: 'Siga os rastros de luz: eles conduzem o olhar em profundidade. Procure caminhos semelhantes em ruas, corredores e corrimãos.' },
  { name: 'Diagonais e movimento', image: 'longa-exposicao-parque.jpg', alt: 'Brinquedo de parque com rastros circulares e estrutura em diagonal', text: 'A estrutura inclinada e os arcos de luz criam direção e energia. Diagonais podem tornar o quadro mais dinâmico.' },
  { name: 'Espaço negativo', image: 'contraluz-palco.jpg', alt: 'Guitarrista à direita com área escura à esquerda', text: 'A área menos ocupada à esquerda dá respiro ao músico e pode receber um título. Vazio também participa da composição.' },
  { name: 'Centro e simetria', alt: 'Diagrama com círculo central e formas refletidas em torno de um eixo vertical', text: 'O centro pode dar força ao assunto. A simetria equilibra os dois lados: experimente uma porta, uma fachada ou seu reflexo.', diagram: frame(`<path d="M360 25V395" stroke="#efefec" stroke-width="2" stroke-dasharray="7 8"/><g fill="none" stroke="#707173" stroke-width="3"><path d="M100 350V95H250V350M470 350V95H620V350"/></g>${dot(360,210,48)}`, 'Composição central e simétrica') },
  { name: 'Moldura dentro do quadro', alt: 'Diagrama com três retângulos formando uma moldura ao redor de um círculo', text: 'Uma janela, porta ou galho pode cercar o assunto e concentrar a atenção. Observe se a moldura ajuda ou compete com ele.', diagram: frame(`<g fill="#424346"><rect x="110" y="75" width="55" height="280"/><rect x="555" y="75" width="55" height="280"/><rect x="110" y="75" width="500" height="55"/></g>${dot(360,245,43)}`, 'Moldura dentro do quadro') },
  { name: 'Repetição e quebra de padrão', alt: 'Diagrama de círculos repetidos, com um círculo de cor diferente', text: 'A repetição cria ritmo. Um elemento diferente pode virar o ponto de interesse. Busque cadeiras, pisos, janelas ou objetos alinhados.', diagram: frame([100,230,360,490,620].flatMap(x=>[105,210,315].map(y=>dot(x,y,25,x===490&&y===210?'#cf786f':'#707173'))).join(''), 'Repetição com quebra de padrão') },
  { name: 'Planos e profundidade', alt: 'Diagrama com formas de tamanhos diferentes parcialmente sobrepostas em três planos', text: 'Primeiro plano, assunto e fundo criam camadas. Mude de lugar para separar o assunto de um fundo que atrapalha.', diagram: frame(`<path d="M30 300H690M30 150H690" stroke="#424346" stroke-width="2"/>${dot(505,122,24,'#707173')}${dot(365,225,53)}<rect x="75" y="245" width="100" height="150" fill="#b6b7b8"/>`, 'Três planos de composição') },
];

function directionDiagram(direction: 'front' | 'side') {
  const source = direction === 'front' ? [360,340] : [110,210];
  return frame(`<g fill="none" stroke="#cf786f" stroke-width="3"><path d="M${source[0]} ${source[1]}L330 190M${source[0]} ${source[1]}L390 190"/></g><rect x="${source[0]-25}" y="${source[1]-10}" width="50" height="20" fill="#efefec"/>${dot(360,190,38,'#b6b7b8')}<path d="${direction==='front'?'M330 135H390':'M415 165V215'}" stroke="#707173" stroke-width="5"/><g fill="#efefec" font-family="Figtree,sans-serif" font-size="23"><text x="${source[0]+35}" y="${source[1]+8}">Fonte</text><text x="290" y="105">Assunto</text><text x="265" y="385">Vista de cima</text></g>`, `${direction==='front'?'Luz frontal':'Luz lateral'}, esquema visto de cima`);
}

const shadowDiagram = frame(`<defs><linearGradient id="shadow-edge"><stop stop-color="#202125"/><stop offset=".25" stop-color="#707173"/><stop offset=".75" stop-color="#707173"/><stop offset="1" stop-color="#202125"/></linearGradient></defs><rect x="105" y="115" width="205" height="180" fill="#707173"/><rect x="410" y="115" width="205" height="180" fill="url(#shadow-edge)"/><g fill="#efefec" font-family="Figtree,sans-serif" font-size="24" text-anchor="middle"><text x="207" y="75">Luz dura</text><text x="512" y="75">Luz suave</text><text x="207" y="345">Borda marcada</text><text x="512" y="345">Transição gradual</text></g>`, 'Comparação esquemática de bordas de sombra: marcada na luz dura, gradual na luz suave');

export const lightingExamples: Example[] = [
  { name: 'Contraluz no palco', image: 'contraluz-palco.jpg', alt: 'Fonte de luz atrás de um guitarrista, desenhando as bordas de seu corpo', text: 'A luz vem de trás do músico e destaca seu contorno. O lado voltado para a câmera pode ficar mais escuro; medir para o fundo ou para a pessoa muda o resultado.' },
  { name: 'Silhueta em luz natural', image: 'composicao-tercos.png', alt: 'Pessoa escura diante do céu claro em uma praia, com grade já incorporada', text: 'Ao preservar o céu mais claro, a pessoa aparece em silhueta. Aqui o contraste ajuda a contar a cena; nem toda sombra precisa ser clareada.' },
  { name: 'Luz frontal', diagram: directionDiagram('front'), alt: 'Esquema visto de cima: fonte diante do assunto e sombra atrás', text: 'A fonte está no mesmo lado da câmera. Ela ilumina o que vemos e tende a esconder parte das sombras atrás do assunto, reduzindo a sensação de volume.' },
  { name: 'Luz lateral', diagram: directionDiagram('side'), alt: 'Esquema visto de cima: fonte à esquerda do assunto e sombra à direita', text: 'A luz de lado separa regiões claras e escuras. Isso evidencia relevo, textura e volume. Experimente girar uma pessoa perto de uma janela.' },
  { name: 'Luz dura e luz suave', diagram: shadowDiagram, alt: 'Comparação da borda de uma sombra marcada e uma sombra suave', text: 'Alterne entre fonte pequena e ampla e observe as bordas da sombra no 3D. Uma fonte aparentemente maior tende a produzir uma transição mais suave.' },
  { name: 'Cor da luz', image: 'capa-guitarrista.jpg', alt: 'Guitarrista iluminado por luzes de palco de cores diferentes', text: 'Fontes de cores diferentes podem mudar pele, roupas e ambiente. O balanço de branco ajusta a interpretação da cor; misturar luzes pode exigir uma escolha criativa.' },
];

export function exampleMarkup(example: Example, base: string): string {
  return example.image ? `<img src="${base}${example.image}" alt="${example.alt}">` : example.diagram!;
}
