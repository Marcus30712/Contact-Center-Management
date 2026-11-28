import { readFileSync } from 'node:fs';
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
  assert.equal(current('https://x.test/kb/browse/'), 'browse');
  assert.equal(current('https://x.test/kb/guide/'), 'guide');
  assert.equal(current('https://x.test/kb/agent-lifecycle/#coaching-3'), 'learn');
  assert.equal(current('https://x.test/kb/sop-library/'), 'learn');
  assert.equal(current('https://x.test/kb/practice/'), 'learn');
  assert.equal(current('https://x.test/kb/excel/'), 'learn');
  assert.equal(current('https://x.test/kb/sme/'), 'learn');
  assert.equal(current('https://x.test/kb/sme-lifecycle/'), 'learn');
  assert.equal(current('https://x.test/kb/sme-sop/'), 'learn');
  assert.equal(current('https://x.test/kb/agent-sop/#request-2'), 'learn');
  assert.equal(current('https://x.test/kb/am/#cover-1'), 'learn');
  assert.equal(current('https://x.test/kb/review/#sme'), 'learn');
  for (const p of ['codex/#teams', 'staffing-calculator/', 'glossary/#aht', 'references/', 'privacy/']) assert.equal(current(`https://x.test/kb/${p}`), 'browse', p);
  assert.equal(current('https://x.test/kb/settings/'), 'settings');
});

test('the menu links point at the site root wherever the page is', () => {
  const items = appBarItems(ROOT, 'https://x.test/kb/codex/#daily');
  assert.deepEqual(items.map((i) => [i.id, i.href]), [
    ['home', 'https://x.test/kb/'], ['learn', 'https://x.test/kb/#learn'],
    ['guide', 'https://x.test/kb/guide/'], ['browse', 'https://x.test/kb/browse/'], ['settings', 'https://x.test/kb/settings/'],
  ]);
});

test('the menu renders five labeled links and follows the page language', () => {
  const { document } = setupDom();
  const nav = renderAppBar(document, ROOT, 'https://x.test/kb/guide/', 'ko');
  assert.equal(nav.getAttribute('aria-label'), APPBAR_UI.label.ko);
  const links = [...nav.querySelectorAll('a')];
  assert.deepEqual(links.map((a) => a.textContent.trim()), ['홈', '배우기', '길잡이', '찾아보기', '설정']);
  assert.equal(nav.querySelector('a[aria-current="page"]').dataset.item, 'guide');
  assert.ok(links.every((a) => a.querySelector('svg[aria-hidden="true"]')));
  const en = renderAppBar(document, ROOT, 'https://x.test/kb/guide/', 'en');
  assert.deepEqual([...en.querySelectorAll('a')].map((a) => a.textContent.trim()), ['Home', 'Learn', 'Guide', 'Browse', 'Settings']);
});

test('on the home page the highlight follows where you have scrolled', async () => {
  const { homeSection, appBarItems } = await import('../../shared/appbar.js');
  // Home has no Browse section any more (2026-11-25): Learn is the last part.
  assert.equal(homeSection(0, 900), 'home');
  assert.equal(homeSection(950, 900), 'learn');
  assert.equal(homeSection(1700, 900), 'learn');
  const root = 'https://x.test/kb/';
  const current = (section) => appBarItems(root, `${root}#learn`, section).find((i) => i.current).id;
  assert.equal(current('home'), 'home', 'scrolled back up after tapping Learn');
  assert.equal(current(undefined), 'learn');
});

test('landscape phones keep content and the menu clear of the notch', async () => {
  const css = (await import('node:fs')).readFileSync(new URL('../../shared/appbar.css', import.meta.url), 'utf8');
  assert.ok(/\.page \{[^}]*safe-area-inset-left[^}]*safe-area-inset-right/.test(css));
  assert.ok(/\.appbar \{[^}]*safe-area-inset-left/.test(css));
});

test('wide screens keep their wider side margins', async () => {
  const css = (await import('node:fs')).readFileSync(new URL('../../shared/appbar.css', import.meta.url), 'utf8');
  assert.ok(/@media \(min-width: 900px\) \{\s*\.page \{[^}]*max\(32px, env\(safe-area-inset-left/.test(css));
});

test('scrolled to the bottom of home counts as Learn; index.html and ?query count as home', async () => {
  const { homeSection, isRootPage } = await import('../../shared/appbar.js');
  assert.equal(homeSection(300, 400, true), 'learn', 'the short last section can never reach the top');
  assert.equal(homeSection(300, 400, false), 'home');
  const root = 'https://x.test/kb/';
  assert.ok(isRootPage(root, `${root}`));
  assert.ok(isRootPage(root, `${root}index.html`));
  assert.ok(isRootPage(root, `${root}?utm=a#learn`));
  assert.ok(!isRootPage(root, `${root}guide/`));
});

test('changing the highlight keeps the same links, so focus stays put', async () => {
  const { renderAppBar, setCurrent } = await import('../../shared/appbar.js');
  const { setupDom } = await import('./dom.js');
  setupDom();
  const nav = renderAppBar(document, 'https://x.test/kb/', 'https://x.test/kb/', 'ko');
  const learn = nav.querySelector('[data-item="learn"]');
  setCurrent(nav, 'learn');
  assert.equal(nav.querySelector('[data-item="learn"]'), learn);
  assert.equal(learn.getAttribute('aria-current'), 'page');
  assert.equal(nav.querySelectorAll('[aria-current]').length, 1);
});

test('the menu\'s Guide follows the role', () => {
  const guide = (role, page = 'https://x.test/kb/') => appBarItems(ROOT, page, undefined, role).find((i) => i.id === 'guide');
  assert.equal(guide('sme').href, 'https://x.test/kb/sme-guide/');
  assert.equal(guide('agent').href, 'https://x.test/kb/agent-guide/');
  assert.equal(current('https://x.test/kb/agent-guide/#a3'), 'guide');
  for (const role of ['tl', 'am', 'om', undefined]) assert.equal(guide(role).href, 'https://x.test/kb/guide/', String(role));
  assert.equal(current('https://x.test/kb/sme-guide/'), 'guide');
  assert.equal(current('https://x.test/kb/guide/'), 'guide');
  assert.equal(guide('sme', 'https://x.test/kb/sme-guide/').current, true);
  const nav = renderAppBar(document, ROOT, 'https://x.test/kb/', 'ko', undefined, 'sme');
  assert.equal(nav.querySelector('a[data-item="guide"]').getAttribute('href'), 'https://x.test/kb/sme-guide/');
  const src = readFileSync(new URL('../../shared/appbar.js', import.meta.url), 'utf8');
  assert.match(src, /loadRole\(/, 'the page menu reads the saved role');
});
