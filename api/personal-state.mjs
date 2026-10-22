import { ownerNotionRequest } from '../server/owner-notion-transport.mjs';
import { readPersonalState } from '../server/personal-state.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Cookie');
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  try {
    return res.status(200).json(await readPersonalState((path, options) => ownerNotionRequest(req, path, options)));
  } catch (error) {
    const status = [401, 403].includes(error.status) ? error.status : 502;
    return res.status(status).json({ ok: false, error: status === 502 ? 'Personal data unavailable' : 'Owner session required' });
  }
}
