// Review quizzes per role (2026-11-25). Korean must be the approved copy:
// docs/superpowers/specs/2026-11-25-review-quiz-copy-ko.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fakeStorage, throwingStorage } from './helpers.js';
import { QUIZZES, REVIEW_UI } from '../../review/data.js';
import { REVIEW_KEY, PASS_MARK, loadReview, recordRun, unlocked } from '../../review/engine.js';
import { BADGES } from '../../practice/data.js';

const COPY = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-review-quiz-copy-ko.md', import.meta.url), 'utf8');
const cells = (line) => line.slice(1, -1).split(' | ').map((c) => c.trim());
const rowIn = (text, place) => cells(text.split('\n').find((l) => l.startsWith(`| ${place} |`)));

function parseQuestion(block) {
  const q = { options: [] };
  for (const line of block.split('\n')) {
    if (!line.startsWith('| ') || line.startsWith('| 항목') || line.startsWith('|---')) continue;
    const [key, value] = cells(line);
    let m;
    if (key === '질문') q.prompt = value;
    else if ((m = key.match(/^보기 ([a-c]) \((오답|정답)\)$/))) {
      q.options.push({ id: m[1], text: value });
      if (m[2] === '정답') q.answer = m[1];
    } else if ((m = key.match(/^([a-c]) 피드백$/))) q.options.find((o) => o.id === m[1]).feedback = value;
    else if (key === '해설') q.explanation = value;
    else if (key === '관련 레슨') q.lessons = [...value.matchAll(/(.+?) \((\.\.\/\S+)\)(?: · |$)/g)].map((m2) => ({ title: m2[1], href: m2[2] }));
  }
  return q;
}
const quizSection = (n) => COPY.split(/^## 퀴즈 \d+\. /m)[n].split(/^## /m)[0];
const PARSED = { tl: quizSection(1).split(/^### 문제 \d+/m).slice(1).map(parseQuestion), sme: quizSection(2).split(/^### 문제 \d+/m).slice(1).map(parseQuestion) };

const UI_ROWS = {
  title: '페이지 제목', intro: '페이지 소개', nameTl: '팀장 퀴즈 이름', scopeTl: '팀장 퀴즈 범위', nameSme: 'SME 퀴즈 이름', scopeSme: 'SME 퀴즈 범위',
  locked: '잠김 안내', lockedLink: '잠김 링크', start: '시작 버튼', count: '문제 번호', correct: '정답', wrong: '오답', related: '관련 레슨',
  next: '다음 버튼', finish: '마지막 버튼', score: '결과 점수', passed: '통과', failed: '미통과', missedTitle: '다시 볼 레슨 제목', retry: '다시 풀기',
  best: '최고 기록', passMark: '통과 표시', homeStart: '홈 카드 (통과 전)', homeDone: '홈 카드 (통과 뒤)',
};

test('the Korean is the approved copy, word for word', () => {
  for (const role of ['tl', 'sme']) {
    const qs = QUIZZES[role].questions;
    assert.equal(qs.length, PARSED[role].length, role);
    qs.forEach((q, i) => {
      const want = PARSED[role][i];
      assert.equal(q.id, `${role}-q${i + 1}`);
      assert.equal(q.prompt.ko, want.prompt, q.id);
      assert.equal(q.answer, want.answer, q.id);
      assert.equal(q.explanation.ko, want.explanation, q.id);
      assert.deepEqual(q.options.map((o) => ({ id: o.id, text: o.text.ko, ...(o.feedback ? { feedback: o.feedback.ko } : {}) })), want.options, q.id);
      assert.deepEqual(q.lessons.map((l) => ({ title: l.title.ko, href: l.href })), want.lessons, q.id);
    });
  }
  const section1 = COPY.split(/^## 1\. /m)[1].split(/^## /m)[0];
  for (const [key, place] of Object.entries(UI_ROWS)) assert.equal(REVIEW_UI[key].ko, rowIn(section1, place)[1], key);
  assert.equal(QUIZZES.tl.name, REVIEW_UI.nameTl);
  assert.equal(QUIZZES.sme.scope, REVIEW_UI.scopeSme);
  const section2 = COPY.split(/^## 2\. /m)[1].split(/^## /m)[0];
  const badge = (id) => BADGES.find((b) => b.id === id);
  assert.equal(badge('review-tl').name.ko, rowIn(section2, '팀장 배지 이름')[1]);
  assert.equal(badge('review-tl').rule.ko, rowIn(section2, '팀장 배지 조건')[1]);
  assert.equal(badge('review-sme').name.ko, rowIn(section2, 'SME 배지 이름')[1]);
  assert.equal(badge('review-sme').rule.ko, rowIn(section2, 'SME 배지 조건')[1]);
});

test('six questions each, answers spread over a, b and c', () => {
  for (const role of ['tl', 'sme']) {
    const answers = QUIZZES[role].questions.map((q) => q.answer);
    assert.equal(answers.length, 6, role);
    for (const id of ['a', 'b', 'c']) assert.ok(answers.includes(id), `${role} uses ${id}`);
    for (const q of QUIZZES[role].questions) for (const o of q.options) assert.equal(Boolean(o.feedback), o.id !== q.answer, `${q.id} ${o.id}`);
  }
  assert.equal(PASS_MARK, 5);
  assert.equal(REVIEW_KEY, 'queuecraft:review:v1');
});

test('a run of 5 passes and 4 does not', () => {
  const s = fakeStorage();
  assert.deepEqual(recordRun(s, 'sme', 5, 6), { best: 5, total: 6, passed: true, firstPass: true });
  assert.equal(recordRun(s, 'tl', 4, 6).passed, false);
  assert.deepEqual(loadReview(s), { sme: { best: 5, total: 6, passed: true }, tl: { best: 4, total: 6, passed: false } });
});

test('a worse retake keeps the best and the pass', () => {
  const s = fakeStorage();
  recordRun(s, 'tl', 6, 6);
  assert.deepEqual(recordRun(s, 'tl', 3, 6), { best: 6, total: 6, passed: true, firstPass: false });
  assert.deepEqual(loadReview(s).tl, { best: 6, total: 6, passed: true });
});

test('broken review data reads as empty', () => {
  for (const v of ['x', '[]', '{"boss":{"best":9,"total":6,"passed":true}}', '{"tl":{"best":"9","total":6,"passed":true}}', 'null']) {
    assert.deepEqual(loadReview(fakeStorage({ [REVIEW_KEY]: v })), {}, v);
  }
  assert.deepEqual(loadReview(null), {});
});

test('blocked storage plays but stores nothing', () => {
  assert.doesNotThrow(() => recordRun(throwingStorage, 'tl', 6, 6));
  assert.equal(recordRun(throwingStorage, 'tl', 6, 6).passed, true);
  assert.deepEqual(loadReview(throwingStorage), {});
});

test('a quiz unlocks when the role\'s courses are finished', () => {
  const life = ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'];
  const sop = ['escalation', 'scrubbing', 'coaching', 'pip', 'calibration', 'transition', 'onboarding', 'incident', 'nurture', 'launch'];
  const sme = ['firstday', 'newcomer', 'escalation', 'peer', 'lead', 'priority', 'knowledge'];
  assert.deepEqual(unlocked(fakeStorage(), 'tl'), { open: false, left: 16, next: { href: '../agent-lifecycle/#hiring-0' } });
  const partly = fakeStorage({ 'agent-lifecycle-course:v1': JSON.stringify({ completed: life }), 'sop-library:v1': JSON.stringify({ completed: sop.slice(0, 9) }) });
  assert.deepEqual(unlocked(partly, 'tl'), { open: false, left: 1, next: { href: '../sop-library/#launch-0' } });
  const done = fakeStorage({ 'agent-lifecycle-course:v1': JSON.stringify({ completed: life }), 'sop-library:v1': JSON.stringify({ completed: sop }) });
  assert.deepEqual(unlocked(done, 'tl'), { open: true, left: 0, next: null });
  assert.equal(unlocked(fakeStorage(), 'sme').left, 7);
  assert.equal(unlocked(fakeStorage({ 'sme-course:v1': JSON.stringify({ completed: sme }) }), 'sme').open, true);
  assert.deepEqual(unlocked(fakeStorage(), 'am'), { open: false, left: 0, next: null });
});

// ---------- the review/ page (Task 3) ----------
import { setupDom, click } from './dom.js';
import { renderReview, newReviewView, routeRole } from '../../review/render.js';
import { loadState } from '../../practice/engine.js';

const SME_DONE = { 'sme-course:v1': JSON.stringify({ completed: ['firstday', 'newcomer', 'escalation', 'peer', 'lead', 'priority', 'knowledge'] }) };
function page(storage, role = 'sme', lang = 'ko', view = newReviewView()) {
  const { root } = setupDom();
  const draw = () => renderReview(root, lang, storage, view, role, draw);
  draw();
  return { root, view, draw };
}
// Answers question by question: right[i] says whether to pick the right option.
function play(root, quiz, right) {
  quiz.questions.forEach((q, i) => {
    const pick = right[i] ? q.answer : q.options.find((o) => o.id !== q.answer).id;
    click(root.querySelector(`[data-option="${pick}"]`));
    click(root.querySelector('[data-next]'));
  });
}

test('the list shows my role\'s quiz first, with lock, best and pass', () => {
  const locked = page(fakeStorage(), 'sme').root;
  const cards = [...locked.querySelectorAll('[data-quiz]')];
  assert.deepEqual(cards.map((c) => c.getAttribute('data-quiz')), ['sme', 'tl']);
  assert.equal(cards[0].querySelector('[data-locked]').textContent, REVIEW_UI.locked.ko.replace('{n}', '7'));
  assert.equal(cards[1].querySelector('[data-locked]').textContent, REVIEW_UI.locked.ko.replace('{n}', '16'));
  assert.equal(cards[0].querySelector('a[data-locked-link]').getAttribute('href'), '../sme/#firstday-0');
  assert.equal(cards[0].querySelector('[data-start-quiz]'), null);
  assert.deepEqual([...page(fakeStorage(), 'tl').root.querySelectorAll('[data-quiz]')].map((c) => c.getAttribute('data-quiz')), ['tl', 'sme']);

  const s = fakeStorage({ ...SME_DONE, [REVIEW_KEY]: JSON.stringify({ sme: { best: 5, total: 6, passed: true } }) });
  const open = page(s, 'sme').root.querySelector('[data-quiz="sme"]');
  assert.ok(open.textContent.includes(REVIEW_UI.passMark.ko));
  assert.ok(open.textContent.includes(REVIEW_UI.best.ko.replace('{x}', '5').replace('{n}', '6')));
  assert.ok(open.querySelector('[data-start-quiz]'));
});

test('answering shows feedback, explanation and related lessons', () => {
  const { root } = page(fakeStorage(SME_DONE));
  click(root.querySelector('[data-start-quiz="sme"]'));
  const q = QUIZZES.sme.questions[0];
  assert.equal(root.querySelector('[data-count]').textContent, REVIEW_UI.count.ko.replace('{i}', '1').replace('{n}', '6'));
  const wrong = q.options.find((o) => o.id !== q.answer);
  click(root.querySelector(`[data-option="${wrong.id}"]`));
  assert.equal(root.querySelector('[data-feedback]').textContent, wrong.feedback.ko);
  assert.ok(root.querySelector('[data-explanation]').textContent.includes(q.explanation.ko));
  assert.deepEqual([...root.querySelectorAll('a[data-related]')].map((a) => a.getAttribute('href')), q.lessons.map((l) => l.href));
  assert.ok([...root.querySelectorAll('[data-option]')].every((b) => b.disabled));
  click(root.querySelector('[data-next]'));
  const q2 = QUIZZES.sme.questions[1];
  click(root.querySelector(`[data-option="${q2.answer}"]`));
  assert.equal(root.querySelectorAll('a[data-related]').length, 0);
});

test('finishing scores the run, offers a retry and awards the badge once', () => {
  const s = fakeStorage(SME_DONE);
  const { root } = page(s);
  click(root.querySelector('[data-start-quiz="sme"]'));
  play(root, QUIZZES.sme, [true, true, true, true, true, false]);
  assert.equal(root.querySelector('[data-score]').textContent, REVIEW_UI.score.ko.replace('{n}', '6').replace('{x}', '5'));
  assert.equal(root.querySelector('[data-result]').textContent, REVIEW_UI.passed.ko);
  assert.ok(root.querySelector('[data-new-badge]'));
  assert.ok(loadState(s).badges['review-sme']);
  assert.deepEqual(loadReview(s).sme, { best: 5, total: 6, passed: true });
  click(root.querySelector('[data-retry]'));
  play(root, QUIZZES.sme, [true, true, true, true, true, true]);
  assert.equal(root.querySelector('[data-new-badge]'), null, 'the badge is given once');
  assert.deepEqual(loadReview(s).sme, { best: 6, total: 6, passed: true });
});

test('a failed run lists the lessons to review', () => {
  const s = fakeStorage(SME_DONE);
  const { root } = page(s);
  click(root.querySelector('[data-start-quiz="sme"]'));
  play(root, QUIZZES.sme, [true, true, true, true, false, false]);
  assert.equal(root.querySelector('[data-result]').textContent, REVIEW_UI.failed.ko.replace('{need}', '5'));
  const want = [...new Set(QUIZZES.sme.questions.slice(4).flatMap((q) => q.lessons.map((l) => l.href)))];
  assert.deepEqual([...root.querySelectorAll('[data-missed] a')].map((a) => a.getAttribute('href')), want);
  assert.equal(loadState(s).badges['review-sme'], undefined);
});

test('leaving mid-quiz stores nothing', () => {
  const s = fakeStorage(SME_DONE);
  const first = page(s);
  click(first.root.querySelector('[data-start-quiz="sme"]'));
  play(first.root, { questions: QUIZZES.sme.questions.slice(0, 3) }, [true, true, true]);
  const again = page(s);
  assert.ok(again.root.querySelector('[data-quiz="sme"]'), 'a new visit opens the list');
  assert.deepEqual(loadReview(s), {});
});

test('a locked or unknown quiz address shows the list', () => {
  assert.equal(routeRole('#sme', fakeStorage(SME_DONE)), 'sme');
  assert.equal(routeRole('#tl', fakeStorage(SME_DONE)), null);
  assert.equal(routeRole('#boss', fakeStorage(SME_DONE)), null);
  assert.equal(routeRole('', fakeStorage(SME_DONE)), null);
  const view = newReviewView();
  view.role = routeRole('#tl', fakeStorage());
  assert.ok(page(fakeStorage(), 'tl', 'ko', view).root.querySelector('[data-quiz="tl"]'));
});

test('blocked storage still plays a quiz to the end', async () => {
  const s = fakeStorage(SME_DONE);
  const view = newReviewView();
  const { root } = setupDom();
  const draw = () => renderReview(root, 'ko', throwingStorage, view, 'sme', draw);
  view.role = 'sme';
  draw();
  play(root, QUIZZES.sme, [true, true, true, true, true, true]);
  assert.ok(root.querySelector('[data-score]'));
  assert.ok(s);
});

// ---------- English (Task 6): …-review-quiz-copy.en.md ----------
const EN = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-review-quiz-copy.en.md', import.meta.url), 'utf8');
const enQuiz = (n) => EN.split(/^## 퀴즈 \d+\. /m)[n].split(/^## /m)[0].split(/^### 문제 \d+/m).slice(1).map(parseQuestion);

test('the English is the English copy, word for word', () => {
  const PARSED_EN = { tl: enQuiz(1), sme: enQuiz(2) };
  for (const role of ['tl', 'sme']) {
    QUIZZES[role].questions.forEach((q, i) => {
      const want = PARSED_EN[role][i];
      assert.equal(q.prompt.en, want.prompt, q.id);
      assert.equal(q.answer, want.answer, q.id);
      assert.equal(q.explanation.en, want.explanation, q.id);
      assert.deepEqual(q.options.map((o) => ({ id: o.id, text: o.text.en, ...(o.feedback ? { feedback: o.feedback.en } : {}) })), want.options, q.id);
      assert.deepEqual(q.lessons.map((l) => ({ title: l.title.en, href: l.href })), want.lessons, q.id);
    });
  }
  const s1 = EN.split(/^## 1\. /m)[1].split(/^## /m)[0];
  for (const [key, place] of Object.entries(UI_ROWS)) assert.equal(REVIEW_UI[key].en, rowIn(s1, place)[1], key);
  const s2 = EN.split(/^## 2\. /m)[1].split(/^## /m)[0];
  const badge = (id) => BADGES.find((b) => b.id === id);
  assert.deepEqual([badge('review-tl').name.en, badge('review-tl').rule.en], [rowIn(s2, '팀장 배지 이름')[1], rowIn(s2, '팀장 배지 조건')[1]]);
  assert.deepEqual([badge('review-sme').name.en, badge('review-sme').rule.en], [rowIn(s2, 'SME 배지 이름')[1], rowIn(s2, 'SME 배지 조건')[1]]);
});

test('the English never runs to more sentences than the Korean', () => {
  const count = (s) => (s.match(/[.?!](?=["'”’)]*(\s|$))/g) || []).length;
  for (const q of [...QUIZZES.tl.questions, ...QUIZZES.sme.questions]) {
    for (const k of ['prompt', 'explanation']) assert.ok(count(q[k].en) <= count(q[k].ko), `${q.id} ${k}`);
  }
});

test('the English page has no Korean, through to the result', () => {
  const s = fakeStorage(SME_DONE);
  const { root } = page(s, 'sme', 'en');
  assert.ok(!/[가-힣]/.test(root.textContent), 'list');
  click(root.querySelector('[data-start-quiz="sme"]'));
  play(root, QUIZZES.sme, [true, true, true, true, false, false]);
  assert.ok(!/[가-힣]/.test(root.textContent), 'result');
});

test('after an answer, focus is on Next and the result is read out', () => {
  const { root } = page(fakeStorage(SME_DONE));
  click(root.querySelector('[data-start-quiz="sme"]'));
  const q = QUIZZES.sme.questions[0];
  click(root.querySelector(`[data-option="${q.answer}"]`));
  assert.equal(document.activeElement, root.querySelector('[data-next]'));
  assert.equal(document.querySelector('[role="status"][data-status]').textContent, REVIEW_UI.correct.ko);
  click(root.querySelector('[data-next]'));
  assert.equal(document.querySelector('[data-status]').textContent, '', 'cleared for the next question');
  const q2 = QUIZZES.sme.questions[1];
  click(root.querySelector(`[data-option="${q2.options.find((o) => o.id !== q2.answer).id}"]`));
  assert.equal(document.querySelector('[data-status]').textContent, REVIEW_UI.wrong.ko);
});
