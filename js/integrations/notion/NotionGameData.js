export * from './NotionRecords.mjs';

export async function queryAllNotionPages(databaseId, fetcher = fetch) {
  const results = [];
  const cursors = new Set();
  let cursor;
  do {
    const response = await fetcher(`/api/notion?path=${encodeURIComponent(`/v1/databases/${databaseId}/query`)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) })
    });
    if (!response.ok) throw new Error(`Notion proxy HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload.ok || !Array.isArray(payload.data?.results)) {
      throw new Error(payload.error || 'Notion response invalid');
    }
    results.push(...payload.data.results);
    cursor = payload.data.has_more ? payload.data.next_cursor : null;
    if (payload.data.has_more && !cursor) throw new Error('Notion pagination cursor missing');
    if (cursor && cursors.has(cursor)) throw new Error('Notion pagination cursor repeated');
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return results;
}

export function readPendingNotionWrites(storage = localStorage) {
  try {
    const value = JSON.parse(storage.getItem('spidey_notion_pending_writes') || '[]');
    return Array.isArray(value) ? value : [];
  } catch (_) { return []; }
}

export function queueNotionWrite(kind, id, storage = localStorage) {
  if (!id) return;
  const writes = readPendingNotionWrites(storage).filter((item) => !(item.kind === kind && item.id === id));
  writes.push({ kind, id });
  storage.setItem('spidey_notion_pending_writes', JSON.stringify(writes));
}

export async function flushPendingNotionWrites(fetcher = fetch, storage = localStorage) {
  const attempted = readPendingNotionWrites(storage);
  const remaining = [];
  for (const item of attempted) {
    // These legacy actions have no date. Keep them for review; never apply them
    // to today's Habit or bypass the dated check-in flow.
    if (item.kind === 'habits') { remaining.push(item); continue; }
    const property = item.kind === 'habits' ? 'Today' : item.kind === 'activeQuests' ? 'Completed' : 'Done';
    try {
      const response = await fetcher(`/api/notion?path=${encodeURIComponent(`/v1/pages/${item.id.replace(/-/g, '')}`)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: { [property]: { checkbox: true } } })
      });
      const payload = response.ok ? await response.json() : null;
      if (!response.ok || !payload?.ok) remaining.push(item);
    } catch (_) { remaining.push(item); }
  }
  const addedDuringFlush = readPendingNotionWrites(storage).filter((item) =>
    !attempted.some((attempt) => attempt.kind === item.kind && attempt.id === item.id));
  const pending = [...remaining, ...addedDuringFlush];
  storage.setItem('spidey_notion_pending_writes', JSON.stringify(pending));
  return pending.length;
}
