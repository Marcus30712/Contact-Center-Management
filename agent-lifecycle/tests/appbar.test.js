import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
import { appBarItems, renderAppBar, APPBAR_UI } from '../../shared/appbar.js';

const ROOT = 'https://x.test/kb/';
const current = (page) => appBarItems(ROOT, page).find((i) => i.current)?.id;

test('the menu marks where you are', () => {
  assert.equal(current('https://x.test/kb/'), 'home');
  assert.equal(current('https://x.test/kb/index.html'), 'home');
  assert.equal(current('https://x.test/kb/#learn'), 'learn');
  assert.equal(current('https://x.test/kb/#browse'), 'browse');
  assert.equal(current('https://x.test/kb/guide/'), 'guide');
  assert.equal(current('https://x.test/kb/agent-lifecycle/#coaching-3'), 'learn');
  assert.equal(current('https://x.test/kb/sop-library/'), 'learn');
  assert.equal(current('https://x.test/kb/practice/'), 'learn');
  for (const p of ['codex/#teams', 'staffing-calculator/', 'glossary/#aht', 'references/']) assert.equal(current(`https://x.test/kb/${p}`), 'browse', p);
});

test('the menu links point at the site root wherever the page is', () => {
  const items = appBarItems(ROOT, 'https://x.test/kb/codex/#daily');
  assert.deepEqual(items.map((i) => [i.id, i.href]), [
    ['home', 'https://x.test/kb/'], ['learn', 'https://x.test/kb/#learn'],
    ['guide', 'https://x.test/kb/guide/'], ['browse', 'https://x.test/kb/#browse'],
  ]);
});

test('the menu renders four labeled links and follows the page language', () => {
  const { document } = setupDom();
  const nav = renderAppBar(document, ROOT, 'https://x.test/kb/guide/', 'ko');
  assert.equal(nav.getAttribute('aria-label'), APPBAR_UI.label.ko);
  const links = [...nav.querySelectorAll('a')];
  assert.deepEqual(links.map((a) => a.textContent.trim()), ['홈', '배우기', '길잡이', '찾아보기']);
  assert.equal(nav.querySelector('a[aria-current="page"]').dataset.item, 'guide');
  assert.ok(links.every((a) => a.querySelector('svg[aria-hidden="true"]')));
  const en = renderAppBar(document, ROOT, 'https://x.test/kb/guide/', 'en');
  assert.deepEqual([...en.querySelectorAll('a')].map((a) => a.textContent.trim()), ['Home', 'Learn', 'Guide', 'Browse']);
});
