// SME course: reads the address, follows the language choice shared with the
// rest of the site, and shows either the list or one lesson. Built like the
// SOP Library, on the lifecycle course's player and lesson screen.
import { parseRoute } from '../agent-lifecycle/js/engine/router.js';
import { loadProgress, markComplete } from '../agent-lifecycle/js/engine/progress.js';
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLesson } from '../agent-lifecycle/js/render/lesson.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { SME_LESSONS } from './lessons/index.js';
import { SME_UI, SME_PROGRESS_KEY } from './ui.js';
import { renderSmeHome } from './home.js';

// Browser storage can be missing or blocked; then everything stays in memory.
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
const lessonIds = SME_LESSONS.map((l) => l.id);

let lang = loadLang(storage);
const completed = new Set(loadProgress(storage, SME_PROGRESS_KEY).completed);
let current = null; // { id, lang, view } while a lesson is on screen

function setLang(next) {
  lang = next;
  saveLang(storage, lang);
  render();
  langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
}

function leaveLesson() {
  if (current) current.view.destroy();
  current = null;
}

function render() {
  renderLangToggle(langRoot, lang, setLang);
  brand.textContent = t(SME_UI.courseTitle, lang).text;
  document.title = t(SME_UI.courseTitle, lang).text;

  const route = parseRoute(location.hash, lessonIds);
  if (route.view === 'home') {
    leaveLesson();
    renderSmeHome(app, SME_LESSONS, { completed: [...completed] }, lang);
    window.scrollTo(0, 0);
    return;
  }

  // Same lesson and language: just move to the step in the address.
  if (current && current.id === route.id && current.lang === lang) {
    current.view.goTo(route.step);
    return;
  }

  // Same lesson in a new language: rebuild, but keep an open checkpoint.
  const restore = current && current.id === route.id ? current.view.snapshot() : undefined;
  leaveLesson();
  const view = renderLesson(app, SME_LESSONS.find((l) => l.id === route.id), route.step, lang, {
    restore,
    track: 'general', // one course for every team type
    lessonCount: SME_LESSONS.length,
    text: SME_UI,
    onNavigate: (href) => { location.hash = href; },
    onComplete: (id) => {
      completed.add(id);
      markComplete(storage, id, SME_PROGRESS_KEY);
    },
  });
  current = { id: route.id, lang, view };
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
