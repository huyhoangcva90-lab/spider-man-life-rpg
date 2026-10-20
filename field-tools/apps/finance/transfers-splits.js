/* Companion ledgers: transfers are neutral; splits allocate one original expense. */
let ledgerSnapshot=null,ledgerSnapshotBusy=false;
const transferCard=document.createElement('section');transferCard.className='instrument-card ledger-companion';transferCard.id='transferLedger';
transferCard.innerHTML='<div class="instrument-title"><div><strong>Chuyển giữa các ví</strong><small>Ghi nhận tiền đã chuyển, không thực hiện chuyển tiền ngân hàng</small></div><button class="workspace-add" id="newTransfer">＋ Ghi chuyển ví</button></div><p id="ledgerConnection" class="report-caption" role="status">Đang kiểm tra kết nối sổ chuyển ví…</p><div class="report-filters"><label>Hiển thị<select id="transferPeriod"><option value="month">Tháng đang chọn</option><option value="all">Toàn bộ lịch sử</option></select></label><button class="workspace-secondary" id="reloadCompanion">Tải lại</button></div><div id="transferRows"></div><div id="transferMovement"></div><p class="report-caption">Hai phía chuyển ví không tính vào thu, chi hay tổng tài sản. Số dư tài khoản vẫn đọc từ Settings; sổ này chưa tự điều chỉnh số dư đó. Phí chuyển tiền cần ghi thành khoản chi riêng.</p>';
document.querySelector('#page-networth').appendChild(transferCard);
const transferShortcut=document.createElement('button');transferShortcut.textContent='Chuyển ví';transferShortcut.className='workspace-secondary';transferShortcut.addEventListener('click',()=>{transferCard.scrollIntoView({block:'start',behavior:'smooth'});});document.querySelector('#page-networth .workspace-tabs').appendChild(transferShortcut);
const splitNotice=document.createElement('p');splitNotice.className='report-caption';splitNotice.id='splitConnectionNote';reportHost.prepend(splitNotice);
function companionReady(feature){return !!ledgerSnapshot?.features?.includes(feature);}
function activeTransfers(){return (ledgerSnapshot?.transfers||[]).filter(e=>!e.data.deleted).sort((a,b)=>b.data.date.localeCompare(a.data.date));}
function renderTransferLedger(){
  splitNotice.hidden=!companionReady('splits');
  const ready=companionReady('transfers');$('newTransfer').disabled=!ready;
  const month=workspaceMonth().replace('_','-'),rows=activeTransfers().filter(e=>$('transferPeriod').value==='all'||e.data.date.startsWith(month));
  $('transferRows').innerHTML=rows.map((e,i)=>`<button class="report-breakdown" data-transfer="${i}"><span>${esc(e.data.account)} → ${esc(e.data.toAccount)}<small>${e.data.date}${e.data.note?' · '+esc(e.data.note):''}</small></span><b>${fmtFull(e.data.amount)}</b></button>`).join('')||`<p class="report-empty">${ready?'Chưa có chuyển ví trong kỳ.':'Bật kết nối chỉnh sửa trong Cài đặt để dùng sổ chuyển ví.'}</p>`;
  $('transferRows').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>showTransferDetail(rows[Number(b.dataset.transfer)])));
  const accounts=[...new Set(rows.flatMap(e=>[e.data.account,e.data.toAccount]))];
  $('transferMovement').innerHTML=accounts.length?'<h3 class="report-caption">Biến động do chuyển ví trong kỳ</h3>'+accounts.map(account=>`<div class="report-breakdown"><span>${esc(account)}</span><b>${reportMoney(FinanceCore.transferMovements(rows,account))}</b></div>`).join(''):'';
  const count=(ledgerSnapshot?.splits||[]).filter(s=>s.data.parts?.length>1).length;
  const stale=(ledgerSnapshot?.splits||[]).filter(s=>s.data.parts?.length>1&&!ledgerSnapshot.transactions.some(t=>t.id===s.id&&t.revision===s.data.sourceRevision)).length;
  splitNotice.textContent=companionReady('splits')?`Phân bổ danh mục đã kết nối · ${count-stale} khoản đã chia${stale?' · '+stale+' khoản gốc đã thay đổi, cần chia lại':''}. Sổ giao dịch giữ khoản gốc; ngân sách và báo cáo dùng các phần đã chia.`:'Báo cáo đang dùng danh mục gốc từ Sheet. Chưa kết nối dữ liệu chia danh mục.';
}
async function refreshCompanionLedger(){
  if(ledgerSnapshotBusy)return;ledgerSnapshotBusy=true;$('reloadCompanion').disabled=true;
  try{const r=await bridgeRequest({action:'snapshot'});ledgerSnapshot=r.data;sheetBridgeData=r.data;$('ledgerConnection').textContent=companionReady('transfers')?'Đã kết nối sổ chuyển ví và phân bổ danh mục.':'Cần cập nhật GambitBridge trong Apps Script để bật chuyển ví và chia danh mục.';}
  catch(e){ledgerSnapshot=null;$('ledgerConnection').textContent=e.message;}
  finally{ledgerSnapshotBusy=false;$('reloadCompanion').disabled=false;renderAll();renderTransferLedger();}
}
$('reloadCompanion').addEventListener('click',refreshCompanionLedger);$('transferPeriod').addEventListener('change',renderTransferLedger);
const originalMonthForSplits=monthTxns;
monthTxns=function(){return FinanceCore.splitRows(originalMonthForSplits(),ledgerSnapshot).map(t=>t.splitSourceId?{...t,cat:shMapCat(t.categoryLabel,t.type)}:t);};
// The transaction register and its export retain original rows, not synthetic copies.
const originalLedgerRange=ledgerRangeRows;
ledgerRangeRows=function(){return $('ledgerScope').value==='month'?originalMonthForSplits():originalLedgerRange();};
const originalReportForSplits=reportAllRows;
reportAllRows=function(){return FinanceCore.splitRows(originalReportForSplits(),ledgerSnapshot);};
const companionRenderHome=renderWorkspaceHome;renderWorkspaceHome=function(){companionRenderHome();renderTransferLedger();};
const companionLoadBridge=loadSheetBridge;loadSheetBridge=async function(){await companionLoadBridge();ledgerSnapshot=sheetBridgeData;renderAll();renderTransferLedger();};
$('bridgeCheck').removeEventListener('click',companionLoadBridge);$('bridgeCheck').addEventListener('click',loadSheetBridge);
const companionConnect=shConnect;shConnect=async function(...args){await companionConnect(...args);await refreshCompanionLedger();};
function openTransferForm(){
  if(!companionReady('transfers'))return;
  const options=ledgerSnapshot.accounts.map(a=>`<option value="${esc(a.account)}">${esc(a.account)}</option>`).join('');
  if(ledgerSnapshot.accounts.length<2){showToast('Cần ít nhất hai tài khoản trong Settings để ghi chuyển ví.');return;}
  const now=new Date(),day=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-'),id=crypto.randomUUID();
  showWorkspaceDialog('Ghi chuyển ví','Ghi lại khoản tiền bạn đã chuyển giữa hai tài khoản của mình.',`<form id="transferForm"><div class="report-filters"><label>Từ ví<select name="account">${options}</select></label><label>Đến ví<select name="toAccount">${options}</select></label><label>Số tiền / ₫<input name="amount" type="number" min="1" max="10000000000" step="1" required></label><label>Ngày<input name="date" type="date" required value="${day}"></label><label>Ghi chú<input name="note" maxlength="2000"></label></div><p id="companionFormError" role="alert"></p><footer><button class="workspace-add" type="submit">Lưu sổ chuyển ví</button></footer></form>`);
  const form=$('transferForm');form.elements.toAccount.selectedIndex=1;
  form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));saveCompanion(form,{action:'transfer.save',transfer:{id,...data,amount:Number(data.amount)}});});
}
$('newTransfer').addEventListener('click',openTransferForm);
async function saveCompanion(form,payload){
  if(form.getAttribute('aria-busy')==='true')return;
  form.setAttribute('aria-busy','true');form.querySelectorAll('button,input,select').forEach(el=>el.disabled=true);
  try{const r=await bridgeRequest(payload);form.removeAttribute('aria-busy');closeWorkspaceDialog();showToast(r.message);await refreshCompanionLedger();}
  catch(e){$('companionFormError').textContent=e.message+' Nếu mất kết nối, thử lại trong cửa sổ này để giữ nguyên mã giao dịch.';}
  finally{form.removeAttribute('aria-busy');form.querySelectorAll('button,input,select').forEach(el=>el.disabled=false);}
}
function showTransferDetail(entry){
  const t=entry.data;showWorkspaceDialog('Chi tiết chuyển ví',t.date,`<p class="transaction-detail-amount">${fmtFull(t.amount)}</p><p>${esc(t.account)} → ${esc(t.toAccount)}</p><p class="report-caption">${esc(t.note||'Không có ghi chú')}</p><form id="transferDeleteForm"><p id="companionFormError" role="alert"></p><footer><button type="button" id="confirmTransferDelete" class="workspace-secondary">Xóa bản ghi chuyển ví</button></footer></form>`);
  let confirm=false;$('confirmTransferDelete').addEventListener('click',()=>{if(!confirm){confirm=true;$('confirmTransferDelete').textContent='Xác nhận xóa bản ghi';$('companionFormError').textContent='Chỉ xóa khỏi sổ Gambit, không hoàn tác tiền đã chuyển ngoài ngân hàng.';return;}saveCompanion($('transferDeleteForm'),{action:'transfer.delete',transfer:{id:entry.id,revision:entry.revision}});});
}
const companionDetail=openTransactionDetail;
openTransactionDetail=function(index){companionDetail(index);const t=transactionDetailRows[index];if(!t||t.type!=='expense')return;const b=document.createElement('button');b.className='workspace-secondary';b.textContent='Chia danh mục';b.addEventListener('click',()=>openSplitForm(t));workspaceDialog.querySelector('footer').prepend(b);};
function openSplitForm(t){
  if(!companionReady('splits')){closeWorkspaceDialog();goP('sheets',null);$('bridgeStatus').textContent='Kiểm tra kết nối chỉnh sửa để bật chia danh mục. Cần bản GambitBridge có hỗ trợ splits.';return;}
  const matches=ledgerSnapshot.transactions.filter(r=>FinanceCore.sourceKey(r)===FinanceCore.sourceKey(t));
  if(matches.length!==1){showToast('Không xác định được duy nhất giao dịch gốc. Đồng bộ lại trước khi chia.');return;}
  const source=matches[0],entry=ledgerSnapshot.splits.find(s=>s.id===source.id),valid=entry?.data.sourceRevision===source.revision;
  const categories=[...new Set(sheetCategories.expense.concat(source.category))];
  const initial=valid&&entry.data.parts.length?entry.data.parts:[{category:source.category,amount:source.amount},{category:categories.find(c=>c!==source.category)||'',amount:0}];
  showWorkspaceDialog('Chia danh mục',source.content+' · '+fmtFull(source.amount),'<form id="splitForm"><p class="report-caption">Giữ nguyên giao dịch gốc trên Sheet và Notion. Các phần chia được lưu riêng và dùng trong ngân sách, biểu đồ của Gambit.</p><div id="splitParts"></div><button type="button" class="workspace-secondary" id="addSplitPart">＋ Thêm phần</button><p id="splitRemainder" role="status"></p><p id="companionFormError" role="alert"></p><footer><button type="button" class="workspace-secondary" id="removeSplit">Dùng lại danh mục gốc</button><button class="workspace-add" type="submit">Lưu phân bổ</button></footer></form>');
  const form=$('splitForm');
  function appendPart(p){const row=document.createElement('div');row.className='split-part';row.innerHTML=`<label>Danh mục<select>${categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label><label>Số tiền / ₫<input type="number" min="1" max="10000000000" step="1" required value="${p.amount||''}"></label><button type="button" class="workspace-secondary" aria-label="Bỏ phần này">×</button>`;row.querySelector('select').value=p.category;row.querySelector('button').addEventListener('click',()=>{row.remove();update();});row.querySelector('input').addEventListener('input',update);$('splitParts').appendChild(row);}
  function parts(){return Array.from($('splitParts').children).map(row=>({category:row.querySelector('select').value,amount:Number(row.querySelector('input').value)}));}
  function update(){const left=source.amount-parts().reduce((s,p)=>s+p.amount,0);$('splitRemainder').textContent=left===0?'Đã phân bổ đủ '+fmtFull(source.amount):(left>0?'Còn chưa chia: ':'Vượt số tiền gốc: ')+fmtFull(Math.abs(left));$('addSplitPart').disabled=parts().length>=12;}
  initial.forEach(appendPart);update();$('addSplitPart').addEventListener('click',()=>{if(parts().length<12){appendPart({category:categories.find(c=>!parts().some(p=>p.category===c))||'',amount:0});update();}});
  form.addEventListener('submit',e=>{e.preventDefault();const list=parts();if(list.length<2||list.some(p=>!p.category||!Number.isSafeInteger(p.amount)||p.amount<=0)||new Set(list.map(p=>p.category)).size!==list.length||list.reduce((s,p)=>s+p.amount,0)!==source.amount){$('companionFormError').textContent='Chọn ít nhất hai danh mục khác nhau; tổng các phần phải bằng giao dịch gốc.';return;}saveCompanion(form,{action:'split.save',transaction:source,split:{revision:entry?.revision,parts:list}});});
  $('removeSplit').disabled=!entry?.data.parts.length;$('removeSplit').addEventListener('click',()=>saveCompanion(form,{action:'split.delete',transaction:source,split:{revision:entry?.revision}}));
}
renderTransferLedger();
