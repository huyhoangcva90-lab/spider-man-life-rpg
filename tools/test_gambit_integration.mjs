import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createPreviewServer } from './preview_server.mjs';

const server = createPreviewServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  for (const app of ['routine','dopamine','timetable','gym','habits','journal','todo','english','oracle','style30','someday','finance']) {
    const response = await fetch(`${origin}/gambit/apps/${app}/`);
    assert.equal(response.status, 200, app);
    assert.match(response.headers.get('content-type'), /text\/html/);
  }
  for (const [url, type] of [['/gambit/manifest.webmanifest','application/manifest+json'], ['/gambit/assets/vendor/tabler/fonts/tabler-icons.woff2','font/woff2']]) {
    const response = await fetch(origin + url, {method:'HEAD'});
    assert.equal(response.status,200); assert.equal(response.headers.get('content-type'),type);
    assert.equal((await response.text()).length,0);
  }
  assert.equal((await fetch(`${origin}/.env.local`)).status,403);
  assert.equal((await fetch(`${origin}/gambit/`,{method:'POST'})).status,405);
  assert.equal((await fetch(`${origin}/%ZZ`)).status,400);
  console.log('PASS: all 12 directory routes, fonts/manifest, HEAD and private-file protection');
} finally { await new Promise((resolve) => server.close(resolve)); }

const handlers = {}, removed = [], requests = [], writes = [];
const cache = { addAll:async (paths)=>{assert(paths.includes('./apps/routine/index.html'));}, put:async (request)=>writes.push(request.url), match:async ()=>undefined };
const context = {
  URL, Response,
  self:{location:{href:'http://localhost/gambit/sw.js'},addEventListener:(name,fn)=>{handlers[name]=fn;},skipWaiting(){},clients:{claim(){}}},
  caches:{open:async()=>cache,keys:async()=>['other-app-cache','gambit-shell-v22','spider-gambit-shell-old','spider-gambit-shell-v1'],delete:async(key)=>removed.push(key)},
  fetch:async(request)=>{requests.push(request.url);return new Response('OK');}
};
vm.runInNewContext(await fs.readFile(new URL('../gambit/sw.js',import.meta.url),'utf8'),context);
let pending;
handlers.activate({waitUntil:(p)=>{pending=p;}}); await pending;
assert.deepEqual(removed,['spider-gambit-shell-old']);
for (const url of ['http://localhost/api/notion','http://localhost/index.html','https://other.example/resource']) {
 let intercepted=false; handlers.fetch({request:{url,method:'GET'},respondWith:()=>{intercepted=true;}}); assert.equal(intercepted,false,url);
}
handlers.fetch({request:{url:'http://localhost/gambit/apps/routine/',method:'GET'},respondWith:(p)=>{pending=p;}});
assert.equal((await pending).status,200);
context.fetch=async()=>{throw new Error('offline');};
handlers.fetch({request:{url:'http://localhost/gambit/missing',method:'GET'},respondWith:(p)=>{pending=p;}});
assert.equal((await pending).status,503);
console.log('PASS: cache cleanup preserves other apps; fetch scope isolated; offline miss returns 503');
