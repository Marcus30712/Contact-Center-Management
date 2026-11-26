// Agent First Steps' first screen: the eight lessons as one numbered list (2026-11-26).
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { lessonHref } from '../agent-lifecycle/js/engine/router.js';
import { AGENT_UI } from './ui.js';

export function renderAgentHome(root, lessons, progress, lang) {
  const tr = (text) => t(text, lang).text;
  const done = new Set(progress.completed);
  document.documentElement.lang = lang;

  const card = (l) => h('li', {}, [
    h('a', { href: lessonHref(l.id, 0), 'data-agent': l.id, class: done.has(l.id) ? 'stage-card is-done' : 'stage-card' }, [
      h('span', { class: 'stage-card-num', text: String(l.order) }),
      h('span', { class: 'stage-card-text' }, [
        h('strong', { text: tr(l.title) }),
        h('span', { text: tr(l.subtitle) }),
      ]),
      h('span', { class: 'stage-card-done', 'data-done': true, text: done.has(l.id) ? `✓ ${tr(AGENT_UI.done)}` : '' }),
    ]),
  ]);

  root.replaceChildren(
    h('header', { class: 'home-head' }, [
      h('h1', { text: tr(AGENT_UI.courseTitle) }),
      h('p', { class: 'tagline', text: tr(AGENT_UI.courseTagline) }),
      h('p', { class: 'track-hint', 'data-list-note': true, text: tr(AGENT_UI.listNote) }),
    ]),
    h('ol', { class: 'stage-list sop-list', 'data-agent-list': true }, [...lessons].sort((a, b) => a.order - b.order).map(card)),
  );
}
