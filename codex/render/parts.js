// Small building blocks shared by the four one-pagers. The ideas (summary
// first, details on tap, numbered steps, before/after links) are common card
// patterns; the look is this site's own.
import { h } from '../../agent-lifecycle/js/render/dom.js';

let uid = 0;
const nextId = (prefix) => `${prefix}-${(uid += 1)}`;

// One status line outside the redrawn area, so screen readers hear a short
// summary of each choice instead of a whole new panel.
export function announce(text) {
  let status = document.getElementById('cx-status');
  if (!status) {
    status = h('p', { id: 'cx-status', class: 'visually-hidden', role: 'status' });
    document.body.append(status);
  }
  status.textContent = text;
}

// A row of toggle buttons. Arrow keys, Home and End move the choice.
export function tabs(items, current, onSelect, label) {
  const group = h('div', { class: 'cx-tabs', role: 'group', 'aria-label': label });
  const buttons = items.map((item) => h('button', {
    type: 'button', class: 'cx-tab', 'data-tab': item.id, 'aria-pressed': String(item.id === current),
    onclick: () => onSelect(item.id),
  }, item.label));
  group.addEventListener('keydown', (event) => {
    const at = buttons.indexOf(event.target);
    if (at === -1) return;
    const last = buttons.length - 1;
    const to = { ArrowRight: at === last ? 0 : at + 1, ArrowLeft: at === 0 ? last : at - 1, Home: 0, End: last }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    buttons[to].focus();
    onSelect(items[to].id);
  });
  group.append(...buttons);
  return group;
}

// A label that says its category in words; colour is extra.
export function chip(text, kind) {
  return h('span', { class: 'cx-chip', 'data-kind': kind, text });
}

// A card whose header button shows or hides the details below it.
export function expandCard({ id, chip: badge, number, title, summary, marker, body, open, onToggle }) {
  const bodyId = nextId(`cx-body-${id}`);
  const region = h('div', { class: 'cx-card-body', id: bodyId, 'data-body': true, hidden: !open }, body);
  const head = h('button', {
    type: 'button', class: 'cx-card-head', 'aria-expanded': String(Boolean(open)), 'aria-controls': bodyId,
  }, [
    number != null ? h('span', { class: 'cx-num', 'aria-hidden': 'true', text: String(number) }) : null,
    h('span', { class: 'cx-card-text' }, [
      badge || marker ? h('span', { class: 'cx-card-tags' }, [badge, marker]) : null,
      h('strong', { class: 'cx-card-title', text: title }),
      summary ? h('span', { class: 'cx-card-summary', text: summary }) : null,
    ]),
    h('span', { class: 'cx-caret', 'aria-hidden': 'true' }),
  ]);
  const card = h('section', { class: open ? 'cx-card is-open' : 'cx-card', 'data-card': id }, [head, region]);
  head.addEventListener('click', () => {
    const now = head.getAttribute('aria-expanded') !== 'true';
    head.setAttribute('aria-expanded', String(now));
    region.hidden = !now;
    card.classList.toggle('is-open', now);
    onToggle?.(now);
  });
  return card;
}

// Numbered steps joined by arrows (the arrows are drawn in CSS).
export function flow(steps) {
  return h('ol', { class: 'cx-flow' }, steps.map((text) => h('li', { text })));
}

// "Good to see before / next" links at the foot of a page.
export function relatedLinks(links, tr, ui) {
  const groups = ['before', 'after']
    .map((dir) => [dir, links.filter((l) => l.dir === dir)])
    .filter(([, list]) => list.length);
  return h('nav', { class: 'cx-related', 'aria-label': `${tr(ui.before)} / ${tr(ui.after)}` }, groups.map(([dir, list]) => (
    h('div', { class: 'cx-related-group', 'data-related-group': dir }, [
      h('h2', { text: tr(ui[dir]) }),
      h('ul', {}, list.map((l) => h('li', {}, [
        h('a', { href: l.href, 'data-related': l.href }, [h('strong', { text: tr(l.title) }), h('span', { text: tr(l.why) })]),
      ]))),
    ])
  )));
}
