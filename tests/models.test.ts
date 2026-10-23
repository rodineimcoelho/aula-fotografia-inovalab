import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultExposure, captureFactors, exposureStops, formatShutter, remainingSeconds, timerText, safeUrl, escapeHtml } from '../src/models.ts';

test('a referência do simulador é zero e cada duplicação de tempo ou ISO vale um stop', () => {
  assert.equal(exposureStops(defaultExposure),0);
  assert.equal(exposureStops({...defaultExposure,shutter:defaultExposure.shutter*2}),1);
  assert.equal(exposureStops({...defaultExposure,iso:defaultExposure.iso*2}),1);
  assert.ok(Math.abs(exposureStops({...defaultExposure,aperture:defaultExposure.aperture/Math.sqrt(2)})-1)<1e-10);
});
test('ajustes de exposição equivalentes conservam o brilho de referência', () => {
  assert.ok(Math.abs(exposureStops({...defaultExposure,shutter:defaultExposure.shutter/2,iso:defaultExposure.iso*2}))<1e-10);
  assert.equal(exposureStops({...defaultExposure,light:-3}),-3);
});
test('o relógio não passa de zero e conserva segundos parciais', () => {
  assert.equal(remainingSeconds(2000,1001),1);
  assert.equal(remainingSeconds(2000,2100),0);
  assert.equal(timerText(1500),'25:00');assert.equal(timerText(0),'00:00');
  assert.equal(formatShutter(1/250),'1/250 s');
});
test('configuração não aceita esquemas executáveis e textos são escapados', () => {
  assert.equal(safeUrl('javascript:alert(1)'),null);assert.equal(safeUrl('data:text/html,x'),null);
  assert.equal(safeUrl('https://example.com/aula'),'https://example.com/aula');
  assert.equal(escapeHtml('<img src="x">'),'&lt;img src=&quot;x&quot;&gt;');
});

test('o ganho ISO não aumenta luz capturada; compensar tempo por ISO preserva sinal',()=>{
  const reference=captureFactors(defaultExposure);
  const highISO=captureFactors({...defaultExposure,iso:6400});
  assert.equal(highISO.light,reference.light);assert.equal(highISO.signal,reference.signal*16);
  const shortTime=captureFactors({...defaultExposure,shutter:1/4000,iso:6400});
  assert.equal(shortTime.light,reference.light/16);assert.equal(shortTime.signal,reference.signal);
  assert.equal(captureFactors({...defaultExposure,aperture:2.8}).light,reference.light*4);
});
