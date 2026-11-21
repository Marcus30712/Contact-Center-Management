// SOP Library course: reads the address, follows the language choice shared
// with the rest of the site, and shows either the list or one SOP lesson.
// It reuses the lifecycle course's player and lesson screen.
import { parseRoute } from '../agent-lifecycle/js/engine/router.js';
import { loadProgress, markComplete } from '../agent-lifecycle/js/engine/progress.js';
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLesson } from '../agent-lifecycle/js/render/lesson.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { SOP_LESSONS } from './lessons/index.js';
import { SOP_UI, SOP_PROGRESS_KEY } from './ui.js';
import { settleGuide } from '../guide/link.js';
import { renderSopHome } from './home.js';

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
const lessonIds = SOP_LESSONS.map((l) => l.id);

let lang = loadLang(storage);
const completed = new Set(loadProgress(storage, SOP_PROGRESS_KEY).completed);
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
  brand.textContent = t(SOP_UI.courseTitle, lang).text;
  document.title = t(SOP_UI.courseTitle, lang).text;

  const route = parseRoute(location.hash, lessonIds);
  // Run on every draw, list included, so ?guide only lives on its own lesson.
  const guide = settleGuide(location, history, 'sop-library', route.view === 'home' ? undefined : route.id);
  if (route.view === 'home') {
    leaveLesson();
    renderSopHome(app, SOP_LESSONS, { completed: [...completed] }, lang);
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
  const view = renderLesson(app, SOP_LESSONS.find((l) => l.id === route.id), route.step, lang, {
    restore,
    track: 'general', // SOPs are common to every team type
    lessonCount: SOP_LESSONS.length,
    text: SOP_UI,
    guide,
    onNavigate: (href) => { location.hash = href; },
    onComplete: (id) => {
      completed.add(id);
      markComplete(storage, id, SOP_PROGRESS_KEY);
    },
  });
  current = { id: route.id, lang, view };
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
