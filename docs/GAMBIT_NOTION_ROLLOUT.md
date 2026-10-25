# Gambit → Spider / Notion

Work one app at a time. Routine is a separate app at `/gambit/apps/routine/`;
Field embeds it with a return arrow. Karen Chat is a separate surface.

## 01 · Routine

Implemented: Spider navy/cyan/coral design, responsive timeline, private Notion reader,
existing time windows, explicit Habits / Skincare product / Haircare product relations,
Today checkbox display, direct record links and refresh on returning to the app.
No demo routines, local completion records, invented timers or game mutations.

Source: Routine database `272d7876-36c6-8111-8129-d3f09218cb2f`, data source
`272d7876-36c6-81bc-b308-000bbd2c8dbe`.
Habits source `272d7876-36c6-8186-a928-000baf0dc5cb`.
Time is free text; unrecognized times remain visible and sort after recognized times.
Routine order follows start time. Relation order follows Notion. Count distinct habits once.
Paused/unformed/bad habits remain visible with their original status/type.
Today is the actual Notion checkbox, not a claimed daily completion log.
Notion buttons are not executed via the REST API. Open the original record to run its automation.

### Server configuration

Set `NOTION_API_KEY` (or `NOTION_TOKEN`) and `NOTION_PROXY_ACCESS_TOKEN` in Vercel,
then redeploy. Never put either value in frontend code or Git.
Use the private Spider access code in the app, not a Notion integration token.
Owner session: HttpOnly, Secure, SameSite cookie, up to one year to match Gambit, scoped to `/api`.
The original Gambit session is still checked by its existing server. All Spider tools use
this one session; an expired cookie from the old twelve-hour bridge needs one login
with the existing Gambit password. Cookies on another hostname cannot be copied by Spider.
Confirmed writes from embedded Gambit tools notify the hub. Hero performs a fresh read
after saving a selection, and Habit/Quest check-ins trigger the same refresh. Database
queries, failed writes and ordinary navigation do not trigger extra game reads.
`GET /api/routine` requires that session and returns `private, no-store`; mutations rejected.
Proxy/session handlers use native `.mjs` Vercel functions with clean URL rewrites.
Local dev uses the same protected handlers, bound to loopback only.

Verified against real Notion: 3 routines, 11 linked habits, no linked skin/hair products.
No private snapshots are checked into Git. Production needs deployment account access
to install server environment variables; a Notion key alone does not grant Vercel access.

## Following apps (not redesigned yet)

Habits → Timetable → Todo → Dopamine → Gym → Journal → Finance → English → Style → Oracle → Ambient Focus.
For each: discover the actual DB and workflow, reuse Spider visual language, verify mobile/source data, publish.

## Karen Chat

Removed three canned Ned/MJ/Miles messages, including old browser storage copies.
Previous user entries remain in local storage and are never forwarded automatically.
The Chat button opens `https://t.me/Huykl_KarenBot`, confirmed by the owner as the
Karen bot already connected to Hermes on Ubuntu. Telegram handles the real conversation.
No simulated web chat, fake replies or unverified online indicator remains.
JARVIS's existing `docs/UNIFIED_CONVERSATIONS.md` describes profile `karen`, its native
Telegram session, authenticated conversation routes, and server-side Telegram mirroring.
That contract would be required for a future conversation embedded inside Spider.
This implementation opens Telegram; it does not embed or mirror its history inside Spider.
No gateway/bot token is needed in the browser or repository.
