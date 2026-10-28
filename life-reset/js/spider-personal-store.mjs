import { queryAllNotionPages, normalizeNotionPage, normalizeNotionCatalogPage, NOTION_GAME_DATABASES } from '../../js/integrations/notion/NotionGameData.js';
import { readDailyHabitHistory, recordedHabitDays, HABIT_PLANNER_DATABASE_ID, normalizeHabitPlan } from '../../js/integrations/notion/NotionHabitHistory.mjs';
import { createSessionReader } from './session-reader.mjs';
import { pendingHabitActions, saveHabitAction, settleHabitAction } from './habit-actions.mjs';
import { vietnamDay } from './personal-progress.mjs';

export const PERSONAL_CACHE_KEY = 'life_reset_notion_cache_v1';
export const LEGACY_STATE_KEY = 'life_reset_screenshot_v5';
const read = (storage,key) => { try { return JSON.parse(storage.getItem(key)||'null') || {}; } catch { return {}; } };
export const cleanId = value => String(value||'').replace(/^notion_/,'').replaceAll('-','').toLowerCase();

// Shared with the previous Life 66 screen: caches are observations, never write authority.
export class SpiderPersonalStore {
  constructor({fetcher=globalThis.fetch.bind(globalThis),storage=globalThis.localStorage,onChange=()=>{},onSaved=()=>{},sessionReader}={}) {
    this.fetcher=fetcher; this.storage=storage; this.onChange=onChange; this.onSaved=onSaved;
    this.sessionReader=sessionReader||createSessionReader(fetcher);
    this.busy=new Set(); this.writable=new Set(); this.connected=false; this.loading=false;
    this.revision=0; this.request=0; this.status='Đang kiểm tra kết nối Notion…'; this.data=read(storage,PERSONAL_CACHE_KEY);
    this.data.habits||=[]; this.data.tasks||=[]; this.data.activeQuests||=[]; this.data.habitPlans||=[];
  }
  notify(){this.onChange(this);}
  persist(){this.storage.setItem(PERSONAL_CACHE_KEY,JSON.stringify({...read(this.storage,PERSONAL_CACHE_KEY),...this.data}));}
  days(habit){return recordedHabitDays(habit,this.data.remoteHabitHistory,read(this.storage,LEGACY_STATE_KEY).notionHistory);}
  checked(habit,day=vietnamDay()){return this.days(habit).includes(day);}
  quests(){return [...this.data.tasks.map(q=>({...q,kind:'masterCalendar'})),...this.data.activeQuests.map(q=>({...q,kind:'activeQuests',date:q.dueDate}))];}
  pending(){return pendingHabitActions(this.storage);}
  async refresh(){
    const request=++this.request, revision=this.revision; this.loading=true; this.writable.clear();this.notify();
    try {
      const session=await this.sessionReader({force:true}); if(request!==this.request)return;
      this.configured=session?.configured;this.connected=!!session?.connected;
      if(!this.connected)throw Error('Dùng kết nối Gambit / Notion hiện có để tải dữ liệu.');
      const specs=[['habits',NOTION_GAME_DATABASES.habits],['tasks',NOTION_GAME_DATABASES.masterCalendar],['activeQuests',NOTION_GAME_DATABASES.activeQuests],['profile',NOTION_GAME_DATABASES.heroProfile],['habitPlans',HABIT_PLANNER_DATABASE_ID]];
      const results=await Promise.allSettled(specs.map(([,id])=>queryAllNotionPages(id,this.fetcher)));
      if(request!==this.request||revision!==this.revision)return;
      const next={...this.data},errors=[];const writable=new Set();
      results.forEach((r,i)=>{const kind=specs[i][0];if(r.status!=='fulfilled'){errors.push(kind);return;}
        if(kind==='habits')next.habits=r.value.map(p=>{const h=normalizeNotionPage(p,'habits');return {...h,rawId:h.id,id:'notion_'+h.id};});
        else if(kind==='profile'){const p=r.value.map(normalizeNotionCatalogPage)[0];next.heroXp=typeof p?.Exp==='number'?p.Exp:null;}
        else if(kind==='habitPlans')next.habitPlans=r.value.map(normalizeHabitPlan).filter(p=>!p.archived);
        else {next[kind]=r.value.map(p=>normalizeNotionPage(p,kind==='tasks'?'masterCalendar':'activeQuests'));writable.add(kind==='tasks'?'masterCalendar':kind);}
      });
      if(results[0].status==='fulfilled'){
        try {next.remoteHabitHistory=await readDailyHabitHistory(next.habits.map(h=>h.rawId),this.fetcher);next.habitHistorySyncedAt=new Date().toISOString();next.habitSyncedAt=next.habitHistorySyncedAt;writable.add('habits');}
        catch{errors.push('lịch sử Habit');}
      }
      if(request!==this.request||revision!==this.revision)return;
      if(results.every(r=>r.status==='rejected'))throw Error('Chưa tải được dữ liệu Notion. Bản lưu vẫn được giữ.');
      next.syncedAt=new Date().toISOString();this.data=next;this.writable=writable;
      this.storage.setItem(PERSONAL_CACHE_KEY,JSON.stringify({...read(this.storage,PERSONAL_CACHE_KEY),...next}));
      this.status=errors.length?'Notion cập nhật một phần · Chưa tải: '+errors.join(', '):'Notion đã cập nhật · '+new Date().toLocaleTimeString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit'});
    } catch(error){if(request===this.request){this.writable.clear();this.status=error.message;}}
    finally{if(request===this.request){this.loading=false;this.notify();}}
  }
  async connect(accessCode){const r=await this.fetcher('/api/notion-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessCode})});if(!r.ok)throw Error('Chưa mở được kết nối. Kiểm tra mật khẩu Gambit đang dùng.');await this.refresh();}
  async setHabit(habit,checked){
    const id=habit.rawId||habit.id, key='habit:'+cleanId(id);if(this.busy.has(key)||!this.writable.has('habits'))return false;
    this.busy.add(key);this.revision++;this.notify();let saved=false;
    try {
      const action=saveHabitAction({id:crypto.randomUUID(),habitId:id,day:vietnamDay(),checked,expectedEditedAt:habit.editedAt},this.storage);
      if(action.status==='review'||action.checked!==checked||action.day!==vietnamDay()){
        settleHabitAction(action.id,true,this.storage);throw Error('Có thao tác cũ cần xem lại; chưa ghi thêm.');
      }
      const r=await this.fetcher('/api/habit-check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(action)}),p=await r.json();
      if(!r.ok||!p.ok){if(r.status===409)settleHabitAction(action.id,true,this.storage);throw Error(p.partial?'Daily đã ghi, dấu Today chưa xác nhận. Dùng Thử gửi lại để hoàn tất.':p.error||'Chưa xác nhận lưu Habit.');}
      settleHabitAction(action.id,false,this.storage);habit.editedAt=p.data?.editedAt||habit.editedAt;habit.today=checked;habit.done=checked;
      const days=new Set(this.days(habit));checked?days.add(vietnamDay()):days.delete(vietnamDay());this.data.remoteHabitHistory||={};this.data.remoteHabitHistory[cleanId(id)]=[...days].sort();
      this.persist();this.onSaved({kind:'habits',id,checked});saved=true;
    }catch(e){this.status=e.message;this.notify();}
    finally{this.busy.delete(key);if(saved)await this.refresh();else this.notify();}return saved;
  }
  async setQuest(quest,checked){
    const key='quest:'+cleanId(quest.id);if(this.busy.has(key)||!this.writable.has(quest.kind))return false;
    this.busy.add(key);this.revision++;this.notify();let saved=false;
    try{
      const property=quest.kind==='activeQuests'?'Completed':'Done';
      const r=await this.fetcher('/api/notion?path='+encodeURIComponent('/v1/pages/'+cleanId(quest.rawId||quest.id)),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({properties:{[property]:{checkbox:checked}}})});
      const p=await r.json();if(!r.ok||!p.ok)throw Error(p.error||'Chưa xác nhận lưu Quest.');
      const original=(quest.kind==='activeQuests'?this.data.activeQuests:this.data.tasks).find(q=>q.id===quest.id);if(original)original.done=checked;
      this.persist();this.onSaved({kind:quest.kind,id:quest.id,checked});saved=true;
    }catch(e){this.status=e.message;this.notify();}finally{this.busy.delete(key);if(saved)await this.refresh();else this.notify();}return saved;
  }
  async retryHabits(){for(const a of this.pending().filter(a=>a.status==='pending')){const h=this.data.habits.find(h=>cleanId(h.rawId)===cleanId(a.habitId));if(h)await this.setHabit(h,a.checked);}}
  discardReviewed(){for(const a of this.pending().filter(a=>a.status==='review'))settleHabitAction(a.id,false,this.storage);this.notify();}
}
