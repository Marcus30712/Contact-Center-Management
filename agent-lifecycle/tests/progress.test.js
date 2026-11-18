import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROGRESS_KEY, loadProgress, markComplete } from '../js/engine/progress.js';
import { fakeStorage, throwingStorage } from './helpers.js';

test('markComplete round-trips without duplicates', () => {
  const s = fakeStorage();
  markComplete(s, 'hiring');
  markComplete(s, 'hiring');
  assert.deepEqual(loadProgress(s), { completed: ['hiring'] });
});

test('loadProgress returns empty progress when storage is unusable', () => {
  assert.deepEqual(loadProgress(null), { completed: [] });
  assert.deepEqual(loadProgress(throwingStorage), { completed: [] });
  assert.deepEqual(loadProgress(fakeStorage({ [PROGRESS_KEY]: '{broken' })), { completed: [] });
  assert.deepEqual(loadProgress(fakeStorage({ [PROGRESS_KEY]: '{"completed":"x"}' })), { completed: [] });
});

test('markComplete survives a storage that throws on write', () => {
  const s = { getItem: () => null, setItem() { throw new Error('quota'); } };
  assert.deepEqual(markComplete(s, 'hiring'), { completed: ['hiring'] });
  assert.deepEqual(markComplete(null, 'hiring'), { completed: ['hiring'] });
});
