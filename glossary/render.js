// Draws the glossary: heading, search box, category buttons and term cards.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { lessonHref } from '../agent-lifecycle/js/engine/router.js';
import { CATEGORIES } from './schema.js';
import { filterTerms } from './filter.js';

export const GLOSSARY_UI = {
  title: { ko: '용어집', en: 'Glossary' },
  intro: {
    ko: '강의와 운영 지침서에 나오는 용어를 찾아보세요.',
    en: 'Look up the terms used in the course and the operations guide.',
  },
  back: { ko: 'Queuecraft', en: 'Queuecraft' },
  searchLabel: { ko: '용어 검색', en: 'Search terms' },
  categoryLabel: { ko: '분류', en: 'Category' },
  all: { ko: '전체', en: 'All' },
  categories: {
    metric: { ko: '지표', en: 'Metrics' },
    role: { ko: '사람과 역할', en: 'People and roles' },
    process: { ko: '절차', en: 'Processes' },
    tool: { ko: '도구와 기록', en: 'Tools and records' },
  },
  empty: { ko: '찾는 용어가 없습니다.', en: 'No matching terms.' },
  seen: { ko: '강의에서 보기', en: 'See it in the course' },
  sop: { ko: 'SOP 라이브러리에서 보기', en: 'See it in the SOP Library' },
  count: { ko: '개', en: 'terms' },
  translationComing: { ko: '영어 번역 준비 중', en: 'Translation coming soon' },
};

const other = (lang) => (lang === 'ko' ? 'en' : 'ko');

function termCard(term, lang, focusId, lessons) {
  const tr = (text) => t(text, lang).text;
  const links = (term.seen ?? [])
    .map((id) => lessons.find((l) => l.id === id))
    .filter(Boolean)
    .map((lesson) => h('a', {
      'data-seen': true, class: 'seen-link',
      href: `../agent-lifecycle/${lessonHref(lesson.id, 0)}`, text: tr(lesson.title),
    }));
  return h('li', {}, [
    h('article', {
      class: term.id === focusId ? 'term-card is-focus' : 'term-card', id: term.id, 'data-term': term.id,
      tabindex: term.id === focusId ? '-1' : null, // lets the page move keyboard focus to an opened term
    }, [
      h('div', { class: 'term-head' }, [
        h('h2', { 'data-term-label': true, text: term.term }),
        h('span', { class: 'term-category', text: tr(GLOSSARY_UI.categories[term.category]) }),
      ]),
      h('p', { class: 'term-names' }, [
        // A name that only repeats the label (e.g. "Agent") is left out.
        tr(term.name) !== term.term ? h('strong', { 'data-term-name': true, text: tr(term.name) }) : null,
        term.name[other(lang)] && term.name[other(lang)] !== term.term
          ? h('span', { 'data-term-alt': true, lang: other(lang), text: term.name[other(lang)] }) : null,
      ]),
      h('p', { class: 'term-definition', 'data-definition': true, text: tr(term.definition) }),
      links.length ? h('p', { class: 'term-seen' }, [h('span', { text: `${tr(GLOSSARY_UI.seen)}: ` }), ...links]) : null,
      // The step-by-step procedure for this term, in the SOP Library course.
      term.sop ? h('p', { class: 'term-seen' }, [h('a', {
        'data-sop-link': true, class: 'seen-link', href: `../sop-library/${lessonHref(term.sop, 0)}`, text: tr(GLOSSARY_UI.sop),
      })]) : null,
    ]),
  ]);
}

// state = { query, category, focusId }. The first call (or a language change)
// builds the frame; later calls only update the buttons and the list, so the
// search box keeps its focus while the learner types.
export function renderGlossary(root, terms, state, lang, { onQuery, onCategory, lessons = [] }) {
  const tr = (text) => t(text, lang).text;
  document.documentElement.lang = lang;

  if (root.getAttribute('data-glossary-lang') !== lang) {
    root.setAttribute('data-glossary-lang', lang);
    const search = h('input', {
      type: 'search', id: 'glossary-search', class: 'glossary-search', 'data-search': true,
      placeholder: tr(GLOSSARY_UI.searchLabel), 'aria-label': tr(GLOSSARY_UI.searchLabel), autocomplete: 'off',
      oninput: (e) => onQuery(e.target.value),
    });
    search.value = state.query;
    const button = (id, label) => h('button', {
      type: 'button', class: 'chip', 'data-category': id, text: tr(label), onclick: () => onCategory(id),
    });
    root.replaceChildren(
      h('header', { class: 'glossary-head' }, [
        h('a', { class: 'home-link', 'data-back': true, href: '../', text: `← ${tr(GLOSSARY_UI.back)}` }),
        h('h1', { text: tr(GLOSSARY_UI.title) }),
        h('p', { class: 'tagline', text: tr(GLOSSARY_UI.intro) }),
        h('p', { class: 'translation-note', 'data-translation-note': true, hidden: true }),
      ]),
      h('div', { class: 'glossary-tools' }, [
        search,
        h('div', { class: 'chips', role: 'group', 'aria-label': tr(GLOSSARY_UI.categoryLabel) }, [
          button('all', GLOSSARY_UI.all),
          ...CATEGORIES.map((c) => button(c, GLOSSARY_UI.categories[c])),
        ]),
        h('p', { class: 'glossary-count', 'data-count': true, 'aria-live': 'polite' }),
      ]),
      h('p', { class: 'glossary-empty', 'data-empty': true, hidden: true, text: tr(GLOSSARY_UI.empty) }),
      h('ul', { class: 'term-list', 'data-list': true }),
    );
  }

  const search = root.querySelector('[data-search]');
  if (search.value !== state.query) search.value = state.query;
  for (const b of root.querySelectorAll('[data-category]')) {
    b.setAttribute('aria-pressed', String(b.getAttribute('data-category') === state.category));
  }

  const shown = filterTerms(terms, { query: state.query, category: state.category, lang });
  root.querySelector('[data-count]').textContent = `${shown.length}${lang === 'ko' ? '' : ' '}${tr(GLOSSARY_UI.count)}`;
  root.querySelector('[data-empty]').hidden = shown.length > 0;
  root.querySelector('[data-list]').replaceChildren(...shown.map((term) => termCard(term, lang, state.focusId, lessons)));

  const fallback = lang === 'en' && shown.some((term) => !term.name.en || !term.definition.en);
  const note = root.querySelector('[data-translation-note]');
  note.hidden = !fallback;
  note.textContent = fallback ? tr(GLOSSARY_UI.translationComing) : '';
}
