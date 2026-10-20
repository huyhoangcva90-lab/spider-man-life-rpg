/* Daily workspace. Retains the Sheets transaction contract and monochrome theme. */
const WORKSPACE_PLAN_STORE='gambit_finance_plans_v1';
let workspacePlans={};
try{workspacePlans=JSON.parse(localStorage.getItem(WORKSPACE_PLAN_STORE)||'{}')||{};}catch{}
let workspaceDialogTrigger=null;
let budgetEditorMonth='';
let budgetEditorCategories=[];
let planRequest=0;
let transactionDetailRows=[];

function workspaceMonth(date=curMo){return `${date.getFullYear()}_${String(date.getMonth()+1).padStart(2,'0')}`;}
function validWorkspacePlan(plan){return !!plan&&Number.isFinite(plan.updatedAt)&&Array.isArray(plan.rows)&&plan.rows.length<=80&&plan.rows.every(r=>typeof r.name==='string'&&r.name.trim().length>0&&r.name.length<=80&&Number.isFinite(r.amount)&&r.amount>0&&r.amount<=10000000000);}
function applyWorkspaceBudget(){
  if(localStorage.getItem('gambit_budget_source_'+workspaceMonth())==='sheet')return;
  const plan=workspacePlans[workspaceMonth()];if(!validWorkspacePlan(plan))return;
  budgets.splice(0,budgets.length,...plan.rows.map(r=>({n:r.name,categoryKey:normalizeKey(r.name),cat:shMapCat(r.name,'expense'),total:r.amount,c:'#bdbdbd'})));
}
async function loadWorkspaceBudget(){
  if(localStorage.getItem('gambit_budget_source_'+workspaceMonth())==='sheet')return;
  const month=workspaceMonth(),request=++planRequest;
  try{
    const response=await fetch('/api/cloud?key=finance_budget_'+month);
    if(!response.ok)return;
    const result=await response.json(),remote=result.data,local=workspacePlans[month];
    if(validWorkspacePlan(remote)&&(!validWorkspacePlan(local)||remote.updatedAt>local.updatedAt)){
      workspacePlans[month]={...remote,synced:true};
      try{localStorage.setItem(WORKSPACE_PLAN_STORE,JSON.stringify(workspacePlans));}catch{}
      if(request===planRequest&&month===workspaceMonth())renderAll();
    }
  }catch{/* Cached allocations remain available offline. */}
}

function navigateFinance(event,id){if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();goP(id,null);}
function updateWorkspaceNavigation(id){
  const parent=['savings','bills'].includes(id)?'budget':id==='debt'?'networth':id;
  document.querySelectorAll('.sb-item[data-route],.workspace-tabs [data-route]').forEach(el=>{
    const selected=el.dataset.route===id||(el.closest('.sb-nav')&&el.dataset.route===parent);
    el.classList.toggle('on',selected);if(selected)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
  });
  document.querySelectorAll('.mnb').forEach(el=>{const selected=el.dataset.p===parent;el.classList.toggle('on',selected);if(selected)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  const quick=$('quickAdd');quick.hidden=!['dashboard','expenses','bills'].includes(id);
  $('pageTitle').textContent=id==='sheets'?'Cài đặt':$('pageTitle').textContent;
  const header=$('page-'+id)?.querySelector('h1');if(header){header.tabIndex=-1;header.focus({preventScroll:true});}
}
function refreshTransactionOptions(){
  const current=monthTxns();
  for(const [id,values,label] of [
    ['categoryFilter',current.map(t=>t.categoryLabel||(CAT[t.cat]||CAT.other).n),'Mọi danh mục'],
    ['accountFilter',current.map(t=>t.account).filter(Boolean),'Mọi tài khoản']
  ]){
    const select=$(id),previous=select.value;
    select.innerHTML='<option value="">'+label+'</option>'+[...new Set(values)].sort((a,b)=>a.localeCompare(b,'vi')).map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    if([...select.options].some(o=>o.value===previous))select.value=previous;
  }
}
function getFilteredTransactions(){
  const query=normalizeKey(activeTxSearch),category=$('categoryFilter')?.value||'',account=$('accountFilter')?.value||'';
  return monthTxns().filter(t=>{
    const cat=t.categoryLabel||(CAT[t.cat]||CAT.other).n;
    return (activeTxFilter==='all'||t.type===activeTxFilter||t.cat===activeTxFilter)&&(!category||cat===category)&&(!account||t.account===account)&&(!query||normalizeKey([t.name,t.note,cat,t.account].join(' ')).includes(query));
  }).sort((a,b)=>b.date.localeCompare(a.date));
}
function renderTransactionList(){
  const root=$('all-txns');if(!root)return;
  const rows=getFilteredTransactions();transactionDetailRows=rows;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===activeTxFilter)));
  const sum=rows.reduce((n,t)=>n+(t.type==='income'?t.amount:-t.amount),0);
  $('e-sub').textContent=`${rows.length} giao dịch · ${sum<0?'−':sum>0?'+':''}${fmtFull(sum)}`;
  if(!rows.length){root.innerHTML=monthTxns().length?emptyState('Không tìm thấy giao dịch','Thử đổi từ khóa hoặc bỏ bớt bộ lọc.','Xóa bộ lọc','resetTransactionFilters()'):emptyState('Ghi lại khoản đầu tiên','Một bữa ăn, tiền đi lại hay khoản thu hôm nay.','Thêm giao dịch','openModal()');return;}
  const groups=new Map();rows.forEach((t,i)=>{if(!groups.has(t.date))groups.set(t.date,[]);groups.get(t.date).push({t,i});});
  root.innerHTML=[...groups.entries()].map(([date,items])=>{
    const daily=items.reduce((n,{t})=>n+(t.type==='income'?t.amount:-t.amount),0);
    return `<section class="transaction-day"><div class="day-heading"><h2>${esc(new Intl.DateTimeFormat('vi-VN',{weekday:'long',day:'numeric',month:'long'}).format(new Date(date+'T12:00:00')))}</h2><span>${daily<0?'−':daily>0?'+':''}${fmtFull(daily)}</span></div>${items.map(({t,i})=>{const c=CAT[t.cat]||CAT.other;return `<button class="txr transaction-row" onclick="openTransactionDetail(${i})" aria-label="Xem ${esc(t.name)}"><span class="tx-ico">${esc(c.e)}</span><span class="tx-info"><strong class="tx-name">${esc(t.name)}</strong><span class="tx-meta">${esc(t.categoryLabel||c.n)}${t.account?' · '+esc(t.account):''}</span></span><span class="tx-amt ${t.type==='income'?'tx-pos':'tx-neg'}">${t.type==='income'?'+':'−'}${fmtFull(t.amount)}</span><span class="row-chevron" aria-hidden="true">›</span></button>`;}).join('')}</section>`;
  }).join('');
}
function renderWorkspaceHome(){
  const hasPlan=budgets.length>0;
  $('homePlanButton').textContent=hasPlan?'Điều chỉnh ngân sách':'Lập ngân sách tháng';
  const pending=bills.filter(b=>b.status!=='paid'&&!billStates[b.n+'|'+b.date]);
  document.querySelector('.home-upcoming').classList.toggle('is-empty',!pending.length);
  if(!pending.length)$('upcomingList').innerHTML='<div class="quiet-state"><span class="quiet-symbol" aria-hidden="true">✓</span><strong>Chưa có khoản nào đang chờ</strong><p>Các khoản lặp lại sẽ được nhận diện từ lịch sử giao dịch.</p><button onclick="goP(\'bills\',null)">Xem khoản định kỳ →</button></div>';
  const root=$('homeBudgetList');
  if(!hasPlan)root.innerHTML='<div class="quiet-state"><strong>Cho mỗi khoản chi một giới hạn</strong><p>Bắt đầu với các danh mục bạn thường chi. Theo dõi phần còn lại ngay tại đây.</p><button onclick="openBudgetEditor()">Tạo ngân sách →</button></div>';
  else root.innerHTML=budgets.slice(0,4).map(b=>{
    const spent=monthTxns().filter(t=>t.type==='expense'&&(b.categoryKey?normalizeKey(t.categoryLabel||(CAT[t.cat]||CAT.other).n)===b.categoryKey:t.cat===b.cat)).reduce((n,t)=>n+t.amount,0),left=b.total-spent;
    return `<button class="home-budget-row" onclick="goP('budget',null)"><span>${esc(b.n)}<small>${left>=0?'Còn lại':'Vượt ngân sách'}</small></span><strong>${fmtFull(Math.abs(left))}</strong><i><b style="width:${Math.min(100,spent/b.total*100)}%"></b></i></button>`;
  }).join('');
  const plan=workspacePlans[workspaceMonth()];$('budgetStorageState').textContent=validWorkspacePlan(plan)?(plan.synced?'Đã đồng bộ':'Đã lưu trên thiết bị'):'Từ nguồn đã kết nối';
  document.querySelector('#page-budget .workspace-add').textContent=hasPlan?'Chỉnh ngân sách':'+ Tạo ngân sách';
  document.querySelector('#page-budget').classList.toggle('without-budget',!hasPlan);
}

function renderQuickCategories(){
  const select=$('inp-cat'),root=$('quickCategories');if(!select||!root)return;
  const frequent=new Map();monthTxns().filter(t=>t.type===txnType).forEach(t=>{const key=t.categoryLabel||(CAT[t.cat]||CAT.other).n;frequent.set(key,(frequent.get(key)||0)+1);});
  const values=[...select.options].map(o=>o.value).sort((a,b)=>(frequent.get(b)||0)-(frequent.get(a)||0)).slice(0,5);
  root.innerHTML=values.map(name=>`<button type="button" data-category="${esc(name)}" aria-pressed="${select.value===name}">${esc(name)}</button>`).join('');
  root.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{select.value=b.dataset.category;renderQuickCategories();}));
}
$('inp-cat').addEventListener('change',renderQuickCategories);

// Native dialog gives focus containment, Escape support and a mobile bottom sheet.
const workspaceDialog=document.createElement('dialog');
workspaceDialog.id='workspaceDialog';workspaceDialog.className='workspace-dialog';workspaceDialog.setAttribute('aria-labelledby','workspaceDialogTitle');
document.body.appendChild(workspaceDialog);
workspaceDialog.addEventListener('click',e=>{if(e.target===workspaceDialog){const r=workspaceDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeWorkspaceDialog();}});
workspaceDialog.addEventListener('close',()=>{if(workspaceDialogTrigger?.isConnected)workspaceDialogTrigger.focus({preventScroll:true});});
function showWorkspaceDialog(title,description,body){
  workspaceDialogTrigger=document.activeElement;
  workspaceDialog.innerHTML=`<header><div><h2 id="workspaceDialogTitle">${esc(title)}</h2><p>${esc(description)}</p></div><button class="dialog-close" onclick="closeWorkspaceDialog()" aria-label="Đóng">×</button></header>${body}`;
  workspaceDialog.showModal();
}
function closeWorkspaceDialog(){if(!workspaceDialog.querySelector('[aria-busy="true"]'))workspaceDialog.close();}
workspaceDialog.addEventListener('cancel',e=>{if(workspaceDialog.querySelector('[aria-busy="true"]'))e.preventDefault();});
function openTransactionDetail(index){
  const t=transactionDetailRows[index];if(!t)return;
  showWorkspaceDialog('Chi tiết giao dịch',t.name,`<div class="transaction-detail-amount">${t.type==='income'?'+':'−'}${fmtFull(t.amount)}</div><dl class="transaction-detail">${[['Loại',t.type==='income'?'Thu nhập':'Chi tiêu'],['Ngày',new Intl.DateTimeFormat('vi-VN',{dateStyle:'long'}).format(new Date(t.date+'T12:00:00'))],['Danh mục',t.categoryLabel||(CAT[t.cat]||CAT.other).n],['Tài khoản',t.account||'Chưa phân loại'],['Ghi chú',t.note||'Không có ghi chú']].map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><footer><button class="workspace-secondary" onclick="closeWorkspaceDialog()">Đóng</button></footer>`);
}
function openBudgetEditor(index){
  budgetEditorMonth=workspaceMonth();
  const names=[...budgets.map(b=>b.n),...sheetCategories.expense,...monthTxns().filter(t=>t.type==='expense').map(t=>t.categoryLabel||(CAT[t.cat]||CAT.other).n)];
  budgetEditorCategories=[...new Map((names.length?names:FALLBACK_CATEGORIES.expense).map(n=>[normalizeKey(n),n])).values()].slice(0,80);
  showWorkspaceDialog('Ngân sách tháng '+(curMo.getMonth()+1),`Đặt giới hạn chi cho tháng ${curMo.getMonth()+1}/${curMo.getFullYear()}. Để trống danh mục chưa cần theo dõi.`, `<form id="budgetEditor" onsubmit="saveWorkspaceBudget(event)"><div class="budget-editor-tools"><span>Danh mục</span><span>Hạn mức / ₫</span></div><div class="budget-editor-rows">${budgetEditorCategories.map((n,i)=>{const b=budgets.find(b=>normalizeKey(b.n)===normalizeKey(n));return `<label class="budget-editor-row" for="budgetAmount${i}"><span>${esc(n)}</span><input id="budgetAmount${i}" name="amount${i}" type="text" inputmode="numeric" autocomplete="off" placeholder="Chưa đặt" value="${b?new Intl.NumberFormat('vi-VN').format(b.total):''}" oninput="fmtAmt(this);updateBudgetEditorTotal()"></label>`;}).join('')}</div><div class="budget-editor-add"><label for="newBudgetCategory">Thêm danh mục</label><div><input id="newBudgetCategory" maxlength="80" placeholder="Ví dụ: Du lịch…" autocomplete="off"><button type="button" class="workspace-secondary" onclick="addBudgetEditorCategory()">Thêm</button></div></div><p class="budget-editor-error" id="budgetEditorError" role="alert"></p><footer><div><span>Tổng ngân sách</span><strong id="budgetEditorTotal">₫0</strong></div><button class="workspace-add" id="saveBudgetButton" type="submit">Lưu ngân sách</button></footer><p class="budget-editor-note">Ngân sách được lưu trong Gambit và đồng bộ giữa các thiết bị. Bảng tính gốc được giữ nguyên.</p></form>`);
  updateBudgetEditorTotal();
  if(Number.isInteger(index)&&budgets[index]){
    const field=budgetEditorCategories.findIndex(n=>normalizeKey(n)===normalizeKey(budgets[index].n));$('budgetAmount'+field)?.focus();
  }
}
function addBudgetEditorCategory(){
  const input=$('newBudgetCategory'),name=input.value.trim();if(!name)return;
  if(budgetEditorCategories.some(n=>normalizeKey(n)===normalizeKey(name))){$('budgetEditorError').textContent='Danh mục này đã có trong danh sách.';return;}
  if(budgetEditorCategories.length>=80){$('budgetEditorError').textContent='Bạn có thể theo dõi tối đa 80 danh mục.';return;}
  const i=budgetEditorCategories.length;budgetEditorCategories.push(name);
  const label=document.createElement('label');label.className='budget-editor-row';label.htmlFor='budgetAmount'+i;
  label.innerHTML=`<span>${esc(name)}</span><input id="budgetAmount${i}" name="amount${i}" type="text" inputmode="numeric" autocomplete="off" placeholder="Chưa đặt" oninput="fmtAmt(this);updateBudgetEditorTotal()">`;
  workspaceDialog.querySelector('.budget-editor-rows').appendChild(label);input.value='';$('budgetEditorError').textContent='';label.querySelector('input').focus();
}
function budgetEditorRows(){return budgetEditorCategories.map((name,i)=>({name,amount:parseAmt($('budgetAmount'+i).value)})).filter(r=>r.amount>0);}
function updateBudgetEditorTotal(){$('budgetEditorTotal').textContent=fmtFull(budgetEditorRows().reduce((sum,r)=>sum+r.amount,0));$('budgetEditorError').textContent='';}
async function saveWorkspaceBudget(event){
  event.preventDefault();const button=$('saveBudgetButton');if(button.disabled)return;
  const rows=budgetEditorRows(),plan={rows,updatedAt:Date.now(),synced:false};
  if(!rows.length){$('budgetEditorError').textContent='Nhập hạn mức cho ít nhất một danh mục.';return;}
  if(!validWorkspacePlan(plan)){$('budgetEditorError').textContent='Hạn mức mỗi danh mục tối đa 10 tỷ đồng.';return;}
  const month=budgetEditorMonth;
  try{localStorage.setItem(WORKSPACE_PLAN_STORE,JSON.stringify({...workspacePlans,[month]:plan}));}catch{$('budgetEditorError').textContent='Không thể lưu trên thiết bị. Hãy kiểm tra dung lượng trình duyệt và thử lại.';return;}
  workspacePlans[month]=plan;button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Đang lưu…';
  const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),8000);
  try{
    const response=await fetch('/api/cloud?key=finance_budget_'+month,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(plan),signal:abort.signal});
    if(!response.ok)throw Error('sync');const result=await response.json();if(!result.ok)throw Error('sync');
    plan.synced=true;try{localStorage.setItem(WORKSPACE_PLAN_STORE,JSON.stringify(workspacePlans));}catch{}
  }catch{/* A successful local save is explicitly distinguished from a synced save. */}
  finally{clearTimeout(timeout);button.removeAttribute('aria-busy');button.disabled=false;}
  renderAll();closeWorkspaceDialog();showToast(plan.synced?'Đã lưu và đồng bộ ngân sách':'Đã lưu trên thiết bị. Chưa đồng bộ; mở Chỉnh ngân sách để thử lưu lại.');
}
