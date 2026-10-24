import {escapeHtml} from './models.ts';
import {icon} from './views.ts';

type Entry={url:string;title:string};
let entries:Entry[]=[];
let current=0;

export function mountLocalGallery(host:HTMLElement){
 const show=()=>{
  const entry=entries[current];
  if(!entry){
   host.innerHTML=`<div class="local-gallery-empty"><p>Receba as fotos pelo canal combinado e abra os arquivos neste computador.</p><label class="local-gallery-import">Selecionar fotos<input id="local-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><p class="fine-print">A mostra funciona sem servidor. As imagens ficam nesta aba; mantenha-a aberta até terminar.</p></div>`;
  }else{
   host.innerHTML=`<div class="local-gallery-photo"><div class="local-gallery-heading"><h2 id="local-photo-title">${escapeHtml(entry.title)}</h2><span>${current+1} / ${entries.length}</span></div><figure><img class="local-photo-reveal" src="${entry.url}" alt="${escapeHtml(entry.title)}"><button id="local-prev" aria-label="Foto anterior">${icon('left')}</button><button id="local-next" aria-label="Próxima foto">${icon('right')}</button></figure><details class="local-gallery-edit"><summary>Editar título</summary><label>Título<input id="local-title" type="text" maxlength="80" value="${escapeHtml(entry.title)}"></label></details><div class="local-gallery-actions"><label class="local-gallery-import">Adicionar fotos<input id="local-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><button id="local-clear" class="text-action">Limpar mostra</button></div></div>`;
  }
  host.querySelector<HTMLInputElement>('#local-photos')?.addEventListener('change',event=>{
   const files=[...(event.target as HTMLInputElement).files??[]].filter(file=>['image/jpeg','image/png','image/webp'].includes(file.type));
   if(!files.length)return;
   entries.push(...files.map(file=>({url:URL.createObjectURL(file),title:file.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').trim()||'Sem título'})));
   current=entries.length-files.length;show();
  });
  host.querySelector<HTMLInputElement>('#local-title')?.addEventListener('input',event=>{
   entry.title=(event.target as HTMLInputElement).value.trim()||'Sem título';
   const title=host.querySelector('#local-photo-title');if(title)title.textContent=entry.title;
  });
  host.querySelector('#local-prev')?.addEventListener('click',()=>{current=(current+entries.length-1)%entries.length;show();});
  host.querySelector('#local-next')?.addEventListener('click',()=>{current=(current+1)%entries.length;show();});
  host.querySelector('#local-clear')?.addEventListener('click',()=>{for(const photo of entries)URL.revokeObjectURL(photo.url);entries=[];current=0;show();});
 };
 const onKey=(event:KeyboardEvent)=>{
  if(event.shiftKey||event.ctrlKey||event.altKey||event.metaKey||entries.length<2||document.querySelector('#sheet:not([hidden])'))return;
  if(['INPUT','SELECT','TEXTAREA'].includes((event.target as HTMLElement)?.tagName))return;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
   event.preventDefault();event.stopImmediatePropagation();
   current=(current+(event.key==='ArrowRight'?1:-1)+entries.length)%entries.length;show();
  }
 };
 document.addEventListener('keydown',onKey,true);show();
 return ()=>document.removeEventListener('keydown',onKey,true);
}
