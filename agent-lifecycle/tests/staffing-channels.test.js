import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CHANNELS, CHANNEL_INPUTS, COMMON_INPUTS, initialChannels, computeChannel, computeChannels,
} from '../../staffing-calculator/channels.js';
import { trafficIntensity, requiredPositions } from '../../staffing-calculator/erlang.js';
import { TARGET_SERVICE_LEVEL } from '../../staffing-calculator/model.js';

const FIELDS = ['seats', 'needed', 'current', 'gap', 'weekly', 'monthly', 'otWeekly', 'otMonthly'];

// ---- Task 1: calculation ----

test('the example values give the documented channel results', () => {
  const r = computeChannels(initialChannels());
  const pick = (k) => { const x = r.rows[k]; return [x.seats, x.needed, x.gap, x.weekly, x.monthly, x.otWeekly, x.otMonthly, x.otPerPerson]; };
  assert.deepEqual(pick('phone'), [18, 39, -3, 1543, 6686, 103, 446, 2.9]);
  assert.deepEqual(pick('chat'), [11, 24, -2, 943, 4086, 63, 273, 2.9]);
  assert.deepEqual(pick('email'), [6, 9, 1, 336, 1456, 0, 0, 0]);
  assert.deepEqual(r.total, { seats: 35, needed: 72, current: 68, short: 5, spare: 1, weekly: 2822, monthly: 12228, otWeekly: 166, otMonthly: 719 });
});

test('the inputs come in the agreed order with example values inside their ranges', () => {
  assert.deepEqual(CHANNELS, ['phone', 'chat', 'email']);
  assert.deepEqual(COMMON_INPUTS.map((i) => i.id), ['planned', 'unplanned', 'weeklyHours']);
  assert.deepEqual(CHANNEL_INPUTS.phone.map((i) => i.id), ['dailyVolume', 'aht', 'target', 'hoursOpen', 'daysOpen', 'current']);
  assert.deepEqual(CHANNEL_INPUTS.chat.map((i) => i.id), ['dailyVolume', 'aht', 'concurrency', 'target', 'hoursOpen', 'daysOpen', 'current']);
  assert.deepEqual(CHANNEL_INPUTS.email.map((i) => i.id), ['dailyVolume', 'aht', 'hoursOpen', 'daysOpen', 'current']);
  for (const input of [...COMMON_INPUTS, ...Object.values(CHANNEL_INPUTS).flat()]) {
    assert.ok(input.min <= input.initial && input.initial <= input.max, input.id);
  }
  const s = initialChannels();
  assert.deepEqual(s.on, { phone: true, chat: true, email: true });
  assert.equal(s.edit, 'phone');
  assert.deepEqual(s.common, { planned: 20, unplanned: 10, weeklyHours: 40 });
});

test('only channels that are on are compared and totalled', () => {
  const s = initialChannels();
  s.on.email = false;
  const r = computeChannels(s);
  assert.deepEqual(Object.keys(r.rows), ['phone', 'chat']);
  assert.equal(r.total.needed, 63);
  assert.equal(r.total.spare, 0);
  assert.equal(r.total.short, 5);
  assert.equal(r.total.weekly, 1543 + 943);
});

test('zero current staff', () => {
  const s = initialChannels();
  s.phone.current = 0;
  const x = computeChannels(s).rows.phone;
  assert.equal(x.otPerPerson, null);
  assert.equal(x.gap, -x.needed);
  assert.equal(x.otWeekly, x.weekly);
});

test('chat with one concurrent chat is the phone calculation', () => {
  const s = initialChannels();
  const same = { dailyVolume: 800, aht: 6, target: 30, hoursOpen: 9, daysOpen: 5, current: 12 };
  const phone = computeChannel('phone', same, s.common);
  const chat = computeChannel('chat', { ...same, concurrency: 1 }, s.common);
  assert.deepEqual(chat, phone);
});

test('every slider extreme gives finite numbers', () => {
  const base = initialChannels();
  const check = (r, where) => {
    for (const f of FIELDS) assert.ok(Number.isFinite(r[f]), `${where} ${f}=${r[f]}`);
    assert.ok(r.otPerPerson === null || Number.isFinite(r.otPerPerson), where);
  };
  for (const kind of CHANNELS) {
    for (const input of CHANNEL_INPUTS[kind]) {
      for (const v of [input.min, input.max]) {
        check(computeChannel(kind, { ...base[kind], [input.id]: v }, base.common), `${kind}.${input.id}=${v}`);
      }
    }
    for (const input of COMMON_INPUTS) {
      for (const v of [input.min, input.max]) {
        check(computeChannel(kind, base[kind], { ...base.common, [input.id]: v }), `${kind} common.${input.id}=${v}`);
      }
    }
  }
});

test('no Shrinkage means weekly hours equal desk hours', () => {
  const s = initialChannels();
  s.common.planned = 0;
  s.common.unplanned = 0;
  assert.equal(computeChannels(s).rows.phone.weekly, 18 * 10 * 6);
});

test('the phone column uses the same Erlang C as the 30-minute practice', () => {
  const seats = requiredPositions(trafficIntensity(1600 / 20, 5, 30), 5, 20 / 60, { serviceLevel: TARGET_SERVICE_LEVEL }).raw;
  assert.equal(computeChannels(initialChannels()).rows.phone.seats, seats);
});

// ---- Task 2: wording ----
import { readFileSync } from 'node:fs';
import { CHANNEL_TEXT, CHANNEL_GLOSSARY, STAFFING_TEXT } from '../../staffing-calculator/text.js';
import { TERMS } from '../../glossary/terms.js';

const DOCS = { ko: '2026-11-21-staffing-channels-copy.md', en: '2026-11-21-staffing-channels-copy.en.md' };
const REUSED = { ko: '(다시 씀)', en: '(reused)' };
const SPECIAL = { 'aht (채팅)': 'ahtChat', 'aht (이메일)': 'ahtEmail', 'target (채팅)': 'targetChat', 'aht (chat)': 'ahtChat', 'aht (email)': 'ahtEmail', 'target (chat)': 'targetChat' };

// Every wording row of a copy doc as [path, text]; rows marked as reused are skipped.
function docRows(lang) {
  const doc = readFileSync(new URL(`../../docs/superpowers/specs/${DOCS[lang]}`, import.meta.url), 'utf8');
  const out = [];
  let section = '';
  for (const line of doc.split('\n')) {
    if (line.startsWith('## ')) section = line;
    if (!line.startsWith('|') || line.startsWith('|---') || /^\| (키|Key) \|/.test(line)) continue;
    const cells = line.slice(1, -1).split(' | ').map((c) => c.trim());
    const [key, a, b] = cells;
    const fresh = (text) => text && !text.startsWith(REUSED[lang]);
    const inputs = /입력값|Inputs/.test(section);
    const results = /결과 표|Results table/.test(section);
    if (cells.length === 3 && inputs) {
      if (fresh(a)) out.push([`label.${key}`, a]);
      if (fresh(b)) out.push([`hint.${SPECIAL[key] ?? key}`, b]);
    } else if (cells.length === 3 && results) {
      const row = key === 'currentRow' ? 'current' : key;
      if (key === 'resultsHeading' || key === 'total') out.push([key, a]);
      else {
        out.push([`row.${row}`, a]);
        if (fresh(b)) out.push([`rowHint.${row}`, b]);
      }
    } else if (fresh(a)) {
      out.push([['phone', 'chat', 'email'].includes(key) ? `channel.${key}` : key, a]);
    }
  }
  return out;
}
const at = (path) => path.split('.').reduce((o, k) => o?.[k], CHANNEL_TEXT);
const leaves = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v.ko === 'string' ? [[p + k, v]] : leaves(v, `${p}${k}.`)));

for (const lang of ['ko', 'en']) {
  test(`the channel ${lang} wording is the approved copy doc`, () => {
    const rows = docRows(lang);
    assert.ok(rows.length >= 50, `parsed ${rows.length} rows`);
    for (const [path, text] of rows) assert.equal(at(path)?.[lang], text, path);
    // Nothing on screen that the doc does not have (units are checked below).
    const inDoc = new Set(rows.map(([p]) => p));
    for (const [path] of leaves(CHANNEL_TEXT)) if (!path.startsWith('unit.')) assert.ok(inDoc.has(path), `${path} is not in the doc`);
  });
}

test('the new units read as the copy docs say', () => {
  assert.deepEqual(CHANNEL_TEXT.unit, {
    hours: { ko: '시간', en: ' h' }, days: { ko: '일', en: ' days' }, chats: { ko: '건', en: ' chats' },
  });
});

test('channel wording follows the content rules', () => {
  const FIGURE = /\d\s*(%|초|분|명|sec|min|people)/;
  const sentences = (s) => (s.match(/[.?!](?=\s|$)/g) || []).length;
  for (const [key, v] of leaves(CHANNEL_TEXT)) {
    for (const lang of ['ko', 'en']) {
      assert.ok(v[lang] !== undefined && !v[lang].includes('진상'), key);
      assert.ok(sentences(v[lang]) <= 3, `${key}.${lang} is too long`);
      // Slider instructions and the fixed half-hour interval are not claims about a center.
      if (!/^tryC\d$/.test(key) && key !== 'tabPractice' && FIGURE.test(v[lang])) assert.ok(/예시|[Ee]xample/.test(v[lang]), `${key}.${lang} has an unlabelled figure`);
    }
    assert.ok(!/[가-힣]/.test(v.en), `${key}.en has Korean`);
  }
  assert.ok(STAFFING_TEXT.countryNote.ko, 'the country note is reused, not copied');
});

test('channel glossary links point at real terms', () => {
  const ids = new Set(TERMS.map((x) => x.id));
  for (const [key, id] of Object.entries(CHANNEL_GLOSSARY)) {
    assert.ok(ids.has(id), `${key} → ${id}`);
    assert.ok(CHANNEL_TEXT.row[key], key);
  }
});

// ---- Task 3: the channel tab ----
import { setupDom } from './dom.js';
import { renderChannels } from '../../staffing-calculator/channels-render.js';

function mountChannels(lang = 'ko', state = initialChannels(), statusDelay = 0) {
  const { root } = setupDom();
  const calls = [];
  const view = renderChannels(root, state, lang, {
    onCommon: (id, v) => calls.push(['common', id, v]),
    onChannel: (kind, id, v) => calls.push(['channel', kind, id, v]),
    onToggle: (kind, on) => calls.push(['toggle', kind, on]),
    onEdit: (kind) => calls.push(['edit', kind]),
    statusDelay,
  });
  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => [...root.querySelectorAll(sel)];
  const cell = (row, col) => $(`[data-cell="${row}.${col}"]`)?.textContent;
  return { root, view, calls, $, $$, cell };
}

test('the channel tab shows the example results', () => {
  const { cell, $$ } = mountChannels();
  assert.deepEqual($$('th[data-col]').map((th) => th.getAttribute('data-col')), ['phone', 'chat', 'email', 'total']);
  const expect = {
    seats: ['18', '11', '6', '35'],
    needed: ['39', '24', '9', '72'],
    current: ['36', '22', '10', '68'],
    diff: ['3명 부족', '2명 부족', '1명 여유', '부족 5명 · 여유 1명'],
    weekly: ['1,543', '943', '336', '2,822'],
    monthly: ['6,686', '4,086', '1,456', '12,228'],
    otWeekly: ['103', '63', '0', '166'],
    otMonthly: ['446', '273', '0', '719'],
    otPerPerson: ['2.9', '2.9', '0', '–'],
  };
  for (const [row, cols] of Object.entries(expect)) {
    ['phone', 'chat', 'email', 'total'].forEach((col, i) => assert.equal(cell(row, col), cols[i], `${row}.${col}`));
  }
});

test('each number row names its unit once, so the table stays narrow', () => {
  const { $ } = mountChannels();
  const head = (row) => $(`tr[data-row="${row}"] th`).textContent;
  assert.equal(head('needed'), '필요 인원 (명)');
  assert.equal(head('weekly'), '주간 근무 시간 (시간)');
  assert.equal(head('diff'), '차이', 'the difference row says its unit in words');
  const en = mountChannels('en');
  assert.equal(en.$('tr[data-row="weekly"] th').textContent, 'Weekly working hours (h)');
  assert.equal(en.$('tr[data-row="needed"] th').textContent, 'Staff needed (people)');
});

test('the sliders show every input of the edited channel, the others stay hidden', () => {
  const { $, $$ } = mountChannels();
  assert.equal($$('input[data-common-input]').length, 3);
  assert.equal($('[data-ch-fields="phone"]').hidden, false);
  assert.equal($('[data-ch-fields="chat"]').hidden, true);
  assert.equal($$('[data-ch-fields="chat"] input[type="range"]').length, 7);
  assert.equal($('[data-ch-edit="phone"]').getAttribute('aria-pressed'), 'true');
  assert.equal($('input[data-ch-input="phone.dailyVolume"]').value, '1600');
  assert.equal($('[data-ch-value="phone.dailyVolume"]').textContent, '1600건');
  assert.equal($('[data-ch-value="chat.concurrency"]').textContent, '2건');
});

test('moving a slider, a toggle or an edit chip reports to the page', () => {
  const { $, calls } = mountChannels();
  const fire = (el, type) => el.dispatchEvent(new el.ownerDocument.defaultView.Event(type, { bubbles: true }));
  const vol = $('input[data-ch-input="phone.dailyVolume"]');
  vol.value = '2000'; fire(vol, 'input');
  const wh = $('input[data-common-input="weeklyHours"]');
  wh.value = '38'; fire(wh, 'input');
  const email = $('input[data-ch-toggle="email"]');
  email.checked = false; fire(email, 'change');
  $('[data-ch-edit="chat"]').click();
  assert.deepEqual(calls, [['channel', 'phone', 'dailyVolume', 2000], ['common', 'weeklyHours', 38], ['toggle', 'email', false], ['edit', 'chat']]);
});

test('the last channel on cannot be turned off', () => {
  const s = initialChannels();
  const { view, $ } = mountChannels('ko', s);
  assert.equal($('input[data-ch-toggle="phone"]').disabled, false);
  s.on.chat = false; s.on.email = false;
  view.update(s);
  assert.equal($('input[data-ch-toggle="phone"]').disabled, true);
  assert.equal($('input[data-ch-toggle="chat"]').disabled, false);
});

test('turning off the edited channel moves editing to one still on', () => {
  const s = initialChannels();
  const { view, $ } = mountChannels('ko', s);
  s.edit = 'chat'; view.update(s);
  assert.equal($('[data-ch-fields="chat"]').hidden, false);
  s.on.chat = false; view.update(s);
  assert.equal($('[data-ch-fields="chat"]').hidden, true);
  assert.equal($('[data-ch-fields="phone"]').hidden, false);
  assert.equal($('[data-ch-edit="phone"]').getAttribute('aria-pressed'), 'true');
  assert.equal($('[data-ch-edit="chat"]').hidden, true, 'an off channel has no edit chip');
});

test('totals follow the visible columns', () => {
  const s = initialChannels();
  const { view, cell, $$ } = mountChannels('ko', s);
  s.on.email = false; view.update(s);
  assert.deepEqual($$('th[data-col]').map((th) => th.getAttribute('data-col')), ['phone', 'chat', 'total']);
  assert.equal(cell('needed', 'total'), '63');
  assert.equal(cell('diff', 'total'), '부족 5명');
  assert.equal(cell('needed', 'email'), undefined);
});

test('zero staff shows noStaff and an all-even total reads exactly enough', () => {
  const s = initialChannels();
  s.phone.current = 0;
  const { view, cell } = mountChannels('ko', s);
  assert.equal(cell('otPerPerson', 'phone'), CHANNEL_TEXT.noStaff.ko);
  assert.equal(cell('diff', 'phone'), '39명 부족');
  s.phone.current = 39; s.chat.current = 24; s.email.current = 9; view.update(s);
  assert.equal(cell('diff', 'total'), STAFFING_TEXT.gapExact.ko);
  s.email.current = 12; view.update(s);
  assert.equal(cell('diff', 'total'), '여유 3명');
});

test('the English channel tab has no Korean', () => {
  const { root, cell } = mountChannels('en');
  assert.ok(!/[가-힣]/.test(root.textContent), root.textContent.match(/[^\n]*[가-힣][^\n]*/)?.[0]);
  assert.equal(cell('weekly', 'phone'), '1,543');
  assert.equal(cell('diff', 'total'), '5 short · 1 to spare');
});

test('channel sliders speak their value with a unit', () => {
  const { $ } = mountChannels();
  assert.equal($('input[data-ch-input="email.hoursOpen"]').getAttribute('aria-valuetext'), '8시간');
  assert.equal($('input[data-common-input="planned"]').getAttribute('aria-valuetext'), '20%');
});

test('one status sentence after the sliders settle', async () => {
  const s = initialChannels();
  const { view, $ } = mountChannels('ko', s, 5);
  assert.equal($('[data-ch-status]').textContent, '', 'nothing for the first draw');
  s.on.email = false; view.update(s);
  await new Promise((r) => setTimeout(r, 20));
  assert.equal($('[data-ch-status]').textContent, '켠 채널 2개 합계: 필요 인원 63명, 주간 2,486시간, 주간 추가근무 166시간입니다.');
});

test('row hints and glossary links sit under the table', () => {
  const { $ } = mountChannels();
  assert.equal($('[data-row-hint="needed"] a').getAttribute('href'), '../glossary/#fte');
  assert.ok($('[data-ch-note]').textContent === CHANNEL_TEXT.otNote.ko);
  assert.ok($('[data-ch-limits]').textContent.includes(CHANNEL_TEXT.channelsLimits.ko));
});

// ---- Task 4: tabs and one shared Shrinkage ----
import { mountLab } from '../../staffing-calculator/lab.js';
import { fakeStorage } from './helpers.js';

function lab(hash = '', lang = 'ko') {
  const { root, document } = setupDom();
  const langRoot = document.createElement('div');
  document.body.append(langRoot);
  const loc = { hash };
  const storage = fakeStorage({ 'agent-lifecycle-course:lang': lang });
  const page = mountLab(root, langRoot, storage, loc);
  const $ = (sel) => root.querySelector(sel);
  const fire = (el, value) => { el.value = String(value); el.dispatchEvent(new window.Event('input', { bubbles: true })); };
  const go = (h) => { loc.hash = h; page.draw(); };
  return { root, document, $, fire, go };
}

test('the practice tab is the default and keeps its own screen', () => {
  const { $, document } = lab();
  assert.equal($('a[data-tab="practice"]').getAttribute('aria-current'), 'page');
  assert.equal($('a[data-tab="channels"]').getAttribute('aria-current'), null);
  assert.equal($('a[data-tab="channels"]').getAttribute('href'), '#channels');
  assert.ok($('[data-result="required"]'), 'the 30-minute practice is shown');
  assert.equal($('[data-ch-table]'), null);
  assert.equal(document.title, STAFFING_TEXT.title.ko);
  assert.equal($('nav[data-tabs]').getAttribute('aria-label'), CHANNEL_TEXT.tabsLabel.ko);
});

test('#channels opens the channel tab', () => {
  const { $, document } = lab('#channels');
  assert.equal($('a[data-tab="channels"]').getAttribute('aria-current'), 'page');
  assert.ok($('[data-ch-table]'));
  assert.equal($('[data-result="required"]'), null);
  assert.equal($('h1').textContent, STAFFING_TEXT.title.ko);
  assert.equal(document.title, `${CHANNEL_TEXT.tabChannels.ko} · ${STAFFING_TEXT.title.ko}`);
});

test('moving Shrinkage in one tab moves it in the other', () => {
  const t = lab();
  t.fire(t.$('input[data-input="unplanned"]'), 15);
  t.go('#channels');
  assert.equal(t.$('input[data-common-input="unplanned"]').value, '15');
  t.fire(t.$('input[data-common-input="planned"]'), 25);
  t.go('');
  assert.equal(t.$('input[data-input="planned"]').value, '25');
  assert.equal(t.$('input[data-input="unplanned"]').value, '15');
});

test('switching tabs keeps every value', () => {
  const t = lab('#channels');
  t.fire(t.$('input[data-ch-input="phone.current"]'), 40);
  t.$('input[data-ch-toggle="email"]').checked = false;
  t.$('input[data-ch-toggle="email"]').dispatchEvent(new window.Event('change', { bubbles: true }));
  t.$('[data-ch-edit="chat"]').click();
  t.go('');
  t.fire(t.$('input[data-input="volume"]'), 150);
  t.go('#channels');
  assert.equal(t.$('input[data-ch-input="phone.current"]').value, '40');
  assert.equal(t.$('input[data-ch-toggle="email"]').checked, false);
  assert.equal(t.$('[data-ch-fields="chat"]').hidden, false);
  t.go('');
  assert.equal(t.$('input[data-input="volume"]').value, '150');
});

test('turning the edited channel off moves the edit to one still on, and the last stays on', () => {
  const t = lab('#channels');
  t.$('[data-ch-edit="email"]').click();
  const off = (k) => { const el = t.$(`input[data-ch-toggle="${k}"]`); el.checked = false; el.dispatchEvent(new window.Event('change', { bubbles: true })); };
  off('email');
  assert.equal(t.$('[data-ch-edit="phone"]').getAttribute('aria-pressed'), 'true');
  off('phone');
  assert.equal(t.$('[data-ch-edit="chat"]').getAttribute('aria-pressed'), 'true');
  off('chat'); // the last one: ignored
  assert.equal(t.$('input[data-ch-toggle="chat"]').checked, true);
  assert.ok(t.$('th[data-col="chat"]'));
});

test('the English lab shows English tabs', () => {
  const { $, root } = lab('#channels', 'en');
  assert.equal($('a[data-tab="practice"]').textContent, CHANNEL_TEXT.tabPractice.en);
  assert.ok(!/[가-힣]/.test(root.textContent));
});

// ---- Final review fix ----
test('needed staff never falls below the seats a part-time channel must fill at once', () => {
  const s = initialChannels();
  s.chat.daysOpen = 2; s.chat.current = 9;
  const chat = computeChannels(s).rows.chat;
  assert.equal(chat.seats, 11);
  assert.equal(chat.needed, Math.ceil(11 / 0.7), 'seats ÷ (1 − Shrinkage)');
  assert.ok(chat.gap < 0, 'a part-time channel short of seats is not "spare"');
  const e = initialChannels();
  e.email.hoursOpen = 4;
  const email = computeChannels(e).rows.email;
  assert.ok(email.needed >= Math.ceil(email.seats / 0.7), `${email.needed} < seats ${email.seats}`);
  // The example values are not changed by this floor.
  assert.deepEqual(Object.values(computeChannels(initialChannels()).rows).map((r) => r.needed), [39, 24, 9]);
});
