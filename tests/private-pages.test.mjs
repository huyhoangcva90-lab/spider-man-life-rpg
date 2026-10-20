import assert from 'node:assert/strict';
import { generateKeyPairSync, sign, createHash } from 'node:crypto';
import worker from '../cloudflare/_worker.js';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'test-key', alg: 'RS256', use: 'sig' };
const team = 'example.cloudflareaccess.com';
const audience = 'spider-life-test';
const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url');
function jwt(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  const content = `${encoded({ alg: 'RS256', kid: 'test-key' })}.${encoded({ iss: `https://${team}`, aud: [audience], iat: now, exp: now + 600, ...overrides })}`;
  return `${content}.${sign('RSA-SHA256', Buffer.from(content), privateKey).toString('base64url')}`;
}

const realFetch = globalThis.fetch;
let notionCalls = 0;
let assetCalls = 0;
globalThis.fetch = async url => {
  if (String(url).endsWith('/cdn-cgi/access/certs')) return Response.json({ keys: [jwk] });
  if (String(url).startsWith('https://api.notion.com')) {
    notionCalls++;
    return Response.json({ results: [] });
  }
  throw new Error(`Unexpected request: ${url}`);
};

const env = {
  CF_ACCESS_TEAM_DOMAIN: team,
  CF_ACCESS_AUD: audience,
  NOTION_TOKEN: 'private-test-token',
  ASSETS: { fetch: async () => { assetCalls++; return new Response('asset'); } }
};
const request = (path, options = {}, token = jwt()) => new Request(`https://spider-life.pages.dev${path}`, {
  ...options,
  headers: { ...(options.headers || {}), 'Cf-Access-Jwt-Assertion': token }
});

try {
  assert.equal((await worker.fetch(request('/'), { ...env, CF_ACCESS_AUD: '' })).status, 403);
  assert.equal((await worker.fetch(new Request('https://spider-life.pages.dev/'), env)).status, 403);
  assert.equal((await worker.fetch(request('/data/notion-snapshot.json', {}, jwt({ aud: ['wrong'] })), env)).status, 403);
  assert.equal((await worker.fetch(request('/', {}, jwt({ exp: 1 })), env)).status, 403);
  assert.equal(assetCalls, 0);
  assert.equal((await worker.fetch(request('/data/notion-snapshot.json'), env)).status, 200);
  assert.equal(assetCalls, 1);
  assert.equal((await worker.fetch(request('/api/notion?path=https%3A%2F%2Fevil.example'), env)).status, 400);
  assert.equal(notionCalls, 0);
  const database = '272d787636c681d9ae35d494508b25d0';
  const valid = await worker.fetch(request(`/api/notion?path=%2Fv1%2Fdatabases%2F${database}%2Fquery`, {
    method: 'POST', body: JSON.stringify({ page_size: 100 })
  }), env);
  assert.equal(valid.status, 200);
  assert.equal((await valid.json()).ok, true);
  assert.equal(notionCalls, 1);
  const passwordEnv = {
    ...env,
    CF_ACCESS_TEAM_DOMAIN: '', CF_ACCESS_AUD: '',
    APP_LOGIN_PASSWORD_HASH: createHash('sha256').update('very-long-private-password').digest('hex'),
    APP_SESSION_SECRET: '0123456789abcdef0123456789abcdef0123456789abcdef'
  };
  assert.equal((await worker.fetch(new Request('https://spider-life.pages.dev/'), passwordEnv)).status, 303);
  assert.equal((await worker.fetch(new Request('https://spider-life.pages.dev/api/notion'), passwordEnv)).status, 401);
  const wrong = await worker.fetch(new Request('https://spider-life.pages.dev/login', {
    method: 'POST', headers: { Origin: 'https://spider-life.pages.dev', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'password=wrong'
  }), passwordEnv);
  assert.equal(wrong.status, 401);
  const success = await worker.fetch(new Request('https://spider-life.pages.dev/login', {
    method: 'POST', headers: { Origin: 'https://spider-life.pages.dev', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'password=very-long-private-password'
  }), passwordEnv);
  assert.equal(success.status, 303);
  const cookie = success.headers.get('Set-Cookie').split(';')[0];
  assert.equal((await worker.fetch(new Request('https://spider-life.pages.dev/data/notion-snapshot.json', { headers: { Cookie: cookie } }), passwordEnv)).status, 200);
  assert.equal((await worker.fetch(new Request('https://spider-life.pages.dev/data/notion-snapshot.json', { headers: { Cookie: `${cookie}x` } }), passwordEnv)).status, 303);
  console.log('Private Pages gate and Notion proxy: passed');
} finally {
  globalThis.fetch = realFetch;
}
