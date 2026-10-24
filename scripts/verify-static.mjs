import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const root=fileURLToPath(new URL('../dist/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/aula-fotografia-inovalab'){res.writeHead(301,{Location:'/aula-fotografia-inovalab/'});res.end();return;}
    if(!url.pathname.startsWith('/aula-fotografia-inovalab/')){res.writeHead(404);res.end();return;}
    const name=decodeURIComponent(url.pathname.slice('/aula-fotografia-inovalab/'.length))||'index.html',file=path.resolve(root,name);
    if(!file.startsWith(path.resolve(root)+path.sep)){res.writeHead(403);res.end();return;}
    const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],external=[];
  await page.addInitScript(()=>localStorage.setItem('foto-settings',JSON.stringify({view:'screen',guides:false,activity:'',guided:false})));
  const base=`http://127.0.0.1:${server.address().port}`;
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()));page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))external.push(r.url());});
  await page.goto(`${base}/aula-fotografia-inovalab/#inicio`);assert.equal(await page.locator('#slide-title').textContent(),'Fotografia e Produção de Imagens');assert.equal(await page.locator('.center img').count(),0);
  await page.goto(`${base}/aula-fotografia-inovalab/#aplicativos`);for(const image of await page.locator('.app-logo').all())await image.evaluate(img=>img.decode());assert.equal(await page.locator('.app-logo').count(),2);
  await page.goto(`${base}/aula-fotografia-inovalab/#fotografar`);assert.equal(await page.locator('.slide img').count(),0);
  await page.locator('#next-slide').click();assert.ok(page.url().endsWith('#fotografia-exemplo'));await page.locator('.photo-figure img').evaluate(image=>image.decode());
  await page.goto(`${base}/aula-fotografia-inovalab/#camera`);await page.locator('#camera-host canvas').waitFor();
  await page.waitForFunction(()=>!document.querySelector('#camera-shot').disabled);assert.ok(await page.locator('#camera-preview').evaluate(canvas=>canvas.width>0));
  await page.goto(`${base}/aula-fotografia-inovalab/#producao`);await page.locator('#poster-reference').evaluate(image=>image.decode());await page.locator('#poster-reference-toggle').click();
  await page.locator('#poster-overlay').evaluate(image=>image.decode());assert.equal(await page.locator('#poster-overlay').evaluate(image=>getComputedStyle(image).mixBlendMode),'overlay');assert.equal(await page.locator('#poster-title').textContent(),'Inovalab');
  await page.goto(`${base}/aula-fotografia-inovalab/#tipos-de-luz`);await page.locator('#lighting-host canvas').waitFor();await page.locator('[data-light-view=overview]').click();await page.locator('.lighting-label').first().waitFor({state:'visible'});
  await page.goto(`${base}/aula-fotografia-inovalab/#laboratorio`);await page.locator('#focus-options summary').click();await page.locator('#blur-compare').check();await page.locator('#focus-plane').selectOption('background');assert.ok((await page.locator('#focus-status').textContent()).includes('no fundo'));
  await page.goto(`${base}/aula-fotografia-inovalab/#exemplos-composicao`);await page.locator('#example-media img').evaluate(image=>image.decode());
  await page.goto(`${base}/aula-fotografia-inovalab/#quiz`);assert.equal(await page.locator('.quiz-progress').textContent(),'Pergunta 1 de 6');
  await page.goto(`${base}/aula-fotografia-inovalab/roteiro.html`);assert.ok(await page.locator('h1').textContent());assert.equal(await page.locator('section:not(#fontes)').count(),20);assert.ok((await page.locator('.schedule').textContent()).includes('45 min de teoria'));
  const guided=await browser.newPage({viewport:{width:1440,height:900}});
  guided.on('pageerror',e=>errors.push(e.message));guided.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))external.push(r.url());});
  await guided.goto(`${base}/aula-fotografia-inovalab/#camera`);await guided.waitForFunction(()=>document.querySelector('.stage')?.dataset.steps==='9'&&!document.querySelector('.stage').hasAttribute('aria-busy'));
  await guided.keyboard.press('ArrowRight');await guided.waitForFunction(()=>document.querySelector('.stage')?.dataset.step==='1'&&!document.querySelector('.stage').hasAttribute('aria-busy'));
  assert.ok(guided.url().endsWith('#camera'));assert.equal(await guided.locator('#camera-disassemble').getAttribute('aria-expanded'),'true');await guided.close();
  await page.goto(`${base}/aula-fotografia-inovalab/?professor=1#camera/3`);await page.locator('#teacher-topics').waitFor();assert.ok((await page.locator('.teacher-step-topics').textContent()).includes('f/1.4'));
  await page.keyboard.press('ArrowRight');assert.ok((await page.locator('.teacher-step-topics').textContent()).includes('f/22'));assert.equal(await page.locator('.stage').count(),0);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('PASS: build estático em /aula-fotografia-inovalab/ carregou apresentação, câmera 3D e modo professor independente sem requisições externas.');
}finally{await browser?.close();await new Promise(resolve=>{server.close(resolve);server.closeIdleConnections();});}
