// Today's practice: which questions are open, today's set, the weekday
// streak, term cards and badges. No DOM here; storage and today's date
// ('YYYY-MM-DD', the phone's local date) are passed in.
import { loadProgress } from '../agent-lifecycle/js/engine/progress.js';
import { loadTrack, visibleQuestions } from '../agent-lifecycle/js/engine/track.js';
import { LESSONS } from '../agent-lifecycle/js/lessons/index.js';
import { SOP_LESSONS } from '../sop-library/lessons/index.js';
import { SME_LESSONS } from '../sme/lessons/index.js';
import { SME_PROGRESS_KEY as SME_KEY } from '../sme/ui.js';
import { SL_LESSONS } from '../sme-lifecycle/lessons/index.js';
import { SL_PROGRESS_KEY as SL_KEY } from '../sme-lifecycle/ui.js';
import { SS_LESSONS } from '../sme-sop/lessons/index.js';
import { SS_PROGRESS_KEY as SS_KEY } from '../sme-sop/ui.js';
import { loadReview } from '../review/engine.js';
import { loadRole, showsAdvancedExcel } from '../shared/role.js';
import { TERMS } from '../glossary/terms.js';
import { EXCEL_LESSONS } from '../excel/data.js';
import { EXCEL_ADVANCED } from '../excel/advanced.js';
import { loadProgress as loadExcelProgress, displayOrder } from '../excel/engine.js';
import { EXCEL_FEEDBACK } from '../excel/feedback.js';

export const PRACTICE_KEY = 'kb-practice:v1';
export const BADGE_IDS = ['first', 'streak3', 'week', 'month', 'perfect', 'comeback', 'terms', 'lifecycle', 'sop', 'excel', 'review-tl', 'review-sme'];
const LIFE_KEY = 'agent-lifecycle-course:v1';
const SOP_KEY = 'sop-library:v1';
const PER_DAY = 3;
const CARDS_PER_DAY = 5;

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const blank = () => ({ days: [], today: null, questions: {}, cards: {}, badges: {} });
const isDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

// ---- state ---------------------------------------------------------------

export function loadState(storage) {
  let raw = null;
  try {
    raw = JSON.parse(storage.getItem(PRACTICE_KEY));
  } catch { /* empty state */ }
  const st = blank();
  if (!isObj(raw)) return st;
  if (Array.isArray(raw.days)) st.days = [...new Set(raw.days.filter(isDate))].sort();
  const t = raw.today;
  if (isObj(t) && isDate(t.date) && Array.isArray(t.ids) && t.ids.every((x) => typeof x === 'string')) {
    st.today = { date: t.date, ids: [...t.ids], answers: isObj(t.answers) ? { ...t.answers } : {} };
    if (isObj(t.results)) st.today.results = { ...t.results };
  }
  for (const k of ['questions', 'cards', 'badges']) if (isObj(raw[k])) st[k] = { ...raw[k] };
  return st;
}

export function saveState(storage, state) {
  try {
    storage.setItem(PRACTICE_KEY, JSON.stringify(state));
  } catch { /* practice just won't persist */ }
}

const clone = (st) => ({
  days: [...st.days],
  today: st.today && { ...st.today, ids: [...st.today.ids], answers: { ...st.today.answers }, results: { ...(st.today.results ?? {}) } },
  questions: { ...st.questions },
  cards: { ...st.cards },
  badges: { ...st.badges },
});

function finished(storage, key) {
  if (!storage) return [];
  return loadProgress(storage, key).completed;
}

// ---- questions -----------------------------------------------------------

// Open questions. allTracks: every track, used to look up today's set so a
// track switch mid-day doesn't lose questions already picked.
export function pool(storage, { allTracks = false } = {}) {
  const lifeDone = finished(storage, LIFE_KEY);
  const sopDone = finished(storage, SOP_KEY);
  let track = 'general';
  try { if (storage) track = loadTrack(storage); } catch { /* default */ }
  const from = (course, lessons, done, questionsOf) => lessons
    .filter((l) => done.includes(l.id))
    .sort((a, b) => a.order - b.order)
    .flatMap((l) => questionsOf(l).map((q) => ({
      key: `${course}:${q.id}`, course, lessonId: l.id, lessonOrder: l.order,
      prompt: q.prompt, options: q.options, answer: q.answer, explanation: q.explanation,
    })));
  return [
    ...from('lifecycle', LESSONS, lifeDone, (l) => (allTracks ? l.checkpoint : visibleQuestions(l, track))),
    ...from('sop', SOP_LESSONS, sopDone, (l) => l.checkpoint),
    ...from('sme', SME_LESSONS, finished(storage, SME_KEY), (l) => l.checkpoint),
    ...from('sme-lifecycle', SL_LESSONS, finished(storage, SL_KEY), (l) => l.checkpoint),
    ...from('sme-sop', SS_LESSONS, finished(storage, SS_KEY), (l) => l.checkpoint),
    ...excelQuestions(storage),
  ];
}

// Finished Excel lessons, basic and advanced, add their choice and blank questions. Options are
// shown in the Excel lesson's shuffled order and keep their own index as id.
function excelQuestions(storage) {
  if (!storage) return [];
  const done = loadExcelProgress(storage).completed;
  // SMEs are not asked advanced questions; their stored progress stays as it is.
  return [...EXCEL_LESSONS, ...(showsAdvancedExcel(loadRole(storage)) ? EXCEL_ADVANCED : [])]
    .map((l, i) => ({ l, order: i + 1 }))
    .filter(({ l }) => done.includes(l.id))
    .flatMap(({ l, order }) => l.questions
      .filter((q) => q.type === 'choice' || q.type === 'blank')
      .map((q) => ({
        key: `excel:${q.id}`, course: 'excel', lessonId: l.id, lessonOrder: order,
        prompt: q.prompt,
        options: displayOrder(q).map((i) => ({ id: String(i), text: (q.options ?? q.chips)[i], ...(EXCEL_FEEDBACK[q.id]?.[i] ? { feedback: EXCEL_FEEDBACK[q.id][i] } : {}) })),
        answer: String(q.answer),
        explanation: q.explanation,
        ...(q.type === 'blank' ? { template: q.template } : {}),
      })));
}

// A small repeatable shuffle key: the same date and question give the same order.
function seeded(date, key) {
  let h = 2166136261;
  for (const c of `${date}|${key}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

// Today's set: picked once a day from `questions`. A saved set keeps the
// ids still found in `known` (all tracks); if none are left, pick again.
export function ensureToday(state, questions, today, known = questions) {
  if (state.today?.date === today) {
    const keys = new Set(known.map((q) => q.key));
    const ids = state.today.ids.filter((k) => keys.has(k));
    if (ids.length === state.today.ids.length && ids.length) return state;
    if (ids.length) {
      const st = clone(state);
      st.today.ids = ids;
      return st;
    }
  }
  const st = clone(state);
  if (!questions.length) {
    st.today = null;
    return st;
  }
  const rank = (q) => {
    const rec = st.questions[q.key];
    if (rec?.missed) return [0, rec.last ?? ''];
    if (!rec) return [1, ''];
    return [2, rec.last ?? ''];
  };
  const ids = [...questions]
    .sort((a, b) => {
      const [ra, la] = rank(a);
      const [rb, lb] = rank(b);
      if (ra !== rb) return ra - rb;
      if (ra === 2 && la !== lb) return la < lb ? -1 : 1;
      return seeded(today, a.key) - seeded(today, b.key);
    })
    .slice(0, PER_DAY)
    .map((q) => q.key);
  st.today = { date: today, ids, answers: {} };
  return st;
}

export function recordAnswer(state, key, optionId, correct, today) {
  const t = state.today;
  if (!t || !t.ids.includes(key) || key in t.answers) return { state, newBadges: [] };
  const st = clone(state);
  const wasMissed = Boolean(st.questions[key]?.missed);
  st.today.answers[key] = optionId;
  st.today.results = { ...(t.results ?? {}), [key]: Boolean(correct) };
  st.questions[key] = { last: st.today.date, missed: !correct };
  const done = st.today.ids.every((k) => k in st.today.answers);
  if (done && !st.days.includes(st.today.date)) st.days = [...st.days, st.today.date].sort();
  const perfect = done && st.today.ids.length >= PER_DAY && st.today.ids.every((k) => st.today.results[k]);
  const newBadges = checkBadges(st, { today: st.today.date, lastDayPerfect: perfect, comeback: wasMissed && correct });
  for (const b of newBadges) st.badges[b] = today;
  return { state: st, newBadges };
}

// ---- dates and streak ----------------------------------------------------

// The phone's own calendar date, 'YYYY-MM-DD'.
export const localDate = (d = new Date()) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');

const toUtc = (date) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const fromUtc = (d) => d.toISOString().slice(0, 10);
const addDays = (date, n) => {
  const d = toUtc(date);
  d.setUTCDate(d.getUTCDate() + n);
  return fromUtc(d);
};

export function isWeekday(date) {
  const day = toUtc(date).getUTCDay();
  return day >= 1 && day <= 5;
}

const prevWeekday = (date) => {
  let d = addDays(date, -1);
  while (!isWeekday(d)) d = addDays(d, -1);
  return d;
};

export function streak(days, today) {
  const set = new Set(days);
  const weekend = !isWeekday(today);
  const pending = !weekend && !set.has(today);
  let d = weekend || pending ? prevWeekday(today) : today;
  let count = 0;
  while (set.has(d)) {
    count += 1;
    d = prevWeekday(d);
  }
  return { count, pending, weekend };
}

// ---- term cards ----------------------------------------------------------

export function openTerms(storage) {
  const lifeDone = finished(storage, LIFE_KEY);
  const anyDone = lifeDone.length > 0 || finished(storage, SOP_KEY).length > 0 || finished(storage, SME_KEY).length > 0 || finished(storage, SL_KEY).length > 0 || finished(storage, SS_KEY).length > 0
    || (storage ? loadExcelProgress(storage).completed.length > 0 : false);
  if (!anyDone) return [];
  return TERMS.filter((t) => (t.seen.length ? t.seen.some((id) => lifeDone.includes(id)) : true));
}

// Up to five cards a day: show-again first, then new, then the oldest known.
// A card handled today leaves today's deck, so the deck shrinks to zero.
export function todayCards(state, terms, today) {
  const handled = terms.filter((t) => state.cards[t.id]?.last === today).length;
  const rank = (t) => {
    const rec = state.cards[t.id];
    if (rec && !rec.known) return [0, rec.last ?? ''];
    if (!rec) return [1, ''];
    return [2, rec.last ?? ''];
  };
  return terms
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => state.cards[t.id]?.last !== today)
    .sort((a, b) => {
      const [ra, la] = rank(a.t);
      const [rb, lb] = rank(b.t);
      if (ra !== rb) return ra - rb;
      if (la !== lb) return la < lb ? -1 : 1;
      return a.i - b.i;
    })
    .slice(0, Math.max(0, CARDS_PER_DAY - handled))
    .map(({ t }) => t);
}

export function markCard(state, termId, known, today, ctx = {}) {
  const st = clone(state);
  st.cards[termId] = { known: Boolean(known), last: today };
  const newBadges = checkBadges(st, { today, ...ctx });
  for (const b of newBadges) st.badges[b] = today;
  return { state: st, newBadges };
}

// ---- badges --------------------------------------------------------------

// Newly earned badge ids (ones already held are never returned).
export function checkBadges(state, ctx = {}) {
  const earned = [];
  const add = (id, ok) => { if (ok && !state.badges[id]) earned.push(id); };
  const run = ctx.today ? streak(state.days, ctx.today).count : 0;
  add('first', state.days.length >= 1);
  add('streak3', run >= 3);
  add('week', run >= 5);
  add('month', run >= 20);
  add('perfect', ctx.lastDayPerfect);
  add('comeback', ctx.comeback);
  add('terms', ctx.openTermCount >= 10 && ctx.allTermsKnown);
  add('lifecycle', ctx.lifecycleDone);
  add('sop', ctx.sopDone);
  add('excel', ctx.excelDone);
  add('review-tl', ctx.reviewTl);
  add('review-sme', ctx.reviewSme);
  return earned;
}

// Facts the page needs to check the course and card badges.
export function courseFacts(storage, state, terms) {
  const lifeDone = finished(storage, LIFE_KEY);
  const sopDone = finished(storage, SOP_KEY);
  return {
    lifecycleDone: LESSONS.every((l) => lifeDone.includes(l.id)),
    sopDone: SOP_LESSONS.every((l) => sopDone.includes(l.id)),
    excelDone: (() => {
      if (!storage) return false;
      const done = loadExcelProgress(storage).completed;
      return EXCEL_LESSONS.every((l) => done.includes(l.id));
    })(),
    reviewTl: Boolean(storage && loadReview(storage).tl?.passed),
    reviewSme: Boolean(storage && loadReview(storage).sme?.passed),
    openTermCount: terms.length,
    allTermsKnown: terms.length > 0 && terms.every((t) => state.cards[t.id]?.known),
  };
}
