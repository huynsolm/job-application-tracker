import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflowPath = new URL('../.github/workflows/ci.yml', import.meta.url);
const readmePath = new URL('../README.md', import.meta.url);

test('CI workflow runs tests and lint on pushes and pull requests', async () => {
  const workflow = await readFile(workflowPath, 'utf8');
  assert.match(workflow, /push:/);
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run lint/);
});

test('README exposes the GitHub Actions status badge', async () => {
  const readme = await readFile(readmePath, 'utf8');
  assert.match(readme, /actions\/workflows\/ci\.yml\/badge\.svg/);
});
