import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
try{
 for(const [width,height,cover,suffix] of [[1440,900,'desktop',''],[3840,1440,'user-3840','-3840'],[390,844,'mobile','-mobile']]){
  await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:5173/#inicio');await page.reload();await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`.impeccable/review/${cover}.png`,fullPage:true});
  await page.locator('#next-slide').click();await page.screenshot({path:`.impeccable/review/definition${suffix}.png`,fullPage:true});
  await page.locator('#next-slide').click();await page.locator('.slide img').evaluate(image=>image.decode());
  await page.screenshot({path:`.impeccable/review/definition-photo${suffix}.png`,fullPage:true});
 }
 console.log('Capturados capa, definição e foto em desktop, telão e celular.');
}finally{await browser.close();}
