import test from 'node:test';
import assert from 'node:assert/strict';
import {readHeroRelation,HeroLoadout} from '../js/ui/HeroLoadout.js';
import {fieldStatus,fieldRequest,fieldSession} from '../server/field-backend.mjs';
import sessionHandler from '../api/notion-session.mjs';
import notionHandler from '../api/notion.mjs';
import fieldHandler from '../api/field.mjs';
import {parseFieldBackup} from '../field-tools/field-backup.js';
import {projectFieldGame} from '../api/game-state.mjs';
const response=()=>({headers:{},code:200,setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(data){this.data=data;return this;}});
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
const session='mock-session-payload.mock-signature';
test('public Field game display drops private fields and entire personal databases',()=>{
  const data=projectFieldGame({profile:{id:'hero',HP:0,Diary:'private'},tasks:[{Name:'private'}],skills:[{id:'a',Skill:'Kick',Private:'private'}]});
  assert.equal(data.profile.HP,0);assert.equal(data.skills[0].Skill,'Kick');assert.ok(!JSON.stringify(data).includes('private'));assert.equal(data.tasks,undefined);
});
test('Field imports only tool records and excludes login tokens and nested credentials',()=>{
  const result=Object.fromEntries(parseFieldBackup(JSON.stringify({gambit_auth_token:'must-not-copy',unrelated:'private-other-app',journal_v2:JSON.stringify({entries:[{body:'Keep private journal locally'}],token:'must-not-copy'}),dhv2:JSON.stringify({days:{}})})));
  assert.deepEqual(Object.keys(result),['journal_v2','dhv2']);assert.ok(!JSON.stringify(result).includes('must-not-copy'));assert.match(result.journal_v2,/Keep private journal locally/);
});
test('Field fails closed when the existing backend has no authentication',async()=>{
  assert.deepEqual(await fieldStatus({headers:{}},async()=>json({ok:true})),{configured:false,connected:false});
  await assert.rejects(fieldRequest('/api/unknown'),/Unknown Field API/);
  assert.equal(fieldSession({headers:{cookie:'spider_field_session=bad\nvalue'}}),'');
});
test('Spider reuses the protected owner backend without returning its token to the browser',async()=>{
  const previous=globalThis.fetch,old={...process.env};
  delete process.env.NOTION_PROXY_ACCESS_TOKEN;delete process.env.NOTION_API_KEY;delete process.env.NOTION_TOKEN;
  const calls=[];
  globalThis.fetch=async(url,options)=>{
    calls.push({url,options});
    if(url.endsWith('/auth/check'))return options.headers.Cookie?json({ok:true,token:session}):json({error:'Authentication required'},401);
    if(url.endsWith('/auth/login'))return json({ok:true,token:session});
    return json({results:[{id:'real-record'}]});
  };
  try{
    const headers={host:'spider.example',origin:'https://spider.example'};
    const locked=response();await sessionHandler({method:'GET',headers},locked);assert.equal(locked.data.connected,false);assert.equal(locked.data.configured,true);
    const login=response();await sessionHandler({method:'POST',headers,body:{accessCode:'existing-password'}},login);
    assert.deepEqual(login.data,{ok:true});assert.match(login.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Strict/);
    const cookie=login.headers['Set-Cookie'].split(';')[0];
    const check=response();await sessionHandler({method:'GET',headers:{...headers,cookie}},check);assert.equal(check.data.connected,true);assert.ok(!JSON.stringify(check.data).includes(session));
    const read=response();await notionHandler({method:'POST',headers:{...headers,cookie},query:{path:'/v1/databases/test/query'},body:{page_size:100}},read);assert.deepEqual(read.data,{ok:true,data:{results:[{id:'real-record'}]}});
    const before=calls.length,cross=response();await notionHandler({method:'PATCH',headers:{...headers,cookie,origin:'https://evil.example'},query:{path:'/v1/pages/a'},body:{}},cross);assert.equal(cross.code,403);assert.equal(calls.length,before);
    const denied=response();await fieldHandler({method:'GET',headers,query:{kind:'cloud',key:'habits'}},denied);assert.equal(denied.code,401);
    const api=response();await fieldHandler({method:'GET',headers:{...headers,cookie},query:{kind:'cloud',key:'habits'}},api);assert.equal(api.code,200);assert.ok(calls.at(-1).url.endsWith('/api/cloud?key=habits'));
    assert.ok(calls.every(call=>call.url.startsWith('https://gambit-d9b.pages.dev/api/')));
  }finally{globalThis.fetch=previous;for(const key of ['NOTION_PROXY_ACCESS_TOKEN','NOTION_API_KEY','NOTION_TOKEN']){if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key];}}
});
test('Hero preserves the complete relation across multiple property pages',async()=>{
  const page={id:'hero',properties:{skills:{id:'a:b',type:'relation',has_more:true,relation:[]}}};
  const calls=[];
  const ids=await readHeroRelation(page,'skills',async url=>{calls.push(decodeURIComponent(url));return json({data:calls.length===1?{results:[{relation:{id:'first'}}],has_more:true,next_cursor:'cursor'}:{results:[{relation:{id:'last'}}],has_more:false}});});
  assert.deepEqual(ids,['first','last']);assert.match(calls[1],/start_cursor=cursor/);
  await assert.rejects(readHeroRelation(page,'skills',async()=>json({data:{results:[],has_more:true}})),/Incomplete/);
});
test('a failed Hero selection keeps the confirmed profile and never mutates combat',async()=>{
  const previous=globalThis.fetch;
  const hero={id:'hero',properties:{'Equipped Suit':{type:'relation',relation:[{id:'old'}]}}};
  const ui=new HeroLoadout({view:()=>({profile:{'Equipped Suit':['old']}}),ui:{panelSection:null},refresh(){throw Error('Should not refresh after failure');}});
  ui.tab='SUITS';ui.session.connected=true;ui.catalog.suits=[{id:'next',Suit:'Next suit'}];
  let writes=0;
  globalThis.fetch=async(url,options={})=>{if(options.method==='PATCH'){writes++;assert.deepEqual(JSON.parse(options.body),{properties:{'Equipped Suit':{relation:[{id:'next'}]}}});return json({},502);}return json({data:hero});};
  try{await ui.choose('next');assert.equal(writes,1);assert.deepEqual(ui.profile()['Equipped Suit'],['old']);assert.match(ui.message,/chưa thay đổi/);}finally{globalThis.fetch=previous;}
});
