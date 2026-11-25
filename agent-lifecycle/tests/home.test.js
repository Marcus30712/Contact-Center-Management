import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { setupDom } from './dom.js';
import { fakeStorage, throwingStorage } from './helpers.js';
import { HOME_UI, LEARN, BROWSE, GUIDE_CARD } from '../../home/data.js';
import { myLearning, renderHome, orderByRole } from '../../home/render.js';
import { ROLE_UI, ROLE_NAMES } from '../../shared/role-data.js';

const SME_DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md', import.meta.url), 'utf8');
const SME_EN = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-sme-course-copy.en.md', import.meta.url), 'utf8');
const afterRow = (doc, place) => doc.split('\n').find((l) => l.startsWith(`| ${place} |`)).slice(1, -1).split(' | ').map((c) => c.trim())[2];

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-20-app-shell-design.md', import.meta.url), 'utf8');
const quoted = (label) => DOC.match(new RegExp(`^- ${label}: "(.+)"`, 'm'))[1];

test('home wording is the approved wording', () => {
  assert.equal(HOME_UI.greeting.ko, quoted('첫 화면 인사'));
  // Reworded for every role (2026-11-25).
  assert.equal(HOME_UI.misoRole.ko, afterRow(SME_DOC, '홈 김미소 소개'));
  assert.equal(HOME_UI.misoRole.en, afterRow(SME_EN, 'Home Miso intro'));
  assert.equal(HOME_UI.install.ko, quoted('설치 안내'));
  assert.equal(HOME_UI.myLearning.ko, '내 학습');
  assert.equal(HOME_UI.continue.ko, '이어서:');
  assert.equal(HOME_UI.start.ko, '처음이라면 라이프사이클 레슨 1부터 시작해 보세요.');
  assert.equal(HOME_UI.allDone.ko, '다 마쳤어요. 필요한 레슨은 언제든 다시 볼 수 있어요.');
  assert.deepEqual([HOME_UI.learn.ko, HOME_UI.browse.ko], ['배우기', '찾아보기']);
  for (const v of Object.values(HOME_UI)) assert.ok(v.ko && v.en && !/[가-힣]/.test(v.en), v.ko);
});

test('cards keep every topic and are split into learn and browse', () => {
  assert.deepEqual(LEARN.map((c) => c.href), ['./agent-lifecycle/', './sop-library/', './excel/']);
  assert.deepEqual(BROWSE.map((c) => c.href), ['./codex/', './staffing-calculator/', './glossary/', './references/']);
  assert.equal(GUIDE_CARD.href, './guide/');
  for (const c of [GUIDE_CARD, ...LEARN, ...BROWSE]) {
    assert.ok(c.title.ko && c.title.en && c.text.ko && c.text.en, c.href);
    assert.ok(!/[가-힣]/.test(c.title.en + c.text.en), c.href);
  }
});

test('my learning: nothing started, part done, all done, storage blocked', () => {
  const s = fakeStorage();
  const fresh = myLearning(s);
  assert.deepEqual(fresh.map((c) => [c.id, c.done, c.total, c.next.id]), [['lifecycle', 0, 6, 'hiring'], ['sop', 0, 10, 'escalation'], ['excel', 0, 11, '1']]);
  assert.equal(fresh.started, false);

  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'coaching'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation'] }));
  const mid = myLearning(s);
  assert.deepEqual(mid.map((c) => [c.done, c.next.id, c.next.href]), [[3, 'nesting', './agent-lifecycle/#nesting-0'], [1, 'scrubbing', './sop-library/#scrubbing-0'], [0, '1', './excel/#lesson-1']]);
  assert.equal(mid.started, true);

  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation', 'coaching', 'pip', 'calibration', 'onboarding', 'incident', 'launch'] }));
  // Someone who finished all seven SOPs before scrubbing was added has one more to do.
  const before = myLearning(s);
  assert.deepEqual([before[1].done, before[1].total, before[1].next.id], [7, 10, 'scrubbing']);
  s.setItem('sop-library:v1', JSON.stringify({ completed: [...['escalation', 'coaching', 'pip', 'calibration', 'onboarding', 'incident', 'launch'], 'scrubbing', 'nurture', 'transition'] }));
  assert.equal(myLearning(s).allDone, false, 'the Excel lessons are still to do');
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] }));
  const all = myLearning(s);
  assert.deepEqual(all.map((c) => [c.done, c.next]), [[6, null], [10, null], [11, null]]);
  assert.equal(all.allDone, true);

  const blocked = myLearning(throwingStorage);
  assert.deepEqual(blocked.map((c) => c.done), [0, 0, 0]);
  assert.deepEqual(myLearning(null).map((c) => c.done), [0, 0, 0]);
});

test('the home screen greets with Miso and shows where to continue', () => {
  const { root } = setupDom();
  const s = fakeStorage();
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation'] }));
  renderHome(root, 'ko', s);
  const miso = root.querySelector('img[data-miso]');
  assert.equal(miso.getAttribute('src'), './assets/miso/grin.webp');
  assert.ok(miso.getAttribute('alt').includes('김미소'));
  assert.ok(root.querySelector('[data-greeting]').textContent.includes(HOME_UI.greeting.ko));
  const rows = [...root.querySelectorAll('[data-course]')];
  assert.equal(rows.length, 3);
  assert.equal(rows[1].querySelector('progress').value, 1);
  assert.equal(rows[1].querySelector('progress').max, 10);
  assert.equal(rows[1].querySelector('a[data-next]').getAttribute('href'), './sop-library/#scrubbing-0');
  assert.ok(rows[1].textContent.includes('1/10'));
  assert.equal(root.querySelector('a.card[href="./guide/"]').closest('section')?.id ?? '', '');
  assert.ok(root.querySelector('#learn') && root.querySelector('#browse'));
  assert.equal(root.querySelectorAll('a.card').length, 9, 'eight topics plus the practice card');
  assert.equal(root.querySelector('[data-install]'), null, 'the install note moved to Settings');
});

test('a first visit suggests lesson 1, and a finished learner sees the done note', () => {
  const first = setupDom();
  renderHome(first.root, 'ko', fakeStorage());
  assert.ok(first.root.querySelector('[data-start]').textContent.includes(HOME_UI.start.ko));
  assert.equal(first.root.querySelector('[data-start] a').getAttribute('href'), './agent-lifecycle/#hiring-0');
  assert.equal(first.root.querySelectorAll('[data-course]').length, 0, 'the start note replaces my learning on a first visit');

  const s = fakeStorage();
  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation', 'scrubbing', 'coaching', 'pip', 'calibration', 'transition', 'onboarding', 'incident', 'nurture', 'launch'] }));
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] }));
  const done = setupDom();
  renderHome(done.root, 'ko', s);
  assert.ok(done.root.querySelector('[data-all-done]').textContent.includes(HOME_UI.allDone.ko));
  assert.equal(HOME_UI.review.ko, '다시 보기');
  const reviews = [...done.root.querySelectorAll('a[data-review]')];
  assert.deepEqual(reviews.map((a) => a.getAttribute('href')), ['./agent-lifecycle/', './sop-library/', './excel/']);
  assert.ok(reviews.every((a) => a.textContent.includes('다시 보기')));
});

test('the English home screen has no Korean', () => {
  const { root } = setupDom();
  renderHome(root, 'en', fakeStorage());
  assert.ok(!/[가-힣]/.test(root.textContent + [...root.querySelectorAll('img')].map((i) => i.alt).join('')));
});

test('Miso images and app icons exist', () => {
  const names = ['smile', 'joy', 'sparkle', 'think', 'surprise', 'worry', 'grin', 'proud', 'ponder', 'nervous', 'cheer', 'wink', 'profile'];
  for (const n of names) assert.ok(existsSync(new URL(`../../assets/miso/${n}.webp`, import.meta.url)), n);
  for (const f of ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png']) {
    assert.ok(existsSync(new URL(`../../icons/${f}`, import.meta.url)), f);
  }
});

test('the practice card sits under Miso and shows today', async () => {
  const { PRACTICE_UI: P } = await import('../../practice/data.js');
  const { loadState, saveState, pool, ensureToday, recordAnswer } = await import('../../practice/engine.js');
  const FRI = '2026-11-20';
  const locked = setupDom();
  renderHome(locked.root, 'ko', fakeStorage(), FRI);
  const card = locked.root.querySelector('a[data-practice]');
  assert.equal(card.getAttribute('href'), './practice/');
  assert.ok(card.textContent.includes(P.homeCard.ko) && card.textContent.includes(P.homeLocked.ko));
  const kids = [...locked.root.children];
  const at = (el) => kids.findIndex((k) => k === el || k.contains(el));
  assert.ok(at(locked.root.querySelector('.hm-miso')) < at(card) && at(card) < at(locked.root.querySelector('a.card[href="./guide/"]')));

  const s = fakeStorage();
  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding'] }));
  let st = ensureToday(loadState(s), pool(s), FRI);
  const k = st.today.ids[0];
  st = recordAnswer(st, k, 'x', false, FRI).state;
  saveState(s, st);
  const mid = setupDom();
  renderHome(mid.root, 'ko', s, FRI);
  const midCard = mid.root.querySelector('a[data-practice]');
  assert.ok(midCard.textContent.includes('오늘 1/3'));
  assert.ok(midCard.textContent.includes('오늘 하면 1일째'));

  for (const key of st.today.ids.slice(1)) st = recordAnswer(st, key, 'x', false, FRI).state;
  saveState(s, st);
  const done = setupDom();
  renderHome(done.root, 'en', s, FRI);
  const doneCard = done.root.querySelector('a[data-practice]');
  assert.ok(doneCard.textContent.includes(P.homeDone.en) && doneCard.textContent.includes('🔥 Day 1'));
});

test('the Excel practice is a third course in Learn and in my learning', async () => {
  const { EXCEL_UI } = await import('../../excel/data.js');
  const card = LEARN.find((c) => c.href === './excel/');
  assert.deepEqual(card.title, EXCEL_UI.homeCard);
  assert.deepEqual(card.text, EXCEL_UI.homeCardLine);
  const s = fakeStorage();
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['1'], scores: { 1: 5 } }));
  const rows = myLearning(s);
  const excel = rows.find((r) => r.id === 'excel');
  assert.deepEqual([excel.done, excel.total], [1, 11]);
  assert.equal(excel.next.href, './excel/#lesson-2');
  assert.ok(rows.started);
  const { root } = setupDom();
  renderHome(root, 'ko', s, '2026-11-20');
  const row = root.querySelector('[data-course="excel"]');
  assert.ok(row.textContent.includes('미소의 엑셀 연습') && row.textContent.includes('1/11'));
  assert.equal(row.querySelector('a[data-next]').getAttribute('href'), './excel/#lesson-2');
});

test('the SOP Library card lists the ten procedures (approved 2026-11-22)', async () => {
  const { readFileSync } = await import('node:fs');
  const cell = (f, place) => readFileSync(new URL(`../../docs/superpowers/specs/${f}`, import.meta.url), 'utf8')
    .split('\n').find((l) => l.startsWith(`| ${place} |`)).split(' | ')[1].replace(/\s*\|$/, '').trim();
  const card = LEARN.find((c) => c.href === './sop-library/');
  assert.equal(card.text.ko, cell('2026-11-22-team-leader-self-copy.md', '홈 카드 설명'));
  assert.equal(card.text.en, cell('2026-11-22-team-leader-self-copy.en.md', 'Home card description'));
});

test('orderByRole keeps order within groups', () => {
  const items = [{ id: 'a', role: 'tl' }, { id: 'b' }, { id: 'c', role: 'sme' }];
  const ids = (role) => orderByRole(items, role).map((x) => x.id);
  assert.deepEqual(ids('sme'), ['c', 'a', 'b']);
  assert.deepEqual(ids('tl'), ['a', 'b', 'c']);
  assert.deepEqual(ids('am'), ['a', 'b', 'c']);
  assert.deepEqual(items.map((x) => x.id), ['a', 'b', 'c'], 'the list itself is not changed');
});

test('a role without a course shows the preparing note', () => {
  for (const lang of ['ko', 'en']) {
    for (const role of ['agent', 'am', 'om']) {
      const { root } = setupDom();
      renderHome(root, lang, fakeStorage(), '2026-11-25', role);
      const note = root.querySelector('[data-role-preparing]');
      assert.ok(note, role);
      assert.equal(note.querySelector('p').textContent, ROLE_UI.preparing[lang].replace('{role}', ROLE_NAMES[role][lang]));
      const links = [...note.querySelectorAll('a')];
      assert.deepEqual(links.map((a) => a.getAttribute('href')), ['./codex/#career', `./codex/#daily-${role}`]);
      assert.deepEqual(links.map((a) => a.textContent), [ROLE_UI.preparingCareer[lang], ROLE_UI.preparingDaily[lang]]);
    }
    for (const role of ['sme', 'tl']) {
      const { root } = setupDom();
      renderHome(root, lang, fakeStorage(), '2026-11-25', role);
      assert.equal(root.querySelector('[data-role-preparing]'), null, role);
    }
  }
});

test('without a role, home is the team-lead home', () => {
  const { root } = setupDom();
  renderHome(root, 'ko', fakeStorage(), '2026-11-25');
  assert.equal(root.querySelector('[data-role-preparing]'), null);
  assert.deepEqual([...root.querySelectorAll('#learn a')].map((a) => a.getAttribute('href')), LEARN.map((c) => c.href));
});
