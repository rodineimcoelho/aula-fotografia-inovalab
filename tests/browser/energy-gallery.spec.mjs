import {test,expect} from '@playwright/test';

test('capa oferece QR da apresentação e permite configurar endereço do celular',async({page})=>{
 await page.setViewportSize({width:3840,height:1440});
 await page.goto('/#inicio');
 await expect(page.locator('.cover-qr svg')).toBeVisible();
 await expect(page.locator('.cover-follow')).toContainText('Acompanhe pelo celular');
 await expect(page.locator('.cover-follow')).toContainText('Prévia local');
 await page.locator('#configure-site').click();
 await page.locator('#site-url').fill('https://example.org/inovalab/');
 await page.locator('#save-settings').click();
 await page.locator('#close-sheet').click();
 await expect(page.locator('.cover-follow a')).toHaveAttribute('href','https://example.org/inovalab/');
 await expect(page.locator('.cover-follow')).not.toContainText('Prévia local');
 await expect(page.locator('.cover-qr')).toHaveAttribute('aria-label',/example.org\/inovalab/);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.cover-ray-one')).toHaveCSS('animation-name','none');
});

test('mostra local importa fotos, edita título e separa escolha popular e jurados',async({page})=>{
 await page.goto('/#mostra');
 await expect(page.locator('.local-gallery-empty')).toBeVisible();
 await page.locator('#local-photos').setInputFiles(['public/assets/aula-passada/contraluz-palco.jpg','public/assets/aula-passada/capa-guitarrista.jpg']);
 await expect(page.locator('.local-gallery-heading span')).toHaveText('1 / 2');
 await page.locator('.local-gallery-votes summary').click();
 await page.locator('#local-title').fill('Nossa luz');
 await page.locator('#local-popular').fill('8');await page.locator('#local-popular').blur();
 await page.locator('#local-jury').fill('4.5');await page.locator('#local-jury').blur();
 await page.keyboard.press('ArrowRight');await expect(page.locator('.local-gallery-heading span')).toHaveText('2 / 2');
 await page.locator('#local-winners').click();
 await expect(page.locator('.local-gallery-results')).toContainText('Nossa luz');
 await expect(page.locator('.local-gallery-results')).toContainText('8 votos');
 await expect(page.locator('.local-gallery-results')).toContainText('Nota 4.5');
 await page.locator('#local-back').click();await page.keyboard.press('Shift+ArrowRight');
 await expect(page).toHaveURL(/#fim$/);
});
