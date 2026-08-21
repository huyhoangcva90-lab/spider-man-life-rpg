/* ==========================================================================
   V4 NOTION NORMALIZER
   Pure provenance-preserving normalizer for raw Notion snapshot entities
   ========================================================================== */

import { NOTION_SOURCES, NotionSourceRegistry } from './NotionSourceRegistry.js';

export class NotionNormalizer {
  /**
   * Normalize raw Master Calendar task records into Game Missions
   */
  static normalizeMasterCalendar(rawList = [], syncedAt = '') {
    return rawList.map((item, idx) => {
      const externalId = item.id || `notion-mc-${idx + 1}`;
      const sourceUrl = item.sourceUrl || (item.id ? `https://app.notion.com/${item.id}` : NotionSourceRegistry.getSourceUrl('MASTER_CALENDAR', item.title));
      
      // Derived game values based on task properties
      let domain = item.area || item.type || 'Work';
      let campaign = item.project || null;
      let estimatedMinutes = 30;
      let rewardXp = 120;
      let rewardGold = 80;
      let baseBossDamage = 160;

      if (item.title.toLowerCase().includes('finance') || item.title.toLowerCase().includes('googlesheet')) {
        domain = 'Finance & Analytics';
        estimatedMinutes = 35;
        rewardXp = 140;
        rewardGold = 110;
        baseBossDamage = 180;
      } else if (item.title.toLowerCase().includes('sách') || item.title.toLowerCase().includes('đọc')) {
        domain = 'Knowledge Base';
        estimatedMinutes = 25;
        rewardXp = 100;
        rewardGold = 60;
        baseBossDamage = 130;
      } else if (item.title.toLowerCase().includes('habit') || item.title.toLowerCase().includes('mood')) {
        domain = 'Wellness & Systems';
        estimatedMinutes = 20;
        rewardXp = 110;
        rewardGold = 70;
        baseBossDamage = 140;
      } else if (item.title.toLowerCase().includes('life') || item.title.toLowerCase().includes('quần thể')) {
        domain = 'Life Operating System';
        estimatedMinutes = 45;
        rewardXp = 160;
        rewardGold = 120;
        baseBossDamage = 220;
      }

      // Priority mapping
      let priority = 'MEDIUM';
      if (item.priority === 'High' || item.priority === 'Critical') {
        priority = 'HIGH';
      } else if (item.priority === 'Low Priority' || item.priority === 'As and when') {
        priority = 'LOW';
      }

      return {
        // Provenance metadata (Required)
        origin: 'notion_snapshot',
        externalId: externalId,
        sourceUrl: sourceUrl,
        sourceDatabase: NOTION_SOURCES.MASTER_CALENDAR.name,
        collectionId: NOTION_SOURCES.MASTER_CALENDAR.collectionId,
        syncedAt: syncedAt || new Date().toISOString(),

        // Original Notion source metadata
        notionStatus: item.status || 'Upcoming',
        notionDone: Boolean(item.done),
        notionType: item.type || 'Work',
        notionPriority: item.priority || 'Low Priority',
        notionDate: item.date || null,
        project: item.project || null,
        area: item.area || null,
        goal: item.goal || null,

        // Unified Game Entity Fields
        id: externalId,
        title: item.title,
        reason: `[Notion Master Calendar] ${item.type || 'Work'} mission due ${item.date ? new Date(item.date).toLocaleDateString() : 'soon'}. Priority: ${item.priority}.`,
        description: `Source Notion Task synced from Master Calendar (${NOTION_SOURCES.MASTER_CALENDAR.collectionUri}). Original status: ${item.status}.`,
        campaign: campaign,
        domain: domain,
        category: domain,
        priority: priority,
        difficulty: priority === 'HIGH' ? 'HARD' : 'NORMAL',
        estimatedMinutes: estimatedMinutes,
        rewardXp: rewardXp,
        rewardGold: rewardGold,
        baseBossDamage: baseBossDamage,
        attributeGain: {
          name: domain.includes('Finance') ? 'Intelligence' : (domain.includes('Knowledge') ? 'Resilience' : 'Focus'),
          points: 2
        },
        status: item.done ? 'COMPLETED' : 'PENDING',
        completedAt: item.done ? (syncedAt || new Date().toISOString()) : null,
        createdAt: item.date || new Date().toISOString(),
        tags: ['Notion', item.type || 'Work', domain]
      };
    });
  }

  /**
   * Normalize raw Habit records into Training Protocols
   */
  static normalizeHabits(rawList = [], syncedAt = '') {
    return rawList.map((item, idx) => {
      const externalId = item.id || `notion-hb-${idx + 1}`;
      const sourceUrl = item.sourceUrl || (item.id ? `https://app.notion.com/${item.id}` : NotionSourceRegistry.getSourceUrl('HABITS', item.name));

      const isBadHabit = item.category === 'Resistance' || item.name.startsWith('Không ');

      return {
        origin: 'notion_snapshot',
        externalId: externalId,
        sourceUrl: sourceUrl,
        sourceDatabase: NOTION_SOURCES.HABITS.name,
        collectionId: NOTION_SOURCES.HABITS.collectionId,
        syncedAt: syncedAt || new Date().toISOString(),

        // Source Notion metadata (Preserve null values truthfully)
        notionStatus: item.status || 'In Progress',
        notionPriority: item.priority || 'Medium',
        notionTimeBlock: item.timeBlock !== undefined ? item.timeBlock : null,
        notionOutcome: item.outcome !== undefined ? item.outcome : null,
        notionDescription: item.description !== undefined ? item.description : null,

        // Normalized Habit Training Protocol fields
        id: externalId,
        name: item.name,
        category: isBadHabit ? 'Resistance Protocol' : 'Identity Protocol',
        type: isBadHabit ? 'RESISTANCE' : 'GOOD',
        status: item.status,
        timeBlock: item.timeBlock !== undefined ? item.timeBlock : null,
        outcome: item.outcome !== undefined ? item.outcome : null,
        description: item.description !== undefined ? item.description : null,
        
        // Strict Truth Flags from Notion source
        todayCompleted: Boolean(item.today),
        yesterdayCompleted: Boolean(item.yesterday),
        streakCount: 0, // Honest: 0 fake streak

        // Game system impact
        statBonus: isBadHabit ? 'Reduces Corruption & Boss Threat' : 'Builds Operative Attributes (+Resilience/+Focus)'
      };
    });
  }

  /**
   * Normalize raw Goal records into Story Arcs
   */
  static normalizeGoals(rawList = [], syncedAt = '') {
    return rawList.map((item, idx) => {
      const externalId = item.id || `notion-gl-${idx + 1}`;
      const sourceUrl = item.sourceUrl || NotionSourceRegistry.getSourceUrl('GOALS', item.title);

      return {
        externalId: externalId,
        sourceUrl: sourceUrl,
        sourceDatabase: NOTION_SOURCES.GOALS.name,
        collectionId: NOTION_SOURCES.GOALS.collectionId,
        syncedAt: syncedAt || new Date().toISOString(),

        // Source metadata
        notionType: item.type || 'Goal',
        notionAchieved: Boolean(item.achieved),
        notionStartDate: item.startDate || null,
        goalNumber: item.goalNumber || null,

        // Game Story Arc fields
        id: externalId,
        title: item.title,
        storyArcType: item.type === 'Goal' ? 'MASTER_STORY_ARC' : (item.type === 'Habit' ? 'HABIT_MILESTONE' : 'FINANCIAL_CONTRACT'),
        achieved: Boolean(item.achieved),
        startDate: item.startDate,
        targetArea: item.targetArea || 'Core Identity'
      };
    });
  }

  /**
   * Normalize Daily records into Daily Operative Telemetry
   */
  static normalizeDaily(rawList = [], syncedAt = '') {
    if (!rawList || rawList.length === 0) {
      return {
        externalId: 'notion-dy-latest',
        sourceUrl: NotionSourceRegistry.getSourceUrl('DAILY'),
        sourceDatabase: NOTION_SOURCES.DAILY.name,
        syncedAt: syncedAt || new Date().toISOString(),
        date: '2026-08-13',
        mood: null,
        energy: null,
        productivity: null,
        logged: false,
        statusText: 'Chưa check-in'
      };
    }

    const item = rawList[0];
    const logged = item.mood !== null && item.energy !== null && item.productivity !== null && item.logged === true;

    return {
      externalId: item.id || 'notion-dy-latest',
      sourceUrl: item.sourceUrl || NotionSourceRegistry.getSourceUrl('DAILY'),
      sourceDatabase: NOTION_SOURCES.DAILY.name,
      collectionId: NOTION_SOURCES.DAILY.collectionId,
      syncedAt: syncedAt || new Date().toISOString(),
      date: item.date || '2026-08-13',
      mood: item.mood,
      energy: item.energy,
      productivity: item.productivity,
      logged: logged,
      statusText: logged ? `Mood ${item.mood}/10 | Energy ${item.energy}/10` : 'Chưa check-in'
    };
  }

  /**
   * Normalize Projects records into Campaigns
   */
  static normalizeProjects(rawList = [], syncedAt = '') {
    return rawList.map((item, idx) => {
      const externalId = item.id || `notion-pj-${idx + 1}`;
      const sourceUrl = item.sourceUrl || NotionSourceRegistry.getSourceUrl('PROJECTS', item.title);

      return {
        externalId: externalId,
        sourceUrl: sourceUrl,
        sourceDatabase: NOTION_SOURCES.PROJECTS.name,
        collectionId: NOTION_SOURCES.PROJECTS.collectionId,
        syncedAt: syncedAt || new Date().toISOString(),
        id: externalId,
        title: item.title,
        status: item.status || 'Not started',
        classified: Boolean(item.classified),
        note: item.classified ? 'Classified Campaign' : 'Unclassified Campaign needing processing'
      };
    });
  }

  /**
   * Normalize Inbox records into Incoming Signal Captures
   */
  static normalizeInbox(rawList = [], syncedAt = '') {
    return rawList.map((item, idx) => {
      const externalId = item.id || `notion-ib-${idx + 1}`;
      const sourceUrl = item.sourceUrl || NotionSourceRegistry.getSourceUrl('INBOX');

      return {
        externalId: externalId,
        sourceUrl: sourceUrl,
        sourceDatabase: NOTION_SOURCES.INBOX.name,
        collectionId: NOTION_SOURCES.INBOX.collectionId,
        syncedAt: syncedAt || new Date().toISOString(),
        id: externalId,
        capture: item.capture,
        createdAt: item.createdAt || new Date().toISOString(),
        status: item.status || 'UNPROCESSED'
      };
    });
  }
}
