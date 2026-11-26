// Miso's Excel practice, advanced lessons 12–16 (2026-11-21): wording is the
// approved copy, every answer computes, wrong chips and cards grade wrong,
// lessons open by what they need, and the basic course is unchanged.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EXCEL_ADVANCED, ADVANCED_UI, ADVANCED_FEEDBACK } from '../../excel/advanced.js';
import { EXCEL_LESSONS, SHEETS } from '../../excel/data.js';
import { EXCEL_FEEDBACK } from '../../excel/feedback.js';
import { evaluate } from '../../excel/formula.js';
import { grade, loadProgress, finishLesson, isOpen, PROGRESS_KEY } from '../../excel/engine.js';
import { fakeStorage } from './helpers.js';

const read = (name) => readFileSync(new URL(`../../docs/superpowers/specs/${name}`, import.meta.url), 'utf8');
const DESIGN = read('2026-11-21-excel-advanced-design.md');
const T = {
  ko: { doc: read('2026-11-21-excel-advanced-copy.md'), lesson: '## 레슨 ', cards: '### 설명 카드', summary: '### 요약', ui: '## 화면 문구',
    types: { 객관식: 'choice', 빈칸: 'blank', '수식 조립': 'build' },
    keys: { 질문: 'prompt', 보기: 'options', 정답: 'answer', 해설: 'explanation', 수식: 'template', 칩: 'chips', '결과 값': 'result', '카드(정답 순서)': 'cards', '헷갈림 카드': 'decoys', 오답: 'wrong' } },
  en: { doc: read('2026-11-21-excel-advanced-copy.en.md'), lesson: '## Lesson ', cards: '### Cards', summary: '### Summary', ui: '## Screen wording',
    types: { choice: 'choice', blank: 'blank', build: 'build' },
    keys: { Question: 'prompt', Options: 'options', Answer: 'answer', Explanation: 'explanation', Formula: 'template', Chips: 'chips', Result: 'result', 'Cards (answer order)': 'cards', 'Decoy cards': 'decoys', Wrong: 'wrong' } },
};
const unquote = (s) => s.trim().replace(/^`|`$/g, '');
const list = (s) => s.split(' · ').map(unquote);

function parse(lang) {
  const t = T[lang];
  const lines = t.doc.split('\n');
  const ui = {};
  const uiAt = lines.indexOf(t.ui);
  for (const l of lines.slice(uiAt + 4)) { if (!l.startsWith('|')) break; const [k, v] = l.slice(2, -2).split(' | '); ui[k] = v; }
  const lessons = [];
  let lesson = null; let q = null; let section = null;
  for (const l of lines) {
    if (l.startsWith(t.lesson)) {
      const [, id, title] = /^## \S+ (\d+) · (.+)$/.exec(l);
      lesson = { id, title, cards: [], summary: [], questions: [] };
      lessons.push(lesson); section = null;
    } else if (!lesson) continue;
    else if (l === t.cards) section = 'cards';
    else if (l === t.summary) section = 'summary';
    else if (l.startsWith('#### ')) {
      const [, id, type] = /^#### (\d+-\d+) · (.+)$/.exec(l);
      q = { id, type: t.types[type], wrong: [] };
      lesson.questions.push(q); section = 'q';
    } else if (section === 'cards' && /^\d+\. /.test(l)) lesson.cards.push(l.replace(/^\d+\. /, ''));
    else if (section === 'summary' && l.startsWith('- ')) lesson.summary.push(l.slice(2));
    else if (section === 'q' && l.startsWith('- ')) {
      const i = l.indexOf(': ');
      const key = t.keys[l.slice(2, i)];
      assert.ok(key, `${lang} unknown field in ${q.id}: ${l}`);
      if (key === 'wrong') q.wrong.push(l.slice(i + 2).split(' → '));
      else q[key] = l.slice(i + 2);
    }
  }
  return { ui, lessons };
}
const P = { ko: parse('ko'), en: parse('en') };
const bi = (ko, en) => ({ ko, en });
const ALL = EXCEL_ADVANCED.flatMap((l) => l.questions);

test('five advanced lessons, each needing the approved basic lessons', () => {
  const needs = Object.fromEntries([...DESIGN.matchAll(/^\| (1[2-6]) \| .+? \| .+? \| ([\d·]+)번 마침 \|$/gm)].map(([, id, n]) => [id, n.split('·')]));
  assert.deepEqual(EXCEL_ADVANCED.map((l) => l.id), ['12', '13', '14', '15', '16']);
  for (const l of EXCEL_ADVANCED) assert.deepEqual(l.requires, needs[l.id], l.id);
  assert.equal(EXCEL_LESSONS.length, 11, 'the basic course is unchanged');
});

test('screen wording and every lesson match both copy files', () => {
  assert.deepEqual(Object.keys(ADVANCED_UI), Object.keys(P.ko.ui));
  for (const k of Object.keys(P.ko.ui)) assert.deepEqual(ADVANCED_UI[k], bi(P.ko.ui[k], P.en.ui[k]), k);
  EXCEL_ADVANCED.forEach((lesson, li) => {
    const ko = P.ko.lessons[li]; const en = P.en.lessons[li];
    assert.equal(lesson.id, ko.id);
    assert.deepEqual(lesson.title, bi(ko.title, en.title));
    assert.deepEqual(lesson.cards, ko.cards.map((c, i) => bi(c, en.cards[i])));
    assert.deepEqual(lesson.summary, ko.summary.map((c, i) => bi(c, en.summary[i])));
    assert.deepEqual(lesson.questions.map((q) => q.type), ['choice', 'choice', 'blank', 'blank', 'build', 'build'], lesson.id);
    lesson.questions.forEach((q, qi) => {
      const k = ko.questions[qi]; const e = en.questions[qi]; const at = k.id;
      assert.equal(q.id, k.id, at);
      assert.deepEqual(q.prompt, bi(k.prompt, e.prompt), at);
      assert.deepEqual(q.explanation, bi(k.explanation, e.explanation), at);
      if (q.type === 'choice') {
        const ko3 = list(k.options); const en3 = list(e.options);
        assert.deepEqual(q.options, ko3.map((o, i) => bi(o, en3[i])), at);
        assert.equal(q.answer, ko3.indexOf(k.answer), at);
        assert.equal(en3.indexOf(e.answer), q.answer, at);
      }
      if (q.type === 'blank') {
        assert.deepEqual(q.template, bi(unquote(k.template), unquote(e.template)), at);
        const kc = list(k.chips); const ec = list(e.chips);
        assert.deepEqual(q.chips, kc.map((c, i) => bi(c, ec[i])), at);
        assert.equal(q.answer, kc.indexOf(k.answer), at);
        assert.equal(ec.indexOf(e.answer), q.answer, at);
      }
      if (q.type === 'build') {
        assert.deepEqual(q.cards, bi(list(k.cards), list(e.cards)), at);
        assert.deepEqual(q.decoys, bi(list(k.decoys), list(e.decoys)), at);
      }
      // A result written as "284.8…" is the start of the computed number.
      for (const [lang, want] of [['ko', k.result], ['en', e.result]]) {
        if (want === undefined) continue;
        const got = q.result[lang];
        if (want.endsWith('…')) assert.ok(String(got).startsWith(want.slice(0, -1)), `${at} ${lang}`);
        else assert.equal(String(got), want, `${at} ${lang}`);
      }
      // Wrong-pick feedback: the copy's "오답:" lines, keyed by option or chip index.
      if (q.type === 'choice' || q.type === 'blank') {
        const items = list(k.options ?? k.chips);
        const enItems = list(e.options ?? e.chips);
        const want = {};
        k.wrong.forEach(([pick, ko2], i) => {
          const [enPick, en2] = e.wrong[i];
          const idx = items.indexOf(pick);
          assert.equal(enItems.indexOf(enPick), idx, `${at} wrong ${pick}`);
          want[idx] = bi(ko2, en2);
        });
        assert.equal(Object.keys(want).length, 2, at);
        assert.ok(!(q.answer in want), at);
        assert.deepEqual(ADVANCED_FEEDBACK[q.id], want, at);
        assert.deepEqual(EXCEL_FEEDBACK[q.id], want, `${at} reaches the shared feedback`);
      }
    });
  });
});

test('English has no Hangul', () => {
  const walk = (v, path) => {
    if (v && typeof v === 'object' && 'ko' in v && 'en' in v) { assert.ok(!/[가-힣]/.test([].concat(v.en).join(' ')), path); return; }
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
  };
  walk({ EXCEL_ADVANCED, ADVANCED_UI, ADVANCED_FEEDBACK }, 'advanced');
});

test('every build computes to its result, and the cards stay within 22', () => {
  for (const q of ALL.filter((x) => x.type === 'build')) {
    for (const lang of ['ko', 'en']) {
      const r = evaluate(`=${q.cards[lang].join(' ')}`, SHEETS[lang]);
      assert.ok(r.ok, `${q.id} ${lang}: ${r.error}`);
      assert.equal(r.value, q.result[lang], `${q.id} ${lang}`);
      assert.ok(q.cards[lang].length + q.decoys[lang].length <= 22, q.id);
      assert.equal(grade(q, q.cards[lang], lang).correct, true, `${q.id} ${lang}`);
      q.cards[lang].forEach((_, i) => {
        assert.equal(grade(q, q.cards[lang].filter((__, j) => j !== i), lang).correct, false, `${q.id} ${lang} without card ${i}`);
      });
      for (const d of q.decoys[lang]) {
        q.cards[lang].forEach((c, i) => {
          if (c === d) return;
          const swapped = q.cards[lang].map((x, j) => (j === i ? d : x));
          assert.equal(grade(q, swapped, lang).correct, false, `${q.id} ${lang}: ${d} for ${c}`);
        });
      }
    }
  }
});

test('blanks: only the answer chip gives the result; choices go by index', () => {
  for (const q of ALL) {
    for (const lang of ['ko', 'en']) {
      if (q.type === 'blank') {
        q.chips.forEach((_, i) => assert.equal(grade(q, i, lang).correct, i === q.answer, `${q.id} ${lang} chip ${i}`));
        const r = evaluate(q.template[lang].replace('___', q.chips[q.answer][lang]), SHEETS[lang]);
        assert.equal(r.value, q.result[lang], `${q.id} ${lang}`);
      }
      if (q.type === 'choice') q.options.forEach((_, i) => assert.equal(grade(q, i, lang).correct, i === q.answer, q.id));
    }
  }
});

test('advanced lessons open by what they need, and progress keeps them', () => {
  const p = (completed) => ({ completed, scores: {} });
  assert.equal(isOpen(p(['1', '2', '3', '4', '5']), '12'), false);
  assert.equal(isOpen(p(['4', '6']), '12'), true);
  assert.equal(isOpen(p(['3', '6']), '13'), true);
  assert.equal(isOpen(p(['3']), '14'), false);
  assert.equal(isOpen(p(['7']), '15'), true);
  assert.equal(isOpen(p(['5', '8']), '16'), true);
  assert.equal(isOpen(p([]), '99'), false);
  const s = fakeStorage({ [PROGRESS_KEY]: JSON.stringify({ completed: ['4', '6', '12', '99'], scores: { 12: 5, 99: 3 } }) });
  const got = loadProgress(s);
  assert.deepEqual(got.completed, ['4', '6', '12']);
  assert.deepEqual(got.scores, { 12: 5 });
  assert.deepEqual(finishLesson(got, '13', 4).scores, { 12: 5, 13: 4 });
});

// ---- screens ----
import { setupDom, click } from './dom.js';
import { renderExcel, newExcelView } from '../../excel/render.js';
import { saveProgress } from '../../excel/engine.js';
import { EXCEL_UI } from '../../excel/data.js';
import { myLearning } from '../../home/render.js';

const BASIC = EXCEL_LESSONS.map((l) => l.id);
function page(completed = [], route = '', lang = 'ko') {
  const { root } = setupDom();
  const storage = fakeStorage();
  saveProgress(storage, { completed, scores: {} });
  const view = newExcelView();
  const draw = (r = route, l = lang) => renderExcel(root, l, storage, r, view);
  draw();
  return { root, storage, draw };
}
const txt = (root, sel) => root.querySelector(sel)?.textContent ?? '';

test('the list has an advanced section below the 11 lessons, locked until their lessons are done', () => {
  const p = page(['1', '2', '3', '4', '5', '6']);
  const sec = p.root.querySelector('[data-advanced]');
  assert.ok(sec);
  assert.equal(sec.querySelector('h2').textContent, ADVANCED_UI.advancedHeading.ko);
  assert.ok(sec.textContent.includes(ADVANCED_UI.advancedNote.ko));
  const items = [...sec.querySelectorAll('[data-lesson]')];
  assert.deepEqual(items.map((li) => li.dataset.lesson), ['12', '13', '14', '15', '16']);
  assert.ok(items[0].querySelector('a[href="#lesson-12"]'), '4 and 6 are done');
  assert.ok(items[1].querySelector('a[href="#lesson-13"]'));
  assert.equal(items[3].querySelector('a'), null);
  assert.equal(txt(items[3], '.ex-locked'), '7번 레슨을 마치면 열려요');
  assert.equal(txt(items[4], '.ex-locked'), '5·8번 레슨을 마치면 열려요');
  assert.equal(p.root.querySelectorAll('ol.ex-list')[0].querySelectorAll('[data-lesson]').length, 11);
  const en = page(['1'], '', 'en');
  assert.equal(txt(en.root.querySelector('[data-advanced] [data-lesson="15"]'), '.ex-locked'), 'Opens when you finish lesson 7');
  assert.equal(txt(en.root.querySelector('[data-advanced] [data-lesson="12"]'), '.ex-locked'), 'Opens when you finish lessons 4 and 6');
});

test('a locked advanced lesson address shows the list instead', () => {
  const p = page(['1'], 'lesson-12');
  assert.ok(p.root.querySelector('[data-advanced]'));
  assert.equal(p.root.querySelector('[data-start]'), null);
});

test('an advanced lesson runs like the others, says "advanced" on top, and leads to the next open one', () => {
  const p = page(BASIC, 'lesson-12');
  assert.equal(txt(p.root, '.ex-of'), ADVANCED_UI.advancedHeading.ko);
  click(p.root.querySelector('[data-start]'));
  for (const q of EXCEL_ADVANCED[0].questions) {
    if (q.type === 'choice') click(p.root.querySelector(`[data-option="${q.answer}"]`));
    if (q.type === 'blank') click(p.root.querySelector(`[data-chip="${q.answer}"]`));
    if (q.type === 'build') {
      const used = new Set();
      for (const w of q.cards.ko) {
        const btn = [...p.root.querySelectorAll('[data-bank] [data-card]')].find((b) => b.textContent === w && !b.disabled && !used.has(b));
        used.add(btn);
        click(btn);
      }
      click(p.root.querySelector('[data-check]'));
    }
    assert.ok(p.root.querySelector('img[data-miso="joy"]'), q.id);
    click(p.root.querySelector('[data-next]'));
  }
  assert.ok(txt(p.root, '[data-done]').includes('레슨 12 마침!'));
  assert.equal(p.root.querySelector('[data-next-lesson]').getAttribute('href'), '#lesson-13');
  assert.deepEqual(loadProgress(p.storage).scores, { 12: 6 });
});

test('the next lesson: basic in order, then the first open advanced one, then none', async () => {
  const { nextLessonAfter } = await import('../../excel/engine.js');
  const p = (completed) => ({ completed, scores: {} });
  assert.equal(nextLessonAfter(p(['1', '2', '3']), '3'), '4');
  assert.equal(nextLessonAfter(p(BASIC), '11'), '12');
  assert.equal(nextLessonAfter(p(['1', '2', '3', '4', '5', '6', '7']), '12'), '13');
  assert.equal(nextLessonAfter(p(['7', '12']), '12'), '15', 'skips advanced lessons still locked');
  assert.equal(nextLessonAfter(p([...BASIC, '12', '13', '14', '15']), '15'), '16');
  assert.equal(nextLessonAfter(p([...BASIC, '12', '13', '14', '15', '16']), '16'), null);
  assert.equal(nextLessonAfter(p(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']), '11'), '12');
});

test('finishing everything shows the advanced done note; home still counts the 11 basic lessons', () => {
  const all = [...BASIC, '12', '13', '14', '15', '16'];
  const p = page(all);
  assert.ok(txt(p.root, '.ex-intro').includes(ADVANCED_UI.advancedDone.ko));
  const s = fakeStorage();
  saveProgress(s, { completed: BASIC, scores: {} });
  const excelRow = myLearning(s).find((r) => r.id === 'excel');
  assert.deepEqual([excelRow.done, excelRow.total, excelRow.next], [11, 11, null]);
  const basicOnly = page(BASIC);
  assert.ok(txt(basicOnly.root, '.ex-intro').includes(ADVANCED_UI.advancedNext.ko), 'approved 2026-11-21: points on to the advanced lessons');
});

// ---------- final review: no rearrangement of the cards grades right by luck ----------
test('advanced builds: any swap or move of the answer cards grades wrong unless it is a listed rewrite', () => {
  for (const q of ALL.filter((x) => x.type === 'build')) {
    for (const lang of ['ko', 'en']) {
      const cards = q.cards[lang];
      const ok = new Set([cards, ...(q.alternatives?.[lang] ?? [])].map((c) => c.join('\u0001')));
      for (const alt of q.alternatives?.[lang] ?? []) {
        assert.equal(grade(q, alt, lang).correct, true, `${q.id} ${lang} rewrite ${alt.join(' ')}`);
        assert.equal(evaluate(`=${alt.join(' ')}`, SHEETS[lang]).value, q.result[lang], `${q.id} ${lang} rewrite value`);
      }
      const tries = [];
      for (let i = 0; i < cards.length; i += 1) {
        for (let j = i + 1; j < cards.length; j += 1) { const c = [...cards]; [c[i], c[j]] = [c[j], c[i]]; tries.push(c); }
        for (let j = 0; j < cards.length; j += 1) { if (i === j) continue; const c = [...cards]; const [x] = c.splice(i, 1); c.splice(j, 0, x); tries.push(c); }
      }
      for (const c of tries) {
        if (ok.has(c.join('\u0001'))) continue;
        assert.equal(grade(q, c, lang).correct, false, `${q.id} ${lang}: ${c.join(' ')}`);
      }
    }
  }
});

test('the reviewer\'s wrong answers grade wrong', () => {
  const q = (id) => ALL.find((x) => x.id === id);
  assert.equal(grade(q('15-6'), ['IFERROR(', '"없음"', ',', 'XLOOKUP(', '"S12"', ',', 'A2:A9', ',', 'C2:C9', ')', ')'], 'ko').correct, false);
  assert.equal(grade(q('15-6'), ['IFERROR(', 'XLOOKUP(', '"S12"', ',', 'C2:C9', ',', 'A2:A9', ')', ',', '"없음"', ')'], 'ko').correct, false);
  assert.equal(grade(q('14-6'), ['IF(', 'OR(', 'D5', '<', 'G5', ',', 'D5', '/', 'F5', '<', '0.8', ')', ',', '"점검"', ',', '""', ')'], 'ko').correct, false);
});

// ---------- 2026-11-21: deferred points fixed ----------
test('a comparison written the other way round is a true rewrite', () => {
  const q = (id) => ALL.find((x) => x.id === id);
  const flipped = ['IF(', 'AND(', 'G4', '<=', 'D4', ',', 'F4', '/', 'D4', '>=', '0.85', ')', ',', '"우수"', ',', '"보통"', ')'];
  assert.equal(grade(q('14-5'), flipped, 'ko').correct, true);
  assert.equal(grade(q('12-5'), ['IF(', '2', '<=', 'COUNTIFS(', 'C2:C9', ',', '"B팀"', ',', 'D2:D9', ',', '">=45"', ')', ',', '"양호"', ',', '"점검"', ')'], 'ko').correct, true);
  assert.equal(grade(q('13-5'), ['IF(', '0.85', '<=', 'ROUND(', 'F5', '/', 'D5', ',', '2', ')', ',', '"달성"', ',', '"미달"', ')'], 'ko').correct, true);
});

test('a wrong build with the right value says the shape differs', () => {
  const p = page(BASIC, 'lesson-14');
  click(p.root.querySelector('[data-start]'));
  const qs = EXCEL_ADVANCED[2].questions;
  for (const q of qs.slice(0, 5)) {
    if (q.type === 'choice') click(p.root.querySelector(`[data-option="${q.answer}"]`));
    if (q.type === 'blank') click(p.root.querySelector(`[data-chip="${q.answer}"]`));
    if (q.type === 'build') break;
    click(p.root.querySelector('[data-next]'));
  }
  // 14-5: put the result cards the wrong way round only where the value still comes out the same
  const wrongOrder = ['IF(', 'AND(', 'D4', '>=', 'G4', ',', 'D4', '/', 'F4', '>=', '0.85', ')', ',', '"우수"', ',', '"보통"', ')'];
  const used = new Set();
  for (const w of wrongOrder) {
    const btn = [...p.root.querySelectorAll('[data-bank] [data-card]')].find((b) => b.textContent === w && !b.disabled && !used.has(b));
    used.add(btn);
    click(btn);
  }
  click(p.root.querySelector('[data-check]'));
  assert.ok(p.root.textContent.includes(ADVANCED_UI.orderHint.ko));
});

test('after the 11 basic lessons the list points to the advanced ones with a Continue button', () => {
  const p = page(BASIC);
  assert.ok(txt(p.root, '.ex-intro').includes(ADVANCED_UI.advancedNext.ko));
  const go = p.root.querySelector('[data-advanced] .ex-go');
  assert.equal(go.getAttribute('href'), '#lesson-12');
  assert.equal(go.textContent, EXCEL_UI.continue.ko);
  const later = page([...BASIC, '12', '13']);
  assert.equal(later.root.querySelector('[data-advanced] .ex-go').getAttribute('href'), '#lesson-14');
  assert.equal(page([...BASIC, '12', '13', '14', '15', '16']).root.querySelector('[data-advanced] .ex-go'), null);
});

test('next lesson skips finished ones and wraps round to an earlier open advanced lesson', async () => {
  const { nextLessonAfter } = await import('../../excel/engine.js');
  const p = (completed) => ({ completed, scores: {} });
  assert.equal(nextLessonAfter(p(['3', '6', '7', '15', '14']), '15'), '13', 'wraps round past the end');
  assert.equal(nextLessonAfter(p([...BASIC, '13']), '12'), '14', 'skips 13, already done');
  assert.equal(nextLessonAfter(p([...BASIC, '12', '13', '14', '15', '16']), '15'), null);
});

test('advanced builds keep the formula line in view and use smaller cards', () => {
  const p = page(BASIC, 'lesson-16');
  click(p.root.querySelector('[data-start]'));
  for (const q of EXCEL_ADVANCED[4].questions.slice(0, 4)) {
    if (q.type === 'choice') click(p.root.querySelector(`[data-option="${q.answer}"]`));
    if (q.type === 'blank') click(p.root.querySelector(`[data-chip="${q.answer}"]`));
    click(p.root.querySelector('[data-next]'));
  }
  assert.ok(p.root.querySelector('.ex-build.is-advanced [data-line]'));
});

// ---------- no advanced lessons for SMEs (2026-11-25) ----------
import { showsAdvancedExcel } from '../../shared/role.js';

const BASIC_DONE = () => fakeStorage({ [PROGRESS_KEY]: JSON.stringify({ completed: EXCEL_LESSONS.map((l) => l.id), scores: {} }) });
const excelPage = (storage, route, advanced) => {
  const { root } = setupDom();
  renderExcel(root, 'ko', storage, route, newExcelView(), { advanced });
  return root;
};

test('agents and SMEs are kept from advanced Excel (agents since 2026-11-26)', () => {
  for (const r of ['sme', 'agent']) assert.equal(showsAdvancedExcel(r), false, r);
  for (const r of ['tl', 'am', 'om']) assert.equal(showsAdvancedExcel(r), true, r);
});

// ---------- each role's own intro and "all done" (2026-11-26) ----------
import { EXCEL_ROLE_UI } from '../../excel/role-copy.js';

const ROLE_DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-26-excel-role-copy-design.md', import.meta.url), 'utf8');
const roleRows = (heading) => Object.fromEntries(ROLE_DOC.split(`### ${heading}`)[1].split(/\n#{2,3} /)[0].split('\n')
  .filter((l) => /^\| (agent|sme|tl|am|om) \|/.test(l))
  .map((l) => { const c = l.slice(1, -1).split(' | ').map((x) => x.trim()); return [c[0], { ko: c[1], en: c[2] }]; }));

test('each role reads its own Excel intro and "all done" line, as in the design', () => {
  assert.deepEqual(EXCEL_ROLE_UI.intro, roleRows('안내문'));
  assert.deepEqual(EXCEL_ROLE_UI.allDone, roleRows('11개를 모두 마쳤을 때'));
  assert.deepEqual(EXCEL_ROLE_UI.intro.tl, EXCEL_UI.intro, 'the team lead keeps the wording as now');
  assert.deepEqual(EXCEL_ROLE_UI.allDone.tl, EXCEL_UI.allDone);
});

test('the Excel page shows the role\'s intro, and an agent finishing sees the agent line', () => {
  const intro = (role, storage = fakeStorage(), advanced = true) => {
    const { root } = setupDom();
    renderExcel(root, 'ko', storage, '', newExcelView(), { advanced, role });
    return root.querySelector('.ex-intro p').textContent;
  };
  assert.equal(intro('agent', fakeStorage(), false), EXCEL_ROLE_UI.intro.agent.ko);
  assert.equal(intro('om'), EXCEL_ROLE_UI.intro.om.ko);
  assert.equal(intro(undefined), EXCEL_UI.intro.ko, 'no role: the wording as now');
  assert.equal(intro('agent', BASIC_DONE(), false), EXCEL_ROLE_UI.allDone.agent.ko);
  assert.equal(intro('sme', BASIC_DONE(), false), EXCEL_ROLE_UI.allDone.sme.ko);
});

test('an SME never sees advanced Excel', () => {
  const s = BASIC_DONE();
  const listRoot = excelPage(s, '', false);
  assert.equal(listRoot.querySelector('[data-advanced]'), null);
  assert.ok(!listRoot.textContent.includes(ADVANCED_UI.advancedNext.ko));
  const viaAddress = excelPage(s, `lesson-${EXCEL_ADVANCED[0].id}`, false);
  assert.ok(viaAddress.querySelector('ol.ex-list'), 'an advanced address shows the list');
  assert.equal(viaAddress.querySelector('[data-advanced]'), null);
  // A team lead still gets them.
  assert.ok(excelPage(s, '', true).querySelector('[data-advanced]'));
  assert.ok(excelPage(s, '', undefined).querySelector('[data-advanced]'), 'advanced is shown by default');
});

test('advanced progress is kept but not asked', async () => {
  const { pool } = await import('../../practice/engine.js');
  const adv = EXCEL_ADVANCED[0].id;
  const stored = JSON.stringify({ completed: [...EXCEL_LESSONS.map((l) => l.id), adv], scores: {} });
  const sme = fakeStorage({ [PROGRESS_KEY]: stored, 'queuecraft:role': 'sme' });
  assert.ok(!pool(sme).some((q) => q.course === 'excel' && q.lessonId === adv));
  assert.equal(sme.getItem(PROGRESS_KEY), stored, 'the record is untouched');
  const tl = fakeStorage({ [PROGRESS_KEY]: stored, 'queuecraft:role': 'tl' });
  assert.ok(pool(tl).some((q) => q.course === 'excel' && q.lessonId === adv));
});
