// Private projection: only Routine and its explicit relations. Never a public snapshot.
export const ROUTINE_DATABASE = '272d7876-36c6-8111-8129-d3f09218cb2f';
const text = (value) => (value || []).map(part => part.plain_text || part.text?.content || '').join('');
export function startMinute(time) {
  const match = String(time).match(/^(\d{1,2}):(\d{2})/);
  return match && +match[1] < 24 && +match[2] < 60 ? +match[1] * 60 + +match[2] : Infinity;
}
export function projectItem(page) {
  const p = page.properties || {};
  return {
    id: page.id, name: text(Object.values(p).find(v => v.type === 'title')?.title),
    url: `https://www.notion.so/${page.id.replaceAll('-', '')}`,
    description: text(p.Description?.rich_text),
    status: p.Status?.status?.name || p.Status?.select?.name || '',
    timeblock: p.Timeblock?.select?.name || '', type: p.Type?.select?.name || '',
    today: p.Today?.type === 'checkbox' ? p.Today.checkbox : null,
    icon: page.icon?.type === 'emoji' ? page.icon.emoji : null
  };
}
export async function loadRoutine(token, request = fetch) {
  const call = async (path, body) => {
    const res = await request(`https://api.notion.com/v1/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) throw new Error('Notion request failed');
    return res.json();
  };
  const list = async (path, body) => {
    const rows = []; let cursor;
    do {
      const data = await call(body ? path : `${path}${cursor ? `&start_cursor=${cursor}` : ''}`,
        body ? { ...body, ...(cursor ? { start_cursor: cursor } : {}) } : undefined);
      rows.push(...data.results); cursor = data.has_more ? data.next_cursor : null;
      if (data.has_more && !cursor) throw new Error('Incomplete Notion response');
    } while (cursor);
    return rows;
  };
  const pages = await list(`databases/${ROUTINE_DATABASE}/query`, { page_size: 100 });
  const cache = new Map();
  const resolve = async (page, name) => {
    const prop = page.properties[name];
    if (!prop) return [];
    const relations = prop.has_more
      ? (await list(`pages/${page.id}/properties/${encodeURIComponent(prop.id)}?page_size=100`)).map(row => row.relation)
      : prop.relation || [];
    const items = [];
    // Sequential requests avoid bursts into Notion's rate limit.
    for (const relation of relations) {
      if (!cache.has(relation.id)) {
        const linked = await call(`pages/${relation.id}`);
        cache.set(relation.id, linked.archived || linked.in_trash ? null : projectItem(linked));
      }
      if (cache.get(relation.id)) items.push(cache.get(relation.id));
    }
    return items;
  };
  const routines = [];
  for (const page of pages.filter(p => !p.archived && !p.in_trash)) {
    routines.push({ ...projectItem(page), time: text(page.properties.Time?.rich_text),
      habits: await resolve(page, 'Habits'), skincare: await resolve(page, 'Skincare product'),
      haircare: await resolve(page, 'Haircare product') });
  }
  routines.sort((a,b) => startMinute(a.time) - startMinute(b.time) || a.name.localeCompare(b.name));
  return { routines, syncedAt: new Date().toISOString(), timezone: 'Asia/Ho_Chi_Minh' };
}
