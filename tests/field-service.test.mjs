import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['tools/build_field_service.mjs'],{cwd:new URL('..',import.meta.url)});
const {onRequest:middleware}=await import('../.field-service-release/functions/_middleware.js');
const {onRequest:google}=await import('../.field-service-release/functions/api/google/[[path]].js');
test('retired Gambit pages redirect into Spider while private APIs stay locked',async()=>{
  for(const [path,game] of [['/','FIELD'],['/apps/todo/index.html','QUESTS'],['/apps/habits/index.html','HABITS'],['/apps/finance/index.html','FIELD']]){
    const r=await middleware({request:new Request('https://gambit-d9b.pages.dev'+path)}),url=new URL(r.headers.get('location'));
    assert.equal(url.origin,'https://spider.huykl.id.vn');assert.equal(url.searchParams.get('game'),game);
  }
  const locked=await middleware({request:new Request('https://gambit-d9b.pages.dev/api/cloud?key=habits'),env:{AUTH_SECRET:'test'}});assert.equal(locked.status,401);
});
test('Google reconnect uses signed one-use state and returns to Spider without a cross-domain cookie',async()=>{
  const kv=new Map(),env={AUTH_SECRET:'test-field-secret',GOOGLE_CLIENT_ID:'test-client',GOOGLE_CLIENT_SECRET:'test-secret',GOOGLE_OAUTH:{get:async key=>kv.get(key),put:async(key,value)=>kv.set(key,value),delete:async key=>kv.delete(key)}};
  const start=await google({request:new Request('https://gambit-d9b.pages.dev/api/google/start'),env});
  const target=new URL(start.headers.get('Location')),state=target.searchParams.get('state');assert.equal(target.hostname,'accounts.google.com');assert.equal(target.searchParams.get('scope'),'https://www.googleapis.com/auth/calendar.readonly');
  const bad=await google({request:new Request('https://gambit-d9b.pages.dev/api/google/callback?state=invalid&code=fake'),env});assert.equal(bad.status,400);
  const previous=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({refresh_token:'mock',access_token:'mock',expires_in:3600}));
  try{
    const request=new Request('https://gambit-d9b.pages.dev/api/google/callback?state='+encodeURIComponent(state)+'&code=fake');
    const ok=await google({request,env});assert.equal(ok.status,302);assert.match(ok.headers.get('Location'),/^https:\/\/spider.huykl.id.vn\//);assert.ok(kv.has('google-calendar-token'));
    const repeat=await google({request,env});assert.equal(repeat.status,400);
  }finally{globalThis.fetch=previous;}
});
