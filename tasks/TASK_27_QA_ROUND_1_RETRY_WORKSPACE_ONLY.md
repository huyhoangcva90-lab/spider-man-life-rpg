# TASK 27: QA Round 1 Retry — Workspace Only

## Mandatory target verification

Before editing, verify this exact file exists and read it:

`C:\Users\huyklgl\Documents\antigravity\mysterious-kepler\app-v4\js\ui\WorldView.js`

All edits must be under:

`C:\Users\huyklgl\Documents\antigravity\mysterious-kepler\app-v4\`

Do not read or write `C:\Users\huyklgl\.gemini\antigravity-cli\scratch\`. If the active file path contains `.gemini`, stop without editing. At the end, list absolute changed paths and confirm each begins with the workspace path above.

## Fix only these QA blockers

1. Update `app-v4/data/notion-snapshot.json` to use the exact real record URLs listed in `tasks/TASK_26_QA_ROUND_1_DATA_TRUTH_AND_MIGRATION_FIX.md`. Do not construct URLs from collection IDs or slugs.
2. Preserve null habit values. Remove invented outcome/description/time-block content; render `Chưa đặt kết quả`, `Chưa có mô tả`, `Chưa phân loại`. Real values must remain unchanged. The five habits Straight & Gym, Fashion, Economy, Skincare and Yoga use time block `Allday`.
3. Mark legacy initial sample actions `origin: local_demo`. When snapshot missions exist, hide local demos from World and default Missions filters.
4. Select the first incomplete real normalized Notion mission for World. The World heading must become `Khu còn lại notion` or another real snapshot mission, never `Deliver Database Schema`.
5. World/Missions Notion links must be the exact real record URL.
6. For a real mission with null Project/Area/Goal, World web nodes must show `Chưa phân loại` and broken/open strands. Never reuse Client Alpha Portal or Engineering relationships.
7. Replace `NOTION SYNCED` with `NOTION SNAPSHOT` everywhere.
8. Conditionally omit closed dialogs from DOM so they do not appear in accessibility snapshots.
9. Preserve local XP, gold, encounter state and ledger. Merge by externalId and do not duplicate snapshot missions on reload.

Use the full acceptance criteria and real URLs in `tasks/TASK_26_QA_ROUND_1_DATA_TRUTH_AND_MIGRATION_FIX.md` as the source of truth.

Do not implement unrelated migration utilities or edit legacy `HomeView.js`. This V4 route uses `WorldView.js`, `MissionsView.js`, `HeroView.js`, `ShellView.js`, StateStore and the Notion integration files.
