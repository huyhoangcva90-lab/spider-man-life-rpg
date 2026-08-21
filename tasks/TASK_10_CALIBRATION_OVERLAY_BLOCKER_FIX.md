# TASK

Fix Tracker Calibration Overlay Blocking the Entire App

# VERIFIED BUG

Independent browser QA on `http://127.0.0.1:4177/` found a release-blocking defect:

1. `#trackerCalibrationModal` is visible immediately on page load even though it does not have the `active` class.
2. The later CSS rule `.tracker-calibration-modal { display: flex; }` overrides the generic `.modal-overlay { display: none; }` rule.
3. Clicking `SOUND OFF` changes the sound icon but `closeCalibrationOverlay()` only removes `active`; the later CSS continues forcing the empty overlay to `display:flex`.
4. The overlay intercepts navigation, so clicking CITY MAP leaves `.app-view.active` as `view-home`.
5. Reload remains stuck behind the calibration shell.

# OBJECTIVE

Make calibration hidden by default, open only when explicitly active on first Map entry or replay, close reliably for sound on/off/skip/Escape, persist onboarding, and allow Map navigation.

# REQUIREMENTS

1. CSS:
   - `.tracker-calibration-modal` must not force display when inactive.
   - hidden state uses the generic modal contract or an explicit `display:none`.
   - only `.tracker-calibration-modal.active` may display flex.
2. First page load on Home must show Home normally with no blocking calibration overlay.
3. First click of CITY MAP:
   - activates `view-map`;
   - opens calibration overlay once;
   - Map remains the underlying active view.
4. SOUND ON, SOUND OFF, SKIP, and Escape must each:
   - close the overlay visibly;
   - set `trackerOnboarded = true`;
   - save state;
   - leave `view-map` active.
5. Reload and re-enter Map must not reopen calibration once onboarded.
6. `REPLAY CALIBRATION` reopens it and all close paths work again without resetting onboarding.
7. Sound choice must still persist and must not autoplay before gesture.
8. Do not change media, map routing, progression, or root `app.js`.
9. Use file/browser tools only; no shell/run-command tools.

# MANDATORY TEST

Use the existing local server `http://127.0.0.1:4177/`:

- Home load: modal hidden, `view-home` active.
- Click Map: modal visible, `view-map` active.
- Click SOUND OFF: modal hidden, `view-map` active, sound icon muted.
- Reload then Map: modal remains hidden, Map active.
- Replay, press Escape: modal hidden, Map active.
- Repeat with SOUND ON and SKIP.
- Confirm 8 markers and zero console errors.

