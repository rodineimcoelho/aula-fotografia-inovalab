import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defocusRadius} from '../src/depth-of-field.ts';

test('o plano de foco fica nítido e fechar um stop reduz o círculo de desfoque',()=>{
  assert.equal(defocusRadius(1.4,1.8,1.8,1200),0);
  const open=defocusRadius(1.4,1.8,8,1200);
  assert.ok(open>30);assert.ok(defocusRadius(22,1.8,8,1200)<3);
  assert.equal(defocusRadius(2.8,1.8,8,1200),open/2);
  assert.ok(defocusRadius(1.4,1.8,8,1200)>defocusRadius(1.4,1.8,3,1200));
  assert.equal(defocusRadius(1.4,1.8,8,600),open/2);
});
