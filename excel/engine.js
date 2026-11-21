// Miso's Excel practice: grading, card building, cell picking, the "after"
// views for sort/filter/pivot/colour questions, and saved progress.
// No DOM here.
import { evaluate } from './formula.js';
import { SHEETS, EXCEL_LESSONS } from './data.js';
import { EXCEL_ADVANCED } from './advanced.js';

export const PROGRESS_KEY = 'excel-practice:v1';
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const same = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : a === b);

// ---- grading -----------------------------------------------------------------

const run = (texts, lang, sheet = SHEETS[lang]) => evaluate(`=${texts.join(' ')}`, sheet);

// A few copies of the example table with the numbers changed. A learner's
// formula must agree with the answer on all of them, so a rearrangement that
// only matches by luck on the real table (an IF that always says "달성")
// grades wrong, while a true rewrite still counts.
const variantCache = {};
function variants(lang) {
  if (variantCache[lang]) return variantCache[lang];
  const out = [];
  for (let k = 1; k <= 4; k += 1) {
    const cells = { ...SHEETS[lang].cells };
    for (const [addr, v] of Object.entries(cells)) {
      if (typeof v !== 'number' || addr.endsWith('1') && addr.length === 2) continue;
      const f = 0.4 + ((hash(`${k}|${addr}`) % 1000) / 1000) * 1.2;
      cells[addr] = Math.max(1, Math.round(v * f));
    }
    out.push({ ...SHEETS[lang], cells });
  }
  variantCache[lang] = out;
  return out;
}
const agreesEverywhere = (answer, want, lang) => variants(lang).every((sheet) => {
  const w = run(want, lang, sheet);
  if (!w.ok) return true;
  const a = run(answer, lang, sheet);
  return a.ok && same(a.value, w.value);
});

function stepsMatch(q, picked, lang) {
  const want = q.steps[lang];
  if (!Array.isArray(picked) || picked.length !== want.length) return false;
  const loose = new Set(q.anyOrder.flat());
  for (let i = 0; i < want.length; i += 1) if (!loose.has(i) && picked[i] !== want[i]) return false;
  return q.anyOrder.every((group) => {
    const a = group.map((i) => picked[i]).sort();
    const b = group.map((i) => want[i]).sort();
    return a.every((x, i) => x === b[i]);
  });
}

const sameCards = (a, b) => a.length === b.length && [...a].sort().every((x, i) => x === [...b].sort()[i]);

// answer: choice/blank → option or chip index; build → card texts in order;
// cell → 'E9' or 'C2:C9'; steps → step texts in order.
export function grade(q, answer, lang) {
  switch (q.type) {
    case 'choice':
      return { correct: answer === q.answer };
    case 'blank': {
      if (!q.result) return { correct: answer === q.answer };
      const chip = q.chips[answer]?.[lang];
      if (chip === undefined) return { correct: false };
      const r = evaluate(q.template[lang].replace('___', chip), SHEETS[lang]);
      const want = evaluate(q.template[lang].replace('___', q.chips[q.answer][lang]), SHEETS[lang]);
      return r.ok ? { correct: want.ok && same(r.value, want.value), value: r.value, cells: r.cells } : { correct: false };
    }
    case 'build': {
      if (!Array.isArray(answer) || !answer.length) return { correct: false };
      const r = run(answer, lang);
      const want = run(q.cards[lang], lang);
      // The value alone isn't enough: an IF's result is one of its own cards.
      // Every answer card must be used; their order may differ.
      // Advanced builds (nested functions) grade by order: the example table
      // can't tell every misplaced card apart, so only the answer and its listed
      // true rewrites count.
      if (q.exact) {
        const key = (cards) => cards.join('\u0001');
        const okOrders = [q.cards[lang], ...(q.alternatives?.[lang] ?? [])].map(key);
        return r.ok ? { correct: okOrders.includes(key(answer)), value: r.value, cells: r.cells } : { correct: false };
      }
      const correct = r.ok && want.ok && same(r.value, want.value) && sameCards(answer, q.cards[lang])
        && agreesEverywhere(answer, q.cards[lang], lang);
      return r.ok ? { correct, value: r.value, cells: r.cells } : { correct: false };
    }
    case 'cell':
      return { correct: answer === q.answer };
    case 'steps':
      return { correct: stepsMatch(q, answer, lang) };
    default:
      return { correct: false };
  }
}

// ---- building (cards for formulas, and step cards) ------------------------------

function hash(text) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function newBuild(q, lang, seed = '') {
  const texts = q.type === 'steps' ? [...q.steps[lang], ...q.decoys[lang]] : [...q.cards[lang], ...q.decoys[lang]];
  const bank = texts.map((text, id) => ({ id, text }));
  let h = hash(`${q.id}|${seed}`);
  for (let i = bank.length - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [bank[i], bank[j]] = [bank[j], bank[i]];
  }
  return { bank, line: [] };
}

// The order options or chips are shown in: shuffled by the question id, so
// the right answer isn't always first, and it is the same on every visit.
export function displayOrder(q) {
  const n = (q.options ?? q.chips).length;
  const order = [...Array(n).keys()];
  let h = hash(`order|${q.id}`);
  for (let i = n - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function tapBank(state, pos) {
  const card = state.bank[pos];
  if (!card || state.line.includes(card.id)) return state;
  return { bank: state.bank, line: [...state.line, card.id] };
}

export function tapLine(state, pos) {
  if (pos < 0 || pos >= state.line.length) return state;
  return { bank: state.bank, line: state.line.filter((_, i) => i !== pos) };
}

export const lineTexts = (state) => state.line.map((id) => state.bank.find((c) => c.id === id).text);

// ---- picking cells ---------------------------------------------------------------

export function pickCell(sel, addr) {
  if (!sel || sel.end) return { start: addr, end: null };
  return { start: sel.start, end: addr };
}

const split = (a) => /^([A-Z]+)(\d+)$/.exec(a).slice(1);
export function selectionText(sel) {
  if (!sel) return '';
  if (!sel.end || sel.end === sel.start) return sel.start;
  const [c1, r1] = split(sel.start);
  const [c2, r2] = split(sel.end);
  const cols = [c1, c2].sort();
  const rows = [Number(r1), Number(r2)].sort((a, b) => a - b);
  return `${cols[0]}${rows[0]}:${cols[1]}${rows[1]}`;
}

// ---- "after" views ------------------------------------------------------------------

const DATA_ROWS = [2, 3, 4, 5, 6, 7, 8, 9];

// { rows: row numbers in display order, highlight: addresses } or { pivot }.
export function applyAfter(sheet, after, lang) {
  const v = (col, r) => sheet.cells[`${col}${r}`];
  if (after.sort) {
    const rows = [...DATA_ROWS].sort((a, b) => (after.desc ? v(after.sort, b) - v(after.sort, a) : v(after.sort, a) - v(after.sort, b)));
    return { rows, highlight: [] };
  }
  if (after.filter) {
    const keep = after.filter.keep[lang];
    return { rows: DATA_ROWS.filter((r) => v(after.filter.col, r) === keep), highlight: [] };
  }
  if (after.highlight) {
    const h = after.highlight;
    const hit = DATA_ROWS.filter((r) => (h.ltCol ? v(h.col, r) < v(h.ltCol, r) : v(h.col, r) < h.lt));
    return { rows: DATA_ROWS, highlight: hit.map((r) => `${h.col}${r}`) };
  }
  if (after.pivot) {
    const p = after.pivot;
    const groups = [];
    for (const r of DATA_ROWS) {
      const key = v(p.rows, r);
      let g = groups.find((x) => x[0] === key);
      if (!g) { g = [key, 0]; groups.push(g); }
      g[1] += p.fn === 'sum' ? v(p.value, r) : 1;
    }
    groups.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    const total = groups.reduce((s, g) => s + g[1], 0);
    return { pivot: { head: p.head[lang], rows: groups, total: [p.total[lang], total] } };
  }
  return { rows: DATA_ROWS, highlight: [] };
}

// ---- progress -----------------------------------------------------------------------

// The basic lessons open one after another; an advanced lesson opens once
// the basic lessons it mixes are finished.
const BASIC_IDS = EXCEL_LESSONS.map((l) => l.id);
const LESSON_IDS = [...BASIC_IDS, ...EXCEL_ADVANCED.map((l) => l.id)];

export function loadProgress(storage) {
  const empty = { completed: [], scores: {} };
  let raw;
  try {
    raw = JSON.parse(storage.getItem(PROGRESS_KEY));
  } catch {
    return empty;
  }
  if (!isObj(raw)) return empty;
  const completed = Array.isArray(raw.completed) ? raw.completed.filter((id) => LESSON_IDS.includes(id)) : [];
  const scores = {};
  if (isObj(raw.scores)) {
    for (const [id, n] of Object.entries(raw.scores)) {
      if (LESSON_IDS.includes(id) && Number.isInteger(n) && n >= 0 && n <= 6) scores[id] = n;
    }
  }
  return { completed: [...new Set(completed)], scores };
}

export function saveProgress(storage, progress) {
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch { /* progress just won't persist */ }
}

export function finishLesson(progress, id, firstTryRight) {
  const completed = progress.completed.includes(id) ? progress.completed : [...progress.completed, id];
  const best = Math.max(progress.scores[id] ?? 0, firstTryRight);
  return { completed, scores: { ...progress.scores, [id]: best } };
}

export function isOpen(progress, id) {
  const advanced = EXCEL_ADVANCED.find((l) => l.id === id);
  if (advanced) return advanced.requires.every((need) => progress.completed.includes(need));
  const i = BASIC_IDS.indexOf(id);
  return i === 0 || (i > 0 && progress.completed.includes(BASIC_IDS[i - 1]));
}

// Where "next lesson" goes after finishing one: the next basic lesson; after
// the last basic one or an advanced one, the next advanced lesson that is open
// and not yet done, going round to the start of the advanced list if needed.
export function nextLessonAfter(progress, id) {
  const basic = BASIC_IDS.indexOf(id);
  if (basic >= 0 && basic < BASIC_IDS.length - 1) return BASIC_IDS[basic + 1];
  const adv = EXCEL_ADVANCED.map((l) => l.id);
  const at = adv.indexOf(id);
  const order = at < 0 ? adv : [...adv.slice(at + 1), ...adv.slice(0, at)];
  return order.find((a) => !progress.completed.includes(a) && isOpen(progress, a)) ?? null;
}
