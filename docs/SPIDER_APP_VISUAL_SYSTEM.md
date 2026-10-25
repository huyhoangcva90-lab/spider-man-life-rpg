# Spider Life visual system

SpideyTracker supplies the Spider-Man palette and the outer navigation. Imported Gambit apps keep their original behavior and controls. Each selected app loads a Spider stylesheet after its Gambit styles.

## Integration rules

- Timetable uses the original Gambit 24-hour clock, central PLAY spin, activity zones, theme controls, and Google Calendar controls. Its entry page adds the Spider embed/style links and Field session adapter, initializes the original manual zones before Google loads, prevents older Calendar responses from replacing a newer date, and opens Google authorization outside the iframe. The 12-hour planner variant is no longer used. The dial uses the user's supplied red mask HUD image, cropped to a circle, with a transparent SVG bezel based on the supplied steel/red/navy watch image. Activity labels use short names on the dial; the full names remain in settings.
- Dopamine Menu (Random), Routine, Habit, and Gym retain their Gambit app code with a Spider stylesheet link.
- The Spider Life host provides a compact top bar with back, connection status, and Timetable settings where applicable. The original Timetable settings panel is opened through the shared embedding bridge in `field-tools/spider-embedded.js`.
- The host omits duplicate home controls while an app is embedded. The app's own functional controls stay available.
- The Field directory keeps its Spider hardware frame; the imported apps open without that frame.
- Theme work must not hide sections, add actions, or reorder content. Timetable may widen its watch display while retaining the same responsive controls.
- Keep red for Spider-Man accents, cyan for interactive highlights, amber for focus, and the original app's typography and spacing.
- The shared top bar uses the existing SpideyTracker mask from `assets/spideytracker/tracker_logo3.png`, a red-to-blue suit color sweep, and a cyan seam. It does not change the imported app's markup or controls.

## Checks

Review each app at desktop and narrow viewport sizes. Confirm Timetable settings, Dopamine Menu's existing random roll, Routine detail, Habit list/detail, and Gym navigation. Data sync uses the original app logic and the existing Notion adapter; do not write personal data merely to test a visual change.
