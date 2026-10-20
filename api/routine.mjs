import { hasOwnerSession } from './notion-session.mjs';
import { loadRoutine } from '../js/integrations/notion/RoutineData.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Cookie');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!hasOwnerSession(req)) return res.status(401).json({ error: 'OWNER_SESSION_REQUIRED' });
  const token = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
  if (!token) return res.status(503).json({ error: 'NOT_CONFIGURED' });
  try {
    return res.status(200).json(await loadRoutine(token));
  } catch {
    return res.status(502).json({ error: 'NOTION_UNAVAILABLE' });
  }
}
