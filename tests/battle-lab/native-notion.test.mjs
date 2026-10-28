import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeNotionView} from '../../battle-lab/native-notion.mjs';

test('native Notion reference preserves zero values and every actual skill slot',()=>{
 const view=nativeNotionView({profile:{Hero:'Spider',HP:0,'Max HP':100,Energy:0,'Max Energy':10,'Skill Slot 3':['active'],'Skill Slot 1':['passive','missing']},skills:[{id:'active',Skill:'Web Shot','Skill Type':'Active'},{id:'passive',Skill:'Spider-Sense','Skill Type':'Passive'}]});
 assert.equal(view.hp,'0 / 100');
 assert.equal(view.energy,'0 / 10');
 assert.deepEqual(view.slots,[{name:'Skill Slot 1',skills:['Spider-Sense (nội tại)']},{name:'Skill Slot 3',skills:['Web Shot']}]);
});
