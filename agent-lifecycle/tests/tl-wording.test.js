// English wording (2026-11-28): sentences say "TL", labels say "Team Leader";
// a lowercase "team leader" is never shown anywhere on the site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../../', import.meta.url).pathname;
const SKIP = new Set(['node_modules', 'docs', 'tests', 'scripts', '.git', '.superpowers']);
function files(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files(p, out);
    else if (/\.(js|html)$/.test(name) && name !== 'sw.js') out.push(p);
  }
  return out;
}
// Comments are for us, not the reader.
const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/<!--[\s\S]*?-->/g, '');

test('no lowercase "team leader" in anything the site shows', () => {
  const hits = [];
  for (const f of files(ROOT)) {
    if (f.endsWith('shared/cast.js')) continue; // the words it looks for in text
    const src = strip(readFileSync(f, 'utf8'));
    for (const m of src.matchAll(/.{0,30}\b[Tt]eam leaders?\b.{0,20}/g)) hits.push(`${f.slice(ROOT.length)}: ${m[0]}`);
  }
  assert.deepEqual(hits, []);
});

test('lesson titles and subtitles spell out Team Leader, never TL', async () => {
  const { COURSE_INFO } = await import('../../shared/courses.js');
  const hits = Object.values(COURSE_INFO).flatMap((c) => c.lessons.flatMap((l) => [l.title.en, l.subtitle.en])).filter((s) => /\bTLs?\b/.test(s));
  assert.deepEqual(hits, []);
});
