import test from 'node:test';
import assert from 'node:assert/strict';
import {heroVitals,newerGameSnapshot} from '../js/game/HeroVitals.mjs';
import {skillGroup} from '../js/game/SkillPresentation.mjs';
import {HeroAnimationController} from '../js/game/HeroAnimationController.js';
import gameHandler from '../api/game-state.mjs';
test('stale zero HP never implies KO, while a fresh Notion zero remains authoritative',()=>{
 assert.deepEqual(heroVitals({HP:0,'Max HP':100},false),{known:false,hp:null,max:100,ko:false,percent:0});
 assert.equal(heroVitals({HP:90,'Max HP':100},true).percent,90);
 assert.equal(heroVitals({HP:0,'Max HP':100},true).ko,true);
 const controller={engine:{notionAuthority:true,state:{progression:{hp:0}}},hero:{dataset:{notionVitals:'pending'}}};
 assert.equal(HeroAnimationController.prototype.restAnimation.call(controller),'combat_idle');controller.hero.dataset.notionVitals='confirmed';assert.equal(HeroAnimationController.prototype.restAnimation.call(controller),'KO');
});
test('the latest saved game read wins over the bundled old zero snapshot',()=>{
 const bundled={metadata:{syncedAt:'2026-10-17T00:00:00Z'},profile:{id:'hero',HP:0}},saved={metadata:{syncedAt:'2026-10-19T00:00:00Z'},profile:{id:'hero',HP:90}};
 assert.equal(newerGameSnapshot(bundled,saved).profile.HP,90);assert.equal(newerGameSnapshot({},null),null);
});
test('skill UI groups passives and formulas away from active moves without inventing mechanics',()=>{
 assert.equal(skillGroup({'Skill Type':'Passive'}),'passive');assert.equal(skillGroup({'Skill Type':'Formula'}),'passive');assert.equal(skillGroup({'Skill Type':'Ultimate'}),'ultimate');assert.equal(skillGroup({'Skill Type':'Basic'}),'active');assert.equal(skillGroup({}),'other');
});
test('an invalid private session does not block the approved public game projection',async()=>{
 const oldFetch=globalThis.fetch,oldKey=process.env.NOTION_API_KEY,oldToken=process.env.NOTION_TOKEN;delete process.env.NOTION_API_KEY;delete process.env.NOTION_TOKEN;
 globalThis.fetch=async url=>url.includes('/auth/check')?new Response(JSON.stringify({ok:false}),{status:401}):new Response(JSON.stringify({ok:true,data:{profile:{id:'hero',HP:90,'Max HP':100,Diary:'private'},metadata:{syncedAt:'2026-10-19T00:00:00Z'}}}));
 const res={status(n){this.code=n;return this;},setHeader(){},json(value){this.value=value;return this;}};
 try{await gameHandler({method:'GET',headers:{cookie:'spider_field_session=mock-invalid-session-value.signature'}},res);assert.equal(res.code,200);assert.equal(res.value.data.profile.HP,90);assert.equal(res.value.data.profile.Diary,undefined);}finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.NOTION_API_KEY;else process.env.NOTION_API_KEY=oldKey;if(oldToken===undefined)delete process.env.NOTION_TOKEN;else process.env.NOTION_TOKEN=oldToken;}
});
