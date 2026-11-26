// Today's practice page: follows the shared language choice and uses the
// phone's local date. Redraws when shown again or brought back to the front,
// so a page left open overnight moves to the new day.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { PRACTICE_UI as UI } from './data.js';
import { renderPractice, newPracticeView } from './render.js';
import { localDate } from './engine.js';
import { loadRole } from '../shared/role.js';

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
let view = newPracticeView();
let day = localDate();

function draw() {
  const today = localDate();
  if (today !== day) {
    day = today;
    view = newPracticeView();
  }
  document.documentElement.lang = lang;
  document.title = t(UI.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  renderPractice(app, lang, storage, day, view, { clock: localDate, onDay: (d) => { day = d; }, role: loadRole(storage) });
}

draw();
window.addEventListener('pageshow', (event) => { if (event.persisted) draw(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && localDate() !== day) draw(); });
