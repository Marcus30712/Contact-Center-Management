// The role picker at the top left of the site's own pages (2026-11-26).
// Design: docs/superpowers/specs/2026-11-26-role-switch-design.md
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
import { renderRoleSwitch, pickRole } from '../../shared/role-switch.js';
import { ROLES, ROLE_KEY } from '../../shared/role.js';
import { ROLE_NAMES, ROLE_UI } from '../../shared/role-data.js';

const file = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const memory = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m };
};

test('the picker lists the five roles in order with the saved one chosen', () => {
  const { document } = setupDom();
  const select = renderRoleSwitch(document, 'ko', 'sme', () => {});
  assert.equal(select.tagName, 'SELECT');
  assert.equal(select.getAttribute('aria-label'), ROLE_UI.settingsHeading.ko);
  assert.deepEqual([...select.options].map((o) => [o.value, o.textContent]), ROLES.map((r) => [r, ROLE_NAMES[r].ko]));
  assert.equal(select.value, 'sme');
});

test('the picker speaks English on English pages', () => {
  const { document } = setupDom();
  const select = renderRoleSwitch(document, 'en', 'om', () => {});
  assert.equal(select.getAttribute('aria-label'), 'My role');
  assert.deepEqual([...select.options].map((o) => o.textContent), ROLES.map((r) => ROLE_NAMES[r].en));
  assert.equal(select.value, 'om');
});

test('choosing a role hands it on', () => {
  const { document } = setupDom();
  const picked = [];
  const select = renderRoleSwitch(document, 'ko', 'tl', (r) => picked.push(r));
  select.value = 'am';
  select.dispatchEvent(new document.defaultView.Event('change'));
  assert.deepEqual(picked, ['am']);
});

test('a picked role is saved and the learner goes to the top of home', () => {
  const storage = memory();
  const went = [];
  pickRole(storage, 'sme', 'https://x.test/kb/', (url) => went.push(url));
  assert.equal(storage.getItem(ROLE_KEY), 'sme');
  assert.deepEqual(went, ['https://x.test/kb/']);
});

test('blocked storage still goes home', () => {
  const went = [];
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  pickRole(blocked, 'om', 'https://x.test/kb/', (url) => went.push(url));
  pickRole(null, 'om', 'https://x.test/kb/', (url) => went.push(url));
  assert.equal(went.length, 2);
});

const SITE_PAGES = ['', 'settings/', 'guide/', 'sme-guide/', 'browse/', 'glossary/', 'references/', 'staffing-calculator/', 'review/', 'practice/', 'excel/', 'privacy/'];
const COURSE_PAGES = ['agent-lifecycle/', 'sop-library/', 'codex/', 'sme/', 'sme-lifecycle/', 'sme-sop/', 'tl/', 'tl-support/'];

test('the site pages hold a place for the picker instead of the Queuecraft word', () => {
  for (const p of SITE_PAGES) {
    const top = file(`${p}index.html`).match(/<div class="topbar">[\s\S]*?<\/div>/)[0];
    assert.ok(top.includes('<span class="role-slot" data-role-slot></span>'), p || 'home');
    assert.ok(!top.includes('>Queuecraft<'), p || 'home');
  }
});

test('course pages keep their course name at the top left', () => {
  for (const p of COURSE_PAGES) {
    const html = file(`${p}index.html`);
    assert.ok(html.includes('id="brand"'), p);
    assert.ok(!html.includes('data-role-slot'), p);
  }
});
