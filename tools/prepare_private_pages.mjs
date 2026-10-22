import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.pages-private');
if (path.dirname(path.resolve(output)) !== root || path.basename(output) !== '.pages-private') {
  throw new Error('Unexpected private Pages output path');
}
const directories = ['assets', 'battle-lab', 'cards_custom_snap', 'css', 'data', 'js', 'life-os', 'life-reset', 'spider_gadgets_gallery_and_covers'];
const files = ['index.html', 'spidey_contact.png'];
const allowedExtensions = new Set(['.html', '.css', '.js', '.mjs', '.json', '.png', '.webp', '.jpg', '.jpeg', '.gif', '.svg', '.wav', '.mp3', '.ogg', '.xml', '.ico', '.woff', '.woff2']);
const maxAssetBytes = 25 * 1024 * 1024;
let copied = 0;

function copyFile(source, destination) {
  const stat = fs.statSync(source);
  if (!stat.isFile()) throw new Error(`Not a file: ${source}`);
  if (!allowedExtensions.has(path.extname(source).toLowerCase())) return;
  if (stat.size > maxAssetBytes) throw new Error(`Asset exceeds Cloudflare Pages limit: ${source}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  copied++;
}

function copyDirectory(source, destination) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else if (entry.isFile()) copyFile(from, to);
  }
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const directory of directories) copyDirectory(path.join(root, directory), path.join(output, directory));
for (const file of files) copyFile(path.join(root, file), path.join(output, file));
fs.copyFileSync(path.join(root, 'cloudflare', '_worker.js'), path.join(output, '_worker.js'));
console.log(`Prepared ${copied} static files and the private access Worker in ${output}`);
