export const FIELD_STORAGE_KEYS=new Set(['journal_v2','dhv2','gambit-gym-hevy-v1','routines_v5','english28-grammar-v3','dopamine-menus-v13','dk','todo_mono_theme','todo_mono_data','notionKingTheme','notionKingGoogleCalendar','gambit_transaction_draft_v1','gambit_finance_plans_v1','monarch_finance_txns_v1','gambit_finance_privacy_v1','gambit_finance_bill_states_v1','monarch_bill_states','gambit_finance_reviewed_v1','gambit_target_year','gambit_report_views']);
export function isFieldStorageKey(key){return FIELD_STORAGE_KEYS.has(key)||/^gambit_budget_source_\d{4}_\d{2}$/.test(key);}
function clean(value){if(Array.isArray(value))return value.map(clean);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!/token|secret|password|api.?key|authorization|__proto__|constructor/i.test(key)).map(([key,v])=>[key,clean(v)]));return value;}
export function parseFieldBackup(raw){
  const data=JSON.parse(raw);if(!data||Array.isArray(data)||typeof data!=='object')throw Error('Bản sao lưu chưa đúng định dạng.');
  const entries=[];
  for(const [key,value]of Object.entries(data))if(isFieldStorageKey(key)&&typeof value==='string'){
    let safe=value;try{safe=JSON.stringify(clean(JSON.parse(value)));}catch{}
    entries.push([key,safe]);
  }
  return entries;
}
if(typeof document!=='undefined')document.querySelector('[data-field-import]')?.addEventListener('click',()=>{
  const dialog=document.createElement('dialog');dialog.style.cssText='width:min(520px,calc(100% - 32px));max-height:85vh;overflow:auto;padding:24px;border:1px solid #497f95;border-radius:12px;background:#0b1927;color:#f2f5f6;font:14px/1.6 system-ui;';
  dialog.innerHTML='<h2>Nhập dữ liệu cũ</h2><p>Chọn file Master Backup đã tải từ Gambit. Nhật ký, lịch sử và bản nháp được lưu riêng trên trình duyệt này. Không nhập mật khẩu hay khóa kết nối.</p><input type="file" accept="application/json,.json" aria-label="File sao lưu Gambit"><div data-options></div><p role="status"></p><button type="button" data-apply disabled>Nhập các mục đã chọn</button> <button type="button" data-close>Đóng</button>';
  document.body.appendChild(dialog);dialog.showModal();let entries=[];
  const status=dialog.querySelector('[role=status]'),options=dialog.querySelector('[data-options]'),apply=dialog.querySelector('[data-apply]');
  dialog.querySelector('[data-close]').onclick=()=>{dialog.close();dialog.remove();};
  dialog.querySelector('input').onchange=async event=>{
    try{
      const file=event.target.files[0];if(!file)return;if(file.size>2000000)throw Error('File quá lớn. Giới hạn 2 MB.');
      entries=parseFieldBackup(await file.text());options.replaceChildren();
      for(const [key]of entries){const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.value=key;box.checked=localStorage.getItem(key)===null;label.style.display='block';label.append(box,document.createTextNode(' '+key+(box.checked?'':' · đã có trong Spider')));options.append(label);}
      status.textContent=entries.length?'Mục đã có được bỏ chọn mặc định. Chỉ chọn nếu muốn dùng bản cũ; bản hiện tại sẽ được sao lưu trước.':'Không tìm thấy dữ liệu của các công cụ Field.';apply.disabled=!entries.length;
    }catch(error){apply.disabled=true;status.textContent=error.message;}
  };
  apply.onclick=()=>{
    const selected=new Set(Array.from(options.querySelectorAll('input:checked')).map(box=>box.value)),before={},saved=[];
    try{
      if(!selected.size){status.textContent='Chọn ít nhất một mục.';return;}
      for(const key of selected)before[key]=localStorage.getItem(key);
      localStorage.setItem('spider_field_before_import_'+Date.now(),JSON.stringify(before));
      for(const [key,value]of entries)if(selected.has(key)){localStorage.setItem(key,value);saved.push(key);}
      apply.disabled=true;status.textContent='Đã nhập '+saved.length+' mục. Mở lại công cụ tương ứng để xem dữ liệu.';
    }catch{for(const key of saved){if(before[key]===null)localStorage.removeItem(key);else localStorage.setItem(key,before[key]);}status.textContent='Chưa nhập được. Dữ liệu hiện tại được giữ nguyên; kiểm tra dung lượng trình duyệt.';}
  };
});
