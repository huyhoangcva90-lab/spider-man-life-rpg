import { HERO_PAGE_ID, GAME_LOG_DATABASE_ID, publicGameRecord, relationIds, skillIds, cleanId } from '../js/integrations/notion/NotionGameAuthority.mjs';

// Server-side owner-approved display. No arbitrary IDs/paths, private tasks or writes.
export async function readNotionGameState(token, { fetcher = fetch } = {}) {
  const headers = { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' };
  let nextRequestAt = 0;
  async function request(path, body) {
    const startAt = Math.max(Date.now(), nextRequestAt);
    nextRequestAt = startAt + 350;
    if (startAt > Date.now()) await new Promise((resolve) => setTimeout(resolve, startAt - Date.now()));
    const response = await fetcher(`https://api.notion.com/v1/${path}`, { method: body ? 'POST' : 'GET', headers, ...(body ? { body: JSON.stringify(body) } : {}) });
    if (!response.ok) throw new Error(`Notion game display HTTP ${response.status}`);
    return response.json();
  }
  const data = { metadata: { source: 'Notion', syncedAt: new Date().toISOString() } };
  data.profile = publicGameRecord(await request(`pages/${HERO_PAGE_ID}`), 'profile');
  const seen = new Map();
  async function records(kind, ids) {
    const unique = [...new Set(ids.map(cleanId))].filter(Boolean);
    data[kind] = await Promise.all(unique.map(async (id) => {
      if (!seen.has(id)) seen.set(id, request(`pages/${id}`));
      return publicGameRecord(await seen.get(id), kind);
    }));
  }
  const p = data.profile;
  await records('missions', relationIds(p['🚨 Missions']));
  await records('enemies', [...relationIds(p['👹 Bosses & Minion']), ...data.missions.flatMap((mission) => relationIds(mission['Bosses & Minions']))]);
  await records('skills', skillIds(p));
  await records('suits', relationIds(p['Equipped Suit']));
  await records('maps', relationIds(p['Current Map']));
  await records('badges', relationIds(p['🎖️ Badges & Medals']));
  const logs = await request(`databases/${GAME_LOG_DATABASE_ID}/query`, { page_size: 1, filter: { and: [{ property: 'Hero', relation: { contains: HERO_PAGE_ID } }, { or: [{ property: 'Combat Skill', relation: { is_not_empty: true } }, { property: 'Boss Skill', relation: { is_not_empty: true } }] }] }, sorts: [{ timestamp: 'created_time', direction: 'descending' }] });
  data.logs = logs.results.map((page) => publicGameRecord(page, 'logs'));
  return data;
}
