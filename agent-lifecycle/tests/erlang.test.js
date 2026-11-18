import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trafficIntensity, waitingProbability, serviceLevel, occupancy, averageWait, requiredPositions,
} from '../../staffing-calculator/erlang.js';

// Reference values come from running pyworkforce 0.5.4 (ErlangC) directly.
const close = (a, b, eps = 5e-7) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);
const CASES = [
  // positions, intensity, aht, target (min), service level, waiting probability, occupancy
  [11, 10, 3, 20 / 60, 0.389614, 0.682118, 0.909091],
  [12, 10, 3, 20 / 60, 0.640158, 0.449388, 0.833333],
  [14, 10, 3, 20 / 60, 0.888350, 0.174132, 0.714286],
  [24, 20, 5, 20 / 60, 0.771698, 0.298072, 0.833333],
  [16, 12, 6, 30 / 60, 0.853416, 0.204574, 0.750000],
];

test('traffic intensity is volume per minute times handle time', () => {
  assert.equal(trafficIntensity(100, 3), 10);
  assert.equal(trafficIntensity(120, 5), 20);
  assert.equal(trafficIntensity(60, 6), 12);
});

test('service level matches pyworkforce', () => {
  for (const [n, a, aht, target, sl] of CASES) close(serviceLevel(n, a, aht, target), sl);
});

test('waiting probability matches pyworkforce', () => {
  for (const [n, a, , , , pw] of CASES) close(waitingProbability(n, a), pw);
});

test('occupancy matches pyworkforce', () => {
  for (const [n, a, , , , , occ] of CASES) close(occupancy(n, a), occ);
});

test('required positions match pyworkforce', () => {
  assert.deepEqual(requiredPositions(10, 3, 20 / 60, { shrinkage: 0.3 }), { raw: 14, positions: 20 });
  assert.deepEqual(requiredPositions(20, 5, 20 / 60, { shrinkage: 0.25 }), { raw: 25, positions: 34 });
  assert.deepEqual(requiredPositions(12, 6, 30 / 60, { shrinkage: 0.2 }), { raw: 16, positions: 20 });
  assert.deepEqual(requiredPositions(1.5, 1.5, 2), { raw: 3, positions: 3 });
});

test('too few positions for the traffic is a range error', () => {
  assert.throws(() => waitingProbability(10, 10), RangeError);
  assert.throws(() => waitingProbability(0, 5), RangeError);
});

test('average wait is the waiting probability spread over the spare capacity', () => {
  close(averageWait(14, 10, 3), 0.174132 * 3 / 4, 1e-5);
});

test('service level never drops below zero', () => {
  assert.ok(serviceLevel(11, 10.999, 3, 0) >= 0);
});
