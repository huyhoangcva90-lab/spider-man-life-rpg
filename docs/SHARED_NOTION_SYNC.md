# Shared connection and refresh — 25 October 2026

The old Gambit service remains the source of existing Notion, Google, Sheets and
cloud connections. Spider does not create a second Notion integration. The bridge
previously discarded its cookie after twelve hours while Gambit's own session
lasted a year. Spider now retains and checks that same session for up to a year.
A still-valid cookie is extended on a connection check. A previously expired cookie
cannot be recovered: use the existing password once on Spider, then all tools share
the session. Logging out clears both current and legacy same-host session cookies.

After a confirmed save through Notion, cloud or Finance, the embedded app sends a
same-origin notification to its host. Notifications carry no record contents or
credentials. A short debounce combines multi-record saves. Failed requests and
POST database queries do not signal a successful write. Existing app readbacks
and the hub's fresh refresh keep using server-confirmed values.

Hero selections await a fresh game read; check-ins also refresh it immediately.
A write finishing during an earlier read queues another read, rather than losing
the refresh. `fresh=1` bypasses the direct Notion reader's fifteen-second cache.
Private Field reads already use a fresh authenticated reader. Periodic refreshes
remain for edits made outside Spider and are not a promise of instantaneous push.

Battle Lab combat-to-Notion automation is intentionally deferred by the owner.
The embedded trial is still a trial and must not be described as Notion combat.
The shared connection and refresh changes do not introduce damage or reward rules.

Verification covers session expiry/tampering, legacy cookie compatibility,
successful/failed write notifications, query exclusion, refresh races and cache bypass.
No live personal record was written as part of these checks.
