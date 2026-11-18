import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS } from '../js/lessons/index.js';
import { validateCourse } from '../js/engine/lessonSchema.js';
import { lessonText } from './helpers.js';
import { visibleSteps, visibleQuestions } from '../js/engine/track.js';

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
  assert.deepEqual(validateCourse(LESSONS, { requireEnglish: true, requireTracks: true }), []);
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

// --- tracks and additions (Korean) ---
const trackCaptions = (id, track, lang = 'ko') => byId(id).steps.filter((st) => st.track === track).map((st) => st.caption[lang] ?? '');
const commonCaptions = (id, lang = 'ko') => byId(id).steps.filter((st) => !st.track).map((st) => st.caption[lang] ?? '');
const hasNode = (id, nodeId) => byId(id).diagram.nodes.some((n) => n.id === nodeId);

test('course is valid with tracks', () => {
  assert.deepEqual(validateCourse(LESSONS, { requireTracks: true }), []);
});

test('skills verification gates go-live', () => {
  assert.ok(hasNode('onboarding', 'verify'));
  const text = commonCaptions('onboarding').join(' ');
  for (const word of ['스킬 검증', '재평가', '센터마다']) assert.ok(text.includes(word), word);
  assert.ok(byId('onboarding').connection.text.ko.includes('스킬 검증'));
});

test('calibration and knowledge re-check added to coaching', () => {
  assert.ok(hasNode('coaching', 'calibration'));
  const caps = commonCaptions('coaching');
  assert.ok(caps.some((c) => c.includes('캘리브레이션') && c.includes('각자') && c.includes('센터마다')));
  assert.ok(caps.some((c) => c.includes('다시 확인') && !c.includes('캘리브레이션')));
});

test('tech track speaks in tickets', () => {
  const all = LESSONS.map((l) => trackCaptions(l.id, 'tech').join(' ')).join(' ');
  assert.ok(all.includes('티켓'));
  assert.ok(trackCaptions('nesting', 'tech').join(' ').includes('에스컬레이션'));
  assert.ok(trackCaptions('career', 'tech').join(' ').includes('2차'));
  assert.ok(trackCaptions('onboarding', 'tech').join(' ').includes('이메일'));
});

test('general track adds what common steps lack', () => {
  assert.ok(trackCaptions('coaching', 'general').join(' ').includes('정책'));
  assert.ok(trackCaptions('career', 'general').join(' ').includes('전문 상담'));
});

test('no COPC wording anywhere', () => {
  for (const l of LESSONS) for (const lang of ['ko', 'en']) assert.ok(!lessonText(l, lang).includes('COPC'), l.id);
});

test('Jimin ends in QA on both tracks', () => {
  for (const track of ['general', 'tech']) {
    const text = visibleSteps(byId('career'), track).map((st) => st.caption.ko).join(' ');
    assert.ok(text.includes('QA') && text.includes('지민'), track);
  }
});

test('every lesson shows two questions per track', () => {
  for (const l of LESSONS) for (const track of ['general', 'tech']) assert.equal(visibleQuestions(l, track).length, 2, `${l.id} ${track}`);
});

// --- tracks and additions (English) ---
test('English: verification, calibration, tickets, escalation', () => {
  assert.ok(commonCaptions('onboarding', 'en').join(' ').includes('skills verification'));
  assert.ok(commonCaptions('coaching', 'en').join(' ').includes('calibration'));
  const tech = LESSONS.map((l) => trackCaptions(l.id, 'tech', 'en').join(' ')).join(' ');
  assert.ok(tech.includes('ticket'));
  assert.ok(trackCaptions('nesting', 'tech', 'en').join(' ').includes('escalat'));
  assert.ok(trackCaptions('career', 'tech', 'en').join(' ').includes('Tier 2'));
  assert.ok(trackCaptions('career', 'general', 'en').join(' ').includes('specialist'));
});

test('English: new diagram nodes are labelled', () => {
  const label = (id, nodeId) => byId(id).diagram.nodes.find((n) => n.id === nodeId).label.en;
  assert.equal(label('onboarding', 'verify'), 'Verification');
  assert.equal(label('coaching', 'calibration'), 'Calibration');
});

// --- final review: English wording ---
test('English review fixes', () => {
  const opt = (id, qid, oid) => byId(id).checkpoint.find((q) => q.id === qid).options.find((o) => o.id === oid).text.en;
  assert.ok(trackCaptions('career', 'tech', 'en').join(' ').includes('adds further paths'));
  assert.ok(!lessonText(byId('career'), 'en').includes('more paths'));
  assert.ok(commonCaptions('coaching', 'en').join(' ').includes('keeps giving correct information'));
  assert.ok(!lessonText(byId('hiring'), 'en').includes('looks harder at'));
  assert.ok(trackCaptions('onboarding', 'tech', 'en').join(' ').includes('logged as a ticket'));
  assert.ok(opt('career', 'career-tech', 'b').includes('alongside a Tier 2 agent'));
  assert.ok(!opt('hiring', 'hiring-tech', 'a').includes('call'));
});
