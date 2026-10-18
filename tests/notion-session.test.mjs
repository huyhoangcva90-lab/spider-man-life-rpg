import assert from 'node:assert/strict';
import test from 'node:test';
import sessionHandler, { hasOwnerSession } from '../api/notion-session.mjs';
import notionHandler from '../api/notion.mjs';

function response() {
  return {
    headers: {}, statusCode: 200, body: null,
    setHeader(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; }
  };
}

test('private Notion session gates reads and writes without exposing the server key', async () => {
  const oldSecret = process.env.NOTION_PROXY_ACCESS_TOKEN;
  const oldKey = process.env.NOTION_API_KEY;
  const oldFetch = globalThis.fetch;
  process.env.NOTION_PROXY_ACCESS_TOKEN = 'test-owner-code-with-enough-entropy';
  process.env.NOTION_API_KEY = 'test-notion-key';
  try {
    const headers = { host: 'spider.example', origin: 'https://spider.example' };
    const locked = response();
    sessionHandler({ method: 'GET', headers }, locked);
    assert.deepEqual(locked.body, { ok: true, configured: true, connected: false });

    const denied = response();
    sessionHandler({ method: 'POST', headers, body: { accessCode: 'wrong-code' } }, denied);
    assert.equal(denied.statusCode, 401);

    const login = response();
    sessionHandler({ method: 'POST', headers, body: { accessCode: process.env.NOTION_PROXY_ACCESS_TOKEN } }, login);
    assert.equal(login.statusCode, 200);
    assert.match(login.headers['Set-Cookie'], /HttpOnly; Secure; SameSite=Strict/);
    assert.ok(!login.headers['Set-Cookie'].includes(process.env.NOTION_PROXY_ACCESS_TOKEN));
    const cookie = login.headers['Set-Cookie'].split(';')[0];
    assert.equal(hasOwnerSession({ headers: { cookie } }), true);
    assert.equal(hasOwnerSession({ headers: { cookie: `${cookie}tampered` } }), false);

    const unauthorized = response();
    await notionHandler({ method: 'POST', headers, query: { path: '/v1/pages' }, body: {} }, unauthorized);
    assert.equal(unauthorized.statusCode, 403);

    const crossOrigin = response();
    await notionHandler({ method: 'POST', headers: { ...headers, cookie, origin: 'https://other.example' }, query: { path: '/v1/pages' }, body: {} }, crossOrigin);
    assert.equal(crossOrigin.statusCode, 403);

    let calledUrl = '';
    globalThis.fetch = async (url) => { calledUrl = url; return { ok: true, json: async () => ({ results: [] }) }; };
    const authorized = response();
    await notionHandler({ method: 'POST', headers: { ...headers, cookie }, query: { path: '/v1/databases/test/query' }, body: { page_size: 100 } }, authorized);
    assert.equal(authorized.statusCode, 200);
    assert.equal(calledUrl, 'https://api.notion.com/v1/databases/test/query');

    const logout = response();
    sessionHandler({ method: 'DELETE', headers }, logout);
    assert.match(logout.headers['Set-Cookie'], /Max-Age=0/);
  } finally {
    if (oldSecret === undefined) delete process.env.NOTION_PROXY_ACCESS_TOKEN; else process.env.NOTION_PROXY_ACCESS_TOKEN = oldSecret;
    if (oldKey === undefined) delete process.env.NOTION_API_KEY; else process.env.NOTION_API_KEY = oldKey;
    globalThis.fetch = oldFetch;
  }
});
