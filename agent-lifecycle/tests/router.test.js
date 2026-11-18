import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, lessonHref, HOME_HREF } from '../js/engine/router.js';

const ids = ['hiring', 'career'];

test('parseRoute sends empty and unknown hashes home', () => {
  for (const h of ['', '#', '#home', '#foo', '#nope-1', '#/lesson/hiring/2']) {
    assert.deepEqual(parseRoute(h, ids), { view: 'home' }, h);
  }
});

test('parseRoute reads lesson id and step', () => {
  assert.deepEqual(parseRoute('#hiring', ids), { view: 'lesson', id: 'hiring', step: 0 });
  assert.deepEqual(parseRoute('#hiring-4', ids), { view: 'lesson', id: 'hiring', step: 4 });
});

test('parseRoute turns bad step into 0', () => {
  assert.deepEqual(parseRoute('#hiring-abc', ids), { view: 'lesson', id: 'hiring', step: 0 });
  assert.deepEqual(parseRoute('#hiring--2', ids), { view: 'lesson', id: 'hiring', step: 0 });
});

test('lessonHref builds a plain hash name', () => {
  assert.equal(lessonHref('career', 3), '#career-3');
  assert.equal(lessonHref('career'), '#career-0');
  assert.match(lessonHref('career', 3), /^#[a-z0-9-]+$/);
  assert.equal(HOME_HREF, '#home');
});
