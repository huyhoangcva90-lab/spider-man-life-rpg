/* ==========================================================================
   V5 NOTION SOURCE REGISTRY
   Canonical Notion workspace database boundaries & collection URIs
   ========================================================================== */

export const NOTION_SOURCES = {
  MASTER_CALENDAR: {
    id: 'masterCalendar',
    name: 'Master Calendar',
    collectionUri: 'collection://272d7876-36c6-81a4-ac75-000b15fb6b72',
    collectionId: '272d7876-36c6-81a4-ac75-000b15fb6b72',
    baseUrl: 'https://notion.so/272d787636c681a4ac75000b15fb6b72',
    type: 'Missions / Master Calendar Tasks'
  },
  PROJECTS: {
    id: 'projects',
    name: 'Projects',
    collectionUri: 'collection://272d7876-36c6-8110-8472-000bd57843d8',
    collectionId: '272d7876-36c6-8110-8472-000bd57843d8',
    baseUrl: 'https://notion.so/272d787636c681108472000bd57843d8',
    type: 'Campaigns / Action Projects'
  },
  GOALS: {
    id: 'goals',
    name: 'Goals',
    collectionUri: 'collection://272d7876-36c6-81bf-8132-000bc120d74a',
    collectionId: '272d7876-36c6-81bf-8132-000bc120d74a',
    baseUrl: 'https://notion.so/272d787636c681bf8132000bc120d74a',
    type: 'Story Arcs / Core Goals'
  },
  HABITS: {
    id: 'habits',
    name: 'Habits',
    collectionUri: 'collection://272d7876-36c6-8186-a928-000baf0dc5cb',
    collectionId: '272d7876-36c6-8186-a928-000baf0dc5cb',
    baseUrl: 'https://notion.so/272d787636c68186a928000baf0dc5cb',
    type: 'Training Protocols / Identity Habits'
  },
  DAILY: {
    id: 'daily',
    name: 'Daily',
    collectionUri: 'collection://272d7876-36c6-8159-a810-000b01bef441',
    collectionId: '272d7876-36c6-8159-a810-000b01bef441',
    baseUrl: 'https://notion.so/272d787636c68159a810000b01bef441',
    type: 'Daily Telemetry & Mood'
  },
  INBOX: {
    id: 'inbox',
    name: 'Inbox',
    collectionUri: 'collection://272d7876-36c6-8101-8e6f-000beb8f2030',
    collectionId: '272d7876-36c6-8101-8e6f-000beb8f2030',
    baseUrl: 'https://notion.so/272d787636c681018e6f000beb8f2030',
    type: 'Incoming Signal Quick Capture'
  }
};

export class NotionSourceRegistry {
  static getSourceByCollectionId(collectionId) {
    return Object.values(NOTION_SOURCES).find(src => src.collectionId === collectionId) || null;
  }

  static getSourceUrl(sourceKey, recordSlug = '') {
    const source = NOTION_SOURCES[sourceKey];
    if (!source) return 'https://notion.so';
    if (!recordSlug) return source.baseUrl;
    const slug = recordSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${source.baseUrl}#${slug}`;
  }
}
