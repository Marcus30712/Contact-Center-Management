// ① Four optimization principles: four cards, each opening to
// problem → optimization → in practice.
import { h } from '../../agent-lifecycle/js/render/dom.js';
import { t } from '../../agent-lifecycle/js/engine/i18n.js';
import { CODEX_UI as UI } from '../ui.js';
import { PRINCIPLES } from '../data/principles.js';
import { expandCard, chip } from './parts.js';

export function principlesBody(lang, state, redraw) {
  const tr = (text) => t(text, lang).text;
  const setAll = (open) => {
    state.principles = new Set(open ? PRINCIPLES.items.map((p) => p.id) : []);
    redraw(open ? '[data-expand-all]' : '[data-collapse-all]');
  };
  const part = (kind, label, text) => h('div', { class: 'cx-part', 'data-part': kind }, [chip(tr(label), kind), h('p', { text: tr(text) })]);
  return [
    h('div', { class: 'cx-intro' }, [h('p', { text: tr(PRINCIPLES.intro) }), h('p', { class: 'cx-note', text: tr(PRINCIPLES.note) })]),
    h('div', { class: 'cx-actions' }, [
      h('button', { type: 'button', class: 'btn', 'data-expand-all': true, onclick: () => setAll(true), text: tr(UI.expandAll) }),
      h('button', { type: 'button', class: 'btn', 'data-collapse-all': true, onclick: () => setAll(false), text: tr(UI.collapseAll) }),
    ]),
    h('div', { class: 'cx-cards' }, PRINCIPLES.items.map((p, i) => expandCard({
      id: p.id, number: i + 1, title: tr(p.title), open: state.principles.has(p.id),
      onToggle: (open) => (open ? state.principles.add(p.id) : state.principles.delete(p.id)),
      body: [h('div', { class: 'cx-steps' }, [
        part('problem', UI.problem, p.problem), part('fix', UI.fix, p.fix), part('example', UI.example, p.example),
      ])],
    }))),
  ];
}
