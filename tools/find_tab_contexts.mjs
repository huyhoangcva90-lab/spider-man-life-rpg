import fs from 'node:fs';

for (const dex of ['classes.dex', 'classes2.dex', 'classes3.dex']) {
  const p = `tools/apk_unpacked/${dex}`;
  if (!fs.existsSync(p)) continue;
  const buf = fs.readFileSync(p);
  const str = buf.toString('latin1');
  for (const word of ['SeasonTab', 'ToolsTab', 'FriendsTab', 'JourneyTab', 'HomeTab', 'TodayTab']) {
    let pos = 0;
    while ((pos = str.indexOf(word, pos)) !== -1) {
      console.log(`Found ${word} in ${dex} at ${pos}:`);
      console.log(str.slice(Math.max(0, pos - 150), pos + 250).replace(/[^\x20-\x7E\n]/g, '.'));
      pos += word.length;
    }
  }
}
