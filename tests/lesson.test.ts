import test from 'node:test';
import assert from 'node:assert/strict';
import { slides, slideRedirects, questions } from '../src/lesson.ts';

test('a sequência enxugada mantém 20 slides e a divisão 45/75 de uma aula de duas horas',()=>{
  assert.equal(slides.length,20);assert.equal(new Set(slides.map(s=>s.id)).size,20);
  const minutes=slides.map(s=>parseInt(s.minutes,10));
  assert.equal(minutes.slice(0,16).reduce((a,b)=>a+b,0),45);
  assert.equal(minutes.slice(16).reduce((a,b)=>a+b,0),75);
  assert.ok(Object.values(slideRedirects).every(id=>slides.some(s=>s.id===id)));
  assert.ok(Object.keys(slideRedirects).every(id=>!slides.some(s=>s.id===id)));
  assert.equal(questions.length,6);
});
