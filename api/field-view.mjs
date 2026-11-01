// Legacy asset URLs now resolve to the app source shipped with Spider.
export default function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const path=String(req.query.asset||'index.html');
 if(path.includes('..')||!/^[a-zA-Z0-9_./-]+\.(?:html|css|js|mjs|json|svg|png|jpg|jpeg|webp|gif|woff2?|mp3|wav|webmanifest)$/.test(path))return res.status(404).end();
 res.setHeader('Location','/field-tools/'+path);return res.status(307).end();
}
