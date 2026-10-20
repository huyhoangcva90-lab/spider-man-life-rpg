// Cloudflare Pages advanced mode: every asset and API request passes this gate.
// Use either Cloudflare Access or the private password login configured in Pages secrets.
const noStore = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' };
const sessionSeconds = 7 * 24 * 60 * 60;
let cachedKeys = null;
let keysExpireAt = 0;

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...noStore }
  });
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), char => char.charCodeAt(0));
}

function parseJwtPart(value) {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));
}

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function equalBytes(left, right) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index++) diff |= left[index] ^ right[index];
  return diff === 0;
}

function passwordConfigured(env) {
  return /^[a-f0-9]{64}$/i.test(String(env.APP_LOGIN_PASSWORD_HASH || '')) &&
    String(env.APP_SESSION_SECRET || '').length >= 32;
}

async function sessionKey(env) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(env.APP_SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function signSession(payload, env) {
  const signature = await crypto.subtle.sign('HMAC', await sessionKey(env), new TextEncoder().encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

async function verifySession(request, env) {
  if (!passwordConfigured(env)) return false;
  const token = (request.headers.get('Cookie') || '').split(';').map(part => part.trim())
    .find(part => part.startsWith('__Host-spider_session='))?.slice('__Host-spider_session='.length);
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3 || !/^\d{10,11}$/.test(parts[0]) || !/^[A-Za-z0-9_-]{16,}$/.test(parts[1])) return false;
  if (Number(parts[0]) <= Math.floor(Date.now() / 1000)) return false;
  try {
    const payload = `${parts[0]}.${parts[1]}`;
    return crypto.subtle.verify('HMAC', await sessionKey(env), decodeBase64Url(parts[2]), new TextEncoder().encode(payload));
  } catch (_) { return false; }
}

function loginPage(error = false) {
  return new Response(`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Spider Life · Đăng nhập</title><style>*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;background:radial-gradient(circle at 50% -15%,#263958,#0a1020 55%,#050810);color:#f3f5fa;font:16px system-ui,sans-serif;padding:20px}.card{width:min(100%,390px);padding:30px;border:1px solid #44516a;border-radius:24px;background:#111b2d;box-shadow:0 25px 70px #0009}.eyebrow{color:#ef6474;font-size:12px;font-weight:800;letter-spacing:.2em}h1{font-size:32px;margin:12px 0 8px}p{color:#b7c2d8;line-height:1.5}label{display:block;margin:28px 0 8px;font-weight:700}input{width:100%;padding:15px;border-radius:12px;border:1px solid #64728c;background:#080e1c;color:white;font:inherit}button{width:100%;margin-top:18px;padding:15px;border:0;border-radius:12px;background:#e53b55;color:white;font:inherit;font-weight:800;cursor:pointer}.error{color:#ff9b9b}</style><main class="card"><div class="eyebrow">PRIVATE SPIDER NETWORK</div><h1>Spider Life</h1><p>Nhập mật khẩu để mở Habit, Quest và thế giới game của bạn.</p>${error ? '<p class="error">Mật khẩu chưa đúng. Hãy thử lại.</p>' : ''}<form method="post" action="/login"><label for="password">Mật khẩu</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus><button type="submit">VÀO SPIDER LIFE →</button></form></main></html>`, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...noStore, 'X-Frame-Options': 'DENY' }
  });
}

async function login(request, env) {
  if (!passwordConfigured(env)) return new Response('Private login is not configured', { status: 503, headers: noStore });
  if (request.method === 'GET') return loginPage();
  if (request.method !== 'POST' || request.headers.get('Origin') !== new URL(request.url).origin) {
    return new Response('Forbidden', { status: 403, headers: noStore });
  }
  if (Number(request.headers.get('content-length') || 0) > 2048) return new Response('Too large', { status: 413 });
  const password = String((await request.formData()).get('password') || '');
  if (password.length > 512) return loginPage(true);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)));
  const expected = Uint8Array.from(String(env.APP_LOGIN_PASSWORD_HASH).match(/.{2}/g), byte => parseInt(byte, 16));
  if (!equalBytes(digest, expected)) return loginPage(true);
  const expires = Math.floor(Date.now() / 1000) + sessionSeconds;
  const nonce = toBase64Url(crypto.getRandomValues(new Uint8Array(24)));
  const token = await signSession(`${expires}.${nonce}`, env);
  return new Response(null, { status: 303, headers: {
    Location: '/', 'Set-Cookie': `__Host-spider_session=${token}; Path=/; Max-Age=${sessionSeconds}; HttpOnly; Secure; SameSite=Lax`, ...noStore
  } });
}

async function verifyAccess(request, env) {
  const team = String(env.CF_ACCESS_TEAM_DOMAIN || '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  const audience = String(env.CF_ACCESS_AUD || '').trim();
  if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(team) || !audience) return false;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const [header, claims] = parts.slice(0, 2).map(parseJwtPart);
    const now = Math.floor(Date.now() / 1000);
    if (header.alg !== 'RS256' || !header.kid ||
        claims.iss !== `https://${team}` ||
        !(Array.isArray(claims.aud) ? claims.aud.includes(audience) : claims.aud === audience) ||
        !Number.isFinite(claims.exp) || claims.exp <= now ||
        !Number.isFinite(claims.iat) || claims.iat > now + 60 ||
        (claims.nbf != null && (!Number.isFinite(claims.nbf) || claims.nbf > now + 60))) return false;

    if (!cachedKeys || Date.now() >= keysExpireAt) {
      const response = await fetch(`https://${team}/cdn-cgi/access/certs`, { redirect: 'error' });
      if (!response.ok) return false;
      const body = await response.json();
      if (!Array.isArray(body.keys)) return false;
      cachedKeys = body.keys;
      keysExpireAt = Date.now() + 5 * 60 * 1000;
    }
    let jwk = cachedKeys.find(key => key.kid === header.kid && key.kty === 'RSA');
    if (!jwk) {
      keysExpireAt = 0; // Refresh on the next request after a key rotation.
      return false;
    }
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decodeBase64Url(parts[2]), signed);
  } catch (_) {
    return false;
  }
}

async function notion(request, env) {
  const token = env.NOTION_TOKEN || env.NOTION_API_KEY;
  if (!token) return json(503, { ok: false, error: 'Notion is not configured' });
  const path = new URL(request.url).searchParams.get('path') || '';
  const method = request.method.toUpperCase();
  const id = '[a-f0-9-]{32,36}';
  const allowed = (method === 'POST' && (new RegExp(`^/v1/databases/${id}/query$`).test(path) || path === '/v1/pages')) ||
    ((method === 'GET' || method === 'PATCH') && new RegExp(`^/v1/pages/${id}$`).test(path));
  if (!allowed) return json(400, { ok: false, error: 'Unsupported Notion operation' });
  if (Number(request.headers.get('content-length') || 0) > 64 * 1024) return json(413, { ok: false, error: 'Request too large' });
  let body;
  if (method !== 'GET') {
    body = await request.text();
    if (body.length > 64 * 1024) return json(413, { ok: false, error: 'Request too large' });
    try { JSON.parse(body); } catch (_) { return json(400, { ok: false, error: 'Invalid JSON' }); }
  }
  try {
    const response = await fetch(`https://api.notion.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json; charset=utf-8'
      },
      ...(body == null ? {} : { body })
    });
    const data = await response.json().catch(() => ({}));
    return json(response.status, response.ok ? { ok: true, data } : { ok: false, error: data.message || 'Notion request failed', data });
  } catch (_) {
    return json(502, { ok: false, error: 'Notion is temporarily unavailable' });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const useAccess = Boolean(env.CF_ACCESS_TEAM_DOMAIN || env.CF_ACCESS_AUD);
    if (!useAccess && url.pathname === '/login') return login(request, env);
    if (!useAccess && url.pathname === '/logout') return new Response(null, { status: 303, headers: {
      Location: '/login', 'Set-Cookie': '__Host-spider_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax', ...noStore
    } });
    const authenticated = useAccess ? await verifyAccess(request, env) : await verifySession(request, env);
    if (!authenticated) {
      if (!useAccess && !passwordConfigured(env)) return new Response('Private login is not configured', { status: 503, headers: noStore });
      if (url.pathname.startsWith('/api/')) return json(401, { ok: false, error: 'Login required' });
      return useAccess ? new Response('Cloudflare Access required', { status: 403, headers: noStore }) :
        new Response(null, { status: 303, headers: { Location: '/login', ...noStore } });
    }
    if (url.pathname === '/api/notion') return notion(request, env);
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: noStore });
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'private, no-store');
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    headers.set('Referrer-Policy', 'no-referrer');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
