# TASK

Fix Sound Preference Persistence

# OBJECTIVE

Repair the verified regression where the SFX toggle changes visually but does not survive reload.

# VERIFIED FAILURE

Browser QA on `http://127.0.0.1:4175/`:

1. `#soundToggleBtn` initially showed `🔊`.
2. Click changed it to `🔇`.
3. Reload changed it back to `🔊`.
4. No console error occurred.

This proves `state.soundSettings.sfxEnabled` is not being persisted/restored correctly despite the Task 04 notes.

# REQUIREMENTS

1. Inspect `js/app.js` and `js/storage.js` sound initialization, click handlers, save calls, merge defaults, and reset behavior.
2. Fix both `sfxEnabled` and `musicEnabled` so each toggle is persisted immediately through the existing Storage API and restored on app initialization.
3. UI icons/title/ARIA state must reflect the restored setting after reload.
4. Do not initialize or resume AudioContext on page load; retain user-gesture-only audio policy.
5. Do not edit root `app.js`; active file is `js/app.js`.
6. Preserve all content, media, map, and progression behavior.
7. Do not use shell/run-command tools; use file and browser tools.

# ACCEPTANCE CRITERIA

- SFX: on → off → reload remains off; off → on → reload remains on.
- Music: on → off → reload remains off; off → on → reload remains on.
- Toggling one does not overwrite the other.
- Fresh/migrated state defaults remain valid.
- No autoplay errors and no console errors.
- Update `docs/IMPLEMENTATION_NOTES_TASK_04.md` with the fix and browser evidence.

