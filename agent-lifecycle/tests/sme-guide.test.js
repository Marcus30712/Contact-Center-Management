// SME Situation Guide (2026-11-25). The Korean is the approved table in
// docs/superpowers/specs/2026-11-25-sme-guide-design.md §5.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SME_GUIDE_UI, SME_GROUPS } from '../../sme-guide/data.js';
import { GUIDE_UI } from '../../guide/data.js';
import { SME_LESSONS } from '../../sme/lessons/index.js';
import { SL_LESSONS } from '../../sme-lifecycle/lessons/index.js';
import { SS_LESSONS } from '../../sme-sop/lessons/index.js';
import { SOP_LESSONS } from '../../sop-library/lessons/index.js';
import { DAILY } from '../../codex/data/daily.js';

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-sme-guide-design.md', import.meta.url), 'utf8');
const cells = (line) => line.slice(1, -1).split(' | ').map((c) => c.trim());
const row = (place) => cells(DOC.split('\n').find((l) => l.startsWith(`| ${place} |`)))[1];

// The approved table: number | group heading (carried down) | situation | first | then
const ROWS = [];
for (const m of DOC.matchAll(/^\| (m\d+) \|(.*?)\| (.+?) \| (.+?) \| (.+?) \|$/gm)) {
  ROWS.push({ id: m[1], heading: m[2].trim() || ROWS.at(-1).heading, text: m[3], first: m[4], then: m[5] });
}
const flat = SME_GROUPS.flatMap((g) => g.situations.map((s) => ({ g, s })));

// Where each course lives and how its lesson links are named.
const COURSES = {
  'sme/': { lessons: SME_LESSONS, name: (l) => ({ ko: `직무전문가 첫걸음 레슨 ${l.order} · ${l.title.ko}`, en: `SME First Steps lesson ${l.order} · ${l.title.en}` }) },
  'sme-lifecycle/': { lessons: SL_LESSONS, name: (l) => ({ ko: `직무전문가 서포트 라이프사이클 레슨 ${l.order} · ${l.title.ko}`, en: `SME Support Lifecycle lesson ${l.order} · ${l.title.en}` }) },
  'sme-sop/': { lessons: SS_LESSONS, name: (l) => ({ ko: `직무전문가 SOP · ${l.title.ko}`, en: `SME SOP · ${l.title.en}` }) },
  'sop-library/': { lessons: SOP_LESSONS, name: (l) => ({ ko: `팀장 SOP · ${l.title.ko}`, en: `TL SOP · ${l.title.en}` }) },
};
const lessonOf = (href) => {
  const [, path, hash = ''] = href.match(/^\.\.\/([^#]+)(?:#(.*))?$/);
  const c = COURSES[path];
  return c ? { c, l: c.lessons.find((x) => `${x.id}-0` === hash) } : { path, hash };
};

test('sixteen situations in five groups, as approved', () => {
  assert.equal(ROWS.length, 16);
  assert.deepEqual(flat.map(({ s }) => s.id), ROWS.map((r) => r.id));
  assert.deepEqual(flat.map(({ g }) => g.heading.ko), ROWS.map((r) => r.heading));
  assert.deepEqual(flat.map(({ s }) => s.text.ko), ROWS.map((r) => r.text));
  assert.deepEqual(flat.map(({ s }) => s.first.title.ko), ROWS.map((r) => r.first));
  assert.deepEqual(flat.map(({ s }) => s.then.title.ko), ROWS.map((r) => r.then));
  assert.deepEqual(['전체', ...SME_GROUPS.map((g) => g.chip.ko)], row('칩').split(' / '));
  assert.deepEqual(SME_GROUPS.map((g) => g.id), ['week', 'new', 'agents', 'rush', 'lead']);
});

test('screen wording is the approved wording', () => {
  assert.equal(SME_GUIDE_UI.title.ko, row('제목'));
  assert.equal(SME_GUIDE_UI.intro.ko, row('안내'));
  for (const key of Object.keys(GUIDE_UI)) if (!['title', 'intro'].includes(key)) assert.equal(SME_GUIDE_UI[key], GUIDE_UI[key], key);
});

test('every link goes to a place that exists', () => {
  for (const { s } of flat) {
    for (const { href } of [s.first, s.then]) {
      const found = lessonOf(href);
      if (found.c) assert.ok(found.l, href);
      else {
        assert.equal(found.path, 'codex/', href);
        assert.ok(found.hash === 'career' || (found.hash.startsWith('daily-') && DAILY.roles.some((r) => `daily-${r.id}` === found.hash)), href);
      }
    }
  }
});

test('SME lesson link names are the current lesson titles', () => {
  for (const { s } of flat) {
    for (const link of [s.first, s.then]) {
      const { c, l } = lessonOf(link.href);
      if (c) assert.equal(link.title.ko, c.name(l).ko, link.href);
    }
  }
});

// ---------- the page (Task 2) ----------
import { setupDom, click } from './dom.js';
import { renderGuide, newGuideState } from '../../guide/render.js';
import { GROUPS } from '../../guide/data.js';

const SME_DATA = { ui: SME_GUIDE_UI, groups: SME_GROUPS };
function mount(lang = 'ko', state = newGuideState(), data = SME_DATA, hash = '') {
  const { root, window } = setupDom();
  if (hash) window.location.hash = hash;
  const draw = () => (data ? renderGuide(root, lang, state, data) : renderGuide(root, lang, state));
  draw();
  return { root, state, $: (s) => root.querySelector(s), $$: (s) => [...root.querySelectorAll(s)] };
}
const isOpen = (card) => card.querySelector('[aria-expanded]').getAttribute('aria-expanded') === 'true';

test('the SME guide shows six chips and sixteen closed situations', () => {
  const { $, $$ } = mount();
  assert.equal($('h1').textContent, '직무전문가 상황별 길잡이');
  assert.equal($('.tagline').textContent, SME_GUIDE_UI.intro.ko);
  assert.deepEqual($$('[data-tab]').map((b) => b.getAttribute('data-tab')), ['all', 'week', 'new', 'agents', 'rush', 'lead']);
  assert.equal($$('[data-card]').length, 16);
  assert.ok($$('[data-card]').every((c) => !isOpen(c)));
  assert.ok($('header img[data-miso="think"]'));
});

test('a chip narrows to one group; a card opens to its two links', () => {
  const { $, $$ } = mount();
  $('[data-tab="new"]').click();
  assert.deepEqual($$('[data-group]:not([hidden])').map((g) => g.getAttribute('data-group')), ['new']);
  $('[data-card="m3"] button').click();
  const links = [...$('[data-card="m3"]').querySelectorAll('a[data-go]')];
  assert.deepEqual(links.map((a) => [a.getAttribute('data-go'), a.getAttribute('href')]),
    [['first', '../sme-lifecycle/?guide=m3#trainee-0'], ['then', '../sop-library/#onboarding-0']]);
});

test('the TL guide renders as before', () => {
  const { $, $$ } = mount('ko', newGuideState(), null);
  assert.equal($('h1').textContent, '팀장 상황별 길잡이');
  assert.equal($$('[data-card]').length, GROUPS.flatMap((g) => g.situations).length);
  assert.equal($('[data-card="m1"]'), null);
});

test('odd addresses show the list', () => {
  for (const hash of ['#s1', '#m99', '#learn']) {
    const { $$ } = mount('ko', newGuideState(), SME_DATA, hash);
    assert.equal($$('[data-card]').length, 16, hash);
    assert.ok($$('[data-card]').every((c) => !isOpen(c)), hash);
  }
});

test('the SME guide page draws the SME data', () => {
  const app = readFileSync(new URL('../../sme-guide/app.js', import.meta.url), 'utf8');
  assert.match(app, /renderGuide\(app, lang, state, \{ ui: SME_GUIDE_UI, groups: SME_GROUPS \}\)/);
  const html = readFileSync(new URL('../../sme-guide/index.html', import.meta.url), 'utf8');
  assert.match(html, /<title>직무전문가 상황별 길잡이<\/title>/);
  assert.match(html, /href="\.\.\/guide\/guide\.css"/);
});

// ---------- connected (Task 3) ----------
import { guideFor } from '../../guide/link.js';
import { renderLesson } from '../js/render/lesson.js';
import { SL_UI } from '../../sme-lifecycle/ui.js';

test('guideFor finds SME situations only on their own lesson', () => {
  assert.equal(guideFor('?guide=m3', 'sme-lifecycle', 'trainee').id, 'm3');
  assert.equal(guideFor('?guide=m3', 'sme-lifecycle', 'graduate'), null);
  assert.equal(guideFor('?guide=s1', 'sme', 'firstday'), null);
  assert.equal(guideFor('?guide=m1', 'sme', 'firstday').then.href, '../codex/#daily-sme');
  assert.equal(guideFor('?guide=m6', 'sme-sop', 'approval').id, 'm6');
  assert.equal(guideFor('?guide=s1', 'sop-library', 'coaching').id, 's1');
});

test('a lesson opened from the SME guide ends with its "then" link', () => {
  const { root } = setupDom();
  const m3 = guideFor('?guide=m3', 'sme-lifecycle', 'trainee');
  const lesson = SL_LESSONS.find((l) => l.id === 'trainee');
  renderLesson(root, lesson, 99, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: 5, text: SL_UI, guide: m3 });
  click(root.querySelector('[data-next]'));
  for (const q of lesson.checkpoint) click(root.querySelector(`[data-question="${q.id}"] [data-option="${q.answer}"]`));
  const then = root.querySelector('[data-connection] a[data-guide-then]');
  assert.ok(then, 'then card shown');
  assert.equal(then.getAttribute('href'), '../sop-library/#onboarding-0');
});

test('the SME course apps settle the guide', () => {
  for (const dir of ['sme', 'sme-lifecycle', 'sme-sop']) {
    const src = readFileSync(new URL(`../../${dir}/app.js`, import.meta.url), 'utf8');
    assert.ok(src.includes(`settleGuide(location, history, '${dir}',`), dir);
    assert.ok(/\n\s+guide,\n/.test(src), `${dir} passes the guide to the lesson`);
  }
});

// ---------- English (Task 4): design doc §7 ----------
const EN_ROWS = Object.fromEntries((DOC.split('## 7. ')[1] ?? '').split('\n')
  .filter((l) => l.startsWith('| ') && !l.startsWith('| 한국어') && !l.startsWith('|---')).map((l) => cells(l).slice(0, 2)));

test('English is complete, American and free of Korean', () => {
  const strings = [SME_GUIDE_UI, ...SME_GROUPS.flatMap((g) => [g.chip, g.heading, ...g.situations.flatMap((s) => [s.text, s.first.title, s.then.title])])]
    .flatMap((x) => ('ko' in x ? [x] : Object.values(x)));
  for (const x of strings) {
    assert.ok(x.ko?.trim() && x.en?.trim(), x.ko);
    assert.ok(!/[가-힣]/.test(x.en), x.en);
    assert.ok(!/licence|organis|behaviour|centre/.test(x.en), x.en);
  }
});

test('the English is the English table, word for word', () => {
  const strings = [SME_GUIDE_UI.title, SME_GUIDE_UI.intro, ...SME_GROUPS.flatMap((g) => [g.chip, g.heading, ...g.situations.flatMap((s) => [s.text, s.first.title, s.then.title])])];
  for (const x of strings) assert.equal(x.en, EN_ROWS[x.ko], x.ko);
});

test('English lesson link names are the current English lesson titles', () => {
  for (const { s } of flat) {
    for (const link of [s.first, s.then]) {
      const { c, l } = lessonOf(link.href);
      if (c) assert.equal(link.title.en, c.name(l).en, link.href);
    }
  }
});

test('the English page has no Korean', () => {
  const { root } = mount('en');
  for (const b of root.querySelectorAll('[data-card] button')) b.click();
  assert.ok(!/[가-힣]/.test(root.textContent), root.textContent);
});
