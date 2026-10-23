import { readFileSync, writeFileSync } from 'node:fs';
const change=(file,fn)=>writeFileSync(file,fn(readFileSync(file,'utf8')));
const replace=(s,a,b)=>{if(!s.includes(a))throw Error('Missing: '+a.slice(0,100));return s.replace(a,b);};
change('src/lesson.ts',s=>{
 s=replace(s,"'aperture' | 'intro'", "'cover' | 'lighting' | 'lighting-examples' | 'composition-examples' | 'aperture' | 'intro'");
 const first=s.indexOf("  { id: 'abertura'"); const next=s.indexOf("  { id: 'percurso'");
 s=s.slice(0,first)+`  { id: 'inicio', title: 'Fotografia e Produção de Imagens', section: 'Antes do clique', kind: 'cover', minutes: '2 min', notes: 'Apresente o tema e observe a fotografia com a turma. Capa somente com título e elemento visual; a definição vem no próximo slide.' },
  { id: 'fotografar', title: 'O que é fotografia?', section: 'Antes do clique', kind: 'intro', minutes: '2 min', notes: 'Fotografia é o registro da luz para formar uma imagem em um sensor digital ou em filme. A luz pode vir de uma fonte ou ser refletida pelos objetos. Na foto, identifique fonte, assunto e ponto de vista. A definição foi reescrita a partir do conteúdo da aula anterior, sem reproduzir sua captura de dicionário.' },
`+s.slice(next);
 s=s.replace('cerca de 50 minutos','cerca de 55 minutos');
 s=s.replace("kind: 'camera', minutes: '6 min'", "kind: 'camera', minutes: '5 min'");
 s=s.replace('Separe as peças e selecione', 'Use Explodir câmera para separar todas as peças de uma vez. Ajuste o diafragma e o tempo, dispare e compare a duração da abertura do obturador. A sequência é desacelerada e não representa a duração real. Selecione');
 const pos=s.indexOf("  { id: 'triangulo'");
 s=s.slice(0,pos)+`  { id: 'iluminacao', title: 'A luz muda o que você vê.', section: 'Iluminação', kind: 'lighting', minutes: '3 min', notes: 'Explique direção, qualidade, intensidade e cor. Direção muda as sombras; o tamanho aparente da fonte muda a dureza; intensidade interfere na exposição; a cor da fonte influencia a reprodução das cores. Uma fonte próxima parece maior que a mesma fonte distante. Não confundir luz suave com pouca luz. Peça que a turma imagine girar o assunto perto de uma janela.' },
  { id: 'tipos-de-luz', title: 'De onde vem essa luz?', section: 'Iluminação', kind: 'lighting-examples', minutes: '3 min', notes: 'Percorra exemplos reais extraídos do PPTX e esquemas claramente identificados. Compare contraluz artificial e silhueta natural, depois luz frontal, lateral e suave. Nos esquemas a vista é de cima. Para comparar dureza em aula, use uma lanterna e uma janela ampla sem olhar diretamente para uma fonte forte.' },
`+s.slice(pos);
 const ap=s.indexOf("  { id: 'laboratorio'");
 s=s.slice(0,ap)+`  { id: 'abertura', title: 'Mais abertura. Mais luz.', section: 'Exposição', kind: 'aperture', minutes: '2 min', notes: 'Abra e feche o diafragma. Número f menor significa abertura maior, para a mesma distância focal. Relacione a abertura à luz capturada e à profundidade de campo. O diafragma agora aparece neste bloco, depois da definição e do funcionamento da câmera.' },
`+s.slice(ap);
 s=s.replace("kind: 'simulator', minutes: '6 min'","kind: 'simulator', minutes: '5 min'");
 s=s.replace("kind: 'meter', minutes: '3 min'","kind: 'meter', minutes: '2 min'");
 const comp=s.indexOf("  { id: 'composicao'");
 s=s.slice(0,comp)+`  { id: 'exemplos-composicao', title: 'Há mais de um jeito de compor.', section: 'Composição', kind: 'composition-examples', minutes: '4 min', notes: 'Oito exemplos: terços, linhas condutoras, diagonais, espaço negativo, centro e simetria, moldura, repetição e planos. As quatro primeiras imagens vêm do PPTX anterior; as demais são diagramas geométricos identificados. Mostre várias possibilidades, sem transformar ferramentas em regras obrigatórias. Pergunte qual delas os grupos querem experimentar.' },
`+s.slice(comp);
 s=s.replace("kind: 'composition', minutes: '4 min'","kind: 'composition', minutes: '2 min'");
 s=s.replace("kind: 'editing', minutes: '3 min'","kind: 'editing', minutes: '2 min'");
 s=s.replace('No Lightroom algumas funções exigem assinatura; compatibilidade RAW varia.', 'Enfatize Lightroom: pago por assinatura; há ferramentas básicas gratuitas no aplicativo móvel. Snapseed: gratuito. Não é necessário comprar aplicativo para esta atividade. Compatibilidade RAW varia.');
 s=s.replace("kind: 'practice', minutes: '45 min'","kind: 'practice', minutes: '40 min'").replace('25 minutos para fotografar','20 minutos para fotografar');
 return s;
});
change('src/views.ts',s=>{
 s=replace(s,"import type { SlideKind } from './lesson.ts';", "import type { SlideKind } from './lesson.ts';\nimport { compositions, lightingExamples } from './examples.ts';");
 s=replace(s,"  const court = asset('quadra.jpg'), portrait = asset('retrato.jpg');", "  const court = asset('aula-passada/contraluz-palco.jpg'), portrait = asset('aula-passada/capa-guitarrista.jpg');");
 s=replace(s,"  switch (kind) {",`  switch (kind) {
    case 'cover': return \`<figure class="cover-photo grow"><img src="\${portrait}" alt="Guitarrista sob a luz do palco, fotografia da aula anterior"></figure>\`;
    case 'lighting': return \`<dl class="lighting-factors grow"><div><dt>Direção</dt><dd>De frente, de lado ou por trás: as sombras mudam o volume.</dd></div><div><dt>Dura ou suave</dt><dd>O tamanho aparente da fonte muda a borda das sombras.</dd></div><div><dt>Intensidade</dt><dd>Mais ou menos luz na cena pede outras escolhas de exposição.</dd></div><div><dt>Cor</dt><dd>A fonte e o balanço de branco mudam como as cores aparecem.</dd></div></dl><p class="takeaway">Mude a posição do assunto em relação à luz. Observe antes de ajustar.</p>\`;
    case 'lighting-examples': return exampleViewer(lightingExamples, 'Luz');
    case 'composition-examples': return exampleViewer(compositions, 'Composição');`);
 const introStart=s.indexOf("    case 'intro':");const introEnd=s.indexOf("    case 'journey':");
 s=s.slice(0,introStart)+`    case 'intro': return \`<p class="lead definition">Fotografia é o registro da luz para formar uma imagem em um sensor digital ou em filme.</p><figure class="photo-figure definition-photo grow"><img src="\${portrait}" alt="Luz refletida por um guitarrista sendo registrada pela câmera"><figcaption>A luz ilumina o assunto, chega à câmera e vira imagem.</figcaption></figure>\`;
`+s.slice(introEnd);
 const camStart=s.indexOf("    case 'camera':");const camEnd=s.indexOf("    case 'light':");
 s=s.slice(0,camStart)+`    case 'camera': return \`<div id="camera-host" class="camera-host grow" aria-label="Câmera tridimensional"><p class="loading">Preparando a câmera…</p></div><div class="camera-actions"><button id="camera-explode" aria-expanded="false">Explodir câmera</button><button id="camera-shot" class="primary" disabled>Disparar</button></div><div class="camera-settings">\${range('camera-aperture','Diafragma',apertures,exposure.aperture,v=>\`f/\${v}\`)}\${range('camera-shutter','Tempo de exposição',shutters,exposure.shutter,formatShutter)}</div><div class="piece-tabs" aria-label="Peças da câmera">\${['Lente','Diafragma','Obturador','Sensor'].map((name,i)=>\`<button data-piece="\${['lens','aperture','shutter','sensor'][i]}" aria-pressed="\${i===0}">\${name}</button>\`).join('')}</div><p id="piece-description" class="explanation" aria-live="polite">Lente: direciona a luz e forma a imagem. Arraste a câmera para girar.</p><p class="fine-print">Modelo sem espelho. Disparo em câmera lenta: compare o intervalo de abertura. Alguns aparelhos usam obturador eletrônico.</p>\`;
`+s.slice(camEnd);
 s=s.replace('Retrato em luz natural com fundo desfocado','Guitarrista em um palco com luzes concentradas').replace('Quando há pouca luz, você pode precisar equilibrar tempo, abertura e ISO.','Num palco, áreas claras e escuras coexistem. Equilibre tempo, abertura e ISO sem apagar a atmosfera.');
 s=s.replace('Quadra fotográfica com enquadramento ajustável','Guitarrista com enquadramento ajustável').replace('Linhas e sombra de uma quadra vistas de um ponto elevado','Guitarrista fotografado por trás, voltado para o palco').replace('Fotografia original da quadra','Fotografia original do músico no palco');
 s=s.replace('alt="Retrato iluminado pela luz natural"','alt="Guitarrista iluminado pelas luzes do palco"');
 const appsStart=s.indexOf("    case 'apps':");const appsEnd=s.indexOf("    case 'poster':");
 s=s.slice(0,appsStart)+`    case 'apps': return \`<div class="app-options grow"><section><div class="app-heading"><h2>Lightroom</h2><strong class="app-cost">Pago · assinatura</strong></div><p>Edição e organização no celular e computador. No celular, há ferramentas básicas gratuitas; recursos premium e planos completos são pagos.</p></section><section><div class="app-heading"><h2>Snapseed</h2><strong class="app-cost">Gratuito</strong></div><p>Ajustes de luz, cor, corte e ferramentas seletivas no celular, sem assinatura.</p></section><section><h2>Editor do celular</h2><p>Também vale começar pelo que já está disponível: corte, luz e cor.</p></section></div><p class="takeaway">Para a atividade, você não precisa comprar um aplicativo.</p>\`;
`+s.slice(appsEnd);
 s=s.replace('>25:00<','>20:00<').replace('data-timer="25"','data-timer="20"').replace('25 min · Foto','20 min · Foto');
 return s;
});
change('src/main.ts',s=>{
 s=replace(s,"import { ExposureScene } from './exposure.ts';", "import { ExposureScene } from './exposure.ts';\nimport { compositions, lightingExamples, exampleMarkup } from './examples.ts';");
 s=replace(s,"let index = fromHash >= 0 ? fromHash : Math.min(slides.length - 1, Math.max(0, Number(read('foto-slide', 0)) || 0));", "const savedSlide = slides.findIndex(slide => slide.id === read('foto-slide-id', ''));\nlet index = fromHash >= 0 ? fromHash : savedSlide >= 0 ? savedSlide : 0;");
 s=s.replace('minutes: 25, seconds: 1500','minutes: 20, seconds: 1200').replace("save('foto-slide', index)","save('foto-slide-id', slides[index].id)").replace('timer.minutes===25','timer.minutes===20');
 s=s.replace('<main class="center">','<main class="center ${slide.kind === \'cover\' ? \'cover-mode\' : \'\'}">');
 const ca=s.indexOf("    const version = mountVersion; const host = select('camera-host')!;");const cb=s.indexOf("  if (slide.kind === 'simulator')");
 s=s.slice(0,ca)+`    const version = mountVersion, host = select('camera-host')!;
    let demo: import('./camera.ts').CameraDemo | undefined;
    let activePiece = 'lens', exploded = false, shotTimer = 0;
    const descriptions: Record<string,string> = {
      lens:'Lente: direciona a luz e forma a imagem. Arraste o modelo para girar.',
      aperture:'Diafragma: mude o controle para observar a abertura por onde passa a luz.',
      shutter:'Obturador: mude o tempo e dispare. Observe por quanto tempo o sensor fica exposto.',
      sensor:'Sensor: transforma a luz recebida em sinais que serão processados para formar a imagem.',
    };
    const selectPiece = (id: string) => {
      activePiece=id; demo?.select(id); select('piece-description')!.textContent=descriptions[id];
      app.querySelectorAll<HTMLElement>('[data-piece]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.piece===id)));
    };
    const explode = (value: boolean) => {
      exploded=value; demo?.setExploded(value?1:0);
      select('camera-explode')!.textContent=value?'Montar câmera':'Explodir câmera';
      select('camera-explode')!.setAttribute('aria-expanded',String(value));
    };
    const update = () => {
      demo?.setAperture(exposure.aperture);demo?.setShutter(exposure.shutter);
      for(const [id,value] of [['camera-aperture',\`f/\${exposure.aperture}\`],['camera-shutter',formatShutter(exposure.shutter)]]) {
        select(id+'-value')!.textContent=value;select(id)!.setAttribute('aria-valuetext',value);
      }
    };
    app.querySelectorAll<HTMLElement>('[data-piece]').forEach(button=>button.addEventListener('click',()=>selectPiece(button.dataset.piece!)));
    bind('camera-explode','click',()=>explode(!exploded));
    bind('camera-aperture','input',e=>{exposure.aperture=apertures[Number((e.target as HTMLInputElement).value)];explode(true);selectPiece('aperture');update();});
    bind('camera-shutter','input',e=>{exposure.shutter=shutters[Number((e.target as HTMLInputElement).value)];explode(true);selectPiece('shutter');update();});
    import('./camera.ts').then(module=>{
      if(version!==mountVersion)return;
      try {
        host.innerHTML='';demo=new module.CameraDemo(host,selectPiece);demo.select(activePiece);demo.setExploded(exploded?1:0);update();
        (select('camera-shot') as HTMLButtonElement).disabled=false;
      } catch { host.innerHTML='<div class="loading"><p>A câmera 3D não pôde abrir. Use os botões das peças e o laboratório de exposição para continuar.</p></div>'; }
    }).catch(()=>{if(version===mountVersion)host.innerHTML='<p>A demonstração não carregou. Recarregue a página para tentar novamente.</p>';});
    bind('camera-shot','click',()=>{
      if(!demo)return;explode(true);selectPiece('shutter');const duration=demo.fire();
      const button=select('camera-shot') as HTMLButtonElement;button.disabled=true;
      select('piece-description')!.textContent=\`Disparo em \${formatShutter(exposure.shutter)}, com f/\${exposure.aperture}. A animação desacelerada mostra o intervalo em que o sensor registra luz.\`;
      shotTimer=window.setTimeout(()=>{if(version===mountVersion)button.disabled=false;},duration);
    });
    update();cleanup=()=>{clearTimeout(shotTimer);demo?.dispose();};
  }
  if (slide.kind === 'composition-examples' || slide.kind === 'lighting-examples') {
    const examples=slide.kind==='composition-examples'?compositions:lightingExamples;
    let current=0;
    const update=()=>{
      const example=examples[current];
      select('example-media')!.innerHTML=exampleMarkup(example,asset('aula-passada/'));
      select('example-description')!.textContent=example.text;
      select('example-source')!.textContent=example.image?'Foto da aula anterior':'Diagrama didático';
      select('example-count')!.textContent=\`\${current+1} / \${examples.length}\`;
      (select('example-choice') as HTMLSelectElement).value=String(current);
      (select('example-previous') as HTMLButtonElement).disabled=current===0;
      (select('example-next') as HTMLButtonElement).disabled=current===examples.length-1;
    };
    bind('example-choice','change',e=>{current=Number((e.target as HTMLSelectElement).value);update();});
    bind('example-previous','click',()=>{current=Math.max(0,current-1);update();});
    bind('example-next','click',()=>{current=Math.min(examples.length-1,current+1);update();});update();
  }
`+s.slice(cb);
 return s;
});
