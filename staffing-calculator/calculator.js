// Staffing Lab page: holds the slider values, follows the language choice
// shared with the course, and redraws the results on every move.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { initialValues } from './model.js';
import { STAFFING_TEXT as T } from './text.js';
import { renderCalculator } from './render.js';

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
let values = initialValues();
let view;

function draw() {
  document.documentElement.lang = lang;
  document.title = t(T.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  view = renderCalculator(app, values, lang, {
    onInput: (id, value) => {
      values = { ...values, [id]: value };
      view.update(values);
    },
  });
}

draw();
