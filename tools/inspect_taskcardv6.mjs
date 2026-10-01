import fs from 'fs';
import path from 'path';

const dir = 'tools/apk_unpacked';
const dexFiles = fs.readdirSync(dir).filter(f => f.endsWith('.dex'));

for (const dex of dexFiles) {
  const buf = fs.readFileSync(path.join(dir, dex));
  const str = buf.toString('latin1');
  let idx = 0;
  while ((idx = str.indexOf('TaskCardV6', idx)) !== -1) {
    const start = Math.max(0, idx - 100);
    const end = Math.min(str.length, idx + 400);
    const snippet = str.substring(start, end).replace(/[^\x20-\x7E]/g, ' ');
    console.log(`\n=== MATCH TaskCardV6 in ${dex} ===`);
    console.log(snippet);
    idx += 'TaskCardV6'.length + 50;
  }
}
