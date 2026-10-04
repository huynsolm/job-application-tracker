import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('PWA manifest defines installable standalone application metadata', async () => {
  const manifest = JSON.parse(await read('manifest.webmanifest'));
  assert.equal(manifest.name, '지원 기록 | Job Application Tracker');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'));
});

test('PWA registers a service worker and caches the application shell', async () => {
  const html = await read('index.html');
  const app = await read('src/app.js');
  const worker = await read('sw.js');
  assert.match(html, /manifest\.webmanifest/);
  assert.match(app, /serviceWorker\.register/);
  assert.match(worker, /index\.html/);
  assert.match(worker, /cache\.addAll/);
});
