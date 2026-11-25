// "Which role are you preparing for?" — asked once on home (2026-11-25).
// Spec: docs/superpowers/specs/2026-11-25-role-select-sme-course-design.md §4.2, §7.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { ROLES, shouldAskRole } from './role.js';
import { ROLE_UI, ROLE_NAMES } from './role-data.js';

// Only on the bare home address, and only while nothing is saved or declined.
export function askRoleHere({ storage, href }) {
  const url = new URL(href);
  if (url.hash || url.searchParams.has('tour')) return false;
  return shouldAskRole(storage);
}

// Start screen first, then the role question, then the first-run tour.
export async function runFirstOpen({ startClosed, askRole, openSheet, startTour }) {
  await startClosed;
  if (askRole) await openSheet().closed;
  startTour();
}

let open = null;

// Opens the sheet; returns { closed }. A second call while open returns the open one.
export function openRoleSheet(doc, lang, opts = {}) {
  if (open && doc.contains(open.wrap)) return open.handle;
  const tr = (entry) => entry[lang] ?? entry.ko;
  let done;
  const closed = new Promise((resolve) => { done = resolve; });

  const buttons = ROLES.map((r) => h('button', { type: 'button', class: 'btn rs-role', 'data-pick-role': r, text: tr(ROLE_NAMES[r]) }));
  const later = h('button', { type: 'button', class: 'btn rs-later', 'data-role-later': true, text: tr(ROLE_UI.later) });
  const dialog = h('div', { class: 'rs-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'rs-title' }, [
    h('div', { class: 'rs-miso' }, [
      h('img', { src: new URL('../assets/miso/smile.webp', import.meta.url).href, alt: '', width: 72, height: 104 }),
      h('h2', { id: 'rs-title', text: tr(ROLE_UI.sheetTitle) }),
    ]),
    h('p', { class: 'rs-note', 'data-role-note': true, text: tr(ROLE_UI.sheetNote) }),
    h('div', { class: 'rs-roles' }, buttons),
    later,
  ]);
  const wrap = h('div', { class: 'rs-back', 'data-role-sheet': true }, [dialog]);

  // Everything behind the sheet is out of reach while it is open.
  const quieted = [];
  const close = (then) => {
    for (const el of quieted) el.removeAttribute('inert');
    wrap.remove();
    doc.removeEventListener('keydown', onKey);
    open = null;
    then?.();
    done();
  };
  const stops = [...buttons, later];
  function onKey(event) {
    if (event.key === 'Escape') { event.preventDefault(); close(opts.onLater); return; }
    if (event.key !== 'Tab') return;
    const at = stops.indexOf(doc.activeElement);
    event.preventDefault();
    const to = at === -1 ? 0 : (at + (event.shiftKey ? stops.length - 1 : 1)) % stops.length;
    stops[to].focus({ preventScroll: true });
  }
  for (const b of buttons) b.addEventListener('click', () => close(() => opts.onPick?.(b.dataset.pickRole)));
  later.addEventListener('click', () => close(opts.onLater));
  doc.addEventListener('keydown', onKey);
  for (const el of doc.body.children) {
    if (!el.hasAttribute('inert')) { el.setAttribute('inert', ''); quieted.push(el); }
  }
  doc.body.append(wrap);
  buttons[0].focus({ preventScroll: true });
  const handle = { closed };
  open = { wrap, handle };
  return handle;
}
