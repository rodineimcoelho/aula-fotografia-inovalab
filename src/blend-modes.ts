// Modos de mesclagem de Compositing and Blending Level 1 (W3C).
// Referências didáticas: W3C e Adobe, registradas no README.
export const blendModes=[
 {id:'normal',name:'Normal',label:'Normal',group:'Normal',effect:'A camada superior cobre a base conforme a opacidade.',ask:'Que parte da foto de baixo ainda aparece?'},
 {id:'darken',name:'Darken',label:'Darken · Mais escuro',group:'Escurecer',effect:'Em cada canal, conserva o valor mais escuro das duas imagens.',ask:'Onde as sombras ganharam espaço?'},
 {id:'multiply',name:'Multiply',label:'Multiply · Multiplicar',group:'Escurecer',effect:'Multiplica as cores; branco não altera a base e preto escurece.',ask:'Como as duas fotografias ficaram mais escuras?'},
 {id:'color-burn',name:'Color Burn',label:'Color Burn · Escurecer cores',group:'Escurecer',effect:'Escurece a base e pode acentuar bastante o contraste das cores.',ask:'Que detalhes das sombras ficaram difíceis de ver?'},
 {id:'lighten',name:'Lighten',label:'Lighten · Mais claro',group:'Clarear',effect:'Em cada canal, conserva o valor mais claro das duas imagens.',ask:'Onde as luzes de uma foto substituíram a outra?'},
 {id:'screen',name:'Screen',label:'Screen · Clarear',group:'Clarear',effect:'Clareia a combinação; preto não altera a base e branco clareia.',ask:'Como os fundos escuros ajudam a combinar estas fotos?'},
 {id:'color-dodge',name:'Color Dodge',label:'Color Dodge · Clarear cores',group:'Clarear',effect:'Clareia a base, podendo intensificar luzes e perder detalhes claros.',ask:'Quais luzes ficaram fortes demais?'},
 {id:'overlay',name:'Overlay',label:'Overlay · Sobrepor',group:'Contraste',effect:'Escurece ou clareia conforme a base, reforçando o contraste.',ask:'Onde o contraste ficou mais evidente?'},
 {id:'soft-light',name:'Soft Light',label:'Soft Light · Luz suave',group:'Contraste',effect:'Escurece ou clareia de modo mais suave que Hard Light.',ask:'Quando uma combinação mais discreta pode ser útil?'},
 {id:'hard-light',name:'Hard Light',label:'Hard Light · Luz forte',group:'Contraste',effect:'Multiplica ou clareia conforme a camada superior, com efeito mais intenso.',ask:'Como esta versão difere de Soft Light?'},
 {id:'difference',name:'Difference',label:'Difference · Diferença',group:'Comparar',effect:'Mostra a diferença entre as cores; valores iguais resultam em preto.',ask:'Em que áreas as fotos mais diferem?'},
 {id:'exclusion',name:'Exclusion',label:'Exclusion · Exclusão',group:'Comparar',effect:'Produz um efeito semelhante a Difference, com contraste menor.',ask:'O resultado parece mais suave que Difference?'},
 {id:'hue',name:'Hue',label:'Hue · Matiz',group:'Cor',effect:'Usa o matiz da camada superior, preservando saturação e luminosidade da base.',ask:'Que tons mudaram sem trocar o desenho da imagem?'},
 {id:'saturation',name:'Saturation',label:'Saturation · Saturação',group:'Cor',effect:'Usa a saturação superior e mantém matiz e luminosidade da base.',ask:'Quais cores ficaram mais ou menos intensas?'},
 {id:'color',name:'Color',label:'Color · Cor',group:'Cor',effect:'Combina matiz e saturação superiores com a luminosidade da base.',ask:'O que aconteceu com as cores do músico?'},
 {id:'luminosity',name:'Luminosity',label:'Luminosity · Luminosidade',group:'Cor',effect:'Usa a luminosidade superior e mantém matiz e saturação da base.',ask:'O que mudou nos claros e escuros?'},
] as const;
export const blendGroups=[...new Set(blendModes.map(mode=>mode.group))];
