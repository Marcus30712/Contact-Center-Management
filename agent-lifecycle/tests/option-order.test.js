// Checkpoint options are shown in an order shuffled per question (2026-11-26):
// the approved copy keeps the right answer at b in most courses, and learners
// shouldn't be able to guess from the position. Same question, same order, on
// every screen and every visit. Excel already did this (excel/engine.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orderedOptions } from '../../shared/option-order.js';
import { COURSE_INFO } from '../../shared/courses.js';
import { QUIZZES } from '../../review/data.js';
import { setupDom } from './dom.js';
import { renderLesson } from '../js/render/lesson.js';
import { fakeStorage } from './helpers.js';
import { renderPractice, newPracticeView } from '../../practice/render.js';

const courseQuestions = Object.values(COURSE_INFO).flatMap((c) => c.lessons.flatMap((l) => l.checkpoint));
const quizQuestions = Object.values(QUIZZES).flatMap((z) => z.questions);
const all = [...courseQuestions, ...quizQuestions];

test('the order keeps every option and is the same each time', () => {
  for (const q of all) {
    const once = orderedOptions(q).map((o) => o.id);
    assert.deepEqual([...once].sort(), q.options.map((o) => o.id).sort(), q.id);
    assert.deepEqual(orderedOptions(q).map((o) => o.id), once, q.id);
  }
});

test('the right answer is spread over every position', () => {
  const at = [0, 0, 0];
  for (const q of all.filter((x) => x.options.length === 3)) at[orderedOptions(q).findIndex((o) => o.id === q.answer)] += 1;
  const total = at.reduce((a, b) => a + b, 0);
  for (const n of at) assert.ok(n / total >= 0.25 && n / total <= 0.42, `positions ${at.join('/')} of ${total}`);
});

test('a lesson checkpoint shows the options in that order', () => {
  const c = COURSE_INFO.agent;
  const lesson = c.lessons[0];
  const { root } = setupDom();
  renderLesson(root, lesson, lesson.steps.length, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: c.lessons.length });
  for (const q of lesson.checkpoint) {
    const shown = [...root.querySelectorAll(`[data-question="${q.id}"] [data-option]`)].map((b) => b.dataset.option);
    assert.deepEqual(shown, orderedOptions(q).map((o) => o.id), q.id);
  }
});

test("today's practice shows a course question in the same order as its lesson", () => {
  const c = COURSE_INFO.agent;
  const s = fakeStorage({ [c.key]: JSON.stringify({ completed: [c.lessons[0].id] }) });
  const { root } = setupDom();
  renderPractice(root, 'ko', s, '2026-11-26', newPracticeView());
  const box = root.querySelector('[data-question]');
  const q = c.lessons[0].checkpoint.find((x) => box.textContent.includes(x.prompt.ko));
  assert.ok(q);
  assert.deepEqual([...box.querySelectorAll('[data-option]')].map((b) => b.dataset.option), orderedOptions(q).map((o) => o.id));
});

// The locked practice page sends each role to its own first lesson (2026-11-26);
// it used to send everyone to the team leader's lifecycle course.
test('locked practice points each role to its own first lesson', () => {
  const want = {
    agent: ['../agent/#start-0', '상담사 첫걸음 레슨 1 시작하기 →'],
    sme: ['../sme/#firstday-0', '직무전문가 첫걸음 레슨 1 시작하기 →'],
    tl: ['../tl/#start-0', '팀장 첫걸음 레슨 1 시작하기 →'],
    am: ['../excel/#lesson-1', '미소의 엑셀 연습 레슨 1 시작하기 →'],
    om: ['../excel/#lesson-1', '미소의 엑셀 연습 레슨 1 시작하기 →'],
  };
  for (const [role, [href, text]] of Object.entries(want)) {
    const { root } = setupDom();
    renderPractice(root, 'ko', fakeStorage(), '2026-11-26', newPracticeView(), { role });
    const a = root.querySelector('a[data-start]');
    assert.deepEqual([a.getAttribute('href'), a.textContent], [href, text], role);
  }
  const { root } = setupDom();
  renderPractice(root, 'en', fakeStorage(), '2026-11-26', newPracticeView(), { role: 'agent' });
  assert.equal(root.querySelector('a[data-start]').textContent, 'Start Agent First Steps lesson 1 →');
});
