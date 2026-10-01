// Vercel Serverless Function Proxy for Notion API
// Safely forwards requests to Notion using server-side NOTION_API_KEY environment variable.

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const token = process.env.NOTION_API_KEY || '';
  const { path } = req.query;

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
