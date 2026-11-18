// Glossary page: keeps the search state, follows the language choice shared
// with the course, and opens a term when the address names one (#aht).
import { loadLang, saveLang } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { LESSONS } from '../agent-lifecycle/js/lessons/index.js';
import { TERMS } from './terms.js';
import { findTerm } from './filter.js';
import { renderGlossary } from './render.js';

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
const lessons = LESSONS.map((l) => ({ id: l.id, title: l.title }));

let lang = loadLang(storage);
const state = { query: '', category: 'all', focusId: null };

function draw() {
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  document.title = lang === 'ko' ? '용어집' : 'Glossary';
  renderGlossary(app, TERMS, state, lang, {
    lessons,
    onQuery: (q) => { state.query = q; state.focusId = null; draw(); },
    onCategory: (c) => { state.category = c; state.focusId = null; draw(); },
  });
}

// An address like #aht clears the filters and brings that card into view.
function openFromAddress() {
  const term = findTerm(TERMS, location.hash);
  if (term) {
    state.query = '';
    state.category = 'all';
    state.focusId = term.id;
  }
  draw();
  if (term) {
    const card = document.getElementById(term.id);
    card?.scrollIntoView({ block: 'center' });
    card?.focus({ preventScroll: true });
  }
}

window.addEventListener('hashchange', openFromAddress);
openFromAddress();
