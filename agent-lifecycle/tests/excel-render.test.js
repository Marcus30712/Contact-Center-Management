import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, click } from './dom.js';
import { fakeStorage } from './helpers.js';
import { renderExcel, newExcelView } from '../../excel/render.js';
import { EXCEL_UI as UI, EXCEL_LESSONS } from '../../excel/data.js';
import { loadProgress, saveProgress, PROGRESS_KEY } from '../../excel/engine.js';

const Q = (id) => EXCEL_LESSONS.flatMap((l) => l.questions).find((q) => q.id === id);

function page(storage = fakeStorage(), route = '', lang = 'ko') {
  const { root } = setupDom();
  const view = newExcelView();
  const draw = (r = route, l = lang) => renderExcel(root, l, storage, r, view);
  draw();
  return { root, view, draw, storage };
}
const text = (root, sel) => root.querySelector(sel)?.textContent ?? '';
// Open lesson N and go straight to question k (1-based) by answering the ones before wrongly/rightly.
// Lessons open in order, so mark the ones before n as finished first.
function unlock(p, n) {
  const before = EXCEL_LESSONS.slice(0, n - 1).map((l) => l.id);
  const prog = loadProgress(p.storage);
  saveProgress(p.storage, { completed: [...new Set([...prog.completed, ...before])], scores: prog.scores });
}
function toQuestions(p, n) {
  unlock(p, n);
  p.draw(`lesson-${n}`);
  click(p.root.querySelector('[data-start]'));
}
function answerRight(p, q, lang = 'ko') {
  const r = p.root;
  if (q.type === 'choice') click(r.querySelector(`[data-option="${q.answer}"]`));
  if (q.type === 'blank') click(r.querySelector(`[data-chip="${q.answer}"]`));
  if (q.type === 'build' || q.type === 'steps') {
    const want = q.type === 'build' ? q.cards[lang] : q.steps[lang];
    const used = new Set();
    for (const w of want) {
      const btn = [...r.querySelectorAll('[data-bank] [data-card]')].find((b) => b.textContent === w && !b.disabled && !used.has(b));
      used.add(btn);
      click(btn);
    }
    click(r.querySelector('[data-check]'));
  }
  if (q.type === 'cell') {
    const [a, b] = q.answer.split(':');
    click(r.querySelector(`td[data-cell="${a}"]`));
    if (b) click(r.querySelector(`td[data-cell="${b}"]`));
    click(r.querySelector('[data-check]'));
  }
}

test('the list shows 11 lessons, opened in order, with scores', () => {
  const s = fakeStorage();
  let p = page(s);
  const items = [...p.root.querySelectorAll('[data-lesson]')];
  assert.equal(items.length, 11);
  assert.ok(p.root.querySelector('img[data-miso="smile"]'));
  assert.ok(items[0].querySelector('a[href="#lesson-1"]'));
  assert.equal(items[1].querySelector('a'), null);
  assert.ok(items[1].textContent.includes(UI.locked.ko));
  saveProgress(s, { completed: ['1'], scores: { 1: 5 } });
  p = page(s);
  const again = [...p.root.querySelectorAll('[data-lesson]')];
  assert.ok(again[0].textContent.includes('6개 중 5개'));
  assert.ok(again[1].querySelector('a[href="#lesson-2"]'));
});

test('a lesson goes cards → six questions → summary, and saves progress', () => {
  const p = page();
  unlock(p, 2);
  p.draw('lesson-2');
  assert.ok(p.root.querySelector('img[data-miso="smile"]'));
  assert.equal(p.root.querySelectorAll('[data-explain-card]').length, 2);
  click(p.root.querySelector('[data-start]'));
  for (let i = 0; i < 6; i += 1) {
    const q = EXCEL_LESSONS[1].questions[i];
    assert.ok(text(p.root, '[data-count]').includes(`문제 ${i + 1} / 6`));
    if (i === 0) assert.ok(p.root.querySelector('img[data-miso="think"]'));
    answerRight(p, q);
    assert.ok(p.root.querySelector('img[data-miso="joy"]'), q.id);
    click(p.root.querySelector('[data-next]'));
  }
  assert.ok(p.root.querySelector('[data-done]'));
  assert.ok(text(p.root, '[data-done]').includes('레슨 2 마침!'));
  assert.ok(p.root.querySelector('img[data-miso="proud"]'));
  assert.ok(text(p.root, '[data-score]').includes('6개 중 6개'));
  assert.equal(p.root.querySelectorAll('[data-summary] li').length, 3);
  assert.deepEqual(loadProgress(p.storage), { completed: ['1', '2'], scores: { 2: 6 } });
});

test('building: tap to the line, tap to take out, check shows the result and used cells', () => {
  const p = page();
  toQuestions(p, 2);
  for (let i = 0; i < 4; i += 1) { answerRight(p, EXCEL_LESSONS[1].questions[i]); click(p.root.querySelector('[data-next]')); }
  assert.ok(text(p.root, '.ex-hint').includes(UI.buildHint.ko));
  assert.ok(text(p.root, '[data-line]').startsWith('='));
  const card = (t) => [...p.root.querySelectorAll('[data-bank] [data-card]')].find((b) => b.textContent === t);
  click(card('AVERAGE('));
  assert.ok(text(p.root, '[data-line]').includes('AVERAGE('));
  assert.ok(card('AVERAGE(').disabled);
  click(p.root.querySelector('[data-line] [data-line-card="0"]'));
  assert.ok(!text(p.root, '[data-line]').includes('AVERAGE('));
  click(card('SUM('));
  click(card('E2:E9'));
  click(card(')'));
  click(p.root.querySelector('[data-check]'));
  assert.ok(text(p.root, '[data-result]').includes('결과: 118770'));
  assert.equal(p.root.querySelectorAll('td.is-used').length, 8);
  assert.ok(document.querySelector('[data-status]').textContent.includes(UI.correct.ko));
});

test('a wrong build shows worry and the explanation; a retry right does not raise the first-try score', () => {
  const s = fakeStorage();
  const p = page(s);
  toQuestions(p, 2);
  const qs = EXCEL_LESSONS[1].questions;
  for (let i = 0; i < 4; i += 1) { answerRight(p, qs[i]); click(p.root.querySelector('[data-next]')); }
  const card = (t) => [...p.root.querySelectorAll('[data-bank] [data-card]')].find((b) => b.textContent === t);
  click(card(')'));
  click(p.root.querySelector('[data-check]'));
  assert.ok(p.root.querySelector('img[data-miso="worry"]'));
  assert.ok(text(p.root, '[data-explanation]').includes(qs[4].explanation.ko));
  click(p.root.querySelector('[data-retry]'));
  assert.equal(p.root.querySelectorAll('[data-line] [data-line-card]').length, 0);
  answerRight(p, qs[4]);
  assert.ok(p.root.querySelector('img[data-miso="joy"]'));
  click(p.root.querySelector('[data-next]'));
  answerRight(p, qs[5]);
  click(p.root.querySelector('[data-next]'));
  assert.ok(text(p.root, '[data-score]').includes('6개 중 5개'));
  assert.equal(loadProgress(s).scores[2], 5);
});

test('blank, cell and steps questions', () => {
  const p = page();
  toQuestions(p, 1);
  const qs = EXCEL_LESSONS[0].questions;
  answerRight(p, qs[0]); click(p.root.querySelector('[data-next]'));
  answerRight(p, qs[1]); click(p.root.querySelector('[data-next]'));
  assert.ok(text(p.root, '[data-template]').includes('C___:C9'));
  click(p.root.querySelector('[data-chip="1"]'));
  assert.ok(p.root.querySelector('img[data-miso="worry"]'));
  click(p.root.querySelector('[data-next]'));
  answerRight(p, qs[3]); click(p.root.querySelector('[data-next]'));
  assert.ok(text(p.root, '.ex-hint').includes(UI.cellHint.ko));
  click(p.root.querySelector('td[data-cell="C2"]'));
  click(p.root.querySelector('td[data-cell="C9"]'));
  assert.ok(text(p.root, '[data-selection]').includes('C2:C9'));
  click(p.root.querySelector('[data-check]'));
  assert.ok(p.root.querySelector('img[data-miso="worry"]'), 'the answer to 1-5 is E9');
  click(p.root.querySelector('[data-retry]'));
  click(p.root.querySelector('td[data-cell="E9"]'));
  click(p.root.querySelector('[data-check]'));
  assert.ok(p.root.querySelector('img[data-miso="joy"]'));

  const s = fakeStorage();
  saveProgress(s, { completed: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], scores: {} });
  const p2 = page(s);
  toQuestions(p2, 10);
  const q10 = EXCEL_LESSONS[9].questions;
  for (let i = 0; i < 4; i += 1) { answerRight(p2, q10[i]); click(p2.root.querySelector('[data-next]')); }
  assert.ok(text(p2.root, '.ex-hint').includes(UI.stepsHint.ko));
  answerRight(p2, Q('10-5'));
  const pivot = p2.root.querySelector('[data-after]');
  assert.ok(pivot.textContent.includes('합계: 콜') && pivot.textContent.includes('276') && pivot.textContent.includes('총합계'));
});

test('a nonsense build line grades wrong without throwing', () => {
  const p = page();
  toQuestions(p, 2);
  const qs = EXCEL_LESSONS[1].questions;
  for (let i = 0; i < 4; i += 1) { answerRight(p, qs[i]); click(p.root.querySelector('[data-next]')); }
  click(p.root.querySelector('[data-check]'));
  assert.ok(p.root.querySelector('img[data-miso="worry"]'), 'an empty line is wrong');
});

test('switching language mid-build keeps the question and shows English cards', () => {
  const p = page();
  toQuestions(p, 4);
  const qs = EXCEL_LESSONS[3].questions;
  for (let i = 0; i < 4; i += 1) { answerRight(p, qs[i]); click(p.root.querySelector('[data-next]')); }
  p.draw('lesson-4', 'en');
  assert.ok(text(p.root, '[data-count]').includes('Question 5 of 6'));
  assert.ok([...p.root.querySelectorAll('[data-bank] [data-card]')].some((b) => b.textContent === '"Team A"'));
  answerRight(p, qs[4], 'en');
  assert.ok(p.root.querySelector('img[data-miso="joy"]'));
});

test('locked lessons and unknown routes go to the list; no stray text; English has no Hangul', () => {
  const p = page();
  p.draw('lesson-5');
  assert.equal(p.root.querySelectorAll('[data-lesson]').length, 11);
  p.draw('lesson-99');
  assert.equal(p.root.querySelectorAll('[data-lesson]').length, 11);
  assert.ok(!/\bnull\b|\bundefined\b/.test(p.root.textContent));
  const en = page(fakeStorage(), 'lesson-1', 'en');
  click(en.root.querySelector('[data-start]'));
  click(en.root.querySelector('[data-option="1"]'));
  const all = en.root.textContent + [...en.root.querySelectorAll('img')].map((i) => i.alt).join(' ');
  assert.ok(!/[가-힣]/.test(all), all.match(/[가-힣]+/)?.[0]);
  assert.ok(!/\bnull\b|\bundefined\b/.test(all));
});

test('junk progress still shows the list', () => {
  const s = fakeStorage({ [PROGRESS_KEY]: '{"completed":"x"}' });
  assert.equal(page(s).root.querySelectorAll('[data-lesson]').length, 11);
});

test('options are drawn shuffled, keep their own index, and the pick is marked', () => {
  const p = page();
  toQuestions(p, 1);
  const q = EXCEL_LESSONS[0].questions[0];
  const buttons = [...p.root.querySelectorAll('[data-option]')];
  const shown = buttons.map((b) => Number(b.getAttribute('data-option')));
  assert.deepEqual([...shown].sort(), [0, 1, 2]);
  const wrongIndex = shown.find((i) => i !== q.answer);
  click(p.root.querySelector(`[data-option="${wrongIndex}"]`));
  const picked = p.root.querySelector(`[data-option="${wrongIndex}"]`);
  assert.ok(picked.classList.contains('is-wrong'));
  assert.equal(picked.getAttribute('aria-pressed'), 'true');
  assert.ok(p.root.querySelector(`[data-option="${q.answer}"]`).classList.contains('is-correct'), 'the right one is shown too');
  const across = EXCEL_LESSONS.flatMap((l) => l.questions).filter((x) => x.type !== 'cell');
  assert.ok(across.length > 0);
});

test('the list marks the next lesson to take', () => {
  const s = fakeStorage();
  let p = page(s);
  let next = p.root.querySelector('[data-lesson].is-next');
  assert.equal(next.getAttribute('data-lesson'), '1');
  assert.ok(next.textContent.includes(UI.start.ko));
  saveProgress(s, { completed: ['1', '2'], scores: { 1: 6, 2: 4 } });
  p = page(s);
  next = p.root.querySelector('[data-lesson].is-next');
  assert.equal(next.getAttribute('data-lesson'), '3');
  assert.ok(next.textContent.includes(UI.continue.ko));
  assert.equal(p.root.querySelectorAll('[data-lesson].is-next').length, 1);
});
