import {test,expect} from '@playwright/test';
const ready=async page=>expect(page.locator('.stage')).not.toHaveAttribute('aria-busy','true',{timeout:20000});

test('controles e comparação permanecem visíveis ao executar a câmera e o laboratório',async({page})=>{
 await page.setViewportSize({width:3840,height:1440});await page.goto('/#camera');await ready(page);
 for(const id of ['camera-aperture','camera-shutter','camera-iso','camera-disassemble'])await expect(page.locator('#'+id)).toBeVisible();
 await page.keyboard.press('ArrowRight');await ready(page);await page.keyboard.press('ArrowRight');await ready(page);
 await expect(page.locator('#camera-blur-compare')).toBeVisible();await expect(page.locator('#camera-blur-compare')).toBeChecked();
 await expect(page.locator('#camera-aperture-value')).toHaveText('f/1.4');
 const box=await page.locator('.camera-visuals').boundingBox();expect(box.height).toBeGreaterThan(300);
 await page.keyboard.press('Escape');await expect(page.locator('#camera-iso')).toBeVisible();
 await page.goto('/#laboratorio');await ready(page);await expect(page.locator('#focus-plane')).toBeVisible();await expect(page.locator('#scene-light')).toBeVisible();
});

test('modo professor mostra tópicos curtos por etapa, volta, salta e recupera a posição pela URL',async({page})=>{
 await page.goto('/?professor=1#camera');await expect(page.locator('#teacher-title')).toHaveText('Vamos abrir uma câmera?');
 await expect(page.locator('#teacher-topics')).toContainText('Caminho da luz');await expect(page.locator('text=Fala sugerida')).toHaveCount(0);await page.keyboard.press('ArrowRight');await page.keyboard.press('PageDown');
 await expect(page.locator('.teacher-position')).toContainText('Etapa 3 de 9');await expect(page.locator('.teacher-step-topics')).toContainText('f/1.4');
 await page.reload();await expect(page.locator('.teacher-step-topics')).toContainText('f/1.4');
 await page.keyboard.press('ArrowLeft');await expect(page.locator('.teacher-step-topics')).toContainText('Lente');
 await page.keyboard.press('Shift+ArrowRight');await expect(page.locator('#teacher-title')).toHaveText('De onde vem essa luz?');
 await page.locator('[data-teacher-step="15"]').click();await expect(page.locator('.teacher-screen')).toContainText('fonte');await expect(page.locator('[aria-current="step"]')).toBeInViewport();
 await page.locator('#teacher-slide').selectOption('19');await expect(page.locator('#teacher-next')).toBeDisabled();await expect(page.locator('#teacher-topics')).toContainText('próxima foto');
});

test('o notebook do professor não muda a projeção nem os dados salvos da apresentação',async({page,context})=>{
 await page.goto('/#triangulo');await ready(page);const before=await page.evaluate(()=>localStorage.getItem('foto-slide-id'));
 const teacher=await context.newPage();await teacher.goto('/?professor=1#camera/3');await expect(teacher.locator('.teacher-step-topics')).toContainText('f/1.4');
 await teacher.keyboard.press('ArrowRight');await expect(teacher.locator('.teacher-step-topics')).toContainText('f/22');
 await expect(page).toHaveURL(/#triangulo$/);expect(await page.evaluate(()=>localStorage.getItem('foto-slide-id'))).toBe(before);
 await page.locator('#open-settings').click();await expect(page.locator('#open-teacher')).toHaveAttribute('href','?professor=1#triangulo');
 await expect(teacher.locator('.stage')).toHaveCount(0);await teacher.close();
});

test('modo professor no celular mantém os tópicos e a navegação acessíveis sem rolagem horizontal',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/?professor=1#camera/8');
 await expect(page.locator('.teacher-step-topics')).toContainText('6400');await expect(page.locator('#teacher-next')).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#teacher-next').click();await expect(page.locator('.teacher-position')).toContainText('Etapa 9 de 9');
});
