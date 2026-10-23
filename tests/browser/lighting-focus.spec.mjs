import {test,expect} from '@playwright/test';
import { useManualMode } from './manual-mode.mjs';
test.beforeEach(async({page})=>useManualMode(page));

async function boardSharpness(page){
  return page.locator('#exposure-canvas').evaluate(canvas=>{
    const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,data=ctx.getImageData(0,0,w,h).data;
    let sum=0,count=0;
    for(let y=Math.floor(h*.16);y<h*.31;y++)for(let x=Math.floor(w*.75);x<w*.91-1;x++){
      const a=(y*w+x)*4,b=a+4;
      sum+=Math.abs(data[a]-data[b])+Math.abs(data[a+1]-data[b+1])+Math.abs(data[a+2]-data[b+2]);count++;
    }return sum/count;
  });
}

test('desfoque depende do plano: fundo nítido ao fechar e ao mudar o foco',async({page})=>{
  await page.goto('/#laboratorio');await page.locator('#motion-pause').click();await page.locator('#focus-options summary').click();await page.locator('#blur-compare').check();
  await page.locator('#aperture-range').focus();await page.keyboard.press('Home');await page.waitForTimeout(100);
  const wide=await boardSharpness(page);
  await page.locator('#aperture-range').focus();await page.keyboard.press('End');await page.waitForTimeout(100);
  const closed=await boardSharpness(page);expect(closed).toBeGreaterThan(wide*1.3);
  await page.locator('#aperture-range').focus();await page.keyboard.press('Home');
  await page.locator('#focus-plane').selectOption('background');await page.waitForTimeout(100);
  expect(await boardSharpness(page)).toBeGreaterThan(wide*1.3);
  await expect(page.locator('#focus-status')).toContainText('no fundo');
  await expect(page.locator('#blur-note')).toContainText('Brilho igualado');
});

test('prévia 3D muda a profundidade sem mudar o brilho no modo de comparação',async({page})=>{
  await page.goto('/#camera');await expect(page.locator('#camera-shot')).toBeEnabled({timeout:20000});
  await page.locator('#camera-options summary').click();await page.locator('#camera-blur-compare').check();
  const measure=()=>page.locator('#camera-preview').evaluate(canvas=>{
    const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let sum=0;
    for(let i=0;i<data.length;i+=4)sum+=data[i]+data[i+1]+data[i+2];return {mean:sum/(data.length/4*3),image:canvas.toDataURL()};
  });
  await page.locator('#camera-aperture').focus();await page.keyboard.press('Home');const wide=await measure();
  await page.locator('#camera-aperture').focus();await page.keyboard.press('End');const closed=await measure();
  expect(wide.image).not.toBe(closed.image);expect(Math.abs(wide.mean-closed.mean)).toBeLessThan(closed.mean*.15);
  await expect(page.locator('#camera-photo-label')).toContainText('brilho igualado');
});

test('cada exemplo de luz tem uma cena 3D distinta, montagem e ajustes restauráveis',async({page})=>{
  await page.goto('/#tipos-de-luz');await expect(page.locator('#lighting-host canvas')).toBeVisible({timeout:20000});
  const images=[];
  for(let i=0;i<6;i++){
    await page.locator('#example-choice').selectOption(String(i));await page.waitForTimeout(180);
    images.push(await page.locator('#lighting-host canvas').evaluate(canvas=>canvas.toDataURL()));
    await expect(page.locator('#example-count')).toHaveText(`${i+1} / 6`);
  }
  expect(new Set(images).size).toBe(6);
  await page.locator('[data-light-view=overview]').click();await expect(page.locator('#lighting-hint')).toContainText('Arraste');
  await page.locator('#example-choice').selectOption('3');await page.locator('#lighting-adjust summary').click();await page.locator('#lighting-angle').focus();await page.keyboard.press('Home');
  await expect(page.locator('#lighting-angle-value')).toHaveText('-180°');await page.locator('#lighting-reset').click();await expect(page.locator('#lighting-angle-value')).toHaveText('-90°');
  await page.locator('#lighting-size').selectOption('2.4');await page.locator('#lighting-color').selectOption('cool');
  await page.locator('[data-light-view=reference]').click();await expect(page.locator('#example-media svg')).toBeVisible();
  await page.locator('[data-light-view=photo]').click();await expect(page.locator('#lighting-host canvas')).toBeVisible();
});

test('montagem e controles de luz funcionam no celular e summary aceita espaço',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/#tipos-de-luz');
  await expect(page.locator('#lighting-host canvas')).toBeVisible({timeout:20000});
  await expect(page.locator('#lighting-adjust')).not.toHaveAttribute('open');
  await page.locator('#lighting-adjust summary').focus();await page.keyboard.press('Space');await expect(page.locator('#lighting-adjust')).toHaveAttribute('open','');
  await expect(page.locator('#slide-title')).toHaveText('De onde vem essa luz?');
  await page.locator('#lighting-size').selectOption('2.4');await page.locator('[data-light-view=overview]').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
});
