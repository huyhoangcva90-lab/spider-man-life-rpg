# TASK

Spider Effects and Game-Feel Expansion

# OBJECTIVE

Add a richer, reusable Spider-inspired visual/audio feedback layer across the app without obscuring content, harming performance or creating fake progression.

# CONTEXT

The user wants substantially more Spider-Man-style effects. The app already has synthesized sound, card tilt, web canvas, radar, tracker scanlines and reduced-motion handling. Extend these systems rather than adding isolated one-off animations.

# FILES

Likely: `styles.css`, `js/app.js`, optional new `js/effects-system.js`, `index.html`, `docs/IMPLEMENTATION_NOTES_TASK_14.md`. Do not edit root `app.js`.

# REQUIREMENTS

1. Central `EffectsSystem` with named, bounded effects and a single settings gate.
2. Add original code-native effects: web-thwip transition, web strand cursor/touch trail, spider-sense danger pulse, venom electricity burst, symbiote tendril reveal, perfect-dodge ring, impact comic burst, traversal speed lines, loot hologram, boss phase glitch and map web-route reveal.
3. Trigger effects only from meaningful events emitted by the engine/UI; browsing and decorative effects never mint rewards.
4. Effects use CSS/SVG/Canvas/Web Audio only; no copied animation sprites, game files or external copyrighted audio.
5. Cap particle counts, reuse nodes/canvases, pause when tab hidden and clean up listeners/animation frames.
6. Add persisted effects intensity: Off / Reduced / Full. Respect `prefers-reduced-motion`, sound settings and reduced-data/network conditions.
7. Maintain readable focus, contrast and input responsiveness; effects must not block clicks.
8. Mobile 360px and desktop performance QA; no layout overflow.

# ACCEPTANCE CRITERIA

- At least 10 named effects are implemented through one reusable system.
- Effects visibly respond to appropriate map, combat, equip, unlock and loot events.
- Reduced/Off modes work and persist.
- No fake rewards, console errors, orphaned animation loops or interaction blockers.
- Existing 14 screens and media galleries still work.

# DO NOT

- Do not copy proprietary game/site animations, sprites or sound samples.
- Do not add constant full-screen motion.
- Do not edit root `app.js`.
- Do not add a framework/build tool.

# DELIVERABLE

Implement and document effect names, triggers, performance safeguards and QA in `docs/IMPLEMENTATION_NOTES_TASK_14.md`.
