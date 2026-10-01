import fs from 'fs';
import path from 'path';

const dir = 'tools/apk_unpacked';
const dexFiles = fs.readdirSync(dir).filter(f => f.endsWith('.dex'));

const queries = [
  'TaskItem', 'HabitItem', 'HomeScreen', 'TaskRow', 'TaskCard',
  'checkIn', 'CheckIn', 'completeTask', 'toggleTask',
  'pressAndHold', 'HoldTo', 'holdTo', 'swipe', 'SwipeTo',
  'LongPress', 'pointerInput', 'detectTapGestures',
  'DailyTask', 'HabitCard', 'TaskCheck'
];

for (const dex of dexFiles) {
  const buf = fs.readFileSync(path.join(dir, dex));
  const str = buf.toString('latin1');
  for (const q of queries) {
    let idx = 0;
    let count = 0;
    while ((idx = str.indexOf(q, idx)) !== -1 && count < 6) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(str.length, idx + 80);
      const snippet = str.substring(start, end).replace(/[^\x20-\x7E]/g, ' ');
      if (snippet.includes('build/designand/riselife') || snippet.includes('home') || snippet.includes('task') || snippet.includes('habit')) {
        console.log(`[${dex}] [${q}]: ${snippet}`);
        count++;
      }
      idx += q.length;
    }
  }
}
