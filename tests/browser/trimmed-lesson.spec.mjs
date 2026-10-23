import { test,expect } from '@playwright/test';
import { useManualMode } from './manual-mode.mjs';
test.beforeEach(async({page})=>useManualMode(page));

test('índice tem 20 slides, links antigos chegam ao conceito integrado e quiz inclui as seis perguntas',async({page})=>{
  await page.goto('/#percurso');await expect(page).toHaveURL(/#inicio$/);
  await page.keyboard.press('i');await expect(page.locator('[data-index]')).toHaveCount(20);await page.keyboard.press('Escape');
  await page.goto('/#fotometro');await expect(page).toHaveURL(/#laboratorio$/);await expect(page.locator('#blur-note')).toContainText('zero é referência');
  await page.goto('/#ponto-de-vista');await expect(page).toHaveURL(/#composicao$/);await expect(page.locator('.fine-print')).toContainText('perspectiva');
  await page.goto('/#quiz');
  for(const answer of [0,1,2,0,1,2]){await page.locator(`[data-answer="${answer}"]`).click();await page.locator('#quiz-next').click();}
  await expect(page.locator('#quiz-content h2')).toHaveText('6 de 6 escolhas corretas.');
  await page.goto('/#pratica');await expect(page.locator('#timer-display')).toHaveText('25:00');
  await page.locator('[data-timer="20"]').click();await expect(page.locator('#timer-phase')).toHaveText('Editar');
});

test('quiz no telão separa título, explicação e navegação',async({page})=>{
  await page.setViewportSize({width:3840,height:1440});await page.goto('/#quiz');
  await page.locator('[data-answer="0"]').click();
  const rect=async(selector)=>page.locator(selector).boundingBox();
  const title=await rect('#slide-title'),progress=await rect('.quiz-progress'),feedback=await rect('.quiz-feedback'),actions=await rect('#quiz-content>.button-row'),footer=await rect('.deck-nav');
  expect(progress.y).toBeGreaterThanOrEqual(title.y+title.height);
  expect(actions.y).toBeGreaterThanOrEqual(feedback.y+feedback.height);
  expect(actions.y+actions.height).toBeLessThanOrEqual(footer.y);
});
