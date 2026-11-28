// The AM course "부매니저 SOP 라이브러리" (2026-11-28). The Korean must be the approved
// copy, word for word: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validateCourse } from '../js/engine/lessonSchema.js';
import { lessonText } from './helpers.js';
import { AMS_LESSONS } from '../../am-sop/lessons/index.js';
import { AMS_UI, AMS_PROGRESS_KEY, AMS_FIGURE } from '../../am-sop/ui.js';
import { AM_FIGURE } from '../../am/ui.js';
import { HOME_COPY } from '../../home/role-home.js';

const COPY = readFileSync(new URL('../../docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md', import.meta.url), 'utf8');
const cells = (line) => line.slice(1, -1).split(' | ').map((c) => c.trim());

// One lesson section of a copy file → the fields a lesson file carries.
function parseLesson(section) {
  const out = { steps: [], questions: [] };
  let inSteps = false;
  for (const line of section.split('\n').slice(1)) {
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
    else if (key === '누가') out.roles = value;
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
const ORDINALS = ['첫', '둘째', '셋째', '넷째', '다섯째'];
const IDS = ['weekly', 'instructions', 'escalation', 'risk', 'review', 'requests', 'backup', 'cover'];
const row = (doc, place) => cells(doc.split('\n').find((x) => x.startsWith(`| ${place} |`)))[1];
const SCREEN_KEYS = ['home', 'checkpoint', 'connection', 'nextLesson', 'toList', 'done'];

test('the AM SOP course passes the course rules', () => {
  assert.deepEqual(validateCourse(AMS_LESSONS, { lessonCount: 8, loop: false, figure: AMS_FIGURE }), []);
  assert.equal(AMS_FIGURE, AM_FIGURE);
  assert.equal(AMS_PROGRESS_KEY, 'am-sop:v1');
});

test('eight procedures in the approved order', () => {
  assert.equal(PARSED.length, 8);
  assert.deepEqual(AMS_LESSONS.map((l) => l.id), IDS);
  assert.deepEqual(AMS_LESSONS.map((l) => l.order), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const id of IDS) assert.ok(!id.includes('-'), id);
});

test('the Korean is the approved copy, word for word', () => {
  AMS_LESSONS.forEach((l, i) => {
    const c = PARSED[i];
    assert.equal(l.title.ko, c.title, l.id);
    assert.equal(l.short.ko, c.short, l.id);
    assert.equal(l.subtitle.ko, c.subtitle, l.id);
    assert.equal(l.roles.ko, c.roles, l.id);
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
  for (const q of AMS_LESSONS.flatMap((l) => l.checkpoint)) {
    for (const o of q.options) assert.equal(Boolean(o.feedback), o.id !== q.answer, `${q.id} ${o.id}`);
  }
});

test('each step that names a stage lights up that stage', () => {
  for (const l of AMS_LESSONS) {
    l.steps.forEach((s, i) => {
      // The ordinal may open the caption or a later sentence ("…요청합니다. 첫 단계는 …").
      const k = ORDINALS.findIndex((o) => new RegExp(`(^|\\. )${o} 단계는`).test(s.caption.ko));
      if (k === -1) return;
      assert.deepEqual(s.highlight, [l.procedure[k]], `${l.id} step ${i + 1}`);
    });
    assert.deepEqual(l.steps[0].highlight, l.procedure, `${l.id} step 1 shows every stage`);
  }
});

test('the people in each procedure', () => {
  // Minseok leads every procedure, as in AM First Steps.
  for (const l of AMS_LESSONS) {
    assert.deepEqual(l.personaName, { ko: '민석', en: 'Minseok' }, l.id);
    assert.ok(lessonText(l, 'ko').includes('민석'), l.id);
  }
});

test('every box sits inside the picture, none overlap, rows at least 48 apart', () => {
  for (const l of AMS_LESSONS) {
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
  assert.equal(AMS_UI.courseTitle.ko, row(COPY, '강의 제목'));
  assert.equal(AMS_UI.courseTagline.ko, row(COPY, '강의 소개'));
  assert.equal(AMS_UI.listNote.ko, row(COPY, '숫자 안내'));
  assert.equal(AMS_UI.homeCard.ko, row(COPY, '홈 카드'));
  assert.equal(AMS_UI.homeCard.ko, HOME_COPY.amSop.text.ko);
  assert.equal(AMS_UI.rolesLabel.ko, row(COPY, '누가 표시'));
  assert.deepEqual(SCREEN_KEYS.map((k) => AMS_UI[k].ko), row(COPY, '레슨 화면 버튼').split(' · '));
});

// ---------- the course page ----------
import { setupDom } from './dom.js';
import { renderLesson } from '../js/render/lesson.js';
import { parseRoute, lessonHref } from '../js/engine/router.js';
import { renderAmSopHome } from '../../am-sop/home.js';

function openLesson(id, stepIndex = 0, lang = 'ko') {
  const { root } = setupDom();
  renderLesson(root, AMS_LESSONS.find((l) => l.id === id), stepIndex, lang, { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: AMS_LESSONS.length, text: AMS_UI });
  return root;
}

test('the list shows the eight procedures in order with who and done marks', () => {
  const { root } = setupDom();
  renderAmSopHome(root, AMS_LESSONS, { completed: ['risk'] }, 'ko');
  assert.equal(root.querySelector('h1').textContent, AMS_UI.courseTitle.ko);
  assert.equal(root.querySelector('.tagline').textContent, AMS_UI.courseTagline.ko);
  assert.equal(root.querySelector('[data-list-note]').textContent, AMS_UI.listNote.ko);
  const links = [...root.querySelectorAll('ol[data-am-sop-list] a[data-am-sop]')];
  assert.deepEqual(links.map((a) => a.getAttribute('href')), IDS.map((id) => `#${id}-0`));
  assert.deepEqual(links.map((a) => a.querySelector('.stage-card-num').textContent), ['1', '2', '3', '4', '5', '6', '7', '8']);
  links.forEach((a, i) => {
    const l = AMS_LESSONS[i];
    assert.ok(a.textContent.includes(l.title.ko) && a.textContent.includes(l.subtitle.ko), l.id);
    assert.equal(a.querySelector('[data-roles]').textContent, `누가: ${l.roles.ko}`);
    assert.equal(a.classList.contains('is-done'), l.id === 'risk');
  });
});

test('a lesson counts out of eight, says AM checkpoint and Next SOP, and the last one leads to the list', () => {
  const first = openLesson('weekly');
  assert.equal(first.querySelector('.eyebrow').textContent, '1 / 8');
  assert.equal(first.querySelector('[data-next-lesson]').getAttribute('href'), '#instructions-0');
  assert.ok(first.textContent.includes(AMS_UI.checkpoint.ko));
  assert.ok(first.textContent.includes('다음 SOP'));
  assert.equal(openLesson('cover').querySelector('[data-next-lesson]').getAttribute('href'), '#home');
});

test('stale addresses open the list', () => {
  for (const hash of ['#home', '#outage-2', '#pip-0', '', '#nope']) assert.deepEqual(parseRoute(hash, IDS), { view: 'home' }, hash);
  const route = parseRoute('#weekly-99', IDS);
  assert.equal(route.id, 'weekly');
  const { root } = setupDom();
  renderLesson(root, AMS_LESSONS[0], route.step, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: 8, text: AMS_UI });
  assert.ok(root.querySelector('.eyebrow'));
});

test('every lesson address opens that lesson', () => {
  for (const id of IDS) assert.deepEqual(parseRoute(lessonHref(id, 3), IDS), { view: 'lesson', id, step: 3 }, id);
});

// ---------- connected to practice ----------
import { fakeStorage } from './helpers.js';
import { pool } from '../../practice/engine.js';
import { renderPractice, newPracticeView } from '../../practice/render.js';
import { COURSE_INFO } from '../../shared/courses.js';

test('AM SOP questions link to their own course', () => {
  assert.deepEqual(COURSE_INFO['am-sop'], { key: AMS_PROGRESS_KEY, lessons: AMS_LESSONS, dir: 'am-sop/' });
  // Other courses have escalation and review lessons too; this one opens its own.
  const s = fakeStorage({ 'am-sop:v1': JSON.stringify({ completed: ['backup'] }) });
  assert.deepEqual(pool(s).map((q) => q.key), ['am-sop:backup-q1', 'am-sop:backup-q2']);
  const { root } = setupDom();
  renderPractice(root, 'ko', s, '2026-11-28', newPracticeView());
  // Pick a wrong option for whichever question shows, so the review link appears.
  const key = root.querySelector('[data-question]').getAttribute('data-question');
  const q = AMS_LESSONS.flatMap((l) => l.checkpoint).find((x) => `am-sop:${x.id}` === key);
  const wrong = q.options.find((o) => o.id !== q.answer).id;
  root.querySelector(`[data-question] [data-option="${wrong}"]`).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(root.querySelector('a[data-review]').getAttribute('href'), '../am-sop/#backup-0');
});

// ---------- English: docs/superpowers/specs/2026-11-28-am-sop-copy.en.md ----------
const EN_FILE = new URL('../../docs/superpowers/specs/2026-11-28-am-sop-copy.en.md', import.meta.url);
const EN = existsSync(EN_FILE) ? readFileSync(EN_FILE, 'utf8') : '';
const PARSED_EN = lessonsOf(EN);

test('the course passes the rules with English required', () => {
  assert.deepEqual(validateCourse(AMS_LESSONS, { requireEnglish: true, lessonCount: 8, loop: false, figure: AMS_FIGURE }), []);
});

test('the English is the English copy, word for word', () => {
  assert.equal(PARSED_EN.length, 8);
  AMS_LESSONS.forEach((l, i) => {
    const c = PARSED_EN[i];
    assert.equal(l.title.en, c.title, l.id);
    assert.equal(l.short.en, c.short, l.id);
    assert.equal(l.subtitle.en, c.subtitle, l.id);
    assert.equal(l.roles.en, c.roles, l.id);
    assert.deepEqual(l.procedure.map((id) => l.diagram.nodes.find((n) => n.id === id).label.en), c.nodes, l.id);
    assert.deepEqual(l.steps.map((s) => s.caption.en), c.steps, l.id);
    l.checkpoint.forEach((q, k) => {
      const want = c.questions[k];
      assert.equal(q.prompt.en, want.prompt, q.id);
      assert.equal(q.answer, want.answer, q.id);
      assert.equal(q.explanation.en, want.explanation, q.id);
      assert.deepEqual(q.options.map((o) => ({ id: o.id, text: o.text.en, ...(o.feedback ? { feedback: o.feedback.en } : {}) })), want.options, q.id);
    });
    assert.equal(l.connection.text.en, c.connection, l.id);
  });
});

test('the English never runs to more sentences than the Korean it translates', () => {
  const count = (s) => (s.match(/[.?!](?=["'”’)]*(\s|$))/g) || []).length;
  for (const l of AMS_LESSONS) l.steps.forEach((s, i) => assert.ok(count(s.caption.en) <= count(s.caption.ko), `${l.id} step ${i + 1}`));
});

test('course and lesson-screen words match the English copy', () => {
  const en = (place) => cells(EN.split('\n').find((x) => x.startsWith(`| ${place} |`)))[1];
  assert.equal(AMS_UI.courseTitle.en, en('Course title'));
  assert.equal(AMS_UI.courseTagline.en, en('Course intro'));
  assert.equal(AMS_UI.homeCard.en, en('Home card'));
  assert.equal(AMS_UI.homeCard.en, HOME_COPY.amSop.text.en);
  assert.equal(AMS_UI.listNote.en, en('Figures note'));
  assert.equal(AMS_UI.rolesLabel.en, en('Who label'));
  assert.deepEqual(SCREEN_KEYS.map((k) => AMS_UI[k].en), en('Lesson screen').split(' · '));
});

test('the English list and lessons have no Korean left', () => {
  const { root } = setupDom();
  renderAmSopHome(root, AMS_LESSONS, { completed: [] }, 'en');
  assert.ok(!/[가-힣]/.test(root.textContent), root.textContent);
  for (const l of AMS_LESSONS) assert.ok(!/[가-힣]/.test(lessonText(l, 'en')), l.id);
});
