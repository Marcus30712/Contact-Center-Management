import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLesson, validateCourse } from '../js/engine/lessonSchema.js';
import { makeLesson, makeBilingualLesson } from './fixtures.js';

const has = (errors, part) => errors.some((e) => e.includes(part));

test('valid Korean-only lesson has no errors', () => {
  assert.deepEqual(validateLesson(makeLesson()), []);
});

test('valid bilingual lesson passes with requireEnglish', () => {
  assert.deepEqual(validateLesson(makeBilingualLesson(), { requireEnglish: true }), []);
});

test('rejects fewer than 6 steps', () => {
  const l = makeLesson();
  l.steps.pop();
  assert.ok(has(validateLesson(l), 'steps'));
});

test('rejects more than 10 steps', () => {
  const l = makeLesson();
  while (l.steps.length < 11) l.steps.push(structuredClone(l.steps[0]));
  assert.ok(has(validateLesson(l), 'steps'));
});

test('rejects a caption longer than 3 sentences', () => {
  const l = makeLesson();
  l.steps[1].caption.ko = '하나입니다. 둘입니다. 셋입니다. 넷입니다.';
  assert.ok(has(validateLesson(l), 'sentences'));
});

test('rejects unknown node ids in show, highlight, persona, and edges', () => {
  for (const mutate of [
    (l) => l.steps[0].show.push('zz'),
    (l) => l.steps[0].highlight.push('zz'),
    (l) => { l.steps[0].persona = 'zz'; },
    (l) => { l.diagram.edges[0].to = 'zz'; },
  ]) {
    const l = makeLesson();
    mutate(l);
    assert.ok(has(validateLesson(l), 'zz'));
  }
});

test('rejects an answer that is not among the options', () => {
  const l = makeLesson();
  l.checkpoint[0].answer = 'nope';
  assert.ok(has(validateLesson(l), 'answer'));
});

test('rejects the banned word', () => {
  const l = makeLesson();
  l.steps[2].caption.ko = '지민이 진상 고객을 만납니다.';
  assert.ok(has(validateLesson(l), '진상'));
});

test('requires 예시 on captions with figures', () => {
  const l = makeLesson();
  l.steps[2].caption.ko = '지원자의 30%가 합격합니다.';
  assert.ok(has(validateLesson(l), '예시'));
  l.steps[2].caption.ko = '예시: 지원자의 30%가 합격합니다.';
  assert.deepEqual(validateLesson(l), []);
});

test('requires the persona to appear', () => {
  const l = makeLesson();
  l.steps[0].caption.ko = '누군가 지원서를 냅니다.';
  assert.ok(has(validateLesson(l), '지민'));
});

test('requireEnglish reports missing English', () => {
  assert.ok(has(validateLesson(makeLesson(), { requireEnglish: true }), 'en'));
});

test('English text is checked whenever it exists', () => {
  const l = makeBilingualLesson();
  l.steps[2].caption.en = 'About 30% of applicants pass.';
  assert.ok(has(validateLesson(l), 'Example'));
});

test('rejects a text with no Korean', () => {
  const l = makeLesson();
  l.title = { en: 'Hiring' };
  assert.ok(has(validateLesson(l), 'ko'));
});

function makeCourse() {
  const ids = ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'];
  return ids.map((id, i) => makeLesson({
    id, order: i + 1,
    connection: { to: ids[(i + 1) % 6], text: { ko: '다음으로 이어집니다.' } },
  }));
}

test('valid six-lesson course has no errors', () => {
  assert.deepEqual(validateCourse(makeCourse()), []);
});

test('course must have exactly six lessons', () => {
  assert.ok(has(validateCourse(makeCourse().slice(0, 5)), '6'));
});

test('course connections must follow lesson order', () => {
  const c = makeCourse();
  c[2].connection.to = 'hiring';
  assert.ok(has(validateCourse(c), 'connection'));
});

test('course rejects duplicate ids', () => {
  const c = makeCourse();
  c[1].id = 'hiring';
  assert.ok(has(validateCourse(c), 'hiring'));
});

test('optional short label is checked when present', () => {
  const l = makeLesson({ short: { en: 'Hiring' } });
  assert.ok(has(validateLesson(l), 'short'));
  assert.deepEqual(validateLesson(makeLesson({ short: { ko: '채용' } })), []);
});

test('durations in weeks or days need no 예시 label, other figures still do', () => {
  const l = makeLesson();
  l.steps[2].caption.ko = '지민의 교육은 보통 2~4주 걸립니다.';
  assert.deepEqual(validateLesson(l), []);
  l.steps[2].caption.ko = '지민의 통화는 평균 5분입니다.';
  assert.ok(has(validateLesson(l), '예시'));
});
