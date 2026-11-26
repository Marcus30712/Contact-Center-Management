// Settings page: language, display theme, progress backup, offline status,
// the install note (moved from home) and the version/links footer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setupDom, click } from './dom.js';
import { fakeStorage, throwingStorage } from './helpers.js';
import { SETTINGS_UI, APP_VERSION } from '../../settings/data.js';
import { INSTALL_UI } from '../../settings/install-data.js';
import { THEME_KEY, loadTheme, saveTheme, applyTheme, BACKUP_KEYS, makeBackup, readBackup, restoreBackup, RESET_KEYS, resetLearning } from '../../settings/engine.js';
import { renderSettings, newSettingsView } from '../../settings/render.js';
import { HOME_UI } from '../../home/data.js';
import { PRIVACY_TEXT } from '../../privacy/text.js';
import { ROLE_KEY, ROLE_ASKED_KEY, ROLES, loadRole } from '../../shared/role.js';
import { ROLE_UI, ROLE_NAMES } from '../../shared/role-data.js';
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
  assert.equal(table.length, 28);
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
  'queuecraft:role': 'sme',
  'queuecraft:role-asked': '1',
  'agent-lifecycle-course:v1': '{"completed":["hiring"]}',
  'sop-library:v1': '{"completed":["pip"]}',
  'excel-practice:v1': '{"completed":["1"],"scores":{}}',
  'kb-practice:v1': '{"days":["2026-11-20"]}',
  'sme-course:v1': '{"completed":["peer"]}',
  'queuecraft:review:v1': '{"sme":{"best":6,"total":6,"passed":true}}',
  'sme-lifecycle:v1': '{"completed":["trainee"]}',
  'sme-sop:v1': '{"completed":["voc"]}',
  'tl-course:v1': '{"completed":["roster"]}',
  'tl-support:v1': '{"completed":["qa"]}',
  'other-site:key': 'not ours',
});

test('a backup holds exactly the fifteen Queuecraft keys that are set', () => {
  assert.deepEqual(BACKUP_KEYS, ['agent-lifecycle-course:lang', 'agent-lifecycle-course:track', 'queuecraft:theme',
    'queuecraft:role', 'queuecraft:role-asked',
    'agent-lifecycle-course:v1', 'sop-library:v1', 'excel-practice:v1', 'kb-practice:v1', 'sme-course:v1', 'queuecraft:review:v1', 'sme-lifecycle:v1', 'sme-sop:v1', 'tl-course:v1', 'tl-support:v1']);
  const b = makeBackup(filled(), '2026-11-20');
  assert.equal(b.app, 'queuecraft');
  assert.equal(b.format, 1);
  assert.equal(b.exported, '2026-11-20');
  assert.deepEqual(Object.keys(b.data), BACKUP_KEYS);
  assert.equal(b.data['other-site:key'], undefined);
  assert.deepEqual(makeBackup(fakeStorage(), '2026-11-20').data, {});
  assert.ok(!BACKUP_KEYS.includes('queuecraft:tour'), 'the tutorial is not progress');
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

test('restoring an older backup keeps the role', () => {
  const s = fakeStorage({ [ROLE_KEY]: 'sme', [ROLE_ASKED_KEY]: '1' });
  assert.equal(restoreBackup(s, { 'agent-lifecycle-course:v1': '{"completed":[]}' }), true);
  assert.equal(loadRole(s), 'sme');
  assert.equal(s.getItem(ROLE_ASKED_KEY), '1');
  restoreBackup(s, { 'agent-lifecycle-course:v1': '{"completed":[]}', [ROLE_KEY]: 'om' });
  assert.equal(loadRole(s), 'om');
});

test('backup and reset include SME SOP progress', () => {
  const old = fakeStorage();
  assert.equal(restoreBackup(old, { 'sme-lifecycle:v1': '{"completed":["trainee"]}' }), true);
  assert.equal(old.getItem('sme-sop:v1'), null);
  const s = fakeStorage({ [ROLE_KEY]: 'sme', 'sme-sop:v1': '{"completed":["voc"]}' });
  assert.equal(makeBackup(s, '2026-11-25').data['sme-sop:v1'], '{"completed":["voc"]}');
  assert.equal(resetLearning(s), true);
  assert.equal(s.getItem('sme-sop:v1'), null);
  assert.equal(loadRole(s), 'sme');
});

test('backup and reset include support lifecycle progress', () => {
  const old = fakeStorage();
  // A backup made before the course existed has no support lifecycle key.
  assert.equal(restoreBackup(old, { 'sme-course:v1': '{"completed":["peer"]}' }), true);
  assert.equal(old.getItem('sme-course:v1'), '{"completed":["peer"]}');
  assert.equal(old.getItem('sme-lifecycle:v1'), null);
  const s = fakeStorage({ [ROLE_KEY]: 'sme', 'sme-lifecycle:v1': '{"completed":["trainee"]}' });
  assert.equal(makeBackup(s, '2026-11-25').data['sme-lifecycle:v1'], '{"completed":["trainee"]}');
  assert.ok(RESET_KEYS.includes('sme-lifecycle:v1'));
  assert.equal(resetLearning(s), true);
  assert.equal(s.getItem('sme-lifecycle:v1'), null);
  assert.equal(loadRole(s), 'sme');
});

test('reset keeps the role and erases SME progress', () => {
  const s = fakeStorage({ [ROLE_KEY]: 'sme', [ROLE_ASKED_KEY]: '1', 'sme-course:v1': '{"completed":["peer"]}' });
  assert.equal(resetLearning(s), true);
  assert.equal(s.getItem('sme-course:v1'), null);
  assert.equal(loadRole(s), 'sme');
  assert.equal(s.getItem(ROLE_ASKED_KEY), '1');
  assert.ok(!RESET_KEYS.includes(ROLE_KEY) && !RESET_KEYS.includes(ROLE_ASKED_KEY));
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
      [tr('langHeading'), ROLE_UI.settingsHeading[lang], INSTALL_UI.tutorialHeading[lang], tr('themeHeading'), tr('backupHeading'), tr('installHeading')]);
    assert.equal(root.querySelector('[data-install]').textContent, INSTALL_UI.installNote[lang]);
    assert.equal(root.querySelector('button[data-install-open]').textContent, INSTALL_UI.installButton[lang]);
    const foot = root.querySelector('[data-footer]');
    assert.ok(foot.textContent.includes(`${{ ko: 'CX 2회차', en: 'CX Replay' }[lang]} v${APP_VERSION}`));
    assert.equal(foot.querySelector('a[data-privacy]').getAttribute('href'), '../privacy/');
    assert.equal(foot.querySelector('a[data-privacy]').textContent, PRIVACY_TEXT.link[lang]);
    assert.equal(foot.querySelector('a[data-references]').getAttribute('href'), '../references/');
    assert.equal(foot.querySelector('a[data-references]').textContent, REFERENCES_TEXT.title[lang]);
    if (lang === 'en') assert.ok(!/[가-힣]/.test(root.textContent.replace('한국어', '')));
  }
});

test('the role section sits after language and saves the pick', () => {
  for (const lang of ['ko', 'en']) {
    const s = fakeStorage({ [ROLE_KEY]: 'sme' });
    const { root, document } = page(s, lang);
    const sec = root.querySelector('[data-role-section]');
    assert.equal(sec.querySelector('h2').textContent, ROLE_UI.settingsHeading[lang]);
    assert.equal(sec.querySelector('p').textContent, ROLE_UI.settingsNote[lang]);
    const radios = [...sec.querySelectorAll('[data-set-role]')];
    assert.deepEqual(radios.map((r) => r.getAttribute('data-set-role')), ROLES);
    assert.deepEqual(radios.map((r) => r.textContent), ROLES.map((r) => ROLE_NAMES[r][lang]));
    assert.equal(sec.querySelector('[data-set-role="sme"]').getAttribute('aria-checked'), 'true');
    sec.querySelector('[data-set-role="am"]').focus();
    click(sec.querySelector('[data-set-role="am"]'));
    assert.equal(loadRole(s), 'am');
    assert.equal(root.querySelector('[data-set-role="am"]').getAttribute('aria-checked'), 'true');
    assert.equal(document.activeElement, root.querySelector('[data-set-role="am"]'));
  }
});

// 2026-11-26: a new role in Settings takes the learner to that role's home.
test('picking a role saves it first, then hands it on so the page can go home', () => {
  const s = fakeStorage({ [ROLE_KEY]: 'tl' });
  const seen = [];
  const { root } = page(s, 'ko', { onRole: (r) => seen.push([r, loadRole(s)]) });
  click(root.querySelector('[data-set-role="sme"]'));
  assert.deepEqual(seen, [['sme', 'sme']]);
});

test('the settings page sends a new role home', () => {
  assert.match(file('settings/app.js'), /onRole: \(\) => location\.assign\('\.\.\/'\)/);
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
  assert.ok(html.includes('<span class="role-slot" data-role-slot></span>') && html.includes('../shared/appbar.js'));
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
  assert.ok(page(fakeStorage(), 'ko', { build: '946492ed754b' }).root.querySelector('[data-footer]').textContent.includes(`CX 2회차 v${APP_VERSION} (946492ed)`));
  assert.ok(page(fakeStorage(), 'ko', { build: null }).root.querySelector('[data-footer]').textContent.startsWith(`CX 2회차 v${APP_VERSION} · `));
});

test('the tutorial has its own section with a View link', () => {
  for (const lang of ['ko', 'en']) {
    const { root } = page(fakeStorage(), lang);
    const sec = root.querySelector('[data-tutorial]');
    assert.equal(sec.querySelector('h2').textContent, INSTALL_UI.tutorialHeading[lang]);
    assert.ok(sec.textContent.includes(INSTALL_UI.tutorialRow[lang]));
    assert.ok(sec.textContent.includes(INSTALL_UI.tutorialNote[lang]));
    const a = sec.querySelector('a[data-tour-replay]');
    assert.equal(a.getAttribute('href'), '../?tour=1');
    assert.equal(a.textContent, INSTALL_UI.tutorialButton[lang]);
    const ids = a.getAttribute('aria-labelledby').split(' ');
    assert.deepEqual(ids.map((id) => root.ownerDocument.getElementById(id)?.textContent), [INSTALL_UI.tutorialRow[lang], INSTALL_UI.tutorialButton[lang]]);
  }
});

// ---------- 2026-11-21: reset learning ----------
test('reset clears only the ten learning records and reports whether anything was there', () => {
  assert.deepEqual(RESET_KEYS, ['agent-lifecycle-course:v1', 'sop-library:v1', 'excel-practice:v1', 'kb-practice:v1', 'sme-course:v1', 'queuecraft:review:v1', 'sme-lifecycle:v1', 'sme-sop:v1', 'tl-course:v1', 'tl-support:v1']);
  const s = filled();
  s.setItem('queuecraft:tour', 'done');
  assert.equal(resetLearning(s), true);
  for (const k of RESET_KEYS) assert.equal(s.getItem(k), null, k);
  for (const k of ['agent-lifecycle-course:lang', 'agent-lifecycle-course:track', 'queuecraft:theme', 'queuecraft:role', 'queuecraft:tour', 'other-site:key']) assert.notEqual(s.getItem(k), null, k);
  assert.equal(resetLearning(s), false, 'nothing left to erase');
  assert.equal(resetLearning(throwingStorage), false);
  assert.equal(resetLearning(null), false);
});

test('Reset learning asks first with the focus on Cancel; Cancel keeps, Erase clears and says so', () => {
  const s = filled();
  const { root } = page(s, 'ko');
  const btn = root.querySelector('button[data-reset]');
  assert.equal(btn.textContent, SETTINGS_UI.reset.ko);
  btn.click();
  const ask = root.querySelector('[data-reset-confirm]');
  assert.ok(ask.textContent.includes(SETTINGS_UI.resetAsk.ko) && ask.textContent.includes(SETTINGS_UI.resetAskNote.ko));
  assert.equal(root.ownerDocument.activeElement, ask.querySelector('[data-reset-cancel]'));
  ask.querySelector('[data-reset-cancel]').click();
  assert.equal(root.querySelector('[data-reset-confirm]'), null);
  assert.notEqual(s.getItem('sop-library:v1'), null);
  assert.equal(root.ownerDocument.activeElement, root.querySelector('button[data-reset]'));
  root.querySelector('button[data-reset]').click();
  const erase = root.querySelector('[data-reset-confirm] [data-reset-go]');
  assert.equal(erase.textContent, SETTINGS_UI.resetConfirm.ko);
  erase.click();
  assert.equal(s.getItem('sop-library:v1'), null);
  assert.notEqual(s.getItem('agent-lifecycle-course:lang'), null);
  assert.equal(root.querySelector('[data-reset-confirm]'), null);
  assert.equal(root.ownerDocument.querySelector('[data-status]').textContent, SETTINGS_UI.resetDone.ko);
});

test('with nothing to erase, Reset learning only says so', () => {
  const s = fakeStorage({ 'agent-lifecycle-course:lang': 'ko' });
  const { root } = page(s, 'ko');
  root.querySelector('button[data-reset]').click();
  assert.equal(root.querySelector('[data-reset-confirm]'), null);
  assert.equal(root.ownerDocument.querySelector('[data-status]').textContent, SETTINGS_UI.resetNone.ko);
});
