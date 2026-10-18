import { readNotionGameState } from '../server/notion-game-reader.mjs';

let cached = null;
let pending = null;
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Read-only game display' });
  const token = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN || '';
  res.setHeader('Cache-Control', 'no-store');
  if (!token) return res.status(503).json({ ok: false, error: 'Notion display is not configured' });
  try {
    if (!cached || Date.now() - cached.at > 15000) {
      if (!pending) pending = readNotionGameState(token).then((data) => { cached = { data, at: Date.now() }; }).finally(() => { pending = null; });
      await pending;
    }
    return res.status(200).json({ ok: true, data: cached.data });
  } catch {
    return res.status(502).json({ ok: false, error: 'Notion display could not refresh' });
  }
}
