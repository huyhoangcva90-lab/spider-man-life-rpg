import fs from 'fs';
import path from 'path';

const srcDir = 'tools/apk_unpacked/res/drawable';
const destDir = 'life-reset/assets/images';

const files = fs.readdirSync(srcDir);
let count = 0;

for (const file of files) {
  if (file.includes('2025') || file.includes('classic') || file.startsWith('icon_') || file.includes('pushup')) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    fs.copyFileSync(src, dest);
    count++;
  }
}

console.log(`Copied ${count} anime & 2025 habit images to ${destDir}`);
