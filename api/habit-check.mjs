import { ownerNotionRequest } from '../server/owner-notion-transport.mjs';
import { writeHabitCheck } from '../server/habit-check.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  let origin; try { origin = new URL(req.headers.origin).host; } catch {}
  if (origin !== req.headers.host) return res.status(403).json({ ok: false, error: 'Same-origin action required' });
  try {
    const data = await writeHabitCheck(req.body, (path, options) => ownerNotionRequest(req, path, options));
    return res.status(200).json({ ok: true, data });
  } catch (error) {
    return res.status(error.status || 502).json({ ok: false, partial: !!error.partial, error: error.message });
  }
}
