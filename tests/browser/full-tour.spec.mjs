import {test,expect} from '@playwright/test';
import {presentationScripts,guidedBlendIds} from '../../src/presentation-script.ts';
import {blendModes} from '../../src/blend-modes.ts';
const ready=async page=>expect(page.locator('.stage')).not.toHaveAttribute('aria-busy','true');
test('as setas percorrem exemplo, montagem e câmera nos seis casos de luz',async({page})=>{
 await page.goto('/#tipos-de-luz');await ready(page);
 const frames=presentationScripts['lighting-examples'];
 for(let i=0;i<frames.length;i++){
  const f=frames[i].light;await expect(page.locator('#example-choice')).toHaveValue(String(f.example));
  await expect(page.locator('#lighting-workspace')).toHaveAttribute('data-view',f.view);
  if(i<frames.length-1){await page.keyboard.press('ArrowRight');await ready(page);}
 }
 await page.keyboard.press('ArrowLeft');await ready(page);await expect(page.locator('#lighting-color')).toHaveValue('warm');
 await page.keyboard.press('ArrowRight');await ready(page);await expect(page.locator('#lighting-color')).toHaveValue('cool');
});
test('o roteiro compara seis modos e o seletor mantém os16 disponíveis',async({page})=>{
 await page.setViewportSize({width:3840,height:1440});await page.goto('/#producao');await ready(page);
 await page.keyboard.press('ArrowRight');await ready(page);await page.keyboard.press('ArrowRight');await ready(page);
 for(const [i,id] of guidedBlendIds.entries()){
  await expect(page.locator('#poster-blend')).toHaveValue(id);await expect(page.locator('#poster-opacity')).toHaveValue('65');
  expect(await page.locator('#poster-overlay').evaluate(n=>getComputedStyle(n).mixBlendMode)).toBe(id);
  const alignment=await page.locator('.tower-cue').first().evaluate(n=>{const a=n.getBoundingClientRect(),b=n.closest('.tower').getBoundingClientRect();return{align:getComputedStyle(n).textAlign,delta:Math.abs((a.left+a.right-b.left-b.right)/2)};});expect(alignment.align).toBe('center');expect(alignment.delta).toBeLessThan(1);
  if(i<guidedBlendIds.length-1){await page.keyboard.press('ArrowRight');await ready(page);}
 }
 await page.keyboard.press('ArrowRight');await ready(page);await expect(page.locator('#poster-type')).toBeVisible();
 for(let i=0;i<2;i++){await page.keyboard.press('ArrowRight');await ready(page);}
 await expect(page.locator('#poster-title')).toHaveText('Inovalab');await expect(page.locator('#poster-blend')).toHaveValue('overlay');await expect(page.locator('#poster-align')).toHaveValue('bottom');await expect(page.locator('#poster-contrast')).not.toBeChecked();
 expect(await page.locator('#poster-blend option').count()).toBe(blendModes.length);
 for(const mode of blendModes){await page.locator('#poster-blend').selectOption(mode.id);expect(await page.locator('#poster-overlay').evaluate(n=>getComputedStyle(n).mixBlendMode)).toBe(mode.id);}
});
