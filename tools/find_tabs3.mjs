import fs from 'node:fs';

const buf = fs.readFileSync('tools/apk_unpacked/classes3.dex');
const str = buf.toString('latin1');

const matches = str.match(/[A-Za-z0-9_]{3,30}Tab\b/g) || [];
console.log('Tabs in classes3.dex:', Array.from(new Set(matches)));
