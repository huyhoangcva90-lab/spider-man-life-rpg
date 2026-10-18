# Spider Field consolidation — 18 October 2026

## Owner's corrected scope

One Spider application. Field contains the apps from the owner's new
`integrations/gambit` workspace. Quests and Habits are direct entrances into
the same Todo and Habit tools. Preserve the existing Map frame, four animated
corner characters and home logo. Do not invent game rewards or mechanics.

## Delivered code checklist

- [x] Shared Map shell geometry for Map, Battle, Hero, Quests, Habits and Field.
- [x] Hide all five destination buttons after opening any destination. Logo/back returns Home.
- [x] Restore the original tool screens and Routine; remove the custom 66-day destination.
- [x] Consolidate the twelve tools under `field-tools/`, with Spider Field as the launcher.
- [x] Keep the latest Finance source: its index differs from the owner's new copy only in integration scripts.
- [x] Karen opens the owner-confirmed Telegram bot. Ambient Focus also appears in Field.
- [x] Original Tabler glyphs rendered as local SVG in Field/Habits to avoid blank font icons.
- [x] Hero card catalogs from actual Notion: 80 suits, 206 skills, 3 maps, 37 badges.
- [x] Hero choices update only existing relation properties, after confirmation from Notion.
- [x] Complete long relation pagination before changing a selection. Capture tab/slot before async writes.
- [x] Todo uses Master Calendar, paginates reads, preserves parent/child relations and respects Done=false.
- [x] Task creation saves Name, Done, Important, Urgent and the existing Work/Study/Personal Type.
- [x] Todo/Habits refresh every 30 seconds and on return to the page. Open editing sheets are preserved.
- [x] Habit marks use the real Daily checkboxes/relations. Failures retain the confirmed state.
- [x] Add 30-day marks per habit. Missing records remain unknown; no sample history.
- [x] Import old Master Backup files with a record preview, per-key choice and backup before replacement.
      Login tokens and nested credential fields are excluded. Imports stay in browser storage.

## Existing Cloudflare service

Spider's private server bridge reuses the owner's existing authenticated service at
`gambit-d9b.pages.dev`. An HttpOnly Spider cookie holds its existing owner session;
integration credentials and upstream bearer tokens are never returned to the browser.
Private Notion, cloud, Finance and Calendar reads remain authenticated. Writes require
the Spider origin. If upstream authentication is removed, the bridge fails closed.

`tools/build_field_service.mjs` builds an ignored release from the owner's new
`integrations/gambit/functions` source. It preserves the existing bindings, secrets,
KV contents and Finance/Sheets implementation. It replaces the separate Gambit UI
with redirects into Spider. It keeps `/migrate.html` for exporting local browser
data, since changing origins does not transfer localStorage automatically.

The prepared Google callback uses signed, one-use state in the existing KV namespace,
retains the existing read-only Calendar scope and registered callback URL, then returns
to Spider. No Google reconnect or financial transaction was executed during testing.

The prepared public `/api/spider-game` uses the exact same fixed game-only reader and
approved projection as Spider. It cannot query arbitrary IDs or personal databases.
This supports public PK embeds without exposing the private Field APIs. Spider also
filters the returned projection again before responding to public visitors.

**Cloudflare release is prepared, not deployed yet:** the CLI session expired and
the browser remains signed out. Automatic approval rejected the original broad OAuth
scope request. A Pages-only authentication flow was prepared as the safer alternative.
Do not report the old website retired or Google reconnect/public live embeds migrated
until this release has actually been deployed and verified. Existing authenticated
Cloudflare APIs can already be used by the Spider bridge without moving their keys.

## Verification

- Automated checks cover private sessions, proxy envelopes, cross-origin rejection,
  closed authentication, import filtering, relation pagination, failed selection/save,
  preservation of unrelated Habit relations, game projection and Google callback replay.
- Original twelve tool routes, font assets, manifest and scoped cache protection pass.
- Browser: Map/Battle/Hero/Quests/Habits/Field share desktop frame `(15,5,1250,715)`
  and content `(51,41,1178,603)` at 1280×720; opened destination dock is hidden.
- Real inner viewport 390×844: all six frame `(2,2,386,842)` and content
  `(29,29,332,756)`; no horizontal document overflow. Browser viewport override did
  not apply, so an actual sized iframe was used for breakpoint verification.
- 360×667 Battle and Hero checked: no horizontal overflow; Hero has two 132px columns.
- Preview authenticated read returned twelve Todo root cards and thirteen actual Habits.
  No completion, Hero choice or financial test write was performed against live data.
- Primary Antigravity edits preserved. `css/mobile-game-ui.css` SHA256 remains
  `EE4BDD54A4C96CB29068B3D4C1957DF31C525856430D783454B388C7BC865693`.
- The owner's nested Gambit repository, its uncommitted Finance changes and local
  `.cloud-data` remain intact; none were copied into the public static release.
