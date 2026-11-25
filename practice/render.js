// Today's practice page: up to three questions from finished lessons, term
// cards, the weekday streak and the badge shelf, with Miso reacting.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { renderSheet } from '../excel/sheet.js';
import { SHEETS } from '../excel/data.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { PRACTICE_UI as UI, BADGES } from './data.js';
import {
  loadState, saveState, pool, ensureToday, recordAnswer, streak,
  openTerms, todayCards, markCard, checkBadges, courseFacts,
} from './engine.js';

// Alt text built from the approved expression names.
const MISO = {
  think: { ko: '김미소, 생각하는 얼굴', en: 'Miso Kim, thinking' },
  joy: { ko: '김미소, 기뻐하는 얼굴', en: 'Miso Kim, delighted' },
  worry: { ko: '김미소, 걱정하는 얼굴', en: 'Miso Kim, worried' },
  cheer: { ko: '김미소, 응원하는 모습', en: 'Miso Kim, cheering' },
  proud: { ko: '김미소, 뿌듯한 얼굴', en: 'Miso Kim, proud' },
  wink: { ko: '김미소, 윙크하는 얼굴', en: 'Miso Kim, winking' },
};
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');

// What the page shows between redraws: the answer being looked at, the card
// turned over, badges just earned and the line read out to screen readers.
export function newPracticeView() {
  return { showing: null, flipped: null, newBadges: [], status: '' };
}

// opts.clock: today's date now; when it has moved on, a tap first moves the
// page to the new day instead of saving to yesterday's set.
export function renderPractice(root, lang, storage, today, view = newPracticeView(), opts = {}) {
  const tr = (text) => t(text, lang).text;
  const miso = (name, size = 96) => h('img', {
    class: 'pr-miso', src: `../assets/miso/${name}.webp`, alt: tr(MISO[name]),
    width: size, height: Math.round((size * 227) / 157), 'data-miso': name,
  });
  const questions = pool(storage);
  const known = pool(storage, { allTracks: true });
  const terms = openTerms(storage);
  let state = ensureToday(loadState(storage), questions, today, known);

  // Course and card badges are checked whenever the page opens.
  const facts = courseFacts(storage, state, terms);
  const opened = checkBadges(state, { today, ...facts });
  if (opened.length) {
    state = { ...state, badges: { ...state.badges } };
    for (const b of opened) state.badges[b] = today;
    view.newBadges = [...view.newBadges, ...opened];
  }
  saveState(storage, state);

  // replaceChildren would write an empty part out as the text "null".
  const show = (...parts) => root.replaceChildren(...parts.filter(Boolean));
  const dayMoved = () => {
    const now = opts.clock?.();
    if (!now || now === today) return false;
    Object.assign(view, newPracticeView());
    opts.onDay?.(now);
    renderPractice(root, lang, storage, now, view, opts);
    root.querySelector('[data-option], [data-card], [data-done] h2')?.focus();
    return true;
  };
  // The read-out line belongs to the language it was written in.
  if (view.statusLang && view.statusLang !== lang) view.status = '';
  const redraw = (focus) => {
    renderPractice(root, lang, storage, today, view, opts);
    if (focus) root.querySelector(focus)?.focus();
  };

  const run = streak(state.days, today);
  const streakLine = run.weekend
    ? h('div', { class: 'pr-weekend', 'data-weekend': true }, [miso('wink', 56), h('p', { text: tr(UI.weekend) })])
    : null;
  const streakText = run.pending ? fill(tr(UI.streakPending), { n: run.count + 1 }) : fill(tr(UI.streak), { n: run.count });

  const header = h('header', { class: 'pr-head' }, [
    h('h1', { text: tr(UI.title) }),
    questions.length ? h('p', { class: 'pr-streak', 'data-streak': true, text: run.weekend ? fill(tr(UI.streak), { n: run.count }) : streakText }) : null,
  ]);
  // One status line for screen readers, outside the redrawn area, so a change
  // of its text is announced.
  let status = document.querySelector('[data-status]');
  if (!status) {
    status = h('p', { class: 'visually-hidden', role: 'status', 'data-status': true });
    document.body.append(status);
  }
  if (status.textContent !== view.status) status.textContent = view.status;

  if (!questions.length) {
    show(header, h('section', { class: 'pr-locked' }, [
      miso('think'),
      h('div', {}, [
        h('p', { 'data-locked': true, text: tr(UI.locked) }),
        h('a', { href: '../agent-lifecycle/#hiring-0', 'data-start': true, text: tr(UI.lockedLink) }),
      ]),
    ]), badgeShelf());
    return;
  }

  show(
    header,
    streakLine,
    questionArea(),
    badgeNews(),
    cardArea(),
    badgeShelf(),
  );

  // ---- questions ---------------------------------------------------------
  function questionArea() {
    const { ids, answers } = state.today;
    const results = state.today.results ?? {};
    const shownKey = view.showing && ids.includes(view.showing) ? view.showing : ids.find((k) => !(k in answers));
    if (!shownKey) {
      return h('section', { class: 'pr-card pr-done', 'data-done': true }, [
        miso('cheer'),
        h('div', {}, [h('h2', { tabindex: '-1', text: tr(UI.doneTitle) }), h('p', { text: tr(UI.doneLine) })]),
      ]);
    }
    const q = known.find((x) => x.key === shownKey);
    const index = ids.indexOf(shownKey);
    const answered = shownKey in answers;
    const right = results[shownKey];
    const buttons = q.options.map((o) => {
      const mine = answers[shownKey] === o.id;
      return h('button', {
        type: 'button', 'data-option': o.id, text: tr(o.text), disabled: answered,
        class: `option${mine && right ? ' is-correct' : ''}${mine && !right ? ' is-wrong' : ''}`,
        'aria-pressed': answered ? String(mine) : false,
        onclick: () => choose(q, o.id),
      });
    });
    const feedback = answered ? h('div', { class: `pr-feedback ${right ? 'is-correct' : 'is-wrong'}` }, [
      miso(right ? 'joy' : 'worry', 72),
      h('div', { class: `explanation ${right ? 'is-correct' : 'is-wrong'}`, 'data-explanation': true }, [
        h('strong', { text: `${tr(right ? UI.correct : UI.wrong)} ` }),
        // A lifecycle option may say why that choice falls short.
        ...(() => {
          const fb = right ? null : q.options.find((o) => o.id === answers[shownKey])?.feedback;
          return fb ? [h('span', { 'data-feedback': true, text: tr(fb) }), ' '] : [];
        })(),
        document.createTextNode(tr(q.explanation)),
        right ? null : h('p', {}, [h('a', {
          'data-review': true, text: tr(UI.reviewLesson),
          href: q.course === 'excel' ? `../excel/#lesson-${q.lessonId}` : `${{ sop: '../sop-library/', sme: '../sme/', 'sme-lifecycle': '../sme-lifecycle/', 'sme-sop': '../sme-sop/' }[q.course] ?? '../agent-lifecycle/'}#${q.lessonId}-0`,
        })]),
      ]),
    ]) : null;
    return h('section', { class: 'pr-card', 'aria-labelledby': 'pr-q' }, [
      h('div', { class: 'pr-qhead' }, [
        answered ? null : miso('think', 56),
        h('p', { class: 'pr-count', 'data-count': true, text: fill(tr(UI.questionCount), { i: index + 1, n: ids.length }) }),
      ]),
      index === 0 && !answered ? h('p', { class: 'tagline', 'data-intro': true, text: fill(tr(UI.intro), { n: ids.length }) }) : null,
      h('div', { class: 'question', 'data-question': shownKey }, [
        h('p', { class: 'prompt', id: 'pr-q', text: tr(q.prompt) }),
        // Excel questions are read against Miso's example table; a blank's
        // formula line sits right above its options, as in the Excel lesson.
        q.course === 'excel' ? renderSheet(SHEETS[lang]) : null,
        q.template ? h('p', { class: 'ex-template', 'data-template': true, text: tr(q.template) }) : null,
        h('div', { class: 'options' }, buttons),
      ]),
      feedback,
      // After the last open question the button leads to the done screen.
      answered ? h('button', {
        type: 'button', class: 'btn primary', 'data-next': true, onclick: next,
        text: tr(ids.some((k) => !(k in answers)) ? UI.next : UI.finish),
      }) : null,
    ]);
  }

  function choose(q, optionId) {
    if (dayMoved()) return;
    const correct = optionId === q.answer;
    const result = recordAnswer(state, q.key, optionId, correct, today);
    saveState(storage, result.state);
    view.showing = q.key;
    view.newBadges = [...view.newBadges, ...result.newBadges];
    view.status = tr(correct ? UI.correct : UI.wrong);
    view.statusLang = lang;
    redraw('[data-next]');
  }

  function next() {
    if (dayMoved()) return;
    view.showing = null;
    view.status = '';
    redraw('[data-option], [data-done] h2');
  }

  // ---- badges ------------------------------------------------------------
  function badgeNews() {
    if (!view.newBadges.length) return null;
    const names = view.newBadges.map((id) => tr(BADGES.find((b) => b.id === id).name));
    return h('section', { class: 'pr-card pr-news', 'data-badge-new': true }, [
      miso('proud', 72),
      h('div', {}, names.map((name) => h('p', { text: fill(tr(UI.badgeNew), { name }) }))),
    ]);
  }

  function badgeShelf() {
    return h('section', { class: 'pr-shelf' }, [
      h('h2', { text: tr(UI.badgesTitle) }),
      h('ul', { 'data-badges': true }, BADGES.map((b) => {
        const earned = Boolean(state.badges[b.id]);
        return h('li', { class: earned ? 'is-earned' : 'is-locked', 'data-badge': b.id }, [
          h('strong', { text: tr(b.name) }),
          h('span', { text: tr(b.rule) }),
        ]);
      })),
    ]);
  }

  // ---- term cards --------------------------------------------------------
  function cardArea() {
    const deck = todayCards(state, terms, today);
    const head = h('div', { class: 'pr-cards-head' }, [
      h('h2', { text: tr(UI.cardsTitle) }),
      h('span', { 'data-cards-count': true, text: fill(tr(UI.cardsToday), { n: deck.length }) }),
    ]);
    if (!deck.length) {
      return h('section', { class: 'pr-cards', 'data-cards': true }, [head, h('p', { tabindex: '-1', 'data-cards-done': true, text: tr(UI.cardsDone) })]);
    }
    const term = deck[0];
    const flipped = view.flipped === term.id;
    const card = h('button', {
      type: 'button', class: `pr-term${flipped ? ' is-flipped' : ''}`, 'data-card': term.id, 'aria-expanded': String(flipped),
      onclick: () => { view.flipped = flipped ? null : term.id; redraw(`[data-card="${term.id}"]`); },
    }, [
      h('strong', { class: 'pr-term-word', text: term.term }),
      flipped
        ? h('span', { class: 'pr-term-back', 'data-card-back': true }, [
          h('b', { text: tr(term.name) }), ' ', document.createTextNode(tr(term.definition)),
        ])
        : h('span', { class: 'pr-term-hint', text: tr(UI.cardFlip) }),
    ]);
    const mark = (known) => () => {
      if (dayMoved()) return;
      const result = markCard(state, term.id, known, today, courseFacts(storage, {
        ...state, cards: { ...state.cards, [term.id]: { known, last: today } },
      }, terms));
      saveState(storage, result.state);
      view.flipped = null;
      view.newBadges = [...view.newBadges, ...result.newBadges];
      redraw('[data-card], [data-cards-done]');
    };
    return h('section', { class: 'pr-cards', 'data-cards': true }, [
      head,
      card,
      flipped ? h('div', { class: 'pr-term-actions' }, [
        h('button', { type: 'button', class: 'btn primary', 'data-know': true, text: tr(UI.cardKnow), onclick: mark(true) }),
        h('button', { type: 'button', class: 'btn ghost', 'data-again': true, text: tr(UI.cardAgain), onclick: mark(false) }),
      ]) : null,
    ]);
  }
}
