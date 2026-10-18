import test from 'node:test';
import assert from 'node:assert/strict';
import {HeroLoadout} from '../js/ui/HeroLoadout.js';
function loadout(){const profile={'Equipped Suit':['old'],'Current Map':['map'],'Skill Slot 1':['skill'],'🎖️ Badges & Medals':[]};const l=new HeroLoadout({mode:'live',view:()=>({profile}),ui:{panelSection:null},refresh:async()=>{}});l.sessionLoading=false;l.session={configured:true,connected:true};l.catalog={suits:[{id:'old',Suit:'Old suit',sourceUrl:'https://www.notion.so/old'},{id:'next',Suit:'New suit',sourceUrl:'https://www.notion.so/next'}],skills:[{id:'skill',Skill:'Kick','Energy Cost':0,Cooldown:0,sourceUrl:'https://www.notion.so/skill'}],maps:[{id:'map',Map:'Rooftop'}],badges:[]};return l;}
test('inspecting another suit leaves the confirmed build unchanged and does not make a request',()=>{
 const l=loadout();l.tab='SUITS';l.inspectIds.SUITS='next';
 assert.equal(l.inspected().id,'next');assert.deepEqual(l.profile()['Equipped Suit'],['old']);
 assert.match(l.detail(),/XEM TRƯỚC · CHƯA THAY ĐỔI BUILD/);assert.match(l.equipped(),/Old suit/);assert.doesNotMatch(l.equipped(),/New suit/);
});
test('live Hero state does not falsely mark every collection as refreshed',()=>{
 const l=loadout();l.catalogTimes.suits='2026-10-19T00:00:00Z';
 assert.match(l.render('SUITS'),/Kho: đã đọc lại từ Notion/);assert.match(l.render('SKILLS'),/Kho: bản lưu từ Notion/);assert.match(l.detail(),/<dd>0<\/dd>/);assert.equal(l.slot,'Skill Slot 1');
});
test('equip writes only the requested relation after inspection and confirms the saved build',async()=>{
 const l=loadout();l.tab='SUITS';l.inspectIds.SUITS='next';let writes=0;const old=globalThis.fetch;
 globalThis.fetch=async(url,options={})=>{const write=options.method==='PATCH';if(write){writes++;assert.deepEqual(JSON.parse(options.body),{properties:{'Equipped Suit':{relation:[{id:'next'}]}}});}return {ok:true,json:async()=>({data:{id:'hero',properties:{'Equipped Suit':{type:'relation',relation:[{id:write?'next':'old'}]}}}})};};
 try{await l.choose('next');assert.equal(writes,1);assert.deepEqual(l.profile()['Equipped Suit'],['next']);assert.match(l.message,/Đã lưu lựa chọn/);}finally{globalThis.fetch=old;}
});
