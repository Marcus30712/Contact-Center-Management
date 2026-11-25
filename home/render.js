// The home screen: Miso's greeting, "my learning" for the two courses, the
// situation guide, then the topics to learn and to browse.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { loadProgress } from '../agent-lifecycle/js/engine/progress.js';
import { EXCEL_LESSONS, EXCEL_UI } from '../excel/data.js';
import { SME_UI } from '../sme/ui.js';
import { SL_UI } from '../sme-lifecycle/ui.js';
import { SS_UI } from '../sme-sop/ui.js';
import { TL_UI } from '../tl/ui.js';
import { TS_UI } from '../tl-support/ui.js';
import { HOME_UI as UI } from './data.js';
import { HOME_COPY, homeFor, withRole } from './role-home.js';
import { PRACTICE_UI as P } from '../practice/data.js';
import { loadState, pool, streak, localDate, ensureToday } from '../practice/engine.js';
import { DEFAULT_ROLE, coursesFor, roleOf } from '../shared/role.js';
import { COURSE_INFO } from '../shared/courses.js';
import { REVIEW_UI } from '../review/data.js';
import { loadReview, unlocked } from '../review/engine.js';

// The learner's own role first, everything else in its usual order (2026-11-25).
export function orderByRole(items, role) {
  return [...items.filter((x) => x.role === role), ...items.filter((x) => x.role !== role)];
}

// A role's course, from the shared course list.
const course = (id, name) => {
  const c = COURSE_INFO[id];
  return { id, role: roleOf(id), name, lessons: c.lessons, key: c.key, path: `./${c.dir}` };
};

const COURSES = [
  course('tl', TL_UI.courseTitle),
  course('lifecycle', UI.lifecycle),
  course('tl-support', TS_UI.courseTitle),
  course('sop', UI.sop),
  {
    id: 'excel', name: EXCEL_UI.homeCard, key: 'excel-practice:v1', path: './excel/',
    lessons: EXCEL_LESSONS.map((l, i) => ({ id: l.id, order: i + 1, title: l.title })),
    href: (lesson) => `./excel/#lesson-${lesson.id}`,
  },
  course('sme', SME_UI.courseTitle),
  course('sme-lifecycle', SL_UI.courseTitle),
  course('sme-sop', SS_UI.courseTitle),
];

// Progress for the three courses, read from the keys each course already uses.
// The next lesson is the first one, in course order, not yet finished.
// Only the role's own courses and the shared ones (Excel) are shown (2026-11-25).
const shownFor = (role) => COURSES.filter((c) => !c.role || coursesFor(role).includes(c.id));

export function myLearning(storage, role = DEFAULT_ROLE) {
  const rows = orderByRole(shownFor(role), role).map((course) => {
    const done = new Set(storage ? loadProgress(storage, course.key).completed : []);
    const ordered = [...course.lessons].sort((a, b) => a.order - b.order);
    const next = ordered.find((l) => !done.has(l.id));
    return {
      id: course.id,
      name: course.name,
      done: ordered.filter((l) => done.has(l.id)).length,
      total: ordered.length,
      next: next ? { id: next.id, order: next.order, title: next.title, href: course.href ? course.href(next) : `${course.path}#${next.id}-0` } : null,
    };
  });
  // Progress in any course counts, even one not shown for this role.
  rows.started = rows.some((r) => r.done > 0)
    || (storage ? COURSES.some((c) => loadProgress(storage, c.key).completed.length > 0) : false);
  rows.allDone = rows.every((r) => r.next === null);
  return rows;
}

// The "today's practice" card: locked, today's progress, or done, with the streak.
function practiceCard(tr, storage, today) {
  const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');
  const open = storage ? pool(storage) : [];
  const parts = [h('strong', { text: tr(P.homeCard) })];
  if (!open.length) {
    parts.push(h('span', { text: tr(P.homeLocked) }));
  } else {
    const st = ensureToday(storage ? loadState(storage) : { days: [], today: null, questions: {}, cards: {}, badges: {} }, open, today, pool(storage, { allTracks: true }));
    const run = streak(st.days, today);
    const total = st.today?.date === today ? st.today.ids.length : Math.min(3, open.length);
    const answered = st.today?.date === today ? Object.keys(st.today.answers).filter((k) => st.today.ids.includes(k)).length : 0;
    const done = st.days.includes(today);
    parts.push(h('span', { text: done ? tr(P.homeDone) : fill(tr(P.homeToday), { x: answered, n: total }) }));
    const line = run.pending ? fill(tr(P.streakPending), { n: run.count + 1 }) : fill(tr(P.streak), { n: run.count });
    parts.push(h('span', { class: 'hm-practice-streak', text: line }));
  }
  return h('a', { class: 'card hm-practice', href: './practice/', 'data-practice': true }, parts);
}

export function renderHome(root, lang, storage, today = localDate(), role = DEFAULT_ROLE) {
  const tr = (text) => t(text, lang).text;
  const learning = myLearning(storage, role);
  // A ready card is a link; a coming-soon card is not, and says so.
  const cardEl = (c) => h('li', {}, [c.href
    ? h('a', { class: 'card', href: c.href }, [h('strong', { text: tr(c.title) }), h('span', { text: tr(c.text) })])
    : h('div', { class: 'card is-soon', 'data-soon': c.id }, [
      h('strong', { text: tr(c.title) }),
      h('span', { class: 'hm-soon-mark', 'data-soon-mark': true, text: tr(HOME_COPY.soonMark) }),
      h('span', { 'data-soon-text': true, text: tr(c.codex ? withRole(HOME_COPY.soonText, role) : c.text) }),
      c.codex ? h('span', { class: 'hm-soon-links' }, [
        h('a', { href: './codex/#career', text: tr(HOME_COPY.soonCareer) }), ' ',
        h('a', { href: `./codex/#daily-${role}`, text: tr(HOME_COPY.soonDaily) }),
      ]) : null,
    ])]);
  const cards = homeFor(role);

  const reviewHref = (row) => COURSES.find((c) => c.id === row.id).path;
  const courseRow = (row) => h('li', { class: 'hm-course', 'data-course': row.id }, [
    h('div', { class: 'hm-course-head' }, [
      h('strong', { text: tr(row.name) }),
      h('span', { class: 'hm-count', text: `${row.done}/${row.total}` }),
    ]),
    h('progress', { max: row.total, value: row.done, 'aria-label': `${tr(row.name)} ${row.done}/${row.total}` }),
    row.next
      ? h('a', { class: 'hm-next', href: row.next.href, 'data-next': row.id }, [
        h('span', { text: tr(UI.continue) }), ` ${tr(UI.lessonWord)} ${row.next.order} · ${tr(row.next.title)} →`,
      ])
      : h('a', { class: 'hm-next hm-done', href: reviewHref(row), 'data-review': row.id, text: `✓ ${tr(UI.courseDone)} · ${tr(UI.review)} →` }),
  ]);

  let note = null;
  if (!learning.started) {
    // A new SME starts on SME First Steps and a new team leader on TL First Steps (2026-11-25).
    // The start course may not be among the rows shown (roles without a course), so look it up in all courses.
    // Roles without a course of their own start on Excel lesson 1 (2026-11-25).
    const [startId, startText] = role === 'sme' ? ['sme', SME_UI.startNote] : role === 'tl' ? ['tl', TL_UI.startNote] : ['excel', HOME_COPY.startExcel];
    const startCourse = COURSES.find((c) => c.id === startId);
    const first = [...startCourse.lessons].sort((a, b) => a.order - b.order)[0];
    const href = startCourse.href ? startCourse.href(first) : `${startCourse.path}#${first.id}-0`;
    note = h('p', { class: 'hm-note', 'data-start': true }, [h('a', { href, text: tr(startText) })]);
  } else if (learning.allDone) {
    note = h('p', { class: 'hm-note', 'data-all-done': true, text: tr(UI.allDone) });
  }

  // Once the role's courses are all done, its review quiz is offered here.
  function quizCard() {
    if (!storage || !unlocked(storage, role).open) return null;
    const rec = loadReview(storage)[role];
    const text = rec?.passed ? tr(REVIEW_UI.homeDone).replace('{x}', rec.best).replace('{n}', rec.total) : tr(REVIEW_UI.homeStart);
    return h('p', { class: 'hm-note' }, [h('a', { href: `./review/#${role}`, 'data-review-quiz': true, text })]);
  }

  root.replaceChildren(
    h('header', { class: 'hm-head' }, [
      h('h1', { text: tr(UI.title) }),
      h('p', { class: 'hm-tagline', text: tr(UI.tagline) }),
    ]),
    h('section', { class: 'hm-miso', 'aria-label': tr(UI.myLearning) }, [
      h('div', { class: 'hm-hello' }, [
        h('img', { src: './assets/miso/grin.webp', alt: tr(UI.misoAlt), width: 157, height: 227, 'data-miso': 'grin' }),
        h('div', { class: 'hm-bubble', 'data-greeting': true }, [
          h('p', { text: tr(UI.greeting) }),
          h('p', { class: 'hm-role', text: `— ${tr(UI.misoRole)}` }),
        ]),
      ]),
      h('h2', { text: tr(UI.myLearning) }),
      learning.started ? h('ul', { class: 'hm-courses' }, learning.map(courseRow)) : null,
      note,
      quizCard(),
    ]),
    h('div', { class: 'hm-cards' }, [practiceCard(tr, storage, today)]),
    h('ul', { class: 'hm-cards' }, [cardEl(cards.guide)]),
    h('section', { id: 'learn' }, [h('h2', { text: tr(UI.learn) }), h('ul', { class: 'hm-cards' }, cards.learn.map(cardEl))]),
    h('p', { class: 'hm-privacy' }, [h('a', { href: './privacy/', 'data-privacy': true, text: tr(UI.privacy) })]),
  );
}
