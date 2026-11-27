// Agent Situation Guide page (2026-11-27): the team-lead guide's page with the agent
// situations. Follows the shared language choice and keeps the chosen group and
// open cards across a switch.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { renderGuide, newGuideState } from '../guide/render.js';
import { AGENT_GUIDE_UI, AGENT_GROUPS } from './data.js';

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
const state = newGuideState();

function draw() {
  document.documentElement.lang = lang;
  document.title = t(AGENT_GUIDE_UI.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  renderGuide(app, lang, state, { ui: AGENT_GUIDE_UI, groups: AGENT_GROUPS });
}

draw();
// Coming back with the browser's back button: pick up a language changed elsewhere.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) { lang = loadLang(storage); draw(); }
});
