# Hero build pass — 2026-10-19

## Reference inspected

Local user-provided archive: `D:/test/Zenflow-main/Clash+Royale_160402020_APKPure.xapk`.
Read the XAPK manifest/entry structure and asset pack. Decoded `assets/csv_logic/loadout.toml` and client text data; identified separate `ui_deck_builder.sc`, `ui_deck_skin_customization.sc` and collection resources. The binary SC views were not rendered or run in an emulator. This pass borrows the separation of equipped loadout, collection, inspection and equip action; it does not claim pixel-identical reproduction. No card count, progression requirement, damage rule or reward was copied into Spider.

## Changes

- The original slice artwork now paints above destination panels, while corner navigation stays above it. Standalone Field tools, including Finance, are excluded from these rules.
- Hero Suits/Skills/Maps/Badges share a confirmed-build strip, compact inspectable collection and a separate preview/action panel.
- Inspecting a tile does not save; equipping writes only the relevant existing Hero relation. Existing Notion Skill Slot properties determine available slots.
- Public Hero polling, saved collection timestamp and private write access have separate labels. Refresh time is tracked per collection, so refreshing suits never labels the skills catalog as live.
- Background Hero updates can refresh the read-only build summary without replacing the active search input.
- Explicit equip failures preserve the confirmed build. Authentication failures show an actionable message.

## Checks

- Sixteen targeted Hero/Field/Notion authority tests passed, including read-only inspection, per-collection freshness and successful relation-only equip with mocked transport.
- Browser inspected desktop-sized Hero, selecting another suit without a write, Skills, and a true 390 × 844 inner viewport.
- No live Notion equip, task write or financial operation performed. Finance source and CSS unchanged.

## Remaining audit issues

The earlier project audit remains open, including the public legacy task snapshot, Gym response adapter, partial Todo draft retention and Ambient Focus. This UI pass does not mark those as resolved.
