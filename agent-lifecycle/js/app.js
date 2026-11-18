// Wires everything together: reads the address, picks the language, and
// shows either the overview or one lesson.
import { LESSONS } from './lessons/index.js';
import { parseRoute } from './engine/router.js';
import { loadProgress, markComplete } from './engine/progress.js';
import { loadLang, saveLang, t } from './engine/i18n.js';
import { renderHome } from './render/home.js';
import { renderLesson } from './render/lesson.js';
import { renderLangToggle } from './render/langToggle.js';
import { UI } from './i18n/ui.js';

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
const lessonIds = LESSONS.map((l) => l.id);

let lang = loadLang(storage, navigator.language);
const completed = new Set(loadProgress(storage).completed);
let current = null; // { id, lang, view } while a lesson is on screen

function setLang(next) {
  lang = next;
  saveLang(storage, lang);
  render();
}

function leaveLesson() {
  if (current) current.view.destroy();
  current = null;
}

function render() {
  renderLangToggle(langRoot, lang, setLang);
  brand.textContent = t(UI.courseTitle, lang).text;
  document.title = lang === 'ko' ? '상담사 라이프사이클 강의' : 'The Agent Lifecycle';

  const route = parseRoute(location.hash, lessonIds);
  if (route.view === 'home') {
    leaveLesson();
    renderHome(app, LESSONS, { completed: [...completed] }, lang);
    window.scrollTo(0, 0);
    return;
  }

  // Same lesson, same language: just move to the step in the address.
  if (current && current.id === route.id && current.lang === lang) {
    current.view.goTo(route.step);
    return;
  }

  // Same lesson in a new language: rebuild, but keep an open checkpoint.
  const restore = current && current.id === route.id ? current.view.snapshot() : undefined;
  leaveLesson();
  const lesson = LESSONS.find((l) => l.id === route.id);
  const view = renderLesson(app, lesson, route.step, lang, {
    restore,
    onNavigate: (href) => { location.hash = href; },
    onComplete: (id) => {
      completed.add(id);
      markComplete(storage, id);
    },
  });
  current = { id: route.id, lang, view };
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
