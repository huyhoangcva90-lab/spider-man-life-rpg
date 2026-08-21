/* ==========================================================================
   V4 NOTION SNAPSHOT REPOSITORY
   Read-only snapshot data loader & repository with local fallback defense
   ========================================================================== */

import { NotionNormalizer } from './NotionNormalizer.js';

// Embedded fallback seed data matching app-v4/data/notion-snapshot.json
const EMBEDDED_SNAPSHOT = {
  "metadata": {
    "syncedAt": "2026-08-13T19:27:40.000Z",
    "version": "4.0.0"
  },
  "collections": {
    "masterCalendar": [
      { "id": "384d787636c6812f9f5ac628c57b6444", "title": "Khu còn lại notion", "date": "2026-08-09T08:15:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "As and when", "sourceUrl": "https://app.notion.com/384d787636c6812f9f5ac628c57b6444" },
      { "id": "384d787636c681a494bee6fbb1c2efd9", "title": "Chuẩn hoá Habit 9 Mood", "date": "2026-08-07T08:30:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "Low Priority", "sourceUrl": "https://app.notion.com/384d787636c681a494bee6fbb1c2efd9" },
      { "id": "384d787636c681d98c52df0525328580", "title": "Finance Googlesheet Hoàn chỉnh", "date": "2026-08-05T01:30:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "Low Priority", "sourceUrl": "https://app.notion.com/384d787636c681d98c52df0525328580" },
      { "id": "384d787636c6815c86ade97daa7ab150", "title": "Finance Googlesheet Review", "date": "2026-08-03T09:45:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "As and when", "sourceUrl": "https://app.notion.com/384d787636c6815c86ade97daa7ab150" },
      { "id": "384d787636c68151a22be5b7009b9e15", "title": "Finance Googlesheet Mobile", "date": "2026-08-04T03:15:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "Low Priority", "sourceUrl": "https://app.notion.com/384d787636c68151a22be5b7009b9e15" },
      { "id": "384d787636c6815091bdd0a5870139ce", "title": "Finance Googlesheet Web", "date": "2026-08-03T07:30:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "As and when", "sourceUrl": "https://app.notion.com/384d787636c6815091bdd0a5870139ce" },
      { "id": "384d787636c6815d9369dd1da64dbf50", "title": "Finance Googlesheet Dashboard", "date": "2026-08-03T02:30:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "Low Priority", "sourceUrl": "https://app.notion.com/384d787636c6815d9369dd1da64dbf50" },
      { "id": "384d787636c681019412cd7c3454a6ef", "title": "Khu đọc sách mới", "date": "2026-08-09T09:45:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "As and when", "sourceUrl": "https://app.notion.com/384d787636c681019412cd7c3454a6ef" },
      { "id": "384d787636c681d78445dce6a6e40ab7", "title": "Biểu đồ kinh tế", "date": "2026-08-08T01:15:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "Low Priority", "sourceUrl": "https://app.notion.com/384d787636c681d78445dce6a6e40ab7" },
      { "id": "384d787636c6810fad7ff4c4feaba90d", "title": "Quần thể life", "date": "2026-08-07T07:15:00.000Z", "status": "Upcoming", "done": false, "type": "Work", "priority": "As and when", "sourceUrl": "https://app.notion.com/384d787636c6810fad7ff4c4feaba90d" }
    ],
    "habits": [
      { "id": "272d787636c68113b7d5c3f5d97da959", "name": "Sleep early", "status": "In Progress", "priority": "High", "timeBlock": "Night", "outcome": "Giấc ngủ ngon cho một ngày năng suất", "description": "Ngủ sớm trước 10h30", "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c68113b7d5c3f5d97da959" },
      { "id": "272d787636c681619fa4cc873428fbf1", "name": "Tiếng Anh", "status": "In Progress", "priority": "Critical", "timeBlock": "Before work", "outcome": "Nói chuyện lưu loát với người nước ngoài", "description": "Học tiếng anh 15p mỗi ngày", "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c681619fa4cc873428fbf1" },
      { "id": "272d787636c681bdaa89f4b90096c90b", "name": "Không Game", "status": "In Progress", "priority": "Critical", "timeBlock": "All day", "outcome": "Không còn Nghiện Game", "description": "Chơi game < 180p mỗi ngày", "category": "Resistance", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c681bdaa89f4b90096c90b" },
      { "id": "272d787636c681d49308fcda4da509cd", "name": "Wake up early", "status": "Harder", "priority": "Critical", "timeBlock": "Early morning", "outcome": "Bắt đầu ngày mới sớm hơn làm được nhiều việc hơn", "description": "Dậy sớm", "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c681d49308fcda4da509cd" },
      { "id": "272d787636c681d6ac59e8b05f9b97b4", "name": "Deep work", "status": "In Progress", "priority": "High", "timeBlock": "Before work", "outcome": "Hoàn thiện hơn cho việc tập trung làm việc", "description": "Làm việc tập trung", "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c681d6ac59e8b05f9b97b4" },
      { "id": "272d787636c6811881c5c47b59512196", "name": "Không Tiktok", "status": "Harder", "priority": "Medium", "timeBlock": "All day", "outcome": "Giảm xao nhãng social content ngắn", "description": "Không mở Tiktok trong ngày", "category": "Resistance", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c6811881c5c47b59512196" },
      { "id": "272d787636c6815b9ec4c638beef98f3", "name": "Không Youtube", "status": "Harder", "priority": "Medium", "timeBlock": "All day", "outcome": "Kiểm soát thời gian xem video giải trí", "description": "Hạn chế Youtube giải trí", "category": "Resistance", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c6815b9ec4c638beef98f3" },
      { "id": "272d787636c6817ea28dd58c3a86a02d", "name": "Không Facebook", "status": "Harder", "priority": "Medium", "timeBlock": "All day", "outcome": "Tránh lướt newsfeed vô thức", "description": "Khóa feed Facebook", "category": "Resistance", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c6817ea28dd58c3a86a02d" },
      { "id": "272d787636c68124a78ee8845eecb897", "name": "Straight & Gym", "status": "In Progress", "priority": "Medium", "timeBlock": "Allday", "outcome": null, "description": null, "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c68124a78ee8845eecb897" },
      { "id": "272d787636c6814b828bee38862aab0a", "name": "Fashion", "status": "In Progress", "priority": "Medium", "timeBlock": "Allday", "outcome": null, "description": null, "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c6814b828bee38862aab0a" },
      { "id": "272d787636c68161872adce0dc0c8146", "name": "Economy", "status": "In Progress", "priority": "Medium", "timeBlock": "Allday", "outcome": null, "description": null, "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c68161872adce0dc0c8146" },
      { "id": "272d787636c68197995ad2e1239495de", "name": "Skincare", "status": "In Progress", "priority": "Medium", "timeBlock": "Allday", "outcome": null, "description": null, "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c68197995ad2e1239495de" },
      { "id": "272d787636c681f49ff9cd73d3b59a8a", "name": "Yoga", "status": "In Progress", "priority": "Medium", "timeBlock": "Allday", "outcome": null, "description": null, "category": "Good", "today": false, "yesterday": false, "sourceUrl": "https://app.notion.com/272d787636c681f49ff9cd73d3b59a8a" }
    ],
    "goals": [
      { "id": "272d787636c68150b2f4e78207d2c536", "title": "Phát triển bản thân Bước đi đầu tiên", "goalNumber": 1, "type": "Goal", "achieved": false, "startDate": "2024-10-18T00:00:00.000Z", "targetArea": "Personal Development", "sourceUrl": "https://app.notion.com/272d787636c68150b2f4e78207d2c536" },
      { "id": "272d787636c68152b9ecc96c6b5fdd46", "title": "Không chơi game quá 180p 1 tuần", "type": "Habit", "achieved": false, "targetArea": "Wellness & Focus", "sourceUrl": "https://app.notion.com/272d787636c68152b9ecc96c6b5fdd46" },
      { "id": "272d787636c6815db012c079a8bb5c60", "title": "Tiếng Anh tháng đầu tiên", "type": "Habit", "achieved": false, "targetArea": "Skill Mastery", "sourceUrl": "https://app.notion.com/272d787636c6815db012c079a8bb5c60" },
      { "id": "272d787636c681b7a621dabd530fa62e", "title": "Tuần đầu tiên hoàn thành được thói quen mong muốn", "type": "Habit", "achieved": false, "targetArea": "Habit Systems", "sourceUrl": "https://app.notion.com/272d787636c681b7a621dabd530fa62e" },
      { "id": "272d787636c681ec9949e818b34b1c82", "title": "Ngủ đúng giờ", "type": "Habit", "achieved": false, "targetArea": "Physical Conditioning", "sourceUrl": "https://app.notion.com/272d787636c681ec9949e818b34b1c82" },
      { "id": "2f4d787636c68023a142cb362f8b19ab", "title": "Kiếm đủ tiền trả nợ", "type": "Financial", "achieved": false, "startDate": "2026-01-26T00:00:00.000Z", "targetArea": "Finance", "sourceUrl": "https://app.notion.com/2f4d787636c68023a142cb362f8b19ab" }
    ],
    "daily": [
      { "id": "3bad787636c681b9a541f94fbe6c8068", "date": "2026-08-13", "mood": null, "energy": null, "productivity": null, "logged": false, "sourceUrl": "https://app.notion.com/3bad787636c681b9a541f94fbe6c8068" }
    ],
    "projects": [
      { "id": "2a1d787636c68030a5adedd7bc07c88f", "title": "Project", "status": "Not started", "classified": false, "sourceUrl": "https://app.notion.com/2a1d787636c68030a5adedd7bc07c88f" }
    ],
    "inbox": [
      { "id": "272d787636c68156b0e4f57fcb44c675", "capture": "Inbox phải / Notification: habit / Kcal link / Money / Fashion / Habit / Task", "createdAt": "2026-08-13T12:00:00.000Z", "status": "UNPROCESSED", "sourceUrl": "https://app.notion.com/272d787636c68156b0e4f57fcb44c675" }
    ]
  }
};

export class NotionSnapshotRepository {
  constructor() {
    this.rawSnapshot = EMBEDDED_SNAPSHOT;
    this.syncedAt = EMBEDDED_SNAPSHOT.metadata.syncedAt;
    this.isLoaded = false;
  }

  /**
   * Async load snapshot file with automatic embedded fallback defense
   */
  async loadSnapshot() {
    try {
      const response = await fetch('./data/notion-snapshot.json');
      if (response.ok) {
        const data = await response.json();
        if (data && data.collections) {
          this.rawSnapshot = data;
          this.syncedAt = data.metadata ? data.metadata.syncedAt : this.syncedAt;
        }
      }
    } catch (err) {
      console.warn('[NotionSnapshotRepository] Local fetch failed or offline; using embedded Notion snapshot.', err);
    } finally {
      this.isLoaded = true;
    }
  }

  getSnapshotTime() {
    return this.syncedAt;
  }

  getFormattedSnapshotTime() {
    if (!this.syncedAt) return 'Unknown';
    try {
      return new Date(this.syncedAt).toLocaleString('vi-VN', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' UTC';
    } catch (e) {
      return this.syncedAt;
    }
  }

  getNormalizedMissions() {
    const rawList = this.rawSnapshot.collections.masterCalendar || [];
    return NotionNormalizer.normalizeMasterCalendar(rawList, this.syncedAt);
  }

  getNormalizedHabits() {
    const rawList = this.rawSnapshot.collections.habits || [];
    return NotionNormalizer.normalizeHabits(rawList, this.syncedAt);
  }

  getNormalizedGoals() {
    const rawList = this.rawSnapshot.collections.goals || [];
    return NotionNormalizer.normalizeGoals(rawList, this.syncedAt);
  }

  getNormalizedDaily() {
    const rawList = this.rawSnapshot.collections.daily || [];
    return NotionNormalizer.normalizeDaily(rawList, this.syncedAt);
  }

  getNormalizedProjects() {
    const rawList = this.rawSnapshot.collections.projects || [];
    return NotionNormalizer.normalizeProjects(rawList, this.syncedAt);
  }

  getNormalizedInbox() {
    const rawList = this.rawSnapshot.collections.inbox || [];
    return NotionNormalizer.normalizeInbox(rawList, this.syncedAt);
  }
}

export const notionSnapshotRepository = new NotionSnapshotRepository();
