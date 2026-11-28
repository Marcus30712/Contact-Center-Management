// Settings page: follows the language choice shared with the rest of the site.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { localDate } from '../practice/engine.js';
import { SETTINGS_UI as UI } from './data.js';
import { renderSettings, newSettingsView } from './render.js';
import { refreshApp } from './update.js';

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
const view = newSettingsView();
let lang = loadLang(storage);
let offline = Boolean(navigator.serviceWorker?.controller);
let build = null;

function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setLang(next, focus) {
  lang = next;
  saveLang(storage, lang);
  draw();
  if (focus) langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  else app.querySelector(`[data-set-lang="${lang}"]`)?.focus();
}

function draw() {
  document.documentElement.lang = lang;
  document.title = t(UI.title, lang).text;
  renderLangToggle(langRoot, lang, (next) => setLang(next, true));
  renderSettings(app, lang, storage, view, {
    onLang: (next) => setLang(next, false),
    onRole: () => location.assign('../'),
    download,
    today: localDate(),
    offline,
    build,
    refresh: () => refreshApp({ online: navigator.onLine, caches: globalThis.caches, container: navigator.serviceWorker, fetch: (url, init) => fetch(url, init), reload: () => location.reload() }),
  });
}

draw();
// The build: the offline store is named cckb-<version>, one per deploy.
function readBuild() {
  return (globalThis.caches?.keys() ?? Promise.resolve([])).then((names) => {
    const name = names.filter((n) => n.startsWith('cckb-')).sort().pop();
    return name ? name.slice('cckb-'.length) : null;
  }).catch(() => null);
}
readBuild().then((b) => { if (b && b !== build) { build = b; draw(); } });
// On a first visit the worker finishes installing (and fills its store) after the page opens.
navigator.serviceWorker?.ready.then(async () => {
  const b = await readBuild();
  if (offline && b === build) return;
  offline = true;
  build = b ?? build;
  draw();
}).catch(() => {});
window.addEventListener('pageshow', (event) => {
  if (event.persisted) { lang = loadLang(storage); draw(); }
});
