// Codex one-pagers: reads the address, follows the language choice shared
// with the rest of the site, and shows the list or one one-pager.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { CODEX_UI as UI } from './ui.js';
import { renderCodexHome } from './render/home.js';
import { renderPage, parseCodexRoute, newState } from './render/page.js';

function getStorage() {
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

const storage = getStorage();
const app = document.getElementById('app');
const langRoot = document.getElementById('lang');
const brand = document.getElementById('brand');
let lang = loadLang(storage);
const state = newState(); // kept while the page is open, so a language switch keeps open cards
let shown = null;

function render() {
  document.documentElement.lang = lang;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    render();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  brand.textContent = t(UI.title, lang).text;
  const route = parseCodexRoute(location.hash);
  if (route.view === 'home') renderCodexHome(app, lang);
  else renderPage(app, route.view, lang, state);
  document.title = route.view === 'home' ? t(UI.title, lang).text : `${app.querySelector('h1').textContent} · ${t(UI.title, lang).text}`;
  if (shown !== route.view) {
    window.scrollTo(0, 0);
    // After moving between pages, start keyboard and screen-reader users at the new title.
    if (shown !== null) {
      const title = app.querySelector('h1');
      title.setAttribute('tabindex', '-1');
      title.focus();
    }
    shown = route.view;
  }
}

window.addEventListener('hashchange', render);
render();
