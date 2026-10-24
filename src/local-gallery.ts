import {escapeHtml} from './models.ts';
import {icon} from './views.ts';

type Entry={url:string;title:string;popular:number;jury:number|null};
let entries:Entry[]=[];
let current=0;
let winners=false;

export function mountLocalGallery(host:HTMLElement){
 const show=()=>{
  const entry=entries[current];
  if(!entry){
   host.innerHTML=`<div class="local-gallery-empty"><p>Receba as fotos pelo canal combinado e abra os arquivos neste computador.</p><label class="local-gallery-import">Selecionar fotos<input id="local-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><p class="fine-print">A mostra funciona sem servidor. As imagens ficam somente nesta aba; mantenha-a aberta até terminar.</p></div>`;
  }else if(winners){
   const popularMax=Math.max(...entries.map(photo=>photo.popular));
   const juryScores=entries.map(photo=>photo.jury).filter((score):score is number=>score!==null);
   const juryMax=juryScores.length?Math.max(...juryScores):null;
   const names=(list:Entry[])=>list.map(photo=>`<li>${escapeHtml(photo.title)}</li>`).join('');
   host.innerHTML=`<div class="local-gallery-results"><h2>Destaques da turma</h2><section><h3>Escolha popular</h3>${popularMax?`<ul>${names(entries.filter(photo=>photo.popular===popularMax))}</ul><p>${popularMax} voto${popularMax===1?'':'s'}</p>`:'<p>Ainda sem votos registrados.</p>'}</section><section><h3>Escolha dos jurados</h3>${juryMax!==null?`<ul>${names(entries.filter(photo=>photo.jury===juryMax))}</ul><p>Nota ${juryMax}</p>`:'<p>Ainda sem notas registradas.</p>'}</section><button id="local-back" class="primary">Voltar às fotos</button></div>`;
  }else{
   host.innerHTML=`<div class="local-gallery-photo"><div class="local-gallery-heading"><h2 id="local-photo-title">${escapeHtml(entry.title)}</h2><span>${current+1} / ${entries.length}</span></div><figure><img src="${entry.url}" alt="${escapeHtml(entry.title)}"><button id="local-prev" aria-label="Foto anterior">${icon('left')}</button><button id="local-next" aria-label="Próxima foto">${icon('right')}</button></figure><details class="local-gallery-votes"><summary>Editar título e registrar votação</summary><div><label>Título<input id="local-title" type="text" maxlength="80" value="${escapeHtml(entry.title)}"></label><label>Votos populares<input id="local-popular" type="number" min="0" step="1" value="${entry.popular}"></label><label>Nota dos jurados<input id="local-jury" type="number" min="0" max="5" step="0.5" placeholder="—" value="${entry.jury??''}"></label><button id="local-clear" class="text-action">Limpar mostra</button></div><p>Contagem feita pelo professor; não há envio ou votação online nesta mostra.</p></details><div class="local-gallery-actions"><label class="local-gallery-import">Adicionar fotos<input id="local-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><button id="local-winners">Ver destaques</button></div></div>`;
  }
  host.querySelector<HTMLInputElement>('#local-photos')?.addEventListener('change',event=>{
   const files=[...(event.target as HTMLInputElement).files??[]].filter(file=>['image/jpeg','image/png','image/webp'].includes(file.type));
   if(!files.length)return;
   entries.push(...files.map(file=>({url:URL.createObjectURL(file),title:file.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').trim()||'Sem título',popular:0,jury:null})));
   current=entries.length-files.length;winners=false;show();
  });
  host.querySelector<HTMLInputElement>('#local-title')?.addEventListener('input',event=>{
   entry.title=(event.target as HTMLInputElement).value.trim()||'Sem título';
   const title=host.querySelector('#local-photo-title');if(title)title.textContent=entry.title;
  });
  host.querySelector<HTMLInputElement>('#local-popular')?.addEventListener('change',event=>{entry.popular=Math.max(0,Math.floor(Number((event.target as HTMLInputElement).value)||0));});
  host.querySelector<HTMLInputElement>('#local-jury')?.addEventListener('change',event=>{const input=event.target as HTMLInputElement;entry.jury=input.value===''?null:Math.max(0,Math.min(5,Number(input.value)||0));});
  host.querySelector('#local-prev')?.addEventListener('click',()=>{current=(current+entries.length-1)%entries.length;show();});
  host.querySelector('#local-next')?.addEventListener('click',()=>{current=(current+1)%entries.length;show();});
  host.querySelector('#local-winners')?.addEventListener('click',()=>{winners=true;show();});
  host.querySelector('#local-back')?.addEventListener('click',()=>{winners=false;show();});
  host.querySelector('#local-clear')?.addEventListener('click',()=>{for(const photo of entries)URL.revokeObjectURL(photo.url);entries=[];current=0;winners=false;show();});
 };
 const onKey=(event:KeyboardEvent)=>{
  if(event.shiftKey||event.ctrlKey||event.altKey||event.metaKey||winners||entries.length<2||document.querySelector('#sheet:not([hidden])'))return;
  if(['INPUT','SELECT','TEXTAREA'].includes((event.target as HTMLElement)?.tagName))return;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
   event.preventDefault();event.stopImmediatePropagation();
   current=(current+(event.key==='ArrowRight'?1:-1)+entries.length)%entries.length;show();
  }
 };
 document.addEventListener('keydown',onKey,true);show();
 return ()=>document.removeEventListener('keydown',onKey,true);
}
