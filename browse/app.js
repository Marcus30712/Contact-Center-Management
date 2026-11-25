// Browse page: follows the language choice shared with the rest of the site.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { renderBrowse, BROWSE_UI } from './render.js';

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

function draw() {
  document.documentElement.lang = lang;
  document.title = t(BROWSE_UI.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  renderBrowse(app, lang);
}

draw();
window.addEventListener('pageshow', (event) => { if (event.persisted) { lang = loadLang(storage); draw(); } });
