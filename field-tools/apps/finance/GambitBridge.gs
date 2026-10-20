// Add this file to the EXISTING Apps Script project. See SHEETS-CONNECTION.md.
// No Telegram/Notion credentials belong in this file or in the browser.
function gambitCapabilities_() { return jsonOutput_({ok:true,protocol:2}); }
function gambitHash_(value) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(value)));
}
function gambitCell_(value) { var s=String(value||'').trim(); return /^[=+@-]/.test(s)?"'"+s:s; }
function gambitFail_(message,code) { var error=new Error(message);error.gambitCode=code||'invalid_request';throw error; }
function gambitDate_(s) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s)))gambitFail_('Ngày phải theo dạng yyyy-MM-dd.');
  var d=Utilities.parseDate(s+' 12:00:00',TZ,'yyyy-MM-dd HH:mm:ss');
  if(Utilities.formatDate(d,TZ,'yyyy-MM-dd')!==s)gambitFail_('Ngày không hợp lệ.');return d;
}
function gambitSnapshot_(ss) {
  var transactions=[];
  ['income','expense','debt','saves'].forEach(function(type){
    var sh=getTransactionSheet_(ss,type,false);if(!sh)return;
    var last=getNextRow(sh)-1;if(last<10)return;
    sh.getRange(10,8,last-9,6).getValues().forEach(function(row,i){
      if(!row[0])return;var day=_safeDate(row[0]);if(!day)return;
      transactions.push({id:type+':'+(i+10),row:i+10,revision:gambitHash_(row),type:type,date:day,content:String(row[1]||''),category:String(row[2]||''),amount:Math.abs(toNumber_(row[3])),account:String(row[4]||''),note:String(row[5]||'')});
    });
  });
  var target=readStructuredTargetPlan_(getTargetSheet_(ss));
  return {notionSync:gambitNotionStatus_(ss),features:['transfers','splits'],transfers:gambitLedgerEntries_(ss,'_GambitTransfers'),splits:gambitLedgerEntries_(ss,'_GambitSplits'),transactions:transactions,entities:gambitEntities_(ss),targetPlans:target.plans,targetRevision:gambitHash_(target.plans),targetYear:Number(PropertiesService.getScriptProperties().getProperty('GAMBIT_TARGET_YEAR')||new Date().getFullYear()),accounts:readAccountPlan_(getSettingsSheet_(ss))};
}
function gambitNotionStatus_(ss) {
  var status={checkedAt:new Date().toISOString(),source:'sheet-status',configured:typeof NOTION_TOKEN!=='undefined'&&!!NOTION_TOKEN,immediate:typeof AUTO_SYNC_NOTION!=='undefined'&&!!AUTO_SYNC_NOTION,triggerCount:null,flows:[]};
  try{status.triggerCount=ScriptApp.getProjectTriggers().filter(function(t){return t.getHandlerFunction()==='syncToNotion';}).length;}catch(ignore){}
  ['income','expense'].forEach(function(type){
    var sh=getTransactionSheet_(ss,type,false),flow={type:type,total:0,done:0,pending:0,missingRelations:0};
    if(sh){var last=getNextRow(sh)-1;if(last>=10)sh.getRange(10,8,last-9,9).getValues().forEach(function(r){
      if(!r[0])return;flow.total++;
      if(String(r[8]||'').trim()==='Done')flow.done++;
      else if(!String(r[6]||'').trim()||!String(r[7]||'').trim())flow.missingRelations++;
      else flow.pending++;
    });}
    status.flows.push(flow);
  });return status;
}
// Companion ledgers preserve the existing worksheet formulas and Notion records.
function gambitLedgerEntries_(ss,name) {
  var sh=ss.getSheetByName(name);if(!sh||sh.getLastRow()<2)return [];
  return sh.getRange(2,1,sh.getLastRow()-1,3).getValues().filter(function(r){return r[0]&&r[1];}).map(function(r,i){return {id:String(r[0]),revision:gambitHash_(r),data:JSON.parse(r[1])};});
}
function gambitLedgerWrite_(ss,name,id,data,revision,immutable) {
  var sh=ss.getSheetByName(name),rows=sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,3).getValues():[];
  var index=rows.findIndex(function(r){return String(r[0])===id;}),old=index>=0?JSON.parse(rows[index][1]):null;
  // Identical retries are successful without a second write. Tombstones stop late recreation.
  if(old&&JSON.stringify(old)===JSON.stringify(data))return;
  if(old&&old.deleted&&!data.deleted)gambitFail_('Bản ghi đã bị xóa. Tải lại trước khi tạo mới.','conflict');
  if(index>=0&&(gambitHash_(rows[index])!==revision||immutable&&!data.deleted))gambitFail_('Dữ liệu đã thay đổi. Tải lại rồi thử lại.','conflict');
  if(index<0&&(revision||data.deleted))gambitFail_('Không tìm thấy bản ghi.','conflict');
  if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,3).setValues([['ID','Data','Updated at']]);}
  sh.getRange(index<0?Math.max(2,sh.getLastRow()+1):index+2,1,1,3).setValues([[id,JSON.stringify(data),new Date().toISOString()]]);
}
function gambitTransfer_(ss,input) {
  var t=input.transfer||{},id=String(t.id||'');if(!/^[\w-]{8,80}$/.test(id))gambitFail_('Mã chuyển tiền không hợp lệ.');
  if(input.action==='transfer.delete'){gambitLedgerWrite_(ss,'_GambitTransfers',id,{deleted:true},t.revision,true);return;}
  gambitDate_(t.date);var accounts=readAccountPlan_(getSettingsSheet_(ss)).map(function(a){return a.account;});
  if(t.account===t.toAccount||accounts.indexOf(t.account)<0||accounts.indexOf(t.toAccount)<0)gambitFail_('Chọn hai tài khoản khác nhau có trong Settings.');
  if(!Number.isSafeInteger(t.amount)||t.amount<=0||t.amount>1e10||String(t.note||'').length>2000)gambitFail_('Kiểm tra số tiền và ghi chú.');
  gambitLedgerWrite_(ss,'_GambitTransfers',id,{type:'transfer',date:t.date,account:t.account,toAccount:t.toAccount,amount:t.amount,note:String(t.note||'')},t.revision,true);
}
function gambitSplit_(ss,input) {
  var t=input.transaction||{},split=input.split||{};
  if(t.type!=='expense'||!Number.isInteger(t.row)||t.row<10)gambitFail_('Chỉ phân bổ giao dịch chi tiêu đã có trên Sheet.');
  var sh=getTransactionSheet_(ss,'expense',true);if(t.row>sh.getMaxRows())gambitFail_('Giao dịch không còn tồn tại.','conflict');
  var row=sh.getRange(t.row,8,1,6).getValues()[0];
  if(!row[0]||gambitHash_(row)!==t.revision)gambitFail_('Giao dịch gốc đã thay đổi. Tải lại trước khi phân bổ.','conflict');
  var id='expense:'+t.row;
  if(input.action==='split.delete'){
    // Empty allocation removes the split while keeping a revision for subsequent edits.
    gambitLedgerWrite_(ss,'_GambitSplits',id,{sourceRevision:t.revision,parts:[]},split.revision,false);return;
  }
  if(!Array.isArray(split.parts)||split.parts.length<2||split.parts.length>12)gambitFail_('Chia thành 2 đến 12 danh mục.');
  var valid=getValidCategoriesForType_(ss,getSettingsSheet_(ss),'expense'),seen={},total=0;
  var parts=split.parts.map(function(p){var category=resolveCategory_(p.category,valid),key=normalizeHeader_(category);
    if(!valid.some(function(c){return normalizeHeader_(c)===key;})||seen[key])gambitFail_('Chọn danh mục hợp lệ và không lặp.');
    if(!Number.isSafeInteger(p.amount)||p.amount<=0||p.amount>1e10)gambitFail_('Mỗi phần phải là số tiền dương, nguyên đồng.');
    seen[key]=true;total+=p.amount;return {category:category,amount:p.amount};});
  if(total!==Math.abs(toNumber_(row[3])))gambitFail_('Tổng các phần phải bằng đúng số tiền giao dịch gốc.');
  gambitLedgerWrite_(ss,'_GambitSplits',id,{sourceRevision:t.revision,parts:parts},split.revision,false);
}
function gambitEntities_(ss) {
  var sh=ss.getSheetByName('_GambitPlans');if(!sh||sh.getLastRow()<2)return [];
  return sh.getRange(2,1,sh.getLastRow()-1,3).getValues().filter(function(r){return /^[\w-]{8,80}$/.test(String(r[0]))&&r[1];}).map(function(r){return {id:String(r[0]),revision:gambitHash_(r),data:JSON.parse(r[1])};});
}
function gambitSaveEntity_(ss,input) {
  var entity=input.entity||{},data=entity.data||{},kinds=['goal','recurring'];
  if(!/^[\w-]{8,80}$/.test(String(entity.id||'')))gambitFail_('Mã kế hoạch không hợp lệ.');
  var sh=ss.getSheetByName('_GambitPlans'),rows=sh&&sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,3).getValues():[],index=rows.findIndex(function(r){return r[0]===entity.id;});
  if(index>=0&&gambitHash_(rows[index])!==entity.revision)gambitFail_('Kế hoạch đã thay đổi. Tải lại trước khi lưu.','conflict');
  if(index<0&&entity.revision)gambitFail_('Kế hoạch không còn tồn tại.','conflict');
  if(input.action==='entity.delete'){if(index<0)gambitFail_('Không tìm thấy kế hoạch.');sh.getRange(index+2,1,1,3).clearContent();return;}
  if(kinds.indexOf(data.kind)<0||!String(data.name||'').trim()||String(data.name).length>100||typeof data.amount!=='number'||!isFinite(data.amount)||data.amount<=0||data.amount>1e10)gambitFail_('Kiểm tra tên và số tiền kế hoạch.');
  gambitDate_(data.startDate);
  if(data.kind==='recurring'&&['weekly','biweekly','monthly','yearly'].indexOf(data.frequency)<0)gambitFail_('Chu kỳ không hợp lệ.');
  if(data.kind==='goal'){
    gambitDate_(data.endDate);if(data.endDate<data.startDate)gambitFail_('Hạn mục tiêu phải sau ngày bắt đầu.');
    if(!String(data.category||'').trim())gambitFail_('Chọn danh mục tiết kiệm để theo dõi tiến độ.');
  }
  var clean={kind:data.kind,name:String(data.name).trim(),amount:data.amount,startDate:data.startDate,endDate:data.endDate||'',category:String(data.category||'').slice(0,100),frequency:data.frequency||'monthly'};
  if(!sh){sh=ss.insertSheet('_GambitPlans');sh.getRange(1,1,1,3).setValues([['ID','Data','Updated at']]);}
  var next=index<0?Math.max(2,sh.getLastRow()+1):index+2;
  sh.getRange(next,1,1,3).setValues([[entity.id,JSON.stringify(clean),new Date().toISOString()]]);
}
function gambitHandle_(input) {
  var props=PropertiesService.getScriptProperties(),expected=props.getProperty('GAMBIT_API_KEY');
  if(!expected||String(input.api_key||'')!==expected)return jsonOutput_({ok:false,protocol:2,code:'unauthorized',message:'Kết nối chỉnh sửa chưa được xác thực.'});
  var lock=LockService.getScriptLock();
  try {
    lock.waitLock(20000);var ss=SpreadsheetApp.openById(SS_ID);
    if(input.action==='snapshot')return jsonOutput_({ok:true,protocol:2,data:gambitSnapshot_(ss)});
    if(input.action==='transfer.save'||input.action==='transfer.delete'){gambitTransfer_(ss,input);SpreadsheetApp.flush();return jsonOutput_({ok:true,protocol:2,message:'Đã cập nhật sổ chuyển ví.'});}
    if(input.action==='split.save'||input.action==='split.delete'){gambitSplit_(ss,input);SpreadsheetApp.flush();return jsonOutput_({ok:true,protocol:2,message:'Đã cập nhật phân bổ danh mục.'});}
    if(input.action==='entity.save'||input.action==='entity.delete') {gambitSaveEntity_(ss,input);SpreadsheetApp.flush();return jsonOutput_({ok:true,protocol:2,message:'Đã cập nhật kế hoạch trên Sheet.'});}
    if(input.action==='budget.save') {
      var target=getTargetSheet_(ss),current=readStructuredTargetPlan_(target);
      if(!target)gambitFail_('Không tìm thấy Target.');
      if(input.revision!==gambitHash_(current.plans))gambitFail_('Ngân sách đã thay đổi trên Sheet. Tải lại trước khi lưu.','conflict');
      var year=Number(props.getProperty('GAMBIT_TARGET_YEAR')||new Date().getFullYear());
      if(Number(input.year)!==year)gambitFail_('Target hiện dành cho năm '+year+'.');
      if(!Number.isInteger(input.month)||input.month<1||input.month>12||!Array.isArray(input.rows)||input.rows.length>16)gambitFail_('Ngân sách không hợp lệ.');
      var seen={},writes=[];
      input.rows.forEach(function(r){
        var name=normalizeHeader_(r.name),plan=current.plans.filter(function(p){return p.type==='expense'&&normalizeHeader_(p.category)===name;})[0];
        if(!plan||seen[name])gambitFail_('Danh mục chưa có hoặc bị lặp trong Target: '+r.name);
        if(typeof r.amount!=='number'||!isFinite(r.amount)||r.amount<0||r.amount>1e10)gambitFail_('Hạn mức không hợp lệ.');
        seen[name]=true;writes.push({row:plan.rowNumber,amount:r.amount});
      });
      // Validate the whole request before writing. Only the selected month cells change.
      var budgetRange=target.getRange(38,13+input.month,16,1),values=budgetRange.getValues(),formulas=budgetRange.getFormulas();
      values=values.map(function(row,i){return [formulas[i][0]||row[0]];});
      writes.forEach(function(w){values[w.row-38][0]=w.amount;});
      budgetRange.setValues(values);
      SpreadsheetApp.flush();return jsonOutput_({ok:true,protocol:2,message:'Đã cập nhật ngân sách trong Target.'});
    }
    if(input.action==='transaction.save'||input.action==='transaction.delete') {
      var t=input.transaction||{},type=normalizeTransactionType_(t.type);
      if(!type||!Number.isInteger(t.row)||t.row<10)gambitFail_('Thiếu vị trí giao dịch. Hãy tải lại.');
      var sh=getTransactionSheet_(ss,type,true);
      if(t.row>sh.getMaxRows())gambitFail_('Giao dịch không còn tồn tại.','conflict');
      var range=sh.getRange(t.row,8,1,6),old=range.getValues()[0];
      if(!old[0]||gambitHash_(old)!==t.revision)gambitFail_('Giao dịch đã thay đổi. Tải lại trước khi sửa.','conflict');
      if(input.action==='transaction.delete') {
        // Clear the log cells only; never remove a sheet row or shift formulas.
        range.clearContent();
      } else {
        var settings=getSettingsSheet_(ss),valid=getValidCategoriesForType_(ss,settings,type),category=resolveCategory_(t.category,valid),accounts=readAccountPlan_(settings);
        if(!String(t.content||'').trim()||String(t.content).length>500||String(t.note||'').length>2000)gambitFail_('Kiểm tra nội dung và ghi chú.');
        if(typeof t.amount!=='number'||!isFinite(t.amount)||t.amount<=0||t.amount>1e10)gambitFail_('Số tiền không hợp lệ.');
        if(!valid.some(function(c){return normalizeHeader_(c)===normalizeHeader_(category);}))gambitFail_('Danh mục không hợp lệ.');
        if(!accounts.some(function(a){return a.account===t.account;}))gambitFail_('Tài khoản không hợp lệ.');
        range.setValues([[gambitDate_(t.date),gambitCell_(t.content),gambitCell_(category),t.amount,gambitCell_(t.account),gambitCell_(t.note)]]);
      }
      // N:O relation formulas and P Notion status are preserved. Clearing Done would create duplicate Notion pages.
      SpreadsheetApp.flush();return jsonOutput_({ok:true,protocol:2,message:input.action==='transaction.delete'?'Đã xóa giao dịch trên Sheet.':'Đã cập nhật giao dịch trên Sheet.'});
    }
    gambitFail_('Thao tác chưa được hỗ trợ.');
  }catch(e){return jsonOutput_({ok:false,protocol:2,code:e.gambitCode||'server_error',message:String(e.message||e)});}
  finally{if(lock.hasLock())lock.releaseLock();}
}
