// The learner's role (2026-11-25): which seat they are preparing for.
// Spec: docs/superpowers/specs/2026-11-25-role-select-sme-course-design.md §4.1–4.2.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fakeStorage, throwingStorage } from './helpers.js';
import {
  ROLE_KEY, ROLE_ASKED_KEY, ROLES, DEFAULT_ROLE, COURSE_ROLES, coursesFor,
  loadRole, saveRole, shouldAskRole, markRoleAsked,
} from '../../shared/role.js';
import { ROLE_UI, ROLE_NAMES } from '../../shared/role-data.js';

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
  assert.deepEqual(ROLES.map((r) => ROLE_NAMES[r].ko), ko('선택지').split(' · '));
});

test('courses per role', () => {
  assert.deepEqual(coursesFor('tl'), ['lifecycle', 'sop']);
  assert.deepEqual(coursesFor('sme'), ['sme']);
  for (const r of ['agent', 'am', 'om', 'boss']) assert.deepEqual(coursesFor(r), [], r);
});
