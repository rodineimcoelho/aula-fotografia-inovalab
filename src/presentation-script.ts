import type { SlideKind } from './lesson.ts';
import { questions } from './lesson.ts';
import { lightingExamples } from './examples.ts';
import { blendModes } from './blend-modes.ts';
export type PresentationCue={text:string;left:string[];right:string[]};
export type GuideFrame={cue:PresentationCue;camera?:{part?:string;assembled?:boolean;aperture?:number;shutter?:number;iso?:number;compare?:boolean;capture?:boolean};light?:{example:number;view?:string;size?:number;color?:string};lab?:{aperture?:number;shutter?:number;iso?:number;light?:number;focus?:string;compare?:boolean;paused?:boolean};example?:number;crop?:{x:number;y:number;zoom:number;grid:boolean};edit?:{light:number;contrast:number;color:number;split:number};poster?:{reference:boolean;overlay?:boolean;type?:boolean;blend?:string;opacity?:number;font?:string;position?:string};quiz?:{position:number;reveal?:boolean;complete?:boolean};practice?:{minutes:number;running:boolean}};
const cue=(text:string,left:string[],right:string[]):PresentationCue=>({text,left,right});
export const presentationScripts:Partial<Record<SlideKind,GuideFrame[]>>={
 camera:[
  {cue:cue('Uma câmera transforma luz em imagem.',['Câmera'],['Luz','e imagem']),camera:{assembled:true}},
  {cue:cue('A lente direciona a luz e forma a imagem.',['Lente'],['Forma','a imagem']),camera:{part:'lens'}},
  {cue:cue('Abertura maior: compare o desfoque com brilho igualado.',['Abertura','f/1.4'],['Fundo','desfocado']),camera:{part:'aperture',aperture:1.4,compare:true,capture:true}},
  {cue:cue('Abertura menor: mais planos aparecem nítidos.',['Abertura','f/22'],['Mais','nitidez']),camera:{part:'aperture',aperture:22,compare:true,capture:true}},
  {cue:cue('Tempo curto registra menos deslocamento. Brilho igualado para comparar.',['Tempo','1/1000 s'],['Menos','movimento']),camera:{part:'shutter',shutter:1/1000,compare:true,capture:true}},
  {cue:cue('Tempo longo registra mais movimento. Brilho igualado para comparar.',['Tempo','1/15 s'],['Rastro','de movimento']),camera:{part:'shutter',shutter:1/15,compare:true,capture:true}},
  {cue:cue('Pouca luz registrada e ganho baixo: imagem escura.',['ISO','100'],['Sinal','baixo']),camera:{part:'sensor',shutter:1/4000,iso:100,capture:true}},
  {cue:cue('A mesma luz registrada, com ganho maior: mais brilho e ruído.',['ISO','6400'],['Mais brilho','mais ruído']),camera:{part:'sensor',shutter:1/4000,iso:6400,capture:true}},
  {cue:cue('O sensor registra a luz. A imagem resulta das escolhas.',['Sensor'],['Luz','registrada']),camera:{part:'sensor',capture:true}},
 ],
 'lighting-examples':lightingExamples.flatMap((example,i):GuideFrame[]=>{
  const name=[['Contraluz'],['Silhueta'],['Luz','frontal'],['Luz','lateral'],['Dura e suave'],['Cor da luz']][i];
  const frames:GuideFrame[]=[
   {cue:cue(`${example.name}: observe o exemplo.`,name,['Exemplo']),light:{example:i,view:'reference',...(i===4?{size:.18}:{})}},
   {cue:cue(`${example.name}: localize a fonte, o assunto e a câmera.`,name,['Montagem','3D']),light:{example:i,view:'overview',...(i===4?{size:.18}:{})}},
   {cue:cue(`${example.name}: observe o resultado pela câmera.`,name,['Pela','câmera']),light:{example:i,view:'photo',...(i===4?{size:.18}:{})}},
  ];
  if(i===4)frames.push({cue:cue('Amplie a fonte e compare a borda da sombra.',['Luz','suave'],['Transição','suave']),light:{example:i,view:'photo',size:2.4}});
  if(i===5)frames.push({cue:cue('Mude de luz quente para fria na mesma cena.',['Luz','fria'],['Outra','aparência']),light:{example:i,view:'photo',color:'cool'}});
  return frames;
 }),
 simulator:[
  {cue:cue('Observe a referência antes de mudar um ajuste.',['Exposição'],['Referência']),lab:{}},
  {cue:cue('O tempo curto congela melhor, mas registra menos luz.',['Tempo','1/1000 s'],['Menos','luz']),lab:{shutter:1/1000}},
  {cue:cue('Aumentar o ISO compensa o brilho, sem criar luz.',['ISO','1600'],['Brilho','compensado']),lab:{shutter:1/1000,iso:1600}},
  {cue:cue('Com menos luz na cena, observe o fotômetro.',['Pouca','luz'],['−3 EV']),lab:{shutter:1/1000,iso:1600,light:-3}},
  {cue:cue('Zero é referência, não obrigação para toda cena.',['Fotômetro'],['Zero não','é regra']),lab:{shutter:1/1000,iso:6400,light:-3}},
  {cue:cue('Brilho igualado: abertura grande, foco na bola.',['Foco','na bola'],['Fundo','desfocado']),lab:{aperture:1.4,compare:true,paused:true}},
  {cue:cue('Fechar a abertura deixa mais planos nítidos.',['Abertura','f/22'],['Mais','nitidez']),lab:{aperture:22,compare:true,paused:true}},
  {cue:cue('Trocar o foco muda o que aparece nítido.',['Foco','no fundo'],['Outra','escolha']),lab:{aperture:1.4,compare:true,paused:true,focus:'background'}},
 ],
 'composition-examples':[
  {cue:cue('Distribua o interesse entre os terços.',['Terços'],['Distribuir']),example:0},
  {cue:cue('Linhas podem conduzir o olhar.',['Linhas'],['Conduzir']),example:1},
  {cue:cue('Diagonais criam direção e energia.',['Diagonais'],['Movimento']),example:2},
  {cue:cue('O espaço vazio também compõe a imagem.',['Espaço','negativo'],['Respiro']),example:3},
  {cue:cue('Centro e simetria podem dar força ao assunto.',['Simetria'],['Equilíbrio']),example:4},
  {cue:cue('Uma moldura pode concentrar a atenção.',['Moldura'],['Atenção']),example:5},
  {cue:cue('Repetição cria ritmo; uma diferença chama atenção.',['Repetição'],['Ritmo']),example:6},
  {cue:cue('Os planos criam profundidade.',['Planos'],['Profundidade']),example:7},
 ],
 composition:[
  {cue:cue('Observe o enquadramento inicial.',['Quadro'],['Escolha']),crop:{x:50,y:50,zoom:1.35,grid:true}},
  {cue:cue('Abra o quadro e veja o que entra na imagem.',['Mais','contexto'],['Quadro','aberto']),crop:{x:50,y:50,zoom:1,grid:true}},
  {cue:cue('Recorte e reposicione o assunto.',['Recorte'],['Outro','destaque']),crop:{x:70,y:45,zoom:1.6,grid:true}},
  {cue:cue('Sem guias, avalie a imagem. Recortar não muda a perspectiva.',['Sem','guias'],['Intenção']),crop:{x:70,y:45,zoom:1.6,grid:false}},
 ],
 editing:[
  {cue:cue('Comece pela fotografia original.',['Original'],['Observar']),edit:{light:0,contrast:100,color:100,split:100}},
  {cue:cue('Compare original e edição ao ajustar a luz.',['Luz'],['Mais','clareza']),edit:{light:15,contrast:100,color:100,split:50}},
  {cue:cue('Contraste muda a relação entre claros e escuros.',['Contraste'],['Separação']),edit:{light:15,contrast:115,color:100,split:50}},
  {cue:cue('A cor participa da intenção.',['Cor'],['Intenção']),edit:{light:15,contrast:115,color:115,split:50}},
  {cue:cue('Veja a edição inteira.',['Edição'],['Resultado']),edit:{light:15,contrast:115,color:115,split:0}},
 ],
 poster:[
  {cue:cue('Observe a referência pronta.',['Referência'],['Imagem','final']),poster:{reference:true}},
  {cue:cue('Comece o estudo com uma fotografia.',['Foto','base'],['Começar']),poster:{reference:false,overlay:false,type:false}},
  ...blendModes.map((mode):GuideFrame=>({cue:cue(`${mode.name}: ${mode.effect}`,[mode.name],[mode.group]),poster:{reference:false,type:false,blend:mode.id,opacity:65}})),
  {cue:cue('O título cria uma nova hierarquia.',['Tipografia'],['Hierarquia']),poster:{reference:false}},
  {cue:cue('Compare uma fonte com serifa.',['Com','serifa'],['Outra','voz']),poster:{reference:false,font:'serif'}},
  {cue:cue('Inovalab: mesclagem Overlay, título embaixo e sem fundo de leitura.',['Inovalab'],['Arte','final']),poster:{reference:false,font:'serif',blend:'overlay',position:'bottom'}},
 ],
 quiz:Array.from({length:questions.length*2+1},(_,step)=>({cue:cue(step===questions.length*2?'Perguntas revisadas. Explique uma escolha.':step%2?'Compare a resposta e a explicação.':'Peça uma previsão antes de revelar a resposta.',[],[]),quiz:{position:Math.floor(step/2),reveal:step%2===1,complete:step===questions.length*2}})),
 practice:[
  {cue:cue('Prepare o grupo. A próxima seta inicia a captura.',[],[]),practice:{minutes:25,running:false}},
  {cue:cue('Fotografem e escolham uma imagem.',[],[]),practice:{minutes:25,running:true}},
  {cue:cue('Editem a foto escolhida e criem um título.',[],[]),practice:{minutes:20,running:true}},
  {cue:cue('Enviem a imagem e o título.',[],[]),practice:{minutes:5,running:true}},
 ],
};
