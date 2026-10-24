import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { useManualMode } from './manual-mode.mjs';
test.beforeEach(async({page})=>useManualMode(page));

test('capa com título, QR Code, proporções do telão e definição seguinte',async({page})=>{
  await page.goto('/#inicio');await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('#slide-title')).toHaveText('Fotografia e Produção de Imagens');
  await expect(page.locator('.center img')).toHaveCount(0);await expect(page.locator('#aperture-close')).toHaveCount(0);
  await expect(page.locator('.topbar')).toBeHidden();
  await expect(page.locator('.cover-light svg')).toBeVisible();
  await expect(page.locator('.cover-qr svg')).toBeVisible();
  await expect(page.locator('.cover-follow')).toContainText('Acompanhe pelo celular');
  const widths=await page.locator('.stage > aside,.stage > main').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().width));
  expect(widths.map(w=>Math.round(w))).toEqual([180,180,720,180,180]);
  await expect(page.locator('.tower')).toHaveCount(4);for(const panel of await page.locator('.tower').all())await expect(panel).toBeEmpty();
  await page.screenshot({path:'.impeccable/review/desktop.png',fullPage:true});
  await page.keyboard.press('ArrowRight');await expect(page.locator('#slide-title')).toHaveText('fotografia');
  await expect(page.locator('.definition')).toContainText('Arte ou processo de fixar');await page.screenshot({path:'.impeccable/review/definition.png',fullPage:true});
  await expect(page.locator('.slide img')).toHaveCount(0);
  await page.keyboard.press('ArrowRight');await expect(page).toHaveURL(/#fotografia-exemplo$/);await expect(page.locator('#slide-title')).toBeHidden();
  await page.locator('.slide img').evaluate(image=>image.decode());await expect(page.locator('.slide img')).toBeVisible();await expect(page.locator('.definition')).toHaveCount(0);
  await page.screenshot({path:'.impeccable/review/definition-photo.png',fullPage:true});
  await page.keyboard.press('i');await expect(page.locator('#sheet')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#sheet')).toBeHidden();
});
test('todos os slides abrem e os painéis respeitam a divisão física no telão',async({page})=>{
  await page.setViewportSize({width:3840,height:1440});
  await page.goto('/#inicio');await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'.impeccable/review/user-3840.png',fullPage:true});
  const dimensions=await page.locator('.stage > aside,.stage > main').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
  expect(dimensions.map(d=>Math.round(d.w))).toEqual([480,480,1920,480,480]);expect(dimensions.every(d=>d.h===1440)).toBe(true);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const count=Number((await page.locator('.deck-progress').textContent()).split('/')[1]);
  for(let i=0;i<count;i++){
    await expect(page.locator('.slide')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);expect(overflow).toBe(false);
    if(i<count-1)await page.locator('#next-slide').click();
  }
  expect(errors).toEqual([]);await expect(page.locator('#next-slide')).toBeDisabled();
});
test('simulador reage aos controles sem trocar de slide ao usar setas no range',async({page})=>{
  await page.goto('/#laboratorio');
  await expect(page.locator('#meter-output')).toHaveText('0,0 EV');
  await page.locator('#iso-range').focus();await page.keyboard.press('End');
  await expect(page.locator('#iso-range-value')).toHaveText('6400');await expect(page.locator('#meter-output')).toHaveText('+4,0 EV');
  await expect(page.locator('#slide-title')).toHaveText('Congele sem escurecer.');
  await page.locator('#exposure-reset').click();await expect(page.locator('#meter-output')).toHaveText('0,0 EV');
  await page.locator('#motion-pause').click();await page.screenshot({path:'.impeccable/review/simulator.png',fullPage:true});
});
test('câmera 3D, seleção por botões e separação de peças',async({page})=>{
  await page.goto('/#camera');await expect(page.locator('#camera-host canvas')).toBeVisible({timeout:20000});
  await page.locator('#camera-disassemble').click();await expect(page.locator('#camera-disassemble')).toHaveAttribute('aria-expanded','true');
  await page.locator('#camera-aperture').focus();await page.keyboard.press('End');await expect(page.locator('#camera-aperture-value')).toHaveText('f/22');
  await page.keyboard.press('Home');await expect(page.locator('#camera-aperture-value')).toHaveText('f/1.4');
  await page.locator('#camera-shutter').focus();await page.keyboard.press('End');await expect(page.locator('#camera-shutter-value')).toHaveText('1 s');
  await page.locator('[data-piece=sensor]').click();await expect(page.locator('#piece-description')).toContainText('Sensor');
  await expect(page.locator('#camera-detail-name')).toHaveText('Sensor');await expect(page.locator('#camera-overview')).toBeVisible();
  await page.locator('#camera-shot').click();await expect(page.locator('#piece-description')).toContainText('Disparo');
  await expect(page.locator('#camera-shot')).toBeEnabled({timeout:5000});await page.screenshot({path:'.impeccable/review/camera.png',fullPage:true});
  await expect(page.locator('#camera-detail-name')).toHaveText('Sensor');
  await page.locator('#camera-overview').click();await expect(page.locator('#camera-detail-header')).toBeHidden();await expect(page.locator('#camera-disassemble')).toHaveAttribute('aria-expanded','true');
  await page.locator('#camera-disassemble').click();await expect(page.locator('#camera-disassemble')).toHaveAttribute('aria-expanded','false');
});
test('quiz guarda somente uma resposta por pergunta e apresenta explicações',async({page})=>{
  await page.goto('/#quiz');
  await expect(page.locator('.quiz-progress')).toHaveText('Pergunta 1 de 6');
  for(const answer of [0,1,2,0,1,2]){
    await page.locator(`[data-answer="${answer}"]`).click();await expect(page.locator('.quiz-feedback')).toContainText('Isso mesmo.');
    await expect(page.locator('[data-answer="0"]')).toBeDisabled();await page.locator('#quiz-next').click();
  }
  await expect(page.locator('#quiz-content')).toContainText('6 de 6 escolhas corretas.');
  await page.locator('#quiz-reset').click();await expect(page.locator('#quiz-content')).toContainText('Pergunta 1 de 6');
});
test('edição, enquadramento, título literal e cronômetro',async({page})=>{
  await page.goto('/#composicao');await page.locator('#grid-toggle').click();await expect(page.locator('#thirds-grid')).toBeHidden();
  await page.goto('/#edicao');await page.locator('#edit-light').focus();await page.keyboard.press('End');await expect(page.locator('#edited-photo')).toHaveCSS('filter',/brightness\(1.6\)/);
  await page.goto('/#producao');await page.locator('#poster-reference-toggle').click();await page.locator('#poster-text').fill('<img onerror=alert(1)>');await expect(page.locator('#poster-title')).toHaveText('<img onerror=alert(1)>');expect(await page.locator('#poster-title img').count()).toBe(0);
  await page.goto('/#pratica');await page.locator('[data-timer="5"]').click();await expect(page.locator('#timer-display')).toHaveText('05:00');await page.locator('#timer-toggle').click();await expect(page.locator('#timer-toggle')).toHaveText('Pausar');await page.locator('#timer-toggle').click();await expect(page.locator('#timer-toggle')).toHaveText('Continuar');
});
test('modo estudo legível no celular e vínculo de atividade validado',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/#inicio');await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.stage')).toHaveClass(/study/);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({path:'.impeccable/review/mobile.png',fullPage:true});
  await page.keyboard.press('i');await page.locator('#close-sheet').click();await page.keyboard.press('ArrowRight');
  await page.locator('#open-settings').click();await page.locator('#activity-url').fill('javascript:alert(1)');await page.locator('#save-settings').click();await expect(page.locator('#settings-status')).toContainText('endereço completo');
  await page.locator('#activity-url').fill('https://example.com/atividade');await page.locator('#save-settings').click();await page.locator('#close-sheet').click();await page.goto('/#mostra');await expect(page.locator('.qr-code svg')).toBeVisible();
});
test.beforeAll(async()=>{await mkdir('.impeccable/review',{recursive:true});});

test('exemplos de composição e iluminação, custos dos aplicativos e diafragma fora da capa',async({page})=>{
  await page.goto('/#exemplos-composicao');await expect(page.locator('#example-choice option')).toHaveCount(8);
  for(let i=0;i<8;i++){
    await page.locator('#example-choice').selectOption(String(i));await expect(page.locator('#example-count')).toHaveText(`${i+1} / 8`);
    if(i<4){await page.locator('#example-media img').evaluate(image=>image.decode());await expect(page.locator('#example-source')).toHaveCount(0);}
    else await expect(page.locator('#example-media svg')).toBeVisible();
  }
  await page.locator('#example-choice').selectOption('1');await page.screenshot({path:'.impeccable/review/composition.png',fullPage:true});
  await page.locator('#example-choice').selectOption('6');await page.screenshot({path:'.impeccable/review/composition-diagram.png',fullPage:true});
  await page.goto('/#tipos-de-luz');await page.locator('#example-media img').evaluate(image=>image.decode());await page.screenshot({path:'.impeccable/review/lighting.png',fullPage:true});
  await page.locator('#example-choice').selectOption('3');await expect(page.locator('#example-source')).toHaveCount(0);
  await page.goto('/#aplicativos');await expect(page.locator('.app-options')).toContainText('Pago · assinatura');await expect(page.locator('.app-options')).toContainText('Gratuito');
  for(const image of await page.locator('.app-logo').all())await image.evaluate(img=>img.decode());
  await expect(page.locator('.app-logo')).toHaveCount(2);
});
