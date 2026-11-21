// Settings: the tutorial section and the "Add to Home Screen" sheet. Wording is
// the confirmed table in the design document.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { INSTALL_UI } from '../../settings/install-data.js';

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-21-settings-install-sheet-design.md', import.meta.url), 'utf8');
const table = () => {
  const start = DOC.indexOf('| 키 | 한국어 | English |');
  const out = [];
  for (const line of DOC.slice(start).split('\n').slice(2)) {
    if (!line.startsWith('|')) break;
    out.push(line.slice(1, -1).split(' | ').map((c) => c.trim()));
  }
  return out;
};

test('install wording is the confirmed table', () => {
  const rows = table();
  assert.equal(rows.length, 24);
  assert.deepEqual(Object.keys(INSTALL_UI), rows.map((r) => r[0]));
  for (const [key, ko, en] of rows) assert.deepEqual(INSTALL_UI[key], { ko, en }, key);
  for (const v of Object.values(INSTALL_UI)) assert.ok(!/[가-힣]/.test(v.en), v.en);
});

// ---- The sheet ----
import { setupDom, click } from './dom.js';
import { installPlatform, openInstallSheet } from '../../settings/install-sheet.js';

const q = (sel) => document.querySelector(sel);
const press = (target, name) => target.dispatchEvent(new window.KeyboardEvent('keydown', { key: name, bubbles: true }));
function opener() {
  const { document } = setupDom();
  const b = document.createElement('button');
  b.textContent = 'open';
  document.body.append(b);
  b.focus();
  return b;
}
const visible = (p) => !q(`[role="tabpanel"][data-p="${p}"]`).hidden;

test('installPlatform picks Android only for Android', () => {
  assert.equal(installPlatform('Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/130'), 'android');
  assert.equal(installPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/604.1'), 'ios');
  assert.equal(installPlatform(''), 'ios');
  assert.equal(installPlatform(undefined), 'ios');
});

test('the sheet opens with Miso, the title and the chosen tab', () => {
  opener();
  openInstallSheet(document, 'ko', { platform: 'ios' });
  const dlg = q('[data-install-sheet] [role="dialog"][aria-modal="true"]');
  assert.ok(dlg);
  assert.equal(document.getElementById(dlg.getAttribute('aria-labelledby')).textContent, INSTALL_UI.sheetTitle.ko);
  assert.ok(dlg.textContent.includes(INSTALL_UI.sheetBubble.ko));
  assert.ok(dlg.querySelector('img[src$="assets/miso/wink.webp"]'));
  assert.equal(q('[role="tab"][data-p="ios"]').getAttribute('aria-selected'), 'true');
  assert.ok(visible('ios') && !visible('android'));
  const steps = [...q('[role="tabpanel"][data-p="ios"]').querySelectorAll('ol li [data-step-text]')].map((x) => x.textContent);
  assert.deepEqual(steps, [INSTALL_UI.ios1.ko, INSTALL_UI.ios2.ko, INSTALL_UI.ios3.ko]);
  assert.ok(q('[role="tabpanel"][data-p="ios"]').textContent.includes(INSTALL_UI.iosAfter.ko));
  assert.ok(q('[role="tabpanel"][data-p="ios"]').textContent.includes(INSTALL_UI.iosWhy.ko));
  assert.equal(document.activeElement, q('[data-install-ok]'));
  assert.equal(q('[data-install-ok]').textContent, INSTALL_UI.ok.ko);
});

test('Android phones open on the Android tab', () => {
  opener();
  openInstallSheet(document, 'ko', { platform: 'android' });
  assert.ok(visible('android') && !visible('ios'));
  assert.ok(q('[role="tabpanel"][data-p="android"]').textContent.includes(INSTALL_UI.androidWhy.ko));
});

test('tabs switch by tap and by arrow keys', () => {
  opener();
  openInstallSheet(document, 'ko', { platform: 'ios' });
  click(q('[role="tab"][data-p="android"]'));
  assert.ok(visible('android') && !visible('ios'));
  assert.equal(q('[role="tab"][data-p="android"]').getAttribute('tabindex'), '0');
  assert.equal(q('[role="tab"][data-p="ios"]').getAttribute('tabindex'), '-1');
  press(q('[role="tab"][data-p="android"]'), 'ArrowRight');
  assert.ok(visible('ios'));
  assert.equal(document.activeElement, q('[role="tab"][data-p="ios"]'));
  press(q('[role="tab"][data-p="ios"]'), 'ArrowLeft');
  assert.ok(visible('android'));
});

test('Got it, Esc and a tap outside close it and focus returns', () => {
  for (const how of ['ok', 'esc', 'outside']) {
    const b = opener();
    openInstallSheet(document, 'ko', { platform: 'ios' });
    if (how === 'ok') click(q('[data-install-ok]'));
    if (how === 'esc') press(document.activeElement, 'Escape');
    if (how === 'outside') click(q('[data-install-sheet]'));
    assert.equal(q('[data-install-sheet]'), null, how);
    assert.equal(document.activeElement, b, how);
  }
});

test('a tap inside the sheet does not close it', () => {
  opener();
  openInstallSheet(document, 'ko', { platform: 'ios' });
  click(q('[data-install-sheet] [role="dialog"] h2'));
  assert.ok(q('[data-install-sheet]'));
});

test('opening twice keeps one sheet', () => {
  opener();
  openInstallSheet(document, 'ko', { platform: 'ios' });
  openInstallSheet(document, 'ko', { platform: 'ios' });
  assert.equal(document.querySelectorAll('[data-install-sheet]').length, 1);
});

test('English sheet reads in English, pictures included', () => {
  opener();
  openInstallSheet(document, 'en', { platform: 'ios' });
  const sheet = q('[data-install-sheet]');
  assert.ok(!/[가-힣]/.test(sheet.textContent), sheet.textContent);
  const words = [...sheet.querySelectorAll('svg text')].map((t) => t.textContent);
  assert.deepEqual(words.sort(), ['Add', 'Install']);
  assert.equal(q('[role="tablist"]').getAttribute('aria-label'), 'Phone type');
});

test('if the page was redrawn while open, focus goes to the new button', () => {
  const old = opener();
  const again = document.createElement('button');
  let asked = 0;
  openInstallSheet(document, 'ko', { platform: 'ios', focusBack: () => { asked += 1; again.focus(); } });
  old.remove();
  document.body.append(again);
  click(q('[data-install-ok]'));
  assert.equal(asked, 1);
  assert.equal(document.activeElement, again);
});

test('while open, the page behind is inert (keyboard cannot reach it), and comes back after', () => {
  const b = opener();
  const nav = document.createElement('nav');
  const already = document.createElement('div');
  already.setAttribute('inert', '');
  document.body.append(nav, already);
  openInstallSheet(document, 'ko', { platform: 'ios' });
  for (const el of document.body.children) {
    if (el.hasAttribute('data-install-sheet')) assert.ok(!el.hasAttribute('inert'));
    else assert.ok(el.hasAttribute('inert'), el.tagName);
  }
  click(q('[data-install-ok]'));
  assert.ok(!document.getElementById('app').hasAttribute('inert'));
  assert.ok(!nav.hasAttribute('inert'));
  assert.ok(already.hasAttribute('inert'), 'what was inert before stays inert');
  assert.equal(document.activeElement, b);
});

test('Tab and Shift+Tab go round inside the sheet', () => {
  opener();
  openInstallSheet(document, 'ko', { platform: 'ios' });
  const ok = q('[data-install-ok]');
  const tab = q('[role="tab"][data-p="ios"]');
  ok.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, tab);
  tab.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, ok);
});
