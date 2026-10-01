import fs from 'node:fs';

const buf = fs.readFileSync('tools/apk_unpacked/classes3.dex');
const str = buf.toString('latin1');

// Match composable function signatures in home/today
const matches = str.match(/(?:fun\s+|invoke\(|Composable\s+)([A-Za-z0-9_]+Today[A-Za-z0-9_]*|[A-Za-z0-9_]+Home[A-Za-z0-9_]*|[A-Za-z0-9_]+Task[A-Za-z0-9_]*)/g) || [];
console.log('Home composables in classes3.dex:', Array.from(new Set(matches)).slice(0, 50));

// Find string literals in HomeScreen composables
const lines = [];
let cur = '';
for (let i = 0; i < buf.length; i++) {
  const byte = buf[i];
  if (byte >= 32 && byte <= 126) cur += String.fromCharCode(byte);
  else {
    if (cur.length >= 6 && (cur.includes('Today') || cur.includes('Hardmode') || cur.includes('Day 0') || cur.includes('tasks left'))) {
      lines.push(cur);
    }
    cur = '';
  }
}
console.log('Today / Home strings sample:');
console.log(Array.from(new Set(lines)).slice(0, 30));
