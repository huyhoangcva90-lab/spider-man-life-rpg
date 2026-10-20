// The web is a display. Only Notion determines selected skills and combat outcomes.
export const HERO_PAGE_ID = '3d2d7876-36c6-8160-915e-cd84c823577f';
export const GAME_LOG_DATABASE_ID = 'd16b025b84594aa98c9df1856e5e8d48';
export const cleanId = (id) => String(id || '').replace(/-/g, '').toLowerCase();
export const sameId = (a, b) => Boolean(a && b && cleanId(a) === cleanId(b));
export const relationIds = (value) => Array.isArray(value) ? value.filter((id) => typeof id === 'string') : [];
export const linkedRecords = (records, ids) => relationIds(ids).map((id) => (records || []).find((record) => sameId(record.id, id))).filter(Boolean);
export const skillIds = (profile) => [...new Set(Object.entries(profile || {}).filter(([key]) => /^Skill Slot \d+$/.test(key)).flatMap(([, ids]) => relationIds(ids)))];
export const logFingerprint = (log) => log ? JSON.stringify([log.id, log['Resolution Status'], log.Outcome, log['Boss Outcome'], log['Direct Damage'], log['Boss Direct Damage'], log['HP Δ'], log['Enemy HP Δ']]) : '';

// Public scope explicitly approved by the owner: selected game state only.
export const GAME_FIELDS = {
  profile: ['Hero', 'Level', 'Exp', 'HP', 'Max HP', 'Energy', 'Max Energy', 'Equipped Suit', 'Current Map', '🎖️ Badges & Medals', '👹 Bosses & Minion', '🚨 Missions'],
  skills: ['Skill', 'Description', 'Skill Type', 'Energy Cost', 'Cooldown', 'image'],
  suits: ['Suit', 'Image', 'Suit Preview'],
  // The owner separately requested the selected Notion map to drive the public app.
  maps: ['Map', 'Map Key', 'District', 'Weather'],
  badges: ['Medal', 'Image', 'Requirement', 'Unlocked', 'Equipped'],
  missions: ['Encounter', 'Status', 'Bosses & Minions', 'Turn 1 (Wave 1)', 'Turn 2 (Wave 2)', 'Turn 3 (Boss / Climax)', 'Turn 4 (Bonus / Phase 2)'],
  enemies: ['Boss', 'Image', 'Idle Pose', 'Max HP', 'HP - (1)', 'Combat Turn'],
  logs: ['Turn', 'Combat Skill', 'Boss Skill', '👹 Bosses & Minion', 'Outcome', 'Boss Outcome', 'Resolution Status', 'Direct Damage', 'Boss Direct Damage', 'HP Δ', 'Energy Δ', 'Enemy HP Δ']
};

export function propertyValue(property) {
  if (!property) return null;
  const text = (parts) => (parts || []).map((part) => part.plain_text || part.text?.content || '').join('');
  switch (property.type) {
    case 'title': return text(property.title);
    case 'rich_text': return text(property.rich_text);
    case 'number': return property.number;
    case 'checkbox': return property.checkbox;
    case 'formula': return property.formula?.number ?? property.formula?.string ?? property.formula?.boolean ?? null;
    case 'select': return property.select?.name || '';
    case 'status': return property.status?.name || '';
    case 'multi_select': return (property.multi_select || []).map((item) => item.name);
    case 'relation': return (property.relation || []).map((item) => item.id);
    case 'files': return property.files?.[0]?.external?.url || property.files?.[0]?.file?.url || '';
    default: return null;
  }
}

export function publicGameRecord(page, kind) {
  const allowed = new Set(GAME_FIELDS[kind] || []);
  const entries = Object.entries(page.properties || {}).filter(([key]) => allowed.has(key) || (kind === 'profile' && /^Skill Slot \d+$/.test(key)));
  return { id: page.id, sourceUrl: `https://www.notion.so/${cleanId(page.id)}`, ...Object.fromEntries(entries.map(([key, value]) => [key, propertyValue(value)])) };
}

export function selectedGameView(data) {
  const profile = data.profile || {};
  return {
    profile,
    skills: linkedRecords(data.skills, skillIds(profile)),
    suit: linkedRecords(data.suits, profile['Equipped Suit'])[0] || null,
    map: linkedRecords(data.maps, profile['Current Map'])[0] || null,
    badges: linkedRecords(data.badges, profile['🎖️ Badges & Medals']),
    missions: linkedRecords(data.missions, profile['🚨 Missions']),
    enemies: linkedRecords(data.enemies, profile['👹 Bosses & Minion'])
  };
}
