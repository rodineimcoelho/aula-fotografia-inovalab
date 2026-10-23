import type {SlideKind} from './lesson.ts';
import {questions} from './lesson.ts';
import {blendModes} from './blend-modes.ts';
import {lightingExamples} from './examples.ts';
import type {GuideFrame} from './presentation-script.ts';

const topics:Partial<Record<SlideKind,string[]>>={
 cover:['Luz como matéria-prima','Captura, composição e edição','Prática em grupos'],
 intro:['Registro de uma imagem pela luz','Sensor digital ou superfície fotossensível','Escolhas de quem fotografa'],
 photo:['Luz e enquadramento','Fotografia e tipografia na mesma imagem'],
 camera:['Caminho da luz: lente → abertura → obturador → sensor','Abertura: luz e profundidade','Tempo: luz e movimento','ISO: brilho e ruído'],
 'lighting-examples':['Direção: frontal, lateral e contraluz','Tamanho da fonte: luz dura ou suave','Cor da luz: quente ou fria'],
 triangle:['Abertura: luz e profundidade','Tempo: luz e movimento','ISO: brilho e ruído'],
 simulator:['Tempo curto congela e reduz a luz capturada','ISO compensa brilho e pode evidenciar ruído','Fotômetro: zero como referência','Abertura e plano de foco alteram o desfoque'],
 phone:['Limpar a lente','Tocar no assunto para focar','Conferir o brilho','Mudar a posição da câmera'],
 'composition-examples':['Posição do assunto e direção do olhar','Espaço negativo, moldura e simetria','Repetição e profundidade'],
 composition:['O que entra e sai do quadro','Recorte altera enquadramento','Mover a câmera altera perspectiva'],
 files:['JPEG: processado, comprimido, fácil de compartilhar','RAW: dados de captura, mais espaço para edição','Entregar uma cópia exportada'],
 editing:['Começar pela intenção','Comparar original e edição','Ajustar luz, contraste e cor com medida'],
 apps:['Lightroom: pago; recursos básicos gratuitos no celular','Snapseed: gratuito','Editor do próprio celular também serve'],
 poster:['Duas fotografias em camadas','16 modos de mesclagem · 65%','Tipografia, posição e leitura'],
 ethics:['Consentimento antes da foto','Crédito e permissão para publicar','Edição pode mudar o sentido da imagem'],
 quiz:['Movimento, abertura e fotômetro','RAW, ponto de vista e espaço para texto','Prever → revelar → explicar'],
 mission:['Um grupo, uma imagem e um título','Duas posições físicas e uma escolha de composição','Luz, intenção e consentimento'],
 practice:['25 min: captura','20 min: edição','5 min: envio'],
 gallery:['Composição, luz e intenção','Escolha popular e escolha dos jurados','Comentários sobre decisões concretas'],
 end:['Uma escolha para a próxima foto','Continuar experimentando'],
};

export function teacherTopics(kind:SlideKind){return topics[kind]??[];}

export function stepTopics(kind:SlideKind,frame:GuideFrame|undefined,step:number){
 if(!frame)return [];
 if(kind==='camera')return [...frame.cue.left,...frame.cue.right];
 if(kind==='poster'){
  const mode=blendModes[step-2];
  if(mode)return [mode.group,mode.effect,'Mesmas duas fotos · 65%'];
  if(step===20)return ['Overlay','Título embaixo','Sem fundo de leitura'];
 }
 if(kind==='lighting-examples'&&frame.light){
  const example=lightingExamples[frame.light.example];
  const view=frame.light.view==='reference'?'Exemplo':frame.light.view==='overview'?'Montagem 3D':'Pela câmera';
  return [example.name,view];
 }
 if(kind==='quiz'&&frame.quiz){
  const question=questions[frame.quiz.position];
  return question?[question.prompt,frame.quiz.reveal?question.why:'Prever antes de revelar']:['Seis decisões revistas'];
 }
 return [];
}
