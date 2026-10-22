import { ownerNotionRequest } from '../server/owner-notion-transport.mjs';
import { loadRoutine } from '../js/integrations/notion/RoutineData.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Cookie');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    let denied = false;
    const data = await loadRoutine('server-session', async (url, options) => {
      const path = new URL(url).pathname + new URL(url).search;
      const response = await ownerNotionRequest(req, path, options);
      if ([401, 403].includes(response.status)) denied = true;
      return response;
    }).catch(error => { if (denied) error.status = 401; throw error; });
    return res.status(200).json(data);
  } catch (error) {
    if (error.status === 401) return res.status(401).json({ error: 'OWNER_SESSION_REQUIRED' });
    return res.status(502).json({ error: 'NOTION_UNAVAILABLE' });
  }
}
