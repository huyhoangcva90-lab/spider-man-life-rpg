import fs from 'fs';
import path from 'path';

function findFiles(dir, match) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) res.push(...findFiles(full, match));
    else if (match(f.name)) res.push(full);
  }
  return res;
}

const allImgs = findFiles('tools/apk_unpacked/res', name => /\.(png|webp|jpg)$/i.test(name));
console.log('Total unpacked images:', allImgs.length);

const animeKeywords = [
  'push_up', 'run', 'read', 'meditate', 'water', 'wake', 'cold', 'screentime', 'core_habit', 'anime', 'stretch'
];

for (const kw of animeKeywords) {
  const matches = allImgs.filter(p => path.basename(p).toLowerCase().includes(kw));
  console.log(`Keyword [${kw}]: ${matches.length} matches:`);
  for (const m of matches) {
    console.log('   ', path.basename(m), '->', m);
  }
}
