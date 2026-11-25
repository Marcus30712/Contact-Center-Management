// The SME course "SME 첫걸음" (2026-11-25). The Korean must be the approved
// copy, word for word: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateCourse } from '../js/engine/lessonSchema.js';
import { lessonText } from './helpers.js';
import { SME_LESSONS } from '../../sme/lessons/index.js';
import { SME_UI, SME_PROGRESS_KEY, SME_FIGURE } from '../../sme/ui.js';
import { SOP_FIGURE } from '../../sop-library/ui.js';

const COPY = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md', import.meta.url), 'utf8');
const cells = (line) => line.slice(1, -1).split(' | ').map((c) => c.trim());

// One lesson section of the copy file → the fields a lesson file carries.
function parseLesson(section) {
  const lines = section.split('\n');
  const out = { heading: lines[0].trim(), steps: [], questions: [] };
  let inSteps = false;
  for (const line of lines.slice(1)) {
    if (line.startsWith('스텝:')) { inSteps = true; continue; }
    if (line.startsWith('체크포인트:')) { inSteps = false; continue; }
    const step = inSteps && line.match(/^\d+\. (.+)$/);
    if (step) { out.steps.push(step[1]); continue; }
    if (!line.startsWith('| ') || line.startsWith('| 항목') || line.startsWith('|---')) continue;
    const [key, value] = cells(line);
    let m;
    if (key === '제목') out.title = value;
    else if (key === '짧은 이름') out.short = value;
    else if (key === '부제') out.subtitle = value;
    else if (key === '노드') out.nodes = value.split(' · ');
    else if (/^\d번 질문$/.test(key)) out.questions.push({ prompt: value, options: [] });
    else if ((m = key.match(/^보기 ([a-c]) \((오답|정답)\)$/))) {
      const q = out.questions.at(-1);
      q.options.push({ id: m[1], text: value });
      if (m[2] === '정답') q.answer = m[1];
    } else if ((m = key.match(/^([a-c]) 피드백$/))) out.questions.at(-1).options.find((o) => o.id === m[1]).feedback = value;
    else if (key === '해설') out.questions.at(-1).explanation = value;
    else if (key === '다음 레슨 연결' || key === '마지막 연결') out.connection = value;
  }
  return out;
}
const PARSED = COPY.split(/^## 레슨 \d+\. /m).slice(1).map((s) => parseLesson(s.split(/^## /m)[0]));
const ORDINALS = ['첫', '둘째', '셋째', '넷째'];

test('the SME course passes the course rules', () => {
  assert.deepEqual(validateCourse(SME_LESSONS, { lessonCount: 7, loop: false, figure: SME_FIGURE }), []);
  assert.equal(SME_FIGURE, SOP_FIGURE);
  assert.equal(SME_PROGRESS_KEY, 'sme-course:v1');
});

test('seven lessons in the approved order', () => {
  assert.equal(PARSED.length, 7);
  assert.deepEqual(SME_LESSONS.map((l) => l.id), ['first-day', 'newcomer', 'escalation', 'peer', 'lead', 'priority', 'knowledge']);
  assert.deepEqual(SME_LESSONS.map((l) => l.order), [1, 2, 3, 4, 5, 6, 7]);
});

test('the Korean is the approved copy, word for word', () => {
  SME_LESSONS.forEach((l, i) => {
    const c = PARSED[i];
    assert.equal(l.title.ko, c.title, l.id);
    assert.equal(l.short.ko, c.short, l.id);
    assert.equal(l.subtitle.ko, c.subtitle, l.id);
    assert.deepEqual(l.procedure.map((id) => l.diagram.nodes.find((n) => n.id === id).label.ko), c.nodes, l.id);
    assert.deepEqual(l.steps.map((s) => s.caption.ko), c.steps, l.id);
    assert.equal(l.checkpoint.length, c.questions.length, l.id);
    l.checkpoint.forEach((q, k) => {
      const want = c.questions[k];
      assert.equal(q.prompt.ko, want.prompt, q.id);
      assert.equal(q.answer, want.answer, q.id);
      assert.equal(q.explanation.ko, want.explanation, q.id);
      assert.deepEqual(q.options.map((o) => ({ id: o.id, text: o.text.ko, ...(o.feedback ? { feedback: o.feedback.ko } : {}) })), want.options, q.id);
    });
    assert.equal(l.connection.text.ko, c.connection, l.id);
  });
});

test('right answers carry no feedback and every wrong answer has one', () => {
  for (const q of SME_LESSONS.flatMap((l) => l.checkpoint)) {
    for (const o of q.options) assert.equal(Boolean(o.feedback), o.id !== q.answer, `${q.id} ${o.id}`);
  }
});

test('each step that names a stage lights up that stage', () => {
  for (const l of SME_LESSONS) {
    l.steps.forEach((s, i) => {
      const k = ORDINALS.findIndex((o) => s.caption.ko.startsWith(`${o} 단계는`));
      if (k === -1) return;
      assert.deepEqual(s.highlight, [l.procedure[k]], `${l.id} step ${i + 1}`);
    });
    assert.deepEqual(l.steps[0].highlight, l.procedure, `${l.id} step 1 shows every stage`);
  }
});

test('Seojun in lesson 2, Junho in lesson 4, Jimin everywhere else', () => {
  const by = (id) => SME_LESSONS.find((l) => l.id === id);
  assert.deepEqual(by('newcomer').personaName?.ko, '서준');
  assert.deepEqual(by('peer').personaName?.ko, '준호');
  for (const id of ['first-day', 'escalation', 'lead', 'priority', 'knowledge']) {
    assert.equal(by(id).personaName, undefined, id);
    assert.ok(lessonText(by(id), 'ko').includes('지민'), id);
  }
  assert.ok(!SME_LESSONS.some((l) => lessonText(l, 'ko').includes('도윤')), 'Doyun belongs to the PIP SOP');
});

test('every box sits inside the picture and none overlap', () => {
  for (const l of SME_LESSONS) {
    const boxes = l.diagram.nodes.map((n) => ({ id: n.id, l: n.x - (n.hw ?? 54), r: n.x + (n.hw ?? 54), t: n.y - 17, b: n.y + 17 }));
    for (const b of boxes) assert.ok(b.l >= 2 && b.r <= 358 && b.t >= 2 && b.b <= 238, `${l.id}: ${b.id}`);
    boxes.forEach((a, i) => boxes.slice(i + 1).forEach((b) => {
      assert.ok(a.r + 6 <= b.l || b.r + 6 <= a.l || a.b + 6 <= b.t || b.b + 6 <= a.t, `${l.id}: ${a.id} overlaps ${b.id}`);
    }));
    const ys = l.procedure.map((id) => l.diagram.nodes.find((n) => n.id === id).y);
    ys.slice(1).forEach((y, i) => assert.ok(y - ys[i] >= 48, `${l.id}: rows at least 48 apart`));
  }
});

test('the course words are the approved copy', () => {
  const row = (place) => cells(COPY.split('\n').find((x) => x.startsWith(`| ${place} |`)))[1];
  assert.equal(SME_UI.courseTitle.ko, row('강의 제목'));
  assert.equal(SME_UI.courseTagline.ko, row('강의 소개'));
  assert.equal(SME_UI.listNote.ko, row('숫자 안내'));
  assert.equal(SME_UI.homeCard.ko, row('홈 카드'));
});
