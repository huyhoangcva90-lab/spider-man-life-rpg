import fs from 'fs';
import path from 'path';

const dir = 'tools/apk_unpacked';
const dexFiles = fs.readdirSync(dir).filter(f => f.endsWith('.dex'));

const terms = [
  'teach-swipe', 'teach-tap', 'swipe', 'drag',
  'TaskChecklist', 'ExtraTask', 'TaskItemProps', 'onTask', 'completeTask',
  'checkIn', 'CheckIn', 'Hold', 'hold', 'press'
];

for (const dex of dexFiles) {
  const buf = fs.readFileSync(path.join(dir, dex));
  const str = buf.toString('latin1');
  for (const t of terms) {
    let idx = 0;
    while ((idx = str.indexOf(t, idx)) !== -1) {
      const start = Math.max(0, idx - 100);
      const end = Math.min(str.length, idx + 200);
      const snippet = str.substring(start, end).replace(/[^\x20-\x7E]/g, ' ');
      if (snippet.includes('task') || snippet.includes('Task') || snippet.includes('swipe') || snippet.includes('teach') || snippet.includes('tap') || snippet.includes('drag')) {
        console.log(`\n--- MATCH [${t}] in ${dex} ---`);
        console.log(snippet);
      }
      idx += t.length + 50;
    }
  }
}
