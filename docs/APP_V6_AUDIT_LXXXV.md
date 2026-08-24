# app-v6 audit — LXXXV baseline

Audit date: 2026-08-24  
Baseline commit: `bdab85d`

## Working systems that must be preserved

- `app-v6` remains a Vanilla HTML/CSS/ES Modules application.
- Arena is the default screen and the five bottom destinations are Missions, Spider-Verse, Arena, City, and Hero.
- MapLibre City mode, map markers, GPS, search, filters, entry editor, and Notion snapshot adapter work independently of combat.
- `EventBus`, `StateStore`, map-entry LocalStorage, game LocalStorage, the three supplied audio samples, Web Audio micro-SFX, hero sprite animation, and comic hit text are active.
- A real entry changing to `DONE` triggers combat once, grants progression, and survives reload.
- The Phase 1 content already includes Peter Classic, Miles assist, three normal enemies, one elite, Green Goblin, one district, quests, skills, and gadgets.

## Gaps against LXXXV / Phase A–B

- `PhaseOneGameEngine` owns quest, combat, damage, reward, progression, and persistence responsibilities.
- Game content is one large object rather than validated registries.
- The game save has no explicit migration/backup/import/export contract.
- Game-domain events are not standardized; UI depends on two broad compatibility events.
- Reward logic is embedded in enemy records and does not protect unique loot.
- Difficulty and settings are not data-driven.
- Finisher is presented through Ultimate without a domain-level eligibility rule.
- No automated domain test page covers the minimum rules in section LXVII.

## Implementation boundary

Phase A will introduce content registries, a versioned save manager with legacy migration, normalized game state, and standardized events while keeping compatibility snapshots for the existing UI. Phase B will split Quest, Damage, Combat, and Reward responsibilities, reconnect the current Arena, and add browser-runnable domain tests. Existing Map, task-entry, Notion, sound, sprite, and comic systems remain in place.

