// The SME course "서포트 라이프사이클" (2026-11-25). The Korean must be the approved
// copy, word for word: docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateCourse } from '../js/engine/lessonSchema.js';
import { lessonText } from './helpers.js';
import { SL_LESSONS } from '../../sme-lifecycle/lessons/index.js';
import { SL_UI, SL_PROGRESS_KEY, SL_FIGURE } from '../../sme-lifecycle/ui.js';
import { SME_FIGURE } from '../../sme/ui.js';
import { HOME_COPY } from '../../home/role-home.js';

const COPY = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md', import.meta.url), 'utf8');
const cells = (line) => line.slice(1, -1).split(' | ').map((c) => c.trim());

// One lesson section of the copy file → the fields a lesson file carries.
function parseLesson(section) {
  const lines = section.split('\n');
  const out = { steps: [], questions: [] };
  let inSteps = false;
  for (const line of lines.slice(1)) {
    if (line.startsWith('스텝:') || line.startsWith('Steps:')) { inSteps = true; continue; }
    if (line.startsWith('체크포인트:') || line.startsWith('Checkpoint:')) { inSteps = false; continue; }
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
const lessonsOf = (doc) => doc.split(/^## 레슨 \d+\. /m).slice(1).map((s) => parseLesson(s.split(/^## /m)[0]));
const PARSED = lessonsOf(COPY);
const ORDINALS = ['첫', '둘째', '셋째', '넷째'];
const IDS = ['trainee', 'graduate', 'regular', 'senior', 'leadsupport'];
const row = (doc, place) => cells(doc.split('\n').find((x) => x.startsWith(`| ${place} |`)))[1];

test('the support lifecycle passes the course rules', () => {
  assert.deepEqual(validateCourse(SL_LESSONS, { lessonCount: 5, loop: false, figure: SL_FIGURE }), []);
  assert.equal(SL_FIGURE, SME_FIGURE);
  assert.equal(SL_PROGRESS_KEY, 'sme-lifecycle:v1');
});

test('five lessons in the approved order', () => {
  assert.equal(PARSED.length, 5);
  assert.deepEqual(SL_LESSONS.map((l) => l.id), IDS);
  assert.deepEqual(SL_LESSONS.map((l) => l.order), [1, 2, 3, 4, 5]);
  for (const id of IDS) assert.ok(!id.includes('-'), id);
});

test('the Korean is the approved copy, word for word', () => {
  SL_LESSONS.forEach((l, i) => {
    const c = PARSED[i];
    assert.equal(l.title.ko, c.title, l.id);
    assert.equal(l.short.ko, c.short, l.id);
    assert.equal(l.subtitle.ko, c.subtitle, l.id);
    assert.deepEqual(l.procedure.map((id) => l.diagram.nodes.find((n) => n.id === id).label.ko), c.nodes, l.id);
    assert.deepEqual(l.steps.map((s) => s.caption.ko), c.steps, l.id);
    assert.equal(l.checkpoint.length, c.questions.length, l.id);
    l.checkpoint.forEach((q, k) => {
      const want = c.questions[k];
      assert.equal(q.id, `${l.id}-q${k + 1}`);
      assert.equal(q.prompt.ko, want.prompt, q.id);
      assert.equal(q.answer, want.answer, q.id);
      assert.equal(q.explanation.ko, want.explanation, q.id);
      assert.deepEqual(q.options.map((o) => ({ id: o.id, text: o.text.ko, ...(o.feedback ? { feedback: o.feedback.ko } : {}) })), want.options, q.id);
    });
    assert.equal(l.connection.text.ko, c.connection, l.id);
  });
});

test('right answers carry no feedback and every wrong answer has one', () => {
  for (const q of SL_LESSONS.flatMap((l) => l.checkpoint)) {
    for (const o of q.options) assert.equal(Boolean(o.feedback), o.id !== q.answer, `${q.id} ${o.id}`);
  }
});

test('each step that names a stage lights up that stage', () => {
  for (const l of SL_LESSONS) {
    l.steps.forEach((s, i) => {
      const k = ORDINALS.findIndex((o) => s.caption.ko.startsWith(`${o} 단계는`));
      if (k === -1) return;
      assert.deepEqual(s.highlight, [l.procedure[k]], `${l.id} step ${i + 1}`);
    });
    assert.deepEqual(l.steps[0].highlight, l.procedure, `${l.id} step 1 shows every stage`);
  }
});

test('Seojun everywhere but lesson 4, Junho in lesson 4', () => {
  for (const l of SL_LESSONS) assert.equal(l.personaName.ko, l.id === 'senior' ? '준호' : '서준', l.id);
  assert.ok(lessonText(SL_LESSONS.find((l) => l.id === 'senior'), 'ko').includes('서준'));
});

test('every box sits inside the picture and none overlap', () => {
  for (const l of SL_LESSONS) {
    const boxes = l.diagram.nodes.map((n) => ({ id: n.id, l: n.x - (n.hw ?? 54), r: n.x + (n.hw ?? 54), t: n.y - 17, b: n.y + 17 }));
    for (const b of boxes) assert.ok(b.l >= 2 && b.r <= 358 && b.t >= 2 && b.b <= 238, `${l.id}: ${b.id}`);
    boxes.forEach((a, i) => boxes.slice(i + 1).forEach((b) => {
      assert.ok(a.r + 6 <= b.l || b.r + 6 <= a.l || a.b + 6 <= b.t || b.b + 6 <= a.t, `${l.id}: ${a.id} overlaps ${b.id}`);
    }));
  }
});

test('the course words are the approved copy', () => {
  assert.equal(SL_UI.courseTitle.ko, row(COPY, '강의 제목'));
  assert.equal(SL_UI.courseTagline.ko, row(COPY, '강의 소개'));
  assert.equal(SL_UI.listNote.ko, row(COPY, '숫자 안내'));
  assert.equal(SL_UI.homeCard.ko, row(COPY, '홈 카드'));
  assert.equal(SL_UI.homeCard.ko, HOME_COPY.supportLifecycle.text.ko);
  assert.equal(SL_UI.personaName.ko, row(COPY, '원 가운데 이름'));
  assert.equal(SL_UI.loop.ko, row(COPY, '순환 안내 (원 아래)'));
  assert.deepEqual(SL_LESSONS.map((l) => l.short.ko), row(COPY, '원 안 짧은 이름').split(' · '));
});

// ---------- the course page (Task 2) ----------
import { setupDom } from './dom.js';
import { renderHome } from '../js/render/home.js';
import { renderLesson } from '../js/render/lesson.js';
import { parseRoute, lessonHref } from '../js/engine/router.js';
import { LESSONS } from '../js/lessons/index.js';

function openLesson(id, stepIndex = 0, lang = 'ko') {
  const { root } = setupDom();
  renderLesson(root, SL_LESSONS.find((l) => l.id === id), stepIndex, lang, { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: SL_LESSONS.length, text: SL_UI });
  return root;
}

test('the ring shows five stages with Seojun in the middle', () => {
  const { root } = setupDom();
  renderHome(root, SL_LESSONS, { completed: ['trainee'] }, 'ko', SL_UI);
  assert.equal(root.querySelector('h1').textContent, SL_UI.courseTitle.ko);
  assert.equal(root.querySelector('.tagline').textContent, SL_UI.courseTagline.ko);
  const cards = [...root.querySelectorAll('.stage-card')];
  assert.deepEqual(cards.map((a) => a.getAttribute('href')), IDS.map((id) => `#${id}-0`));
  assert.ok(cards[0].classList.contains('is-done'));
  assert.ok(!cards[1].classList.contains('is-done'));
  assert.deepEqual([...root.querySelectorAll('svg .stage-name')].map((t) => t.textContent), row(COPY, '원 안 짧은 이름').split(' · '));
  assert.equal(root.querySelector('.ring-center text').textContent, '서준');
  assert.equal(root.querySelector('.loop-note').textContent, `↺ ${SL_UI.loop.ko}`);
  assert.equal(root.querySelector('[data-track-hint]'), null);
});

test('the team-lead ring is unchanged', () => {
  const { root } = setupDom();
  renderHome(root, LESSONS, { completed: [] }, 'ko');
  assert.ok(root.querySelector('[data-track-hint]'));
  assert.equal(root.querySelector('.ring-center text').textContent, '지민');
  assert.equal(root.querySelector('h1').textContent, '상담사 라이프사이클');
});

test('a lesson counts out of five, says SME checkpoint, and the last one leads to the list', () => {
  const first = openLesson('trainee');
  assert.equal(first.querySelector('.eyebrow').textContent, '1 / 5');
  assert.equal(first.querySelector('[data-next-lesson]').getAttribute('href'), '#graduate-0');
  assert.ok(first.textContent.includes(SL_UI.checkpoint.ko));
  assert.equal(openLesson('leadsupport').querySelector('[data-next-lesson]').getAttribute('href'), '#home');
  assert.equal(openLesson('senior', 3).querySelector('[data-persona] text').textContent, '준호');
});

test('stale addresses open the list', () => {
  for (const hash of ['#home', '#nesting-2', '#lead-0', '', '#nope']) assert.deepEqual(parseRoute(hash, IDS), { view: 'home' }, hash);
  const route = parseRoute('#trainee-99', IDS);
  assert.equal(route.id, 'trainee');
  const { root } = setupDom();
  renderLesson(root, SL_LESSONS[0], route.step, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: 5, text: SL_UI });
  assert.ok(root.querySelector('.eyebrow'));
});

test('every lesson address opens that lesson', () => {
  for (const id of IDS) assert.deepEqual(parseRoute(lessonHref(id, 3), IDS), { view: 'lesson', id, step: 3 }, id);
});

// ---------- connected to practice (Task 3) ----------
import { fakeStorage } from './helpers.js';
import { pool } from '../../practice/engine.js';
import { renderPractice, newPracticeView } from '../../practice/render.js';
import { COURSE_INFO } from '../../shared/courses.js';

test('support lifecycle questions link to their own course', () => {
  assert.deepEqual(COURSE_INFO['sme-lifecycle'], { key: SL_PROGRESS_KEY, lessons: SL_LESSONS, dir: 'sme-lifecycle/' });
  const s = fakeStorage({ 'sme-lifecycle:v1': JSON.stringify({ completed: ['trainee'] }) });
  assert.deepEqual(pool(s).map((q) => q.key), ['sme-lifecycle:trainee-q1', 'sme-lifecycle:trainee-q2']);
  const { root } = setupDom();
  renderPractice(root, 'ko', s, '2026-11-25', newPracticeView());
  root.querySelector('[data-question] [data-option]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(root.querySelector('a[data-review]').getAttribute('href'), '../sme-lifecycle/#trainee-0');
});
