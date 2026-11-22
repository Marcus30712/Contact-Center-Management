// Start screen (2026-11-22): Miso greets by time of day and weekday, once per visit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { START_UI, GREETINGS } from '../../home/start-data.js';
import { greetingGroup, pickGreeting, shouldShowStart, watchOffline } from '../../home/start.js';

const spec = (f) => readFileSync(new URL(`../../docs/superpowers/specs/${f}`, import.meta.url), 'utf8');
const KO = spec('2026-11-22-start-screen-design.md');
const EN = spec('2026-11-22-start-screen-copy.en.md');

// Rows of the first markdown table after `header`.
function table(doc, header) {
  const start = doc.indexOf(header);
  assert.ok(start >= 0, header);
  const out = [];
  let begun = false;
  for (const line of doc.slice(start).split('\n').slice(1)) {
    if (!line.startsWith('|')) { if (begun) break; continue; }
    begun = true;
    out.push(line.slice(1, -1).split('|').map((c) => c.trim()));
  }
  return out.slice(2);
}
const GROUP_OF = [
  [/^새벽|^Small hours/, 'smallHours'], [/^아침|^Morning/, 'morning'], [/^점심|^Lunch/, 'lunch'],
  [/^오후|^Afternoon/, 'afternoon'], [/^저녁|^Evening/, 'evening'], [/^밤|^Night/, 'night'],
  [/^월요일|^Monday/, 'monday'], [/^금요일|^Friday/, 'friday'], [/^주말|^Weekend/, 'weekend'],
];
function greetingRows(doc, header) {
  const groups = {};
  for (const [label, face, line] of table(doc, header)) {
    const id = GROUP_OF.find(([re]) => re.test(label))[1];
    groups[id] ??= { face: null, lines: [] };
    if (face) groups[id].face = face;
    groups[id].lines.push(line);
  }
  return groups;
}

test('screen words are the approved copy in both languages', () => {
  const ko = Object.fromEntries(table(KO, '**화면 문구**'));
  const en = Object.fromEntries(table(EN, '**Screen text**'));
  const pairs = {
    logo: ['로고', 'Logo'], tagline: ['한 줄 소개', 'Tagline'], start: ['버튼', 'Button'],
    offlineWait: ['오프라인 준비 중', 'Offline getting ready'], offlineReady: ['오프라인 준비 완료', 'Offline ready'],
    dialog: ['대화상자 이름 (화면 낭독기)', 'Dialog name (screen readers)'], misoAlt: ['미소 그림 설명', 'Miso picture'],
  };
  assert.deepEqual(Object.keys(START_UI).sort(), Object.keys(pairs).sort());
  for (const [key, [k, e]] of Object.entries(pairs)) assert.deepEqual(START_UI[key], { ko: ko[k], en: en[e] }, key);
});

test('greetings are the approved copy, with one Miso face per group', () => {
  const ko = greetingRows(KO, '**인사**');
  const en = greetingRows(EN, '**Greetings**');
  assert.deepEqual(Object.keys(GREETINGS).sort(), Object.keys(ko).sort());
  for (const [id, g] of Object.entries(GREETINGS)) {
    assert.equal(g.face, ko[id].face, id);
    assert.equal(g.face, en[id].face, id);
    assert.deepEqual(g.lines, ko[id].lines.map((k, i) => ({ ko: k, en: en[id].lines[i] })), id);
    assert.ok(existsSync(new URL(`../../assets/miso/${g.face}.webp`, import.meta.url)), g.face);
  }
});

test('greeting wording follows the content rules', () => {
  const sentences = (s) => (s.match(/[.?!…](?=\s|$)/g) || []).length;
  const all = [...Object.values(START_UI), ...Object.values(GREETINGS).flatMap((g) => g.lines)];
  for (const v of all) {
    assert.ok(!v.ko.includes('진상'), v.ko);
    assert.ok(sentences(v.ko) <= 3 && sentences(v.en) <= 3, v.ko);
    assert.ok(sentences(v.en) <= Math.max(1, sentences(v.ko)), v.en);
    assert.ok(!/[가-힣]/.test(v.en), v.en);
    assert.ok(!/\d/.test(v.ko), `no figures: ${v.ko}`);
  }
});

// 2026-11-23 is a Monday; local time.
const at = (day, h, m = 0) => new Date(2026, 10, 23 + day, h, m);
const MON = 0, TUE = 1, FRI = 4, SAT = 5, SUN = 6;

test('pickGreeting boundaries: time slots, then weekdays first', () => {
  const cases = [
    [TUE, 0, 0, 'smallHours'], [TUE, 4, 59, 'smallHours'], [TUE, 5, 0, 'morning'], [TUE, 10, 59, 'morning'],
    [TUE, 11, 0, 'lunch'], [TUE, 13, 59, 'lunch'], [TUE, 14, 0, 'afternoon'], [TUE, 17, 59, 'afternoon'],
    [TUE, 18, 0, 'evening'], [TUE, 21, 59, 'evening'], [TUE, 22, 0, 'night'], [TUE, 23, 59, 'night'],
    [MON, 4, 59, 'smallHours'], [MON, 5, 0, 'monday'], [MON, 10, 59, 'monday'], [MON, 11, 0, 'lunch'],
    [FRI, 13, 59, 'lunch'], [FRI, 14, 0, 'friday'], [FRI, 21, 59, 'friday'], [FRI, 22, 0, 'night'],
    [SAT, 4, 59, 'smallHours'], [SAT, 5, 0, 'weekend'], [SAT, 21, 59, 'weekend'], [SAT, 22, 0, 'night'],
    [SUN, 12, 0, 'weekend'], [SUN, 23, 0, 'night'],
  ];
  for (const [d, h, m, group] of cases) assert.equal(greetingGroup(at(d, h, m)), group, `${d} ${h}:${m}`);
});

test('pickGreeting picks a line within the group and gives its face', () => {
  const g = GREETINGS.morning;
  assert.deepEqual(pickGreeting(at(TUE, 8), () => 0), { group: 'morning', face: g.face, line: g.lines[0] });
  assert.deepEqual(pickGreeting(at(TUE, 8), () => 0.999).line, g.lines.at(-1));
  assert.ok(g.lines.includes(pickGreeting(at(TUE, 8), Math.random).line));
});

test('shouldShowStart: only when the app is opened at home, never on reload, back or arrival from another page', () => {
  const home = 'https://x.github.io/Contact-Center-Management/';
  const show = (o) => shouldShowStart({ href: home, referrer: '', navType: 'navigate', ...o });
  assert.equal(show({}), true);
  assert.equal(show({ referrer: 'https://www.google.com/' }), true);
  assert.equal(show({ href: `${home}#learn` }), false);
  assert.equal(show({ href: `${home}#browse` }), false);
  assert.equal(show({ href: `${home}?tour=1` }), false);
  assert.equal(show({ referrer: `${home}sop-library/#pip-0` }), false);
  assert.equal(show({ navType: 'reload' }), false, 'a reload in the same visit');
  assert.equal(show({ navType: 'back_forward' }), false);
  assert.equal(show({ navType: undefined }), true, 'unknown navigation: show');
  assert.equal(show({ referrer: 'not a url' }), true);
});

test('the start screen stores nothing', () => {
  const src = readFileSync(new URL('../../home/start.js', import.meta.url), 'utf8');
  assert.ok(!/setItem|getItem|sessionStorage|localStorage/.test(src));
});

// ---- Task 2: the start screen on the home page ----
import { setupDom, click } from './dom.js';
import { renderStart } from '../../home/start-render.js';

function open(lang = 'ko', opts = {}) {
  const { document, root } = setupDom();
  const nav = document.createElement('nav');
  nav.className = 'app-bar';
  document.body.append(nav);
  const h1 = document.createElement('h1');
  h1.tabIndex = -1;
  root.append(h1);
  const calls = [];
  const greeting = pickGreeting(at(TUE, 8), () => 0);
  const view = renderStart(document, lang, {
    greeting, offline: 'ready',
    onClose: () => calls.push('close'), onLang: (l) => calls.push(`lang:${l}`), ...opts,
  });
  const $ = (sel) => document.querySelector(sel);
  return { document, root, nav, view, calls, $, greeting };
}

test('the start screen shows Miso, the logo, the tagline, the greeting and Start', () => {
  const { $, greeting } = open();
  const box = $('[data-start-screen]');
  assert.equal(box.getAttribute('role'), 'dialog');
  assert.equal(box.getAttribute('aria-modal'), 'true');
  assert.equal(box.getAttribute('aria-label'), START_UI.dialog.ko);
  assert.equal($('[data-start-screen] img').getAttribute('src'), `./assets/miso/${greeting.face}.webp`);
  assert.equal($('[data-start-screen] img').getAttribute('alt'), START_UI.misoAlt.ko);
  assert.equal($('[data-start-screen] h1').textContent, START_UI.logo.ko);
  assert.ok(box.textContent.includes(START_UI.tagline.ko));
  assert.equal($('[data-start-greeting]').textContent, greeting.line.ko);
  assert.equal($('[data-start-go]').textContent, START_UI.start.ko);
  assert.equal($('[data-start-offline]').textContent, START_UI.offlineReady.ko);
  assert.equal(document.activeElement, $('[data-start-screen]'), 'the dialog itself has focus (no ring on a button no one touched)');
  assert.equal($('[data-start-screen]').getAttribute('tabindex'), '-1');
});

test('while open, the page behind cannot be reached; closing frees it once', async () => {
  const { $, root, nav, view, calls, document } = open();
  assert.ok(root.hasAttribute('inert') && nav.hasAttribute('inert'));
  click($('[data-start-go]'));
  assert.equal($('[data-start-screen]'), null);
  assert.ok(!root.hasAttribute('inert') && !nav.hasAttribute('inert'));
  assert.deepEqual(calls, ['close']);
  await view.closed;
  view.close();
  assert.deepEqual(calls, ['close'], 'closing twice calls once');
  assert.equal(document.activeElement, document.querySelector('#app h1'), 'focus goes to the home heading');
});

for (const keyName of ['Enter', 'Escape']) {
  test(`${keyName} closes the start screen`, () => {
    const { $, calls, document } = open();
    $('[data-start-screen]').dispatchEvent(new document.defaultView.KeyboardEvent('keydown', { key: keyName, bubbles: true }));
    assert.equal($('[data-start-screen]'), null);
    assert.deepEqual(calls, ['close']);
  });
}

test('Enter on a language button switches language instead of closing', () => {
  const { $, calls, document } = open();
  const en = $('[data-start-screen] [data-lang="en"]');
  en.focus();
  en.dispatchEvent(new document.defaultView.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert.ok($('[data-start-screen]'), 'still open');
  click(en);
  assert.deepEqual(calls, ['lang:en']);
});

test('the offline line: hidden, getting ready, ready', () => {
  const { $, view } = open('ko', { offline: null });
  assert.equal($('[data-start-offline]').hidden, true);
  view.setOffline('wait');
  assert.equal($('[data-start-offline]').hidden, false);
  assert.equal($('[data-start-offline]').textContent, START_UI.offlineWait.ko);
  view.setOffline('ready');
  assert.equal($('[data-start-offline]').textContent, START_UI.offlineReady.ko);
});

test('switching to English changes every word and keeps the same greeting', () => {
  const { $, view, greeting } = open();
  view.setLang('en');
  assert.ok(!/[가-힣]/.test($('[data-start-screen]').textContent.replace('한국어', '')), $('[data-start-screen]').textContent);
  assert.equal($('[data-start-greeting]').textContent, greeting.line.en);
  assert.equal($('[data-start-screen]').getAttribute('aria-label'), START_UI.dialog.en);
  assert.equal($('[data-start-screen] [data-lang="en"]').getAttribute('aria-pressed'), 'true');
});

test('anything added behind the start screen while it is open is out of reach too', async () => {
  const { $, document } = open();
  const late = document.createElement('nav');
  late.className = 'appbar';
  document.body.append(late);
  await new Promise((r) => setTimeout(r, 0));
  assert.ok(late.hasAttribute('inert'), 'the app bar mounted later is inert');
  click($('[data-start-go]'));
  assert.ok(!late.hasAttribute('inert'));
});

test('the start screen\'s hook is its own: the home page already uses data-start', () => {
  const { $, document } = open();
  assert.equal(document.querySelectorAll('[data-start-screen]').length, 1);
  click($('[data-start-go]'));
  assert.equal(document.querySelectorAll('[data-start-screen]').length, 0);
});

// ---- final review fixes ----
test('Enter and Esc are used up by the start screen, so they cannot press the next thing that gets focus', () => {
  for (const keyName of ['Enter', 'Escape']) {
    const { $, document } = open();
    const ev = new document.defaultView.KeyboardEvent('keydown', { key: keyName, bubbles: true, cancelable: true });
    $('[data-start-screen]').dispatchEvent(ev);
    assert.equal(ev.defaultPrevented, true, keyName);
  }
});

test('screen readers hear the tagline and Miso\'s greeting with the dialog name', () => {
  const { $ } = open();
  const ids = $('[data-start-screen]').getAttribute('aria-describedby').split(' ');
  assert.deepEqual(ids.map((id) => document.getElementById(id)?.textContent),
    [START_UI.tagline.ko, $('[data-start-greeting]').textContent]);
});

// ---- offline line (2026-11-22): it must never fall back from ready to getting ready ----
const tick = () => new Promise((r) => setTimeout(r, 0));
async function offlineStates(sw) {
  const seen = [];
  await watchOffline(sw, (state) => seen.push(state));
  await tick();
  return seen;
}

test('an already-ready worker that does not control the page yet ends at ready', async () => {
  const seen = await offlineStates({ controller: null, getRegistration: async () => ({}), ready: Promise.resolve({}) });
  assert.equal(seen.at(-1), 'ready', seen.join(' → '));
});

test('offline line: getting ready, then ready when the worker becomes ready', async () => {
  let ready;
  const sw = { controller: null, getRegistration: async () => ({}), ready: new Promise((r) => { ready = r; }) };
  const seen = [];
  await watchOffline(sw, (state) => seen.push(state));
  assert.deepEqual(seen, ['wait']);
  ready({});
  await tick();
  assert.deepEqual(seen, ['wait', 'ready']);
});

test('offline line: ready at once with a controller; hidden with no worker, no registration or an error', async () => {
  assert.deepEqual(await offlineStates({ controller: {}, getRegistration: async () => ({}), ready: new Promise(() => {}) }), ['ready']);
  assert.deepEqual(await offlineStates(undefined), [null]);
  assert.deepEqual(await offlineStates({ controller: null, getRegistration: async () => undefined, ready: new Promise(() => {}) }), [null]);
  assert.deepEqual(await offlineStates({ controller: null, getRegistration: async () => { throw new Error('blocked'); }, ready: new Promise(() => {}) }), [null]);
});
