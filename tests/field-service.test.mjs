import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fieldAppUrl } from '../js/ui/FieldApps.js';

const vercel = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('Spider Field links and legacy URLs embed the live Gambit web app', () => {
  assert.equal(fieldAppUrl('launcher'), 'https://gambit-d9b.pages.dev/field/index.html');
  for (const app of ['routine', 'timetable', 'dopamine', 'finance', 'todo', 'habits', 'journal', 'gym']) {
    assert.equal(fieldAppUrl(app), `https://gambit-d9b.pages.dev/field/apps/${app}/index.html`);
  }
  for (const source of ['/field', '/field/', '/gambit', '/gambit/']) {
    assert.equal(vercel.redirects.find(rule => rule.source === source)?.destination, 'https://gambit-d9b.pages.dev/field/');
  }
  assert.equal(vercel.redirects.find(rule => rule.source === '/field/:path*')?.destination, 'https://gambit-d9b.pages.dev/field/:path*');
  assert.equal(vercel.redirects.find(rule=>rule.source==='/field-view/:asset*').destination,'https://gambit-d9b.pages.dev/field/:asset*');
});

test('Spider keeps a local export path for data saved before the domain move', () => {
  const page = fs.readFileSync(new URL('../field-transfer.html', import.meta.url), 'utf8');
  assert.match(page, /Tải dữ liệu Field/);
  assert.match(page, /gambit-d9b\.pages\.dev\/field\//);
});
