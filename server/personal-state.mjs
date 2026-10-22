import { NOTION_GAME_DATABASES, normalizeNotionPage } from '../js/integrations/notion/NotionRecords.mjs';

// No persisted personal snapshot is required to render private missions.
export async function readPersonalState(request) {
  const collections = {};
  for (const kind of ['masterCalendar', 'habits', 'goals']) {
    const pages = []; let cursor; const seen = new Set();
    do {
      const response = await request(`/v1/databases/${NOTION_GAME_DATABASES[kind]}/query`, {
        method: 'POST', body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) })
      });
      if (!response.ok) { const error = new Error('Private Notion source unavailable'); error.status = response.status; throw error; }
      const data = await response.json();
      if (!Array.isArray(data.results)) throw new Error('Invalid Notion collection');
      pages.push(...data.results.filter(page => !page.archived && !page.in_trash));
      cursor = data.has_more ? data.next_cursor : null;
      if (data.has_more && (!cursor || seen.has(cursor))) throw new Error('Incomplete Notion pagination');
      if (cursor) seen.add(cursor);
    } while (cursor);
    collections[kind] = pages.map(page => {
      const normalized = normalizeNotionPage(page, kind);
      // Preserve explicit map fields only; do not export page content or journals.
      const p = page.properties || {};
      return { ...normalized, lat: p.Latitude?.number ?? p.Lat?.number ?? null,
        lng: p.Longitude?.number ?? p.Lng?.number ?? null,
        address: (p.Address?.rich_text || []).map(part => part.plain_text || part.text?.content || '').join('') };
    });
  }
  return { metadata: { source: 'private-notion', syncedAt: new Date().toISOString() }, collections };
}
