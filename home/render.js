// The home screen: Miso's greeting, "my learning" for the two courses, the
// situation guide, then the topics to learn and to browse.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { loadProgress } from '../agent-lifecycle/js/engine/progress.js';
import { LESSONS } from '../agent-lifecycle/js/lessons/index.js';
import { SOP_LESSONS } from '../sop-library/lessons/index.js';
import { EXCEL_LESSONS, EXCEL_UI } from '../excel/data.js';
import { HOME_UI as UI, LEARN, BROWSE, GUIDE_CARD } from './data.js';
import { PRACTICE_UI as P } from '../practice/data.js';
import { loadState, pool, streak, localDate, ensureToday } from '../practice/engine.js';
import { COURSE_ROLES, DEFAULT_ROLE } from '../shared/role.js';
import { ROLE_UI, ROLE_NAMES } from '../shared/role-data.js';

// The learner's own role first, everything else in its usual order (2026-11-25).
export function orderByRole(items, role) {
  return [...items.filter((x) => x.role === role), ...items.filter((x) => x.role !== role)];
}

const COURSES = [
  { id: 'lifecycle', role: 'tl', name: UI.lifecycle, lessons: LESSONS, key: 'agent-lifecycle-course:v1', path: './agent-lifecycle/' },
  { id: 'sop', role: 'tl', name: UI.sop, lessons: SOP_LESSONS, key: 'sop-library:v1', path: './sop-library/' },
  {
    id: 'excel', name: EXCEL_UI.homeCard, key: 'excel-practice:v1', path: './excel/',
    lessons: EXCEL_LESSONS.map((l, i) => ({ id: l.id, order: i + 1, title: l.title })),
    href: (lesson) => `./excel/#lesson-${lesson.id}`,
  },
];

// Progress for the three courses, read from the keys each course already uses.
// The next lesson is the first one, in course order, not yet finished.
export function myLearning(storage, role = DEFAULT_ROLE) {
  const rows = orderByRole(COURSES, role).map((course) => {
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
  rows.started = rows.some((r) => r.done > 0);
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
  const cardEl = (c) => h('li', {}, [h('a', { class: 'card', href: c.href }, [h('strong', { text: tr(c.title) }), h('span', { text: tr(c.text) })])]);

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
    // The approved wording names lifecycle lesson 1, so the link goes there whatever the order.
    note = h('p', { class: 'hm-note', 'data-start': true }, [h('a', { href: learning.find((r) => r.id === 'lifecycle').next.href, text: tr(UI.start) })]);
  } else if (learning.allDone) {
    note = h('p', { class: 'hm-note', 'data-all-done': true, text: tr(UI.allDone) });
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
      COURSE_ROLES.includes(role) ? null : h('div', { class: 'hm-note', 'data-role-preparing': true }, [
        h('p', { text: tr(ROLE_UI.preparing).replace('{role}', tr(ROLE_NAMES[role])) }),
        h('p', {}, [
          h('a', { href: './codex/#career', text: tr(ROLE_UI.preparingCareer) }),
          ' ',
          h('a', { href: `./codex/#daily-${role}`, text: tr(ROLE_UI.preparingDaily) }),
        ]),
      ]),
    ]),
    h('div', { class: 'hm-cards' }, [practiceCard(tr, storage, today)]),
    h('ul', { class: 'hm-cards' }, [cardEl(GUIDE_CARD)]),
    h('section', { id: 'learn' }, [h('h2', { text: tr(UI.learn) }), h('ul', { class: 'hm-cards' }, orderByRole(LEARN, role).map(cardEl))]),
    h('section', { id: 'browse' }, [h('h2', { text: tr(UI.browse) }), h('ul', { class: 'hm-cards' }, BROWSE.map(cardEl))]),
    h('p', { class: 'hm-privacy' }, [h('a', { href: './privacy/', 'data-privacy': true, text: tr(UI.privacy) })]),
  );
}
