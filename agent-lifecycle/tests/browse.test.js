// The Browse page (2026-11-25): the four reference cards moved off home.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setupDom } from './dom.js';
import { renderBrowse, BROWSE_UI } from '../../browse/render.js';
import { BROWSE } from '../../home/data.js';
import { browseRedirect } from '../../home/start.js';

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-role-home-copy.md', import.meta.url), 'utf8');
const row = (place) => DOC.split(/^## 5\. /m)[1].split('\n').find((l) => l.startsWith(`| ${place} |`)).slice(1, -1).split(' | ').map((c) => c.trim());

test('the page shows the title, intro and the four cards', () => {
  assert.deepEqual(BROWSE_UI.title, { ko: row('페이지 제목')[1], en: row('페이지 제목')[2] });
  assert.deepEqual(BROWSE_UI.intro, { ko: row('페이지 소개')[1], en: row('페이지 소개')[2] });
  for (const lang of ['ko', 'en']) {
    const { root } = setupDom();
    renderBrowse(root, lang);
    assert.equal(root.querySelector('h1').textContent, BROWSE_UI.title[lang]);
    assert.equal(root.querySelector('[data-intro]').textContent, BROWSE_UI.intro[lang]);
    assert.deepEqual([...root.querySelectorAll('a.card')].map((a) => a.getAttribute('href')), BROWSE.map((c) => `.${c.href}`));
    assert.deepEqual([...root.querySelectorAll('a.card strong')].map((x) => x.textContent), BROWSE.map((c) => c.title[lang]));
    if (lang === 'en') assert.ok(!/[가-힣]/.test(root.textContent));
  }
});

test('the old browse address opens the browse page', () => {
  assert.equal(browseRedirect('https://x.test/kb/#browse'), 'https://x.test/kb/browse/');
  assert.equal(browseRedirect('https://x.test/kb/index.html#browse'), 'https://x.test/kb/browse/');
  assert.equal(browseRedirect('https://x.test/kb/#learn'), null);
  assert.equal(browseRedirect('https://x.test/kb/'), null);
});
