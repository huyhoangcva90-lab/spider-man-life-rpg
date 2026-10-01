import fs from 'fs';
import path from 'path';

const dir = 'tools/apk_unpacked';
const dexFiles = fs.readdirSync(dir).filter(f => f.endsWith('.dex'));

for (const dex of dexFiles) {
  const buf = fs.readFileSync(path.join(dir, dex));
  const str = buf.toString('latin1');
  const target = 'Lbuild/designand/riselife/features/home/';
  let idx = 0;
  const found = new Set();
  while ((idx = str.indexOf(target, idx)) !== -1) {
    const end = str.indexOf(';', idx);
    if (end !== -1 && end - idx < 120) {
      found.add(str.substring(idx, end + 1));
    }
    idx += target.length + 1;
  }
  if (found.size > 0) {
    console.log(`\nClasses in ${dex} under features/home:`);
    for (const c of found) console.log('  ', c);
  }
}
