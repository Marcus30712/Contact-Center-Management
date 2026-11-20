// First-run tour: wording is the confirmed table, "seen" is remembered under
// one key, and the bubble stays on screen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TOUR_KEY, TOUR_STEPS, TOUR_UI } from '../../shared/tour-data.js';
import { tourSeen, markTourSeen, shouldStartTour, bubbleLeft } from '../../shared/tour.js';
import { fakeStorage, throwingStorage } from './helpers.js';

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-21-first-run-tour-design.md', import.meta.url), 'utf8');
const rows = (header) => {
  const start = DOC.indexOf(header);
  assert.ok(start >= 0, header);
  const out = [];
  for (const line of DOC.slice(start).split('\n').slice(2)) {
    if (!line.startsWith('|')) break;
    out.push(line.slice(1, -1).split(' | ').map((c) => c.trim()));
  }
  return out;
};

test('tour wording is the confirmed table', () => {
  assert.deepEqual(TOUR_STEPS.map((s) => s.id), ['home', 'learn', 'guide', 'browse', 'settings']);
  assert.deepEqual(TOUR_STEPS.map((s) => s.text.ko), rows('| 순서 | 메뉴 | 말풍선 |').map((r) => r[2]));
  assert.deepEqual(TOUR_STEPS.map((s) => s.text.en), rows('| 순서 | 말풍선 |').map((r) => r[1]));
  const words = Object.fromEntries(rows('| 쓰임 | 문구 |'));
  assert.equal(TOUR_UI.skip.ko, words['건너뛰기 버튼']);
  assert.equal(TOUR_UI.next.ko, words['다음 버튼']);
  assert.equal(TOUR_UI.start.ko, words['마지막 버튼']);
  assert.equal(TOUR_UI.replay.ko, words['설정 버튼']);
  assert.deepEqual([TOUR_UI.skip.en, TOUR_UI.next.en, TOUR_UI.start.en, TOUR_UI.replay.en], ['Skip', 'Next', 'Get started', 'Replay the tutorial']);
  for (const v of [...TOUR_STEPS.map((s) => s.text), ...Object.values(TOUR_UI)]) assert.ok(!/[가-힣]/.test(v.en), v.en);
});

test('tourSeen/markTourSeen use queuecraft:tour', () => {
  assert.equal(TOUR_KEY, 'queuecraft:tour');
  const s = fakeStorage();
  assert.equal(tourSeen(s), false);
  markTourSeen(s);
  assert.equal(s.getItem('queuecraft:tour'), 'done');
  assert.equal(tourSeen(s), true);
});

test('tourSeen/markTourSeen survive blocked storage', () => {
  for (const s of [throwingStorage, null]) {
    assert.equal(tourSeen(s), false);
    assert.doesNotThrow(() => markTourSeen(s));
  }
});

test('shouldStartTour: not seen yet, or asked for again with tour=1', () => {
  assert.equal(shouldStartTour(fakeStorage(), 'https://x/'), true);
  // Storage that can't remember would show the tour on every visit: only on request then.
  assert.equal(shouldStartTour(throwingStorage, 'https://x/'), false);
  assert.equal(shouldStartTour(null, 'https://x/'), false);
  assert.equal(shouldStartTour(throwingStorage, 'https://x/?tour=1'), true);
  const seen = fakeStorage({ 'queuecraft:tour': 'done' });
  assert.equal(shouldStartTour(seen, 'https://x/'), false);
  assert.equal(shouldStartTour(seen, 'https://x/?tour=1'), true);
});

test('bubbleLeft keeps the bubble on screen', () => {
  assert.equal(bubbleLeft(30, 280, 320), 12);
  assert.equal(bubbleLeft(300, 280, 320), 28);
  assert.equal(bubbleLeft(640, 280, 1280), 500);
});

// ---- The tour on screen ----
import { setupDom, click } from './dom.js';
import { renderAppBar, APPBAR_UI } from '../../shared/appbar.js';
import { startTour, whenAppBar } from '../../shared/tour.js';

const ROOT = 'https://x.test/kb/';
function page(lang = 'ko') {
  const { document } = setupDom();
  const before = document.createElement('button');
  before.textContent = 'before';
  document.body.append(before, renderAppBar(document, ROOT, ROOT, lang));
  before.focus();
  return { document, before };
}
const q = (sel) => document.querySelector(sel);
const lit = () => q('nav.appbar a.tour-lit')?.dataset.item;
const press = (target, name, shiftKey = false) => target.dispatchEvent(new window.KeyboardEvent('keydown', { key: name, shiftKey, bubbles: true }));

test('the tour opens on Home with the first line', () => {
  page();
  startTour(document, 'ko', fakeStorage());
  assert.ok(q('[data-tour] [role="dialog"][aria-modal="true"]'));
  assert.equal(q('[data-tour-count]').textContent, '1/5');
  assert.equal(q('[data-tour-text]').textContent, TOUR_STEPS[0].text.ko);
  assert.equal(lit(), 'home');
  assert.ok(q('nav.appbar').classList.contains('tour-on'));
  assert.equal(q('[role="dialog"]').getAttribute('aria-label'), APPBAR_UI.home.ko);
  assert.ok(q('[role="dialog"]').contains(document.activeElement));
});

test('Next walks the five items in order and the last button says 시작하기', () => {
  page();
  startTour(document, 'ko', fakeStorage());
  const seen = [lit()];
  for (let i = 0; i < 4; i += 1) { click(q('[data-tour-next]')); seen.push(lit()); }
  assert.deepEqual(seen, ['home', 'learn', 'guide', 'browse', 'settings']);
  assert.equal(q('[data-tour-count]').textContent, '5/5');
  assert.equal(q('[data-tour-next]').textContent, '시작하기');
  assert.equal(q('[data-tour-text]').textContent, TOUR_STEPS[4].text.ko);
});

test('Skip, Get started and Esc all close and remember', () => {
  for (const how of ['skip', 'start', 'esc']) {
    const { before } = page();
    const s = fakeStorage();
    let closed = 0;
    startTour(document, 'ko', s, { onClose: () => { closed += 1; } });
    if (how === 'skip') click(q('[data-tour-skip]'));
    if (how === 'start') for (let i = 0; i < 5; i += 1) click(q('[data-tour-next]'));
    if (how === 'esc') press(document.activeElement, 'Escape');
    assert.equal(q('[data-tour]'), null, how);
    assert.ok(!q('nav.appbar').classList.contains('tour-on'), how);
    assert.equal(lit(), undefined, how);
    assert.equal(s.getItem('queuecraft:tour'), 'done', how);
    assert.equal(closed, 1, how);
    assert.equal(document.activeElement, before, how);
  }
});

test('Tab stays inside the bubble', () => {
  page();
  startTour(document, 'ko', fakeStorage());
  const skip = q('[data-tour-skip]');
  const next = q('[data-tour-next]');
  next.focus();
  press(next, 'Tab');
  assert.equal(document.activeElement, skip);
  press(skip, 'Tab', true);
  assert.equal(document.activeElement, next);
});

test('English tour reads in English', () => {
  page('en');
  startTour(document, 'en', fakeStorage());
  assert.equal(q('[data-tour-skip]').textContent, 'Skip');
  assert.equal(q('[data-tour-next]').textContent, 'Next');
  assert.equal(q('[data-tour-text]').textContent, TOUR_STEPS[0].text.en);
  assert.equal(q('[role="dialog"]').getAttribute('aria-label'), 'Home');
});

test('closing works with blocked storage', () => {
  page();
  startTour(document, 'ko', throwingStorage);
  assert.doesNotThrow(() => click(q('[data-tour-skip]')));
  assert.equal(q('[data-tour]'), null);
});

test('a second start while open does not open another tour', () => {
  page();
  startTour(document, 'ko', fakeStorage());
  startTour(document, 'ko', fakeStorage());
  assert.equal(document.querySelectorAll('[data-tour]').length, 1);
});

test('whenAppBar waits for the menu', async () => {
  const { document } = setupDom();
  let got = null;
  const wait = whenAppBar(document).then((nav) => { got = nav; });
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(got, null);
  const nav = renderAppBar(document, ROOT, ROOT, 'ko');
  document.body.append(nav);
  await wait;
  assert.equal(got, nav);
});

test('Esc closes even when focus has left the bubble, and the menu cannot take focus meanwhile', () => {
  const { before } = page();
  const s = fakeStorage();
  startTour(document, 'ko', s);
  assert.ok(q('nav.appbar').hasAttribute('inert'));
  before.focus();
  press(before, 'Escape');
  assert.equal(q('[data-tour]'), null);
  assert.ok(!q('nav.appbar').hasAttribute('inert'));
  assert.equal(s.getItem('queuecraft:tour'), 'done');
  assert.equal(document.activeElement, before);
});

test('Tab from outside the bubble comes back into it', () => {
  const { before } = page();
  startTour(document, 'ko', fakeStorage());
  before.focus();
  assert.equal(document.activeElement, before);
  press(before, 'Tab');
  assert.ok(q('[role="dialog"]').contains(document.activeElement));
});

test('the bubble line describes the dialog for screen readers', () => {
  page();
  startTour(document, 'ko', fakeStorage());
  const id = q('[role="dialog"]').getAttribute('aria-describedby');
  assert.ok(id);
  assert.equal(document.getElementById(id), q('[data-tour-text]'));
});
