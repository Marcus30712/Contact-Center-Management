import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPlayer } from '../js/engine/player.js';

test('player clamps at both ends', () => {
  const p = createPlayer(3);
  p.prev();
  assert.equal(p.index, 0);
  assert.equal(p.atStart, true);
  for (let i = 0; i < 5; i++) p.next();
  assert.equal(p.index, 2);
  assert.equal(p.atEnd, true);
  assert.equal(p.atStart, false);
});

test('player goTo clamps', () => {
  const p = createPlayer(3);
  p.goTo(99);
  assert.equal(p.index, 2);
  p.goTo(-4);
  assert.equal(p.index, 0);
  assert.equal(createPlayer(3, 7).index, 2);
});
