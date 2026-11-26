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
  agent: AGENT_LESSONS, 'agent-career': AC_LESSONS, sme: SME_LESSONS, 'sme-lifecycle': SL_LESSONS, 'sme-sop': SS_LESSONS,
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
