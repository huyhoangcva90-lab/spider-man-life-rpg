const $=id=>document.getElementById(id);

export function nativeNotionView(data){
 const profile=data?.profile||{};
 const names=new Map((data?.skills||[]).map(skill=>[skill.id,skill]));
 const slots=Object.keys(profile).filter(key=>/^Skill Slot \d+$/.test(key)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
 return {
  hero:profile.Hero||'Hero',
  hp:Number.isFinite(profile.HP)&&Number.isFinite(profile['Max HP'])?`${profile.HP} / ${profile['Max HP']}`:'Chưa có',
  energy:Number.isFinite(profile.Energy)&&Number.isFinite(profile['Max Energy'])?`${profile.Energy} / ${profile['Max Energy']}`:'Chưa có',
  slots:slots.map(name=>({name,skills:(Array.isArray(profile[name])?profile[name]:[]).map(id=>names.get(id)).filter(Boolean).map(skill=>`${skill.Skill||'Chiêu chưa đặt tên'}${skill['Skill Type']==='Passive'?' (nội tại)':''}`)})),
  syncedAt:data?.metadata?.syncedAt||null
 };
}

export function installNativeNotion(){
 let loading=false;
 async function refresh(){if(loading||document.hidden)return;loading=true;const status=$('notion-status');try{
   let response=await fetch('/api/game-state',{cache:'no-store'}),payload=response.ok?await response.json():null,cached=false;
   if(!payload?.ok||!payload.data?.profile){response=await fetch('../data/notion-game-state.json',{cache:'no-store'});if(!response.ok)throw Error('Không tải được dữ liệu');payload={data:await response.json()};cached=true;}
   const view=nativeNotionView(payload.data);$('notion-profile').textContent=`${view.hero} · HP ${view.hp} · Energy ${view.energy}`;
   $('notion-skills').replaceChildren(...view.slots.map(slot=>{const item=document.createElement('li');item.textContent=`${slot.name}: ${slot.skills.join(', ')||'Chưa gắn chiêu'}`;return item;}));
   status.textContent=(cached?'BẢN LƯU':'NOTION TRỰC TIẾP')+(view.syncedAt?' · '+new Date(view.syncedAt).toLocaleString('vi-VN'):'')+' · chỉ xem, không đổi trận thử.';
  }catch{status.textContent='Chưa đọc được dữ liệu Notion. Trận thử vẫn chơi độc lập.';}finally{loading=false;}}
 void refresh();setInterval(()=>{if($('native-notion').open)void refresh();},20000);$('native-notion').addEventListener('toggle',()=>{if($('native-notion').open)void refresh();});
}
