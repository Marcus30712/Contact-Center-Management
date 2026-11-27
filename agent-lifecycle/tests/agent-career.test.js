// The agent course "상담사 커리어 라이프사이클" (2026-11-26). The Korean must be the approved
// copy, word for word: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateCourse } from '../js/engine/lessonSchema.js';
import { lessonText } from './helpers.js';
import { AC_LESSONS as SL_LESSONS } from '../../agent-career/lessons/index.js';
import { AC_UI as SL_UI, AC_PROGRESS_KEY as SL_PROGRESS_KEY, AC_FIGURE as SL_FIGURE } from '../../agent-career/ui.js';
import { AGENT_FIGURE as SME_FIGURE, AGENT_UI as SME_UI } from '../../agent/ui.js';
import QA_HIDDEN from '../../agent-career/lessons/hidden-qa.js';

const COPY = readFileSync(new URL('../../docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md', import.meta.url), 'utf8');
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
// Hidden lessons (QA, trainer: kept in the doc, off the list since 2026-11-26) come after a "## 숨김" / "## Hidden" heading.
const lessonsOf = (doc) => doc.split(/^## (?:숨김|Hidden)/m)[0].split(/^## 레슨 \d+\. /m).slice(1).map((s) => parseLesson(s.split(/^## /m)[0]));
const PARSED = lessonsOf(COPY);
const ORDINALS = ['첫', '둘째', '셋째', '넷째', '다섯째'];
const IDS = ['ready', 'sme', 'tlprep', 'tl'];
const row = (doc, place) => cells(doc.split('\n').find((x) => x.startsWith(`| ${place} |`)))[1];

test('the career lifecycle passes the course rules', () => {
  assert.deepEqual(validateCourse(SL_LESSONS, { lessonCount: 4, loop: false, figure: SL_FIGURE }), []);
  assert.equal(SL_FIGURE, SME_FIGURE);
  assert.equal(SL_PROGRESS_KEY, 'agent-career:v1');
});

test('four lessons in the approved ladder order', () => {
  assert.equal(PARSED.length, 4);
  assert.deepEqual(SL_LESSONS.map((l) => l.id), IDS);
  assert.deepEqual(SL_LESSONS.map((l) => l.order), [1, 2, 3, 4]);
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

test('Jimin in every lesson', () => {
  for (const l of SL_LESSONS) assert.deepEqual(l.personaName, { ko: '지민', en: 'Jimin' }, l.id);
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
  assert.equal(SL_UI.ladder.team.ko, row(COPY, '사다리 맨 위'));
  assert.equal(SL_UI.ladder.here.ko, row(COPY, '상담사 칸'));
  assert.deepEqual(SL_LESSONS.map((l) => l.short.ko), row(COPY, '사다리 칸 이름').split(' · '));
});

// ---------- the course page ----------
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

test('the home is a ladder: agent at the bottom, a prep step beside each climb, team leader on top', () => {
  const { root } = setupDom();
  renderHome(root, SL_LESSONS, { completed: ['ready'] }, 'ko', SL_UI);
  assert.equal(root.querySelector('h1').textContent, SL_UI.courseTitle.ko);
  assert.equal(root.querySelector('.tagline').textContent, SL_UI.courseTagline.ko);
  assert.equal(root.querySelector('.ring'), null);
  assert.equal(root.querySelector('.loop-note'), null);
  const ladder = root.querySelector('[data-ladder]');
  assert.equal(ladder.querySelector('.ladder-team').textContent, '운영팀');
  // Top to bottom on screen: 팀장, 팀장 준비 beside the climb, 직무전문가, 직무전문가 준비 beside the climb, 상담사.
  assert.deepEqual([...ladder.querySelectorAll('[data-rung]')].map((e) => e.dataset.rung), ['tl', 'tlprep', 'sme', 'ready', 'agent']);
  assert.deepEqual([...ladder.querySelectorAll('[data-rung].is-prep')].map((e) => e.dataset.rung), ['tlprep', 'ready']);
  assert.equal(ladder.querySelector('[data-rung="agent"]').textContent, '상담사 · 지민 (지금)');
  assert.equal(ladder.querySelector('[data-rung="agent"]').tagName, 'DIV');
  for (const id of IDS) assert.equal(ladder.querySelector(`a[data-rung="${id}"]`).getAttribute('href'), `#${id}-0`, id);
  assert.ok(ladder.querySelector('[data-rung="ready"]').classList.contains('is-done'));
  assert.ok(!ladder.querySelector('[data-rung="sme"]').classList.contains('is-done'));
  assert.equal(ladder.querySelector('[data-rung="tlprep"]').textContent.includes('팀장 준비'), true);
  const cards = [...root.querySelectorAll('.stage-card')];
  assert.deepEqual(cards.map((a) => a.getAttribute('href')), IDS.map((id) => `#${id}-0`));
  assert.equal(root.querySelector('[data-track-hint]'), null);
});

test('the team-lead ring is unchanged', () => {
  const { root } = setupDom();
  renderHome(root, LESSONS, { completed: [] }, 'ko');
  assert.ok(root.querySelector('[data-track-hint]'));
  assert.equal(root.querySelector('.ring-center text').textContent, '지민');
  assert.equal(root.querySelector('h1').textContent, '상담사 라이프사이클');
});

test('a lesson counts out of four, says Agent checkpoint, climbs the ladder, and the last one leads to the list', () => {
  const first = openLesson('ready');
  assert.equal(first.querySelector('.eyebrow').textContent, '1 / 4');
  assert.equal(first.querySelector('[data-next-lesson]').getAttribute('href'), '#sme-0');
  assert.ok(first.textContent.includes(SL_UI.checkpoint.ko));
  assert.equal(openLesson('sme').querySelector('[data-next-lesson]').getAttribute('href'), '#tlprep-0');
  assert.equal(openLesson('tlprep').querySelector('[data-next-lesson]').getAttribute('href'), '#tl-0');
  assert.equal(openLesson('tl').querySelector('[data-next-lesson]').getAttribute('href'), '#home');
  assert.equal(openLesson('tl', 3).querySelector('[data-persona] text').textContent, '지민');
});

test('stale addresses open the list', () => {
  for (const hash of ['#home', '#golive-3', '#trainee-0', '#qa-0', '#trainer-1', '', '#nope']) assert.deepEqual(parseRoute(hash, IDS), { view: 'home' }, hash);
  const route = parseRoute('#tl-99', IDS);
  assert.equal(route.id, 'tl');
  const { root } = setupDom();
  renderLesson(root, SL_LESSONS[3], route.step, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: 4, text: SL_UI });
  assert.ok(root.querySelector('.eyebrow'));
  const en = setupDom();
  renderLesson(en.root, SL_LESSONS[3], route.step, 'en', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: 4, text: SL_UI });
  assert.ok(en.root.querySelector('.eyebrow'));
  assert.ok(!/[가-힣]/.test(en.root.textContent));
});

test('every lesson address opens that lesson', () => {
  for (const id of IDS) assert.deepEqual(parseRoute(lessonHref(id, 3), IDS), { view: 'lesson', id, step: 3 }, id);
});

// ---------- connected to practice (plan Task 2) ----------
import { fakeStorage } from './helpers.js';
import { pool } from '../../practice/engine.js';
import { renderPractice, newPracticeView } from '../../practice/render.js';
import { COURSE_INFO } from '../../shared/courses.js';

test('career lifecycle questions link to their own course', () => {
  assert.deepEqual(COURSE_INFO['agent-career'], { key: SL_PROGRESS_KEY, lessons: SL_LESSONS, dir: 'agent-career/' });
  const s = fakeStorage({ 'agent-career:v1': JSON.stringify({ completed: ['sme'] }) });
  assert.deepEqual(pool(s).map((q) => q.key), ['agent-career:sme-q1', 'agent-career:sme-q2']);
  const { root } = setupDom();
  renderPractice(root, 'ko', s, '2026-11-25', newPracticeView());
  // Option c is wrong in both of lesson 1's questions, so the review link always shows.
  root.querySelector('[data-question] [data-option="c"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(root.querySelector('a[data-review]').getAttribute('href'), '../agent-career/#sme-0');
});

// ---------- English: docs/superpowers/specs/2026-11-26-agent-career-copy.en.md ----------
import { existsSync } from 'node:fs';

const EN_FILE = new URL('../../docs/superpowers/specs/2026-11-26-agent-career-copy.en.md', import.meta.url);
const EN = existsSync(EN_FILE) ? readFileSync(EN_FILE, 'utf8') : '';
const PARSED_EN = lessonsOf(EN);

test('the course passes the rules with English required', () => {
  assert.deepEqual(validateCourse(SL_LESSONS, { requireEnglish: true, lessonCount: 4, loop: false, figure: SL_FIGURE }), []);
});

test('the English is the English copy, word for word', () => {
  assert.equal(PARSED_EN.length, 4);
  SL_LESSONS.forEach((l, i) => {
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
});

test('the English never runs to more sentences than the Korean it translates', () => {
  const count = (s) => (s.match(/[.?!](?=["'”’)]*(\s|$))/g) || []).length;
  for (const l of SL_LESSONS) l.steps.forEach((s, i) => assert.ok(count(s.caption.en) <= count(s.caption.ko), `${l.id} step ${i + 1}`));
});

test('course and lesson-screen words match the English copy', () => {
  const en = (place) => cells(EN.split('\n').find((x) => x.startsWith(`| ${place} |`)))[1];
  assert.equal(SL_UI.courseTitle.en, en('Course title'));
  assert.equal(SL_UI.courseTagline.en, en('Course intro'));
  assert.equal(SL_UI.homeCard.en, en('Home card'));
  assert.equal(SL_UI.listNote.en, en('Figures note'));
  assert.equal(SL_UI.ladder.team.en, en('Top of the ladder'));
  assert.equal(SL_UI.ladder.here.en, en('Agent step'));
  assert.deepEqual(SL_LESSONS.map((l) => l.short.en), en('Ladder step names').split(' · '));
  for (const k of ['home', 'checkpoint', 'connection', 'nextLesson', 'toList', 'done']) assert.equal(SL_UI[k], SME_UI[k], k);
});

test('the English ladder and lessons have no Korean left', () => {
  const { root } = setupDom();
  renderHome(root, SL_LESSONS, { completed: [] }, 'en', SL_UI);
  assert.ok(!/[가-힣]/.test(root.textContent), root.textContent);
  assert.equal(root.querySelector('[data-translation-note]').hidden, true);
  for (const l of SL_LESSONS) assert.ok(!/[가-힣]/.test(lessonText(l, 'en')), l.id);
});

test('the ladder screen says the figures are examples', () => {
  for (const lang of ['ko', 'en']) {
    const { root } = setupDom();
    renderHome(root, SL_LESSONS, { completed: [] }, lang, SL_UI);
    assert.equal(root.querySelector('[data-list-note]')?.textContent, SL_UI.listNote[lang], lang);
  }
  const { root } = setupDom();
  renderHome(root, LESSONS, { completed: [] }, 'ko');
  assert.equal(root.querySelector('[data-list-note]'), null);
});

// ---------- final-review fixes (2026-11-26, approved "추천대로") ----------
test('the intro describes the operations-team ladder and keeps the example label', () => {
  assert.ok(SL_UI.courseTagline.ko.includes('운영팀에서 한 단계씩 오르는 길'));
  assert.ok(SL_UI.courseTagline.ko.includes('1년쯤(예시)'));
  assert.ok(SL_UI.courseTagline.en.includes('the path up the operations team'));
});

// 2026-11-26: the QA and trainer paths are hidden from the course, the ladder and its words.
test('QA and trainer paths are hidden everywhere in the visible course', () => {
  assert.ok(!SL_LESSONS.some((l) => l.id === 'qa' || l.id === 'trainer'));
  const visible = [SL_UI.courseTagline, SL_UI.homeCard].flatMap((v) => [v.ko, v.en]).join(' ')
    + SL_LESSONS.map((l) => lessonText(l, 'ko') + lessonText(l, 'en')).join(' ');
  for (const word of ['도현', '유나', 'Dohyun', 'Yuna', '트레이너의 일', 'QA의 일을']) assert.ok(!visible.includes(word), word);
  assert.ok(!/QA ·|· QA|Trainer ·|트레이너 ·/.test(SL_UI.homeCard.ko + SL_UI.homeCard.en));
});

test("the team leader prep lesson follows the user's five priorities in order", () => {
  const l = SL_LESSONS.find((x) => x.id === 'tlprep');
  assert.deepEqual(l.procedure.map((id) => l.diagram.nodes.find((n) => n.id === id).label.ko), ['근태·태도', '깨끗한 기록', '피플 매니지먼트', '코칭', '백업 지표']);
  assert.equal(l.checkpoint[0].options.find((o) => o.id === l.checkpoint[0].answer).text.ko, '근태와 업무 태도');
  // Harassment is never handled alone: record it and pass it on through the company process.
  assert.ok(l.checkpoint[1].options.find((o) => o.id === l.checkpoint[1].answer).text.ko.includes('인사 담당'));
});

test('the SME prep lesson says 징계, not 처벌', () => {
  const ready = SL_LESSONS.find((l) => l.id === 'ready');
  assert.ok(!lessonText(ready, 'ko').includes('처벌'));
  assert.ok(lessonText(ready, 'ko').includes('징계를 받은 기록'));
});

test('the quoted interview answer carries no example label inside the quotes', () => {
  const opt = SL_LESSONS.find((l) => l.id === 'ready').checkpoint[1].options.find((o) => o.id === 'c').text;
  assert.ok(!/예시|Example/.test(opt.ko + opt.en), JSON.stringify(opt));
});

test('the QA lesson does not assume agents can replay their own recordings', () => {
  const qa = QA_HIDDEN;
  assert.ok(qa.steps[6].caption.ko.includes('들을 수 있다면'), qa.steps[6].caption.ko);
  assert.ok(qa.checkpoint[0].options.find((o) => o.id === 'b').text.ko.includes('가능하면'));
});

test('someone who finished the hidden QA and trainer lessons sees only the four ladder lessons counted', () => {
  const s = fakeStorage({ 'agent-career:v1': JSON.stringify({ completed: ['sme', 'qa', 'trainer', 'tl', 'ready'] }) });
  assert.deepEqual(pool(s).map((q) => q.key).filter((k) => /qa-q|trainer-q/.test(k)), []);
  const { root } = setupDom();
  renderHome(root, SL_LESSONS, { completed: ['sme', 'qa', 'trainer', 'tl', 'ready'] }, 'ko', SL_UI);
  assert.deepEqual([...root.querySelectorAll('[data-ladder] a.is-done')].map((a) => a.dataset.rung), ['tl', 'sme', 'ready']);
  for (const a of root.querySelectorAll('[data-ladder] a')) assert.equal(a.getAttribute('tabindex'), '-1');
});
