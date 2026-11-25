// Review quiz page: follows the shared language choice and the saved role;
// the address (#tl, #sme) opens a quiz when it is open, otherwise the list.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { loadRole } from '../shared/role.js';
import { REVIEW_UI as UI } from './data.js';
import { renderReview, newReviewView, routeRole } from './render.js';

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
let lang = loadLang(storage);
let view = newReviewView();

function draw() {
  document.documentElement.lang = lang;
  document.title = t(UI.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  renderReview(app, lang, storage, view, loadRole(storage), draw);
}

function fromAddress() {
  view = newReviewView();
  view.role = routeRole(location.hash, storage);
  draw();
}

window.addEventListener('hashchange', fromAddress);
window.addEventListener('pageshow', (event) => { if (event.persisted) fromAddress(); });
fromAddress();
