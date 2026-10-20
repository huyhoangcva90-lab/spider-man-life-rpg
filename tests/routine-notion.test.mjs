import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRoutine, projectItem } from '../js/integrations/notion/RoutineData.mjs';
import handler from '../api/routine.mjs';

test('Routine paginates databases and relations, shares linked records, and excludes private fields', async () => {
  const calls=[];
  const page=(id,time,relation)=>({id,properties:{Name:{type:'title',title:[{plain_text:id}]},Time:{rich_text:[{plain_text:time}]},Habits:relation}});
  const request=async (url,opts)=>{
    calls.push([url,opts]); let data;
    if(url.includes('/query')) data=JSON.parse(opts.body).start_cursor
      ? {results:[page('morning','06:00 - 08:00',{relation:[{id:'habit'}]})],has_more:false}
      : {results:[page('evening','18:00 - 22:30',{id:'rel',has_more:true})],has_more:true,next_cursor:'next'};
    else if(url.includes('/properties/')) data=url.includes('start_cursor=')
      ? {results:[{relation:{id:'habit2'}}],has_more:false}
      : {results:[{relation:{id:'habit'}}],has_more:true,next_cursor:'nextRel'};
    else data={id:url.split('/').pop(),properties:{Name:{type:'title',title:[{plain_text:'Habit'}]},Today:{type:'checkbox',checkbox:false},PrivateJournal:{rich_text:[{plain_text:'private content'}]},'Gold / Check':{number:99}}};
    return {ok:true,json:async()=>data};
  };
  const result=await loadRoutine('test-key',request);
  assert.deepEqual(result.routines.map(r=>r.id),['morning','evening']);
  assert.equal(result.routines[1].habits.length,2);
  assert.equal(calls.filter(([url])=>url.endsWith('/pages/habit')).length,1);
  assert.equal(result.routines[0].habits[0].today,false);
  assert.ok(!JSON.stringify(result).includes('private content'));
  assert.ok(!JSON.stringify(result).includes('Gold'));
  assert.ok(calls.filter(([,opts])=>opts.method==='POST').every(([url])=>url.endsWith('/query')));
  assert.equal(projectItem({id:'test',properties:{}}).today,null);
});

test('Routine denies public reads and mutations without requesting Notion', async()=>{
  for(const method of ['GET','POST','PATCH','DELETE']){
    const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=body;}};
    await handler({method,headers:{}},res);
    assert.equal(res.code,method==='GET'?401:405);
    assert.equal(res.headers['Cache-Control'],'private, no-store');
  }
});
