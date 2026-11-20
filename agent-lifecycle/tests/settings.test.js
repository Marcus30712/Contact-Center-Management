// Settings page: language, display theme, progress backup, offline status,
// the install note (moved from home) and the version/links footer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setupDom, click } from './dom.js';
import { fakeStorage } from './helpers.js';
import { SETTINGS_UI, APP_VERSION } from '../../settings/data.js';
import { THEME_KEY, loadTheme, saveTheme, applyTheme, BACKUP_KEYS, makeBackup, readBackup, restoreBackup } from '../../settings/engine.js';
import { renderSettings, newSettingsView } from '../../settings/render.js';
import { HOME_UI } from '../../home/data.js';
import { PRIVACY_TEXT } from '../../privacy/text.js';
import { REFERENCES_TEXT } from '../../references/text.js';

const file = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const DOC = file('docs/superpowers/specs/2026-11-20-settings-design.md');
const rows = () => {
  const start = DOC.indexOf('| 키 | 한국어 | English |');
  const out = [];
  for (const line of DOC.slice(start).split('\n').slice(2)) {
    if (!line.startsWith('|')) break;
    out.push(line.slice(1, -1).split(' | ').map((c) => c.trim()));
  }
  return out;
};

test('settings wording is the confirmed table, in both languages', () => {
  const table = rows();
  assert.equal(table.length, 22);
  assert.deepEqual(Object.keys(SETTINGS_UI), table.map((r) => r[0]));
  for (const [key, ko, en] of table) assert.deepEqual(SETTINGS_UI[key], { ko, en }, key);
  for (const v of Object.values(SETTINGS_UI)) assert.ok(!/[가-힣]/.test(v.en), v.en);
  assert.equal(APP_VERSION, '0.1.0');
});

// ---------- theme ----------
test('the theme is system unless light or dark was saved, and survives blocked storage', () => {
  const s = fakeStorage();
  assert.equal(loadTheme(s), 'system');
  saveTheme(s, 'dark');
  assert.equal(s.getItem(THEME_KEY), 'dark');
  assert.equal(loadTheme(s), 'dark');
  saveTheme(s, 'purple');
  assert.equal(loadTheme(s), 'system');
  assert.equal(loadTheme({ getItem() { throw new Error('blocked'); } }), 'system');
  assert.doesNotThrow(() => saveTheme({ setItem() { throw new Error('blocked'); } }, 'dark'));
});

test('applying a theme sets or clears <html data-theme>', () => {
  const { document } = setupDom();
  applyTheme(document, 'dark');
  assert.equal(document.documentElement.dataset.theme, 'dark');
  applyTheme(document, 'light');
  assert.equal(document.documentElement.dataset.theme, 'light');
  applyTheme(document, 'system');
  assert.equal(document.documentElement.hasAttribute('data-theme'), false);
});

test('every page sets the theme in its head before drawing, using the same key', () => {
  const boot = file('shared/theme-boot.js');
  assert.ok(boot.includes(`'${THEME_KEY}'`));
  const pages = ['', 'agent-lifecycle/', 'sop-library/', 'codex/', 'staffing-calculator/', 'glossary/', 'references/', 'guide/', 'practice/', 'excel/', 'privacy/', 'settings/'];
  for (const p of pages) {
    const html = file(`${p}index.html`);
    const up = p ? '../' : './';
    const head = html.slice(0, html.indexOf('</head>'));
    assert.ok(head.includes(`<script src="${up}shared/theme-boot.js"></script>`), p || 'home');
  }
});

// ---------- backup ----------
const filled = () => fakeStorage({
  'agent-lifecycle-course:lang': 'en',
  'agent-lifecycle-course:track': 'tech',
  'queuecraft:theme': 'dark',
  'agent-lifecycle-course:v1': '{"completed":["hiring"]}',
  'sop-library:v1': '{"completed":["pip"]}',
  'excel-practice:v1': '{"completed":["1"],"scores":{}}',
  'kb-practice:v1': '{"days":["2026-11-20"]}',
  'other-site:key': 'not ours',
});

test('a backup holds exactly the seven Queuecraft keys that are set', () => {
  assert.deepEqual(BACKUP_KEYS, ['agent-lifecycle-course:lang', 'agent-lifecycle-course:track', 'queuecraft:theme',
    'agent-lifecycle-course:v1', 'sop-library:v1', 'excel-practice:v1', 'kb-practice:v1']);
  const b = makeBackup(filled(), '2026-11-20');
  assert.equal(b.app, 'queuecraft');
  assert.equal(b.format, 1);
  assert.equal(b.exported, '2026-11-20');
  assert.deepEqual(Object.keys(b.data), BACKUP_KEYS);
  assert.equal(b.data['other-site:key'], undefined);
  assert.deepEqual(makeBackup(fakeStorage(), '2026-11-20').data, {});
});

test('reading a backup accepts Queuecraft files only', () => {
  const good = JSON.stringify(makeBackup(filled(), '2026-11-20'));
  assert.deepEqual(readBackup(good), JSON.parse(good).data);
  for (const bad of ['', 'not json', '[]', '{"app":"ria","format":1,"data":{}}', '{"app":"queuecraft","format":2,"data":{}}',
    '{"app":"queuecraft","format":1}', '{"app":"queuecraft","format":1,"data":{"agent-lifecycle-course:lang":3}}',
    '{"app":"queuecraft","format":1,"data":{"stranger":"x"}}']) {
    assert.equal(readBackup(bad), null, bad);
  }
});

test('restoring replaces our keys, clears ours that the file lacks, and leaves other keys alone', () => {
  const s = filled();
  const ok = restoreBackup(s, { 'agent-lifecycle-course:lang': 'ko', 'kb-practice:v1': '{"days":[]}' });
  assert.equal(ok, true);
  assert.equal(s.getItem('agent-lifecycle-course:lang'), 'ko');
  assert.equal(s.getItem('kb-practice:v1'), '{"days":[]}');
  assert.equal(s.getItem('agent-lifecycle-course:v1'), null);
  assert.equal(s.getItem('queuecraft:theme'), null);
  assert.equal(s.getItem('other-site:key'), 'not ours');
  assert.equal(restoreBackup({ setItem() { throw new Error('full'); }, removeItem() {} }, {}), true);
  assert.equal(restoreBackup({ setItem() { throw new Error('full'); }, removeItem() {} }, { 'kb-practice:v1': '{}' }), false);
});

// ---------- page ----------
function page(storage = fakeStorage(), lang = 'ko', opts = {}) {
  const { root, document } = setupDom();
  const view = newSettingsView();
  const calls = { lang: [], downloads: [] };
  // Like the app: a language change redraws the page in that language.
  const o = { onLang: (l) => { calls.lang.push(l); renderSettings(root, l, storage, view, o); }, download: (name, text) => calls.downloads.push({ name, text }), today: '2026-11-20', offline: false, ...opts };
  renderSettings(root, lang, storage, view, o);
  return { root, document, view, calls, again: (l = lang) => renderSettings(root, l, storage, view, o) };
}

test('the page shows its sections in order with the confirmed words', () => {
  for (const lang of ['ko', 'en']) {
    const { root } = page(fakeStorage(), lang);
    const tr = (k) => SETTINGS_UI[k][lang];
    assert.equal(root.querySelector('h1').textContent, tr('title'));
    assert.deepEqual([...root.querySelectorAll('h2')].map((x) => x.textContent),
      [tr('langHeading'), tr('themeHeading'), tr('backupHeading'), tr('installHeading')]);
    assert.ok(root.querySelector('[data-install]').textContent === HOME_UI.install[lang]);
    const foot = root.querySelector('[data-footer]');
    assert.ok(foot.textContent.includes(`Queuecraft v${APP_VERSION}`));
    assert.equal(foot.querySelector('a[data-privacy]').getAttribute('href'), '../privacy/');
    assert.equal(foot.querySelector('a[data-privacy]').textContent, PRIVACY_TEXT.link[lang]);
    assert.equal(foot.querySelector('a[data-references]').getAttribute('href'), '../references/');
    assert.equal(foot.querySelector('a[data-references]').textContent, REFERENCES_TEXT.title[lang]);
    if (lang === 'en') assert.ok(!/[가-힣]/.test(root.textContent.replace('한국어', '')));
  }
});

test('language buttons show the current one and report a change', () => {
  const { root, calls } = page(fakeStorage(), 'ko');
  assert.equal(root.querySelector('[data-set-lang="ko"]').getAttribute('aria-checked'), 'true');
  click(root.querySelector('[data-set-lang="en"]'));
  assert.deepEqual(calls.lang, ['en']);
});

test('picking a theme saves it, applies it at once and keeps focus on the choice', () => {
  const s = fakeStorage();
  const { root, document } = page(s);
  assert.equal(root.querySelector('[data-theme-pick="system"]').getAttribute('aria-checked'), 'true');
  root.querySelector('[data-theme-pick="dark"]').focus();
  click(root.querySelector('[data-theme-pick="dark"]'));
  assert.equal(s.getItem(THEME_KEY), 'dark');
  assert.equal(document.documentElement.dataset.theme, 'dark');
  assert.equal(root.querySelector('[data-theme-pick="dark"]').getAttribute('aria-checked'), 'true');
  assert.equal(document.activeElement, root.querySelector('[data-theme-pick="dark"]'));
});

test('export downloads a dated Queuecraft file and says so', () => {
  const { root, calls, document } = page(filled());
  click(root.querySelector('[data-export]'));
  assert.equal(calls.downloads.length, 1);
  assert.equal(calls.downloads[0].name, 'queuecraft-backup-2026-11-20.json');
  assert.deepEqual(readBackup(calls.downloads[0].text), makeBackup(filled(), '2026-11-20').data);
  assert.equal(document.querySelector('[data-status]').textContent, SETTINGS_UI.exported.ko);
});

test('import asks first; cancel keeps progress, replace restores it and redraws in the file language', async () => {
  const s = fakeStorage({ 'agent-lifecycle-course:v1': '{"completed":["hiring"]}' });
  const { root, view, again, document, calls } = page(s);
  const text = JSON.stringify({ app: 'queuecraft', format: 1, exported: '2026-11-19', data: { 'agent-lifecycle-course:lang': 'en', 'kb-practice:v1': '{"days":[]}' } });
  await view.pick(text);
  again();
  assert.ok(root.querySelector('[data-confirm]').textContent.includes(SETTINGS_UI.importAsk.ko));
  click(root.querySelector('[data-cancel]'));
  assert.equal(root.querySelector('[data-confirm]'), null);
  assert.equal(s.getItem('agent-lifecycle-course:v1'), '{"completed":["hiring"]}');
  await view.pick(text);
  again();
  click(root.querySelector('[data-replace]'));
  assert.equal(s.getItem('agent-lifecycle-course:v1'), null);
  assert.equal(s.getItem('kb-practice:v1'), '{"days":[]}');
  assert.deepEqual(calls.lang, ['en'], 'the page follows the language in the file');
  assert.equal(document.querySelector('[data-status]').textContent, SETTINGS_UI.imported.en);
});

test('a bad file is refused with a message and nothing changes', async () => {
  const s = fakeStorage({ 'kb-practice:v1': '{"days":["2026-11-20"]}' });
  const { root, view, again, document } = page(s);
  await view.pick('{"app":"ria"}');
  again();
  assert.equal(root.querySelector('[data-confirm]'), null);
  assert.equal(document.querySelector('[data-status]').textContent, SETTINGS_UI.importBad.ko);
  assert.equal(s.getItem('kb-practice:v1'), '{"days":["2026-11-20"]}');
});

test('offline status reads ready or waiting', () => {
  assert.equal(page(fakeStorage(), 'ko', { offline: true }).root.querySelector('[data-offline]').textContent, SETTINGS_UI.offlineReady.ko);
  assert.equal(page(fakeStorage(), 'ko', { offline: false }).root.querySelector('[data-offline]').textContent, SETTINGS_UI.offlineWait.ko);
});

test('the settings page is a real page and home no longer shows the install note', async () => {
  const html = file('settings/index.html');
  assert.ok(html.includes('<a class="brand" href="../">Queuecraft</a>') && html.includes('../shared/appbar.js'));
  assert.ok(file('sw.js').includes('"settings/index.html"'));
  const { renderHome } = await import('../../home/render.js');
  const { root } = setupDom();
  renderHome(root, 'ko', fakeStorage(), '2026-11-20');
  assert.equal(root.querySelector('[data-install]'), null);
  assert.ok(root.querySelector('a[data-privacy]'));
});

test('coming back with the back button re-applies the saved display', async () => {
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { runScripts: 'outside-only', url: 'https://x.test/' });
  dom.window.localStorage.setItem('queuecraft:theme', 'dark');
  dom.window.eval(file('shared/theme-boot.js'));
  const root = dom.window.document.documentElement;
  assert.equal(root.getAttribute('data-theme'), 'dark');
  dom.window.localStorage.setItem('queuecraft:theme', 'light');
  const back = new dom.window.Event('pageshow');
  Object.defineProperty(back, 'persisted', { value: true });
  dom.window.dispatchEvent(back);
  assert.equal(root.getAttribute('data-theme'), 'light');
  dom.window.localStorage.setItem('queuecraft:theme', 'system');
  dom.window.dispatchEvent(back);
  assert.equal(root.hasAttribute('data-theme'), false);
});

test('a file with no progress in it is refused, so one tap cannot wipe every record', () => {
  assert.equal(readBackup('{"app":"queuecraft","format":1,"exported":"2026-11-20","data":{}}'), null);
  assert.equal(readBackup('{"app":"queuecraft","format":1,"data":{"agent-lifecycle-course:lang":"en","queuecraft:theme":"dark"}}'), null);
  assert.ok(readBackup('{"app":"queuecraft","format":1,"data":{"sop-library:v1":"{}"}}'));
});

test('the backup uses the SOP library\'s own progress key', async () => {
  const { SOP_PROGRESS_KEY } = await import('../../sop-library/ui.js');
  assert.ok(BACKUP_KEYS.includes(SOP_PROGRESS_KEY));
  assert.ok(!file('settings/engine.js').includes("'sop-library:v1'"));
});

test('the import question takes focus first, not the Replace button', async () => {
  const s = fakeStorage();
  const { root, view, document } = page(s);
  await view.pick(JSON.stringify({ app: 'queuecraft', format: 1, data: { 'kb-practice:v1': '{}' } }));
  const input = root.querySelector('[data-import-file]');
  // Simulate the browser handing the file over.
  Object.defineProperty(input, 'files', { value: [{ text: async () => JSON.stringify({ app: 'queuecraft', format: 1, data: { 'kb-practice:v1': '{}' } }) }] });
  input.dispatchEvent(new window.Event('change'));
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(document.activeElement, root.querySelector('[data-confirm]'));
});

test('choice rows work like radio groups: one Tab stop, arrows move and pick', () => {
  const s = fakeStorage();
  const { root, document, calls } = page(s);
  const picks = () => [...root.querySelectorAll('[data-theme-pick]')];
  assert.deepEqual(picks().map((b) => b.getAttribute('tabindex')), ['0', '-1', '-1']);
  picks()[0].focus();
  picks()[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(s.getItem(THEME_KEY), 'light');
  assert.equal(document.activeElement, root.querySelector('[data-theme-pick="light"]'));
  root.querySelector('[data-theme-pick="light"]').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  assert.equal(s.getItem(THEME_KEY), 'dark');
  root.querySelector('[data-theme-pick="dark"]').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(s.getItem(THEME_KEY), 'system', 'wraps around');
  root.querySelector('[data-set-lang="ko"]').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  assert.deepEqual(calls.lang, ['en']);
});

test('the footer shows the build next to the version when it is known', () => {
  assert.ok(page(fakeStorage(), 'ko', { build: '946492ed754b' }).root.querySelector('[data-footer]').textContent.includes(`Queuecraft v${APP_VERSION} (946492ed)`));
  assert.ok(page(fakeStorage(), 'ko', { build: null }).root.querySelector('[data-footer]').textContent.startsWith(`Queuecraft v${APP_VERSION} · `));
});
