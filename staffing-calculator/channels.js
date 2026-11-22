// Channel comparison: turns each channel's daily numbers into the staff and
// hours a week (and month) needs, with one Shrinkage for the whole center.
// No DOM here. Formulas: docs/superpowers/specs/2026-11-21-staffing-channels-design.md §4.
import { trafficIntensity, requiredPositions } from './erlang.js';
import { INPUTS, INTERVAL_MINUTES, TARGET_SERVICE_LEVEL } from './model.js';

export const CHANNELS = ['phone', 'chat', 'email'];
export const EMAIL_OCCUPANCY = 0.85; // example value, fixed
export const WEEKS_PER_MONTH = 52 / 12;

const shared = (id) => ({ ...INPUTS.find((i) => i.id === id) });
export const COMMON_INPUTS = [
  shared('planned'),
  shared('unplanned'),
  { id: 'weeklyHours', min: 20, max: 60, step: 1, initial: 40, unit: 'hours' },
];

// Screen order. `initial` values are examples for practice, not benchmarks.
const open = (hours, days) => [
  { id: 'hoursOpen', min: 1, max: 24, step: 1, initial: hours, unit: 'hours' },
  { id: 'daysOpen', min: 1, max: 7, step: 1, initial: days, unit: 'days' },
];
const current = (n) => ({ id: 'current', min: 0, max: 200, step: 1, initial: n, unit: 'people' });
export const CHANNEL_INPUTS = {
  phone: [
    { id: 'dailyVolume', min: 100, max: 5000, step: 50, initial: 1600, unit: 'count' },
    { id: 'aht', min: 1, max: 15, step: 0.5, initial: 5, unit: 'min' },
    { id: 'target', min: 10, max: 120, step: 5, initial: 20, unit: 'sec' },
    ...open(10, 6),
    current(36),
  ],
  chat: [
    { id: 'dailyVolume', min: 50, max: 3000, step: 50, initial: 800, unit: 'count' },
    { id: 'aht', min: 2, max: 30, step: 1, initial: 12, unit: 'min' },
    { id: 'concurrency', min: 1, max: 4, step: 1, initial: 2, unit: 'chats' },
    { id: 'target', min: 10, max: 300, step: 10, initial: 60, unit: 'sec' },
    ...open(10, 6),
    current(22),
  ],
  email: [
    { id: 'dailyVolume', min: 10, max: 2000, step: 10, initial: 300, unit: 'count' },
    { id: 'aht', min: 1, max: 30, step: 1, initial: 8, unit: 'min' },
    ...open(8, 5),
    current(10),
  ],
};

const initial = (inputs) => Object.fromEntries(inputs.map((i) => [i.id, i.initial]));

export function initialChannels() {
  return {
    common: initial(COMMON_INPUTS),
    on: Object.fromEntries(CHANNELS.map((k) => [k, true])),
    edit: CHANNELS[0],
    ...Object.fromEntries(CHANNELS.map((k) => [k, initial(CHANNEL_INPUTS[k])])),
  };
}

// Desk hours one day needs, and the agents at their desks at the same time.
function deskDay(kind, v) {
  if (kind === 'email') {
    const hours = (v.dailyVolume * v.aht) / 60 / EMAIL_OCCUPANCY;
    return { seats: Math.ceil(hours / v.hoursOpen), hours };
  }
  // Chat: one agent on several chats is treated as a shorter handle time (an approximation).
  const aht = kind === 'chat' ? v.aht / v.concurrency : v.aht;
  const perInterval = v.dailyVolume / ((v.hoursOpen * 60) / INTERVAL_MINUTES);
  const intensity = trafficIntensity(perInterval, aht, INTERVAL_MINUTES);
  const { raw } = requiredPositions(intensity, aht, v.target / 60, { serviceLevel: TARGET_SERVICE_LEVEL });
  return { seats: raw, hours: raw * v.hoursOpen };
}

export function computeChannel(kind, v, common) {
  const keep = 1 - (common.planned + common.unplanned) / 100;
  const { seats, hours } = deskDay(kind, v);
  const exactWeekly = (hours * v.daysOpen) / keep;
  // Any work at all shows as at least one hour, never as 0 beside a needed person.
  const weekly = exactWeekly > 0 ? Math.max(1, Math.round(exactWeekly)) : 0;
  // A channel open only a few hours or days still needs enough people to fill
  // its seats at once: never fewer than seats ÷ (1 − Shrinkage).
  const byHours = Math.ceil(exactWeekly / common.weeklyHours - 1e-9);
  const bySeats = Math.ceil(seats / keep - 1e-9);
  const needed = Math.max(byHours, bySeats);
  const otWeekly = Math.max(0, weekly - v.current * common.weeklyHours);
  return {
    seats,
    needed,
    current: v.current,
    gap: v.current - needed,
    weekly,
    monthly: Math.round(weekly * WEEKS_PER_MONTH),
    otWeekly,
    otMonthly: Math.round(otWeekly * WEEKS_PER_MONTH),
    otPerPerson: v.current === 0 ? null : Math.round((otWeekly / v.current) * 10) / 10,
    // The seats, not the hours, set the staff needed: hours and overtime understate it.
    seatBound: bySeats > byHours,
  };
}

export function computeChannels(state) {
  const rows = {};
  for (const kind of CHANNELS) if (state.on[kind]) rows[kind] = computeChannel(kind, state[kind], state.common);
  const list = Object.values(rows);
  const sum = (f) => list.reduce((n, r) => n + f(r), 0);
  return {
    rows,
    total: {
      seats: sum((r) => r.seats),
      needed: sum((r) => r.needed),
      current: sum((r) => r.current),
      short: sum((r) => Math.max(0, -r.gap)),
      spare: sum((r) => Math.max(0, r.gap)),
      weekly: sum((r) => r.weekly),
      monthly: sum((r) => r.monthly),
      otWeekly: sum((r) => r.otWeekly),
      otMonthly: sum((r) => r.otMonthly),
    },
  };
}
