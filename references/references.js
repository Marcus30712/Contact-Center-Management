// References page: what the Knowledge Base is built on and what it credits.
import { loadLang, saveLang, t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { h } from '../agent-lifecycle/js/render/dom.js';
import { REFERENCES_TEXT as T, PYWORKFORCE_URL, CODEX_PDF } from './text.js';

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
  const tr = (text) => t(text, lang).text;
  document.documentElement.lang = lang;
  document.title = tr(T.title);
  renderLangToggle(langRoot, lang, (next) => {
    lang = next;
    saveLang(storage, lang);
    draw();
    langRoot.querySelector(`[data-lang="${lang}"]`)?.focus();
  });
  const section = (heading, children) => h('section', { class: 'ref-section' }, [h('h2', { text: tr(heading) }), ...children]);
  app.replaceChildren(
    h('header', { class: 'glossary-head' }, [
      h('a', { class: 'home-link', 'data-back': true, href: '../', text: `← ${tr(T.back)}` }),
      h('h1', { text: tr(T.title) }),
      h('p', { class: 'tagline', text: tr(T.intro) }),
    ]),
    section(T.basisHeading, [
      h('p', { text: tr(T.codex) }),
      h('p', {}, [h('a', { 'data-codex-pdf': true, href: CODEX_PDF, text: tr(T.codexLink) })]),
    ]),
    section(T.openHeading, [
      h('p', { text: tr(T.pyworkforce) }),
      h('p', {}, [h('a', { href: PYWORKFORCE_URL, rel: 'noopener', text: tr(T.pyworkforceLink) })]),
    ]),
    section(T.noteHeading, [
      h('p', { text: tr(T.countryNote) }),
      h('p', { text: tr(T.licenseNote) }),
    ]),
  );
}

draw();
