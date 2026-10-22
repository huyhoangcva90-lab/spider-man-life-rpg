import {sequenceDuration,sampleSequence} from './choreography.mjs';
import {makeTimeline,impulseDistance} from './native-techniques.mjs';
export function dodgeDistance(game,time){const d=game.defense,t=Math.max(0,time),before=Math.min(t,d.landedAt),after=Math.max(0,t-d.landedAt);return d.speed*before+impulseDistance({_args:[d.speed,d.deceleration]},after);}
export function resolveDefense(game,{hitOffset,rank=5,projectile=false,ammo=1,incoming=true,intersects=true}){
 const d=game.defense,base={ammoBefore:ammo,ammoAfter:ammo,maxAmmo:d.maxAmmo,refill:false,perfect:false,dodged:false,hit:false,untouched:false,unlocked:d.heroRanks.slice(0,rank).some(r=>r.Reward===d.passiveRewardType)};
 if(!incoming)return {...base,reason:'Không có đòn đánh tới · không kích hoạt nội tại.'};
 if(!intersects)return {...base,untouched:true,reason:'Đạn đi ngoài vùng nhận đòn · không kích hoạt nội tại.'};
 const frame=d.frames.find(f=>hitOffset>=f.start&&hitOffset<f.end);
 if(frame?.dodgeBoxes.length){const perfect=hitOffset<=d.perfectWindow,refill=perfect&&base.unlocked&&(!projectile||d.convertDodgedProjectiles);return {...base,dodged:true,perfect,refill,ammoAfter:refill?d.maxAmmo:ammo,reason:refill?'PERFECT DODGE · Spider-Senses hồi đầy tơ.':!perfect?'Né thành công · ngoài cửa sổ Perfect Dodge.':!base.unlocked?'Perfect Dodge · nội tại chưa mở.':'Perfect Dodge · đạn này không kích hoạt nội tại.'};}
 if(frame&&!frame.hurtBoxes.length)return {...base,untouched:true,reason:'Đòn không chạm vùng nhận đòn · không kích hoạt nội tại.'};
 return {...base,hit:true,reason:'Né trễ · Spider trúng đòn.'};
}
export function sourceStrike(meta,clip){let t=0;for(const frame of meta.clips[clip].frames){if(frame.attackBoxes?.length||frame.events?.some(e=>e.value?.startsWith('Shoot:')))return {at:t,frame};t+=frame.duration;}throw Error('No source hit/shoot marker in '+clip);}
export function defenseScene(game,tech,enemy,{rank=5,ammo=1}={}){
 const clip=enemy.id==='aim'?'Attackprojectilef':enemy.id==='bug'?'Attack1':'Attack2',meta=game.enemies[enemy.id],strike=sourceStrike(meta,clip),hitOffset={perfect:.18,ordinary:.30,late:.44}[tech.defenseScenario],projectile=enemy.id==='aim',prelude=projectile?1.45:(enemy.id==='venom'?2.2:1.5),hitAt=prelude+hitOffset,timeline=makeTimeline(game.hero,tech);
 timeline.steps=timeline.steps.map(s=>({...s,start:s.start+prelude,end:s.end+prelude}));timeline.steps.unshift({clip:'Idle',start:0,end:prelude});timeline.events=timeline.events.map(e=>({...e,time:e.time+prelude}));timeline.duration+=prelude;
 return {enemyId:enemy.id,clip,strike,prelude,hitOffset,hitAt,projectile,timeline,result:resolveDefense(game,{rank,ammo,projectile,hitOffset})};
}
