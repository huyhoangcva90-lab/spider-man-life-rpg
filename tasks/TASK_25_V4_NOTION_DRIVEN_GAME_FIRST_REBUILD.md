# TASK 25: V4 Notion-Driven Game-First Rebuild

## Objective

Transform `app-v4/` from a styled productivity dashboard into a convincing life-RPG whose missions, campaigns, training, condition, and story arcs are visibly driven by the user's real Notion data.

Work only in `app-v4/`. Do not touch legacy root files. Write all deliverables into the workspace, never Antigravity scratch.

Product plan in Notion: `https://app.notion.com/p/3bbd787636c681058a77d5a5ea97c1d7`

## Canonical product philosophy from the user's Notion system

- One system, one truth.
- Capture everything, process deliberately: Inbox -> Master Calendar -> Project -> Area -> Goal.
- Data over feeling: tasks, focus time, habits, mood, energy, and productivity are measurable.
- Structure enables freedom: PARA for action and Zettelkasten for knowledge.
- Identity-based habits: each repeated action reinforces the person the user wants to become.
- Daily feedback loop: Capture -> Process -> Execute -> Track -> Measure -> Reflect.

The UI must make these relationships feel like game systems, not database tables.

## Required Notion integration boundary

Implement a read-only, provenance-preserving Notion data layer:

```text
app-v4/js/integrations/notion/
  NotionSourceRegistry.js
  NotionNormalizer.js
  NotionSnapshotRepository.js
app-v4/data/notion-snapshot.json
```

Every normalized entity must keep:

- `externalId`
- `sourceUrl`
- `sourceDatabase`
- `syncedAt`
- original status/date metadata where applicable

Never include a Notion token, API secret, cookie, or private credential in browser code. This milestone uses a real read-only snapshot produced through the connected Notion workspace. Add a clearly named `Refresh snapshot` affordance that explains the current snapshot time and does not pretend the static browser can call Notion directly.

Source registry:

- Master Calendar: `collection://272d7876-36c6-81a4-ac75-000b15fb6b72`
- Projects: `collection://272d7876-36c6-8110-8472-000bd57843d8`
- Goals: `collection://272d7876-36c6-81bf-8132-000bc120d74a`
- Habits: `collection://272d7876-36c6-8186-a928-000baf0dc5cb`
- Daily: `collection://272d7876-36c6-8159-a810-000b01bef441`
- Inbox: `collection://272d7876-36c6-8101-8e6f-000beb8f2030`

## Real snapshot records to seed

Use these real records exactly; do not rename them into fake client work.

### Missions from Master Calendar

All are currently `Upcoming`, `Done=false`, `Type=Work`, priority includes `As and when` and `Low Priority`:

- `Khu còn lại notion` — 2026-08-09 08:15Z
- `Chuẩn hoá Habit 9 Mood` — 2026-08-07 08:30Z
- `Finance Googlesheet Hoàn chỉnh` — 2026-08-05 01:30Z
- `Finance Googlesheet Review` — 2026-08-03 09:45Z
- `Finance Googlesheet Mobile` — 2026-08-04 03:15Z
- `Finance Googlesheet Web` — 2026-08-03 07:30Z
- `Finance Googlesheet Dashboard` — 2026-08-03 02:30Z
- `Khu đọc sách mới` — 2026-08-09 09:45Z
- `Biểu đồ kinh tế` — 2026-08-08 01:15Z
- `Quần thể life` — 2026-08-07 07:15Z

### Habits / training protocols

- `Sleep early`: In Progress, High, Night, outcome `Giấc ngủ ngon cho một ngày năng suất`, description `Ngủ sớm trước 10h30`.
- `Tiếng Anh`: In Progress, Critical, Before work, outcome `Nói chuyện lưu loát với người nước ngoài`, description `Học tiếng anh 15p mỗi ngày`.
- `Không Game`: In Progress, Critical, All day, outcome `Không còn Nghiện Game`, description `Chơi game < 180p mỗi ngày`.
- `Wake up early`: Harder, Critical, Early morning, outcome `Bắt đầu ngày mới sớm hơn làm được nhiều việc hơn`, description `Dậy sớm`.
- `Deep work`: In Progress, High, Before work, outcome `Hoàn thiện hơn cho việc tập trung làm việc`, description `Làm việc tập trung`.
- `Không Tiktok`, `Không Youtube`, `Không Facebook`: Harder, Medium, bad habits.
- `Straight & Gym`, `Fashion`, `Economy`, `Skincare`, `Yoga`: In Progress.

All current `Today` and `Yesterday` habit flags are false. Represent that honestly; do not show a fake streak.

### Goals / story arcs

- `Phát triển bản thân Bước đi đầu tiên` — Goal #1, Type Goal, not achieved, start 2024-10-18.
- `Không chơi game quá 180p 1 tuần` — Type Habit, not achieved.
- `Tiếng Anh tháng đầu tiên` — Type Habit, not achieved.
- `Tuần đầu tiên hoàn thành được thói quen mong muốn` — Type Habit, not achieved.
- `Ngủ đúng giờ` — Type Habit, not achieved.
- `Kiếm đủ tiền trả nợ` — not achieved, start 2026-01-26.

### Daily operative condition

Latest Daily records for 2026-08-13 currently have no Mood, Energy, or Productivity and all habit flags false. Show `Chưa check-in` / `Not logged`; never invent a high energy value.

### Projects and Inbox

- Projects currently contains a single generic `Project`, status `Not started`, unclassified. Render it as an unclassified campaign needing processing, not a rich fabricated campaign.
- Inbox contains one long capture beginning `Inbox phải / Notification: habit / Kcal link / Money / Fashion / Habit / Task`. Show it as an incoming signal needing clarification.

## Game-first information architecture

Replace the current generic Command/Campaigns/Build/Archive/Review language with five game-native destinations:

1. **World** — today state, city districts/Areas, active threat.
2. **Missions** — Master Calendar, Inbox signals, priority and focus.
3. **Hero** — identity, attributes, daily condition, habit training.
4. **Arsenal** — Spider variants, suits, skills, gadgets, allies.
5. **Chronicle** — goals/story arcs, campaigns/projects, ledger and reviews.

Hash routes must work. Mobile bottom dock contains exactly these five destinations; Focus is a contextual primary action, not a sixth navigation item.

## World screen layout — game first, not dashboard

The first viewport must read like a playable game hub:

- Full-width living city/world stage using original CSS and inline SVG: city silhouette, district nodes, parallax depth, day-state tint. No copied map tiles or remote imagery.
- A controlled original Spider operative illustration/silhouette is the hero anchor. Do not use an unrelated face or false Marvel screenshot.
- One active real mission is selected from Notion and appears as a mission beacon in the world.
- Active Doc Ock threat remains, but its encounter must be visually integrated into the world rather than isolated in a card.
- A compact HUD shows operative condition, XP, currency, and Notion snapshot status.
- Primary CTA is `Bắt đầu nhiệm vụ` / `Hoàn thành nhiệm vụ`, with predicted XP, attribute and encounter effect.
- Supporting UI becomes overlays, drawers, mission panels and radial/route elements—not an equal-card dashboard grid.

## Missions screen

- Render the real Master Calendar missions with source badges and `Open in Notion` deep links.
- Provide Today / Upcoming / Inbox / Completed filters.
- Preserve original status, date, type and priority.
- Use a mission detail drawer with game difficulty, estimated focus block and derived rewards. Clearly mark game-derived values versus Notion source values.
- Completing locally must remain idempotent and must not claim it changed Notion.

## Hero screen

- Character sheet with adult freelancer identity and meaningful attributes.
- Daily condition must use real Daily values. Missing Mood/Energy/Productivity shows a check-in call to action.
- Habits become `Training protocols`; show real name, status, time block, desired identity/outcome and today's truth.
- Good and bad habits have different mechanics: good habits build attributes; resistance habits reduce threat/corruption.
- No fake streaks when the source provides no completed day.

## Arsenal and Chronicle

- Arsenal keeps the existing five-item equipped loadout and creates high-quality collection layout placeholders for future Spider variants, suits, skills and gadgets.
- Chronicle maps Notion Goal -> Story Arc, Project -> Campaign and Area -> City District.
- Preserve incomplete/unclassified relationships instead of fabricating them.

## Visual and mobile quality

- The last pass is still too card/dashboard based. Break the grid.
- Signature visual is now the **living city web**: mission beacons and web routes reveal Task -> Project -> Area -> Goal. Missing links appear as broken/open strands, which becomes a useful gameplay prompt.
- Use one orchestrated transition per major action. Avoid ambient motion everywhere.
- At 360–430px, World is a vertical game scene with sticky contextual CTA, compact HUD, swipeable mission tray and five-item bottom dock.
- No desktop rail on mobile, no sixth center nav button, no clipped text, no horizontal page overflow.
- Reward report remains a usable mobile bottom sheet.
- Inline SVG/CSS/local assets only. No remote images and no emoji as UI icons.
- Keep accessibility, focus states and reduced motion.

## Compatibility requirements

- Preserve V4 local save and existing idempotent reward transaction.
- Migrate older `spidey_v4_state` defensively without erasing user progress.
- Notion snapshot data and local game progress are separate layers.
- Local completion stores source external ID and transaction ID.

## Acceptance criteria

- The app visibly uses the real Vietnamese Notion task, goal and habit names above.
- Every imported record keeps a working Notion source URL.
- UI says when the snapshot was last refreshed and does not fake live sync.
- World/Missions/Hero/Arsenal/Chronicle routes all render meaningful screens.
- World first viewport looks like a game hub rather than a productivity dashboard.
- Mobile 360x800 and 390x844 show mission CTA and a five-destination dock without overflow.
- Daily unknown values are honest; habit streaks are not fabricated.
- Existing reward transaction, boss damage, ledger and persistence still work exactly once.
- No console errors and all JS passes syntax checks.

## Required report

Report changed files, normalization rules, game mapping, responsive choices, migration behavior, known limitations and exact verification steps. Do not claim live Notion write-back; this milestone is a real read-only snapshot plus a secure integration seam.
