import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/notion-session.mjs';
test('A linked Gambit session stays HttpOnly and never returns to browser JSON',async()=>{
 const oldFetch=globalThis.fetch,oldSecret=process.env.NOTION_PROXY_ACCESS_TOKEN,oldKey=process.env.NOTION_API_KEY;
 process.env.NOTION_PROXY_ACCESS_TOKEN='local-secret';process.env.NOTION_API_KEY='notion-key';
 const res={headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(v){this.body=v}};
 let calls=0;globalThis.fetch=async(url,options)=>{calls++;assert.equal(url,'https://gambit-d9b.pages.dev/api/spider-link');assert.equal(options.headers.Origin,'https://spider.huykl.id.vn');return Response.json({ok:true,token:'owner-session-with-enough-characters'});};
 try{
  await handler({method:'POST',headers:{host:'spider.huykl.id.vn',origin:'https://other.example'},body:{bridgeCode:'a'.repeat(64),state:'b'.repeat(64)}},res);assert.equal(res.code,403);assert.equal(calls,0);
  await handler({method:'POST',headers:{host:'spider.huykl.id.vn',origin:'https://spider.huykl.id.vn'},body:{bridgeCode:'a'.repeat(64),state:'b'.repeat(64)}},res);
  assert.equal(res.code,200);assert.deepEqual(res.body,{ok:true,backend:'field'});assert.match(res.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Strict/);assert.equal(calls,1);
 }finally{globalThis.fetch=oldFetch;if(oldSecret===undefined)delete process.env.NOTION_PROXY_ACCESS_TOKEN;else process.env.NOTION_PROXY_ACCESS_TOKEN=oldSecret;if(oldKey===undefined)delete process.env.NOTION_API_KEY;else process.env.NOTION_API_KEY=oldKey;}
});
