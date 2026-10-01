import fs from 'node:fs';

const buf = fs.readFileSync('tools/apk_unpacked/classes.dex');
const str = buf.toString('latin1');

// Look for bottom bar composables and routes
const matches = str.match(/[A-Za-z0-9_]+BottomBar[A-Za-z0-9_]*/g) || [];
console.log('BottomBar composables:', Array.from(new Set(matches)));

// Look for navigation destinations in the main graph
const navMatches = str.match(/Route\.[A-Za-z0-9_]+/g) || [];
console.log('Routes:', Array.from(new Set(navMatches)).slice(0, 50));

// Find all strings used in BottomNavigation or NavigationBar
const bottomItems = str.match(/(?:Tab|Destination)\.(Today|Home|Journey|Tools|Season|Friends|Insights|Discover|Profile)/g) || [];
console.log('Bottom items:', Array.from(new Set(bottomItems)));
