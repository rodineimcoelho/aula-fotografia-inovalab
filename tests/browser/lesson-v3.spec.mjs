import { test, expect } from '@playwright/test';
import { useManualMode } from './manual-mode.mjs';
test.beforeEach(async({page})=>useManualMode(page));

test('ISO muda a imagem sem acrescentar luz; obturador controla o registro',async({page})=>{
  await page.goto('/#camera');await expect(page.locator('#camera-shot')).toBeEnabled({timeout:20000});
  const baseline=await page.locator('#camera-preview').evaluate(canvas=>canvas.toDataURL());
  await expect(page.locator('#camera-status')).toContainText('Obturador fechado');
  await page.locator('#camera-shutter').focus();await page.keyboard.press('Home');
  await page.locator('#camera-iso').focus();await page.keyboard.press('End');
  await expect(page.locator('#camera-iso-value')).toHaveText('6400');
  const compensated=await page.locator('#camera-preview').evaluate(canvas=>canvas.toDataURL());expect(compensated).not.toBe(baseline);
  await page.locator('#camera-shot').click();await expect(page.locator('#camera-shot')).toBeEnabled({timeout:5000});
  await expect(page.locator('#camera-light-output')).toContainText('0,0625×');
  await expect(page.locator('#camera-light-output')).toContainText('16×');
  await expect(page.locator('#camera-photo-label')).toContainText('Foto registrada');
  await page.locator('#camera-iso').focus();await page.keyboard.press('Home');
  await page.locator('#camera-shot').click();await expect(page.locator('#camera-shot')).toBeEnabled({timeout:5000});
  await expect(page.locator('#camera-light-output')).toContainText('0,0625×');
  await expect(page.locator('#camera-light-output')).toContainText('0,25×');
  const dark=await page.locator('#camera-preview').evaluate(canvas=>canvas.toDataURL());expect(dark).not.toBe(compensated);
});

test('arte fornecida e estudo independente de camadas, blend, opacidade e tipografia',async({page})=>{
  await page.goto('/#producao');await expect(page.locator('#poster-reference')).toBeVisible();
  await expect(page.locator('#poster-study')).toBeHidden();await expect(page.locator('#poster-tools')).toBeHidden();
  await page.locator('#poster-reference').evaluate(image=>image.decode());
  await page.screenshot({path:'.impeccable/review/production-reference.png',fullPage:true});
  await page.locator('#poster-reference-toggle').click();await expect(page.locator('#poster-study')).toBeVisible();
  await page.locator('#poster-blend').selectOption('multiply');await expect(page.locator('#poster-overlay')).toHaveCSS('mix-blend-mode','multiply');
  await page.locator('#poster-opacity').focus();await page.keyboard.press('End');await expect(page.locator('#poster-overlay')).toHaveCSS('opacity','1');
  await page.locator('#poster-options summary').click();await page.locator('#layer-overlay').uncheck();await expect(page.locator('#poster-overlay')).toBeHidden();await page.locator('#layer-overlay').check();
  await page.locator('#poster-font').selectOption('serif');await expect(page.locator('#poster-type')).toHaveClass(/type-serif/);
  await page.locator('#poster-align').selectOption('right');await expect(page.locator('#poster-type')).toHaveAttribute('data-position','right');
  await page.locator('#poster-blend').selectOption('screen');
  await page.screenshot({path:'.impeccable/review/production-study.png',fullPage:true});
});
