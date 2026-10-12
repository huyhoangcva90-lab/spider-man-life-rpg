import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'spidey_notion_session';
const SESSION_SECONDS = 12 * 60 * 60;

function signature(timestamp, secret) {
  return createHmac('sha256', secret).update(`spidey-notion:${timestamp}`).digest('hex');
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try { return new URL(origin).host === req.headers.host; }
  catch { return false; }
}

export function hasOwnerSession(req, secret = process.env.NOTION_PROXY_ACCESS_TOKEN || '') {
  if (!secret) return false;
  const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return false;
  const [timestampText, suppliedSignature] = cookie.slice(COOKIE_NAME.length + 1).split('.');
  if (!/^\d{13}$/.test(timestampText || '') || !/^[a-f0-9]{64}$/.test(suppliedSignature || '')) return false;
  const timestamp = Number(timestampText);
  if (!Number.isSafeInteger(timestamp) || !suppliedSignature || Date.now() - timestamp > SESSION_SECONDS * 1000 || timestamp > Date.now()) return false;
  const expected = Buffer.from(signature(timestamp, secret), 'hex');
  const supplied = Buffer.from(suppliedSignature, 'hex');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const secret = process.env.NOTION_PROXY_ACCESS_TOKEN || '';
  if (req.method === 'GET') return res.status(200).json({ ok: true, configured: Boolean(secret && process.env.NOTION_API_KEY), connected: hasOwnerSession(req, secret) });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: 'Request must come from this site' });
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0`);
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  if (!secret || !process.env.NOTION_API_KEY) return res.status(503).json({ ok: false, error: 'Notion owner access is not configured on this deployment' });
  const supplied = req.body?.accessCode;
  if (typeof supplied !== 'string' || supplied.length > 512) return res.status(400).json({ ok: false, error: 'Invalid access code' });
  const actual = Buffer.from(supplied);
  const expected = Buffer.from(secret);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return res.status(401).json({ ok: false, error: 'Access code is incorrect' });
  const timestamp = Date.now();
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${timestamp}.${signature(timestamp, secret)}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${SESSION_SECONDS}`);
  return res.status(200).json({ ok: true });
}
