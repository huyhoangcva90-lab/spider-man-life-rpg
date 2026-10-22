import {sameId} from '../integrations/notion/NotionGameAuthority.mjs';

// Presentation only: every slot, wave and outcome must already exist in Notion.
export function skillLoadout(profile={},catalog=[]){
 return Object.keys(profile).filter(key=>/^Skill Slot \d+$/.test(key)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0])).map(slot=>({slot,items:(Array.isArray(profile[slot])?profile[slot]:[]).map(id=>({id,record:catalog.find(record=>sameId(record.id,id))||null}))}));
}
export const MISSION_WAVES=[['Turn 1 (Wave 1)','ĐỢT 1'],['Turn 2 (Wave 2)','ĐỢT 2'],['Turn 3 (Boss / Climax)','BOSS / CAO TRÀO'],['Turn 4 (Bonus / Phase 2)','ĐỢT BỔ SUNG']];
export function missionBrief(mission,enemies=[]){
 const planned=Array.isArray(mission?.['Bosses & Minions'])?mission['Bosses & Minions']:[];
 const waveText=value=>Array.isArray(value)?value.map(id=>enemies.find(enemy=>sameId(enemy.id,id))?.Boss||'Đối thủ chưa tải · xem trong Notion').join(' · '):typeof value==='string'?value.trim():'';
 return {waves:MISSION_WAVES.map(([field,label])=>({label,text:waveText(mission?.[field])})).filter(wave=>wave.text),mismatch:planned.length>0&&enemies.some(enemy=>!planned.some(id=>sameId(id,enemy.id)))};
}
export function combatLogView(log={},enemies=[]){
 const pending=/pending|queued|processing/i.test(log['Resolution Status']||'');
 return {pending,targets:(log['👹 Bosses & Minion']||[]).map(id=>enemies.find(enemy=>sameId(id,enemy.id))).filter(Boolean),outcome:log.Outcome||log['Boss Outcome']||log['Resolution Status']||'Đã ghi nhận',damage:Number.isFinite(log['Direct Damage'])?log['Direct Damage']:null};
}
