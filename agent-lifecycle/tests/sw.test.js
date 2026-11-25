import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SKIP_DIRS = new Set(['.git', 'node_modules', 'docs', 'art', 'tools', '.superpowers', '.worktrees', 'tests', 'scripts']);
const KEEP = /\.(html|js|css|webp|png|webmanifest)$/;

// The same walk tools/sw_list.py does.
function runtimeFiles(dir = ROOT) {
  return readdirSync(dir).sort().flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return SKIP_DIRS.has(name) ? [] : runtimeFiles(path);
    const rel = relative(ROOT, path).split('\\').join('/');
    return KEEP.test(name) && rel !== 'sw.js' && !rel.endsWith('.test.js') ? [rel] : [];
  });
}

const SW = readFileSync(join(ROOT, 'sw.js'), 'utf8');
const listed = JSON.parse(SW.match(/const PRECACHE = (\[[\s\S]*?\]);/)[1]);
const version = SW.match(/const VERSION = '([0-9a-f]{12})';/)[1];

test('the offline list holds every page file, plus each folder address', () => {
  const files = runtimeFiles();
  const folders = files.filter((f) => f.endsWith('index.html')).map((f) => f.replace(/index\.html$/, '') || './');
  assert.deepEqual([...listed].sort(), [...files, ...folders].map((f) => (f === './' ? './' : f)).sort());
  assert.ok(!listed.some((f) => f.endsWith('.pdf')), 'the Codex PDF is cached on first open, not ahead of time');
});

test('the version changes whenever a listed file changes', () => {
  const hash = createHash('sha256');
  for (const f of runtimeFiles()) {
    hash.update(f);
    hash.update(readFileSync(join(ROOT, f)));
  }
  assert.equal(version, hash.digest('hex').slice(0, 12), 'run: python3 tools/sw_list.py');
});

test('the app manifest has what phones need to install it', () => {
  const m = JSON.parse(readFileSync(join(ROOT, 'manifest.webmanifest'), 'utf8'));
  assert.equal(m.name, 'Queuecraft');
  assert.equal(m.short_name, 'Queuecraft');
  assert.equal(m.start_url, './');
  assert.equal(m.scope, './');
  assert.equal(m.display, 'standalone');
  const sizes = m.icons.map((i) => `${i.sizes} ${i.purpose ?? 'any'}`);
  assert.deepEqual(sizes, ['192x192 any', '512x512 any', '512x512 maskable']);
  for (const icon of m.icons) statSync(join(ROOT, icon.src));
});

test('every page links the manifest and loads the shared menu', () => {
  const pages = runtimeFiles().filter((f) => f.endsWith('index.html'));
  assert.equal(pages.length, 17);
  for (const p of pages) {
    const html = readFileSync(join(ROOT, p), 'utf8');
    const up = p === 'index.html' ? './' : '../';
    assert.ok(html.includes(`<link rel="manifest" href="${up}manifest.webmanifest">`), p);
    assert.ok(html.includes(`<script type="module" src="${up}shared/appbar.js"></script>`), p);
    assert.ok(html.includes('viewport-fit=cover'), p);
  }
});
