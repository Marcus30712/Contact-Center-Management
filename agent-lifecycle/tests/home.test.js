import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { setupDom } from './dom.js';
import { fakeStorage, throwingStorage } from './helpers.js';
import { HOME_UI, LEARN, BROWSE, GUIDE_CARD } from '../../home/data.js';
import { myLearning, renderHome } from '../../home/render.js';

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-20-app-shell-design.md', import.meta.url), 'utf8');
const quoted = (label) => DOC.match(new RegExp(`^- ${label}: "(.+)"`, 'm'))[1];

test('home wording is the approved wording', () => {
  assert.equal(HOME_UI.greeting.ko, quoted('첫 화면 인사'));
  assert.equal(HOME_UI.misoRole.ko, quoted('미소 소개\\(인사 아래 작은 글씨\\)'));
  assert.equal(HOME_UI.install.ko, quoted('설치 안내'));
  assert.equal(HOME_UI.myLearning.ko, '내 학습');
  assert.equal(HOME_UI.continue.ko, '이어서:');
  assert.equal(HOME_UI.start.ko, '처음이라면 라이프사이클 레슨 1부터 시작해 보세요.');
  assert.equal(HOME_UI.allDone.ko, '다 마쳤어요. 필요한 레슨은 언제든 다시 볼 수 있어요.');
  assert.deepEqual([HOME_UI.learn.ko, HOME_UI.browse.ko], ['배우기', '찾아보기']);
  for (const v of Object.values(HOME_UI)) assert.ok(v.ko && v.en && !/[가-힣]/.test(v.en), v.ko);
});

test('cards keep every topic and are split into learn and browse', () => {
  assert.deepEqual(LEARN.map((c) => c.href), ['./agent-lifecycle/', './sop-library/']);
  assert.deepEqual(BROWSE.map((c) => c.href), ['./codex/', './staffing-calculator/', './glossary/', './references/']);
  assert.equal(GUIDE_CARD.href, './guide/');
  for (const c of [GUIDE_CARD, ...LEARN, ...BROWSE]) {
    assert.ok(c.title.ko && c.title.en && c.text.ko && c.text.en, c.href);
    assert.ok(!/[가-힣]/.test(c.title.en + c.text.en), c.href);
  }
});

test('my learning: nothing started, part done, all done, storage blocked', () => {
  const s = fakeStorage();
  const fresh = myLearning(s);
  assert.deepEqual(fresh.map((c) => [c.id, c.done, c.total, c.next.id]), [['lifecycle', 0, 6, 'hiring'], ['sop', 0, 7, 'escalation']]);
  assert.equal(fresh.started, false);

  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'coaching'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation'] }));
  const mid = myLearning(s);
  assert.deepEqual(mid.map((c) => [c.done, c.next.id, c.next.href]), [[3, 'nesting', './agent-lifecycle/#nesting-0'], [1, 'coaching', './sop-library/#coaching-0']]);
  assert.equal(mid.started, true);

  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation', 'coaching', 'pip', 'calibration', 'onboarding', 'incident', 'launch'] }));
  const all = myLearning(s);
  assert.deepEqual(all.map((c) => [c.done, c.next]), [[6, null], [7, null]]);
  assert.equal(all.allDone, true);

  const blocked = myLearning(throwingStorage);
  assert.deepEqual(blocked.map((c) => c.done), [0, 0]);
  assert.deepEqual(myLearning(null).map((c) => c.done), [0, 0]);
});

test('the home screen greets with Miso and shows where to continue', () => {
  const { root } = setupDom();
  const s = fakeStorage();
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation'] }));
  renderHome(root, 'ko', s);
  const miso = root.querySelector('img[data-miso]');
  assert.equal(miso.getAttribute('src'), './assets/miso/grin.webp');
  assert.ok(miso.getAttribute('alt').includes('김미소'));
  assert.ok(root.querySelector('[data-greeting]').textContent.includes(HOME_UI.greeting.ko));
  const rows = [...root.querySelectorAll('[data-course]')];
  assert.equal(rows.length, 2);
  assert.equal(rows[1].querySelector('progress').value, 1);
  assert.equal(rows[1].querySelector('progress').max, 7);
  assert.equal(rows[1].querySelector('a[data-next]').getAttribute('href'), './sop-library/#coaching-0');
  assert.ok(rows[1].textContent.includes('1/7'));
  assert.equal(root.querySelector('a.card[href="./guide/"]').closest('section')?.id ?? '', '');
  assert.ok(root.querySelector('#learn') && root.querySelector('#browse'));
  assert.equal(root.querySelectorAll('a.card').length, 7);
  assert.ok(root.querySelector('[data-install]').textContent.includes('홈 화면'));
});

test('a first visit suggests lesson 1, and a finished learner sees the done note', () => {
  const first = setupDom();
  renderHome(first.root, 'ko', fakeStorage());
  assert.ok(first.root.querySelector('[data-start]').textContent.includes(HOME_UI.start.ko));
  assert.equal(first.root.querySelector('[data-start] a').getAttribute('href'), './agent-lifecycle/#hiring-0');
  assert.equal(first.root.querySelectorAll('[data-course]').length, 0, 'the start note replaces my learning on a first visit');

  const s = fakeStorage();
  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'] }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: ['escalation', 'coaching', 'pip', 'calibration', 'onboarding', 'incident', 'launch'] }));
  const done = setupDom();
  renderHome(done.root, 'ko', s);
  assert.ok(done.root.querySelector('[data-all-done]').textContent.includes(HOME_UI.allDone.ko));
  assert.equal(HOME_UI.review.ko, '다시 보기');
  const reviews = [...done.root.querySelectorAll('a[data-review]')];
  assert.deepEqual(reviews.map((a) => a.getAttribute('href')), ['./agent-lifecycle/', './sop-library/']);
  assert.ok(reviews.every((a) => a.textContent.includes('다시 보기')));
});

test('the English home screen has no Korean', () => {
  const { root } = setupDom();
  renderHome(root, 'en', fakeStorage());
  assert.ok(!/[가-힣]/.test(root.textContent + [...root.querySelectorAll('img')].map((i) => i.alt).join('')));
});

test('Miso images and app icons exist', () => {
  const names = ['smile', 'joy', 'sparkle', 'think', 'surprise', 'worry', 'grin', 'proud', 'ponder', 'nervous', 'cheer', 'wink', 'profile'];
  for (const n of names) assert.ok(existsSync(new URL(`../../assets/miso/${n}.webp`, import.meta.url)), n);
  for (const f of ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png']) {
    assert.ok(existsSync(new URL(`../../icons/${f}`, import.meta.url)), f);
  }
});
