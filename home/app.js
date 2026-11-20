// Home page: follows the shared language choice and redraws "my learning"
// whenever the page is shown again (for example after finishing a lesson).
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { HOME_UI as UI } from './data.js';
import { renderHome } from './render.js';

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
  document.title = t(UI.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  renderHome(app, lang, storage);
}

let day = new Date().toDateString();
draw();
// A home screen left open past midnight shows the new day's practice.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && new Date().toDateString() !== day) { day = new Date().toDateString(); draw(); }
});
// Coming back with the browser's back button can show a cached page; refresh the numbers.
window.addEventListener('pageshow', (event) => { if (event.persisted) draw(); });
