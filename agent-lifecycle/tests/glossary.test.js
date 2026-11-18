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
const ORDER = ['aht', 'fcr', 'csat', 'dsat', 'quality-score', 'sla', 'kpi', 'shrinkage', 'planned-shrinkage', 'unplanned-shrinkage',
  'occupancy', 'schedule-adherence', 'forecast-accuracy', 'attrition',
  'agent', 'sme', 'team-lead', 'assistant-manager', 'operation-manager', 'qa', 'trainer', 'wfm', 'rta', 'fte', 'buddy',
  'rjp', 'ojt', 'nesting', 'floor-walking', 'calibration', 'escalation', 'one-on-one-coaching', 'grow', 'pip', 'sop', 'voc', 'eap',
  'crm', 'cti', 'ticket', 'knowledge-base', 'call-recording', 'chat-log', 'email-log'];

test('the glossary has the 44 agreed terms in order', () => {
  assert.deepEqual(TERMS.map((x) => x.id), ORDER);
  const count = (c) => TERMS.filter((x) => x.category === c).length;
  assert.deepEqual([count('metric'), count('role'), count('process'), count('tool')], [14, 11, 12, 7]);
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
  assert.equal(term('team-lead').name.ko, '팀장');
  assert.equal(term('attrition').name.ko, '퇴사율');
  assert.equal(term('shrinkage').name.ko, '슈링키지');
});

test('every "seen" lesson really uses the term', () => {
  for (const x of TERMS) {
    for (const id of x.seen) {
      const text = lessonText(LESSONS.find((l) => l.id === id), 'ko');
      assert.ok(text.includes(x.term) || text.includes(x.name.ko), `${x.id} in ${id}`);
    }
  }
});

test('OJT sits between training and nesting (user wording)', () => {
  const ojt = term('ojt');
  assert.equal(ojt.category, 'process');
  assert.equal(ojt.name.en, 'On-the-Job Training');
  for (const w of ['Basic Training', 'Trainer', 'SME', '채널별']) assert.ok(ojt.definition.ko.includes(w), w);
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
