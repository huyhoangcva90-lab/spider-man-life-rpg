const $ = id => document.getElementById(id);
const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let data, selected, loading = false;
const zone = 'Asia/Ho_Chi_Minh';
function tick() { $('clock').textContent = new Intl.DateTimeFormat('vi-VN', {timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(new Date()) + ' / VN'; }
tick(); setInterval(tick, 30000);
function group(title, items, habit = false) {
  if (!items.length) return '';
  return `<div class="group"><h3 class="group-title">${title}<span>${items.length}</span></h3>${items.map(item => `<article class="item"><span class="item-mark ${item.today === true ? 'checked' : ''}">${item.icon ? escape(item.icon) : item.today === true ? '✓' : habit ? '○' : '◇'}</span><div class="item-body"><h3>${escape(item.name || 'Chưa đặt tên')}</h3><div class="tags">${[item.type,item.status,item.timeblock].filter(Boolean).map(tag=>`<span class="tag ${tag === 'Bad Habit' ? 'bad' : ''}">${escape(tag)}</span>`).join('')}${item.today === true ? '<span class="tag">Today ✓</span>' : ''}</div>${item.description ? `<p>${escape(item.description)}</p>` : ''}</div><a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="Mở ${escape(item.name)} trong Notion">Notion ↗</a></article>`).join('')}</div>`;
}
function select(id) {
  selected = id; const current = data.routines.find(r => r.id === id); if (!current) return;
  $('periods').innerHTML = data.routines.map(r => `<button type="button" data-select="${escape(r.id)}" aria-pressed="${r.id === id}">${escape(r.name)}</button>`).join('');
  $('timeline').innerHTML = data.routines.map(r => `<button type="button" class="timeline-item ${r.id === id ? 'active' : ''}" data-select="${escape(r.id)}" aria-pressed="${r.id === id}"><span>${escape(r.time || 'Chưa có giờ')}</span><strong>${escape(r.name)}</strong></button>`).join('');
  $('detail').innerHTML = `<div class="detail-heading"><div><span class="eyebrow">KHUNG GIỜ ĐÃ CHỌN</span><h2>${escape(current.name)}</h2><time>${escape(current.time || 'Chưa đặt khung giờ trong Notion')}</time></div><span class="count">${current.habits.length} thói quen</span></div>` + group('THÓI QUEN', current.habits, true) + group('CHĂM SÓC DA', current.skincare) + group('CHĂM SÓC TÓC', current.haircare) + (![...current.habits,...current.skincare,...current.haircare].length ? '<p class="empty">Khung giờ này chưa liên kết thói quen hoặc sản phẩm trong Notion.</p>' : '');
  $('routine-link').href = current.url;
}
document.addEventListener('click', event => { const button=event.target.closest('[data-select]'); if(button)select(button.dataset.select); });
async function load() {
  if (loading) return; loading = true; $('refresh').disabled=true; $('notice').textContent='';
  try {
    const session = await fetch('/api/notion-session', {cache:'no-store'});
    if (!session.ok) throw new Error('Không kiểm tra được kết nối. Bạn thử lại sau nhé.');
    const state = await session.json();
    if (!state.connected) {
      data=null; $('workspace').hidden=true; $('connection').hidden=false;
      $('sync-state').textContent = state.configured ? 'Notion · cần mở phiên riêng tư' : 'Notion · chờ cấu hình máy chủ';
      $('connection-message').textContent = state.configured ? 'Nhập mã truy cập Spider để xem dữ liệu Notion của bạn trên thiết bị này.' : 'Máy chủ chưa được cấu hình kết nối Notion và mã truy cập riêng. Bạn vẫn có thể mở database gốc bên dưới.';
      $('connect-form').hidden=!state.configured; return;
    }
    const response=await fetch('/api/routine', {cache:'no-store'});
    if (!response.ok) throw new Error('Chưa đọc được Routine từ Notion. Kiểm tra quyền truy cập DB rồi thử lại.');
    data=await response.json(); $('connection').hidden=true; $('workspace').hidden=false;
    const habits=[...new Map(data.routines.flatMap(r=>r.habits).map(h=>[h.id,h])).values()];
    $('date').textContent=new Intl.DateTimeFormat('vi-VN',{timeZone:zone,weekday:'long',day:'numeric',month:'long'}).format(new Date());
    $('routine-count').textContent=data.routines.length; $('habit-count').textContent=habits.length; $('done-count').textContent=habits.filter(h=>h.today===true).length;
    $('sync-state').textContent='Notion · đã kết nối';
    $('last-sync').textContent='ĐỒNG BỘ '+new Intl.DateTimeFormat('vi-VN',{timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(new Date(data.syncedAt));
    if(data.routines.length) select(data.routines.some(r=>r.id===selected) ? selected : currentPeriod(data.routines));
    else { $('detail').innerHTML='<p class="empty">Routine chưa có bản ghi. Thêm khung giờ trong Notion để bắt đầu.</p>'; $('periods').innerHTML=''; $('timeline').innerHTML=''; $('routine-link').removeAttribute('href'); }
  } catch(error) { $('notice').textContent=error.message; $('sync-state').textContent=data ? 'Notion · chưa làm mới được' : 'Notion · chưa kết nối'; }
  finally { loading=false; $('refresh').disabled=false; }
}
function currentPeriod(routines) {
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date()).split(':'); const now=+parts[0]*60 + +parts[1];
  return (routines.find(r=>{ const m=r.time.match(/(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/);if(!m)return false;const start=+m[1]*60 + +m[2],end=+m[3]*60 + +m[4];return start>end ? now>=start || now<end : now>=start && now<end; }) || routines[0]).id;
}
$('refresh').addEventListener('click',load);
$('connect-form').addEventListener('submit',async event=>{
  event.preventDefault(); const button=event.submitter; button.disabled=true;
  try { const response=await fetch('/api/notion-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessCode:$('access-code').value})}); $('access-code').value='';if(!response.ok)throw new Error(response.status===401 ? 'Mã truy cập chưa đúng.' : 'Không mở được phiên. Bạn thử lại nhé.');await load(); }
  catch(error){$('notice').textContent=error.message;}finally{button.disabled=false;}
});
let lastFocus=0;window.addEventListener('focus',()=>{if(Date.now()-lastFocus>15000){lastFocus=Date.now();load();}});
load();
