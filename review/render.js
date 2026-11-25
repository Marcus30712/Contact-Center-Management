// The review quiz page: a list of quizzes, then one quiz a question at a time,
// then the result. Spec: docs/superpowers/specs/2026-11-25-role-review-quiz-design.md §4.2–4.3.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { gradeAnswer } from '../agent-lifecycle/js/engine/quiz.js';
import { loadState, saveState, localDate } from '../practice/engine.js';
import { BADGES, PRACTICE_UI } from '../practice/data.js';
import { QUIZZES, REVIEW_UI as UI } from './data.js';
import { QUIZ_ROLES, PASS_MARK, loadReview, recordRun, unlocked } from './engine.js';

export function newReviewView() {
  return { role: null, index: 0, answers: {}, result: null };
}

// The quiz named in the address, if it exists and is open; otherwise the list.
export function routeRole(hash, storage) {
  const role = String(hash || '').replace(/^#/, '');
  return QUIZ_ROLES.includes(role) && unlocked(storage, role).open ? role : null;
}

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');

// redraw: draws the page again after a choice (the app passes its own draw).
export function renderReview(root, lang, storage, view, myRole, redraw) {
  const tr = (text) => t(text, lang).text;
  const miso = (name, size = 72) => h('img', {
    class: 'pr-miso', src: `../assets/miso/${name}.webp`, alt: '', width: size, height: Math.round((size * 227) / 157), 'data-miso': name,
  });
  const go = (change) => { change(); redraw(); root.querySelector('h2')?.focus?.(); };

  if (!view.role) return root.replaceChildren(header(), ...listCards());
  if (view.result) return root.replaceChildren(header(), resultCard());
  return root.replaceChildren(header(), questionCard());

  function header() {
    return h('header', { class: 'home-head' }, [
      h('h1', { text: tr(UI.title) }),
      view.role ? null : h('p', { class: 'tagline', text: tr(UI.intro) }),
    ]);
  }

  function listCards() {
    const order = [...QUIZ_ROLES.filter((r) => r === myRole), ...QUIZ_ROLES.filter((r) => r !== myRole)];
    const records = loadReview(storage);
    return order.map((role) => {
      const quiz = QUIZZES[role];
      const gate = unlocked(storage, role);
      const rec = records[role];
      const body = gate.open
        ? [
          rec ? h('p', { class: 'rv-best', 'data-best': true }, [
            rec.passed ? h('strong', { text: `${tr(UI.passMark)} · ` }) : null,
            fill(tr(UI.best), { x: rec.best, n: rec.total }),
          ]) : null,
          h('button', { type: 'button', class: 'btn primary', 'data-start-quiz': role, text: tr(UI.start), onclick: () => start(role) }),
        ]
        : [
          h('p', { class: 'muted', 'data-locked': true, text: fill(tr(UI.locked), { n: gate.left }) }),
          gate.next ? h('a', { href: gate.next.href, 'data-locked-link': true, text: tr(UI.lockedLink) }) : null,
        ];
      return h('section', { class: 'pr-card rv-quiz', 'data-quiz': role }, [
        h('h2', { tabindex: '-1', text: tr(quiz.name) }),
        h('p', { class: 'muted', text: tr(quiz.scope) }),
        ...body,
      ]);
    });
  }

  function start(role) {
    go(() => Object.assign(view, { role, index: 0, answers: {}, result: null }));
  }

  function questionCard() {
    const quiz = QUIZZES[view.role];
    const q = quiz.questions[view.index];
    const chosen = view.answers[q.id];
    const answered = chosen !== undefined;
    const right = answered && gradeAnswer(q, chosen).correct;
    const buttons = q.options.map((o) => h('button', {
      type: 'button', 'data-option': o.id, text: tr(o.text), disabled: answered,
      class: `option${chosen === o.id && right ? ' is-correct' : ''}${chosen === o.id && !right ? ' is-wrong' : ''}`,
      'aria-pressed': answered ? String(chosen === o.id) : false,
      onclick: () => { view.answers[q.id] = o.id; redraw(); },
    }));
    const feedback = answered ? h('div', { class: `pr-feedback ${right ? 'is-correct' : 'is-wrong'}` }, [
      miso(right ? 'joy' : 'worry'),
      h('div', { class: `explanation ${right ? 'is-correct' : 'is-wrong'}`, 'data-explanation': true }, [
        h('strong', { text: `${tr(right ? UI.correct : UI.wrong)} ` }),
        ...(() => {
          const fb = right ? null : q.options.find((o) => o.id === chosen)?.feedback;
          return fb ? [h('span', { 'data-feedback': true, text: tr(fb) }), ' '] : [];
        })(),
        document.createTextNode(tr(q.explanation)),
        right ? null : h('p', { class: 'rv-related' }, [
          h('strong', { text: `${tr(UI.related)}: ` }),
          ...q.lessons.flatMap((l, i) => [i ? ' · ' : null, h('a', { href: l.href, 'data-related': true, text: tr(l.title) })]),
        ]),
      ]),
    ]) : null;
    const last = view.index === quiz.questions.length - 1;
    return h('section', { class: 'pr-card', 'aria-labelledby': 'rv-q' }, [
      h('div', { class: 'pr-qhead' }, [
        answered ? null : miso('think', 56),
        h('h2', { class: 'pr-count', tabindex: '-1', 'data-count': true, text: fill(tr(UI.count), { i: view.index + 1, n: quiz.questions.length }) }),
      ]),
      h('div', { class: 'question', 'data-question': q.id }, [
        h('p', { class: 'prompt', id: 'rv-q', text: tr(q.prompt) }),
        h('div', { class: 'options' }, buttons),
      ]),
      feedback,
      answered ? h('button', { type: 'button', class: 'btn primary', 'data-next': true, text: tr(last ? UI.finish : UI.next), onclick: last ? finish : () => go(() => { view.index += 1; }) }) : null,
    ]);
  }

  // Only a finished run is stored; the badge comes with the first pass.
  function finish() {
    const quiz = QUIZZES[view.role];
    const correct = quiz.questions.filter((q) => gradeAnswer(q, view.answers[q.id]).correct).length;
    recordRun(storage, view.role, correct, quiz.questions.length);
    let newBadge = null;
    if (correct >= PASS_MARK) {
      const id = `review-${view.role}`;
      try {
        const st = loadState(storage);
        if (!st.badges[id]) {
          st.badges[id] = localDate();
          saveState(storage, st);
          newBadge = id;
        }
      } catch { /* storage blocked: no badge kept */ }
    }
    go(() => { view.result = { correct, total: quiz.questions.length, passed: correct >= PASS_MARK, newBadge }; });
  }

  function resultCard() {
    const quiz = QUIZZES[view.role];
    const { correct, total, passed, newBadge } = view.result;
    const missed = quiz.questions.filter((q) => !gradeAnswer(q, view.answers[q.id]).correct);
    const seen = new Set();
    const lessons = missed.flatMap((q) => q.lessons).filter((l) => !seen.has(l.href) && seen.add(l.href));
    const badge = newBadge ? BADGES.find((b) => b.id === newBadge) : null;
    return h('section', { class: 'pr-card pr-done', 'data-done': true }, [
      miso(passed ? 'proud' : 'cheer', 96),
      h('div', {}, [
        h('h2', { tabindex: '-1', 'data-score': true, text: fill(tr(UI.score), { n: total, x: correct }) }),
        h('p', { 'data-result': true, text: passed ? tr(UI.passed) : fill(tr(UI.failed), { need: PASS_MARK }) }),
        badge ? h('p', { class: 'rv-badge', 'data-new-badge': true, text: fill(tr(PRACTICE_UI.badgeNew), { name: tr(badge.name) }) }) : null,
        lessons.length ? h('div', { 'data-missed': true }, [
          h('h3', { text: tr(UI.missedTitle) }),
          h('ul', {}, lessons.map((l) => h('li', {}, [h('a', { href: l.href, text: tr(l.title) })]))),
        ]) : null,
        h('button', { type: 'button', class: 'btn primary', 'data-retry': true, text: tr(UI.retry), onclick: () => start(view.role) }),
      ]),
    ]);
  }
}
