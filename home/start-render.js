// The start screen: a full-page cover over home with Miso's greeting. It is a
// modal dialog: it takes focus itself, the page behind is inert, and Start, Enter or
// Esc close it. Nothing is stored. Rules: docs/superpowers/specs/2026-11-22-start-screen-design.md §4.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { renderLangToggle } from '../agent-lifecycle/js/render/langToggle.js';
import { START_UI as UI } from './start-data.js';

// renderStart(doc, lang, { greeting, offline: 'ready'|'wait'|null, onClose, onLang })
// → { close(), setOffline(state), setLang(lang), closed: Promise }
export function renderStart(doc, lang, { greeting, offline = null, onClose = () => {}, onLang = () => {} }) {
  let current = lang;
  let state = offline;
  let open = true;
  let resolveClosed;
  const closed = new Promise((resolve) => { resolveClosed = resolve; });
  const tr = (text) => t(text, current).text;

  const img = h('img', { class: 'st-miso', src: `./assets/miso/${greeting.face}.webp`, width: 157, height: 227 });
  const logo = h('h1', { class: 'st-logo', id: 'st-logo' });
  const tagline = h('p', { class: 'st-tagline', id: 'st-tagline' });
  const bubble = h('p', { class: 'st-bubble', id: 'st-greeting', 'data-start-greeting': true });
  const offlineLine = h('p', { class: 'st-offline', 'data-start-offline': true });
  const go = h('button', { type: 'button', class: 'btn primary st-go', 'data-start-go': true, onclick: () => close() });
  const langBox = h('div', { class: 'st-lang' });
  const box = h('div', {
    class: 'st-cover', 'data-start-screen': true, role: 'dialog', 'aria-modal': 'true', tabindex: '-1', 'aria-describedby': 'st-tagline st-greeting',
    onkeydown: (event) => {
      // Enter closes, except on the language buttons, where it switches language.
      // The key is used up here, so it cannot also press whatever gets focus
      // next (the tour's first Next button on a first visit).
      if (event.key === 'Escape' || (event.key === 'Enter' && !event.target.closest?.('[data-lang]'))) {
        event.preventDefault();
        close();
      }
    },
  }, [
    h('div', { class: 'st-inner' }, [img, logo, tagline, bubble, offlineLine, go, langBox]),
  ]);

  function paint() {
    box.setAttribute('aria-label', tr(UI.dialog));
    img.setAttribute('alt', tr(UI.misoAlt));
    logo.textContent = tr(UI.logo);
    tagline.textContent = tr(UI.tagline);
    bubble.textContent = tr(greeting.line);
    bubble.lang = current;
    go.textContent = tr(UI.start);
    offlineLine.hidden = !state;
    offlineLine.textContent = state === 'ready' ? tr(UI.offlineReady) : state === 'wait' ? tr(UI.offlineWait) : '';
    renderLangToggle(langBox, current, (next) => onLang(next));
  }

  // Everything else on the page is out of reach while the cover is up.
  const behind = new Set([...doc.body.children]);
  for (const el of behind) el.setAttribute('inert', '');
  // The app bar mounts separately (and redraws on a language switch): keep
  // whatever arrives while the cover is up out of reach too.
  const watch = new doc.defaultView.MutationObserver((records) => {
    for (const r of records) {
      for (const el of r.addedNodes) {
        if (el.nodeType === 1 && el !== box) { el.setAttribute('inert', ''); behind.add(el); }
      }
    }
  });
  watch.observe(doc.body, { childList: true });
  paint();
  doc.body.append(box);
  // The dialog itself takes focus: screen readers start at its name, and no
  // button shows a focus ring that nobody asked for.
  box.focus({ preventScroll: true });

  function close() {
    if (!open) return;
    open = false;
    watch.disconnect();
    box.remove();
    for (const el of behind) el.removeAttribute('inert');
    const heading = doc.querySelector('#app h1');
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    onClose();
    resolveClosed();
  }

  return {
    close,
    closed,
    setOffline(next) { state = next; if (open) paint(); },
    setLang(next) {
      current = next;
      if (!open) return;
      paint();
      langBox.querySelector(`[data-lang="${next}"]`)?.focus({ preventScroll: true });
    },
  };
}
