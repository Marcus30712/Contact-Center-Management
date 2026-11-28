import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { setupDom } from './dom.js';
import { fakeStorage, throwingStorage } from './helpers.js';
import { HOME_UI, LEARN, BROWSE, GUIDE_CARD } from '../../home/data.js';
import { myLearning, renderHome, orderByRole } from '../../home/render.js';
import { ROLE_UI, ROLE_NAMES } from '../../shared/role-data.js';
import { SME_UI } from '../../sme/ui.js';
import { TL_UI } from '../../tl/ui.js';

const HOME_COPY_SOP = '직무전문가가 따르는 표준 절차 8개를 순서대로 배웁니다.';
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
  // The start note now comes from each role's first course (2026-11-25), so the home words carry none.
  assert.equal(HOME_UI.start, undefined);
  assert.equal(HOME_UI.allDone.ko, '다 마쳤어요. 필요한 레슨은 언제든 다시 볼 수 있어요.');
  assert.deepEqual([HOME_UI.learn.ko, HOME_UI.browse.ko], ['배우기', '찾아보기']);
  for (const v of Object.values(HOME_UI)) assert.ok(v.ko && v.en && !/[가-힣]/.test(v.en), v.ko);
});

test('cards keep every topic and are split into learn and browse', () => {
  assert.deepEqual(LEARN.map((c) => c.href), ['./agent/', './agent-career/', './agent-sop/', './am/', './am-sop/', './tl/', './agent-lifecycle/', './tl-support/', './sop-library/', './excel/', './sme/', './sme-lifecycle/', './sme-sop/']);
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
  assert.deepEqual(fresh.map((c) => [c.id, c.done, c.total, c.next.id]), [['tl', 0, 7, 'start'], ['lifecycle', 0, 6, 'hiring'], ['tl-support', 0, 5, 'agents'], ['sop', 0, 10, 'escalation'], ['excel', 0, 11, '1']]);
  assert.equal(fresh.started, false);

  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'coaching'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation'] }));
  const mid = myLearning(s);
  assert.deepEqual(mid.map((c) => [c.done, c.next.id, c.next.href]), [[0, 'start', './tl/#start-0'], [3, 'nesting', './agent-lifecycle/#nesting-0'], [0, 'agents', './tl-support/#agents-0'], [1, 'scrubbing', './sop-library/#scrubbing-0'], [0, '1', './excel/#lesson-1']]);
  assert.equal(mid.started, true);

  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation', 'coaching', 'pip', 'calibration', 'onboarding', 'incident', 'launch'] }));
  // Someone who finished all seven SOPs before scrubbing was added has one more to do.
  const before = myLearning(s);
  assert.deepEqual([before[3].done, before[3].total, before[3].next.id], [7, 10, 'scrubbing']);
  s.setItem('sop-library:v1', JSON.stringify({ completed: [...['escalation', 'coaching', 'pip', 'calibration', 'onboarding', 'incident', 'launch'], 'scrubbing', 'nurture', 'transition'] }));
  assert.equal(myLearning(s).allDone, false, 'the Excel lessons are still to do');
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] }));
  assert.equal(myLearning(s).allDone, false, 'the two TL courses (2026-11-25) are still to do');
  s.setItem('tl-course:v1', JSON.stringify({ completed: ['start', 'roster', 'results', 'listen', 'contribution', 'oneonone', 'direction'] }));
  s.setItem('tl-support:v1', JSON.stringify({ completed: ['agents', 'sme', 'qa', 'trainers', 'team'] }));
  // A team lead's home leaves the SME courses out (2026-11-25), so this is everything.
  const all = myLearning(s);
  assert.deepEqual(all.map((c) => [c.done, c.next]), [[7, null], [6, null], [5, null], [10, null], [11, null]]);
  assert.equal(all.allDone, true);

  const blocked = myLearning(throwingStorage);
  assert.deepEqual(blocked.map((c) => c.done), [0, 0, 0, 0, 0]);
  assert.deepEqual(myLearning(null).map((c) => c.done), [0, 0, 0, 0, 0]);
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
  assert.equal(rows.length, 5);
  assert.equal(rows[3].querySelector('progress').value, 1);
  assert.equal(rows[3].querySelector('progress').max, 10);
  assert.equal(rows[3].querySelector('a[data-next]').getAttribute('href'), './sop-library/#scrubbing-0');
  assert.ok(rows[3].textContent.includes('1/10'));
  assert.equal(root.querySelector('a.card[href="./guide/"]').closest('section')?.id ?? '', '');
  assert.ok(root.querySelector('#learn') && !root.querySelector('#browse'), 'Browse has its own page now');
  assert.equal(root.querySelectorAll('a.card').length, 7, 'practice, guide and five Learn cards');
  assert.equal(root.querySelector('[data-install]'), null, 'the install note moved to Settings');
});

test('a first visit suggests lesson 1, and a finished learner sees the done note', () => {
  const first = setupDom();
  renderHome(first.root, 'ko', fakeStorage());
  assert.ok(first.root.querySelector('[data-start]').textContent.includes(TL_UI.startNote.ko));
  assert.equal(first.root.querySelector('[data-start] a').getAttribute('href'), './tl/#start-0');
  assert.equal(first.root.querySelectorAll('[data-course]').length, 0, 'the start note replaces my learning on a first visit');

  const s = fakeStorage();
  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation', 'scrubbing', 'coaching', 'pip', 'calibration', 'transition', 'onboarding', 'incident', 'nurture', 'launch'] }));
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] }));
  s.setItem('sme-course:v1', JSON.stringify({ completed: ['firstday', 'newcomer', 'escalation', 'peer', 'lead', 'priority', 'knowledge'] }));
  s.setItem('tl-course:v1', JSON.stringify({ completed: ['start', 'roster', 'results', 'listen', 'contribution', 'oneonone', 'direction'] }));
  s.setItem('tl-support:v1', JSON.stringify({ completed: ['agents', 'sme', 'qa', 'trainers', 'team'] }));
  const done = setupDom();
  renderHome(done.root, 'ko', s);
  assert.ok(done.root.querySelector('[data-all-done]').textContent.includes(HOME_UI.allDone.ko));
  assert.equal(HOME_UI.review.ko, '다시 보기');
  const reviews = [...done.root.querySelectorAll('a[data-review]')];
  assert.deepEqual(reviews.map((a) => a.getAttribute('href')), ['./tl/', './agent-lifecycle/', './tl-support/', './sop-library/', './excel/']);
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

// The separate preparing note gave way to coming-soon cards (2026-11-25): see 'coming-soon cards are not links and say so'.

test('without a role, home is the team-lead home', () => {
  const { root } = setupDom();
  renderHome(root, 'ko', fakeStorage(), '2026-11-25');
  assert.deepEqual([...root.querySelectorAll('#learn a.card')].map((a) => a.getAttribute('href')), ['./tl/', './agent-lifecycle/', './tl-support/', './sop-library/', './excel/']);
});

test('an SME learner sees the SME course first in Learn and in my learning', () => {
  const s = fakeStorage({ 'sme-course:v1': '{"completed":["firstday"]}' });
  const { root } = setupDom();
  renderHome(root, 'ko', s, '2026-11-25', 'sme');
  assert.deepEqual([...root.querySelectorAll('#learn a.card')].map((a) => a.getAttribute('href')), ['./sme/', './sme-lifecycle/', './sme-sop/', './excel/']);
  assert.equal(root.querySelector('#learn a').querySelector('span').textContent, SME_UI.homeCard.ko);
  assert.deepEqual(myLearning(s, 'sme').map((r) => r.id), ['sme', 'sme-lifecycle', 'sme-sop', 'excel']);
  assert.equal(root.querySelector('[data-next="sme-lifecycle"]').getAttribute('href'), './sme-lifecycle/#trainee-0');
  assert.equal(root.querySelector('[data-next="sme"]').getAttribute('href'), './sme/#newcomer-0');
  assert.deepEqual(myLearning(s).map((r) => r.id), ['tl', 'lifecycle', 'tl-support', 'sop', 'excel']);
});

test('a new SME is pointed at SME lesson 1, a team lead at TL First Steps lesson 1', () => {
  const row = SME_DOC.split('\n').find((l) => l.startsWith('| 처음 안내 (SME) |')).slice(1, -1).split(' | ').map((c) => c.trim());
  assert.deepEqual(SME_UI.startNote, { ko: row[1], en: row[2] });
  for (const lang of ['ko', 'en']) {
    const sme = setupDom();
    renderHome(sme.root, lang, fakeStorage(), '2026-11-25', 'sme');
    assert.equal(sme.root.querySelector('[data-start] a').getAttribute('href'), './sme/#firstday-0');
    assert.equal(sme.root.querySelector('[data-start]').textContent, SME_UI.startNote[lang]);
    for (const role of ['tl']) { // roles without a course start at Excel: see 'roles without a course start at Excel lesson 1'
      const other = setupDom();
      renderHome(other.root, lang, fakeStorage(), '2026-11-25', role);
      assert.equal(other.root.querySelector('[data-start] a').getAttribute('href'), './tl/#start-0', role);
      assert.equal(other.root.querySelector('[data-start]').textContent, TL_UI.startNote[lang], role);
    }
  }
});

const ALL = {
  'agent-lifecycle-course:v1': JSON.stringify({ completed: ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'] }),
  'sop-library:v1': JSON.stringify({ completed: ['escalation', 'scrubbing', 'coaching', 'pip', 'calibration', 'transition', 'onboarding', 'incident', 'nurture', 'launch'] }),
  'excel-practice:v1': JSON.stringify({ completed: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] }),
  'tl-course:v1': JSON.stringify({ completed: ['start', 'roster', 'results', 'listen', 'contribution', 'oneonone', 'direction'] }),
  'tl-support:v1': JSON.stringify({ completed: ['agents', 'sme', 'qa', 'trainers', 'team'] }),
};

test('team lead home hides SME progress and can be all done', () => {
  const s = fakeStorage(ALL);
  const rows = myLearning(s);
  assert.deepEqual(rows.map((r) => r.id), ['tl', 'lifecycle', 'tl-support', 'sop', 'excel']);
  assert.equal(rows.allDone, true);
  const { root } = setupDom();
  renderHome(root, 'ko', s, '2026-11-25');
  assert.ok(root.querySelector('[data-all-done]'));
  assert.equal(root.querySelector('[data-course="sme"]'), null);
});

test('an SME sees only SME and Excel progress', () => {
  assert.deepEqual(myLearning(fakeStorage(ALL), 'sme').map((r) => r.id), ['sme', 'sme-lifecycle', 'sme-sop', 'excel']);
});

test('team leads do not see SME SOP but its progress counts', () => {
  const s = fakeStorage({ 'sme-sop:v1': JSON.stringify({ completed: ['approval'] }) });
  const rows = myLearning(s, 'tl');
  assert.ok(!rows.some((r) => r.id === 'sme-sop'));
  assert.equal(rows.started, true);
  const { root } = setupDom();
  renderHome(root, 'ko', s, '2026-11-25', 'tl');
  assert.equal(root.querySelector('#learn a[href="./sme-sop/"]'), null);
});

test('SME Learn links to all three SME courses', () => {
  const s = fakeStorage();
  const { root } = setupDom();
  renderHome(root, 'ko', s, '2026-11-25', 'sme');
  assert.deepEqual([...root.querySelectorAll('#learn a.card')].map((a) => a.getAttribute('href')), ['./sme/', './sme-lifecycle/', './sme-sop/', './excel/']);
  assert.equal(root.querySelector('#learn [data-soon]'), null);
  assert.equal(root.querySelector('a.card[href="./sme-sop/"] span').textContent, HOME_COPY_SOP);
  assert.deepEqual(myLearning(s, 'sme').map((r) => r.id), ['sme', 'sme-lifecycle', 'sme-sop', 'excel']);
});

test('team leads do not see support lifecycle but its progress counts', () => {
  const s = fakeStorage({ 'sme-lifecycle:v1': JSON.stringify({ completed: ['trainee'] }) });
  const rows = myLearning(s, 'tl');
  assert.ok(!rows.some((r) => r.id === 'sme-lifecycle'));
  assert.equal(rows.started, true);
  const { root } = setupDom();
  renderHome(root, 'ko', s, '2026-11-25', 'tl');
  assert.equal(root.querySelector('#learn a[href="./sme-lifecycle/"]'), null);
  assert.equal(root.querySelector('[data-course="sme-lifecycle"]'), null);
});

test('roles without a course see Excel only', () => {
  assert.deepEqual(myLearning(fakeStorage(ALL), 'am').map((r) => r.id), ['am', 'am-sop', 'excel']);
  for (const role of ['om']) assert.deepEqual(myLearning(fakeStorage(ALL), role).map((r) => r.id), ['excel'], role);
});

// 상담사 첫걸음 (2026-11-26): the agent's first course replaces its "coming soon" card.
test('an agent learns Agent First Steps, Agent Career Lifecycle, the Agent SOP Library and Excel', async () => {
  const { AGENT_UI } = await import('../../agent/ui.js');
  const { AC_UI } = await import('../../agent-career/ui.js');
  const { AS_UI } = await import('../../agent-sop/ui.js');
  const s = fakeStorage();
  const { root } = setupDom();
  renderHome(root, 'ko', s, '2026-11-26', 'agent');
  assert.deepEqual([...root.querySelectorAll('#learn a.card')].map((a) => a.getAttribute('href')), ['./agent/', './agent-career/', './agent-sop/', './excel/']);
  assert.equal(root.querySelector('a.card[href="./agent/"] span').textContent, AGENT_UI.homeCard.ko);
  assert.equal(root.querySelector('a.card[href="./agent-career/"] span').textContent, AC_UI.homeCard.ko);
  assert.equal(root.querySelector('a.card[href="./agent-sop/"] span').textContent, AS_UI.homeCard.ko);
  assert.deepEqual([...root.querySelectorAll('#learn [data-soon]')].map((c) => c.getAttribute('data-soon')), []);
  assert.equal(root.querySelector('[data-start] a').getAttribute('href'), './agent/#start-0');
  assert.equal(root.querySelector('[data-start]').textContent, AGENT_UI.startNote.ko);
  assert.deepEqual(myLearning(s, 'agent').map((r) => [r.id, r.total, r.next.href]), [['agent', 8, './agent/#start-0'], ['agent-career', 4, './agent-career/#ready-0'], ['agent-sop', 8, './agent-sop/#request-0'], ['excel', 11, './excel/#lesson-1']]);
  const done = fakeStorage({ 'agent-course:v1': JSON.stringify({ completed: ['start', 'training'] }) });
  assert.deepEqual(myLearning(done, 'agent').map((r) => [r.id, r.done, r.next.id]), [['agent', 2, 'nesting'], ['agent-career', 0, 'ready'], ['agent-sop', 0, 'request'], ['excel', 0, '1']]);
});

// 부매니저 SOP 라이브러리 (2026-11-28): the AM's SOP card is a real course now.
test('an AM learns AM First Steps, the AM SOP Library and Excel', async () => {
  const { AMS_UI } = await import('../../am-sop/ui.js');
  const s = fakeStorage();
  const { root } = setupDom();
  renderHome(root, 'ko', s, '2026-11-28', 'am');
  assert.deepEqual([...root.querySelectorAll('#learn a.card')].map((a) => a.getAttribute('href')), ['./am/', './am-sop/', './excel/']);
  assert.equal(root.querySelector('a.card[href="./am-sop/"] strong').textContent, AMS_UI.courseTitle.ko);
  assert.equal(root.querySelector('a.card[href="./am-sop/"] span').textContent, AMS_UI.homeCard.ko);
  assert.equal(root.querySelector('#learn [data-soon="sop"]'), null);
  assert.deepEqual(myLearning(s, 'am').map((r) => [r.id, r.total, r.next.href]), [['am', 8, './am/#firstweek-0'], ['am-sop', 8, './am-sop/#weekly-0'], ['excel', 11, './excel/#lesson-1']]);
  // Other roles never see it, though its progress counts as started.
  const started = fakeStorage({ 'am-sop:v1': JSON.stringify({ completed: ['risk'] }) });
  for (const role of ['agent', 'sme', 'tl', 'om']) {
    assert.ok(!myLearning(started, role).some((r) => r.id === 'am-sop'), role);
    assert.equal(myLearning(started, role).started, true, role);
  }
});

test('other roles never see Agent First Steps, though its progress counts as started', () => {
  const s = fakeStorage({ 'agent-course:v1': JSON.stringify({ completed: ['start'] }) });
  for (const role of ['sme', 'tl', 'am', 'om']) {
    const rows = myLearning(s, role);
    assert.ok(!rows.some((r) => r.id === 'agent'), role);
    assert.equal(rows.started, true, role);
    const { root } = setupDom();
    renderHome(root, 'ko', s, '2026-11-26', role);
    assert.equal(root.querySelector('#learn a[href="./agent/"]'), null, role);
  }
});

test('other roles never see Agent Career Lifecycle, though its progress counts as started', () => {
  const s = fakeStorage({ 'agent-career:v1': JSON.stringify({ completed: ['sme'] }) });
  for (const role of ['sme', 'tl', 'am', 'om']) {
    const rows = myLearning(s, role);
    assert.ok(!rows.some((r) => r.id === 'agent-career'), role);
    assert.equal(rows.started, true, role);
    const { root } = setupDom();
    renderHome(root, 'ko', s, '2026-11-26', role);
    assert.equal(root.querySelector('#learn a[href="./agent-career/"]'), null, role);
  }
});

test('other roles never see the Agent SOP Library, though its progress counts as started', () => {
  const s = fakeStorage({ 'agent-sop:v1': JSON.stringify({ completed: ['huddle'] }) });
  for (const role of ['sme', 'tl', 'am', 'om']) {
    const rows = myLearning(s, role);
    assert.ok(!rows.some((r) => r.id === 'agent-sop'), role);
    assert.equal(rows.started, true, role);
    const { root } = setupDom();
    renderHome(root, 'ko', s, '2026-11-27', role);
    assert.equal(root.querySelector('#learn a[href="./agent-sop/"]'), null, role);
  }
});

test('the quiz card appears once the role\'s courses are done', async () => {
  const { REVIEW_UI } = await import('../../review/data.js');
  const sme = ['firstday', 'newcomer', 'escalation', 'peer', 'lead', 'priority', 'knowledge'];
  const card = (storage, role = 'sme', lang = 'ko') => {
    const { root } = setupDom();
    renderHome(root, lang, storage, '2026-11-25', role);
    return root.querySelector('a[data-review-quiz]');
  };
  assert.equal(card(fakeStorage({ 'sme-course:v1': JSON.stringify({ completed: sme.slice(0, 6) }) })), null);
  const open = card(fakeStorage({ 'sme-course:v1': JSON.stringify({ completed: sme }) }));
  assert.equal(open.getAttribute('href'), './review/#sme');
  assert.equal(open.textContent, REVIEW_UI.homeStart.ko);
  const passed = card(fakeStorage({ 'sme-course:v1': JSON.stringify({ completed: sme }), 'queuecraft:review:v1': JSON.stringify({ sme: { best: 6, total: 6, passed: true } }) }));
  assert.equal(passed.textContent, REVIEW_UI.homeDone.ko.replace('{x}', '6').replace('{n}', '6'));
  assert.equal(card(fakeStorage(ALL), 'tl').getAttribute('href'), './review/#tl');
});

test("an agent's quiz card appears once Agent First Steps and the Agent SOP Library are done", async () => {
  const { AGENT_LESSONS } = await import('../../agent/lessons/index.js');
  const { AS_LESSONS } = await import('../../agent-sop/lessons/index.js');
  const first = JSON.stringify({ completed: AGENT_LESSONS.map((l) => l.id) });
  const card = (storage) => {
    const { root } = setupDom();
    renderHome(root, 'ko', storage, '2026-11-27', 'agent');
    return root.querySelector('a[data-review-quiz]');
  };
  assert.equal(card(fakeStorage({ 'agent-course:v1': first })), null);
  const open = card(fakeStorage({ 'agent-course:v1': first, 'agent-sop:v1': JSON.stringify({ completed: AS_LESSONS.map((l) => l.id) }) }));
  assert.equal(open.getAttribute('href'), './review/#agent');
});

test('roles without a review quiz get no quiz card', () => {
  for (const role of ['am', 'om']) {
    const { root } = setupDom();
    renderHome(root, 'ko', fakeStorage(ALL), '2026-11-25', role);
    assert.equal(root.querySelector('a[data-review-quiz]'), null, role);
  }
});

test('a learner with progress in any course is not greeted as new', () => {
  const s = fakeStorage({ 'agent-lifecycle-course:v1': JSON.stringify({ completed: ['hiring', 'onboarding', 'nesting'] }) });
  for (const role of ['agent', 'am', 'om', 'sme']) {
    assert.equal(myLearning(s, role).started, true, role);
    const { root } = setupDom();
    renderHome(root, 'ko', s, '2026-11-25', role);
    assert.equal(root.querySelector('[data-start]'), null, role);
  }
});

// ---------- per-role home (2026-11-25, role-home-copy) ----------
const RH = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-role-home-copy.md', import.meta.url), 'utf8');
const rhRows = (section) => RH.split(new RegExp(`^## ${section}\\. `, 'm'))[1].split(/^## /m)[0].split('\n')
  .filter((l) => l.startsWith('| ') && !/^\| (위치|직급|단계) /.test(l)).map((l) => l.slice(1, -1).split(' | ').map((c) => c.trim()));
const rhRow = (section, first) => rhRows(section).find((r) => r[0] === first);
const SHORT = { agent: ['상담사', 'Agent'], sme: ['직무전문가', 'SME'], tl: ['팀장', 'TL'], am: ['부매니저', 'AM'], om: ['매니저', 'OM'] };
const fillRole = (text, role, lang) => text.replace(lang === 'ko' ? '{직급}' : '{role}', SHORT[role][lang === 'ko' ? 0 : 1]);
const homeOf = (role, lang = 'ko', storage = fakeStorage()) => { const { root } = setupDom(); renderHome(root, lang, storage, '2026-11-25', role); return root; };
const learnTitles = (root) => [...root.querySelectorAll('#learn li')].map((li) => li.querySelector('strong').textContent);

test('each role\'s home has the same sections in the same order', () => {
  const shape = (root) => [...root.children].map((el) => el.tagName + (el.id ? `#${el.id}` : '') + (el.className ? `.${el.className.split(' ')[0]}` : ''));
  const shapes = ['tl', 'sme', 'agent', 'am', 'om'].map((r) => shape(homeOf(r)));
  for (const s of shapes) assert.deepEqual(s, shapes[0]);
  for (const r of ['tl', 'sme', 'agent']) assert.equal(homeOf(r).querySelector('#browse'), null, r);
  assert.ok(homeOf('tl').querySelector('#learn'));
});

test('Learn shows only the role\'s cards', () => {
  const hrefs = (root) => [...root.querySelectorAll('#learn li')].map((li) => li.querySelector('a.card')?.getAttribute('href') ?? 'soon');
  assert.deepEqual(hrefs(homeOf('tl')), ['./tl/', './agent-lifecycle/', './tl-support/', './sop-library/', './excel/']);
  assert.deepEqual(learnTitles(homeOf('tl')), ['팀장 첫걸음', '상담사 라이프사이클', '팀장 서포트 라이프사이클', '팀장 SOP 라이브러리', '미소의 엑셀 연습']);
  assert.deepEqual(learnTitles(homeOf('tl', 'en')), ['TL First Steps', 'The Agent Lifecycle', 'TL Support Lifecycle', 'TL SOP Library', "Miso's Excel Practice"]);
  assert.deepEqual(hrefs(homeOf('sme')), ['./sme/', './sme-lifecycle/', './sme-sop/', './excel/']);
  assert.deepEqual(learnTitles(homeOf('sme')), ['직무전문가 첫걸음', '직무전문가 서포트 라이프사이클', '직무전문가 SOP 라이브러리', '미소의 엑셀 연습']);
  assert.deepEqual(learnTitles(homeOf('sme', 'en')), ['SME First Steps', 'SME Support Lifecycle', 'SME SOP Library', "Miso's Excel Practice"]);
  // Agents have all three courses since 2026-11-27.
  assert.deepEqual(hrefs(homeOf('agent')), ['./agent/', './agent-career/', './agent-sop/', './excel/']);
  assert.deepEqual(learnTitles(homeOf('agent')), ['상담사 첫걸음', '상담사 커리어 라이프사이클', '상담사 SOP 라이브러리', '미소의 엑셀 연습']);
  assert.deepEqual(learnTitles(homeOf('agent', 'en')), ['Agent First Steps', 'Agent Career Lifecycle', 'Agent SOP Library', "Miso's Excel Practice"]);
  // AMs have AM First Steps and the AM SOP Library since 2026-11-28.
  assert.deepEqual(hrefs(homeOf('am')), ['./am/', './am-sop/', './excel/']);
  assert.deepEqual(learnTitles(homeOf('am')), ['부매니저 첫걸음', '부매니저 SOP 라이브러리', '미소의 엑셀 연습']);
  assert.deepEqual(learnTitles(homeOf('am', 'en')), ['AM First Steps', 'AM SOP Library', "Miso's Excel Practice"]);
  for (const role of ['om']) {
    assert.deepEqual(hrefs(homeOf(role)), ['soon', 'soon', './excel/'], role);
    assert.deepEqual(learnTitles(homeOf(role)), [`${SHORT[role][0]} 첫걸음`, `${SHORT[role][0]} SOP 라이브러리`, '미소의 엑셀 연습'], role);
    assert.deepEqual(learnTitles(homeOf(role, 'en')), [`${SHORT[role][1]} First Steps`, `${SHORT[role][1]} SOP Library`, "Miso's Excel Practice"], role);
  }
});

test('the Excel card line depends on the role', () => {
  const excelText = (role, lang = 'ko') => homeOf(role, lang).querySelector('#learn a[href="./excel/"] span').textContent;
  const sme = rhRows(3).find((r) => r[0] === 'SME' && r[1] === '엑셀');
  const shared = rhRows(3).find((r) => r[1] === '엑셀' && r[0] !== 'SME');
  assert.equal(excelText('tl'), '팀장이 꼭 쓰는 엑셀 11가지를 눌러서 익힙니다.');
  assert.equal(excelText('sme'), sme[3]);
  assert.equal(excelText('sme', 'en'), sme[5]);
  for (const r of ['agent', 'am', 'om']) assert.equal(excelText(r), shared[3], r);
});

test('the SME home links to the SME guide', () => {
  const sme = homeOf('sme');
  const card = sme.querySelector('a.card[href="./sme-guide/"]');
  assert.ok(card);
  assert.equal(card.querySelector('strong').textContent, rhRow(2, 'SME')[1]);
  assert.equal(card.querySelector('span').textContent, GUIDE_CARD.text.ko);
  assert.equal(homeOf('sme', 'en').querySelector('a.card[href="./sme-guide/"] strong').textContent, rhRow(2, 'SME')[2]);
  assert.equal(sme.querySelector('[data-soon="guide"]'), null);
  for (const role of ['am', 'om']) assert.ok(homeOf(role).querySelector('[data-soon="guide"]'), role);
  assert.ok(homeOf('tl').querySelector('a.card[href="./guide/"]'));
});

test('the agent home links to the agent guide', () => {
  const agent = homeOf('agent');
  const card = agent.querySelector('a.card[href="./agent-guide/"]');
  assert.ok(card);
  assert.equal(card.querySelector('strong').textContent, '어디서부터 볼까요? · 상담사 상황별 길잡이');
  assert.equal(card.querySelector('span').textContent, GUIDE_CARD.text.ko);
  assert.equal(homeOf('agent', 'en').querySelector('a.card[href="./agent-guide/"] strong').textContent, 'Where to start? · Agent Situation Guide');
  assert.equal(agent.querySelector('[data-soon="guide"]'), null);
});

test('the guide card is TL\'s guide or coming soon', () => {
  const tl = homeOf('tl').querySelector('a.card[href="./guide/"]');
  assert.equal(tl.querySelector('strong').textContent, rhRow(2, 'TL')[1]);
  const sme = homeOf('sme');
  assert.equal(sme.querySelector('a.card[href="./guide/"]'), null);
  assert.equal(homeOf('am', 'en').querySelector('[data-soon="guide"] strong').textContent, rhRow(2, 'AM')[2]);
});

test('coming-soon cards are not links and say so', () => {
  const mark = rhRow(1, '준비 중 표시');
  const text = rhRow(1, '준비 중 카드 설명');
  for (const [role, lang] of [['om', 'ko'], ['om', 'en']]) {
    const card = homeOf(role, lang).querySelector('[data-soon="first-steps"]');
    assert.notEqual(card.tagName, 'A');
    assert.equal(card.querySelector('[data-soon-mark]').textContent, lang === 'ko' ? mark[1] : mark[2]);
    assert.equal(card.querySelector('[data-soon-text]').textContent, fillRole(lang === 'ko' ? text[1] : text[2], role, lang));
    assert.deepEqual([...card.querySelectorAll('a')].map((a) => a.getAttribute('href')), ['./codex/#career', `./codex/#daily-${role}`]);
  }
  // Support Lifecycle is built (2026-11-25): a link with the approved line; SME SOP is still coming.
  const sme = homeOf('sme');
  assert.equal(sme.querySelector('[data-soon="sme-lifecycle"]'), null);
  assert.equal(sme.querySelector('a.card[href="./sme-lifecycle/"] span').textContent, rhRows(3).find((r) => r[1] === '직무전문가 서포트 라이프사이클')[3]);
  assert.deepEqual([...sme.querySelectorAll('#learn [data-soon]')].map((c) => c.dataset.soon), []);
});

test('working links inside a coming-soon card are not announced as unavailable', () => {
  for (const role of ['agent', 'sme', 'am', 'om']) {
    const root = homeOf(role);
    for (const a of root.querySelectorAll('[data-soon] a')) {
      assert.equal(a.closest('[aria-disabled="true"]'), null, `${role}: ${a.getAttribute('href')}`);
    }
  }
});

test('roles without a course start at Excel lesson 1', () => {
  const row = rhRows(4).find((r) => r[0].startsWith('상담사'));
  // Agents start on Agent First Steps since 2026-11-26 (see the agent test above).
  const am = homeOf('am').querySelector('[data-start] a');
  assert.equal(am.getAttribute('href'), './am/#firstweek-0');
  assert.equal(am.textContent, '처음이라면 부매니저 첫걸음 레슨 1부터 시작해 보세요.');
  for (const role of ['om']) {
    const start = homeOf(role).querySelector('[data-start] a');
    assert.equal(start.getAttribute('href'), './excel/#lesson-1', role);
    assert.equal(start.textContent, row[1], role);
  }
  assert.equal(homeOf('om', 'en').querySelector('[data-start] a').textContent, row[2]);
});
