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
