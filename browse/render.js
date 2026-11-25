// The Browse page (2026-11-25): reference material, reached from the bottom menu.
// Wording: docs/superpowers/specs/2026-11-25-role-home-copy.md §5; cards: home/data.js BROWSE.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { BROWSE } from '../home/data.js';

export const BROWSE_UI = {
  title: { ko: '찾아보기', en: 'Browse' },
  intro: { ko: '필요할 때 꺼내 보는 자료입니다: Codex 원페이저, 인력 산정 실험실, 용어집, 참고 자료.', en: 'Material to pull up when you need it: the Codex One-Pagers, Staffing Lab, Glossary and References.' },
};

export function renderBrowse(root, lang) {
  const tr = (text) => t(text, lang).text;
  root.replaceChildren(
    h('header', { class: 'hm-head' }, [
      h('h1', { text: tr(BROWSE_UI.title) }),
      h('p', { class: 'hm-tagline', 'data-intro': true, text: tr(BROWSE_UI.intro) }),
    ]),
    // The cards are written for home (./x/); from this page they are one folder up.
    h('ul', { class: 'hm-cards' }, BROWSE.map((c) => h('li', {}, [
      h('a', { class: 'card', href: `.${c.href}` }, [h('strong', { text: tr(c.title) }), h('span', { text: tr(c.text) })]),
    ]))),
  );
}
