import fs from 'node:fs';
import path from 'node:path';

const dexFiles = [
  'tools/apk_unpacked/classes.dex',
  'tools/apk_unpacked/classes2.dex',
  'tools/apk_unpacked/classes3.dex'
];

// Search for screen names, routes, composable functions, and UI terms
const regex = /[A-Za-z0-9_\/\$]{4,}(Screen|Route|Page|Tab|View|Dialog|Sheet|Activity|State)/g;
const found = new Set();

for (const f of dexFiles) {
  if (!fs.existsSync(f)) continue;
  const buf = fs.readFileSync(f);
  const str = buf.toString('latin1');
  const matches = str.match(regex);
  if (matches) {
    for (const m of matches) {
      if (m.includes('build/designand/riselife') || m.includes('riselife') || (!m.includes('android') && !m.includes('google') && !m.includes('kotlin'))) {
        found.add(m);
      }
    }
  }
}

const sorted = Array.from(found).sort();
console.log(`Found ${sorted.length} UI components/screens:`);
console.log(sorted.filter(s => s.toLowerCase().includes('riselife') || s.toLowerCase().includes('screen') || s.toLowerCase().includes('tab')).slice(0, 80));
