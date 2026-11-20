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
  assert.ok(lessonText(byId('nesting'), 'ko').includes('퇴사율이 가장 높은'));
  assert.ok(!LESSONS.some((l) => lessonText(l, 'ko').includes('이직률')));
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

test('every lesson shows three questions per track (common + two)', () => {
  for (const l of LESSONS) for (const track of ['general', 'tech']) assert.equal(visibleQuestions(l, track).length, 3, `${l.id} ${track}`);
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

// --- channel record names and lesson 4 layout ---
test('tech coaching question names the record for each channel', () => {
  const q = byId('coaching').checkpoint.find((x) => x.id === 'coaching-tech');
  const b = q.options.find((o) => o.id === 'b').text;
  for (const word of ['녹취', '채팅 로그', '이메일 로그']) assert.ok(b.ko.includes(word), word);
  for (const word of ['call recordings', 'chat logs', 'email logs']) assert.ok(b.en.includes(word), word);
});

test('lesson 4 boxes leave similar room for every arrow', () => {
  // Clear space between two boxes (box is 108 x 34 in diagram units).
  const nodes = Object.fromEntries(byId('coaching').diagram.nodes.map((n) => [n.id, n]));
  const gap = (a, b) => Math.max(Math.abs(nodes[a].x - nodes[b].x) - 108, Math.abs(nodes[a].y - nodes[b].y) - 34);
  const gaps = ['calls-qa', 'calls-kpi', 'qa-coach', 'kpi-coach', 'calibration-qa'].map((id) => gap(...id.split('-')));
  assert.ok(Math.min(...gaps) >= 14, String(gaps));
  assert.ok(gap('calibration', 'qa') >= 30, String(gap('calibration', 'qa')));
  for (const n of Object.values(nodes)) assert.ok(n.x >= 56 && n.x <= 304 && n.y >= 19 && n.y <= 221, n.id);
});

// --- Shrinkage: planned and unplanned (user decision) ---
test('shrinkage is split into planned and unplanned time', () => {
  const ko = captions('coaching', 'ko').find((c) => c.includes('Shrinkage'));
  for (const w of ['모든 시간', 'Planned Shrinkage', 'Unplanned Shrinkage', '휴식', '교육', '회의', '결근', '지각', '병가']) assert.ok(ko.includes(w), w);
  const en = captions('coaching', 'en').find((c) => c.includes('Shrinkage'));
  for (const w of ['all time', 'planned shrinkage', 'unplanned shrinkage', 'breaks', 'training', 'meetings', 'absence', 'lateness', 'sick leave']) assert.ok(en.includes(w), w);
});

// --- aligning with the BPO Operation Codex (buddy, escalation, SME, mentorship) ---
test('Codex additions are common steps in lessons 2, 3 and 6', () => {
  const ko = (id) => commonCaptions(id, 'ko').join(' ');
  const en = (id) => commonCaptions(id, 'en').join(' ');
  for (const w of ['버디(Buddy)', '1:1로 만나']) assert.ok(ko('onboarding').includes(w), w);
  for (const w of ['에스컬레이션입니다', '논쟁하지 않고', '사실대로 기록']) assert.ok(ko('nesting').includes(w), w);
  for (const w of ['SME(Subject Matter Expert)', '지식 허브', '멘토십 프로그램']) assert.ok(ko('career').includes(w), w);
  for (const w of ['buddy', 'one-on-one']) assert.ok(en('onboarding').includes(w), w);
  for (const w of ['escalation', 'do not argue', 'factually']) assert.ok(en('nesting').includes(w), w);
  for (const w of ['SME (Subject Matter Expert)', 'knowledge hub', 'mentorship program']) assert.ok(en('career').includes(w), w);
});

test('lessons 2, 3 and 6 show 11 steps on each track', () => {
  for (const [id, count] of [['onboarding', 11], ['nesting', 12], ['career', 11]]) {
    for (const track of ['general', 'tech']) assert.equal(visibleSteps(byId(id), track).length, count, `${id} ${track}`);
  }
  assert.deepEqual(validateCourse(LESSONS, { requireEnglish: true, requireTracks: true }), []);
});

// --- OJT comes before nesting in lesson 3 (user decision) ---
test('lesson 3 runs training -> OJT -> nesting', () => {
  assert.ok(hasNode('nesting', 'ojt'));
  const ko = commonCaptions('nesting', 'ko');
  const en = commonCaptions('nesting', 'en');
  const iOjt = ko.findIndex((c) => c.includes('OJT(직무교육)'));
  const iNest = ko.findIndex((c) => c.includes('이것이 네스팅입니다'));
  assert.ok(iOjt === 1 && iNest === 2, `${iOjt} ${iNest}`);
  for (const w of ['Trainer와 SME가 참관', '채널별']) assert.ok(ko[1].includes(w), w);
  assert.ok(ko[0].includes('실제 고객의 문의'));
  assert.ok(ko[2].startsWith('OJT를 마쳐도 곧바로 정식 팀에 넣지 않습니다.'));
  assert.ok(ko[3].startsWith('네스팅에서 받은 콜입니다.'));
  assert.ok(en[1].includes('OJT (on-the-job training)') && en[1].includes('observing'));
  assert.ok(en[2].startsWith('Even after OJT'));
  assert.ok(byId('nesting').diagram.edges.some((e) => e.from === 'grad' && e.to === 'ojt'));
  assert.ok(byId('nesting').diagram.edges.some((e) => e.from === 'ojt' && e.to === 'nest'));
});

test('lesson 2 hands over to OJT and nesting; lesson 3 subtitle speaks of inquiries', () => {
  assert.ok(byId('onboarding').connection.text.ko.includes('다음 단계인 OJT와 네스팅은 그 순간을 혼자 두지 않기 위한 장치입니다.'));
  assert.ok(byId('onboarding').connection.text.en.includes('OJT and nesting'));
  assert.equal(byId('nesting').subtitle.ko, '처음 실제 문의를 받는 적응기. 가장 많이 떠나는 시기입니다.');
  assert.ok(byId('nesting').subtitle.en.includes('real contacts'));
});

// ---------- 2026-11-20: a second track question per stage ----------
test('every lifecycle stage shows the common question plus two questions for each track', async () => {
  const { visibleQuestions } = await import('../js/engine/track.js');
  for (const l of LESSONS) {
    for (const track of ['general', 'tech']) {
      const ids = visibleQuestions(l, track).map((q) => q.id);
      assert.deepEqual(ids, [`${l.id}-q1`, `${l.id}-${track}`, `${l.id}-${track}-2`], `${l.id} ${track}`);
    }
  }
});

test('the new track questions are the approved wording, answers spread over a, b and c', async () => {
  const { readFileSync } = await import('node:fs');
  const doc = readFileSync(new URL('../../docs/superpowers/specs/2026-11-20-lifecycle-track-questions.md', import.meta.url), 'utf8');
  const rows = [...doc.matchAll(/^\| ([a-z]+-(?:general|tech)-2)\.(prompt|a|b|c|answer|explanation) \| (.+?) \| (.+?) \|$/gm)]
    .map(([, id, field, ko, en]) => ({ id, field, ko: ko.replace(/\\\|/g, '|'), en: en.replace(/\\\|/g, '|') }));
  assert.equal(rows.length, 12 * 6);
  const answers = new Set();
  for (const { id, field, ko, en } of rows) {
    const q = LESSONS.flatMap((l) => l.checkpoint).find((x) => x.id === id);
    assert.ok(q, id);
    if (field === 'answer') { assert.equal(q.answer, ko, id); answers.add(ko); continue; }
    const text = field === 'prompt' ? q.prompt : field === 'explanation' ? q.explanation : q.options.find((o) => o.id === field).text;
    assert.deepEqual(text, { ko, en }, `${id}.${field}`);
  }
  assert.deepEqual([...answers].sort(), ['a', 'b', 'c']);
});

// ---------- 2026-11-20: feedback for each wrong option ----------
test('every wrong option has its own approved one-sentence feedback; right answers have none', async () => {
  const { readFileSync } = await import('node:fs');
  const doc = readFileSync(new URL('../../docs/superpowers/specs/2026-11-20-lifecycle-wrong-feedback.md', import.meta.url), 'utf8');
  const rows = new Map([...doc.matchAll(/^\| ([a-z0-9-]+)\.([abc]) \| (.+?) \| (.+?) \|$/gm)].map(([, q, o, ko, en]) => [`${q}.${o}`, { ko, en }]));
  assert.equal(rows.size, 60);
  for (const q of LESSONS.flatMap((l) => l.checkpoint)) {
    for (const o of q.options) {
      if (o.id === q.answer) { assert.equal(o.feedback, undefined, `${q.id}.${o.id}`); continue; }
      assert.deepEqual(o.feedback, rows.get(`${q.id}.${o.id}`), `${q.id}.${o.id}`);
      assert.ok(!/[가-힣]/.test(o.feedback.en), `${q.id}.${o.id}`);
      assert.equal((o.feedback.ko.match(/[.!?](\s|$)/g) ?? []).length, 1, `one sentence: ${q.id}.${o.id}`);
    }
  }
});
