import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS } from '../js/lessons/index.js';
import { validateCourse } from '../js/engine/lessonSchema.js';
import { lessonText } from './helpers.js';

const byId = (id) => LESSONS.find((l) => l.id === id);
const captions = (id, lang) => byId(id).steps.map((s) => s.caption[lang] ?? '');

test('course is valid', () => {
  assert.deepEqual(validateCourse(LESSONS), []);
  assert.deepEqual(LESSONS.map((l) => l.id), ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career']);
});

test('shrinkage is defined as all unavailable time, not absenteeism', () => {
  const withTerm = captions('coaching', 'ko').filter((c) => c.includes('Shrinkage'));
  assert.ok(withTerm.length > 0);
  assert.ok(withTerm.some((c) => c.includes('휴식') && c.includes('교육')));
  assert.ok(!lessonText(byId('coaching'), 'ko').includes('결근율(Shrinkage)'));
});

test('RJP is linked to early attrition', () => {
  const text = lessonText(byId('hiring'), 'ko');
  assert.ok(text.includes('RJP'));
  assert.ok(text.includes('조기 퇴사'));
});

test('nesting is marked as the highest-attrition period', () => {
  assert.ok(lessonText(byId('nesting'), 'ko').includes('이직'));
});

test('career closes the loop', () => {
  const text = lessonText(byId('career'), 'ko');
  assert.ok(text.includes('QA'));
  assert.ok(text.includes('퇴사 면담'));
  assert.equal(byId('career').connection.to, 'hiring');
});

test('hang-up authority is hedged', () => {
  const withTerm = LESSONS.flatMap((l) => captions(l.id, 'ko')).filter((c) => c.includes('선끊기'));
  assert.ok(withTerm.length > 0);
  assert.ok(withTerm.every((c) => c.includes('센터마다')));
});

test('every lesson has a short ring label', () => {
  for (const l of LESSONS) assert.ok(l.short?.ko && [...l.short.ko].length <= 4, l.id);
});

test('Korean sign-off edits: AHT wording, duration phrasing, RJP is not a gate', () => {
  const all = LESSONS.map((l) => lessonText(l, 'ko')).join(' ');
  assert.ok(!all.includes('평균 통화 시간'));
  assert.ok(lessonText(byId('nesting'), 'ko').includes('평균 처리 시간(AHT)'));
  assert.ok(lessonText(byId('onboarding'), 'ko').includes('센터마다 다르지만 보통 2~4주'));
  assert.ok(!all.includes('예시로'));
  assert.ok(!lessonText(byId('hiring'), 'ko').includes('관문'));
});

// --- English (plan Task 8) ---
test('course is valid in English', () => {
  assert.deepEqual(validateCourse(LESSONS, { requireEnglish: true }), []);
});

test('English: shrinkage is all unavailable time, not absenteeism', () => {
  const withTerm = captions('coaching', 'en').filter((c) => c.includes('Shrinkage'));
  assert.ok(withTerm.some((c) => c.includes('break') && c.includes('training')));
  assert.ok(!lessonText(byId('coaching'), 'en').includes('absenteeism (Shrinkage)'));
});

test('English: key terms carry over', () => {
  const hiring = lessonText(byId('hiring'), 'en');
  assert.ok(hiring.includes('RJP') && hiring.includes('early attrition'));
  assert.ok(lessonText(byId('nesting'), 'en').includes('attrition'));
  const career = lessonText(byId('career'), 'en');
  assert.ok(career.includes('QA') && career.includes('exit interview'));
  assert.ok(lessonText(byId('nesting'), 'en').includes('average handle time (AHT)'));
});

test('English: hang-up authority is hedged', () => {
  const withTerm = LESSONS.flatMap((l) => captions(l.id, 'en')).filter((c) => c.includes('hang up'));
  assert.ok(withTerm.length > 0);
  assert.ok(withTerm.every((c) => c.includes('varies by center')));
});

test('English: the persona is Jimin Han and short labels fit the ring', () => {
  assert.ok(lessonText(byId('hiring'), 'en').includes('Jimin Han'));
  for (const l of LESSONS) assert.ok(l.short.en && l.short.en.length <= 10, l.id);
});
