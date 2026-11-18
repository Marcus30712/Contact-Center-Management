import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  INPUTS, TARGET_SERVICE_LEVEL, INTERVAL_MINUTES, initialValues, compute,
} from '../../staffing-calculator/model.js';

const init = () => initialValues();
const pct = (x) => Math.round(x * 100);

test('the six inputs have the agreed ranges and example values', () => {
  assert.deepEqual(INPUTS, [
    { id: 'volume', min: 10, max: 300, step: 5, initial: 100, unit: 'count' },
    { id: 'aht', min: 1, max: 15, step: 0.5, initial: 3, unit: 'min' },
    { id: 'rostered', min: 1, max: 80, step: 1, initial: 20, unit: 'people' },
    { id: 'planned', min: 0, max: 40, step: 1, initial: 20, unit: 'percent' },
    { id: 'unplanned', min: 0, max: 30, step: 1, initial: 10, unit: 'percent' },
    { id: 'target', min: 10, max: 120, step: 5, initial: 20, unit: 'sec' },
  ]);
  assert.equal(TARGET_SERVICE_LEVEL, 0.8);
  assert.equal(INTERVAL_MINUTES, 30);
  for (const i of INPUTS) assert.ok(Number.isInteger((i.initial - i.min) / i.step), i.id);
});

test('the example values give the documented picture', () => {
  const r = compute(init());
  assert.equal(r.seated, 14);
  assert.equal(r.overloaded, false);
  assert.equal(pct(r.serviceLevel), 89);
  assert.equal(pct(r.occupancy), 71);
  assert.equal(r.waitSeconds, 8);
  assert.deepEqual(r.required, { seated: 14, rostered: 20 });
  assert.equal(r.gap, 0);
  assert.deepEqual(r.away, { planned: 4, unplanned: 2 });
  assert.equal(r.busy, 10);
});

test('seated staff is the roster less shrinkage, rounded down', () => {
  assert.equal(compute({ ...init(), rostered: 10 }).seated, 7);
  assert.equal(compute({ ...init(), planned: 0, unplanned: 0 }).seated, 20);
  assert.equal(compute({ ...init(), rostered: 50, planned: 29, unplanned: 0 }).seated, 35);
});

test('everyone away is counted as planned or unplanned', () => {
  for (const [planned, unplanned] of [[20, 10], [40, 30], [0, 7], [0, 0]]) {
    for (let rostered = 1; rostered <= 80; rostered += 1) {
      const r = compute({ ...init(), rostered, planned, unplanned });
      assert.equal(r.away.planned + r.away.unplanned, rostered - r.seated);
      assert.ok(r.away.planned >= 0 && r.away.unplanned >= 0);
    }
  }
});

test('seated equal to intensity is overload', () => {
  const r = compute({ ...init(), rostered: 10, planned: 0, unplanned: 0 });
  assert.equal(r.overloaded, true);
  assert.equal(r.serviceLevel, null);
  assert.equal(r.waitSeconds, null);
  assert.equal(r.occupancy, null);
  assert.equal(r.busy, 10);
  assert.equal(r.required.seated, 14);
});

test('maximum shrinkage with one person leaves nobody seated', () => {
  const r = compute({ ...init(), rostered: 1, planned: 40, unplanned: 30 });
  assert.equal(r.seated, 0);
  assert.equal(r.overloaded, true);
  assert.equal(r.busy, 0);
});

test('the gap is negative when short and positive when spare', () => {
  assert.equal(compute({ ...init(), rostered: 18 }).gap, -2);
  assert.equal(compute({ ...init(), rostered: 23 }).gap, 3);
});

test('rostered need is the smallest headcount that seats enough people', () => {
  for (let planned = 0; planned <= 40; planned += 1) {
    for (const unplanned of [0, 9, 30]) {
      const r = compute({ ...init(), planned, unplanned });
      const keep = 100 - planned - unplanned;
      assert.ok(r.required.rostered * keep >= r.required.seated * 100, `${planned}+${unplanned}`);
      assert.ok((r.required.rostered - 1) * keep < r.required.seated * 100, `${planned}+${unplanned}`);
    }
  }
});

test('no slider extreme produces a broken number', () => {
  const numbers = (r) => [r.seated, r.away.planned, r.away.unplanned, r.serviceLevel, r.waitSeconds,
    r.occupancy, r.busy, r.required.seated, r.required.rostered, r.gap];
  for (const input of INPUTS) {
    for (const value of [input.min, input.max]) {
      for (const n of numbers(compute({ ...init(), [input.id]: value }))) {
        assert.ok(n === null || Number.isFinite(n), `${input.id}=${value}`);
      }
    }
  }
  const worst = compute({ volume: 300, aht: 15, rostered: 1, planned: 40, unplanned: 30, target: 10 });
  for (const n of numbers(worst)) assert.ok(n === null || Number.isFinite(n));
});

test('service level and occupancy stay between zero and one', () => {
  for (let rostered = 1; rostered <= 80; rostered += 1) {
    const r = compute({ ...init(), rostered });
    if (r.overloaded) continue;
    assert.ok(r.serviceLevel >= 0 && r.serviceLevel <= 1);
    assert.ok(r.occupancy > 0 && r.occupancy < 1);
    assert.ok(r.busy <= r.seated);
  }
});

// --- wording ---
import { STAFFING_TEXT as T, GLOSSARY_LINKS, fill } from '../../staffing-calculator/text.js';
import { TERMS } from '../../glossary/terms.js';

const isLeaf = (v) => typeof v?.ko === 'string' || typeof v?.en === 'string';
const leaves = (obj, prefix = '') => Object.entries(obj).flatMap(([k, v]) =>
  (isLeaf(v) ? [[prefix + k, v]] : leaves(v, `${prefix}${k}.`)));
const KEYS = ['title', 'back', 'intro', 'exampleNote', 'inputsHeading', 'resultsHeading',
  ...INPUTS.flatMap((i) => [`label.${i.id}`, `hint.${i.id}`]),
  'unit.count', 'unit.min', 'unit.people', 'unit.percent', 'unit.sec',
  'seated', 'seatedHint', 'seatedLine', 'serviceLevel', 'serviceLevelHint', 'wait', 'waitHint',
  'occupancy', 'occupancyShort', 'occupancyHint', 'required', 'requiredLine', 'gapShort', 'gapExact', 'gapSpare', 'overload',
  'legendBusy', 'legendIdle', 'legendPlanned', 'legendUnplanned', 'pictureSummary',
  'tryHeading', 'try1', 'try2', 'try3', 'limitsHeading', 'limits', 'countryNote', 'credit', 'creditLink', 'glossaryLink'];

test('every string exists in both languages', () => {
  const found = new Map(leaves(T));
  for (const key of KEYS) {
    assert.ok(found.get(key)?.ko?.trim(), `${key}.ko`);
    assert.ok(found.get(key)?.en?.trim(), `${key}.en`);
  }
  for (const [key, v] of found) assert.ok(v.ko?.trim() && v.en?.trim(), key);
});

test('the Korean wording is the approved wording', () => {
  const approved = {
    intro: '문의량, 처리 시간, 인원, Shrinkage를 움직여 보며 필요한 인원이 어떻게 정해지는지 익히는 연습 화면입니다.',
    exampleNote: '아래 값은 연습을 위한 예시 값입니다. 우리 센터의 값으로 바꿔 보세요.',
    seatedHint: '편성 인원에서 Shrinkage만큼을 뺀, 실제로 문의를 받을 수 있는 인원입니다.',
    serviceLevelHint: '목표 시간 안에 응답한 문의의 비율입니다.',
    waitHint: '문의 한 건이 응답을 받을 때까지 기다리는 평균 시간입니다.',
    occupancyHint: '자리에 있는 시간 가운데 문의를 응대하는 데 쓰는 비율입니다. 너무 높으면 숨 돌릴 틈이 없습니다.',
    requiredLine: '서비스 레벨 80%(예시 목표)를 맞추려면 자리에 {seated}명, Shrinkage를 반영해 편성은 {rostered}명이 필요합니다.',
    gapShort: '{n}명 부족',
    gapExact: '딱 맞음',
    gapSpare: '{n}명 여유',
    overload: '대기가 계속 쌓입니다. 인원을 늘리거나 문의량·처리 시간을 줄여 보세요.',
    limits: '이 화면은 Erlang C라는 계산 방식을 씁니다. 고객이 끊지 않고 끝까지 기다린다고 가정하므로 실제보다 대기를 길게 볼 수 있습니다. 연습용이며, 실제 인원 계획은 WFM 담당자와 확인하세요.',
    countryNote: '근무 시간과 휴식에 관한 법과 제도는 국가마다 다를 수 있습니다.',
    try1: '편성 인원을 1명씩 줄여 보세요. 서비스 레벨이 어디서 급하게 떨어지나요?',
    try2: '계획되지 않은 Shrinkage를 10%p 올려 보세요. 필요한 편성 인원이 몇 명 늘어나나요?',
    try3: '평균 처리 시간을 30초 늘려 보세요. 통화가 조금 길어졌을 뿐인데 무엇이 달라지나요?',
  };
  for (const [key, ko] of Object.entries(approved)) assert.equal(T[key].ko, ko, key);
});

test('the wording follows the content rules', () => {
  const FIGURE = /\d\s*(%|초|분|명|sec|min|people)/;
  const sentences = (s) => (s.match(/[.?!](?=\s|$)/g) || []).length;
  for (const [key, v] of leaves(T)) {
    for (const lang of ['ko', 'en']) {
      const text = v[lang];
      assert.ok(!text.includes('진상'), key);
      assert.ok(!text.includes('슈링키지'), key);
      assert.ok(sentences(text) <= 3, `${key}.${lang} is too long`);
      // Slider instructions and the fixed half-hour interval are not claims about a center.
      const exempt = /^try\d$/.test(key) || key === 'hint.volume';
      if (!exempt && FIGURE.test(text)) assert.ok(/예시|[Ee]xample/.test(text), `${key}.${lang} has an unlabelled figure`);
    }
    assert.ok(!/licence|organisation/.test(v.en), key);
    assert.ok(!/산업안전보건법|제\d+조/.test(v.ko), key);
  }
});

test('pyworkforce is credited and glossary links point at real terms', () => {
  for (const lang of ['ko', 'en']) assert.ok(T.credit[lang].includes('pyworkforce') && T.credit[lang].includes('MIT'));
  const ids = TERMS.map((x) => x.id);
  for (const id of Object.values(GLOSSARY_LINKS)) assert.ok(ids.includes(id), id);
  assert.deepEqual(GLOSSARY_LINKS, {
    seated: 'shrinkage', serviceLevel: 'service-level', wait: 'asa', occupancy: 'occupancy', required: 'fte',
    aht: 'aht', planned: 'planned-shrinkage', unplanned: 'unplanned-shrinkage',
  });
});

test('fill replaces every named placeholder', () => {
  assert.equal(fill('{a}명 중 {b}명, 다시 {a}', { a: 3, b: 2 }), '3명 중 2명, 다시 3');
});

// --- screen ---
import { setupDom } from './dom.js';
import { renderCalculator } from '../../staffing-calculator/render.js';

function mount(lang = 'ko', values = initialValues()) {
  const { root } = setupDom();
  const inputs = [];
  const view = renderCalculator(root, values, lang, { onInput: (id, value) => inputs.push([id, value]) });
  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => [...root.querySelectorAll(sel)];
  const number = (key) => $(`[data-result="${key}"] [data-number]`).textContent;
  return { root, view, inputs, $, $$, number };
}

test('the six sliders are labelled and show the example values', () => {
  const { $, $$ } = mount();
  assert.equal($$('input[type="range"]').length, 6);
  const shown = { volume: '100건', aht: '3분', rostered: '20명', planned: '20%', unplanned: '10%', target: '20초' };
  for (const input of INPUTS) {
    const el = $(`input[data-input="${input.id}"]`);
    assert.equal(el.min, String(input.min));
    assert.equal(el.max, String(input.max));
    assert.equal(el.step, String(input.step));
    assert.equal(el.value, String(input.initial));
    assert.ok($(`label[for="${el.id}"]`).textContent.trim(), input.id);
    assert.equal($(`[data-value="${input.id}"]`).textContent, shown[input.id]);
  }
  assert.equal($('[data-example-note]').textContent, T.exampleNote.ko);
});

test('the example values show the documented results', () => {
  const { $, number } = mount();
  assert.equal(number('seated'), '14명');
  assert.equal(number('serviceLevel'), '89%');
  assert.equal(number('wait'), '8초');
  assert.equal(number('occupancy'), '71%');
  assert.equal(number('required'), '20명');
  assert.equal($('[data-required-line]').textContent, fill(T.requiredLine.ko, { seated: 14, rostered: 20 }));
  assert.equal($('[data-gap]').getAttribute('data-gap-state'), 'exact');
  assert.equal($('[data-gap]').textContent, '딱 맞음');
  assert.equal($('[data-overload]'), null);
});

test('the picture draws one mark per rostered person', () => {
  const { $, $$ } = mount();
  const count = (kind) => $$(`[data-person="${kind}"]`).length;
  assert.deepEqual([count('busy'), count('idle'), count('planned'), count('unplanned')], [10, 4, 4, 2]);
  const picture = $('svg[data-picture]');
  assert.equal(picture.getAttribute('role'), 'img');
  assert.equal(picture.getAttribute('aria-label'), fill(T.pictureSummary.ko, { rostered: 20, seated: 14, busy: 10 }));
  assert.equal($$('[data-legend] li').length, 4);
});

test('overload replaces the three rates with a plain message', () => {
  const { view, $, number } = mount();
  view.update({ ...initialValues(), rostered: 10, planned: 0, unplanned: 0 });
  assert.equal($('[data-overload]').textContent, T.overload.ko);
  for (const key of ['serviceLevel', 'wait', 'occupancy']) assert.ok(!/\d/.test(number(key)), key);
  assert.equal(number('required'), '14명');
  assert.equal($('[data-gap]').getAttribute('data-gap-state'), 'short');
  assert.equal($('[data-gap]').textContent, '4명 부족');
  view.update(initialValues());
  assert.equal($('[data-overload]'), null);
  assert.equal(number('serviceLevel'), '89%');
});

test('spare staff is reported as spare', () => {
  const { view, $ } = mount();
  view.update({ ...initialValues(), rostered: 23 });
  assert.equal($('[data-gap]').getAttribute('data-gap-state'), 'spare');
  assert.equal($('[data-gap]').textContent, '3명 여유');
});

test('update keeps the sliders in place and input reports a number', () => {
  const { view, $, inputs } = mount();
  const slider = $('input[data-input="aht"]');
  view.update({ ...initialValues(), aht: 3.5 });
  assert.equal($('input[data-input="aht"]'), slider);
  assert.equal($('[data-value="aht"]').textContent, '3.5분');
  slider.value = '4';
  slider.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.deepEqual(inputs, [['aht', 4]]);
});

test('the English screen has no Korean left in it', () => {
  const { root, $, number } = mount('en');
  assert.equal($('h1').textContent, 'Staffing Lab');
  assert.ok(!/[가-힣]/.test(root.textContent));
  assert.equal(number('wait'), '8 sec');
  assert.equal($('[data-value="volume"]').textContent, '100 contacts');
});

test('links lead to the hub, the glossary and the references', () => {
  const { $, $$ } = mount();
  assert.equal($('a[data-back]').getAttribute('href'), '../');
  assert.equal($('a[data-credit]').getAttribute('href'), '../references/');
  const ids = TERMS.map((x) => x.id);
  const links = $$('a[data-glossary]');
  assert.equal(links.length, Object.keys(GLOSSARY_LINKS).length);
  for (const a of links) {
    const id = a.getAttribute('data-glossary');
    assert.ok(ids.includes(id), id);
    assert.equal(a.getAttribute('href'), `../glossary/#${id}`);
    assert.ok(a.getAttribute('aria-label').trim());
  }
});

test('a compact summary repeats the key numbers for small screens', () => {
  const { view, $ } = mount();
  const summary = $('[data-summary]');
  assert.equal(summary.getAttribute('aria-hidden'), 'true');
  const item = (key) => $(`[data-summary] [data-summary-item="${key}"]`).textContent;
  assert.equal(item('serviceLevel'), '서비스 레벨89%');
  assert.equal(item('wait'), '평균 대기 시간8초');
  assert.equal(item('occupancy'), '점유율71%');
  assert.equal(item('gap'), '필요한 인원딱 맞음');
  assert.equal(summary.querySelectorAll('a, button, input').length, 0);
  view.update({ ...initialValues(), rostered: 10, planned: 0, unplanned: 0 });
  assert.equal(item('serviceLevel'), '서비스 레벨—');
  assert.equal(item('gap'), '필요한 인원4명 부족');
  assert.equal(summary.getAttribute('data-overloaded'), 'true');
});

test('a service level just under the target is never shown as reaching it', () => {
  const r = compute({ ...initialValues(), rostered: 19 });
  assert.ok(r.serviceLevel < 0.8 && Math.round(r.serviceLevel * 100) === 80);
  assert.equal(r.serviceLevelPercent, 79);
  assert.equal(r.gap, -1);
  assert.equal(compute(initialValues()).serviceLevelPercent, 89);
  assert.equal(compute({ ...initialValues(), rostered: 10, planned: 0, unplanned: 0 }).serviceLevelPercent, null);
  const { view, number } = mount();
  view.update({ ...initialValues(), rostered: 19 });
  assert.equal(number('serviceLevel'), '79%');
});

test('sliders speak their value with its unit and nothing else chatters', () => {
  const { view, root, $ } = mount();
  assert.equal($('input[data-input="aht"]').getAttribute('aria-valuetext'), '3분');
  view.update({ ...initialValues(), aht: 3.5 });
  assert.equal($('input[data-input="aht"]').getAttribute('aria-valuetext'), '3.5분');
  assert.equal(root.querySelectorAll('output').length, 0);
  assert.equal(root.querySelectorAll('[aria-live]').length, 0);
  assert.equal(root.querySelectorAll('[role="status"]').length, 1);
});

test('one status sentence is announced after the sliders settle', async () => {
  const { root } = setupDom();
  const view = renderCalculator(root, initialValues(), 'ko', { onInput() {}, statusDelay: 5 });
  const status = root.querySelector('[data-status]');
  assert.equal(status.getAttribute('role'), 'status');
  assert.equal(status.textContent, '');
  view.update({ ...initialValues(), rostered: 19 });
  view.update({ ...initialValues(), rostered: 18 });
  assert.equal(status.textContent, '');
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(status.textContent, '서비스 레벨 64%, 평균 대기 시간 40초, 점유율 83%, 필요한 인원 2명 부족');
  view.update({ ...initialValues(), rostered: 10, planned: 0, unplanned: 0 });
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(status.textContent, `${T.overload.ko} 필요한 인원 4명 부족`);
});
