const GAMBIT='https://gambit-d9b.pages.dev';
let pending;
export function linkGambitSession({interactive=false}={}){
 if(pending)return pending;
 pending=new Promise(resolve=>{
  const state=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
  const url=GAMBIT+'/spider-link?state='+state;
  let frame,popup,timer,settled=false;
  const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);window.removeEventListener('message',receive);frame?.remove();try{popup?.close();}catch{}resolve(value);};
  const receive=async event=>{
   if(event.origin!==GAMBIT||event.source!==(popup||frame?.contentWindow)||event.data?.type!=='gambit:session-link'||event.data.state!==state)return;
   if(event.data.error)return finish(false);
   try{const r=await fetch('/api/notion-session',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({bridgeCode:event.data.code,state})});const result=await r.json();if(r.ok&&result.ok){window.dispatchEvent(new Event('spider:session-linked'));finish(true);}else finish(false);}catch{finish(false);}
  };
  window.addEventListener('message',receive);
  timer=setTimeout(()=>finish(false),interactive?45000:6000);
  if(interactive){popup=window.open(url,'spider-gambit-connect','popup,width=480,height=540');if(!popup)finish(false);}
  else{frame=document.createElement('iframe');frame.hidden=true;frame.title='Dùng phiên Gambit hiện có';frame.src=url;document.body.appendChild(frame);}
 }).finally(()=>{pending=null;});
 return pending;
}
