// The SOP Library's first screen: a numbered list in two groups, since
// procedures are a list to work through, not a cycle.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { lessonHref } from '../agent-lifecycle/js/engine/router.js';
import { SOP_UI } from './ui.js';

const GROUPS = [['leader', SOP_UI.groupLeader], ['cross', SOP_UI.groupCross]];

export function renderSopHome(root, lessons, progress, lang) {
  const tr = (text) => t(text, lang).text;
  const done = new Set(progress.completed);
  document.documentElement.lang = lang;

  const card = (l) => h('li', {}, [
    h('a', { href: lessonHref(l.id, 0), 'data-sop': l.id, class: done.has(l.id) ? 'stage-card is-done' : 'stage-card' }, [
      h('span', { class: 'stage-card-num', text: String(l.order) }),
      h('span', { class: 'stage-card-text' }, [
        h('strong', { text: tr(l.title) }),
        h('span', { text: tr(l.subtitle) }),
        h('span', { class: 'sop-roles', 'data-roles': true, text: `${tr(SOP_UI.rolesLabel)}: ${tr(l.roles)}` }),
      ]),
      h('span', { class: 'stage-card-done', 'data-done': true, text: done.has(l.id) ? `✓ ${tr(SOP_UI.done)}` : '' }),
    ]),
  ]);

  root.replaceChildren(
    h('header', { class: 'home-head' }, [
      h('h1', { text: tr(SOP_UI.courseTitle) }),
      h('p', { class: 'tagline', text: tr(SOP_UI.courseTagline) }),
      h('p', { class: 'track-hint', 'data-list-note': true, text: tr(SOP_UI.listNote) }),
    ]),
    ...GROUPS.flatMap(([group, label]) => {
      const items = lessons.filter((l) => l.group === group);
      if (items.length === 0) return [];
      return [
        h('h2', { class: 'sop-group', 'data-group': group, text: tr(label) }),
        // `start` keeps the numbering running across the two groups.
        h('ol', { class: 'stage-list sop-list', 'data-sop-list': true, start: items[0].order }, items.map(card)),
      ];
    }),
  );
}
