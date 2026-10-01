import fs from 'fs';
import path from 'path';

const dir = 'tools/apk_unpacked';
const dexFiles = fs.readdirSync(dir).filter(f => f.endsWith('.dex'));

const terms = [
  'TaskSheet', 'CheckInSheet', 'CompleteSheet', 'TaskDetail',
  'LogSheet', 'TaskActionSheet', 'onSwipe', 'SwipeToDismiss',
  'Swipeable', 'swipeTo', 'HoldToComplete', 'HoldProgress'
];

for (const dex of dexFiles) {
  const buf = fs.readFileSync(path.join(dir, dex));
  const str = buf.toString('latin1');
  for (const t of terms) {
    let idx = 0;
    while ((idx = str.indexOf(t, idx)) !== -1) {
      const start = Math.max(0, idx - 80);
      const end = Math.min(str.length, idx + 180);
      const snippet = str.substring(start, end).replace(/[^\x20-\x7E]/g, ' ');
      console.log(`[${t}] in ${dex}: ${snippet}`);
      idx += t.length + 40;
    }
  }
}
