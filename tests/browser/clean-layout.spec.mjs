import { test,expect } from '@playwright/test';
import { useManualMode } from './manual-mode.mjs';
test.beforeEach(async({page})=>useManualMode(page));

test('controles e resultado ficam no centro e preservam valores ao redimensionar',async({page})=>{
  await page.goto('/#camera');await expect(page.locator('#camera-shot')).toBeEnabled({timeout:20000});
  await expect(page.locator('.center #camera-aperture')).toHaveCount(1);
  await expect(page.locator('.center #camera-status')).toHaveCount(1);await expect(page.locator('.tower input,.tower button')).toHaveCount(0);
  await page.locator('#camera-aperture').focus();await page.keyboard.press('End');
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('.center #camera-aperture')).toHaveCount(1);await expect(page.locator('#camera-aperture-value')).toHaveText('f/22');
  await expect(page.locator('.tower-used')).toHaveCount(0);
  await page.locator('#camera-options summary').click();await page.locator('#camera-blur-compare').check();
  await page.setViewportSize({width:3840,height:1440});
  await expect(page.locator('.center #camera-aperture')).toHaveCount(1);await expect(page.locator('#camera-blur-compare')).toBeChecked();
  await expect(page.locator('#camera-aperture')).toHaveCount(1);
  const preview=await page.locator('.center .camera-result').boundingBox();expect(preview.y).toBeGreaterThanOrEqual(0);
  await page.goto('/#exemplos-composicao');await expect(page.locator('.example-figure')).toHaveAccessibleDescription(/A pessoa ocupa o terço direito/);
  await expect(page.locator('.example-figure>figcaption')).toHaveCount(1);await expect(page.locator('.example-figure #example-description')).toHaveCount(1);
  await page.goto('/#producao');await page.locator('#poster-reference-toggle').click();
  await page.locator('#poster-text').fill('Luz em cena');await page.locator('#poster-options summary').click();await page.locator('#poster-font').selectOption('serif');
  await page.setViewportSize({width:390,height:844});await expect(page.locator('#poster-title')).toHaveText('Luz em cena');await expect(page.locator('#poster-type')).toHaveClass(/type-serif/);
});
