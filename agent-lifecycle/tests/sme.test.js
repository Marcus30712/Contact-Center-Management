// The SME course "직무전문가 첫걸음" (2026-11-25). The Korean must be the approved
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
  assert.deepEqual(SME_LESSONS.map((l) => l.id), ['firstday', 'newcomer', 'escalation', 'peer', 'lead', 'priority', 'knowledge']);
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
  for (const id of ['firstday', 'escalation', 'lead', 'priority', 'knowledge']) {
    assert.equal(by(id).personaName, undefined, id);
    assert.ok(lessonText(by(id), 'ko').includes('지민'), id);
  }
  assert.ok(!SME_LESSONS.some((l) => lessonText(l, 'ko').includes('우진')), 'Woojin belongs to the PIP SOP');
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

// ---------- the course page (Task 7) ----------
import { setupDom } from './dom.js';
import { fakeStorage } from './helpers.js';
import { renderSmeHome } from '../../sme/home.js';
import { renderLesson } from '../js/render/lesson.js';
import { parseRoute } from '../js/engine/router.js';
import { pool, openTerms } from '../../practice/engine.js';
import { renderPractice, newPracticeView } from '../../practice/render.js';

const IDS = SME_LESSONS.map((l) => l.id);
function openLesson(id, stepIndex = 0, lang = 'ko') {
  const { root } = setupDom();
  renderLesson(root, SME_LESSONS.find((l) => l.id === id), stepIndex, lang, { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: SME_LESSONS.length, text: SME_UI });
  return root;
}

test('the list shows the seven lessons in order with done marks', () => {
  const { root } = setupDom();
  renderSmeHome(root, SME_LESSONS, { completed: ['peer'] }, 'ko');
  assert.equal(root.querySelector('h1').textContent, SME_UI.courseTitle.ko);
  assert.equal(root.querySelector('.tagline').textContent, SME_UI.courseTagline.ko);
  assert.equal(root.querySelector('[data-list-note]').textContent, SME_UI.listNote.ko);
  const links = [...root.querySelectorAll('ol[data-sme-list] a[data-sme]')];
  assert.deepEqual(links.map((a) => a.getAttribute('href')), IDS.map((id) => `#${id}-0`));
  assert.deepEqual(links.map((a) => a.querySelector('.stage-card-num').textContent), ['1', '2', '3', '4', '5', '6', '7']);
  links.forEach((a, i) => {
    const l = SME_LESSONS[i];
    assert.ok(a.textContent.includes(l.title.ko) && a.textContent.includes(l.subtitle.ko), l.id);
    assert.equal(a.classList.contains('is-done'), l.id === 'peer');
  });
});

test('a lesson counts out of seven, says SME checkpoint, and the last one leads to the list', () => {
  const first = openLesson('firstday');
  assert.equal(first.querySelector('.eyebrow').textContent, '1 / 7');
  assert.equal(first.querySelector('[data-next-lesson]').getAttribute('href'), '#newcomer-0');
  assert.ok(first.textContent.includes(SME_UI.checkpoint.ko));
  assert.ok(!first.textContent.includes('팀장 체크포인트'));
  assert.equal(openLesson('knowledge').querySelector('[data-next-lesson]').getAttribute('href'), '#home');
  assert.equal(openLesson('newcomer', 3).querySelector('[data-persona] text').textContent, '서준');
});

test('stale addresses open the list', () => {
  assert.deepEqual(parseRoute('#pip-0', IDS), { view: 'home' });
  assert.deepEqual(parseRoute('#nope', IDS), { view: 'home' });
  assert.equal(parseRoute('#peer-99', IDS).id, 'peer');
});

test('finished SME lessons feed today\'s practice and open term cards', () => {
  const s = fakeStorage({ 'sme-course:v1': JSON.stringify({ completed: ['firstday'] }) });
  assert.deepEqual(pool(s).map((q) => q.key), ['sme:firstday-q1', 'sme:firstday-q2']);
  assert.ok(openTerms(s).length > 0);
  const { root } = setupDom();
  renderPractice(root, 'ko', s, '2026-11-25', newPracticeView());
  const option = root.querySelector('[data-question] [data-option]');
  option.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.match(root.querySelector('a[data-review]').getAttribute('href'), /^\.\.\/sme\/#firstday-0$/);
});

test('every lesson address opens that lesson', async () => {
  const { lessonHref } = await import('../js/engine/router.js');
  for (const id of IDS) assert.deepEqual(parseRoute(lessonHref(id, 3), IDS), { view: 'lesson', id, step: 3 }, id);
});

// ---------- English (Task 8): docs/superpowers/specs/2026-11-25-sme-course-copy.en.md ----------
const EN = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-sme-course-copy.en.md', import.meta.url), 'utf8');
const PARSED_EN = EN.split(/^## 레슨 \d+\. /m).slice(1).map((s) => parseLesson(s.split(/^## /m)[0]));

test('the course passes the rules with English required', () => {
  assert.deepEqual(validateCourse(SME_LESSONS, { requireEnglish: true, lessonCount: 7, loop: false, figure: SME_FIGURE }), []);
});

test('the English is the English copy, word for word', () => {
  assert.equal(PARSED_EN.length, 7);
  SME_LESSONS.forEach((l, i) => {
    const c = PARSED_EN[i];
    assert.equal(l.title.en, c.title, l.id);
    assert.equal(l.short.en, c.short, l.id);
    assert.equal(l.subtitle.en, c.subtitle, l.id);
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
  assert.deepEqual(SME_LESSONS.find((l) => l.id === 'newcomer').personaName, { ko: '서준', en: 'Seojun' });
  assert.deepEqual(SME_LESSONS.find((l) => l.id === 'peer').personaName, { ko: '준호', en: 'Junho' });
});

test('the English never runs to more sentences than the Korean it translates', () => {
  const count = (s) => (s.match(/[.?!](?=["'”’)]*(\s|$))/g) || []).length;
  for (const l of SME_LESSONS) l.steps.forEach((s, i) => assert.ok(count(s.caption.en) <= count(s.caption.ko), `${l.id} step ${i + 1}`));
});

test('course, role and lesson-screen words match the English copy', async () => {
  const { ROLE_UI, ROLE_NAMES } = await import('../../shared/role-data.js');
  const { ROLES } = await import('../../shared/role.js');
  const en = (section, place) => cells(EN.split(/^## /m).find((s) => s.startsWith(section)).split('\n').find((x) => x.startsWith(`| ${place} |`)))[1];
  assert.equal(SME_UI.courseTitle.en, en('3.', 'Course title'));
  assert.equal(SME_UI.courseTagline.en, en('3.', 'Course intro'));
  assert.equal(SME_UI.homeCard.en, en('3.', 'Home card'));
  assert.equal(SME_UI.listNote.en, en('3.', 'Figures note'));
  assert.deepEqual(['home', 'checkpoint', 'connection', 'nextLesson', 'toList', 'done'].map((k) => SME_UI[k].en), en('3.', 'Lesson screen').split(' · '));
  const pairs = { sheetTitle: 'Sheet title', sheetNote: 'Sheet note', later: 'Later button', settingsHeading: 'Settings heading',
    settingsNote: 'Settings note', preparing: 'Preparing note (home)', preparingCareer: 'Preparing link 1', preparingDaily: 'Preparing link 2' };
  for (const [k, place] of Object.entries(pairs)) assert.equal(ROLE_UI[k].en, en('2.', place), k);
  // The role choices were renamed with TL/AM/OM (2026-11-25); role.test checks them against role-home-copy §8.
});

test('the English list and lessons have no Korean left', () => {
  const { root } = setupDom();
  renderSmeHome(root, SME_LESSONS, { completed: [] }, 'en');
  assert.ok(!/[가-힣]/.test(root.textContent));
  for (const l of SME_LESSONS) assert.ok(!/[가-힣]/.test(lessonText(l, 'en')), l.id);
});
