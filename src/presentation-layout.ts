import type { SlideKind } from './lesson.ts';
import type { PresentationCue } from './presentation-script.ts';

// Projection towers carry only large teaching cues; every control stays in the center.
export function mountPresentationLayout(root: HTMLElement, kind: SlideKind, view: string) {
  const stage=root.querySelector<HTMLElement>('.stage')!;
  const left=root.querySelector<HTMLElement>('#tower-controls')!;
  const right=root.querySelector<HTMLElement>('#tower-context')!;
  left.setAttribute('aria-label','Conceito em destaque');right.setAttribute('aria-label','Consequência observada');
  const body=root.querySelector<HTMLElement>('.slide-body')!;
  const cueText=document.createElement('p');cueText.id='presentation-cue';cueText.className='presentation-cue';cueText.hidden=true;cueText.setAttribute('aria-live','polite');body.append(cueText);
  const media=matchMedia('(min-width:1200px)');
  const groups: Partial<Record<SlideKind,string[]>> = {
    camera:['.camera-actions','.camera-settings','.piece-tabs','#piece-description','#camera-options','#camera-overview'],
    simulator:['.exposure-controls','#focus-options','label:has(#scene-light)','#exposure-reset','#motion-pause'],
    'lighting-examples':['.example-toolbar','.lighting-views','#lighting-adjust','#lighting-hint'],
    'composition-examples':['.example-toolbar'],composition:['.crop-controls','.slide-body>.button-row'],
    editing:['.exposure-controls','label[for="compare-split"]'],poster:['#poster-tools'],
    practice:['.timer-presets','.practice-timer>.button-row:not(.timer-presets)'],
  };
  if(kind==='simulator')root.querySelector('.simulation')?.after(root.querySelector('.meter-row')!);
  const controls=(groups[kind]??[]).map(s=>root.querySelector<HTMLElement>(s)).filter((n):n is HTMLElement=>!!n);
  if(controls.length){
    const details=document.createElement('details');details.id='manual-controls';details.className='manual-controls';
    const summary=document.createElement('summary');summary.textContent='Controles da demonstração';details.append(summary);
    const content=document.createElement('div');content.className='manual-content';content.append(...controls);details.append(content);body.append(details);
  }
  root.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(input=>{
    const heading=input.closest('label')?.querySelector('span');if(!heading||heading.querySelector('output'))return;
    const output=document.createElement('output');output.htmlFor=input.id;heading.append(output);
    const update=()=>{output.textContent=input.value;};input.addEventListener('input',update);update();
  });
  let cue:PresentationCue={text:'',left:[],right:[]};
  const update=()=>{
    const wide=media.matches&&view==='screen';let hasTowers=false;
    for(const [tower,words] of [[left,cue.left],[right,cue.right]] as [HTMLElement,string[]][]){
      tower.replaceChildren();
      if(wide&&words.length){
        const text=document.createElement('p');text.className='tower-cue';
        for(const word of words){const line=document.createElement('span');line.textContent=word;text.append(line);}tower.append(text);hasTowers=true;
      }
      tower.classList.toggle('tower-used',tower.childElementCount>0);if(tower.childElementCount===0)tower.setAttribute('aria-hidden','true');else tower.removeAttribute('aria-hidden');
    }
    stage.classList.toggle('with-towers',hasTowers);cueText.textContent=cue.text;cueText.hidden=wide||!cue.text;
  };
  const receive=(event:Event)=>{
    cue=(event as CustomEvent<PresentationCue>).detail;update();
    if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    const emphasis=[left.querySelector('.tower-cue'),right.querySelector('.tower-cue'),cueText.hidden?null:cueText];
    for(const element of emphasis)element?.animate([{opacity:.55,color:'#cf786f'},{opacity:1,color:'#efefec'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'});
  };
  root.addEventListener('presentation-cue',receive);media.addEventListener('change',update);update();
  return ()=>{root.removeEventListener('presentation-cue',receive);media.removeEventListener('change',update);};
}
