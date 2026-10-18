import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
const code=await fs.readFile(new URL('../field-tools/notion-connection.js',import.meta.url),'utf8');
function setup(){
  const element=()=>({style:{},querySelector:()=>element(),addEventListener(){},showModal(){},close(){}});
  const day={pageId:'daily',habits:{chosen:false}},calls=[];
  let fail=false;
  const context={URLSearchParams,Date,Set,Promise,Error,setTimeout,clearTimeout,setInterval(){},location:{origin:'http://localhost'},
    document:{hidden:false,body:{appendChild(){}},createElement:element,getElementById:()=>null,querySelector:()=>null,addEventListener(){}},
    addEventListener(){},D:{notion:{ok:true,dbId:'daily-db'},days:{today:day}},HABITS:[{k:'chosen',l:'Chosen'}],getDay:()=>day,save(){},renderAll(){},renderToday(){},toast(){},toggleH(){},setMeta(){},
    fetch:async(url,options={})=>{calls.push({url,options});let value;
      if(url==='/api/notion-session')value={connected:true,configured:true};
      else if(options.method==='GET')value={ok:true,data:{properties:{Habits:{relation:[{id:'other'}]}}}};
      else value={ok:!fail,data:{id:'daily'}};
      return {ok:!fail,status:fail?502:200,json:async()=>value};
    }};
  context.window=context;context.parent=context;vm.createContext(context);vm.runInContext(code,context);
  return {context,day,calls,setFail(value){fail=value;}};
}
test('a habit write preserves unrelated relations and confirms Notion before changing the mark',async()=>{
  const s=setup();await new Promise(setImmediate);
  await s.context.toggleH('today','chosen');
  const patch=s.calls.find(call=>call.options.method==='PATCH');
  assert.deepEqual(JSON.parse(patch.options.body),{properties:{Habits:{relation:[{id:'other'},{id:'chosen'}]}}});
  assert.equal(s.day.habits.chosen,true);
});
test('failed check-in and metadata saves keep the last confirmed state',async()=>{
  const s=setup();await new Promise(setImmediate);s.setFail(true);
  await s.context.toggleH('today','chosen');assert.equal(s.day.habits.chosen,false);
  await s.context.setMeta('today','mood','Happy');assert.equal(s.day.mood,undefined);
});
