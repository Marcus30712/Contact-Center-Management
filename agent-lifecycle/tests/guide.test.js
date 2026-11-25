import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GROUPS, GUIDE_UI } from '../../guide/data.js';
import { LESSONS } from '../js/lessons/index.js';
import { SOP_LESSONS } from '../../sop-library/lessons/index.js';
import { TERMS } from '../../glossary/terms.js';
import { TEAMS } from '../../codex/data/teams.js';
import { PRINCIPLES } from '../../codex/data/principles.js';
import { DAILY } from '../../codex/data/daily.js';
import { PAGES } from '../../codex/ui.js';

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-19-situation-guide-design.md', import.meta.url), 'utf8');
const field = (key) => DOC.match(new RegExp(`^- ${key}: (.+)$`, 'm'))[1];

// The confirmed table: number | group | situation | first (address) | then (address)
function parseTable() {
  const seen = {};
  const link = (cell) => {
    const m = cell.match(/^(.+?)(?: \(`(.+)`\))?$/);
    const title = m[1].trim();
    let addr = m[2];
    if (addr && addr.startsWith('#')) addr = `${title.startsWith('SOP') ? 'sop-library/' : 'agent-lifecycle/'}${addr}`;
    if (addr) seen[title] = addr;
    return { title, href: `../${addr ?? seen[title]}` };
  };
  const rows = [];
  let heading;
  for (const m of DOC.matchAll(/^\| (\d+) \|(.*?)\| (.+?) \| (.+?) \| (.+?) \|$/gm)) {
    heading = m[2].trim() || heading;
    rows.push({ n: Number(m[1]), heading, text: m[3], first: link(m[4]), then: link(m[5]) });
  }
  return rows;
}
const ROWS = parseTable();
const flat = GROUPS.flatMap((g) => g.situations.map((s) => ({ g, s })));

test('eighteen situations in five groups, as confirmed', () => {
  assert.equal(ROWS.length, 18);
  assert.deepEqual(GROUPS.map((g) => [g.id, g.situations.length]), [['member', 5], ['newcomer', 3], ['customer', 3], ['staffing', 3], ['org', 4]]);
  flat.forEach(({ g, s }, i) => {
    const row = ROWS[i];
    assert.equal(s.id, `s${row.n}`);
    assert.equal(g.heading.ko, row.heading);
    assert.equal(s.text.ko, row.text);
    assert.deepEqual([s.first.title.ko, s.first.href], [row.first.title, row.first.href], s.id);
    assert.deepEqual([s.then.title.ko, s.then.href], [row.then.title, row.then.href], s.id);
  });
});

test('screen wording is the confirmed wording', () => {
  // Renamed with the short role name (2026-11-25, role-home-copy §2).
  assert.deepEqual(GUIDE_UI.title, { ko: 'TL 상황별 길잡이', en: 'TL Situation Guide' });
  assert.equal(GUIDE_UI.intro.ko, field('안내'));
  assert.deepEqual([GUIDE_UI.all.ko, ...GROUPS.map((g) => g.chip.ko)].join(' / '), field('칩'));
  assert.equal(`${GUIDE_UI.first.ko} / ${GUIDE_UI.then.ko}`, field('링크 묶음 이름'));
  assert.equal(GUIDE_UI.shown.ko, field('고른 묶음 알림'));
});

test('every link goes to a place that exists', () => {
  const lessonIds = LESSONS.map((l) => l.id);
  const sopIds = SOP_LESSONS.map((l) => l.id);
  const codex = {
    principles: PRINCIPLES.items.map((x) => x.id), teams: TEAMS.items.map((x) => x.id),
    daily: DAILY.roles.map((x) => x.id), career: [],
  };
  for (const { s } of flat) {
    for (const { href } of [s.first, s.then]) {
      const [, path, hash = ''] = href.match(/^\.\.\/([^#]+)(?:#(.*))?$/);
      if (path === 'agent-lifecycle/') assert.ok(lessonIds.includes(hash.replace(/-0$/, '')), href);
      else if (path === 'sop-library/') assert.ok(hash === 'home' || sopIds.includes(hash.replace(/-0$/, '')), href);
      else if (path === 'codex/') {
        const [page, item] = hash.split('-');
        assert.ok(PAGES.some((p) => p.id === page), href);
        if (item) assert.ok(codex[page].includes(item), href);
      } else if (path === 'glossary/') assert.ok(TERMS.some((x) => x.id === hash), href);
      else assert.equal(path, 'staffing-calculator/', href);
    }
  }
});

test('English is complete, American and free of Korean', () => {
  const strings = [GUIDE_UI, ...GROUPS.flatMap((g) => [g.chip, g.heading, ...g.situations.flatMap((s) => [s.text, s.first.title, s.then.title])])]
    .flatMap((x) => ('ko' in x ? [x] : Object.values(x)));
  for (const x of strings) {
    assert.ok(x.ko?.trim() && x.en?.trim(), x.ko);
    assert.ok(!/[가-힣]/.test(x.en), x.en);
    assert.ok(!/licence|organis|behaviour|centre/.test(x.en), x.en);
  }
  // Link titles reuse each target's own English title.
  const sop = Object.fromEntries(SOP_LESSONS.map((l) => [l.title.ko, l.title.en]));
  const lesson = Object.fromEntries(LESSONS.map((l) => [l.title.ko, l.title.en]));
  for (const { s } of flat) {
    for (const { title } of [s.first, s.then]) {
      const sm = title.ko.match(/^SOP · (.+)$/);
      if (sm) assert.equal(title.en, `SOP · ${sop[sm[1]]}`);
      const lm = title.ko.match(/^라이프사이클 레슨 (\d) · (.+)$/);
      if (lm) assert.equal(title.en, `Lifecycle lesson ${lm[1]} · ${lesson[lm[2]]}`);
    }
  }
});

// ---------- screen ----------
import { setupDom } from './dom.js';
import { renderGuide, newGuideState } from '../../guide/render.js';

function mount(lang = 'ko', state = newGuideState()) {
  const { root } = setupDom();
  renderGuide(root, lang, state);
  return { root, state, $: (s) => root.querySelector(s), $$: (s) => [...root.querySelectorAll(s)] };
}
const isOpen = (card) => card.querySelector('[aria-expanded]').getAttribute('aria-expanded') === 'true';

test('the screen shows six chips and eighteen closed situations', () => {
  const { $, $$ } = mount();
  assert.equal($('h1').textContent, 'TL 상황별 길잡이');
  assert.deepEqual($$('[data-tab]').map((b) => b.getAttribute('data-tab')), ['all', 'member', 'newcomer', 'customer', 'staffing', 'org']);
  assert.equal($('[data-tab="all"]').getAttribute('aria-pressed'), 'true');
  assert.equal($$('[data-card]').length, 18);
  assert.ok($$('[data-card]').every((c) => !isOpen(c)));
  assert.equal($$('[data-group]:not([hidden])').length, 5);
});

test('a chip narrows the list to one group and hides the rest', () => {
  const { $, $$ } = mount();
  $('[data-tab="customer"]').click();
  assert.equal($('[data-tab="customer"]').getAttribute('aria-pressed'), 'true');
  const shown = $$('[data-group]:not([hidden])');
  assert.deepEqual(shown.map((g) => g.getAttribute('data-group')), ['customer']);
  assert.equal(shown[0].querySelectorAll('[data-card]').length, 3);
  assert.equal(document.activeElement, $('[data-tab="customer"]'));
});

test('a situation opens to where to look first and next', () => {
  const { $ } = mount();
  $('[data-card="s9"] button').click();
  const links = [...$('[data-card="s9"]').querySelectorAll('a[data-go]')];
  assert.deepEqual(links.map((a) => [a.getAttribute('data-go'), a.getAttribute('href')]), [['first', '../sop-library/?guide=s9#escalation-0'], ['then', '../sop-library/#coaching-0']]);
  assert.ok(links[0].textContent.includes('먼저 볼 곳') && links[0].textContent.includes('SOP · 고객 불만 에스컬레이션'));
});

test('a language switch keeps the chosen group and the open card', () => {
  const state = newGuideState();
  const ko = mount('ko', state);
  ko.$('[data-tab="staffing"]').click();
  ko.$('[data-card="s13"] button').click();
  const en = mount('en', state);
  assert.equal(en.$('[data-tab="staffing"]').getAttribute('aria-pressed'), 'true');
  assert.ok(isOpen(en.$('[data-card="s13"]')));
  assert.ok(!/[가-힣]/.test(en.root.textContent));
});

test('Miso, thinking, opens the guide', () => {
  for (const [lang, word] of [['ko', '김미소'], ['en', 'Miso Kim']]) {
    const { $ } = mount(lang);
    const img = $('header img[data-miso="think"]');
    assert.equal(img.getAttribute('src'), '../assets/miso/think.webp');
    assert.ok(img.getAttribute('alt').includes(word));
  }
});

test('each link reads its kind and its title as two parts', () => {
  const { $ } = mount();
  $('[data-card="s9"] button').click();
  const link = $('[data-card="s9"]').querySelector('a[data-go="first"]');
  const kind = link.querySelector('.gd-kind').textContent;
  const title = link.querySelector('strong').textContent;
  assert.equal(link.textContent, `${kind}: ${title}`);
  assert.ok(link.querySelector('.visually-hidden'), 'the colon is for screen readers only');
});

test('choosing a chip tells screen readers the group and how many situations it shows', () => {
  const { $ } = mount();
  const status = document.querySelector('[data-status]');
  assert.ok(status, 'one status line exists');
  assert.equal(status.getAttribute('role'), 'status');
  assert.equal(status.textContent, '', 'nothing is read out when the page opens');
  $('[data-tab="customer"]').click();
  assert.equal(document.querySelector('[data-status]'), status, 'the same line is reused');
  assert.equal(status.textContent, '고객·문의: 상황 3개');
  $('[data-tab="all"]').click();
  assert.equal(status.textContent, '전체: 상황 18개');
});

test('the read-out line is cleared when the language changes', () => {
  const state = newGuideState();
  const ko = mount('ko', state);
  ko.$('[data-tab="member"]').click();
  assert.equal(document.querySelector('[data-status]').textContent, '팀원 한 명: 상황 5개');
  renderGuide(ko.root, 'en', state);
  assert.equal(document.querySelector('[data-status]').textContent, '');
  ko.root.querySelector('[data-tab="member"]').click();
  assert.ok(!/[가-힣]/.test(document.querySelector('[data-status]').textContent));
});

// ---------- 2026-11-21: a lesson opened from the guide leads on to "then" ----------
test('the guide\'s "look here first" link carries the situation; "then" does not', async () => {
  const { setupDom } = await import('./dom.js');
  const { renderGuide, newGuideState } = await import('../../guide/render.js');
  const { root } = setupDom();
  renderGuide(root, 'ko', newGuideState());
  const s1 = GROUPS[0].situations[0];
  const first = root.querySelector('a[data-go="first"]');
  assert.equal(first.getAttribute('href'), '../sop-library/?guide=s1#coaching-0');
  assert.equal(root.querySelector('a[data-go="then"]').getAttribute('href'), s1.then.href);
});

test('guideFor finds the situation only on the lesson it pointed to', async () => {
  const { guideFor } = await import('../../guide/link.js');
  assert.equal(guideFor('?guide=s1', 'sop-library', 'coaching').id, 's1');
  assert.equal(guideFor('?guide=s1', 'sop-library', 'pip'), null, 'moved on to another lesson');
  assert.equal(guideFor('?guide=s1', 'agent-lifecycle', 'coaching'), null, 'same id, other course');
  assert.equal(guideFor('', 'sop-library', 'coaching'), null);
  assert.equal(guideFor('?guide=zz', 'sop-library', 'coaching'), null);
  assert.equal(guideFor('?guide=s3', 'agent-lifecycle', 'retention').then.href, '../sop-library/#coaching-0');
});

test('the wording for the lesson end is the approved one', () => {
  assert.equal(GUIDE_UI.fromGuide.ko, field('길잡이에서 온 레슨 안내'));
  assert.equal(GUIDE_UI.thenButton.ko, field('이어서 볼 곳 버튼'));
  assert.ok(GUIDE_UI.fromGuide.en && !/[가-힣]/.test(GUIDE_UI.fromGuide.en + GUIDE_UI.thenButton.en));
});

test('a lesson from the guide ends with "then" first and the usual next lesson second', async () => {
  const { setupDom, click } = await import('./dom.js');
  const { renderLesson } = await import('../js/render/lesson.js');
  const { SOP_LESSONS } = await import('../../sop-library/lessons/index.js');
  const { SOP_UI } = await import('../../sop-library/ui.js');
  const { guideFor } = await import('../../guide/link.js');
  const { root } = setupDom();
  const lesson = SOP_LESSONS.find((l) => l.id === 'coaching');
  renderLesson(root, lesson, 99, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: SOP_LESSONS.length, text: SOP_UI, guide: guideFor('?guide=s1', 'sop-library', 'coaching') });
  click(root.querySelector('[data-next]'));
  for (const q of lesson.checkpoint) click(root.querySelector(`[data-question="${q.id}"] [data-option="${q.answer}"]`));
  const card = root.querySelector('[data-connection]');
  const go = card.querySelector('a[data-guide-then]');
  assert.equal(go.getAttribute('href'), '../agent-lifecycle/#coaching-0');
  assert.equal(go.textContent, '이어서 볼 곳: 라이프사이클 레슨 4 · 성과 관리 및 코칭\u00a0→', 'the arrow stays with the last word');
  assert.ok(go.classList.contains('primary'));
  assert.ok(card.textContent.includes(`${GUIDE_UI.fromGuide.ko} · ${GROUPS[0].situations[0].text.ko}`));
  const next = card.querySelector('a[data-next-lesson]');
  assert.ok(next && !next.classList.contains('primary'), 'the usual next lesson stays, as a second button');
  assert.ok(go.compareDocumentPosition(next) & 4, '"then" comes first');
});

test('a lesson from the guide hides the usual "up next" text; without the guide it stays', async () => {
  const { setupDom, click } = await import('./dom.js');
  const { renderLesson } = await import('../js/render/lesson.js');
  const { SOP_UI } = await import('../../sop-library/ui.js');
  const { guideFor } = await import('../../guide/link.js');
  const lesson = SOP_LESSONS.find((l) => l.id === 'coaching');
  const end = (guide) => {
    const { root } = setupDom();
    renderLesson(root, lesson, 99, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: SOP_LESSONS.length, text: SOP_UI, guide });
    click(root.querySelector('[data-next]'));
    for (const q of lesson.checkpoint) click(root.querySelector(`[data-question="${q.id}"] [data-option="${q.answer}"]`));
    return root.querySelector('[data-connection]').textContent;
  };
  assert.ok(!end(guideFor('?guide=s1', 'sop-library', 'coaching')).includes(lesson.connection.text.ko));
  assert.ok(end(null).includes(lesson.connection.text.ko));
});

test('settleGuide keeps ?guide on its lesson and drops it everywhere else', async () => {
  const { settleGuide } = await import('../../guide/link.js');
  const at = (search, hash) => {
    const calls = [];
    const loc = { pathname: '/kb/sop-library/', search, hash };
    return { loc, calls, hist: { replaceState: (_s, _t, url) => calls.push(url) } };
  };
  let w = at('?guide=s1', '#coaching-6');
  assert.equal(settleGuide(w.loc, w.hist, 'sop-library', 'coaching').id, 's1');
  assert.deepEqual(w.calls, []);
  w = at('?guide=s1', '#pip-0');
  assert.equal(settleGuide(w.loc, w.hist, 'sop-library', 'pip'), null);
  assert.deepEqual(w.calls, ['/kb/sop-library/#pip-0'], 'moved on: the address forgets the guide');
  w = at('?guide=s1', '#home');
  assert.equal(settleGuide(w.loc, w.hist, 'sop-library', undefined), null);
  assert.deepEqual(w.calls, ['/kb/sop-library/#home'], 'the list too');
  w = at('', '#pip-0');
  settleGuide(w.loc, w.hist, 'sop-library', 'pip');
  assert.deepEqual(w.calls, [], 'nothing to drop');
  w = at('?guide=s1', '#pip-0');
  assert.equal(settleGuide(w.loc, { replaceState() { throw new Error('blocked'); } }, 'sop-library', 'pip'), null, 'a blocked history is not an error');
});

test('both lesson apps settle the guide on every draw', () => {
  for (const f of ['sop-library/app.js', 'agent-lifecycle/js/app.js']) {
    const src = readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8');
    assert.ok(/settleGuide\(location, history,/.test(src), f);
    assert.ok(!/guideFor\(location/.test(src), f);
  }
});

// ---------- 2026-11-22: s18, a new team leader among former colleagues ----------
test('s18 leads to the colleague-to-team-leader SOP, then the team leader\'s day', () => {
  const s18 = flat.find(({ s }) => s.id === 's18');
  assert.ok(s18, 's18 exists');
  assert.equal(s18.g.id, 'org');
  assert.equal(s18.s.first.href, '../sop-library/#transition-0');
  assert.equal(s18.s.then.href, '../codex/#daily-tl');
  const en = readFileSync(new URL('../../docs/superpowers/specs/2026-11-22-team-leader-self-copy.en.md', import.meta.url), 'utf8');
  assert.equal(s18.s.text.en, en.split('\n').find((l) => l.startsWith('| s18 |')).split(' | ')[1].replace(/\s*\|$/, ''));
  assert.ok(!/[가-힣]/.test(s18.s.text.en + s18.s.first.title.en + s18.s.then.title.en));
});

test('s18 link titles are the ones in the approved copy docs', () => {
  const s18 = flat.find(({ s }) => s.id === 's18').s;
  const cell = (f, key) => readFileSync(new URL(`../../docs/superpowers/specs/${f}`, import.meta.url), 'utf8')
    .split('\n').find((l) => l.startsWith(`| ${key} |`)).split(' | ')[1].replace(/\s*\|$/, '');
  assert.equal(s18.first.title.ko, cell('2026-11-22-team-leader-self-copy.md', '먼저 볼 곳'));
  assert.equal(s18.then.title.ko, cell('2026-11-22-team-leader-self-copy.md', '이어서 볼 곳'));
  assert.equal(s18.first.title.en, cell('2026-11-22-team-leader-self-copy.en.md', 'Look here first'));
  assert.equal(s18.then.title.en, cell('2026-11-22-team-leader-self-copy.en.md', 'Then go here'));
});
