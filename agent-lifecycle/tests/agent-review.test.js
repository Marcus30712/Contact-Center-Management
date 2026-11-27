// Agent review quiz (2026-11-27). Korean and English must be the approved copy:
// docs/superpowers/specs/2026-11-27-agent-review-quiz-copy-ko.md and .en.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fakeStorage } from './helpers.js';
import { setupDom, click } from './dom.js';
import { QUIZZES, REVIEW_UI } from '../../review/data.js';
import { REVIEW_KEY, loadReview, recordRun, unlocked } from '../../review/engine.js';
import { renderReview, newReviewView } from '../../review/render.js';
import { BADGES } from '../../practice/data.js';
import { AGENT_LESSONS } from '../../agent/lessons/index.js';
import { AS_LESSONS } from '../../agent-sop/lessons/index.js';

const doc = (lang) => readFileSync(new URL(`../../docs/superpowers/specs/2026-11-27-agent-review-quiz-copy${lang === 'ko' ? '-ko' : '.en'}.md`, import.meta.url), 'utf8');
const cells = (line) => line.slice(1, -1).split(' | ').map((c) => c.trim());
const rowIn = (text, place) => cells(text.split('\n').find((l) => l.startsWith(`| ${place} |`)))[1];
function parseQuestion(block) {
  const q = { options: [] };
  for (const line of block.split('\n')) {
    if (!line.startsWith('| ') || line.startsWith('| 항목') || line.startsWith('|---')) continue;
    const [key, value] = cells(line);
    let m;
    if (key === '질문') q.prompt = value;
    else if ((m = key.match(/^보기 ([a-c]) \((오답|정답)\)$/))) {
      q.options.push({ id: m[1], text: value });
      if (m[2] === '정답') q.answer = m[1];
    } else if ((m = key.match(/^([a-c]) 피드백$/))) q.options.find((o) => o.id === m[1]).feedback = value;
    else if (key === '해설') q.explanation = value;
    else if (key === '관련 레슨') q.lessons = [...value.matchAll(/(.+?) \((\.\.\/\S+)\)(?: · |$)/g)].map((m2) => ({ title: m2[1], href: m2[2] }));
  }
  return q;
}
const parsed = (text) => text.split(/^## 퀴즈 3\. /m)[1].split(/^### 문제 \d+/m).slice(1).map(parseQuestion);
const section = (text, n) => text.split(new RegExp(`^## ${n}\\. `, 'm'))[1].split(/^## /m)[0];

for (const lang of ['ko', 'en']) {
  test(`the agent quiz is the approved ${lang} copy, word for word`, () => {
    const text = doc(lang);
    const want = parsed(text);
    const qs = QUIZZES.agent.questions;
    assert.equal(qs.length, 6);
    qs.forEach((q, i) => {
      const w = want[i];
      assert.equal(q.id, `agent-q${i + 1}`);
      assert.equal(q.prompt[lang], w.prompt, q.id);
      assert.equal(q.answer, w.answer, q.id);
      assert.equal(q.explanation[lang], w.explanation, q.id);
      assert.deepEqual(q.options.map((o) => ({ id: o.id, text: o.text[lang], ...(o.feedback ? { feedback: o.feedback[lang] } : {}) })), w.options, q.id);
      assert.deepEqual(q.lessons.map((l) => ({ title: l.title[lang], href: l.href })), w.lessons, q.id);
    });
    assert.equal(QUIZZES.agent.name[lang], rowIn(section(text, 1), '상담사 퀴즈 이름'));
    assert.equal(QUIZZES.agent.scope[lang], rowIn(section(text, 1), '상담사 퀴즈 범위'));
    const badge = BADGES.find((b) => b.id === 'review-agent');
    assert.equal(badge.name[lang], rowIn(section(text, 2), '상담사 배지 이름'));
    assert.equal(badge.rule[lang], rowIn(section(text, 2), '상담사 배지 조건'));
  });
}

test('the agent quiz: answers over a, b and c, feedback only on wrong options', () => {
  const qs = QUIZZES.agent.questions;
  for (const id of ['a', 'b', 'c']) assert.ok(qs.some((q) => q.answer === id), id);
  for (const q of qs) for (const o of q.options) assert.equal(Boolean(o.feedback), o.id !== q.answer, `${q.id} ${o.id}`);
});

test('related lessons are real agent lessons, named by their titles', () => {
  const courses = {
    'agent/': { lessons: AGENT_LESSONS, name: (l) => ({ ko: `상담사 첫걸음 레슨 ${l.order} · ${l.title.ko}`, en: `Agent First Steps lesson ${l.order} · ${l.title.en}` }) },
    'agent-sop/': { lessons: AS_LESSONS, name: (l) => ({ ko: `상담사 SOP · ${l.title.ko}`, en: `Agent SOP · ${l.title.en}` }) },
  };
  for (const q of QUIZZES.agent.questions) {
    assert.ok(q.lessons.length >= 2, q.id);
    for (const link of q.lessons) {
      const [, path, id] = link.href.match(/^\.\.\/([^#]+)#(.+)-0$/);
      const l = courses[path].lessons.find((x) => x.id === id);
      assert.ok(l, link.href);
      assert.deepEqual(link.title, courses[path].name(l), link.href);
    }
  }
});

const FIRST = JSON.stringify({ completed: AGENT_LESSONS.map((l) => l.id) });
const SOP = JSON.stringify({ completed: AS_LESSONS.map((l) => l.id) });

test('the agent quiz opens once Agent First Steps and the Agent SOP Library are finished', () => {
  assert.deepEqual(unlocked(fakeStorage(), 'agent'), { open: false, left: 16, next: { href: '../agent/#start-0' } });
  assert.deepEqual(unlocked(fakeStorage({ 'agent-course:v1': FIRST }), 'agent'), { open: false, left: 8, next: { href: '../agent-sop/#request-0' } });
  assert.deepEqual(unlocked(fakeStorage({ 'agent-course:v1': FIRST, 'agent-sop:v1': SOP }), 'agent'), { open: true, left: 0, next: null });
});

test('agent records are kept beside the others; impossible ones are not read', () => {
  const s = fakeStorage({ [REVIEW_KEY]: JSON.stringify({ sme: { best: 5, total: 6, passed: true } }) });
  assert.deepEqual(recordRun(s, 'agent', 4, 6), { best: 4, total: 6, passed: false, firstPass: false });
  assert.deepEqual(loadReview(s), { sme: { best: 5, total: 6, passed: true }, agent: { best: 4, total: 6, passed: false } });
  assert.deepEqual(loadReview(fakeStorage({ [REVIEW_KEY]: JSON.stringify({ agent: { best: 99, total: 6, passed: true } }) })), {});
});

function page(storage, role, lang = 'ko') {
  const { root } = setupDom();
  const view = newReviewView();
  const draw = () => renderReview(root, lang, storage, view, role, draw);
  draw();
  return root;
}

test('an agent sees the agent quiz first; others keep theirs first', () => {
  const order = (role) => [...page(fakeStorage(), role).querySelectorAll('[data-quiz]')].map((c) => c.getAttribute('data-quiz'));
  assert.deepEqual(order('agent'), ['agent', 'tl', 'sme']);
  assert.deepEqual(order('tl'), ['tl', 'sme', 'agent']);
  assert.deepEqual(order('sme'), ['sme', 'tl', 'agent']);
  const card = page(fakeStorage({ 'agent-course:v1': FIRST }), 'agent').querySelector('[data-quiz="agent"]');
  assert.equal(card.querySelector('[data-locked]').textContent, REVIEW_UI.locked.ko.replace('{n}', '8'));
  assert.equal(card.querySelector('a[data-locked-link]').getAttribute('href'), '../agent-sop/#request-0');
});

test('passing the agent quiz awards the agent badge', () => {
  const s = fakeStorage({ 'agent-course:v1': FIRST, 'agent-sop:v1': SOP });
  const root = page(s, 'agent');
  click(root.querySelector('[data-start-quiz="agent"]'));
  for (const q of QUIZZES.agent.questions) {
    click(root.querySelector(`[data-option="${q.answer}"]`));
    click(root.querySelector('[data-next]'));
  }
  const badge = root.querySelector('[data-new-badge]');
  assert.ok(badge, 'badge shown');
  assert.ok(badge.textContent.includes(BADGES.find((b) => b.id === 'review-agent').name.ko));
  assert.equal(loadReview(s).agent.passed, true);
});

test('the English agent quiz has no Korean, through to the result', () => {
  const s = fakeStorage({ 'agent-course:v1': FIRST, 'agent-sop:v1': SOP });
  const root = page(s, 'agent', 'en');
  click(root.querySelector('[data-start-quiz="agent"]'));
  for (const q of QUIZZES.agent.questions) {
    click(root.querySelector(`[data-option="${q.options.find((o) => o.id !== q.answer).id}"]`));
    assert.ok(!/[가-힣]/.test(root.textContent), q.id);
    click(root.querySelector('[data-next]'));
  }
  assert.ok(!/[가-힣]/.test(root.textContent), 'result');
});
