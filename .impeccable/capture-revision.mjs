import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const report=[];
async function visit(id,name,choice){
 await page.goto(`http://127.0.0.1:5173/#${id}`);await page.evaluate(()=>document.fonts.ready);
 if(choice!==undefined)await page.locator('#example-choice').selectOption(String(choice));
 await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
 if(id==='camera'){
  await page.locator('#camera-host canvas').waitFor();await page.locator('#camera-explode').click();
  await page.locator('#camera-aperture').focus();await page.keyboard.press(choice===22?'End':'Home');
  await page.waitForTimeout(600);
 }
 report.push({id,name,viewport:page.viewportSize(),...(await page.locator('.slide').evaluate(slide=>({scroll:slide.scrollHeight-slide.clientHeight,horizontal:document.documentElement.scrollWidth-innerWidth})))});
 await page.screenshot({path:`.impeccable/review/${name}.png`,fullPage:true});
}
try{
 await visit('camera','camera');
 await page.locator('#camera-aperture').focus();await page.keyboard.press('End');await page.waitForTimeout(150);
 await page.screenshot({path:'.impeccable/review/camera-f22.png',fullPage:true});
 await visit('tipos-de-luz','lighting-diagram',4);
 await visit('aplicativos','apps');
 await page.setViewportSize({width:3840,height:1440});
 await visit('camera','camera-3840');
 await visit('exemplos-composicao','composition-3840',0);
 await page.setViewportSize({width:390,height:844});
 await page.reload();
 await visit('inicio','mobile');
 await visit('exemplos-composicao','composition-mobile',1);
 await visit('tipos-de-luz','lighting-mobile',4);
 await visit('camera','camera-mobile');
 await writeFile('.impeccable/review/revision-layout.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
}finally{await browser.close();}
