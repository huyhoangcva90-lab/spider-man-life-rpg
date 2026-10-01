import fs from 'node:fs';

const buf = fs.readFileSync('tools/apk_unpacked/classes.dex');
const str = buf.toString('latin1');

// Match task keys and habit categories
const taskKeys = str.match(/task_[a-z0-9_]+/gi) || [];
console.log('Task keys:', Array.from(new Set(taskKeys)));

// Look for task names and descriptions
const matches = str.match(/[A-Z][a-zA-Z\s]{4,30}(?:Practice|Workout|Shower|Meditation|Water|Sleep|Fast|Book|Walk|Stretch|Study)/g) || [];
console.log('Task matches:', Array.from(new Set(matches)).slice(0, 50));
