import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, click, key } from './dom.js';
import { makeLesson, makeBilingualLesson } from './fixtures.js';
import { renderDiagram } from '../js/render/diagram.js';
import { renderHome } from '../js/render/home.js';
import { renderLesson } from '../js/render/lesson.js';
import { renderLangToggle } from '../js/render/langToggle.js';
import { UI } from '../js/i18n/ui.js';

const IDS = ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'];
const course = () => IDS.map((id, i) => makeLesson({
  id, order: i + 1, connection: { to: IDS[(i + 1) % 6], text: { ko: '다음으로 이어집니다.' } },
}));

function mountLesson(lesson = makeLesson(), stepIndex = 0, lang = 'ko') {
  const { root } = setupDom();
  const calls = { navigate: [], complete: [] };
  const view = renderLesson(root, lesson, stepIndex, lang, {
    onNavigate: (href) => calls.navigate.push(href),
    onComplete: (id) => calls.complete.push(id),
  });
  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => [...root.querySelectorAll(sel)];
  return { root, view, calls, $, $$ };
}

test('home lists six stages in order with the loop edge', () => {
  const { root } = setupDom();
  renderHome(root, course(), { completed: ['hiring'] }, 'ko');
  const ring = [...root.querySelectorAll('svg a[data-stage]')];
  const list = [...root.querySelectorAll('[data-stage-list] a[data-stage]')];
  const hrefs = IDS.map((id) => `#${id}-0`);
  assert.deepEqual(ring.map((a) => a.getAttribute('href')), hrefs);
  assert.deepEqual(list.map((a) => a.getAttribute('href')), hrefs);
  assert.ok(root.querySelector('[data-edge="loop"]'));
  assert.ok(ring[0].classList.contains('is-done'));
  assert.ok(list[0].classList.contains('is-done'));
  assert.ok(!ring[1].classList.contains('is-done'));
});

test('diagram classes follow the step without rebuilding nodes', () => {
  const { document } = setupDom();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const l = makeLesson();
  renderDiagram(svg, l.diagram, l.steps[0], 'ko');
  const nodeB = svg.querySelector('[data-node="b"]');
  const count = svg.querySelectorAll('[data-node]').length;
  assert.equal(count, 3);
  assert.ok(nodeB.classList.contains('is-hidden'));
  assert.ok(svg.querySelector('[data-node="a"]').classList.contains('is-active'));
  assert.ok(svg.querySelector('[data-edge="ab"]').classList.contains('is-hidden'));

  renderDiagram(svg, l.diagram, l.steps[2], 'ko');
  assert.equal(svg.querySelector('[data-node="b"]'), nodeB);
  assert.equal(svg.querySelectorAll('[data-node]').length, count);
  assert.ok(!nodeB.classList.contains('is-hidden'));
  assert.ok(nodeB.classList.contains('is-active'));
  assert.ok(!svg.querySelector('[data-node="a"]').classList.contains('is-active'));
  assert.ok(!svg.querySelector('[data-edge="ab"]').classList.contains('is-hidden'));
});

test('diagram persona hides when the step has none', () => {
  const { document } = setupDom();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const l = makeLesson();
  renderDiagram(svg, l.diagram, l.steps[0], 'ko');
  const persona = svg.querySelector('[data-persona]');
  assert.ok(!persona.classList.contains('is-hidden'));
  renderDiagram(svg, l.diagram, { ...l.steps[0], persona: null }, 'ko');
  assert.ok(persona.classList.contains('is-hidden'));
});

test('lesson shows the first caption and counter', () => {
  const l = makeLesson();
  const { $ } = mountLesson(l);
  // Names show as role pills (shared/cast.js): 지민이 → [지원자]가 (채용 레슨).
  assert.equal($('[data-caption]').textContent, '지원자가 지원서를 냅니다.');
  assert.equal($('[data-counter]').textContent, '1 / 6');
});

test('prev on the first step does nothing', () => {
  const { $, calls } = mountLesson();
  click($('[data-prev]'));
  key('ArrowLeft');
  assert.deepEqual(calls.navigate, []);
  assert.equal($('[data-counter]').textContent, '1 / 6');
});

test('next button and arrow key advance and navigate', () => {
  const l = makeLesson();
  const { $, calls } = mountLesson(l);
  click($('[data-next]'));
  assert.deepEqual(calls.navigate, ['#hiring-1']);
  assert.equal($('[data-caption]').textContent, l.steps[1].caption.ko);
  key('ArrowRight');
  assert.deepEqual(calls.navigate, ['#hiring-1', '#hiring-2']);
  key('ArrowLeft');
  assert.equal($('[data-counter]').textContent, '2 / 6');
});

test('start index is clamped into range', () => {
  const { $ } = mountLesson(makeLesson(), 99);
  assert.equal($('[data-counter]').textContent, '6 / 6');
});

test('next on the last step opens the checkpoint, and repeated presses are harmless', () => {
  const l = makeLesson();
  const { $ } = mountLesson(l, 5);
  assert.ok($('[data-view="checkpoint"]').hidden);
  click($('[data-next]'));
  key('ArrowRight');
  key('ArrowRight');
  assert.ok(!$('[data-view="checkpoint"]').hidden);
  assert.ok($('[data-view="steps"]').hidden);
  assert.equal($('[data-question="q1"] [data-prompt]').textContent, l.checkpoint[0].prompt.ko);
});

test('back from the checkpoint returns to the last step', () => {
  const { $ } = mountLesson(makeLesson(), 5);
  click($('[data-next]'));
  click($('[data-back]'));
  assert.ok($('[data-view="checkpoint"]').hidden);
  assert.equal($('[data-counter]').textContent, '6 / 6');
});

test('re-answering replaces the explanation', () => {
  const l = makeLesson();
  const { $, $$ } = mountLesson(l, 5);
  click($('[data-next]'));
  click($('[data-option="y"]'));
  assert.ok($('[data-option="y"]').classList.contains('is-wrong'));
  click($('[data-option="x"]'));
  const explanations = $$('[data-question="q1"] [data-explanation]').filter((e) => !e.hidden);
  assert.equal(explanations.length, 1);
  assert.ok(explanations[0].textContent.includes(l.checkpoint[0].explanation.ko));
  assert.ok($('[data-option="x"]').classList.contains('is-correct'));
  assert.ok(!$('[data-option="y"]').classList.contains('is-wrong'));
});

test('answering every question completes the lesson once', () => {
  const l = makeLesson();
  const { $, calls } = mountLesson(l, 5);
  click($('[data-next]'));
  assert.ok($('[data-connection]').hidden);
  click($('[data-option="y"]'));
  click($('[data-option="x"]'));
  assert.deepEqual(calls.complete, ['hiring']);
  assert.ok(!$('[data-connection]').hidden);
  assert.ok($('[data-connection]').textContent.includes(l.connection.text.ko));
  assert.equal($('[data-next-lesson]').getAttribute('href'), '#onboarding-0');
});

test('destroy stops keyboard handling', () => {
  const { view, calls } = mountLesson();
  view.destroy();
  key('ArrowRight');
  assert.deepEqual(calls.navigate, []);
});

test('goTo moves to a step without navigating', () => {
  const { view, $, calls } = mountLesson();
  view.goTo(3);
  assert.equal($('[data-counter]').textContent, '4 / 6');
  assert.deepEqual(calls.navigate, []);
});

test('english with translation shows English and no note', () => {
  const l = makeBilingualLesson();
  const { $ } = mountLesson(l, 0, 'en');
  assert.equal($('[data-caption]').textContent, 'The Applicant applies.');
  assert.equal($('[data-prev]').textContent.trim(), UI.prev.en);
  assert.equal($('[data-next]').textContent.trim(), UI.next.en);
  assert.ok($('[data-translation-note]').hidden);
  assert.equal(document.documentElement.lang, 'en');
});

test('english without translation falls back to Korean with a note', () => {
  const l = makeLesson();
  const { $ } = mountLesson(l, 0, 'en');
  assert.equal($('[data-caption]').textContent, '지원자가 지원서를 냅니다.');
  assert.equal($('[data-translation-note]').textContent, 'Translation coming soon');
  assert.ok(!$('[data-translation-note]').hidden);
  assert.equal($('[data-next]').textContent.trim(), UI.next.en);
});

test('home in English falls back with a note', () => {
  const { root } = setupDom();
  renderHome(root, course(), { completed: [] }, 'en');
  assert.equal(root.querySelector('[data-translation-note]').textContent, 'Translation coming soon');
});

test('lang toggle reports the chosen language', () => {
  const { root } = setupDom();
  const picked = [];
  renderLangToggle(root, 'ko', (lang) => picked.push(lang));
  assert.equal(root.querySelector('[data-lang="ko"]').getAttribute('aria-pressed'), 'true');
  assert.equal(root.querySelector('[data-lang="en"]').getAttribute('aria-pressed'), 'false');
  click(root.querySelector('[data-lang="en"]'));
  assert.deepEqual(picked, ['en']);
});

// --- final review fixes ---
import { readdirSync } from 'node:fs';

test('no served file starts with an underscore (GitHub Pages skips them)', () => {
  const bad = readdirSync(new URL('../js', import.meta.url), { recursive: true })
    .filter((f) => String(f).split(/[\\/]/).pop().startsWith('_'));
  assert.deepEqual(bad, []);
});

test('focus moves to the checkpoint heading and back to the next button', () => {
  const { $ } = mountLesson(makeLesson(), 5);
  click($('[data-next]'));
  assert.equal(document.activeElement, $('[data-view="checkpoint"] h2'));
  click($('[data-back]'));
  assert.equal(document.activeElement, $('[data-next]'));
});

test('arrow keys with a modifier are left to the browser', () => {
  const { calls } = mountLesson();
  for (const mod of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', [mod]: true, bubbles: true }));
  }
  assert.deepEqual(calls.navigate, []);
});

test('a snapshot restores the checkpoint and its answers in another language', () => {
  const l = makeBilingualLesson();
  const first = mountLesson(l, 5);
  click(first.$('[data-next]'));
  click(first.$('[data-option="x"]'));
  const snap = first.view.snapshot();
  first.view.destroy();

  const root = document.getElementById('app');
  renderLesson(root, l, snap.step, 'en', { onNavigate() {}, onComplete() {}, restore: snap });
  assert.ok(!root.querySelector('[data-view="checkpoint"]').hidden);
  assert.ok(root.querySelector('[data-option="x"]').classList.contains('is-correct'));
  assert.ok(root.querySelector('[data-explanation]').textContent.includes(l.checkpoint[0].explanation.en));
  assert.ok(!root.querySelector('[data-connection]').hidden);
});

test('ring links are decorative duplicates of the stage cards', () => {
  const { root } = setupDom();
  renderHome(root, course(), { completed: [] }, 'ko');
  assert.equal(root.querySelector('svg.ring').getAttribute('aria-hidden'), 'true');
  for (const a of root.querySelectorAll('svg a[data-stage]')) assert.equal(a.getAttribute('tabindex'), '-1');
});

// --- tracks ---
import { makeTrackLesson } from './fixtures.js';
import { renderTrackToggle } from '../js/render/trackToggle.js';

function mountTrack(track, stepIndex = 0, lang = 'ko', restore) {
  const { root } = setupDom();
  const calls = { navigate: [], complete: [] };
  const view = renderLesson(root, makeTrackLesson(), stepIndex, lang, {
    onNavigate: (href) => calls.navigate.push(href),
    onComplete: (id) => calls.complete.push(id),
    track, restore,
  });
  return { root, view, calls, $: (sel) => root.querySelector(sel), $$: (sel) => [...root.querySelectorAll(sel)] };
}

test('each track shows common steps plus its own', () => {
  assert.equal(mountTrack('general').$('[data-counter]').textContent, '1 / 7');
  assert.equal(mountTrack('tech').$('[data-counter]').textContent, '1 / 8');
});

test('step index clamps to the track step count', () => {
  assert.equal(mountTrack('tech', 99).$('[data-counter]').textContent, '8 / 8');
  assert.equal(mountTrack('general', 99).$('[data-counter]').textContent, '7 / 7');
});

test('track badge shows only on track-only steps', () => {
  const { $ } = mountTrack('general', 1);
  assert.ok($('[data-track-badge]').hidden);
  click($('[data-next]')); // general-only step
  assert.ok(!$('[data-track-badge]').hidden);
  assert.equal($('[data-track-badge]').textContent, '일반 고객지원');
  click($('[data-next]'));
  assert.ok($('[data-track-badge]').hidden);
});

test('track badge is translated', () => {
  const { $ } = mountTrack('general', 2, 'en');
  assert.equal($('[data-track-badge]').textContent, 'General support');
});

test('checkpoint shows the common question plus the track question', () => {
  const g = mountTrack('general', 99);
  click(g.$('[data-next]'));
  assert.deepEqual(g.$$('[data-question]').map((q) => q.getAttribute('data-question')), ['q1', 'qg']);
  const t = mountTrack('tech', 99);
  click(t.$('[data-next]'));
  assert.deepEqual(t.$$('[data-question]').map((q) => q.getAttribute('data-question')), ['q1', 'qt']);
});

test('the lesson completes only after both visible questions are answered', () => {
  const { $, calls } = mountTrack('tech', 99);
  click($('[data-next]'));
  click($('[data-question="q1"] [data-option="x"]'));
  assert.deepEqual(calls.complete, []);
  assert.ok($('[data-connection]').hidden);
  click($('[data-question="qt"] [data-option="x"]'));
  assert.deepEqual(calls.complete, ['hiring']);
  assert.ok(!$('[data-connection]').hidden);
});

test('restoring a checkpoint into another track reopens it without answers', () => {
  const g = mountTrack('general', 99);
  click(g.$('[data-next]'));
  click(g.$('[data-question="q1"] [data-option="x"]'));
  const snap = g.view.snapshot();
  assert.equal(snap.track, 'general');
  g.view.destroy();
  const t = mountTrack('tech', 0, 'ko', snap);
  assert.ok(!t.$('[data-view="checkpoint"]').hidden);
  assert.equal(t.$$('.is-correct').length, 0);
  assert.ok(t.$('[data-connection]').hidden);
  assert.deepEqual(t.calls.complete, []);
});

test('restoring a checkpoint into the same track keeps answers', () => {
  const g = mountTrack('general', 99);
  click(g.$('[data-next]'));
  click(g.$('[data-question="q1"] [data-option="x"]'));
  const snap = g.view.snapshot();
  g.view.destroy();
  const again = mountTrack('general', 99, 'ko', snap);
  assert.ok(again.$('[data-question="q1"] [data-option="x"]').classList.contains('is-correct'));
});

test('track toggle reports the chosen track', () => {
  const { root } = setupDom();
  const picked = [];
  renderTrackToggle(root, 'general', 'en', (t) => picked.push(t));
  assert.equal(root.querySelector('[data-track="general"]').getAttribute('aria-pressed'), 'true');
  assert.equal(root.querySelector('[data-track="tech"]').getAttribute('aria-pressed'), 'false');
  assert.equal(root.querySelector('[data-track="tech"]').textContent, 'Tech support');
  assert.equal(root.querySelector('[role="group"]').getAttribute('aria-label'), 'Team type');
  click(root.querySelector('[data-track="general"]'));
  click(root.querySelector('[data-track="tech"]'));
  assert.deepEqual(picked, ['tech']);
});

test('home shows the track hint', () => {
  const { root } = setupDom();
  renderHome(root, course(), { completed: [] }, 'ko');
  assert.equal(root.querySelector('[data-track-hint]').textContent, UI.trackHint.ko);
});

test('the translation note looks only at what the track shows', () => {
  const l = makeBilingualLesson();
  l.steps.push({ track: 'tech', caption: { ko: '기술지원 전용입니다.' }, show: ['a'], highlight: [], persona: 'a' });
  const { root } = setupDom();
  renderLesson(root, l, 0, 'en', { onNavigate() {}, onComplete() {}, track: 'general' });
  assert.ok(root.querySelector('[data-translation-note]').hidden);
  renderLesson(root, l, 0, 'en', { onNavigate() {}, onComplete() {}, track: 'tech' }).destroy();
  assert.ok(!root.querySelector('[data-translation-note]').hidden);
});

// --- options for a second course ---
test('diagram boxes can be wider and the badge can carry another name', () => {
  const { document } = setupDom();
  const make = () => document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const l = makeLesson();
  const plain = make();
  renderDiagram(plain, l.diagram, l.steps[2], 'ko');
  assert.equal(plain.querySelector('[data-node="a"] rect').getAttribute('width'), '108');
  assert.equal(plain.querySelector('[data-persona] text').textContent, '지민');
  assert.equal(plain.querySelector('[data-edge="ab"]').getAttribute('x1'), '116');

  const wide = make();
  l.diagram.nodes[0].hw = 76;
  renderDiagram(wide, l.diagram, l.steps[2], 'ko', { personaName: { ko: '도윤', en: 'Doyun' } });
  const rect = wide.querySelector('[data-node="a"] rect');
  assert.equal(rect.getAttribute('x'), '-76');
  assert.equal(rect.getAttribute('width'), '152');
  assert.equal(wide.querySelector('[data-edge="ab"]').getAttribute('x1'), '138');
  assert.equal(wide.querySelector('[data-node="b"] rect').getAttribute('width'), '108');
  assert.equal(wide.querySelector('[data-persona] text').textContent, '도윤');
});

test('a lesson can belong to a course of another size with its own wording', () => {
  const { $ } = mountLesson();
  assert.equal($('.eyebrow').textContent, '1 / 6');
  assert.equal($('[data-home]').textContent, `← ${UI.home.ko}`);
  assert.equal($('[data-next-lesson]').getAttribute('href'), '#onboarding-0');

  const { root } = setupDom();
  const lesson = makeLesson({ order: 4, connection: { to: 'home', text: { ko: '여기까지입니다.' } }, personaName: { ko: '도윤' } });
  lesson.steps[0].caption.ko = '도윤이 지원서를 냅니다.';
  renderLesson(root, lesson, 0, 'ko', {
    onNavigate() {}, onComplete() {}, lessonCount: 4,
    text: { home: { ko: '목록' }, toList: { ko: '목록으로' }, connection: { ko: '다음으로' } },
  });
  assert.equal(root.querySelector('.eyebrow').textContent, '4 / 4');
  assert.equal(root.querySelector('[data-home]').textContent, '← 목록');
  const next = root.querySelector('[data-next-lesson]');
  assert.equal(next.getAttribute('href'), '#home');
  assert.equal(next.textContent, '목록으로 →');
  assert.equal(root.querySelector('[data-connection] h3').textContent, '다음으로');
  assert.equal(root.querySelector('[data-persona] text').textContent, '도윤');
});

// --- Miso on the completion card (app shell) ---
test('the completion card has Miso, proud, with one line of congratulations', () => {
  const { $ } = mountLesson();
  const card = $('[data-connection]');
  const img = card.querySelector('img[data-miso="proud"]');
  assert.ok(img.getAttribute('src').endsWith('/assets/miso/proud.webp') && !img.getAttribute('src').startsWith('../'), 'resolved from the module, so any page depth works');
  assert.ok(img.getAttribute('alt').includes('김미소'));
  assert.equal(card.querySelector('[data-miso-line]').textContent, '한 단계 마쳤어요. 오늘 배운 걸 팀에서 한 번 써 보세요.');
  assert.ok(UI.misoCheer.en && !/[가-힣]/.test(UI.misoCheer.en + UI.misoProudAlt.en));
});

test('a wrong answer shows that option\'s feedback before the shared explanation; a right one shows none', async () => {
  const { LESSONS } = await import('../js/lessons/index.js');
  const hiring = LESSONS.find((l) => l.id === 'hiring');
  const { $ } = mountLesson(hiring, 99);
  click($('[data-next]'));
  const q = hiring.checkpoint[0];
  click($(`[data-question="${q.id}"] [data-option="a"]`));
  const box = $(`[data-question="${q.id}"] [data-explanation]`);
  assert.equal(box.querySelector('[data-feedback]').textContent, q.options.find((o) => o.id === 'a').feedback.ko);
  assert.ok(box.textContent.indexOf(q.options[0].feedback.ko) < box.textContent.indexOf(q.explanation.ko));
  assert.ok(box.textContent.includes(q.explanation.ko));
  click($(`[data-question="${q.id}"] [data-option="c"]`));
  assert.equal(box.querySelector('[data-feedback]').textContent, q.options.find((o) => o.id === 'c').feedback.ko, 'switches with the choice');
  click($(`[data-question="${q.id}"] [data-option="${q.answer}"]`));
  assert.equal(box.querySelector('[data-feedback]'), null);
  assert.ok(!/null/.test(box.textContent), 'no stray "null" when there is no feedback');
});
