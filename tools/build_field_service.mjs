import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const source=path.resolve(process.argv[2]||'C:/Users/huyklgl/Documents/antigravity/spider-man-life-rpg/integrations/gambit');
const out=path.join(root,'.field-service-release');
await fs.access(path.join(source,'functions','_middleware.js'));
await fs.mkdir(out,{recursive:true});
await fs.cp(path.join(source,'functions'),path.join(out,'functions'),{recursive:true});
const middleware=path.join(out,'functions','_middleware.js');
const code=await fs.readFile(middleware,'utf8');
const marker='  const url = new URL(context.request.url);';
if(!code.includes(marker))throw Error('Unknown source middleware; inspect before deploying');
const redirect=`
  if(['/sw.js','/migrate','/migrate.html','/field-backup.js'].includes(url.pathname))return context.next();
  if(url.pathname==='/api/google/callback')return context.next(); // signed, one-use state is verified by the callback
  if(url.pathname==='/api/spider-game')return context.next(); // fixed approved game projection, no arbitrary Notion paths
  if(!url.pathname.startsWith('/api/')){
    const app=url.pathname.match(/^\\/apps\\/([^/]+)/)?.[1];
    const target=new URL('https://spider.huykl.id.vn/');
    target.searchParams.set('game',app==='todo'?'QUESTS':app==='habits'?'HABITS':'FIELD');
    if(app&&!['todo','habits'].includes(app))target.searchParams.set('spiderApp',app);
    return Response.redirect(target.href,302);
  }
`;
await fs.writeFile(middleware,code.replace(marker,marker+redirect));
const googleFile=path.join(out,'functions','api','google','[[path]].js');
let google=await fs.readFile(googleFile,'utf8');
const stateMarker='  const state = await createState(context.env.AUTH_SECRET);';
const verifyMarker='  if (!state || state !== savedState || !await validState(state, context.env.AUTH_SECRET)) return json({ error: "Invalid OAuth state." }, 400);';
if(!google.includes(stateMarker)||!google.includes(verifyMarker))throw Error('Unknown Google source; inspect before deploying');
google=google.replace(stateMarker,stateMarker+'\n  await context.env.GOOGLE_OAUTH.put("spider-oauth:"+state,"pending",{expirationTtl:600});');
google=google.replace(verifyMarker,'  if (!state || !await validState(state, context.env.AUTH_SECRET) || !await context.env.GOOGLE_OAUTH.get("spider-oauth:"+state)) return json({error:"Invalid OAuth state."},400);\n  await context.env.GOOGLE_OAUTH.delete("spider-oauth:"+state);');
google=google.replace('Location: "/apps/timetable/index.html?google=connected"','Location: "https://spider.huykl.id.vn/?game=FIELD&spiderApp=timetable"');
await fs.writeFile(googleFile,google);
const authority=(await fs.readFile(path.join(root,'js/integrations/notion/NotionGameAuthority.mjs'),'utf8')).replace(/^export /gm,'');
const reader=(await fs.readFile(path.join(root,'server/notion-game-reader.mjs'),'utf8')).replace(/^import[^\n]+\n/,'').replace(/^export /gm,'');
await fs.writeFile(path.join(out,'functions/api/spider-game.js'),authority+'\n'+reader+`\nlet cached,pending;
export async function onRequest({request,env}){
  const headers={'Cache-Control':'no-store'};
  if(request.method!=='GET')return Response.json({ok:false,error:'Read-only game display'},{status:405,headers});
  if(!env.NOTION_TOKEN)return Response.json({ok:false,error:'Game display unavailable'},{status:503,headers});
  try{if(!cached||Date.now()-cached.at>15000){if(!pending)pending=readNotionGameState(env.NOTION_TOKEN).then(data=>{cached={at:Date.now(),data};}).finally(()=>{pending=null;});await pending;}return Response.json({ok:true,data:cached.data},{headers});}
  catch{return Response.json({ok:false,error:'Game refresh unavailable'},{status:502,headers});}
}`);
// All application pages live in Spider. Only the existing protected APIs remain.
await fs.writeFile(path.join(out,'index.html'),'<!doctype html><meta charset="utf-8"><title>Spider Field</title><meta http-equiv="refresh" content="0;url=https://spider.huykl.id.vn/?game=FIELD"><a href="https://spider.huykl.id.vn/?game=FIELD">Mở Spider Field</a>');
await fs.copyFile(path.join(root,'field-tools','field-backup.js'),path.join(out,'field-backup.js'));
await fs.writeFile(path.join(out,'migrate.html'),`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chuyển dữ liệu sang Spider Field</title><style>body{max-width:620px;margin:40px auto;padding:24px;background:#0b1927;color:#fff;font:16px/1.6 system-ui}button,a{display:inline-block;margin:8px;padding:12px}</style><h1>Chuyển dữ liệu sang Spider</h1><p>Tải lịch sử Habit, việc, nhật ký, học tập và bản nháp tài chính đang lưu trong trình duyệt này. File giữ riêng trên thiết bị, không gồm phiên đăng nhập hay khóa API. Sau đó vào Field trong Spider và chọn “Nhập bản sao lưu cũ”.</p><button id="backup">Tải bản sao lưu trên thiết bị này</button><a href="https://spider.huykl.id.vn/?game=FIELD">Mở Spider Field</a><p id="status" role="status"></p><script type="module">import{parseFieldBackup,isFieldStorageKey}from'./field-backup.js';document.querySelector('#backup').onclick=()=>{const data={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(isFieldStorageKey(key))data[key]=localStorage.getItem(key);}const safe=Object.fromEntries(parseFieldBackup(JSON.stringify(data)));const url=URL.createObjectURL(new Blob([JSON.stringify(safe,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='spider-field-migration.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#status').textContent='Đã xuất '+Object.keys(safe).length+' mục. Dữ liệu cũ vẫn giữ nguyên.';};</script>`);
await fs.writeFile(path.join(out,'sw.js'),`self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('gambit-shell-'))await caches.delete(key);await self.registration.unregister();})()));`);
const originalHeaders=await fs.readFile(path.join(source,'_headers'),'utf8');
await fs.writeFile(path.join(out,'_headers'),originalHeaders+'\n/sw.js\n  Cache-Control: no-store\n');
console.log(JSON.stringify({directory:out,source,apiOnly:true,preserves:'Existing Cloudflare environment bindings, Notion, Google, Sheets and KV'}));
