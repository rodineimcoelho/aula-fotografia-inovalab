import {readFileSync,writeFileSync} from 'node:fs';
const path='src/views.ts';let source=readFileSync(path,'utf8');
source=source.replace('<div class="camera-visuals grow"><div id="camera-host"', '<div id="camera-visuals" class="camera-visuals grow"><div class="camera-model"><div id="camera-detail-header" class="camera-detail-header" hidden><strong id="camera-detail-name">Lente</strong><button id="camera-overview" class="compact">Ver conjunto</button></div><div id="camera-host"');
source=source.replace('Preparando a câmera…</p></div><figure class="camera-result">','Preparando a câmera…</p></div></div><figure class="camera-result">');
source=source.replace('Lente: forma a imagem. Arraste o modelo para girar.</p>','Selecione uma peça para ampliar. Arraste o modelo para girar.</p>');
writeFileSync(path,source);
