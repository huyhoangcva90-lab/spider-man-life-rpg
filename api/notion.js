// Vercel Serverless Function Proxy for Notion API.
// Public deployments must not expose the owner's full Notion integration.

export default async function handler(req, res) {
  const token = process.env.NOTION_API_KEY || '';
  const accessToken = process.env.NOTION_PROXY_ACCESS_TOKEN || '';
  const { path } = req.query;

  if (!accessToken || req.headers['x-spidey-access-token'] !== accessToken) {
    return res.status(403).json({ ok: false, error: 'Private Notion proxy is disabled or access is denied' });
  }

  if (!token) {
    return res.status(503).json({ ok: false, error: 'Notion is not configured on this server' });
  }

  if (!path) {
    return res.status(400).json({ ok: false, error: 'Missing path query parameter' });
  }

  try {
    const notionUrl = `https://api.notion.com${path.startsWith('/') ? path : `/${path}`}`;
    
    const fetchOptions = {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(notionUrl, fetchOptions);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: data.message || `Notion HTTP ${response.status}`, data });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
