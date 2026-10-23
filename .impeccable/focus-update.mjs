import {readFileSync,writeFileSync} from 'node:fs';
let views=readFileSync('src/views.ts','utf8');
views=views.replace('<figcaption id="camera-photo-label">Resultado previsto · cena 3D</figcaption>','<figcaption><span id="camera-photo-label">Resultado previsto · cena 3D</span><label class="camera-blur-option"><input id="camera-blur-compare" type="checkbox"> Igualar brilho · comparar desfoque</label></figcaption>');
views=views.replace('Cena didática simulada · foco na bola','Cena didática · foco na bola').replace('<span>Cena didática · foco na bola</span>','<span id="focus-status">Cena didática · foco na bola</span>');
views=views.replace('<div class="meter-row">','<div class="focus-controls"><label class="select-label">Plano em foco<select id="focus-plane"><option value="subject">Bola</option><option value="background">Fundo</option><option value="foreground">Primeiro plano</option></select></label><label class="focus-compare"><input id="blur-compare" type="checkbox"> Igualar brilho para comparar desfoque</label></div><div class="meter-row">');
views=views.replace('<p class="fine-print">Simulação aproximada: abertura altera a profundidade; tempo altera o rastro; ISO não acrescenta luz à cena.</p>','<p id="blur-note" class="fine-print">Abertura maior desfoca os planos fora de foco. Tempo altera o rastro; ISO não acrescenta luz.</p>');
writeFileSync('src/views.ts',views);
