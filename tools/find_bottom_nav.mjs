import fs from 'node:fs';

const buf = fs.readFileSync('tools/apk_unpacked/classes3.dex');
const str = buf.toString('latin1');

// Match tab enum or class names
const matches = str.match(/([a-zA-Z0-9_]+BottomTab|[a-zA-Z0-9_]+NavigationItem|[a-zA-Z0-9_]+TabItem)/g) || [];
console.log('Tab items:', Array.from(new Set(matches)));

// Match routes in navigation graph
const navRoutes = str.match(/"(home|journey|tools|season|friends|insights|settings|program|profile)"/gi) || [];
console.log('Nav route literals:', Array.from(new Set(navRoutes)));

// Search for string labels used in tabs
const labels = str.match(/(Home|Today|Journey|Tools|Season|Friends|Insights|Habits|Discover|Club|Leaderboard)/g) || [];
console.log('Labels count:', labels.reduce((acc, l) => { acc[l] = (acc[l] || 0) + 1; return acc; }, {}));
