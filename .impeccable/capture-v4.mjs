import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}}),report=[];
async function go(id){await page.goto(`http://127.0.0.1:5173/#${id}`);await page.evaluate(()=>document.fonts.ready);}
async function shot(name){report.push({name,viewport:page.viewportSize(),...(await page.locator('.slide').evaluate(el=>({scroll:el.scrollHeight-el.clientHeight,horizontal:document.documentElement.scrollWidth-innerWidth})))});await page.screenshot({path:`.impeccable/review/${name}.png`,fullPage:true});}
async function light(index){await page.locator('#example-choice').selectOption(String(index));await page.locator('#lighting-host canvas').waitFor();await page.waitForTimeout(350);}
try{
 await go('inicio');await shot('desktop');
 await go('laboratorio');await page.locator('#motion-pause').click();await page.locator('#blur-compare').check();await page.locator('#aperture-range').focus();await page.keyboard.press('Home');await page.waitForTimeout(120);await shot('focus-wide');
 await page.keyboard.press('End');await page.waitForTimeout(120);await shot('focus-closed');
 await go('camera');await page.waitForFunction(()=>!document.querySelector('#camera-shot').disabled);await page.locator('#camera-disassemble').click();await page.locator('#camera-blur-compare').check();await page.locator('#camera-aperture').focus();await page.keyboard.press('Home');await page.waitForTimeout(800);await shot('camera-focus-wide');
 await page.keyboard.press('End');await page.waitForTimeout(150);await shot('camera-focus-closed');
 await go('tipos-de-luz');for(let i=0;i<6;i++){await light(i);await shot(`light-${i}`);}
 await light(4);await page.locator('[data-light-view=overview]').click();await page.waitForTimeout(150);await shot('light-overview');
 await page.setViewportSize({width:3840,height:1440});await page.reload();await go('inicio');await shot('user-3840');
 await go('tipos-de-luz');await light(3);await shot('light-3840');
 await page.setViewportSize({width:390,height:844});await page.reload();await go('inicio');await shot('mobile');
 await go('tipos-de-luz');await light(3);await shot('light-mobile');
 await page.locator('[data-light-view=overview]').click();await page.waitForTimeout(150);await shot('light-overview-mobile');
 await page.locator('#lighting-adjust summary').click();await shot('light-controls-mobile');
 await go('laboratorio');await page.locator('#blur-compare').check();await page.locator('#aperture-range').focus();await page.keyboard.press('Home');await page.waitForTimeout(100);await shot('focus-mobile');
 await writeFile('.impeccable/review/v4-layout.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
