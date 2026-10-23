import {test} from 'node:test';
import assert from 'node:assert/strict';
import {slides} from '../src/lesson.ts';
import {presentationScripts} from '../src/presentation-script.ts';
import {teacherTopics,stepTopics} from '../src/teacher-topics.ts';
test('cada slide tem tópicos concisos e as etapas da câmera exibem seus valores',()=>{
 for(const slide of slides){
  const topics=teacherTopics(slide.kind);
  assert.ok(topics.length>=2&&topics.length<=4,slide.id);
  assert.ok(topics.every(topic=>topic.length<=80),slide.id);
 }
 const camera=presentationScripts.camera!;
 assert.ok(stepTopics('camera',camera[2],2).includes('f/1.4'));
 assert.ok(stepTopics('camera',camera[7],7).includes('6400'));
});
