import {skillGroup,SKILL_GROUP_LABELS} from '../game/SkillPresentation.mjs';
import {skillLoadout} from '../game/GamePresentation.mjs';
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
  constructor(presenter){this.p=presenter;this.catalog={};this.query='';this.limit=32;this.session={};this.slot='';this.message='';this.busy=false;this.inspectIds={};this.catalogMode='saved';this.catalogReadAt='';this.sessionLoading=true;this.catalogTimes={};this.skillFilter='equipped';}
  async init(){
    try{const r=await fetch('./data/notion-game-catalog.json');if(r.ok){this.catalog=await r.json();this.catalogReadAt=this.catalog.metadata?.syncedAt||'';}}catch{}
    await this.check();this.redraw();
  }
  async check(){try{const r=await fetch('/api/notion-session',{cache:'no-store'});if(!r.ok)throw Error();this.session=await r.json();}catch{this.session={error:true};}finally{this.sessionLoading=false;}}
  redraw(){if(this.p.ui.panelSection==='HERO')this.p.ui.renderPanel();}
  profile(){return this.ownedProfile||this.p.view().profile;}
  records(){
    const [kind,title]=SETTINGS[this.tab],selected=this.profile()[SETTINGS[this.tab][2]||this.slot]||[];
    return (this.catalog[kind]||[]).filter(r=>String(r[title]||'').toLocaleLowerCase('vi').includes(this.query.toLocaleLowerCase('vi'))).filter(r=>this.tab!=='SKILLS'||this.skillFilter==='all'||(this.skillFilter==='equipped'?selected.some(id=>sameId(id,r.id)):skillGroup(r)===this.skillFilter)).sort((a,b)=>Number(selected.some(id=>sameId(id,b.id)))-Number(selected.some(id=>sameId(id,a.id))));
  }
  skillFilters(){
    if(this.tab!=='SKILLS')return '';
    return '<div class="hero-skill-categories" role="group" aria-label="Lọc loại chiêu">'+[['equipped','Đang dùng'],['all','Tất cả'],['active','Chủ động'],['passive','Nội tại / bổ trợ'],['ultimate','Ultimate'],['other','Chưa phân loại']].map(([id,label])=>'<button type="button" data-skill-filter="'+id+'" aria-pressed="'+(this.skillFilter===id)+'">'+label+'</button>').join('')+'</div><p class="hero-skill-hint">Chọn chiêu để xem mô tả. Bấm trang bị mới lưu vào Notion.</p>';
  }
  symbol(record){const group=skillGroup(record);return this.tab==='SKILLS'?'<svg aria-hidden="true"><use href="#'+(group==='passive'?'icon-gear':group==='ultimate'?'icon-bolt':/web/i.test(record.Skill)?'icon-web-map':'icon-arena')+'"></use></svg>':this.tab==='MAPS'?'⌖':'✦';}
  skillAvailability(record){const energy=this.profile().Energy;return skillGroup(record)==='passive'?'Nội tại / bổ trợ: không phải nút đánh.':this.p.mode==='live'&&Number.isFinite(energy)&&Number.isFinite(record['Energy Cost'])?'Energy Hero '+energy+' · '+(energy>=record['Energy Cost']?'đủ theo chi phí cơ bản':'chưa đủ theo chi phí cơ bản'):'Chờ Energy mới nhất từ Notion.';}
  artwork(record){
    const image=record['Suit Preview']||record.Image||record.image;if(image)return image;
    if(this.tab==='SKILLS'){const key=String(record.Skill||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');return this.p.ui.skillIcons?.[key+'.svg']||'';}return '';
  }
  inspected(){const rows=this.records();return rows.find(r=>sameId(r.id,this.inspectIds[this.tab]))||rows[0];}
  deck(){
    const groups=skillLoadout(this.profile(),[...(this.p.view().skills||[]),...(this.catalog.skills||[])]);
    return '<section class="hero-skill-deck" aria-label="Chiêu đã trang bị"><header><div><small>HERO BUILD</small><h3>CHIÊU ĐANG TRANG BỊ</h3></div><span>'+groups.reduce((count,group)=>count+group.items.length,0)+' chiêu · '+groups.length+' ô Notion</span></header>'+groups.map(group=>'<div class="hero-deck-group"><strong>'+e(group.slot)+'</strong><div class="hero-deck-cards">'+(group.items.map(({id,record})=>'<button type="button" data-build-skill="'+e(id)+'" data-build-slot="'+e(group.slot)+'" class="hero-deck-card '+(sameId(this.inspectIds.SKILLS,id)&&group.slot===this.slot?'is-inspected':'')+'" aria-label="Xem chiêu đang trang bị: '+e(record?.Skill||'Đang thiếu dữ liệu')+'"><span>'+e(record?SKILL_GROUP_LABELS[skillGroup(record)]:'CHƯA ĐỌC ĐƯỢC')+'</span><strong>'+e(record?.Skill||'Bản ghi chưa tải')+'</strong><small>'+e(!record?'Chưa có dữ liệu':skillGroup(record)!=='passive'?'Energy '+(record['Energy Cost']??'—'):'Nội tại / bổ trợ')+'</small></button>').join('')||'<p>Ô này chưa chọn chiêu.</p>')+'</div></div>').join('')+(groups.length?'':'<p>Hero chưa có quan hệ Skill Slot trong Notion.</p>')+'<p class="hero-deck-note">Chọn thẻ để xem; cấu hình chỉ đổi khi bạn bấm trang bị hoặc bỏ chiêu.</p></section>';
  }
  equipped(){
    const p=this.profile(),label=(kind,title,ids)=>(ids||[]).map(id=>(this.catalog[kind]||[]).find(r=>sameId(r.id,id))?.[title]).filter(Boolean);
    const skills=Object.entries(p).filter(([key])=>/^Skill Slot \d+$/.test(key)).flatMap(([,ids])=>label('skills','Skill',ids));
    const items=[['SUITS','Trang phục',label('suits','Suit',p['Equipped Suit']).join(', ')||'Chưa chọn'],['SKILLS','Chiêu đã chọn',skills.join(' · ')||'Chưa chọn'],['MAPS','Map',label('maps','Map',p['Current Map']).join(', ')||'Chưa chọn'],['BADGES','Huy hiệu',label('badges','Medal',p['🎖️ Badges & Medals']).join(' · ')||'Chưa chọn']];
    return '<section class="hero-equipped" aria-label="Build đang dùng"><div class="hero-build-heading"><small>HERO LOADOUT</small><h3>BUILD ĐANG DÙNG</h3><span>Được xác nhận từ Hero Notion</span></div><div class="hero-equipped-slots">'+items.map(([tab,title,value])=>'<button type="button" data-loadout-tab="'+tab+'" class="'+(tab===this.tab?'is-current':'')+'"><small>'+title+'</small><strong>'+e(value)+'</strong></button>').join('')+'</div></section>';
  }
  render(tab){
    if(this.tab!==tab){this.query='';this.limit=32;}this.tab=tab;const [kind]=SETTINGS[tab],profile=this.profile();
    const slots=Object.keys(profile).filter(k=>/^Skill Slot \d+$/.test(k)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));if(!slots.includes(this.slot))this.slot=slots[0]||'';
    const state=this.sessionLoading?'Đang kiểm tra quyền lưu…':this.session.connected?'Đã mở quyền lưu vào Notion':this.session.error?'Chưa kiểm tra được kết nối':'Chế độ xem · mở quyền lưu để trang bị';
    const gameState=this.p.mode==='live'?'Hero đang đọc Notion · tự làm mới mỗi 20 giây':this.p.mode==='snapshot'?'Hero đang dùng bản lưu · đang thử kết nối lại':'Hero đang chờ dữ liệu Notion';
    const readAt=this.catalogTimes[kind]||this.catalogReadAt;const time=readAt?new Date(readAt).toLocaleString('vi-VN'):'';
    return (tab==='SKILLS'?this.deck():this.equipped())+`<details class="hero-sync-panel"><summary><strong data-loadout-summary>${this.p.mode==='live'?'NOTION ĐANG KẾT NỐI':'ĐANG XEM BẢN LƯU'}</strong><span>${this.session.connected?'Được lưu build':'Chỉ xem · mở kết nối để lưu'}</span></summary><section class="hero-loadout-toolbar" aria-label="Trạng thái đồng bộ"><div class="hero-sync-copy"><strong>${e(state)}</strong><p data-loadout-live-note>${e(gameState)}</p><small>Kho: ${this.catalogTimes[kind]?'đã đọc lại từ Notion':'bản lưu từ Notion'}${time?' · '+e(time):''}</small></div><div class="hero-sync-actions"><button type="button" data-loadout-refresh ${this.busy?'disabled':''}>${this.busy?'ĐANG ĐỒNG BỘ…':'ĐỌC LẠI NOTION'}</button>${!this.session.connected?'<button type="button" data-loadout-connect>MỞ QUYỀN LƯU</button>':''}</div><details class="hero-sync-explain"><summary>Cách đồng bộ và lưu lựa chọn</summary><p>Hero và Arena tự đọc dữ liệu game từ Notion mỗi 20 giây. Kho trang phục/chiêu đang dùng bản lưu ở thời điểm ghi bên trên; bấm Đọc lại Notion sau khi mở quyền lưu để cập nhật kho.</p><p>Bấm thẻ chỉ xem trước. Nút trang bị trong khung chi tiết mới ghi quan hệ tương ứng vào Hero Notion. Chỉ báo thành công khi Notion xác nhận. Kết quả đánh, chỉ số và phần thưởng vẫn do Notion quyết định.</p></details>${!this.session.connected?`<details class="hero-loadout-auth"><summary>Kết nối riêng để lưu build</summary>${this.session.configured?'<form data-loadout-auth><label>Mật khẩu truy cập hiện tại<input type="password" name="accessCode" autocomplete="current-password" required></label><button type="submit">KẾT NỐI</button></form>':'<p>Chưa mở được phiên riêng. Thử Đọc lại Notion khi có mạng.</p>'}<a href="https://www.notion.so/${HERO_PAGE_ID.replaceAll('-','')}" target="_blank" rel="noopener noreferrer">MỞ HERO TRONG NOTION ↗</a></details>`:''}</section></details>${this.message?`<p role="status" class="hero-loadout-message">${e(this.message)}</p>`:''}<div class="hero-loadout-filters"><input data-hero-search type="search" aria-label="Tìm trong bộ sưu tập" placeholder="Tìm ${tab==='SKILLS'?'chiêu':tab==='SUITS'?'trang phục':'trong bộ sưu tập'}…" value="${e(this.query)}">${tab==='SKILLS'?`<label>Ô trong Notion<select data-hero-slot>${slots.map(s=>`<option ${s===this.slot?'selected':''}>${e(s)}</option>`).join('')}</select></label>`:''}<span data-loadout-count>${this.records().length} mục</span></div>${this.skillFilters()}<div class="hero-build-workbench"><section class="hero-build-catalog" aria-label="Kho lựa chọn"><div class="hero-loadout-grid ${tab==='SKILLS'?'hero-skill-list':''}" data-loadout-grid>${this.cards()}</div><button type="button" class="pixel-action-btn" data-loadout-more ${this.records().length<=this.limit?'hidden':''}>XEM THÊM</button></section><aside class="hero-build-preview ${tab==='SKILLS'?'is-skill-preview':''}" data-loadout-detail aria-label="Chi tiết lựa chọn">${this.detail()}</aside></div>`;
  }
  cards(){
    const [,title,field]=SETTINGS[this.tab],selected=this.profile()[field||this.slot]||[],inspected=this.inspected();
    if(this.tab==='SKILLS')return this.records().slice(0,this.limit).map(r=>{
      const chosen=selected.some(id=>sameId(id,r.id)),active=sameId(r.id,inspected?.id),group=skillGroup(r),symbol=group==='passive'?'icon-gear':group==='ultimate'?'icon-bolt':/web/i.test(r.Skill)?'icon-web-map':'icon-arena';
      return '<button type="button" class="hero-skill-row '+(chosen?'is-equipped ':'')+(active?'is-inspected':'')+'" data-loadout-inspect="'+e(r.id)+'" aria-pressed="'+active+'"><svg aria-hidden="true"><use href="#'+symbol+'"></use></svg><span><strong>'+e(r.Skill)+'</strong><small>'+e(r['Skill Type']||'Chưa phân loại')+(group==='passive'?' · Không bấm đánh':' · Energy '+e(r['Energy Cost']??'—')+' · CD '+e(r.Cooldown??'—'))+'</small></span><b>'+(chosen?'ĐANG DÙNG':'XEM')+'</b></button>';
    }).join('')||'<p>Không có chiêu trong bộ lọc này. Chọn Tất cả để xem kho.</p>';
    return this.records().slice(0,this.limit).map(r=>{const chosen=selected.some(id=>sameId(id,r.id)),image=this.artwork(r),active=sameId(r.id,inspected?.id);
      return `<button type="button" class="hero-loadout-tile ${chosen?'is-equipped':''} ${active?'is-inspected':''}" data-loadout-inspect="${e(r.id)}" aria-pressed="${active}" aria-label="Xem ${e(r[title])}">${image?`<img loading="lazy" src="${e(image)}" alt="" width="160" height="150">`:'<span class="hero-loadout-symbol" aria-hidden="true">'+this.symbol(r)+'</span>'}<strong>${e(r[title])}</strong><small>${chosen?'ĐANG DÙNG':this.tab==='BADGES'&&r.Unlocked===false?'CHƯA MỞ KHÓA':'XEM CHI TIẾT'}</small></button>`;
    }).join('')||'<p>Không có mục phù hợp. Thử đổi từ khóa.</p>';
  }
  detail(){
    const r=this.inspected();if(!r)return '<p>Chọn một thẻ trong kho để xem.</p>';
    const [,title,field]=SETTINGS[this.tab],property=field||this.slot,chosen=(this.profile()[property]||[]).some(id=>sameId(id,r.id)),image=this.artwork(r);
    const locked=this.tab==='BADGES'&&r.Unlocked===false,disabled=this.busy||!this.session.connected||locked||!property||(chosen&&!['SKILLS','BADGES'].includes(this.tab));
    const group=this.tab==='SKILLS'?skillGroup(r):null;
    const action=chosen?['SKILLS','BADGES'].includes(this.tab)?'BỎ KHỎI BUILD':'ĐANG TRANG BỊ':this.tab==='SUITS'?'TRANG BỊ SUIT':this.tab==='MAPS'?'DÙNG MAP NÀY':this.tab==='SKILLS'?'TRANG BỊ VÀO '+this.slot:'TRANG BỊ HUY HIỆU';
    return `<small class="hero-preview-kicker">${chosen?'ĐANG DÙNG TRONG HERO':'XEM TRƯỚC · CHƯA THAY ĐỔI BUILD'}</small>${image?`<img class="hero-preview-art" src="${e(image)}" alt="${e(r[title])}" width="320" height="280">`:'<div class="hero-preview-symbol" aria-hidden="true">'+this.symbol(r)+'</div>'}<h3>${e(r[title])}</h3>${this.tab==='SKILLS'?`<span class="hero-skill-type">${e(SKILL_GROUP_LABELS[group])}</span><p>${e(r.Description||'Chưa có mô tả trong Notion.')}</p><p class="hero-preview-note" data-skill-energy-status>${e(this.skillAvailability(r))}</p><dl><div><dt>LOẠI</dt><dd>${e(r['Skill Type']||'—')}</dd></div><div><dt>ENERGY</dt><dd>${e(r['Energy Cost']??'—')}</dd></div><div><dt>CD CƠ BẢN</dt><dd>${e(r.Cooldown??'—')}</dd></div></dl><p class="hero-preview-note">Ghi vào ${e(this.slot||'ô chiêu chưa được tạo trong Notion')}.</p>`:this.tab==='MAPS'?`<p>${e(r.District||'')} · ${e(r.Weather||'')}</p>`:this.tab==='BADGES'?`<p>${e(r.Requirement||'Chưa có yêu cầu trong Notion.')}</p>`:''}<button type="button" class="hero-equip-action" data-loadout-choose="${e(r.id)}" ${disabled?'disabled':''}>${this.busy?'ĐANG LƯU…':locked?'CHƯA MỞ KHÓA':action}</button>${!this.session.connected?'<p class="hero-preview-note">Có thể xem trước. Mở quyền lưu để trang bị vào Hero Notion.</p>':''}<a href="${e(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">XEM BẢN GHI NOTION ↗</a>`;
  }
  bindNavigation(host){host.querySelectorAll('[data-loadout-tab]').forEach(button=>button.addEventListener('click',()=>{this.query='';this.p.ui.panelTab=button.dataset.loadoutTab;this.p.ui.renderPanel({resetScroll:true});this.p.ui.updateRoute();}));}
  bindDeck(host){host.querySelectorAll('[data-build-skill]').forEach(button=>button.addEventListener('click',()=>{this.slot=button.dataset.buildSlot;this.inspectIds.SKILLS=button.dataset.buildSkill;this.skillFilter='equipped';this.query='';this.limit=32;const search=host.querySelector('[data-hero-search]');if(search)search.value='';const slot=host.querySelector('[data-hero-slot]');if(slot)slot.value=this.slot;host.querySelectorAll('[data-skill-filter]').forEach(filter=>filter.setAttribute('aria-pressed',String(filter.dataset.skillFilter===this.skillFilter)));this.updateGrid(host);host.querySelector('[data-loadout-detail]')?.scrollIntoView({block:'nearest'});}));}
  bind(host){
    this.bindNavigation(host);this.bindDeck(host);
    if(!host.querySelector('[data-loadout-grid]'))return;
    // Another embedded app can open the owner session without reloading the hub.
    if(!this.sessionCheckAt||Date.now()-this.sessionCheckAt>15000){
      this.sessionCheckAt=Date.now();const before=!!this.session.connected;
      void this.check().then(()=>{if(before!==!!this.session.connected)this.redraw();});
    }
    host.querySelector('[data-loadout-connect]')?.addEventListener('click',()=>{const auth=host.querySelector('.hero-loadout-auth');if(auth){auth.open=true;auth.querySelector('input')?.focus();}});
    host.querySelectorAll('[data-skill-filter]').forEach(button=>button.addEventListener('click',()=>{this.skillFilter=button.dataset.skillFilter;this.limit=32;host.querySelectorAll('[data-skill-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));this.updateGrid(host);}));
    host.querySelector('[data-hero-search]')?.addEventListener('input',event=>{this.query=event.target.value;this.limit=32;this.updateGrid(host);});
    host.querySelector('[data-hero-slot]')?.addEventListener('change',event=>{this.slot=event.target.value;this.updateGrid(host);});
    host.querySelector('[data-loadout-more]')?.addEventListener('click',()=>{this.limit+=32;this.updateGrid(host);});
    host.querySelector('[data-loadout-refresh]')?.addEventListener('click',()=>this.refresh());
    host.querySelector('[data-loadout-auth]')?.addEventListener('submit',async event=>{
      event.preventDefault();const form=event.currentTarget,button=form.querySelector('button');button.disabled=true;
      try{const r=await fetch('/api/notion-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessCode:form.elements.accessCode.value})});form.reset();if(!r.ok)throw Error();this.message='Đã mở quyền lưu vào Notion.';await this.refresh();}
      catch{this.message='Chưa mở được quyền lưu. Kiểm tra mật khẩu truy cập và kết nối mạng.';this.redraw();}finally{button.disabled=false;}
    });this.bindCards(host);
  }
  updateGrid(host){const deck=host.querySelector('.hero-skill-deck');if(deck){deck.outerHTML=this.deck();this.bindDeck(host);}host.querySelector('[data-loadout-grid]').innerHTML=this.cards();host.querySelector('[data-loadout-detail]').innerHTML=this.detail();host.querySelector('[data-loadout-count]').textContent=this.records().length+' mục';host.querySelector('[data-loadout-more]').hidden=this.records().length<=this.limit;this.bindCards(host);}
  bindCards(host){host.querySelectorAll('[data-loadout-inspect]').forEach(button=>button.addEventListener('click',()=>{this.inspectIds[this.tab]=button.dataset.loadoutInspect;this.updateGrid(host);host.querySelectorAll('[data-loadout-inspect]').forEach(next=>{if(next.dataset.loadoutInspect===button.dataset.loadoutInspect)next.focus({preventScroll:true});});host.querySelector('[data-loadout-detail]')?.scrollIntoView({block:'nearest'});}));host.querySelectorAll('[data-loadout-choose]').forEach(button=>button.addEventListener('click',()=>this.choose(button.dataset.loadoutChoose)));}
  updateLiveNote(host){
    if(!host)return;
    const deck=host.querySelector('.hero-skill-deck');if(deck&&!deck.contains(document.activeElement)){deck.outerHTML=this.deck();this.bindDeck(host);}
    const energyStatus=host.querySelector('[data-skill-energy-status]');if(energyStatus&&this.inspected())energyStatus.textContent=this.skillAvailability(this.inspected());
    const summary=host.querySelector('[data-loadout-summary]');if(summary)summary.textContent=this.p.mode==='live'?'NOTION ĐANG KẾT NỐI':'ĐANG XEM BẢN LƯU';
    const note=host.querySelector('[data-loadout-live-note]');if(note)note.textContent=this.p.mode==='live'?'Hero đang đọc Notion · tự làm mới mỗi 20 giây':this.p.mode==='snapshot'?'Hero đang dùng bản lưu · đang thử kết nối lại':'Hero đang chờ dữ liệu Notion';
    const shell=host.querySelector('.hero-equipped');if(shell&&!shell.contains(document.activeElement)){const parent=shell.parentElement;shell.outerHTML=this.equipped();this.bindNavigation(parent||host);}
  }
  async refresh(){
    if(this.busy)return;this.busy=true;
    const refreshingTab=this.tab;
    try{
      await this.check();if(!this.session.connected){this.message=this.session.configured?'Nhập mã truy cập để lưu lựa chọn.':'Máy chủ chưa kết nối Notion; hiện đang xem bộ sưu tập đã lưu.';return;}
      const [kind]=SETTINGS[refreshingTab],db={suits:'suits',skills:'combatSkills',maps:'arenaMaps',badges:'badges'}[kind];
      const pages=await queryAllNotionPages(NOTION_GAME_DATABASES[db]);this.catalog[kind]=pages.map(page=>publicGameRecord(page,kind));this.catalogMode='live';this.catalogTimes[kind]=new Date().toISOString();
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
      this.ownedProfile=publicGameRecord(saved.data,'profile');this.ownedProfileAt=Date.now();this.message='Đã lưu lựa chọn vào Hero Notion. Đang đọc lại dữ liệu…';await this.p.refresh({force:true});this.message='Đã lưu lựa chọn vào Hero Notion.';
    }catch{this.message='Chưa lưu được vào Notion. Lựa chọn chưa thay đổi.';}finally{this.busy=false;this.redraw();}
  }
}
