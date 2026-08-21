# TASK

Skill Card Fallback Cleanup — Image + Name Only

# OBJECTIVE

Fix the verified post-Task-17 compact-card regression where some Skill cards render a visible emoji fallback before the skill name.

# VERIFIED QA

With filters `Miles Morales` + `Marvel's Spider-Man: Miles Morales`, compact card text included:

- `🕷️ Camouflage`
- `🕷️ Holographic Decoy`
- `🕷️ Mega Venom Blast`
- `🕷️ Bio-Electric Overcharge`

The user requires compact cards to show visual artwork and the visible item name only. `card.innerText.trim()` must equal the skill name exactly.

# REQUIREMENTS

1. Audit `MediaHelper.renderMediaCardHtml()` and the skill media IDs introduced/used by Task 17.
2. When an image is missing or fails, render a non-text visual fallback using the existing `fallbackSvg`, a code-native SVG, or decorative CSS with `aria-hidden="true"`.
3. Do not place emoji/text fallback characters in the accessible/visible text content of portrait cards.
4. Preserve useful image alt text and the card's accessible `aria-label`.
5. Verify compact Suit and Skill cards for all game/hero filters: `innerText.trim()` equals only the item name.
6. Preserve 37 Suits, 48 Skills, source taxonomy, filters, unlock/equip state and large viewer details.
7. Do not modify progression, rewards or encounter state.
8. Repair touched mojibake if encountered.

# ACCEPTANCE CRITERIA

- Every compact Suit/Skill card has exactly one visible textual value: its name.
- Miles skill sample no longer contains spider emoji text.
- Missing/broken media has a visual non-text fallback and no broken-image icon.
- No console errors; JavaScript parses; all 14 screens still navigate.

# DO NOT

- Do not edit root `app.js`.
- Do not invoke terminal/command tools.
- Do not reset saves or unlock content.
- Do not remove provenance from the large viewer.

# DELIVERABLE

Implement, then append the exact browser verification result to `docs/IMPLEMENTATION_NOTES_TASK_17.md`.
