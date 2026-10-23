import { test,expect } from '@playwright/test';
const ready=async(page)=>expect(page.locator('.stage')).not.toHaveAttribute('aria-busy','true',{timeout:20000});
const next=async(page)=>{await ready(page);await page.keyboard.press('ArrowRight');await ready(page);};

test('setas executam a câmera, voltam uma etapa e Shift pula sem deixar ações antigas ativas',async({page})=>{
  await page.setViewportSize({width:3840,height:1440});await page.goto('/#camera');await ready(page);
  await expect(page.locator('.stage')).toHaveAttribute('data-steps','9');await expect(page.locator('.center .camera-result')).toBeVisible();
  await expect(page.locator('.tower input,.tower button,.tower select')).toHaveCount(0);
  const size=await page.locator('.tower-cue').first().evaluate(n=>parseFloat(getComputedStyle(n).fontSize));expect(size).toBeGreaterThanOrEqual(60);
  await next(page);await expect(page).toHaveURL(/#camera$/);await expect(page.locator('#camera-disassemble')).toHaveAttribute('aria-expanded','true');
  await next(page);await expect(page.locator('#camera-aperture-value')).toHaveText('f/1.4');await expect(page.locator('#camera-photo-label')).toContainText('brilho igualado');
  await page.keyboard.press('ArrowLeft');await ready(page);await expect(page.locator('.stage')).toHaveAttribute('data-step','1');await expect(page.locator('#camera-aperture-value')).toHaveText('f/5.6');
  await page.keyboard.press('ArrowRight');await expect(page.locator('.stage')).toHaveAttribute('aria-busy','true');
  await page.keyboard.press('ArrowRight');await expect(page.locator('.stage')).toHaveAttribute('data-step','2');
  await page.keyboard.press('Shift+ArrowRight');await expect(page).toHaveURL(/#tipos-de-luz$/);await ready(page);
  await page.waitForTimeout(2300);await expect(page.locator('.stage')).toHaveAttribute('data-step','0');
});

test('fotômetro fica sob a imagem e o roteiro demonstra a compensação da exposição',async({page})=>{
  await page.goto('/#laboratorio');await ready(page);
  const photo=await page.locator('.simulation').boundingBox(),meter=await page.locator('.meter-row').boundingBox();expect(meter.y).toBeGreaterThanOrEqual(photo.y+photo.height);
  await next(page);await expect(page.locator('#meter-output')).toHaveText('-2,0 EV');
  await page.keyboard.press('PageDown');await ready(page);await expect(page.locator('#meter-output')).toHaveText('0,0 EV');
  await page.keyboard.press('PageUp');await ready(page);await expect(page.locator('#meter-output')).toHaveText('-2,0 EV');
  await page.keyboard.press('Shift+ArrowRight');await expect(page).toHaveURL(/#celular$/);
});

test('quiz por setas revela respostas sem inventar pontuação nem sobrescrever respostas salvas',async({page})=>{
  await page.goto('/#quiz');await ready(page);await expect(page.locator('.quiz-feedback')).toContainText('Próxima seta');
  await page.keyboard.press('Space');await ready(page);await expect(page.locator('.quiz-feedback')).toContainText('Uma exposição curta');
  for(let i=0;i<11;i++)await next(page);
  await expect(page.locator('#quiz-content h2')).toHaveText('6 perguntas revisadas.');expect(await page.evaluate(()=>localStorage.getItem('foto-quiz'))).toBeNull();
  await next(page);await expect(page).toHaveURL(/#missao$/);
});

test('triângulo e encerramento não têm atalhos redundantes e o último slide contém só texto',async({page})=>{
  await page.goto('/#triangulo');await expect(page.locator('.slide-body button')).toHaveCount(0);await next(page);await expect(page).toHaveURL(/#laboratorio$/);
  await page.goto('/#fim');await expect(page.locator('.slide img,.slide canvas,.slide-body button')).toHaveCount(0);await expect(page.locator('.closing-message')).toContainText('Que escolha');
  await page.keyboard.press('ArrowLeft');await expect(page).toHaveURL(/#mostra$/);
});

test('roteiro inicia fases da prática e preserva o relógio ao visitar outro slide',async({page})=>{
  await page.goto('/#pratica');await ready(page);await next(page);await page.waitForTimeout(1200);
  await page.keyboard.press('Shift+ArrowLeft');await expect(page).toHaveURL(/#missao$/);
  await page.keyboard.press('Shift+ArrowRight');await expect(page).toHaveURL(/#pratica$/);await ready(page);
  await expect(page.locator('.stage')).toHaveAttribute('data-step','1');await expect(page.locator('#timer-display')).not.toHaveText('25:00');
  await next(page);await expect(page.locator('#timer-phase')).toHaveText('Editar');await expect(page.locator('#timer-toggle')).toHaveText('Pausar');
});

test('opções permitem alternar roteiro e navegação manual com botão legível no telão',async({page})=>{
  await page.setViewportSize({width:3840,height:1440});await page.goto('/#camera');await ready(page);await page.locator('#open-settings').click();
  const size=await page.locator('#save-settings').evaluate(n=>{const s=getComputedStyle(n);return{height:n.getBoundingClientRect().height,needed:parseFloat(s.lineHeight)+parseFloat(s.paddingTop)+parseFloat(s.paddingBottom)};});expect(size.height).toBeGreaterThanOrEqual(size.needed);
  await page.locator('#presentation-mode').selectOption('manual');await page.locator('#save-settings').click();await page.keyboard.press('Escape');
  await page.keyboard.press('ArrowRight');await expect(page).toHaveURL(/#tipos-de-luz$/);
  await page.locator('#open-settings').click();await page.locator('#presentation-mode').selectOption('guided');await page.locator('#save-settings').click();await page.keyboard.press('Escape');await ready(page);
  await next(page);await expect(page).toHaveURL(/#tipos-de-luz$/);await expect(page.locator('.stage')).toHaveAttribute('data-step','1');
});
