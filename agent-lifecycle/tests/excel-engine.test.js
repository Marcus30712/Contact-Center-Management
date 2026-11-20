import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fakeStorage, throwingStorage } from './helpers.js';
import { EXCEL_LESSONS, SHEETS } from '../../excel/data.js';
import { evaluate } from '../../excel/formula.js';
import {
  grade, newBuild, tapBank, tapLine, lineTexts, pickCell, selectionText,
  applyAfter, loadProgress, saveProgress, finishLesson, isOpen, PROGRESS_KEY,
} from '../../excel/engine.js';

const ALL = EXCEL_LESSONS.flatMap((l) => l.questions);
const Q = (id) => ALL.find((q) => q.id === id);
const LANGS = ['ko', 'en'];
const same = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : a === b);

test('every build answer computes to its result, in both languages', () => {
  for (const q of ALL.filter((x) => x.type === 'build')) {
    for (const lang of LANGS) {
      const r = evaluate(`=${q.cards[lang].join(' ')}`, SHEETS[lang]);
      assert.ok(r.ok && same(r.value, q.result[lang]), `${q.id} ${lang}: ${r.value ?? r.error}`);
      const g = grade(q, q.cards[lang], lang);
      assert.ok(g.correct, `${q.id} ${lang}`);
      assert.ok(same(g.value, q.result[lang]));
      assert.ok(g.cells.length > 0);
    }
  }
});

test('blank formulas: only the answer chip gives the result; menu blanks go by the chip', () => {
  for (const q of ALL.filter((x) => x.type === 'blank')) {
    for (const lang of LANGS) {
      q.chips.forEach((_, i) => {
        assert.equal(grade(q, i, lang).correct, i === q.answer, `${q.id} ${lang} chip ${i}`);
      });
      if (q.result) {
        const filled = q.template[lang].replace('___', q.chips[q.answer][lang]);
        const r = evaluate(filled, SHEETS[lang]);
        assert.ok(r.ok && same(r.value, q.result[lang]), `${q.id} ${lang}: ${filled} -> ${r.value ?? r.error}`);
      }
    }
  }
});

test('dropping any answer card or swapping in any decoy grades wrong', () => {
  for (const q of ALL.filter((x) => x.type === 'build')) {
    for (const lang of LANGS) {
      const cards = q.cards[lang];
      cards.forEach((_, i) => {
        assert.equal(grade(q, cards.filter((__, j) => j !== i), lang).correct, false, `${q.id} ${lang} drop ${i}`);
        for (const d of q.decoys[lang]) {
          const swapped = cards.map((c, j) => (j === i ? d : c));
          assert.equal(grade(q, swapped, lang).correct, false, `${q.id} ${lang} ${d} at ${i}`);
        }
      });
      assert.equal(grade(q, [], lang).correct, false);
      assert.equal(grade(q, [')'], lang).correct, false);
    }
  }
});

test('an equivalent formula in another order grades right', () => {
  const q = Q('4-6');
  assert.ok(grade(q, ['COUNTIFS(', 'D2:D9', ',', '">=45"', ',', 'C2:C9', ',', '"B팀"', ')'], 'ko').correct);
  assert.ok(grade(q, ['COUNTIFS(', 'D2:D9', ',', '">=45"', ',', 'C2:C9', ',', '"Team B"', ')'], 'en').correct);
  assert.equal(grade(q, ['COUNTIFS(', 'D2:D9', ',', '">=45"', ',', 'C2:C9', ',', '"B팀"', ')'], 'en').correct, false, 'the English sheet says Team B');
});

test('at most 10 cards per build or steps question', () => {
  for (const q of ALL) {
    for (const lang of LANGS) {
      if (q.type === 'build') assert.ok(q.cards[lang].length + q.decoys[lang].length <= 10, q.id);
      if (q.type === 'steps') assert.ok(q.steps[lang].length + q.decoys[lang].length <= 10, q.id);
    }
  }
});

test('building: bank to line and back, shuffled the same way for the same seed', () => {
  const q = Q('2-5');
  const s = newBuild(q, 'ko', 'x');
  assert.equal(s.bank.length, 5);
  assert.deepEqual(newBuild(q, 'ko', 'x').bank, s.bank);
  assert.deepEqual([...s.bank.map((c) => c.text)].sort(), [...q.cards.ko, ...q.decoys.ko].sort());
  const at = (text) => s.bank.findIndex((c) => c.text === text);
  let st = tapBank(s, at('SUM('));
  st = tapBank(st, at('E2:E9'));
  st = tapBank(st, at('E2:E9'));
  assert.deepEqual(lineTexts(st), ['SUM(', 'E2:E9'], 'a card goes to the line once');
  st = tapBank(st, at(')'));
  assert.ok(grade(q, lineTexts(st), 'ko').correct);
  st = tapLine(st, 0);
  assert.deepEqual(lineTexts(st), ['E2:E9', ')']);
  const steps = newBuild(Q('9-5'), 'en', 'x');
  assert.equal(steps.bank.length, 7);
});

test('cell and range picks', () => {
  assert.equal(grade(Q('1-5'), 'E9', 'ko').correct, true);
  assert.equal(grade(Q('1-5'), 'E8', 'ko').correct, false);
  let sel = pickCell(null, 'C2');
  assert.equal(selectionText(sel), 'C2');
  sel = pickCell(sel, 'C9');
  assert.equal(selectionText(sel), 'C2:C9');
  assert.ok(grade(Q('1-6'), selectionText(sel), 'ko').correct);
  assert.equal(selectionText(pickCell(pickCell(null, 'C9'), 'C2')), 'C2:C9');
  assert.equal(selectionText(pickCell(pickCell(pickCell(null, 'C2'), 'C9'), 'D4')), 'D4', 'a third tap starts again');
  assert.equal(grade(Q('1-6'), 'C1:C9', 'ko').correct, false);
});

test('steps: exact order right, an any-order pair either way, nothing else', () => {
  const s95 = Q('9-5');
  for (const lang of LANGS) {
    assert.ok(grade(s95, s95.steps[lang], lang).correct);
    const swapped = [...s95.steps[lang]];
    [swapped[2], swapped[3]] = [swapped[3], swapped[2]];
    assert.equal(grade(s95, swapped, lang).correct, false);
    assert.equal(grade(s95, s95.steps[lang].slice(0, 4), lang).correct, false);
    assert.equal(grade(s95, s95.steps[lang].map((x, i) => (i === 3 ? s95.decoys[lang][1] : x)), lang).correct, false);
  }
  const p = Q('10-5');
  assert.deepEqual(p.anyOrder, [[3, 4]]);
  const pivot = [...p.steps.ko];
  [pivot[3], pivot[4]] = [pivot[4], pivot[3]];
  assert.ok(grade(p, pivot, 'ko').correct);
  const bad = [...p.steps.ko];
  [bad[1], bad[2]] = [bad[2], bad[1]];
  assert.equal(grade(p, bad, 'ko').correct, false);
});

test('choice goes by index', () => {
  const q = Q('2-2');
  assert.ok(grade(q, q.answer, 'ko').correct);
  assert.equal(grade(q, (q.answer + 1) % 3, 'en').correct, false);
});

test('after views match the confirmed copy', () => {
  const copy = readFileSync(new URL('../../docs/superpowers/specs/2026-11-20-excel-practice-copy.md', import.meta.url), 'utf8');
  const ko = SHEETS.ko;
  const names = (v) => v.rows.map((r) => ko.cells[`B${r}`]);
  assert.deepEqual(names(applyAfter(ko, Q('9-5').after, 'ko')), ['박서연', '조수아', '정민서', '김하늘', '윤시우', '이도윤', '강예준', '최지호']);
  assert.deepEqual(names(applyAfter(ko, Q('9-6').after, 'ko')), ['이도윤', '최지호', '강예준']);
  assert.deepEqual(applyAfter(SHEETS.en, Q('9-6').after, 'en').rows, [3, 5, 7]);
  const p1 = applyAfter(ko, Q('10-5').after, 'ko').pivot;
  assert.deepEqual(p1, { head: ['팀', '합계: 콜'], rows: [['A팀', 276], ['B팀', 130]], total: ['총합계', 406] });
  assert.ok(copy.includes('팀 | 합계: 콜 — A팀 276, B팀 130, 총합계 406'));
  const p2 = applyAfter(SHEETS.en, Q('10-6').after, 'en').pivot;
  assert.deepEqual(p2, { head: ['Team', 'Count of Name'], rows: [['Team A', 5], ['Team B', 3]], total: ['Grand Total', 8] });
  assert.ok(copy.includes('팀 | 개수: 이름 — A팀 5, B팀 3, 총합계 8'));
  assert.deepEqual(applyAfter(ko, Q('11-5').after, 'ko').highlight, ['D5', 'D7']);
  assert.deepEqual(applyAfter(ko, Q('11-6').after, 'ko').highlight, ['D2', 'D5', 'D7', 'D9']);
  assert.deepEqual(applyAfter(ko, Q('11-6').after, 'ko').rows, [2, 3, 4, 5, 6, 7, 8, 9]);
});

test('progress survives junk, keeps the best score, opens lessons in order', () => {
  for (const raw of ['[]', 'nope', '{"completed":5}', '{"scores":[1]}']) {
    const p = loadProgress(fakeStorage({ [PROGRESS_KEY]: raw }));
    assert.deepEqual(p, { completed: [], scores: {} }, raw);
  }
  assert.deepEqual(loadProgress(throwingStorage), { completed: [], scores: {} });
  assert.doesNotThrow(() => saveProgress(throwingStorage, { completed: [], scores: {} }));
  let p = finishLesson({ completed: [], scores: {} }, '1', 4);
  p = finishLesson(p, '1', 2);
  assert.deepEqual(p, { completed: ['1'], scores: { 1: 4 } });
  p = finishLesson(p, '1', 6);
  assert.equal(p.scores[1], 6);
  assert.ok(isOpen(p, '1') && isOpen(p, '2') && !isOpen(p, '3'));
  const s = fakeStorage();
  saveProgress(s, p);
  assert.deepEqual(loadProgress(s), p);
  assert.ok(!isOpen({ completed: [], scores: {} }, '2'));
});

test('IF builds need every answer card: a lone result card or a missing branch is wrong', () => {
  for (const id of ['6-5', '6-6']) {
    const q = Q(id);
    for (const lang of LANGS) {
      const c = q.cards[lang];
      assert.equal(grade(q, [c[5]], lang).correct, false, `${id} ${lang} lone result card`);
      assert.equal(grade(q, c.slice(0, 6).concat(')'), lang).correct, false, `${id} ${lang} no else branch`);
      assert.equal(grade(q, ['IF(', c[1], ',', c[5], ')'], lang).correct, false, `${id} ${lang} cell as condition`);
      assert.ok(grade(q, c, lang).correct);
    }
  }
  // Equivalent rewrites built from the same cards still count.
  const q = Q('8-5');
  assert.ok(grade(q, ['INT(', 'E5', '/', '60', '/', 'D5', ')'], 'ko').correct);
});

test('choice options and chips are shown in a shuffled order that is the same every time', async () => {
  const { displayOrder } = await import('../../excel/engine.js');
  const qs = ALL.filter((x) => x.type === 'choice' || x.type === 'blank');
  const answerFirst = qs.filter((q) => displayOrder(q)[0] === q.answer).length;
  assert.ok(answerFirst < qs.length * 0.6, `the answer is first in ${answerFirst} of ${qs.length}`);
  for (const q of qs) {
    const order = displayOrder(q);
    assert.deepEqual([...order].sort(), [0, 1, 2]);
    assert.deepEqual(displayOrder(q), order);
  }
});

test('rearranged IF cards that only match by luck on this table grade wrong', () => {
  const lucky = {
    '6-5': ['IF( D8 >= "미달" , G8 , "달성" )', 'IF( D8 , "달성" , G8 >= "미달" )', 'IF( G8 , "달성" , "미달" >= D8 )', 'IF( "미달" >= G8 , "달성" , D8 )'],
    '6-6': ['IF( E9 > "" , "확인" , 15000 )', 'IF( E9 , "확인" , 15000 > "" )', 'IF( 15000 , "확인" , "" > E9 )', 'IF( "" > 15000 , E9 , "확인" )'],
  };
  for (const [id, lines] of Object.entries(lucky)) {
    for (const line of lines) assert.equal(grade(Q(id), line.split(' '), 'ko').correct, false, `${id}: ${line}`);
  }
  assert.ok(grade(Q('6-5'), 'IF( D8 >= G8 , "달성" , "미달" )'.split(' '), 'ko').correct);
  assert.ok(grade(Q('4-6'), ['COUNTIFS(', 'D2:D9', ',', '">=45"', ',', 'C2:C9', ',', '"B팀"', ')'], 'ko').correct, 'a true rewrite still counts');
});
