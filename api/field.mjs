import {fieldSession,fieldRequest,fieldStatus,sameFieldOrigin} from '../server/field-backend.mjs';
const APIS=new Set(['cloud','finance','finance-v2','google']);
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const kind=req.query.kind,session=fieldSession(req);
  if(!APIS.has(kind))return res.status(404).json({ok:false,error:'Unknown Field API'});
  if(!session)return res.status(401).json({ok:false,error:'Mở kết nối riêng trong Spider để dùng tính năng này.'});
  if(!['GET','POST','PUT'].includes(req.method))return res.status(405).json({ok:false,error:'Method not allowed'});
  if(req.method!=='GET'&&!sameFieldOrigin(req))return res.status(403).json({ok:false,error:'Cross-origin writes are not allowed'});
  const route=kind==='google'?String(req.query.route||''):'';
  if(kind==='google'&&!['status','calendars','events','start'].includes(route))return res.status(404).json({ok:false,error:'Unknown Google API'});
  const query=new URLSearchParams(Object.entries(req.query).filter(([key])=>!['kind','route'].includes(key)));
  try{
    if(!(await fieldStatus(req)).connected)return res.status(401).json({ok:false,error:'Kết nối riêng đã hết hạn.'});
    const response=await fieldRequest('/api/'+kind+(route?'/'+route:'')+(query.size?'?'+query:''),{method:req.method,body:req.method==='GET'?undefined:req.body,session});
    if(kind==='google'&&route==='start'&&response.status===302){
      const target=new URL(response.headers.get('Location'));
      if(target.protocol!=='https:'||target.hostname!=='accounts.google.com')throw Error('Unexpected authorization destination');
      res.setHeader('Location',target.href);return res.status(302).end();
    }
    const data=await response.json();return res.status(response.status).json(data);
  }catch{return res.status(502).json({ok:false,error:'Chưa kết nối được dữ liệu Field.'});}
}
