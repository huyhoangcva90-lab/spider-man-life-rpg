# TASK 24: V4 Flagship Visual and Mobile-First Pass

## Mission

The V4 vertical slice is functional but still feels like a competent dashboard, not a flagship Spider-Verse life-RPG. Redesign and implement the Command screen so it feels authored, cinematic, tactile, and immediately usable on mobile. Work only inside `app-v4/`; never touch legacy root files and never write deliverables to the Antigravity scratch directory.

This is a visual/product-quality implementation task, not a documentation-only task.

## Design thesis

Subject: a 29-year-old male freelancer running his real life through a Spider-Verse field command system.

Single job of the Command screen: reveal the one action to do now, show why it matters, and make resolving it feel like landing a decisive Spider-Man strike.

Use a **Dimensional Field Dossier** direction:

- `Night Asphalt #080A0F`: quiet foundation, not a flat generic dashboard.
- `Newsprint Bone #E8E0CF`: physical evidence and readable editorial surfaces.
- `Spider Signal Red #F02B3A`: decisive actions and danger.
- `Portal Cyan #28D7F2`: causal links, focus, and telemetry.
- `Venom Violet #845EF7`: dimensional depth used sparingly.
- `Warning Amber #F2B84B`: rewards and stagger.

Typography roles must feel distinct: compressed/editorial display for encounter and mission titles, humanist sans for copy, mono only for telemetry. Avoid all-caps everywhere and avoid tiny low-contrast labels.

## Signature interaction: Living Web of Consequence

Make `Web of Consequence` the unmistakable centerpiece rather than five ordinary boxes:

- Desktop: an asymmetric web graph with one large action node, three orbiting modifier nodes, and a boss-impact node. SVG web strands visibly connect the actual nodes. The currently active path glows cyan-to-red.
- Mobile: convert it into an interactive vertical “web route.” Only the active route is expanded; secondary modifier details are revealed by tapping `Why this reward?`.
- Completing an action triggers one orchestrated 700–1000ms sequence: web strand draws → impact flash on boss → reward sheet rises. Do not scatter continuous animations across the screen.
- Respect `prefers-reduced-motion`.

## Desktop composition (>= 1024px)

- Reduce the visual weight of the app chrome. The content—not the rail—owns the screen.
- Create a cinematic encounter stage across the top 40–45%: mission dossier overlaps the Doc Ock threat panel, connected by the active web path.
- Boss area needs authored local visual treatment: an original abstract mechanical-tentacle silhouette made with inline SVG/CSS, not an unrelated photo and not copied game art.
- Move Today Loadout into a tactile horizontal belt of compact illustrated cards below the encounter. Cards need category, name, actual modifier, equipped state, and strong hover/focus feedback.
- Keep the action queue compact and quieter below the main experience.
- Do not use a symmetrical 2-column admin dashboard or equal cards everywhere.

## Mobile composition (360–430px)

Rebuild mobile as an app experience, not a shrunk desktop:

1. Slim top HUD: avatar/level, XP progress, gold. Remove clock and low-value system status from the first viewport.
2. First viewport contains: `Next move`, title, time, why it matters, predicted impact, and a large thumb-reachable `Start focus` / `Complete action` control.
3. Put boss encounter immediately after the primary action as a compact cinematic threat strip with art, armor/HP, and predicted hit.
4. Living Web route is vertically progressive and collapsible.
5. Today Loadout is a horizontally scrollable snap rail; show about 1.25 cards to signal more content. No crushed 5-column grid.
6. Bottom navigation is fixed, safe-area aware, labeled, and never covers content. Central Focus control is prominent but does not obscure adjacent labels.
7. Reward breakdown is a bottom sheet on mobile with a drag handle, sticky dismiss/claim action, max-height, and internal scrolling.
8. Minimum target 44px, no horizontal page overflow, no clipped text, no tiny telemetry below 11px.

## Visual craft requirements

- Replace generic rectangular-card repetition with hierarchy: stage, dossier, web graph, belt, queue.
- Use layered clipped corners, subtle paper grain created in CSS, selective halftone, and dimensional color separation. Keep textures away from body copy.
- Inline SVG icon system only. Zero emoji and zero remote image URLs.
- Add original inline SVG card art for all five loadout entries, each visually distinguishable and correctly labeled. These are controlled symbolic illustrations, never false character portraits.
- Add skeleton-free immediate rendering; no layout shift.
- Every interactive state: default, hover, pressed, focus-visible, disabled/completed.
- Use concise user-facing copy. Remove implementation language such as “signature tactical centerpiece,” schema, transaction, or system jargon from normal UI.

## Interaction and system preservation

- Preserve Task 23 reward formula, state schema, persistence, idempotency, boss damage, loadout modifiers, dialogs, objective creation, filtering, and focus timer behavior.
- Do not break deep navigation hashes.
- The completed action must still award exactly once.
- Do not reset or silently discard an existing `spidey_v4_state`.

## Required self-critique before completion

Before reporting complete, inspect the actual rendered app at desktop and mobile widths and remove at least one decorative element that does not improve hierarchy or comprehension. State what you removed.

## Acceptance tests

- At 1440x900, the first screen reads as a cinematic mission-to-boss experience, not an admin dashboard.
- At 390x844 and 360x800, the first viewport clearly exposes the current action and its primary controls.
- Mobile loadout scrolls horizontally with snap behavior.
- Mobile reward dialog behaves as a bottom sheet and remains usable at 360x800.
- Web of Consequence has real connecting SVG strands on desktop and a clear vertical active route on mobile.
- Five distinct local inline SVG loadout illustrations render with correct names; no remote or unrelated images.
- Completion animation is orchestrated and reduced-motion safe.
- Existing reward transaction still updates XP, gold, encounter meters, ledger, and persists after reload without duplication.
- No horizontal overflow at 360px.
- No console errors; all JS passes syntax validation.
- Only files in `app-v4/` plus this task file are changed.

At the end, report changed files, responsive decisions, the single memorable design signature, verification results, and the decorative element removed during self-critique.
