import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, click } from './dom.js';
import { fakeStorage } from './helpers.js';
import { renderPractice, newPracticeView } from '../../practice/render.js';
import { PRACTICE_UI as UI } from '../../practice/data.js';
import { loadState, pool } from '../../practice/engine.js';

const FRI = '2026-11-20';
const SAT = '2026-11-21';
const ALL_LIFE = ['hiring', 'onboarding', 'nesting', 'coaching', 'retention', 'career'];

function store(life = ALL_LIFE, sop = []) {
  const s = fakeStorage();
  s.setItem('agent-lifecycle-course:v1', JSON.stringify({ completed: life }));
  s.setItem('sop-library:v1', JSON.stringify({ completed: sop }));
  return s;
}
function page(storage, today = FRI, lang = 'ko') {
  const { root } = setupDom();
  const view = newPracticeView();
  renderPractice(root, lang, storage, today, view);
  return { root, view, again: () => renderPractice(root, lang, storage, today, view) };
}
const current = (root, storage) => {
  const key = root.querySelector('[data-question]').getAttribute('data-question');
  return pool(storage).find((q) => q.key === key);
};
const choose = (root, storage, right) => {
  const q = current(root, storage);
  const id = right ? q.answer : q.options.find((o) => o.id !== q.answer).id;
  click(root.querySelector(`[data-question] [data-option="${id}"]`));
  return q;
};

test('locked when nothing is finished', () => {
  const { root } = page(store([], []));
  assert.ok(root.querySelector('img[data-miso="think"]'));
  assert.ok(root.querySelector('[data-locked]').textContent.includes(UI.locked.ko));
  assert.equal(root.querySelector('a[data-start]').getAttribute('href'), '../agent-lifecycle/#hiring-0');
  assert.equal(root.querySelector('[data-question]'), null);
  assert.equal(root.querySelector('[data-cards]'), null);
});

test('answering right shows joy; wrong shows worry, the explanation and the lesson link', () => {
  const s = store(ALL_LIFE, ['pip']);
  const { root } = page(s);
  assert.ok(root.querySelector('[data-count]').textContent.includes('문제 1 / 3'));
  assert.ok(root.querySelector('img[data-miso="think"]'));
  choose(root, s, true);
  assert.ok(root.querySelector('img[data-miso="joy"]'));
  assert.ok(document.querySelector('[data-status]').textContent.includes(UI.correct.ko));
  assert.ok([...root.querySelectorAll('[data-question] [data-option]')].every((b) => b.disabled));
  click(root.querySelector('[data-next]'));
  assert.ok(root.querySelector('[data-count]').textContent.includes('문제 2 / 3'));
  const q = choose(root, s, false);
  assert.ok(root.querySelector('img[data-miso="worry"]'));
  assert.ok(document.querySelector('[data-status]').textContent.includes(UI.wrong.ko));
  assert.ok(root.querySelector('[data-explanation]').textContent.length > 10);
  const base = q.course === 'sop' ? '../sop-library/' : '../agent-lifecycle/';
  assert.equal(root.querySelector('a[data-review]').getAttribute('href'), `${base}#${q.lessonId}-0`);
});

test('finishing the day shows cheer, the streak and a new badge with proud', () => {
  const s = store();
  const { root } = page(s);
  for (let i = 0; i < 3; i += 1) {
    choose(root, s, true);
    click(root.querySelector('[data-next]'));
  }
  assert.ok(root.querySelector('[data-done]').textContent.includes(UI.doneTitle.ko));
  assert.ok(root.querySelector('img[data-miso="cheer"]'));
  assert.ok(root.querySelector('[data-streak]').textContent.includes('🔥 1일째'));
  const news = root.querySelector('[data-badge-new]');
  assert.ok(news.textContent.includes('새 배지: 첫걸음') && news.textContent.includes('만점'));
  assert.ok(news.querySelector('img[data-miso="proud"]'));
  assert.deepEqual(loadState(s).days, [FRI]);
});

test('reopening the same day carries on where it stopped', () => {
  const s = store();
  const first = page(s);
  choose(first.root, s, true);
  const second = page(s);
  assert.ok(second.root.querySelector('[data-count]').textContent.includes('문제 2 / 3'));
});

test('pending streak on a weekday, weekend line with wink on Saturday', () => {
  const s = store();
  assert.ok(page(s).root.querySelector('[data-streak]').textContent.includes('오늘 하면 1일째'));
  const sat = page(s, SAT).root;
  assert.ok(sat.querySelector('[data-weekend]').textContent.includes(UI.weekend.ko));
  assert.ok(sat.querySelector('[data-weekend] img[data-miso="wink"]'));
});

test('term cards flip, then leave today\'s deck', () => {
  const s = store(['hiring']);
  const { root } = page(s);
  assert.ok(root.querySelector('[data-cards-count]').textContent.includes('오늘 5장'));
  const card = root.querySelector('[data-card]');
  const id = card.getAttribute('data-card');
  assert.ok(card.textContent.includes(UI.cardFlip.ko));
  click(card);
  assert.ok(root.querySelector('[data-card-back]').textContent.length > 10);
  click(root.querySelector('[data-know]'));
  assert.notEqual(root.querySelector('[data-card]')?.getAttribute('data-card'), id);
  assert.ok(root.querySelector('[data-cards-count]').textContent.includes('오늘 4장'));
  for (let i = 0; i < 4; i += 1) {
    click(root.querySelector('[data-card]'));
    click(root.querySelector('[data-again]'));
  }
  assert.ok(root.querySelector('[data-cards-done]').textContent.includes(UI.cardsDone.ko));
});

test('badge shelf shows all ten, unearned ones dimmed with their rule', () => {
  const { root } = page(store(['hiring']));
  const items = [...root.querySelectorAll('[data-badges] [data-badge]')];
  assert.equal(items.length, 10);
  assert.equal(items[9].getAttribute('data-badge'), 'excel');
  assert.ok(items[9].textContent.includes('엑셀 완주'));
  assert.ok(items.every((li) => li.classList.contains('is-locked')));
  assert.ok(items[1].textContent.includes('평일 연속 3일'));
  const all = page(store()).root;
  assert.ok(all.querySelector('[data-badge="lifecycle"]').classList.contains('is-earned'), 'a finished course earns its badge on open');
  assert.ok(all.querySelector('[data-badge-new]').textContent.includes('라이프사이클 완주'));
});

test('the English page has no Korean', () => {
  const s = store(ALL_LIFE, ['pip']);
  const { root } = page(s, FRI, 'en');
  choose(root, s, false);
  const text = root.textContent + [...root.querySelectorAll('img')].map((i) => i.alt).join(' ');
  assert.ok(!/[가-힣]/.test(text), text.match(/[가-힣]+/)?.[0]);
  assert.ok(root.querySelector('[data-count]').textContent.includes('Question 1 of 3'));
});

test('empty parts leave no stray text on the page', () => {
  for (const [life, day] of [[[], FRI], [ALL_LIFE, FRI], [['hiring'], SAT]]) {
    const { root } = page(store(life), day);
    assert.ok(!/\bnull\b|\bundefined\b/.test(root.textContent), `${life.length} ${day}`);
  }
});

test('a track switch after picking still lets the day finish', () => {
  const s = store(['onboarding']);
  page(s);
  s.setItem('agent-lifecycle-course:track', 'tech');
  const { root } = page(s);
  // The three general-track questions picked before the switch stay answerable.
  for (let i = 0; i < 3; i += 1) {
    click(root.querySelector('[data-question] [data-option]'));
    click(root.querySelector('[data-next]'));
  }
  assert.ok(root.querySelector('[data-done]'));
  assert.deepEqual(loadState(s).days, [FRI]);
  s.setItem('kb-practice:v1', JSON.stringify({ today: { date: FRI, ids: ['lifecycle:gone-q9'], answers: {} } }));
  assert.doesNotThrow(() => page(s));
});

test('the status line stays one element and focus lands on something focusable', () => {
  const s = store([], ['pip']);
  const { root } = page(s);
  const status = document.querySelector('[data-status]');
  assert.ok(!root.contains(status), 'the status line lives outside the redrawn area');
  click(root.querySelector('[data-question] [data-option]'));
  assert.equal(document.querySelector('[data-status]'), status);
  assert.ok(/맞아요|아쉬워요/.test(status.textContent));
  click(root.querySelector('[data-next]'));
  click(root.querySelector('[data-question] [data-option]'));
  click(root.querySelector('[data-next]'));
  assert.equal(document.activeElement, root.querySelector('[data-done] h2'));
  for (let i = 0; i < 5; i += 1) {
    click(root.querySelector('[data-card]'));
    click(root.querySelector('[data-know]'));
  }
  assert.equal(document.activeElement, root.querySelector('[data-cards-done]'));
});

test('finishing every Excel lesson earns its badge when practice opens', () => {
  const s = store([], ['pip']);
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], scores: {} }));
  const { root } = page(s);
  assert.ok(root.querySelector('[data-badge="excel"]').classList.contains('is-earned'));
  assert.ok(root.querySelector('[data-badge-new]').textContent.includes('새 배지: 엑셀 완주'));
  assert.ok(root.querySelector('[data-badge-new] img[data-miso="proud"]'));
});

test('a page left open past midnight moves to the new day before saving an answer', () => {
  const s = store();
  const { root } = setupDom();
  const view = newPracticeView();
  let now = FRI;
  renderPractice(root, 'ko', s, FRI, view, { clock: () => now });
  now = '2026-11-23';
  click(root.querySelector('[data-question] [data-option]'));
  const st = loadState(s);
  assert.equal(st.today.date, '2026-11-23', 'the new day has its own set');
  assert.deepEqual(st.today.answers, {}, 'the tap only moved the page to the new day');
  assert.ok(root.querySelector('[data-count]').textContent.includes('문제 1 / 3'));
});

test('switching language clears the read-out line from the other language', () => {
  const s = store();
  const { root } = setupDom();
  const view = newPracticeView();
  renderPractice(root, 'ko', s, FRI, view);
  click(root.querySelector('[data-question] [data-option]'));
  assert.ok(/[가-힣]/.test(document.querySelector('[data-status]').textContent));
  renderPractice(root, 'en', s, FRI, view);
  assert.ok(!/[가-힣]/.test(document.querySelector('[data-status]').textContent));
});

test('after the midnight move the app learns the new day, and focus stays on a question', () => {
  const s = store();
  const { root } = setupDom();
  const view = newPracticeView();
  let now = FRI;
  let told = null;
  renderPractice(root, 'ko', s, FRI, view, { clock: () => now, onDay: (d) => { told = d; } });
  now = '2026-11-23';
  root.querySelector('[data-question] [data-option]').focus();
  click(root.querySelector('[data-question] [data-option]'));
  assert.equal(told, '2026-11-23');
  assert.ok(document.activeElement?.matches('[data-option]'));
});

test('an Excel question shows the example table, the formula line and its lesson link', () => {
  const s = store([]);
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['4'], scores: {} }));
  for (const lang of ['ko', 'en']) {
    const { root } = page(s, FRI, lang);
    let guard = 0;
    while (root.querySelector('[data-question]') && guard < 3) {
      guard += 1;
      const q = current(root, s);
      assert.equal(q.course, 'excel');
      assert.ok(root.querySelector('.ex-sheet td[data-cell="C2"]'), 'the table is shown');
      if (q.template) assert.ok(root.querySelector('[data-template]').textContent.includes('___'));
      choose(root, s, false);
      assert.equal(root.querySelector('a[data-review]').getAttribute('href'), `../excel/#lesson-${q.lessonId}`);
      if (lang === 'en') assert.ok(!/[가-힣]/.test(root.textContent), root.textContent.match(/[가-힣]+/)?.[0]);
      click(root.querySelector('[data-next]'));
    }
    assert.equal(guard, 3);
    s.setItem('kb-practice:v1', '{}');
  }
});

test('an Excel blank keeps its formula line right above the options, and a right answer is marked right', () => {
  const s = store([]);
  s.setItem('excel-practice:v1', JSON.stringify({ completed: ['4'], scores: {} }));
  const { root } = page(s);
  let seenBlank = false;
  for (let i = 0; i < 3; i += 1) {
    const q = current(root, s);
    const box = root.querySelector('[data-question]');
    if (q.template) {
      seenBlank = true;
      const kids = [...box.children];
      const at = (sel) => kids.findIndex((k) => k.matches(sel));
      assert.ok(at('.ex-sheet') < at('[data-template]') && at('[data-template]') + 1 === at('.options'), 'table, then formula, then options');
    }
    choose(root, s, true);
    assert.ok(root.querySelector('[data-question] .is-correct'));
    assert.equal(root.querySelector('a[data-review]'), null);
    click(root.querySelector('[data-next]'));
  }
  assert.ok(seenBlank);
});

test('the intro counts the questions actually picked today', () => {
  const two = page(store([], ['pip'])).root;
  assert.ok(two.querySelector('[data-count]').textContent.includes('문제 1 / 2'));
  assert.equal(two.querySelector('[data-intro]').textContent, '마친 레슨에서 문제 2개를 골랐어요. 틈틈이 풀어 보세요.');
  const three = page(store()).root;
  assert.equal(three.querySelector('[data-intro]').textContent, '마친 레슨에서 문제 3개를 골랐어요. 틈틈이 풀어 보세요.');
});

test('the last question\'s button finishes the practice; earlier ones go to the next question', () => {
  const s = store([], ['pip']);
  const { root } = page(s);
  click(root.querySelector('[data-question] [data-option]'));
  assert.equal(root.querySelector('[data-next]').textContent, UI.next.ko);
  click(root.querySelector('[data-next]'));
  click(root.querySelector('[data-question] [data-option]'));
  assert.equal(root.querySelector('[data-next]').textContent, UI.finish.ko);
  click(root.querySelector('[data-next]'));
  assert.ok(root.querySelector('[data-done]'));
});

test('in English the last button says Finish practice', () => {
  const s = store([], ['pip']);
  const { root } = page(s, FRI, 'en');
  click(root.querySelector('[data-question] [data-option]'));
  click(root.querySelector('[data-next]'));
  click(root.querySelector('[data-question] [data-option]'));
  assert.equal(root.querySelector('[data-next]').textContent, 'Finish practice →');
});

test('on a one-question day the first button already finishes, and the intro says 1', () => {
  const s = store([], ['pip']);
  const key = pool(s)[0].key;
  s.setItem('kb-practice:v1', JSON.stringify({ today: { date: FRI, ids: [key], answers: {} } }));
  for (const [lang, intro] of [['en', '1 for today'], ['ko', '문제 1개를']]) {
    const { root } = page(s, FRI, lang);
    assert.ok(root.querySelector('[data-intro]').textContent.includes(intro));
    if (lang === 'ko') {
      click(root.querySelector('[data-question] [data-option]'));
      assert.equal(root.querySelector('[data-next]').textContent, '연습 마치기 →');
    }
  }
});

test('the done screen no longer promises three questions', () => {
  const s = store([], ['pip']);
  const { root } = page(s);
  for (let i = 0; i < 2; i += 1) {
    click(root.querySelector('[data-question] [data-option]'));
    click(root.querySelector('[data-next]'));
  }
  assert.ok(root.querySelector('[data-done]').textContent.includes('내일 또 같이 해요.'));
});

test('finishing after midnight opens the new day instead of yesterday\'s done screen', () => {
  const s = store([], ['pip']);
  const { root } = setupDom();
  const view = newPracticeView();
  let now = FRI;
  renderPractice(root, 'ko', s, FRI, view, { clock: () => now });
  click(root.querySelector('[data-question] [data-option]'));
  click(root.querySelector('[data-next]'));
  click(root.querySelector('[data-question] [data-option]'));
  now = '2026-11-23';
  click(root.querySelector('[data-next]'));
  assert.equal(root.querySelector('[data-done]'), null);
  assert.ok(root.querySelector('[data-count]').textContent.includes('문제 1 / 2'));
  assert.equal(loadState(s).today.date, '2026-11-23');
});
