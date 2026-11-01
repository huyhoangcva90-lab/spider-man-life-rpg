// Only public app assets are relayed. Private data continues through authenticated APIs.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const path = String(req.query.asset || 'index.html');
  if (path.includes('..') || !/^(?:apps\/|assets\/)?[a-zA-Z0-9_./-]+\.(?:html|css|js|mjs|json|svg|png|jpg|jpeg|webp|gif|woff2?|mp3|wav|webmanifest)$/.test(path)) return res.status(404).end();
  try {
    const response = await fetch('https://gambit-d9b.pages.dev/field/' + path, {redirect:'error'});
    if (!response.ok) return res.status(response.status).end();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Cache-Control', path.endsWith('.html') ? 'no-store' : 'public, max-age=300');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
    if (path === 'notion-connection.js') {
      const source = (await response.text()).replace('async function check(open) {', "async function check(open) { if(open && parent!==window){parent.postMessage({type:'spider:open-connection'},location.origin);return;}");
      return res.status(200).send(source);
    }
    return res.status(200).send(Buffer.from(await response.arrayBuffer()));
  } catch { return res.status(502).end(); }
}
