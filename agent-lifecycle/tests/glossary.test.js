import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, validateTerms } from '../../glossary/schema.js';
import { filterTerms, findTerm } from '../../glossary/filter.js';

export function fixtureTerms() {
  return [
    { id: 'aht', category: 'metric', term: 'AHT',
      name: { ko: '평균 처리 시간', en: 'Average Handle Time' },
      definition: { ko: '문의 한 건을 처리하는 데 걸리는 평균 시간입니다.', en: 'The average time it takes to handle one contact.' },
      seen: ['coaching'] },
    { id: 'sme', category: 'role', term: 'SME',
      name: { ko: '분야 전문가', en: 'Subject Matter Expert' },
      definition: { ko: '어려운 문의를 지원하는 팀의 지식 허브입니다.', en: 'The knowledge hub of the team who supports difficult inquiries.' },
      seen: [] },
    { id: 'call-recording', category: 'tool', term: 'Call Recording',
      name: { ko: '녹취', en: 'Call Recording' },
      definition: { ko: '전화 상담을 녹음한 기록입니다.', en: 'The audio record of a phone contact.' },
      seen: [] },
  ];
}
const has = (errors, part) => errors.some((e) => e.includes(part));
const opts = { requireEnglish: true, lessonIds: ['coaching'] };
const broken = (mutate) => { const t = fixtureTerms(); mutate(t); return validateTerms(t, opts); };

test('categories are the four agreed groups', () => {
  assert.deepEqual(CATEGORIES, ['metric', 'role', 'process', 'tool']);
});

test('valid terms have no errors', () => {
  assert.deepEqual(validateTerms(fixtureTerms(), opts), []);
});

test('term ids must be unique, lowercase and not reserved', () => {
  assert.ok(has(broken((t) => { t[1].id = 'aht'; }), 'duplicate'));
  assert.ok(has(broken((t) => { t[0].id = 'AHT'; }), 'AHT'));
  assert.ok(has(broken((t) => { t[0].id = 'home'; }), 'home'));
});

test('category, names and definitions are required', () => {
  assert.ok(has(broken((t) => { t[0].category = 'x'; }), 'category'));
  assert.ok(has(broken((t) => { delete t[0].name.ko; }), 'name.ko'));
  assert.ok(has(broken((t) => { delete t[0].definition.en; }), 'definition.en'));
  const koOnly = fixtureTerms();
  delete koOnly[0].definition.en;
  assert.deepEqual(validateTerms(koOnly, { lessonIds: ['coaching'] }), []);
});

test('definitions stay short, without figures or the banned word', () => {
  assert.ok(has(broken((t) => { t[0].definition.ko = '하나입니다. 둘입니다. 셋입니다. 넷입니다.'; }), 'sentences'));
  assert.ok(has(broken((t) => { t[0].definition.ko = '보통 30% 정도입니다.'; }), 'figure'));
  assert.ok(has(broken((t) => { t[0].definition.en = 'Usually about 5 min.'; }), 'figure'));
  assert.ok(has(broken((t) => { t[0].definition.ko = '진상 고객을 응대한 시간입니다.'; }), '진상'));
});

test('seen must name real lessons', () => {
  assert.ok(has(broken((t) => { t[0].seen = ['nope']; }), 'nope'));
});

test('filterTerms matches term, both names and the current-language definition', () => {
  const t = fixtureTerms();
  const ids = (q, extra = {}) => filterTerms(t, { query: q, ...extra }).map((x) => x.id);
  assert.deepEqual(ids('aht'), ['aht']);
  assert.deepEqual(ids('  AHT  '), ['aht']);
  assert.deepEqual(ids('평균'), ['aht']);
  assert.deepEqual(ids('recording'), ['call-recording']);
  assert.deepEqual(ids('knowledge hub', { lang: 'en' }), ['sme']);
  assert.deepEqual(ids('knowledge hub', { lang: 'ko' }), []);
  assert.deepEqual(ids(''), ['aht', 'sme', 'call-recording']);
});

test('filterTerms filters by category and keeps order', () => {
  const t = fixtureTerms();
  assert.deepEqual(filterTerms(t, { category: 'role' }).map((x) => x.id), ['sme']);
  assert.deepEqual(filterTerms(t, { category: 'all' }).length, 3);
  assert.deepEqual(filterTerms(t, { query: 'a', category: 'tool' }).map((x) => x.id), ['call-recording']);
});

test('filterTerms treats special characters as plain text', () => {
  const t = fixtureTerms();
  for (const q of ['(', '[a', '*', '\\', '.+']) assert.deepEqual(filterTerms(t, { query: q }), [], q);
});

test('filterTerms falls back to the Korean definition when English is missing', () => {
  const t = fixtureTerms();
  delete t[0].definition.en;
  assert.deepEqual(filterTerms(t, { query: '걸리는', lang: 'en' }).map((x) => x.id), ['aht']);
});

test('findTerm resolves a hash to a term or null', () => {
  const t = fixtureTerms();
  assert.equal(findTerm(t, '#aht').id, 'aht');
  assert.equal(findTerm(t, 'aht').id, 'aht');
  for (const h of ['#nope', '', '#home', '#', undefined]) assert.equal(findTerm(t, h), null);
});

// --- glossary page ---
import { setupDom, click } from './dom.js';
import { renderGlossary, GLOSSARY_UI } from '../../glossary/render.js';

const lessons = [{ id: 'coaching', title: { ko: '성과 관리 및 코칭', en: 'Performance Management and Coaching' } }];
function mount(state = {}, lang = 'ko', terms = fixtureTerms()) {
  const { root } = setupDom();
  const calls = { query: [], category: [] };
  const handlers = { onQuery: (q) => calls.query.push(q), onCategory: (c) => calls.category.push(c), lessons };
  const draw = (s, l = lang) => renderGlossary(root, terms, { query: '', category: 'all', focusId: null, ...s }, l, handlers);
  draw(state);
  return { root, calls, draw, $: (sel) => root.querySelector(sel), $$: (sel) => [...root.querySelectorAll(sel)] };
}

test('glossary shows every term, the count and five category buttons', () => {
  const { $, $$ } = mount();
  assert.deepEqual($$('[data-term]').map((c) => c.getAttribute('data-term')), ['aht', 'sme', 'call-recording']);
  assert.ok($('[data-count]').textContent.includes('3'));
  assert.deepEqual($$('[data-category]').map((b) => b.getAttribute('data-category')), ['all', 'metric', 'role', 'process', 'tool']);
  assert.equal($('[data-category="all"]').getAttribute('aria-pressed'), 'true');
  assert.equal($('[data-back]').getAttribute('href'), '../');
  assert.ok($('[data-empty]').hidden);
});

test('typing reports the query, and redrawing keeps the same search box', () => {
  const { $, $$, calls, draw } = mount();
  const box = $('[data-search]');
  box.value = 'sme';
  box.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.deepEqual(calls.query, ['sme']);
  draw({ query: 'sme' });
  assert.equal($('[data-search]'), box);
  assert.deepEqual($$('[data-term]').map((c) => c.getAttribute('data-term')), ['sme']);
  assert.ok($('[data-count]').textContent.includes('1'));
});

test('category buttons report the choice and show which is active', () => {
  const { $, $$, calls, draw } = mount();
  click($('[data-category="tool"]'));
  assert.deepEqual(calls.category, ['tool']);
  draw({ category: 'tool' });
  assert.equal($('[data-category="tool"]').getAttribute('aria-pressed'), 'true');
  assert.equal($('[data-category="all"]').getAttribute('aria-pressed'), 'false');
  assert.deepEqual($$('[data-term]').map((c) => c.getAttribute('data-term')), ['call-recording']);
});

test('no match shows the empty note', () => {
  const { $, $$ } = mount({ query: 'zzz' });
  assert.equal($$('[data-term]').length, 0);
  assert.ok(!$('[data-empty]').hidden);
  assert.equal($('[data-empty]').textContent, GLOSSARY_UI.empty.ko);
});

test('the focused term is marked', () => {
  const { $, $$ } = mount({ focusId: 'aht' });
  assert.ok($('[data-term="aht"]').classList.contains('is-focus'));
  assert.equal($$('.is-focus').length, 1);
});

test('a term card shows both names, the definition and lesson links', () => {
  const { $ } = mount();
  const card = $('[data-term="aht"]');
  assert.equal(card.querySelector('[data-term-label]').textContent, 'AHT');
  assert.equal(card.querySelector('[data-term-name]').textContent, '평균 처리 시간');
  assert.equal(card.querySelector('[data-term-alt]').textContent, 'Average Handle Time');
  assert.equal(card.querySelector('[data-definition]').textContent, fixtureTerms()[0].definition.ko);
  const link = card.querySelector('a[data-seen]');
  assert.equal(link.getAttribute('href'), '../agent-lifecycle/#coaching-0');
  assert.equal(link.textContent, '성과 관리 및 코칭');
  assert.equal($('[data-term="sme"] a[data-seen]'), null);
});

test('English swaps the names, labels and definitions', () => {
  const { $ } = mount({}, 'en');
  const card = $('[data-term="aht"]');
  assert.equal(card.querySelector('[data-term-name]').textContent, 'Average Handle Time');
  assert.equal(card.querySelector('[data-term-alt]').textContent, '평균 처리 시간');
  assert.equal(card.querySelector('[data-definition]').textContent, fixtureTerms()[0].definition.en);
  assert.equal($('[data-category="all"]').textContent, 'All');
  assert.equal($('h1').textContent, 'Glossary');
  assert.ok($('[data-translation-note]').hidden);
  assert.equal(document.documentElement.lang, 'en');
});

test('a term without English falls back to Korean with a note', () => {
  const terms = fixtureTerms();
  delete terms[1].definition.en;
  const { $ } = mount({}, 'en', terms);
  assert.equal($('[data-term="sme"] [data-definition]').textContent, terms[1].definition.ko);
  assert.ok(!$('[data-translation-note]').hidden);
});

test('switching language rebuilds the labels', () => {
  const { $, draw } = mount();
  draw({}, 'en');
  assert.equal($('h1').textContent, 'Glossary');
  assert.equal($('[data-search]').getAttribute('aria-label'), GLOSSARY_UI.searchLabel.en);
});

// --- the real terms (Korean) ---
import { TERMS } from '../../glossary/terms.js';
import { LESSONS } from '../js/lessons/index.js';
import { lessonText } from './helpers.js';

const lessonIds = LESSONS.map((l) => l.id);
const term = (id) => TERMS.find((x) => x.id === id);
const ORDER = ['aht', 'fcr', 'csat', 'dsat', 'backlog', 'quality-score', 'sla', 'service-level', 'asa', 'kpi', 'shrinkage', 'planned-shrinkage', 'unplanned-shrinkage',
  'occupancy', 'schedule-adherence', 'forecast-accuracy', 'attrition',
  'agent', 'sme', 'team-lead', 'assistant-manager', 'operation-manager', 'qa', 'trainer', 'wfm', 'rta', 'fte', 'buddy',
  'rjp', 'ojt', 'nesting', 'floor-walking', 'calibration', 'escalation', 'scrubbing', 'rca', 'one-on-one-coaching', 'grow', 'pip', 'sop', 'voc', 'eap',
  'crm', 'cti', 'ticket', 'knowledge-base', 'call-recording', 'chat-log', 'email-log'];

test('the glossary has the 49 agreed terms in order', () => {
  assert.deepEqual(TERMS.map((x) => x.id), ORDER);
  const count = (c) => TERMS.filter((x) => x.category === c).length;
  assert.deepEqual([count('metric'), count('role'), count('process'), count('tool')], [17, 11, 14, 7]);
});

test('the terms are valid', () => {
  assert.deepEqual(validateTerms(TERMS, { lessonIds }), []);
});

test('Shrinkage follows the agreed definitions', () => {
  assert.ok(term('shrinkage').definition.ko.includes('모든 시간'));
  for (const w of ['휴식', '교육', '회의']) assert.ok(term('planned-shrinkage').definition.ko.includes(w), w);
  for (const w of ['결근', '지각', '병가', '입원', '장례식']) assert.ok(term('unplanned-shrinkage').definition.ko.includes(w), w);
});

test('channel records use the agreed names', () => {
  assert.equal(term('call-recording').name.ko, '녹취');
  assert.equal(term('chat-log').name.ko, '채팅 로그');
  assert.equal(term('email-log').name.ko, '이메일 로그');
  assert.ok(term('call-recording').definition.ko.includes('전화'));
  assert.ok(term('chat-log').definition.ko.includes('채팅'));
  assert.ok(term('email-log').definition.ko.includes('이메일'));
});

test('abbreviations are spelled out as agreed', () => {
  assert.equal(term('rta').name.en, 'Real-Time Analyst');
  assert.equal(term('wfm').name.en, 'Workforce Management');
  assert.equal(term('aht').name.ko, '평균 처리 시간');
  assert.equal(term('team-lead').name.ko, '팀장 (TL)'); // short name added 2026-11-25
  assert.equal(term('attrition').name.ko, '퇴사율');
  assert.equal(term('shrinkage').name.ko, '슈링키지');
});

test('every "seen" lesson really uses the term', () => {
  for (const x of TERMS) {
    for (const id of x.seen) {
      const text = lessonText(LESSONS.find((l) => l.id === id), 'ko');
      // A role's short name in brackets, e.g. "팀장 (TL)", is not part of lesson sentences.
      const name = x.name.ko.replace(/ \([A-Z]+\)$/, '');
      assert.ok(text.includes(x.term) || text.includes(name), `${x.id} in ${id}`);
    }
  }
});

test('OJT sits between training and nesting (user wording)', () => {
  const ojt = term('ojt');
  assert.equal(ojt.category, 'process');
  assert.equal(ojt.name.en, 'On-the-Job Training');
  for (const w of ['Basic Training', 'Trainer', '직무전문가', '채널별']) assert.ok(ojt.definition.ko.includes(w), w);
  assert.ok(term('nesting').definition.ko.startsWith('OJT를 마친 신입이'));
});

// --- the real terms (English) ---
test('every term has English, with no Korean left in it', () => {
  assert.deepEqual(validateTerms(TERMS, { requireEnglish: true, lessonIds }), []);
  for (const x of TERMS) {
    assert.ok(!/[가-힣]/.test(x.name.en + x.definition.en), x.id);
  }
});

test('English Shrinkage and channel records follow the agreed wording', () => {
  assert.ok(term('shrinkage').definition.en.includes('for any reason'));
  for (const w of ['breaks', 'training', 'meetings']) assert.ok(term('planned-shrinkage').definition.en.includes(w), w);
  for (const w of ['absence', 'lateness', 'sick leave', 'hospitali', 'funeral']) assert.ok(term('unplanned-shrinkage').definition.en.includes(w), w);
  assert.equal(term('call-recording').name.en, 'Call Recording');
  assert.equal(term('chat-log').name.en, 'Chat Log');
  assert.equal(term('email-log').name.en, 'Email Log');
  assert.ok(term('nesting').definition.en.includes('OJT'));
});

// --- final review fixes ---
test('a name equal to the label is not repeated on the card', () => {
  const en = mount({}, 'en');
  const card = en.$('[data-term="call-recording"]');
  assert.equal(card.querySelector('[data-term-name]'), null);
  assert.equal(card.querySelector('[data-term-alt]').textContent, '녹취');
  const ko = mount({}, 'ko');
  const koCard = ko.$('[data-term="call-recording"]');
  assert.equal(koCard.querySelector('[data-term-name]').textContent, '녹취');
  assert.equal(koCard.querySelector('[data-term-alt]'), null);
});

test('the focused card can take keyboard focus and the category group is labelled', () => {
  const { $ } = mount({ focusId: 'aht' });
  assert.equal($('[data-term="aht"]').getAttribute('tabindex'), '-1');
  assert.equal($('[data-term="sme"]').getAttribute('tabindex'), null);
  assert.equal($('.chips').getAttribute('aria-label'), GLOSSARY_UI.categoryLabel.ko);
  assert.equal(GLOSSARY_UI.categoryLabel.en, 'Category');
});

test('English wording fixes from the review', () => {
  assert.ok(term('sop').definition.en.includes('ad-hoc fixes'));
  assert.ok(term('shrinkage').definition.en.startsWith('The share of time, for any reason, when agents cannot take calls.'));
  assert.ok(term('shrinkage').definition.en.includes('all time') === false);
  assert.ok(term('csat').definition.en.includes('ultimate measure'));
  assert.ok(term('sme').definition.en.startsWith('The next level up from agent'));
  assert.ok(term('one-on-one-coaching').definition.en.includes('based on'));
  assert.ok(term('nesting').definition.en.includes('accurate answers'));
});

test('Attrition links to the lesson that talks about it', () => {
  assert.deepEqual(term('attrition').seen, ['nesting']);
});

test('OJT links to lesson 3', () => {
  assert.deepEqual(term('ojt').seen, ['nesting']);
});

test('the staffing lab terms carry the approved definitions', () => {
  assert.equal(term('service-level').definition.ko, '목표 시간 안에 응답한 문의의 비율입니다. 목표 시간과 비율은 센터마다 정합니다.');
  assert.equal(term('service-level').name.ko, '서비스 레벨');
  assert.equal(term('asa').definition.ko, '문의가 들어와 상담사가 응답할 때까지 걸린 시간의 평균입니다.');
  assert.equal(term('asa').name.ko, '평균 응답 속도');
  assert.equal(term('asa').name.en, 'Average Speed of Answer');
});

// --- links to the SOP Library ---
import { SOP_LESSONS } from '../../sop-library/lessons/index.js';

test('six terms point to their SOP lesson and no others do', () => {
  const withSop = Object.fromEntries(TERMS.filter((x) => x.sop).map((x) => [x.id, x.sop]));
  assert.deepEqual(withSop, {
    calibration: 'calibration', escalation: 'escalation', scrubbing: 'scrubbing', 'one-on-one-coaching': 'coaching', grow: 'coaching', pip: 'pip',
  });
  const sopIds = SOP_LESSONS.map((l) => l.id);
  assert.deepEqual(validateTerms(TERMS, { requireEnglish: true, lessonIds: LESSONS.map((l) => l.id), sopIds }), []);
});

test('an unknown SOP lesson is rejected', () => {
  const terms = fixtureTerms();
  terms[0].sop = 'nope';
  assert.ok(validateTerms(terms, { lessonIds: ['coaching'], sopIds: ['pip'] }).some((e) => e.includes('nope')));
  terms[0].sop = 'pip';
  assert.deepEqual(validateTerms(terms, { lessonIds: ['coaching'], sopIds: ['pip'] }), []);
});

test('the card links to the SOP Library next to the course link', () => {
  for (const [lang, label] of [['ko', '팀장 SOP 라이브러리에서 보기'], ['en', 'See it in the TL SOP Library']]) {
    const { $, $$ } = mount({}, lang, TERMS);
    const link = $('[data-term="grow"] a[data-sop-link]');
    assert.equal(link.getAttribute('href'), '../sop-library/#coaching-0');
    assert.equal(link.textContent, label);
    assert.equal($('[data-term="pip"] a[data-sop-link]').getAttribute('href'), '../sop-library/#pip-0');
    assert.equal($$('a[data-sop-link]').length, 6);
    assert.ok($('[data-term="calibration"] a[data-seen]'), 'course link stays');
    assert.equal($('[data-term="aht"] a[data-sop-link]'), null);
  }
});

test('scrubbing, RCA and backlog are the approved wording, and scrubbing links to its SOP', async () => {
  const { readFileSync } = await import('node:fs');
  const doc = readFileSync(new URL('../../docs/superpowers/specs/2026-11-21-sop-scrubbing-design.md', import.meta.url), 'utf8');
  const rows = Object.fromEntries(doc.split('## 용어집')[1].split('\n').filter((l) => /^\| (Scrubbing|RCA|Backlog) \|/.test(l))
    .map((l) => l.slice(2, -2).split(' | ')).map(([label, name, def]) => [label, { name, def }]));
  for (const [id, label] of [['scrubbing', 'Scrubbing'], ['rca', 'RCA'], ['backlog', 'Backlog']]) {
    const t = term(id);
    assert.equal(t.term, label);
    assert.equal(rows[label].name.startsWith(t.name.ko), true, id);
    assert.equal(t.definition.ko, rows[label].def, id);
    assert.ok(t.name.en && t.definition.en && !/[가-힣]/.test(t.definition.en), id);
  }
  assert.equal(term('scrubbing').sop, 'scrubbing');
});

// 2026-11-22: one sentence tells coaching apart from feedback and compliance checks.
test('1:1 coaching is told apart from feedback and compliance checks (approved 2026-11-22)', async () => {
  const { readFileSync } = await import('node:fs');
  const cell = (f, place) => readFileSync(new URL(`../../docs/superpowers/specs/${f}`, import.meta.url), 'utf8')
    .split('\n').find((l) => l.startsWith(`| ${place} |`)).split(' | ')[1].replace(/\s*\|$/, '').trim();
  const t = TERMS.find((x) => x.id === 'one-on-one-coaching');
  assert.equal(t.definition.ko, cell('2026-11-22-team-leader-self-copy.md', '바뀐 뒤'));
  assert.equal(t.definition.en, cell('2026-11-22-team-leader-self-copy.en.md', 'After'));
});

test('role cards carry the short name, and TL finds the team lead', async () => {
  const { readFileSync } = await import('node:fs');
  const doc = readFileSync(new URL('../../docs/superpowers/specs/2026-11-25-role-home-copy.md', import.meta.url), 'utf8').split(/^## 8\. /m)[1];
  const row = (label) => doc.split('\n').find((l) => l.startsWith(`| ${label} |`)).slice(1, -1).split(' | ').map((c) => c.trim());
  for (const [id, label] of [['team-lead', 'Team Lead'], ['assistant-manager', 'Assistant Manager'], ['operation-manager', 'Operation Manager']]) {
    const t = TERMS.find((x) => x.id === id);
    assert.deepEqual(t.name, { ko: row(label)[1], en: row(label)[2] }, id);
  }
  assert.ok(filterTerms(TERMS, { query: 'TL' }).some((t) => t.id === 'team-lead'));
  assert.ok(filterTerms(TERMS, { query: 'AM', lang: 'en' }).some((t) => t.id === 'assistant-manager'));
});
