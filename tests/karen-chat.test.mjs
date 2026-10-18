import test from 'node:test';
import assert from 'node:assert/strict';
import { ChatCenter, KAREN_TELEGRAM_URL } from '../js/ui/ChatCenter.js';

test('Chat removes old canned messages, preserves user drafts and opens only the owner-confirmed Karen bot',()=>{
  const originals={localStorage:globalThis.localStorage,document:globalThis.document,window:globalThis.window};
  let saved=JSON.stringify([{from:'NED // HQ',text:'demo'},{from:'MJ // WATCH',text:'demo'},{from:'MILES // TEAM',text:'demo'},{from:'YOU // PETER',text:'private draft',own:true}]);
  const listeners=new Map(),opened=[];
  globalThis.localStorage={getItem:()=>saved,setItem:(key,value)=>{saved=value;}};
  globalThis.document={getElementById:id=>({addEventListener:(type,callback)=>listeners.set(id,callback)})};
  globalThis.window={open:(...args)=>opened.push(args)};
  try {
    new ChatCenter().init();
    assert.deepEqual(JSON.parse(saved),[{from:'YOU // PETER',text:'private draft',own:true}]);
    listeners.get('btn-chat-list')();listeners.get('btn-chat-compose')();
    assert.equal(KAREN_TELEGRAM_URL,'https://t.me/Huykl_KarenBot');
    assert.deepEqual(opened,Array(2).fill([KAREN_TELEGRAM_URL,'_blank','noopener,noreferrer']));
    assert.ok(opened.every(([url])=>!url.includes('?') && !url.includes('private')));
  } finally {Object.assign(globalThis,originals);}
});
