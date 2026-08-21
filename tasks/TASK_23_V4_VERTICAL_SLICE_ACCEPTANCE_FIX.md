# TASK 23: V4 Vertical Slice Acceptance Fix

## Context

The first Task 22 implementation runs, but it does not pass product or visual acceptance. It currently looks like a generic developer dashboard, uses emoji navigation, and omits the core Spider-Man life-RPG loop. Treat this as a required corrective pass, not an optional polish pass.

Work only inside `app-v4/`. Do not touch root legacy files. Do not write to the Antigravity scratch directory; verify every output exists under the workspace `app-v4/` before reporting completion.

## Required product loop

The Home screen must communicate this loop without explanation:

`real-life action -> affected campaign/domain -> attribute/skill growth -> equipped card modifiers -> boss damage -> transparent rewards`

Completing an action must be an atomic, idempotent transaction. A completed action cannot award rewards twice. Persist the resulting state in `localStorage` key `spidey_v4_state`.

## Required Home composition

Replace the current generic Home layout with a distinctly Spider-Verse evidence-board composition for an adult 29-year-old freelancer:

1. **Next Move dossier** — one prioritized action with title, reason it matters, time estimate, domain, and one primary `COMPLETE ACTION` control.
2. **Active encounter** — Doctor Octopus with visible HP `2250 / 3000`, armor `600 / 600`, stagger meter, status, and predicted damage from the selected action.
3. **Web of Consequence** — the signature centerpiece. Render a legible connected chain with nodes and web lines: action -> campaign/domain -> attribute gain -> equipped modifier -> predicted boss damage. On narrow screens it becomes a vertical chain.
4. **Today loadout** — compact image-and-name cards for Peter Parker, Advanced Suit 2.0, Web-Shooter, Impact Web, and Mary Jane. Use controlled local placeholder art (CSS silhouettes/patterns or inline SVG authored in the app) when no verified licensed local image exists. Never substitute an unrelated character image.
5. **Reward breakdown dialog** — after completion, show base XP/gold, duration multiplier, domain match, loadout modifier, attribute gain, boss damage, and totals before dismissing.
6. Keep an action queue below the main loop, but reduce its visual priority.

## Visual direction

- Remove all emoji from navigation, telemetry, buttons, and item icons.
- Do not use a generic neon SaaS/admin-dashboard composition.
- Use a split physical/digital evidence-board system: near-black field desk, off-white dossier paper, red translucent acetate, cyan dimensional telemetry, thin web-line connections, clipped/cut-paper edges, restrained halftone texture.
- Use large editorial typography and strong hierarchy; keep body text readable.
- Use CSS/inline SVG icons with a consistent stroke system. No remote image URLs and no fabricated Sony/Marvel screenshots.
- Signature visual: the Web of Consequence must be the most recognizable element on the screen.
- Motion: a restrained spider-sense pulse on predicted boss damage and a short web-line draw when rewards resolve. Respect `prefers-reduced-motion`.
- Desktop left rail remains 220px. Mobile has a bottom dock with five accessible labels and a prominent Focus action; minimum touch target 44px.

## State and calculation requirements

Extend the canonical V4 initial state with:

- `activeEncounter`: Doc Ock HP, max HP, armor, max armor, stagger.
- `loadout`: the five equipped items above, with stable IDs, category, name, local art key, and explicit modifiers.
- action effect metadata: domain, duration, base rewards, attribute gain, base boss damage.
- `lastRewardBreakdown` (nullable) and ledger transaction IDs.

The reward calculator must be a pure function and return a full breakdown. Apply armor before HP damage, update stagger, and clamp meters to valid bounds. The store must refuse a second completion for the same action and must not subtract earned rewards when the UI is filtered or rerendered.

## Accessibility and responsive acceptance

- Semantic headings, real buttons, dialog semantics, keyboard close, visible focus states, and useful ARIA labels.
- No horizontal overflow at 360px width.
- Do not rely on color alone for status.
- Maintain readable contrast and do not put fine text over textures.

## Acceptance checklist (must all pass)

- Home visibly contains `Next Move`, `Doctor Octopus`, `Web of Consequence`, and `Today Loadout`.
- The five loadout names are present and no unrelated/remote imagery is used.
- Navigation and core UI contain zero emoji.
- Completing the selected pending action opens a detailed reward breakdown.
- XP and gold increase; Doc Ock armor/HP changes; ledger receives exactly one transaction; reload preserves all values.
- Clicking complete again does not duplicate the transaction or rewards.
- Desktop and 360px mobile render without horizontal overflow.
- Browser console has no errors.
- All JavaScript files pass `node --check`.
- Only `app-v4/` and this task file are changed.

At the end, report changed files, formula used, manual test steps, and any remaining limitation. Do not claim completion unless every checklist item is implemented.
