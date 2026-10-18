// The owner's existing service retains its KV, Google and Sheets connections.
// Only server requests cross this boundary; integration keys never reach clients.
export const FIELD_BACKEND='https://gambit-d9b.pages.dev';
export const FIELD_COOKIE='spider_field_session';
export function fieldSession(req){
  const item=String(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(FIELD_COOKIE+'='));
  const value=item?.slice(FIELD_COOKIE.length+1)||'';
  return /^[A-Za-z0-9_.-]{20,4096}$/.test(value)?value:'';
}
export async function fieldRequest(path,{method='GET',body,session='',fetcher=fetch}={}){
  if(!/^\/api\/(auth\/(check|login)|notion|cloud|finance|finance-v2|spider-game|google(?:\/[^?#]*)?)(?:\?|$)/.test(path))throw Error('Unknown Field API');
  return fetcher(FIELD_BACKEND+path,{method,redirect:'manual',signal:AbortSignal.timeout(30000),headers:{'Content-Type':'application/json',...(session?{Cookie:'gambit_session='+session}:{})},...(body!==undefined?{body:typeof body==='string'?body:JSON.stringify(body)}:{})});
}
export async function fieldStatus(req,fetcher=fetch){
  try{
    // Fail closed if the upstream stops requiring authentication.
    const locked=await fieldRequest('/api/auth/check',{fetcher});
    if(locked.status!==401)return {configured:false,connected:false};
    const session=fieldSession(req);if(!session)return {configured:true,connected:false};
    const response=await fieldRequest('/api/auth/check',{session,fetcher});
    const data=await response.json();return {configured:true,connected:response.ok&&data.ok===true};
  }catch{return {configured:false,connected:false};}
}
export function fieldCookie(value,maxAge=43200){return `${FIELD_COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${maxAge}`;}
export function sameFieldOrigin(req){try{return new URL(req.headers.origin).host===req.headers.host;}catch{return false;}}
