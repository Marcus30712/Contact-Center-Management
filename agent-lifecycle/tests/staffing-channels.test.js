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
