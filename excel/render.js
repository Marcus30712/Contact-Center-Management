// Miso's Excel practice: the lesson list and one lesson (explanation cards,
// six questions, summary). Everything is tapped; nothing is typed.
import { EXCEL_FEEDBACK, EXCEL_FEEDBACK_UI } from './feedback.js';
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { EXCEL_UI as UI, EXCEL_LESSONS, SHEETS } from './data.js';
import { EXCEL_ADVANCED, ADVANCED_UI } from './advanced.js';
import {
  grade, newBuild, displayOrder, tapBank, tapLine, lineTexts, pickCell, selectionText,
  applyAfter, loadProgress, saveProgress, finishLesson, isOpen, nextLessonAfter,
} from './engine.js';
import { renderSheet, renderPivot } from './sheet.js';

const MISO = {
  smile: { ko: '김미소, 미소 짓는 얼굴', en: 'Miso Kim, smiling' },
  think: { ko: '김미소, 생각하는 얼굴', en: 'Miso Kim, thinking' },
  joy: { ko: '김미소, 기뻐하는 얼굴', en: 'Miso Kim, delighted' },
  worry: { ko: '김미소, 걱정하는 얼굴', en: 'Miso Kim, worried' },
  proud: { ko: '김미소, 뿌듯한 얼굴', en: 'Miso Kim, proud' },
};
const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');

// How a calculated value reads on screen.
function show(value) {
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : String(Math.round(value * 10000) / 10000);
  return value === '' ? '""' : String(value);
}

// What the page remembers between redraws: which lesson and step, the
// learner's input on the current question, and how the first tries went.
export function newExcelView() {
  return { lessonId: null, stage: 'cards', qi: 0, input: null, graded: null, firstTry: {}, status: '' };
}

// Every tap redraws at once, so the second click of a double tap would land on
// whatever was just drawn under the finger (and answer the next question). The
// browser marks that click with detail 2. It is dropped only within a moment of
// the screen moving on (start, next, grading, retry, another lesson), so quick
// taps on cards and slow double-click settings still work. Keys give detail 0.
const DOUBLE_TAP_MS = 500;
const guarded = new WeakMap();
function dropSecondTap(root, view) {
  const known = guarded.has(root);
  guarded.set(root, view);
  if (known) return;
  root.addEventListener('click', (e) => {
    const v = guarded.get(root);
    if (e.detail > 1 && Date.now() - (v.movedAt ?? 0) < DOUBLE_TAP_MS) { e.stopPropagation(); e.preventDefault(); }
  }, true);
}

export function renderExcel(root, lang, storage, route, view) {
  dropSecondTap(root, view);
  const screen = [route, view.lessonId, view.stage, view.qi, Boolean(view.graded)].join('|');
  if (view.screen !== screen) { view.screen = screen; view.movedAt = Date.now(); }
  const tr = (text) => t(text, lang).text;
  const miso = (name, size = 88) => h('img', {
    class: 'ex-miso', src: `../assets/miso/${name}.webp`, alt: tr(MISO[name]),
    width: size, height: Math.round((size * 227) / 157), 'data-miso': name,
  });
  const progress = loadProgress(storage);
  const show_ = (...parts) => root.replaceChildren(...parts.filter(Boolean));
  const redraw = (focus) => {
    renderExcel(root, lang, storage, route, view);
    if (focus) root.querySelector(focus)?.focus();
  };

  // The read-out line and a text result belong to the language they were made in.
  if (view.statusLang && view.statusLang !== lang) view.status = '';
  // One status line outside the redrawn area, so screen readers hear changes.
  let status = document.querySelector('[data-status]');
  if (!status) {
    status = h('p', { class: 'visually-hidden', role: 'status', 'data-status': true });
    document.body.append(status);
  }
  if (status.textContent !== view.status) status.textContent = view.status;

  const m = /^lesson-(\d+)$/.exec(route || '');
  const lesson = m && [...EXCEL_LESSONS, ...EXCEL_ADVANCED].find((l) => l.id === m[1]);
  const advanced = Boolean(lesson && EXCEL_ADVANCED.includes(lesson));
  if (!lesson || !isOpen(progress, lesson.id)) {
    view.lessonId = null;
    list();
    return;
  }
  if (view.lessonId !== lesson.id) Object.assign(view, newExcelView(), { lessonId: lesson.id });
  const index = EXCEL_LESSONS.indexOf(lesson);

  const head = h('header', { class: 'ex-head' }, [
    h('a', { class: 'ex-back', href: '#', text: `← ${tr(UI.backToList)}` }),
    // An advanced lesson is named by its section, not "lesson 12 of 11".
    h('p', { class: 'ex-of', text: advanced ? tr(ADVANCED_UI.advancedHeading) : fill(tr(UI.lessonOf), { i: index + 1, n: EXCEL_LESSONS.length }) }),
    h('h1', { tabindex: '-1', text: `${lesson.id}. ${tr(lesson.title)}` }),
  ]);

  if (view.stage === 'cards') {
    show_(head, h('section', { class: 'ex-cards' }, [
      miso('smile'),
      h('div', { class: 'ex-card-list' }, lesson.cards.map((c) => h('p', { class: 'ex-explain', 'data-explain-card': true, text: tr(c) }))),
    ]), renderSheet(SHEETS[lang]), h('button', {
      type: 'button', class: 'btn primary', 'data-start': true, text: tr(UI.start),
      onclick: () => { view.stage = 'q'; view.qi = 0; startQuestion(); redraw('[data-count]'); },
    }));
    return;
  }

  if (view.stage === 'summary') {
    const right = lesson.questions.filter((q) => view.firstTry[q.id]).length;
    const nextId = nextLessonAfter(progress, lesson.id);
    const allDone = EXCEL_LESSONS.every((l) => progress.completed.includes(l.id));
    const advancedDone = allDone && EXCEL_ADVANCED.every((l) => progress.completed.includes(l.id));
    show_(head, h('section', { class: 'ex-done', 'data-done': true }, [
      miso('proud'),
      h('div', {}, [
        h('h2', { tabindex: '-1', text: fill(tr(UI.lessonDone), { i: lesson.id }) }),
        h('p', { 'data-score': true, text: fill(tr(UI.score), { n: right }) }),
        advancedDone ? h('p', { text: tr(ADVANCED_UI.advancedDone) }) : allDone ? h('p', { text: tr(UI.allDone) }) : null,
      ]),
    ]), h('section', { class: 'ex-summary', 'data-summary': true }, [
      h('h2', { text: tr(UI.summaryTitle) }),
      h('ul', {}, lesson.summary.map((s) => h('li', { text: tr(s) }))),
    ]), h('div', { class: 'ex-actions' }, [
      nextId ? h('a', { class: 'btn primary', href: `#lesson-${nextId}`, 'data-next-lesson': true, text: tr(UI.nextLesson) }) : null,
      h('a', { class: 'btn ghost', href: '#', text: tr(UI.backToList) }),
    ]));
    return;
  }

  // ---- one question ----------------------------------------------------------
  const q = lesson.questions[view.qi];
  if (!view.input) startQuestion();
  if (view.graded && view.gradedLang !== lang) {
    // Cards are kept by id, so rebuild the picked line in the new language.
    const placed = view.input.build
      ? view.input.build.line.map((id) => (q.type === 'steps' ? [...q.steps[lang], ...q.decoys[lang]] : [...q.cards[lang], ...q.decoys[lang]])[id])
      : view.input.picked;
    view.graded = grade(q, placed, lang);
    view.gradedLang = lang;
  }
  const g = view.graded;

  function startQuestion() {
    const cur = lesson.questions[view.qi];
    view.graded = null;
    view.input = { build: (cur.type === 'build' || cur.type === 'steps') ? newBuild(cur, 'ko', lesson.id) : null, sel: null };
  }
  function check(answer) {
    view.input.picked = answer;
    const result = grade(q, answer, lang);
    view.gradedLang = lang;
    view.statusLang = lang;
    if (!(q.id in view.firstTry)) view.firstTry[q.id] = result.correct;
    view.graded = result;
    view.status = tr(result.correct ? UI.correct : UI.wrong);
    redraw('[data-next]');
  }
  function next() {
    view.status = '';
    if (view.qi + 1 < lesson.questions.length) {
      view.qi += 1;
      startQuestion();
      redraw('[data-count]');
      return;
    }
    const right = lesson.questions.filter((x) => view.firstTry[x.id]).length;
    saveProgress(storage, finishLesson(progress, lesson.id, right));
    view.stage = 'summary';
    redraw('[data-done] h2');
  }
  function retry() {
    view.status = '';
    startQuestion();
    redraw('[data-check], [data-option], [data-chip], [data-card], td[data-cell]');
  }

  // Bank texts follow the current language, so a language switch keeps the
  // learner's picks but shows them in the new language.
  const bankText = (id) => {
    const all = q.type === 'steps' ? [...q.steps[lang], ...q.decoys[lang]] : [...q.cards[lang], ...q.decoys[lang]];
    return all[id];
  };
  const buildState = () => ({ ...view.input.build, bank: view.input.build.bank.map((c) => ({ id: c.id, text: bankText(c.id) })) });

  const answered = Boolean(g);
  let input = null;
  let sheetOpts = {};
  let hint = null;

  // Picked and right answers are marked once answered; buttons keep their own index.
  const mark = (i) => {
    if (!answered) return '';
    if (i === q.answer) return ' is-correct';
    return i === view.input.picked ? ' is-wrong' : '';
  };
  const pressed = (i) => (answered ? String(i === view.input.picked) : false);
  if (q.type === 'choice') {
    input = h('div', { class: 'options' }, displayOrder(q).map((i) => h('button', {
      type: 'button', class: `option${mark(i)}`, 'data-option': String(i), text: tr(q.options[i]), disabled: answered,
      'aria-pressed': pressed(i), onclick: () => check(i),
    })));
  }
  if (q.type === 'blank') {
    input = h('div', {}, [
      h('p', { class: 'ex-template', 'data-template': true, text: tr(q.template) }),
      h('div', { class: 'ex-chips' }, displayOrder(q).map((i) => h('button', {
        type: 'button', class: `ex-chip${mark(i)}`, 'data-chip': String(i), text: tr(q.chips[i]), disabled: answered,
        'aria-pressed': pressed(i), onclick: () => check(i),
      }))),
    ]);
  }
  if (q.type === 'build' || q.type === 'steps') {
    const st = buildState();
    const isSteps = q.type === 'steps';
    hint = tr(isSteps ? UI.stepsHint : UI.buildHint);
    // Advanced builds have up to 22 cards: smaller cards, and the line stays in view.
    input = h('div', { class: `ex-build${isSteps ? ' is-steps' : ''}${q.exact ? ' is-advanced' : ''}` }, [
      h(isSteps ? 'ol' : 'div', { class: 'ex-line', 'data-line': true }, [
        isSteps ? null : h('span', { class: 'ex-eq', text: '=' }),
        ...st.line.map((id, pos) => h(isSteps ? 'li' : 'span', {}, [h('button', {
          type: 'button', class: 'ex-card is-placed', 'data-line-card': String(pos), text: st.bank.find((c) => c.id === id).text, disabled: answered,
          onclick: () => { view.input.build = tapLine(view.input.build, pos); redraw(`[data-line-card="${Math.max(0, pos - 1)}"], [data-card]`); },
        })])),
      ]),
      h('div', { class: 'ex-bank', 'data-bank': true }, st.bank.map((c, pos) => h('button', {
        type: 'button', class: 'ex-card', 'data-card': String(pos), text: c.text, disabled: answered || st.line.includes(c.id),
        onclick: () => { view.input.build = tapBank(view.input.build, pos); redraw('[data-card]:not([disabled]), [data-check]'); },
      }))),
      answered ? null : h('div', { class: 'ex-actions' }, [
        h('button', { type: 'button', class: 'btn ghost', 'data-clear': true, text: tr(UI.clear), onclick: () => { view.input.build = { ...view.input.build, line: [] }; redraw('[data-card]'); } }),
        h('button', { type: 'button', class: 'btn primary', 'data-check': true, text: tr(UI.check), onclick: () => check(lineTexts(buildState())) }),
      ]),
    ]);
  }
  if (q.type === 'cell') {
    hint = tr(UI.cellHint);
    const text = selectionText(view.input.sel);
    sheetOpts = {
      pick: answered ? null : (addr) => { view.input.sel = pickCell(view.input.sel, addr); redraw(`td[data-cell="${addr}"]`); },
      selected: cellsOf(text),
    };
    input = h('div', { class: 'ex-pick' }, [
      h('p', { class: 'ex-selection', 'data-selection': true, 'aria-live': 'polite', text: text || '—' }),
      answered ? null : h('div', { class: 'ex-actions' }, [
        h('button', { type: 'button', class: 'btn ghost', 'data-clear': true, text: tr(UI.clear), onclick: () => { view.input.sel = null; redraw('td[data-cell]'); } }),
        h('button', { type: 'button', class: 'btn primary', 'data-check': true, text: tr(UI.check), onclick: () => check(text) }),
      ]),
    ]);
  }

  // What the sheet shows: used cells after a right formula, or the "after" view.
  let after = null;
  if (g?.correct && g.cells) sheetOpts.used = g.cells;
  if (g?.correct && q.type === 'steps') {
    const v = applyAfter(SHEETS[lang], q.after, lang);
    after = h('div', { 'data-after': true }, [v.pivot ? renderPivot(v.pivot) : renderSheet(SHEETS[lang], { rows: v.rows, highlight: v.highlight })]);
  }

  // Why this answer falls short: a line per wrong pick, the result of a wrong
  // formula that still calculates, or the cell that was picked.
  let miss = null;
  if (g && !g.correct) {
    if (q.type === 'choice' || q.type === 'blank') {
      const fb = EXCEL_FEEDBACK[q.id]?.[view.input.picked];
      if (fb) miss = tr(fb);
    } else if (q.type === 'build' && g.value !== undefined) {
      // Right value, wrong shape (advanced builds grade by order): say so, rather
      // than show a result that looks right.
      const sameValue = q.exact && show(g.value) === show(q.result[lang]);
      miss = sameValue ? tr(ADVANCED_UI.orderHint) : fill(tr(EXCEL_FEEDBACK_UI.builtResult), { v: show(g.value) });
    } else if (q.type === 'cell' && typeof view.input.picked === 'string') {
      miss = fill(tr(EXCEL_FEEDBACK_UI.pickedCell), { c: view.input.picked });
    }
  }
  const feedback = g ? h('section', { class: `ex-feedback ${g.correct ? 'is-correct' : 'is-wrong'}` }, [
    miso(g.correct ? 'joy' : 'worry', 64),
    h('div', { class: `explanation ${g.correct ? 'is-correct' : 'is-wrong'}`, 'data-explanation': true }, [
      h('strong', { text: `${tr(g.correct ? UI.correct : UI.wrong)} ` }),
      ...(miss ? [h('span', { 'data-feedback': true, text: miss }), ' '] : []),
      document.createTextNode(tr(q.explanation)),
      g.correct && 'value' in g ? h('p', { 'data-result': true, text: fill(tr(UI.result), { v: show(g.value) }) }) : null,
      g.correct && g.cells?.length ? h('p', { class: 'ex-note', text: tr(UI.usedCells) }) : null,
    ]),
  ]) : null;

  show_(
    head,
    h('div', { class: 'ex-qhead' }, [
      answered ? null : miso('think', 56),
      h('p', { class: 'ex-count', 'data-count': true, tabindex: '-1', text: fill(tr(UI.questionOf), { i: view.qi + 1, n: lesson.questions.length }) }),
    ]),
    h('p', { class: 'prompt', 'data-prompt': true, text: tr(q.prompt) }),
    after ?? renderSheet(SHEETS[lang], sheetOpts),
    hint ? h('p', { class: 'ex-hint', text: hint }) : null,
    input,
    feedback,
    g ? h('div', { class: 'ex-actions' }, [
      g.correct ? null : h('button', { type: 'button', class: 'btn ghost', 'data-retry': true, text: tr(UI.retry), onclick: retry }),
      h('button', { type: 'button', class: 'btn primary', 'data-next': true, text: tr(UI.next), onclick: next }),
    ]) : null,
  );

  // ---- the list -------------------------------------------------------------------
  function list() {
    const allDone = EXCEL_LESSONS.every((l) => progress.completed.includes(l.id));
    const nextId = EXCEL_LESSONS.find((l) => !progress.completed.includes(l.id))?.id;
    const advancedDone = allDone && EXCEL_ADVANCED.every((l) => progress.completed.includes(l.id));
    // Once the basic lessons are done, Continue points at the first open advanced lesson left.
    const nextAdvanced = allDone ? EXCEL_ADVANCED.find((l) => !progress.completed.includes(l.id) && isOpen(progress, l.id))?.id : undefined;
    // "4·6" in Korean; "lessons 4 and 6" / "lesson 7" in English.
    const needs = (l) => (lang === 'en' ? `${l.requires.length > 1 ? 'lessons' : 'lesson'} ${l.requires.join(' and ')}` : l.requires.join('·'));
    show_(
      h('header', { class: 'ex-head' }, [
        h('h1', { tabindex: '-1', text: tr(UI.title) }),
      ]),
      h('section', { class: 'ex-intro' }, [miso('smile', 72), h('p', { text: tr(advancedDone ? ADVANCED_UI.advancedDone : allDone ? ADVANCED_UI.advancedNext : UI.intro) })]),
      h('ol', { class: 'ex-list' }, EXCEL_LESSONS.map((l) => {
        const open = isOpen(progress, l.id);
        const done = progress.completed.includes(l.id);
        const name = `${l.id}. ${tr(l.title)}`;
        const isNext = l.id === nextId;
        return h('li', { class: `ex-item${done ? ' is-done' : ''}${open ? '' : ' is-locked'}${isNext ? ' is-next' : ''}`, 'data-lesson': l.id }, [
          open ? h('a', { href: `#lesson-${l.id}`, text: name }) : h('span', { class: 'ex-name', text: name }),
          isNext ? h('a', { class: 'btn primary ex-go', href: `#lesson-${l.id}`, text: tr(progress.completed.length ? UI.continue : UI.start), 'aria-hidden': 'true', tabindex: '-1' }) : null,
          done ? h('span', { class: 'ex-score', text: `✓ ${fill(tr(UI.score), { n: progress.scores[l.id] ?? 0 })}` }) : null,
          open ? null : h('span', { class: 'ex-locked', text: tr(UI.locked) }),
        ]);
      })),
      h('section', { class: 'ex-advanced', 'data-advanced': true }, [
        h('h2', { text: tr(ADVANCED_UI.advancedHeading) }),
        h('p', { class: 'muted', text: tr(ADVANCED_UI.advancedNote) }),
        h('ol', { class: 'ex-list', start: '12' }, EXCEL_ADVANCED.map((l) => {
          const open = isOpen(progress, l.id);
          const done = progress.completed.includes(l.id);
          const name = `${l.id}. ${tr(l.title)}`;
          const isNext = l.id === nextAdvanced;
          return h('li', { class: `ex-item${done ? ' is-done' : ''}${open ? '' : ' is-locked'}${isNext ? ' is-next' : ''}`, 'data-lesson': l.id }, [
            open ? h('a', { href: `#lesson-${l.id}`, text: name }) : h('span', { class: 'ex-name', text: name }),
            isNext ? h('a', { class: 'btn primary ex-go', href: `#lesson-${l.id}`, text: tr(UI.continue), 'aria-hidden': 'true', tabindex: '-1' }) : null,
            done ? h('span', { class: 'ex-score', text: `✓ ${fill(tr(UI.score), { n: progress.scores[l.id] ?? 0 })}` }) : null,
            open ? null : h('span', { class: 'ex-locked', text: fill(tr(ADVANCED_UI.lockedAfter), { list: needs(l) }) }),
          ]);
        })),
      ]),
    );
  }
}

// 'C2:C9' → every address inside; 'E9' → ['E9'].
function cellsOf(text) {
  if (!text) return [];
  const [a, b = a] = text.split(':');
  const [, c1, r1] = /^([A-Z])(\d+)$/.exec(a);
  const [, c2, r2] = /^([A-Z])(\d+)$/.exec(b);
  const out = [];
  for (let c = c1.charCodeAt(0); c <= c2.charCodeAt(0); c += 1) {
    for (let r = Number(r1); r <= Number(r2); r += 1) out.push(`${String.fromCharCode(c)}${r}`);
  }
  return out;
}
