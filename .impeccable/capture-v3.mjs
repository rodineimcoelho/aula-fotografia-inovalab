import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const report=[];
async function visit(id){
 await page.goto(`http://127.0.0.1:5173/#${id}`);await page.evaluate(()=>document.fonts.ready);
 await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
 if(id==='camera'){
  await page.locator('#camera-shot').waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#camera-shot').disabled);
  await page.locator('#camera-disassemble').click();await page.waitForTimeout(1000);
 }
}
async function shot(name){
 const dimensions=await page.locator('.slide').evaluate(slide=>({scroll:slide.scrollHeight-slide.clientHeight,horizontal:document.documentElement.scrollWidth-innerWidth}));
 report.push({name,viewport:page.viewportSize(),...dimensions});await page.screenshot({path:`.impeccable/review/${name}.png`,fullPage:true});
}
async function study(){await page.locator('#poster-reference-toggle').click();await page.locator('#poster-font').selectOption('serif');}
try{
 await visit('inicio');await shot('desktop');
 await visit('fotografar');await shot('definition');
 await visit('camera');await shot('camera');
 await page.locator('#camera-shot').click();await page.waitForFunction(()=>document.querySelector('#camera-status').textContent.includes('aberto') && parseFloat(document.querySelector('#camera-light-output').textContent.split(': ')[1].replace(',','.'))>.3);await shot('camera-open');
 await page.waitForFunction(()=>!document.querySelector('#camera-shot').disabled);
 await page.locator('#camera-shutter').focus();await page.keyboard.press('Home');await page.locator('#camera-iso').focus();await page.keyboard.press('End');await page.waitForTimeout(150);await shot('camera-signal');
 await visit('producao');await shot('production-reference');await study();await shot('production-study');
 await page.setViewportSize({width:3840,height:1440});await page.reload();
 await visit('inicio');await shot('user-3840');await visit('camera');await shot('camera-3840');
 await visit('producao');await study();await shot('production-3840');
 await page.setViewportSize({width:390,height:844});await page.reload();
 await visit('inicio');await shot('mobile');await visit('camera');await shot('camera-mobile');
 await visit('producao');await study();await shot('production-mobile');
 await writeFile('.impeccable/review/v3-layout.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
