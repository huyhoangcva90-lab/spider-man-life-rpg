import fs from 'node:fs';

const dexFiles = [
  'tools/apk_unpacked/classes.dex',
  'tools/apk_unpacked/classes2.dex',
  'tools/apk_unpacked/classes3.dex'
];

for (const f of dexFiles) {
  if (!fs.existsSync(f)) continue;
  const buf = fs.readFileSync(f);
  const str = buf.toString('latin1');
  
  // Look for route strings and bottom bar items
  const routeMatches = str.match(/[a-z0-9_]{3,30}\/(?:screen|route|tab|dialog)/gi) || [];
  const screenMatches = str.match(/([A-Z][A-Za-z0-9]+(?:Screen|Route|Tab|Destination|Page))/g) || [];
  
  const uniqueScreens = Array.from(new Set(screenMatches))
    .filter(s => !s.startsWith('Android') && !s.startsWith('Compose') && !s.startsWith('Material') && !s.startsWith('Hilt') && !s.startsWith('Nav') && !s.startsWith('View') && !s.startsWith('Base'));
    
  console.log(`--- ${f} ---`);
  console.log('Screens:', uniqueScreens.slice(0, 50));
}
