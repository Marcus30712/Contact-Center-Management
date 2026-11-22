import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PRINCIPLES } from '../../codex/data/principles.js';
import { TEAMS } from '../../codex/data/teams.js';
import { CAREER } from '../../codex/data/career.js';
import { DAILY } from '../../codex/data/daily.js';
import { LINKS } from '../../codex/data/links.js';
import { CODEX_UI, PAGES } from '../../codex/ui.js';
import { TERMS } from '../../glossary/terms.js';

// ---------- the confirmed Korean copy ----------
const COPY = readFileSync(new URL('../../docs/superpowers/specs/2026-11-19-codex-one-pagers-copy-ko.md', import.meta.url), 'utf8');
const clean = (s) => s.replaceAll('🟦 ', '').trim();
const section = (marker) => COPY.split(/^## /m).find((x) => x.startsWith(marker));
const field = (text, key) => {
  const m = text.match(new RegExp(`^- (?:🟦 )?${key}: (.+)$`, 'm'));
  return m ? clean(m[1]) : undefined;
};
const fields = (text, key) => [...text.matchAll(new RegExp(`^- ${key}: (.+)$`, 'gm'))].map((m) => clean(m[1]));
const blocks = (text, level) => text.split(new RegExp(`^${level} `, 'm')).slice(1);

// The Korean side of any {ko, en} tree, keeping the shape.
const KEEP = new Set(['id', 'yours', 'you', 'team', 'level', 'defaultRole', 'n', 'task', 'from', 'to', 'dir', 'href']);
function ko(v, key) {
  if (Array.isArray(v)) return v.map((x) => ko(x));
  if (v && typeof v === 'object') {
    if ('ko' in v && 'en' in v) return v.ko;
    return Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'glossary').map(([k, x]) => [k, KEEP.has(k) ? x : ko(x, k)]));
  }
  return v;
}

const TEAM_IDS = ['ta', 'td', 'operation', 'wfm', 'hr'];
const LEVEL_IDS = {
  operation: ['agent', 'sme', 'tl', 'am', 'om'], td: ['trainer', 'senior', 'manager'],
  wfm: ['rta', 'scheduler', 'manager'], ta: ['coordinator', 'recruiter', 'manager'], hr: ['admin', 'generalist', 'manager'],
};
const CAREER_TEAMS = ['operation', 'td', 'wfm', 'ta', 'hr'];
const ROLE_IDS = ['agent', 'sme', 'tl', 'am', 'om'];
const PAGE_IDS = ['principles', 'teams', 'career', 'daily'];
const LINK_TARGETS = {
  '① 운영 최적화 4대 원칙': '#principles', '② 5대 핵심팀 청사진': '#teams', '③ 커리어 매트릭스': '#career',
  '④ 직무별 일일 업무 가이드': '#daily', 'SOP 라이브러리': '../sop-library/#home',
  'SOP 라이브러리 · 1:1 코칭': '../sop-library/#coaching-0', '인력 산정 실험실': '../staffing-calculator/',
  '라이프사이클 레슨 6 · 경력 개발 및 전환·퇴사': '../agent-lifecycle/#career-0',
};

function parsePrinciples() {
  const s = section('① 운영');
  return {
    intro: field(s, '소개'),
    note: field(s, '안내'),
    items: blocks(s, '###').map((b, i) => ({
      id: `p${i + 1}`, title: b.split('\n')[0].replace(/^\d+\. /, '').trim(),
      problem: field(b, '문제점'), fix: field(b, '최적화'), example: field(b, '실제 사례'),
    })),
  };
}
function parseTeams() {
  const s = section('② 5대');
  return {
    intro: field(s, '소개'),
    yours: 'operation',
    items: blocks(s, '###').map((b, i) => ({
      id: TEAM_IDS[i], name: b.split('\n')[0].trim(), mission: field(b, '핵심 미션'),
      roles: field(b, '역할 및 책임').split(/, (?![^(]*\))/),
      kpis: fields(b, 'KPI').map((line) => { const [name, def, why] = line.split(' | '); return { name, def, why }; }),
      flow: field(b, '업무 흐름').split(' → '),
    })),
  };
}
function parseCareer() {
  const s = section('③ 커리어');
  return {
    definition: field(s, '정의'),
    uses: ['학습 단계', '실행 단계', '성장 단계'].map((label) => ({ label, text: field(s, label) })),
    note: field(s, '안내'),
    you: { team: 'operation', level: 'tl' },
    teams: blocks(s, '###').map((b, i) => {
      const id = CAREER_TEAMS[i];
      return {
        id, name: b.split('\n')[0].trim(),
        levels: blocks(b, '####').map((l, j) => {
          const [work, soft] = field(l, '주요 역량').split(' / ');
          const level = {
            id: LEVEL_IDS[id][j], name: l.split('\n')[0].trim(), role: field(l, '핵심 역할'),
            skills: soft ? { work, soft } : { work },
          };
          const next = field(l, '다음 단계로');
          if (next) level.next = next;
          return level;
        }),
      };
    }),
  };
}
function parseDaily() {
  const s = section('④ 직무별');
  return {
    intro: field(s, '소개'),
    notes: fields(s, '안내'),
    defaultRole: 'tl',
    roles: blocks(s, '###').map((b, i) => ({
      id: ROLE_IDS[i], name: b.split('\n')[0].trim(),
      tasks: fields(b, '업무').map((line) => {
        const m = line.match(/^(\d) \[(.+?)\] (.+)$/);
        const [name, freq, share, outputs] = m[3].split(' | ');
        return { n: Number(m[1]), tag: m[2], name, freq, share, outputs };
      }),
      schedule: fields(b, '일정').map((line) => {
        const [time, task, text] = line.split(' | ');
        const [from, to] = time.split('–');
        return { from, to, task: task === '점심' ? 'lunch' : task === '그 밖' ? 'other' : Number(task), text };
      }),
    })),
  };
}
function parseLinks() {
  const s = section('앞/뒤 링크');
  const out = Object.fromEntries(PAGE_IDS.map((p) => [p, []]));
  for (const m of s.matchAll(/^- ([①②③④]) \| (앞|다음) \| (.+?) \| (.+)$/gm)) {
    out[PAGE_IDS['①②③④'.indexOf(m[1])]].push({ dir: m[2] === '앞' ? 'before' : 'after', href: LINK_TARGETS[m[3]], title: m[3], why: m[4] });
  }
  return out;
}

// ---------- tests ----------
test('the data has the agreed shape', () => {
  assert.equal(PRINCIPLES.items.length, 4);
  assert.deepEqual(TEAMS.items.map((t) => t.id), TEAM_IDS);
  assert.deepEqual(CAREER.teams.map((t) => [t.id, t.levels.length]), [['operation', 5], ['td', 3], ['wfm', 3], ['ta', 3], ['hr', 3]]);
  assert.deepEqual(DAILY.roles.map((r) => [r.id, r.tasks.length]), ROLE_IDS.map((id) => [id, 4]));
  assert.ok(TEAMS.items.some((t) => t.id === TEAMS.yours));
  assert.ok(CAREER.teams.find((t) => t.id === CAREER.you.team).levels.some((l) => l.id === CAREER.you.level));
  assert.ok(DAILY.roles.some((r) => r.id === DAILY.defaultRole));
  assert.ok(CAREER.teams.every((t) => t.levels.at(-1).next === undefined && t.levels.slice(0, -1).every((l) => l.next)));
});

test('the Korean is the confirmed copy, word for word', () => {
  assert.deepEqual(ko(PRINCIPLES), parsePrinciples());
  assert.deepEqual(ko(TEAMS), parseTeams());
  assert.deepEqual(ko(CAREER), parseCareer());
  assert.deepEqual(ko(DAILY), parseDaily());
  assert.deepEqual(ko(LINKS), parseLinks());
});

test('screen wording matches the confirmed copy', () => {
  const s = section('화면 문구');
  assert.equal(CODEX_UI.title.ko, field(s, '제목'));
  assert.equal(CODEX_UI.tagline.ko, field(s, '부제'));
  assert.equal(CODEX_UI.source.ko, field(s, '출처'));
  assert.equal(CODEX_UI.home.ko, field(s, '목록으로'));
  assert.equal(`${CODEX_UI.expandAll.ko} / ${CODEX_UI.collapseAll.ko}`, s.match(/^- (모두 펼치기 \/ 모두 접기)$/m)[1]);
  assert.equal(`${CODEX_UI.yourTeam.ko} / ${CODEX_UI.youAreHere.ko}`, s.match(/^- (당신의 팀 \/ 지금 당신)$/m)[1]);
  assert.equal(CODEX_UI.glossaryLink.ko, '용어집에서 보기');
  const rows = [...s.matchAll(/^\| [①②③④] \| (.+?) \| (.+?) \|$/gm)].map((m) => [m[1], m[2]]);
  assert.deepEqual(PAGES.map((p) => [p.title.ko, p.blurb.ko]), rows);
  assert.deepEqual(PAGES.map((p) => p.id), PAGE_IDS);
});

test('every day runs from nine to six without gaps', () => {
  const minutes = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  for (const r of DAILY.roles) {
    assert.equal(r.schedule[0].from, '09:00', r.id);
    assert.equal(r.schedule.at(-1).to, '18:00', r.id);
    r.schedule.slice(1).forEach((b, i) => assert.equal(b.from, r.schedule[i].to, `${r.id} ${b.from}`));
    assert.ok(r.schedule.every((b) => minutes(b.to) > minutes(b.from)), r.id);
    assert.equal(r.schedule.filter((b) => b.task === 'lunch').length, 1, r.id);
    for (const b of r.schedule) assert.ok(b.task === 'lunch' || b.task === 'other' || r.tasks.some((t) => t.n === b.task), `${r.id} ${b.from}`);
    assert.equal(r.tasks.reduce((sum, t) => sum + Number(t.share.ko.match(/\d+/)[0]), 0), 100, r.id);
  }
});

const leaves = (v, path = '') => {
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${path}[${i}]`));
  if (v && typeof v === 'object') {
    if ('ko' in v && 'en' in v) return [[path, v]];
    return Object.entries(v).flatMap(([k, x]) => leaves(x, path ? `${path}.${k}` : k));
  }
  return [];
};
const ALL = { PRINCIPLES, TEAMS, CAREER, DAILY, LINKS, CODEX_UI, PAGES };

test('every string follows the content rules in both languages', () => {
  const FIGURE = /\d\s*(%|분|명|초|점|min|people|sec|points?)/;
  const EXEMPT = /\.(share|next|freq|from|to)$|schedule\[\d+\]\.text$|\.notes\[\d+\]$|\.note$/;
  const sentences = (s) => (s.match(/[.?!](?=["'”’)]*(\s|$))/g) || []).length;
  for (const [name, data] of Object.entries(ALL)) {
    for (const [path, v] of leaves(data)) {
      const where = `${name}.${path}`;
      assert.ok(v.ko?.trim() && v.en?.trim(), where);
      assert.ok(!/[가-힣]/.test(v.en), `${where} English has Korean`);
      for (const lang of ['ko', 'en']) {
        assert.ok(!v[lang].includes('진상'), where);
        assert.ok(sentences(v[lang]) <= 3, `${where}.${lang} is too long`);
        if (!EXEMPT.test(where) && FIGURE.test(v[lang])) assert.ok(/예시|[Ee]xample/.test(v[lang]), `${where}.${lang} unlabelled figure`);
      }
      assert.ok(!v.ko.includes('노동법'), where);
      assert.ok(!/licence|organis|behaviour|centre/.test(v.en), where);
    }
  }
});

test('the confirmed Shrinkage definition is used', () => {
  const wfm = TEAMS.items.find((t) => t.id === 'wfm');
  assert.equal(wfm.kpis.find((k) => k.name === 'Shrinkage').def.ko, '결근뿐 아니라 휴식, 교육, 회의처럼 콜을 받을 수 없는 모든 시간의 비율.');
});

test('links point at real glossary terms and real pages', () => {
  const ids = TERMS.map((x) => x.id);
  const glossary = TEAMS.items.flatMap((t) => t.kpis.filter((k) => k.glossary).map((k) => [k.name, k.glossary]));
  assert.deepEqual(Object.fromEntries(glossary), {
    'CSAT (Customer Satisfaction)': 'csat', 'Quality Score (QS)': 'quality-score', 'AHT (Average Handle Time)': 'aht',
    'SLA (Service Level Agreement)': 'sla', 'Forecast Accuracy': 'forecast-accuracy', 'Schedule Adherence': 'schedule-adherence',
    Shrinkage: 'shrinkage', Occupancy: 'occupancy', 'Attrition Rate': 'attrition',
  });
  for (const [, id] of glossary) assert.ok(ids.includes(id), id);
  const allowed = new Set(Object.values(LINK_TARGETS));
  for (const page of PAGE_IDS) for (const l of LINKS[page]) assert.ok(allowed.has(l.href), l.href);
});

// ---------- shared parts ----------
import { setupDom } from './dom.js';
import { tabs, expandCard, chip, flow, relatedLinks } from '../../codex/render/parts.js';

const trKo = (x) => x.ko;

test('tabs move with the arrow keys and report the pressed one', () => {
  const { root } = setupDom();
  const picked = [];
  const el = tabs([{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }], 'a', (id) => picked.push(id), 'Pick');
  root.append(el);
  assert.equal(el.getAttribute('role'), 'group');
  assert.equal(el.getAttribute('aria-label'), 'Pick');
  const btn = (id) => el.querySelector(`[data-tab="${id}"]`);
  assert.equal(btn('a').getAttribute('aria-pressed'), 'true');
  assert.equal(btn('b').getAttribute('aria-pressed'), 'false');
  const key = (target, k) => target.dispatchEvent(new window.KeyboardEvent('keydown', { key: k, bubbles: true }));
  key(btn('a'), 'ArrowRight');
  key(btn('a'), 'ArrowLeft');
  key(btn('a'), 'End');
  key(btn('c'), 'Home');
  btn('b').click();
  assert.deepEqual(picked, ['b', 'c', 'c', 'a', 'b']);
});

test('an expandable card opens and closes its body', () => {
  const { root } = setupDom();
  const toggled = [];
  const card = expandCard({ id: 'x', chip: chip('핵심', 'core'), number: 1, title: '제목', summary: '요약', body: [document.createElement('p')], open: false, onToggle: (open) => toggled.push(open) });
  root.append(card);
  const head = card.querySelector('button[aria-expanded]');
  const body = card.querySelector('[data-body]');
  assert.equal(head.getAttribute('aria-controls'), body.id);
  assert.equal(body.hidden, true);
  head.click();
  assert.equal(head.getAttribute('aria-expanded'), 'true');
  assert.equal(body.hidden, false);
  head.click();
  assert.equal(body.hidden, true);
  assert.deepEqual(toggled, [true, false]);
  assert.equal(card.querySelector('[data-kind="core"]').textContent, '핵심');
});

test('a flow numbers its steps', () => {
  const el = flow(['a', 'b', 'c']);
  assert.equal(el.tagName, 'OL');
  assert.deepEqual([...el.querySelectorAll('li')].map((li) => li.textContent), ['a', 'b', 'c']);
});

test('related links show before and after, skipping an empty group', () => {
  const ui = { before: { ko: '앞' }, after: { ko: '다음' } };
  const el = relatedLinks([{ dir: 'after', href: '#teams', title: { ko: '팀' }, why: { ko: '이유' } }], trKo, ui);
  assert.equal(el.querySelectorAll('[data-related-group]').length, 1);
  assert.equal(el.querySelector('[data-related-group]').getAttribute('data-related-group'), 'after');
  const a = el.querySelector('a');
  assert.equal(a.getAttribute('href'), '#teams');
  assert.ok(a.textContent.includes('팀') && el.textContent.includes('이유'));
});

// ---------- screens ----------
import { renderCodexHome } from '../../codex/render/home.js';
import { renderPage, parseCodexRoute, newState, openItem } from '../../codex/render/page.js';

function mountPage(id, lang = 'ko', state = newState()) {
  const { root } = setupDom();
  renderPage(root, id, lang, state);
  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => [...root.querySelectorAll(sel)];
  return { root, state, $, $$ };
}
const isOpen = (card) => card.querySelector('[aria-expanded]').getAttribute('aria-expanded') === 'true';

test('the list shows the four one-pagers in order and credits the Codex', () => {
  const { root } = setupDom();
  renderCodexHome(root, 'ko');
  const cards = [...root.querySelectorAll('a[data-page]')];
  assert.deepEqual(cards.map((a) => a.getAttribute('href')), PAGE_IDS.map((p) => `#${p}`));
  cards.forEach((a, i) => assert.ok(a.textContent.includes(PAGES[i].title.ko) && a.textContent.includes(PAGES[i].blurb.ko)));
  assert.ok(root.querySelector('[data-source]').textContent.includes('Marcus Shim'));
  assert.equal(root.querySelector('h1').textContent, 'Codex 원페이저');
});

test('every page has the page links, the list link and its before/after links', () => {
  for (const id of PAGE_IDS) {
    const { $, $$ } = mountPage(id);
    assert.equal($$('nav[data-pages] a').length, 4, id);
    assert.equal($('nav[data-pages] a[aria-current="page"]').getAttribute('href'), `#${id}`);
    assert.equal($('a[data-home]').getAttribute('href'), '#home');
    assert.equal($$('a[data-related]').length, LINKS[id].length, id);
    assert.equal($('h1').textContent, PAGES.find((p) => p.id === id).title.ko);
  }
});

test('principles open one by one or all at once', () => {
  const { $, $$ } = mountPage('principles');
  const cards = () => $$('[data-card]');
  assert.equal(cards().length, 4);
  assert.ok(cards().every((c) => !isOpen(c)));
  cards()[1].querySelector('button').click();
  assert.ok(isOpen(cards()[1]));
  assert.ok(cards()[1].textContent.includes(PRINCIPLES.items[1].fix.ko));
  $('[data-expand-all]').click();
  assert.ok(cards().every(isOpen));
  $('[data-collapse-all]').click();
  assert.ok(cards().every((c) => !isOpen(c)));
});

test('one team is open at a time, with KPIs, glossary links and the workflow', () => {
  const { $, $$ } = mountPage('teams');
  assert.equal($$('[data-card]').length, 5);
  assert.ok($('[data-card="operation"]').textContent.includes('당신의 팀'));
  $('[data-card="ta"] button').click();
  $('[data-card="wfm"] button').click();
  assert.deepEqual($$('[data-card]').filter(isOpen).map((c) => c.getAttribute('data-card')), ['wfm']);
  const wfm = $('[data-card="wfm"]');
  assert.equal(wfm.querySelectorAll('[data-kpi]').length, 4);
  assert.equal(wfm.querySelector('[data-kpi="Shrinkage"] a[data-glossary]').getAttribute('href'), '../glossary/#shrinkage');
  assert.equal(wfm.querySelectorAll('.cx-flow li').length, 5);
  assert.equal(document.activeElement, wfm.querySelector('button'));
});

test('the career ladder starts on the reader and shows next-step conditions', () => {
  const { $, $$ } = mountPage('career');
  assert.equal($('[data-tab="operation"]').getAttribute('aria-pressed'), 'true');
  assert.deepEqual($$('[data-level]').map((b) => b.getAttribute('data-level')), ['om', 'am', 'tl', 'sme', 'agent']);
  assert.ok($('[data-level="tl"]').textContent.includes('지금 당신'));
  assert.equal($('[data-level="tl"]').getAttribute('aria-pressed'), 'true');
  assert.ok($('[data-level-detail]').textContent.includes(CAREER.teams[0].levels[2].next.ko));
  $('[data-level="om"]').click();
  assert.equal($('[data-level-detail] [data-next]'), null);
  assert.ok($('[data-level-detail]').textContent.includes('이 팀의 가장 높은 직급입니다.'));
  $('[data-tab="hr"]').click();
  assert.equal($$('[data-level]').length, 3);
  assert.equal($('[data-level="admin"]').getAttribute('aria-pressed'), 'true');
  assert.ok($('[data-level-detail]').textContent.includes('노동 관련 법·제도 이해'));
});

test('the day bar and the task list point at the same work', () => {
  const { $, $$ } = mountPage('daily');
  assert.equal($('[data-tab="tl"]').getAttribute('aria-pressed'), 'true');
  const blocks = $$('[data-block]');
  assert.equal(blocks.length, 8);
  assert.equal(blocks.reduce((sum, b) => sum + parseFloat(b.parentElement.style.flexGrow), 0), 540);
  assert.ok(blocks.find((b) => b.getAttribute('data-task') === 'lunch').classList.contains('is-lunch'));
  assert.equal($$('[data-notes] p').length, 2);
  const coaching = blocks.find((b) => b.getAttribute('aria-label').startsWith('10:30–12:30'));
  assert.equal(coaching.getAttribute('aria-label'), '10:30–12:30, 팀원 1:1 코칭 세션 (예시: 2~3명)');
  coaching.click();
  assert.equal($('[data-task-item="1"]').getAttribute('aria-pressed'), 'true');
  assert.ok($('[data-task-detail]').textContent.includes('팀원별 1:1 코칭 로그'));
  assert.deepEqual($$('[data-block].is-selected').map((b) => b.getAttribute('data-task')), ['1', '1']);
  $('[data-tab="am"]').click();
  const other = $$('[data-block]').at(-1);
  assert.equal(other.getAttribute('data-task'), 'other');
  other.click();
  assert.equal($$('[data-task-item][aria-pressed="true"]').length, 0);
  assert.ok($('[data-task-detail]').textContent.includes('그 밖의 업무'));
  $('[data-task-item="2"]').click();
  assert.ok($('[data-task-detail]').textContent.includes('프로젝트 KPI 분석'));
});

test('a language switch keeps what was open', () => {
  const state = newState();
  const first = mountPage('teams', 'ko', state);
  first.$('[data-card="hr"] button').click();
  const again = mountPage('teams', 'en', state);
  assert.ok(isOpen(again.$('[data-card="hr"]')));
});

test('every page in English has no Korean left', () => {
  for (const id of PAGE_IDS) {
    const { root } = mountPage(id, 'en');
    root.querySelectorAll('[data-card] button, [data-level], [data-task-item]').forEach((b) => b.click());
    assert.ok(!/[가-힣]/.test(root.textContent), id);
  }
  const { root } = setupDom();
  renderCodexHome(root, 'en');
  assert.ok(!/[가-힣]/.test(root.textContent));
});

test('unknown addresses open the list', () => {
  assert.deepEqual(parseCodexRoute('#nope'), { view: 'home' });
  assert.deepEqual(parseCodexRoute('#teams-3'), { view: 'home' });
  assert.deepEqual(parseCodexRoute(''), { view: 'home' });
  assert.deepEqual(parseCodexRoute('#career'), { view: 'career' });
});

// ---------- review findings ----------
test('choices are announced once through a status line that outlives redraws', () => {
  const { root, $, $$ } = mountPage('daily');
  assert.equal(root.querySelectorAll('[aria-live]').length, 0);
  $('[data-block="2"]').click();
  const status = document.getElementById('cx-status');
  assert.equal(status.getAttribute('role'), 'status');
  assert.ok(!root.contains(status));
  assert.equal(status.textContent, '1. 1:1 코칭 세션 및 현장 관리 · 빈도: 주간 (1:1) / 일간 (현장 관리) · 시간 비중: 약 40%');
  const career = mountPage('career');
  career.$('[data-level="am"]').click();
  assert.equal(document.getElementById('cx-status').textContent, 'Assistant Manager (부매니저) · 프로젝트 안정적 운영 책임, 중간 관리자');
  assert.equal($$('[aria-live]').length, 0);
});

test('on the daily page the details sit right under the bar, with a readable list of times', () => {
  const { $, $$ } = mountPage('daily');
  const detail = $('[data-task-detail]');
  const tasks = $('.cx-tasks');
  assert.ok(detail.compareDocumentPosition(tasks) & window.Node.DOCUMENT_POSITION_FOLLOWING);
  const slots = $$('[data-slot]');
  assert.equal(slots.length, 8);
  assert.equal(slots[0].textContent, '09:00–09:30 팀 허들 주관');
  slots[2].click();
  assert.equal($('[data-task-item="1"]').getAttribute('aria-pressed'), 'true');
  assert.equal($('[data-slot="2"]').getAttribute('aria-pressed'), 'true');
});

test('the English next-step conditions read as things already done', () => {
  const nexts = CAREER.teams.flatMap((team) => team.levels.filter((l) => l.next).map((l) => l.next.en));
  assert.ok(nexts.every((x) => !/^(Meet|Own|Manage|Lead) /.test(x)), nexts.join(' | '));
  assert.ok(!JSON.stringify(TEAMS).includes('final offer'));
});

// ---------- deep links from the situation guide ----------
test('an address can open one item on a one-pager', () => {
  assert.deepEqual(parseCodexRoute('#teams-ta'), { view: 'teams', item: 'ta' });
  assert.deepEqual(parseCodexRoute('#principles-p3'), { view: 'principles', item: 'p3' });
  assert.deepEqual(parseCodexRoute('#daily-tl'), { view: 'daily', item: 'tl' });
  for (const bad of ['#teams-3', '#teams-nope', '#career-tl', '#principles-p9', '#daily-x']) assert.deepEqual(parseCodexRoute(bad), { view: 'home' }, bad);
  assert.deepEqual(parseCodexRoute('#teams'), { view: 'teams' });
});

test('opening a page with an item shows that item open', () => {
  const teams = mountPage('teams', 'ko', openItem(newState(), 'teams', 'ta'));
  assert.ok(isOpen(teams.$('[data-card="ta"]')));
  const principles = mountPage('principles', 'ko', openItem(newState(), 'principles', 'p3'));
  assert.deepEqual(principles.$$('[data-card]').filter(isOpen).map((c) => c.getAttribute('data-card')), ['p3']);
  const daily = mountPage('daily', 'ko', openItem(newState(), 'daily', 'am'));
  assert.equal(daily.$('[data-tab="am"]').getAttribute('aria-pressed'), 'true');
});

test('each task share is a fill inside one fixed-width track, N% of it, with its label', () => {
  const { $$ } = mountPage('daily');
  const items = $$('.cx-task');
  assert.ok(items.length > 0);
  for (const t of items) {
    const label = t.querySelector('.cx-share-label').textContent;
    const fill = t.querySelector('.cx-share-track > .cx-share-fill');
    assert.ok(fill, 'the fill sits inside a track');
    assert.equal(fill.getAttribute('style'), `width: ${label.match(/\d+/)[0]}%`);
  }
  const css = readFileSync(new URL('../../codex/codex.css', import.meta.url), 'utf8');
  assert.match(css, /\.cx-share-track \{[^}]*width: \d+(\.\d+)?rem/, 'the track has one fixed width for every task');
  assert.ok(!/\.cx-share-bar|max-width: 60%/.test(css), 'the old relative bar is gone');
});

// ---------- 2026-11-22: "내 한 주 돌아보기" under the team leader's daily tasks (not Codex content) ----------
const WEEK_DOC = (f) => readFileSync(new URL(`../../docs/superpowers/specs/${f}`, import.meta.url), 'utf8')
  .split('## ②')[1].split('## ③')[0];
const weekCell = (md, key) => md.split('\n').find((l) => l.startsWith(`| ${key} |`)).split(' | ')[1].replace(/\s*\|$/, '').trim();

test('the week check matches the approved copy', async () => {
  const { WEEK_CHECK } = await import('../../codex/data/week-check.js');
  const ko = WEEK_DOC('2026-11-22-team-leader-self-copy.md');
  const en = WEEK_DOC('2026-11-22-team-leader-self-copy.en.md');
  assert.deepEqual(WEEK_CHECK.title, { ko: weekCell(ko, '제목'), en: weekCell(en, 'Title') });
  assert.deepEqual(WEEK_CHECK.note, { ko: weekCell(ko, '안내'), en: weekCell(en, 'Note') });
  assert.deepEqual(WEEK_CHECK.source, { ko: weekCell(ko, '출처 표시'), en: weekCell(en, 'Source note') });
  assert.deepEqual(WEEK_CHECK.items, [1, 2, 3, 4, 5].map((n) => ({ ko: weekCell(ko, String(n)), en: weekCell(en, String(n)) })));
});

test('only the team-leader view shows the week check', () => {
  const tl = mountPage('daily', 'ko', openItem(newState(), 'daily', 'tl'));
  assert.ok(tl.$('[data-week-check]'));
  assert.equal(tl.$$('[data-week-check] input[type="checkbox"][data-week-item]').length, 5);
  assert.ok(tl.$('[data-week-source]').textContent.includes('Codex'));
  const agent = mountPage('daily', 'ko', openItem(newState(), 'daily', 'agent'));
  assert.equal(agent.$('[data-week-check]'), null);
});

test('ticks are kept on the page and never stored', () => {
  const writes = [];
  const had = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const spy = { getItem: () => null, setItem: (k) => writes.push(k), removeItem: (k) => writes.push(k) };
  Object.defineProperty(globalThis, 'localStorage', { value: spy, configurable: true });
  const t = mountPage('daily', 'ko', openItem(newState(), 'daily', 'tl'));
  const realSet = spy.setItem;
  const box = t.$('[data-week-item="2"]');
  box.checked = true;
  box.dispatchEvent(new t.root.ownerDocument.defaultView.Event('change', { bubbles: true }));
  t.$('[data-tab="agent"]').click();
  t.$('[data-tab="tl"]').click();
  assert.equal(t.$('[data-week-item="2"]').checked, true, 'still ticked after switching roles');
  assert.equal(t.$('[data-week-item="1"]').checked, false);
  assert.deepEqual(writes, [], 'nothing written to storage');
  assert.equal(realSet, globalThis.localStorage.setItem);
  if (had) Object.defineProperty(globalThis, 'localStorage', had); else delete globalThis.localStorage;
  const fresh = mountPage('daily', 'ko', openItem(newState(), 'daily', 'tl'));
  assert.equal(fresh.$('[data-week-item="2"]').checked, false, 'a new page starts empty');
});

test('the English week check has no Korean', () => {
  const { $ } = mountPage('daily', 'en', openItem(newState(), 'daily', 'tl'));
  assert.ok(!/[가-힣]/.test($('[data-week-check]').textContent));
});
