import {frameTime,sequenceDuration,sampleSequence} from './choreography.mjs';
const groupClips=g=>[g?.AnimStart?.ID,...Array(Math.max(1,g?.LoopRepeatCount||1)).fill(g?.AnimLoop?.ID),g?.AnimRecovery?.ID===g?.AnimLoop?.ID?null:g?.AnimRecovery?.ID].filter(Boolean);
export function techniques(game){
 const a=game.attacks,entry=(id,name,group,clips,extra={})=>({id,name,group,clips,...extra});
 const route=(id,name,group,key,variant='AnimNormal',extra={})=>entry(id,name,group,groupClips(a[key][variant]),{attack:key,variant,...extra});
 const power='SpidermanPowerAttack',special='SpidermanSpecialAttack';
 return [
 ...['PlayerAttack1','PlayerAttack2','SpidermanAttack3','SpidermanAttack4finisher'].map((key,i)=>route('native-attack'+(i+1),'Đòn '+(i+1)+' · '+(i===3?'Uppercut':['Đấm thẳng','Đấm nối','Đá xoay'][i]),'basic',key)),
 entry('native-combo','Combo gốc · 4 đòn','basic',game.character.Attack.map(v=>a[Object.keys(a).find(k=>a[k].ID===v.AttackID.ID)].AnimNormal.AnimStart.ID),{kind:'combo',attack:'SpidermanAttack4finisher',composition:true}),
 route('native-slide','SPIDER-SLIDE','basic','SpidermanTackle',undefined,{kind:'slide'}),
 entry('native-dodge-attack','Né → phản đòn','defense',['Dodge',...groupClips(a.SpidermanDodgeAttack.AnimNormal)],{attack:'SpidermanDodgeAttack',kind:'counter',composition:true,cancelAtLanded:true}),
 entry('native-pull','WEB-PULL → Uppercut','web',['Attackchargedstart','Attackchargedheld','Attackcharged','Attack4'],{kind:'pull',attack:'SpidermanAttack4finisher',composition:true}),
 entry('native-pull-miss','WEB-PULL · hụt / thu tơ','web',['Attackchargedstart','Attackchargedheld','Attackcharged','Attackchargedend'],{kind:'pull-miss',attack:'SpidermanHeavySwingAttack'}),
 route('native-web1','WEBBINGS · trên đất 1','web',power,'AnimNormal',{kind:'web'}),
 route('native-web2','WEBBINGS · trên đất 2','web',power,'AnimNormal2',{kind:'web'}),
 entry('native-web-chain','WEBBINGS · bắn nối 1 → 2','web',[...groupClips(a[power].AnimNormal),...groupClips(a[power].AnimNormal2)],{attack:power,kind:'web',composition:true}),
 route('native-airweb1','WEBBINGS · trên không 1','air',power,'AnimAerial',{kind:'web',air:true}),
 route('native-airweb2','WEBBINGS · trên không 2','air',power,'AnimAerial2',{kind:'web',air:true}),
 entry('native-airweb-chain','WEBBINGS · nối trên không','air',[...groupClips(a[power].AnimAerial),...groupClips(a[power].AnimAerial2)],{attack:power,kind:'web',air:true,composition:true}),
 route('native-swing','SWINGING KICK · sát đất','air','PlayerSwingingKickAttack',undefined,{kind:'swing'}),
 route('native-swing-air','SWINGING KICK · trên không','air','PlayerSwingingKickAttack',undefined,{kind:'swing',air:true}),
 route('native-airkick','Đá trên không','air','SpidermanAirAttack',undefined,{kind:'airkick',air:true}),
 route('native-special','WEB SHOOTERS · trên đất','special',special,'AnimNormal',{kind:'special'}),
 route('native-special-air','WEB SHOOTERS · trên không','special',special,'AnimAerial',{kind:'special',air:true}),
 entry('native-webswing','WEB SWING · đu / thả','defense',['Jump','Webswing','Jumpfall','Land'],{kind:'webswing',air:true}),
 entry('native-dodge','DODGE · né lùi','defense',['Dodge'],{kind:'dodge',direction:-1}),
 entry('native-dodge-forward','DODGE · né tiến','defense',['Dodge'],{kind:'dodge',direction:1}),
 entry('native-dodge-perfect','PERFECT DODGE · Spider-Senses','defense',['Dodge'],{kind:'dodge',direction:-1,defenseScenario:'perfect'}),
 entry('native-dodge-ordinary','Né thường · không hồi tơ','defense',['Dodge'],{kind:'dodge',direction:-1,defenseScenario:'ordinary'}),
 entry('native-dodge-late','Né trễ · hồi thế','defense',['Dodge'],{kind:'dodge',direction:-1,defenseScenario:'late'}),
 entry('native-sense','SPIDER-SENSES · clip hiệu ứng','defense',['Spidersense'],{kind:'sense'}),
 route('native-team','Đòn hỗ trợ · Team Launcher','basic','SpidermanTeamLauncher')
 ];
}
export function makeTimeline(meta,technique){
 let at=0;const steps=[],events=[];
 const clips=technique.air&&technique.clips.at(-1)!=='Land'?[...technique.clips,'Jumpfall','Land']:technique.clips;
 for(const clip of clips){const source=meta.clips[clip];if(!source)throw Error('Missing source clip '+clip);let duration=sequenceDuration(meta,[clip]);if(clip==='Dodge'&&technique.cancelAtLanded){let at=0;for(const f of source.frames){if(f.events?.some(e=>e.value==='Landed')){duration=at;break;}at+=frameTime(f);}}if(clip==='Webswing')duration=1.25;if(clip==='Attackchargedheld')duration=.3;
  const step={clip,start:at,end:at+duration};steps.push(step);let t=at,hit=false;
  for(const frame of source.frames){if(frame.attackBoxes?.length&&!hit){events.push({time:t,type:'hit',clip,boxes:frame.attackBoxes});hit=true;}for(const e of frame.events||[])if(e.value?.startsWith('Shoot:'))events.push({time:t,type:'shoot',clip,anchor:frame.anchors?.ShootOffset||[0,-40]});t+=frameTime(frame);}
  at+=duration;
 }
 return {steps,events,duration:at};
}
export function sampleTimeline(meta,timeline,time){const s=timeline.steps.find(s=>time<s.end)||timeline.steps.at(-1);return {clip:s.clip,frame:sampleSequence(meta,[s.clip],Math.max(0,time-s.start),s.clip==='Webswing'||s.clip==='Attackchargedheld'),step:s};}
export function impulseDistance(impulse,time){const [speed=0,deceleration=0]=impulse?._args||[];const t=deceleration>0?Math.min(Math.max(0,time),Math.abs(speed/deceleration)):Math.max(0,time);return speed*t-Math.sign(speed)*deceleration*t*t/2;}
