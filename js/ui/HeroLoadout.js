import { HERO_PAGE_ID, sameId, publicGameRecord } from '../integrations/notion/NotionGameAuthority.mjs';
import { NOTION_GAME_DATABASES, queryAllNotionPages } from '../integrations/notion/NotionGameData.js';
const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SETTINGS={SUITS:['suits','Suit','Equipped Suit'],SKILLS:['skills','Skill',null],MAPS:['maps','Map','Current Map'],BADGES:['badges','Medal','🎖️ Badges & Medals']};
// Page responses truncate long relations. Read every item before toggling one.
export async function readHeroRelation(page,property,transport=fetch){
  const value=page.properties[property];
  if(!value||value.type!=='relation')throw Error('Missing Hero relation');
  if(!value.has_more)return value.relation.map(item=>item.id);
  let cursor,ids=[];
  do{
    const path=`/v1/pages/${page.id}/properties/${encodeURIComponent(value.id)}?page_size=100${cursor?'&start_cursor='+encodeURIComponent(cursor):''}`;
    const response=await transport('/api/notion?path='+encodeURIComponent(path),{cache:'no-store'});
    const payload=await response.json(),data=payload.data;
    if(!response.ok||!Array.isArray(data?.results))throw Error('Incomplete Hero relation');
    ids.push(...data.results.map(item=>item.relation?.id).filter(Boolean));
    if(data.has_more&&!data.next_cursor)throw Error('Incomplete Hero relation');
    cursor=data.has_more?data.next_cursor:null;
  }while(cursor);
  return ids;
}
export class HeroLoadout {
  constructor(presenter){this.p=presenter;this.catalog={};this.query='';this.limit=32;this.session={};this.slot='';this.message='';this.busy=false;}
  async init(){
    try{const r=await fetch('./data/notion-game-catalog.json');if(r.ok)this.catalog=await r.json();}catch{}
    await this.check();this.redraw();
  }
  async check(){try{const r=await fetch('/api/notion-session',{cache:'no-store'});this.session=await r.json();}catch{this.session={};}}
  redraw(){if(this.p.ui.panelSection==='HERO')this.p.ui.renderPanel();}
  profile(){return this.ownedProfile||this.p.view().profile;}
  render(tab){
    this.tab=tab;const [kind,title,property]=SETTINGS[tab],profile=this.profile();
    const slots=Object.keys(profile).filter(k=>/^Skill Slot \d+$/.test(k)).sort();if(!slots.includes(this.slot))this.slot=slots[0]||'';
    const state=this.session.connected?'Đã kết nối Notion':this.session.configured?'Mở phiên riêng để lưu lựa chọn':'Chưa cấu hình Notion trên máy chủ';
    return `<section class="hero-loadout-toolbar"><div><strong>${e(state)}</strong><p>Chọn trang phục, chiêu, map và huy hiệu cho Hero.</p></div><button type="button" data-loadout-refresh>LÀM MỚI</button>${!this.session.connected&&this.session.configured?'<form data-loadout-auth><input type="password" name="accessCode" autocomplete="current-password" required aria-label="Mã truy cập Spider" placeholder="Mã truy cập Spider"><button type="submit">KẾT NỐI</button></form>':''}${!this.session.connected?`<a href="https://www.notion.so/${HERO_PAGE_ID.replaceAll('-','')}" target="_blank" rel="noopener noreferrer">CHỌN TRONG NOTION ↗</a>`:''}</section>${this.message?`<p role="status" class="hero-loadout-message">${e(this.message)}</p>`:''}<div class="hero-loadout-filters"><input data-hero-search type="search" aria-label="Tìm trong bộ sưu tập" placeholder="Tìm ${tab==='SKILLS'?'chiêu':tab==='SUITS'?'trang phục':'trong bộ sưu tập'}…" value="${e(this.query)}">${tab==='SKILLS'?`<label>Ô đang chọn<select data-hero-slot>${slots.map(s=>`<option ${s===this.slot?'selected':''}>${e(s)}</option>`).join('')}</select></label>`:''}<span>${(this.catalog[kind]||[]).length} mục từ Notion</span></div><div class="hero-loadout-grid" data-loadout-grid>${this.cards()}</div><button type="button" class="pixel-action-btn" data-loadout-more>XEM THÊM</button>`;
  }
  cards(){
    const [kind,title,field]=SETTINGS[this.tab],property=field||this.slot,selected=this.profile()[property]||[];
    const records=(this.catalog[kind]||[]).filter(r=>String(r[title]||'').toLocaleLowerCase('vi').includes(this.query.toLocaleLowerCase('vi')));
    records.sort((a,b)=>Number(selected.some(id=>sameId(id,b.id)))-Number(selected.some(id=>sameId(id,a.id))));
    return records.slice(0,this.limit).map(r=>{
      const chosen=selected.some(id=>sameId(id,r.id)),image=r['Suit Preview']||r.Image||r.image;
      const disabled=this.busy||!this.session.connected||(this.tab==='BADGES'&&r.Unlocked===false)||!property;
      return `<article class="hero-loadout-card ${chosen?'is-selected':''}">${image?`<img loading="lazy" src="${e(image)}" alt="${e(r[title])}">`:`<div class="hero-loadout-glyph" aria-hidden="true"><svg><use href="#${this.tab==='SKILLS'?'icon-bolt':this.tab==='MAPS'?'icon-web-map':'icon-mask'}"></use></svg></div>`}<div class="hero-loadout-card-body"><small>${e(chosen?'ĐANG CHỌN':this.tab==='SKILLS'?r['Skill Type']:this.tab==='BADGES'&&r.Unlocked===false?'CHƯA MỞ KHÓA':kind.toUpperCase())}</small><h3>${e(r[title])}</h3>${this.tab==='SKILLS'?`<p>${e(r.Description)}</p><span>ENERGY ${e(r['Energy Cost']??'—')} · CD ${e(r.Cooldown??'—')}</span>`:''}${this.tab==='MAPS'?`<p>${e(r.District)} · ${e(r.Weather)}</p>`:''}${this.tab==='BADGES'?`<p>${e(r.Requirement)}</p>`:''}<button type="button" data-loadout-choose="${e(r.id)}" ${disabled?'disabled':''}>${chosen?this.tab==='SKILLS'||this.tab==='BADGES'?'BỎ CHỌN':'ĐANG DÙNG':this.tab==='SUITS'?'MẶC TRANG PHỤC':this.tab==='MAPS'?'CHỌN MAP':'CHỌN'}</button><a href="${e(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">Notion ↗</a></div></article>`;
    }).join('')||'<p>Không có mục phù hợp. Thử làm mới danh sách Notion.</p>';
  }
  bind(host){
    if(!host.querySelector('[data-loadout-grid]'))return;
    // Another embedded app can open the owner session without reloading the hub.
    if(!this.sessionCheckAt||Date.now()-this.sessionCheckAt>15000){
      this.sessionCheckAt=Date.now();const before=!!this.session.connected;
      void this.check().then(()=>{if(before!==!!this.session.connected)this.redraw();});
    }
    host.querySelector('[data-hero-search]')?.addEventListener('input',event=>{this.query=event.target.value;this.limit=32;this.updateGrid(host);});
    host.querySelector('[data-hero-slot]')?.addEventListener('change',event=>{this.slot=event.target.value;this.updateGrid(host);});
    host.querySelector('[data-loadout-more]')?.addEventListener('click',()=>{this.limit+=32;this.updateGrid(host);});
    host.querySelector('[data-loadout-refresh]')?.addEventListener('click',()=>this.refresh());
    host.querySelector('[data-loadout-auth]')?.addEventListener('submit',async event=>{
      event.preventDefault();const form=event.currentTarget;const r=await fetch('/api/notion-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessCode:form.elements.accessCode.value})});form.reset();this.message=r.ok?'Đã kết nối.':'Chưa mở được phiên riêng.';await this.refresh();
    });this.bindCards(host);
  }
  updateGrid(host){host.querySelector('[data-loadout-grid]').innerHTML=this.cards();this.bindCards(host);}
  bindCards(host){host.querySelectorAll('[data-loadout-choose]').forEach(button=>button.addEventListener('click',()=>this.choose(button.dataset.loadoutChoose)));}
  async refresh(){
    if(this.busy)return;this.busy=true;
    try{
      await this.check();if(!this.session.connected){this.message=this.session.configured?'Nhập mã truy cập để lưu lựa chọn.':'Máy chủ chưa kết nối Notion; hiện đang xem bộ sưu tập đã lưu.';return;}
      const [kind]=SETTINGS[this.tab],db={suits:'suits',skills:'combatSkills',maps:'arenaMaps',badges:'badges'}[kind];
      const pages=await queryAllNotionPages(NOTION_GAME_DATABASES[db]);this.catalog[kind]=pages.map(page=>publicGameRecord(page,kind));
      const r=await fetch(`/api/notion?path=${encodeURIComponent('/v1/pages/'+HERO_PAGE_ID)}`,{cache:'no-store'});const payload=await r.json();if(!r.ok)throw Error();this.ownedProfile=publicGameRecord(payload.data,'profile');this.ownedProfileAt=Date.now();this.message='Đã đọc lại bộ sưu tập từ Notion.';
    }catch{this.message='Chưa đọc lại được Notion. Giữ nguyên lựa chọn.';}finally{this.busy=false;this.redraw();}
  }
  async choose(id){
    if(this.busy||!this.session.connected)return;
    const tab=this.tab,[kind,,field]=SETTINGS[tab],property=field||this.slot,multi=tab==='SKILLS'||tab==='BADGES',record=(this.catalog[kind]||[]).find(r=>sameId(r.id,id));if(!record||tab==='BADGES'&&record.Unlocked===false)return;
    this.busy=true;this.message='Đang lưu lựa chọn…';this.redraw();
    try{
      const get=await fetch(`/api/notion?path=${encodeURIComponent('/v1/pages/'+HERO_PAGE_ID)}`,{cache:'no-store'});const payload=await get.json();if(!get.ok)throw Error();
      if(!property||!payload.data.properties[property]||payload.data.properties[property].type!=='relation')throw Error();
      const current=await readHeroRelation(payload.data,property);
      const next=multi?(current.some(value=>sameId(value,id))?current.filter(value=>!sameId(value,id)):[...current,id]):[id];
      const r=await fetch(`/api/notion?path=${encodeURIComponent('/v1/pages/'+HERO_PAGE_ID)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({properties:{[property]:{relation:next.map(value=>({id:value}))}}})});const saved=await r.json();if(!r.ok)throw Error();
      this.ownedProfile=publicGameRecord(saved.data,'profile');this.ownedProfileAt=Date.now();this.message='Đã lưu lựa chọn vào Hero Notion. Arena sẽ tự cập nhật.';void this.p.refresh();
    }catch{this.message='Chưa lưu được vào Notion. Lựa chọn chưa thay đổi.';}finally{this.busy=false;this.redraw();}
  }
}
