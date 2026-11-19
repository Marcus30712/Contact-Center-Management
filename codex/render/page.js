// Frame shared by the four one-pagers: links between pages, title, body and
// the before/after links. Choices (open cards, tabs) live in `state`, so a
// redraw or a language switch puts the reader back where they were.
import { h } from '../../agent-lifecycle/js/render/dom.js';
import { t } from '../../agent-lifecycle/js/engine/i18n.js';
import { CODEX_UI as UI, PAGES } from '../ui.js';
import { LINKS } from '../data/links.js';
import { relatedLinks } from './parts.js';
import { principlesBody } from './principles.js';
import { teamsBody } from './teams.js';
import { careerBody } from './career.js';
import { dailyBody } from './daily.js';

const BODIES = { principles: principlesBody, teams: teamsBody, career: careerBody, daily: dailyBody };

export function parseCodexRoute(hash) {
  const id = String(hash || '').replace(/^#/, '');
  return id in BODIES ? { view: id } : { view: 'home' };
}

export function newState() {
  return { principles: new Set(), team: null, careerTeam: null, careerLevel: null, dailyRole: null, dailyPick: null, focus: null };
}

export function renderPage(root, id, lang, state) {
  const tr = (text) => t(text, lang).text;
  const page = PAGES.find((p) => p.id === id);
  const redraw = (focus) => {
    renderPage(root, id, lang, state);
    if (focus) root.querySelector(focus)?.focus();
  };
  root.replaceChildren(
    h('a', { class: 'home-link cx-home', href: '#home', 'data-home': true, text: `← ${tr(UI.home)}` }),
    h('nav', { class: 'cx-pagenav', 'data-pages': true, 'aria-label': tr(UI.pageTabs) }, [
      h('ol', {}, PAGES.map((p, i) => h('li', {}, [h('a', {
        href: `#${p.id}`, 'aria-current': p.id === id ? 'page' : false, title: tr(p.title),
      }, [h('span', { class: 'cx-num', 'aria-hidden': 'true', text: String(i + 1) }), h('span', { class: 'cx-pagenav-label', text: tr(p.title) })])]))),
    ]),
    h('header', { class: 'glossary-head' }, [h('h1', { text: tr(page.title) }), h('p', { class: 'tagline', text: tr(page.blurb) })]),
    ...BODIES[id](lang, state, redraw),
    relatedLinks(LINKS[id], tr, UI),
  );
}
