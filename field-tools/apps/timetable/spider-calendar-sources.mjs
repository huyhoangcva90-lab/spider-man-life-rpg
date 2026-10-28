import { key, time } from './calendar-model.mjs';
const title=p=>(Object.values(p.properties||{}).find(v=>v.type==='title')?.title||[]).map(x=>x.plain_text||x.text?.content||'').join('');
const color=c=>/^#[\da-f]{6}$/i.test(c)?c:'#54a9f1';
const previous=day=>{const d=new Date(day+'T12:00:00');d.setDate(d.getDate()-1);return key(d);};
export function datedEvent({id,name,start,end,allDay=false,source,sourceUrl='',category,color:shade}){
  if(!start)return null;
  const a=new Date(allDay?start+'T00:00:00':start),b=new Date(allDay?(end||start)+'T00:00:00':end||start);
  if(!Number.isFinite(+a)||!Number.isFinite(+b)||b<a)return null;
  return {id,name:name||'Không tên',date:allDay?start:key(a),endDate:allDay?(end&&end>start?previous(end):start):key(b),start:allDay?'00:00':time(a),end:allDay?'00:00':time(b),allDay,repeat:'None',source,sourceUrl,readOnly:true,category,color:color(shade)};
}
export function googleEvents(calendars){return calendars.flatMap(({items=[],calendar={}})=>items.filter(e=>e.status!=='cancelled').map(e=>datedEvent({id:'google:'+calendar.id+':'+e.id,name:e.summary,start:e.start?.dateTime||e.start?.date,end:e.end?.dateTime||e.end?.date,allDay:!!e.start?.date,source:'Google Calendar',sourceUrl:e.htmlLink,category:'Google · '+(calendar.summary||calendar.id||'Lịch'),color:calendar.backgroundColor})).filter(Boolean));}
export function notionEvents(pages){return pages.filter(p=>!p.archived&&!p.in_trash).map(p=>{const date=p.properties?.Date?.date||p.properties?.Start?.date||p.properties?.['Due Date']?.date;const allDay=!!date?.start&&!date.start.includes('T');let end=date?.end;if(allDay&&end){const d=new Date(end+'T12:00:00');d.setDate(d.getDate()+1);end=key(d);}return datedEvent({id:'notion:'+p.id,name:title(p),start:date?.start,end,allDay,source:'Notion',sourceUrl:p.url||'https://www.notion.so/'+p.id.replaceAll('-',''),category:'Notion',color:'#db806c'});}).filter(Boolean);}
export function routineEvents(routines,day){return routines.flatMap(r=>{const match=String(r.time||'').match(/^(\d{1,2}):(\d{2})(?:\s*[–—-]\s*(\d{1,2}):(\d{2}))?/);if(!match||+match[1]>23||+match[2]>59||match[3]&&(+match[3]>23||+match[4]>59))return [];const start=`${day}T${match[1].padStart(2,'0')}:${match[2]}:00+07:00`,end=match[3]?`${day}T${match[3].padStart(2,'0')}:${match[4]}:00+07:00`:start;let b=new Date(end);if(b<new Date(start))b=new Date(+b+86400000);return [datedEvent({id:'routine:'+r.id+':'+day,name:r.name,start,end:b.toISOString(),source:'Notion Routine',sourceUrl:r.url,category:'Routine',color:'#9b77d0'})].filter(Boolean);});}
export function mergeEvents(...lists){return [...new Map(lists.flat().map(e=>[e.id+':'+e.date+':'+e.start,e])).values()];}
