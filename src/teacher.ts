import { slides } from './lesson.ts';
import { presentationScripts } from './presentation-script.ts';
import type {GuideFrame} from './presentation-script.ts';
import {teacherTopics,stepTopics} from './teacher-topics.ts';
import { escapeHtml } from './models.ts';
import { icon } from './views.ts';
import './teacher.css';

function roadmapLabel(frame:GuideFrame){
 if(frame.quiz){if(frame.quiz.complete)return 'Síntese';return `Pergunta ${frame.quiz.position+1} · ${frame.quiz.reveal?'resposta':'previsão'}`;}
 if(frame.practice)return frame.cue.text;
 const labels=[frame.cue.left.join(' '),frame.cue.right.join(' ')].filter(Boolean);
 return labels.length?labels.join(' · '):frame.cue.text;
}

export function mountTeacher(root:HTMLElement){
 document.title='Modo professor — Fotografia';
 let index=0,step=0;
 const frames=()=>presentationScripts[slides[index].kind]??[];
 function fromLocation(){
  const [id,position]=location.hash.slice(1).split('/');
  const found=slides.findIndex(s=>s.id===id);index=found<0?0:found;
  const n=Number(position??1)-1;step=Math.max(0,Math.min(frames().length-1,Number.isInteger(n)?n:0));
 }
 function move(direction:number,skip=false){
  const next=step+direction;
  if(!skip&&next>=0&&next<frames().length){step=next;}
  else if(index+direction>=0&&index+direction<slides.length){index+=direction;step=direction<0?Math.max(0,frames().length-1):0;}
  else return;
  render(true);
 }
 function render(updateUrl=false){
  const slide=slides[index],script=frames(),current=script[step],topics=teacherTopics(slide.kind),details=stepTopics(slide.kind,current,step);
  if(updateUrl)history.replaceState(null,'',`#${slide.id}${script.length?`/${step+1}`:''}`);
  const nextText=script[step+1]?.cue.text??(slides[index+1]?`Slide ${index+2} · ${slides[index+1].title}`:'Encerramento da aula.');
  root.innerHTML=`<main class="teacher-page"><header class="teacher-header"><div><a href="?professor=1#inicio" class="teacher-home">Modo professor</a><p>Navegação independente neste notebook</p></div><a href="./#${slide.id}" target="_blank" rel="noopener">Abrir apresentação ${icon('right')}</a></header>
   <div class="teacher-navigation"><label for="teacher-slide">Slide<select id="teacher-slide">${slides.map((s,i)=>`<option value="${i}" ${i===index?'selected':''}>${i+1}. ${escapeHtml(s.title)}</option>`).join('')}</select></label><p class="teacher-position" role="status">${index+1} / ${slides.length}${script.length?` · Etapa ${step+1} de ${script.length}`:''}</p><span class="teacher-time">${escapeHtml(slide.minutes)} sugeridos</span></div>
   <div class="teacher-workspace"><article class="teacher-speech" aria-labelledby="teacher-title"><h1 id="teacher-title">${escapeHtml(slide.title)}</h1>${current?`<p class="teacher-screen">Na tela · ${escapeHtml(current.cue.text)}</p>`:''}${details.length?`<ul class="teacher-step-topics">${details.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`:''}<h2>Tópicos</h2><ul id="teacher-topics" class="teacher-topic-list">${topics.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></article>
   <aside class="teacher-roadmap" aria-label="Roteiro da demonstração">${script.length?`<h2>Etapas</h2><ol>${script.map((f,i)=>`<li><button data-teacher-step="${i}" ${i===step?'aria-current="step"':''}>${escapeHtml(roadmapLabel(f))}</button></li>`).join('')}</ol>`:`<h2>Este momento</h2><p>${escapeHtml(slide.section)}</p>`}<div class="teacher-next"><h2>Na próxima seta</h2><p>${escapeHtml(nextText)}</p></div></aside></div>
   <footer class="teacher-footer"><button id="teacher-previous" ${index===0&&step===0?'disabled':''}>${icon('left')} Anterior</button><p>Setas: etapa · Shift + seta: slide</p><button id="teacher-next" class="primary" ${index===slides.length-1&&step>=Math.max(0,script.length-1)?'disabled':''}>Próximo ${icon('right')}</button></footer></main>`;
  root.querySelector<HTMLSelectElement>('#teacher-slide')!.addEventListener('change',e=>{index=Number((e.target as HTMLSelectElement).value);step=0;render(true);});
  root.querySelector('#teacher-previous')!.addEventListener('click',()=>move(-1));root.querySelector('#teacher-next')!.addEventListener('click',()=>move(1));
  root.querySelectorAll<HTMLElement>('[data-teacher-step]').forEach(button=>button.addEventListener('click',()=>{step=Number(button.dataset.teacherStep);render(true);}));
  if(matchMedia('(min-width:701px)').matches){
   const roadmap=root.querySelector<HTMLElement>('.teacher-roadmap')!,active=roadmap.querySelector<HTMLElement>('[aria-current="step"]');
   if(active){
    const target=Math.max(0,active.getBoundingClientRect().top-roadmap.getBoundingClientRect().top-roadmap.clientHeight/3);
    const starts=[...roadmap.querySelectorAll<HTMLElement>('li')].map(item=>item.offsetTop-roadmap.offsetTop).filter(value=>value<=target);
    roadmap.scrollTop=starts.at(-1)??0;
   }
  }
  if(updateUrl)root.querySelector<HTMLElement>('.teacher-speech')!.scrollTop=0;
 }
 document.addEventListener('keydown',event=>{
  if(event.ctrlKey||event.metaKey||event.altKey||event.repeat)return;
  const tag=(event.target as HTMLElement)?.tagName;if(['INPUT','SELECT','TEXTAREA','SUMMARY'].includes(tag))return;
  if(['ArrowRight','PageDown'].includes(event.key)||(event.key===' '&&tag!=='BUTTON')){event.preventDefault();move(1,event.shiftKey);}
  if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();move(-1,event.shiftKey);}
 });
 window.addEventListener('hashchange',()=>{fromLocation();render();});
 fromLocation();render();
}
