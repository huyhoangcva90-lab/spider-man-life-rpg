/* Everyday ledger tools. Drafts stay on this device until explicitly submitted. */
const ledgerTools=document.createElement('details');
ledgerTools.className='ledger-tools';
ledgerTools.innerHTML=`<summary>Tìm trong lịch sử & lọc số tiền</summary><div class="report-filters">
<label>Thời gian<select id="ledgerScope"><option value="month">Tháng đang chọn</option><option value="all">Toàn bộ lịch sử thu chi</option><option value="custom">Khoảng ngày</option></select></label>
<label>Từ ngày<input id="ledgerFrom" type="date" disabled></label><label>Đến ngày<input id="ledgerTo" type="date" disabled></label>
<label>Số tiền từ / ₫<input id="ledgerMin" type="number" min="0" step="1" placeholder="Không giới hạn"></label><label>Đến / ₫<input id="ledgerMax" type="number" min="0" step="1" placeholder="Không giới hạn"></label>
<label>Sắp xếp<select id="ledgerSort"><option value="newest">Mới nhất</option><option value="oldest">Cũ nhất</option></select></label></div><p id="ledgerError" role="alert"></p><p class="report-caption">Sổ này gồm thu nhập và chi tiêu. Các khoản trả nợ và gửi tiết kiệm nằm trong Báo cáo.</p>`;
$('exp-filters').after(ledgerTools);
const ledgerMonthCaption=document.createElement('p');ledgerMonthCaption.className='report-caption';document.querySelector('#page-expenses .activity-signals').before(ledgerMonthCaption);
function ledgerRangeRows(){
  const scope=$('ledgerScope').value;
  if(scope==='month')return monthTxns();
  const from=$('ledgerFrom').value,to=$('ledgerTo').value;
  return txns.filter(t=>(t.type==='expense'||t.type==='income')&&(scope==='all'||((!from||t.date>=from)&&(!to||t.date<=to))));
}
function ledgerValidation(){
  const from=$('ledgerFrom').value,to=$('ledgerTo').value,min=$('ledgerMin').value,max=$('ledgerMax').value;
  if($('ledgerScope').value==='custom'&&from&&to&&from>to)return 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.';
  if((min!==''&&Number(min)<0)||(max!==''&&Number(max)<0))return 'Số tiền lọc không được âm.';
  if(min!==''&&max!==''&&Number(min)>Number(max))return 'Số tiền tối thiểu phải nhỏ hơn hoặc bằng tối đa.';
  return '';
}
getFilteredTransactions=function(){
  if(ledgerValidation())return [];
  const q=normalizeKey(activeTxSearch),category=$('categoryFilter').value,account=$('accountFilter').value,min=$('ledgerMin').value,max=$('ledgerMax').value;
  return ledgerRangeRows().filter(t=>{
    const cat=t.categoryLabel||(CAT[t.cat]||CAT.other).n;
    return (activeTxFilter==='all'||t.type===activeTxFilter||t.cat===activeTxFilter)&&(!category||cat===category)&&(!account||t.account===account)&&(!q||normalizeKey([t.name,t.note,cat,t.account,t.amount].join(' ')).includes(q))&&(min===''||t.amount>=Number(min))&&(max===''||t.amount<=Number(max));
  }).sort((a,b)=>$('ledgerSort').value==='oldest'?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
};
refreshTransactionOptions=function(){
  const current=ledgerRangeRows();
  for(const [id,values,label] of [['categoryFilter',current.map(t=>t.categoryLabel||(CAT[t.cat]||CAT.other).n),'Mọi danh mục'],['accountFilter',current.map(t=>t.account).filter(Boolean),'Mọi tài khoản']]){
    const select=$(id),previous=select.value;
    select.innerHTML='<option value="">'+label+'</option>'+[...new Set(values.concat(previous?[previous]:[]))].sort((a,b)=>a.localeCompare(b,'vi')).map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');select.value=previous;
  }
};
const dailyRenderList=renderTransactionList;
renderTransactionList=function(){
  dailyRenderList();ledgerMonthCaption.textContent='Tóm tắt tháng '+(curMo.getMonth()+1)+'/'+curMo.getFullYear();const error=ledgerValidation();$('ledgerError').textContent=error;
  const scope=$('ledgerScope').value;
  $('e-sub').textContent+=' · '+(scope==='all'?'Toàn bộ lịch sử':scope==='custom'?'Khoảng ngày đã chọn':'Tháng đang chọn');
  if(error)$('all-txns').innerHTML='<p class="report-empty">Điều chỉnh bộ lọc để xem giao dịch.</p>';
  else if(!transactionDetailRows.length&&txns.length)$('all-txns').innerHTML=emptyState('Không có giao dịch phù hợp','Thử đổi khoảng ngày, số tiền hoặc danh mục.','Xóa bộ lọc','resetTransactionFilters()');
};
const dailyResetFilters=resetTransactionFilters;
resetTransactionFilters=function(){ $('ledgerScope').value='month';['ledgerFrom','ledgerTo','ledgerMin','ledgerMax'].forEach(id=>$(id).value='');$('ledgerSort').value='newest';$('ledgerFrom').disabled=$('ledgerTo').disabled=true;dailyResetFilters();refreshTransactionOptions();};
ledgerTools.querySelectorAll('input,select').forEach(el=>el.addEventListener('change',()=>{const custom=$('ledgerScope').value==='custom';$('ledgerFrom').disabled=$('ledgerTo').disabled=!custom;refreshTransactionOptions();renderTransactionList();}));

const DRAFT_KEY='gambit_transaction_draft_v1';
let restoringDraft=false;
const draftFields=['inp-name','inp-amt','inp-cat','inp-account','inp-date','inp-note'];
let transactionDraft=null;
try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');if(d&&['expense','income'].includes(d.type)&&draftFields.every(id=>typeof d[id]==='string'&&d[id].length<=4000))transactionDraft=d;}catch{}
const draftBar=document.createElement('div');draftBar.className='draft-bar';draftBar.innerHTML='<span id="draftStatus" role="status"></span><button type="button" id="discardDraft" class="workspace-secondary">Xóa bản nháp</button>';$('mbox').appendChild(draftBar);
function captureTransactionDraft(){
  if(restoringDraft||$('saveTxnBtn').disabled)return;
  const d={type:txnType};draftFields.forEach(id=>d[id]=$(id).value);
  if(!d['inp-name'].trim()&&!d['inp-amt'].trim()&&!d['inp-note'].trim()){clearTransactionDraft();return;}
  transactionDraft=d;
  try{localStorage.setItem(DRAFT_KEY,JSON.stringify(d));$('draftStatus').textContent='Bản nháp trên thiết bị · chưa ghi vào Sheet';}catch{$('draftStatus').textContent='Bản nháp chỉ giữ khi trang còn mở.';}
}
function clearTransactionDraft(){transactionDraft=null;try{localStorage.removeItem(DRAFT_KEY);}catch{}$('draftStatus').textContent='';}
draftFields.forEach(id=>$(id).addEventListener('input',captureTransactionDraft));
draftFields.forEach(id=>$(id).addEventListener('change',captureTransactionDraft));
const dailySetTT=setTT;setTT=function(type){dailySetTT(type);if($('ovl').classList.contains('open'))captureTransactionDraft();};
const dailyOpenModal=openModal;
openModal=function(){
  const draft=transactionDraft;restoringDraft=true;try{dailyOpenModal();}finally{restoringDraft=false;}
  if(!draft){$('draftStatus').textContent='';return;}
  dailySetTT(draft.type);draftFields.forEach(id=>$(id).value=draft[id]);
  document.querySelector('.transaction-note').open=!!draft['inp-note'];renderQuickCategories();
  $('draftStatus').textContent='Đã khôi phục bản nháp · chưa ghi vào Sheet';
};
$('discardDraft').addEventListener('click',()=>{clearTransactionDraft();dailyOpenModal();$('inp-amt').focus();});
const dailyCloseModal=closeModal;closeModal=function(){captureTransactionDraft();dailyCloseModal();};
const dailySaveTxn=saveTxn;saveTxn=async function(){await dailySaveTxn();if(!$('ovl').classList.contains('open'))clearTransactionDraft();};
const dailyDetail=openTransactionDetail;
openTransactionDetail=function(index){
  dailyDetail(index);const t=transactionDetailRows[index];if(!t)return;
  const button=document.createElement('button');button.className='workspace-secondary';button.textContent='Ghi giao dịch tương tự';
  button.addEventListener('click',()=>{
    if(transactionDraft){showToast('Bạn đang có bản nháp. Hoàn tất hoặc xóa bản nháp trước khi ghi giao dịch tương tự.');closeWorkspaceDialog();openModal();return;}
    closeWorkspaceDialog();dailyOpenModal();dailySetTT(t.type);
    $('inp-name').value=t.name;$('inp-amt').value=String(t.amount);fmtAmt($('inp-amt'));$('inp-cat').value=t.categoryLabel||(CAT[t.cat]||CAT.other).n;$('inp-account').value=t.account||'';$('inp-note').value=t.note||'';
    const today=new Date();$('inp-date').value=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
    document.querySelector('.transaction-note').open=!!t.note;renderQuickCategories();captureTransactionDraft();$('inp-amt').focus();
  });workspaceDialog.querySelector('footer').prepend(button);
};
