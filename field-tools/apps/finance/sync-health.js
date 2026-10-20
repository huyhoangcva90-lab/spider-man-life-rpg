/* Observe the existing Sheets -> Apps Script -> Notion pipeline, never duplicate it. */
const notionHealthCard=document.createElement('section');notionHealthCard.className='instrument-card ledger-companion';
notionHealthCard.innerHTML='<div class="instrument-title"><div><strong>Đồng bộ sang Notion</strong><small>Điện thoại → Google Sheets → Apps Script → Notion</small></div><button class="workspace-secondary" id="checkNotionPipeline">Kiểm tra trạng thái</button></div><p class="report-caption">Gambit dùng Google Sheets làm sổ gốc. Notion tiếp tục nhận dữ liệu qua Apps Script hiện tại.</p><div id="notionPipelineStatus" role="status"></div><p class="report-caption">Trạng thái bên dưới đọc từ Sheet và cấu hình Apps Script, không phải kiểm tra trực tiếp từng trang Notion. Mục tiêu vẫn đọc từ Target.</p><a class="workspace-secondary" href="https://www.notion.so/272d787636c681beab10c44f1bc65d09" target="_blank" rel="noopener">Mở Finance trên Notion ↗</a>';
document.querySelector('#page-sheets').appendChild(notionHealthCard);
function renderNotionPipeline(){
  const s=ledgerSnapshot?.notionSync,root=$('notionPipelineStatus');
  if(!s){root.innerHTML='<p class="report-caption">Chưa đọc được trạng thái đồng bộ. Cần cập nhật GambitBridge và bật kết nối chỉnh sửa để kiểm tra.</p>';return;}
  const automation=s.immediate?'Có thử đồng bộ ngay sau khi thêm thu/chi':s.triggerCount===null?'Chưa xác minh được lịch chạy':s.triggerCount>0?'Có '+s.triggerCount+' lịch chạy syncToNotion':'Chưa thấy lịch tự động syncToNotion trong tài khoản thực thi';
  root.innerHTML=`<p class="report-caption">${s.configured?'Apps Script đã có cấu hình token Notion':'Apps Script chưa có token Notion'} · ${esc(automation)}</p>${s.flows.map(f=>`<div class="report-breakdown"><span>${f.type==='income'?'Thu nhập':'Chi tiêu'}<small>${f.total} dòng nguồn</small></span><span><b>${f.done} đã đánh dấu Done</b><small>${f.pending} chờ · ${f.missingRelations} thiếu liên kết danh mục/tài khoản</small></span></div>`).join('')}<p class="report-caption">Kiểm tra lúc ${esc(new Date(s.checkedAt).toLocaleString('vi-VN'))}. Debt, Saves, chuyển ví và phân bổ danh mục chưa nằm trong luồng đồng bộ Notion hiện tại.</p>`;
}
const healthRenderTransfers=renderTransferLedger;renderTransferLedger=function(){healthRenderTransfers();renderNotionPipeline();};
$('checkNotionPipeline').addEventListener('click',async()=>{const button=$('checkNotionPipeline');button.disabled=true;try{await refreshCompanionLedger();renderNotionPipeline();}finally{button.disabled=false;}});
renderNotionPipeline();
