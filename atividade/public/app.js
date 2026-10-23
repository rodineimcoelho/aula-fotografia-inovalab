const app=document.getElementById('app');
const isAdmin=location.pathname==='/admin';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const get=id=>document.getElementById(id);
const on=(id,event,fn)=>get(id)?.addEventListener(event,fn);
const phaseLabel={collect:'Entregas abertas',vote:'Votação aberta',results:'Resultados revelados'};
let token='';try{token=(isAdmin?sessionStorage:localStorage).getItem(isAdmin?'foto-admin':'foto-participant')||'';}catch{}
let sessionId='';try{sessionId=localStorage.getItem('foto-activity-session')||'';}catch{}
let state=null,renderVersion=0,urls=[],imageData='',freshCodes=[];
let resultsTab='popular';

async function request(route,{method='GET',body,binary=false}={}){
  const headers={};if(token)headers.Authorization=`Bearer ${token}`;if(body!==undefined)headers['Content-Type']='application/json';
  const response=await fetch(route,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
  if(!response.ok){const result=await response.json().catch(()=>({error:'Não foi possível conectar. Confira a internet e tente novamente.'}));throw new Error(result.error);}
  return binary?response.blob():response.json();
}
function message(value,id='page-message'){const node=get(id);if(node)node.textContent=value;}
function remember(){try{(isAdmin?sessionStorage:localStorage).setItem(isAdmin?'foto-admin':'foto-participant',token);if(sessionId)localStorage.setItem('foto-activity-session',sessionId);}catch{}}
function header(label){return `<header><span>Fotografia e Produção de Imagens</span><button id="logout" class="text-button">${esc(label||'Sair')}</button></header><p id="page-message" class="page-message" role="status"></p>`;}
function afterRender(){
  urls.forEach(url=>URL.revokeObjectURL(url));urls=[];const version=++renderVersion;
  on('logout','click',()=>{token='';remember();location.href=isAdmin?'/admin':'/';});
  app.querySelectorAll('.remote-photo').forEach(async image=>{
    try{const blob=await request(`/api/images/${image.dataset.photo}`,{binary:true});const url=URL.createObjectURL(blob);if(image.isConnected&&version===renderVersion){image.src=url;urls.push(url);}else URL.revokeObjectURL(url);}catch{if(image.isConnected){const p=document.createElement('p');p.className='image-error';p.textContent='A imagem não carregou. Atualize para tentar novamente.';image.replaceWith(p);}}
  });
}
async function submitForm(event,action,status='page-message'){
  event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type=submit]');if(button)button.disabled=true;message('',status);
  try{await action(new FormData(form));}catch(error){message(error.message,status);}finally{if(button?.isConnected)button.disabled=false;}
}

function login(){
  if(isAdmin){
    app.innerHTML=`<div class="join-layout"><p>Fotografia e Produção de Imagens</p><h1>Prepare a experiência da turma.</h1><p>Crie a sessão, organize os grupos e acompanhe as fotografias antes de abrir a votação.</p><form id="admin-login"><label>Chave do professor<input id="admin-key" type="password" autocomplete="current-password" required></label><button type="submit" class="primary">Entrar no painel</button><p id="page-message" class="status" role="status"></p></form><p class="hint">Use a chave configurada no servidor ou a chave temporária mostrada ao iniciar a aplicação.</p></div>`;
    on('admin-login','submit',event=>submitForm(event,async()=>{token=get('admin-key').value;await request('/api/admin/sessions');remember();await adminHome();}));
  }else{
    const code=new URL(location.href).searchParams.get('sessao')||'';
    app.innerHTML=`<div class="join-layout"><p>Fotografia e Produção de Imagens</p><h1>O comum,<br>de outro jeito.</h1><p>Uma foto, um título e uma escolha para compartilhar com a turma.</p><form id="session-find"><label>Código da sessão<input id="session-code" autocomplete="off" maxlength="12" value="${esc(code)}" required autocapitalize="characters"></label><button type="submit" class="primary">Encontrar minha turma</button></form><div id="join-fields"></div><p id="page-message" class="status" role="status"></p></div>`;
    on('session-find','submit',event=>submitForm(event,async()=>{
      const result=await request(`/api/session/${encodeURIComponent(get('session-code').value.trim())}`);
      get('join-fields').innerHTML=`<h2>${esc(result.session.title)}</h2><p class="phase">${phaseLabel[result.session.phase]}</p><form id="join-form"><label>Seu código individual<input id="access-code" autocomplete="off" autocapitalize="characters" required maxlength="30" placeholder="P-… ou J-…"></label><label>Seu grupo<select id="group-id"><option value="">Selecione seu grupo · jurados não precisam</option>${result.groups.map(g=>`<option value="${esc(g.id)}">${esc(g.name)}</option>`).join('')}</select></label><button type="submit" class="primary">Entrar na atividade</button></form><p class="hint">O código individual é distribuído pelo professor. Se já entrou antes, use o mesmo código para continuar.</p>`;
      on('join-form','submit',joinEvent=>submitForm(joinEvent,async()=>{
        const joined=await request('/api/join',{method:'POST',body:{sessionCode:result.session.code,accessCode:get('access-code').value,groupId:get('group-id').value}});token=joined.token;sessionId=joined.session.id;state=joined;remember();participant();
      }));get('access-code').focus();
    }));
    if(code)get('session-find').requestSubmit();
  }
}

async function adminHome(){
  const result=await request('/api/admin/sessions');
  app.innerHTML=`${header()}<h1>Uma sessão para criar e olhar.</h1><form id="create-session"><label>Título da sessão<input id="session-title" maxlength="100" value="O comum, visto de outro jeito" required></label><button type="submit" class="primary">Criar sessão</button></form><section class="section"><h2>Sessões</h2><div class="session-list">${result.sessions.length?result.sessions.map(s=>`<button data-session="${esc(s.id)}"><span>${esc(s.title)}</span><small>${esc(s.code)} · ${phaseLabel[s.phase]}</small></button>`).join(''):'<p class="empty">Crie a primeira sessão para organizar os grupos.</p>'}</div></section>`;
  afterRender();on('create-session','submit',event=>submitForm(event,async()=>{const result=await request('/api/admin/sessions',{method:'POST',body:{title:get('session-title').value}});sessionId=result.session.id;freshCodes=[];await refresh(true);}));
  app.querySelectorAll('[data-session]').forEach(button=>button.addEventListener('click',async()=>{sessionId=button.dataset.session;freshCodes=[];try{await refresh(true);}catch(error){message(error.message);}}));
}

function adminSession(){
  const {session,groups,photos,participants}=state;
  const link=`${location.origin}/?sessao=${encodeURIComponent(session.code)}`;
  app.innerHTML=`${header()}<button id="back-sessions" class="text-button">Voltar às sessões</button><h1>${esc(session.title)}</h1><p class="phase">${phaseLabel[session.phase]}</p><p>Código da sessão: <strong class="session-code">${esc(session.code)}</strong></p><label>Link para compartilhar com a turma<input id="share-url" class="share-url" readonly value="${esc(link)}"></label><div class="actions"><button id="copy-link">Copiar link</button><button id="refresh-state">Atualizar</button></div>
    <div class="setup-grid section"><section><h2>Grupos</h2><div class="group-list">${groups.length?groups.map(g=>`<span>${esc(g.name)}</span>`).join(''):'Nenhum grupo criado.'}</div>${session.phase==='collect'?`<form id="create-groups" class="horizontal"><label>Quantidade<input id="group-count" type="number" min="1" max="50" value="6" required></label><button type="submit">Adicionar grupos</button></form>`:''}</section><section><h2>Códigos individuais</h2><p class="hint">${participants.filter(p=>p.role==='student').length} participantes · ${participants.filter(p=>p.role==='jury').length} jurados · ${participants.filter(p=>p.joined).length} acessos usados</p><form id="create-codes" class="horizontal"><label>Tipo<select id="code-role"><option value="student">Participantes</option><option value="jury">Jurados</option></select></label><label>Quantidade<input id="code-count" type="number" min="1" max="300" value="30" required></label><button type="submit">Gerar códigos</button></form></section></div>
    <div id="fresh-codes"></div><section class="section"><h2>Etapa da atividade</h2><p>Revise as entregas antes de abrir a votação. Depois de avançar, as fotos ficam bloqueadas para substituição.</p><div class="actions">${session.phase==='collect'?'<button id="advance-phase" data-phase="vote" class="primary">Encerrar entregas e abrir votação</button>':session.phase==='vote'?'<button id="advance-phase" data-phase="results" class="primary">Encerrar votação e revelar resultados</button>':'<p class="phase">Votação encerrada. Os resultados estão disponíveis para a turma.</p>'}</div><p class="hint">São necessárias pelo menos duas fotos aprovadas para abrir a votação.</p></section>
    <section class="section"><h2>${session.phase==='collect'?'Revisar fotografias':'Fotografias da sessão'} (${photos.length})</h2><div class="gallery">${photos.length?photos.map(photo=>photoCard(photo,true)).join(''):'<p class="empty">As entregas aparecerão aqui. Atualize a página para acompanhar.</p>'}</div></section>${session.phase==='results'?resultsHtml():''}`;
  afterRender();on('back-sessions','click',()=>void adminHome().catch(error=>message(error.message)));on('refresh-state','click',()=>void refresh(true).catch(error=>message(error.message)));
  on('copy-link','click',async()=>{try{await navigator.clipboard.writeText(link);message('Link copiado. Compartilhe com a turma.');}catch{get('share-url').select();message('Selecione e copie o endereço do campo acima.');}});
  on('create-groups','submit',event=>submitForm(event,async()=>{await request(`/api/admin/session/${session.id}/groups`,{method:'POST',body:{count:Number(get('group-count').value)}});await refresh(true);}));
  on('create-codes','submit',event=>submitForm(event,async()=>{const result=await request(`/api/admin/session/${session.id}/codes`,{method:'POST',body:{role:get('code-role').value,count:Number(get('code-count').value)}});freshCodes=result.codes;await refresh(true);}));
  on('advance-phase','click',async event=>{const button=event.currentTarget;button.disabled=true;try{await request(`/api/admin/session/${session.id}/phase`,{method:'POST',body:{phase:button.dataset.phase}});await refresh(true);}catch(error){message(error.message);button.disabled=false;}});
  app.querySelectorAll('[data-review]').forEach(button=>button.addEventListener('click',async()=>{button.disabled=true;try{await request(`/api/admin/photos/${button.dataset.photo}`,{method:'POST',body:{status:button.dataset.review}});await refresh(true);}catch(error){message(error.message);button.disabled=false;}}));
  renderCodes();bindResults();
}

function renderCodes(){
  if(!freshCodes.length)return;
  get('fresh-codes').innerHTML=`<section class="section"><h2>Códigos recém-gerados</h2><p>Salve estes códigos agora. Eles não serão mostrados novamente depois de sair desta sessão do painel.</p><div class="actions"><button id="download-codes" class="primary">Baixar lista CSV</button><button id="copy-codes">Copiar lista</button></div><div class="codes"><table><thead><tr><th>Identificação</th><th>Código individual</th></tr></thead><tbody>${freshCodes.map(c=>`<tr><td>${esc(c.label)}</td><td><code>${esc(c.code)}</code></td></tr>`).join('')}</tbody></table></div></section>`;
  const csv='identificacao,codigo,tipo\n'+freshCodes.map(c=>`${c.label},${c.code},${c.role}`).join('\n');
  on('download-codes','click',()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=`codigos-${state.session.code}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  on('copy-codes','click',async()=>{try{await navigator.clipboard.writeText(csv);message('Lista copiada. Distribua um código por participante.');}catch{message('Use Baixar lista CSV para salvar os códigos.');}});
}

function photoCard(photo,admin=false){
  const own=photo.group_id===state.user.group_id,vote=state.votes.find(v=>v.submission_id===photo.id),voting=state.session.phase==='vote'&&!own&&!admin;
  return `<article class="photo"><img src="/image-loading.svg" class="remote-photo" data-photo="${esc(photo.id)}" alt="${esc(photo.title)} · ${esc(photo.group_name)}"><h3>${esc(photo.title)}</h3><p class="muted">${esc(photo.group_name)}${own?' · seu grupo':''}</p>${admin||own?`<p class="photo-status">${({pending:'Aguardando revisão',approved:'Aprovada para a mostra',rejected:'Precisa de uma nova entrega'})[photo.status]}</p>`:''}${admin&&state.session.phase==='collect'?`<div class="actions"><button data-review="approved" data-photo="${esc(photo.id)}" class="primary">Aprovar</button><button data-review="rejected" data-photo="${esc(photo.id)}">Solicitar nova foto</button></div>`:''}${voting?`<form data-vote="${esc(photo.id)}"><div class="score-fields">${[['composition','Composição'],['light','Uso da luz'],['intent','Intenção']].map(([key,label])=>`<label>${label}<select name="${key}" required><option value="">Nota</option>${[1,2,3,4,5].map(n=>`<option value="${n}" ${vote?.[key]===n?'selected':''}>${n}</option>`).join('')}</select></label>`).join('')}</div><button type="submit" class="${vote?'':'primary'}">${vote?'Atualizar avaliação':'Salvar avaliação'}</button><p id="status-${esc(photo.id)}" class="status" role="status">${vote?'Avaliação salva. Você pode ajustá-la enquanto a votação estiver aberta.':''}</p></form>`:own&&state.session.phase==='vote'?'<p class="hint">Você avalia as fotografias de outros grupos.</p>':''}</article>`;
}

function participant(){
  const {session,user,photos}=state,group=state.groups.find(g=>g.id===user.group_id),own=photos.find(p=>p.group_id===user.group_id);
  app.innerHTML=`${header()}<p class="phase">${phaseLabel[session.phase]} · ${user.role==='jury'?'Jurado':esc(group?.name||'Participante')}</p><h1>${esc(session.title)}</h1><p>Fotografe algo comum de um jeito que comunique uma ideia. Escolha uma imagem, edite e dê um título.</p>${session.phase==='collect'&&user.role==='student'?`<section class="section upload-box"><h2>A foto do seu grupo</h2><p>Uma entrega por grupo. Uma nova versão substitui a anterior e volta para revisão do professor.</p><form id="upload-photo"><label>Título da fotografia<input id="photo-title" maxlength="80" value="${esc(own?.title||'')}" required></label><label>Imagem final<input id="photo-file" type="file" accept="image/jpeg,image/png,image/webp" required></label><img src="/image-loading.svg" id="upload-preview" class="preview-image" hidden alt="Prévia da fotografia escolhida"><p class="hint">Escolha JPEG, PNG ou WebP. A imagem será reduzida para envio e os metadados de captura serão removidos nesta exportação.</p><button type="submit" class="primary">Enviar fotografia do grupo</button><p id="upload-status" class="status" role="status"></p></form>${own?photoCard(own):''}</section>`:session.phase==='collect'?'<p class="empty">O professor está recebendo e revisando as fotos. A galeria será liberada quando a votação começar.</p>':''}
    ${session.phase==='vote'?`<section class="section"><h2>Olhe, pense e avalie.</h2><div class="rubric"><p><strong>Composição</strong><br>Como os elementos organizam o olhar?</p><p><strong>Uso da luz</strong><br>A luz ajuda a mostrar a ideia?</p><p><strong>Intenção</strong><br>A foto propõe um jeito próprio de ver?</p></div><p class="hint">Notas de 1 a 5: 1 = pouco evidente; 3 = funciona; 5 = muito claro. ${user.role==='jury'?'Sua avaliação entra somente na escolha dos jurados.':'Suas avaliações entram somente na escolha popular.'}</p><div class="gallery">${photos.map(photo=>photoCard(photo)).join('')}</div></section>`:''}
    ${session.phase==='results'?resultsHtml():''}<div class="section actions"><button id="refresh-state">Atualizar atividade</button><span class="hint">${esc(user.label)} · sessão ${esc(session.code)}</span></div>`;
  afterRender();on('refresh-state','click',()=>void refresh(true).catch(error=>message(error.message)));
  on('photo-file','change',async event=>{
    imageData='';get('upload-preview').hidden=true;const file=event.target.files[0];if(!file)return;
    try{
      if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Escolha uma imagem JPEG, PNG ou WebP.');
      if(file.size>25*1024*1024)throw new Error('Esta foto é muito grande. Exporte uma cópia com até 25 MB.');
      const object=URL.createObjectURL(file),image=new Image();image.src=object;await image.decode();URL.revokeObjectURL(object);
      const ratio=Math.min(1,2400/Math.max(image.naturalWidth,image.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);imageData=canvas.toDataURL('image/jpeg',.88);get('upload-preview').src=imageData;get('upload-preview').hidden=false;message('Imagem pronta para enviar.','upload-status');
    }catch(error){message(error.message||'Não foi possível abrir a imagem. Exporte uma nova cópia.','upload-status');}
  });
  on('upload-photo','submit',event=>submitForm(event,async()=>{if(!imageData)throw new Error('Escolha e aguarde a preparação da imagem antes de enviar.');await request('/api/submissions',{method:'POST',body:{title:get('photo-title').value,image:imageData}});imageData='';await refresh(true);message('Foto recebida. Aguarde a revisão do professor.');},'upload-status'));
  app.querySelectorAll('[data-vote]').forEach(form=>form.addEventListener('submit',event=>submitForm(event,async values=>{
    const photoId=form.dataset.vote;await request('/api/vote',{method:'POST',body:{photoId,composition:Number(values.get('composition')),light:Number(values.get('light')),intent:Number(values.get('intent'))}});message('Avaliação salva. Obrigado por olhar com atenção.',`status-${photoId}`);form.querySelector('button').textContent='Atualizar avaliação';
  },`status-${form.dataset.vote}`)));
  bindResults();
}

function resultsHtml(){
  const results=state.results||{popular:[],jury:[]},list=results[resultsTab],photos=state.photos;
  return `<section class="section"><h2>Uma mostra de escolhas.</h2><p>As notas de composição, luz e intenção têm o mesmo peso. Os resultados populares e dos jurados são apresentados separadamente.</p><div class="tab-controls"><button data-result-tab="popular" aria-pressed="${resultsTab==='popular'}">Escolha popular</button><button data-result-tab="jury" aria-pressed="${resultsTab==='jury'}">Escolha dos jurados</button></div><div class="results-list">${list.length?list.map((result,i)=>`<article class="result"><img src="/image-loading.svg" class="remote-photo" data-photo="${esc(result.id)}" alt="${esc(result.title)}"><div><p class="rank-label">${i>0&&Math.abs(result.score-list[i-1].score)<.000001?'Empate na média':i===0?'Maior média':'Destaque da mostra'}</p><h3>${esc(result.title)}</h3><p class="muted">${esc(result.group_name)}</p><p class="score">${Number(result.score).toFixed(2).replace('.',',')} / 5</p><p class="hint">${result.evaluations} ${result.evaluations===1?'avaliação':'avaliações'}</p></div></article>`).join(''):'<p class="empty">Não houve avaliações nesta categoria.</p>'}</div><h2>Todas as fotografias aprovadas</h2><div class="gallery">${photos.filter(p=>p.status==='approved').map(photo=>`<article class="photo"><img src="/image-loading.svg" class="remote-photo" data-photo="${esc(photo.id)}" alt="${esc(photo.title)}"><h3>${esc(photo.title)}</h3><p class="muted">${esc(photo.group_name)}</p></article>`).join('')}</div></section>`;
}
function bindResults(){app.querySelectorAll('[data-result-tab]').forEach(button=>button.addEventListener('click',()=>{resultsTab=button.dataset.resultTab;isAdmin?adminSession():participant();}));}
async function refresh(force=false){
  const next=await request(`/api/state/${sessionId}`);const changed=JSON.stringify(next)!==JSON.stringify(state);state=next;
  if(force||(changed&&!document.activeElement?.closest('form'))){isAdmin?adminSession():participant();}
}
setInterval(()=>{if(state&&sessionId&&token&&!document.activeElement?.closest('form'))void refresh().catch(()=>{});},15000);
if(token){if(isAdmin)adminHome().catch(()=>{token='';login();});else if(sessionId)refresh(true).catch(()=>{token='';login();});else login();}else login();
