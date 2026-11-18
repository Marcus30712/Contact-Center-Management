// Wires everything together: reads the address, picks the language, and
// shows either the overview or one lesson.
import { LESSONS } from './lessons/index.js';
import { parseRoute } from './engine/router.js';
import { loadProgress, markComplete } from './engine/progress.js';
import { loadLang, saveLang, t } from './engine/i18n.js';
import { loadTrack, saveTrack, switchIndex } from './engine/track.js';
import { lessonHref } from './engine/router.js';
import { renderHome } from './render/home.js';
import { renderLesson } from './render/lesson.js';
import { renderLangToggle } from './render/langToggle.js';
import { renderTrackToggle } from './render/trackToggle.js';
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
const trackRoot = document.getElementById('track');
const brand = document.getElementById('brand');
const lessonIds = LESSONS.map((l) => l.id);

let lang = loadLang(storage, navigator.language);
let track = loadTrack(storage);
const completed = new Set(loadProgress(storage).completed);
let current = null; // { id, lang, track, view } while a lesson is on screen

function setLang(next) {
  lang = next;
  saveLang(storage, lang);
  render();
}

// Switching track mid-lesson lands on the nearest common step, and the
// address follows without adding a history entry.
function setTrack(next) {
  if (current) {
    const lesson = LESSONS.find((l) => l.id === current.id);
    const href = lessonHref(lesson.id, switchIndex(lesson, track, current.view.snapshot().step, next));
    try {
      history.replaceState(null, '', href);
    } catch {
      location.hash = href;
    }
  }
  track = next;
  saveTrack(storage, track);
  render();
}

function leaveLesson() {
  if (current) current.view.destroy();
  current = null;
}

function render() {
  renderLangToggle(langRoot, lang, setLang);
  renderTrackToggle(trackRoot, track, lang, setTrack);
  brand.textContent = t(UI.courseTitle, lang).text;
  document.title = lang === 'ko' ? '상담사 라이프사이클 강의' : 'The Agent Lifecycle';

  const route = parseRoute(location.hash, lessonIds);
  if (route.view === 'home') {
    leaveLesson();
    renderHome(app, LESSONS, { completed: [...completed] }, lang);
    window.scrollTo(0, 0);
    return;
  }

  // Same lesson, language and track: just move to the step in the address.
  if (current && current.id === route.id && current.lang === lang && current.track === track) {
    current.view.goTo(route.step);
    return;
  }

  // Same lesson in a new language or track: rebuild, but keep an open checkpoint.
  const restore = current && current.id === route.id ? current.view.snapshot() : undefined;
  leaveLesson();
  const lesson = LESSONS.find((l) => l.id === route.id);
  const view = renderLesson(app, lesson, route.step, lang, {
    restore,
    track,
    onNavigate: (href) => { location.hash = href; },
    onComplete: (id) => {
      completed.add(id);
      markComplete(storage, id);
    },
  });
  current = { id: route.id, lang, track, view };
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
