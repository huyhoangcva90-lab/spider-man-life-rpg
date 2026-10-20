import test from 'node:test';
import assert from 'node:assert/strict';
import {skillLoadout,missionBrief,combatLogView} from '../js/game/GamePresentation.mjs';
import {NotionGamePresenter} from '../js/ui/NotionGamePresenter.js';
import {HeroLoadout} from '../js/ui/HeroLoadout.js';
import {notionSkillAnimation} from '../js/game/NotionSkillAnimation.js';
test('real Notion slots sort numerically and missing records remain visible without inventing slots',()=>{
 const groups=skillLoadout({'Skill Slot 10':['lost'],'Skill Slot 2':['abc-def'],'Spider Suits':['ignored']},[{id:'abcdef',Skill:'Kick'}]);
 assert.deepEqual(groups.map(group=>group.slot),['Skill Slot 2','Skill Slot 10']);assert.equal(groups[0].items[0].record.Skill,'Kick');assert.equal(groups[1].items[0].record,null);
 const loadout=new HeroLoadout({view:()=>({profile:{'Skill Slot 10':['lost']}})});loadout.tab='SKILLS';loadout.catalog={skills:[]};assert.match(loadout.deck(),/Bản ghi chưa tải/);assert.match(loadout.deck(),/1 chiêu · 1 ô Notion/);
});
test('mission plan uses existing waves and flags a different active enemy without switching it',()=>{
 const mission={'Turn 2 (Wave 2)':'3 minions','Bosses & Minions':['abc-def']};const enemy={id:'abcdef'};
 assert.deepEqual(missionBrief(mission,[enemy]),{waves:[{label:'ĐỢT 2',text:'3 minions'}],mismatch:false});assert.equal(missionBrief(mission,[{id:'other'}]).mismatch,true);assert.equal(enemy.id,'abcdef');assert.deepEqual(missionBrief(null).waves,[]);assert.deepEqual(missionBrief({'Turn 1 (Wave 1)':[]}).waves,[]);assert.equal(missionBrief({'Turn 1 (Wave 1)':['abc-def']},[{id:'abcdef',Boss:'Bug'}]).waves[0].text,'Bug');
});
test('combat playback follows log target, ignores pending and never aims at an inspected enemy',async()=>{
 const enemies=[{id:'one'},{id:'two'}],skill={id:'skill',Skill:'Kick'},calls=[];
 const presenter={view:()=>({enemies}),data:{skills:[skill]},selectedEnemyId:'one',playSkill:async(...args)=>calls.push(args)};
 const log={'Combat Skill':['skill'],'👹 Bosses & Minion':['two'],'Resolution Status':'Pending','Direct Damage':20};
 await NotionGamePresenter.prototype.playLog.call(presenter,log);assert.equal(calls.length,0);
 await NotionGamePresenter.prototype.playLog.call(presenter,{...log,'Resolution Status':'Resolved'});assert.deepEqual(calls[0],[skill,false,'two',true]);assert.equal(presenter.selectedEnemyId,'one');
 await NotionGamePresenter.prototype.playLog.call(presenter,{...log,'Resolution Status':'Resolved','👹 Bosses & Minion':[]});assert.equal(calls.length,1);
 await NotionGamePresenter.prototype.playLog.call(presenter,{...log,'Resolution Status':'Resolved','Direct Damage':0});assert.equal(calls[1][3],false);
 assert.equal(combatLogView({'Direct Damage':0}).damage,0);assert.equal(notionSkillAnimation({Skill:'Kick','Skill Type':'Keystone'}),null);
});
