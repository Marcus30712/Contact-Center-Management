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
