import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fakeStorage, throwingStorage } from './helpers.js';
import {
  PRACTICE_KEY, BADGE_IDS, loadState, saveState, pool, ensureToday, recordAnswer,
  isWeekday, streak, openTerms, todayCards, markCard, checkBadges,
} from '../../practice/engine.js';

const LIFE = 'agent-lifecycle-course:v1';
const SOP = 'sop-library:v1';
const TRACK = 'agent-lifecycle-course:track';
const ALL_LIFE = ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'];
const ALL_SOP = ['escalation', 'scrubbing', 'nurture', 'coaching', 'pip', 'calibration', 'onboarding', 'incident', 'launch'];

function store({ life = [], sop = [], track } = {}) {
  const s = fakeStorage();
  s.setItem(LIFE, JSON.stringify({ completed: life }));
  s.setItem(SOP, JSON.stringify({ completed: sop }));
  if (track) s.setItem(TRACK, track);
  return s;
}
const empty = () => loadState(fakeStorage());
const answerAll = (state, p, date, right = true) => {
  let st = ensureToday(state, p, date);
  const got = [];
  for (const key of st.today.ids) {
    const q = p.find((x) => x.key === key);
    const opt = right ? q.answer : q.options.find((o) => o.id !== q.answer).id;
    const r = recordAnswer(st, key, opt, right, date);
    st = r.state;
    got.push(...r.newBadges);
  }
  return { state: st, badges: got };
};

test('pool: only finished lessons, current track, keys prefixed by course', () => {
  const tech = pool(store({ life: ['hiring'], track: 'tech' }));
  assert.deepEqual(tech.map((q) => q.key).sort(), ['lifecycle:hiring-q1', 'lifecycle:hiring-tech', 'lifecycle:hiring-tech-2']);
  assert.ok(tech.every((q) => q.course === 'lifecycle' && q.lessonId === 'hiring' && q.lessonOrder === 1));
  const general = pool(store({ life: ['hiring'] }));
  assert.deepEqual(general.map((q) => q.key).sort(), ['lifecycle:hiring-general', 'lifecycle:hiring-general-2', 'lifecycle:hiring-q1']);
  const both = pool(store({ life: ['coaching'], sop: ['coaching'] }));
  const keys = both.map((q) => q.key);
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(keys.includes('lifecycle:coaching-q1') && keys.includes('sop:coaching-q1') && keys.includes('sop:coaching-q2'));
  assert.equal(pool(store()).length, 0);
  assert.equal(pool(throwingStorage).length, 0);
  assert.equal(pool(store({ life: ALL_LIFE, sop: ALL_SOP })).length, 36, '6 lessons x 3 on one track + 9 SOP x 2');
  assert.ok(pool(store({ sop: ['scrubbing'] })).map((q) => q.key ?? q.id).join(' ').includes('scrubbing-q2'));
});

test('ensureToday picks once a day: missed first, then unseen, then oldest', () => {
  const p = pool(store({ life: ALL_LIFE, sop: ALL_SOP }));
  const st = empty();
  st.questions['sop:pip-q2'] = { last: '2026-11-10', missed: true };
  st.questions['lifecycle:hiring-q1'] = { last: '2026-11-01', missed: false };
  const a = ensureToday(st, p, '2026-11-20');
  assert.equal(a.today.date, '2026-11-20');
  assert.equal(a.today.ids.length, 3);
  assert.equal(a.today.ids[0], 'sop:pip-q2');
  assert.ok(!a.today.ids.includes('lifecycle:hiring-q1'), 'unseen questions come before seen ones');
  assert.deepEqual(ensureToday(a, p, '2026-11-20').today, a.today, 'same day, same set');
  const b = ensureToday(a, p, '2026-11-23');
  assert.equal(b.today.date, '2026-11-23');
  assert.deepEqual(b.today.answers, {});
  // once everything has been seen, the oldest comes back first
  const seen = empty();
  p.forEach((q, i) => { seen.questions[q.key] = { last: `2026-10-${String(10 + i).padStart(2, '0')}`, missed: false }; });
  assert.equal(ensureToday(seen, p, '2026-11-20').today.ids[0], p[0].key);
});

test('ensureToday with 2 open questions picks 2, and none when nothing is open', () => {
  // One SOP lesson has two questions.
  const p = pool(store({ sop: ['pip'] }));
  assert.equal(ensureToday(empty(), p, '2026-11-20').today.ids.length, 2);
  assert.equal(ensureToday(empty(), [], '2026-11-20').today, null);
});

test('recordAnswer counts the day only when every question is answered, ignores foreign keys', () => {
  const p = pool(store({ life: ALL_LIFE }));
  let st = ensureToday(empty(), p, '2026-11-20');
  const [k1, k2, k3] = st.today.ids;
  const right = (k) => p.find((q) => q.key === k).answer;
  st = recordAnswer(st, 'sop:nope-q1', 'a', true, '2026-11-20').state;
  assert.deepEqual(st.today.answers, {});
  st = recordAnswer(st, k1, right(k1), true, '2026-11-20').state;
  st = recordAnswer(st, k1, 'zzz', false, '2026-11-20').state;
  assert.equal(st.today.answers[k1], right(k1), 'one answer per question');
  st = recordAnswer(st, k2, 'zzz', false, '2026-11-20').state;
  assert.deepEqual(st.days, []);
  assert.deepEqual(st.questions[k2], { last: '2026-11-20', missed: true });
  // a page left open past midnight still answers the set it was picked for
  st = recordAnswer(st, k3, right(k3), true, '2026-11-21').state;
  assert.deepEqual(st.days, ['2026-11-20']);
});

test('streak counts weekdays only', () => {
  assert.equal(isWeekday('2026-11-20'), true);
  assert.equal(isWeekday('2026-11-21'), false);
  const week = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20'];
  assert.deepEqual(streak(week, '2026-11-23'), { count: 5, pending: true, weekend: false });
  assert.deepEqual(streak(week, '2026-11-21'), { count: 5, pending: false, weekend: true });
  assert.deepEqual(streak(week, '2026-11-20'), { count: 5, pending: false, weekend: false });
  assert.deepEqual(streak([...week, '2026-11-23'], '2026-11-23'), { count: 6, pending: false, weekend: false });
  assert.equal(streak(['2026-11-16', '2026-11-17', '2026-11-19', '2026-11-20'], '2026-11-20').count, 2, 'a missed Wednesday breaks it');
  assert.equal(streak(['2026-11-20', '2026-11-21', '2026-11-22'], '2026-11-23').count, 1, 'weekend practice is not counted');
  assert.equal(streak(['2026-11-19'], '2026-11-23').count, 0, 'Friday missed');
  assert.equal(streak(['2026-12-31', '2027-01-01'], '2027-01-04').count, 2, 'across the year end');
  assert.equal(streak([], '2026-11-20').count, 0);
});

test('badges: each of the ten, never twice', () => {
  assert.deepEqual(BADGE_IDS, ['first', 'streak3', 'week', 'month', 'perfect', 'comeback', 'terms', 'lifecycle', 'sop', 'excel']);
  const p = pool(store({ life: ALL_LIFE }));
  const r1 = answerAll(empty(), p, '2026-11-16');
  assert.deepEqual(r1.badges.sort(), ['first', 'perfect']);
  const wrong = answerAll(empty(), p, '2026-11-16', false);
  assert.deepEqual(wrong.badges, ['first']);
  // comeback: a missed question answered right later
  let st = wrong.state;
  const missed = st.today.ids[0];
  st = ensureToday(st, p, '2026-11-17');
  assert.ok(st.today.ids.includes(missed));
  const q = p.find((x) => x.key === missed);
  assert.ok(recordAnswer(st, missed, q.answer, true, '2026-11-17').newBadges.includes('comeback'));
  // streak badges
  const days = (n) => {
    const out = [];
    for (let d = new Date(Date.UTC(2026, 0, 5)); out.length < n; d.setUTCDate(d.getUTCDate() + 1)) {
      const s = d.toISOString().slice(0, 10);
      if (isWeekday(s)) out.push(s);
    }
    return out;
  };
  const ctx = (list) => ({ today: list.at(-1) });
  for (const [n, id] of [[3, 'streak3'], [5, 'week'], [20, 'month']]) {
    const s = { ...empty(), days: days(n) };
    assert.ok(checkBadges(s, ctx(s.days)).includes(id), id);
    const before = { ...empty(), days: days(n - 1) };
    assert.ok(!checkBadges(before, ctx(before.days)).includes(id), `${id} not early`);
  }
  // perfect needs three questions
  const two = answerAll(empty(), pool(store({ sop: ['pip'] })), '2026-11-16');
  assert.ok(!two.badges.includes('perfect'));
  // terms, lifecycle, sop
  assert.ok(checkBadges(empty(), { today: '2026-11-20', openTermCount: 10, allTermsKnown: true }).includes('terms'));
  assert.ok(!checkBadges(empty(), { today: '2026-11-20', openTermCount: 9, allTermsKnown: true }).includes('terms'));
  assert.deepEqual(checkBadges(empty(), { today: '2026-11-20', lifecycleDone: true, sopDone: true }).sort(), ['lifecycle', 'sop']);
  assert.deepEqual(checkBadges(empty(), { today: '2026-11-20', excelDone: true }), ['excel']);
  const has = { ...empty(), badges: { lifecycle: '2026-11-01' } };
  assert.deepEqual(checkBadges(has, { today: '2026-11-20', lifecycleDone: true }), []);
});

test('cards: open by lesson, unlinked terms after any lesson, deck order, max 5', () => {
  assert.equal(openTerms(store()).length, 0);
  const afterSop = openTerms(store({ sop: ['pip'] }));
  assert.ok(afterSop.length >= 17 && afterSop.every((t) => t.seen.length === 0));
  const hiring = openTerms(store({ life: ['hiring'] }));
  assert.ok(hiring.some((t) => t.seen.includes('hiring')));
  assert.ok(!hiring.some((t) => t.seen.length && !t.seen.includes('hiring')));
  const terms = openTerms(store({ life: ALL_LIFE }));
  assert.equal(terms.length, 49);
  let st = empty();
  st.cards[terms[0].id] = { known: true, last: '2026-11-01' };
  st.cards[terms[1].id] = { known: false, last: '2026-11-19' };
  const deck = todayCards(st, terms, '2026-11-20');
  assert.equal(deck.length, 5);
  assert.equal(deck[0].id, terms[1].id, 'show-again first');
  assert.ok(!deck.some((t) => t.id === terms[0].id), 'known cards come after unseen ones');
  const r = markCard(st, terms[1].id, true, '2026-11-20');
  assert.deepEqual(r.state.cards[terms[1].id], { known: true, last: '2026-11-20' });
  const again = markCard(st, deck[1].id, false, '2026-11-20').state;
  const left = todayCards(again, terms, '2026-11-20');
  assert.equal(left.length, 4, 'a card handled today leaves the deck, even "show me again"');
  assert.ok(!left.some((t) => t.id === deck[1].id));
  // all known, oldest first
  st = empty();
  terms.forEach((t, i) => { st.cards[t.id] = { known: true, last: `2026-${String(1 + (i % 9)).padStart(2, '0')}-01` }; });
  assert.equal(st.cards[todayCards(st, terms, '2026-11-20')[0].id].last, '2026-01-01');
});

test('loadState survives junk and saveState survives blocked storage', () => {
  for (const raw of ['[]', '{"days":5}', 'not json', '{"today":{"date":1}}', null]) {
    const s = fakeStorage(raw == null ? {} : { [PRACTICE_KEY]: raw });
    const st = loadState(s);
    assert.ok(Array.isArray(st.days) && st.today === null && typeof st.questions === 'object' && typeof st.cards === 'object' && typeof st.badges === 'object', String(raw));
  }
  assert.deepEqual(loadState(throwingStorage).days, []);
  assert.doesNotThrow(() => saveState(throwingStorage, empty()));
  const p = pool(store({ life: ALL_LIFE }));
  const half = ensureToday(empty(), p, '2026-11-20');
  const k = half.today.ids[0];
  const saved = fakeStorage();
  saveState(saved, recordAnswer(half, k, 'zzz', false, '2026-11-20').state);
  assert.equal(loadState(saved).today.results[k], false, 'right/wrong survives a reload');
  const s = fakeStorage();
  const st = { ...empty(), days: ['2026-11-20'] };
  saveState(s, st);
  assert.deepEqual(loadState(s).days, ['2026-11-20']);
});

test('today\'s set survives a track switch and drops questions that are gone', () => {
  const s = store({ life: ['onboarding'] });
  const st = ensureToday(empty(), pool(s), '2026-11-20');
  assert.ok(st.today.ids.includes('lifecycle:onboarding-general'));
  s.setItem(TRACK, 'tech');
  const kept = ensureToday(st, pool(s), '2026-11-20', pool(s, { allTracks: true }));
  assert.deepEqual(kept.today.ids, st.today.ids, 'same day, same set, even after a track switch');
  const valid = st.today.ids[0];
  const mixed = { ...st, today: { date: '2026-11-20', ids: ['lifecycle:gone-q9', valid], answers: {} } };
  assert.deepEqual(ensureToday(mixed, pool(s), '2026-11-20', pool(s, { allTracks: true })).today.ids, [valid]);
  const gone = { ...st, today: { date: '2026-11-20', ids: ['lifecycle:gone-q9'], answers: {} } };
  const fresh = ensureToday(gone, pool(s), '2026-11-20', pool(s, { allTracks: true }));
  assert.ok(fresh.today.ids.length > 0 && !fresh.today.ids.includes('lifecycle:gone-q9'), 'nothing left: pick again');
  const blankSet = { ...st, today: { date: '2026-11-20', ids: [], answers: {} } };
  assert.ok(ensureToday(blankSet, pool(s), '2026-11-20').today.ids.length > 0, 'an empty saved set is no set');
});

test('course facts know when all 11 Excel lessons are done', async () => {
  const { courseFacts } = await import('../../practice/engine.js');
  const s = fakeStorage();
  const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ids.slice(0, 10), scores: {} }));
  assert.equal(courseFacts(s, empty(), []).excelDone, false);
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ids, scores: {} }));
  assert.equal(courseFacts(s, empty(), []).excelDone, true);
  s.setItem('excel-practice:v1', 'junk');
  assert.equal(courseFacts(s, empty(), []).excelDone, false);
});

test('finished Excel lessons add their choice and blank questions, shuffled and graded by id', async () => {
  const { EXCEL_LESSONS } = await import('../../excel/data.js');
  const s = store();
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['1', '4'], scores: {} }));
  const p = pool(s);
  const keys = p.map((q) => q.key).sort();
  assert.deepEqual(keys, ['excel:1-1', 'excel:1-2', 'excel:1-3', 'excel:1-4', 'excel:4-1', 'excel:4-2', 'excel:4-3', 'excel:4-4']);
  const all = EXCEL_LESSONS.flatMap((l) => l.questions);
  let answerFirst = 0;
  for (const q of p) {
    const src = all.find((x) => `excel:${x.id}` === q.key);
    assert.equal(q.course, 'excel');
    assert.equal(q.lessonId, src.id.split('-')[0]);
    const right = q.options.find((o) => o.id === q.answer);
    assert.deepEqual(right.text, (src.options ?? src.chips)[src.answer]);
    if (q.options[0].id === q.answer) answerFirst += 1;
    if (src.type === 'blank') assert.deepEqual(q.template, src.template);
    else assert.equal(q.template, undefined);
  }
  assert.ok(answerFirst < p.length, 'the answer is not always shown first');
  s.setItem('excel-practice:v1', 'junk');
  assert.equal(pool(s).filter((q) => q.course === 'excel').length, 0);
});

test('finishing an Excel lesson also counts as "any lesson" for the unlinked terms', () => {
  const s = store();
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['1'], scores: {} }));
  const terms = openTerms(s);
  assert.ok(terms.length >= 17 && terms.every((t) => t.seen.length === 0));
});
