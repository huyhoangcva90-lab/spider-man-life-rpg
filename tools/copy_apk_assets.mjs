import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(ROOT, 'life-reset');
const APK_UNPACKED = path.join(ROOT, 'tools', 'apk_unpacked');
const RES = path.join(APK_UNPACKED, 'res');
const ASSETS = path.join(APK_UNPACKED, 'assets');

// Create destination dirs
const dirs = [
  path.join(DEST, 'assets', 'images'),
  path.join(DEST, 'assets', 'audio'),
  path.join(DEST, 'data'),
  path.join(DEST, 'css'),
  path.join(DEST, 'js')
];
for (const dir of dirs) {
  fs.mkdirSync(dir, { recursive: true });
}

// 1. Copy JSON data files
const jsonFiles = [
  'habit_courses.json',
  'insight_tips.json',
  'all_motivational_cards.json',
  'survey_flow_v6.json',
  'exercise_recommender_v1.json'
];
for (const file of jsonFiles) {
  const src = path.join(ASSETS, file);
  const dst = path.join(DEST, 'data', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`Copied data: ${file}`);
  }
}

// 2. Copy Audio files from res/raw
const rawDir = path.join(RES, 'raw');
if (fs.existsSync(rawDir)) {
  const audioFiles = fs.readdirSync(rawDir);
  for (const file of audioFiles) {
    if (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.json')) {
      const src = path.join(rawDir, file);
      const stat = fs.statSync(src);
      // Copy files under 20MB
      if (stat.size < 20 * 1024 * 1024) {
        fs.copyFileSync(src, path.join(DEST, 'assets', 'audio', file));
      }
    }
  }
  console.log(`Copied audio from res/raw`);
}

// 3. Copy Images from res/drawable-nodpi-v4
const nodpiDir = path.join(RES, 'drawable-nodpi-v4');
if (fs.existsSync(nodpiDir)) {
  const files = fs.readdirSync(nodpiDir);
  for (const file of files) {
    if (
      file.startsWith('crest_') ||
      file.startsWith('fire_') ||
      file.startsWith('quest_') ||
      file.startsWith('reward_box_') ||
      file.startsWith('streak_') ||
      file.startsWith('hardmode_') ||
      file.startsWith('icon_preview_') ||
      file.startsWith('house_')
    ) {
      fs.copyFileSync(path.join(nodpiDir, file), path.join(DEST, 'assets', 'images', file));
    }
  }
  console.log(`Copied images from drawable-nodpi-v4`);
}

// 4. Copy Backgrounds & Workout Images from res/drawable
const drawableDir = path.join(RES, 'drawable');
if (fs.existsSync(drawableDir)) {
  const files = fs.readdirSync(drawableDir);
  for (const file of files) {
    if (
      file.endsWith('_bg.webp') ||
      file.endsWith('_bg.png') ||
      file.endsWith('_bg.jpg') ||
      file.startsWith('workout_') ||
      file.startsWith('streak_') ||
      file.startsWith('tasks_left_') ||
      file.startsWith('book_cover_') ||
      file.startsWith('bronze_') ||
      file.startsWith('diamond_') ||
      file.startsWith('brian_') ||
      file.startsWith('zac_') ||
      file.startsWith('common_') ||
      file.startsWith('tool_') ||
      file.startsWith('avatar_')
    ) {
      fs.copyFileSync(path.join(drawableDir, file), path.join(DEST, 'assets', 'images', file));
    }
  }
  console.log(`Copied images from drawable`);
}

console.log('All essential APK assets copied to life-reset!');
