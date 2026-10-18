import test from 'node:test';
import assert from 'node:assert/strict';
import {SoundController} from '../js/core/SoundController.js';

test('Spider clips play exclusively and volume updates the clip already playing',async()=>{
 const original=globalThis.Audio;
 class FakeAudio { constructor(){this.paused=true;} pause(){this.paused=true;} play(){this.paused=false;return Promise.resolve();} }
 globalThis.Audio=FakeAudio;
 try {
  let enabled=true;const sound=new SoundController({get:()=>enabled});
  assert.equal(await sound.playSample('jingle',0.5),true);
  const jingle=sound.samples.get('jingle');assert.equal(jingle.paused,false);
  await sound.playSample('activity',0.8);assert.equal(jingle.paused,true);
  const voice=sound.samples.get('activity');sound.setMasterVolume(0.25);assert.equal(voice.volume,0.2);
  sound.stopSamples();assert.equal(voice.paused,true);assert.equal(voice.currentTime,0);
  enabled=false;assert.equal(await sound.playSample('fresh'),false);assert.equal(sound.samples.has('fresh'),false);
 }finally {globalThis.Audio=original;}
});

test('disabled music stops the jingle and boot never schedules a surprise retry',async()=>{
 const sound=new SoundController({get:()=>true});let paused=false,played=0;
 sound.samples.set('jingle',{pause(){paused=true;}});sound.setMusicEnabled(false);assert.equal(paused,true);
 sound.init=()=>{};sound.playTrackerJingle=async()=>{played++;return false;};
 await sound.playBootSound();assert.equal(played,0);
 sound.setMusicEnabled(true);await sound.playBootSound();assert.equal(played,1);assert.equal(sound.entryFallbackBound,undefined);
});
