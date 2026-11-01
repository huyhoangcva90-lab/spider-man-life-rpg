// Legacy URLs go directly to Gambit; no copied UI or asset relay.
export default function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 const path=String(req.query.asset||'index.html');
 if(path.includes('..')||!/^[a-zA-Z0-9_./-]+\.(?:html|css|js|mjs|json|svg|png|jpg|jpeg|webp|gif|woff2?|mp3|wav|webmanifest)$/.test(path))return res.status(404).end();
 res.setHeader('Location','https://gambit-d9b.pages.dev/field/'+path);return res.status(307).end();
}
