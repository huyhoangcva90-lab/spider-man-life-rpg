/* ==========================================================================
   V5 NOTION NORMALIZER
   Truthful provenance-preserving normalizer for raw Notion snapshot entities
   ========================================================================== */

import { NOTION_SOURCES, NotionSourceRegistry } from './NotionSourceRegistry.js';

export class NotionNormalizer {
  /**
   * Map raw Master Calendar task records into Game Missions with district placement
   */
  static normalizeMasterCalendar(rawList = [], syncedAt = '') {
    return rawList.map((item, idx) => {
      const externalId = item.id || `notion-mc-${idx + 1}`;
      const sourceUrl = item.sourceUrl || (item.id ? `https://app.notion.com/${item.id}` : NotionSourceRegistry.getSourceUrl('MASTER_CALENDAR', item.title));
      
      const titleLower = item.title.toLowerCase();

      // District & Domain Mapping for Living City Map
      let districtId = 'district-core';
      let districtName = 'Lõi Trung Tâm';
      let domain = item.type || 'Công Việc';
      let estimatedMinutes = 30;
      let rewardXp = 120;
      let rewardGold = 80;
      let baseBossDamage = 160;

      if (titleLower.includes('finance') || titleLower.includes('googlesheet')) {
        districtId = 'district-finance';
        districtName = 'Khu Tài Chính & Analytics';
        domain = 'Tài Chính & Dữ Liệu';
        estimatedMinutes = 35;
        rewardXp = 140;
        rewardGold = 110;
        baseBossDamage = 180;
      } else if (titleLower.includes('sách') || titleLower.includes('đọc') || titleLower.includes('kinh tế')) {
        districtId = 'district-knowledge';
        districtName = 'Phân Khu Tri Thức';
        domain = 'Tri Thức & Nghiên Cứu';
        estimatedMinutes = 25;
        rewardXp = 100;
        rewardGold = 60;
        baseBossDamage = 130;
      } else if (titleLower.includes('habit') || titleLower.includes('mood')) {
        districtId = 'district-wellness';
        districtName = 'Lưới Thói Quen & Thể Chất';
        domain = 'Thể Chất & Rèn Luyện';
        estimatedMinutes = 20;
        rewardXp = 110;
        rewardGold = 70;
        baseBossDamage = 140;
      } else if (titleLower.includes('life') || titleLower.includes('quần thể')) {
        districtId = 'district-life';
        districtName = 'Tổ Hợp Cuộc Sống';
        domain = 'Hệ Thống Đời Sống';
        estimatedMinutes = 45;
        rewardXp = 160;
        rewardGold = 120;
        baseBossDamage = 220;
      }

      // Priority Mapping
      let priority = 'MEDIUM';
      if (item.priority === 'High' || item.priority === 'Critical') {
        priority = 'HIGH';
      } else if (item.priority === 'Low Priority' || item.priority === 'As and when') {
        priority = 'LOW';
      }

      // Truthful relation check
      const project = item.project || 'Chưa phân loại';
      const area = item.area || 'Chưa phân loại';
      const goal = item.goal || 'Chưa phân loại';

      return {
        // Provenance Metadata
        origin: 'notion_snapshot',
        externalId: externalId,
        sourceUrl: sourceUrl,
        sourceDatabase: NOTION_SOURCES.MASTER_CALENDAR.name,
        collectionId: NOTION_SOURCES.MASTER_CALENDAR.collectionId,
        syncedAt: syncedAt || new Date().toISOString(),

        // Source Notion Fields
        notionStatus: item.status || 'Upcoming',
        notionDone: Boolean(item.done),
        notionType: item.type || 'Work',
        notionPriority: item.priority || 'Low Priority',
        notionDate: item.date || null,
        project: project,
        area: area,
        goal: goal,

        // Unified Game Entity Fields
        id: externalId,
        title: item.title,
        reason: `[Notion Master Calendar] Nhiệm vụ ${item.type || 'Work'} - Hạn chót: ${item.date ? new Date(item.date).toLocaleDateString('vi-VN') : 'Sắp tới'}. Độ ưu tiên: ${item.priority}`,
        description: `Bản ghi nhiệm vụ thực tế từ Notion snapshot (${NOTION_SOURCES.MASTER_CALENDAR.name}). Trạng thái nguồn: ${item.status}.`,
        campaign: project,
        districtId: districtId,
        districtName: districtName,
        domain: domain,
        category: domain,
        priority: priority,
        difficulty: priority === 'HIGH' ? 'HARD' : 'NORMAL',
        estimatedMinutes: estimatedMinutes,
        rewardXp: rewardXp,
        rewardGold: rewardGold,
        baseBossDamage: baseBossDamage,
        attributeGain: {
          name: domain.includes('Tài Chính') ? 'Trí Tuệ' : (domain.includes('Tri Thức') ? 'Kiên Cường' : 'Tập Trung'),
          points: 2
        },
        status: item.done ? 'COMPLETED' : 'PENDING',
        completedAt: item.done ? (syncedAt || new Date().toISOString()) : null,
        createdAt: item.date || new Date().toISOString(),
        tags: ['Notion Snapshot', item.type || 'Work', domain]
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

        // Source Notion metadata (Preserves null values truthfully)
        notionStatus: item.status || 'In Progress',
        notionPriority: item.priority || 'Medium',
        notionTimeBlock: item.timeBlock !== undefined ? item.timeBlock : null,
        notionOutcome: item.outcome !== undefined ? item.outcome : null,
        notionDescription: item.description !== undefined ? item.description : null,

        // Normalized Habit Training Protocol fields
        id: externalId,
        name: item.name,
        category: isBadHabit ? 'Nghị Lực Kháng Cự' : 'Giao Thức Định Hình',
        type: isBadHabit ? 'RESISTANCE' : 'GOOD',
        status: item.status,
        timeBlock: item.timeBlock !== undefined ? item.timeBlock : 'Tự do',
        outcome: item.outcome !== undefined ? item.outcome : 'Chưa nhập mục tiêu',
        description: item.description !== undefined ? item.description : 'Chưa có mô tả',
        
        // Strict Truth Flags from Notion source
        todayCompleted: Boolean(item.today),
        yesterdayCompleted: Boolean(item.yesterday),
        streakCount: 0, // Honest: 0 fake streak

        // Game mechanical effect
        mechanicalEffect: isBadHabit 
          ? 'Giảm chỉ số Nhiễm Độc & Làm yếu Trùm Thành Phố (-15% Sát thương Trùm)' 
          : 'Tăng sức bền Đặc Vụ (+2 Tập Trung, +2 Kiên Cường)'
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
        storyArcType: item.type === 'Goal' ? 'ĐẠI CHƯƠNG CHIẾN LƯỢC' : (item.type === 'Habit' ? 'CỘT MỐC THÓI QUEN' : 'HỢP ĐỒNG TÀI CHÍNH'),
        achieved: Boolean(item.achieved),
        startDate: item.startDate ? new Date(item.startDate).toLocaleDateString('vi-VN') : 'Chưa phân loại',
        targetArea: item.targetArea || 'Chưa phân loại'
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
      statusText: logged ? `Tâm trạng ${item.mood}/10 | Năng lượng ${item.energy}/10` : 'Chưa check-in'
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
        title: item.title || 'Chưa phân loại',
        status: item.status || 'Chưa bắt đầu',
        classified: Boolean(item.classified),
        note: item.classified ? 'Chiến dịch Đã Phân Loại' : 'Chiến dịch Chưa Phân Loại'
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
