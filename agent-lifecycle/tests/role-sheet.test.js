// Home asks once which role the learner is preparing for (2026-11-25).
// Spec: docs/superpowers/specs/2026-11-25-role-select-sme-course-design.md §4.2, §7.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, click, key } from './dom.js';
import { fakeStorage, throwingStorage } from './helpers.js';
import { ROLES, ROLE_KEY, ROLE_ASKED_KEY } from '../../shared/role.js';
import { ROLE_UI, ROLE_NAMES } from '../../shared/role-data.js';
import { openRoleSheet, askRoleHere, runFirstOpen } from '../../shared/role-sheet.js';

const sheet = (document) => document.querySelector('[data-role-sheet]');

test('the sheet shows the approved words and five roles', () => {
  for (const lang of ['ko', 'en']) {
    const { document } = setupDom();
    openRoleSheet(document, lang, {});
    const dialog = sheet(document).querySelector('[role="dialog"]');
    assert.equal(dialog.getAttribute('aria-modal'), 'true');
    const title = document.getElementById(dialog.getAttribute('aria-labelledby'));
    assert.equal(title.textContent, ROLE_UI.sheetTitle[lang]);
    assert.equal(dialog.querySelector('[data-role-note]').textContent, ROLE_UI.sheetNote[lang]);
    const buttons = [...dialog.querySelectorAll('[data-pick-role]')];
    assert.deepEqual(buttons.map((b) => b.getAttribute('data-pick-role')), ROLES);
    assert.deepEqual(buttons.map((b) => b.textContent), ROLES.map((r) => ROLE_NAMES[r][lang]));
    assert.equal(dialog.querySelector('[data-role-later]').textContent, ROLE_UI.later[lang]);
    assert.equal(document.activeElement, buttons[0]);
  }
});

test('picking saves and closes', async () => {
  const { document } = setupDom();
  const picks = [];
  const s = openRoleSheet(document, 'ko', { onPick: (r) => picks.push(r), onLater: () => picks.push('later') });
  click(sheet(document).querySelector('[data-pick-role="sme"]'));
  await s.closed;
  assert.deepEqual(picks, ['sme']);
  assert.equal(sheet(document), null);
});

test('later marks asked and closes; Escape does the same', async () => {
  for (const how of ['button', 'escape']) {
    const { document } = setupDom();
    const calls = [];
    const s = openRoleSheet(document, 'ko', { onPick: (r) => calls.push(r), onLater: () => calls.push('later') });
    if (how === 'button') click(sheet(document).querySelector('[data-role-later]'));
    else key('Escape');
    await s.closed;
    assert.deepEqual(calls, ['later'], how);
    assert.equal(sheet(document), null);
  }
});

test('a second open while one is showing returns the same sheet', () => {
  const { document } = setupDom();
  const a = openRoleSheet(document, 'ko', {});
  const b = openRoleSheet(document, 'ko', {});
  assert.equal(document.querySelectorAll('[data-role-sheet]').length, 1);
  assert.equal(a.closed, b.closed);
});

test('no sheet when storage is blocked, at a deep link or a tutorial replay', () => {
  const home = 'https://x.github.io/Contact-Center-Management/';
  assert.equal(askRoleHere({ storage: fakeStorage(), href: home }), true);
  assert.equal(askRoleHere({ storage: throwingStorage, href: home }), false);
  assert.equal(askRoleHere({ storage: null, href: home }), false);
  assert.equal(askRoleHere({ storage: fakeStorage(), href: `${home}#learn` }), false);
  assert.equal(askRoleHere({ storage: fakeStorage(), href: `${home}?tour=1` }), false);
  assert.equal(askRoleHere({ storage: fakeStorage({ [ROLE_KEY]: 'sme' }), href: home }), false);
  assert.equal(askRoleHere({ storage: fakeStorage({ [ROLE_ASKED_KEY]: '1' }), href: home }), false);
});

test('the sheet waits for the start screen and comes before the tour', async () => {
  const order = [];
  let closeStart;
  const startClosed = new Promise((r) => { closeStart = r; });
  let closeSheet;
  const run = runFirstOpen({
    startClosed,
    askRole: true,
    openSheet: () => { order.push('sheet'); return { closed: new Promise((r) => { closeSheet = r; }) }; },
    startTour: () => order.push('tour'),
  });
  await Promise.resolve();
  assert.deepEqual(order, []);
  closeStart();
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(order, ['sheet']);
  closeSheet();
  await run;
  assert.deepEqual(order, ['sheet', 'tour']);

  const order2 = [];
  await runFirstOpen({ startClosed: Promise.resolve(), askRole: false, openSheet: () => order2.push('sheet'), startTour: () => order2.push('tour') });
  assert.deepEqual(order2, ['tour']);
});
