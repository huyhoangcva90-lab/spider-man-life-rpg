import fs from 'node:fs';

const buf = fs.readFileSync('tools/apk_unpacked/classes.dex');
const str = buf.toString('latin1');

// Look for strings around HomeScreen
const idx = str.indexOf('HomeScreen');
if (idx !== -1) {
  console.log('Context around HomeScreen:');
  console.log(str.slice(Math.max(0, idx - 500), idx + 1000).replace(/[^\x20-\x7E\n]/g, '.'));
}

// Find package name for home screen
const matches = str.match(/build\/designand\/riselife\/features\/home\/[A-Za-z0-9_\/]+/g) || [];
console.log('\nHome features:');
console.log(Array.from(new Set(matches)).slice(0, 50));
