# Spider Life visual system

SpideyTracker supplies the Spider-Man palette and the outer navigation. Imported Gambit apps keep their original markup, scripts, screen order, controls, content, and responsive layout. Each selected app loads one small CSS skin after its Gambit styles. The skin changes only color and decorative details.

## Integration rules

- Timetable, Dopamine Menu (Random), Routine, Habit, and Gym retain their Gambit app code. The only change in each app entry page is the extra stylesheet link.
- The Spider Life host provides a compact top bar with back, connection status, and Timetable settings where applicable. The original Timetable settings panel is opened through the shared embedding bridge in `field-tools/spider-embedded.js`.
- The host omits duplicate home controls while an app is embedded. The app's own functional controls stay available.
- The Field directory keeps its Spider hardware frame; the imported apps open without that frame.
- Theme work must not hide sections, add actions, change wording, reorder content, or widen an app's original layout.
- Keep red for Spider-Man accents, cyan for interactive highlights, amber for focus, and the original app's typography and spacing.
- The shared top bar uses the existing SpideyTracker mask from `assets/spideytracker/tracker_logo3.png`, a red-to-blue suit color sweep, and a cyan seam. It does not change the imported app's markup or controls.

## Checks

Review each app at desktop and narrow viewport sizes. Confirm Timetable settings, Dopamine Menu's existing random roll, Routine detail, Habit list/detail, and Gym navigation. Data sync uses the original app logic and the existing Notion adapter; do not write personal data merely to test a visual change.
