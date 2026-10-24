import './style.css';
import qrcode from 'qrcode-generator';
import { slides, questions, slideRedirects, type Slide } from './lesson.ts';
import { apertures, shutters, sensitivities, defaultExposure, exposureStops, formatShutter, meterLabel, remainingSeconds, timerText, escapeHtml, safeUrl, type Exposure } from './models.ts';
import { slideContent, asset, icon } from './views.ts';
import { ExposureScene } from './exposure.ts';
import { compositions, lightingExamples, exampleMarkup } from './examples.ts';
import { mountProduction } from './production.ts';
import { mountLighting } from './lighting-controls.ts';
import { mountPresentationLayout } from './presentation-layout.ts';
import { mountScriptedPresenter } from './scripted-presenter.ts';
import {mountLocalGallery} from './local-gallery.ts';
import type { GuideFrame } from './presentation-script.ts';
import type { FocusPlane } from './depth-of-field.ts';

const app = document.querySelector<HTMLElement>('#app')!;
const teacherMode = new URLSearchParams(location.search).has('professor');
const mobileDevice = matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
function read<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; } catch { return fallback; } }
function save(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* The lesson remains usable without browser storage. */ } }
const settings = read('foto-settings', { view: mobileDevice || innerWidth <= 700 ? 'study' : 'screen', guides: false, activity: '', site: '', guided: !mobileDevice, guidedPreferenceSet: false });
if(mobileDevice)settings.view='study';
settings.guided ??= !mobileDevice;
if(mobileDevice&&!settings.guidedPreferenceSet)settings.guided=false;
settings.site ??= '';
const resolveSlideId = (id: string) => slideRedirects[id] ?? id;
const fromHash = slides.findIndex(slide => slide.id === resolveSlideId(location.hash.slice(1)));
const savedSlide = slides.findIndex(slide => slide.id === resolveSlideId(read('foto-slide-id', '')));
let index = fromHash >= 0 ? fromHash : savedSlide >= 0 ? savedSlide : 0;
if(fromHash>=0 && location.hash.slice(1)!==slides[index].id)history.replaceState(null,'',`#${slides[index].id}`);
let exposure: Exposure = { ...defaultExposure };
let apertureIndex = 2;
let cleanup: (() => void) | undefined;
let mountVersion = 0;
let currentSheet = '';
let presenter: ReturnType<typeof mountScriptedPresenter> | undefined;
let enterAtLastStep=false;
let quizIndex = 0;
let localShowcase=false;
const storedAnswers = read<unknown>('foto-quiz', []);
let quizAnswers: Array<number | null> = Array.isArray(storedAnswers) ? questions.map((q,i) => Number.isInteger(storedAnswers[i]) && storedAnswers[i] >= 0 && storedAnswers[i] < q.options.length ? storedAnswers[i] : null) : questions.map(() => null);
const timer = { minutes: 25, seconds: 1500, end: 0, running: false, announced: false, started: false };
const select = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;
const bind = (id: string, event: string, callback: EventListener) => select(id)?.addEventListener(event, callback);
const edgeScene = (side: 'left' | 'right') => {
  const photos = side === 'left'
    ? ['aula-passada/longa-exposicao-parque.jpg', 'aula-passada/contraluz-palco.jpg']
    : ['aula-passada/capa-guitarrista.jpg', 'quadra.jpg'];
  return [
    '<div class="edge-scene edge-scene-' + side + '">',
    '<figure class="edge-polaroid edge-polaroid-top" aria-hidden="true"><img src="' + asset(photos[0]) + '" alt=""></figure>',
    '<div class="camera-host edge-camera-host" aria-hidden="true"><p class="loading">Câmera</p></div>',
    '<figure class="edge-polaroid edge-polaroid-bottom" aria-hidden="true"><img src="' + asset(photos[1]) + '" alt=""></figure>',
    '</div>',
  ].join('');
};
let edgeCameraLoading = false;
let edgeCameraReady = false;
let edgeCameraDemos: InstanceType<typeof import('./camera.ts').CameraDemo>[] = [];
function mountEdgeCameras() {
  if (edgeCameraLoading || edgeCameraReady) return;
  edgeCameraLoading = true;
  window.setTimeout(() => void import('./camera.ts').then(({ CameraDemo }) => {
    const hosts = [...app.querySelectorAll<HTMLElement>('.edge-camera-host')];
    if (hosts.length !== 2) { edgeCameraLoading = false; return; }
    hosts.forEach(host=>host.replaceChildren());
    edgeCameraDemos = hosts.map(host => new CameraDemo(host, () => {}, () => {}, { decorative: true, pixelRatio: .85, autoRotate: true }));
    edgeCameraDemos[1].setExploded(1);
    edgeCameraReady = true;
    edgeCameraLoading = false;
  }).catch(() => { edgeCameraLoading = false; }), 500);
}

function go(target: number | string,lastStep=false) {
  const next = typeof target === 'number' ? target : slides.findIndex(slide => slide.id === resolveSlideId(target));
  if (next < 0 || next >= slides.length) return;
  index = next; enterAtLastStep=lastStep; currentSheet = ''; save('foto-slide-id', slides[index].id); history.replaceState(null, '', `#${slides[index].id}`); render();
}

function navigate(direction:number){if(presenter?.navigate(direction))return;go(index+direction,direction<0);}
function updateNavigation(step:number,total:number,busy:boolean){
  const progress=app.querySelector<HTMLElement>('.deck-progress');
  if(progress){progress.textContent=`${String(index+1).padStart(2,'0')} / ${slides.length}${total?` · ${step+1}/${total}`:''}`;progress.setAttribute('aria-label',`Slide ${index+1} de ${slides.length}${total?`, etapa ${step+1} de ${total}`:''}`);}
  const stage=app.querySelector<HTMLElement>('.stage');if(stage){stage.dataset.step=String(step);stage.dataset.steps=String(total);}
  for(const [id,direction] of [['previous-slide',-1],['next-slide',1]] as const){
    const button=select<HTMLButtonElement>(id);if(!button)continue;
    const atEdge=direction<0?index===0&&(!total||step===0):index===slides.length-1&&(!total||step===total-1);
    button.disabled=busy||atEdge;button.setAttribute('aria-label',total&&(direction<0?step>0:step<total-1)?direction<0?'Etapa anterior':'Próxima etapa':direction<0?'Slide anterior':'Próximo slide');
  }
}

function render() {
  cleanup?.(); cleanup = undefined; mountVersion++;
  const persistentEdgeHosts=[...app.querySelectorAll<HTMLElement>('.edge-camera-host')];
  const slide = slides[index];
  app.innerHTML = `<div class="stage ${settings.view === 'study' ? 'study' : ''} ${mobileDevice ? 'mobile-device' : ''} ${settings.guides ? 'guides' : ''}">
    <aside class="tower edge-tower edge-tower-left" aria-hidden="true">${edgeScene('left')}</aside><aside id="tower-controls" class="tower" aria-label="Controles da demonstração" aria-hidden="true"></aside>
    <main class="center ${slide.kind === 'cover' ? 'cover-mode' : ''}">
    <article class="slide" aria-labelledby="slide-title"><h1 id="slide-title" ${slide.kind === 'photo' ? 'hidden' : slide.kind==='quiz'?'class="sr-only"':''}>${slide.kind === 'cover' ? '<span>Fotografia</span> <span>e Produção</span> <span>de Imagens</span>' : slide.kind === 'aperture' ? 'Mais abertura.<br>Mais luz.' : escapeHtml(slide.title)}</h1><div class="slide-body">${slideContent(slide.kind, exposure)}</div></article>
    <footer class="deck-nav"><button id="previous-slide" ${index === 0 ? 'disabled' : ''} aria-label="Slide anterior" title="Anterior (←)">${icon('left')}</button><span class="deck-progress" aria-label="Slide ${index+1} de ${slides.length}">${String(index+1).padStart(2,'0')} / ${slides.length}</span><nav class="deck-tools" aria-label="Ferramentas da apresentação"><button id="open-index" aria-label="Abrir índice" title="Índice (I)">${icon('grid')}</button><button id="open-settings" aria-label="Opções da apresentação" title="Opções">${icon('settings')}</button></nav><button id="next-slide" ${index === slides.length-1 ? 'disabled' : ''} aria-label="Próximo slide" title="Próximo (→)">${icon('right')}</button></footer>
    <section id="sheet" class="sheet" hidden></section></main><aside id="tower-context" class="tower" aria-label="Informações da demonstração" aria-hidden="true"></aside><aside class="tower edge-tower edge-tower-right" aria-hidden="true">${edgeScene('right')}</aside></div>`;
  app.querySelectorAll<HTMLElement>('.edge-camera-host').forEach((host,i)=>{if(persistentEdgeHosts[i])host.replaceWith(persistentEdgeHosts[i]);});
  mountEdgeCameras();
  bind('previous-slide','click',()=>navigate(-1)); bind('next-slide','click',()=>navigate(1));
  bind('open-index','click',()=>openSheet('index')); bind('open-settings','click',()=>openSheet('settings'));
  app.querySelectorAll<HTMLElement>('[data-go]').forEach(button => button.addEventListener('click',()=>go(button.dataset.go!)));
  mountSlide(slide);
  const disposeSlide=cleanup as (()=>void)|undefined;
  const disposeLayout=mountPresentationLayout(app,slide.kind,mobileDevice?'study':settings.view);
  const manual=select<HTMLDetailsElement>('manual-controls');if(manual)manual.open=true;
  if(settings.guided){
    for(const id of ['camera-options','focus-options','lighting-adjust','poster-options']){const details=select<HTMLDetailsElement>(id);if(details)details.open=true;}
  }
  const practiceStep=slide.kind==='practice'&&timer.started?(timer.minutes===25?1:timer.minutes===20?2:3):undefined;
  const currentPresenter=mountScriptedPresenter(app,slide.kind,{enabled:settings.guided,last:enterAtLastStep,initial:practiceStep,preservePractice:practiceStep!==undefined,quiz:renderGuidedQuiz,changed:updateNavigation});presenter=currentPresenter;enterAtLastStep=false;
  cleanup=()=>{currentPresenter.dispose();disposeLayout();disposeSlide?.();};
}

function mountSlide(slide: Slide) {
  if(slide.kind==='cover')renderCoverAccess();
  if (slide.kind === 'aperture') {
    const update = () => {
      const aperture = apertures[apertureIndex];
      const radius = Math.min(124,104 * 2.8 / aperture);
      select('opening-clip')?.setAttribute('r',String(radius)); select('opening-outline')?.setAttribute('r',String(radius));
      const outgoing = select('outgoing-light');
      if (outgoing) outgoing.innerHTML = [123,147,171,195,219,243,267].filter(y=>Math.abs(y-195)<radius).map(y=>`<path d="M460 ${y}H626"/>`).join('');
      select('aperture-label')!.textContent = `f/${aperture}`;
      select('aperture-effect')!.textContent = aperture <= 4 ? 'Abertura maior · mais luz passa' : 'Abertura menor · menos luz passa';
      (select('aperture-close') as HTMLButtonElement).disabled = apertureIndex === apertures.length - 1;
      (select('aperture-open') as HTMLButtonElement).disabled = apertureIndex === 0;
    };
    bind('aperture-close','click',()=>{apertureIndex=Math.min(apertures.length-1,apertureIndex+1);update();});
    bind('aperture-open','click',()=>{apertureIndex=Math.max(0,apertureIndex-1);update();}); update();
  }
  if (slide.kind === 'camera') {
    const version = mountVersion, host = select('camera-host')!;
    let demo: import('./camera.ts').CameraDemo | undefined;
    let photo: import('./camera-photo.ts').CameraPhoto | undefined;
    let activePiece = 'lens', exploded = false, shotTimer = 0;
    let highlighting = false;
    let lastPhase = '';
    const photoLabel=(text:string)=>(select('camera-blur-compare') as HTMLInputElement).checked?'Comparação · brilho igualado':text;
    const descriptions: Record<string,string> = {
      lens:'Lente: direciona a luz e forma a imagem. Arraste o modelo para girar.',
      aperture:'Diafragma: mude o controle para observar a abertura por onde passa a luz.',
      shutter:'Obturador: mude o tempo e dispare. Observe por quanto tempo o sensor fica exposto.',
      sensor:'Sensor: registra luz. O ganho de ISO amplifica o sinal e pode evidenciar ruído.',
    };
    const pieceNames:Record<string,string>={lens:'Lente',aperture:'Diafragma',shutter:'Obturador',sensor:'Sensor'};
    const overview=()=>{
      highlighting=false;select('camera-detail-header')!.hidden=true;select('camera-visuals')!.classList.remove('highlighting');
      app.querySelectorAll<HTMLElement>('[data-piece]').forEach(button=>button.setAttribute('aria-pressed','false'));
      demo?.showOverview();select('piece-description')!.textContent='Selecione uma peça para destacar no conjunto. Arraste para girar.';
    };
    const selectPiece = (id: string) => {
      activePiece=id;highlighting=true;explode(true);
      select('camera-detail-header')!.hidden=false;select('camera-detail-name')!.textContent=pieceNames[id];select('camera-visuals')!.classList.add('highlighting');
      demo?.select(id); select('piece-description')!.textContent=descriptions[id];
      app.querySelectorAll<HTMLElement>('[data-piece]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.piece===id)));
    };
    const explode = (value: boolean) => {
      exploded=value; demo?.setExploded(value?1:0);
      select('camera-disassemble')!.textContent=value?'Montar câmera':'Desmontar câmera';
      select('camera-disassemble')!.setAttribute('aria-expanded',String(value));
    };
    const update = () => {
      demo?.setAperture(exposure.aperture);demo?.setShutter(exposure.shutter);demo?.setISO(exposure.iso);
      photo?.setValue(exposure);lastPhase='';select('camera-photo-label')!.textContent=photoLabel('Resultado previsto · cena 3D');
      for(const [id,value] of [['camera-aperture',`f/${exposure.aperture}`],['camera-shutter',formatShutter(exposure.shutter)],['camera-iso',String(exposure.iso)]]) {
        select(id+'-value')!.textContent=value;select(id)!.setAttribute('aria-valuetext',value);
      }
    };
    app.querySelectorAll<HTMLElement>('[data-piece]').forEach(button=>button.addEventListener('click',()=>selectPiece(button.dataset.piece!)));
    bind('camera-disassemble','click',()=>{overview();explode(!exploded);});
    bind('camera-overview','click',overview);
    bind('camera-aperture','input',e=>{exposure.aperture=apertures[Number((e.target as HTMLInputElement).value)];explode(true);selectPiece('aperture');update();});
    bind('camera-shutter','input',e=>{exposure.shutter=shutters[Number((e.target as HTMLInputElement).value)];explode(true);selectPiece('shutter');update();});
    bind('camera-iso','input',e=>{exposure.iso=sensitivities[Number((e.target as HTMLInputElement).value)];explode(true);selectPiece('sensor');update();});
    bind('camera-blur-compare','change',e=>{photo?.setBlurComparison((e.target as HTMLInputElement).checked);select('camera-photo-label')!.textContent=photoLabel('Resultado previsto · cena 3D');});
    const onFrame = (frame: import('./camera.ts').CameraFrame) => {
      if(version!==mountVersion)return;
      const format=(value: number)=>value.toLocaleString('pt-BR',{maximumSignificantDigits:3});
      select('camera-light-output')!.textContent=`Luz registrada: ${format(frame.light)}× · ganho ISO: ${format(frame.gain)}×`;
      if(frame.phase==='exposing')photo?.capture(frame.progress);
      if(frame.phase!==lastPhase) {
        select('camera-status')!.textContent=frame.phase==='exposing'?'Obturador aberto · o sensor acumula luz.':frame.phase==='complete'?'Obturador fechado · captura concluída.':'Obturador fechado · a luz não chega ao sensor.';
        if(frame.phase==='complete'){photo?.capture(1);select('camera-photo-label')!.textContent=photoLabel('Foto registrada · simulação');}
        lastPhase=frame.phase;
      }
    };
    Promise.all([import('./camera.ts'),import('./camera-photo.ts')]).then(([module,photoModule])=>{
      if(version!==mountVersion)return;
      try {
        host.innerHTML='';demo=new module.CameraDemo(host,selectPiece,onFrame);photo=new photoModule.CameraPhoto(select('camera-preview') as HTMLCanvasElement);photo.setBlurComparison((select('camera-blur-compare') as HTMLInputElement).checked);demo.select(activePiece,highlighting);demo.setExploded(exploded?1:0);update();
        (select('camera-shot') as HTMLButtonElement).disabled=false;
      } catch { demo?.dispose();photo?.dispose();host.innerHTML='<div class="loading"><p>A câmera 3D não pôde abrir. Use os botões das peças e o laboratório de exposição para continuar.</p></div>';select('camera-photo-label')!.textContent='Prévia indisponível · continue no laboratório'; }
    }).catch(()=>{if(version===mountVersion)host.innerHTML='<p>A demonstração não carregou. Recarregue a página para tentar novamente.</p>';});
    bind('camera-shot','click',()=>{
      if(!demo)return;explode(true);const duration=demo.fire();
      const button=select('camera-shot') as HTMLButtonElement;button.disabled=true;
      const controls=['camera-disassemble','camera-aperture','camera-shutter','camera-iso','camera-blur-compare'];
      controls.forEach(id=>(select(id) as HTMLButtonElement|HTMLInputElement).disabled=true);
      select('camera-photo-label')!.textContent='Registrando luz…';photo?.capture(0);
      select('piece-description')!.textContent=`Disparo em ${formatShutter(exposure.shutter)}, f/${exposure.aperture}, ISO ${exposure.iso}. Compare luz registrada, rastro e ruído.`;
      shotTimer=window.setTimeout(()=>{if(version===mountVersion){button.disabled=false;controls.forEach(id=>(select(id) as HTMLButtonElement|HTMLInputElement).disabled=false);}},duration);
    });
    update();cleanup=()=>{clearTimeout(shotTimer);demo?.dispose();photo?.dispose();};
  }
  if (slide.kind === 'composition-examples' || slide.kind === 'lighting-examples') {
    const examples=slide.kind==='composition-examples'?compositions:lightingExamples;
    const lighting=slide.kind==='lighting-examples'?mountLighting(app):undefined;
    let current=0;
    const update=()=>{
      const example=examples[current];
      select('example-media')!.innerHTML=exampleMarkup(example,asset('aula-passada/'));
      select('example-description')!.textContent=example.text;
      select('example-count')!.textContent=`${current+1} / ${examples.length}`;
      (select('example-choice') as HTMLSelectElement).value=String(current);
      (select('example-previous') as HTMLButtonElement).disabled=current===0;
      (select('example-next') as HTMLButtonElement).disabled=current===examples.length-1;
      lighting?.selectExample(current);
    };
    bind('example-choice','change',e=>{current=Number((e.target as HTMLSelectElement).value);update();});
    bind('example-previous','click',()=>{current=Math.max(0,current-1);update();});
    bind('example-next','click',()=>{current=Math.min(examples.length-1,current+1);update();});update();
    if(lighting)cleanup=()=>lighting.dispose();
  }
  if (slide.kind === 'simulator') {
    const scene = new ExposureScene(select('exposure-canvas') as HTMLCanvasElement,exposure,asset('quadra.jpg'));
    const update = () => {
      const stops=exposureStops(exposure);
      select('aperture-range-value')!.textContent=`f/${exposure.aperture}`;
      select('shutter-range-value')!.textContent=formatShutter(exposure.shutter);
      select('iso-range-value')!.textContent=String(exposure.iso);
      for (const [id,value] of [['aperture-range',`f/${exposure.aperture}`],['shutter-range',formatShutter(exposure.shutter)],['iso-range',String(exposure.iso)]]) select(id)!.setAttribute('aria-valuetext',value);
      select('meter-output')!.textContent=meterLabel(stops);
      select('meter-needle')!.style.left=`${(Math.max(-3,Math.min(3,stops))+3)/6*100}%`;
      select('meter-output')!.setAttribute('aria-label',`Exposição relativa ${meterLabel(stops)}. Zero é a referência desta cena.`);
      scene.setValue(exposure);
    };
    bind('aperture-range','input',e=>{exposure.aperture=apertures[Number((e.target as HTMLInputElement).value)];update();});
    bind('shutter-range','input',e=>{exposure.shutter=shutters[Number((e.target as HTMLInputElement).value)];update();});
    bind('iso-range','input',e=>{exposure.iso=sensitivities[Number((e.target as HTMLInputElement).value)];update();});
    bind('scene-light','change',e=>{exposure.light=Number((e.target as HTMLSelectElement).value);update();});
    bind('focus-plane','change',e=>{
      const plane=(e.target as HTMLSelectElement).value as FocusPlane;scene.setFocus(plane);
      select('focus-status')!.textContent=`Cena didática · foco ${plane==='subject'?'na bola':plane==='background'?'no fundo':'no primeiro plano'}`;
    });
    bind('blur-compare','change',e=>{
      const enabled=(e.target as HTMLInputElement).checked;scene.setBlurComparison(enabled);
      select('blur-note')!.textContent=enabled?'Brilho igualado para comparar foco; o fotômetro continua indicando a exposição calculada. Zero é referência, não obrigação.':'Fotômetro: zero é referência, não obrigação. Compare movimento, foco e ruído.';
    });
    bind('motion-pause','click',()=>{select('motion-pause')!.textContent=scene.pause()?'Pausar movimento':'Retomar movimento';});
    bind('exposure-reset','click',()=>{exposure={...defaultExposure};render();}); update(); cleanup=()=>scene.dispose();
  }
  if (slide.kind === 'meter') bind('meter-demo','input',e=>{
    const value=Number((e.target as HTMLInputElement).value); select('meter-demo-value')!.textContent=meterLabel(value);
    select('meter-idea')!.textContent=value<0?'Uma interpretação mais escura que a referência. Pode preservar a intenção de uma cena escura.':value>0?'Uma interpretação mais clara que a referência. Pode ser útil para uma cena predominantemente clara.':'O zero é a referência da medição, não uma regra para toda imagem.';
  });
  if (slide.kind === 'composition') {
    const update=()=>{
      const x=Number((select('crop-x') as HTMLInputElement).value),y=Number((select('crop-y') as HTMLInputElement).value),zoom=Number((select('crop-zoom') as HTMLInputElement).value);
      select('crop-photo')!.style.transform=`translate(${(50-x)*(zoom-1)}%,${(50-y)*(zoom-1)}%) scale(${zoom})`;
    };
    ['crop-x','crop-y','crop-zoom'].forEach(id=>bind(id,'input',update));
    bind('grid-toggle','click',()=>{const grid=select('thirds-grid')!;const hidden=grid.toggleAttribute('hidden');select('grid-toggle')!.textContent=hidden?'Mostrar guias':'Ocultar guias';select('grid-toggle')!.setAttribute('aria-pressed',String(!hidden));});
    bind('crop-reset','click',()=>{(select('crop-x') as HTMLInputElement).value='50';(select('crop-y') as HTMLInputElement).value='50';(select('crop-zoom') as HTMLInputElement).value='1.35';update();});update();
  }
  if (slide.kind === 'editing') {
    const update=()=>{
      const light=Number((select('edit-light') as HTMLInputElement).value),contrast=Number((select('edit-contrast') as HTMLInputElement).value),color=Number((select('edit-color') as HTMLInputElement).value),split=Number((select('compare-split') as HTMLInputElement).value);
      select('edited-photo')!.style.filter=`brightness(${1+light/100}) contrast(${contrast/100}) saturate(${color/100})`;
      select('edited-photo')!.style.clipPath=`inset(0 0 0 ${split}%)`;
      select('edit-light-value')!.textContent=`${light>0?'+':''}${light}`;
    };
    ['edit-light','edit-contrast','edit-color','compare-split'].forEach(id=>bind(id,'input',update));update();
  }
  if (slide.kind === 'poster') mountProduction(app);
  if (slide.kind === 'quiz') renderQuiz();
  if (slide.kind === 'practice') {
    app.querySelectorAll<HTMLElement>('[data-timer]').forEach(button=>button.addEventListener('click',()=>{
      timer.minutes=Number(button.dataset.timer);timer.seconds=timer.minutes*60;timer.running=false;timer.announced=false;timer.started=false;updateTimer();
    }));
    bind('timer-toggle','click',()=>{
      if (timer.running) timer.seconds=remainingSeconds(timer.end,Date.now());
      else { if(timer.seconds===0)timer.seconds=timer.minutes*60; timer.end=Date.now()+timer.seconds*1000;timer.started=true; }
      timer.running=!timer.running;timer.announced=false;updateTimer();
    });
    bind('timer-reset','click',()=>{timer.running=false;timer.seconds=timer.minutes*60;timer.announced=false;timer.started=false;updateTimer();}); updateTimer();
  }
  if (slide.kind === 'gallery') renderActivity();
}

function renderGuidedQuiz(frame:NonNullable<GuideFrame['quiz']>){
  quizIndex=frame.complete?questions.length:frame.position;
  const answers:Array<number|null>=questions.map(()=>null);
  questions.forEach((q,i)=>{if(i<frame.position||(i===frame.position&&frame.reveal))answers[i]=q.correct;});
  renderQuiz(answers,true);
}
function renderQuiz(override?:Array<number|null>,guided=false) {
  const host=select('quiz-content')!;
  const answers=override??quizAnswers;
  const indices=questions.map((_,i)=>i);
  if (quizIndex>=indices.length) {
    const correct=indices.filter(i=>answers[i]===questions[i].correct).length;
    host.innerHTML=`<p class="quiz-progress">Quiz concluído</p><h2>${guided?`${indices.length} perguntas revisadas.`:`${correct} de ${indices.length} escolhas corretas.`}</h2><p>O mais importante: explicar por que uma escolha ajuda a imagem.</p><div class="button-row quiz-actions"><button id="quiz-review">Rever as perguntas</button><button id="quiz-reset" class="primary">Recomeçar quiz</button></div>`;
    bind('quiz-review','click',()=>{quizIndex=0;renderQuiz();});bind('quiz-reset','click',()=>{quizAnswers=questions.map(()=>null);save('foto-quiz',quizAnswers);quizIndex=0;renderQuiz();});return;
  }
  const questionIndex=indices[quizIndex],q=questions[questionIndex],answer=answers[questionIndex],answered=answer!==null;
  host.innerHTML=`<p class="quiz-progress">Pergunta ${quizIndex+1} de ${indices.length}</p><h2>${q.prompt}</h2><div class="quiz-options">${q.options.map((option,i)=>`<button data-answer="${i}" ${answered?'disabled':''} class="${answered&&i===q.correct?'correct':answered&&i===answer?'incorrect':''}">${i+1}. ${option}</button>`).join('')}</div><div class="quiz-feedback" aria-live="polite">${answered?`<strong>${guided?'Resposta':answer===q.correct?'Isso mesmo.':'Vamos pensar juntos.'}</strong><p>${q.why}</p>`:guided?'Próxima seta: revelar resposta.':'Escolha uma resposta antes de revelar a explicação.'}</div><div class="button-row quiz-actions"><button id="quiz-back" ${quizIndex===0?'disabled':''}>Pergunta anterior</button><button id="quiz-next" class="primary" ${!answered?'disabled':''}>${quizIndex===indices.length-1?'Ver resultado':'Próxima pergunta'}</button></div>`;
  host.querySelectorAll<HTMLElement>('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
    if(answers[questionIndex]!==null)return;answers[questionIndex]=Number(button.dataset.answer);if(!guided){save('foto-quiz',answers);}renderQuiz(guided?answers:undefined,guided);
  }));bind('quiz-back','click',()=>{quizIndex--;renderQuiz();});bind('quiz-next','click',()=>{quizIndex++;renderQuiz();});
}

function updateTimer() {
  if(timer.running)timer.seconds=remainingSeconds(timer.end,Date.now());
  if(timer.running&&timer.seconds===0){timer.running=false;timer.announced=true;}
  const output=select('timer-display');if(!output)return;
  output.textContent=timerText(timer.seconds);select('timer-phase')!.textContent=timer.minutes===25?'Fotografar':timer.minutes===20?'Editar':'Enviar';
  select('timer-toggle')!.textContent=timer.running?'Pausar':timer.started&&timer.seconds>0?'Continuar':'Iniciar';
  app.querySelectorAll<HTMLElement>('[data-timer]').forEach(button=>button.classList.toggle('selected',Number(button.dataset.timer)===timer.minutes));
  select('timer-status')!.textContent=timer.announced?'Tempo encerrado. Combine com a turma a próxima etapa.':'';
}
setInterval(updateTimer,250);

function renderActivity() {
  const host=select('activity-access')!,url=safeUrl(settings.activity);
  if(!url||localShowcase){cleanup=mountLocalGallery(host);return;}
  const qr=qrcode(0,'M');qr.addData(url);qr.make();
  host.innerHTML=`<div class="qr-code" role="img" aria-label="QR code para entrar na atividade">${qr.createSvgTag({cellSize:4,margin:0,scalable:true})}</div><a class="activity-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a><p>Acesse pelo celular. Use o código individual distribuído pelo professor.</p><button id="use-local-gallery">Usar mostra local</button>`;
  bind('use-local-gallery','click',()=>{localShowcase=true;renderActivity();});
}

function renderCoverAccess(){
  const host=select('cover-access');if(!host)return;
  const url=safeUrl(settings.site)||new URL(import.meta.env.BASE_URL,location.href).href;
  const qr=qrcode(0,'M');qr.addData(url);qr.make();
  const address=new URL(url),local=['localhost','127.0.0.1','::1'].includes(address.hostname);
  host.innerHTML=`<div class="cover-qr" role="img" aria-label="QR Code para acompanhar a apresentação no celular: ${escapeHtml(url)}">${qr.createSvgTag({cellSize:4,margin:0,scalable:true})}</div><div class="cover-follow"><strong>Acompanhe pelo celular</strong><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(address.host+address.pathname)}</a>${local?'<p>Prévia local: defina um endereço acessível no celular.</p><button id="configure-site" class="compact">Definir endereço</button>':''}</div>`;
  bind('configure-site','click',()=>openSheet('settings'));
}

function openSheet(type: string) {
  currentSheet=type; const sheet=select('sheet')!;sheet.hidden=false;
  const title=type==='index'?'Percurso da aula':type==='notes'?'Notas do professor':'Opções da apresentação';
  let content='';
  if(type==='index'){
    let previous='';content='<div class="toc">'+slides.map((slide,i)=>{
      const heading=slide.section!==previous?`<p class="toc-group">${escapeHtml(slide.section)}</p>`:'';previous=slide.section;
      return `${heading}<button data-index="${i}" ${i===index?'aria-current="step"':''}><span>${String(i+1).padStart(2,'0')} · ${escapeHtml(slide.title)}</span><span>${slide.minutes}</span></button>`;
    }).join('')+'</div>';
  } else if(type==='notes') content=`<h3>${escapeHtml(slides[index].title)}</h3><p class="notes-text">${escapeHtml(slides[index].notes)}</p><p class="fine-print">Tempo sugerido: ${slides[index].minutes}. Estas notas aparecem nesta janela quando abertas; feche antes de voltar à projeção.</p><button id="notes-all">Ver roteiro completo</button>`;
  else content=`<label>Modo de visualização<select id="view-mode">${mobileDevice?'':`<option value="screen" ${settings.view==='screen'?'selected':''}>Telão · 1–1–4–1–1</option>`}<option value="study" ${settings.view==='study'?'selected':''}>Estudo · área central ampliada</option></select></label><label>Navegação<select id="presentation-mode"><option value="guided" ${settings.guided?'selected':''}>Roteiro pelas setas</option><option value="manual" ${!settings.guided?'selected':''}>Somente trocar slides</option></select></label><label class="check-label"><input id="panel-guides" type="checkbox" ${settings.guides?'checked':''}> Mostrar divisões do telão para conferir o alinhamento</label><label>Endereço para acompanhar no celular<input id="site-url" type="url" value="${escapeHtml(settings.site)}" placeholder="Vazio: usa o endereço desta apresentação" spellcheck="false"></label><label>Endereço da aplicação da atividade<input id="activity-url" type="url" value="${escapeHtml(settings.activity)}" placeholder="https://seu-endereco-da-atividade" spellcheck="false"></label><button id="save-settings" class="primary align-start">Salvar opções</button><p id="settings-status" class="status-message" role="status"></p><div class="settings-actions"><button id="fullscreen">${icon('full')} Tela cheia</button><button id="open-notes">${icon('note')} Notas do professor</button><a href="./roteiro.html" target="_blank" rel="noopener noreferrer">Roteiro completo</a></div><h3>Atalhos</h3><dl class="shortcut-list"><dt>← / → · Page Up / Down</dt><dd>Etapa anterior / próxima; depois, outro slide</dd><dt>Espaço</dt><dd>Próxima etapa</dd><dt>Shift + ← / →</dt><dd>Pular direto para outro slide</dd><dt>I</dt><dd>Índice</dd><dt>N</dt><dd>Notas do professor</dd><dt>F</dt><dd>Tela cheia</dd><dt>Esc</dt><dd>Fechar painel</dd></dl><p class="fine-print">A apresentação e os simuladores são estáticos. A aplicação de envio, revisão e mostra funciona em hospedagem separada.</p>`;
  sheet.innerHTML=`<div class="sheet-header"><h2>${title}</h2><button id="close-sheet" class="close-sheet" aria-label="Fechar painel">${icon('close')}</button></div>${content}`;
  bind('close-sheet','click',closeSheet);(select('close-sheet') as HTMLButtonElement).focus();
  sheet.querySelectorAll<HTMLElement>('[data-index]').forEach(button=>button.addEventListener('click',()=>go(Number(button.dataset.index))));
  const teacherLink=document.createElement('a');teacherLink.id='open-teacher';teacherLink.href=`?professor=1#${slides[index].id}`;teacherLink.target='_blank';teacherLink.rel='noopener';teacherLink.textContent='Abrir modo professor';
  sheet.querySelector('.settings-actions')?.prepend(teacherLink);
  bind('open-notes','click',()=>openSheet('notes'));bind('notes-all','click',()=>{window.open('./roteiro.html','_blank','noopener');});bind('fullscreen','click',()=>void fullscreen());
  bind('save-settings','click',()=>{
    const url=(select('activity-url') as HTMLInputElement).value.trim();
    const site=(select('site-url') as HTMLInputElement).value.trim();
    if(url&&!safeUrl(url)){select('settings-status')!.textContent='Digite um endereço completo começando com https:// ou http://.';return;}
    if(site&&!safeUrl(site)){select('settings-status')!.textContent='Digite um endereço para o QR Code começando com https:// ou http://.';return;}
    settings.guided=(select('presentation-mode') as HTMLSelectElement).value==='guided';settings.guidedPreferenceSet=true;settings.view=mobileDevice?'study':(select('view-mode') as HTMLSelectElement).value;settings.guides=(select('panel-guides') as HTMLInputElement).checked;settings.activity=url?safeUrl(url)!:'';settings.site=site?safeUrl(site)!:'';if(settings.activity)localShowcase=false;save('foto-settings',settings);render();openSheet('settings');select('settings-status')!.textContent='Opções salvas neste navegador.';
  });
}
function closeSheet(){currentSheet='';select('sheet')!.hidden=true;(select('open-settings') as HTMLButtonElement)?.focus();}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{if(select('settings-status'))select('settings-status')!.textContent='Use o modo de tela cheia do navegador (F11) para continuar.';}}

document.addEventListener('keydown',event=>{
  if(teacherMode)return;
  if(event.ctrlKey||event.altKey||event.metaKey)return;
  if(event.repeat)return;
  if(event.key==='Escape'){
    if(currentSheet)closeSheet();else{(document.activeElement as HTMLElement)?.blur();}return;
  }
  const tag=(event.target as HTMLElement)?.tagName;
  if(['INPUT','SELECT','TEXTAREA','SUMMARY'].includes(tag))return;
  if(currentSheet)return;
  if(event.key==='ArrowRight'||event.key==='PageDown'||(event.key===' '&&tag!=='BUTTON')){event.preventDefault();if(event.shiftKey)go(index+1);else navigate(1);}
  else if(event.key==='ArrowLeft'||event.key==='PageUp'){event.preventDefault();if(event.shiftKey)go(index-1,true);else navigate(-1);}
  else if(event.key.toLowerCase()==='i')openSheet('index');
  else if(event.key.toLowerCase()==='n')openSheet('notes');
  else if(event.key.toLowerCase()==='f')void fullscreen();
  else if(slides[index].kind==='quiz'&&['1','2','3'].includes(event.key))app.querySelector<HTMLButtonElement>(`[data-answer="${Number(event.key)-1}"]`)?.click();
});
window.addEventListener('hashchange',()=>{if(teacherMode)return;const next=slides.findIndex(slide=>slide.id===resolveSlideId(location.hash.slice(1)));if(next>=0)go(next);});
window.addEventListener('beforeunload',()=>cleanup?.());
if(teacherMode)void import('./teacher.ts').then(({mountTeacher})=>mountTeacher(app));else render();
