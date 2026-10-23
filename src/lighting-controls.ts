import { lightingDefaults, type LightingSettings } from './lighting-config.ts';
import type { LightingScene } from './lighting.ts';

export function mountLighting(root: HTMLElement) {
  const get=<T extends HTMLElement>(id:string)=>root.querySelector<T>('#'+id)!;
  let scene:LightingScene|undefined,disposed=false,current=0,settings:LightingSettings={...lightingDefaults[0]},view='photo';
  get<HTMLDetailsElement>('lighting-adjust').open=false;
  const update=()=>{
    get<HTMLOutputElement>('lighting-angle-value').textContent=`${settings.angle}°`;
    get<HTMLOutputElement>('lighting-power-value').textContent=`${Math.round(settings.power*100)}%`;
    scene?.setValue(settings);
  };
  const selectExample=(index:number)=>{
    current=index;settings={...lightingDefaults[index]};
    for(const [id,value] of [['lighting-angle',settings.angle],['lighting-size',settings.size],['lighting-power',settings.power*100],['lighting-color',settings.color]])get<HTMLInputElement|HTMLSelectElement>(String(id)).value=String(value);
    update();
  };
  const setView=(next:string)=>{
    view=next;get('lighting-workspace').dataset.view=next;get('lighting-adjust').hidden=next==='reference';
    root.querySelectorAll<HTMLElement>('[data-light-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lightView===view)));
    scene?.setView(next==='overview'?'overview':'photo');
    get('lighting-hint').textContent=next==='overview'?'Montagem 3D: fonte luminosa, assunto e câmera. Arraste para girar.':'Modelo didático: altere a luz e compare com o exemplo. A cena 3D não reproduz a fotografia.';
  };
  for(const id of ['lighting-angle','lighting-size','lighting-power','lighting-color'])get(id).addEventListener('input',()=>{
    settings.angle=Number(get<HTMLInputElement>('lighting-angle').value);settings.size=Number(get<HTMLSelectElement>('lighting-size').value);
    settings.power=Number(get<HTMLInputElement>('lighting-power').value)/100;settings.color=get<HTMLSelectElement>('lighting-color').value;update();
  });
  root.querySelectorAll<HTMLElement>('[data-light-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.lightView!)));
  get('lighting-reset').addEventListener('click',()=>selectExample(current));
  import('./lighting.ts').then(module=>{
    if(disposed)return;
    try{scene=new module.LightingScene(get('lighting-host'));scene.setValue(settings);scene.setView(view==='overview'?'overview':'photo');}
    catch{get('lighting-host').innerHTML='<p class="loading">O 3D não pôde abrir. Veja a fotografia ou o esquema em Exemplo.</p>';}
  }).catch(()=>{if(!disposed)get('lighting-host').innerHTML='<p class="loading">Não foi possível carregar o 3D. Recarregue a página ou continue em Exemplo.</p>';});
  setView('photo');
  return {selectExample,dispose:()=>{disposed=true;scene?.dispose();}};
}
