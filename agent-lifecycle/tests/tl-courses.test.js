// The two new team-lead courses (2026-11-25): "팀장 첫걸음" (tl/) and
// "팀장 서포트 라이프사이클" (tl-support/). Korean and English must be the copy
// docs word for word: docs/superpowers/specs/2026-11-25-tl-course-copy-*.md and
// 2026-11-25-tl-support-copy-*.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateCourse } from '../js/engine/lessonSchema.js';
import { lessonText, fakeStorage } from './helpers.js';
import { setupDom, click } from './dom.js';
import { TL_LESSONS } from '../../tl/lessons/index.js';
import { TL_UI, TL_PROGRESS_KEY, TL_FIGURE } from '../../tl/ui.js';
import { TS_LESSONS } from '../../tl-support/lessons/index.js';
import { TS_UI, TS_PROGRESS_KEY, TS_FIGURE } from '../../tl-support/ui.js';
import { SME_FIGURE } from '../../sme/ui.js';
import { renderTlHome } from '../../tl/home.js';
import { AGENT_LESSONS } from '../../agent/lessons/index.js';
import { AGENT_UI, AGENT_PROGRESS_KEY, AGENT_FIGURE } from '../../agent/ui.js';
import { renderAgentHome } from '../../agent/home.js';
import { renderHome } from '../js/render/home.js';
import { renderLesson } from '../js/render/lesson.js';
import { parseRoute, lessonHref } from '../js/engine/router.js';
import { pool } from '../../practice/engine.js';
import { renderPractice, newPracticeView } from '../../practice/render.js';
import { COURSE_INFO } from '../../shared/courses.js';

const doc = (name) => readFileSync(new URL(`../../docs/superpowers/specs/${name}`, import.meta.url), 'utf8');
const cells = (line) => line.slice(1, -1).split(' | ').map((c) => c.trim());
const row = (text, place) => cells(text.split('\n').find((x) => x.startsWith(`| ${place} |`)))[1];

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
const lessonsOf = (text) => text.split(/^## 레슨 \d+\. /m).slice(1).map((s) => parseLesson(s.split(/^## /m)[0]));
const ORDINALS = ['첫', '둘째', '셋째', '넷째', '다섯째'];
const SCREEN_KEYS = ['home', 'checkpoint', 'connection', 'nextLesson', 'toList', 'done'];

const COURSES = [
  {
    id: 'tl', dir: 'tl/', key: 'tl-course:v1', lessons: TL_LESSONS, ui: TL_UI, progressKey: TL_PROGRESS_KEY, figure: TL_FIGURE,
    ko: doc('2026-11-25-tl-course-copy-ko.md'), en: doc('2026-11-25-tl-course-copy.en.md'),
    ids: ['start', 'roster', 'results', 'listen', 'contribution', 'oneonone', 'direction'],
    people: { contribution: ['하린', 'Harin'], direction: ['민석', 'Minseok'] }, checkpointLabel: '팀장 체크포인트',
  },
  {
    id: 'tl-support', dir: 'tl-support/', key: 'tl-support:v1', lessons: TS_LESSONS, ui: TS_UI, progressKey: TS_PROGRESS_KEY, figure: TS_FIGURE,
    ko: doc('2026-11-25-tl-support-copy-ko.md'), en: doc('2026-11-25-tl-support-copy.en.md'),
    ids: ['agents', 'sme', 'qa', 'trainers', 'team'],
    people: { sme: ['하린', 'Harin'], qa: ['도현', 'Dohyun'], trainers: ['유나', 'Yuna'], team: ['하린', 'Harin'] }, checkpointLabel: '팀장 체크포인트',
  },
  // 상담사 첫걸음 (2026-11-26): the same list course for the agent role.
  {
    id: 'agent', dir: 'agent/', key: 'agent-course:v1', lessons: AGENT_LESSONS, ui: AGENT_UI, progressKey: AGENT_PROGRESS_KEY, figure: AGENT_FIGURE,
    ko: doc('2026-11-26-agent-course-copy-ko.md'), en: doc('2026-11-26-agent-course-copy.en.md'),
    ids: ['start', 'training', 'nesting', 'golive', 'customers', 'review', 'attendance', 'growth'],
    people: {}, checkpointLabel: '상담사 체크포인트',
  },
];

for (const c of COURSES) {
  const KO = lessonsOf(c.ko);
  const EN = lessonsOf(c.en);

  test(`${c.id}: passes the course rules, with English required`, () => {
    assert.deepEqual(validateCourse(c.lessons, { requireEnglish: true, lessonCount: c.ids.length, loop: false, figure: c.figure }), []);
    assert.equal(c.figure, SME_FIGURE);
    assert.equal(c.progressKey, c.key);
  });

  test(`${c.id}: lessons in the order of the copy, with no hyphen in an id`, () => {
    assert.equal(KO.length, c.ids.length);
    assert.equal(EN.length, c.ids.length);
    assert.deepEqual(c.lessons.map((l) => l.id), c.ids);
    assert.deepEqual(c.lessons.map((l) => l.order), c.ids.map((_, i) => i + 1));
    for (const id of c.ids) assert.ok(!id.includes('-'), id);
  });

  for (const [lang, parsed] of [['ko', KO], ['en', EN]]) {
    test(`${c.id}: the ${lang} text is the copy, word for word`, () => {
      c.lessons.forEach((l, i) => {
        const want = parsed[i];
        assert.equal(l.title[lang], want.title, l.id);
        assert.equal(l.short[lang], want.short, l.id);
        assert.equal(l.subtitle[lang], want.subtitle, l.id);
        assert.deepEqual(l.procedure.map((id) => l.diagram.nodes.find((n) => n.id === id).label[lang]), want.nodes, l.id);
        assert.deepEqual(l.steps.map((s) => s.caption[lang]), want.steps, l.id);
        l.checkpoint.forEach((q, k) => {
          const w = want.questions[k];
          assert.equal(q.id, `${l.id}-q${k + 1}`);
          assert.equal(q.prompt[lang], w.prompt, q.id);
          assert.equal(q.answer, w.answer, q.id);
          assert.equal(q.explanation[lang], w.explanation, q.id);
          assert.deepEqual(q.options.map((o) => ({ id: o.id, text: o.text[lang], ...(o.feedback ? { feedback: o.feedback[lang] } : {}) })), w.options, q.id);
        });
        assert.equal(l.connection.text[lang], want.connection, l.id);
      });
    });
  }

  test(`${c.id}: right answers carry no feedback and every wrong answer has one`, () => {
    for (const q of c.lessons.flatMap((l) => l.checkpoint)) {
      for (const o of q.options) assert.equal(Boolean(o.feedback), o.id !== q.answer, `${q.id} ${o.id}`);
    }
  });

  test(`${c.id}: each step that names a stage lights up that stage`, () => {
    for (const l of c.lessons) {
      l.steps.forEach((s, i) => {
        const k = ORDINALS.findIndex((o) => new RegExp(`(^|\\. )${o} 단계는`).test(s.caption.ko));
        if (k === -1) return;
        assert.deepEqual(s.highlight, [l.procedure[k]], `${l.id} step ${i + 1}`);
      });
      assert.deepEqual(l.steps[0].highlight, l.procedure, `${l.id} step 1 shows every stage`);
    }
  });

  test(`${c.id}: the people in each lesson`, () => {
    for (const l of c.lessons) {
      const p = c.people[l.id];
      if (p) assert.deepEqual(l.personaName, { ko: p[0], en: p[1] }, l.id);
      else {
        assert.equal(l.personaName, undefined, l.id);
        assert.ok(lessonText(l, 'ko').includes('지민'), l.id);
      }
    }
  });

  test(`${c.id}: every box sits inside the picture, rows at least 48 apart`, () => {
    for (const l of c.lessons) {
      for (const n of l.diagram.nodes) assert.ok(n.x - n.hw >= 2 && n.x + n.hw <= 358 && n.y - 17 >= 2 && n.y + 17 <= 238, `${l.id}: ${n.id}`);
      const ys = l.procedure.map((id) => l.diagram.nodes.find((n) => n.id === id).y);
      ys.slice(1).forEach((y, i) => assert.ok(y - ys[i] >= 48, l.id));
    }
  });

  test(`${c.id}: the English never runs to more sentences than the Korean`, () => {
    const count = (s) => (s.match(/[.?!](?=["'”’)]*(\s|$))/g) || []).length;
    for (const l of c.lessons) l.steps.forEach((s, i) => assert.ok(count(s.caption.en) <= count(s.caption.ko), `${l.id} step ${i + 1}`));
  });

  test(`${c.id}: course words are the copy in both languages`, () => {
    assert.equal(c.ui.courseTitle.ko, row(c.ko, '강의 제목'));
    assert.equal(c.ui.courseTagline.ko, row(c.ko, '강의 소개'));
    assert.equal(c.ui.homeCard.ko, row(c.ko, '홈 카드'));
    assert.equal(c.ui.listNote.ko, row(c.ko, '숫자 안내'));
    assert.deepEqual(SCREEN_KEYS.map((k) => c.ui[k].ko), row(c.ko, '레슨 화면 버튼').split(' · '));
    assert.equal(c.ui.courseTitle.en, row(c.en, 'Course title'));
    assert.equal(c.ui.courseTagline.en, row(c.en, 'Course intro'));
    assert.equal(c.ui.homeCard.en, row(c.en, 'Home card'));
    assert.equal(c.ui.listNote.en, row(c.en, 'Figures note'));
    assert.deepEqual(SCREEN_KEYS.map((k) => c.ui[k].en), row(c.en, 'Lesson screen').split(' · '));
    for (const l of c.lessons) assert.ok(!/[가-힣]/.test(lessonText(l, 'en')), l.id);
  });

  test(`${c.id}: lesson screen counts, checkpoint label and last lesson to the list`, () => {
    const open = (id, step = 0) => {
      const { root } = setupDom();
      renderLesson(root, c.lessons.find((l) => l.id === id), step, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: c.lessons.length, text: c.ui });
      return root;
    };
    const first = open(c.ids[0]);
    assert.equal(first.querySelector('.eyebrow').textContent, `1 / ${c.ids.length}`);
    assert.equal(first.querySelector('[data-next-lesson]').getAttribute('href'), `#${c.ids[1]}-0`);
    assert.ok(first.textContent.includes(c.checkpointLabel));
    assert.equal(open(c.ids.at(-1)).querySelector('[data-next-lesson]').getAttribute('href'), '#home');
  });

  test(`${c.id}: stale and odd addresses open the list; every lesson address opens its lesson`, () => {
    for (const hash of ['#home', '', '#nope', '#hiring-0', '#coaching-3']) assert.deepEqual(parseRoute(hash, c.ids), { view: 'home' }, hash);
    assert.equal(parseRoute(`#${c.ids[0]}-99`, c.ids).id, c.ids[0]);
    for (const id of c.ids) assert.deepEqual(parseRoute(lessonHref(id, 3), c.ids), { view: 'lesson', id, step: 3 }, id);
  });

  test(`${c.id}: finished lessons feed today's practice and link back to this course`, () => {
    assert.deepEqual(COURSE_INFO[c.id], { key: c.key, lessons: c.lessons, dir: c.dir });
    const s = fakeStorage({ [c.key]: JSON.stringify({ completed: [c.ids[0]] }) });
    assert.deepEqual(pool(s).map((q) => q.key), [`${c.id}:${c.ids[0]}-q1`, `${c.id}:${c.ids[0]}-q2`]);
    const { root } = setupDom();
    renderPractice(root, 'ko', s, '2026-11-25', newPracticeView());
    click(root.querySelector('[data-question] [data-option="a"]'));
    assert.equal(root.querySelector('a[data-review]').getAttribute('href'), `../${c.dir}#${c.ids[0]}-0`);
  });
}

test('TL First Steps: the list shows seven lessons with done marks, in both languages', () => {
  const { root } = setupDom();
  renderTlHome(root, TL_LESSONS, { completed: ['roster'] }, 'ko');
  assert.equal(root.querySelector('h1').textContent, '팀장 첫걸음');
  assert.equal(root.querySelector('[data-list-note]').textContent, TL_UI.listNote.ko);
  const links = [...root.querySelectorAll('ol[data-tl-list] a[data-tl]')];
  assert.deepEqual(links.map((a) => a.getAttribute('href')), TL_LESSONS.map((l) => `#${l.id}-0`));
  assert.deepEqual(links.map((a) => a.classList.contains('is-done')), TL_LESSONS.map((l) => l.id === 'roster'));
  const en = setupDom();
  renderTlHome(en.root, TL_LESSONS, { completed: [] }, 'en');
  assert.ok(!/[가-힣]/.test(en.root.textContent));
});

test('TL Support Lifecycle: the ring shows five roles with the team leader in the middle', () => {
  const copy = doc('2026-11-25-tl-support-copy-ko.md');
  const { root } = setupDom();
  renderHome(root, TS_LESSONS, { completed: ['agents'] }, 'ko', TS_UI);
  assert.equal(root.querySelector('h1').textContent, '팀장 서포트 라이프사이클');
  assert.deepEqual([...root.querySelectorAll('svg .stage-name')].map((t) => t.textContent), row(copy, '원 안 짧은 이름').split(' · '));
  assert.equal(root.querySelector('.ring-center text').textContent, row(copy, '원 가운데 이름'));
  assert.equal(root.querySelector('.loop-note').textContent, `↺ ${row(copy, '순환 안내 (원 아래)')}`);
  assert.equal(root.querySelector('[data-list-note]').textContent, TS_UI.listNote.ko);
  assert.equal(root.querySelector('[data-track-hint]'), null);
  assert.ok(root.querySelector('.stage-card').classList.contains('is-done'));
  const en = setupDom();
  renderHome(en.root, TS_LESSONS, { completed: [] }, 'en', TS_UI);
  assert.ok(!/[가-힣]/.test(en.root.textContent));
  assert.equal(en.root.querySelector('[data-translation-note]').hidden, true);
});

test('Agent First Steps: the list shows eight lessons with done marks, in both languages', () => {
  const { root } = setupDom();
  renderAgentHome(root, AGENT_LESSONS, { completed: ['golive'] }, 'ko');
  assert.equal(root.querySelector('h1').textContent, '상담사 첫걸음');
  assert.equal(root.querySelector('[data-list-note]').textContent, AGENT_UI.listNote.ko);
  const links = [...root.querySelectorAll('ol[data-agent-list] a[data-agent]')];
  assert.deepEqual(links.map((a) => a.getAttribute('href')), AGENT_LESSONS.map((l) => `#${l.id}-0`));
  assert.deepEqual(links.map((a) => a.classList.contains('is-done')), AGENT_LESSONS.map((l) => l.id === 'golive'));
  const en = setupDom();
  renderAgentHome(en.root, AGENT_LESSONS, { completed: [] }, 'en');
  assert.ok(!/[가-힣]/.test(en.root.textContent));
});

test('the TL and agent course pages settle the guide and save their own progress', () => {
  for (const [dir, key] of [['tl', 'TL_PROGRESS_KEY'], ['tl-support', 'TS_PROGRESS_KEY'], ['agent', 'AGENT_PROGRESS_KEY']]) {
    const src = readFileSync(new URL(`../../${dir}/app.js`, import.meta.url), 'utf8');
    assert.ok(src.includes(`settleGuide(location, history, '${dir}',`), dir);
    assert.ok(src.includes(`markComplete(storage, id, ${key})`), dir);
  }
});

// The 2026-11-25 rename added "TL " and "SME " in front of course names. A
// templated row ("{직급} SOP 라이브러리") or a sentence that already said whose
// course it was must not end up with the prefix twice.
test('the course rename never doubles a prefix in the docs or the app', async () => {
  const { readdirSync } = await import('node:fs');
  const root = new URL('../../', import.meta.url);
  const bad = /(AM|OM|상담사|Agent) TL SOP|SME의 SME|\bTL TL\b|\bSME SME\b/;
  const files = readdirSync(new URL('docs/superpowers/specs/', root)).map((f) => `docs/superpowers/specs/${f}`);
  for (const dir of ['home', 'tl', 'tl-support', 'agent', 'sme', 'sme-lifecycle', 'sme-sop', 'sop-library', 'guide', 'sme-guide', 'review', 'privacy', 'codex/data', 'glossary']) {
    for (const f of readdirSync(new URL(`${dir}/`, root), { recursive: true })) {
      if (String(f).endsWith('.js') || String(f).endsWith('.html')) files.push(`${dir}/${f}`);
    }
  }
  const hits = files.flatMap((f) => readFileSync(new URL(f, root), 'utf8').split('\n')
    .map((line, i) => (bad.test(line) ? `${f}:${i + 1}` : null)).filter(Boolean));
  assert.deepEqual(hits, []);
});

// With the SME SOP Library beside it, the SOP badge says which SOP it counts (2026-11-26).
test('the SOP badge rule names the TL SOP lessons', async () => {
  const { BADGES } = await import('../../practice/data.js');
  const sop = BADGES.find((b) => b.id === 'sop');
  assert.deepEqual([sop.rule.ko, sop.rule.en], ['팀장 SOP 레슨을 모두 마침', 'Finish all the TL SOP lessons']);
});

// Every course's lesson text is content under CC BY-NC-ND, as the README says.
test('the content licence lists every course lesson folder', () => {
  const lic = readFileSync(new URL('../../LICENSE-CONTENT', import.meta.url), 'utf8').replace(/\s+/g, ' ');
  for (const d of ['sme/lessons/', 'sme-lifecycle/lessons/', 'sme-sop/lessons/', 'tl/lessons/', 'tl-support/lessons/', 'agent/lessons/', 'sme-guide/data.js']) {
    assert.ok(lic.includes(d), d);
  }
});

// Review 2026-11-26: steps after the four stages light the stage they talk about,
// not whichever stage came last.
test('Agent First Steps: later steps light the stage they are about', () => {
  const hl = (id, n) => AGENT_LESSONS.find((l) => l.id === id).steps[n - 1].highlight;
  assert.deepEqual([hl('start', 7), hl('start', 8)], [['onboarding'], ['onboarding']]);
  assert.deepEqual([hl('attendance', 7), hl('attendance', 8)], [['sick'], ['sick']]);
});

test('Agent First Steps: the stage is called 실전 배치 / Go Live', () => {
  const ko = AGENT_LESSONS.map((l) => lessonText(l, 'ko')).join(' ');
  const en = AGENT_LESSONS.map((l) => lessonText(l, 'en')).join(' ');
  assert.ok(!/고라이브|실전투입/.test(ko), 'ko still says 고라이브 or 실전투입');
  assert.ok(!/go-live/i.test(en), 'en still says go-live');
  assert.ok(ko.includes('실전 배치와 첫 콜'));
  assert.ok(en.includes('Go Live and the First Call'));
  const start = AGENT_LESSONS.find((l) => l.id === 'start');
  assert.ok(lessonText(start, 'ko').includes('넷째 단계는 실전 배치입니다.'));
  assert.ok(lessonText(start, 'en').includes('The fourth stage is Go Live.'));
});
