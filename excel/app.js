// Miso's Excel practice: follows the shared language choice and the address
// (#lesson-N or the list), and keeps the learner's place across redraws.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { EXCEL_UI as UI } from './data.js';
import { renderExcel, newExcelView } from './render.js';
import { loadRole, showsAdvancedExcel } from '../shared/role.js';

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
const view = newExcelView();
const route = () => decodeURIComponent(window.location.hash.replace(/^#/, ''));

function draw(focusTitle) {
  document.documentElement.lang = lang;
  document.title = t(UI.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  renderExcel(app, lang, storage, route(), view, { advanced: showsAdvancedExcel(loadRole(storage)) });
  if (focusTitle) app.querySelector('h1')?.focus();
}

draw();
window.addEventListener('hashchange', () => { window.scrollTo(0, 0); draw(true); });
window.addEventListener('pageshow', (event) => { if (event.persisted) draw(); });
