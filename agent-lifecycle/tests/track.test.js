import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRACKS, TRACK_KEY, loadTrack, saveTrack, visibleSteps, visibleQuestions, switchIndex } from '../js/engine/track.js';
import { fakeStorage, throwingStorage } from './helpers.js';

const s = (id, track) => (track ? { id, track } : { id });
const lesson = {
  steps: [s('c0'), s('g1', 'general'), s('t1', 'tech'), s('c1'), s('t2', 'tech'), s('c2')],
  checkpoint: [s('q1'), s('qg', 'general'), s('qt', 'tech')],
};
const ids = (list) => list.map((x) => x.id);

test('visibleSteps keeps common steps plus the chosen track, in order', () => {
  assert.deepEqual(ids(visibleSteps(lesson, 'general')), ['c0', 'g1', 'c1', 'c2']);
  assert.deepEqual(ids(visibleSteps(lesson, 'tech')), ['c0', 't1', 'c1', 't2', 'c2']);
});

test('a lesson without track fields shows everything on both tracks', () => {
  const plain = { steps: [s('a'), s('b')], checkpoint: [s('q')] };
  for (const track of TRACKS) {
    assert.deepEqual(ids(visibleSteps(plain, track)), ['a', 'b']);
    assert.deepEqual(ids(visibleQuestions(plain, track)), ['q']);
  }
});

test('visibleQuestions follows the same rule', () => {
  assert.deepEqual(ids(visibleQuestions(lesson, 'general')), ['q1', 'qg']);
  assert.deepEqual(ids(visibleQuestions(lesson, 'tech')), ['q1', 'qt']);
});

test('switchIndex lands on the same common step, or the nearest earlier one', () => {
  assert.equal(switchIndex(lesson, 'general', 0, 'tech'), 0);
  assert.equal(switchIndex(lesson, 'general', 1, 'tech'), 0); // g1 -> c0
  assert.equal(switchIndex(lesson, 'general', 2, 'tech'), 2); // c1
  assert.equal(switchIndex(lesson, 'tech', 3, 'general'), 2); // t2 -> c1
  assert.equal(switchIndex(lesson, 'tech', 4, 'general'), 3); // c2
});

test('switchIndex clamps out-of-range input and keeps the index on the same track', () => {
  assert.equal(switchIndex(lesson, 'tech', 99, 'general'), 3);
  assert.equal(switchIndex(lesson, 'tech', -5, 'general'), 0);
  assert.equal(switchIndex(lesson, 'general', 1, 'general'), 1);
});

test('switchIndex returns 0 when no common step comes before', () => {
  const l = { steps: [s('t0', 'tech'), s('c0')], checkpoint: [] };
  assert.equal(switchIndex(l, 'tech', 0, 'general'), 0);
});

test('loadTrack defaults to general unless a valid track is saved', () => {
  assert.equal(loadTrack(fakeStorage({ [TRACK_KEY]: 'tech' })), 'tech');
  assert.equal(loadTrack(fakeStorage()), 'general');
  assert.equal(loadTrack(fakeStorage({ [TRACK_KEY]: 'x' })), 'general');
  assert.equal(loadTrack(throwingStorage), 'general');
  assert.equal(loadTrack(null), 'general');
});

test('saveTrack stores the choice and never throws', () => {
  const st = fakeStorage();
  saveTrack(st, 'tech');
  assert.equal(loadTrack(st), 'tech');
  assert.doesNotThrow(() => saveTrack(throwingStorage, 'tech'));
  assert.doesNotThrow(() => saveTrack(null, 'tech'));
});
