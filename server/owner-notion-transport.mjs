import notionHandler from '../api/notion.mjs';

// Internal reads use the same owner/Field session and response shape as the proxy.
// Callers expose only fixed read operations or validate incoming mutation origin.
export async function ownerNotionRequest(req, path, options = {}) {
  let status = 500, payload;
  const result = { setHeader() {}, status(code) { status = code; return this; }, json(value) { payload = value; return this; } };
  const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  await notionHandler({ ...req, method: options.method || 'GET',
    headers: { ...req.headers, origin: `https://${req.headers.host}` },
    query: { path }, body }, result);
  return { ok: status >= 200 && status < 300 && payload?.ok === true, status, json: async () => payload?.data || payload || {} };
}
