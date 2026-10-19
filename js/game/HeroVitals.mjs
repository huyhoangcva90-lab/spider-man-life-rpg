// A stale zero is not proof of a knockout. Never invent HP while waiting for Notion.
export function heroVitals(profile={},confirmed=false){
 const hp=profile.HP,max=profile['Max HP'];
 const known=Number.isFinite(hp)&&(confirmed||hp>0);
 return {known,hp:known?hp:null,max:Number.isFinite(max)?max:null,ko:confirmed&&Number.isFinite(hp)&&hp<=0,percent:known&&max>0?Math.max(0,Math.min(100,hp/max*100)):0};
}
export function newerGameSnapshot(...values){
 return values.filter(v=>v?.profile?.id&&Number.isFinite(Date.parse(v.metadata?.syncedAt))).sort((a,b)=>Date.parse(b.metadata.syncedAt)-Date.parse(a.metadata.syncedAt))[0]||null;
}
