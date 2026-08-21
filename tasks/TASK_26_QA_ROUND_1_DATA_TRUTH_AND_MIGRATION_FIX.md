# TASK 26: QA Round 1 — Data Truth and Migration Fix

## QA verdict

Round 1 failed. The visual shell is improved, but the application violates the core "one system, one truth" acceptance criteria.

Work only inside `app-v4/`.

## Blocking defects observed in the rendered app

1. World still selects legacy sample mission `Deliver Database Schema` instead of a real Notion mission.
2. Missions shows legacy fabricated tasks (`Deliver Database Schema`, `Client Lead Generation Call`) before real Notion records.
3. Legacy sample links resolve only to `https://notion.so` or undefined.
4. Snapshot URLs were fabricated from collection IDs plus hash slugs. Those are not real record URLs.
5. Hero fabricates missing habit outcomes/descriptions/time blocks for records whose Notion values are null. Examples: `Straight & Gym`, `Fashion`, `Economy`, `Skincare`, and `Yoga` received invented copy.
6. The hidden snapshot modal remains in the accessibility tree when closed.
7. Desktop/mobile top HUD still labels the app `NOTION SYNCED`, which implies live synchronization. Use `SNAPSHOT LOADED` or `NOTION SNAPSHOT` instead.

## Required fixes

### A. Real Notion missions must drive the game

- When a Notion snapshot exists, active World mission selection must prioritize incomplete normalized Master Calendar records.
- Legacy sample actions must remain preserved for save compatibility but be marked `origin: local_demo` and hidden from default World/Missions filters.
- Add an optional `Local sandbox` filter in Missions if needed; never mix demo data into the real Upcoming count.
- The initial active mission should be a real Notion mission such as `Khu còn lại notion` or the highest-ranked real source mission.
- Living City Web nodes must derive from the selected real record. If Project/Area/Goal is missing, show `Chưa phân loại` and an open/broken strand—not `Client Alpha Portal`, `Engineering`, or another fabricated relation.

### B. Replace fabricated links with real record URLs

Use these exact URLs in `notion-snapshot.json` and derive `externalId` from the final ID:

#### Master Calendar
- Khu còn lại notion: `https://app.notion.com/384d787636c6812f9f5ac628c57b6444`
- Chuẩn hoá Habit 9 Mood: `https://app.notion.com/384d787636c681a494bee6fbb1c2efd9`
- Finance Googlesheet Hoàn chỉnh: `https://app.notion.com/384d787636c681d98c52df0525328580`
- Finance Googlesheet Review: `https://app.notion.com/384d787636c6815c86ade97daa7ab150`
- Finance Googlesheet Mobile: `https://app.notion.com/384d787636c68151a22be5b7009b9e15`
- Finance Googlesheet Web: `https://app.notion.com/384d787636c6815091bdd0a5870139ce`
- Finance Googlesheet Dashboard: `https://app.notion.com/384d787636c6815d9369dd1da64dbf50`
- Khu đọc sách mới: `https://app.notion.com/384d787636c681019412cd7c3454a6ef`
- Biểu đồ kinh tế: `https://app.notion.com/384d787636c681d78445dce6a6e40ab7`
- Quần thể life: `https://app.notion.com/384d787636c6810fad7ff4c4feaba90d`

#### Habits
- Sleep early: `https://app.notion.com/272d787636c68113b7d5c3f5d97da959`
- Không Tiktok: `https://app.notion.com/272d787636c6811881c5c47b59512196`
- Straight & Gym: `https://app.notion.com/272d787636c68124a78ee8845eecb897`
- Fashion: `https://app.notion.com/272d787636c6814b828bee38862aab0a`
- Không Youtube: `https://app.notion.com/272d787636c6815b9ec4c638beef98f3`
- Economy: `https://app.notion.com/272d787636c68161872adce0dc0c8146`
- Tiếng Anh: `https://app.notion.com/272d787636c681619fa4cc873428fbf1`
- Không Facebook: `https://app.notion.com/272d787636c6817ea28dd58c3a86a02d`
- Skincare: `https://app.notion.com/272d787636c68197995ad2e1239495de`
- Không Game: `https://app.notion.com/272d787636c681bdaa89f4b90096c90b`
- Wake up early: `https://app.notion.com/272d787636c681d49308fcda4da509cd`
- Deep work: `https://app.notion.com/272d787636c681d6ac59e8b05f9b97b4`
- Yoga: `https://app.notion.com/272d787636c681f49ff9cd73d3b59a8a`

#### Goals
- Phát triển bản thân Bước đi đầu tiên: `https://app.notion.com/272d787636c68150b2f4e78207d2c536`
- Không chơi game quá 180p 1 tuần: `https://app.notion.com/272d787636c68152b9ecc96c6b5fdd46`
- Tiếng Anh tháng đầu tiên: `https://app.notion.com/272d787636c6815db012c079a8bb5c60`
- Tuần đầu tiên hoàn thành được thói quen mong muốn: `https://app.notion.com/272d787636c681b7a621dabd530fa62e`
- Ngủ đúng giờ: `https://app.notion.com/272d787636c681ec9949e818b34b1c82`
- Kiếm đủ tiền trả nợ: `https://app.notion.com/2f4d787636c68023a142cb362f8b19ab`

#### Other
- Latest Daily source: `https://app.notion.com/3bad787636c681b9a541f94fbe6c8068`
- Project: `https://app.notion.com/2a1d787636c68030a5adedd7bc07c88f`
- Inbox: `https://app.notion.com/272d787636c68156b0e4f57fcb44c675`

### C. Never fill missing source data with invented personal content

- Preserve null values as null through normalization.
- Render `Chưa có mô tả`, `Chưa đặt kết quả`, or `Chưa phân loại` where values are missing.
- Only game-derived fields such as difficulty, XP, damage, and attribute mapping may be inferred. Label them `Game-derived` in the detail UI.
- Time block must match the real Notion value. `Straight & Gym`, `Fashion`, `Economy`, `Skincare`, and `Yoga` are `Allday`, not invented Morning/Afternoon/Night values.

### D. Accessibility and truthful sync state

- Closed dialogs must use `hidden` or be conditionally absent from DOM/accessibility tree.
- Replace `NOTION SYNCED` with `NOTION SNAPSHOT` or `SNAPSHOT LOADED` everywhere.
- Snapshot info dialog must explain that refresh is performed by the connected sync pipeline, without pretending the browser performed a live request.

## Migration and idempotency

- Existing local XP, gold, boss HP/armor and ledger must remain intact.
- Merge normalized Notion records by `externalId`; do not duplicate them on every reload.
- Do not select a completed Notion mission as the active World beacon.

## Acceptance tests

- World heading uses a real Vietnamese Master Calendar record, not either legacy demo task.
- World Open in Notion has a real `https://app.notion.com/<record-id>` URL.
- Living City Web shows open/unclassified Project/Area/Goal when the source relation is null.
- Missions default count excludes demo tasks.
- Hero displays no invented outcomes/descriptions for null records.
- Closed dialogs are absent from the accessibility snapshot.
- Desktop and 390px mobile render without regression.
- JS syntax and console checks pass.

Report changed files and the exact migration/selection rule applied.
