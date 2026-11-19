import { TRACKS, visibleSteps, visibleQuestions } from './track.js';

// Checks lesson data against the course rules, so a content mistake shows up
// as a test failure instead of a broken or off-policy screen.
// Each function returns a list of error messages; an empty list means valid.

const RULES = {
  ko: { example: '예시', persona: '지민' },
  en: { example: 'Example', persona: 'Jimin' },
};
const BANNED_KO = '진상';
const FIGURE = /%|\d\s*(분|명|초|min|people|sec)/; // durations in weeks or days are exempt
const MAX_SENTENCES = 3;
const MIN_STEPS = 6;
const MAX_STEPS = 12; // per track: common steps plus that track's own

const isText = (v) => v !== null && typeof v === 'object';
const filled = (s) => typeof s === 'string' && s.trim() !== '';
const sentenceCount = (s) => (s.match(/[.?!](?=\s|$)/g) || []).length;

// Options: `figure` replaces the pattern that marks a figure needing an
// example label. A lesson may carry `personaName` to name someone other than
// the default persona.
export function validateLesson(lesson, { requireEnglish = false, requireTracks = false, figure = FIGURE } = {}) {
  const errors = [];
  const where = lesson?.id ?? '(no id)';
  const err = (msg) => errors.push(`${where}: ${msg}`);
  if (!lesson || typeof lesson !== 'object') return ['lesson is not an object'];

  if (!filled(lesson.id)) err('missing id');
  if (!Number.isInteger(lesson.order)) err('missing order');

  const nodes = Array.isArray(lesson.diagram?.nodes) ? lesson.diagram.nodes : [];
  const edges = Array.isArray(lesson.diagram?.edges) ? lesson.diagram.edges : [];
  const steps = Array.isArray(lesson.steps) ? lesson.steps : [];
  const checkpoint = Array.isArray(lesson.checkpoint) ? lesson.checkpoint : [];
  if (nodes.length === 0) err('diagram has no nodes');

  // --- structure ---
  const nodeIds = new Set(nodes.map((n) => n.id));
  const shapeIds = new Set([...nodeIds, ...edges.map((e) => e.id)]);
  for (const n of nodes) {
    if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) err(`node ${n.id} needs numeric x and y`);
  }
  for (const e of edges) {
    for (const end of [e.from, e.to]) {
      if (!nodeIds.has(end)) err(`edge ${e.id} points to unknown node ${end}`);
    }
  }
  for (const item of [...steps, ...checkpoint]) {
    if (item.track !== undefined && !TRACKS.includes(item.track)) err(`unknown track "${item.track}"`);
  }
  const view = { steps, checkpoint };
  for (const track of TRACKS) {
    const count = visibleSteps(view, track).length;
    if (count < MIN_STEPS || count > MAX_STEPS) {
      err(`steps on the ${track} track must number ${MIN_STEPS}-${MAX_STEPS}, found ${count}`);
    }
    const questions = visibleQuestions(view, track).length;
    if (questions < 1 || questions > 2) err(`checkpoint on the ${track} track must show 1-2 questions, found ${questions}`);
    if (requireTracks) {
      if (!steps.some((st) => st.track === track)) err(`no ${track} track step`);
      if (!checkpoint.some((q) => q.track === track)) err(`no ${track} track question`);
    }
  }
  steps.forEach((s, i) => {
    for (const id of [...(s.show ?? []), ...(s.highlight ?? [])]) {
      if (!shapeIds.has(id)) err(`step ${i + 1} refers to unknown id ${id}`);
    }
    if (s.persona != null && !nodeIds.has(s.persona)) err(`step ${i + 1} persona on unknown node ${s.persona}`);
  });
  for (const q of checkpoint) {
    const options = Array.isArray(q.options) ? q.options : [];
    if (options.length < 2) err(`question ${q.id} needs at least 2 options`);
    if (!options.some((o) => o.id === q.answer)) err(`question ${q.id} answer "${q.answer}" is not an option`);
  }
  if (!filled(lesson.connection?.to)) err('missing connection.to');

  // --- text ---
  const texts = [
    ['title', lesson.title],
    ['subtitle', lesson.subtitle],
    ...(lesson.short !== undefined ? [['short label', lesson.short]] : []),
    ...nodes.map((n) => [`node ${n.id} label`, n.label]),
    ...steps.map((s, i) => [`step ${i + 1} caption`, s.caption]),
    ...checkpoint.flatMap((q) => [
      [`question ${q.id} prompt`, q.prompt],
      ...(q.options ?? []).map((o) => [`question ${q.id} option ${o.id}`, o.text]),
      [`question ${q.id} explanation`, q.explanation],
    ]),
    ['connection text', lesson.connection?.text],
  ];
  for (const [name, text] of texts) {
    if (!isText(text) || !filled(text.ko)) err(`${name} is missing ko text`);
    else if (text.ko.includes(BANNED_KO)) err(`${name} uses the banned word ${BANNED_KO}`);
    if (requireEnglish && !(isText(text) && filled(text.en))) err(`${name} is missing en text`);
  }

  for (const lang of ['ko', 'en']) {
    const rule = { ...RULES[lang], persona: lesson.personaName?.[lang] ?? RULES[lang].persona };
    const captions = steps.map((s) => s.caption?.[lang]).filter(filled);
    if (lang === 'en' && captions.length === 0) continue; // not translated yet
    steps.forEach((s, i) => {
      const caption = s.caption?.[lang];
      if (!filled(caption)) return;
      if (sentenceCount(caption) > MAX_SENTENCES) err(`step ${i + 1} ${lang} caption has more than ${MAX_SENTENCES} sentences`);
      if (figure.test(caption) && !caption.includes(rule.example)) {
        err(`step ${i + 1} ${lang} caption has a figure but no "${rule.example}" label`);
      }
    });
    for (const track of TRACKS) {
      const personaPool = [
        ...visibleSteps(view, track).map((st) => st.caption?.[lang]),
        ...visibleQuestions(view, track).flatMap((q) => [q.prompt?.[lang], q.explanation?.[lang]]),
      ].filter(filled).join(' ');
      if (!personaPool.includes(rule.persona)) {
        err(`${lang} text never mentions ${rule.persona}`);
        break;
      }
    }
  }

  return errors;
}

// Options beyond validateLesson's: `lessonCount` (default 6) and `loop`
// (default true: the last lesson leads back to the first). With `loop: false`
// the last lesson leads to the course list, written as connection.to 'home'.
export function validateCourse(lessons, { lessonCount = 6, loop = true, ...options } = {}) {
  const errors = lessons.flatMap((l) => validateLesson(l, options));
  if (lessons.length !== lessonCount) errors.push(`course must have exactly ${lessonCount} lessons, found ${lessons.length}`);

  const seen = new Set();
  for (const l of lessons) {
    if (seen.has(l.id)) errors.push(`duplicate lesson id ${l.id}`);
    seen.add(l.id);
  }
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  sorted.forEach((l, i) => {
    if (l.order !== i + 1) errors.push(`${l.id}: order should be ${i + 1}, found ${l.order}`);
    const last = i === sorted.length - 1;
    const expected = last && !loop ? 'home' : sorted[(i + 1) % sorted.length].id;
    if (l.connection?.to !== expected) {
      errors.push(`${l.id}: connection should lead to ${expected}, found ${l.connection?.to}`);
    }
  });
  return errors;
}
