/* Compatibility adapter; the original Gambit screens remain the renderer. */
(function () {
  'use strict';
  var connected=false, checking=false, syncing=false, writing=0, nextAt=0;
  var DAILY='272d787636c681c8b8adc9d6fdada0b7';
  var proxy='/api/notion?path=';
  function status(state) {
    if(parent!==window) parent.postMessage({type:'spider:notion-status',state:state},location.origin);
    var launch=document.getElementById('btn-notion-status');
    if(launch)launch.textContent=state==='connected'?'Notion: đã kết nối':state==='locked'?'Notion: mở phiên riêng':state==='unconfigured'?'Notion: chưa cấu hình':'Notion: cần kiểm tra';
  }
  function notice(text) {
    if(typeof toast==='function') toast(text);
    status(connected?'error':'locked');
  }
  async function request(method,path,body) {
    path=path.replace('https://api.notion.com','');
    var rows=[],cursor,result;
    do {
      var payload=body && Object.assign({},body,cursor?{start_cursor:cursor}:{});
      var start=Math.max(Date.now(),nextAt);nextAt=start+350;
      if(start>Date.now())await new Promise(function(resolve){setTimeout(resolve,start-Date.now());});
      var response=await fetch(proxy+encodeURIComponent(path),{method:method,cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(payload):undefined});
      var raw=await response.json();result={ok:response.ok,data:raw.data||raw};
      if(!response.ok){if(response.status===401||response.status===403)connected=false;return result;}
      if(method==='POST'&&path.endsWith('/query')){
        rows=rows.concat(result.data.results||[]);
        cursor=!path.includes(DAILY)&&result.data.has_more?result.data.next_cursor:null;
        if(result.data.has_more&&!result.data.next_cursor) return {ok:false,data:{error:'Missing cursor'}};
      }
      if(cursor)await new Promise(function(resolve){setTimeout(resolve,350);});
    } while(cursor);
    if(method==='POST'&&path.endsWith('/query'))result.data.results=rows;
    return result;
  }
  window.SpiderNotion={request:request};
  if(typeof pullNotion==='function')window.pullNotion=function(cb){pullDailySchema(function(ok){if(!ok){cb(false);return;}pullHabits(function(ok){if(!ok){cb(false);return;}pullDaily(cb);});});};
  if(typeof nFetch==='function') window.nFetch=function(method,url,body,cb){return request(method,url,body).then(function(r){if(cb)cb(r.ok,r.data);return r;}).catch(function(error){if(cb){cb(false,{});return {ok:false,data:{}};}throw error;});};
  if(typeof notionFetch==='function') window.notionFetch=request;

  var dialog=document.createElement('dialog');
  dialog.style.cssText='max-width:420px;width:calc(100% - 32px);padding:24px;border:1px solid #397c9b;border-radius:12px;background:#101c24;color:#edf4f5;font:14px/1.6 system-ui;';
  dialog.innerHTML='<form><h2 style="margin-top:0">Kết nối Notion</h2><p data-state></p><label>Mã truy cập Spider<input name="accessCode" type="password" autocomplete="current-password" required style="display:block;width:100%;box-sizing:border-box;padding:12px;margin:8px 0"></label><button type="submit" style="min-height:44px;padding:8px 16px">Kết nối</button><button type="button" data-close style="min-height:44px;padding:8px 16px;margin-left:8px">Đóng</button></form>';
  document.body.appendChild(dialog);
  document.getElementById('btn-notion-status')?.addEventListener('click',function(event){event.preventDefault();event.stopImmediatePropagation();check(true);},true);
  dialog.querySelector('[data-close]').onclick=function(){dialog.close();};
  async function check(open) {
    if(checking)return;checking=true;
    try {
      var r=await fetch('/api/notion-session',{cache:'no-store'}),s=await r.json();
      connected=!!s.connected;
      status(connected?'connected':s.configured?'locked':'unconfigured');
      dialog.querySelector('[data-state]').textContent=connected?'Đã mở kết nối riêng trên thiết bị này.':s.configured?(s.backend==='field'?'Dùng mật khẩu Gambit hiện tại để mở các dữ liệu đã chuyển vào Spider Field.':'Nhập mã truy cập Spider. Không nhập khóa tích hợp Notion.'):'Chưa mở được kết nối dữ liệu. Thử lại khi có mạng.';
      dialog.querySelector('label').hidden=!s.configured||connected;
      dialog.querySelector('[type="submit"]').hidden=!s.configured||connected;
      if(open)dialog.showModal();
      if(connected&&!open)refresh();
    }catch(e){status('error');}finally{checking=false;}
  }
  dialog.querySelector('form').onsubmit=async function(event){
    event.preventDefault();var form=event.currentTarget,button=form.querySelector('[type="submit"]');button.disabled=true;
    try{var r=await fetch('/api/notion-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessCode:form.elements.accessCode.value})});form.reset();if(!r.ok)throw Error('Mã chưa đúng hoặc máy chủ chưa kết nối.');dialog.close();await check(false);}
    catch(e){dialog.querySelector('[data-state]').textContent=e.message;}finally{button.disabled=false;}
  };
  window.addEventListener('message',function(event){if(event.origin===location.origin&&event.source===parent&&event.data?.type==='spider:notion-connect')check(true);});
  async function refresh(){
    if(!connected||syncing||writing||document.hidden||document.querySelector('.sheet.open,.edit-sheet.open,.ov.open'))return;
    syncing=true;
    try {
      if(typeof syncMasterCalendar==='function'){await syncMasterCalendar();status(/lỗi|chưa/i.test(notionSyncText)?'error':'connected');}
      else if(typeof pullNotion==='function')await new Promise(function(resolve){pullNotion(function(ok){D.notion.ok=ok;save(true);updateSyncUI();buildHabitsCfg();renderAll();status(ok?'connected':'error');resolve();});});
    }finally{syncing=false;}
  }
  setInterval(function(){check(false);},30000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)check(false);});
  window.addEventListener('focus',function(){check(false);});

  // Per-habit check history. Missing days are unknown, never fabricated misses.
  if(typeof renderStats==='function'){
    var originalStats=renderStats;
    window.renderStats=function(){originalStats();var host=document.getElementById('stats-body');
      var section=document.createElement('section');section.style.cssText='margin:20px;padding:18px;border:1px solid #ccc;border-radius:8px;background:var(--surface,#fff);color:var(--text,#222)';
      var heading=document.createElement('h3');heading.textContent='Dấu theo từng habit · 30 ngày';heading.style.fontSize='15px';section.appendChild(heading);
      HABITS.forEach(function(h){var row=document.createElement('div'),name=document.createElement('p');name.textContent=h.l;name.style.cssText='font-size:13px;margin:16px 0 6px';row.appendChild(name);var grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(15,1fr);gap:4px';
        for(var i=29;i>=0;i--){var d=new Date(todayStr()+'T12:00:00');d.setDate(d.getDate()-i);var ds=dateStr(d),day=D.days[ds],known=!!day?.pageId,done=known&&!!day.habits?.[h.k],cell=document.createElement('span');cell.textContent=done?'✓':'';cell.title=ds+' · '+(done?'Đã đánh dấu':known?'Chưa đánh dấu':'Chưa có dữ liệu');cell.setAttribute('aria-label',cell.title);cell.style.cssText='display:grid;place-items:center;aspect-ratio:1;border:1px '+(known?'solid':'dashed')+' #aaa;border-radius:3px;font-size:10px;background:'+(done?'#111':'transparent')+';color:#fff';grid.appendChild(cell);}row.appendChild(grid);section.appendChild(row);
      });if(!HABITS.length){var empty=document.createElement('p');empty.textContent='Kết nối Notion để xem thói quen thật.';section.appendChild(empty);}host.appendChild(section);
    };
  }
  // Write only the clicked habit. Preserve other relations on the Daily page.
  if(typeof setMeta==='function')window.setMeta=async function(ds,field,value){
    var property={mood:'Mood',energy:'Energy',prod:'Productivion'}[field];
    if(!property||!connected||!D.notion.ok||writing){notice('Kết nối Notion hoặc chờ lần lưu hiện tại.');return;}
    var day=getDay(ds),props={};props[property]={select:value?{name:String(value)}:null};writing++;
    try{
      var result;
      if(day.pageId)result=await request('PATCH','/v1/pages/'+day.pageId,{properties:props});
      else{props.Date={date:{start:ds}};props.Name={title:[{text:{content:ds}}]};result=await request('POST','/v1/pages',{parent:{database_id:D.notion.dbId},properties:props});}
      if(!result.ok)throw Error();day.pageId=result.data.id||day.pageId;day[field]=value;save(true);renderToday();status('connected');
    }catch(e){notice('Chưa lưu được Notion. Trạng thái giữ nguyên.');}finally{writing--;}
  };
  if(typeof toggleH==='function') window.toggleH=async function(ds,key){
    if(!connected||!D.notion.ok||writing){notice('Kết nối Notion hoặc chờ lần lưu hiện tại.');return;}
    var h=HABITS.find(function(item){return item.k===key;});if(!h)return;
    var day=getDay(ds),before=!!day.habits[key],next=!before,props={};writing++;
    try{
      if(h.checkboxes?.length)h.checkboxes.forEach(function(name){props[name]={checkbox:next};});
      else {
        var ids=[];
        if(day.pageId){var current=await request('GET','/v1/pages/'+day.pageId);if(!current.ok)throw Error();ids=(current.data.properties?.Habits?.relation||[]).map(function(r){return r.id;});}
        var set=new Set(ids);if(next)set.add(key);else set.delete(key);props.Habits={relation:Array.from(set).map(function(id){return{id:id};})};
      }
      var result;
      if(day.pageId)result=await request('PATCH','/v1/pages/'+day.pageId,{properties:props});
      else{props.Date={date:{start:ds}};props.Name={title:[{text:{content:ds}}]};result=await request('POST','/v1/pages',{parent:{database_id:D.notion.dbId},properties:props});}
      if(!result.ok)throw Error();day.pageId=result.data.id||day.pageId;day.habits[key]=next;save(true);renderAll();toast('Đã lưu dấu trong Notion');status('connected');
    }catch(e){notice('Chưa lưu được Notion. Dấu giữ nguyên.');}finally{writing--;}
  };
  // Existing Todo controls now wait for the database, rather than claiming local saves.
  if(typeof syncMasterCalendar==='function'){
    window.toggle=async function(id){var t=todos.find(function(item){return item.id===id;});if(!t||!connected||writing){notice('Kết nối Notion trước khi hoàn thành việc.');return;}writing++;
      try{var items=[t].concat(t.subtasks||[]);for(var item of items){if(!item.notionId)throw Error();var r=await request('PATCH','/v1/pages/'+item.notionId,{properties:{Done:{checkbox:!t.done}}});if(!r.ok)throw Error();}status('connected');}
      catch(e){notice('Chưa lưu đủ vào Notion; đang đọc lại trạng thái thật.');}finally{writing--;await syncMasterCalendar();}
    };
    window.submitTodo=async function(){var input=document.getElementById('todo-input'),text=input.value.trim();if(!text)return;if(!connected||writing){notice('Kết nối Notion trước khi tạo việc.');return;}writing++;
      try{var r=await request('POST','/v1/pages',{parent:{database_id:NOTION_TASK_DB},properties:{Name:{title:[{text:{content:text}}]},Done:{checkbox:false},Important:{checkbox:selPrio==='p2'},Urgent:{checkbox:selPrio==='p1'},Type:{select:{name:{'Công việc':'Work','Học tập':'Study','Cá nhân':'Personal'}[selProj]||'Personal'}}}});if(!r.ok)throw Error();
        var pendingSubs=newSubtasks.slice();input.value='';newSubtasks=[];closeSheet();
        for(var sub of pendingSubs){var child=await request('POST','/v1/pages',{parent:{database_id:NOTION_TASK_DB},properties:{Name:{title:[{text:{content:sub}}]},'Parent task':{relation:[{id:r.data.id}]}}});if(!child.ok)throw Error('Việc chính đã lưu; một việc con chưa lưu được.');}status('connected');
      }catch(e){notice(e.message||'Chưa tạo được việc trong Notion.');}finally{writing--;await syncMasterCalendar();}
    };
    document.getElementById('sheet-submit-btn').onclick=window.submitTodo;
    // Editing/deletion stay in Notion; do not silently modify only the browser cache.
    window.remove=function(id){var task=todos.find(function(t){return t.id===id;});if(task?.notionId)window.open('https://www.notion.so/'+task.notionId.replaceAll('-',''),'_blank','noopener,noreferrer');};
    window.openClearConfirm=function(){notice('Quản lý xóa trực tiếp trong Notion. Danh sách này tự đọc lại.');};
    document.getElementById('edit-save-btn').onclick=function(){var task=todos.find(function(t){return t.id===editingId;});if(task?.notionId){notice('Mở bản ghi Notion để sửa; bản nháp vẫn ở đây.');window.open('https://www.notion.so/'+task.notionId.replaceAll('-',''),'_blank','noopener,noreferrer');}};
    window.toggleSubtask=async function(tid,sid){
      var task=todos.find(function(t){return t.id===tid;}),sub=task?.subtasks.find(function(s){return s.id===sid;});if(!sub?.notionId||!connected||writing){notice('Kết nối Notion trước khi đánh dấu.');return;}writing++;
      try{var r=await request('PATCH','/v1/pages/'+sub.notionId,{properties:{Done:{checkbox:!sub.done}}});if(!r.ok)throw Error();}
      catch(e){notice('Chưa lưu được dấu hoàn thành việc con.');}finally{writing--;await syncMasterCalendar();}
    };
  }
  check(false);
})();
