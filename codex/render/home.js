// The Codex one-pagers list.
import { h } from '../../agent-lifecycle/js/render/dom.js';
import { t } from '../../agent-lifecycle/js/engine/i18n.js';
import { CODEX_UI as UI, PAGES } from '../ui.js';

export function renderCodexHome(root, lang) {
  const tr = (text) => t(text, lang).text;
  root.replaceChildren(
    h('header', { class: 'glossary-head' }, [
      h('h1', { text: tr(UI.title) }),
      h('p', { class: 'tagline', text: tr(UI.tagline) }),
    ]),
    h('ol', { class: 'cx-pages' }, PAGES.map((p, i) => h('li', {}, [
      h('a', { class: 'cx-page-card', href: `#${p.id}`, 'data-page': p.id }, [
        h('span', { class: 'cx-num', 'aria-hidden': 'true', text: String(i + 1) }),
        h('span', { class: 'cx-card-text' }, [h('strong', { text: tr(p.title) }), h('span', { text: tr(p.blurb) })]),
      ]),
    ]))),
    h('p', { class: 'cx-source', 'data-source': true }, [tr(UI.source), ' ', h('a', { href: '../references/', text: '→' })]),
  );
}
