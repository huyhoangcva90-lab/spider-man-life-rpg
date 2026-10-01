import fs from 'node:fs';

// Extract readable strings from resources.arsc
function extractStringsFromArsc(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const buf = fs.readFileSync(filePath);
  const strings = [];
  let cur = '';
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    if (byte >= 32 && byte <= 126) {
      cur += String.fromCharCode(byte);
    } else {
      if (cur.length >= 4) {
        strings.push(cur);
      }
      cur = '';
    }
  }
  return strings;
}

const arscStrings = extractStringsFromArsc('tools/apk_unpacked/resources.arsc');
console.log(`Extracted ${arscStrings.length} strings from resources.arsc`);

const interesting = arscStrings.filter(s => 
  s.includes('Day') || s.includes('Habit') || s.includes('Reset') || 
  s.includes('Streak') || s.includes('Task') || s.includes('Today') ||
  s.includes('Journey') || s.includes('Hardmode') || s.includes('Season') ||
  s.includes('Break') || s.includes('Tool') || s.includes('Pillar') ||
  s.includes('Morning') || s.includes('Evening') || s.includes('Chest')
);

console.log('Sample domain strings (first 100):');
console.log(Array.from(new Set(interesting)).slice(0, 100));
