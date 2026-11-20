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

test('seventeen situations in five groups, as confirmed', () => {
  assert.equal(ROWS.length, 17);
  assert.deepEqual(GROUPS.map((g) => [g.id, g.situations.length]), [['member', 5], ['newcomer', 3], ['customer', 3], ['staffing', 3], ['org', 3]]);
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
  assert.equal(GUIDE_UI.title.ko, field('제목'));
  assert.equal(GUIDE_UI.intro.ko, field('안내'));
  assert.deepEqual([GUIDE_UI.all.ko, ...GROUPS.map((g) => g.chip.ko)].join(' / '), field('칩'));
  assert.equal(`${GUIDE_UI.first.ko} / ${GUIDE_UI.then.ko}`, field('링크 묶음 이름'));
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

test('the screen shows six chips and seventeen closed situations', () => {
  const { $, $$ } = mount();
  assert.equal($('h1').textContent, '팀장 상황별 길잡이');
  assert.deepEqual($$('[data-tab]').map((b) => b.getAttribute('data-tab')), ['all', 'member', 'newcomer', 'customer', 'staffing', 'org']);
  assert.equal($('[data-tab="all"]').getAttribute('aria-pressed'), 'true');
  assert.equal($$('[data-card]').length, 17);
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
  assert.deepEqual(links.map((a) => [a.getAttribute('data-go'), a.getAttribute('href')]), [['first', '../sop-library/#escalation-0'], ['then', '../sop-library/#coaching-0']]);
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
