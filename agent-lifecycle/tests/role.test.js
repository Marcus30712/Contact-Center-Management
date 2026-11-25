// The learner's role (2026-11-25): which seat they are preparing for.
// Spec: docs/superpowers/specs/2026-11-25-role-select-sme-course-design.md §4.1–4.2.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fakeStorage, throwingStorage } from './helpers.js';
import {
  ROLE_KEY, ROLE_ASKED_KEY, ROLES, DEFAULT_ROLE, COURSE_ROLES, coursesFor, roleOf,
  loadRole, saveRole, shouldAskRole, markRoleAsked, ROLE_EVENT,
} from '../../shared/role.js';
import { ROLE_UI, ROLE_NAMES, ROLE_SHORT } from '../../shared/role-data.js';
const HOME_COPY_DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-role-home-copy.md', import.meta.url), 'utf8');

const COPY = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md', import.meta.url), 'utf8');
const copyRow = (section, place) => {
  const part = COPY.split(/^## /m).find((s) => s.startsWith(section));
  const line = part.split('\n').find((l) => l.startsWith(`| ${place} |`));
  return line.slice(1, -1).split(' | ').map((c) => c.trim());
};

test('the five roles and their keys', () => {
  assert.deepEqual(ROLES, ['agent', 'sme', 'tl', 'am', 'om']);
  assert.equal(DEFAULT_ROLE, 'tl');
  assert.deepEqual(COURSE_ROLES, ['sme', 'tl']);
  assert.equal(ROLE_KEY, 'queuecraft:role');
  assert.equal(ROLE_ASKED_KEY, 'queuecraft:role-asked');
});

test('role defaults to team lead', () => {
  assert.equal(loadRole(fakeStorage()), 'tl');
  assert.equal(loadRole(null), 'tl');
});

test('saving a role stores it and marks the question asked', () => {
  const s = fakeStorage();
  saveRole(s, 'sme');
  assert.equal(loadRole(s), 'sme');
  assert.equal(shouldAskRole(s), false);
});

test('unknown role values read as team lead', () => {
  for (const v of ['manager', '"sme"', '']) assert.equal(loadRole(fakeStorage({ [ROLE_KEY]: v })), 'tl');
  const s = fakeStorage({ [ROLE_KEY]: 'am' });
  saveRole(s, 'boss');
  assert.equal(loadRole(s), 'am');
  assert.equal(shouldAskRole(fakeStorage({ [ROLE_KEY]: 'manager' })), false);
});

test('ask once', () => {
  const s = fakeStorage();
  assert.equal(shouldAskRole(s), true);
  markRoleAsked(s);
  assert.equal(shouldAskRole(s), false);
  assert.equal(loadRole(s), 'tl');
});

test('role survives blocked storage', () => {
  assert.equal(loadRole(throwingStorage), 'tl');
  assert.doesNotThrow(() => saveRole(throwingStorage, 'sme'));
  assert.doesNotThrow(() => markRoleAsked(throwingStorage));
  assert.equal(shouldAskRole(throwingStorage), false);
  assert.equal(shouldAskRole(null), false);
});

test('role wording is the approved copy', () => {
  const ko = (place) => copyRow('2. 직급 고르기', place)[1];
  assert.equal(ROLE_UI.sheetTitle.ko, ko('시트 제목'));
  assert.equal(ROLE_UI.sheetNote.ko, ko('시트 안내'));
  assert.equal(ROLE_UI.later.ko, ko('나중 버튼'));
  assert.equal(ROLE_UI.settingsHeading.ko, ko('설정 칸 제목'));
  assert.equal(ROLE_UI.settingsNote.ko, ko('설정 안내'));
  assert.equal(ROLE_UI.preparing.ko, ko('준비 중 안내 (홈)').replace('{직급}', '{role}'));
  assert.equal(ROLE_UI.preparingCareer.ko, ko('준비 중 링크 1'));
  assert.equal(ROLE_UI.preparingDaily.ko, ko('준비 중 링크 2'));
  // The choices were renamed with TL/AM/OM (2026-11-25): see 'role names follow the copy'.
});

test('courses per role', () => {
  assert.deepEqual(coursesFor('tl'), ['tl', 'lifecycle', 'tl-support', 'sop']);
  assert.deepEqual(coursesFor('sme'), ['sme', 'sme-lifecycle', 'sme-sop']);
  for (const r of ['agent', 'am', 'om', 'boss']) assert.deepEqual(coursesFor(r), [], r);
});

test('each course has one role, read from the same table', () => {
  assert.equal(roleOf('lifecycle'), 'tl');
  assert.equal(roleOf('sop'), 'tl');
  assert.equal(roleOf('sme'), 'sme');
  assert.equal(roleOf('sme-lifecycle'), 'sme');
  assert.equal(roleOf('sme-sop'), 'sme');
  assert.equal(roleOf('excel'), undefined);
});

test('home and the quiz read courses from one shared list', async () => {
  const { COURSE_INFO } = await import('../../shared/courses.js');
  const { LEARN } = await import('../../home/data.js');
  assert.deepEqual(Object.keys(COURSE_INFO), ['tl', 'lifecycle', 'tl-support', 'sop', 'sme', 'sme-lifecycle', 'sme-sop']);
  for (const [id, c] of Object.entries(COURSE_INFO)) {
    const card = LEARN.find((x) => x.href === `./${c.dir}`);
    assert.equal(card.role, roleOf(id), id);
  }
  const { readFileSync } = await import('node:fs');
  for (const f of ['home/render.js', 'review/engine.js']) {
    const src = readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8');
    assert.ok(!src.includes("'agent-lifecycle-course:v1'") && !/role: '(tl|sme)'/.test(src), `${f} keeps no copy of course keys or roles`);
  }
});

test('role names follow the copy', () => {
  const s8 = HOME_COPY_DOC.split(/^## 8\. /m)[1];
  const row = (label) => s8.split('\n').find((l) => l.startsWith(`| ${label} |`)).slice(1, -1).split(' | ').map((c) => c.trim());
  const clean = (x) => x.replace(/ \(지금 그대로\)$| \(as now\)$/, '');
  for (const [role, label] of [['agent', '상담사'], ['sme', 'SME'], ['tl', 'TL'], ['am', 'AM'], ['om', 'OM']]) {
    const [, ko, en] = row(label);
    assert.deepEqual(ROLE_NAMES[role], { ko: clean(ko), en: clean(en) }, role);
  }
  assert.deepEqual(ROLE_SHORT, { agent: { ko: '상담사', en: 'Agent' }, sme: { ko: '직무전문가', en: 'SME' }, tl: { ko: '팀장', en: 'TL' }, am: { ko: '부매니저', en: 'AM' }, om: { ko: '매니저', en: 'OM' } });
});

test('saving a role tells the page, so the menu can follow', async () => {
  // The bottom menu's Guide depends on the role (2026-11-25); it redraws on this event.
  const { setupDom } = await import('./dom.js');
  const { window } = setupDom();
  const heard = [];
  window.addEventListener(ROLE_EVENT, (e) => heard.push(e.detail));
  saveRole(fakeStorage(), 'sme');
  saveRole(fakeStorage(), 'boss');
  assert.deepEqual(heard, ['sme'], 'only a real change is announced');
  const src = readFileSync(new URL('../../shared/appbar.js', import.meta.url), 'utf8');
  assert.match(src, /addEventListener\(ROLE_EVENT, draw\)/, 'the menu redraws when the role changes');
});
