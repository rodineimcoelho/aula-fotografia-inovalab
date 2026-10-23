import test from 'node:test';
import assert from 'node:assert/strict';
import { presentationScripts } from '../src/presentation-script.ts';
import { apertures,shutters,sensitivities } from '../src/models.ts';
test('o roteiro usa controles válidos e frases curtas nas torres',()=>{
  for(const frames of Object.values(presentationScripts))for(const frame of frames){
    for(const line of [...frame.cue.left,...frame.cue.right])assert.ok(line.length<=14,`Tower cue too long: ${line}`);
    for(const value of [frame.camera,frame.lab])if(value){if(value.aperture!==undefined)assert.ok(apertures.includes(value.aperture));if(value.shutter!==undefined)assert.ok(shutters.includes(value.shutter));if(value.iso!==undefined)assert.ok(sensitivities.includes(value.iso));}
  }
});
