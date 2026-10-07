import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const localEnv = path.join(ROOT_DIR, '.env.local');
if (!process.env.NOTION_API_KEY && fs.existsSync(localEnv) && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(localEnv);
}
const PORT = process.env.PORT || 4173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const rawUrl = req.url.split('?')[0];

  // API Proxy for Notion
  if (rawUrl === '/api/notion') {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const notionPath = urlObj.searchParams.get('path');
    const token = process.env.NOTION_API_KEY || '';

    if (!token) {
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'Notion is not configured on this server' }));
      return;
    }

    if (!notionPath) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Missing path query parameter' }));
      return;
    }

    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', async () => {
      try {
        const notionUrl = `https://api.notion.com${notionPath.startsWith('/') ? notionPath : `/${notionPath}`}`;
        const fetchOpts = {
          method: req.method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json; charset=utf-8'
          }
        };
        if (req.method !== 'GET' && req.method !== 'HEAD' && bodyData) {
          fetchOpts.body = bodyData;
        }

        const nRes = await fetch(notionUrl, fetchOpts);
        const json = await nRes.json().catch(() => ({}));
        res.writeHead(nRes.status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: nRes.ok, data: json }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  let decodedPath;
  try { decodedPath = decodeURIComponent(rawUrl); } catch {
    res.writeHead(400); res.end('Bad path'); return;
  }
  const segments = decodedPath.split(/[\/]+/).filter(Boolean);
  const filePathRoot = path.resolve(ROOT_DIR, `.${decodedPath.replace(/\\/g, '/')}`);
  const relativePath = path.relative(ROOT_DIR, filePathRoot);
  if (segments.some((segment) => segment.startsWith('.')) || relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  let filePath = filePathRoot;

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${rawUrl}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Server Error: ${err.message}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🕷️ Spidey Life Dev Server running at:`);
  console.log(`   - Main App:          http://127.0.0.1:${PORT}/`);
  console.log(`   - Life Reset Native: http://127.0.0.1:${PORT}/life-reset/`);
  console.log(`   - Life OS Embedded:  http://127.0.0.1:${PORT}/life-os/#reset66`);
});
