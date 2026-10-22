// Local experimental turn rules. Native clips live in moveset.mjs; Notion is not connected.
import {GAME_MOVES} from './moveset.mjs';
const PLAYTEST_RULES={
  "punch": {
    "effect": "kick",
    "damage": 14,
    "cost": 0,
    "gain": 1,
    "cd": 0
  },
  "attack2": {
    "effect": "kick",
    "damage": 16,
    "cost": 0,
    "gain": 1,
    "cd": 0
  },
  "kick": {
    "effect": "kick",
    "damage": 18,
    "cost": 0,
    "gain": 1,
    "cd": 0
  },
  "launch": {
    "effect": "launch",
    "damage": 16,
    "cost": 1,
    "gain": 0,
    "cd": 0,
    "launch": 2
  },
  "charged": {
    "effect": "pull",
    "damage": 18,
    "cost": 2,
    "cd": 1
  },
  "sprint": {
    "effect": "kick",
    "damage": 24,
    "cost": 1,
    "cd": 1
  },
  "swing": {
    "effect": "kick",
    "damage": 28,
    "cost": 2,
    "cd": 1
  },
  "aircombo": {
    "effect": "launch",
    "damage": 26,
    "cost": 2,
    "cd": 0,
    "airBonus": true
  },
  "web": {
    "effect": "web",
    "damage": 10,
    "cost": 1,
    "cd": 0
  },
  "impact": {
    "effect": "web",
    "damage": 22,
    "cost": 2,
    "cd": 2,
    "bind": 1
  },
  "airweb": {
    "effect": "web",
    "damage": 18,
    "cost": 1,
    "cd": 1
  },
  "airburst": {
    "effect": "web",
    "damage": 24,
    "cost": 2,
    "cd": 1
  },
  "webswing": {
    "effect": "dodge",
    "damage": 0,
    "cost": 0,
    "gain": 2,
    "cd": 2,
    "evade": 1,
    "self": true
  },
  "dodge": {
    "effect": "dodge",
    "damage": 0,
    "cost": 0,
    "gain": 2,
    "cd": 1,
    "evade": 1,
    "self": true
  },
  "special": {
    "effect": "web",
    "damage": 24,
    "cost": 4,
    "cd": 3,
    "aoe": true
  }
};
export const SKILLS=GAME_MOVES.map(move=>({...move,...PLAYTEST_RULES[move.id]}));
export const ENEMIES=[{id:'bug',name:'Bug Shield',file:'bug.png',w:89,h:95,frames:4,maxHp:100,damage:9,armor:4},{id:'aim',name:'AIM Rifle',file:'aim.png',w:82,h:82,frames:6,maxHp:72,damage:12,armor:0},{id:'venom',name:'Venom',file:'venom.png',w:87,h:73,frames:8,maxHp:125,damage:15,armor:0}];
export function createBattle(count=3){return {hero:{hp:120,maxHp:120,energy:6,maxEnergy:8,evade:0,guard:false},enemies:ENEMIES.slice(0,count).map(e=>({...e,hp:e.maxHp,bound:0,airborne:0})),round:1,phase:'player',cooldowns:{},target:0,result:null};}
export function skillReason(state,skill){if(state.result)return 'Trận đã kết thúc';if(state.phase!=='player')return 'Chưa tới lượt Spider';const cd=Math.max(0,(state.cooldowns[skill.id]||0)-state.round);if(cd)return 'Hồi '+cd+' lượt';if(state.hero.energy<skill.cost)return 'Thiếu '+(skill.cost-state.hero.energy)+' Energy';if(!skill.self&&!state.enemies.some(e=>e.hp>0))return 'Không còn mục tiêu';return '';}
export function beginSkill(state,id,target=state.target){const skill=SKILLS.find(s=>s.id===id);if(!skill)return {ok:false,reason:'Chiêu không tồn tại'};const reason=skillReason(state,skill);if(reason)return {ok:false,reason};if(!skill.self&&(!state.enemies[target]||state.enemies[target].hp<=0))return {ok:false,reason:'Chọn đối thủ còn sống'};state.phase='hero';state.target=target;state.hero.energy=Math.min(state.hero.maxEnergy,state.hero.energy-skill.cost+(skill.gain||0));if(skill.cd)state.cooldowns[id]=state.round+skill.cd+1;return {ok:true,skill,target,resolved:false};}
export function resolveSkill(state,action){if(action.resolved)return [];action.resolved=true;const {skill}=action;const events=[];const targets=skill.self?[]:skill.aoe?state.enemies.map((e,i)=>i).filter(i=>state.enemies[i].hp>0):[action.target];for(const i of targets){const enemy=state.enemies[i];if(enemy.hp<=0)continue;const wasAirborne=enemy.airborne>0;const bonus=skill.airBonus&&wasAirborne;const damage=skill.damage>0?Math.max(1,Math.round(skill.damage*(bonus?1.5:1))-(skill.pierce?0:enemy.armor)):0;enemy.hp=Math.max(0,enemy.hp-damage);if(enemy.hp>0){enemy.bound=Math.max(enemy.bound,skill.bind||0);enemy.airborne=Math.max(enemy.airborne,skill.launch||0);if(skill.damage>0&&!skill.launch)enemy.airborne=0;}events.push({target:i,damage,bonus,wasAirborne,bound:enemy.bound>0,defeated:enemy.hp===0});}state.hero.evade=skill.evade||0;state.hero.guard=!!skill.guard;if(state.enemies.every(e=>e.hp===0)){state.result='victory';state.phase='finished';}return events;}
export function beginEnemyPhase(state){if(!state.result)state.phase='enemy';}
export function enemyTurn(state,index){const enemy=state.enemies[index];if(state.result||!enemy||enemy.hp<=0)return {skip:true};if(enemy.bound>0){enemy.bound--;return {bound:true,damage:0};}if(enemy.airborne>1)return {launched:true,damage:0};if(enemy.airborne===1)enemy.airborne=0;if(state.hero.evade>0){state.hero.evade--;return {evaded:true,damage:0};}const damage=Math.ceil(enemy.damage*(state.hero.guard ? 0.5 : 1));state.hero.hp=Math.max(0,state.hero.hp-damage);if(state.hero.hp===0){state.result='defeat';state.phase='finished';}return {damage};}
export function nextPlayerTurn(state){if(state.result)return;state.round++;state.hero.energy=Math.min(state.hero.maxEnergy,state.hero.energy+1);state.hero.evade=0;state.hero.guard=false;state.enemies.forEach(e=>e.airborne=Math.max(0,e.airborne-1));state.phase='player';if(state.enemies[state.target]?.hp<=0)state.target=state.enemies.findIndex(e=>e.hp>0);}
