# SPIDEY LIFE — System Architecture & Gamification Engine

> **Triết lý cốt lõi**: "One system, one truth. Kỷ luật đời thực chuyển hóa thành sức mạnh chiến đấu trong game."

---

## 1. Sơ đồ Luồng Tổng thể (Master Architecture Flow)

```text
+-----------------------------------------------------------------------------------+
|                            ĐỜI THỰC & NOTION ZEUS                                 |
|                                                                                   |
|  [Notion: Habits]              [Notion: Master Calendar]       [Notion: Goals]    |
|  - Deep work (XP:3)            - Dự án / Deadline              - Mục tiêu dài hạn |
|  - Straight & Gym (XP:3)       - Lịch trình ngày / tuần                           |
|  - Không Game / Youtube (XP:1) - Trạng thái: Done / Planned                       |
+------------------------------------------+----------------------------------------+
                                           |
                                           | (sync_notion_to_game.ps1 / REST API)
                                           v
+-----------------------------------------------------------------------------------+
|                     DATA LAYER & PERSISTENCE (Local-First)                        |
|                                                                                   |
|                    data/notion-snapshot.json (UTF-8)                              |
|                                     │                                             |
|        ┌────────────────────────────┴─────────────────────────────┐               |
|        ▼                                                          ▼               |
|  [NotionAdapter.js]                                     [LifeDataGateway.js]      |
|  - MapEntryRepository                                   - Embedded Life OS        |
|  - UnlocatedMissionQueue                                - Habits / Timetable UI   |
+-------------------------------------+---------------------------------------------+
                                      |
                           (Khi trạng thái = 'DONE')
                                      v
+-----------------------------------------------------------------------------------+
|                        GAME DOMAIN ENGINES (Core Logic)                           |
|                                                                                   |
|        ┌─────────────────────────────────────────────────────────┐                |
|        │                       QuestEngine                       │                |
|        │  - Normalize nhiệm vụ (Reward-Once, Chống spam farm)    │                |
|        │  - Gán ActionID tương ứng (Basic Combo, Web Shot,...)   │                |
|        │  - Cập nhật Daily Streak & Daily Count                  │                |
|        └────────────────────────────┬────────────────────────────┘                |
|                                     │                                             |
|        ┌────────────────────────────┴────────────────────────────┐                |
|        ▼                                                         ▼                |
|  [CombatEngine + DamageEngine]                           [RewardEngine]           |
|  - Tính sát thương theo hệ số                            - Cấp phát XP & Coins    |
|  - Tích Stagger / Phá kháng cự kẻ thù                    - Mở khóa Skill Tree     |
|  - Kích hoạt Boss Phase (Green Goblin)                   - Bảo vệ Unique Loot     |
|  - Mở khóa đòn kết liễu: FINISHER                        - Lưu trữ LocalStorage   |
+-------------------------------------+---------------------------------------------+
                                      |
                              (Game Events Bus)
                                      v
+-----------------------------------------------------------------------------------+
|                              PRESENTATION LAYER                                   |
|                                                                                   |
|  [Hero Animation Controller]              [Arena HUD & Comic VFX]                 |
|  - 17 Sprite States (Idle -> Victory)     - Thanh HP, Web Energy, Ultimate %      |
|  - Hiệu ứng: THWIP! POW! KRAK!            - Âm thanh: Spidey Jingle, Comic Alert  |
|  - Shake màn hình & Combo Text            - Cổng điều hướng 5 Modes               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Bảng Quy đổi Gamification (Notion -> In-game Combat)

Mỗi nhiệm vụ ngoài đời khi bạn tích hoàn thành sẽ kích hoạt các đòn đánh tương ứng:

| Loại Nhiệm Vụ (Notion) | Ví Dụ Thực Tế | Kỹ Năng Kích Hoạt | Tác Dụng Trong Trận Đấu | Phần Thưởng |
| :--- | :--- | :--- | :--- | :--- |
| **Habits: Tập trung cao** | `Deep work`, `Straight & Gym` | **Impact Web / Heavy Combo** | Gây lượng sát thương lớn, tăng mạnh Stagger | +3 XP, +Web Coins, Tăng Ultimate |
| **Habits: Kỷ luật bản thân** | `Không Game`, `Không Youtube` | **Web Shot** | Trói chân kẻ thù, nạp Web Energy | +1 XP, Tăng Streak |
| **Habits: Phát triển cá nhân** | `Tiếng Anh`, `Yoga`, `Economy` | **Venom Assist (Miles Call)** | Gọi Miles Morales hỗ trợ đòn phối hợp | +2 XP, Tăng Affinity |
| **Master Calendar: Milestone** | Hoàn thành dự án lớn | **ULTIMATE FINISHER** | Kết liễu Boss, chuyển Chapter cốt truyện | Thăng cấp Rank, Unique Gear |

---

## 3. Chuỗi Kẻ Thù Trong Vertical Slice (Encounter Progression)

1. **Street Thug** *(Máu thấp, làm quen nhịp độ)*
2. **Tech Gunner** *(Kháng đòn xa, yêu cầu combo áp sát)*
3. **Shield Enemy** *(Kháng sát thương trực diện, yêu cầu Stagger)*
4. **Hunter Captain (Elite)** *(Sát thương cao, cơ chế phản đòn)*
5. **Green Goblin (Boss)** *(3 Phase biến đổi: Đột kích lượn glider, bom bí ngô, giáp cường hóa)*
