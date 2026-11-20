// Excel practice: a wrong pick hears why that pick falls short (choice/blank),
// a wrong build sees its own result, a wrong cell sees which cell it was.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EXCEL_LESSONS } from '../../excel/data.js';
import { EXCEL_FEEDBACK, EXCEL_FEEDBACK_UI } from '../../excel/feedback.js';
import { setupDom, click } from './dom.js';
import { fakeStorage } from './helpers.js';
import { renderExcel, newExcelView } from '../../excel/render.js';

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-21-excel-wrong-feedback.md', import.meta.url), 'utf8');
const rows = (re) => [...DOC.matchAll(re)].map(([, k, ko, en]) => [k, { ko: ko.replace(/\\\|/g, '|'), en: en.replace(/\\\|/g, '|') }]);

test('every wrong choice or chip has the approved feedback; right ones have none', () => {
  const table = new Map(rows(/^\| (\d+-\d+\.\d) \| (.+?) \| (.+?) \|$/gm));
  assert.equal(table.size, 88);
  for (const q of EXCEL_LESSONS.flatMap((l) => l.questions)) {
    if (q.type !== 'choice' && q.type !== 'blank') { assert.equal(EXCEL_FEEDBACK[q.id], undefined, q.id); continue; }
    const n = (q.options ?? q.chips).length;
    for (let i = 0; i < n; i += 1) {
      const fb = EXCEL_FEEDBACK[q.id]?.[i];
      if (i === q.answer) assert.equal(fb, undefined, `${q.id}.${i}`);
      else assert.deepEqual(fb, table.get(`${q.id}.${i}`), `${q.id}.${i}`);
    }
  }
});

test('the two new lines are the approved wording', () => {
  assert.deepEqual(EXCEL_FEEDBACK_UI, Object.fromEntries(rows(/^\| (builtResult|pickedCell) \| (.+?) \| (.+?) \|$/gm)));
});

// Open lesson n (all lessons unlocked) and answer the questions before index k rightly.
function mount(n, k, lang = 'ko') {
  const storage = fakeStorage();
  storage.setItem('excel-practice:v1', JSON.stringify({ completed: EXCEL_LESSONS.map((l) => l.id), scores: {} }));
  const { root } = setupDom();
  const view = newExcelView();
  renderExcel(root, lang, storage, `lesson-${n}`, view);
  click(root.querySelector('[data-start]'));
  const lesson = EXCEL_LESSONS.find((l) => l.id === String(n));
  for (let i = 0; i < k; i += 1) {
    const q = lesson.questions[i];
    click(root.querySelector(q.type === 'choice' ? `[data-option="${q.answer}"]` : `[data-chip="${q.answer}"]`));
    click(root.querySelector('[data-next]'));
  }
  return { root };
}
const pickCard = (root, text) => click([...root.querySelectorAll('[data-bank] [data-card]')].find((b) => b.textContent === text && !b.disabled));

test('a wrong choice shows that option\'s feedback before the explanation', () => {
  const { root } = mount(1, 0);
  click(root.querySelector('[data-option="1"]'));
  const box = root.querySelector('[data-explanation]');
  assert.equal(box.querySelector('[data-feedback]').textContent, EXCEL_FEEDBACK['1-1'][1].ko);
  assert.ok(box.textContent.indexOf(EXCEL_FEEDBACK['1-1'][1].ko) < box.textContent.indexOf(EXCEL_LESSONS[0].questions[0].explanation.ko));
});

test('a right choice shows no feedback and no stray null', () => {
  const { root } = mount(1, 0);
  click(root.querySelector('[data-option="0"]'));
  assert.equal(root.querySelector('[data-feedback]'), null);
  assert.ok(!/null|undefined/.test(root.querySelector('[data-explanation]').textContent));
});

test('a wrong chip shows that chip\'s feedback', () => {
  const { root } = mount(1, 2);
  click(root.querySelector('[data-chip="2"]'));
  assert.equal(root.querySelector('[data-feedback]').textContent, EXCEL_FEEDBACK['1-3'][2].ko);
});

test('a wrong cell says which cell was picked', () => {
  const { root } = mount(1, 4);
  click(root.querySelector('td[data-cell="E8"]'));
  click(root.querySelector('[data-check]'));
  assert.equal(root.querySelector('[data-feedback]').textContent, '고른 칸은 E8이에요.');
});

test('a wrong build that still calculates shows its own result', () => {
  const { root } = mount(2, 4);
  for (const t of ['SUM(', 'D2:D9', ')']) pickCard(root, t);
  click(root.querySelector('[data-check]'));
  assert.equal(root.querySelector('[data-feedback]').textContent, '만든 수식의 결과는 406이에요.');
});

test('feedback follows the language', () => {
  const { root } = mount(1, 0, 'en');
  click(root.querySelector('[data-option="2"]'));
  assert.equal(root.querySelector('[data-feedback]').textContent, EXCEL_FEEDBACK['1-1'][2].en);
});
