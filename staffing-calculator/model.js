// Turns the six slider values into what the screen shows. No DOM here, so the
// same module can feed a different screen later.
import {
  trafficIntensity, serviceLevel, occupancy, averageWait, requiredPositions,
} from './erlang.js';

export const INTERVAL_MINUTES = 30;
export const TARGET_SERVICE_LEVEL = 0.8; // shown as an example target

// Screen order. `initial` values are examples for practice, not benchmarks.
export const INPUTS = [
  { id: 'volume', min: 10, max: 300, step: 5, initial: 100, unit: 'count' },
  { id: 'aht', min: 1, max: 15, step: 0.5, initial: 3, unit: 'min' },
  { id: 'rostered', min: 1, max: 80, step: 1, initial: 20, unit: 'people' },
  { id: 'planned', min: 0, max: 40, step: 1, initial: 20, unit: 'percent' },
  { id: 'unplanned', min: 0, max: 30, step: 1, initial: 10, unit: 'percent' },
  { id: 'target', min: 10, max: 120, step: 5, initial: 20, unit: 'sec' },
];

export function initialValues() {
  return Object.fromEntries(INPUTS.map((i) => [i.id, i.initial]));
}

export function compute({ volume, aht, rostered, planned, unplanned, target }) {
  // Whole-number percentages keep the headcount sums exact.
  const keep = 100 - planned - unplanned;
  const seated = Math.floor((rostered * keep) / 100);
  const awayTotal = rostered - seated;
  const awayPlanned = planned + unplanned === 0 ? 0 : Math.round((awayTotal * planned) / (planned + unplanned));
  const away = { planned: awayPlanned, unplanned: awayTotal - awayPlanned };

  const intensity = trafficIntensity(volume, aht, INTERVAL_MINUTES);
  const targetMinutes = target / 60;
  const { raw } = requiredPositions(intensity, aht, targetMinutes, { serviceLevel: TARGET_SERVICE_LEVEL });
  const required = { seated: raw, rostered: Math.ceil((raw * 100) / keep) };
  const gap = rostered - required.rostered;

  // With no spare capacity the queue only grows; Erlang C has no answer.
  if (seated <= intensity + 1e-9) {
    return { seated, away, overloaded: true, serviceLevel: null, serviceLevelPercent: null, waitSeconds: null, occupancy: null, busy: seated, required, gap };
  }
  const occ = occupancy(seated, intensity);
  const sl = serviceLevel(seated, intensity, aht, targetMinutes);
  // Whole percent for display. A value just under the target must not round
  // up to it, or the screen would show the target met next to "short".
  const targetPercent = Math.round(TARGET_SERVICE_LEVEL * 100);
  const rounded = Math.round(sl * 100);
  const serviceLevelPercent = sl < TARGET_SERVICE_LEVEL && rounded >= targetPercent ? targetPercent - 1 : rounded;
  return {
    seated,
    away,
    overloaded: false,
    serviceLevel: sl,
    serviceLevelPercent,
    waitSeconds: Math.round(averageWait(seated, intensity, aht) * 60),
    occupancy: occ,
    busy: Math.min(seated, Math.round(seated * occ)),
    required,
    gap,
  };
}
