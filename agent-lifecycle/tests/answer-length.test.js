// Content review phase 2 (2026-11-26): the right answer must not give itself away by
// being the longest option. Per course, at most a third of the questions may have
// the right answer as the single longest option (Korean length).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AGENT_LESSONS } from '../../agent/lessons/index.js';
import { AC_LESSONS } from '../../agent-career/lessons/index.js';
import { SME_LESSONS } from '../../sme/lessons/index.js';
import { SL_LESSONS } from '../../sme-lifecycle/lessons/index.js';
import { SS_LESSONS } from '../../sme-sop/lessons/index.js';
import { AS_LESSONS } from '../../agent-sop/lessons/index.js';
import { TL_LESSONS } from '../../tl/lessons/index.js';
import { TS_LESSONS } from '../../tl-support/lessons/index.js';
import { LESSONS } from '../js/lessons/index.js';
import { SOP_LESSONS } from '../../sop-library/lessons/index.js';
import { QUIZZES } from '../../review/data.js';

const soloLongest = (q) => {
  const len = q.options.map((o) => o.text.ko.length);
  const a = len[q.options.findIndex((o) => o.id === q.answer)];
  return a === Math.max(...len) && len.filter((v) => v === a).length === 1;
};

const COURSES = {
  agent: AGENT_LESSONS, 'agent-career': AC_LESSONS, 'agent-sop': AS_LESSONS, sme: SME_LESSONS, 'sme-lifecycle': SL_LESSONS, 'sme-sop': SS_LESSONS,
  tl: TL_LESSONS, 'tl-support': TS_LESSONS, lifecycle: LESSONS, sop: SOP_LESSONS,
};

for (const [id, lessons] of Object.entries(COURSES)) {
  test(`${id}: the right answer is the single longest option in at most a third of the questions`, () => {
    const qs = lessons.flatMap((l) => l.checkpoint);
    const n = qs.filter(soloLongest).length;
    assert.ok(n * 3 <= qs.length, `${n}/${qs.length}: ${qs.filter(soloLongest).map((q) => q.id).join(', ')}`);
  });
}

test('review quizzes: the right answer is the single longest option in at most a third of the questions', () => {
  const qs = Object.values(QUIZZES).flatMap((quiz) => quiz.questions);
  const n = qs.filter(soloLongest).length;
  assert.ok(qs.length >= 12 && n * 3 <= qs.length, `${n}/${qs.length}`);
});

// Spoken lines (an interview answer, a team leader's opening words) carry no example label
// inside the quotes. Quoted written notes with figures (a report line, a chat message) keep theirs.
test('spoken lines in options carry no example label inside the quotes', () => {
  const opt = (lessons, qid, oid) => lessons.flatMap((l) => l.checkpoint).find((q) => q.id === qid).options.find((o) => o.id === oid).text;
  for (const o of [opt(AC_LESSONS, 'ready-q2', 'b'), opt(AC_LESSONS, 'ready-q2', 'c'), opt(TL_LESSONS, 'oneonone-q1', 'a')]) {
    assert.ok(!/예시|Example/.test(o.ko + o.en), o.ko);
  }
});

// Content review phase 3 (2026-11-26): a reason clause ("~하니, ~하려고, …") must not
// mark an option as wrong. Right answers carry reasons about as often as wrong ones,
// and no question has reasons on both wrong options and none on the right one.
const REASON = /(니|어서|아서|도록|려고|게|면서|기에|으므로|므로),\s/;
const hasReason = (o) => REASON.test(o.text.ko.split(/[.!?]/)[0]);
const reasonCourses = { ...COURSES, review: [{ checkpoint: Object.values(QUIZZES).flatMap((q) => q.questions) }] };

for (const [id, lessons] of Object.entries(reasonCourses)) {
  test(`${id}: reason clauses do not give away the wrong options`, () => {
    const qs = lessons.flatMap((l) => l.checkpoint);
    const right = qs.map((q) => q.options.find((o) => o.id === q.answer));
    const wrong = qs.flatMap((q) => q.options.filter((o) => o.id !== q.answer));
    const rRate = right.filter(hasReason).length / right.length;
    const wRate = wrong.filter(hasReason).length / wrong.length;
    assert.ok(rRate >= wRate / 2, `right ${right.filter(hasReason).length}/${right.length}, wrong ${wrong.filter(hasReason).length}/${wrong.length}`);
    const tell = qs.filter((q) => !hasReason(q.options.find((o) => o.id === q.answer)) && q.options.filter((o) => o.id !== q.answer).every(hasReason));
    assert.deepEqual(tell.map((q) => q.id), []);
  });
}

// Content review phase 4 (2026-11-27): the right answer must not give itself away by
// being the shortest option either, and "~니" reasons must not sit only on wrong options.
// First tried on the Agent SOP Library, then made site-wide.
// Proposal: docs/superpowers/reviews/2026-11-27-answer-cues-sitewide-proposal.md.
const NI = /니[,\s]/;
const soloShortest = (q) => {
  const len = q.options.map((o) => o.text.ko.length);
  const a = len[q.options.findIndex((o) => o.id === q.answer)];
  return a === Math.min(...len) && len.filter((v) => v === a).length === 1;
};
const cueSets = {
  ...Object.fromEntries(Object.entries(COURSES).map(([id, lessons]) => [id, lessons.flatMap((l) => l.checkpoint)])),
  ...Object.fromEntries(Object.entries(QUIZZES).map(([id, quiz]) => [`review-${id}`, quiz.questions])),
};
for (const [id, qs] of Object.entries(cueSets)) {
  test(`${id}: the right answer is the single shortest option in at most a quarter of the questions`, () => {
    const n = qs.filter(soloShortest).length;
    assert.ok(n * 4 <= qs.length, `${n}/${qs.length}: ${qs.filter(soloShortest).map((q) => q.id).join(', ')}`);
  });
  test(`${id}: at least a third of the options with a "~니" reason are right answers`, () => {
    let right = 0, all = 0;
    const wrong = [];
    for (const q of qs) for (const o of q.options) if (NI.test(o.text.ko)) { all += 1; if (o.id === q.answer) right += 1; else wrong.push(`${q.id}:${o.id}`); }
    assert.ok(right * 3 >= all, `${right}/${all}; wrong: ${wrong.join(', ')}`);
  });
}

// Phase 4, after the final review (2026-11-27): taking out "~니" must not leave a new
// cue behind. "~로 보고 / ~다고 보고" and English "Treat… / Take … as" sat on wrong options.
const JUDGE_KO = /(다고|라고|으로|로|만) 보고[,\s]/;
const JUDGE_EN = /^(Treat|Assume|Count|Go by|Decide)\b|^Take .* as\b|^Take \w+'s word/;
for (const [id, qs] of Object.entries(cueSets)) {
  for (const [lang, re] of [['ko', JUDGE_KO], ['en', JUDGE_EN]]) {
    test(`${id}: "treat it as" wording (${lang}) is not only on wrong options`, () => {
      let right = 0, all = 0;
      const wrong = [];
      for (const q of qs) for (const o of q.options) if (re.test(o.text[lang])) { all += 1; if (o.id === q.answer) right += 1; else wrong.push(`${q.id}:${o.id}`); }
      assert.ok(right * 3 >= all, `${right}/${all}; wrong: ${wrong.join(', ')}`);
    });
  }
}

// Phase 4 small fixes (2026-11-27): a second sentence that justifies the option, and English
// reason tails (", since…", "; …"), must not mark wrong options either.
const TWO_SENTENCES = (o) => /다\.\s/.test(o.text.ko.replace(/"[^"]*"/g, '""'));
const EN_TAIL = { since: (o) => /\bsince\b/i.test(o.text.en), semicolon: (o) => /; /.test(o.text.en) };
for (const [id, qs] of Object.entries(cueSets)) {
  for (const [name, has, min] of [['two-sentence options (ko)', TWO_SENTENCES, 1], ['"since" (en)', EN_TAIL.since, 3], ['"; " (en)', EN_TAIL.semicolon, 3]]) {
    test(`${id}: ${name} are not only on wrong options`, () => {
      let right = 0, all = 0;
      const wrong = [];
      for (const q of qs) for (const o of q.options) if (has(o)) { all += 1; if (o.id === q.answer) right += 1; else wrong.push(`${q.id}:${o.id}`); }
      assert.ok(all < min || right * 3 >= all, `${right}/${all}; wrong: ${wrong.join(', ')}`);
    });
  }
}
