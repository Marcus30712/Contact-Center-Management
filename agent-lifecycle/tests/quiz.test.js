import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeAnswer } from '../js/engine/quiz.js';

const q = { options: [{ id: 'a' }, { id: 'b' }], answer: 'b' };

test('gradeAnswer marks only the answer option correct', () => {
  assert.deepEqual(gradeAnswer(q, 'b'), { correct: true });
  assert.deepEqual(gradeAnswer(q, 'a'), { correct: false });
  assert.deepEqual(gradeAnswer(q, 'zzz'), { correct: false });
});
