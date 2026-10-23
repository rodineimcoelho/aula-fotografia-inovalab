import type { SlideKind } from './lesson.ts';
import { apertures,shutters,sensitivities } from './models.ts';
import { presentationScripts,type GuideFrame } from './presentation-script.ts';

export function mountScriptedPresenter(root:HTMLElement,kind:SlideKind,options:{enabled:boolean;last:boolean;initial?:number;preservePractice?:boolean;quiz:(frame:NonNullable<GuideFrame['quiz']>)=>void;changed:(step:number,total:number,busy:boolean)=>void}){
  const frames=presentationScripts[kind]??[];let enabled=options.enabled&&frames.length>0,step=options.initial??(options.last?frames.length-1:0),busy=false,firstFrame=true;
  const abort=new AbortController(),stage=root.querySelector<HTMLElement>('.stage')!;
  const get=<T extends HTMLElement>(id:string)=>root.querySelector<T>('#'+id);
  const click=(id:string)=>get<HTMLElement>(id)?.click();
  const set=(id:string,value:string|number,event='input')=>{const node=get<HTMLInputElement|HTMLSelectElement>(id);if(node){node.value=String(value);node.dispatchEvent(new Event(event,{bubbles:true}));}};
  const check=(id:string,value:boolean)=>{const node=get<HTMLInputElement>(id);if(node){node.checked=value;node.dispatchEvent(new Event('change',{bubbles:true}));}};
  const wait=async(predicate:()=>boolean,timeout=8000)=>{
    const started=performance.now();while(!abort.signal.aborted&&!predicate()&&performance.now()-started<timeout)await new Promise(resolve=>setTimeout(resolve,40));
    return !abort.signal.aborted&&predicate();
  };
  const cameraReady=()=>!get<HTMLButtonElement>('camera-shot')?.disabled;
  async function apply(frame:GuideFrame){
    root.dispatchEvent(new CustomEvent('presentation-cue',{detail:frame.cue}));
    if(frame.camera){
      if(!await wait(cameraReady))return;if(abort.signal.aborted)return;
      const f={aperture:5.6,shutter:1/250,iso:400,compare:false,...frame.camera};
      set('camera-aperture',apertures.indexOf(f.aperture));set('camera-shutter',shutters.indexOf(f.shutter));set('camera-iso',sensitivities.indexOf(f.iso));check('camera-blur-compare',f.compare);
      if(f.assembled){if(get('camera-disassemble')?.getAttribute('aria-expanded')==='true')click('camera-disassemble');click('camera-overview');}
      else{if(get('camera-disassemble')?.getAttribute('aria-expanded')!=='true')click('camera-disassemble');if(f.part)root.querySelector<HTMLElement>(`[data-piece="${f.part}"]`)?.click();}
      if(f.capture){click('camera-shot');await wait(cameraReady,6000);}
    }
    if(frame.light){
      set('example-choice',frame.light.example,'change');
      root.querySelector<HTMLElement>(`[data-light-view="${frame.light.view??'photo'}"]`)?.click();
      if(frame.light.size!==undefined)set('lighting-size',frame.light.size);if(frame.light.color)set('lighting-color',frame.light.color);
    }
    if(frame.lab){
      const f={aperture:5.6,shutter:1/250,iso:400,light:0,focus:'subject',compare:false,paused:false,...frame.lab};
      set('aperture-range',apertures.indexOf(f.aperture));set('shutter-range',shutters.indexOf(f.shutter));set('iso-range',sensitivities.indexOf(f.iso));set('scene-light',f.light,'change');set('focus-plane',f.focus,'change');check('blur-compare',f.compare);
      const paused=get('motion-pause')?.textContent?.includes('Retomar')??false;if(paused!==f.paused)click('motion-pause');
    }
    if(frame.example!==undefined)set('example-choice',frame.example,'change');
    if(frame.crop){const f=frame.crop;set('crop-x',f.x);set('crop-y',f.y);set('crop-zoom',f.zoom);if(get('thirds-grid')?.hidden===f.grid)click('grid-toggle');}
    if(frame.edit){const f=frame.edit;set('edit-light',f.light);set('edit-contrast',f.contrast);set('edit-color',f.color);set('compare-split',f.split);}
    if(frame.poster){
      const f={overlay:true,type:true,blend:'overlay',opacity:65,font:'sans',position:'bottom',...frame.poster};
      const reference=!get('poster-reference')?.hidden;if(reference!==f.reference)click('poster-reference-toggle');
      if(!f.reference){check('layer-base',true);check('layer-overlay',f.overlay);check('layer-type',f.type);check('poster-contrast',false);set('poster-text','Inovalab');set('poster-blend',f.blend);set('poster-opacity',f.opacity);set('poster-font',f.font);set('poster-align',f.position);}
    }
    if(frame.quiz)options.quiz(frame.quiz);
    if(frame.practice&&!(firstFrame&&options.preservePractice)){root.querySelector<HTMLElement>(`[data-timer="${frame.practice.minutes}"]`)?.click();if(frame.practice.running)click('timer-toggle');}
  }
  const report=()=>{if(!abort.signal.aborted)options.changed(enabled?step:0,enabled?frames.length:0,busy);};
  async function show(next:number){
    if(abort.signal.aborted)return;step=next;busy=true;stage.setAttribute('aria-busy','true');report();
    try{await apply(frames[step]);}finally{firstFrame=false;if(!abort.signal.aborted){busy=false;stage.removeAttribute('aria-busy');report();}}
  }
  stage.classList.toggle('guided-presentation',enabled);
  if(enabled)void show(step);else report();
  return {
    navigate(direction:number){if(busy)return true;if(!enabled)return false;const next=step+direction;if(next<0||next>=frames.length)return false;void show(next);return true;},
    disable(){enabled=false;stage.classList.remove('guided-presentation');root.dispatchEvent(new CustomEvent('presentation-cue',{detail:{text:'',left:[],right:[]}}));report();},
    dispose(){abort.abort();},
  };
}
