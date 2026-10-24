import test from 'node:test';
import assert from 'node:assert/strict';
import { presentationScripts,guidedBlendIds } from '../src/presentation-script.ts';
import {blendModes} from '../src/blend-modes.ts';
import { apertures,shutters,sensitivities } from '../src/models.ts';
test('o roteiro usa controles válidos e frases curtas nas torres',()=>{
  assert.equal(Object.values(presentationScripts).reduce((total,frames)=>total+frames.length,0),82);
  assert.equal(guidedBlendIds.length,6);
  assert.equal(blendModes.length,16);
  assert.equal(presentationScripts.poster?.length,11);
  for(const frames of Object.values(presentationScripts))for(const frame of frames){
    for(const line of [...frame.cue.left,...frame.cue.right])assert.ok(line.length<=14,`Tower cue too long: ${line}`);
    for(const value of [frame.camera,frame.lab])if(value){if(value.aperture!==undefined)assert.ok(apertures.includes(value.aperture));if(value.shutter!==undefined)assert.ok(shutters.includes(value.shutter));if(value.iso!==undefined)assert.ok(sensitivities.includes(value.iso));}
  }
});
