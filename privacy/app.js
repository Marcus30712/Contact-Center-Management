// Privacy policy page: follows the language choice shared with the rest of the site.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { PRIVACY_TEXT as T } from './text.js';
import { renderPrivacy } from './render.js';

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
  document.title = t(T.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  renderPrivacy(app, lang);
}

draw();
// Coming back with the browser's back button: pick up a language changed elsewhere.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) { lang = loadLang(storage); draw(); }
});
