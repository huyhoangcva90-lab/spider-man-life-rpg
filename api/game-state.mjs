import { readNotionGameState } from '../server/notion-game-reader.mjs';
import {fieldSession,fieldRequest,fieldStatus} from '../server/field-backend.mjs';
import {GAME_FIELDS} from '../js/integrations/notion/NotionGameAuthority.mjs';

export function projectFieldGame(data){
  const record=(value,kind)=>Object.fromEntries(Object.entries(value||{}).filter(([key])=>key==='id'||key==='sourceUrl'||GAME_FIELDS[kind].includes(key)||(kind==='profile'&&/^Skill Slot \d+$/.test(key))));
  if(!data?.profile?.id)throw Error('No game profile');
  const result={metadata:{source:'Notion',syncedAt:data.metadata?.syncedAt},profile:record(data.profile,'profile')};
  for(const kind of Object.keys(GAME_FIELDS).filter(key=>key!=='profile'))result[kind]=(Array.isArray(data[kind])?data[kind]:[]).map(value=>record(value,kind));
  return result;
}

let cached = null;
let pending = null;
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Read-only game display' });
  const token = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN || '';
  res.setHeader('Cache-Control', 'no-store');
  const remote=fieldSession(req);
  try {
    if(!token&&(!remote||!(await fieldStatus(req)).connected)){
      const response=await fieldRequest('/api/spider-game');
      if(!response.ok)return res.status(503).json({ok:false,error:'Notion display is not configured'});
      const payload=await response.json();if(!payload.ok)throw Error();
      return res.status(200).json({ok:true,data:projectFieldGame(payload.data)});
    }
    if(!token){
      // No shared cache for a private upstream session; only approved game fields leave the reader.
      const data=await readNotionGameState('field-session',{fetcher:(url,options)=>fieldRequest('/api/notion?path='+encodeURIComponent(new URL(url).pathname+new URL(url).search),{method:options.method,body:options.body,session:remote})});
      return res.status(200).json({ok:true,data});
    }
    if (!cached || Date.now() - cached.at > 15000) {
      if (!pending) pending = readNotionGameState(token).then((data) => { cached = { data, at: Date.now() }; }).finally(() => { pending = null; });
      await pending;
    }
    return res.status(200).json({ ok: true, data: cached.data });
  } catch {
    return res.status(502).json({ ok: false, error: 'Notion display could not refresh' });
  }
}
