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
import { PRINCIPLES } from '../data/principles.js';
import { TEAMS } from '../data/teams.js';
import { DAILY } from '../data/daily.js';

const BODIES = { principles: principlesBody, teams: teamsBody, career: careerBody, daily: dailyBody };

// Items a page can open from its address, e.g. #teams-ta.
const ITEMS = {
  principles: PRINCIPLES.items.map((x) => x.id),
  teams: TEAMS.items.map((x) => x.id),
  daily: DAILY.roles.map((x) => x.id),
};

export function parseCodexRoute(hash) {
  const name = String(hash || '').replace(/^#/, '');
  const cut = name.indexOf('-');
  const view = cut === -1 ? name : name.slice(0, cut);
  if (!(view in BODIES)) return { view: 'home' };
  if (cut === -1) return { view };
  const item = name.slice(cut + 1);
  return ITEMS[view]?.includes(item) ? { view, item } : { view: 'home' };
}

// Put the item named in the address into the page state.
export function openItem(state, view, item) {
  if (view === 'teams') state.team = item;
  if (view === 'principles') state.principles.add(item);
  if (view === 'daily') { state.dailyRole = item; state.dailyPick = null; }
  return state;
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
