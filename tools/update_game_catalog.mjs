import { writeFile } from 'node:fs/promises';
import { publicGameRecord } from '../js/integrations/notion/NotionGameAuthority.mjs';
import { NOTION_GAME_DATABASES } from '../js/integrations/notion/NotionGameData.js';
const token=process.env.NOTION_API_KEY||process.env.NOTION_TOKEN;
if(!token)throw Error('Configure a server-side Notion token');
const catalog={metadata:{source:'Notion',syncedAt:new Date().toISOString()}};
for(const [kind,key] of [['suits','suits'],['skills','combatSkills'],['maps','arenaMaps'],['badges','badges']]){
  catalog[kind]=[];let cursor;
  do{
    const response=await fetch(`https://api.notion.com/v1/databases/${NOTION_GAME_DATABASES[key]}/query`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Notion-Version':'2022-06-28','Content-Type':'application/json'},body:JSON.stringify({page_size:100,...(cursor?{start_cursor:cursor}:{})})});
    if(!response.ok)throw Error(`Notion catalog HTTP ${response.status}`);
    const page=await response.json();catalog[kind].push(...page.results.filter(row=>!row.archived&&!row.in_trash).map(row=>publicGameRecord(row,kind)));cursor=page.has_more?page.next_cursor:null;
    await new Promise(resolve=>setTimeout(resolve,350));
  }while(cursor);
}
await writeFile(new URL('../data/notion-game-catalog.json',import.meta.url),JSON.stringify(catalog));
console.log(Object.fromEntries(Object.entries(catalog).filter(([,v])=>Array.isArray(v)).map(([k,v])=>[k,v.length])));
