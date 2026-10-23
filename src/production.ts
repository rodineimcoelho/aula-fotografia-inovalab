import {blendModes} from './blend-modes.ts';
export function mountProduction(root: HTMLElement) {
  const get = <T extends HTMLElement>(id: string) => root.querySelector<T>('#'+id)!;
  const value = (id: string) => get<HTMLInputElement | HTMLSelectElement>(id).value;
  let reference = true;
  function render() {
    get('poster-reference').hidden = !reference;get('poster-study').hidden = reference;
    get('poster-mode').textContent = reference ? 'Arte fornecida · composição final' : 'Estudo interativo · novas camadas';
    get('poster-reference-toggle').textContent = reference ? 'Experimentar camadas' : 'Ver referência';
    get<HTMLFieldSetElement>('poster-tools').disabled = reference;
    get('poster-tools').hidden = reference;
    get('poster-base').hidden = !get<HTMLInputElement>('layer-base').checked;
    get('poster-overlay').hidden = !get<HTMLInputElement>('layer-overlay').checked;
    get('poster-type').hidden = !get<HTMLInputElement>('layer-type').checked;
    get('poster-overlay').style.mixBlendMode = value('poster-blend');
    get('poster-overlay').style.opacity = String(Number(value('poster-opacity'))/100);
    get('poster-opacity-value').textContent = value('poster-opacity')+'%';
    get('poster-title').textContent = value('poster-text') || 'Seu título aqui.';
    get('poster-type').classList.toggle('type-serif',value('poster-font')==='serif');
    get('poster-type').classList.toggle('type-clear',!get<HTMLInputElement>('poster-contrast').checked);
    get('poster-type').dataset.position = value('poster-align');
    const selected=blendModes.find(mode=>mode.id===value('poster-blend'))!;
    get('poster-explanation').textContent = reference
      ? 'Observe a combinação de fotografias, os recortes, o preto e branco e o título vermelho. O arquivo recebido já está achatado.'
      : `${selected.name}: ${selected.effect} Ligue e desligue as camadas para comparar.`;
  }
  get('poster-reference-toggle').addEventListener('click',()=>{reference=!reference;render();});
  root.querySelectorAll('#poster-tools input,#poster-tools select').forEach(control=>{
    control.addEventListener('input',render);control.addEventListener('change',render);
  });render();
}
