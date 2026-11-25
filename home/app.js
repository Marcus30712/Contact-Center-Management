// Home page: follows the shared language choice and redraws "my learning"
// whenever the page is shown again (for example after finishing a lesson).
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { HOME_UI as UI } from './data.js';
import { renderHome } from './render.js';
import { whenAppBar, shouldStartTour, startTour } from '../shared/tour.js';
import { pickGreeting, shouldShowStart, watchOffline } from './start.js';
import { renderStart } from './start-render.js';
import { saveRole, markRoleAsked, loadRole } from '../shared/role.js';
import { openRoleSheet, askRoleHere, runFirstOpen } from '../shared/role-sheet.js';

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
  renderHome(app, lang, storage, undefined, loadRole(storage));
}

let day = new Date().toDateString();
draw();

// The start screen when the app is opened at home: Miso greets by time and weekday.
let start = null;
const navType = performance.getEntriesByType?.('navigation')?.[0]?.type;
if (shouldShowStart({ href: location.href, referrer: document.referrer, navType })) {
  start = renderStart(document, lang, {
    greeting: pickGreeting(new Date()),
    offline: null,
    onLang: (next) => {
      lang = next;
      saveLang(storage, lang);
      draw();
      start.setLang(lang);
    },
  });
  watchOffline(navigator.serviceWorker, (state) => start.setOffline(state));
}

// First visit (or "Replay the tutorial" in Settings): walk the bottom menu once,
// after the start screen (if any) and the role question have closed.
// Before the tour, ask once which role the learner is preparing for.
const askRole = askRoleHere({ storage, href: location.href });
runFirstOpen({
  startClosed: whenAppBar(document).then(() => start?.closed),
  askRole,
  openSheet: () => openRoleSheet(document, lang, {
    onPick: (role) => { saveRole(storage, role); draw(); },
    onLater: () => markRoleAsked(storage),
  }),
  startTour: () => {
    if (!shouldStartTour(storage, location.href)) return;
    const url = new URL(location.href);
    if (url.searchParams.has('tour')) {
      url.searchParams.delete('tour');
      history.replaceState(history.state, '', url.href);
    }
    startTour(document, lang, storage);
  },
});
// A home screen left open past midnight shows the new day's practice.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && new Date().toDateString() !== day) { day = new Date().toDateString(); draw(); }
});
// Coming back with the browser's back button can show a cached page; refresh the numbers.
window.addEventListener('pageshow', (event) => { if (event.persisted) draw(); });
