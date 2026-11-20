// Team Lead Situation Guide: chips pick a group; each situation opens to two
// links into the rest of Queuecraft.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { tabs, expandCard } from '../codex/render/parts.js';
import { GUIDE_UI as UI, GROUPS } from './data.js';

const MISO_ALT = { ko: '김미소, 생각하는 얼굴', en: 'Miso Kim, thinking' };

export function newGuideState() {
  return { group: 'all', open: new Set(), status: '', statusLang: null };
}

export function renderGuide(root, lang, state) {
  const tr = (text) => t(text, lang).text;
  const redraw = (focus) => {
    renderGuide(root, lang, state);
    if (focus) root.querySelector(focus)?.focus();
  };
  const go = (kind, link) => h('li', {}, [
    h('a', { href: link.href, 'data-go': kind }, [
      h('span', { class: 'gd-kind', text: tr(UI[kind]) }),
      // Screen readers would otherwise run the two parts together.
      h('span', { class: 'visually-hidden', text: ': ' }),
      h('strong', { text: tr(link.title) }),
    ]),
  ]);
  let number = 0;
  // One status line for screen readers, outside the redrawn area, so a new
  // text is announced. It is filled only when a chip is chosen, and cleared
  // when the language changes.
  if (state.statusLang && state.statusLang !== lang) state.status = '';
  let status = document.querySelector('[data-status]');
  if (!status) {
    status = h('p', { class: 'visually-hidden', role: 'status', 'data-status': true });
    document.body.append(status);
  }
  if (status.textContent !== (state.status ?? '')) status.textContent = state.status ?? '';

  root.replaceChildren(
    h('header', { class: 'glossary-head gd-head' }, [
      h('img', { src: '../assets/miso/think.webp', alt: tr(MISO_ALT), width: 157, height: 227, 'data-miso': 'think' }),
      h('div', {}, [h('h1', { text: tr(UI.title) }), h('p', { class: 'tagline', text: tr(UI.intro) })]),
    ]),
    tabs([{ id: 'all', label: tr(UI.all) }, ...GROUPS.map((g) => ({ id: g.id, label: tr(g.chip) }))], state.group, (id) => {
      state.group = id;
      const chosen = GROUPS.find((g) => g.id === id);
      const n = chosen ? chosen.situations.length : GROUPS.reduce((sum, g) => sum + g.situations.length, 0);
      state.status = tr(UI.shown).replace('{group}', tr(chosen ? chosen.chip : UI.all)).replace('{n}', String(n));
      state.statusLang = lang;
      redraw(`[data-tab="${id}"]`);
    }, tr(UI.chips)),
    ...GROUPS.map((g) => h('section', { class: 'gd-group', 'data-group': g.id, hidden: state.group !== 'all' && state.group !== g.id }, [
      h('h2', { class: 'cx-sub', text: tr(g.heading) }),
      h('div', { class: 'cx-cards' }, g.situations.map((s) => {
        number += 1;
        return expandCard({
          id: s.id, number, title: tr(s.text), open: state.open.has(s.id),
          onToggle: (open) => (open ? state.open.add(s.id) : state.open.delete(s.id)),
          body: [h('ul', { class: 'gd-go' }, [go('first', s.first), go('then', s.then)])],
        });
      })),
    ])),
  );
}
