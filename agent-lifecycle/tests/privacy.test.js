// Privacy policy page: wording is the confirmed table, the stored items match
// what the app really keeps, and the page is linked from home and References.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setupDom } from './dom.js';
import { PRIVACY_TEXT, GITHUB_PRIVACY_URL, ISSUES_URL } from '../../privacy/text.js';
import { renderPrivacy } from '../../privacy/render.js';
import { renderHome } from '../../home/render.js';
import { HOME_UI } from '../../home/data.js';
import { REFERENCES_TEXT } from '../../references/text.js';
import { fakeStorage } from './helpers.js';

const file = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const DOC = file('docs/superpowers/specs/2026-11-20-privacy-design.md');
const table = () => {
  const start = DOC.indexOf('| 키 | 한국어 | English |');
  const out = [];
  for (const line of DOC.slice(start).split('\n').slice(2)) {
    if (!line.startsWith('|')) break;
    out.push(line.slice(1, -1).split(' | ').map((c) => c.trim()));
  }
  return out;
};

test('privacy wording is the confirmed table, in both languages', () => {
  const rows = table();
  assert.equal(rows.length, 27);
  assert.deepEqual(Object.keys(PRIVACY_TEXT), rows.map((r) => r[0]));
  for (const [key, ko, en] of rows) assert.deepEqual(PRIVACY_TEXT[key], { ko, en }, key);
  for (const v of Object.values(PRIVACY_TEXT)) assert.ok(!/[가-힣]/.test(v.en), v.en);
});

test('no personal contact details and no named law', () => {
  for (const v of Object.values(PRIVACY_TEXT)) {
    for (const s of [v.ko, v.en]) {
      assert.ok(!s.includes('@'), s);
      assert.ok(!/\+?\d[\d\s-]{8,}\d/.test(s), s);
      assert.ok(!/개인정보 보호법|GDPR|CCPA|PDPA|제\d+조/.test(s), s);
    }
  }
  assert.equal(ISSUES_URL, 'https://github.com/Marcus30712/Contact-Center-Management/issues');
  assert.equal(GITHUB_PRIVACY_URL, 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement');
});

test('the stored items match the keys the app really keeps', () => {
  const sources = ['agent-lifecycle/js/engine/i18n.js', 'agent-lifecycle/js/engine/track.js', 'agent-lifecycle/js/engine/progress.js',
    'sop-library/app.js', 'excel/engine.js', 'practice/engine.js', 'shared/tour-data.js'].map((p) => { try { return file(p); } catch { return ''; } }).join('\n');
  for (const key of ['agent-lifecycle-course:lang', 'agent-lifecycle-course:track', 'agent-lifecycle-course:v1', 'sop-library:v1', 'excel-practice:v1', 'kb-practice:v1', 'queuecraft:tour']) {
    assert.ok(sources.includes(key), key);
  }
});

test('nothing new is stored without updating the policy: eight setItem calls, no other storage', async () => {
  const { execFileSync } = await import('node:child_process');
  const root = new URL('../../', import.meta.url).pathname;
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '*.js'], { cwd: root, encoding: 'utf8' }).split('\n')
    .filter((f) => f && !f.includes('tests/') && !f.includes('scripts/') && !f.startsWith('tools/') && !f.startsWith('docs/'));
  const all = files.map((f) => file(f)).join('\n');
  // 5 + the display theme + restoring a backup (Settings) + the first-run tour.
  assert.equal((all.match(/\.setItem\(/g) ?? []).length, 8, 'a new stored item needs a line in the privacy policy');
  assert.ok(!/sessionStorage|indexedDB|document\.cookie|sendBeacon|XMLHttpRequest|WebSocket/.test(all));
});

test('the page shows the title, the eight sections, the stored items and both links', () => {
  for (const lang of ['ko', 'en']) {
    const { root } = setupDom();
    renderPrivacy(root, lang);
    assert.equal(root.querySelector('h1').textContent, PRIVACY_TEXT.title[lang]);
    assert.deepEqual([...root.querySelectorAll('h2')].map((x) => x.textContent),
      [1, 2, 3, 4, 5, 6, 7, 8].map((n) => PRIVACY_TEXT[`s${n}.heading`][lang]));
    assert.deepEqual([...root.querySelectorAll('[data-stored] li')].map((x) => x.textContent),
      [1, 2, 3, 4].map((n) => PRIVACY_TEXT[`s2.item${n}`][lang]));
    assert.equal(root.querySelector('a[data-github-privacy]').getAttribute('href'), GITHUB_PRIVACY_URL);
    assert.equal(root.querySelector('a[data-issues]').getAttribute('href'), ISSUES_URL);
    assert.equal(root.querySelector('a[data-back]').getAttribute('href'), '../');
    assert.ok(root.textContent.includes(PRIVACY_TEXT.meta[lang]));
    assert.equal(root.querySelector('[data-backup-note]').textContent, PRIVACY_TEXT['s2.backup'][lang]);
    if (lang === 'en') assert.ok(!/[가-힣]/.test(root.textContent));
  }
});

test('home links to the privacy policy at the bottom', () => {
  const { root } = setupDom();
  renderHome(root, 'ko', fakeStorage(), '2026-11-20');
  const link = root.querySelector('a[data-privacy]');
  assert.ok(link, 'home has the link');
  assert.equal(link.getAttribute('href'), './privacy/');
  assert.equal(link.textContent, PRIVACY_TEXT.link.ko);
  assert.deepEqual(HOME_UI.privacy, PRIVACY_TEXT.link);
});

test('References links to the privacy policy', () => {
  assert.deepEqual(REFERENCES_TEXT.privacyLink, PRIVACY_TEXT.link);
  assert.ok(file('references/references.js').includes("href: '../privacy/'"));
});

test('the page is a real page: Queuecraft brand, app bar, offline list', () => {
  const html = file('privacy/index.html');
  assert.ok(html.includes('<a class="brand" href="../">Queuecraft</a>'));
  assert.ok(html.includes('../shared/appbar.js') && html.includes('./app.js'));
  assert.ok(file('sw.js').includes('"privacy/index.html"'));
});
