import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createHmac} from 'node:crypto';
import {fieldSession,fieldCookie,FIELD_SESSION_SECONDS} from '../server/field-backend.mjs';
import {hasOwnerSession} from '../api/notion-session.mjs';
import {NotionGamePresenter} from '../js/ui/NotionGamePresenter.js';
import gameHandler from '../api/game-state.mjs';

test('the existing Field session lasts like Gambit and legacy same-host cookies remain usable',()=>{
  const token='existing-gambit-session.signature';
  assert.equal(FIELD_SESSION_SECONDS,365*24*60*60);
  assert.match(fieldCookie(token),/Max-Age=31536000/);
  assert.match(fieldCookie('',0),/Max-Age=0/);
  assert.equal(fieldSession({headers:{cookie:'gambit_session='+token}}),token);
  assert.equal(fieldSession({headers:{cookie:'spider_field_session='+token+'; gambit_session=other.signature'}}),token);
  assert.equal(fieldSession({headers:{cookie:'gambit_session=bad\nvalue'}}),'');
});

test('a valid owner session survives the former twelve-hour cutoff but still expires and rejects tampering',()=>{
  const secret='test-secret',timestamp=Date.now()-13*60*60*1000;
  const cookie=at=>'spidey_notion_session='+at+'.'+createHmac('sha256',secret).update('spidey-notion:'+at).digest('hex');
  assert.equal(hasOwnerSession({headers:{cookie:cookie(timestamp)}},secret),true);
  assert.equal(hasOwnerSession({headers:{cookie:cookie(timestamp)+'bad'}},secret),false);
  assert.equal(hasOwnerSession({headers:{cookie:cookie(Date.now()-366*24*60*60*1000)}},secret),false);
});

const bridgeCode=await fs.readFile(new URL('../field-tools/spider-embedded.js',import.meta.url),'utf8');
function bridge(){
  const messages=[],timers=new Map();let timerId=0;
  const context={URL,URLSearchParams,Promise,location:{origin:'https://spider.example',href:'https://spider.example/field-tools/apps/todo/index.html?spiderEmbed=1',search:'?spiderEmbed=1&spiderTheme=original'},
    document:{currentScript:null,readyState:'loading',documentElement:{setAttribute(){}},createElement:()=>({}),head:{appendChild(){}},addEventListener(){}},
    parent:{postMessage:message=>messages.push(message)},addEventListener(){},
    fetch:async(input,options={})=>new Response(JSON.stringify(options.body||{ok:true}),{status:options.status||200}),
    setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id)};
  context.window=context;vm.createContext(context);vm.runInContext(bridgeCode,context);
  return {context,messages,async flush(){await new Promise(setImmediate);for(const fn of timers.values())fn();timers.clear();}};
}

test('only confirmed app writes notify the hub; reads, failed saves and database queries do not',async()=>{
  const {context,messages,flush}=bridge();
  await context.fetch('/api/notion?path='+encodeURIComponent('/v1/databases/a/query'),{method:'POST'});
  await context.fetch('/api/cloud?key=journal');
  await context.fetch('/api/cloud?key=journal',{method:'POST',body:{ok:false}});
  await context.fetch('/api/notion?path='+encodeURIComponent('/v1/pages/a'),{method:'PATCH',status:502});
  await context.fetch('https://other.example/api/cloud',{method:'POST'});
  await flush();assert.equal(messages.length,0);
  await context.fetch('/api/notion?path='+encodeURIComponent('/v1/pages/a'),{method:'PATCH'});
  await context.fetch('/api/notion?path='+encodeURIComponent('/v1/pages/b'),{method:'PATCH'});
  await flush();assert.deepEqual(JSON.parse(JSON.stringify(messages)),[{type:'spider:notion-changed'}]);
  await context.fetch('/api/notion-session',{method:'POST'});await flush();
  assert.equal(messages.at(-1).type,'spider:session-changed');
});

test('a save during a pending read queues a fresh read instead of losing the update',async()=>{
  const before=globalThis.fetch,calls=[],applied=[];let release;
  globalThis.fetch=async url=>{calls.push(url);if(calls.length===1)await new Promise(resolve=>release=resolve);return {ok:true,json:async()=>({ok:true,data:{profile:{HP:calls.length}}})};};
  const presenter=Object.assign(Object.create(NotionGamePresenter.prototype),{inFlight:null,refreshAfterFlight:false,apply:data=>applied.push(data.profile.HP),renderBattle(){}});
  try{
    const initial=presenter.refresh();const saved=presenter.refresh({force:true});release();
    await Promise.all([initial,saved]);
    assert.deepEqual(calls,['/api/game-state','/api/game-state?fresh=1']);
    assert.deepEqual(applied,[1,2]);
  }finally{globalThis.fetch=before;}
});

test('a confirmed save bypasses the game-state server cache',async()=>{
  const before=globalThis.fetch,old=process.env.NOTION_API_KEY;let hp=10;
  process.env.NOTION_API_KEY='test-key';
  globalThis.fetch=async url=>({ok:true,json:async()=>url.endsWith('/query')?{results:[]}:{id:'hero',properties:{HP:{type:'number',number:hp}}}});
  const res=()=>({setHeader(){},status(code){this.code=code;return this;},json(value){this.value=value;return this;}});
  try{
    const first=res();await gameHandler({method:'GET',headers:{}},first);assert.equal(first.value.data.profile.HP,10);
    hp=30;
    const cached=res();await gameHandler({method:'GET',headers:{}},cached);assert.equal(cached.value.data.profile.HP,10);
    const fresh=res();await gameHandler({method:'GET',headers:{},query:{fresh:'1'}},fresh);assert.equal(fresh.value.data.profile.HP,30);
  }finally{globalThis.fetch=before;if(old===undefined)delete process.env.NOTION_API_KEY;else process.env.NOTION_API_KEY=old;}
});
