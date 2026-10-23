import { test, expect } from '@playwright/test';
import { mkdtemp,rm,readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApplication } from '../../atividade/server.mjs';

let application,base,directory,session,groups,codes;
const key='browser-test-fixture-key-only';
async function api(route,token,body){const response=await fetch(base+route,{method:body===undefined?'GET':'POST',headers:{Authorization:`Bearer ${token}`,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw new Error(result.error);return result;}
test.beforeAll(async()=>{
  directory=await mkdtemp(path.join(tmpdir(),'foto-browser-test-'));application=createApplication({dataDir:directory,adminKey:key});await new Promise(resolve=>application.server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${application.server.address().port}`;
  session=(await api('/api/admin/sessions',key,{title:'A turma olha de outro jeito'})).session;await api(`/api/admin/session/${session.id}/groups`,key,{count:2});groups=(await api(`/api/state/${session.id}`,key)).groups;codes=(await api(`/api/admin/session/${session.id}/codes`,key,{count:2,role:'student'})).codes;
});
test.afterAll(async()=>{await application.close();const target=path.resolve(directory);if(path.dirname(target)===path.resolve(tmpdir())&&path.basename(target).startsWith('foto-browser-test-'))await rm(target,{recursive:true,force:true});});

test('participante envia, professor revisa e a turma avalia outra fotografia',async({page,browser})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.setViewportSize({width:390,height:844});
  await page.goto(`${base}/?sessao=${session.code}`);await expect(page.locator('#access-code')).toBeVisible();await page.locator('#access-code').fill(codes[0].code);await page.locator('#group-id').selectOption(groups[0].id);await page.locator('#join-form button').click();
  await page.locator('#photo-title').fill('Linhas e luz');await page.locator('#photo-file').setInputFiles('public/assets/quadra.jpg');await expect(page.locator('#upload-status')).toContainText('Imagem pronta');await page.locator('#upload-photo button').click();await expect(page.locator('#page-message')).toContainText('Foto recebida');
  await page.screenshot({path:'.impeccable/review/activity-mobile.png',fullPage:true});
  const other=await api('/api/join','',{sessionCode:session.code,accessCode:codes[1].code,groupId:groups[1].id});
  const photo=await readFile('public/assets/quadra.jpg');await api('/api/submissions',other.token,{title:'Uma sombra vira desenho',image:`data:image/jpeg;base64,${photo.toString('base64')}`});
  const data=await api(`/api/state/${session.id}`,key);for(const p of data.photos)await api(`/api/admin/photos/${p.id}`,key,{status:'approved'});await api(`/api/admin/session/${session.id}/phase`,key,{phase:'vote'});
  await page.locator('#refresh-state').click();await expect(page.locator('.phase')).toContainText('Votação aberta');const form=page.locator('[data-vote]');await expect(form).toHaveCount(1);for(const name of ['composition','light','intent'])await form.locator(`[name=${name}]`).selectOption('5');await form.locator('button').click();await expect(form.locator('.status')).toContainText('Avaliação salva');
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),adminPage=await context.newPage();await adminPage.goto(`${base}/admin`);await adminPage.locator('#admin-key').fill(key);await adminPage.locator('#admin-login button').click();await adminPage.locator('[data-session]').click();await expect(adminPage.locator('h1')).toContainText(session.title);await adminPage.screenshot({path:'.impeccable/review/activity-admin.png',fullPage:true});
  await api(`/api/admin/session/${session.id}/phase`,key,{phase:'results'});await page.locator('#refresh-state').click();await expect(page.getByRole('heading',{name:'Uma mostra de escolhas.'})).toBeVisible();await expect(page.locator('.score')).toContainText('5,00 / 5');await page.screenshot({path:'.impeccable/review/activity-results-mobile.png',fullPage:true});await context.close();expect(errors).toEqual([]);
});
