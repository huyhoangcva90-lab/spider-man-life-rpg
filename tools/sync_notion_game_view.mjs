import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readNotionGameState } from '../server/notion-game-reader.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = process.argv[2] || path.join(root, '.env.local');
if (fs.existsSync(envPath) && process.loadEnvFile) process.loadEnvFile(envPath);
const token = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
if (!token) throw new Error('Notion token is required to refresh the game display.');
const data = await readNotionGameState(token);
// Exact local copies of the two poses currently attached to these Notion records.
for (const enemy of data.enemies) {
  const name = /cosmic-bugspikedshield-idle/i.test(enemy['Idle Pose']) ? 'bug-spiked-shield' : /cosmic-Thanos-idle/i.test(enemy['Idle Pose']) ? 'thanos' : null;
  if (name) enemy['Idle Pose'] = `./assets/notion-actors/${name}.png`;
}
fs.writeFileSync(path.join(root, 'data/notion-game-state.json'), JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({ hero: data.profile.Hero, level: data.profile.Level, hp: data.profile.HP, energy: data.profile.Energy, skills: data.skills.map((skill) => skill.Skill), missions: data.missions.map((mission) => mission.Encounter), enemies: data.enemies.length, logs: data.logs.length }));
