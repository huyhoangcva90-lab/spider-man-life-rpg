# TASK

Archive QA Blockers and Generated Spider Portrait Completion

# OBJECTIVE

Correct the verified Task 15 release blockers, make all expanded content appear for existing saves, enforce image-and-name-only compact cards, remove unsafe encounter mutation, and fill missing Spider-People portraits with clearly labeled generated fan artwork.

# VERIFIED BLOCKERS

Independent QA on a real existing V2 save found:

1. `SPIDER_PEOPLE_DATA` contains 36 entries, but Collection renders only 18 because persisted `variantsState` wins over expanded definitions instead of merging by stable ID.
2. Compact Spider cards still display rarity and universe text (`COMMON`, `Earth-616`). The user explicitly wants only portrait image and name on compact faces.
3. `openCompendiumDetailModal()` handles `CHALLENGE BOSS` by directly replacing `currentBossState` in UI code. This bypasses the authoritative engine/project encounter flow and replacement confirmation.
4. Several newly added Spider-People do not yet have a project-local generated portrait.

# REQUIREMENTS

1. Merge static Spider-People definitions into persisted collection state by stable ID on load/migration. Preserve mutable owned/favorite/selected fields from saves; append new definitions. Never shrink a collection because an older save has fewer seed entries.
2. Apply the same safe merge pattern to expanded Suits and Skills so old V2 saves surface all 30 Suits and 44 Skills without auto-unlocking them.
3. Compact card faces for Spider-People, Allies, Villains, Suits and Skills must contain exactly:
   - portrait/artwork;
   - visible name.
   Remove/hide rarity, universe, cost, power, HP, armor, level requirement, numeric stats and category chips from compact faces. These details belong only in the large viewer/filter controls.
4. Ensure all compact cards use a semantic button or equivalent keyboard activation and open the large viewer via click, Enter and Space.
5. Replace unsafe modal boss mutation:
   - Prefer removing the Challenge button from the archive viewer in this milestone and replace it with a safe `VIEW IN BOSS ARENA`/`VIEW VILLAIN` navigation action; or
   - call an existing authoritative engine/project-binding method with explicit replacement confirmation.
   No direct mutation of `currentBossState` in UI is allowed.
6. Equip Suit/Ally and Unlock Skill actions must continue through existing engine methods and obey ownership/prerequisites. Identity selection may update cosmetic identity only and must not grant rewards.
7. Create project-local generated fan portraits for Spider-People that have no reliable unique artwork. Use Antigravity's `generate_image` capability, not terminal commands. Save outputs under `assets/generated/portraits/spider-people/` with stable filenames. If generation capacity is limited, prioritize every newly added entry lacking a unique image and report exact completion/missing counts honestly.
8. Generated portrait art direction:
   - cinematic collectible-card portrait illustration;
   - original Spider Archive framing/composition, not an exact Marvel SNAP card clone;
   - full or three-quarter character, dynamic web-swing/combat silhouette, strong rim light, deep city background;
   - no logos, no text, no numbers, no watermark;
   - do not imitate a named artist.
9. Add generated asset metadata in `data/media.js` and credits: `generated: true`, local `src`, subject/entry ID, promptFamily`, `creationTool`, and fan-project disclaimer. Do not label it official Marvel art.
10. New local media must fall back gracefully and must not replace existing unique working sourced art unless the generated portrait is specifically better matched to that entry.
11. Repair any mojibake in new/touched UI copy.

# ACCEPTANCE CRITERIA

- Existing V2 save renders exactly 36 Spider-People, at least 26 Allies, 30 Suits and 44 Skills.
- Every compact portrait card visibly contains image + name only.
- First/middle/last cards open large viewer; previous/next, Escape and focus return work.
- No direct `currentBossState` mutation remains in modal card handlers.
- Viewing/selecting cards causes no XP, Gold, loot, boss damage or ledger transaction.
- Generated portraits are local, labeled as generated fan artwork and have fallbacks.
- All 14 screens navigate, JavaScript parses, no console errors, no 360px overflow.

# TEST

Use browser tools (not terminal):

1. Load with an old 18-entry variants save and verify 36 rendered after migration.
2. Count rendered Allies/Suits/Skills after old-save merge.
3. Inspect compact card `innerText`; it must equal only the item name.
4. Test click, Enter, Space, previous, next, Escape and focus return.
5. Snapshot Gold, XP, ledger length and boss HP before/after browsing.
6. Force one generated image failure and verify fallback.
7. Navigate all 14 screens and inspect console.

# DO NOT

- Do not edit root `app.js`.
- Do not call terminal/command tools.
- Do not copy exact Marvel SNAP frames or copyrighted audio.
- Do not auto-unlock suits/skills or reset saves.
- Do not directly mutate boss/encounter state from UI.
- Do not claim generated portrait coverage that does not exist on disk.

# DELIVERABLE

Implement fixes and write `docs/IMPLEMENTATION_NOTES_TASK_16.md` with exact old-save merge results, rendered counts, generated portrait file list, remaining missing portraits, QA and limitations.
