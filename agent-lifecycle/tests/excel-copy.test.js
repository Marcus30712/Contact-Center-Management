// The Excel lessons must say exactly what the confirmed copy files say.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EXCEL_UI, SHEETS, EXCEL_LESSONS } from '../../excel/data.js';

const read = (name) => readFileSync(new URL(`../../docs/superpowers/specs/${name}`, import.meta.url), 'utf8');
const KO = read('2026-11-20-excel-practice-copy.md');
const EN = read('2026-11-20-excel-practice-copy.en.md');

const L = {
  ko: { table: '## 예시 표', headers: '화면 머리글(짧게)', title: '표 제목', ui: '## 화면 문구', lesson: '## 레슨 ', cards: '### 설명 카드', summary: '### 요약',
    types: { 객관식: 'choice', 빈칸: 'blank', '수식 조립': 'build', '칸 누르기': 'cell', '단계 맞추기': 'steps' },
    keys: { 질문: 'prompt', 보기: 'options', 정답: 'answer', 해설: 'explanation', 범위: 'template', 주소: 'template', 수식: 'template', 메뉴: 'template', 칩: 'chips', '결과 값': 'result', '카드(정답 순서)': 'cards', '헷갈림 카드': 'decoys', '단계(정답 순서)': 'steps', '헷갈림 단계': 'decoys', '맞힌 뒤 보여 줄 표': 'after' },
    any: ['[순서 무관]', '[/순서 무관]'] },
  en: { table: '## Example table', headers: 'Short headers on screen', title: 'Table title', ui: '## Screen wording', lesson: '## Lesson ', cards: '### Cards', summary: '### Summary',
    types: { choice: 'choice', blank: 'blank', build: 'build', cell: 'cell', steps: 'steps' },
    keys: { Question: 'prompt', Options: 'options', Answer: 'answer', Explanation: 'explanation', Range: 'template', Address: 'template', Formula: 'template', Menu: 'template', Chips: 'chips', Result: 'result', 'Cards (answer order)': 'cards', 'Decoy cards': 'decoys', 'Steps (answer order)': 'steps', 'Decoy steps': 'decoys', 'Table after': 'after' },
    any: ['[any order]', '[/any order]'] },
};

const unquote = (s) => s.trim().replace(/^`|`$/g, '');
const list = (s) => s.split(' · ').map(unquote);

function parse(doc, lang) {
  const t = L[lang];
  const lines = doc.split('\n');
  const after = (marker) => lines.slice(lines.findIndex((l) => l.startsWith(marker)) + 1);
  const tableRows = (from) => {
    const out = [];
    let started = false;
    for (const l of from) {
      if (l.startsWith('|')) { started = true; out.push(l.slice(1, -1).split(' | ').map((c) => c.trim())); } else if (started) break;
    }
    return out.slice(2);
  };
  const sheetRows = tableRows(after(t.table));
  const field = (label) => lines.find((l) => l.startsWith(`- ${label}: `)).slice(label.length + 4);
  const ui = Object.fromEntries(tableRows(after(t.ui)));
  const lessons = [];
  let lesson = null;
  let q = null;
  let section = null;
  for (const l of lines) {
    if (l.startsWith(t.lesson)) {
      const [, id, title] = /^## \S+ (\d+) · (.+)$/.exec(l);
      lesson = { id, title, cards: [], summary: [], questions: [] };
      lessons.push(lesson);
      section = null;
    } else if (!lesson) {
      // still in the preamble
    } else if (l === t.cards) section = 'cards';
    else if (l === t.summary) section = 'summary';
    else if (l.startsWith('#### ')) {
      const [, id, type] = /^#### (\d+-\d+) · (.+)$/.exec(l);
      q = { id, type: t.types[type] };
      lesson.questions.push(q);
      section = 'q';
    } else if (section === 'cards' && /^\d+\. /.test(l)) lesson.cards.push(l.replace(/^\d+\. /, ''));
    else if (section === 'summary' && l.startsWith('- ')) lesson.summary.push(l.slice(2));
    else if (section === 'q' && l.startsWith('- ')) {
      const i = l.indexOf(': ');
      const key = t.keys[l.slice(2, i)];
      assert.ok(key, `${lang} unknown field in ${q.id}: ${l}`);
      q[key] = l.slice(i + 2);
    }
  }
  return { sheetRows, headers: list(field(t.headers)), title: field(t.title), ui, lessons };
}

const P = { ko: parse(KO, 'ko'), en: parse(EN, 'en') };

test('screen wording matches both copy files', () => {
  assert.deepEqual(Object.keys(EXCEL_UI), Object.keys(P.ko.ui));
  assert.deepEqual(Object.keys(P.en.ui), Object.keys(P.ko.ui));
  for (const k of Object.keys(P.ko.ui)) assert.deepEqual(EXCEL_UI[k], { ko: P.ko.ui[k], en: P.en.ui[k] }, k);
});

test('the example table matches both copy files', () => {
  for (const lang of ['ko', 'en']) {
    const s = SHEETS[lang];
    assert.equal(s.title, P[lang].title);
    assert.deepEqual(s.headers, P[lang].headers);
    P[lang].sheetRows.forEach(([row, ...vals]) => vals.forEach((v, j) => {
      const want = /^\d+$/.test(v) ? Number(v) : v;
      assert.equal(s.cells[`${'ABCDEFG'[j]}${row}`], want, `${lang} ${'ABCDEFG'[j]}${row}`);
    }));
    assert.equal(s.cells.D1, s.headers[3]);
  }
});

test('every lesson and question matches both copy files', () => {
  assert.equal(EXCEL_LESSONS.length, 11);
  const bi = (ko, en) => ({ ko, en });
  EXCEL_LESSONS.forEach((lesson, li) => {
    const ko = P.ko.lessons[li];
    const en = P.en.lessons[li];
    assert.equal(lesson.id, ko.id);
    assert.deepEqual(lesson.title, bi(ko.title, en.title));
    assert.deepEqual(lesson.cards, ko.cards.map((c, i) => bi(c, en.cards[i])));
    assert.deepEqual(lesson.summary, ko.summary.map((c, i) => bi(c, en.summary[i])));
    assert.equal(lesson.questions.length, 6);
    lesson.questions.forEach((q, qi) => {
      const k = ko.questions[qi];
      const e = en.questions[qi];
      const at = `${k.id}`;
      assert.equal(q.id, k.id, at);
      assert.equal(q.type, k.type, at);
      assert.equal(e.type, k.type, at);
      assert.deepEqual(q.prompt, bi(k.prompt, e.prompt), at);
      assert.deepEqual(q.explanation, bi(k.explanation, e.explanation), at);
      if (q.type === 'choice') {
        const ko3 = list(k.options);
        const en3 = list(e.options);
        assert.deepEqual(q.options, ko3.map((o, i) => bi(o, en3[i])), at);
        assert.equal(q.answer, ko3.indexOf(k.answer), at);
        assert.equal(en3.indexOf(e.answer), q.answer, `${at} en answer`);
      }
      if (q.type === 'blank') {
        assert.deepEqual(q.template, bi(unquote(k.template), unquote(e.template)), at);
        const kc = list(k.chips);
        const ec = list(e.chips);
        assert.deepEqual(q.chips, kc.map((c, i) => bi(c, ec[i])), at);
        assert.equal(q.answer, kc.indexOf(k.answer), at);
        assert.equal(ec.indexOf(e.answer), q.answer, `${at} en answer`);
      }
      if (q.type === 'build') {
        assert.deepEqual(q.cards, bi(list(k.cards), list(e.cards)), at);
        assert.deepEqual(q.decoys, bi(list(k.decoys), list(e.decoys)), at);
      }
      if (q.type === 'build' || (q.type === 'blank' && k.result)) {
        const num = (s) => (s === 'TRUE' ? true : s === 'FALSE' ? false : /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : s);
        assert.deepEqual(q.result, bi(num(k.result), num(e.result)), at);
      }
      if (q.type === 'cell') {
        assert.equal(q.answer, k.answer, at);
        assert.equal(e.answer, k.answer, at);
      }
      if (q.type === 'steps') {
        const flat = (s, lang) => list(s.replace(L[lang].any[0], '').replace(L[lang].any[1], '').replace(/\s+·\s+$/, '').trim());
        assert.deepEqual(q.steps, bi(flat(k.steps, 'ko'), flat(e.steps, 'en')), at);
        assert.deepEqual(q.decoys, bi(list(k.decoys), list(e.decoys)), at);
        const group = k.steps.includes(L.ko.any[0]);
        assert.equal(q.anyOrder.length > 0, group, at);
        assert.equal(e.steps.includes(L.en.any[0]), group, `${at} en group`);
        assert.ok(q.after, at);
      }
    });
  });
});

test('question mix per lesson follows the design', () => {
  const hands = { 1: 'cell', 9: 'steps', 10: 'steps', 11: 'steps' };
  for (const lesson of EXCEL_LESSONS) {
    const types = lesson.questions.map((q) => q.type);
    assert.deepEqual(types, ['choice', 'choice', 'blank', 'blank', hands[lesson.id] ?? 'build', hands[lesson.id] ?? 'build'], lesson.id);
  }
});

test('English has no Hangul and no banned word anywhere', () => {
  const walk = (v, path) => {
    if (v && typeof v === 'object' && 'ko' in v && 'en' in v) {
      const en = Array.isArray(v.en) ? v.en.join(' ') : String(v.en);
      assert.ok(!/[가-힣]/.test(en), `${path}: ${en}`);
      assert.ok(!String(v.ko).includes('진상'), path);
      return;
    }
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
  };
  walk({ EXCEL_UI, EXCEL_LESSONS }, 'data');
  assert.ok(!Object.values(SHEETS.en.cells).some((v) => /[가-힣]/.test(String(v))));
});
